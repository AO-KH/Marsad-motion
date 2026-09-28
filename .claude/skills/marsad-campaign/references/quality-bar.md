# The quality bar for campaign films

A film is ready when every point below holds. Check it on the stills from `tools/stills.py` (every scene's start, action, result and hold), then on the QA contact sheet and in the mix report of the final build.

## Checklist

**Story**
- [ ] It follows the client's storyboard or brief. Anything added is there because it serves that story.
- [ ] Each scene has one job (hook, friction, turn, proof, trust, CTA) that you can name.
- [ ] The story reads with the sound off: the captions alone carry it.
- [ ] Key moments hold 0.5–1 s longer than feels necessary: the reveal, each product result, the end card.

**Look**
- [ ] Light UI, a soft purple glow, glass tiles, chips and icons (`m-glass` with the `.gk` base); app pages in their own styling.
- [ ] The sources are the famous ones (`K.TILES`), and they end connected to Marsad.
- [ ] The logo is big. Nothing round sits behind it: no orb, circle or disc. Its reveal builds on the beats and never feels static.
- [ ] No section labels ("THE PROBLEM", "HOW IT WORKS").
- [ ] Product text on screen is the app's real text. Anything invented is listed for the delivery message.
- [ ] Western digits in captions and overlays. Inside app pages, the page's own digits.

**Motion**
- [ ] No shake, whip, spin, wiggle, bobbing, or camera jump on the beat. Punches (`M.punch`) at 2% or less, on 2–4 big beats only.
- [ ] Entrances take 0.6–1.0 s on `M.ez.dec`; glides take 1–1.5 s. Nothing pops. The logo overshoots 4% at most.
- [ ] No hard cuts: scenes glide, cross-fade, or hand over through a carrier element.
- [ ] Every entrance and hit lands on a beat or an 8th, and nothing repeats on every beat.
- [ ] QA prints `RESULT PASS` (pulse ≤ 1.15, shake 0), and the contact sheet looks like the stills.

**App window scenes** (the marsad-demo skill's framing rules apply)
- [ ] `node tools/cutcheck.js <slug> 16x9` prints `clean`: no hold where the window's edge slices text.
- [ ] The cursor lands beside or under a label, never on it. Callouts sit clear of titles, buttons and numbers.

**Text**
- [ ] Every caption has English and a natural Arabic line. They never overlap each other or content.
- [ ] Captions end at least 0.5 s before the next one starts.
- [ ] The end card is "Book your demo · احجز عرضك التجريبي" and marsadnasl.com (the `M.endcard` defaults), unless the brief says otherwise.

**Sound**
- [ ] `tools/film_audio.py <slug>` flags nothing: no line over its `max`, none overlapping the next, none running past the end.
- [ ] Each voice line starts on a beat or an 8th, and the drop is left to the logo's sound.
- [ ] About 10–20 effects for 30 s, each on a visual event's beat. No hum, hiss or stray noise.
- [ ] QA's `audio` line: about −14 LUFS and a true peak of −1 dBTP or lower, on the MP4.

**Delivery**
- [ ] Rendered with motion blur (the default `SUB=4`), and the MP4 is under 30 MB.
- [ ] The message lists what was invented and what the client still has to settle.

## Defects we have hit, and the fixes

| Symptom | Cause | Fix |
|---|---|---|
| A glowing orb or ball sits behind the logo, or at a scene's core | The storyboard's "carrier orb" taken literally | Remove it. The carrier is the mark's glow or the sources themselves (client: "the circle behind the app should be removed", "remove the orb") |
| "THE PROBLEM" / "HOW IT WORKS" labels over scenes | Kickers added to make a no-voice cut explain itself | Delete them; the captions carry the story (client: "delete this", "also remove the problem") |
| The logo reveal "looks static" | The mark just faded in, off the beat | Charge it up: sources absorbed one per 16th, a glow gathering, the mark easing in on a beat, one soft punch |
| Things throb on every beat | Beat-locked loops (glow breathing, node kicks, flashes) | Remove every per-beat loop. Keep one-off hits and slow continuous motion (a lap per bar or longer) |
| Icons shake; the camera jolts on the beat | A shake at the impact; transitions that flip position, zoom or rotation on the beat (the 63 s film's `TR`) | No shake. `M.punch` swells in and settles, capped at 2%. Glides and cross-fades instead of jumps |
| "Slower" was taken to mean a longer film | Assuming the length can change | The client chose the same length with calmer motion: longer entrances, fewer moves |
| Captions overlap each other or a scene's text | Two captions on screen at once, or a caption over content | One caption at a time, each ending 0.5 s before the next. Keep content clear of the caption band (16:9: y 900–1040) |
| The pill renders as three boxes | A style for `span` matched spans nested inside the pill | Scope styles to the element's own class |
| Glass flickers or doubles its glow while fading | Chromium's backdrop filter changes during fades | Keep the `.gk` base layer (`M.GLASS` adds it) |
| The voice sounds robotic | A default TTS voice | Kokoro "Michael" (voice 6), the voice the client chose |
| A hiss or hum under the mix | Synthesized noise layers left in the bed | Remove them; the bed is the client's track only |
| The effects are too loud, or crowd the picture | One effect per event, at the foreground level | 10–20 hits per 30 s at −25 LUFS, ducked under the voice |
| The end chord stops dead | `bloom()`'s chord envelope was commented out in `audio_stems.py` | `tools/sfx.py`'s `bloom` fades it; use that one |
| A stale call to action | Copied from the 63 s film | "Book your demo · احجز عرضك التجريبي" and marsadnasl.com (`M.endcard` defaults) |
| Arabic-Indic digits in an overlay next to Western digits in the UI | Copied from the 63 s or 54 s film's mock UI | Western digits in captions and overlays |
| A number looks doubled (a ghost behind it) | Motion blur averaged sub-frames with different values | Step discrete values on `Math.round(t*30)/30` |
| Two voice lines run into each other | A take was longer than its slot | `tools/film_audio.py` flags it: move the next beat later, or cut words |
| The drop lands in the middle of a scene | The film's `start` in the track was picked by feel | Pick `start` from the music map so the drop is the end card (see the anatomy's beat maps) |
| Everything lands a bar late | `start` rounded (28.13 instead of 28.129), so the phase wrapped almost a full bar | Give `start` to the millisecond; `tools/make_demo.py` now warns |
| The MP4's true peak is over −1 dBTP although the WAV was at the limit | The voice's consonant peaks forced heavy limiting, and AAC adds up to 0.6 dB | The mix limits the voice's peaks, and the master goes to −2 dBTP; QA checks the MP4 |
| A mark flying onto the app lands in the wrong place, or vanishes | Hand-computed window positions, or measuring the page while the window is still hidden | `app.toStage(target, t)`: it includes the view and the window's entrance, and measures a hidden window |
| The reveal's hold is cut, or the mark crosses the page | The app window came in too soon after the reveal | Give the turn 8 beats in a 30 s film (the anatomy's map) |
| `beats.py`'s bar numbers don't match the song | It numbers bars from its own downbeat guess | `--downbeat <confirmed>` |
| Two scenes show through each other for half a second | A scene fading out while the app window fades in, or the window leaving while the next card rises | Clear one before the next enters: use the music's one-beat stop or the beat before a section, and let one small carrier cross the gap (coffee-story-45's in-app alert flying into the bell) |
| A status pill covers a card's title | A pill placed inside a crowded card header | Put it on the card's edge as a badge, or in a row of its own. Check a still of every state (before and after the change) |
