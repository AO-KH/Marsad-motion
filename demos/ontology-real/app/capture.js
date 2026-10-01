// The real app's screens for the ontology walkthrough (tools/app_snap.js reads this; see its header). The knowledge map
// («الخريطة المعرفية»: its «استكشاف» and «مخطط الأنطولوجيا» tabs) and a record's page («الروابط»), in the app's dark mode
// (the feature catalogue's filming rules: film in dark mode).
// Sample data, invented for the demo workspace «مساحة العرض» (label it sample data): a retail customer «متاجر الواحة» with
// its invoices, sales orders, a supply contract and a WhatsApp chat; the invoice INV-2291 with its products, its payment
// and a delivery receipt the AI linked to it as «مقترح». The model: 8 record types and 9 link types; the record types have
// English and Arabic names (the type form asks for both), the link types Arabic names (as the link form suggests).
const T = {   // record types; the ids are picked so the app's colour hash gives each a distinct colour, and so the schema's
  // ring (sorted by how many link types touch a type, then by id) puts related types side by side
  invoice:  { id: 'ot-5-invoice-j',     apiName: 'invoice',          displayName: 'Invoice',          displayNameAr: 'فاتورة',      titleProperty: 'number' },
  customer: { id: 'ot-4-customer-1',    apiName: 'customer',         displayName: 'Customer',         displayNameAr: 'عميل',        titleProperty: 'name' },
  order:    { id: 'ot-2a-salesorder-1', apiName: 'sales_order',      displayName: 'Sales order',      displayNameAr: 'أمر بيع',     titleProperty: 'number' },
  document: { id: 'ot-2b-document-8',   apiName: 'document',         displayName: 'Document',         displayNameAr: 'مستند',       titleProperty: 'title' },
  product:  { id: 'ot-2c-product-1',    apiName: 'product',          displayName: 'Product',          displayNameAr: 'منتج',        titleProperty: 'name' },
  supplier: { id: 'ot-1a-supplier-7',   apiName: 'supplier',         displayName: 'Supplier',         displayNameAr: 'مورد',        titleProperty: 'name' },
  payment:  { id: 'ot-1b-payment-3',    apiName: 'payment',          displayName: 'Payment',          displayNameAr: 'دفعة',        titleProperty: 'ref' },
  chat:     { id: 'ot-1c-whatsapp-4',   apiName: 'whatsapp_message', displayName: 'WhatsApp message', displayNameAr: 'رسالة واتساب', titleProperty: 'summary' },
};
const L = {   // link types: source → target
  invCust:  ['lt-inv-cust',  'invoice_customer', 'تخص العميل',         'invoice',  'customer', 'many_to_one'],
  invProd:  ['lt-inv-prod',  'invoice_product',  'تتضمن المنتج',        'invoice',  'product',  'many_to_many'],
  ordCust:  ['lt-ord-cust',  'order_customer',   'طلب العميل',          'order',    'customer', 'many_to_one'],
  invOrd:   ['lt-inv-ord',   'invoice_order',    'صادرة عن أمر البيع',  'invoice',  'order',    'many_to_one'],
  payInv:   ['lt-pay-inv',   'payment_invoice',  'تسدد الفاتورة',       'payment',  'invoice',  'many_to_one'],
  prodSup:  ['lt-prod-sup',  'product_supplier', 'يورّده',              'product',  'supplier', 'many_to_one'],
  invDoc:   ['lt-inv-doc',   'invoice_document', 'مستند مرفق',          'invoice',  'document', 'one_to_many'],
  docCust:  ['lt-doc-cust',  'document_customer','يذكر العميل',         'document', 'customer', 'many_to_many'],
  chatCust: ['lt-chat-cust', 'message_customer', 'من العميل',           'chat',     'customer', 'many_to_one'],
};
const LT = Object.fromEntries(Object.entries(L).map(([k, [id, apiName, name, s, t, card]]) =>
  [k, { id, apiName, displayName: name, displayNameAr: name, sourceObjectTypeId: T[s].id, targetObjectTypeId: T[t].id, cardinality: card }]));

// records (ids look like the app's uuids; the record page shows the first 12 characters)
const day = d => `2026-09-${String(d).padStart(2, '0')}`;
const O = {
  c1:  { t: 'customer', id: '4f0c2a7e-91b3-4d5a-8c2e-7a1f3b9d6e01', p: { name: 'متاجر الواحة', city: 'الرياض', segment: 'تجزئة', vat_number: '300418250900003', customer_since: '2023' } },
  i1:  { t: 'invoice',  id: '9b2e41c7-5d8a-4f63-a1e0-2c7b9f4d8a12', p: { number: 'INV-2291', invoice_date: day(14), due_date: '2026-10-14', amount_total: 48750, status: 'غير مسددة' } },
  i2:  { t: 'invoice',  id: '1d7f3a92-6c4e-4b18-9e2a-5f0c8b3d7e23', p: { number: 'INV-2307', invoice_date: day(21), amount_total: 31200, status: 'مسددة' } },
  i3:  { t: 'invoice',  id: '6a3c8e15-2f9b-47d0-b5c1-8e4a2d6f9b34', p: { number: 'INV-2318', invoice_date: day(27), amount_total: 18640, status: 'غير مسددة' } },
  s1:  { t: 'order',    id: 'c5e19b2d-7a4f-4e86-93d2-1b6f8a0c4d45', p: { number: 'SO-1184', order_date: day(10), status: 'مكتمل' } },
  s2:  { t: 'order',    id: '2f8d6c41-9e3b-4a7f-8c15-6d2e0a9b3f56', p: { number: 'SO-1196', order_date: day(24), status: 'قيد التجهيز' } },
  d1:  { t: 'document', id: '8e4b1f63-3c7d-4925-a6e8-4f1d9c2b7a67', p: { title: 'عقد توريد سنوي — متاجر الواحة', pages: 6, uploaded: '2026-09-02' } },
  w1:  { t: 'chat',     id: '3c9a5e27-8b1f-4d64-b7a3-9e2c5f1d8b78', p: { summary: 'طلب توريد عاجل — متاجر الواحة', received: day(26) } },
  p1:  { t: 'product',  id: '5d1e8a3f-4b7c-4e92-a0d6-3f8b2c9e1a89', p: { name: 'زيت زيتون بكر — 1 لتر', sku: 'OL-1001', unit_price: 32.5 } },
  p2:  { t: 'product',  id: '7f2c9b14-1e6a-4d83-b9f5-2a7d4e8c3b90', p: { name: 'أرز بسمتي — 5 كجم', sku: 'RC-2005', unit_price: 41 } },
  p3:  { t: 'product',  id: 'a8b3d6e2-5f1c-4a7e-9d24-7c3e1b6f8d01', p: { name: 'سكر أبيض — 2 كجم', sku: 'SG-3002', unit_price: 11.75 } },
  pay: { t: 'payment',  id: 'e1c7f4a9-2d5b-4f38-8a6e-9b4d2f7c1e12', p: { ref: 'PAY-7781', amount: 20000, paid_on: day(29) } },
  r1:  { t: 'document', id: 'f3a6c2e8-9d4b-41f7-b2e5-6c8f1a3d9e23', p: { title: 'إشعار استلام رقم 0457', pages: 1, uploaded: day(28) } },
};
for (const [k, o] of Object.entries(O)) o.key = k;
const byId = Object.fromEntries(Object.values(O).map(o => [o.id, o]));
// property definitions per type (labels for the map's panel and the record page)
const PROPS = {
  customer: [['name', 'الاسم'], ['city', 'المدينة'], ['segment', 'الشريحة'], ['vat_number', 'الرقم الضريبي'], ['customer_since', 'عميل منذ']],
  invoice:  [['number', 'رقم الفاتورة'], ['invoice_date', 'تاريخ الفاتورة'], ['due_date', 'تاريخ الاستحقاق'], ['amount_total', 'الإجمالي (ر.س)', 'double'], ['status', 'الحالة']],
  order:    [['number', 'رقم الطلب'], ['order_date', 'تاريخ الطلب'], ['status', 'الحالة']],
  document: [['title', 'اسم الملف'], ['pages', 'عدد الصفحات', 'integer'], ['uploaded', 'تاريخ الرفع']],
  product:  [['name', 'الاسم'], ['sku', 'الرمز'], ['unit_price', 'سعر الوحدة (ر.س)', 'double']],
  supplier: [['name', 'الاسم']],
  payment:  [['ref', 'المرجع'], ['amount', 'المبلغ (ر.س)', 'double'], ['paid_on', 'تاريخ الدفع']],
  chat:     [['summary', 'الملخص'], ['received', 'تاريخ الاستلام']],
};
const defs = t => PROPS[t].map(([apiName, ar, dataType = 'string'], i) => ({ id: `pd-${t}-${i}`, apiName, displayName: apiName, displayNameAr: ar,
  dataType, isRequired: i === 0, isPii: false, sortOrder: i }));

let confirmed = false;   // «تأكيد الرابط» on INV-2291's receipt flips this; the map then draws the link solid
// links: [key, link type, source, target, status]
const EDGES = () => [
  ['e1', 'invCust', 'i1', 'c1', 'auto'], ['e2', 'invCust', 'i2', 'c1', 'auto'], ['e3', 'invCust', 'i3', 'c1', 'auto'],
  ['e4', 'ordCust', 's1', 'c1', 'auto'], ['e5', 'ordCust', 's2', 'c1', 'auto'], ['e6', 'docCust', 'd1', 'c1', 'confirmed'],
  ['e7', 'chatCust', 'w1', 'c1', 'auto'],
  ['e8', 'invProd', 'i1', 'p1', 'auto'], ['e9', 'invProd', 'i1', 'p2', 'auto'], ['e10', 'invProd', 'i1', 'p3', 'auto'],
  ['e11', 'invOrd', 'i1', 's1', 'auto'], ['e12', 'payInv', 'pay', 'i1', 'auto'],
  ['e13', 'invDoc', 'i1', 'r1', confirmed ? 'confirmed' : 'suggested'],
];
const eid = k => `0e${k.slice(1).padStart(3, '0')}aa1-6b2d-4c8e-9f13-2d7a5c1b8e4f`;
const node = (k, depth) => ({ id: O[k].id, objectTypeId: T[O[k].t].id, properties: O[k].p, depth });
const edge = ([k, lt, s, t, st]) => ({ id: eid(k), linkTypeId: LT[lt].id, sourceObjectId: O[s].id, targetObjectId: O[t].id,
  properties: { link_status: st }, linkStatus: st });
// one expansion: the start and its neighbours, in the order the app lays them around it (the first at the top, clockwise)
const RING = {
  c1: ['s1', 'i2', 'i1', 'i3', 'w1', 'd1', 's2'],          // INV-2291 sits to the right, where its expansion has room
  i1: ['c1', 'p1', 'p2', 'p3', 's1', 'pay', 'r1'],          // from the customer: its products, its payment and the receipt
};
function traverse(body) {
  const start = byId[body.startObjectId];
  const ring = RING[start.key] || [];
  const near = new Set([start.key, ...ring]);
  return { nodes: [node(start.key, 0), ...ring.map(k => node(k, 1))],
    edges: EDGES().filter(([, , s, t]) => near.has(s) && near.has(t) && (s === start.key || t === start.key)).map(edge), truncated: false };
}
const LINKS = objKey => {   // GET /objects/{id}/links: both directions, with the other end's properties
  const out = [], inc = [];
  for (const e of EDGES()) {
    const [, lt, s, t, st] = e, row = { ...edge(e), linkType: { apiName: LT[lt].apiName, displayName: LT[lt].displayName },
      sourceObject: { id: O[s].id, properties: O[s].p }, targetObject: { id: O[t].id, properties: O[t].p }, properties: { link_status: st } };
    if (s === objKey) out.push(row); else if (t === objKey) inc.push(row);
  }
  return { outgoing: out, incoming: inc, total: out.length + inc.length };
};
const HITS = {   // the map's search box: «الواحة» finds the customer, the contract and the chat
  'الواحة': ['c1', 'd1', 'w1'],
};
const created = '2026-09-14T09:12:00Z';
const record = o => ({ id: o.id, objectTypeId: T[o.t].id, properties: o.p, classificationLevel: 'internal', createdAt: created, updatedAt: '2026-09-29T15:40:00Z' });
const typeRow = t => ({ ...t, classificationLevel: 'internal', status: 'published' });

module.exports = {
  viewport: { width: 1440, height: 805 },
  theme: 'dark',
  routes: [
    ['GET', /\/workspaces\/w1\/object-types$/, () => ({ content: Object.values(T).map(typeRow), totalPages: 1, totalElements: 8 })],
    ['GET', /\/workspaces\/w1\/link-types$/, () => ({ content: Object.values(LT), totalPages: 1, totalElements: 9 })],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+\/properties$/, (b, p) => {
      const id = decodeURIComponent(p.split('/object-types/')[1].split('/')[0]);
      const t = Object.keys(T).find(k => T[k].id === id); return t ? defs(t) : []; }],
    ['GET', /\/workspaces\/w1\/object-types\/[^/]+$/, (b, p) => {
      const id = decodeURIComponent(p.split('/object-types/')[1].split('?')[0]);
      const t = Object.values(T).find(x => x.id === id); return t ? typeRow(t) : {}; }],
    ['GET', /\/workspaces\/w1\/objects\/search$/, (b, p) => {
      const q = decodeURIComponent(new URL('http://x' + p).searchParams.get('q') || '').trim();
      const keys = Object.entries(HITS).find(([w]) => q && w.startsWith(q.slice(0, 3)))?.[1] || [];
      return keys.map(k => ({ objectId: O[k].id, objectType: T[O[k].t].apiName, typeName: T[O[k].t].displayNameAr,
        title: O[k].p[T[O[k].t].titleProperty] })); }],
    ['POST', /\/workspaces\/w1\/graph\/traverse$/, b => traverse(b)],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/links$/, (b, p) => LINKS(byId[p.split('/objects/')[1].split('/')[0]]?.key)],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+\/(history|versions)$/, { content: [], totalPages: 0, totalElements: 0 }],
    ['GET', /\/workspaces\/w1\/objects\/[^/]+$/, (b, p) => { const o = byId[p.split('/objects/')[1].split('?')[0]]; return o ? record(o) : {}; }],
    ['POST', /\/workspaces\/w1\/links\/review$/, b => { if (b && b.decision === 'confirm') confirmed = true; return { ok: true }; }],
    ['GET', /\/workspaces\/w1\/action-types$/, { data: [], page: 0, size: 200, totalElements: 0, totalPages: 0 }],   // no published actions
  ],
  states: [
    // the start: the knowledge map's «استكشاف», empty, its search box focused (the app focuses it when the page opens)
    { key: 'explore', url: '/dashboard/ontology/knowledge-graph', tag: { search: p => p.getByRole('textbox', { name: 'ابحث عن كائن لتبدأ منه' }) } },
    // «الواحة» typed: the customer, the contract and the chat
    { key: 'search', run: p => p.getByRole('textbox', { name: 'ابحث عن كائن لتبدأ منه' }).fill('الواحة'), wait: 1200, tag: {
      search: p => p.getByRole('textbox', { name: 'ابحث عن كائن لتبدأ منه' }),
      hit: p => p.getByRole('button', { name: /متاجر الواحة\s*عميل/ }) } },
    // the customer at the centre with everything it links to; its details panel
    { key: 'customer', run: p => p.getByRole('button', { name: /متاجر الواحة\s*عميل/ }).click(), wait: 1500, tag: {
      root: p => p.locator('.react-flow__node').filter({ hasText: 'متاجر الواحة' }),
      inv: p => p.locator('.react-flow__node').filter({ hasText: 'INV-2291' }),
      panel: p => p.getByRole('complementary', { name: 'تفاصيل التحديد' }),
      legend: p => p.locator('div').filter({ hasText: /^\d+ كائن · \d+ رابط/ }).last() } },
    // INV-2291 double-clicked: its products, its payment, its order and the receipt the AI linked to it («مقترح», dashed)
    { key: 'invoice', run: p => p.locator('.react-flow__node').filter({ hasText: 'INV-2291' }).dblclick(), wait: 1500, tag: {
      inv: p => p.locator('.react-flow__node').filter({ hasText: 'INV-2291' }),
      receipt: p => p.locator('.react-flow__node').filter({ hasText: 'إشعار استلام' }),
      panel: p => p.getByRole('complementary', { name: 'تفاصيل التحديد' }),
      open: p => p.getByRole('link', { name: 'فتح الكائن' }),
      suggested: p => p.getByRole('complementary', { name: 'تفاصيل التحديد' }).locator('li').filter({ hasText: 'إشعار استلام' }) } },
    // «فتح الكائن»: the invoice's own page
    { key: 'inv-page', run: async p => { await p.getByRole('link', { name: 'فتح الكائن' }).click();
      await p.getByRole('button', { name: 'الروابط', exact: true }).waitFor({ timeout: 120000 }); }, wait: 1500, tag: {
      'links-tab': p => p.getByRole('button', { name: 'الروابط', exact: true }) } },
    // «الروابط»: the receipt's link is «مقترح», with «تأكيد الرابط» and «رفض الرابط»
    { key: 'inv-links', run: p => p.getByRole('button', { name: 'الروابط', exact: true }).click(), wait: 1200, tag: {
      row: p => p.locator('[role=link]').filter({ hasText: 'إشعار استلام' }),
      sugg: p => p.locator('[role=link]').filter({ hasText: 'إشعار استلام' }).getByText('مقترح', { exact: true }),
      ok: p => p.getByRole('button', { name: 'تأكيد الرابط' }) } },
    // confirmed: «مؤكّد»
    { key: 'inv-confirmed', run: p => p.getByRole('button', { name: 'تأكيد الرابط' }).click(), wait: 900, tag: {
      row: p => p.locator('[role=link]').filter({ hasText: 'إشعار استلام' }),
      conf: p => p.locator('[role=link]').filter({ hasText: 'إشعار استلام' }).getByText('مؤكّد', { exact: true }),
      'map-btn': p => p.getByRole('link', { name: 'عرض في الخريطة المعرفية' }) } },
    // «عرض في الخريطة المعرفية»: the invoice at the centre, the receipt's link now drawn solid («مؤكد»)
    { key: 'inv-map', run: async p => { await p.getByRole('link', { name: 'عرض في الخريطة المعرفية' }).click();
      await p.locator('.react-flow__node').filter({ hasText: 'إشعار استلام' }).waitFor({ timeout: 120000 }); }, wait: 1800, tag: {
      inv: p => p.locator('.react-flow__node').filter({ hasText: 'INV-2291' }),
      receipt: p => p.locator('.react-flow__node').filter({ hasText: 'إشعار استلام' }),
      'schema-tab': p => p.getByRole('button', { name: 'مخطط الأنطولوجيا' }) } },
    // «مخطط الأنطولوجيا»: every record type and how they link
    { key: 'schema', run: p => p.getByRole('button', { name: 'مخطط الأنطولوجيا' }).click(), wait: 1500, tag: {
      'type-inv': p => p.locator('.react-flow__node-type').filter({ hasText: 'فاتورة' }) } },
    // «فاتورة» clicked: its links light up; outgoing and incoming
    { key: 'schema-inv', run: p => p.locator('.react-flow__node-type').filter({ hasText: 'فاتورة' }).first().click(), wait: 1200, tag: {
      'type-inv': p => p.locator('.react-flow__node-type').filter({ hasText: 'فاتورة' }),
      panel: p => p.getByRole('complementary', { name: 'تفاصيل النوع' }) } },
  ],
};
