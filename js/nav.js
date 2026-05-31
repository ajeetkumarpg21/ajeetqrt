/* ═══════════════════════════════════════════
   SHARED NAV + UTILITIES — nav.js
   Included on every page
   ═══════════════════════════════════════════ */

// ── Nav scroll
const navbar = document.getElementById('navbar');
if (navbar) window.addEventListener('scroll', () =>
  navbar.classList.toggle('scrolled', window.scrollY > 30));

// ── Mobile hamburger
const ham = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (ham && navLinks) ham.addEventListener('click', () => navLinks.classList.toggle('open'));

// ── Active nav link
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.href === location.href) a.classList.add('active');
});

// ── Scroll reveal
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('up'); revObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ── Animated counters
function animateCounter(el) {
  const target = +el.dataset.target;
  let cur = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(timer);
  }, 20);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

// ── Skill bars
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.skill-bar-fill');
      if (fill) fill.style.width = fill.dataset.w + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar').forEach(el => barObs.observe(el));

// ── Transcript toggles
document.querySelectorAll('[data-toggle-transcript]').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = document.getElementById(btn.dataset.toggleTranscript);
    if (!body) return;
    const open = body.classList.toggle('open');
    btn.textContent = open ? '▲ Hide Transcript' : '▼ View Transcript';
  });
});

// ── Cert filter tabs
document.querySelectorAll('.cert-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cert-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('[data-cat]').forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// ── AI Chat toggle
const aiFab = document.getElementById('aiFab');
const aiModal = document.getElementById('aiModal');
if (aiFab && aiModal) aiFab.addEventListener('click', () => aiModal.classList.toggle('open'));
document.querySelectorAll('.ai-close').forEach(b => b.addEventListener('click', () => aiModal && aiModal.classList.remove('open')));

// ── Contact form submit
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    if (!name || !email || !message) return showMsg('Fill all required fields.', false);
    btn.textContent = 'Sending…'; btn.disabled = true;
    await new Promise(r => setTimeout(r, 900));
    showMsg('Message sent! Ajeet will reply soon.', true);
    contactForm.reset();
    btn.textContent = 'Send Message'; btn.disabled = false;
  });
}
function showMsg(msg, ok) {
  let el = document.getElementById('formMsg');
  if (!el) { el = document.createElement('div'); el.id = 'formMsg'; contactForm.appendChild(el); }
  el.textContent = msg;
  el.style.cssText = `margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;
    background:${ok ? 'rgba(0,240,180,.1)' : 'rgba(255,80,80,.1)'};
    color:${ok ? '#00f0b4' : '#ff5050'};
    border:1px solid ${ok ? 'rgba(0,240,180,.3)' : 'rgba(255,80,80,.3)'}`;
}



// ── Card mouse glow tracking ─────────────────────────────────────────────
document.querySelectorAll('.card, .proj-card, .cert-card, .blog-card, .exp-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    c.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});
