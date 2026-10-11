// The real app's screens for the Business Pulse campaign film (tools/app_shot.js reads this; see its header). Dark mode,
// the client's bilingual front end (its Arabic interface, the MARSAD × Fusion look), sample data (labelled in the film).
// - before: «نبض الأعمال» with no recommendations yet: «لا توجد توصيات بعد» and the «توليد توصيات» button;
// - list: three recommendations, one per recipe the film names (your products, your branches, your stock), as the page
//   lists them once they are generated (loaded fresh, so without the green «تم توليد…» line the app shows right after
//   generating);
// - bare: the cards with their recipe and «مبني على بياناتك» chips hidden (their places kept): the slots a chip leaves
//   when the film lifts it out of its card;
// - slots: the same page with the three cards hidden, their places kept: the film flies the cards into it.
// The daily advisor is switched off in the feature catalogue, so pulse/config answers null and the page hides its panel.
// The repo keeps the PNGs the film uses and shots.json; `node tools/app_shot.js pulse-30` (with the client's front end
// running) writes them again.
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const INS = [
  { id: 'i1', recipe: 'top_bottom_performers', title: 'أعلى 5 منتجات تحقق 38% من صافي المبيعات هذا الشهر', status: 'new', confidence: 'high', createdAt: ago(2) },
  { id: 'i2', recipe: 'store_comparison', title: 'مبيعات فرع الرياض أقل من متوسط الفروع بـ 8.2% هذا الأسبوع', status: 'new', confidence: 'high', createdAt: ago(2) },
  { id: 'i3', recipe: 'slow_movers', title: '12 صنفًا لم يُبع منذ 60 يومًا في مستودع جدة', status: 'new', confidence: 'medium', createdAt: ago(2) },
];
const LABEL = ['أعلى وأضعف المنتجات', 'مقارنة الفروع', 'المنتجات بطيئة الحركة'];
let listed = false;
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const card = i => p => p.locator('.glass-panel').filter({ hasText: text(INS[i].title) });
const cat = i => p => card(i)(p).locator('span').filter({ hasText: text(LABEL[i]) }).first();
const ok = i => p => card(i)(p).locator('span').filter({ hasText: 'مبني على بياناتك' }).first();
const btn = p => p.getByRole('button', { name: 'توليد توصيات' });

module.exports = {
  viewport: { width: 1440, height: 880 }, theme: 'dark', dpr: 5,   // 880 tall: the third card ends at 854
  routes: [
    ['GET', /\/workspaces\/w1\/insights$/, () => ({ insights: listed ? INS : [] })],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
    ['GET', /\/workspaces\/w1\/decisions$/, { decisions: [] }],
  ],
  states: [
    { key: 'before', url: '/dashboard/insights', wait: p => p.getByText('لا توجد توصيات بعد').waitFor(), crops: {
      btn, empty: p => p.locator('.glass-panel').filter({ hasText: 'لا توجد توصيات بعد' }) } },
    { key: 'list', run: async p => { listed = true; await p.reload({ waitUntil: 'networkidle' }); await card(2)(p).waitFor(); }, crops: {
      btn, r1: card(0), r2: card(1), r3: card(2), cat1: cat(0), cat2: cat(1), cat3: cat(2), ok1: ok(0), ok2: ok(1), ok3: ok(2) } },
    { key: 'bare', run: p => p.evaluate(ts => { for (const t of ts) {
      const c = [...document.querySelectorAll('.glass-panel')].find(e => e.textContent.includes(t) &&
        ![...e.querySelectorAll('.glass-panel')].some(x => x.textContent.includes(t)));
      [...c.querySelectorAll('span.inline-flex')].slice(0, 2).forEach(e => { e.style.visibility = 'hidden'; }); } },
      INS.map(i => i.title)), crops: { b1: card(0), b2: card(1), b3: card(2) } },
    { key: 'slots', run: p => p.evaluate(ts => { for (const t of ts)
      [...document.querySelectorAll('.glass-panel')].filter(e => e.textContent.includes(t) &&
        ![...e.querySelectorAll('.glass-panel')].some(c => c.textContent.includes(t))).forEach(e => { e.style.visibility = 'hidden'; }); },
      INS.map(i => i.title)), crops: {} },
  ],
};
