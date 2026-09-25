/* ================= IGNITION — the S3 logo reveal, built on the downbeat (vbeat 12 = 11.573) ================= */
const IGN=vbeat(12), IGN_K=1.55;                       // K: the M is 1.55× its old size (120px → ~186px)
const RB=[],SPK=[];
{const R=mulberry(2024),g=$('burst'),NS='http://www.w3.org/2000/svg';
 for(let i=0;i<18;i++){const l=document.createElementNS(NS,'line');const a=i/18*Math.PI*2+(R()-0.5)*0.12;
   l.setAttribute('stroke',i%2?'#DE0DFF':'#8E32C3');l.setAttribute('stroke-linecap','round');l.setAttribute('opacity','0');g.appendChild(l);
   RB.push({el:l,a,len:0.7+R()*0.6,sp:0.8+R()*0.4});}
 for(let i=0;i<30;i++){const c=document.createElementNS(NS,'circle');c.setAttribute('fill',i%3?'#BC59D1':'#DE0DFF');c.setAttribute('opacity','0');g.appendChild(c);
   SPK.push({el:c,a:R()*Math.PI*2,v:360+R()*520,r:1.8+R()*2.8,life:0.7+R()*0.5});}}
function ignition(t){
  const on=t>=IGN-0.25&&t<T.s4[0]+0.95;
  ['shock1','shock2','mGlint','odots'].forEach(id=>showS($(id),on));
  if(!on){$('burst').setAttribute('opacity',0);return;}
  $('burst').setAttribute('opacity',1);
  // ---- shockwaves (behind the M)
  [[ 'shock1',IGN,0.75,660,3.2,0.95],['shock2',IGN+0.12,0.8,430,2.2,0.6]].forEach(([id,t0,d,R,w,o])=>{
    const p=P(t,t0,t0+d),e=$(id);if(p<=0||p>=1){e.style.opacity=0;return;}
    const r=70+R*ez.outC(p);st(e,{left:(960-r)+'px',top:(540-r)+'px',width:2*r+'px',height:2*r+'px',borderWidth:(w*(1-p)+0.6)+'px',opacity:o*(1-p)**1.3});});
  // ---- light rays + sparks
  RB.forEach(b=>{const p=P(t,IGN,IGN+0.55*b.sp);if(p<=0||p>=1){b.el.setAttribute('opacity',0);return;}
    const e=ez.outC(p),r0=100+540*e*b.sp,L=(170*b.len)*(1-p)+8;
    b.el.setAttribute('x1',960+Math.cos(b.a)*r0);b.el.setAttribute('y1',540+Math.sin(b.a)*r0);
    b.el.setAttribute('x2',960+Math.cos(b.a)*(r0+L));b.el.setAttribute('y2',540+Math.sin(b.a)*(r0+L));
    b.el.setAttribute('stroke-width',(3.2*(1-p)+0.8).toFixed(2));b.el.setAttribute('opacity',(0.95*(1-p)**1.4).toFixed(3));});
  SPK.forEach(s=>{const p=P(t,IGN+0.02,IGN+0.02+s.life);if(p<=0||p>=1){s.el.setAttribute('opacity',0);return;}
    const d=95+s.v*ez.outC(p);s.el.setAttribute('cx',960+Math.cos(s.a)*d);s.el.setAttribute('cy',540+Math.sin(s.a)*d+30*p*p);
    s.el.setAttribute('r',(s.r*(1-0.5*p)).toFixed(2));s.el.setAttribute('opacity',(0.9*(1-p)**1.2).toFixed(3));});
  // ---- the M: scale-in with overshoot, then a slow push that never stops
  const m=$('orbM');let sc,op,bl=0;
  const bk=[vbeat(13),vbeat(14)].reduce((a,b)=>a+(t>=b?Math.exp(-(t-b)/0.14):0),0);   // kick on each beat of the hold
  if(t<IGN-0.08){sc=0.35;op=0;}
  else if(t<IGN+0.14){const q=P(t,IGN-0.08,IGN+0.14);sc=0.35+0.85*ez.outC(q);op=Math.min(1,q*2.2);bl=5*(1-q);}
  else if(t<IGN+0.55){sc=1.20-0.20*ez.ioC(P(t,IGN+0.14,IGN+0.55));op=1;}
  else if(t<T.s3[1]){sc=(1.0+0.07*ez.sin(P(t,IGN+0.55,T.s3[1])))*(1+0.04*bk);op=1;}
  else {const q=ez.prem(P(t,T.s4[0],T.s4[0]+0.8));sc=1.07+0.06*q;op=1-q;}
  const beatGlow=[vbeat(13),vbeat(14)].reduce((a,b)=>a+(t>=b?Math.exp(-(t-b)/0.22):0),0);
  const g=18+26*Math.exp(-Math.max(0,t-IGN)/0.28)*(t>=IGN?1:0)+12*beatGlow;
  const tf=`translate(-50%,-52%) scale(${(sc*IGN_K).toFixed(4)})`;
  st(m,{opacity:op,transform:tf,filter:`blur(${bl.toFixed(2)}px) drop-shadow(0 0 ${g.toFixed(1)}px rgba(188,89,209,0.78)) drop-shadow(0 0 ${(g*2.4).toFixed(1)}px rgba(142,50,195,0.45))`});
  // ---- glint: a light band sweeps across the logo
  const gp=P(t,IGN+0.62,IGN+1.22);
  st($('mGlint'),{left:m.style.left,top:m.style.top,transform:tf,opacity:(gp>0&&gp<1?Math.sin(Math.PI*gp)*op:0),backgroundPosition:`${(110-120*ez.ioC(gp)).toFixed(1)}% 0`});
  // ---- three dots orbiting the mark until the ring takes over
  const oin=ez.prem(P(t,IGN+0.25,IGN+0.7)),oout=1-ez.prem(P(t,T.s3[1]-0.1,T.s3[1]+0.45));
  [...$('odots').children].forEach((d,i)=>{const a=(t-IGN)*2.3+i*2.0944,R=150+10*Math.sin(t*3+i)+26*bk;
    st(d,{left:(960+Math.cos(a)*R-4)+'px',top:(540+Math.sin(a)*R*0.92-4)+'px',opacity:oin*oout*0.95});});
}

