/**
 * pages/layanan.js — Halaman Layanan Administrasi
 */

const LAYANAN_DATA = [
  {
    nama: 'Surat Keterangan Tidak Mampu (SKTM)',
    desc: 'Surat keterangan bahwa seseorang tergolong kurang mampu secara ekonomi.',
    waktu: '1 hari kerja', biaya: 'Gratis',
    syarat: ['Fotokopi KTP pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar dari RT/RW', 'Pas foto 3x4 (2 lembar)'],
  },
  {
    nama: 'Surat Keterangan Domisili',
    desc: 'Surat keterangan berdomisili di wilayah Desa Sukamaju.',
    waktu: '1 hari kerja', biaya: 'Gratis',
    syarat: ['Fotokopi KTP pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar dari RT/RW', 'Surat pindah (jika baru pindah)'],
  },
  {
    nama: 'Pengurusan Kartu Keluarga (KK)',
    desc: 'Pembuatan atau pembaruan Kartu Keluarga untuk warga desa.',
    waktu: '3–7 hari kerja', biaya: 'Gratis',
    syarat: ['KTP asli kepala keluarga', 'Akta nikah / akta cerai', 'Akta kelahiran (penambahan anggota)', 'Surat pengantar dari RT/RW'],
  },
  {
    nama: 'Surat Keterangan Usaha',
    desc: 'Surat bahwa seseorang menjalankan usaha di wilayah desa.',
    waktu: '1–2 hari kerja', biaya: 'Gratis',
    syarat: ['Fotokopi KTP pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar dari RT/RW', 'Foto lokasi usaha'],
  },
  {
    nama: 'Izin Mendirikan Bangunan (IMB)',
    desc: 'Izin wajib sebelum mendirikan atau merenovasi bangunan.',
    waktu: '7–14 hari kerja', biaya: 'Gratis (desa)',
    syarat: ['Fotokopi KTP', 'Sertifikat tanah', 'Gambar/denah bangunan', 'Surat pernyataan tidak sengketa', 'Pengantar RT/RW'],
  },
  {
    nama: 'Surat Keterangan Lahir',
    desc: 'Surat kelahiran dari desa sebagai dasar pengurusan akta kelahiran.',
    waktu: '1 hari kerja', biaya: 'Gratis',
    syarat: ['Surat keterangan lahir dari bidan/RS', 'Fotokopi KTP kedua orang tua', 'Fotokopi KK', 'Akta nikah orang tua', 'Pengantar RT/RW'],
  },
  {
    nama: 'Surat Keterangan Ahli Waris',
    desc: 'Surat yang menerangkan siapa ahli waris yang berhak.',
    waktu: '2–3 hari kerja', biaya: 'Gratis',
    syarat: ['Surat kematian', 'Fotokopi KTP para ahli waris', 'Fotokopi KK', 'Pengantar RT/RW', 'Akta nikah almarhum/almarhumah'],
  },
  {
    nama: 'Surat Pengantar SKCK',
    desc: 'Surat pengantar dari desa sebagai syarat pembuatan SKCK.',
    waktu: '1 hari kerja', biaya: 'Gratis',
    syarat: ['Fotokopi KTP pemohon', 'Fotokopi Kartu Keluarga (KK)', 'Surat pengantar dari RT/RW', 'Pas foto 4x6 (4 lembar)'],
  },
];

function renderLayanan(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="inner-header">
        <h1 class="inner-title">Layanan Desa</h1>
        <p class="inner-subtitle">Layanan administrasi kependudukan Desa Sukamaju</p>
      </div>

      <div class="info-banner">
        <span class="info-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        <span><strong>Jam Pelayanan:</strong> Senin–Jumat, 08.00–16.00 WIB. Datang ke Kantor Desa dengan membawa berkas yang diperlukan.</span>
      </div>

      <div class="list-container">
        ${LAYANAN_DATA.map((l, i) => `
          <div class="layanan-card" id="layanan-${i}">
            <div class="layanan-card-head" onclick="toggleLayanan(${i})">
              <div class="layanan-info">
                <div class="layanan-nama">${l.nama}</div>
                <div class="layanan-badges">
                  <span class="badge-chip">${l.waktu}</span>
                  <span class="badge-chip">${l.biaya}</span>
                </div>
              </div>
              <div class="layanan-chevron" id="chevron-${i}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div class="layanan-detail hidden" id="layanan-detail-${i}">
              <p class="layanan-desc">${l.desc}</p>
              <div class="syarat-label">Persyaratan:</div>
              <ul class="syarat-list">
                ${l.syarat.map(s => `<li>${s}</li>`).join('')}
              </ul>
              <button class="btn-kontak-layanan" onclick="Router.navigate('kontak')">
                Hubungi Kami
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="height:24px;"></div>
    </div>
  `;
}

function toggleLayanan(i) {
  const detail  = document.getElementById(`layanan-detail-${i}`);
  const chevron = document.getElementById(`chevron-${i}`);
  const isHidden = detail.classList.toggle('hidden');
  chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(90deg)';
  chevron.style.transition = 'transform 0.25s ease';
}
