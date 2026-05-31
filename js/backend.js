/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO BACKEND LAYER  —  js/backend.js
   Simulates a full REST API using localStorage as the database.
   All CRUD routes match the spec:
     POST   /admin/experience
     PUT    /admin/projects/:id
     DELETE /admin/skills/:id
   Auth is JWT-style token stored in sessionStorage.
   Asset uploads are stored as base64 in localStorage (< 5 MB each).
═══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════
//  AUTH  (JWT-style via sessionStorage)
// ══════════════════════════════════════════
const Auth = {
  TOKEN_KEY: 'admin_jwt',
  CREDS_KEY: 'admin_creds',

  defaultCreds() {
    return { user: 'admin', pass: 'ajeet2025', email: 'ajeetk095@gmail.com' };
  },

  getCreds() {
    try { return JSON.parse(localStorage.getItem(this.CREDS_KEY)) || this.defaultCreds(); }
    catch { return this.defaultCreds(); }
  },

  // Issue a token valid for 2 h (or 30 days if remember=true)
  login(userOrEmail, pass, remember = false) {
    const c = this.getCreds();
    if ((userOrEmail === c.user || userOrEmail === c.email) && pass === c.pass) {
      const exp = Date.now() + (remember ? 30 * 86400000 : 7200000);
      const token = btoa(JSON.stringify({ user: c.user, exp, iat: Date.now() }));
      sessionStorage.setItem(this.TOKEN_KEY, token);
      if (remember) localStorage.setItem(this.TOKEN_KEY, token);
      return { ok: true, token };
    }
    return { ok: false, error: 'Invalid credentials' };
  },

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  },

  isLoggedIn() {
    const raw = sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
    if (!raw) return false;
    try {
      const { exp } = JSON.parse(atob(raw));
      return Date.now() < exp;
    } catch { return false; }
  },

  getUser() {
    const raw = sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
    if (!raw) return null;
    try { return JSON.parse(atob(raw)); } catch { return null; }
  },

  changePassword(current, next) {
    const c = this.getCreds();
    if (current !== c.pass) return { ok: false, error: 'Current password incorrect' };
    if (next.length < 8) return { ok: false, error: 'Password must be 8+ characters' };
    c.pass = next;
    localStorage.setItem(this.CREDS_KEY, JSON.stringify(c));
    return { ok: true };
  },

  resetPassword(next) {
    const c = this.getCreds();
    c.pass = next;
    localStorage.setItem(this.CREDS_KEY, JSON.stringify(c));
    return { ok: true };
  }
};

// ══════════════════════════════════════════
//  DATABASE  (localStorage CRUD)
// ══════════════════════════════════════════
const DB = {
  // Returns live data: localStorage override → PORTFOLIO_DATA default
  get(key) {
    try {
      const s = localStorage.getItem('portfolio_' + key);
      return s ? JSON.parse(s) : (PORTFOLIO_DATA[key] || (Array.isArray(PORTFOLIO_DATA[key]) ? [] : {}));
    } catch { return PORTFOLIO_DATA[key] || []; }
  },

  set(key, val) {
    localStorage.setItem('portfolio_' + key, JSON.stringify(val));
    return val;
  },

  // Generic list CRUD
  findAll(key) { return this.get(key) || []; },

  findById(key, id) {
    return this.findAll(key).find(item => String(item.id) === String(id)) || null;
  },

  create(key, data) {
    const arr = this.findAll(key);
    const item = { ...data, id: data.id || Date.now().toString() };
    arr.push(item);
    this.set(key, arr);
    return item;
  },

  update(key, id, data) {
    const arr = this.findAll(key);
    const idx = arr.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...data, id };
    this.set(key, arr);
    return arr[idx];
  },

  remove(key, id) {
    const arr = this.findAll(key);
    const idx = arr.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return false;
    arr.splice(idx, 1);
    this.set(key, arr);
    return true;
  },

  exportAll() {
    const keys = ['personal','projects','experience','education','skills','certifications','blog','gallery','jobs','assets'];
    const out = {};
    keys.forEach(k => { out[k] = this.get(k); });
    return out;
  },

  importAll(data) {
    Object.entries(data).forEach(([k, v]) => this.set(k, v));
  },

  resetAll() {
    ['personal','projects','experience','education','skills','certifications','blog','gallery','jobs','assets']
      .forEach(k => localStorage.removeItem('portfolio_' + k));
  }
};

// ══════════════════════════════════════════
//  ASSET MANAGER  (base64 + metadata)
// ══════════════════════════════════════════
const AssetManager = {
  MAX_SIZE_MB: 4,

  getAll() { return DB.get('assets') || []; },

  async upload(file, meta = {}) {
    if (file.size > this.MAX_SIZE_MB * 1024 * 1024) {
      return { ok: false, error: `File too large. Max ${this.MAX_SIZE_MB}MB.` };
    }
    const base64 = await this._toBase64(file);
    const asset = {
      id: Date.now().toString(),
      filename: file.name,
      type: file.type,           // e.g. image/jpeg, application/pdf
      size: file.size,
      base64,
      url: base64,               // inline data URL — usable directly in <img src>
      title: meta.title || file.name,
      description: meta.description || '',
      tags: meta.tags || [],
      uploadedAt: new Date().toISOString(),
      category: meta.category || 'general'
    };
    DB.create('assets', asset);
    return { ok: true, asset };
  },

  update(id, meta) {
    const updated = DB.update('assets', id, meta);
    return updated ? { ok: true, asset: updated } : { ok: false, error: 'Asset not found' };
  },

  delete(id) {
    return DB.remove('assets', id) ? { ok: true } : { ok: false, error: 'Asset not found' };
  },

  getByCategory(cat) {
    return this.getAll().filter(a => a.category === cat);
  },

  _toBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(new Error('File read failed'));
      r.readAsDataURL(file);
    });
  },

  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
};

// ══════════════════════════════════════════
//  REST-STYLE API ROUTER
//  Usage: API.call('POST', '/admin/experience', data)
//         API.call('PUT',  '/admin/projects/123', data)
//         API.call('DELETE','/admin/skills/456')
// ══════════════════════════════════════════
const API = {
  call(method, path, body = null) {
    if (!Auth.isLoggedIn()) return { status: 401, error: 'Unauthorized' };

    const parts = path.replace(/^\/admin\//, '').split('/');
    const resource = parts[0];   // e.g. 'experience', 'projects', 'skills'
    const id       = parts[1];   // e.g. '123' or undefined

    // Map resource to DB key (pluralize if needed)
    const KEY_MAP = {
      experience: 'experience', experiences: 'experience',
      project: 'projects',      projects: 'projects',
      skill: 'skills',          skills: 'skills',
      education: 'education',
      certification: 'certifications', certifications: 'certifications',
      blog: 'blog',
      gallery: 'gallery',
      job: 'jobs',              jobs: 'jobs',
      personal: 'personal',
    };
    const key = KEY_MAP[resource];
    if (!key) return { status: 404, error: `Resource '${resource}' not found` };

    switch (method.toUpperCase()) {
      case 'GET':
        return id
          ? { status: 200, data: DB.findById(key, id) }
          : { status: 200, data: DB.findAll(key) };

      case 'POST':
        if (!body) return { status: 400, error: 'No body provided' };
        return { status: 201, data: DB.create(key, body) };

      case 'PUT':
      case 'PATCH':
        if (!id) return { status: 400, error: 'ID required for PUT' };
        const updated = DB.update(key, id, body);
        return updated
          ? { status: 200, data: updated }
          : { status: 404, error: 'Not found' };

      case 'DELETE':
        if (!id) return { status: 400, error: 'ID required for DELETE' };
        return DB.remove(key, id)
          ? { status: 200, data: { deleted: true, id } }
          : { status: 404, error: 'Not found' };

      default:
        return { status: 405, error: 'Method not allowed' };
    }
  },

  // Convenience wrappers
  get:    (path)        => API.call('GET',    path),
  post:   (path, body)  => API.call('POST',   path, body),
  put:    (path, body)  => API.call('PUT',    path, body),
  patch:  (path, body)  => API.call('PATCH',  path, body),
  delete: (path)        => API.call('DELETE', path),
};

// ══════════════════════════════════════════
//  EDIT MODE  (inline editing for visitors)
//  Shows edit pencils on all content when
//  admin is logged in and visits public pages
// ══════════════════════════════════════════
const EditMode = {
  active: false,

  init() {
    if (!Auth.isLoggedIn()) return;
    this.active = true;
    this._injectAdminBar();
  },

  _injectAdminBar() {
    if (document.getElementById('adminQuickBar')) return;
    const bar = document.createElement('div');
    bar.id = 'adminQuickBar';
    bar.style.cssText = `
      position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
      background:rgba(13,21,32,0.95); border:1px solid rgba(0,240,180,.25);
      backdrop-filter:blur(16px); border-radius:32px; padding:8px 20px;
      display:flex; align-items:center; gap:14px; z-index:8990;
      box-shadow:0 4px 24px rgba(0,0,0,.5); font-family:'Space Grotesk',sans-serif;
    `;
    bar.innerHTML = `
      <span style="font-size:12px;color:var(--accent);font-weight:600">⚡ Admin Mode</span>
      <div style="width:1px;height:16px;background:rgba(255,255,255,.15)"></div>
      <a href="/admin/dashboard.html" style="font-size:12px;color:var(--text);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text)'">Dashboard</a>
      <a href="/index.html" style="font-size:12px;color:var(--text);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text)'">Home</a>
      <button onclick="EditMode.minimize()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;line-height:1;transition:color .2s" title="Minimize" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--muted)'">─</button>
      <button onclick="EditMode.close()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;line-height:1;transition:color .2s" title="Logout & close" onmouseover="this.style.color='#ff5050'" onmouseout="this.style.color='var(--muted)'">✕</button>
    `;
    document.body.appendChild(bar);
  },

  minimize() {
    const bar = document.getElementById('adminQuickBar');
    if (!bar) return;
    const isMin = bar.dataset.minimized === '1';
    if (isMin) {
      bar.style.padding = '8px 20px';
      bar.querySelectorAll('a, span, div[style*="width:1px"]').forEach(el => el.style.display = '');
      bar.dataset.minimized = '0';
    } else {
      bar.querySelectorAll('a, span, div[style*="width:1px"]').forEach(el => el.style.display = 'none');
      bar.style.padding = '8px 12px';
      bar.dataset.minimized = '1';
    }
  },

  close() {
    Auth.logout();
    const bar = document.getElementById('adminQuickBar');
    if (bar) bar.remove();
    this.active = false;
  }
};

// Auto-init edit mode on every page load
document.addEventListener('DOMContentLoaded', () => EditMode.init());

// Expose globals
window.Auth = Auth;
window.DB   = DB;
window.API  = API;
window.AssetManager = AssetManager;
window.EditMode = EditMode;
