/* ===== MARSAD site kit — page templates (natural 1896x1060 space) ===== */
window.SK=(function(){
const I={
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
 chevDown:'<path d="m6 9 6 6 6-6"/>', chevLeft:'<path d="m15 18-6-6 6-6"/>', chevRight:'<path d="m9 18 6-6-6-6"/>',
 sparkles:'<path d="M10 3.5l1.6 4.4a2 2 0 0 0 1.2 1.2l4.4 1.6-4.4 1.6a2 2 0 0 0-1.2 1.2L10 17.9l-1.6-4.4a2 2 0 0 0-1.2-1.2L2.8 10.7l4.4-1.6a2 2 0 0 0 1.2-1.2z"/><path d="M19 3v4M17 5h4M19 16v4M17 18h4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', plusCircle:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
 toggle:'<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="7.5" cy="12" r="2.6" fill="currentColor"/>',
 shapes:'<path d="M8.3 10a.7.7 0 0 1-.6-1.1l3.7-6a.7.7 0 0 1 1.2 0l3.7 6a.7.7 0 0 1-.6 1.1z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
 database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0 0 16 0V5"/><path d="M4 12a8 3 0 0 0 16 0"/>',
 share2:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
 link:'<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><path d="M8 12h8"/>',
 tag:'<path d="M4 6a2 2 0 0 1 2-2h9l5 8-5 8H6a2 2 0 0 1-2-2z"/>',
 fileUp:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6M9 15l3-3 3 3"/>',
 refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
 merge:'<circle cx="5" cy="6" r="2.6"/><circle cx="19" cy="18" r="2.6"/><path d="M12 6h5a2 2 0 0 1 2 2v7.4"/><path d="M12 18H7a2 2 0 0 1-2-2V8.6"/><path d="m15 3-3 3 3 3M9 15l3 3-3 3"/>',
 gavel:'<path d="m14 13-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10"/><path d="m16 16 6-6M8 8l6-6M9 7l8 8M21 11l-8-8"/>',
 barChart:'<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V9M18 17V6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
 layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
 listX:'<path d="M11 12H3M16 6H3M16 18H3"/><path d="m19 10-4 4M15 10l4 4"/>',
 bot:'<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
 msgSquare:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
 msgs:'<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 hub:'<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M4.2 7.5l5.2 3M14.6 13.5l5.2 3M4.2 16.5l5.2-3M14.6 10.5l5.2-3"/>',
 receipt:'<path d="M5 2v20l2.3-1.5L9.7 22l2.3-1.5 2.3 1.5 2.4-1.5L19 22V2l-2.3 1.5L14.3 2 12 3.5 9.7 2 7.3 3.5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
 listAlert:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h6M7 13h10M7 17h4"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
 folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
 grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
 grid4:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 history:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
 upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
 pulse:'<path d="m3 17 5-5 4 4 7-7"/><path d="M19 3v4M17 5h4"/>',
 sliders:'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
 trendUp:'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
 swap:'<path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
 send:'<path d="M20 4 4 12l16 8-4-8z"/>',
 check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
 clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.6v4.7l3.1 1.9"/>',
 ccheck:'<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3l2.5 2.5 5-5.3"/>',
 cx:'<circle cx="12" cy="12" r="8.6"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
 bang:'<path d="M12 4.6v9.6"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/>',
 maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
 minus:'<path d="M5 12h14"/>', folderOpen:'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.2 10H20a2 2 0 0 1 1.9 2.5l-1.5 6A2 2 0 0 1 18.4 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.7.9l.8 1.2a2 2 0 0 0 1.7.9H18a2 2 0 0 1 2 2v2"/>',
};
function ic(n,s=24,c='currentColor',w=2){return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;}
/* gradient glyph tile used by empty states and the assistant avatar */
function gIcon(n,s=76,r=22){return `<div class="sk-gicon" style="width:${s}px;height:${s}px;border-radius:${r}px;background:linear-gradient(140deg,#5F0DB4,#BC59D1);color:#fff;">${ic(n,Math.round(s*0.5),'#fff',2)}</div>`;}

const TABS=[['home','الرئيسية',1797.5,83],['pulse','نبض الأعمال',1655.5,125],['data','البيانات',1519,76],
 ['dec','القرارات',1402.5,79],['ai','المساعد الذكي',1256,136],['proj','المشاريع',1105,82],['admin','الإدارة',991,56]];
function chrome(active){
  const tabs=TABS.map(([k,l,cx,w])=>`<div class="sk-tab${k===active?' on':''}" data-k="${k}" style="left:${cx-w/2}px;width:${w}px">${l}</div>`).join('');
  const t=TABS.find(x=>x[0]===active);
  const ul=t?`<div class="sk-ul" id="skUL" style="left:${t[2]-t[3]/2}px;width:${t[3]}px"></div>`:'';
  return `<div class="sk-top">
   <div class="sk-avatar">م</div><div class="sk-bell">${ic('bell',26)}</div><div class="sk-badge">3</div>
   <div class="sk-search">${ic('search',24,'#52505A')}<span class="ph">ابحث في البيانات...</span><span class="sp"></span><span class="sk-kbd">Ctrl K</span></div>
   <div class="sk-ws"><span>مساحة العرض</span>${ic('chevDown',20,'#52505A')}</div><div class="sk-slash">/</div>
   <div class="sk-logo"><img src="assets_logo_m.png"><span>مرصد</span></div></div>
  <div class="sk-tabs">${tabs}${ul}</div>`;
}
const SIDE={
 data:['البيانات',[['shapes','أنواع الكائنات'],['database','الكائنات'],['share2','الخريطة المعرفية'],['link','الروابط'],['search','البحث والاستعلام'],['tag','تصنيف البيانات'],['fileUp','استيراد البيانات'],['refresh','مزامنة Odoo'],['merge','قواعد الربط التلقائي']]],
 dec:['القرارات',[['gavel','القرارات'],['barChart','الرؤية التنفيذية'],['target','قواعد المراقبة'],['layout','لوحة المعلومات التنفيذية'],['listX','التعريفات المعتمدة']]],
 ai:['المساعد الذكي',[['bot','المساعد الذكي'],['msgSquare','الاتصالات']]],
 admin:['الإدارة',[['building','المؤسسات ومساحات العمل'],['users','المستخدمون والصلاحيات'],['hub','التكاملات'],['receipt','الفوترة والاشتراك'],['clipboard','سجل التدقيق'],['listAlert','سجل الأحداث والأخطاء'],['settings','الإعدادات']]],
};
function sidebar(sec,on,id){const [h,items]=SIDE[sec];
  return `<div class="sk-side"${id?` id="${id}"`:''}><div class="sk-side-h">${h}</div><div class="sk-nav">${
    items.map((it,i)=>`<div class="sk-item${i===on?' on':''}">${ic(it[0],24)}<span>${it[1]}</span></div>`).join('')}</div></div>`;}
function header(crumbs,title,sub){
  const cr=crumbs.map((c,i)=>i<crumbs.length-1?`<span>${c}</span>${ic('chevLeft',18,'#8A8797')}`:`<b>${c}</b>`).join('');
  return `<div class="sk-crumb">${cr}</div><div class="sk-h1">${title}</div>${sub?`<div class="sk-sub">${sub}</div>`:''}`;}
const pill=(cls,t)=>`<span class="sk-pill ${cls}">${t}</span>`;

/* ---------------- pages ---------------- */
function home(){return chrome('home')+`
 <div class="abs" style="left:0;right:0;top:238px;display:flex;justify-content:center;align-items:center;gap:92px;direction:rtl;">
   <img src="assets_logo_wordmark_white.png" style="width:204px;filter:brightness(0);opacity:.9;">
   <div style="font:700 82px/1.2 'PlexAR';color:#1A191C;white-space:nowrap;">يرحب بك، مستخدم</div></div>
 <div class="abs sk-card" style="left:88px;width:1720px;top:410px;height:700px;">
   <svg class="abs" style="left:814px;top:156px;" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="hg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#5F0DB4"/><stop offset="1" stop-color="#BC59D1"/></linearGradient></defs>
     <g fill="url(#hg)"><rect x="4" y="62" width="9" height="30" rx="1.5"/><rect x="24" y="52" width="9" height="40" rx="1.5"/><rect x="44" y="58" width="9" height="34" rx="1.5"/><rect x="64" y="44" width="9" height="48" rx="1.5"/><rect x="84" y="30" width="9" height="62" rx="1.5"/></g>
     <path d="M4 46 L28 24 L46 40 L84 6" fill="none" stroke="url(#hg)" stroke-width="8" stroke-linejoin="miter"/><path d="M70 4 L90 4 L90 24" fill="none" stroke="url(#hg)" stroke-width="8"/></svg>
   <div class="abs sk-input" style="left:359px;top:363px;width:1007px;height:84px;">${ic('search',30,'#52505A')}<span>بحث عن البيانات أو الإجراءات...</span></div>
   <div class="abs" style="left:0;right:0;top:508px;display:flex;justify-content:center;gap:25px;direction:rtl;">
     <span class="sk-btn ghost" style="border-radius:18px;padding:0 34px;">${ic('pulse',26)}<span>نبض الأعمال</span></span>
     <span class="sk-btn ghost" style="border-radius:18px;padding:0 34px;">${ic('plusCircle',26)}<span>كائن جديد</span></span>
     <span class="sk-btn ghost" style="border-radius:18px;padding:0 34px;">${ic('upload',26)}<span>استيراد البيانات</span></span>
     <span class="sk-btn ghost" style="border-radius:18px;padding:0 34px;">${ic('history',26)}<span>النشاط الأخير</span></span></div>
 </div>`;}

const RECS=[
 ['أداء المنتجات — أعلى وأضعف المبيعات','أعلى وأضعف المنتجات','قبل 10 ساعة'],
 ['مقارنة أداء الفروع','مقارنة الفروع','قبل 10 ساعة'],
 ['منتجات بطيئة الحركة — فرص تحريك المخزون','المنتجات بطيئة الحركة','قبل 10 ساعة']];
function recRow(r,top){return `<div class="abs sk-card sk-rec" style="left:0;right:0;top:${top}px;height:118px;">
   <div class="abs" style="right:32px;top:18px;font:700 24px 'PlexAR';color:#1A191E;white-space:nowrap;">${r[0]}</div>
   <div class="abs" style="right:32px;top:66px;display:flex;gap:10px;direction:rtl;">${pill('cat',r[1])}${pill('ok',ic('check',15,'#0B8447',2.6)+'مبني على بياناتك')}${pill('new','جديد')}</div>
   <div class="abs" style="left:30px;top:42px;display:flex;align-items:center;gap:16px;direction:rtl;"><span class="sk-meta">${r[2]}</span>${ic('chevDown',22,'#6C6A74')}</div></div>`;}
function pulseContent(o={}){return `<div class="sk-main wide" id="${o.id||'pgPulse'}">
  <div class="abs" id="pulseHead" style="right:0;top:40px;width:1000px;">${header(['الرئيسية','نبض الأعمال'],'نبض الأعمال',
    'توصيات تشغيلية مبنية على أرقام بياناتك — تُحسب المؤشرات أولاً ثم يصيغها الذكاء الاصطناعي دون اختلاق. اقتراحات لإثارة التفكير، لا نصيحة مالية.')}</div>
  <div class="abs sk-btn pri" id="genBtn" style="left:0;top:156px;">${ic('sparkles',30,'#fff',1.8)}<span>توليد توصيات</span></div>
  <div class="abs sk-card" id="advCard" style="left:1px;right:0;top:265px;height:177px;">
    <div class="abs ct" style="right:30px;top:30px;">المستشار اليومي</div>
    <div class="abs cd" style="right:30px;top:76px;white-space:nowrap;">يبحث في سوق قطاعك يوميًا ويدمجه مع بياناتك، ويقدّم توصيات موثّقة (بمصدر السوق وبياناتك) تصل إلى صفحة «القرارات».</div>
    <div class="abs sk-meta" style="right:30px;top:122px;">مفتاح بحث السوق:&nbsp;&nbsp;غير مُهيّأ — توصيات بياناتك فقط&nbsp;&nbsp;&nbsp;&nbsp;<span class="sk-link">إدارة في التكاملات</span></div>
    <div class="abs sk-toggle" style="left:30px;top:30px;">${ic('toggle',30,'#535257',1.8)}<span>مُعطّل</span></div></div>
  <div class="abs" id="recRows" style="left:1px;right:0;top:470px;height:420px;">${RECS.map((r,i)=>recRow(r,i*136)).join('')}</div>
 </div>`;}

const STATS=[['حرجة','0','#A8131C','bang'],['مرفوضة','1','#A8131A','cx'],['موافق عليها','0','#0B8447','ccheck'],['قيد المراجعة','6','#AA3C07','clock']];
function decContent(o={}){
  const stats=STATS.map((s,i)=>`<div class="sk-stat" style="left:${i*357}px;top:0;"><div class="n" style="color:${s[2]};">${s[1]}</div>${ic(s[3],32,s[2],2)}<div class="l">${s[0]}</div></div>`).join('');
  return `<div class="sk-main side" id="${o.id||'pgDec'}">
  <div class="abs" id="decHead" style="right:0;top:40px;width:900px;">${header(['الرئيسية','القرارات'],'القرارات','توصيات مدعومة بالذكاء الاصطناعي مبنية على بيانات مساحة العمل.')}</div>
  <div class="abs" id="decBtns" style="left:0;top:130px;display:flex;gap:14px;direction:ltr;">
    <span class="sk-btn ghost">${ic('sliders',24)}<span>قواعد المراقبة</span></span><span class="sk-btn soft">${ic('trendUp',24)}<span>الرؤية التنفيذية</span></span></div>
  <div class="abs" id="stats" style="left:0;right:0;top:235px;height:138px;">${stats}</div>
  <div class="abs sk-seg" id="segTabs" style="right:0;top:411px;"><span class="on">الكل</span><span>قيد المراجعة (6)</span><span>موافق عليها (0)</span><span>مرفوضة (1)</span></div>
  <div class="abs" id="veil" style="left:-58px;right:-436px;top:-170px;height:1060px;background:rgba(24,18,48,0.20);opacity:0;z-index:2;"></div>
  <div class="abs sk-card" id="decCard" style="left:0;right:0;top:517px;height:214px;z-index:3;">
    <div class="abs" style="right:36px;top:30px;font:700 28px 'PlexAR';color:#1A191E;white-space:nowrap;">انخفاض مخزون فرع الرياض — يُنصح بإعادة التوريد اليوم</div>
    <div class="abs" style="right:36px;top:86px;display:flex;gap:10px;direction:rtl;align-items:center;">${pill('hi','مرتفع')}${pill('ok','ثقة 80%')}${pill('cat','مستند · upload')}<span class="sk-meta" style="margin-right:8px;">قبل 10 دقائق</span></div>
    <div class="abs" style="right:36px;top:138px;display:flex;gap:14px;direction:rtl;">
      <span class="sk-btn" id="btnOK" style="height:56px;padding:0 30px;border-radius:16px;background:#E7F5EE;border:1.5px solid #A6DCBF;color:#0B8447;font:700 21px 'PlexAR';">${ic('check',22,'#0B8447',2.6)}<span>موافقة</span></span>
      <span class="sk-btn" style="height:56px;padding:0 30px;border-radius:16px;background:#fff;border:1.5px solid #EBC5C7;color:#A8131C;font:600 21px 'PlexAR';">${ic('x',20,'#A8131C',2.6)}<span>رفض</span></span></div>
    <div class="abs" style="left:34px;top:36px;display:flex;gap:10px;direction:ltr;">${pill('src','المخزون · Odoo')}</div></div>
  <div class="abs sk-card" id="toast" style="left:0;right:0;top:517px;height:214px;z-index:3;background:linear-gradient(160deg,#F1FAF5,#E2F4E9);border-color:#A6DCBF;
     display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
    <div style="display:flex;align-items:center;gap:14px;direction:rtl;font:700 36px 'PlexAR';color:#0B8447;">${ic('ccheck',40,'#0B8447',2.2)}<span>تم تنفيذ الإجراء</span></div>
    <div style="font:500 15px 'JBMono';letter-spacing:.22em;color:#3E9A6C;">ACTION EXECUTED · طلب توريد #PO-2291</div></div>
  <div class="abs sk-card" id="dec2" style="left:0;right:0;top:753px;height:160px;">
    <div class="abs" style="right:36px;top:30px;font:700 26px 'PlexAR';color:#1A191E;white-space:nowrap;">ارتفاع مرتجعات فرع جدة — مراجعة سياسة الإرجاع</div>
    <div class="abs" style="right:36px;top:84px;display:flex;gap:10px;direction:rtl;align-items:center;">${pill('cat','متوسط')}${pill('ok','ثقة 72%')}<span class="sk-meta" style="margin-right:8px;">قبل ساعة</span></div></div>
 </div>`;}

const OT=[['عميل','Customer','customer'],['فاتورة','Invoice','invoice'],['بند فاتورة','Invoice line','invoice_line'],['منتج','Product','product'],['موظف','Employee','employee'],['مدينة','City','city']];
function objectTypes(){
  const row=(r)=>`<div class="sk-tr"><span class="nm" style="right:36px;">${r[0]}<small>(${r[1]})</small></span><span class="api" style="right:412px;">${r[2]}</span>
   <span class="sk-stp" style="left:678px;"><i></i></span><span class="num" style="left:518px;">0</span><span class="num" style="left:322px;">v1</span><span class="num" style="left:140px;">-</span></div>`;
  return chrome('data')+sidebar('data',0)+`<div class="sk-main side">
  <div class="abs" style="right:0;top:18px;width:900px;">${header(['الرئيسية','البيانات','أنواع الكائنات'],'أنواع الكائنات','إدارة أنواع الكائنات في الأنطولوجيا')}</div>
  <div class="abs sk-btn pri" style="left:0;top:92px;">${ic('plus',26,'#fff',2.4)}<span>إنشاء نوع كائن</span></div>
  <div class="abs sk-seg" style="right:0;top:212px;"><span class="on">الكل</span><span>نشط</span><span>مسودة</span><span>متوقف</span></div>
  <div class="abs sk-table" style="left:0;right:0;top:318px;height:620px;">
   <div class="sk-tr h"><span style="right:36px;">الاسم</span><span style="right:412px;">الاسم البرمجي</span><span style="left:678px;">الحالة</span><span style="left:505px;">الخصائص</span><span style="left:310px;">الإصدار</span><span style="left:102px;">تاريخ الإنشاء</span></div>
   ${OT.map(row).join('')}</div></div>`;}

/* knowledge graph (site layout, canvas-relative coords) */
const KG_N=[['عميل','#DB4E11','٤',712,70],['فاتورة','#17A186','٢',887,154],['منتج','#149BB0','١',537,154],['بند فاتورة','#CC0C74','٢',939,341],
            ['ملاحظة','#D0730C','١',503,341],['موظف','#CE730B','١',621,491],['مدينة','#16A286','١',808,491]];
const KG_E=[[0,1,'صادرة إلى'],[1,3,'تحتوي بند'],[2,3,'المنتج'],[0,4,'يذكر'],[0,5,'مدير الحساب'],[0,6,'يقع في']];
function kgGraph(){
  const lines=KG_E.map(([a,b])=>`<line x1="${KG_N[a][3]}" y1="${KG_N[a][4]}" x2="${KG_N[b][3]}" y2="${KG_N[b][4]}" stroke="#B7B4C4" stroke-width="1.4"/>`).join('');
  const lbl=KG_E.map(([a,b,t])=>`<span class="sk-el" style="left:${(KG_N[a][3]+KG_N[b][3])/2}px;top:${(KG_N[a][4]+KG_N[b][4])/2}px;">${t}</span>`).join('');
  const nodes=KG_N.map(n=>`<div class="sk-gn" style="left:${n[3]}px;top:${n[4]}px;"><i style="background:${n[1]};"></i><span>${n[0]}</span><small>${n[2]}</small></div>`).join('');
  return `<svg class="abs" style="left:0;top:0;" width="1400" height="700">${lines}</svg>${lbl}${nodes}`;}
function knowledgeMap(){return chrome('data')+sidebar('data',2)+`<div class="sk-main side">
  <div class="abs" style="right:0;top:40px;width:1000px;">${header(['البيانات','الخريطة المعرفية'],'الخريطة المعرفية','كيف ترتبط كائناتك بعضها ببعض: ابدأ من كائن وتتبّع روابطه، أو اطّلع على مخطط الأنطولوجيا.')}</div>
  <div class="abs" style="left:0;top:136px;display:flex;gap:14px;direction:ltr;"><span class="sk-btn ghost sm">${ic('merge',22)}<span>مخطط الأنطولوجيا</span></span><span class="sk-btn soft sm">${ic('search',22)}<span>استكشاف</span></span></div>
  <div class="abs sk-canvas" style="left:0;right:0;top:232px;height:640px;">${kgGraph()}
    <div class="sk-info">٧ نوع مرتبط · ٦ نوع رابط<br>الرقم بجانب كل نوع هو عدد أنواع الروابط المتصلة به.</div>
    <div class="sk-zoom"><div>${ic('plus',20,'#1A191E')}</div><div>${ic('minus',20,'#1A191E')}</div><div>${ic('maximize',18,'#1A191E')}</div></div>
    <div class="abs" style="right:10px;bottom:6px;font:400 13px 'Inter';color:#8A8797;">React Flow</div></div></div>`;}

const LK=[['billed_to','Billed to','Customer','Invoice','many_to_one'],['has_line','Has line','Invoice line','Invoice','واحد إلى متعدد'],
 ['line_product','Line product','Product','Invoice line','many_to_one'],['account_manager','Account manager','Employee','Customer','many_to_one'],
 ['located_in','Located in','City','Customer','many_to_one'],['mentions','Mentions','Customer','Note','متعدد إلى متعدد']];
function links(){
  const row=r=>`<div class="sk-tr"><span class="api" style="right:40px;">${r[0]}</span><span class="en" style="right:300px;">${r[1]}</span>
   <span class="dir" style="left:560px;">${r[2]} ${ic('swap',18,'#52505A')} ${r[3]}</span><span class="sk-pill mono" style="left:60px;">${r[4]}</span></div>`;
  return chrome('data')+sidebar('data',3)+`<div class="sk-main side">
  <div class="abs" style="right:0;top:40px;width:900px;">${header(['الرئيسية','الروابط'],'الروابط','إدارة أنواع الروابط وإنشاء روابط بين الكائنات.')}</div>
  <div class="abs sk-btn pri" style="left:0;top:112px;">${ic('plus',26,'#fff',2.4)}<span>إنشاء نوع رابط</span></div>
  <div class="abs" style="right:0;top:252px;font:700 30px 'PlexAR';color:#1A191E;">أنواع الروابط</div>
  <div class="abs sk-table" style="left:0;right:0;top:318px;height:560px;">
   <div class="sk-tr h"><span style="right:40px;">الاسم البرمجي</span><span style="right:300px;">الاسم</span><span style="left:700px;">الاتجاه</span><span style="left:92px;">العلاقة</span></div>
   ${LK.map(row).join('')}</div></div>`;}

function search(){
  const res=[['فاتورة','INV-10482 — مؤسسة الريان التجارية','١٢٬٤٥٠ ر.س','Odoo'],['فاتورة','INV-10477 — متاجر الواحة','٨٬٩٢٠ ر.س','Odoo'],
    ['بند فاتورة','INV-10482 · بند ٣ — زيت زيتون ٥ لتر','٦٤٠ ر.س','Odoo'],['ملاحظة','«الفاتورة تأخرت أسبوعًا» — عميل: متاجر الواحة','','واتساب']];
  const r=(x,i)=>`<div class="abs" style="left:0;right:0;top:${i*92}px;height:92px;border-top:${i?1.5:0}px solid #E5E4E9;">
    <div class="abs" style="right:30px;top:28px;display:flex;align-items:center;gap:14px;direction:rtl;">${pill('cat',x[0])}<span style="font:600 21px 'PlexAR';color:#1A191E;white-space:nowrap;">${x[1]}</span></div>
    <div class="abs" style="left:30px;top:28px;display:flex;align-items:center;gap:16px;direction:rtl;"><span style="font:600 20px 'PlexAR';color:#1A191E;">${x[2]}</span>${pill('src',x[3])}</div></div>`;
  return chrome('data')+sidebar('data',4)+`<div class="sk-main side">
  <div class="abs" style="left:0;top:28px;display:flex;gap:12px;direction:ltr;"><span class="sk-btn ghost sm">${ic('search',20)}<span>الاستعلام المتقدم</span></span><span class="sk-btn soft sm">${ic('search',20)}<span>البحث</span></span></div>
  <div class="abs" style="right:0;top:84px;width:1000px;">${header(['الرئيسية','البحث والاستعلام'],'البحث في كل البيانات','ابحث في كل الحقول من كل المصادر — Odoo، واتساب، الملفات')}</div>
  <div class="abs sk-input focus" style="left:0;right:0;top:300px;height:76px;color:#1A191E;">${ic('search',28,'#52505A')}<span>فاتورة</span></div>
  <div class="abs" style="right:0;top:402px;display:flex;gap:12px;direction:rtl;"><span class="sk-btn soft sm">${ic('grid4',20)}<span>الكل</span></span><span class="sk-btn ghost sm">${ic('file',20)}<span>الملفات فقط</span></span></div>
  <div class="abs sk-card" style="left:0;right:0;top:486px;height:372px;overflow:hidden;">${res.map(r).join('')}</div></div>`;}

function decisions(){return chrome('dec')+sidebar('dec',0)+decContent({id:'pgDecS'}).replace('id="toast" style="','id="toast" style="display:none;');}
function pulse(){return chrome('pulse')+pulseContent({id:'pgPulseS'});}

function assistant(){return chrome('ai')+sidebar('ai',0)+`<div class="sk-main side">
  <div class="abs" style="right:0;top:40px;width:900px;">${header(['الرئيسية','المساعد الذكي'],'مساعد مرصد الذكي','')}</div>
  <div class="abs" style="left:0;top:96px;display:flex;align-items:center;gap:20px;direction:ltr;">
    <span class="sk-btn ghost sm" style="gap:40px;">${ic('chevDown',20)}<span>كل مساحة العمل</span></span>${ic('folderOpen',28,'#5909B4')}</div>
  <div class="abs sk-card" style="left:0;width:955px;top:181px;height:700px;">
    <div class="abs" style="left:0;right:0;top:66px;display:flex;justify-content:center;">${gIcon('bot',92,24)}</div>
    <div class="abs" style="left:0;right:0;top:200px;text-align:center;font:700 38px 'PlexAR';color:#1A191E;">مساعد مرصد الذكي</div>
    <div class="abs" style="left:0;right:0;top:262px;text-align:center;font:400 20px 'PlexAR';color:#52505A;">اسأل عن بيانات مساحة العمل، أو اطلب ملخّصات، أو استكشف الروابط بين الكائنات.</div>
    <div class="abs" style="left:68px;right:68px;top:340px;display:flex;gap:22px;direction:rtl;">
      <div class="sk-card" style="flex:1;height:96px;background:#F8F7FC;display:flex;align-items:center;gap:16px;padding:0 26px;direction:rtl;">
        <div class="sk-gicon" style="width:52px;height:52px;border-radius:16px;">${ic('shapes',26,'#6A12B8')}</div><span style="font:500 21px 'PlexAR';color:#1A191E;white-space:nowrap;">استكشاف أنواع الكائنات المتوفّرة</span></div>
      <div class="sk-card" style="flex:1;height:96px;background:#F8F7FC;display:flex;align-items:center;gap:16px;padding:0 26px;direction:rtl;">
        <div class="sk-gicon" style="width:52px;height:52px;border-radius:16px;">${ic('history',26,'#6A12B8')}</div><span style="font:500 21px 'PlexAR';color:#1A191E;white-space:nowrap;">تلخيص الكائنات الحديثة</span></div></div>
    <div class="abs" style="left:0;right:0;top:588px;border-top:1.5px solid #E5E4E9;height:112px;">
      <div class="abs sk-input" style="right:36px;left:128px;top:22px;height:70px;font-size:21px;">اسأل مرصد عن أي شيء بخصوص بياناتك...</div>
      <div class="abs" style="left:36px;top:22px;width:72px;height:70px;border-radius:18px;background:#C9A8E6;display:flex;align-items:center;justify-content:center;">${ic('send',28,'#fff',2)}</div></div></div>
  <div class="abs sk-card" style="left:981px;right:0;top:181px;height:700px;">
    <div class="abs sk-btn pri" style="left:24px;right:24px;top:24px;height:62px;font-size:22px;">${ic('plus',24,'#fff',2.4)}<span>محادثة جديدة</span></div>
    <div class="abs" style="left:0;right:0;top:110px;border-top:1.5px solid #E5E4E9;"></div>
    <div class="abs sk-empty" style="left:0;right:0;top:150px;">${ic('msgs',48,'#52505A',1.8)}<div class="d" style="font-size:19px;">لا توجد محادثات بعد</div></div></div></div>`;}

function projects(){
  const col=(l,w,ic_,t,n,body)=>`<div class="abs sk-card" style="left:${l}px;width:${w}px;top:196px;height:680px;">
    <div class="abs" style="right:28px;top:30px;display:flex;align-items:center;gap:12px;direction:rtl;">${ic(ic_,28,'#5909B4')}<span style="font:700 25px 'PlexAR';color:#1A191E;">${t}</span><span style="font:400 17px 'Inter';color:#8A8797;">(${n})</span></div>${body}</div>`;
  return chrome('proj')+`<div class="sk-main full">
  <div class="abs" style="right:0;top:40px;width:1100px;">${header(['الرئيسية','المشاريع'],'المشاريع','نظّم بياناتك المستوردة في أقسام ومشاريع. كل ملف يُرفع تلقائيًا يظهر هنا.')}</div>
  ${col(1218,569,'grid','الأقسام',2,`<span class="abs sk-btn soft sm" style="left:24px;top:24px;height:44px;padding:0 16px;font-size:17px;">${ic('plus',18)}<span>جديد</span></span>
     <div class="abs" style="left:24px;right:24px;top:100px;height:84px;border-radius:16px;background:#F1E9FA;box-shadow:inset -3.5px 0 0 #6A12B8;"><div class="abs" style="right:22px;top:14px;font:600 21px 'PlexAR';color:#5909B4;">المبيعات والفواتير</div><div class="abs" style="right:22px;top:48px;font:400 15px 'PlexAR';color:#6C6A74;">٣ مشاريع</div></div>
     <div class="abs" style="left:24px;right:24px;top:198px;height:84px;border-radius:16px;background:#F8F7FC;"><div class="abs" style="right:22px;top:14px;font:600 21px 'PlexAR';color:#1A191E;">المخزون</div><div class="abs" style="right:22px;top:48px;font:400 15px 'PlexAR';color:#6C6A74;">مشروعان</div></div>`)}
  ${col(616,578,'folder','المشاريع',3,['فواتير الربع الثالث','مرتجعات الفروع','عقود الموردين'].map((p,i)=>`<div class="abs" style="left:24px;right:24px;top:${100+i*96}px;height:82px;border-radius:16px;border:1.5px solid #E5E4E9;"><div class="abs" style="right:22px;top:14px;font:600 21px 'PlexAR';color:#1A191E;">${p}</div><div class="abs" style="right:22px;top:46px;font:400 15px 'PlexAR';color:#6C6A74;">${['١٢ ملفًا','٥ ملفات','٨ ملفات'][i]}</div></div>`).join(''))}
  ${col(0,592,'file','الملفات',12,['invoices_q3.xlsx','branch_returns.csv','po_2291.pdf','suppliers_2025.xlsx'].map((f,i)=>`<div class="abs" style="left:24px;right:24px;top:${100+i*70}px;height:58px;border-bottom:1.5px solid #EEEDF2;display:flex;align-items:center;gap:14px;direction:rtl;">${ic('file',22,'#6C6A74')}<span style="font:500 18px 'JBMono';color:#1A191E;direction:ltr;">${f}</span></div>`).join(''))}
 </div>`;}

function admin(){
  const org=(n,d,i)=>`<div class="abs" style="left:0;right:0;top:${i*104}px;height:104px;border-top:${i?1.5:0}px solid #E5E4E9;">
    <div class="abs" style="right:30px;top:24px;display:flex;align-items:center;gap:16px;direction:rtl;"><div class="sk-gicon" style="width:56px;height:56px;border-radius:16px;">${ic('building',26,'#6A12B8')}</div>
      <div><div style="font:700 22px 'PlexAR';color:#1A191E;white-space:nowrap;">${n}</div><div style="font:400 16px 'PlexAR';color:#6C6A74;white-space:nowrap;">${d}</div></div></div>
    <div class="abs" style="left:30px;top:34px;">${pill(i?'src':'cat',i?'عضو':'مالك')}</div></div>`;
  return chrome('admin')+sidebar('admin',0)+`<div class="sk-main side">
  <div class="abs" style="right:0;top:28px;display:flex;gap:12px;direction:rtl;"><span class="sk-btn soft sm">${ic('building',20)}<span>المؤسسات</span></span><span class="sk-btn ghost sm">${ic('grid4',20)}<span>مساحات العمل</span></span></div>
  <div class="abs" style="right:0;top:100px;width:900px;">${header(['الإدارة','المؤسسات'],'المؤسسات','إدارة مؤسساتك وفرق العمل')}</div>
  <div class="abs sk-input" style="right:0;width:670px;top:318px;height:64px;font-size:19px;">${ic('search',22,'#6C6A72')}<span>ابحث في المؤسسات...</span></div>
  <div class="abs sk-card" style="left:0;right:0;top:414px;height:314px;overflow:hidden;">${[['نصل للتقنية','٣ مساحات عمل · ١٢ مستخدمًا'],['مترو مارت للتجزئة','مساحتا عمل · ٨ مستخدمين'],['مجموعة الواحة التجارية','مساحة عمل واحدة · ٥ مستخدمين']].map((o,i)=>org(o[0],o[1],i)).join('')}</div></div>`;}

const PAGES={home,pulse,objectTypes,knowledgeMap,links,search,decisions,assistant,projects,admin};
return {ic,gIcon,chrome,sidebar,header,pill,pulseContent,decContent,kgGraph,KG_N,KG_E,TABS,PAGES,RECS,STATS};
})();
