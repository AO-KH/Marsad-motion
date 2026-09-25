function sceneUI(t){
  const on=t>=T.s6[0]-0.01&&t<T.s7[1]+0.02; showS($('s67'),on);
  if(!on){$('spin2').setAttribute('opacity',0);return;}
  const a=T.s6[0], b=T.s7[0];
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
  // window
  const pF=ez.prem(P(t,a+0.15,a+0.8));
  st($('uiWrap'),{opacity:pF,transform:`translateY(${(1-pF)*34}px) scale(${0.975+0.025*pF})`});
  const pTag=ez.prem(P(t,a+0.7,a+1.15));
  st($('uiTag'),{opacity:pTag*0.9});
  $('uiTag').textContent=(t<b)?'MARSAD · WEB APP · BUSINESS PULSE · نبض الأعمال':'MARSAD · WEB APP · DECISIONS · القرارات';
  // tab row staggers in with the app shell (right to left, reading order)
  tabEls67.forEach((e,i)=>{const p=ez.prem(P(t,a+0.6+i*0.045,a+0.95+i*0.045));
    st(e,{opacity:p,transform:`translateY(${(1-p)*8}px)`});});
  // active-tab underline travels نبض الأعمال → القرارات on the page switch
  const sw=ez.prem(P(t,b,b+0.35));
  const ulIn=ez.prem(P(t,a+0.95,a+1.3));
  st(ulEl,{left:lerp(UL_P[0],UL_D[0],sw)+'px',width:lerp(UL_P[1],UL_D[1],sw)+'px',opacity:ulIn});
  tabPulse.classList.toggle('on',sw<0.5); tabDec.classList.toggle('on',sw>=0.5);
  const inS7=t>=b;
  if(!inS7){
    /* ---- نبض الأعمال ---- */
    show($('pgPulse'),true);show($('pgDec'),false);st($('pgPulse'),{opacity:1});
    st(sideDec,{opacity:0});
    st($('cursor'),{opacity:0});show($('rip'),false);
    const pH=ez.prem(P(t,a+1.25,a+1.85));
    st($('pulseHead'),{opacity:pH,transform:`translateY(${(1-pH)*18}px)`});
    const pBt=ez.emph(P(t,a+1.5,a+2.0));
    st($('genBtn'),{opacity:pBt,transform:`scale(${0.92+0.08*pBt})`});
    const pAd=ez.prem(P(t,a+1.6,a+2.1));
    st($('advCard'),{opacity:pAd,transform:`translateY(${(1-pAd)*22}px)`});
    recEls.forEach((e,i)=>{const p=ez.prem(P(t,a+1.75+i*0.14,a+2.35+i*0.14));
      st(e,{opacity:p,transform:`translateY(${(1-p)*22}px)`});});
    enter($('c6en'),t,a+2.2,0.6); enter($('c6ar'),t,a+2.45,0.6);
  } else {
    /* ---- القرارات ---- */
    st($('c6en'),{opacity:1-sw});st($('c6ar'),{opacity:1-sw});
    show($('pgPulse'),sw<0.6);show($('pgDec'),sw>0.35);
    if(sw<0.6)st($('pgPulse'),{opacity:1-sw/0.6});
    st($('pgDec'),{opacity:sw});
    // the decisions page has a section sidebar; slide it in
    const pS=ez.prem(P(t,b+0.05,b+0.45));
    st(sideDec,{opacity:pS,transform:`translateX(${(1-pS)*40}px)`});
    sideItems.forEach((e,i)=>{const p=ez.prem(P(t,b+0.15+i*0.045,b+0.5+i*0.045));
      st(e,{opacity:p,transform:`translateX(${(1-p)*14}px)`});});
    const pH=ez.prem(P(t,b+0.2,b+0.7));
    st($('decHead'),{opacity:pH,transform:`translateY(${(1-pH)*14}px)`});
    st($('decBtns'),{opacity:pH});
    statEls.forEach((e,i)=>{const k=3-i;const p=ez.emph(P(t,b+0.4+k*0.09,b+0.85+k*0.09));
      st(e,{opacity:p,transform:`scale(${0.9+0.1*p}) translateY(${(1-p)*10}px)`});});
    const pSg=ez.prem(P(t,b+0.95,b+1.3));
    st($('segTabs'),{opacity:pSg,transform:`translateY(${(1-pSg)*10}px)`});
    // list lands, then the top decision lifts forward
    const pL=ez.prem(P(t,b+1.2,b+1.7));
    const fw=ez.prem(P(t,b+2.1,b+2.7));
    const back=ez.prem(P(t,b+5.4,b+5.9));          // focus releases once the action is done
    st($('veil'),{opacity:fw*(1-back)});
    const toast=ez.emph(P(t,b+4.85,b+5.3));
    const lift=1+0.035*fw;
    st($('decCard'),{opacity:pL*(1-ez.prem(P(t,b+4.7,b+5.0))),
      transform:`translateY(${(1-pL)*22}px) scale(${lift})`,
      boxShadow:`0 ${4+fw*36}px ${10+fw*70}px rgba(60,30,120,${0.04+fw*0.16})`});
    show($('decCard'),t<b+5.05);
    st($('dec2'),{opacity:pL,transform:`translateY(${(1-pL)*30}px)`});
    show($('toast'),toast>0.01);
    st($('toast'),{opacity:toast,transform:`scale(${(0.94+0.06*toast)*(1+0.035*(1-back))})`,
      boxShadow:`0 ${4+(1-back)*36}px ${10+(1-back)*70}px rgba(11,132,71,${0.05+(1-back)*0.12})`});
    // approve button: hover when the cursor arrives, press on click
    const press=t>=b+4.42&&t<b+4.58;
    st($('btnOK'),{transform:press?'scale(0.96)':'scale(1)',background:t>=b+4.25?'#CFEEDD':'#E7F5EE'});
    // counts update once the action executes
    const upd=t>=b+5.05, pop=ez.emph(P(t,b+5.05,b+5.45));
    statEls[3].querySelector('.n').textContent=upd?'5':'6';
    statEls[2].querySelector('.n').textContent=upd?'1':'0';
    [statEls[2],statEls[3]].forEach(e=>{e.querySelector('.n').style.transform=`scale(${upd?1+0.28*(1-pop):1})`;});
    segEls[1].textContent=upd?'قيد المراجعة (5)':'قيد المراجعة (6)';
    segEls[2].textContent=upd?'موافق عليها (1)':'موافق عليها (0)';
    // cursor path in #uiWrap coords: from bottom-right into the موافقة button
    const cp=ez.prem(P(t,b+2.9,b+4.3));
    const tgt=btnTarget(lift);
    const sx2=1240,sy2=800,ex2=tgt[0]-3,ey2=tgt[1]-4;
    const cxp=(sx2+ex2)/2+90,cyp=(sy2+ey2)/2+120;
    const cx=(1-cp)*(1-cp)*sx2+2*(1-cp)*cp*cxp+cp*cp*ex2;
    const cy=(1-cp)*(1-cp)*sy2+2*(1-cp)*cp*cyp+cp*cp*ey2;
    st($('cursor'),{left:cx+'px',top:cy+'px',opacity:(cp>0?1:0)*(1-ez.prem(P(t,b+5.0,b+5.4)))});
    // click ripple centred on the button under the cursor tip
    const rp=P(t,b+4.45,b+4.95);
    if(rp>0&&rp<1){const rr=ez.outC(rp)*90;
      st($('rip'),{left:(tgt[0]-rr)+'px',top:(tgt[1]-rr)+'px',width:2*rr+'px',height:2*rr+'px',
        opacity:(1-rp)*0.9,borderWidth:(2.5-rp*1.5)+'px'});show($('rip'),true);}
    else show($('rip'),false);
    enter($('c7en'),t,b+5.5,0.55);enter($('c7ar'),t,b+5.75,0.55);
    // exit
    if(t>T.s7[1]-0.5){const p=ez.inC(P(t,T.s7[1]-0.5,T.s7[1]));
      st($('uiWrap'),{opacity:1-p,transform:`scale(${1-p*0.03})`});
      st($('uiTag'),{opacity:(1-p)*0.9});st($('c7en'),{opacity:1-p});st($('c7ar'),{opacity:1-p});}
  }
}

