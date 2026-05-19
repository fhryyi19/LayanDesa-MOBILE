/**
 * pages/pengumuman.js — Halaman Pengumuman
 */

async function renderPengumuman(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="inner-header">
        <h1 class="inner-title" style="display:flex; align-items:center; gap:8px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Pengumuman</h1>
        <p class="inner-subtitle">Informasi resmi dari Pemerintah Desa Sukamaju</p>
      </div>
      <div class="list-container" id="pgm-list">${UI.skeleton(3)}</div>
      <div style="height:24px;"></div>
    </div>`;

  try {
    const list = await API.getPengumuman();
    const el = document.getElementById('pgm-list');
    if (!el) return;

    if (!list.length) {
      el.innerHTML = UI.empty(`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`, 'Belum ada pengumuman.');
      return;
    }

    el.innerHTML = list.map(p => `
      <div class="pgm-card" id="pgm-${p.id}">
        <div class="pgm-card-top">
          <div class="pgm-icon-wrap" style="color:var(--text3);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <div class="pgm-card-info">
            <div class="pgm-card-date">${p.tanggal_f}</div>
            <h3 class="pgm-card-title">${p.judul}</h3>
          </div>
        </div>
        <div class="pgm-card-body" id="pgm-body-${p.id}">
          <p class="pgm-text collapsed" id="pgm-text-${p.id}">${p.isi.replace(/\n/g, '<br>')}</p>
          <button class="pgm-toggle-btn" onclick="togglePgm(${p.id})" id="pgm-btn-${p.id}">
            Baca selengkapnya
          </button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    const el = document.getElementById('pgm-list');
    if (el) el.innerHTML = UI.error(e.message);
  }
}

function togglePgm(id) {
  const text = document.getElementById(`pgm-text-${id}`);
  const btn  = document.getElementById(`pgm-btn-${id}`);
  const collapsed = text.classList.toggle('collapsed');
  btn.textContent = collapsed ? 'Baca selengkapnya' : 'Sembunyikan';
}
