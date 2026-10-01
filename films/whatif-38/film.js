/* Marsad — What-if on a rule, a 30 s campaign film in Marsad's main theme (films/whatif-38), made with the
   marsad-campaign skill from the Business Pulse film (films/pulse-30): the look of the client's two approved films (the
   48 s film, films/style-jupiter, and the ontology film, films/ontology-main-theme). The client asked for "a video of
   What-if on a rule and Compare what should happen with what did together … stick with marsad theme", sent a TikTok
   concept ad as the pace, chose a fast campaign film, then sent its music ("Use this", 2026-10-01). Compare
   («مطابقة مجموعتين») is switched off in the feature catalogue ("Don't film yet"), so the client chose What-if only for
   now.
   The shots grammar: hard cuts on beats, the app's own screens (dark mode) as plates in 3D.
   House rules: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no orb
   behind the logo, "Book your demo" and marsadnasl.com at the end, effects on the transitions only.
   Music: the client's track, Alex Grohl's "Electronic Stylish Rock" (fit/alexgrohl-electronic-stylish-rock.mp3,
   Pixabay), 140 BPM (139.99), 111 s. Bars start at 0.902 s ("downbeat", 7 ms before the transients; beat k at
   0.902 + k x 0.42859 s): the kick is strongest there, and beats.py's first beat (0.052) is beat 3 of a bar. An intro
   (bass and kick from k16, no hats), then three 17-bar sections. Each section starts with a boom on its downbeat (k32,
   k100, k168, k236: kick and bass, the loudest beats in the song) after two beats without kick or bass, then a beat
   without hats and a crash on beat 3 (k34, k102, k170, k238). In the groove the kick leads beat 1 and the snare and
   cymbals hit hardest on beats 3 and 4. The edit [24,72] (the hatless groove, the bass dropping out (film k4-5) and
   the hats rising (k6-7) under the hook as the numbers fly in, the first boom on the turn (k8) and its crash on k10;
   section A through the proof, every cut on a bar's downbeat and the panel (k24) and the proof (k40) on new phrases)
   + [160,182] (the lighter second section's last bars under the break, its two beats without kick or bass ending the
   break (k54-55), the boom into the last section on the end (k56), its crash on k58, its groove fading out under the
   end card; the song's own ending rings out too long for an end card). B(k) = k x 0.42859 s. The first cut on this
   track counted bars from beat 3, so its cuts and hits fell on the crashes, two beats after the booms ("Resync the
   beat and fix the rhyme with the transition"); earlier cuts ran on "Midnight Drift (slowed)", MoodMode's and
   verclub_music's tracks.
     k0-8    hook     the rules page's own rows and a rule's numbers adrift in depth, grey, the numbers changing;
                      "What if the number changes?"; from k6.25 they fly into the centre
     k8-16   the turn (the first boom) the mark lands and a violet lens bursts out of it; numbers ride its orbits;
                      "Marsad lets you try it first."
     k16-24  the rules page «قواعد المراقبة» rises; the cursor clicks the overdue-invoices rule's «ماذا لو…» (the
                      flask, k19); the app's panel opens and lifts out; "Open What-if on a rule."
     k24-32  the panel, close: 25000 typed into the field, «احسب» clicked (k28), the app's two results appear;
                      "Try a different number."
     k32-40  the two results float out side by side: «اليوم (فعلي)» (nothing needs a decision, 0) and «وفق هذا الافتراض»
                      (would raise a decision, 14), glowing; "Today vs. your what-if."
     k40-48  on a bright lens: the panel's own «لا يُحفظ شيء» line and the «افتراضي — غير مسجَّل» badge lift out;
                      "Nothing saved. Nothing changed."
     k48-56  the break (the last bars, then two beats without kick or bass): "Marsad watches. You decide." (the catalogue's end line), the page
                      far behind
     k56-70  the end (the boom into the last section): the capsule blooms round "Book your demo." and shrinks into marsadnasl.com; the
                      mark; "Book your demo · احجز عرضك التجريبي"
   Truth: the rules page, its rows, the «ماذا لو…» panel, the typed value, «احسب», the two results, the badge and the
   «لا يُحفظ شيء» line are the app's own (the client's front end in dark mode, films/whatif-38/app/capture.js, captured
   by tools/app_shot.js). Sample data, labelled "Sample data" on screen: the four rules, their run times, the value 25000
   and the results (today: nothing needs a decision, 0 affected; assumed: would raise a decision, 14 affected).
   Renderings: the lenses, orbits and dust; the number chips in the hook (invented values); the riders' numbers; the
   cursor; the glows and lifts; the label. */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;

const K_TURN=B(8), K_PAGE=B(16), K_DLG=B(24), K_RES=B(32), K_PROOF=B(40), K_BRK=B(48), K_HIT=B(56);
window.CUTS=[K_PAGE,K_DLG,K_RES,K_PROOF,K_BRK,K_HIT];   // hard cuts: motion blur never mixes two shots. The turn (k8) is continuous
const IMG='films/whatif-38/pages/';
const PW=1440, PH=805;                      // the app's window (CSS px); the screenshots are 5x that

/* ---------------- the stage: near black, drifting dust, lenses painted on a canvas ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','mt-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
const RIM_G=[[0,'#07070A'],[0.5,'#0B0B10'],[0.7,'#14141B'],[0.82,'#22222B'],[0.91,'#3A3946'],[0.965,'#6A6876'],[0.99,'#AFADB9'],[1,'#D2D0DA']];   // the old way: grey
const RIM_B=[[0,'#FBF8FD'],[0.5,'#F5EDFB'],[0.7,'#EAD5F8'],[0.83,'#DAA4F3'],[0.92,'#BB4DE7'],[0.975,'#6A1DB8'],[1,'#240B4F']];   // the bright one
const mixPal=u=>RIM.map(([s,c],i)=>{const a=hex(c),b=hex(RIM_G[i][1]);return [s,`rgb(${a.map((v,j)=>Math.round(v+(b[j]-v)*u)).join(',')})`];});
const mixGlow=u=>[206,64,240].map((v,j)=>Math.round(v+([150,148,160][j]-v)*u)).join(',');
function lens(x,y,r,o={}){
  const a=o.a??1, lx=(o.lx??0.18)*r, ly=(o.ly??-0.2)*r, gc=o.gc??'206,64,240';
  if(a<=0.002)return;
  if((o.glow??1)>0){const og=g.createRadialGradient(x,y,r*0.97,x,y,r*1.16);
    og.addColorStop(0,`rgba(${gc},${f3(0.32*a*(o.glow??1))})`);og.addColorStop(1,`rgba(${gc},0)`);
    g.fillStyle=og;g.beginPath();g.arc(x,y,r*1.16,0,2*Math.PI);g.fill();}
  const gr=g.createRadialGradient(x+lx,y+ly,0,x,y,r);for(const [s,c] of (o.pal??RIM))gr.addColorStop(s,c);
  g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fill();g.globalAlpha=1;
}
function haze(x,y,r,c,a){if(a<=0.002)return;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);gr.addColorStop(1,`rgba(${c},0)`);
  g.fillStyle=gr;g.fillRect(0,0,1920,1080);}
const DUST=[];{const r=M.mulberry(91);for(let i=0;i<170;i++)DUST.push({x:r()*1920,y:r()*1080,s:0.8+r()*1.9,vx:(r()-0.35)*7,vy:-(2+r()*8),ph:r()*6.3,f:0.4+r()*0.6});}
function dust(t,a){for(const d of DUST){const x=((d.x+d.vx*t)%1940+1940)%1940-10, y=((d.y+d.vy*t)%1100+1100)%1100-10,
  tw=0.55+0.45*Math.sin(t*d.f*2+d.ph);g.fillStyle=`rgba(236,214,255,${f3(a*tw*0.55)})`;g.fillRect(x,y,d.s,d.s);}}
const ORB=[[-0.21,0.3,0.05],[0.18,2.4,-0.04]];   // two thin orbits round the hero lens: tilt, phase, laps a second
const orbAt=(k,t,ph0=0)=>{const [rot,ph,sp]=ORB[k], th=ph+ph0+sp*2*Math.PI*t, x=1150*Math.cos(th), y=250*Math.sin(th);
  return {x:960+x*Math.cos(rot)-y*Math.sin(rot), y:540+x*Math.sin(rot)+y*Math.cos(rot), front:Math.sin(th)};};
function orbits(t,a){if(a<=0.002)return;
  g.save();g.translate(960,540);g.lineWidth=1.5;
  for(const [rot,ph,sp] of ORB){g.save();g.rotate(rot);
    g.strokeStyle=`rgba(242,155,255,${f3(0.24*a)})`;g.beginPath();g.ellipse(0,0,1150,250,0,0,2*Math.PI);g.stroke();
    const th=ph+sp*2*Math.PI*t;g.fillStyle=`rgba(255,225,252,${f3(0.95*a)})`;g.shadowColor='rgba(222,13,255,0.95)';g.shadowBlur=16;
    g.beginPath();g.arc(1150*Math.cos(th),250*Math.sin(th),4.5,0,2*Math.PI);g.fill();g.shadowBlur=0;g.restore();}
  g.restore();}
const GREY=0.8;                               // how grey the hook's lenses are: only Marsad glows
M.track(t=>{
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
  if(t<K_PAGE){                             // three grey lenses drift apart; on the turn a violet lens bursts out of the mark
    const u=P(t,0,K_TURN), pa=dec(t,0.05,1.3), out=1-P(t,K_TURN-0.05,K_TURN+0.55), pal=mixPal(GREY), gc=mixGlow(GREY);
    lens(170-110*u,700+30*u,500,{a:pa*out,lx:0.2,ly:-0.1,pal,gc});lens(1780+90*u,560-20*u,540,{a:pa*out,lx:-0.2,ly:-0.1,pal,gc});
    lens(960+60*u,250-60*u,600*(1.05-0.08*u),{a:pa*out,lx:0.12,ly:-0.3,pal,gc});
    if(t>=K_TURN){const pb=ez.outC(P(t,K_TURN,K_TURN+0.9));lens(960,540,lerp(40,1010,pb)-14*P(t,K_TURN+0.9,K_PAGE),{lx:-0.05,ly:-0.12});
      orbits(t,P(t,K_TURN+0.5,K_TURN+1.6));}
    dust(t,1);
  }else if(t<K_DLG){lens(1560,1880,1250,{lx:-0.12,ly:-0.1});haze(760,520,900,'150,40,220',0.14);dust(t,0.9);
  }else if(t<K_RES){lens(260,1560,1150,{lx:0.12,ly:-0.3});haze(1280,560,900,'150,40,220',0.13);dust(t,0.85);
  }else if(t<K_PROOF){lens(960,2050-40*P(t,K_RES,K_PROOF),1350,{lx:0,ly:-0.12});haze(960,560,1000,'150,40,220',0.12);dust(t,0.85);
  }else if(t<K_BRK){lens(960,540,1100,{pal:RIM_B,glow:0,lx:0,ly:0});
  }else if(t<K_HIT){lens(960,2600-50*P(t,K_BRK,K_HIT),1650,{a:0.55,lx:0,ly:-0.1});dust(t,0.8);
  }else{haze(960,540,1000,'150,40,220',0.16*P(t,K_HIT,K_HIT+0.5));dust(t,0.6);}   // the end: the capsule glows on its own
});

/* ---------------- type: words blur in where they stand, the Arabic after them ---------------- */
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
// a plate: one of the app's screenshots, drawn at the size it shows (W x H CSS px for a box of w x h app px)
const plate=(parent,src,W,H,cls='wi-plate')=>{const e=M.el('div',cls,null,parent);st(e,{width:f1(W)+'px',height:f1(H)+'px',backgroundImage:`url(${src})`});return e;};
// a part of a plate: the box [x, y, w, h] (app px) of the plate's own picture, at the plate's scale k
const part=(parent,src,[x,y,w,h],k,full,r=10)=>{const e=M.el('div','wi-part',null,parent);
  st(e,{left:f1(x*k)+'px',top:f1(y*k)+'px',width:f1(w*k)+'px',height:f1(h*k)+'px',borderRadius:f1(r*k)+'px',backgroundImage:`url(${src})`,
    backgroundSize:`${f1(full[0]*k)}px ${f1(full[1]*k)}px`,backgroundPosition:`${f1(-x*k)}px ${f1(-y*k)}px`});return e;};
const CURSVG=`<svg viewBox="0 0 32 32" width="54" height="54"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#140B24" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const glowRim=(l,c='236,205,255',g2='206,64,240')=>`0 0 0 ${f2(2.5*l)}px rgba(${c},${f3(0.95*l)}),0 0 ${f1(46*l)}px ${f1(6*l)}px rgba(${g2},${f3(0.5*l)}),0 ${f1(22*l)}px ${f1(46*l)}px rgba(10,4,30,${f3(0.35*l)})`;

/* ================= k0-8 the hook: the rules page's own rows and a rule's numbers adrift in depth, grey ================= */
const SH1=M.el('div','mt-shot',null,SCN), D1=M.el('div','mt-3d',null,SH1);
const MK={x:960,y:540};                     // where the mark lands on the turn
const ROWS=[[1118,61],[1118,61],[1118,61],[1118,60.5]];
const CHIPS=[['حدّ التنبيه · ر.س',['100,000','150,000','75,000','120,000']],['مبلغ متأخر · ر.س',['25,000','40,000','18,000','32,000']],
  ['الحد الأدنى للمخزون',['50','40','65','30']],['متوسط أمر البيع · ر.س',['1,200','1,450','980','1,320']],
  ['أيام التأخير',['30','45','15','60']],['أصناف راكدة · يوم',['30','45','60','21']]];
const POS=[{x:520,y:230,z:-60,rx:-8,ry:16,s:0.74},{x:1420,y:300,z:-220,rx:-10,ry:-14,s:0.74},{x:500,y:850,z:-180,rx:10,ry:16,s:0.74},
  {x:1430,y:870,z:-40,rx:12,ry:-16,s:0.74},
  {x:230,y:520,z:-60,rx:-4,ry:20,s:1},{x:1690,y:560,z:-200,rx:-4,ry:-20,s:1},{x:960,y:150,z:-380,rx:-12,ry:0,s:1},
  {x:980,y:960,z:-160,rx:12,ry:0,s:1},{x:760,y:330,z:-420,rx:-8,ry:10,s:1},{x:1180,y:750,z:-460,rx:8,ry:-10,s:1}];
const DRIFT=[];
ROWS.forEach(([w,h],i)=>{const e=plate(D1,`${IMG}monitors-r${i+1}.png`,w,h,'wi-row');e.style.filter='grayscale(0.85) brightness(0.78)';
  DRIFT.push({kind:'r',e,W:w,H:h});});
CHIPS.forEach(([l,vals],i)=>{const e=M.el('div','pm-chip',`<span class="l">${l}</span><span class="n">${vals[0]}</span>`,D1);
  DRIFT.push({kind:'m',e,n:e.querySelector('.n'),vals,ph:0.37*i});});
const ORDER=[0,1,2,3,4,5,6,7,8,9];
DRIFT.forEach((d,i)=>{Object.assign(d,POS[ORDER[i]]);d.i=i;d.t0=B(0.25+0.3*i);d.ta=B(6.25+0.17*i);});
function drift(p,t){                       // adrift: slow sines (periods of 11-13 s, never the beat); blurred by depth
  const pe=dec(t,p.t0,p.t0+1.1);
  return {x:p.x+18*Math.sin(2*Math.PI*t/11+p.i*1.7), y:p.y+12*Math.cos(2*Math.PI*t/13+p.i*1.1), z:p.z-160*(1-pe),
    o:pe, bl:Math.min(10,Math.abs(p.z+150)/60)+(1-pe)*10, rx:p.rx+3*Math.sin(t*0.5+p.i), ry:p.ry+4*Math.sin(t*0.4+p.i*0.7)};
}
M.track(t=>{
  if(!show(SH1,t<K_TURN+0.1))return;
  const q0=FQ(t);
  for(const p of DRIFT){
    const on=t>=p.t0-0.02&&t<p.ta+0.02;p.e.style.display=on?'':'none';if(!on)continue;
    if(p.kind==='m'){const k=Math.max(0,Math.floor((q0+p.ph)/1.13))%p.vals.length;if(p.k!==k){p.n.textContent=p.vals[k];p.k=k;}}   // a new number every 1.13 s
    const W=p.W??=p.e.offsetWidth||200, H=p.H??=p.e.offsetHeight||50;
    let q=drift(p,t),sc=p.s;
    const f0=p.ta-0.85,u=P(t,f0,p.ta);
    if(u>0){                               // the pull: a curved flight into the mark, faster and smaller as it arrives
      const a=drift(p,f0),e=ez.inC(u),dx=MK.x-a.x,dy=MK.y-a.y,d=Math.hypot(dx,dy)||1,sw=150*Math.sin(Math.PI*u);
      q={x:lerp(a.x,MK.x,e)-dy/d*sw, y:lerp(a.y,MK.y,e)+dx/d*sw, z:lerp(a.z,0,e), o:Math.min(1,a.o+u*2.2)*(1-P(u,0.8,1)),
        bl:a.bl*(1-u), rx:a.rx*(1-e), ry:a.ry*(1-e)};
      sc=lerp(p.s,p.s*0.25,e);
    }
    st(p.e,{opacity:f3(q.o),filter:(p.kind==='r'?'grayscale(0.85) brightness(0.78) ':'')+(q.bl>0.3?`blur(${f2(q.bl)}px)`:''),
      transform:T3(q.x,q.y,W,H,{z:q.z,rx:q.rx,ry:q.ry,s:sc})});
  }
});
jt({at:B(0),out:B(7),y:432,size:84,words:['What','if','the','number',{t:'changes?',d:1}],ar:'ماذا لو تغيّر الرقم؟',fade:[B(6.4),B(7)]});

/* ================= k8-16 the turn: the mark lands, a lens bursts out of it; the numbers ride its orbits, glowing ================= */
const MKe=mark(SCN,300);MKe.e.style.zIndex='1';
const T_UP=B(8.5);                           // the mark rises early enough for the line to hold 3 s
M.track(t=>{
  const on=t>=B(6.25)&&t<K_PAGE;MKe.e.style.display=on?'':'none';if(!on)return;
  const p=P(t,K_TURN,K_TURN+0.75), sc=t<K_TURN?0.86:0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  const pu=io(t,T_UP,T_UP+0.6), y=lerp(MK.y,300,pu), s=sc*lerp(1,0.55,pu);
  st(MKe.e,{transform:`translate(${f1(MK.x-150)}px,${f1(y-114.5)}px) scale(${f3(s)})`,opacity:f3(t<K_TURN?1:ez.dec(Math.min(1,p*1.6)))});
  const pre=0.35*io(t,B(6.25),K_TURN), bloom=0.9*dec(t,K_TURN,K_TURN+0.3)*(1-0.55*io(t,K_TURN+0.4,K_TURN+2));
  MKe.gl.style.opacity=f3(t<K_TURN?pre:Math.max(bloom,0.35*(1-dec(t,K_TURN,K_TURN+0.3))));
  MKe.m.style.opacity=t<K_TURN?'0':'1';
});
const RIDERS=[['25,000',0,-0.9],['14',0,2.24],['0',1,0.6],['100,000',1,3.74]].map(([n,k,ph],i)=>({k,ph,t0:K_TURN+0.6+i*S16,
  e:M.el('div','pm-orb',`<i></i><span>${n}</span>`,SCN)}));
M.track(t=>{
  for(const r of RIDERS){
    const on=inShot(t,r.t0,K_PAGE);if(!show(r.e,on))continue;
    const q=orbAt(r.k,t,r.ph), fr=0.5+0.5*Math.max(0,q.front), a=dec(t,r.t0,r.t0+0.6)*(0.35+0.65*fr);
    st(r.e,{opacity:f3(a),transform:`translate(${f1(q.x)}px,${f1(q.y)}px) translate(-50%,-50%) scale(${f3(0.78+0.22*fr)})`,zIndex:q.front>0?'2':'0'});
  }
});
jt({at:B(9),out:K_PAGE,y:480,size:88,step:S16*1.5,words:[{t:'Marsad',g:1},'lets','you','try','it','first.'],ar:'مرصد يخلّيك تجرّبه أولاً.',arSize:44});

/* ================= k16-24 the rules page: one click on a rule's «ماذا لو…»; the app's panel opens and lifts out ================= */
const SH3=M.el('div','mt-shot',null,SCN), D3=M.el('div','mt-3d',null,SH3);
const PS=0.95, PGW=PW*PS, PGH=PH*PS;        // the page at the size it shows
const PG=plate(D3,IMG+'monitors.png',PGW,PGH,'wi-page');
const PGO=M.el('div','wi-layer',null,PG);PGO.style.backgroundImage=`url(${IMG}whatif.png)`;   // the app with its panel open
const FLASK=[99.6,316,28,28], ROW1=[33,299.5,1118,61], DLG=[464,245.5,512,338];
const ROWp=part(PG,IMG+'monitors.png',ROW1,PS,[PW,PH],8), FLp=part(PG,IMG+'monitors.png',FLASK,PS,[PW,PH],6);
const DLp=part(PG,IMG+'whatif.png',DLG,PS,[PW,PH],12);
const CUR3=M.el('div','pm-cur',CURSVG,SH3);
const PC={x:960,y:615};
const FL_AT={x:PC.x-PGW/2+(FLASK[0]+FLASK[2]*0.55)*PS, y:PC.y-PGH/2+(FLASK[1]+FLASK[3]*0.6)*PS};
const T_CLK=B(20)-0.22, T_OPEN=T_CLK+0.22, T_LIFT=B(21.5);   // the panel opens on the bar's downbeat (the kick)
M.track(t=>{
  if(!show(SH3,inShot(t,K_PAGE,K_DLG)))return;
  const pe=io(t,K_PAGE,K_PAGE+1.2), pt=io(t,T_LIFT,T_LIFT+1.6), drift=P(t,T_LIFT+1.6,K_DLG);
  st(PG,{opacity:f3(dec(t,K_PAGE,K_PAGE+0.5)),transform:T3(PC.x+30*pt,PC.y+140*(1-pe)+10*pt,PGW,PGH,
    {z:-320*(1-pe)-160*pt,rx:18*(1-pe)+12*pt,ry:-16*pt-2*drift})});
  const hov=dec(t,B(18.2),B(18.2)+0.3)*(1-dec(t,T_OPEN,T_OPEN+0.1));
  st(ROWp,{display:t<T_OPEN?'':'none',transform:`translateZ(${f1(10*hov)}px)`,boxShadow:`0 0 0 ${f2(1.5*hov)}px rgba(214,160,255,${f3(0.7*hov)})`});
  const press=Math.sin(Math.PI*P(t,T_CLK-0.05,T_CLK+0.18)), gl=dec(t,T_CLK-0.3,T_CLK)*(1-dec(t,T_OPEN,T_OPEN+0.1));
  st(FLp,{display:t<T_OPEN?'':'none',transform:`translateZ(${f1(2+24*gl)}px) scale(${f3(1+0.25*gl-0.06*press)})`,boxShadow:glowRim(gl)});
  PGO.style.opacity=f3(dec(t,T_OPEN,T_OPEN+0.12));            // the app's panel, as it opens (its own veil and panel)
  const l=dec(t,T_LIFT,T_LIFT+1.0);
  st(DLp,{display:t>=T_OPEN?'':'none',transform:`translateZ(${f1(190*l)}px) scale(${f3(1+0.06*l)})`,boxShadow:glowRim(l)});
  const pm=io(t,B(17.4),T_CLK-0.06), out=io(t,T_CLK+0.4,T_CLK+1.1);   // the cursor: in, press, away
  st(CUR3,{opacity:f3(dec(t,B(17.4),B(17.4)+0.35)*(1-out)),transform:`translate(${f1(lerp(1560,FL_AT.x,pm)+120*out-10)}px,${f1(lerp(1010,FL_AT.y,pm)+120*out-5)}px) scale(${f3(1-0.12*press)})`});
});
jt({at:B(16.5),out:K_DLG,y:64,size:60,words:['Open',{t:'What-if',g:1},'on','a','rule.'],ar:'افتح «ماذا لو…» على القاعدة.',arSize:36});

/* ================= k24-32 the panel, close: a value typed, «احسب», the app's two results ================= */
const SH4=M.el('div','mt-shot',null,SCN), D4=M.el('div','mt-3d',null,SH4);
const DS=1.75, DW=512*DS, DH0=338*DS, DH1=476*DS;
const DL=plate(D4,IMG+'whatif-dialog.png',DW,DH0);
const CALC=[25,161,103.1,42];               // «احسب» in the panel (app px)
const CLp=part(DL,IMG+'type5-dialog.png',CALC,DS,[512,338],8);
const CUR4=M.el('div','pm-cur',CURSVG,SH4);
const DC={x:1270,y:560};
const T_TYPE=B(25), T_CALC=B(28)-0.2, T_RES=T_CALC+0.2;     // the results appear on the bar's downbeat (the kick)
const FRAMES=['whatif','type1','type2','type3','type4','type5'].map(k=>k+'-dialog');   // the panel as each digit lands
const CALC_AT={x:DC.x-DW/2+(CALC[0]+CALC[2]*0.6)*DS, y:DC.y-DH0/2+(CALC[1]+CALC[3]*0.62)*DS};
M.track(t=>{
  if(!show(SH4,inShot(t,K_DLG,K_RES)))return;
  const q=FQ(t), res=q>=T_RES;
  const k=res?-1:Math.max(0,Math.min(5,Math.floor((q-T_TYPE)/S16)+1));   // a digit every 16th, on the frame's time
  const src=res?'result-dialog':FRAMES[k];
  if(DL._s!==src){DL.style.backgroundImage=`url(${IMG}${src}.png)`;DL.style.height=f1(res?DH1:DH0)+'px';DL._s=src;}
  const H=res?DH1:DH0, pe=dec(t,K_DLG,K_DLG+0.7), tl=io(t,T_RES+0.3,T_RES+1.5), drift=P(t,T_RES+1.5,K_RES);
  st(DL,{opacity:f3(Math.min(1,pe*1.6)),transform:T3(DC.x-24*tl,DC.y,DW,H,{z:-420*(1-pe)-60*drift,rx:4*tl,ry:-12*tl-3*drift})});
  const press=Math.sin(Math.PI*P(t,T_CALC-0.05,T_CALC+0.18)), gl=dec(t,T_CALC-0.35,T_CALC)*(1-dec(t,T_RES,T_RES+0.1));
  st(CLp,{display:!res&&t>=T_CALC-0.4?'':'none',transform:`translateZ(${f1(18*gl)}px) scale(${f3(1+0.05*gl-0.05*press)})`,boxShadow:glowRim(gl)});
  const pm=io(t,B(26),T_CALC-0.06), out=io(t,T_CALC+0.4,T_CALC+1.1);
  st(CUR4,{opacity:f3(dec(t,B(26),B(26)+0.35)*(1-out)),transform:`translate(${f1(lerp(1700,CALC_AT.x,pm)+140*out-10)}px,${f1(lerp(1020,CALC_AT.y,pm)+120*out-5)}px) scale(${f3(1-0.12*press)})`});
});
jt({at:B(24.5),out:K_RES,x:130,w:760,y:390,size:76,cls:'left',words:['Try','a','different','\n',{t:'number.',g:1}],ar:'جرّب رقمًا مختلفًا.',arSize:40});

/* ================= k32-40 the two results float out side by side, the assumption glowing ================= */
const SH5=M.el('div','mt-shot',null,SCN), D5=M.el('div','mt-3d',null,SH5);
const BACK=plate(D5,IMG+'result-dialog.png',512*1.9,476*1.9);
const CS=2.9, CW=225*CS, CH=86*CS;
const CA=plate(D5,IMG+'result-assumed.png',CW,CH), CT=plate(D5,IMG+'result-today.png',CW,CH);
M.track(t=>{
  if(!show(SH5,inShot(t,K_RES,K_PROOF)))return;
  const u=P(t,K_RES,K_PROOF), pb=dec(t,K_RES,K_RES+0.6);
  st(BACK,{opacity:f3(0.16*pb),filter:'blur(7px)',transform:T3(960,700,512*1.9,476*1.9,{z:-1700,rx:10,ry:-8+4*u})});
  [[CA,610,1,K_RES],[CT,1310,-1,K_RES+S8]].forEach(([e,x,sd,t0])=>{
    const p=dec(t,t0,t0+0.75), hi=e===CA?dec(t,B(36),B(36)+0.6):0;   // on the second bar's downbeat (the kick), after the line
    st(e,{opacity:f3(Math.min(1,p*1.8)),transform:T3(x+sd*12*u,640+60*(1-p),CW,CH,{z:-700*(1-p)+(e===CA?70*hi:0),rx:6,ry:sd*(14*(1-p)+8)-sd*3*u}),
      boxShadow:e===CA?glowRim(0.35+0.65*hi):`0 0 0 1.5px rgba(200,196,214,0.45),0 30px 70px rgba(0,0,0,0.5)`});
  });
});
jt({at:B(32.4),out:K_PROOF,y:120,size:76,words:['Today',{t:'vs.',d:1},'your',{t:'what-if.',g:1}],ar:'واقع اليوم… مقابل افتراضك.',arSize:40});

/* ================= k40-48 on a bright lens: the panel's «لا يُحفظ شيء» line and the badge lift out ================= */
const SH6=M.el('div','mt-shot',null,SCN), D6=M.el('div','mt-3d',null,SH6);
const NS6=2.5, BS6=3.6;
const NOTE=plate(D6,IMG+'result-note.png',462*NS6,40*NS6), BADGE=plate(D6,IMG+'result-badge.png',115.5*BS6,20*BS6);
NOTE.style.borderRadius='18px';BADGE.style.borderRadius='999px';
const T_OK=B(44);                            // the second bar's downbeat (the kick), after the line
M.track(t=>{
  if(!show(SH6,inShot(t,K_PROOF,K_BRK)))return;
  const pe=dec(t,K_PROOF,K_PROOF+0.7), u=P(t,K_PROOF,K_BRK), l=dec(t,T_OK,T_OK+0.6);
  st(NOTE,{opacity:f3(pe),filter:pe<1?`blur(${f2((1-pe)*8)}px)`:'none',transform:T3(960,760+(1-pe)*50,462*NS6,40*NS6,{rx:lerp(14,5,u),ry:lerp(-5,4,u),z:60*l}),
    boxShadow:`0 30px 70px rgba(60,20,110,0.35),`+glowRim(l,'120,220,160','40,190,110')});
  const pb=dec(t,K_PROOF+0.3,K_PROOF+0.9);
  st(BADGE,{opacity:f3(pb),transform:T3(1260,600+(1-pb)*30,115.5*BS6,20*BS6,{rx:8,ry:-6,z:90*l+20}),boxShadow:`0 24px 50px rgba(60,20,110,0.35),`+glowRim(l,'255,214,120','240,170,40')});
});
jt({at:B(40.4),out:K_BRK,y:190,size:76,cls:'dark',step:S16*1.5,words:['Nothing','saved.','\n','Nothing',{t:'changed.',g:1}],ar:'لا يُحفظ شيء، ولا يتغيّر شيء.',arSize:42});

/* ================= k48-56 the break: "Marsad watches. You decide."; the page far behind ================= */
const SH7=M.el('div','mt-shot',null,SCN), D7=M.el('div','mt-3d',null,SH7);
const PG7=plate(D7,IMG+'monitors.png',PW*1.3,PH*1.3,'wi-page');
M.track(t=>{
  if(!show(SH7,inShot(t,K_BRK,K_HIT)))return;
  const u=P(t,K_BRK,K_HIT), pe=dec(t,K_BRK,K_BRK+1);
  st(PG7,{opacity:f3(0.32*pe),filter:'blur(4px)',transform:T3(960,1160-80*u,PW*1.3,PH*1.3,{z:-2100,rx:lerp(64,58,u)})});
});
jt({at:B(48.3),out:K_HIT,y:330,size:92,words:[{t:'Marsad',g:1},{t:'watches.',g:1},'You','decide.'],ar:'مرصد يراقب. وأنت تقرّر.',arSize:44});

/* ---------------- the label the feature catalogue asks for: the data is sample data ---------------- */
const NOTE_L=M.el('div','wi-note','<span class="en">Sample data</span><span class="sep">·</span><span class="ar">بيانات تجريبية</span>',TXT);
M.track(t=>{const v=dec(t,K_PAGE,K_PAGE+0.5)*(t<K_BRK?1:0);if(show(NOTE_L,v>0.001))NOTE_L.style.opacity=f3(v);});

/* ================= k56-70 the end: on the hit a capsule blooms round "Book your demo.", then the URL ================= */
jt({at:K_HIT+0.25,out:B(59.4),y:466,size:64,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:40,fade:[B(58.75),B(59.35)]}).style.zIndex='2';
const CAP=M.el('div','jcap','<span>marsadnasl.com</span>',TXT), capT=CAP.firstChild;
const MKE=M.el('img','jmk',null,TXT);MKE.src='assets_logo_m.png';
const BOOK=M.el('div','jbook',`<span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span>`,TXT);
const FTR=M.el('div','jft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',TXT);
M.track(t=>{
  const on=t>=K_HIT;[CAP,MKE,BOOK,FTR].forEach(e=>show(e,on));if(!on)return;
  const pin=dec(t,K_HIT,K_HIT+0.55), ps=dec(t,B(58.75),B(59.75)+0.3), k=1-ps;
  const w=lerp(lerp(420,1320,pin),760,ps), h=lerp(lerp(300,380,pin),150,ps), cy=lerp(540,560,dec(t,B(60),B(61)));
  st(CAP,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(960-w/2)}px,${f1(cy-h/2)}px)`,opacity:f3(P(t,K_HIT,K_HIT+0.3)),
    boxShadow:`inset 0 0 0 2px rgba(255,215,250,0.95),inset 0 0 ${f1(16+12*k)}px ${f1(5+5*k)}px rgba(214,70,240,0.85),`+
      `inset 0 0 ${f1(46+54*k)}px ${f1(14+20*k)}px rgba(110,30,200,0.55),0 0 ${f1(26+16*k)}px 3px rgba(214,70,240,0.5),0 0 ${f1(70+40*k)}px 10px rgba(122,40,220,0.3)`});
  const pt=dec(t,B(59.55),B(59.55)+0.5);st(capT,{opacity:f3(pt),filter:pt<1?`blur(${f2((1-pt)*8)}px)`:'none'});
  const pm=dec(t,B(60),B(60)+0.8);st(MKE,{opacity:f3(pm),transform:`translate(865px,${f1(262+(1-pm)*16)}px) scale(${f3(0.92+0.08*pm)})`});
  const pb=dec(t,B(60.5),B(60.5)+0.7);st(BOOK,{top:'700px',opacity:f3(pb),transform:`translateY(${f1((1-pb)*14)}px)`});
  st(FTR,{opacity:f3(0.55*dec(t,B(61),B(61)+0.8))});
});
M.punch(K_TURN,{amp:0.015});                // the two big hits only
M.punch(K_HIT,{amp:0.015});
M.start();
