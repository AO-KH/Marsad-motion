function drawBG(t){
  bg.clearRect(0,0,1920,1080);
  bg.fillStyle='#FFFFFF';bg.fillRect(0,0,1920,1080);
  const br=0.5+0.5*Math.sin(t*0.35);                 // slow ambient breathing
  // corner glows (stronger than the site edition)
  let g=bg.createRadialGradient(240+60*Math.sin(t*0.11),80,40,240,80,1200);
  g.addColorStop(0,'rgba(142,50,195,0.17)');g.addColorStop(0.5,'rgba(142,50,195,0.06)');g.addColorStop(1,'rgba(142,50,195,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  g=bg.createRadialGradient(1720-60*Math.sin(t*0.09),1010,40,1720,1010,1200);
  g.addColorStop(0,'rgba(222,13,255,0.13)');g.addColorStop(0.5,'rgba(188,89,209,0.05)');g.addColorStop(1,'rgba(222,13,255,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  // central aura behind the content
  g=bg.createRadialGradient(960,520,60,960,520,1000);
  g.addColorStop(0,`rgba(188,89,209,${0.11+0.04*br})`);g.addColorStop(0.55,'rgba(142,50,195,0.05)');g.addColorStop(1,'rgba(142,50,195,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  // drifting purple dot grid
  const pitch=32,off=(t*3.2)%pitch;
  bg.fillStyle='rgba(142,50,195,0.20)';
  for(let x=-pitch+off;x<1970;x+=pitch)for(let y=-pitch+off*0.6;y<1130;y+=pitch){bg.fillRect(x,y,1.7,1.7);}
  // glowing motes
  bg.save();bg.shadowColor='rgba(188,89,209,0.9)';bg.shadowBlur=14;
  for(const d of DUST){
    const y=(d.y - t*d.v)%1120; const yy=y<-20?y+1120:y;
    const tw=0.35+0.3*Math.sin(t*0.8+d.ph);
    bg.fillStyle=`rgba(188,89,209,${0.22*tw*d.s})`;
    bg.beginPath();bg.arc((d.x+Math.sin(t*0.22+d.ph)*24)%1920,yy,d.s*1.3,0,7);bg.fill();
  }
  bg.restore();
}
function drawFX(t){
  fx.clearRect(0,0,1920,1080);
  // purple vignette
  const v=fx.createRadialGradient(960,540,640,960,540,1560);
  v.addColorStop(0,'rgba(110,30,180,0)');v.addColorStop(1,'rgba(110,30,180,0.12)');
  fx.fillStyle=v;fx.fillRect(0,0,1920,1080);
  const fr=Math.floor(t*30);const r=mulberry(9000+fr);
  fx.globalAlpha=0.028;
  for(let i=0;i<1500;i++){const x=r()*1920,y=r()*1080,l=100+r()*155;
    fx.fillStyle=`rgb(${l},${l},${l})`;fx.fillRect(x,y,1.6,1.6);}
  fx.globalAlpha=1;
}

