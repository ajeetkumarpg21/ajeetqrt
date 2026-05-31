/* ═══════════════════════════════════════════════════════
   3D BACKGROUNDS — bg3d.js
   Uses Three.js loaded from CDN.
   Each page passes a theme: 'finance' | 'skills' | 'experience'
   | 'projects' | 'certifications' | 'blog' | 'gallery' |
   'jobs' | 'contact' | 'home'
   ═══════════════════════════════════════════════════════ */

(function() {
  const canvasEl = document.getElementById('bg3d');
  if (!canvasEl) return;
  const THEME = canvasEl.dataset.theme || 'home';

  // Wait for Three.js CDN to load
  function initScene() {
    if (typeof THREE === 'undefined') { setTimeout(initScene, 100); return; }

    const W = window.innerWidth, H = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    const objects = [];
    const clock = new THREE.Clock();

    // ─── Theme: HOME — floating glowing particles + connecting lines ───
    if (THEME === 'home') {
      const geo = new THREE.BufferGeometry();
      const count = 220;
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

    // ─── Theme: FINANCE / PROJECTS — orbiting torus rings ───
    if (THEME === 'finance' || THEME === 'projects') {
      const colors = [0x00f0b4, 0x7c6cf8, 0x00aaff, 0xffa500];
      for (let i = 0; i < 4; i++) {
        const geo = new THREE.TorusGeometry(6 + i * 4, 0.06, 16, 120);
        const mat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.12 + i*0.04 });
        const torus = new THREE.Mesh(geo, mat);
        torus.rotation.x = Math.random() * Math.PI;
        torus.rotation.y = Math.random() * Math.PI;
        scene.add(torus);
        objects.push({ type:'torus', mesh: torus, speedX: (Math.random()-0.5)*0.003, speedY: (Math.random()-0.5)*0.003 });
      }
      // floating spheres
      for (let i = 0; i < 10; i++) {
        const s = 0.1 + Math.random()*0.25;
        const geo = new THREE.SphereGeometry(s, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00f0b4, transparent: true, opacity: 0.2 + Math.random()*0.2 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*40, (Math.random()-0.5)*20);
        scene.add(mesh);
        objects.push({ type:'floatSphere', mesh, vy: (Math.random()-0.5)*0.02, initY: mesh.position.y });
      }
    }

    // ─── Theme: SKILLS — DNA helix ───
    if (THEME === 'skills') {
      const count = 80;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 8;
        const r = 6;
        const colors = [0x00f0b4, 0x7c6cf8];
        for (let side = 0; side < 2; side++) {
          const angle = t + side * Math.PI;
          const geo = new THREE.SphereGeometry(0.18, 8, 8);
          const mat = new THREE.MeshBasicMaterial({ color: colors[side], transparent: true, opacity: 0.4 });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(Math.cos(angle)*r, (i/count)*50-25, Math.sin(angle)*r);
          scene.add(mesh);
          objects.push({ type:'dna', mesh, t: t + side*Math.PI, idx: i, side });
        }
        // connector
        if (i % 4 === 0) {
          const lGeo = new THREE.CylinderGeometry(0.04, 0.04, r*2, 6);
          const lMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.15 });
          const cyl = new THREE.Mesh(lGeo, lMat);
          cyl.position.set(0, (i/count)*50-25, 0);
          cyl.rotation.z = Math.PI/2;
          scene.add(cyl);
        }
      }
    }

    // ─── Theme: EXPERIENCE — flowing grid / matrix rain ───
    if (THEME === 'experience') {
      for (let i = 0; i < 60; i++) {
        const h = 0.5 + Math.random() * 3;
        const geo = new THREE.BoxGeometry(0.15, h, 0.15);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00f0b4, transparent: true, opacity: 0.08 + Math.random()*0.1 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*50 + h/2, (Math.random()-0.5)*20);
        scene.add(mesh);
        objects.push({ type:'bar', mesh, speed: 0.01 + Math.random()*0.04, initY: mesh.position.y, range: 30 + Math.random()*20 });
      }
    }

    // ─── Theme: CERTIFICATIONS — floating shield/star shapes ───
    if (THEME === 'certifications') {
      for (let i = 0; i < 18; i++) {
        const sides = [3,4,5,6][Math.floor(Math.random()*4)];
        const geo = new THREE.CylinderGeometry(0.8+Math.random()*0.6, 0.8+Math.random()*0.6, 0.08, sides);
        const colors = [0x00f0b4, 0x7c6cf8, 0x00aaff, 0xffa500];
        const mat = new THREE.MeshBasicMaterial({ color: colors[i%4], transparent: true, opacity: 0.12 + Math.random()*0.12 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*50, (Math.random()-0.5)*30);
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        scene.add(mesh);
        objects.push({ type:'badge', mesh, rx:(Math.random()-0.5)*0.005, ry:(Math.random()-0.5)*0.005 });
      }
    }

    // ─── Theme: BLOG — scrolling text cubes ───
    if (THEME === 'blog') {
      for (let i = 0; i < 22; i++) {
        const s = 0.3 + Math.random()*1.2;
        const geo = new THREE.BoxGeometry(s*1.6, s, 0.08);
        const mat = new THREE.MeshBasicMaterial({ color: 0x7c6cf8, transparent: true, opacity: 0.06 + Math.random()*0.08 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*50, -5 - Math.random()*20);
        scene.add(mesh);
        objects.push({ type:'textRect', mesh, vy: -(0.02 + Math.random()*0.04) });
      }
    }

    // ─── Theme: GALLERY — photo frame grid ───
    if (THEME === 'gallery') {
      for (let i = 0; i < 16; i++) {
        const w = 1.5 + Math.random()*2;
        const h = 1 + Math.random()*1.5;
        const geo = new THREE.PlaneGeometry(w, h);
        const colors = [0x00f0b4, 0x7c6cf8, 0x00aaff, 0xffa500];
        const mat = new THREE.MeshBasicMaterial({ color: colors[i%4], transparent: true, opacity: 0.04 + Math.random()*0.06, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*70, (Math.random()-0.5)*50, -10 - Math.random()*20);
        mesh.rotation.z = (Math.random()-0.5)*0.4;
        scene.add(mesh);
        objects.push({ type:'frame', mesh, ry: (Math.random()-0.5)*0.003 });
      }
    }

    // ─── Theme: JOBS — upward floating nodes ───
    if (THEME === 'jobs') {
      for (let i = 0; i < 40; i++) {
        const geo = new THREE.OctahedronGeometry(0.2+Math.random()*0.3);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.15 + Math.random()*0.2 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*50, (Math.random()-0.5)*20);
        scene.add(mesh);
        objects.push({ type:'node', mesh, vy: 0.02+Math.random()*0.04, initX: mesh.position.x });
      }
    }

    // ─── Theme: CONTACT — wave grid ───
    if (THEME === 'contact') {
      const GRID = 20;
      const wavePoints = [];
      for (let xi = 0; xi < GRID; xi++) {
        for (let yi = 0; yi < GRID; yi++) {
          const geo = new THREE.SphereGeometry(0.12, 4, 4);
          const mat = new THREE.MeshBasicMaterial({ color: 0x00f0b4, transparent: true, opacity: 0.18 });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set((xi-GRID/2)*3.5, (yi-GRID/2)*3, -15);
          scene.add(mesh);
          wavePoints.push({ mesh, xi, yi });
        }
      }
      objects.push({ type:'waveGrid', points: wavePoints });
    }

    // ─── Animation loop ───
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      objects.forEach(obj => {
        switch(obj.type) {
          case 'particles': {
            const pos = obj.pts.geometry.attributes.position.array;
            for (let i = 0; i < obj.count; i++) {
              pos[i*3]   += obj.velocities[i].x;
              pos[i*3+1] += obj.velocities[i].y;
              if (Math.abs(pos[i*3]) > 40)   obj.velocities[i].x *= -1;
              if (Math.abs(pos[i*3+1]) > 30) obj.velocities[i].y *= -1;
            }
            obj.pts.geometry.attributes.position.needsUpdate = true;
            break;
          }
          case 'torus':
            obj.mesh.rotation.x += obj.speedX;
            obj.mesh.rotation.y += obj.speedY;
            break;
          case 'floatSphere':
            obj.mesh.position.y = obj.initY + Math.sin(t * 0.8 + obj.mesh.position.x) * 2;
            break;
          case 'dna':
            // gentle sway
            obj.mesh.rotation.x = Math.sin(t * 0.3) * 0.1;
            break;
          case 'bar':
            obj.mesh.position.y += obj.speed;
            if (obj.mesh.position.y > obj.range/2) obj.mesh.position.y = -obj.range/2;
            break;
          case 'badge':
            obj.mesh.rotation.x += obj.rx;
            obj.mesh.rotation.y += obj.ry;
            obj.mesh.position.y += Math.sin(t * 0.5 + obj.mesh.position.x) * 0.005;
            break;
          case 'textRect':
            obj.mesh.position.y += obj.vy;
            if (obj.mesh.position.y < -30) obj.mesh.position.y = 30;
            break;
          case 'frame':
            obj.mesh.rotation.y += obj.ry;
            obj.mesh.position.y = obj.mesh.position.y; // static
            break;
          case 'node':
            obj.mesh.position.y += obj.vy;
            obj.mesh.rotation.y += 0.02;
            if (obj.mesh.position.y > 30) obj.mesh.position.y = -30;
            break;
          case 'waveGrid':
            obj.points.forEach(wp => {
              wp.mesh.position.z = -15 + Math.sin(t * 1.5 + wp.xi * 0.5 + wp.yi * 0.5) * 2;
              wp.mesh.material.opacity = 0.08 + Math.abs(Math.sin(t + wp.xi * 0.3)) * 0.18;
            });
            break;
        }
      });

      // Gentle scene rotation on mouse
      scene.rotation.y = mouse.x * 0.04;
      scene.rotation.x = mouse.y * 0.02;

      renderer.render(scene, camera);
    }

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5);
      mouse.y = (e.clientY / window.innerHeight - 0.5);
    });

    animate();
  }

  initScene();
})();
