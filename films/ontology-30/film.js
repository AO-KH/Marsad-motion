/* Marsad — the ontology, a 30 s campaign film (films/ontology-30), in the grammar of Figma's launch video (the client's
   reference 10_figma.mp4): a flat canvas in a pale colour with the product's parts crisp on it; a black arrow cursor, a
   marquee and selection boxes with square handles and coloured name tags; connectors between the frames; headlines typed
   at the top left, the newest word in the accent colour; a full-bleed brand-colour shot; a black end with the headline in
   a selection box and the logo. Here the canvas is lavender with the Knowledge Map's dot grid, the accent is Marsad's
   purple, and the name tags carry the app's own object types in the app's own type colours.
   The story: records scattered across systems become typed objects, the objects are linked by typed links, you start
   from one object and follow its links, and every system feeds one living model.
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects only on three transitions: a whoosh
   (tools/sfx.py `swoosh`) on the turn (k8, with the cinematic hit), a quiet one on the model (k32), and the reveal on the
   logo (k48, with the cinematic hit).
   Music: "Joyful Rhythm Walk Funk" by lightbeatsmusic (Pixabay #513936, supplied by the client), 115 BPM, downbeat
   0.538 s. film.json "edit" (song beats): 8-47 (the intro's second half, then groove A from film k8) and 56-72 (the bar
   whose hats rise into the track's own one-bar break, the break on film k44-47, groove B's hit on film k48). 57 beats,
   B(k) = k x 0.5217 s.
     k0-8    hook     the lavender canvas; records adrift as they sit in their sources (Odoo, WhatsApp) with the
                      company's files; "Your company's data is everywhere."
     k8-16   the turn (the groove starts) the cursor drags a marquee over the records (k8.25-10.75); they straighten
                      and are selected; from k11.5 each gets its object type, one per 8th; "Marsad turns records into objects."
     k16-24  links    the objects glide into place; typed links draw between them, one per 8th, with their names;
                      "Every link has a meaning."
     k24-32  follow   white; one customer lit, the rest dim; a double-click on it: its links light out to a WhatsApp
                      note and an Odoo invoice; the camera pulls back to show the three; "Start from any object. Follow
                      its links."
     k32-44  model    Marsad's purple: the Knowledge Map's seven types and six links form; Odoo, WhatsApp and a
                      spreadsheet connect to it; "Every system. One living model."
     k44-57  end      black, in the track's break: "Meet the Marsad ontology." in a selection box; on the hit (k48) the
                      selection moves to the logo; marsadnasl.com and "Book your demo · احجز عرضك التجريبي"; the cursor
                      rests on it
   Truth: the object types and their colours, the link names (Arabic labels and API names), the Knowledge Map's types and
   links, the records (INV-10477 and INV-10482, the two customers, the invoice line, the WhatsApp note «الفاتورة تأخرت
   أسبوعًا» and its customer) and the file names are the app's own (site kit: objectTypes, links, knowledgeMap, search,
   projects). Renderings: the record cards (the app's sample data laid out as cards, amounts in Western digits), the
   marquee, selections and tags (Figma's grammar), the double-click lighting the links (the Knowledge Map's explore mode
   expands a node on a double-click), the sources flying into the model, the typed headlines. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;
const NS='http://www.w3.org/2000/svg';
function sv(parent,tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);parent.appendChild(e);return e;}

const K_TURN=B(8), K_LINK=B(16), K_FOL=B(24), K_MOD=B(32), K_END=B(44), K_HIT=B(48);
window.CUTS=[K_TURN,K_LINK,K_FOL,K_MOD,K_END];     // hard cuts; the hit (k48) is continuous

/* ---------------- layers: the stage (a canvas: colour and dot grid), the scene, the type and the cursor ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','on-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');

/* the canvas camera: zoom Z about the world point F, which sits at the screen point S */
const WS={x:960,y:610};
const GR={cA:{x:-180,y:-60}};            // (filled in below) where the objects stand once linked
function camAt(t){
  if(t<K_TURN){const u=P(t,0,K_TURN);return {F:{x:lerp(150,-50,ez.sin(u)),y:lerp(10,-10,u)},S:WS,Z:0.78+0.02*u};}
  if(t<K_LINK){const u=P(t,K_TURN,K_LINK);return {F:{x:0,y:0},S:WS,Z:0.78+0.025*ez.sin(u)};}
  if(t<K_FOL){const u=P(t,K_LINK,K_FOL);return {F:{x:0,y:0},S:WS,Z:0.74+0.025*ez.sin(u)};}
  const u=io(t,B(27.25),B(30.75)), d=P(t,K_FOL,K_MOD);   // follow: close on the customer, then back to show its links
  return {F:GR.cA,S:{x:lerp(1100,1180,u),y:lerp(600,540,u)},Z:lerp(1.3,0.92,u)*(1+0.02*d)};
}
const scr=(c,p)=>({x:c.S.x+(p.x-c.F.x)*c.Z,y:c.S.y+(p.y-c.F.y)*c.Z});
const camT=c=>`translate(${f1(c.S.x-c.F.x*c.Z)}px,${f1(c.S.y-c.F.y*c.Z)}px) scale(${f3(c.Z)})`;

function dots(c,sp,col,a0){                // the Knowledge Map's dot grid, in world space; dots keep their size
  const s=sp*c.Z;if(s<9)return;
  const x0=c.F.x-c.S.x/c.Z, y0=c.F.y-c.S.y/c.Z, gx0=Math.floor(x0/sp)*sp, gy0=Math.floor(y0/sp)*sp;
  g.fillStyle=col;g.globalAlpha=a0*Math.min(1,(s-9)/14);
  for(let gx=gx0;;gx+=sp){const x=c.S.x+(gx-c.F.x)*c.Z;if(x>1925)break;
    for(let gy=gy0;;gy+=sp){const y=c.S.y+(gy-c.F.y)*c.Z;if(y>1085)break;g.fillRect(x-1.3,y-1.3,2.6,2.6);}}
  g.globalAlpha=1;
}
const MC={x:1300,y:600};                     // the model's centre (screen)
const mScale=t=>1.06-0.06*ez.sin(P(t,K_MOD,K_END));
M.track(t=>{
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
  if(t<K_FOL){g.fillStyle='#C9C3D9';g.fillRect(0,0,1920,1080);dots(camAt(t),40,'#7E7599',0.34);return;}
  if(t<K_MOD){g.fillStyle='#FBFAFD';g.fillRect(0,0,1920,1080);dots(camAt(t),40,'#C9C4D6',0.9);return;}
  if(t<K_END){
    const gr=g.createRadialGradient(1300,560,80,1200,560,1400);
    gr.addColorStop(0,'#5A17B0');gr.addColorStop(0.55,'#3A0C80');gr.addColorStop(1,'#1B0640');g.fillStyle=gr;g.fillRect(0,0,1920,1080);
    const z=mScale(t);dots({F:{x:0,y:0},S:MC,Z:z},40,'#E9D8FF',0.16);return;
  }
  g.fillStyle='#07050C';g.fillRect(0,0,1920,1080);
});

/* ---------------- headlines: typed at the top left, a word per 16th, the newest in the accent; the Arabic one 8th later ---------------- */
function hl(o){
  const e=M.el('div','hl'+(o.dark?' dark':'')+(o.center?' center':''),null,o.parent||TXT);
  if(o.y!=null)e.style.top=o.y+'px';
  const en=M.el('div','en',null,e), ws=[], rows=[];
  o.en.forEach(line=>{const r=M.el('div','row',null,en);r.style.position='relative';rows.push(r);
    line.split(' ').forEach((w,i)=>{if(i)r.appendChild(document.createTextNode(' '));const s=M.el('span','w',w,r);s.row=r;ws.push(s);});});
  const car=M.el('span','caret',null,null);car.style.position='absolute';
  const ab=M.el('div','ar',null,e), aws=[];
  o.ar.split(' ').forEach((w,i)=>{if(i)ab.appendChild(document.createTextNode(' '));aws.push(M.el('span','w',w,ab));});
  if(o.center)st(ab,{display:'block'});
  const T=ws.map((_,i)=>o.at+i*S16), TA=aws.map((_,i)=>o.at+S8+i*S16), T_DONE=T[T.length-1]+0.45;
  let key='';
  M.track(t=>{
    if(!show(e,inShot(t,o.at,o.out)))return;
    if(o.move)e.style.transform=o.move(t);
    const q=FQ(t)+1e-6, n=T.filter(x=>q>=x).length, na=TA.filter(x=>q>=x).length;
    const ae=n<ws.length?n-1:(q<T_DONE-0.15?n-1:-1), aa=na<aws.length?na-1:(q<TA[TA.length-1]+0.3?na-1:-1);
    const k=n+'|'+na+'|'+ae+'|'+aa+'|'+(q<T_DONE?1:0);if(k===key)return;key=k;
    ws.forEach((w,i)=>{w.style.visibility=i<n?'visible':'hidden';w.classList.toggle('acc',i===ae);});
    aws.forEach((w,i)=>{w.style.visibility=i<na?'visible':'hidden';w.classList.toggle('acc',i===aa);});
    if(n>0&&q<T_DONE){const w=ws[n-1];if(!w.offsetWidth){key='';return;}w.row.appendChild(car);st(car,{left:f1(w.offsetLeft+w.offsetWidth+8)+'px',top:'0.16em',display:''});}
    else car.style.display='none';
  });
  return e;
}

/* ---------------- the records: the app's sample data, laid out as cards ---------------- */
const TY={cust:['عميل','Customer','#DB4E11'],inv:['فاتورة','Invoice','#17A186'],line:['بند فاتورة','Invoice line','#CC0C74'],note:['ملاحظة','Note','#D0730C']};
const ODOO='<span class="src lat">Odoo</span>', WA='<span class="src">واتساب</span>';
const amt=n=>`<div class="amt"><span class="n">${n}</span> ر.س</div>`;
const REC=[   // key, type, size, html, where it lies at first (x, y, tilt), where it stands once linked
  {k:'cA',ty:'cust',w:440,h:150,html:`<div class="ttl">متاجر الواحة</div><span class="sk" style="top:104px;width:190px;"></span>${ODOO}`,
    sc:{x:-330,y:70,r:-3},gr:{x:-180,y:-60}},
  {k:'iA',ty:'inv',w:500,h:176,html:`<div class="id">INV-10477</div><div class="nm">متاجر الواحة</div>${amt('8,920')}${ODOO}`,
    sc:{x:-150,y:400,r:2},gr:{x:-180,y:360}},
  {k:'nT',ty:'note',w:500,h:170,html:`${WA}<div class="bub">الفاتورة تأخرت أسبوعًا</div>`,
    sc:{x:-900,y:-100,r:3.5},gr:{x:-960,y:-60}},
  {k:'lN',ty:'line',w:500,h:176,html:`<div class="id">INV-10482 · <span class="ar">بند 3</span></div><div class="nm">زيت زيتون 5 لتر</div>${amt('640')}${ODOO}`,
    sc:{x:880,y:420,r:-4},gr:{x:700,y:380}},
  {k:'cB',ty:'cust',w:580,h:150,html:`<div class="ttl">مؤسسة الريان التجارية</div><span class="sk" style="top:104px;width:230px;"></span>${ODOO}`,
    sc:{x:800,y:-120,r:-2.5},gr:{x:700,y:-420}},
  {k:'iB',ty:'inv',w:500,h:176,html:`<div class="id">INV-10482</div><div class="nm">مؤسسة الريان التجارية</div>${amt('12,450')}${ODOO}`,
    sc:{x:380,y:150,r:3},gr:{x:700,y:-20}},
];
const RK={};REC.forEach(r=>{RK[r.k]=r;GR[r.k]=r.gr;});
const FILES=[['invoices_q3.xlsx','XLSX','#1D7A46',-1250,330],['branch_returns.csv','CSV','#0E8A7A',1250,-420],['po_2291.pdf','PDF','#C8322B',-330,560],
  ['suppliers_2025.xlsx','XLSX','#1D7A46',1300,520]];

const WSH=M.el('div','on-shot',null,SCN), WORLD=M.el('div','on-world',null,WSH);
const LSV=document.createElementNS(NS,'svg');LSV.setAttribute('class','on-svg');LSV.setAttribute('width',6000);LSV.setAttribute('height',4000);
LSV.setAttribute('viewBox','-3000 -2000 6000 4000');WORLD.appendChild(LSV);
const LBL=M.el('div',null,null,WORLD);                               // the links' names sit above their lines, under the cards
FILES.forEach((f,i)=>{f.el=M.el('div','fl',`<span class="ico" style="background:${f[2]};">${f[1]}</span><span>${f[0]}</span>`,WORLD);f.i=i;});
REC.forEach((r,i)=>{
  r.el=M.el('div','rc',r.html,WORLD);st(r.el,{width:r.w+'px',height:r.h+'px'});
  r.sel=M.el('div','sel','<i></i><i></i><i></i><i></i>',WORLD);r.hs=[...r.sel.children];
  r.tag=M.el('div','tag',`<span>${TY[r.ty][0]}</span><span class="dot">·</span><span class="en">${TY[r.ty][1]}</span>`,WORLD);
  r.tag.style.background=TY[r.ty][2];
});
const GRP=M.el('div','sel','<i></i><i></i><i></i><i></i>',WORLD);   // the multiple selection's box
const MQ=M.el('div','mq',null,WORLD);

/* the cursor: Figma's arrow; the tip at (9.4, 4.5) of its 58 px box */
const ARW=c=>`<svg viewBox="0 0 32 32"><path d="M5.2 2.5 L5.2 25.6 L11 20.2 L14.9 28.9 L18.9 27.2 L15.1 18.7 L23 18.7 Z" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
const CUR=M.el('div','cur',ARW(['#111','#fff']),TXT), CURW=M.el('div','cur',ARW(['#fff','#111']),TXT), TIPX=9.4, TIPY=4.5;
function drawCur(x,y,o,press,e=CUR){e.style.display=o>0.002?'':'none';st(e,{opacity:f3(o),transform:`translate(${f1(x-TIPX)}px,${f1(y-TIPY)}px) scale(${f3(1-0.1*press)})`,transformOrigin:`${TIPX}px ${TIPY}px`});}

/* ---------------- times ---------------- */
const T_IN=REC.map((_,i)=>B(0.25)+[1,4,0,3,5,2][i]*S16);             // the records land, one per 16th, not in order
const T_FIN=FILES.map((_,i)=>B(1)+[0,2,1,3][i]*S16);
const MQ0={x:-1000,y:-256}, MQ1={x:1154,y:538}, T_MQ0=B(8.25), T_MQ1=B(10.75), T_REL=B(11), mqE=ez.sin;
const mqAt=t=>{const e=mqE(P(t,T_MQ0,T_MQ1));return {x:lerp(MQ0.x,MQ1.x,e),y:lerp(MQ0.y,MQ1.y,e)};};
REC.forEach(r=>{                           // when the marquee first touches each record
  const need=Math.max(0,(r.sc.x-r.w/2-MQ0.x)/(MQ1.x-MQ0.x),(r.sc.y-r.h/2-MQ0.y)/(MQ1.y-MQ0.y));
  let lo=0,hi=1;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(mqE(m)<need)lo=m;else hi=m;}
  r.tHit=T_MQ0+hi*(T_MQ1-T_MQ0);
});
['cA','iA','nT','lN','cB','iB'].forEach((k,i)=>{RK[k].tTy=B(11.5)+i*S8;});
const T_GL0=B(16.25), T_GL1=B(17.75);

/* where a record is: adrift, then straightened when the marquee touches it, then gliding to its place */
function recAt(r,t,i){
  const a=1-P(t,r.tHit,r.tHit+0.4);
  const dx=7*Math.sin(2*Math.PI*t/(7.3+i*0.9)+i), dy=6*Math.cos(2*Math.PI*t/(8.1+i*0.7)+2*i);
  const rot=r.sc.r*(1-dec(t,r.tHit,r.tHit+0.38));
  if(t<T_GL0)return {x:r.sc.x+a*dx,y:r.sc.y+a*dy,r:rot};
  const u=io(t,T_GL0,T_GL1);return {x:lerp(r.sc.x,r.gr.x,u),y:lerp(r.sc.y,r.gr.y,u),r:0};
}

/* ---------------- the links: typed, drawn between the objects, with their names ---------------- */
const LINKS=[['cA','nT','يذكر','mentions','h'],['cA','iA','صادرة إلى','billed_to','v'],['cB','iB','صادرة إلى','billed_to','v'],['iB','lN','تحتوي بند','has_line','v']];
const PADS=10;
LINKS.forEach((l,j)=>{
  const A=RK[l[0]],Bb=RK[l[1]],a=A.gr,b=Bb.gr;let s,e,c1,c2;
  if(l[4]==='h'){const d=b.x<a.x?-1:1;s={x:a.x+d*(A.w/2+PADS),y:a.y};e={x:b.x-d*(Bb.w/2+PADS),y:b.y};const k=Math.abs(e.x-s.x)*0.45;c1={x:s.x+d*k,y:s.y};c2={x:e.x-d*k,y:e.y};}
  else{const d=b.y<a.y?-1:1, ax=Math.max(a.x-A.w/2,b.x-Bb.w/2)+130;s={x:ax,y:a.y+d*(A.h/2+PADS)};e={x:ax,y:b.y-d*(Bb.h/2+PADS)};const k=Math.abs(e.y-s.y)*0.45;c1={x:s.x,y:s.y+d*k};c2={x:e.x,y:e.y-d*k};}
  const dstr=`M${f1(s.x)} ${f1(s.y)} C${f1(c1.x)} ${f1(c1.y)} ${f1(c2.x)} ${f1(c2.y)} ${f1(e.x)} ${f1(e.y)}`;
  const m={x:(s.x+3*c1.x+3*c2.x+e.x)/8,y:(s.y+3*c1.y+3*c2.y+e.y)/8};
  const ang=Math.atan2(e.y-c2.y,e.x-c2.x);
  l.o={s,e,m,ang,j,
    path:sv(LSV,'path',{d:dstr,fill:'none',stroke:'#8E32C3','stroke-width':4,'stroke-linecap':'round'}),
    dot:sv(LSV,'circle',{cx:f1(s.x),cy:f1(s.y),r:8,fill:'#8E32C3'}),
    head:sv(LSV,'path',{d:'M0 0 L-20 -11 L-20 11 Z',fill:'#8E32C3',transform:`translate(${f1(e.x)} ${f1(e.y)}) rotate(${f2(ang*180/Math.PI)})`}),
    glow:sv(LSV,'circle',{r:22,fill:'rgba(222,13,255,0.22)'}),
    lit:sv(LSV,'circle',{r:9,fill:'#fff',stroke:'#DE0DFF','stroke-width':4.5}),
    lb:M.el('div','lk',`<span class="ar">${l[2]}</span><span class="en">${l[3]}</span>`,LBL),
    t0:B(18)+j*S8};
  l.o.L=l.o.path.getTotalLength();l.o.path.setAttribute('stroke-dasharray',f1(l.o.L+2));
});
const T_DBL=B(26), T_DBL2=B(26)+0.3, NB={nT:B(26.55),iA:B(26.8)};   // follow: the double-click, then its two links light out
const lightAt=(o,t,t0)=>{const u=P(t,t0,t0+0.55);return u;};

/* ---------------- the canvas shots (k0-32): one world, one camera ---------------- */
M.track(t=>{
  if(!show(WSH,t<K_MOD))return;
  const c=camAt(t);WORLD.style.transform=camT(c);
  const hook=t<K_TURN, follow=t>=K_FOL;
  // the files: adrift in the first shot only
  FILES.forEach((f,i)=>{const p=dec(t,T_FIN[i],T_FIN[i]+0.45), on=hook&&p>0;f.el.style.display=on?'':'none';if(!on)return;
    const dx=6*Math.sin(t/1.3+i), dy=5*Math.cos(t/1.7+2*i);
    st(f.el,{opacity:f3(p),transform:`translate(${f1(f[3]+dx)}px,${f1(f[4]+dy)}px) translate(-50%,-50%) rotate(${f2([-4,3,2.5,-3][i])}deg) scale(${f3(1.04-0.04*p)})`,
      filter:p<1?`blur(${f2((1-p)*6)}px)`:'none'});});
  // the records
  REC.forEach((r,i)=>{
    const p=dec(t,T_IN[i],T_IN[i]+0.4), q=recAt(r,t,i);
    const dim=follow?(r.k==='cA'?1:(NB[r.k]?lerp(0.22,1,dec(t,NB[r.k]+0.4,NB[r.k]+0.75)):0.22)):1;
    st(r.el,{opacity:f3(p*dim),filter:p<1?`blur(${f2((1-p)*6)}px)`:'none',
      transform:`translate(${f1(q.x-r.w/2)}px,${f1(q.y-r.h/2)}px) rotate(${f2(q.r)}deg) scale(${f3(1.04-0.04*p)})`});
    // hover while the marquee touches it (a ring on the card), then the selection box; the type's colour once typed
    const hov=t>=r.tHit&&t<T_REL, sel=t>=T_REL, typed=t>=r.tTy, pc=dec(t,r.tTy,r.tTy+0.25);
    const col=typed?TY[r.ty][2]:'#8E32C3';
    r.el.style.boxShadow=`0 16px 38px rgba(46,26,92,0.16),0 2px 6px rgba(46,26,92,0.08)`+(hov?`,0 0 0 3px #8E32C3`:'');
    const selOn=sel&&!hook;r.sel.style.display=selOn?'':'none';
    if(selOn){
      const bw=typed?lerp(2,3.5,pc):2, pad=PADS;
      st(r.sel,{width:f1(r.w+2*pad)+'px',height:f1(r.h+2*pad)+'px',transform:`translate(${f1(q.x-r.w/2-pad)}px,${f1(q.y-r.h/2-pad)}px)`,
        borderColor:col,borderWidth:f2(bw)+'px',opacity:f3(dim),borderRadius:t>=K_LINK?'30px':'0px'});
      const hsOn=typed&&t<K_LINK;r.hs.forEach(h=>{h.style.display=hsOn?'':'none';if(hsOn)st(h,{borderColor:col,opacity:f3(pc)});});
    }
    // the type's tag, above the card's top right
    const tagOn=typed;r.tag.style.display=tagOn?'':'none';
    if(tagOn){const pt=dec(t,r.tTy,r.tTy+0.32);
      st(r.tag,{opacity:f3(pt*dim),transform:`translate(${f1(q.x+r.w/2+PADS)}px,${f1(q.y-r.h/2-PADS-10-48)}px) translateX(-100%) scale(${f3(0.72+0.28*pt)})`});}
  });
  // the marquee, and the selection's box round all of them
  const mqOn=t>=T_MQ0-0.05&&t<T_REL;MQ.style.display=mqOn?'':'none';
  if(mqOn){const b=mqAt(t);st(MQ,{transform:`translate(${f1(MQ0.x)}px,${f1(MQ0.y)}px)`,width:f1(Math.max(1,b.x-MQ0.x))+'px',height:f1(Math.max(1,b.y-MQ0.y))+'px'});}
  const gOn=t>=T_REL&&t<K_LINK;GRP.style.display=gOn?'':'none';
  if(gOn){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;REC.forEach((r,i)=>{const q=recAt(r,t,i);x0=Math.min(x0,q.x-r.w/2);y0=Math.min(y0,q.y-r.h/2);x1=Math.max(x1,q.x+r.w/2);y1=Math.max(y1,q.y+r.h/2);});
    const pad=34,pg=dec(t,T_REL,T_REL+0.25);st(GRP,{width:f1(x1-x0+2*pad)+'px',height:f1(y1-y0+2*pad)+'px',transform:`translate(${f1(x0-pad)}px,${f1(y0-pad)}px)`,opacity:f3(pg),borderWidth:'2px'});}
  // the links: drawn one per 8th; lights run along them; in the follow shot only the customer's two, after the double-click
  LINKS.forEach(l=>{const o=l.o, on=t>=K_LINK;[o.path,o.dot,o.head].forEach(x=>x.style.display=on?'':'none');o.lb.style.display=on?'':'none';
    if(!on){o.glow.style.display=o.lit.style.display='none';return;}
    let pd=dec(t,o.t0,o.t0+0.45), op=1, lu=-1;
    if(follow){const tn=NB[l[1]];if(l[0]==='cA'&&tn){const u=lightAt(o,t,tn-0.25);op=lerp(0.22,1,dec(t,tn+0.1,tn+0.45));lu=u>0&&u<1?u:-1;}else op=0.22;pd=1;}
    else if(t>=B(20.5)){const per=1.9, u=((t-B(20.5)-o.j*0.47)/per)%1;lu=t-B(20.5)-o.j*0.47>0?u:-1;}
    o.path.setAttribute('stroke-dashoffset',f1((o.L+2)*(1-pd)));o.path.setAttribute('opacity',f3(op));
    o.path.setAttribute('stroke-width',follow&&op>0.5?f2(lerp(4,5.5,op)):'4');
    o.dot.setAttribute('opacity',f3(op*P(pd,0,0.1)));o.head.setAttribute('opacity',f3(op*P(pd,0.85,1)));
    const pl=dec(t,o.t0+0.2,o.t0+0.5);st(o.lb,{opacity:f3(follow?op:pl),transform:`translate(${f1(o.m.x)}px,${f1(o.m.y)}px) translate(-50%,-50%) scale(${f3(follow?1:0.85+0.15*pl)})`});
    const lon=lu>=0;o.glow.style.display=o.lit.style.display=lon?'':'none';
    if(lon){const pt=o.path.getPointAtLength(o.L*lu), fa=Math.min(1,lu/0.12,(1-lu)/0.12);
      [o.glow,o.lit].forEach(x=>{x.setAttribute('cx',f1(pt.x));x.setAttribute('cy',f1(pt.y));x.setAttribute('opacity',f3(fa));});}
  });
  // follow: the customer lit; a double-click on it
  const A=RK.cA;
  if(follow){const pr=Math.max(Math.sin(Math.PI*P(t,T_DBL-0.05,T_DBL+0.12)),Math.sin(Math.PI*P(t,T_DBL2-0.05,T_DBL2+0.12)));
    const pg=dec(t,T_DBL2,T_DBL2+0.4);
    A.el.style.boxShadow=`0 16px 38px rgba(46,26,92,0.16),0 2px 6px rgba(46,26,92,0.08),0 0 0 ${f1(3.5+3*pg)}px rgba(219,78,17,${f3(0.25+0.5*pg)}),0 0 ${f1(40*pg)}px rgba(219,78,17,${f3(0.35*pg)})`;
    A.el.style.transform+=` scale(${f3(1-0.012*pr)})`;
    // the sources of the two it links to: the WhatsApp note and the Odoo invoice
    [['nT',B(29.25)],['iA',B(29.75)]].forEach(([k,ts])=>{const s=RK[k].el.querySelector('.src'),pk=dec(t,ts,ts+0.35);
      s.style.boxShadow=pk>0.002?`0 0 0 ${f1(4*pk)}px rgba(142,50,195,${f3(0.85*pk)}),0 0 ${f1(24*pk)}px rgba(142,50,195,${f3(0.45*pk)})`:'';
      s.style.transform=`scale(${f3(1+0.08*pk)})`;});
  }
});

/* ---------------- the cursor on the canvas: the marquee (k8-10), the double-click (k26) ---------------- */
M.track(t=>{
  if(t<K_TURN||t>=K_MOD){CUR.style.display='none';return;}
  const c=camAt(t);
  if(t<K_LINK){       // at the marquee's corner; pressed while dragging; away after the release
    const b=t<T_MQ0?MQ0:mqAt(t), p=scr(c,b), away=ez.sin(P(t,T_REL+0.1,T_REL+1.0));
    const press=P(t,T_MQ0-0.12,T_MQ0)*(1-P(t,T_REL-0.05,T_REL+0.05));
    drawCur(p.x+220*away,p.y+160*away,dec(t,K_TURN,K_TURN+0.2)*(1-P(away,0.6,1)),press);return;
  }
  if(t<K_FOL){CUR.style.display='none';return;}
  const A=RK.cA, tgt=scr(c,{x:A.gr.x+70,y:A.gr.y-10}), pm=ez.sin(P(t,B(24.4),B(25.85))), out=io(t,T_DBL2+0.35,T_DBL2+1.2);
  const press=Math.max(Math.sin(Math.PI*P(t,T_DBL-0.05,T_DBL+0.12)),Math.sin(Math.PI*P(t,T_DBL2-0.05,T_DBL2+0.12)));
  drawCur(lerp(1500,tgt.x,pm)+220*out,lerp(960,tgt.y,pm)+170*out,dec(t,B(24.4),B(24.4)+0.3)*(1-out),press);
});

/* ---------------- the headlines of the canvas shots ---------------- */
hl({at:B(0.25),out:K_TURN,en:["Your company's data",'is everywhere.'],ar:'بيانات شركتك مبعثرة في كل مكان.'});
hl({at:B(8.25),out:K_LINK,en:['Marsad turns records','into objects.'],ar:'مرصد يحوّل السجلات إلى كائنات.'});
hl({at:B(16.25),out:K_FOL,en:['Every link','has a meaning.'],ar:'لكل رابط معنى.'});
hl({at:B(24.25),out:K_MOD,en:['Start from any object.','Follow its links.'],ar:'ابدأ من أي كائن، وتتبّع روابطه.'});

/* ================= k32-44 the model: the Knowledge Map's types and links on Marsad's purple; the sources join it ================= */
const MOD=M.el('div','on-shot',null,SCN), MG=M.el('div',null,null,MOD);
st(MG,{position:'absolute',left:'0',top:'0',width:'1920px',height:'1080px',transformOrigin:`${MC.x}px ${MC.y}px`});
const MSV=document.createElementNS(NS,'svg');MSV.setAttribute('width',1920);MSV.setAttribute('height',1080);st(MSV,{position:'absolute',left:'0',top:'0',overflow:'visible'});MG.appendChild(MSV);
MSV.innerHTML=`<defs><filter id="oglw" filterUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280"><feGaussianBlur stdDeviation="4"/></filter></defs>`;
const KN=[['عميل','Customer','#DB4E11',712,70],['فاتورة','Invoice','#17A186',887,154],['منتج','Product','#149BB0',537,154],['بند فاتورة','Invoice line','#CC0C74',939,341],
  ['ملاحظة','Note','#D0730C',503,341],['موظف','Employee','#CE730B',621,491],['مدينة','City','#16A286',808,491]]
  .map(([ar,en,col,X,Y],i)=>({ar,en,col,i,x:MC.x+(X-720)*1.75,y:MC.y+(Y-280)*1.75,t0:B(32.5)+i*S16}));
const KE=[[0,1,'صادرة إلى'],[1,3,'تحتوي بند'],[2,3,'المنتج'],[0,4,'يذكر'],[0,5,'مدير الحساب'],[0,6,'يقع في']]
  .map(([a,b,l],j)=>({a,b,l,j,t0:B(34.25)+j*S16}));
KE.forEach(e=>{const A=KN[e.a],Bn=KN[e.b];e.ln=sv(MSV,'line',{x1:f1(A.x),y1:f1(A.y),x2:f1(A.x),y2:f1(A.y),stroke:'rgba(238,222,255,0.62)','stroke-width':2.6,'stroke-linecap':'round'});
  e.gl=sv(MSV,'circle',{r:14,fill:'rgba(240,160,255,0.55)',filter:'url(#oglw)'});e.lt=sv(MSV,'circle',{r:5.5,fill:'#fff'});
  e.lb=M.el('div','el',e.l,MG);});
KN.forEach(n=>{n.el=M.el('div','gn',`<i style="background:${n.col};"></i><b>${n.ar}</b><small>${n.en}</small>`,MG);});
const SRC=[{h:'Odoo',c:'sc',from:{x:-120,y:960},to:2,t0:B(35.25)},{h:'واتساب',c:'sc ar',from:{x:760,y:1150},to:4,t0:B(36)},
  {h:'invoices_q3.xlsx',c:'sc mono',from:{x:2080,y:600},to:1,t0:B(36.75)}];
SRC.forEach(s=>{const N=KN[s.to],mx=(s.from.x+N.x)/2,my=(s.from.y+N.y)/2,dx=N.x-s.from.x,dy=N.y-s.from.y,L=Math.hypot(dx,dy);
  s.c1={x:mx-dy/L*140,y:my+dx/L*140};s.tr=sv(MSV,'path',{fill:'none',stroke:'rgba(255,255,255,0.55)','stroke-width':2.5,'stroke-dasharray':'2 10','stroke-linecap':'round'});
  s.el=M.el('div',s.c,s.h,MG);s.arr=s.t0+1.6;});
const qb=(a,c,b,u)=>({x:(1-u)*(1-u)*a.x+2*u*(1-u)*c.x+u*u*b.x,y:(1-u)*(1-u)*a.y+2*u*(1-u)*c.y+u*u*b.y});
M.track(t=>{
  if(!show(MOD,inShot(t,K_MOD,K_END)))return;
  st(MG,{transform:`scale(${f3(mScale(t))})`});
  const ring=KN.map(()=>0);
  SRC.forEach(s=>{const u=ez.sin(P(t,s.t0,s.arr)), on=t>=s.t0&&u<1;const N=KN[s.to];
    s.el.style.display=on?'':'none';
    const pts=[];for(let k=0;k<=24;k++){const q=qb(s.from,s.c1,N,u*k/24);pts.push(`${k?'L':'M'}${f1(q.x)} ${f1(q.y)}`);}
    s.tr.setAttribute('d',pts.join(' '));s.tr.setAttribute('opacity',f3(t<s.t0?0:1-P(t,s.arr,s.arr+0.7)));
    if(on){const q=qb(s.from,s.c1,N,u), pf=P(u,0.72,1);st(s.el,{opacity:f3(1-pf),transform:`translate(${f1(q.x)}px,${f1(q.y)}px) translate(-50%,-50%) scale(${f3(1-0.45*pf)})`});}
    ring[s.to]=Math.max(ring[s.to],dec(t,s.arr-0.1,s.arr+0.15)*(1-io(t,s.arr+0.2,s.arr+1.2)));
  });
  KN.forEach(n=>{const p=dec(t,n.t0,n.t0+0.5), r=ring[n.i];
    st(n.el,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*8)}px)`:'none',transform:`translate(${f1(n.x)}px,${f1(n.y)}px) translate(-50%,-50%) scale(${f3(0.9+0.1*p)})`,
      boxShadow:`0 14px 34px rgba(20,0,50,0.35)`+(r>0.002?`,0 0 0 ${f1(5*r)}px ${n.col},0 0 ${f1(40*r)}px ${n.col}`:'')});});
  KE.forEach(e=>{const A=KN[e.a],Bn=KN[e.b],p=dec(t,e.t0,e.t0+0.5);
    e.ln.setAttribute('x2',f1(lerp(A.x,Bn.x,p)));e.ln.setAttribute('y2',f1(lerp(A.y,Bn.y,p)));e.ln.setAttribute('opacity',f3(P(t,e.t0,e.t0+0.1)));
    const pl=dec(t,e.t0+0.25,e.t0+0.55);st(e.lb,{opacity:f3(pl),transform:`translate(${f1((A.x+Bn.x)/2)}px,${f1((A.y+Bn.y)/2)}px) translate(-50%,-50%) scale(${f3(0.85+0.15*pl)})`});
    // lights along the links, slowly, never on the beat
    const u=((t-B(38)-e.j*0.37)/2.3)%1, on=t>=B(38)+e.j*0.37;
    e.gl.style.display=e.lt.style.display=on?'':'none';
    if(on){const x=lerp(A.x,Bn.x,u),y=lerp(A.y,Bn.y,u),fa=Math.min(1,u/0.15,(1-u)/0.15);
      [e.gl,e.lt].forEach(c=>{c.setAttribute('cx',f1(x));c.setAttribute('cy',f1(y));c.setAttribute('opacity',f3(fa*0.9));});}
  });
});
hl({at:B(32.25),out:K_END,dark:true,en:['Every system.','One living model.'],ar:'كل الأنظمة… نموذج حيّ واحد.'});

/* ================= k44-57 the end: in the break, the headline in a selection box; on the hit the selection moves to the logo ================= */
const END=M.el('div','on-shot',null,SCN);
M.track(t=>{show(END,t>=K_END);});           // shown before its headline's track measures it
const LOGO=M.el('div','en-logo',`<img class="m" src="assets_logo_m.png"><img class="wm" src="assets_logo_wordmark_white.png">`,END);
const LM={x:870,y:432,w:180,h:137}, LW={x:750,y:592,w:420,h:112};
st(LOGO.querySelector('.m'),{left:LM.x+'px',top:LM.y+'px',width:LM.w+'px'});st(LOGO.querySelector('.wm'),{left:LW.x+'px',top:LW.y+'px',width:LW.w+'px'});
const ESEL=M.el('div','sel','<i></i><i></i><i></i><i></i>',END);st(ESEL,{position:'absolute',left:'0',top:'0',borderColor:'#B26BFF'});
[...ESEL.children].forEach(h=>st(h,{borderColor:'#B26BFF',background:'#07050C'}));
const CTA=M.el('div','en-cta',`<span class="url">marsadnasl.com</span><span class="book"><span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span></span>`,END);
st(CTA,{top:'806px'});
const cUrl=CTA.querySelector('.url'),cBook=CTA.querySelector('.book');
const HY0=150;                                      // the headline, at the top; the logo lands under it on the hit
const HE=hl({at:B(44.25),out:99,dark:true,center:true,y:HY0,en:['Meet the Marsad ontology.'],ar:'تعرّف على أنطولوجيا مرصد.',parent:END});
let HB=null;                                        // the headline's box (measured once the fonts are in)
M.track(t=>{
  if(!show(END,t>=K_END)){CURW.style.display='none';return;}
  if(!HB){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;                    // the words' boxes, in the headline's own layout
    HE.querySelectorAll('.w').forEach(w=>{let x=0,y=0,e=w;while(e&&e!==HE){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent;}
      x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+w.offsetWidth);y1=Math.max(y1,y+w.offsetHeight);});
    HB={x:x0,y:HY0+y0,w:x1-x0,h:y1-y0};}
  // the selection: round the headline (from k45.25), then round the logo (from the hit)
  const ps=dec(t,B(45.25),B(45.25)+0.3), u=ez.sin(P(t,K_HIT,K_HIT+0.7)), pad=30;
  const hb={x:HB.x-pad,y:HB.y-pad,w:HB.w+2*pad,h:HB.h+2*pad}, lb={x:LW.x-44,y:LM.y-34,w:LW.w+88,h:LW.y+LW.h-LM.y+68};
  const x=lerp(hb.x,lb.x,u),y=lerp(hb.y,lb.y,u),w=lerp(hb.w,lb.w,u),h=lerp(hb.h,lb.h,u);
  ESEL.style.display=ps>0?'':'none';
  st(ESEL,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(x)}px,${f1(y)}px)`,opacity:f3(ps),borderWidth:'3px'});
  // the logo lands on the hit
  const pl=dec(t,K_HIT,K_HIT+0.5);LOGO.style.display=t>=K_HIT?'':'none';
  st(LOGO,{opacity:f3(pl),filter:pl<1?`blur(${f2((1-pl)*10)}px)`:'none',transformOrigin:'960px 566px',transform:`scale(${f3((0.94+0.06*pl)*(1+0.018*P(t,K_HIT,B(57))))})`});
  const pu=dec(t,B(49.5),B(49.5)+0.5), pk=dec(t,B(50),B(50)+0.5), hv=dec(t,B(51.9),B(51.9)+0.3);
  CTA.style.display=t>=B(49.5)?'':'none';
  st(cUrl,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*18)}px) scale(${f3(0.95+0.05*pu)})`});
  st(cBook,{opacity:f3(pk),transform:`translateY(${f1((1-pk)*18)}px) scale(${f3((0.95+0.05*pk)*(1+0.025*hv))})`,
    boxShadow:`0 18px 40px rgba(120,40,200,${f3(0.25+0.25*hv)}),0 0 0 ${f1(4*hv)}px rgba(178,107,255,${f3(0.7*hv)})`});
  // the cursor, white on black, comes to rest on "Book your demo"
  const pm=ez.sin(P(t,B(50.25),B(52)));
  if(t>=B(50.25))drawCur(lerp(1640,1180,pm),lerp(1100,872,pm),dec(t,B(50.25),B(50.25)+0.3),0,CURW);else CURW.style.display='none';
});

M.punch(K_TURN,{amp:0.012});
M.punch(K_HIT,{amp:0.015});
M.start();
