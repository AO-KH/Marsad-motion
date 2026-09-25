/* Approve a recommendation — a 60 s step-by-step walkthrough (the "walkthrough" template).
   Music: SoundSurfer "Product Video" (fit/product-video.mp3), 88 BPM; B(k) is beat k (bars every 4). The groove
   runs from k4; the music stops for a moment on k70-71, a quiet breakdown carries the outro and the end card
   (k72-87), and the video ends on k88 (60 s), just before the build.
   Shape: title → the app → 5 steps of 12 beats (numbered rail + one caption per step) → outro → end card. */
const B=M.B, v=M.pick;                          // v(a16x9, a9x16): per-format framing

M.title({at:B(0.5),out:B(6.5),icon:'gavel',kicker:'WALKTHROUGH',kickerAr:'شرح خطوة بخطوة',
  en:'Approve a recommendation',ar:'اعتماد توصية'});

const app=M.app({at:B(7),out:B(79),page:'pulse',view:{x:v(948,1260)}});

M.steps({at:B(8),out:B(68),list:[
  {at:B(8), en:'Open Decisions',                  ar:'افتح صفحة القرارات'},
  {at:B(20),en:'Pick a recommendation',           ar:'اختر توصية'},
  {at:B(32),en:'Check the confidence and source', ar:'راجع درجة الثقة والمصدر'},
  {at:B(44),en:'Approve it',                      ar:'اعتمد التوصية'},
  {at:B(56),en:'It is recorded right away',       ar:'يُسجَّل القرار فوراً'},
]});

// 1 — the Decisions tab
app.focus(B(8),'.sk-tab[data-k="dec"]',{scale:v(1.0,1.25),dy:260});
app.click(B(11),'.sk-tab[data-k="dec"]');
app.page(B(11.25),'decisions');
app.focus(B(13),'page',{x:v(948,1000),dur:1.2});

// 2 — the recommendation card
app.focus(B(20),'#decCard',{scale:v(0.95,undefined),dx:v(0,250),dur:1.2});   // 16:9: the whole card fills the window
app.click(B(23),'#decCard',{ax:v(0.6,0.75)});
app.highlight(B(23),B(30.5),'#decCard',{pad:10});
app.cursorOut(B(25));

// 3 — confidence and source (9:16 shows one at a time: the card is wider than the frame)
app.callout(B(33),v(B(42),B(35.5)),'text:ثقة 80%',{en:'80% confidence',ar:'ثقة ٨٠٪',side:'top'});
if(M.FORMAT==='9x16')app.focus(B(36),'text:المخزون · Odoo',{scale:1.15,dx:360,dur:1.2});
app.callout(B(37),B(42),'text:المخزون · Odoo',{en:'Source: Odoo inventory',ar:'المصدر: مخزون Odoo',side:'top'});

// 4 — approve
app.focus(B(44),'#btnOK',{scale:v(1.1,1.2),dx:v(-150,-120),dur:1.2});
app.click(B(47),'#btnOK');
app.show(B(47.25),'#toast',{from:'none',scale:0.97,dur:0.8});
app.cursorOut(B(49));
if(M.FORMAT==='9x16')app.focus(B(49),'text:تم تنفيذ الإجراء',{scale:1.1,dur:1.1});   // 9:16: glide to the message

// 5 — the counters update
const TWO={x:772,y:405,w:688,h:138};           // the "approved" and "in review" stat cards (natural coords)
app.focus(B(56),TWO,{fill:v(0.72,0.9),dur:1.3});
app.count(B(58),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(58),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(58),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(58),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.highlight(B(59),B(66),'#stats .sk-stat:nth-child(3)',{pad:8});   // the "approved" card

// outro
M.caption({at:B(68),out:B(78),en:'From recommendation to action, in seconds.',ar:'من التوصية إلى التنفيذ في ثوانٍ.'});
app.focus(B(68),'page',{x:v(948,1000),dur:1.4});

M.endcard({at:B(80)});
M.start();
