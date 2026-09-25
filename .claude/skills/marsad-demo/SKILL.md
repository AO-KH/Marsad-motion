---
name: marsad-demo
description: Make a Marsad product demo video (a short feature demo or a step-by-step walkthrough) in 16:9 and 9:16 with this repo's demo engine, with music and bilingual English/Arabic captions and no voiceover. Use when asked for a demo, walkthrough, tutorial, how-to, feature video, promo or social clip of the Marsad app, or to change one.
---

# Making a Marsad demo video

`DEMOS.md` is the reference (API, pages, music, QA). This is the procedure. The client's rules in `CLAUDE.md`
(calm, bilingual, no shaking, no pulsing, no cuts) apply to every frame.

## 1. Brief

Get these, asking only for what you can't infer (one short round of questions):

- **The feature or workflow**, and the one thing the viewer should take away.
- **Kind**: short feature demo (20–60 s) or walkthrough (45 s – 3 min).
- **Formats**: both 16:9 and 9:16 unless told otherwise.
- **Music**: `fit/product-video.mp3` (117 s, 88 BPM; the examples use it), `fit/stylish.mp3` (75 s, 94 BPM),
  `fit/music54.m4a` (54 s, 95.96 BPM), or a licensed track the
  client supplies. Walkthroughs longer than the track use a `loop` (DEMOS.md §7).
- **Screens**: if the feature isn't one of the site-kit pages (DEMOS.md §6.1), ask for screenshots. Then either
  rebuild the screens with site-kit pieces (preferred: sharp when zoomed) or use the screenshots as pages.

## 2. Set up

```bash
cp -r demos/pulse-short demos/<slug>              # short feature demo
cp -r demos/decisions-walkthrough demos/<slug>    # walkthrough
python3 tools/beats.py <music file>               # new music only: bpm, downbeat candidates, loudness per bar
```

Edit `demos/<slug>/demo.json` (title, duration, music). The duration follows the storyboard; round it to the
end of a bar plus the end card.

## 3. Storyboard on the beat grid

Before writing code, lay out one row per idea: beats (`B(k)`), time, caption EN / AR, and what happens on screen.
Show it to the client first when the brief was loose.

- Short: title about 2 bars; 2–4 ideas of 2–3 bars, one caption each; end card about 3 bars (it needs 4 s to
  finish its entrance).
- Walkthrough: title; 3–7 steps of about 3 bars (12 beats); one action per step; an outro caption; end card.
- Put entrances, clicks and page changes on beats or 8ths. Give big moments the downbeats and section changes
  in the music (drums coming in, the return after a breakdown).
- Captions: short, plain, and the Arabic natural (not a word-for-word translation). Use Arabic-Indic digits
  in Arabic text (١٨٪).

## 4. Write demo.js

Follow the example you copied. Per step: `focus` on the subject, then the action (`click`, `type`, `toggle`,
`show`), then `highlight` / `callout` what it produced. Leave about 2 s after each action before the next
focus move. End with `M.endcard(...)` and `M.start()`.

Framing differs by format. 16:9 shows the whole page (0.717); 9:16 shows a square crop (0.943) at the view's
`x`. Arabic pages read from the right, so aim right of centre (`view:{x:1260}`). Use `M.pick(a16x9, a9x16)`
for per-format zoom or offsets, and a 9:16-only focus when a callout's target would be out of frame.

## 5. Check stills in both formats

```bash
python3 tools/make_demo.py <slug>
node render_ab.js build/<slug>-16x9.html chk <t1,t2,...>      # every key moment
node render_ab.js build/<slug>-9x16.html chk9 <t1,t2,...>
```

Look at each still: the subject in frame and readable, captions not clipped, callouts next to their targets
and clear of the steps rail, nothing overlapping. Fix and re-check.

## 6. Build, QA, deliver

```bash
./build_demo.sh <slug>          # both formats; runs tools/qa.py on each
```

Both must print `RESULT PASS` (pace, pulse ≤ 1.15, shake 0). Open `style_audit/<slug>-<format>-sheet.png`.
Send `out/<slug>-16x9.mp4` and `out/<slug>-9x16.mp4` (each under 30 MB) with a one-line summary per video.

## 7. Commit

Commit `demos/<slug>/` (and any engine or site-kit change) to `main` of AO-KH/Marsad-motion and push. If you
changed the engine, rebuild the examples' stills once to make sure they still look right. Add the video to
the list of made demos in `DEMOS.md` §10.
