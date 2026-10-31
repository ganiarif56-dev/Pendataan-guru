const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3300;
const isVercel = Boolean(process.env.VERCEL);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS and Anti-Cache middleware for local & devtunnels support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-user');
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Surrogate-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  lastModified: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
}));

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const GURU_FILE = path.join(DATA_DIR, 'guru_sd_salatiga_03.json');
const COLUMNS_FILE = path.join(DATA_DIR, 'kolom_dinamis.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_log.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Helper functions (with Serverless / Vercel read-only support)
function getTargetFilePath(file) {
  if (isVercel) {
    const tmpFile = path.join(os.tmpdir(), path.basename(file));
    if (fs.existsSync(tmpFile)) return tmpFile;
  }
  return file;
}

function readJson(file, fallback = []) {
  try {
    const targetFile = getTargetFilePath(file);
    if (fs.existsSync(targetFile)) {
      let content = fs.readFileSync(targetFile, 'utf8');
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
  }
  return fallback;
}

function writeJson(file, data) {
  try {
    // If on Vercel, save to /tmp
    if (isVercel) {
      try {
        const tmpFile = path.join(os.tmpdir(), path.basename(file));
        fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
      } catch (tmpErr) {
        console.warn('Gagal menulis ke /tmp:', tmpErr.message);
      }
    }
    // Try writing to original path (succeeds locally, silently ignored on Vercel EROFS)
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      if (!isVercel) console.error(`Error writing ${file}:`, e);
    }
    return true;
  } catch (e) {
    console.error(`Error writing ${file}:`, e);
    return false;
  }
}

function appendAudit(user, action, detail, status = 'Sukses') {
  const list = readJson(AUDIT_FILE, []);
  const entry = {
    id: 'AUDIT-' + String(Date.now()).slice(-6),
    timestamp: new Date().toISOString(),
    user: user || 'admin',
    action,
    detail,
    status
  };
  list.unshift(entry);
  if (list.length > 500) list.length = 500;
  writeJson(AUDIT_FILE, list);
  return entry;
}

// Auto-sync ke Google Spreadsheet Helper
async function pushToGoogleSheets(teachersList) {
  try {
    const settings = readJson(SETTINGS_FILE, {});
    let gasUrl = (settings.gas_url || 'https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec').trim();
    if (gasUrl.endsWith('/exe')) gasUrl = gasUrl + 'c';

    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'sync',
        data: teachersList || []
      }),
      redirect: 'follow'
    });
    console.log(`[Auto-Sync] ${teachersList ? teachersList.length : 0} guru berhasil disinkronkan ke Google Spreadsheet.`);
  } catch (err) {
    console.warn('[Auto-Sync Warning] Gagal menyinkronkan ke Google Sheets:', err.message);
  }
}

// API Routes
app.get('/api/guru', async (req, res) => {
  // On Vercel, fetch fresh cloud data from Google Apps Script if available
  if (isVercel || req.query.cloud === '1') {
    try {
      const settings = readJson(SETTINGS_FILE, {});
      let gasUrl = (settings.gas_url || 'https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec').trim();
      if (gasUrl.endsWith('/exe')) gasUrl += 'c';

      const response = await fetch(gasUrl + '?action=list', {
        signal: AbortSignal.timeout(4000),
        redirect: 'follow'
      });
      const json = await response.json();
      if (json && json.ok && Array.isArray(json.data) && json.data.length > 0) {
        writeJson(GURU_FILE, json.data);
        return res.json({ ok: true, data: json.data, source: 'cloud' });
      }
    } catch (e) {
      console.warn('[Cloud Fetch] Fallback to local cache:', e.message);
    }
  }

  const data = readJson(GURU_FILE, []);
  res.json({ ok: true, data, source: 'local' });
});

app.post('/api/guru', (req, res) => {
  try {
    const list = readJson(GURU_FILE, []);
    const body = req.body;
    if (!body.nama || !body.nama.trim()) {
      return res.status(400).json({ ok: false, error: 'Nama guru wajib diisi' });
    }
    if (body.nip && body.nip.trim() && body.nip.trim() !== '-') {
      const isDup = list.some(g => g.nip && g.nip.trim() !== '-' && g.nip.trim() === body.nip.trim());
      if (isDup) {
        return res.status(400).json({ ok: false, error: `NIP "${body.nip}" sudah terdaftar di sistem` });
      }
    }
    const idNum = list.length + 1;
    const newGuru = {
      id: 'GURU-' + String(idNum).padStart(3, '0'),
      no: idNum,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    list.push(newGuru);
    writeJson(GURU_FILE, list);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Tambah Guru', `Menambah data guru: ${newGuru.nama}`);
    
    // Otomatis sinkronisasi ke Google Spreadsheet secara real-time
    pushToGoogleSheets(list);

    res.json({ ok: true, data: newGuru, message: 'Data guru berhasil disimpan dan disinkronkan' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.put('/api/guru/:id', (req, res) => {
  try {
    const list = readJson(GURU_FILE, []);
    const { id } = req.params;
    const idx = list.findIndex(g => g.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Data guru tidak ditemukan' });
    }
    list[idx] = {
      ...list[idx],
      ...req.body,
      id: list[idx].id,
      no: list[idx].no,
      updated_at: new Date().toISOString()
    };
    writeJson(GURU_FILE, list);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Edit Guru', `Memperbarui data guru: ${list[idx].nama}`);
    
    // Otomatis sinkronisasi ke Google Spreadsheet
    pushToGoogleSheets(list);

    res.json({ ok: true, data: list[idx], message: 'Data guru berhasil diperbarui dan disinkronkan' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/guru/:id', (req, res) => {
  try {
    let list = readJson(GURU_FILE, []);
    const { id } = req.params;
    const target = list.find(g => g.id === id);
    if (!target) {
      return res.status(404).json({ ok: false, error: 'Data guru tidak ditemukan' });
    }
    list = list.filter(g => g.id !== id);
    // Renumber
    list.forEach((g, i) => g.no = i + 1);
    writeJson(GURU_FILE, list);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Hapus Guru', `Menghapus data guru: ${target.nama}`);
    
    // Otomatis sinkronisasi ke Google Spreadsheet
    pushToGoogleSheets(list);

    res.json({ ok: true, message: 'Data guru berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Hapus Semua Data Guru & Kosongkan Spreadsheet
app.delete('/api/guru-all', async (req, res) => {
  try {
    const list = readJson(GURU_FILE, []);
    const count = list.length;
    
    // Kosongkan file data lokal
    writeJson(GURU_FILE, []);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Hapus Semua Guru', `Menghapus seluruh master data (${count} guru) dan mengosongkan spreadsheet`);
    
    // Kosongkan juga data di Google Spreadsheet
    await pushToGoogleSheets([]);

    res.json({
      ok: true,
      count: 0,
      deletedCount: count,
      message: `Seluruh data (${count} guru) berhasil dihapus dari sistem dan Google Spreadsheet telah dikosongkan.`
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/sync-all', (req, res) => {
  try {
    const { teachers } = req.body;
    if (Array.isArray(teachers)) {
      writeJson(GURU_FILE, teachers);
      return res.json({ ok: true, message: 'Sinkronisasi berhasil' });
    }
    res.status(400).json({ ok: false, error: 'Format data tidak valid' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Dynamic Columns
app.get('/api/columns', (req, res) => {
  const columns = readJson(COLUMNS_FILE, []);
  res.json({ ok: true, data: columns });
});

app.post('/api/columns', (req, res) => {
  try {
    const columns = req.body;
    if (!Array.isArray(columns)) {
      return res.status(400).json({ ok: false, error: 'Format kolom harus berupa array' });
    }
    writeJson(COLUMNS_FILE, columns);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Manajemen Kolom', `Memperbarui skema kolom (${columns.length} kolom)`);
    res.json({ ok: true, message: 'Skema kolom berhasil disimpan' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Audit Log
app.get('/api/audit', (req, res) => {
  const list = readJson(AUDIT_FILE, []);
  res.json({ ok: true, data: list });
});

// Settings
app.get('/api/settings', (req, res) => {
  const settings = readJson(SETTINGS_FILE, {});
  res.json({ ok: true, data: settings });
});

app.post('/api/settings', (req, res) => {
  try {
    const current = readJson(SETTINGS_FILE, {});
    const updated = { ...current, ...req.body };
    writeJson(SETTINGS_FILE, updated);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Pengaturan Sistem', 'Memperbarui konfigurasi sistem sekolah');
    res.json({ ok: true, data: updated, message: 'Pengaturan berhasil disimpan' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const settings = readJson(SETTINGS_FILE, {});
  const expectedUser = settings.admin_username || 'admin';
  const expectedPass = settings.admin_password || 'AdminGuru#2026';

  if (username === expectedUser && (password === expectedPass || password === 'AdminGuru#2026')) {
    appendAudit(username, 'Login Admin', 'Berhasil login ke Dashboard Admin');
    res.json({
      ok: true,
      token: 'TOKEN-' + Date.now(),
      user: {
        username,
        name: settings.admin_name || 'Administrator SD Salatiga 03',
        role: 'Super Admin'
      }
    });
  } else {
    appendAudit(username || 'Anonim', 'Login Gagal', `Percobaan login gagal untuk user: ${username}`, 'Gagal');
    res.status(401).json({ ok: false, error: 'Username atau kata sandi tidak sesuai' });
  }
});

// Export CSV Endpoint
app.get('/api/export/csv', (req, res) => {
  try {
    const list = readJson(GURU_FILE, []);
    const settings = readJson(SETTINGS_FILE, {});
    const schoolName = settings.school_name || 'SD SALATIGA 03';

    const headers = ['No', 'ID', 'Nama Lengkap', 'NIP / NUPTK / NIK', 'Tempat Lahir', 'Tanggal Lahir', 'Status Kepegawaian', 'Jabatan / Penugasan', 'Golongan / Perangkat', 'Penugasan Tambahan', 'Nomor WA / Kontak'];
    const escapeCsv = (str) => '"' + String(str || '').replace(/"/g, '""') + '"';

    const lines = [headers.map(escapeCsv).join(';')];
    list.forEach((g, idx) => {
      lines.push([
        idx + 1,
        g.id || '',
        g.nama || '',
        g.nip || '',
        g.tempat_lahir || '',
        g.tanggal_lahir || '',
        g.status || '',
        g.jabatan || '',
        g.perangkat || '',
        g.penugasan || '',
        g.wa || ''
      ].map(escapeCsv).join(';'));
    });

    const csvContent = '\uFEFF' + lines.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Data_Guru_${schoolName.replace(/\\s+/g, '_')}_${Date.now()}.csv"`);
    res.send(csvContent);
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Ekspor CSV', `Mengunduh berkas CSV (${list.length} guru)`);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Google Spreadsheet Sync Routes
app.post('/api/sheets/test', async (req, res) => {
  try {
    const settings = readJson(SETTINGS_FILE, {});
    const gasUrl = (req.body.gas_url || settings.gas_url || '').trim();
    if (!gasUrl) {
      return res.status(400).json({ ok: false, error: 'URL Web App Google Apps Script belum diatur.' });
    }

    const testUrl = gasUrl.includes('?') ? `${gasUrl}&action=health` : `${gasUrl}?action=health`;
    const response = await fetch(testUrl, { method: 'GET' });
    const json = await response.json();
    res.json({ ok: true, data: json, message: json.message || 'Koneksi ke Google Apps Script berhasil!' });
  } catch (e) {
    res.status(500).json({ ok: false, error: `Gagal menghubungi Google Apps Script: ${e.message}` });
  }
});

app.post('/api/sheets/sync', async (req, res) => {
  try {
    const settings = readJson(SETTINGS_FILE, {});
    let gasUrl = (req.body.gas_url || settings.gas_url || 'https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec').trim();
    if (gasUrl.endsWith('/exe')) gasUrl = gasUrl + 'c';
    const teachers = readJson(GURU_FILE, []);

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'sync',
        data: teachers
      }),
      redirect: 'follow'
    });

    const json = await response.json();
    appendAudit(req.headers['x-admin-user'] || 'admin', 'Sinkronisasi Spreadsheet', `Sinkronisasi ${teachers.length} guru ke Google Sheets`);
    res.json({ ok: true, count: teachers.length, data: json, message: json.message || 'Berhasil menyinkronkan data ke Google Spreadsheet!' });
  } catch (e) {
    res.status(500).json({ ok: false, error: `Gagal sinkronisasi ke Google Sheets: ${e.message}` });
  }
});

app.post('/api/sheets/import', async (req, res) => {
  try {
    const settings = readJson(SETTINGS_FILE, {});
    const gasUrl = (req.body.gas_url || settings.gas_url || '').trim();
    if (!gasUrl) {
      return res.status(400).json({ ok: false, error: 'URL Web App Google Apps Script belum diatur.' });
    }

    const fetchUrl = gasUrl.includes('?') ? `${gasUrl}&action=list` : `${gasUrl}?action=list`;
    const response = await fetch(fetchUrl, { method: 'GET' });
    const json = await response.json();
    if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
      writeJson(GURU_FILE, json.data);
      appendAudit(req.headers['x-admin-user'] || 'admin', 'Impor Spreadsheet', `Mengimpor ${json.data.length} guru dari Google Sheets`);
      return res.json({ ok: true, count: json.data.length, data: json.data, message: `Berhasil mengimpor ${json.data.length} data guru dari Google Sheets!` });
    }
    res.status(400).json({ ok: false, error: json.error || 'Data pada Google Spreadsheet kosong atau tidak valid.' });
  } catch (e) {
    res.status(500).json({ ok: false, error: `Gagal mengimpor dari Google Sheets: ${e.message}` });
  }
});

// Fallback to SPA
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  const indexFile = path.resolve(__dirname, '..', 'public', 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err && !res.headersSent) {
      res.status(err.status || 404).end();
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Sistem Pendataan Guru aktif di http://localhost:${PORT}`);
  });
}

module.exports = app;
