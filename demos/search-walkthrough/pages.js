/* The site kit's search page (SK.PAGES.search: Data → البحث والاستعلام), rebuilt from site-kit pieces for this
   walkthrough. Same layout, same UI text, same sample rows, except:
   - the search field starts empty, so app.type can type the query (the site kit shows «فاتورة» already typed);
   - the results card and each row have ids, so they can appear after the query and be pointed at;
   - the page's own subtitle names three sources (Odoo، واتساب، الملفات) but its rows show only Odoo and WhatsApp.
     A result from the files source (invoices_q3.xlsx, a file from the site kit's projects page) replaces the
     third row (an Odoo invoice line), because a fifth row would run past the bottom of the page.
     Its pills (ملف / الملفات) follow the page's own words for that source; confirm them against the real app. */
(function(){
  const pill=(cls,t,id)=>SK.pill(cls,t).replace('<span ',`<span id="${id}" `), ic=SK.ic;
  const RES=[   // id, category pill, title, amount, source pill, source pill id
    ['r1','فاتورة','INV-10482 — مؤسسة الريان التجارية','١٢٬٤٥٠ ر.س','Odoo','srcOdoo1'],
    ['r2','ملاحظة','«الفاتورة تأخرت أسبوعًا» — عميل: متاجر الواحة','','واتساب','srcWa'],
    ['r3','فاتورة','INV-10477 — متاجر الواحة','٨٬٩٢٠ ر.س','Odoo','srcOdoo2'],
    ['r4','ملف','invoices_q3.xlsx — فواتير الربع الثالث','','الملفات','srcFile']];
  const row=(x,i)=>`<div class="abs" id="${x[0]}" style="left:0;right:0;top:${i*92}px;height:92px;border-top:${i?1.5:0}px solid #E5E4E9;">
    <div class="abs" style="right:30px;top:28px;display:flex;align-items:center;gap:14px;direction:rtl;">${SK.pill('cat',x[1])}<span style="font:600 21px 'PlexAR';color:#1A191E;white-space:nowrap;">${x[2]}</span></div>
    <div class="abs" style="left:30px;top:28px;display:flex;align-items:center;gap:16px;direction:rtl;"><span style="font:600 20px 'PlexAR';color:#1A191E;">${x[3]}</span>${pill('src',x[4],x[5])}</div></div>`;
  M.definePage('searchAll',{html:()=>SK.chrome('data')+SK.sidebar('data',4)+`<div class="sk-main side">
  <div class="abs" style="left:0;top:28px;display:flex;gap:12px;direction:ltr;"><span class="sk-btn ghost sm">${ic('search',20)}<span>الاستعلام المتقدم</span></span><span class="sk-btn soft sm">${ic('search',20)}<span>البحث</span></span></div>
  <div class="abs" id="searchHead" style="right:0;top:84px;width:1000px;">${SK.header(['الرئيسية','البحث والاستعلام'],'البحث في كل البيانات','ابحث في كل الحقول من كل المصادر — Odoo، واتساب، الملفات')}</div>
  <div class="abs sk-input" id="q" style="left:0;right:0;top:300px;height:76px;color:#1A191E;">${ic('search',28,'#52505A')}<span class="ph"></span></div>
  <div class="abs" id="filters" style="right:0;top:402px;display:flex;gap:12px;direction:rtl;"><span class="sk-btn soft sm">${ic('grid4',20)}<span>الكل</span></span><span class="sk-btn ghost sm">${ic('file',20)}<span>الملفات فقط</span></span></div>
  <div class="abs sk-card" id="resCard" style="left:0;right:0;top:486px;height:372px;overflow:hidden;">${RES.map(row).join('')}</div></div>`});
})();
