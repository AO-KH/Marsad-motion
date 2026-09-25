"""Check a rendered video against the house style, and make a contact sheet.

usage: python3 tools/qa.py <video.mp4> [--slug <slug>] [--sheet 12]

  pace    frame-to-frame change (0-255, mean over a 320 px wide greyscale copy): median / 95th / 99th / max,
          and the moments above 12 (fast motion or hard cuts)
  pulse   with a beat grid (from demos/<slug>/demo.json): change on beat frames vs the frames around them.
          1.0 = nothing pulses to the beat; above 1.15 fails
  shake   back-and-forth motion (camera shake, wiggles): frames where the motion reverses direction in 3+ of the
          4 quadrants at once (steps over 0.5 px at 480 px wide). Must be 0. It catches a shake on a calm frame,
          not one hidden under a flash or burst, so the engine simply has no shake effects
  sheet   style_audit/<name>-sheet.png: N frames spread over the video, time-stamped
"""
import argparse, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))


def frames(path, w):
    info = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                           '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout.strip().split(',')
    W, H = int(info[0]), int(info[1])
    h = int(round(H * w / W / 2) * 2)
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-vf', f'scale={w}:{h},format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32), (W, H)


def shift(a, b):
    """global translation of b relative to a (phase correlation, sub-pixel)."""
    A = np.fft.fft2(a - a.mean()); B = np.fft.fft2(b - b.mean())
    R = A * np.conj(B); R /= np.abs(R) + 1e-9
    c = np.fft.fftshift(np.fft.ifft2(R).real)
    iy, ix = np.unravel_index(np.argmax(c), c.shape)
    def fit(m, z, p):
        d = m - 2 * z + p
        return 0.0 if d == 0 else 0.5 * (m - p) / d
    dy = fit(c[iy - 1, ix], c[iy, ix], c[(iy + 1) % c.shape[0], ix]) if 0 < iy else 0
    dx = fit(c[iy, ix - 1], c[iy, ix], c[iy, (ix + 1) % c.shape[1]]) if 0 < ix else 0
    return -(ix + dx - c.shape[1] // 2), -(iy + dy - c.shape[0] // 2)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('video')
    ap.add_argument('--slug')
    ap.add_argument('--sheet', type=int, default=12)
    a = ap.parse_args()
    name = os.path.splitext(os.path.basename(a.video))[0]
    slug = a.slug or next((d for d in sorted(os.listdir(os.path.join(ROOT, 'demos')), key=len, reverse=True)
                           if name.startswith(d)), None) if os.path.isdir(os.path.join(ROOT, 'demos')) else None
    F, (W, H) = frames(a.video, 320)
    fps = 30.0
    d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))
    ok = True
    print(f'{a.video}: {len(F)} frames, {W}x{H}, {len(F) / fps:.2f} s')
    print(f'pace    median {np.median(d):.2f}  95th {np.percentile(d, 95):.2f}  99th {np.percentile(d, 99):.2f}  max {d.max():.2f}')
    fast = np.where(d > 12)[0]
    if len(fast):
        print('        fast moments (>12):', ', '.join(f'{i / fps:.2f}s ({d[i]:.1f})' for i in fast[:12]))
    # pulse on the beat grid
    if slug and os.path.isfile(os.path.join(ROOT, 'demos', slug, 'demo.json')):
        import make_demo
        meta = json.load(open(os.path.join(ROOT, 'demos', slug, 'demo.json'), encoding='utf-8'))
        bpm, phase = make_demo.grid(meta)
        if bpm:
            mb = 60 / bpm
            r = []
            for k in range(0, int((len(d) / fps - phase) / mb)):
                f = int(round((phase + k * mb) * fps))
                if 3 <= f < len(d) - 4:
                    r.append(d[f] / (np.r_[d[f - 3:f - 1], d[f + 2:f + 4]].mean() + 1e-3))
            pr = float(np.median(r)) if r else 1.0
            ok &= pr <= 1.15
            print(f'pulse   {pr:.2f}x on {len(r)} beats  {"OK" if pr <= 1.15 else "FAIL: something pulses to the beat"}')
    # shake: in how many quadrants the motion reverses direction from one frame to the next (steps over 0.5 px).
    # A camera shake or wiggle reverses in 3-4 quadrants at once; calm moves and fades stay at 0-2.
    G, _ = frames(a.video, 480)
    h, w = G.shape[1:]
    quads = [(0, h // 2, 0, w // 2), (0, h // 2, w // 2, w), (h // 2, h, 0, w // 2), (h // 2, h, w // 2, w)]
    V = np.array([[shift(G[i][y0:y1, x0:x1], G[i + 1][y0:y1, x0:x1]) for (y0, y1, x0, x1) in quads] for i in range(len(G) - 1)])
    events = []
    for i in range(1, len(V)):
        rev = sum(1 for q in range(4) for ax in range(2)
                  if abs(V[i - 1, q, ax]) > 0.5 and abs(V[i, q, ax]) > 0.5 and np.sign(V[i - 1, q, ax]) != np.sign(V[i, q, ax]))
        if rev >= 3 and not any(abs(i - e) < 15 for e in events):
            events.append(i)
    ok &= not events
    print(f'shake   {len(events)} events' + (': ' + ', '.join(f'{i / fps:.2f}s' for i in events) + '  FAIL' if events else '  OK'))
    # contact sheet
    n = max(1, a.sheet)
    cols = 4 if W > H else 6
    rows = (n + cols - 1) // cols
    tw = 480 if W > H else 240
    th = int(tw * H / W)
    sheet = Image.new('RGB', (cols * tw, rows * (th + 26)), 'white')
    dr = ImageDraw.Draw(sheet)
    for i in range(n):
        t = (i + 0.5) * len(F) / fps / n
        png = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', f'{t:.3f}', '-i', a.video, '-frames:v', '1', '-vf',
                              f'scale={tw}:{th}', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
        from io import BytesIO
        im = Image.open(BytesIO(png)).convert('RGB')
        x, y = (i % cols) * tw, (i // cols) * (th + 26)
        sheet.paste(im, (x, y))
        dr.text((x + 6, y + th + 6), f'{t:.1f}s', fill=(90, 80, 110))
    os.makedirs(os.path.join(ROOT, 'style_audit'), exist_ok=True)
    out = os.path.join(ROOT, 'style_audit', f'{name}-sheet.png')
    sheet.save(out)
    print('sheet  ', os.path.relpath(out, ROOT))
    print('RESULT ', 'PASS' if ok else 'FAIL')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
