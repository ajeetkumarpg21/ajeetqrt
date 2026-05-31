/* Cursor: using browser default */

/* ─── Card mouse tracking ─── */
document.querySelectorAll('.card, .holo-card, .cert-card, .proj-card, .exp-card, .job-card, .blog-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    c.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ─── Navbar scroll ─── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

/* ─── Active nav sections (include experience) ─── */
function updateActiveNav() {
  const secs = ['hero','about','education','experience','projects','skills','timeline','certifications','jobboard','blog','gallery','contact'];
  let cur = '';
  secs.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#'+cur);
  });
}

/* ─── Experience tab switcher ─── */
function switchExpTab(tab, btn) {
  // Only target tabs within the same section
  const section = btn.closest('section');
  section.querySelectorAll('.exp-tab').forEach(b => b.classList.remove('active'));
  section.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panelId = 'exp-' + tab;
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('active');
    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 50);
    });
  }
}

function toggleLearn(btn) {
  const body = btn.closest('.exp-card').querySelector('.exp-learn-body');
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open');
  btn.innerHTML = isOpen
    ? '<i class="fas fa-chevron-down"></i> Learning Outcomes'
    : '<i class="fas fa-chevron-up"></i> Hide Outcomes';
}

/* ─── Mobile menu ─── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});
function closeMobileMenu() { document.getElementById('mobile-menu').classList.remove('open'); }

/* ─── Reveal on scroll ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); e.target.classList.add('up'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ─── Counters ─── */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(t);
      }, 30);
      countObs.unobserve(el);
    }
  });
});
document.querySelectorAll('.counter').forEach(el => countObs.observe(el));

/* ─── Readiness bar ─── */
setTimeout(() => { document.getElementById('readinessFill').style.width = '93%'; }, 800);

/* ─── Skill bars ─── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(b => {
        setTimeout(() => b.style.width = b.dataset.w + '%', 200);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const skillsSection = document.getElementById('skills');
if (skillsSection) barObs.observe(skillsSection);

/* ─── Hero Mini Chart ─── */
(function() {
  const ctx = document.getElementById('heroMiniChart').getContext('2d');
  const days = 60;
  const base = Array.from({length:days}, (_,i) => {
    return 100 * Math.exp(Array.from({length:i+1}, () => (Math.random()-0.46)*0.02).reduce((a,b)=>a+b,0));
  });
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: base.map((_,i) => ''),
      datasets: [{
        data: base,
        borderColor: '#00d4ff',
        borderWidth: 1.5,
        fill: true,
        backgroundColor: 'rgba(0,212,255,0.05)',
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 2000, easing: 'easeInOutQuart' },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      plugins: { legend: { display: false } }
    }
  });
})();

/* ─── Radar Chart ─── */
(function() {
  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Portfolio\nOptimization','Derivatives &\nPricing','Econometrics\n& Stats','ML in\nFinance','Python\nProgramming','Risk\nAnalytics','Data\nVisualization'],
      datasets: [{
        label: 'Proficiency',
        data: [92, 85, 94, 87, 92, 88, 86],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.08)',
        borderWidth: 1.5,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#020408',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: 'rgba(0,212,255,0.1)' },
          grid: { color: 'rgba(0,212,255,0.1)' },
          pointLabels: {
            color: '#8899b0',
            font: { family: 'IBM Plex Mono', size: 9 }
          },
          ticks: { display: false, stepSize: 25 },
          suggestedMin: 0, suggestedMax: 100,
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
})();

/* ─── Project expand toggle ─── */
function toggleProject(btn) {
  const card = btn.closest('.project-card');
  const detail = card.querySelector('.project-detail');
  const isOpen = detail.classList.contains('open');
  detail.classList.toggle('open');
  btn.innerHTML = isOpen ? '<i class="fas fa-chevron-down"></i> Details' : '<i class="fas fa-chevron-up"></i> Less';
}

/* ─── Cert filter ─── */
function filterCerts(cat, btn) {
  document.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#certGrid .cert-card').forEach(c => {
    if (cat === 'all') { c.classList.remove('cert-hidden'); }
    else { c.classList.toggle('cert-hidden', c.dataset.cat !== cat); }
  });
}
function toggleMoreCerts() {
  const hidden = document.querySelectorAll('.cert-card.cert-hidden');
  const btn = document.getElementById('showMoreCerts');
  if (hidden.length > 0) {
    hidden.forEach(c => c.classList.remove('cert-hidden'));
    btn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
  } else {
    filterCerts('all', document.querySelector('.cert-filter-btn.active') || document.querySelector('.cert-filter-btn'));
    btn.innerHTML = '<i class="fas fa-plus"></i> Show All Certifications';
  }
}

/* ─── Gallery filter ─── */
function filterGallery(cat, btn) {
  document.querySelectorAll('.gallery-filter .cert-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#galleryGrid .gallery-item').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.gcat === cat) ? '' : 'none';
  });
}

/* ─── Modal system ─── */
// MODAL_DATA loaded from data/modal-data.js
;

function showModal(id) {
  const d = MODAL_DATA[id];
  if (!d) return;
  document.getElementById('modalIcon').textContent = d.icon;
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalIssuer').textContent = d.issuer;
  document.getElementById('modalBody').innerHTML = d.body;
  document.getElementById('modalDL').innerHTML = d.dl
    ? `<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.5rem">
        <a href="${d.dl}" target="_blank" class="btn btn-outline" style="font-size:0.78rem;padding:8px 18px">
          <i class="fas fa-eye"></i> View Document
        </a>
        <a href="${d.dl}" download class="btn btn-primary" style="font-size:0.78rem;padding:8px 18px">
          <i class="fas fa-download"></i> Download PDF
        </a>
       </div>` : '';
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(e) { if (e.target === document.getElementById('modalOverlay')) closeModalDirect(); }
function closeModalDirect() { document.getElementById('modalOverlay').classList.remove('open'); }

/* ─── Job Board ─── */
// JOBS loaded from data/jobs-data.js


function renderJobs(jobs) {
  const list = document.getElementById('job-list');
  if (!jobs.length) { list.innerHTML = '<div class="job-loading">No matching jobs found. Try adjusting filters.</div>'; return; }
  list.innerHTML = jobs.map(j => `
    <div class="job-card">
      <div>
        <div class="job-title">${j.title}</div>
        <div class="job-company">${j.company}</div>
        <div class="job-tags">${j.tags.map(t => `<span class="tag tag-cyan">${t}</span>`).join('')}</div>
      </div>
      <div class="job-right">
        <div class="job-match ${j.matchClass}">${j.match}% Match</div>
        <div class="job-location"><i class="fas fa-map-marker-alt"></i> ${j.location} · ${j.type}</div>
        <div style="margin-top:8px">
          <a href="https://www.indeed.com/jobs?q=${encodeURIComponent(j.title)}" target="_blank" class="btn btn-outline" style="padding:5px 12px;font-size:0.65rem">Apply →</a>
        </div>
      </div>
    </div>
  `).join('');
}

function loadJobs() {
  document.getElementById('job-list').innerHTML = '<div class="job-loading"><span class="job-spinner"></span> Fetching live opportunities...</div>';
  setTimeout(() => {
    JOBS.sort((a,b) => b.match - a.match);
    filterJobs();
  }, 1200);
}

function filterJobs() {
  const role = document.getElementById('jobRoleFilter')?.value || 'all';
  const loc = document.getElementById('jobLocationFilter')?.value || 'all';
  const type = document.getElementById('jobTypeFilter')?.value || 'all';
  let filtered = [...JOBS];
  if (role !== 'all') filtered = filtered.filter(j => j.role === role);
  if (loc !== 'all') filtered = filtered.filter(j => j.loc === loc || j.loc === 'remote');
  if (type !== 'all') filtered = filtered.filter(j => j.type.toLowerCase().includes(type));
  renderJobs(filtered);
}

window.addEventListener('load', () => { setTimeout(loadJobs, 500); });

/* ─── AI Assistant ─── */
let aiOpen = false;
function toggleAI() {
  aiOpen = !aiOpen;
  document.getElementById('ai-panel').classList.toggle('open', aiOpen);
  if (aiOpen) document.getElementById('aiInput').focus();
}

// AJEET_CONTEXT loaded from data/ai-context.js

async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;
  
  addAIMessage(msg, 'user');
  input.value = '';
  document.getElementById('aiSend').disabled = true;
  
  // Show typing
  const typingEl = document.createElement('div');
  typingEl.className = 'ai-message assistant';
  typingEl.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
  document.getElementById('aiMessages').appendChild(typingEl);
  scrollAI();

  try {
    // OpenRouter API — NVIDIA Nemotron 3 Super 120B (free)
    const OPENROUTER_KEY = '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';
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENROUTER_KEY,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Ajeet Kumar Portfolio — QuantBot'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        max_tokens: 500,
        messages: [
          { role: 'system', content: AJEET_CONTEXT },
          { role: 'user', content: msg }
        ],
      })
    });
    const data = await resp.json();
    typingEl.remove();
    const reply = data.choices?.[0]?.message?.content || "I'm here to help! Ask me anything about Ajeet's background or quant finance concepts.";
    addAIMessage(reply, 'assistant');
  } catch (err) {
    typingEl.remove();
    addAIMessage("I'm having trouble connecting to my brain right now 🤔 Please try again in a moment, or reach out to Ajeet directly at ajeetk095@gmail.com", 'assistant');
  }
  document.getElementById('aiSend').disabled = false;
}

function addAIMessage(text, role) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = `ai-message ${role}`;
  div.innerHTML = `<div class="ai-bubble">${text}</div>`;
  msgs.appendChild(div);
  scrollAI();
}
function scrollAI() { const m = document.getElementById('aiMessages'); m.scrollTop = m.scrollHeight; }
function aiQuickAction(q) { document.getElementById('aiInput').value = q; sendAIMessage(); }

/* ─── Contact form ─── */
function sendContactForm(e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.className = 'form-status success';
  status.textContent = '✓ Message received! Ajeet will get back to you within 24 hours.';
  e.target.reset();
  setTimeout(() => status.style.display = 'none', 5000);
}

/* ─── Resume download ─── */
function downloadResume(e) {
  e.preventDefault();
  window.open('https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing', '_blank');
}

/* ─── Admin ─── */
function openAdmin(e) {
  e.preventDefault();
  document.getElementById('admin-login-overlay').classList.add('open');
}
function closeAdminLogin() {
  document.getElementById('admin-login-overlay').classList.remove('open');
}
function attemptAdminLogin() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if ((u === 'admin' && p === 'ajeet2025') || (u === 'ajeet' && p === 'ajeet2025')) {
    closeAdminLogin();
    openAdminDashboard();
  } else {
    document.getElementById('adminError').style.display = 'block';
  }
}
function openAdminDashboard() {
  document.getElementById('admin-dashboard').classList.add('open');
  document.getElementById('adminLastUpdated').textContent = new Date().toLocaleDateString();
  renderAdminStats();
  renderAdminTable();
  renderAdminChart();
}
function closeAdminDashboard() {
  document.getElementById('admin-dashboard').classList.remove('open');
}
function renderAdminStats() {
  const stats = [
    { num: '2,841', label: 'Total Page Views' },
    { num: '148', label: 'Resume Downloads' },
    { num: '312', label: 'AI Queries' },
    { num: '89', label: 'Job Link Clicks' },
    { num: '24', label: 'Contact Inquiries' },
    { num: '40+', label: 'Certificates Listed' },
  ];
  document.getElementById('adminStatsGrid').innerHTML = stats.map(s => `
    <div class="admin-stat-card">
      <div class="admin-stat-num">${s.num}</div>
      <div class="admin-stat-label">${s.label}</div>
    </div>
  `).join('');
}
function renderAdminTable() {
  const rows = [
    ['Hero Section', 'Jan 15, 2026', 'live'],
    ['Projects (6 entries)', 'Jan 10, 2026', 'live'],
    ['Certifications (40+)', 'Dec 28, 2025', 'live'],
    ['Job Board (12 listings)', 'Live — auto-updated', 'live'],
    ['Blog Posts (3)', 'Jan 5, 2026', 'live'],
    ['Gallery (12 items)', 'Dec 20, 2025', 'live'],
    ['Contact Page', 'Nov 30, 2025', 'live'],
    ['Draft: New Project', 'Jan 18, 2026', 'draft'],
  ];
  document.getElementById('adminContentTable').innerHTML = rows.map(([sec, date, status]) => `
    <tr>
      <td>${sec}</td>
      <td style="font-family:var(--font-mono);font-size:0.75rem">${date}</td>
      <td><span class="admin-badge badge-${status}">${status}</span></td>
      <td>
        <button style="background:none;border:none;color:var(--cyan);font-family:var(--font-mono);font-size:0.68rem;cursor:pointer" onclick="alert('In production: opens content editor for ${sec}')">Edit</button>
      </td>
    </tr>
  `).join('');
}
function renderAdminChart() {
  const ctx = document.getElementById('adminTrafficChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Page Views',
        data: [120,145,98,210,180,95,53],
        backgroundColor: 'rgba(0,212,255,0.3)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(0,212,255,0.05)' }, ticks: { color: '#8899b0', font: { family: 'IBM Plex Mono', size: 9 } } },
        y: { grid: { color: 'rgba(0,212,255,0.05)' }, ticks: { color: '#8899b0', font: { family: 'IBM Plex Mono', size: 9 } } }
      },
      plugins: { legend: { display: false } }
    }
  });
}
/* adminSaveTagline defined below */

/* ─── Load saved tagline ─── */
(function() {
  const saved = localStorage.getItem('hero_tagline');
  if (saved) {
    const desc = document.querySelector('.hero-desc');
    if (desc) desc.innerHTML = saved;
    const ta = document.getElementById('adminTaglineInput');
    if (ta) ta.value = saved;
  }
})();

/* ─── Keyboard shortcuts ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModalDirect();
    if (aiOpen) toggleAI();
    closeAdminDashboard();
    closeAdminLogin();
  }
});

/* ─── Admin Save / Preview / Exit ─── */
function adminSaveAll() {
  // Save hero tagline
  const tagline = document.getElementById('adminTaglineInput');
  if (tagline) localStorage.setItem('ak_hero_tagline', tagline.value);
  // Save any editable content
  document.querySelectorAll('[data-editable]').forEach(el => {
    localStorage.setItem('ak_content_' + el.dataset.editable, el.innerHTML);
  });
  // Show saved notification
  showAdminNotification('✓ All changes saved!', 'success');
  // Update timestamp
  const ts = document.getElementById('adminLastUpdated');
  if (ts) ts.textContent = new Date().toLocaleString();
}

function adminSaveAndPreview() {
  adminSaveAll();
  setTimeout(() => adminPreviewAll(), 500);
}

function adminPreview() {
  // Preview the tagline change inline
  const tagline = document.getElementById('adminTaglineInput');
  if (tagline) {
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
      heroDesc.textContent = tagline.value;
      heroDesc.style.outline = '2px dashed var(--cyan)';
      setTimeout(() => { heroDesc.style.outline = ''; }, 2000);
    }
  }
  showAdminNotification('👁 Preview applied to page', 'info');
}

function adminPreviewAll() {
  // Close dashboard temporarily to preview
  document.getElementById('admin-dashboard').style.opacity = '0.1';
  document.getElementById('admin-dashboard').style.pointerEvents = 'none';
  // Apply all saved content
  adminApplySaved();
  // Show preview bar
  showPreviewBar();
}

function showPreviewBar() {
  let bar = document.getElementById('adminPreviewBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'adminPreviewBar';
    bar.style.cssText = `
      position:fixed;top:0;left:0;right:0;z-index:99999;
      background:linear-gradient(135deg,rgba(0,212,255,0.95),rgba(0,100,255,0.95));
      color:#000;display:flex;align-items:center;justify-content:space-between;
      padding:10px 24px;font-family:var(--font-mono);font-size:0.78rem;
      box-shadow:0 4px 20px rgba(0,212,255,0.4);
    `;
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-weight:700">👁 PREVIEW MODE</span>
        <span style="opacity:0.8">Changes applied — reviewing your portfolio</span>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="adminSaveFromPreview()" style="background:#000;color:var(--cyan);border:none;border-radius:6px;padding:6px 16px;cursor:pointer;font-family:var(--font-mono);font-size:0.75rem;font-weight:600">
          ✓ Confirm & Save
        </button>
        <button onclick="adminExitPreview()" style="background:rgba(0,0,0,0.3);color:#000;border:1px solid rgba(0,0,0,0.3);border-radius:6px;padding:6px 16px;cursor:pointer;font-family:var(--font-mono);font-size:0.75rem">
          ✕ Exit Preview
        </button>
      </div>
    `;
    document.body.appendChild(bar);
  }
  bar.style.display = 'flex';
  document.body.style.paddingTop = '44px';
}

function adminSaveFromPreview() {
  adminSaveAll();
  adminExitPreview();
  showAdminNotification('✓ Saved & live!', 'success');
}

function adminExitPreview() {
  const bar = document.getElementById('adminPreviewBar');
  if (bar) { bar.style.display = 'none'; }
  document.body.style.paddingTop = '';
  const dash = document.getElementById('admin-dashboard');
  if (dash) { dash.style.opacity = ''; dash.style.pointerEvents = ''; }
}

function adminApplySaved() {
  const tagline = localStorage.getItem('ak_hero_tagline');
  if (tagline) {
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) heroDesc.textContent = tagline;
  }
}

function showAdminNotification(msg, type) {
  let notif = document.getElementById('adminNotif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'adminNotif';
    notif.style.cssText = `
      position:fixed;top:70px;right:24px;z-index:99998;
      padding:12px 20px;border-radius:8px;font-family:var(--font-mono);
      font-size:0.78rem;font-weight:600;transition:all .3s;
      box-shadow:0 8px 24px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(notif);
  }
  const styles = {
    success: 'background:rgba(0,255,136,0.15);border:1px solid var(--green);color:var(--green)',
    info:    'background:rgba(0,212,255,0.15);border:1px solid var(--cyan);color:var(--cyan)',
    warn:    'background:rgba(240,165,0,0.15);border:1px solid var(--gold);color:var(--gold)',
  };
  notif.style.cssText += ';' + (styles[type] || styles.success);
  notif.textContent = msg;
  notif.style.opacity = '1';
  notif.style.transform = 'translateX(0)';
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(20px)';
  }, 3000);
}

function adminSaveTagline() {
  adminSaveAll();
  const msg = document.getElementById('adminSaveMsg');
  if (msg) { msg.style.display = 'inline'; setTimeout(() => { msg.style.display = 'none'; }, 2500); }
}

// Apply saved content on page load
document.addEventListener('DOMContentLoaded', adminApplySaved);
