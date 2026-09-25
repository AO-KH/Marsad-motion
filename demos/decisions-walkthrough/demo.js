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

// Framing: every hold is set where no line of text is sliced by the window's edge (tools/cutcheck.js suggests these
// centres; {x,y,w:0,h:0} is a view centre in page px). PAGE9 is the whole-page view in 9:16.
const at=(x,y)=>({x,y,w:0,h:0}), PAGE9={x:954,zoom:1.018};

// 1 — the Decisions tab: close enough to read the tabs; the pointer lands under the label, never on it.
//     The click opens a new page, so the view glides out as it fades in (B11.5) instead of holding on it.
app.focus(B(8),v('.sk-tab[data-k="dec"]',at(1491,355)),{scale:v(1.5,1.45),max:1.6,dy:v(120,0)});
app.click(B(11),'.sk-tab[data-k="dec"]',{ax:0.2,ay:0.95});
app.page(B(11.25),'decisions');
app.focus(B(11.5),'page',{...v({x:948},PAGE9),dur:1.4});

// 2 — the recommendation card. 16:9: the whole card fills the window; 9:16: its right half (title, pills, buttons) at a readable size
app.focus(B(20),'#decCard',{scale:v(0.95,1.08),dx:v(0,334),dy:v(-190,-248),dur:1.2});
app.click(B(23),'#decCard',{ax:v(0.6,0.75)});
app.highlight(B(23),B(30.5),'#decCard',{pad:10});
app.cursorOut(B(25));

// 3 — confidence and source (9:16 shows one at a time: the card is wider than the frame).
//     The confidence callout sits below and to the left, clear of the title above and the buttons below.
app.callout(B(33),v(B(42),B(35.5)),'text:ثقة 80%',{en:'80% confidence',ar:'ثقة 80%',side:'bottom',gap:20,dx:v(-340,-360)});
if(M.FORMAT==='9x16')app.focus(B(36),at(520,617),{scale:1.13,dur:1.2});
app.callout(B(37),B(42),'text:المخزون · Odoo',{en:'Source: Odoo inventory',ar:'المصدر: مخزون Odoo',side:'top'});

// 4 — approve
app.focus(B(44),v(at(1196,568),at(1012,606)),{scale:v(1.01,1.1),dur:1.2});   // the button and, after the click, the whole confirmation
app.click(B(47),'#btnOK');
app.show(B(47.25),'#toast',{from:'none',scale:0.97,dur:0.8});
app.cursorOut(B(49));

// 5 — the counters update
const TWO={x:772,y:405,w:688,h:138};           // the "approved" and "in review" stat cards (natural coords)
app.focus(B(56),v(TWO,at(1017,552)),{fill:0.72,scale:v(undefined,1.09),dx:v(-39,0),dy:v(-70,0),dur:1.3});
app.count(B(58),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(58),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(58),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(58),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.highlight(B(59),B(66),'#stats .sk-stat:nth-child(3)',{pad:8});   // the "approved" card

// outro
M.caption({at:B(68),out:B(78),en:'From recommendation to action, in seconds.',ar:'من التوصية إلى التنفيذ في ثوانٍ.'});
app.focus(B(68),'page',{...v({x:948},PAGE9),dur:1.4});

M.endcard({at:B(80)});
M.start();
