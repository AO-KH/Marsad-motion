/* Marsad Monitor Film — «مرصد يراقب. وأنت تقرّر.»   (the shot list and how to build: films/monitor/README.md)
   13 s at 120 BPM: one beat is 0.5 s and every cut lands on a beat. v2 (2026-10-11, "apply this to all other videos"):
   every screen is the real app, the client's bilingual front end in dark mode (its Arabic interface, the MARSAD × Fusion
   look), captured with sample data by tools/app_shot.js from app/capture.js: films/monitor/pages/ holds the PNGs (5x)
   and shots.json their boxes in CSS px. The Coffee film's story, cut to 13 s, on a black stage: the coffee's stock falls
   below its reorder level, the monitoring rule's alert comes into the bell, the decision is approved with a reason and
   sealed in its Decision Passport. Music and on-screen lines in English and Arabic, no voice; sound effects on the
   transitions only, no shaking or overshoot (the client's rules of 2026-09-30, after v1). make.py writes one page per
   cut and sets
     window.CUT   = {fmt:'9x16'|'16x9'|'1x1', end:'organic'|'paid', kind:'hero'|'bumper'}
     window.DATA  = data.json: the stock's fall, the captions, the end's lines
     window.SHOTS = pages/shots.json: each crop's box on its page (CSS px)
   window.SEEK(t) draws the frame at t seconds; DURATION is the length and STAGE_W/H the frame (read by render_mb.js).
   Only the 9:16 frame is laid out; the other formats are listed in make.py for later. */
(function(){
'use strict';
const CUT=Object.assign({fmt:'9x16',end:'organic',kind:'hero'},window.CUT||{}),D=window.DATA,BX=window.SHOTS.boxes;
const FMT=CUT.fmt,PAID=CUT.end==='paid';
const [W,H]={'9x16':[1080,1920],'16x9':[1920,1080],'1x1':[1080,1080]}[FMT];
window.STAGE_W=W;window.STAGE_H=H;
document.body.classList.add('f'+FMT);

/* ---------- time: the hero is 13 s; the 6 s bumper plays shots 2–4, then 9 ---------- */
const HERO=13,DUR=CUT.kind==='bumper'?6:HERO;
const MAP=CUT.kind==='bumper'?[[0,1.5],[3.5,11]]:[[0,0]];   // [time in this cut, the hero time it shows]
const heroT=t=>{let m=MAP[0];for(const x of MAP)if(t>=x[0]-1e-6)m=x;return m[1]+t-m[0];};
window.DURATION=DUR;
window.CUTS=CUT.kind==='bumper'?[1.5,2,3.5]:[1.5,3,3.5,5,7,8.5,10,11];   // shot changes (motion blur stays inside a shot)

/* ---------- helpers ---------- */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,p)=>a+(b-a)*p;
const P=(t,a,b)=>b<=a?(t>=a?1:0):clamp((t-a)/(b-a),0,1);
function bez(x1,y1,x2,y2){return x=>{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1,u=x;
  for(let i=0;i<32;i++){u=(lo+hi)/2;const cx=3*u*(1-u)*(1-u)*x1+3*u*u*(1-u)*x2+u*u*u;if(cx<x)lo=u;else hi=u;}
  return 3*u*(1-u)*(1-u)*y1+3*u*u*(1-u)*y2+u*u*u;};}
const ez={cam:bez(0.45,0,0.55,1),                           // camera: ease in-out
  dec:bez(0,0,0.2,1),                                       // entrances: decelerating, no overshoot
  inQ:p=>p*p,inC:p=>p*p*p,outQ:p=>1-(1-p)*(1-p)};
const dec=(t,a,b)=>ez.dec(P(t,a,b)),f2=x=>(+x).toFixed(2),f3=x=>(+x).toFixed(3);
function h(tag,cls,html,parent,css){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;
  if(css)e.style.cssText=css;parent.appendChild(e);return e;}
function vis(e,o,blur,tr){e.style.opacity=f3(o);e.style.filter=blur>0.05?`blur(${f2(blur)}px)`:'none';if(tr!=null)e.style.transform=tr;}
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
/* a shot's camera: page point (x, y) (CSS px of the captured page) at the frame's centre, s screen px per CSS px */
function camera(w){const c={x:0,y:0,s:1,set(x,y,s){c.x=x;c.y=y;c.s=s;
    w.style.transform=`translate(${W/2}px,${H/2}px) scale(${f3(s)}) translate(${f2(-x)}px,${f2(-y)}px)`;},
  scr:(x,y)=>[W/2+(x-c.x)*c.s,H/2+(y-c.y)*c.s]};return c;}
/* depth of field: a backdrop blur over the shot, shaped by a mask (opaque = out of focus) */
function dof(parent,blur){const d=h('div','lens',null,parent,`-webkit-backdrop-filter:blur(${blur}px);backdrop-filter:blur(${blur}px);`);
  return (mask,o)=>{d.style.webkitMaskImage=d.style.maskImage=mask;d.style.opacity=f3(o??1);};}
const radial=(cx,cy,rx,ry,a=0.42)=>`radial-gradient(ellipse ${rx}px ${ry}px at ${cx}px ${cy}px,transparent 0%,transparent ${a*100}%,#000 100%)`;
const bands=(a,b,c,d)=>`linear-gradient(180deg,#000 0%,#000 ${a}%,transparent ${b}%,transparent ${c}%,#000 ${d}%,#000 100%)`;

/* ---------- the app's screens: a crop at its own box on its page (CSS px); a shot's world is that page's CSS px ---------- */
const IMG='films/monitor/pages/',IMGS=[];
const box=(state,name)=>BX[state][name];
function pic(parent,file,b,css){const e=h('img','abs',null,parent,`left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;${css||''}`);
  e.src=IMG+file+'.png';e.draggable=false;IMGS.push(e);return e;}
const at=(b,x,y)=>({x,y,w:b.w,h:b.h});                    // the same crop placed elsewhere (in a parent's own frame)
/* the pointer, in screen px (the same size whatever the camera's zoom) */
const ARROW='<svg width="54" height="78" viewBox="0 0 64 92"><path d="M5 4 L5 72 L21 57 L33 85 L46 79 L34 52 L57 52 Z" fill="#fff" stroke="#15101f" stroke-width="3.5" stroke-linejoin="round"/></svg>';
const pointer=parent=>h('div','cursor abs',ARROW,parent);
function point(cur,[x,y],o,k){cur.style.transform=`translate(${f2(x-4)}px,${f2(y-4)}px) scale(${f3(k??1)})`;cur.style.opacity=f3(o);}
/* a button giving under the click: a short dip, no overshoot (as the walkthrough kit's press) */
const press=(t,t0)=>{const q=P(t,t0-0.06,t0+0.22);return q>0&&q<1?1-0.05*Math.sin(Math.PI*q):1;};

const stage=document.getElementById('stage');
h('div',null,null,stage).id='light';
const SHOTS=[];
function shot(id,t0,t1,build){const el=h('div','shot',null,stage);el.id=id;const s={id,t0,t1,el};s.draw=build(s);SHOTS.push(s);return s;}

/* ======== 1 · 0–1.5 s  fly-over: the coffee's own page, its properties written in, row by row, right to left ======== */
const PR=box('record','props'),ST=box('record','stock');
const ROWY=[-80,-40,0,40,80].map(d=>ST.y+10+d);             // the rows' middles: name, SKU, stock, reorder level, unit price
shot('s1',0,1.5,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  const c=h('div','abs',null,w,`left:${-PR.w/2}px;top:${-PR.h/2}px;width:${PR.w}px;height:${PR.h}px;transform-origin:50% 50%;`);
  pic(c,'recordbase-props',at(PR,0,0));                     // the card, its rows not written yet
  const rows=ROWY.map(y=>{const r=h('div','abs',null,c,`left:0;top:${y-PR.y-19}px;width:${PR.w}px;height:38px;overflow:hidden;`);
    pic(r,'record-props',at(PR,0,-(y-PR.y-19)));return r;});
  const lens=dof(s.el,13);
  return t=>{
    const p=ez.cam(P(t,0,1.5));
    const xc=lerp(1050,1000,p)-PR.x,yc=lerp(352,470,p)-PR.y;   // from the card's title down to the stock
    c.style.transform=`perspective(1500px) rotateX(${f2(lerp(50,40,p))}deg) rotateZ(${f2(lerp(-11,-6,p))}deg) translate(${f2(PR.w/2-xc)}px,${f2(PR.h/2-yc)}px)`;
    C.set(0,lerp(-30,-50,p),lerp(2.2,2.75,p));
    rows.forEach((r,i)=>{const q=dec(t,0.12+0.11*i,0.62+0.11*i);   // each row written in from the right, as Arabic reads
      r.style.clipPath=q<1?`inset(0 0 0 ${f2(lerp(PR.w,700,q))}px)`:'none';r.style.opacity=f3(Math.min(1,q*3));});
    lens(bands(14,36,62,84));
  };
});

/* ======== 2 · 1.5–3.0 s  close on the stock: it falls as the orders come in (each value a captured state of the page),
                            below its reorder level on the drop (2.5 s): the figure turns amber
            3 · 3.0–3.5 s  closer on the amber, overexposing to white; the flash cut ======== */
const STEPS=D.stock.steps,VB={x:926,y:459,w:27,h:20},LB={x:926,y:499,w:27,h:20};   // the stock's figure; the reorder level's
shot('s2',1.5,3.5,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  pic(w,'record-props',PR);
  const vals=STEPS.map(([,v],i)=>pic(w,i?`s${v}-stock`:'record-stock',ST,'display:none;'));
  const tint=h('div','tint abs',null,w,`left:${VB.x}px;top:${VB.y}px;width:${VB.w}px;height:${VB.h}px;`);   // amber on the bright figure only
  const tint2=h('div','tint abs',null,w,`left:${LB.x}px;top:${LB.y}px;width:${LB.w}px;height:${LB.h}px;`);
  const ring=h('div','ring abs',null,w,`left:${VB.x-6}px;top:${VB.y-4}px;width:${VB.w+12}px;height:${VB.h+8}px;`);
  const lens=dof(s.el,14);
  return t=>{
    const tf=Math.round(t*30)/30;let k=0;STEPS.forEach(([ts],i)=>{if(tf>=ts-1e-3)k=i;});   // once per frame: no ghosting under the blur
    vals.forEach((e,i)=>{const on=i===k;if((e.style.display!=='none')!==on)e.style.display=on?'':'none';});
    const hit=t>=2.5,a=hit?1-P(t,2.5,2.95):0;
    tint.style.opacity=hit?1:0;tint2.style.opacity=hit?f3(0.55+0.45*a):0;
    ring.style.opacity=hit?1:0;
    ring.style.boxShadow=`inset 0 0 0 0.45px rgba(255,217,145,${f3(0.5+0.5*a)}),0 0 ${f2(6+10*a)}px rgba(255,217,145,${f3(0.3+0.4*a)})`;
    if(t<3.0){                                              // a slow push; toward the figure once it is below
      const p=ez.cam(P(t,1.5,3.0)),q=ez.cam(P(t,2.4,3.0));
      C.set(lerp(lerp(1030,1022,p),VB.x+VB.w/2+40,q),lerp(489,VB.y+VB.h/2+10,q),lerp(3.9,4.4,p)+0.7*q);w.style.filter='none';
      lens(bands(8,30,72,92),0.9);
    }else{                                                  // 3: closer on the amber, overexposing
      const q=ez.inQ(P(t,3.0,3.5));C.set(VB.x+VB.w/2+4,VB.y+VB.h/2+2,lerp(6.2,8.0,q));
      w.style.filter=`brightness(${f2(1+2.6*q)}) saturate(${f2(1-0.5*q)})`;
      lens(bands(10,32,68,90),1-q);
    }
  };
});

/* ======== 4 · 3.5–5.0 s  the header's bell lights; the alert the rule raised comes out of it; a light runs once around it ======== */
const HB=box('bar','header'),BL=box('bar','bell'),PO=box('bell','pop');
const BCX=BL.x+BL.w/2,BCY=BL.y+BL.h/2;
shot('s4',3.5,5.0,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  pic(w,'bar-header',HB);
  const glow=h('div','bglow abs',null,w,`left:${BCX-34}px;top:${BCY-34}px;width:68px;height:68px;`);
  const pop=h('div','abs',null,w,`left:${PO.x}px;top:${PO.y}px;width:${PO.w}px;height:${PO.h}px;transform-origin:${BCX-PO.x}px ${BCY-PO.y}px;`);
  pic(pop,'bell-pop',at(PO,0,0));
  const pw=PO.w,ph=PO.h,path=`M${pw},0 H0 V${ph} H${pw} Z`;   // square, as the panel: from its top right, the way Arabic reads
  const tr=h('div','abs',`<svg width="${pw}" height="${ph}" viewBox="0 0 ${pw} ${ph}"><defs><filter id="tglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>
    <path d="${path}" pathLength="1000" fill="none" stroke="#c86dd7" stroke-width="6" stroke-linecap="square" filter="url(#tglow)"/>
    <path d="${path}" pathLength="1000" fill="none" stroke="#ecc6f4" stroke-width="2.4" stroke-linecap="square"/>
    <path d="${path}" pathLength="1000" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="square"/></svg>`,w,`left:${PO.x}px;top:${PO.y}px;`);
  const trails=[...tr.querySelectorAll('path')],lag=[0.11,0.075,0.04];   // glow, halo, core: the core's tail is shortest
  const blur=dof(s.el,12);
  const GX=PO.x+PO.w/2,GY=(HB.y+PO.y+PO.h)/2;                // the middle of the header's corner and the alert
  return t=>{
    glow.style.opacity=f3(dec(t,3.55,4.0)*(1-0.55*P(t,4.4,5.0)));
    const q=dec(t,3.85,4.45);                               // the alert comes out of the bell
    vis(pop,P(t,3.85,3.98),(1-q)*10,`scale(${f3(lerp(0.08,1,q))})`);
    const head=1000*ez.cam(P(t,4.35,4.9));                  // the light: once around, from the top right
    trails.forEach((e,i)=>{const tail=1000*ez.cam(P(t,4.35+lag[i],4.9+lag[i])),L=Math.max(0,head-tail);
      e.style.strokeDasharray=`${f2(L)} 1100`;e.style.strokeDashoffset=f2(-tail);});
    tr.style.opacity=t>=4.35&&t<5.02?1:0;
    const out=ez.cam(P(t,3.75,4.5)),push=P(t,4.5,5.0);      // close on the bell, then out to the alert
    C.set(lerp(BCX+8,GX,out),lerp(BCY+4,GY,out),lerp(lerp(4.6,4.85,P(t,3.5,3.9)),lerp(2.5,2.58,push),out));
    blur(radial(W/2,H/2,W*0.5,H*0.24,0.3),1-P(t,3.8,4.3));   // shallow focus while close on the bell
  };
});

/* ======== 5 · 5.0–7.0 s  the decision on its page: «مراقبة» (a monitoring rule raised it), then «موافقة»; the app's
                            confirm dialog opens, centred on the screen as the app means it ======== */
const CD=box('decisions','card'),SRC=box('decisions','source'),AP=box('decisions','approve'),DLG=box('confirm','dialog');
const DS=2.25;                                              // the dialog on the screen: 448 CSS px -> 1008 px
shot('s5',5.0,7.0,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  const card=h('div','abs',null,w,`left:${CD.x}px;top:${CD.y}px;width:${CD.w}px;height:${CD.h}px;`);
  pic(card,'decisions-card',at(CD,0,0));
  const sring=h('div','vring abs',null,w,`left:${SRC.x-3}px;top:${SRC.y-3}px;width:${SRC.w+6}px;height:${SRC.h+6}px;`);
  const ap=pic(w,'decisions-approve',AP,'transform-origin:50% 50%;');
  const veil=h('div','abs',null,s.el,'left:0;top:0;width:100%;height:100%;background:#000;opacity:0;');
  const dlg=h('img','abs',null,s.el,`left:${f2(W/2-DLG.w*DS/2)}px;top:${f2(H/2-DLG.h*DS/2)}px;width:${f2(DLG.w*DS)}px;height:${f2(DLG.h*DS)}px;opacity:0;`);
  dlg.src=IMG+'confirm-dialog.png';IMGS.push(dlg);
  const cur=pointer(s.el);
  const blur=dof(s.el,12);
  const AX=AP.x+AP.w*0.45,AY=AP.y+AP.h*0.62;                 // where the hand presses «موافقة»
  return t=>{
    const u=dec(t,5.0,5.6);                                 // the card comes up, unrolling from its top
    card.style.clipPath=u<1?`inset(0 0 ${f2((1-u)*100)}% 0)`:'none';card.style.transform=`translateY(${f2((1-u)*14)}px)`;
    const v=dec(t,5.45,6.0)*(1-P(t,6.3,6.6));sring.style.opacity=f3(v);
    ap.style.transform=`scale(${f3(press(t,6.5))})`;ap.style.opacity=t>=5.3?1:0;
    const g=ez.cam(P(t,5.65,6.48));                         // the title, then along the card to its buttons, backing off
    C.set(lerp(902,AP.x+AP.w/2+150,g),lerp(538,AP.y+AP.h/2+60,g),lerp(lerp(2.08,2.13,P(t,5.0,5.65)),2.55,g)-0.95*Math.sin(Math.PI*g));
    const m=dec(t,6.0,6.42),[px,py]=C.scr(AX,AY);           // the hand: in from the lower right, onto «موافقة»
    point(cur,[lerp(px+260,px,m),lerp(py+330,py,m)],Math.min(P(t,6.0,6.12),1-P(t,6.72,6.82)),press(t,6.5)*0.98+0.02);
    const o=dec(t,6.6,6.95);veil.style.opacity=f3(0.5*o);    // the app's veil (black, 50%) and its dialog
    vis(dlg,o,0,`scale(${f3(0.96+0.04*o)})`);
    blur(radial(W/2,H/2,W*0.55,H*0.26,0.35),0.85*(1-o));
  };
});

/* ======== 6 · 7.0–8.5 s  «تأكيد الموافقة», a reason given; the app's «تم بنجاح» ======== */
const OK=box('confirm','ok'),DN=box('done','dialog'),HD=box('done','head');
shot('s6',7.0,8.5,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  const cf=h('div','abs',null,w,`left:${DLG.x}px;top:${DLG.y}px;width:${DLG.w}px;height:${DLG.h}px;`);
  pic(cf,'confirm-dialog',at(DLG,0,0));
  const ok=pic(cf,'confirm-ok',at(OK,OK.x-DLG.x,OK.y-DLG.y),'transform-origin:50% 50%;');
  const dn=pic(w,'done-dialog',DN,'opacity:0;');
  const gl=h('div','gglow abs',null,w,`left:${HD.x-14}px;top:${HD.y-26}px;width:${HD.w+120}px;height:${HD.h+52}px;`);
  const cur=pointer(s.el);
  const blur=dof(s.el,12);
  const KX=OK.x+OK.w*0.5,KY=OK.y+OK.h*0.62;
  return t=>{
    ok.style.transform=`scale(${f3(press(t,7.5))})`;ok.style.filter=`brightness(${f2(1+0.18*Math.sin(Math.PI*P(t,7.44,7.72)))})`;
    const x=dec(t,7.62,7.92),cut=x*(DLG.h-DN.h)/2;           // the dialog closes in onto the app's message
    cf.style.clipPath=x>0?`inset(${f2(cut)}px 0 ${f2(cut)}px 0)`:'none';cf.style.opacity=f3(1-x);
    dn.style.opacity=f3(x);
    gl.style.opacity=f3(dec(t,7.95,8.4));                   // its green check, lit on the beat (8.0)
    const g=ez.cam(P(t,7.56,8.1));
    C.set(lerp(lerp(640,632,P(t,7.0,7.56)),720,g),lerp(lerp(496,500,P(t,7.0,7.56)),DN.y+DN.h/2,g),lerp(lerp(2.95,3.05,P(t,7.0,7.56)),lerp(2.3,2.36,P(t,8.1,8.5)),g));
    const m=dec(t,7.05,7.42),[px,py]=C.scr(KX,KY);
    point(cur,[lerp(px+240,px,m),lerp(py+300,py,m)],Math.min(P(t,7.05,7.15),1-P(t,7.62,7.72)),press(t,7.5)*0.98+0.02);
    blur(radial(W/2,H/2,W*0.56,H*0.24,0.35),0.9*(1-g));
  };
});

/* ======== 7 · 8.5–10.0 s  the Decision Passport: the approval goes into its chain, then the green seal ======== */
const PM=box('passport','modal'),AE=box('passport','approved'),SLOT=box('passbase','slot'),SL=box('passport','seal');
shot('s7',8.5,10.0,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  const pp=h('div','paper abs',null,w,`left:${PM.x}px;top:${PM.y}px;width:${PM.w}px;height:${PM.h}px;transform-origin:50% 50%;`);
  pic(pp,'passport-modal',at(PM,0,0));
  pic(pp,'passbase-slot',at(SLOT,SLOT.x-PM.x,SLOT.y-PM.y));   // the paper where the approval's entry goes, without it
  const ae=pic(pp,'passport-approved',at(AE,AE.x-PM.x,AE.y-PM.y));
  const sg=h('div','sglow abs',null,pp,`left:${SL.x-PM.x}px;top:${SL.y-PM.y}px;width:${SL.w}px;height:${SL.h}px;`);
  return t=>{
    const q=dec(t,8.5,9.0),settle=ez.cam(P(t,8.5,10.0));   // slides in and settles, like paper
    pp.style.transform=`perspective(2400px) translateY(${f2(lerp(900,0,q))}px) rotateX(${f2(lerp(10,1.5,settle))}deg) rotate(${f2(lerp(3,0,q))}deg)`;
    const e=dec(t,8.85,9.3);vis(ae,P(t,8.85,8.97),(1-e)*3,`translateY(${f2((1-e)*40)}px)`);   // «تمت الموافقة» comes into the chain
    sg.style.opacity=f3(dec(t,9.45,9.9));                   // the seal: «السلسلة سليمة — لا يوجد عبث»
    const up=ez.cam(P(t,9.15,9.95));                        // on the chain, then up to the seal; the Arabic side in view
    C.set(800,lerp(lerp(950,962,P(t,8.5,9.15)),410,up),lerp(1.95,2.0,settle)-0.42*Math.sin(Math.PI*up));   // backs off as it glides
  };
});

/* ======== 8 · 10.0–11.0 s  back to the rule that raised it: «قواعد المراقبة», the coffee's rule first, blur on the edges
            9 · 11.0–13.0 s  the rule blurs into the M; the end line; marsadnasl.com; "Book your demo"; a 1 s hold ======== */
const TB=box('rules','table'),RW=box('rules','row'),NM=box('rules','name');
const S8E={x:TB.x+TB.w-330,y:RW.y+RW.h/2+70,s:1.5};        // the camera at the end of shot 8 (the rule then sits there)
shot('s8',10.0,11.0,s=>{
  const w=h('div','world',null,s.el),C=camera(w);
  pic(w,'rules-table',TB);
  const rim=h('div','rim abs',null,w,`left:${RW.x}px;top:${RW.y}px;width:${RW.w}px;height:${RW.h}px;`);
  const blur=dof(s.el,16);
  return t=>{
    const p=ez.cam(P(t,10.0,11.0));
    C.set(lerp(NM.x+NM.w/2-30,S8E.x,p),lerp(NM.y+NM.h/2+24,S8E.y,p),Math.exp(lerp(Math.log(3.4),Math.log(S8E.s),p)));
    rim.style.opacity=f3(dec(t,10.3,10.85));
    blur(radial(W/2,H/2,W*0.56,H*0.2,0.35),1);
  };
});
const END={my:660,mw:250,ey:880,ay:968,cy:1130,cw:600,ch:112,by:1268,fy:1440};   // the end, in screen px (9:16)
shot('s9',11.0,Infinity,s=>{
  const w=h('div','world',null,s.el);
  const rx=W/2+(RW.x-S8E.x)*S8E.s,ry=H/2+(RW.y-S8E.y)*S8E.s;   // the rule where shot 8 left it
  const rr=h('div','abs',null,w,`left:${f2(rx)}px;top:${f2(ry)}px;width:${f2(RW.w*S8E.s)}px;height:${f2(RW.h*S8E.s)}px;transform-origin:50% 50%;`);
  pic(rr,'rules-row',at(RW,0,0),`width:100%;height:100%;`);
  h('div','rim abs',null,rr,'left:0;top:0;width:100%;height:100%;');
  const glow=h('div','mglow abs',null,w,`left:${W/2-470}px;top:${END.my-470}px;width:940px;height:940px;`);
  const mh=END.mw*1637/2145,m=h('img','abs',null,w,`left:${W/2-END.mw/2}px;top:${f2(END.my-mh/2)}px;width:${END.mw}px;`);m.src='assets_logo_m.png';IMGS.push(m);
  const FW=`left:0;width:${W}px;`;
  const en=h('div','end-en abs',D.end.en,w,`${FW}top:${END.ey}px;`),ar=h('div','end-ar abs',D.end.ar,w,`${FW}top:${END.ay}px;`);
  const cap=h('div','jcap abs',`<span>${D.end.url}</span>`,w,`left:${W/2-END.cw/2}px;top:${END.cy-END.ch/2}px;width:${END.cw}px;height:${END.ch}px;`);
  const book=PAID?h('div','cta abs',`<span><b>${D.end.cta_en}</b><i>·</i><b class="ar">${D.end.cta_ar}</b></span>`,w,`${FW}top:${END.by-50}px;`)
    :h('div','jbook abs',`<span>${D.end.cta_en}</span><span class="sep">·</span><span class="ar">${D.end.cta_ar}</span>`,w,`${FW}top:${END.by}px;`);
  const ft=h('div','jft abs','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',w,`${FW}top:${END.fy}px;`);
  const blur=dof(s.el,16);
  const RCY=ry+RW.h*S8E.s/2;
  return t=>{
    const pm=ez.cam(P(t,11.0,11.42));                       // the rule shrinks into the M's place as it blurs out
    vis(rr,1-ez.inQ(P(t,11.08,11.42)),30*ez.outQ(P(t,11.0,11.36)),`translateY(${f2((END.my-RCY)*pm)}px) scale(${f3(lerp(1,0.3,pm))})`);
    const mq=dec(t,11.1,11.75);vis(m,ez.outQ(P(t,11.1,11.4)),26*(1-mq),`scale(${f3(lerp(1.3,1,mq))})`);
    glow.style.opacity=f3(0.8*ez.outQ(P(t,11.12,11.8)));
    const lq=dec(t,11.55,12.15);vis(en,lq,(1-lq)*10,`translateY(${f2((1-lq)*22)}px)`);
    const aq=dec(t,11.65,12.25);vis(ar,aq,(1-aq)*8,`translateY(${f2((1-aq)*18)}px)`);
    const cq=dec(t,11.8,12.4);vis(cap,cq,(1-cq)*8,`scale(${f3(0.95+0.05*cq)})`);
    const bq=dec(t,11.95,12.55);vis(book,bq,(1-bq)*6,`translateY(${f2((1-bq)*14)}px)`);
    ft.style.opacity=f3(0.55*dec(t,12.1,12.7));
    const k=lerp(1,1.03,ez.outQ(P(t,11.0,13.0)));          // a slow push on the end
    w.style.transform=`translate(${W/2}px,${H/2}px) scale(${f3(k)}) translate(${-W/2}px,${-H/2}px)`;
    blur(radial(W/2,H/2,W*0.56,H*0.2,0.35),1-P(t,11.0,11.35));
  };
});

/* ---------- over everything: the bloom and flash (3.0–3.66 s), grain and vignette, the label and the captions ---------- */
const bloom=h('div',null,null,stage);bloom.id='bloom';
const flash=h('div',null,null,stage);flash.id='flash';
const fx=h('canvas',null,null,stage);fx.id='fx';fx.width=W;fx.height=H;const g=fx.getContext('2d');
const note=h('div','note',`<span class="en">${D.note.en}</span><span class="sep">·</span><span class="ar">${D.note.ar}</span>`,stage);
const scrim=h('div','scrim',null,stage);                      // under the captions: the passport's paper is light
const CAPS=D.captions.map(([t0,t1,en,ar])=>({t0,t1,e:h('div','cap',`<div class="en">${en}</div><div class="ar">${ar}</div>`,stage)}));
function overlays(T){
  bloom.style.opacity=T>=3.0&&T<3.5?f3(ez.inC(P(T,3.0,3.46))):0;
  flash.style.opacity=T<3.5?f3(ez.inQ(P(T,3.24,3.5))):f3(1-ez.outQ(P(T,3.5,3.66)));
  note.style.opacity=f3(0.92*dec(T,0.2,0.8)*(1-P(T,10.7,11.0)));   // the app is on screen until 11.0
  let so=0;
  for(const c of CAPS){const q=dec(T,c.t0,c.t0+0.45),o=Math.min(q,1-P(T,c.t1-0.18,c.t1));
    if(o<=0.001){c.e.style.opacity=0;continue;}
    so=Math.max(so,o);vis(c.e,o,(1-q)*8,`translateY(${f2((1-q)*14)}px)`);}
  scrim.style.opacity=f3(so*(T>=8.5&&T<10?1:0.6));
}
function drawFX(t){
  g.clearRect(0,0,W,H);
  const v=g.createRadialGradient(W/2,H/2,Math.min(W,H)*0.42,W/2,H/2,Math.hypot(W,H)*0.6);
  v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,0.42)');g.fillStyle=v;g.fillRect(0,0,W,H);
  const r=mulberry(7100+Math.round(t*30));g.globalAlpha=0.03;                  // fine grain, new every frame
  for(let i=0;i<1600;i++){const l=90+r()*165|0;g.fillStyle=`rgb(${l},${l},${l})`;g.fillRect(r()*W,r()*H,1.6,1.6);}
  g.globalAlpha=1;
}
function seek(t){
  t=clamp(t,0,DUR);const T=heroT(t);
  for(const s of SHOTS){const on=T>=s.t0-1e-6&&T<s.t1-1e-6;s.el.style.display=on?'block':'none';if(on)s.draw(T);}
  overlays(T);drawFX(t);
}
const FONTS=['500 40px PlexAR','600 40px PlexAR','700 40px PlexAR','500 40px Inter','600 40px Inter','600 40px JBMono'];
Promise.all([...FONTS.map(f=>document.fonts.load(f,'مرصد يراقب. وأنت تقرّر 0123456789 Marsad')),...IMGS.map(i=>i.decode().catch(()=>{}))])
  .then(()=>{window.SEEK=seek;seek(0);});
})();
