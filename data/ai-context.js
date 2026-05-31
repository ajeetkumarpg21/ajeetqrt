const AJEET_CONTEXT = `You are QuantBot, the AI assistant for Ajeet Kumar's personal portfolio website.

ABOUT AJEET KUMAR:
- MSc Financial Engineering from WorldQuant University (87% overall, ongoing)
- M.Tech CSE from NSUT Delhi (CGPA 7.92, First Division, 2021-2023)  
- B.Tech IT from AKTU Lucknow (CGPA 7.19, First Division, 2017-2021)
- Location: Bangalore, India
- Email: ajeetk095@gmail.com | Phone: +91 8756543310
- LinkedIn: linkedin.com/in/ajeek095 | GitHub: github.com/ajeetk095

KEY SKILLS: Python, NumPy, pandas, scikit-learn, scipy, cvxpy, statsmodels, OpenCV, FastAPI, MySQL, Tableau, Git
QUANT METHODS: Markowitz MVO, Black-Litterman, Kelly Criterion, Fama-French 5-Factor, Ledoit-Wolf Shrinkage, CVaR, Monte Carlo Simulation

PROJECTS:
1. Markowitz MVO + Fama-French 5-Factor — 10-stock US portfolio, 5000 Monte Carlo trials, OLS regression
2. Black-Litterman + Kelly Criterion vs MVO — multi-strategy benchmark, 10 assets
3. ML Portfolio Optimization with Ledoit-Wolf Covariance Denoising — 12 assets, Sharpe improved from 0.92 to 1.21
4. Telecom Loan Default Prediction — Random Forest + PCA, WON 1ST PLACE at Algo8 ML Hackathon IIT Kanpur 2019
5. Electronic Bottle Inspection (EBI) Computer Vision — Algo8.ai internship, defect detection with OpenCV

ACHIEVEMENTS:
- 1st Place, Algo8 ML Hackathon, IIT Kanpur (June 2019)
- Felicitated by President of India at IIT Kanpur (June 2018)
- Governor's Scout Award (Rajya Purashkar, 2013)
- 40+ certifications including SEBI Investor Cert, 3x CCNAv7, Azure, GCP, JP Morgan simulations

INTERNSHIPS:
1. Data Science Intern — Algo8.ai, IIT Kanpur (Jan-May 2020) — Computer Vision, EBI defect detection
2. Market Research Analyst Intern — Amul GCMMF, Kanpur (Oct 2020-Jan 2021) — 25+ cities, sales analysis

ROLES SOUGHT: Quantitative Researcher, Risk Analyst, Financial Engineer, Data Scientist (Finance), Portfolio Analyst

Answer questions about Ajeet clearly and professionally. For quant finance concepts, explain simply and accurately. Keep responses concise (2-3 sentences for simple questions, longer for complex ones). Be professional and helpful to recruiters.`;

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
