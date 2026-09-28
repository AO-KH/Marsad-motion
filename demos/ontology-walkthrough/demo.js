/* Your ontology at a glance — a 52 s step-by-step walkthrough (the "walkthrough" template, 4 steps).
   Music: SoundSurfer "Product Video" (fit/product-video.mp3), 88 BPM; B(k) is beat k (bars every 4). The groove
   runs from k4 and its phrases start on k4, k20, k36 and k52: the schema appears on the k20 phrase, the link is
   named on k36, and the end card starts on k68 (a phrase start; the track's short stop at k70-71 falls inside it).
   The video ends on k76 (51.8 s) under a 3 s fade.
   Shape: title → the app (the Data section) → 4 steps of 12 beats (numbered rail + one caption per step) → outro →
   end card. Screens: 'dataSearch' and 'ontologyMap' (pages.js: the Knowledge Map rebuilt from the real page). */
const B=M.B, v=M.pick, S8=M.S8;                // v(a16x9, a9x16): per-format framing
const at=(x,y)=>({x,y,w:0,h:0});                // a view centre in page px (what tools/cutcheck.js suggests)

M.title({at:B(0.5),out:B(6.5),icon:'share2',kicker:'WALKTHROUGH',kickerAr:'شرح خطوة بخطوة',
  en:'Your ontology at a glance',ar:'أنطولوجيا بياناتك في لمحة'});

const app=M.app({at:B(7),out:B(67.5),page:'dataSearch',view:{x:v(948,1366)}});

M.steps({at:B(8),out:B(56),list:[
  {at:B(8), en:'Open the Knowledge Map',         ar:'افتح الخريطة المعرفية'},
  {at:B(20),en:'Switch to the ontology schema',  ar:'اعرض مخطط الأنطولوجيا'},
  {at:B(32),en:'Read the types and their links', ar:'اقرأ الأنواع والروابط بينها'},
  {at:B(44),en:'Select a type to see its links', ar:'اختر نوعًا لترى روابطه'},
]});

// 1 — Data → الخريطة المعرفية in the section sidebar; the view glides out as the new page fades in
const NAV='.sk-side .sk-item:nth-child(3)';
app.focus(B(8),v(at(1392,360),at(1396,500)),{scale:v(1.35,1.0)});
app.click(B(11),NAV,{ax:0.3,ay:0.55});
app.page(B(11.25),'ontologyMap');
app.focus(B(11.5),v('page',at(970,500)),{...v({x:948},{scale:1.0}),dur:1.4});
app.cursorOut(B(13));

// 2 — the mode pills: the schema replaces Explore's empty state; the types appear one per 8th, then the links
app.focus(B(20),v(at(370,306),at(278,378)),{scale:v(1.84,1.8),dur:1.2});
app.click(B(23),'#mSchema',{ax:0.5,ay:0.92});
app.show(B(23),'#mSchemaOn',{from:'none',dur:0.3});
app.hide(B(23),'#mExploreOn',{dur:0.3,dist:0});
app.hide(B(23.25),'#exCanvas',{dur:0.5,dist:0});
app.show(B(23.25),'#schCanvas',{from:'none',dur:0.6});
['#nProjectW','#nSectionW','#nFileW'].forEach((s,i)=>app.show(B(23.5)+i*S8,s,{from:'below',dist:10}));
app.show(B(25),'#kmEdges',{from:'none',dur:0.7});
app.show(B(25),'#kmInfo',{from:'none',dur:0.7});
app.focus(B(23.5),v(at(832,705),at(970,500)),{scale:v(1.07,1.0),dur:1.4});
app.cursorOut(B(25));

// 3 — a type (node) and a link between two types (line and label)
app.focus(B(32),v(at(973,765),at(1154,691)),{scale:v(1.29,1.6),dur:1.2});
app.callout(B(33),B(42),'#nProject',{en:'An object type',ar:'نوع كائن',side:'left',gap:40});
app.callout(B(36),B(42),'#eOut',{en:'A link between two types',ar:'رابط بين نوعين',side:'bottom',gap:24,dx:v(146,181)});   // inside the triangle, clear of both lines

// 4 — select مشروع: it is ringed and its details panel opens with its outgoing and incoming links
app.click(B(47),'#nProject',{ax:0.5,ay:0.9});
app.show(B(47.25),'#nProject .km-sel',{from:'none',dur:0.3});
app.show(B(47.25),'#kmPanel',{from:'left',dist:16,dur:0.7});
app.focus(B(47.5),v('page',at(412,708)),{...v({x:948},{scale:1.42}),dur:1.4});
app.cursorOut(B(49));
// «واحد إلى متعدد» (one to many), read from the selected type: a project holds many files, and sits in one section.
// The boxes point at the rows' right ends (clear of the text) and sit right of the panel; 9:16 leaves ~300 px there.
app.callout(B(49.5),B(55),'#rowOut',{en:'Holds many files',ar:'يضم ملفات متعددة',side:'right',gap:50});
app.callout(B(51.5),B(55),'#rowIn',{en:'In one section',ar:'ضمن قسم واحد',side:'right',gap:50});

// outro
M.caption({at:B(56),out:B(67),en:'See how all your data connects.',ar:'اعرف كيف ترتبط بياناتك ببعضها.'});
if(M.FORMAT==='9x16')app.focus(B(56),'page',{x:1366,dur:1.6});   // back to the page's right part: header, map, sidebar

M.endcard({at:B(68)});
M.start();
