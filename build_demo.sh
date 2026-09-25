#!/usr/bin/env bash
# Build a Marsad demo video from demos/<slug>/:  page(s) -> fitted music -> frames -> MP4, then the QA check.
# usage: ./build_demo.sh <slug> [16x9|9x16|all]       -> out/<slug>-16x9.mp4, out/<slug>-9x16.mp4
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash build_demo.sh <slug>
set -euo pipefail
cd "$(dirname "$0")"
SLUG=${1:?usage: ./build_demo.sh <slug> [16x9|9x16|all]}
WANT=${2:-all}
PY=${PYTHON:-python3}
JOBS=${JOBS:-4}                                   # parallel headless pages per render
$PY tools/make_demo.py "$SLUG"
$PY tools/music_fit.py "$SLUG"
for F in $($PY tools/make_demo.py "$SLUG" --formats); do
  [ "$WANT" = all ] || [ "$WANT" = "$F" ] || continue
  rm -rf "frames/$SLUG-$F"
  node render_full.js "$JOBS" "build/$SLUG-$F.html" "frames/$SLUG-$F"
  ffmpeg -loglevel error -y -framerate 30 -i "frames/$SLUG-$F/f_%04d.jpg" -i "out/$SLUG-music.wav" -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart -shortest \
    "out/$SLUG-$F.mp4"
  echo "done: out/$SLUG-$F.mp4"
  $PY tools/qa.py "out/$SLUG-$F.mp4" --slug "$SLUG" || echo "QA flagged out/$SLUG-$F.mp4 (see above)"
done
