# film_site_glow.html = film_site.html + purple glow layer (CSS, SVG glow filters, border beams, glowing canvas).
s=open('film_site.html',encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old); assert n==count,(n,old[:80]); s=s.replace(old,new)
def between(start,end,new):
    global s
    i=s.index(start); j=s.index(end,i+len(start)); s=s[:i]+new+s[j:]
# CSS layer (after the film's own style block)
rep('<script src="site_kit.js"></script>','<style id="glow">\n'+open('glow_style.css',encoding='utf-8').read()+'</style>\n<script src="site_kit.js"></script>')
# SVG glow filter (user-space region so vertical spokes don't clip)
GF='<filter id="glowP" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
rep('<g id="edges"></g>','<g id="edges"></g><g id="spokesG" filter="url(#glowP)"></g>')
rep('    </linearGradient>\n  </defs>','    </linearGradient>\n    '+GF+'\n  </defs>')
rep('<circle id="loopRing"','<circle id="loopRing" filter="url(#glowP)"')
rep('<circle id="loopGlowArc"','<circle id="loopGlowArc" filter="url(#glowP)"')
rep('<circle id="spin" ','<circle id="spin" filter="url(#glowP)" ')
GF2='<filter id="glowP2" filterUnits="userSpaceOnUse" x="0" y="0" width="1360" height="760"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
rep('<stop offset="100%" stop-color="#BC59D1"/></linearGradient></defs>','<stop offset="100%" stop-color="#BC59D1"/></linearGradient>'+GF2+'</defs>')
rep('<circle id="spin2" ','<circle id="spin2" filter="url(#glowP2)" ')
# border beams: app window + assistant panel
rep('<div id="uiFrame"><div class="site" id="uiSite"></div></div>',
    '<div id="uiFrame"><div class="site" id="uiSite"></div></div>\n    <div class="beam soft" id="uiBeamS" style="left:-7px;top:-7px;width:1374px;height:774px;border-radius:25px;"></div>'
    '<div class="beam" id="uiBeam" style="left:-2px;top:-2px;width:1364px;height:764px;border-radius:20px;"></div>')
rep('<div id="chatPanel">','<div id="chatPanel">\n    <div class="beam soft" id="chBeamS" style="left:-8.5px;top:-8.5px;width:994px;height:614px;border-radius:33px;"></div>'
    '<div class="beam" id="chBeam" style="left:-3.5px;top:-3.5px;width:984px;height:604px;border-radius:28px;"></div>')
# glowing marks
rep('filter:drop-shadow(0 8px 22px rgba(142,50,195,0.35));">','filter:drop-shadow(0 0 20px rgba(188,89,209,0.75)) drop-shadow(0 0 50px rgba(142,50,195,0.45));">')
rep('style="filter:drop-shadow(0 6px 18px rgba(142,50,195,0.40));">','style="filter:drop-shadow(0 0 18px rgba(188,89,209,0.75)) drop-shadow(0 0 44px rgba(142,50,195,0.45));">')
rep("filter:'drop-shadow(0 6px 20px rgba(142,50,195,0.38))'","filter:'drop-shadow(0 0 18px rgba(188,89,209,0.70)) drop-shadow(0 0 46px rgba(142,50,195,0.42))'")
# glowing graph dots; purple spokes into the glow group
rep('box-shadow:0 0 0 4px ${n[4]}22;','box-shadow:0 0 0 4px ${n[4]}22,0 0 14px ${n[4]}CC;')
rep('/* S8 rings + labels */',"spokeEls.forEach(l=>$('spokesG').appendChild(l));\n/* S8 rings + labels */")
# canvases
between('function drawBG(t){','/* ================= scene renderers ================= */',open('fs_parts/glow_canvases.js',encoding='utf-8').read())
# beams rotate (ambient; no effect on scene timing)
rep("  const a=T.s6[0], b=T.s7[0];","  const a=T.s6[0], b=T.s7[0];\n  {const ba=((t*100)%360)+'deg';$('uiBeam').style.setProperty('--ba',ba);$('uiBeamS').style.setProperty('--ba',ba);}")
rep("showS($('s9'),on); if(!on)return;\n  const a=T.s9[0];","showS($('s9'),on); if(!on)return;\n  const a=T.s9[0];\n  {const ba=((t*100+140)%360)+'deg';$('chBeam').style.setProperty('--ba',ba);$('chBeamS').style.setProperty('--ba',ba);}")
# lifted decision glows purple
rep("boxShadow:`0 ${4+fw*36}px ${10+fw*70}px rgba(60,30,120,${0.04+fw*0.16})`});",
    "boxShadow:`0 ${4+fw*36}px ${10+fw*70}px rgba(60,30,120,${0.04+fw*0.12}), 0 0 ${fw*70}px rgba(142,50,195,${fw*0.42}), 0 0 0 ${fw*1.5}px rgba(142,50,195,${fw*0.35})`});")
open('film_site_glow.html','w',encoding='utf-8').write(s)
print('film_site_glow.html',len(s))
