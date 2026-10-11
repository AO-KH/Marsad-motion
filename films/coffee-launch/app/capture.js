// The real app's screens for the coffee story (tools/app_shot.js reads this; see its header). Dark mode, the client's
// bilingual front end (its Arabic interface, the MARSAD × Fusion look), sample data labelled in the film:
// - record, links: the coffee's own page in the knowledge map («قهوة عربية مختصة — 1 كجم», a product: its properties,
//   then «الروابط»: stored in the Riyadh central warehouse, ordered by «متاجر الواحة» on SO-1203, billed on INV-10477);
// - bell: the decision a monitoring rule raised, pushed to the person accountable (the app's bell; alerts are in the app
//   only, as the feature catalogue says);
// - decisions, confirm, done, after: the decision approved with «موافقة» → «تأكيد الموافقة» → «تم بنجاح» (nothing runs
//   after it: the automatic follow-up is switched off in the catalogue);
// - passport: its Decision Passport, with the approval and the green seal (a taller window, as for the brand film).
// Only the crops are kept (full: false): the film uses no whole window.
const crypto = require('crypto');
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const T = {
  product:   { id: 'ot-2c-product-1',   apiName: 'product',     displayName: 'Product',     displayNameAr: 'منتج',    titleProperty: 'name' },
  warehouse: { id: 'ot-3w-warehouse-2', apiName: 'warehouse',   displayName: 'Warehouse',   displayNameAr: 'مستودع',  titleProperty: 'name' },
  customer:  { id: 'ot-4-customer-1',   apiName: 'customer',    displayName: 'Customer',    displayNameAr: 'عميل',    titleProperty: 'name' },
  order:     { id: 'ot-2a-salesorder-1',apiName: 'sales_order', displayName: 'Sales order', displayNameAr: 'أمر بيع', titleProperty: 'number' },
  invoice:   { id: 'ot-5-invoice-j',    apiName: 'invoice',     displayName: 'Invoice',     displayNameAr: 'فاتورة',  titleProperty: 'number' },
};
const L = {   // link types: source → target
  stored:  ['lt-prod-wh',  'product_warehouse', 'مخزّن في',          'product', 'warehouse', 'many_to_one'],
  ordLine: ['lt-ord-prod', 'order_product',     'يتضمن المنتج',      'order',   'product',   'many_to_many'],
  invLine: ['lt-inv-prod', 'invoice_product',   'تتضمن المنتج',      'invoice', 'product',   'many_to_many'],
  ordCust: ['lt-ord-cust', 'order_customer',    'طلب العميل',        'order',   'customer',  'many_to_one'],
};
const LT = Object.fromEntries(Object.entries(L).map(([k, [id, apiName, name, s, t, card]]) =>
  [k, { id, apiName, displayName: name, displayNameAr: name, sourceObjectTypeId: T[s].id, targetObjectTypeId: T[t].id, cardinality: card }]));
const O = {
  cof: { t: 'product',   id: '5c0f3e21-8a4d-4b6e-9f12-7d3a1c5e8b40', p: { name: 'قهوة عربية مختصة — 1 كجم', sku: 'CF-2040', stock_on_hand: 240, reorder_level: 200, unit_price: 64 } },
  wh:  { t: 'warehouse', id: 'b7e2a913-4c5d-4e8f-a1b2-3c4d5e6f7a81', p: { name: 'مستودع الرياض المركزي', city: 'الرياض' } },
  so:  { t: 'order',     id: 'd3f8c2a1-6b7e-4c9d-8e0f-1a2b3c4d5e92', p: { number: 'SO-1203', order_date: '2026-10-08', status: 'قيد التجهيز' } },
  cu:  { t: 'customer',  id: '4f0c2a7e-91b3-4d5a-8c2e-7a1f3b9d6e01', p: { name: 'متاجر الواحة', city: 'الرياض' } },
  inv: { t: 'invoice',   id: 'e9a1b2c3-d4e5-4f60-8172-93a4b5c6d7e3', p: { number: 'INV-10477', invoice_date: '2026-10-09', amount_total: 9600 } },
};
for (const [k, o] of Object.entries(O)) o.key = k;
const byId = Object.fromEntries(Object.values(O).map(o => [o.id, o]));
const PROPS = {
  product: [['name', 'الاسم'], ['sku', 'الرمز'], ['stock_on_hand', 'المخزون المتاح', 'integer'], ['reorder_level', 'حد إعادة الطلب', 'integer'], ['unit_price', 'سعر الوحدة (ر.س)', 'double']],
  warehouse: [['name', 'الاسم'], ['city', 'المدينة']], customer: [['name', 'الاسم'], ['city', 'المدينة']],
  order: [['number', 'رقم الطلب'], ['order_date', 'تاريخ الطلب'], ['status', 'الحالة']],
  invoice: [['number', 'رقم الفاتورة'], ['invoice_date', 'تاريخ الفاتورة'], ['amount_total', 'الإجمالي (ر.س)', 'double']],
};
const defs = t => PROPS[t].map(([apiName, ar, dataType = 'string'], i) => ({ id: `pd-${t}-${i}`, apiName, displayName: apiName, displayNameAr: ar,
  dataType, isRequired: i === 0, isPii: false, sortOrder: i }));
const EDGES = [['e1', 'stored', 'cof', 'wh'], ['e2', 'ordLine', 'so', 'cof'], ['e3', 'invLine', 'inv', 'cof'], ['e4', 'ordCust', 'so', 'cu']];
const eid = k => `0e${k.slice(1).padStart(3, '0')}cf1-6b2d-4c8e-9f13-2d7a5c1b8e4f`;
const edge = ([k, lt, s, t]) => ({ id: eid(k), linkTypeId: LT[lt].id, sourceObjectId: O[s].id, targetObjectId: O[t].id,
  properties: { link_status: 'confirmed' }, linkStatus: 'confirmed' });
const LINKS = key => { const out = [], inc = [];
  for (const e of EDGES) { const [, lt, s, t] = e, row = { ...edge(e), linkType: { apiName: LT[lt].apiName, displayName: LT[lt].displayName },
    sourceObject: { id: O[s].id, properties: O[s].p }, targetObject: { id: O[t].id, properties: O[t].p }, properties: { link_status: 'confirmed' } };
    if (s === key) out.push(row); else if (t === key) inc.push(row); }
  return { outgoing: out, incoming: inc, total: out.length + inc.length }; };
const record = o => ({ id: o.id, objectTypeId: T[o.t].id, properties: o.p, classificationLevel: 'internal', createdAt: '2026-03-02T09:00:00Z', updatedAt: '2026-10-11T08:40:00Z' });
const typeRow = t => ({ ...t, classificationLevel: 'internal', status: 'published' });

// the decision the monitoring rule raised, and its passport
const D1 = { id: '2b7d4e91-3c5a-4f6b-8d1e-9a0c2f4b6d71', title: 'انخفاض مخزون قهوة عربية مختصة — 188 تحت حد إعادة الطلب 200',
  description: 'قاعدة المراقبة «مخزون القهوة — المستودع المركزي» رصدت 188 وحدة من قهوة عربية مختصة، تحت حد إعادة الطلب 200.',
  priority: 'high', status: 'pending', affectedObjectsCount: 1, confidence: 0.84, source: 'monitor',
  aiInsight: 'بمعدل البيع الحالي ينفد المخزون خلال 9 أيام؛ يُقترح طلب توريد 300 وحدة قبل نهاية الأسبوع.', createdAt: ago(6) };
const REST = [
  { id: 'd2', title: 'ارتفاع مرتجعات فرع جدة — مراجعة سياسة الإرجاع', description: 'نسبة المرتجعات في فرع جدة أعلى من متوسط الفروع خلال الشهر الماضي.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 12, confidence: 0.72, source: 'monitor', createdAt: ago(60) },
];
let approved = false, approvedAt = null;
const counts = () => ({
  totalByStatus: [{ status: 'pending', count: approved ? 3 : 4 }, { status: 'approved', count: approved ? 1 : 0 }, { status: 'rejected', count: 0 }],
  pendingByPriority: [{ priority: 'critical', count: 0 }, { priority: 'high', count: approved ? 0 : 1 }, { priority: 'medium', count: 2 }, { priority: 'low', count: 1 }],
});
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const passport = () => ({
  decision: { id: D1.id, title: D1.title, status: approved ? 'approved' : 'pending', priority: D1.priority },
  provenance: { correlationId: 'corr-7c2f9a1e-44b0', snapshotTs: D1.createdAt, modelInvocationId: null,
    oversight: { dwellMs: 6200, logicExpanded: true, rationale: 'التوريد الحالي لا يغطي مبيعات الأسبوعين القادمين.', serverReceivedAt: approvedAt } },
  snapshot: { snapshotTs: D1.createdAt, evidenceRefs: [{ type: 'internal_object', id: 'CF-2040', metric_value: 188 }] },
  ledger: [{ seq: 4, eventType: 'decision.raised', prevHash: hash('3'), entryHash: hash('4'), createdAt: D1.createdAt },
    ...(approved ? [{ seq: 5, eventType: 'decision.approved', prevHash: hash('4'), entryHash: hash('5'), createdAt: approvedAt }] : [])],
  integrity: { workspaceChainValid: true, chainLength: approved ? 5 : 4 },
});
const NOTES = [{ id: 'n1', kind: 'decision', title: 'قرار بانتظارك: انخفاض مخزون قهوة عربية مختصة',
  body: 'رفعته قاعدة المراقبة «مخزون القهوة — المستودع المركزي»: 188 وحدة، تحت حد إعادة الطلب 200.', refType: 'decision', refId: D1.id, read: false, createdAt: ago(6) }];
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });
const stats = p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }).locator('xpath=..');
const linkRow = k => p => p.locator('[role=link]').filter({ hasText: text(O[k].p[T[O[k].t].titleProperty]) });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark', dpr: 5,
  routes: [
    ['GET', /\/workspaces\/w1\/object-types$/, () => ({ content: Object.values(T).map(typeRow), totalPages: 1, totalElements: 5 })],
    ['GET', /\/workspaces\/w1\/link-types$/, () => ({ content: Object.values(LT), totalPages: 1, totalElements: 4 })],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+\/properties$/, (b, p) => {
      const id = decodeURIComponent(p.split('/object-types/')[1].split('/')[0]);
      const t = Object.keys(T).find(k => T[k].id === id); return t ? defs(t) : []; }],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+$/, (b, p) => {
      const id = decodeURIComponent(p.split('/object-types/')[1].split('?')[0]);
      const t = Object.values(T).find(x => x.id === id); return t ? typeRow(t) : {}; }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/links$/, (b, p) => LINKS(byId[p.split('/objects/')[1].split('/')[0]]?.key)],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/(history|versions)$/, { content: [], totalPages: 0, totalElements: 0 }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+$/, (b, p) => { const o = byId[p.split('/objects/')[1].split('?')[0]]; return o ? record(o) : {}; }],
    ['GET', /\/workspaces\/w1\/action-types$/, { data: [], page: 0, size: 200, totalElements: 0, totalPages: 0 }],
    ['GET', /\/workspaces\/w1\/notifications$/, { notifications: NOTES }],
    ['GET', /\/workspaces\/w1\/notifications\/unread-count$/, { count: 1 }],
    ['GET', /\/workspaces\/w1\/decisions$/, () => ({ decisions: [approved ? { ...D1, status: 'approved', decidedAt: approvedAt } : D1, ...REST] })],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['POST', new RegExp(`/decisions/${D1.id}/approve$`), () => { approved = true; approvedAt = new Date().toISOString(); return {}; }],
    ['GET', new RegExp(`/decisions/${D1.id}/passport$`), passport],
    ['GET', /\/workspaces\/w1\/insights$/, { insights: [] }],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
  ],
  states: [
    { full: false, key: 'record', url: `/dashboard/ontology/objects/${O.cof.id}`, wait: p => p.getByRole('button', { name: 'الروابط', exact: true }).waitFor({ timeout: 120000 }),
      crops: { props: p => p.getByText('خصائص الكائن', { exact: true }).locator('xpath=ancestor::div[contains(@class,"card")][1]') } },   // (its header shows the type's English name: left out)
    { full: false, key: 'links', run: p => p.getByRole('button', { name: 'الروابط', exact: true }).click(), wait: 1200, crops: {
      panel: p => p.getByText('الروابط الصادرة', { exact: true }).locator('xpath=ancestor::div[contains(@class,"card")][1]'),
      wh: linkRow('wh'), so: linkRow('so'), inv: linkRow('inv') } },
    { full: false, key: 'bell', url: '/dashboard/ontology/decisions', run: async p => {
      await p.getByRole('button', { name: 'الإشعارات' }).click(); await p.getByText(NOTES[0].title).waitFor(); }, crops: {
      pop: p => p.getByText('تعليم الكل كمقروء').locator('xpath=../..'), bell: p => p.getByRole('button', { name: 'الإشعارات' }) } },
    { full: false, key: 'decisions', run: p => p.keyboard.press('Escape'), wait: 800, crops: {
      card, approve: p => p.getByRole('button', { name: 'موافقة' }).first(), stats } },
    { full: false, key: 'confirm', run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), crops: {
      dialog: p => p.getByRole('dialog'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    { full: false, key: 'done', run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      crops: { dialog: p => p.getByRole('dialog') } },
    { full: false, key: 'after', run: async p => {
      await p.evaluate(() => { window.setTimeout = window.__st; });
      await p.keyboard.press('Escape'); await p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }); },
      crops: { card, stats, pass: p => card(p).getByRole('button', { name: /جواز القرار/ }) } },
    { full: false, key: 'passport', url: '/dashboard/ontology/decisions', run: async p => {
      await p.setViewportSize({ width: 1440, height: 1240 }); await card(p).getByRole('button', { name: /جواز القرار/ }).click(); },
      wait: p => p.getByText('السلسلة سليمة — لا يوجد عبث').waitFor(), crops: {
        modal: p => p.getByRole('dialog', { name: 'جواز القرار' }),
        seal: p => p.getByText('السلسلة سليمة — لا يوجد عبث').locator('xpath=../..') } },
  ],
};
