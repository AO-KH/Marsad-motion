/* Marsad — the ontology, 30 s campaign film, in the main theme (films/ontology-main-theme). The client chose the 48 s
   film's theme (films/style-jupiter) as Marsad's main theme: near-black with drifting dust; lenses with dark bodies and
   bright rims in Marsad's indigo, violet, magenta and pink; white type in Inter (medium) whose words blur in, with grey
   and gradient words and the Arabic under it; the app's parts with glowing rims; the glowing capsule at the end.
   The story and the drawing are films/ontology-foundry's (after Palantir Foundry's ontology animation and Ringwriter):
   rings of icons of the company's data, then a drawing in perspective of the tiers (sources, the ontology, the app's
   pages) with cables flowing between them, then the whole stack.
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects on three transitions: a whoosh and
   the cinematic hit on the lens's burst (k8), a quiet whoosh on the pull-back (k32), the whoosh and the hit on the end.
   Music: the client's "Joyful Rhythm Walk Funk" (lightbeatsmusic, Pixabay #513936), 115 BPM; the same edit as the other
   ontology cuts: song beats 8-47 then 56-72 (the break on film k44-47, the hit on k48). B(k) = k x 0.5217 s.
     k0-8    hook     rings of icons of the company's data (Odoo's database, WhatsApp, spreadsheets, PDFs, invoices,
                      customers, products, notes...) glowing on black, between two lenses; "Your company's data is
                      everywhere."; from k6.75 they spin into the centre
     k8-16   connect  (the groove) a lens bursts out of the centre; inside it, the drawing: the sources' plates, Odoo and
                      WhatsApp and the company's files, cables flowing up; "Connect your sources."
     k16-24  unify    the camera cranes up to the ontology: seven types on small lenses, six links with their names, the
                      WhatsApp note as the app shows it; "Unify them in one ontology."
     k24-32  act      up to the app's pages (Business Pulse, Decisions, the Assistant), lying on the top tier; they stand
                      up as glass slabs (bezel, thickness, a reflection on the plate) in an arc facing the middle, and
                      their parts float out of them while the camera circles; the restock action rises from Product to
                      Decisions and its "Action executed · PO-2291" card lifts out, glowing green; "Monitor and act."
     k32-44  model    the pull-back to the whole stack over a glowing horizon; "Every system. One living model."
     k42.5-48         "Meet the Marsad ontology." through the track's break
     k48-57  end      on the hit the 48 s film's end: a capsule blooms round "Book your demo." and shrinks into the
                      marsadnasl.com capsule; the mark; "Book your demo · احجز عرضك التجريبي"
   Truth: the object types, their links (Arabic labels and API names), the WhatsApp note and its customer (the app's
   search row), the file names, the page screenshots and the executed action's text are the app's own (site kit,
   site_pages/); the parts floating out of the pages are the screenshots' own pixels. Renderings: the rings of icons, the
   tiered drawing (how Marsad works, drawn), the isometric icons, the lens pads, the cables, the glass slabs and their
   reflections, the empty slots the floating parts leave in the pages (films/ontology-main-theme/pages/*_base.png), the
   action's pill and its path. */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;
const NS='http://www.w3.org/2000/svg';
function sv(parent,tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);parent.appendChild(e);return e;}
function svgEl(parent){const s=document.createElementNS(NS,'svg');s.setAttribute('class','om-svg');s.setAttribute('width',1920);s.setAttribute('height',1080);parent.appendChild(s);return s;}

const K_TURN=B(8), K_ONT=B(16), K_APP=B(24), K_ALL=B(32), K_END=B(44), K_HIT=B(48);
window.CUTS=[];                          // one continuous film: the icons spin into the centre, a lens bursts, the camera cranes

/* ---------------- the stage (the 48 s film's): near black, lenses, haze, dust ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','om-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
function lens(x,y,r,o={}){                // a dark body, the rim brightening from indigo through violet and magenta to pink-white
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
const DUST=[];{const r=M.mulberry(77);for(let i=0;i<170;i++)DUST.push({x:r()*1920,y:r()*1080,s:0.8+r()*1.9,vx:(r()-0.35)*7,vy:-(2+r()*8),ph:r()*6.3,f:0.4+r()*0.6});}
function dust(t,a){for(const d of DUST){const x=((d.x+d.vx*t)%1940+1940)%1940-10, y=((d.y+d.vy*t)%1100+1100)%1100-10,
  tw=0.55+0.45*Math.sin(t*d.f*2+d.ph);g.fillStyle=`rgba(236,214,255,${f3(a*tw*0.55)})`;g.fillRect(x,y,d.s,d.s);}}
const RC={x:960,y:430};                  // the rings' centre; the lens bursts out of it
M.track(t=>{
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
  if(t<K_TURN+0.6){                      // the hook: two lenses at the sides drift apart; a violet haze behind the rings
    const u=P(t,0,K_TURN), pa=dec(t,0.05,1.3), out=1-P(t,K_TURN-0.1,K_TURN+0.5);
    lens(130-110*u,820+30*u,470,{a:pa*out,lx:0.22,ly:-0.12});lens(1800+90*u,300-30*u,500,{a:pa*out,lx:-0.22,ly:0.1});
    haze(RC.x,RC.y,760,'150,40,220',0.16*pa*out);
  }
  if(t>=K_TURN&&t<K_END+0.8){            // the burst: a lens grows out of the centre past the frame; its body is the drawing's ground
    const pb=ez.outC(P(t,K_TURN,K_TURN+0.9)), fo=1-P(t,K_END,K_END+0.8);
    lens(RC.x,RC.y+80*P(t,K_TURN,K_END),lerp(40,1700,pb),{lx:-0.04,ly:-0.1,a:fo});
    if(t>=K_ALL)lens(960,2140,1400,{a:dec(t,B(32.5),B(34.5))*fo,lx:0,ly:-0.1});   // the whole stack stands over a glowing horizon
  }
  if(t>=K_END)haze(960,540,1000,'150,40,220',0.16*P(t,K_END,K_END+0.5));
  if(t<K_TURN){const lg=g.createLinearGradient(0,660,0,1080);lg.addColorStop(0,'rgba(6,5,14,0)');lg.addColorStop(1,'rgba(6,5,14,0.92)');g.fillStyle=lg;g.fillRect(0,660,1920,420);}
  dust(t,t<K_TURN?1:t<K_END?0.75:0.6);
});

/* ---------------- type (the 48 s film's): words blur in where they stand, the Arabic after them ---------------- */
function jt(o){
  const e=M.el('div','jt',null,TXT);st(e,{top:o.y+'px'});
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

/* ---------------- the isometric icons (films/ontology-foundry's), in the theme's colours: dark faces, light lines, violet ---------------- */
const INK='#EBDDFF', W0='#241A3E', W1='#1A1230', W2='#120C24', AC='#B36BFF', AC2='#FF8BEF', ACL='#3B2166';
const I=(x,y,z)=>[(x-y)*0.866,(x+y)*0.5-z];
const pts=a=>a.map(p=>f1(p[0])+','+f1(p[1])).join(' ');
const poly=(a,fill)=>`<polygon points="${pts(a)}" fill="${fill}"/>`;
function box(x,y,z,w,d,h,c=[W0,W1,W2]){
  return poly([I(x,y+d,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x,y+d,z+h)],c[1])+poly([I(x+w,y,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x+w,y,z+h)],c[2])+
    poly([I(x,y,z+h),I(x+w,y,z+h),I(x+w,y+d,z+h),I(x,y+d,z+h)],c[0]);}
const onXF=(X,y1,z1,art)=>{const b=I(X,y1,z1);return `<g transform="matrix(0.866 -0.5 0 1 ${f1(b[0])} ${f1(b[1])})">${art}</g>`;};
const onYF=(Y,x0,z1,art)=>{const b=I(x0,Y,z1);return `<g transform="matrix(0.866 0.5 0 1 ${f1(b[0])} ${f1(b[1])})">${art}</g>`;};
const rect=(x,y,w,h,f,o=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" opacity="${o}"/>`;
function cyl(z,h,r,top){const rx=r*1.2247, ry=r*0.7071, y0=-z, y1=-z-h;
  return `<path d="M${f1(-rx)} ${f1(y1)} V${f1(y0)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(rx)} ${f1(y0)} V${f1(y1)}" fill="${W1}"/><ellipse cx="0" cy="${f1(y1)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${top}"/>`;}
function sheet(h,art){return box(-4,-30,0,8,60,h,[W0,W1,W0])+onXF(4,30,h,art);}
const LINES=(n,y0,w=[40,34,40,28,36])=>[...Array(n).keys()].map(k=>rect(9,y0+k*8,w[k%w.length],3.4,INK,0.6)).join('');
const badge=(c,t)=>rect(8,8,26,12,c)+`<text x="21" y="17.5" font-size="8" font-family="Inter" font-weight="700" fill="#fff" text-anchor="middle" stroke="none">${t}</text>`;
const ICON={
  box: ()=>box(-32,-32,0,64,64,54)+poly([I(-32,-5,54),I(32,-5,54),I(32,5,54),I(-32,5,54)],AC)+poly([I(32,5,0),I(32,-5,0),I(32,-5,54),I(32,5,54)],AC),
  store:()=>box(-34,-28,0,68,56,48)+box(-38,-32,48,76,64,8,[W0,W2,W2])+
    onYF(28,-34,40,[0,1,2,3,4,5].map(k=>rect(k*11.33,0,11.33,12,k%2?W0:AC)).join('')+rect(6,18,30,18,ACL))+
    onXF(34,28,48,rect(20,18,16,30,W2)+rect(4,6,12,10,ACL)),
  doc: ()=>sheet(80,rect(8,8,44,9,AC)+LINES(4,24)+rect(28,62,24,6,AC2)),
  line:()=>box(-4,-24,0,8,48,62,[W0,W1,W0])+onXF(4,24,62,rect(7,8,34,3.4,INK,0.6)+rect(5,20,38,11,AC)+rect(7,39,30,3.4,INK,0.6)+rect(7,49,34,3.4,INK,0.6)),
  note:()=>box(-4,-32,16,8,64,48,[W0,W1,ACL])+poly([I(4,-20,16),I(4,-10,16),I(4,-26,2)],ACL)+onXF(4,32,64,LINES(3,12,[44,36,26])),
  person:()=>box(-26,-17,0,52,34,40)+onXF(26,17,40,`<polygon points="15,0 19,0 21,6 17,26 13,6" fill="${AC2}"/>`)+
    `<circle cx="0" cy="-62" r="17" fill="${W0}"/><path d="M-10 -58 Q0 -50 10 -58" fill="none"/>`,
  city:()=>box(-36,-4,0,22,22,66)+box(-10,-30,0,26,26,100,[AC,W1,W2])+box(16,4,0,22,22,52)+
    onXF(16,-4,100,LINES(6,10,[16,16,16]))+onXF(38,26,52,LINES(3,10,[12,12,12])),
  db:  ()=>cyl(0,20,30,W0)+cyl(24,20,30,W0)+cyl(48,20,30,AC),
  chat:()=>box(-4,-32,16,8,64,50,[W0,W1,AC])+poly([I(4,-22,16),I(4,-12,16),I(4,-28,2)],AC)+onXF(4,32,66,LINES(3,12,[44,36,26])),
  xlsx:()=>sheet(76,badge('#1D7A46','XLSX')+LINES(4,30)),
  csv: ()=>sheet(76,badge('#0E8A7A','CSV')+LINES(4,30)),
  pdf: ()=>sheet(76,badge('#C8322B','PDF')+LINES(4,30)),
};
const ICS=2.3;

/* ================= k0-8 the hook: rings of icons, the company's data (after Ringwriter), glowing on black ================= */
const HK=svgEl(SCN);HK.style.filter='drop-shadow(0 0 5px rgba(206,64,240,0.55))';
HK.style.webkitMaskImage=HK.style.maskImage='linear-gradient(to bottom,#000 0%,#000 55%,rgba(0,0,0,0.12) 74%,rgba(0,0,0,0) 84%)';   // clear under the line
const KINDS=['db','chat','xlsx','doc','store','csv','note','box','pdf','line','person','city'];
const HDEF=sv(HK,'defs',{});
KINDS.forEach(k=>{const e=sv(HDEF,'g',{id:'hi_'+k});e.innerHTML=ICON[k]();e.querySelectorAll('*').forEach(x=>x.setAttribute('vector-effect','non-scaling-stroke'));});
const rnd=M.mulberry(4242);
const RINGS=[...Array(8).keys()].map(i=>{
  const r=70+92*i+7*i*i, sz=0.3+0.105*i, n=Math.max(8,Math.floor(2*Math.PI*r/(110*sz*1.35)));
  const rg=sv(HK,'g',{});
  sv(rg,'circle',{cx:RC.x,cy:RC.y,r:f1(r-(i?(92+14*i)*0.5:40)),fill:'none',stroke:'rgba(236,214,255,0.24)','stroke-width':1.4,'stroke-dasharray':'0.1 9','stroke-linecap':'round'});
  const items=[...Array(n).keys()].map(j=>({j,e:sv(rg,'use',{href:'#hi_'+KINDS[(i*5+j*7)%KINDS.length],stroke:INK,'stroke-width':1.3,'stroke-linejoin':'round','stroke-linecap':'round'}),
    on:rnd(),ph:rnd()*20,sp:0.3+rnd()*0.45}));
  return {i,r,sz,n,rg,items,w0:(6+rnd()*5)*(1.5-i/12),a0:rnd()*360,t0:B(0.1)+i*0.12};   // all one way, the inner rings faster
});
M.track(t=>{
  if(!show(HK,t<K_TURN+0.05))return;
  const pc=inc(t,B(6.75),K_TURN), sc=1-0.95*pc, q=FQ(t);
  for(const R of RINGS){
    const a0=(R.a0+R.w0*t+300*pc*pc)*Math.PI/180;R.rg.setAttribute('opacity',f3(1-0.8*pc));
    for(const it of R.items){
      const land=R.t0+it.on*0.5, on=q>=land&&(Math.sin(q*it.sp*6.283+it.ph)>-0.9||q<land+0.7);
      if(!on){if(it.v!==0){it.e.setAttribute('opacity','0');it.v=0;}continue;}
      if(it.v!==1){it.e.setAttribute('opacity','1');it.v=1;}
      const a=a0+2*Math.PI*it.j/R.n, pop=0.6+0.4*dec(t,land,land+0.25), s=R.sz*sc*pop;
      it.e.setAttribute('transform',`translate(${f1(RC.x+R.r*sc*Math.cos(a))} ${f1(RC.y+R.r*sc*Math.sin(a)+30*s)}) scale(${f3(s)})`);
    }
  }
});
jt({at:B(0.25),out:K_TURN,y:812,size:70,step:S16,words:["Your","company's","data","is",{t:'everywhere.',g:1}],ar:'بيانات شركتك مبعثرة في كل مكان.',arSize:40,fade:[B(7.2),B(7.9)]});

/* ================= the drawing: tiers in perspective (films/ontology-foundry's), one camera ================= */
const FOC=1150, SC={x:960,y:520};
const Z1=1250, Z2=2500, TH=34;
function camOf(T,D,yw=0,pt=36){const a=pt*Math.PI/180,b=yw*Math.PI/180,cp=Math.cos(a),sp=Math.sin(a),cy=Math.cos(b),sy=Math.sin(b);
  return {C:{x:T.x+D*cp*sy,y:T.y-D*cp*cy,z:T.z+D*sp},cp,sp,cy,sy};}      // pitched down, and turned round the target by the yaw
function pj(c,x,y,z){const dx=x-c.C.x,dy=y-c.C.y,vz=z-c.C.z,vx=dx*c.cy+dy*c.sy,vy=dy*c.cy-dx*c.sy,fw=vy*c.cp-vz*c.sp,up=vy*c.sp+vz*c.cp,s=FOC/fw;
  return {x:SC.x+vx*s,y:SC.y-up*s,s};}
const NEAR=90, fwOf=(c,p)=>((p[1]-c.C.y)*c.cy-(p[0]-c.C.x)*c.sy)*c.cp-(p[2]-c.C.z)*c.sp;
function clipPj(c,P3){const out=[];for(let i=0;i<P3.length;i++){const a=P3[i],b=P3[(i+1)%P3.length],fa=fwOf(c,a),fb=fwOf(c,b);
    if(fa>=NEAR)out.push(a);if((fa>=NEAR)!==(fb>=NEAR)){const u=(NEAR-fa)/(fb-fa);out.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u)]);}}
  return out.map(p=>pj(c,p[0],p[1],p[2]));}
const CAMK=[   // time, target, distance, yaw, pitch: drifts, cranes and circles, each eased in and out
  [K_TURN,{x:100,y:300,z:150},1380],[B(15),{x:-60,y:300,z:150},1380],
  [B(17),{x:-200,y:380,z:Z1+60},1550],[B(23),{x:200,y:380,z:Z1+60},1550],
  [B(25),{x:0,y:270,z:Z2+250},2150,-8,25],[B(31.25),{x:-10,y:270,z:Z2+230},1820,7,23],
  [B(33.75),{x:0,y:350,z:Z1+450},5200],[K_END,{x:0,y:350,z:Z1+450},4900],[B(49),{x:0,y:350,z:Z1+450},6000]];
function camAt(t){let k=0;while(k<CAMK.length-2&&t>=CAMK[k+1][0])k++;
  const [ta,Ta,Da,Ya=0,Pa=36]=CAMK[k],[tb,Tb,Db,Yb=0,Pb=36]=CAMK[k+1], u=ez.ioC(P(t,ta,tb));
  return camOf({x:lerp(Ta.x,Tb.x,u),y:lerp(Ta.y,Tb.y,u),z:lerp(Ta.z,Tb.z,u)},lerp(Da,Db,u),lerp(Ya,Yb,u),lerp(Pa,Pb,u));}

const TIER0=[{k:'sys',x0:-1300,x1:-120,y0:0,y1:560},{k:'files',x0:120,x1:1300,y0:0,y1:560}];
const TIER1={x0:-1400,x1:1400,y0:0,y1:760};
/* the top tier: each page stands on its plate as a glass slab and turns to face the middle; its parts (the screenshot's
   own pixels: [x, y, w, h, corner radius, how far it floats out, has a shadow]) float out of it */
const TIER2=[{k:'pulse',x0:-1500,x1:-540,img:'pulse',ang:22,hx:-930,ar:'نبض الأعمال',en:'BUSINESS PULSE',
    parts:[[184,640,1534,118,16,60,0],[184,776,1534,118,16,95,0],[184,912,1534,118,16,130,0],[183,326,236,71,14,120,1]]},
  {k:'dec',x0:-480,x1:480,img:'decisions',ang:0,hx:0,ar:'القرارات',en:'DECISIONS',
    parts:[[58,405,331,138,16,75,0],[415,405,331,138,16,75,0],[772,405,331,138,16,75,0],[1129,405,331,138,16,75,0]]},
  {k:'ai',x0:540,x1:1500,img:'assistant',ang:-22,hx:930,ar:'مساعد مرصد الذكي',en:'ASSISTANT',
    parts:[[187,963,789,70,14,55,0],[127,692,398,96,16,85,0],[547,692,397,96,16,85,0],[1064,376,371,62,12,100,1],[490,418,92,92,20,135,0]]}]
  .map(p=>({...p,y0:0,y1:700}));
const DONE=[58,687,1402,214,16];                                  // Decisions' "Action executed" card: it floats out on the action
const SRCS=[{ic:'db',x:-920,y:300,lb:'Odoo',cls:''},{ic:'chat',x:-480,y:300,lb:'واتساب',cls:' ar'},
  {ic:'xlsx',x:340,y:300,lb:'invoices_q3.xlsx',cls:''},{ic:'csv',x:720,y:300,lb:'branch_returns.csv',cls:''},{ic:'pdf',x:1100,y:300,lb:'po_2291.pdf',cls:''}].map((o,i)=>({...o,z:0,t0:B(8.9)+i*S16}));
const OBJ=[{k:'cust',ic:'store',ar:'عميل',en:'Customer',x:0,y:380,h:62},{k:'inv',ic:'doc',ar:'فاتورة',en:'Invoice',x:660,y:210,h:84},
  {k:'note',ic:'note',ar:'ملاحظة',en:'Note',x:-1030,y:200,h:66},{k:'emp',ic:'person',ar:'موظف',en:'Employee',x:-850,y:600,h:82},
  {k:'city',ic:'city',ar:'مدينة',en:'City',x:350,y:650,h:104},{k:'prod',ic:'box',ar:'منتج',en:'Product',x:950,y:660,h:58},
  {k:'line',ic:'line',ar:'بند فاتورة',en:'Invoice line',x:1150,y:360,h:66}].map((o,i)=>({...o,z:Z1,t0:B(16.75)+i*S16}));
const OK={};OBJ.forEach(o=>OK[o.k]=o);
const LNK=[['cust','inv','صادرة إلى','billed_to'],['inv','line','تحتوي بند','has_line'],['prod','line','المنتج','line_product'],
  ['cust','note','يذكر','mentions',0.55],['cust','emp','مدير الحساب','account_manager',0.6],['cust','city','يقع في','located_in']].map((l,j)=>({a:OK[l[0]],b:OK[l[1]],ar:l[2],en:l[3],f:l[4]??0.5,t0:B(18.5)+j*S16}));

/* the layers, painted bottom tier first; the slabs' reflections lie on the top tier's plates, the slabs stand over them */
const DG=M.el('div','om-lay',null,SCN);
const S0=svgEl(DG), H0=M.el('div','om-lay',null,DG), SA=svgEl(DG), S1=svgEl(DG), H1=M.el('div','om-lay',null,DG), SB=svgEl(DG), S2=svgEl(DG),
  R2=M.el('div','om-lay',null,DG), K2=M.el('div','om-lay om-iso',null,DG), H2=M.el('div','om-lay',null,DG), S3=svgEl(DG), H3=M.el('div','om-lay',null,DG);
S0.innerHTML=`<defs><linearGradient id="omBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A1670"/><stop offset="1" stop-color="#0B0718"/></linearGradient>`+
  `<radialGradient id="omPad" cx="0.5" cy="0.5" r="0.5">${RIM.map(([s,c])=>`<stop offset="${s}" stop-color="${c}"/>`).join('')}</radialGradient></defs>`;
function plateEls(svg){return {glow:sv(svg,'polygon',{fill:'none',stroke:'rgba(206,64,240,0.3)','stroke-width':7,'stroke-linejoin':'round'}),
  top:sv(svg,'polygon',{fill:'rgba(18,10,36,0.9)',stroke:'#D8B4FF','stroke-width':1.6,'stroke-linejoin':'round'}),
  front:sv(svg,'polygon',{fill:'url(#omBand)',stroke:'#D8B4FF','stroke-width':1.6,'stroke-linejoin':'round'}),
  side:sv(svg,'polygon',{fill:'url(#omBand)',stroke:'#D8B4FF','stroke-width':1.6,'stroke-linejoin':'round'})};}
const seesTop=(c,z)=>c.C.z>z+10;
const pts2=A=>A.length>2?pts(A.map(q=>[q.x,q.y])):'';
function drawPlate(c,pl,p,z){                                     // the top (or the underside), the front edge and the side edge in view
  const zf=seesTop(c,z)?z:z-TH, F=clipPj(c,[[p.x0,p.y0,zf],[p.x1,p.y0,zf],[p.x1,p.y1,zf],[p.x0,p.y1,zf]]),
    E=clipPj(c,[[p.x0,p.y0,z],[p.x1,p.y0,z],[p.x1,p.y0,z-TH],[p.x0,p.y0,z-TH]]),
    xs=c.C.x<p.x0?p.x0:c.C.x>p.x1?p.x1:null, Sd=xs===null?[]:clipPj(c,[[xs,p.y0,z],[xs,p.y1,z],[xs,p.y1,z-TH],[xs,p.y0,z-TH]]);
  const fp=pts2(F);pl.top.setAttribute('points',fp);pl.glow.setAttribute('points',fp);
  pl.front.setAttribute('points',pts2(E));pl.side.setAttribute('points',pts2(Sd));return F;}
const P0=TIER0.map(p=>plateEls(S0)), P1=plateEls(S1), P2=TIER2.map(p=>plateEls(S2));

const PR=128;
function padPath(c,x,y,z,r){let d='';for(let k=0;k<=32;k++){const a=k/32*2*Math.PI,q=pj(c,x+r*Math.cos(a),y+r*Math.sin(a),z);d+=(k?'L':'M')+f1(q.x)+' '+f1(q.y);}return d+'Z';}
function thing(svg,html,o,lbHtml,lbCls){
  o.pad=sv(svg,'path',{fill:'url(#omPad)'});                              // each one stands on a small lens
  o.g=sv(svg,'g',{stroke:INK,'stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
  o.gi=sv(o.g,'g',{});o.gi.innerHTML=ICON[o.ic]();o.gi.querySelectorAll('*').forEach(e=>e.setAttribute('vector-effect','non-scaling-stroke'));
  o.lb=M.el('div','om-lb '+lbCls,lbHtml,html);
}
SRCS.forEach(o=>thing(S0,H0,o,o.lb,'om-src'+o.cls));
const LK1=sv(S1,'g',{});
LNK.forEach(l=>{l.gl=sv(LK1,'line',{stroke:'rgba(206,64,240,0.35)','stroke-width':6,'stroke-linecap':'round'});
  l.ln=sv(LK1,'line',{stroke:'#E3C9FF','stroke-width':2,'stroke-dasharray':'7 6','stroke-linecap':'round'});
  l.lt=sv(LK1,'circle',{r:4.5,fill:'#FFE6FF'});
  l.pl=M.el('div','om-lb om-pill',`<span>${l.ar}</span><span class="en">${l.en}</span>`,H1);});
[...OBJ].sort((a,b)=>b.y-a.y).forEach(o=>thing(S1,H1,o,`<span>${o.ar}</span><span class="en">${o.en}</span>`,'om-ty'));
const TL0=M.el('div','om-lb om-tier','<span>SOURCES</span><span class="sep">·</span><span class="ar">المصادر</span>',H0);
const TL1=M.el('div','om-lb om-tier','<span>ONTOLOGY</span><span class="sep">·</span><span class="ar">الأنطولوجيا</span>',H1);
const CARD=M.el('div','om-lb om-card','<div class="r1"><span class="pl cat">ملاحظة</span><span class="msg">«الفاتورة تأخرت أسبوعًا» — عميل: متاجر الواحة</span></div>'+
  '<div class="r2"><span class="pl src">واتساب</span></div>',H1);
const CARDL=sv(S1,'polyline',{fill:'none',stroke:'#E3C9FF','stroke-width':1.6});

/* the slabs: a hinge on the plate; e runs 0 (the page lying on the plate) to 1 (standing, leaning back TILT degrees, turned
   by ang to face the middle, the side ones sliding in to hx); local coordinates a (across), b (up the page), c (out of it: 0 the back face, ST the page) */
const NW=1896, NH=1060, SW=880, SBZ=14, SH=2*SBZ+(SW-2*SBZ)*NH/NW, ST=24, HY=190, TILT=12;
function slabF(p,e){const a=p.ang*e*Math.PI/180, ph=lerp(90,TILT,e)*Math.PI/180, sa=Math.sin(a), ca=Math.cos(a), sp=Math.sin(ph), cp=Math.cos(ph);
  return {O:[lerp((p.x0+p.x1)/2,p.hx,e),HY,Z2],u:[ca,sa,0],v:[-sa*sp,ca*sp,cp],n:[sa*cp,-ca*cp,sp]};}
const L3=(F,a,b,c)=>[F.O[0]+F.u[0]*a+F.v[0]*b+F.n[0]*c,F.O[1]+F.u[1]*a+F.v[1]*b+F.n[1]*c,F.O[2]+F.v[2]*b+F.n[2]*c];
const SXl=X=>-SW/2+SBZ+X/NW*(SW-2*SBZ), SYl=Y=>SH-SBZ-Y/NH*(SH-2*SBZ);     // a screenshot pixel -> the slab's a, b
const FACES=[   // corners as (a, b, c) in 0/1, and the outward normal in (u, v, n); a convex box: only faces turned to the camera are drawn
  {q:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],nn:[0,1,0],fill:'#3E1A78'},{q:[[0,0,1],[1,0,1],[1,0,0],[0,0,0]],nn:[0,-1,0],fill:'#1C0B3A'},
  {q:[[0,1,0],[0,1,1],[0,0,1],[0,0,0]],nn:[-1,0,0],fill:'#2A1256'},{q:[[1,1,1],[1,1,0],[1,0,0],[1,0,1]],nn:[1,0,0],fill:'#2A1256'},
  {q:[[1,1,0],[0,1,0],[0,0,0],[1,0,0]],nn:[0,0,-1],fill:'#120824'},{q:[[0,1,1],[1,1,1],[1,0,1],[0,0,1]],nn:[0,0,1],fill:'#150B2B',front:1}];
function homog(q,W,H){const [x0,y0]=[q[0].x,q[0].y],[x1,y1]=[q[1].x,q[1].y],[x2,y2]=[q[2].x,q[2].y],[x3,y3]=[q[3].x,q[3].y];
  const dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3,den=dx1*dy2-dx2*dy1;
  const gg=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den,a=x1-x0+gg*x1,b=x3-x0+h*x3,d=y1-y0+gg*y1,e=y3-y0+h*y3;
  const m=[a/W,d/W,0,gg/W,b/H,e/H,0,h/H,0,0,1,0,x0,y0,0,1];
  return m.every(Number.isFinite)?`matrix3d(${m.map(v=>(+v).toFixed(6)).join(',')})`:null;}
const quad=(c,F,a0,b0,a1,b1,cc)=>[L3(F,a0,b1,cc),L3(F,a1,b1,cc),L3(F,a1,b0,cc),L3(F,a0,b0,cc)].map(P=>pj(c,P[0],P[1],P[2]));   // TL TR BR BL
TIER2.forEach((p,i)=>{
  const src=`site_pages/${p.img}.png`, base=`films/ontology-main-theme/pages/${p.img}_base.png`;
  p.rw=M.el('div','om-lay',null,R2);p.rimg=M.el('img','om-refl',null,p.rw);p.rimg.src=base;              // the reflection on the plate
  p.box=M.el('div','om-lay',null,K2);p.svg=svgEl(p.box);
  p.glow=sv(p.svg,'polygon',{fill:'none',stroke:'rgba(214,80,245,0.4)','stroke-width':12,'stroke-linejoin':'round'});
  p.faces=FACES.map(f=>({...f,el:sv(p.svg,'polygon',{fill:f.fill,stroke:f.front?'#F2E2FF':'rgba(216,180,255,0.85)','stroke-width':f.front?1.8:1.3,'stroke-linejoin':'round'})}));
  p.scr=M.el('img','om-scr3',null,p.box);p.scr.src=base;
  const part=(r,cls)=>{const e=M.el('div','om-part'+(cls||''),null,p.box);
    st(e,{width:r[2]+'px',height:r[3]+'px',borderRadius:r[4]+'px',backgroundImage:`url(${src})`,backgroundPosition:`${-r[0]}px ${-r[1]}px`});return e;};
  p.pts=[...p.parts].sort((a,b)=>a[5]-b[5]).map((r,k)=>({r,el:part(r),tl:B(25)+i*S8+0.75+k*S16}));
  if(p.k==='dec')p.done={r:DONE,el:part(DONE,' done')};
  p.lbl=M.el('div','om-lb om-tier',`<span>${p.en}</span><span class="sep">·</span><span class="ar">${p.ar}</span>`,H2);
  p.ta=B(24)+i*S16;p.t0=B(25)+i*S8;                              // it shows up lying on the plate, then stands up
});

/* the cables: glowing dashed lines, each with a light running up it now and then */
function bundle(svg,n,lo,hi){const out=[];for(let k=0;k<n;k++){const u=(k+0.5)/n;
  out.push({lo:{x:lerp(lo.x0,lo.x1,u),y:lo.y,z:lo.z},hi:{x:lerp(hi.x0,hi.x1,u),y:hi.y,z:hi.z},
    e:sv(svg,'path',{fill:'none',stroke:'rgba(214,170,255,0.5)','stroke-width':1.5,'stroke-dasharray':'7 5 1.5 5','stroke-linecap':'round'}),
    lt:sv(svg,'circle',{r:3.2,fill:'#FFE6FF'}),ph:(k*37)%23,lp:(k*0.61)%1});}return out;}
const CA=[...bundle(SA,11,{x0:-1180,x1:-240,y:560,z:0},{x0:-1200,x1:-330,y:0,z:Z1-TH}),
          ...bundle(SA,11,{x0:240,x1:1180,y:560,z:0},{x0:330,x1:1200,y:0,z:Z1-TH})].map((c,k)=>({...c,t0:B(10)+k*0.035}));
const CB=[...bundle(SB,9,{x0:-1320,x1:-620,y:760,z:Z1},{x0:-1400,x1:-640,y:0,z:Z2-TH}),...bundle(SB,9,{x0:-360,x1:360,y:760,z:Z1},{x0:-380,x1:380,y:0,z:Z2-TH}),
          ...bundle(SB,9,{x0:620,x1:1320,y:760,z:Z1},{x0:640,x1:1400,y:0,z:Z2-TH})].map((c,k)=>({...c,t0:B(21)+k*0.03}));
const cub=(a,b,c,d,u)=>{const v=1-u;return v*v*v*a+3*v*v*u*b+3*v*u*u*c+u*u*u*d;};
function drawCable(c,cb,t){let L=[cb.lo.x,cb.lo.y,cb.lo.z],H=[cb.hi.x,cb.hi.y,cb.hi.z];const fl=fwOf(c,L),fh=fwOf(c,H);
  if(fl<NEAR&&fh<NEAR){cb.e.setAttribute('d','');cb.lt.style.display='none';return;}
  if(fh<NEAR){const u=(NEAR-fl)/(fh-fl);H=[lerp(L[0],H[0],u),lerp(L[1],H[1],u),lerp(L[2],H[2],u)];}
  if(fl<NEAR){const u=(NEAR-fh)/(fl-fh);L=[lerp(H[0],L[0],u),lerp(H[1],L[1],u),lerp(H[2],L[2],u)];}
  const a=pj(c,L[0],L[1],L[2]),b=pj(c,H[0],H[1],H[2]),dy=a.y-b.y,o=dec(t,cb.t0,cb.t0+0.4);
  cb.e.setAttribute('d',`M${f1(a.x)} ${f1(a.y)} C${f1(a.x)} ${f1(a.y-0.55*dy)} ${f1(b.x)} ${f1(b.y+0.55*dy)} ${f1(b.x)} ${f1(b.y)}`);
  cb.e.setAttribute('stroke-dashoffset',f1(cb.ph+38*t));cb.e.setAttribute('opacity',f3(o));
  const u=((t*0.42+cb.lp)%1), on=o>0.5&&u<0.85;cb.lt.style.display=on?'':'none';            // a light running up, then a pause
  if(on){const w=u/0.85, x=cub(a.x,a.x,b.x,b.x,w), y=cub(a.y,a.y-0.55*dy,b.y+0.55*dy,b.y,w);cb.lt.setAttribute('cx',f1(x));cb.lt.setAttribute('cy',f1(y));
    cb.lt.setAttribute('opacity',f3(o*Math.min(1,w/0.1,(1-w)/0.1)));}}

const ACTG=sv(S3,'path',{fill:'none',stroke:'rgba(222,13,255,0.35)','stroke-width':9,'stroke-linecap':'round'});
const ACTL=sv(S3,'path',{fill:'none',stroke:'#FF9BF0','stroke-width':3,'stroke-linecap':'round'});
const ACT=M.el('div','om-lb om-act','<span>إعادة التوريد</span><span class="en">Restock</span>',H3);
const T_A0=B(26.25), T_A1=B(27.75), T_TO=B(28);

const place=(e,x,y,s,o)=>{e.style.display=o>0.002?'':'none';if(o>0.002)st(e,{opacity:f3(o),transform:`translate(${f1(x)}px,${f1(y)}px) translate(-50%,-50%) scale(${f3(s)})`});};
const setTf=(e,tf)=>{if(tf){e.style.transform=tf;e.style.visibility='';}else e.style.visibility='hidden';};
function drawSlab(c,p,t,onT2){                                    // one page on the top tier, standing up off its plate
  const vis=onT2?dec(t,p.ta,p.ta+0.45):0;p.box.style.display=p.rw.style.display=vis>0.002?'':'none';if(vis<=0.002)return null;
  const e=io(t,p.t0,p.t0+0.8), F=slabF(p,e), C=[c.C.x,c.C.y,c.C.z];p.box.style.opacity=f3(vis);
  const at=(k)=>L3(F,k[0]?SW/2:-SW/2,k[1]?SH:0,k[2]?ST:0);
  p.faces.forEach(f=>{const nw=[0,1,2].map(j=>f.nn[0]*F.u[j]+f.nn[1]*F.v[j]+f.nn[2]*F.n[j]), P0=at(f.q[0]),
      seen=nw[0]*(C[0]-P0[0])+nw[1]*(C[1]-P0[1])+nw[2]*(C[2]-P0[2])>0;
    const Q=seen?f.q.map(k=>{const P=at(k);return pj(c,P[0],P[1],P[2]);}):[];f.el.setAttribute('points',pts2(Q));
    if(f.front)p.glow.setAttribute('points',pts2(Q));});
  setTf(p.scr,homog(quad(c,F,-SW/2+SBZ,SBZ,SW/2-SBZ,SH-SBZ,ST+0.5),NW,NH));
  p.pts.forEach(o=>{const l=dec(t,o.tl,o.tl+0.6), r=o.r, d=ST+1+r[5]*l;
    setTf(o.el,homog(quad(c,F,SXl(r[0]),SYl(r[1]+r[3]),SXl(r[0]+r[2]),SYl(r[1]),d),r[2],r[3]));
    o.el.style.boxShadow=(r[6]?'0 8px 22px rgba(118,40,200,0.35),':'')+`0 0 0 ${f1(2.5*l)}px rgba(236,205,255,${f3(0.95*l)}),0 ${f1(26*l)}px ${f1(60*l)}px rgba(30,4,70,${f3(0.4*l)}),0 0 ${f1(40*l)}px rgba(206,64,240,${f3(0.35*l)})`;});
  if(p.done){const l=dec(t,T_TO,T_TO+0.55)*(1-io(t,B(31.5),B(33))), r=p.done.r, sc=1+0.1*l, cx=SXl(r[0]+r[2]/2), cy=SYl(r[1]+r[3]/2),
      hw=(SXl(r[0]+r[2])-SXl(r[0]))/2*sc, hh=(SYl(r[1])-SYl(r[1]+r[3]))/2*sc;
    setTf(p.done.el,homog(quad(c,F,cx-hw,cy-hh+60*l,cx+hw,cy+hh+60*l,ST+1+190*l),r[2],r[3]));
    p.done.el.style.boxShadow=`0 0 0 ${f1(3*l)}px rgba(150,236,190,${f3(0.95*l)}),0 0 ${f1(80*l)}px ${f1(16*l)}px rgba(60,220,140,${f3(0.5*l)}),0 ${f1(40*l)}px ${f1(90*l)}px rgba(6,30,18,${f3(0.35*l)})`;}
  // its reflection on the plate: the page mirrored in the plate's top, fading away from the hinge
  const M3=P=>pj(c,P[0],P[1],2*Z2-P[2]), q=[L3(F,-SW/2+SBZ,SH-SBZ,ST),L3(F,SW/2-SBZ,SH-SBZ,ST),L3(F,SW/2-SBZ,SBZ,ST),L3(F,-SW/2+SBZ,SBZ,ST)].map(M3);
  setTf(p.rimg,homog(q,NW,NH));p.rimg.style.opacity=f3(0.24*e*e);
  return {F,depth:fwOf(c,L3(F,0,SH/2,ST/2))};
}
M.track(t=>{
  const on=t>=K_TURN+0.2&&t<K_END+0.8;if(!show(DG,on))return;
  const c=camAt(t);DG.style.opacity=f3(dec(t,K_TURN+0.25,K_TURN+0.9)*(1-P(t,B(42),B(43.2))));
  TIER0.forEach((p,i)=>drawPlate(c,P0[i],p,0));
  SRCS.forEach(o=>{const q=pj(c,o.x,o.y,o.z),p=dec(t,o.t0,o.t0+0.4);o.pad.setAttribute('d',padPath(c,o.x,o.y,o.z,PR*0.8));o.pad.setAttribute('opacity',f3(P(t,o.t0-0.2,o.t0)));
    o.g.setAttribute('transform',`translate(${f1(q.x)} ${f1(q.y)}) scale(${f3(q.s*ICS*1.05)}) scale(1 ${f3(0.2+0.8*p)})`);o.g.setAttribute('opacity',f3(P(t,o.t0,o.t0+0.15)));
    const lq=pj(c,o.x,o.y-PR*0.8-40,o.z);place(o.lb,lq.x,lq.y+14*q.s*1.6,q.s*1.6,dec(t,o.t0+0.1,o.t0+0.45));});
  const tq=pj(c,0,-40,-TH);place(TL0,tq.x,tq.y+30*tq.s*1.7,tq.s*1.7,dec(t,B(9.5),B(9.5)+0.5));
  CA.forEach(cb=>drawCable(c,cb,t));
  drawPlate(c,P1,TIER1,Z1);
  const onT1=seesTop(c,Z1);[LK1,...OBJ.map(o=>o.pad),...OBJ.map(o=>o.g)].forEach(e=>e.style.display=onT1?'':'none');
  const lb1=1-P(t,B(24.5),B(25.25))*(1-P(t,B(32),B(33)));      // the ontology's names step back under the pages (the frame's foot cuts them)
  LNK.forEach(l=>{const a=pj(c,l.a.x,l.a.y,Z1),b=pj(c,l.b.x,l.b.y,Z1),p=dec(t,l.t0,l.t0+0.45);
    [l.gl,l.ln].forEach(e=>{e.setAttribute('x1',f1(a.x));e.setAttribute('y1',f1(a.y));e.setAttribute('x2',f1(lerp(a.x,b.x,p)));e.setAttribute('y2',f1(lerp(a.y,b.y,p)));e.setAttribute('opacity',p>0?'1':'0');});
    const u=((t-l.t0)*0.5)%1, lon=t>l.t0+0.6;l.lt.style.display=lon?'':'none';
    if(lon){l.lt.setAttribute('cx',f1(lerp(a.x,b.x,u)));l.lt.setAttribute('cy',f1(lerp(a.y,b.y,u)));l.lt.setAttribute('opacity',f3(Math.min(1,u/0.12,(1-u)/0.12)));}
    const m=pj(c,lerp(l.a.x,l.b.x,l.f),lerp(l.a.y,l.b.y,l.f),Z1);place(l.pl,m.x,m.y,m.s*1.55,onT1?lb1*dec(t,l.t0+0.25,l.t0+0.6):0);});
  OBJ.forEach(o=>{const q=pj(c,o.x,o.y,Z1),p=dec(t,o.t0,o.t0+0.4);o.pad.setAttribute('d',padPath(c,o.x,o.y,Z1,PR));o.pad.setAttribute('opacity',f3(P(t,o.t0-0.2,o.t0)));
    o.g.setAttribute('transform',`translate(${f1(q.x)} ${f1(q.y)}) scale(${f3(q.s*ICS)}) scale(1 ${f3(0.2+0.8*p)})`);o.g.setAttribute('opacity',f3(P(t,o.t0,o.t0+0.15)));
    const lq=pj(c,o.x,o.y,Z1+o.h*ICS+80);place(o.lb,lq.x,lq.y-12*q.s*1.6,q.s*1.6,onT1?(o.k==='prod'?1:lb1)*dec(t,o.t0+0.15,o.t0+0.5):0);});
  const t1=pj(c,720,-40,Z1-TH);place(TL1,t1.x,t1.y+30*t1.s*1.7,t1.s*1.7,dec(t,B(17),B(17)+0.5));
  { const nt=OK.note, q=pj(c,-300,1000,Z1+120), a=pj(c,nt.x+40,nt.y,Z1+160), pc=(onT1?1:0)*dec(t,B(19.75),B(19.75)+0.5)*(1-P(t,B(23.5),B(24.25)));
    place(CARD,q.x,q.y,q.s*1.45,pc);
    CARDL.setAttribute('points',pts([[a.x,a.y],[q.x-160*q.s*1.45,q.y+50*q.s*1.45]]));CARDL.setAttribute('opacity',f3(pc)); }
  CB.forEach(cb=>drawCable(c,cb,t));
  const onT2=seesTop(c,Z2);
  const SL=TIER2.map((p,i)=>{const F2=drawPlate(c,P2[i],p,Z2);p.rw.style.clipPath=F2.length>2?`polygon(${F2.map(q=>f1(q.x)+'px '+f1(q.y)+'px').join(',')})`:'none';
    return drawSlab(c,p,t,onT2);});
  TIER2.map((p,i)=>({p,s:SL[i]})).filter(o=>o.s).sort((a,b)=>b.s.depth-a.s.depth).forEach((o,k)=>o.p.box.style.zIndex=String(k+1));   // the far slab first
  TIER2.forEach((p,i)=>{const s=SL[i];if(!s){place(p.lbl,0,0,1,0);return;}
    const P=L3(s.F,0,SH+64,ST), lq=pj(c,P[0],P[1],P[2]);place(p.lbl,lq.x,lq.y,lq.s*1.45,dec(t,p.t0+0.3,p.t0+0.8));});
  const pa=P(t,T_A0,T_A1), pr=OK.prod, A0=pj(c,pr.x,pr.y,Z1+150), D=TIER2[1];
  if(t>=T_A0&&t<K_END&&SL[1]){const r=DONE, E3=L3(SL[1].F,SXl(r[0]+r[2]/2),SYl(r[1]+r[3]/2),ST+2), A1=pj(c,E3[0],E3[1],E3[2]);
    const e=ez.sin(pa),n=24;let d='';for(let k=0;k<=n;k++){const u=e*k/n,x=lerp(A0.x,A1.x,u*u*(3-2*u)),y=lerp(A0.y,A1.y,u);d+=(k?'L':'M')+f1(x)+' '+f1(y);}
    [ACTG,ACTL].forEach(el=>{el.setAttribute('d',d);el.style.display='';el.setAttribute('opacity',f3(1-P(t,T_TO+0.3,T_TO+1.1)));});
    const x=lerp(A0.x,A1.x,e*e*(3-2*e)),y=lerp(A0.y,A1.y,e);place(ACT,x,y,Math.max(0.6,A0.s*1.6),dec(t,T_A0,T_A0+0.25)*(1-P(t,T_TO,T_TO+0.3)));}
  else{ACTG.style.display=ACTL.style.display=ACT.style.display='none';}
});

/* the lines of the drawing's shots (the 48 s film's type) */
jt({at:B(8.9),out:K_ONT-0.05,y:56,size:60,step:S16,words:['Connect','your',{t:'sources.',g:1}],ar:'اربط مصادرك.',arSize:36});
jt({at:B(16.25),out:K_APP-0.05,y:56,size:60,step:S16,words:['Unify','them','in','one',{t:'ontology.',g:1}],ar:'وحّدها في أنطولوجيا واحدة.',arSize:36});
jt({at:B(24.25),out:K_ALL-0.05,y:56,size:60,step:S16,words:['Monitor','and',{t:'act.',g:1}],ar:'راقب ونفّذ.',arSize:36});
jt({at:B(32.25),out:B(42),y:40,size:58,step:S16,words:['Every','system.',{t:'One',g:1},{t:'living',g:1},{t:'model.',g:1}],ar:'كل الأنظمة… نموذج حيّ واحد.',arSize:36,fade:[B(41.4),B(42)]});
jt({at:B(42.5),out:K_HIT,y:420,size:84,step:S8,words:['Meet','the','Marsad',{t:'ontology.',g:1}],ar:'تعرّف على أنطولوجيا مرصد.',arSize:44,fade:[B(47.6),K_HIT]});

/* ================= k48-57 the end (the 48 s film's): on the hit a capsule blooms round "Book your demo.", then the URL ================= */
jt({at:K_HIT+0.25,out:B(51.4),y:466,size:64,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:40,fade:[B(50.75),B(51.35)]}).style.zIndex='2';
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
M.punch(K_TURN,{amp:0.015});
M.punch(K_HIT,{amp:0.015});
M.start();
