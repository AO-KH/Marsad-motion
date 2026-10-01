/* Knowledge map: from one customer to the whole business model. The walkthrough method (demos/kit/walk.js) on the real
   app's screens (the client's front end, frozen by tools/app_snap.js: demos/ontology-real/app/), in the app's dark mode as
   the feature catalogue's filming rules ask. 16:9, 51.0 s, on the client's launch track (map 'launch': 80 BPM,
   B(k) = k x 0.75 s). One click per bar, in the bar's silence (+1.8 beats, the client's mouse click in demo.json), and
   its result on the bar's +2.5 hit.
     k0-8    intro    "Introducing / Knowledge map." on the dark stage; from k4.5 the window rises on its back: the
                      knowledge map's «استكشاف», empty, its search box focused (the app focuses it when the page opens)
     k8      groove   the window lands flat (whoosh + hit)
     k8-14   step 1   Start from any customer: «الواحة» typed (k9); the customer, its contract and its chat come back on
                      the hit (k10.5); the hand clicks «متاجر الواحة» (k13.8)
     k14-20  step 2   See everything it connects to: the customer at the centre of its invoices, orders, contract and
                      chat (k14.5); a double click on INV-2291 (k17.8) brings its products, its payment and a receipt
                      (k18.5) while the map eases onto them, as the app's own view does
     k20-28  step 3   The AI suggests a link: the receipt hangs on a dashed «مقترح» line and floats out; «فتح الكائن»
                      (k21.8) opens the invoice; «الروابط» (k25.8): the receipt's link «مقترح» with ✓ and ✕
     k28-38  step 4   You confirm it: ✓ (k29.8) and the link is «مؤكّد» (k30.5); «عرض في الخريطة المعرفية» (k33.8):
                      on the map the line to the receipt is now solid (k34.5)
     k38-47  step 5   Your whole business, one model: «مخطط الأنطولوجيا» (k37.8 -> k38.5), every record type and how they
                      link; «فاتورة» clicked (k41.8): its links light up (k42.5)
     k48-52  exit     the window tilts away and fades
     k52-60  benefit  "Your company is a world. / Marsad is its map." over the track's breakdown (the catalogue's end line
                      «شركتك عالم. ومرصد خريطته.»)
     k60-68  end      the capsule end on the hit
   Truth: every screen is the app's own (its code, its CSS, its text), captured with sample data invented for the demo
   workspace (labelled on screen "Sample data · بيانات تجريبية"): the customer «متاجر الواحة», its invoices, orders,
   contract, chat, products, payment and receipt, and the model's 8 record types and 9 link types. The confirm, «مؤكّد», the
   solid line and the schema's lit links are what the app itself showed. Renderings: the dark stage and its glows, the
   window's rim, the camera, the pointer with its hover and press, the parts floating out with their recesses and shadows,
   the step capsule, the label. Eased: the new neighbours fade in over 0.15 s (the app draws them at once). */
const B=M.B, P=M.P, ez=M.ez, FQ=M.FQ, f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3), f4=x=>(+x).toFixed(4);

const W=M.walk({map:'launch',page:'explore',
  intro:{kicker:'Introducing',name:'Knowledge map.',ar:'تعرّف على الخريطة المعرفية'},
  steps:[
    {at:B(8.5),  en:'Start from any customer',        ar:'ابدأ من أي عميل'},
    {at:B(14.5), en:'See everything it connects to',  ar:'شوف كل ما يرتبط به'},
    {at:B(20),   en:'The AI suggests a link',         ar:'الذكاء الاصطناعي يقترح رابطًا'},
    {at:B(28),   en:'You confirm it',                 ar:'وأنت تؤكّده'},
    {at:B(38.5), en:'Your whole business, one model', ar:'أعمالك كلها في نموذج واحد'},
  ],
  note:{en:'Sample data',ar:'بيانات تجريبية'},
  benefit:{words:['Your','company','is','a','world.','\n','Marsad','is','its',{t:'map.',g:1}],ar:'شركتك عالم. ومرصد خريطته.',size:76,y:380}});
const {app,cam,lift,NP}=W;
// the app's hover under the hand (its :hover rules, as .rx-hover), and a button giving under the click
const hover=(a,b,spec)=>app.set(a,spec,(el,on,t)=>{const h=FQ(t)>=a&&FQ(t)<b;if(el.classList.contains('rx-hover')!==h)el.classList.toggle('rx-hover',h);});
const press=(t,spec)=>app.set(t-0.3,spec,(el,on,tt)=>{const q=P(tt,t-0.06,t+0.22);el.style.transform=q>0&&q<1?`scale(${f3(1-0.05*Math.sin(Math.PI*q))})`:'';});

/* 1: start from any customer: the map's search (the app focused it when the page opened) */
cam(B(8.2),{at:NP(590,530),z:2.3,rx:2,ry:-4},{dur:1.2});            // «ابدأ من كائن» and its search box
app.type(B(9.0),'[data-w=search]','الواحة',{cps:7});
// the box is dir="auto": empty it reads left to right (the snapshot froze that), and the first Arabic letter turns it right to left
app.set(B(9.0)-0.1,'[data-w=search]',(el,on,t)=>{const d=FQ(t)>=B(9.0)?'rtl':'';if(el.style.direction!==d)el.style.direction=d;});
app.page(B(10.5),'search',{dur:0.15});                                // the results arrive on the hit
cam(B(10.3),{at:NP(590,625),z:2.45,ry:-3},{dur:1.1});                // the box and its three results: a customer, a contract, a chat
app.cursor(B(11.4),NP(850,700),{dur:0.2});
app.click(B(13.8),'[data-w=hit]',{ax:0.82,ay:0.5,lead:0.85,dur:0.75});
hover(B(13.45),B(14.5),'[data-w=hit]');

/* 2: see everything it connects to; a double click opens INV-2291's own links */
app.page(B(14.5),'customer',{dur:0.3});                              // the map opens on the hit
cam(B(14.35),{at:NP(640,510),z:2.0,rx:3,ry:-6},{dur:1.3});           // the customer among its records, its panel at the left
cam(B(16.3),{at:NP(730,545),z:2.4,rx:2,ry:-9},{dur:1.15});           // toward INV-2291
app.click(B(17.8),'[data-w=inv]',{ax:0.5,ay:0.5,lead:0.9,dur:0.75});
app.click(B(18.0),null,{move:false});                                // the second click of the double click
hover(B(17.4),B(18.5),{page:'customer',sel:'[data-w=inv] .rounded-xl'});
press(B(17.8),{page:'customer',sel:'[data-w=inv] .rounded-xl'});
app.page(B(18.5),'invoice',{dur:0.06});
// the app draws the new neighbours at once and eases its view onto them (fitView, 0.4 s): the same view, eased here from
// the customer's (both captured: React Flow's viewport transform), the new records and lines fading in over 0.15 s
const VP0=[509.815,246.987,0.750909], VP1=[78.85,126.05,1.1], CW=1120, CH=517;   // canvas size: the view's centre stays smooth
app.set(B(18.5)-0.02,{page:'invoice',sel:'.react-flow__viewport'},(el,on,t)=>{
  const p=ez.ioC(P(FQ(t),B(18.5),B(18.5)+0.45)),s=VP0[2]*Math.pow(VP1[2]/VP0[2],p);
  const gx=(CW/2-VP0[0])/VP0[2]+((CW/2-VP1[0])/VP1[2]-(CW/2-VP0[0])/VP0[2])*p, gy=(CH/2-VP0[1])/VP0[2]+((CH/2-VP1[1])/VP1[2]-(CH/2-VP0[1])/VP0[2])*p;
  el.style.transform=`translate(${f2(CW/2-gx*s)}px,${f2(CH/2-gy*s)}px) scale(${f4(s)})`;});
const NEW=['5d1e8a3f','7f2c9b14','a8b3d6e2','e1c7f4a9','f3a6c2e8','0e008aa1','0e009aa1','0e010aa1','0e011aa1','0e012aa1','0e013aa1'];
for(const id of NEW)app.set(B(18.5)-0.02,{page:'invoice',sel:`[data-id^="${id}"]`},(el,on,t)=>{el.style.opacity=f3(ez.dec(P(FQ(t),B(18.5),B(18.5)+0.15)));});

/* 3: the AI suggests a link: the receipt on its dashed «مقترح» line; open the invoice, then its links */
cam(B(18.4),{at:NP(575,520),z:2.35,rx:3,ry:-7},{dur:1.2});           // INV-2291, its products, payment and the receipt
cam(B(19.7),{at:NP(560,585),z:3.1,rx:4,ry:-9},{dur:0.9});            // down the dashed line to the receipt: «مستند مرفق», suggested
cam(B(20.8),{at:NP(420,500),z:2.3,rx:2,ry:-5},{dur:0.9});            // the panel's «فتح الكائن» and the dashed line together
app.click(B(21.8),'[data-w=open]',{ax:0.5,ay:0.6,lead:0.85,dur:0.7});
hover(B(21.5),B(22.5),'[data-w=open]');press(B(21.8),'[data-w=open]');
app.page(B(22.5),'inv-page',{dur:0.25});                             // the invoice's own page
cam(B(22.4),{at:NP(820,440),z:2.3,rx:2,ry:-4},{dur:1.1});            // its tabs and properties
app.click(B(25.8),'[data-w=links-tab]',{ax:0.5,ay:0.55,lead:0.85,dur:0.7});
hover(B(25.5),B(26.5),'[data-w=links-tab]');
app.page(B(26.5),'inv-links',{dur:0.2});                             // «الروابط»: the receipt's link is «مقترح»

/* 4: you confirm it */
cam(B(26.4),{at:NP(640,580),z:1.9,rx:3,ry:-5},{dur:1.1});            // the links, the suggested one near the end
lift('[data-w=sugg]',B(27.2),B(29.3),{glow:'violet',depth:44,up:0.8,down:0.5});
cam(B(28.2),{at:NP(590,655),z:1.85,rx:2,ry:-7},{dur:1.0});          // its whole row: «مقترح» at the right, ✓ at the left
app.click(B(29.8),'[data-w=ok]',{ax:0.5,ay:0.55,lead:0.8,dur:0.7});
hover(B(29.5),B(30.5),'[data-w=ok]');press(B(29.8),'[data-w=ok]');
app.page(B(30.5),'inv-confirmed',{dur:0.15});                        // «مؤكّد»
lift('[data-w=conf]',B(30.8),B(33.0),{glow:'green',depth:48,up:0.7,down:0.5});
cam(B(32.4),{at:NP(430,420),z:1.8,rx:3,ry:-5},{dur:1.1});            // up to «عرض في الخريطة المعرفية» (the type's English name stays out)
app.click(B(33.8),'[data-w=map-btn]',{ax:0.5,ay:0.55,lead:0.85,dur:0.7});
hover(B(33.5),B(34.5),'[data-w=map-btn]');press(B(33.8),'[data-w=map-btn]');
app.page(B(34.5),'inv-map',{dur:0.3});                               // the map: the line to the receipt is solid now
cam(B(34.4),{at:NP(500,460),z:2.4,rx:3,ry:-8},{dur:1.2});
lift('[data-w=receipt]',B(35.1),B(37.2),{exact:true,glow:'green',depth:56,up:0.8,down:0.6});
cam(B(36.6),{at:NP(380,380),z:2.0,rx:2,ry:-4},{dur:1.0});            // over to «مخطط الأنطولوجيا»
app.click(B(37.8),'[data-w=schema-tab]',{ax:0.5,ay:0.55,lead:0.85,dur:0.7});
hover(B(37.5),B(38.5),'[data-w=schema-tab]');

/* 5: your whole business, one model */
app.page(B(38.5),'schema',{dur:0.35});
cam(B(38.4),{at:NP(585,505),z:1.75,rx:5,ry:-7},{dur:1.3});           // every record type and how they link
app.click(B(41.8),'[data-w=type-inv]',{ax:0.5,ay:0.55,lead:0.85,dur:0.7});
hover(B(41.5),B(42.5),'[data-w=type-inv] > div');
app.page(B(42.5),'schema-inv',{dur:0.25});                           // «فاتورة»: its links light up, outgoing and incoming
cam(B(42.4),{at:NP(450,470),z:1.6,rx:4,ry:-6},{dur:1.2});
app.cursorOut(B(43.2));
cam(B(45.2),{z:1.02,rx:3,ry:-4},{dur:1.6});                          // the whole page; the kit's exit follows (k48)
M.start();
