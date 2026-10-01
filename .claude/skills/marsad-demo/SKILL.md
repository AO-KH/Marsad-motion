---
name: marsad-demo
description: Make or change a Marsad walkthrough, a video that explains one feature of the Marsad web app (مرصد) by using it on screen. It follows Marsad's walkthrough method, Benji Taylor's launch-walkthrough grammar (a camera that dives onto each click in the real app) in Marsad's main theme (a clean dark stage, bilingual type, the capsule end), on the client's launch track, with the app's real screens captured from the client's front end, built with the walkthrough kit in the AO-KH/Marsad-motion repo. Use this skill whenever someone asks for a walkthrough, demo, tutorial, how-to, explainer, onboarding clip, feature or product video, or a short feature clip that shows Marsad screens or a Marsad workflow; whenever they describe a feature of their SaaS to explain or send front-end pages or screenshots for a video; and to edit, retime, reframe, translate or re-render an existing walkthrough, even if they never say "demo".
---

# Marsad walkthroughs: one feature, explained by using it

The client describes a feature of their SaaS (what it does, the steps, the screens), and you make a short video that
explains it by using the real app on screen. The method comes from the client's request: "take these video for the
walk through and take them as reference [Benji Taylor's Live Studio walkthrough, the launch videos at
notes.apoorv.xyz] keep the marsad and NASL theme … i will give you feature of my saas and you make a walkthrough to
explain the feature". What is on screen:

- **The app as it is**, in a window floating on Marsad's dark stage, with soft violet glows and nothing else (no
  lens circles, no stars: the client took both out). The screens are the real app's: the client's front end, run
  with sample data and frozen state by state by `tools/app_snap.js` (its own markup, CSS and text, sharp at 4×).
- **A camera that dives** onto each thing to read or click (2.5–4×), then pulls back for context. It never rests.
- **Real clicks, heard.** The pointer clicks (a hand over what it clicks, the app's hover and press) with the
  client's mouse click, and the app's own states follow: pages, dialogs, messages, typed text, numbers.
- **One short step line at a time**, English · Arabic, in a dark capsule at the foot of the frame.
- **The main theme's 3D.** The window rises in on its back, tilts on the big moves, and the part that proves a step
  floats out of the page, glowing.
- **The feature's benefit** on the stage, then the capsule end (Book your demo, marsadnasl.com).
- **Sound:** the client's launch track ("use this music": Monume, "Product Launch Review"), and whooshes on the
  transitions only.

The reference is `demos/decisions-real/` ("Decisions: approve a recommendation", 51 s, on the real screens;
`demos/decisions-walk/` is the same walkthrough on the site kit, from before the front end arrived).
`demos/ontology-real/` ("Knowledge map: from one customer to the whole business model") is the first made from the
product team's feature catalogue: the app in dark mode, labelled sample data, live features only. The machinery
is the walkthrough kit (`demos/kit/walk.js`, `walk.css`) and the capture tool (`tools/app_snap.js`), so a
walkthrough's folder holds only its steps (`demo.js`) and what to capture (`app/capture.js`). The references:

- `references/feature-brief.md`: what to ask per feature, how the client's front end is run and captured, and how
  a brief becomes a storyboard. Read it when a feature arrives.
- `references/method.md`: the grammar in detail. It covers what we took from the references, the camera and its
  numbers, framing, lifts, the capsule, the two music maps with their effects, and the reference beat by beat. Read
  it before storyboarding.
- `references/quality-bar.md`: the checklist and the defects already hit. Read it before reviewing stills.
- `references/feature-catalogue.md`: what Marsad does today, by the product team's feature catalogue (2026-10-01,
  the client's baseline): the live features, what is switched off or coming, and the filming rules. Read it when a
  feature arrives, before the brief.

The earlier light-style method (a steps rail, captions under the window, the logo end card) is retired for new
walkthroughs. Its videos stay in `demos/` (`decisions-walkthrough`, `search-walkthrough`, `ontology-walkthrough`,
`pulse-short`). Use it only if the client asks for that style by name. Campaign films (brand and launch ads) are a
different job: use the `marsad-campaign` skill.

## 0. Where you work

Work in the **AO-KH/Marsad-motion** repo on `main`. The client approved pushing there and pulls it on Windows into
`C:\Users\aomar\Desktop\Marsad motion`. If you are not in it, run `git clone https://github.com/AO-KH/Marsad-motion`.

- **Setup:** `npm install` (Playwright; Chromium from `$CHROMIUM_PATH` or `/opt/pw-browsers/chromium`; the
  icon font for captures), `ffmpeg`, and Python 3 with `numpy`, `Pillow`, `fonttools` and `brotli`.
- **The front end** (for captures only; rendering doesn't need it): the client's zip of their monorepo, unzipped
  anywhere, `npm ci` once. `node tools/app_snap.js <slug> --fe <path>` starts its dev server when none runs.
- **Windows (Git Bash):** `PYTHON=python bash build_demo.sh <slug>`.
- **No shell:** without a shell or the repo, you can still write the brief, the storyboard and `demo.js`. Say that
  rendering needs the repo, and never claim a render you didn't make.

## 1. The rules, and why they exist

Each rule is a client correction or a lesson from a delivered video.

- **The feature catalogue is the baseline** (the client, 2026-10-01: "this is your baseline on MARSAD features").
  - Film only features it marks live, and nothing switched off or coming.
  - Quote its «» labels: they are the app's own.
  - Film in the app's dark mode (`theme: 'dark'` in `app/capture.js`).
  - Label the data: the kit's `note: {en: 'Sample data', ar: 'بيانات تجريبية'}`.
  - Keep personal data and English Odoo names out of focus.
  - Avoid its words ('real time', 'sovereign', 'reorders automatically', 'email alerts' …).
  - End on its safe lines where they fit: «مرصد يراقب. وأنت تقرّر.», «شركتك عالم. ومرصد خريطته.».
  - `references/feature-catalogue.md` has the lists and the rules.
- **Truth.** The app's own screens, captured from its front end, and its exact text; the feature's behaviour only
  as the client describes it and the app does it.
  - Never show a feature, flow, label or number the product doesn't have. The capture shows what the app really
    does with the sample data (its dialogs, its messages, its refresh), so follow it rather than inventing states.
  - Sample data is fictional but plausible, with no real customer names.
  - List every rendering and invented item when you deliver, so the client can confirm it. The stage and its glows,
    the rim, the pointer, the floating parts and the capsule are renderings; a row or label you had to add is
    invented.
- **Bilingual, Western digits.** Every line in English and Arabic; digits 0–9 in both, as in the app («ثقة 80%»).
  Write the Arabic as its own sentence: step lines use the imperative (افتح، اختر، راجع، اعتمد).
- **Readable.** The subject's text reads at 30 px or more on screen: on real screens (1440 wide) the app's 14 px
  text needs z ≥ 2.3; on site-kit pages (1896 wide), z ≥ 2.5 for body text.
  Nothing important sits under the capsule (below y 900). The pointer lands below or beside a label, never on it.
- **One camera, calm but alive.**
  - Continuous moves: no cuts before the end, no shake, no overshoot.
  - Dives take 1.1–1.2 s and pull-backs 1.3–1.6 s, on the `prem` ease.
  - After a move the camera keeps creeping in, so a hold is never dead.
  - Punches (1.2–1.5%) only on the landing (k8) and the end hit. Nothing moves on every beat.
- **3D, never flat** ("make this 3d"). The window rises in on its back and tilts on big moves. The one or two parts
  that prove the feature float out of the page, glowing.
- **Lines hold 3 s or more.** A step is 8–12 beats (4–6 s) with one line.
- **Sound effects: whooshes on the transitions, and a click on every click.** "Reduce it dont put it at everything"
  limits the whooshes: 4 moments in a walkthrough. "Add sfx for the click" adds one click sound per click, and "use
  this click sound" made it the client's mouse click (`fit/sfx/mouse-click.mp3`). A click goes in a bar's silence
  (+1.5–2 beats on the launch track; one click per bar), heard at least 6 dB over the music, and its result lands on
  the bar's +2.5 hit (`method.md` §5). No other UI sounds.
- **Samples before big changes.** When a feature needs a new kind of shot, send stills or a short sample first.
- **Final renders are 1080p with motion blur,** plus 16-sample passes on the fast moves (§6).
  - The client, 2026-10-01: "make 1080p videos from now on". `build_demo.sh` renders finals at `SCALE=1`
    (1920×1080) and keeps the file under 29 MB.
  - Render 4K (`SCALE=2`, 3840×2160) only when the client asks for it. The earlier 4K finals came from an earlier
    request ("the resolution is bad here").
  - A `SUB=1` draft is never delivered.
- **Keep tilted close-ups sharp.** They were soft at any resolution ("when it zoomed to page the resolution gets bad"):
  Chrome draws a layer under a perspective tilt at about its own pixel size.
  - So the kit paints the zoom flat and keeps only the tilt in 3D, and the engine gives nothing in an app screen a
    layer of its own (`flatten`).
  - Keep both. Never put the zoom back into the 3D transform, and never give a part of the screen `will-change`, a 3D
    transform or a backdrop-filter (`references/quality-bar.md`).
  - The 16-sample pass on the fast moves renders at the final's own scale: `tools/fast_ranges.py` reads it from the
    frames.
- **Format.** Deliver in 16:9 at 1080p; the stage is laid out at 1920×1080. The kit has no vertical layout yet. If 9:16
  or 1:1 is asked for, say it needs its own framing pass.

## 2. The brief

`references/feature-brief.md` has the questions and an example. In short, ask once and only for what's missing:

- the feature's name, in English and Arabic;
- what it does in one sentence (this becomes the benefit line);
- the steps, click by click, with what appears after each;
- the screens (the front end);
- the outcome;
- anything not live yet.

Choose the length: 51 s on the launch map (4–5 steps). The client's front end is here (2026-09-30): capture the
feature's real screens (§4). Use the site kit only for a screen the front end doesn't have, and say so when you
deliver. Sample data: plausible, per feature, in `app/capture.js`; list it at delivery.

## 3. Storyboard on the music map

Show the plan to the client when the brief was loose. One row per step: beats, the line (EN · AR), the camera's
moves, and the action and its result.

- **Pick the map.** `method.md` §7 has each map's table and its music and sfx blocks.
  - **`launch`** (the default, 51 s), the client's launch track at 80 BPM:
    - steps k8–48, landing clicks and dives on downbeats and on "+2.5" hits that come right after a silence;
    - the benefit over the breakdown, k52–60;
    - the end on the hit that brings the groove back, k60.
  - **`44`** and **`30`**: the funk track of the first sample (43.8 s and 29.7 s), if the client asks for it.
- **Each step** has a line, a dive onto the thing, the action on a beat, and the result on screen for about 2 s.
  When the next thing is far away, pull back for context.
- **Clicks go one per bar**, at the bar's +1.8 (its silence); the result is the bar's +2.5 hit. A flow with a dialog
  (approve, then the dialog's own button) takes a bar per click: plan those bars first.
- **The app's own timings are the story's:** a message the app shows for 2 s is shown for 2 s.
- **Step 1** starts on the page the user starts from. A click into the feature shows where it lives.
- **The last step** shows the outcome: a record, a number, a message.
- **Lines.** English starts with a verb and has at most about 6 words ("Open Decisions", "Approve it"). The benefit
  is one sentence with a gradient last word ("From recommendation to action.").

## 4. Build it

```bash
cp -r .claude/skills/marsad-demo/assets/starter demos/<slug>     # demo.json, demo.js, app/capture.js
# edit app/capture.js: the sample data (routes) and the states to capture, with tags; then:
node tools/app_snap.js <slug> --fe <marsad-frontend>             # writes app/pages.js, app.css, icons.woff2; prints the check
python3 tools/make_demo.py <slug>
node tools/rects.js <slug> '[data-w=approve]' 'text:ثقة 80%'      # natural positions to aim the camera at
```

- **`app/capture.js`** (`feature-brief.md` has the details): `viewport` 1440×805; `theme: 'dark'` (the catalogue's
  rule); `routes`, the sample data the
  feature's pages ask for (the tool prints any call it had no data for as `NEW`); `states` in order, each a `url` or
  a `run` that drives the app (click, fill), plus `tag`s (`data-w`) on what the camera and the hand visit. Capture
  every state the app shows: a dialog opening, a field taking the focus, a message, the page after.
- **The check:** each state is compared with the live app. Under 0.7% of pixels differing is sub-pixel text edges;
  more needs a look at `build/<slug>-app/<key>.diff.png`.
- **`demo.json`:** set the title, `"kit": "walk"`, `"duration": 51.0` and the `launch` map's `music` and `sfx`
  blocks from `method.md` §7: the click cue lists one beat per click.
- **`demo.js`:** set up the kit, then write the steps. The API is in the header of `demos/kit/walk.js`; the kit
  adds the entrance, the exit, the benefit and the end. The states are pages:

```js
const W=M.walk({map:'launch',page:'home',intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[{at:B(8.5),en:'Open Decisions',ar:'افتح صفحة القرارات'}, ...],
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}],ar:'من التوصية إلى التنفيذ.'},
  note:{en:'Sample data',ar:'بيانات تجريبية'}});                  // the label the catalogue asks for, top left
const {app,cam,lift,NP}=W;
cam(B(8.2),{at:NP(930,286),z:2.0,rx:2,ry:-4},{dur:1.0});         // dive onto the top bar
app.click(B(9.8),'[data-w=dec-tab]',{ax:0.4,ay:0.9,lead:0.85,dur:0.75});   // in the bar's silence
app.page(B(10.5),'decisions',{dur:0.35});                        // the result on the hit
cam(B(12),{z:1.04,rx:4,ry:-5},{dur:1.35});                      // back out: the new page
app.click(B(29.8),'[data-w=approve]',{ax:0.42,ay:0.78,lead:0.8,dur:0.7});
app.page(B(30.5),'confirm',{dur:0.22});                          // the app's dialog, captured
app.type(B(34.5),'[data-w=reason]','…',{cps:18});                // a captured field takes typing
lift('[data-w=card]',B(41.9),B(45.4),{exact:true,depth:60,glow:'green'});
M.start();
```

- **Framing numbers** on real screens (`method.md` §3–4):
  - z 1 shows the whole page, z 1.45–1.75 a whole card, z 2.0–2.4 a group or a dialog, and z 2.75–3.6 a line, a
    pill or a button.
  - No `hop` on real screens' short pans; for a long one, pull back to context, then ease in: two moves, not one
    (a hop reverses the zoom mid-pan, and QA reads it as shake).
  - Tilts are 3–5° on whole-page holds, 7–10° while a part floats out, and up to 12° to compress an empty side.
- **A screen the front end lacks:** `M.definePage` in a `pages.js` next to `demo.js`, built from site-kit pieces
  (`feature-brief.md`), and listed as invented at delivery.

## 5. Review stills

```bash
python3 tools/stills.py <slug> 3,6.5,10.5,11.8,17.8,21,27.5,31.5,40.8,43.5,49,58.5,66,73.5 --beats --formats 16x9 --cols 4 --width 480
```

Pick your own beats: each step's dive, its action, its result, the float, the exit, the benefit and the end. Open the
full-size stills (`style_audit/<slug>-16x9_<t>.png`) for anything doubtful. Go through `references/quality-bar.md`,
fix, and look again. A still costs seconds; a render costs minutes.

## 6. Draft, final, QA

```bash
SUB=1 JOBS=6 ./build_demo.sh <slug> 16x9          # a draft, about 2 min: check the motion
JOBS=6 ./build_demo.sh <slug> 16x9                # final: four sub-frames per frame, QA
python3 tools/fast_ranges.py <slug> --run         # 16 sub-frames on the fast moves, re-mux, QA again
```

- **Check the motion** on the draft with a 3 fps contact sheet:
  `ffmpeg -ss 2 -t 8 -i out/<slug>-16x9.mp4 -vf "fps=3,scale=400:-1,tile=6x4" -frames:v 1 sheet.png`.
- **QA** must print `RESULT PASS`: pulse ≤ 1.15, shake 0, −14 LUFS ± 1.5, true peak ≤ −1 dBTP. Then look at
  `style_audit/<slug>-16x9-sheet.png`.
- **Timing:** a 51 s 1080p final takes about 15 minutes with the fast-move pass (4K about 45; a `SUB=1` draft about 3). Start it
  in the background and keep writing docs meanwhile; never edit the demo, the kit or the engine while it runs.
- **Never edit `demo.js` or the kit while a render chain runs.** Each pass reloads the page.

## 7. Deliver and record

- **Send** `out/<slug>-16x9.mp4` (under 30 MB) with one line per step. List the renderings, the sample data, and
  anything invented or shown out of the app's own order.
- **Commit** `demos/<slug>/` (with `app/`) and any kit, engine or tool change to `main`, and push. Build outputs
  are gitignored; never commit `out/`, `frames/`, `kokoro-en-v0_19/` or the client's front end.
- **Record** the video in DEMOS.md §10.

## 8. When the client gives feedback

Treat each correction as a rule for every future walkthrough. Apply it to this one, then write it where the next one
will see it:

- `CLAUDE.md` (the client's rules);
- DEMOS.md;
- the kit, when it's a default;
- this skill (§1, or `references/quality-bar.md`).

The skill's source is `.claude/skills/marsad-demo/`. After changing it, run `python3 tools/package_skill.py
marsad-demo` and commit `skills/` too.
