/* Marsad Monitor Film — «مرصد يراقب. وأنت تقرّر.»   (the brief, the shot list and how to build: films/monitor/README.md)
   13 s at 120 BPM: one beat is 0.5 s and every cut lands on a beat. Real UI components, rebuilt in the product's dark
   theme, on a black stage; music and sound effects, no voice. make.py writes one page per cut and sets
     window.CUT  = {fmt:'9x16'|'16x9'|'1x1', lang:'ar'|'en', end:'organic'|'paid', kind:'hero'|'bumper'}
     window.DATA = data.json: every number and product string on screen (none is typed in this file)
   window.SEEK(t) draws the frame at t seconds; DURATION is the length and STAGE_W/H the frame (read by render_full.js). */
(function(){
'use strict';
const CUT=Object.assign({fmt:'9x16',lang:'ar',end:'organic',kind:'hero'},window.CUT||{}),D=window.DATA;
const FMT=CUT.fmt,EN=CUT.lang==='en',PAID=CUT.end==='paid';
const [W,H]={'9x16':[1080,1920],'16x9':[1920,1080],'1x1':[1080,1080]}[FMT];
window.STAGE_W=W;window.STAGE_H=H;
document.body.classList.add('f'+FMT);
const pick=o=>(FMT in o?o[FMT]:o['9x16']);                 // per-format values; the 9:16 master is the reference

/* ---------- time: the hero is 13 s; the 6 s bumper plays shots 2–4, then 9 ---------- */
const HERO=13,DUR=CUT.kind==='bumper'?6:HERO;
const MAP=CUT.kind==='bumper'?[[0,1.5],[3.5,11]]:[[0,0]];   // [time in this cut, the hero time it shows]
const heroT=t=>{let m=MAP[0];for(const x of MAP)if(t>=x[0]-1e-6)m=x;return m[1]+t-m[0];};
window.DURATION=DUR;
window.CUTS=CUT.kind==='bumper'?[1.5,2,3.5]:[1.5,3,3.5,5,7,8.5,10,11];   // shot changes (render.js keeps motion blur inside a shot)

/* ---------- helpers ---------- */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,p)=>a+(b-a)*p;
const P=(t,a,b)=>b<=a?(t>=a?1:0):clamp((t-a)/(b-a),0,1);
function bez(x1,y1,x2,y2){return x=>{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1,u=x;
  for(let i=0;i<32;i++){u=(lo+hi)/2;const cx=3*u*(1-u)*(1-u)*x1+3*u*u*(1-u)*x2+u*u*u;if(cx<x)lo=u;else hi=u;}
  return 3*u*(1-u)*(1-u)*y1+3*u*u*(1-u)*y2+u*u*u;};}
const ez={lin:p=>p,
  cam:bez(0.45,0,0.55,1),                                   // camera: ease in-out
  ui:bez(0.4,0,0.2,1),                                      // UI: fast out, slow in (about 250 ms)
  dec:bez(0,0,0.2,1),inQ:p=>p*p,inC:p=>p*p*p,outQ:p=>1-(1-p)*(1-p),outC:p=>1-Math.pow(1-p,3),
  back:p=>{const c=1.25,u=p-1;return 1+(c+1)*u*u*u+c*u*u;}}; // the small overshoot: the button press and the seal snap only
const f2=x=>(+x).toFixed(2);
function h(tag,cls,html,parent,css){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;
  if(css)e.style.cssText=css;parent.appendChild(e);return e;}
const num=s=>String(s).replace(/[0-9][0-9.,:\-]*/g,m=>`<span class="ltr">${m}</span>`);   // Western digits, in LTR isolates
const cam=(w,x,y,s,r)=>{w.style.transform=`translate(${W/2}px,${H/2}px) scale(${f2(s*1e3/1e3)}) rotate(${f2(r||0)}deg) translate(${f2(-x)}px,${f2(-y)}px)`;};
function vis(e,o,blur,tr){e.style.opacity=f2(o);e.style.filter=blur>0.05?`blur(${f2(blur)}px)`:'none';if(tr!=null)e.style.transform=tr;}
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
/* depth of field: a backdrop blur over the shot, shaped by a mask (opaque = out of focus) */
function dof(parent,blur){const d=h('div','lens',null,parent,`-webkit-backdrop-filter:blur(${blur}px);backdrop-filter:blur(${blur}px);`);
  return (mask,o)=>{d.style.webkitMaskImage=d.style.maskImage=mask;d.style.opacity=f2(o??1);};}
const radial=(cx,cy,rx,ry,a=0.42)=>`radial-gradient(ellipse ${rx}px ${ry}px at ${cx}px ${cy}px,transparent 0%,transparent ${a*100}%,#000 100%)`;

const I={
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  receipt:'<path d="M5 2v20l2.3-1.5L9.7 22l2.3-1.5 2.3 1.5 2.4-1.5L19 22V2l-2.3 1.5L14.3 2 12 3.5 9.7 2 7.3 3.5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  ccheck:'<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3l2.5 2.5 5-5.3"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.6v4.7l3.1 1.9"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  trend:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>'};
const ic=(k,s,c,w)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c||'currentColor'}" stroke-width="${w||2}" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;

const stage=document.getElementById('stage');
h('div',null,null,stage).id='light';
const SHOTS=[];
function shot(id,t0,t1,build){const el=h('div','shot',null,stage);el.id=id;const s={id,t0,t1,el};s.draw=build(s);SHOTS.push(s);return s;}
const M=D.monitor,DEC=D.decision,N=D.samples.length;

/* ======== 1 · 0–1.5 s  fly-over: the monitor's chart, daily bars building right to left, tilt-shift ======== */
const C1=(()=>{const w=1500,x0=64,bw=62,gap=Math.min(104,(w-2*x0-60-bw)/Math.max(1,N-1));
  return {w,h:1200,x0,bw,gap,right:w-x0-30-bw/2,base:1040,k:1.2};})();
C1.lim=C1.base-M.limit*C1.k;
shot('s1',0,1.5,s=>{
  const w=h('div','world',null,s.el);
  const c=h('div','card abs',null,w,`left:${-C1.w/2}px;top:${-C1.h/2}px;width:${C1.w}px;height:${C1.h}px;transform-origin:50% 50%;`);
  [100,200,300].forEach(v=>h('div','grid abs',null,c,`top:${C1.base-v*C1.k}px`));
  h('div','axis abs',null,c,`top:${C1.base}px`);
  h('div','limit abs',null,c,`top:${C1.lim-2.5}px`);
  h('div','lim-label abs',`الحد ${num(M.limit)}`,c,`right:${C1.x0+14}px;top:${C1.lim-84}px`);
  h('div','ch-title abs',M.metric,c,`right:${C1.x0+14}px;top:${C1.lim-250}px`);
  const bars=D.samples.map((v,i)=>h('div','bar abs'+(i===N-1?' today':''),null,c,
    `left:${C1.right-i*C1.gap-C1.bw/2}px;width:${C1.bw}px;`));          // oldest on the right: time runs right to left
  const lens=dof(s.el,13);
  const dt=Math.min(0.075,0.95/N);
  return t=>{
    const p=ez.cam(P(t,0,1.5));
    const xc=lerp(C1.right-1.6*C1.gap,C1.right-(N-1)*C1.gap+1.0*C1.gap,p);    // the chart x under the camera: oldest → today
    const tx=C1.w/2-xc,ty=C1.h/2-(C1.lim+60);
    c.style.transform=`perspective(1500px) rotateX(${f2(lerp(54,47,p))}deg) rotateZ(${f2(lerp(-13,-8,p))}deg) translate(${f2(tx)}px,${f2(ty)}px)`;
    cam(w,0,lerp(-60,-90,p),lerp(1.5,1.72,p));
    bars.forEach((b,i)=>{const v=D.samples[i],q=ez.ui(P(t,0.04+i*dt,0.04+i*dt+0.32)),hh=v*C1.k*q;
      b.style.top=f2(C1.base-hh)+'px';b.style.height=f2(hh)+'px';b.style.opacity=q>0?1:0;});
    lens(`linear-gradient(180deg,#000 0%,#000 17%,transparent 39%,transparent 57%,#000 79%,#000 100%)`);
  };
});

/* ======== 2 · 1.5–3.0 s  macro on today's bar: it climbs past the limit, the amber hits on the beat at 2.5 s
            3 · 3.0–3.5 s  bloom: the amber part overexposes to white, then the flash cut ======== */
const C2={x:-80,bw:250,lim:150,k:3.0,gap:390};
const value=t=>t<2.5?lerp(D.samples[N-1],M.limit,ez.inQ(P(t,1.58,2.5))):lerp(M.limit,M.count,ez.outC(P(t,2.5,3.0)));
shot('s2',1.5,3.5,s=>{
  const w=h('div','world',null,s.el);
  const base=C2.lim+M.limit*C2.k,top=v=>base-v*C2.k;
  for(let j=3;j>=1;j--){const v=D.samples[N-1-j];if(v==null)continue;           // earlier days, to the right, out of focus
    h('div','bar abs',null,w,`left:${C2.x+j*C2.gap-C2.bw/2}px;width:${C2.bw}px;top:${top(v)}px;height:${v*C2.k+600}px;
      border-radius:30px 30px 0 0;filter:blur(${9+j*6}px);opacity:${f2(0.85-j*0.17)};`);}
  const glow=h('div','aglow abs',null,w,`left:${C2.x-C2.bw/2-18}px;width:${C2.bw+36}px;`);
  const bar=h('div','mbar abs',null,w,`left:${C2.x-C2.bw/2}px;width:${C2.bw}px;`);
  h('div','fill abs',null,bar);const over=h('div','over abs',null,bar);
  const lim=h('div','limit abs',null,w,`left:-900px;right:auto;width:1800px;top:${C2.lim-2.5}px;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 28%,#000 72%,transparent);`);
  h('div','lim-label abs',`الحد ${num(M.limit)}`,w,`right:-350px;top:${C2.lim-84}px;`);
  const tip=h('div','tip abs',`<div class="l">${M.metric}</div><div class="v"><span class="ltr">0</span></div><div class="caret"></div>`,w,`left:${C2.x-180}px;`);
  const tv=tip.querySelector('.v span');
  const lens=dof(s.el,14);
  return t=>{
    const v=value(t),y=top(v),hit=t>=2.5,k=hit?1-P(t,2.5,2.9):0;
    bar.style.top=f2(y)+'px';bar.style.height=f2(base-y+700)+'px';
    const ov=Math.max(0,C2.lim-y);over.style.height=f2(ov)+'px';
    glow.style.top=f2(y-14)+'px';glow.style.height=f2(ov+28)+'px';glow.style.opacity=hit?f2(0.55+0.45*k):0;
    tip.style.top=f2(y-34-224)+'px';
    const tf=Math.round(t*30)/30,vf=value(tf);                     // the number changes once per frame (no ghosting under motion blur)
    tv.textContent=tf>=2.5?Math.round(vf):Math.min(M.limit-1,Math.floor(vf));
    tv.style.color=hit?'#ffd991':'#fff';
    tip.style.boxShadow=hit?`inset 0 0 0 1.5px rgba(255,217,145,${f2(0.45+0.5*k)}),0 0 ${f2(30+50*k)}px rgba(255,217,145,${f2(0.2+0.3*k)}),0 22px 60px rgba(0,0,0,0.55)`:'';
    lim.style.borderTopColor=hit?`rgba(255,217,145,${f2(0.6+0.4*k)})`:'rgba(255,255,255,0.6)';
    if(t<3.0){                                                    // slow push-in; rises with the bar once it crosses
      const p=ez.cam(P(t,1.5,3.0));
      cam(w,lerp(-20,-5,p),lerp(200,176,P(t,1.5,2.5))-300*ez.cam(P(t,2.4,3.0)),lerp(1.22,1.36,p));w.style.filter='none';
      lens(`linear-gradient(180deg,#000 0%,transparent 26%,transparent 74%,#000 100%)`,0.9);
    }else{                                                        // 3: a closer framing on the amber, overexposing
      const p=P(t,3.0,3.5),q=ez.inQ(p);cam(w,C2.x,(C2.lim+top(M.count))/2-40,lerp(2.3,2.8,q));
      w.style.filter=`brightness(${f2(1+2.6*q)}) saturate(${f2(1-0.5*q)})`;
      lens(`linear-gradient(180deg,#000 0%,transparent 30%,transparent 70%,#000 100%)`,1-q);
    }
  };
});

/* ======== 4 · 3.5–5.0 s  the header bell swings twice; the alert slides out of it; a light trace runs once around it ======== */
const HD={x:-450,y:-330,w:900,h:140},NT={x:-450,y:-150,w:900,h:244,r:32};
const brk=s=>num(s).replace(' — ',' —<br>');                        // break long alert titles after the dash
shot('s4',3.5,5.0,s=>{
  const w=h('div','world',null,s.el);
  const hd=h('div','header abs',null,w,`left:${HD.x}px;top:${HD.y}px;width:${HD.w}px;height:${HD.h}px;`);
  h('div','srch abs',`${ic('search',34,'rgba(255,255,255,0.5)',2.2)}<span>ابحث في البيانات...</span>`,hd,`right:26px;top:26px;width:620px;height:88px;`);
  const bb=h('div','bellbtn abs',null,hd,`left:24px;top:20px;width:100px;height:100px;`);
  const bell=h('div','abs',ic('bell',50,'#fff',2),bb,`left:25px;top:24px;width:50px;height:50px;transform-origin:50% 8%;`);
  const BX=HD.x+24+50,BY=HD.y+20+50;                                  // the bell's centre (world)
  const nc=h('div','card abs',null,w,`left:${NT.x}px;top:${NT.y}px;width:${NT.w}px;height:${NT.h}px;transform-origin:${BX-NT.x}px ${BY-NT.y}px;`);
  h('div','aico abs',ic('alert',52,'#ffd991',2.2),nc,`right:40px;top:${(NT.h-104)/2}px;width:104px;height:104px;`);
  h('div','nt abs',brk(D.alert),nc,`right:172px;top:48px;width:${NT.w-172-40}px;`);
  const r=NT.r,pw=NT.w,ph=NT.h,path=`M${pw-r},0 H${r} A${r},${r} 0 0 0 0,${r} V${ph-r} A${r},${r} 0 0 0 ${r},${ph} H${pw-r} A${r},${r} 0 0 0 ${pw},${ph-r} V${r} A${r},${r} 0 0 0 ${pw-r},0 Z`;
  const tr=h('div','abs',`<svg width="${pw}" height="${ph}" viewBox="0 0 ${pw} ${ph}"><defs><filter id="tglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs>
    <path d="${path}" pathLength="1000" fill="none" stroke="#c86dd7" stroke-width="16" stroke-linecap="round" filter="url(#tglow)"/>
    <path d="${path}" pathLength="1000" fill="none" stroke="#ecc6f4" stroke-width="6" stroke-linecap="round"/>
    <path d="${path}" pathLength="1000" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,w,`left:${NT.x}px;top:${NT.y}px;`);
  const trails=[...tr.querySelectorAll('path')],lag=[0.11,0.075,0.04];   // glow, halo, core: the core's tail is shortest
  const blur=dof(s.el,12);
  const GY=(HD.y+NT.y+NT.h)/2;                                          // the middle of header + alert
  return t=>{
    const tau=t-3.55,A=tau>0&&tau<0.8?15*Math.sin(2*Math.PI*2.5*tau)*Math.pow(1-tau/0.8,1.3):0;   // two swings, dying away
    bell.style.transform=`rotate(${f2(A)}deg)`;
    const q=ez.ui(P(t,3.85,4.2));                                       // the alert comes out of the bell
    vis(nc,P(t,3.85,3.96),(1-q)*16,`scale(${f2(lerp(0.07,1,q))})`);
    const head=1000*ez.cam(P(t,4.3,4.84));                               // the light trace: once around, from the top right
    trails.forEach((e,i)=>{const tail=1000*ez.cam(P(t,4.3+lag[i],4.84+lag[i])),L=Math.max(0,head-tail);
      e.style.strokeDasharray=`${f2(L)} 1100`;e.style.strokeDashoffset=f2(-tail);});
    tr.style.opacity=t>=4.3&&t<4.96?1:0;
    const out=ez.cam(P(t,3.76,4.46)),push=P(t,4.46,5.0);               // close on the bell, then out to the alert
    cam(w,lerp(BX+30,0,out),lerp(BY+6,GY,out),lerp(lerp(2.35,2.5,P(t,3.5,3.9)),lerp(1.1,1.15,push),out));
    blur(radial(W/2,H/2,W*0.5,H*0.24,0.3),1-P(t,3.8,4.3));            // shallow focus while close on the bell
  };
});

/* ======== 5 · 5.0–7.0 s  evidence records stack right to left; a bracket rolls them up into the decision card
            6 · 7.0–8.5 s  approve: the button blurs in, a press, the status chip flips to green ======== */
const GR={cols:2,cw:420,chh:104,gx:26,gy:24};
const CARD={x:-470,y:-400,w:940,h:552,bt:392,bh:116};          // the decision card (world); its top is the grid's top
shot('s5',5.0,8.5,s=>{
  const w=h('div','world',null,s.el);
  const ev=DEC.evidence,rows=Math.ceil(ev.length/GR.cols);
  const gw=GR.cols*GR.cw+(GR.cols-1)*GR.gx,gh=rows*GR.chh+(rows-1)*GR.gy,gx0=-gw/2,gy0=CARD.y;
  const grid=h('div','abs',null,w,`left:${gx0}px;top:${gy0}px;width:${gw}px;height:${gh}px;`);
  const chips=ev.map((ref,k)=>{const c=k%GR.cols,rw=Math.floor(k/GR.cols);                     // first record top right
    return h('div','ev abs',`${ic('receipt',36,'#dcaae6',2)}<span class="ltr">${ref}</span>`,grid,
      `left:${gw-(c+1)*GR.cw-c*GR.gx}px;top:${rw*(GR.chh+GR.gy)}px;width:${GR.cw}px;height:${GR.chh}px;font-size:40px;border-radius:28px;transform-origin:50% 0;`);});
  const br=h('div','abs',`<svg width="${gw}" height="34"><defs><linearGradient id="brg" x1="0" x2="1"><stop offset="0" stop-color="#5f1cb8"/><stop offset="1" stop-color="#c86dd7"/></linearGradient>
    <filter id="brglow" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="6"/></filter></defs>
    <path d="M${gw},3 V26 H0 V3" pathLength="100" fill="none" stroke="#c86dd7" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#brglow)" opacity="0.7"/>
    <path d="M${gw},3 V26 H0 V3" pathLength="100" fill="none" stroke="url(#brg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,w,`left:${gx0}px;`);
  const brp=[...br.querySelectorAll('path')];
  // the decision card
  const card=h('div','card abs',null,w,`left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;`);
  const pills=h('div','row abs',`<span class="chip purple">${ic('target',28,'#e7bdf0',2.2)}<span>${DEC.source}</span></span><span class="chip">${ic('trend',28,'#fff',2.2)}<span>${DEC.severity}</span></span>`,card,`right:44px;top:44px;`);
  const flip=h('div','flip abs',`<div class="chip amber">${ic('clock',28,'#2B1D05',2.4)}<span>${DEC.status}</span></div><div class="chip green">${ic('check',28,'#0C2517',2.8)}<span>${DEC.status_done}</span></div>`,card,`left:44px;top:44px;width:320px;height:64px;`);
  const [fa,fb]=flip.children;
  const title=h('div','dc-title abs',brk(DEC.title),card,`right:44px;top:138px;width:${CARD.w-88}px;`);
  const bw0=360,bw1=640,BT=CARD.bt,BH=CARD.bh;
  const bglow=h('div','btnglow abs',null,card,`right:60px;top:${BT+24}px;height:${BH-20}px;`);
  const btn=h('div','btn abs',`<div class="a">${ic('check',46,'#fff',2.8)}<span>${DEC.approve}</span></div><div class="b">${ic('ccheck',46,'#94e2b2',2.2)}<span>${DEC.approved_msg}</span></div>`,card,`right:44px;top:${BT}px;height:${BH}px;`);
  const [ba,bb]=btn.children;
  const rip=h('div','ripple abs',null,btn,'');
  const cur=h('div','cursor abs',`<svg width="64" height="92" viewBox="0 0 64 92"><path d="M5 4 L5 72 L21 57 L33 85 L46 79 L34 52 L57 52 Z" fill="#fff" stroke="#15101f" stroke-width="3.5" stroke-linejoin="round"/></svg>`,w,'');
  const BR=CARD.x+CARD.w-44,PX=BR-bw0*0.46,PY=CARD.y+BT+BH*0.56;            // the button's right edge; where the cursor presses
  const CY=CARD.y+CARD.h/2;
  const blur=dof(s.el,12);
  return t=>{
    // 5 — records stream in from the right, 2 frames apart; the bracket draws on the beat at 6.0 and rolls them up
    const rise=ez.ui(P(t,6.3,6.62)),by=lerp(gh+14,-12,rise);                   // the bracket's height (grid coordinates)
    chips.forEach((c,k)=>{const t0=5.1+k*2/30,q=ez.ui(P(t,t0,t0+0.25)),rw=Math.floor(k/GR.cols);
      const sq=clamp((by-rw*(GR.chh+GR.gy))/GR.chh,0,1);
      vis(c,q*(sq>0.02?1:0),(1-q)*10,`translateX(${f2((1-q)*140)}px) scaleY(${f2(Math.max(sq,0.001))})`);});
    const bq=ez.ui(P(t,6.0,6.25));
    brp.forEach(e=>{e.style.strokeDasharray='100 100';e.style.strokeDashoffset=f2(100*(1-bq));});
    br.style.top=f2(gy0+by)+'px';br.style.opacity=f2(1-P(t,6.6,6.72));
    const cq=ez.ui(P(t,6.55,6.9));                                              // the card unrolls from the bracket
    card.style.display=t>=6.55?'':'none';
    card.style.clipPath=cq<1?`inset(0 0 ${f2((1-cq)*100)}% 0 round 32px)`:'none';
    [[pills,6.66],[title,6.72],[flip,6.78]].forEach(([e,t0])=>{const q=ez.ui(P(t,t0,t0+0.25));vis(e,q,(1-q)*6,`translateY(${f2((1-q)*16)}px)`);});
    // 6 — approve: the button blurs in, a press on the beat at 7.5, then it confirms; the status flips on 8.0
    const bi=ez.ui(P(t,7.0,7.35)),press=t<7.5?1:t<7.56?lerp(1,0.96,ez.ui(P(t,7.5,7.56))):lerp(0.96,1,ez.back(P(t,7.56,7.8)));
    const sw=ez.ui(P(t,7.62,7.84)),bwNow=lerp(bw0,bw1,sw);
    btn.style.width=f2(bwNow)+'px';
    vis(btn,bi,(1-bi)*20,`scale(${f2(lerp(1.08,1,bi)*press)})`);
    ba.style.opacity=f2(1-P(t,7.6,7.7));bb.style.opacity=f2(ez.ui(P(t,7.7,7.86)));
    bglow.style.width=f2(bwNow-32)+'px';bglow.style.opacity=f2(bi*0.55*(1-sw));
    const rq=P(t,7.5,7.95),rr=lerp(10,380,ez.dec(rq));
    rip.style.cssText=`left:${f2(PX-(BR-bwNow)-rr/2)}px;top:${f2(PY-(CARD.y+BT)-rr/2)}px;width:${f2(rr)}px;height:${f2(rr)}px;opacity:${f2(rq>0&&rq<1?0.95*(1-ez.inQ(rq)):0)};`;
    const cm=ez.ui(P(t,7.05,7.45)),away=ez.ui(P(t,7.62,7.8));
    const cs=t<7.5?1:t<7.56?lerp(1,0.86,ez.ui(P(t,7.5,7.56))):lerp(0.86,1,ez.ui(P(t,7.56,7.72)));
    cur.style.left=f2(lerp(PX+430,PX,cm)+away*50-4)+'px';cur.style.top=f2(lerp(PY+340,PY,cm)+away*40-4)+'px';
    vis(cur,t<7.05?0:Math.min(P(t,7.05,7.15),1-away),0,`scale(${f2(cs)})`);
    const fq1=ez.inQ(P(t,7.88,8.0)),fq2=ez.outC(P(t,8.0,8.14));
    fa.style.transform=`rotateX(${f2(90*fq1)}deg)`;fa.style.opacity=t<8.0?1:0;
    fb.style.transform=`rotateX(${f2(-90*(1-fq2))}deg)`;fb.style.opacity=t>=8.0?1:0;
    // camera: a slow push on the records, over to the card as it forms; at 7.0 a cut to the button; out to the card for the flip
    if(t<7.0){const p=ez.cam(P(t,5.0,7.0)),m=ez.cam(P(t,6.3,6.9));
      cam(w,lerp(24,0,p),lerp(lerp(gy0+gh/2,gy0+gh/2-10,P(t,5.0,6.3)),CY,m),lerp(1.04,1.1,p),lerp(0.5,0,p));blur('none',0);}
    else{const g=ez.cam(P(t,7.56,7.96)),d=P(t,7.0,7.56);
      cam(w,lerp(lerp(PX+30,PX+14,d),0,g),lerp(lerp(PY-10,PY-24,d),CY,g),lerp(lerp(1.5,1.56,d),lerp(1.06,1.1,P(t,7.96,8.5)),g));
      blur(radial(W/2,H/2,W*0.55,H*0.26,0.35),1-g);}
  };
});

/* ======== 7 · 8.5–10.0 s  the decision passport: the approval snaps onto the chain; the seal glows ======== */
const PP={w:900,h:900};
function guilloche(w,hh){let p='';
  for(let k=0;k<30;k++){let d='';const ph=k*0.23,amp=24+9*Math.sin(k*0.7),y0=hh*0.06+k*(hh*0.88/29);
    for(let x=0;x<=w;x+=10){const y=y0+amp*Math.sin(x/w*Math.PI*4+ph)+9*Math.sin(x/w*Math.PI*13+ph*2);d+=(x?'L':'M')+x+','+y.toFixed(1);}
    p+=`<path d="${d}"/>`;}
  return `<svg class="abs" style="left:0;top:0" width="${w}" height="${hh}"><g fill="none" stroke="#a78c5c" stroke-opacity="0.2" stroke-width="1.2">${p}</g></svg>`;}
function sealSVG(S){const c=S/2,n=44;let pts='';for(let i=0;i<n*2;i++){const a=i*Math.PI/n,r=i%2?c-1:c-13;pts+=`${(c+r*Math.cos(a)).toFixed(1)},${(c+r*Math.sin(a)).toFixed(1)} `;}
  let ros='';for(let k=0;k<18;k++)ros+=`<ellipse cx="${c}" cy="${c}" rx="${(c*0.64).toFixed(1)}" ry="${(c*0.2).toFixed(1)}" transform="rotate(${k*10} ${c} ${c})"/>`;
  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><polygon points="${pts}" fill="#2f8a54"/>
    <circle cx="${c}" cy="${c}" r="${c-24}" fill="none" stroke="#cdeedb" stroke-opacity="0.75" stroke-width="2"/>
    <circle cx="${c}" cy="${c}" r="${c-32}" fill="none" stroke="#cdeedb" stroke-opacity="0.4" stroke-width="1.2"/>
    <g fill="none" stroke="#cdeedb" stroke-opacity="0.33" stroke-width="1.1">${ros}</g>
    <circle cx="${c}" cy="${c}" r="${(c*0.36).toFixed(1)}" fill="#2f8a54" stroke="#cdeedb" stroke-width="2.5"/>
    <path d="M${c-24},${c+1} l16,16 l32,-34" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
shot('s7',8.5,10.0,s=>{
  const w=h('div','world',null,s.el);
  const pp=h('div','paper abs',guilloche(PP.w,PP.h),w,`left:${-PP.w/2}px;top:${-PP.h/2}px;width:${PP.w}px;height:${PP.h}px;transform-origin:50% 50%;`);
  h('div','abs',null,pp,'inset:26px;border-radius:12px;box-shadow:inset 0 0 0 1.5px rgba(42,34,23,0.22),inset 0 0 0 6px rgba(243,234,215,1),inset 0 0 0 7.5px rgba(42,34,23,0.14);');
  const logo=h('img','abs',null,pp,'right:70px;top:78px;width:96px;');logo.src='assets_logo_m.png';
  h('div','pp-title abs',D.passport.title,pp,'right:190px;top:56px;');
  h('div','abs',null,pp,'left:70px;right:70px;top:200px;height:2px;background:rgba(42,34,23,0.16);');
  h('div','pp-sub abs',num(DEC.title),pp,`right:70px;top:228px;width:${PP.w-140}px;`);
  const L1=410,L2=580,NS=54,NX=PP.w-70-NS;                             // the chain: two links, nodes on the right
  const node=(y,parent)=>h('div','pp-node abs',ic('check',30,'#fff',3),parent,`left:${NX}px;top:${y}px;width:${NS}px;height:${NS}px;`);
  node(L1,pp);h('div','pp-link abs',D.passport.raised,pp,`right:${70+NS+30}px;top:${L1-6}px;`);
  const line=h('div','pp-line abs',null,pp,`left:${NX+NS/2-2}px;top:${L1+NS+10}px;width:4px;height:0;`);
  const link2=h('div','abs',null,pp,`left:0;top:0;width:${PP.w}px;height:${PP.h}px;`);
  const n2=node(L2,link2);
  h('div','pp-link abs',D.passport.approved,link2,`right:${70+NS+30}px;top:${L2-6}px;`);
  const seal=h('div','abs',sealSVG(260),pp,`left:84px;top:370px;width:260px;height:260px;`);
  h('div','abs',null,pp,'left:70px;right:70px;top:716px;height:2px;background:rgba(42,34,23,0.16);');
  const ok=h('div','chain-ok abs',`${ic('shield',46,'#2f8a54',2.2)}<span>${D.passport.chain_ok}</span>`,pp,'right:70px;top:760px;');
  return t=>{
    const q=ez.dec(P(t,8.5,8.92)),settle=ez.cam(P(t,8.5,10.0));      // slides in and settles, like paper
    pp.style.transform=`perspective(2400px) translateY(${f2(lerp(1400,0,q))}px) rotateX(${f2(lerp(12,4,settle))}deg) rotateY(${f2(lerp(-9,-3,settle))}deg) rotate(${f2(lerp(7,-1.6,q)+0.6*settle)}deg)`;
    line.style.height=f2(lerp(0,L2-L1-NS-20,ez.ui(P(t,8.86,9.0))))+'px';
    const sq=P(t,8.82,9.1);                                            // snaps onto the chain, landing on the beat at 9.0
    vis(link2,P(t,8.82,8.88),0,`translateY(${f2(80*(1-ez.back(sq)))}px)`);
    n2.style.transform=`scale(${f2(ez.back(P(t,8.94,9.12)))})`;
    const g=P(t,9.0,9.3)-0.45*P(t,9.35,9.9);                           // the seal glows
    seal.style.filter=`drop-shadow(0 0 ${f2(4+36*g)}px rgba(47,138,84,${f2(0.25+0.6*g)})) brightness(${f2(1+0.22*g)})`;
    const oq=ez.ui(P(t,9.2,9.5));vis(ok,oq,(1-oq)*6,`translateY(${f2((1-oq)*14)}px)`);
    const p=ez.cam(P(t,8.5,10.0));cam(w,0,lerp(-30,10,p),lerp(1.04,1.12,p));
  };
});

/* ======== 8 · 10.0–11.0 s  slow pull-back to the monitor rule that started it, blur on the edges
            9 · 11.0–13.0 s  the rule blur-morphs into the M; the end line; a 1 s hold ======== */
function ruleCard(w){
  const rc=h('div','card abs',null,w,'left:-470px;top:-165px;width:940px;height:330px;transform-origin:50% 50%;');
  h('div','rc-ico abs',ic('target',68,'#f3d5f8',2),rc,'right:48px;top:52px;width:132px;height:132px;');
  h('div','rc-title abs',M.name,rc,'right:212px;top:46px;');
  h('div','rc-cond abs',num(M.condition),rc,'right:212px;top:140px;');
  h('div','tog abs','<i></i>',rc,'left:48px;top:84px;');
  return rc;
}
shot('s8',10.0,11.0,s=>{
  const w=h('div','world',null,s.el);ruleCard(w);
  const blur=dof(s.el,16);
  return t=>{
    const p=ez.cam(P(t,10.0,11.0));cam(w,lerp(180,0,p),lerp(-40,0,p),lerp(1.8,1.08,p));
    blur(radial(W/2,H/2,W*0.56,H*0.2,0.35),1);
  };
});
const END=pick({'9x16':{my:-250,mw:340,ly:36,uy:196,cy:330,s:1.0}});
shot('s9',11.0,Infinity,s=>{
  const w=h('div','world',null,s.el);
  const rc=ruleCard(w);
  const glow=h('div','mglow abs',null,w,`left:-470px;top:${END.my-470}px;width:940px;height:940px;`);
  const mh=END.mw*1637/2145,m=h('img','abs',null,w,`left:${-END.mw/2}px;top:${f2(END.my-mh/2)}px;width:${END.mw}px;`);m.src='assets_logo_m.png';
  const line=h('div','endline abs'+(EN?' en':''),EN?D.end.en:D.end.ar,w,`left:${-W/2}px;width:${W}px;top:${END.ly}px;`);
  const url=h('div','url abs',`<span class="ltr">${D.end.url}</span>`,w,`left:${-W/2}px;width:${W}px;top:${END.uy}px;`);
  const cta=PAID?h('div','cta abs'+(EN?' en':''),`<span>${EN?D.end.cta_en:D.end.cta_ar}</span>`,w,`left:${-W/2}px;width:${W}px;top:${END.cy}px;`):null;
  const blur=dof(s.el,16);
  return t=>{
    const pm=ez.cam(P(t,11.0,11.42));                                  // the blur morph: the card shrinks into the M's place as it blurs out
    vis(rc,1-ez.inQ(P(t,11.08,11.42)),46*ez.outQ(P(t,11.0,11.36)),`translateY(${f2(END.my*pm)}px) scale(${f2(lerp(1,0.4,pm))})`);
    const mq=ez.dec(P(t,11.1,11.66));
    vis(m,ez.outQ(P(t,11.1,11.4)),34*(1-mq),`scale(${f2(lerp(1.7,1,mq))})`);
    glow.style.opacity=f2(0.85*ez.outQ(P(t,11.12,11.7)));
    const lq=ez.dec(P(t,11.6,12.05));vis(line,lq,(1-lq)*10,`translateY(${f2((1-lq)*26)}px)`);
    const uq=ez.dec(P(t,11.82,12.2));vis(url,uq,(1-uq)*6,`translateY(${f2((1-uq)*16)}px)`);
    if(cta){const cq=ez.dec(P(t,12.0,12.4));vis(cta,cq,(1-cq)*8,`translateY(${f2((1-cq)*18)}px)`);}
    cam(w,0,-40*ez.cam(P(t,11.0,11.7)),END.s*lerp(1.08,1.13,ez.outQ(P(t,11.0,13.5))));
    blur(radial(W/2,H/2,W*0.56,H*0.2,0.35),1-P(t,11.0,11.35));
  };
});

/* ---------- over everything: the bloom and flash (3.0–3.66 s), grain and vignette, the English captions ---------- */
const bloom=h('div',null,null,stage);bloom.id='bloom';
const flash=h('div',null,null,stage);flash.id='flash';
const fx=h('canvas',null,null,stage);fx.id='fx';fx.width=W;fx.height=H;const g=fx.getContext('2d');
const cap=h('div','cap',null,stage,`top:${pick({'9x16':1600,'16x9':930,'1x1':940})}px;`);
const CAPS=[[1.5,3.0,'s2'],[3.5,5.0,'s4'],[8.5,10.0,'s7']];
function overlays(T){
  bloom.style.opacity=T>=3.0&&T<3.5?f2(ez.inC(P(T,3.0,3.46))):0;
  flash.style.opacity=T<3.5?f2(ez.inQ(P(T,3.24,3.5))):f2(1-ez.outQ(P(T,3.5,3.66)));
  const c=EN&&CAPS.find(c=>T>=c[0]&&T<c[1]);
  if(!c){cap.style.opacity=0;return;}
  cap.textContent=D.captions_en[c[2]];
  const q=ez.dec(P(T,c[0]+0.1,c[0]+0.4));
  cap.style.opacity=f2(Math.min(q,1-P(T,c[1]-0.16,c[1])));cap.style.transform=`translateY(${f2((1-q)*14)}px)`;
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
const FONTS=['400 40px PlexAR','500 40px PlexAR','600 40px PlexAR','700 40px PlexAR','700 40px Kufi','500 40px Inter','700 40px Inter'];
Promise.all(FONTS.map(f=>document.fonts.load(f,'مرصد يراقب. وأنت تقرّر 0123456789 Marsad'))).then(()=>{window.SEEK=seek;seek(0);});
})();
