/**
 * pages/profil.js — Halaman Profil Desa
 */

function renderProfil(view) {
  view.innerHTML = `
    <div class="page-inner">
      <div class="inner-header">
        <h1 class="inner-title">Profil Desa</h1>
        <p class="inner-subtitle">Desa Sukamaju, Kec. Cikaret, Kab. Sukabumi</p>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button class="tab-btn active" onclick="switchTab('sejarah', this)">Sejarah</button>
        <button class="tab-btn" onclick="switchTab('visimisi', this)">Visi &amp; Misi</button>
        <button class="tab-btn" onclick="switchTab('data', this)">Data Desa</button>
        <button class="tab-btn" onclick="switchTab('struktur', this)">Struktur</button>
      </div>

      <!-- Tab: Sejarah -->
      <div id="tab-sejarah" class="tab-content active">
        <div class="prose-card">
          <p>Desa Sukamaju adalah desa yang terletak di Kecamatan Cikaret, Kabupaten Sukabumi, Provinsi Jawa Barat. Desa ini berdiri sejak tahun <strong>1945</strong> dan merupakan salah satu desa tertua di kecamatan.</p>
          <p>Dengan luas wilayah sekitar <strong>1.250 hektar</strong>, Desa Sukamaju terdiri dari 3 dusun, 6 RW, dan 24 RT. Mayoritas penduduk bermata pencaharian sebagai petani, pedagang, dan pegawai swasta.</p>
          <p>Desa Sukamaju berkomitmen untuk terus berkembang dan memberikan pelayanan terbaik bagi masyarakatnya melalui program pembangunan yang inovatif dan partisipatif.</p>
        </div>
      </div>

      <!-- Tab: Visi & Misi -->
      <div id="tab-visimisi" class="tab-content">
        <div class="visi-card">
          <div class="visi-label">VISI</div>
          <blockquote class="visi-text">
            "Terwujudnya Desa Sukamaju yang Maju, Mandiri, Sejahtera, dan Berbudaya Berbasis Pertanian dan Pariwisata yang Berkelanjutan."
          </blockquote>
        </div>
        <div class="prose-card">
          <div class="misi-label">MISI</div>
          <ol class="misi-list">
            <li>Meningkatkan kualitas pelayanan publik yang prima dan berorientasi pada kepuasan masyarakat.</li>
            <li>Mengembangkan infrastruktur desa yang memadai dan merata di seluruh wilayah.</li>
            <li>Memberdayakan ekonomi masyarakat melalui UMKM dan pertanian modern.</li>
            <li>Meningkatkan kualitas pendidikan dan kesehatan masyarakat desa.</li>
            <li>Melestarikan budaya dan tradisi lokal sebagai identitas desa.</li>
            <li>Mewujudkan tata kelola pemerintahan desa yang transparan dan akuntabel.</li>
          </ol>
        </div>
      </div>

      <!-- Tab: Data Desa -->
      <div id="tab-data" class="tab-content">
        <div class="data-table-card">
          ${[
            ['Nama Desa', 'Sukamaju'],
            ['Kecamatan', 'Cikaret'],
            ['Kabupaten', 'Sukabumi'],
            ['Provinsi', 'Jawa Barat'],
            ['Kode Pos', '43155'],
            ['Luas Wilayah', '1.250 Ha'],
            ['Jumlah Dusun', '3 Dusun'],
            ['Jumlah RW', '6 RW'],
            ['Jumlah RT', '24 RT'],
            ['Jumlah Penduduk', '3.247 Jiwa'],
            ['Jumlah KK', '847 KK'],
            ['Kepala Desa', 'H. Asep Supriatna, S.Pd.'],
          ].map(([k, v]) => `
            <div class="data-row">
              <span class="data-key">${k}</span>
              <span class="data-val">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tab: Struktur -->
      <div id="tab-struktur" class="tab-content">
        <div class="struktur-wrap">
          ${[
            { id: 'kepala-desa', nama: 'H. Asep Supriatna, S.Pd.', jabatan: 'Kepala Desa', level: 'top' },
            { id: 'sekretaris', nama: 'Ibu Sari Dewi, S.Kom.', jabatan: 'Sekretaris Desa', level: 'mid' },
            { id: 'kaur-pemerintahan', nama: 'Bpk. Andi Saputra', jabatan: 'Kaur Pemerintahan', level: 'bot' },
            { id: 'kaur-keuangan', nama: 'Ibu Rini Lestari', jabatan: 'Kaur Keuangan', level: 'bot' },
            { id: 'kaur-umum', nama: 'Bpk. Dedi Kurniawan', jabatan: 'Kaur Umum &amp; TU', level: 'bot' },
            { id: 'kaur-pembangunan', nama: 'Bpk. Hendra Wijaya', jabatan: 'Kaur Pembangunan', level: 'bot' },
          ].map(p => `
            <div class="org-item org-${p.level}">
              <div class="org-avatar" style="width:48px; height:48px; border-radius:50%; overflow:hidden; border:2px solid var(--border); flex-shrink:0;">
                <img src="${window.APP_CONFIG.API_BASE.replace('/api', '')}/assets/img/perangkat/${p.id}.png" alt="${p.nama}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<svg width=24 height=24 viewBox=\\'0 0 24 24\\' fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round style=\\'margin:12px;\\'><circle cx=12 cy=8 r=4 /><path d=\\'M4 20c0-4 3.6-7 8-7s8 3 8 7\\' /></svg>';">
              </div>
              <div>
                <div class="org-name">${p.nama}</div>
                <div class="org-pos">${p.jabatan}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="height:24px;"></div>
    </div>
  `;
}

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
  btn.classList.add('active');
}
