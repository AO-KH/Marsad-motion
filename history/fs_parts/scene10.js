function scene10(t){
  const on=t>=T.s10[0]-0.01; showS($('s10'),on); showS($('wallWrap'),on); if(!on)return;
  const a=T.s10[0];
  // the site's pages, laid out as a tilted wall drifting behind the end card
  const pWall=ez.prem(P(t,a-0.05,a+0.95));
  st($('wall'),{opacity:pWall,
    transform:`perspective(2600px) rotateX(46deg) rotateZ(-22deg) translateY(${-(t-a)*26}px) scale(${1.07-0.07*pWall})`});
  st($('wallVeil'),{opacity:pWall});
  const pM=ez.outE(P(t,a+0.15,a+1.05));
  const amb=1+0.008*Math.sin((t-a)*1.2);
  st($('endM'),{opacity:pM,transform:`translateY(${(1-pM)*30}px) scale(${(0.82+0.18*pM)*amb})`});
  const pW=ez.prem(P(t,a+1.15,a+1.85));
  st($('endWord'),{opacity:pW*0.92,transform:`translateY(${(1-pW)*18}px)`});
  enter($('endTag'),t,a+2.15,0.6);
  enter($('endTagAR'),t,a+2.4,0.6);
  enter($('endCTA'),t,a+3.15,0.6);
  enter($('endFoot'),t,a+3.7,0.6);
}

