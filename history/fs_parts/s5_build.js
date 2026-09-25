/* S5 source chips + the site's knowledge graph (object types from the live ontology) */
const CHIPS=[['CSV',150,318,700,395],['XLSX',120,742,652,690],['PDF',1690,300,1210,390],['API',1712,760,1235,672]];
const chipsDiv=$('chips');
CHIPS.forEach(c=>{const d=document.createElement('div');d.className='chip';
 d.innerHTML=`<b></b><span style="position:static;">${c[0]}</span>`;chipsDiv.appendChild(d);});
const chipEls=[...chipsDiv.children];
// same six anchor points as the original graph; names + colours from the site's الخريطة المعرفية
const GN=[['موظف','EMPLOYEE',700,395,'#CE730B'],['عميل','CUSTOMER',960,300,'#DB4E11'],['فاتورة','INVOICE',1210,390,'#17A186'],
          ['مدينة','CITY',700,690,'#16A286'],['منتج','PRODUCT',960,760,'#149BB0'],['بند فاتورة','INVOICE LINE',1235,672,'#CC0C74']];
const gnodesDiv=$('gnodes');
GN.forEach(n=>{const d=document.createElement('div');d.className='gnode';
 d.innerHTML=`<i style="background:${n[4]};box-shadow:0 0 0 4px ${n[4]}22;"></i><span class="ar">${n[0]}</span><span class="en">${n[1]}</span>`;gnodesDiv.appendChild(d);});
const gnEls=[...gnodesDiv.children];
// the site's link types between these objects
const EDGE_PAIRS=[[1,2,'صادرة إلى'],[2,5,'تحتوي بند'],[5,4,'المنتج'],[0,1,'مدير الحساب'],[3,1,'يقع في']];
const edgesG=$('edges');
const edgeEls=EDGE_PAIRS.map(pr=>{
 const l=document.createElementNS('http://www.w3.org/2000/svg','line');
 const a=GN[pr[0]],b=GN[pr[1]];
 l.setAttribute('x1',a[2]);l.setAttribute('y1',a[3]);l.setAttribute('x2',b[2]);l.setAttribute('y2',b[3]);
 l.setAttribute('stroke','#B4B1C2');l.setAttribute('stroke-width','2');l.setAttribute('opacity','0');
 const len=Math.hypot(b[2]-a[2],b[3]-a[3]);
 l.setAttribute('stroke-dasharray',len);l.setAttribute('stroke-dashoffset',len);l.dataset.len=len;
 edgesG.appendChild(l);return l;
});
const elblEls=EDGE_PAIRS.map(pr=>{const d=document.createElement('div');d.className='elbl';d.textContent=pr[2];$('elbls').appendChild(d);return d;});
const spokeEls=GN.map(n=>{
 const l=document.createElementNS('http://www.w3.org/2000/svg','line');
 l.setAttribute('x1',n[2]);l.setAttribute('y1',n[3]);l.setAttribute('x2',960);l.setAttribute('y2',540);
 l.setAttribute('stroke','#8E32C3');l.setAttribute('stroke-width','2.2');l.setAttribute('opacity','0');
 const len=Math.hypot(960-n[2],540-n[3]);
 l.setAttribute('stroke-dasharray',len);l.setAttribute('stroke-dashoffset',len);l.dataset.len=len;
 edgesG.appendChild(l);return l;
});

