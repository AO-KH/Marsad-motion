/* Marsad — style sample: Jupiter Exchange (films/style-jupiter). About 28 s of the Marsad film told in the grammar of
   Jupiter's launch video (the client's reference 03_JupiterExchange.mp4): near-black; big lenses with dark bodies and
   bright rims (Jupiter's are blue to lime; here Marsad's violet to magenta and pink); medium-weight white type with grey
   and gradient words; fast cuts, about one shot per two to four beats; the app's UI in perspective with a glowing rim;
   a carousel curving under a glowing dome; one bright lens; ring patterns; two lenses joining; the URL in a glowing
   capsule; the mark.
   House rules kept: English + Arabic on every line, Western digits, no shake (punches <= 1.5%), nothing on every beat, no
   orb behind the logo, "Book your demo" and marsadnasl.com at the end. Sound effects only on the transitions.
   Music: HoliznaCC0 "Movement" (fit/holizna-movement.mp3, CC0, 96.67 BPM), film.json "edit": song beats 24-57 and 134-145,
   as films/style-lovable: the groove starts on film k8, the two-beat silence is k36-37, the hit k38. B(k) = k x 0.6207 s.
     k0-4    lenses    three lenses drift apart; "Your data is everywhere." «بياناتك مبعثرة في كل مكان.»
     k4-8    horizon   a lens's rim rises at the bottom; "Now in one place." «الآن في مكان واحد.»
     k8-12   the app   (the groove starts) Business Pulse in perspective, pulling back and up
     k12-16  hero      inside a huge lens: "Meet" / Marsad (with a grey echo) / «تعرّف على مرصد.»
     k16-18  pills     Connect · Unify · Monitor · Act, lit one after another
     k18-22  carousel  the source tiles turn on an arc under a glowing dome; "With every system." «مع كل أنظمتك.»
     k22-24  bright    a white lens; "From your own numbers." «مبنية على أرقامك — بلا اختلاق.»
     k24-28  decide    the Decisions card in perspective; the cursor clicks «موافقة»; executed, PO-2291
     k28-32  rings     "Sovereign." «بنية تحتية سيادية.» / "PDPL-compliant." «متوافق مع نظام حماية البيانات الشخصية.»
     k32-34  Arabic    «بالعربية», huge, its gradient turning white; "Ask in Arabic."
     k34-38  line      "One operational nervous system." «جهاز عصبي تشغيلي واحد لشركتك.», held through the silence
     k38-41  join      on the hit, two lenses join: "Book your demo." «احجز عرضك التجريبي.»
     k41-46  end       the lenses squash into a glowing capsule: marsadnasl.com; the mark; "Book your demo"
   Truth: the Business Pulse page, the Decisions card and toast and the loop's four steps are the app's (site kit and
   site_pages/; the steps are the 63 s film's). The lenses, rings and capsule are the reference's grammar. */
const B=M.B, S8=M.S8, S16=M.S16, S32=M.S32, ez=M.ez, P=M.P, st=M.st, lerp=M.lerp, FQ=M.FQ;
const f1=x=>(+x).toFixed(1), f2=x=>(+x).toFixed(2), f3=x=>(+x).toFixed(3);
const dec=(t,a,b)=>ez.dec(P(t,a,b)), io=(t,a,b)=>ez.ioC(P(t,a,b)), inc=(t,a,b)=>ez.inC(P(t,a,b));
const show=(e,v)=>{e.style.display=v?'':'none';return v;};
const inShot=(t,a,b)=>t>=a&&t<b;

const K1=B(4), K2=B(8), K3=B(12), K4=B(16), K5=B(18), K6=B(22), K7=B(24), K8=B(28), K9=B(30), K10=B(32), K11=B(34), K12=B(38), K13=B(41);
window.CUTS=[K1,K2,K3,K4,K5,K6,K7,K8,K9,K10,K11,K12];       // hard cuts (k41 is a morph, not a cut)

/* ---------------- the stage: near black; lenses painted on a canvas ---------------- */
const BGL=M.layer(), SCN=M.layer(), TXT=M.layer('over');
const stage=M.el('div','jp-stage',null,BGL);
const cv=M.el('canvas',null,null,stage);cv.width=1920;cv.height=1080;const g=cv.getContext('2d');
// a lens: dark body, the rim brightening from indigo through violet and magenta to pink-white (Jupiter: navy, teal, lime)
const RIM=[[0,'#06050E'],[0.5,'#0A0717'],[0.7,'#150A31'],[0.82,'#2F1068'],[0.91,'#6420B8'],[0.965,'#BD3BE8'],[0.99,'#FF9BF0'],[1,'#FFD9FA']];
const RIM_B=[[0,'#FBF8FD'],[0.5,'#F5EDFB'],[0.7,'#EAD5F8'],[0.83,'#DAA4F3'],[0.92,'#BB4DE7'],[0.975,'#6A1DB8'],[1,'#240B4F']];   // the bright one
const RING=[[0,'rgba(0,0,0,0)'],[0.78,'rgba(40,12,90,0)'],[0.9,'rgba(90,26,170,0.35)'],[0.96,'rgba(180,55,230,0.75)'],[0.99,'rgba(255,160,240,0.95)'],[1,'rgba(255,215,250,0.6)']];
// the lit side: the gradient's inner point sits (lx, ly) x r from the centre, so the rim is widest on the opposite side
function lens(x,y,r,o={}){
  const a=o.a??1, lx=(o.lx??0.18)*r, ly=(o.ly??-0.2)*r;
  if((o.glow??1)>0){const og=g.createRadialGradient(x,y,r*0.97,x,y,r*1.16);
    og.addColorStop(0,`rgba(206,64,240,${f3(0.32*a*(o.glow??1))})`);og.addColorStop(1,'rgba(206,64,240,0)');
    g.fillStyle=og;g.beginPath();g.arc(x,y,r*1.16,0,2*Math.PI);g.fill();}
  const gr=g.createRadialGradient(x+lx,y+ly,0,x,y,r);for(const [s,c] of (o.pal??RIM))gr.addColorStop(s,c);
  g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,2*Math.PI);g.fill();g.globalAlpha=1;
}
function ring(x,y,r,a){g.globalCompositeOperation='screen';lens(x,y,r,{pal:RING,a,glow:0.5,lx:0.1,ly:0.12});g.globalCompositeOperation='source-over';}
// two lenses joined: both rims, then both bodies again (0.93 r) over the inner rims, so only the outline glows; overlap
// them by a good third of r, or the inner rims show near the middle
function lens2(x1,x2,y,r,a){
  lens(x1,y,r,{a,lx:0.12,ly:0.2});lens(x2,y,r,{a,lx:-0.12,ly:0.2});
  for(const [x,lx] of [[x1,0.12],[x2,-0.12]]){const R=r*0.93,gr=g.createRadialGradient(x+lx*r,y+0.2*r,0,x,y,R);   // RIM's stops, rescaled to 0.93 r
    gr.addColorStop(0,'#06050E');gr.addColorStop(0.538,'#0A0717');gr.addColorStop(0.753,'#150A31');gr.addColorStop(0.882,'#2F1068');
    gr.addColorStop(0.97,'#5A1CA8');gr.addColorStop(1,'rgba(90,28,168,0)');
    g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,2*Math.PI);g.fill();g.globalAlpha=1;}
}
function haze(x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${c},${f3(a)})`);gr.addColorStop(1,`rgba(${c},0)`);
  g.fillStyle=gr;g.fillRect(0,0,1920,1080);}
function rings(alt,u){                    // rows of rings above and below the words, drifting sideways (no beat)
  const d=alt?70:0, sx=22*u;
  for(let i=-1;i<7;i++){
    ring(i*340+sx+(alt?170:0),-130+d,330,0.95);ring(i*340+170-sx*0.8-(alt?120:0),1210-d,330,0.95);
    ring(i*300+90+sx*1.2,-30+d*0.5,250,0.55);ring(i*300-60-sx,1110-d*0.5,250,0.55);
  }
}
M.track(t=>{
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.fillStyle='#06050E';g.fillRect(0,0,1920,1080);
  if(t<K1){                                // three lenses drift apart
    const u=P(t,0,K1), pa=dec(t,0.05,1.1);
    lens(170-70*u,700+20*u,500,{a:pa,lx:0.2,ly:-0.1});lens(1780+60*u,560-10*u,540,{a:pa,lx:-0.2,ly:-0.1});
    lens(960+40*u,250-40*u,600*(1.05-0.05*u),{a:pa,lx:0.12,ly:-0.3});
  }else if(t<K2){                          // the horizon: one huge lens's rim rises at the bottom, then we tilt into it
    const up=inc(t,B(7.2),K2);lens(960,2440-120*io(t,K1,B(7.2))-560*up,1540,{lx:0,ly:-0.1});
  }else if(t<K3){haze(960,760,1000,'150,40,220',0.32);
  }else if(t<K4){const u=P(t,K3,K4);lens(960,540,1010-24*u,{lx:-0.05,ly:-0.12});
  }else if(t<K5){
  }else if(t<K6){lens(960,210,850,{lx:0,ly:-0.32});
  }else if(t<K7){lens(960,540,1100,{pal:RIM_B,glow:0,lx:0,ly:0});
  }else if(t<K8){haze(960,660,900,'150,40,220',0.28);
  }else if(t<K10){rings(t>=K9,t-K8);
  }else if(t<K12){
  }else{                                   // two lenses join on the hit; then they squash into the capsule and go
    const pj=dec(t,K12,K12+0.9), sq=io(t,B(40.3),K13+0.15), a=1-P(sq,0.55,1);
    if(a>0.002){const dx=lerp(lerp(640,380,pj),290,sq);
      g.save();g.translate(960,540);g.scale(1-0.2*sq,1-0.75*sq);lens2(-dx,dx,0,470,a);g.restore();}
  }
});

/* ---------------- type: words blur in (they keep their places, as in the reference), the Arabic after them ---------------- */
function jt(o){
  const e=M.el('div','jt'+(o.cls?' '+o.cls:''),null,TXT);st(e,{top:o.y+'px'});
  const en=M.el('div','en',null,e);if(o.size)en.style.fontSize=o.size+'px';
  const ws=[];for(const w of o.words){if(w==='\n'){en.appendChild(document.createElement('br'));continue;}
    ws.push(typeof w==='string'?M.el('span','w',w,en):M.el('span','w'+(w.g?' g':'')+(w.d?' dim':''),w.t,en));}
  const ar=o.ar?M.el('div','ar',o.ar,e):null;if(ar&&o.arSize)ar.style.fontSize=o.arSize+'px';
  const T=ws.map((_,i)=>o.at+i*(o.step??S16)), tAr=o.arAt??(T[T.length-1]+S8);
  M.track(t=>{
    if(!show(e,inShot(t,o.at-0.001,o.out)))return;
    const x=o.fade?io(t,o.fade[0],o.fade[1]):0;
    e.style.opacity=f3(1-x);e.style.filter=x>0?`blur(${f2(8*x)}px)`:'none';
    ws.forEach((s,i)=>{const p=dec(t,T[i],T[i]+0.35);st(s,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*12)}px)`:'none',transform:`translateY(${f1((1-p)*14)}px)`});});
    if(ar){const p=dec(t,tAr,tAr+0.4);st(ar,{opacity:f3(p),filter:p<1?`blur(${f2((1-p)*8)}px)`:'none',transform:`translateY(${f1((1-p)*10)}px)`});}
  });
  return e;
}

/* ================= k0-8 ================= */
jt({at:B(0.75),out:K1,y:410,size:80,step:S8,words:['Your','data','is',{t:'everywhere.',d:1}],ar:'بياناتك مبعثرة في كل مكان.'});
jt({at:K1+0.02,out:K2,y:400,size:104,step:S16*1.5,words:['Now','in','one',{t:'place.',g:1}],ar:'الآن في مكان واحد.',arSize:44});

/* ================= k8-12 the app: Business Pulse in perspective, pulling back and up ================= */
const S3=M.el('div','jp-shot',null,SCN), D3=M.el('div','jp-3d',null,S3);
const UI=M.el('div','jp-ui',`<img src="site_pages/pulse.png">`,D3);
M.track(t=>{
  if(!show(S3,inShot(t,K2,K3)))return;
  const u=io(t,K2,K3), pe=dec(t,K2,K2+0.45), ty=lerp(460,20,ez.dec(P(t,K2,K3)));
  st(UI,{opacity:f3(pe),transform:`translate3d(12px,${f1(10+ty)}px,${f1(lerp(-150,-700,u))}px) rotateX(${f2(lerp(66,14,u))}deg) rotateZ(${f2(lerp(-7,0,u))}deg)`});
});

/* ================= k12-16 the hero, inside a huge lens ================= */
const HR=M.el('div','jh',null,TXT);
const hSm=M.el('span','sm','Meet',HR), hE=[M.el('span','big e','Marsad',HR),M.el('span','big e','Marsad',HR)], hM=M.el('span','big m','Marsad',HR),
  hAr=M.el('span','ar','تعرّف على مرصد.',HR);
let HW=0;
M.track(t=>{
  if(!show(HR,inShot(t,K3,K4)))return;
  if(!HW)HW=hM.offsetWidth;
  const X0=960-HW/2, Y0=372, push=1+0.03*P(t,K3,K4);
  HR.style.transformOrigin='960px 540px';HR.style.transform=`scale(${f3(push)})`;
  const ps=dec(t,B(12.1),B(12.1)+0.4);st(hSm,{left:f1(X0+14)+'px',top:'262px',opacity:f3(ps),filter:ps<1?`blur(${f2((1-ps)*10)}px)`:'none'});
  // the big word slides in from the left; two grey copies trail it and stay as a slight extrude
  const sx=t0=>-300*(1-dec(t,B(12.4)+t0,B(12.4)+t0+0.75)), pb=dec(t,B(12.4),B(12.4)+0.3);
  st(hM,{transform:`translate(${f1(X0+sx(0))}px,${Y0}px)`,opacity:f3(pb)});
  hE.forEach((e,i)=>st(e,{transform:`translate(${f1(X0+sx(0.07*(i+1))-9*(i+1))}px,${f1(Y0+3*(i+1))}px)`,opacity:f3(pb*(0.75-0.3*i))}));
  const pa=dec(t,B(13.4),B(13.4)+0.45);
  st(hAr,{right:f1(1920-(X0+HW)+6)+'px',top:'700px',opacity:f3(pa),filter:pa<1?`blur(${f2((1-pa)*10)}px)`:'none'});
});

/* ================= k16-18 the loop's four steps as pills; the lit one moves on each 8th ================= */
const PL=[['link','Connect','اربط'],['merge','Unify','وحّد'],['pulse','Monitor','راقب'],['check','Act','نفّذ']];
const PLS=M.el('div','jpills',PL.map(([ic,en,ar])=>`<span class="jpill">${SK.ic(ic,42,'currentColor',2.2)}<span class="en">${en}</span><span class="ar">${ar}</span></span>`).join(''),TXT);
st(PLS,{top:'485px'});
const plEls=[...PLS.children];
M.track(t=>{
  if(!show(PLS,inShot(t,K4,K5)))return;
  const pe=dec(t,K4,K4+0.3);PLS.style.opacity=f3(pe);
  const k=Math.min(3,Math.floor((FQ(t)-K4)/S8+1e-6));plEls.forEach((e,i)=>e.classList.toggle('on',i===k));
});

/* ================= k18-22 the carousel under the dome ================= */
const S6=M.el('div','jp-shot',null,SCN);
const CAR=[...Array(10).keys()].map(i=>({i,el:M.el('div','k-tile m-glass',K.tile(K.TILES[(i+2)%8]),S6)}));
M.track(t=>{
  if(!show(S6,inShot(t,K5,K6)))return;
  const u=t-K5, pe=dec(t,K5,K5+0.6);
  for(const c of CAR){                    // on a wide arc (centre 960,-1300; radius 2250), turning slowly
    const th=90+27.5-c.i*6.1-3*u, r=th*Math.PI/180, x=960+2250*Math.cos(r), y=-1300+2250*Math.sin(r)+(1-pe)*120;
    st(c.el,{opacity:f3(pe),transform:`translate(${f1(x-56)}px,${f1(y-56)}px) rotate(${f2(th-90)}deg) scale(1.75)`});
  }
});
jt({at:K5+0.1,out:K6,y:392,size:66,step:S8,words:['With','every',{t:'system.',g:1}],ar:'مع كل أنظمتك.',arSize:38});

/* ================= k22-24 the bright lens ================= */
jt({at:K6+0.02,out:K7,y:420,size:88,cls:'dark',step:S16,words:['From','your','own','numbers.'],ar:'مبنية على أرقامك — بلا اختلاق.',arSize:42});

/* ================= k24-28 decide: the Decisions card in perspective; the cursor clicks «موافقة» ================= */
const S8s=M.el('div','jp-shot',null,SCN), D8=M.el('div','jp-3d',null,S8s);
const td=document.createElement('div');td.innerHTML=SK.decContent({id:'jpDec'});
const dcard=td.querySelector('#decCard'),toast=td.querySelector('#toast'),btn=dcard.querySelector('#btnOK');
[dcard,toast].forEach(e=>{e.removeAttribute('id');st(e,{position:'absolute',left:'0',top:'0',right:'auto',width:'1402px',height:'214px'});});
toast.style.display='flex';
const DW=M.el('div','jp-dec',null,D8);M.el('div','site m-site',null,DW).append(dcard,toast);
const CUR=M.el('div','jp-cur',`<svg viewBox="0 0 32 32" width="54" height="54"><path d="M6 3 L26 17 L16.6 18.6 L21.4 28.2 L17.6 30 L12.8 20.4 L6 26 Z" fill="#fff" stroke="#140B24" stroke-width="1.6" stroke-linejoin="round"/></svg>`,S8s);
const DS=0.96, DC={x:960,y:650}, OKB={x:DC.x+(1402-36-80-701)*DS,y:DC.y+(138+28-107)*DS}, T_FLAT=B(25.6), T_CL=B(26);
M.track(t=>{
  if(!show(S8s,inShot(t,K7,K8)))return;
  const pf=io(t,K7,T_FLAT), pe=dec(t,K7,K7+0.45);
  st(DW,{opacity:f3(pe),transform:`translate3d(${f1(DC.x-701)}px,${f1(DC.y-107+(1-pf)*60)}px,${f1(-120*(1-pf))}px) rotateX(${f2(26*(1-pf))}deg) rotateY(${f2(-16*(1-pf))}deg) scale(${f3(DS*(1+0.02*P(t,T_CL,K8)))})`});
  const pk=dec(t,T_CL+0.05,T_CL+0.4);dcard.style.opacity=f3(1-pk);toast.style.opacity=f3(pk);
  const press=Math.sin(Math.PI*P(t,T_CL-0.05,T_CL+0.18));btn.style.transform=`scale(${f3(1-0.05*press)})`;
  const pm=io(t,B(24.6),T_CL-0.08), out=io(t,T_CL+0.55,T_CL+1.1);
  st(CUR,{opacity:f3(dec(t,B(24.6),B(24.6)+0.3)*(1-out)),transform:`translate(${f1(lerp(1560,OKB.x,pm)+120*out-6)}px,${f1(lerp(1000,OKB.y,pm)+90*out-3)}px) scale(${f3(1-0.12*press)})`});
});
jt({at:K7+0.1,out:K8,y:250,size:64,step:S16,words:['Decision','to',{t:'action.',g:1}],ar:'من القرار إلى التنفيذ.',arSize:36});

/* ================= k28-32 rings ================= */
jt({at:K8+0.02,out:K9,y:436,size:84,words:['Sovereign.'],ar:'بنية تحتية سيادية.',arSize:42});
jt({at:K9+0.02,out:K10,y:436,size:84,words:['PDPL-compliant.'],ar:'متوافق مع نظام حماية البيانات الشخصية.',arSize:42});

/* ================= k32-34 «بالعربية», huge ================= */
const BG11=M.el('div','jbig',`<span class="a g">بالعربية</span><span class="a w">بالعربية</span><span class="s">Ask in Arabic.</span>`,TXT);
const bG=BG11.querySelector('.a.g'), bW=BG11.querySelector('.a.w'), bS=BG11.querySelector('.s');
let BW=0;
M.track(t=>{
  if(!show(BG11,inShot(t,K10,K11)))return;
  if(!BW)BW=bW.offsetWidth;
  const pa=dec(t,K10+0.02,K10+0.45), pw=io(t,B(32.9),B(33.4)), ps=dec(t,B(32.6),B(32.6)+0.4);
  bG.style.opacity=f3(pa);bG.style.filter=pa<1?`blur(${f2((1-pa)*14)}px)`:'none';bG.style.transform=`translateX(${f1(40*(1-pa))}px)`;
  bW.style.opacity=f3(pw);
  st(bS,{left:f1(1920-170-BW+10)+'px',top:'700px',opacity:f3(ps),filter:ps<1?`blur(${f2((1-ps)*10)}px)`:'none'});
});

/* ================= k34-38 the line, held through the silence ================= */
jt({at:K11+0.02,out:K12,y:352,size:92,step:S16,words:['One','operational','\n','nervous',{t:'system.',g:1}],ar:'جهاز عصبي تشغيلي واحد لشركتك.',arSize:44});

/* ================= k38-46 two lenses join; the capsule; the mark ================= */
jt({at:K12+0.3,out:K13+0.2,y:478,size:50,step:S16,words:['Book','your','demo.'],ar:'احجز عرضك التجريبي.',arSize:34,fade:[B(40.2),B(40.9)]});
const CAP=M.el('div','jcap','<span>marsadnasl.com</span>',TXT), capT=CAP.firstChild;
const MK=M.el('img','jmk',null,TXT);MK.src='assets_logo_m.png';
const BOOK=M.el('div','jbook',`<span>Book your demo</span><span class="sep">·</span><span class="ar">احجز عرضك التجريبي</span>`,TXT);
const FTR=M.el('div','jft','NASL TECHNOLOGIES&nbsp;&nbsp;·&nbsp;&nbsp;RIYADH',TXT);
M.track(t=>{
  const on=t>=B(40.3);[CAP,MK,BOOK,FTR].forEach(e=>show(e,on));if(!on)return;
  const pc=dec(t,B(40.3),K13+0.6), w=lerp(1180,760,pc), h=lerp(330,150,pc), cy=lerp(540,560,dec(t,B(42),B(43)));
  st(CAP,{width:f1(w)+'px',height:f1(h)+'px',transform:`translate(${f1(960-w/2)}px,${f1(cy-h/2)}px)`,opacity:f3(P(t,B(40.3),B(40.9)))});
  const pt=dec(t,K13,K13+0.5);st(capT,{opacity:f3(pt),filter:pt<1?`blur(${f2((1-pt)*8)}px)`:'none'});
  const pm=dec(t,B(42),B(42)+0.7);st(MK,{opacity:f3(pm),transform:`translate(865px,${f1(262+(1-pm)*16)}px) scale(${f3(0.92+0.08*pm)})`});
  const pb=dec(t,B(42.75),B(42.75)+0.6);st(BOOK,{top:'700px',opacity:f3(pb),transform:`translateY(${f1((1-pb)*14)}px)`});
  st(FTR,{opacity:f3(0.55*dec(t,B(43.5),B(43.5)+0.7))});
});
M.punch(K2,{amp:0.012});
M.punch(K12,{amp:0.015});
M.start();
