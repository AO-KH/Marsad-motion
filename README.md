# Marsad motion — campaign film

A 63-second bilingual (EN/AR) ad for **Marsad**, the sovereign AI business platform by NASL Technologies.
It is built as a deterministic HTML animation (`film.html`) and rendered to video with Playwright and
ffmpeg.

- **Start with [`HANDOFF.md`](HANDOFF.md).** It covers where the film stands, the build pipeline, the
  music's beat grid, the scene-by-scene beat map, the audio and voiceover setup, and the client's
  decisions.
- **Rebuild the film:** run `npm install`, then `./build.sh`. It takes about 5 minutes and writes
  `out/marsad-film.mp4`.
- **On Windows:** run `npm install`, then `npx playwright install chromium`, then
  `PYTHON=python bash build.sh` from Git Bash.
- **Quick look without rendering:** open `film.html` in Chrome and run `SEEK(11.6)` in the console to
  jump to any second.
