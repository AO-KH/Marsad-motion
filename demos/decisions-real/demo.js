/* Decisions: approve a recommendation. The walkthrough method (demos/kit/walk.js) on the real app's screens: the client's
   front end run with sample data and frozen by tools/app_snap.js (demos/decisions-real/app/). Since 2026-10-11 the new
   bilingual front end (its Arabic interface, dark mode, the MARSAD × Fusion look) and the feature catalogue's story: a
   monitoring rule raises the decision, a person approves it with a reason, its Decision Passport seals it. 16:9, 51.0 s,
   1080p, on the client's launch track (map 'launch': Monume "Product Launch Review", 80 BPM). B(k) = k x 0.75 s. Each
   groove bar hits on its downbeat and 2.5 beats in, after a short silence: a click sounds in the silence (demo.json: the
   client's mouse click at the same beats) and its result lands on the hit.
     k0-8    intro    "Introducing / Decisions." on the dark stage; from k4.5 the window rises on its back (the Home page)
     k8      groove   the window lands flat (whoosh + hit)
     k8-14   step 1   Open Decisions: the camera dives onto the top bar and the welcome; the hand clicks «القرارات»
                      (k9.8); the page opens on the hit (k10.5); back out to the whole page
     k14-20  step 2   Read the recommendation: its title up close, then the card with the AI's reasoning
     k20-28  step 3   Check its confidence and source: «ثقة 80%» floats out, then «مراقبة» (a monitoring rule raised it)
     k28-38  step 4   Approve it, with a reason: the camera backs out to the whole card, then in toward its buttons; the
                      hand clicks «موافقة» (k29.8); the app's confirm dialog opens on the hit (k30.5); a click in the
                      reason field (k33.8), the reason typed from the hit (k34.5); «تأكيد الموافقة» (k37.8)
     k38-47  step 5   Approved, and sealed in its passport: the app's «تم بنجاح» on the hit (k38.5), for the 2 s the app
                      shows it; then the card, approved, and the counts 5 / 1 (the approved one glows); «جواز القرار»
                      (k41.8) opens the passport on the hit (k42.5): the approval, and the green seal «السلسلة سليمة —
                      لا يوجد عبث» floats out
     k48-52  exit     the window tilts away and fades
     k52-60  benefit  "Marsad watches. You decide." (the catalogue's end line) over the track's breakdown
     k60-68  end      the capsule end on the hit that brings the groove back
   Truth: every screen is the app's own (its code, its CSS, its text), captured with sample data (labelled on screen
   "Sample data · بيانات تجريبية"): the recommendation a monitoring rule raised and two more, the counts, the passport's
   records. The confirm dialog, the reason field, «تم بنجاح», the approved card, the counts after the approve and the
   passport are what the app itself showed after its approve call. Changed: the Home hero's small kicker «طبقة القرار
   السيادية» is hidden (the catalogue avoids 'sovereign'); the passport is shown from its top, as a taller screen shows
   it (in 805 px the app centres it with its masthead out of reach); the dialogs are drawn centred on the screen as the
   app means them (in the live app the page's finished entrance animation leaves a transform that pins them to the
   content column). Renderings: the dark stage and its glows, the window's glowing rim, the camera, the pointer and its
   hover and press, the parts floating out with the recesses and shadows they leave, the glow on the approved count,
   the step capsule, the label. Invented: the reason typed in the field. */
const B=M.B, P=M.P, ez=M.ez, FQ=M.FQ, f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));

const W=M.walk({map:'launch',page:'home',
  intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[
    {at:B(8.5),  en:'Open Decisions',                       ar:'افتح صفحة القرارات'},
    {at:B(14.5), en:'Read the recommendation',              ar:'اقرأ التوصية'},
    {at:B(20),   en:'Check its confidence and source',      ar:'راجع درجة الثقة والمصدر'},
    {at:B(28),   en:'Approve it, with a reason',            ar:'اعتمدها مع ذكر السبب'},
    {at:B(38.5), en:'Approved, and sealed in its passport', ar:'اعتُمدت وخُتمت في جواز القرار'},
  ],
  note:{en:'Sample data',ar:'بيانات تجريبية'},
  benefit:{words:['Marsad','watches.','\n','You',{t:'decide.',g:1}],ar:'مرصد يراقب. وأنت تقرّر.',size:80,y:390}});
const {app,cam,lift,NP}=W;
// the app's hover under the hand (its :hover rules, as .rx-hover), and a button giving under the click
const hover=(a,b,spec)=>app.set(a,spec,(el,on,t)=>{const h=FQ(t)>=a&&FQ(t)<b;if(el.classList.contains('rx-hover')!==h)el.classList.toggle('rx-hover',h);});
const press=(t,spec)=>app.set(t-0.3,spec,(el,on,tt)=>{const q=P(tt,t-0.06,t+0.22);el.style.transform=q>0&&q<1?`scale(${f3(1-0.05*Math.sin(Math.PI*q))})`:'';});

/* 1: open Decisions (the Home page's top bar) */
cam(B(8.2),{at:NP(980,262),z:2.2,rx:2,ry:-4},{dur:1.0});             // dive onto the top bar and the welcome
app.cursor(B(7.7),NP(1180,236),{dur:0.15});                            // in as the window lands, before the dive
app.click(B(9.8),'[data-w=dec-tab]',{ax:0.45,ay:0.62,lead:0.85,dur:0.75}); // the click, in the bar's silence
hover(B(9.45),B(10.5),'[data-w=dec-tab]');
app.page(B(10.5),'decisions',{dur:0.35});                             // the page opens on the hit
app.cursorOut(B(12.3));
cam(B(12),{z:1.04,rx:4,ry:-5},{dur:1.35});                            // back out: the Decisions page

/* 2: read the recommendation: its title up close, then the card and the AI's reasoning */
cam(B(14.5),{at:NP(930,535),z:3.0},{dur:1.15});
cam(B(16.5),{at:NP(860,555),z:2.3},{dur:2.4,ease:'sin'});

/* 3: its confidence, then its source; each floats out as the camera settles on it */
cam(B(20),{at:NP(990,512),z:3.3,ry:3},{dur:1.1});                     // «مرتفع» · «مراقبة» · «ثقة 80%»
lift('[data-w=conf]',B(21),B(24.3),{glow:'green'});
cam(B(24),{at:NP(1030,512),z:3.6,rx:4,ry:10},{dur:1.3});
lift('[data-w=source]',B(25.25),B(28));

/* 4: approve it, with a reason: the app's confirm dialog. One click per bar, each in the bar's silence (+1.8), each
   result on the bar's +2.5 hit: «موافقة» k29.8 -> the dialog k30.5; the field k33.8 -> typing from k34.5;
   «تأكيد الموافقة» k37.8 -> «تم بنجاح» k38.5 */
cam(B(27.3),{at:NP(600,495),z:1.85,rx:3,ry:-6},{dur:1.1});           // back out: the whole card, its buttons at the left
cam(B(28.85),{at:NP(430,545),z:2.35,rx:2,ry:-8},{dur:0.9});           // in toward the buttons
app.cursor(B(28.4),NP(330,650),{dur:0.2});
app.click(B(29.8),'[data-w=approve]',{ax:0.42,ay:0.7,lead:0.8,dur:0.7});
hover(B(29.5),B(30.5),'[data-w=approve]');press(B(29.8),'[data-w=approve]');
app.page(B(30.5),'confirm',{dur:0.22});                               // the dialog opens on the hit
cam(B(30.3),{at:NP(720,415),z:2.3},{dur:1.2});                        // the decision, «لماذا هذا القرار؟», the reason field
app.click(B(33.8),{page:'confirm',sel:'[data-w=reason]'},{ax:0.3,ay:0.5,lead:1.0,dur:0.8});
app.page(B(33.8),'focus',{dur:0.1});                                  // the field takes the focus at the click
app.type(B(34.5),'[data-w=reason]','المخزون تحت حد الطلب منذ 3 أيام',{cps:18});   // typing starts on the hit
app.cursor(B(34.9),NP(600,478),{dur:0.6});                            // out of the text's way
cam(B(34.2),{at:NP(740,425),z:2.75},{dur:1.2});
app.click(B(37.8),'[data-w=ok]',{ax:0.5,ay:0.72,lead:0.85,dur:0.7});  // «تأكيد الموافقة»
hover(B(37.5),B(38.5),'[data-w=ok]');press(B(37.8),'[data-w=ok]');
app.page(B(38.5),'done',{dur:0.2});                                   // the app's «تم بنجاح» on the hit
cam(B(38.4),{at:NP(720,415),z:3.0},{dur:0.9});

/* 5: approved, and sealed in its passport. The app closes its message after 2 s (k41.17): the card is approved and the
   counts read 5 / 1 (the app updated them behind the message); the hand, already on its way, clicks «جواز القرار» in
   the bar's silence (k41.8) and the passport opens on the hit (k42.5): the approval, and the seal floats out */
const CLOSE=B(38.5)+2.0, PASS={page:'after',sel:'[data-w=pass]'};
app.cursor(B(39.5),NP(260,590),{dur:1.1});                            // toward the card, under the message
app.page(CLOSE,'after',{dur:0.3});
cam(CLOSE-0.15,{at:NP(590,445),z:1.8,rx:4,ry:-7},{dur:1.0});           // the counts, the approved card, its passport button
app.set(CLOSE-0.1,{page:'after',sel:'[data-w=st-approved]'},(el,on,t)=>{const k=dec(t,CLOSE,CLOSE+0.6);
  el.style.boxShadow=k>0.001?`0 0 0 ${f2(2*k)}px rgba(52,211,153,${f3(0.55*k)}),0 0 ${f1(34*k)}px rgba(52,211,153,${f3(0.25*k)})`:'';});
app.click(B(41.8),PASS,{ax:0.5,ay:0.62,lead:0.6,dur:0.5});
hover(B(41.45),B(42.5),PASS);press(B(41.8),PASS);
app.page(B(42.5),'passport',{dur:0.3});                               // the passport opens on the hit
app.cursorOut(B(43));
cam(B(42.3),{at:NP(720,240),z:2.7},{dur:1.2});                        // its masthead, the seal, the decision approved
lift('[data-w=seal]',B(43.6),B(47.2),{glow:'green',surface:'rgb(242,235,222)'});   // on the passport's paper
M.start();
