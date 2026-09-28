"""Synthesized sound effects for Marsad films: the 63 s film's sound design (audio_stems.py), as a library.

Every builder returns (signal, peak): a mono float array at 48 kHz peaking at 1.0, and the time in seconds from its
start to its accent. tools/film_audio.py places a cue so its accent lands on the beat. The sounds are seeded, so a
build is reproducible. The end-card bloom's chord now fades out (in audio_stems.py its envelope is commented out and
the chord stops dead).

Types (use them sparingly; the client asked for restrained, balanced effects):
  whoosh    a soft air move into a transition (accent 42% in)      whoosh_rev   a reversed swell that ends on the beat
  tick      a tiny tick (items appearing, counts)                   key          a key press (typing)
  pop       a soft pop (a pill, a chip)                             blip         a short UI blip
  click     a UI click (the cursor pressing a button)               ping         one bell tone (f= Hz)
  chime     a two-note success chime (an approval, a toast)         thump        a low hit (a landing, the logo)
  riser     a rise that ends on the beat (before a drop)            swell        a soft noise swell
  bloom     a low boom, shimmer and a D minor chord (the logo on the drop; 2.2 s)
  absorb    a short upward glide (an item absorbed; i= 0..n raises the pitch)
"""
import numpy as np

SR = 48000


def _rng(seed):
    return np.random.default_rng(seed)


def env(total, a, d, curve=3.0):
    """attack-decay envelope over `total` seconds (a, d in seconds)."""
    n = int(total * SR)
    na = min(int(a * SR), n)
    nd = min(int(d * SR), n - na)
    e = np.zeros(n)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 0.7
    if nd:
        e[na:na + nd] = np.linspace(1, 0, nd) ** curve
    return e


def sine(f, n):
    return np.sin(2 * np.pi * f * np.arange(n) / SR)


def gliss(f0, f1, n, shape=1.0):
    t = np.linspace(0, 1, n) ** shape
    return np.sin(np.cumsum(2 * np.pi * (f0 * (f1 / f0) ** t) / SR))


def bandnoise(n, f_lo, f_hi, seed=7):
    X = np.fft.rfft(_rng(seed).standard_normal(n))
    fr = np.fft.rfftfreq(n, 1 / SR)
    mask = np.exp(-0.5 * ((np.log(fr + 1) - np.log((f_lo * f_hi) ** 0.5)) / (0.5 * np.log(f_hi / f_lo))) ** 2)
    return np.fft.irfft(X * mask, n)


def norm(x, peak=1.0):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def whoosh(dur=0.5, f_lo=180, f_hi=2400, rise=0.42, seed=7, **_):
    n = int(dur * SR)
    e = np.concatenate([np.linspace(0, 1, int(n * rise)) ** 1.6, np.linspace(1, 0, n - int(n * rise)) ** 2.2])
    return norm((bandnoise(n, f_lo, f_hi, seed) + gliss(f_lo * 1.5, f_hi * 0.5, n) * 0.12) * e), dur * rise


def whoosh_rev(dur=0.5, seed=8, **_):
    s, _ = whoosh(dur, 140, 2000, rise=0.8, seed=seed)
    return s[::-1] * 0.9, dur


def tick(f=2400, dur=0.03, **_):
    n = int(dur * SR)
    return norm(sine(f, n) * env(dur, 0.001, dur - 0.001, 4)[:n]), 0.0


def key(fbase=1700, seed=9, **_):
    n = int(0.045 * SR)
    click = bandnoise(n, 900, 5200, seed) * env(0.045, 0.001, 0.04, 5)[:n]
    return norm(click + sine(fbase, n) * env(0.045, 0.001, 0.02, 6)[:n] * 0.4), 0.0


def pop(f=520, dur=0.16, **_):
    n = int(dur * SR)
    return norm(gliss(f * 0.72, f, n) * env(dur, 0.004, dur - 0.005, 3)[:n]), 0.004


def blip(f=880, dur=0.09, **_):
    n = int(dur * SR)
    return norm(sine(f, n) * env(dur, 0.002, dur - 0.003, 4)[:n]), 0.002


def click(seed=11, **_):
    s, _ = key(2100, seed)
    return s, 0.0


def ping(f=880.0, dur=0.9, **_):
    n = int(dur * SR)
    s = sine(f, n) + 0.42 * sine(f * 2, n) + 0.18 * sine(f * 3.01, n) + 0.06 * sine(f * 4.02, n)
    return norm(s * env(dur, 0.004, dur - 0.006, 3.4)[:n]), 0.004


def chime(seed=12, **_):
    n = int(1.1 * SR)
    a, _ = ping(880.00, 1.0)
    b, _ = ping(1108.73, 1.1)
    out = np.zeros(n)
    out[:len(a)] += a * 0.8
    i0 = int(0.14 * SR)
    out[i0:i0 + len(b)] += b[:n - i0]
    return norm(out + bandnoise(n, 3800, 9000, seed) * env(1.1, 0.01, 1.05, 4)[:n] * 0.08), 0.004


def thump(f=64, dur=0.5, punch=0.5, seed=13, **_):
    n = int(dur * SR)
    out = gliss(f * 2.2, f, n, 0.4) * env(dur, 0.002, dur - 0.004, 2.6)[:n]
    m = int(0.02 * SR)
    out[:m] += bandnoise(m, 700, 3000, seed) * env(0.02, 0.001, 0.018, 5)[:m] * punch
    return norm(out), 0.002


def riser(dur=0.65, seed=14, **_):
    n = int(dur * SR)
    s = bandnoise(n, 300, 3600, seed) * np.linspace(0, 1, n) ** 2.2 + gliss(160, 640, n, 1.2) * np.linspace(0, 1, n) ** 2.5 * 0.35
    return norm(s), dur


def swell(dur=0.8, f_lo=200, f_hi=1200, seed=15, **_):
    n = int(dur * SR)
    return norm(bandnoise(n, f_lo, f_hi, seed) * np.sin(np.linspace(0, np.pi, n)) ** 1.5), dur / 2


def bloom(seed=16, **_):
    n = int(2.2 * SR)
    boom = gliss(120, 46, n, 0.35) * env(2.2, 0.004, 2.15, 2.2)[:n]
    shimmer = bandnoise(n, 2400, 9500, seed) * env(2.2, 0.02, 2.1, 3.2)[:n] * 0.16
    chord = (sine(146.83, n) + 0.7 * sine(174.61, n) + 0.6 * sine(220.0, n)) * env(2.2, 0.05, 2.0, 2.6)[:n] * 0.22   # D minor, faded
    return norm(boom + shimmer + chord), 0.004


def absorb(i=0, **_):
    f = 300 * (2 ** (i / 10))
    n = int(0.12 * SR)
    return norm(gliss(f, f * 1.6, n) * env(0.12, 0.002, 0.115, 4)[:n]), 0.06


TYPES = {'whoosh': whoosh, 'whoosh_rev': whoosh_rev, 'tick': tick, 'key': key, 'pop': pop, 'blip': blip,
         'click': click, 'ping': ping, 'chime': chime, 'thump': thump, 'riser': riser, 'swell': swell,
         'bloom': bloom, 'absorb': absorb}


def make(kind, **params):
    """(signal, accent) for a cue type; params pass through (dur, f, i, ...)."""
    if kind not in TYPES:
        raise SystemExit(f'unknown sfx type "{kind}"; types: {", ".join(TYPES)}')
    return TYPES[kind](**params)
