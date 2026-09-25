function scene2(t){
  const on=t>=T.s2[0]-0.01&&t<T.s2[1]+0.01; showS($('s2'),on); if(!on)return;
  const a=T.s2[0];
  const pIn=enter($('chatCard'),t,a,0.6,30);
  $('chatCard').style.transform+=` scale(${0.985+0.015*pIn})`;
  const tB=vbeat(1.5), tT=vbeat(2.5);                       // the question pops on the 2+, typing starts on the 3+
  const pB=ez.emph(P(t,tB,tB+0.45));
  st($('qBubble'),{opacity:pB,transform:`translateY(${(1-pB)*16}px) scale(${0.96+0.04*pB})`});
  const pT=ez.dec(P(t,tT,tT+0.4));
  st($('typing'),{opacity:pT});
  // typing dots: one wave per beat
  const kb=kOf(t);
  [...$('typing').children].forEach((d,i)=>{
    const ph=(((kb-i*0.25)%1)+1)%1;
    const k=Math.max(0,Math.sin(ph*Math.PI));
    st(d,{opacity:0.35+0.65*k,transform:`translateY(${-k*7}px)`});
  });
  // the wait counter steps on every beat
  const ticks=t>=vbeat(3)?Math.floor(kb-3)+1:0;
  $('waitRow').textContent='WAITING · 00:'+(47+ticks);
  const tk=ticks>0?Math.exp(-sinceBeat(t)/0.12):0;
  st($('waitRow'),{opacity:pT*(0.8+0.2*tk)});
  st($('waitBar'),{opacity:pT});
  st($('waitFill'),{width:(P(t,tT,T.s2[1])*628)+'px'});
  enter($('k2'),t,vbeat(3.5),0.6,16);
  enter($('c2en'),t,vbeat(4),0.65); enter($('c2ar'),t,vbeat(4.5),0.65);
  if(t>T.s2[1]-0.45){const p=ez.inC(P(t,T.s2[1]-0.45,T.s2[1]));
    st($('chatCard'),{opacity:1-p,transform:`translateY(${-p*10}px) scale(${1-0.02*p})`});
    st($('c2en'),{opacity:1-p});st($('c2ar'),{opacity:1-p});st($('k2'),{opacity:(1-p)*0.9});}
}

function scene4(t){
  const on=t>=T.s4[0]-0.01&&t<T.s5[1]; showS($('s4'),on);
  if(!on){$('loopRing').setAttribute('opacity',0);$('loopGlowArc').setAttribute('opacity',0);return;}
  const a=T.s4[0];
  const R=240;
  const grow=ez.outE(P(t,a,a+0.85));
  const inS5=t>=T.s5[0];
  const recede=inS5?ez.prem(P(t,T.s5[0],T.s5[0]+0.9)):0;
  const r=R*grow*(1+recede*1.5);
  const op=(t<T.s5[0])?grow: Math.max(0,1-recede*2.2);
  const ring=$('loopRing');
  ring.setAttribute('r',Math.max(r,0.1));
  ring.setAttribute('opacity',clamp(op,0,1)*0.9);
  // travelling glow arc: one lap per bar, its head reaches the top node on every downbeat
  const arc=$('loopGlowArc');
  if(t<T.s5[0]+0.9){
    const f=((((kOf(t)%4)+4)%4)/4+0.91)%1;
    const circ=2*Math.PI*Math.max(r,0.1);
    arc.setAttribute('r',Math.max(r,0.1));
    arc.setAttribute('stroke-dasharray',`${circ*0.09} ${circ*0.91}`);
    arc.setAttribute('stroke-dashoffset',-f*circ + circ*0.25);
    arc.setAttribute('opacity',clamp(op,0,1)*0.85*(inS5?(1-recede):1));
  } else arc.setAttribute('opacity',0);
  // nodes clockwise: top,right,bottom,left — each lands with its word (Connect · Unify · Monitor · Act)
  const NA=[-90,0,90,180], NK=[16,17.5,19,20];
  NA.forEach((deg,i)=>{
    const t0=vbeat(NK[i]);
    const ig=ez.emph(P(t,t0,t0+0.45));
    const rad=deg*Math.PI/180;
    const x=960+Math.cos(rad)*r*(inS5?1+recede*1.5:1),y=540+Math.sin(rad)*r*(inS5?1+recede*1.5:1);
    const n=$('n'+i),l=$('l'+i);
    st(n,{left:(x-11)+'px',top:(y-11)+'px',opacity:ig*op,transform:`scale(${0.4+0.63*ig})`});
    const ly=y+(deg===-90?-104:(deg===90?50:-32));
    const lx=x+(deg===0?192:(deg===180?-192:0));
    const yield_=(deg===90)?(1-0.92*ez.prem(P(t,vbeat(21.5),vbeat(22.25)))):1;
    st(l,{left:lx+'px',top:ly+'px',opacity:ig*(inS5?(1-recede):1)*yield_,transform:`translateY(${(1-ig)*10}px)`});
    // once landed, a node kicks as the arc passes it — one node per beat
    if(ig>=1&&!inS5){const q=sinceBeat(t,4,i);n.style.transform=`scale(${1+0.24*Math.exp(-q/0.16)})`;}
  });
  enter($('k4'),t,vbeat(21.5),0.6,16);
  enter($('c4en'),t,vbeat(22),0.6); enter($('c4ar'),t,vbeat(22.5),0.6);
  if(inS5){const p=ez.inC(P(t,T.s5[0],T.s5[0]+0.4));st($('c4en'),{opacity:1-p});st($('c4ar'),{opacity:1-p});st($('k4'),{opacity:(1-p)*0.9});}
}

function scene5(t){
  const on=t>=T.s5[0]-0.01&&t<T.s5[1]+0.02; showS($('s5'),on);
  if(!on){edgeEls.forEach(l=>l.setAttribute('opacity',0));spokeEls.forEach(l=>l.setAttribute('opacity',0));return;}
  // contract everything at end (match-cut into the app's loading spinner)
  const con=ez.inC(P(t,T.s5[1]-0.55,T.s5[1]));
  const cs=1-con*0.94;
  // source chips fly in on 16ths from the whip beat
  chipEls.forEach((e,i)=>{
    const c=CHIPS[i];
    const t0=vbeat(26)+i*S16,t1=t0+0.85;
    const p=ez.dec(P(t,t0,t1));
    const x=lerp(c[1],c[3],p),y=lerp(c[2],c[4],p);
    const die=ez.prem(P(t,t1+0.95,t1+1.3)); // hold ~1s, then morph into the node
    const nx=960+(x-960)*cs,ny=540+(y-540)*cs;
    st(e,{left:nx+'px',top:ny+'px',opacity:(t>=t0?1:0)*(1-die),
      transform:`translate(-50%,-50%) scale(${(0.9+0.1*p-0.2*die)*cs})`});
  });
  // graph objects pop on 16ths from beat 2
  gnEls.forEach((e,i)=>{
    const n=GN[i];
    const t0=vbeat(29)+i*S16;
    const p=ez.emph(P(t,t0,t0+0.5));
    const nx=960+(n[2]-960)*cs,ny=540+(n[3]-540)*cs;
    const breathe=1+0.02*Math.sin(t*1.7+i*1.3);
    st(e,{left:nx+'px',top:ny+'px',opacity:p,transform:`translate(-50%,-50%) scale(${(0.75+0.25*p)*breathe*cs})`});
  });
  // the site's link types draw on 8ths, each label lands on the next 8th
  edgeEls.forEach((l,i)=>{
    const t0=vbeat(30.5)+i*S8;
    const p=ez.dec(P(t,t0,t0+0.5));
    l.setAttribute('stroke-dashoffset',l.dataset.len*(1-p));
    l.setAttribute('opacity',p*0.95*(1-con));
    const pa=GN[EDGE_PAIRS[i][0]],pb=GN[EDGE_PAIRS[i][1]];
    const x1=960+(pa[2]-960)*cs,y1=540+(pa[3]-540)*cs,x2=960+(pb[2]-960)*cs,y2=540+(pb[3]-540)*cs;
    l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);
    const pl=ez.dec(P(t,t0+S8,t0+S8+0.4));
    const fr=EDGE_PAIRS[i][3]??0.5;
    st(elblEls[i],{left:(x1+(x2-x1)*fr)+'px',top:(y1+(y2-y1)*fr)+'px',opacity:pl*(1-con),
      transform:`translate(-50%,-50%) scale(${(0.9+0.1*pl)*cs})`});
  });
  // Marsad hub lands on beat 2, then every object connects into it on 16ths
  const tH=vbeat(33), hub=ez.emph(P(t,tH,tH+0.5));
  st($('hubM'),{opacity:hub,transform:`translate(-50%,-50%) scale(${(0.55+0.45*hub)*cs*(1+0.03*(hub>=1?beatPulse(t):0))})`});
  spokeEls.forEach((l,i)=>{
    const t0=vbeat(33.5)+i*S16;
    const p=ez.dec(P(t,t0,t0+0.45));
    l.setAttribute('stroke-dashoffset',l.dataset.len*(1-p));
    l.setAttribute('opacity',p*0.7*(1-con*0.6));
    const pa=GN[i];
    l.setAttribute('x1',960+(pa[2]-960)*cs);l.setAttribute('y1',540+(pa[3]-540)*cs);
  });
  enter($('c5en'),t,vbeat(33.5),0.6); enter($('c5ar'),t,vbeat(34),0.6);
  if(con>0){st($('c5en'),{opacity:1-con});st($('c5ar'),{opacity:1-con});}
}

function sceneUI(t){
  const on=t>=T.s6[0]-0.01&&t<T.s7[1]+0.02; showS($('s67'),on);
  if(!on){$('spin2').setAttribute('opacity',0);return;}
  const a=T.s6[0], b=T.s7[0];
  {const ba=((kOf(t)/8*360)%360)+'deg';$('uiBeam').style.setProperty('--ba',ba);$('uiBeamS').style.setProperty('--ba',ba);}   // one lap per two bars
  // spinner lands from the S5 contraction: the app is loading
  const spin=$('spin2');
  if(t<a+1.35){
    const p=ez.prem(P(t,a-0.1,a+0.25));
    const die=ez.prem(P(t,a+1.0,a+1.35));
    const circ=2*Math.PI*26;
    spin.setAttribute('stroke-dasharray',`${circ*0.3} ${circ*0.7}`);
    spin.setAttribute('stroke-dashoffset',-t*260);
    spin.setAttribute('opacity',p*(1-die));
  } else spin.setAttribute('opacity',0);
  // window arrives on the spin beat
  const pF=ez.dec(P(t,vbeat(37),vbeat(37)+0.65));
  st($('uiWrap'),{opacity:pF,transform:`translateY(${(1-pF)*34}px) scale(${0.975+0.025*pF})`});
  const pTag=ez.dec(P(t,vbeat(38),vbeat(38)+0.45));
  st($('uiTag'),{opacity:pTag*0.9});
  $('uiTag').textContent=(t<b)?'MARSAD · WEB APP · BUSINESS PULSE · نبض الأعمال':'MARSAD · WEB APP · DECISIONS · القرارات';
  // tab row staggers in with the app shell (right to left, reading order)
  tabEls67.forEach((e,i)=>{const p=ez.dec(P(t,vbeat(37.75)+i*0.045,vbeat(37.75)+0.35+i*0.045));
    st(e,{opacity:p,transform:`translateY(${(1-p)*8}px)`});});
  // active-tab underline travels نبض الأعمال → القرارات on the page switch
  const sw=ez.prem(P(t,b,b+0.35));
  const ulIn=ez.dec(P(t,vbeat(38.25),vbeat(38.25)+0.35));
  st(ulEl,{left:lerp(UL_P[0],UL_D[0],sw)+'px',width:lerp(UL_P[1],UL_D[1],sw)+'px',opacity:ulIn});
  tabPulse.classList.toggle('on',sw<0.5); tabDec.classList.toggle('on',sw>=0.5);
  const inS7=t>=b;
  if(!inS7){
    /* ---- نبض الأعمال ---- */
    show($('pgPulse'),true);show($('pgDec'),false);st($('pgPulse'),{opacity:1});
    st(sideDec,{opacity:0});
    st($('cursor'),{opacity:0});show($('rip'),false);
    const pH=ez.dec(P(t,vbeat(39),vbeat(39)+0.6));
    st($('pulseHead'),{opacity:pH,transform:`translateY(${(1-pH)*18}px)`});
    const pBt=ez.emph(P(t,vbeat(39.5),vbeat(39.5)+0.5));
    st($('genBtn'),{opacity:pBt,transform:`scale(${0.92+0.08*pBt})`});
    const pAd=ez.dec(P(t,vbeat(39.75),vbeat(39.75)+0.5));
    st($('advCard'),{opacity:pAd,transform:`translateY(${(1-pAd)*22}px)`});
    recEls.forEach((e,i)=>{const p=ez.dec(P(t,vbeat(40)+i*S16,vbeat(40)+0.6+i*S16));
      st(e,{opacity:p,transform:`translateY(${(1-p)*22}px)`});});
    enter($('c6en'),t,vbeat(40.5),0.6); enter($('c6ar'),t,vbeat(41),0.6);
  } else {
    /* ---- القرارات ---- */
    st($('c6en'),{opacity:1-sw});st($('c6ar'),{opacity:1-sw});
    show($('pgPulse'),sw<0.6);show($('pgDec'),sw>0.35);
    if(sw<0.6)st($('pgPulse'),{opacity:1-sw/0.6});
    st($('pgDec'),{opacity:sw});
    // the decisions page has a section sidebar; slide it in
    const pS=ez.dec(P(t,b+0.05,b+0.45));
    st(sideDec,{opacity:pS,transform:`translateX(${(1-pS)*40}px)`});
    sideItems.forEach((e,i)=>{const p=ez.dec(P(t,b+0.15+i*0.045,b+0.5+i*0.045));
      st(e,{opacity:p,transform:`translateX(${(1-p)*14}px)`});});
    const pH=ez.dec(P(t,vbeat(48),vbeat(48)+0.5));
    st($('decHead'),{opacity:pH,transform:`translateY(${(1-pH)*14}px)`});
    st($('decBtns'),{opacity:pH});
    statEls.forEach((e,i)=>{const k=3-i;const p=ez.emph(P(t,vbeat(48.5)+k*S16,vbeat(48.5)+0.45+k*S16));
      st(e,{opacity:p,transform:`scale(${0.9+0.1*p}) translateY(${(1-p)*10}px)`});});
    const pSg=ez.dec(P(t,vbeat(49.5),vbeat(49.5)+0.35));
    st($('segTabs'),{opacity:pSg,transform:`translateY(${(1-pSg)*10}px)`});
    // list lands, then the top decision lifts forward on beat 4
    const pL=ez.dec(P(t,vbeat(50),vbeat(50)+0.5));
    const fw=ez.dec(P(t,vbeat(51),vbeat(51)+0.6));
    const back=ez.prem(P(t,vbeat(56.5),vbeat(57.25)));          // focus releases once the action is done
    st($('veil'),{opacity:fw*(1-back)});
    const toast=ez.emph(P(t,vbeat(56),vbeat(56)+0.45));
    const lift=1+0.035*fw;
    st($('decCard'),{opacity:pL*(1-ez.prem(P(t,vbeat(55.25),vbeat(55.75)))),
      transform:`translateY(${(1-pL)*22}px) scale(${lift})`,
      boxShadow:`0 ${4+fw*36}px ${10+fw*70}px rgba(60,30,120,${0.04+fw*0.12}), 0 0 ${fw*70}px rgba(142,50,195,${fw*0.42}), 0 0 0 ${fw*1.5}px rgba(142,50,195,${fw*0.35})`});
    show($('decCard'),t<vbeat(55.75)+0.05);
    st($('dec2'),{opacity:pL,transform:`translateY(${(1-pL)*30}px)`});
    show($('toast'),toast>0.01);
    st($('toast'),{opacity:toast,transform:`scale(${(0.94+0.06*toast)*(1+0.035*(1-back))})`,
      boxShadow:`0 ${4+(1-back)*36}px ${10+(1-back)*70}px rgba(11,132,71,${0.05+(1-back)*0.12})`});
    // approve button: hover a 16th before the beat, press on beat 4
    const press=t>=vbeat(55)&&t<vbeat(55.25);
    const cf=P(t,vbeat(55),vbeat(55)+0.3), cfl=(t>=vbeat(55)&&cf<1)?1-cf:0;
    st($('btnOK'),{transform:press?'scale(0.96)':'scale(1)',background:t>=vbeat(54.75)?'#CFEEDD':'#E7F5EE',
      boxShadow:cfl>0?`0 0 0 ${(5*cfl).toFixed(1)}px rgba(11,132,71,${(0.45*cfl).toFixed(2)}), 0 0 ${(28*cfl).toFixed(0)}px rgba(11,132,71,${(0.5*cfl).toFixed(2)})`:''});
    // counts update with the toast on the downbeat
    const upd=t>=vbeat(56), pop=ez.emph(P(t,vbeat(56),vbeat(56)+0.4));
    statEls[3].querySelector('.n').textContent=upd?'5':'6';
    statEls[2].querySelector('.n').textContent=upd?'1':'0';
    [statEls[2],statEls[3]].forEach(e=>{e.querySelector('.n').style.transform=`scale(${upd?1+0.28*(1-pop):1})`;});
    segEls[1].textContent=upd?'قيد المراجعة (5)':'قيد المراجعة (6)';
    segEls[2].textContent=upd?'موافق عليها (1)':'موافق عليها (0)';
    // cursor path in #uiWrap coords: from bottom-right into the موافقة button
    const cp=ez.prem(P(t,vbeat(52),vbeat(54.75)));
    const tgt=btnTarget(lift);
    const sx2=1240,sy2=800,ex2=tgt[0]-3,ey2=tgt[1]-4;
    const cxp=(sx2+ex2)/2+90,cyp=(sy2+ey2)/2+120;
    const cx=(1-cp)*(1-cp)*sx2+2*(1-cp)*cp*cxp+cp*cp*ex2;
    const cy=(1-cp)*(1-cp)*sy2+2*(1-cp)*cp*cyp+cp*cp*ey2;
    st($('cursor'),{left:cx+'px',top:cy+'px',opacity:(cp>0?1:0)*(1-ez.prem(P(t,vbeat(56),vbeat(56.5))))});
    // click ripple centred on the button under the cursor tip
    const rp=P(t,vbeat(55),vbeat(55)+0.5);
    if(rp>0&&rp<1){const rr=(0.28+0.72*ez.outC(rp))*90;
      st($('rip'),{left:(tgt[0]-rr)+'px',top:(tgt[1]-rr)+'px',width:2*rr+'px',height:2*rr+'px',
        opacity:(1-rp)*0.9,borderWidth:(2.5-rp*1.5)+'px'});show($('rip'),true);}
    else show($('rip'),false);
    enter($('c7en'),t,vbeat(56.5),0.55);enter($('c7ar'),t,vbeat(57),0.55);
    // exit
    if(t>T.s7[1]-0.5){const p=ez.inC(P(t,T.s7[1]-0.5,T.s7[1]));
      st($('uiWrap'),{opacity:1-p,transform:`scale(${1-p*0.03})`});
      st($('uiTag'),{opacity:(1-p)*0.9});st($('c7en'),{opacity:1-p});st($('c7ar'),{opacity:1-p});}
  }
}

function scene8(t){
  const on=t>=T.s8[0]-0.01&&t<T.s8[1]+0.02; showS($('s8'),on); if(!on)return;
  const breathe=(t>vbeat(66)&&t<vbeat(67.5))?Math.sin(P(t,vbeat(66),vbeat(67.5))*Math.PI)*0.032:0;
  const bp=beatPulse(t);
  const die=ez.inC(P(t,T.s8[1]-0.45,T.s8[1]));
  // six defence rings snap in on consecutive 8ths from the downbeat, then pulse with the kick
  const ringP=[];
  ringEls.forEach((e,i)=>{
    const t0=vbeat(60)+i*S8;
    const p=ez.emph(P(t,t0,t0+0.22));
    ringP[i]=p;
    st(e,{opacity:p*(1-die)*(0.9-i*0.07),transform:`scale(${(1.16-0.16*p)*(1+breathe+0.012*bp)})`});
  });
  rlblEls.forEach((e,i)=>{st(e,{opacity:ringP[i]*(1-die)*0.85});});
  SENTS.forEach(sd=>{
    const th=sd.ph+t*sd.sp;
    st(sd.el,{left:(CX8+Math.cos(th)*sd.r-3)+'px',top:(CY8+Math.sin(th)*sd.r-3)+'px',
      opacity:ringP[sd.ring]*(1-die)*0.9});
  });
  const R6=86+5*44;
  st($('sweep'),{left:(CX8-R6)+'px',top:(CY8-R6)+'px',width:2*R6+'px',height:2*R6+'px',
    opacity:ringP[5]*(1-die)*0.7,transform:`rotate(${(kOf(t)/16*360).toFixed(2)}deg)`});   // one sweep per four bars
  const pC=ez.emph(P(t,vbeat(59.25),vbeat(59.25)+0.45));
  st($('coreM'),{left:CX8+'px',top:(CY8+1)+'px',
    opacity:pC*(1-die),
    transform:`translate(-50%,-50%) scale(${(0.7+0.3*pC)*(1+breathe+0.02*bp)})`});
  const capP=ez.dec(P(t,vbeat(64),vbeat(64)+0.5));
  st($('gridCap'),{left:(CX8-320)+'px',top:(CY8+R6+30)+'px',opacity:capP*(1-die)});
  shEls.forEach((e,i)=>{
    const t0=vbeat(60)+i*S8+0.06;
    const p=ez.dec(P(t,t0,t0+0.36));
    st(e,{opacity:p*(1-die),transform:`translateX(${(1-p)*22}px)`});
  });
  enter($('c8en'),t,vbeat(66.5),0.6);enter($('c8ar'),t,vbeat(67),0.6);
  if(die>0){st($('c8en'),{opacity:1-die});st($('c8ar'),{opacity:1-die});}
}

function scene9(t){
  const on=t>=T.s9[0]-0.01&&t<T.s9[1]+0.02; showS($('s9'),on); if(!on)return;
  {const ba=((kOf(t)/8*360+140)%360)+'deg';$('chBeam').style.setProperty('--ba',ba);$('chBeamS').style.setProperty('--ba',ba);}
  enter($('askHead'),t,vbeat(70),0.7,26);
  enter($('askSub'),t,vbeat(70.5),0.7,20);
  const pC=enter($('chatPanel'),t,vbeat(71),0.6,26);
  $('chatPanel').style.transform+=` scale(${0.985+0.015*pC})`;
  // typing into the assistant's input: one key per 32nd note from the breakdown downbeat, two characters a key
  const sent=t>=vbeat(74.75);
  const keys=t>=vbeat(72)?Math.floor((t-vbeat(72))/(MB/8))+1:0;
  const nCh=sent?0:clamp(keys*2,0,Q_AR.length);
  $('askQ').textContent=arSub(Q_AR,nCh);
  $('askPh').style.opacity=nCh>0?0:1;
  $('askCaret').style.opacity=(t>=vbeat(71.5)&&!sent&&(((kOf(t)%1)+1)%1)<0.5)?1:0;   // caret blinks on the beat
  // send: disabled lavender → active gradient while there is text → press on the 3+
  const press=t>=vbeat(74.5)&&t<vbeat(74.75);
  st($('sendBtn'),{background:nCh>0?'linear-gradient(90deg,#5F0DB4,#BC59D1)':'#C9A8E6',transform:press?'scale(0.92)':'scale(1)'});
  // the question posts as the user's message
  const pU=ez.dec(P(t,vbeat(74.75),vbeat(74.75)+0.35));
  st($('userMsg'),{opacity:pU,transform:`translateY(${(1-pU)*16}px) scale(${0.98+0.02*pU})`});
  // answer streams one word per 16th
  const pA=ez.dec(P(t,vbeat(75.5),vbeat(75.5)+0.5));
  st($('ansWrap'),{opacity:pA,transform:`translateY(${(1-pA)*20}px)`});
  const nW=t>=vbeat(75.75)?clamp(Math.floor((t-vbeat(75.75))/S16)+1,0,ANS_WORDS.length):0;
  let html='';
  for(let i=0;i<nW;i++){const w=ANS_WORDS[i];
    html+= (w==='§'?`<span class="hl">${ANS_HL}</span>`:w)+' ';}
  $('ansTxt').innerHTML=html;
  st($('ansChip'),{opacity:ez.dec(P(t,vbeat(79.5),vbeat(79.5)+0.5))});
  const die=ez.inC(P(t,T.s9[1]-0.5,T.s9[1]));
  if(die>0)st($('s9'),{opacity:1-die}); else st($('s9'),{opacity:1});
}

function scene10(t){
  const on=t>=T.s10[0]-0.01; showS($('s10'),on); showS($('wallWrap'),on); if(!on)return;
  const a=T.s10[0];                                    // the drop
  // the site's pages, laid out as a tilted wall drifting behind the end card
  const pWall=ez.prem(P(t,a-0.05,a+0.95));
  st($('wall'),{opacity:pWall,
    transform:`perspective(2600px) rotateX(46deg) rotateZ(-22deg) translateY(${-(t-a)*26}px) scale(${1.07-0.07*pWall})`});
  st($('wallVeil'),{opacity:pWall});
  const pM=ez.outE(P(t,a,a+0.9));
  const amb=(1+0.008*Math.sin((t-a)*1.2))*(1+0.014*(pM>=1?beatPulse(t):0));   // the mark kicks with the drums
  st($('endM'),{opacity:pM,transform:`translateY(${(1-pM)*30}px) scale(${(0.82+0.18*pM)*amb})`});
  const pW=ez.dec(P(t,vbeat(82),vbeat(82)+0.7));
  st($('endWord'),{opacity:pW*0.92,transform:`translateY(${(1-pW)*18}px)`});
  enter($('endTag'),t,vbeat(84),0.6);
  enter($('endTagAR'),t,vbeat(84.5),0.6);
  enter($('endCTA'),t,vbeat(86),0.6);
  enter($('endFoot'),t,vbeat(87),0.6);
}
