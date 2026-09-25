# Marsad motion — notes for Claude

Motion videos for **Marsad**, the sovereign AI business platform by NASL Technologies (Saudi market; English
and Arabic). Everything is a deterministic HTML animation (`window.SEEK(t)`) rendered to frames with Playwright
and muxed with ffmpeg.

## What's here

- **Product demo videos** (the ongoing work): `engine/`, `demos/`, `tools/`, `build_demo.sh`. Read
  [`DEMOS.md`](DEMOS.md). To make one, follow the `marsad-demo` skill
  (`.claude/skills/marsad-demo/SKILL.md`).
- **Two finished ads**: `film.html` (63 s campaign film, `./build.sh`) and `film54_src/` → `film54.html` (54 s
  "Know. Watch. Decide.", `./build54.sh`). Their history, beat maps and delivered versions are in
  [`HANDOFF.md`](HANDOFF.md). Change them only when asked.
- **The Monitor film** (13 s, 120 BPM, dark UI on a black stage, cuts on the beat): `films/monitor/`. Read its
  [`README.md`](films/monitor/README.md). Its own production brief governs it where it differs from the rules below
  (black stage, beat cuts, the bell swing, overshoot on the press and the seal only).
- `site_kit.js` / `site_kit.css`: the Marsad web app rebuilt as HTML (shared by the ads and the demos).

## The client's rules (each one was an explicit correction; apply them everywhere)

- The web app's light UI with a soft purple glow; glass icons; real app pages; the logo end card.
- Bilingual: every line of text in English and Arabic.
- Calm pace: entrances 0.6–1.0 s on a decelerating ease, camera glides of 1–1.5 s, nothing pops.
- No shaking (camera shake, wiggles, bobbing, overshoot), no pulsing to the beat, no camera cuts.
- Demos: music and captions only, no voiceover. Formats 16:9 and 9:16.

## Working conventions

- Verify before delivering: stills in both formats (`render_ab.js`), the full build, `tools/qa.py` PASS, then look
  at the contact sheet in `style_audit/`.
- Deliver MP4s in chat (under 30 MB each; the builds use crf 20, AAC 192k, -14 LUFS). Build outputs (`build/`,
  `frames*/`, `out/`, `style_audit/`) are gitignored.
- Commit to `main` of AO-KH/Marsad-motion and push. The client pulls into `C:\Users\aomar\Desktop\Marsad motion`
  on Windows (Git Bash: `PYTHON=python bash build_demo.sh <slug>`).
- Keep `DEMOS.md` (demos) and `HANDOFF.md` (the ads) current: delivered versions and any new client decision.
