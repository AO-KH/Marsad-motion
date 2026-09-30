"""Subset Material Symbols (a ligature font: an icon's name is its text) to the icons a demo's app screens use, so the
demo carries a small font instead of the 4 MB one. tools/app_snap.js runs it.

usage: python3 tools/subset_icons.py <font.woff2> <out.woff2> <icon> [<icon> ...]
Keeps the letters, digits, '_' and space, and only the named icons' ligatures (no layout closure, so no other icon
comes along). The variable axes (FILL, wght, GRAD, opsz) stay. Needs fonttools and brotli (pip install fonttools brotli)."""
import sys
from fontTools.ttLib import TTFont
from fontTools import subset


def ligatures(font):
    """{text: glyph} for every ligature in the font's GSUB."""
    rev = {g: chr(c) for c, g in font.getBestCmap().items()}
    out = {}
    for lookup in font['GSUB'].table.LookupList.Lookup:
        for st in lookup.SubTable:
            if st.LookupType == 7:
                st = st.ExtSubTable
            if getattr(st, 'LookupType', None) != 4:
                continue
            for first, ligs in st.ligatures.items():
                for lg in ligs:
                    out[''.join(rev.get(g, '?') for g in [first] + lg.Component)] = lg.LigGlyph
    return out


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    src, dst, names = sys.argv[1], sys.argv[2], sorted(set(sys.argv[3:]))
    font = TTFont(src)
    ligs = ligatures(font)
    miss = [n for n in names if n not in ligs]
    if miss:
        print('not in the icon font (shown as text):', ', '.join(miss))
    opts = subset.Options()
    opts.layout_closure = False
    opts.layout_features = ['*']
    opts.flavor = 'woff2'
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(glyphs=[ligs[n] for n in names if n in ligs], text='abcdefghijklmnopqrstuvwxyz0123456789_ ')
    sub.subset(font)
    font.save(dst)
    print(f'{len(names) - len(miss)} icons -> {dst}')


if __name__ == '__main__':
    main()
