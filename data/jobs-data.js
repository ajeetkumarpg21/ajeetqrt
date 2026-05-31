const JOBS = [
  { title:'Quantitative Analyst', company:'Morgan Stanley', location:'Mumbai / Hybrid', type:'Full-Time', match:97, matchClass:'match-high', tags:['Python','Quant','Derivatives'], role:'quant', loc:'mumbai' },
  { title:'Financial Risk Analyst', company:'ICICI Bank', location:'Mumbai, IN', type:'Full-Time', match:94, matchClass:'match-high', tags:['Risk Analytics','Python','Excel'], role:'risk', loc:'mumbai' },
  { title:'Data Scientist — Finance', company:'Goldman Sachs', location:'Bangalore, IN', type:'Full-Time', match:93, matchClass:'match-high', tags:['ML','Python','Finance'], role:'ds', loc:'bangalore' },
  { title:'Quant Research Associate', company:'Citadel Securities', location:'Bangalore / Remote', type:'Full-Time', match:96, matchClass:'match-high', tags:['Python','MVO','Stochastic'], role:'quant', loc:'bangalore' },
  { title:'Risk Analytics Engineer', company:'JP Morgan', location:'Bangalore, IN', type:'Full-Time', match:91, matchClass:'match-high', tags:['CVaR','Python','Econometrics'], role:'risk', loc:'bangalore' },
  { title:'Portfolio Analyst', company:'HDFC AMC', location:'Mumbai, IN', type:'Full-Time', match:89, matchClass:'match-med', tags:['Portfolio Mgmt','Excel','Python'], role:'fe', loc:'mumbai' },
  { title:'Financial Engineering Intern', company:'BNP Paribas', location:'Mumbai, IN', type:'Internship', match:88, matchClass:'match-med', tags:['Derivatives','Python','ML'], role:'fe', loc:'mumbai' },
  { title:'Algorithmic Trading Analyst', company:'Tower Research Capital', location:'Gurugram, IN', type:'Full-Time', match:87, matchClass:'match-med', tags:['Python','Algo','Stats'], role:'trading', loc:'delhi' },
  { title:'ML Engineer — Fintech', company:'Razorpay', location:'Bangalore, IN', type:'Full-Time', match:82, matchClass:'match-med', tags:['ML','Python','FastAPI'], role:'ds', loc:'bangalore' },
  { title:'Credit Risk Data Analyst', company:'Axis Bank', location:'Mumbai, IN', type:'Full-Time', match:85, matchClass:'match-med', tags:['Credit Risk','Python','SQL'], role:'risk', loc:'mumbai' },
  { title:'Derivatives Quant', company:'Nomura', location:'Mumbai, IN', type:'Full-Time', match:90, matchClass:'match-high', tags:['Derivatives','Black-Scholes','Python'], role:'quant', loc:'mumbai' },
  { title:'Research Analyst — Equity', company:'Motilal Oswal', location:'Mumbai / Remote', type:'Full-Time', match:80, matchClass:'match-med', tags:['Equity Research','Excel','Stats'], role:'fe', loc:'remote' },
];

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

