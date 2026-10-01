# Marsad motion — notes for Claude

Motion videos for **Marsad**, the sovereign AI business platform by NASL Technologies (Saudi market; English
and Arabic). Everything is a deterministic HTML animation (`window.SEEK(t)`) rendered to frames with Playwright
and muxed with ffmpeg.

## What's here

- **Walkthroughs** (the ongoing work): the client gives a feature of the SaaS, and a video explains it by using the
  real app. `engine/`, `demos/`, `tools/`, `build_demo.sh`; read [`DEMOS.md`](DEMOS.md).
  - Follow the `marsad-demo` skill (`.claude/skills/marsad-demo/SKILL.md`).
  - The method (since September 2026) is Benji Taylor's walkthrough grammar in Marsad's main theme, built with the
    walkthrough kit (`demos/kit/walk.js`).
  - Walkthroughs show **the real app's screens**: the client sent their front end (2026-09-30: "this is marsad
    front end", a zip of the Next.js monorepo; not in this repo, unzip it anywhere). `tools/app_snap.js` runs it
    with sample data and freezes each state a walkthrough needs into `demos/<slug>/app/` (DEMOS.md §6.0). The site
    kit stays for the ads and for screens the front end doesn't have.
  - The reference is `demos/decisions-real/` (on the real screens); `demos/decisions-walk/` is the same walkthrough
    on the site kit, from before the front end arrived. The skill's references hold the feature brief, the method's
    numbers and the quality checklist.
  - The earlier light-style demos in `demos/` are the previous method.
  - `skills/marsad-demo.skill` and `.zip` are its installable copies for a Claude account.
  - Rebuild them with `python3 tools/package_skill.py` whenever the skill changes.
- **New campaign films** (brand, launch and feature ads, 30–90 s) are made in Marsad's main theme, the look of the
  client's two approved films: the 48 s film (`films/style-jupiter/`) and the ontology film
  (`films/ontology-main-theme/`). Each is `films/<slug>/` (`film.json`, `film.js`, `film.css`), built with the demo
  engine and `build_demo.sh`. Follow the `marsad-campaign` skill (`.claude/skills/marsad-campaign/SKILL.md`) and
  start from its starter (`assets/starter/`). Sound effects (and a voice, if asked) are mixed by
  `tools/film_audio.py`; the Kokoro voice model (`kokoro-en-v0_19/`) is downloaded, never committed.
- **Two finished ads**: `film.html` (63 s campaign film, `./build.sh`) and `film54_src/` → `film54.html` (54 s
  "Know. Watch. Decide.", `./build54.sh`). Their history, beat maps and delivered versions are in
  [`HANDOFF.md`](HANDOFF.md). Change them only when asked.
- **The Monitor film** (13 s, 120 BPM, dark UI on a black stage, cuts on the beat): `films/monitor/`. Read its
  [`README.md`](films/monitor/README.md). Its own production brief governs it where it differs from the rules below
  (black stage, beat cuts, the bell swing, overshoot on the press and the seal only).
- `site_kit.js` / `site_kit.css`: the Marsad web app rebuilt as HTML (shared by the ads and the demos).

## The client's rules (each one was an explicit correction; apply them everywhere)

- Walkthroughs (the client's request, September 2026: "take these video for the walk through and take them as
  reference … keep the marsad and NASL theme"): Benji Taylor's walkthrough grammar in Marsad's main theme.
  - The real app, with its light UI, in a window on the main theme's dark stage: soft violet glows and nothing else.
    The client took out the lens circles ("replace it with stars") and then the stars ("remove the stars").
  - One continuous camera that dives onto each click and pulls back.
  - A hand clicks, and the app's own states change.
  - One step line at a time, English · Arabic, in a dark capsule.
  - The part that proves the feature floats out in 3D.
  - The benefit line, then the capsule end; 16:9.
  - The music is the client's launch track ("use this music": `fit/monume-product-launch-review.mp3`, the kit's
    `launch` map). Any tonal hit is re-tuned to the track's key.
  - Every click is heard ("add sfx for the click"), with the client's mouse click ("use this click sound":
    `fit/sfx/mouse-click.mp3`, since 2026-09-30). One click per bar at most, in the bar's silence (+1.5–2 beats on
    the launch track), heard at least 6 dB over the music; the result lands on the bar's +2.5 hit. Whooshes stay on
    the transitions only; there are no other UI sounds.
  - The app's own screens and states, captured from the client's front end: its text, its dialogs, its messages.
    Sample data is plausible and listed at delivery, like anything typed or shown out of the app's order.
  - The sample on the real screens (`demos/decisions-real`) awaits the client's verdict.
  - The earlier light-style demos (a steps rail, the logo end card, 16:9 and 9:16) are the previous method.
- Campaign films: Marsad's main theme, the 48 s film's ("the theme of 48 second video is good"): a near-black stage
  with glowing lenses and dust, white type blurring in with the Arabic under it, the app's real pages and parts in 3D
  ("make this 3d") with glowing rims, the client's funk track, whooshes on the transitions only, and the capsule end.
- Bilingual: every line of text in English and Arabic.
- Calm pace: entrances 0.6–1.0 s on a decelerating ease, camera glides of 1–1.5 s, nothing pops.
- No shaking (camera shake, wiggles, bobbing, overshoot) and no pulsing to the beat. Walkthroughs have one continuous
  camera; the only cut is on the end's hit. Campaign films in the main theme cut on the beat, as the 48 s film does.
- Demos and walkthroughs: music and on-screen lines only, no voiceover. Walkthroughs are 16:9; the light-style
  demos were made in 16:9 and 9:16.
- Campaign films: a 16:9 master; the captions carry the story (it must read with the sound off); an English
  voiceover is optional and uses Kokoro "Michael", the voice the client chose ("this is so robotic voice" ruled the
  others out). The end says "Book your demo · احجز عرضك التجريبي" and marsadnasl.com.
- Western digits (0–9) in captions, callouts and the steps rail, in both languages, as in the app.
- Readable on a phone: in 9:16 the subject is shown at a readable size (pan, don't shrink). The cursor and
  callouts never cover what they explain.
- Final renders have motion blur (the default in the builds) and are 4K, 3840×2160 (`build_demo.sh` renders finals at
  `SCALE=2`: the client found the 1080p walkthrough soft, "the resolution is bad here", 2026-10-01). Drafts (`SUB=1`,
  1080p) are never delivered.

## Working conventions

- Verify before delivering: stills in both formats (`render_ab.js`), the full build, `tools/qa.py` PASS, then look
  at the contact sheet in `style_audit/`.
- Deliver MP4s in chat (under 30 MB each: the builds start at crf 20 and raise it until the file fits; AAC 192k,
  -14 LUFS). Build outputs (`build/`, `frames*/`, `out/`, `style_audit/`) are gitignored.
- Commit to `main` of AO-KH/Marsad-motion and push. The client pulls into `C:\Users\aomar\Desktop\Marsad motion`
  on Windows (Git Bash: `PYTHON=python bash build_demo.sh <slug>`).
- Keep `DEMOS.md` (demos) and `HANDOFF.md` (the ads and campaign films) current: delivered versions and any new
  client decision. After changing a skill, run `python3 tools/package_skill.py` and commit `skills/`.
