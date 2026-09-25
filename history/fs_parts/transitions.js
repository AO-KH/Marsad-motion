/* ================= TRANSITIONS — camera moves locked to the music's beat grid =================
   Track: SoundSurfer "Stylish", 94 BPM, placed so song bar 1 hits the ignition. Video beat k = 9.0197 + 0.63832*(k-8). */
const MB=0.63832, MK8=9.0197, vbeat=k=>MK8+MB*(k-8);
/* a = seconds of motion before the beat (outgoing scene still visible), b = seconds after (incoming scene building in) */
const TR=[
  {t:vbeat(1),  type:'slide',  dir:-1, a:0.45, b:0.42, amp:110, blur:8},          // S1→S2   intro beat
  {t:vbeat(9),  type:'through',       a:0.46, b:0.50, amp:0.20, blur:6},          // S2→S3   zoom through the orb
  {t:vbeat(12), type:'punch',         d:0.50, amp:0.040},                         // ignition downbeat
  {t:vbeat(16), type:'pullback', t0:13.2, amp:0.10},                              // S3→S4   pull back with the ring, land on the downbeat
  {t:vbeat(26), type:'whip',   dir:-1, a:0.30, b:0.34, amp:240, blur:14, sweep:1},// S4→S5
  {t:vbeat(37), type:'spin',          a:0.50, b:0.55, amp:0.14, rot:7, blur:5},   // S5→S6   contraction into the app
  {t:vbeat(48), type:'nudge',  dir:-1, a:0.22, b:0.26, amp:60,  blur:6, sweep:1}, // page switch (downbeat)
  {t:vbeat(59), type:'out',           a:0.45, b:0.70, amp:0.13, blur:6},          // S7→S8   zoom out into the shield
  {t:vbeat(70), type:'rise',   dir:-1, a:0.60, b:0.50, amp:150, blur:11, sweep:1},// S8→S9
  {t:vbeat(81), type:'reveal',        a:0.45, b:1.00, amp:0.22, blur:7, sweep:1}, // S9→S10  the drop
  {t:57.532+4*MB, type:'punch',       d:0.60, amp:0.015},                         // final hit
];
let CAM={x:0,y:0,s:1,r:0,bx:0,by:0,sw:[]};
function camState(t){
  let x=0,y=0,s=1,r=0,bx=0,by=0;const sw=[];
  for(const e of TR){
    if(e.type==='punch'){const a=P(t,e.t-0.05,e.t),dcy=P(t,e.t,e.t+e.d);if(a>0&&dcy<1)s*=1+e.amp*(dcy>0?1-ez.outC(dcy):ez.outC(a));continue;}
    if(e.type==='pullback'){const p=P(t,e.t0,e.t);if(p>0&&p<1)s*=1+e.amp*(1-ez.outC(p));continue;}
    if(t<e.t-e.a-0.02||t>e.t+e.b+0.02)continue;
    const p1=P(t,e.t-e.a,e.t),p2=P(t,e.t,e.t+e.b),out=t<e.t;
    const k=out?ez.inC(p1):1-ez.outC(p2);            // 0 → 1 at the beat → 0
    const bl=out?p1*p1:(1-p2)*(1-p2);                // blur peaks on the beat
    switch(e.type){
      case 'slide': case 'whip': x+=out?e.dir*e.amp*k:-e.dir*e.amp*k; bx+=e.blur*bl; break;
      case 'nudge': x+=e.dir*e.amp*Math.sin(Math.PI*P(t,e.t-e.a,e.t+e.b))*(out?1:0.6); bx+=e.blur*bl; break;
      case 'rise':  y+=out?e.dir*e.amp*k:-e.dir*e.amp*k; by+=e.blur*bl; break;
      case 'through': s*=out?1+e.amp*k:1-e.amp*0.55*k; bx+=e.blur*bl; by+=e.blur*bl; break;
      case 'out':   s*=out?1-e.amp*0.55*k:1+e.amp*k; bx+=e.blur*bl; by+=e.blur*bl; break;
      case 'spin':  r+=out?-e.rot*k:e.rot*k; s*=out?1+e.amp*k:1+e.amp*0.5*k; bx+=e.blur*bl; by+=e.blur*bl; break;
      case 'reveal':{ if(out){s*=1+0.10*ez.inC(P(t,e.t-e.a,e.t));}
        else {const q=P(t,e.t,e.t+e.b);s*=1+e.amp*(1-ez.outE(q));const b2=(1-q)*(1-q);bx+=e.blur*b2;by+=e.blur*b2;} break;}
    }
    if(e.sweep){const q=P(t,e.t-0.32,e.t+0.32);if(q>0&&q<1)sw.push({q,dir:e.type==='rise'?'v':'h'});}
  }
  return {x,y,s,r,bx,by,sw};
}
/* kick-locked pulse for the background glow: every beat in the grooves, downbeats stronger; silent in intro + breakdown */
function beatPulse(t){
  const inGroove=(t>=vbeat(8)&&t<vbeat(72))||(t>=vbeat(81)&&t<60.2);
  if(!inGroove)return 0;
  const k=Math.floor((t-MK8)/MB)+8, b=vbeat(k), age=t-b;
  return Math.exp(-age/0.17)*(k%4===0?1:0.55);
}
function camera(t){
  const c=CAM, cam=$('cam');
  cam.style.transform=`translate(${c.x.toFixed(2)}px,${c.y.toFixed(2)}px) rotate(${c.r.toFixed(3)}deg) scale(${c.s.toFixed(4)})`;
  if(c.bx+c.by>0.35){$('mbG').setAttribute('stdDeviation',`${c.bx.toFixed(2)} ${c.by.toFixed(2)}`);cam.style.filter='url(#mblur)';}
  else cam.style.filter='none';
  // purple light sweeps
  const bands=[$('swA'),$('swB')];
  bands.forEach((b,i)=>{const s=c.sw[i];
    if(!s){b.style.opacity=0;return;}
    const env=Math.sin(Math.PI*s.q);
    if(s.dir==='h'){b.style.transform=`translateX(${(-800+3500*ez.ioC(s.q)).toFixed(1)}px) rotate(16deg)`;}
    else {b.style.transform=`translate(700px,${(1500-2900*ez.ioC(s.q)).toFixed(1)}px) rotate(90deg)`;}
    b.style.opacity=(0.85*env).toFixed(3);});
}

