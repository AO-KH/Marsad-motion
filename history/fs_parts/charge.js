/* ================= CHARGE — the S3 build-up: scattered sources spiral in and are absorbed on the beat grid =================
   8ths, then 16ths through the drum roll; the last pair lands together on the downbeat and sets off the ignition. */
const CH0=T.s3[0];
const ABS=[10,10.5,11,11.25,11.5,11.75,12,12].map(k=>vbeat(k)-(k===12?0.012:0));
const ABS_ORDER=[0,4,2,6,1,5,3,7];                       // tile absorbed at ABS[j]: alternating sides
const FL=ABS_ORDER.map((ti,j)=>{const h=tileHome[ti],th0=Math.atan2(h.vy,h.vx);
  const k0=Math.min(1050/(Math.abs(Math.cos(th0))*1100+1e-6),630/(Math.abs(Math.sin(th0))*640+1e-6));
  const ts=CH0-0.2+0.05*j, D=ABS[j]-ts;             // already entering from the edges as the camera comes through
  return {ti,ts,ta:ABS[j],D,th0,k0:Math.max(1,k0),tw:0.9+0.55*D};});
function flPos(f,u){const r=f.k0*Math.pow(1-u,0.75),th=f.th0+f.tw*Math.pow(u,1.3);
  return [960+Math.cos(th)*1100*r,540+Math.sin(th)*640*r];}
const NS_SVG='http://www.w3.org/2000/svg', TRL=[], STK=[];
{const g=$('trails');
 FL.forEach(()=>{const segs=[];for(let k=0;k<7;k++){const l=document.createElementNS(NS_SVG,'line');
   l.setAttribute('stroke',k<2?'#DE0DFF':'#BC59D1');l.setAttribute('stroke-linecap','round');g.appendChild(l);segs.push(l);}TRL.push(segs);});
 const R=mulberry(515),s=$('streaks');
 for(let i=0;i<30;i++){const l=document.createElementNS(NS_SVG,'line');l.setAttribute('stroke-linecap','round');
   l.setAttribute('stroke',['#BC59D1','#DE0DFF','#8E32C3'][i%3]);s.appendChild(l);
   STK.push({el:l,s:CH0+0.02+(IGN-0.45-CH0-0.02)*Math.pow(i/29,0.8)+R()*0.04,a:R()*Math.PI*2,R0:560+R()*420,len:0.6+R()*0.6,w:1.3+R()*1.5});}}
const absorbed=t=>ABS.reduce((n,ta)=>n+(t>=ta?Math.min(1.08,ez.outC(P(t,ta,ta+0.2))*1.08-0.08*P(t,ta+0.2,ta+0.36)):0),0);
const absKick=t=>ABS.reduce((a,ta)=>a+(t>=ta?Math.exp(-(t-ta)/0.11):0),0);
/* flight of the returning tiles (replaces the old one-by-one ease-in, which kept them off-screen most of the time) */
function chargeTiles(t){
  FL.forEach((f,j)=>{const e=tile3Els[f.ti],segs=TRL[j];
    if(t<f.ts||t>=f.ta){e.style.opacity=0;segs.forEach(l=>l.setAttribute('opacity',0));return;}
    const u=(t-f.ts)/f.D,[x,y]=flPos(f,u),sc=1-0.74*Math.pow(u,2.2);
    st(e,{left:(x-56)+'px',top:(y-56)+'px',opacity:Math.min(1,(1-u)*16),
      transform:`rotate(${(tileHome[f.ti].ro*(1-u)+22*u*u).toFixed(2)}deg) scale(${sc.toFixed(4)})`});
    // light trail behind the tile, longer as it speeds up
    segs.forEach((l,k)=>{const ua=u-k*0.03,ub=u-(k+1)*0.03;
      if(ub<0){l.setAttribute('opacity',0);return;}
      const [xa,ya]=flPos(f,ua),[xb,yb]=flPos(f,ub);
      l.setAttribute('x1',xa.toFixed(1));l.setAttribute('y1',ya.toFixed(1));l.setAttribute('x2',xb.toFixed(1));l.setAttribute('y2',yb.toFixed(1));
      l.setAttribute('stroke-width',((7-k)/7*6*sc+0.6).toFixed(2));
      l.setAttribute('opacity',(0.62*(1-k/7)*Math.min(1,u*6)*Math.min(1,(1-u)*16)).toFixed(3));});
  });
}
function charge(t){
  const on=t>=CH0-0.01&&t<T.s4[0]+0.9; showS($('chargeG'),on); if(!on)return;
  // ---- energy streaks pulled into the orb (all spent before the hit)
  STK.forEach(s=>{const u=P(t,s.s,s.s+0.42);if(u<=0||u>=1){s.el.setAttribute('opacity',0);return;}
    const r=s.R0*(1-Math.pow(u,1.6))+44,L=s.len*(40+170*u);
    const c=Math.cos(s.a),sn=Math.sin(s.a);
    s.el.setAttribute('x1',(960+c*r*1.3).toFixed(1));s.el.setAttribute('y1',(540+sn*r*0.8).toFixed(1));
    s.el.setAttribute('x2',(960+c*(r+L)*1.3).toFixed(1));s.el.setAttribute('y2',(540+sn*(r+L)*0.8).toFixed(1));
    s.el.setAttribute('stroke-width',(s.w*(1-0.4*u)).toFixed(2));s.el.setAttribute('opacity',(0.62*Math.pow(Math.sin(Math.PI*u),0.8)).toFixed(3));});
  // ---- charge ring: fills a step on every absorb, spins faster toward the hit, then blasts outward with the shockwave
  const n=absorbed(t),kk=absKick(t),D=Math.max(0,t-9.85),ang=1.4*D+1.6*Math.pow(D,2.2);
  const rin=ez.outC(P(t,9.62,10.1)),blast=P(t,IGN,IGN+0.34),bo=Math.pow(1-blast,1.5)*(t<IGN+0.34?1:0);
  const A=$('chgA'),B=$('chgB');
  const ra=(104+9*Math.min(kk,1.5))*(1+2.3*ez.outC(blast)),rb=(134+5*Math.min(kk,1.5))*(1+1.9*ez.outC(blast));
  const ca=2*Math.PI*ra,cb=2*Math.PI*rb,f=clamp(0.07+0.93*n/8,0,1);
  A.setAttribute('r',ra.toFixed(2));A.setAttribute('stroke-dasharray',`${(ca*f).toFixed(1)} ${(ca*(1-f)+0.01).toFixed(1)}`);
  A.setAttribute('stroke-dashoffset',(-(ang/(2*Math.PI))*ca).toFixed(1));A.setAttribute('stroke-width',(3.2*(1-blast)+0.6).toFixed(2));
  A.setAttribute('opacity',(0.95*rin*bo).toFixed(3));
  B.setAttribute('r',rb.toFixed(2));B.setAttribute('stroke-dasharray',`${(cb/40*0.34).toFixed(2)} ${(cb/40*0.66).toFixed(2)}`);
  B.setAttribute('stroke-dashoffset',((ang*0.55/(2*Math.PI))*cb).toFixed(1));B.setAttribute('opacity',(0.55*rin*bo).toFixed(3));
  // ---- ripples: one per absorb, and a wider one on each beat of the hold
  const EV=ABS.slice(0,6).map(ta=>[ta,62,170,2.6,0.75]).concat([[vbeat(13),120,300,2.2,0.55],[vbeat(14),120,300,2.2,0.55]]);
  const slot=[null,null,null];
  EV.forEach((ev,i)=>{if(t>=ev[0]&&t<ev[0]+0.45)slot[i%3]=ev;});
  slot.forEach((ev,i)=>{const c=$('rip'+i);if(!ev){c.setAttribute('opacity',0);return;}
    const q=P(t,ev[0],ev[0]+0.45);c.setAttribute('r',(ev[1]+(ev[2]-ev[1])*ez.outC(q)).toFixed(1));
    c.setAttribute('stroke-width',(ev[3]*(1-q)+0.4).toFixed(2));c.setAttribute('opacity',(ev[4]*Math.pow(1-q,1.4)).toFixed(3));});
  // ---- orb core: grows with every absorb, kicks on each one, trembles as it nears the hit, then settles behind the M
  let s;
  if(t<IGN){const cp=P(t,9.85,IGN);s=(0.34+0.075*n)*(1+0.22*Math.min(kk,1.6)+0.04*Math.sin(2*Math.PI*9*t)*cp*cp);}
  else if(t<T.s3[1]){s=lerp(0.94,0.58,ez.outC(P(t,IGN,IGN+0.6)))*(1+0.45*Math.exp(-(t-IGN)/0.15));}
  else {s=0.58*(1-0.8*ez.prem(P(t,T.s4[0],T.s4[0]+0.8)));}
  $('orb').style.transform=`scale(${s.toFixed(4)})`;
}
