/* Search across all your data — a 41 s step-by-step walkthrough (the "walkthrough" template, 3 steps).
   Music: SoundSurfer "Product Video" (fit/product-video.mp3), 88 BPM; B(k) is beat k (bars every 4). The groove
   runs from k4 and its phrases start on k4, k20, k36 and k52: step 2 opens on k20, the WhatsApp source is pointed
   out on k36 and the end card starts on k52. The video ends on k60 (40.9 s), inside that phrase, under a 3 s fade.
   Shape: title → the app (the Data section) → 3 steps of 12 beats (numbered rail + one caption per step) → outro →
   end card. Screens: 'objectTypes' (site kit) and 'searchAll' (pages.js: the site kit's search page with an empty
   field and a result from the files source). */
const B=M.B, v=M.pick, S8=M.S8;                // v(a16x9, a9x16): per-format framing

M.title({at:B(0.5),out:B(6.5),icon:'search',kicker:'WALKTHROUGH',kickerAr:'شرح خطوة بخطوة',
  en:'Search across all your data',ar:'البحث في كل بياناتك'});

const app=M.app({at:B(7),out:B(51.5),page:'objectTypes',view:{x:v(948,1366)}});

M.steps({at:B(8),out:B(44),list:[
  {at:B(8), en:'Open Search',                   ar:'افتح صفحة البحث'},
  {at:B(20),en:'Type a word, like “invoice”',   ar:'اكتب كلمة، مثل «فاتورة»'},
  {at:B(32),en:'See results from every source', ar:'راجع النتائج من كل المصادر'},
]});

// 1 — Data → البحث والاستعلام in the section sidebar. The pointer lands left of the label, never on it.
//     The zoom keeps the sidebar and the page title whole: 16:9 fits both pages' titles. In 9:16 the object-types
//     table spans the page, so 1.18 (below the top bar) is the one close zoom whose left edge falls between its
//     columns and between the tabs; it can't fit the wider «البحث في كل البيانات», so 9:16 starts pulling back as the
//     new page fades in, and that title is whole by the time the page is.
const NAV='.sk-side .sk-item:nth-child(5)';
app.focus(B(8),NAV,{scale:v(1.35,1.18),max:1.6,dy:v(-36,34)});
app.click(B(11),NAV,{ax:0.3,ay:0.55});
app.page(B(11.25),'searchAll');
app.focus(v(B(13),B(11.5)),'page',{x:v(948,1366),dur:1.2});
app.cursorOut(B(13));

// 2 — type the query; the results arrive one row per 8th. 16:9 shows the whole page minus the sidebar (0.94 puts the
//     window's top edge between the top buttons and the breadcrumb, so neither is cut); 9:16 shows the right part of
//     the field and the results at 1.55, where the typed word and the result titles read at caption size and the
//     header sits just above the frame (from 1.15 to 1.5 the top edge would cut the title or the subtitle).
const FIELD={x:58,y:470,w:1402,h:558};         // the search field, the filters and the results card (natural coords)
app.focus(B(20),FIELD,{scale:v(0.94,1.55),dx:v(0,409),dur:1.2});
app.click(B(23),'#q',{ax:0.75,ay:0.6});
app.type(B(24),'#q','فاتورة',{cps:9});        // on the beat after the click: the field lights 0.5 s before the first letter, so after the click
app.show(B(25),'#resCard',{from:'none'});
[1,2,3,4].forEach((n,i)=>app.show(B(25)+i*S8,'#r'+n,{from:'below',dist:14}));
app.cursorOut(B(25));
app.highlight(B(27),B(30.5),'#resCard',{pad:10});

// 3 — where each result comes from. 16:9: the whole card stays in view; 9:16: glide left to the source pills, close
//     enough (2.0) that the pills read at phone size and the empty left end of the search field stays out of frame.
//     The Odoo pills get a ring; WhatsApp and the files get a callout each (their pills are in Arabic).
app.focus(B(32),'#resCard',{scale:v(0.94,2.0),max:2.0,dx:v(0,-479),dur:v(1.2,1.5)});
app.highlight(B(34),B(42.5),'#srcOdoo1',{pad:8});
app.highlight(B(34),B(42.5),'#srcOdoo2',{pad:8});
app.callout(B(36),B(42.5),'#srcWa',{en:'From WhatsApp',ar:'من واتساب',side:'right',gap:v(40,50)});
app.callout(B(38),B(42.5),'#srcFile',{en:'From your files',ar:'من ملفاتك',side:'right',gap:v(40,50)});

// outro
M.caption({at:B(44),out:B(51),en:'One search across all your data.',ar:'بحث واحد في كل بياناتك.'});
app.focus(B(44),'page',{x:v(948,1366),dur:v(1.4,1.5)});

M.endcard({at:B(52)});
M.start();
