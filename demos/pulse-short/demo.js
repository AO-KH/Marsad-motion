/* Business Pulse — a 30 s feature demo (the "short" template).
   Music: SoundSurfer "Product Video" (fit/product-video.mp3), 88 BPM; B(k) is beat k, bars every 4 beats.
   Its phrases start on B(4), B(20), B(36)…, so the story turns there: the opened recommendation on B(20), the end card
   on B(36). Shape: title → the app → three beats of story, one caption each → end card.
   Since 2026-10-11 ("apply this to all other videos") the screens are the real app's: the client's bilingual front end
   in dark mode, its Arabic interface, frozen by tools/app_snap.js (demos/pulse-short/app/), with sample data labelled
   "Sample data". The story is the feature catalogue's live Business Pulse: «توليد توصيات» (the page lists the three
   recommendations), the first opened with the workspace's numbers it was built on, and the «مبني على بياناتك» pill
   ("Computed from your data. Nothing made up." is the page's own claim). Before: the daily advisor switched on and an
   alert "as it happens" («تنبيه فوري»): both off the catalogue.
   Truth: every screen is the app's own with sample data; the green «تم توليد…» line the app shows right after
   generating is left out (the list is captured as the page loads it). Renderings: the stage, the window, the pointer,
   the captions, the highlights, the label; the three recommendations rise in one per 8th. */
const B=M.B, S8=M.S8, v=M.pick;                 // v(a16x9, a9x16): per-format framing
const at=(x,y)=>({x,y,w:0,h:0});               // a view centre in page px

M.title({at:B(0.5),out:B(6.5),icon:'pulse',kicker:'FEATURE',kickerAr:'ميزة',en:'Business Pulse',ar:'نبض الأعمال'});

const app=M.app({at:B(7),out:B(35.5),page:'before',view:{x:v(720,760)}});

// 1 — generate: the page computes the numbers first, then words the recommendations
M.caption({at:B(8),out:B(19),en:'Recommendations from your own numbers.',ar:'توصيات مبنية على أرقامك.'});
app.focus(B(8.5),at(v(700,560),v(360,330)),{scale:v(1.05,1.3),dur:1.2});   // the title, the page's own line and the button
app.click(B(12),'[data-w=btn]',{ax:0.3,ay:0.6});
app.page(B(12.5),'list',{dur:0.4});
[1,2,3].forEach((n,i)=>app.show(B(12.75)+i*S8,`[data-w=r${n}]`,{from:'below',dist:14,dur:0.6}));
app.focus(B(13),at(v(720,760),425),{scale:v(0.944,1.25),dur:1.3});
app.cursorOut(B(14));

// 2 — open the first: its text, with the numbers it was built on
M.caption({at:B(20),out:B(28),en:'Open one: the numbers behind it.',ar:'افتح توصية: والأرقام التي بُنيت عليها.'});
app.click(B(21),'[data-w=toggle]',{ax:0.6,ay:0.5});
app.page(B(21.5),'open',{dur:0.3});
app.focus(B(21.5),'[data-w=r1]',{scale:v(1.15,1.25),dx:v(0,100),dur:1.3});
app.cursorOut(B(23));
app.highlight(B(23.5),B(28),'[data-w=body]',{pad:10});

// 3 — computed from your data: the page says so, and every recommendation carries the pill
M.caption({at:B(29),out:B(35),en:'Computed from your data. Nothing made up.',ar:'محسوبة من بياناتك… دون اختلاق.'});
app.highlight(B(29.5),B(35),'[data-w=ok1]',{pad:8});

// the records are sample data: a small label while the app is on screen
const NOTE=M.el('div','ps-note','<span class="en">Sample data</span><span class="sep">·</span><span class="ar">بيانات تجريبية</span>',M.layer('over'));
M.track(t=>{const k=M.ez.dec(M.P(t,B(7.5),B(8.3)))*(1-M.ez.ioC(M.P(t,B(35),B(35.6))));NOTE.style.display=k>0.001?'':'none';NOTE.style.opacity=k.toFixed(3);});

M.endcard({at:B(36)});
M.start();
