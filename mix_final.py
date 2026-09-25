# Place the fitted "Stylish" track and mix it with VO + SFX (argv: sfx stem prefix, output wav)
import numpy as np, wave, sys
pre=sys.argv[1]; outp=sys.argv[2]
SR=48000; N=int(63.0*SR)
w=wave.open('fit/stylish.wav'); song=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(np.float64)/32768
BEAT=0.63832; B0=5.1472; bar=lambda j:B0+4*BEAT*j; OFF=3.8725
music=np.zeros((N,2))
def put(song_a,song_b,video_t,fin=0.0,fout=0.0):
    a,b=int(round(song_a*SR)),int(round(song_b*SR)); seg=song[a:b].copy()
    if fin>0: n=int(fin*SR); seg[:n]*=np.sin(np.linspace(0,np.pi/2,n))[:,None]
    if fout>0: n=int(fout*SR); seg[-n:]*=np.cos(np.linspace(0,np.pi/2,n))[:,None]
    v=int(round(video_t*SR)); e=min(N,v+len(seg)); music[v:e]+=seg[:e-v]
XF=0.012; PRE=0.004; seamV=bar(19)+OFF
put(0.0, bar(19)+XF-PRE, OFF, fin=0.02, fout=2*XF)
put(bar(25)-XF-PRE, len(song)/SR, seamV-XF-PRE, fin=2*XF)
vo=np.load(f'{pre}_vo.npy').T[:N]; sfx=np.load(f'{pre}_sfx.npy').T[:N]; duck=np.load(f'{pre}_duck.npy')[:N]
db=lambda x:20*np.log10(x+1e-12)
sp_rms=np.sqrt(np.mean(vo[duck>0.5,0]**2)); m_rms=np.sqrt(np.mean(music[int(12*SR):int(46*SR)]**2))
g=10**((db(sp_rms)-8.5-db(m_rms))/20); bed=music*g*(1-0.66*duck)[:,None]
mix=vo+sfx+bed; fade=np.ones(N); f0=int(61.7*SR); fade[f0:]=np.linspace(1,0,N-f0)**1.2; mix*=fade[:,None]
pk=np.max(np.abs(mix)); mix*=(0.89/pk if pk>0.89 else 1)
print('speech above bed: %.1f dB'%db(sp_rms/np.sqrt(np.mean(((sfx+bed)[duck>0.5,0])**2))))
with wave.open(outp,'wb') as ww:
    ww.setnchannels(2);ww.setsampwidth(2);ww.setframerate(SR);ww.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes())
