#!/usr/bin/env bash
# Rebuild the 54-second "Know. Watch. Decide." film: frames from film54.html + the cut's own music.
# usage: ./build54.sh [out/marsad-54s.mp4]      (needs ffmpeg, node + playwright, chromium; python3 only to edit/rebuild the page)
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-out/marsad-54s.mp4}
PY=${PYTHON:-python3}
mkdir -p out
# 1) the page (film54.html is generated from film54_src/ + engine pieces of film.html)
$PY make_film54.py
# 2) music: the original track from the dark cut, decoded and normalised to -14 LUFS / -1.5 dBTP (two-pass, linear)
ffmpeg -loglevel error -y -i fit/music54.m4a -ar 48000 -ac 2 -c:a pcm_s16le fit/music54.wav
J=$(ffmpeg -hide_banner -nostats -i fit/music54.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
set -- $(echo "$J" | $PY -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -loglevel error -y -i fit/music54.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" -ar 48000 out/music54_master.wav
# 3) frames: 1620 JPEGs from 4 parallel headless pages
rm -rf frames54 && node render_full.js 4 film54.html frames54
# 4) mux
ffmpeg -loglevel error -y -framerate 30 -i frames54/f_%04d.jpg -i out/music54_master.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart -shortest "$OUT"
echo "done: $OUT"
