---
name: marsad-campaign
description: Make or change a Marsad (مرصد) campaign film (a 30–90 s brand, launch or feature ad) in Marsad's main theme, the look of the client's two approved films, the 48 s film (films/style-jupiter) and the ontology film (films/ontology-main-theme). A near-black stage with glowing lenses and dust, white type blurring in with the Arabic under it, the app's real pages and parts in 3D, the client's funk track, whooshes only on transitions, and the glowing capsule end with "Book your demo" and marsadnasl.com, built with the demo engine in the AO-KH/Marsad-motion repo. Use it whenever someone asks for a Marsad ad, brand or launch film, promo, commercial, campaign or marketing video, a film about one feature (Decisions, Business Pulse, the Assistant, the ontology), or "a video like the 48 second one / the ontology one / in Marsad's main theme", even without the word "campaign", and to restyle, retime, re-score or re-cut a finished ad. Product demos and walkthroughs use the marsad-demo skill.
---

# Marsad campaign films, in the main theme

The client approved two films as the model for every new campaign film. The client's words were "the theme of 48 second video is good" and then "marsad main theme, fonts color and everything". Make new films the way those two were made, and start from their code, not from a blank page.

| | The 48 s film | The ontology film |
|---|---|---|
| Folder | `films/style-jupiter/` | `films/ontology-main-theme/` |
| Length and music | 48.0 s on the client's funk track, edit `[[0,48],[64,80],[48,64],[64,76]]` | 29.7 s on the same track, edit `[[8,48],[56,73]]` |
| Story | The Marsad brand story, in the 63 s launch film's arc and approved lines: scattered data → the wait → "Marsad changes that." → the loop → one living model → Business Pulse → Decisions → trust → Arabic → the end | One feature, the ontology: the company's data everywhere → connect → unify → monitor and act → one living model → the end |
| Grammar | **Shots:** 11 compositions on the stage, 4–10 beats each, hard cuts on the beat | **One camera:** a continuous move through a 3D drawing of tiers (cranes, a circle round standing pages, a pull-back), no cuts |
| Best for | Brand films; stories with several product moments | How-it-works films; one feature's story |

The theme is the same in both: a near-black stage (`#06050E`) with drifting dust, and lenses with dark bodies and rims running indigo → violet → magenta → pink. White Inter (500) type blurs in word by word, with grey words for the problem, gradient words for Marsad, and the Arabic line under it. The app's real pages and parts appear in 3D with glowing rims. The mark carries its own glow. The film ends in a glowing capsule.

Read these as you reach them:
- `references/main-theme.md`: the look's exact values and the code blocks that make it (the stage, the type, the mark, real parts, the capsule end). Read it before building.
- `references/the-two-films.md`: both films shot by shot, the approved lines, and beat maps on the funk track (30, 48 and 60 s tested, 44 s derived). Read it before storyboarding.
- `references/depth-and-3d.md`: depth in both grammars (CSS 3D parts, the perspective drawing, pages standing as glass slabs, parts floating out). Read it when a shot shows the app.
- `references/audio.md`: the funk track, its edits, the whooshes and hits, the mix, and an optional voice. Read it before writing `film.json`'s audio.
- `references/quality-bar.md`: the review checklist and the defects already hit, with their fixes. Read it before reviewing stills.
- `references/feature-catalogue.md`: what Marsad does today, by the product team's feature catalogue (2026-10-01, the client's baseline): the live features, what is switched off or coming, the filming rules and the words to avoid. Read it before writing any line or choosing what a film shows.
- `assets/starter/`: a working 30 s film in the theme (the stage, the type, the mark, a page in perspective, a real card lifting out, the capsule end, the music and the three whooshes). Copy it to start a new film.

The repo holds older films in other looks: the light 63 s and 54 s ads, the launch-style recreations, and the Figma, Foundry and Lovable samples (HANDOFF.md lists them). They are history. Don't copy their look unless the client asks for it by name.

## 1. The rules, and why

Each rule comes from the client, in their own words, or from an approved film. Apply them to every frame.

- **The main theme, always.** Every new film uses it unless the client asks for another look. A new look is shown first as a short sample; the style samples were how the client chose this theme.
- **Their story first.** The client's storyboard or brief is the master. Add scenes from what you know about Marsad (they invite it), but don't swap in your own concept. Once a cut is approved, change only what was asked ("i want to keep the video as is").
- **Samples before big changes.** For a new idea, a new grammar or a restructure, show stills or a short draft first. The client decides on what they can see.
- **3D, never flat.** The client saw app pages lying flat on the ontology film's top tier and asked to "make this 3d". Pages and parts stand or float in perspective with glowing rims, real parts lift out of them, and the camera moves so the depth shows. Never lay a page on the ground like a texture.
- **More in each frame, at a lively pace.** "keep the pace slower and add more detail", then "increase the pace".
  - The approved pace is a shot per 4–10 beats (2–5 s at 115 BPM). About 2 s a shot was too fast; 5–7 s felt slow.
  - Each frame has layers: dust, a lens composition, the main element, and secondary details (tiles adrift, orbits, running lights).
- **Only Marsad glows.** The problem is shown dull: grey lenses, a grey-edged waiting chat, grey words. Marsad's parts get the violet-to-pink glow.
- **Calm, never shaking.** "remove the icons shaking", "it is pulsing dont make it like that".
  - No shakes, whips or spins, and nothing jumps on the beat.
  - Punches are 1.5% or less and only on the two big hits: the turn and the end.
  - Loops (twinkles, drifts, running lights) run off the beat.
  - Everything that moves eases.
- **The logo is big and alive, and never sits on a disc.** The mark lands on the groove's first beat with its own glow blooming, and a lens bursts out of it. "remove the orb", "the circle behind the app should be removed": nothing round sits behind the mark.
- **No section labels** such as "THE PROBLEM" or "HOW IT WORKS" ("delete this"). The lines carry the story.
- **Bilingual on every line, with Western digits.**
  - Every line has English with a natural Arabic sentence under it, written as its own sentence, not a word-for-word copy.
  - Digits in lines and overlays are Western ("Digits stay Western (513, 400), as the product shows them"). App pages keep their own.
- **Readable with the sound off.** "make it more explainable without voice". The big type carries the story. Each line holds 3 s or more, and its Arabic 1.3 s or more once it has appeared.
- **The client's music.** The default is their funk track, lightbeatsmusic "Joyful Rhythm Walk Funk". It is cut to length with `edit` sections at its phrase joins and never time-stretched ("use this music"). A new track needs a licence that allows commercial use and editing, recorded in `fit/CREDITS.md`.
- **Effects only on the transitions, and few.** "add whoosh sfx", then "reduce it dont put it at everything".
  - A whoosh into the turn and into the end, each with its cinematic hit.
  - One or two quieter whooshes on big mid-film moves.
  - Nothing on clicks, typing or chips. Three cues in a 30 s film, four in a 48 s one.
- **The end is the capsule.** The client disliked two joined lenses ("change this shape"). On the hit, one wide glowing capsule blooms round "Book your demo." and shrinks into the marsadnasl.com capsule under the mark. "Book your demo · احجز عرضك التجريبي" and the NASL TECHNOLOGIES · RIYADH footer follow, and hold for 2.5 s or more.
- **Show the truth.**
  - Real app text on real parts: screenshots from `site_pages/` and parts from the site kit (`SK`). Better, since the client's front end arrived: the app's own screens, captured in dark mode with sample data by `tools/app_shot.js` (sharp PNGs at 5× and crops of their parts, with their boxes), as in `films/whatif-38` (rules and their what-if) and `films/style-jupiter` (Business Pulse, the Decisions approval with its passport, the assistant's answer with its sources; its `app/capture.js` answers those pages' calls). Since 2026-10-02 the app is bilingual (Arabic by default; `lang: 'en'` in `capture.js` for English) and has the MARSAD × Fusion look (square panels: draw its parts square). Label sample data on screen ("Sample data · بيانات تجريبية").
  - Sample data is fictional but plausible. Show no names or badges from real accounts, and no future features.
  - Never say "unhackable", "blockchain" or "certified".
  - **The feature catalogue is the baseline** (the client, 2026-10-01: "this is your baseline on MARSAD features"). Show and claim only live features, avoid its words ('real time', 'sovereign', 'PDPL-compliant', 'reorders automatically', 'email alerts' …), and end a decision approved and sealed in its passport, not "executed". Source tiles are Odoo, documents, spreadsheets, Drive and WhatsApp, not the famous tiles of other systems. `references/feature-catalogue.md` has it all; `Videos/README.md` lists what each older film must change.
  - Older product claims came from the client's Marsad User Manual v1.0 (March 2026); where it and the catalogue differ, the catalogue wins. Its screenshots show an older UI, so show `site_pages/` instead.
  - A concept with no page (how the data connects, the tiers) is drawn and called a rendering. List every rendering and invented element when you deliver.
- **A voice only when asked.** Neither approved film has one. If asked, use the English voice the client chose, Kokoro "Michael" (voice 6). There is no approved Arabic voice.
- **Finished means motion blur and QA.** Render with motion blur, render the fast moves again with 16 samples, and make sure QA passes. A `SUB=1` draft is never delivered.
- **Finals are 1080p.** The client asked for it on 2026-10-01: "make 1080p videos from now on". It is `build_demo.sh`'s default. Render 4K (`SCALE=2`) only when the client asks for it.

## 2. Where you work

Work in the **AO-KH/Marsad-motion** repo on `main`. The client approved pushing there, and pulls it on Windows into `C:\Users\aomar\Desktop\Marsad motion`. If it isn't checked out, run `git clone https://github.com/AO-KH/Marsad-motion`.

Setup:
- `npm install` installs Playwright. Chromium comes from `$CHROMIUM_PATH`, `/opt/pw-browsers/chromium`, or `npx playwright install chromium`.
- `ffmpeg`, and Python 3 with `numpy`, `Pillow` and `scipy`.
- On Windows (Git Bash): `PYTHON=python bash build_demo.sh <slug>`.

Without a shell or the repo (for example in a plain chat), you can still write the brief, the storyboard and `film.js` from the starter. Say that rendering needs the repo, and don't claim you rendered anything.

## 3. Brief

Get these in one short round, asking only for what you can't infer:
1. **The message and the audience.** Defaults: Saudi business owners, and finance or operations managers whose company runs on Odoo or similar; the goal is awareness and demo bookings.
2. **Their storyboard or script,** if they have one. It is the master.
3. **Length.** 30 s and 48 s are proven, and 60 s has a tested music edit. A 30 s film tells one feature; 45–60 s tells the brand story or two or three features.
4. **The grammar.**
   - One camera through a drawing: how Marsad works, or one feature's flow.
   - Shots: the brand, or several product moments.
   - Say which you chose and why.
5. **The product moments:** which pages (`site_pages/*.png`: home, pulse, decisions, assistant, knowledgeMap, links, objectTypes, projects, search, admin) and which real parts (the site kit's cards, rows, toasts, counters).
6. **Format:** a 16:9 (1920×1080) master. Make 9:16 only when asked, and recompose it rather than crop it.

When nobody can answer, use the defaults and list them in the delivery message:
- the audience above;
- the funk track;
- no voice;
- the 30 s map (or 48 s for a brand film);
- the default end;
- 16:9.

## 4. Storyboard on the funk track

1. **Pick the edit for the length** from `references/the-two-films.md`. Each edit puts the track's landmarks where a film needs them:
   - the groove's first beat is **the turn** (Marsad arrives);
   - groove B lifts a product proof;
   - the track's own one-bar **break** holds a line;
   - **the hit** after it is the end.

   A track the client sends may have none of these: one level throughout, no break, no hit. That was the case in `films/whatif-38`.
   - Map it with `tools/beats.py`. Check the downbeat where its sections change, because the tool's guess can be a beat off.
   - Put its biggest lift on the turn, and again on the end. Put a thin block on the break.
   - Make the hits with `stops`: half a beat to a beat of silence before each lift.

   A song's own ending can ring out for seconds of near-silence, and the catalogue allows no silence over 1.5 s. Check it before you end on it. If it rings out too long, end on a section's first hit inside the song and fade its groove under the end card (`films/whatif-38`, its fourth track).

   **Find the real downbeat of every track the client sends.** Give music_fit's `downbeat` beat 1 of a bar, not just any beat: the film's grid counts bars from it.
   - Beat 1 is where the kick is strongest and where each section's first hit lands. In a rock track that hit is often a low "boom", with the crash two beats later.
   - The client heard the miss: "Resync the beat and fix the rhyme with the transition". The What-if film's first rock cut counted bars from beat 3, so every cut and both big hits landed on the crashes, two beats after the booms.
   - After the draft, measure the cut times against the kick: every cut should fall on its bar's loudest kick.
   - Put each visual result on a beat, not the action that causes it. A press comes a little before the beat, and the panel it opens lands on it.
2. **One row per shot:** beats and time, the line in English and Arabic, what is on screen, how depth shows, the transition (a hard cut on the beat, a burst, a crane), and the sound (only on transitions).
3. **Timing:**
   - Shots run 4–10 beats. Cuts fall on beats.
   - Lines build one word per 8th (or 16th), with the Arabic an 8th after the last word.
   - The end starts on the hit and holds at least 5 s.
4. **Reuse approved lines** when a film makes the same point (the bank is in `references/the-two-films.md`), except the ones the catalogue retired (marked there). Write new ones the same way: short statements with one gradient phrase for Marsad's part ("Every system. One living **model.**").
5. **Show the storyboard,** or stills of the key shots, when the brief was loose or the idea is new.

## 5. Build

1. **Start the folder.** `cp -r .claude/skills/marsad-campaign/assets/starter films/<slug>`, or copy the closer approved film's folder when the new film is close to it.
   - Fill in the header comment first: the storyboard, the house rules and the truth list.
   - It is where the next session learns what the film is.
2. **Keep the theme's blocks and replace the shots.**
   - The starter's shots show the patterns: tiles adrift in depth, the turn, a page in perspective, a real card lifting out, a statement over a horizon lens, the breath through the break.
   - For more, copy from the two films: the waiting chat, the hero word, the loop's pills, the carousel under a dome, the turning Knowledge Map, the Decisions click, the defence rings, the Assistant typing (the 48 s film); the icon rings, the tiered drawing, and pages as glass slabs (the ontology film).
   - `references/main-theme.md` and `references/depth-and-3d.md` explain each one.
3. **Engine rules** (DEMOS.md §5 has the API):
   - Everything is a pure function of `t`. Use seeded randomness (`M.mulberry`), never `Math.random` or timers.
   - Discrete changes (counters, typed text, streamed words) step on `M.FQ(t)`, or motion blur ghosts them.
   - List hard cuts in `window.CUTS`, so blur samples never mix two shots. Show each shot only in its window (`inShot`).
   - Measure an element only once it is shown: a hidden parent measures 0.
4. **Not the light style's helpers.** The main theme doesn't use `M.caption` (the caption band), `M.endcard` or `M.app` (the app window). Its type is `jt`, its end is the capsule, and its pages are screenshots or site-kit parts placed in 3D.
5. **Audio in `film.json`:** the music edit and the transition cues from `references/audio.md`.

## 6. Review stills

```bash
python3 tools/make_demo.py <slug>
python3 tools/stills.py <slug> 1,5,8.5,12,16.5,20,24.5,28,33,40,45,49,55 --beats --formats 16x9 --cols 4 --width 2800
```

Pick each shot's first frame, its action, its result and its hold. Open the full-size stills (`style_audit/<slug>-16x9_<t>.png`) and go through `references/quality-bar.md`. Fix, then look again. Most defects show up here, and a still costs seconds where a render costs minutes.

## 7. Render, QA

```bash
SUB=1 JOBS=6 ./build_demo.sh <slug> 16x9        # a draft without motion blur (about 1 min for 30 s): check timing in motion
SUB=4 JOBS=6 ./build_demo.sh <slug> 16x9        # the final: the mix, motion blur (4 samples), QA (about 3-4 min for 30 s)
node render_mb.js 6 build/<slug>-16x9.html frames/<slug>-16x9 16 <from> <to> && python3 tools/blend.py frames/<slug>-16x9
ONLY=audio ./build_demo.sh <slug> 16x9          # re-mux and QA on the frames as they are
```

- **The fast moves** (bursts, cranes, flights, the pull-back, the capsule's bloom) ghost with 4 samples. Render their frame ranges again with 16 samples (the third line, once per range), then run `ONLY=audio`.
  - QA's `fast moments (>12)` names them.
  - A full rebuild resets these ranges, so redo them after every one, and write them in HANDOFF.md.
- **QA must print `RESULT PASS`:** pulse at most 1.15, shake 0, audio −14 ± 1.5 LUFS with a true peak at or under −1 dBTP. The funk track needs `"true_peak": -3` in `film.json`.
  - Then look at `style_audit/<slug>-16x9-sheet.png`.
  - If a check fails, find the cause in the frames it names. Don't loosen the check.
- Run long renders in the background and wait on their log. A render's first `RESULT` line can be an earlier build's.

## 8. Deliver and record

- Send `out/<slug>-16x9.mp4` (under 30 MB) with a line on what it shows. Give timestamps for anything the client asked to change.
- In the same message, list every rendering and invented element, and anything the client hasn't settled.
- Commit `films/<slug>/` (including any derived images, such as blanked page bases) and any tool change to `main`, and push. Never commit `out/`, `frames/` or `kokoro-en-v0_19/`.
- Add the film to HANDOFF.md's campaign films: story, music edit, cues, QA, the 16-sample frame ranges, and the renderings to confirm.

## 9. When the client gives feedback

Treat each correction as a rule for every future film, not a one-off fix. Apply it to the current film. Then write it where the next film will see it:
- this skill: the rule in §1, the technique in a reference, the defect in `references/quality-bar.md`;
- `CLAUDE.md` if it is a house rule;
- HANDOFF.md.

The skill's source is `.claude/skills/marsad-campaign/` in the repo. After changing it, run `python3 tools/package_skill.py marsad-campaign` and commit `skills/` too.
