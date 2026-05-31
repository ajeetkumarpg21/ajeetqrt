/* ═══════════════════════════════════════════════════════════════
   AI ASSISTANT — ai-chat.js
   PRIMARY:  NVIDIA Nemotron 3 Super 120B A12B (FREE via OpenRouter)
   FALLBACK: DeepSeek V4 Flash            (FREE via OpenRouter)
   FALLBACK: Google Gemma 4 31B           (FREE via OpenRouter)

   ★ HOW TO GET YOUR FREE KEY (takes 2 minutes) ★
   1. Go to  https://openrouter.ai
   2. Sign up (free — no credit card needed for free models)
   3. Go to  https://openrouter.ai/settings/keys
   4. Click "Create Key" → copy it (starts with  sk-or-v1-…)
   5. Paste it below where it says YOUR_OPENROUTER_KEY_HERE

   All three models above are $0.00 input AND output — completely free.
   NVIDIA Nemotron 3 Super is 627B params with 1M token context.
═══════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
//  ★  PASTE YOUR OPENROUTER API KEY HERE  ★
// ──────────────────────────────────────────────────────
const OPENROUTER_KEY = "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";
// Get free key at: https://openrouter.ai/settings/keys
// ──────────────────────────────────────────────────────

// Model priority list — tries each in order if one fails
const MODELS = [
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "NVIDIA Nemotron 3 Super 120B" },
  { id: "deepseek/deepseek-v4-flash:free",    name: "DeepSeek V4 Flash"       },
  { id: "google/gemma-4-31b:free",            name: "Google Gemma 4 31B"      },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B"      },
];

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// ── Ajeet's full profile as system context ──────────────
const SYSTEM_PROMPT = `You are a helpful AI assistant embedded on Ajeet Kumar's personal portfolio website.
Help recruiters and visitors learn about Ajeet's background, skills, projects and career goals.
Keep responses concise (under 180 words). Be warm, professional and accurate.
Never make up information — only use the facts below.

AJEET KUMAR — PROFILE:
Email: ajeetk095@gmail.com | Phone: +91 8756543310 | Location: Bangalore, India
LinkedIn: linkedin.com/in/ajeek095 | GitHub: github.com/ajeetk095

EDUCATION:
1. MSc Financial Engineering — WorldQuant University, Washington DC (Oct 2023–present) | 87% cumulative
   Outstanding: Deep Learning for Finance 95%, Financial Econometrics 94%, Derivative Pricing 88%, Stochastic Modeling 88%, Portfolio Management 84%
2. M.Tech Computer Science & Engineering — NSUT New Delhi (2021–2023) | CGPA 7.92/10 | First Division
3. B.Tech Information Technology — AKTU Lucknow (2017–2021) | CGPA 7.19/10 | Final SGPA 9.54

PROJECTS (Python-based quant finance):
1. Markowitz MVO + Fama-French 5-Factor — 10 US stocks, OLS regression, 5000+ Monte Carlo trials
2. Black-Litterman vs Kelly Criterion vs MVO — 10-asset benchmark, 5000+ Monte Carlo, Sharpe/Sortino/Drawdown
3. ML Portfolio Optimisation with Ledoit-Wolf Covariance Denoising — 12 assets, CVaR/Calmar/Max Drawdown
4. Telecom Loan Default Prediction — Random Forest + PCA, recall-optimised — 🏆 WON 1st Place IIT Kanpur Hackathon 2019

TOOLS & SKILLS:
Python, NumPy, pandas, scikit-learn, cvxpy, statsmodels, scipy, SQL, C++, OpenCV, FastAPI
Quant: Markowitz MVO, Black-Litterman, Kelly Criterion, Fama-French, CVaR, Monte Carlo, Ledoit-Wolf, Sharpe, Sortino, VaR

EXPERIENCE:
- Amul GCMMF Ltd — Market Research & Dev Analyst Intern (Oct 2020–Jan 2021) — 25+ cities UP
- Algo8.ai, IIT Kanpur — Data Science Intern (Jan–May 2020) — Computer vision, EBI model
- E&ICT Academy, IIT Kanpur — ML Training 6 weeks (Jun–Jul 2019)
- J.P. Morgan Quantitative Research Job Simulation (Jul–Oct 2023) — Forage
- J.P. Morgan Investment Banking Virtual Experience (Jul 2023) — Forage

KEY CERTIFICATIONS:
SEBI Investor Certification (NISM 2024), J.P. Morgan Quant Research, J.P. Morgan Investment Banking,
CISCO CCNAv7 (3 modules), Introduction to Cybersecurity, IBM AI, IIM Ahmedabad Pre-MBA Statistics,
Azure Fundamentals (Microsoft), Google Cloud Fundamentals, CFI Risk Management, ISRO Geocomputation,
IIT Kanpur ML Training, Python Programming (E&ICT IIT-K)

AWARDS: 🏆 1st Place Algo8 Hackathon IIT Kanpur 2019 | Rajya Purashkar Scout Award (2013) | IAENG Member No. 265771

OPEN FOR: Quant Researcher, Quantitative Analyst, Risk Analyst, Financial Engineer, Data Scientist (Finance), Portfolio Analyst

QUANT CONCEPT EXPLANATIONS (use when asked):
- Sharpe Ratio: return per unit of risk — higher is better
- Black-Litterman: Bayesian method blending market equilibrium with investor views for portfolio weights
- Markowitz MVO: finds optimal portfolio weights to maximise return for given risk using covariance matrix
- CVaR (Conditional VaR): expected loss in worst X% of scenarios — stricter than VaR
- Kelly Criterion: formula that determines optimal bet/investment size to maximise long-run growth
- Fama-French: explains stock returns via market, size (SMB), value (HML), profitability (RMW), investment (CMA) factors
- Ledoit-Wolf: shrinks noisy sample covariance matrix toward a structured target — reduces estimation error
- Monte Carlo: simulates thousands of random scenarios to estimate portfolio risk and return distributions
- Max Drawdown: worst peak-to-trough decline — measures downside risk
- Sortino Ratio: like Sharpe but only penalises downside volatility

PAGE NAVIGATION (respond with link when user asks to see something):
projects → /pages/projects.html | resume/cv → /pages/resume.html
certifications → /pages/certifications.html | contact/hire → /pages/contact.html
skills → /pages/skills.html | education → /pages/education.html
experience/internship → /pages/experience.html | blog → /pages/blog.html
gallery → /pages/gallery.html | jobs → /pages/jobs.html`;

// ── DOM refs ──────────────────────────────────────────
const msgBox    = document.getElementById('aiMessages');
const aiInputEl = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSend');
let chatHistory = [];
let currentModelIdx = 0;

// ── Add message bubble ────────────────────────────────
function addMsg(text, role) {
  if (!msgBox) return null;
  const d = document.createElement('div');
  d.className = `ai-msg ${role}`;
  d.textContent = text;
  msgBox.appendChild(d);
  msgBox.scrollTop = msgBox.scrollHeight;
  return d;
}

// ── Local quick-nav shortcuts (no API call needed) ───
const NAV_MAP = [
  [['show project','open project','view project','see project'], '/pages/projects.html'],
  [['resume','download cv','open cv','see cv'], '/pages/resume.html'],
  [['certif','certificate'], '/pages/certifications.html'],
  [['contact','hire me','reach','email ajeet'], '/pages/contact.html'],
  [['skill','tech stack'], '/pages/skills.html'],
  [['education','transcript','degree','college','university'], '/pages/education.html'],
  [['experience','internship','intern','work history'], '/pages/experience.html'],
  [['blog','article','post','writing'], '/pages/blog.html'],
  [['gallery','photo','image','picture'], '/pages/gallery.html'],
  [['job board','jobs board','find job','job listing'], '/pages/jobs.html'],
  [['home page','go home'], '/index.html'],
];

// ── Call OpenRouter API with fallback ─────────────────
async function callOpenRouter(messages, modelIdx = 0) {
  if (modelIdx >= MODELS.length) throw new Error('All models unavailable. Please try again later.');
  const model = MODELS[modelIdx];

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getKey()}`,
      'HTTP-Referer': window.location.origin,     // required by OpenRouter
      'X-Title': 'Ajeet Kumar Portfolio Assistant' // shows in OpenRouter dashboard
    },
    body: JSON.stringify({
      model: model.id,
      max_tokens: 450,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // If this model is rate-limited or unavailable, try the next one
    if (res.status === 429 || res.status === 503 || res.status === 502) {
      console.warn(`Model ${model.name} unavailable (${res.status}), trying fallback…`);
      return callOpenRouter(messages, modelIdx + 1);
    }
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response from model');
  currentModelIdx = modelIdx; // remember which model worked
  return { reply, model: model.name };
}

// ── Resolve key: hardcoded value OR set via Admin dashboard ──
function getKey() {
  if (OPENROUTER_KEY && OPENROUTER_KEY !== "YOUR_OPENROUTER_KEY_HERE") return OPENROUTER_KEY;
  return localStorage.getItem("openrouter_api_key") || "";
}

// ── Main send function ────────────────────────────────
async function sendAI() {
  if (!aiInputEl) return;
  const text = aiInputEl.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  aiInputEl.value = '';
  aiSendBtn.disabled = true;

  // Check local nav shortcuts first (instant, no API)
  const low = text.toLowerCase();
  for (const [kws, url] of NAV_MAP) {
    if (kws.some(k => low.includes(k))) {
      const pageName = url.replace('/pages/', '').replace('.html', '').replace('/index.html', 'Home');
      addMsg(`Opening ${pageName.charAt(0).toUpperCase() + pageName.slice(1)} page…`, 'bot');
      setTimeout(() => { window.location.href = url; }, 600);
      aiSendBtn.disabled = false;
      return;
    }
  }

  const loading = addMsg('Thinking…', 'bot loading');

  // Key check
  const resolvedKey = getKey(); if (!resolvedKey) {
    loading.textContent = '⚠️ AI assistant not configured. Get a FREE key at openrouter.ai → paste in js/ai-chat.js line 18. Takes 2 minutes!';
    loading.classList.remove('loading');
    aiSendBtn.disabled = false;
    return;
  }

  chatHistory.push({ role: 'user', content: text });
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

  try {
    const { reply, model } = await callOpenRouter(chatHistory, currentModelIdx);
    loading.textContent = reply;
    loading.classList.remove('loading');
    chatHistory.push({ role: 'assistant', content: reply });

    // Show which model answered (subtle, in muted text)
    const modelNote = document.createElement('div');
    modelNote.style.cssText = 'font-size:10px;color:var(--muted);text-align:right;margin-top:2px;font-family:var(--mono)';
    modelNote.textContent = `via ${model}`;
    msgBox.appendChild(modelNote);
    msgBox.scrollTop = msgBox.scrollHeight;

  } catch(err) {
    loading.textContent = `Connection error: ${err.message}. Email Ajeet at ajeetk095@gmail.com`;
    loading.classList.remove('loading');
    chatHistory.pop();
  }

  aiSendBtn.disabled = false;
}

// ── Event listeners ───────────────────────────────────
if (aiSendBtn) aiSendBtn.addEventListener('click', sendAI);
if (aiInputEl) {
  aiInputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); }
  });
}
