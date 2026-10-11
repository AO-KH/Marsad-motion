// The real app's screens for the Decisions walkthrough (tools/app_snap.js reads this; see its header). Dark mode, the
// client's front end of 2026-10-02 (bilingual, MARSAD × Fusion look; its Arabic interface).
// Sample data, labelled "Sample data" in the film: a recommendation a monitoring rule raised (the feature catalogue's
// lead story: a rule raises a decision, a person approves it, the passport seals it; no Odoo action: the automatic
// follow-up is switched off), and two more pending. After the approve the app's own refresh brings it back approved
// and the counts 5 / 1 / 1; «جواز القرار» then opens its passport with the approval and the green seal.
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
    oversight: { dwellMs: 8400, logicExpanded: true, rationale: 'المخزون تحت حد الطلب منذ 3 أيام', serverReceivedAt: approvedAt } },
  snapshot: { snapshotTs: D1.createdAt, evidenceRefs: [
    { type: 'internal_object', id: 'SKU-1042', metric_value: 38 }, { type: 'internal_object', id: 'SKU-1187', metric_value: 22 },
    { type: 'internal_object', id: 'SKU-2210', metric_value: 41 }] },
  ledger: [{ seq: 8, eventType: 'decision.raised', prevHash: hash('7'), entryHash: hash('8'), createdAt: D1.createdAt },
    ...(approved ? [{ seq: 9, eventType: 'decision.approved', prevHash: hash('8'), entryHash: hash('9'), createdAt: approvedAt }] : [])],
  integrity: { workspaceChainValid: true, chainLength: approved ? 9 : 8 },
});
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark',
  routes: [
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
    // the start: the Home page; the top bar's «القرارات» tab is what the walkthrough clicks. The hero's small kicker
    // «طبقة القرار السيادية» is hidden (its place kept): the feature catalogue avoids 'sovereign'; the mark stays
    { key: 'home', url: '/dashboard', run: p => p.locator('span.label-k', { hasText: 'طبقة القرار السيادية' }).evaluate(e => { e.style.visibility = 'hidden'; }),
      tag: { 'dec-tab': p => p.getByRole('link', { name: 'القرارات', exact: true }).first() } },
    // the Decisions page: the recommendation's card and its parts
    { key: 'decisions', url: '/dashboard/ontology/decisions', tag: {
      card, approve: p => p.getByRole('button', { name: 'موافقة' }).first(),
      conf: p => p.getByText('ثقة 80%').first(),
      source: p => card(p).locator('span').filter({ hasText: /^\S*\s*مراقبة$/ }).first(),
      insight: p => p.locator('div').filter({ hasText: text(D1.aiInsight) }).filter({ has: p.getByText('auto_awesome') }).last(),
      'st-pending': p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }),
      'st-approved': p => p.locator('.glass-panel').filter({ hasText: /^check_circle\d+موافق عليها$/ }),
    } },
    // «موافقة» opens the confirm dialog: the decision, «لماذا هذا القرار؟», the reason field, «تأكيد الموافقة»
    { key: 'confirm', run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), tag: {
      dialog: p => p.getByRole('dialog'), why: p => p.getByText('لماذا هذا القرار؟'),
      reason: p => p.locator('textarea'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    // the reason field clicked: focused, still empty (the walkthrough types into it)
    { key: 'focus', run: p => p.locator('textarea').click(), tag: { reason: p => p.locator('textarea') } },
    // confirmed: the app's own message, held while the snapshot is taken (the app closes it after 2 s)
    { key: 'done', run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      tag: { dialog: p => p.getByRole('dialog') } },
    // the message closed (Escape, as after the 2 s): the card is approved, the counts moved
    { key: 'after', run: async p => {
      await p.evaluate(() => { window.setTimeout = window.__st; });
      await p.keyboard.press('Escape'); await p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }); }, tag: {
      card, pass: p => card(p).getByRole('button', { name: /جواز القرار/ }),
      'approved-chip': p => card(p).locator('span').filter({ hasText: /^\S*\s*موافق$/ }).first(),
      'st-pending': p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }),
      'st-approved': p => p.locator('.glass-panel').filter({ hasText: /^check_circle\d+موافق عليها$/ }),
      'tab-pending': p => p.getByRole('button', { name: /^قيد المراجعة/ }).locator('span'),
      'tab-approved': p => p.getByRole('button', { name: /^موافق عليها/ }).locator('span'),
    } },
    // «جواز القرار»: the passport, from its top (the app centres a passport taller than the window, so its masthead
    // would sit above it; aligned to the top here, as a taller screen shows it)
    { key: 'passport', run: async p => {
      await card(p).getByRole('button', { name: /جواز القرار/ }).click(); await p.getByText('السلسلة سليمة — لا يوجد عبث').waitFor();
      await p.getByRole('dialog', { name: 'جواز القرار' }).evaluate(e => { e.parentElement.style.alignItems = 'flex-start'; }); }, tag: {
      passport: p => p.getByRole('dialog', { name: 'جواز القرار' }),
      seal: p => p.getByText('السلسلة سليمة — لا يوجد عبث').locator('xpath=../..'),
    } },
  ],
};
