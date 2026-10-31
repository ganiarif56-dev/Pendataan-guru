/**
 * SISTEM PENDATAAN GURU SD SALATIGA 03 — Google Apps Script Backend (V2)
 * Terintegrasi Google Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E/edit
 *
 * Sheet: Data Guru & AuditLog
 */

const CONFIG = {
  SPREADSHEET_ID: '1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E',
  SHEET_NAME: 'Data Guru',
  AUDIT_SHEET: 'AuditLog',
  ADMIN_KEY: 'ADMIN_SD03_SALATIGA_2026'
};

function getSpreadsheet_() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

/**
 * 1. FUNGSI SETUP UTAMA
 * Jalankan fungsi ini untuk:
 * - Menargetkan Spreadsheet yang sedang Anda buka secara otomatis.
 * - Membuat header warna Navy resmi.
 * - Mengisi 22 data guru aktual SD Salatiga 03 lengkap dengan NIP & Jabatan.
 */
function setup() {
  const ss = getSpreadsheet_();
  
  // 1. Setup Sheet Data Guru
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  const defaultHeaders = [
    'No', 'ID', 'Nama Lengkap & Gelar', 'NIP / NUPTK / NIK', 'Tempat Lahir', 
    'Tanggal Lahir', 'Status Kepegawaian', 'Jabatan / Penugasan', 'Golongan / Perangkat', 'penugasan', 'Terakhir Diperbarui'
  ];
  
  // Bersihkan sheet jika ada sisa data lama
  sheet.clear();
  
  // Tulis Header & Styling Warna Navy
  const headerRange = sheet.getRange(1, 1, 1, defaultHeaders.length);
  headerRange.setValues([defaultHeaders]);
  headerRange.setBackground('#0B1B3D');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
  
  // Masukkan 23 Data Guru Aktual SD Salatiga 03
  const now = new Date().toISOString();
  const TEACHERS_SD03 = [
    [1, "GURU-001", "Arini Nuja Wahyudi", "196904242003121006", "Klaten", "1969-04-24", "PNS", "Kepala Sekolah", "III/d", "-", now],
    [2, "GURU-002", "Chatarina Venti Aprilia", "199204092020122001", "Salatiga", "1992-04-09", "PNS", "Guru Kelas 4B dan Kokurikuler", "III/a", "-", now],
    [3, "GURU-003", "Dian Framilu Ningtyas", "198704232019022004", "Grobogan", "1987-04-23", "PNS", "Guru PJOK Kelas 1-3 dan Kokurikuler", "III/b", "-", now],
    [4, "GURU-004", "Heri Susanto", "198503182010011010", "Demak", "1985-03-18", "PNS", "Guru PJOK Kelas 4-6 dan Kokurikuler", "III/c", "-", now],
    [5, "GURU-005", "KRISTIAN ARISTIYONO", "199509162020121004", "KLATEN", "1995-09-16", "PNS", "Guru Kelas 6B dan Kokurikuler", "III/a", "-", now],
    [6, "GURU-006", "Maqooshidul Falaasifah Syamsuddin", "199105062019022007", "Semarang", "1991-05-06", "PNS", "Guru Kelas 5A, KKA Kelas 6 dan Kokurikuler", "III/b", "-", now],
    [7, "GURU-007", "Mustofa Mualimin", "196902031999031005", "KAB. SEMARANG", "1969-02-03", "PNS", "Guru Kelas 6A dan Kokurikule", "III/c", "-", now],
    [8, "GURU-008", "RISMAWANTI PUTRI", "199406102020122002", "SALATIGA", "1994-06-10", "PNS", "Guru Kelas 5B dan Kokurikuler", "III/a", "-", now],
    [9, "GURU-009", "Sartono", "196708192003121003", "Sragen", "1967-08-19", "PNS", "Guru Kelas 5B dan Kokurikuler", "III/c", "-", now],
    [10, "GURU-010", "Tien Sutanti, S.pdi", "198104022010012013", "Kab. semarang", "1981-04-02", "PNS", "Guru PAIPB Kelas A dan Kokurikuler", "III/d", "-", now],
    [11, "GURU-011", "Tri Puji Lestari", "199205232020122006", "Kab. Semarang", "1992-05-23", "PNS", "Guru Kelas 1A dan Kokurikuler", "III/a", "-", now],
    [12, "GURU-012", "Amelia Fian Faulani", "198810042023212008", "Salatiga", "1988-10-04", "PPPK", "Guru Kelas 2A, Guru Bahasa Inggris Kelas 3-4", "IX", "-", now],
    [13, "GURU-013", "Carolina Anggraeni", "198010212022212001", "Salatiga", "1980-10-21", "PPPK", "Guru Kelas 4A dan Kokurikuler", "IX", "-", now],
    [14, "GURU-014", "DEBBY SANANDA MELODY", "199604182023212008", "SALATIGA", "1996-04-18", "PPPK", "Guru Kelas 2B dan Kokurikuler", "IX", "-", now],
    [15, "GURU-015", "DWI ATMOKO WIDHIHARTONO", "199311032024211018", "SALATIGA", "1993-11-03", "PPPK", "Guru PAKPB dan Kokurikuler", "IX", "-", now],
    [16, "GURU-016", "Pujiono", "198711122023211005", "Blora", "1987-11-12", "PPPK", "Guru Seni Budaya Kelas 3-6", "IX", "-", now],
    [17, "GURU-017", "Sandri Hapsari", "198307302023212005", "Salatiga", "1983-07-30", "PPPK", "Guru Kelas 3A, Guru Bahasa Inggris Kelas 5-6", "IX", "-", now],
    [18, "GURU-018", "Sekar Widyaningrum", "199105232022212001", "Salatiga", "1991-05-23", "PPPK", "Guru Kelas 1B dan Kokurikuler", "IX", "-", now],
    [19, "GURU-019", "Septine Dwi Ningsih Maryani", "199409032024212029", "Salatiga", "1994-09-03", "PPPK", "Guru PAIPB Kelas B dan Kokurikuler", "IX", "-", now],
    [20, "GURU-020", "Bekti Ariyani", "199603272025212048", "Kab. Semarang", "1996-03-27", "PPPK Paruh Waktu", "Guru Bahasa Jawa Kelas 2-6, KKA Kelas 5", "Paruh Waktu", "-", now],
    [21, "GURU-021", "Risang Purnomo", "9946754655130122", "Salatiga", "1976-06-14", "PPPK Paruh Waktu", "Tenaga Kependidikan", "Paruh Waktu", "-", now],
    [22, "GURU-022", "DEWI SANDRA AGUSTIN", "-", "KAB. SEMARANG", "1995-07-05", "PPPK Paruh Waktu", "Shadow Teacher", "Paruh Waktu", "-", now],
    [23, "GURU-023", "ghani", "1234567898765432", "salatiga", "2004-02-11", "PNS", "Kepala Sekolah", "III/A", "guru kelas 0", now]
  ];
  
  const dataRange = sheet.getRange(2, 1, TEACHERS_SD03.length, defaultHeaders.length);
  dataRange.setValues(TEACHERS_SD03);
  
  // Format rata tengah & NIP sebagai teks
  sheet.getRange(2, 1, TEACHERS_SD03.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 2, TEACHERS_SD03.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 4, TEACHERS_SD03.length, 1).setNumberFormat('@'); // NIP as Text agar angka 0 di depan tidak hilang
  sheet.getRange(2, 6, TEACHERS_SD03.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 7, TEACHERS_SD03.length, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 9, TEACHERS_SD03.length, 1).setHorizontalAlignment('center');
  
  // Garis batas tabel
  const fullTableRange = sheet.getRange(1, 1, TEACHERS_SD03.length + 1, defaultHeaders.length);
  fullTableRange.setBorder(true, true, true, true, true, true, '#CBD5E1', SpreadsheetApp.BorderStyle.SOLID);
  
  // 2. Setup Sheet AuditLog
  let auditSheet = ss.getSheetByName(CONFIG.AUDIT_SHEET);
  if (!auditSheet) {
    auditSheet = ss.insertSheet(CONFIG.AUDIT_SHEET);
  }
  const auditHeaders = ['Waktu', 'Pengguna', 'Aktivitas', 'Rincian', 'Status'];
  const auditRange = auditSheet.getRange(1, 1, 1, auditHeaders.length);
  auditRange.setValues([auditHeaders]);
  auditRange.setBackground('#1E293B');
  auditRange.setFontColor('#FFFFFF');
  auditRange.setFontWeight('bold');
  auditSheet.setFrozenRows(1);
  
  // Auto lebar kolom
  for (let c = 1; c <= defaultHeaders.length; c++) {
    sheet.autoResizeColumn(c);
  }
  
  Logger.log('✅ Setup berhasil! 23 Guru SD Salatiga 03 telah dimasukkan ke sheet.');
  try {
    SpreadsheetApp.getUi().alert('✅ Setup Berhasil!\n\nTabel 23 Guru SD Salatiga 03 telah dibuat lengkap dengan format Navy.');
  } catch (e) {}
  
  return 'Setup 23 Guru Berhasil';
}

/**
 * 2. MENU KHUSUS DI GOOGLE SPREADSHEET
 * Menambahkan menu kustom "📊 Pendataan Guru" di bilah menu Google Sheets.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📊 Pendataan Guru')
      .addItem('⚙️ Setup / Siapkan Sheet & Header', 'setup')
      .addItem('🔍 Tes Koneksi Spreadsheet', 'tesKoneksi')
      .addSeparator()
      .addItem('ℹ️ Panduan Singkat', 'tampilkanPanduan')
      .addToUi();
  } catch (e) {}
}

/**
 * 3. TES KONEKSI
 */
function tesKoneksi() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const msg = '✅ Spreadsheet Terhubung!\n\nNama Sheet: ' + sheet.getName() + '\nTotal Baris: ' + lastRow;
  Logger.log(msg);
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {}
  return msg;
}

/**
 * 4. PANDUAN PENGGUNAAN
 */
function tampilkanPanduan() {
  const msg = '📌 PANDUAN PENDATAAN GURU SD SALATIGA 03:\n\n' +
    '1. Data diisi melalui website Sistem Pendataan Guru (http://localhost:3300).\n' +
    '2. Seluruh data guru otomatis tersinkronisasi ke sheet "Data Guru".\n' +
    '3. Jangan mengubah/menghapus baris judul (Baris 1).\n' +
    '4. Sambungkan Web App URL dari menu Deploy ke menu Pengaturan di Website.';
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    Logger.log(msg);
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'health';

    if (action === 'health') {
      return jsonOut_({ ok: true, message: 'Backend Pendataan Guru SD Salatiga 03 Aktif & Siap.' });
    }

    if (action === 'list') {
      return jsonOut_({ ok: true, data: getAllTeachers_() });
    }

    if (action === 'columns') {
      return jsonOut_({ ok: true, data: getHeaders_() });
    }

    return jsonOut_({ ok: false, error: 'Aksi GET tidak dikenali.' });
  } catch (err) {
    return jsonOut_({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = parseBody_(e);
    const action = body.action;

    if (!action) {
      return jsonOut_({ ok: false, error: 'Parameter action wajib diisi.' });
    }

    switch (action) {
      case 'create':
        return jsonOut_(createTeacher_(body.data || {}));

      case 'update':
        return jsonOut_(updateTeacher_(body.row || body.id, body.data || {}));

      case 'delete':
        return jsonOut_(deleteTeacher_(body.row || body.id));

      case 'clear':
        return jsonOut_(clearAllTeachers_());

      case 'sync':
        return jsonOut_(syncTeachers_(body.data || [], body.columns || []));

      default:
        return jsonOut_({ ok: false, error: 'Aksi tidak dikenali: ' + action });
    }
  } catch (err) {
    return jsonOut_({ ok: false, error: err.message });
  }
}

function getSheet_(name) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(name || CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(name || CONFIG.SHEET_NAME);
  }
  return sheet;
}

function getHeaders_() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    const defaultHeaders = [
      'No', 'ID', 'Nama', 'NIP', 'Tempat Lahir', 'Tanggal Lahir',
      'Status', 'Jabatan', 'Perangkat', 'Terakhir Diperbarui'
    ];
    sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
    sheet.setFrozenRows(1);
    return defaultHeaders;
  }
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/**
 * Pemetaan cerdas dari Header Google Sheets ke Key Object Guru di Website
 */
function resolveItemValue_(item, headerLabel, columnsMap) {
  if (!item || typeof item !== 'object') return '';
  
  const raw = String(headerLabel || '').trim();
  const lower = raw.toLowerCase();
  const slug = lower.replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

  // 1. Cek pemetaan kamus dari kolom dinamis (columnsMap)
  if (columnsMap) {
    if (columnsMap[raw] && item[columnsMap[raw]] !== undefined) return item[columnsMap[raw]];
    if (columnsMap[lower] && item[columnsMap[lower]] !== undefined) return item[columnsMap[lower]];
    if (columnsMap[slug] && item[columnsMap[slug]] !== undefined) return item[columnsMap[slug]];
  }

  // 2. Cek kecocokan langsung key di item
  if (item[raw] !== undefined && item[raw] !== '') return item[raw];
  if (item[slug] !== undefined && item[slug] !== '') return item[slug];

  // 3. Aturan Cerdas untuk Kolom Bawaan Utama
  if (lower.indexOf('nama') !== -1) {
    return item.nama !== undefined ? item.nama : (item.name || '');
  }
  if (lower.indexOf('nip') !== -1 || lower.indexOf('nik') !== -1 || lower.indexOf('nuptk') !== -1) {
    return item.nip !== undefined ? item.nip : '';
  }
  if (lower.indexOf('tempat') !== -1) {
    return item.tempat_lahir !== undefined ? item.tempat_lahir : (item.tempat || '');
  }
  if (lower.indexOf('tanggal') !== -1 || lower.indexOf('tgl') !== -1) {
    return item.tanggal_lahir !== undefined ? item.tanggal_lahir : (item.tanggal || '');
  }
  if (lower.indexOf('status') !== -1) {
    return item.status !== undefined ? item.status : '';
  }
  if (lower.indexOf('jabatan') !== -1) {
    return item.jabatan !== undefined ? item.jabatan : '';
  }
  if (lower.indexOf('perangkat') !== -1 || lower.indexOf('golongan') !== -1) {
    return item.perangkat !== undefined ? item.perangkat : (item.golongan || '');
  }
  
  // 4. Cek key pada item jika ada yang cocok saat huruf kecil
  for (const k in item) {
    if (k.toLowerCase() === lower || k.toLowerCase() === slug) {
      return item[k];
    }
  }

  return '';
}

function getAllTeachers_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = getHeaders_();
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  return values.map(function(row, idx) {
    const obj = {};
    headers.forEach(function(h, cIdx) {
      const val = row[cIdx];
      const lower = String(h).trim().toLowerCase();
      const slug = lower.replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
      
      obj[slug] = val;
      obj[h] = val;

      if (lower.indexOf('nama') !== -1) obj.nama = val;
      if (lower.indexOf('nip') !== -1 || lower.indexOf('nik') !== -1 || lower.indexOf('nuptk') !== -1) obj.nip = String(val);
      if (lower.indexOf('tempat') !== -1) obj.tempat_lahir = val;
      if (lower.indexOf('tanggal') !== -1 || lower.indexOf('tgl') !== -1) obj.tanggal_lahir = val;
      if (lower.indexOf('status') !== -1) obj.status = val;
      if (lower.indexOf('jabatan') !== -1) obj.jabatan = val;
      if (lower.indexOf('perangkat') !== -1 || lower.indexOf('golongan') !== -1) obj.perangkat = val;
    });
    obj.row = idx + 2;
    if (!obj.id) obj.id = 'GURU-' + String(idx + 1).padStart(3, '0');
    return obj;
  }).filter(function(r) { return r.nama || r.nip; });
}

function createTeacher_(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();
    const headers = getHeaders_();
    const row = sheet.getLastRow() + 1;
    const no = row - 1;

    const rowData = headers.map(function(h) {
      const lowerH = String(h).trim().toLowerCase();
      if (lowerH === 'no') return no;
      if (lowerH === 'id') return data.id || ('GURU-' + String(no).padStart(3, '0'));
      if (lowerH === 'terakhir diperbarui' || lowerH === 'terakhir_diperbarui') {
        return new Date().toISOString();
      }
      return resolveItemValue_(data, h);
    });

    sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
    
    // Set format teks untuk kolom NIP agar angka 0 tidak hilang
    headers.forEach(function(h, colIdx) {
      const lower = String(h).toLowerCase();
      if (lower.indexOf('nip') !== -1 || lower.indexOf('nik') !== -1) {
        sheet.getRange(row, colIdx + 1, 1, 1).setNumberFormat('@');
      }
    });

    return { ok: true, message: 'Data guru berhasil ditambahkan ke Spreadsheet.', row: row };
  } finally {
    lock.releaseLock();
  }
}

function updateTeacher_(rowOrId, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();
    const headers = getHeaders_();
    let targetRow = Number(rowOrId);

    if (isNaN(targetRow) || targetRow < 2) {
      const values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < values.length; i++) {
        if (String(values[i][0]) === String(rowOrId)) {
          targetRow = i + 2;
          break;
        }
      }
    }

    if (!targetRow || targetRow > sheet.getLastRow()) {
      throw new Error('Baris data tidak ditemukan di Spreadsheet.');
    }

    const currentRow = sheet.getRange(targetRow, 1, 1, headers.length).getValues()[0];
    const updatedRow = headers.map(function(h, idx) {
      const lowerH = String(h).trim().toLowerCase();
      if (lowerH === 'no') return currentRow[idx];
      if (lowerH === 'id') return currentRow[idx];
      if (lowerH === 'terakhir diperbarui' || lowerH === 'terakhir_diperbarui') {
        return new Date().toISOString();
      }
      const val = resolveItemValue_(data, h);
      return val !== '' ? val : currentRow[idx];
    });

    sheet.getRange(targetRow, 1, 1, headers.length).setValues([updatedRow]);
    return { ok: true, message: 'Data guru berhasil diperbarui di Spreadsheet.', row: targetRow };
  } finally {
    lock.releaseLock();
  }
}

function deleteTeacher_(rowOrId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();
    let targetRow = Number(rowOrId);

    if (isNaN(targetRow) || targetRow < 2) {
      const values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < values.length; i++) {
        if (String(values[i][0]) === String(rowOrId)) {
          targetRow = i + 2;
          break;
        }
      }
    }

    if (!targetRow || targetRow > sheet.getLastRow()) {
      throw new Error('Baris data tidak ditemukan untuk dihapus.');
    }

    sheet.deleteRow(targetRow);
    return { ok: true, message: 'Data guru berhasil dihapus dari Spreadsheet.' };
  } finally {
    lock.releaseLock();
  }
}

function clearAllTeachers_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();
    if (sheet.getLastRow() > 1) {
      const numRows = sheet.getLastRow() - 1;
      const numCols = sheet.getLastColumn() || 11;
      sheet.getRange(2, 1, numRows, numCols).clearContent();
      sheet.getRange(2, 1, numRows, numCols).clearFormat();
    }
    return { ok: true, message: 'Seluruh data guru di Spreadsheet berhasil dikosongkan.' };
  } finally {
    lock.releaseLock();
  }
}

function syncTeachers_(list, columns) {
  if (!Array.isArray(list)) {
    return { ok: false, error: 'Format data sinkronisasi tidak valid.' };
  }
  if (list.length === 0) {
    return clearAllTeachers_();
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const sheet = getSheet_();
    
    // Bangun kamus kolom (columnsMap) dari struktur kolom dinamis
    const columnsMap = {};
    if (Array.isArray(columns) && columns.length > 0) {
      columns.forEach(function(c) {
        if (typeof c === 'object' && c.id && c.label) {
          columnsMap[c.label] = c.id;
          columnsMap[c.label.toLowerCase()] = c.id;
          columnsMap[c.label.toLowerCase().replace(/[^a-z0-9]/g, '_')] = c.id;
          columnsMap[c.id] = c.id;
        }
      });
      
      // Update header kolom di Baris 1
      const colLabels = columns.map(function(c) { 
        return typeof c === 'object' ? (c.label || c.id) : c; 
      });
      const newHeaders = ['No', 'ID'].concat(colLabels).concat(['Terakhir Diperbarui']);
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
      
      // Styling Header Warna Navy
      const headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
      headerRange.setBackground('#0B1B3D');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
      sheet.setRowHeight(1, 32);
      sheet.setFrozenRows(1);
    }

    const headers = getHeaders_();
    
    // Bersihkan data lama di bawah baris judul
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }

    const rows = list.map(function(item, idx) {
      return headers.map(function(h) {
        const lowerH = String(h).trim().toLowerCase();
        if (lowerH === 'no') return idx + 1;
        if (lowerH === 'id') return item.id || ('GURU-' + String(idx + 1).padStart(3, '0'));
        if (lowerH === 'terakhir diperbarui' || lowerH === 'terakhir_diperbarui') {
          return item.updated_at || item.created_at || new Date().toISOString();
        }
        return resolveItemValue_(item, h, columnsMap);
      });
    });

    if (rows.length > 0) {
      const dataRange = sheet.getRange(2, 1, rows.length, headers.length);
      dataRange.setValues(rows);
      
      // Format text untuk kolom NIP agar angka 0 tidak terpotong
      headers.forEach(function(h, colIdx) {
        const lower = String(h).toLowerCase();
        if (lower.indexOf('nip') !== -1 || lower.indexOf('nik') !== -1) {
          sheet.getRange(2, colIdx + 1, rows.length, 1).setNumberFormat('@');
        }
      });
      
      // Garis border tabel rapi
      const fullRange = sheet.getRange(1, 1, rows.length + 1, headers.length);
      fullRange.setBorder(true, true, true, true, true, true, '#CBD5E1', SpreadsheetApp.BorderStyle.SOLID);
    }

    // Auto-lebar kolom
    for (let c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
    }

    return { ok: true, message: 'Sinkronisasi berhasil: ' + rows.length + ' data tersimpan di Spreadsheet.' };
  } finally {
    lock.releaseLock();
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return e.parameter || {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return e.parameter || {};
  }
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}