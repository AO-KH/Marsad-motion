/* ===== MARSAD demo engine =====
   Deterministic motion graphics for Marsad product demos. Every frame is a pure function of time:
   window.SEEK(t) draws the frame at t seconds, and render_full.js screenshots SEEK(i/30) for every frame.
   One demo script renders in two formats, '16x9' (1920x1080) and '9x16' (1080x1920), picked by
   window.DEMO.format (tools/make_demo.py sets it and bakes one HTML file per format).

   House style (the client's rules; see DEMOS.md): the web app's light UI with a purple glow, glass icons,
   bilingual EN/AR captions, calm pace (entrances 0.6-1.0 s on a decelerating ease, no pops), no shaking,
   nothing pulsing to the beat, no camera cuts. The engine's defaults follow these rules; keep them.

   API (all times in seconds; M.B(k) turns beat k of the music into seconds):
     M.title({at,out,icon,kicker,kickerAr,en,ar,sub})       big bilingual title with a glass icon
     M.caption({at,out,en,ar})                               bilingual caption line
     M.steps({at,out,list:[{at,en,ar},...]})                 walkthrough: numbered rail + one caption per step
     const app=M.app({at,out,page,view})                     the Marsad app window (site-kit page or M.definePage)
       app.page(t,key)  app.focus(t,target,{fill,scale,dur,x,y})  app.cursor(t,target)  app.click(t,target)
       app.cursorOut(t)  app.type(t,target,text,{cps,clearAt})  app.show(t,target,{from,dist,dur,display})
       app.hide(t,target)  app.highlight(at,out,target)  app.callout(at,out,target,{en,ar,side})
       app.toggle(t,target)  app.count(t,target,from,to,{dur,fmt})  app.text(t,target,html)
       app.set(t,target,(el,on,t)=>{})  app.inject(page,html)  app.el(target,t)
     M.endcard({at,cta,ctaAr,url,tag,tagAr})                 logo, tagline, URL and CTA
     M.track(t=>{}) / M.at(t,(on,t)=>{}) / M.tween(t0,dur,p=>{},ease)   custom per-frame logic
     M.start()                                               last line of every demo
   Targets: a CSS selector on the page shown at that time, 'text:…' (the smallest element containing the text),
   {page:'decisions',sel:'#btnOK'}, an element, or a natural-coordinate rect {x,y,w,h}. */
window.M=(function(){
'use strict';
const DEMO=window.DEMO||{};
const FORMAT=DEMO.format==='9x16'?'9x16':'16x9';
const LAY={
  // win: the app window in stage px. cover: the 'page' view fills the window (crops) instead of fitting.
  // sMax: the closest zoom (natural px -> stage px). fill: how much of the window a focused element fills.
  '16x9':{W:1920,H:1080,win:{x:280,y:150,w:1360,h:760},cover:false,sMax:1.3,fill:0.72,
          rail:{dir:'v',x:140,y:530,gap:112,sz:64},tip:[2.1,2.1],rip:1},
  '9x16':{W:1080,H:1920,win:{x:40,y:400,w:1000,h:1000},cover:true,sMax:1.6,fill:0.9,
          rail:{dir:'h',x:540,y:282,gap:150,sz:72},tip:[2.7,2.7],rip:1.3},
}[FORMAT];
const W=LAY.W,H=LAY.H,WIN=LAY.win;
const DUR=+DEMO.duration||30;
const BPM=+DEMO.bpm||120, MB=60/BPM, PH=+DEMO.phase||0;
const B=k=>PH+MB*k;                                   // beat k -> seconds (k=0: the first downbeat in the video)
const DRIFT=0.012;                                    // the whole stage pushes in 1.2% over the video: slow, steady

/* ---------------- helpers ---------------- */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), lerp=(a,b,p)=>a+(b-a)*p;
const P=(t,a,b)=>b<=a?(t>=a?1:0):clamp((t-a)/(b-a),0,1);
function cubicBezier(x1,y1,x2,y2){return x=>{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1,u=x;
  for(let i=0;i<30;i++){u=(lo+hi)/2;const cx=3*u*(1-u)*(1-u)*x1+3*u*u*(1-u)*x2+u*u*u;if(cx<x)lo=u;else hi=u;}
  return 3*u*(1-u)*(1-u)*y1+3*u*u*(1-u)*y2+u*u*u;};}
const ez={lin:p=>p,outC:p=>1-Math.pow(1-p,3),inC:p=>p*p*p,ioC:p=>p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,
  sin:p=>0.5-0.5*Math.cos(Math.PI*p),dec:cubicBezier(0,0,0.2,1),prem:cubicBezier(0.4,0,0.2,1)};
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function st(e,o){for(const k in o)e.style[k]=o[k];}
function el(tag,cls,html,parent){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e;}
const f3=x=>(+x).toFixed(3), f2=x=>(+x).toFixed(2), f1=x=>(+x).toFixed(1);
const arNum=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ic=(n,s=24,c='currentColor',w=2)=>window.SK?SK.ic(n,s,c,w):'';
const pick=(a16,a916)=>FORMAT==='9x16'?a916:a16;
const GLASS=(col,base)=>`<i class="gk"${base?` style="background:${base}"`:''}></i><i class="gb" style="background:${col}"></i><i class="gp"></i><i class="gs"></i>`;
const PRE=[],MID=[],POST=[];                          // per-frame updates: window/view, elements+overlays, cursor+callouts

/* ---------------- stage ---------------- */
document.body.classList.add('f'+FORMAT);
const stage=el('div',null,null,document.body);stage.id='stage';
const bg=el('canvas',null,null,stage);bg.id='bg';bg.width=W;bg.height=H;
const cam=el('div',null,null,stage);cam.id='cam';
const L={};['title','win','over','rail','caps','end'].forEach(k=>L[k]=el('div','m-layer',null,cam));
const fxc=el('canvas',null,null,stage);fxc.id='fx';fxc.width=W;fxc.height=H;
const fadeEl=el('div',null,null,stage);fadeEl.id='fade';

/* ---------------- background: soft purple light, a slow dot grid and drifting dust (no pulsing) ---------------- */
const bgx=bg.getContext('2d'),fxx=fxc.getContext('2d');
const DUST=[];{const r=mulberry(1234),n=Math.round(64*W*H/(1920*1080));
  for(let i=0;i<n;i++)DUST.push({x:r()*W,y:r()*H,s:0.7+r()*1.9,v:4+r()*9,ph:r()*Math.PI*2});}
function drawBG(t){
  const R=Math.max(W,H);
  bgx.fillStyle='#FFFFFF';bgx.fillRect(0,0,W,H);
  const glow=(x,y,r,stops)=>{const g=bgx.createRadialGradient(x,y,40,x,y,r);stops.forEach(([o,c])=>g.addColorStop(o,c));bgx.fillStyle=g;bgx.fillRect(0,0,W,H);};
  glow(W*0.125+60*Math.sin(t*0.11),H*0.074,R*0.625,[[0,'rgba(142,50,195,0.17)'],[0.5,'rgba(142,50,195,0.06)'],[1,'rgba(142,50,195,0)']]);
  glow(W*0.896-60*Math.sin(t*0.09),H*0.935,R*0.625,[[0,'rgba(222,13,255,0.13)'],[0.5,'rgba(188,89,209,0.05)'],[1,'rgba(222,13,255,0)']]);
  glow(W/2,H*0.48,R*0.52,[[0,'rgba(188,89,209,0.13)'],[0.55,'rgba(142,50,195,0.05)'],[1,'rgba(142,50,195,0)']]);
  const pitch=32,off=(t*3.2)%pitch;
  bgx.fillStyle='rgba(142,50,195,0.20)';
  for(let x=-2*pitch+off;x<W+pitch;x+=pitch)for(let y=-2*pitch+off*0.6;y<H+pitch;y+=pitch)bgx.fillRect(x,y,1.7,1.7);
  bgx.save();bgx.shadowColor='rgba(188,89,209,0.9)';bgx.shadowBlur=14;
  for(const d of DUST){const y=((d.y-t*d.v)%(H+40)+(H+40))%(H+40)-20,tw=0.35+0.3*Math.sin(t*0.8+d.ph);
    bgx.fillStyle=`rgba(188,89,209,${0.22*tw*d.s})`;bgx.beginPath();
    bgx.arc(((d.x+Math.sin(t*0.22+d.ph)*24)%W+W)%W,y,d.s*1.3,0,7);bgx.fill();}
  bgx.restore();
}
function drawFX(t){                                   // purple vignette + fine film grain (a new grain per frame)
  fxx.clearRect(0,0,W,H);
  const v=fxx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.6,W/2,H/2,Math.hypot(W,H)*0.72);
  v.addColorStop(0,'rgba(110,30,180,0)');v.addColorStop(1,'rgba(110,30,180,0.12)');fxx.fillStyle=v;fxx.fillRect(0,0,W,H);
  const r=mulberry(9000+Math.floor(t*30+1e-6));fxx.globalAlpha=0.028;
  for(let i=0;i<1500;i++){const x=r()*W,y=r()*H,l=100+r()*155;fxx.fillStyle=`rgb(${l},${l},${l})`;fxx.fillRect(x,y,1.6,1.6);}
  fxx.globalAlpha=1;
}

/* ---------------- title card ---------------- */
function title(o){
  const out=o.out??Infinity;
  const e=el('div','m-title',
    (o.icon?`<div class="ico">${GLASS(o.color||'#8E32C3')}${ic(o.icon,64,o.iconColor||'#6A12B8',2)}</div>`:'')+
    (o.kicker?`<div class="kick">${o.kicker}${o.kickerAr?` &nbsp;·&nbsp; <span class="ar">${o.kickerAr}</span>`:''}</div>`:'')+
    `<div class="en">${o.en||''}</div>`+(o.ar?`<div class="ar">${o.ar}</div>`:'')+(o.sub?`<div class="sub">${o.sub}</div>`:''),L.title);
  const parts=[[':scope>.ico',0,0.8,16,0],[':scope>.kick',0.1,0.8,12,0],[':scope>.en',0.15,0.9,26,6],[':scope>.ar',0.4,0.8,18,0],[':scope>.sub',0.6,0.8,14,0]]
    .map(([s,d,dur,dy,bl])=>[e.querySelector(s),d,dur,dy,bl]).filter(x=>x[0]);
  MID.push(t=>{const on=t>=o.at-0.01&&t<out+0.7;e.style.display=on?'':'none';if(!on)return;
    const x=ez.inC(P(t,out,out+0.6));
    for(const [n,d,dur,dy,bl] of parts){const p=ez.dec(P(t,o.at+d,o.at+d+dur));
      st(n,{opacity:f3(p*(1-x)),transform:`translateY(${f2((1-p)*dy-12*x)}px)`,filter:bl&&p<1?`blur(${f2(bl*(1-p))}px)`:'none'});}});
  return e;
}

/* ---------------- captions ---------------- */
function caption(o){
  const out=o.out??Infinity;
  const e=el('div','m-cap',`<div class="en">${o.num!=null?`<span class="sn">${o.num}</span>`:''}${o.en||''}</div>`+
    (o.ar?`<div class="ar">${o.ar}</div>`:''),L.caps);
  const en=e.children[0],ar=e.children[1];
  MID.push(t=>{const on=t>=o.at-0.01&&t<out+0.55;e.style.display=on?'':'none';if(!on)return;
    const pe=ez.dec(P(t,o.at,o.at+0.9)),pa=ez.dec(P(t,o.at+0.25,o.at+1.05)),x=ez.inC(P(t,out,out+0.5));
    e.style.opacity=f3(1-x);
    st(en,{opacity:f3(pe),transform:`translateY(${f2((1-pe)*24)}px)`});
    if(ar)st(ar,{opacity:f3(pa),transform:`translateY(${f2((1-pa)*18)}px)`});});
  return e;
}

/* ---------------- walkthrough steps: a numbered rail (left in 16:9, top in 9:16) + one caption per step ---------------- */
function steps(o){
  const n=o.list.length,R=LAY.rail,out=o.out??Infinity;
  const pos=i=>R.dir==='v'?[R.x,R.y+(i-(n-1)/2)*R.gap]:[R.x+(i-(n-1)/2)*R.gap,R.y];
  const [x0,y0]=pos(0),[x1,y1]=pos(n-1);
  const rail=el('div','m-rail',`<svg class="ln" width="${W}" height="${H}"><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#E2D2F5" stroke-width="3" stroke-linecap="round"/>`+
    `<line class="pr" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0}" stroke="#8E32C3" stroke-width="3" stroke-linecap="round"/></svg>`,L.rail);
  const pr=rail.querySelector('.pr');
  const bub=o.list.map((s,i)=>{const [x,y]=pos(i);
    const b=el('div','st m-glass',GLASS('#8E32C3')+`<div class="lay up">${i+1}</div><div class="lay on">${i+1}</div>`+
      `<div class="lay dn">${ic('check',R.sz*0.44,'#6A12B8',2.8)}</div>`,rail);
    st(b,{left:(x-R.sz/2)+'px',top:(y-R.sz/2)+'px'});
    return {b,up:b.querySelector('.up'),on:b.querySelector('.on'),dn:b.querySelector('.dn')};});
  const kick=el('div','kick','',rail);
  if(R.dir==='v')st(kick,{left:(x0-130)+'px',width:'260px',top:(y0-R.sz/2-78)+'px'});
  else st(kick,{left:'0px',width:W+'px',top:(y0-R.sz/2-96)+'px'});
  o.list.forEach((s,i)=>{const nx=i<n-1?o.list[i+1].at:out;caption({at:s.at,out:nx-0.5,en:s.en,ar:s.ar,num:i+1});});
  let lastK='';
  MID.push(t=>{const on=t>=o.at-0.01&&t<out+0.7;rail.style.display=on?'':'none';if(!on)return;
    rail.style.opacity=f3(ez.dec(P(t,o.at,o.at+0.8))*(1-ez.inC(P(t,out,out+0.6))));
    let cur=0;o.list.forEach((s,i)=>{if(t>=s.at)cur=i+1;});
    bub.forEach((b,i)=>{const s=o.list[i],nx=i<n-1?o.list[i+1].at:Infinity;
      const pOn=ez.dec(P(t,s.at,s.at+0.6)),pDn=ez.dec(P(t,nx,nx+0.6));
      b.on.style.opacity=f3(pOn*(1-pDn));b.dn.style.opacity=f3(pDn);b.up.style.opacity=f3(1-pOn);});
    let prog=0;o.list.forEach((s,i)=>{if(i>0)prog+=ez.ioC(P(t,s.at,s.at+0.8));});
    const f=n>1?prog/(n-1):0;pr.setAttribute('x2',f1(lerp(x0,x1,f)));pr.setAttribute('y2',f1(lerp(y0,y1,f)));
    const k=cur?`STEP ${cur} / ${n}<span class="ar">الخطوة ${arNum(cur)} من ${arNum(n)}</span>`:`STEPS<span class="ar">الخطوات</span>`;
    if(k!==lastK){kick.innerHTML=k;lastK=k;}});
  return rail;
}

/* ---------------- custom pages and site-kit fixes ---------------- */
const CUSTOM={};
// M.definePage(key,{html,tab,w,h}) for a page built from site-kit pieces, or {img:'demos/x/shots/a.png',w,h} for a screenshot
function definePage(key,spec){CUSTOM[key]=spec;}
const FIX={decisions:e=>{const t=e.querySelector('#toast');if(t){t.dataset.disp='flex';t.style.display='none';}}};

/* ---------------- the app window ---------------- */
const CURSOR='<svg viewBox="0 0 28 40"><path d="M2 2 L2 30 L9.5 24 L14 36 L19 34 L14.5 22 L24 22 Z" fill="#FFFFFF" stroke="#1A191E" stroke-width="2.4" stroke-linejoin="round"/></svg>';
let VIEW={tx:0,ty:0,s:1},WOFF={y:0,s:1,vis:false},APP=null;
function app(o){
  if(APP)throw new Error('M.app: one app window per demo');
  const at=o.at??0,out=o.out??Infinity;
  const win=el('div','m-win',null,L.win);st(win,{left:WIN.x+'px',top:WIN.y+'px',width:WIN.w+'px',height:WIN.h+'px'});
  const frame=el('div','m-frame',null,win);
  const site=el('div','site m-site',null,frame);
  const beamS=el('div','m-beam soft',null,win),beam=el('div','m-beam',null,win);
  const rip=el('div','m-rip',null,win);
  const cur=el('div','m-cursor',CURSOR,win);
  const PG={},PSEQ=[],VSEQ=[],CUR=[],OUTS=[],CLK=[];
  let chrome=null,chUL=null,chTabs=[];

  function page(key){
    if(PG[key])return PG[key];
    const c=CUSTOM[key];let html,tab=null,w=1896,h=1060;
    if(c&&c.img){w=c.w;h=c.h;html=`<img src="${c.img}" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;">`;}
    else if(c){html=typeof c.html==='function'?c.html():c.html;w=c.w||w;h=c.h||h;tab=c.tab||null;}
    else if(window.SK&&SK.PAGES[key])html=SK.PAGES[key]();
    else throw new Error(`M.app: unknown page "${key}" (site kit: ${window.SK?Object.keys(SK.PAGES).join(', '):'-'}; or M.definePage)`);
    if(window.SK&&!(c&&c.img))for(const [k] of SK.TABS){const ch=SK.chrome(k);if(html.includes(ch)){html=html.replace(ch,'');tab=tab||k;break;}}
    const e=el('div','m-page',html,site);st(e,{width:w+'px',height:h+'px',visibility:'hidden'});
    if(tab&&!chrome){chrome=el('div','m-page m-chrome',SK.chrome(tab),site);st(chrome,{width:w+'px'});
      chUL=chrome.querySelector('.sk-ul');chTabs=[...chrome.querySelectorAll('.sk-tab')];}
    if(chrome)site.appendChild(chrome);                                // the shared top bar stays above every page
    if(FIX[key])FIX[key](e);
    return PG[key]={key,el:e,tab,w,h};
  }
  const pageAt=t=>{let k=PSEQ[0][1];for(const [t0,key] of PSEQ)if(t>=t0)k=key;return k;};
  PSEQ.push([-1e9,o.page,0]);page(o.page);

  function find(spec,t){
    if(spec instanceof Element)return spec;
    let key=pageAt(t),sel=spec;
    if(spec&&typeof spec==='object'){key=spec.page||key;sel=spec.sel;}
    const roots=[page(key).el].concat(chrome?[chrome]:[]);
    let e=null;
    if(sel.startsWith('text:')){const q=sel.slice(5);
      for(const r of roots)for(const c of r.querySelectorAll('*')){const tx=c.textContent;
        if(tx&&tx.includes(q)&&(!e||tx.length<e.textContent.length))e=c;}}
    else for(const r of roots){e=r.querySelector(sel);if(e)break;}
    if(!e)throw new Error(`M.app: no element "${sel}" on page "${key}"`);
    while(e&&!(e instanceof HTMLElement))e=e.parentElement;               // svg parts: use the nearest html box
    return e;
  }
  const lazy=(spec,t)=>{let e=null;return ()=>e||(e=find(spec,t));};
  function rectOf(e){                                                  // natural page coords of the layout box
    const root=e.closest('.m-page'),fixes=[];
    for(let a=e;a&&a!==root;a=a.parentElement)if(getComputedStyle(a).display==='none'){fixes.push([a,a.style.display]);a.style.display='block';}
    let x=0,y=0,n=e;while(n&&n!==root){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}
    const r={x,y,w:e.offsetWidth,h:e.offsetHeight};
    fixes.forEach(([a,d])=>a.style.display=d);
    return r;
  }
  const rectFor=(spec,t)=>spec&&spec.w!=null&&spec.x!=null?spec:rectOf(find(spec,t));

  /* view: which part of the page the window shows. Keys glide (ease in-out) from wherever the view is. */
  VSEQ.push({t:-1e9,spec:'page',opt:o.view||{}});                    // opening view: M.app({view:{x,y,zoom}})
  function viewFor(k){
    const pg=page(pageAt(Math.max(k.t,-1e8)+1e-3));
    const sPage=LAY.cover?Math.max(WIN.w/pg.w,WIN.h/pg.h):Math.min(WIN.w/pg.w,WIN.h/pg.h);
    if(k.spec==='page')return {cx:k.opt.x??pg.w/2,cy:k.opt.y??pg.h/2,s:sPage*(k.opt.zoom||1),pg};
    const r=rectFor(k.spec,k.t),fill=k.opt.fill??LAY.fill;
    const s=clamp(k.opt.scale??Math.min(fill*WIN.w/r.w,fill*WIN.h/r.h),sPage,k.opt.max??LAY.sMax);
    return {cx:r.x+r.w/2+(k.opt.dx||0),cy:r.y+r.h/2+(k.opt.dy||0),s,pg};
  }
  function rawKey(i,t){
    const k=VSEQ[i],to=viewFor(k);if(i===0)return to;
    const from=rawKey(i-1,k.t),p=(ez[k.opt.ease]||ez.ioC)(P(t,k.t,k.t+(k.opt.dur??1.0)));
    return {cx:lerp(from.cx,to.cx,p),cy:lerp(from.cy,to.cy,p),s:from.s*Math.pow(to.s/from.s,p),pg:p<0.5?from.pg:to.pg};
  }
  function place(v){                                                   // keep the page covering the window
    const pw=v.pg.w*v.s,ph=v.pg.h*v.s;let tx=WIN.w/2-v.cx*v.s,ty=WIN.h/2-v.cy*v.s;
    tx=pw>=WIN.w?clamp(tx,WIN.w-pw,0):(WIN.w-pw)/2;ty=ph>=WIN.h?clamp(ty,WIN.h-ph,0):(WIN.h-ph)/2;
    return {tx,ty,s:v.s};
  }
  const viewAt=t=>{let i=0;for(let j=1;j<VSEQ.length;j++)if(t>=VSEQ[j].t)i=j;return place(rawKey(i,t));};
  const TAB={};if(window.SK)SK.TABS.forEach(([k,l,cx,w])=>TAB[k]=[cx-w/2,w]);

  PRE.push(t=>{
    const on=t>=at-0.02&&t<out+0.8;win.style.display=on?'':'none';WOFF.vis=on;if(!on)return;
    const p=ez.dec(P(t,at,at+0.9)),x=ez.inC(P(t,out,out+0.7));
    WOFF={y:(1-p)*36-x*14,s:(0.965+0.035*p)*(1-0.02*x),vis:true};
    st(win,{opacity:f3(p*(1-x)),transform:`translateY(${f2(WOFF.y)}px) scale(${f3(WOFF.s)})`});
    const ba=f1((t/12*360)%360)+'deg';beam.style.setProperty('--ba',ba);beamS.style.setProperty('--ba',ba);   // one slow turn per 12 s
    // pages: the new page fades in over the previous one; the tab underline slides with it
    let ci=0;for(let j=0;j<PSEQ.length;j++)if(t>=PSEQ[j][0])ci=j;
    const [t0,key,dur]=PSEQ[ci],prev=ci>0?PSEQ[ci-1][1]:null,sw=ci>0?ez.ioC(P(t,t0,t0+dur)):1;
    for(const k in PG){const e=PG[k].el,top=k===key,o=top?sw:(k===prev&&sw<1?1:0);
      e.style.visibility=o>0.001?'visible':'hidden';e.style.opacity=f3(o);e.style.zIndex=top?2:1;}
    if(chrome){const ta=PG[key].tab,tb=prev&&sw<1?PG[prev].tab:null;
      chrome.style.opacity=f3(ta?(tb?1:sw):(tb?1-sw:0));
      const A=TAB[tb||ta],Bt=TAB[ta||tb];
      if(A&&Bt&&chUL)st(chUL,{left:f1(lerp(A[0],Bt[0],sw))+'px',width:f1(lerp(A[1],Bt[1],sw))+'px'});
      const onKey=sw<0.5&&tb?tb:ta;chTabs.forEach(e=>e.classList.toggle('on',e.dataset.k===onKey));}
    VIEW=viewAt(t);
    st(site,{transform:`translate(${f2(VIEW.tx)}px,${f2(VIEW.ty)}px) scale(${f3(VIEW.s)})`});
  });

  /* cursor: glides between targets on a gentle arc; clicks press it and send one soft ring */
  const aim=k=>{const r=rectFor(k.spec,k.t);return {x:r.x+r.w*(k.ax??0.5),y:r.y+r.h*(k.ay??0.5)};};
  function curAt(t){                                                   // natural-coords position + visibility
    const ks=CUR.filter(k=>k.t<=t);if(!ks.length)return null;
    const k=ks[ks.length-1],idx=CUR.indexOf(k),to=aim(k);
    const outBefore=OUTS.filter(o=>o<=k.t).reduce((a,b)=>Math.max(a,b),-1e9);
    const s0=CUR.findIndex(c=>c.t>outBefore);                          // this key's visible stretch starts here
    const outAfter=OUTS.filter(o=>o>k.t&&o<=t).reduce((a,b)=>Math.min(a,b),Infinity);
    const inT=CUR[s0].t,vis=ez.dec(P(t,inT,inT+0.35))*(outAfter<Infinity?1-ez.inC(P(t,outAfter,outAfter+0.4)):1);
    const from=idx===s0?{x:to.x+90,y:to.y+70}:aim(CUR[idx-1]);
    const p=ez.ioC(P(t,k.t,k.t+k.dur)),d=Math.hypot(to.x-from.x,to.y-from.y),arc=Math.min(60,0.12*d)*Math.sin(Math.PI*p);
    const nx=d?-(to.y-from.y)/d:0,ny=d?(to.x-from.x)/d:0;
    return {x:lerp(from.x,to.x,p)+nx*arc,y:lerp(from.y,to.y,p)+ny*arc,vis};
  }
  POST.push(t=>{
    const c=WOFF.vis?curAt(t):null;
    if(!c||c.vis<=0.001){cur.style.opacity=0;}
    else{let press=1;for(const k of CLK){const q=P(t,k.t-0.06,k.t+0.24);if(q>0&&q<1)press=Math.min(press,1-0.14*Math.sin(Math.PI*q));}
      st(cur,{opacity:f3(c.vis),transform:`translate(${f1(VIEW.tx+c.x*VIEW.s-LAY.tip[0])}px,${f1(VIEW.ty+c.y*VIEW.s-LAY.tip[1])}px) scale(${f3(press)})`});}
    let rp=null;for(const k of CLK)if(t>=k.t&&t<k.t+0.6)rp=k;
    if(rp&&c){const q=P(t,rp.t,rp.t+0.6),r=(16+40*ez.outC(q))*LAY.rip;
      st(rip,{opacity:f3(0.9*(1-q)),left:f1(VIEW.tx+c.x*VIEW.s-r)+'px',top:f1(VIEW.ty+c.y*VIEW.s-r)+'px',width:f1(2*r)+'px',height:f1(2*r)+'px',
        borderWidth:f2(2.5*(1-q)+0.5)+'px',borderColor:rp.color});}
    else rip.style.opacity=0;
  });

  /* element timelines: show/hide keep one state per element */
  const VIS={};
  function vis(t,spec,type,opt){const id=typeof spec==='string'?spec:JSON.stringify(spec);
    let r=VIS[id];if(!r){r=VIS[id]={get:lazy(spec,t),ev:[]};MID.push(tt=>updVis(r,tt));}
    r.ev.push({t,type,opt});r.ev.sort((a,b)=>a.t-b.t);}
  function updVis(r,t){
    const e=r.get();
    if(e._orig===undefined){e._orig=e.style.transform||'';e._hid=getComputedStyle(e).display==='none';}
    let o=r.ev[0].type==='show'?0:1,dx=0,dy=0,sc=1;
    for(const v of r.ev){if(t<v.t)break;
      const sh=v.type==='show',dur=v.opt.dur??(sh?0.7:0.5),p=(sh?ez.dec:ez.inC)(P(t,v.t,v.t+dur)),d=v.opt.dist??16,q=1-p;
      if(sh){o=p;const fr=v.opt.from||'below';dx=fr==='left'?-d*q:fr==='right'?d*q:0;dy=fr==='below'?d*q:fr==='above'?-d*q:0;sc=v.opt.scale?lerp(v.opt.scale,1,p):1;}
      else{o=1-p;dx=0;dy=-(v.opt.dist??8)*p;sc=1;}}
    if(e._hid)e.style.display=o>0.001?(e.dataset.disp||r.ev.find(v=>v.opt.display)?.opt.display||'block'):'none';
    st(e,{opacity:f3(o),transform:`${e._orig} translate(${f1(dx)}px,${f1(dy)}px) scale(${f3(sc)})`});
  }

  const api={
    page(t,key,opt={}){page(key);PSEQ.push([t,key,opt.dur??0.6]);PSEQ.sort((a,b)=>a[0]-b[0]);return api;},
    focus(t,spec,opt={}){VSEQ.push({t,spec,opt});VSEQ.sort((a,b)=>a.t-b.t);return api;},
    cursor(t,spec,opt={}){CUR.push({t,spec,dur:opt.dur??0.9,ax:opt.ax,ay:opt.ay});CUR.sort((a,b)=>a.t-b.t);return api;},
    cursorOut(t){OUTS.push(t);return api;},
    click(t,spec,opt={}){if(spec!=null&&opt.move!==false)api.cursor(t-(opt.lead??1.0),spec,{dur:opt.dur??0.85,ax:opt.ax,ay:opt.ay});
      CLK.push({t,color:opt.color||'rgba(142,50,195,0.85)'});return api;},
    type(t,spec,text,opt={}){const get=lazy(spec,t),cps=opt.cps??14;
      MID.push(tt=>{const e=get();
        if(!e._mt){e._ph=e.querySelector('.ph')||[...e.children].find(c=>c.tagName==='SPAN');
          e._mt=el('span','m-typed');e._mc=el('span','m-caret');if(e._ph)e._ph.after(e._mt,e._mc);else e.append(e._mt,e._mc);}
        const cleared=opt.clearAt!=null&&tt>=opt.clearAt,n=tt<t||cleared?0:Math.min(text.length,Math.floor((tt-t)*cps)+1);
        e._mt.textContent=text.slice(0,n);if(e._ph)e._ph.style.display=n>0?'none':'';
        const act=tt>=t-0.5&&!cleared;e._mc.style.opacity=act?1:0;e.classList.toggle('focus',act);});
      return api;},
    show(t,spec,opt={}){vis(t,spec,'show',opt);return api;},
    hide(t,spec,opt={}){vis(t,spec,'hide',opt);return api;},
    highlight(a,b,spec,opt={}){const get=lazy(spec,a);let ring=null;
      MID.push(t=>{const e=get();if(!ring)ring=el('div','m-ring',null,e.closest('.m-page'));
        const on=t>=a-0.01&&t<b+0.6;ring.style.display=on?'':'none';if(!on)return;
        const r=rectOf(e),pad=opt.pad??10,rad=opt.radius??(parseFloat(getComputedStyle(e).borderTopLeftRadius)||12)+pad;
        st(ring,{left:f1(r.x-pad)+'px',top:f1(r.y-pad)+'px',width:f1(r.w+2*pad)+'px',height:f1(r.h+2*pad)+'px',borderRadius:f1(rad)+'px',
          opacity:f3(ez.dec(P(t,a,a+0.6))*(1-ez.inC(P(t,b,b+0.5))))});});
      return api;},
    callout(a,b,spec,opt={}){callout(a,b,spec,opt,find,rectFor);return api;},
    toggle(t,spec,opt={}){const get=lazy(spec,t);let parts=null;const dur=opt.dur??0.45;
      MID.push(tt=>{const e=get();
        if(!parts){e.innerHTML=`<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="7.5" cy="12" r="2.8"/></svg><span>${opt.off||'مُعطّل'}</span>`;
          parts={r:e.querySelector('rect'),k:e.querySelector('circle'),s:e.querySelector('span')};}
        const p=ez.dec(P(tt,t,t+dur)),o=p>0.5;
        parts.k.setAttribute('cx',f2(7.5+9*p));parts.k.setAttribute('fill',o?'#5909B4':'#535257');
        parts.r.setAttribute('fill',o?'#E6D6F5':'#F3F3F3');parts.r.setAttribute('stroke',o?'#8E32C3':'#535257');
        parts.s.textContent=o?(opt.on||'مُفعّل'):(opt.off||'مُعطّل');
        st(e,{background:o?'#F1E9FA':'#F3F3F3',borderColor:o?'#D6C1EE':'#D2D1D4',color:o?'#5909B4':'#535257',boxShadow:o?'0 0 26px rgba(142,50,195,0.28)':''});});
      return api;},
    count(t,spec,from,to,opt={}){const get=lazy(spec,t),dur=opt.dur??0.8,fm=opt.fmt||(v=>String(Math.round(v)));
      MID.push(tt=>{get().textContent=fm(lerp(from,to,ez.dec(P(tt,t,t+dur))));});return api;},
    text(t,spec,html){const get=lazy(spec,t);let old=null;
      MID.push(tt=>{const e=get();if(old===null)old=e.innerHTML;const nw=tt>=t?html:old;if(e.innerHTML!==nw)e.innerHTML=nw;
        const q=P(tt,t-0.25,t+0.25);e.style.opacity=q>0&&q<1?f3(0.35+0.65*Math.abs(2*q-1)):'';});
      return api;},
    set(t,spec,fn){const get=lazy(spec,t);MID.push(tt=>fn(get(),tt>=t,tt));return api;},
    inject(key,html){page(key).el.insertAdjacentHTML('beforeend',html);return api;},
    el(spec,t=0){return find(spec,t);},
    rect(spec,t=0){return rectFor(spec,t);},
  };
  APP=api;return api;
}

/* ---------------- callouts: a bilingual glass label joined to an element in the app ---------------- */
let LINES=null;
function callout(a,b,spec,opt,find,rectFor){
  if(!LINES)LINES=el('div',null,`<svg class="m-lines" width="${W}" height="${H}"></svg>`,L.over).firstChild;
  const c=el('div','m-call',GLASS('#8E32C3','#FBF7FE')+`<div class="m-in"><div class="en">${opt.en||''}</div>${opt.ar?`<div class="ar">${opt.ar}</div>`:''}</div>`,L.over);
  const NS='http://www.w3.org/2000/svg',ln=document.createElementNS(NS,'line'),dot=document.createElementNS(NS,'circle');
  ln.setAttribute('stroke','#8E32C3');ln.setAttribute('stroke-width','2.5');ln.setAttribute('stroke-linecap','round');
  dot.setAttribute('r',FORMAT==='9x16'?'7':'6');dot.setAttribute('fill','#8E32C3');LINES.append(ln,dot);
  POST.push(t=>{
    const on=t>=a-0.01&&t<b+0.6&&WOFF.vis;c.style.display=on?'':'none';
    if(!on){ln.setAttribute('opacity',0);dot.setAttribute('opacity',0);return;}
    const r=rectFor(spec,a);
    const sx=WIN.x+VIEW.tx+r.x*VIEW.s,sy=WIN.y+WOFF.y+VIEW.ty+r.y*VIEW.s,sw=r.w*VIEW.s,sh=r.h*VIEW.s;
    const bw=c.offsetWidth,bh=c.offsetHeight,g=opt.gap??34;
    let side=opt.side||'auto';if(side==='auto')side=sy-g-bh>WIN.y+12?'top':'bottom';
    let bx,by,ax,ay;
    if(side==='top'){bx=sx+sw/2-bw/2;by=sy-g-bh;ax=sx+sw/2;ay=sy;}
    else if(side==='bottom'){bx=sx+sw/2-bw/2;by=sy+sh+g;ax=sx+sw/2;ay=sy+sh;}
    else if(side==='left'){bx=sx-g-bw;by=sy+sh/2-bh/2;ax=sx;ay=sy+sh/2;}
    else{bx=sx+sw+g;by=sy+sh/2-bh/2;ax=sx+sw;ay=sy+sh/2;}
    bx=clamp(bx,24,W-24-bw);by=clamp(by,24,H-24-bh);
    // fade out if the target leaves the window (e.g. the view moved on), so a callout never points at nothing
    const out=Math.max(WIN.x-ax,ax-(WIN.x+WIN.w),WIN.y-ay,ay-(WIN.y+WIN.h),0),inWin=clamp(1-out/40,0,1);
    const p=ez.dec(P(t,a,a+0.7)),x=ez.inC(P(t,b,b+0.5)),o=p*(1-x)*inWin,off=(1-p)*14*(side==='top'?-1:side==='bottom'?1:0);
    st(c,{opacity:f3(o),transform:`translate(${f1(bx)}px,${f1(by+off)}px)`});
    const cx=side==='left'?bx+bw:side==='right'?bx:clamp(ax,bx+20,bx+bw-20);
    const cy=side==='top'?by+bh+off:side==='bottom'?by+off:clamp(ay,by+14,by+bh-14);
    ln.setAttribute('x1',f1(cx));ln.setAttribute('y1',f1(cy));ln.setAttribute('x2',f1(ax));ln.setAttribute('y2',f1(ay));
    ln.setAttribute('opacity',f3(o*0.9));dot.setAttribute('cx',f1(ax));dot.setAttribute('cy',f1(ay));dot.setAttribute('opacity',f3(o));
  });
}

/* ---------------- end card ---------------- */
function endcard(o={}){
  const at=o.at??DUR-6;
  const e=el('div','m-end',`<div class="veil"></div><img class="mk" src="assets_logo_m.png"><div class="gl"></div>`+
    `<img class="wm" src="assets_logo_wordmark_white.png"><div class="tag">${o.tag||'Know. Watch. Decide.'}</div>`+
    `<div class="tagar">${o.tagAr||'اعرف. راقب. قرّر.'}</div><div class="url">${o.url||'marsadnasl.com'}</div>`+
    `<div class="cta"><span class="pill"><span>${o.cta||'Book your demo'}</span><span class="sep">·</span><span class="ar">${o.ctaAr||'احجز عرضك التجريبي'}</span></span></div>`,L.end);
  const q=s=>e.querySelector(s),veil=q('.veil'),mk=q('.mk'),gl=q('.gl'),wm=q('.wm'),tag=q('.tag'),tagar=q('.tagar'),url=q('.url'),cta=q('.cta');
  MID.push(t=>{const on=t>=at-0.01;e.style.display=on?'':'none';if(!on)return;
    veil.style.opacity=f3(ez.dec(P(t,at,at+0.9)));
    const pm=ez.dec(P(t,at+0.3,at+1.4)),sm=`scale(${f3(0.92+0.08*pm)})`;st(mk,{opacity:f3(pm),transform:sm});
    const gp=P(t,at+1.6,at+2.6);st(gl,{opacity:f3(gp>0&&gp<1?Math.sin(Math.PI*gp)*pm:0),transform:sm,backgroundPosition:`${f1(110-120*ez.ioC(gp))}% 0`});
    const up=(n,a,dy,k=1)=>{const p=ez.dec(P(t,at+a,at+a+1.0));st(n,{opacity:f3(p*k),transform:`translateY(${f2((1-p)*dy)}px)`});};
    up(wm,1.0,18,0.92);up(tag,1.7,20);up(tagar,2.0,16);up(url,2.5,14);
    const pc=ez.dec(P(t,at+3.0,at+3.9));st(cta,{opacity:f3(pc),transform:`scale(${f3(0.96+0.04*pc)})`});});
  return e;
}

/* ---------------- master ---------------- */
function fade(a,b){MID.push(t=>{fadeEl.style.opacity=f3(ez.inC(P(t,a,b)));});}
function start(){
  window.DURATION=DUR;window.STAGE_W=W;window.STAGE_H=H;window.FORMAT=FORMAT;
  window.SEEK=function(t){t=clamp(t,0,DUR);drawBG(t);
    for(const f of PRE)f(t);for(const f of MID)f(t);for(const f of POST)f(t);
    cam.style.transform=`scale(${f3(1+DRIFT*t/DUR)})`;drawFX(t);return true;};
  const go=()=>window.SEEK(+(location.hash.match(/t=([\d.]+)/)||[])[1]||0);   // preview: open the page with #t=12.5
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else go();
}

return {FORMAT,W,H,DUR,B,MB,S8:MB/2,S16:MB/4,S32:MB/8,ez,P,lerp,clamp,st,el,pick,GLASS,arNum,ic,
  title,caption,steps,app,endcard,definePage,fade,start,
  track:f=>{MID.push(f);},at:(t0,fn)=>{MID.push(t=>fn(t>=t0,t));},
  tween:(t0,dur,fn,ease='dec')=>{MID.push(t=>fn(ez[ease](P(t,t0,t0+dur)),t));}};
})();
