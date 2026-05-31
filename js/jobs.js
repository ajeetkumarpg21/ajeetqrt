/* ═══════════════════════════════════════════════════════════════
   ADZUNA LIVE JOB BOARD  —  js/jobs.js
   Real Adzuna API integration with India + worldwide support.
   App ID:  fd15a1de
   App Key: ba2de9bbc0174edd2e8bcd29227d6aa2
═══════════════════════════════════════════════════════════════ */

const ADZUNA = {
  APP_ID:  'fd15a1de',
  APP_KEY: 'ba2de9bbc0174edd2e8bcd29227d6aa2',

  // Country codes supported by Adzuna
  COUNTRIES: {
    'India':          'in',
    'United States':  'us',
    'United Kingdom': 'gb',
    'Australia':      'au',
    'Canada':         'ca',
    'Germany':        'de',
    'France':         'fr',
    'Singapore':      'sg',
    'United Arab Emirates': 'ae',
    'Netherlands':    'nl',
    'South Africa':   'za',
    'Brazil':         'br',
    'Russia':         'ru',
    'Poland':         'pl',
    'Austria':        'at',
    'New Zealand':    'nz',
    'Mexico':         'mx',
    'Worldwide':      'gb',   // fallback for worldwide search
  },

  // Quant-finance query presets for Ajeet's profile
  PRESETS: [
    'quantitative analyst',
    'financial engineer',
    'risk analyst',
    'quant researcher',
    'data scientist finance',
    'portfolio analyst',
    'trading analyst',
  ],

  // Skills from Ajeet's profile used for match scoring
  PROFILE_KEYWORDS: [
    'python','machine learning','finance','quantitative','risk','portfolio',
    'data science','sql','statistics','econometrics','derivatives','analytics',
    'financial engineering','numpy','pandas','scikit','cvxpy','ml','ai',
    'quant','research','modelling','optimization'
  ],

  /**
   * Fetch jobs from Adzuna API
   * @param {string} query   - search keywords
   * @param {string} country - country code (default 'in')
   * @param {object} opts    - { page, results_per_page, location, salary_min }
   */
  async fetchJobs(query, country = 'in', opts = {}) {
    const {
      page            = 1,
      results_per_page = 12,
      location        = '',
      salary_min      = '',
    } = opts;

    // CORS proxy needed for browser → Adzuna (we use allorigins as free proxy)
    // In production, route through a Netlify/Vercel serverless function instead
    const base = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    const params = new URLSearchParams({
      app_id:           this.APP_ID,
      app_key:          this.APP_KEY,
      results_per_page: results_per_page,
      what:             query,
      content_type:     'application/json',
    });
    if (location)    params.set('where', location);
    if (salary_min)  params.set('salary_min', salary_min);

    // Try direct first, then proxy
    const urls = [
      `${base}?${params}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`${base}?${params}`)}`,
      `https://corsproxy.io/?${encodeURIComponent(`${base}?${params}`)}`,
    ];

    let lastErr = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.results) return { ok: true, jobs: data.results, total: data.count };
      } catch (e) {
        lastErr = e;
        continue;
      }
    }
    return { ok: false, error: lastErr?.message || 'Failed to reach Adzuna' };
  },

  /** Score a job against Ajeet's profile keywords */
  matchScore(job) {
    const text = [
      job.title || '',
      job.description || '',
      (job.category?.label || ''),
      (job.company?.display_name || ''),
    ].join(' ').toLowerCase();

    let hits = 0;
    this.PROFILE_KEYWORDS.forEach(kw => {
      if (text.includes(kw)) hits++;
    });

    const base = Math.round((hits / this.PROFILE_KEYWORDS.length) * 100);
    return Math.min(98, Math.max(40, base + Math.floor(Math.random() * 8)));
  },

  /** Format raw Adzuna result into our standard job object */
  normalize(raw) {
    const salary = raw.salary_min && raw.salary_max
      ? `₹${Math.round(raw.salary_min/100000)}L – ₹${Math.round(raw.salary_max/100000)}L`
      : raw.salary_min
        ? `From ₹${Math.round(raw.salary_min/100000)}L`
        : 'Not disclosed';

    return {
      id:        raw.id,
      title:     raw.title || 'Unknown Role',
      company:   raw.company?.display_name || 'Confidential',
      location:  raw.location?.display_name || 'India',
      type:      raw.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
      level:     'Entry',
      salary,
      link:      raw.redirect_url || '#',
      source:    'Adzuna',
      posted:    raw.created ? new Date(raw.created).toLocaleDateString('en-IN') : 'Recent',
      description: (raw.description || '').substring(0, 200) + '…',
      category:  raw.category?.label || 'Finance',
      tags:      this._extractTags(raw),
      match:     this.matchScore(raw),
      reason:    this._matchReason(raw),
    };
  },

  _extractTags(raw) {
    const allText = `${raw.title} ${raw.description}`.toLowerCase();
    const techTags = ['python','sql','excel','tableau','machine learning','data analysis',
      'risk','quant','finance','statistics','r','java','c++','aws','azure'];
    return techTags.filter(t => allText.includes(t)).slice(0, 5);
  },

  _matchReason(raw) {
    const text = `${raw.title} ${raw.description}`.toLowerCase();
    const reasons = [];
    if (text.includes('python'))   reasons.push('Python skills match');
    if (text.includes('quant'))    reasons.push('Quant finance focus');
    if (text.includes('risk'))     reasons.push('Risk analytics experience');
    if (text.includes('machine learning') || text.includes('ml')) reasons.push('ML background relevant');
    if (text.includes('finance'))  reasons.push('Financial engineering degree aligns');
    if (text.includes('portfolio')) reasons.push('Portfolio optimisation projects match');
    return reasons.length ? reasons.join(' · ') : 'Profile broadly matches this role';
  },
};

// ══════════════════════════════════════════
//  JOB BOARD UI
// ══════════════════════════════════════════
let allFetchedJobs = [];
let currentPage   = 1;
const JOBS_PER_PAGE = 10;

function matchColor(m) {
  if (m >= 90) return 'var(--accent)';
  if (m >= 80) return 'var(--accent2)';
  if (m >= 70) return 'var(--accent3)';
  return 'var(--muted)';
}

function renderJobCard(j) {
  const mc = matchColor(j.match);
  return `
  <div class="job-card reveal" style="margin-bottom:14px;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;padding:20px 24px">
    <!-- Match ring -->
    <div class="match-ring" style="border-color:${mc};color:${mc};background:${mc}14;flex-shrink:0">
      ${j.match}%
    </div>
    <!-- Info -->
    <div style="flex:1;min-width:220px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
        <h3 style="font-size:15px;font-weight:600">${j.title}</h3>
        <span class="tag tag-blue" style="font-size:10px">${j.type}</span>
        ${j.source === 'Adzuna' ? '<span class="tag tag-gold" style="font-size:10px">Live</span>' : ''}
      </div>
      <div style="font-size:13px;color:var(--accent2);margin-bottom:4px">
        ${j.company} &nbsp;·&nbsp; 📍 ${j.location}
      </div>
      ${j.salary && j.salary !== 'Not disclosed' ? `<div style="font-size:12px;color:var(--accent);margin-bottom:4px;font-family:var(--mono)">💰 ${j.salary}</div>` : ''}
      ${j.posted ? `<div style="font-size:11px;color:var(--muted);margin-bottom:6px">📅 Posted: ${j.posted}</div>` : ''}
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px;line-height:1.5">💡 ${j.reason}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${(j.tags || []).map(t => `<span class="tag tag-purple" style="font-size:10px">${t}</span>`).join('')}
      </div>
    </div>
    <!-- Actions -->
    <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0">
      <a href="${j.link}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="white-space:nowrap">Apply →</a>
      <button onclick="saveJob('${j.id}','${j.title.replace(/'/g,"\\'")}','${j.company.replace(/'/g,"\\'")}','${j.link}')"
        class="btn btn-outline btn-sm" style="white-space:nowrap;font-size:11px">⭐ Save</button>
    </div>
  </div>`;
}

function renderJobs(jobs) {
  const list = document.getElementById('jobList');
  if (!list) return;

  if (!jobs || jobs.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:48px;color:var(--muted)">
      <div style="font-size:40px;margin-bottom:12px">🔍</div>
      <p>No jobs found. Try different keywords or country.</p>
    </div>`;
    return;
  }

  list.innerHTML = jobs.map(renderJobCard).join('');
  list.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver(e => {
      if (e[0].isIntersecting) { e[0].target.classList.add('up'); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(el);
  });
}

function showJobsLoading() {
  const list = document.getElementById('jobList');
  if (!list) return;
  list.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
      ${Array(6).fill(0).map(() => `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;animation:pulse 1.5s infinite">
          <div style="height:12px;width:40%;background:rgba(255,255,255,.06);border-radius:6px;margin-bottom:12px"></div>
          <div style="height:16px;width:70%;background:rgba(255,255,255,.06);border-radius:6px;margin-bottom:8px"></div>
          <div style="height:12px;width:55%;background:rgba(255,255,255,.06);border-radius:6px"></div>
        </div>`).join('')}
    </div>
    <style>@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}</style>`;
}

async function fetchAndRender() {
  const query   = (document.getElementById('jobSearch')?.value || 'quantitative analyst finance python').trim() || 'quant finance data science';
  const country = document.getElementById('jobCountry')?.value || 'in';
  const location = document.getElementById('jobLocation')?.value || '';
  const sortBy  = document.getElementById('jobSort')?.value || 'match';

  showJobsLoading();
  updateStatus('Fetching live jobs from Adzuna…', 'loading');

  const result = await ADZUNA.fetchJobs(query, country, {
    page: currentPage,
    results_per_page: JOBS_PER_PAGE,
    location,
  });

  if (!result.ok) {
    // Fall back to curated jobs from portfolio data
    updateStatus('Live fetch unavailable — showing curated jobs', 'warn');
    const curated = (loadData('jobs') || []).map(j => ({ ...j, source: 'Curated' }));
    renderJobs(curated);
    document.getElementById('jobCountDisplay').textContent = `${curated.length} curated jobs`;
    return;
  }

  allFetchedJobs = result.jobs.map(j => ADZUNA.normalize(j));

  // Sort
  if (sortBy === 'match')  allFetchedJobs.sort((a, b) => b.match - a.match);
  else if (sortBy === 'recent') allFetchedJobs.sort((a, b) => b.id.localeCompare(a.id));
  else allFetchedJobs.sort((a, b) => a.title.localeCompare(b.title));

  renderJobs(allFetchedJobs);
  updateStatus(`✓ ${result.total?.toLocaleString() || allFetchedJobs.length} live jobs found on Adzuna`, 'ok');
  document.getElementById('jobCountDisplay').textContent =
    `${result.total?.toLocaleString() || allFetchedJobs.length} jobs · Page ${currentPage}`;

  // Pagination
  const totalPages = Math.ceil((result.total || allFetchedJobs.length) / JOBS_PER_PAGE);
  renderPagination(currentPage, totalPages);
}

function renderPagination(cur, total) {
  const el = document.getElementById('jobPagination');
  if (!el || total <= 1) { if (el) el.innerHTML = ''; return; }
  const pages = [];
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i);
  el.innerHTML = `
    <div style="display:flex;gap:8px;justify-content:center;margin-top:24px;flex-wrap:wrap">
      ${cur > 1 ? `<button onclick="goPage(${cur-1})" class="btn btn-outline btn-sm">← Prev</button>` : ''}
      ${pages.map(p => `<button onclick="goPage(${p})" class="btn btn-sm ${p===cur?'btn-primary':'btn-outline'}">${p}</button>`).join('')}
      ${cur < total ? `<button onclick="goPage(${cur+1})" class="btn btn-outline btn-sm">Next →</button>` : ''}
    </div>`;
}

function goPage(p) {
  currentPage = p;
  fetchAndRender();
  document.getElementById('jobList')?.scrollIntoView({ behavior: 'smooth' });
}

function updateStatus(msg, type) {
  const el = document.getElementById('adzunaStatus');
  if (!el) return;
  const colors = { ok:'var(--accent)', warn:'var(--gold)', loading:'var(--accent2)', error:'#ff5050' };
  el.style.color = colors[type] || 'var(--muted)';
  el.textContent = msg;
}

// ── Saved Jobs (localStorage) ──
function saveJob(id, title, company, link) {
  const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
  if (saved.find(j => j.id === id)) { notify && notify('Already saved!', 'info'); return; }
  saved.push({ id, title, company, link, savedAt: new Date().toISOString() });
  localStorage.setItem('saved_jobs', JSON.stringify(saved));
  renderSavedJobs();
  // Quick feedback
  const btn = event.target;
  if (btn) { btn.textContent = '✓ Saved'; btn.style.color = 'var(--accent)'; }
}

function renderSavedJobs() {
  const el = document.getElementById('savedJobsList');
  if (!el) return;
  const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
  if (!saved.length) { el.innerHTML = '<p style="color:var(--muted);font-size:13px">No saved jobs yet.</p>'; return; }
  el.innerHTML = saved.map(j => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="flex:1">
        <div style="font-size:14px;font-weight:500">${j.title}</div>
        <div style="font-size:12px;color:var(--muted)">${j.company}</div>
      </div>
      <a href="${j.link}" target="_blank" class="btn btn-outline btn-sm">Open</a>
      <button onclick="removeSavedJob('${j.id}')" class="action-btn" style="color:#ff5050" title="Remove">✕</button>
    </div>`).join('');
}

function removeSavedJob(id) {
  let saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
  saved = saved.filter(j => j.id !== id);
  localStorage.setItem('saved_jobs', JSON.stringify(saved));
  renderSavedJobs();
}

// Expose for buttons
window.goPage = goPage;
window.saveJob = saveJob;
window.removeSavedJob = removeSavedJob;
window.fetchAndRender = fetchAndRender;
