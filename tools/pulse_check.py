# Is anything flashing on the beat? Median ratio of (frame change right after each beat) / (typical change around it).
import numpy as np, sys
from PIL import Image
MB=0.63832; K8=9.0197; FPS=30
vb=lambda k: K8+MB*(k-8)
TR=(9,12,16,26,37,48,59,70,81,88)
beats=[k for k in list(range(13,72))+list(range(82,88)) if all(abs(k-x)>1.5 for x in TR)]
def load(d,i): return np.asarray(Image.open(f'{d}/f_{i:04d}.jpg').convert('L').resize((240,135)),dtype=np.float32)
for d in sys.argv[1:]:
    r=[]
    for k in beats:
        i=int(np.ceil(vb(k)*FPS))           # first frame at/after the beat
        di=lambda j: np.abs(load(d,j)-load(d,j-1)).mean()
        on=di(i); around=np.median([di(j) for j in (i-4,i-3,i+4,i+5)])
        r.append(on/(around+1e-3))
    r=np.array(r)
    print(f'{d}: beat-frame change is {np.median(r):.1f}x the surrounding frames (median over {len(r)} beats; 1.0 = no pulse)')
