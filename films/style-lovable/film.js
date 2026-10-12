/* Marsad — style sample: Lovable (films/style-lovable). About 28 s of the Marsad film told in the grammar of Lovable's
   launch video (the client's reference 02_Lovable.mp4): a vivid gradient that runs from black through blue and magenta to
   orange; a big dark prompt card whose question types in bold, its newest word in a gradient; a white cartoon hand that
   clicks; the app's screens (dark mode) in close-up on lavender; big white one-line type shots; a 3D collage of the app's pages; the
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
     k14-20    answer    the app's assistant on lavender: «المساعد يفكّر…», then its answer from the data, its sources lit
     k20-22    type      "Built on your data." «مبني على بياناتك.»
     k22-28    decide    the Decisions counters and card; the hand clicks «موافقة» (k23), the app's confirm dialog,
                         «تأكيد الموافقة» (k24.5), «تم بنجاح»; the card approved, the counts 6 -> 5 and 0 -> 1 (k26.25)
     k28-31.5  type      "Every system." «كل الأنظمة.» / "One living model." «نموذج حيّ واحد.»
     k31.5-36  collage   nine of the app's pages fly in and gather in 3D
     k36-38    breath    the small white logo, in the music's two-beat silence
     k38-46    end       on the hit: the big logo, marsadnasl.com, "Book your demo · احجز عرضك التجريبي"
   Truth (2026-10-12, "apply this to all other videos"): the assistant's thread, the Decisions counters and card, the
   confirm dialog, «تم بنجاح», the approved card and the nine pages of the collage are the real app's screens, captured
   from the client's bilingual front end in dark mode with sample data (labelled "Sample data · بيانات تجريبية"):
   films/style-jupiter/pages/ (the brand film's) and films/app-pages/pages/ (tools/app_shot.js). The assistant explains
   the drop and creates nothing; nothing runs after the approval (the feature catalogue). The source tiles are the ones
   Marsad takes in (K.SOURCES). Renderings: the dark prompt card (the assistant's input restyled as the reference's card,
   with an "Odoo" source chip) and its typed question (the thread's own), the hand, the white mark. Shortened: the app
   holds «تم بنجاح» for 2 s, here 0.9 s. Before 2026-10-12: site-kit pages, the famous tiles, an answer that created
   purchase orders and an executed PO-2291. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
// a camera on a shot (transform-origin 0 0): zoom by Z about the stage point F, which sits at the screen point S
const camT=(F,S,Z)=>`translate(${f1(S.x-F.x*Z)}px,${f1(S.y-F.y*Z)}px) scale(${f3(Z)})`;

/* the shots (hard cuts: the renderer keeps each frame's motion-blur samples on one side of a cut) */
const K_FLY=B(3.5), K_CARD=B(8), K_ANS=B(14), K_T1=B(20), K_LIST=B(22), K_T2=B(28), K_T3=B(29.75), K_COL=B(31.5),
  K_LOGO=B(36), K_END=B(38);
window.CUTS=[K_FLY,K_CARD,K_ANS,K_T1,K_LIST,K_T2,K_T3,K_COL,K_LOGO,K_END];
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
  return {i,x:960+R*Math.cos(a)*1.5,y:540+R*Math.sin(a),t0:K_FLY-0.35+i*0.19,el:M.el('div','k-tile m-glass',K.tile(K.SOURCES[i%8]),D2)};});
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

/* ================= k14-20 the answer: the app's assistant, on lavender: it thinks, then answers from the data ================= */
// The app's own thread panel (films/style-jupiter/pages/chat-*: the brand film's captures, the same question): «المساعد
// يفكّر…», then the answer with «المصادر» (it explains the drop and creates nothing); the sources light up as the proof
const JIMG='films/style-jupiter/pages/', AK=2, TH=[32,250,816,517];
const plate=(parent,file,w,h,k,cls='lv-part')=>{const e=M.el('div',cls,null,parent);
  st(e,{width:f1(w*k)+'px',height:f1(h*k)+'px',backgroundImage:`url(${JIMG}${file})`,backgroundSize:'100% 100%'});return e;};
const S4=M.el('div','lv-shot',null,SCN), D4=M.el('div','lv-3d',null,S4);
const ASK=M.el('div','lv-stack',null,D4);st(ASK,{width:f1(TH[2]*AK)+'px',height:f1(TH[3]*AK)+'px'});
const aThink=plate(ASK,'chat-thinking-thread.png',TH[2],TH[3],AK), aAns=plate(ASK,'chat-answer-thread.png',TH[2],TH[3],AK);
const srcG=M.el('div','lv-glow',null,aAns);                                  // «المصادر» and its chips, 8 px clear
st(srcG,{left:f1((209.5-TH[0])*AK)+'px',top:f1((403.3-TH[1])*AK)+'px',width:f1(556.5*AK)+'px',height:f1(73*AK)+'px'});
const T_ANSWER=B(15), T_CHIP=B(18);
M.track(t=>{
  if(!show(S4,inShot(t,K_ANS,K_T1)))return;
  const u=P(t,K_ANS,K_T1), pe=dec(t,K_ANS,K_ANS+0.5);
  st(S4,{transform:camT({x:960,y:540},{x:960,y:540},1.0+0.08*io(t,K_ANS,K_T1))});   // a push toward the answer
  st(ASK,{transform:T3(960,548,TH[2]*AK,TH[3]*AK,{rx:lerp(8,2,u),ry:lerp(-13,-4,u),s:0.84*(0.97+0.03*pe)}),opacity:f3(pe)});
  const pa=dec(t,T_ANSWER,T_ANSWER+0.35);aAns.style.opacity=f3(pa);aThink.style.opacity=f3(1-pa);
  srcG.style.opacity=f3(dec(t,T_CHIP,T_CHIP+0.35)*(1-0.4*io(t,T_CHIP+0.6,T_CHIP+1.6)));
});

/* ================= k20-22 type ================= */
lt({at:K_T1,out:K_LIST,y:356,words:['Built','on','your','data.'],ar:'مبني على بياناتك.'});

/* ================= k22-28 decide: the counters and the card; «موافقة», the app's confirm, «تم بنجاح»; approved ================= */
// the real app's Decisions page (films/style-jupiter/pages/: the brand film's captures): the counters and a
// recommendation a monitoring rule raised. «موافقة» opens the app's confirm dialog; «تأكيد الموافقة» gives «تم بنجاح»; then
// the card is approved and the counts read 5 / 1. Nothing runs after the approval (the catalogue)
const S7=M.el('div','lv-shot',null,SCN), DK=1.6, CW=1120*DK, CH=206*DK, SH=94*DK, CX=(1920-CW)/2, SY=280, CY=SY+SH+28;
const dPlate=(parent,file,x,y,w,h)=>{const e=M.el('div','lv-part',null,parent);
  st(e,{left:f1(x)+'px',top:f1(y)+'px',width:f1(w)+'px',height:f1(h)+'px',backgroundImage:`url(${JIMG}${file})`,backgroundSize:'100% 100%'});return e;};
const sIn=dPlate(S7,'decisions-stats.png',CX,SY,CW,SH), sAfter=dPlate(S7,'after-stats.png',CX,SY,CW,SH);
const dIn=dPlate(S7,'decisions-card.png',CX,CY,CW,CH), dAfter=dPlate(S7,'after-card.png',CX,CY,CW,CH);
const sGlow=M.el('div','lv-sglow',null,S7);st(sGlow,{left:f1(CX+(600-32)*DK)+'px',top:SY+'px',width:f1(268*DK)+'px',height:f1(SH)+'px'});   // «موافق عليها»
const APB={x:CX+(53-32+53.35)*DK,y:CY+(497-476+19)*DK};      // «موافقة» on the card (the brand film's boxes)
const DLGL=M.el('div','lv-shot',null,SCN), veil=M.el('div','lv-veil',null,DLGL);  // the app's dialogs, centred on the screen
const QK=1.7, dlgC=dPlate(DLGL,'confirm-dialog.png',960-224*QK,540-161*QK,448*QK,322*QK), dlgD=dPlate(DLGL,'done-dialog.png',960-224*QK,540-55*QK,448*QK,110*QK);
[dlgC,dlgD].forEach(e=>e.classList.add('lv-dlg'));
const OKB={x:960-224*QK+(521-496+76.55)*QK,y:540-161*QK+(506.5-253.5+22)*QK};   // «تأكيد الموافقة» on screen
const H7=hand(TXT);
const T_CLICK=B(23), T_DLG=B(23.25), T_OK=B(24.5), T_DONE=B(24.75), T_CNT=B(26.25);
const DCC={x:960,y:(SY+CY+CH)/2};                            // the counters and the card, whole, a slow push on their middle
const camA=t=>{const pe=dec(t,K_LIST,K_LIST+0.45);return {pe,Z:(0.97+0.03*pe)*(1+0.06*P(t,K_LIST,K_T2))};};
const onScreen=(p,Z)=>({x:DCC.x+(p.x-DCC.x)*Z,y:DCC.y+(p.y-DCC.y)*Z});
M.track(t=>{
  const on=inShot(t,K_LIST,K_T2);show(S7,on);show(DLGL,on);show(H7.e,on);if(!on){H7.tap.style.display='none';return;}
  const c=camA(t);st(S7,{transform:camT(DCC,DCC,c.Z),opacity:f3(c.pe)});
  const pk=dec(t,T_CNT,T_CNT+0.35);dAfter.style.opacity=f3(pk);sAfter.style.opacity=f3(pk);   // approved; the counts read 5 / 1
  sGlow.style.opacity=f3(dec(t,T_CNT,T_CNT+0.4)*(1-io(t,T_CNT+0.8,T_CNT+1.6)));
  const pi=dec(t,T_DLG,T_DLG+0.3), po=io(t,T_CNT-0.3,T_CNT);   // the confirm pops in on the click's result; «تم بنجاح» on the confirm's
  veil.style.opacity=f3(0.38*pi*(1-po));
  const pd=dec(t,T_DONE,T_DONE+0.2);
  st(dlgC,{opacity:f3(pi*(1-pd)*(1-po)),transform:`translateY(${f1((1-pi)*24)}px) scale(${f3(0.96+0.04*pi)})`});
  st(dlgD,{opacity:f3(pd*(1-po))});
  // the hand: in from the lower right onto «موافقة» (camera space, on screen), then onto «تأكيد الموافقة»
  const ap=onScreen(APB,c.Z), pm=io(t,K_LIST+0.2,T_CLICK-0.08), pm2=io(t,T_DLG+0.25,T_OK-0.08), out=io(t,T_OK+0.45,T_OK+1.1);
  const x=lerp(lerp(1640,ap.x,pm),OKB.x,pm2)+260*out, y=lerp(lerp(1230,ap.y+6,pm),OKB.y+6,pm2)+300*out;
  const press=Math.max(Math.sin(Math.PI*P(t,T_CLICK-0.06,T_CLICK+0.16)),Math.sin(Math.PI*P(t,T_OK-0.06,T_OK+0.16)));
  const tap=t<T_DLG+0.4?P(t,T_CLICK,T_CLICK+0.55):P(t,T_OK,T_OK+0.55);
  drawHand(H7,x,y,1-out,press,tap);
});

/* ================= k28-31.5 type ================= */
lt({at:K_T2,out:K_T3,y:356,words:['Every','system.'],ar:'كل الأنظمة.'});
lt({at:K_T3,out:K_COL,y:356,words:['One','living','model.'],ar:'نموذج حيّ واحد.'});

/* ================= k31.5-36 the collage: nine of the app's pages fly in and gather in 3D ================= */
// the real app's pages, whole (films/app-pages/pages/: tools/app_shot.js, dark mode, sample data)
const S9=M.el('div','lv-shot',null,SCN), D9=M.el('div','lv-3d',null,S9);
const GRP=M.el('div',null,null,D9);st(GRP,{width:'1920px',height:'1080px',transformStyle:'preserve-3d',transformOrigin:'960px 540px'});
const CL=[['home',960,520,140],['pulse',560,350,-260],['decisions',1370,330,-160],['assistant',1330,730,40],['map',590,760,-120],
  ['search',980,170,-560],['projects',250,560,-600],['schema',1670,560,-560],['monitors',990,920,-480]]
  .map(([k,x,y,z],i)=>({k,x,y,z,i,t0:K_COL+i*S16,el:M.el('div','lv-page',`<img src="films/app-pages/pages/${k}.png">`,GRP)}));
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
// the app's screens show sample data: labelled while they are up (the assistant, Decisions, the collage)
const SAMPLE=M.el('div','rx-label','<span class="en">Sample data</span><span class="sep">·</span><span class="ar">بيانات تجريبية</span>',TXT);
M.track(t=>{const v=inShot(t,K_ANS,K_T1)||inShot(t,K_LIST,K_T2)||inShot(t,K_COL,K_LOGO)?1:0;SAMPLE.style.display=v?'':'none';});
M.punch(K_CARD,{amp:0.012});
M.punch(K_END,{amp:0.015});
M.start();
