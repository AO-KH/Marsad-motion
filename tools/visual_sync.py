# Visual onsets from *local* change only: count pixels whose brightness jumps by >14 levels between frames
# (the kick-synced background glow, dust and grain change every pixel a little and are ignored).
# Scene transitions (camera moves) are excluded so only element entrances/pops/clicks are measured.
import numpy as np, sys
from PIL import Image
MB=0.63832; K8=9.0197; FPS=30
kOf=lambda t: 8+(t-K8)/MB
vb=lambda k: K8+MB*(k-8)
TRANS=[(vb(k)-0.5,vb(k)+0.75) for k in (9,12,16,26,37,48,59,70,81)]+[(9.0,13.3)]   # camera moves + the S3 ignition block
def masked(t): return any(a<=t<=b for a,b in TRANS)
def run(d,f0,f1):
    prev=None; v=[]
    for i in range(f0,f1):
        im=np.asarray(Image.open(f'{d}/f_{i:04d}.jpg').convert('L').resize((480,270)),dtype=np.int16)
        v.append(0 if prev is None else int((np.abs(im-prev)>14).sum())); prev=im
    v=np.array(v,dtype=float); on=[]
    for i in range(1,len(v)-1):
        t=(f0+i)/FPS
        if masked(t): continue
        base=np.median(v[max(0,i-12):i]) if i>1 else 0
        if v[i]>=60 and v[i]>2.5*base+40 and v[i-1]<0.6*v[i]: on.append(t)
    return np.array(on)
f0,f1=int(9.0*FPS),int(61.5*FPS)
for d in sys.argv[1:]:
    t=run(d,f0,f1); k=np.array([kOf(x) for x in t])
    # a visual onset is "on the beat" if its first changed frame is the first frame at/after an 8th (or the one before)
    err=(k-np.floor(k*2+1e-9)/2)*MB            # seconds after the preceding 8th
    on=((err<=1.0/FPS+0.003)|(err>=MB/2-1.0/FPS-0.003))
    print(f'{d}: {len(t)} element onsets, {on.mean()*100:.0f}% start within one frame of an 8th-note  (chance ~{(2/FPS)/(MB/2)*100:.0f}%)')
