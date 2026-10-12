// The real app's screens for the Search walkthrough (tools/app_snap.js reads this; see its header). Dark mode, the
// client's bilingual front end (its Arabic interface, the MARSAD × Fusion look), sample data labelled in the film.
// The header search, as the feature catalogue films it: Ctrl K puts the cursor in it, the word typed, Enter opens the
// Search page with the results grouped by where they come from: Odoo, WhatsApp, an uploaded spreadsheet (its row, and
// the file it came from) and Google Drive.
// - home: the Home page (its hero's small kicker «طبقة القرار السيادية» hidden, its place kept: the catalogue avoids
//   'sovereign'), the header search empty;
// - focus: after Ctrl K, the header search focused and empty (the walkthrough types into it);
// - results: «فاتورة» searched: the Search page and its groups (in a 1440 x 1240 window: see the state).
const HITS = [
  { objectId: '9b2e41c7-5d8a-4f63-a1e0-2c7b9f4d8a12', objectType: 'invoice', typeName: 'فاتورة', source: 'odoo', title: 'INV-2291',
    snippet: 'متاجر الواحة · 48,750 ر.س · غير مسددة', date: '2026-09-14' },
  { objectId: '1d7f3a92-6c4e-4b18-9e2a-5f0c8b3d7e23', objectType: 'invoice', typeName: 'فاتورة', source: 'odoo', title: 'INV-2307',
    snippet: 'متاجر الواحة · 31,200 ر.س · مسددة', date: '2026-09-21' },
  { objectId: '6a3c8e15-2f9b-47d0-b5c1-8e4a2d6f9b34', objectType: 'invoice', typeName: 'فاتورة', source: 'odoo', title: 'INV-2318',
    snippet: 'متاجر الواحة · 18,640 ر.س · غير مسددة', date: '2026-09-27' },
  { objectId: '3c9a5e27-8b1f-4d64-b7a3-9e2c5f1d8b78', objectType: 'whatsapp_message', typeName: 'رسالة واتساب', source: 'whatsapp',
    title: 'طلب توريد عاجل — متاجر الواحة', snippet: '«أرسلوا الفاتورة مع الشحنة القادمة لو سمحتم»', date: '2026-09-26' },
  { objectId: '7e1a2b3c-4d5e-4f60-8a9b-0c1d2e3f4a55', objectType: 'invoice', typeName: 'فاتورة', source: 'xlsx', title: 'INV-2244',
    snippet: 'مؤسسة النخيل · 12,300 ر.س', date: '2026-08-30', sourceFileId: 'f0a1b2c3-d4e5-4f60-8a9b-0c1d2e3f4a66', sourceFileName: 'invoices_q3.xlsx' },
  { objectId: '8e4b1f63-3c7d-4925-a6e8-4f1d9c2b7a67', objectType: 'document', typeName: 'مستند', source: 'gdrive',
    title: 'عقد توريد سنوي — متاجر الواحة', snippet: '… تُصدر الفاتورة خلال خمسة أيام من التسليم …', date: '2026-09-02' },
];
const input = p => p.getByRole('textbox', { name: 'البحث في البيانات' });
const group = src => p => p.locator('.glass-panel').filter({ has: p.locator('span', { hasText: src }) }).first();
const pill = src => p => p.locator('span.rounded-full').filter({ hasText: src }).first();   // a group's source pill

module.exports = {
  viewport: { width: 1440, height: 805 }, theme: 'dark',
  routes: [
    ['GET', /\/workspaces\/w1\/objects\/search$/, HITS],
    ['GET', /\/workspaces\/w1\/insights$/, { insights: [] }],
    ['GET', /\/workspaces\/w1\/pulse\/config$/, null],
    ['GET', /\/workspaces\/w1\/organizational\/ids$/, {}],
  ],
  states: [
    { key: 'home', url: '/dashboard', run: p => p.locator('span.label-k', { hasText: 'طبقة القرار السيادية' }).evaluate(e => { e.style.visibility = 'hidden'; }),
      tag: { search: input, kbd: p => p.locator('form[role=search] kbd') } },
    { key: 'focus', run: async p => { await p.keyboard.press('Control+KeyK'); await p.waitForTimeout(300); }, tag: { search: input } },
    // a taller window (1440 x 1240) holds all four groups; the walkthrough pans down it as a scroll would
    { key: 'results', run: async p => { await p.setViewportSize({ width: 1440, height: 1240 }); await input(p).fill('فاتورة'); await input(p).press('Enter');
      await p.getByText('INV-2291').waitFor({ timeout: 120000 }); await p.locator('body').click({ position: { x: 1300, y: 760 } }); }, wait: 900,
      tag: { search: input, count: p => p.getByText(/نتيجة عبر/), odoo: group('Odoo'), wa: group('واتساب'), file: group('رفع ملف'),
        drive: group('Google Drive'), fromfile: p => p.getByText(/من الملف:/).locator('xpath=..'),
        'p-odoo': pill('Odoo'), 'p-wa': pill('واتساب'), 'p-file': pill('رفع ملف'), 'p-drive': pill('Google Drive') } },
  ],
};
