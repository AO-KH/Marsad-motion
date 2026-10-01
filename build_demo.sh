#!/usr/bin/env bash
# Build a Marsad demo video from demos/<slug>/:  page(s) -> fitted music -> frames -> MP4, then the QA check.
# usage: ./build_demo.sh <slug> [16x9|9x16|all]       -> out/<slug>-16x9.mp4, out/<slug>-9x16.mp4
#        SUB=1 ./build_demo.sh <slug>                   a fast draft without motion blur (about 4x quicker), at 1080p
#        ONLY=audio ./build_demo.sh <slug>              redo the audio, the mux and QA on the frames already rendered
#        SCALE=1 ./build_demo.sh <slug>                 a final at 1080p. Finals are 4K (SCALE=2, 3840x2160): the client
#                                                       found 1080p soft ("the resolution is bad here")
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash build_demo.sh <slug>
# Finals render in chunks of CHUNK frames (default 150), each blended before the next, so 4K sub-frames never fill the
# disk. The MP4 stays under MAXMB decimal MB (default 29, to send it in chat): the crf goes up from 20 until it fits.
set -euo pipefail
cd "$(dirname "$0")"
SLUG=${1:?usage: ./build_demo.sh <slug> [16x9|9x16|all]}
WANT=${2:-all}
PY=${PYTHON:-python3}
JOBS=${JOBS:-4}                                   # parallel headless pages per render
SUB=${SUB:-4}                                     # motion blur: sub-frames per frame (final). SUB=1: a fast draft, no blur
if [ "$SUB" -gt 1 ]; then SCALE=${SCALE:-2}; else SCALE=${SCALE:-1}; fi
export SCALE                                      # render_mb.js / render_full.js: the device scale (2 = 4K)
CHUNK=${CHUNK:-150}
MAXMB=${MAXMB:-29}
$PY tools/make_demo.py "$SLUG"
$PY tools/music_fit.py "$SLUG"
N=$($PY -c "import sys; sys.path.insert(0, 'tools'); import make_demo; d, m, f = make_demo.load('$SLUG'); print(round(float(m['duration']) * 30))")
for F in $($PY tools/make_demo.py "$SLUG" --formats); do
  [ "$WANT" = all ] || [ "$WANT" = "$F" ] || continue
  if [ "${ONLY:-}" = audio ] && [ -f "frames/$SLUG-$F/f_0001.jpg" ]; then
    echo "reusing frames/$SLUG-$F (ONLY=audio)"
  else
  rm -rf "frames/$SLUG-$F"
  if [ "$SUB" -gt 1 ]; then
    for ((A = 0; A < N; A += CHUNK)); do
      node render_mb.js "$JOBS" "build/$SLUG-$F.html" "frames/$SLUG-$F" "$SUB" "$A" "$((A + CHUNK))"
      $PY tools/blend.py "frames/$SLUG-$F"
    done
  else
    node render_full.js "$JOBS" "build/$SLUG-$F.html" "frames/$SLUG-$F"
  fi
  fi
  CRF=${CRF:-20}
  while :; do
    ffmpeg -loglevel error -y -framerate 30 -i "frames/$SLUG-$F/f_%04d.jpg" -i "out/$SLUG-music.wav" -map 0:v -map 1:a \
      -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart -shortest \
      "out/$SLUG-$F.mp4"
    MB=$(( $(wc -c < "out/$SLUG-$F.mp4") / 1000000 ))   # decimal MB, as the chat's 30 MB limit counts them
    if [ "$MB" -lt "$MAXMB" ] || [ "$CRF" -ge 30 ]; then break; fi
    CRF=$((CRF + 1)); echo "out/$SLUG-$F.mp4 is $MB MB (over $MAXMB): again at crf $CRF"
  done
  echo "done: out/$SLUG-$F.mp4 ($MB MB, crf $CRF, scale $SCALE)"
  $PY tools/qa.py "out/$SLUG-$F.mp4" --slug "$SLUG" || echo "QA flagged out/$SLUG-$F.mp4 (see above)"
done
