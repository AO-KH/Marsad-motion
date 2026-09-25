"""Sound design for the Marsad campaign film.
Follows OpenMontage sound-design conventions:
  - SFX foreground peaks ~ -12 dBFS, whooshes start ~15ms before the visual
  - music bed reduced: ~16-18 dB below SFX foreground
  - final loudnorm to -14 LUFS / -1.5 dBTP happens in ffmpeg at mux time
"""
import numpy as np

SR = 48000
DUR = 63.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)

def place(sig, t, pan=0.0, gain=1.0):
    """Add mono signal at time t with constant-power pan (-1..1)."""
    i0 = int(t * SR)
    if i0 >= N: return
    seg = sig[:max(0, N - i0)]
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    L[i0:i0 + len(seg)] += seg * gl
    R[i0:i0 + len(seg)] += seg * gr

def env(total, a, d, curve=3.0):
    """attack-decay envelope over `total` seconds; a,d in seconds; exact length int(total*SR)."""
    n = int(total * SR)
    na = min(int(a * SR), n)
    nd = min(int(d * SR), n - na)
    e = np.zeros(n)
    if na: e[:na] = np.linspace(0, 1, na) ** 0.7
    if nd: e[na:na + nd] = np.linspace(1, 0, nd) ** curve
    return e

def sine(f, n, ph=0.0):
    return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)

def gliss(f0, f1, n, shape=1.0):
    t = np.linspace(0, 1, n) ** shape
    f = f0 * (f1 / f0) ** t
    phase = np.cumsum(2 * np.pi * f / SR)
    return np.sin(phase)

def bandnoise(n, f_lo, f_hi):
    """FFT-filtered noise band."""
    x = rng.standard_normal(n)
    X = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    mask = np.exp(-0.5 * ((np.log(freqs + 1) - np.log((f_lo * f_hi) ** 0.5)) /
                          (0.5 * np.log(f_hi / f_lo))) ** 2)
    return np.fft.irfft(X * mask, n)

def norm(x, peak=1.0):
    m = np.max(np.abs(x)) or 1
    return x / m * peak

# ---------------- SFX builders ----------------
def whoosh(dur=0.5, f_lo=180, f_hi=2400, rise=0.42):
    n = int(dur * SR)
    body = bandnoise(n, f_lo, f_hi)
    e = np.concatenate([np.linspace(0, 1, int(n * rise)) ** 1.6,
                        np.linspace(1, 0, n - int(n * rise)) ** 2.2])
    sweep = gliss(f_lo * 1.5, f_hi * 0.5, n) * 0.12
    return norm((body + sweep) * e)

def whoosh_rev(dur=0.5):
    return whoosh(dur, 140, 2000, rise=0.8)[::-1] * 0.9

def tick(f=2400, dur=0.03):
    n = int(dur * SR)
    return norm(sine(f, n) * env(n / SR, 0.001, dur - 0.001, 4)[:n])

def key(fbase=1700):
    n = int(0.045 * SR)
    click = bandnoise(n, 900, 5200) * env(0.045, 0.001, 0.04, 5)[:n]
    tone = sine(fbase, n) * env(0.045, 0.001, 0.02, 6)[:n] * 0.4
    return norm(click + tone)

def pop(f=520, dur=0.16):
    n = int(dur * SR)
    return norm(gliss(f * 0.72, f, n) * env(dur, 0.004, dur - 0.005, 3)[:n])

def blip(f=880, dur=0.09):
    n = int(dur * SR)
    return norm(sine(f, n) * env(dur, 0.002, dur - 0.003, 4)[:n])

def ping(f, dur=0.9):
    n = int(dur * SR)
    s = (sine(f, n) + 0.42 * sine(f * 2, n) + 0.18 * sine(f * 3.01, n))
    shimmer = sine(f * 4.02, n) * 0.06
    return norm((s + shimmer) * env(dur, 0.004, dur - 0.006, 3.4)[:n])

def thump(f=64, dur=0.5, punch=0.5):
    n = int(dur * SR)
    body = gliss(f * 2.2, f, n, 0.4) * env(dur, 0.002, dur - 0.004, 2.6)[:n]
    click = bandnoise(int(0.02 * SR), 700, 3000) * env(0.02, 0.001, 0.018, 5)[:int(0.02 * SR)] * punch
    out = body.copy(); out[:len(click)] += click
    return norm(out)

def snap(i):
    """shield ring snap: thump + metallic tick, rising pitch."""
    f = 90 * (2 ** (i / 9))
    n = int(0.42 * SR)
    body = gliss(f * 2.0, f, n, 0.45) * env(0.42, 0.002, 0.41, 3)[:n]
    tk = sine(1400 * (2 ** (i / 12)), int(0.05 * SR)) * env(0.05, 0.001, 0.045, 4)[:int(0.05 * SR)] * 0.5
    out = body.copy(); out[:len(tk)] += tk
    return norm(out)

def chime_success():
    n = int(1.1 * SR)
    a = ping(880.00, 1.0)   # A5
    b = ping(1108.73, 1.1)  # C#6 (major third up, the song's dominant)
    out = np.zeros(n)
    out[:len(a)] += a * 0.8
    i0 = int(0.14 * SR); out[i0:i0 + len(b)] += b[:n - i0]
    spark = bandnoise(n, 3800, 9000) * env(1.1, 0.01, 1.05, 4)[:n] * 0.08
    return norm(out + spark)

def riser(dur=0.65):
    n = int(dur * SR)
    swell = bandnoise(n, 300, 3600) * (np.linspace(0, 1, n) ** 2.2)
    tone = gliss(160, 640, n, 1.2) * (np.linspace(0, 1, n) ** 2.5) * 0.35
    return norm(swell + tone)

def bloom():
    n = int(2.2 * SR)
    boom = gliss(120, 46, n, 0.35) * env(2.2, 0.004, 2.15, 2.2)[:n]
    shimmer = bandnoise(n, 2400, 9500) * env(2.2, 0.02, 2.1, 3.2)[:n] * 0.16
    chord = (sine(146.83, n) + 0.7 * sine(174.61, n) + 0.6 * sine(220.0, n))   # D minor * env(2.2, 0.05, 2.0, 2.6)[:n] * 0.22
    return norm(boom + shimmer + chord)

def absorb(i):
    f = 300 * (2 ** (i / 10))
    n = int(0.12 * SR)
    return norm(gliss(f, f * 1.6, n) * env(0.12, 0.002, 0.115, 4)[:n])

def swell(dur=0.8, f_lo=200, f_hi=1200):
    n = int(dur * SR)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return norm(bandnoise(n, f_lo, f_hi) * e)

# ---------------- SFX score ----------------
FG = 0.24   # foreground reference amplitude (~ -12dB)

# S1 chaos: tile ticks + slip-off airy whoosh
for i in range(7):
    place(tick(1900 + i * 90, 0.028), 0.15 + i * 0.07, pan=(-0.35 + 0.12 * i), gain=FG * 0.28)
place(whoosh(0.7, 120, 1200, 0.55), 3.28, gain=FG * 0.5)

# scene whoosh S1->S2
place(whoosh(0.5), 4.341, gain=FG * 0.8)      # peaks on beat 4.551 (slide)
# S2 friction
place(pop(560, 0.14), 5.0, gain=FG * 0.55)
t = 5.65
k = 0
while t < 9.25:                       # typing dots, soft alternating
    place(tick(2100 + (k % 3) * 160, 0.022), t, pan=-0.15 + 0.15 * (k % 3), gain=FG * 0.16)
    t += 0.238; k += 1
for s in range(4):                    # clock ticks each second
    place(tick(1250, 0.03), 6.0 + s, gain=FG * 0.22)
place(pop(480, 0.15), 6.5, gain=FG * 0.4)

# S2->S3 + gravity absorbs + ignition
place(whoosh(0.55), 9.433, gain=FG * 0.8)     # peaks on beat 9.658 (zoom-through)
for i in range(7):
    place(absorb(i), 10.75 + i * 0.145, pan=(-0.3 + 0.1 * i), gain=FG * 0.42)
place(thump(58, 0.9, 0.7), 11.585, gain=FG * 1.0)
place(bandnoise(int(0.8 * SR), 2800, 8000) * env(0.8, 0.01, 0.78, 3.5)[:int(0.8 * SR)] * 0.5, 11.62, gain=FG * 0.5)

# S3->S4 ring + node pings (E minor pentatonic rise)
place(whoosh(0.45, 220, 2000), 13.185, gain=FG * 0.55)
for i, f in enumerate([293.66, 349.23, 440.00, 587.33]):   # D minor arpeggio (music is in D minor)
    place(ping(f, 1.0), 14.03 + i * 1.0, pan=[0, 0.3, 0, -0.3][i], gain=FG * 0.62)
place(pop(500, 0.15), 17.75, gain=FG * 0.4)

# S4->S5 model
place(whoosh(0.5), 20.299, gain=FG * 0.75)    # peaks on beat 20.509 (whip)
for i in range(4):
    place(whoosh(0.3, 400, 3000, 0.5), 20.45 + i * 0.12, pan=(-0.4 + 0.27 * i), gain=FG * 0.3)
for i in range(6):
    place(blip(700 + 60 * i, 0.08), 22.25 + i * 0.16, pan=(-0.3 + 0.12 * i), gain=FG * 0.3)
for i in range(8):
    place(tick(2500 + 120 * i, 0.024), 23.1 + i * 0.13, pan=(0.3 - 0.09 * i), gain=FG * 0.2)
place(pop(500, 0.15), 25.05, gain=FG * 0.4)

# S5->S6 contract + spinner + content
place(whoosh_rev(0.6), 26.835, gain=FG * 0.6)
place(pop(640, 0.14), 27.42, gain=FG * 0.45)
place(pop(520, 0.16), 28.635, gain=FG * 0.42)
for i in range(3):
    place(pop(620 + i * 60, 0.11), 29.35 + i * 0.14, pan=0.1 - 0.1 * i, gain=FG * 0.3)

# S6->S7 decisions
place(whoosh(0.4, 260, 2400), 34.385, gain=FG * 0.55)
for i in range(4):
    place(blip(760 + i * 70, 0.07), 35.2 + i * 0.09, pan=0.25 - 0.16 * i, gain=FG * 0.26)
place(swell(0.7, 180, 1000), 36.45, gain=FG * 0.35)
place(blip(980, 0.06), 38.66, gain=FG * 0.3)            # hover
# click: crisp double transient
click = np.concatenate([key(2000), np.zeros(int(0.035 * SR)), key(1500) * 0.6])
place(click, 38.805, gain=FG * 0.95)
place(chime_success(), 39.235, gain=FG * 0.8)
place(pop(480, 0.15), 39.9, gain=FG * 0.38)

# S7->S8 shield
place(whoosh_rev(0.55), 41.585, gain=FG * 0.6)
for i in range(6):
    place(snap(i), 42.09 + i * 0.35, pan=(-0.12 + 0.05 * i), gain=FG * 0.66)
place(swell(1.0, 140, 900), 46.15, gain=FG * 0.3)
place(pop(500, 0.15), 46.285, gain=FG * 0.36)

# S8->S9 ask + typing + stream
place(whoosh(0.5), 48.385, gain=FG * 0.75)
tt = 49.55; ki = 0
while tt < 51.32:
    jitter = 0.062 + 0.05 * ((ki * 37 % 11) / 11)
    place(key(1500 + (ki * 53 % 7) * 90), tt, pan=-0.1 + 0.02 * (ki % 5), gain=FG * 0.34)
    tt += jitter; ki += 1
place(blip(1040, 0.09), 51.55, gain=FG * 0.4)           # send
st_ = 52.05
for i in range(14):                                     # answer streams in
    place(tick(2300 + (i % 4) * 150, 0.02), st_ + i * 0.165, pan=0.12, gain=FG * 0.15)
place(pop(560, 0.13), 54.6, gain=FG * 0.32)

# S9->S10 logo bloom
place(riser(0.65), 54.95, gain=FG * 0.55)
place(bloom(), 55.585, gain=FG * 1.0)
place(pop(440, 0.16), 56.75, gain=FG * 0.3)
place(pop(470, 0.15), 57.75, gain=FG * 0.28)
place(pop(500, 0.15), 58.75, gain=FG * 0.28)

sfx = np.stack([L, R])

# ---------------- music bed (reduced) ----------------
ML = np.zeros(N); MR = np.zeros(N)

def pad_chord(freqs, t0, t1, amp):
    n0, n1 = int(t0 * SR), int(min(t1, DUR) * SR)
    n = n1 - n0
    if n <= 0: return
    x = np.zeros(n)
    for j, f in enumerate(freqs):
        det = 1 + (j - 1) * 0.0012
        x += sine(f * det, n, ph=j * 1.3) * (0.9 - 0.18 * j)
    # slow amplitude LFO + edge fades
    lfo = 0.8 + 0.2 * np.sin(2 * np.pi * 0.09 * (np.arange(n) / SR) + t0)
    fade = np.ones(n)
    fe = int(min(2.2 * SR, n // 2))
    fade[:fe] *= np.linspace(0, 1, fe) ** 1.5
    fade[-fe:] *= np.linspace(1, 0, fe) ** 1.5
    x = x * lfo * fade * amp
    ML[n0:n1] += x; MR[n0:n1] += x * 0.94 + np.roll(x, 220) * 0.06

# Am -> F -> C -> A open-fifth (hijaz section) -> Am
pad_chord([110.00, 164.81, 220.00, 261.63], 0.0, 21.0, 0.30)     # A2 E3 A3 C4
pad_chord([87.31, 130.81, 174.61, 220.00], 20.2, 42.4, 0.30)     # F2 C3 F3 A3
pad_chord([130.81, 196.00, 261.63, 329.63], 41.6, 49.2, 0.30)    # C3 G3 C4 E4
pad_chord([110.00, 220.00, 329.63], 48.4, 56.4, 0.30)            # A open fifth drone (maqam-friendly)
pad_chord([110.00, 164.81, 220.00, 261.63], 55.6, 63.0, 0.34)    # Am return

# soft clean kick (short sine drop, no noise) — half-time 100 BPM groove from the loop onward
def kick():
    n = int(0.22 * SR)
    f = np.linspace(115, 52, n)
    ph = np.cumsum(2 * np.pi * f / SR)
    return np.sin(ph) * np.exp(-np.arange(n) / (SR * 0.055))
tb = 13.2
while tb < 59.5:
    kseg = kick() * 0.52
    i0 = int(tb * SR); seg = kseg[:max(0, N - i0)]
    ML[i0:i0 + len(seg)] += seg; MR[i0:i0 + len(seg)] += seg
    tb += 1.2

# sine bass following the roots (root on 1, fifth on 3)
def bass_note(f, dur=0.55):
    n = int(dur * SR)
    x = np.sin(2 * np.pi * f * np.arange(n) / SR) + 0.25 * np.sin(2 * np.pi * 2 * f * np.arange(n) / SR)
    e = env(dur, 0.02, dur - 0.03, 2.2)[:n]
    return x * e
BASS_SECS = [(13.2, 20.2, 55.00, 82.41), (20.2, 41.6, 43.65, 65.41), (41.6, 48.4, 65.41, 98.00),
             (48.4, 55.6, 55.00, 82.41), (55.6, 60.5, 55.00, 82.41)]
for t0, t1, froot, ffifth in BASS_SECS:
    tt = t0
    beat = 0
    while tt < t1 - 0.3:
        f = froot if beat % 2 == 0 else ffifth
        bseg = bass_note(f) * 0.34
        i0 = int(tt * SR); seg = bseg[:max(0, N - i0)]
        ML[i0:i0 + len(seg)] += seg; MR[i0:i0 + len(seg)] += seg
        tt += 1.2; beat += 1

# hijaz lead phrase for the Arabic Promise scene (A hijaz: A Bb C# D E F G)
def lead(f, dur, vib=5.5):
    n = int(dur * SR)
    t_ = np.arange(n) / SR
    fm = f * (1 + 0.012 * np.sin(2 * np.pi * vib * t_) * np.minimum(t_ / 0.25, 1))
    ph = np.cumsum(2 * np.pi * fm / SR)
    x = np.sin(ph) + 0.30 * np.sin(2 * ph) + 0.10 * np.sin(3 * ph)
    e = env(dur, 0.09, dur - 0.10, 2.0)[:n]
    return x * e
HIJAZ = [(440.00, 48.95, 0.50), (466.16, 49.55, 0.35), (554.37, 49.95, 0.62), (587.33, 50.75, 0.42),
         (554.37, 51.25, 0.52), (466.16, 52.05, 0.40), (440.00, 52.55, 1.15),
         (659.25, 53.95, 0.50), (587.33, 54.50, 0.62), (440.00, 55.20, 0.90)]
for f, t0, d in HIJAZ:
    x = lead(f, d) * 0.24
    i0 = int(t0 * SR); seg = x[:max(0, N - i0)]
    ML[i0:i0 + len(seg)] += seg * 0.9; MR[i0:i0 + len(seg)] += seg

# plucked arpeggio — musical layer from the loop ignition onward
def pluck(f, dur=0.55):
    n = int(dur * SR)
    tone = sine(f, n) + 0.35 * sine(2 * f, n) + 0.12 * sine(3.001 * f, n)
    return tone * np.exp(-np.arange(n) / (SR * 0.16))

ARP = {'Am': [220.00, 261.63, 329.63, 440.00],
       'F':  [174.61, 220.00, 261.63, 349.23],
       'C':  [196.00, 261.63, 329.63, 392.00],
       'A5': [220.00, 329.63, 440.00, 329.63]}
arp_secs = [(13.2, 20.2, 'Am'), (20.2, 41.6, 'F'), (41.6, 48.4, 'C'), (48.4, 55.6, 'A5'), (55.6, 61.2, 'Am')]
kk = 0
for t0, t1, ch in arp_secs:
    tt = t0
    notes = ARP[ch]
    while tt < t1:
        f = notes[[0, 2, 1, 3][kk % 4]]
        p = pluck(f) * (0.42 + 0.10 * ((kk * 7) % 3))
        i0 = int(tt * SR); seg = p[:max(0, N - i0)]
        pan = 0.28 if kk % 2 else -0.28
        gl = np.cos((pan + 1) * np.pi / 4); gr = np.sin((pan + 1) * np.pi / 4)
        ML[i0:i0 + len(seg)] += seg * gl * 0.34
        MR[i0:i0 + len(seg)] += seg * gr * 0.34
        tt += 0.6; kk += 1

music = np.stack([ML, MR])
# master music fades
fi = int(1.6 * SR); fo = int(2.6 * SR)
fade_m = np.ones(N); fade_m[:fi] = np.linspace(0, 1, fi); fade_m[-fo:] = np.linspace(1, 0, fo)
music *= fade_m

# ---------------- voiceover ----------------
import wave as _wave
def load_vo(path):
    with _wave.open(path) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
    # resample to SR
    n_out = int(len(x) * SR / sr)
    x = np.interp(np.linspace(0, len(x) - 1, n_out), np.arange(len(x)), x)
    # HPF 80 Hz via FFT
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X *= np.clip(fr / 80.0, 0, 1) ** 2
    x = np.fft.irfft(X, len(x))
    # gentle fade edges
    fe = int(0.012 * SR)
    x[:fe] *= np.linspace(0, 1, fe); x[-fe:] *= np.linspace(1, 0, fe)
    return x / (np.max(np.abs(x)) or 1)

import os as _os
_VO_ALL = [
    ('vo/vo01.wav', 0.95), ('vo/vo02.wav', 6.00), ('vo/vo03.wav', 11.75),
    ('vo/vo04.wav', 14.00), ('vo/vo05.wav', 17.90), ('vo/vo06.wav', 21.60),
    ('vo/vo07.wav', 28.90), ('vo/vo08.wav', 36.75), ('vo/vo09.wav', 39.45),
    ('vo/vo10.wav', 42.45), ('vo/vo11.wav', 49.00), ('vo/vo12.wav', 56.10),
    ('vo/vo13.wav', 59.05),
]
VO_CUES = _VO_ALL if _os.environ.get('VO')=='1' else []
VL = np.zeros(N)
for path, t0 in VO_CUES:
    x = load_vo(path)
    i0 = int(t0 * SR); seg = x[:max(0, N - i0)]
    VL[i0:i0 + len(seg)] += seg
vo = np.stack([VL, VL])

# ducking envelope from VO activity (attack 80ms, release 350ms)
act = np.abs(VL)
win = int(0.03 * SR)
act = np.convolve(act, np.ones(win) / win, mode='same')
gate = (act > 0.015).astype(np.float64)
envd = np.zeros(N); g = 0.0
a_up = 1 - np.exp(-1 / (0.08 * SR)); a_dn = 1 - np.exp(-1 / (0.35 * SR))
for i in range(N):
    tgt = gate[i]
    g += (a_up if tgt > g else a_dn) * (tgt - g)
    envd[i] = g
duck_music = 1.0 - 0.65 * envd   # about -9 dB under speech
duck_sfx = 1.0 - 0.42 * envd     # about -4.7 dB under speech

# ---------------- stems (D-minor retune) ----------------
sfx = sfx / (np.max(np.abs(sfx)) or 1) * 0.36
vo = vo * 0.62
np.save('stem_tr_sfx.npy', (sfx * duck_sfx).astype(np.float32))
np.save('stem_tr_vo.npy', vo.astype(np.float32))
np.save('stem_tr_duck.npy', envd.astype(np.float32))
print('D-minor stems written')
