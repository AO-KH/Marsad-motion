#!/usr/bin/env bash
# Rebuild the MARSAD campaign film end to end: audio stems -> mix -> master -> frames -> MP4.
# usage: ./build.sh [out/marsad-film.mp4]      (needs ffmpeg, python3 + numpy, node + playwright, chromium)
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash build.sh
set -euo pipefail
cd "$(dirname "$0")"
PY=${PYTHON:-python3}
OUT=${1:-out/marsad-film.mp4}
mkdir -p out
# 1) music source: 48 kHz stereo PCM (the beat grid was measured on this decode)
[ -f fit/stylish.wav ] || ffmpeg -loglevel error -y -i fit/stylish.mp3 -ar 48000 -ac 2 -c:a pcm_s16le fit/stylish.wav
# 2) SFX + voice stems (every hit and voice phrase placed on the beat grid)
VO=1 $PY audio_stems.py | tail -1
# 3) mix with the fitted music bed, then two-pass loudnorm to -14 LUFS / -1.5 dBTP
$PY mix_final.py stem_rh out/mix.wav
J=$(ffmpeg -hide_banner -nostats -i out/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
set -- $(echo "$J" | $PY -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -loglevel error -y -i out/mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" -ar 48000 out/mix_master.wav
# 4) frames: 1890 JPEGs from 4 parallel headless pages (~3 min)
rm -rf frames && node render_full.js 4 film.html frames
# 5) mux (crf 20 keeps it around 20 MB, under the 30 MB chat-upload limit)
ffmpeg -loglevel error -y -framerate 30 -i frames/f_%04d.jpg -i out/mix_master.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart -shortest "$OUT"
echo "done: $OUT"
