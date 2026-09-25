"""Find a music track's tempo, beat grid and downbeat (numpy + ffmpeg only), for demo.json.

usage: python3 tools/beats.py <audio file> [--min 70] [--max 180] [--bars 32]

Prints the BPM, the first beat and first downbeat (seconds into the file), a "music" block to paste into
demo.json, and a per-bar loudness map so you can see where the drums come in, where it breaks down, and
where a loop would sit. Check it by ear: events placed on M.B(k) should land on the kick.
"""
import argparse, json, subprocess
import numpy as np

SR, NFFT, HOP = 22050, 1024, 256                 # 11.6 ms hop: fine enough to place beats within a video frame


def decode(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def onsets(x):
    """spectral-flux onset strength (all bands, and a kick band), one value per hop."""
    n = 1 + (len(x) - NFFT) // HOP
    idx = np.arange(NFFT)[None, :] + HOP * np.arange(n)[:, None]
    S = np.abs(np.fft.rfft(x[idx] * np.hanning(NFFT)[None, :], axis=1))
    L = np.log1p(1000 * S)
    flux = np.maximum(0, np.diff(L, axis=0))
    f = np.fft.rfftfreq(NFFT, 1 / SR)
    full, low = flux.sum(1), flux[:, f < 160].sum(1)
    t = ((np.arange(len(full)) + 1) * HOP + NFFT / 2) / SR       # flux[i] belongs to frame i+1's centre
    k = int(SR / HOP)                                             # remove the slow trend (1 s moving mean)
    full = np.maximum(0, full - np.convolve(full, np.ones(k) / k, 'same'))
    return t, full, low


def comb(t, o, period, phases):
    """mean onset strength on the grid phase + k*period, for each phase."""
    ks = np.arange(0, (t[-1] - phases.max()) / period)
    times = phases[:, None] + ks[None, :] * period
    return np.interp(times, t, o).mean(1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('audio')
    ap.add_argument('--min', type=float, default=70)
    ap.add_argument('--max', type=float, default=180)
    ap.add_argument('--bars', type=int, default=48, help='bars to show in the loudness map')
    a = ap.parse_args()
    x = decode(a.audio)
    dur = len(x) / SR
    t, o, low = onsets(x)
    fps = SR / HOP
    # 1) coarse tempo: autocorrelation of the onset curve with a gentle preference for ~120 BPM (avoids octave errors)
    oc = o - o.mean()
    ac = np.fft.irfft(np.abs(np.fft.rfft(oc, 2 * len(oc))) ** 2)[:len(oc)]
    bpms = np.arange(a.min, a.max, 0.25)
    lags = 60 * fps / bpms
    score = np.interp(lags, np.arange(len(ac)), ac) * np.exp(-0.5 * (np.log2(bpms / 120) / 1.0) ** 2)
    bpm0 = bpms[np.argmax(score)]
    # 2) fine tempo + phase: maximise the onset strength sampled on the beat grid
    best = (-1, None, None)
    for bpm in np.arange(bpm0 * 0.97, bpm0 * 1.03, 0.01):
        period = 60 / bpm
        ph = np.arange(0, period, 0.002)
        s = comb(t, o, period, ph)
        i = int(np.argmax(s))
        if s[i] > best[0]:
            best = (s[i], bpm, ph[i])
    _, bpm, beat = best
    period = 60 / bpm
    # 3) downbeat. Sections change on bar lines, so with the right bar phase the loudness jumps between
    #    consecutive bars are sharpest. (Kick emphasis alone misleads: some grooves accent beat 4.)
    nb = int((dur - beat) / period)
    e = np.array([np.sqrt(np.mean(x[int((beat + k * period) * SR):int((beat + (k + 1) * period) * SR)] ** 2)) + 1e-6
                  for k in range(nb)])
    nov = []
    for j in range(4):
        bars = [e[j + 4 * m:j + 4 * m + 4].mean() for m in range((nb - j) // 4)]
        nov.append(np.mean(np.abs(np.diff(np.log(bars)))) if len(bars) > 2 else 0)
    ks = np.arange(nb)
    kick = np.interp(beat + ks * period, t, low)
    kick_ph = [kick[ks % 4 == j].mean() for j in range(4)]
    j = int(np.argmax(nov))
    downbeat = beat + j * period
    conf = max(nov) / (sorted(nov)[-2] + 1e-9)
    bar = 4 * period
    print(f'file      {a.audio}  ({dur:.2f} s)')
    print(f'bpm       {bpm:.2f}   (beat = {period:.5f} s, bar = {bar:.4f} s)')
    print(f'beat      {beat:.3f} s  (first beat)')
    print(f'downbeat  {downbeat:.3f} s  (best guess; evidence {conf:.2f}x the next candidate)')
    print('          The bar phase is a guess: tempo and beats are reliable, downbeats often are not. Candidates:')
    print('          time (s)      ' + '  '.join(f'{beat + i * period:7.3f}' for i in range(4)))
    print('          section jumps ' + '  '.join(f'{nov[i]:7.3f}' for i in range(4)) + '   (loudness change between bars)')
    print('          kick strength ' + '  '.join(f'{kick_ph[i] / np.mean(kick_ph):7.2f}' for i in range(4)))
    print('          Confirm by ear, or print the loudness beat by beat around a section change: sections start on a')
    print('          downbeat. Known: fit/product-video.mp3 0.016, fit/music54.m4a 0.03, fit/stylish.mp3 0.041 (DEMOS.md).')
    print('\n"music": ' + json.dumps({'file': a.audio, 'bpm': round(float(bpm), 2), 'downbeat': round(float(downbeat), 3),
                                     'start': 0.0, 'fade_out': 2.5}))
    # 4) loudness per bar (RMS), to plan sections: intro, drums in, breakdown, loop points
    print('\nbar  beat   time(s)  loudness')
    rms = []
    for b in range(a.bars):
        s0 = downbeat + b * bar
        if s0 + bar > dur:
            break
        seg = x[int(s0 * SR):int((s0 + bar) * SR)]
        rms.append(np.sqrt(np.mean(seg ** 2)))
    top = max(rms) if rms else 1
    for b, r in enumerate(rms):
        print(f'{b:3d}  k{4 * b:<4d} {downbeat + b * bar:7.2f}  {"#" * int(40 * r / top)}')


if __name__ == '__main__':
    main()
