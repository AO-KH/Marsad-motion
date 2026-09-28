/* Marsad — "Your data, together": a 30 s brand ad (films/brand-together-30), built on the marsad-campaign skill.
   The client's brief: "your data is everywhere, marsad brings it together and turns your numbers into decisions you
   can act on in one click. use the stylish track, english voiceover with arabic captions, and end with book your demo".
   Music: SoundSurfer "Stylish" (fit/stylish.mp3, 93.99 BPM) from song beat k44 (28.129 s), so film beat k = song k+44.
   Groove k0-27 (a one-beat dip on k11, just before the k12 bar line), breakdown k28-36 (quietest k29-31), the drop on
   k37 = the end card. B(k) = k x 0.638 s.
     hook   k0-8    the eight famous sources, scattered, drifting apart          "Your company's data is everywhere."
     turn   k8-16   they glide one per 16th into a ring and connect to the centre; the mark eases in (k10), ignites
                    softly on k12 (after the dip) and holds to k14; the sources are absorbed (k14) and the mark
                    glides (k15-17) to where the app's logo will be          "Marsad brings it all together."
     proof  k16-28  the window rises on Business Pulse around the mark, which becomes its logo (k17.4); three
                    recommendations arrive (k18); Decisions (k22): the Riyadh restock recommendation and its source
                                                                                 "Your numbers become decisions."
     (the window comes in on k16, not k14, so the connected hub holds 1.3 s after the ignition and the mark flies
      over an empty stage instead of across the page; the anatomy's 30 s map now follows this film)
     quiet  k28-36  (the breakdown) the cursor clicks «موافقة» on k31; the action is executed; the counters move
                                                                                 "Act on them in one click."
     end    k37-47  the end card on the drop: Book your demo · marsadnasl.com
   Calm: entrances 0.8-1.0 s on M.ez.dec, glides on M.ez.ioC, two soft punches (k12, k37), nothing on every beat. */
const B=M.B, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const MB=M.MB;

/* ---------------- the hub: the sources, scattered, then gathered and connected; the mark at the centre ---------------- */
const C={x:960,y:440};                     // the hub's centre (stage px), clear of the caption band (y 900-1040)
const RX=460, RY=300;                      // the ring the sources settle on
const HUB=M.layer();                       // under the app window: tiles, lines
const TOP=M.layer('over');                 // above it: the mark, which glides into the window's own logo
// hook position and scale; a = ring slot (deg, clockwise from 3 o'clock); o = order of appearing; g = order of gathering
const SRC=[
  {k:0, hx:260, hy:190, hs:1.25, a:-135, o:0, g:7},   // SAP
  {k:3, hx:720, hy:125, hs:1.12, a:-90,  o:4, g:0},   // Excel
  {k:1, hx:1250,hy:150, hs:1.20, a:-45,  o:2, g:1},   // Salesforce
  {k:6, hx:1690,hy:250, hs:1.15, a:0,    o:7, g:2},   // PDF
  {k:5, hx:1660,hy:620, hs:1.30, a:45,   o:1, g:3},   // QuickBooks
  {k:2, hx:1250,hy:745, hs:1.14, a:90,   o:5, g:4},   // Oracle
  {k:4, hx:690, hy:760, hs:1.22, a:135,  o:3, g:5},   // Shopify
  {k:7, hx:290, hy:570, hs:1.18, a:180,  o:6, g:6},   // CSV
];
const T_APPEAR=B(0.5), T_GATHER=B(8), GLIDE=1.5*MB, DRAW=0.45, T_ABS=B(14), ABS=0.5;
const MW=280, MH=MW*1637/2145;               // the mark's size at the hub (the client: "make marsad logo bigger")
const DRIFT=5;                             // px/s: the hook's slow, straight drift apart (never a bob)
const NS='http://www.w3.org/2000/svg';
const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','bt-lines');
svg.setAttribute('width',M.W);svg.setAttribute('height',M.H);HUB.appendChild(svg);
const gLines=document.createElementNS(NS,'g'),gDots=document.createElementNS(NS,'g');gDots.setAttribute('class','bt-dots');
svg.append(gLines,gDots);
const SEL=(n)=>{const e=document.createElementNS(NS,n);return e;};
SRC.forEach(s=>{
  const r=s.a*Math.PI/180;
  s.sx=C.x+RX*Math.cos(r);s.sy=C.y+RY*Math.sin(r);                        // the ring slot
  const d=Math.hypot(s.hx-C.x,s.hy-C.y);s.ux=(s.hx-C.x)/d;s.uy=(s.hy-C.y)/d;  // drift direction: away from the centre
  s.tA=T_APPEAR+s.o*S16;s.tG=T_GATHER+s.g*S16;s.tArr=s.tG+GLIDE;
  s.el=M.el('div','k-tile m-glass',K.tile(K.TILES[s.k]),HUB);st(s.el,{left:'0px',top:'0px',opacity:0});
  // the line from the tile's edge to the mark's edge (an ellipse around the mark), drawn as the tile arrives
  const vx=C.x-s.sx,vy=C.y-s.sy,L=Math.hypot(vx,vy),ux=vx/L,uy=vy/L;
  const rin=Math.min((MW/2+26)/Math.max(Math.abs(ux),1e-6),(MH/2+26)/Math.max(Math.abs(uy),1e-6));   // 26 px clear of the mark's box
  s.l0={x:s.sx+ux*64,y:s.sy+uy*64};s.l1={x:C.x-ux*rin,y:C.y-uy*rin};s.len=Math.hypot(s.l1.x-s.l0.x,s.l1.y-s.l0.y);
  const grad=SEL('linearGradient');grad.id='btg'+s.k;grad.setAttribute('gradientUnits','userSpaceOnUse');
  [['x1',s.l0.x],['y1',s.l0.y],['x2',s.l1.x],['y2',s.l1.y]].forEach(([k,v])=>grad.setAttribute(k,f1(v)));
  grad.innerHTML='<stop offset="0" stop-color="#8E32C3" stop-opacity="0.25"/><stop offset="1" stop-color="#BC59D1" stop-opacity="0.95"/>';
  svg.insertBefore(grad,gLines);
  s.ln=SEL('line');[['x1',s.l0.x],['y1',s.l0.y],['x2',s.l1.x],['y2',s.l1.y]].forEach(([k,v])=>s.ln.setAttribute(k,f1(v)));
  s.ln.setAttribute('stroke',`url(#btg${s.k})`);s.ln.setAttribute('stroke-width','2.5');s.ln.setAttribute('stroke-linecap','round');
  s.ln.setAttribute('stroke-dasharray',f1(s.len));s.ln.setAttribute('stroke-dashoffset',f1(s.len));gLines.appendChild(s.ln);
  s.dot=SEL('circle');s.dot.setAttribute('r','4');s.dot.setAttribute('fill','#BC59D1');s.dot.setAttribute('opacity','0');gDots.appendChild(s.dot);
});
// the hub gives way: after the hold, the sources are absorbed into the mark (one per 64th), each line retracting with it
const absAt=s=>T_ABS+s.g*S16/4;
const T_HUB_END=T_ABS+7*S16/4+ABS;
M.track(t=>{
  HUB.style.display=t<T_HUB_END+0.02?'':'none';if(t>=T_HUB_END+0.02)return;
  for(const s of SRC){
    const pa=ez.dec(P(t,s.tA,s.tA+0.8));
    const dx=s.hx+s.ux*DRIFT*Math.min(t,s.tG),dy=s.hy+s.uy*DRIFT*Math.min(t,s.tG);   // drifted hook position
    const pg=ez.ioC(P(t,s.tG,s.tArr)), pb=ez.inC(P(t,absAt(s),absAt(s)+ABS));
    // a gentle arc on the way in (all the same way round): a gather, not a spin
    const gx=s.sx-dx,gy=s.sy-dy,gl=Math.hypot(gx,gy)||1,arc=Math.min(60,0.14*gl)*Math.sin(Math.PI*pg);
    let x=lerp(dx,s.sx,pg)-gy/gl*arc,y=lerp(dy,s.sy,pg)+gx/gl*arc;
    x=lerp(x,C.x,0.7*pb);y=lerp(y,C.y,0.7*pb);
    const sc=lerp(s.hs,0.95,pg)*(0.9+0.1*pa)*(1-0.5*pb);
    st(s.el,{opacity:f3(pa*(1-pb)),transform:`translate(${f1(x-56)}px,${f1(y-56+(1-pa)*16)}px) scale(${f3(sc)})`});
    // the line draws from the tile to the mark as it arrives, and retracts into the mark with it
    const pd=ez.dec(P(t,s.tArr,s.tArr+DRAW));
    s.ln.setAttribute('stroke-dashoffset',f1(s.len*(1-pd)-s.len*pb));
    // once connected, a data point travels along the line into the mark (1.7 s per trip, never on the beat grid)
    const t0=s.tArr+DRAW;
    if(t>=t0){const u=((t-t0)/1.7+s.g*0.13)%1;
      s.dot.setAttribute('cx',f1(lerp(s.l0.x,s.l1.x,u)));s.dot.setAttribute('cy',f1(lerp(s.l0.y,s.l1.y,u)));
      s.dot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*ez.dec(P(t,t0,t0+0.5))*(1-pb)));}
    else s.dot.setAttribute('opacity','0');
  }
});

/* the mark: eases in on k10 as the sources connect, ignites softly on k12 (one bloom of its own glow, no orb), holds
   while the sources are absorbed, then glides into the spot where the app window's logo will be (top bar, right); the
   window forms around it and the mark hands over to the window's own logo: one carrier from scene to scene */
const mk=M.el('div','bt-mk',`<img class="glow" src="assets_logo_m.png">`+K.mark(MW),TOP);
st(mk,{width:MW+'px',height:f1(MH)+'px'});
const glow=mk.querySelector('.glow');
const T_MARK=B(10), T_IGN=B(12), T_FLY=B(15), T_LAND=B(17), T_WIN=B(16), WIN_IN=0.9;
// where the window's own logo is on the stage at time t (app.toStage: the view, the window's entrance and its frame)
function logoAt(t){const L=app.toStage('.sk-logo img',t);return {x:L.cx,y:L.cy,s:L.w/MW};}
const T_HAND=T_WIN+WIN_IN;                   // the window is whole: the mark becomes its logo (the logo is hidden until then)
const handAt=t=>ez.ioC(P(t,T_HAND-0.1,T_HAND+0.15));
M.track(t=>{
  const on=t>=T_MARK-0.01&&t<T_HAND+0.2;mk.style.display=on?'':'none';if(!on)return;
  const pin=ez.dec(P(t,T_MARK,T_MARK+0.9));
  let sc=0.88+0.12*ez.dec(P(t,T_MARK,T_IGN)), x=C.x, y=C.y;
  const pf=ez.ioC(P(t,T_FLY,T_LAND));
  if(pf>0){const L=logoAt(t);x=lerp(C.x,L.x,pf);y=lerp(C.y,L.y,pf);sc=sc*Math.pow(L.s/sc,pf);}
  const hand=1-handAt(t);
  st(mk,{opacity:f3(pin*hand),transform:`translate(${f1(x-MW/2)}px,${f1(y-MH/2)}px) scale(${(+sc).toFixed(4)})`});
  // its own glow: gathers from k10.5, one soft bloom into k12, settles, swells a little as it takes the sources in,
  // and is gone before the glide
  const g=0.34*ez.dec(P(t,B(10.5),T_IGN))+0.4*ez.dec(P(t,T_IGN-0.25,T_IGN))*(1-ez.ioC(P(t,T_IGN,T_IGN+1.1)))
         +0.18*Math.sin(Math.PI*P(t,T_ABS,T_HUB_END));
  glow.style.opacity=f3(g*(1-ez.ioC(P(t,T_FLY,T_FLY+0.5))));
});
M.punch(T_IGN,{amp:0.015});

/* ---------------- captions: one per scene, EN on the beat, AR an 8th later; each ends 0.5 s before the next ---------------- */
M.caption({at:B(1), out:B(9.2), en:"Your company's data is everywhere.", ar:'بيانات شركتك مبعثرة في كل مكان.'});
M.caption({at:B(10),out:B(17.2),en:'Marsad brings it all together.',    ar:'مرصد يجمعها كلها في مكان واحد.'});
M.caption({at:B(18),out:B(27.2),en:'Your numbers become decisions.',    ar:'أرقامك تتحوّل إلى قرارات.'});
M.caption({at:B(28),out:B(36),  en:'Act on them in one click.',         ar:'نفّذها بنقرة واحدة.'});

/* ---------------- proof in the real app: Business Pulse, then Decisions ---------------- */
const at=(x,y)=>({x,y,w:0,h:0});                         // a view centre in page px (tools/cutcheck.js suggests these)
const app=M.app({at:T_WIN,out:B(36),page:'pulse'});
app.set(T_WIN,'.sk-logo img',(e,on,t)=>{e.style.opacity=f3(handAt(t));});   // the flying mark takes its place, then hands over
// Business Pulse: three recommendations arrive, one per 16th, and the view pushes in on them
[1,2,3].forEach((n,i)=>app.show(B(18)+i*S16,`#recRows .sk-rec:nth-child(${n})`,{from:'below',dist:18,dur:0.8}));
app.focus(B(18),at(951,618),{scale:0.86,dur:1.5});     // header, advisor and the three rows, edges clear
// Decisions: the page cross-fades in (the tab underline slides) as the view glides to the recommendation
app.page(B(22)-0.25,'decisions');
app.focus(B(22),'#decCard',{scale:0.95,dy:-190,dur:1.4});
app.set(B(23.5),'#veil',(e,on,t)=>{e.style.opacity=f3(0.75*ez.dec(P(t,B(23.5),B(23.5)+0.8))*(1-ez.ioC(P(t,B(31.5),B(31.5)+0.8))));});
app.callout(B(24),B(27.5),'text:المخزون · Odoo',{en:'Source: Odoo inventory',ar:'المصدر: مخزون Odoo',side:'top',dx:80});
// the quiet moment (breakdown): one click approves it; the action is executed and the counters move
app.click(B(31),'#btnOK',{ax:0.5,ay:0.84});
app.show(B(31.25),'#toast',{from:'none',scale:0.97,dur:0.8});
app.cursorOut(B(33));
app.count(B(32),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(32),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(32),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(32),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.highlight(B(32.5),B(35.5),'#stats .sk-stat:nth-child(3)',{pad:8});

/* ---------------- the end card on the drop ---------------- */
M.punch(B(37),{amp:0.012});
M.endcard({at:B(37)});
M.start();
