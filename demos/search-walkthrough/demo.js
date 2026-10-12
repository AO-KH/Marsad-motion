/* Search across all your data — a 41 s step-by-step walkthrough (the "walkthrough" template, 3 steps).
   Music: SoundSurfer "Product Video" (fit/product-video.mp3), 88 BPM; B(k) is beat k (bars every 4). The groove
   runs from k4 and its phrases start on k4, k20, k36 and k52: step 2 opens on k20, the sources are pointed out from
   k35 and the end card starts on k52. The video ends on k60 (40.9 s), inside that phrase, under a 3 s fade.
   Shape: title → the app → 3 steps of 12 beats (numbered rail + one caption per step) → outro → end card.
   Since 2026-10-11 the screens are the real app's (the client's bilingual front end in dark mode, its Arabic interface,
   frozen by tools/app_snap.js: demos/search-walkthrough/app/), with sample data labelled "Sample data", and the search
   is the header's, as the feature catalogue films it: Ctrl K puts the cursor in it, the word is typed, Enter opens the
   Search page with the results grouped by where they come from (Odoo, WhatsApp, an uploaded spreadsheet's row with
   the file it came from, Google Drive). Screens: 'home' (the Home page; its hero's small kicker «طبقة القرار السيادية»
   is hidden: the catalogue avoids 'sovereign'), 'focus' (the header search after Ctrl K), 'results' (a 1440 x 1240
   window, so all four groups are on it: the view pans down it as a scroll would).
   Truth: every screen is the app's own with sample data. Renderings: the stage, the window, the pointer, the steps, the
   callouts and highlights, the label. Invented: the word typed. */
const B=M.B, v=M.pick, S8=M.S8;                // v(a16x9, a9x16): per-format framing
const at=(x,y)=>({x,y,w:0,h:0});              // a view centre in page px

M.title({at:B(0.5),out:B(6.5),icon:'search',kicker:'WALKTHROUGH',kickerAr:'شرح خطوة بخطوة',
  en:'Search across all your data',ar:'البحث في كل بياناتك'});

const app=M.app({at:B(7),out:B(51.5),page:'home',view:{x:v(720,700)}});

M.steps({at:B(8),out:B(44),list:[
  {at:B(8), en:'Press Ctrl K',                  ar:'اضغط Ctrl K'},
  {at:B(20),en:'Type a word, like “invoice”',   ar:'اكتب كلمة، مثل «فاتورة»'},
  {at:B(32),en:'See results from every source', ar:'راجع النتائج من كل المصادر'},
]});

// 1 — the header search: the shortcut is printed in it; Ctrl K puts the cursor in it (on the bar's downbeat)
app.focus(B(8),'[data-w=search]',{scale:v(1.6,1.6),max:1.6,dur:1.2});
app.callout(B(9.5),B(14.5),'[data-w=kbd]',{en:'Press Ctrl K',ar:'اضغط Ctrl K',side:'bottom'});
app.page(B(12),'focus',{dur:0.25});

// 2 — the word, typed; Enter opens the Search page with the results (on the bar's downbeat)
app.type(B(21),'[data-w=search]','فاتورة',{cps:8});
app.page(B(24),'results',{dur:0.35});
app.focus(B(24),at(v(600,760),402),{scale:v(0.944,1.25),max:1.6,dur:1.3});   // its own field with the word, the count, Odoo's group
app.highlight(B(26),B(30.5),'[data-w=count]',{pad:8});

// 3 — where each result comes from: down the page (a scroll), one group at a time
app.focus(B(32),at(v(600,760),838),{scale:v(0.944,1.25),max:1.6,dur:1.6});
app.callout(B(34),B(43),'[data-w=p-wa]',{en:'From WhatsApp',ar:'من واتساب',side:v('right','left'),gap:v(40,30)});
app.callout(B(36),B(43),'[data-w=p-file]',{en:'From an uploaded file',ar:'من ملف مرفوع',side:v('right','left'),gap:v(40,30)});
app.callout(B(38),B(43),'[data-w=p-drive]',{en:'From Google Drive',ar:'من Google Drive',side:v('right','left'),gap:v(40,30)});

// outro
M.caption({at:B(44),out:B(51),en:'One search across all your data.',ar:'بحث واحد في كل بياناتك.'});
app.focus(B(44),at(v(600,760),620),{scale:v(0.944,1.25),max:1.6,dur:1.5});

// the records are sample data: a small label while the app is on screen
const NOTE=M.el('div','sw-note','<span class="en">Sample data</span><span class="sep">·</span><span class="ar">بيانات تجريبية</span>',M.layer('over'));
M.track(t=>{const k=M.ez.dec(M.P(t,B(7.5),B(8.3)))*(1-M.ez.ioC(M.P(t,B(51),B(51.6))));NOTE.style.display=k>0.001?'':'none';NOTE.style.opacity=k.toFixed(3);});

M.endcard({at:B(52)});
M.start();
