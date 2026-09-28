"""Voiceover and sound effects for a campaign film, mixed under or over its music.

usage: python3 tools/film_audio.py <slug>          speak the VO lines (cached) and list them with their times
       (tools/music_fit.py calls mix() during ./build_demo.sh when film.json has "vo" or "sfx")

film.json (or demo.json) may add, next to "music":
  "vo":  {"voice": 6, "lines": [{"id": "vo1", "text": "Your company's data is everywhere.", "beat": 1, "max": 2.6}, ...]}
         voice 6 is Kokoro "Michael", the English voice the client approved. Each line's first syllable lands on its
         beat (or "at", in seconds). A line longer than "max" seconds is spoken again, faster (up to 3 tries).
         "speed" (default 1.0, never above 1.15) and "gain" (dB) are optional per line. Write numbers and URLs the way they are said:
         "marsad nasl dot com".
  "sfx": [{"type": "whoosh", "beat": 8}, {"type": "tick", "beats": [0.5, 0.75, 1]}, {"type": "chime", "beat": 31.25,
         "gain": -3}, ...]   Types and their parameters: tools/sfx.py. A cue's accent lands on its beat. Keep them
         few and quiet: the client asked for restrained effects.
         A cue can be a sound file instead of a type: {"file": "fit/sfx/glass-press.wav", "beat": 48, "gain": -3}.
         Its peak is set to -3 dBFS, then "gain" applies; its attack lands on the beat ("accent": seconds into the
         file to use another point, e.g. the swell's peak). Licensed files only: record each one in fit/CREDITS.md.
  "sfx_level": the effects' loudness in LUFS (default -25). A film whose only effects are a few transitions can raise it
         (films/film63-launch: -20).
Levels, then the whole mix is mastered to -14 LUFS / -2 dBTP by music_fit.py:
  VO -16 LUFS with its peaks limited to 12 dB over that; music -20 LUFS with VO (-16 without), ducked by up to 8 dB
  while the voice speaks;
  effects -25 LUFS, ducked a little under the voice.
Kokoro needs sherpa-onnx and the model folder kokoro-en-v0_19/ in the repo root (or $KOKORO_DIR); see tools/make_vo.py.
"""
import hashlib, json, os, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import make_demo  # noqa: E402
import sfx as SFX  # noqa: E402

SR = 48000
LEVEL = {'vo': -16.0, 'music_vo': -20.0, 'music': -16.0, 'sfx': -25.0}
DUCK_MUSIC, DUCK_SFX = 0.6, 0.35       # how far the bed and the effects dip while the voice speaks (x (1 - k * env))
MAX_SPEED = 1.15                        # faster than this sounds rushed: a line that still doesn't fit is flagged to shorten
VO_CREST = 12.0                         # the voice's peaks are limited to this many dB over its loudness (speech: 10-14)


def lufs(x):
    """integrated loudness (ffmpeg loudnorm analysis); -70 for silence."""
    if not np.any(np.abs(x) > 1e-6):
        return -70.0
    x = x if x.ndim == 2 else x[:, None]
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, 'a.wav')
        x16 = (np.clip(x, -1, 1) * 32767).astype('<i2')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', str(x.shape[1]), '-i', '-', p],
                       input=x16.tobytes(), check=True)
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
    v = json.loads(r[r.rindex('{'):r.rindex('}') + 1])['input_i']
    return max(float(v), -70.0) if v not in ('-inf', 'inf') else -70.0


def to_level(x, target):
    l = lufs(x)
    return x if l <= -69 else x * 10 ** ((target - l) / 20)


def timer(meta):
    bpm, phase = make_demo.grid(meta)
    def when(c, key='beat'):
        if c.get('at') is not None:
            return float(c['at'])
        if bpm is None:
            sys.exit('cues given in beats need "music" with a bpm; or give "at" in seconds')
        return phase + float(c[key]) * 60.0 / bpm
    return when


# ---------------- voice ----------------
_TTS = None


def tts():
    global _TTS
    if _TTS is None:
        try:
            import sherpa_onnx
        except ImportError:
            sys.exit('VO needs sherpa-onnx: pip install sherpa-onnx (see tools/make_vo.py)')
        m = os.environ.get('KOKORO_DIR', os.path.join(ROOT, 'kokoro-en-v0_19'))
        if not os.path.isfile(os.path.join(m, 'model.onnx')):
            sys.exit(f'VO needs the Kokoro model in {m}: curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/'
                     'tts-models/kokoro-en-v0_19.tar.bz2 && tar xf kokoro-en-v0_19.tar.bz2')
        _TTS = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=f'{m}/model.onnx', voices=f'{m}/voices.bin',
                                                           tokens=f'{m}/tokens.txt', data_dir=f'{m}/espeak-ng-data'),
            num_threads=4)))
    return _TTS


def speak(text, voice, speed):
    """Kokoro take at 48 kHz, 80 Hz high-passed, trimmed to 15 ms before the first syllable and 60 ms after the last."""
    from scipy.signal import butter, resample_poly, sosfilt
    a = tts().generate(text, sid=voice, speed=speed)
    x = np.array(a.samples, dtype=np.float64)
    x = resample_poly(x, SR, a.sample_rate)
    x = sosfilt(butter(2, 80, 'hp', fs=SR, output='sos'), x)
    thr = np.max(np.abs(x)) * 10 ** (-40 / 20)
    on = np.where(np.abs(x) > thr)[0]
    i0, i1 = max(on[0] - int(0.015 * SR), 0), min(on[-1] + int(0.06 * SR), len(x))
    x = x[i0:i1]
    f = int(0.008 * SR)
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    return x


def take(slug, line, voice):
    """a line's take (cached in out/<slug>-vo/): re-spoken faster until it fits its "max" seconds."""
    d = os.path.join(ROOT, 'out', f'{slug}-vo')
    os.makedirs(d, exist_ok=True)
    key = hashlib.sha1(json.dumps([line['text'], voice, line.get('speed', 1.0), line.get('max')]).encode()).hexdigest()[:12]
    npy = os.path.join(d, f"{line['id']}-{key}.npy")
    if os.path.isfile(npy):
        x, sp = np.load(npy), json.load(open(npy + '.json'))['speed']
        return x, sp
    sp = float(line.get('speed', 1.0))
    x = speak(line['text'], voice, sp)
    tries = 0
    while line.get('max') and len(x) / SR > line['max'] and tries < 3 and sp < MAX_SPEED:
        sp = round(min(MAX_SPEED, sp * (len(x) / SR / line['max']) * 1.03), 3)
        x = speak(line['text'], voice, sp)
        tries += 1
    for f in os.listdir(d):                           # drop older takes of this line
        if f.startswith(line['id'] + '-') and not f.startswith(os.path.basename(npy)):
            os.remove(os.path.join(d, f))
    np.save(npy, x)
    json.dump({'text': line['text'], 'speed': sp}, open(npy + '.json', 'w'))
    return x, sp


def voice_stem(slug, vo, n, when, report):
    x = np.zeros(n)
    voice = int(vo.get('voice', 6))
    lines = sorted(vo.get('lines', []), key=lambda l: when(l))
    for i, l in enumerate(lines):
        t = when(l)
        s, sp = take(slug, l, voice)
        s = s * 10 ** (float(l.get('gain', 0)) / 20)
        i0 = int(round((t - 0.015) * SR))           # the take starts 15 ms before its first syllable
        a, k0 = max(0, -i0), max(i0, 0)
        seg = s[a:a + max(0, n - k0)]
        x[k0:k0 + len(seg)] += seg
        end = t + len(s) / SR - 0.015
        nxt = when(lines[i + 1]) if i + 1 < len(lines) else None
        flag = 'OVER max: cut words or give it more beats' if l.get('max') and len(s) / SR > l['max'] + 0.01 else ''
        if nxt is not None and end > nxt - 0.15:
            flag += ' OVERLAPS the next line'
        if end > n / SR:
            flag += ' RUNS PAST the end'
        report.append(f"vo  {l['id']:<6} {t:6.2f}-{end:6.2f}s  speed {sp:<5}  {l['text']}  {flag}".rstrip())
    return x


def limit(x, ceiling_db, look=0.003):
    """a transparent peak limiter: the gain dips around each peak over the peak (look s before and after) and eases back,
    so no sample passes the ceiling. Kokoro's consonants peak about 20 dB over the voice's loudness; left alone they
    force the whole master to be squashed by the loudness normaliser."""
    from scipy.ndimage import minimum_filter1d
    c = 10 ** (ceiling_db / 20)
    g = np.minimum(1.0, c / np.maximum(np.abs(x), 1e-9))
    w = max(1, int(look * SR))
    g = minimum_filter1d(g, 2 * w + 1)
    g = np.convolve(g, np.ones(w) / w, 'same')
    return x * np.minimum(g, 1.0)


def duck_env(x):
    """0..1: how much the voice is speaking (10 ms blocks, 80 ms attack, 350 ms release)."""
    b = int(0.01 * SR)
    nb = len(x) // b + 1
    r = np.sqrt(np.convolve(np.pad(x, (0, nb * b - len(x))) ** 2, np.ones(b) / b, 'same')[::b])
    g = (r > 10 ** (-42 / 20)).astype(float)
    e = np.zeros(nb)
    ka, kr = 1 - np.exp(-1 / 8), 1 - np.exp(-1 / 35)
    for i in range(1, nb):
        e[i] = e[i - 1] + (g[i] - e[i - 1]) * (ka if g[i] > e[i - 1] else kr)
    return np.interp(np.arange(len(x)), np.arange(nb) * b, e)


# ---------------- effects ----------------
_FILES = {}


def sfx_file(path, accent=None):
    """A sound file as an effect: mono at SR, peak -3 dBFS. Its accent (the point that lands on the beat) is its
    attack, where the envelope first reaches 30% of its peak, unless `accent` gives seconds into the file."""
    key = (path, accent)
    if key not in _FILES:
        raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(ROOT, path), '-ac', '1', '-ar', str(SR),
                              '-f', 'f32le', '-'], capture_output=True, check=True).stdout
        x = np.frombuffer(raw, np.float32).astype(np.float64)
        x = x / (np.abs(x).max() + 1e-12) * 10 ** (-3 / 20)
        if accent is None:
            k = int(0.004 * SR)
            e = np.convolve(np.abs(x), np.ones(k) / k, 'same')
            acc = float(np.argmax(e >= 0.3 * e.max())) / SR
        else:
            acc = float(accent)
        _FILES[key] = (x, acc)
    return _FILES[key]


def sfx_stem(cues, n, when, report):
    x = np.zeros((n, 2))
    count = 0
    for c in cues:
        beats = c.get('beats')
        times = [when({'beat': k}) for k in beats] if beats else [when(c)]
        params = {k: v for k, v in c.items() if k not in ('type', 'beat', 'beats', 'at', 'gain', 'pan')}
        for j, t in enumerate(times):
            if c.get('file'):
                s, acc = sfx_file(c['file'], c.get('accent'))
            else:
                s, acc = SFX.make(c['type'], **({**params, 'i': j} if c['type'] == 'absorb' else params))
            s = s * 10 ** (float(c.get('gain', 0)) / 20)
            pan = float(c.get('pan', 0))
            i0 = int(round((t - acc) * SR))
            if i0 >= n:
                continue
            seg = s[max(0, -i0):max(0, n - i0)]
            k0 = max(i0, 0)
            if seg.ndim == 2:                          # a stereo effect (sfx 'air') carries its own panning
                x[k0:k0 + len(seg)] += seg
                count += 1
                continue
            x[k0:k0 + len(seg), 0] += seg * np.cos((pan + 1) * np.pi / 4)
            x[k0:k0 + len(seg), 1] += seg * np.sin((pan + 1) * np.pi / 4)
            count += 1
    report.append(f'sfx {count} hits')
    return x


def mix(slug, meta, bed):
    """bed: the fitted music (n x 2). Returns music + VO + effects at their levels, before the master (music_fit.py)."""
    n = len(bed)
    when = timer(meta)
    report = []
    vo = voice_stem(slug, meta['vo'], n, when, report) if meta.get('vo') else None
    fx = sfx_stem(meta.get('sfx', []), n, when, report) if meta.get('sfx') else np.zeros((n, 2))
    lv = {'music': lufs(bed), 'sfx': lufs(fx)}
    bed = to_level(bed, LEVEL['music_vo'] if vo is not None else LEVEL['music'])
    lv_sfx = float(meta.get('sfx_level', LEVEL['sfx']))       # a film with only a few effects (transitions) can raise them
    fx = to_level(fx, lv_sfx)
    if vo is None:
        out = bed + fx
    else:
        lv['vo'] = lufs(vo)
        vo = to_level(vo, LEVEL['vo'])
        vo = to_level(limit(vo, LEVEL['vo'] + VO_CREST), LEVEL['vo'])   # peaks at most VO_CREST dB over the voice's level
        e = duck_env(vo)[:, None]
        out = bed * (1 - DUCK_MUSIC * e) + fx * (1 - DUCK_SFX * e) + vo[:, None] * np.array([[0.7071, 0.7071]])
    pk = 20 * np.log10(np.max(np.abs(out)) + 1e-9) - lufs(out)
    target = {'vo': LEVEL['vo'], 'sfx': lv_sfx, 'music': LEVEL['music_vo' if vo is not None else 'music']}
    report.append('levels  ' + '  '.join(f'{k} {v:.1f} -> {target[k]:.0f} LUFS'
                                         for k, v in lv.items() if v > -69) +
                  f'  |  peak-to-loudness {pk:.1f} dB' + ('  (high: the master will be limited by more than 3 dB; lower the loudest effect\'s or line\'s "gain")' if pk > 15 else ''))
    print('\n'.join(report))
    return out


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    d, meta, _ = make_demo.load(slug)
    if not meta.get('vo'):
        sys.exit(f'{os.path.relpath(d, ROOT)}: no "vo" lines')
    report = []
    voice_stem(slug, meta['vo'], int(float(meta['duration']) * SR), timer(meta), report)
    print('\n'.join(report))


if __name__ == '__main__':
    main()
