/**
 * pages/home.js — Halaman Beranda
 */

async function renderHome(view) {
  view.innerHTML = `
    <div class="page-home">
      <!-- Hero -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-badge">Desa Digital Aktif 2025</div>
          <h1 class="hero-title">LayanDesa<br><span>Sukamaju</span></h1>
          <p class="hero-subtitle">Portal resmi pelayanan publik Desa Sukamaju, Sukabumi, Jawa Barat.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row" id="home-stats">
        ${Array(4).fill('<div class="stat-chip skeleton-chip"></div>').join('')}
      </div>

      <!-- Quick Actions -->
      <div class="section-pad">
        <div class="quick-grid">
          <button class="quick-btn" onclick="Router.navigate('berita')">
            <span class="quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>
            </span>
            <span>Berita</span>
          </button>
          <button class="quick-btn" onclick="Router.navigate('pengumuman')">
            <span class="quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </span>
            <span>Pengumuman</span>
          </button>
          <button class="quick-btn" onclick="Router.navigate('layanan')">
            <span class="quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </span>
            <span>Layanan</span>
          </button>
          <button class="quick-btn" onclick="Router.navigate('profil')">
            <span class="quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>
            </span>
            <span>Profil Desa</span>
          </button>
        </div>
      </div>

      <!-- Berita Terbaru -->
      <div class="section-pad">
        <div class="section-header-row">
          <h2 class="section-label">Berita Terbaru</h2>
          <button class="see-all-btn" onclick="Router.navigate('berita')">Lihat Semua</button>
        </div>
        <div id="home-berita">${UI.skeleton(2)}</div>
      </div>

      <!-- Pengumuman Terbaru -->
      <div class="section-pad">
        <div class="section-header-row">
          <h2 class="section-label">Pengumuman</h2>
          <button class="see-all-btn" onclick="Router.navigate('pengumuman')">Lihat Semua</button>
        </div>
        <div id="home-pengumuman">${UI.skeleton(2)}</div>
      </div>

      <!-- Info Kontak -->
      <div class="section-pad">
        <div class="contact-card-home">
          <div class="contact-card-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.23a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
          </div>
          <div class="contact-card-info">
            <div class="contact-card-title">Hubungi Kantor Desa</div>
            <div class="contact-card-sub">Senin–Jumat, 08.00–16.00 WIB</div>
            <div class="contact-card-sub">(0266) 123-456</div>
          </div>
          <button class="contact-cta" onclick="Router.navigate('kontak')">Pesan</button>
        </div>
      </div>

      <div style="height: 24px;"></div>
    </div>
  `;

  // Load stats
  try {
    const stats = await API.getStats();
    document.getElementById('home-stats').innerHTML = `
      <div class="stat-chip"><span class="sc-num">${UI.formatNumber(stats.penduduk)}</span><span class="sc-lbl">Penduduk</span></div>
      <div class="stat-chip"><span class="sc-num">${stats.kk}</span><span class="sc-lbl">KK</span></div>
      <div class="stat-chip"><span class="sc-num">${stats.rt}</span><span class="sc-lbl">RT</span></div>
      <div class="stat-chip"><span class="sc-num">${stats.berita}+</span><span class="sc-lbl">Berita</span></div>
    `;
  } catch (e) {
    document.getElementById('home-stats').innerHTML = '';
  }

  // Load berita
  try {
    const berita = await API.getBerita(3);
    const el = document.getElementById('home-berita');
    if (!el) return;
    if (!berita.length) {
      el.innerHTML = UI.empty('', 'Belum ada berita.');
    } else {
      el.innerHTML = berita.map(b => {
        const url = b.foto ? (b.foto.startsWith('http') ? b.foto : `${window.APP_CONFIG.API_BASE.replace('/api', '')}/uploads/berita/${b.foto}`) : null;
        const imgHtml = url ? `<div style="height:120px; border-radius:var(--radius-sm); overflow:hidden; margin-bottom:12px;"><img src="${url}" alt="${b.judul}" style="width:100%; height:100%; object-fit:cover;"></div>` : ``;
        
        return `
        <div class="news-card" onclick="Router.navigate('berita-detail', {id: ${b.id}})">
          ${imgHtml}
          <div class="news-card-header">
            <span class="news-date">${b.tanggal_f}</span>
          </div>
          <h3 class="news-title">${b.judul}</h3>
          <p class="news-excerpt">${b.kutipan}</p>
        </div>
        `;
      }).join('');
    }
  } catch (e) {
    const el = document.getElementById('home-berita');
    if (el) el.innerHTML = UI.error(e.message);
  }

  // Load pengumuman
  try {
    const pgm = await API.getPengumuman();
    const el = document.getElementById('home-pengumuman');
    if (!el) return;
    if (!pgm.length) {
      el.innerHTML = UI.empty('', 'Belum ada pengumuman.');
    } else {
      el.innerHTML = pgm.slice(0, 3).map(p => `
        <div class="ann-card" onclick="Router.navigate('pengumuman')">
          <div class="ann-card-dot"></div>
          <div class="ann-card-body">
            <div class="ann-card-date">${p.tanggal_f}</div>
            <div class="ann-card-title">${p.judul}</div>
            <div class="ann-card-excerpt">${p.kutipan}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    const el = document.getElementById('home-pengumuman');
    if (el) el.innerHTML = UI.error(e.message);
  }
}
