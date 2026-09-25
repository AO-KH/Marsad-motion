# film_final.html = film_site_glow_tr.html + user edits: no "HOW IT WORKS" kicker, bigger Marsad M in the graph hub and shield core
s=open('film_site_glow_tr.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:80]); s=s.replace(a,b)
rep('</style>\n<script src="site_kit.js"></script>','''#k1,#k2,#k4{display:none!important;}              /* "THE PROBLEM · المشكلة" and "HOW IT WORKS · كيف يعمل" removed */
#hubM{width:180px!important;}                     /* graph hub logo: 104 → 180 px */
#coreM{width:120px!important;}                    /* shield core logo: 56 → 120 px (fits inside ring L01, r=86) */
</style>
<script src="site_kit.js"></script>''')
# keep the "يقع في" label clear of the larger hub: place it 38% along its edge from مدينة instead of at the midpoint
rep("[3,1,'يقع في']","[3,1,'يقع في',0.38]")
rep("st(elblEls[i],{left:((x1+x2)/2)+'px',top:((y1+y2)/2)+'px',opacity:pl*(1-con),",
    "const fr=EDGE_PAIRS[i][3]??0.5;\n    st(elblEls[i],{left:(x1+(x2-x1)*fr)+'px',top:(y1+(y2-y1)*fr)+'px',opacity:pl*(1-con),")
open('film_final.html','w',encoding='utf-8').write(s); print('film_final.html',len(s))
