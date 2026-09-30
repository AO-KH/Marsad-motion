/* STARTER: a copy of the reference walkthrough (demos/decisions-walk). Copy this folder to demos/<slug>/, then change
   the title in demo.json (and the music/sfx blocks if you use another map: references/method.md §7), and here the intro,
   the steps, the benefit and the camera moves. Keep the map in M.walk the same as demo.json's music. Aim with
   node tools/rects.js <slug> …. Replace this header with your own beat map, truth notes and renderings. */
/* Decisions: approve a recommendation. A walkthrough in Marsad's walkthrough method (demos/kit/walk.js: Benji Taylor's
   walkthrough grammar in the main theme, on a field of stars), 16:9, 51.0 s, on the client's launch track (map 'launch':
   Monume "Product Launch Review", 80 BPM). B(k) = k x 0.75 s. Each groove bar hits on its downbeat and 2.5 beats in,
   after a short silence: clicks and big moves land on those.
     k0-8    intro    the drum bar twice: "Introducing / Decisions." among the stars; from k4.5 the window rises on its back
     k8      groove   the groove comes in with a big hit: the window lands flat (whoosh + hit)
     k8-14   step 1   Open Decisions: the camera dives onto the tabs; the hand clicks «القرارات» on k10.5; back out
     k14-20  step 2   Read the recommendation: its title up close, then the card
     k20-28  step 3   Check its confidence and source: «ثقة 80%» floats out; across to «المخزون · Odoo», which floats out
     k28-38  step 4   Approve it: the hand clicks «موافقة» on k32; the executed card floats out of the tilted page
     k38-47  step 5   It's recorded right away: approved 0 -> 1, under review 6 -> 5; back out to the whole page
     k48-52  exit     the window tilts away and fades
     k52-60  benefit  "From recommendation to action." over the track's breakdown
     k60-68  end      the capsule end on the hit that brings the groove back
   Truth: the pages, the tabs, the card with its pills and buttons, the executed card («تم تنفيذ الإجراء», #PO-2291) and
   the counters are the app's own (site kit, measured from the app). Renderings: the dark stage, its stars and glows, the
   window's glowing rim, the pointer, the parts floating out with the recesses and shadows they leave, the step capsule. */
const B=M.B, P=M.P, ez=M.ez, f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));

const W=M.walk({map:'launch',page:'pulse',
  intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[
    {at:B(8.5),  en:'Open Decisions',                  ar:'افتح صفحة القرارات'},
    {at:B(14.5), en:'Read the recommendation',         ar:'اقرأ التوصية'},
    {at:B(20),   en:'Check its confidence and source', ar:'راجع درجة الثقة والمصدر'},
    {at:B(28),   en:'Approve it',                      ar:'اعتمد التوصية'},
    {at:B(38.5), en:'It’s recorded right away',        ar:'يُسجَّل القرار فوراً'},
  ],
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}],ar:'من التوصية إلى التنفيذ.'}});
const {app,cam,lift,NP}=W, K_OK=B(32);

/* 1: open Decisions */
cam(B(8.5),{at:NP(1400,230),z:2.7,ry:-2},{dur:1.15});                 // dive onto the tabs
app.cursor(B(8.75),NP(1640,420),{dur:0.15});
app.click(B(10.5),'.sk-tab[data-k="dec"]',{ax:0.35,ay:0.92,lead:1.1,dur:1.0});
app.page(B(10.75),'decisions');
app.cursorOut(B(12.5));
cam(B(12),{z:1.06,rx:4,ry:-5},{dur:1.35});                            // back out: the Decisions page

/* 2: read the recommendation: its title up close, then the card */
cam(B(14.5),{at:NP(1110,742),z:3.5},{dur:1.15});                      // the whole title, large
cam(B(16.5),{at:NP(1108,780),z:2.7},{dur:2.4,ease:'sin'});            // back a little: its pills and buttons

/* 3: its confidence, then across to its source; each floats out as the camera lands on it */
cam(B(20),{at:NP(1290,791),z:3.6,ry:2},{dur:1.1});                    // «مرتفع» · «ثقة 80%» · «مستند · upload»
lift('text:ثقة 80%',B(21),B(24.3),{glow:'green'});
cam(B(24),{at:NP(250,741),z:3.9,rx:4,ry:12},{dur:1.5,hop:0.45});      // «المخزون · Odoo»: the page turns away
lift('text:المخزون · Odoo',B(25.25),B(28));

/* 4: approve it: the click lands on the downbeat k32; the executed card floats out */
cam(B(28),{at:NP(1290,853),z:2.8},{dur:1.4,hop:0.4});                 // the buttons
app.cursor(B(29.5),NP(1560,1010),{dur:0.2});
app.click(K_OK,'#btnOK',{ax:0.42,ay:0.72,lead:1.45,dur:1.2});
app.set(K_OK-0.3,'#btnOK',(el,on,t)=>{const q=P(t,K_OK-0.06,K_OK+0.22);el.style.transform=q>0&&q<1?`scale(${f3(1-0.05*Math.sin(Math.PI*q))})`:'';});
app.show(B(32.25),'#toast',{from:'none',scale:0.97,dur:0.45});
app.cursorOut(B(33.5));
cam(B(32.75),{at:NP(759,794),z:1.5,rx:7,ry:-10},{dur:1.5});           // back out to the whole card as it floats out
lift('#toast',B(33.5),B(38.5),{hide:['#decCard'],depth:60,up:1.1,down:0.8,glow:'green'});

/* 5: it's recorded right away: the counters and the filter tabs change */
cam(B(38.5),{at:NP(1116,528),z:2.25},{dur:1.3});
app.count(B(40.5),'#stats .sk-stat:nth-child(3) .n',0,1);
app.count(B(40.5),'#stats .sk-stat:nth-child(4) .n',6,5);
app.text(B(40.5),'text:موافق عليها (0)','موافق عليها (1)');
app.text(B(40.5),'text:قيد المراجعة (6)','قيد المراجعة (5)');
app.set(B(40.25),'#stats .sk-stat:nth-child(3)',(el,on,t)=>{const k=dec(t,B(40.5),B(40.5)+0.6)*(1-io(t,B(44.5),B(46)));
  el.style.boxShadow=k>0.001?`0 0 0 ${f2(2*k)}px rgba(11,132,71,${f3(0.5*k)}),0 0 ${f1(34*k)}px rgba(11,132,71,${f3(0.22*k)})`:'';});
cam(B(42.5),{at:NP(1000,474),z:2.9},{dur:1.2});                       // closer: approved 1, under review 5
cam(B(44.5),{z:1.02,rx:3,ry:-4},{dur:1.6});                           // the whole page again; the kit's exit follows (k48)
M.start();
