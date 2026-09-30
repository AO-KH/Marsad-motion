/* Marsad — Business Pulse, a 30 s campaign film in Marsad's main theme (films/pulse-30), made with the marsad-campaign
   skill from its starter: the look of the client's two approved films, the 48 s film (films/style-jupiter) and the
   ontology film (films/ontology-main-theme). The shots grammar (hard cuts on beats), since Business Pulse is best shown
   by its page and its real parts, close up and in 3D.
   House rules: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no orb
   behind the logo, "Book your demo" and marsadnasl.com at the end, effects on the transitions only.
   Music: the client's "Joyful Rhythm Walk Funk" (lightbeatsmusic, Pixabay #513936), 115 BPM; the 30 s edit, song beats
   8-47 then 56-72: the groove from film k8, the track's own one-bar break on k44-47, the hit on k48. B(k) = k x 0.5217 s.
     k0-8    hook     the company's numbers, charts and files adrift in depth between three grey lenses; the numbers
                      keep changing; "Your numbers change every day."; from k6.25 they fly into the centre
     k8-16   the turn (the groove) the mark lands and a violet lens bursts out of it; the numbers ride its orbits,
                      glowing now; "Marsad reads them for you."
     k16-24  Pulse    the Business Pulse page rises, flat; the cursor clicks «توليد توصيات» (k19); the three
                      recommendations fly into the page and float out of it as it tilts; "Recommendations from your own
                      numbers."
     k24-32  the three the recommendations as cards in 3D, turning; as each word lands its card's tag lifts out, glowing;
                      "Your products. Your branches. Your stock."
     k32-40  truth    a bright lens; the slow-movers recommendation; its «مبني على بياناتك» pill lifts out, glowing green;
                      "Computed from your data. Nothing made up."
     k40-48  name     "Meet Business Pulse.", held through the track's break (k44-47), the page far behind
     k48-57  end      on the hit a capsule blooms round "Book your demo." and shrinks into the marsadnasl.com capsule;
                      the mark; "Book your demo · احجز عرضك التجريبي"
   Truth: the Business Pulse page, its button, its three recommendations and their tags are the app's own (site_pages/
   pulse.png, site kit); "Nothing made up" is the page's own claim ("تُحسب المؤشرات أولاً ثم يصيغها الذكاء الاصطناعي دون
   اختلاق"); the file names are the Projects page's. Renderings: the lenses, orbits and dust; the metric chips and their
   numbers and the small charts in the hook (invented sample data); the page before generating (its rows' slots
   empty, films/pulse-30/pages/pulse_base.png); the empty slots the lifted tags leave (pulse_rows_base.png). */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const T3=(x,y,w,h,{z=0,rx=0,ry=0,rz=0,s=1}={})=>`translate3d(${f1(x-w/2)}px,${f1(y-h/2)}px,${f1(z)}px) rotateX(${f2(rx)}deg) rotateY(${f2(ry)}deg) rotateZ(${f2(rz)}deg) scale(${f3(s)})`;
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;
const NS='http://www.w3.org/2000/svg';

const K_TURN=B(8), K_PUL=B(16), K_REC=B(24), K_TRU=B(32), K_NAME=B(40), K_HIT=B(48);
window.CUTS=[K_PUL,K_REC,K_TRU,K_NAME,K_HIT];   // hard cuts: motion blur never mixes two shots. The turn (k8) is continuous

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
function lens(x,y,r,o={}){                  // (lx, ly) x r: the gradient's inner point, so the rim is widest opposite it
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
const DUST=[];{const r=M.mulberry(77);for(let i=0;i<170;i++)DUST.push({x:r()*1920,y:r()*1080,s:0.8+r()*1.9,vx:(r()-0.35)*7,vy:-(2+r()*8),ph:r()*6.3,f:0.4+r()*0.6});}
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
  if(t<K_PUL){                              // three grey lenses drift apart; on the turn a violet lens bursts out of the mark
    const u=P(t,0,K_TURN), pa=dec(t,0.05,1.3), out=1-P(t,K_TURN-0.05,K_TURN+0.55), pal=mixPal(GREY), gc=mixGlow(GREY);
    lens(170-110*u,700+30*u,500,{a:pa*out,lx:0.2,ly:-0.1,pal,gc});lens(1780+90*u,560-20*u,540,{a:pa*out,lx:-0.2,ly:-0.1,pal,gc});
    lens(960+60*u,250-60*u,600*(1.05-0.08*u),{a:pa*out,lx:0.12,ly:-0.3,pal,gc});
    if(t>=K_TURN){const pb=ez.outC(P(t,K_TURN,K_TURN+0.9));lens(960,540,lerp(40,1010,pb)-14*P(t,K_TURN+0.9,K_PUL),{lx:-0.05,ly:-0.12});
      orbits(t,P(t,K_TURN+0.5,K_TURN+1.6));}
    dust(t,1);
  }else if(t<K_REC){lens(1560,1880,1250,{lx:-0.12,ly:-0.1});haze(760,520,900,'150,40,220',0.14);dust(t,0.9);
  }else if(t<K_TRU){lens(960,210,850,{lx:0,ly:-0.32});dust(t,0.85);
  }else if(t<K_NAME){lens(960,540,1100,{pal:RIM_B,glow:0,lx:0,ly:0});
  }else if(t<K_HIT){lens(960,2600-50*P(t,K_NAME,K_HIT),1650,{a:0.55,lx:0,ly:-0.1});dust(t,0.8);
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
// a part of a page: a box of the screenshot's own pixels, a child of the page (so it moves with it, and out of it)
const part=(parent,src,[x,y,w,h],r=16,cls='')=>{const e=M.el('div','mt-part'+cls,null,parent);
  st(e,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',borderRadius:r+'px',backgroundImage:`url(${src})`,backgroundPosition:`${-x}px ${-y}px`});return e;};
const PULSE='site_pages/pulse.png', PULSE_ROWS='films/pulse-30/pages/pulse_rows_base.png';
const ROWS=[[184,640,1534,118],[184,776,1534,118],[184,912,1534,118]];
const CATP=[[1514,707,171,36],[1576,843,109,36],[1520,979,165,36]], OKP=[[1350,707,154,36],[1412,843,154,36],[1356,979,154,36]];

/* ================= k0-8 the hook: the company's numbers, charts and files adrift in depth, grey ================= */
const SH1=M.el('div','mt-shot',null,SCN), D1=M.el('div','mt-3d',null,SH1);
const MK={x:960,y:540};                     // where the mark lands on the turn
// the numbers change as they drift (steps on the frame's time, off the beat)
const METRICS=[['مبيعات · الرياض',['1,284,500','1,291,200','1,287,900','1,296,400']],['المخزون · جدة',['412','407','401','398']],
  ['المرتجعات',['+3.1%','+3.4%','+2.9%','+3.2%']],['فواتير الربع الثالث',['1,204','1,211','1,219','1,226']],
  ['فرع الدمام',['−8.2%','−7.9%','−8.6%','−8.4%']],['بطيئة الحركة',['37','38','39','41']]];
const SPARKS=['المبيعات اليومية','حركة المخزون','أداء الفروع'];
const FILES=['invoices_q3.xlsx','branch_returns.csv','suppliers_2025.xlsx'];
const POS=[{x:300,y:230,z:-80,rx:-8,ry:18},{x:780,y:150,z:-340,rx:-12,ry:8},{x:1230,y:175,z:-60,rx:-10,ry:-10},{x:1660,y:260,z:-240,rx:-6,ry:-20},
  {x:270,y:840,z:-200,rx:10,ry:20},{x:720,y:915,z:-60,rx:14,ry:10},{x:1210,y:895,z:-300,rx:12,ry:-8},{x:1670,y:815,z:-40,rx:8,ry:-18},
  {x:520,y:340,z:-160,rx:-6,ry:12},{x:1400,y:330,z:-260,rx:-6,ry:-12},{x:560,y:740,z:-240,rx:8,ry:12},{x:1370,y:720,z:-110,rx:8,ry:-12}];
const DRIFT=[];
METRICS.forEach(([l,vals],i)=>{const e=M.el('div','pm-chip',`<span class="l">${l}</span><span class="n">${vals[0]}</span>`,D1);
  DRIFT.push({kind:'m',e,n:e.querySelector('.n'),vals,ph:0.37*i});});
SPARKS.forEach((l,i)=>{const e=M.el('div','pm-spark',`<span class="l">${l}</span>`,D1);
  const s=document.createElementNS(NS,'svg');s.setAttribute('width',228);s.setAttribute('height',60);s.setAttribute('class','sp');e.appendChild(s);
  const pl=document.createElementNS(NS,'polyline');pl.setAttribute('fill','none');pl.setAttribute('stroke','#8C889B');pl.setAttribute('stroke-width','2.4');
  pl.setAttribute('stroke-linejoin','round');s.appendChild(pl);DRIFT.push({kind:'s',e,pl,seed:11+i});});
FILES.forEach(n=>{const e=M.el('div','pm-file',`${SK.ic('file',20,'#9A97A6',2)}<span>${n}</span>`,D1);DRIFT.push({kind:'f',e});});
const ORDER=[0,6,9,1,4,7,10,2,5,8,11,3];     // which slot each thing takes (spread the kinds over the frame)
DRIFT.forEach((d,i)=>{Object.assign(d,POS[ORDER[i]]);d.i=i;d.t0=B(0.25+0.22*i);d.ta=B(6.25+0.125*ORDER[i]);});
const noise=(s,x)=>{const r=k=>{const v=Math.sin((k+1)*12.9898+s*78.233)*43758.5453;return v-Math.floor(v);},k=Math.floor(x),f=x-k,u=f*f*(3-2*f);return lerp(r(k),r(k+1),u);};
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
    if(p.kind==='s'){let d='';for(let j=0;j<=24;j++){const v=noise(p.seed,j*0.45+q0*0.9);d+=`${f1(j*9.5)},${f1(52-44*v)} `;}p.pl.setAttribute('points',d);}
    const W=p.W??=p.e.offsetWidth||200, H=p.H??=p.e.offsetHeight||50;
    let q=drift(p,t),sc=1;
    const f0=p.ta-0.85,u=P(t,f0,p.ta);
    if(u>0){                               // the pull: a curved flight into the mark, faster and smaller as it arrives
      const a=drift(p,f0),e=ez.inC(u),dx=MK.x-a.x,dy=MK.y-a.y,d=Math.hypot(dx,dy)||1,sw=150*Math.sin(Math.PI*u);
      q={x:lerp(a.x,MK.x,e)-dy/d*sw, y:lerp(a.y,MK.y,e)+dx/d*sw, z:lerp(a.z,0,e), o:Math.min(1,a.o+u*2.2)*(1-P(u,0.8,1)),
        bl:a.bl*(1-u), rx:a.rx*(1-e), ry:a.ry*(1-e)};
      sc=lerp(1,0.25,e);
    }
    st(p.e,{opacity:f3(q.o),filter:q.bl>0.3?`blur(${f2(q.bl)}px)`:'none',transform:T3(q.x,q.y,W,H,{z:q.z,rx:q.rx,ry:q.ry,s:sc})});
  }
});
jt({at:B(0.875),out:B(6.2),y:432,size:84,words:['Your','numbers','change',{t:'every',d:1},{t:'day.',d:1}],ar:'أرقامك تتغيّر كل يوم.',fade:[B(5.6),B(6.2)]});

/* ================= k8-16 the turn: the mark lands, a lens bursts out of it; the numbers ride its orbits, glowing ================= */
const MKe=mark(SCN,300);MKe.e.style.zIndex='1';   // the riders pass behind it on the orbits' far side
const T_UP=B(9.5);
M.track(t=>{
  const on=t>=B(6.25)&&t<K_PUL;MKe.e.style.display=on?'':'none';if(!on)return;
  const p=P(t,K_TURN,K_TURN+0.75), sc=t<K_TURN?0.86:0.86+0.14*ez.dec(p)+0.03*Math.sin(Math.PI*Math.min(1,p*1.3))*(p<1?1:0);
  const pu=io(t,T_UP,T_UP+1.1), y=lerp(MK.y,300,pu), s=sc*lerp(1,0.55,pu);
  st(MKe.e,{transform:`translate(${f1(MK.x-150)}px,${f1(y-114.5)}px) scale(${f3(s)})`,opacity:f3(t<K_TURN?1:ez.dec(Math.min(1,p*1.6)))});
  const pre=0.35*io(t,B(6.25),K_TURN), bloom=0.9*dec(t,K_TURN,K_TURN+0.3)*(1-0.55*io(t,K_TURN+0.4,K_TURN+2));
  MKe.gl.style.opacity=f3(t<K_TURN?pre:Math.max(bloom,0.35*(1-dec(t,K_TURN,K_TURN+0.3))));
  MKe.m.style.opacity=t<K_TURN?'0':'1';
});
const RIDERS=[['1,296,400',0,-0.9],['−8.4%',0,2.24],['398',1,0.6],['+3.2%',1,3.74]].map(([n,k,ph],i)=>({k,ph,t0:K_TURN+0.6+i*S16,
  e:M.el('div','pm-orb',`<i></i><span>${n}</span>`,SCN)}));
M.track(t=>{
  for(const r of RIDERS){
    const on=inShot(t,r.t0,K_PUL);if(!show(r.e,on))continue;
    const q=orbAt(r.k,t,r.ph), fr=0.5+0.5*Math.max(0,q.front), a=dec(t,r.t0,r.t0+0.6)*(0.35+0.65*fr);
    st(r.e,{opacity:f3(a),transform:`translate(${f1(q.x)}px,${f1(q.y)}px) translate(-50%,-50%) scale(${f3(0.78+0.22*fr)})`,zIndex:q.front>0?'2':'0'});
  }
});
jt({at:B(10),out:K_PUL,y:470,size:96,step:S16*1.5,words:[{t:'Marsad',g:1},'reads','them','for','you.'],ar:'مرصد يقرأ أرقامك عنك.',arSize:44});

/* ================= k16-24 Business Pulse: one click on «توليد توصيات»; the recommendations fly in and float out ================= */
const SH3=M.el('div','mt-shot',null,SCN), D3=M.el('div','mt-3d',null,SH3);
const PG=M.el('div','mt-page p3d',null,D3);PG.style.backgroundImage='url(films/pulse-30/pages/pulse_base.png)';
const BTN=part(PG,PULSE,[183,326,236,71],14,' btn');
const RW3=ROWS.map((r,i)=>({i,e:part(PG,PULSE,r,16),d:[60,95,130][i]}));
const CUR=M.el('div','pm-cur',`<svg viewBox="0 0 32 32" width="54" height="54"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#140B24" stroke-width="1.6" stroke-linejoin="round"/></svg>`,SH3);
const PS=0.72, PC={x:960,y:610};            // the page flat for the click: its box on screen is (PC - size*PS/2) + natural*PS
const BTN_AT={x:PC.x-1896*PS/2+(183+196)*PS, y:PC.y-1060*PS/2+(326+60)*PS};   // the tip lands on the button's lower right, by its icon
const T_CLK=B(19), T_FLY=T_CLK+0.25;
M.track(t=>{
  if(!show(SH3,inShot(t,K_PUL,K_REC)))return;
  const pe=io(t,K_PUL,K_PUL+1.2), pt=io(t,T_CLK+0.45,T_CLK+2.2), drift=P(t,T_CLK+2.2,K_REC);
  st(PG,{opacity:f3(dec(t,K_PUL,K_PUL+0.5)),transform:T3(PC.x+40*pt+20*drift,PC.y+140*(1-pe)-20*pt,1896,1060,
    {z:-320*(1-pe)-140*pt,rx:18*(1-pe)+11*pt,ry:-17*pt-2*drift,s:PS})});
  const press=Math.sin(Math.PI*P(t,T_CLK-0.05,T_CLK+0.18)), gl=dec(t,T_CLK,T_CLK+0.2)*(1-io(t,T_CLK+0.3,T_CLK+1.4));
  st(BTN,{transform:`translateZ(${f1(2+26*gl)}px) scale(${f3(1-0.05*press)})`,boxShadow:`0 8px 22px rgba(118,40,200,0.35),0 0 ${f1(36*gl)}px ${f1(6*gl)}px rgba(222,13,255,${f3(0.6*gl)})`});
  RW3.forEach(r=>{const t0=T_FLY+r.i*S8, e=dec(t,t0,t0+0.6), l=dec(t,B(21.5)+r.i*S16,B(21.5)+r.i*S16+0.6);
    if(!show(r.e,t>=t0-0.01))return;
    st(r.e,{opacity:f3(Math.min(1,e*2)),filter:e<1?`blur(${f2((1-e)*8)}px)`:'none',transform:`translateZ(${f1(lerp(520,0,e)+r.d*l)}px)`,
      boxShadow:`0 0 0 ${f1(2.5*l)}px rgba(236,205,255,${f3(0.95*l)}),0 ${f1(26*l)}px ${f1(60*l)}px rgba(30,4,70,${f3(0.4*l)}),0 0 ${f1(40*l)}px rgba(206,64,240,${f3(0.35*l)})`});});
  const pm=io(t,B(17.6),T_CLK-0.06), out=io(t,T_CLK+0.5,T_CLK+1.2);   // the cursor: in, press, away
  st(CUR,{opacity:f3(dec(t,B(17.6),B(17.6)+0.35)*(1-out)),transform:`translate(${f1(lerp(1560,BTN_AT.x,pm)+160*out-10)}px,${f1(lerp(1010,BTN_AT.y,pm)+110*out-5)}px) scale(${f3(1-0.12*press)})`});
});
jt({at:B(16.5),out:K_REC,y:64,size:60,words:['Recommendations','from',{t:'your',g:1},{t:'own',g:1},{t:'numbers.',g:1}],ar:'توصيات مبنية على أرقامك.',arSize:36});

/* ================= k24-32 the three recommendations as cards in 3D; each one's tag lifts out as its word lands ================= */
const SH4=M.el('div','mt-shot',null,SCN), D4=M.el('div','mt-3d',null,SH4);
const GRP=M.el('div','pm-grp',null,D4);
const RW4=ROWS.map((r,i)=>{const e=M.el('div','mt-card3',null,GRP);
  st(e,{width:r[2]+'px',height:r[3]+'px',backgroundImage:`url(${PULSE_ROWS})`,backgroundPosition:`${-r[0]}px ${-r[1]}px`});
  const cat=part(e,PULSE,[CATP[i][0]-r[0],CATP[i][1]-r[1],CATP[i][2],CATP[i][3]],18);cat.style.backgroundPosition=`${-CATP[i][0]}px ${-CATP[i][1]}px`;
  const ok=part(e,PULSE,[OKP[i][0]-r[0],OKP[i][1]-r[1],OKP[i][2],OKP[i][3]],18);ok.style.backgroundPosition=`${-OKP[i][0]}px ${-OKP[i][1]}px`;
  return {i,e,cat,y:[-190,0,190][i],z:[-230,0,230][i],t0:B(24.75)+i*B(1)};});
M.track(t=>{
  if(!show(SH4,inShot(t,K_REC,K_TRU)))return;
  const sw=io(t,K_REC,K_REC+0.95), drift=P(t,K_REC+0.95,K_TRU);
  SH4.style.opacity=f3(dec(t,K_REC,K_REC+0.4));   // fade the shot, not the group: opacity on a 3D group flattens it
  st(GRP,{transform:`translate3d(${f1(lerp(1500,960,sw)-40*drift)}px,${f1(590)}px,${f1(lerp(-700,-120,sw))}px) rotateX(8deg) rotateY(${f2(lerp(-58,-22,sw)+16*drift)}deg) scale(0.84)`});
  RW4.forEach(r=>{const h=dec(t,r.t0,r.t0+0.55), rim=0.35+0.65*h;
    st(r.e,{transform:`translate3d(${f1(-767)}px,${f1(r.y-59)}px,${f1(r.z)}px)`,
      boxShadow:`0 0 0 ${f1(1.5+1.5*h)}px rgba(236,205,255,${f3(0.6*rim)}),0 0 ${f1(24+26*h)}px rgba(206,64,240,${f3(0.3+0.25*h)}),0 30px 70px rgba(0,0,0,0.45)`});
    st(r.cat,{transform:`translateZ(${f1(80*h)}px) scale(${f3(1+0.1*h)})`,boxShadow:`0 0 0 ${f1(2*h)}px rgba(236,205,255,${f3(0.95*h)}),0 0 ${f1(34*h)}px rgba(206,64,240,${f3(0.55*h)}),0 ${f1(18*h)}px ${f1(40*h)}px rgba(30,4,70,${f3(0.35*h)})`});});
});
jt({at:B(24.5),out:K_TRU,y:64,size:60,words:['Your','products.','Your','branches.',{t:'Your',g:1},{t:'stock.',g:1}],ar:'منتجاتك. فروعك. مخزونك.',arSize:36});

/* ================= k32-40 the truth, on a bright lens: its «مبني على بياناتك» pill lifts out, glowing green ================= */
const SH5=M.el('div','mt-shot',null,SCN), D5=M.el('div','mt-3d',null,SH5);
const R5=M.el('div','mt-card3 soft',null,D5);
st(R5,{width:'1534px',height:'118px',backgroundImage:`url(${PULSE_ROWS})`,backgroundPosition:`${-ROWS[2][0]}px ${-ROWS[2][1]}px`});
const C5=part(R5,PULSE,[CATP[2][0]-ROWS[2][0],CATP[2][1]-ROWS[2][1],CATP[2][2],CATP[2][3]],18);C5.style.backgroundPosition=`${-CATP[2][0]}px ${-CATP[2][1]}px`;
const O5=part(R5,PULSE,[OKP[2][0]-ROWS[2][0],OKP[2][1]-ROWS[2][1],OKP[2][2],OKP[2][3]],18);O5.style.backgroundPosition=`${-OKP[2][0]}px ${-OKP[2][1]}px`;
const T_OK=B(34.5);
M.track(t=>{
  if(!show(SH5,inShot(t,K_TRU,K_NAME)))return;
  const pe=dec(t,K_TRU+0.1,K_TRU+0.8), u=P(t,K_TRU,K_NAME);
  st(R5,{opacity:f3(pe),filter:pe<1?`blur(${f2((1-pe)*8)}px)`:'none',transform:T3(960,660+(1-pe)*60,1534,118,{rx:lerp(16,5,u),ry:lerp(-6,4,u),s:1.02*(1+0.04*u)})});
  const l=dec(t,T_OK,T_OK+0.6);
  st(O5,{transform:`translate3d(${f1(-22*l)}px,${f1(4*l)}px,${f1(110*l)}px) scale(${f3(1+0.1*l)})`,
    boxShadow:`0 0 0 ${f1(2.5*l)}px rgba(120,220,160,${f3(0.95*l)}),0 0 ${f1(46*l)}px ${f1(6*l)}px rgba(40,190,110,${f3(0.5*l)}),0 ${f1(22*l)}px ${f1(46*l)}px rgba(6,40,20,${f3(0.3*l)})`});
});
jt({at:B(32.4),out:K_NAME,y:250,size:76,cls:'dark',step:S16*1.5,words:['Computed','from','your','data.','\n','Nothing','made','up.'],ar:'محسوبة من بياناتك… دون اختلاق.',arSize:42});

/* ================= k40-48 the name, held through the track's break (k44-47); the page far behind ================= */
const SH6=M.el('div','mt-shot',null,SCN), D6=M.el('div','mt-3d',null,SH6);
const PG6=M.el('div','mt-page',null,D6);PG6.style.backgroundImage=`url(${PULSE})`;
M.track(t=>{
  if(!show(SH6,inShot(t,K_NAME,K_HIT)))return;
  const u=P(t,K_NAME,K_HIT), pe=dec(t,K_NAME,K_NAME+1);
  st(PG6,{opacity:f3(0.32*pe),filter:'blur(4px)',transform:T3(960,1160-80*u,1896,1060,{z:-2100,rx:lerp(64,58,u),s:1})});
});
jt({at:B(40.3),out:K_HIT,y:330,size:92,words:['Meet',{t:'Business',g:1},{t:'Pulse.',g:1}],ar:'تعرّف على نبض الأعمال.',arSize:44});

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
