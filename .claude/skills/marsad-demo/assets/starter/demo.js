/* STARTER: a copy of the reference walkthrough (demos/decisions-walk). Copy this folder to demos/<slug>/, then change
   the title and the edit/sfx in demo.json (references/method.md §7), and here the intro, the steps, the benefit and the
   camera moves. Keep the map in M.walk the same as demo.json's music edit. Aim with node tools/rects.js <slug> ….
   Replace this header with your own beat map, truth notes and renderings. */
/* Decisions: approve a recommendation. A walkthrough in Marsad's walkthrough method (demos/kit/walk.js: Benji Taylor's
   walkthrough grammar in the main theme), 16:9, 43.8 s, on the funk track's 44 s map. B(k) = k x 0.5217 s.
     k0-8    intro    "Introducing / Decisions." on the dark stage; from k4.5 the window rises in on its back
     k8      groove   the window lands flat (whoosh + hit)
     k8-17   step 1   Open Decisions: the camera dives onto the tabs; the hand clicks «القرارات»; the page opens; back out
     k17-25  step 2   Read the recommendation: its title up close, then the card
     k25-34  step 3   Check its confidence and source: «ثقة 80%» floats out; across to «المخزون · Odoo», which floats out
     k34-46  step 4   Approve it: the hand clicks «موافقة» on k40 (groove B comes in); the executed card floats out
     k46-58  step 5   It's recorded right away: approved 0 -> 1, under review 6 -> 5; back out to the whole page
     k58-62  exit     the window tilts away and fades
     k62-72  benefit  "From recommendation to action." held through the track's break (k68-71)
     k72-84  end      the capsule end on the hit
   Truth: the pages, the tabs, the card with its pills and buttons, the executed card («تم تنفيذ الإجراء», #PO-2291) and
   the counters are the app's own (site kit, measured from the app). Renderings: the dark stage, lenses and dust, the
   window's glowing rim, the pointer, the parts floating out with the recesses and shadows they leave, the step capsule. */
const B=M.B, P=M.P, ez=M.ez, f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));

const W=M.walk({map:'44',page:'pulse',
  intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[
    {at:B(8.5), en:'Open Decisions',                  ar:'افتح صفحة القرارات'},
    {at:B(17),  en:'Read the recommendation',         ar:'اقرأ التوصية'},
    {at:B(25),  en:'Check its confidence and source', ar:'راجع درجة الثقة والمصدر'},
    {at:B(34),  en:'Approve it',                      ar:'اعتمد التوصية'},
    {at:B(46),  en:'It’s recorded right away',        ar:'يُسجَّل القرار فوراً'},
  ],
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}],ar:'من التوصية إلى التنفيذ.'}});
const {app,cam,lift,NP}=W, K_OK=B(40);

/* 1: open Decisions */
cam(B(8.75),{at:NP(1400,230),z:2.7,ry:-2},{dur:1.15});                // dive onto the tabs
app.cursor(B(9.3),NP(1640,420),{dur:0.15});
app.click(B(11.75),'.sk-tab[data-k="dec"]',{ax:0.35,ay:0.92,lead:1.1,dur:1.0});
app.page(B(12),'decisions');
app.cursorOut(B(13.3));
cam(B(12.9),{z:1.06,rx:4,ry:-5},{dur:1.35});                          // back out: the Decisions page

/* 2: read the recommendation: its title up close, then the card */
cam(B(17),{at:NP(1110,742),z:3.5},{dur:1.15});                       // the whole title, large
cam(B(19.6),{at:NP(1108,780),z:2.7},{dur:2.4,ease:'sin'});            // back a little: its pills and buttons

/* 3: its confidence, then across to its source; each floats out as the camera lands on it */
cam(B(25),{at:NP(1290,791),z:3.6,ry:2},{dur:1.1});                    // «مرتفع» · «ثقة 80%» · «مستند · upload»
lift('text:ثقة 80%',B(26.1),B(29.4),{glow:'green'});
cam(B(29.25),{at:NP(250,741),z:3.9,rx:4,ry:12},{dur:1.5,hop:0.45});   // «المخزون · Odoo»: the page turns away
lift('text:المخزون · Odoo',B(31.1),B(33.9));

/* 4: approve it: the click lands on k40, as groove B comes in; the executed card floats out */
cam(B(34),{at:NP(1290,853),z:2.8},{dur:1.4,hop:0.4});                 // the buttons
app.cursor(B(36.4),NP(1560,1010),{dur:0.2});
app.click(K_OK,'#btnOK',{ax:0.42,ay:0.72,lead:1.45,dur:1.2});
app.set(K_OK-0.3,'#btnOK',(el,on,t)=>{const q=P(t,K_OK-0.06,K_OK+0.22);el.style.transform=q>0&&q<1?`scale(${f3(1-0.05*Math.sin(Math.PI*q))})`:'';});
app.show(B(40.2),'#toast',{from:'none',scale:0.97,dur:0.45});
app.cursorOut(B(41.2));
cam(B(40.6),{at:NP(759,794),z:1.5,rx:7,ry:-10},{dur:1.5});            // back out to the whole card as it floats out
lift('#toast',B(41.9),B(45.8),{hide:['#decCard'],depth:60,up:1.1,down:0.8,glow:'green'});

/* 5: it's recorded right away: the counters and the filter tabs change */
cam(B(46.25),{at:NP(1116,528),z:2.25},{dur:1.3});
app.count(B(48.25),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(48.25),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(48.25),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(48.25),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.set(B(48),'#stats .sk-stat:nth-child(3)',(el,on,t)=>{const k=dec(t,B(48.25),B(48.25)+0.6)*(1-io(t,B(53),B(54.5)));
  el.style.boxShadow=k>0.001?`0 0 0 ${f2(2*k)}px rgba(11,132,71,${f3(0.5*k)}),0 0 ${f1(34*k)}px rgba(11,132,71,${f3(0.22*k)})`:'';});
cam(B(51.5),{at:NP(1000,474),z:2.9},{dur:1.2});                       // closer: approved 1, under review 5
cam(B(54.5),{z:1.02,rx:3,ry:-4},{dur:1.6});                           // the whole page again; the kit's exit follows (k58)
M.start();
