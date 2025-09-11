// Storage with TTL helpers
const Storage = {
  setWithTTL(key, value, ttlMs) {
    const now = Date.now();
    const record = { value, expiresAt: now + ttlMs };
    try {
      localStorage.setItem(key, JSON.stringify(record));
    } catch (err) {
      // ignore quota errors silently
    }
  },
  getWithTTL(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (!record || typeof record.expiresAt !== 'number') return null;
      if (Date.now() > record.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return record.value;
    } catch (err) {
      return null;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (_) {}
  }
};

// Toast notifications
const Toast = (() => {
  let el;
  function ensure() {
    if (el) return el;
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
    return el;
  }
  /**
   * type: success | danger | info
   */
  function show(message, type = 'info', timeout = 2200) {
    const node = ensure();
    node.textContent = message;
    node.classList.remove('toast--success', 'toast--danger', 'toast--info');
    node.classList.add(`toast--${type}`);
    requestAnimationFrame(() => node.classList.add('show'));
    window.clearTimeout(node._t);
    node._t = window.setTimeout(() => node.classList.remove('show'), timeout);
  }
  return { show };
})();

// Random code generator
function generateVerificationCode(length = 10) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

// Device-friendly: prevent app from navigating away accidentally
function lockDuringVerification(lock = true) {
  try {
    if (lock) {
      history.pushState({ verifyLock: true }, '');
      window.onpopstate = (e) => {
        if (e && e.state && e.state.verifyLock) {
          history.pushState({ verifyLock: true }, '');
        }
      };
    } else {
      window.onpopstate = null;
    }
  } catch (_) {}
}

// Minimal query helper
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Expose utilities globally for simple pages
window.ADS = { Storage, Toast, generateVerificationCode, lockDuringVerification, $, $all };

