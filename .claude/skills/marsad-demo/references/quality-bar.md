# The quality bar

A demo is ready when every point below holds in **both** formats. Check it on the stills from `tools/stills.py`
(every step's start, action, result and hold), then on the QA contact sheet of the final render.

## Checklist, per still

**Subject and framing**
- [ ] What the caption talks about is in frame, near the centre, and readable. In 9:16, UI text that matters
      should look at least as big as the Arabic caption line; if it doesn't, zoom in (focus scale ≥ 1.0) and pan.
- [ ] Nothing important is cut by the window edge: page titles, the card being discussed, the button being
      clicked. Arabic pages read from the right, so keep the right side.
- [ ] 9:16: no key text in the platform bands (top ~220 px, bottom ~320 px). The engine's layout already respects
      this, so only custom overlays can break it.

**Cursor and clicks**
- [ ] The cursor tip lands beside or under the label it clicks, never on the word (`{ax, ay}`).
- [ ] The cursor arrives in the second before the click and leaves after the result (`cursorOut`); it never
      parks over the result.

**Callouts and highlights**
- [ ] Every callout box sits clear of titles, buttons and numbers. Move it with `side`, `gap`, `dx`/`dy`.
- [ ] Every callout points at its target the whole time it is visible, and ends before the view moves on.
- [ ] At most two callouts per step. A highlight ring hugs its element (`pad` 8–12).

**Text**
- [ ] Every caption, step, title and callout has English and Arabic, both natural.
- [ ] Western digits in captions, callouts and the rail («ثقة 80%», «الخطوة 3 من 5»).
- [ ] No caption is clipped, and no line is left with one word (9:16 captions balance their lines).
- [ ] No two captions overlap: each ends at least 0.5 s before the next starts.
- [ ] Product text on screen is the app's real text. Nothing is invented.

**Motion (on the render, not the stills)**
- [ ] Glides are smooth and 1–1.5 s long; entrances ease out over 0.6–1.0 s; nothing pops, bounces or shakes.
- [ ] Every action lands on a beat or an 8th; nothing repeats on every beat.
- [ ] QA prints `RESULT PASS` (pulse ≤ 1.15, shake 0), and the contact sheet looks like the stills.
- [ ] The final render has motion blur (the default `SUB=4`). A `SUB=1` draft is never delivered.

## Defects we have hit, and the fixes

| Symptom | Cause | Fix |
|---|---|---|
| The clicked tab's name is hidden under the cursor | The click aimed at the element's centre | `app.click(t, target, {ax:0.2, ay:0.95})`: the tip lands under the start of the label |
| A callout box covers the card title | `side:'top'` on a pill that sits under the title | `side:'bottom', gap:20, dx:-340`: below and to the left, clear of the buttons |
| 9:16 text too small to read | Focusing a wide card with the default `fill` shrinks it to fit a 1000 px window | Give 9:16 its own `scale` (≥ 1.0) and `dx` toward the part that matters; pan to the rest |
| 9:16 close-up shows unrelated rows | The view is centred on a small target near the top of the page | Add `dy` to centre on the card. The view can't pass the page's bottom edge, so accept some context above |
| Arabic digits don't match the app (٨٠٪ next to 80%) | Arabic-Indic digits in a caption or callout | Western digits in captions and callouts; the rail does this itself |
| A caption leaves one word alone on its second line (9:16) | Plain wrapping | The engine balances 9:16 caption lines (`text-wrap: balance`); keep captions short anyway |
| Two captions on screen at once | A caption's 0.5 s fade overlapped the next | End each caption ≥ 0.5 s before the next (`out: next - 0.5`; `M.steps` does this) |
| A callout pointing at nothing | The view moved while the callout was up | End the callout before the focus that moves away. Callouts also fade by themselves off-window |
| Numbers look doubled (a ghost 39 behind 38) | Motion blur averaged sub-frames with different values | `app.count`, `app.text`, `app.type` and `app.toggle` step once per frame. Custom `M.track` text should use `Math.round(t*30)/30` |
| Glass icons flicker or double their glow | Chromium backdrop-root changes during fades | Keep the `.gk` base layer (`M.GLASS(...)` adds it); don't strip it |
| A title's Arabic line is invisible | A child selector matched a nested element | Style engine parts with `:scope>`-level selectors and `m-` prefixed classes |
| A pill renders as three boxes | A `span` rule matched spans nested inside the pill | Scope styles to the pill's own class, not `span` |
| Shake flagged by QA | Something moved back and forth (bobbing, overshoot, a wiggle) | Remove it. Demos have no shake; the engine has no shake effect |
| Pulse flagged by QA | Something changes on every beat | Keep one-off events on beats; nothing repeats per beat |
| The music's grid is off by a beat | The wrong downbeat candidate | `tools/beats.py` prints four; section changes start on the real one. Check by ear |
