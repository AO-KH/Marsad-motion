/* ================= beat grid — the 54s cut's own track: 95.96 BPM, bar = 4 beats = 2.501 s =================
   beat k at 0.03 + 0.62525·k.  Sections: intro k0–15 · groove k16–47 · breakdown k48–79 (hit on k64) · drums back k80. */
const MB=0.62525, PH=0.03, vbeat=k=>PH+MB*k;
const kOf=t=>(t-PH)/MB;
const S32=MB/8, S16=MB/4, S8=MB/2;
window.DURATION=54.0;

/* ================= camera moves (all on beats) =================
   Calm pace (client: "a little slower, no shaking"): no shakes, soft punches, long moves, no light sweeps. */
const TR=[
  {t:vbeat(8),  type:'charge', t0:vbeat(4), amp:0.025, rot:0},                    // slow push in on the number, no tilt
  {t:vbeat(8),  type:'punch',  d:0.80, amp:0.012, at:0.25},                       // the number dissolves
  // (no zoom-through at k16, no nudges at k24/k32, no zoom-out at k48: those cut the zoom or position on the beat.
  //  The window's own grow/recede and the page cross-fades carry those moments.)
  {t:vbeat(42), type:'punch',  d:0.80, amp:0.010, at:0.25},                       // the seal settles
  {t:vbeat(56), type:'rise',   dir:-1, a:0.80, b:0.90, amp:36, blur:4},           // Know. Watch. Decide.
  {t:vbeat(64), type:'punch',  d:0.90, amp:0.022, at:0.25},                       // the hit: logo
  {t:vbeat(80), type:'punch',  d:0.90, amp:0.008, at:0.25},                       // drums return: CTA
];

/* ================= captions ================= */
function capSimple(e,t,t0,die0,die1,dy=24){const p=ez.dec(P(t,t0,t0+0.9)),d=ez.inC(P(t,die0,die1));
  st(e,{opacity:(p*(1-d)).toFixed(3),transform:`translateY(${((1-p)*dy).toFixed(2)}px)`});}
function capParts(e,t,times,die0,die1,dy=22){
  const d=ez.inC(P(t,die0,die1));
  st(e,{opacity:t>=times[0]-0.02?(1-d).toFixed(3):0});
  [...e.children].forEach((w,i)=>{const p=ez.dec(P(t,times[i],times[i]+0.8));
    st(w,{opacity:p.toFixed(3),transform:`translateY(${((1-p)*dy).toFixed(2)}px)`,filter:p<1?`blur(${(5*(1-p)).toFixed(2)}px)`:'none'});});}

/* ================= A: the number ================= */
const KPI_V=4812450;
function fmt(n){return Math.round(n).toLocaleString('en-US');}

/* ================= B: scattered sources ================= */
// the sources Marsad takes in (TILES: the feature catalogue's) and the files of the Projects page they land in
const FILES=['invoices_q3.xlsx','sales_by_branch_q3.csv','ملخص مبيعات الربع الثالث.pdf','طلبات واتساب — سبتمبر'];
const FILE_COL={xlsx:'#2EA36B',csv:'#12A594',pdf:'#E5484D',wa:'#25D366'};
const fcol=f=>FILE_COL[/\.(xlsx|csv|pdf)$/.test(f)?f.split('.').pop():'wa'];
const ITEMS=[...TILES.map(n=>({kind:'tile',n})),...FILES.map(f=>({kind:'file',f}))];
const HOME=[[330,250],[1590,215],[640,470],[1330,470],[250,640],[1690,610],[905,190],[1085,660],
            [540,130],[1260,120],[330,450],[1560,760]];
const FILE_ICON='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C6A74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
{const R=mulberry(54),box=$('items');
 ITEMS.forEach((it,i)=>{const d=document.createElement('div');
   if(it.kind==='tile'){d.className='tile';d.innerHTML=tileHTML(it.n);it.w=112;it.h=112;}
   else {d.className='fchip';d.innerHTML=GLASS(fcol(it.f))+FILE_ICON+`<span dir="auto">${it.f}</span>`;it.w=0;it.h=58;}
   box.appendChild(d);it.el=d;it.home=HOME[i];it.ro=(R()-0.5)*16;it.ph=R()*6.3;});
 ITEMS.forEach(it=>{if(it.kind==='file')it.w=it.el.offsetWidth||250;});}
const BURST0=vbeat(8), ABSORB_ORDER=[0,1,2,3,4,5,6,7,8,9,10,11];    // first out, first in: every item rests before it glides
const ABS_T=ABSORB_ORDER.map((ix,j)=>vbeat(13)+j*S16);                 // one per 16th, k13 → k15.75

/* ================= the app window (C–G): the real app's pages ================= */
// The client's front end in dark mode (its Arabic interface, the MARSAD × Fusion look) with sample data, captured whole by
// tools/app_shot.js (films/app-pages/pages/: 1440 x 805 CSS px; APB, from its shots.json, holds the boxes of the parts
// animated here). A page fills the 1360 x 760 window; natural coordinates are the page's CSS px.
const K=1360/1440, uiWrap=$('uiWrap'), uiSite=$('uiSite'), AP='films/app-pages/pages/';
const PLATES=['projects-base','ask','ask-space','ask-thinking','ask-answer','monitors','decisions','confirm','done','after','passport'];
uiSite.innerHTML=PLATES.map(k=>`<img class="pg" id="pg-${k}" src="${AP}${k}.png">`).join('')+'<div id="ov"></div>';
const PG=Object.fromEntries(PLATES.map(k=>[k,$('pg-'+k)])), ov=$('ov');
// the app's dialogs veil the page from 24 px down (their backdrop sits in a transformed column), leaving the header's top
// strip bright, its avatar and its bell's badge: veiled here as the backdrop means it (bg-black/70, backdrop-blur-sm)
const VS={};
for(const k of ['confirm','done','passport']){const d=document.createElement('div');d.className='vstrip';
  d.innerHTML=`<img src="${AP}${k}.png">`;PG[k].after(d);VS[k]=d;}
const bx=(st0,n)=>APB[st0][n], pad=(b,d)=>({x:b.x-d,y:b.y-d,w:b.w+2*d,h:b.h+2*d});
function part(b,cls,file){const d=document.createElement('div');d.className='part '+(cls||'');
  st(d,{left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px'});
  if(file)d.innerHTML=`<img src="${AP}${file}.png">`;ov.appendChild(d);return d;}
// what the window shows over time: [time, page, crossfade]; a page switch is slow, a change in the page quick
const SEQ=[[0,'projects-base',0],[vbeat(16)-0.25,'ask',0.55],[vbeat(16.75),'ask-space',0.12],[vbeat(19.75),'ask-thinking',0.15],
  [vbeat(20.5),'ask-answer',0.25],[vbeat(24)-0.25,'monitors',0.55],[vbeat(32)-0.25,'decisions',0.55],[vbeat(37.25),'confirm',0.2],
  [vbeat(40.25),'done',0.15],[vbeat(43.5),'after',0.25],[vbeat(44.75),'passport',0.3]];
function pageAt(t){let i=0;for(let j=0;j<SEQ.length;j++)if(t>=SEQ[j][0])i=j;
  return {cur:SEQ[i][1],prev:i?SEQ[i-1][1]:null,sw:i?ez.ioC(P(t,SEQ[i][0],SEQ[i][0]+SEQ[i][2])):1};}
function centerIn(el){let x=0,y=0,n=el;while(n&&n!==uiSite){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}
  return [x+el.offsetWidth/2,y+el.offsetHeight/2];}                       // natural coords
let UIW={s:1,tx:0,ty:0,a:0,gone:0};
/* focus track: the window pushes in on what matters (natural-space point, extra zoom), smooth between keys; every
   glide takes 1 s or more (1.6 beats and up: the client's calm pace), and goes straight from one subject to the next */
const FOCUS=[[16.8,720,402,0],[18.4,470,700,0.22],[19.6,470,700,0.22],           // the question being typed
  [21.2,490,430,0.18],[23.0,490,430,0.18],                                         // the answer and its sources
  [25.6,600,410,0.12],[27.0,600,410,0.12],[28.6,300,170,0.22],[31.0,300,170,0.22],   // the rules, then the alert
  [34.0,600,580,0.1],[36.9,600,580,0.1],[38.5,720,414,0.12],[42.6,720,414,0.12],     // the card, the dialogs
  [44.2,600,580,0.1],[46.2,720,260,0.18],[48.2,720,402,0]]                           // approved; the passport
  .map(r=>[vbeat(r[0]),r[1],r[2],r[3]]);
function focusAt(t){
  if(t<=FOCUS[0][0])return FOCUS[0].slice(1);
  for(let i=0;i<FOCUS.length-1;i++){const a=FOCUS[i],b=FOCUS[i+1];
    if(t<b[0]){const p=ez.ioC(P(t,a[0],b[0]));return [lerp(a[1],b[1],p),lerp(a[2],b[2],p),lerp(a[3],b[3],p)];}}
  return FOCUS[FOCUS.length-1].slice(1);}
function uiwState(t){
  const pA=ez.dec(P(t,vbeat(12),vbeat(12)+0.9)), grow=ez.ioC(P(t,vbeat(15.25),vbeat(16.8)));
  const rec=ez.ioC(P(t,vbeat(48),vbeat(50))), gone=ez.inC(P(t,vbeat(50),vbeat(51.5)));
  const drift=0.018*P(t,vbeat(16.8),vbeat(48));                                     // slow push, never a pulse
  let s=(0.56+0.04*pA)*(1-grow)+grow*(1+drift); s=s*(1-rec)+0.42*rec;
  const [fx,fy,z]=focusAt(t), s2=s*(1+z);
  const F0x=960+(fx*K-680)*s, F0y=530+(fy*K-380)*s, c=0.45*Math.min(1,z/0.3);   // the focus point drifts toward frame centre
  const Cx=F0x+(960-F0x)*c, Cy=F0y+(500-F0y)*c;
  UIW={s:s2,tx:Cx-(960+(fx*K-680)*s2),ty:Cy-(530+(fy*K-380)*s2),a:pA,gone};
}
function natToStage(nx,ny){const lx=nx*K,ly=ny*K;return [960+(lx-680)*UIW.s+UIW.tx,530+(ly-380)*UIW.s+UIW.ty];}

/* projects: the files' rows land as their chips do (the page captured without them, then each row); the other sources
   light the departments and projects they feed */
const FROWS=['f1','f2','f3','f4'].map(k=>part(bx('projects',k),'',`projects-${k}`));
const TGL=['d1','p1','p2','p3','d2','d3','p1','p2'].map(k=>part(bx('projects',k),'land'));
const TARGETS=ITEMS.map((it,i)=>it.kind==='file'?FROWS[i-8]:TGL[i]);

/* the assistant: the question typed into the app's field (its captured typed field uncovered right to left), sent; it
   thinks; the answer, its sources lit (the app answers in one piece) */
const KQN=35, AF=bx('ask-typed','field'), TX0=621, TX1=806;   // «من أين جاء رقم مبيعات الربع الثالث؟»; its span in the field
const aTyped=part(AF,'',`ask-typed-field`), aSend=part(bx('ask-typed','send'),'',`ask-typed-send`);
const aCaret=part({x:AF.x,y:AF.y+14,w:1.4,h:20},'caret'), aSrc=part(pad(bx('ask-answer','sources'),6),'glowv');

/* the monitoring rules: the rule that watches the Riyadh branch's stock lights; then its alert comes into the bell */
const ruleRim=part(bx('monitors','rule'),'rimv'), BB=bx('monitors','bellbtn'), POP=bx('monitors-bell','pop');
const bellGlow=part(pad(BB,14),'bglow'), pop=part(POP,'pop','monitors-bell-pop');
pop.style.transformOrigin=`${BB.x+BB.w/2-POP.x}px ${BB.y+BB.h/2-POP.y}px`;

/* decisions: «موافقة», the confirm dialog, «تأكيد الموافقة», «تم بنجاح», the card approved; its passport, its seal lit */
const sealGlow=part(pad(bx('passport','seal'),3),'sglow');
const box2c=b=>[b.x+b.w/2,b.y+b.h*0.6];
const C_OK=box2c(bx('decisions','approve')), C_CONF=box2c(bx('confirm','ok')), C_PASS=box2c(bx('after','pass'));

/* ================= G/I: wall of the app's pages ================= */
const WALL_PAGES=['pulse','home','decisions','map','assistant','schema','search','monitors','projects','after'];
{const wall=$('wall');const TW=600,TH=335,GAP=44,COLS=5,ROWS=5;
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
   const img=document.createElement('img');img.className='wtile';
   img.src=AP+WALL_PAGES[(r*COLS+c+r*3)%WALL_PAGES.length]+'.png';
   st(img,{left:c*(TW+GAP)+'px',top:r*(TH+GAP)+'px',width:TW+'px',height:TH+'px'});wall.appendChild(img);}}

/* ================= I: ignition burst for the logo (one hit, on k64) ================= */
const IGN=vbeat(64), CX=960, CY=342;
const RB=[],SPK=[];
{const R=mulberry(2024),g=$('burst'),NS='http://www.w3.org/2000/svg';
 for(let i=0;i<18;i++){const l=document.createElementNS(NS,'line');const a=i/18*Math.PI*2+(R()-0.5)*0.12;
   l.setAttribute('stroke',i%2?'#DE0DFF':'#8E32C3');l.setAttribute('stroke-linecap','round');l.setAttribute('opacity','0');g.appendChild(l);
   RB.push({el:l,a,len:0.7+R()*0.6,sp:0.8+R()*0.4});}
 for(let i=0;i<30;i++){const c=document.createElementNS(NS,'circle');c.setAttribute('fill',i%3?'#BC59D1':'#DE0DFF');c.setAttribute('opacity','0');g.appendChild(c);
   SPK.push({el:c,a:R()*Math.PI*2,v:360+R()*520,r:1.8+R()*2.8,life:0.7+R()*0.5});}}

/* ================= scene renderers ================= */
function sceneA(t){
  const on=t<vbeat(9.5); showS($('sA'),on); if(!on)return;
  const pIn=ez.dec(P(t,vbeat(1.5),vbeat(1.5)+1.0));
  const shatter=P(t,BURST0-0.04,BURST0+0.50);                         // the card dissolves into its sources
  const cnt=ez.dec(P(Math.round(t*30)/30,vbeat(2),vbeat(5.5)));       // one number per frame: motion blur would stack four
  $('kpiNum').textContent=fmt(KPI_V*cnt);
  st($('kpi'),{opacity:(pIn*(1-ez.outC(shatter))).toFixed(3),
    transform:`translateY(${((1-pIn)*30).toFixed(2)}px) scale(${((0.96+0.04*pIn)*(1+0.08*ez.outC(shatter))).toFixed(4)})`,
    filter:shatter>0?`blur(${(8*shatter).toFixed(2)}px)`:'none'});
  const pS=ez.dec(P(t,vbeat(6),vbeat(6)+0.8));
  st($('kpiSrc'),{opacity:(pS*(1-ez.outC(shatter))).toFixed(3),transform:`translateY(${((1-pS)*16).toFixed(2)}px)`});
}
function sceneB(t){
  const on=t>=BURST0-0.05&&t<vbeat(16.5); showS($('items'),on);
  if(!on)return;
  ITEMS.forEach((it,i)=>{
    const t0=BURST0+i*S32, p=ez.dec(P(t,t0,t0+1.2));
    // no bobbing: once out, each source drifts slowly outward in a straight line (4 px/s)
    const ox=it.home[0]-960, oy=it.home[1]-457, ol=Math.hypot(ox,oy)||1, dr=4*Math.max(0,t-t0);
    const hx=it.home[0]+ox/ol*dr, hy=it.home[1]+oy/ol*dr;
    let x=lerp(960,hx,p), y=lerp(457,hy,p), sc=0.5+0.5*p, op=t>=t0?Math.min(1,p*2.5):0, ro=it.ro*p;
    const j=ABSORB_ORDER.indexOf(i), ta=ABS_T[j];
    if(t>=ta-0.8){                                                    // glides into the app, landing on its 16th
      const q=ez.ioC(P(t,ta-0.8,ta)), tg=natToStage(...centerIn(TARGETS[i]));
      x=lerp(hx,tg[0],q);y=lerp(hy,tg[1],q);sc*=1-0.7*q;ro*=1-q;op=t<ta?1-ez.inC(P(t,ta-0.15,ta)):0;}
    st(it.el,{left:(x-(it.w||250)/2).toFixed(1)+'px',top:(y-it.h/2).toFixed(1)+'px',opacity:op.toFixed(3),
      transform:`rotate(${ro.toFixed(2)}deg) scale(${sc.toFixed(4)})`});
  });
}
function mixHex(a,b,p){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);
  return '#'+[16,8,0].map(k=>Math.round(((A>>k)&255)+(((B>>k)&255)-((A>>k)&255))*p).toString(16).padStart(2,'0')).join('');}
function landGlow(el,t,ta,rgba){const q=t-ta,e=q<0?0:q<0.1?q/0.1:Math.max(0,1-(q-0.1)/0.7);    // soft: 0.1 s up, 0.7 s down
  el.style.boxShadow=e>0?`0 0 0 ${(2*e).toFixed(1)}px ${rgba},0 0 ${(30*e).toFixed(0)}px ${rgba}`:'';}
function sceneApp(t){
  const on=t>=vbeat(12)-0.05&&t<vbeat(52); show(uiWrap,on); if(!on){uiWrap.style.opacity=0;return;}
  // window size (uiwState): small while it gathers the sources, full size from the drums in, recedes into the wall
  st(uiWrap,{opacity:(UIW.a*(1-UIW.gone)).toFixed(3),transform:`translate(${UIW.tx.toFixed(2)}px,${UIW.ty.toFixed(2)}px) scale(${UIW.s.toFixed(4)})`});
  st($('capBand'),{opacity:(ez.dec(P(t,vbeat(16.5),vbeat(17)))*(1-ez.inC(P(t,vbeat(47.5),vbeat(48.5))))).toFixed(3)});
  {const ba=((kOf(t)/8*360)%360)+'deg';$('uiBeam').style.setProperty('--ba',ba);$('uiBeamS').style.setProperty('--ba',ba);}
  // the pages: the new one fades in over the one before (each page opaque, so nothing shows through)
  const {cur,prev,sw}=pageAt(t), vis={};
  for(const k in PG){const o=k===cur?sw:(k===prev?1:0);vis[k]=k===cur?sw:(k===prev?1-sw:0);show(PG[k],o>0.001);PG[k].style.opacity=o.toFixed(3);
    PG[k].style.zIndex=k===cur?2:1;
    if(VS[k]){show(VS[k],o>0.001);st(VS[k],{opacity:o.toFixed(3),zIndex:PG[k].style.zIndex});}}
  const V=k=>vis[k]||0;
  // ---- projects: files and sources land
  ITEMS.forEach((it,i)=>{const ta=ABS_T[ABSORB_ORDER.indexOf(i)];
    if(it.kind==='file'){const r=TARGETS[i],p=ez.dec(P(t,ta,ta+0.6));
      st(r,{opacity:(p*V('projects-base')).toFixed(3),transform:`translateX(${((1-p)*-24).toFixed(1)}px)`});}
    else {const q=t-ta,e=q<0?0:q<0.1?q/0.1:Math.max(0,1-(q-0.1)/0.7);TARGETS[i].style.opacity=(e*V('projects-base')).toFixed(3);}});
  // ---- assistant: the question typed (2 letters a 32nd from k17), sent on k19.5; it thinks; the answer, its sources
  {const k0=vbeat(17), n=t<k0?0:Math.min(KQN,(Math.floor((t-k0)/S32)+1)*2), typing=V('ask-space');
   const xr=TX1-(TX1-TX0)*n/KQN;
   aTyped.style.clipPath=`inset(0 0 0 ${(xr-AF.x).toFixed(1)}px)`;aTyped.style.opacity=(n>0?typing:0).toFixed(3);
   aCaret.style.left=(xr-1.6).toFixed(1)+'px';aCaret.style.opacity=(t>=vbeat(16.75)&&t<vbeat(19.5)?typing:0).toFixed(3);
   const press=Math.sin(Math.PI*P(t,vbeat(19.5)-0.03,vbeat(19.5)+0.2));
   aSend.style.opacity=(n>0?typing:0).toFixed(3);aSend.style.transform=`scale(${(1-0.08*press).toFixed(3)})`;
   aSrc.style.opacity=(ez.dec(P(t,vbeat(21.75),vbeat(21.75)+0.4))*(1-0.4*ez.ioC(P(t,vbeat(22.75),vbeat(23.75))))*V('ask-answer')).toFixed(3);}
  // ---- monitoring rules: the rule lights; its alert comes out of the bell
  {const r=ez.dec(P(t,vbeat(25.5),vbeat(25.5)+0.6))*(1-ez.ioC(P(t,vbeat(27.5),vbeat(28.3))));ruleRim.style.opacity=(r*V('monitors')).toFixed(3);
   const g=ez.dec(P(t,vbeat(27.75),vbeat(28.25)))*(1-0.5*ez.ioC(P(t,vbeat(29.5),vbeat(31))));bellGlow.style.opacity=(g*V('monitors')).toFixed(3);
   const q=ez.dec(P(t,vbeat(28),vbeat(28)+0.55));
   st(pop,{opacity:(Math.min(1,q*3)*V('monitors')).toFixed(3),transform:`scale(${(0.08+0.92*q).toFixed(4)})`,filter:q<1?`blur(${(8*(1-q)).toFixed(2)}px)`:'none'});}
  // ---- the passport's seal: «السلسلة سليمة — لا يوجد عبث»
  sealGlow.style.opacity=(ez.dec(P(t,vbeat(45.5),vbeat(45.5)+0.6))*V('passport')).toFixed(3);
  // ---- cursor: «موافقة» (k37), «تأكيد الموافقة» (k40), «جواز القرار» (k44.5)
  {const a=[1250/K,700/K];
   const m1=ez.prem(P(t,vbeat(35.75),vbeat(36.9))),m2=ez.prem(P(t,vbeat(38.6),vbeat(39.9))),m3=ez.prem(P(t,vbeat(43.6),vbeat(44.4)));
   let x=lerp(a[0],C_OK[0],m1)+Math.sin(Math.PI*m1)*60, y=lerp(a[1],C_OK[1],m1)+Math.sin(Math.PI*m1)*70;
   x=lerp(x,C_CONF[0],m2);y=lerp(y,C_CONF[1],m2);x=lerp(x,C_PASS[0],m3);y=lerp(y,C_PASS[1],m3);
   const vis1=t>=vbeat(35.75)&&t<vbeat(41)?ez.dec(P(t,vbeat(35.75),vbeat(36.1)))*(1-ez.inC(P(t,vbeat(40.6),vbeat(41)))):0;
   const vis2=t>=vbeat(43.6)&&t<vbeat(45.4)?ez.dec(P(t,vbeat(43.6),vbeat(43.9)))*(1-ez.inC(P(t,vbeat(45),vbeat(45.4)))):0;
   st($('cursor'),{left:(x*K-3).toFixed(1)+'px',top:(y*K-4).toFixed(1)+'px',opacity:Math.max(vis1,vis2).toFixed(3)});
   const clickAt=t<vbeat(39)?vbeat(37):t<vbeat(43)?vbeat(40):vbeat(44.5),rp=P(t,clickAt,clickAt+0.5),tg=t<vbeat(39)?C_OK:t<vbeat(43)?C_CONF:C_PASS;
   if(rp>0&&rp<1){const rr=(0.28+0.72*ez.outC(rp))*90;
     st($('rip'),{left:(tg[0]*K-rr).toFixed(1)+'px',top:(tg[1]*K-rr).toFixed(1)+'px',width:2*rr+'px',height:2*rr+'px',opacity:((1-rp)*0.9).toFixed(3),
       borderWidth:(2.5-rp*1.5).toFixed(2)+'px'});show($('rip'),true);}
   else show($('rip'),false);}
  // ---- the sample-data label, while the app is up
  $('note').style.opacity=(ez.dec(P(t,vbeat(12.5),vbeat(13.5)))*(1-ez.inC(P(t,vbeat(48),vbeat(49))))).toFixed(3);
}
function sceneWall(t){
  const inG=t>=vbeat(48)-0.05&&t<vbeat(56.2), inI=t>=IGN-0.1;
  showS($('wallWrap'),inG||inI); if(!(inG||inI))return;
  let op,t0;
  if(inG){op=ez.dec(P(t,vbeat(48),vbeat(49.5)))*(1-ez.inC(P(t,vbeat(54),vbeat(56))));t0=vbeat(48);}
  else {op=0.55*ez.dec(P(t,IGN,IGN+1.2))*(1-ez.inC(P(t,52.4,53.95)));t0=IGN-3;}
  st($('wallWrap'),{opacity:op.toFixed(3)});
  st($('wall'),{transform:`perspective(2600px) rotateX(46deg) rotateZ(-22deg) translateY(${(-(t-t0)*18).toFixed(1)}px) scale(${(1.07-0.07*ez.dec(P(t,t0,t0+1.4))).toFixed(4)})`});
}
function sceneH(t){
  const on=t>=vbeat(55.8)&&t<IGN+0.05; showS($('sH'),on); if(!on)return;
  const conv=ez.ioC(P(t,vbeat(62),IGN));
  [0,1,2].forEach(i=>{const g=$('kw'+i),t0=vbeat(56+2*i);
    const svg=g.querySelector('.kwdIcon'),en=g.querySelector('.en'),ar=g.querySelector('.ar'),path=$('kw'+i+'p');
    const pI=ez.dec(P(t,t0,t0+0.8)),pE=ez.dec(P(t,t0,t0+0.9)),pA=ez.dec(P(t,t0+S8,t0+S8+0.8));
    const L=path.getTotalLength();path.style.strokeDasharray=L;path.style.strokeDashoffset=(L*(1-pI)).toFixed(2);
    st(svg,{opacity:pI.toFixed(3),transform:`translateY(${((1-pI)*14).toFixed(1)}px)`});
    st(en,{opacity:pE.toFixed(3),transform:`translateY(${((1-pE)*34).toFixed(1)}px)`,filter:pE<1?`blur(${(6*(1-pE)).toFixed(2)}px)`:'none'});
    st(ar,{opacity:pA.toFixed(3),transform:`translateY(${((1-pA)*20).toFixed(1)}px)`});
    const gx=parseFloat(g.style.left)+210, gy=480;                                 // converge into the logo's centre
    st(g,{transform:`translate(${((CX-gx)*conv).toFixed(1)}px,${((CY-gy)*conv).toFixed(1)}px) scale(${(1-0.8*conv).toFixed(4)})`,opacity:(1-ez.inC(P(t,IGN-0.2,IGN))).toFixed(3)});});
}
function sceneI(t){
  const on=t>=IGN-0.3; showS($('sI'),on);
  const o=$('orb');
  if(!on){o.style.opacity=0;$('burst').setAttribute('opacity',0);showS($('shock1'),false);showS($('shock2'),false);return;}
  // orb gathers the three words, then bursts on the hit
  const gather=ez.ioC(P(t,vbeat(62),IGN)), after=t>=IGN?Math.exp(-(t-IGN)/0.5):0;
  const os=t<IGN?0.2+0.9*gather:1.1+1.6*after;
  st(o,{left:CX+'px',top:CY+'px',opacity:(t<IGN?gather*0.95:0.95*after).toFixed(3),transform:`scale(${os.toFixed(4)})`});
  $('burst').setAttribute('opacity',1);
  [['shock1',IGN,1.1,600,2.6,0.8],['shock2',IGN+0.15,1.2,400,1.8,0.5]].forEach(([id,t0,d,R,w,op])=>{
    const p=P(t,t0,t0+d),e=$(id);showS(e,p>0&&p<1);if(p<=0||p>=1)return;
    const r=70+R*ez.outC(p);st(e,{left:(CX-r)+'px',top:(CY-r)+'px',width:2*r+'px',height:2*r+'px',borderWidth:(w*(1-p)+0.6)+'px',opacity:op*(1-p)**1.3});});
  RB.forEach(b=>{const p=P(t,IGN,IGN+0.8*b.sp);if(p<=0||p>=1){b.el.setAttribute('opacity',0);return;}
    const e=ez.outC(p),r0=100+540*e*b.sp,L=(170*b.len)*(1-p)+8;
    b.el.setAttribute('x1',CX+Math.cos(b.a)*r0);b.el.setAttribute('y1',CY+Math.sin(b.a)*r0);
    b.el.setAttribute('x2',CX+Math.cos(b.a)*(r0+L));b.el.setAttribute('y2',CY+Math.sin(b.a)*(r0+L));
    b.el.setAttribute('stroke-width',(3.2*(1-p)+0.8).toFixed(2));b.el.setAttribute('opacity',(0.95*(1-p)**1.4).toFixed(3));});
  SPK.forEach(s=>{const p=P(t,IGN+0.02,IGN+0.02+s.life);if(p<=0||p>=1){s.el.setAttribute('opacity',0);return;}
    const d=95+0.7*s.v*ez.outC(p);s.el.setAttribute('cx',CX+Math.cos(s.a)*d);s.el.setAttribute('cy',CY+Math.sin(s.a)*d+30*p*p);
    s.el.setAttribute('r',(s.r*(1-0.5*p)).toFixed(2));s.el.setAttribute('opacity',(0.9*(1-p)**1.2).toFixed(3));});
  // the mark: a soft scale-in on the hit, slowing into its size (never past it: no overshoot), then holds
  let sc,op,bl=0;
  if(t<IGN-0.1){sc=0.6;op=0;}
  else if(t<IGN+1.0){const q=P(t,IGN-0.1,IGN+1.0);sc=0.6+0.4*ez.dec(q);op=Math.min(1,q*2.2);bl=4*Math.max(0,1-2*q);}
  else {sc=1.0;op=1;}
  const g=24+18*Math.exp(-Math.max(0,t-IGN)/0.45)*(t>=IGN?1:0);
  st($('endM'),{opacity:op.toFixed(3),transform:`scale(${sc.toFixed(4)})`,
    filter:`blur(${bl.toFixed(2)}px) drop-shadow(0 0 ${g.toFixed(1)}px rgba(188,89,209,0.72)) drop-shadow(0 0 ${(g*2.6).toFixed(1)}px rgba(142,50,195,0.45))`});
  const gp=P(t,vbeat(65.25),vbeat(66.25));
  st($('mGlint'),{transform:`scale(${sc.toFixed(4)})`,opacity:(gp>0&&gp<1?Math.sin(Math.PI*gp)*op:0).toFixed(3),backgroundPosition:`${(110-120*ez.ioC(gp)).toFixed(1)}% 0`});
  // wordmark, tagline, url and "Book your demo · احجز عرضك التجريبي" on the bar lines, the CTA held 3.5 s before the fade
  const pW=ez.dec(P(t,vbeat(68),vbeat(68)+1.0));st($('endWord'),{opacity:(pW*0.92).toFixed(3),transform:`translateY(${((1-pW)*18).toFixed(1)}px)`});
  enter($('endTag'),t,vbeat(72),0.9);enter($('endTagAR'),t,vbeat(72.5),0.9,18);
  enter($('endURL'),t,vbeat(74),0.9,16);
  const pc=ez.dec(P(t,vbeat(76),vbeat(76)+0.9));st($('endCTA'),{opacity:pc.toFixed(3),transform:`scale(${(0.95+0.05*pc).toFixed(4)})`});
}
function captions(t){
  capSimple($('c1en'),t,vbeat(4),BURST0-0.45,BURST0);capSimple($('c1ar'),t,vbeat(4.5),BURST0-0.45,BURST0,18);
  capSimple($('c2en'),t,vbeat(8.5),vbeat(15),vbeat(15.75));capSimple($('c2ar'),t,vbeat(9),vbeat(15),vbeat(15.75),18);
  capParts($('c3en'),t,[vbeat(17),vbeat(22)],vbeat(23.25),vbeat(24));capParts($('c3ar'),t,[vbeat(17.5),vbeat(22.5)],vbeat(23.25),vbeat(24),18);
  capSimple($('c4en'),t,vbeat(24.5),vbeat(31.25),vbeat(32));capSimple($('c4ar'),t,vbeat(25),vbeat(31.25),vbeat(32),18);
  capParts($('c5en'),t,[vbeat(32.5),vbeat(34)],vbeat(39.25),vbeat(40));capParts($('c5ar'),t,[vbeat(33),vbeat(34.5)],vbeat(39.25),vbeat(40),18);
  capParts($('c6en'),t,[vbeat(44.75),vbeat(45.75)],vbeat(47.25),vbeat(48));capParts($('c6ar'),t,[vbeat(45.25),vbeat(46.25)],vbeat(47.25),vbeat(48),18);
  capSimple($('c7en'),t,vbeat(48.5),vbeat(54.75),vbeat(55.6));capSimple($('c7ar'),t,vbeat(49),vbeat(54.75),vbeat(55.6),18);
}
function flash(t){
  let f=0;
  {const q=t-vbeat(8);if(q>-0.1&&q<1.2)f=Math.max(f,0.10*(q<0?(q+0.1)/0.1:Math.exp(-q/0.3)));}        // the number dissolves
  {const q=t-IGN;if(q>-0.1&&q<1.6)f=Math.max(f,0.30*(q<0?(q+0.1)/0.1:Math.exp(-q/0.4)));}             // logo ignition
  $('flash').style.opacity=f.toFixed(3);
}

/* ================= master ================= */
window.SEEK=function(t){
  t=clamp(t,0,window.DURATION);
  CAM=camState(t);
  uiwState(t);
  drawBG(t);
  sceneA(t);sceneB(t);sceneApp(t);sceneWall(t);sceneH(t);sceneI(t);
  captions(t);flash(t);
  camera(t);
  $('fade').style.opacity=ez.inC(P(t,52.4,53.95)).toFixed(3);
  drawFX(t);
  return true;
};
SEEK(0);
