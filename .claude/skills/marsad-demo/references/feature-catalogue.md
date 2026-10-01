# The feature catalogue: what Marsad does today

On 2026-10-01 the client sent the product team's catalogue: "Every Marsad feature, ready to film"
(`Marsad_Feature_Catalogue`, checked against the live product that day). With it came the instruction "this is your
baseline on MARSAD features". Every walkthrough and every campaign film follows it.

Statuses change as features ship. Before showing anything switched off or coming, ask whether it has gone live. Ask
for the latest catalogue when a new feature arrives.

This digest is the same in the `marsad-demo` and `marsad-campaign` skills. `Videos/README.md` checks each finished
video against it.

## What Marsad is, in the catalogue's words

Marsad (مرصد) is an Arabic-first decision layer for Saudi companies, by NASL Technologies. It does five things:

1. It brings a company's Odoo records, documents, Google Drive files and WhatsApp chats into one connected map of the
   business. NASL connects the company's Odoo during onboarding.
2. It watches that map with rules the company sets.
3. It turns what it finds into decisions that carry their evidence.
4. A person approves each decision.
5. The approved decision is sealed in a tamper-evident Decision Passport.

**The team's lines:**

- 'ERP records the work. Marsad drives the decision.'
- 'Marsad watches. You decide.' (مرصد يراقب. وأنت تقرّر.)
- 'The AI drafts, a human decides.'
- The safe end lines: «مرصد يراقب. وأنت تقرّر.» and «شركتك عالم. ومرصد خريطته.»

**The audience:** Saudi SMEs without an analytics team, and larger companies with scattered data. Mainly retail,
distribution, logistics and manufacturing.

## Live features (66 of 93), by the customer's journey

| Part | Live features |
|---|---|
| Connect your data | Upload a document and Marsad turns it into records; bulk upload (many documents or a .zip); automatic filing into Department → Project → File; the Google Drive connector; spreadsheet import with AI column matching; filling in missing details on existing records; hands-off automatic import; the projects and departments file organiser; WhatsApp chat import |
| Understand it | The knowledge map explorer; search across all your data, by words and by meaning; everything about a record on one page; AI suggests links, a person confirms; your own record types and fields; fix a wrong match in one click; AI helpers on a record; change history; define relationships and link records by hand; the map of your data model; browse records and add one; retire types and fields; the advanced query builder |
| Ask | Chat with your data; approved definitions; chat raises a decision; chat drafts a monitoring rule; answers from your data, from inside your documents, and across relationships; chat adds records and links; focus on one project |
| Watch | Monitoring rules from templates; Business Pulse recommendations; the notification bell and morning summary (in-app only); custom no-code conditions; early warning ('will cross the limit in N days'); riyals at risk on overdue invoices; what-if on a rule; data readiness for recommendations |
| Decide | The Decision Passport; approve or reject with a recorded reason; the Decisions inbox; documents raise decisions; evidence with the exact source sentence; AI arguments for and against, sealed; the executive overview; past decisions on the same evidence; the executive dashboard |
| Act | The no-code action builder; run an action safely, with a run log; auto-link new records; notify team members; safe editing of actions; send events to other systems |
| Govern and secure | Each company's data walled off; personal-data protection; users, roles and permissions; sensitivity levels; invite-only access; secure Arabic sign-in; the audit log; workspaces per branch or project; your account (name, light/dark mode) |
| Everyday | The Arabic-first interface; works on phones; the home page with shortcuts |

**Lead with these seven,** one per part of the journey:

- Upload a document → records
- The knowledge map
- Chat with your data
- Monitoring rules
- The Decision Passport
- The no-code action builder
- Each company's data walled off

## Not live (1 October 2026): don't film them, don't claim them

**Switched off.** These are built, but something must be switched on first:

- Data:
  - the Odoo connector (filmable only on a connection NASL approved, saying "NASL connects your Odoo during
    onboarding");
  - Odoo file import;
  - instant Odoo updates;
  - seeing a record as it was on a past date.
- Recommendations and decisions:
  - the daily advisor and market research;
  - compare what should happen with what did;
  - approval limits by amount.
- Actions:
  - chat runs an action;
  - **automatic follow-up when a rule fires** (a draft purchase order in Odoo after approval: never promise "Marsad
    creates the purchase order");
  - developer API keys;
  - receiving events from other systems.
- Accounts:
  - teammates with their own login by email;
  - two-step login;
  - password reset by email.

**Coming.** These are not in the product:

- Data and search:
  - AI fill-in and related-record suggestions («إثراء», «البحث عن كائنات مرتبطة»);
  - advanced search syntax;
  - the next data-model upgrades.
- The assistant: the Stop button.
- Rules and recommendations:
  - telling a rule a record is fine;
  - **email notifications**;
  - rules the data must always follow;
  - learning from rejected recommendations.
- Approvals:
  - multi-step approval routes;
  - uploading company roles from a spreadsheet;
  - actions that need approval before they run.
- Everyday:
  - the billing page;
  - everyday table conveniences.

## The filming rules (the product team's, condensed)

1. **Live only.** For a live item whose note says 'rehearse', run that exact flow in production on the day.
2. **Labels.** Text in «» in the catalogue's steps is the real on-screen label. Quote the app's Arabic exactly.
3. **Truth.**
   - Show the real product UI and demo data only. No generic UI kits or mock screens.
   - Record as an admin.
   - The knowledge map is 2D: show no 3D controls on it. A stylised 3D scene is art, not the product.
4. **Data.**
   - Use a demo workspace, never a customer's, and label it sample data.
   - Keep personal data (contacts, employees) off camera.
   - Keep English Odoo type and relation names, and products named 'true', out of focus.
5. **Story.**
   - Lead with what is distinctive: a monitoring rule raises a decision with evidence, a person presses «موافقة»,
     and the passport shows the approval and the green seal «السلسلة سليمة — لا يوجد عبث».
   - Don't open with the chat box.
6. **AI scenes.**
   - Warm the model up first: a cold model shows «يجري تشغيل النموذج».
   - A chat's draft card shows only from its second message, until a pending fix ships.
7. **The Decisions page** crashes, until a pending fix ships, if the workspace holds a decision mid-approval, a
   cancelled one, or one with an unusual priority. Raise the decisions you film from rules made in the rule screen
   and from document uploads.
8. **Controls that do nothing yet:**
   - the home page's big search box (use the header search, Ctrl+K);
   - Settings' notification toggles, «تحديث كلمة المرور», «تفعيل المصادقة الثنائية» and the audit-retention choice;
   - «الترقية» and the billing page;
   - «إثراء» and «البحث عن كائنات مرتبطة»;
   - «قيمة الوحدة (ر.س)» on rules;
   - «ماذا لو…» on count rules;
   - the الاتصالات page, the Webhooks tab, the تصنيف البيانات page and the templates gallery;
   - «مفاتيح API», «سياسة الاعتماد» and «نسيت كلمة المرور؟».
9. **Words to avoid:**
   - 'real time' (the fastest rule runs hourly; Odoo refreshes nightly);
   - 'sovereign', 'stays on your soil', 'on-premise', 'air-gapped' (Marsad is a hosted cloud service);
   - 'never hallucinates';
   - 'connects your POS/WMS/CRM' (say 'connects to Odoo, including its POS, Inventory and CRM apps, and imports
     your files'), and 'connect your Odoo yourself in minutes';
   - 'email alerts', 'two-factor login';
   - 'PDPL-certified' (at most 'built with personal-data masking and an audit trail');
   - 'hides salaries', 'understands your dialect';
   - 'detects anomalies automatically';
   - 'forecasts' (except a rule's 'will cross the limit in N days');
   - 'reorders automatically';
   - 'every change is logged', 'your admin invites you by email', 'deletes your data', 'answers only from this
     project', 'a reason is required'.
10. **Claims not to repeat** from the website:
    - anomaly detection with baselines;
    - forecast answers;
    - replenishment before shelves empty (a person approves every decision);
    - native POS/WMS/CRM connectors;
    - sovereignty, on-premise hosting or PDPL compliance;
    - ready-made plans per industry;
    - the website's outcome figures.

    Show other industries' stories only as clearly labelled 'possible uses' in motion graphics. Only retail and
    supply chain have real screens today.
11. **Voice and look.**
    - Conversational Gulf Arabic, business words only, no jargon (API, webhook).
    - A dark stage with UI parts, one accent colour per moment, count-ups, cuts on the beat, and no taglines
      mid-film.
    - **Film in dark mode** (a real mode; light is the default).
12. **Timing and layout:**
    - with a voiceover, the voice's word timings are the clock;
    - hold text at least 0.4 s plus 0.3 s per Arabic word, and the end card at least 4 s;
    - one focus point, the hero 3× larger than anything else;
    - safe margins of 54 px (70 px when zooming);
    - Arabic at least 36 px at 1080 wide, at most 7 words a frame, never letter-spaced.
13. **Sound:**
    - no silence over 1.5 s;
    - one effect per visual reason;
    - the catalogue masters at −16 LUFS. This repo keeps the house −14 LUFS / −1 dBTP so the series matches; say
      so when you deliver.

## How the repo applies it

- **Walkthroughs** capture the app in dark mode (`theme: 'dark'` in `app/capture.js`). They label the data with the
  kit's `note: {en: 'Sample data', ar: 'بيانات تجريبية'}`, and show only live features.
  - The reference for this is `demos/ontology-real` (the knowledge map).
  - `demos/decisions-real` predates the catalogue: its last step promises the Odoo action after approval.
- **Campaign films:**
  - Source tiles are Odoo, documents and spreadsheets, Google Drive and WhatsApp. The famous tiles in
    `films/kit/kit.js` (SAP, Salesforce, Oracle, Shopify, QuickBooks) imply connectors Marsad doesn't have.
  - A decision ends approved and sealed in its passport, not "executed".
  - The assistant answers from the data; it does not create orders.
