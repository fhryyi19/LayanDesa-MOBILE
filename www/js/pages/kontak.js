/**
 * pages/kontak.js — Halaman Kontak & Sistem Pengaduan Masyarakat
 */

async function renderKontak(view) {
  const user = window.APP_STATE.user;
  
  let recentKeluhanHTML = '';
  if (user) {
    try {
      const res = await API.getKeluhan();
      const list = res.list.slice(0, 5);
      if (list.length > 0) {
        recentKeluhanHTML = `
          <div style="margin-top:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-size:16px; font-weight:800;">Keluhan Terakhir Saya</h3>
              <a href="#keluhan" onclick="Router.navigate('keluhan'); return false;" style="color:var(--green); font-size:12px; font-weight:600; text-decoration:none;">Lihat Semua &rarr;</a>
            </div>
            <div>
              ${list.map(k => `
                <a href="#keluhan-detail" onclick="Router.navigate('keluhan-detail', {id: ${k.id}}); return false;" class="keluhan-list-item" style="padding:12px; margin-bottom:8px;">
                  <div class="keluhan-list-header" style="margin-bottom:4px;">
                    <span class="keluhan-kode">${k.kode_tiket}</span>
                    <span style="font-size:10px; color:var(--text2);">${k.kategori}</span>
                  </div>
                  <div class="keluhan-title" style="font-size:13px; margin-bottom:6px;">${k.judul}</div>
                  <span class="status-badge status-badge--${k.status}">${k.status.toUpperCase()}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to fetch recent keluhan', e);
    }
  }

  const loginGateHTML = `
    <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px; text-align:center; margin-bottom:24px;">
      <div style="width:56px; height:56px; background:rgba(59,130,246,0.1); color:var(--blue); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <h3 style="font-size:16px; font-weight:800; margin-bottom:8px;">Login Diperlukan</h3>
      <p style="font-size:12px; color:var(--text2); line-height:1.5; margin-bottom:20px;">Silakan login terlebih dahulu untuk mengirim keluhan agar kami dapat memberikan update status keluhan Anda.</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn-submit" onclick="Router.navigate('login')" style="display:flex; align-items:center; justify-content:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Masuk ke Akun
        </button>
        <button class="btn-outline-green" onclick="Router.navigate('register')">Daftar Akun Baru</button>
      </div>
    </div>
  `;

  const complaintFormHTML = `
    <div class="form-section" style="padding:0; margin-bottom:24px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div>
          <h2 class="form-section-title">Kirim Keluhan</h2>
          <p class="form-section-sub" style="margin-bottom:0;">Sampaikan aspirasi atau keluhan Anda.</p>
        </div>
      </div>
      
      <div id="keluhan-alert"></div>

      <form id="form-keluhan" onsubmit="submitKeluhanForm(event)">
        <div class="form-group">
          <label class="form-label">Judul Keluhan <span class="req">*</span></label>
          <input type="text" id="k-judul" class="form-input" placeholder="Contoh: Jalan rusak di RT 03" required>
        </div>

        <div class="form-group">
          <label class="form-label">Kategori <span class="req">*</span></label>
          <select id="k-kategori" class="form-input" required style="background-color:var(--card);">
            <option value="">-- Pilih Kategori --</option>
            ${['Infrastruktur','Kebersihan','Keamanan','Pelayanan Publik','Kesehatan','Pendidikan','Sosial','Lainnya'].map(k => `<option value="${k}">${k}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Isi Laporan <span class="req">*</span></label>
          <textarea id="k-isi" class="form-input form-textarea" placeholder="Deskripsikan secara detail..." required></textarea>
          <div class="form-hint">Minimal 20 karakter</div>
        </div>

        <div class="form-group">
          <label class="form-label">Foto Bukti <span style="font-weight:normal; color:var(--text3)">(opsional)</span></label>
          <input type="file" id="k-foto" accept="image/*" style="display:none;" onchange="previewKeluhanFoto(this)">
          <div class="file-upload-btn" onclick="document.getElementById('k-foto').click()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Pilih Foto
          </div>
          <img id="k-foto-preview" class="foto-preview" style="display:none;">
          <input type="hidden" id="k-foto-base64">
        </div>

        <div style="display:flex; gap:10px;">
          <div class="form-group" style="flex:1;">
            <label class="form-label">Lokasi</label>
            <input type="text" id="k-lokasi" class="form-input" placeholder="Lokasi kejadian">
          </div>
          <div class="form-group" style="flex:1;">
            <label class="form-label">Tanggal</label>
            <input type="date" id="k-tanggal" class="form-input" max="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>

        <button type="submit" class="btn-submit" id="btn-submit-keluhan" style="display:flex; align-items:center; justify-content:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span id="btn-sk-text">Kirim Keluhan</span>
        </button>
      </form>
    </div>
  `;

  view.innerHTML = `
    <div class="page-inner">
      <div class="inner-header">
        <h1 class="inner-title">Kontak &amp; Pengaduan</h1>
        <p class="inner-subtitle">Layanan pelaporan masyarakat terpadu</p>
      </div>

      <div style="padding: 0 16px;">
        ${user ? `
          <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; background:var(--green-glow); color:var(--green); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style="font-size:14px; font-weight:700;">Halo, ${user.nama.split(' ')[0]}</div>
                <div style="font-size:11px; color:var(--text2);">${user.email}</div>
              </div>
            </div>
            <button onclick="logoutApp()" style="background:none; border:none; color:#EF4444; font-size:12px; font-weight:600; cursor:pointer; padding:8px;">Keluar</button>
          </div>
        ` : ''}

        ${user ? complaintFormHTML : loginGateHTML}
        ${recentKeluhanHTML}
      </div>

      <!-- Info Kontak -->
      <div class="list-container" style="margin-top: ${user ? '0' : '0'};">
        <h3 style="font-size:16px; font-weight:800; margin-bottom:12px;">Informasi Kontak</h3>
        <div class="kontak-info-grid">
          <div class="ki-item">
            <span class="ki-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <div><div class="ki-label">Alamat Kantor</div><div class="ki-val">Jl. Desa Sukamaju No. 1, Cikaret, Sukabumi</div></div>
          </div>
          <div class="ki-item">
            <span class="ki-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.23a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
            </span>
            <div><div class="ki-label">Telepon</div><div class="ki-val">(0266) 123-456</div></div>
          </div>
          <div class="ki-item">
            <span class="ki-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <div><div class="ki-label">Email</div><div class="ki-val">desa.sukamaju@gmail.com</div></div>
          </div>
          <div class="ki-item">
            <span class="ki-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div><div class="ki-label">Jam Pelayanan</div><div class="ki-val">Senin–Jumat: 08.00–16.00 WIB</div></div>
          </div>
        </div>
      </div>

      <div style="height:32px;"></div>
    </div>
  `;
}

function previewKeluhanFoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('k-foto-preview').src = e.target.result;
      document.getElementById('k-foto-preview').style.display = 'block';
      document.getElementById('k-foto-base64').value = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

async function submitKeluhanForm(e) {
  e.preventDefault();
  const judul = document.getElementById('k-judul').value.trim();
  const kategori = document.getElementById('k-kategori').value.trim();
  const isi = document.getElementById('k-isi').value.trim();
  const lokasi = document.getElementById('k-lokasi').value.trim();
  const tanggal_kejadian = document.getElementById('k-tanggal').value.trim();
  const foto_bukti_base64 = document.getElementById('k-foto-base64').value;
  
  if (isi.length < 20) {
    UI.toast('Isi laporan minimal 20 karakter.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-keluhan');
  btn.disabled = true;
  document.getElementById('btn-sk-text').textContent = 'Mengirim...';

  try {
    const res = await API.submitKeluhan({ judul, kategori, isi, lokasi, tanggal_kejadian, foto_bukti_base64 });
    UI.toast(`Keluhan terkirim! Tiket: ${res.kode_tiket}`, 'success');
    document.getElementById('form-keluhan').reset();
    document.getElementById('k-foto-preview').style.display = 'none';
    document.getElementById('k-foto-base64').value = '';
    
    // Refresh page to show new list
    Router.navigate('kontak', {}, false);
  } catch (err) {
    document.getElementById('keluhan-alert').innerHTML = `<div class="alert-error">${err.message}</div>`;
    UI.toast('Gagal mengirim keluhan', 'error');
  } finally {
    btn.disabled = false;
    document.getElementById('btn-sk-text').textContent = 'Kirim Keluhan';
  }
}

async function logoutApp() {
  try {
    await API.logout();
    window.APP_STATE.user = null;
    UI.toast('Berhasil keluar', 'success');
    Router.navigate('home');
  } catch(e) {
    console.error(e);
  }
}
