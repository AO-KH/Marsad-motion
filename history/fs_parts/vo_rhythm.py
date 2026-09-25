# voice phrases: each phrase's first syllable lands on a grid point next to the visual it names
def vo_segments(x, thr=0.08, gap=0.18):
    win = int(0.01 * SR)
    e = np.sqrt(np.convolve(x ** 2, np.ones(win) / win, mode='same'))
    act = e > e.max() * thr
    segs = []; s0 = None; g = 0; last = 0
    for j, a in enumerate(act):
        if a:
            if s0 is None: s0 = j
            g = 0; last = j
        elif s0 is not None:
            g += 1
            if g > int(gap * SR): segs.append((s0, last)); s0 = None
    if s0 is not None: segs.append((s0, last))
    return segs
VO_PLAN = [   # (take, phrases in it, film time for the first syllable)
    ('vo01', None, 0.95),                          # before the music: original cue (file start)
    ('vo02', [0], vb(3.5)), ('vo03', [0], vb(12.5)),
    ('vo04', [0], vb(16)), ('vo04', [1], vb(17.5)), ('vo04', [2, 3], vb(19)),       # Connect · Unify · Monitor… and act
    ('vo05', [0], vb(22)), ('vo05', [1], vb(23.5)),
    ('vo06', [0], vb(28)), ('vo07', [0], vb(39)),
    ('vo08', [0], vb(51)), ('vo08', [1], vb(54.5)),                                   # "click" lands on the click
    ('vo09', [0], vb(56)), ('vo09', [1], vb(58)),
    ('vo10', [0], vb(60.5)), ('vo10', [1], vb(64.5)),
    ('vo11', [0], vb(71)), ('vo11', [1], vb(73)),
    ('vo12', [0], vb(82)), ('vo12', [1], vb(83.5)),
    ('vo13', [0], vb(86.5)),
]
VL = np.zeros(N)
if _os.environ.get('VO') == '1':
    cache = {}
    for name, idx, t_on in VO_PLAN:
        if name not in cache:
            x = load_vo(f'vo/{name}.wav'); cache[name] = (x, vo_segments(x))
        x, segs = cache[name]
        if idx is None:
            a, b, on = 0, len(x), 0
        else:
            first, lastp = segs[idx[0]], segs[idx[-1]]
            prev_end = segs[idx[0] - 1][1] if idx[0] > 0 else None
            next_beg = segs[idx[-1] + 1][0] if idx[-1] + 1 < len(segs) else None
            a = (prev_end + first[0]) // 2 if prev_end is not None else 0
            b = (lastp[1] + next_beg) // 2 if next_beg is not None else len(x)
            on = first[0]
        seg = x[a:b].copy()
        f = min(int(0.008 * SR), len(seg) // 4)
        if a > 0: seg[:f] *= np.linspace(0, 1, f)
        if b < len(x): seg[-f:] *= np.linspace(1, 0, f)
        i0 = int(round((t_on - (on - a) / SR) * SR)) if idx is not None else int(round(t_on * SR))
        e = min(N, i0 + len(seg)); VL[i0:e] += seg[:e - i0]
        print(f'  {name} {idx} -> {t_on:.3f}  (cut {a/SR:.2f}-{b/SR:.2f}s)')
vo = np.stack([VL, VL])
