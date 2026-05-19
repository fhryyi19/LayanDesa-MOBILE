/**
 * pages/berita.js — Halaman Daftar Berita & Detail (v2)
 * Supports image thumbnails from API, skeleton loading, and smooth detail view.
 */

function _beritaImgHtml(foto, judul) {
  if (!foto) {
    return `<div class="bc-img-placeholder" style="color:var(--text3);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg></div>`;
  }
  // Support absolute URLs or relative paths served from the backend
  const url = foto.startsWith('http')
    ? foto
    : `${window.APP_CONFIG.API_BASE.replace('/api', '')}/uploads/berita/${foto}`;
  return `<div class="bc-img-wrap"><img src="${url}" alt="${judul}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><path d=\\'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2\\'/><path d=\\'M18 14h-8M15 18h-5M10 6h8v4h-8z\\'/></svg></div>'"></div>`;
}

async function renderBerita(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="inner-header">
        <h1 class="inner-title">Berita Desa</h1>
        <p class="inner-subtitle">Perkembangan terkini Desa Sukamaju</p>
      </div>
      <div class="list-container" id="berita-list">${UI.skeleton(4)}</div>
      <div style="height:24px;"></div>
    </div>`;

  try {
    const berita = await API.getBerita(20);
    const el = document.getElementById('berita-list');
    if (!el) return;

    if (!berita.length) {
      el.innerHTML = UI.empty(`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>`, 'Belum ada berita yang dipublikasikan.');
      return;
    }

    el.innerHTML = berita.map(b => `
      <article class="bc-card" onclick="Router.navigate('berita-detail', {id: ${b.id}})" role="button" tabindex="0">
        ${_beritaImgHtml(b.foto, b.judul)}
        <div class="bc-body">
          <div class="bc-meta">
            <span class="bc-badge">Berita</span>
            <span class="bc-date">${b.tanggal_f}</span>
          </div>
          <h3 class="bc-title">${b.judul}</h3>
          <p class="bc-excerpt">${b.kutipan}</p>
          <div class="bc-footer">
            <span class="bc-read-more">Baca selengkapnya <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px;"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>
      </article>
    `).join('');
  } catch (e) {
    const el = document.getElementById('berita-list');
    if (el) el.innerHTML = UI.error(e.message);
  }
}

async function renderBeritaDetail(view, { id }) {
  view.innerHTML = `
    <div class="page-inner">
      ${UI.backHeader('Detail Berita')}
      <div id="detail-content" class="detail-content">${UI.skeleton(6)}</div>
    </div>`;

  try {
    const b = await API.getBeritaDetail(id);
    const el = document.getElementById('detail-content');
    if (!el) return;

    const imgHtml = b.foto
      ? `<div class="detail-img-wrap">${_beritaImgHtml(b.foto, b.judul)}</div>`
      : `<div class="detail-hero-icon" style="color:var(--text3); display:flex; justify-content:center; padding: 24px 0;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg></div>`;

    el.innerHTML = `
      ${imgHtml}
      <div class="detail-meta">
        <span class="bc-badge" style="font-size:11px;">Berita</span>
        <span style="font-size:12px; color:var(--text2);">${b.tanggal_f}</span>
      </div>
      <h1 class="detail-h1">${b.judul}</h1>
      <div class="detail-divider"></div>
      <div class="detail-body">${b.isi.replace(/\n/g, '<br>')}</div>
      <div style="height:32px;"></div>
    `;
  } catch (e) {
    const el = document.getElementById('detail-content');
    if (el) el.innerHTML = UI.error(e.message);
  }
}
