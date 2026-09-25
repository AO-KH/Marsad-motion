function arSub(s,n){return s.slice(0,n);}
function scene9(t){
  const on=t>=T.s9[0]-0.01&&t<T.s9[1]+0.02; showS($('s9'),on); if(!on)return;
  const a=T.s9[0];
  enter($('askHead'),t,a+0.2,0.7,26);
  enter($('askSub'),t,a+0.45,0.7,20);
  const pC=enter($('chatPanel'),t,a+0.7,0.6,26);
  $('chatPanel').style.transform+=` scale(${0.985+0.015*pC})`;
  // typing into the assistant's input
  const sent=t>=a+3.15;
  const nCh=sent?0:Math.floor(P(t,a+1.1,a+3.0)*Q_AR.length);
  $('askQ').textContent=arSub(Q_AR,nCh);
  $('askPh').style.opacity=nCh>0?0:1;
  $('askCaret').style.opacity=(t>=a+1.0&&!sent&&Math.sin(t*7)>-0.2)?1:0;
  // send: disabled lavender → active gradient while there is text → press
  const press=t>=a+3.02&&t<a+3.16;
  st($('sendBtn'),{background:nCh>0?'linear-gradient(90deg,#5F0DB4,#BC59D1)':'#C9A8E6',transform:press?'scale(0.92)':'scale(1)'});
  // the question posts as the user's message
  const pU=ez.prem(P(t,a+3.15,a+3.5));
  st($('userMsg'),{opacity:pU,transform:`translateY(${(1-pU)*16}px) scale(${0.98+0.02*pU})`});
  // answer streams
  const pA=ez.prem(P(t,a+3.4,a+3.9));
  st($('ansWrap'),{opacity:pA,transform:`translateY(${(1-pA)*20}px)`});
  const nW=Math.floor(P(t,a+3.6,a+6.0)*ANS_WORDS.length);
  let html='';
  for(let i=0;i<nW;i++){const w=ANS_WORDS[i];
    html+= (w==='§'?`<span class="hl">${ANS_HL}</span>`:w)+' ';}
  $('ansTxt').innerHTML=html;
  st($('ansChip'),{opacity:ez.prem(P(t,a+6.1,a+6.6))});
  const die=ez.inC(P(t,T.s9[1]-0.5,T.s9[1]));
  if(die>0)st($('s9'),{opacity:1-die}); else st($('s9'),{opacity:1});
}

