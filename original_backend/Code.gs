/**
 * GURU DATA - Google Apps Script Backend
 * Backend untuk aplikasi administrasi data guru.
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1F9Tbfuny5QnSbE-YRH1Iu9huf_ACEzn1jaqSjbVsYzk/edit
 *
 * Sheet yang digunakan: Data Guru
 *
 * Kolom:
 * No. | Nama | NIP | Tempat | Tanggal | Status | Jabatan | Perangkat | Kelas / Mapel
 */

const CONFIG = {
  SPREADSHEET_ID: '1F9Tbfuny5QnSbE-YRH1Iu9huf_ACEzn1jaqSjbVsYzk',
  SHEET_NAME: 'Data Guru',
  // GANTI nilai ini sebelum deployment.
  ADMIN_KEY: 'GANTI_DENGAN_KUNCI_ADMIN_YANG_KUAT'
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'health';

    if (action === 'health') {
      return json_({ ok: true, message: 'GuruData backend aktif.' });
    }

    if (action === 'list') {
      return json_({ ok: true, data: getAllTeachers_() });
    }

    return json_({ ok: false, error: 'Action GET tidak dikenal.' });
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = parseBody_(e);
    const action = body.action;

    if (!action) {
      return json_({ ok: false, error: 'Action wajib diisi.' });
    }

    switch (action) {
      case 'create':
        return json_(createTeacher_(body.data || {}));

      case 'update':
        requireAdmin_(body.adminKey);
        return json_(updateTeacher_(body.row, body.data || {}));

      case 'delete':
        requireAdmin_(body.adminKey);
        return json_(deleteTeacher_(body.row));

      default:
        return json_({ ok: false, error: 'Action tidak dikenal.' });
    }
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  const headers = [
    'No.', 'Nama', 'NIP', 'Tempat', 'Tanggal',
    'Status', 'Jabatan', 'Perangkat', 'Kelas / Mapel'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getAllTeachers_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 9).getValues();

  return values
    .map(function(row, i) {
      return {
        row: i + 2,
        no: row[0],
        nama: row[1],
        nip: row[2],
        tempat: row[3],
        tanggal: formatDate_(row[4]),
        status: row[5],
        jabatan: row[6],
        perangkat: row[7],
        kelas: row[8]
      };
    })
    .filter(function(item) {
      return item.nama || item.nip || item.jabatan || item.kelas;
    });
}

function createTeacher_(data) {
  validateTeacher_(data);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const sheet = getSheet_();
    const row = sheet.getLastRow() + 1;
    const no = nextNumber_(sheet);

    sheet.getRange(row, 1, 1, 9).setValues([[
      no,
      clean_(data.nama),
      clean_(data.nip),
      clean_(data.tempat),
      parseDate_(data.tanggal),
      clean_(data.status),
      clean_(data.jabatan),
      clean_(data.perangkat),
      clean_(data.kelas)
    ]]);

    return {
      ok: true,
      message: 'Data guru berhasil disimpan.',
      row: row,
      data: {
        row: row,
        no: no,
        nama: clean_(data.nama),
        nip: clean_(data.nip),
        tempat: clean_(data.tempat),
        tanggal: clean_(data.tanggal),
        status: clean_(data.status),
        jabatan: clean_(data.jabatan),
        perangkat: clean_(data.perangkat),
        kelas: clean_(data.kelas)
      }
    };
  } finally {
    lock.releaseLock();
  }
}

function updateTeacher_(row, data) {
  requireValidRow_(row);
  validateTeacher_(data);

  const sheet = getSheet_();
  const rowNumber = Number(row);

  if (rowNumber > sheet.getLastRow()) {
    throw new Error('Baris data tidak ditemukan.');
  }

  const oldNo = sheet.getRange(rowNumber, 1).getValue();

  sheet.getRange(rowNumber, 1, 1, 9).setValues([[
    oldNo,
    clean_(data.nama),
    clean_(data.nip),
    clean_(data.tempat),
    parseDate_(data.tanggal),
    clean_(data.status),
    clean_(data.jabatan),
    clean_(data.perangkat),
    clean_(data.kelas)
  ]]);

  return { ok: true, message: 'Data guru berhasil diperbarui.', row: rowNumber };
}

function deleteTeacher_(row) {
  requireValidRow_(row);

  const sheet = getSheet_();
  const rowNumber = Number(row);

  if (rowNumber > sheet.getLastRow()) {
    throw new Error('Baris data tidak ditemukan.');
  }

  sheet.deleteRow(rowNumber);
  renumber_(sheet);

  return { ok: true, message: 'Data guru berhasil dihapus.' };
}

function requireAdmin_(key) {
  if (!key || key !== CONFIG.ADMIN_KEY) {
    throw new Error('Akses admin ditolak.');
  }
}

function validateTeacher_(data) {
  if (!clean_(data.nama)) throw new Error('Nama wajib diisi.');
  if (!clean_(data.status)) throw new Error('Status wajib diisi.');
  if (!clean_(data.jabatan)) throw new Error('Jabatan wajib diisi.');
  if (!clean_(data.kelas)) throw new Error('Kelas / Mapel wajib diisi.');
}

function requireValidRow_(row) {
  if (!row || isNaN(Number(row)) || Number(row) < 2) {
    throw new Error('Nomor baris tidak valid.');
  }
}

function nextNumber_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
    .map(function(r) { return Number(r[0]); })
    .filter(function(n) { return !isNaN(n) && n > 0; });

  return values.length ? Math.max.apply(null, values) + 1 : 1;
}

function renumber_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const nums = [];
  for (let i = 0; i < lastRow - 1; i++) nums.push([i + 1]);
  sheet.getRange(2, 1, nums.length, 1).setValues(nums);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Body request kosong.');
  }

  const raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Fallback jika dikirim sebagai form-urlencoded.
    return e.parameter || {};
  }
}

function parseDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') return value;

  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d;
}

function formatDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) !== '[object Date]') return String(value);

  return Utilities.formatDate(
    value,
    Session.getScriptTimeZone() || 'Asia/Jakarta',
    'yyyy-MM-dd'
  );
}

function clean_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
