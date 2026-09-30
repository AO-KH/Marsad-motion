// Freeze the live app's current screen into static HTML + CSS the demo engine can animate (tools/app_snap.js runs this in
// the page with page.evaluate). Self-contained: it is sent to the browser as source.
//
// What it returns: {html, htmlCls, bodyCls, dir, lang, rules, urls, icons, notes}
//   html     the body's content, cleaned: no scripts; text fields become <div data-rx-field> (their value, or a .ph span
//            with the placeholder) sized and styled as they were; images inlined; canvases turned into images; the focused
//            element marked .rx-focus; scrolled boxes marked data-rx-scroll="x,y" (the window's scroll goes on .rx-scope)
//   rules    every style rule the page uses, rewritten for a snapshot: @media and @supports decided now (the layout is
//            frozen at this viewport), vh/vw turned into px, html/:root -> .rx-html, body -> .rx-body, and the states
//            :hover/:focus/:active -> the classes .rx-hover/.rx-focus/.rx-active (a demo can set them). @font-face and
//            @keyframes are dropped (the tool writes the fonts; snapshots have no CSS animation)
//   icons    the Material Symbols names on the screen (the tool subsets the icon font to them)
module.exports = async function serialize() {
  const W = innerWidth, H = innerHeight, notes = [];
  for (const a of document.getAnimations()) { try { a.finish(); } catch (e) { /* infinite: dropped below */ } }

  /* ---------- CSS ---------- */
  const vu = s => s.replace(/(-?\d*\.?\d+)(?:d|s|l)?(vh|vw|vmin|vmax)\b/g, (m, n, u) => {
    const v = u === 'vh' ? H : u === 'vw' ? W : u === 'vmin' ? Math.min(W, H) : Math.max(W, H);
    return +(parseFloat(n) * v / 100).toFixed(3) + 'px'; });
  const rw = sel => sel
    .replace(/(?<!\\):focus-visible/g, '.rx-focus').replace(/(?<!\\):focus-within/g, ':has(.rx-focus)')
    .replace(/(?<!\\):focus(?![\w-])/g, '.rx-focus').replace(/(?<!\\):hover(?![\w-])/g, '.rx-hover')
    .replace(/(?<!\\):active(?![\w-])/g, '.rx-active')
    .replace(/(^|[\s,>+~(])(?:html|:root)(?![\w-])/g, '$1.rx-html').replace(/(^|[\s,>+~(])body(?![\w-])/g, '$1.rx-body');
  const rules = [], seen = new Set();
  const push = r => { if (!seen.has(r)) { seen.add(r); rules.push(r); } };
  const walk = (list, depth = 0) => {
    for (const r of list) {
      const T = r.constructor.name;
      if (T === 'CSSStyleRule') {
        if (r.cssRules && r.cssRules.length) notes.push('nested CSS rules skipped under ' + r.selectorText.slice(0, 60));
        push(rw(r.selectorText) + '{' + vu(r.style.cssText) + '}');
      } else if (T === 'CSSMediaRule') { if (matchMedia(r.conditionText || r.media.mediaText).matches) walk(r.cssRules, depth + 1); }
      else if (T === 'CSSSupportsRule') { if (CSS.supports(r.conditionText)) walk(r.cssRules, depth + 1); }
      else if (T === 'CSSImportRule') { try { if (r.styleSheet) walk(r.styleSheet.cssRules, depth + 1); } catch (e) { /* cross-origin: fonts */ } }
      else if (T === 'CSSLayerBlockRule') { notes.push('@layer flattened: ' + r.name); walk(r.cssRules, depth + 1); }
      else if (T === 'CSSContainerRule') push('@container ' + r.conditionText + '{' + [...r.cssRules].map(x => x.constructor.name === 'CSSStyleRule' ? rw(x.selectorText) + '{' + vu(x.style.cssText) + '}' : '').join('') + '}');
      else if (T === 'CSSFontFaceRule' || T === 'CSSKeyframesRule' || T === 'CSSLayerStatementRule' || T === 'CSSPageRule') { /* see above */ }
      else notes.push('kept as is: ' + r.cssText.slice(0, 80)), push(r.cssText);
    }
  };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { /* cross-origin sheet (Google Fonts) */ } }

  /* ---------- HTML ---------- */
  const body = document.body, clone = body.cloneNode(true);
  const live = [...body.querySelectorAll('*')], copy = [...clone.querySelectorAll('*')];
  if (live.length !== copy.length) throw new Error('snapshot: the clone does not line up with the page');
  const DROP = new Set(['SCRIPT', 'NOSCRIPT', 'TEMPLATE', 'NEXTJS-PORTAL', 'NEXT-ROUTE-ANNOUNCER', 'LINK', 'STYLE', 'META', 'IFRAME']);
  const LINE = new Set(['text', 'search', 'email', 'url', 'tel', 'number', 'password', 'date', 'time', 'datetime-local', 'month', 'week']);
  const FIELD_CSS = ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'color', 'background-color',
    'text-align', 'box-shadow', 'direction'].concat(...['top', 'right', 'bottom', 'left'].map(s => [`border-${s}-width`, `border-${s}-style`,
    `border-${s}-color`, `padding-${s}`])).concat(['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(c => `border-${c}-radius`));
  const icons = new Set(), jobs = [], focus = document.activeElement;
  const dataUrl = async src => { const b = await (await fetch(src)).blob();
    return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }); };
  for (let i = 0; i < live.length; i++) {
    const s = live[i], d = copy[i], tag = s.tagName;
    if (DROP.has(tag)) { d.remove(); continue; }
    if (s === focus) d.classList.add('rx-focus');
    if (s.classList.contains('material-symbols-outlined')) icons.add(s.textContent.trim());
    if (s.scrollTop || s.scrollLeft) d.setAttribute('data-rx-scroll', Math.round(s.scrollLeft) + ',' + Math.round(s.scrollTop));
    if (d.hasAttribute('style')) d.setAttribute('style', vu(d.getAttribute('style')));
    if (tag === 'TEXTAREA' || (tag === 'INPUT' && LINE.has((s.type || 'text').toLowerCase())) || tag === 'SELECT') {
      const f = document.createElement('div'), cs = getComputedStyle(s);
      for (const a of d.attributes) if (!/^(value|placeholder|rows|cols|type|name|autocomplete|spellcheck|autofocus|required|maxlength|minlength|multiple|size)$/.test(a.name)) f.setAttribute(a.name, a.value);
      const area = tag === 'TEXTAREA', disp = cs.display;
      f.setAttribute('data-rx-field', area ? 'area' : 'line');
      // a single-line field centres its text in its height; a textarea starts at the top and wraps
      f.style.cssText += ';' + FIELD_CSS.map(p => `${p}:${cs.getPropertyValue(p)}`).join(';') +
        `;width:${s.offsetWidth}px;height:${s.offsetHeight}px;box-sizing:border-box;overflow:hidden;vertical-align:${cs.verticalAlign};` +
        (area ? `display:${disp};white-space:pre-wrap;overflow-wrap:break-word;` :
          `display:${disp === 'none' ? 'none' : disp.startsWith('inline') ? 'inline-flex' : 'flex'};align-items:center;white-space:pre;` +
          (cs.textAlign === 'center' ? 'justify-content:center;' : ''));
      const val = tag === 'SELECT' ? (s.selectedOptions[0] || {}).textContent || '' : s.type === 'password' ? '•'.repeat(s.value.length) : s.value;
      if (val) f.appendChild(document.createTextNode(val));
      else if (s.placeholder) { const ph = document.createElement('span'); ph.className = 'ph'; ph.textContent = s.placeholder;
        ph.style.color = getComputedStyle(s, '::placeholder').color; f.appendChild(ph); }
      d.replaceWith(f); continue;
    }
    if (tag === 'INPUT') { if (s.checked) d.setAttribute('checked', ''); else d.removeAttribute('checked'); }
    if (tag === 'CANVAS') {
      const im = document.createElement('img'); for (const a of d.attributes) im.setAttribute(a.name, a.value);
      try { im.src = s.toDataURL('image/png'); } catch (e) { notes.push('a canvas could not be read (tainted)'); }
      im.style.width = s.offsetWidth + 'px'; im.style.height = s.offsetHeight + 'px'; d.replaceWith(im); continue;
    }
    if (tag === 'IMG') {
      d.removeAttribute('srcset'); d.removeAttribute('sizes'); d.removeAttribute('loading'); d.removeAttribute('decoding');
      const src = s.currentSrc || s.src;
      if (src && !src.startsWith('data:')) jobs.push(dataUrl(src).then(u => d.setAttribute('src', u)).catch(() => notes.push('image not inlined: ' + src)));
    }
    if (tag === 'SOURCE' && d.parentElement && d.parentElement.tagName === 'PICTURE') d.remove();
  }
  await Promise.all(jobs);

  // url(...) in the CSS (backgrounds): inline them too
  const urls = new Map();
  for (const r of rules) for (const m of r.matchAll(/url\((["']?)([^"')]+)\1\)/g)) if (!m[2].startsWith('data:') && !urls.has(m[2])) urls.set(m[2], null);
  await Promise.all([...urls.keys()].map(u => dataUrl(new URL(u, location.href).href).then(x => urls.set(u, x)).catch(() => notes.push('CSS url not inlined: ' + u))));
  const out = rules.map(r => r.replace(/url\((["']?)([^"')]+)\1\)/g, (m, q, u) => urls.get(u) ? `url("${urls.get(u)}")` : m));

  const root = document.scrollingElement || document.documentElement;
  return { html: clone.innerHTML, htmlCls: document.documentElement.className || '', bodyCls: body.className || '',
    dir: document.documentElement.getAttribute('dir') || 'ltr', lang: document.documentElement.getAttribute('lang') || '',
    scroll: [Math.round(root.scrollLeft), Math.round(root.scrollTop)], rules: out, icons: [...icons].filter(Boolean).sort(), notes, w: W, h: H };
};
