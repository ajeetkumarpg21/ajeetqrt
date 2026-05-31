/* ═══════════════════════════════════════════════════════════════════════════
   3D BACKGROUNDS LAZY LOADER — Load Three.js only when needed
   ═══════════════════════════════════════════════════════════════════════════ */

const BG3DLazy = {
  initialized: false,
  pendingInit: false,
  
  /**
   * Initialize 3D background when visible
   */
  init() {
    if (this.initialized || this.pendingInit) return;
    
    this.pendingInit = true;
    
    // Check if Three.js is already loaded
    if (typeof THREE === 'undefined') {
      // Wait for Three.js to load
      const checkThree = () => {
        if (typeof THREE !== 'undefined') {
          this.createScene();
        } else {
          setTimeout(checkThree, 100);
        }
      };
      checkThree();
    } else {
      this.createScene();
    }
  },
  
  /**
   * Create Three.js scene
   */
  createScene() {
    const canvasEl = document.getElementById('bg3d');
    if (!canvasEl) {
      this.pendingInit = false;
      return;
    }
    
    const THEME = canvasEl.dataset.theme || 'home';
    const W = window.innerWidth, H = window.innerHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasEl, 
      alpha: true, 
      antialias: true,
      powerPreference: 'low-power' // Reduce power consumption
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
    
    const objects = [];
    const clock = new THREE.Clock();
    
    // Simple theme implementation (HOME theme only for now)
    if (THEME === 'home') {
      const geo = new THREE.BufferGeometry();
      const count = 150; // Reduced from 220
      const positions = new Float32Array(count * 3);
      const velocities = [];
      
      for (let i = 0; i < count; i++) {
        positions[i*3]   = (Math.random()-0.5)*80;
        positions[i*3+1] = (Math.random()-0.5)*60;
        positions[i*3+2] = (Math.random()-0.5)*40;
        velocities.push({ x:(Math.random()-0.5)*.02, y:(Math.random()-0.5)*.02, z:0 });
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color: 0x00f0b4, size: 0.18, transparent: true, opacity: 0.7 });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      objects.push({ type:'particles', pts, positions, velocities, count });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      
      objects.forEach(obj => {
        if (obj.type === 'particles') {
          const pos = obj.pts.geometry.attributes.position.array;
          for (let i = 0; i < obj.count; i++) {
            pos[i*3]   += obj.velocities[i].x;
            pos[i*3+1] += obj.velocities[i].y;
            if (Math.abs(pos[i*3]) > 40)   obj.velocities[i].x *= -1;
            if (Math.abs(pos[i*3+1]) > 30) obj.velocities[i].y *= -1;
          }
          obj.pts.geometry.attributes.position.needsUpdate = true;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    
    this.initialized = true;
    this.pendingInit = false;
    console.log('✓ 3D background initialized');
  },
};

// Setup lazy loading trigger
if (document.getElementById('bg3d')) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !BG3DLazy.initialized) {
        BG3DLazy.init();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(document.getElementById('bg3d'));
  
  // Fallback: init after 2s if not visible
  setTimeout(() => {
    if (!BG3DLazy.initialized && !BG3DLazy.pendingInit) {
      BG3DLazy.init();
    }
  }, 2000);
}
