"""The Monitor film's music and sound effects, synthesised to the picture: an original score, so it is cleared for paid use.

usage: python3 films/monitor/audio.py           -> out/monitor-hero.wav (13 s) and out/monitor-bumper.wav (6 s)

120 BPM, a beat is 0.5 s; bars start on the drop at 2.5 s. D minor: i-VI-III-bVII under the story, then the bVII
resolves to D major on the bass hit at 11.0 (the end card). Every sound effect is placed at the moment it belongs to
in monitor.js; the times are listed in CUES. Both files are loudness-normalised to -14 LUFS, -1.5 dBTP.
"""
import json, os, subprocess, tempfile
import numpy as np
import scipy.signal as sg

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SR = 48000
LEN = 14.5                                   # the hero is 13 s; the bumper reuses 11.0-13.5
N = int(SR * LEN)
rng = np.random.default_rng(20260919)
DATA = json.load(open(os.path.join(HERE, 'data.json'), encoding='utf-8'))

music = np.zeros((2, N)); sfx = np.zeros((2, N)); send = np.zeros((2, N))   # send: to the reverb


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def add(bus, x, t, pan=0.0, gain=1.0, rv=0.0):
    """Place mono x at t seconds (constant-power pan -1..1); rv also sends it to the reverb."""
    i0 = int(round(t * SR))
    j0 = max(0, -i0)
    x = x[j0:]; i0 = max(0, i0)
    x = x[:max(0, N - i0)]
    lr = np.array([np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)])[:, None] * gain
    bus[:, i0:i0 + len(x)] += lr * x
    if rv:
        send[:, i0:i0 + len(x)] += lr * x * rv


def filt(x, f, kind='low', order=2):
    wn = np.array(f, dtype=float) / (SR / 2)
    return sg.sosfilt(sg.butter(order, np.clip(wn, 1e-4, 0.999), kind, output='sos'), x)


def sweep(x, f_of_t, kind='band', width=0.6, block=256):
    """a filter whose centre moves over time (block-wise, state carried)."""
    y = np.zeros_like(x); zi = None
    for i in range(0, len(x), block):
        fc = float(f_of_t((i + block / 2) / SR))
        wn = [fc * (1 - width / 2), fc * (1 + width / 2)] if kind == 'band' else fc
        sos = sg.butter(2, np.clip(np.array(wn) / (SR / 2), 1e-4, 0.99), kind, output='sos')
        if zi is None or zi.shape[0] != sos.shape[0]:
            zi = np.zeros((sos.shape[0], 2))
        y[i:i + block], zi = sg.sosfilt(sos, x[i:i + block], zi=zi)
    return y


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'Bb': 1, 'B': 2}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o - 4)) / 12)


# ---------------------------------------------------------------- instruments
def pad(notes, t0, t1, gain, cutoff=1800, att=0.35, rel=0.6, pan_spread=0.5):
    d = t1 - t0 + rel
    t = tt(d)
    env = np.minimum(1, t / att) * np.where(t < t1 - t0, 1, np.exp(-(t - (t1 - t0)) / (rel / 3)))
    for k, n in enumerate(notes):
        f = hz(n) if isinstance(n, str) else n
        for v, det in enumerate((-0.12, 0.0, 0.11)):
            ff = f * 2 ** (det / 12)
            x = sg.sawtooth(2 * np.pi * ff * t + rng.uniform(0, 6.28)) * 0.5 + np.sin(2 * np.pi * ff * t) * 0.5
            x = filt(x, cutoff, 'low', 2) * env
            add(music, x, t0, pan=pan_spread * (v - 1) * (1 if k % 2 else -1), gain=gain / len(notes), rv=0.35)


def kick(gain=1.0):
    t = tt(0.45)
    f = 44 + 90 * np.exp(-t / 0.04)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.17)
    click = filt(noise(0.45), 2500, 'high') * np.exp(-t / 0.004) * 0.35
    return (np.tanh(1.8 * body) * 0.95 + click) * gain


def clap(gain=1.0):
    t = tt(0.4)
    env = sum(np.where(t >= s, np.exp(-(t - s) / 0.007), 0) for s in (0, 0.012, 0.024)) + 0.55 * np.exp(-t / 0.1) * (t >= 0.024)
    return filt(noise(0.4), [900, 4200], 'band') * env * gain


def hat(gain=1.0, dec=0.035):
    t = tt(0.25)
    return filt(noise(0.25), 7500, 'high') * np.exp(-t / dec) * gain


def bass(root, t0, t1, gain, duck_beats=()):
    """a warm sub: sine + saturated octave, ducked on the kicks."""
    t = tt(t1 - t0 + 0.2)
    f = hz(root) if isinstance(root, str) else root
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.tanh(2 * np.sin(2 * np.pi * 2 * f * t))
    env = np.minimum(1, t / 0.02) * np.where(t < t1 - t0, 1, np.exp(-(t - (t1 - t0)) / 0.05))
    duck = np.ones_like(t)
    for b in duck_beats:
        dt = t - (b - t0)
        duck *= np.where(dt >= 0, 1 - 0.65 * np.exp(-dt / 0.11), 1)
    add(music, x * env * duck, t0, gain=gain)


def pluck(f, gain, dec=0.32, bright=5000):
    t = tt(dec * 4)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t / (dec / k ** 0.7)) for k in range(1, 7))
    return filt(x * np.minimum(1, t / 0.003), bright, 'low') * gain


def bell(f, gain, dec=1.1):
    """a soft FM bell (inharmonic, glassy)."""
    t = tt(dec * 3.5)
    idx = 2.2 * np.exp(-t / 0.25)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 1.41 * t)) * np.exp(-t / dec)
    x += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dec * 0.35))
    return x * np.minimum(1, t / 0.002) * gain


def whoosh(dur, f0, f1, gain, peak=0.6):
    t = tt(dur)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1) ** (np.log(0.5) / np.log(peak))) ** 2
    return sweep(noise(dur), lambda s: f0 * (f1 / f0) ** (s / dur), 'band', 0.8) * env * gain


def tick(f=3200, gain=1.0, dec=0.012):
    t = tt(0.06)
    return (np.sin(2 * np.pi * f * t) * 0.7 + filt(noise(0.06), f * 0.8, 'high') * 0.5) * np.exp(-t / dec) * gain


def boom(f0=60, f1=32, dec=0.7, gain=1.0):
    t = tt(dec * 4)
    f = f1 + (f0 - f1) * np.exp(-t / 0.12)
    return np.tanh(1.4 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t / dec) * gain


# ---------------------------------------------------------------- the score
BEATS = [2.5 + 0.5 * k for k in range(15)]                      # 2.5 ... 9.5: the drums play here
KICKS = [b for b in BEATS if b != 3.0]                           # 3.0: the bloom's reverse swell breathes
CLAPS = [b for b in BEATS if round((b - 2.5) / 0.5) % 2 == 1 and b != 3.0]
BARS = [(2.5, ['D3', 'A3', 'E4', 'F4'], 'D2'), (4.5, ['Bb2', 'F3', 'C4', 'D4'], 'Bb1'),
        (6.5, ['F3', 'A3', 'C4', 'G4'], 'F2'), (8.5, ['C3', 'G3', 'D4', 'E4'], 'C2')]
ARP = {'D2': ['D5', 'A4', 'F5', 'A4', 'E5', 'A4', 'F5', 'D5'], 'Bb1': ['D5', 'F4', 'Bb4', 'F4', 'C5', 'F4', 'D5', 'Bb4'],
       'F2': ['C5', 'F4', 'A4', 'F4', 'G5', 'C5', 'A4', 'F4'], 'C2': ['E5', 'G4', 'C5', 'G4', 'D5', 'G4', 'E5', 'C5']}

# intro: a low pad opening up under a soft riser (0-2.5)
pad(['D3', 'A3', 'E4', 'F4'], 0.0, 2.5, 0.16, cutoff=900, att=0.6)
bass('D2', 0.0, 2.5, 0.05)
r = sweep(noise(2.5), lambda s: 300 * (6500 / 300) ** (s / 2.5) ** 1.6, 'band', 0.7)
add(music, r * (tt(2.5) / 2.5) ** 2.2, 0.0, gain=0.1, rv=0.2)
t = tt(2.5)
add(music, np.sin(2 * np.pi * np.cumsum(180 * 2 ** (2.2 * (t / 2.5) ** 1.8)) / SR) * (t / 2.5) ** 3 * 0.5, 0.0, gain=0.05, rv=0.3)

# the drop on the crossing (2.5) through the approval: pad, sub, drums, a light 16th-note arp
for t0, notes, root in BARS:
    pad(notes, t0, t0 + 2.0, 0.13, cutoff=2200 if t0 < 8.5 else 1600)
    bass(root, t0, min(t0 + 2.0, 10.0), 0.16, duck_beats=[b for b in KICKS if t0 <= b < t0 + 2])
    for s in range(16):
        ts = t0 + s * 0.125
        if ts >= 10.0 or 3.0 <= ts < 3.5:
            continue
        n = ARP[root][s % 8]
        add(music, pluck(hz(n), 0.05 * (1.0 if s % 4 == 0 else 0.7)), ts, pan=0.35 if s % 2 else -0.35, rv=0.25)
        add(music, pluck(hz(n), 0.018), ts + 0.375, pan=-0.6 if s % 2 else 0.6, rv=0.3)   # dotted-8th echo
for b in KICKS:
    add(music, kick(), b, gain=0.42)
for b in CLAPS:
    add(music, clap(), b, gain=0.09, rv=0.3)
for b in BEATS:
    add(music, hat(), b + 0.25, pan=0.25, gain=0.05)
    if b >= 4.5:
        add(music, hat(dec=0.02), b + 0.125, pan=-0.3, gain=0.022)
        add(music, hat(dec=0.02), b + 0.375, pan=-0.3, gain=0.022)

# the breakdown: drums out at 10.0, the C chord held and closing, a reverse swell into the end
pad(['C3', 'G3', 'D4', 'E4'], 10.0, 11.0, 0.1, cutoff=900, att=0.05)
bass('C2', 10.0, 10.9, 0.06)
sw = whoosh(1.0, 400, 5000, 1.0, peak=0.97)
add(music, sw, 10.0, gain=0.08, rv=0.4)

# the resolve on the bass hit (11.0): D major, the M and the end line
pad(['D3', 'A3', 'D4', 'E4', 'F#4'], 11.0, 13.6, 0.17, cutoff=2400, att=0.08, rel=1.2)
bass('D2', 11.0, 13.4, 0.12)
add(music, boom(70, 36, 1.1), 11.0, gain=0.55)
add(music, kick(), 11.0, gain=0.5)
for k, n in enumerate(['D5', 'F#5', 'A5', 'D6', 'E6']):
    add(music, pluck(hz(n), 0.07, dec=0.6), 11.0 + 0.125 * k, pan=-0.4 + 0.2 * k, rv=0.45)
add(music, bell(hz('A5'), 0.05, dec=1.6), 11.6, pan=0.1, rv=0.6)

# ---------------------------------------------------------------- sound effects (times from monitor.js)
CUES = {}


def cue(name, t):
    CUES.setdefault(name, []).append(round(t, 3))
    return t


# 2 · the count: a tick on each number between the last sample and the limit (it speeds up), a hit on the crossing
def value(t):
    a, L, c = DATA['samples'][-1], DATA['monitor']['limit'], DATA['monitor']['count']
    if t < 2.5:
        p = min(max((t - 1.58) / (2.5 - 1.58), 0), 1)
        return a + (L - a) * p * p
    p = min(max((t - 2.5) / 0.5, 0), 1)
    return L + (c - L) * (1 - (1 - p) ** 3)


last, lt = int(value(1.5)), -1
for i in range(int(1.5 * SR), int(3.0 * SR), 48):
    s = i / SR; v = int(value(s))
    if v != last and s - lt > 0.028:
        add(sfx, tick(2600 + 900 * (v - DATA['samples'][-1]) / 142, 0.12 if s < 2.5 else 0.07), cue('count tick', s), pan=-0.15)
        lt = s
    last = v
add(sfx, boom(90, 40, 0.5), cue('crossing hit', 2.5), gain=0.5)
add(sfx, filt(noise(0.3), 1800, 'high') * np.exp(-tt(0.3) / 0.04), 2.5, gain=0.18, rv=0.3)
# 3 · bloom: a reverse swell into a bright hit on the cut (3.5)
rs = whoosh(0.5, 600, 9000, 1.0, peak=0.93)
add(sfx, rs, cue('reverse swell', 3.0), gain=0.34, rv=0.5)
add(sfx, boom(80, 38, 0.6), cue('flash hit', 3.5), gain=0.45)
add(sfx, filt(noise(1.2), 3000, 'high') * np.exp(-tt(1.2) / 0.25), 3.5, gain=0.07, rv=0.6)
# 4 · the bell rings twice: a soft two-note chime, not an alarm; the alert slides out; the light trace
add(sfx, bell(hz('A5'), 0.16), cue('bell chime', 3.55), pan=-0.2, rv=0.55)
add(sfx, bell(hz('D6'), 0.12), cue('bell chime', 3.75), pan=-0.1, rv=0.55)
add(sfx, whoosh(0.35, 500, 3000, 0.1), cue('alert out', 3.85), pan=0.1)
add(sfx, whoosh(0.65, 3000, 9000, 0.04, peak=0.4), cue('light trace', 4.3), rv=0.5)
# 5 · a tick per record (2 frames apart), a whoosh as the bracket draws (6.0) and rolls them up (6.3)
for k in range(len(DATA['decision']['evidence'])):
    add(sfx, tick(2000 + 60 * k, 0.1, dec=0.01), cue('record tick', 5.1 + k * 2 / 30 + 0.03), pan=0.3 - 0.05 * k)
add(sfx, whoosh(0.28, 700, 4000, 0.16, peak=0.5), cue('bracket whoosh', 6.0), pan=0.2, rv=0.25)
add(sfx, whoosh(0.34, 2500, 500, 0.14, peak=0.45), cue('roll-up whoosh', 6.3), rv=0.25)
add(sfx, boom(110, 60, 0.12), cue('card lands', 6.62), gain=0.18)
# 6 · approve: the click on the beat (7.5), a soft confirm, the status flip (8.0)
add(sfx, tick(1900, 0.32, dec=0.006) + boom(170, 120, 0.03, 0.3)[:int(0.06 * SR)], cue('click', 7.5), pan=0.15)
add(sfx, tick(2400, 0.12, dec=0.005), cue('click release', 7.58), pan=0.15)
add(sfx, bell(hz('D6'), 0.1, dec=0.7), cue('confirm', 7.66), rv=0.5)
add(sfx, bell(hz('F#6'), 0.08, dec=0.8), cue('confirm', 7.78), rv=0.5)
add(sfx, tick(1500, 0.12, dec=0.008), cue('status flip', 8.0), pan=-0.3)
# 7 · the passport slides in (8.5); the link snaps on with a metallic lock click and a low hit (9.0)
add(sfx, filt(whoosh(0.42, 1500, 6000, 1.0, peak=0.3), 1200, 'high'), cue('paper slide', 8.5), gain=0.14)
lock = np.zeros(int(0.5 * SR))
for s, g in ((0.0, 1.0), (0.022, 0.7)):
    i = int(s * SR); t = tt(0.5 - s)
    ring = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in ((2150, 0.5, 0.09), (3420, 0.35, 0.06), (5710, 0.25, 0.04)))
    lock[i:] += g * (filt(noise(0.5 - s), 3000, 'high') * np.exp(-t / 0.003) * 0.8 + ring)
add(sfx, lock, cue('lock click', 9.0), gain=0.3, rv=0.35)
add(sfx, boom(62, 34, 0.5), cue('low hit', 9.0), gain=0.4)
add(sfx, whoosh(0.5, 4000, 10000, 0.03, peak=0.3), cue('seal shimmer', 9.05), rv=0.6)


# ---------------------------------------------------------------- mix
def reverb(x, rt60=1.7):
    m = int(rt60 * SR); t = np.arange(m) / SR
    out = np.zeros_like(x)
    for c in range(2):
        ir = filt(rng.standard_normal(m), 6500, 'low') * np.exp(-6.9 * t / rt60)
        ir[:int(0.012 * SR)] = 0
        out[c] = sg.fftconvolve(x[c], ir / np.sqrt(np.sum(ir ** 2)))[:x.shape[1]]
    return out


mix = music + sfx + 0.3 * reverb(send)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) / np.tanh(1.4)         # gentle glue on the peaks


def write(path, x):
    x16 = (np.clip(x, -1, 1) * 32767).astype('<i2').T.copy()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', path],
                   input=x16.tobytes(), check=True)


def loudnorm(x, out):
    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, 'mix.wav')
        write(raw, x)
        af = 'loudnorm=I=-14:TP=-1.5:LRA=11'
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', raw, '-af', af + ':print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
        j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
        af2 = (f"{af}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
               f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', af2, '-ar', str(SR), out], check=True)
    print('wrote', os.path.relpath(out, ROOT))


def seg(a, b):
    return mix[:, int(round(a * SR)):int(round(b * SR))]


def fade(x, fin=0.0, fout=0.0):
    x = x.copy(); n = x.shape[1]
    if fin:
        k = int(fin * SR); x[:, :k] *= np.linspace(0, 1, k)
    if fout:
        k = int(fout * SR); x[:, n - k:] *= np.linspace(1, 0, k) ** 1.5
    return x


os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
loudnorm(fade(seg(0, 13.0), fout=0.6), os.path.join(ROOT, 'out', 'monitor-hero.wav'))
xf = int(0.012 * SR)                                              # the bumper: hero 1.5-5.0, then 11.0-13.5
a, b = seg(1.5, 5.0 + 0.012), seg(11.0, 13.5)
a[:, -xf:] *= np.linspace(1, 0, xf); b[:, :xf] *= np.linspace(0, 1, xf)
bump = np.concatenate([a[:, :-xf], a[:, -xf:] + b[:, :xf], b[:, xf:]], axis=1)
loudnorm(fade(bump, fin=0.02, fout=0.6), os.path.join(ROOT, 'out', 'monitor-bumper.wav'))
with open(os.path.join(ROOT, 'out', 'monitor-cues.json'), 'w') as f:
    json.dump(CUES, f, indent=1)
