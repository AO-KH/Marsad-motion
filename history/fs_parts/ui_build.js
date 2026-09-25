/* the Marsad web app window (S6/S7), assembled from the site kit */
const uiSite=$('uiSite');
uiSite.innerHTML=SK.chrome('pulse')+SK.sidebar('dec',0,'skSideDec')+SK.pulseContent()+SK.decContent();
const tabEls67=[...uiSite.querySelectorAll('.sk-tab')];
const tabPulse=uiSite.querySelector('.sk-tab[data-k="pulse"]'),tabDec=uiSite.querySelector('.sk-tab[data-k="dec"]');
const ulEl=$('skUL');
const UL_P=[1655.5-62.5,125],UL_D=[1402.5-39.5,79];
const sideDec=$('skSideDec');
const sideItems=[...sideDec.querySelectorAll('.sk-item')];
const recEls=[...$('recRows').children];
const statEls=[...$('stats').children];          // left→right: حرجة, مرفوضة, موافق عليها, قيد المراجعة
const segEls=[...$('segTabs').children];
const K_UI=0.7173;                                // .site natural 1896px → 1360px window
function offsetIn(el,root){let x=0,y=0;while(el&&el!==root){x+=el.offsetLeft;y+=el.offsetTop;el=el.offsetParent;}return [x,y];}
/* approve-button centre in #uiWrap coords, accounting for the card's forward lift */
function btnTarget(lift){
  const b=$('btnOK'),c=$('decCard');
  const [bx,by]=offsetIn(b,uiSite),[cx,cy]=offsetIn(c,uiSite);
  const bc=[bx+b.offsetWidth/2,by+b.offsetHeight/2],cc=[cx+c.offsetWidth/2,cy+c.offsetHeight/2];
  return [(cc[0]+(bc[0]-cc[0])*lift)*K_UI,(cc[1]+(bc[1]-cc[1])*lift)*K_UI];
}
/* S9 assistant icons */
$('botHead').innerHTML=SK.ic('bot',24,'#fff',2);
$('ansAv').innerHTML=SK.ic('bot',26,'#fff',2);
$('wsChip').insertAdjacentHTML('beforeend',SK.ic('chevDown',18,'#52505A',2));
$('sendBtn').innerHTML=SK.ic('send',30,'#fff',2);

/* S10 wall of the site's pages */
const WALL_PAGES=['pulse','home','decisions','knowledgeMap','assistant','objectTypes','links','search','projects','admin'];
{const wall=$('wall');const TW=600,TH=335,GAP=44,COLS=5,ROWS=5;
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
   const img=document.createElement('img');img.className='wtile';
   img.src='site_pages/'+WALL_PAGES[(r*COLS+c+r*3)%WALL_PAGES.length]+'.png';
   st(img,{left:c*(TW+GAP)+'px',top:r*(TH+GAP)+'px',width:TW+'px',height:TH+'px'});wall.appendChild(img);}}

