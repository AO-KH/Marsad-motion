---
name: marsad-demo
description: Make or change a Marsad product video, meaning a short feature demo or a step-by-step walkthrough of the Marsad web app (مرصد). It renders in 16:9 and 9:16 with music, bilingual English/Arabic captions and no voiceover, using the demo engine in the AO-KH/Marsad-motion repo. Use this skill whenever someone asks for a demo, walkthrough, tutorial, how-to, explainer, onboarding clip, feature or product video, promo, reel or social clip that shows Marsad screens or a Marsad workflow. Also use it to edit, retime, reframe, translate or re-render an existing one, even if they never say "demo".
---

# Marsad demo videos: the baseline

This skill is the standard way to make a Marsad product video. Its quality bar is the polished reference
walkthrough, `demos/decisions-walkthrough/` ("Approve a recommendation", 60 s, both formats). The reference short
demo is `demos/pulse-short/` (30 s). `DEMOS.md` in the repo is the manual (engine API, pages, music, QA). This skill
gives the procedure and the quality bar. Its two reference files hold the details:

- `references/walkthrough-anatomy.md`: the reference walkthrough beat by beat, and why each choice was made. Read it
  before storyboarding.
- `references/quality-bar.md`: the review checklist and the defects we have already hit, with their fixes. Read it
  before you review stills.

Out of scope: ads and films (the 63 s and 54 s campaign films, the Monitor film). They follow their own briefs
(`HANDOFF.md`, `films/monitor/README.md`), which allow things demos never do, such as cuts on the beat and a dark
stage.

## 0. Where you work

Work in the **AO-KH/Marsad-motion** repo on `main`. The client approved pushing there and pulls it on Windows
into `C:\Users\aomar\Desktop\Marsad motion`. If you are not in it, clone it with
`git clone https://github.com/AO-KH/Marsad-motion`. Setup:

- `npm install`: installs Playwright. Chromium comes from `$CHROMIUM_PATH`, `/opt/pw-browsers/chromium`, or
  `npx playwright install chromium`.
- `ffmpeg`, and Python 3 with `numpy` and `Pillow`.
- On Windows (Git Bash): `PYTHON=python bash build_demo.sh <slug>`.

With no shell or repo (for example in a plain chat), you can still do the brief, the storyboard and `demo.js`.
Say that rendering needs the repo, and don't pretend to have rendered anything.

## 1. The rules, and why they exist

Each rule was a correction from the client or a lesson from a delivered video. Apply them to every frame.

- **The app as it really is.** Use the web app's light UI with its soft purple glow and glass icons, on real
  pages from the site kit, and end on the logo end card. Viewers are buying the product, so they should see the
  product.
- **Show the truth.** Never invent features, flows, labels or numbers the product doesn't have. Keep the app's
  exact UI text. Sample data is fictional but plausible, with no real customer names. If a feature isn't in the
  site kit, get screenshots (see §2) rather than guessing.
  - If nobody can supply them, rebuild the screen from site-kit pieces with as few changes as possible.
  - List every element you had to invent (a row, a pill, a label, a route) in your delivery message, so the client
    can confirm it before the video is used.
- **Bilingual.** Every title, caption, step and callout has an English line and a natural Arabic line. Write the
  Arabic as its own sentence, not a word-for-word translation.
- **Western digits (0–9) in both languages**, in captions, callouts and the steps rail. The client's own brief
  says digits stay Western, and the app's cards use them (for example «ثقة 80%»). Inside site-kit pages, keep
  whatever the real page shows. Text you add to a page (an injected card, a rebuilt row) uses the digits of its
  neighbours on that page.
- **Calm pace.** Entrances take 0.6–1.0 s on a decelerating ease, and camera glides take 1–1.5 s. Nothing pops or
  snaps. A caption holds for about two bars (5 s) or more.
- **No shaking, no pulsing, no cuts.** No camera shake, wiggles, bobbing or overshoot; nothing throbs to the beat;
  views glide and never jump. The engine has none of these on purpose, so don't add them with `M.track`.
- **Music and captions, no voiceover.** Both **16:9 (1920×1080)** and **9:16 (1080×1920)** come from one script.
- **Readable on a phone.** Whatever the caption talks about must be big enough to read in 9:16. See §4.
- **Nothing covers what it explains.** The cursor lands beside a label, never on it. A callout box never sits on
  the title, button or number it explains.
- **Final renders have motion blur.** `build_demo.sh` does this by default. `SUB=1` is for drafts only.

## 2. Brief

Get these, asking only for what you can't infer, in one short round:

1. **The workflow or feature**, and the one thing the viewer should take away.
2. **Kind and length.** A short demo runs 20–60 s: a title, 2–4 ideas and an end card. A walkthrough runs
   40 s – 3 min: a title, 3–7 numbered steps, an outro and an end card. Three steps make about 41 s.
3. **Formats.** Both, unless told otherwise.
4. **Music.** Use `fit/product-video.mp3` (the default; both references use it), `fit/stylish.mp3`, or a licensed
   track the client supplies. New tracks need `python3 tools/beats.py <file>` (DEMOS.md §7).
5. **Screens.** Check DEMOS.md §6.1 for the site-kit pages. A new feature needs screenshots, which you then rebuild
   as a custom page (preferred, because text stays sharp when zoomed) or use as-is (DEMOS.md §6.3).

## 3. Storyboard on the beat grid

Plan before writing code, and show the plan to the client when the brief was loose. Lay out one row per beat
range, with the time, the caption (EN / AR) and what happens on screen. `M.B(k)` is beat k; bars start at
`B(0)`, `B(4)`, and so on.

- **Walkthrough:** give each step 12 beats (3 bars; 8.2 s at 88 BPM) with one action. Follow the reference's rhythm:
  - The caption and a focus glide open the step.
  - The action lands on beat +3.
  - The result shows right after.
  - The cursor leaves on +5.
  - A highlight or callout holds until +10.5.
  - The caption ends at +11.5, 0.5 s before the next step.
- **Two common variants:**
  - **Typing:** click on +3, then type from +4. The field lights up 0.5 s before the first letter, so typing can't
    start with the click. Results arrive from +5.
  - **A click that opens another page:** glide out to the new page as it fades in (+3.5, about 1.4 s), rather than
    holding the zoomed view. The new page is the result.
- **Where the end card lands** (the anatomy has the table): with `product-video.mp3`, 3 steps put it on k52
  (41 s), 4 steps on k68 (52 s), and 5 steps on k80 (60 s).
- **Short demo:** a title of about 2 bars, then 2–4 ideas of 2–3 bars each with one caption each, then the end
  card (about 3 bars; it needs 4 s to finish its entrance).
- **Beats:** put the big moments on the music's section changes (DEMOS.md §7 lists them per track), and clicks and
  entrances on beats or 8ths. Nothing may repeat on every beat.
- **Captions:**
  - English captions are short and plain: a verb first for steps ("Open Decisions"), at most about 6 words.
  - The outro is one line that states the benefit.
  - Arabic step captions use the imperative (افتح، اختر، راجع، اعتمد).

`references/walkthrough-anatomy.md` has the reference's full beat map to copy and adapt.

## 4. Write demo.js

Start by copying the closest reference:

```bash
cp -r demos/decisions-walkthrough demos/<slug>     # walkthrough
cp -r demos/pulse-short demos/<slug>               # short demo
```

Edit `demo.json` (title, duration, music), then write the timeline against the API in DEMOS.md §5. Per step,
`focus` the subject, then act (`click`, `type`, `toggle`, `show`), then point at the result (`highlight`,
`callout`, `count`, `text`). End with `M.endcard(...)` and `M.start()`.

Frame each format on purpose, using `M.pick(a16x9, a9x16)` (or `v(...)` as in the reference):

- **16:9:** the window shows the whole page at 0.717. Focus at 0.95–1.0 to show a whole card, and at 1.3–1.6 for
  small targets like tabs. An explicit `scale` is used as given.
- **9:16:** the window is a 1000×1000 square, and the page is wider than it. Never shrink a wide card to fit;
  show the part that matters at a scale of at least 1.0, and pan with a second focus for the next part. Arabic
  pages read from the right, so aim right of centre (`dx`).
  - The bar: the subject's main text reads at about 25 px or more on screen. That means about 1.1 for card titles,
    and 1.3 or more for body text.
  - Name small pills and icons with a callout rather than zooming until they are large.
- **Edges:** in a hold, the window's edge must not slice through a line of text. A sliver of a tab row or a
  half-cut title looks like a mistake. `tools/cutcheck.js` (§5) finds these and prints the nearest clean view
  centre. Set a view centre directly with a zero-size target: `app.focus(t, {x, y, w:0, h:0}, {scale})`.
- **Long pans:** keep each glide under about one window width. A long, fast slide at high zoom strobes even with
  motion blur, so pull back a little, or pan in two moves.
- **9:16 safe zones:** the engine keeps text between about y 220 and 1600, clear of the top and bottom bands that
  TikTok, Reels and Shorts cover with their own UI. Don't move captions or content into those bands.
- **Clicks:** set `{ax, ay}` so the pointer tip lands just under or beside the label. The reference uses
  `{ax:0.2, ay:0.95}` on a tab.
- **Callouts:** at most two boxes on screen at once; highlight rings don't count. Use `side`, `gap` and `dx`/`dy`
  to keep the box off the title, buttons and numbers, and end it before the view moves on. To name three or more
  items, ring the ones English viewers can already read and call out the rest, or call them out one after
  another.
- **Timing:** leave about 2 s after an action before the next camera move, so the viewer sees the result. A
  click that opens a page is the exception (see §3). End each caption at least 0.5 s before the next starts,
  because its fade takes 0.5 s.

## 5. Review stills in both formats

```bash
python3 tools/make_demo.py <slug>
python3 tools/stills.py <slug> 8,11,13,20,23,33,36,47,58,68,80 --beats   # your key beats: each step's start, action, result, hold
```

This writes `style_audit/<slug>-stills-16x9.png` and `…-9x16.png`. Look at both sheets, then open the full-size
still for any doubtful frame (the sheet shows each file's exact time). Go through `references/quality-bar.md`
point by point, fix, and re-check. Most defects show up here, and a still costs seconds while a render costs
minutes.

Then check the edges, which the eye misses on small sheets:

```bash
node tools/cutcheck.js <slug>      # both formats: every hold where the window's edge slices text, with a clean centre
```

Fix every hold it lists, until it prints `clean` for both formats. Its notes about long lines running off the side
are fine, unless that line is the step's subject.

## 6. Build, QA, look

```bash
SUB=1 ./build_demo.sh <slug>      # optional quick draft (no motion blur) to check timing in motion
./build_demo.sh <slug>            # final: both formats, motion blur, QA; about 6–8 min per format for 60 s
```

Both formats must print `RESULT PASS`: pulse at most 1.15 and shake 0. Then open
`style_audit/<slug>-<format>-sheet.png` and look at it. If a check fails, find the cause in the frames it names.
Don't loosen the check.

## 7. Deliver and record

- Send `out/<slug>-16x9.mp4` and `out/<slug>-9x16.mp4`, each under 30 MB, with one line on what each shows.
- If anything on screen was invented (§1), list it in the same message, and say the client needs to confirm it
  before the video is used.
- Commit `demos/<slug>/` and any engine, tool or site-kit change to `main`, and push. Build outputs are
  gitignored.
- If you changed the engine, re-check both references with `tools/stills.py` and `tools/cutcheck.js`.
- Add the video to DEMOS.md §10.

## 8. When the client gives feedback

Treat each correction as a rule for every future video, not a one-off fix. Apply it to the current video, then
write it down where the next video will see it: `CLAUDE.md` (the client's rules), DEMOS.md §2, and this skill (§1
here, or `references/quality-bar.md`). That is how the baseline grows. Also update the repo copy at
`.claude/skills/marsad-demo/` so it matches any installed copy.
