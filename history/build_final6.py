# film_final6.html = film_final5.html without any pulsing: rhythm stays in *when* things happen, nothing throbs to the beat
s=open('film_final5.html',encoding='utf-8').read()
def rep(a,b,c=1):
    global s; n=s.count(a); assert n==c,(n,a[:90]); s=s.replace(a,b)
# background: no kick-synced glow / dot-grid flash
rep("const br=0.5+0.5*Math.sin(t*0.35), bp=beatPulse(t);","const br=0.5+0.5*Math.sin(t*0.35), bp=0;   // steady: no beat-synced flashing")
# logo hold: no beat kicks, glow pulses or wobbling orbit
rep("  const bk=[vbeat(13),vbeat(14)].reduce((a,b)=>a+(t>=b?Math.exp(-(t-b)/0.14):0),0);   // kick on each beat of the hold\n","")
rep("sc=(1.0+0.07*ez.sin(P(t,IGN+0.55,T.s3[1])))*(1+0.04*bk);op=1;","sc=1.0+0.07*ez.sin(P(t,IGN+0.55,T.s3[1]));op=1;")
rep("  const beatGlow=[vbeat(13),vbeat(14)].reduce((a,b)=>a+(t>=b?Math.exp(-(t-b)/0.22):0),0);\n","")
rep("+12*beatGlow;",";")
rep("R=150+10*Math.sin(t*3+i)+26*bk;","R=150;")
# charge-up: no beat ripples in the hold, no tremble; absorb reactions softened
rep(".concat([[vbeat(13),120,300,2.2,0.55],[vbeat(14),120,300,2.2,0.55]])","")
rep("if(t<IGN){const cp=P(t,9.85,IGN);s=(0.34+0.075*n)*(1+0.22*Math.min(kk,1.6)+0.04*Math.sin(2*Math.PI*9*t)*cp*cp);}",
    "if(t<IGN){s=(0.34+0.075*n)*(1+0.12*Math.min(kk,1.6));}")
rep("(104+9*Math.min(kk,1.5))","(104+5*Math.min(kk,1.5))")
rep("(134+5*Math.min(kk,1.5))","(134+3*Math.min(kk,1.5))")
# waiting counter: steps on the beat, no flicker
rep("  const tk=ticks>0?Math.exp(-sinceBeat(t)/0.12):0;\n  st($('waitRow'),{opacity:pT*(0.8+0.2*tk)});","  st($('waitRow'),{opacity:pT});")
# loop nodes: land on their beat and stay still
rep("    // once landed, a node kicks as the arc passes it — one node per beat\n    if(ig>=1&&!inS5){const q=sinceBeat(t,4,i);n.style.transform=`scale(${1+0.24*Math.exp(-q/0.16)})`;}\n","")
# graph: no breathing objects, no pulsing hub
rep("    const breathe=1+0.02*Math.sin(t*1.7+i*1.3);\n","")
rep("scale(${(0.75+0.25*p)*breathe*cs})","scale(${(0.75+0.25*p)*cs})")
rep("*cs*(1+0.03*(hub>=1?beatPulse(t):0))})`});","*cs})`});")
# shield: rings and core hold steady
rep("  const breathe=(t>vbeat(66)&&t<vbeat(67.5))?Math.sin(P(t,vbeat(66),vbeat(67.5))*Math.PI)*0.032:0;\n  const bp=beatPulse(t);\n","")
rep("scale(${(1.16-0.16*p)*(1+breathe+0.012*bp)})","scale(${1.16-0.16*p})")
rep("scale(${(0.7+0.3*pC)*(1+breathe+0.02*bp)})","scale(${0.7+0.3*pC})")
# end card: the mark and its halo hold steady
rep("  const amb=(1+0.008*Math.sin((t-a)*1.2))*(1+0.014*(pM>=1?beatPulse(t):0));   // the mark kicks with the drums\n","")
rep("scale(${(0.82+0.18*pM)*amb})","scale(${0.82+0.18*pM})")
rep("op=0.16+0.03*Math.sin(t*1.1);","op=0.16;")
open('film_final6.html','w',encoding='utf-8').write(s); print('film_final6.html',len(s))
