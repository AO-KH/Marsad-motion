#!/usr/bin/env bash
# Rebuild the MARSAD campaign film (63 s, website style) end to end: audio stems -> mix -> master -> motion-blurred
# frames -> MP4 -> QA.
# usage: ./build.sh [out/marsad-film.mp4]      (needs ffmpeg, python3 + numpy + Pillow, node + playwright, chromium)
#        SUB=1 for a fast draft without motion blur (never delivered); JOBS=<n> parallel pages (default 4)
#        on Windows (Git Bash) where Python is 'python':  PYTHON=python bash build.sh
set -euo pipefail
cd "$(dirname "$0")"
PY=${PYTHON:-python3}
OUT=${1:-out/marsad-film.mp4}
JOBS=${JOBS:-4}
SUB=${SUB:-4}
CHUNK=150
N=1890                                            # 63 s at 30 fps
D=frames/film63-web-16x9                          # its own folder: frames/ holds the other films' frames too
mkdir -p out
# 1) music source: 48 kHz stereo PCM (the beat grid was measured on this decode)
[ -f fit/stylish.wav ] || ffmpeg -loglevel error -y -i fit/stylish.mp3 -ar 48000 -ac 2 -c:a pcm_s16le fit/stylish.wav
# 2) SFX + voice stems (every transition and voice phrase placed on the beat grid; the voice: tools/make_vo.py)
VO=1 $PY audio_stems.py | tail -1
# 3) mix with the fitted music bed, then two-pass loudnorm to -14 LUFS / -1.5 dBTP
$PY mix_final.py stem_rh out/mix.wav
J=$(ffmpeg -hide_banner -nostats -i out/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
set -- $(echo "$J" | $PY -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -loglevel error -y -i out/mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" -ar 48000 out/mix_master.wav
# 4) frames: each blended from SUB sub-frames across a 180° shutter (render_mb.js, tools/blend.py), in chunks of 150 so
#    few sub-frames sit on disk at once; then the fast moves again with 16 samples, which 4 leave in steps: the frames
#    where the picture changes by more than 5 (tools/fast_ranges.py's measure on the MP4). After a change of timing,
#    find them again with
#    python3 -c "import sys; sys.path.insert(0,'tools'); import fast_ranges as f; print(f.ranges('out/marsad-film.mp4',5)[0])"
FAST=${FAST:-"343-351 609-621 823-840 1079-1087 1235-1252 1453-1464 1474-1486 1659-1684 1798-1806 1877-1890"}
rm -rf "$D"
if [ "$SUB" -gt 1 ]; then
  for ((A = 0; A < N; A += CHUNK)); do
    node render_mb.js "$JOBS" film.html "$D" "$SUB" "$A" "$((A + CHUNK))"
    $PY tools/blend.py "$D"
  done
  for R in $FAST; do
    node render_mb.js "$JOBS" film.html "$D" 16 "${R%-*}" "${R#*-}"
    $PY tools/blend.py "$D"
  done
else
  node render_full.js "$JOBS" film.html "$D"
fi
# 5) mux: AAC at 320k without noise substitution (as build_demo.sh: QA measures the true peak on the MP4); under 29 MB
CRF=20
while :; do
  ffmpeg -loglevel error -y -framerate 30 -i "$D/f_%04d.jpg" -i out/mix_master.wav -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -aac_pns 0 -movflags +faststart -shortest "$OUT"
  MB=$(( $(wc -c < "$OUT") / 1000000 ))
  if [ "$MB" -lt 29 ] || [ "$CRF" -ge 30 ]; then break; fi
  CRF=$((CRF + 1)); echo "$OUT is $MB MB (over 29): again at crf $CRF"
done
echo "done: $OUT ($MB MB, crf $CRF)"
# 6) QA: pace, shake (must be 0), loudness and true peak, and a contact sheet in style_audit/
$PY tools/qa.py "$OUT" --sheet 24 || echo "QA flagged $OUT (see above)"
