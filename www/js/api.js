/**
 * api.js — Semua pemanggilan ke backend PHP
 */

const API = (() => {
  async function request(endpoint, options = {}) {
    const url = `${window.APP_CONFIG.API_BASE}${endpoint}`;
    let res;

    const customHeaders = { 'Content-Type': 'application/json', ...options.headers };
    const token = localStorage.getItem('ld_token');
    if (token) {
      customHeaders['X-Session-Id'] = token;
    }

    try {
      res = await fetch(url, {
        headers: customHeaders,
        credentials: 'include',
        ...options,
      });
    } catch (networkErr) {
      // Fetch gagal total (no network, DNS failure, refused connection)
      throw new Error(
        'Tidak dapat terhubung ke server. ' +
        'Pastikan Laragon berjalan dan IP/host sudah benar.\n' +
        '(API: ' + url + ')'
      );
    }

    // Coba parse JSON; jika respons bukan JSON (mis. PHP fatal error), tangkap gracefully
    let json;
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      try {
        json = await res.json();
      } catch {
        throw new Error('Server mengembalikan respons tidak valid (bukan JSON). HTTP ' + res.status);
      }
    } else {
      // Server mengembalikan HTML/teks — biasanya PHP error/fatal
      const text = await res.text();
      throw new Error(
        'Server error (HTTP ' + res.status + '). ' +
        'Cek log Laragon untuk detail.\nPreview: ' + text.slice(0, 120)
      );
    }

    // Tangani error dari backend
    if (json.status !== 'ok') {
      // Validasi 422: array errors
      if (Array.isArray(json.errors) && json.errors.length) {
        throw new Error(json.errors.join('\n'));
      }
      throw new Error(json.message || 'Terjadi kesalahan pada server.');
    }

    return json.data;
  }

  return {
    getStats        : ()           => request('/stats.php'),
    getBerita       : (limit = 20) => request(`/berita.php?limit=${limit}`),
    getBeritaDetail : (id)         => request(`/berita-detail.php?id=${id}`),
    getPengumuman   : ()           => request('/pengumuman.php'),
    sendKontak      : (data)       => request('/kontak.php', {
      method : 'POST',
      body   : JSON.stringify(data),
    }),
    
    // Auth & Keluhan
    checkAuth       : ()           => request('/auth.php?action=me'),
    login           : (data)       => request('/auth.php?action=login', { method: 'POST', body: JSON.stringify(data) }),
    register        : (data)       => request('/auth.php?action=register', { method: 'POST', body: JSON.stringify(data) }),
    logout          : ()           => {
      localStorage.removeItem('ld_token');
      return request('/auth.php?action=logout');
    },
    
    getKeluhan      : (status='')  => request(`/keluhan.php?action=list&status=${status}`),
    getKeluhanDetail: (id)         => request(`/keluhan.php?action=detail&id=${id}`),
    submitKeluhan   : (data)       => request('/keluhan.php?action=submit', { method: 'POST', body: JSON.stringify(data) })
  };
})();
