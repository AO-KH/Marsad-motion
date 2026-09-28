/* Marsad — the 63 s launch film, launch cut (films/film63-launch). The first film (film.html, v6) rebuilt in the grammar of
   the client's launch-video references (notes.apoorv.xyz/launch-videos), as films/coffee-launch did for the coffee story:
   a dark purple mesh stage, kinetic bilingual type, the app's real parts floating in 3D with glowing edges, zoom-throughs,
   one cursor click, a logo + URL end card. The story and the lines are the 63 s film's own. Kept from the house rules:
   English + Arabic on every line, Western digits, real app text on real parts, no shake (punches <= 1.5%), nothing on
   every beat, no orb behind the logo, "Book your demo" and marsadnasl.com. No voiceover: the words are on screen, as in
   the references.
   Music: HoliznaCC0 "Movement" (fit/holizna-movement.mp3, CC0, 96.67 BPM, C minor), cut with film.json "edit": song beats
   16-95 (the second half of the stripped intro, then groove A) and 128-149 (the last two bars of groove B, its two-beat
   silence on 136-137, the stripped groove after it). Film beat k = song k+16 up to k79, then song k+48. B(k) = k x 0.6207 s.
     k0-8    sources   the eight famous tiles float scattered in depth; "Your company's data is everywhere."
     k8-14   waiting   a team chat waits for an answer (a dull card: no glow); "When you need a quick answer, your system
                       makes you wait."
     k14-24  the turn  the tiles fly into the Marsad mark, which lands on k16 as the groove starts; "Marsad changes that.";
                       the camera flies through the mark's V
     k24-32  the loop  Connect, Unify, Monitor, Act, one per beat, joined by one line; "One workflow. Fully automated."
     k32-44  the model the sources dock around the mark; the Knowledge Map's objects and links build on a slowly turning
                       plane; "Every system. One living model."; the plane pitches away
     k44-56  pulse     Business Pulse's three recommendations float up; the camera closes in on «مبني على بياناتك»;
                       "Real-time recommendations — from your own numbers."
     k56-68  decisions the Decisions counters and card swing in; the camera closes in on «موافقة»; the cursor clicks on
                       k64 (a hit): executed, PO-2291, approved 0 -> 1; "Decision to action. Nothing in between."
     k68-75  shield    six defence rings snap in around the mark, with their layers; "Defense in depth. Sovereign.
                       PDPL-compliant."
     k75-86  ask       the Assistant: an Arabic question typed and sent, the answer streamed word by word with its source
                       chip; "Ask in Arabic." then "The answer comes from your original data."
     k86-90  breath    black; "One operational nervous system." held through the music's two-beat silence (k88-89)
     k90-102 end       on the hit after the silence: the mark, the wordmark, marsadnasl.com, "Book your demo"
   Truth: the Business Pulse rows, the Decisions counters, card and toast, the Knowledge Map's objects and link names, and
   the Assistant's name, input and placeholder are the app's own (site kit). The team chat, the question and its answer,
   the six layers and the tiles flying into the mark are the 63 s film's renderings. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const NS='http://www.w3.org/2000/svg';
const T3=(x,y,w,h,{z=0,rx=0,ry=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) scale(${f3(s)})`;
const glass=(col,inner)=>`${M.GLASS(col)}${inner}`;
function svgLayer(parent){const s=document.createElementNS(NS,'svg');s.setAttribute('class','cl-svg');s.setAttribute('width',1920);s.setAttribute('height',1080);parent.appendChild(s);return s;}
function sv(parent,tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);parent.appendChild(e);return e;}
// the glow filter works in stage px: a bounding-box region would be empty on a horizontal line (zero height)
const GLOW=`<filter id="glw" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

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
const LIGHT=[[0,0.3],[B(7),0.3],[B(8.4),0.16],[B(13.6),0.16],[B(16),0.95],[B(22),0.9],[B(24.2),0.8],[B(44),0.8],[B(45),0.66],
  [B(67.4),0.66],[B(68.4),0.8],[B(74.4),0.8],[B(75.4),0.62],[B(85.8),0.62],[B(86.8),0.07],[B(89.9),0.07],[B(90.05),0.35],[B(91.2),0.95],[B(120),0.95]];
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

/* ---------------- kinetic type: EN words build one by one (blur, rise), the Arabic line follows; all blur out together.
   Words: 'text', {t:'text',g:1} (the brand gradient), {h:'html'}, or '\n' (a line break). ats: one start per word. ---------------- */
function kt(o){
  const e=M.el('div','kt'+(o.align==='left'?' left':''),null,TXT);st(e,{top:o.y+'px'});
  if(o.x!=null)st(e,{left:o.x+'px',width:(o.w??1920-o.x)+'px'});
  const en=M.el('div','en',null,e);if(o.size)en.style.fontSize=o.size+'px';
  const ws=[];
  for(const w of o.words){if(w==='\n'){en.appendChild(document.createElement('br'));continue;}
    ws.push(typeof w==='string'?M.el('span','w',w,en):M.el('span','w'+(w.g?' g':''),w.h||w.t,en));}
  const ar=o.ar?M.el('div','ar',o.ar,e):null;if(ar&&o.arSize)ar.style.fontSize=o.arSize+'px';
  const step=o.step??S8, T=ws.map((_,i)=>o.ats?o.ats[i]:o.at+i*step), tAr=o.arAt??(T[T.length-1]+S8);
  M.track(t=>{
    const on=t>=T[0]-0.01&&t<o.out+0.45;e.style.display=on?'':'none';if(!on)return;
    const x=inc(t,o.out,o.out+0.4);
    ws.forEach((s,i)=>{const p=dec(t,T[i],T[i]+0.55);
      st(s,{opacity:f3(p*(1-x)),filter:`blur(${f2((1-p)*14+x*10)}px)`,transform:`translateY(${f1((1-p)*28-x*18)}px)`});});
    if(ar){const p=dec(t,tAr,tAr+0.6);st(ar,{opacity:f3(p*(1-x)),filter:`blur(${f2((1-p)*10+x*8)}px)`,transform:`translateY(${f1((1-p)*18-x*14)}px)`});}
  });
  return e;
}

/* ---------------- layers of the scene: lines under the parts, the 3D parts, flat parts over them ---------------- */
const LO=M.el('div','cl-lo',null,SCN), D3=M.el('div','cl-3d',null,SCN), HI=M.el('div','cl-hi',null,SCN);
// a floating UI part: a glowing gradient edge in the 3D space ('dull': a plain grey edge, for the old way of working)
function gwrap(inner,w,h,r,kind){
  const e=M.el('div','gw'+(kind?' '+kind:''),`<div class="gb"></div><div class="gr"></div><div class="gi"></div>`,D3);
  st(e,{width:w+'px',height:h+'px',borderRadius:r+'px'});e.querySelector('.gi').appendChild(inner);
  [['.gb',r+10],['.gr',r+2],['.gi',r]].forEach(([s,rr])=>e.querySelector(s).style.borderRadius=rr+'px');
  return e;
}
M.track(t=>{for(const e of D3.children)e.style.setProperty('--a',f1((t*26)%360)+'deg');});   // a slow turn of the edge colours
// where an element sits inside a part (px from the part's top-left corner); measured once, while it is shown
function offsetIn(e,root){let x=0,y=0,n=e;while(n&&n!==root){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}return {x:x+e.offsetWidth/2,y:y+e.offsetHeight/2};}

/* ================= k0-8 the sources: the eight famous tiles float scattered in depth ================= */
const MK={x:960,y:420};                  // where the mark lands on k16; the tiles fly into it
const TL=[                               // x, y, depth, turn; slot = the 16th it is absorbed on (k14.25 + slot/4, the last on k16)
  {x:300, y:236,z:-60, rx:-8, ry:18, slot:3},
  {x:752, y:150,z:-320,rx:-12,ry:8,  slot:0},
  {x:1210,y:172,z:-40, rx:-10,ry:-10,slot:6},
  {x:1650,y:262,z:-220,rx:-6, ry:-20,slot:2},
  {x:258, y:826,z:-180,rx:10, ry:20, slot:5},
  {x:700, y:912,z:-40, rx:14, ry:10, slot:1},
  {x:1196,y:888,z:-280,rx:12, ry:-8, slot:7},
  {x:1664,y:806,z:-30, rx:8,  ry:-18,slot:4},
].map((p,i)=>({...p,i,t0:B(0.25+0.25*i),ta:B(14.25+0.25*p.slot),el:M.el('div','k-tile m-glass',K.tile(K.TILES[i]),D3)}));
function tileBase(p,t){                  // the tile before the pull: in, drifting, then back into the dark behind the chat
  const pe=dec(t,p.t0,p.t0+0.9), pr=io(t,B(7.2),B(8.8));
  return {x:p.x+16*Math.sin(2*Math.PI*t/11+p.i*1.7), y:p.y+11*Math.cos(2*Math.PI*t/13+p.i*1.1), z:p.z-160*(1-pe)-520*pr,
    o:pe*(1-0.62*pr), bl:(1-pe)*10+2.2*pr, rx:p.rx+3*Math.sin(t*0.5+p.i), ry:p.ry+4*Math.sin(t*0.4+p.i*0.7)};
}
M.track(t=>{
  for(const p of TL){
    const on=t>=p.t0-0.02&&t<p.ta+0.02;p.el.style.display=on?'':'none';if(!on)continue;
    let q=tileBase(p,t),s=1.35;
    const f0=p.ta-0.85,u=P(t,f0,p.ta);
    if(u>0){                              // the pull: a curved flight into the mark, faster and smaller as it arrives
      const a=tileBase(p,f0),e=ez.inC(u),dx=MK.x-a.x,dy=MK.y-a.y,d=Math.hypot(dx,dy)||1,sw=150*Math.sin(Math.PI*u);
      q={x:lerp(a.x,MK.x,e)-dy/d*sw, y:lerp(a.y,MK.y,e)+dx/d*sw, z:lerp(a.z,0,e), o:Math.min(1,a.o+u*2.2)*(1-P(u,0.8,1)),
        bl:a.bl*(1-u), rx:a.rx*(1-e), ry:a.ry*(1-e)};
      s=lerp(1.35,0.3,e);
    }
    st(p.el,{opacity:f3(q.o),filter:q.bl>0.05?`blur(${f2(q.bl)}px)`:'none',transform:T3(q.x,q.y,112,112,{z:q.z,rx:q.rx,ry:q.ry,s})});
  }
});
kt({at:B(1.5),out:B(7),y:414,size:104,words:['Your',"company's",'data','is','everywhere.'],ar:'بيانات شركتك مبعثرة في كل مكان.'});

/* ================= k8-14 waiting: a team chat waits for an answer (a dull card, no glow) ================= */
const chat=M.el('div','ch-card',`<div class="hd"><i></i><span>TEAM CHAT&nbsp;&nbsp;·&nbsp;&nbsp;MONDAY 09:12</span></div>`+
  `<div class="q">Where are we on Q2 numbers?</div><div class="ty"><i></i><i></i><i></i></div>`+
  `<div class="wt"><span>WAITING</span><b>·</b><span class="n">00:47</span></div><div class="wb"><i></i></div>`);
st(chat,{width:'720px',height:'420px'});
const CHAT=gwrap(chat,720,420,28,'dull');
const cQ=chat.querySelector('.q'),cTy=chat.querySelector('.ty'),cDots=[...cTy.children],cWt=chat.querySelector('.wt'),cN=chat.querySelector('.n'),
  cWb=chat.querySelector('.wb'),cWf=chat.querySelector('.wb i');
const T_CIN=B(8), T_COUT=B(14);
M.track(t=>{
  const on=t>=T_CIN-0.02&&t<T_COUT+0.85;CHAT.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_CIN,T_CIN+1.1), x=inc(t,T_COUT,T_COUT+0.8);
  st(CHAT,{opacity:f3(pe*(1-x)),filter:x>0?`blur(${f2(10*x)}px)`:'none',
    transform:T3(1330,560+(1-pe)*300+x*260,720,420,{rx:lerp(30,5,pe)+22*x,ry:-16+4*P(t,T_CIN,T_COUT)})});
  const pq=dec(t,B(8.5),B(8.5)+0.5);st(cQ,{opacity:f3(pq),transform:`translateY(${f1((1-pq)*16)}px) scale(${f3(0.92+0.08*pq)})`});
  cTy.style.opacity=f3(dec(t,B(9.25),B(9.25)+0.4));
  cDots.forEach((d,i)=>d.style.transform=`translateY(${f1(-6*Math.max(0,Math.sin(2*Math.PI*2.3*t-i*0.9)))}px)`);   // 2.3 Hz: off the beat
  const pw=dec(t,B(9.5),B(9.5)+0.5);cWt.style.opacity=f3(pw);cWb.style.opacity=f3(pw);
  cN.textContent='00:'+(47+[10,11,12,13].filter(k=>FQ(t)>=B(k)).length);
  st(cWf,{width:f1(648*lerp(0.18,0.74,P(t,B(9.5),B(14))))+'px'});
});
kt({at:B(8.5),out:B(13.7),x:120,w:980,y:318,size:80,align:'left',step:S16,
  words:['When','you','need','a','\n','quick','answer,','\n','your','system','makes','\n','you','wait.'],ar:'حين تحتاج إجابة سريعة، يجعلك نظامك تنتظر.',arSize:40});

/* ================= k14-24 the turn: the tiles fly into the mark (k16, the groove starts); the camera flies through its V ================= */
const MW=300,MH=229,ZP={x:0.483*MW,y:0.295*MH};    // the mark 300 px wide; ZP: a point inside its V notch (empty), flown through
const mk=M.el('div','cl-mk',`<img class="gl" src="assets_logo_m.png">`+'<img class="tr" src="assets_logo_m.png">'.repeat(3)+`<img class="m" src="assets_logo_m.png">`,HI);
st(mk,{left:f1(MK.x-MW/2)+'px',top:f1(MK.y-MH/2)+'px',width:MW+'px',height:MH+'px',transformOrigin:`${f1(ZP.x)}px ${f1(ZP.y)}px`});
const mkM=mk.querySelector('.m'),mkG=mk.querySelector('.gl'),mkT=[...mk.querySelectorAll('.tr')];
[...mkT,mkM].forEach(e=>e.style.transformOrigin=`${f1(ZP.x)}px ${f1(ZP.y)}px`);
const T_MK=B(16), T_ZT=B(22.2), T_ZE=B(23.8);
const FLY=u=>Math.pow(14,Math.pow(u,1.6));        // the fly-in: scale 1 -> 14, even in log space, gently accelerating
M.track(t=>{
  const on=t>=B(14.5)&&t<T_ZE;mk.style.display=on?'':'none';if(!on)return;
  // the mark lands on the hit: in over 0.75 s with a 3% overshoot; its own glow gathers with the tiles, blooms and settles
  const p=P(t,T_MK,T_MK+0.75), sc=0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  const u=P(t,T_ZT,T_ZE), pz=io(t,T_ZT,T_ZE), zs=FLY(u), mo=1-P(u,0.62,0.95);
  const gx=lerp(0,960-(MK.x-MW/2+ZP.x),pz), gy=lerp(0,540-(MK.y-MH/2+ZP.y),pz);   // the notch glides to the centre as we fly in
  st(mk,{transform:`translate(${f1(gx)}px,${f1(gy)}px) scale(${f3((t<T_MK?0.86:sc)*zs)})`,opacity:f3(mo),visibility:mo>0.002?'visible':'hidden'});
  // the glow filters fade out before the mark grows big: on a mark scaled 20x and more they stall the renderer
  const q=1-P(u,0,0.3);
  // a zoom this fast strobes with 4 motion-blur samples: 3 trailing copies fill each sample's interval (equal weights by
  // stacking alphas 1, 1/2, 1/3, 1/4 from the bottom); they start once the glow filters are gone
  const tr=u>=0.3&&u<1, rs=tr?(Math.log(zs)-Math.log(FLY(P(t-1/240,T_ZT,T_ZE)))):0;
  mkT.forEach((e,j)=>st(e,{display:tr?'':'none',opacity:f3(1/(j+1)),transform:`scale(${f3(Math.exp(-rs*(3-j)/4))})`}));
  st(mkM,{opacity:f3(ez.dec(Math.min(1,p*1.6))*(tr?0.25:1)),filter:q>0.001?`drop-shadow(0 0 26px rgba(188,89,209,${f3(0.8*q)})) drop-shadow(0 0 80px rgba(142,50,195,${f3(0.5*q)}))`:'none'});
  const pre=0.35*io(t,B(14.5),T_MK), bloom=0.9*dec(t,T_MK,T_MK+0.3)*(1-0.55*io(t,T_MK+0.4,T_MK+2.0));
  const go=(t<T_MK?pre:Math.max(bloom,0.35*(1-dec(t,T_MK,T_MK+0.3))))*q;
  st(mkG,{opacity:f3(go),display:go>0.003?'':'none'});
});
kt({at:B(16.5),out:B(21.8),y:650,size:110,words:[{t:'Marsad',g:1},'changes','that.'],ar:'مرصد يغيّر المعادلة.'});
M.punch(T_MK,{amp:0.015});

/* ================= k24-32 the loop: Connect, Unify, Monitor, Act, one per beat, joined by one line ================= */
const FT=[['Connect.','اربط','link'],['Unify.','وحّد','merge'],['Monitor.','راقب','pulse'],['Act.','نفّذ','check']]
  .map(([en,ar,ic],i)=>({en,ar,ic,i,x:390+380*i,t0:B(24+i)}));
const FY=392, T_FOUT=B(31.3);
const fs=svgLayer(LO);
fs.innerHTML=`<defs><linearGradient id="ftg" gradientUnits="userSpaceOnUse" x1="390" y1="0" x2="1530" y2="0"><stop offset="0" stop-color="#8E32C3"/><stop offset="0.5" stop-color="#F29BFF"/><stop offset="1" stop-color="#8E6BFF"/></linearGradient>${GLOW}</defs>`;
FT.forEach(f=>{
  const tile=M.el('div','ft-tile',`<div class="gl m-glass">${glass('#8E32C3',SK.ic(f.ic,54,'#6A12B8',2.2))}</div>`);
  st(tile,{width:'150px',height:'150px'});
  f.el=gwrap(tile,150,150,40);
  f.lb=M.el('div','ft-lb',`<div class="en">${f.en}</div><div class="ar">${f.ar}</div>`,HI);st(f.lb,{left:f.x+'px',top:(FY+104)+'px'});
  if(f.i<3){f.seg=sv(fs,'line',{x1:f.x+84,y1:FY,x2:f.x+380-84,y2:FY,stroke:'url(#ftg)','stroke-width':3,'stroke-linecap':'round',filter:'url(#glw)'});f.seg.dataset.len=380-168;}
});
const fDot=sv(fs,'circle',{r:6,fill:'#FFD2FF',filter:'url(#glw)'});
M.track(t=>{
  const x=inc(t,T_FOUT,T_FOUT+0.5), on=t>=B(23.4)&&t<T_FOUT+0.55;
  for(const f of FT){
    f.el.style.display=on?'':'none';f.lb.style.display=on?'':'none';if(f.seg)f.seg.style.display=on?'':'none';if(!on)continue;
    const p=dec(t,f.t0,f.t0+0.6), fl=6*Math.sin(2*Math.PI*t/3.7+f.i*1.3);            // a slow float, off the beat
    st(f.el,{opacity:f3(p*(1-x)),filter:p<1||x>0?`blur(${f2((1-p)*12+x*10)}px)`:'none',
      transform:T3(f.x,FY+fl+(1-p)*40,150,150,{z:-220*(1-p),rx:25*(1-p),ry:(f.i-1.5)*-6,s:1-0.06*x})});
    const pl=dec(t,f.t0+S16,f.t0+S16+0.55);
    st(f.lb,{opacity:f3(pl*(1-x)),filter:`blur(${f2((1-pl)*10+x*10)}px)`,transform:`translate(-50%,${f1((1-pl)*22)}px)`});
    if(f.seg){const n=FT[f.i+1],ps=dec(t,n.t0-0.3,n.t0+0.05),L=+f.seg.dataset.len;
      f.seg.setAttribute('stroke-dasharray',L);f.seg.setAttribute('stroke-dashoffset',f1(L*(1-ps)));f.seg.setAttribute('opacity',f3(1-x));}
  }
  const dOn=on&&t>=B(27.2);fDot.style.display=dOn?'':'none';
  if(dOn){const u=((t-B(27.2))/1.9)%1;fDot.setAttribute('cx',f1(lerp(FT[0].x+84,FT[3].x-84,u)));fDot.setAttribute('cy',FY);
    fDot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*(1-x)*dec(t,B(27.2),B(27.2)+0.4)));}
});
kt({at:B(28),out:B(31.2),y:716,size:72,words:['One','workflow.','Fully',{t:'automated.',g:1}],ar:'سير عمل واحد، مؤتمت بالكامل.',arSize:38,step:S16*1.5});

/* ================= k32-44 the model: the sources dock, the Knowledge Map's objects and links build around the mark ================= */
const GR=M.el('div','cl-g',null,HI);                  // one group: it pitches away at the end
const gsv=svgLayer(GR);
gsv.innerHTML=`<defs><linearGradient id="spg" x1="0" x2="1"><stop offset="0" stop-color="#BC59D1" stop-opacity="0.15"/><stop offset="1" stop-color="#F29BFF" stop-opacity="0.9"/></linearGradient>${GLOW}</defs>`;
const GC={x:960,y:566};
// the sources: the eight tiles dock around the model, each with a line into it
const SRC=[{x:190,y:400},{x:1730,y:400},{x:190,y:730},{x:1730,y:730},{x:540,y:290},{x:1380,y:290},{x:540,y:925},{x:1380,y:925}]
  .map((p,i)=>({...p,i,t0:B(32.5+0.25*i),el:M.el('div','k-tile m-glass',K.tile(K.TILES[i]),GR),
    ln:sv(gsv,'line',{x1:p.x,y1:p.y,x2:GC.x,y2:GC.y,stroke:'url(#spg)','stroke-width':2}),
    dot:sv(gsv,'circle',{r:4.5,fill:'#FFD2FF',filter:'url(#glw)'})}));
SRC.forEach(s=>{s.len=Math.hypot(GC.x-s.x,GC.y-s.y);s.ln.setAttribute('stroke-dasharray',f1(s.len));
  // the gradient runs from the tile (faint) to the model (bright)
  if(s.x>GC.x){s.ln.setAttribute('x1',GC.x);s.ln.setAttribute('y1',GC.y);s.ln.setAttribute('x2',s.x);s.ln.setAttribute('y2',s.y);s.rev=1;}});
// the objects and links of the app's Knowledge Map (الخريطة المعرفية), on a slowly turning tilted plane around the mark
const KG=[['عميل','Customer','#DB4E11',120],['فاتورة','Invoice','#17A186',60],['بند فاتورة','Invoice line','#CC0C74',10],['منتج','Product','#149BB0',-40],
  ['ملاحظة','Note','#D0730C',170],['موظف','Employee','#CE730B',220],['مدينة','City','#16A286',270]]
  .map(([ar,en,col,a],i)=>({ar,en,col,a,i,t0:B(34.5+0.25*i)}));
const KE=[[0,1,'صادرة إلى'],[1,2,'تحتوي بند'],[3,2,'المنتج'],[0,4,'يذكر'],[0,5,'مدير الحساب'],[0,6,'يقع في']]
  .map(([a,b,l],j)=>({a,b,l,j,t0:B(36.5+0.5*j)}));
KG.forEach(n=>{n.sp=sv(gsv,'line',{stroke:'#BC59D1','stroke-width':1.6,'stroke-dasharray':'5 7',opacity:0});});
KE.forEach(e=>{e.ln=sv(gsv,'line',{stroke:'#E3C9FF','stroke-width':2.2,'stroke-linecap':'round',filter:'url(#glw)',opacity:0});});
KG.forEach(n=>{n.el=M.el('div','gn',`<i style="background:${n.col};box-shadow:0 0 0 5px ${n.col}33,0 0 16px ${n.col};"></i><span class="ar">${n.ar}</span><span class="en">${n.en}</span>`,GR);});
KE.forEach(e=>{e.el=M.el('div','gl-lb',e.l,GR);});
const hub=M.el('div','cl-hub',`<img class="gl" src="assets_logo_m.png"><img class="m" src="assets_logo_m.png">`,GR);
const hubM=hub.querySelector('.m'),hubG=hub.querySelector('.gl');
const T_GIN=B(32), T_GOUT=B(42.8);
const proj=(a,th)=>{const r=(a+th)*Math.PI/180,z=-230*Math.sin(r);return {x:GC.x+470*Math.cos(r),y:GC.y+205*Math.sin(r),z,s:1400/(1400+z)};};
M.track(t=>{
  const on=t>=T_GIN-0.02&&t<T_GOUT+1.1;GR.style.display=on?'':'none';if(!on)return;
  const po=io(t,T_GOUT,T_GOUT+1.0);
  st(GR,{opacity:f3(1-P(po,0.35,1)),filter:po>0?`blur(${f2(8*po)}px)`:'none',
    transform:`perspective(1400px) translateY(${f1(-430*po)}px) rotateX(${f2(58*po)}deg) scale(${f3(1-0.22*po)})`});
  const th=-12+24*P(t,T_GIN,T_GOUT+1.0);
  // the mark at the centre: the model's heart
  const ph=dec(t,T_GIN,T_GIN+0.7);
  st(hub,{opacity:f3(ph),transform:`translate(${GC.x}px,${GC.y}px) translate(-50%,-50%) scale(${f3(0.8+0.2*ph)})`});
  hubG.style.opacity=f3(0.8*dec(t,T_GIN,T_GIN+0.3)*(1-0.5*io(t,T_GIN+0.4,T_GIN+1.8)));
  for(const s of SRC){
    const p=dec(t,s.t0,s.t0+0.7),fx=s.x+(s.x-GC.x)*0.9*(1-p),fy=s.y+(s.y-GC.y)*0.9*(1-p);
    st(s.el,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*10)}px)`:'none',
      transform:`translate(${f1(fx-56)}px,${f1(fy-56+7*Math.sin(2*Math.PI*t/5.3+s.i))}px) scale(${f3(0.78)})`});
    const pd=dec(t,s.t0+0.2,s.t0+0.7);s.ln.setAttribute('stroke-dashoffset',f1(s.len*(1-pd)*(s.rev?-1:1)));s.ln.setAttribute('opacity',f3(0.8*pd));
    const t1=s.t0+0.7;                               // data flowing in: one light runs from the tile into the mark, again and again
    if(t>=t1){const u=((t-t1)/2.3+s.i*0.13)%1;s.dot.setAttribute('cx',f1(lerp(s.x,GC.x,u)));s.dot.setAttribute('cy',f1(lerp(s.y,GC.y,u)));
      s.dot.setAttribute('opacity',f3(Math.sin(Math.PI*u)*dec(t,t1,t1+0.4)));}else s.dot.setAttribute('opacity','0');
  }
  const pos=KG.map(n=>proj(n.a,th));
  KG.forEach((n,i)=>{const q=pos[i],p=dec(t,n.t0,n.t0+0.6);
    st(n.el,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*10)}px)`:'none',zIndex:String(Math.round(1000-q.z)),
      transform:`translate(${f1(q.x)}px,${f1(q.y)}px) translate(-50%,-50%) scale(${f3(q.s*(0.85+0.15*p))})`});
    const pl=dec(t,n.t0,n.t0+0.45);
    n.sp.setAttribute('x1',GC.x);n.sp.setAttribute('y1',GC.y);n.sp.setAttribute('x2',f1(lerp(GC.x,q.x,pl)));n.sp.setAttribute('y2',f1(lerp(GC.y,q.y,pl)));
    n.sp.setAttribute('opacity',f3(0.7*pl));});
  KE.forEach(e=>{const A=pos[e.a],Bq=pos[e.b],p=dec(t,e.t0,e.t0+0.45),pl=dec(t,e.t0+S8,e.t0+S8+0.5);
    e.ln.setAttribute('x1',f1(A.x));e.ln.setAttribute('y1',f1(A.y));e.ln.setAttribute('x2',f1(lerp(A.x,Bq.x,p)));e.ln.setAttribute('y2',f1(lerp(A.y,Bq.y,p)));
    e.ln.setAttribute('opacity',f3(0.85*p));
    st(e.el,{opacity:f3(pl),transform:`translate(${f1((A.x+Bq.x)/2)}px,${f1((A.y+Bq.y)/2)}px) translate(-50%,-50%) scale(${f3(0.9+0.1*pl)})`});});
});
kt({ats:[B(32.5),B(33),B(37),B(37.5),B(38)],out:B(42.5),y:62,size:64,words:['Every','system.','One','living',{t:'model.',g:1}],
  ar:'كل الأنظمة… نموذج حيّ واحد.',arSize:34});

/* ================= k44-56 Business Pulse: the three recommendations float up; the camera closes in on «مبني على بياناتك» ================= */
const tp=document.createElement('div');tp.innerHTML=SK.pulseContent({id:'flPulse'});
const RW=1535,RH=118,RS=0.8;
const RR=[...tp.querySelector('#recRows').children].map((r,i)=>{
  st(r,{position:'absolute',left:'0',top:'0',right:'auto',width:RW+'px',height:RH+'px'});
  const w=M.el('div',null,null);st(w,{position:'absolute',left:'0',top:'0',width:RW+'px',height:RH+'px',background:'#fff',borderRadius:'22px'});
  M.el('div','site m-site',null,w).appendChild(r);
  let e;if(i===0)e=gwrap(w,RW,RH,22);else{e=M.el('div','cl-plain',null,D3);st(e,{width:RW+'px',height:RH+'px'});e.appendChild(w);}
  return {i,e,row:r,t0:B(44.5+0.25*i),y:448+132*i,z:-50*i};});
const ptag=M.el('div','ptag',`${SK.ic('pulse',24,'#F29BFF',2)}<span class="ar">نبض الأعمال</span><span class="en">Business Pulse</span>`,HI);
const T_PZ=B(48.5), T_POUT=B(55.3), PZ=2.2;
let OKP=null;
M.track(t=>{
  const on=t>=B(44.2)&&t<T_POUT+0.95;RR.forEach(r=>r.e.style.display=on?'':'none');ptag.style.display=on?'':'none';if(!on)return;
  if(!OKP)OKP=offsetIn(RR[0].row.querySelector('.sk-pill.ok'),RR[0].row);          // «مبني على بياناتك» in the top row
  const pz=io(t,T_PZ,T_PZ+1.4), px=io(t,T_POUT,T_POUT+0.9);
  // the camera: zoom by Z about the pill, which glides to (960,470)
  const F={x:960+(OKP.x-RW/2)*RS,y:RR[0].y+(OKP.y-RH/2)*RS},Z=lerp(1,PZ,pz),Tx=lerp(F.x,960,pz),Ty=lerp(F.y,470,pz);
  for(const r of RR){
    const p=dec(t,r.t0,r.t0+0.8);
    const cx=Tx+(960-F.x)*Z-900*px, cy=Ty+(r.y-F.y)*Z+(1-p)*220;
    st(r.e,{opacity:f3(p*(r.i?1-pz:1)*(1-px)),filter:p<1||px>0||(r.i&&pz>0)?`blur(${f2((1-p)*12+px*8+(r.i?10*pz:0))}px)`:'none',
      transform:T3(cx,cy,RW,RH,{z:r.z*(1-pz),rx:lerp(lerp(26,8,p),0,pz),ry:lerp(-10+6*P(t,B(44),B(48.5)),0,pz)+35*px,s:RS*Z})});
  }
  const pt=dec(t,B(44.25),B(44.25)+0.6);
  st(ptag,{opacity:f3(pt*(1-pz)*(1-px)),transform:`translate(960px,${f1(344+(1-pt)*14)}px) translate(-50%,-50%)`});
});
kt({at:B(44.5),out:B(48.3),y:62,size:64,words:['Real-time',{t:'recommendations',g:1}],ar:'توصيات لحظية',arSize:34,step:S16*1.5});
kt({at:B(49),out:B(55.1),y:760,size:72,words:['From','your','own',{t:'numbers.',g:1}],ar:'مبنية على أرقامك — بلا اختلاق.',arSize:38,step:S16*1.5});

/* ================= k56-68 Decisions: the counters and the card swing in; one click on «موافقة» ================= */
const td=document.createElement('div');td.innerHTML=SK.decContent({id:'flDec'});
const dcard=td.querySelector('#decCard'),toast=td.querySelector('#toast'),btn=dcard.querySelector('#btnOK'),stats=td.querySelector('#stats');
[dcard,toast].forEach(e=>{e.removeAttribute('id');st(e,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'214px'});});
toast.style.display='flex';
const DWR=M.el('div',null,null);st(DWR,{position:'absolute',left:'0',top:'0',width:'1402px',height:'214px',background:'#fff',borderRadius:'22px'});
M.el('div','site m-site',null,DWR).append(dcard,toast);
const DEC=gwrap(DWR,1402,214,22);
stats.removeAttribute('id');st(stats,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'138px'});
const SWR=M.el('div',null,null);st(SWR,{position:'absolute',left:'0',top:'0',width:'1402px',height:'138px'});
M.el('div','site m-site',null,SWR).appendChild(stats);
const STW=M.el('div','cl-plain',null,D3);st(STW,{width:'1402px',height:'138px'});STW.appendChild(SWR);
const statEls=[...stats.children];                     // left to right: حرجة, مرفوضة, موافق عليها, قيد المراجعة
const nApp=statEls[2].querySelector('.n'),nRev=statEls[3].querySelector('.n');
const BTN={x:1402-36-80,y:138+28};                     // «موافقة»'s centre in the card (right:36px, top:138px, 56 px tall, about 160 px wide)
const DC={x:960,y:612}, SC7={x:960,y:352,s:0.86};
const T_DIN=B(55.8), T_ZIN=B(60), T_CLICK=B(64), T_BACK=B(64.4), T_CNT=B(65.5), T_DOUT=B(67.3), ZS=2.6;
M.track(t=>{
  const on=t>=T_DIN-0.02&&t<T_DOUT+0.7;DEC.style.display=on?'':'none';STW.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_DIN,T_DIN+1.1), ps=dec(t,T_DIN+0.1,T_DIN+1.2), pz=io(t,T_ZIN,T_ZIN+1.5)*(1-io(t,T_BACK,T_BACK+1.3)), x=inc(t,T_DOUT,T_DOUT+0.6);
  // the camera: zoom by Z about «موافقة», which glides to the centre
  const F={x:DC.x+BTN.x-701,y:DC.y+BTN.y-107},Z=lerp(1,ZS,pz),Tx=lerp(F.x,960,pz),Ty=lerp(F.y,540,pz);
  const sw=1000*(1-pe);                                  // the swing in from the right
  st(DEC,{opacity:f3(pe*(1-x)),filter:pe<1||x>0?`blur(${f2((1-pe)*8+x*10)}px)`:'none',
    transform:T3(Tx+(DC.x-F.x)*Z+sw,Ty+(DC.y-F.y)*Z-x*160,1402,214,{rx:lerp(8,0,pz),ry:lerp(-35*(1-pe)-4+7*P(t,B(57),B(67)),0,pz),s:Z})});
  st(STW,{opacity:f3(ps*(1-pz)*(1-x)),filter:ps<1||x>0?`blur(${f2((1-ps)*8+x*10)}px)`:'none',
    transform:T3(Tx+(SC7.x-F.x)*Z+1000*(1-ps),Ty+(SC7.y-F.y)*Z-x*160,1402,138,{z:-60,rx:lerp(10,0,pz),ry:lerp(-35*(1-ps)-4+7*P(t,B(57),B(67)),0,pz),s:SC7.s*Z})});
  const pk=dec(t,T_CLICK+0.05,T_CLICK+0.45);dcard.style.opacity=f3(1-pk);toast.style.opacity=f3(pk);
  const pr=P(t,T_CLICK,T_CLICK+0.24);btn.style.transform=`scale(${f3(1-0.05*Math.sin(Math.PI*pr))})`;
  // the counters follow: approved 0 -> 1, under review 6 -> 5; the approved tile glows once
  const done=FQ(t)>=T_CNT;nApp.textContent=done?'1':'0';nRev.textContent=done?'5':'6';
  const gc=dec(t,T_CNT,T_CNT+0.4)*(1-io(t,T_CNT+0.8,T_CNT+2.2));
  statEls[2].style.boxShadow=gc>0.001?`0 0 ${f1(34*gc)}px rgba(11,132,71,${f3(0.55*gc)}),inset 0 0 0 ${f2(2*gc)}px rgba(11,132,71,${f3(0.6*gc)})`:'';
});
kt({at:B(56.5),out:B(61.8),y:62,size:64,words:['Decision','to',{t:'action.',g:1}],ar:'من القرار إلى التنفيذ.',arSize:34,step:S16*1.5});
kt({at:B(65.5),out:B(67.1),y:800,size:72,words:['Nothing','in',{t:'between.',g:1}],ar:'بلا خطوات بينهما.',arSize:38,step:S16*1.5});
M.punch(T_CLICK,{amp:0.008});
// the cursor: glides in, presses «موافقة» on k64 (the tip below the label), one soft ring
const cur=M.el('div','cur',`<svg viewBox="0 0 32 32" width="70" height="70"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#1A0F2E" stroke-width="1.6" stroke-linejoin="round"/></svg>`,HI);
const ring=M.el('div','ring',null,HI);
M.track(t=>{
  const on=t>=B(62)&&t<B(65.6);cur.style.display=on?'':'none';ring.style.display=t>=T_CLICK&&t<T_CLICK+0.6?'':'none';if(!on)return;
  const pm=io(t,B(62),T_CLICK-0.08), tx=lerp(1560,972,pm), ty=lerp(1010,590,pm);
  const press=Math.sin(Math.PI*P(t,T_CLICK-0.02,T_CLICK+0.2)), out=inc(t,B(65),B(65.6));
  st(cur,{opacity:f3(dec(t,B(62),B(62.4))*(1-out)),transform:`translate(${f1(tx-12)}px,${f1(ty-6)}px) scale(${f3(1-0.12*press)})`});
  const pr=P(t,T_CLICK,T_CLICK+0.6),R=20+100*ez.dec(pr);
  st(ring,{opacity:f3(0.8*(1-pr)),width:f1(2*R)+'px',height:f1(2*R)+'px',transform:`translate(${f1(tx-R)}px,${f1(ty-R)}px)`});
});

/* ================= k68-75 the shield: six defence rings snap in around the mark, with their layers ================= */
const SHG=M.el('div','cl-sh',null,HI);
const ssv=svgLayer(SHG);
ssv.innerHTML=`<defs><linearGradient id="shg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A2BD6"/><stop offset="0.5" stop-color="#E86BFF"/><stop offset="1" stop-color="#8E6BFF"/></linearGradient>${GLOW}</defs>`;
const SC={x:600,y:606};
const LAYERS=[['ACCESS CONTROLS','التحكم بالوصول'],['DATA PROTECTION','حماية البيانات'],['NETWORK SECURITY','أمن الشبكة'],
  ['APPLICATION SECURITY','أمن التطبيقات'],['MONITORING & AUDIT','المراقبة والتدقيق'],['SOVEREIGN INFRASTRUCTURE','بنية تحتية سيادية']];
const RGS=LAYERS.map(([en,ar],i)=>{const r=120+44*i,gp=sv(ssv,'g',{});
  const c=sv(gp,'circle',{cx:SC.x,cy:SC.y,r,fill:'none',stroke:'url(#shg)','stroke-width':i===5?3:2.2,filter:'url(#glw)'});
  if(i===1||i===3)c.setAttribute('stroke-dasharray','10 12');
  const a=-2.36,tag=M.el('div','sh-tag',`L0${i+1}`,SHG);st(tag,{left:f1(SC.x+r*Math.cos(a))+'px',top:f1(SC.y+r*Math.sin(a))+'px'});
  const row=M.el('div','sh-row',`<b>L0${i+1}</b><span class="en">${en}</span><span class="ar">${ar}</span>`,SHG);st(row,{top:(330+74*i)+'px'});
  return {i,r,gp,c,tag,row,t0:B(68.5+0.5*i)};});
const sweep=sv(ssv,'circle',{cx:SC.x,cy:SC.y,r:340,fill:'none',stroke:'#FFE0FF','stroke-width':4,'stroke-linecap':'round',filter:'url(#glw)',opacity:0});
const SWL=2*Math.PI*340;sweep.setAttribute('stroke-dasharray',`140 ${f1(SWL-140)}`);
const core=M.el('div','cl-core',`<img class="gl" src="assets_logo_m.png"><img class="m" src="assets_logo_m.png">`,SHG);
st(core,{left:f1(SC.x-70)+'px',top:f1(SC.y-53.5)+'px'});
const T_SIN=B(68), T_SEAL=B(72), T_SOUT=B(74.3);
M.track(t=>{
  const on=t>=T_SIN-0.02&&t<T_SOUT+0.75;SHG.style.display=on?'':'none';if(!on)return;
  const x=io(t,T_SOUT,T_SOUT+0.7),seal=dec(t,T_SEAL,T_SEAL+0.2)*(1-io(t,T_SEAL+0.2,T_SEAL+0.9));   // one light when it seals, then steady
  const pc=dec(t,T_SIN,T_SIN+0.6);
  st(core,{opacity:f3(pc*(1-P(x,0.5,1))),transform:`scale(${f3((0.85+0.15*pc)*(1-0.3*x))})`});
  for(const g0 of RGS){
    const p=dec(t,g0.t0,g0.t0+0.5), s=(1.12-0.12*p)*(1-0.75*x), rot=(g0.i%2?-1:1)*(t*6+g0.i*20);
    g0.gp.setAttribute('transform',`translate(${SC.x} ${SC.y}) scale(${f3(s)}) rotate(${f2(rot)}) translate(${-SC.x} ${-SC.y})`);
    g0.gp.setAttribute('opacity',f3(p*(1-x)));g0.c.setAttribute('stroke-width',f2((g0.i===5?3:2.2)+1.6*seal));
    const pt=dec(t,g0.t0+S16,g0.t0+S16+0.4);st(g0.tag,{opacity:f3(0.8*pt*(1-x))});
    const pr=dec(t,g0.t0+S16,g0.t0+S16+0.55);
    st(g0.row,{opacity:f3(pr*(1-x)),filter:pr<1||x>0?`blur(${f2((1-pr)*10+x*10)}px)`:'none',transform:`translateX(${f1((1-pr)*34-x*20)}px)`});
  }
  const pw=dec(t,B(71.5),B(71.5)+0.6);sweep.setAttribute('opacity',f3(0.85*pw*(1-x)));
  sweep.setAttribute('stroke-dashoffset',f1(-((t-B(71.5))*520)%SWL));
});
kt({at:B(68.5),out:B(74.2),y:62,size:56,words:['Defense','in','depth.','Sovereign.',{t:'PDPL-compliant.',g:1}],
  ar:'دفاع متعدد الطبقات — بنية سيادية متوافقة مع نظام حماية البيانات الشخصية.',arSize:30,step:S16*1.5});

/* ================= k75-86 Ask in Arabic: the Assistant; a question typed and sent, the answer streamed from the data ================= */
const Q='لماذا انخفضت مبيعات الرياض هذا الأسبوع؟';
const ANS=['انخفضت','المبيعات','§','بسبب','نفاد','المخزون','في','ثلاثة','فروع','—','تم','إنشاء','طلبات','التوريد','تلقائيًا.'];
const ask=M.el('div','as-card',
  `<div class="hd"><span class="bt">${SK.ic('bot',26,'#fff',2)}</span><span class="nm">مساعد مرصد الذكي</span>`+
  `<span class="ws">${SK.ic('chevDown',18,'#52505A',2)}<span>كل مساحة العمل</span></span></div><div class="dv"></div>`+
  `<div class="um">${Q}</div>`+
  `<div class="an"><span class="av">${SK.ic('bot',24,'#fff',2)}</span><div class="ac"><div class="tx"></div>`+
  `<span class="chip">${SK.ic('check',16,'#0B8447',2.6)}<span>مبني على بياناتك الأصلية — بدون اختلاق</span></span></div></div>`+
  `<div class="ir"><div class="in"><span class="ph">اسأل مرصد عن أي شيء بخصوص بياناتك...</span><span class="qq"></span><i class="caret"></i></div>`+
  `<span class="send">${SK.ic('send',28,'#fff',2)}</span></div>`);
st(ask,{width:'1100px',height:'590px'});
const ASK=gwrap(ask,1100,590,28);
const aUM=ask.querySelector('.um'),aAN=ask.querySelector('.an'),aTX=ask.querySelector('.tx'),aCH=ask.querySelector('.chip'),
  aPH=ask.querySelector('.ph'),aQQ=ask.querySelector('.qq'),aCa=ask.querySelector('.caret'),aSend=ask.querySelector('.send');
const T_AIN=B(75), T_TYPE=B(76), T_SEND=B(78.5), T_POST=B(78.75), T_ANS=B(79.25), T_W=B(79.5), T_CHIP=B(83.25), T_AOUT=B(85.6);
let lastTx='';
M.track(t=>{
  const on=t>=T_AIN-0.02&&t<T_AOUT+0.7;ASK.style.display=on?'':'none';if(!on)return;
  const pe=dec(t,T_AIN,T_AIN+1.1), x=inc(t,T_AOUT,T_AOUT+0.6);
  st(ASK,{opacity:f3(pe*(1-x)),filter:pe<1||x>0?`blur(${f2((1-pe)*10+x*10)}px)`:'none',
    transform:T3(960,606+(1-pe)*300+x*200,1100,590,{rx:lerp(24,4,pe)+14*x,ry:-3+6*P(t,T_AIN,T_AOUT)})});
  // typing: one key per 32nd, 2.5 characters a key; the input clears when the question is sent
  const q=FQ(t), keys=q<T_TYPE?0:Math.floor((q-T_TYPE)/S32)+1, n=q>=T_SEND+0.1?0:Math.min(Q.length,Math.ceil(keys*2.5));
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
kt({at:B(75.5),out:B(81.6),y:62,size:72,words:['Ask','in',{t:'Arabic.',g:1}],ar:'اسأل بالعربية.',arSize:38});
kt({at:B(82),out:B(85.6),y:62,size:56,words:['The','answer','comes','from','your',{t:'original',g:1},{t:'data.',g:1}],ar:'الإجابة من بياناتك الأصلية.',arSize:32,step:S16});

/* ================= k86-90 the breath: black, the line held through the music's two-beat silence ================= */
kt({at:B(86.5),out:B(89.3),y:392,size:104,words:['One','operational','nervous',{t:'system.',g:1}],ar:'جهاز عصبي تشغيلي واحد لشركتك.',step:S16*1.5});

/* ================= k90-102 the end card, on the hit after the silence ================= */
const end=M.el('div','end',`<img class="gl" src="assets_logo_m.png"><img class="mk" src="assets_logo_m.png">`+
  `<img class="wm" src="assets_logo_wordmark_white.png">`+
  `<div class="cta"><span class="url">marsadnasl.com</span><span class="book"><span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span></span></div>`+
  `<div class="ft">NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH</div>`,HI);
const eMk=end.querySelector('.mk'),eGl=end.querySelector('.gl'),eWm=end.querySelector('.wm'),eUrl=end.querySelector('.url'),eBook=end.querySelector('.book'),eFt=end.querySelector('.ft');
const T_END=B(90);
M.track(t=>{
  const on=t>=T_END-0.02;end.style.display=on?'':'none';if(!on)return;
  // the mark lands on the hit: in over 0.75 s, a 3% overshoot, its own glow blooms and settles (no disc behind it)
  const p=P(t,T_END,T_END+0.75), sc=0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  st(eMk,{opacity:f3(ez.dec(Math.min(1,p*1.6))),transform:`scale(${f3(sc)})`});
  st(eGl,{opacity:f3(0.9*dec(t,T_END,T_END+0.3)*(1-0.55*io(t,T_END+0.4,T_END+2.0))),transform:`scale(${f3(sc*1.02)})`});
  const pw=dec(t,B(90.8),B(90.8)+0.9);st(eWm,{opacity:f3(pw),transform:`translateY(${f1((1-pw)*16)}px)`});
  const pu=dec(t,B(92),B(92)+0.8),pb=dec(t,B(92.5),B(92.5)+0.8),pf=dec(t,B(93.5),B(93.5)+0.9);
  st(eUrl,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*18)}px) scale(${f3(0.95+0.05*pu)})`});
  st(eBook,{opacity:f3(pb),transform:`translateY(${f1((1-pb)*18)}px) scale(${f3(0.95+0.05*pb)})`});
  st(eFt,{opacity:f3(0.55*pf),transform:`translateY(${f1((1-pf)*10)}px)`});
});
M.punch(T_END,{amp:0.015});
M.start();
