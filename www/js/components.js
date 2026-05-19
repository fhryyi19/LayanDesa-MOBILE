/**
 * components.js — Shared UI component builders
 */

const UI = {
  /** Loading skeleton */
  skeleton(lines = 3) {
    return `<div class="skeleton-wrap">
      ${Array(lines).fill('<div class="skeleton-line"></div>').join('')}
    </div>`;
  },

  /** Error state */
  error(msg) {
    return `<div class="empty-state error-state">
      <div class="empty-icon" style="color: #EF4444;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
      <p class="empty-text">${msg}</p>
      <button class="btn-retry" onclick="window.location.reload()">Coba Lagi</button>
    </div>`;
  },

  /** Empty state */
  empty(icon, msg) {
    return `<div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <p class="empty-text">${msg}</p>
    </div>`;
  },

  /** Back button header */
  backHeader(title) {
    return `<div class="detail-header">
      <button class="back-btn" onclick="Router.goBack()" aria-label="Kembali">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="detail-title">${title}</span>
    </div>`;
  },

  /** Toast notification */
  toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3000);
  },

  /** Format rupiah / angka */
  formatNumber(n) {
    return n.toLocaleString('id-ID');
  },
};
