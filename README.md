# Ajeet Kumar — Quant Finance Portfolio
**Live:** https://ajeetkumar.vercel.app

## Stack
- **HTML5** + **Tailwind CSS** (CDN) + **Vanilla JS**
- **Three.js** — 3D backgrounds
- **Chart.js** — Radar chart, portfolio curve
- **GSAP** + **AOS** — Animations
- **NVIDIA Nemotron 120B** (via OpenRouter) — AI assistant
- **Adzuna API** — Live job board

## File Structure
```
├── index.html          ← Main SPA (2,400 lines, pure HTML)
├── css/
│   ├── portfolio.css   ← Design system (variables, components)
│   ├── animations.css  ← Keyframes, gradient effects
│   ├── enhancements.css← Loader, toasts, dot-nav, glassmorphism
│   └── main-theme.css  ← Tailwind overrides
├── js/
│   ├── app.js          ← Core logic (nav, charts, admin, AI)
│   ├── animations.js   ← Canvas particle backgrounds
│   ├── enhancements.js ← Typed text, AOS, GSAP, toast, ripple
│   ├── ai-chat.js      ← OpenRouter NVIDIA AI
│   ├── jobs.js         ← Adzuna live jobs
│   └── backend.js      ← Auth, CRUD, AssetManager
├── data/
│   ├── portfolio.js    ← Personal data
│   ├── modal-data.js   ← Cert/project modals + PDF paths
│   ├── jobs-data.js    ← Curated job listings
│   └── ai-context.js  ← AI personality
├── admin/
│   ├── index.html      ← Login (admin / ajeet2025)
│   └── dashboard.html  ← Full CRUD dashboard
├── assets/
│   ├── img/            ← Profile photo, favicon
│   └── docs/           ← Place PDF certificates here
├── vercel.json         ← Deployment config + security headers
├── sitemap.xml         ← SEO sitemap
├── robots.txt          ← Search engine permissions
└── 404.html            ← Custom error page
```

## Quick Edit Guide
| To change | Edit |
|-----------|------|
| Personal info | `data/portfolio.js` |
| AI facts | `data/ai-context.js` |
| Cert modals | `data/modal-data.js` |
| Job listings | `data/jobs-data.js` |
| Colours | `css/portfolio.css` → `:root` |
| Page content | `index.html` |
| Admin password | `js/app.js` → search `ajeet2025` |
| AI key | `js/app.js` → search `OPENROUTER_KEY` |

## Deploy
1. Upload all files to GitHub repo
2. Connect to Vercel → Import → Deploy (60 sec)
3. Optional: rename to `ajeetkumar.vercel.app`

## Admin
- URL: `/admin/index.html`
- Username: `admin`
- Password: `ajeet2025`
- **Change password immediately** in Admin → Settings
