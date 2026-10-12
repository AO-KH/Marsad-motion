// The real app's pages, whole, for the hand-built films and the samples that show many of them: the collage of the
// Lovable-look sample (films/style-lovable), and "Know. Watch. Decide." (film54_src) and the website-style film
// (film.html), whose app window shows whole pages. They replace the site kit's rebuilt light pages (site_pages/,
// site_kit.js). `node tools/app_shot.js app-pages` (with the client's front end running) writes
// films/app-pages/pages/<key>.png, the crops of the parts those films animate, and shots.json (their boxes).
// Dark mode, the client's bilingual front end (its Arabic interface, the MARSAD × Fusion look), and the sample data the
// other films captured, so every film shows the same workspace «مساحة العرض»: the brand film's decisions, Business Pulse
// and assistant (films/style-jupiter), the What-if film's monitoring rules (films/whatif-38), the Knowledge Map
// walkthrough's map (demos/ontology-real) and the Search walkthrough's results (demos/search-walkthrough). This file's
// own: the Projects page's departments, projects and files; the alert in the bell; the assistant's answer to «من أين
// جاء رقم مبيعات الربع الثالث؟» ("Know. Watch. Decide." opens on that number). 2 px per CSS px: the films show the pages
// whole, in a window of 1360 px or smaller, or in a wall.
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const JUP = require('../../style-jupiter/app/capture.js');
const WHAT = require('../../whatif-38/app/capture.js');
const ONT = require('../../../demos/ontology-real/app/capture.js');
const SRCH = require('../../../demos/search-walkthrough/app/capture.js');
const route = (mod, re) => mod.routes.find(r => String(r[1]).includes(re))[2];

// the Projects page: departments → projects → files (its three panes), on the organisational ontology's types
const ORG = { departmentTypeId: 'ot-org-dept', projectTypeId: 'ot-org-proj', fileTypeId: 'ot-org-file',
  deptHasProjectLinkId: 'lt-dept-proj', projectContainsFileLinkId: 'lt-proj-file' };
const obj = (id, properties, m) => ({ id, properties, createdAt: ago(m), updatedAt: ago(m) });
const DEPTS = [obj('dp1', { name: 'المبيعات', description: 'الفروع والعملاء والفواتير' }, 60 * 24 * 40),
  obj('dp2', { name: 'المخزون والمستودعات', description: 'الأصناف والمستودعات والتوريد' }, 60 * 24 * 40),
  obj('dp3', { name: 'المالية', description: 'التحصيل والذمم والتقارير' }, 60 * 24 * 38)];
const PROJS = [obj('pj1', { name: 'فواتير الربع الثالث', department_id: 'dp1', status: 'active' }, 60 * 24 * 20),
  obj('pj2', { name: 'مرتجعات الفروع', department_id: 'dp1', status: 'active' }, 60 * 24 * 18),
  obj('pj3', { name: 'عقود العملاء', department_id: 'dp1', status: 'active' }, 60 * 24 * 15),
  obj('pj4', { name: 'جرد مستودع جدة', department_id: 'dp2', status: 'active' }, 60 * 24 * 12),
  obj('pj5', { name: 'الذمم المدينة', department_id: 'dp3', status: 'active' }, 60 * 24 * 9)];
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const FILES = [
  obj('fl1', { name: 'invoices_q3.xlsx', mime_type: XLSX, source_kind: 'xlsx', row_count: 1247, project_id: 'pj1', department_id: 'dp1',
    imported_at: '2026-10-02T09:20:00Z' }, 60 * 24 * 9),
  obj('fl2', { name: 'sales_by_branch_q3.csv', mime_type: 'text/csv', source_kind: 'csv', row_count: 312, project_id: 'pj1', department_id: 'dp1',
    imported_at: '2026-10-02T09:24:00Z' }, 60 * 24 * 9),
  obj('fl3', { name: 'ملخص مبيعات الربع الثالث.pdf', mime_type: 'application/pdf', source_kind: 'document', project_id: 'pj1', department_id: 'dp1',
    imported_at: '2026-10-03T11:05:00Z' }, 60 * 24 * 8),
  obj('fl4', { name: 'طلبات واتساب — سبتمبر', mime_type: 'text/plain', source_kind: 'whatsapp', row_count: 86, project_id: 'pj1', department_id: 'dp1',
    imported_at: '2026-10-04T08:40:00Z' }, 60 * 24 * 7),
  obj('fl5', { name: 'branch_returns.csv', mime_type: 'text/csv', source_kind: 'csv', row_count: 148, project_id: 'pj2', department_id: 'dp1',
    imported_at: '2026-10-05T10:10:00Z' }, 60 * 24 * 6),
  obj('fl6', { name: 'stock_jeddah_sept.xlsx', mime_type: XLSX, source_kind: 'xlsx', row_count: 2310, project_id: 'pj4', department_id: 'dp2',
    imported_at: '2026-10-06T07:55:00Z' }, 60 * 24 * 5)];
const byType = { [ORG.departmentTypeId]: DEPTS, [ORG.projectTypeId]: PROJS, [ORG.fileTypeId]: FILES };

// Business Pulse: the brand film's recommendations, or none yet (before «توليد توصيات»)
const INS = route(JUP, 'insights$').insights;
let listed = true;
// the alert in the bell: the decision the monitoring rule raised (the brand film's), pushed to the person accountable
const NOTES = [{ id: 'n1', kind: 'decision', title: 'قرار بانتظارك: انخفاض مخزون فرع الرياض',
  body: 'رفعته قاعدة المراقبة «مخزون منخفض — فرع الرياض»: ثلاثة أصناف تحت حد إعادة الطلب.', refType: 'decision',
  refId: '7f3c2a91-5b6e-4d0a-9c1f-2e8b4a6d3c70', read: false, createdAt: ago(10) }];
// the assistant: where the quarter's sales figure comes from ("Know. Watch. Decide." opens on that number)
const KQ = 'من أين جاء رقم مبيعات الربع الثالث؟';
const KANS = { answer: 'رقم مبيعات الربع الثالث **4,812,450 ر.س** هو مجموع **1,247** فاتورة في Odoo بين يوليو وسبتمبر، ويطابق ملف الفواتير الذي رُفع للربع نفسه.',
  sources: [{ objectId: 'k1', objectTypeApiName: 'sales_report', objectTypeDisplayName: 'تقرير مبيعات', title: 'مبيعات الربع الثالث' },
    { objectId: 'k2', objectTypeApiName: 'invoice', objectTypeDisplayName: 'فاتورة', title: 'فواتير Odoo — الربع الثالث' },
    { objectId: 'k3', objectTypeApiName: 'file', objectTypeDisplayName: 'ملف', title: 'invoices_q3.xlsx' }], tokensUsed: 0 };
const JCHAT = route(JUP, 'ai\\/chat$');
const chatBody = b => { try { return typeof b === 'string' ? JSON.parse(b) : (b || {}); } catch { return {}; } };

// the shared search route: «فاتورة» is the Search walkthrough's (its results by source), anything else the map's
const srchHits = route(SRCH, 'objects\\/search');
const ontSearch = route(ONT, 'objects\\/search');
const q = p => decodeURIComponent(new URL('http://x' + p).searchParams.get('q') || '').trim();
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const st = (key, url, rest = {}) => ({ key, url, ...rest });
const hideKicker = p => p.locator('span.label-k', { hasText: 'طبقة القرار السيادية' }).evaluate(e => { e.style.visibility = 'hidden'; });
const field = p => p.getByPlaceholder('اسأل مرصد عن أي شيء بخصوص بياناتك…');
const send = p => p.getByRole('button', { name: 'إرسال' });
const ontRun = key => ONT.states.find(s => s.key === key).run;
const D1T = 'انخفاض مخزون فرع الرياض — ثلاثة أصناف تحت حد إعادة الطلب';
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1T) });
const row = (name, up) => p => p.getByText(name, { exact: true }).first().locator(up);
const ROW = 'xpath=ancestor::div[contains(@class,"p-3")][1]';
const holdChat = (p, body, ms) => p.route(/localhost:8085\/api\/v1\/workspaces\/w1\/ai\/chat$/, async r => {
  if (r.request().method() !== 'POST') return r.fallback();
  await new Promise(res => setTimeout(res, ms));
  await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) }); });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark', dpr: 2,
  routes: [
    ['GET', /\/workspaces\/w1\/objects\/search$/, (b, p) => q(p).startsWith('فاتور') ? srchHits : ontSearch(b, p)],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, ORG],
    ['GET', /\/workspaces\/w1\/objects$/, (b, p) => {
      const t = new URL('http://x' + p).searchParams.get('objectTypeId'), rows = byType[t] || [];
      return { data: rows, page: 0, size: 500, totalElements: rows.length, totalPages: 1 }; }],
    ['GET', /\/workspaces\/w1\/insights$/, () => ({ insights: listed ? INS : [] })],
    ['GET', /\/workspaces\/w1\/notifications$/, { notifications: NOTES }],
    ['GET', /\/workspaces\/w1\/notifications\/unread-count$/, { count: 1 }],
    ['POST', /\/workspaces\/w1\/ai\/chat$/, b => (chatBody(b).message || '').includes('الربع الثالث') ? KANS : JCHAT],
    ...JUP.routes,
    ...WHAT.routes,
    ...ONT.routes,
    ...SRCH.routes,
  ],
  states: [
    // the Home page (its hero's small kicker «طبقة القرار السيادية» hidden, its place kept: the catalogue avoids 'sovereign')
    st('home', '/dashboard', { run: hideKicker, wait: 900 }),
    // Business Pulse: none yet, its «توليد توصيات»; then the recommendations as the page lists them
    st('pulse-empty', '/dashboard/insights', { run: async p => { listed = false; await p.reload({ waitUntil: 'networkidle' }); },
      wait: p => p.getByText('لا توجد توصيات بعد').first().waitFor(), crops: { btn: p => p.getByRole('button', { name: 'توليد توصيات' }) } }),
    st('pulse', null, { run: async p => { listed = true; await p.reload({ waitUntil: 'networkidle' }); },
      wait: p => p.getByText(/مبيعات فرع الرياض أقل من متوسط الفروع/).first().waitFor(),
      crops: { r1: p => p.locator('.glass-panel').filter({ hasText: /مبيعات فرع الرياض أقل من متوسط الفروع/ }).first() } }),
    // Decisions: the recommendation a monitoring rule raised; «موافقة», the confirm dialog, «تم بنجاح» (held: the app closes
    // it after 2 s), the card approved and the counts 5 / 1, then its passport (shown from its top, as a taller screen does)
    st('decisions', '/dashboard/ontology/decisions', { wait: p => card(p).waitFor(), crops: { card,
      approve: p => p.getByRole('button', { name: 'موافقة' }).first() } }),
    st('confirm', null, { run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), wait: 600, crops: {
      dialog: p => p.getByRole('dialog'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } }),
    st('done', null, { run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); }, wait: 400,
      crops: { dialog: p => p.getByRole('dialog') } }),
    st('after', null, { run: async p => {
      await p.evaluate(() => { window.setTimeout = window.__st; });
      await p.keyboard.press('Escape'); await p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }); }, wait: 600,
      crops: { card, pass: p => card(p).getByRole('button', { name: /جواز القرار/ }) } }),
    st('passport', null, { run: async p => {
      await card(p).getByRole('button', { name: /جواز القرار/ }).click(); await p.getByText('السلسلة سليمة — لا يوجد عبث').waitFor();
      await p.getByRole('dialog', { name: 'جواز القرار' }).evaluate(e => { e.parentElement.style.alignItems = 'flex-start'; }); }, wait: 600,
      crops: { seal: p => p.getByText('السلسلة سليمة — لا يوجد عبث').locator('xpath=../..') } }),
    // the assistant, its question answered with its sources (the brand film's question)
    st('assistant', '/dashboard/ontology/ai-chat', { run: async p => {
      await p.getByRole('heading', { name: 'مساعد مرصد الذكي', level: 2 }).waitFor();
      await field(p).fill('لماذا انخفضت مبيعات الرياض هذا الأسبوع؟'); await send(p).click();
      await p.getByText('المصادر', { exact: true }).waitFor({ timeout: 20000 }); }, wait: 900 }),
    // the assistant for "Know. Watch. Decide.": empty, the question typed, «المساعد يفكّر…», the answer with its sources
    st('ask', '/dashboard/ontology/ai-chat', { wait: p => p.getByRole('heading', { name: 'مساعد مرصد الذكي', level: 2 }).waitFor(),
      crops: { field, send } }),
    st('ask-space', null, { run: async p => { await field(p).click(); await field(p).fill(' '); }, wait: 300, crops: { field } }),
    st('ask-typed', null, { run: p => field(p).fill(KQ), wait: 300, crops: { field, send } }),
    st('ask-thinking', null, { run: async p => { await holdChat(p, KANS, 6000); await send(p).click(); await p.getByText('المساعد يفكّر…').waitFor(); },
      crops: { think: p => p.getByText('المساعد يفكّر…').locator('xpath=../..') } }),
    st('ask-answer', null, { wait: p => p.getByText('المصادر', { exact: true }).waitFor({ timeout: 15000 }),
      crops: { answer: p => p.getByText('المصادر', { exact: true }).locator('xpath=../..'), sources: p => p.getByText('المصادر', { exact: true }).locator('xpath=..') } }),
    // the knowledge map: a customer and everything it connects to, then the map of the data model
    st('map', '/dashboard/ontology/knowledge-graph', { run: async p => {
      await p.getByRole('textbox', { name: 'ابحث عن كائن لتبدأ منه' }).waitFor({ timeout: 120000 });
      await ontRun('search')(p); await p.waitForTimeout(1200); await ontRun('customer')(p); }, wait: 1800 }),
    st('schema', null, { run: ontRun('schema'), wait: 1800 }),
    // Search: «فاتورة», its results by source
    st('search', '/dashboard', { run: async p => {
      const input = p.getByRole('textbox', { name: 'البحث في البيانات' });
      await input.fill('فاتورة'); await input.press('Enter'); await p.getByText('INV-2291').waitFor({ timeout: 120000 });
      await p.locator('body').click({ position: { x: 1300, y: 760 } }); }, wait: 900 }),
    // the monitoring rules; then the alert in the bell, over them
    st('monitors', '/dashboard/ontology/decisions/monitors', { wait: p => p.getByText('فواتير معلّقة — أكثر من 30 يومًا').waitFor(),
      crops: { rule: p => p.locator('tbody tr').filter({ hasText: 'مخزون منخفض — فرع الرياض' }).first(),
        bellbtn: p => p.getByRole('button', { name: 'الإشعارات' }) } }),
    st('monitors-bell', null, { run: async p => { await p.getByRole('button', { name: 'الإشعارات' }).click(); await p.getByText(NOTES[0].title).waitFor(); },
      wait: 400, crops: { pop: p => p.getByText('تعليم الكل كمقروء').locator('xpath=../..') } }),
    // Projects: the Sales department, its project «فواتير الربع الثالث» and its files; then the same with the files'
    // rows hidden (their places kept), for the sources to land in
    st('projects', '/dashboard/projects', { run: async p => {
      await p.getByText('المبيعات', { exact: true }).first().click(); await p.getByText('فواتير الربع الثالث').first().click();
      await p.getByText('invoices_q3.xlsx').waitFor(); }, wait: 900, crops: {
      d1: row('المبيعات', 'xpath=ancestor::button[1]'), d2: row('المخزون والمستودعات', 'xpath=ancestor::button[1]'), d3: row('المالية', 'xpath=ancestor::button[1]'),
      p1: row('فواتير الربع الثالث', ROW), p2: row('مرتجعات الفروع', ROW), p3: row('عقود العملاء', ROW),
      f1: row('invoices_q3.xlsx', ROW), f2: row('sales_by_branch_q3.csv', ROW), f3: row('ملخص مبيعات الربع الثالث.pdf', ROW), f4: row('طلبات واتساب — سبتمبر', ROW) } }),
    st('projects-base', null, { run: p => p.evaluate(names => names.forEach(n => {
      const e = [...document.querySelectorAll('p')].find(x => x.textContent.trim() === n);
      const r = e && e.closest('div.p-3'); if (r) r.style.visibility = 'hidden'; }),
      ['invoices_q3.xlsx', 'sales_by_branch_q3.csv', 'ملخص مبيعات الربع الثالث.pdf', 'طلبات واتساب — سبتمبر']), wait: 300 }),
  ],
};
