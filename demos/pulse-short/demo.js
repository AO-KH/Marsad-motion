/* Business Pulse — a 30 s feature demo (the "short" template).
   Music: the 54s track (95.96 BPM); B(k) is beat k, bars on B(0), B(4), B(8)… Drums come in at B(16) (10 s).
   Shape: title → the app → three beats of story, one caption each → end card. */
const B=M.B, S8=M.S8;
const X=M.pick(948,1260);                      // 9:16 crops the page: keep the right-hand (RTL) header in view

M.title({at:B(0.5),out:B(7),icon:'pulse',kicker:'FEATURE',kickerAr:'ميزة',en:'Business Pulse',ar:'نبض الأعمال'});

const app=M.app({at:B(7.5),out:B(35),page:'pulse',view:{x:X}});
app.inject('pulse',`<div class="abs" id="alertCard"><span class="dot"></span><span class="t">تنبيه: انخفاض مخزون فرع الرياض ١٨٪</span>
  <span class="m">${SK.pill('hi','مرتفع')}${SK.pill('src','المخزون · Odoo')}<span class="sk-meta">الآن</span></span>
  <svg width="130" height="76" viewBox="0 0 130 76"><polyline points="4,16 26,20 46,14 66,30 86,34 104,56 126,62" fill="none" stroke="#A8131C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="126" cy="62" r="5" fill="#A8131C"/></svg></div>`);

// 1 — the daily advisor switches on
M.caption({at:B(8),out:B(15.5),en:'Your daily advisor, built on your data.',ar:'مستشارك اليومي، مبني على بياناتك.'});
if(M.FORMAT==='16x9'){
  app.focus(B(9),'.sk-toggle',{scale:0.89,dx:650});                   // the switch and the card's heading in one view
}else{                                                                 // 9:16 can't fit both: the heading, then the switch
  app.focus(B(8.5),'text:المستشار اليومي',{scale:1.0,dx:-300,dur:1.2});
  app.focus(B(10.5),'.sk-toggle',{scale:1.1,dx:330,dur:1.2});
}
app.click(B(12),'.sk-toggle').toggle(B(12),'.sk-toggle');
app.cursorOut(B(13.5));
app.focus(B(14),'page',{x:X,dur:1.2});
[1,2,3].forEach((n,i)=>app.show(B(14.5)+i*S8,`#recRows .sk-rec:nth-child(${n}) .sk-pill.new`,{from:'none',scale:0.9}));

// 2 — an alert arrives the moment the numbers change (drums in)
M.caption({at:B(16),out:B(25.5),en:'It flags what changed, as it happens.',ar:'ينبّهك لما تغيّر، لحظة حدوثه.'});
app.show(B(17),'#alertCard',{from:'above',dist:20,dur:0.8});
app.text(B(17),'.sk-badge','4');
app.focus(B(18),'#alertCard',{fill:0.7,dur:1.2});
app.highlight(B(19),B(24.5),'#alertCard',{pad:12});
app.callout(B(19.5),B(24.5),'#alertCard',{en:'Instant alert',ar:'تنبيه فوري',side:'bottom'});

// 3 — close
M.caption({at:B(26),out:B(34.5),en:'Know first. Decide faster.',ar:'اعرف أولاً، وقرّر أسرع.'});
app.focus(B(26),'page',{x:X,dur:1.4});

M.endcard({at:B(35.5)});
M.start();
