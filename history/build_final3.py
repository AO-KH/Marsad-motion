# film_final3.html = film_final2.html + a beat-locked charge-up before the ignition, kinetic caption, flash on the downbeat
s=open('film_final2.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:90]); s=s.replace(a,b)
rep('#odots{left:0;top:0;display:none;}','#odots{left:0;top:0;display:none;}\n.cw{position:relative;display:inline-block;}')
# vector layer for the build-up: tile trails, inward streaks, charge rings, ripples (one glow pass for the group)
rep('<g id="spokesG" filter="url(#glowP)"></g>','''<g id="spokesG" filter="url(#glowP)"></g><g id="chargeG" filter="url(#glowP)" style="display:none"><g id="trails"></g><g id="streaks"></g>
    <circle id="chgB" cx="960" cy="540" r="0" fill="none" stroke="#BC59D1" stroke-width="1.6" opacity="0"/>
    <circle id="chgA" cx="960" cy="540" r="0" fill="none" stroke="url(#gr)" stroke-linecap="round" opacity="0"/>
    <circle id="rip0" cx="960" cy="540" r="0" fill="none" stroke="#BC59D1" opacity="0"/><circle id="rip1" cx="960" cy="540" r="0" fill="none" stroke="#BC59D1" opacity="0"/><circle id="rip2" cx="960" cy="540" r="0" fill="none" stroke="#BC59D1" opacity="0"/></g>''')
# caption split into words for a staggered rise
rep('<div class="copyEN" id="c3en" style="top:842px;">Marsad changes that.</div>','<div class="copyEN" id="c3en" style="top:842px;"><span class="cw">Marsad</span> <span class="cw">changes</span> <span class="cw">that.</span></div>')
rep('<div class="copyAR" id="c3ar" style="top:912px;">مرصد يغيّر المعادلة.</div>','<div class="copyAR" id="c3ar" style="top:912px;"><span class="cw">مرصد</span> <span class="cw">يغيّر</span> <span class="cw">المعادلة.</span></div>')
rep("""  enter($('c3en'),t,11.9,0.6); enter($('c3ar'),t,12.1,0.6);
  if(dieC>0){st($('c3en'),{opacity:1-dieC});st($('c3ar'),{opacity:1-dieC});}""",
"""  const cOn=t>=11.78;
  st($('c3en'),{opacity:cOn?1-dieC:0});st($('c3ar'),{opacity:cOn?1-dieC:0});
  [['c3en',11.80,0.085,30],['c3ar',12.02,0.085,20]].forEach(([id,a0,stg,dy])=>{[...$(id).children].forEach((w,i)=>{
    const e=ez.outC(P(t,a0+i*stg,a0+i*stg+0.5));
    st(w,{opacity:e.toFixed(3),transform:`translateY(${((1-e)*dy).toFixed(2)}px)`,filter:e<1?`blur(${(7*(1-e)).toFixed(2)}px)`:'none'});});});""")
# tiles: new beat-locked flight
i0=s.index("  tile3Els.forEach((e,i)=>{\n    const h=tileHome[i];\n    const t0=a+0.15+i*0.14")
i1=s.index("  });\n}\n",i0)+len("  });\n")
s=s[:i0]+"  chargeTiles(t);\n"+s[i1:]
rep('function scene3(t){',open('fs_parts/charge.js',encoding='utf-8').read()+'\nfunction scene3(t){')
# camera: slow lean-in across the charge (tilts and straightens exactly on the hit); anticipation softened to share the push
rep("  {t:vbeat(12), type:'anticipate', a:1.0, amp:0.045},",
    "  {t:vbeat(12), type:'anticipate', a:1.0, amp:0.03},\n  {t:vbeat(12), type:'charge', t0:9.95, amp:0.03, rot:-1.2},                      // lean in while the sources are pulled in")
rep("    if(e.type==='anticipate'){",
    "    if(e.type==='charge'){if(t<e.t){const q=P(t,e.t0,e.t);s*=1+e.amp*ez.ioC(q);r+=e.rot*Math.sin(Math.PI*q);}else s*=1+e.amp*(1-ez.outC(P(t,e.t,e.t+0.6)));continue;}\n    if(e.type==='anticipate'){")
# flash: hard attack on the downbeat, fast decay (was a slow swell 0.18s late)
rep("  pulse(11.75,0.32,0.55);   // ignition","  {const q=t-IGN;if(q>-0.035&&q<1.2)f=Math.max(f,0.42*(q<0?(q+0.035)/0.035:Math.exp(-q/0.22)));}   // ignition, on the downbeat")
rep("  ignition(t);\n  camera(t);","  ignition(t);charge(t);\n  camera(t);")
open('film_final3.html','w',encoding='utf-8').write(s); print('film_final3.html',len(s))
