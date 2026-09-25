# Build film_site.html from film.html: new light head + DOM, original JS with surgical replacements.
import re
src=open('film.html',encoding='utf-8').read()
js=src[src.index('<script>')+len('<script>'):src.rindex('</script>')]
P=lambda f:open('fs_parts/'+f,encoding='utf-8').read()

def between(s,start,end,new,keep_end=True):
    i=s.index(start); j=s.index(end,i+len(start))
    assert s.count(start)==1, start
    return s[:i]+new+s[j:]

js=between(js,'/* nav for UI — two real page navs */','/* S5 chips + graph nodes */',P('ui_build.js'))
js=between(js,'/* S5 chips + graph nodes */','/* S8 rings + labels */',P('s5_build.js'))
js=between(js,'function drawBG(t){','/* ================= scene renderers ================= */',P('canvases.js'))
js=between(js,'function scene5(t){','function sceneUI(t){',P('scene5.js'))
js=between(js,'function sceneUI(t){','function scene8(t){',P('sceneUI.js'))
js=between(js,'function arSub(s,n){return s.slice(0,n);}','function scene10(t){',P('scene9.js'))
js=between(js,'function scene10(t){','/* orb carrier across scenes */',P('scene10.js'))
# orb: softer purple glow on white, and drift into the assistant input's caret
old_glow="filter:'drop-shadow(0 0 26px rgba(220,60,250,0.55))'"
assert js.count(old_glow)==1; js=js.replace(old_glow,"filter:'drop-shadow(0 6px 20px rgba(142,50,195,0.38))'")
old_caret='x=lerp(700,1352,p);y=lerp(517,475,p);'
assert js.count(old_caret)==1; js=js.replace(old_caret,'x=lerp(700,1390,p);y=lerp(517,856,p);')

head=open('film_site_head.html',encoding='utf-8').read()
body=open('film_site_body.html',encoding='utf-8').read()
out=head+body+'\n<script>'+js+'</script>\n</body>\n</html>\n'
open('film_site.html','w',encoding='utf-8').write(out)
# timing audit: every scene-table entry and the master SEEK must be byte-identical
for k in ['const T={s1:[0,4.6],s2:[4.6,9.6],s3:[9.6,13.2],s4:[13.2,20.2],s5:[20.2,27.4],',
          's6:[27.4,34.4],s7:[34.4,41.6],s8:[41.6,48.4],s9:[48.4,55.6],s10:[55.6,63.0]};',
          'window.DURATION=63.0;','function scene1(t){','function scene2(t){','function scene3(t){','function scene4(t){','function scene8(t){',
          "$('fade').style.opacity=ez.inC(P(t,61.7,62.95));"]:
    assert k in out, k
print('film_site.html', len(out), 'bytes')
