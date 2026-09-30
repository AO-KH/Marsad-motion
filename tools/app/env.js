// The browser setup for running the real Marsad web app (the client's front end) with no backend and no internet.
// tools/app_snap.js uses it; it needs no edits per demo.
//  - a signed-in session in localStorage (the native auth client's key, marsad.auth.session),
//  - every API call (localhost:8081-8085, /api/v1) answered from the base routes below plus the demo's own routes
//    (demos/<slug>/app/capture.js: routes), in order, first match wins; anything unmatched gets {} and is logged as NEW,
//  - Google Fonts answered from local files (FONTS: the same files the snapshots use, so the layout is the same),
//  - the Next.js dev indicator hidden.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const ICONS_FULL = 'node_modules/material-symbols/material-symbols-outlined.woff2';   // npm install (devDependency)
const AR = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
// family, weight, file (repo-relative), unicode-range. The app loads IBM Plex Sans Arabic (text), Noto Kufi Arabic (h1, h2)
// and Material Symbols Outlined (icons: a ligature font, the icon's name is its text).
const FONTS = [
  ['IBM Plex Sans Arabic', '400', 'fonts/IBMPlexSansArabic-Regular.ttf'],
  ['IBM Plex Sans Arabic', '500', 'fonts/IBMPlexSansArabic-Medium.ttf'],
  ['IBM Plex Sans Arabic', '600', 'fonts/IBMPlexSansArabic-SemiBold.ttf'],
  ['IBM Plex Sans Arabic', '700', 'fonts/IBMPlexSansArabic-Bold.ttf'],
  ['Noto Kufi Arabic', '100 900', 'fonts/NotoKufiArabic-var-arabic.woff2', AR],
  ['Noto Kufi Arabic', '100 900', 'fonts/NotoKufiArabic-var-latin.woff2', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'],
  ['Material Symbols Outlined', '100 700', ICONS_FULL],
];
const face = ([fam, w, file, range], url) => `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:block;` +
  `src:url(${url(file)});${range ? `unicode-range:${range};` : ''}}`;
// the @font-face block: for the live app (served from fonts.gstatic.com/rx/...) or for a snapshot (repo paths; icons: the subset)
const fontCss = (url, only) => FONTS.filter(f => !only || only.test(f[0])).map(f => face(f, url)).join('\n');

const USER = { id: 'u1', email: 'demo@marsad.sa', user_metadata: { display_name: 'مدير العرض' }, app_metadata: {} };
const ORG = { id: 'o1', name: 'مؤسسة العرض' }, WS = { id: 'w1', name: 'مساحة العرض', slug: 'demo', orgId: 'o1' };
// what every page asks for: who is signed in, their org and workspace, their rights (an admin), the bell's count
const BASE = [
  ['GET', /\/auth\/me$/, { id: USER.id, email: USER.email, displayName: 'مدير العرض', memberships: [{ orgId: ORG.id, org: ORG, role: 'admin' }] }],
  ['GET', /\/orgs$/, [{ ...ORG, slug: 'demo', role: 'admin' }]],
  ['GET', /\/orgs\/o1\/workspaces$/, [WS]],
  ['GET', /\/rbac\/me$/, { verbs: ['view', 'create', 'edit', 'delete', 'execute', 'approve', 'export', 'view_pii', 'configure', 'admin'],
    roles: ['ADMIN'], piiViewer: true, clearance: 'restricted' }],
  ['GET', /\/notifications\/unread-count$/, { count: 3 }],
  ['POST', /\/client-errors$/, {}],
];

function responder(routes) {
  const all = [...(routes || []), ...BASE];
  return (method, url, body) => {
    const p = new URL(url).pathname.replace(/^\/api\/v1/, '') + new URL(url).search;
    for (const [m, re, res] of all) if (m === method && re.test(p.split('?')[0]))
      return { hit: true, body: typeof res === 'function' ? res(body ? safeJson(body) : null, p) : res };
    return { hit: false, body: method === 'GET' ? {} : { ok: true } };
  };
}
const safeJson = s => { try { return JSON.parse(s); } catch (e) { return s; } };

exports.setup = async function setup(ctx, { routes, log = [] } = {}) {
  const respond = responder(routes);
  await ctx.addInitScript(({ user }) => {
    localStorage.setItem('marsad.auth.session', JSON.stringify({ access_token: 't', refresh_token: 'r', expires_at: 4102444800, token_type: 'bearer', user }));
    document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style');
      s.textContent = 'nextjs-portal{display:none!important}'; document.head.appendChild(s); });
  }, { user: USER });
  await ctx.route(/\/\/localhost:808\d\//, route => { const r = route.request(), res = respond(r.method(), r.url(), r.postData());
    log.push((res.hit ? '    ' : 'NEW ') + r.method() + ' ' + r.url().replace(/^https?:\/\/localhost:/, ':'));
    route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(res.body) }); });
  await ctx.route(/fonts\.googleapis\.com\/css2/, route => { const fam = new URL(route.request().url()).searchParams.getAll('family').join('|');
    const only = new RegExp(fam.split('|').map(f => f.split(':')[0].replace(/\+/g, ' ')).join('|'));
    route.fulfill({ status: 200, contentType: 'text/css', headers: { 'access-control-allow-origin': '*' }, body: fontCss(f => `https://fonts.gstatic.com/rx/${f}`, only) }); });
  await ctx.route(/fonts\.gstatic\.com\/rx\//, route => { const f = decodeURIComponent(route.request().url().split('/rx/')[1]);
    const file = path.join(ROOT, f);
    if (!fs.existsSync(file)) { log.push('NO FONT ' + f); return route.fulfill({ status: 404, body: '' }); }
    route.fulfill({ status: 200, contentType: f.endsWith('.ttf') ? 'font/ttf' : 'font/woff2', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(file) }); });
};
exports.fontCss = fontCss;
exports.ICONS_FULL = ICONS_FULL;
exports.ROOT = ROOT;
