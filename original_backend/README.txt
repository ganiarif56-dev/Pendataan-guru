GURUDATA - BACKEND V1
======================

Backend menggunakan Google Apps Script + Google Spreadsheet.

Spreadsheet target:
https://docs.google.com/spreadsheets/d/1F9Tbfuny5QnSbE-YRH1Iu9huf_ACEzn1jaqSjbVsYzk/edit

Sheet:
Data Guru

Kolom:
No. | Nama | NIP | Tempat | Tanggal | Status | Jabatan | Perangkat | Kelas / Mapel


CARA MEMASANG
=============

1. Buka Google Spreadsheet sekolah.
2. Pilih Extensions > Apps Script.
3. Buat project baru.
4. Salin isi Code.gs dari paket ini ke editor Apps Script.
5. Jika memakai appsscript.json, aktifkan "Show manifest file" dan salin isinya.
6. GANTI CONFIG.ADMIN_KEY di Code.gs dengan kunci admin sendiri.
   Contoh: gunakan kombinasi huruf/angka yang panjang.
7. Klik Deploy > New deployment.
8. Pilih "Web app".
9. Execute as: Me.
10. Who has access: Anyone (atau sesuai kebijakan akun sekolah).
11. Deploy dan izinkan akses yang diminta Google.
12. Salin Web app URL. URL ini akan dipasang pada frontend.

ENDPOINT
========

GET:
?action=health
Untuk mengecek apakah backend aktif.

GET:
?action=list
Mengambil seluruh data guru.

POST:
{"action":"create","data":{...}}
Untuk guru menambah data.

POST:
{"action":"update","row":2,"adminKey":"KUNCI_ADMIN","data":{...}}
Untuk admin mengedit data.

POST:
{"action":"delete","row":2,"adminKey":"KUNCI_ADMIN"}
Untuk admin menghapus data.

CATATAN KEAMANAN
================
- Jangan membagikan ADMIN_KEY kepada guru.
- Untuk produksi, sebaiknya tambahkan autentikasi admin yang lebih kuat.
- Backend ini memvalidasi field wajib: Nama, Status, Jabatan, Kelas/Mapel.
- LockService digunakan agar pengisian bersamaan tidak mudah bertabrakan.

TAHAP BERIKUTNYA
================
Pasang URL Web App ke frontend:
window.GOOGLE_API_URL = 'URL_WEB_APP_APPS_SCRIPT';

Kemudian ubah fungsi simpan/edit/hapus pada frontend agar menggunakan fetch()
ke backend, bukan localStorage.
