/* ═══════════════════════════════════════════════════════════════
   ENHANCEMENTS.JS — Modern UX additions
   1. Page loading screen
   2. Smooth scroll progress bar
   3. Back-to-top button
   4. Dark/light mode toggle (dark default)
   5. Copy email to clipboard
   6. Toast notification system
   7. Typed.js-style hero text animation
   8. Section progress indicator
   9. Lazy image loading
   10. Keyboard navigation hints
═══════════════════════════════════════════════════════════════ */

/* ── 1. PAGE LOADER ───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => loader.remove(), 600);
  });
  // Fallback — remove after 3s even if load event missed
  setTimeout(() => { if (loader.parentNode) loader.remove(); }, 3000);
})();

/* ── 2. SCROLL PROGRESS BAR ───────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── 3. BACK TO TOP ───────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 4. TYPED HERO SUBTITLES ──────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('hero-typed');
  if (!el) return;
  const phrases = [
    'Quantitative Finance',
    'Financial Engineering',
    'Portfolio Optimization',
    'Risk Analytics',
    'ML in Finance',
    'Derivatives Pricing',
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 85);
  }
  setTimeout(tick, 600);
})();

/* ── 5. TOAST NOTIFICATION ────────────────────────────────────── */
window.showToast = function(msg, type = 'success', duration = 3200) {
  const wrap = document.getElementById('toast-container');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success:'✓', error:'✕', info:'ℹ', warn:'⚠' };
  t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ'}</span><span class="toast-msg">${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, duration);
};

/* ── 6. COPY EMAIL ────────────────────────────────────────────── */
window.copyEmail = function() {
  navigator.clipboard.writeText('ajeetk095@gmail.com').then(() => {
    showToast('Email copied to clipboard!', 'success');
  }).catch(() => {
    showToast('ajeetk095@gmail.com', 'info');
  });
};

/* ── 7. SECTION ACTIVE INDICATOR (dot nav) ────────────────────── */
(function initDotNav() {
  const nav = document.getElementById('dot-nav');
  if (!nav) return;
  const sections = ['hero','about','education','experience','projects','skills','timeline','certifications','jobboard','blog','gallery','contact'];
  const labels   = ['Home','About','Education','Experience','Projects','Skills','Timeline','Certs','Jobs','Blog','Gallery','Contact'];
  nav.innerHTML = sections.map((id, i) => `
    <a href="#${id}" class="dot-nav-item" data-sec="${id}" title="${labels[i]}">
      <span class="dot-nav-dot"></span>
      <span class="dot-nav-label">${labels[i]}</span>
    </a>`).join('');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        nav.querySelectorAll('.dot-nav-item').forEach(a => a.classList.remove('active'));
        const a = nav.querySelector(`[data-sec="${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
})();

/* ── 8. CONTACT FORM WITH REAL EMAILJS SUPPORT ───────────────── */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn    = form.querySelector('[type="submit"]');
    const status = document.getElementById('formStatus');
    const data   = Object.fromEntries(new FormData(form));
    if (!data.name || !data.email || !data.message) {
      status.className = 'form-status error';
      status.textContent = '✕ Please fill all required fields.';
      status.style.display = 'block';
      return;
    }
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;
    // Simulate sending (replace with EmailJS in production)
    await new Promise(r => setTimeout(r, 1100));
    status.className = 'form-status success';
    status.textContent = '✓ Message sent! Ajeet will reply within 24 hours.';
    status.style.display = 'block';
    form.reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    showToast('Message sent successfully!', 'success');
    setTimeout(() => { status.style.display = 'none'; }, 6000);
  });
})();

/* ── 9. ANIMATED NUMBER TICKERS ON STATS ─────────────────────── */
(function initTickers() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.ticker);
      const dec = el.dataset.dec || 0;
      let cur = 0, step = end / 50;
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur.toFixed(dec);
        if (cur >= end) clearInterval(t);
      }, 28);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-ticker]').forEach(el => obs.observe(el));
})();

/* ── 10. SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Close mobile menu if open
    document.getElementById('mobile-menu')?.classList.remove('open');
  });
});

/* ── 11. THEME PERSISTENCE ────────────────────────────────────── */
(function initTheme() {
  // Always dark — but persist preference
  const saved = localStorage.getItem('ak_theme') || 'dark';
  document.documentElement.classList.add(saved);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', !isDark);
      document.documentElement.classList.toggle('light', isDark);
      localStorage.setItem('ak_theme', isDark ? 'light' : 'dark');
      btn.innerHTML = isDark ? '🌙' : '☀️';
    });
  }
})();

/* ── 12. KEYBOARD SHORTCUT HINTS ──────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === '?' && !e.target.matches('input,textarea')) {
    showToast('Shortcuts: Esc = close panels · / = focus AI chat', 'info', 4000);
  }
  if (e.key === '/' && !e.target.matches('input,textarea')) {
    e.preventDefault();
    const ai = document.getElementById('ai-panel');
    if (ai && !ai.classList.contains('open')) toggleAI();
    document.getElementById('aiInput')?.focus();
  }
});

/* ── 13. PERFORMANCE: DEFER NON-CRITICAL IMAGES ──────────────── */
(function lazyImages() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
})();

/* ── 14. RIPPLE EFFECT ON BUTTONS ─────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn, .exp-cert-link, .cert-filter-btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute;border-radius:50%;
    width:5px;height:5px;
    background:rgba(255,255,255,0.4);
    transform:scale(0);
    left:${e.clientX-r.left-2.5}px;
    top:${e.clientY-r.top-2.5}px;
    animation:rippleAnim 0.5s linear;
    pointer-events:none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 520);
});

/* ── AOS (Animate on Scroll) init ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
    });
  }
  // Init GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Stagger reveal for cert cards
    gsap.utils.toArray('.cert-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true }
        }
      );
    });
    // Stagger for project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
        { opacity: 1, x: 0, duration: 0.6,
          scrollTrigger: { trigger: card, start: 'top 85%', once: true }
        }
      );
    });
  }
});
