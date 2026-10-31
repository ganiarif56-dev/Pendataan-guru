GURU DATA - FRONTEND V2

Fitur:
- Dashboard Admin
- Daftar Data Guru
- Tambah data
- Edit data oleh admin
- Hapus data
- Pencarian nama/NIP
- Download CSV
- Download Excel (.xls, kompatibel dengan Excel/Google Sheets)
- Tombol menuju Google Spreadsheet
- Form Guru
- Panduan penggunaan

PENTING:
Versi ini masih frontend/demo. Data tersimpan di localStorage browser.
Agar semua guru mengisi melalui satu link dan data masuk ke Google Spreadsheet,
tahap berikutnya adalah membuat backend Google Apps Script.

URL Google Spreadsheet sementara dapat diubah di index.html pada:
window.GOOGLE_SHEET_URL

Setelah backend dibuat, fungsi tambah/edit/hapus dan sinkronisasi spreadsheet
akan diarahkan ke API Google Apps Script.
