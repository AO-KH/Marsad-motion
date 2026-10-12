// The real app's screens for the Business Pulse short demo (tools/app_snap.js reads this; see its header). Dark mode,
// the client's bilingual front end (its Arabic interface, the MARSAD × Fusion look), sample data labelled in the demo.
// - before: «نبض الأعمال» with no recommendations yet («لا توجد توصيات بعد») and its «توليد توصيات» button;
// - list: the three recommendations, as the page lists them once generated (loaded fresh: the green «تم توليد…» line the
//   app shows right after generating is left out);
// - open: the first one opened: its text, with the workspace's numbers it was built on (a 1440 x 1240 window). (Its
//   «عرض الأرقام (الأساس)» block sets Arabic labels in a monospace font that breaks their joining: left out.)
// The daily advisor is switched off in the feature catalogue, so pulse/config answers null and the page hides its panel.
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const INS = [
  { id: 'i1', recipe: 'store_comparison', title: 'مبيعات فرع الرياض أقل من متوسط الفروع بـ 8.2% هذا الأسبوع', status: 'new', confidence: 'high', createdAt: ago(1) },
  { id: 'i2', recipe: 'slow_movers', title: '12 صنفًا لم يُبع منذ 60 يومًا في مستودع جدة', status: 'new', confidence: 'medium', createdAt: ago(1) },
  { id: 'i3', recipe: 'top_bottom_performers', title: 'أعلى 5 منتجات تحقق 38% من صافي المبيعات هذا الشهر', status: 'new', confidence: 'high', createdAt: ago(1) },
];
const I1 = { ...INS[0],
  body: 'صافي مبيعات فرع الرياض هذا الأسبوع 184,300 ر.س، أقل بـ 8.2% من متوسط الفروع (200,800 ر.س). يتركّز الفرق في ثلاثة أصناف سريعة الحركة نقص مخزونها منذ الثلاثاء.\n' +
    'اقتراح للنقاش: راجع توفّر هذه الأصناف في الفرع وموعد التوريد القادم.',
  evidence: 'صافي مبيعات الأسبوع 39 (ر.س):\nالرياض: 184,300\nجدة: 212,450\nالدمام: 198,900\nالخبر: 207,550\nمتوسط الفروع: 200,800\nفرق الرياض عن المتوسط: -8.2%' };
let listed = false;
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = i => p => p.locator('.glass-panel').filter({ hasText: text(INS[i].title) });

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark',
  routes: [
    ['GET', /\/workspaces\/w1\/insights$/, () => ({ insights: listed ? INS : [] })],
    ['GET', /\/workspaces\/w1\/insights\/i1$/, I1],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
    ['GET', /\/workspaces\/w1\/decisions$/, { decisions: [] }],
  ],
  states: [
    { key: 'before', url: '/dashboard/insights', wait: 900, tag: {
      btn: p => p.getByRole('button', { name: 'توليد توصيات' }), empty: p => p.locator('.glass-panel').filter({ hasText: 'لا توجد توصيات بعد' }).first() } },
    { key: 'list', run: async p => { listed = true; await p.reload({ waitUntil: 'networkidle' }); await card(2)(p).waitFor(); }, wait: 900, tag: {
      btn: p => p.getByRole('button', { name: 'توليد توصيات' }), r1: card(0), r2: card(1), r3: card(2),
      ok1: p => card(0)(p).locator('span').filter({ hasText: 'مبني على بياناتك' }).first(),
      toggle: p => card(0)(p).getByRole('button').first() } },
    // opened, in a taller window (1440 x 1240: the opened card and its numbers fit; the demo's view pans as a scroll would)
    { key: 'open', run: async p => { await p.setViewportSize({ width: 1440, height: 1240 }); await card(0)(p).getByRole('button').first().click();
      await p.getByText(/^صافي مبيعات فرع الرياض/).waitFor(); await p.evaluate(() => document.activeElement.blur()); }, wait: 900, tag: {   // no focus ring
      r1: card(0), body: p => p.getByText(/^صافي مبيعات فرع الرياض/), figs: p => p.getByRole('button', { name: /عرض الأرقام/ }),
      ok1: p => card(0)(p).locator('span').filter({ hasText: 'مبني على بياناتك' }).first() } },
  ],
};
