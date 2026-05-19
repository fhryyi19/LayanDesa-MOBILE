/**
 * app.js — Entry point SPA LayanDesa Mobile
 *
 * Catatan penting:
 * config.js melakukan async host-probe saat berjalan di native (Android).
 * app.js HARUS menunggu event 'appconfigready' sebelum memanggil API,
 * agar API_BASE sudah menunjuk ke host yang benar (10.0.2.2 atau 192.168.1.4).
 */

// Register semua routes
Router.register('home',         renderHome);
Router.register('berita',       renderBerita);
Router.register('berita-detail',renderBeritaDetail);
Router.register('pengumuman',   renderPengumuman);
Router.register('layanan',      renderLayanan);
Router.register('profil',       renderProfil);
Router.register('kontak',       renderKontak);
Router.register('login',        renderLogin);
Router.register('register',     renderRegister);
Router.register('keluhan',      renderKeluhan);
Router.register('keluhan-detail',renderKeluhanDetail);

// Global App State
window.APP_STATE = { user: null };
/* ─── Boot app ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Router.init();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Mulai navigasi awal setelah config siap
  startApp();
});

function startApp() {
  const initialHash  = window.location.hash.slice(1) || 'home';
  const validPages   = ['home', 'berita', 'pengumuman', 'layanan', 'profil', 'kontak'];
  const startPage    = validPages.includes(initialHash) ? initialHash : 'home';

  // Jika config sudah ready (mode browser), langsung mulai
  if (window.APP_CONFIG && window.APP_CONFIG._ready) {
    Router.navigate(startPage, {}, false);
    return;
  }

  // Native: tunggu probe selesai (maks ~3 detik), baru navigasi
  let started = false;

  async function doStart() {
    if (started) return;
    started = true;
    try {
      // Periksa sesi login saat aplikasi dimuat
      const auth = await API.checkAuth();
      window.APP_STATE.user = auth.user;
    } catch (e) {
      window.APP_STATE.user = null;
    }
    Router.navigate(startPage, {}, false);
  }

  window.addEventListener('appconfigready', doStart, { once: true });

  // Safeguard: kalau probe terlalu lama (>3 dtk), tetap mulai dengan host fallback
  setTimeout(function () {
    if (!started) {
      console.warn('[LayanDesa] Config probe timeout — mulai dengan host fallback.');
      // pastikan API_BASE terset ke sesuatu
      if (window.APP_CONFIG && !window.APP_CONFIG._ready) {
        window.APP_CONFIG._ready = true;
      }
      doStart();
    }
  }, 3000);
}
