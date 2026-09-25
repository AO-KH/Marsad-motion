# Regenerate the English voiceover takes (vo/vo01..vo13.wav) with Kokoro v0.19, speaker 6 ("Michael").
# setup:  pip install sherpa-onnx numpy
#         curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-en-v0_19.tar.bz2 && tar xf kokoro-en-v0_19.tar.bz2
# usage:  python3 tools/make_vo.py [vo04 vo05 ...]      (no args = all lines; run from the project folder)
# Each line is re-spoken faster (up to 3 tries) until it fits its time budget. After changing a line,
# re-check its phrase split in audio_stems.py (VO_PLAN) — phrases are found by silence gaps >= 0.18 s.
import sys, wave, numpy as np, sherpa_onnx
M = 'kokoro-en-v0_19'
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=f'{M}/model.onnx', voices=f'{M}/voices.bin',
        tokens=f'{M}/tokens.txt', data_dir=f'{M}/espeak-ng-data'), num_threads=4)))
SID = 6  # Michael
LINES = [("vo01", "Your company's data... is everywhere.", 3.45),
         ("vo02", "And when you need a quick answer — your system makes you wait.", 3.40),
         ("vo03", "Marsad changes that.", 1.40),
         ("vo04", "Connect. Unify. Monitor... and act.", 3.60),
         ("vo05", "One workflow. Fully automated.", 2.20),
         ("vo06", "Marsad turns scattered records into one living model of your business.", 5.00),
         ("vo07", "It watches your business in real time, and turns your numbers into recommendations you can trust.", 5.30),
         ("vo08", "One decision. One click.", 1.85),
         ("vo09", "Decision to action. Nothing in between.", 2.35),      # delivered take: speed 1.2
         ("vo10", "Six layers of defense around your data. Sovereign, and PDPL compliant.", 5.75),
         ("vo11", "Ask in Arabic. The answer comes from your own data.", 4.00),
         ("vo12", "Marsad. One operational nervous system.", 2.90),
         ("vo13", "Request a demo at nasl tech dot com.", 2.45)]        # delivered take: speed 1.12
def gen(name, text, speed):
    a = tts.generate(text, sid=SID, speed=speed)
    x = (np.clip(np.array(a.samples), -1, 1) * 32767).astype(np.int16)
    with wave.open(f'vo/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(a.sample_rate); w.writeframes(x.tobytes())
    return len(x) / a.sample_rate
only = set(sys.argv[1:])
for name, text, lim in LINES:
    if only and name not in only: continue
    sp = 1.0; d = gen(name, text, sp); tries = 0
    while d > lim and tries < 3:
        sp = round(sp * (d / lim) * 1.03, 3); d = gen(name, text, sp); tries += 1
    print(f'{name} {d:5.2f}s (limit {lim}) speed={sp} {"OK" if d <= lim else "OVER"}')
