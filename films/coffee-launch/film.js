/* Marsad — "The story of one coffee", launch cut (films/coffee-launch). The coffee story (films/coffee-story-45) rebuilt
   in the grammar of the client's launch-video references (notes.apoorv.xyz/launch-videos, via @apoorveth's post): above
   all azatsol's "Introducing the New Market View" (a dark gradient stage, the product in a glowing glass card) and Logan
   K's Google AI Studio "custom URLs" (big kinetic words on black, one UI part blown up huge, a cursor on the button that
   matters, a URL to finish). Kept from the house rules: English + Arabic on every line, Western digits, real app text,
   no shake (punches <= 1.5%), nothing on every beat, no orb behind the logo, "Book your demo" and marsadnasl.com.
   Music: HoliznaCC0 "Movement" (fit/holizna-movement.mp3, CC0, 96.67 BPM, C minor), cut in two with film.json "edit":
   song beats 24-86 (the end of the stripped intro, then groove A) and 134-150 (the end of groove B, its two-beat silence
   on 136-137, and the stripped groove after it). Film beat k = song k+24 up to k62, then song k+72. B(k) = k x 0.6207 s.
     k0-8    hook      black; "This coffee [cup] has a story." word by word (the stripped intro)
     k8-16   object    the groove starts: the coffee's own card in the app (its properties: «المخزون المتاح» 240, «حد
                       إعادة الطلب» 200) rises in 3D with a glowing edge
     k16-28  links     it moves aside for its links, the app's own rows: "Stored in" (the Riyadh central warehouse),
                       "Ordered on" (SO-1203), "Billed on" (INV-10477), each drawn to the card; "One living model."
     k28-40  alert     the stock becomes the hero number; orders fly in (240 -> 188); below its reorder level on k36 (a
                       hit); "Marsad alerts you.": the app's bell with the decision the monitoring rule raised
     k40-52  decision  the real Decisions card floats in: "It recommends a reorder."; the camera closes in on «موافقة»,
                       the cursor clicks on k48, the app's confirm dialog, «تأكيد الموافقة» (k49.5), «تم بنجاح», the
                       card approved; "You decide."
     k52-62  record    its Decision Passport: the decision, its origin, the review and reason, the ledger, the seal
     k62-66  breath    black; "Every product has a story." held through the music's two-beat silence (k64-65)
     k66-78  end       on the hit after the silence: the Marsad mark and wordmark, "Marsad knows all of it.",
                       marsadnasl.com and "Book your demo"
   Truth (2026-10-11, "apply this to all other videos"): the coffee's card and link rows, the bell's alert, the Decisions
   card, the confirm dialog, «تم بنجاح», the approved card and the passport are the real app's screens, captured from the
   client's bilingual front end in dark mode with sample data labelled "Sample data · بيانات تجريبية" (films/coffee-launch/
   app/capture.js, tools/app_shot.js). Alerts are in the app only, and nothing runs after the approval (the feature
   catalogue). Renderings: the hero number, the orders flying in and the "below" pill, the lines and the dialogs' dimming
   of the card. Before 2026-10-11: rendered cards, alerts by email and WhatsApp, and an executed purchase order.
   Sound (2026-10-11): effects on the scene changes only, as the client asked of the 63 s launch film (2026-09-30: "the UI
   makes no sound"): whooshes into the card (k8), the links (k15.5), the zoom-through (k27.4), Decisions (k40) and the
   passport (k52), the hit as the stock goes below its reorder level (k36) and the end's (k66); the UI's ticks, clicks,
   notification, success chime and lock are gone. */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const NS='http://www.w3.org/2000/svg';
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
const T3=(x,y,w,h,{z=0,rx=0,ry=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) scale(${f3(s)})`;

/* ---------------- the stage: near black, a slow purple mesh gradient whose strength follows the scenes ---------------- */
const BG=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','cl-stage',null,BG);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
const BLOBS=[   // colour, radius, centre and a slow drift (period in seconds); nothing moves on the beat grid
  {c:'95,13,180', r:980, x:430,  y:250, ax:170,ay:90, px:31,py:23,k:1.00},
  {c:'222,13,255',r:760, x:1480, y:860, ax:150,ay:70, px:27,py:35,k:0.62},
  {c:'142,50,195',r:900, x:1500, y:220, ax:120,ay:110,px:41,py:29,k:0.80},
  {c:'60,40,170', r:1050,x:560,  y:930, ax:190,ay:60, px:37,py:43,k:0.70},
  {c:'188,89,209',r:620, x:960,  y:560, ax:90, ay:70, px:23,py:31,k:0.42},
];
const LIGHT=[[0,0.13],[B(7.6),0.13],[B(9.2),0.9],[B(27.4),0.9],[B(28.6),0.5],[B(35.8),0.5],[B(36.4),0.78],[B(39.6),0.72],
  [B(40.6),0.64],[B(51.4),0.64],[B(52.6),0.72],[B(61.2),0.72],[B(62.6),0.07],[B(65.9),0.07],[B(66.05),0.35],[B(67.2),0.95],[B(80),0.95]];
function light(t){for(let i=1;i<LIGHT.length;i++)if(t<=LIGHT[i][0]){const [a,va]=LIGHT[i-1],[b,vb]=LIGHT[i];return lerp(va,vb,ez.ioC(P(t,a,b)));}return LIGHT[LIGHT.length-1][1];}
M.track(t=>{
  const I=light(t);
  g.globalCompositeOperation='source-over';g.fillStyle='#07040D';g.fillRect(0,0,1920,1080);
  g.globalCompositeOperation='screen';
  for(const b of BLOBS){
    const x=b.x+b.ax*Math.sin(2*Math.PI*t/b.px),y=b.y+b.ay*Math.cos(2*Math.PI*t/b.py);
    const gr=g.createRadialGradient(x,y,0,x,y,b.r);
    gr.addColorStop(0,`rgba(${b.c},${f3(0.62*I*b.k)})`);gr.addColorStop(0.5,`rgba(${b.c},${f3(0.2*I*b.k)})`);gr.addColorStop(1,`rgba(${b.c},0)`);
    g.fillStyle=gr;g.fillRect(0,0,1920,1080);
  }
  g.globalCompositeOperation='source-over';
});

/* ---------------- kinetic type: EN words build one by one (blur, rise), the Arabic line follows; all blur out together ---------------- */
function kt(o){
  const e=M.el('div','kt',null,TXT);st(e,{top:o.y+'px'});
  const en=M.el('div','en',null,e);if(o.size)en.style.fontSize=o.size+'px';
  const ws=o.words.map(w=>typeof w==='string'?M.el('span','w',w,en):M.el('span','w'+(w.g?' g':''),w.h||w.t,en));
  const ar=o.ar?M.el('div','ar',o.ar,e):null;if(ar&&o.arSize)ar.style.fontSize=o.arSize+'px';
  const step=o.step??S8, tAr=o.arAt??(o.at+(ws.length-1)*step+S8);
  M.track(t=>{
    const on=t>=o.at-0.01&&t<o.out+0.45;e.style.display=on?'':'none';if(!on)return;
    const x=inc(t,o.out,o.out+0.4);
    ws.forEach((s,i)=>{const t0=o.at+i*step,p=dec(t,t0,t0+0.55);
      st(s,{opacity:f3(p*(1-x)),filter:`blur(${f2((1-p)*14+x*10)}px)`,transform:`translateY(${f1((1-p)*28-x*18)}px)`});});
    if(ar){const p=dec(t,tAr,tAr+0.6);st(ar,{opacity:f3(p*(1-x)),filter:`blur(${f2((1-p)*10+x*8)}px)`,transform:`translateY(${f1((1-p)*18-x*14)}px)`});}
  });
  return e;
}

/* ---------------- a floating UI part: a glowing gradient edge in the 3D space ---------------- */
const D3=M.el('div','cl-3d',null,SCN);
function gwrap(inner,w,h,r){
  const e=M.el('div','gw',`<div class="gb"></div><div class="gr"></div><div class="gi"></div>`,D3);
  st(e,{width:w+'px',height:h+'px',borderRadius:r+'px'});e.querySelector('.gi').appendChild(inner);
  [['.gb',r+10],['.gr',r+2],['.gi',r]].forEach(([s,rr])=>e.querySelector(s).style.borderRadius=rr+'px');
  return e;
}
M.track(t=>{for(const e of D3.children)e.style.setProperty('--a',f1((t*26)%360)+'deg');});   // a slow turn of the edge colours
const glass=(col,inner)=>`${M.GLASS(col)}${inner}`;

/* ================= k0-8 hook ================= */
kt({at:B(0.5),out:B(7),y:360,words:['This','coffee',{h:`<span class="kic">${glass('#8E32C3',icon(LU.coffee,64,'#6A12B8',2))}</span>`},'has','a',{t:'story.',g:1}],
    ar:'لهذه القهوة قصة.'});

/* ================= k8-28 the object, then its links ================= */
// the coffee's own page in the real app (films/coffee-launch/pages/: tools/app_shot.js, dark mode, sample data): its
// properties («المخزون المتاح» 240, «حد إعادة الطلب» 200), then its links. The page's header shows the type's English
// name (the app's), so the film shows its properties card only
const CIMG='films/coffee-launch/pages/';
const crop=(file,w,h,k)=>{const e=M.el('div',null,null);
  st(e,{position:'absolute',left:'0',top:'0',width:f1(w*k)+'px',height:f1(h*k)+'px',background:`#0B0A10 url(${CIMG}${file}) 0 0/100% 100% no-repeat`});return e;};
const PRW=1120, PRH=274, PK=1;                        // the properties card (app px) and its scale here
const CARD=gwrap(crop('record-props.png',PRW,PRH,PK),PRW*PK,PRH*PK,3);
const SV={x:905,y:158};                                // «240» in the card (app px)
const T_IN=B(8), T_SIDE=B(15.5), T_ZOOM=B(27.4);
M.track(t=>{
  const on=t>=T_IN-0.02&&t<T_ZOOM+1.0;CARD.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_IN,T_IN+1.25), ps=io(t,T_SIDE,T_SIDE+1.3), pz=dec(t,T_ZOOM,T_ZOOM+0.9);
  const W=PRW*PK, H=PRH*PK;
  let x=lerp(960,410,ps), y=540+(1-pe)*380, s=lerp(0.8+0.42*pe,0.6,ps);
  let rx=lerp(38,7,pe)-3*ps, ry=lerp(-8+14*P(t,B(9.2),B(15.5)),16,ps);
  // into the hero number: the camera zooms through the card's own stock figure, which glides to where the hero number
  // sits (960,434) while the card fades; the hero grows out of the same spot
  if(pz>0){const s1=s*(1+3.4*pz),
    px=lerp(x+(SV.x*PK-W/2)*s,960,pz),py=lerp(y+(SV.y*PK-H/2)*s,434,pz);
    x=px-(SV.x*PK-W/2)*s1;y=py-(SV.y*PK-H/2)*s1;s=s1;rx*=1-pz;ry*=1-pz;}
  const fo=1-P(t,T_ZOOM+0.5,T_ZOOM+0.9);
  st(CARD,{opacity:f3(pe*fo),transform:T3(x,y,W,H,{rx,ry,s}),filter:pz>0?`blur(${f2(5*pz)}px)`:'none'});
});
M.punch(T_IN,{amp:0.008});

// the links: a verb, then the app's own link row (its «الروابط» tab), each drawn to the card as it lands
const LRW=1070, LRH=44, LKK=1.55, LCUT=380;            // the row's right part (RTL: the record, its link type, its status)
const LK=[
  {v:'Stored in', va:'مخزّن في',      f:'links-wh.png'},
  {v:'Ordered on',va:'مطلوب في',      f:'links-so.png'},
  {v:'Billed on', va:'مفوتر في',      f:'links-inv.png'},
];
const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','cl-lines');svg.setAttribute('width',1920);svg.setAttribute('height',1080);SCN.appendChild(svg);
svg.innerHTML=`<defs><linearGradient id="lkg" x1="0" x2="1"><stop offset="0" stop-color="#BC59D1" stop-opacity="0.35"/><stop offset="1" stop-color="#F29BFF"/></linearGradient>
  <filter id="lkf" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
LK.forEach((l,i)=>{
  l.t0=B(16.6+2.4*i);l.y=330+170*i;
  l.el=M.el('div','lk2',`<div class="v">${l.v}<div class="va">${l.va}</div></div><div class="row"></div>`,SCN);
  l.v1=l.el.querySelector('.v');l.chip=l.el.querySelector('.row');const rc=crop(l.f,LRW,LRH,LKK);
  st(rc,{left:f1(-(LRW-LCUT)*LKK)+'px'});l.chip.appendChild(rc);
  st(l.chip,{width:f1(LCUT*LKK)+'px',height:f1(LRH*LKK)+'px'});
  const p=document.createElementNS(NS,'path');const x0=752,y0=540,x1=1010,y1=l.y+100;
  p.setAttribute('d',`M${x0} ${y0} C ${x0+70} ${y0}, ${x1-80} ${y1}, ${x1-14} ${y1}`);
  p.setAttribute('fill','none');p.setAttribute('stroke','url(#lkg)');p.setAttribute('stroke-width','3');p.setAttribute('stroke-linecap','round');p.setAttribute('filter','url(#lkf)');
  svg.appendChild(p);l.path=p;l.len=0;
  const d=document.createElementNS(NS,'circle');d.setAttribute('r','5');d.setAttribute('fill','#FFD2FF');svg.appendChild(d);l.dot=d;
});
const T_LOUT=B(26.9);            // the links clear before the zoom-through (k27.4)
M.track(t=>{
  for(const l of LK){
    if(!l.len){try{l.len=l.path.getTotalLength();}catch(e){l.len=220;}l.path.setAttribute('stroke-dasharray',f1(l.len));}
    const x=inc(t,T_LOUT,T_LOUT+0.36), on=t>=l.t0-0.5&&t<T_LOUT+0.4;
    l.el.style.display=on?'':'none';l.path.style.display=on?'':'none';l.dot.style.display=on?'':'none';if(!on)continue;
    const pd=dec(t,l.t0-0.35,l.t0+0.1);l.path.setAttribute('stroke-dashoffset',f1(l.len*(1-pd)));l.path.setAttribute('opacity',f3(1-x));
    const pv=dec(t,l.t0,l.t0+0.55),pc=dec(t,l.t0+S8,l.t0+S8+0.6);
    st(l.el,{transform:`translate(1010px,${l.y}px)`,opacity:f3(1-x),filter:x>0?`blur(${f2(8*x)}px)`:'none'});
    st(l.v1,{opacity:f3(pv),filter:`blur(${f2((1-pv)*12)}px)`,transform:`translateY(${f1((1-pv)*24)}px)`});
    st(l.chip,{opacity:f3(pc),filter:`blur(${f2((1-pc)*10)}px)`,transform:`translateX(${f1((1-pc)*40)}px) scale(${f3(0.94+0.06*pc)})`});
    const t1=l.t0+0.2;
    if(t>=t1){const u=((t-t1)/1.5)%1,pt=l.path.getPointAtLength?l.path.getPointAtLength(l.len*u):{x:0,y:0};
      l.dot.setAttribute('cx',f1(pt.x));l.dot.setAttribute('cy',f1(pt.y));l.dot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*(1-x)*dec(t,t1,t1+0.4)));}
    else l.dot.setAttribute('opacity','0');
  }
});
kt({at:B(24.5),out:B(26.8),y:96,size:64,words:['One','living',{t:'model.',g:1}],ar:'نموذج حيّ واحد.',arSize:34});

/* ================= k28-40 the stock as the hero number; orders take it below its limit; the alert goes out ================= */
const hero=M.el('div','hero',`<div class="lb">المخزون المتاح<span>STOCK</span></div><div class="n">240</div>`+
  `<div class="bar"><i class="fl"></i><i class="fr"></i></div><i class="mk"></i><div class="ml">حد إعادة الطلب <b>200</b> · Reorder level</div>`+
  `<span class="dl"></span>`,SCN);
const hN=hero.querySelector('.n'),hFL=hero.querySelector('.fl'),hFR=hero.querySelector('.fr'),hMk=hero.querySelector('.mk'),hMl=hero.querySelector('.ml'),hDl=hero.querySelector('.dl');
const HW=900;st(hMk,{left:f1(100+HW*(1-200/300)-1.5)+'px',top:'336px'});st(hMl,{left:f1(100+HW*(1-200/300)-150)+'px',top:'382px'});   // the bar runs 100-1000 px, y 348-366
const ORD=[29,30,31,31.5,32,33,34,36].map((k,i)=>({k,q:[5,6,4,7,5,6,5,14][i],id:'SO-'+(4822+i),big:i===7,side:i%2?1:-1}));
ORD.forEach(o=>{o.ta=B(o.k);o.tt=o.big?1.1:0.85;o.el=M.el('div','ochip',icon(LU.cart,22,'#FFD2FF',2)+`<span class="id">${o.id}</span><span class="q">−${o.q}</span>`,SCN);});
const T_HERO=B(27.4)+0.52, T_RED=B(36), T_HOUT=B(39.4);
const stockAt=t=>{const T=FQ(t);return 240-ORD.reduce((a,o)=>a+(T>=o.ta?o.q:0),0);};
const barAt=t=>240-ORD.reduce((a,o)=>a+o.q*io(t,o.ta,o.ta+0.3),0);
const mixc=(a,b,p)=>{const A=parseInt(a.slice(1),16),C=parseInt(b.slice(1),16);return 'rgb('+[16,8,0].map(s=>Math.round(lerp((A>>s)&255,(C>>s)&255,p))).join(',')+')';};
const alertP=M.el('div','alertp',SK.ic('bang',24,'#FFB3BD',2.6)+'تحت حد إعادة الطلب<i>· Below its reorder level</i>',SCN);
M.track(t=>{
  const on=t>=T_HERO-0.02&&t<T_HOUT+0.6;hero.style.display=on?'':'none';alertP.style.display=on?'':'none';
  for(const o of ORD)o.el.style.display='none';
  if(!on)return;
  const p=dec(t,T_HERO,T_HERO+0.9),x=inc(t,T_HOUT,T_HOUT+0.5);
  st(hero,{opacity:f3(p*(1-x)),filter:`blur(${f2((1-p)*12+x*10)}px)`,transform:`translate(410px,250px) scale(${f3(0.62+0.38*p)})`,transformOrigin:'550px 184px'});
  hN.textContent=stockAt(t);
  const bw=Math.max(0,barAt(t))/300*HW;st(hFL,{width:f1(bw)+'px'});st(hFR,{width:f1(bw)+'px'});
  const r=io(t,T_RED,T_RED+0.4);hFR.style.opacity=f3(r);hN.style.color=mixc('#FFFFFF','#FF6B7D',r);
  // each order's "-n" rises beside the number as it lands
  let dl=null;for(const o of ORD){if(t>=o.ta&&t<o.ta+0.9)dl=o;}
  if(dl){const u=P(t,dl.ta,dl.ta+0.9);hDl.textContent='−'+dl.q;st(hDl,{opacity:f3(Math.sin(Math.PI*Math.min(1,u*1.5))),left:'800px',transform:`translateY(${f1(-40*ez.dec(u))}px)`});}
  else hDl.style.opacity='0';
  for(const o of ORD){const t0=o.ta-o.tt;if(t<t0||t>=o.ta+0.25)continue;o.el.style.display='';
    const u=io(t,t0,o.ta),ab=inc(t,o.ta,o.ta+0.22),sx=o.side<0?-260:2180,ex=o.side<0?700:1220;
    st(o.el,{opacity:f3((1-ab)*dec(t,t0,t0+0.15)),transform:`translate(${f1(lerp(sx,ex,u))}px,${f1(lerp(470+o.side*120,452,u))}px) translate(-50%,-50%) scale(${f3((o.big?1.35:1.1)*(1-0.4*ab))})`});}
  const pa=dec(t,T_RED,T_RED+0.7);
  st(alertP,{opacity:f3(pa*(1-x)),transform:`translate(960px,${f1(700+(1-pa)*18)}px) translate(-50%,0) scale(${f3(0.94+0.06*pa)})`});
});
kt({at:B(28.6),out:B(35.2),y:96,size:64,words:['Orders','come','in.'],ar:'الطلبات تتوالى.',arSize:34});
kt({at:B(36.4),out:B(39.2),y:96,size:64,words:[{t:'Marsad',g:1},'alerts','you.'],ar:'مرصد ينبّهك.',arSize:34,step:S16*1.5});
M.punch(T_RED,{amp:0.012});
// the alert: the decision the monitoring rule raised, pushed to the person accountable: the app's own bell (alerts are in
// the app only; email is coming)
const BELL=gwrap(crop('bell-pop.png',384,145,1.55),384*1.55,145*1.55,3);
const T_BELL=B(37.2);
M.track(t=>{const on=t>=T_BELL-0.01&&t<T_HOUT+0.6;BELL.style.display=on?'':'none';if(!on)return;
  const p=dec(t,T_BELL,T_BELL+0.6),x=inc(t,T_HOUT,T_HOUT+0.5);
  st(BELL,{opacity:f3(p*(1-x)),filter:p<1||x>0?`blur(${f2((1-p)*8+x*8)}px)`:'none',transform:T3(960,880+(1-p)*30,384*1.55,145*1.55,{rx:lerp(20,6,p),s:0.94+0.06*p})});});

/* ================= k40-52 the real Decisions card: the recommendation; «موافقة», the app's confirm, «تم بنجاح» ================= */
// The decision the monitoring rule raised (its own card, films/coffee-launch/pages/): «موافقة» opens the app's confirm
// dialog; «تأكيد الموافقة» gives «تم بنجاح»; the card is approved. Nothing runs after the approval (the catalogue)
const DCW=1120, DCH=206, DKK=1.25;
const dIn=crop('decisions-card.png',DCW,DCH,DKK), dAfter=crop('after-card.png',DCW,DCH,DKK);
const DWRAP=M.el('div',null,null);st(DWRAP,{position:'absolute',left:'0',top:'0',width:f1(DCW*DKK)+'px',height:f1(DCH*DKK)+'px'});DWRAP.append(dIn,dAfter);
const DEC=gwrap(DWRAP,DCW*DKK,DCH*DKK,3);
const BTN={x:(53-32+53.35)*DKK,y:(497-476+19)*DKK};   // «موافقة»'s centre in the card
const QK=1.7, dlg=M.el('div',null,null,SCN), dlgC=crop('confirm-dialog.png',448,322,QK), dlgD=crop('done-dialog.png',448,110,QK);
st(dlg,{position:'absolute',left:'0',top:'0',width:f1(448*QK)+'px',height:f1(322*QK)+'px'});dlg.append(dlgC,dlgD);
st(dlgD,{top:f1((322-110)/2*QK)+'px'});[dlgC,dlgD].forEach(e=>e.className='cl-dlg');
const OKB={x:960-448*QK/2+(521-496+76.55)*QK, y:540-322*QK/2+(506.5-253.5+22)*QK};   // «تأكيد الموافقة» on screen
const T_DIN=B(40), T_ZIN=B(44), T_CLICK=B(48), T_BACK=B(48.4), T_DLG=B(48.25), T_OK=B(49.5), T_DONE=B(49.75), T_CNT=B(50.75), T_DOUT=B(51.4);
const ZS=2.6, DW=DCW*DKK, DH=DCH*DKK;
M.track(t=>{
  const on=t>=T_DIN-0.02&&t<T_DOUT+0.7;DEC.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_DIN,T_DIN+1.2), pz=io(t,T_ZIN,T_ZIN+1.5)*(1-io(t,T_BACK,T_BACK+1.3)), x=inc(t,T_DOUT,T_DOUT+0.6);
  // the zoom keeps «موافقة» centred: scale about the button, which glides to the stage's centre
  const s=lerp(1,ZS,pz), cx=lerp(960,960-(BTN.x-DW/2)*s,pz), cy=lerp(560,540-(BTN.y-DH/2)*s,pz);
  const rx=lerp(lerp(30,7,pe),0,pz), ry=lerp(-4+7*P(t,B(41),B(51)),0,pz), dim=0.55*dec(t,T_DLG,T_DLG+0.3)*(1-dec(t,T_CNT,T_CNT+0.3));
  st(DEC,{opacity:f3(pe*(1-x)),filter:dim>0.001?`blur(${f2(2*dim)}px) brightness(${f3(1-dim)})`:'none',transform:T3(cx,cy+(1-pe)*260-x*160,DW,DH,{rx,ry,s})});
  dAfter.style.opacity=f3(dec(t,T_CNT,T_CNT+0.35));
});
M.track(t=>{                                           // the confirm pops in on the click's result; «تم بنجاح» on the confirm's
  const on=t>=T_DLG-0.02&&t<T_CNT+0.35;dlg.style.display=on?'':'none';if(!on)return;
  const pi=dec(t,T_DLG,T_DLG+0.3), po=io(t,T_CNT,T_CNT+0.3);
  st(dlg,{opacity:f3(pi*(1-po)),transform:T3(960,540+(1-pi)*24,448*QK,322*QK,{s:0.96+0.04*pi})});
  const pd=dec(t,T_DONE,T_DONE+0.2);dlgC.style.opacity=f3(1-pd);dlgD.style.opacity=f3(pd);
});
kt({at:B(40.6),out:B(43.6),y:96,size:64,words:['It','recommends','a',{t:'reorder.',g:1}],ar:'ويقترح إعادة الطلب.',arSize:34,step:S16*1.5});
kt({at:B(49.9),out:B(51.7),y:880,size:64,words:['You',{t:'decide.',g:1}],ar:'وأنت تقرّر.',arSize:34});
M.punch(T_OK,{amp:0.008});
// the cursor: glides in, presses «موافقة» (k48), then the dialog's «تأكيد الموافقة» (k49.5); one soft ring each
const cur=M.el('div','cur',`<svg viewBox="0 0 32 32" width="70" height="70"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#1A0F2E" stroke-width="1.6" stroke-linejoin="round"/></svg>`,SCN);
const ring=M.el('div','ring',null,SCN);
M.track(t=>{
  const on=t>=B(46)&&t<B(50.6), rg=[T_CLICK,T_OK].find(c=>t>=c&&t<c+0.6);
  cur.style.display=on?'':'none';ring.style.display=rg!=null?'':'none';if(!on)return;
  const pm=io(t,B(46),T_CLICK-0.08), pm2=io(t,T_DLG+0.15,T_OK-0.08);
  const tx=lerp(lerp(1560,972,pm),OKB.x,pm2), ty=lerp(lerp(1010,566,pm),OKB.y,pm2);
  const press=Math.max(Math.sin(Math.PI*P(t,T_CLICK-0.02,T_CLICK+0.2)),Math.sin(Math.PI*P(t,T_OK-0.02,T_OK+0.2))), out=inc(t,B(50),B(50.6));
  st(cur,{opacity:f3(dec(t,B(46),B(46.4))*(1-out)),transform:`translate(${f1(tx-12)}px,${f1(ty-6)}px) scale(${f3(1-0.12*press)})`});
  if(rg!=null){const pr=P(t,rg,rg+0.6),R=20+100*ez.dec(pr);
    st(ring,{opacity:f3(0.8*(1-pr)),width:f1(2*R)+'px',height:f1(2*R)+'px',transform:`translate(${f1(tx-R)}px,${f1(ty-R)}px)`});}
});

/* ================= k52-62 the record: the decision's passport ================= */
// Its Decision Passport (the app's own, films/coffee-launch/pages/passport-*): the decision, its origin (a monitoring
// rule, no AI model), the person's review and reason, its ledger (raised #4, approved #5) and the green seal, which
// lights on k57
const PPW=672, PPH=992.1, PPK=0.76;
const PASS=gwrap(crop('passport-modal.png',PPW,PPH,PPK),PPW*PPK,PPH*PPK,3);
const SEALB=[405-384,250-136,630,63.5];                // the seal in the passport (app px)
const sealG=M.el('div','cl-seal',null,PASS.querySelector('.gi'));
st(sealG,{left:f1(SEALB[0]*PPK)+'px',top:f1(SEALB[1]*PPK)+'px',width:f1(SEALB[2]*PPK)+'px',height:f1(SEALB[3]*PPK)+'px'});
const T_RIN=B(52), T_ROUT=B(61.3);
M.track(t=>{
  const on=t>=T_RIN-0.02&&t<T_ROUT+0.7;PASS.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_RIN,T_RIN+1.2),x=inc(t,T_ROUT,T_ROUT+0.6),pd=P(t,T_RIN,T_ROUT);
  const H=PPH*PPK, top=lerp(282,236,pd);               // the whole passport under the line, drifting up
  st(PASS,{opacity:f3(pe*(1-x)),filter:x>0?`blur(${f2(10*x)}px)`:'none',
    transform:T3(960,top+H/2+(1-pe)*300,PPW*PPK,H,{rx:lerp(28,6,pe),ry:-5+9*P(t,B(53),B(61.3)),s:1.05})});
  sealG.style.opacity=f3(dec(t,B(57),B(57)+0.5)*(1-0.5*io(t,B(58),B(59.5))));
});
kt({at:B(52.6),out:B(61),y:96,size:64,words:['Every','step,','on','the',{t:'record.',g:1}],ar:'كل خطوة… في السجل.',arSize:34,step:S16*1.5});
// the app's screens show sample data: labelled while they are up
const SAMPLE=M.el('div','rx-label','<span class="en">Sample data</span><span class="sep">·</span><span class="ar">بيانات تجريبية</span>',TXT);
M.track(t=>{const v=Math.max(dec(t,T_IN,T_IN+0.5)*(1-io(t,B(26.9),B(27.4))),dec(t,T_BELL,T_BELL+0.5)*(1-io(t,T_ROUT,T_ROUT+0.6)));
  SAMPLE.style.display=v>0.001?'':'none';SAMPLE.style.opacity=f3(v);});

/* ================= k62-66 the breath: black, the line held through the music's two-beat silence ================= */
kt({at:B(62),out:B(65.3),y:400,size:112,words:['Every','product','has','a',{t:'story.',g:1}],ar:'كل منتج له قصة.',step:S16*1.5});

/* ================= k66-78 the end card, on the hit after the silence ================= */
const end=M.el('div','end',`<img class="gl" src="assets_logo_m.png"><img class="mk" src="assets_logo_m.png">`+
  `<img class="wm" src="assets_logo_wordmark_white.png">`+
  `<div class="cta"><span class="url">marsadnasl.com</span><span class="book"><span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span></span></div>`,SCN);
const eMk=end.querySelector('.mk'),eGl=end.querySelector('.gl'),eWm=end.querySelector('.wm'),eUrl=end.querySelector('.url'),eBook=end.querySelector('.book');
const T_END=B(66);
M.track(t=>{
  const on=t>=T_END-0.02;end.style.display=on?'':'none';if(!on)return;
  // the mark lands on the hit: in over 0.7 s, a 3% overshoot, its own glow blooms and settles (no disc behind it)
  const p=P(t,T_END,T_END+0.75), sc=0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  st(eMk,{opacity:f3(ez.dec(Math.min(1,p*1.6))),transform:`scale(${f3(sc)})`});
  st(eGl,{opacity:f3(0.9*dec(t,T_END,T_END+0.3)*(1-0.55*io(t,T_END+0.4,T_END+2.0))),transform:`scale(${f3(sc*1.02)})`});
  const pw=dec(t,B(66.8),B(66.8)+0.9);st(eWm,{opacity:f3(pw),transform:`translateY(${f1((1-pw)*16)}px)`});
  const pu=dec(t,B(69.3),B(69.3)+0.8),pb=dec(t,B(69.8),B(69.8)+0.8);
  st(eUrl,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*18)}px) scale(${f3(0.95+0.05*pu)})`});
  st(eBook,{opacity:f3(pb),transform:`translateY(${f1((1-pb)*18)}px) scale(${f3(0.95+0.05*pb)})`});
});
kt({at:B(67.6),out:B(90),y:572,size:56,words:[{t:'Marsad',g:1},'knows','all','of','it.'],ar:'ومرصد يعرفها كاملة.',arSize:32,step:S16*1.5});
M.punch(T_END,{amp:0.015});
M.start();
