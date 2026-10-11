// The real app's screens for the 30 s brand ad (tools/app_snap.js reads this; see its header): the window shows the
// client's front end (its Arabic interface, dark mode, the MARSAD × Fusion look) with sample data, labelled in the film.
// - pulse: Business Pulse «نبض الأعمال» with three recommendations from the workspace's numbers (the daily advisor is
//   switched off in the feature catalogue, so pulse/config answers null and the page hides its panel);
// - decisions: a recommendation a monitoring rule raised («مراقبة»), pending, and two more; the counts 6 / 0 / 1;
// - confirm, done, after: «موافقة» → the confirm dialog → «تأكيد الموافقة» → the app's «تم بنجاح» → the card approved and
//   the counts 5 / 1 / 1. No action runs after the approval (the automatic follow-up is switched off in the catalogue).
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const INS = [
  { id: 'i1', recipe: 'top_bottom_performers', title: 'أعلى 5 منتجات تحقق 38% من صافي المبيعات هذا الشهر', status: 'new', confidence: 'high', createdAt: ago(25) },
  { id: 'i2', recipe: 'store_comparison', title: 'مبيعات فرع الرياض أقل من متوسط الفروع بـ 8.2% هذا الأسبوع', status: 'new', confidence: 'high', createdAt: ago(25) },
  { id: 'i3', recipe: 'slow_movers', title: '12 صنفًا لم يُبع منذ 60 يومًا في مستودع جدة', status: 'new', confidence: 'medium', createdAt: ago(26) },
];
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
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });
const rec = i => p => p.locator('.glass-panel').filter({ hasText: text(INS[i].title) });
const logo = p => p.locator('a[aria-label="مرصد — الرئيسية"] img').first();
const stP = p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ });
const stA = p => p.locator('.glass-panel').filter({ hasText: /^check_circle\d+موافق عليها$/ });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark',
  routes: [
    ['GET', /\/workspaces\/w1\/insights$/, { insights: INS }],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/decisions$/, () => ({ decisions: [approved ? { ...D1, status: 'approved', decidedAt: approvedAt } : D1, ...REST] })],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['POST', new RegExp(`/decisions/${D1.id}/approve$`), () => { approved = true; approvedAt = new Date().toISOString(); return {}; }],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
  ],
  states: [
    // scrolled 60 px so the third recommendation fits the window (the header stays at the top)
    { key: 'pulse', url: '/dashboard/insights', run: p => p.evaluate(() => window.scrollTo(0, 60)), wait: 900,
      tag: { logo, r1: rec(0), r2: rec(1), r3: rec(2) } },
    { key: 'decisions', url: '/dashboard/ontology/decisions', tag: { logo, card,
      approve: p => p.getByRole('button', { name: 'موافقة' }).first(),
      source: p => card(p).locator('span').filter({ hasText: /^\S*\s*مراقبة$/ }).first(), 'st-pending': stP, 'st-approved': stA } },
    { key: 'confirm', run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), tag: {
      dialog: p => p.getByRole('dialog'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    { key: 'done', run: async p => {
      await p.evaluate(() => { window.__st = window.setTimeout; window.setTimeout = (f, ms, ...a) => ms === 2000 ? 0 : window.__st(f, ms, ...a); });
      await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      tag: { dialog: p => p.getByRole('dialog') } },
    { key: 'after', run: async p => {
      await p.evaluate(() => { window.setTimeout = window.__st; });
      await p.keyboard.press('Escape'); await p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }); }, tag: {
      card, 'st-pending': stP, 'st-approved': stA,
      'approved-chip': p => card(p).locator('span').filter({ hasText: /^\S*\s*موافق$/ }).first() } },
  ],
};
