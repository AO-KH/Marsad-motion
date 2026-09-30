# Marsad motion — notes for Claude

Motion videos for **Marsad**, the sovereign AI business platform by NASL Technologies (Saudi market; English
and Arabic). Everything is a deterministic HTML animation (`window.SEEK(t)`) rendered to frames with Playwright
and muxed with ffmpeg.

## What's here

- **Product demo videos** (the ongoing work): `engine/`, `demos/`, `tools/`, `build_demo.sh`. Read
  [`DEMOS.md`](DEMOS.md). To make one, follow the `marsad-demo` skill
  (`.claude/skills/marsad-demo/SKILL.md`), which is the baseline for all demo work. Its references hold the
  reference walkthrough's anatomy and the quality checklist.
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

- Demos: the web app's light UI with a soft purple glow; glass icons; real app pages; the logo end card.
- Campaign films: Marsad's main theme, the 48 s film's ("the theme of 48 second video is good"): a near-black stage
  with glowing lenses and dust, white type blurring in with the Arabic under it, the app's real pages and parts in 3D
  ("make this 3d") with glowing rims, the client's funk track, whooshes on the transitions only, and the capsule end.
- Bilingual: every line of text in English and Arabic.
- Calm pace: entrances 0.6–1.0 s on a decelerating ease, camera glides of 1–1.5 s, nothing pops.
- No shaking (camera shake, wiggles, bobbing, overshoot), no pulsing to the beat, no camera cuts in demos (campaign
  films in the main theme cut on the beat, as the 48 s film does).
- Demos: music and captions only, no voiceover. Formats 16:9 and 9:16.
- Campaign films: a 16:9 master; the captions carry the story (it must read with the sound off); an English
  voiceover is optional and uses Kokoro "Michael", the voice the client chose ("this is so robotic voice" ruled the
  others out). The end says "Book your demo · احجز عرضك التجريبي" and marsadnasl.com.
- Western digits (0–9) in captions, callouts and the steps rail, in both languages, as in the app.
- Readable on a phone: in 9:16 the subject is shown at a readable size (pan, don't shrink). The cursor and
  callouts never cover what they explain.
- Final renders have motion blur (the default in the builds); drafts (`SUB=1`) are never delivered.

## Working conventions

- Verify before delivering: stills in both formats (`render_ab.js`), the full build, `tools/qa.py` PASS, then look
  at the contact sheet in `style_audit/`.
- Deliver MP4s in chat (under 30 MB each; the builds use crf 20, AAC 192k, -14 LUFS). Build outputs (`build/`,
  `frames*/`, `out/`, `style_audit/`) are gitignored.
- Commit to `main` of AO-KH/Marsad-motion and push. The client pulls into `C:\Users\aomar\Desktop\Marsad motion`
  on Windows (Git Bash: `PYTHON=python bash build_demo.sh <slug>`).
- Keep `DEMOS.md` (demos) and `HANDOFF.md` (the ads and campaign films) current: delivered versions and any new
  client decision. After changing a skill, run `python3 tools/package_skill.py` and commit `skills/`.
