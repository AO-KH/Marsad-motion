# Marsad motion

Motion videos for **Marsad**, the sovereign AI business platform by NASL Technologies: bilingual (EN/AR),
built as deterministic HTML animations and rendered to video with Playwright and ffmpeg.

## Product demo videos

The base for making Marsad demo videos (short feature demos and step-by-step walkthroughs, 16:9 and 9:16,
music and bilingual captions). **Start with [`DEMOS.md`](DEMOS.md).**

```bash
npm install
./build_demo.sh pulse-short             # the short example  -> out/pulse-short-16x9.mp4, out/pulse-short-9x16.mp4
./build_demo.sh decisions-walkthrough   # the walkthrough example
```

## The campaign films

A 63-second bilingual ad (`film.html`) and a 54-second one (`film54.html`).

- **Start with [`HANDOFF.md`](HANDOFF.md).** It covers where the film stands, the build pipeline, the
  music's beat grid, the scene-by-scene beat map, the audio and voiceover setup, and the client's
  decisions.
- **Rebuild the film:** run `npm install`, then `./build.sh`. It takes about 5 minutes and writes
  `out/marsad-film.mp4`.
- **On Windows:** run `npm install`, then `npx playwright install chromium`, then
  `PYTHON=python bash build.sh` from Git Bash.
- **Quick look without rendering:** open `film.html` in Chrome and run `SEEK(11.6)` in the console to
  jump to any second.

## The two films

| Film | Length | Source | Rebuild |
|---|---|---|---|
| Campaign film ("One operational nervous system") | 63 s | `film.html` | `./build.sh` |
| "Know. Watch. Decide." | 54 s | `film54.html`, generated from `film54_src/` by `make_film54.py` | `./build54.sh` |

Both use the new light website style, the same app pages (`site_kit.js`), fonts and logos, and keep every motion on
their music's beat, with no pulsing.
