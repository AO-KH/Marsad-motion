# Claude skills

| Skill | What it does |
|---|---|
| `marsad-demo` | Makes and changes Marsad walkthroughs: a video that explains one feature of the app by using it on screen, in Marsad's walkthrough method (Benji Taylor's walkthrough grammar in the main theme). The real app floats in a window on a clean dark stage; a camera dives onto each click, which is heard; one bilingual step line at a time; the part that proves the feature floats out in 3D; the benefit line and the capsule end, on the client's launch track. It covers the feature brief, the walkthrough kit (`demos/kit/walk.js`), a starter, and the product team's feature catalogue (what is live, the filming rules). It is the baseline for walkthrough work. |
| `marsad-campaign` | Makes and changes Marsad campaign films: 30–90 s brand, launch and feature ads in Marsad's main theme, the look of the client's two approved films (the 48 s film and the ontology film): a dark stage with glowing lenses, bilingual type blurring in, the app's pages and parts in 3D, the client's funk track with whooshes on the transitions, and the glowing capsule end. It includes a starter film and the product team's feature catalogue (what Marsad does today, the words to avoid). It is the baseline for campaign work. |

The source is `.claude/skills/<name>/`, and Claude Code loads it automatically when you work in this repo. The files
here are installable copies of it, for your Claude account, so it applies in any chat:

- **`<name>.skill`:** when a Claude chat sends you this file, its card has a **Save skill** button.
- **`<name>.zip`:** upload it in claude.ai under **Settings → Capabilities → Skills → Upload skill**.

Both are the same zip, built from the source by `python3 tools/package_skill.py`. After changing a skill, run that
script and commit `skills/` with the change, so the copies never drift from the source.
