/* ══════════════════════════════════════════════════════
   NAV INJECT — nav-inject.js
   Auto-injects: navbar · AI chat widget · footer
   Nav order matches spec: Home About Experience Projects
   Skills Certifications Education Jobs Blog Gallery Contact Admin
   ══════════════════════════════════════════════════════ */
(function() {
  const isRoot  = !location.pathname.includes('/pages/');
  const isAdmin = location.pathname.includes('/admin/');
  if (isAdmin) return;                     // admin has its own nav

  const base = isRoot ? '' : '../';

  const NAV_ITEMS = [
    { href: 'index.html',                label: 'Home'           },
    { href: 'pages/about.html',          label: 'About'          },
    { href: 'pages/education.html',      label: 'Education'      },
    { href: 'pages/experience.html',     label: 'Experience'     },
    { href: 'pages/projects.html',       label: 'Projects'       },
    { href: 'pages/skills.html',         label: 'Skills'         },
    { href: 'pages/certifications.html', label: 'Certifications' },
    { href: 'pages/gallery.html',        label: 'Gallery'        },
    { href: 'pages/jobs.html',           label: 'Jobs'           },
    { href: 'pages/blog.html',           label: 'Blog'           },
    { href: 'pages/contact.html',        label: 'Contact'        },
    { href: 'admin/index.html',          label: 'Admin', style:'color:var(--accent3)' },
  ];

  // Build href relative to current page
  function href(raw) {
    if (raw === 'index.html') return base + 'index.html';
    if (raw.startsWith('pages/')) return base + raw;
    if (raw.startsWith('admin/')) return base + raw;
    return base + raw;
  }

  const navHTML = `
  <nav id="navbar">
    <a href="${base}index.html" class="nav-logo" style="text-decoration:none">AK<span class="dot">.</span></a>
    <ul class="nav-links" id="navLinks">
      ${NAV_ITEMS.map(it => `<li><a href="${href(it.href)}" ${it.style ? `style="${it.style}"` : ''}>${it.label}</a></li>`).join('\n      ')}
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </nav>`;

  const aiHTML = `
  <button class="ai-fab" id="aiFab" title="Ask AI about Ajeet">🤖</button>
  <div class="ai-modal" id="aiModal">
    <div class="ai-header">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--accent);display:inline-block"></span>
        <span style="font-weight:600;font-size:14px">AI Assistant</span>
      </div>
      <button class="ai-close" aria-label="Close">✕</button>
    </div>
    <div class="ai-messages" id="aiMessages">
      <div class="ai-msg bot">Hi! I'm powered by NVIDIA Nemotron 627B. Ask me anything about Ajeet's background, projects, or quant finance concepts!</div>
    </div>
    <div style="padding:8px 14px;border-top:1px solid var(--border)">
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">
        <button onclick="document.getElementById('aiInput').value='What projects has he done?';document.getElementById('aiSend').click()" style="font-size:10px;background:rgba(0,240,180,.07);border:1px solid rgba(0,240,180,.15);color:var(--accent);border-radius:12px;padding:2px 8px;cursor:pointer;font-family:var(--font)">Projects</button>
        <button onclick="document.getElementById('aiInput').value='What are his skills?';document.getElementById('aiSend').click()" style="font-size:10px;background:rgba(0,240,180,.07);border:1px solid rgba(0,240,180,.15);color:var(--accent);border-radius:12px;padding:2px 8px;cursor:pointer;font-family:var(--font)">Skills</button>
        <button onclick="document.getElementById('aiInput').value='Explain Black-Litterman simply';document.getElementById('aiSend').click()" style="font-size:10px;background:rgba(0,240,180,.07);border:1px solid rgba(0,240,180,.15);color:var(--accent);border-radius:12px;padding:2px 8px;cursor:pointer;font-family:var(--font)">Black-Litterman</button>
        <button onclick="document.getElementById('aiInput').value='How can I hire him?';document.getElementById('aiSend').click()" style="font-size:10px;background:rgba(0,240,180,.07);border:1px solid rgba(0,240,180,.15);color:var(--accent);border-radius:12px;padding:2px 8px;cursor:pointer;font-family:var(--font)">Hire</button>
      </div>
    </div>
    <div class="ai-input-row">
      <input type="text" id="aiInput" placeholder="Ask about Ajeet or quant finance…" />
      <button id="aiSend">→</button>
    </div>
    <div style="font-size:10px;color:var(--muted);text-align:center;padding:5px;border-top:1px solid var(--border)">
      Powered by NVIDIA Nemotron 627B (free) via OpenRouter
    </div>
  </div>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap">
      <div style="font-family:var(--mono);font-size:20px;font-weight:700">AK<span style="color:var(--accent)">.</span></div>
      <div style="display:flex;gap:20px;font-size:13px;flex-wrap:wrap">
        <a href="mailto:ajeetk095@gmail.com" style="color:var(--muted);transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--muted)'">ajeetk095@gmail.com</a>
        <a href="https://linkedin.com/in/ajeek095" target="_blank" style="color:var(--muted);transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--muted)'">LinkedIn</a>
        <a href="https://github.com/ajeetk095" target="_blank" style="color:var(--muted);transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--muted)'">GitHub</a>
        <a href="${base}pages/resume.html" style="color:var(--muted);transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--muted)'">Resume</a>
      </div>
      <p style="font-size:12px;color:var(--muted)">© 2025 Ajeet Kumar · Bangalore, India</p>
    </div>
  </footer>`;

  // Inject nav at top of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Inject AI widget
  document.body.insertAdjacentHTML('beforeend', aiHTML);

  // Inject footer — replace placeholder or append
  const footerTarget = document.getElementById('site-footer');
  if (footerTarget) footerTarget.outerHTML = footerHTML;
  else document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Mark active link
  requestAnimationFrame(() => {
    const cur = location.pathname.replace(/.*\//, '');
    document.querySelectorAll('.nav-links a').forEach(a => {
      const aFile = a.getAttribute('href').replace(/.*\//, '');
      if (aFile === cur || (cur === '' && aFile === 'index.html')) {
        a.classList.add('active');
      }
    });
  });
})();
