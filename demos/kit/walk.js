/* ===== the walkthrough kit (demos/kit/walk.js, demos/kit/walk.css) =====
   Marsad's walkthrough method: the grammar of Benji Taylor's "Live Studio" walkthrough (x.com/benjitaylor/status/
   2072435629548597547) and the launch videos at notes.apoorv.xyz/launch-videos, in Marsad's main theme (the 48 s
   film's, films/style-jupiter). 16:9. A demo gets the kit with "kit": "walk" in demo.json (tools/make_demo.py).

   const W=M.walk({map, page, intro, steps, benefit}) sets up everything but the steps' moves:
     the dark stage (lenses that drift a little with the camera, dust) and the intro: a small grey kicker, the feature's
       name in the gradient, its Arabic under it (k0-7);
     the app window (M.app), rising in on its back from k4.5 and landing flat on the groove (k8);
     the camera, W.cam(t,to,o): it moves the window's layer in 3D. to: {at, dx, dy, z, rx, ry, ox, oy}
       at   what to centre: a page point W.NP(x,y) (natural px), a selector, 'text:…', {page,sel}; dx/dy nudge it (natural px)
       z    the zoom (1 = the whole window; dives 2-4); rx/ry a tilt in degrees; ox/oy a screen offset in px
       'page' for the whole window, a little tilted. o: {dur (1.1 s), ease ('prem'), hop (0: on a long pan, pull back
       this much mid-move), push (0.012: once there, keep creeping in, per second)}
       A zoom turns about a fixed point, so a dive reads as going into the thing, not as a slide;
     the pointer: W.app.click() also turns the arrow into a hand just before the click;
     W.lift(spec,a,b,{glow:'violet'|'green', depth, up, down, hide:[specs], display}): a part of the page floats out of
       it (the theme's 3D), glowing, over the recess it leaves, and settles back into place by b;
     the step capsule: one line per step ({at, en, ar}), English · Arabic, at the foot of the frame, until capOut;
     the exit (the window tilts away and fades), the benefit line on the stage held through the track's break, and the
       capsule end on the hit (Book your demo, marsadnasl.com, the mark).
   It returns {app, cam, lift, NP, jt, K}: K holds the map's times in seconds (land, capOut, exit, benefit, hit, end);
   o.times ({exit: 57, capOut: 56.5, ...}, in beats) moves any of them.
   The steps then use W.app like any M.app (click, page, type, show, hide, count, text, set) and W.cam / W.lift.
   Maps (song beats of the client's funk track, 115 BPM; demo.json's music "edit" must match):
     '44'  [[8,48],[64,80],[48,64],[64,76]]  43.8 s: steps k8-58 (groove B lifts on k40), benefit k62-72 (break k68-71), end k72
     '30'  [[8,48],[56,73]]                  29.7 s: steps k8-38, benefit k41-48 (break k44-47), end k48 */
(function(){
'use strict';
const {B,S8,S16,ez,P,st,lerp,FQ,clamp}=M;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3), f4=x=>(+x).toFixed(4);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;
const MAPS={
  '44':{land:8,capOut:57.5,exit:58,out:60.6,benefit:62.4,hit:72,end:84},
  '30':{land:8,capOut:37.5,exit:38,out:40.2,benefit:41.4,hit:48,end:57},
};
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
const GLOW={green:['120,220,160','40,190,110'],violet:['236,205,255','206,64,240']};
const HAND='<svg class="hand" viewBox="0 0 32 36"><path d="M11.5 1.5c1.4 0 2.5 1.1 2.5 2.5V13c.4-.9 1.3-1.5 2.3-1.5 1.1 0 2 .7 2.3 1.7.4-.8 1.3-1.4 2.3-1.4 1.2 0 2.1.8 2.4 1.9.4-.5 1-.8 1.8-.8 1.4 0 2.4 1.1 2.4 2.5V24c0 5.5-3.5 9.5-9.5 9.5h-2.5c-3.3 0-5.6-1.4-7.4-4.1L3.6 22.6c-.8-1.2-.5-2.8.7-3.5 1.1-.7 2.5-.5 3.3.5L9 21.3V4c0-1.4 1.1-2.5 2.5-2.5Z" '+
  'fill="#FFFFFF" stroke="#1A191E" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 13.4v5.6M18.6 13.4v5.2M23.3 13.9v5" stroke="#1A191E" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>';

M.walk=function(o){
  const map=MAPS[o.map||'44'];if(!map)throw new Error(`M.walk: unknown map "${o.map}" (${Object.keys(MAPS).join(', ')})`);
  const K={};for(const k in map)K[k]=B((o.times||{})[k]??map[k]);   // o.times: {exit: 57, ...} moves one (beats)
  window.CUTS=[K.hit];                            // the end cuts on the hit; everything before it is one continuous camera

  /* ---------------- layers: the stage under the window, the type over it ---------------- */
  const BGL=M.layer(), TXT=M.layer('over');
  const cv=M.el('canvas',null,null,M.el('div','wk-stage',null,BGL));cv.width=1920;cv.height=1080;const g=cv.getContext('2d');

  /* ---------------- the app, in its window ---------------- */
  const app=M.app({at:B(4.5),out:K.out,page:o.page||'pulse',view:o.view});
  const WIN_EL=document.querySelector('.m-win'), WL=WIN_EL.parentNode, SITE=WIN_EL.querySelector('.m-site'), CUR_EL=WIN_EL.querySelector('.m-cursor');
  const NP=(x,y)=>({x,y,w:0,h:0});

  /* ---------------- the camera: it moves the window's layer in 3D ---------------- */
  st(WL,{transformOrigin:'0 0',transformStyle:'preserve-3d'});
  const PERSP=1600, CAM0={cx:960,cy:530,z:0.66,rx:64,ry:0,ox:0,oy:860}, CAM=[];
  function cam(t,to,co={}){if(to==='page')to={z:1.04,rx:3,ry:-4};CAM.push({t,to,o:co});CAM.sort((a,b)=>a.t-b.t);}
  function goal(k){
    if(k.g)return k.g;
    const to=k.to,q={cx:960,cy:530,z:1,rx:0,ry:0,ox:0,oy:0};
    for(const key in q)if(to[key]!=null)q[key]=to[key];
    if(to.at!=null){const r=app.toStage(to.at,k.t+0.05);q.cx=r.cx+(to.dx||0)*r.s;q.cy=r.cy+(to.dy||0)*r.s;}
    return k.g=q;
  }
  function segment(k,from){
    const to=goal(k),dur=k.o.dur??1.1,E=ez[k.o.ease||'prem'],hop=k.o.hop||0,push=k.o.push??0.012,t0=k.t;
    const lz0=Math.log(from.z),lz1=Math.log(to.z),wz=clamp(Math.abs(lz1-lz0)/0.6,0,1),dz=1-from.z/to.z;
    return t=>{
      const p=E(P(t,t0,t0+dur)),zb=Math.exp(lerp(lz0,lz1,p));
      const q=lerp(p,Math.abs(dz)>1e-4?(1-from.z/zb)/dz:p,wz);   // a zoom turns about the point that stays put on screen
      return {cx:lerp(from.cx,to.cx,q),cy:lerp(from.cy,to.cy,q),z:zb*(1-hop*Math.sin(Math.PI*p))*(1+push*Math.max(0,t-t0-dur)),
        rx:lerp(from.rx,to.rx,p),ry:lerp(from.ry,to.ry,p),ox:lerp(from.ox,to.ox,p),oy:lerp(from.oy,to.oy,p)};
    };
  }
  let camT=null,camS=null;
  function camAt(t){
    if(t===camT)return camS;
    let f=()=>CAM0;
    for(const k of CAM){if(t<k.t)break;f=segment(k,f(k.t));}
    camT=t;return camS=f(t);
  }
  M.track(t=>{
    const c=camAt(t),z=f4(c.z);
    WL.style.transform=`translate(${f2(960+c.ox)}px,${f2(540+c.oy)}px) perspective(${PERSP}px) rotateX(${f3(c.rx)}deg) rotateY(${f3(c.ry)}deg) `+
      `scale3d(${z},${z},${z}) translate(${f2(-c.cx)}px,${f2(-c.cy)}px)`;
    CUR_EL.style.setProperty('--k',f3(Math.pow(c.z,-0.5)));      // the pointer stays about one size on screen as the camera zooms
  });
  // the window rises in on its back and lands flat on the groove
  cam(B(4.5),{z:0.78,rx:40,oy:300},{dur:B(7)-B(4.5),ease:'dec',push:0});
  cam(B(7),{z:1,rx:0,oy:0},{dur:0.95,push:0.004});
  // the exit: the window tilts away and fades
  cam(K.exit,{cx:960,cy:540,z:0.62,rx:14,ry:-18,oy:30},{dur:2.2,ease:'sin',push:0});

  /* ---------------- the pointer: the app's arrow, a hand over what it is about to click ---------------- */
  const ARROW=CUR_EL.innerHTML, HANDS=[], click0=app.click;
  app.click=(t,spec,co={})=>{HANDS.push([t-(co.hand??0.3),t+0.85]);return click0(t,spec,co);};
  M.track(t=>{const q=FQ(t),h=HANDS.some(([a,b])=>q>=a&&q<b);if(h!==CUR_EL._h){CUR_EL.innerHTML=h?HAND:ARROW;CUR_EL._h=h;}});

  /* ---------------- parts float out of the page: a copy of the part, outside the window's clip, rises off the page
     over the recess it leaves and its shadow, glowing, then settles back and hands over to the real one ---------------- */
  const LB=M.el('div','site m-site wk-lb');WIN_EL.insertBefore(LB,CUR_EL);
  st(LB,{left:'1.5px',top:'1.5px',transformStyle:'preserve-3d'});
  const LIFTS=[];
  function lift(spec,a,b,lo={}){
    let orig=app.el(spec,a);
    while(orig.children.length===1&&orig.children[0].textContent===orig.textContent)orig=orig.children[0];   // 'text:' finds a pill's wrapper first
    const R=app.rect(orig),cs=getComputedStyle(orig),rad=lo.radius??(parseFloat(cs.borderTopLeftRadius)||12);
    const box=cls=>{const e=M.el('div',cls,null,LB);st(e,{position:'absolute',left:R.x+'px',top:R.y+'px',width:R.w+'px',height:R.h+'px',borderRadius:rad+'px'});return e;};
    const slot=box('wk-slot'),shd=box('wk-shd'),w=box('wk-lw'),cl=orig.cloneNode(true);cl.removeAttribute('id');
    st(cl,{position:'absolute',left:'0px',top:'0px',right:'auto',bottom:'auto',margin:'0px',width:R.w+'px',height:R.h+'px',direction:cs.direction,
      display:lo.display||orig.dataset.disp||(cs.display==='none'?'block':cs.display),opacity:'1',transform:'none',visibility:'visible'});
    w.appendChild(cl);
    const hide=[orig].concat((lo.hide||[]).map(q=>app.el(q,a)));
    const [c1,c2]=GLOW[lo.glow||'violet'],up=lo.up??0.8,down=lo.down??0.7,depth=lo.depth??30;
    LIFTS.push([a,b]);
    M.track(t=>{
      const on=inShot(t,a,b);hide.forEach(e=>{e.style.visibility=on?'hidden':'';});
      [slot,shd,w].forEach(e=>show(e,on));if(!on)return;
      const l=dec(t,a,a+up)*(1-io(t,b-down,b));
      w.style.transform=`translateZ(${f1(depth*l)}px)`;
      cl.style.boxShadow=`0 0 0 ${f2(2.5*l)}px rgba(${c1},${f3(0.95*l)}),0 0 ${f1(46*l)}px ${f1(6*l)}px rgba(${c2},${f3(0.5*l)})`;
      st(shd,{opacity:f3(l),transform:`translate3d(0px,${f1(0.35*depth*l)}px,0.5px)`});
    });
  }
  M.track(t=>{
    const on=LIFTS.some(([a,b])=>inShot(t,a,b));
    WIN_EL.style.transformStyle=on?'preserve-3d':'';             // only while something floats: the window is flat otherwise
    if(show(LB,on))LB.style.transform=SITE.style.transform;
  });

  /* ---------------- the stage: near black, lenses (they drift a little with the camera), dust ---------------- */
  function lens(x,y,r,lo={}){
    const a=lo.a??1, lx=(lo.lx??0.18)*r, ly=(lo.ly??-0.2)*r, gc='206,64,240';
    if(a<=0.002)return;
    const og=g.createRadialGradient(x,y,r*0.97,x,y,r*1.16);og.addColorStop(0,`rgba(${gc},${f3(0.32*a)})`);og.addColorStop(1,`rgba(${gc},0)`);
    g.fillStyle=og;g.beginPath();g.arc(x,y,r*1.16,0,2*Math.PI);g.fill();
    const gr=g.createRadialGradient(x+lx,y+ly,0,x,y,r);for(const [s,c] of RIM)gr.addColorStop(s,c);
    g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fill();g.globalAlpha=1;
  }
  function haze(x,y,r,c,a){if(a<=0.002)return;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);gr.addColorStop(1,`rgba(${c},0)`);
    g.fillStyle=gr;g.fillRect(0,0,1920,1080);}
  const DUST=[];{const r=M.mulberry(77);for(let i=0;i<170;i++)DUST.push({x:r()*1920,y:r()*1080,s:0.8+r()*1.9,vx:(r()-0.35)*7,vy:-(2+r()*8),ph:r()*6.3,f:0.4+r()*0.6});}
  function dust(t,a,px=0,py=0){for(const d of DUST){const x=((d.x+d.vx*t+px)%1940+1940)%1940-10, y=((d.y+d.vy*t+py)%1100+1100)%1100-10,
    tw=0.55+0.45*Math.sin(t*d.f*2+d.ph);g.fillStyle=`rgba(236,214,255,${f3(a*tw*0.55)})`;g.fillRect(x,y,d.s,d.s);}}
  M.track(t=>{
    const c=camAt(t);
    g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
    const px=-(c.cx-960)*0.07+c.ox*0.25, py=-(c.cy-530)*0.07+c.oy*0.25;
    const u=P(t,0,K.land), a1=dec(t,0.05,1.3)*(1-io(t,B(6.5),B(8.5)));   // the intro: three lenses adrift
    if(a1>0.002){lens(170-110*u,700+30*u,500,{a:a1,lx:0.2,ly:-0.1});lens(1780+90*u,560-20*u,540,{a:a1,lx:-0.2,ly:-0.1});
      lens(960+60*u,250-60*u,600*(1.05-0.08*u),{a:a1,lx:0.12,ly:-0.3});}
    lens(960+px,1530+py,1180,{a:io(t,B(6.5),B(8.5))*(1-io(t,K.exit,K.exit+1.6)),lx:0,ly:-0.28});   // under the window
    const v=P(t,K.exit+1,K.hit);lens(960,2600-50*v,1650,{a:0.55*io(t,K.exit+1,K.benefit+0.3)*(t<K.hit?1:0),lx:0,ly:-0.1});   // the benefit
    if(t>=K.hit)haze(960,540,1000,'150,40,220',0.16*P(t,K.hit,K.hit+0.5));   // the end: the capsule glows on its own
    dust(t,t<K.hit?0.9:0.6,px*0.6,py*0.6);
  });

  /* ---------------- type: words blur in where they stand, the Arabic after them ---------------- */
  function jt(j){
    const e=M.el('div','jt'+(j.cls?' '+j.cls:''),null,TXT);st(e,{top:j.y+'px'});
    const en=M.el('div','en',null,e);if(j.size)en.style.fontSize=j.size+'px';
    const ws=[];for(const w of j.words){if(w==='\n'){en.appendChild(document.createElement('br'));continue;}
      ws.push(typeof w==='string'?M.el('span','w',w,en):M.el('span','w'+(w.g?' g':'')+(w.d?' dim':''),w.t,en));}
    const ar=j.ar?M.el('div','ar',j.ar,e):null;if(ar&&j.arSize)ar.style.fontSize=j.arSize+'px';
    const T=ws.map((_,i)=>j.at+i*(j.step??S8)), tAr=j.arAt??(T[T.length-1]+S8);
    M.track(t=>{
      if(!show(e,inShot(t,j.at-0.001,j.out)))return;
      const x=j.fade?io(t,j.fade[0],j.fade[1]):0;
      e.style.opacity=f3(1-x);e.style.filter=x>0?`blur(${f2(8*x)}px)`:'none';
      ws.forEach((s,i)=>{const p=dec(t,T[i],T[i]+0.5);st(s,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*12)}px)`:'none',transform:`translateY(${f1((1-p)*16)}px)`});});
      if(ar){const p=dec(t,tAr,tAr+0.55);st(ar,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*8)}px)`:'none',transform:`translateY(${f1((1-p)*10)}px)`});}
    });
    return e;
  }
  const I=o.intro||{};
  if(I.kicker)jt({at:B(0.25),out:B(7),y:350,size:46,words:[{t:I.kicker,d:1}],fade:[B(6.1),B(6.9)]});
  jt({at:B(1.25),out:B(7),y:404,size:I.size||132,words:[{t:I.name||'',g:1}],ar:I.ar,arSize:46,arAt:B(2.5),fade:[B(6.1),B(6.9)]});

  /* ---------------- the step capsule: one step at a time, English · Arabic ---------------- */
  const STEPS=o.steps||[];
  if(STEPS.length){
    const PILL=M.el('div','wk-pill',null,TXT), NUM=M.el('div','wk-num',null,PILL), TX=M.el('div','wk-txt',null,PILL);
    STEPS.forEach((s,i)=>{s.n=M.el('span',null,String(i+1),NUM);
      s.e=M.el('div','l',`<span class="en">${s.en}</span><span class="sep">·</span><span class="ar">${s.ar}</span>`,TX);});
    M.track(t=>{
      if(STEPS[0].w==null){PILL.style.display='';STEPS.forEach(s=>{s.e.style.display='';});STEPS.forEach(s=>{s.w=s.e.offsetWidth;});}
      if(!show(PILL,inShot(t,STEPS[0].at-0.01,K.capOut+0.6)))return;
      let i=0;STEPS.forEach((s,j)=>{if(t>=s.at-0.15)i=j;});
      const s=STEPS[i],pv=i>0?STEPS[i-1]:null,w=88+(pv?lerp(pv.w,s.w,io(t,s.at-0.15,s.at+0.45)):s.w)+40;
      const pin=dec(t,STEPS[0].at,STEPS[0].at+0.6),pout=io(t,K.capOut,K.capOut+0.5);
      st(PILL,{width:f1(w)+'px',opacity:f3(pin*(1-pout)),transform:`translate(${f1(960-w/2)}px,946px) scale(${f3((0.94+0.06*pin)*(1-0.04*pout))})`});
      STEPS.forEach((q,j)=>{
        const a=dec(t,q.at+(j?0.05:0.12),q.at+(j?0.6:0.7)), nx=j<STEPS.length-1?STEPS[j+1].at:1e9, b=io(t,nx-0.3,nx+0.05), op=a*(1-b);
        if(!show(q.e,op>0.002)|!show(q.n,op>0.002))return;
        const bl=(1-a)*8+b*6, fl=bl>0.2?`blur(${f2(bl)}px)`:'none';
        st(q.e,{opacity:f3(op),filter:fl,transform:`translateY(${f1((1-a)*8)}px)`});st(q.n,{opacity:f3(op),filter:fl});
      });
    });
  }

  /* ---------------- the benefit, held through the track's break ---------------- */
  if(o.benefit)jt({at:K.benefit,out:K.hit,y:o.benefit.y??430,size:o.benefit.size??84,words:o.benefit.words,ar:o.benefit.ar,arSize:44});

  /* ---------------- the end: on the hit a capsule blooms round "Book your demo.", then the URL ---------------- */
  const H=K.hit, bh=k=>H+B(k)-B(0);                 // k beats after the hit
  jt({at:H+0.25,out:bh(3.4),y:466,size:64,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:40,fade:[bh(2.75),bh(3.35)]}).style.zIndex='2';
  const CAP=M.el('div','jcap','<span>marsadnasl.com</span>',TXT), capT=CAP.firstChild;
  const MKE=M.el('img','jmk',null,TXT);MKE.src='assets_logo_m.png';
  const BOOK=M.el('div','jbook',`<span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span>`,TXT);
  const FTR=M.el('div','jft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',TXT);
  M.track(t=>{
    const on=t>=H;[CAP,MKE,BOOK,FTR].forEach(e=>show(e,on));if(!on)return;
    const pin=dec(t,H,H+0.55), ps=dec(t,bh(2.75),bh(3.75)+0.3), k=1-ps;
    const w=lerp(lerp(420,1320,pin),760,ps), h=lerp(lerp(300,380,pin),150,ps), cy=lerp(540,560,dec(t,bh(4),bh(5)));
    st(CAP,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(960-w/2)}px,${f1(cy-h/2)}px)`,opacity:f3(P(t,H,H+0.3)),
      boxShadow:`inset 0 0 0 2px rgba(255,215,250,0.95),inset 0 0 ${f1(16+12*k)}px ${f1(5+5*k)}px rgba(214,70,240,0.85),`+
        `inset 0 0 ${f1(46+54*k)}px ${f1(14+20*k)}px rgba(110,30,200,0.55),0 0 ${f1(26+16*k)}px 3px rgba(214,70,240,0.5),0 0 ${f1(70+40*k)}px 10px rgba(122,40,220,0.3)`});
    const pt=dec(t,bh(3.55),bh(3.55)+0.5);st(capT,{opacity:f3(pt),filter:pt<1?`blur(${f2((1-pt)*8)}px)`:'none'});
    const pm=dec(t,bh(4),bh(4)+0.8);st(MKE,{opacity:f3(pm),transform:`translate(865px,${f1(262+(1-pm)*16)}px) scale(${f3(0.92+0.08*pm)})`});
    const pb=dec(t,bh(4.5),bh(4.5)+0.7);st(BOOK,{top:'700px',opacity:f3(pb),transform:`translateY(${f1((1-pb)*14)}px)`});
    st(FTR,{opacity:f3(0.55*dec(t,bh(5),bh(5)+0.8))});
  });
  M.punch(K.land,{amp:0.012});                    // the landing and the end only
  M.punch(K.hit,{amp:0.015});

  return {app,cam,lift,NP,jt,K};
};
})();
