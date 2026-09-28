# MARSAD campaign film — handoff

Everything needed to continue the film lives in this repo: **AO-KH/Marsad-motion**, branch `main`. The
local copy is at `C:\Users\aomar\Desktop\Marsad motion`.

The project was split out of the Marsad product monorepo (`Mohammedx12/marsad`, folder
`marketing/campaign-film/` on branch `claude/sweet-carson-48mpkx`), with its history kept. Work here
from now on.

Read sections 1–4 before changing anything; section 7 lists what the client has asked for and rejected.

This file covers the two finished ads. For new product demo videos, see [`DEMOS.md`](DEMOS.md).

## 1. Where things stand

- **Latest delivered cut: v6** (`marsad-film-final-v6.mp4`, sent in chat on 2026-09-25): 63.0 s, 1920×1080,
  30 fps, H.264 (crf 20) + AAC 192k, master at −14.5 LUFS / −1.5 dBTP. v6 is v5 with glass icons (section 7,
  item 10); timing and audio are unchanged.
- **What it is:** a 63-second bilingual (EN/AR) ad for **Marsad**, the sovereign AI business platform by
  NASL Technologies. It uses the Marsad web app's light visual language with a purple glow layer and real
  app pages. The English voiceover is TTS (Kokoro, voice "Michael"). The music is SoundSurfer's "Stylish",
  fitted without time-stretch.
- **State of the edit:** every visual event, sound effect and voice phrase sits on the music's 94 BPM beat
  grid, and nothing pulses to the beat.
- `./build.sh` rebuilds v6 from this folder (v6 was rendered with it). The audio is byte-identical to v5's;
  see section 9.

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
10. **Glass icons.** The client asked for glassy icons in the 54 s film (section 12), then **"apply the glass to
   the first video"**. The source tiles (S1, and the tiles flying into the charge in S3) and the S5 source
   chips are frosted glass: `GLASS(col)` in `film.html`, styles in `<style id="glass">`. The app pages keep
   the site's own styling.

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

- **v6** was rendered with `./build.sh` here. Its audio master is byte-identical to v5's (same md5), and
  `pulse_check.py` still reads 1.0×. A per-frame glow scan of the glass tiles and chips shows no flicker.
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
- Glass elements: build them with `GLASS(col)`, which adds four layers — `.gk` opaque lavender base, `.gb`
  colour glow, `.gp` frosted pane (`backdrop-filter`), `.gs` gloss. Keep the `.gk` base. Without it the pane's
  backdrop depends on Chromium's *backdrop root*: whenever the element fades (opacity < 1) or the camera's
  motion blur puts a filter on `#cam`, the pane frosts only the glow, which doubles, so the glass flickers
  between vivid and faint. The 54 s v2 had this flicker on its Know/Watch/Decide icons.

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
| `marsad-film-final-v5.mp4` | Rhythm lock without pulsing. |
| `marsad-film-final-v6.mp4` | Glass source tiles and chips, as in the 54 s film. **Current.** |

Earlier explorations (a dark-glass style pass, four synthesized music samples) are superseded.


## 12. Second film: "Know. Watch. Decide." (54 s)

This is a rebuild of an older 54-second dark "space" cut. The client asked for:
- the new light website style, like the 63-second film;
- the **same script and captions**;
- the **same music track**;
- **no voiceover**: music and captions only;
- no pulsing, as in section 7;
- after v3: **"make the pace a little slower and remove the icons shaking"**. The client chose *same length,
  calmer motion* (not a longer cut with slowed music). See "Calm pace" below.

Delivered cuts:

| Version | What changed |
|---|---|
| `marsad-54s-v1.mp4` | First cut. |
| `marsad-54s-v2.mp4` | Glass icons: source tiles, file chips, Know/Watch/Decide icons, glass seal. |
| `marsad-54s-v3.mp4` | The "? SOURCE UNKNOWN · المصدر غير معروف" tag is one pill again (it rendered as three boxes), and the glass no longer flickers (the `.gk` base, section 10). The Know/Watch/Decide icons keep v2's richer glow (`.kwd .kwdIcon .gb` at 0.78). |
| `marsad-54s-v4.mp4` | Calm pace, no shaking (below). Same music, length and storyboard. **Current.** |

- **Build:** `./build54.sh out/marsad-54s.mp4` takes about 6 minutes.
- **Source:** `film54_src/` holds `style.css`, `body.html` and `scenes.js`. `make_film54.py` combines them with
  engine pieces copied from `film.html` (helpers, source tiles, background, camera) into `film54.html`. Edit
  `film54_src/`, then rebuild. Don't edit `film54.html` by hand. The glass helpers (`GLASS`, `shade`,
  `tileHTML`) come from `film.html`, so both films share one glass tile; the glass CSS is per film.
- **Music:** `fit/music54.m4a` is the original track, copied out of the old cut without re-encoding. It is
  normalised to −14 LUFS at build time.
- **Beat grid:** 95.96 BPM. Beat k falls at `0.03 + 0.62525·k` seconds, and a bar is 2.501 s. In the code:
  `vbeat(k)`, `kOf(t)`, `S16`, `S8`, `S32`.

  | Beats | Time (s) | Section |
  |---|---|---|
  | k0–k15 | 0–10 | Quiet intro |
  | k16–k47 | 10–30 | Drums (groove) |
  | k48–k79 | 30–50 | Breakdown, with a hit on k64 (40.05 s) |
  | k80 | 50.05 | Drums return |
  | — | 52.4–54 | Fade |
- **Storyboard.** Each caption holds for 2 bars.

  | Time (s) | Caption | Scene |
  |---|---|---|
  | 0–5 | "Where did this number come from?" | A Q3 sales number counts up, then a "source unknown" tag appears |
  | 5–10 | "Your data is everywhere." | The number shatters into 8 sources and 4 files; they land in the Projects page on 16ths |
  | 10–15 | "Ask. Get proof." | The Assistant types the question on 32nds, streams the answer, then shows source chips and a proof table |
  | 15–20 | "It watches for you." | Business Pulse: the advisor switches on, "new" badges appear and a stock alert slides in |
  | 20–25 | "Both sides. With evidence." | Decisions: a for/against panel with evidence chips and an 80% confidence recommendation |
  | 25–30 | "Sealed. Unrewritable." | Approve on k40, the seal stamp lands on k42, then hash, lock and a refused edit |
  | 30–35 | "And much more." | The window recedes into the wall of pages |
  | 35–40 | "Know. Watch. Decide." | One word per 2 beats (k56, k58, k60); the words converge into the logo |
  | 40–54 | — | Logo ignition on k64, then wordmark, tagline, marsadnasl.com and "Book your demo · احجز عرضك التجريبي" when the drums return |
- **Focus track:** `FOCUS` in `scenes.js` pushes the app window in on the key moments, so the small UI text
  stays readable. A white band behind the captions keeps them legible over the zoomed window.
- **Calm pace (v4).** Keep these when editing:
  - No shaking: no `shake` camera moves, no rotation lean, no wiggles (the refused edit only turns the button
    red), no bobbing (the sources drift outward in a straight line), no overshoot on the logo (4%, then settles).
  - No beat cuts in the camera: the zoom-through (k16), page nudges (k24, k32) and zoom-out (k48) jumped the
    zoom or position on the beat and were removed. The window's own grow/recede and 0.55 s page cross-fades
    carry those moments. Only the `rise` into Know/Watch/Decide keeps a cut, at a moment with nothing on screen.
  - Punches are small (1–2%) and swell in over 0.25 s (`at:0.25`; `camState` in `film.html` takes an optional
    `at`, default 0.05 s, so the 63 s film is unchanged).
  - Entrances run 0.6–1.0 s on `ez.dec`; no `ez.emph` pops. Focus glides take 1.4–1.6 beats.
  - Measured on the camera path (point 500 px from centre): rotation 0 (v3: ±0.8° with 29 reversals), peak
    speed 68 px/frame (v3: 162), frames with a jolt over 3 px 31 (v3: 107).

## 13. Third film: the Monitor film (13 s)

The film lives in `films/monitor/`, and its `README.md` covers the shot list, the build, the cuts, the music, and the
placeholders to replace before release. It is code-rendered with motion blur (`render.js` + `blend.py`) and has an
original score (`audio.py`).

Delivered versions:

- **v1**: the 9:16 Arabic master with the organic end card, plus stills of the organic and paid end cards (2026-09-25).
  Next, once the master is approved: 16:9 and 1:1 recompositions, the 6 s bumper, the English cut, and the paid cut.

## 14. New campaign films (from 2026-09-28)

New brand and launch ads are no longer hand-built pages like `film.html` or `film54_src/`. They are built on the demo
engine, which already has the films' look, real app pages, the current end card, motion blur, review stills, the
edge checker and QA. Follow the `marsad-campaign` skill (`.claude/skills/marsad-campaign/`); its references hold this
film's anatomy, the client's rules for campaign films and the music map of `fit/stylish.mp3`.

- A film is a folder `films/<slug>/` with `film.json` (title, duration, `"formats": ["16x9"]`, music, and optional
  `vo` and `sfx`) and `film.js` (the timeline). `./build_demo.sh <slug>` builds it like a demo.
- `films/kit/` gives every film the eight famous source tiles (as in section 7's glass request), the Marsad mark and
  a big statement style. The engine adds `M.layer()` for scenes outside the app window and `M.punch()` (at most 2%).
- `tools/film_audio.py` speaks the voiceover with Kokoro "Michael" (the model folder `kokoro-en-v0_19/` is
  downloaded as in `tools/make_vo.py` and gitignored), places synthesized effects from `tools/sfx.py` on beats,
  ducks the music under the voice, limits the voice's consonant peaks, and normalises the whole mix to −14 LUFS /
  −2 dBTP (under −1 dBTP after AAC; `tools/qa.py` checks it on the MP4).
- `tools/sfx.py`'s `bloom` fades its chord; the copy in `audio_stems.py` (this film's) still stops dead at 57.8 s.

Films made this way:

| Film | Length | Notes |
|---|---|---|
| [`brand-together-30`](films/brand-together-30/film.js) | 30 s, 16:9 | The skill's test run and worked example (2026-09-28): the famous sources gather and connect into the mark, which flies into the app window's logo; Business Pulse, then Decisions approved in one click; the end card on the drop of "Stylish" (song beat 44 onwards). English voiceover (Michael), EN/AR captions, 16 effects. QA PASS, −14.1 LUFS, −1.8 dBTP. **To confirm with the client before use:** the new caption and voice copy, the staging (recommendations arriving, the spotlight, the mark flying into the logo), the end-card tagline, and the music licence for paid use |
| [`coffee-story-45`](films/coffee-story-45/film.js) | 45 s, 16:9 | "The story of one coffee" (2026-09-28), chosen from a brainstorm grounded in the Marsad User Manual v1.0: one product's object card; its links (order, customer, invoice, warehouse); orders taking its stock below its limit; the alert going out in the app, by email and on WhatsApp; the in-app alert flying into the window's bell; Decisions approved in one click; the product's history, kept 7 years; the end card on the drop of "Stylish" (song beat 20 onwards) with the tagline "Every product has a story. Marsad knows all of it." Captions only (EN/AR), 25 effects. QA PASS, −14.1 LUFS, −1.6 dBTP. **To confirm with the client before use:** the object card, links, order stream, alert chips and history card are film-space renderings of the manual's concepts, not app screens; the sample data (stock 240, limit 200, orders SO-4822 to SO-4829, the times, the approver shown as a role); the "Has invoice" link name; the bell badge 3 → 4; the callout's words; the new captions and tagline; and the music licence for paid use |
| [`coffee-launch`](films/coffee-launch/film.js) | 48 s, 16:9 | "The story of one coffee", launch cut (2026-09-28): the coffee story rebuilt in the grammar of the client's launch-video references (notes.apoorv.xyz/launch-videos, above all azatsol's omnipair and Logan K's AI Studio films; see the skill's `references/launch-style.md`). A dark purple mesh stage, kinetic bilingual type, the app's parts floating in 3D with glowing edges, a zoom-through from the card to its stock, one big cursor click on «موافقة», a logo and URL end card. New CC0 music: HoliznaCC0 "Movement" (96.67 BPM), cut to the picture with `edit`: its two-beat silence under "Every product has a story.", the logo on the hit after it. CC0 UI sounds (uisfx glass and cinematic), tuned to C minor. Credits in `fit/CREDITS.md`. QA PASS, −15.1 LUFS, −2.1 dBTP. **To confirm with the client before use:** the dark stage (a departure from the light house style), the invented sample data and renderings shared with `coffee-story-45`, the new lines ("One living model." is the 63 s film's), and that the new music suits them |
| [`film63-launch`](films/film63-launch/film.js) | 63 s, 16:9 | The 63 s launch film ("the first video", `film.html` v6), launch cut (2026-09-28): the same story and lines rebuilt in the launch-video grammar, as `coffee-launch` did for the coffee story. The eight famous source tiles scatter in depth; a team chat waits for an answer (a dull card, no glow); the tiles fly into the Marsad mark as the groove starts, and the camera flies through the mark's V; Connect, Unify, Monitor, Act; the Knowledge Map's objects and links build on a turning plane around the mark; Business Pulse's three recommendations, closing in on «مبني على بياناتك»; the Decisions counters and card with one click on «موافقة» (approved 0 → 1); the six defence layers; the Assistant answering an Arabic question from the data; "One operational nervous system." through the music's two-beat silence; the logo on the hit after it (55.9 s), marsadnasl.com and "Book your demo". No voiceover: the lines are on screen. Music: HoliznaCC0 "Movement" (CC0), `edit` `[[16, 96], [128, 150]]`. **v3 (current):** v1's picture and music, with sound effects only on the scene transitions (the client's rule): v1's own swipes and its two cinematic hits (the mark, the logo), plus the same swipe on the other scene changes, 11 in all; the UI makes no sound. QA PASS, −14.9 LUFS, −2.1 dBTP. v1 had 60 UI sound hits. v2 tried Koi-discovery "Oxforf by Night" (CC0, `stops`, synthesized `air` whooshes, 64.5 s); the client went back to "Movement". **To confirm with the client before use:** the dark stage (a departure from the light house style); the voiceover left out; the call to action updated from the original's "Request a demo · nasl-tech.com" to "Book your demo · marsadnasl.com"; the English sub-line "The answer comes from your original data." (the original's) with a new Arabic line «الإجابة من بياناتك الأصلية.»; Western digits in the answer (8.2%); the new staging (the tiles flying into the mark, the sources docking around the model, the carousel into Decisions); and the renderings kept from the 63 s film (the team chat, the question and its answer, the six layers) |
| [`style-lovable`](films/style-lovable/film.js) | 28.6 s, 16:9 | Style sample (2026-09-28): the client asked to see the film in the styles of two more launch-video references before anything is applied to the 63 s film. This one tells the 63 s film's story in the grammar of Lovable's launch video (`02_Lovable.mp4`): a vivid gradient from black through blue and magenta to orange; a big dark prompt card whose Arabic question types in bold, its newest word in a gradient, with the English under it; a white cartoon hand that clicks send; the Assistant's answer in close-up on lavender; "Built on your data."; the Decisions statuses as a big list with the hand on «قيد المراجعة» 6; the Decisions card, one click on «موافقة», the counters 0 → 1 and 6 → 5; "Every system." / "One living model."; the app's ten pages flying into a 3D collage; the white logo, small in the music's silence and big on the hit, then marsadnasl.com and "Book your demo". Music: "Movement", `edit` `[[24, 58], [134, 146]]`; 8 effects, transitions only. QA PASS, −14.8 LUFS, −2.6 dBTP. The two fast camera pushes (frames 214–246 and 446–510) are rendered with 16 blur samples instead of 4 (see the skill's quality bar); a full rebuild renders them with 4 again, so redo those ranges after one. **Renderings to confirm:** the dark prompt card (the Assistant's input restyled as the reference's card) with an "Odoo" source chip, the hand cursor, the mark shown in white, and the question and answer (as in the 63 s film) |
| [`style-jupiter`](films/style-jupiter/film.js) | 48.0 s, 16:9 | Style sample (2026-09-28), with `style-lovable`: the Marsad film in the grammar of Jupiter Exchange's launch video (`03_JupiterExchange.mp4`). Near-black with drifting dust; big lenses with dark bodies and bright rims (Jupiter's navy-teal-lime recoloured to Marsad's indigo, violet, magenta and pink); medium-weight white type with grey and gradient words. **v2 (current)**, at the client's request: more in each frame, on the 63 s film's story and lines. The client first asked for a slower pace (53.4 s on "Movement", 60.5 s on their funk track), then for a quicker one. This cut is 48 s, with scenes of 4–10 beats. The sources and the company's files (the Projects page's) adrift among three lenses, "Your company's data is everywhere."; the lenses turn grey and a team chat waits; the tiles and files fly into the centre, the mark lands on the groove (k16) and a lens bursts out of it, with orbits, "Marsad / changes that."; Connect · Unify · Monitor · Act lit one by one over a horizon, "One workflow. Fully automated."; the source tiles on a carousel under a glowing dome rise into it and the Knowledge Map's objects and links turn around the mark, "Every system." / "One living model."; Business Pulse in perspective, "Real-time recommendations"; a white lens with a real recommendation, "From your own numbers."; the Decisions counters and card with one cursor click on «موافقة» (approved 0 → 1, under review 6 → 5), "Decision to action." / "Nothing in between."; six defence rings snapping in around the mark with their layers; «بالعربية» huge, then the Assistant answering the Arabic question from the data; "One operational nervous system." through the track's break. On the hit a wide glowing capsule blooms round "Book your demo." and shrinks into the marsadnasl.com capsule under the mark. It replaced two joined lenses, which the client asked to change. Music: the client's track, lightbeatsmusic "Joyful Rhythm Walk Funk" (Pixabay 513936, `fit/lightbeats-joyful-rhythm-walk-funk.mp3`, 115 BPM), `edit` `[[0, 48], [64, 80], [48, 64], [64, 76]]` (92 beats): the intro, groove A from k16 (the mark lands), groove B from k48 (Decisions), then groove A's last phrase ending in the track's own one-bar break (k76–79) and the hit on k80 for the end. Earlier cuts: "Movement" (86 beats, 53.4 s, commit 7bb6155) and the funk track at 116 beats (60.5 s, commit add0cec). Each re-cut maps the scenes onto the new grid one scene at a time. Effects on four transitions only. The client asked for whooshes, then for fewer and quieter ones ("don't put it at everything"). There are four synthesized whooshes (`swoosh`, tools/sfx.py): into the mark's landing (k16), the Business Pulse flyover (k38), the shield (k56) and the end (k80). They come with the two cinematic hits on the mark and the end, re-tuned to the track's key (D# minor: `cinematic-start-dsm.wav`, `cinematic-wake-dsm.wav`). `sfx_level` −23. The other cuts have no effect. QA PASS, −14.0 LUFS, −2.7 dBTP. The logo burst and the mark's move (frames 238–294) and the carousel rising into the dome (frames 500–568) are rendered with 16 blur samples; redo those ranges after a full rebuild. v1 (28.6 s, faster, sparser) is commit 80af6f8. **To confirm:** the dark stage; the renderings kept from the 63 s film (the team chat, the question and its answer, the six layers, the tiles flying into the mark) |
| [`ontology-30`](films/ontology-30/film.js) | 29.7 s, 16:9 | Campaign film about the ontology (2026-09-28): the client asked for 30 s at most and allowed another style. It uses the grammar of Figma's launch video (`10_figma.mp4`): a lavender canvas with the Knowledge Map's dot grid; headlines typed at the top left, the newest word in Marsad's purple; a black arrow cursor, a marquee, selection boxes with square handles; the app's object types as coloured name tags. Story: the app's sample records (invoices INV-10477 and INV-10482, the customers متاجر الواحة and مؤسسة الريان التجارية, an invoice line, the WhatsApp note «الفاتورة تأخرت أسبوعًا») lie scattered with the company's files, "Your company's data is everywhere." The cursor drags a marquee over them on the groove (k8). They straighten and each gets its type (عميل Customer, فاتورة Invoice, بند فاتورة Invoice line, ملاحظة Note) in the app's type colours, "Marsad turns records into objects." They tidy into place and typed links draw between them with their names (يذكر · mentions, صادرة إلى · billed_to, تحتوي بند · has_line), "Every link has a meaning." On white, one customer is lit and the rest dim. A double-click sends lights out along its links to the WhatsApp note and the Odoo invoice, "Start from any object. Follow its links." On Marsad's purple, the Knowledge Map's seven types and six links form, and Odoo, WhatsApp and invoices_q3.xlsx connect to them, "Every system. One living model." The end is black, in the track's break: "Meet the Marsad ontology." in a selection box. On the hit (k48) the selection moves to the logo, then marsadnasl.com and "Book your demo" follow, with the cursor resting on it. Music: the client's funk track, `edit` `[[8, 48], [56, 73]]` (57 beats): the intro's second half, groove A from k8, and the bar whose hats rise into the track's own break (k44–47) before groove B's hit (k48). Effects on three transitions: whooshes on the turn (with `cinematic-start-dsm`), on the cut to the model, and into the logo (with `cinematic-wake-dsm`). QA PASS, −14.0 LUFS, −2.9 dBTP. Frames 125–202, 254–278, 382–451, 552–623, 751–772 and 786–814 (the marquee, the tidy-up, the cursor in the follow shot, the sources' flight, the end's selection and cursor) are rendered with 16 blur samples; redo them after a full rebuild. **Renderings to confirm:** the record cards (the app's sample data laid out as cards, amounts in Western digits, where the app shows ١٢٬٤٥٠); the marquee, selections and tags; the double-click lighting the links; the sources flying into the model; "Meet the Marsad ontology." as the end line. The Knowledge Map's seven types and link labels are the site kit's older page; the current page (demos/ontology-walkthrough) shows the client's own workspace types |
| [`ontology-foundry`](films/ontology-foundry/film.js) | 29.7 s, 16:9 | The ontology film, second style (2026-09-28). After the Figma cut (`ontology-30`), the client sent two more references: Palantir Foundry's ontology animation (the hero of palantir.com/platforms/foundry) and "Ringwriter" by Edoardo Lunardi (shared by @kombaiselects). Same music, edit and landmarks as `ontology-30`. The opening follows Ringwriter: on a charcoal canvas, rings of icons of the company's data build out, turn and spin into the centre, "Your company's data is everywhere." At the client's request the rings carry icons instead of words. They are the drawing's own isometric icons, light on dark: Odoo's database, WhatsApp, spreadsheets and PDFs, invoices, invoice lines, customers, products, employees, cities, notes. The first cut, with words, is commit 2449aa3. On the groove it cuts to Foundry's grammar: a white frame (the mark and a turned label in a side strip, titles typed into a box at the bottom left) round a light canvas with a perspective line drawing. There are three tiers of plates with hatched edges and bundles of dashed cables flowing between them. The bottom tier is the sources (Odoo, WhatsApp, the company's files), "Connect your sources." The ontology plate holds the seven object types as isometric icons on pads, with their six links named on pills and a floating card for the WhatsApp note (customer متاجر الواحة, source WhatsApp), "Unify them in one ontology." The top tier is the app's own pages on plates (Business Pulse, Decisions, Assistant); the restock action rises from Product to Decisions, then "Action executed · PO-2291", "Monitor and act." The camera then pulls back to the whole stack, "Every system. One living model." In the break the drawing fades; "Meet the Marsad ontology."; the logo lands on the hit, then marsadnasl.com and "Book your demo". Effects on three transitions (the cut to the drawing, the pull-back, the logo). QA PASS, −14.0 LUFS, −2.8 dBTP. Frames 104–125, 233–267, 359–392, 410–435 and 488–529 (the spin, the two cranes, the action, the pull-back) are rendered with 16 blur samples; redo them after a full rebuild. **Renderings to confirm:** the rings of icons; the tiered drawing (sources, ontology, pages: how Marsad works, drawn); the isometric icons; the note's card layout; the cables; the action's pill ("إعادة التوريد · Restock") and its path. The Knowledge Map's types and link labels are the site kit's older page |
| [`ontology-main-theme`](films/ontology-main-theme/film.js) | 29.7 s, 16:9 | The ontology film in Marsad's main theme (2026-09-28). The client asked for "marsad main theme, fonts color and everything" and named it: "the theme of 48 second video is good" (`style-jupiter`). It keeps the ontology film's story, timing and drawing (`ontology-foundry`) in the 48 s film's look: near-black with dust, lenses with violet-to-pink rims, white Inter type blurring in with gradient words and the Arabic under it, glowing rims and chips, and the capsule end. The opening is rings of icons of the company's data glowing between two lenses, "Your company's data is everywhere." They spin into the centre and a lens bursts out of it (k8). Inside it is the drawing, in dark violet glass with glowing rims: sources with Odoo, WhatsApp and the company's files, "Connect your sources." Then the ontology, its types standing on small lenses with their named links glowing, and the WhatsApp note as the app's search shows it, "Unify them in one ontology." Then the app's pages with glowing rims, the restock action rising to Decisions and "Action executed · PO-2291", "Monitor and act." Then the whole stack over a glowing horizon, "Every system. One living model.", and "Meet the Marsad ontology." through the break. The 48 s film's capsule end lands on the hit. Music and edit as the other ontology cuts; effects on three transitions (the burst with the cinematic hit, the pull-back, the end with the hit). QA PASS, −14.0 LUFS. Frames 104–153, 233–267, 359–392, 410–435, 488–529, 750–768 and 793–820 (the spin and the burst, the cranes, the action, the pull-back, the capsule) are rendered with 16 blur samples; redo them after a full rebuild. **Renderings to confirm:** as `ontology-foundry` (the rings of icons, the tiered drawing, the icons, the cables, the action's pill), plus the lens pads |
