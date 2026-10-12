#!/usr/bin/env bash
# Rebuild the 54-second "Know. Watch. Decide." film: film54.html -> motion-blurred frames -> the cut's own music -> MP4 -> QA.
# usage: ./build54.sh [out/marsad-54s.mp4]      (needs ffmpeg, node + playwright, chromium, python3 with numpy and Pillow)
#        SUB=1 for a fast draft without motion blur (never delivered); JOBS=<n> parallel pages (default 4)
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash build54.sh
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-out/marsad-54s.mp4}
PY=${PYTHON:-python3}
JOBS=${JOBS:-4}
SUB=${SUB:-4}
CHUNK=150
N=1620                                            # 54 s at 30 fps
D=frames/film54-16x9
mkdir -p out
# 1) the page (film54.html is generated from film54_src/ + engine pieces of film.html, and the app's pages' boxes)
$PY make_film54.py
# 2) music: the original track from the dark cut, decoded and normalised to -14 LUFS / -1.5 dBTP (two-pass, linear)
ffmpeg -loglevel error -y -i fit/music54.m4a -ar 48000 -ac 2 -c:a pcm_s16le fit/music54.wav
J=$(ffmpeg -hide_banner -nostats -i fit/music54.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
set -- $(echo "$J" | $PY -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -loglevel error -y -i fit/music54.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" -ar 48000 out/music54_master.wav
# 3) frames: each blended from SUB sub-frames across a 180° shutter (render_mb.js, tools/blend.py), in chunks of 150 so
#    few sub-frames sit on disk at once; then the fast moves again with 16 samples, which 4 leave in steps (the window's
#    pushes in and out, the sources gliding in, the words converging into the mark): the frames where the picture
#    changes by more than 5 (tools/fast_ranges.py's measure on the MP4). After a change of timing, find them again with
#    python3 -c "import sys; sys.path.insert(0,'tools'); import fast_ranges as f; print(f.ranges('out/marsad-54s.mp4',5)[0])"
FAST=${FAST:-"295-311 324-343 378-391 516-531 601-619 839-853 904-929 1043-1055 1198-1206"}
rm -rf "$D"
if [ "$SUB" -gt 1 ]; then
  for ((A = 0; A < N; A += CHUNK)); do
    node render_mb.js "$JOBS" film54.html "$D" "$SUB" "$A" "$((A + CHUNK))"
    $PY tools/blend.py "$D"
  done
  for R in $FAST; do
    node render_mb.js "$JOBS" film54.html "$D" 16 "${R%-*}" "${R#*-}"
    $PY tools/blend.py "$D"
  done
else
  node render_full.js "$JOBS" film54.html "$D"
fi
# 4) mux: AAC at 320k without noise substitution (as build_demo.sh: QA measures the true peak on the MP4); under 29 MB
CRF=20
while :; do
  ffmpeg -loglevel error -y -framerate 30 -i "$D/f_%04d.jpg" -i out/music54_master.wav -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -aac_pns 0 -movflags +faststart -shortest "$OUT"
  MB=$(( $(wc -c < "$OUT") / 1000000 ))
  if [ "$MB" -lt 29 ] || [ "$CRF" -ge 30 ]; then break; fi
  CRF=$((CRF + 1)); echo "$OUT is $MB MB (over 29): again at crf $CRF"
done
echo "done: $OUT ($MB MB, crf $CRF)"
# 5) QA: pace, shake (must be 0), loudness and true peak, and a contact sheet in style_audit/
$PY tools/qa.py "$OUT" --sheet 24 || echo "QA flagged $OUT (see above)"
