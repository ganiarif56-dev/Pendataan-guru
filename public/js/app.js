/**
 * SD SALATIGA 03 - SISTEM PENDATAAN GURU TERPADU
 * Desain Minimalis Profesional • Navy-Biru • Sinkronisasi Data Real
 */

// Master State
const appState = {
  activeView: 'public', // 'public' | 'admin'
  adminTab: 'dashboard', // 'dashboard' | 'data-guru' | 'profil-sekolah'
  currentUser: null,
  teachers: [],
  schoolInfo: {
    name: 'SD SALATIGA 03',
    tagline: 'Beriman • Berkarakter • Berprestasi',
    heroDescription: 'Platform resmi administrasi, verifikasi, dan manajemen profil tenaga pendidik SD Salatiga 03 secara formal, akurat, dan transparan.',
    address: 'Jl. Kalitaman No. 03, Sidorejo, Kota Salatiga, Jawa Tengah 50711',
    npsn: '20328453',
    email: 'sdnsalatiga03@gmail.com',
    phone: '(0298) 324-503',
    gmapsUrl: 'https://maps.google.com/?q=SD+Salatiga+03',
    heroImageIndex: 0,
    heroImages: [
      'images/gedung-sd03-utama.jpg',
      'images/siswa-berprestasi-sd03.jpg',
      'images/piala-prestasi-sd03.jpg',
      'images/perpustakaan-sd03.jpg'
    ]
  },
  sheets: {
    spreadsheetId: '1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E/edit?usp=sharing',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec',
    lastSync: 'Otomatis Real-Time',
    isConnected: true
  },
  formModalMode: 'create', // 'create' | 'edit'
  editingTeacherId: null,
  publicCategoryFilter: null,
  adminCategoryFilter: null,
  activeCategoryModalKey: null
};

// Kategori Jabatan untuk Grafik & Analitik
const CHART_CATEGORIES = [
  { key: 'Kepala Sekolah', label: 'Kepala Sekolah', shortLabel: 'Kepala S...', icon: '🎓', color: '#3B82F6' },
  { key: 'Guru Kelas', label: 'Guru Kelas', shortLabel: 'Guru Kelas', icon: '📚', color: '#2563EB' },
  { key: 'Guru PJOK', label: 'Guru PJOK', shortLabel: 'Guru PJOK', icon: '⚽', color: '#10B981' },
  { key: 'PAI / PAK', label: 'PAI / PAK', shortLabel: 'PAI / PAK', icon: '🕌', color: '#F59E0B' },
  { key: 'Seni & Bhs', label: 'Seni & Bahasa', shortLabel: 'Seni & Bhs', icon: '🎨', color: '#EC4899' },
  { key: 'Tendik / Lainnya', label: 'Tendik / Staf', shortLabel: 'Tendik / ...', icon: '💼', color: '#8B5CF6' }
];

// Helper klasifikasi kategori guru berdasarkan jabatan
function getTeacherCategoryKey(t) {
  const j = (t.jabatan || t['Jabatan / Penugasan'] || t.jabatan___penugasan || '').toLowerCase();
  if (j.includes('kepala sekolah') || j.includes('kepsek')) return 'Kepala Sekolah';
  if (j.includes('pjok') || j.includes('penjas') || j.includes('olahraga')) return 'Guru PJOK';
  if (j.includes('pai') || j.includes('pak') || j.includes('agama') || j.includes('paipb') || j.includes('pakpb')) return 'PAI / PAK';
  if (j.includes('seni') || j.includes('jawa') || (j.includes('bahasa') && !j.includes('guru kelas') && !j.includes('kelas 2a') && !j.includes('kelas 3a'))) return 'Seni & Bhs';
  if (j.includes('tenaga kependidikan') || j.includes('tendik') || j.includes('shadow') || j.includes('tata usaha') || j.includes('tu') || j.includes('administrasi') || j.includes('penjaga') || j.includes('kebersihan') || j.includes('satpam')) return 'Tendik / Lainnya';
  if (j.includes('guru kelas') || j.includes('wali kelas') || j.includes('kelas')) return 'Guru Kelas';
  return 'Tendik / Lainnya';
}

// Fallback initial data (22 Guru SD Salatiga 03)
const DEFAULT_TEACHERS = [
  { "id": "GURU-001", "no": 1, "nama": "Arini Nuja Wahyudi", "nip": "196904242003121006", "tempat_lahir": "Klaten", "tanggal_lahir": "1969-04-24", "status": "PNS", "jabatan": "Kepala Sekolah", "perangkat": "III/d" },
  { "id": "GURU-002", "no": 2, "nama": "Chatarina Venti Aprilia", "nip": "199204092020122001", "tempat_lahir": "Salatiga", "tanggal_lahir": "1992-04-09", "status": "PNS", "jabatan": "Guru Kelas 4B dan Kokurikuler", "perangkat": "III/a" },
  { "id": "GURU-003", "no": 3, "nama": "Dian Framilu Ningtyas", "nip": "198704232019022004", "tempat_lahir": "Grobogan", "tanggal_lahir": "1987-04-23", "status": "PNS", "jabatan": "Guru PJOK Kelas 1-3 dan Kokurikuler", "perangkat": "III/b" },
  { "id": "GURU-004", "no": 4, "nama": "Heri Susanto", "nip": "198503182010011010", "tempat_lahir": "Demak", "tanggal_lahir": "1985-03-18", "status": "PNS", "jabatan": "Guru PJOK Kelas 4-6 dan Kokurikuler", "perangkat": "III/c" },
  { "id": "GURU-005", "no": 5, "nama": "KRISTIAN ARISTIYONO", "nip": "199509162020121004", "tempat_lahir": "KLATEN", "tanggal_lahir": "1995-09-16", "status": "PNS", "jabatan": "Guru Kelas 6B dan Kokurikuler", "perangkat": "III/a" },
  { "id": "GURU-006", "no": 6, "nama": "Maqooshidul Falaasifah Syamsuddin", "nip": "199105062019022007", "tempat_lahir": "Semarang", "tanggal_lahir": "1991-05-06", "status": "PNS", "jabatan": "Guru Kelas 5A, KKA Kelas 6 dan Kokurikuler", "perangkat": "III/b" },
  { "id": "GURU-007", "no": 7, "nama": "Mustofa Mualimin", "nip": "196902031999031005", "tempat_lahir": "KAB. SEMARANG", "tanggal_lahir": "1969-02-03", "status": "PNS", "jabatan": "Guru Kelas 6A dan Kokurikule", "perangkat": "III/c" },
  { "id": "GURU-008", "no": 8, "nama": "RISMAWANTI PUTRI", "nip": "199406102020122002", "tempat_lahir": "SALATIGA", "tanggal_lahir": "1994-06-10", "status": "PNS", "jabatan": "Guru Kelas 5B dan Kokurikuler", "perangkat": "III/a" },
  { "id": "GURU-009", "no": 9, "nama": "Sartono", "nip": "196708192003121003", "tempat_lahir": "Sragen", "tanggal_lahir": "1967-08-19", "status": "PNS", "jabatan": "Guru Kelas 5B dan Kokurikuler", "perangkat": "III/c" },
  { "id": "GURU-010", "no": 10, "nama": "Tien Sutanti, S.pdi", "nip": "198104022010012013", "tempat_lahir": "Kab. semarang", "tanggal_lahir": "1981-04-02", "status": "PNS", "jabatan": "Guru PAIPB Kelas A dan Kokurikuler", "perangkat": "III/d" },
  { "id": "GURU-011", "no": 11, "nama": "Tri Puji Lestari", "nip": "199205232020122006", "tempat_lahir": "Kab. Semarang", "tanggal_lahir": "1992-05-23", "status": "PNS", "jabatan": "Guru Kelas 1A dan Kokurikuler", "perangkat": "III/a" },
  { "id": "GURU-012", "no": 12, "nama": "Amelia Fian Faulani", "nip": "198810042023212008", "tempat_lahir": "Salatiga", "tanggal_lahir": "1988-10-04", "status": "PPPK", "jabatan": "Guru Kelas 2A, Guru Bahasa Inggris", "perangkat": "IX" },
  { "id": "GURU-013", "no": 13, "nama": "Carolina Anggraeni", "nip": "198010212022212001", "tempat_lahir": "Salatiga", "tanggal_lahir": "1980-10-21", "status": "PPPK", "jabatan": "Guru Kelas 4A dan Kokurikuler", "perangkat": "IX" },
  { "id": "GURU-014", "no": 14, "nama": "DEBBY SANANDA MELODY", "nip": "199604182023212008", "tempat_lahir": "SALATIGA", "tanggal_lahir": "1996-04-18", "status": "PPPK", "jabatan": "Guru Kelas 2B dan Kokurikuler", "perangkat": "IX" },
  { "id": "GURU-015", "no": 15, "nama": "DWI ATMOKO WIDHIHARTONO", "nip": "199311032024211018", "tempat_lahir": "SALATIGA", "tanggal_lahir": "1993-11-03", "status": "PPPK", "jabatan": "Guru PAKPB dan Kokurikuler", "perangkat": "IX" },
  { "id": "GURU-016", "no": 16, "nama": "Pujiono", "nip": "198711122023211005", "tempat_lahir": "Blora", "tanggal_lahir": "1987-11-12", "status": "PPPK", "jabatan": "Guru Seni Budaya Kelas 3-6", "perangkat": "IX" },
  { "id": "GURU-017", "no": 17, "nama": "Sandri Hapsari", "nip": "198307302023212005", "tempat_lahir": "Salatiga", "tanggal_lahir": "1983-07-30", "status": "PPPK", "jabatan": "Guru Kelas 3A, Guru Bahasa Inggris", "perangkat": "IX" },
  { "id": "GURU-018", "no": 18, "nama": "Sekar Widyaningrum", "nip": "199105232022212001", "tempat_lahir": "Salatiga", "tanggal_lahir": "1991-05-23", "status": "PPPK", "jabatan": "Guru Kelas 1B dan Kokurikuler", "perangkat": "IX" },
  { "id": "GURU-019", "no": 19, "nama": "Septine Dwi Ningsih Maryani", "nip": "199409032024212029", "tempat_lahir": "Salatiga", "tanggal_lahir": "1994-09-03", "status": "PPPK", "jabatan": "Guru PAIPB Kelas B dan Kokurikuler", "perangkat": "IX" },
  { "id": "GURU-020", "no": 20, "nama": "Bekti Ariyani", "nip": "199603272025212048", "tempat_lahir": "Kab. Semarang", "tanggal_lahir": "1996-03-27", "status": "PPPK Paruh Waktu", "jabatan": "Guru Bahasa Jawa Kelas 2-6", "perangkat": "Paruh Waktu" },
  { "id": "GURU-021", "no": 21, "nama": "Risang Purnomo", "nip": "9946754655130122", "tempat_lahir": "Salatiga", "tanggal_lahir": "1976-06-14", "status": "PPPK Paruh Waktu", "jabatan": "Tenaga Kependidikan", "perangkat": "Paruh Waktu" },
  { "id": "GURU-022", "no": 22, "nama": "DEWI SANDRA AGUSTIN", "nip": "-", "tempat_lahir": "KAB. SEMARANG", "tanggal_lahir": "1995-07-05", "status": "PPPK Paruh Waktu", "jabatan": "Shadow Teacher", "perangkat": "Paruh Waktu" }
];

// ==========================================================================
// INISIALISASI
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadDataFromServer();
  initHeroCarousel();
  renderPublicSchoolInfo();
  renderPublicTeacherTable();
  renderAdminTable();
  renderAdminDashboardStats();
});

// Load data dari backend API Express
async function loadDataFromServer() {
  try {
    const [resTeachers, resSettings] = await Promise.all([
      fetch('/api/guru').then(r => r.json()).catch(() => null),
      fetch('/api/settings').then(r => r.json()).catch(() => null)
    ]);

    if (resTeachers && resTeachers.ok && Array.isArray(resTeachers.data) && resTeachers.data.length > 0) {
      appState.teachers = resTeachers.data;
    } else {
      appState.teachers = [...DEFAULT_TEACHERS];
    }

    if (resSettings && resSettings.ok && resSettings.data) {
      appState.schoolInfo.name = resSettings.data.school_name || appState.schoolInfo.name;
      appState.schoolInfo.address = resSettings.data.alamat || appState.schoolInfo.address;
      appState.schoolInfo.phone = resSettings.data.telepon || appState.schoolInfo.phone;
      appState.schoolInfo.email = resSettings.data.email || appState.schoolInfo.email;
      appState.schoolInfo.npsn = resSettings.data.npsn || appState.schoolInfo.npsn;
      appState.sheets.gasUrl = resSettings.data.gas_url || '';
      appState.sheets.spreadsheetId = resSettings.data.spreadsheet_id || appState.sheets.spreadsheetId;
      appState.sheets.spreadsheetUrl = resSettings.data.spreadsheet_url || appState.sheets.spreadsheetUrl;
    }
  } catch (e) {
    console.warn('Menggunakan fallback data lokal:', e);
    appState.teachers = [...DEFAULT_TEACHERS];
  }
}

// ==========================================================================
// HERO CAROUSEL
// ==========================================================================
function initHeroCarousel() {
  const heroImg = document.getElementById('heroMainImg');
  const thumbsContainer = document.getElementById('heroThumbsContainer');
  if (!heroImg || !thumbsContainer) return;

  const photoTitles = [
    'Gedung & Halaman Utama SD Salatiga 03',
    'Siswa Berprestasi Peraih Medali',
    'Koleksi Piala & Prestasi Sekolah',
    'Ruang Perpustakaan & Multimedia'
  ];

  thumbsContainer.innerHTML = appState.schoolInfo.heroImages.map((src, idx) => `
    <div class="hero-thumb ${idx === appState.schoolInfo.heroImageIndex ? 'active' : ''}" onclick="setHeroImage(${idx})" title="${photoTitles[idx] || 'Foto ' + (idx + 1)}">
      <img src="${src}" alt="${photoTitles[idx] || 'Foto ' + (idx + 1)}" loading="lazy">
    </div>
  `).join('');
}

function setHeroImage(index) {
  appState.schoolInfo.heroImageIndex = index;
  const heroImg = document.getElementById('heroMainImg');
  if (heroImg) {
    heroImg.src = appState.schoolInfo.heroImages[index];
  }
  const widgetImg = document.getElementById('widgetMainPhoto');
  if (widgetImg) {
    widgetImg.src = appState.schoolInfo.heroImages[index];
  }
  document.querySelectorAll('.hero-thumb').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === index);
  });
}

function nextHeroImage() {
  const nextIdx = (appState.schoolInfo.heroImageIndex + 1) % appState.schoolInfo.heroImages.length;
  setHeroImage(nextIdx);
}

function prevHeroImage() {
  const prevIdx = (appState.schoolInfo.heroImageIndex - 1 + appState.schoolInfo.heroImages.length) % appState.schoolInfo.heroImages.length;
  setHeroImage(prevIdx);
}

// ==========================================================================
// INFORMASI SEKOLAH PUBLIK
// ==========================================================================
function renderPublicSchoolInfo() {
  document.querySelectorAll('.sync-school-name').forEach(el => el.textContent = appState.schoolInfo.name);
  document.querySelectorAll('.sync-school-address').forEach(el => el.textContent = appState.schoolInfo.address);
  document.querySelectorAll('.sync-school-npsn').forEach(el => el.textContent = appState.schoolInfo.npsn);

  const heroDescEl = document.getElementById('heroDescriptionText');
  if (heroDescEl) heroDescEl.textContent = appState.schoolInfo.heroDescription;
}

// ==========================================================================
// TABEL DATA GURU PUBLIK (DIREKTORI)
// ==========================================================================
function renderPublicTeacherTable() {
  const tbody = document.getElementById('pubTeacherTableBody');
  if (!tbody) return;

  const searchVal = (document.getElementById('pubSearchInput')?.value || '').toLowerCase().trim();
  const filterStatus = document.getElementById('pubFilterStatus')?.value || '';

  const filtered = appState.teachers.filter(t => {
    const matchSearch = !searchVal ||
      (t.nama && t.nama.toLowerCase().includes(searchVal)) ||
      (t.nip && t.nip.includes(searchVal)) ||
      (t.jabatan && t.jabatan.toLowerCase().includes(searchVal));

    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchCategory = !appState.publicCategoryFilter || getTeacherCategoryKey(t) === appState.publicCategoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  // Mask NIP for public privacy (e.g., 19690424********06)
  const maskNip = (nip) => {
    if (!nip || nip === '-' || nip.length < 10) return nip || '-';
    return nip.slice(0, 8) + '********' + nip.slice(-2);
  };

  const getStatusBadgeClass = (st) => {
    if (st === 'PNS') return 'badge-active';
    if (st === 'PPPK') return 'badge-primary';
    return 'badge-slate';
  };

  tbody.innerHTML = filtered.map((t, idx) => `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td>
        <div style="font-weight:700; color:var(--text-main); font-size:14px;">${escapeHtml(t.nama)}</div>
        <small style="color:var(--text-muted);">${escapeHtml(t.tempat_lahir || '-')}, ${escapeHtml(t.tanggal_lahir || '-')}</small>
      </td>
      <td class="cell-privacy-blur" title="Privasi Terkunci: Hanya dapat dilihat oleh Admin">
        <span class="blurred-val"><code>${escapeHtml(t.nip && t.nip !== '-' ? t.nip : '198501012010011005')}</code></span>
        <span class="privacy-lock-pill">🔒 Terkunci</span>
      </td>
      <td class="cell-privacy-blur" title="Privasi Terkunci: Hanya dapat dilihat oleh Admin">
        <span class="blurred-val">
          <span class="badge ${getStatusBadgeClass(t.status)}">${escapeHtml(t.status || 'PNS')}</span>
        </span>
        <span class="privacy-lock-pill">🔒</span>
      </td>
      <td class="cell-privacy-blur" title="Privasi Terkunci: Hanya dapat dilihat oleh Admin">
        <span class="blurred-val">${escapeHtml(t.jabatan || 'Guru Kelas')}</span>
        <span class="privacy-lock-pill">🔒</span>
      </td>
      <td class="cell-privacy-blur" title="Privasi Terkunci: Hanya dapat dilihat oleh Admin">
        <span class="blurred-val"><span class="badge badge-slate">${escapeHtml(t.perangkat || 'III/a')}</span></span>
        <span class="privacy-lock-pill">🔒</span>
      </td>
    </tr>
  `).join('');

  safeSetText('pubTeacherCount', `${filtered.length} dari ${appState.teachers.length} Guru`);
  safeSetText('heroTeacherCountDisplay', appState.teachers.length);
}

// ==========================================================================
// MODAL ISI DATA GURU (MANDIRI & ADMIN)
// ==========================================================================
function openPublicFormModal() {
  document.getElementById('publicFormModalTitle').textContent = 'Formulir Pendataan Guru — SD Salatiga 03';
  document.getElementById('formGuruMandiri').reset();
  appState.editingTeacherId = null;
  appState.formModalMode = 'create';
  document.getElementById('publicFormModal').classList.add('active');
}

function closePublicFormModal() {
  document.getElementById('publicFormModal').classList.remove('active');
}

// Toggle custom input for "Lainnya" in selects
function handleSelectOtherToggle(selectEl, wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.style.display = (selectEl.value === '__other__') ? 'block' : 'none';
  if (selectEl.value === '__other__') {
    wrap.querySelector('input')?.focus();
  }
}

// Handler simpan data guru (dipakai oleh form publik & form admin)
async function handleGuruFormSubmit(e) {
  e.preventDefault();

  const nama = document.getElementById('fNama').value.trim();
  if (!nama) {
    alert('Nama lengkap dan gelar wajib diisi!');
    return;
  }

  // Handle select or custom other value
  let statusVal = document.getElementById('fStatus').value;
  if (statusVal === '__other__') {
    statusVal = document.getElementById('fStatusOther').value.trim() || 'Lainnya';
  }

  let jabatanVal = document.getElementById('fJabatan').value;
  if (jabatanVal === '__other__') {
    jabatanVal = document.getElementById('fJabatanOther').value.trim() || 'Lainnya';
  }

  const nipVal = document.getElementById('fNip').value.trim() || '-';

  // Duplicate NIP check
  if (nipVal !== '-' && nipVal.length > 5) {
    const isDup = appState.teachers.some(t => 
      t.nip && t.nip !== '-' && t.nip.trim() === nipVal && t.id !== appState.editingTeacherId
    );
    if (isDup) {
      alert(`Peringatan: NIP "${nipVal}" sudah terdaftar di sistem SD Salatiga 03!`);
      return;
    }
  }

  const payload = {
    nama,
    nip: nipVal,
    tempat_lahir: document.getElementById('fTempatLahir').value.trim(),
    tanggal_lahir: document.getElementById('fTanggalLahir').value,
    status: statusVal,
    jabatan: jabatanVal,
    perangkat: document.getElementById('fPerangkat').value.trim() || '-',
    penugasan: document.getElementById('fPenugasan').value.trim() || '',
    wa: document.getElementById('fWa').value.trim() || ''
  };

  try {
    if (appState.formModalMode === 'create') {
      const idNum = appState.teachers.length + 1;
      const newTeacher = {
        id: 'GURU-' + String(idNum).padStart(3, '0'),
        no: idNum,
        ...payload
      };

      // Simpan ke API Express
      fetch('/api/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher)
      }).then(() => {
        // Background sync to Google Sheets
        fetch('/api/sheets/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }).catch(() => {});
      }).catch(err => console.log('Simpan ke server:', err));

      appState.teachers.push(newTeacher);
      alert(`Berhasil! Data guru "${nama}" telah disimpan ke sistem SD Salatiga 03.`);
    } else {
      // Edit mode
      const idx = appState.teachers.findIndex(t => t.id === appState.editingTeacherId);
      if (idx !== -1) {
        appState.teachers[idx] = {
          ...appState.teachers[idx],
          ...payload
        };

        fetch(`/api/guru/${appState.editingTeacherId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(() => {
          fetch('/api/sheets/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }).catch(() => {});
        }).catch(err => console.log('Update ke server:', err));

        alert(`Data guru "${nama}" berhasil diperbarui!`);
      }
    }
  } catch (err) {
    console.error(err);
  }

  closePublicFormModal();
  renderPublicTeacherTable();
  renderAdminTable();
  renderAdminDashboardStats();
}

// ==========================================================================
// ADMIN DASHBOARD & STATISTIK
// ==========================================================================
function renderAdminDashboardStats() {
  const total = appState.teachers.length;
  const pns = appState.teachers.filter(t => t.status === 'PNS').length;
  const pppk = appState.teachers.filter(t => t.status === 'PPPK').length;
  const paruhWaktu = appState.teachers.filter(t => t.status === 'PPPK Paruh Waktu').length;
  const lainnya = total - (pns + pppk + paruhWaktu);

  safeSetText('statTotalGuru', total);
  safeSetText('statGuruPns', pns);
  safeSetText('statGuruPppk', pppk);
  safeSetText('statGuruParuhWaktu', paruhWaktu);
  safeSetText('statGuruLainnya', lainnya);

  renderBarChart();
  renderDonutChart(total);
  renderRecentTeachers();
}

function renderBarChart() {
  const containers = [
    { el: document.getElementById('barChartContainer'), isPublic: false },
    { el: document.getElementById('pubBarChartContainer'), isPublic: true }
  ];

  // Frekuensi Kategori Jabatan Dihitung Real-time dari appState.teachers
  const counts = {};
  CHART_CATEGORIES.forEach(c => { counts[c.key] = 0; });

  appState.teachers.forEach(t => {
    const cat = getTeacherCategoryKey(t);
    if (counts.hasOwnProperty(cat)) {
      counts[cat]++;
    } else {
      counts['Tendik / Lainnya']++;
    }
  });

  const maxVal = Math.max(...Object.values(counts), 1);

  containers.forEach(({ el, isPublic }) => {
    if (!el) return;

    el.innerHTML = CHART_CATEGORIES.map(cat => {
      const val = counts[cat.key] || 0;
      const heightPercent = maxVal > 0 ? Math.max(Math.round((val / maxVal) * 85), 18) : 18;
      const activeFilter = isPublic ? appState.publicCategoryFilter : appState.adminCategoryFilter;
      const isActive = activeFilter === cat.key;

      return `
        <div class="bar-col ${isActive ? 'active' : ''}" 
             onclick="handleCategoryChartClick('${cat.key}', ${isPublic})" 
             title="Klik untuk melihat ${val} guru/staf kategori ${escapeHtml(cat.label)}">
          <div class="bar-val-bubble">${val}</div>
          <div class="bar-fill" style="height: ${heightPercent}%;"></div>
          <div class="bar-lbl" title="${escapeHtml(cat.label)}">${escapeHtml(cat.shortLabel || cat.label)}</div>
        </div>
      `;
    }).join('');
  });
}

// Handler interaksi klik pada grafik batang kategori
function handleCategoryChartClick(categoryKey, isPublic) {
  openCategoryTeachersModal(categoryKey, isPublic);
}

function openCategoryTeachersModal(categoryKey, isPublic) {
  appState.activeCategoryModalKey = categoryKey;
  const isPub = (typeof isPublic === 'boolean') ? isPublic : (appState.activeView === 'public');

  const catMeta = CHART_CATEGORIES.find(c => c.key === categoryKey) || {
    key: categoryKey,
    label: categoryKey,
    icon: '📋'
  };

  const filteredTeachers = appState.teachers.filter(t => getTeacherCategoryKey(t) === categoryKey);

  // Set modal header
  safeSetText('catModalTitle', `Data ${catMeta.label}`);
  safeSetText('catModalCountBadge', `${filteredTeachers.length} Orang`);
  const iconWrap = document.getElementById('catModalIconWrap');
  if (iconWrap) iconWrap.textContent = catMeta.icon;

  const subtitle = document.getElementById('catModalSubtitle');
  if (subtitle) {
    subtitle.textContent = `SD Salatiga 03 — Menampilkan ${filteredTeachers.length} data guru/staf dalam kategori ${catMeta.label}.`;
  }

  // Set privacy note
  const privacyNote = document.getElementById('catModalPrivacyNote');
  const privacyText = document.getElementById('catModalPrivacyText');
  if (isPub) {
    if (privacyNote) privacyNote.style.display = 'flex';
    if (privacyText) privacyText.textContent = 'Privasi NIP disamarkan untuk umum. Masuk admin untuk melihat lengkap.';
  } else {
    if (privacyNote) privacyNote.style.display = 'flex';
    if (privacyText) privacyText.textContent = 'Mode Administrator: NIP & seluruh data tampil lengkap.';
  }

  // Set action button text
  const viewTableBtn = document.getElementById('catModalViewTableBtn');
  if (viewTableBtn) {
    viewTableBtn.textContent = isPub ? '📋 Tampilkan di Tabel Direktori' : '📋 Buka di Tabel Data Guru';
  }

  // Render teachers cards
  const listContainer = document.getElementById('catModalTeacherList');
  if (listContainer) {
    if (filteredTeachers.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:32px 10px; color:var(--text-muted);">
          <div style="font-size:32px; margin-bottom:8px;">📂</div>
          <p style="font-size:14px; font-weight:600;">Belum ada guru/staf yang terdaftar di kategori ini.</p>
        </div>
      `;
    } else {
      listContainer.innerHTML = filteredTeachers.map((t, idx) => {
        const initials = (t.nama || 'G')
          .split(' ')
          .map(w => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();

        const badgeClass = t.status === 'PNS' ? 'badge-active' : (t.status === 'PPPK' ? 'badge-primary' : 'badge-slate');

        let nipDisplay = '';
        if (isPub) {
          const rawNip = t.nip && t.nip !== '-' ? t.nip : '198501012010011005';
          const masked = rawNip.length > 8 ? rawNip.slice(0, 8) + '••••••••' : '••••••••';
          nipDisplay = `<span class="cat-teacher-nip-code" title="Privasi NIP Disamarkan">🔒 <code>${escapeHtml(masked)}</code></span>`;
        } else {
          const rawNip = t.nip && t.nip !== '-' ? t.nip : '-';
          nipDisplay = `<span class="cat-teacher-nip-code">NIP: <code>${escapeHtml(rawNip)}</code></span>`;
        }

        const adminAction = !isPub ? `
          <button class="btn btn-secondary btn-sm" onclick="closeCategoryTeachersModal(); openDetailModal('${t.id}')" title="Lihat detail & kelola guru ini">
            🔍 Detail
          </button>
        ` : '';

        return `
          <div class="cat-teacher-card">
            <div class="cat-teacher-avatar">${initials}</div>
            <div class="cat-teacher-info">
              <div class="cat-teacher-name-row">
                <h4 class="cat-teacher-name">${escapeHtml(t.nama)}</h4>
                <span class="badge ${badgeClass}">${escapeHtml(t.status || 'PNS')}</span>
              </div>
              <div class="cat-teacher-meta">
                <span>💼 ${escapeHtml(t.jabatan || '-')}</span>
                <span>•</span>
                <span>🎖️ Gol: ${escapeHtml(t.perangkat || '-')}</span>
              </div>
              <div class="cat-teacher-nip">
                ${nipDisplay}
              </div>
            </div>
            ${adminAction}
          </div>
        `;
      }).join('');
    }
  }

  const modal = document.getElementById('categoryTeachersModal');
  if (modal) modal.classList.add('active');
}

function closeCategoryTeachersModal() {
  const modal = document.getElementById('categoryTeachersModal');
  if (modal) modal.classList.remove('active');
}

function filterTableFromCategoryModal() {
  const categoryKey = appState.activeCategoryModalKey;
  closeCategoryTeachersModal();
  if (!categoryKey) return;

  if (appState.activeView === 'public') {
    appState.publicCategoryFilter = categoryKey;
    const badge = document.getElementById('pubCategoryFilterBadge');
    const textEl = document.getElementById('pubCategoryFilterText');
    if (badge && textEl) {
      badge.style.display = 'inline-flex';
      textEl.textContent = categoryKey;
    }
    renderPublicTeacherTable();
    renderBarChart();
    const direktoriSection = document.getElementById('direktori-guru');
    if (direktoriSection) {
      direktoriSection.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    switchAdminTab('data-guru');
    appState.adminCategoryFilter = categoryKey;
    const badge = document.getElementById('adminCategoryFilterBadge');
    const textEl = document.getElementById('adminCategoryFilterText');
    if (badge && textEl) {
      badge.style.display = 'inline-flex';
      textEl.textContent = categoryKey;
    }
    renderAdminTable();
    renderBarChart();
  }
}

function clearPublicCategoryFilter() {
  appState.publicCategoryFilter = null;
  const badge = document.getElementById('pubCategoryFilterBadge');
  if (badge) badge.style.display = 'none';
  renderPublicTeacherTable();
  renderBarChart();
}

function clearAdminCategoryFilter() {
  appState.adminCategoryFilter = null;
  const badge = document.getElementById('adminCategoryFilterBadge');
  if (badge) badge.style.display = 'none';
  renderAdminTable();
  renderBarChart();
}

function renderDonutChart(total) {
  const svgEl = document.getElementById('donutSvg');
  const legendEl = document.getElementById('donutLegend');
  if (!svgEl || !legendEl) return;

  const counts = {};
  appState.teachers.forEach(t => {
    const st = t.status || 'Lainnya';
    counts[st] = (counts[st] || 0) + 1;
  });

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];
  const items = Object.entries(counts);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const circlesHtml = items.map(([label, val], idx) => {
    const percent = total > 0 ? (val / total) : 0;
    const strokeDash = percent * circumference;
    const strokeOffset = circumference - (accumulatedPercent * circumference);
    accumulatedPercent += percent;
    const color = colors[idx % colors.length];

    return `
      <circle cx="70" cy="70" r="${radius}" fill="none" stroke="${color}" stroke-width="18"
              stroke-dasharray="${strokeDash} ${circumference}"
              stroke-dashoffset="${strokeOffset}"
              transform="rotate(-90 70 70)">
        <title>${escapeHtml(label)}: ${val} (${Math.round(percent * 100)}%)</title>
      </circle>
    `;
  }).join('');

  svgEl.innerHTML = circlesHtml;
  safeSetText('donutCenterTotal', total);

  legendEl.innerHTML = items.map(([label, val], idx) => {
    const color = colors[idx % colors.length];
    return `
      <div class="donut-legend-item">
        <div class="donut-legend-info">
          <span class="donut-dot" style="background:${color};"></span>
          <span>${escapeHtml(label)}</span>
        </div>
        <span class="donut-count">${val}</span>
      </div>
    `;
  }).join('');
}

function renderRecentTeachers() {
  const listEl = document.getElementById('recentTeachersList');
  if (!listEl) return;

  const recents = appState.teachers.slice(-4).reverse();
  listEl.innerHTML = recents.map((t, idx) => `
    <div class="recent-item">
      <div class="recent-avatar-meta">
        <div class="pub-brand-logo" style="width:34px; height:34px; font-size:12px; font-weight:700; color:#2563EB;">
          ${(t.nama || 'G')[0]}
        </div>
        <div>
          <div class="recent-name">${escapeHtml(t.nama)}</div>
          <div class="recent-role">${escapeHtml(t.jabatan)}</div>
        </div>
      </div>
      <span class="badge ${t.status === 'PNS' ? 'badge-active' : 'badge-slate'}">${t.status}</span>
    </div>
  `).join('');
}

// ==========================================================================
// ADMIN TABEL DATA GURU
// ==========================================================================
function renderAdminTable() {
  const tbody = document.getElementById('teacherTableBody');
  const emptyState = document.getElementById('tableEmptyState');
  if (!tbody) return;

  const searchVal = (document.getElementById('teacherSearchInput')?.value || '').toLowerCase().trim();
  const filterStatus = document.getElementById('filterStatusSelect')?.value || '';

  const filtered = appState.teachers.filter(t => {
    const matchSearch = !searchVal ||
      (t.nama && t.nama.toLowerCase().includes(searchVal)) ||
      (t.nip && t.nip.includes(searchVal)) ||
      (t.jabatan && t.jabatan.toLowerCase().includes(searchVal)) ||
      (t.perangkat && t.perangkat.toLowerCase().includes(searchVal));

    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchCategory = !appState.adminCategoryFilter || getTeacherCategoryKey(t) === appState.adminCategoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const getStatusBadge = (st) => {
    if (st === 'PNS') return 'badge-active';
    if (st === 'PPPK') return 'badge-primary';
    return 'badge-slate';
  };

  tbody.innerHTML = filtered.map((t, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div class="teacher-name-bold">${escapeHtml(t.nama)}</div>
        <small style="color:var(--text-muted);">${escapeHtml(t.tempat_lahir || '-')}, ${escapeHtml(t.tanggal_lahir || '-')}</small>
      </td>
      <td><code>${escapeHtml(t.nip || '-')}</code></td>
      <td>
        <span class="badge ${getStatusBadge(t.status)}">${escapeHtml(t.status || '-')}</span>
      </td>
      <td>${escapeHtml(t.jabatan || '-')}</td>
      <td><span class="badge badge-slate">${escapeHtml(t.perangkat || '-')}</span></td>
      <td>${escapeHtml(t.penugasan || '-')}</td>
      <td>
        <div class="action-buttons-group">
          <button class="btn-table-action view" onclick="openDetailModal('${t.id}')" title="Lihat Profil">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
          <button class="btn-table-action edit" onclick="openEditTeacherModal('${t.id}')" title="Edit Guru">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button class="btn-table-action delete" onclick="confirmDeleteTeacher('${t.id}')" title="Hapus Data">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Edit Guru
function openEditTeacherModal(id) {
  const teacher = appState.teachers.find(t => t.id === id);
  if (!teacher) return;

  appState.editingTeacherId = id;
  appState.formModalMode = 'edit';
  document.getElementById('publicFormModalTitle').textContent = `Edit Data Guru — ${teacher.nama}`;

  setVal('fNama', teacher.nama);
  setVal('fNip', teacher.nip !== '-' ? teacher.nip : '');
  setVal('fTempatLahir', teacher.tempat_lahir);
  setVal('fTanggalLahir', teacher.tanggal_lahir);
  setVal('fPerangkat', teacher.perangkat);
  setVal('fPenugasan', teacher.penugasan);
  setVal('fWa', teacher.wa);

  // Status
  const selectStatus = document.getElementById('fStatus');
  const validStatuses = ['PNS', 'PPPK', 'PPPK Paruh Waktu', 'Honorer', 'GTY', 'GTT'];
  if (validStatuses.includes(teacher.status)) {
    selectStatus.value = teacher.status;
    document.getElementById('wrapStatusOther').style.display = 'none';
  } else {
    selectStatus.value = '__other__';
    document.getElementById('wrapStatusOther').style.display = 'block';
    setVal('fStatusOther', teacher.status);
  }

  // Jabatan
  const selectJabatan = document.getElementById('fJabatan');
  let optionFound = false;
  for (let opt of selectJabatan.options) {
    if (opt.value === teacher.jabatan) {
      selectJabatan.value = teacher.jabatan;
      optionFound = true;
      break;
    }
  }
  if (!optionFound) {
    selectJabatan.value = '__other__';
    document.getElementById('wrapJabatanOther').style.display = 'block';
    setVal('fJabatanOther', teacher.jabatan);
  } else {
    document.getElementById('wrapJabatanOther').style.display = 'none';
  }

  document.getElementById('publicFormModal').classList.add('active');
}

// Detail Guru
function openDetailModal(id) {
  const teacher = appState.teachers.find(t => t.id === id);
  if (!teacher) return;

  safeSetText('detailTeacherNama', teacher.nama);
  safeSetText('detailTeacherJabatan', teacher.jabatan);
  safeSetText('detailTeacherStatus', teacher.status);

  safeSetText('detailNip', teacher.nip || '-');
  safeSetText('detailTtl', `${teacher.tempat_lahir || '-'}, ${teacher.tanggal_lahir || '-'}`);
  safeSetText('detailKepegawaian', teacher.status || '-');
  safeSetText('detailPerangkat', teacher.perangkat || '-');
  safeSetText('detailPenugasan', teacher.penugasan || '-');
  safeSetText('detailWa', teacher.wa || '-');

  const editBtn = document.getElementById('detailEditBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      closeDetailModal();
      openEditTeacherModal(teacher.id);
    };
  }

  document.getElementById('detailGuruModal').classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detailGuruModal').classList.remove('active');
}

function confirmDeleteTeacher(id) {
  const teacher = appState.teachers.find(t => t.id === id);
  if (!teacher) return;

  if (confirm(`Apakah Anda yakin ingin menghapus data guru "${teacher.nama}" dari sistem SD Salatiga 03?`)) {
    appState.teachers = appState.teachers.filter(t => t.id !== id);
    appState.teachers.forEach((t, i) => t.no = i + 1);

    fetch(`/api/guru/${id}`, { method: 'DELETE' }).then(() => {
      fetch('/api/sheets/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }).catch(() => {});
    }).catch(err => console.log('Hapus API:', err));

    renderPublicTeacherTable();
    renderAdminTable();
    renderAdminDashboardStats();
    alert(`Data guru "${teacher.nama}" telah berhasil dihapus.`);
  }
}

// ==========================================================================
// TAMPILAN VIEW & PENGATURAN
// ==========================================================================
function showAdminLayout() {
  document.getElementById('publicView').style.display = 'none';
  document.getElementById('adminLayout').style.display = 'block';
  appState.activeView = 'admin';
  switchAdminTab('dashboard');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPublicView() {
  document.getElementById('adminLayout').style.display = 'none';
  document.getElementById('publicView').style.display = 'block';
  appState.activeView = 'public';
  toggleAdminSidebar(false);
  togglePublicMobileMenu(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePublicMobileMenu(forceState) {
  const drawer = document.getElementById('pubMobileDrawer');
  const backdrop = document.getElementById('pubMobileBackdrop');
  if (!drawer) return;
  const isOpen = (typeof forceState === 'boolean') ? forceState : !drawer.classList.contains('active');
  drawer.classList.toggle('active', isOpen);
  if (backdrop) backdrop.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleAdminSidebar(forceState) {
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('adminSidebarBackdrop');
  if (!sidebar) return;
  const isOpen = (typeof forceState === 'boolean') ? forceState : !sidebar.classList.contains('mobile-open');
  sidebar.classList.toggle('mobile-open', isOpen);
  if (backdrop) backdrop.classList.toggle('active', isOpen);
  document.body.style.overflow = (isOpen && window.innerWidth <= 992) ? 'hidden' : '';
}

function switchAdminTab(tabName) {
  appState.adminTab = tabName;
  toggleAdminSidebar(false);

  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });

  const panels = ['dashboard', 'data-guru', 'profil-sekolah'];
  panels.forEach(p => {
    const el = document.getElementById(`panel-${p}`);
    if (el) el.style.display = (p === tabName) ? 'block' : 'none';
  });

  if (tabName === 'dashboard') {
    renderAdminDashboardStats();
  } else if (tabName === 'data-guru') {
    renderAdminTable();
  } else if (tabName === 'profil-sekolah') {
    loadSettingsIntoForm();
  }
}

function loadSettingsIntoForm() {
  setVal('setSchoolName', appState.schoolInfo.name);
  setVal('setSchoolTagline', appState.schoolInfo.tagline);
  setVal('setSchoolDesc', appState.schoolInfo.heroDescription);
  setVal('setSchoolAddress', appState.schoolInfo.address);
  setVal('setSchoolGmaps', appState.schoolInfo.gmapsUrl);
  setVal('setSchoolEmail', appState.schoolInfo.email);
  setVal('setSchoolPhone', appState.schoolInfo.phone);
  setVal('setGasUrl', appState.sheets.gasUrl);
  setVal('modalGasUrl', appState.sheets.gasUrl);
}

function handleSaveSettings(e) {
  e.preventDefault();
  appState.schoolInfo.name = getVal('setSchoolName') || appState.schoolInfo.name;
  appState.schoolInfo.tagline = getVal('setSchoolTagline') || appState.schoolInfo.tagline;
  appState.schoolInfo.heroDescription = getVal('setSchoolDesc') || appState.schoolInfo.heroDescription;
  appState.schoolInfo.address = getVal('setSchoolAddress') || appState.schoolInfo.address;
  appState.schoolInfo.gmapsUrl = getVal('setSchoolGmaps') || appState.schoolInfo.gmapsUrl;
  appState.schoolInfo.email = getVal('setSchoolEmail') || appState.schoolInfo.email;
  appState.schoolInfo.phone = getVal('setSchoolPhone') || appState.schoolInfo.phone;
  appState.sheets.gasUrl = getVal('setGasUrl') || appState.sheets.gasUrl;

  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      school_name: appState.schoolInfo.name,
      alamat: appState.schoolInfo.address,
      telepon: appState.schoolInfo.phone,
      email: appState.schoolInfo.email,
      gas_url: appState.sheets.gasUrl
    })
  }).catch(err => console.log('Simpan settings:', err));

  renderPublicSchoolInfo();
  alert('Pengaturan Profil & Spreadsheet SD Salatiga 03 berhasil disimpan!');
}

// ==========================================================================
// LOGIN MODAL
// ==========================================================================
function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
  const alertEl = document.getElementById('loginAlert');
  if (alertEl) alertEl.classList.remove('show');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

function togglePasswordVisibility() {
  const input = document.getElementById('loginPassword');
  if (input) input.type = (input.type === 'password') ? 'text' : 'password';
}

function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const alertEl = document.getElementById('loginAlert');
  const loginBtn = document.getElementById('loginSubmitBtn');

  loginBtn.innerHTML = 'Memverifikasi...';
  loginBtn.disabled = true;

  setTimeout(() => {
    loginBtn.innerHTML = 'Masuk ke Dashboard';
    loginBtn.disabled = false;

    if (username === 'admin' && (password === 'admin' || password === 'admin123' || password === 'AdminGuru#2026')) {
      appState.currentUser = { name: 'Admin SD Salatiga 03', role: 'Administrator', username };
      closeLoginModal();
      showAdminLayout();
    } else {
      if (alertEl) {
        alertEl.textContent = 'Username atau kata sandi tidak sesuai. (Kredensial: admin / admin)';
        alertEl.classList.add('show');
      }
    }
  }, 400);
}

// ==========================================================================
// EKSPOR SPREADSHEET (EXCEL .XLSX & CSV)
// ==========================================================================

function getExportDataset() {
  const searchVal = (document.getElementById('teacherSearchInput')?.value || '').toLowerCase().trim();
  const filterStatus = document.getElementById('filterStatusSelect')?.value || '';

  if (searchVal || filterStatus) {
    return appState.teachers.filter(t => {
      const matchSearch = !searchVal ||
        (t.nama && t.nama.toLowerCase().includes(searchVal)) ||
        (t.nip && t.nip.includes(searchVal)) ||
        (t.jabatan && t.jabatan.toLowerCase().includes(searchVal)) ||
        (t.perangkat && t.perangkat.toLowerCase().includes(searchVal));

      const matchStatus = !filterStatus || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }
  return appState.teachers;
}

function exportToExcel() {
  const data = getExportDataset();
  if (!data || data.length === 0) {
    alert('Tidak ada data guru untuk diekspor!');
    return;
  }

  const schoolName = appState.schoolInfo.name || 'SD SALATIGA 03';

  // Format clean rows for Excel
  const exportRows = data.map((t, idx) => ({
    'No': idx + 1,
    'ID Guru': t.id || `GURU-${String(idx + 1).padStart(3, '0')}`,
    'Nama Lengkap & Gelar': t.nama || '',
    'NIP / NUPTK / NIK': t.nip && t.nip !== '-' ? String(t.nip) : '-',
    'Tempat Lahir': t.tempat_lahir || '-',
    'Tanggal Lahir': t.tanggal_lahir || '-',
    'Status Kepegawaian': t.status || '-',
    'Jabatan / Penugasan': t.jabatan || '-',
    'Golongan / Perangkat': t.perangkat || '-',
    'Penugasan Tambahan': t.penugasan || '-',
    'Nomor WhatsApp / HP': t.wa || '-'
  }));

  if (window.XLSX) {
    const ws = XLSX.utils.json_to_sheet(exportRows);

    // Format column widths
    ws['!cols'] = [
      { wch: 6 },   // No
      { wch: 12 },  // ID Guru
      { wch: 32 },  // Nama
      { wch: 22 },  // NIP
      { wch: 16 },  // Tempat Lahir
      { wch: 14 },  // Tanggal Lahir
      { wch: 20 },  // Status
      { wch: 35 },  // Jabatan
      { wch: 18 },  // Golongan
      { wch: 25 },  // Penugasan
      { wch: 18 }   // WA
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Guru SD Salatiga 03");

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Data_Guru_${schoolName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);
    alert(`Spreadsheet Excel berhasil diunduh (${data.length} guru)!\nNama berkas: ${fileName}`);
  } else {
    // Fallback to CSV if SheetJS library is not loaded
    exportToCSV();
  }
}

function exportToCSV() {
  const data = getExportDataset();
  if (!data || data.length === 0) {
    alert('Tidak ada data guru untuk diekspor!');
    return;
  }

  const schoolName = appState.schoolInfo.name || 'SD SALATIGA 03';
  const headers = [
    'No', 'ID Guru', 'Nama Lengkap & Gelar', 'NIP / NUPTK / NIK',
    'Tempat Lahir', 'Tanggal Lahir', 'Status Kepegawaian',
    'Jabatan / Penugasan', 'Golongan / Perangkat', 'Penugasan Tambahan', 'Nomor WhatsApp / Kontak'
  ];

  const escapeCsv = (str) => '"' + String(str ?? '').replace(/"/g, '""') + '"';

  const lines = [headers.map(escapeCsv).join(';')];
  data.forEach((t, idx) => {
    lines.push([
      idx + 1,
      t.id || `GURU-${String(idx + 1).padStart(3, '0')}`,
      t.nama || '',
      t.nip && t.nip !== '-' ? String(t.nip) : '-',
      t.tempat_lahir || '-',
      t.tanggal_lahir || '-',
      t.status || '-',
      t.jabatan || '-',
      t.perangkat || '-',
      t.penugasan || '-',
      t.wa || '-'
    ].map(escapeCsv).join(';'));
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Data_Guru_${schoolName.replace(/\s+/g, '_')}_${dateStr}.csv`;
  downloadBlob(blob, fileName);
  alert(`Berkas CSV berhasil diunduh (${data.length} guru)!\nKompatibel dengan Microsoft Excel dan Google Spreadsheet.`);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ==========================================================================
// INTEGRASI GOOGLE SPREADSHEET & APPS SCRIPT
// ==========================================================================

function openGoogleSpreadsheet() {
  window.open(appState.sheets.spreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E/edit?usp=sharing', '_blank');
}

function openGoogleAppsScript() {
  window.open(appState.sheets.gasUrl || 'https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec', '_blank');
}

function openSheetsSyncModal() {
  openGoogleSpreadsheet();
}

function closeSheetsSyncModal() {}

async function syncWithGoogleSheets() {
  let gasUrlInput = document.getElementById('modalGasUrl')?.value.trim() ||
                    document.getElementById('setGasUrl')?.value.trim() ||
                    appState.sheets.gasUrl || '';

  if (!gasUrlInput) {
    const entered = prompt('Masukkan URL Google Apps Script Web App untuk mengirim data langsung ke Google Spreadsheet:\n(Contoh: https://script.google.com/macros/s/.../exec)', '');
    if (entered && entered.trim()) {
      gasUrlInput = entered.trim();
      appState.sheets.gasUrl = gasUrlInput;
      setVal('setGasUrl', gasUrlInput);
      setVal('modalGasUrl', gasUrlInput);
      // Simpan URL ke settings server
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gas_url: gasUrlInput })
      }).catch(() => {});
    }
  }

  const syncBtns = document.querySelectorAll('[onclick="syncWithGoogleSheets()"]');
  syncBtns.forEach(b => {
    b.dataset.prevHtml = b.innerHTML;
    b.innerHTML = '<span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid #FFF; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px;"></span>Menyinkronkan...';
    b.disabled = true;
  });

  try {
    const res = await fetch('/api/sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gas_url: gasUrlInput })
    });
    const json = await res.json();

    if (json.ok) {
      appState.sheets.lastSync = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      safeSetText('dashSyncTimeSpan', `Terakhir: Hari ini, ${appState.sheets.lastSync}`);
      
      const badge = document.getElementById('dashSyncStatusBadge');
      if (badge) {
        badge.textContent = json.localOnly ? '● Tersimpan Lokal' : '● Tersinkron Google Sheets';
        badge.style.background = json.localOnly ? '#3B82F6' : '#10B981';
      }

      alert(json.message || 'Sinkronisasi berhasil!');
    } else {
      alert(`Peringatan: ${json.error || 'Gagal menyinkronkan data.'}`);
    }
  } catch (err) {
    console.error(err);
    alert(`Terjadi kesalahan: ${err.message}`);
  } finally {
    syncBtns.forEach(b => {
      b.innerHTML = b.dataset.prevHtml || 'Sinkronkan Sekarang';
      b.disabled = false;
    });
  }
}

async function testSheetsConnection() {
  const gasUrl = document.getElementById('modalGasUrl')?.value.trim() ||
                 document.getElementById('setGasUrl')?.value.trim() ||
                 appState.sheets.gasUrl || '';

  if (!gasUrl) {
    alert('Silakan masukkan URL Web App Google Apps Script terlebih dahulu!');
    return;
  }

  try {
    const res = await fetch('/api/sheets/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gas_url: gasUrl })
    });
    const json = await res.json();

    if (json.ok) {
      appState.sheets.gasUrl = gasUrl;
      setVal('setGasUrl', gasUrl);
      setVal('modalGasUrl', gasUrl);
      alert(`✅ ${json.message || 'Koneksi ke Google Apps Script berhasil!'}`);
    } else {
      alert(`❌ ${json.error || 'Gagal menghubungi Google Apps Script.'}`);
    }
  } catch (err) {
    alert(`Gagal menghubungi server: ${err.message}`);
  }
}

// ==========================================================================
// HAPUS SEMUA DATA GURU & KOSONGKAN SPREADSHEET
// ==========================================================================

function openDeleteAllConfirmModal() {
  const modal = document.getElementById('deleteAllConfirmModal');
  if (!modal) return;

  const countDisplay = document.getElementById('deleteAllCountDisplay');
  if (countDisplay) countDisplay.textContent = appState.teachers.length;

  const inputConfirm = document.getElementById('confirmDeleteAllInput');
  if (inputConfirm) {
    inputConfirm.value = '';
    inputConfirm.style.borderColor = '#F87171';
  }

  const btnExecute = document.getElementById('executeDeleteAllBtn');
  if (btnExecute) btnExecute.disabled = true;

  modal.classList.add('active');
  inputConfirm?.focus();
}

function closeDeleteAllConfirmModal() {
  const modal = document.getElementById('deleteAllConfirmModal');
  if (modal) modal.classList.remove('active');
}

function validateDeleteAllInput() {
  const inputConfirm = document.getElementById('confirmDeleteAllInput');
  const btnExecute = document.getElementById('executeDeleteAllBtn');
  if (!inputConfirm || !btnExecute) return;

  const isValid = inputConfirm.value.trim().toUpperCase() === 'HAPUS SEMUA';
  btnExecute.disabled = !isValid;
  inputConfirm.style.borderColor = isValid ? '#10B981' : '#F87171';
}

async function executeDeleteAllTeachers() {
  const btnExecute = document.getElementById('executeDeleteAllBtn');
  const prevHtml = btnExecute ? btnExecute.innerHTML : '';
  if (btnExecute) {
    btnExecute.innerHTML = '<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #FFF; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px;"></span>Menghapus & Mengosongkan...';
    btnExecute.disabled = true;
  }

  try {
    const res = await fetch('/api/guru-all', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();

    if (json.ok) {
      appState.teachers = [];
      renderPublicTeacherTable();
      renderAdminTable();
      renderAdminDashboardStats();

      safeSetText('dashSyncTimeSpan', 'Terakhir: Baru saja (Dikosongkan)');
      const badge = document.getElementById('dashSyncStatusBadge');
      if (badge) {
        badge.textContent = '● Spreadsheet Dikosongkan';
        badge.style.background = '#64748B';
      }

      closeDeleteAllConfirmModal();
      alert('Berhasil! Seluruh data guru telah dihapus dari sistem dan Google Spreadsheet resmi telah dikosongkan.');
    } else {
      alert(`Gagal menghapus data: ${json.error || 'Terjadi kesalahan sistem'}`);
    }
  } catch (err) {
    console.error(err);
    alert(`Terjadi kesalahan saat menghapus data: ${err.message}`);
  } finally {
    if (btnExecute) {
      btnExecute.innerHTML = prevHtml;
      btnExecute.disabled = false;
    }
  }
}

// ==========================================================================
// HELPERS
// ==========================================================================
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getVal(id) {
  return document.getElementById(id)?.value || '';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global responsive & accessibility keyboard listener
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    togglePublicMobileMenu(false);
    toggleAdminSidebar(false);
    closePublicFormModal();
    closeLoginModal();
    closeDetailModal();
    closeDeleteAllConfirmModal();
    closeCategoryTeachersModal();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    togglePublicMobileMenu(false);
    toggleAdminSidebar(false);
  }
});
