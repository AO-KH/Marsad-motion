"""Fit a demo's music to its length: out/<slug>-music.wav (48 kHz stereo, -14 LUFS / -1.5 dBTP).

usage: python3 tools/music_fit.py <slug>

demo.json "music":
  file      the track (any format ffmpeg reads)
  bpm       tempo (tools/beats.py measures it)
  downbeat  a downbeat in the track, in seconds (sets the bar grid)
  start     where the video starts in the track (s); pick a downbeat so M.B(0) lands at 0
  loop      optional [a, b]: beats counted from `downbeat`. When the track is too short, the section a..b is
            repeated (inserted after its first play) until the video is covered. Whole bars keep the grid intact.
  fade_in   seconds (default 0)       fade_out  seconds at the end (default 2.5)
No "music" block (or file: null) gives silence.
"""
import json, os, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000


def decode(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def splice(parts, xf):
    """join sample ranges with short equal-power crossfades (xf samples)."""
    out = parts[0]
    for p in parts[1:]:
        n = min(xf, len(out), len(p))
        if n:
            w = np.linspace(0, np.pi / 2, n)[:, None]
            mid = out[-n:] * np.cos(w) + p[:n] * np.sin(w)
            out = np.concatenate([out[:-n], mid, p[n:]])
        else:
            out = np.concatenate([out, p])
    return out


def loudnorm(x, out):
    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, 'mix.wav')
        write_wav(raw, x)
        af = 'loudnorm=I=-14:TP=-1.5:LRA=11'
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', raw, '-af', af + ':print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
        j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
        af2 = (f"{af}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
               f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', af2, '-ar', str(SR), out], check=True)


def write_wav(path, x):
    x16 = (np.clip(x, -1, 1) * 32767).astype('<i2')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', path],
                   input=x16.tobytes(), check=True)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    meta = json.load(open(os.path.join(ROOT, 'demos', slug, 'demo.json'), encoding='utf-8'))
    dur = float(meta['duration'])
    n = int(round(dur * SR))
    m = meta.get('music') or {}
    os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
    out = os.path.join(ROOT, 'out', f'{slug}-music.wav')
    if not m.get('file'):
        write_wav(out, np.zeros((n, 2), np.float32))
        print('silence ->', os.path.relpath(out, ROOT))
        return
    src = m['file'] if os.path.isabs(m['file']) else os.path.join(ROOT, m['file'])
    x = decode(src)
    s0 = int(round(float(m.get('start', 0)) * SR))
    parts = [x[s0:]]
    if len(parts[0]) < n and m.get('loop'):
        beat = 60.0 / float(m['bpm'])
        a, b = (int(round((float(m['downbeat']) + k * beat) * SR)) for k in m['loop'])
        if not (s0 <= a < b <= len(x)):
            sys.exit(f'loop {m["loop"]} is outside the part of the track that plays')
        parts = [x[s0:b]]
        while sum(len(p) for p in parts) + (len(x) - b) < n:
            parts.append(x[a:b])
        parts.append(x[b:])
        print(f'loop: beats {m["loop"][0]}-{m["loop"][1]} repeated {len(parts) - 2}x')
    y = splice(parts, int(0.02 * SR))
    if len(y) < n:
        print(f'warning: the track covers {len(y) / SR:.1f} s of {dur:.1f} s; the rest is silence (add a "loop")')
        y = np.concatenate([y, np.zeros((n - len(y), 2), np.float32)])
    y = y[:n].copy()
    fi, fo = float(m.get('fade_in', 0)), float(m.get('fade_out', 2.5))
    if fi > 0:
        k = int(fi * SR); y[:k] *= np.linspace(0, 1, k)[:, None]
    if fo > 0:
        k = int(fo * SR); y[-k:] *= (np.cos(np.linspace(0, np.pi, k)) * 0.5 + 0.5)[:, None]
    loudnorm(y, out)
    print(f'{os.path.relpath(src, ROOT)} {m.get("start", 0)}s -> {dur:.2f}s, -14 LUFS ->', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    main()
