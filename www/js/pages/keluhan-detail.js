/**
 * pages/keluhan-detail.js — Halaman Detail Keluhan & Timeline
 */

async function renderKeluhanDetail(view, params = {}) {
  const id = params.id;
  if (!id) return Router.navigate('keluhan');

  view.innerHTML = `
    <div class="page-inner">
      <div class="detail-header">
        <button class="back-btn" onclick="Router.goBack()" aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="detail-title">Detail Keluhan</h1>
      </div>
      
      <div id="kd-content" class="detail-content">
        <div class="skeleton-wrap">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-chip" style="width:100%; height:100px;"></div>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await API.getKeluhanDetail(id);
    const d = res.detail;
    const tl = res.timeline;

    const fotoHTML = d.foto_bukti_url 
      ? `<div style="margin-top:16px;">
           <div style="font-size:12px; font-weight:700; margin-bottom:8px;">Foto Bukti</div>
           <img src="${window.APP_CONFIG.API_BASE.replace('/api', '')}/${d.foto_bukti_url.replace('../', '')}" class="foto-preview" style="margin-top:0;">
         </div>` 
      : '';

    const detailHTML = `
      <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:16px; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <div class="keluhan-kode">${d.kode_tiket}</div>
            <h2 style="font-size:16px; font-weight:800; line-height:1.4; margin-top:4px;">${d.judul}</h2>
          </div>
          <span class="status-badge status-badge--${d.status}" style="margin-left:8px; flex-shrink:0;">${d.status.toUpperCase()}</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; font-size:11px;">
          <div>
            <div style="color:var(--text2); margin-bottom:2px;">Kategori</div>
            <div style="font-weight:600;">${d.kategori}</div>
          </div>
          <div>
            <div style="color:var(--text2); margin-bottom:2px;">Tanggal Lapor</div>
            <div style="font-weight:600;">${d.created_at.split(' ')[0]}</div>
          </div>
          ${d.lokasi ? `
          <div style="grid-column: span 2;">
            <div style="color:var(--text2); margin-bottom:2px;">Lokasi Kejadian</div>
            <div style="font-weight:600;">${d.lokasi}</div>
          </div>` : ''}
          ${d.tanggal_kejadian ? `
          <div style="grid-column: span 2;">
            <div style="color:var(--text2); margin-bottom:2px;">Tanggal Kejadian</div>
            <div style="font-weight:600;">${d.tanggal_kejadian}</div>
          </div>` : ''}
        </div>

        <div>
          <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Isi Laporan</div>
          <div style="font-size:13px; color:var(--text2); line-height:1.6;">${d.isi.replace(/\\n/g, '<br>')}</div>
        </div>

        ${fotoHTML}

        ${d.status === 'ditolak' && d.alasan_penolakan ? `
          <div class="alert-error" style="margin-top:16px;">
            <strong>Alasan Penolakan:</strong><br>
            ${d.alasan_penolakan}
          </div>
        ` : ''}
      </div>
    `;

    const timelineHTML = `
      <h3 style="font-size:16px; font-weight:800; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Timeline Proses
      </h3>
      
      <div class="timeline">
        ${tl.length === 0 ? '<div style="font-size:12px; color:var(--text2);">Belum ada update</div>' : tl.map(t => {
          let icon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
          if (t.jenis === 'status_update') icon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          else if (t.jenis === 'tanggapan') icon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

          return `
            <div class="timeline-item">
              <div class="timeline-dot">${icon}</div>
              <div class="timeline-content">
                ${t.status_baru ? `<span class="status-badge status-badge--${t.status_baru}" style="margin-bottom:8px;">${t.status_baru.toUpperCase()}</span>` : ''}
                <div class="timeline-msg">${t.pesan.replace(/\\n/g, '<br>')}</div>
                <div class="timeline-meta">
                  <span>${t.admin_nama ? 'Petugas: ' + t.admin_nama : ''}</span>
                  <span>${t.created_at}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('kd-content').innerHTML = detailHTML + timelineHTML;

  } catch (err) {
    document.getElementById('kd-content').innerHTML = `
      <div class="empty-state error-state">
        <div class="empty-icon" style="color:var(--text3)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        <div class="empty-text">${err.message}</div>
        <button class="btn-retry" onclick="Router.navigate('keluhan-detail', {id:${id}}, false)">Coba Lagi</button>
      </div>
    `;
  }
}
