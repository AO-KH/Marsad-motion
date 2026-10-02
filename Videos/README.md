# Marsad videos

Every finished video, in two folders:

- **`Demos/`** show how a feature works, step by step, on the app's screens.
- **`Campaigns/`** are brand, launch and social films.

Each file is named **Feature - Purpose (length, format)**, so a folder sorts by feature. The projects that build the
videos stay in `demos/` and `films/`. A rebuild writes to `out/`; copy the new file here under the same name.

**Checked against the feature catalogue** (`Marsad_Feature_Catalogue`, 1 October 2026), whose rules are the baseline
from now on:

- **Ready** means nothing in the video conflicts with the catalogue.
- Otherwise the last column lists what to change before the video is used.

The videos made before the catalogue arrived are copied as they are.

## Demos

| File | Feature | Purpose | Project | Catalogue check |
|---|---|---|---|---|
| Knowledge Map - Walkthrough Demo (51s, 16x9, 4K) | Knowledge map explorer, a record's page and its links, AI-suggested links, the map of the data model | Walkthrough: from one customer to the whole business model, on the real app's screens in dark mode | `demos/ontology-real` | **Ready.** Made from the catalogue. It shows live features only, with the real on-screen labels. The data is labelled sample data. |
| Decisions - Walkthrough Demo (51s, 16x9, 4K) | Decisions inbox; approve with a recorded reason | Walkthrough: approve a recommendation, on the real app's screens | `demos/decisions-real` | **Change before use:**<br>• The last step says the Odoo action runs after approval («اعتُمدت ونُفِّذ الإجراء في Odoo»), and the card shows «نُفِّذ الإجراء». That feature (an automatic follow-up when a rule fires) is switched off.<br>• The source pill «مستند · Odoo»: Odoo file import is switched off.<br>• It is filmed in light mode; the catalogue asks for dark. |
| Search - Walkthrough Demo (41s, 16x9) and (41s, 9x16) | Search across all your data | Walkthrough: one search across every source | `demos/search-walkthrough` | **Change before use:**<br>• The pages are rebuilt, not the real app's screens.<br>• It opens Search from the Data sidebar; the catalogue films the header search (Ctrl+K).<br>• The files result row is invented.<br>• It is filmed in light mode. |
| Business Pulse - Short Demo (30s, 16x9) and (30s, 9x16) | Business Pulse | Short feature demo | `demos/pulse-short` | **Change before use:**<br>• It switches on the daily advisor ("Your daily advisor"), which is switched off: don't film it yet.<br>• Avoid 'real time': "as it happens" («لحظة حدوثه») and «تنبيه فوري». The fastest rule runs hourly.<br>• The page is rebuilt, in light mode. |

## Campaigns

| File | Feature | Purpose | Project | Catalogue check |
|---|---|---|---|---|
| Marsad Platform - Brand Film, Main Theme (48s, 16x9) | The whole platform | Brand film in Marsad's main theme (the look the client chose) | `films/style-jupiter` | **Ready.** Remade from the catalogue on 2 October 2026, at the client's request, on the real app's screens in dark mode: Business Pulse, the Decisions approval ending sealed in its Decision Passport, and the assistant's answer with its sources. The data is labelled sample data. **To confirm:** the new lines "Operational recommendations" («توصيات تشغيلية») and "Built with personal-data masking and an audit trail." («مبني على إخفاء البيانات الشخصية وسجلّ للتدقيق.»), the six layer names, and the loop's last step "Decide" («قرّر») with "Know. Watch. Decide." |
| Marsad Platform - Launch Film (63s, 16x9) | The whole platform | Launch film, in the launch-video style | `films/film63-launch` | **Change before use** (the brand film above had the same six points, fixed in its remake):<br>• "Real-time recommendations" («توصيات لحظية»).<br>• "Sovereign. PDPL-compliant." and the «بنية تحتية سيادية» ring. Marsad is a hosted cloud service; say at most "built with personal-data masking and an audit trail".<br>• "One workflow. Fully automated." and "Decision to action. Nothing in between.": a person approves every decision.<br>• The approved card executing PO-2291: switched off.<br>• The assistant's answer ending «تم إنشاء طلبات التوريد تلقائيًا» (automatic reorders).<br>• The SAP, Salesforce, Oracle, Shopify and QuickBooks tiles. Marsad connects to Odoo and imports documents, Drive files and WhatsApp chats. |
| Marsad Platform - Campaign Film, Website Style (63s, 16x9) | The whole platform | The first campaign film: light website style, English voiceover | `film.html` (`./build.sh`) | **Change before use:**<br>• The same points as the launch film above, but for the PO-2291 card (it has none).<br>• The old end card "Request a demo · nasl-tech.com". |
| Marsad Platform - Campaign Film, Know Watch Decide (54s, 16x9) | The whole platform | Campaign film "Know. Watch. Decide.", music and captions | `film54_src/` (`./build54.sh`) | **Change before use:** its Business Pulse scene switches on the daily advisor, which is switched off. |
| Marsad Platform - Brand Ad with Voiceover (30s, 16x9) | The whole platform | 30 s brand ad, English voiceover | `films/brand-together-30` | **Change before use:**<br>• The SAP, Salesforce, Oracle, Shopify and QuickBooks tiles.<br>• "Act on them in one click." («نفّذها بنقرة واحدة»), with the action shown as executed after approval: switched off. |
| Marsad Platform - Style Sample, Lovable Look (29s, 16x9) | The whole platform | Style sample: the story in Lovable's launch-video look (the client chose the main theme) | `films/style-lovable` | **Change before use:**<br>• The assistant's answer ending «تم إنشاء طلبات التوريد تلقائيًا».<br>• The approved card executing PO-2291.<br>• The famous tiles in its collage. |
| Knowledge Map - Campaign Film (30s, 16x9) | Knowledge map | Campaign film about the ontology, in the main theme | `films/ontology-main-theme` | **Change before use:**<br>• The "Action executed · PO-2291" card: switched off.<br>• Its type names come from the older Knowledge Map page.<br>The 3D drawing is fine as art: the real map is 2D. |
| Business Pulse - Campaign Film (30s, 16x9) | Business Pulse recommendations | Campaign film, in the main theme | `films/pulse-30` | **Ready**, with one check: no claim conflicts. Its Business Pulse page is a rebuild, so match it against today's page. |
| Stock Monitoring - Story Film, One Coffee (48s, 16x9) | A product's stock alert, through to the decision | Story film: one product, from its record to the approved decision | `films/coffee-launch` | **Change before use:**<br>• "Marsad alerts you." with email and WhatsApp: alerts are in the app only, and email is coming.<br>• The purchase order executed after approval (PO-2291), also sent as a WhatsApp message: switched off.<br>• The record, links and alert cards are renderings. |
| Monitoring Rules - Social Ad (13s, 9x16) | Monitoring rule → decision with evidence → approval → Decision Passport | Vertical social ad (Arabic, organic end card) | `films/monitor` | **Ready in story:** it is the catalogue's lead story. Before release, confirm the placeholder values listed in `films/monitor/README.md`, and match its rebuilt dark-mode parts against the real dark mode. |
| What-if on a Rule - Campaign Film (30s, 16x9) | What-if on a rule | Fast campaign film in the main theme: try a different number on a rule and see what it would do, next to what happens today, on the real app's screens | `films/whatif-38` | **Ready.** Made from the catalogue. It shows a live feature only, on the real app's screens in dark mode, with the real on-screen labels. The data is labelled sample data. Compare what should happen with what did («مطابقة مجموعتين») is not in it: it is switched off. |

## Older versions (not copied here)

| Project | Replaced by |
|---|---|
| `demos/decisions-walk` (the new walkthrough method on rebuilt pages) and `demos/decisions-walkthrough` (light style, 60 s, 16:9 and 9:16) | Decisions - Walkthrough Demo |
| `demos/ontology-walkthrough` (light style, rebuilt page, 52 s, 16:9 and 9:16) | Knowledge Map - Walkthrough Demo |
| `films/ontology-30` and `films/ontology-foundry` (the ontology film in the Figma and Foundry looks) | Knowledge Map - Campaign Film |
| `films/coffee-story-45` (the coffee story in the light style) | Stock Monitoring - Story Film |
| The first three cuts of `films/whatif-38`: 38 s on "Midnight Drift (slowed)", 35 s in 4K on MoodMode's track, 32 s on verclub_music's; the client then sent the track it uses now | What-if on a Rule - Campaign Film |
| The 54 s film v1 to v3 and the 63 s film v1 to v5 | Their current versions above |

To rebuild any of them, run `./build_demo.sh <project>`; the result is written to `out/`.
