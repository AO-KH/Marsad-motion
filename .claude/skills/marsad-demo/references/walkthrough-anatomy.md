# Anatomy of the reference walkthrough

`demos/decisions-walkthrough/` ("Approve a recommendation") runs 60 s in both formats on `fit/product-video.mp3`
(88 BPM, first downbeat 0.016 s, so `B(k)` = 0.016 + 0.682·k s). Copy its shape for any walkthrough. Change the
steps, keep the rhythm.

## Beat map

| Beats | Time (s) | On screen | Caption EN / AR |
|---|---|---|---|
| B0.5–6.5 | 0.4–4.4 | Title card: gavel icon, kicker WALKTHROUGH · شرح خطوة بخطوة | Approve a recommendation / اعتماد توصية |
| B7 | 4.8 | The app window glides in on the Business Pulse page; the steps rail fades in at B8 | — |
| B8–19.5 | 5.5–13.3 | **1**: focus on the Decisions tab (16:9 1.5, 9:16 1.45). Click B11 with the pointer under the label. The page changes B11.25, and the view glides out to the whole page as it fades in (B11.5, 1.4 s) | Open Decisions / افتح صفحة القرارات |
| B20–31.5 | 13.6–21.5 | **2**: focus the recommendation card. 16:9 shows the whole card at 0.95 with the page title; 9:16 shows its right half at 1.08 with the tab row. Click B23, highlight B23–30.5, cursor out B25 | Pick a recommendation / اختر توصية |
| B32–43.5 | 21.8–29.7 | **3**: callout on the confidence pill B33 (below-left, clear of the title and buttons). 9:16 pans to the source pill B36. Callout on the source B37–42 | Check the confidence and source / راجع درجة الثقة والمصدر |
| B44–55.5 | 30.0–37.9 | **4**: focus the approve button and the space the confirmation will fill (16:9 1.01, 9:16 1.1). Click B47, the confirmation shows B47.25, cursor out B49 | Approve it / اعتمد التوصية |
| B56–67.5 | 38.2–46.0 | **5**: focus the two counters, with the confirmation still in view. B58: approved 0→1, in review 6→5, and the filter tabs update. Highlight the approved card B59–66 | It is recorded right away / يُسجَّل القرار فوراً |
| B68–78 | 46.4–53.2 | Outro: glide back to the whole page | From recommendation to action, in seconds. / من التوصية إلى التنفيذ في ثوانٍ. |
| B79–80 | 53.9–54.6 | The window leaves; the end card starts | — |
| B80–88 | 54.6–60.0 | End card: logo, tagline, marsadnasl.com, Book your demo · احجز عرضك التجريبي | — |

## Why it is built this way

- **12 beats per step (3 bars, 8.2 s).** One idea is enough time to read the caption, see the action and see its
  result, at the calm pace the client asked for. Shorter steps felt rushed; longer ones sat idle.
- **A fixed rhythm inside a step:**
  - +0: the caption and the focus glide (1.2 s), so the viewer knows what to look at before anything moves.
  - +3: the action (click, type, toggle), on a beat.
  - +3.25: the result appears, soon enough to read as cause and effect.
  - +5: the cursor leaves, so it doesn't clutter the result.
  - To +10.5: a highlight or callout holds the result.
  - +11.5: the caption ends, 0.5 s before the next step, because its fade takes 0.5 s.
- **Steps start on k8, k20, k32, k44 and k56.** The track's phrases start on k4, k20, k36 and k52, so the steps
  sit on or near a phrase and never fight it. The track's stop on k70–71 falls inside the outro. Its quiet
  breakdown (k72–87) carries the outro and the end card. The video ends on k88, just before the next build.
- **One app window for the whole video.** Pages cross-fade inside it (`app.page`), and the tab underline slides,
  so there are no cuts.
- **Every hold is framed so the window's edge slices no text.** `tools/cutcheck.js` suggested the view centres,
  and `at(x, y)` in the script is a zero-size target at that centre. The page title, tab row and confirmation are
  whole in both formats. The only notes left are long body lines running off the side in 9:16, which is fine.
- **Formats differ only in framing**, through `v(a16x9, a9x16)` = `M.pick`:
  - 16:9 has room for a whole card, and its text is readable at 0.95.
  - In 9:16 the card is wider than the frame, so the video shows its right half at 1.08 (Arabic reads from the
    right), then pans to the source pill on the left for step 3 (`focus(at(520, 617), {scale:1.13})`).
  - The confidence callout ends earlier in 9:16 (B35.5), before that pan, so it never points off-screen.
- **The cursor never hides a label.** On the tab it clicks at `{ax:0.2, ay:0.95}`, the tip just under the
  word's start.
- **The cursor leaves on +5 when the result needs the space.** In step 1 it stays parked on the tab, since the
  tab stays in view; it fades by itself if a view move carries it out of the window.
- **The callout never hides content.** The confidence callout uses `side:'bottom', gap:20` and `dx` −340 (16:9)
  or −360 (9:16). That puts the box left of the approve/reject buttons, under the pills, and away from the title.
- **Numbers change on a beat, and text swaps with a soft dip.** `app.count` and `app.text` are frame-stepped, so
  motion blur never ghosts them.

## Reusing it

1. `cp -r demos/decisions-walkthrough demos/<slug>`, then set `title` and `duration` in `demo.json`.
   Duration = (end-card beat + 8) beats. With `product-video.mp3`, end cards on these beats sit well in the music:

   | Steps | Steps run | Outro | End card | Length |
   |---|---|---|---|---|
   | 3 | k8–43.5 | k44–51 | k52 (a phrase start) | 60 beats, 40.9 s |
   | 4 | k8–55.5 | k56–67 | k68 (a phrase start; the track's short stop at k70–71 falls inside the end card) | 76 beats, 51.8 s |
   | 5 | k8–67.5 | k68–78 (the stop falls in the outro) | k80 (quiet breakdown) | 88 beats, 60 s |
   | 6+ | k8 onwards | 8–12 beats | on a phrase start (k100 is the drop after the build) | `"loop": [100, 164]` if the video outruns the track (DEMOS.md §7) |

2. Replace the title, the `M.steps` list and each step's block. Keep every step at 12 beats unless one really
   needs two actions; then give that step 16.
3. Check stills at each step's +0, +3, +5 and +9 in both formats (`tools/stills.py … --beats`). Then run
   `node tools/cutcheck.js <slug>` until both formats are clean, and build.

**Variants inside a step:**
- **Typing:** click the field on +3 and `type` from +4. The field lights up 0.5 s before the first letter, so
  typing can't start with the click. Show the results from +5, one row per 8th note. Put the ring on the results
  from +7 to +10.5. `demos/search-walkthrough/` does this.
- **A page change:** click on +3, `page` on +3.25, and glide out on +3.5 (1.4 s) so the new page is whole as it
  lands.

A short demo (see `demos/pulse-short/`) has the same parts without the rail:
- a title (B0.5–6.5);
- the app from B7;
- 2–4 `M.caption` ideas of 2–3 bars, each with a focus, an action and a highlight or callout;
- the end card on a phrase start (B36 at 88 BPM for 30 s).
