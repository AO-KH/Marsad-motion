# film_final2.html = film_final.html + a dynamic ignition (logo reveal) on the downbeat
s=open('film_final.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:80]); s=s.replace(a,b)
rep('</style>\n<script src="site_kit.js"></script>','''#shock1,#shock2{border-radius:50%;border:3px solid rgba(188,89,209,0.9);box-shadow:0 0 26px rgba(188,89,209,0.55),inset 0 0 20px rgba(188,89,209,0.35);opacity:0;display:none;}
#mGlint{width:120px;height:91.58px;opacity:0;display:none;pointer-events:none;
  -webkit-mask:url(assets_logo_m.png) center/100% 100% no-repeat;mask:url(assets_logo_m.png) center/100% 100% no-repeat;
  background:linear-gradient(105deg,rgba(255,255,255,0) 38%,rgba(255,255,255,0.95) 50%,rgba(255,255,255,0) 62%);background-size:300% 100%;}
#odots{left:0;top:0;display:none;}
#odots i{width:8px;height:8px;border-radius:50%;background:#BC59D1;box-shadow:0 0 12px 3px rgba(188,89,209,0.8);opacity:0;}
</style>
<script src="site_kit.js"></script>''')
# DOM: shockwaves behind the M, glint + orbit dots above it, rays/sparks in the vector layer (glowing)
rep('<img id="orbM" src="assets_logo_m.png" style="width:120px;">','<div id="shock1"></div><div id="shock2"></div>\n<img id="orbM" src="assets_logo_m.png" style="width:120px;">\n<div id="mGlint"></div><div id="odots"><i></i><i></i><i></i></div>')
rep('<g id="edges"></g><g id="spokesG" filter="url(#glowP)"></g>','<g id="edges"></g><g id="spokesG" filter="url(#glowP)"></g><g id="burst" filter="url(#glowP)" opacity="0"></g>')
# camera: anticipation push-in while the last tiles converge, harder punch + rotational shake on the impact
rep("  {t:vbeat(12), type:'punch',         d:0.50, amp:0.040},                         // ignition downbeat",
    "  {t:vbeat(12), type:'punch',         d:0.55, amp:0.065},                         // ignition downbeat (harder)\n  {t:vbeat(12), type:'anticipate', a:1.0, amp:0.045},                             // push in toward the orb before the hit\n  {t:vbeat(12), type:'shake', d:0.6, amp:0.9, f:11},                                // impact shake (degrees)")
rep("    if(e.type==='pullback'){","    if(e.type==='anticipate'){if(t<e.t)s*=1+e.amp*ez.inC(P(t,e.t-e.a,e.t));else s*=1+e.amp*(1-ez.outC(P(t,e.t,e.t+0.45)));continue;}\n    if(e.type==='shake'){const q=t-e.t;if(q>=0&&q<e.d)r+=e.amp*Math.sin(2*Math.PI*e.f*q)*Math.exp(-q/0.16);continue;}\n    if(e.type==='pullback'){")
rep('/* ================= scene renderers ================= */',open('fs_parts/ignition.js',encoding='utf-8').read()+'/* ================= scene renderers ================= */')
rep("  orb(t);flash(t);\n  camera(t);","  orb(t);flash(t);\n  ignition(t);\n  camera(t);")
open('film_final2.html','w',encoding='utf-8').write(s); print('film_final2.html',len(s))
