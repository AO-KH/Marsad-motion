/* Marsad — style sample: Jupiter Exchange, v2 (films/style-jupiter). The Marsad film told in the grammar of Jupiter's
   launch video (the client's reference 03_JupiterExchange.mp4): near-black; big lenses with dark bodies and bright rims
   (Jupiter's are navy to lime; here Marsad's indigo, violet, magenta and pink); medium-weight white type with grey and
   gradient words; the app's parts in perspective with glowing rims; a carousel under a glowing dome; rings; two lenses
   joining; the URL in a glowing capsule; the mark.
   v2, at the client's request: a slower pace (scenes of 4-10 beats, not 2) and more in each frame (dust, the sources and
   the company's files adrift, the waiting chat, the tiles flying into the mark, orbits, the loop's pills joined, the
   carousel flowing into the Knowledge Map, a real recommendation, the Decisions counters, six defence rings with their
   layers, the Assistant answering). It follows the 63 s film's story and lines. v1 (28.6 s) is in git history (80af6f8).
   The music is the client's choice (after v2).
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects only on the transitions.
   Music: "Joyful Rhythm Walk Funk" by lightbeatsmusic (Pixabay #513936, supplied by the client; fit/lightbeats-joyful-rhythm-
   walk-funk.mp3), 115 BPM, downbeat 0.538 s. film.json "edit" (song beats): 0-15 and 8-15 (the intro, its second half
   twice), 16-47 (groove A from film k24), 64-95 (groove B, film k56), 48-63 (groove A's last phrase, ending in the
   track's own one-bar break on film k100-103) and 64-75 (the hit on film k104, then the fade). B(k) = k x 0.5217 s.
   v2 was first cut on "Movement" (86 beats); its scenes were mapped onto this grid scene by scene, each a little longer.
     k0-10    sources   three lenses drift apart; the source tiles and the company's files adrift in depth;
                        "Your company's data is everywhere."
     k10-24   waiting   the lenses turn grey; a team chat waits for an answer; "When you need a quick answer, your system
                        makes you wait."; the tiles and files fly into the centre
     k24-34   the turn  (the groove starts) the mark lands and a lens bursts out of it; orbits; "Marsad / changes that."
     k34-40   the loop  Connect · Unify · Monitor · Act light up one by one over a rising horizon; "One workflow. Fully
                        automated."
     k40-50   the model the source tiles turn on an arc under a glowing dome, "Every system."; they rise into the dome and
                        the Knowledge Map's objects and links turn around the mark; "One living model."
     k50-60   pulse     Business Pulse in perspective, "Real-time recommendations"; on groove B (k56) a white lens with a
                        real recommendation, "From your own numbers."
     k60-70   decide    the Decisions counters and card settle; the cursor clicks «موافقة» (k65): executed, PO-2291;
                        approved 0 -> 1, under review 6 -> 5; "Decision to action." / "Nothing in between."
     k70-80   shield    six rings snap in around the mark with their layers; "Defense in depth. Sovereign. PDPL-compliant."
     k80-96   Arabic    «بالعربية», huge; then the Assistant: the Arabic question typed and sent, the answer streamed from
                        the data with its source chip; "The answer comes from your original data."
     k96-104  breath    "One operational nervous system.", held through the track's break (k100-103)
     k104-116 end       on the hit two lenses join, "Book your demo."; they squash into a glowing capsule, marsadnasl.com;
                        the mark; "Book your demo · احجز عرضك التجريبي"
   Truth: the Business Pulse page and recommendation, the Decisions counters, card and toast, the Knowledge Map's objects
   and link names, the Assistant's name, input and placeholder, and the file names (the Projects page) are the app's own
   (site kit, site_pages/). The team chat, the question and its answer, the six layers and the tiles flying into the mark
   are the 63 s film's renderings. The lenses, rings, orbits and capsule are the reference's grammar. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;
const NS='http://www.w3.org/2000/svg';
function sv(parent,tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);parent.appendChild(e);return e;}
function svgLayer(parent){const s=document.createElementNS(NS,'svg');s.setAttribute('class','jp-svg');s.setAttribute('width',1920);s.setAttribute('height',1080);parent.appendChild(s);return s;}
const GLOW=`<filter id="jglw" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

const K_TURN=B(24), K_LOOP=B(34), K_SYS=B(40), K_PUL=B(50), K_NUM=B(56), K_DEC=B(60), K_SHD=B(70), K_AR=B(80), K_ASK=B(83),
  K_BR=B(96), K_END=B(104);
window.CUTS=[K_LOOP,K_SYS,K_PUL,K_NUM,K_DEC,K_SHD,K_AR,K_ASK,K_BR,K_END];     // hard cuts; k10 and k24 are continuous

/* ---------------- the stage: near black, drifting dust, lenses painted on a canvas ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','jp-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
// a lens: dark body, the rim brightening from indigo through violet and magenta to pink-white (Jupiter: navy, teal, lime)
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
const RIM_G=[[0,'#07070A'],[0.5,'#0B0B10'],[0.7,'#14141B'],[0.82,'#22222B'],[0.91,'#3A3946'],[0.965,'#6A6876'],[0.99,'#AFADB9'],[1,'#D2D0DA']];   // the old way: grey
const RIM_B=[[0,'#FBF8FD'],[0.5,'#F5EDFB'],[0.7,'#EAD5F8'],[0.83,'#DAA4F3'],[0.92,'#BB4DE7'],[0.975,'#6A1DB8'],[1,'#240B4F']];   // the bright one
const RING=[[0,'rgba(0,0,0,0)'],[0.78,'rgba(40,12,90,0)'],[0.9,'rgba(90,26,170,0.35)'],[0.96,'rgba(180,55,230,0.75)'],[0.99,'rgba(255,160,240,0.95)'],[1,'rgba(255,215,250,0.6)']];
const mixPal=u=>RIM.map(([s,c],i)=>{const a=hex(c),b=hex(RIM_G[i][1]);return [s,`rgb(${a.map((v,j)=>Math.round(v+(b[j]-v)*u)).join(',')})`];});
const mixGlow=u=>[206,64,240].map((v,j)=>Math.round(v+([150,148,160][j]-v)*u)).join(',');
// the lit side: the gradient's inner point sits (lx, ly) x r from the centre, so the rim is widest on the opposite side
function lens(x,y,r,o={}){
  const a=o.a??1, lx=(o.lx??0.18)*r, ly=(o.ly??-0.2)*r, gc=o.gc??'206,64,240';
  if((o.glow??1)>0){const og=g.createRadialGradient(x,y,r*0.97,x,y,r*1.16);
    og.addColorStop(0,`rgba(${gc},${f3(0.32*a*(o.glow??1))})`);og.addColorStop(1,`rgba(${gc},0)`);
    g.fillStyle=og;g.beginPath();g.arc(x,y,r*1.16,0,2*Math.PI);g.fill();}
  const gr=g.createRadialGradient(x+lx,y+ly,0,x,y,r);for(const [s,c] of (o.pal??RIM))gr.addColorStop(s,c);
  g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fill();g.globalAlpha=1;
}
function ring(x,y,r,a){g.globalCompositeOperation='screen';lens(x,y,r,{pal:RING,a,glow:0.5,lx:0.1,ly:0.12});g.globalCompositeOperation='source-over';}
// two lenses joined: both rims, then both bodies again (0.93 r) over the inner rims, so only the outline glows; overlap
// them by a good third of r, or the inner rims show near the middle
function lens2(x1,x2,y,r,a){
  lens(x1,y,r,{a,lx:0.12,ly:0.2});lens(x2,y,r,{a,lx:-0.12,ly:0.2});
  for(const [x,lx] of [[x1,0.12],[x2,-0.12]]){const R=r*0.93,gr=g.createRadialGradient(x+lx*r,y+0.2*r,0,x,y,R);   // RIM's stops, rescaled to 0.93 r
    gr.addColorStop(0,'#06050E');gr.addColorStop(0.538,'#0A0717');gr.addColorStop(0.753,'#150A31');gr.addColorStop(0.882,'#2F1068');
    gr.addColorStop(0.97,'#5A1CA8');gr.addColorStop(1,'rgba(90,28,168,0)');
    g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,2*Math.PI);g.fill();g.globalAlpha=1;}
}
function haze(x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);gr.addColorStop(1,`rgba(${c},0)`);
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
// the six defence rings (k70-80): a glowing stroke each, two of them dashed; a light sweeping the outer one
const SC={x:600,y:618}, SR=i=>112+46*i;
function shieldRings(t){
  const seal=dec(t,B(74.375),B(74.375)+0.25)*(1-io(t,B(74.375)+0.25,B(74.375)+1.1));
  for(let i=0;i<6;i++){const t0=B(70.625+0.625*i),p=dec(t,t0,t0+0.55);if(p<=0.002)continue;
    const r=SR(i)*(1.12-0.12*p);g.save();g.globalAlpha=p;g.setLineDash(i===1||i===3?[12,14]:[]);g.lineDashOffset=-(t*18*(i%2?-1:1));
    g.strokeStyle='rgba(206,64,240,0.28)';g.lineWidth=10;g.beginPath();g.arc(SC.x,SC.y,r,0,2*Math.PI);g.stroke();
    g.strokeStyle=i===5?'#FFD9FA':'#F2B4FF';g.lineWidth=(i===5?3:2.2)+1.6*seal;g.shadowColor='rgba(222,13,255,0.9)';g.shadowBlur=14;
    g.beginPath();g.arc(SC.x,SC.y,r,0,2*Math.PI);g.stroke();g.restore();}
  const pw=dec(t,B(74.375),B(74.375)+0.6);if(pw>0.002){const a0=(t-B(74.375))*1.5-1.2;g.save();g.globalAlpha=0.9*pw;
    g.strokeStyle='#FFE6FF';g.lineWidth=4.5;g.lineCap='round';g.shadowColor='rgba(222,13,255,1)';g.shadowBlur=18;
    g.beginPath();g.arc(SC.x,SC.y,SR(5),a0,a0+0.42);g.stroke();g.restore();}
}
M.track(t=>{
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
  if(t<K_LOOP){                            // three lenses drift apart and turn grey (k10); on k24 a lens bursts out of the mark
    const u=P(t,0,K_TURN), pa=dec(t,0.05,1.3), gy=io(t,B(9.25),B(11.4)), pal=mixPal(gy), gc=mixGlow(gy), out=1-P(t,K_TURN-0.05,K_TURN+0.55);
    if(out>0.002){
      lens(170-110*u,700+30*u,500,{a:pa*out,lx:0.2,ly:-0.1,pal,gc});lens(1780+90*u,560-20*u,540,{a:pa*out,lx:-0.2,ly:-0.1,pal,gc});
      lens(960+60*u,250-60*u,600*(1.05-0.08*u),{a:pa*out,lx:0.12,ly:-0.3,pal,gc});
    }
    if(t>=K_TURN){const pb=ez.outC(P(t,K_TURN,K_TURN+0.9));lens(960,540,lerp(40,1010,pb)-14*P(t,K_TURN+0.9,K_LOOP),{lx:-0.05,ly:-0.12});
      orbits(t,P(t,K_TURN+0.5,K_TURN+1.6));}
    dust(t,1);
  }else if(t<K_SYS){lens(960,2285-40*P(t,K_LOOP,K_SYS),1500,{lx:0,ly:-0.1});dust(t,0.9);
  }else if(t<K_PUL){lens(960,210,850,{lx:0,ly:-0.32});dust(t,0.8);
  }else if(t<K_NUM){haze(960,760,1000,'150,40,220',0.32);dust(t,1);
  }else if(t<K_DEC){lens(960,540,1100,{pal:RIM_B,glow:0,lx:0,ly:0});
  }else if(t<K_SHD){lens(960,2330,1420,{lx:0,ly:-0.1});haze(960,560,760,'150,40,220',0.14);dust(t,0.9);
  }else if(t<K_AR){const u=t-K_SHD;for(let i=-1;i<7;i++){ring(i*340+170-u*18,1215,330,0.32);ring(i*300-60+u*22,1120,250,0.2);}
    shieldRings(t);dust(t,0.9);
  }else if(t<K_ASK){dust(t,0.7);
  }else if(t<K_BR){lens(960,640,780,{lx:0.1,ly:-0.25});dust(t,0.8);
  }else if(t<K_END){lens(960,2600,1650,{a:0.55,lx:0,ly:-0.1});dust(t,0.8);
  }else{                                   // two lenses join on the hit, hold, then squash into the capsule and go
    const pj=dec(t,K_END,K_END+0.9), sq=io(t,B(107.5),B(108.5)+0.15), a=1-P(sq,0.55,1);
    if(a>0.002){const dx=lerp(lerp(640,380,pj),290,sq);
      g.save();g.translate(960,540);g.scale(1-0.2*sq,1-0.75*sq);lens2(-dx,dx,0,470,a);g.restore();}
    dust(t,0.6);
  }
});

/* ---------------- type: words blur in (they keep their places, as in the reference), the Arabic after them ---------------- */
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
const mark=(parent,w)=>{const e=M.el('div','jmark',`<img class="gl" src="assets_logo_m.png"><img class="m" src="assets_logo_m.png">`,parent);
  st(e,{width:w+'px',height:f1(w*1637/2145)+'px'});return {e,m:e.querySelector('.m'),gl:e.querySelector('.gl')};};

/* ================= k0-24 the sources and the files adrift; the grey wait; they fly into the centre ================= */
const SH1=M.el('div','jp-shot',null,SCN), D1=M.el('div','jp-3d',null,SH1);
const MK={x:960,y:540};                  // where the mark lands on k24
const TL=[{x:300,y:230,z:-80,rx:-8,ry:18,slot:3},{x:760,y:150,z:-340,rx:-12,ry:8,slot:0},{x:1210,y:170,z:-60,rx:-10,ry:-10,slot:6},
  {x:1660,y:260,z:-240,rx:-6,ry:-20,slot:2},{x:250,y:830,z:-200,rx:10,ry:20,slot:5},{x:700,y:910,z:-60,rx:14,ry:10,slot:1},
  {x:1200,y:890,z:-300,rx:12,ry:-8,slot:7},{x:1680,y:810,z:-40,rx:8,ry:-18,slot:4}]
  .map((p,i)=>({...p,i,t0:B(0.3125+0.3125*i),ta:B(20.9375+0.4375*p.slot),el:M.el('div','k-tile m-glass',K.tile(K.TILES[i]),D1)}));
const FL=[['invoices_q3.xlsx',560,330,-120],['branch_returns.csv',1360,318,-260],['po_2291.pdf',600,730,-200],['suppliers_2025.xlsx',1330,712,-90]]
  .map(([n,x,y,z],j)=>({x,y,z,rx:0,ry:0,i:8+j,t0:B(1.875+0.625*j),ta:B(21.1562+0.875*j),
    el:M.el('div','jf',`${SK.ic('file',22,'#D9B8FF',2)}<span>${n}</span>`,D1)}));
function driftBase(p,t,w,h){             // adrift, then back into the dark behind the chat (k9.25-11.7)
  const pe=dec(t,p.t0,p.t0+1.1), pr=io(t,B(9.25),B(11.4));
  return {x:p.x+18*Math.sin(2*Math.PI*t/11+p.i*1.7), y:p.y+12*Math.cos(2*Math.PI*t/13+p.i*1.1), z:p.z-160*(1-pe)-520*pr,
    o:pe*(1-0.6*pr), bl:Math.min(10,Math.abs(p.z+150)/60)*(1-pr)+(1-pe)*10+2.4*pr, rx:p.rx+3*Math.sin(t*0.5+p.i), ry:p.ry+4*Math.sin(t*0.4+p.i*0.7)};
}
const drifters=[...TL.map(p=>({p,w:112,h:112,s:1.3})),...FL.map(p=>({p,w:0,h:48,s:1}))];
M.track(t=>{
  if(!show(SH1,t<K_TURN+0.1))return;
  for(const {p,w,h,s} of drifters){
    const on=t>=p.t0-0.02&&t<p.ta+0.02;p.el.style.display=on?'':'none';if(!on)continue;
    const W=w||(p.W??=p.el.offsetWidth);
    let q=driftBase(p,t,W,h),sc=s;
    const f0=p.ta-0.85,u=P(t,f0,p.ta);
    if(u>0){                              // the pull: a curved flight into the mark, faster and smaller as it arrives
      const a=driftBase(p,f0,W,h),e=ez.inC(u),dx=MK.x-a.x,dy=MK.y-a.y,d=Math.hypot(dx,dy)||1,sw=150*Math.sin(Math.PI*u);
      q={x:lerp(a.x,MK.x,e)-dy/d*sw, y:lerp(a.y,MK.y,e)+dx/d*sw, z:lerp(a.z,0,e), o:Math.min(1,a.o+u*2.2)*(1-P(u,0.8,1)),
        bl:a.bl*(1-u), rx:a.rx*(1-e), ry:a.ry*(1-e)};
      sc=lerp(s,0.3,e);
    }
    st(p.el,{opacity:f3(q.o),filter:q.bl>0.3?`blur(${f2(q.bl)}px)`:'none',transform:T3(q.x,q.y,W,h,{z:q.z,rx:q.rx,ry:q.ry,s:sc})});
  }
});
jt({at:B(1.25),out:B(9.875),y:432,size:84,words:['Your',"company's",'data',{t:'is',d:1},{t:'everywhere.',d:1}],ar:'بيانات شركتك مبعثرة في كل مكان.',fade:[B(9),B(9.875)]});

// the waiting team chat (dull: a grey edge, no glow), with its clock running
const chat=M.el('div','ch-card',`<div class="hd"><i></i><span>TEAM CHAT&nbsp;&nbsp;·&nbsp;&nbsp;MONDAY 09:12</span></div>`+
  `<div class="q">Where are we on Q2 numbers?</div><div class="ty"><i></i><i></i><i></i></div>`+
  `<div class="wt"><span>WAITING</span><b>·</b><span class="n">00:47</span></div><div class="wb"><i></i></div>`,D1);
st(chat,{width:'720px',height:'420px'});
const cQ=chat.querySelector('.q'),cTy=chat.querySelector('.ty'),cDots=[...cTy.children],cWt=chat.querySelector('.wt'),cN=chat.querySelector('.n'),
  cWb=chat.querySelector('.wb'),cWf=chat.querySelector('.wb i');
const T_CIN=B(10.525), T_COUT=B(20.5);
M.track(t=>{
  const on=t>=T_CIN-0.02&&t<T_COUT+0.9;chat.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_CIN,T_CIN+1.2), x=inc(t,T_COUT,T_COUT+0.85);
  st(chat,{opacity:f3(pe*(1-x)),filter:x>0?`blur(${f2(10*x)}px)`:'none',
    transform:T3(1360,570+(1-pe)*320+x*300,720,420,{rx:lerp(30,6,pe)+22*x,ry:-16+4*P(t,T_CIN,T_COUT)})});
  const pq=dec(t,B(11.575),B(11.575)+0.55);st(cQ,{opacity:f3(pq),transform:`translateY(${f1((1-pq)*16)}px) scale(${f3(0.92+0.08*pq)})`});
  cTy.style.opacity=f3(dec(t,B(12.8),B(12.8)+0.45));
  cDots.forEach((d,i)=>d.style.transform=`translateY(${f1(-6*Math.max(0,Math.sin(2*Math.PI*2.3*t-i*0.9)))}px)`);   // 2.3 Hz: off the beat
  const pw=dec(t,B(13.5),B(13.5)+0.55);cWt.style.opacity=f3(pw);cWb.style.opacity=f3(pw);
  cN.textContent='00:'+(47+[14.375,16.125,17.875,19.625,21.375].filter(k=>FQ(t)>=B(k)).length);
  st(cWf,{width:f1(648*lerp(0.18,0.74,P(t,B(13.5),B(20.5))))+'px'});
});
jt({cls:'left',x:130,w:900,at:B(11.4),out:B(22.075),y:318,size:60,step:S16*1.5,
  words:['When','you','need','a','quick','answer,','\n',{t:'your',d:1},{t:'system',d:1},{t:'makes',d:1},{t:'you',d:1},{t:'wait.',d:1}],
  ar:'حين تحتاج إجابة سريعة، يجعلك نظامك تنتظر.',arSize:36,fade:[B(20.85),B(22.075)]});

/* ================= k24-34 the turn: the mark lands, a lens bursts out of it; "Marsad / changes that." ================= */
const MKe=mark(SCN,300);
const T_UP=B(25.625);
M.track(t=>{
  const on=t>=B(21.375)&&t<K_LOOP;MKe.e.style.display=on?'':'none';if(!on)return;
  // lands on the hit: in over 0.75 s with a 3% overshoot; its own glow gathers with the tiles, blooms and settles
  const p=P(t,K_TURN,K_TURN+0.75), sc=t<K_TURN?0.86:0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  const pu=io(t,T_UP,T_UP+1.1), x=lerp(MK.x,960,pu), y=lerp(MK.y,232,pu), s=sc*lerp(1,0.5,pu);
  st(MKe.e,{transform:`translate(${f1(x-150)}px,${f1(y-114.5)}px) scale(${f3(s)})`,opacity:f3(t<K_TURN?0:ez.dec(Math.min(1,p*1.6)))});
  const pre=0.35*io(t,B(21.375),K_TURN), bloom=0.9*dec(t,K_TURN,K_TURN+0.3)*(1-0.55*io(t,K_TURN+0.4,K_TURN+2));
  MKe.gl.style.opacity=f3(t<K_TURN?pre:Math.max(bloom,0.35*(1-dec(t,K_TURN,K_TURN+0.3))));
  if(t<K_TURN){MKe.e.style.opacity='1';MKe.m.style.opacity='0';}else MKe.m.style.opacity='1';
});
const HR=M.el('div','jh',null,TXT);
const hE=[M.el('span','big e','Marsad',HR),M.el('span','big e','Marsad',HR)], hM=M.el('span','big m','Marsad',HR),
  hSm=M.el('span','sm','changes that.',HR), hAr=M.el('span','ar','مرصد يغيّر المعادلة.',HR);
let HW=0;
M.track(t=>{
  if(!show(HR,inShot(t,B(26.5),K_LOOP)))return;
  if(!HW)HW=hM.offsetWidth;
  const X0=960-HW/2, Y0=388, push=1+0.03*P(t,B(26.5),K_LOOP);
  HR.style.transformOrigin='960px 540px';HR.style.transform=`scale(${f3(push)})`;
  // the big word slides in from the left; two grey copies trail it and stay as a slight extrude
  const sx=t0=>-300*(1-dec(t,B(26.75)+t0,B(26.75)+t0+0.9)), pb=dec(t,B(26.75),B(26.75)+0.35);
  st(hM,{transform:`translate(${f1(X0+sx(0))}px,${Y0}px)`,opacity:f3(pb)});
  hE.forEach((e,i)=>st(e,{transform:`translate(${f1(X0+sx(0.08*(i+1))-9*(i+1))}px,${f1(Y0+3*(i+1))}px)`,opacity:f3(pb*(0.75-0.3*i))}));
  const ps=dec(t,B(28.25),B(28.25)+0.55);st(hSm,{left:f1(X0+HW-hSm.offsetWidth)+'px',top:'704px',opacity:f3(ps),filter:ps<1?`blur(${f2((1-ps)*10)}px)`:'none'});
  const pa=dec(t,B(29.25),B(29.25)+0.55);st(hAr,{left:f1(X0+4)+'px',top:'706px',opacity:f3(pa),filter:pa<1?`blur(${f2((1-pa)*10)}px)`:'none'});
});

/* ================= k34-40 the loop: four steps light up one by one, joined by a line ================= */
const PL=[['link','Connect','اربط'],['merge','Unify','وحّد'],['pulse','Monitor','راقب'],['check','Act','نفّذ']];
const SH4=M.el('div','jp-shot',null,TXT);
const lsv=svgLayer(SH4);
lsv.innerHTML=`<defs><linearGradient id="jlg" gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="1620" y2="0"><stop offset="0" stop-color="#8E32C3"/><stop offset="0.5" stop-color="#F29BFF"/><stop offset="1" stop-color="#8E6BFF"/></linearGradient>${GLOW}</defs>`;
const lLine=sv(lsv,'line',{y1:662,y2:662,stroke:'url(#jlg)','stroke-width':3,'stroke-linecap':'round',filter:'url(#jglw)'}), lDot=sv(lsv,'circle',{r:6,cy:662,fill:'#FFD9FF',filter:'url(#jglw)'});
const PLS=M.el('div','jpills',PL.map(([ic,en,ar])=>`<span class="jpill">${SK.ic(ic,40,'currentColor',2.2)}<span class="en">${en}</span><span class="ar">${ar}</span></span>`).join(''),SH4);
st(PLS,{top:'610px'});
const plEls=[...PLS.children];let PX=null;
M.track(t=>{
  if(!show(SH4,inShot(t,K_LOOP,K_SYS)))return;
  if(!PX)PX=plEls.map(e=>e.offsetLeft+e.offsetWidth/2);
  const pe=dec(t,K_LOOP,K_LOOP+0.4);PLS.style.opacity=f3(pe);PLS.style.transform=`translateY(${f1((1-pe)*20)}px)`;
  const T=[B(34.6),B(35.5),B(36.4),B(37.3)];
  plEls.forEach((e,i)=>e.classList.toggle('on',FQ(t)>=T[i]));
  const pl=P(t,T[0],T[3]+0.2);lLine.setAttribute('x1',f1(PX[0]));lLine.setAttribute('x2',f1(lerp(PX[0],PX[3],pl)));lLine.setAttribute('opacity',f3(pe*P(t,T[0],T[0]+0.2)));
  const u=((t-B(37.6))/1.6)%1, dOn=t>=B(37.6);lDot.setAttribute('opacity',f3(dOn?Math.sin(Math.PI*u)*dec(t,B(37.6),B(37.6)+0.3):0));
  if(dOn)lDot.setAttribute('cx',f1(lerp(PX[0],PX[3],u)));
});
jt({at:B(35.8),out:K_SYS,y:318,size:76,words:['One','workflow.','Fully',{t:'automated.',g:1}],ar:'سير عمل واحد، مؤتمت بالكامل.'});

/* ================= k40-50 every system: the carousel under the dome; it rises into the Knowledge Map ================= */
const SH5=M.el('div','jp-shot',null,SCN);
const CAR=[...Array(10).keys()].map(i=>({i,el:M.el('div','k-tile m-glass',K.tile(K.TILES[(i+2)%8]),SH5)}));
const carPos=(c,t)=>{const th=90+27.5-c.i*6.1-2.4*(t-K_SYS), r=th*Math.PI/180;return {x:960+2250*Math.cos(r),y:-1300+2250*Math.sin(r),th};};
const GC={x:960,y:432};
const gsv=svgLayer(SH5);gsv.innerHTML=`<defs>${GLOW}</defs>`;
const KG=[['عميل','Customer','#DB4E11',120],['فاتورة','Invoice','#17A186',60],['بند فاتورة','Invoice line','#CC0C74',10],['منتج','Product','#149BB0',-40],
  ['ملاحظة','Note','#D0730C',170],['موظف','Employee','#CE730B',220],['مدينة','City','#16A286',270]].map(([ar,en,col,a],i)=>({ar,en,col,a,i,t0:B(45.875+0.3125*i)}));
const KE=[[0,1,'صادرة إلى'],[1,2,'تحتوي بند'],[3,2,'المنتج'],[0,4,'يذكر'],[0,5,'مدير الحساب'],[0,6,'يقع في']].map(([a,b,l],j)=>({a,b,l,j,t0:B(46.875+0.375*j)}));
KG.forEach(n=>{n.sp=sv(gsv,'line',{stroke:'#BC59D1','stroke-width':1.6,'stroke-dasharray':'5 7',opacity:0});});
KE.forEach(e=>{e.ln=sv(gsv,'line',{stroke:'#E3C9FF','stroke-width':2.2,'stroke-linecap':'round',filter:'url(#jglw)',opacity:0});
  e.dot=sv(gsv,'circle',{r:4,fill:'#FFE0FF',filter:'url(#jglw)',opacity:0});});
KG.forEach(n=>{n.el=M.el('div','gn',`<i style="background:${n.col};box-shadow:0 0 0 5px ${n.col}33,0 0 16px ${n.col};"></i><span class="ar">${n.ar}</span><span class="en">${n.en}</span>`,SH5);});
KE.forEach(e=>{e.el=M.el('div','gl-lb',e.l,SH5);});
const HUB=mark(SH5,150);
const proj=(a,th)=>{const r=(a+th)*Math.PI/180,z=-220*Math.sin(r);return {x:GC.x+480*Math.cos(r),y:GC.y+170*Math.sin(r),z,s:1500/(1500+z)};};
M.track(t=>{
  if(!show(SH5,inShot(t,K_SYS,K_PUL)))return;
  const pe=dec(t,K_SYS,K_SYS+0.7);
  for(const c of CAR){                    // on a wide arc, turning slowly; from k44.25 each rises into the dome's centre
    const q=carPos(c,t), t0=B(44.25)+c.i*0.1, u=P(t,t0,t0+0.8);
    let x=q.x,y=q.y+(1-pe)*120,s=1.75,rot=q.th-90,o=pe;
    if(u>0){const a=carPos(c,t0),e=ez.inC(u);x=lerp(a.x,GC.x,e)+120*Math.sin(Math.PI*u)*(a.x<GC.x?-1:1);y=lerp(a.y,GC.y,e);s=lerp(1.75,0.25,e);rot=(a.th-90)*(1-e);o=1-P(u,0.7,1);}
    c.el.style.display=o>0.002?'':'none';
    st(c.el,{opacity:f3(o),transform:`translate(${f1(x-56)}px,${f1(y-56)}px) rotate(${f2(rot)}deg) scale(${f3(s)})`});
  }
  const th=-12+26*P(t,B(45),K_PUL), pos=KG.map(n=>proj(n.a,th));
  const ph=dec(t,B(45.375),B(45.375)+0.7);
  st(HUB.e,{opacity:f3(ph),transform:`translate(${f1(GC.x-75)}px,${f1(GC.y-57)}px) scale(${f3(0.8+0.2*ph)})`});
  HUB.gl.style.opacity=f3(0.85*dec(t,B(46.75),B(46.75)+0.3)*(1-0.5*io(t,B(47.125),B(49)))+0.2*ph);
  KG.forEach((n,i)=>{const q=pos[i],p=dec(t,n.t0,n.t0+0.65);
    st(n.el,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*10)}px)`:'none',zIndex:String(Math.round(1000-q.z)),
      transform:`translate(${f1(q.x)}px,${f1(q.y)}px) translate(-50%,-50%) scale(${f3(q.s*(0.85+0.15*p))})`});
    const pl=dec(t,n.t0,n.t0+0.5);
    n.sp.setAttribute('x1',GC.x);n.sp.setAttribute('y1',GC.y);n.sp.setAttribute('x2',f1(lerp(GC.x,q.x,pl)));n.sp.setAttribute('y2',f1(lerp(GC.y,q.y,pl)));
    n.sp.setAttribute('opacity',f3(0.7*pl));});
  KE.forEach(e=>{const A=pos[e.a],Bq=pos[e.b],p=dec(t,e.t0,e.t0+0.5),pl=dec(t,e.t0+S8,e.t0+S8+0.55);
    e.ln.setAttribute('x1',f1(A.x));e.ln.setAttribute('y1',f1(A.y));e.ln.setAttribute('x2',f1(lerp(A.x,Bq.x,p)));e.ln.setAttribute('y2',f1(lerp(A.y,Bq.y,p)));
    e.ln.setAttribute('opacity',f3(0.85*p));
    st(e.el,{opacity:f3(pl),transform:`translate(${f1((A.x+Bq.x)/2)}px,${f1((A.y+Bq.y)/2)}px) translate(-50%,-50%) scale(${f3(0.9+0.1*pl)})`});
    const t1=e.t0+0.6;if(t>=t1){const u=((t-t1)/1.9+e.j*0.17)%1;e.dot.setAttribute('cx',f1(lerp(A.x,Bq.x,u)));e.dot.setAttribute('cy',f1(lerp(A.y,Bq.y,u)));
      e.dot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*dec(t,t1,t1+0.4)));}else e.dot.setAttribute('opacity','0');});
});
jt({at:B(40.5),out:B(45),y:392,size:76,words:['Every',{t:'system.',g:1}],ar:'كل الأنظمة.',fade:[B(44),B(45)]});
jt({at:B(48),out:K_PUL,y:760,size:76,words:['One','living',{t:'model.',g:1}],ar:'نموذج حيّ واحد.'});

/* ================= k50-56 Business Pulse in perspective, pulling back and up ================= */
const SH6=M.el('div','jp-shot',null,SCN), D6=M.el('div','jp-3d',null,SH6);
const UI=M.el('div','jp-ui',`<img src="site_pages/pulse.png">`,D6);
M.track(t=>{
  if(!show(SH6,inShot(t,K_PUL,K_NUM)))return;
  const u=io(t,K_PUL,K_NUM), pe=dec(t,K_PUL,K_PUL+0.6), ty=lerp(470,70,ez.dec(P(t,K_PUL,K_NUM)));
  st(UI,{opacity:f3(pe),transform:`translate3d(12px,${f1(10+ty)}px,${f1(lerp(-150,-780,u))}px) rotateX(${f2(lerp(66,16,u))}deg) rotateZ(${f2(lerp(-7,0,u))}deg)`});
});
jt({at:B(50.6),out:K_NUM,y:64,size:60,words:['Real-time',{t:'recommendations',g:1}],ar:'توصيات لحظية',arSize:34});

/* ================= k56-60 on groove B, a white lens: one real recommendation, "From your own numbers." ================= */
const SH6b=M.el('div','jp-shot',null,SCN), D6b=M.el('div','jp-3d',null,SH6b);
const tp=document.createElement('div');tp.innerHTML=SK.pulseContent({id:'jpPulse'});
const row0=tp.querySelector('#recRows').children[0];
st(row0,{position:'absolute',left:'0',top:'0',right:'auto',width:'1535px',height:'118px'});
const RW=M.el('div','jp-card soft',null,D6b);st(RW,{width:'1535px',height:'118px'});M.el('div','site m-site',null,RW).appendChild(row0);
const okPill=row0.querySelector('.sk-pill.ok');
M.track(t=>{
  if(!show(SH6b,inShot(t,K_NUM,K_DEC)))return;
  const pe=dec(t,K_NUM+0.1,K_NUM+0.8), u=P(t,K_NUM,K_DEC);
  st(RW,{opacity:f3(pe),filter:pe<1?`blur(${f2((1-pe)*8)}px)`:'none',transform:T3(960,652+(1-pe)*60,1535,118,{rx:lerp(14,4,u),s:0.82*(1+0.03*u)})});
  const gp=dec(t,B(57.8667),B(57.8667)+0.35)*(1-io(t,B(57.8667)+0.5,B(57.8667)+1.6));
  okPill.style.boxShadow=gp>0.002?`0 0 ${f1(26*gp)}px rgba(11,132,71,${f3(0.6*gp)}),0 0 0 ${f2(2*gp)}px rgba(11,132,71,${f3(0.5*gp)})`:'';
});
jt({at:K_NUM+0.05,out:K_DEC,y:300,size:84,cls:'dark',step:S16*1.5,words:['From','your','own','numbers.'],ar:'مبنية على أرقامك — بلا اختلاق.',arSize:42});

/* ================= k60-70 decide: the counters and the card settle; the cursor clicks «موافقة» ================= */
const SH7=M.el('div','jp-shot',null,SCN), D7=M.el('div','jp-3d',null,SH7);
const td=document.createElement('div');td.innerHTML=SK.decContent({id:'jpDec'});
const dcard=td.querySelector('#decCard'),toast=td.querySelector('#toast'),btn=dcard.querySelector('#btnOK'),stats=td.querySelector('#stats');
[dcard,toast].forEach(e=>{e.removeAttribute('id');st(e,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'214px'});});
toast.style.display='flex';
const DW=M.el('div','jp-card',null,D7);st(DW,{width:'1402px',height:'214px'});M.el('div','site m-site',null,DW).append(dcard,toast);
stats.removeAttribute('id');st(stats,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'138px'});
const SW=M.el('div',null,null,D7);st(SW,{width:'1402px',height:'138px'});M.el('div','site m-site',null,SW).appendChild(stats);
const statEls=[...stats.children], nApp=statEls[2].querySelector('.n'), nRev=statEls[3].querySelector('.n');
statEls.forEach(e=>e.style.boxShadow='0 0 0 1.5px rgba(255,190,248,0.55),0 0 22px rgba(206,64,240,0.3)');
const CUR=M.el('div','jp-cur',`<svg viewBox="0 0 32 32" width="54" height="54"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#140B24" stroke-width="1.6" stroke-linejoin="round"/></svg>`,SH7);
const DS=0.9, DC={x:960,y:676}, SCy=462, OKB={x:DC.x+(1402-36-80-701)*DS,y:DC.y+(138+28-107)*DS}, T_FLAT=B(64.25), T_CL=B(65), T_CNT=B(66.25);
M.track(t=>{
  if(!show(SH7,inShot(t,K_DEC,K_SHD)))return;
  const pf=io(t,K_DEC,T_FLAT), pe=dec(t,K_DEC,K_DEC+0.6), ps=dec(t,K_DEC+0.15,K_DEC+0.75), push=1+0.025*P(t,T_CL,K_SHD);
  st(DW,{opacity:f3(pe),transform:T3(DC.x,DC.y+(1-pf)*70,1402,214,{z:-140*(1-pf),rx:24*(1-pf),ry:-14*(1-pf),s:DS*push})});
  st(SW,{opacity:f3(ps),transform:T3(960,SCy+(1-pf)*50,1402,138,{z:-200*(1-pf),rx:24*(1-pf),ry:-14*(1-pf),s:DS*push})});
  const pk=dec(t,T_CL+0.05,T_CL+0.4);dcard.style.opacity=f3(1-pk);toast.style.opacity=f3(pk);
  const press=Math.sin(Math.PI*P(t,T_CL-0.05,T_CL+0.18));btn.style.transform=`scale(${f3(1-0.05*press)})`;
  const pm=io(t,B(63),T_CL-0.08), out=io(t,T_CL+0.6,T_CL+1.3);
  st(CUR,{opacity:f3(dec(t,B(63),B(63)+0.35)*(1-out)),transform:`translate(${f1(lerp(1620,OKB.x,pm)+140*out-6)}px,${f1(lerp(1040,OKB.y,pm)+100*out-3)}px) scale(${f3(1-0.12*press)})`});
  const done=FQ(t)>=T_CNT;nApp.textContent=done?'1':'0';nRev.textContent=done?'5':'6';
  const gc=dec(t,T_CNT,T_CNT+0.4)*(1-io(t,T_CNT+0.9,T_CNT+2.4));
  statEls[2].style.boxShadow=`0 0 0 1.5px rgba(255,190,248,0.55),0 0 22px rgba(206,64,240,0.3)`+(gc>0.002?`,0 0 ${f1(36*gc)}px rgba(11,132,71,${f3(0.6*gc)}),inset 0 0 0 ${f2(2*gc)}px rgba(11,132,71,${f3(0.6*gc)})`:'');
});
jt({at:B(60.5),out:B(67.125),y:118,size:66,words:['Decision','to',{t:'action.',g:1}],ar:'من القرار إلى التنفيذ.',arSize:36,fade:[B(66.375),B(67.125)]});
jt({at:B(67.125),out:K_SHD,y:118,size:66,words:['Nothing','in',{t:'between.',g:1}],ar:'بلا خطوات بينهما.',arSize:36});

/* ================= k70-80 defence in depth: six rings snap in around the mark, with their layers ================= */
const SHD=M.el('div','jp-shot',null,TXT);
const LAYERS=[['ACCESS CONTROLS','التحكم بالوصول'],['DATA PROTECTION','حماية البيانات'],['NETWORK SECURITY','أمن الشبكة'],
  ['APPLICATION SECURITY','أمن التطبيقات'],['MONITORING & AUDIT','المراقبة والتدقيق'],['SOVEREIGN INFRASTRUCTURE','بنية تحتية سيادية']];
const LYR=LAYERS.map(([en,ar],i)=>{const r=SR(i),a=-2.36;
  const tag=M.el('div','sh-tag',`L0${i+1}`,SHD);st(tag,{left:f1(SC.x+r*Math.cos(a))+'px',top:f1(SC.y+r*Math.sin(a))+'px'});
  const row=M.el('div','sh-row',`<b>L0${i+1}</b><span class="en">${en}</span><span class="ar">${ar}</span>`,SHD);st(row,{top:(356+74*i)+'px'});
  return {i,tag,row,t0:B(70.625+0.625*i)};});
const CORE=mark(SHD,140);
M.track(t=>{
  if(!show(SHD,inShot(t,K_SHD,K_AR)))return;
  const pc=dec(t,K_SHD+0.05,K_SHD+0.7);
  st(CORE.e,{opacity:f3(pc),transform:`translate(${f1(SC.x-70)}px,${f1(SC.y-53.5)}px) scale(${f3(0.85+0.15*pc)})`});
  CORE.gl.style.opacity=f3(0.3+0.6*dec(t,B(74.375),B(74.375)+0.25)*(1-io(t,B(74.375)+0.25,B(74.375)+1.1)));
  for(const s of LYR){const pt=dec(t,s.t0+S16,s.t0+S16+0.45);st(s.tag,{opacity:f3(0.85*pt)});
    const pr=dec(t,s.t0+S16,s.t0+S16+0.6);
    st(s.row,{opacity:f3(pr),filter:pr<1?`blur(${f2((1-pr)*10)}px)`:'none',transform:`translateX(${f1((1-pr)*34)}px)`});}
});
jt({at:B(70.625),out:K_AR,y:84,size:56,words:['Defense','in','depth.','Sovereign.',{t:'PDPL-compliant.',g:1}],
  ar:'دفاع متعدد الطبقات — بنية سيادية متوافقة مع نظام حماية البيانات الشخصية.',arSize:30});

/* ================= k80-83 «بالعربية», huge ================= */
const BG11=M.el('div','jbig',`<span class="a g">بالعربية</span><span class="a w">بالعربية</span><span class="s">Ask in Arabic.</span>`,TXT);
const bG=BG11.querySelector('.a.g'), bW=BG11.querySelector('.a.w'), bS=BG11.querySelector('.s');
let BW=0;
M.track(t=>{
  if(!show(BG11,inShot(t,K_AR,K_ASK)))return;
  if(!BW)BW=bW.offsetWidth;
  const pa=dec(t,K_AR+0.02,K_AR+0.55), pw=io(t,B(81.44),B(82.16)), ps=dec(t,B(80.96),B(80.96)+0.45);
  bG.style.opacity=f3(pa);bG.style.filter=pa<1?`blur(${f2((1-pa)*14)}px)`:'none';bG.style.transform=`translateX(${f1(40*(1-pa))}px)`;
  bW.style.opacity=f3(pw);
  st(bS,{left:f1(1920-170-BW+10)+'px',top:'700px',opacity:f3(ps),filter:ps<1?`blur(${f2((1-ps)*10)}px)`:'none'});
});

/* ================= k83-96 the Assistant: the Arabic question typed and sent, the answer streamed from the data ================= */
const SH9=M.el('div','jp-shot',null,SCN), D9=M.el('div','jp-3d',null,SH9);
const Q='لماذا انخفضت مبيعات الرياض هذا الأسبوع؟';
const ANS=['انخفضت','المبيعات','§','بسبب','نفاد','المخزون','في','ثلاثة','فروع','—','تم','إنشاء','طلبات','التوريد','تلقائيًا.'];
const ask=M.el('div','as-card',
  `<div class="hd"><span class="bt">${SK.ic('bot',26,'#fff',2)}</span><span class="nm">مساعد مرصد الذكي</span>`+
  `<span class="ws">${SK.ic('chevDown',18,'#52505A',2)}<span>كل مساحة العمل</span></span></div><div class="dv"></div>`+
  `<div class="um">${Q}</div>`+
  `<div class="an"><span class="av">${SK.ic('bot',24,'#fff',2)}</span><div class="ac"><div class="tx"></div>`+
  `<span class="chip">${SK.ic('check',16,'#0B8447',2.6)}<span>مبني على بياناتك الأصلية — بدون اختلاق</span></span></div></div>`+
  `<div class="ir"><div class="in"><span class="ph">اسأل مرصد عن أي شيء بخصوص بياناتك...</span><span class="qq"></span><i class="caret"></i></div>`+
  `<span class="send">${SK.ic('send',28,'#fff',2)}</span></div>`,D9);
const aUM=ask.querySelector('.um'),aAN=ask.querySelector('.an'),aTX=ask.querySelector('.tx'),aCH=ask.querySelector('.chip'),
  aPH=ask.querySelector('.ph'),aQQ=ask.querySelector('.qq'),aCa=ask.querySelector('.caret'),aSend=ask.querySelector('.send');
const T_TYPE=B(83.8667), CPS=18, T_SEND=B(88.3733), T_POST=B(88.72), T_ANS=B(89.24), T_W=B(89.5867), T_CHIP=B(94);
let lastTx='';
M.track(t=>{
  if(!show(SH9,inShot(t,K_ASK,K_BR)))return;
  const pe=dec(t,K_ASK,K_ASK+0.7), u=P(t,K_ASK,K_BR);
  st(ask,{opacity:f3(pe),filter:pe<1?`blur(${f2((1-pe)*8)}px)`:'none',transform:T3(960,622+(1-pe)*120,1100,590,{rx:lerp(14,3,u),ry:lerp(-10,-2,u),s:1.08})});
  const q=FQ(t), n=q>=T_SEND+0.1?0:Math.max(0,Math.min(Q.length,Math.floor((q-T_TYPE)*CPS)));
  aQQ.textContent=Q.slice(0,n);aPH.style.display=n>0?'none':'';
  aCa.style.opacity=t>=T_TYPE-0.3&&t<T_SEND+0.1?'1':'0';
  const pk=P(t,T_SEND,T_SEND+0.3);aSend.style.background=n>0||(pk>0&&pk<1)?'#5909B4':'#C9A8E6';
  aSend.style.transform=`scale(${f3(1-0.06*Math.sin(Math.PI*pk))})`;
  const pu=dec(t,T_POST,T_POST+0.5);st(aUM,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*40)}px)`});
  const pa=dec(t,T_ANS,T_ANS+0.5);st(aAN,{opacity:f3(pa),transform:`translateY(${f1((1-pa)*24)}px)`});
  const nw=q<T_W?0:Math.min(ANS.length,Math.floor((q-T_W)/S16)+1);
  const tx=ANS.slice(0,nw).map(w=>w==='§'?'<span class="hl">8.2%</span>':w).join(' ');
  if(tx!==lastTx){aTX.innerHTML=tx;lastTx=tx;}
  const pc=dec(t,T_CHIP,T_CHIP+0.5);st(aCH,{opacity:f3(pc),transform:`scale(${f3(0.94+0.06*pc)})`});
});
jt({at:B(89.76),out:K_BR,y:64,size:52,step:S16,words:['The','answer','comes','from','your',{t:'original',g:1},{t:'data.',g:1}],ar:'الإجابة من بياناتك الأصلية.',arSize:32});

/* ================= k96-104 the breath, held through the track's break (k100-103) ================= */
jt({at:B(96.6),out:K_END,y:352,size:92,step:S8,words:['One','operational','\n','nervous',{t:'system.',g:1}],ar:'جهاز عصبي تشغيلي واحد لشركتك.',arSize:44});

/* ================= k104-116 on the hit two lenses join; the capsule; the mark ================= */
jt({at:K_END+0.35,out:B(108.8),y:478,size:50,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:34,fade:[B(107.4),B(108.1)]});
const CAP=M.el('div','jcap','<span>marsadnasl.com</span>',TXT), capT=CAP.firstChild;
const MKE=M.el('img','jmk',null,TXT);MKE.src='assets_logo_m.png';
const BOOK=M.el('div','jbook',`<span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span>`,TXT);
const FTR=M.el('div','jft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',TXT);
M.track(t=>{
  const on=t>=B(107.5);[CAP,MKE,BOOK,FTR].forEach(e=>show(e,on));if(!on)return;
  const pc=dec(t,B(107.5),B(108.5)+0.6), w=lerp(1180,760,pc), h=lerp(330,150,pc), cy=lerp(540,560,dec(t,B(109.5),B(110.5)));
  st(CAP,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(960-w/2)}px,${f1(cy-h/2)}px)`,opacity:f3(P(t,B(107.5),B(108.1)))});
  const pt=dec(t,B(108.5),B(108.5)+0.5);st(capT,{opacity:f3(pt),filter:pt<1?`blur(${f2((1-pt)*8)}px)`:'none'});
  const pm=dec(t,B(109.5),B(109.5)+0.8);st(MKE,{opacity:f3(pm),transform:`translate(865px,${f1(262+(1-pm)*16)}px) scale(${f3(0.92+0.08*pm)})`});
  const pb=dec(t,B(110.25),B(110.25)+0.7);st(BOOK,{top:'700px',opacity:f3(pb),transform:`translateY(${f1((1-pb)*14)}px)`});
  st(FTR,{opacity:f3(0.55*dec(t,B(111),B(111)+0.8))});
});
M.punch(K_TURN,{amp:0.015});
M.punch(K_END,{amp:0.015});
M.start();
