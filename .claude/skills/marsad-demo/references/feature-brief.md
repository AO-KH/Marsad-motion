# The feature brief: from a feature to a storyboard

The client's plan: "i will give you feature of my saas and you make a walkthrough to explain the feature i will
provide you with the whole front end later but for now we can use the existing data and i will provide you later
with what does the feature do to explain it right".

So each walkthrough starts from a feature brief. The front end arrived on 2026-09-30 ("this is marsad front end"), so
the screens are the real app's, captured with sample data (below).

## Start from the feature catalogue

The product team's catalogue (`feature-catalogue.md`, the client's baseline since 2026-10-01) gives each feature:

- its status: live, switched off or coming. Film only live ones; for the others, say so and stop;
- its Arabic name;
- what it does;
- an **On screen** line: the real steps with the app's own labels in «». This is usually the walkthrough's steps;
- a note with its limits (for example "2D", "admins only", "rehearse in production first").

Read the feature's entry first. Then ask only for what it leaves open.

## What to ask

Ask in one short round, and skip what the client already gave:

1. **The feature's name**, in English and as the app shows it in Arabic.
2. **What it does, in one sentence, and why it matters.** This becomes the benefit line.
3. **Who uses it, and when.** This is the situation the video opens on: the page the user starts from.
4. **The steps.** Each click, typed value or choice, in order, and what appears after each. What appears is what
   the camera shows.
5. **The screens:** the front end for each step (see below).
6. **The outcome.** What's different at the end: a record, a number, a message, a sent report.
7. **Limits.** Anything not live yet, and any claim to avoid (the catalogue's note and its words to avoid).
8. **Length.** 51 s on the launch map, 4–5 steps.

If the client only names a feature, infer the steps from the front end itself: its pages (`apps/web/src/app/…`), the
feature's library (`libs/web/<feature>/`), and the labels and states in its code; the navigation is in
`libs/web/admin/src/pages/dashboard/navConfig.ts`. Show the storyboard before building, and mark every step you
inferred.

## The front end: capturing the real screens

The client's front end is their Nx monorepo (the Next.js app in `apps/web`, the features in `libs/web/*`). It is not
in the repo: unzip the client's zip anywhere and `npm ci` once. `tools/app_snap.js` runs it with no backend (a demo
user signed in, every API call answered from sample data, the fonts served locally), drives it through the states
the walkthrough needs, and freezes each state into static HTML + CSS (DEMOS.md §6.0 has the details).

**Find what the feature's pages ask for.** Open the feature's page in its library (for Decisions:
`libs/web/decisions/src/pages/DecisionsPage.tsx`): the `api.get` / `api.post` calls give the paths and the shapes
(`{decisions: [...]}`, `{totalByStatus: [...]}`), and the labels, chips and messages it renders. The API answers raw
JSON, with no envelope. Run the capture once with no routes: every call it had no data for prints as `NEW`.

**Write `app/capture.js`:**
- `routes`: sample data for those calls, plausible and per feature (the reference's are the three recommendations
  of the client's screen recording). Use a function to change state after an action: the approve call sets a flag,
  and the next list call returns the recommendation approved, as the real backend would.
- `states`: one per screen the camera shows, in order. The app does the work: `run` clicks its real buttons and
  fills its real fields, and what it shows next (a dialog, a message that closes itself after 2 s, a refreshed list)
  is what you capture. Capture a state inside the app's own timing (the reference captures «تم بنجاح» within its
  2 s with `wait: 50`).
- `tag`: `data-w` names on everything the camera, the hand or a float visits. Real markup has no ids, and the same
  button repeats on every card.

**Check it:** the tool compares each snapshot with the live app. Look at `build/<slug>-app/<key>.png` (the live
screen) before storyboarding: it shows what the app really does.

**A screen the front end lacks** (not built yet, or behind a service that can't be answered): don't show a feature
that isn't live. If the client asks for it anyway, build it from site-kit pieces in `pages.js`
(`M.definePage('<key>', {html, w, h})`), keep the app's exact Arabic, and list it as invented.

For each step, list the elements the camera visits. Measure them with `node tools/rects.js <slug> …` after
`python3 tools/make_demo.py <slug>`.

## From brief to storyboard

- **Step 1** starts where the user starts. A click into the feature (a tab, a menu item) shows where it lives.
- **One step per action that matters.** Merge trivial ones: typing a name and pressing Next is one step.
- **Each step** has:
  - a line;
  - a dive onto the thing;
  - the action on a beat;
  - the result on screen for about 2 s;
  - a pull-back when the next thing is far away.
- **The key action** (the approve, the send, the generate) gets its own bars: one click per bar, in the bar's
  silence, with the app's answer on the hit. The part that proves it floats out.
- **The last step** shows the outcome. Then the kit's exit, the benefit line and the end.

**Worked example.** The brief for the reference (`demos/decisions-real`):

| Brief item | Answer |
|---|---|
| name | Decisions / القرارات |
| does | AI recommendations built on the workspace's data, which a manager approves (with a reason) or rejects; an approved one's action runs (here an Odoo action) |
| who, when | a manager, from the Home page |
| steps | open Decisions → read the recommendation → check its confidence and source → approve it, with a reason (the app's confirm dialog) |
| outcome | «تم بنجاح»; the card «موافق» and «نُفِّذ الإجراء»; approved 0 → 1, under review 6 → 5 |
| benefit | From recommendation to action. / من التوصية إلى التنفيذ. |
| screens | `home`, `decisions`, `confirm`, `focus`, `done`, `after` (six captured states) |
| length | 51 s, 5 steps (the outcome is its own step) |

`method.md` §8 has the storyboard it became.

It predates the catalogue: its outcome («نُفِّذ الإجراء», the Odoo action running after approval) is switched off
there, so a remake ends on the approved card and its passport instead.

**Worked example from the catalogue** (`demos/ontology-real`). The entries used were the knowledge map explorer
(live), everything about a record on one page (live), AI suggests links and a person confirms (live), and the map of
your data model (live).

| Brief item | Answer |
|---|---|
| name | Knowledge map / الخريطة المعرفية |
| does | Start from any customer and see everything it connects to, confirm the links the AI suggests, and see the whole business as one model |
| who, when | a manager, on البيانات › الخريطة المعرفية |
| steps | from the four entries' On screen lines: search for a customer (the sample «متاجر الواحة») and pick it → double-click one of its invoices to expand it → «فتح الكائن», «الروابط»: the AI's «مقترح» link → ✓ (confirm), «مؤكّد» → «عرض في الخريطة المعرفية» → «مخطط الأنطولوجيا», a type's links |
| outcome | the confirmed link drawn solid on the map; the data model with the invoice type's links lit |
| benefit | the catalogue's safe end line: Your company is a world. Marsad is its map. / شركتك عالم. ومرصد خريطته. |
| screens | `explore`, `search`, `customer`, `invoice`, `inv-page`, `inv-links`, `inv-confirmed`, `inv-map`, `schema`, `schema-inv` (ten states, dark mode) |
| limits | the map is 2D; English type names kept out (every type has its Arabic name); sample data labelled |
| length | 51 s, 5 steps |
