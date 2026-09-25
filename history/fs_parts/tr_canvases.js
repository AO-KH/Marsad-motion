function drawBG(t){
  bg.clearRect(0,0,1920,1080);
  bg.fillStyle='#FFFFFF';bg.fillRect(0,0,1920,1080);
  const br=0.5+0.5*Math.sin(t*0.35), bp=beatPulse(t);
  let g=bg.createRadialGradient(240+60*Math.sin(t*0.11),80,40,240,80,1200);
  g.addColorStop(0,`rgba(142,50,195,${0.17+0.05*bp})`);g.addColorStop(0.5,'rgba(142,50,195,0.06)');g.addColorStop(1,'rgba(142,50,195,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  g=bg.createRadialGradient(1720-60*Math.sin(t*0.09),1010,40,1720,1010,1200);
  g.addColorStop(0,`rgba(222,13,255,${0.13+0.05*bp})`);g.addColorStop(0.5,'rgba(188,89,209,0.05)');g.addColorStop(1,'rgba(222,13,255,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  g=bg.createRadialGradient(960,520,60,960,520,1000);
  g.addColorStop(0,`rgba(188,89,209,${0.11+0.04*br+0.07*bp})`);g.addColorStop(0.55,`rgba(142,50,195,${0.05+0.02*bp})`);g.addColorStop(1,'rgba(142,50,195,0)');
  bg.fillStyle=g;bg.fillRect(0,0,1920,1080);
  // dot grid: parallax with the camera, brightens on the kick
  const pitch=32,off=(t*3.2)%pitch, px=CAM.x*0.35, py=CAM.y*0.35, ps=1+(CAM.s-1)*0.35;
  bg.save();bg.translate(960+px,540+py);bg.rotate(CAM.r*0.35*Math.PI/180);bg.scale(ps,ps);bg.translate(-960,-540);
  bg.fillStyle=`rgba(142,50,195,${0.20+0.10*bp})`;
  for(let x=-2*pitch+off;x<1970+pitch;x+=pitch)for(let y=-2*pitch+off*0.6;y<1130+pitch;y+=pitch){bg.fillRect(x,y,1.7,1.7);}
  bg.restore();
  bg.save();bg.shadowColor='rgba(188,89,209,0.9)';bg.shadowBlur=14;
  for(const d of DUST){
    const y=(d.y - t*d.v)%1120; const yy=y<-20?y+1120:y;
    const tw=0.35+0.3*Math.sin(t*0.8+d.ph);
    bg.fillStyle=`rgba(188,89,209,${0.22*tw*d.s})`;
    bg.beginPath();bg.arc((d.x+Math.sin(t*0.22+d.ph)*24+px*1.4)%1920,yy+py*1.4,d.s*1.3,0,7);bg.fill();
  }
  bg.restore();
}
