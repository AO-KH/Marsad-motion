function drawBG(t){
  bg.clearRect(0,0,1920,1080);
  bg.fillStyle='#FFFFFF';bg.fillRect(0,0,1920,1080);
  // soft brand tints in two corners (the site's lavender)
  let g=bg.createRadialGradient(260,90,40,260,90,1150);
  g.addColorStop(0,'rgba(142,50,195,0.075)');g.addColorStop(1,'rgba(142,50,195,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  g=bg.createRadialGradient(1720,1010,40,1720,1010,1150);
  g.addColorStop(0,'rgba(222,13,255,0.050)');g.addColorStop(1,'rgba(222,13,255,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  // drifting dot grid — the texture of the site's knowledge-graph canvas
  const pitch=32,off=(t*3.2)%pitch;
  bg.fillStyle='rgba(118,110,150,0.20)';
  for(let x=-pitch+off;x<1970;x+=pitch)for(let y=-pitch+off*0.6;y<1130;y+=pitch){bg.fillRect(x,y,1.7,1.7);}
  // violet motes
  for(const d of DUST){
    const y=(d.y - t*d.v)%1120; const yy=y<-20?y+1120:y;
    const tw=0.35+0.3*Math.sin(t*0.8+d.ph);
    bg.fillStyle=`rgba(142,50,195,${0.09*tw*d.s})`;
    bg.beginPath();bg.arc((d.x+Math.sin(t*0.22+d.ph)*24)%1920,yy,d.s,0,7);bg.fill();
  }
}
function drawFX(t){
  fx.clearRect(0,0,1920,1080);
  // light vignette
  const v=fx.createRadialGradient(960,540,700,960,540,1560);
  v.addColorStop(0,'rgba(60,40,110,0)');v.addColorStop(1,'rgba(60,40,110,0.07)');
  fx.fillStyle=v;fx.fillRect(0,0,1920,1080);
  // fine grain, much lighter on a white canvas
  const fr=Math.floor(t*30);const r=mulberry(9000+fr);
  fx.globalAlpha=0.028;
  for(let i=0;i<1500;i++){const x=r()*1920,y=r()*1080,l=100+r()*155;
    fx.fillStyle=`rgb(${l},${l},${l})`;fx.fillRect(x,y,1.6,1.6);}
  fx.globalAlpha=1;
}

