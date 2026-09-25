# film_final4.html = film_final3.html + rhythm lock: every entrance, pop, click and loop sits on the music's beat grid
import re
s=open('film_final3.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:90]); s=s.replace(a,b)
def replace_fn(name,src):
    global s
    i=s.index(f'function {name}(t){{'); j=s.index('{',i); d=0
    for k in range(j,len(s)):
        if s[k]=='{': d+=1
        elif s[k]=='}':
            d-=1
            if d==0: break
    s=s[:i]+src.strip()+s[k+1:]
# beat helpers
rep("const MB=0.63832, MK8=9.0197, vbeat=k=>MK8+MB*(k-8);",
    "const MB=0.63832, MK8=9.0197, vbeat=k=>MK8+MB*(k-8);\n"
    "const kOf=t=>8+(t-MK8)/MB;                                    // film time → beat index on the music grid\n"
    "const S16=MB/4, S8=MB/2;                                       // a 16th and an 8th note, in seconds\n"
    "const sinceBeat=(t,mod=1,off=0)=>{const k=kOf(t);return t-vbeat(off+mod*Math.floor((k-off)/mod));};   // time since the last beat ≡ off (mod mod)")
# scene boundaries that sit next to a grid point snap onto it (31 ms, 10 ms, 17 ms)
rep("const T={s1:[0,4.6],s2:[4.6,9.6],s3:[9.6,13.2],s4:[13.2,20.2],s5:[20.2,27.4],\n        s6:[27.4,34.4],s7:[34.4,41.6],s8:[41.6,48.4],s9:[48.4,55.6],s10:[55.6,63.0]};",
    "const T={s1:[0,4.6],s2:[4.6,9.6],s3:[9.6,vbeat(14.5)],s4:[vbeat(14.5),vbeat(25.5)],s5:[vbeat(25.5),27.4],\n        s6:[27.4,34.4],s7:[34.4,41.6],s8:[41.6,48.4],s9:[48.4,vbeat(81)],s10:[vbeat(81),63.0]};")
rep("  {t:vbeat(16), type:'pullback', t0:13.2, amp:0.10},","  {t:vbeat(16), type:'pullback', t0:vbeat(14.5), amp:0.10},")
# S3 caption: words on 16ths after the voice (EN on the 1+, AR on beat 2), gone by the scene change
rep("const dieC=ez.inC(P(t,12.9,13.18));","const dieC=ez.inC(P(t,vbeat(14),T.s3[1]-0.01));")
rep("const cOn=t>=11.78;","const cOn=t>=vbeat(12.5)-0.02;")
rep("[['c3en',11.80,0.085,30],['c3ar',12.02,0.085,20]]","[['c3en',vbeat(12.5),S16,30],['c3ar',vbeat(13),S16,20]]")
# scenes rewritten on the grid
src=open('fs_parts/rhythm_scenes.js',encoding='utf-8').read()
fns=re.split(r'\n(?=function )',src)
for f in fns:
    name=re.match(r'function (\w+)\(t\)\{',f.strip()).group(1)
    replace_fn(name,f)
    print('replaced',name)
# flashes: toast on its downbeat, logo bloom hits on the drop
rep("  pulse(39.3+ -0.05,0.18,0.4); // toast (soft, greenish handled by scene)","  pulse(vbeat(56)-0.05,0.18,0.4); // toast (soft, greenish handled by scene)")
rep("  pulse(T.s10[0]+0.1,0.6,0.9); // logo bloom","  {const q=t-vbeat(81);if(q>-0.035&&q<2.5)f=Math.max(f,0.6*(q<0?(q+0.035)/0.035:Math.exp(-q/0.45)));}   // logo bloom, on the drop")
open('film_final4.html','w',encoding='utf-8').write(s); print('film_final4.html',len(s))
