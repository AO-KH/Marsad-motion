/* ================= beat grid — the 54s cut's own track: 95.96 BPM, bar = 4 beats = 2.501 s =================
   beat k at 0.03 + 0.62525·k.  Sections: intro k0–15 · groove k16–47 · breakdown k48–79 (hit on k64) · drums back k80. */
const MB=0.62525, PH=0.03, vbeat=k=>PH+MB*k;
const kOf=t=>(t-PH)/MB;
const S32=MB/8, S16=MB/4, S8=MB/2;
window.DURATION=54.0;

/* ================= camera moves (all on beats) ================= */
const TR=[
  {t:vbeat(8),  type:'charge', t0:vbeat(4), amp:0.035, rot:-0.8},                 // lean in on the number
  {t:vbeat(8),  type:'punch',  d:0.45, amp:0.03},                                 // the number shatters
  {t:vbeat(16), type:'through', a:0.46, b:0.50, amp:0.16, blur:6},                // drums in: into the app
  {t:vbeat(24), type:'nudge',  dir:-1, a:0.22, b:0.26, amp:60, blur:6, sweep:1},  // → Business Pulse
  {t:vbeat(32), type:'nudge',  dir:1,  a:0.22, b:0.26, amp:60, blur:6, sweep:1},  // → Decisions
  {t:vbeat(40), type:'punch',  d:0.35, amp:0.012},                                // approve
  {t:vbeat(42), type:'punch',  d:0.50, amp:0.028},                                // the seal lands
  {t:vbeat(42), type:'shake',  d:0.35, amp:0.5, f:12},
  {t:vbeat(48), type:'out',    a:0.45, b:0.70, amp:0.12, blur:6},                 // music drops out: pull back
  {t:vbeat(56), type:'rise',   dir:-1, a:0.45, b:0.50, amp:90, blur:8, sweep:1},  // Know. Watch. Decide.
  {t:vbeat(64), type:'punch',  d:0.55, amp:0.06},                                 // the hit: logo
  {t:vbeat(64), type:'shake',  d:0.6, amp:0.8, f:11},
  {t:vbeat(80), type:'punch',  d:0.60, amp:0.015},                                // drums return: CTA
];

/* ================= captions ================= */
function capSimple(e,t,t0,die0,die1,dy=24){const p=ez.dec(P(t,t0,t0+0.6)),d=ez.inC(P(t,die0,die1));
  st(e,{opacity:(p*(1-d)).toFixed(3),transform:`translateY(${((1-p)*dy).toFixed(2)}px)`});}
function capParts(e,t,times,die0,die1,dy=22){
  const d=ez.inC(P(t,die0,die1));
  st(e,{opacity:t>=times[0]-0.02?(1-d).toFixed(3):0});
  [...e.children].forEach((w,i)=>{const p=ez.dec(P(t,times[i],times[i]+0.5));
    st(w,{opacity:p.toFixed(3),transform:`translateY(${((1-p)*dy).toFixed(2)}px)`,filter:p<1?`blur(${(6*(1-p)).toFixed(2)}px)`:'none'});});}

/* ================= A: the number ================= */
const KPI_V=4812450;
function fmt(n){return Math.round(n).toLocaleString('en-US');}

/* ================= B: scattered sources ================= */
const FILES=['invoices_q3.xlsx','branch_returns.csv','po_2291.pdf','suppliers_2025.xlsx'];
const FILE_COL={xlsx:'#2EA36B',csv:'#12A594',pdf:'#E5484D'};
const GLASS=col=>`<i class="gb" style="background:${col};"></i><i class="gp"></i><i class="gs"></i>`;
function shade(hex,f=0.72){const n=parseInt(hex.slice(1),16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return '#'+[r,g,b].map(v=>Math.round(v*f).toString(16).padStart(2,'0')).join('');}
function glassTileHTML(n){
  if(n.k){const b=BRANDS[n.k];return GLASS(b.hex)+`<svg viewBox="0 0 24 24"><path fill="${b.hex}" d="${b.path}"/></svg><span class="tg">${b.label}</span>`;}
  return GLASS(n.col)+`<span class="doc" style="background:linear-gradient(160deg,${n.col},${shade(n.col)});">${n.doc}</span><span class="tg">${n.doc} file</span>`;}
const ITEMS=[...TILES.map(n=>({kind:'tile',n})),...FILES.map(f=>({kind:'file',f}))];
const HOME=[[330,250],[1590,215],[640,470],[1330,470],[250,640],[1690,610],[905,190],[1085,660],
            [540,130],[1260,120],[330,450],[1560,760]];
const FILE_ICON='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C6A74" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
{const R=mulberry(54),box=$('items');
 ITEMS.forEach((it,i)=>{const d=document.createElement('div');
   if(it.kind==='tile'){d.className='tile';d.innerHTML=glassTileHTML(it.n);it.w=112;it.h=112;}
   else {d.className='fchip';d.innerHTML=GLASS(FILE_COL[it.f.split('.').pop()])+FILE_ICON+`<span>${it.f}</span>`;it.w=0;it.h=58;}
   box.appendChild(d);it.el=d;it.home=HOME[i];it.ro=(R()-0.5)*16;it.ph=R()*6.3;});
 ITEMS.forEach(it=>{if(it.kind==='file')it.w=it.el.offsetWidth||250;});}
const BURST0=vbeat(8), ABSORB_ORDER=[8,0,9,1,10,2,11,3,4,5,6,7];     // files land first, then the sources
const ABS_T=ABSORB_ORDER.map((ix,j)=>vbeat(13)+j*S16);                 // one per 16th, k13 → k15.75

/* ================= the app window (C–G) ================= */
const K=0.7173, uiWrap=$('uiWrap'), uiSite=$('uiSite');
const strip=(key,html)=>html.replace(SK.chrome(key),'');
uiSite.innerHTML=
  `<div class="pg" id="pgProj">${strip('proj',SK.PAGES.projects())}</div>`+
  `<div class="pg" id="pgAI">${strip('ai',SK.PAGES.assistant())}</div>`+
  `<div class="pg" id="pgPulse">${strip('pulse',SK.PAGES.pulse())}</div>`+
  `<div class="pg" id="pgDec">${strip('dec',SK.PAGES.decisions())}</div>`+
  `<div class="pg" id="skChrome">${SK.chrome('proj')}</div>`;
const PG={proj:$('pgProj'),ai:$('pgAI'),pulse:$('pgPulse'),dec:$('pgDec')};
const TABPOS={};SK.TABS.forEach(([k,l,cx,w])=>TABPOS[k]=[cx-w/2,w]);
const tabEls=[...$('skChrome').querySelectorAll('.sk-tab')], ulEl=$('skUL'), badge=$('skChrome').querySelector('.sk-badge');
const SWITCH=[[vbeat(16)-0.06,'proj','ai'],[vbeat(24)-0.06,'ai','pulse'],[vbeat(32)-0.06,'pulse','dec']];
function offsetIn(el,root){let x=0,y=0;while(el&&el!==root){x+=el.offsetLeft;y+=el.offsetTop;el=el.offsetParent;}return [x,y];}
function centerIn(el){const [x,y]=offsetIn(el,uiSite);return [x+el.offsetWidth/2,y+el.offsetHeight/2];}   // natural coords
let UIW={s:1,tx:0,ty:0,a:0,gone:0};
/* focus track: the window pushes in on what matters (natural-space point, extra zoom), smooth between keys */
const FOCUS=[[16.8,948,530,0],[17.5,600,930,0.24],[19.6,600,930,0.24],[20.3,520,560,0.18],[21.8,520,560,0.18],
  [22.6,500,760,0.26],[23.5,500,760,0.26],[24.2,948,530,0],[27.6,948,530,0],[28.4,560,300,0.22],[31.3,560,300,0.22],
  [32.0,948,530,0],[34.0,948,640,0.06],[39.8,948,640,0.06],[40.8,948,530,0],[41.6,780,600,0.32],[46.9,780,600,0.32],[48.0,948,530,0]]
  .map(r=>[vbeat(r[0]),r[1],r[2],r[3]]);
function focusAt(t){
  if(t<=FOCUS[0][0])return FOCUS[0].slice(1);
  for(let i=0;i<FOCUS.length-1;i++){const a=FOCUS[i],b=FOCUS[i+1];
    if(t<b[0]){const p=ez.ioC(P(t,a[0],b[0]));return [lerp(a[1],b[1],p),lerp(a[2],b[2],p),lerp(a[3],b[3],p)];}}
  return FOCUS[FOCUS.length-1].slice(1);}
function uiwState(t){
  const pA=ez.dec(P(t,vbeat(12),vbeat(12)+0.55)), grow=ez.dec(P(t,vbeat(15.5),vbeat(16.8)));
  const rec=ez.dec(P(t,vbeat(48),vbeat(49.5))), gone=ez.inC(P(t,vbeat(49.5),vbeat(51)));
  const drift=0.018*P(t,vbeat(16.8),vbeat(48));                                     // slow push, never a pulse
  let s=(0.56+0.04*pA)*(1-grow)+grow*(1+drift); s=s*(1-rec)+0.42*rec;
  const [fx,fy,z]=focusAt(t), s2=s*(1+z);
  const F0x=960+(fx*K-680)*s, F0y=530+(fy*K-380)*s, c=0.45*Math.min(1,z/0.3);   // the focus point drifts toward frame centre
  const Cx=F0x+(960-F0x)*c, Cy=F0y+(500-F0y)*c;
  UIW={s:s2,tx:Cx-(960+(fx*K-680)*s2),ty:Cy-(530+(fy*K-380)*s2),a:pA,gone};
}
function natToStage(nx,ny){const lx=nx*K,ly=ny*K;return [960+(lx-680)*UIW.s+UIW.tx,530+(ly-380)*UIW.s+UIW.ty];}

/* projects: file rows land one by one, sources flash the cards they feed */
const projCards=[...PG.proj.querySelectorAll('.sk-card')];              // [sections, projects, files]
const fileRows=[...projCards[2].children].filter(d=>/\.(xlsx|csv|pdf)/.test(d.textContent));
const fileCount=[...projCards[2].querySelectorAll('span')].find(s=>s.textContent.trim()==='(12)');
const projItems=[...projCards[1].children].filter(d=>/فواتير|مرتجعات|عقود/.test(d.textContent));
const secItems=[...projCards[0].children].filter(d=>/المبيعات|المخزون/.test(d.textContent));
const TARGETS=ITEMS.map((it,i)=>{
  if(it.kind==='file')return fileRows[i-8];
  return [projItems[0],projItems[1],projItems[2],secItems[0],secItems[1],projItems[0],projItems[1],projItems[2]][i];});

/* assistant: typed question, answer with sources, proof table */
const aiCard=PG.ai.querySelector('.sk-main .sk-card');
const aiKids=[...aiCard.children], aiEmpty=aiKids.slice(0,4), aiInRow=aiKids[4];
const aiInput=aiInRow.querySelector('.sk-input'), aiSend=aiInRow.children[1];
aiInput.innerHTML='<span id="aiPh">اسأل مرصد عن أي شيء بخصوص بياناتك...</span><span id="aiQ"></span><span id="aiCaret"></span>';
const Q_AI='من أين جاء رقم مبيعات الربع الثالث؟';
const ANS_AI=['الرقم','مجموع','§','من','Odoo','للربع','الثالث.'];
PG.ai.insertAdjacentHTML('beforeend',`
  <div class="abs" id="aiUser">${Q_AI}</div>
  <div class="abs" id="aiAv">${SK.ic('bot',28,'#fff',2)}</div>
  <div class="abs" id="aiAns"><div id="aiTxt"></div><div id="aiChips">
    <span class="pchip file">${FILE_ICON.replace('22','18').replace('22','18')}<span>invoices_q3.xlsx</span></span>
    <span class="pchip src">Odoo · ١٬٢٤٧ فاتورة</span>
    <span class="pchip ok">${SK.ic('check',16,'#0B8447',2.6)}<span>مطابق لتقارير الفروع</span></span></div></div>
  <div class="abs" id="aiProof">
    <div class="abs prow h" style="top:0;"><span class="id">INVOICE</span><span class="nm">العميل</span><span class="am">AMOUNT · المبلغ</span></div>
    <div class="abs prow" style="top:44px;"><span class="id">INV-10482</span><span class="nm">مؤسسة الريان التجارية</span><span class="am">١٢٬٤٥٠ ر.س</span></div>
    <div class="abs prow" style="top:92px;"><span class="id">INV-10477</span><span class="nm">متاجر الواحة</span><span class="am">٨٬٩٢٠ ر.س</span></div>
    <div class="abs prow" style="top:140px;"><span class="id">+1,245</span><span class="nm">فاتورة أخرى — الربع الثالث</span><span class="am">…</span></div>
    <div class="abs prow tot" style="top:188px;"><span class="id">Σ 1,247</span><span class="nm">المجموع</span><span class="am">٤٬٨١٢٬٤٥٠ ر.س ✓</span></div>
  </div>`);
const aiChips=[...$('aiChips').children], proofRows=[...$('aiProof').children];

/* business pulse: the daily advisor switches on, new findings, an alert */
const togEl=PG.pulse.querySelector('.sk-toggle');
togEl.innerHTML='<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect id="togR" x="2" y="7" width="20" height="10" rx="5" stroke="#535257" fill="#F3F3F3"/><circle id="togK" cx="7.5" cy="12" r="2.8" fill="#535257"/></svg><span id="togT">مُعطّل</span>';
const newPills=[...PG.pulse.querySelectorAll('.sk-pill.new')];
PG.pulse.insertAdjacentHTML('beforeend',`<div class="abs" id="scan"></div>
  <div class="abs" id="alertCard"><span class="dot"></span><span class="t">تنبيه: انخفاض مخزون فرع الرياض ١٨٪</span>
    <span class="m">${SK.pill('hi','مرتفع')}${SK.pill('src','المخزون · Odoo')}<span class="sk-meta">الآن</span></span>
    <svg width="130" height="76" viewBox="0 0 130 76"><polyline points="4,16 26,20 46,14 66,30 86,34 104,56 126,62" fill="none" stroke="#A8131C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="126" cy="62" r="5" fill="#A8131C"/></svg></div>`);

/* decisions: both sides with evidence, then the sealed record */
const decMain=$('pgDecS'), decCardEl=$('decCard'), veilEl=$('veil');
$('toast').style.display='none';
const EV=(f)=>`<span class="ev">${FILE_ICON.replace('22','15').replace('22','15')}<span>${f}</span></span>`;
const CHECK_C='<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0B8447" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.3 12.3 2.5 2.5 5-5.3"/></svg>';
const ALERT_C='<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#AA3C07" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>';
const FOR_R=[['الطلب على المنتج ارتفع ١٢٪','sales_q3.xlsx'],['مهلة المورد ٥ أيام فقط','suppliers_2025.xlsx'],['٤٢ طلب عميل معلّق','Odoo · orders']];
const AGN_R=[['سيولة مجمّدة ٣٢٠ ألف ر.س','finance_q3.xlsx'],['مرتجعات الفرع ٦٪','branch_returns.csv']];
decMain.insertAdjacentHTML('beforeend',`
 <div class="abs" id="bsPanel">
  <div class="abs ttl">انخفاض مخزون فرع الرياض — يُنصح بإعادة التوريد اليوم</div>
  <div class="abs pills">${SK.pill('hi','مرتفع')}${SK.pill('src','المخزون · Odoo')}</div>
  <div class="abs bsCol" id="bsFor" style="left:726px;"><div class="abs hd" style="color:#0B8447;">${CHECK_C}<span>مع</span><small>FOR</small></div>
    ${FOR_R.map((r,i)=>`<div class="abs bsRow" style="top:${62+i*66}px;"><span class="tx">${r[0]}</span>${EV(r[1])}</div>`).join('')}</div>
  <div class="abs" id="bsDiv"></div>
  <div class="abs bsCol" id="bsAgn" style="left:36px;"><div class="abs hd" style="color:#AA3C07;">${ALERT_C}<span>ضد</span><small>AGAINST</small></div>
    ${AGN_R.map((r,i)=>`<div class="abs bsRow" style="top:${62+i*66}px;"><span class="tx">${r[0]}</span>${EV(r[1])}</div>`).join('')}</div>
  <div class="abs" id="bsRec"><span class="rt">التوصية: إعادة توريد جزئي ٦٠٪</span>
    <span class="cf"><span class="bar"><b id="cfBar"></b></span><span class="cfv" id="cfV">ثقة ٠٪</span></span>
    <span id="bsBtns"><span id="bsOK">${SK.ic('check',22,'#0B8447',2.6)}<span>موافقة</span></span><span id="bsEdit">${SK.ic('sliders',20,'#1A191E',2)}<span>تعديل</span></span></span></div>
 </div>
 <div class="abs" id="sealRec"><span class="t">قرار #D-1042 · إعادة توريد جزئي ٦٠٪ لفرع الرياض</span>
  <span class="m">${SK.pill('ok',SK.ic('check',15,'#0B8447',2.6)+'معتمد')}${SK.pill('src','بواسطة: م. العتيبي')}<span class="sk-meta">الآن</span></span>
  <span id="sealHash"></span><span id="sealTime">٢٥ سبتمبر ٢٠٢٦ · ١٠:٣٤ ص · سجل التدقيق</span>
  <svg id="sealLock" width="52" height="60" viewBox="0 0 26 30" fill="none" stroke="#5909B4" stroke-width="2.4" stroke-linecap="round"><path id="lockSh" d="M7 13V9a6 6 0 0 1 12 0v4"/><rect x="3" y="13" width="20" height="15" rx="3" fill="#F1E9FA"/><circle cx="13" cy="20.5" r="2" fill="#5909B4" stroke="none"/></svg>
  <span id="sealImm">${SK.pill('cat','غير قابل للتعديل · IMMUTABLE')}</span>
  <span id="sealEdit">${SK.ic('sliders',18,'#6C6A74',2)}<span>تعديل</span></span>
  <span id="sealTip">${SK.ic('x',18,'#A8131C',2.6)}<span>لا يقبل التعديل · READ-ONLY</span></span>
 </div>
 <svg class="abs" id="stamp" viewBox="0 0 220 220">
  <defs><path id="stampArc" d="M110,110 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
  <defs><radialGradient id="stGl" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity="0.88"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.42"/><stop offset="1" stop-color="#EBDDF8" stop-opacity="0.34"/></radialGradient>
    <linearGradient id="stSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="110" cy="110" r="102" fill="url(#stGl)" stroke="#5909B4" stroke-width="5"/>
  <ellipse cx="110" cy="58" rx="74" ry="36" fill="url(#stSh)" opacity="0.7"/>
  <circle cx="110" cy="110" r="90" fill="none" stroke="#8E32C3" stroke-width="2"/>
  <circle cx="110" cy="110" r="58" fill="none" stroke="#BC59D1" stroke-width="2"/>
  <text font-family="JBMono" font-size="17" font-weight="700" letter-spacing="3" fill="#5909B4"><textPath href="#stampArc">SEALED · مختوم · SEALED · مختوم ·</textPath></text>
  <image href="assets_logo_m.png" x="72" y="81" width="76" height="58"/>
 </svg>`);
const forRows=[...$('bsFor').querySelectorAll('.bsRow')], agnRows=[...$('bsAgn').querySelectorAll('.bsRow')];
const HASH='SHA-256 · 7f3a9c2e51d0b81d04e21b6a93c4';

/* ================= G/I: wall of the site's pages ================= */
const WALL_PAGES=['pulse','home','decisions','knowledgeMap','assistant','objectTypes','links','search','projects','admin'];
{const wall=$('wall');const TW=600,TH=335,GAP=44,COLS=5,ROWS=5;
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
   const img=document.createElement('img');img.className='wtile';
   img.src='site_pages/'+WALL_PAGES[(r*COLS+c+r*3)%WALL_PAGES.length]+'.png';
   st(img,{left:c*(TW+GAP)+'px',top:r*(TH+GAP)+'px',width:TW+'px',height:TH+'px'});wall.appendChild(img);}}

/* ================= I: ignition burst for the logo (one hit, on k64) ================= */
const IGN=vbeat(64), CX=960, CY=342;
const RB=[],SPK=[];
{const R=mulberry(2024),g=$('burst'),NS='http://www.w3.org/2000/svg';
 for(let i=0;i<18;i++){const l=document.createElementNS(NS,'line');const a=i/18*Math.PI*2+(R()-0.5)*0.12;
   l.setAttribute('stroke',i%2?'#DE0DFF':'#8E32C3');l.setAttribute('stroke-linecap','round');l.setAttribute('opacity','0');g.appendChild(l);
   RB.push({el:l,a,len:0.7+R()*0.6,sp:0.8+R()*0.4});}
 for(let i=0;i<30;i++){const c=document.createElementNS(NS,'circle');c.setAttribute('fill',i%3?'#BC59D1':'#DE0DFF');c.setAttribute('opacity','0');g.appendChild(c);
   SPK.push({el:c,a:R()*Math.PI*2,v:360+R()*520,r:1.8+R()*2.8,life:0.7+R()*0.5});}}

/* ================= scene renderers ================= */
function sceneA(t){
  const on=t<vbeat(9.5); showS($('sA'),on); if(!on)return;
  const pIn=ez.dec(P(t,vbeat(1.5),vbeat(1.5)+0.7));
  const shatter=P(t,BURST0-0.04,BURST0+0.30);
  const cnt=ez.dec(P(t,vbeat(2),vbeat(4)));
  $('kpiNum').textContent=fmt(KPI_V*cnt);
  st($('kpi'),{opacity:(pIn*(1-ez.outC(shatter))).toFixed(3),
    transform:`translateY(${((1-pIn)*30).toFixed(2)}px) scale(${((0.94+0.06*pIn)*(1+0.22*ez.outC(shatter))).toFixed(4)})`,
    filter:shatter>0?`blur(${(10*shatter).toFixed(2)}px)`:'none'});
  const pS=ez.dec(P(t,vbeat(6),vbeat(6)+0.5));
  st($('kpiSrc'),{opacity:(pS*(1-ez.outC(shatter))).toFixed(3),transform:`translateY(${((1-pS)*16).toFixed(2)}px)`});
}
function sceneB(t){
  const on=t>=BURST0-0.05&&t<vbeat(16.5); showS($('items'),on);
  if(!on)return;
  ITEMS.forEach((it,i)=>{
    const t0=BURST0+i*S32, p=ez.dec(P(t,t0,t0+0.75));
    const hx=it.home[0]+6*Math.sin(0.9*t+it.ph), hy=it.home[1]+5*Math.cos(0.7*t+it.ph*1.3);
    let x=lerp(960,hx,p), y=lerp(457,hy,p), sc=0.4+0.6*p, op=t>=t0?Math.min(1,p*3):0, ro=it.ro*p;
    const j=ABSORB_ORDER.indexOf(i), ta=ABS_T[j];
    if(t>=ta-0.45){                                                   // pulled into the app, landing on its 16th
      const q=ez.inC(P(t,ta-0.45,ta)), tg=natToStage(...centerIn(TARGETS[i]));
      x=lerp(hx,tg[0],q);y=lerp(hy,tg[1],q);sc*=1-0.7*q;ro*=1-q;op=t<ta?1:0;}
    st(it.el,{left:(x-(it.w||250)/2).toFixed(1)+'px',top:(y-it.h/2).toFixed(1)+'px',opacity:op.toFixed(3),
      transform:`rotate(${ro.toFixed(2)}deg) scale(${sc.toFixed(4)})`});
  });
}
function landGlow(el,t,ta,rgba){const q=t-ta;el.style.boxShadow=(q>=0&&q<0.5)?`0 0 0 ${(3*(1-q/0.5)).toFixed(1)}px ${rgba},0 0 ${(40*(1-q/0.5)).toFixed(0)}px ${rgba}`:'';}
function sceneApp(t){
  const on=t>=vbeat(12)-0.05&&t<vbeat(52); show(uiWrap,on); if(!on){uiWrap.style.opacity=0;return;}
  // window size (uiwState): small while it gathers the sources, full size from the drums in, recedes into the wall
  st(uiWrap,{opacity:(UIW.a*(1-UIW.gone)).toFixed(3),transform:`translate(${UIW.tx.toFixed(2)}px,${UIW.ty.toFixed(2)}px) scale(${UIW.s.toFixed(4)})`});
  st($('capBand'),{opacity:(ez.dec(P(t,vbeat(16.5),vbeat(17)))*(1-ez.inC(P(t,vbeat(47.5),vbeat(48.5))))).toFixed(3)});
  {const ba=((kOf(t)/8*360)%360)+'deg';$('uiBeam').style.setProperty('--ba',ba);$('uiBeamS').style.setProperty('--ba',ba);}
  // pages + the tab underline
  let cur='proj',prev=null,sw=1;
  for(const [ts,a,b] of SWITCH){if(t>=ts){cur=b;prev=a;sw=ez.dec(P(t,ts,ts+0.3));}}
  for(const k in PG){const e=PG[k];const o=k===cur?sw:(k===prev?1-sw:0);show(e,o>0.001);e.style.opacity=o.toFixed(3);}
  const from=TABPOS[prev||'proj'],to=TABPOS[cur];
  st(ulEl,{left:lerp(from[0],to[0],sw).toFixed(1)+'px',width:lerp(from[1],to[1],sw).toFixed(1)+'px'});
  const onKey=sw<0.5&&prev?prev:cur; tabEls.forEach(e=>e.classList.toggle('on',e.dataset.k===onKey));
  // ---- projects: files and sources land
  ITEMS.forEach((it,i)=>{const ta=ABS_T[ABSORB_ORDER.indexOf(i)];
    if(it.kind==='file'){const r=TARGETS[i],p=ez.dec(P(t,ta,ta+0.3));st(r,{opacity:(t<vbeat(12)?1:p).toFixed(3),transform:`translateX(${((1-p)*-24).toFixed(1)}px)`});}
    else landGlow(TARGETS[i],t,ta,'rgba(188,89,209,0.55)');});
  if(fileCount){const n=8+ITEMS.filter((it,i)=>it.kind==='file'&&t>=ABS_T[ABSORB_ORDER.indexOf(i)]).length;fileCount.textContent=`(${t<vbeat(12)?12:n})`;}
  // ---- assistant: ask, answer, proof
  {const k0=vbeat(17),sent=t>=vbeat(19.75);
   const keys=t>=k0?Math.floor((t-k0)/S32)+1:0, n=sent?0:Math.min(Q_AI.length,keys*2);
   $('aiQ').textContent=Q_AI.slice(0,n); $('aiPh').style.display=(n>0)?'none':''; $('aiCaret').style.opacity=(t>=vbeat(16.5)&&!sent)?1:0;
   const press=t>=vbeat(19.5)&&t<vbeat(19.75);
   st(aiSend,{background:n>0?'linear-gradient(90deg,#5F0DB4,#BC59D1)':'#C9A8E6',transform:press?'scale(0.92)':'scale(1)',
     boxShadow:n>0?'0 0 26px rgba(188,89,209,0.55)':''});
   st(aiInput,{borderColor:n>0?'#8E32C3':'#CECDD2'});
   const gone=ez.dec(P(t,vbeat(19.5),vbeat(19.5)+0.35));aiEmpty.forEach(e=>e.style.opacity=(1-gone).toFixed(3));
   const pU=ez.dec(P(t,vbeat(19.75),vbeat(19.75)+0.4));st($('aiUser'),{opacity:pU.toFixed(3),transform:`translateY(${((1-pU)*16).toFixed(1)}px)`});
   const pA2=ez.dec(P(t,vbeat(20),vbeat(20)+0.4));
   st($('aiAv'),{opacity:pA2.toFixed(3)});st($('aiAns'),{opacity:pA2.toFixed(3),transform:`translateY(${((1-pA2)*20).toFixed(1)}px)`});
   const nw=t>=vbeat(20.25)?Math.min(ANS_AI.length,Math.floor((t-vbeat(20.25))/S16)+1):0;
   $('aiTxt').innerHTML=ANS_AI.slice(0,nw).map(w=>w==='§'?'<span class="hl">١٬٢٤٧ فاتورة</span>':w).join(' ');
   aiChips.forEach((c,i)=>{const p=ez.emph(P(t,vbeat(22)+i*S16,vbeat(22)+i*S16+0.35));st(c,{opacity:p.toFixed(3),transform:`scale(${(0.85+0.15*p).toFixed(3)})`});});
   const pP=ez.dec(P(t,vbeat(22.5),vbeat(22.5)+0.4));st($('aiProof'),{opacity:pP.toFixed(3),transform:`translateY(${((1-pP)*24).toFixed(1)}px)`});
   proofRows.forEach((r,i)=>{const p=ez.dec(P(t,vbeat(22.5)+i*S16,vbeat(22.5)+i*S16+0.3));st(r,{opacity:p.toFixed(3),transform:`translateX(${((1-p)*18).toFixed(1)}px)`});});}
  // ---- business pulse: switch on, findings, alert
  {const pOn=ez.dec(P(t,vbeat(25),vbeat(25)+0.25)), on2=pOn>0.5;
   $('togK').setAttribute('cx',(7.5+9*pOn).toFixed(2));$('togK').setAttribute('fill',on2?'#5909B4':'#535257');
   $('togR').setAttribute('fill',on2?'#E6D6F5':'#F3F3F3');$('togR').setAttribute('stroke',on2?'#8E32C3':'#535257');
   $('togT').textContent=on2?'مُفعّل':'مُعطّل';
   st(togEl,{background:on2?'#F1E9FA':'#F3F3F3',borderColor:on2?'#D6C1EE':'#D2D1D4',color:on2?'#5909B4':'#535257',
     boxShadow:on2?'0 0 26px rgba(142,50,195,0.28)':''});
   newPills.forEach((e,i)=>{const p=ez.emph(P(t,vbeat(26)+i*S8,vbeat(26)+i*S8+0.35));st(e,{opacity:p.toFixed(3),transform:`scale(${(0.6+0.4*p).toFixed(3)})`});});
   const sp=P(t,vbeat(25),vbeat(28.5));st($('scan'),{top:(250+760*sp).toFixed(1)+'px',opacity:(sp>0&&sp<1?0.9*Math.sin(Math.PI*sp):0).toFixed(3)});
   const pAl=ez.dec(P(t,vbeat(28),vbeat(28)+0.45));st($('alertCard'),{opacity:pAl.toFixed(3),transform:`translateY(${((1-pAl)*-28).toFixed(1)}px)`});
   const bp=ez.emph(P(t,vbeat(28),vbeat(28)+0.35));badge.textContent=t>=vbeat(28)?'4':'3';badge.style.transform=`scale(${(t>=vbeat(28)?1+0.35*(1-bp):1).toFixed(3)})`;}
  // ---- decisions: both sides with evidence
  {const fw=ez.dec(P(t,vbeat(32.5),vbeat(32.5)+0.5));veilEl.style.opacity=(fw*(1-ez.inC(P(t,vbeat(47),vbeat(48))))).toFixed(3);
   const pb=ez.dec(P(t,vbeat(33),vbeat(33)+0.8));
   decCardEl.style.opacity=(1-ez.dec(P(t,vbeat(33),vbeat(33)+0.25))).toFixed(3);
   decCardEl.style.transform=`scale(${(1+0.035*fw).toFixed(4)})`;
   const morph=ez.dec(P(t,vbeat(40.75),vbeat(41.25)));
   st($('bsPanel'),{top:lerp(517,300,pb).toFixed(1)+'px',height:lerp(214,560,pb).toFixed(1)+'px',
     opacity:(Math.min(1,pb*4)*(1-morph)).toFixed(3)});
   forRows.forEach((r,i)=>{const t0=vbeat(33.5)+i*S8,p=ez.dec(P(t,t0,t0+0.35));st(r,{opacity:p.toFixed(3),transform:`translateX(${((1-p)*-20).toFixed(1)}px)`});
     const ev=r.querySelector('.ev'),q=ez.emph(P(t,t0+S16,t0+S16+0.3));st(ev,{opacity:q.toFixed(3),transform:`translateY(-50%) scale(${(0.8+0.2*q).toFixed(3)})`});});
   agnRows.forEach((r,i)=>{const t0=vbeat(35)+i*S8,p=ez.dec(P(t,t0,t0+0.35));st(r,{opacity:p.toFixed(3),transform:`translateX(${((1-p)*20).toFixed(1)}px)`});
     const ev=r.querySelector('.ev'),q=ez.emph(P(t,t0+S16,t0+S16+0.3));st(ev,{opacity:q.toFixed(3),transform:`translateY(-50%) scale(${(0.8+0.2*q).toFixed(3)})`});});
   const pr=ez.dec(P(t,vbeat(36),vbeat(36)+0.45));st($('bsRec'),{opacity:pr.toFixed(3),transform:`translateY(${((1-pr)*16).toFixed(1)}px)`});
   const cf=ez.dec(P(t,vbeat(36),vbeat(37.5)));$('cfBar').style.width=(80*cf).toFixed(1)+'%';
   $('cfV').textContent='ثقة '+['٠','١','٢','٣','٤','٥','٦','٧','٨'][Math.round(8*cf)]+(Math.round(8*cf)?'٠':'')+'٪';
   // approve on the downbeat: press, green flash
   const press=t>=vbeat(40)&&t<vbeat(40.25),fl=P(t,vbeat(40),vbeat(40)+0.4);
   st($('bsOK'),{transform:press?'scale(0.95)':'scale(1)',background:t>=vbeat(39.75)?'#CFEEDD':'#E7F5EE',
     boxShadow:fl>0&&fl<1?`0 0 0 ${(5*(1-fl)).toFixed(1)}px rgba(11,132,71,${(0.45*(1-fl)).toFixed(2)}),0 0 ${(28*(1-fl)).toFixed(0)}px rgba(11,132,71,0.5)`:''});}
  // ---- the sealed record
  {const pR=ez.dec(P(t,vbeat(41),vbeat(41)+0.5));st($('sealRec'),{opacity:pR.toFixed(3),transform:`scale(${(0.96+0.04*pR).toFixed(4)})`});
   const q=P(t,vbeat(42),vbeat(42)+0.2), qs=ez.outC(q);
   st($('stamp'),{opacity:(t>=vbeat(42)?Math.min(1,q*2.5):0).toFixed(3),transform:`rotate(${(-18+9*qs).toFixed(2)}deg) scale(${(1.7-0.7*qs).toFixed(4)})`});
   const nh=t>=vbeat(43)?Math.min(HASH.length,(Math.floor((t-vbeat(43))/S32)+1)*3):0;$('sealHash').textContent=HASH.slice(0,nh);
   $('sealTime').style.opacity=ez.dec(P(t,vbeat(44.5),vbeat(44.5)+0.4)).toFixed(3);
   const pl=ez.dec(P(t,vbeat(44),vbeat(44)+0.3));st($('sealLock'),{opacity:pl.toFixed(3)});$('lockSh').setAttribute('transform',`translate(0,${(-4*(1-pl)).toFixed(2)})`);
   st($('sealImm'),{opacity:ez.dec(P(t,vbeat(44.25),vbeat(44.25)+0.4)).toFixed(3)});
   const qd=t-vbeat(46),den=qd>=0&&qd<0.45?10*Math.sin(2*Math.PI*8*qd)*Math.exp(-qd/0.12):0;
   st($('sealEdit'),{transform:`translateX(${den.toFixed(2)}px)`,borderColor:t>=vbeat(46)?'#EBC5C7':'#D6D5DA',color:t>=vbeat(46)?'#A8131C':''});
   const pt=ez.dec(P(t,vbeat(46.25),vbeat(46.25)+0.35));st($('sealTip'),{opacity:pt.toFixed(3),transform:`translateY(${((1-pt)*10).toFixed(1)}px)`});}
  // ---- cursor: to approve (k40), then to edit (k46)
  {const okC=centerIn($('bsOK')),edC=centerIn($('sealEdit'));
   const a=[1250/K,700/K],b=[okC[0],okC[1]],c=[edC[0],edC[1]];
   const m1=ez.prem(P(t,vbeat(38),vbeat(39.75))),m2=ez.prem(P(t,vbeat(45),vbeat(45.75)));
   let x=lerp(a[0],b[0],m1)+Math.sin(Math.PI*m1)*60, y=lerp(a[1],b[1],m1)+Math.sin(Math.PI*m1)*70;
   x=lerp(x,c[0],m2);y=lerp(y,c[1],m2);
   // visible for the approve click, hidden while the record seals, back for the edit attempt
   const vis=(t>=vbeat(38)&&t<vbeat(47.5))?(t<vbeat(44.5)?1-ez.inC(P(t,vbeat(40.6),vbeat(41))):ez.dec(P(t,vbeat(44.6),vbeat(45))))*(1-ez.inC(P(t,vbeat(47),vbeat(47.5)))):0;
   st($('cursor'),{left:(x*K-3).toFixed(1)+'px',top:(y*K-4).toFixed(1)+'px',opacity:vis.toFixed(3)});
   const clickAt=t<vbeat(44)?vbeat(40):vbeat(46),rp=P(t,clickAt,clickAt+0.5),tg=t<vbeat(44)?b:c;
   if(rp>0&&rp<1){const rr=(0.28+0.72*ez.outC(rp))*90;
     st($('rip'),{left:(tg[0]*K-rr).toFixed(1)+'px',top:(tg[1]*K-rr).toFixed(1)+'px',width:2*rr+'px',height:2*rr+'px',opacity:((1-rp)*0.9).toFixed(3),
       borderWidth:(2.5-rp*1.5).toFixed(2)+'px',borderColor:t<vbeat(44)?'rgba(11,132,71,0.8)':'rgba(168,19,28,0.8)'});show($('rip'),true);}
   else show($('rip'),false);}
}
function sceneWall(t){
  const inG=t>=vbeat(48)-0.05&&t<vbeat(56.2), inI=t>=IGN-0.1;
  showS($('wallWrap'),inG||inI); if(!(inG||inI))return;
  let op,t0;
  if(inG){op=ez.dec(P(t,vbeat(48),vbeat(49.5)))*(1-ez.inC(P(t,vbeat(54),vbeat(56))));t0=vbeat(48);}
  else {op=0.55*ez.dec(P(t,IGN,IGN+1.2))*(1-ez.inC(P(t,52.4,53.95)));t0=IGN-3;}
  st($('wallWrap'),{opacity:op.toFixed(3)});
  st($('wall'),{transform:`perspective(2600px) rotateX(46deg) rotateZ(-22deg) translateY(${(-(t-t0)*26).toFixed(1)}px) scale(${(1.07-0.07*ez.dec(P(t,t0,t0+1.4))).toFixed(4)})`});
}
function sceneH(t){
  const on=t>=vbeat(55.8)&&t<IGN+0.05; showS($('sH'),on); if(!on)return;
  const conv=ez.inC(P(t,vbeat(62),IGN));
  [0,1,2].forEach(i=>{const g=$('kw'+i),t0=vbeat(56+2*i);
    const svg=g.querySelector('.kwdIcon'),en=g.querySelector('.en'),ar=g.querySelector('.ar'),path=$('kw'+i+'p');
    const pI=ez.dec(P(t,t0,t0+0.5)),pE=ez.dec(P(t,t0,t0+0.55)),pA=ez.dec(P(t,t0+S8,t0+S8+0.5));
    const L=path.getTotalLength();path.style.strokeDasharray=L;path.style.strokeDashoffset=(L*(1-pI)).toFixed(2);
    st(svg,{opacity:pI.toFixed(3),transform:`translateY(${((1-pI)*14).toFixed(1)}px)`});
    st(en,{opacity:pE.toFixed(3),transform:`translateY(${((1-pE)*34).toFixed(1)}px)`,filter:pE<1?`blur(${(8*(1-pE)).toFixed(2)}px)`:'none'});
    st(ar,{opacity:pA.toFixed(3),transform:`translateY(${((1-pA)*20).toFixed(1)}px)`});
    const gx=parseFloat(g.style.left)+210, gy=480;                                 // converge into the logo's centre
    st(g,{transform:`translate(${((CX-gx)*conv).toFixed(1)}px,${((CY-gy)*conv).toFixed(1)}px) scale(${(1-0.8*conv).toFixed(4)})`,opacity:(1-ez.inC(P(t,IGN-0.2,IGN))).toFixed(3)});});
}
function sceneI(t){
  const on=t>=IGN-0.3; showS($('sI'),on);
  const o=$('orb');
  if(!on){o.style.opacity=0;$('burst').setAttribute('opacity',0);showS($('shock1'),false);showS($('shock2'),false);return;}
  // orb gathers the three words, then bursts on the hit
  const gather=ez.inC(P(t,vbeat(62),IGN)), after=t>=IGN?Math.exp(-(t-IGN)/0.35):0;
  const os=t<IGN?0.2+0.9*gather:1.1+2.2*after;
  st(o,{left:CX+'px',top:CY+'px',opacity:(t<IGN?gather*0.95:0.95*after).toFixed(3),transform:`scale(${os.toFixed(4)})`});
  $('burst').setAttribute('opacity',1);
  [['shock1',IGN,0.75,660,3.2,0.95],['shock2',IGN+0.12,0.8,430,2.2,0.6]].forEach(([id,t0,d,R,w,op])=>{
    const p=P(t,t0,t0+d),e=$(id);showS(e,p>0&&p<1);if(p<=0||p>=1)return;
    const r=70+R*ez.outC(p);st(e,{left:(CX-r)+'px',top:(CY-r)+'px',width:2*r+'px',height:2*r+'px',borderWidth:(w*(1-p)+0.6)+'px',opacity:op*(1-p)**1.3});});
  RB.forEach(b=>{const p=P(t,IGN,IGN+0.55*b.sp);if(p<=0||p>=1){b.el.setAttribute('opacity',0);return;}
    const e=ez.outC(p),r0=100+540*e*b.sp,L=(170*b.len)*(1-p)+8;
    b.el.setAttribute('x1',CX+Math.cos(b.a)*r0);b.el.setAttribute('y1',CY+Math.sin(b.a)*r0);
    b.el.setAttribute('x2',CX+Math.cos(b.a)*(r0+L));b.el.setAttribute('y2',CY+Math.sin(b.a)*(r0+L));
    b.el.setAttribute('stroke-width',(3.2*(1-p)+0.8).toFixed(2));b.el.setAttribute('opacity',(0.95*(1-p)**1.4).toFixed(3));});
  SPK.forEach(s=>{const p=P(t,IGN+0.02,IGN+0.02+s.life);if(p<=0||p>=1){s.el.setAttribute('opacity',0);return;}
    const d=95+s.v*ez.outC(p);s.el.setAttribute('cx',CX+Math.cos(s.a)*d);s.el.setAttribute('cy',CY+Math.sin(s.a)*d+30*p*p);
    s.el.setAttribute('r',(s.r*(1-0.5*p)).toFixed(2));s.el.setAttribute('opacity',(0.9*(1-p)**1.2).toFixed(3));});
  // the mark: overshoot scale-in on the hit, then holds
  let sc,op,bl=0;
  if(t<IGN-0.08){sc=0.35;op=0;}
  else if(t<IGN+0.14){const q=P(t,IGN-0.08,IGN+0.14);sc=0.35+0.85*ez.outC(q);op=Math.min(1,q*2.2);bl=5*(1-q);}
  else if(t<IGN+0.55){sc=1.20-0.20*ez.ioC(P(t,IGN+0.14,IGN+0.55));op=1;}
  else {sc=1.0;op=1;}
  const g=24+26*Math.exp(-Math.max(0,t-IGN)/0.28)*(t>=IGN?1:0);
  st($('endM'),{opacity:op.toFixed(3),transform:`scale(${sc.toFixed(4)})`,
    filter:`blur(${bl.toFixed(2)}px) drop-shadow(0 0 ${g.toFixed(1)}px rgba(188,89,209,0.72)) drop-shadow(0 0 ${(g*2.6).toFixed(1)}px rgba(142,50,195,0.45))`});
  const gp=P(t,vbeat(65.25),vbeat(66.25));
  st($('mGlint'),{transform:`scale(${sc.toFixed(4)})`,opacity:(gp>0&&gp<1?Math.sin(Math.PI*gp)*op:0).toFixed(3),backgroundPosition:`${(110-120*ez.ioC(gp)).toFixed(1)}% 0`});
  // wordmark, tagline, url on the bar lines; the CTA lands when the drums return
  const pW=ez.dec(P(t,vbeat(68),vbeat(68)+0.7));st($('endWord'),{opacity:(pW*0.92).toFixed(3),transform:`translateY(${((1-pW)*18).toFixed(1)}px)`});
  enter($('endTag'),t,vbeat(72),0.6);enter($('endTagAR'),t,vbeat(72.5),0.6,18);
  enter($('endURL'),t,vbeat(76),0.6,16);
  const pc=ez.emph(P(t,vbeat(80),vbeat(80)+0.5));st($('endCTA'),{opacity:pc.toFixed(3),transform:`scale(${(0.9+0.1*pc).toFixed(4)})`});
}
function captions(t){
  capSimple($('c1en'),t,vbeat(4),BURST0-0.3,BURST0);capSimple($('c1ar'),t,vbeat(4.5),BURST0-0.3,BURST0,18);
  capSimple($('c2en'),t,vbeat(8.5),vbeat(15),vbeat(15.75));capSimple($('c2ar'),t,vbeat(9),vbeat(15),vbeat(15.75),18);
  capParts($('c3en'),t,[vbeat(17),vbeat(22)],vbeat(23.4),vbeat(24));capParts($('c3ar'),t,[vbeat(17.5),vbeat(22.5)],vbeat(23.4),vbeat(24),18);
  capSimple($('c4en'),t,vbeat(24.5),vbeat(31.4),vbeat(32));capSimple($('c4ar'),t,vbeat(25),vbeat(31.4),vbeat(32),18);
  capParts($('c5en'),t,[vbeat(32.5),vbeat(34)],vbeat(39.4),vbeat(40));capParts($('c5ar'),t,[vbeat(33),vbeat(34.5)],vbeat(39.4),vbeat(40),18);
  capParts($('c6en'),t,[vbeat(42),vbeat(44)],vbeat(47.4),vbeat(48));capParts($('c6ar'),t,[vbeat(42.5),vbeat(44.5)],vbeat(47.4),vbeat(48),18);
  capSimple($('c7en'),t,vbeat(48.5),vbeat(54.75),vbeat(55.6));capSimple($('c7ar'),t,vbeat(49),vbeat(54.75),vbeat(55.6),18);
}
function flash(t){
  let f=0;
  {const q=t-vbeat(8);if(q>-0.03&&q<0.8)f=Math.max(f,0.22*(q<0?(q+0.03)/0.03:Math.exp(-q/0.2)));}     // the number shatters
  {const q=t-IGN;if(q>-0.035&&q<1.2)f=Math.max(f,0.5*(q<0?(q+0.035)/0.035:Math.exp(-q/0.26)));}        // logo ignition
  $('flash').style.opacity=f.toFixed(3);
}

/* ================= master ================= */
window.SEEK=function(t){
  t=clamp(t,0,window.DURATION);
  CAM=camState(t);
  uiwState(t);
  drawBG(t);
  sceneA(t);sceneB(t);sceneApp(t);sceneWall(t);sceneH(t);sceneI(t);
  captions(t);flash(t);
  camera(t);
  $('fade').style.opacity=ez.inC(P(t,52.4,53.95)).toFixed(3);
  drawFX(t);
  return true;
};
SEEK(0);
