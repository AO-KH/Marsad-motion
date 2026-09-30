/* Decisions: approve a recommendation. The walkthrough method (demos/kit/walk.js) on the real app's screens: the client's
   front end run with sample data and frozen by tools/app_snap.js (demos/decisions-real/app/). 16:9, 51.0 s, on the
   client's launch track (map 'launch': Monume "Product Launch Review", 80 BPM). B(k) = k x 0.75 s. Each groove bar
   hits on its downbeat and 2.5 beats in, after a short silence: a click sounds in the silence (demo.json: the client's
   mouse click at the same beats) and its result lands on the hit.
     k0-8    intro    "Introducing / Decisions." on the dark stage; from k4.5 the window rises on its back (the Home page)
     k8      groove   the window lands flat (whoosh + hit)
     k8-14   step 1   Open Decisions: the camera dives onto the top bar; the hand clicks «القرارات» (k9.8); the page
                      opens on the hit (k10.5); back out to the whole page
     k14-20  step 2   Read the recommendation: its title up close, then the card with the AI's reasoning
     k20-28  step 3   Check its confidence and source: «ثقة 80%» floats out, then «مستند · Odoo»
     k28-38  step 4   Approve it, with a reason: the camera backs out to the whole card, then in toward its buttons; the
                      hand clicks «موافقة» (k29.8); the app's confirm dialog opens on the hit (k30.5); a click in the
                      reason field (k33.8), the reason typed from the hit (k34.5); «تأكيد الموافقة» (k37.8)
     k38-47  step 5   Approved, and the Odoo action runs: the app's «تم بنجاح» on the hit (k38.5), for the 2 s the app
                      shows it; the card, now «موافق» and «نُفِّذ الإجراء», floats out of the tilted page; the counts
                      move on the hit (k42.5: under review 6 -> 5, approved 0 -> 1)
     k48-52  exit     the window tilts away and fades
     k52-60  benefit  "From recommendation to action." over the track's breakdown
     k60-68  end      the capsule end on the hit that brings the groove back
   Truth: every screen is the app's own (its code, its CSS, its text), captured with sample data: the three
   recommendations (from the client's screen recording), the counts, the workspace. The confirm dialog, the reason field,
   «تم بنجاح», the card's approved state and the counts after the approve are what the app itself showed after its
   approve call. Renderings: the dark stage and its glows, the window's glowing rim, the camera, the pointer and its
   hover and press, the parts floating out with the recesses and shadows they leave, the step capsule. Invented: the
   reason typed in the field; and the counts are shown changing after the dialog closes (the app updates them behind
   the dialog as soon as the approve succeeds). */
const B=M.B, P=M.P, ez=M.ez, FQ=M.FQ, f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b));

const W=M.walk({map:'launch',page:'home',
  intro:{kicker:'Introducing',name:'Decisions.',ar:'تعرّف على القرارات'},
  steps:[
    {at:B(8.5),  en:'Open Decisions',                     ar:'افتح صفحة القرارات'},
    {at:B(14.5), en:'Read the recommendation',            ar:'اقرأ التوصية'},
    {at:B(20),   en:'Check its confidence and source',    ar:'راجع درجة الثقة والمصدر'},
    {at:B(28),   en:'Approve it, with a reason',          ar:'اعتمدها مع ذكر السبب'},
    {at:B(38.5), en:'Approved, and the Odoo action runs', ar:'اعتُمدت ونُفِّذ الإجراء في Odoo'},
  ],
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}],ar:'من التوصية إلى التنفيذ.'}});
const {app,cam,lift,NP}=W;
// the app's hover under the hand (its :hover rules, as .rx-hover), and a button giving under the click
const hover=(a,b,spec)=>app.set(a,spec,(el,on,t)=>{const h=FQ(t)>=a&&FQ(t)<b;if(el.classList.contains('rx-hover')!==h)el.classList.toggle('rx-hover',h);});
const press=(t,spec)=>app.set(t-0.3,spec,(el,on,tt)=>{const q=P(tt,t-0.06,t+0.22);el.style.transform=q>0&&q<1?`scale(${f3(1-0.05*Math.sin(Math.PI*q))})`:'';});

/* 1: open Decisions (the Home page's top bar) */
cam(B(8.2),{at:NP(930,286),z:2.0,rx:2,ry:-4},{dur:1.0});             // dive onto the top bar, the welcome and its search
app.cursor(B(8.5),NP(1190,250),{dur:0.15});
app.click(B(9.8),'[data-w=dec-tab]',{ax:0.4,ay:0.9,lead:0.85,dur:0.75}); // the click, in the bar's silence
hover(B(9.45),B(10.5),'[data-w=dec-tab]');
app.page(B(10.5),'decisions',{dur:0.35});                             // the page opens on the hit
app.cursorOut(B(12.3));
cam(B(12),{z:1.04,rx:4,ry:-5},{dur:1.35});                            // back out: the Decisions page

/* 2: read the recommendation: its title up close, then the card and the AI's reasoning */
cam(B(14.5),{at:NP(952,527),z:3.0},{dur:1.15});
cam(B(16.5),{at:NP(880,550),z:2.25},{dur:2.4,ease:'sin'});

/* 3: its confidence, then its source; each floats out as the camera settles on it */
cam(B(20),{at:NP(985,500),z:3.3,ry:3},{dur:1.1});                     // «مرتفع» · «مستند · Odoo» · «ثقة 80%»
lift('[data-w=conf]',B(21),B(24.3),{glow:'green'});
cam(B(24),{at:NP(1025,500),z:3.6,rx:4,ry:10},{dur:1.3});
lift('[data-w=source]',B(25.25),B(28));

/* 4: approve it, with a reason: the app's confirm dialog. One click per bar, each in the bar's silence (+1.8), each
   result on the bar's +2.5 hit: «موافقة» k29.8 -> the dialog k30.5; the field k33.8 -> typing from k34.5;
   «تأكيد الموافقة» k37.8 -> «تم بنجاح» k38.5 */
cam(B(27.3),{at:NP(600,560),z:1.75,rx:3,ry:-6},{dur:1.1});           // back out: the whole card, its buttons at the left
cam(B(28.85),{at:NP(360,540),z:2.35,rx:2,ry:-8},{dur:0.9});           // in toward the buttons
app.cursor(B(28.4),NP(330,655),{dur:0.2});
app.click(B(29.8),'[data-w=approve]',{ax:0.42,ay:0.78,lead:0.8,dur:0.7});
hover(B(29.5),B(30.5),'[data-w=approve]');press(B(29.8),'[data-w=approve]');
app.page(B(30.5),'confirm',{dur:0.22});                               // the dialog opens on the hit
cam(B(30.3),{at:NP(720,420),z:2.3},{dur:1.2});                        // the decision, «لماذا هذا القرار؟», the reason field
app.click(B(33.8),{page:'confirm',sel:'[data-w=reason]'},{ax:0.3,ay:0.5,lead:1.0,dur:0.8});
app.page(B(33.8),'focus',{dur:0.1});                                  // the field takes the focus at the click
app.type(B(34.5),'[data-w=reason]','المخزون تحت حد الطلب منذ 3 أيام',{cps:18});   // typing starts on the hit
app.cursor(B(34.9),NP(612,474),{dur:0.6});                            // out of the text's way
cam(B(34.2),{at:NP(760,430),z:2.75},{dur:1.2});
app.click(B(37.8),'[data-w=ok]',{ax:0.5,ay:0.72,lead:0.85,dur:0.7});  // «تأكيد الموافقة»
hover(B(37.5),B(38.5),'[data-w=ok]');press(B(37.8),'[data-w=ok]');
app.page(B(38.5),'done',{dur:0.2});                                   // the app's «تم بنجاح» on the hit
cam(B(38.4),{at:NP(720,415),z:3.0},{dur:0.9});
app.cursorOut(B(39.3));

/* 5: approved, and the Odoo action runs: the app closes its message after 2 s (k41.17); the card floats out of the
   tilted page; the counts move on the next hit (k42.5) */
const CLOSE=B(38.5)+2.0;
app.page(CLOSE,'after',{dur:0.3});
cam(CLOSE-0.15,{at:NP(600,560),z:1.45,rx:7,ry:-10},{dur:1.5});
lift('[data-w=card]',B(41.9),B(45.4),{exact:true,depth:60,up:1.1,down:0.8,glow:'green'});
const was=(sel,old)=>app.set(CLOSE,{page:'after',sel},(el,on,t)=>{if(el._now==null)el._now=el.textContent;
  const v=FQ(t)<B(42.5)?old:el._now;if(el.textContent!==v)el.textContent=v;});
was('[data-w=st-pending] .text-2xl','6');was('[data-w=st-approved] .text-2xl','0');
was('[data-w=tab-pending]','(6)');was('[data-w=tab-approved]','(0)');
app.set(B(42.25),{page:'after',sel:'[data-w=st-approved]'},(el,on,t)=>{const k=dec(t,B(42.5),B(42.5)+0.6)*(1-io(t,B(46),B(47.5)));
  el.style.boxShadow=k>0.001?`0 0 0 ${f2(2*k)}px rgba(11,132,71,${f3(0.5*k)}),0 0 ${f1(34*k)}px rgba(11,132,71,${f3(0.22*k)})`:'';});
cam(B(45.2),{z:1.02,rx:3,ry:-4},{dur:1.6});                           // the whole page again; the kit's exit follows (k48)
M.start();
