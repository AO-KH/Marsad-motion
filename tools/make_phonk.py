"""An original drift-phonk track, synthesized from scratch: "Midnight Drift" (fit/midnight-drift*.mp3).

usage: python3 tools/make_phonk.py            writes fit/midnight-drift.mp3 (123 BPM) and fit/midnight-drift-slowed.mp3

The client asked for "a sound like this", linking isq's "pursuit (slowed)" (2026-10-01). This takes that track's style
only, measured on its public 30 s preview: drift phonk at 123 BPM, played at 0.9x for the "slowed" edit, which
lands near 110 BPM and about two semitones down. The style is a kick on every beat with everything else ducking
under it, a long distorted 808 that glides between notes, a pitched 808-cowbell riff in 3-3-2 syncopation, a
distorted pad, offbeat hats, a clap on 2 and 4, and a loud, bass-heavy master. Everything here is original:
the chords (Em - C - Am - B), the two riffs, the bass line, the arrangement and every sound, made in numpy. Nothing is
sampled, so the track is cleared for any use (fit/CREDITS.md).

Form (bars at 123 BPM, 16 steps a bar): intro 4, drop A 8, drop A2 8, breakdown 8 (its last 2 build), drop B 8,
drop B2 8, outro 4 = 48 bars, 93.7 s; the slowed version is 104.1 s. Each bar loops the 4-chord progression.
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 123.0
STEP = 60.0 / BPM / 4                         # a 16th note, in seconds
BAR = 16 * STEP
BARS = 48
N = int(round(BARS * BAR * SR)) + SR * 3     # plus room for tails
rng = np.random.default_rng(7)

# the song's sections (first bar, last bar + 1)
INTRO, DROP_A, DROP_A2, BREAK, DROP_B, DROP_B2, OUTRO = (0, 4), (4, 12), (12, 20), (20, 28), (28, 36), (36, 44), (44, 48)
def within(bar, *secs): return any(a <= bar < b for a, b in secs)


def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def at(bar, step=0.0): return int(round((bar * 16 + step) * STEP * SR))
def tt(n): return np.arange(n) / SR


def polyblep(t, dt):
    out = np.zeros_like(t)
    a = t < dt; x = t[a] / dt[a]; out[a] = x + x - x * x - 1
    b = t > 1 - dt; x = (t[b] - 1) / dt[b]; out[b] = x * x + x + x + 1
    return out


def saw(freq, phase0=0.0):
    """band-limited sawtooth (polyBLEP) for a frequency array"""
    dt = freq / SR
    ph = (phase0 + np.cumsum(dt)) % 1.0
    return 2 * ph - 1 - polyblep(ph, dt)


def square(freq, phase0=0.0):
    dt = freq / SR
    ph = (phase0 + np.cumsum(dt)) % 1.0
    ph2 = (ph + 0.5) % 1.0
    return (2 * ph - 1 - polyblep(ph, dt)) - (2 * ph2 - 1 - polyblep(ph2, dt))


def sos(kind, f, order=2):
    f = np.atleast_1d(f) if kind in ('bandpass', 'bandstop') else f
    return signal.butter(order, np.array(f) / (SR / 2), btype=kind, output='sos')


def filt(x, kind, f, order=2): return signal.sosfilt(sos(kind, f, order), x, axis=0)


def sweep_lp(x, cut, block=512):
    """a lowpass whose cutoff follows the array `cut` (Hz per sample), block by block, state carried over"""
    out = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        c = float(np.clip(cut[min(i + block // 2, len(cut) - 1)], 30, SR * 0.45))
        s = sos('lowpass', c)
        if zi is None: zi = np.zeros((s.shape[0], 2))
        out[i:i + block], zi = signal.sosfilt(s, x[i:i + block], zi=zi)
    return out


def add(track, start, sig):
    if start >= len(track): return
    n = min(len(sig), len(track) - start)
    track[start:start + n] += sig[:n]


def fade(sig, a=0.002, r=0.006):
    n = len(sig); e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr)
    return sig * e


# ---------------------------------------------------------------- the harmony: Em - C - Am - B, one chord a bar
ROOTS = [40, 36, 45, 47]                       # E2 C2 A2 B2 (MIDI); the 808 plays them an octave lower
PAD = [[64, 67, 71], [64, 67, 72], [64, 69, 72], [63, 66, 71]]   # E4 G4 B4 | E4 G4 C5 | E4 A4 C5 | D#4 F#4 B4

# the two riffs (16th step, MIDI note), one bar per chord, in the 3-3-2 syncopation (steps 0, 3, 6, 8, 11, 14)
RIFF_A = [[(0, 76), (3, 76), (6, 79), (8, 83), (11, 79), (14, 76)],
          [(0, 76), (3, 76), (6, 79), (8, 84), (11, 79), (14, 76)],
          [(0, 76), (3, 76), (6, 81), (8, 84), (11, 81), (14, 76)],
          [(0, 75), (3, 75), (6, 78), (8, 83), (11, 81), (13, 78), (14, 75)]]
RIFF_B = [[(0, 83), (3, 83), (6, 79), (8, 76), (11, 79), (14, 81)],
          [(0, 79), (3, 79), (6, 76), (8, 72), (11, 76), (14, 79)],
          [(0, 81), (3, 81), (6, 76), (8, 72), (11, 76), (14, 83)],
          [(0, 78), (3, 78), (6, 75), (8, 71), (11, 75), (13, 78), (14, 81)]]


# ---------------------------------------------------------------- instruments
def kick():
    n = int(0.48 * SR); t = tt(n)
    f = 58 + (240 - 58) * np.exp(-t / 0.028)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.17)
    knock = np.sin(2 * np.pi * np.cumsum(110 + 220 * np.exp(-t / 0.01)) / SR) * np.exp(-t / 0.045) * 0.6
    click = filt(rng.standard_normal(n), 'highpass', 1800) * np.exp(-t / 0.003) * 0.5
    k = np.tanh(2.8 * (body + knock + click)) / np.tanh(2.8)
    return fade(k, 0.0005, 0.03)


def cowbell(note, length):
    """the 808 cowbell: two square waves a fifth-and-a-bit apart (540:800), band-passed, a sharp decay; pitched"""
    n = int(min(length, 0.38) * SR); t = tt(n)
    f1 = midi(note); f2 = f1 * 1.4815
    x = square(np.full(n, f1)) + 0.85 * square(np.full(n, f2))
    x = filt(x, 'bandpass', [f1 * 0.9, min(f1 * 14, 16000)], 2)
    env = 0.62 * np.exp(-t / 0.011) + 0.38 * np.exp(-t / 0.17)
    x = np.tanh(2.6 * x * env) * 0.8
    return fade(x, 0.0008, 0.012)


def hat(open_=False, accent=1.0):
    n = int((0.30 if open_ else 0.07) * SR); t = tt(n)
    fs = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]
    x = sum(square(np.full(n, f * 1.7), rng.random()) for f in fs) + filt(rng.standard_normal(n), 'bandpass', [3500, 9000]) * 3
    x = filt(filt(x, 'highpass', 5000, 2), 'highpass', 5000, 2)
    x = x * np.exp(-t / (0.11 if open_ else 0.018)) * accent
    return fade(x / 6, 0.0005, 0.01)         # (the six squares were summed at full level above: /6 back to about 1)


def clap():
    n = int(0.45 * SR); t = tt(n)
    noise = filt(rng.standard_normal(n), 'bandpass', [900, 4200], 2)
    env = np.zeros(n)
    for d in (0.0, 0.009, 0.018):                       # three slaps, then the tail
        i = int(d * SR); env[i:] += np.exp(-(t[i:] - d) / 0.006) * (0.9 if d < 0.018 else 1.0)
    env += 0.55 * np.exp(-np.maximum(t - 0.02, 0) / 0.12) * (t > 0.02)
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.35
    x = noise * env * 0.6 + body
    return fade(np.tanh(1.6 * x), 0.0005, 0.03)


def snare_hit(gain):
    n = int(0.16 * SR); t = tt(n)
    x = filt(rng.standard_normal(n), 'bandpass', [1200, 6500], 2) * np.exp(-t / 0.045) + np.sin(2 * np.pi * 200 * t) * np.exp(-t / 0.03) * 0.5
    return fade(x * gain, 0.0005, 0.01)


def impact():
    n = int(2.2 * SR); t = tt(n)
    f = 34 + 40 * np.exp(-t / 0.15)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    crash = filt(rng.standard_normal(n), 'highpass', 3500) * np.exp(-t / 0.7) * 0.25
    return fade(np.tanh(1.8 * boom) * 0.9 + crash, 0.001, 0.2)


def riser(n):
    t = tt(n); p = t / t[-1]
    noise = rng.standard_normal(n)
    out = np.zeros(n); zi = None; block = 512
    for i in range(0, n, block):                         # a band-pass that climbs from 300 Hz to 9 kHz
        c = 300 * (30 ** p[min(i + block // 2, n - 1)])
        s = sos('bandpass', [c * 0.7, min(c * 1.4, 20000)])
        if zi is None: zi = np.zeros((s.shape[0], 2))
        out[i:i + block], zi = signal.sosfilt(s, noise[i:i + block], zi=zi)
    tone = saw(180 * 8 ** p) * 0.08
    return fade((out * 0.6 + tone) * p ** 2.2, 0.05, 0.01)


def downlifter(n):
    t = tt(n); p = t / t[-1]
    noise = rng.standard_normal(n); out = np.zeros(n); zi = None; block = 512
    for i in range(0, n, block):
        c = 8000 * (0.04 ** p[min(i + block // 2, n - 1)])
        s = sos('bandpass', [max(c * 0.7, 40), c * 1.4])
        if zi is None: zi = np.zeros((s.shape[0], 2))
        out[i:i + block], zi = signal.sosfilt(s, noise[i:i + block], zi=zi)
    return fade(out * (1 - p) ** 1.5 * 0.5, 0.005, 0.05)


# ---------------------------------------------------------------- the song
def song():
    drums_k = np.zeros(N); clap_t = np.zeros(N); hats = np.zeros(N); riff = np.zeros(N); riff_lo = np.zeros(N)
    pad = np.zeros(N); fx = np.zeros(N)
    kick_times = []
    K = kick(); C = clap()
    full = (DROP_A, DROP_A2, DROP_B, DROP_B2)

    for bar in range(BARS):
        ch = bar % 4
        # kick on every beat in the drops; in the build (the breakdown's last 2 bars) on 8ths, quieter
        if within(bar, *full):
            for b in range(4):
                add(drums_k, at(bar, 4 * b), K); kick_times.append(at(bar, 4 * b))
        elif bar in (BREAK[1] - 2, BREAK[1] - 1):
            for s in range(0, 16, 2):
                g = 0.35 + 0.4 * ((bar - (BREAK[1] - 2)) * 8 + s / 2) / 16
                add(drums_k, at(bar, s), filt(K, 'lowpass', 900) * g)
        # clap on 2 and 4 in the drops
        if within(bar, *full):
            for s in (4, 12): add(clap_t, at(bar, s), C)
        # hats: offbeat 8ths loud, the other 16ths soft; a 32nd roll closing every 4th bar; open hats in A2 and B2
        if within(bar, *full) or within(bar, INTRO, OUTRO) or bar >= BREAK[1] - 2 and within(bar, BREAK):
            soft = within(bar, INTRO, BREAK, OUTRO)
            for s in range(16):
                if bar % 4 == 3 and s >= 12 and within(bar, *full):
                    for h in (0, 0.5): add(hats, at(bar, s + h), hat(accent=0.55 + 0.1 * (s - 12)))
                    continue
                acc = 1.0 if s % 4 == 2 else 0.33
                if soft and s % 4 != 2: continue
                add(hats, at(bar, s), hat(open_=within(bar, DROP_A2, DROP_B2) and s % 4 == 2, accent=acc * (0.6 if soft else 1)))
        # the riff: A in the intro and drop A; B in drop B; both (B an octave up, quiet) in A2 and B2
        if within(bar, INTRO, DROP_A, DROP_A2, BREAK, OUTRO): rows = [(RIFF_A, 1.0, 0)]
        else: rows = [(RIFF_B, 1.0, 0)]
        if within(bar, DROP_A2): rows.append((RIFF_B, 0.28, 12))
        if within(bar, DROP_B2): rows.append((RIFF_A, 0.30, 12))
        for R, g, tr in rows:
            notes = R[ch]
            for i, (s, nt) in enumerate(notes):
                nxt = notes[i + 1][0] if i + 1 < len(notes) else 16 + R[(ch + 1) % 4][0][0]
                cb = cowbell(nt + tr, (nxt - s) * STEP)
                add(riff, at(bar, s), cb * g)
                if tr == 0: add(riff_lo, at(bar, s), cowbell(nt - 12, (nxt - s) * STEP) * 0.5)
        # the pad: the bar's chord, 3 detuned saws a tone, overlapping into the next bar
        n = int((BAR + 0.25) * SR); t = tt(n)
        chord = np.zeros(n)
        for nt in PAD[ch] + [PAD[ch][-1] + 12]:            # the chord and its top note an octave up: a dense wall
            for det in (-0.12, -0.06, 0.0, 0.05, 0.11):
                chord += saw(np.full(n, midi(nt + det)), rng.random())
        env = np.minimum(1, t / 0.08) * np.minimum(1, (t[-1] - t) / 0.22)
        chord = filt(np.tanh(3.5 * filt(chord / 20, 'lowpass', 6000) * env), 'highpass', 180)
        add(pad, at(bar), chord * (0.4 if within(bar, BREAK) else 0.55 if within(bar, INTRO, OUTRO) else 1.0))

    # the 808: one long voice, a note a bar on the root, re-struck on step 10; on step 14 it slides up an octave
    # (legato: the slide keeps the step-10 note's envelope)
    f = np.full(N, midi(ROOTS[0] - 12)); amp = np.zeros(N); glide = np.zeros(N, bool)
    ramp = int(0.004 * SR)
    for bar in range(BARS):
        if within(bar, INTRO, OUTRO): continue
        r = midi(ROOTS[bar % 4] - 12)
        brk = within(bar, BREAK)
        lvl = 0.4 if brk else 1.0
        strikes = ((0, 16),) if brk else ((0, 10), (10, 16))
        for s0, s1 in strikes:                          # the amplitude: each strike decays slowly, a short dip before the next
            a, b = at(bar, s0), at(bar, s1); tl = tt(b - a)
            e = np.minimum(1, tl / 0.004) * np.exp(-tl / 2.2) * lvl
            e[-ramp:] *= np.linspace(1, 0.4, ramp)
            amp[a:b] = e
        f[at(bar, 0):at(bar, 16)] = r
        if not brk:
            a, b = at(bar, 14), at(bar, 16); f[a:b] = 2 * r; glide[a:b] = True
    # portamento: the octave slide takes about 30 ms (a one-pole glide on log frequency); other changes jump
    lf = np.log(f); a1 = np.exp(-1 / (0.03 * SR))
    sm = signal.lfilter([1 - a1], [1, -a1], lf, zi=[lf[0] * a1])[0]
    lf = np.where(glide, sm, lf)
    ph = 2 * np.pi * np.cumsum(np.exp(lf)) / SR
    sub = np.sin(ph)
    grit = filt(filt(np.tanh(6.0 * np.sin(ph) + 1.5 * np.sin(2 * ph)), 'lowpass', 2800), 'highpass', 70, 4)   # its harmonics only
    sub, grit = sub * amp, grit * amp

    # fx: an impact on each drop, a riser and a snare roll into drops A and B, a downlifter into the breakdown
    for b0 in (DROP_A[0], DROP_B[0]): add(fx, at(b0), impact() * 0.8)
    add(fx, at(DROP_A[0] - 2), riser(at(2)) * 0.5)
    add(fx, at(DROP_B[0] - 2), riser(at(2)) * 0.6)
    for bar in (DROP_B[0] - 2, DROP_B[0] - 1):           # the snare roll: 8ths, then 16ths, then 32nds
        k = bar - (DROP_B[0] - 2)
        for s in (np.arange(0, 16, 2) if k == 0 else np.r_[np.arange(0, 8, 1), np.arange(8, 16, 0.5)]):
            g = 0.25 + 0.6 * (k * 16 + s) / 32
            add(fx, at(bar, s), snare_hit(g))
    add(fx, at(BREAK[0]), downlifter(at(1)) * 0.6)

    # the filters: the riff opens through the intro, dims in the breakdown, closes in the outro; the pad likewise
    cut = np.full(N, 9000.0)
    i0, i1 = at(INTRO[0]), at(INTRO[1]); cut[i0:i1] = 700 * (12 ** np.linspace(0, 1, i1 - i0))
    b0, b1 = at(BREAK[0]), at(BREAK[1]); cut[b0:b1] = np.r_[np.full(at(6), 1100.0), 1100 * (8 ** np.linspace(0, 1, (b1 - b0) - at(6)))]
    o0 = at(OUTRO[0]); cut[o0:] = 9000 * (0.06 ** np.clip(np.linspace(0, 1.4, N - o0), 0, 1))
    riff = sweep_lp(riff, cut); riff_lo = sweep_lp(riff_lo, cut); pad = sweep_lp(pad, np.minimum(cut, 5000))

    # the sidechain: everything but the kick and clap ducks on each kick and swells back over ~0.55 beat
    sc = np.ones(N); rel = int(0.27 * SR); shape = 1 - (1 - np.linspace(0, 1, rel)) ** 2
    for k0 in kick_times:
        seg = sc[k0:k0 + rel]; seg[:] = np.minimum(seg, shape[:len(seg)])
    duck = lambda d: 1 - d * (1 - sc)

    # stereo: the riff and pad wide (opposite small delays), hats a little off-centre, the bass and kick mono
    def wide(x, ms):
        d = int(ms / 1000 * SR); y = np.zeros(len(x)); y[d:] = x[:-d]
        return np.stack([x * 0.92 + y * 0.18, y * 0.92 + x * 0.18], 1)
    mono = lambda x: np.stack([x, x], 1)
    stems = {'kick': mono(drums_k), 'sub': mono(sub * duck(0.85)), 'grit': mono(grit * duck(0.85)), 'clap': mono(clap_t),
             'riff': wide(riff * duck(0.45), 9), 'riff_lo': mono(riff_lo * duck(0.6)), 'pad': wide(pad * duck(0.88), 13),
             'hats': np.stack([hats * 0.9, hats], 1) * duck(0.3)[:, None], 'fx': mono(fx)}
    sends = {'riff': 0.5, 'clap': 0.6, 'pad': 0.4}
    return stems, sends, at(BARS)


# the band balance of the style (percent of power per band), measured on the reference's preview at normal speed:
# a dense, distorted wall, not a sub-heavy one; the mix's levels are fitted to it (fit_gains)
BANDS = [(20, 60), (60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]
TARGET = np.array([20.1, 25.6, 12.3, 11.4, 12.5, 7.3, 5.5, 4.3, 0.5])


def band_power(x):
    f, p = signal.welch(x.mean(axis=1), SR, nperseg=8192)
    return np.array([p[(f >= a) & (f < b)].sum() for a, b in BANDS])


# each stem's level relative to the kick: a musical default, and the range the fit may move it in
PRIOR = {'sub': (0.6, 0.3, 1.0), 'grit': (0.9, 0.4, 3.0), 'clap': (0.45, 0.25, 0.8), 'riff': (0.9, 0.4, 1.6),
         'riff_lo': (0.2, 0.08, 0.5), 'pad': (0.35, 0.15, 1.4), 'hats': (0.8, 0.3, 3.0)}


def fit_gains(stems, regions):
    """each stem's level, so that the drops' band balance comes close to TARGET (log error per band), held near the
    musical defaults (PRIOR) and inside their ranges; the kick stays at 1"""
    from scipy.optimize import minimize
    names = [k for k in stems if k != 'fx']
    A = np.array([sum(band_power(stems[k][a:b]) for a, b in regions) for k in names])     # stems x bands
    t = TARGET / TARGET.sum(); w = np.array([1, 1, 1, 1, 1, 1, 1, 0.6, 0.15])
    ik = names.index('kick')
    rest = [k for k in names if k != 'kick']
    prior = np.log([PRIOR[k][0] for k in rest])
    def err(lg):
        g2 = np.exp(2 * np.insert(lg, ik, 0.0)); P = g2 @ A; P = P / P.sum()
        return float((w * (np.log(P + 1e-9) - np.log(t + 1e-9)) ** 2).sum() + 0.15 * ((lg - prior) ** 2).sum())
    r = minimize(err, prior, method='L-BFGS-B', bounds=[(np.log(PRIOR[k][1]), np.log(PRIOR[k][2])) for k in rest])
    g = dict(zip(names, np.exp(np.insert(r.x, ik, 0.0))))
    P = np.array([g[k] ** 2 for k in names]) @ A
    print('levels:', ', '.join(f'{k} {v:.2f}' for k, v in g.items()))
    print('bands :', ' '.join(f'{100 * v:.1f}' for v in P / P.sum()), '(target', ' '.join(f'{v:.1f}' for v in TARGET) + ')')
    return g


def reverb_ir(seconds, rt60, bright=0.55, predelay=0.022):
    n = int(seconds * SR); t = tt(n)
    env = np.exp(-6.91 * t / rt60)
    ir = []
    for ch in range(2):
        noise = rng.standard_normal(n)
        dark = filt(noise, 'lowpass', 1800)
        a = np.exp(-t / bright)                                  # the tail darkens as it decays
        x = (a * filt(noise, 'lowpass', 9000) + (1 - a) * dark) * env
        x = np.r_[np.zeros(int(predelay * SR)), x]
        ir.append(x / np.sqrt((x ** 2).sum()))
    return np.stack(ir, 1)


def convolve(x, ir):
    return np.stack([signal.oaconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)


def write_wav(path, x):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', path],
                   input=np.ascontiguousarray(x, dtype='<f4').tobytes(), check=True)


def lufs(x):
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, 'a.wav'); write_wav(p, x)
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
    return float(json.loads(r[r.rindex('{'):r.rindex('}') + 1])['input_i'])


def master(x, name, target=-10.0, tp=-1.2):
    """the genre is loud: glue saturation, -10 LUFS by one gain, a soft clip, then a 4x-oversampled true-peak limiter"""
    x = filt(x, 'highpass', 28, 2)
    x = x * 10 ** ((-16.0 - lufs(x)) / 20)                       # a sane level before the glue saturation
    x = np.tanh(1.15 * x) / np.tanh(1.15)
    x = x * 10 ** ((target - lufs(x)) / 20)
    x = np.tanh(x / 0.95) * 0.95                                  # the soft clip that gives phonk its edge
    x = x * 10 ** ((target - lufs(x)) / 20)
    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, 'm.wav'); write_wav(raw, x)
        wav = os.path.join(ROOT, 'fit', name + '.wav'); mp3 = os.path.join(ROOT, 'fit', name + '.mp3')
        af = f'aresample={4 * SR},alimiter=limit={10 ** (tp / 20):.4f}:attack=1:release=50:level=disabled,aresample={SR}'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', af, '-c:a', 'pcm_s16le', wav], check=True)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '320k',
                        '-metadata', 'title=Midnight Drift' + (' (slowed)' if 'slowed' in name else ''),
                        '-metadata', 'artist=Marsad motion (original, synthesized)', mp3], check=True)
    return wav, mp3


def main():
    stems, sends, end = song()
    drops = [(at(a), at(b)) for a, b in (DROP_A, DROP_A2, DROP_B, DROP_B2)]
    g = fit_gains(stems, drops)
    g['fx'] = 0.45
    mix = sum(stems[k] * g[k] for k in stems)
    send = sum(stems[k] * g[k] * v for k, v in sends.items())
    room = reverb_ir(2.2, 1.6, bright=0.4)
    mix = mix + convolve(send, room) * 0.22
    tail = end + int(2.0 * SR)
    mix = mix[:tail]
    fo = int(2.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
    print('normal:', master(mix, 'midnight-drift'))
    # the slowed edit, made as they are: played at 0.9x (slower and about 1.8 semitones lower), then a big dark reverb
    slow = signal.resample_poly(mix, 10, 9, axis=0)
    hall = reverb_ir(4.0, 3.2, bright=0.5, predelay=0.03)
    wet = convolve(filt(slow, 'highpass', 180, 2), hall)
    slow = filt(slow, 'lowpass', 9000, 2) + wet * 0.30
    print('slowed:', master(slow, 'midnight-drift-slowed'))


if __name__ == '__main__':
    main()
