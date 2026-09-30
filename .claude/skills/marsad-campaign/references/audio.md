# Music, effects, the mix, and an optional voice

`film.json` holds a film's audio. `./build_demo.sh <slug>` builds it:
1. `tools/music_fit.py` fits the music: the `edit`, with no time-stretch.
2. `tools/film_audio.py` adds the effects (and a voice, if any).
3. The mix is mastered to −14 LUFS with one linear gain, then a limiter on a 4× oversampled copy, so the track keeps its own dynamics.

## The music: the client's funk track

The client supplied it for the 48 s film ("use this music"), and both approved films use it.

- **The track:** lightbeatsmusic "Joyful Rhythm Walk Funk", Pixabay music 513936, `fit/lightbeats-joyful-rhythm-walk-funk.mp3`.
  - Licence: the Pixabay Content License, recorded in `fit/CREDITS.md`. Pixabay's pages answer 403 to the build container, so the licence page was not opened from here.
  - 115 BPM, downbeat 0.538 s, key D# minor, 138 s long.
- **Its sections** (song beats; rows of 16 beats):

| Song beats | Section | Use |
|---|---|---|
| k0–15 | Intro: bass, no hats, about 7 dB under the groove | The hook and the problem |
| k16–59 | Groove A | The turn on k16; the story's shots |
| k60–63 | The one-bar break: the bass drops out, about 15 dB down | A held line: the track's own stop before a hit |
| k64–95 | Groove B: busier hats | After the break: the hit on k64 (the end), or a lift for a proof |
| k96–127 | Breakdown without bass | A quiet moment, if a long film needs one |
| k128–159 | Groove C | — |
| k160–223 | The full groove | — |
| k224–255, k256 | Outro, one last hit | — |

- **The block, as in the 30 s film:**

```json
"music": {"file": "fit/lightbeats-joyful-rhythm-walk-funk.mp3", "bpm": 115, "downbeat": 0.538,
          "edit": [[8, 48], [56, 73]], "fade_out": 2.2, "true_peak": -3}
```

- **`edit`** plays those song sections in order (beats from `downbeat`). `the-two-films.md` has the tested maps for 30, 44, 48 and 60 s.
  - Each later section starts 30 ms early for a crossfade, so its first beat lands on the join at full level.
  - Start the first section on a bar line (a song beat divisible by 4), so film beat 0 is a downbeat.
  - A section can end a few beats into a phrase to fit the film's length; the fade covers it.
- **`true_peak: -3`:** the track is bass-heavy, and AAC adds up to 1.5 dB to its peaks. Without it the MP4's true peak fails QA.
- **`fade_out`** 2.2–2.4 s at the end.
- **No time-stretch, ever.** To fit a length, change the edit and the scene lengths.

**Another track** only if the client supplies or approves it:
- Its licence must allow commercial use and editing (CC0, or the site's own commercial licence), confirmed on the track's own page, and recorded in `fit/CREDITS.md`. Collections mislabel: NC or ND is never usable.
- Map it with `python3 tools/beats.py <file>` (the tempo, downbeat candidates, a loudness bar per bar). Confirm the downbeat against a section change, then run `--downbeat <s> --beats A-B` for a beat-by-beat map with its stops and hits.
- **Moving a film to another tempo:** keep the scene lengths in seconds and map the scene boundaries onto the new beats one by one. Then line up the landmarks: the groove's start, the stop and the hit.
- `stops: [[a, b]]` (film beats) silences any track from a to b and brings it back in time. It gives a track without its own break the stop-then-hit.

## Effects: the transitions only

The client asked for whooshes ("add whoosh sfx") and then for fewer ("reduce it dont put it at everything"). The approved pattern:

| Where | Cue | Values |
|---|---|---|
| The turn (the groove's first beat) | `swoosh` + `fit/sfx/cinematic-start-dsm.wav` | swoosh `gain` −3, `dur` 1.4, `rise` 0.75, `f1` 4200, `body` 0.6, `pan0`/`pan1` 0, `width` 0.55; the hit at −4 |
| One or two big mid-film moves (a flyover, a swing, a pull-back) | `swoosh` alone | `gain` −5 to −6, `dur` 1.0 (default), `f1` 3000, `body` 0.6–0.7, or `f2` 1200 for a darker tail; pan it the way the picture moves (0.5 → −0.5) |
| The end (the hit) | `swoosh` + `fit/sfx/cinematic-wake-dsm.wav` | as the turn's, `gain` −2; the hit at −2 |

- **Counts:** three cues in a 30 s film (turn, one move, end), four in a 48 s film (turn, two moves, end).
- **Levels:** `"sfx_level": -23`. The two hits sit about 8 dB under the groove, and the mid-film whooshes about 16 dB under.
- **Nothing on** clicks, typing, chips, counters or pages landing. Ask before scoring UI events again.
- **`swoosh`** (tools/sfx.py) is a synthesized stereo pass-by.
  - A noise band sweeps up from `f0` to `f1` into its accent (at `rise` of its length, placed on the beat) and falls to `f2`, over a low body (`body`).
  - It crosses the field from `pan0` to `pan1`, fastest at the accent.
  - Give each cue its own `seed`, so no two sound alike.
- **The `-dsm` hits** are the CC0 "cinematic" pack's `start` and `wake` (romainsimon/uisfx), re-tuned to the track's key (D# minor) by +1 and −1 semitone with rubberband. With another track, re-tune the originals to its key the same way (ffmpeg's `asetrate=48000*2^(n/12),aresample=48000` also works but changes their length), and record the change in `fit/CREDITS.md`.
- **Recorded whooshes found so far were no use:** OpenGameArt's CC0 "Swishes" are sword swings, and its longer whooshes are CC-BY.

```json
"sfx": [
  {"type": "swoosh", "beat": 8, "gain": -3, "seed": 81, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-start-dsm.wav", "beat": 8, "gain": -4},
  {"type": "swoosh", "beat": 32, "gain": -6, "seed": 84, "f1": 3000, "body": 0.6, "pan0": 0.3, "pan1": -0.3},
  {"type": "swoosh", "beat": 48, "gain": -2, "seed": 87, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-wake-dsm.wav", "beat": 48, "gain": -2}
],
"sfx_level": -23
```

## The mix

| Stem | Level | Notes |
|---|---|---|
| Music | −16 LUFS without a voice, −20 with one | ducked by up to 8 dB under a voice |
| Effects | `sfx_level` (−23 in the main theme; the house default is −25) | ducked a little under a voice |
| Voice (optional) | −16 LUFS | 80 Hz high-pass, peaks limited to 12 dB over its level |
| Master | −14 LUFS, −2 dBTP (`true_peak` −3 for the funk track) | one linear gain, then an oversampled limiter |

- **Check it** on the report the build prints: each stem's level and target, the effects count, and the peak-to-loudness ratio. Above 15 dB the master gets limited hard, so lower the loudest cue's `gain`.
- **QA measures the MP4:** `audio -14.0 LUFS, true peak -2.1 dBTP OK`. It fails outside −14 ± 1.5 LUFS or above −1 dBTP.
- **After an audio-only change** (a cue, a gain, the edit's fade), run `ONLY=audio ./build_demo.sh <slug> 16x9`. It re-mixes, re-muxes and re-checks on the frames already rendered.
- **Nothing hums or hisses** under the mix: the bed is the track alone.

## A voice, only when asked

Neither approved film has a voice; the lines carry the story. If the client asks for one:

```json
"vo": {"voice": 6, "lines": [{"id": "vo1", "text": "Your company's data is everywhere.", "beat": 1, "max": 2.6}]}
```

- **The voice:** Kokoro "Michael" (voice 6), the English voice the client chose after rejecting robotic ones.
  - It needs `pip install sherpa-onnx` and the `kokoro-en-v0_19/` model folder in the repo root (the download line is in `tools/make_vo.py`).
  - The folder is gitignored; never commit it.
  - There is no approved Arabic voice.
- **Timing:**
  - A line's first syllable lands on its `beat`. A take longer than `max` is re-spoken up to 1.15× faster; past that, cut words.
  - About 2.5 words a second.
  - Keep the hit free for the end's sound, and speak the call to action after it.
- **Checking:** `python3 tools/film_audio.py <slug>` speaks and times the lines and flags any over `max`, overlapping the next, or running past the end.
