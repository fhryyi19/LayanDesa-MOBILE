/**
 * pages/keluhan.js — Halaman Daftar Keluhan Saya
 */

async function renderKeluhan(view, params = {}) {
  const statusFilter = params.status || '';
  
  view.innerHTML = `
    <div class="page-inner">
      <div class="detail-header">
        <button class="back-btn" onclick="Router.navigate('kontak')" aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 class="detail-title">Keluhan Saya</h1>
      </div>
      
      <div id="keluhan-content" style="padding:16px;">
        <div class="skeleton-wrap">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await API.getKeluhan(statusFilter);
    const { list, stats } = res;

    const content = document.getElementById('keluhan-content');
    
    // Stats HTML
    const statsHTML = `
      <div style="display:flex; gap:10px; overflow-x:auto; margin-bottom:16px; padding-bottom:8px;">
        <div style="min-width:70px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; text-align:center;">
          <div style="font-size:16px; font-weight:800;">${stats.total}</div>
          <div style="font-size:10px; color:var(--text2);">Total</div>
        </div>
        <div style="min-width:70px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; text-align:center;">
          <div style="font-size:16px; font-weight:800; color:#F59E0B;">${stats.menunggu}</div>
          <div style="font-size:10px; color:var(--text2);">Menunggu</div>
        </div>
        <div style="min-width:70px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; text-align:center;">
          <div style="font-size:16px; font-weight:800; color:#8B5CF6;">${stats.diproses}</div>
          <div style="font-size:10px; color:var(--text2);">Diproses</div>
        </div>
        <div style="min-width:70px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; text-align:center;">
          <div style="font-size:16px; font-weight:800; color:#22C55E;">${stats.selesai}</div>
          <div style="font-size:10px; color:var(--text2);">Selesai</div>
        </div>
      </div>
    `;

    // Filter Tabs HTML
    const tabs = [
      { v: '', l: 'Semua' },
      { v: 'menunggu', l: 'Menunggu' },
      { v: 'diterima', l: 'Diterima' },
      { v: 'diproses', l: 'Diproses' },
      { v: 'selesai', l: 'Selesai' },
      { v: 'ditolak', l: 'Ditolak' }
    ];
    
    const tabsHTML = `
      <div style="display:flex; gap:8px; overflow-x:auto; margin-bottom:16px; padding-bottom:4px; scrollbar-width:none;">
        ${tabs.map(t => `
          <button onclick="Router.navigate('keluhan', {status: '${t.v}'}, false)" style="padding:6px 12px; background:${statusFilter===t.v ? 'var(--green)' : 'var(--card)'}; color:${statusFilter===t.v ? '#fff' : 'var(--text2)'}; border:1px solid ${statusFilter===t.v ? 'var(--green)' : 'var(--border)'}; border-radius:99px; font-size:12px; font-weight:600; white-space:nowrap;">
            ${t.l}
          </button>
        `).join('')}
      </div>
    `;

    // List HTML
    let listHTML = '';
    if (list.length === 0) {
      listHTML = `
        <div class="empty-state">
          <div class="empty-icon" style="color:var(--text3);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></div>
          <div class="empty-text">${statusFilter ? 'Tidak ada keluhan dengan status ini.' : 'Anda belum pernah mengirim keluhan.'}</div>
          ${!statusFilter ? `<button class="btn-retry" onclick="Router.navigate('kontak')">Kirim Keluhan Pertama</button>` : ''}
        </div>
      `;
    } else {
      listHTML = list.map(k => `
        <a href="#keluhan-detail" onclick="Router.navigate('keluhan-detail', {id: ${k.id}}); return false;" class="keluhan-list-item">
          <div class="keluhan-list-header">
            <span class="keluhan-kode">${k.kode_tiket}</span>
            <span class="keluhan-date">${k.kategori}</span>
          </div>
          <div class="keluhan-title">${k.judul}</div>
          <div class="keluhan-footer">
            <span class="status-badge status-badge--${k.status}">${k.status.toUpperCase()}</span>
            <span class="keluhan-date">${k.created_at.split(' ')[0]}</span>
          </div>
        </a>
      `).join('');
    }

    content.innerHTML = statsHTML + tabsHTML + listHTML;

  } catch (err) {
    document.getElementById('keluhan-content').innerHTML = `
      <div class="empty-state error-state">
        <div class="empty-icon" style="color:var(--text3)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        <div class="empty-text">${err.message}</div>
        <button class="btn-retry" onclick="Router.navigate('keluhan', {status:'${statusFilter}'}, false)">Coba Lagi</button>
      </div>
    `;
  }
}
