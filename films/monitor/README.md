# Marsad Monitor Film — «مرصد يراقب. وأنت تقرّر.»

A 13 s vertical social ad showing one real Marsad moment. A monitoring rule watches a product's stock; the stock falls
below its reorder level, the rule's alert comes into the bell, a manager approves the decision with a reason, and its
Decision Passport seals it. Cuts on the beat, on a black stage, with an original score and no voice.

**v2 (2026-10-11, "apply this to all other videos")**: every screen is the real app, the client's bilingual front end
in dark mode (its Arabic interface, the MARSAD × Fusion look), captured with sample data (labelled "Sample data ·
بيانات تجريبية"). It tells the Coffee film's story (`films/coffee-launch`: the same product, rule, decision and
passport), cut to 13 s. It also follows the client's rules that came after v1 (`CLAUDE.md`, 2026-09-30): every line in
English and Arabic, captions that carry the story, sound effects on the transitions only (the UI makes no sound), no
wiggle or overshoot (v1's bell swung and its button and seal overshot), and the end with "Book your demo · احجز عرضك
التجريبي" and marsadnasl.com. v1 (rebuilt dark-mode components, a sales-orders story with placeholder numbers) is
commit cb17050.

## Build

```bash
node tools/app_shot.js monitor               # the app's screens -> films/monitor/pages/ (the front end on :3000, or --fe)
python3 films/monitor/make.py --list          # the cuts
films/monitor/build.sh                        # the master: out/monitor-hero-9x16.mp4 (a few minutes)
films/monitor/build.sh hero-9x16-paid bumper-9x16
SUB=1 films/monitor/build.sh                  # a fast draft without motion blur (never delivered)
node render_ab.js build/monitor-hero-9x16.html chk 2.6,4.7,9.6   # stills (after make.py)
```

On Windows (Git Bash): `PYTHON=python bash films/monitor/build.sh`.

The pipeline runs these steps:

1. `make.py` writes `build/monitor-<cut>.html` (with `data.json` and `pages/shots.json`).
2. `audio.py` writes `out/monitor-hero.wav`, `out/monitor-bumper.wav` and `out/monitor-cues.json`.
3. `render_mb.js` (repo root) renders four sub-frames per frame across a 180° shutter, never across a cut; the hero's
   fast camera moves (frames 112–136, 165–199, 226–244 and 255–330) again with 16, which four would leave in steps.
4. `tools/blend.py` averages the sub-frames into motion-blurred frames.
5. ffmpeg encodes the MP4 (crf 18, AAC 192k).
6. `tools/qa.py --cuts …` checks the result: shake 0, with the intended cuts skipped.

| File | What it holds |
|---|---|
| `app/capture.js` | The sample data and the states of the app to capture (`tools/app_shot.js` reads it). |
| `pages/` | The captured crops (PNGs at 5×) and `shots.json`, their boxes in CSS px on their pages. |
| `data.json` | The stock's fall (time and value of each captured state), the captions, the end's lines. |
| `monitor.js` | The nine shots, the camera, depth of field, the renderings over the screens, the captions. Defines `SEEK`, `DURATION`, `STAGE_W/H` and `CUTS`. |
| `monitor.css` | The stage, the renderings, the type and the end (the main theme's capsule). |
| `audio.py` | The score and the effects on the transitions. |

## Cuts (`make.py`)

| Cut | Size | Length | Notes |
|---|---|---|---|
| `hero-9x16` | 1080×1920 | 13 s | **The master**: "Book your demo · احجز عرضك التجريبي" as a line under the URL |
| `hero-9x16-paid` | 1080×1920 | 13 s | The same, "Book your demo" as a button |
| `bumper-9x16` | 1080×1920 | 6 s | Shots 2–4, then 9 (hero 1.5–5.0 s + 11.0–13.5 s) |
| `hero-16x9`, `hero-1x1`, `bumper-16x9` | | | Listed, but not laid out yet: recompose them from the same crops after the master is approved. |

Every line is in English and Arabic since v2, so the English cuts are gone.

## Shots (120 BPM: one beat is 0.5 s, every cut on a beat)

| # | Time (s) | Picture (the app's own screens) | Caption |
|---|---|---|---|
| 1 | 0–1.5 | Fly-over across the coffee's page: its properties card, tilted, its rows written in from the right | A rule watches your stock. · قاعدة مراقبة تراقب مخزونك. |
| 2 | 1.5–3.0 | Close on «المخزون المتاح»: 240 falls as eight orders come in (each value a captured state of the page) and goes below «حد إعادة الطلب» 200 on the drop (2.5): 188 turns amber | It falls below its reorder level. · المخزون ينزل تحت حد إعادة الطلب. |
| 3 | 3.0–3.5 | Closer on the amber 188, overexposing to white; flash cut | |
| 4 | 3.5–5.0 | The header's bell lights; the alert the rule raised comes out of it («قرار بانتظارك…»); a light runs once around it | Marsad raises the alert. · مرصد يرفع التنبيه. |
| 5 | 5.0–7.0 | The decision's card comes up: «مراقبة» lights (a monitoring rule raised it); the camera glides to «موافقة», the hand presses it, the app's confirm dialog opens | The decision comes to you. · والقرار يصلك. |
| 6 | 7.0–8.5 | Close on «تأكيد الموافقة», the reason typed in the field; the hand presses it; the dialog closes in onto the app's «تم بنجاح», its check lit on 8.0 | You approve it, with a reason. · تعتمده مع ذكر السبب. |
| 7 | 8.5–10.0 | The Decision Passport slides in like paper; «#5 تمت الموافقة» comes into its chain under «#4 رُفِع القرار»; up to the green seal «السلسلة سليمة — لا يوجد عبث», lit | Sealed in its Decision Passport. · ويُختم في جواز القرار. |
| 8 | 10.0–11.0 | Pull-back over «قواعد المراقبة» from the rule that raised it, «مخزون القهوة — المستودع المركزي», its row rimmed in violet | |
| 9 | 11.0–13.0 | The rule's row blurs into the M; "Marsad watches. You decide." over «مرصد يراقب. وأنت تقرّر.»; marsadnasl.com in the glowing capsule; "Book your demo · احجز عرضك التجريبي"; a 1 s hold | |

## Music and effects

The music is an original score, synthesised by `audio.py` in numpy, so it is cleared for paid social:

- D minor at 120 BPM, with the bars starting on the drop at 2.5 s.
- The chords run i–VI–III–bVII under the story, with four-on-the-floor drums from 2.5 to 10.0.
- The bVII resolves to D major on the bass hit at 11.0.
- Both files are normalised to −14 LUFS and −1.5 dBTP.

The effects sit on the transitions only: soft whooshes into the cuts at 1.5, 5.0, 7.0 and 10.0, the paper slide at 8.5,
and two cinematic hits, the drop (2.5, the stock below its reorder level) and the flash into the alert (3.0–3.5). To use
a licensed track instead, mux it in place of `out/monitor-hero.wav`. Its drop must land on 2.5 s.

## Truth

- The app's own: the coffee's properties card and its stock row at each value, the header and its bell, the alert in
  the bell, the decision's card, the confirm dialog with its reason, «تم بنجاح», the passport, the rules table. The
  English type name in the record page's header («Product») is framed out.
- Sample data (in `app/capture.js`, the Coffee film's): the product «قهوة عربية مختصة — 1 كجم» (CF-2040, stock 240,
  reorder level 200), the eight orders' quantities, the rule «مخزون القهوة — المستودع المركزي» (hourly) and three more,
  the alert's text, the decision and its insight, the reason typed, the passport's records.
- Renderings: the stage, the camera and depth of field, the rows written in, the amber on 188 and 200 and the ring
  round 188, the bell's light, the light round the alert, the violet on «مراقبة» and on the rule's row, the hand and the
  buttons giving under it, the dialog closing in onto its message, the green on «تم بنجاح» and on the seal, the passport
  sliding in, the captions, the label and the end.
- Changed: the dialogs are drawn centred on the screen as the app means them; the passport is shown from its top, as a
  taller screen shows it.

**To confirm before release:** the captions (drafts), and the end without the voice.
