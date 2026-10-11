// The real app's screens for the Knowledge Map campaign film (tools/app_shot.js reads this; see its header): the three
// pages that stand up on the drawing's top tier, from the client's bilingual front end (its Arabic interface, dark mode,
// the MARSAD × Fusion look) with sample data (labelled in the film). Each page twice: as it is (its parts are cut from
// it: the crops' boxes), and with those parts hidden, their places kept (the slab's face, so a part can float out of it).
// - pulse: Business Pulse with three recommendations, scrolled 60 px so all three fit (the daily advisor is switched off
//   in the feature catalogue: pulse/config answers null and the page hides its panel);
// - decisions: the counters and a recommendation a monitoring rule raised (nothing runs after an approval: the catalogue);
// - chat: the assistant, ready for a question, with its four suggestions.
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
];
const counts = { totalByStatus: [{ status: 'pending', count: 6 }, { status: 'approved', count: 0 }, { status: 'rejected', count: 1 }],
  pendingByPriority: [{ priority: 'critical', count: 0 }, { priority: 'high', count: 2 }, { priority: 'medium', count: 3 }, { priority: 'low', count: 1 }] };
const CONVS = [['c1', 'أداء الفروع في سبتمبر', 60 * 20], ['c2', 'الأصناف الأكثر مبيعًا في جدة', 60 * 46], ['c3', 'متابعة الذمم المتأخرة', 60 * 70]]
  .map(([id, title, m]) => ({ id, title, createdAt: ago(m), updatedAt: ago(m), _count: { messages: 4 } }));
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const rec = i => p => p.locator('.glass-panel').filter({ hasText: text(INS[i].title) });
const btn = p => p.getByRole('button', { name: 'توليد توصيات' });
const card = p => p.locator('.glass-panel').filter({ hasText: text(D1.title) });
const stat = re => p => p.locator('.glass-panel').filter({ hasText: re });
const STATS = [/^schedule\d+قيد المراجعة$/, /^check_circle\d+موافق عليها$/, /^cancel\d+مرفوضة$/, /^priority_high\d+حرجة$/];
const field = p => p.getByPlaceholder('اسأل مرصد عن أي شيء بخصوص بياناتك…');
const SUGG = ['استكشاف أنواع الكائنات', 'تلخيص الكائنات', 'افهم نموذج البيانات', 'كائنات مرتبطة'];
const sugg = i => p => p.getByRole('button', { name: new RegExp(SUGG[i]) }).first();
// hide elements (their places kept), for the slab's face
const hide = locs => async p => { for (const l of locs) await l(p).first().evaluate(e => { e.style.visibility = 'hidden'; }); };

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark', dpr: 3,
  routes: [
    ['GET', /\/workspaces\/w1\/insights$/, { insights: INS }],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/decisions$/, { decisions: [D1, ...REST] }],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
    ['GET', /\/workspaces\/w1\/objects$/, { data: [], page: 0, size: 200, totalElements: 0, totalPages: 0 }],
    ['GET', /\/workspaces\/w1\/ai\/conversations$/, { conversations: CONVS }],
  ],
  states: [
    { key: 'pulse', url: '/dashboard/insights', run: p => p.evaluate(() => window.scrollTo(0, 60)), wait: 900,
      crops: { btn, r1: rec(0), r2: rec(1), r3: rec(2) } },
    { key: 'pulse-base', run: hide([btn, rec(0), rec(1), rec(2)]), crops: {} },
    { key: 'decisions', url: '/dashboard/ontology/decisions', wait: p => card(p).waitFor(), crops: {
      card, s1: stat(STATS[0]), s2: stat(STATS[1]), s3: stat(STATS[2]), s4: stat(STATS[3]) } },
    { key: 'decisions-base', run: hide([card, ...STATS.map(stat)]), crops: {} },
    { key: 'chat', url: '/dashboard/ontology/ai-chat', wait: p => p.getByRole('heading', { name: 'مساعد مرصد الذكي', level: 2 }).waitFor(), crops: {
      field, t1: sugg(0), t2: sugg(1), t3: sugg(2), t4: sugg(3), head: p => p.getByRole('heading', { name: 'مساعد مرصد الذكي', level: 2 }) } },
    { key: 'chat-base', run: hide([field, sugg(0), sugg(1), sugg(2), sugg(3)]), crops: {} },
  ],
};
