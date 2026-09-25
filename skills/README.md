# Claude skills

| Skill | What it does |
|---|---|
| `marsad-demo` | Makes and changes Marsad product videos: short feature demos and step-by-step walkthroughs of the app, in 16:9 and 9:16, with music and bilingual captions. It is the baseline for all demo work. |

The source is `.claude/skills/<name>/`, and Claude Code loads it automatically when you work in this repo. The files
here are installable copies of it, for your Claude account, so it applies in any chat:

- **`<name>.skill`:** when a Claude chat sends you this file, its card has a **Save skill** button.
- **`<name>.zip`:** upload it in claude.ai under **Settings → Capabilities → Skills → Upload skill**.

Both are the same zip, built from the source by `python3 tools/package_skill.py`. After changing a skill, run that
script and commit `skills/` with the change, so the copies never drift from the source.
