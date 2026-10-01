"""The fast moves of a rendered video, and 16-sample motion blur on just those frames.

usage: python3 tools/fast_ranges.py <slug> [--format 16x9] [--thresh 5] [--ranges 186-202,237-250] [--run]

Reads out/<slug>-<format>.mp4 (a draft or a final), finds the frames where the picture moves fast (the mean change
between frames, as tools/qa.py measures it, above --thresh on a 0-255 scale), merges them into ranges with a few frames
of margin, and prints them. With --run it re-renders those ranges with 16 sub-frames (render_mb.js), blends them into
frames/<slug>-<format>/, and re-muxes and re-checks the video (ONLY=audio ./build_demo.sh). The camera dives of a
walkthrough (demos/kit/walk.js) need this: four sub-frames leave steps in a fast zoom or pan.

The ranges render at the final's own scale, read from its frames (3840 wide: SCALE 2, the 4K finals). Until 2026-10-01
they rendered at 1080p and ffmpeg upscaled them into the 4K video, so a 4K final was soft on every fast move: always
let this script match the scale, and check that every frame has the same size (it stops if not). --ranges re-renders
the given ranges (start-end, end excluded) instead of the detected ones, e.g. to redo the ranges a log printed.
"""
import argparse, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ranges(video, thresh, pad=(3, 5), join=6):
    W, H = 320, 180
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))
    out = []
    for i in np.where(d > thresh)[0]:
        if out and i - out[-1][1] <= join:
            out[-1][1] = int(i)
        else:
            out.append([int(i), int(i)])
    out = [[max(0, a - pad[0]), min(len(F), b + pad[1])] for a, b in out]
    merged = []
    for a, b in out:
        if merged and a <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    return merged, d, len(F)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('slug')
    ap.add_argument('--format', default='16x9')
    ap.add_argument('--thresh', type=float, default=5.0)
    ap.add_argument('--jobs', type=int, default=6)
    ap.add_argument('--ranges', default='', help='start-end,... (end excluded): re-render these instead of the detected ones')
    ap.add_argument('--run', action='store_true')
    a = ap.parse_args()
    video = os.path.join(ROOT, 'out', f'{a.slug}-{a.format}.mp4')
    if not os.path.isfile(video):
        sys.exit(f'no {os.path.relpath(video, ROOT)}: build it first (./build_demo.sh {a.slug} {a.format})')
    rs, d, n = ranges(video, a.thresh)
    if a.ranges:
        rs = [[int(x) for x in r.split('-')] for r in a.ranges.split(',') if r.strip()]
    print(f'{os.path.relpath(video, ROOT)}: {n} frames; {len(rs)} fast ranges, {sum(b - a_ for a_, b in rs)} frames')
    for a_, b in rs:
        print(f'  frames {a_}-{b}  ({a_ / 30:.2f}-{b / 30:.2f} s, peak {d[a_:max(a_ + 1, b - 1)].max():.1f})')
    if not a.run:
        print('re-render them with 16 sub-frames: add --run')
        return
    page, frames = f'build/{a.slug}-{a.format}.html', f'frames/{a.slug}-{a.format}'
    if not os.path.isfile(os.path.join(ROOT, frames, 'f_0001.jpg')):
        sys.exit(f'no {frames}/: run the final build first (./build_demo.sh {a.slug} {a.format})')
    # the final's scale, from its frames: the stage is 1920 wide in 16:9 and 1080 wide in 9:16 and 1:1
    width = Image.open(os.path.join(ROOT, frames, 'f_0001.jpg')).size[0]
    scale = width / (1920 if a.format == '16x9' else 1080)
    print(f'rendering at scale {scale:g} ({width} px wide, as the final)')
    renv = dict(os.environ, SCALE=f'{scale:g}')
    for a_, b in rs:                               # blend each range as it comes: 16 sub-frames at 4K are big
        subprocess.run(['node', 'render_mb.js', str(a.jobs), page, frames, '16', str(a_), str(b)], cwd=ROOT, check=True, env=renv)
        subprocess.run([sys.executable, 'tools/blend.py', frames], cwd=ROOT, check=True)
    sizes = {}
    for f in sorted(os.listdir(os.path.join(ROOT, frames))):
        if f.startswith('f_') and f.endswith('.jpg'):
            sizes.setdefault(Image.open(os.path.join(ROOT, frames, f)).size, []).append(f)
    if len(sizes) > 1:
        sys.exit('frames of different sizes: ' + '; '.join(f'{k[0]}x{k[1]}: {len(v)} ({v[0]}…)' for k, v in sizes.items()))
    env = dict(os.environ, ONLY='audio', PYTHON=sys.executable)
    subprocess.run(['bash', 'build_demo.sh', a.slug, a.format], cwd=ROOT, check=True, env=env)


if __name__ == '__main__':
    main()
