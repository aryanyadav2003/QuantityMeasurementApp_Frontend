// ── API Configuration ──────────────────────
const API_BASE = 'http://localhost:5000/api/v1';

// ── Token Manager ──────────────────────────
class TokenManager {
  static get()        { return localStorage.getItem('jwt_token'); }
  static set(token)   { localStorage.setItem('jwt_token', token); }
  static remove()     { localStorage.removeItem('jwt_token'); }
  static getUser()    { return JSON.parse(localStorage.getItem('user_info') || 'null'); }
  static setUser(u)   { localStorage.setItem('user_info', JSON.stringify(u)); }
  static removeUser() { localStorage.removeItem('user_info'); }
  static isLoggedIn() { return !!this.get(); }
  static isAdmin()    { const u = this.getUser(); return u && u.role === 'ADMIN'; }
}

// ── Headers ────────────────────────────────
const authHeaders   = () => ({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${TokenManager.get()}`
});
const publicHeaders = () => ({ 'Content-Type': 'application/json' });

// ── Generic Fetch Wrapper ──────────────────
async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data     = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.Message || 'Request failed');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ── Auth API ───────────────────────────────
const AuthAPI = {
  register: (fullName, email, password, role) =>
    apiFetch(`${API_BASE}/auth/register`, {
      method: 'POST', headers: publicHeaders(),
      body: JSON.stringify({ fullName, email, password, role })
    }),

  login: (email, password) =>
    apiFetch(`${API_BASE}/auth/login`, {
      method: 'POST', headers: publicHeaders(),
      body: JSON.stringify({ email, password })
    }),

  encrypt: (plainText) =>
    apiFetch(`${API_BASE}/auth/encrypt`, {
      method: 'POST', headers: publicHeaders(),
      body: JSON.stringify({ plainText })
    }),

  decrypt: (cipherText) =>
    apiFetch(`${API_BASE}/auth/decrypt`, {
      method: 'POST', headers: publicHeaders(),
      body: JSON.stringify({ cipherText })
    })
};

// ── Quantity API ───────────────────────────
const QuantityAPI = {
  buildQ: (value, unit, measurementType) => ({
    value: parseFloat(value),
    unit:  unit.toUpperCase(),
    measurementType: measurementType.toUpperCase()
  }),

  compare:        (q1, q2)          => apiFetch(`${API_BASE}/quantities/compare`,   { method: 'POST', headers: authHeaders(), body: JSON.stringify({ thisQuantity: q1, thatQuantity: q2 }) }),
  convert:        (q, targetUnit)   => apiFetch(`${API_BASE}/quantities/convert`,   { method: 'POST', headers: authHeaders(), body: JSON.stringify({ thisQuantity: q,  targetUnit: targetUnit.toUpperCase() }) }),
  add:            (q1, q2, target)  => apiFetch(`${API_BASE}/quantities/add`,       { method: 'POST', headers: authHeaders(), body: JSON.stringify({ thisQuantity: q1, thatQuantity: q2, targetUnit: target.toUpperCase() }) }),
  subtract:       (q1, q2, target)  => apiFetch(`${API_BASE}/quantities/subtract`,  { method: 'POST', headers: authHeaders(), body: JSON.stringify({ thisQuantity: q1, thatQuantity: q2, targetUnit: target.toUpperCase() }) }),
  divide:         (q1, q2)          => apiFetch(`${API_BASE}/quantities/divide`,    { method: 'POST', headers: authHeaders(), body: JSON.stringify({ thisQuantity: q1, thatQuantity: q2 }) }),
  getHistory:     ()                => apiFetch(`${API_BASE}/quantities/history`,   { method: 'GET',  headers: authHeaders() }),
  getByOperation: (op)              => apiFetch(`${API_BASE}/quantities/history/operation/${op}`, { method: 'GET', headers: authHeaders() }),
  getByType:      (t)               => apiFetch(`${API_BASE}/quantities/history/type/${t}`,       { method: 'GET', headers: authHeaders() }),
  getCount:       ()                => apiFetch(`${API_BASE}/quantities/count`,     { method: 'GET',  headers: authHeaders() })
};

// ── Unit Definitions ───────────────────────
const UNITS = {
  LENGTH:      ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT:      ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME:      ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT']
};

// ── UI Helpers ─────────────────────────────
const showAlert  = (el, msg, type = 'error') => { el.className = `alert alert-${type} show`; el.textContent = msg; };
const hideAlert  = (el) => { el.className = 'alert'; el.textContent = ''; };
const showResult = (el, html, type = 'success') => { el.className = `result-box show ${type === 'error' ? 'error-box' : 'success'}`; el.innerHTML = html; };

const populateSelect = (select, options) => {
  select.innerHTML = options.map(o => `<option value="${o}">${o}</option>`).join('');
};

const setLoading = (btn, spinner, loading) => {
  btn.disabled = loading;
  spinner.classList.toggle('show', loading);
  btn.querySelector('.btn-text').textContent = loading ? 'Loading...' : btn.dataset.text;
};

// ── Auth Modal Controller ──────────────────
const AuthModal = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('authModal');
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(tab = 'login') {
    this.overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Switch to correct tab
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelector(`[data-form="${tab}Form"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
  },

  close() {
    this.overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
};