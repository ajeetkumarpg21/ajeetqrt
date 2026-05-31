const GOLD   = 'rgba(240,165,0,';
const GREEN  = 'rgba(0,255,136,';
const PURPLE = 'rgba(168,85,247,';
const WHITE  = 'rgba(232,240,254,';
const PALETTE = [CYAN, GOLD, GREEN, PURPLE, WHITE];

/* ── shared helpers ── */
function mkCanvas(sectionId, opacity){
  const sec = document.getElementById(sectionId);
  if(!sec) return null;
  if(getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
  sec.style.overflow = 'hidden';
  const cv = document.createElement('canvas');
  cv.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:0;opacity:${opacity||0.5};`;
  sec.insertBefore(cv, sec.firstChild);
  return cv;
}
function sizeCV(cv){
  const p = cv.parentElement;
  if(!p) return;
  cv.width  = p.offsetWidth  || window.innerWidth;
  cv.height = p.offsetHeight || 500;
}
function rand(a,b){ return a + Math.random()*(b-a); }
function randInt(a,b){ return Math.floor(rand(a,b)); }
function pickColor(){ return PALETTE[randInt(0,PALETTE.length)]; }

/* ─────────────────────────────────────────────────────────────────
   HERO — Monte Carlo portfolio paths + efficient-frontier scatter
──────────────────────────────────────────────────────────────────*/
(function heroAnim(){
  const cv = mkCanvas('hero', 0.55);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); initPaths(); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  let paths = [];
  function initPaths(){
    paths = [];
    const w = cv.width, h = cv.height;
    for(let i=0;i<32;i++){
      const pts=[];
      let y = rand(h*0.2, h*0.8);
      const drift = rand(-0.6,0.4);
      const vol   = rand(0.6,2.0);
      const steps = 90;
      for(let s=0;s<=steps;s++){
        pts.push({ x: (s/steps)*w, y });
        y += drift + (Math.random()-0.5)*vol*(h/38);
        y  = Math.max(h*0.04, Math.min(h*0.96, y));
      }
      paths.push({
        pts, progress: Math.random(),
        speed: rand(0.002,0.006),
        col: Math.random()>0.55 ? CYAN : (Math.random()>0.5 ? GOLD : GREEN),
      });
    }
  }
  initPaths();

  /* Scatter dots (frontier cloud) */
  const dots = Array.from({length:80},()=>({
    x:rand(0,1), y:rand(0.1,0.9), a:rand(0.04,0.18), r:rand(1,3),
    vx:rand(-0.0003,0.0003), vy:rand(-0.0003,0.0003),
    col: Math.random()>0.5 ? CYAN : GOLD,
  }));

  /* Floating financial symbols */
  const SYMS = ['α','β','σ','μ','Σ','Δ','λ','ρ','∂','∫','√','≈'];
  const syms = Array.from({length:14},()=>({
    x:rand(0.05,0.95), y:rand(0.05,0.95),
    vy:rand(-0.00025,-0.0001), alpha:rand(0.04,0.1),
    size:rand(12,22), text:SYMS[randInt(0,SYMS.length)],
    col: Math.random()>0.5 ? CYAN : GOLD,
  }));

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);

    /* paths */
    paths.forEach(p=>{
      p.progress=(p.progress+p.speed)%1.15;
      const vis=Math.min(p.progress,1);
      const n=Math.floor(vis*p.pts.length);
      if(n<2) return;
      ctx.beginPath();
      ctx.moveTo(p.pts[0].x,p.pts[0].y);
      for(let i=1;i<n;i++) ctx.lineTo(p.pts[i].x,p.pts[i].y);
      ctx.strokeStyle=p.col+(0.06+0.12*vis)+')';
      ctx.lineWidth=0.9;
      ctx.stroke();
      const tip=p.pts[n-1];
      ctx.beginPath(); ctx.arc(tip.x,tip.y,2.2,0,6.28);
      ctx.fillStyle=p.col+'0.65)'; ctx.fill();
    });

    /* frontier dots */
    dots.forEach(d=>{
      d.x=(d.x+d.vx+1)%1; d.y=(d.y+d.vy+1)%1;
      ctx.beginPath(); ctx.arc(d.x*w,d.y*h,d.r,0,6.28);
      ctx.fillStyle=d.col+d.a+')'; ctx.fill();
    });

    /* symbols */
    syms.forEach(s=>{
      s.y+=s.vy;
      if(s.y<-0.05) s.y=1.05;
      ctx.font=`${s.size}px IBM Plex Mono,monospace`;
      ctx.fillStyle=s.col+s.alpha+')';
      ctx.fillText(s.text,s.x*w,s.y*h);
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   ABOUT — Floating 3-D quant formulas
──────────────────────────────────────────────────────────────────*/
(function aboutAnim(){
  const cv = mkCanvas('about', 0.5);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const FORMULAS = [
    'E[rp]','σ²(rp)','max S/σ','Cov(ri,rj)',
    'w*=Σ⁻¹μ','CVaR₉₅','VaR','Kelly f*',
    'dS=μSdt+σSdW','Rf + β(Rm-Rf)',
    'Fama-French','HML','SMB','RMW','CMA',
    'Black-Litterman','Ledoit-Wolf','MVO',
    'Σw=1','E[r]-λσ²','OLS β̂','FF5',
    'sharpe','sortino','calmar','max DD',
  ];

  const particles = Array.from({length:24},()=>({
    x:rand(0.02,0.98), y:rand(0.02,0.98),
    vx:rand(-0.00035,0.00035), vy:rand(-0.00028,-0.00008),
    text:FORMULAS[randInt(0,FORMULAS.length)],
    size:rand(10,18), alpha:rand(0.05,0.13),
    angle:rand(-0.3,0.3), dAngle:rand(-0.008,0.008),
    col: Math.random()>0.5 ? CYAN : GOLD,
  }));

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.angle+=p.dAngle;
      if(p.y<-0.05){ p.y=1.05; p.x=rand(0.02,0.98);
        p.text=FORMULAS[randInt(0,FORMULAS.length)]; }
      if(p.x<-0.1) p.x=1.05; if(p.x>1.1) p.x=-0.05;
      ctx.save();
      ctx.translate(p.x*w, p.y*h);
      ctx.rotate(p.angle);
      ctx.font=`${p.size}px IBM Plex Mono,monospace`;
      ctx.fillStyle=p.col+p.alpha+')';
      ctx.fillText(p.text,0,0);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   EDUCATION — 3-D rotating knowledge graph
──────────────────────────────────────────────────────────────────*/
(function eduAnim(){
  const cv = mkCanvas('education', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const N=45;
  const nodes=Array.from({length:N},()=>({
    x:rand(-1.1,1.1), y:rand(-1.1,1.1), z:rand(-1.1,1.1),
    vx:rand(-0.002,0.002), vy:rand(-0.002,0.002), vz:rand(-0.002,0.002),
    r:rand(1.5,3.5),
    col: Math.random()>0.5 ? CYAN : (Math.random()>0.5 ? GOLD : GREEN),
  }));
  const edges=[];
  for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
    const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y,nodes[i].z-nodes[j].z);
    if(d<0.85 && edges.length<65) edges.push([i,j]);
  }

  let aY=0, aX=0.25;
  function proj(x,y,z,w,h){
    const cy=Math.cos(aY),sy=Math.sin(aY);
    const cx=Math.cos(aX),sx=Math.sin(aX);
    const rx=x*cy-z*sy, rz=x*sy+z*cy;
    const ry=y*cx-rz*sx, rz2=y*sx+rz*cx;
    const sc=3/(3+rz2+2);
    return { sx:w/2+rx*sc*Math.min(w,h)*0.34, sy:h/2+ry*sc*Math.min(w,h)*0.34, sc };
  }

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    aY+=0.0025; aX+=0.0008;
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy; n.z+=n.vz;
      if(Math.abs(n.x)>1.2) n.vx*=-1;
      if(Math.abs(n.y)>1.2) n.vy*=-1;
      if(Math.abs(n.z)>1.2) n.vz*=-1;
    });
    const P=nodes.map(n=>proj(n.x,n.y,n.z,w,h));
    edges.forEach(([i,j])=>{
      const pi=P[i],pj=P[j];
      ctx.beginPath(); ctx.moveTo(pi.sx,pi.sy); ctx.lineTo(pj.sx,pj.sy);
      ctx.strokeStyle=CYAN+(0.03+0.06*Math.min(pi.sc,pj.sc))+')';
      ctx.lineWidth=0.5; ctx.stroke();
    });
    P.forEach((p,i)=>{
      const r=nodes[i].r*p.sc*2;
      ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(0.5,r),0,6.28);
      ctx.fillStyle=nodes[i].col+(0.1+0.3*p.sc)+')'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   PROJECTS — 3-D volatility / risk surface mesh
──────────────────────────────────────────────────────────────────*/
(function projAnim(){
  const cv = mkCanvas('projects', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const COLS=20, ROWS=13;
  let t=0, aY=0.35;

  function getZ(i,j,time){
    const x=(i/COLS-0.5)*Math.PI*3.5;
    const y=(j/ROWS-0.5)*Math.PI*3.5;
    return Math.sin(x+time)*Math.cos(y+time*0.65)*0.38
         + Math.sin(x*0.5-time*0.4)*0.15;
  }
  function projPt(x,y,z,w,h){
    const cy=Math.cos(aY),sy=Math.sin(aY);
    const rx=x*cy-z*sy, rz=x*sy+z*cy;
    const tilt=0.48;
    const ry=y*Math.cos(tilt)-rz*Math.sin(tilt);
    const rz2=y*Math.sin(tilt)+rz*Math.cos(tilt);
    const sc=4/(4+rz2+2);
    return { sx:w/2+rx*sc*w*0.37, sy:h*0.5+ry*sc*h*0.44, sc };
  }

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    t+=0.011; aY+=0.0035;
    for(let i=0;i<COLS;i++){
      for(let j=0;j<ROWS;j++){
        const x0=(i/COLS-0.5)*2.2, y0=(j/ROWS-0.5)*1.6;
        const z0=getZ(i,j,t);
        const x1=((i+1)/COLS-0.5)*2.2;
        const z1=getZ(i+1,j,t);
        const y2=((j+1)/ROWS-0.5)*1.6;
        const z2=getZ(i,j+1,t);
        const p0=projPt(x0,y0,z0,w,h);
        const p1=projPt(x1,y0,z1,w,h);
        const p2=projPt(x0,y2,z2,w,h);
        const intensity=(z0+0.53)/1.06;
        const r=Math.round(intensity*0   +(1-intensity)*240);
        const g=Math.round(intensity*212 +(1-intensity)*165);
        const b=Math.round(intensity*255 +(1-intensity)*0);
        const a=0.06+0.09*p0.sc;
        ctx.strokeStyle=`rgba(${r},${g},${b},${a})`;
        ctx.lineWidth=0.5;
        ctx.beginPath(); ctx.moveTo(p0.sx,p0.sy); ctx.lineTo(p1.sx,p1.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p0.sx,p0.sy); ctx.lineTo(p2.sx,p2.sy); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   SKILLS — 3-D tech-star galaxy / constellation
──────────────────────────────────────────────────────────────────*/
(function skillsAnim(){
  const cv = mkCanvas('skills', 0.5);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const N=90;
  const stars=Array.from({length:N},()=>({
    x:rand(-1.2,1.2), y:rand(-1.2,1.2), z:rand(-1.2,1.2),
    r:rand(0.5,2.5),
    tw:rand(0,6.28), twS:rand(0.015,0.045),
    col:PALETTE[randInt(0,PALETTE.length)],
  }));
  const links=[];
  for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
    const d=Math.hypot(stars[i].x-stars[j].x,stars[i].y-stars[j].y,stars[i].z-stars[j].z);
    if(d<0.6 && links.length<90) links.push([i,j]);
  }
  let aY=0;
  function proj(x,y,z,w,h){
    const cy=Math.cos(aY),sy=Math.sin(aY);
    const rx=x*cy-z*sy, rz=x*sy+z*cy;
    const tilt=0.18;
    const ry=y*Math.cos(tilt)+rz*Math.sin(tilt);
    const rz2=-y*Math.sin(tilt)+rz*Math.cos(tilt);
    const sc=2.5/(2.5+rz2+2);
    return { sx:w/2+rx*sc*Math.min(w,h)*0.44, sy:h/2+ry*sc*Math.min(w,h)*0.44, sc };
  }
  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    aY+=0.0035;
    const P=stars.map((s,i)=>{ s.tw+=s.twS; return proj(s.x,s.y,s.z,w,h); });
    links.forEach(([i,j])=>{
      const pi=P[i],pj=P[j];
      ctx.beginPath(); ctx.moveTo(pi.sx,pi.sy); ctx.lineTo(pj.sx,pj.sy);
      ctx.strokeStyle=CYAN+(0.025+0.04*Math.min(pi.sc,pj.sc))+')';
      ctx.lineWidth=0.4; ctx.stroke();
    });
    P.forEach((p,i)=>{
      const s=stars[i];
      const tw=0.45+0.55*Math.sin(s.tw);
      const r=s.r*p.sc*2.8;
      const a=(0.12+0.38*tw)*p.sc;
      const grd=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,r*3.5);
      grd.addColorStop(0, s.col+a+')');
      grd.addColorStop(1, s.col+'0)');
      ctx.beginPath(); ctx.arc(p.sx,p.sy,r*3.5,0,6.28);
      ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(0.4,r),0,6.28);
      ctx.fillStyle=s.col+(a*1.8)+')'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   EXPERIENCE — 3-D DNA double helix career spiral
──────────────────────────────────────────────────────────────────*/
(function expAnim(){
  const cv = mkCanvas('experience', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  let t=0;
  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    t+=0.016;
    const N=70, amp=Math.min(w,h)*0.055;
    const pts1=[], pts2=[];
    for(let i=0;i<=N;i++){
      const prog=i/N;
      const y=h*0.04+prog*h*0.92;
      const ph=prog*Math.PI*7-t;
      pts1.push({x:w/2+Math.cos(ph)*amp, y, z:Math.sin(ph)});
      pts2.push({x:w/2+Math.cos(ph+Math.PI)*amp, y, z:Math.sin(ph+Math.PI)});
    }
    /* strand 1 */
    ctx.beginPath();
    pts1.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
    ctx.strokeStyle=CYAN+'0.18)'; ctx.lineWidth=1.4; ctx.stroke();
    /* strand 2 */
    ctx.beginPath();
    pts2.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
    ctx.strokeStyle=GOLD+'0.18)'; ctx.lineWidth=1.4; ctx.stroke();
    /* rungs & nodes */
    for(let i=0;i<=N;i+=5){
      const p1=pts1[i],p2=pts2[i];
      ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
      ctx.strokeStyle=GREEN+(0.05+0.1*Math.abs(p1.z))+')';
      ctx.lineWidth=0.7; ctx.stroke();
      [p1,p2].forEach((p,k)=>{
        const a=0.14+0.32*Math.abs(p.z);
        ctx.beginPath(); ctx.arc(p.x,p.y,2.5+Math.abs(p.z)*2.2,0,6.28);
        ctx.fillStyle=(k===0?CYAN:GOLD)+a+')'; ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   TIMELINE — Flowing quant data-particle stream
──────────────────────────────────────────────────────────────────*/
(function timelineAnim(){
  const cv = mkCanvas('timeline', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const pts=Array.from({length:70},()=>({
    t:Math.random(),
    speed:rand(0.0008,0.003),
    offset:rand(-55,55),
    r:rand(1,3),
    col:PALETTE[randInt(0,PALETTE.length)],
    a:rand(0.08,0.28),
  }));
  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    pts.forEach(p=>{
      p.t=(p.t+p.speed)%1;
      const x=w*0.5+p.offset;
      const y=h*0.04+p.t*h*0.92;
      const fade=Math.min(p.t*6,1)*Math.min((1-p.t)*6,1);
      ctx.beginPath(); ctx.arc(x,y,p.r,0,6.28);
      ctx.fillStyle=p.col+(p.a*fade)+')'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   CERTIFICATIONS — Animated hexagonal grid wave
──────────────────────────────────────────────────────────────────*/
(function certAnim(){
  const cv = mkCanvas('certifications', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const S=30;
  let t=0;
  function hexPts(cx,cy,r){
    return Array.from({length:6},(_,i)=>{
      const a=(Math.PI/3)*i-Math.PI/6;
      return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
    });
  }
  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    t+=0.007;
    const cols=Math.ceil(w/(S*1.75))+2, rows=Math.ceil(h/(S*1.5))+2;
    for(let row=-1;row<rows;row++){
      for(let col=-1;col<cols;col++){
        const cx=col*S*1.75+(row%2===0?0:S*0.875);
        const cy=row*S*1.5;
        const dist=Math.hypot(cx-w/2,cy-h/2);
        const wave=0.5+0.5*Math.sin(dist*0.013-t);
        const a=wave*0.08;
        if(a<0.004) continue;
        const pts=hexPts(cx,cy,S*0.46);
        ctx.beginPath();
        ctx.moveTo(pts[0][0],pts[0][1]);
        pts.forEach(p=>ctx.lineTo(p[0],p[1]));
        ctx.closePath();
        ctx.strokeStyle=GOLD+(a*1.6)+')';
        ctx.lineWidth=0.55; ctx.stroke();
        if(wave>0.82){ ctx.fillStyle=GOLD+(a*0.3)+')'; ctx.fill(); }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   JOB BOARD — Force-directed finance network graph
──────────────────────────────────────────────────────────────────*/
(function jobAnim(){
  const cv = mkCanvas('jobboard', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); init(); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  let nodes=[], edges=[];
  function init(){
    nodes=Array.from({length:38},()=>({
      x:rand(0,cv.width), y:rand(0,cv.height),
      vx:rand(-0.45,0.45), vy:rand(-0.45,0.45),
      r:rand(2,4.5), tw:rand(0,6.28),
      col:PALETTE[randInt(0,PALETTE.length)],
    }));
    edges=[];
    for(let i=0;i<nodes.length;i++)
      for(let j=i+1;j<nodes.length;j++)
        if(Math.random()<0.11 && edges.length<60) edges.push([i,j]);
  }
  init();

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy; n.tw+=0.025;
      if(n.x<0||n.x>w) n.vx*=-1;
      if(n.y<0||n.y>h) n.vy*=-1;
    });
    edges.forEach(([i,j])=>{
      const ni=nodes[i], nj=nodes[j];
      const d=Math.hypot(ni.x-nj.x,ni.y-nj.y);
      if(d>300) return;
      ctx.beginPath(); ctx.moveTo(ni.x,ni.y); ctx.lineTo(nj.x,nj.y);
      ctx.strokeStyle=CYAN+((1-d/300)*0.09)+')';
      ctx.lineWidth=0.5; ctx.stroke();
    });
    nodes.forEach(n=>{
      const pr=n.r+Math.sin(n.tw)*1.5;
      const grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,pr*3.5);
      grd.addColorStop(0, n.col+'0.14)');
      grd.addColorStop(1, n.col+'0)');
      ctx.beginPath(); ctx.arc(n.x,n.y,pr*3.5,0,6.28);
      ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,6.28);
      ctx.fillStyle=n.col+'0.32)'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   BLOG — Falling Python / quant code symbols
──────────────────────────────────────────────────────────────────*/
(function blogAnim(){
  const cv = mkCanvas('blog', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const SYMS=[
    'import','numpy','pandas','def','return','fit()',
    '0.92','1.21','87%','sharpe','print(',
    'σ','μ','cvxpy','scipy','# quant','MVO','α','β',
    'np.','pd.','.csv','plt.','max(','for i in',
    'sklearn','random','Monte Carlo','VaR','CVaR',
    'Black-Litterman','Kelly','OLS','backtest',
  ];
  const drops=Array.from({length:28},()=>({
    x:rand(0,1), y:rand(0,1),
    vy:rand(0.0004,0.0012),
    sym:SYMS[randInt(0,SYMS.length)],
    a:rand(0.05,0.12), size:rand(9,16),
    col:Math.random()>0.55?CYAN:GREEN,
  }));
  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    drops.forEach(d=>{
      d.y+=d.vy;
      if(d.y>1.05){ d.y=-0.05; d.x=rand(0,1); d.sym=SYMS[randInt(0,SYMS.length)]; }
      ctx.font=`${d.size}px IBM Plex Mono,monospace`;
      ctx.fillStyle=d.col+d.a+')';
      ctx.fillText(d.sym,d.x*w,d.y*h);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   GALLERY — 3-D wireframe rotating cubes & tetrahedra
──────────────────────────────────────────────────────────────────*/
(function galleryAnim(){
  const cv = mkCanvas('gallery', 0.45);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  /* cube edges */
  const CUBE_E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function cubeV(s){
    const h=s/2;
    return [[-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],
            [-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]];
  }
  /* tetrahedra edges */
  const TETRA_E=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  function tetraV(s){
    return [[0,s,0],[-s,-s/2,s],[s,-s/2,s],[0,-s/2,-s*1.2]];
  }
  function rot3(v,rx,ry,rz){
    let[x,y,z]=v;
    let ny=y*Math.cos(rx)-z*Math.sin(rx), nz=y*Math.sin(rx)+z*Math.cos(rx);
    y=ny; z=nz;
    let nx=x*Math.cos(ry)+z*Math.sin(ry); nz=-x*Math.sin(ry)+z*Math.cos(ry);
    x=nx; z=nz;
    nx=x*Math.cos(rz)-y*Math.sin(rz); ny=x*Math.sin(rz)+y*Math.cos(rz);
    return[nx,ny,nz];
  }
  function projV(x,y,z,w,h){
    const sc=5/(5+z+3);
    return[w/2+x*sc*Math.min(w,h)*0.2, h/2+y*sc*Math.min(w,h)*0.2];
  }

  const shapes=Array.from({length:10},()=>{
    const isCube=Math.random()>0.4;
    const sz=rand(0.12,0.22);
    return{
      cx:rand(-2.5,2.5), cy:rand(-2.5,2.5), cz:rand(-1,1),
      rx:rand(0,6.28), ry:rand(0,6.28), rz:rand(0,6.28),
      drx:rand(-0.007,0.007), dry:rand(-0.009,0.009), drz:rand(-0.005,0.005),
      verts: isCube ? cubeV(sz) : tetraV(sz),
      edges: isCube ? CUBE_E : TETRA_E,
      col: PALETTE[randInt(0,PALETTE.length)],
    };
  });

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    shapes.forEach(s=>{
      s.rx+=s.drx; s.ry+=s.dry; s.rz+=s.drz;
      const rv=s.verts.map(v=>{ const r=rot3(v,s.rx,s.ry,s.rz); return[r[0]+s.cx,r[1]+s.cy,r[2]+s.cz]; });
      const pv=rv.map(v=>projV(v[0],v[1],v[2],w,h));
      s.edges.forEach(([a,b])=>{
        ctx.beginPath(); ctx.moveTo(pv[a][0],pv[a][1]); ctx.lineTo(pv[b][0],pv[b][1]);
        ctx.strokeStyle=s.col+'0.1)'; ctx.lineWidth=0.7; ctx.stroke();
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────────────────────
   CONTACT — Radial signal ripples (radio / comm waves)
──────────────────────────────────────────────────────────────────*/
(function contactAnim(){
  const cv = mkCanvas('contact', 0.5);
  if(!cv) return;
  const ctx = cv.getContext('2d');
  function resize(){ sizeCV(cv); }
  window.addEventListener('resize', resize);
  sizeCV(cv);

  const ripples=[];
  function spawn(){
    const w=cv.width, h=cv.height;
    ripples.push({
      x:rand(w*0.15,w*0.85), y:rand(h*0.15,h*0.85),
      r:0, maxR:rand(90,160), a:0.2,
      col:Math.random()>0.5?CYAN:GOLD,
      spd:rand(0.7,1.3),
    });
  }
  for(let i=0;i<5;i++) spawn();

  function draw(){
    const w=cv.width, h=cv.height;
    ctx.clearRect(0,0,w,h);
    if(Math.random()<0.014 && ripples.length<14) spawn();
    for(let i=ripples.length-1;i>=0;i--){
      const rp=ripples[i];
      rp.r+=rp.spd;
      rp.a=0.2*(1-rp.r/rp.maxR);
      if(rp.r>=rp.maxR){ ripples.splice(i,1); continue; }
      for(let k=0;k<3;k++){
        const kr=rp.r-k*11;
        if(kr<=0) continue;
        ctx.beginPath(); ctx.arc(rp.x,rp.y,kr,0,6.28);
        ctx.strokeStyle=rp.col+(rp.a*(1-k*0.3))+')';
        ctx.lineWidth=1-k*0.25; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

})();
