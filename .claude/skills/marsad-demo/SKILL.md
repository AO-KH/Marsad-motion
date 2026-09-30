---
name: marsad-demo
description: Make or change a Marsad walkthrough, a video that explains one feature of the Marsad web app (مرصد) by using it on screen. It follows Marsad's walkthrough method, Benji Taylor's launch-walkthrough grammar (a camera that dives onto each click in the real app) in Marsad's main theme (a clean dark stage, bilingual type, the capsule end), on the client's launch track, built with the walkthrough kit in the AO-KH/Marsad-motion repo. Use this skill whenever someone asks for a walkthrough, demo, tutorial, how-to, explainer, onboarding clip, feature or product video, or a short feature clip that shows Marsad screens or a Marsad workflow; whenever they describe a feature of their SaaS to explain or send front-end pages or screenshots for a video; and to edit, retime, reframe, translate or re-render an existing walkthrough, even if they never say "demo".
---

# Marsad walkthroughs: one feature, explained by using it

The client describes a feature of their SaaS (what it does, the steps, the screens), and you make a short video that
explains it by using the real app on screen. The method comes from the client's request: "take these video for the
walk through and take them as reference [Benji Taylor's Live Studio walkthrough, the launch videos at
notes.apoorv.xyz] keep the marsad and NASL theme … i will give you feature of my saas and you make a walkthrough to
explain the feature". What is on screen:

- **The app as it is**, in a window floating on Marsad's dark stage, with soft violet glows and nothing else (no
  lens circles, no stars: the client took both out).
- **A camera that dives** onto each thing to read or click (2.5–4×), then pulls back for context. It never rests.
- **Real clicks, heard.** The pointer clicks (a hand over what it clicks) with a soft click sound, and the app's
  own states change: pages, cards, numbers, typed text.
- **One short step line at a time**, English · Arabic, in a dark capsule at the foot of the frame.
- **The main theme's 3D.** The window rises in on its back, tilts on the big moves, and the part that proves a step
  floats out of the page, glowing.
- **The feature's benefit** on the stage, then the capsule end (Book your demo, marsadnasl.com).
- **Sound:** the client's launch track ("use this music": Monume, "Product Launch Review"), and whooshes on the
  transitions only.

The reference is `demos/decisions-walk/` ("Decisions: approve a recommendation", 44 s). The machinery is the
walkthrough kit (`demos/kit/walk.js`, `walk.css`), so a walkthrough's `demo.js` holds only its steps. The references:

- `references/feature-brief.md`: what to ask per feature, how the client's front end comes in, and how a brief
  becomes a storyboard. Read it when a feature arrives.
- `references/method.md`: the grammar in detail. It covers what we took from the references, the camera and its
  numbers, framing, lifts, the capsule, the two music maps with their effects, and the reference beat by beat. Read
  it before storyboarding.
- `references/quality-bar.md`: the checklist and the defects already hit. Read it before reviewing stills.

The earlier light-style method (a steps rail, captions under the window, the logo end card) is retired for new
walkthroughs. Its videos stay in `demos/` (`decisions-walkthrough`, `search-walkthrough`, `ontology-walkthrough`,
`pulse-short`). Use it only if the client asks for that style by name. Campaign films (brand and launch ads) are a
different job: use the `marsad-campaign` skill.

## 0. Where you work

Work in the **AO-KH/Marsad-motion** repo on `main`. The client approved pushing there and pulls it on Windows into
`C:\Users\aomar\Desktop\Marsad motion`. If you are not in it, run `git clone https://github.com/AO-KH/Marsad-motion`.

- **Setup:** `npm install` (Playwright; Chromium from `$CHROMIUM_PATH` or `/opt/pw-browsers/chromium`), `ffmpeg`,
  and Python 3 with `numpy` and `Pillow`.
- **Windows (Git Bash):** `PYTHON=python bash build_demo.sh <slug>`.
- **No shell:** without a shell or the repo, you can still write the brief, the storyboard and `demo.js`. Say that
  rendering needs the repo, and never claim a render you didn't make.

## 1. The rules, and why they exist

Each rule is a client correction or a lesson from a delivered video.

- **Truth.** The app's pages and its exact text; the feature's behaviour only as the client describes it.
  - Never show a feature, flow, label or number the product doesn't have.
  - Sample data is fictional but plausible, with no real customer names.
  - List every rendering and invented item when you deliver, so the client can confirm it. The stage and its glows,
    the rim, the pointer, the floating parts and the capsule are renderings; a row or label you had to add is
    invented.
- **Bilingual, Western digits.** Every line in English and Arabic; digits 0–9 in both, as in the app («ثقة 80%»).
  Write the Arabic as its own sentence: step lines use the imperative (افتح، اختر، راجع، اعتمد).
- **Readable.** The subject's text reads at 30 px or more on screen (on site-kit pages, z ≥ 2.5 for body text).
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
  limits the whooshes: 4 moments in a walkthrough. "Add sfx for the click" adds one soft click per click
  (`glass-press-am.wav`), timed in the music's silence just before a hit, with the result landing on the hit
  (`method.md` §5). No other UI sounds.
- **Samples before big changes.** When a feature needs a new kind of shot, send stills or a short sample first.
- **Final renders get motion blur,** plus 16-sample passes on the fast moves (§6). A `SUB=1` draft is never
  delivered.
- **Format.** Deliver in 16:9 (1920×1080). The kit has no vertical layout yet. If 9:16 or 1:1 is asked for, say it
  needs its own framing pass.

## 2. The brief

`references/feature-brief.md` has the questions and an example. In short, ask once and only for what's missing:

- the feature's name, in English and Arabic;
- what it does in one sentence (this becomes the benefit line);
- the steps, click by click, with what appears after each;
- the screens (the front end);
- the outcome;
- anything not live yet.

Choose the length: 30 s (2–3 steps) or 44 s (4–5 steps). Until the client's front end arrives, use the site kit's
pages and data ("for now we can use the existing data"), and say so when you deliver.

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
- **Step 1** starts on the page the user starts from. A click into the feature shows where it lives.
- **The last step** shows the outcome: a record, a number, a message.
- **Lines.** English starts with a verb and has at most about 6 words ("Open Decisions", "Approve it"). The benefit
  is one sentence with a gradient last word ("From recommendation to action.").

## 4. Build it

```bash
cp -r .claude/skills/marsad-demo/assets/starter demos/<slug>     # or: cp -r demos/decisions-walk demos/<slug>
python3 tools/make_demo.py <slug>
node tools/rects.js <slug> '#btnOK' 'text:ثقة 80%'                # natural positions to aim the camera at
```

- **`demo.json`:** set the title, `"kit": "walk"`, `duration` (51.0 for `launch`; 43.8 or 29.7 for the funk maps),
  and the map's `music` and `sfx` blocks from `method.md` §7 (the edit must match the map).
- **`demo.js`:** set up the kit, then write the steps. The API is in the header of `demos/kit/walk.js`; the kit
  adds the entrance, the exit, the benefit and the end:

```js
const W=M.walk({map:'44',page:'pulse',intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[{at:B(8.5),en:'Open Decisions',ar:'افتح صفحة القرارات'}, ...],
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}],ar:'من التوصية إلى التنفيذ.'}});
const {app,cam,lift,NP}=W;
cam(B(8.75),{at:NP(1400,230),z:2.7,ry:-2},{dur:1.15});           // dive onto the tabs
app.click(B(11.75),'.sk-tab[data-k="dec"]',{ax:0.35,ay:0.92,lead:1.1,dur:1.0});
app.page(B(12),'decisions');
cam(B(12.9),{z:1.06,rx:4,ry:-5},{dur:1.35});                    // back out: the new page
lift('#toast',B(41.9),B(45.8),{hide:['#decCard'],depth:60,glow:'green'});
M.start();
```

- **Framing numbers** (`method.md` §3–4):
  - z 1 shows the whole page, z 1.5 a wide card, z 2.2–2.9 a group, and z 3.5–4.2 a line, a pill or a button pair.
  - Use `hop` 0.4 on pans longer than about 600 natural px at high zoom.
  - Tilts are 3–5° on whole-page holds, 7–10° while a part floats out, and up to 12° to compress an empty side.
- **New pages:** use `M.definePage`, in a `pages.js` next to `demo.js` (`feature-brief.md` covers the front end).
  Build the page as HTML so it stays sharp at 4×. Screenshots need 3× resolution.

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
- **Timing:** a 44 s final takes about 15 minutes.
- **Never edit `demo.js` or the kit while a render chain runs.** Each pass reloads the page.

## 7. Deliver and record

- **Send** `out/<slug>-16x9.mp4` (under 30 MB) with one line per step. List the renderings and anything invented,
  and say what came from the site kit's existing data.
- **Commit** `demos/<slug>/` and any kit, engine or tool change to `main`, and push. Build outputs are gitignored;
  never commit `out/`, `frames/` or `kokoro-en-v0_19/`.
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
