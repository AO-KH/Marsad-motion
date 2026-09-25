"""Render review stills of a demo in both formats and tile them into one labelled sheet per format.

usage: python3 tools/stills.py <slug> <times>            times in seconds:    2.5,7,12.25
       python3 tools/stills.py <slug> <beats> --beats    beat numbers (M.B):  8,11,20,23.5
       options: --formats 16x9,9x16   --cols 5   --width 380 (thumbnail width in px)

Writes style_audit/<slug>-stills-<format>.png (each still labelled with its time, and its beat with --beats) and
keeps the full-size stills as style_audit/<slug>-<format>_<t>.png for a closer look. Rebuild the pages first
(python3 tools/make_demo.py <slug>) after editing demo.js.
"""
import argparse, glob, json, os, subprocess, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import make_demo  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('slug')
    ap.add_argument('times')
    ap.add_argument('--beats', action='store_true')
    ap.add_argument('--formats', default=None)
    ap.add_argument('--cols', type=int, default=None)
    ap.add_argument('--width', type=int, default=None)
    a = ap.parse_args()
    d, meta, fmts = make_demo.load(a.slug)
    if a.formats:
        fmts = [f for f in a.formats.split(',') if f]
    vals = [float(x) for x in a.times.split(',') if x.strip()]
    labels = []
    if a.beats:
        bpm, phase = make_demo.grid(meta)
        if not bpm:
            sys.exit('--beats needs music with a bpm in demo.json')
        ts = [phase + 60.0 / bpm * k for k in vals]
        labels = [f'{t:.3f}s  B({k:g})' for t, k in zip(ts, vals)]   # the same time as the full-size file's name
    else:
        ts = vals
        labels = [f'{t:.3f}s' for t in ts]
    tlist = ','.join(f'{t:.3f}' for t in ts)
    out = os.path.join(ROOT, 'style_audit')
    os.makedirs(out, exist_ok=True)
    procs = []
    for f in fmts:
        page = os.path.join('build', f'{a.slug}-{f}.html')
        if not os.path.isfile(os.path.join(ROOT, page)):
            sys.exit(f'{page} is missing: run python3 tools/make_demo.py {a.slug}')
        for old in glob.glob(os.path.join(out, f'{a.slug}-{f}_*.png')):
            os.remove(old)
        procs.append(subprocess.Popen(['node', 'render_ab.js', page, f'{a.slug}-{f}', tlist], cwd=ROOT))
    if any(p.wait() for p in procs):
        sys.exit('render_ab.js failed (see above)')
    for f in fmts:
        ims = [Image.open(os.path.join(out, f'{a.slug}-{f}_{t:.3f}.png')).convert('RGB') for t in ts]
        w0, h0 = ims[0].size
        cols = a.cols or (4 if w0 > h0 else 7)
        tw = a.width or (460 if w0 > h0 else 250)
        th = int(h0 * tw / w0)
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (tw + 8) + 8, rows * (th + 30) + 8), (38, 36, 44))
        dr = ImageDraw.Draw(sheet)
        for i, (im, lab) in enumerate(zip(ims, labels)):
            x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 30)
            dr.text((x + 2, y + 4), lab, fill=(255, 230, 120))
            sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + 22))
        path = os.path.join(out, f'{a.slug}-stills-{f}.png')
        sheet.save(path)
        print('wrote', os.path.relpath(path, ROOT), f'({len(ims)} stills; full size: style_audit/{a.slug}-{f}_<t>.png)')


if __name__ == '__main__':
    main()
