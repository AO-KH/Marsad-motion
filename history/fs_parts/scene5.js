function scene5(t){
  const on=t>=T.s5[0]-0.01&&t<T.s5[1]+0.02; showS($('s5'),on);
  if(!on){edgeEls.forEach(l=>l.setAttribute('opacity',0));spokeEls.forEach(l=>l.setAttribute('opacity',0));return;}
  const a=T.s5[0];
  // contract everything at end (match-cut into the app's loading spinner)
  const con=ez.inC(P(t,T.s5[1]-0.55,T.s5[1]));
  const cs=1-con*0.94;
  chipEls.forEach((e,i)=>{
    const c=CHIPS[i];
    const t0=a+0.25+i*0.12,t1=t0+0.85;
    const p=ez.prem(P(t,t0,t1));
    const x=lerp(c[1],c[3],p),y=lerp(c[2],c[4],p);
    const die=ez.prem(P(t,t1+0.95,t1+1.3)); // hold ~1s, then morph into the node
    const nx=960+(x-960)*cs,ny=540+(y-540)*cs;
    st(e,{left:nx+'px',top:ny+'px',opacity:(t>=t0?1:0)*(1-die),
      transform:`translate(-50%,-50%) scale(${(0.9+0.1*p-0.2*die)*cs})`});
  });
  gnEls.forEach((e,i)=>{
    const n=GN[i];
    const t0=a+2.05+i*0.16;
    const p=ez.emph(P(t,t0,t0+0.5));
    const nx=960+(n[2]-960)*cs,ny=540+(n[3]-540)*cs;
    const breathe=1+0.02*Math.sin(t*1.7+i*1.3);
    st(e,{left:nx+'px',top:ny+'px',opacity:p,transform:`translate(-50%,-50%) scale(${(0.75+0.25*p)*breathe*cs})`});
  });
  // the site's link types draw on, each followed by its label
  edgeEls.forEach((l,i)=>{
    const t0=a+2.9+i*0.36;
    const p=ez.prem(P(t,t0,t0+0.5));
    l.setAttribute('stroke-dashoffset',l.dataset.len*(1-p));
    l.setAttribute('opacity',p*0.95*(1-con));
    const pa=GN[EDGE_PAIRS[i][0]],pb=GN[EDGE_PAIRS[i][1]];
    const x1=960+(pa[2]-960)*cs,y1=540+(pa[3]-540)*cs,x2=960+(pb[2]-960)*cs,y2=540+(pb[3]-540)*cs;
    l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);
    const pl=ez.prem(P(t,t0+0.35,t0+0.75));
    st(elblEls[i],{left:((x1+x2)/2)+'px',top:((y1+y2)/2)+'px',opacity:pl*(1-con),
      transform:`translate(-50%,-50%) scale(${(0.9+0.1*pl)*cs})`});
  });
  // Marsad hub appears, then every object connects into it
  const hub=ez.emph(P(t,a+4.5,a+5.0));
  st($('hubM'),{opacity:hub,transform:`translate(-50%,-50%) scale(${(0.55+0.45*hub)*cs})`});
  spokeEls.forEach((l,i)=>{
    const t0=a+4.85+i*0.16;
    const p=ez.prem(P(t,t0,t0+0.45));
    l.setAttribute('stroke-dashoffset',l.dataset.len*(1-p));
    l.setAttribute('opacity',p*0.7*(1-con*0.6));
    const pa=GN[i];
    l.setAttribute('x1',960+(pa[2]-960)*cs);l.setAttribute('y1',540+(pa[3]-540)*cs);
  });
  enter($('c5en'),t,a+4.7,0.6); enter($('c5ar'),t,a+4.95,0.6);
  if(con>0){st($('c5en'),{opacity:1-con});st($('c5ar'),{opacity:1-con});}
}

