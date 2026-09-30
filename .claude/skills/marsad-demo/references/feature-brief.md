# The feature brief: from a feature to a storyboard

The client's plan: "i will give you feature of my saas and you make a walkthrough to explain the feature i will
provide you with the whole front end later but for now we can use the existing data and i will provide you later
with what does the feature do to explain it right".

So each walkthrough starts from a feature brief. Until the front end arrives, the site kit's pages and data stand in.

## What to ask

Ask in one short round, and skip what the client already gave:

1. **The feature's name**, in English and as the app shows it in Arabic.
2. **What it does, in one sentence, and why it matters.** This becomes the benefit line.
3. **Who uses it, and when.** This is the situation the video opens on: the page the user starts from.
4. **The steps.** Each click, typed value or choice, in order, and what appears after each. What appears is what
   the camera shows.
5. **The screens:** the front end for each step (see below).
6. **The outcome.** What's different at the end: a record, a number, a message, a sent report.
7. **Limits.** Anything not live yet, and any claim to avoid.
8. **Length.** 30 s (2–3 steps) or 44 s (4–5 steps). The default is 44 s.

If the client only names a feature, infer the steps from the site kit and the user manual (`site_kit.js`, DEMOS.md
§6.1). Show the storyboard before building, and mark every step you inferred.

## The front end

**Existing pages:** the site kit's ten pages (DEMOS.md §6.1). Use them as they are, with their own text and data.

**New pages**, best to worst:

1. **HTML and CSS.** Use the page's own markup, or the React build exported as static HTML. Rebuild it as a custom
   page, `M.definePage('<key>', {html, w: 1896, h: 1060})`, in `demos/<slug>/pages.js`.
   - Use site-kit pieces where they match: `SK.chrome(tab)`, `SK.sidebar`, `SK.pill`, `SK.ic`, and the `.sk-*`
     classes.
   - Text stays sharp at any zoom, and the engine can click, type and count on it.
   - Give the elements the camera visits ids.
   - Keep the app's exact Arabic text.
2. **Screenshots, 3× or at least 2×.** A 1896×1060 page needs a 5688×3180 capture. Use
   `M.definePage('<key>', {img: 'demos/<slug>/shots/x.png', w: 1896, h: 1060})`. The camera reaches about
   2.9 screen px per page px at z 4, so a 1× screenshot blurs. The engine can't change a screenshot's text, so
   state changes need a second screenshot (a page change) or an injected element (`app.inject`).
3. **Until the front end arrives:** the site kit's existing pages and data. Say so in the delivery ("this uses the
   existing pages; I'll swap in the new screens when they arrive").

For each step, list the elements the camera visits. Measure them with `node tools/rects.js <slug> …` after
`python3 tools/make_demo.py <slug>`. The demo must open the page, either as `M.walk`'s `page` or with `app.page`,
for its elements to be measurable.

## From brief to storyboard

- **Step 1** starts where the user starts. A click into the feature (a tab, a menu item) shows where it lives.
- **One step per action that matters.** Merge trivial ones: typing a name and pressing Next is one step.
- **Each step** has:
  - a line;
  - a dive onto the thing;
  - the action on a beat;
  - the result on screen for about 2 s;
  - a pull-back when the next thing is far away.
- **The key action** (the approve, the send, the generate) goes on the strong beat: k40 on the 44 s map. The part
  that proves it floats out.
- **The last step** shows the outcome. Then the kit's exit, the benefit line and the end.

**Worked example.** The brief for the reference (`demos/decisions-walk`):

| Brief item | Answer |
|---|---|
| name | Decisions / القرارات |
| does | AI recommendations built on the workspace's data, which a manager approves or rejects; an approved one is executed |
| who, when | a manager, from the Business Pulse page |
| steps | open Decisions → read the recommendation → check its confidence and source → approve it |
| outcome | «تم تنفيذ الإجراء» (a supply request, #PO-2291); approved 0 → 1, under review 6 → 5 |
| benefit | From recommendation to action. / من التوصية إلى التنفيذ. |
| length | 44 s, 5 steps (the outcome is its own step) |

`method.md` §8 has the storyboard it became.
