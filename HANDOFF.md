# MARSAD campaign film — handoff

Everything needed to continue the film lives in this repo: **AO-KH/Marsad-motion**, branch `main`. The
local copy is at `C:\Users\aomar\Desktop\Marsad motion`.

The project was split out of the Marsad product monorepo (`Mohammedx12/marsad`, folder
`marketing/campaign-film/` on branch `claude/sweet-carson-48mpkx`), with its history kept. Work here
from now on.

Read sections 1–4 before changing anything; section 7 lists what the client has asked for and rejected.

## 1. Where things stand

- **Latest delivered cut: v5** (`marsad-film-final-v5.mp4`, sent in chat on 2026-09-25): 63.0 s, 1920×1080,
  30 fps, H.264 (crf 20) + AAC 192k, master at −14.5 LUFS / −1.5 dBTP.
- **What it is:** a 63-second bilingual (EN/AR) ad for **Marsad**, the sovereign AI business platform by
  NASL Technologies. It uses the Marsad web app's light visual language with a purple glow layer and real
  app pages. The English voiceover is TTS (Kokoro, voice "Michael"). The music is SoundSurfer's "Stylish",
  fitted without time-stretch.
- **State of the edit:** every visual event, sound effect and voice phrase sits on the music's 94 BPM beat
  grid, and nothing pulses to the beat.
- `./build.sh` rebuilds v5 from this folder. The audio comes out byte-identical and the picture visually
  identical; see section 9.

## 2. Quick start

```bash
# from the repo root
npm install                        # playwright 1.63; uses the preinstalled Chromium at /opt/pw-browsers/chromium
./build.sh out/marsad-film.mp4     # ~5 min: audio stems → mix → loudnorm → 1890 frames → MP4
node render_ab.js film.html chk 11.6,25.0,39.1    # quick stills → style_audit/chk_<t>.png
node render_full.js 4 film.html frames 1160 1200  # re-render a frame range only (indices, 30 fps)
```

Needs `ffmpeg`, `python3` with `numpy` (plus `Pillow` for `tools/`), and node 18+. The renderers use
`$CHROMIUM_PATH` if set, else the cloud image's Chromium, else Playwright's own browser.

**On Windows** (local copy at `C:\Users\aomar\Desktop\Marsad motion`):

1. Install Node 18+, Python 3 (`pip install numpy pillow`), and ffmpeg on your PATH.
2. In the folder, run `npm install` and then `npx playwright install chromium`.
3. From Git Bash, run `PYTHON=python bash build.sh`. WSL (Ubuntu) also works with the Linux commands
   above.

For a quick look without rendering, open `film.html` in Chrome, press F12, and type `SEEK(11.6)` in the
console to jump to any second.

Outputs (`out/`, `frames/`, `style_audit/`, `*.npy`, `fit/*.wav`) are gitignored.

## 3. Files

| Path | What it is |
|---|---|
| `film.html` | **The master source.** One deterministic page; all animation code lives here. |
| `site_kit.css`, `site_kit.js` | Rebuilt Marsad web-app UI kit (chrome, sidebar, Business Pulse and Decisions pages), used in S6/S7. |
| `site_pages/*.png`, `site_pages.html`, `render_pages.js` | 10 app pages as stills for the tilted wall behind the end card. `render_pages.js` regenerates them. |
| `assets_logo_m.png`, `assets_logo_wordmark_white.png`, `assets_logo_full_dark.png` | Logo mark, wordmark and full lockup. |
| `fonts/` | IBM Plex Sans Arabic (4 weights), Inter (variable), JetBrains Mono (variable). All OFL. |
| `audio_stems.py` | Sound design: synthesizes every SFX, places voice phrases on the grid and computes the ducking. Writes `stem_rh_*.npy`. |
| `mix_final.py` | Places the music track, mixes it with the stems and writes a WAV. |
| `vo/vo01..vo13.wav` | Voiceover takes. |
| `fit/stylish.mp3` | The music track, supplied by the client. |
| `render_full.js`, `render_ab.js` | Frame renderers: whole film or a range; stills at given times. |
| `build.sh` | One-command rebuild. |
| `tools/pulse_check.py`, `tools/visual_sync.py` | Checks for beat pulsing and beat sync (section 9). |
| `tools/make_vo.py` | Regenerates voice takes. |
| `history/` | The patch chain that produced `film.html`, for reference only (see `history/README.md`). |

## 4. How `film.html` works

- **Deterministic rendering.** `window.SEEK(t)` draws time `t` (0–63 s). Nothing runs on timers or CSS
  animations. `render_full.js` calls `SEEK(i/30)` for i = 0…1889 and screenshots each frame as JPEG q95.
- **Order of the script:**
  - **Helpers:** `st` (set styles), `P(t,a,b)` (progress), and the easings in `ez` (`outC`, `inC`, `ioC`,
    `outE`, `prem`, `emph`, `dec`, `sin`). Also `enter()` / `exitDown()`, the `mulberry` PRNG, and the static
    builders (tiles, app window, graph).
  - **Canvases:** `drawBG` (background gradients, dot grid, dust) and `drawFX` (vignette and grain).
  - **Beat grid and camera:** the grid constants, the camera transition list `TR`, and `camState()` /
    `camera()`, which move `#cam` and apply motion blur and light sweeps.
  - **Logo burst and charge-up:** `ignition()` is the logo burst; `charge()` / `chargeTiles()` is the S3
    build-up.
  - **Scenes:** `scene1…scene10`, with `sceneUI` covering S6 and S7.
  - **Overlays:** `orb()` is the glowing orb that carries between scenes; `flash()` is the purple flash
    overlay.
  - **`SEEK`:** calls drawBG → scenes → orb → flash → ignition → charge → camera → final fade → drawFX.
- **Stage.** The stage is 1920×1080. Everything that moves with the camera is inside `#cam`. Scene divs are
  0×0 absolute boxes, so percentage transform-origins break on them; use px.
- **Scene table** (seconds; boundaries at `vbeat()` values sit exactly on the grid):
  `T={s1:[0,4.6], s2:[4.6,9.6], s3:[9.6,13.169], s4:[13.169,20.190], s5:[20.190,27.4], s6:[27.4,34.4],
  s7:[34.4,41.6], s8:[41.6,48.4], s9:[48.4,55.617], s10:[55.617,63.0]}`.
- **Camera moves** (`TR`), all on beats. For each entry, `a` is seconds before the beat, `b` seconds after.

  | Beat | Move |
  |---|---|
  | k1 | S1→S2 slide |
  | k9 | S2→S3 zoom through the orb |
  | k12 | Ignition: punch + anticipation push-in + lean-in + shake |
  | k16 | S3→S4 pull-back, starting at k14.5 |
  | k26 | S4→S5 whip |
  | k37 | S5→S6 spin into the app |
  | k48 | S6→S7 page nudge |
  | k59 | S7→S8 zoom out |
  | k70 | S8→S9 rise |
  | k81 | S9→S10 reveal on the drop |
  | k88 | Final punch |

## 5. Music and the beat grid (read before retiming anything)

- **Track:** `fit/stylish.mp3` (SoundSurfer "Stylish"), 94.00 BPM, D minor. `build.sh` decodes it to
  48 kHz stereo `fit/stylish.wav`; the grid was measured on that decode.
- **Placement** (`mix_final.py`): the song starts at film 3.8725 s (film time = song time + 3.8725). There
  is one edit, at film 57.532 s: the song jumps from bar 19 to bar 25 (six whole bars, 12 ms crossfade).
  The grid stays continuous and the song's ending lands at the end of the film.
- **Grid:** `vbeat(k) = 9.0197 + 0.63832·(k−8)`, with downbeats at k ≡ 0 (mod 4). The inverse is
  `kOf(t)`. `S16 = MB/4` is a 16th note and `S8 = MB/2` an 8th.
  - Useful beats: k12 = 11.573 (ignition), k16 = 14.126, k55 = 39.021 (the click), k81 = 55.617 (the drop),
    k88 = 60.085.
- **Sections:**

  | Beats | Film time (s) | Section |
  |---|---|---|
  | k0–k3 | 3.91–6.47 | Near-silent intro |
  | k4–k7 | 6.47–9.02 | Build (hats come in) |
  | k8–k71 | 9.02–49.87 | Full groove |
  | k72–k79 | 49.87–54.98 | Breakdown (quiet) |
  | k81 | 55.617 | The drop: end-card reveal |
  | k84 onward | 57.53–63 | Groove to the end, fade 61.7–62.95 |
- **Drum accents within a groove bar:** strongest on beat 1 and beat 4. Kicks fall on the "and" of 2 and of
  3; beat 3 is weak. Put big moments on beat 1 or 4, secondary ones on 2, 2+, 3+ or 4+.
- **Conventions used throughout:**
  - A hit (pop, entrance, click) starts exactly on a beat or an 8th. Staggered lists step in 16ths. Typing
    is one key per 32nd.
  - **Entrances use `ez.dec`** (decelerate, cubic-bezier(0,0,0.2,1)) or `ez.emph`, so the visible motion
    starts on the beat. `ez.prem` (slow start) is kept for exits and transitions; used on an entrance it
    looks about 0.1 s late.
  - **No pulsing.** Nothing may throb, breathe or flash in a loop to the beat; the client rejected it
    explicitly. `beatPulse()` still exists but is unused (`drawBG` has `bp=0`). Continuous motion (arc
    laps, orbits, drifts) and one-off hits (ignition burst, drop flash) are fine.
  - Every SFX is placed at the same grid time as its visual, and every voice phrase starts on a grid point.
    Section 6 lists them.

## 6. Timeline (beat map)

k = beat index. Times are the film times of those beats.

- **S1, 0–4.6 (before the music):** the data-source tiles scatter. Caption "Your company's data is
  everywhere." VO1 starts at 0.95.
- **S2, 4.6–9.6: waiting chat.**
  - The question bubble pops on k1.5 (4.871).
  - Typing dots run from k2.5: one wave per beat, with ticks on the last two 16ths of each beat.
  - The "WAITING · 00:47" counter steps once per beat from k3 to k8, each step with a clock tick.
  - Caption on k4 (6.466), Arabic line on k4.5.
  - VO2 "And when you need a quick answer — your system makes you wait." starts on k3.5 (6.147).
- **S3, 9.6–13.169: charge-up and ignition.**
  - The eight source tiles spiral in with light trails and are absorbed on k10, 10.5, 11, 11.25, 11.5 and
    11.75. The last pair hits on k12, which triggers the burst.
  - A charge ring fills one step per absorb, energy streaks pull inward, a 1.25 s riser builds, and the
    camera leans in.
  - **Ignition on k12 (11.573):**
    - The M bursts in (scale 0.35 → 1.2 → 1.0, drawn 1.55× its original size).
    - Two shockwaves, 18 rays and 30 sparks fire.
    - The camera punches and shakes, and the purple flash lands on the beat with a thump.
  - The hold that follows has a slow push-in, a glint sweeping the M (12.19–12.79) and three orbiting dots.
  - Caption words rise in 16ths from k12.5 (EN) and k13 (AR). VO3 "Marsad changes that." starts on k12.5.
- **S4, 13.169–20.190: the loop.**
  - The glow arc does one lap per bar; its head reaches the top node on each downbeat.
  - The nodes pop with their words, each with a D-minor ping: CONNECT on k16 (14.126), UNIFY on k17.5
    (15.084), MONITOR on k19 (16.041), ACT on k20 (16.680).
  - Caption "One workflow. Fully automated." on k22 (17.956), Arabic on k22.5.
  - VO4 is split into phrases: "Connect." on k16, "Unify." on k17.5, "Monitor… and act." on k19.
  - VO5 is split: "One workflow." on k22, "Fully automated." on k23.5.
- **S5, 20.190–27.4: data model.**
  - Four source chips step in by 16ths from k26.
  - Six graph objects step in by 16ths from k29 (22.424), each with a blip.
  - Five links draw on in 8ths from k30.5, each label one 8th later, with ticks.
  - The Marsad hub (M at 180 px) lands on k33 (24.978) with a pop. Spokes follow in 16ths from k33.5.
  - Caption "Every system. One living model." on k33.5, Arabic on k34.
  - Everything contracts into the app's spinner at 26.85–27.4.
  - VO6 starts on k28 (21.786).
- **S6, 27.4–34.4: Business Pulse (نبض الأعمال).**
  - The window arrives on k37, the tag on k38, the tabs on k37.75.
  - The heading lands on k39, the generate button on k39.5, the advice card on k39.75.
  - Three recommendations step in by 16ths from k40.
  - Caption on k40.5, Arabic on k41. VO7 starts on k39 (28.808).
- **S7, 34.4–41.6: Decisions (القرارات).**
  - The heading lands on k48 and four stats step in by 16ths from k48.5. The tabs follow on k49.5 and the
    list on k50.
  - The top decision lifts forward on k51 (36.467).
  - The cursor travels from k52 to k54.75, where it hovers.
  - **The click lands on k55 (39.021, beat 4):** press, green flash, ripple and click sound.
  - The success toast and the updated counts land on k56 (39.659), with a chime.
  - Caption "Decision to action. Nothing in between." on k56.5, Arabic on k57.
  - VO8: "One decision." on k51 and "One click." on k54.5, so the word "click" lands on the click.
  - VO9: "Decision to action." on k56, "Nothing in between." on k58.
- **S8, 41.6–48.4: shield.**
  - The core M (120 px) appears on k59.25.
  - Six defence rings snap in on 8ths from k60 (42.212), each with a snap sound; their labels follow.
  - The grid caption appears on k64.
  - Caption "Defense in depth. Sovereign. PDPL-compliant." on k66.5, Arabic on k67.
  - VO10 phrases start on k60.5 and k64.5.
- **S9, 48.4–55.617: Ask in Arabic.**
  - The heading lands on k70, the sub-line on k70.5 and the chat panel on k71. The caret blinks on the beat.
  - The Arabic question types from the breakdown downbeat k72 (49.872): one key per 32nd, two characters per
    key.
  - Send is pressed on k74.5 and the user message posts on k74.75.
  - The answer panel appears on k75.5. The answer streams one word per 16th from k75.75, each word with a
    tick.
  - The source chip appears on k79.5. A riser builds into the drop.
  - VO11: "Ask in Arabic." on k71, the rest on k73.
- **S10, 55.617–63: end card.**
  - The end card sits over a tilted wall of the app's pages.
  - The M lands on the drop (k81) with the flash and bloom sound.
  - The wordmark and VO12 "Marsad." land on k82.
  - VO12 "One operational nervous system." starts on k83.5. The tagline lands on k84, Arabic on k84.5.
  - The CTA lands on k86, then VO13 "Request a demo at nasl tech dot com." starts on k86.5. The footer
    follows on k87.
  - The final camera punch is on k88. The film fades to white from 61.7 to 62.95.

## 7. What the client asked for (keep these decisions)

In order:

1. **Keep the video as it is and change the styling only.** TikTok motion-graphics references
   (@limitless.media_, @nucman.fx) were for style, not structure. A 9:16 cutdown with an EDL was proposed
   and **rejected**; ask before proposing a re-cut.
2. **Follow the new website UI and show its pages.** This produced the light theme, the rebuilt app pages
   in S5–S7 and S9, and the page wall in S10.
3. **Add a glowed purple styling** (the glow layer).
4. **Fit the supplied track** (SoundSurfer "Stylish") to the film. It was fitted with no time-stretch, and
   the SFX were retuned to D minor.
5. **Transitions aligned with the video and music:** the beat-locked camera moves.
6. **Remove the "THE PROBLEM" and "HOW IT WORKS" labels and make the Marsad logo bigger** (M at 180 px in
   the graph hub, 120 px in the shield core).
7. **"When the logo appears the transition looks static":** fixed with the S3 charge-up and ignition burst.
8. **Align the rhythm between the video and music:** everything on the grid, as in sections 5 and 6.
9. **"It is pulsing, don't make it like that":** all beat-synced pulsing was removed. Do not bring back
   background flashes, logo or node kicks, or breathing loops.

## 8. Audio pipeline

- **`audio_stems.py`** (run with `VO=1`; without it you get a version with no voice):
  - Synthesizes every SFX with numpy. The generation is deterministic (seeded).
  - The score block starts at `# ---------------- SFX score` and places everything with `vb(k)`.
  - `VO_PLAN` lists `(take, phrase indices, film time of the first syllable)`. Phrases are found
    automatically as parts of a take separated by at least 0.18 s of silence; cuts fall mid-gap with 8 ms
    fades.
  - A ducking envelope is computed from voice activity, and the stems are written as `stem_rh_{sfx,vo,duck}.npy`.
  - The file still contains an old synthesized music bed multiplied by 0; ignore it.
- **`mix_final.py <stem prefix> <out.wav>`** places the music as described in section 5 and mixes:
  - The music bed sits 8.5 dB under speech RMS and ducks by (1 − 0.66·duck) under the voice, which leaves
    speech about 12 dB above the bed.
  - The mix fades from 61.7 to 63 s and is peak-limited at 0.89.
- **Mastering:** `build.sh` runs a two-pass `loudnorm` to −14 LUFS / −1.5 dBTP.
- **Voice:** Kokoro v0.19 speaker 6 ("Michael") through sherpa-onnx. `tools/make_vo.py` has the exact line
  texts and time budgets, plus the model download. After regenerating a line, check that its `VO_PLAN`
  phrase indices still match.

## 9. Verification

- **This rebuild:** `./build.sh` in this folder reproduced v5 (compared on 2026-09-25).
  - The audio mix and master are byte-identical.
  - The frames are visually identical. 1,674 of 1,890 are byte-identical.
  - The other 216 differ only by Chromium anti-aliasing noise on edges. Most are off by under 25 levels
    out of 255 on a few hundred pixels.
  - The largest single case is 1,460 pixels along the end-card logo's edges, invisible side by side.
- **`python3 tools/pulse_check.py frames`** gives the median ratio of the frame change right after each
  beat to the change in surrounding frames. 1.0 means no pulsing; v4 measured 12×, v5 measures 1.0×.
- **`python3 tools/visual_sync.py frames`** gives the share of element onsets that start within one frame
  of an 8th note. It counts local changes only and excludes camera moves.
  - Results: v3 19% (chance is about 21%), v5 56%.
  - Most of the rest are 16th and 32nd-note sequences, exits, and a one-frame detection lag on small
    elements.
- **Chat upload limit:** files over 30 MiB are rejected. crf 20 with AAC 192k gives about 18–24 MB.

## 10. Editing tips

- Edit `film.html` directly. Express times as `vbeat(k)`, `S16` and `S8` rather than seconds.
- For each new visual hit, add its sound in `audio_stems.py` at the same `vb(k)`. Voice timing lives in
  `VO_PLAN`.
- Preview with `render_ab.js` stills. For small fixes, re-render only the affected frame range with
  `render_full.js … <from> <to>` and re-run the mux line from `build.sh`.
- Keep entrances on `ez.dec` or `ez.emph`. Do not add beat-synced loops.

## 11. Delivered versions (all sent in chat; not stored in the repo)

| Version | What changed |
|---|---|
| `marsad-film-site-v1.mp4` | Light site edition with real pages. |
| `marsad-film-site-glow.mp4` | Purple glow layer. |
| `marsad-film-site-glow-music.mp4` | "Stylish" track fitted. |
| `marsad-film-final.mp4` | Beat-locked transitions. |
| `marsad-film-final-v2.mp4` | Labels removed, bigger M. |
| `marsad-film-final-v3.mp4` | Dynamic logo reveal (charge-up and ignition). |
| `marsad-film-final-v4.mp4` | Rhythm lock (had beat pulsing). |
| `marsad-film-final-v5.mp4` | Rhythm lock without pulsing. **Current.** |

Earlier explorations (a dark-glass style pass, four synthesized music samples) are superseded.
