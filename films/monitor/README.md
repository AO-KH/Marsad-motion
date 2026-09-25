# Marsad Monitor Film — «مرصد يراقب. وأنت تقرّر.»

A 13 s motion film showing one real Marsad moment. A monitor catches sales orders crossing 400 and raises a decision
with its evidence. A manager approves, and the record is sealed. The style follows the Opal concept ad: real UI
components (rebuilt in the product's dark theme) on a black stage, animated data, cuts on the beat, and no voice.

This film follows its own production brief, which overrides the house rules in `CLAUDE.md` where they differ. It uses
a black stage instead of the light UI, cuts on the beat, a bell that swings twice, and a small overshoot on the button
press and the seal snap.

## Build

```bash
python3 films/monitor/make.py --list          # the cuts
films/monitor/build.sh                        # the master: out/monitor-hero-9x16.mp4 (about 4 min)
films/monitor/build.sh hero-9x16-paid hero-9x16-en bumper-9x16
SUB=1 films/monitor/build.sh                  # a fast draft without motion blur
node render_ab.js build/monitor-hero-9x16.html chk 1.6,2.5,7.5   # stills (after make.py)
```

On Windows (Git Bash): `PYTHON=python bash films/monitor/build.sh`.

The pipeline runs these steps:

1. `make.py` writes `build/monitor-<cut>.html`.
2. `audio.py` writes `out/monitor-hero.wav`, `out/monitor-bumper.wav` and `out/monitor-cues.json`.
3. `render.js` renders four sub-frames per frame across a 180° shutter, never across a cut.
4. `blend.py` averages the sub-frames into motion-blurred frames.
5. ffmpeg encodes the MP4 (crf 18, AAC 192k).
6. `tools/qa.py --cuts …` checks the result: shake 0, with the intended cuts skipped.

| File | What it holds |
|---|---|
| `data.json` | Every number and product string on screen. Nothing is typed in the code. |
| `monitor.js` | The nine shots, the camera, depth of field, the overlays and the English captions. Defines `SEEK`, `DURATION`, `STAGE_W/H` and `CUTS`. |
| `monitor.css` | The dark-theme components (glass cards and chips), the cream passport and the fonts. |
| `audio.py` | The score and the sound effects. |

## Cuts (`make.py`)

| Cut | Size | Length | Notes |
|---|---|---|---|
| `hero-9x16` | 1080×1920 | 13 s | **The master**: Arabic, organic end card |
| `hero-9x16-paid` | 1080×1920 | 13 s | Paid end card: adds «احجز عرضك التجريبي» |
| `hero-9x16-en` | 1080×1920 | 13 s | English end line and three captions (shots 2, 4, 7). The UI stays Arabic. |
| `bumper-9x16` | 1080×1920 | 6 s | Shots 2–4, then 9 (hero 1.5–5.0 s + 11.0–13.5 s) |
| `hero-16x9`, `hero-1x1`, `bumper-16x9`, `*-en` | | | Listed, but not laid out yet: recompose them from the same layers after the master is approved (`pick({...})` in `monitor.js`). |

## Shots (120 BPM: one beat is 0.5 s, every cut on a beat)

| # | Time (s) | Picture | Sound |
|---|---|---|---|
| 1 | 0–1.5 | Fly-over across the tilted chart. Bars build right to left, with a dashed limit line and tilt-shift. | Soft riser, low pad |
| 2 | 1.5–3.0 | Macro on today's bar, with a counter tooltip. It goes from the last sample to 400 on the beat at 2.5 (amber hits), then to 513 by 3.0. | A tick per number, the drop and a hit at 2.5 |
| 3 | 3.0–3.5 | Closer on the amber, overexposing to white; flash cut | Reverse swell into a hit |
| 4 | 3.5–5.0 | The header bell swings twice. The alert slides out of it, then a light trace runs once around it. | Two-note chime |
| 5 | 5.0–7.0 | 12 records stack right to left, 2 frames apart. A bracket draws on 6.0 and rolls them up into the decision card. | A tick per record, whooshes |
| 6 | 7.0–8.5 | «موافقة» blurs in and the cursor presses on 7.5 (96%, purple ripple). The button confirms, and the status flips to green on 8.0. | Click, soft confirm tone |
| 7 | 8.5–10.0 | The passport slides in. «تمت الموافقة» snaps under «رُفِع القرار» on 9.0, then the seal glows. | Lock click, low hit |
| 8 | 10.0–11.0 | Pull-back to the rule card, blur on the edges | Drums out |
| 9 | 11.0–13.0 | The rule card blur-morphs into the M. The end line and URL (and the paid CTA) follow, then a 1 s hold. | Bass hit, resolve to D major |

## Music

The music is an original score, synthesised by `audio.py` in numpy, so it is cleared for paid social:

- D minor at 120 BPM, with the bars starting on the drop at 2.5 s.
- The chords run i–VI–III–bVII under the story, with four-on-the-floor drums from 2.5 to 10.0.
- The bVII resolves to D major on the bass hit at 11.0.
- Both files are normalised to −14 LUFS and −1.5 dBTP.

To use a licensed track instead, mux it in place of `out/monitor-hero.wav`. Its drop must land on 2.5 s.

## Before release: values still to confirm (the truth rules)

The brief allows only real states and real numbers. These values in `data.json` are placeholders, each flagged with
a `_PLACEHOLDER` key:

- **`samples`**: the monitor's real samples, oldest first. The last one is where the count starts.
- **`decision.evidence`**: the order references exactly as the passport lists them. The names and the count set the grid in shot 5.
- **`monitor.condition`**: the rule's condition text as the monitors page shows it.
- **`decision.title`**: confirm that the card and the bell use this Arabic title.
- **`captions_en`**: drafts. The brief asks for three small English captions but doesn't give the words.

The dark-theme components were rebuilt without screenshots of the dark mode. Match them against clean dark-theme takes
at 2× before release.
