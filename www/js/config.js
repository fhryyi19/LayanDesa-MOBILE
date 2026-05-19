/**
 * config.js — Konfigurasi API URL dengan Auto-Probe Host
 *
 * Masalah: Emulator baru (Pixel 6 API 37+, Google Play image) tidak bisa
 * dideteksi lewat user-agent karena UA-nya mirip device fisik.
 *
 * Solusi: Auto-probe — coba 10.0.2.2 (emulator) dulu, lalu 192.168.1.4
 * (device fisik/LAN). Host pertama yang merespons akan dipakai.
 *
 *  Emulator Android  → 10.0.2.2     (alias ke PC host dari dalam emulator)
 *  Device fisik LAN  → 192.168.1.4  (IP LAN PC — hasil ipconfig)
 *  Browser / web dev → localhost
 */

(function () {
  const PORT     = '';                          // kosong = port 80 (Laragon default)
  const API_PATH = '/Reputasi/layandesa/api';   // path sesuai struktur Laragon www

  /* ─── 1. Deteksi apakah berjalan di Capacitor native ─────────────────── */
  function detectNative() {
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function') {
      return window.Capacitor.isNativePlatform();
    }
    if (window.location.protocol === 'capacitor:' || window.location.protocol === 'file:') {
      return true;
    }
    if (/wv\)/.test(navigator.userAgent) || /Android.*Version\/\d/.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }

  const isNative = detectNative();

  /* ─── 2. Set APP_CONFIG awal (sinkron) ───────────────────────────────── */
  window.APP_CONFIG = {
    API_BASE   : `http://localhost${PORT}${API_PATH}`,
    APP_NAME   : 'LayanDesa',
    DESA_NAME  : 'Desa Sukamaju',
    VERSION    : '1.0.0',
    IS_NATIVE  : isNative,
    IS_EMULATOR: false,
    _ready     : !isNative, // browser langsung ready; native tunggu probe
  };

  /* ─── 3. Browser biasa: tidak perlu probe ────────────────────────────── */
  if (!isNative) {
    console.log('[LayanDesa] mode: browser | API:', window.APP_CONFIG.API_BASE);
    return;
  }

  /* ─── 4. Native: probe otomatis (emulator → LAN) ────────────────────── */
  // Urutan: 10.0.2.2 dicoba dulu (emulator). Jika gagal (timeout 1.5 dtk),
  // beralih ke 192.168.1.4 (device fisik). mode:'no-cors' memastikan
  // browser tidak memblokir karena CORS saat probe.
  const HOST_CANDIDATES = [
    { host: '10.0.2.2',    label: 'emulator' },
    { host: '192.168.1.4', label: 'lan-device' },
  ];

  async function probeHosts() {
    for (const { host, label } of HOST_CANDIDATES) {
      try {
        const ctrl  = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1500); // 1.5 dtk timeout
        await fetch(`http://${host}${PORT}${API_PATH}/stats.php`, {
          method : 'HEAD',
          signal : ctrl.signal,
          cache  : 'no-store',
          mode   : 'no-cors',   // opaque response — kita hanya cek konektivitas
        });
        clearTimeout(timer);
        console.log(`[LayanDesa] host terjangkau: ${host} (${label})`);
        return { host, label };
      } catch (_) {
        console.log(`[LayanDesa] host tidak terjangkau: ${host} (${label}), mencoba berikutnya...`);
      }
    }
    // Fallback terakhir — kembalikan LAN
    console.warn('[LayanDesa] semua host gagal, fallback ke 192.168.1.4');
    return { host: '192.168.1.4', label: 'lan-fallback' };
  }

  probeHosts().then(function ({ host, label }) {
    window.APP_CONFIG.API_BASE    = `http://${host}${PORT}${API_PATH}`;
    window.APP_CONFIG.IS_EMULATOR = (label === 'emulator');
    window.APP_CONFIG._ready      = true;

    console.log(
      '[LayanDesa Config]',
      '| isNative=true',
      '| host='       + host,
      '| label='      + label,
      '| API='        + window.APP_CONFIG.API_BASE
    );

    // Beri sinyal ke app.js bahwa config sudah siap
    window.dispatchEvent(new CustomEvent('appconfigready', { detail: window.APP_CONFIG }));
  });
})();
