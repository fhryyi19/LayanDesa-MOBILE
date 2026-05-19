/**
 * pages/login.js — Halaman Login Masyarakat
 */

function renderLogin(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="detail-header">
        <button class="back-btn" onclick="Router.goBack()" aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="detail-title">Login</h1>
      </div>

      <div class="auth-wrapper">
        <div class="auth-header">
          <div class="auth-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 class="auth-title">Masuk ke Akun Anda</h2>
          <p class="auth-subtitle">Sistem pengaduan masyarakat LayanDesa</p>
        </div>

        <div id="login-alert"></div>

        <form id="form-login" onsubmit="submitLogin(event)">
          <div class="form-group">
            <label class="form-label" for="l-email">Email <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input type="email" id="l-email" class="form-input with-icon" placeholder="email@contoh.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="l-password">Password <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input type="password" id="l-password" class="form-input with-icon" placeholder="Masukkan password" required>
              <button type="button" class="toggle-password" onclick="togglePassword('l-password')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" id="btn-login" style="display:flex; align-items:center; justify-content:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span id="btn-login-text">Masuk</span>
          </button>
        </form>

        <div class="auth-divider"><span>Belum punya akun?</span></div>
        <button class="btn-outline-green" onclick="Router.navigate('register', {}, false)">
          Daftar Akun Baru
        </button>
      </div>
    </div>
  `;
}

function togglePassword(id) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

async function submitLogin(e) {
  e.preventDefault();
  const email = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-password').value.trim();
  
  const btn = document.getElementById('btn-login');
  const alert = document.getElementById('login-alert');
  
  btn.disabled = true;
  document.getElementById('btn-login-text').textContent = 'Memproses...';
  alert.innerHTML = '';

  try {
    const res = await API.login({ email, password });
    window.APP_STATE.user = res.user;
    if (res.token) {
      localStorage.setItem('ld_token', res.token);
    }
    UI.toast('Login berhasil!', 'success');
    Router.navigate('kontak'); // Redirect back to kontak
  } catch (err) {
    alert.innerHTML = `<div class="alert-error">${err.message}</div>`;
  } finally {
    btn.disabled = false;
    document.getElementById('btn-login-text').textContent = 'Masuk';
  }
}
