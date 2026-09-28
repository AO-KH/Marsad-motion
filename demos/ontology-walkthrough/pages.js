/* The Knowledge Map (Data → الخريطة المعرفية), rebuilt from the real page's HTML (the client's snapshot, schema
   mode with مشروع selected) with site-kit pieces, at the site kit's scale (1 CSS px of the app = 1.5 page px).
   It keeps the snapshot's layout and UI text:
   - the breadcrumb, title and subtitle, and the two mode pills «استكشاف» and «مخطط الأنطولوجيا»;
   - Explore mode's empty state, as it sits hidden in the snapshot;
   - schema mode: the React Flow canvas with its three types, two link types and their labels, the summary chip, the
     zoom controls and the attribution;
   - the details panel of the selected type: outgoing and incoming links, and «تفاصيل النوع».
   Where it differs, and what the client should confirm:
   - The page opens in Explore mode; the video then switches to the schema.
   - The graph is drawn at 130% (the snapshot's canvas was zoomed out to 47%). It sits right of centre, clear of the
     details panel; the node positions and the link geometry are the snapshot's.
   - The details panel shows once a type is selected; the snapshot has مشروع selected. The links are drawn in the
     brand colour throughout, as in the snapshot.
   - The notification badge is hidden, as in the snapshot. The workspace name is the site kit's generic one.
   - The Material icons (travel_explore, schema, share, open_in_new, close) are drawn as close look-alikes.
   'dataSearch' is where the video starts: the site kit's search page with an empty field and no results, so no
   sample data from another workspace appears next to this ontology. */
(function(){
  const ic=SK.ic;
  const svg=(p,s,c,w=2)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const IC={
    explore:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="M3 10.5h15M10.5 3c2.2 2.3 3.2 4.8 3.2 7.5M10.5 3c-2.2 2.3-3.2 4.8-3.2 7.5s1 5.2 3.2 7.5"/><circle cx="17.2" cy="17.2" r="2.6"/><path d="m19.1 19.1 2.4 2.4"/>',
    schema:'<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/><rect x="14" y="9.5" width="7" height="5" rx="1"/><path d="M6.5 8v8M6.5 12H14"/>',
    open:'<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  };

  /* the start page: search, before anything is typed */
  M.definePage('dataSearch',{html:()=>SK.chrome('data')+SK.sidebar('data',4)+`<div class="sk-main side">
  <div class="abs" style="left:0;top:28px;display:flex;gap:12px;direction:ltr;"><span class="sk-btn ghost sm">${ic('search',20)}<span>الاستعلام المتقدم</span></span><span class="sk-btn soft sm">${ic('search',20)}<span>البحث</span></span></div>
  <div class="abs" style="right:0;top:84px;width:1000px;">${SK.header(['الرئيسية','البحث والاستعلام'],'البحث في كل البيانات','ابحث في كل الحقول من كل المصادر — Odoo، واتساب، الملفات')}</div>
  <div class="abs sk-input" style="left:0;right:0;top:300px;height:76px;color:#1A191E;">${ic('search',28,'#52505A')}<span class="ph"></span></div>
  <div class="abs" style="right:0;top:402px;display:flex;gap:12px;direction:rtl;"><span class="sk-btn soft sm">${ic('grid4',20)}<span>الكل</span></span><span class="sk-btn ghost sm">${ic('file',20)}<span>الملفات فقط</span></span></div></div>`});

  /* the ontology schema, from the snapshot: React Flow coordinates (node centres; CSS px at 100%) */
  const Z=1.3, OX=1036.9, OY=434;                 // zoom (page px per flow unit) and where flow (0,0) sits in the canvas
  const NODES=[   // id, label, count, dot colour, centre
    ['nProject','مشروع','٢','rgb(8, 145, 178)',47.225,-183.45],
    ['nSection','قسم','١','rgb(101, 163, 13)',214.3,116.55],
    ['nFile','ملف','١','rgb(234, 88, 12)',-132.71,116.55]];
  const EDGES=[[0,2,'المشروع يحتوي على ملف','eOut'],[1,0,'القسم لديه مشروع','eIn']];   // source, target, label, id
  const X=fx=>OX+fx*Z, Y=fy=>OY+fy*Z;
  const node=n=>`<div class="abs km-nw" id="${n[0]}W" style="left:${(X(n[4])-150).toFixed(1)}px;top:${(Y(n[5])-21.5).toFixed(1)}px;">
      <div class="km-node" id="${n[0]}"><i style="background:${n[3]};"></i><b>${n[1]}</b><small>${n[2]}</small><span class="km-sel"></span></div></div>`;
  const lines=EDGES.map(([a,b])=>`<line x1="${X(NODES[a][4]).toFixed(1)}" y1="${Y(NODES[a][5]).toFixed(1)}" x2="${X(NODES[b][4]).toFixed(1)}" y2="${Y(NODES[b][5]).toFixed(1)}"/>`).join('');
  const labels=EDGES.map(([a,b,t,id])=>{const cx=X((NODES[a][4]+NODES[b][4])/2),cy=Y((NODES[a][5]+NODES[b][5])/2);
    return `<div class="abs km-lw" style="left:${(cx-150).toFixed(1)}px;top:${(cy-13.5).toFixed(1)}px;"><span class="km-el" id="${id}">${t}</span></div>`;}).join('');
  const dots=`background-position:${((OX-15.6)%31.2).toFixed(1)}px ${((OY-15.6)%31.2).toFixed(1)}px;`;

  const row=(id,dot,t,s)=>`<div class="km-row" id="${id}"><i style="background:${dot};"></i><div><div class="t">${t}</div><div class="s">${s}</div></div></div>`;
  const panel=`<div class="abs km-panel" id="kmPanel">
    <div class="km-ph"><i style="background:rgb(8, 145, 178);"></i><div class="nm"><div class="t">مشروع</div><div class="s">project</div></div><span class="km-x">${ic('x',24,'#8A8797',2)}</span></div>
    <div class="km-pb">
      <div class="km-sec"><div class="h">روابط صادرة (١)</div>${row('rowOut','rgb(234, 88, 12)','المشروع يحتوي على ملف','ملف · واحد إلى متعدد')}</div>
      <div class="km-sec"><div class="h">روابط واردة (١)</div>${row('rowIn','rgb(101, 163, 13)','القسم لديه مشروع','قسم · واحد إلى متعدد')}</div>
      <div class="km-btn">${svg(IC.open,24,'#1A191E')}<span>تفاصيل النوع</span></div></div></div>`;

  const mode=(id,icon,label,on)=>`<span class="km-mode" id="${id}">${svg(IC[icon],24,'currentColor')}<span>${label}</span>
      <span class="km-on" id="${id}On" style="opacity:${on?1:0};">${svg(IC[icon],24,'currentColor')}<span>${label}</span></span></span>`;

  M.definePage('ontologyMap',{html:()=>SK.chrome('data')+SK.sidebar('data',2)+`<div class="sk-main side" id="kmMain">
  <div class="abs" id="kmHead" style="right:0;top:24px;width:1000px;">${SK.header(['البيانات','الخريطة المعرفية'],'الخريطة المعرفية',
    'كيف ترتبط كائناتك ببعضها: ابدأ من كائن ووسّع روابطه، أو اطّلع على مخطط الأنطولوجيا.')}</div>
  <div class="abs km-modes" id="kmModes" style="left:0;top:118px;">${mode('mExplore','explore','استكشاف',true)}${mode('mSchema','schema','مخطط الأنطولوجيا',false)}</div>

  <div class="abs km-canvas" id="exCanvas">
    <div class="km-empty">
      <div class="tile">${ic('share2',44,'#5909B4',2)}</div>
      <div class="t">ابدأ من كائن</div>
      <div class="d">اختر عميلًا أو فاتورة أو أي كائن، وسنعرض ما يرتبط به. اضغط مرتين على أي عقدة لتوسيعها.</div>
      <div class="in">${ic('search',33,'#8A8797',2)}<span>ابحث عن عميل، فاتورة، منتج…</span></div>
      <div class="h">أو افتح أي كائن واضغط «عرض في الخريطة المعرفية».</div></div></div>

  <div class="abs km-canvas km-rf" id="schCanvas" style="${dots}">
    <div class="abs" id="kmEdges" style="left:0;top:0;right:0;bottom:0;"><svg class="abs km-lines" width="1402" height="672">${lines}</svg>${labels}</div>
    ${NODES.map(node).join('')}
    <div class="abs km-info" id="kmInfo">٣ نوع مرتبط · ٢ نوع رابط · ٢ نوع بلا روابط<span>الرقم بجانب كل نوع هو عدد أنواع الروابط المتصلة به.</span></div>
    <div class="sk-zoom" id="kmZoom"><div>${ic('plus',20,'#52505A')}</div><div>${ic('minus',20,'#52505A')}</div><div>${ic('maximize',18,'#52505A')}</div></div>
    <div class="abs km-attr">React Flow</div>
    ${panel}</div>
 </div>`});
})();
