/* Marsad — "The story of one coffee": a 45 s brand ad (films/coffee-story-45), built on the marsad-campaign skill.
   The client chose the concept from a brainstorm grounded in the Marsad User Manual v1.0 (March 2026): one product and
   everything around it, the moment its stock runs low, the governed reorder with one approval, and the record that keeps
   it. Captions only (EN/AR), no voiceover; a few sound effects on the visual events.
   Music: SoundSurfer "Stylish" (fit/stylish.mp3, 93.99 BPM) from song beat k20 (12.808 s), so film beat k = song k+20.
   Its phrases start on film k4, k20 (the downbeat drops out: a breath) and k36 (after the one-beat stop on k35); the
   breakdown is k52-58 (quietest k52-55), the lift k59-60, and the drop on k61 is the end card. B(k) = k x 0.638 s.
     hook     k0-8    the coffee's object card, alone; its stock fills to 240 against a limit of 200
                                                            "This coffee has a story."
     links    k8-20   its world, one link per beat: the order that contains it, the customer who ordered it, the order's
                      invoice, the warehouse it is stored in; data points travel the links
                                                            "Marsad sees everything it's linked to."
     orders   k20-28  on the breath, the rest clears; orders flow into the card, faster; the stock counts down
                                                            "Orders come in. The stock goes down."
     alert    k28-36  the last, big order takes it below its limit (188 < 200) on the bar line: the stock turns red and the
                      alert goes out in the app, by email and on WhatsApp (k30-31)
                                                            "It drops below its limit. Marsad alerts you."
     action   k36-52  after the stop, the in-app alert flies into the window's bell as the window rises on Decisions (the
                      badge 3 -> 4); the Riyadh restock recommendation, the page dimmed around it, waiting for approval;
                      one click on «موافقة» on k48: executed (PO-2291), the counters move
                                                            "Then it recommends the next step: reorder." (k36)
                                                            "One approval, and it's done." (k44)
     record   k52-60  (the breakdown) the window leaves; the coffee's card comes back with its history: who, when, what
                      changed, and "can't be edited or deleted, kept 7 years"
                                                            "Every step is recorded, and kept for 7 years."
     end      k61-71  the end card on the drop: "Every product has a story. Marsad knows all of it."
   Truth: the object card, the links, the order stream, the alert, the notification chips and the history card are
   film-space renderings of the manual's concepts (objects, links, actions, approvals, notifications, the history tab and
   the 7-year audit trail), not screens of the current app. The Decisions page, its card, the toast and the counters are
   the app's own. Invented: the stock, limit, quantities, order numbers and times; the approver's role (no names); the bell
   badge 3 -> 4; the callout's words; the "Has invoice" link name (the others are the manual's examples).
   Calm: entrances 0.8-1.0 s on M.ez.dec, glides on M.ez.ioC, three soft punches (k8, k28, k61), nothing on every beat. */
const B=M.B, S16=M.S16, S8=M.S8, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f3=x=>(+x).toFixed(3);
const NS='http://www.w3.org/2000/svg';
// icons the site kit lacks (lucide, in the site kit's stroke style) and WhatsApp's mark (simple-icons)
const LU={
  coffee:'<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  warehouse:'<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  user:'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
};
const WA='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
const icon=(d,s=24,c='currentColor',w=2)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const tile=(col,inner)=>`<div class="gi m-glass">${M.GLASS(col)}${inner}</div>`;
const RED='#A8131C';

/* ---------------- the scene: the coffee's card at the centre, its links, the orders ---------------- */
const S=M.layer();                        // under the app window
const TOP=M.layer('over');                // above it: the alert going out, and the in-app one flying into the bell
const C={x:960,y:460}, CW=560, CH=280;    // the card (stage px), clear of the caption band (y 900-1040)
const NW=350, NH=96;                      // a linked object's card
const T_CARD=B(0.5), T_DIM=B(20), T_RED=B(28), T_OUT=B(35), T_WIN=B(36), T_BELL=B(37);   // the scene clears in the stop (k35)
const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','cs-lines');
svg.setAttribute('width',M.W);svg.setAttribute('height',M.H);S.appendChild(svg);
const gL=document.createElementNS(NS,'g'),gD=document.createElementNS(NS,'g');gD.setAttribute('class','cs-dots');svg.append(gL,gD);
const SEL=n=>document.createElementNS(NS,n);
const set=(e,o)=>{for(const k in o)e.setAttribute(k,typeof o[k]==='number'?f1(o[k]):o[k]);};

// the linked objects: type colours from the app's knowledge map (customer, invoice); order and warehouse get their own
const NODES=[
  {k:'order',   x:280, y:460, beat:8,  col:'#CC0C74', ar:'طلب SO-4821',          en:'Order',     ic:c=>SK.ic('clipboard',30,c,2)},
  {k:'customer',x:280, y:190, beat:9,  col:'#DB4E11', ar:'متاجر الواحة',          en:'Customer',  ic:c=>SK.ic('building',30,c,2)},
  {k:'invoice', x:280, y:730, beat:10, col:'#17A186', ar:'فاتورة INV-10477',      en:'Invoice',   ic:c=>SK.ic('receipt',30,c,2)},
  {k:'store',   x:1640,y:460, beat:11, col:'#149BB0', ar:'مستودع الرياض المركزي', en:'Warehouse', ic:c=>icon(LU.warehouse,30,c,2)},
];
const NK={};NODES.forEach(n=>NK[n.k]=n);
// the links: a = the source end, b = the target end (the arrowhead); each grows from the end that is already on screen.
// Names: the manual's examples ("Contains", "Ordered by", "Stored in"); "Has invoice" follows its reverse-name style.
const LINKS=[
  {n:'order',   ar:'يحتوي',      en:'Contains',    a:{x:280+NW/2+8,y:460},  b:{x:C.x-CW/2-8,y:460}, from:'b'},
  {n:'customer',ar:'طُلب بواسطة', en:'Ordered by',  a:{x:280,y:460-NH/2-8},  b:{x:280,y:190+NH/2+8}, from:'a'},
  {n:'invoice', ar:'له فاتورة',   en:'Has invoice', a:{x:280,y:460+NH/2+8},  b:{x:280,y:730-NH/2-8}, from:'a'},
  {n:'store',   ar:'مخزّن في',    en:'Stored in',   a:{x:C.x+CW/2+8,y:460},  b:{x:1640-NW/2-8,y:460}, from:'a'},
];
const shade=(hex,f)=>K.shade(hex,f);
// ghost cards behind the order and the customer: there are many more of each
const GHOST=[['order',B(13)],['customer',B(14)]].map(([k,t0])=>({k,t0,els:[2,1].map(i=>{const g=M.el('div','cs-ghost',null,S);g.dataset.i=i;return g;})}));
NODES.forEach(n=>{
  n.el=M.el('div','cs-node',tile(n.col,n.ic(shade(n.col,0.8)))+`<div class="nt">${n.ar}</div><div class="ne">${n.en}</div>`,S);
});
LINKS.forEach((l,i)=>{
  const g0=l.from==='a'?l.a:l.b, g1=l.from==='a'?l.b:l.a;
  l.len=Math.hypot(g1.x-g0.x,g1.y-g0.y);
  l.ln=SEL('line');set(l.ln,{x1:g0.x,y1:g0.y,x2:g1.x,y2:g1.y,stroke:'rgba(142,50,195,0.62)','stroke-width':'2.5','stroke-linecap':'round',
    'stroke-dasharray':f1(l.len),'stroke-dashoffset':f1(l.len)});gL.appendChild(l.ln);
  const ang=Math.atan2(l.b.y-l.a.y,l.b.x-l.a.x)*180/Math.PI;
  l.hd=SEL('path');set(l.hd,{d:'M-10 -7 L0 0 L-10 7',fill:'none',stroke:'#8E32C3','stroke-width':'2.6','stroke-linecap':'round','stroke-linejoin':'round',
    transform:`translate(${f1(l.b.x)} ${f1(l.b.y)}) rotate(${f1(ang)})`,opacity:'0'});gL.appendChild(l.hd);
  l.dot=SEL('circle');set(l.dot,{r:'4.5',fill:'#BC59D1',opacity:'0'});gD.appendChild(l.dot);
  l.lb=M.el('div','cs-lbl',`<span class="a">${l.ar}</span><span class="s">·</span><span class="e">${l.en}</span>`,S);
  l.beat=NK[l.n].beat;
});
// the track the orders flow along (from the left edge into the card), drawn as the order column clears
const track=SEL('line');const TR={x1:-40,x2:C.x-CW/2-8,y:460};
set(track,{x1:TR.x2,y1:TR.y,x2:TR.x1,y2:TR.y,stroke:'rgba(142,50,195,0.45)','stroke-width':'2.5','stroke-linecap':'round',
  'stroke-dasharray':f1(TR.x2-TR.x1),'stroke-dashoffset':f1(TR.x2-TR.x1)});gL.appendChild(track);

// the orders: each takes units off the stock as it reaches the card (240 -> 188); the last, big one crosses the limit on k28
const ORD=[22,23,23.75,24.5,25,25.5,26,28].map((k,i)=>({k,q:[5,6,4,7,5,6,5,14][i],id:'SO-'+(4822+i),big:i===7}));
ORD.forEach(o=>{o.el=M.el('div','cs-chip',icon(LU.cart,20,'#6A12B8',2)+`<span class="id">${o.id}</span><span class="q">−${o.q}</span>`,S);
  o.ta=B(o.k);o.tt=o.big?1.4:1.0;});
const STOCK0=240, LIMIT=200, CAP=300;

// the coffee's card (above the chips, which slide in under its edge)
const card=M.el('div','cs-card',tile('#8E32C3',icon(LU.coffee,40,'#6A12B8',2))+
  `<div class="nm">قهوة عربية فاخرة 250 جم</div><div class="en">Premium Arabian Coffee 250g</div>`+
  `<div class="pl">${SK.pill('cat','منتج · Product')}<span class="sk-pill mono">SKU-12345</span></div>`+
  `<span class="al">${SK.pill('hi',SK.ic('bang',16,RED,2.6)+'أقل من الحد')}</span>`+
  `<div class="dv"></div><div class="sr"><span class="lb">المخزون</span><span class="n">240</span></div>`+
  `<div class="lm">الحد الأدنى <b>200</b></div><div class="bar"><i class="fl"></i><i class="fr"></i></div><i class="mk"></i>`+
  ORD.map(o=>`<span class="dl">−${o.q}</span>`).join(''),S);
st(card,{width:CW+'px',height:CH+'px'});
const q=s=>card.querySelector(s);
const cParts=[['.gi',0],['.nm',1],['.en',2],['.pl',3]].map(([s,i])=>[q(s),T_CARD+0.12+i*S16]);   // inside the card as it rises
const cStock=[q('.dv'),q('.sr'),q('.lm'),q('.bar')], cN=q('.sr .n'), cFL=q('.fl'), cFR=q('.fr'), cMK=q('.mk'), cAL=q('.al'), cLMB=q('.lm b');
const cDL=[...card.querySelectorAll('.dl')];
const BARW=CW-56;
st(cMK,{left:f1(28+BARW*(1-LIMIT/CAP)-1.5)+'px'});
cDL.forEach(e=>st(e,{right:'226px'}));
const T_FILL=B(2);
// the stock: counts up as the card loads, then steps down as each order arrives (on the frame's time: no ghosting)
const stockAt=t=>{const T=FQ(t);if(T<T_FILL+1.3)return Math.round(STOCK0*ez.dec(P(T,T_FILL,T_FILL+1.3)));
  return STOCK0-ORD.reduce((a,o)=>a+(T>=o.ta?o.q:0),0);};
const barAt=t=>STOCK0*ez.dec(P(t,T_FILL,T_FILL+1.3))-ORD.reduce((a,o)=>a+o.q*ez.ioC(P(t,o.ta,o.ta+0.35)),0);
const mix=(a,b,p)=>{const A=parseInt(a.slice(1),16),Bc=parseInt(b.slice(1),16);
  return 'rgb('+[16,8,0].map(s=>Math.round(lerp((A>>s)&255,(Bc>>s)&255,p))).join(',')+')';};

M.track(t=>{
  const on=t>=T_CARD-0.01&&t<T_OUT+0.75;S.style.display=on?'':'none';if(!on)return;
  const out=ez.ioC(P(t,T_OUT,T_OUT+0.7));          // the scene recedes in the music's one-beat stop, before the window rises
  const push=ez.ioC(P(t,T_DIM,T_RED));               // while the orders flow in, a slow push in on the card (no move on the beat)
  st(S,{opacity:f3(1-out),transform:`scale(${f3((1+0.1*push)*(1-0.03*out))})`,transformOrigin:`${C.x}px ${C.y}px`});
  // the card: rises in on k0.5 with its parts one per 16th, the stock from k2
  const p=ez.dec(P(t,T_CARD,T_CARD+1.0));
  st(card,{opacity:f3(p),transform:`translate(${C.x-CW/2}px,${f1(C.y-CH/2+(1-p)*28)}px) scale(${f3(0.96+0.04*p)})`});
  for(const [e,t0] of cParts){const u=ez.dec(P(t,t0,t0+0.8));st(e,{opacity:f3(u),transform:`translateY(${f1((1-u)*12)}px)`});}
  const us=ez.dec(P(t,T_FILL-0.1,T_FILL+0.7));cStock.forEach(e=>st(e,{opacity:f3(us)}));
  cMK.style.opacity=f3(ez.dec(P(t,B(2.5),B(2.5)+0.6)));
  cN.textContent=stockAt(t);
  const bw=Math.max(0,barAt(t))/CAP*BARW;st(cFL,{width:f1(bw)+'px'});st(cFR,{width:f1(bw)+'px'});
  // below the limit on k28: the stock turns red and the alert pill appears
  const r=ez.ioC(P(t,T_RED,T_RED+0.45));
  cFR.style.opacity=f3(r);cN.style.color=mix('#1A191E',RED,r);cLMB.style.color=mix('#52505A',RED,r);
  const pa=ez.dec(P(t,T_RED,T_RED+0.8));st(cAL,{opacity:f3(pa),transform:`translateY(${f1((1-pa)*-10)}px)`});
  // each order's "-n" rises from the stock as it lands
  ORD.forEach((o,i)=>{const u=P(t,o.ta,o.ta+0.9);st(cDL[i],{opacity:f3(u>0&&u<1?Math.sin(Math.PI*Math.min(1,u*1.6))*(1-u*0.3):0),
    transform:`translateY(${f1(-20*ez.dec(u))}px)`});});

  // the linked objects: one per beat from k8, each after its link has grown from the side already on screen; on the
  // breath (k20) they clear for the orders
  const dim=ez.ioC(P(t,T_DIM,T_DIM+0.6));
  for(const n of NODES){const u=ez.dec(P(t,B(n.beat),B(n.beat)+0.8));
    const keep=1-dim;
    const dx=(n.x<C.x?-1:1)*(1-u)*18;
    st(n.el,{opacity:f3(u*keep),transform:`translate(${f1(n.x-NW/2+dx)}px,${f1(n.y-NH/2)}px) scale(${f3(0.94+0.06*u)})`});}
  for(const g of GHOST){const n=NK[g.k],u=ez.dec(P(t,g.t0,g.t0+0.9));
    g.els.forEach(e=>{const i=+e.dataset.i;st(e,{opacity:f3(u*(i===1?0.75:0.45)*(1-dim)),
      transform:`translate(${f1(n.x-NW/2-18*i*u)}px,${f1(n.y-NH/2)}px) scale(${f3(1-0.03*i)})`});});}
  for(const l of LINKS){
    const pd=ez.dec(P(t,B(l.beat)-0.42,B(l.beat)));
    const keep=1-dim;
    l.ln.setAttribute('stroke-dashoffset',f1(l.len*(1-pd)));l.ln.setAttribute('opacity',f3(keep));
    // the arrowhead shows once the line has reached its target end
    const ph=l.from==='b'?ez.dec(P(t,B(l.beat)-0.42,B(l.beat)-0.2)):ez.dec(P(t,B(l.beat)-0.12,B(l.beat)+0.15));
    l.hd.setAttribute('opacity',f3(ph*keep));
    const pl=ez.dec(P(t,B(l.beat)+S16,B(l.beat)+S16+0.7));
    const mx=(l.a.x+l.b.x)/2,my=(l.a.y+l.b.y)/2;
    st(l.lb,{opacity:f3(pl*keep),transform:`translate(${f1(mx)}px,${f1(my)}px) translate(-50%,-50%) scale(${f3(0.92+0.08*pl)})`});
    // once every link is on screen, a data point travels each one, source to target (1.6 s a trip, off the beat grid)
    const t0=B(12);
    if(t>=t0&&dim<1){const u=((t-t0)/1.6+LINKS.indexOf(l)*0.29)%1;
      set(l.dot,{cx:lerp(l.a.x,l.b.x,u),cy:lerp(l.a.y,l.b.y,u)});
      l.dot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*ez.dec(P(t,t0,t0+0.5))*(1-dim)));}
    else l.dot.setAttribute('opacity','0');
  }
  // the orders flow in along the track, which grows from the card to the left edge as the order column clears
  const pt=ez.dec(P(t,T_DIM+0.1,T_DIM+0.8));
  track.setAttribute('stroke-dashoffset',f1((TR.x2-TR.x1)*(1-pt)));
  for(const o of ORD){const t0=o.ta-o.tt,on2=t>=t0&&t<o.ta+0.25;o.el.style.display=on2?'':'none';if(!on2)continue;
    const u=ez.ioC(P(t,t0,o.ta)),ab=ez.inC(P(t,o.ta,o.ta+0.22));
    const x=lerp(TR.x1-140,TR.x2+34,u),sc=(o.big?1.34:1.14)*(1-0.35*ab);
    st(o.el,{opacity:f3(1-ab),transform:`translate(${f1(x)}px,${TR.y}px) translate(-50%,-50%) scale(${f3(sc)})`});}
});
M.punch(B(8),{amp:0.008});
M.punch(T_RED,{amp:0.012});

/* ---------------- the alert goes out: in the app, by email, on WhatsApp; the in-app one flies into the window's bell ---------------- */
const NOTE=[
  {x:740, ic:SK.ic('bell',22,'#6A12B8',2), ar:'داخل التطبيق'},
  {x:960, ic:icon(LU.mail,22,'#52505A',2), ar:'البريد الإلكتروني'},
  {x:1180,ic:`<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#25D366" d="${WA}"/></svg>`, ar:'واتساب'},
].map((n,i)=>({...n,t0:B(30)+i*S8,el:M.el('div','cs-note',n.ic+`<span>${n.ar}</span>`,TOP)}));
const NY=232;                             // above the card, which the push has grown by 10%
function bellAt(t){const r=app.toStage('.sk-bell',t);return {x:r.cx,y:r.cy};}
M.track(t=>{
  for(const [i,n] of NOTE.entries()){
    const on=t>=n.t0-0.01&&t<T_BELL+0.1;n.el.style.display=on?'':'none';if(!on)continue;
    const u=ez.dec(P(t,n.t0,n.t0+0.8));
    let x=n.x,y=NY+(1-u)*14,sc=0.96+0.04*u,op=u;
    if(i===0){const pf=ez.ioC(P(t,T_OUT,T_BELL));
      if(pf>0){const b=bellAt(t);x=lerp(n.x,b.x,pf);y=lerp(NY,b.y,pf);sc=lerp(1,0.14,pf);}
      op*=1-ez.inC(P(t,T_BELL-0.35,T_BELL));}
    else op*=1-ez.ioC(P(t,T_OUT,T_OUT+0.6));
    st(n.el,{opacity:f3(op),transform:`translate(${f1(x)}px,${f1(y)}px) translate(-50%,-50%) scale(${f3(sc)})`});
  }
});

/* ---------------- captions: one per scene, EN on the beat and AR an 8th later; each ends 0.5 s before the next ---------------- */
M.caption({at:B(1), out:B(7.2),  en:'This coffee has a story.',                       ar:'لهذه القهوة قصة.'});
M.caption({at:B(8), out:B(19.2), en:"Marsad sees everything it's linked to.",        ar:'مرصد يرى كل ما يرتبط به.'});
M.caption({at:B(20),out:B(27.2), en:'Orders come in. The stock goes down.',           ar:'الطلبات تتوالى… والمخزون ينخفض.'});
M.caption({at:B(28),out:B(35.2), en:'It drops below its limit. Marsad alerts you.',   ar:'ينزل تحت الحد… فينبّهك مرصد فورًا.'});
M.caption({at:B(36),out:B(43.2), en:'Then it recommends the next step: reorder.',     ar:'ثم يقترح الخطوة التالية: إعادة الطلب.'});
M.caption({at:B(44),out:B(51.2), en:"One approval, and it's done.",                   ar:'اعتماد واحد… وتمّ التنفيذ.'});
M.caption({at:B(52),out:B(59.6), en:'Every step is recorded, and kept for 7 years.',  ar:'كل خطوة مسجّلة… وتُحفظ 7 سنوات.'});

/* ---------------- the action, in the real app: the Decisions page ---------------- */
const app=M.app({at:T_WIN,out:B(51),page:'decisions'});   // gone by k52, when the record rises
app.text(T_BELL,'.sk-badge','4');                           // the in-app alert has arrived
app.focus(B(38),'#decCard',{scale:0.95,dy:-190,dur:1.4});   // the Riyadh restock recommendation, the stats above it
app.set(B(40),'#veil',(e,on,t)=>{e.style.opacity=f3(0.75*ez.dec(P(t,B(40),B(40)+0.8))*(1-ez.ioC(P(t,B(48.5),B(48.5)+0.8))));});
app.callout(B(40.5),B(46.5),'text:انخفاض مخزون فرع الرياض',{en:'Waiting for your approval',ar:'بانتظار اعتمادك',side:'top'});
app.click(B(48),'#btnOK',{ax:0.5,ay:0.84});
app.show(B(48.25),'#toast',{from:'none',scale:0.97,dur:0.8});
app.cursorOut(B(50));
app.count(B(49),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(49),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(49),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(49),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.highlight(B(49.5),B(50.7),'#stats .sk-stat:nth-child(3)',{pad:8});

/* ---------------- the record (the breakdown): the coffee's card comes back with its history ---------------- */
const ROWS=[
  {who:'odoo',  wt:'المخزون: من 240 إلى 188',        tm:'12:38'},
  {who:'marsad',wt:'تنبيه: أقل من الحد الأدنى',       tm:'12:38'},
  {who:'mgr',   wt:'اعتماد: إعادة طلب المخزون',       tm:'12:50'},
  {who:'marsad',wt:'طلب توريد PO-2291: تم التنفيذ',   tm:'12:50'},
];
const WHO={odoo:`<span class="av od">odoo</span><span>مزامنة Odoo</span>`,
  marsad:`<span class="av mk"><img src="assets_logo_m.png"></span><span>مرصد</span>`,
  mgr:`<span class="av us">${icon(LU.user,18,'#6011B5',2)}</span><span>مدير العمليات</span>`};
const HW=720, HH=560, HC={x:960,y:458}, HS=1.1;   // shown 10% larger: the rows are the scene
const hist=M.el('div','cs-hist',tile('#8E32C3',icon(LU.coffee,40,'#6A12B8',2))+
  `<div class="nm">قهوة عربية فاخرة 250 جم</div><div class="en">Premium Arabian Coffee 250g</div>`+
  `<div class="pl">${SK.pill('cat','منتج · Product')}<span class="sk-pill mono">SKU-12345</span></div><div class="dv"></div>`+
  `<div class="ht">${SK.ic('history',24,'#6011B5',2)}<span>السجل</span><em>History</em></div>`+
  `<div class="rows">${ROWS.map(r=>`<div class="row"><div class="who">${WHO[r.who]}</div><div class="wt">${r.wt}</div><div class="tm">${r.tm}</div></div>`).join('')}</div>`+
  `<div class="lock">${icon(LU.lock,18,'#52505A',2)}<span>لا يُعدَّل ولا يُحذف · محفوظ 7 سنوات</span></div>`,S);
S.appendChild(hist);
st(hist,{width:HW+'px',height:HH+'px',display:'none'});
const hRows=[...hist.querySelectorAll('.row')], hHT=hist.querySelector('.ht'), hLock=hist.querySelector('.lock');
const T_H=B(52), T_HX=B(59.5);             // gone just before the drop (k61)
const H2=M.layer();                        // the record has its own layer: the scene layer above is gone by then
H2.appendChild(hist);
M.track(t=>{
  const on=t>=T_H-0.01&&t<T_HX+0.95;hist.style.display=on?'':'none';if(!on)return;
  const p=ez.dec(P(t,T_H,T_H+1.0)),x=ez.inC(P(t,T_HX,T_HX+0.9));
  st(hist,{opacity:f3(p*(1-x)),transform:`translate(${HC.x-HW/2}px,${f1(HC.y-HH/2+(1-p)*28)}px) scale(${f3(HS*(0.96+0.04*p)*(1-0.02*x))})`});
  const ph=ez.dec(P(t,B(52.5),B(52.5)+0.8));st(hHT,{opacity:f3(ph),transform:`translateY(${f1((1-ph)*10)}px)`});
  hRows.forEach((e,i)=>{const u=ez.dec(P(t,B(53)+i*S8,B(53)+i*S8+0.8));st(e,{opacity:f3(u),transform:`translateY(${f1((1-u)*12)}px)`});});
  const pk=ez.dec(P(t,B(55.5),B(55.5)+0.8));st(hLock,{opacity:f3(pk),transform:`translateY(${f1((1-pk)*10)}px)`});
});

/* ---------------- the end card on the drop ---------------- */
M.punch(B(61),{amp:0.012});
M.endcard({at:B(61),tag:'Every product has a story. Marsad knows all of it.',tagAr:'كل منتج له قصة… ومرصد يعرفها كاملة.'});
M.start();
