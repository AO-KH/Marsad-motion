// The real app's screens for the brand film (tools/app_shot.js reads this; see its header). Dark mode, sample data.
// - Decisions: a recommendation raised by a monitoring rule (no Odoo action: the automatic follow-up is switched off in
//   the feature catalogue), approved with «موافقة» → «تأكيد الموافقة» → «تم بنجاح»; the counts move 6/0 → 5/1; then its
//   Decision Passport, with the approval in its ledger and the green seal «السلسلة سليمة — لا يوجد عبث».
// - Business Pulse «نبض الأعمال»: four recommendations (the daily advisor is switched off in the catalogue, so
//   pulse/config answers null and the page hides its panel); the first opened, with its numbers.
// - The assistant «مساعد مرصد الذكي»: the question typed, «المساعد يفكّر…», the answer with its sources. The answer comes
//   back without a conversationId, so the page keeps the two bubbles (it would reload the conversation otherwise).
// The success message closes itself after 2 s, so the `done` state holds that timer back while the still is taken.
// The repo keeps the PNGs the film uses (film.js loads them) and shots.json; `node tools/app_shot.js style-jupiter`
// (with the client's front end running) writes them again, with the full pages and the small crops beside them.
const crypto = require('crypto');
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const D1 = { id: '7f3c2a91-5b6e-4d0a-9c1f-2e8b4a6d3c70', title: 'انخفاض مخزون فرع الرياض — ثلاثة أصناف تحت حد إعادة الطلب',
  description: 'قاعدة المراقبة «مخزون منخفض — فرع الرياض» رصدت ثلاثة أصناف سريعة الحركة تحت حد إعادة الطلب لثلاثة أيام متتالية.',
  priority: 'high', status: 'pending', affectedObjectsCount: 3, confidence: 0.8, source: 'monitor',
  aiInsight: 'المبيعات اليومية لهذه الأصناف تتجاوز معدل التوريد الحالي؛ التأخير يعرّض الفرع لنفاد المخزون.', createdAt: ago(10) };
const REST = [
  { id: 'd2', title: 'ارتفاع مرتجعات فرع جدة — مراجعة سياسة الإرجاع', description: 'نسبة المرتجعات في فرع جدة أعلى من متوسط الفروع خلال الشهر الماضي.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 12, confidence: 0.72, source: 'monitor', createdAt: ago(60) },
  { id: 'd3', title: 'تباطؤ تحصيل فواتير الربع الثالث', description: 'متوسط أيام التحصيل ارتفع إلى 48 يومًا.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 7, confidence: 0.68, source: 'monitor', createdAt: ago(180) },
];
let approved = false, approvedAt = null;
const counts = () => ({
  totalByStatus: [{ status: 'pending', count: approved ? 5 : 6 }, { status: 'approved', count: approved ? 1 : 0 }, { status: 'rejected', count: 1 }],
  pendingByPriority: [{ priority: 'critical', count: 0 }, { priority: 'high', count: approved ? 1 : 2 }, { priority: 'medium', count: 3 }, { priority: 'low', count: 1 }],
});
// the passport: the workspace's chain holds 7 raised decisions, 1 rejection and this approval (9 links)
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const passport = () => ({
  decision: { id: D1.id, title: D1.title, status: approved ? 'approved' : 'pending', priority: D1.priority },
  provenance: { correlationId: 'corr-5d1e0a7b-91c4', snapshotTs: D1.createdAt, modelInvocationId: null,
    oversight: { dwellMs: 8400, logicExpanded: true, rationale: 'الأصناف الثلاثة تنفد قبل موعد التوريد القادم.', serverReceivedAt: approvedAt } },
  snapshot: { snapshotTs: D1.createdAt, evidenceRefs: [
    { type: 'internal_object', id: 'SKU-1042', metric_value: 38 },
    { type: 'internal_object', id: 'SKU-1187', metric_value: 22 },
    { type: 'internal_object', id: 'SKU-2210', metric_value: 41 }] },
  ledger: [{ seq: 8, eventType: 'decision.raised', prevHash: hash('7'), entryHash: hash('8'), createdAt: D1.createdAt },
    ...(approved ? [{ seq: 9, eventType: 'decision.approved', prevHash: hash('8'), entryHash: hash('9'), createdAt: approvedAt }] : [])],
  integrity: { workspaceChainValid: true, chainLength: approved ? 9 : 8 },
});
// Business Pulse: one recommendation per recipe the sample data fits; the first opened with its body and numbers
const INS = [
  { id: 'i1', recipe: 'store_comparison', title: 'مبيعات فرع الرياض أقل من متوسط الفروع بـ 8.2% هذا الأسبوع', status: 'new', confidence: 'high', createdAt: ago(25) },
  { id: 'i2', recipe: 'slow_movers', title: '12 صنفًا لم يُبع منذ 60 يومًا في مستودع جدة', status: 'new', confidence: 'medium', createdAt: ago(25) },
  { id: 'i3', recipe: 'receivables_aging', title: '31% من الذمم المدينة تجاوزت 90 يومًا', status: 'new', confidence: 'medium', createdAt: ago(26) },
  { id: 'i4', recipe: 'customer_concentration', title: 'أكبر ثلاثة عملاء يمثّلون 46% من صافي المبيعات', status: 'acknowledged', confidence: 'high', createdAt: ago(60 * 26) },
];
const I1 = { ...INS[0],
  body: 'صافي مبيعات فرع الرياض هذا الأسبوع 184,300 ر.س، أقل بـ 8.2% من متوسط الفروع (200,800 ر.س). يتركّز الفرق في ثلاثة أصناف سريعة الحركة نقص مخزونها منذ الثلاثاء.\n' +
    'اقتراح للنقاش: راجع توفّر هذه الأصناف في الفرع وموعد التوريد القادم.',
  evidence: 'صافي مبيعات الأسبوع 39 (ر.س):\nالرياض: 184,300\nجدة: 212,450\nالدمام: 198,900\nالخبر: 207,550\nمتوسط الفروع: 200,800\nفرق الرياض عن المتوسط: -8.2%' };
// the assistant
const Q = 'لماذا انخفضت مبيعات الرياض هذا الأسبوع؟';
const CHAT = { answer: 'انخفضت مبيعات فرع الرياض **11.4%** عن الأسبوع الماضي، والسبب الأبرز نقص مخزون ثلاثة أصناف سريعة الحركة في الفرع منذ الثلاثاء.',
  sources: [{ objectId: 'o1', objectTypeApiName: 'branch', objectTypeDisplayName: 'فرع', title: 'فرع الرياض' },
    { objectId: 'o2', objectTypeApiName: 'sales_report', objectTypeDisplayName: 'تقرير مبيعات', title: 'مبيعات الأسبوع 39' },
    { objectId: 'o3', objectTypeApiName: 'stock_report', objectTypeDisplayName: 'تقرير مخزون', title: 'مخزون فرع الرياض' }], tokensUsed: 0 };
// (a source's title is cut to one line with overflow hidden, which clips the dots under a final «ي»: «بسمتي» read «بسمتى»)
const CONVS = [['c1', 'أداء الفروع في سبتمبر', 60 * 20], ['c2', 'الأصناف الأكثر مبيعًا في جدة', 60 * 46], ['c3', 'متابعة الذمم المتأخرة', 60 * 70]]
  .map(([id, title, m]) => ({ id, title, createdAt: ago(m), updatedAt: ago(m), _count: { messages: 4 } }));
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });
const stats = p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }).locator('xpath=..');
const pulseCard = p => p.locator('.glass-panel').filter({ hasText: text(INS[0].title) });
const field = p => p.getByPlaceholder('اسأل مرصد عن أي شيء بخصوص بياناتك…');

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark', dpr: 5,
  routes: [
    ['GET', /\/workspaces\/w1\/decisions$/, () => ({ decisions: [approved ? { ...D1, status: 'approved', decidedAt: approvedAt } : D1, ...REST] })],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['POST', new RegExp(`/decisions/${D1.id}/approve$`), () => { approved = true; approvedAt = new Date().toISOString(); return {}; }],
    ['GET', new RegExp(`/decisions/${D1.id}/passport$`), passport],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
    ['GET', /\/workspaces\/w1\/objects$/, { data: [], page: 0, size: 200, totalElements: 0, totalPages: 0 }],   // the chat's project picker
    ['GET', /\/workspaces\/w1\/insights$/, { insights: INS }],
    ['GET', /\/workspaces\/w1\/insights\/i1$/, I1],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/ai\/conversations$/, { conversations: CONVS }],
    ['POST', /\/workspaces\/w1\/ai\/chat$/, CHAT],
  ],
  states: [
    { key: 'decisions', url: '/dashboard/ontology/decisions', crops: {
      card, approve: p => p.getByRole('button', { name: 'موافقة' }).first(), stats } },
    { key: 'confirm', run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), crops: {
      dialog: p => p.getByRole('dialog'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    { key: 'done', run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      crops: { dialog: p => p.getByRole('dialog') } },
    { key: 'after', run: async p => {
      await p.evaluate(() => { window.setTimeout = window.__st; });
      await p.keyboard.press('Escape'); await p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }); },
      crops: { card, stats, pass: p => card(p).getByRole('button', { name: /جواز القرار/ }) } },
    { key: 'pulse', url: '/dashboard/insights', wait: p => pulseCard(p).waitFor(), crops: {
      card: pulseCard, pill: p => pulseCard(p).locator('span').filter({ hasText: 'مبني على بياناتك' }).first() } },
    { key: 'pulse-open', run: async p => {            // opened (its numbers are in the text), scrolled to the middle
      await pulseCard(p).getByRole('button').first().click(); await p.getByText(/^صافي مبيعات فرع الرياض/).waitFor();
      await pulseCard(p).evaluate(e => e.scrollIntoView({ block: 'center' })); }, crops: {
        card: pulseCard, pill: p => pulseCard(p).locator('span').filter({ hasText: 'مبني على بياناتك' }).first(),
        body: p => p.getByText(/^صافي مبيعات فرع الرياض/) } },
    { key: 'chat', url: '/dashboard/ontology/ai-chat', wait: p => p.getByRole('heading', { name: 'مساعد مرصد الذكي', level: 2 }).waitFor(),
      crops: { thread: p => p.locator('section.glass-panel'), field, send: p => p.getByRole('button', { name: 'إرسال' }) } },
    // focused with a space typed: the field as it is while typing, without the placeholder (the film types over it)
    { key: 'chat-space', run: async p => { await field(p).click(); await field(p).fill(' '); }, crops: { thread: p => p.locator('section.glass-panel'), field } },
    { key: 'chat-typed', run: p => field(p).fill(Q), crops: { field, send: p => p.getByRole('button', { name: 'إرسال' }) } },
    { key: 'chat-thinking', run: async p => {
      // held back 6 s, so «المساعد يفكّر…» shows (the page says «يجري تشغيل النموذج» only after 15 s)
      await p.route(/localhost:8085\/api\/v1\/workspaces\/w1\/ai\/chat$/, async r => {
        if (r.request().method() !== 'POST') return r.fallback();
        await new Promise(res => setTimeout(res, 6000));
        await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(CHAT) }); });
      await p.getByRole('button', { name: 'إرسال' }).click(); await p.getByText('المساعد يفكّر…').waitFor(); },
      crops: { thread: p => p.locator('section.glass-panel'), ask: p => p.getByText(Q, { exact: true }).locator('xpath=..'),
        think: p => p.getByText('المساعد يفكّر…').locator('xpath=../..') } },
    { key: 'chat-answer', wait: p => p.getByText('المصادر', { exact: true }).waitFor({ timeout: 15000 }), crops: {
      thread: p => p.locator('section.glass-panel'), ask: p => p.getByText(Q, { exact: true }).locator('xpath=..'),
      answer: p => p.getByText('المصادر', { exact: true }).locator('xpath=../..'), sources: p => p.getByText('المصادر', { exact: true }).locator('xpath=..') } },
    // last: the passport is taller than the 805 px window and the app centres it, so its masthead would sit above the
    // top; a taller window (1440 x 1240) shows the whole of it, as a bigger screen would
    { key: 'passport', url: '/dashboard/ontology/decisions', run: async p => {
      await p.setViewportSize({ width: 1440, height: 1240 }); await card(p).getByRole('button', { name: /جواز القرار/ }).click(); },
      wait: p => p.getByText('السلسلة سليمة — لا يوجد عبث').waitFor(), crops: {
        modal: p => p.getByRole('dialog', { name: 'جواز القرار' }),
        seal: p => p.getByText('السلسلة سليمة — لا يوجد عبث').locator('xpath=../..') } },
  ],
};
