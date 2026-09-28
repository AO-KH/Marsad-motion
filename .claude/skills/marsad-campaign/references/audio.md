# Music, voiceover, sound effects and the mix

`film.json` holds a film's audio next to its picture. `./build_demo.sh <slug>` builds it:
1. `tools/music_fit.py` fits the music.
2. `tools/film_audio.py` adds the voiceover and the effects.
3. The whole mix is normalised to −14 LUFS / −1.5 dBTP.

## Music

```json
"music": {"file": "fit/stylish.mp3", "bpm": 93.99, "downbeat": 0.041, "start": 28.129, "fade_out": 2.5}
```

- **Which track:** the client's track, or one they approved. For paid ads, get the licence. The launch film's track is `fit/stylish.mp3` (SoundSurfer "Stylish"). `fit/product-video.mp3` is the demos' track.
- **A new track:** run `python3 tools/beats.py <file>` first. It prints the tempo, four downbeat candidates and a loudness bar per bar.
  - Sections start on a downbeat, so confirm the downbeat against a section change before trusting it.
  - Then run `--downbeat <s> --beats A-B`. The map is numbered from your downbeat, not its guess, and prints beat by beat: one-beat stops, drops and hits show up there.
- **Fields:**
  - `start` is a downbeat, so beat 0 of the film is a downbeat and `M.B(k)` lines up with the music.
    - Give it to the millisecond: `tools/make_demo.py` warns when a rounded value slips the grid by a bar.
    - A film that starts mid-song can take `"fade_in": 0.3` to soften the first frame. Starting mid-groove, at full level, also works as a hook.
  - `fade_out` is in seconds, at the end.
  - `loop: [a, b]` repeats beats a..b if the film outruns the track (DEMOS.md §7).
- **No time-stretch, ever:** the client asked for the track as it is. To fit a length, choose `start` and the film's scene lengths instead.

**Stylish, section by section** (beat k at `0.041 + 0.638366·k` s):

| Song beats | Time (s) | Section | Good for |
|---|---|---|---|
| k0–3 | 0.0–2.6 | near silence | a cold open, the first source tiles |
| k4–7 | 2.6–5.1 | build | the problem building up |
| k8–71 | 5.1–45.4 | groove | friction, the reveal, the promise, the proofs |
| k55, k95 | 35.2, 60.7 | a one-beat stop, the last beat of a bar | a hit right after it: the reveal on the next bar line (k12 in the 30 s map) |
| k72–78 | 46.0–50.0 | breakdown, quietest | one close moment: a click, a question, a typed Arabic prompt |
| k79–80 | 50.5–51.1 | the lift | anticipation (a `riser` ending on k81) |
| k81 | 51.7 | the drop, on beat 2 of its bar | the logo and the end card (`bloom`) |
| k82–112 | 52.4–71.5 | full, then fading | the end card's hold |

The anatomy turns this into start points for 30, 45 and 60 s films.

## Voiceover

```json
"vo": {"voice": 6, "lines": [
  {"id": "vo1", "text": "Your company's data is everywhere.", "beat": 1, "max": 2.6},
  {"id": "vo5", "text": "Marsad. Book your demo at marsad nasl dot com.", "beat": 38.5, "max": 3.6}]}
```

- **The voice:** voice 6 is Kokoro "Michael", the English voice the client chose after rejecting robotic ones. Don't change it without asking. There is no approved Arabic voice.
  - Its takes have sharp consonant peaks, about 20 dB over its loudness. The mix limits them to 12 dB, transparently. Without that, the master was squashed and missed the true-peak bar after AAC.
- **Timing:**
  - Each line's first syllable lands on its `beat` (or at `at` seconds).
  - A take longer than `max` is spoken again, faster, up to 3 times and never beyond 1.15×. Past that it sounds rushed, so cut words or give the line more beats.
  - `speed` sets a starting pace, and `gain` (dB) nudges one line.
- **Writing for the voice:**
  - About 2.5 words per second at speed 1.0, so a 2.5 s slot holds 5–7 words.
  - One line per scene, and it can be shorter than the caption. The caption carries the Arabic and the detail.
  - Spell out URLs and odd words the way they are said: "marsad nasl dot com", "P D P L".
  - Leave at least one beat between lines, and keep the drop free for the logo's sound: speak the last line after it.
- **Checking:** `python3 tools/film_audio.py <slug>` speaks the lines (cached in `out/<slug>-vo/`, re-spoken only when a line changes; older takes are removed). It prints each line's start and end, and flags:
  - `OVER max`: the line is still too long. Cut words, or give it more beats.
  - `OVERLAPS the next line`: move the next line later, or this one earlier.
  - `RUNS PAST the end`: move it earlier, or lengthen the film.
- **Captions:** they must still tell the whole story, because many viewers watch muted.

## Sound effects

```json
"sfx": [{"type": "whoosh", "beat": 8}, {"type": "absorb", "beats": [9, 9.25, 9.5, 9.75]},
        {"type": "thump", "beat": 11}, {"type": "click", "beat": 31}, {"type": "chime", "beat": 31.25},
        {"type": "riser", "beat": 37}, {"type": "bloom", "beat": 37}]
```

Each cue's accent lands on its beat: a whoosh peaks there, and a riser ends there. `gain` is in dB; `pan` runs from −1 to 1. `tools/sfx.py` builds them all from the launch film's sound design, seeded, so every build sounds the same.

| Type | Use it for |
|---|---|
| `whoosh` | an element or the window gliding into a new scene (not every move) |
| `whoosh_rev` | a swell into a reveal |
| `absorb` | sources flying into the mark, one per 16th (`beats`; the pitch rises through the list) |
| `tick` / `key` | counts and typing (quiet; `gain` −6) |
| `pop` / `blip` | a chip or a pill appearing |
| `click` | the cursor pressing a button, on the click's beat |
| `chime` | a success: an approval, a toast (a quarter beat after the click) |
| `thump` | a landing: the mark settling |
| `riser` | the lift into a drop (it ends on the drop) |
| `swell` | a soft change of scene |
| `bloom` | the logo on the drop: a low boom, a shimmer and a D minor chord that now fades out properly |

**Restraint:** the client twice asked for fewer and quieter effects. A 30 s film needs about 10–20 hits. Don't score every tile. Nothing hums or hisses under the mix.

## The mix

`tools/film_audio.py` sets the levels, and `tools/music_fit.py` normalises the result:

| Stem | Level | Notes |
|---|---|---|
| Voiceover | −16 LUFS | 80 Hz high-pass, 8 ms fades, trimmed to the first syllable, peaks limited to 12 dB over its level |
| Music | −20 LUFS with a voiceover, −16 without | ducked by up to 8 dB while the voice speaks (80 ms attack, 350 ms release) |
| Effects | −25 LUFS | ducked a little under the voice |
| Master | −14 LUFS integrated, −2 dBTP | two-pass `loudnorm`, the same for demos. AAC adds up to about 0.6 dB, so the MP4 stays under −1 dBTP |

**To check it:** read the report the build prints.
- Each voice line's times, and the effects count.
- `levels`: each stem's measured loudness and its target, and the mix's peak-to-loudness ratio. Above 15 dB, the master gets limited by more than 3 dB; lower the loudest cue's `gain`.

QA measures the MP4 itself: `audio -14.1 LUFS, true peak -1.8 dBTP OK`. It fails outside −14 ± 1.5 LUFS or above −1 dBTP.

After an audio-only change (a line, a cue, a gain), `ONLY=audio ./build_demo.sh <slug>` re-mixes, re-muxes and re-checks on the frames already rendered, in about 1.5 min.

If the voice sounds buried or the effects stick out, adjust a line's or a cue's `gain` rather than the house levels. If the whole balance is wrong for a track, change `LEVEL` in `tools/film_audio.py` and say so in the commit.
