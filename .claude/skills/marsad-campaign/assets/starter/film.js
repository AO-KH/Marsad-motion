/* Marsad — <title> (films/<slug>), a campaign film in Marsad's main theme: the look of the client's two approved films,
   the 48 s film (films/style-jupiter) and the ontology film (films/ontology-main-theme).
   Started from the marsad-campaign skill's starter (.claude/skills/marsad-campaign/assets/starter/). It holds the
   theme's blocks (the stage, the type, the mark, the capsule end) and five example shots; replace the shots with the
   storyboard's and keep the blocks.
   House rules: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no orb
   behind the logo, "Book your demo" and marsadnasl.com at the end, effects on the transitions only.
   Music: the client's "Joyful Rhythm Walk Funk" (lightbeatsmusic, Pixabay #513936), 115 BPM; the 30 s edit, song beats
   8-47 then 56-72: the groove from film k8, the track's own one-bar break on k44-47, the hit on k48. B(k) = k x 0.5217 s.
     k0-8    hook     the famous sources adrift in depth between three lenses; "Your company's data is everywhere."
     k8-16   the turn (the groove) the tiles fly into the centre, the mark lands and a lens bursts out of it; orbits;
                      "Marsad changes that."
     k16-24  proof    Business Pulse in perspective, pulling back and up; "From your own numbers."
     k24-32  proof    Decisions swings in; its "Action executed" card lifts out of the page, glowing green;
                      "Decision to action."
     k32-40  model    a horizon lens rises; "Every system. One living model."
     k40-48  breath   "One operational nervous system.", held through the track's break (k44-47)
     k48-57  end      on the hit a capsule blooms round "Book your demo." and shrinks into the marsadnasl.com capsule;
                      the mark; "Book your demo · احجز عرضك التجريبي"
   Truth: the pages (site_pages/) and the executed card are the app's own; the lines are the approved ones of the 63 s
   and 48 s films. Renderings: the lenses, the orbits, the tiles adrift, the card's empty slot
   (films/ontology-main-theme/pages/decisions_base.png).
   Before a real film, apply the feature catalogue (2026-10-01, references/feature-catalogue.md), which these example
   shots predate: swap the famous tiles (K.TILES: SAP, Salesforce, Oracle, Shopify, QuickBooks imply connectors Marsad
   doesn't have) for Odoo, documents, spreadsheets, Drive and WhatsApp; lift the approved card or the passport's seal
   instead of "Action executed" (the follow-up after approval is switched off); and replace "Decision to action." */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;

const K_TURN=B(8), K_P1=B(16), K_P2=B(24), K_MOD=B(32), K_BR=B(40), K_HIT=B(48);
window.CUTS=[K_P1,K_P2,K_MOD,K_BR,K_HIT];   // hard cuts: motion blur never mixes two shots. The turn (k8) is continuous

/* ---------------- the stage: near black, drifting dust, lenses painted on a canvas ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','mt-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
// a lens: a dark body, the rim brightening from indigo through violet and magenta to pink-white
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
// (lx, ly) x r: where the gradient's inner point sits, so the rim is widest on the opposite side
function lens(x,y,r,o={}){
  const a=o.a??1, lx=(o.lx??0.18)*r, ly=(o.ly??-0.2)*r, gc='206,64,240';
  if(a<=0.002)return;
  if((o.glow??1)>0){const og=g.createRadialGradient(x,y,r*0.97,x,y,r*1.16);
    og.addColorStop(0,`rgba(${gc},${f3(0.32*a*(o.glow??1))})`);og.addColorStop(1,`rgba(${gc},0)`);
    g.fillStyle=og;g.beginPath();g.arc(x,y,r*1.16,0,2*Math.PI);g.fill();}
  const gr=g.createRadialGradient(x+lx,y+ly,0,x,y,r);for(const [s,c] of RIM)gr.addColorStop(s,c);
  g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fill();g.globalAlpha=1;
}
function haze(x,y,r,c,a){if(a<=0.002)return;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);gr.addColorStop(1,`rgba(${c},0)`);
  g.fillStyle=gr;g.fillRect(0,0,1920,1080);}
// dust: fine specks drifting up, each twinkling slowly (0.1-0.3 Hz, never on the beat)
const DUST=[];{const r=M.mulberry(77);for(let i=0;i<170;i++)DUST.push({x:r()*1920,y:r()*1080,s:0.8+r()*1.9,vx:(r()-0.35)*7,vy:-(2+r()*8),ph:r()*6.3,f:0.4+r()*0.6});}
function dust(t,a){for(const d of DUST){const x=((d.x+d.vx*t)%1940+1940)%1940-10, y=((d.y+d.vy*t)%1100+1100)%1100-10,
  tw=0.55+0.45*Math.sin(t*d.f*2+d.ph);g.fillStyle=`rgba(236,214,255,${f3(a*tw*0.55)})`;g.fillRect(x,y,d.s,d.s);}}
// two thin orbits round the hero lens, each with one light running along it
function orbits(t,a){if(a<=0.002)return;
  g.save();g.translate(960,540);g.lineWidth=1.5;
  for(const [rot,ph,sp] of [[-0.21,0.3,0.05],[0.18,2.4,-0.04]]){g.save();g.rotate(rot);
    g.strokeStyle=`rgba(242,155,255,${f3(0.24*a)})`;g.beginPath();g.ellipse(0,0,1150,250,0,0,2*Math.PI);g.stroke();
    const th=ph+sp*2*Math.PI*t;g.fillStyle=`rgba(255,225,252,${f3(0.95*a)})`;g.shadowColor='rgba(222,13,255,0.95)';g.shadowBlur=16;
    g.beginPath();g.arc(1150*Math.cos(th),250*Math.sin(th),4.5,0,2*Math.PI);g.fill();g.shadowBlur=0;g.restore();}
  g.restore();}
M.track(t=>{                               // each shot sets its own stage
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
  if(t<K_P1){                              // three lenses drift apart; on the turn a lens bursts out of the mark
    const u=P(t,0,K_TURN), pa=dec(t,0.05,1.3), out=1-P(t,K_TURN-0.05,K_TURN+0.55);
    lens(170-110*u,700+30*u,500,{a:pa*out,lx:0.2,ly:-0.1});lens(1780+90*u,560-20*u,540,{a:pa*out,lx:-0.2,ly:-0.1});
    lens(960+60*u,250-60*u,600*(1.05-0.08*u),{a:pa*out,lx:0.12,ly:-0.3});
    if(t>=K_TURN){const pb=ez.outC(P(t,K_TURN,K_TURN+0.9));lens(960,540,lerp(40,1010,pb)-14*P(t,K_TURN+0.9,K_P1),{lx:-0.05,ly:-0.12});
      orbits(t,P(t,K_TURN+0.5,K_TURN+1.6));}
    dust(t,1);
  }else if(t<K_P2){haze(960,760,1000,'150,40,220',0.32);dust(t,1);
  }else if(t<K_MOD){lens(1560,1880,1250,{lx:-0.12,ly:-0.1});haze(760,520,900,'150,40,220',0.14);dust(t,0.9);
  }else if(t<K_BR){lens(960,2285-40*P(t,K_MOD,K_BR),1500,{lx:0,ly:-0.1});dust(t,0.9);
  }else if(t<K_HIT){lens(960,2600,1650,{a:0.55,lx:0,ly:-0.1});dust(t,0.8);
  }else{haze(960,540,1000,'150,40,220',0.16*P(t,K_HIT,K_HIT+0.5));dust(t,0.6);}   // the end: the capsule glows on its own
});

/* ---------------- type: words blur in where they stand, the Arabic after them ---------------- */
// o: at, out, y, size, words (strings, {t, g: gradient, d: grey}, '\n'), step (default an 8th), ar, arSize, arAt,
//    fade [from, to] (blur out), x + w + cls 'left' (a left column), cls 'dark' (dark type on a bright lens)
function jt(o){
  const e=M.el('div','jt'+(o.cls?' '+o.cls:''),null,TXT);st(e,{top:o.y+'px'});
  if(o.x!=null)st(e,{left:o.x+'px',width:(o.w??1920-o.x)+'px'});
  const en=M.el('div','en',null,e);if(o.size)en.style.fontSize=o.size+'px';
  const ws=[];for(const w of o.words){if(w==='\n'){en.appendChild(document.createElement('br'));continue;}
    ws.push(typeof w==='string'?M.el('span','w',w,en):M.el('span','w'+(w.g?' g':'')+(w.d?' dim':''),w.t,en));}
  const ar=o.ar?M.el('div','ar',o.ar,e):null;if(ar&&o.arSize)ar.style.fontSize=o.arSize+'px';
  const T=ws.map((_,i)=>o.at+i*(o.step??S8)), tAr=o.arAt??(T[T.length-1]+S8);
  M.track(t=>{
    if(!show(e,inShot(t,o.at-0.001,o.out)))return;
    const x=o.fade?io(t,o.fade[0],o.fade[1]):0;
    e.style.opacity=f3(1-x);e.style.filter=x>0?`blur(${f2(8*x)}px)`:'none';
    ws.forEach((s,i)=>{const p=dec(t,T[i],T[i]+0.5);st(s,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*12)}px)`:'none',transform:`translateY(${f1((1-p)*16)}px)`});});
    if(ar){const p=dec(t,tAr,tAr+0.55);st(ar,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*8)}px)`:'none',transform:`translateY(${f1((1-p)*10)}px)`});}
  });
  return e;
}
// the mark with its own glow (a blurred copy under it), never a disc behind it
const mark=(parent,w)=>{const e=M.el('div','jmark',`<img class="gl" src="assets_logo_m.png"><img class="m" src="assets_logo_m.png">`,parent);
  st(e,{width:w+'px',height:f1(w*1637/2145)+'px'});return {e,m:e.querySelector('.m'),gl:e.querySelector('.gl')};};

/* ================= k0-8 the hook: the famous sources adrift in depth; they fly into the centre ================= */
const SH1=M.el('div','mt-shot',null,SCN), D1=M.el('div','mt-3d',null,SH1);
const MK={x:960,y:540};                     // where the mark lands on the turn
const TL=[{x:300,y:230,z:-80,rx:-8,ry:18,slot:3},{x:760,y:150,z:-340,rx:-12,ry:8,slot:0},{x:1210,y:170,z:-60,rx:-10,ry:-10,slot:6},
  {x:1660,y:260,z:-240,rx:-6,ry:-20,slot:2},{x:250,y:830,z:-200,rx:10,ry:20,slot:5},{x:700,y:910,z:-60,rx:14,ry:10,slot:1},
  {x:1200,y:890,z:-300,rx:12,ry:-8,slot:7},{x:1680,y:810,z:-40,rx:8,ry:-18,slot:4}]
  .map((p,i)=>({...p,i,t0:B(0.25+0.25*i),ta:B(6.25+0.25*p.slot),el:M.el('div','k-tile m-glass',K.tile(K.TILES[i]),D1)}));
function drift(p,t){                       // adrift: slow sines (periods of 11-13 s, never the beat); blurred by depth
  const pe=dec(t,p.t0,p.t0+1.1);
  return {x:p.x+18*Math.sin(2*Math.PI*t/11+p.i*1.7), y:p.y+12*Math.cos(2*Math.PI*t/13+p.i*1.1), z:p.z-160*(1-pe),
    o:pe, bl:Math.min(10,Math.abs(p.z+150)/60)+(1-pe)*10, rx:p.rx+3*Math.sin(t*0.5+p.i), ry:p.ry+4*Math.sin(t*0.4+p.i*0.7)};
}
M.track(t=>{
  if(!show(SH1,t<K_TURN+0.1))return;
  for(const p of TL){
    const on=t>=p.t0-0.02&&t<p.ta+0.02;p.el.style.display=on?'':'none';if(!on)continue;
    let q=drift(p,t),sc=1.3;
    const f0=p.ta-0.85,u=P(t,f0,p.ta);
    if(u>0){                               // the pull: a curved flight into the mark, faster and smaller as it arrives
      const a=drift(p,f0),e=ez.inC(u),dx=MK.x-a.x,dy=MK.y-a.y,d=Math.hypot(dx,dy)||1,sw=150*Math.sin(Math.PI*u);
      q={x:lerp(a.x,MK.x,e)-dy/d*sw, y:lerp(a.y,MK.y,e)+dx/d*sw, z:lerp(a.z,0,e), o:Math.min(1,a.o+u*2.2)*(1-P(u,0.8,1)),
        bl:a.bl*(1-u), rx:a.rx*(1-e), ry:a.ry*(1-e)};
      sc=lerp(1.3,0.3,e);
    }
    st(p.el,{opacity:f3(q.o),filter:q.bl>0.3?`blur(${f2(q.bl)}px)`:'none',transform:T3(q.x,q.y,112,112,{z:q.z,rx:q.rx,ry:q.ry,s:sc})});
  }
});
jt({at:B(0.875),out:B(6.2),y:432,size:84,words:['Your',"company's",'data',{t:'is',d:1},{t:'everywhere.',d:1}],ar:'بيانات شركتك مبعثرة في كل مكان.',fade:[B(5.6),B(6.2)]});

/* ================= k8-16 the turn: the mark lands on the groove's first beat, a lens bursts out of it ================= */
const MKe=mark(SCN,300);
const T_UP=B(9.5);
M.track(t=>{
  const on=t>=B(6.25)&&t<K_P1;MKe.e.style.display=on?'':'none';if(!on)return;
  // lands on the beat: in over 0.75 s with a 3% overshoot (the logo only); its glow gathers with the tiles, blooms, settles
  const p=P(t,K_TURN,K_TURN+0.75), sc=t<K_TURN?0.86:0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  const pu=io(t,T_UP,T_UP+1.1), y=lerp(MK.y,300,pu), s=sc*lerp(1,0.55,pu);
  st(MKe.e,{transform:`translate(${f1(MK.x-150)}px,${f1(y-114.5)}px) scale(${f3(s)})`,opacity:f3(t<K_TURN?1:ez.dec(Math.min(1,p*1.6)))});
  const pre=0.35*io(t,B(6.25),K_TURN), bloom=0.9*dec(t,K_TURN,K_TURN+0.3)*(1-0.55*io(t,K_TURN+0.4,K_TURN+2));
  MKe.gl.style.opacity=f3(t<K_TURN?pre:Math.max(bloom,0.35*(1-dec(t,K_TURN,K_TURN+0.3))));
  MKe.m.style.opacity=t<K_TURN?'0':'1';
});
jt({at:B(10.5),out:K_P1,y:470,size:96,step:S16*1.5,words:[{t:'Marsad',g:1},'changes','that.'],ar:'مرصد يغيّر المعادلة.',arSize:44});

/* ================= k16-24 proof: a real page in perspective, pulling back and up ================= */
const SH2=M.el('div','mt-shot',null,SCN), D2=M.el('div','mt-3d',null,SH2);
const PUL=M.el('div','mt-page',null,D2);PUL.style.backgroundImage='url(site_pages/pulse.png)';
M.track(t=>{
  if(!show(SH2,inShot(t,K_P1,K_P2)))return;
  const u=io(t,K_P1,K_P2), pe=dec(t,K_P1,K_P1+0.6), ty=lerp(470,70,ez.dec(P(t,K_P1,K_P2)));
  st(PUL,{opacity:f3(pe),transform:`translate3d(12px,${f1(10+ty)}px,${f1(lerp(-150,-780,u))}px) rotateX(${f2(lerp(66,16,u))}deg) rotateZ(${f2(lerp(-7,0,u))}deg)`});
});
jt({at:B(16.5),out:K_P2,y:64,size:60,words:['From','your','own',{t:'numbers.',g:1}],ar:'مبنية على أرقامك — بلا اختلاق.',arSize:34});

/* ================= k24-32 proof: Decisions swings in; its real "Action executed" card lifts out of the page ================= */
// The page is the screenshot with the card's slot blanked; the card is the screenshot's own pixels, a child of the page
// moved out along the page's normal (translateZ, preserve-3d): flush it covers its slot, lifted it leaves it empty.
const SH3=M.el('div','mt-shot',null,SCN), D3=M.el('div','mt-3d',null,SH3);
const DEC=M.el('div','mt-page p3d',null,D3);DEC.style.backgroundImage='url(films/ontology-main-theme/pages/decisions_base.png)';
const part=([x,y,w,h])=>{const e=M.el('div','mt-part',null,DEC);
  st(e,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',borderRadius:'16px',backgroundImage:'url(site_pages/decisions.png)',backgroundPosition:`${-x}px ${-y}px`});return e;};
const KPIS=[[58,405,331,138],[415,405,331,138],[772,405,331,138],[1129,405,331,138]].map(part);   // the four counters (their slots are blank too)
const DONE=part([58,687,1402,214]);
const T_LIFT=B(27.5);
M.track(t=>{
  if(!show(SH3,inShot(t,K_P2,K_MOD)))return;
  const u=io(t,K_P2,B(27)), pe=dec(t,K_P2,K_P2+0.5), drift=P(t,B(27),K_MOD);
  st(DEC,{opacity:f3(pe),transform:T3(lerp(1380,1000,u)+30*drift,lerp(610,590,u),1896,1060,{z:lerp(-1400,-820,u),rx:lerp(12,8,u),ry:lerp(-44,-14,u)-3*drift,s:0.78})});
  KPIS.forEach((e,i)=>{const k=dec(t,B(25.5)+i*S16,B(25.5)+i*S16+0.6);   // the counters float a little, one per 16th
    st(e,{transform:`translateZ(${f1(70*k)}px)`,boxShadow:`0 0 0 ${f1(2.5*k)}px rgba(236,205,255,${f3(0.95*k)}),0 ${f1(26*k)}px ${f1(60*k)}px rgba(30,4,70,${f3(0.4*k)})`});});
  const l=dec(t,T_LIFT,T_LIFT+0.6);
  st(DONE,{transform:`translateZ(${f1(170*l)}px) scale(${f3(1+0.08*l)})`,
    boxShadow:`0 0 0 ${f1(3*l)}px rgba(150,236,190,${f3(0.95*l)}),0 0 ${f1(80*l)}px ${f1(16*l)}px rgba(60,220,140,${f3(0.5*l)}),0 ${f1(40*l)}px ${f1(90*l)}px rgba(6,30,18,${f3(0.35*l)})`});
});
jt({at:B(24.5),out:K_MOD,y:64,size:60,words:['Decision','to',{t:'action.',g:1}],ar:'من القرار إلى التنفيذ.',arSize:36});

/* ================= k32-40 a statement over a rising horizon lens ================= */
jt({at:B(32.5),out:K_BR,y:380,size:76,step:S16*1.5,words:['Every','system.','\n',{t:'One',g:1},{t:'living',g:1},{t:'model.',g:1}],ar:'كل الأنظمة… نموذج حيّ واحد.',arSize:40});

/* ================= k40-48 the breath, held through the track's break (k44-47) ================= */
jt({at:B(40.3),out:K_HIT,y:352,size:92,words:['One','operational','\n','nervous',{t:'system.',g:1}],ar:'جهاز عصبي تشغيلي واحد لشركتك.',arSize:44});

/* ================= k48-57 the end: on the hit a capsule blooms round "Book your demo.", then the URL ================= */
jt({at:K_HIT+0.25,out:B(51.4),y:466,size:64,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:40,fade:[B(50.75),B(51.35)]}).style.zIndex='2';   // over the capsule
const CAP=M.el('div','jcap','<span>marsadnasl.com</span>',TXT), capT=CAP.firstChild;
const MKE=M.el('img','jmk',null,TXT);MKE.src='assets_logo_m.png';
const BOOK=M.el('div','jbook',`<span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span>`,TXT);
const FTR=M.el('div','jft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',TXT);
M.track(t=>{
  const on=t>=K_HIT;[CAP,MKE,BOOK,FTR].forEach(e=>show(e,on));if(!on)return;
  const pin=dec(t,K_HIT,K_HIT+0.55), ps=dec(t,B(50.75),B(51.75)+0.3), k=1-ps;
  const w=lerp(lerp(420,1320,pin),760,ps), h=lerp(lerp(300,380,pin),150,ps), cy=lerp(540,560,dec(t,B(52),B(53)));
  st(CAP,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(960-w/2)}px,${f1(cy-h/2)}px)`,opacity:f3(P(t,K_HIT,K_HIT+0.3)),
    boxShadow:`inset 0 0 0 2px rgba(255,215,250,0.95),inset 0 0 ${f1(16+12*k)}px ${f1(5+5*k)}px rgba(214,70,240,0.85),`+
      `inset 0 0 ${f1(46+54*k)}px ${f1(14+20*k)}px rgba(110,30,200,0.55),0 0 ${f1(26+16*k)}px 3px rgba(214,70,240,0.5),0 0 ${f1(70+40*k)}px 10px rgba(122,40,220,0.3)`});
  const pt=dec(t,B(51.55),B(51.55)+0.5);st(capT,{opacity:f3(pt),filter:pt<1?`blur(${f2((1-pt)*8)}px)`:'none'});
  const pm=dec(t,B(52),B(52)+0.8);st(MKE,{opacity:f3(pm),transform:`translate(865px,${f1(262+(1-pm)*16)}px) scale(${f3(0.92+0.08*pm)})`});
  const pb=dec(t,B(52.5),B(52.5)+0.7);st(BOOK,{top:'700px',opacity:f3(pb),transform:`translateY(${f1((1-pb)*14)}px)`});
  st(FTR,{opacity:f3(0.55*dec(t,B(53),B(53)+0.8))});
});
M.punch(K_TURN,{amp:0.015});                // the two big hits only
M.punch(K_HIT,{amp:0.015});
M.start();
