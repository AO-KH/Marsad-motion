"""Package the repo's Claude skills for installing in a Claude account.

usage: python3 tools/package_skill.py               every skill in .claude/skills/
       python3 tools/package_skill.py marsad-demo   one skill

.claude/skills/<name>/ is the source: Claude Code loads it from there when you work in this repo. This writes
skills/<name>.skill and skills/<name>.zip, the same zip twice: a .skill file shows a "Save skill" button when sent in
a Claude chat, and Settings > Capabilities > Skills > Upload skill takes the .zip. The zips are reproducible (fixed
timestamps, sorted entries), so re-packaging an unchanged skill changes nothing. Run this after every change to a
skill and commit skills/ with it.
"""
import os, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '.claude', 'skills')
OUT = os.path.join(ROOT, 'skills')
SKIP = {'__pycache__', '.DS_Store', 'evals'}


def package(name):
    base = os.path.join(SRC, name)
    if not os.path.isfile(os.path.join(base, 'SKILL.md')):
        sys.exit(f'no skill at .claude/skills/{name} (SKILL.md missing)')
    files = []
    for d, dirs, fs in os.walk(base):
        dirs[:] = sorted(x for x in dirs if x not in SKIP)
        files += [os.path.join(d, f) for f in sorted(fs) if f not in SKIP and not f.endswith('.pyc')]
    os.makedirs(OUT, exist_ok=True)
    for ext in ('.skill', '.zip'):
        path = os.path.join(OUT, name + ext)
        with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
            for f in files:
                info = zipfile.ZipInfo(os.path.join(name, os.path.relpath(f, base)).replace(os.sep, '/'), (1980, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                with open(f, 'rb') as fh:
                    z.writestr(info, fh.read())
        print('wrote', os.path.relpath(path, ROOT), f'({len(files)} files)')


def main():
    names = sys.argv[1:] or sorted(n for n in os.listdir(SRC) if os.path.isfile(os.path.join(SRC, n, 'SKILL.md')))
    for n in names:
        package(n)


if __name__ == '__main__':
    main()
