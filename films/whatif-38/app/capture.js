// The real app's screens for the What-if film (tools/app_shot.js reads this; see its header): the monitoring rules page
// («قواعد المراقبة») and its «ماذا لو…» panel, in the app's dark mode (the feature catalogue: film in dark mode).
// Sample data, invented for the demo workspace «مساحة العرض» (labelled "Sample data" in the film): four rules; the overdue-
// invoices rule sums the amount still due (amount_residual, the Odoo field the template binds), so «ماذا لو…» is open on
// it and greyed out on the count rules (low stock, slow movers), as in the app. The projection is shaped like the
// server's: the scenario named after the request, hypothetical, today's real result as the baseline.
const RULES = [
  { id: 'm1', name: 'فواتير معلّقة — أكثر من 30 يومًا', monitorType: 'overdue_invoice', frequency: 'daily', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-10-01T05:00:00Z', lastRunStatus: 'clean', createdAt: '2026-08-12T09:00:00Z',
    config: { spec: { metric: { op: 'sum', property: 'amount_residual' } } } },
  { id: 'm2', name: 'مخزون منخفض — فرع الرياض', monitorType: 'low_stock', frequency: 'hourly', isActive: true,
    targetRole: 'editor', lastRunAt: '2026-10-01T08:00:00Z', lastRunStatus: 'fired', createdAt: '2026-08-14T09:00:00Z',
    config: { spec: { metric: { op: 'count' } } } },
  { id: 'm3', name: 'أصناف راكدة', monitorType: 'no_restock', frequency: 'weekly', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-09-28T06:00:00Z', lastRunStatus: 'clean', createdAt: '2026-08-20T09:00:00Z',
    config: { spec: { metric: { op: 'count' } } } },
  { id: 'm4', name: 'متوسط قيمة أوامر البيع', monitorType: 'custom', frequency: 'daily', isActive: true,
    targetRole: 'workspace_admin', lastRunAt: '2026-10-01T05:00:00Z', lastRunStatus: 'clean', createdAt: '2026-09-02T09:00:00Z',
    config: { spec: { metric: { op: 'avg', property: 'amount_total' } } } },
];
const VALUE = '25000';

module.exports = {
  viewport: { width: 1440, height: 805 },
  theme: 'dark',
  dpr: 5,                                     // close-ups in a 4K film need about 5 px per CSS px
  routes: [
    ['GET', /\/workspaces\/w1\/monitors\/templates$/, { templates: [] }],
    ['GET', /\/workspaces\/w1\/monitors$/, { monitors: RULES }],
    ['POST', /\/workspaces\/w1\/monitors\/m1\/scenario$/, req => ({
      hypothetical: true, scenario: req && req.name ? req.name : `what if amount_residual were ${VALUE}`,
      overrides: req && req.overrides ? req.overrides : { amount_residual: VALUE },
      status: 'would_fire', affectedCount: 14, baseline: { status: 'clean', affectedCount: 0 } })],
  ],
  states: [
    { key: 'monitors', url: '/dashboard/ontology/decisions/monitors', wait: page => page.getByText('فواتير معلّقة — أكثر من 30 يومًا').waitFor(),
      crops: { r1: page => page.locator('tbody tr').nth(0), r2: page => page.locator('tbody tr').nth(1),
               r3: page => page.locator('tbody tr').nth(2), r4: page => page.locator('tbody tr').nth(3),
               flask: page => page.getByRole('button', { name: /ماذا لو اختلفت قيمة/ }).first(),
               title: page => page.getByRole('heading', { name: 'قواعد المراقبة' }) } },
    { key: 'whatif', run: async page => { await page.getByRole('button', { name: /ماذا لو اختلفت قيمة/ }).first().click();
        await page.locator('#monitors-assumed-value').waitFor(); },
      crops: { dialog: page => page.locator('#monitors-assumed-value').locator('xpath=ancestor::div[contains(@class,"bg-card")][1]'),
               field: page => page.locator('#monitors-assumed-value'),
               note: page => page.getByText('لا يُحفظ شيء', { exact: false }).first(),
               calc: page => page.getByRole('button', { name: 'احسب' }) } },
    ...[1, 2, 3, 4, 5].map(n => ({ key: `type${n}`, run: async page => { await page.locator('#monitors-assumed-value').fill(VALUE.slice(0, n)); },
      crops: { dialog: page => page.locator('#monitors-assumed-value').locator('xpath=ancestor::div[contains(@class,"bg-card")][1]') } })),
    { key: 'result', run: async page => { await page.getByRole('button', { name: 'احسب' }).click(); await page.getByText('وفق هذا الافتراض').waitFor(); },
      crops: { dialog: page => page.locator('#monitors-assumed-value').locator('xpath=ancestor::div[contains(@class,"bg-card")][1]'),
               today: page => page.getByText('اليوم (فعلي)').locator('xpath=..'),
               assumed: page => page.getByText('وفق هذا الافتراض').locator('xpath=..'),
               badge: page => page.getByText('افتراضي — غير مسجَّل'),
               cards: page => page.getByText('وفق هذا الافتراض').locator('xpath=../..'),
               note: page => page.getByText('لا يُحفظ شيء', { exact: false }).first() } },
  ],
};
