// The real app's screens for the Monitor film (tools/app_shot.js reads this; see its header): `node tools/app_shot.js
// monitor` writes films/monitor/pages/ (the crops) and shots.json (their boxes). Dark mode, the client's bilingual front
// end of 2026-10-02 (its Arabic interface, the MARSAD × Fusion look). Sample data, labelled "Sample data" in the film:
// the Coffee film's story (films/coffee-launch/app/capture.js, the same records, decision and passport), cut to 13 s:
// - record, s<value>: the coffee's own page, its properties («المخزون المتاح» 240, «حد إعادة الطلب» 200), then its
//   stock row at each value it falls through as eight orders come in (data.json: stock.steps), down to 188;
// - recordbase: the same card with its rows hidden (their places kept), for the film to write them in;
// - bar, bell: the header with its bell, then the alert the monitoring rule raised, in the bell (alerts are in the app
//   only, as the feature catalogue says);
// - decisions, confirm, done: the decision's card, «تأكيد الموافقة» with a reason, the app's «تم بنجاح» (nothing runs
//   after it: the automatic follow-up is switched off in the catalogue);
// - passport, passbase: its Decision Passport with the approval and the green seal (a taller window, as for the
//   brand film), and the paper where the approval's ledger entry sits, without it, for the entry to slide into;
// - rules: «قواعد المراقبة», the rule that raised it among the workspace's rules.
const crypto = require('crypto');
const DATA = require('../data.json');
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const T = {
  product:   { id: 'ot-2c-product-1',   apiName: 'product',   displayName: 'Product',   displayNameAr: 'منتج',   titleProperty: 'name' },
  warehouse: { id: 'ot-3w-warehouse-2', apiName: 'warehouse', displayName: 'Warehouse', displayNameAr: 'مستودع', titleProperty: 'name' },
};
const COF = { id: '5c0f3e21-8a4d-4b6e-9f12-7d3a1c5e8b40', p: { name: 'قهوة عربية مختصة — 1 كجم', sku: 'CF-2040', stock_on_hand: 240, reorder_level: 200, unit_price: 64 } };
const PROPS = [['name', 'الاسم'], ['sku', 'الرمز'], ['stock_on_hand', 'المخزون المتاح', 'integer'], ['reorder_level', 'حد إعادة الطلب', 'integer'], ['unit_price', 'سعر الوحدة (ر.س)', 'double']];
const defs = PROPS.map(([apiName, ar, dataType = 'string'], i) => ({ id: `pd-product-${i}`, apiName, displayName: apiName, displayNameAr: ar,
  dataType, isRequired: i === 0, isPii: false, sortOrder: i }));
let stock = 240;
const record = () => ({ id: COF.id, objectTypeId: T.product.id, properties: { ...COF.p, stock_on_hand: stock }, classificationLevel: 'internal',
  createdAt: '2026-03-02T09:00:00Z', updatedAt: '2026-10-11T08:40:00Z' });
const typeRow = t => ({ ...t, classificationLevel: 'internal', status: 'published' });

// the rule, the decision it raised, the alert and the passport (as the Coffee film)
const RULE = 'مخزون القهوة — المستودع المركزي';
const D1 = { id: '2b7d4e91-3c5a-4f6b-8d1e-9a0c2f4b6d71', title: 'انخفاض مخزون قهوة عربية مختصة — 188 تحت حد إعادة الطلب 200',
  description: `قاعدة المراقبة «${RULE}» رصدت 188 وحدة من قهوة عربية مختصة، تحت حد إعادة الطلب 200.`,
  priority: 'high', status: 'pending', affectedObjectsCount: 1, confidence: 0.84, source: 'monitor',
  aiInsight: 'بمعدل البيع الحالي ينفد المخزون خلال 9 أيام؛ يُقترح طلب توريد 300 وحدة قبل نهاية الأسبوع.', createdAt: ago(6) };
const REST = [
  { id: 'd2', title: 'ارتفاع مرتجعات فرع جدة — مراجعة سياسة الإرجاع', description: 'نسبة المرتجعات في فرع جدة أعلى من متوسط الفروع خلال الشهر الماضي.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 12, confidence: 0.72, source: 'monitor', createdAt: ago(60) },
];
const REASON = 'التوريد الحالي لا يغطي مبيعات الأسبوعين القادمين.';
let approved = false, approvedAt = null;
const counts = () => ({
  totalByStatus: [{ status: 'pending', count: approved ? 3 : 4 }, { status: 'approved', count: approved ? 1 : 0 }, { status: 'rejected', count: 0 }],
  pendingByPriority: [{ priority: 'critical', count: 0 }, { priority: 'high', count: approved ? 0 : 1 }, { priority: 'medium', count: 2 }, { priority: 'low', count: 1 }],
});
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const passport = () => ({
  decision: { id: D1.id, title: D1.title, status: approved ? 'approved' : 'pending', priority: D1.priority },
  provenance: { correlationId: 'corr-7c2f9a1e-44b0', snapshotTs: D1.createdAt, modelInvocationId: null,
    oversight: { dwellMs: 6200, logicExpanded: false, rationale: REASON, serverReceivedAt: approvedAt } },
  snapshot: { snapshotTs: D1.createdAt, evidenceRefs: [{ type: 'internal_object', id: 'CF-2040', metric_value: 188 }] },
  ledger: [{ seq: 4, eventType: 'decision.raised', prevHash: hash('3'), entryHash: hash('4'), createdAt: D1.createdAt },
    ...(approved ? [{ seq: 5, eventType: 'decision.approved', prevHash: hash('4'), entryHash: hash('5'), createdAt: approvedAt }] : [])],
  integrity: { workspaceChainValid: true, chainLength: approved ? 5 : 4 },
});
const NOTES = [{ id: 'n1', kind: 'decision', title: 'قرار بانتظارك: انخفاض مخزون قهوة عربية مختصة',
  body: `رفعته قاعدة المراقبة «${RULE}»: 188 وحدة، تحت حد إعادة الطلب 200.`, refType: 'decision', refId: D1.id, read: false, createdAt: ago(6) }];
// the workspace's rules: the coffee's (a count of the products under their reorder level, so «ماذا لو…» is greyed out on
// it, as on every count rule) and three more, as the What-if film's
const RULES = [
  { id: 'm0', name: RULE, monitorType: 'low_stock', frequency: 'hourly', isActive: true, targetRole: 'editor',
    lastRunAt: D1.createdAt, lastRunStatus: 'fired', createdAt: '2026-08-10T09:00:00Z', config: { spec: { metric: { op: 'count' } } } },
  { id: 'm1', name: 'فواتير معلّقة — أكثر من 30 يومًا', monitorType: 'overdue_invoice', frequency: 'daily', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-10-11T05:00:00Z', lastRunStatus: 'clean', createdAt: '2026-08-12T09:00:00Z',
    config: { spec: { metric: { op: 'sum', property: 'amount_residual' } } } },
  { id: 'm3', name: 'أصناف راكدة', monitorType: 'no_restock', frequency: 'weekly', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-10-05T06:00:00Z', lastRunStatus: 'clean', createdAt: '2026-08-20T09:00:00Z',
    config: { spec: { metric: { op: 'count' } } } },
  { id: 'm4', name: 'متوسط قيمة أوامر البيع', monitorType: 'custom', frequency: 'daily', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-10-11T05:00:00Z', lastRunStatus: 'clean', createdAt: '2026-09-02T09:00:00Z',
    config: { spec: { metric: { op: 'avg', property: 'amount_total' } } } },
];

const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });
const row = label => p => p.getByText(label, { exact: true }).locator('xpath=..');
const bell = p => p.getByRole('button', { name: 'الإشعارات' });
const props = p => p.getByText('خصائص الكائن', { exact: true }).locator('xpath=ancestor::div[contains(@class,"card")][1]');
const entry = name => p => p.locator('div.rounded-lg.px-3.py-2').filter({ hasText: name });
const hide = (loc, on) => loc.evaluate((e, v) => { e.style.visibility = v; }, on ? 'hidden' : '');
const stockState = v => ({ key: `s${v}`, full: false, run: async p => {
  stock = v; await p.reload({ waitUntil: 'networkidle' });
  await row('المخزون المتاح')(p).getByText(String(v), { exact: true }).waitFor({ timeout: 60000 }); }, crops: { stock: row('المخزون المتاح') } });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark', dpr: 5,
  routes: [
    ['GET', /\/workspaces\/w1\/object-types$/, () => ({ content: Object.values(T).map(typeRow), totalPages: 1, totalElements: 2 })],
    ['GET', /\/workspaces\/w1\/link-types$/, { content: [], totalPages: 0, totalElements: 0 }],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+\/properties$/, (b, p) => p.includes(T.product.id) ? defs : []],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+$/, (b, p) => {
      const id = decodeURIComponent(p.split('/object-types/')[1].split('?')[0]);
      const t = Object.values(T).find(x => x.id === id); return t ? typeRow(t) : {}; }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/links$/, { outgoing: [], incoming: [], total: 0 }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/(history|versions)$/, { content: [], totalPages: 0, totalElements: 0 }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+$/, record],
    ['GET', /\/workspaces\/w1\/action-types$/, { data: [], page: 0, size: 200, totalElements: 0, totalPages: 0 }],
    ['GET', /\/workspaces\/w1\/notifications$/, { notifications: NOTES }],
    ['GET', /\/workspaces\/w1\/notifications\/unread-count$/, { count: 1 }],
    ['GET', /\/workspaces\/w1\/decisions$/, () => ({ decisions: [approved ? { ...D1, status: 'approved', decidedAt: approvedAt } : D1, ...REST] })],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['POST', new RegExp(`/decisions/${D1.id}/approve$`), () => { approved = true; approvedAt = new Date().toISOString(); return {}; }],
    ['GET', new RegExp(`/decisions/${D1.id}/passport$`), passport],
    ['GET', /\/workspaces\/w1\/monitors\/templates$/, { templates: [] }],
    ['GET', /\/workspaces\/w1\/monitors$/, { monitors: RULES }],
    ['GET', /\/workspaces\/w1\/insights$/, { insights: [] }],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
  ],
  states: [
    // the coffee's page: its properties card, and its stock and reorder rows (the type's English name in the page's
    // header stays out of the film)
    { key: 'record', full: false, url: `/dashboard/ontology/objects/${COF.id}`,
      wait: p => p.getByRole('button', { name: 'الروابط', exact: true }).waitFor({ timeout: 120000 }), crops: {
        props, stock: row('المخزون المتاح') } },
    { key: 'recordbase', full: false, run: p => p.evaluate(() => document.querySelectorAll('span.min-w-\\[160px\\]')
      .forEach(e => { e.parentElement.style.visibility = 'hidden'; })), crops: { props } },
    // the stock falling: one state per value (the first is the record's own 240)
    ...DATA.stock.steps.slice(1).map(([, v]) => stockState(v)),
    // the header with its bell, then the alert in the bell
    { key: 'bar', full: false, url: '/dashboard/ontology/decisions', wait: p => card(p).waitFor({ timeout: 120000 }),
      crops: { header: p => p.locator('header').first(), bell } },
    { key: 'bell', full: false, run: async p => { await bell(p).click(); await p.getByText(NOTES[0].title).waitFor(); },
      crops: { pop: p => p.getByText('تعليم الكل كمقروء').locator('xpath=../..') } },
    // the decision's card; «موافقة» opens the confirm dialog, a reason typed; «تم بنجاح» (held: the app closes it after 2 s)
    { key: 'decisions', full: false, run: p => p.keyboard.press('Escape'), wait: 800, crops: { card,
      source: p => card(p).locator('span').filter({ hasText: /^\S*\s*مراقبة$/ }).first(),
      approve: p => p.getByRole('button', { name: 'موافقة' }).first() } },
    { key: 'confirm', full: false, run: async p => {
      await p.getByRole('button', { name: 'موافقة' }).first().click(); await p.locator('textarea').fill(REASON); await p.locator('textarea').blur(); },
      crops: { dialog: p => p.getByRole('dialog'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    { key: 'done', full: false, run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      crops: { dialog: p => p.getByRole('dialog'), head: p => p.getByText('تم بنجاح') } },
    // the passport, approved, in a taller window; then without the approval's entry (its place kept)
    { key: 'passport', full: false, url: '/dashboard/ontology/decisions', run: async p => {
      await p.setViewportSize({ width: 1440, height: 1240 }); await card(p).getByRole('button', { name: /جواز القرار/ }).click(); },
      wait: p => p.getByText('السلسلة سليمة — لا يوجد عبث').waitFor(), crops: {
        modal: p => p.getByRole('dialog', { name: 'جواز القرار' }),
        seal: p => p.getByText('السلسلة سليمة — لا يوجد عبث').locator('xpath=../..'),
        raised: entry('رُفِع القرار'), approved: entry('تمت الموافقة') } },
    { key: 'passbase', full: false, run: p => hide(entry('تمت الموافقة')(p), true), crops: { slot: entry('تمت الموافقة') } },
    // «قواعد المراقبة»: the rule that raised it, first in the list
    { key: 'rules', full: false, url: '/dashboard/ontology/decisions/monitors', run: p => p.setViewportSize({ width: 1440, height: 805 }),
      wait: p => p.getByText(RULE).waitFor({ timeout: 120000 }), crops: {
        table: p => p.locator('table').locator('xpath=ancestor::div[contains(@class,"card")][1]'),
        row: p => p.locator('tbody tr').nth(0), name: p => p.getByText(RULE, { exact: true }) } },
  ],
};
