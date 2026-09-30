// STARTER: the reference's capture spec (tools/app_snap.js reads it; its header has the format). Replace the sample
// data with your feature's (the calls its pages make: read the page in libs/web/<feature>/ in the client's front end,
// and run the tool once to see any call it had no data for, printed as NEW), and the states with the screens your
// walkthrough shows, in order, with a tag on everything the camera, the hand or a float visits.
// The real app's screens for the Decisions walkthrough (tools/app_snap.js reads this; see its header).
// Sample data: the three recommendations are the ones the app showed in the client's screen recording (the site kit's
// Decisions page), with the fields the real app's cards read. After the approve, the app's own refresh brings back the
// same recommendation approved, its Odoo action executed, and the counts 5 / 1 / 1.
const ago = m => new Date(Date.now() - m * 60000).toISOString();
const D1 = { id: 'd1', title: 'انخفاض مخزون فرع الرياض — يُنصح بإعادة التوريد اليوم',
  description: 'مخزون الأصناف سريعة الحركة في فرع الرياض أقل من حد إعادة الطلب لثلاثة أيام متتالية.',
  priority: 'high', status: 'pending', affectedObjectsCount: 3, confidence: 0.8, source: 'document', sourceKind: 'odoo',
  aiInsight: 'المبيعات اليومية تتجاوز معدل التوريد الحالي؛ التأخير يعرّض الفرع لنفاد المخزون.',
  remediationKind: 'odoo_create', executionMode: 'approval', remediationStatus: 'awaiting_approval', createdAt: ago(10) };
const REST = [
  { id: 'd2', title: 'ارتفاع مرتجعات فرع جدة — مراجعة سياسة الإرجاع', description: 'نسبة المرتجعات في فرع جدة أعلى من متوسط الفروع خلال الشهر الماضي.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 12, confidence: 0.72, source: 'monitor', createdAt: ago(60) },
  { id: 'd3', title: 'تباطؤ تحصيل فواتير الربع الثالث', description: 'متوسط أيام التحصيل ارتفع إلى 48 يومًا.',
    priority: 'medium', status: 'pending', affectedObjectsCount: 7, confidence: 0.68, source: 'advisor', createdAt: ago(180) },
];
let approved = false;
const counts = () => ({
  totalByStatus: [{ status: 'pending', count: approved ? 5 : 6 }, { status: 'approved', count: approved ? 1 : 0 }, { status: 'rejected', count: 1 }],
  pendingByPriority: [{ priority: 'critical', count: 0 }, { priority: 'high', count: approved ? 1 : 2 }, { priority: 'medium', count: 3 }, { priority: 'low', count: 1 }],
});
const text = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

module.exports = {
  viewport: { width: 1440, height: 805 },
  routes: [
    ['GET', /\/workspaces\/w1\/decisions$/, () => ({ decisions: [approved ? { ...D1, status: 'approved', remediationStatus: 'executed', decidedAt: new Date().toISOString() } : D1, ...REST] })],
    ['GET', /\/workspaces\/w1\/decisions\/summary$/, counts],
    ['GET', /\/decisions\/[^/]+\/precedent$/, []],
    ['POST', /\/decisions\/d1\/approve$/, () => { approved = true; return {}; }],
    ['GET', /\/workspaces\/w1\/insights$/, {}],
  ],
  states: [
    // the start: the Home page; the top bar's «القرارات» tab is what the walkthrough clicks
    { key: 'home', url: '/dashboard', tag: { 'dec-tab': p => p.getByRole('link', { name: 'القرارات', exact: true }) } },
    // the Decisions page: the recommendation's card and its parts
    { key: 'decisions', url: '/dashboard/ontology/decisions', tag: {
      card: p => p.locator('.glass-panel').filter({ hasText: text(D1.title) }),
      approve: p => p.getByRole('button', { name: 'موافقة' }),
      conf: p => p.getByText('ثقة 80%'),
      source: p => p.locator('span').filter({ hasText: /^description?\s*مستند · Odoo$/ }),
      insight: p => p.locator('div').filter({ hasText: text(D1.aiInsight) }).filter({ has: p.getByText('auto_awesome') }).last(),
      remedy: p => p.locator('div.flex').filter({ hasText: /Odoo \/ ERP/ }).filter({ hasText: /إجراء بانتظار الموافقة/ }).last(),
      'st-pending': p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }),
      'st-approved': p => p.locator('.glass-panel').filter({ hasText: /^check_circle\d+موافق عليها$/ }),
    } },
    // «موافقة» opens the confirm dialog: the decision, «لماذا هذا القرار؟», the reason field, «تأكيد الموافقة»
    { key: 'confirm', run: p => p.getByRole('button', { name: 'موافقة' }).first().click(), tag: {
      dialog: p => p.getByRole('dialog'), why: p => p.getByText('لماذا هذا القرار؟'),
      reason: p => p.locator('textarea'), ok: p => p.getByRole('button', { name: 'تأكيد الموافقة' }) } },
    // the reason field clicked: focused, still empty (the walkthrough types into it)
    { key: 'focus', run: p => p.locator('textarea').click(), tag: { reason: p => p.locator('textarea') } },
    // confirmed: the app's own message, for the 2 s before it closes itself (captured inside that window)
    { key: 'done', wait: 50, run: async p => { await p.getByRole('button', { name: 'تأكيد الموافقة' }).click(); await p.getByText('تم بنجاح').waitFor(); },
      tag: { dialog: p => p.getByRole('dialog') } },
    // the dialog has closed: the card is approved, its action executed; the counts moved
    { key: 'after', run: p => p.getByText('تم بنجاح').waitFor({ state: 'detached', timeout: 5000 }), tag: {
      card: p => p.locator('.glass-panel').filter({ hasText: text(D1.title) }),
      executed: p => p.locator('span').filter({ hasText: /^bolt\s*نُفِّذ الإجراء$/ }),
      'approved-chip': p => p.locator('span').filter({ hasText: /^موافق$/ }),
      'st-pending': p => p.locator('.glass-panel').filter({ hasText: /^schedule\d+قيد المراجعة$/ }),
      'st-approved': p => p.locator('.glass-panel').filter({ hasText: /^check_circle\d+موافق عليها$/ }),
      'tab-pending': p => p.getByRole('button', { name: /^قيد المراجعة/ }).locator('span'),
      'tab-approved': p => p.getByRole('button', { name: /^موافق عليها/ }).locator('span'),
    } },
  ],
};
