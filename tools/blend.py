"""Average each frame's sub-frames (from render_mb.js) into one motion-blurred frame, then delete the sub-frames.

usage: python3 tools/blend.py <outdir>        <outdir>/sub/s_<frame>_<k>.jpg -> <outdir>/f_<frame>.jpg
"""
import glob, os, re, shutil, sys
from collections import defaultdict
import numpy as np
from PIL import Image


def main():
    out = sys.argv[1]
    groups = defaultdict(list)
    for f in glob.glob(os.path.join(out, 'sub', 's_*_*.jpg')):
        i, k = map(int, re.findall(r's_(\d+)_(\d+)\.jpg$', f)[0])
        groups[i].append(f)
    for i in sorted(groups):
        acc = None
        for f in groups[i]:
            a = np.asarray(Image.open(f).convert('RGB'), dtype=np.float32)
            acc = a if acc is None else acc + a
        img = np.clip(acc / len(groups[i]) + 0.5, 0, 255).astype(np.uint8)
        Image.fromarray(img).save(os.path.join(out, f'f_{i:04d}.jpg'), quality=95)
    shutil.rmtree(os.path.join(out, 'sub'))
    print('blended', len(groups), 'frames')


if __name__ == '__main__':
    main()
