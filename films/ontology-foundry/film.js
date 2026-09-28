/* Marsad — the ontology, 30 s campaign film, second style (films/ontology-foundry), after the client's two new
   references: Palantir Foundry's ontology animation (palantir.com/platforms/foundry, "Hydrate_Ontology_General_V3")
   and "Ringwriter" by Edoardo Lunardi (shared by @kombaiselects).
   From Foundry: a white frame round a light-grey canvas, a turned label in a side strip, titles typed into a box cut
   into the canvas's bottom left (the newest letter grey); a technical line drawing in perspective: plates with hatched
   edges stacked in tiers (data at the bottom, the ontology in the middle, what runs on it on top), bundles of dashed
   cables flowing up between the tiers, isometric objects on pads joined by dashed links with pill labels, a record's
   card beside its type, an action rising from the ontology to the top; a calm camera that cranes from tier to tier.
   From Ringwriter: the opening, monospace text set on concentric turning rings with dotted guides, words dropping out.
   Here in Marsad's purples, with the app's own objects, link names, records, files and pages.
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects on three transitions only.
   Music: the client's "Joyful Rhythm Walk Funk" (lightbeatsmusic, Pixabay #513936), 115 BPM; the same edit as
   films/ontology-30: song beats 8-47 then 56-72 (the break on film k44-47, the hit on k48). B(k) = k x 0.5217 s.
     k0-8    hook     the dark canvas: rings of the company's raw data (invoice numbers, customers, amounts, a WhatsApp
                      message, file names) build out from the centre and turn; "Your company's data is everywhere."
                      From k6.75 the rings spin into the centre.
     k8-16   connect  (the groove, a cut to the light canvas) the bottom tier: two plates of sources, Odoo and WhatsApp,
                      and the company's files; cables start flowing up; "Connect your sources."
     k16-24  unify    the camera cranes up to the ontology plate: seven object types on pads, six links with their names,
                      the card of invoice INV-10477; "Unify them in one ontology."
     k24-32  act      up to the top tier: Business Pulse, Decisions and the Assistant (the app's pages); the restock action
                      rises from the Product type to Decisions, "Action executed · PO-2291"; "Monitor and act."
     k32-44  model    the camera pulls back to the whole stack, cables flowing; "Every system. One living model."
     k44-57  end      in the break the drawing fades; "Meet the Marsad ontology."; on the hit (k48) the logo; then
                      marsadnasl.com and "Book your demo · احجز عرضك التجريبي"
   Truth: the object types, their links (Arabic labels and API names), the records (INV-10477, INV-10482, the two
   customers, the invoice line, the WhatsApp note), the file names, the page screenshots and the executed action's text
   are the app's own (site kit, site_pages/). Renderings: the rings, the tiered drawing (sources, ontology, pages: how
   Marsad works, drawn), the isometric icons, the record card's layout, the cables, the action's pill and its path. */
const B=M.B, S8=M.S8, S16=M.S16, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const NS='http://www.w3.org/2000/svg';
function sv(parent,tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);parent.appendChild(e);return e;}
function svgEl(parent,cls){const s=document.createElementNS(NS,'svg');s.setAttribute('class',cls||'fd-svg');s.setAttribute('width',1920);s.setAttribute('height',1080);parent.appendChild(s);return s;}

const K_TURN=B(8), K_ONT=B(16), K_APP=B(24), K_ALL=B(32), K_END=B(44), K_HIT=B(48);
window.CUTS=[K_TURN];                   // the hook cuts to the drawing; the rest is one camera

/* ---------------- the page, the canvas (cut round the title box) ---------------- */
const FX=88, FY=24, FR=1896, FB=1056, BX=952, BY=800;
const CVP=[[FX,FY],[FR,FY],[FR,FB],[BX,FB],[BX,BY],[FX,BY]];
const BGL=M.layer(), TXT=M.layer('over');
M.el('div','fd-page',null,BGL);
const CVS=M.el('div','fd-cvs',null,BGL);CVS.style.clipPath=`polygon(${CVP.map(p=>p[0]+'px '+p[1]+'px').join(',')})`;
const CBG=M.el('div','fd-bgc',null,CVS);
M.track(t=>{CBG.style.background=t<K_TURN?'#1E1E20':'#F1F0F4';});

/* ================= k0-8 the hook: rings of the company's raw data ================= */
const HK=svgEl(CVS);const RC={x:1150,y:420};
const DATA=['INV-10477','متاجر الواحة','8,920 ر.س','INV-10482','مؤسسة الريان التجارية','12,450 ر.س','بند 3','زيت زيتون 5 لتر','640 ر.س',
  '«الفاتورة تأخرت أسبوعًا»','invoices_q3.xlsx','branch_returns.csv','po_2291.pdf','suppliers_2025.xlsx','Odoo','واتساب'];
const rnd=M.mulberry(4242);
const RINGS=[...Array(16).keys()].map(i=>{
  const r=46+34*i+1.9*i*i, fs=10+1.75*i, id='rp'+i;
  sv(HK,'path',{id,d:`M${f1(RC.x-r)} ${RC.y} a${f1(r)} ${f1(r)} 0 1 1 ${f1(2*r)} 0 a${f1(r)} ${f1(r)} 0 1 1 ${f1(-2*r)} 0`,fill:'none'});
  const g=sv(HK,'g',{class:'fd-ring'});
  sv(g,'circle',{cx:RC.x,cy:RC.y,r:f1(r-fs*0.95),fill:'none',stroke:'rgba(255,255,255,0.22)','stroke-width':1.4,'stroke-dasharray':'0.1 9','stroke-linecap':'round'});
  const tx=sv(g,'text',{'font-size':f1(fs),'font-family':"'JBMono','PlexAR'",'font-weight':500,'letter-spacing':f2(fs*0.06)});
  const tp=sv(tx,'textPath',{href:'#'+id});
  const L=2*Math.PI*r, words=[];let est=0,k=(i*5)%DATA.length;
  while(est<L*0.97){const w=DATA[k%DATA.length];const span=sv(tp,'tspan',{});span.textContent=(words.length?'  ·  ':'')+w;
    words.push({e:span,ph:rnd()*20,sp:0.35+rnd()*0.5,on:rnd()});est+=(w.length+5)*fs*0.62;k++;}
  return {i,r,fs,g,words,w0:(6+rnd()*5)*(1.5-i/20),a0:rnd()*360,t0:B(0.1)+i*0.075};     // all one way, the inner rings faster
});
M.track(t=>{
  if(!show(HK,t<K_TURN))return;
  const pc=inc(t,B(6.75),K_TURN);                                  // the spin into the centre
  for(const R of RINGS){
    const ang=R.a0+R.w0*t+300*pc*pc, sc=1-0.93*pc;
    R.g.setAttribute('transform',`rotate(${f2(ang)} ${RC.x} ${RC.y}) translate(${f1(RC.x*(1-sc))} ${f1(RC.y*(1-sc))}) scale(${f3(sc)})`);
    R.g.setAttribute('opacity',f3(1-0.7*pc));
    const q=FQ(t);
    for(const w of R.words){                                          // words land over half a second, then drop out now and then
      const land=R.t0+w.on*0.55, a=q>=land&&(Math.sin(q*w.sp*6.283+w.ph)>-0.93||q<land+0.6);
      const v=a?'1':'0';if(w.v!==v){w.e.setAttribute('fill-opacity',v);w.v=v;}
    }
  }
});

/* ================= the drawing: tiers in perspective, one camera ================= */
const PIT=36*Math.PI/180, CP=Math.cos(PIT), SP=Math.sin(PIT), FOC=1150, SC={x:1150,y:470};
const Z1=1250, Z2=2500, TH=34;
function camOf(T,D){return {C:{x:T.x,y:T.y-D*CP,z:T.z+D*SP}};}
function pj(c,x,y,z){const vx=x-c.C.x,vy=y-c.C.y,vz=z-c.C.z,fw=vy*CP-vz*SP,up=vy*SP+vz*CP,s=FOC/fw;return {x:SC.x+vx*s,y:SC.y-up*s,s};}
const NEAR=90, fwOf=(c,p)=>(p[1]-c.C.y)*CP-(p[2]-c.C.z)*SP;
function clipPj(c,P3){            // a 3D polygon clipped to the part in front of the camera, projected
  const out=[];for(let i=0;i<P3.length;i++){const a=P3[i],b=P3[(i+1)%P3.length],fa=fwOf(c,a),fb=fwOf(c,b);
    if(fa>=NEAR)out.push(a);if((fa>=NEAR)!==(fb>=NEAR)){const u=(NEAR-fa)/(fb-fa);out.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u)]);}}
  return out.map(p=>pj(c,p[0],p[1],p[2]));}
const CAMK=[   // time, target, distance: drifts and cranes, each eased in and out
  [K_TURN,{x:260,y:300,z:60},1500],[B(15),{x:60,y:300,z:60},1500],
  [B(17),{x:-220,y:380,z:Z1+60},1550],[B(23),{x:260,y:380,z:Z1+60},1550],
  [B(25),{x:160,y:330,z:Z2+80},1650],[B(31.25),{x:-80,y:330,z:Z2+80},1650],
  [B(33.75),{x:0,y:350,z:Z1+180},4750],[K_END,{x:0,y:350,z:Z1+180},4450],[B(49),{x:0,y:350,z:Z1+180},5500]];
function camAt(t){
  let k=0;while(k<CAMK.length-2&&t>=CAMK[k+1][0])k++;
  const [ta,Ta,Da]=CAMK[k],[tb,Tb,Db]=CAMK[k+1], u=ez.ioC(P(t,ta,tb));
  return camOf({x:lerp(Ta.x,Tb.x,u),y:lerp(Ta.y,Tb.y,u),z:lerp(Ta.z,Tb.z,u)},lerp(Da,Db,u));
}

/* the tiers */
const TIER0=[{k:'sys',x0:-1300,x1:-120,y0:0,y1:560},{k:'files',x0:120,x1:1300,y0:0,y1:560}];
const TIER1={x0:-1400,x1:1400,y0:0,y1:760};
const TIER2=[{k:'pulse',x0:-1500,x1:-540,img:'pulse',ar:'نبض الأعمال',en:'BUSINESS PULSE'},{k:'dec',x0:-480,x1:480,img:'decisions',ar:'القرارات',en:'DECISIONS'},
  {k:'ai',x0:540,x1:1500,img:'assistant',ar:'مساعد مرصد الذكي',en:'ASSISTANT'}].map(p=>({...p,y0:0,y1:620}));

/* the isometric icons, drawn in the reference's line style (a 30-degree isometric; units ~ world units / 1.9) */
const INK='#1E1D22', W0='#FFFFFF', W1='#EFEDF3', W2='#DDD9E5', AC='#C8A1F0', AC2='#8E32C3', ACL='#E6D6F8';
const I=(x,y,z)=>[(x-y)*0.866,(x+y)*0.5-z];
const pts=a=>a.map(p=>f1(p[0])+','+f1(p[1])).join(' ');
const poly=(a,fill)=>`<polygon points="${pts(a)}" fill="${fill}"/>`;
function box(x,y,z,w,d,h,c=[W0,W1,W2]){
  return poly([I(x,y+d,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x,y+d,z+h)],c[1])+poly([I(x+w,y,z),I(x+w,y+d,z),I(x+w,y+d,z+h),I(x+w,y,z+h)],c[2])+
    poly([I(x,y,z+h),I(x+w,y,z+h),I(x+w,y+d,z+h),I(x,y+d,z+h)],c[0]);}
const onXF=(X,y1,z1,art)=>{const b=I(X,y1,z1);return `<g transform="matrix(0.866 -0.5 0 1 ${f1(b[0])} ${f1(b[1])})">${art}</g>`;};   // art on a +x face (u to the right, v down)
const onYF=(Y,x0,z1,art)=>{const b=I(x0,Y,z1);return `<g transform="matrix(0.866 0.5 0 1 ${f1(b[0])} ${f1(b[1])})">${art}</g>`;};    // art on a +y face
const rect=(x,y,w,h,f,o=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" opacity="${o}"/>`;
function cyl(z,h,r,top){const rx=r*1.2247, ry=r*0.7071, y0=-z, y1=-z-h;
  return `<path d="M${f1(-rx)} ${f1(y1)} V${f1(y0)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(rx)} ${f1(y0)} V${f1(y1)}" fill="${W1}"/><ellipse cx="0" cy="${f1(y1)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${top}"/>`;}
function sheet(h,art){return box(-4,-30,0,8,60,h,[W0,W1,W0])+onXF(4,30,h,art);}
const LINES=(n,y0,w=[40,34,40,28,36])=>[...Array(n).keys()].map(k=>rect(9,y0+k*8,w[k%w.length],3.4,INK,0.55)).join('');
const ICON={
  box: ()=>box(-32,-32,0,64,64,54)+poly([I(-32,-5,54),I(32,-5,54),I(32,5,54),I(-32,5,54)],AC)+poly([I(32,5,0),I(32,-5,0),I(32,-5,54),I(32,5,54)],AC),
  store:()=>box(-34,-28,0,68,56,48)+box(-38,-32,48,76,64,8,[W0,W2,W2])+
    onYF(28,-34,40,[0,1,2,3,4,5].map(k=>rect(k*11.33,0,11.33,12,k%2?W0:AC)).join('')+rect(6,18,30,18,ACL))+
    onXF(34,28,48,rect(20,18,16,30,W2)+rect(4,6,12,10,ACL)),
  doc: ()=>sheet(80,rect(8,8,44,9,AC)+LINES(4,24)+rect(28,62,24,6,AC2)),
  line:()=>box(-4,-24,0,8,48,62,[W0,W1,W0])+onXF(4,24,62,rect(7,8,34,3.4,INK,0.55)+rect(5,20,38,11,AC)+rect(7,39,30,3.4,INK,0.55)+rect(7,49,34,3.4,INK,0.55)),
  note:()=>box(-4,-32,16,8,64,48,[W0,W1,ACL])+poly([I(4,-20,16),I(4,-10,16),I(4,-26,2)],ACL)+onXF(4,32,64,LINES(3,12,[44,36,26])),
  person:()=>box(-26,-17,0,52,34,40)+onXF(26,17,40,`<polygon points="15,0 19,0 21,6 17,26 13,6" fill="${AC2}"/>`)+
    `<circle cx="0" cy="-62" r="17" fill="${W0}"/><path d="M-10 -58 Q0 -50 10 -58" fill="none"/>`,
  city:()=>box(-36,-4,0,22,22,66)+box(-10,-30,0,26,26,100,[AC,W1,W2])+box(16,4,0,22,22,52)+
    onXF(16,-4,100,LINES(6,10,[16,16,16]))+onXF(38,26,52,LINES(3,10,[12,12,12])),
  db:  ()=>cyl(0,20,30,W0)+cyl(24,20,30,W0)+cyl(48,20,30,AC),
  chat:()=>box(-4,-32,16,8,64,50,[W0,W1,AC])+poly([I(4,-22,16),I(4,-12,16),I(4,-28,2)],AC)+onXF(4,32,66,LINES(3,12,[44,36,26])),
  xlsx:()=>sheet(76,rect(8,8,26,12,'#1D7A46')+`<text x="21" y="17.5" font-size="8" font-family="Inter" font-weight="700" fill="#fff" text-anchor="middle">XLSX</text>`+LINES(4,30)),
  csv: ()=>sheet(76,rect(8,8,26,12,'#0E8A7A')+`<text x="21" y="17.5" font-size="8" font-family="Inter" font-weight="700" fill="#fff" text-anchor="middle">CSV</text>`+LINES(4,30)),
  pdf: ()=>sheet(76,rect(8,8,26,12,'#C8322B')+`<text x="21" y="17.5" font-size="8" font-family="Inter" font-weight="700" fill="#fff" text-anchor="middle">PDF</text>`+LINES(4,30)),
};
const ICS=2.3;                         // icon art unit -> world units

/* what stands on the tiers */
const SRCS=[{ic:'db',x:-920,y:300,lb:'Odoo',cls:''},{ic:'chat',x:-480,y:300,lb:'واتساب',cls:' ar'},
  {ic:'xlsx',x:340,y:300,lb:'invoices_q3.xlsx',cls:''},{ic:'csv',x:720,y:300,lb:'branch_returns.csv',cls:''},{ic:'pdf',x:1100,y:300,lb:'po_2291.pdf',cls:''}].map((o,i)=>({...o,z:0,t0:B(8.5)+i*S16}));
const OBJ=[{k:'cust',ic:'store',ar:'عميل',en:'Customer',x:0,y:380,h:62},{k:'inv',ic:'doc',ar:'فاتورة',en:'Invoice',x:660,y:210,h:84},
  {k:'note',ic:'note',ar:'ملاحظة',en:'Note',x:-1030,y:200,h:66},{k:'emp',ic:'person',ar:'موظف',en:'Employee',x:-850,y:600,h:82},
  {k:'city',ic:'city',ar:'مدينة',en:'City',x:350,y:650,h:104},{k:'prod',ic:'box',ar:'منتج',en:'Product',x:950,y:660,h:58},
  {k:'line',ic:'line',ar:'بند فاتورة',en:'Invoice line',x:1150,y:360,h:66}].map((o,i)=>({...o,z:Z1,t0:B(16.75)+i*S16}));
const OK={};OBJ.forEach(o=>OK[o.k]=o);
const LNK=[['cust','inv','صادرة إلى','billed_to'],['inv','line','تحتوي بند','has_line'],['prod','line','المنتج','line_product'],
  ['cust','note','يذكر','mentions',0.55],['cust','emp','مدير الحساب','account_manager',0.6],['cust','city','يقع في','located_in']].map((l,j)=>({a:OK[l[0]],b:OK[l[1]],ar:l[2],en:l[3],f:l[4]??0.5,t0:B(18.5)+j*S16}));

/* the layers, painted bottom tier first */
const DG=M.el('div','fd-lay',null,CVS);
const S0=svgEl(DG), H0=M.el('div','fd-lay',null,DG), SA=svgEl(DG), S1=svgEl(DG), H1=M.el('div','fd-lay',null,DG), SB=svgEl(DG), S2=svgEl(DG), H2=M.el('div','fd-lay',null,DG), S3=svgEl(DG), H3=M.el('div','fd-lay',null,DG);
S0.innerHTML=`<defs><pattern id="htc" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill="#FFFFFF"/><line x1="0" y1="0" x2="0" y2="7" stroke="#2B2A30" stroke-width="1.1"/></pattern></defs>`;
function plateEls(svg){return {top:sv(svg,'polygon',{fill:'#FFFFFF',stroke:INK,'stroke-width':1.6,'stroke-linejoin':'round'}),
  front:sv(svg,'polygon',{fill:'url(#htc)',stroke:INK,'stroke-width':1.6,'stroke-linejoin':'round'})};}
const seesTop=(c,z)=>c.C.z>z+10;      // above a plate the camera sees its top; below it, its underside
function drawPlate(c,pl,p,z){
  const zf=seesTop(c,z)?z:z-TH, F=clipPj(c,[[p.x0,p.y0,zf],[p.x1,p.y0,zf],[p.x1,p.y1,zf],[p.x0,p.y1,zf]]),
    E=clipPj(c,[[p.x0,p.y0,z],[p.x1,p.y0,z],[p.x1,p.y0,z-TH],[p.x0,p.y0,z-TH]]);
  pl.top.setAttribute('points',F.length>2?pts(F.map(q=>[q.x,q.y])):'');pl.front.setAttribute('points',E.length>2?pts(E.map(q=>[q.x,q.y])):'');}
const P0=TIER0.map(p=>plateEls(S0)), P1=plateEls(S1), P2=TIER2.map(p=>plateEls(S2));

/* an object: a pad on the plate, the icon standing on it, its label */
const PR=128;
function padPath(c,x,y,z,r){let d='';for(let k=0;k<=32;k++){const a=k/32*2*Math.PI,q=pj(c,x+r*Math.cos(a),y+r*Math.sin(a),z);d+=(k?'L':'M')+f1(q.x)+' '+f1(q.y);}return d+'Z';}
function thing(svg,html,o,lbHtml,lbCls){
  o.pad=sv(svg,'path',{fill:'#FFFFFF',stroke:INK,'stroke-width':1.5});
  o.g=sv(svg,'g',{stroke:INK,'stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
  o.gi=sv(o.g,'g',{});o.gi.innerHTML=ICON[o.ic]();o.gi.querySelectorAll('*').forEach(e=>e.setAttribute('vector-effect','non-scaling-stroke'));
  o.lb=M.el('div','fd-lb '+lbCls,lbHtml,html);
}
SRCS.forEach(o=>thing(S0,H0,o,o.lb,'fd-src'+o.cls));
const LK1=sv(S1,'g',{});                                              // the links lie under the pads
LNK.forEach(l=>{l.ln=sv(LK1,'line',{stroke:INK,'stroke-width':1.6,'stroke-dasharray':'6 6'});l.pl=M.el('div','fd-lb fd-pill',`<span>${l.ar}</span><span class="en">${l.en}</span>`,H1);});
[...OBJ].sort((a,b)=>b.y-a.y).forEach(o=>thing(S1,H1,o,`<span>${o.ar}</span><span class="en">${o.en}</span>`,'fd-ty'));
const TL0=M.el('div','fd-lb fd-tier','<span>SOURCES</span><span class="sep">·</span><span class="ar">المصادر</span>',H0);
const TL1=M.el('div','fd-lb fd-tier','<span>ONTOLOGY</span><span class="sep">·</span><span class="ar">الأنطولوجيا</span>',H1);
const CARD=M.el('div','fd-lb fd-card',`<div class="hd"><span>ملاحظة</span><span class="k">NOTE</span></div><div class="msg">«الفاتورة تأخرت أسبوعًا»</div>`+
  `<div class="rw"><span>متاجر الواحة</span><span class="k">CUSTOMER</span></div><div class="rw"><span>واتساب</span><span class="k">SOURCE</span></div>`,H1);
const CARDL=sv(S1,'polyline',{fill:'none',stroke:INK,'stroke-width':1.5});

/* the top tier: the app's pages lie on the plates */
TIER2.forEach(p=>{const src=`site_pages/${p.img}.png`;p.img=M.el('img','fd-scr',null,H2);p.img.src=src;});
TIER2.forEach((p,i)=>{p.lbl=M.el('div','fd-lb fd-tier',`<span>${p.en}</span><span class="sep">·</span><span class="ar">${p.ar}</span>`,H2);p.t0=B(25)+i*S8;});
const IW=948, IH=530;                                                 // the screenshots' display box (half of 1896 x 1060)
TIER2.forEach(p=>st(p.img,{width:IW+'px',height:IH+'px'}));
function homog(q){      // the projective map of the IW x IH box onto the screen quad q (top-left, top-right, bottom-right, bottom-left)
  const [x0,y0]=[q[0].x,q[0].y],[x1,y1]=[q[1].x,q[1].y],[x2,y2]=[q[2].x,q[2].y],[x3,y3]=[q[3].x,q[3].y];
  const dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3,den=dx1*dy2-dx2*dy1;
  const g=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den;
  const a=x1-x0+g*x1,b=x3-x0+h*x3,d=y1-y0+g*y1,e=y3-y0+h*y3;
  return `matrix3d(${[a/IW,d/IW,0,g/IW,b/IH,e/IH,0,h/IH,0,0,1,0,x0,y0,0,1].map(v=>(+v).toFixed(6)).join(',')})`;
}

/* the cables: bundles of dashed lines from a lower plate's back edge up to a higher plate's front */
function bundle(svg,n,lo,hi){const out=[];for(let k=0;k<n;k++){const u=(k+0.5)/n;
  out.push({lo:{x:lerp(lo.x0,lo.x1,u),y:lo.y,z:lo.z},hi:{x:lerp(hi.x0,hi.x1,u),y:hi.y,z:hi.z},
    e:sv(svg,'path',{fill:'none',stroke:'#2B2A30','stroke-width':1.5,'stroke-dasharray':'7 5 1.5 5','stroke-linecap':'round'}),ph:(k*37)%23});}return out;}
const CA=[...bundle(SA,11,{x0:-1180,x1:-240,y:560,z:0},{x0:-1200,x1:-330,y:0,z:Z1-TH}),
          ...bundle(SA,11,{x0:240,x1:1180,y:560,z:0},{x0:330,x1:1200,y:0,z:Z1-TH})].map((c,k)=>({...c,t0:B(10)+k*0.035}));
const CB=[...bundle(SB,9,{x0:-1320,x1:-620,y:760,z:Z1},{x0:-1400,x1:-640,y:0,z:Z2-TH}),...bundle(SB,9,{x0:-360,x1:360,y:760,z:Z1},{x0:-380,x1:380,y:0,z:Z2-TH}),
          ...bundle(SB,9,{x0:620,x1:1320,y:760,z:Z1},{x0:640,x1:1400,y:0,z:Z2-TH})].map((c,k)=>({...c,t0:B(21)+k*0.03}));
function drawCable(c,cb,t){let L=[cb.lo.x,cb.lo.y,cb.lo.z],H=[cb.hi.x,cb.hi.y,cb.hi.z];const fl=fwOf(c,L),fh=fwOf(c,H);
  if(fl<NEAR&&fh<NEAR){cb.e.setAttribute('d','');return;}
  if(fh<NEAR){const u=(NEAR-fl)/(fh-fl);H=[lerp(L[0],H[0],u),lerp(L[1],H[1],u),lerp(L[2],H[2],u)];}
  if(fl<NEAR){const u=(NEAR-fh)/(fl-fh);L=[lerp(H[0],L[0],u),lerp(H[1],L[1],u),lerp(H[2],L[2],u)];}
  const a=pj(c,L[0],L[1],L[2]),b=pj(c,H[0],H[1],H[2]),dy=a.y-b.y;
  cb.e.setAttribute('d',`M${f1(a.x)} ${f1(a.y)} C${f1(a.x)} ${f1(a.y-0.55*dy)} ${f1(b.x)} ${f1(b.y+0.55*dy)} ${f1(b.x)} ${f1(b.y)}`);
  cb.e.setAttribute('stroke-dashoffset',f1(cb.ph+38*t));cb.e.setAttribute('opacity',f3(dec(t,cb.t0,cb.t0+0.4)));}

/* the action: from the Product type up to Decisions; the toast */
const ACTL=sv(S3,'path',{fill:'none',stroke:AC2,'stroke-width':3,'stroke-linecap':'round'});
const ACT=M.el('div','fd-lb fd-act','<span>إعادة التوريد</span><span class="en">Restock</span>',H3);
const TOAST=M.el('div','fd-lb fd-toast','<span>✓</span><span>تم تنفيذ الإجراء</span><span class="en">PO-2291</span>',H3);
const T_A0=B(26.25), T_A1=B(27.75), T_TO=B(28);

const place=(e,x,y,s,o)=>{e.style.display=o>0.002?'':'none';if(o>0.002)st(e,{opacity:f3(o),transform:`translate(${f1(x)}px,${f1(y)}px) translate(-50%,-50%) scale(${f3(s)})`});};
M.track(t=>{
  const on=t>=K_TURN&&t<K_HIT+0.1;if(!show(DG,on))return;
  const c=camAt(t), fade=1-P(t,K_END,K_END+0.7);DG.style.opacity=f3(fade);
  // the bottom tier
  TIER0.forEach((p,i)=>drawPlate(c,P0[i],p,0));
  SRCS.forEach(o=>{const q=pj(c,o.x,o.y,o.z),p=dec(t,o.t0,o.t0+0.4);o.pad.setAttribute('d',padPath(c,o.x,o.y,o.z,PR*0.8));
    o.g.setAttribute('transform',`translate(${f1(q.x)} ${f1(q.y)}) scale(${f3(q.s*ICS*1.05)}) scale(1 ${f3(0.2+0.8*p)})`);o.g.setAttribute('opacity',f3(P(t,o.t0,o.t0+0.15)));
    const lq=pj(c,o.x,o.y-PR*0.8-40,o.z);place(o.lb,lq.x,lq.y+14*q.s*1.6,q.s*1.6,dec(t,o.t0+0.1,o.t0+0.45));});
  const tq=pj(c,0,-40,-TH);place(TL0,tq.x,tq.y+30*tq.s*1.7,tq.s*1.7,dec(t,B(9),B(9)+0.5));
  CA.forEach(cb=>drawCable(c,cb,t));
  // the ontology
  drawPlate(c,P1,TIER1,Z1);
  const onT1=seesTop(c,Z1);[LK1,...OBJ.map(o=>o.pad),...OBJ.map(o=>o.g)].forEach(e=>e.style.display=onT1?'':'none');
  LNK.forEach(l=>{const a=pj(c,l.a.x,l.a.y,Z1),b=pj(c,l.b.x,l.b.y,Z1),p=dec(t,l.t0,l.t0+0.45);
    l.ln.setAttribute('x1',f1(a.x));l.ln.setAttribute('y1',f1(a.y));l.ln.setAttribute('x2',f1(lerp(a.x,b.x,p)));l.ln.setAttribute('y2',f1(lerp(a.y,b.y,p)));
    l.ln.setAttribute('opacity',p>0?'1':'0');const m=pj(c,lerp(l.a.x,l.b.x,l.f),lerp(l.a.y,l.b.y,l.f),Z1);place(l.pl,m.x,m.y,m.s*1.55,onT1?dec(t,l.t0+0.25,l.t0+0.6):0);});
  OBJ.forEach(o=>{const q=pj(c,o.x,o.y,Z1),p=dec(t,o.t0,o.t0+0.4);o.pad.setAttribute('d',padPath(c,o.x,o.y,Z1,PR));o.pad.setAttribute('opacity',f3(P(t,o.t0-0.2,o.t0)));
    o.g.setAttribute('transform',`translate(${f1(q.x)} ${f1(q.y)}) scale(${f3(q.s*ICS)}) scale(1 ${f3(0.2+0.8*p)})`);o.g.setAttribute('opacity',f3(P(t,o.t0,o.t0+0.15)));
    const lq=pj(c,o.x,o.y,Z1+o.h*ICS+80);place(o.lb,lq.x,lq.y-12*q.s*1.6,q.s*1.6,onT1?dec(t,o.t0+0.15,o.t0+0.5):0);});
  const t1=pj(c,720,-40,Z1-TH);place(TL1,t1.x,t1.y+30*t1.s*1.7,t1.s*1.7,dec(t,B(17),B(17)+0.5));
  { const nt=OK.note, q=pj(c,-300,1000,Z1+230), a=pj(c,nt.x+40,nt.y,Z1+160), pc=(onT1?1:0)*dec(t,B(19.75),B(19.75)+0.5)*(1-P(t,B(23.5),B(24.25)));
    place(CARD,q.x,q.y,q.s*1.6,pc);
    CARDL.setAttribute('points',pts([[a.x,a.y],[q.x-120*q.s*1.6,q.y+95*q.s*1.6]]));CARDL.setAttribute('opacity',f3(pc)); }
  CB.forEach(cb=>drawCable(c,cb,t));
  // the top tier and its screens
  const onT2=seesTop(c,Z2);
  TIER2.forEach((p,i)=>{drawPlate(c,P2[i],p,Z2);
    const m=40, q=[pj(c,p.x0+m,p.y1-m,Z2),pj(c,p.x1-m,p.y1-m,Z2),pj(c,p.x1-m,p.y0+m,Z2),pj(c,p.x0+m,p.y0+m,Z2)];
    const ps=onT2?dec(t,p.t0,p.t0+0.5):0;p.img.style.display=ps>0.002?'':'none';if(ps>0.002){p.img.style.transform=homog(q);p.img.style.opacity=f3(ps);}
    const lq=pj(c,(p.x0+p.x1)/2,p.y1+30,Z2);place(p.lbl,lq.x,lq.y-26*lq.s*1.7,lq.s*1.7,onT2?dec(t,p.t0,p.t0+0.5):0);});
  // the action rises from the Product type to Decisions; then the toast
  const pa=P(t,T_A0,T_A1), pr=OK.prod, A0=pj(c,pr.x,pr.y,Z1+150), D=TIER2[1], A1=pj(c,(D.x0+D.x1)/2+120,D.y0,Z2-TH-60);
  if(t>=T_A0&&t<K_END){const e=ez.sin(pa),n=24;let d='';for(let k=0;k<=n;k++){const u=e*k/n,x=lerp(A0.x,A1.x,u*u*(3-2*u)),y=lerp(A0.y,A1.y,u);d+=(k?'L':'M')+f1(x)+' '+f1(y);}
    ACTL.setAttribute('d',d);ACTL.style.display='';ACTL.setAttribute('opacity',f3(1-P(t,T_TO+0.6,T_TO+1.4)));
    const x=lerp(A0.x,A1.x,e*e*(3-2*e)),y=lerp(A0.y,A1.y,e);place(ACT,x,y,Math.max(0.55,A0.s*1.6),dec(t,T_A0,T_A0+0.25)*(1-P(t,T_TO,T_TO+0.3)));}
  else{ACTL.style.display='none';ACT.style.display='none';}
  const tp=pj(c,(D.x0+D.x1)/2,230,Z2+90);place(TOAST,tp.x,tp.y,Math.max(0.5,tp.s*1.7),dec(t,T_TO,T_TO+0.35));
});

/* ================= the end: the logo on the light canvas, then the URL and "Book your demo" ================= */
const LOGO=M.el('div','fd-logo',`<img class="m" src="assets_logo_m.png"><img class="wm" src="assets_logo_wordmark_white.png">`,CVS);
const LCX=1270;
st(LOGO.querySelector('.m'),{left:(LCX-105)+'px',top:'230px',width:'210px'});st(LOGO.querySelector('.wm'),{left:(LCX-225)+'px',top:'418px',width:'450px'});
const CTA=M.el('div','fd-cta',`<span class="url">marsadnasl.com</span><span class="book"><span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span></span>`,CVS);
const cUrl=CTA.querySelector('.url'),cBook=CTA.querySelector('.book');
M.track(t=>{
  const on=t>=K_HIT;LOGO.style.display=on?'':'none';CTA.style.display=t>=B(49.5)?'':'none';if(!on)return;
  const pl=dec(t,K_HIT,K_HIT+0.55);st(LOGO,{opacity:f3(pl),filter:pl<1?`blur(${f2((1-pl)*10)}px)`:'none',transformOrigin:`${LCX}px 380px`,
    transform:`scale(${f3((0.94+0.06*pl)*(1+0.018*P(t,K_HIT,B(57))))})`});
  if(!CTA.dataset.w&&CTA.offsetWidth)CTA.dataset.w=CTA.offsetWidth;
  st(CTA,{left:f1(LCX-(+CTA.dataset.w||900)/2)+'px',top:'640px'});
  const pu=dec(t,B(49.5),B(49.5)+0.5),pk=dec(t,B(50),B(50)+0.5);
  st(cUrl,{opacity:f3(pu),transform:`translateY(${f1((1-pu)*16)}px)`});st(cBook,{opacity:f3(pk),transform:`translateY(${f1((1-pk)*16)}px)`});
});

/* ================= the frame: the canvas's border, the side strip, the title box ================= */
const FRM=svgEl(TXT);sv(FRM,'polygon',{points:pts(CVP),fill:'none',stroke:'#1C1B20','stroke-width':1.6});
M.el('img','fd-strip-m',null,TXT).src='assets_logo_m.png';
const SIDE=M.el('div','fd-side','<span>MARSAD</span><span class="arw">→</span><span>THE ONTOLOGY</span><span class="arw">·</span><span class="ar2">مرصد ← الأنطولوجيا</span>',TXT);
st(SIDE,{transform:'translate(34px,772px) rotate(-90deg)'});
const TITLES=[
  {at:B(0.25),en:"Your company's data is everywhere.",ar:'بيانات شركتك مبعثرة في كل مكان.'},
  {at:B(8.25),en:'Connect your sources.',ar:'اربط مصادرك.'},
  {at:B(16.25),en:'Unify them in one ontology.',ar:'وحّدها في أنطولوجيا واحدة.'},
  {at:B(24.25),en:'Monitor and act.',ar:'راقب ونفّذ.'},
  {at:B(32.25),en:'Every system. One living model.',ar:'كل الأنظمة… نموذج حيّ واحد.'},
  {at:B(44.25),en:'Meet the Marsad ontology.',ar:'تعرّف على أنطولوجيا مرصد.'}];
const TT=M.el('div','fd-tt','<div class="en"><span class="d"></span><span class="nw"></span></div><div class="ar"></div>',TXT);
const tEn=TT.querySelector('.en'), tD=TT.querySelector('.en .d'), tN=TT.querySelector('.en .nw'), tAr=TT.querySelector('.ar');
TITLES.forEach((T,i)=>{T.out=i<TITLES.length-1?TITLES[i+1].at-0.25:99;T.aw=T.ar.split(' ');});
let tKey='';
M.track(t=>{
  const T=TITLES.find(T=>t>=T.at&&t<T.out);
  if(!T){if(tKey!==''){tD.textContent='';tN.textContent='';tAr.innerHTML='';tKey='';}return;}
  const q=FQ(t)+1e-6, n=Math.min(T.en.length,Math.max(0,Math.floor((q-T.at)/0.024)+1)), na=Math.min(T.aw.length,Math.max(0,Math.floor((q-T.at-S8)/S16)+1));
  const g=q<T.at+T.en.length*0.024+0.2, ga=q<T.at+S8+T.aw.length*S16+0.2;
  const k=T.at+'|'+n+'|'+na+'|'+g+'|'+ga;if(k===tKey)return;tKey=k;
  if(!T.fs){tEn.style.fontSize='';tD.textContent=T.en;tN.textContent='';const w=tEn.scrollWidth;T.fs=w>790?Math.floor(50*790/w):50;}
  tEn.style.fontSize=T.fs+'px';
  const s=T.en.slice(0,n);tD.textContent=g?s.slice(0,-1):s;tN.textContent=g?s.slice(-1):'';
  tAr.innerHTML=T.aw.slice(0,na).map((w,i)=>`<span${ga&&i===na-1?' class="nw"':''}>${w}</span>`).join(' ');
});

M.punch(K_TURN,{amp:0.012});
M.punch(K_HIT,{amp:0.015});
M.start();
