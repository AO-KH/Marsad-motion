#!/usr/bin/env bash
# Build the Marsad Monitor film: pages -> motion-blurred frames -> score -> MP4 -> QA.
# usage: films/monitor/build.sh [cut ...]       default: hero-9x16 (the master); the cuts: python3 films/monitor/make.py --list
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash films/monitor/build.sh
#        SUB=1 for a fast draft without motion blur; JOBS=<n> parallel pages (default 4)
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=${PYTHON:-python3}
JOBS=${JOBS:-4}
SUB=${SUB:-4}
CUTS=("$@"); [ ${#CUTS[@]} -gt 0 ] || CUTS=(hero-9x16)
$PY films/monitor/make.py "${CUTS[@]}"
$PY films/monitor/audio.py
for C in "${CUTS[@]}"; do
  KIND=${C%%-*}                                    # hero | bumper
  node render_mb.js "$JOBS" "build/monitor-$C.html" "frames/monitor-$C" "$SUB"
  $PY tools/blend.py "frames/monitor-$C"
  ffmpeg -loglevel error -y -framerate 30 -i "frames/monitor-$C/f_%04d.jpg" -i "out/monitor-$KIND.wav" -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart -shortest \
    "out/monitor-$C.mp4"
  echo "done: out/monitor-$C.mp4"
  if [ "$KIND" = bumper ]; then CL=1.5,2,3.5; else CL=1.5,3,3.5,5,7,8.5,10,11; fi
  $PY tools/qa.py "out/monitor-$C.mp4" --cuts "$CL" --sheet 24 || echo "QA flagged out/monitor-$C.mp4 (see above)"
done
