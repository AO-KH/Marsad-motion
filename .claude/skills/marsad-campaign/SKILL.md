---
name: marsad-campaign
description: Make or change a Marsad campaign film, a 30–90 second brand or launch ad that promotes Marsad (مرصد) the way the 63-second launch film did. It tells one story on the music's beat grid (a hook, the problem, the turn with the logo, proof in the real app, a call to action), with English/Arabic captions, an optional English voiceover, sound effects, the app's light UI with its purple glow and glass icons, and the logo end card, built with the demo engine in the AO-KH/Marsad-motion repo (the films/ folder). Use this skill whenever someone asks for a Marsad ad, brand film, launch film, promo, commercial, campaign or marketing video, sizzle reel, or "a video like the first one", even if they never say "campaign". Also use it when a finished ad needs restyling, retiming, re-voicing, re-scoring or re-cutting. Product demos and walkthroughs use the marsad-demo skill instead.
---

# Marsad campaign films: the baseline

This skill is the standard way to make a Marsad campaign film: a 30–90 s brand ad like the 63 s launch film (`film.html`, delivered as v6).

- **What to take from the 63 s film:** the shape of the story, the beat-grid discipline and the look.
- **What not to take:** its motion. It predates the client's later corrections, so motion follows the 54 s film (v4, `film54_src/`) and CLAUDE.md: calm, and no shaking.
- **How new films are built:** on the demo engine (`engine/engine.js`) plus a small film kit (`films/kit/`). That gives them real app pages, motion blur, review stills, the edge checker, QA, and a voiceover-and-effects mix.
- **The worked examples:** `films/brand-together-30/`, a 30 s film with a voiceover, and `films/coffee-story-45/`, a 45 s film with captions only that tells one product's story in film-space object cards and one real app page. Copy the closer one to start a new film.

Read these as you reach them:
- `references/film-anatomy.md`: the 63 s film scene by scene, what to keep and what not to copy, the calm 54 s variant, and beat maps for 30, 45 and 60 s films. Read it before storyboarding.
- `references/audio.md`: the music's map, the voiceover, the sound effects and the mix. Read it before writing the audio in `film.json`.
- `references/quality-bar.md`: the review checklist and the defects already hit, with their fixes. Read it before reviewing stills.
- `references/launch-style.md`: the client's launch-video references (dark stage, kinetic type, UI parts blown up in 3D, one big click, zoom-through) and how `films/coffee-launch/` and `films/film63-launch/` build them. Read it when a brief asks for "a launch video", "like these references", or a look beyond the light house style.

Out of scope:
- product demos and walkthroughs (the `marsad-demo` skill);
- short social ads and 6 s bumpers, which follow their own brief (see `films/monitor/README.md`);
- edits to the finished ads (`film.html`, `film54_src/`, `films/monitor/`) unless the client asks for them.

## 0. Where you work

Work in the **AO-KH/Marsad-motion** repo on `main`. The client approved pushing there and pulls it on Windows into `C:\Users\aomar\Desktop\Marsad motion`. If it isn't checked out, run `git clone https://github.com/AO-KH/Marsad-motion`.

Setup:
- `npm install` installs Playwright. Chromium comes from `$CHROMIUM_PATH`, `/opt/pw-browsers/chromium`, or `npx playwright install chromium`.
- `ffmpeg`, and Python 3 with `numpy`, `Pillow` and `scipy`.
- For a voiceover: `pip install sherpa-onnx`, and the Kokoro model folder `kokoro-en-v0_19/` in the repo root (or `$KOKORO_DIR`). The download line is in `tools/make_vo.py`. The folder is gitignored; never commit it (about 300 MB).
- On Windows (Git Bash): `PYTHON=python bash build_demo.sh <slug>`.

With no shell or repo (for example in a plain chat), you can still write the brief, the storyboard and `film.js`. Say that rendering needs the repo, and don't pretend you rendered anything.

## 1. The rules, and why they exist

Each rule comes from the client, in their own words, or from a delivered film. Apply them to every frame.

- **Their story first.** "take this storyboard and make a motion graph…", "mine is ok the first on i already sent you".
  - The client's storyboard or brief is the master. You may add scenes from what you know about Marsad (they invited it), but don't swap in your own concept.
  - Once a cut is approved, change only what was asked, and ask before re-cutting ("i want to keep the video as is").
- **The app as it really is.** "this is the new website UI keep the style oriented to it, also show the pages".
  - Use the light UI and real pages from the site kit, with a soft purple glow ("add a glowed purple styling") and glass icons ("make the icons glassy").
  - App pages keep their own styling; glass is for tiles, chips and icons.
- **Famous sources, ending connected.** "get only the famous ones": SAP, Salesforce, Oracle, Excel, Shopify, QuickBooks, PDF and CSV (`K.TILES`). "the scattered data should be … connected to marsad at the end".
- **A big, living logo.** "make marsad logo bigger". "when the logo appear the transition look static".
  - Build the reveal on the beats: sources absorbed one per 16th, the mark easing in, a soft punch.
  - "the circle behind the app should be removed", "remove the orb": nothing round sits behind the mark. Its own glow is enough.
- **No section labels.** "delete this … also remove the problem": no "THE PROBLEM" or "HOW IT WORKS" kickers. The story must read without them.
- **On the beat, never pulsing.** "add transition motion align with the video and music", "align the rhythm between the video and music".
  - Every entrance, sound effect and voice line starts on a beat or an 8th.
  - "it is pulsing dont make it like that": one-off hits on beats are fine; nothing throbs on every beat.
- **Calm, never shaking.** "make the pace a little slower and remove the icons shaking" (the 54 s film).
  - No shakes, whips, spins, wiggles, bobbing or camera jumps on the beat.
  - Punches stay at 2% or less and swell in (`M.punch`). Entrances take 0.6–1.0 s. Overshoot of 4% at most, and only on the logo.
  - The client chose "slower" to mean calmer at the same length, not a longer cut.
- **Readable with the sound off.** "make it more explainable without voice"; the 54 s film is music and captions only. Captions carry the story, and a voiceover is an extra.
- **Human voices only.** "this is so robotic voice".
  - The English voiceover is Kokoro "Michael" (voice 6), the voice the client picked.
  - There is no approved Arabic voice yet, so Arabic lives in the captions.
- **Hold what matters.** "the second one should stay a little longer one whole second or half a second": key moments hold 0.5–1 s longer than feels necessary, and scenes have detail.
- **Nothing overlaps or breaks.** "fix the overlapping with the sentences", "this one is a bug": captions never sit on content, and no UI renders broken.
- **A balanced mix.** "reduce the SFX", "there is weird sound in the background remove it", "make it balanced".
  - The music is present, the effects are restrained, and there is no hum or hiss.
  - The music is the client's track or one they approved, fitted without a time-stretch.
- **Bilingual, with Western digits.**
  - Every caption has an English line and a natural Arabic line. When a brief names only one ("arabic captions"), keep both unless the client says to drop one, and say so when you deliver.
  - Digits in captions and overlays are Western, per the client's brief: "Digits stay Western (513, 400), as the product shows them". Inside app pages, keep whatever the page shows.
  - The 63 s and 54 s films still have Arabic-Indic digits in their mock UI; don't copy those.
- **The current call to action.** End on "Book your demo · احجز عرضك التجريبي" and marsadnasl.com (the `M.endcard` defaults). The 63 s film's "Request a demo · nasl-tech.com" is out of date.
- **Show the truth.**
  - Use real states and the app's exact UI text. Sample data is fictional but plausible.
  - Show no names, workspace names or badges from real accounts, and no future features.
  - Never say "unhackable", "blockchain" or "certified".
  - Take product claims from the client's own documentation. The Marsad User Manual v1.0 (March 2026), which the client gave as "what you need to know about marsad", covers objects, links, governed actions and approvals, notifications, and the audit trail kept for 7 years. It isn't in the repo, so ask the client for it when it isn't at hand. Its screenshots show an older UI: show the site kit's pages instead.
  - A concept the site kit has no page for (an object's links, its history) can be drawn in film space, in the app's card style, with the manual's names. Call it a rendering, not a screen, when you deliver.
  - List everything you invented in the delivery message, so the client can confirm it before the film is used.
- **Final renders have motion blur, and QA passes.** `build_demo.sh` does both. A `SUB=1` draft is never delivered.

## 2. Brief

Get these in one short round, asking only for what you can't infer:

1. **The message and the audience.** Defaults, from the client's brief:
   - audience: Saudi business owners, and finance or operations managers who run their sales on Odoo or similar;
   - goal: awareness and demo bookings.
2. **Their storyboard or script,** if they have one. It is the master.
3. **Length: 30–90 s.** A 30 s film holds about 5 scenes, and a 60 s film about 9.
4. **Music:** the client's track or one they approved. The launch film's track is `fit/stylish.mp3` (94 BPM). Paid ads need the licence.
   - A new track must be free for commercial use and editing: CC0 or the site's own commercial licence, confirmed on the track's own page. Record it in `fit/CREDITS.md`.
   - Collections can mislabel. A "CC0" corpus held a track whose own tags said CC BY-NC-ND. NC or ND is never usable.
   - `fit/holizna-movement.mp3` (HoliznaCC0, CC0, 96.67 BPM, C minor) is the launch cut's track.
5. **Voice:** captions only, or captions plus the English voiceover.
6. **The product moments to show:** site-kit pages (DEMOS.md §6.1), or screenshots of new screens to rebuild in `pages.js`.
7. **Format:** a 16:9 (1920×1080) master, like both brand films. Make a 9:16 version only when asked, and recompose it rather than crop it.
8. **The end card:** with the call to action (the default), or organic (logo, tagline and URL only).
   - The tagline defaults to "Know. Watch. Decide." / «اعرف. راقب. قرّر.», from the client's own 54 s film.
   - The launch film's is "One operational nervous system." / «جهاز عصبي تشغيلي واحد لشركتك.».
   - Pass `tag` and `tagAr` to `M.endcard` to change it.

When nobody can answer, use these defaults and list them in the delivery message:
- the audience and goal above;
- `fit/stylish.mp3`;
- captions plus the English voiceover when the brief mentions a voice, captions only when it doesn't;
- the launch film's proofs: Business Pulse (recommendations from your numbers) and Decisions (approve in one click);
- the default end card;
- a 16:9 master.

## 3. Storyboard on the music

1. **Map the music first.** `python3 tools/beats.py <track>` prints the tempo, the downbeat candidates and a loudness bar per bar.
   - Once a downbeat is confirmed, run it again with `--downbeat <s> --beats A-B`. The map is then numbered from that downbeat, and it prints beat by beat, which shows the one-beat stops and the drops.
   - Mark its sections: intro, build, groove, breakdown, drop.
   - `references/audio.md` has the map of `fit/stylish.mp3`.
2. **Choose where the film starts in the track** (`"start"`, on a downbeat) so the big moments land on section changes:
   - the logo reveal on a section start, or right after a one-beat stop;
   - the product proof in the groove;
   - a quiet, close moment (a click, a question) in the breakdown;
   - the end card on the drop.
   The anatomy has ready beat maps for 30, 45 and 60 s.
3. **Tell one story, in the launch film's arc:** hook (the viewer's problem) → friction → the turn (Marsad, the logo reveal) → the promise → proof in the real app (2–3 moments, one action each) → trust or the differentiator → the end card. A 30 s film keeps the hook, the turn, one or two proofs and the end card.
4. **Write one row per scene:** beats and time, the caption (EN / AR), the voiceover line, what is on screen, and the sound.
   - Captions are short statements, like the launch film's "Your company's data is everywhere." or "One workflow. Fully automated.".
   - Each caption stays on screen for about 2 bars, and never under 3 s. In a tight 30 s film, one caption may cover a short scene and the start of the next when they make one point. Write the Arabic as its own sentence.
   - The launch film's approved lines are in the anatomy. Reuse them when they fit.
5. **Beats:** big moments go on beat 1 or on a section change; entrances on beats or 8ths; lists one item per 16th; typing one key per 32nd. Nothing repeats on every beat.
6. **Show the storyboard** to the client when the brief was loose.

## 4. Build the film

A film is a folder, `films/<slug>/`:
- `film.json`: title, duration, format and audio;
- `film.js`: the timeline;
- optional `film.css` and `pages.js` (custom pages, as in DEMOS.md §6.3).

The build tools look for `<slug>` in `demos/`, then `films/`. Films also get the film kit, `films/kit/kit.js` and `kit.css`.

```json
{"title": "Marsad — …", "duration": 30.0, "formats": ["16x9"],
 "music": {"file": "fit/stylish.mp3", "bpm": 93.99, "downbeat": 0.041, "start": 28.129, "fade_out": 2.5},
 "vo":  {"voice": 6, "lines": [{"id": "vo1", "text": "Your company's data is everywhere.", "beat": 1, "max": 2.6}]},
 "sfx": [{"type": "whoosh", "beat": 8}, {"type": "chime", "beat": 31.25}]}
```

- `start` is a downbeat of the track, to the millisecond (28.129, not 28.13), so beat 0 of the film is a downbeat. A rounded value slips the whole grid by a bar; `tools/make_demo.py` warns when it does.
- `duration` = the end card's start plus at least 6 s: 4 s for its entrance and a 2 s hold. Round it to the beat.

Write `film.js` against the engine API (DEMOS.md §5) and the film kit:

- **Scenes outside the app:**
  - `M.layer()` returns a free layer under the app window; `M.layer('over')` returns one above it.
  - Build the scene's DOM with `M.el(tag, cls, html, parent)`, and animate it with `M.track(t=>…)` or `M.tween(t0, dur, p=>…)`.
- **The film kit:**
  - `K.TILES` and `K.tile(n)`: the eight famous sources as glass tiles (`M.el('div','k-tile m-glass',K.tile(n),layer)`).
  - `K.mark(w)`: the Marsad mark with its glow. `K.glow(w)`: a blurred copy of the mark to put under it for a reveal. Animate its opacity so the glow gathers into the reveal and settles.
  - Class `k-say`: a big bilingual statement (EN 64 px, AR 34 px) for a line that is the scene itself, centred in an otherwise empty frame, like "Marsad changes that." at a reveal.
  - `M.caption` is each scene's running line in the band at the bottom. Don't show the same words in both.
- **Product moments:** `M.app({at, out, page})` with `page`, `focus`, `click`, `type`, `toggle`, `show`, `highlight` and `callout`, exactly as in demos.
  - The window's own entrance and exit are the transition into and out of the app.
  - `app.toStage(target, t)` gives an app element's place on the stage at time t (`{x, y, w, h, cx, cy, s}`), including the window's entrance and the view. Use it to fly a scene element onto the app, as the example's mark flies into the window's logo.
  - Frame, click and place callouts by §4 of the marsad-demo skill (`.claude/skills/marsad-demo/SKILL.md`): no text sliced at the window's edge, the cursor beside labels, callouts clear of content.
- **The rest:**
  - `M.caption({at, out, en, ar})`: one caption per scene, ending 0.5 s before the next.
  - `M.punch(t, {amp})`: 2–4 big beats only.
  - `M.endcard({at})`, then `M.start()`.
- **Pure functions of t.** No timers and no `Math.random`: use seeded values (`const r=M.mulberry(7); r()`) or fixed tables.
  - Anything that changes in steps (a number, typed text) uses the frame's time, `M.FQ(t)`, or motion blur ghosts it.
  - Anything that moves eases (`M.ez.dec` for entrances, `M.ez.ioC` for glides).
- **Transitions:** glide, cross-fade, or let one element become the next scene (the sources fly into the mark; the mark makes way for the app window). No hard cuts. Flashes only as one soft bloom at the reveal.

```js
const B=M.B, S16=M.S16, ez=M.ez, P=M.P, st=M.st;
const S=M.layer();
// hook: the sources, scattered (fixed positions; they drift slowly in straight lines, never bob)
const tiles=K.TILES.map((n,i)=>M.el('div','k-tile m-glass',K.tile(n),S));
M.track(t=>tiles.forEach((e,i)=>{const p=ez.dec(P(t,B(0.5)+i*S16,B(0.5)+i*S16+0.8)); /* …position, opacity from t… */}));
M.caption({at:B(1),out:B(7.5),en:"Your company's data is everywhere.",ar:'بيانات شركتك مبعثرة في كل مكان.'});
// the turn (8 beats): the tiles gather and connect to the mark; it eases in on k10, lights on k12, holds, then flies
// to where the window's logo will be (app.toStage)
M.punch(B(12));
// proof in the real app
const app=M.app({at:B(16),out:B(36),page:'pulse'});
// …focus, click, show, callout…
M.endcard({at:B(37)});
M.start();
```

## 5. Voice and sound

- **Voiceover:** run `python3 tools/film_audio.py <slug>`.
  - It speaks the lines in `film.json` (cached in `out/<slug>-vo/`) and lists when each one starts and ends.
  - It flags a line longer than its `max`, one that runs into the next line, and one that runs past the end. It speeds a long line up to 1.15× at most; past that it sounds rushed, so cut words.
  - Move beats, or cut words, until nothing is flagged.
- **Sound effects:** a few, each on the beat of a visual event. `references/audio.md` lists the types and when to use them.
- **The mix** happens in the build:
  - voiceover at −16 LUFS, its consonant peaks limited;
  - music at −20 LUFS, ducked while the voice speaks;
  - effects at −25 LUFS;
  - the master at −14 LUFS / −2 dBTP, which stays under −1 dBTP after AAC.

## 6. Review stills

```bash
python3 tools/make_demo.py <slug>
python3 tools/stills.py <slug> 0.5,4,8,12,16,20,28,31,37,44 --beats --formats 16x9   # each scene's start, action, result, hold
node tools/cutcheck.js <slug> 16x9                                                      # app-window holds: text sliced by the edge
```

Go through `references/quality-bar.md` point by point on the stills, fix, and check again. Most defects show up here, and a still costs seconds while a render costs minutes.

## 7. Build, QA, look and listen

```bash
SUB=1 ./build_demo.sh <slug>      # optional quick draft (no motion blur) to check timing in motion
./build_demo.sh <slug>            # final: the mix, motion blur, QA (about 8 min for 30 s on 4 cores)
ONLY=audio ./build_demo.sh <slug> # after an audio-only change: re-mix, re-mux and QA on the frames already rendered (~1.5 min)
```

- It must print `RESULT PASS`: pulse at most 1.15, shake 0, and audio at about −14 LUFS with a true peak of −1 dBTP or lower, measured on the MP4. Then look at `style_audit/<slug>-16x9-sheet.png`.
- Read the mix report the build prints: each voice line's times, the effects count, each stem's level, and the peak-to-loudness ratio. Above 15 dB it warns that the master will be limited hard; lower the loudest cue's `gain`.
- Timings on this machine (4 cores): a still sheet about 20 s, the edge check about 20 s, the final build about 8 min for 30 s.
- If a check fails, find the cause in the frames it names. Don't loosen the check.

## 8. Deliver and record

- Send `out/<slug>-16x9.mp4` (under 30 MB) with one line on what it shows.
- In the same message, list everything you invented, and anything the client hasn't settled yet (see the anatomy's open questions).
- Commit `films/<slug>/` and any engine, kit or tool change to `main`, and push. Never commit `kokoro-en-v0_19/`, `out/` or `frames/`.
- If you changed the engine, re-check the reference demos with `tools/stills.py` and `tools/cutcheck.js`.
- Add the film to HANDOFF.md, in the list of campaign films.

## 9. When the client gives feedback

Treat each correction as a rule for every future film, not a one-off fix. Apply it to the current film, then write it down where the next film will see it: `CLAUDE.md`, HANDOFF.md §7, and this skill (§1 here, or `references/quality-bar.md`). That is how the baseline grows.

The skill's source is `.claude/skills/marsad-campaign/` in the repo. After changing it, run `python3 tools/package_skill.py` and commit `skills/` too.
