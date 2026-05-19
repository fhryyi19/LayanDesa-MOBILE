/**
 * pages/register.js — Halaman Daftar Akun Baru
 */

function renderRegister(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="detail-header">
        <button class="back-btn" onclick="Router.goBack()" aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="detail-title">Daftar Akun</h1>
      </div>

      <div class="auth-wrapper">
        <div class="auth-header">
          <div class="auth-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h2 class="auth-title">Buat Akun Baru</h2>
          <p class="auth-subtitle">Daftarkan diri untuk mengakses sistem pengaduan</p>
        </div>

        <div id="reg-alert"></div>

        <form id="form-register" onsubmit="submitRegister(event)">
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input type="text" id="r-nama" class="form-input with-icon" placeholder="Sesuai KTP" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input type="email" id="r-email" class="form-input with-icon" placeholder="email@contoh.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nomor HP <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.23a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <input type="tel" id="r-nohp" class="form-input with-icon" placeholder="08xxxxxxxxxx" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input type="password" id="r-password" class="form-input with-icon" placeholder="Min. 8 karakter + angka" required>
              <button type="button" class="toggle-password" onclick="togglePassword('r-password')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="form-group" style="display:flex; gap:10px; align-items:flex-start;">
            <input type="checkbox" id="r-setuju" style="margin-top:4px;" required>
            <label for="r-setuju" style="font-size:12px; color:var(--text2); line-height:1.5;">Saya menyetujui bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan.</label>
          </div>

          <button type="submit" class="btn-submit" id="btn-reg" style="display:flex; align-items:center; justify-content:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <span id="btn-reg-text">Buat Akun</span>
          </button>
        </form>

        <div class="auth-divider"><span>Sudah punya akun?</span></div>
        <button class="btn-outline-green" onclick="Router.navigate('login', {}, false)">
          Masuk ke Akun
        </button>
      </div>
    </div>
  `;
}

async function submitRegister(e) {
  e.preventDefault();
  const nama = document.getElementById('r-nama').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const no_hp = document.getElementById('r-nohp').value.trim();
  const password = document.getElementById('r-password').value.trim();
  
  const btn = document.getElementById('btn-reg');
  const alert = document.getElementById('reg-alert');
  
  btn.disabled = true;
  document.getElementById('btn-reg-text').textContent = 'Memproses...';
  alert.innerHTML = '';

  try {
    await API.register({ nama, email, no_hp, password });
    UI.toast('Registrasi berhasil! Silakan login.', 'success');
    Router.navigate('login');
  } catch (err) {
    alert.innerHTML = `<div class="alert-error">${err.message}</div>`;
  } finally {
    btn.disabled = false;
    document.getElementById('btn-reg-text').textContent = 'Buat Akun';
  }
}
