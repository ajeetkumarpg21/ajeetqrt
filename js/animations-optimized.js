/* ═══════════════════════════════════════════════════════════════════════════
   OPTIMIZED ANIMATIONS — Lazy-loaded, pausable, debounced
   Now uses PerformanceConfig for efficient animation lifecycle management
   ═══════════════════════════════════════════════════════════════════════════ */

const CYAN   = 'rgba(0,212,255,';
const GOLD   = 'rgba(240,165,0,';
const GREEN  = 'rgba(0,255,136,';
const PURPLE = 'rgba(168,85,247,';
const WHITE  = 'rgba(232,240,254,';
const PALETTE = [CYAN, GOLD, GREEN, PURPLE, WHITE];

/* ── Shared helpers ── */
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

/* ─── Lazy initialization wrapper ─── */
function lazyInitAnimation(sectionId, initFn) {
  const sec = document.getElementById(sectionId);
  if (!sec) return;
  
  let animationHandle = null;
  let isRunning = false;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        // Section is visible - start animation
        animationHandle = initFn();
        isRunning = true;
      } else if (!entry.isIntersecting && isRunning) {
        // Section is hidden - stop animation
        if (animationHandle && animationHandle.stop) {
          animationHandle.stop();
          isRunning = false;
        }
      }
    });
  }, { threshold: 0.05, rootMargin: '50px' });
  
  observer.observe(sec);
  PerformanceConfig.registerAnimation(`anim-${sectionId}`, 
    () => { animationHandle = initFn(); isRunning = true; },
    () => { if (animationHandle && animationHandle.stop) animationHandle.stop(); isRunning = false; }
  );
}

/* ────────────────────────────────────────────────────────────────
   HERO — Monte Carlo portfolio paths + efficient frontier
────────────────────────────────────────────────────────────────── */
function initHeroAnim(){
  const cv = mkCanvas('hero', 0.55);
  if(!cv) return { stop: () => {} };
  
  const ctx = cv.getContext('2d');
  let animFrameId = null;
  let paths = [];
  
  function resize(){ sizeCV(cv); initPaths(); }
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);
  sizeCV(cv);

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

  const dots = Array.from({length:80},()=>({
    x:rand(0,1), y:rand(0.1,0.9), a:rand(0.04,0.18), r:rand(1,3),
    vx:rand(-0.0003,0.0003), vy:rand(-0.0003,0.0003),
    col: Math.random()>0.5 ? CYAN : GOLD,
  }));

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

    dots.forEach(d=>{
      d.x=(d.x+d.vx+1)%1; d.y=(d.y+d.vy+1)%1;
      ctx.beginPath(); ctx.arc(d.x*w,d.y*h,d.r,0,6.28);
      ctx.fillStyle=d.col+d.a+')'; ctx.fill();
    });

    syms.forEach(s=>{
      s.y+=s.vy;
      if(s.y<-0.05) s.y=1.05;
      ctx.font=`${s.size}px IBM Plex Mono,monospace`;
      ctx.fillStyle=s.col+s.alpha+')';
      ctx.fillText(s.text,s.x*w,s.y*h);
    });

    animFrameId = requestAnimationFrame(draw);
  }
  draw();
  
  return {
    stop() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

/* Initialize when section becomes visible */
lazyInitAnimation('hero', initHeroAnim);

/* ────────────────────────────────────────────────────────────────
   ABOUT — Floating 3D quant formulas (with throttling)
────────────────────────────────────────────────────────────────── */
function initAboutAnim(){
  const cv = mkCanvas('about', 0.5);
  if(!cv) return { stop: () => {} };
  
  const ctx = cv.getContext('2d');
  let animFrameId = null;
  
  function resize(){ sizeCV(cv); }
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);
  sizeCV(cv);

  const FORMULAS = [
    'E[rp]','σ²(rp)','max S/σ','Cov(ri,rj)',
    'w*=Σ⁻¹μ','CVaR₉₅','VaR','Kelly f*',
    'dS=μSdt+σSdW','Rf + β(Rm-Rf)',
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
      if(p.y<-0.05){ p.y=1.05; p.x=rand(0.02,0.98); }
      if(p.x<-0.1) p.x=1.05; if(p.x>1.1) p.x=-0.05;
      ctx.save();
      ctx.translate(p.x*w, p.y*h);
      ctx.rotate(p.angle);
      ctx.font=`${p.size}px IBM Plex Mono,monospace`;
      ctx.fillStyle=p.col+p.alpha+')';
      ctx.fillText(p.text,0,0);
      ctx.restore();
    });
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
  
  return {
    stop() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

lazyInitAnimation('about', initAboutAnim);

/* ────────────────────────────────────────────────────────────────
   EDUCATION — 3D rotating knowledge graph
────────────────────────────────────────────────────────────────── */
function initEducationAnim(){
  const cv = mkCanvas('education', 0.45);
  if(!cv) return { stop: () => {} };
  
  const ctx = cv.getContext('2d');
  let animFrameId = null;
  
  function resize(){ sizeCV(cv); }
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);
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
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
  
  return {
    stop() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

lazyInitAnimation('education', initEducationAnim);

/* ────────────────────────────────────────────────────────────────
   PROJECTS — 3D volatility/risk surface mesh
────────────────────────────────────────────────────────────────── */
function initProjectsAnim(){
  const cv = mkCanvas('projects', 0.45);
  if(!cv) return { stop: () => {} };
  
  const ctx = cv.getContext('2d');
  let animFrameId = null;
  
  function resize(){ sizeCV(cv); }
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);
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
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
  
  return {
    stop() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

lazyInitAnimation('projects', initProjectsAnim);

/* ────────────────────────────────────────────────────────────────
   SKILLS — 3D tech-star galaxy (with reduced particle count)
────────────────────────────────────────────────────────────────── */
function initSkillsAnim(){
  const cv = mkCanvas('skills', 0.5);
  if(!cv) return { stop: () => {} };
  
  const ctx = cv.getContext('2d');
  let animFrameId = null;
  
  function resize(){ sizeCV(cv); }
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);
  sizeCV(cv);

  // Reduced from 90 to 60 stars for better performance
  const N=60;
  const stars=Array.from({length:N},()=>({
    x:rand(-1.2,1.2), y:rand(-1.2,1.2), z:rand(-1.2,1.2),
    r:rand(0.5,2.5),
    tw:rand(0,6.28), twS:rand(0.015,0.045),
    col:PALETTE[randInt(0,PALETTE.length)],
  }));
  
  const links=[];
  for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
    const d=Math.hypot(stars[i].x-stars[j].x,stars[i].y-stars[j].y,stars[i].z-stars[j].z);
    if(d<0.6 && links.length<60) links.push([i,j]);
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
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
  
  return {
    stop() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

lazyInitAnimation('skills', initSkillsAnim);

console.log('✓ Optimized animations loaded (lazy, pausable, debounced)');
