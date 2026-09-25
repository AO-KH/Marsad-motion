# film_site_glow_tr.html = film_site_glow.html + beat-locked transitions (camera wrapper, motion blur, light sweeps, kick pulse)
s=open('film_site_glow.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:80]); s=s.replace(a,b)
def between(start,end,new):
    global s; i=s.index(start); j=s.index(end,i+len(start)); s=s[:i]+new+s[j:]
rep('</style>\n<script src="site_kit.js"></script>','''#cam{left:0;top:0;width:1920px;height:1080px;transform-origin:960px 540px;}
#swp{left:0;top:0;width:1920px;height:1080px;pointer-events:none;overflow:hidden;}
#swp i{top:-420px;left:0;width:560px;height:1920px;opacity:0;filter:blur(22px);
  background:linear-gradient(90deg,rgba(188,89,209,0) 0%,rgba(188,89,209,0.26) 32%,rgba(222,13,255,0.55) 50%,rgba(188,89,209,0.26) 68%,rgba(188,89,209,0) 100%);}
</style>
<script src="site_kit.js"></script>''')
# wrap everything the camera moves (wall → orb → vectors → scenes)
rep('<!-- S10 backdrop: a wall of the site\'s pages (sits under the orb bloom) -->','<div id="cam">\n<!-- S10 backdrop: a wall of the site\'s pages (sits under the orb bloom) -->')
rep('<div id="flash"></div>','</div><!-- /cam -->\n<div id="swp"><i id="swA"></i><i id="swB"></i></div>\n<svg width="0" height="0" style="position:absolute;left:0;top:0;"><filter id="mblur" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feGaussianBlur id="mbG" stdDeviation="0 0"/></filter></svg>\n<div id="flash"></div>')
between('function drawBG(t){','function drawFX(t){',open('fs_parts/tr_canvases.js',encoding='utf-8').read())
rep('/* ================= scene renderers ================= */',open('fs_parts/transitions.js',encoding='utf-8').read()+'/* ================= scene renderers ================= */')
rep("  t=clamp(t,0,window.DURATION);\n  drawBG(t);","  t=clamp(t,0,window.DURATION);\n  CAM=camState(t);\n  drawBG(t);")
rep("  orb(t);flash(t);","  orb(t);flash(t);\n  camera(t);")
open('film_site_glow_tr.html','w',encoding='utf-8').write(s); print('film_site_glow_tr.html',len(s))
