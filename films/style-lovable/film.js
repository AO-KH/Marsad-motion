/* Marsad — style sample: Lovable (films/style-lovable). About 28 s of the Marsad film told in the grammar of Lovable's
   launch video (the client's reference 02_Lovable.mp4): a vivid gradient that runs from black through blue and magenta to
   orange; a big dark prompt card whose question types in bold, its newest word in a gradient; a white cartoon hand that
   clicks; the app's light UI in close-up on lavender; big white one-line type shots; a 3D collage of the app's pages; the
   logo in white, small in the music's silence and big on the hit. Cuts, not dissolves, about one shot per 2-6 beats.
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects only on the transitions.
   Music: HoliznaCC0 "Movement" (fit/holizna-movement.mp3, CC0, 96.67 BPM), film.json "edit": song beats 24-57 (the end of
   the stripped intro, then groove A from song 32 = film k8) and 134-145 (the last two beats of groove B, its two-beat
   silence on film k36-37, the hit on film k38). B(k) = k x 0.6207 s.
     k0-3.5    logo      the mark and wordmark in white on the gradient, a slow push, then a zoom through
     k3.5-8    sources   the eight source tiles fly past in depth; the mark waits in the middle
     k8-14     prompt    (the groove starts) the dark card: the Arabic question types, its English follows; the camera
                         pushes toward send as the hand comes, and the hand clicks it
     k14-20    answer    the Assistant's answer streams on lavender, from the data, with its source chip
     k20-22    type      "Built on your data." «مبني على بياناتك.»
     k22-24    list      the Decisions statuses in close-up; the hand on «قيد المراجعة» 6
     k24-28    decide    the counters and the Decisions card; the hand clicks «موافقة»: executed, PO-2291; approved
                         0 -> 1, under review 6 -> 5
     k28-31.5  type      "Every system." «كل الأنظمة.» / "One living model." «نموذج حيّ واحد.»
     k31.5-36  collage   the app's ten pages fly in and gather in 3D
     k36-38    breath    the small white logo, in the music's two-beat silence
     k38-46    end       on the hit: the big logo, marsadnasl.com, "Book your demo · احجز عرضك التجريبي"
   Truth: the Decisions labels, counts, card and toast, the Assistant's name, input and placeholder, «مبني على بياناتك»
   and the pages in the collage are the app's own (site kit, site_pages/). Renderings: the dark prompt card (the
   Assistant's input restyled as the reference's card, with an "Odoo" source chip), the question and its answer (as in
   the 63 s film), the hand cursor, the white version of the mark. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
// a camera on a shot (transform-origin 0 0): zoom by Z about the stage point F, which sits at the screen point S
const camT=(F,S,Z)=>`translate(${f1(S.x-F.x*Z)}px,${f1(S.y-F.y*Z)}px) scale(${f3(Z)})`;

/* the shots (hard cuts: the renderer keeps each frame's motion-blur samples on one side of a cut) */
const K_FLY=B(3.5), K_CARD=B(8), K_ANS=B(14), K_T1=B(20), K_LIST=B(22), K_DEC=B(24), K_T2=B(28), K_T3=B(29.75), K_COL=B(31.5),
  K_LOGO=B(36), K_END=B(38);
window.CUTS=[K_FLY,K_CARD,K_ANS,K_T1,K_LIST,K_DEC,K_T2,K_T3,K_COL,K_LOGO,K_END];
const inShot=(t,a,b)=>t>=a&&t<b;

/* ---------------- the stage: Lovable's gradient (black, blue, violet, magenta, pink, orange), or lavender for the UI ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','lv-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=960;cv.height=540;const g=cv.getContext('2d');   // half size: the field is soft
const BLOBS=[   // colour, centre and radius in stage px, strength, a slow drift (periods in seconds; nothing on the beat grid)
  {c:'47,91,255',  x:230, y:820, r:980, a:1.00,px:29,py:23,ax:90,ay:50},
  {c:'122,58,255', x:700, y:700, r:760, a:0.80,px:31,py:37,ax:80,ay:60},
  {c:'222,13,255', x:1160,y:760, r:780, a:0.90,px:27,py:33,ax:90,ay:50},
  {c:'255,64,150', x:1540,y:880, r:820, a:0.95,px:35,py:25,ax:70,ay:60},
  {c:'255,110,50', x:1820,y:1160,r:760, a:1.00,px:23,py:31,ax:60,ay:40},
  {c:'255,80,210', x:1820,y:120, r:700, a:0.75,px:33,py:27,ax:70,ay:60},
];
const LOOK={   // the black side: a linear fade from (ax,ay) (black) to (bx,by) (clear); I: the colours' strength
  logo:{ax:520,ay:-60, bx:1180,by:820, I:1},
  fly: {ax:900,ay:120, bx:1100,by:1180,I:0.7},
  card:{ax:960,ay:330, bx:960, by:1060,I:1},
  type:{ax:420,ay:-80, bx:1150,by:760, I:1},
  col: {ax:600,ay:-120,bx:1200,by:900, I:1},
  end: {ax:520,ay:-160,bx:1160,by:860, I:1},
};
const SHOTS=[[0,'logo'],[K_FLY,'fly'],[K_CARD,'card'],[K_ANS,'light'],[K_T1,'type'],[K_LIST,'light'],[K_T2,'type'],[K_COL,'col'],[K_LOGO,'end']];
const lookAt=t=>{let k=SHOTS[0][1];for(const [a,n] of SHOTS)if(t>=a)k=n;return k;};
function rad(x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);
  gr.addColorStop(0.55,`rgba(${c},${f3(a*0.55)})`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.fillRect(0,0,1920,1080);}
M.track(t=>{
  const k=lookAt(t);
  g.setTransform(0.5,0,0,0.5,0,0);g.globalCompositeOperation='source-over';
  if(k==='light'){                         // the UI close-ups: a pale lavender with a pink and a periwinkle haze
    g.fillStyle='#EEE8F4';g.fillRect(0,0,1920,1080);
    rad(1540+60*Math.sin(t/5),920,1000,'250,208,236',0.9);rad(300,120+40*Math.cos(t/6),900,'214,220,252',0.85);rad(960,520,760,'247,243,251',0.7);
    return;
  }
  const L=LOOK[k];
  g.fillStyle='#000';g.fillRect(0,0,1920,1080);
  for(const b of BLOBS)rad(b.x+b.ax*Math.sin(2*Math.PI*t/b.px),b.y+b.ay*Math.cos(2*Math.PI*t/b.py),b.r,b.c,b.a*L.I);
  const lg=g.createLinearGradient(L.ax,L.ay,L.bx,L.by);
  lg.addColorStop(0,'rgba(0,0,0,1)');lg.addColorStop(0.45,'rgba(0,0,0,0.8)');lg.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=lg;g.fillRect(0,0,1920,1080);
});

/* ---------------- the pieces ---------------- */
const HAND=`<svg viewBox="-2 -2 68 76"><path d="M26 4c2.8 0 5 2.2 5 5v17.2c.9-1.1 2.3-1.8 3.8-1.8 2.5 0 4.6 2 4.7 4.5.9-.9 2.1-1.4 3.5-1.4 2.6 0 4.7 2.1 4.7 4.7v.6c.8-.6 1.8-.9 2.9-.9 2.7 0 4.9 2.2 4.9 4.9V48c0 10-8.1 18-18 18h-6.6c-5.4 0-10.4-2.9-13.2-7.5L9.6 46.2c-1.4-2.3-.7-5.3 1.6-6.7 2.2-1.3 5-.8 6.5 1.3L21 45V9c0-2.8 2.2-5 5-5z" fill="#fff" stroke="#111" stroke-width="3.2" stroke-linejoin="round"/>`+
  `<path d="M31 26.5v8.5M39.5 29v8M48 33v7M33 50.5v8M39 50.5v8M45 50.5v8" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`;
const TIP={x:48.6,y:10.4};              // the fingertip in the 118 x 133 px hand: the point that clicks
// a hand in a shot: path(t) -> {x,y} of the fingertip (stage px); press(t) 0..1; tilt in degrees
function hand(parent){const e=M.el('div','lv-hand',HAND,parent);const tap=M.el('div','lv-tap',null,parent);parent.insertBefore(tap,e);return {e,tap};}
function drawHand(h,x,y,o,press,tapP){
  st(h.e,{opacity:f3(o),transform:`translate(${f1(x-TIP.x)}px,${f1(y-TIP.y)}px) rotate(-14deg) scale(${f3(1-0.1*press)})`});
  const a=tapP>0&&tapP<1;h.tap.style.display=a?'':'none';
  if(a)st(h.tap,{opacity:f3(0.9*(1-tapP)),transform:`translate(${f1(x-180)}px,${f1(y-180)}px) scale(${f3(0.35+0.75*ez.dec(tapP))})`});
}
const ARROW=`<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
const DB=`<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>`;

/* type shots: big white words, one per 16th, the Arabic line after them; a hard cut out */
function lt(o){
  const e=M.el('div','lt',null,TXT);st(e,{top:o.y+'px'});
  const en=M.el('div','en',null,e);if(o.size)en.style.fontSize=o.size+'px';
  const ws=o.words.map(w=>M.el('span','w',w,en));
  const ar=M.el('div','ar',o.ar,e);if(o.arSize)ar.style.fontSize=o.arSize+'px';
  const T=ws.map((_,i)=>o.at+i*(o.step??S16)), tAr=o.arAt??(T[T.length-1]+S16);
  M.track(t=>{
    if(!show(e,inShot(t,o.at,o.out)))return;
    const push=1+0.035*P(t,o.at,o.out);                       // a slow push while it holds
    en.style.transform=ar.style.transform='';e.style.transform=`scale(${f3(push)})`;e.style.transformOrigin='960px 50%';
    ws.forEach((s,i)=>{const p=dec(t,T[i],T[i]+0.3);st(s,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*16)}px)`:'none',transform:`translateY(${f1((1-p)*26)}px) scale(${f3(0.9+0.1*p)})`});});
    const p=dec(t,tAr,tAr+0.34);st(ar,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*10)}px)`:'none',transform:`translateY(${f1((1-p)*16)}px)`});
  });
}

/* ================= k0-3.5 the logo, white on the gradient ================= */
const S1=M.el('div','lv-shot',null,SCN);
const LG1=M.el('div','lv-logo',`<img class="m" src="assets_logo_m.png"><img class="wm" src="assets_logo_wordmark_white.png">`,S1);
st(LG1.querySelector('.m'),{left:'885px',top:'426px',width:'150px'});st(LG1.querySelector('.wm'),{left:'795px',top:'564px',width:'330px'});
M.track(t=>{
  if(!show(S1,t<K_FLY))return;
  const p=dec(t,0.05,0.95), z=P(t,B(2.75),K_FLY);
  st(LG1,{opacity:f3(p*(1-P(z,0.5,1))),filter:p<1||z>0?`blur(${f2((1-p)*14+z*12)}px)`:'none',transformOrigin:'960px 500px',
    transform:`scale(${f3((0.94+0.06*p)*(1+0.05*P(t,0,B(2.75)))*(1+2.6*ez.inC(z)))})`});
});

/* ================= k3.5-8 the sources: the eight tiles fly past in depth; the mark waits in the middle ================= */
const S2=M.el('div','lv-shot',null,SCN), D2=M.el('div','lv-3d',null,S2);
const FT=[...Array(14).keys()].map(i=>{const a=-Math.PI/2+i*2.4+0.35, R=150+120*((i*5)%7)/6;   // spread round the centre
  return {i,x:960+R*Math.cos(a)*1.5,y:540+R*Math.sin(a),t0:K_FLY-0.35+i*0.19,el:M.el('div','k-tile m-glass',K.tile(K.TILES[i%8]),D2)};});
const fm=M.el('div','lv-fm',`<img src="assets_logo_m.png" style="width:100%;display:block;filter:drop-shadow(0 0 30px rgba(222,13,255,0.55)) drop-shadow(0 0 90px rgba(122,58,255,0.5));">`,D2);
st(fm,{width:'240px',height:'183px'});
M.track(t=>{
  if(!show(S2,inShot(t,K_FLY,K_CARD)))return;
  for(const f of FT){
    const u=t-f.t0, z=-1900+1250*u;                         // out of the depth and past the camera: the perspective spreads them
    const o=P(u,0,0.35)*(1-P(z,420,820)), bl=Math.min(18,Math.max(0,Math.abs(z+250)-150)/60);   // sharp around z=-250
    const vis=u>0&&o>0.002;f.el.style.display=vis?'':'none';if(!vis)continue;
    st(f.el,{opacity:f3(o),filter:bl>0.3?`blur(${f2(bl)}px)`:'none',transform:T3(f.x,f.y,112,112,{z,rx:10*Math.sin(u+f.i),ry:14*Math.cos(0.8*u+f.i),s:2.3})});
  }
  const pm=dec(t,B(5.25),B(5.25)+0.9), zf=inc(t,B(7.2),K_CARD);   // the mark comes out of the dark, then we fly into it
  st(fm,{opacity:f3(pm*(1-P(zf,0.6,1))),filter:pm<1||zf>0?`blur(${f2((1-pm)*12+zf*14)}px)`:'none',
    transform:T3(960,540,240,183,{z:lerp(-900,-200,pm)+1400*zf,s:1.2})});
});

/* ================= k8-14 the prompt: the dark card; the question types; the hand clicks send ================= */
const S3=M.el('div','lv-shot',null,SCN);
const Q='لماذا انخفضت مبيعات الرياض هذا الأسبوع؟', QEN=['Why','did','Riyadh','sales','drop','this','week?'];
const card=M.el('div','lv-card',`<img class="lg" src="assets_logo_m.png"><div class="q"><span class="ty"></span><span class="tg"></span><i class="caret"></i></div>`+
  `<div class="en">${QEN.map(w=>`<span class="w">${w}</span>`).join(' ')}</div>`+
  `<div class="plus">${SK.ic('plus',56,'#fff',2)}</div><div class="chip"><span class="db">${DB}</span><span>Odoo</span></div>`+
  `<div class="send">${ARROW}</div>`,S3);
st(card,{left:'210px',top:'120px'});
const cTy=card.querySelector('.ty'),cTg=card.querySelector('.tg'),cCa=card.querySelector('.caret'),cEn=[...card.querySelectorAll('.en .w')],cSend=card.querySelector('.send');
const H3=hand(S3);
const SEND={x:210+90+62,y:120+648+62};
const T_TYPE=B(8.35), CPS=20, T_TDONE=T_TYPE+Q.length/CPS, T_HAND=B(11.6), T_TAP=B(13), T_PUSH=B(11.9);
let lastQ='';
M.track(t=>{
  if(!show(S3,inShot(t,K_CARD,K_ANS)))return;
  const pe=dec(t,K_CARD,K_CARD+0.4);
  // the camera: a push toward send as the hand comes, then a slow drift on after the click (a fast zoom would strobe)
  const pz=io(t,T_PUSH,T_TAP), pf=ez.outC(P(t,T_TAP,K_ANS));
  const Z=(0.97+0.03*pe)*(1+0.55*pz)*(1+0.1*pf), Sx=lerp(SEND.x,780,pz), Sy=lerp(SEND.y,690,pz);
  st(S3,{transform:camT(SEND,{x:Sx,y:Sy},Z),opacity:f3(pe),filter:pe<1?`blur(${f2((1-pe)*6)}px)`:'none'});
  // typing: the newest word (or two, while it is short) in the gradient; the text turns white once it is done
  const n=Math.max(0,Math.min(Q.length,Math.floor((FQ(t)-T_TYPE)*CPS))), s=Q.slice(0,n);
  let cut=s.lastIndexOf(' ')+1;if(n-cut<4&&cut>0)cut=s.lastIndexOf(' ',cut-2)+1;
  if(FQ(t)>=T_TDONE+0.35)cut=n;
  const key=n+'|'+cut;if(key!==lastQ){cTy.textContent=s.slice(0,cut);cTg.textContent=s.slice(cut);lastQ=key;}
  cCa.style.opacity=t<T_TAP?'1':'0';
  cEn.forEach((w,i)=>{const p=dec(t,T_TDONE-0.2+i*S32*1.5,T_TDONE+0.15+i*S32*1.5);st(w,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*8)}px)`:'none',transform:`translateY(${f1((1-p)*14)}px)`});});
  // the hand: in from the lower left, onto send; the button gives on the click
  const ph=io(t,T_HAND,T_TAP-0.1), press=Math.sin(Math.PI*P(t,T_TAP-0.06,T_TAP+0.16));
  drawHand(H3,lerp(760,SEND.x+6,ph),lerp(1260,SEND.y+8,ph),P(t,T_HAND,T_HAND+0.2),press,P(t,T_TAP,T_TAP+0.55));
  cSend.style.transform=`scale(${f3(1-0.08*press)})`;
});

/* ================= k14-20 the answer: the Assistant, on lavender; the answer streams from the data ================= */
const S4=M.el('div','lv-shot',null,SCN), D4=M.el('div','lv-3d',null,S4);
const ANS=['انخفضت','المبيعات','§','بسبب','نفاد','المخزون','في','ثلاثة','فروع','—','تم','إنشاء','طلبات','التوريد','تلقائيًا.'];
const ask=M.el('div','as-card',
  `<div class="hd"><span class="bt">${SK.ic('bot',26,'#fff',2)}</span><span class="nm">مساعد مرصد الذكي</span>`+
  `<span class="ws">${SK.ic('chevDown',18,'#52505A',2)}<span>كل مساحة العمل</span></span></div><div class="dv"></div>`+
  `<div class="um">${Q}</div>`+
  `<div class="an"><span class="av">${SK.ic('bot',24,'#fff',2)}</span><div class="ac"><div class="tx"></div>`+
  `<span class="chip">${SK.ic('check',16,'#0B8447',2.6)}<span>مبني على بياناتك الأصلية — بدون اختلاق</span></span></div></div>`+
  `<div class="ir"><div class="in"><span class="ph">اسأل مرصد عن أي شيء بخصوص بياناتك...</span></div>`+
  `<span class="send">${SK.ic('send',28,'#fff',2)}</span></div>`,D4);
const aUM=ask.querySelector('.um'),aAN=ask.querySelector('.an'),aTX=ask.querySelector('.tx'),aCH=ask.querySelector('.chip');
const T_W=B(14.6), T_CHIP=B(18.6);
let lastA='';
M.track(t=>{
  if(!show(S4,inShot(t,K_ANS,K_T1)))return;
  const u=P(t,K_ANS,K_T1), pe=dec(t,K_ANS,K_ANS+0.5);
  st(S4,{transform:camT({x:1000,y:560},{x:1000,y:560},1.0+0.1*io(t,K_ANS,K_T1))});   // a push toward the answer
  st(ask,{transform:T3(940,548,1100,590,{rx:lerp(8,2,u),ry:lerp(-13,-4,u),s:1.42*(0.97+0.03*pe)}),opacity:f3(pe)});
  const pu=dec(t,K_ANS,K_ANS+0.35);st(aUM,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*20)}px)`});
  const pa=dec(t,K_ANS+0.2,K_ANS+0.6);st(aAN,{opacity:f3(pa),transform:`translateY(${f1((1-pa)*18)}px)`});
  const nw=FQ(t)<T_W?0:Math.min(ANS.length,Math.floor((FQ(t)-T_W)/S16)+1);
  const tx=ANS.slice(0,nw).map(w=>w==='§'?'<span class="hl">8.2%</span>':w).join(' ');
  if(tx!==lastA){aTX.innerHTML=tx;lastA=tx;}
  const pc=dec(t,T_CHIP,T_CHIP+0.45);st(aCH,{opacity:f3(pc),transform:`scale(${f3(0.92+0.08*pc)})`});
});

/* ================= k20-22 type ================= */
lt({at:K_T1,out:K_LIST,y:356,words:['Built','on','your','data.'],ar:'مبني على بياناتك.'});

/* ================= k22-24 the Decisions statuses in close-up; the hand on «قيد المراجعة» ================= */
const S6=M.el('div','lv-shot',null,SCN);
const LROWS=[['bang','حرجة','Critical','0','#A8131C',0],['clock','قيد المراجعة','Under review','6','#AA3C07',1],['ccheck','موافق عليها','Approved','0','#0B8447',0]];
const list=M.el('div','lv-list',LROWS.map(([icn,ar,en,n,col,hi],i)=>
  `<div class="lv-row${hi?' on':''}" style="top:${i*222}px;"><span class="ico">${SK.ic(icn,72,hi?'#8E32C3':'#3A3742',2)}</span>`+
  `<span class="ar">${ar}</span><span class="en">${en}</span><span class="n">${n}</span></div>`).join(''),S6);
st(list,{left:'340px',top:'214px'});
const H6=hand(S6), ROW={x:340+620+120,y:214+222+98}, T_TAP6=B(23.3);
M.track(t=>{
  if(!show(S6,inShot(t,K_LIST,K_DEC)))return;
  st(S6,{transform:camT({x:960,y:540},{x:960,y:540},1+0.05*P(t,K_LIST,K_DEC))});
  const ph=io(t,K_LIST+0.05,T_TAP6-0.08), press=Math.sin(Math.PI*P(t,T_TAP6-0.06,T_TAP6+0.16));
  drawHand(H6,lerp(1520,ROW.x,ph),lerp(1230,ROW.y,ph),1,press,P(t,T_TAP6,T_TAP6+0.5));
});

/* ================= k24-28 decide: the counters and the card; one click on «موافقة» ================= */
const S7=M.el('div','lv-shot',null,SCN);
const td=document.createElement('div');td.innerHTML=SK.decContent({id:'lvDec'});
const dcard=td.querySelector('#decCard'),toast=td.querySelector('#toast'),btn=dcard.querySelector('#btnOK'),stats=td.querySelector('#stats');
[dcard,toast].forEach(e=>{e.removeAttribute('id');st(e,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'214px'});});
toast.style.display='flex';
const DW=M.el('div','lv-dec',null,S7);M.el('div','site m-site',null,DW).append(dcard,toast);
stats.removeAttribute('id');st(stats,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'138px'});
const SW=M.el('div','lv-stats',null,S7);M.el('div','site m-site',null,SW).appendChild(stats);
const statEls=[...stats.children], nApp=statEls[2].querySelector('.n'), nRev=statEls[3].querySelector('.n');
st(SW,{left:'259px',top:'262px'});st(DW,{left:'259px',top:'470px'});
const OK={x:259+1402-36-80,y:470+138+28}, H7=hand(S7), T_CLICK=B(25.5), T_CNT=B(26.5);
M.track(t=>{
  if(!show(S7,inShot(t,K_DEC,K_T2)))return;
  const pe=dec(t,K_DEC,K_DEC+0.45), pz=io(t,K_DEC,T_CLICK-0.1)*(1-0.55*io(t,T_CLICK+0.5,T_CNT+0.4));
  const Z0=1.25, S0={x:960-(960-OK.x)*Z0,y:540-(473-OK.y)*Z0};          // at Z0 the whole (centre 960,473) sits mid-screen
  st(S7,{transform:camT(OK,{x:lerp(S0.x,1250,pz),y:lerp(S0.y,790,pz)},(0.97+0.03*pe)*lerp(Z0,1.62,pz)),opacity:f3(pe)});
  const pk=dec(t,T_CLICK+0.05,T_CLICK+0.4);dcard.style.opacity=f3(1-pk);toast.style.opacity=f3(pk);
  const press=Math.sin(Math.PI*P(t,T_CLICK-0.06,T_CLICK+0.16));btn.style.transform=`scale(${f3(1-0.05*press)})`;
  const ph=io(t,K_DEC+0.15,T_CLICK-0.08), out=io(t,T_CLICK+0.5,T_CLICK+1.2);
  drawHand(H7,lerp(1600,OK.x,ph)+260*out,lerp(1180,OK.y+6,ph)+300*out,1-out,press,P(t,T_CLICK,T_CLICK+0.55));
  const done=FQ(t)>=T_CNT;nApp.textContent=done?'1':'0';nRev.textContent=done?'5':'6';
  const gc=dec(t,T_CNT,T_CNT+0.4)*(1-io(t,T_CNT+0.8,T_CNT+2.2));
  statEls[2].style.boxShadow=gc>0.001?`0 0 ${f1(34*gc)}px rgba(11,132,71,${f3(0.55*gc)}),inset 0 0 0 ${f2(2*gc)}px rgba(11,132,71,${f3(0.6*gc)})`:'';
});

/* ================= k28-31.5 type ================= */
lt({at:K_T2,out:K_T3,y:356,words:['Every','system.'],ar:'كل الأنظمة.'});
lt({at:K_T3,out:K_COL,y:356,words:['One','living','model.'],ar:'نموذج حيّ واحد.'});

/* ================= k31.5-36 the collage: the app's ten pages fly in and gather in 3D ================= */
const S9=M.el('div','lv-shot',null,SCN), D9=M.el('div','lv-3d',null,S9);
const GRP=M.el('div',null,null,D9);st(GRP,{width:'1920px',height:'1080px',transformStyle:'preserve-3d',transformOrigin:'960px 540px'});
const CL=[['home',960,520,140],['pulse',560,350,-260],['decisions',1370,330,-160],['assistant',1330,730,40],['knowledgeMap',590,760,-120],
  ['search',980,170,-560],['projects',250,560,-600],['objectTypes',1670,560,-560],['links',990,920,-480],['admin',1580,900,-720]]
  .map(([k,x,y,z],i)=>({k,x,y,z,i,t0:K_COL+i*S16,el:M.el('div','lv-page',`<img src="site_pages/${k}.png">`,GRP)}));
M.track(t=>{
  if(!show(S9,inShot(t,K_COL,K_LOGO)))return;
  const u=P(t,K_COL,K_LOGO), pc=io(t,B(34.6),K_LOGO);
  st(GRP,{transform:`rotateX(${f2(9-3*u)}deg) rotateY(${f2(lerp(18,-8,u))}deg) scale(${f3(1-0.3*pc)})`});
  for(const c of CL){
    const p=dec(t,c.t0,c.t0+0.85);
    st(c.el,{opacity:f3(P(t,c.t0,c.t0+0.25)),filter:p<0.98?`blur(${f2((1-p)*14)}px)`:'none',
      transform:T3(c.x,c.y,640,358,{z:lerp(1000,c.z,p),ry:-6*(1-p),s:1})});
  }
});

/* ================= k36-46 the logo: small in the silence, big on the hit; then the URL and "Book your demo" ================= */
const S10=M.el('div','lv-shot',null,SCN);
const LG=M.el('div','lv-logo',`<img class="m" src="assets_logo_m.png"><img class="wm" src="assets_logo_wordmark_white.png">`,S10);
st(LG.querySelector('.m'),{left:'850px',top:'236px',width:'220px'});st(LG.querySelector('.wm'),{left:'720px',top:'436px',width:'480px'});
const CTA=M.el('div','lv-cta',`<span class="url">marsadnasl.com</span><span class="book"><span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span></span>`,S10);
st(CTA,{top:'684px'});
const FTR=M.el('div','lv-ft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',S10);
const cUrl=CTA.querySelector('.url'),cBook=CTA.querySelector('.book');
M.track(t=>{
  if(!show(S10,t>=K_LOGO))return;
  const big=t>=K_END, ps=dec(t,K_LOGO,K_LOGO+0.3), pb=dec(t,K_END,K_END+0.45);
  // lockup centre (960,405); small: 0.5x, centred on the screen; big: in place, settling from 0.96
  const s=big?0.96+0.04*pb:0.5*(0.94+0.06*ps), cy=big?405:540;
  st(LG,{opacity:f3(big?1:ps),filter:!big&&ps<1?`blur(${f2((1-ps)*10)}px)`:'none',transformOrigin:'960px 405px',
    transform:`translateY(${f1(cy-405)}px) scale(${f3(s*(1+0.02*P(t,K_END,B(46))))})`});
  const pu=dec(t,B(39.25),B(39.25)+0.5), pk=dec(t,B(39.75),B(39.75)+0.5), pf=dec(t,B(40.5),B(40.5)+0.6);
  CTA.style.display=big?'':'none';FTR.style.display=big?'':'none';
  st(cUrl,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*18)}px) scale(${f3(0.95+0.05*pu)})`});
  st(cBook,{opacity:f3(pk),transform:`translateY(${f1((1-pk)*18)}px) scale(${f3(0.95+0.05*pk)})`});
  st(FTR,{opacity:f3(0.6*pf)});
});
M.punch(K_CARD,{amp:0.012});
M.punch(K_END,{amp:0.015});
M.start();
