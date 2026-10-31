# 🏫 SISTEM PENDATAAN GURU — SD SALATIGA 03
### Desain Profesional Minimalis (Navy–Putih) • TA 2026/2027

Aplikasi web modern, formal, dan komprehensif untuk pendataan, manajemen profil, verifikasi, dan pelaporan tenaga pendidik SD Salatiga 03. Sistem ini terintegrasi langsung dengan **Google Sheets & Google Apps Script**, mendukung **Manajemen Kolom Dinamis**, ekspor resmi **Microsoft Word (.docx)**, **Excel (.xlsx)**, **CSV (UTF-8 BOM)**, serta memiliki **Mode Gelap dan Terang**.

---

## 🌟 Identitas Visual & Desain UI

- **Nuansa Utama**: *Deep Navy* (`#0B1B3D`), *Clean White* (`#FFFFFF`), dan *Light Slate Gray* (`#F8FAFC`).
- **Aksen Interaktif**: *Royal Blue* (`#2563EB`) untuk tombol aksi primer, tautan aktif, dan fokus kontrol.
- **Tipografi**: Font modern `Plus Jakarta Sans` dengan hierarki tipografi administrasi yang jelas dan rapi.
- **Kartu & Panel**: Sudut membulat lembut (*border-radius: 12px*) dengan bayangan halus (*soft shadow*) tanpa dekorasi berlebihan.
- **Notifikasi**: Sistem toast mengambang yang responsif dan jelas saat data berhasil disimpan atau gagal.
- **Mode Gelap & Terang**: Tombol saklar di bilah atas (*topbar*) dengan penyimpanan preferensi di browser (`localStorage`).

---

## 🚀 Fitur Utama Sistem

### 1. 🌐 Portal Publik (Halaman Utama)
- Header identitas resmi dengan logo SD Salatiga 03.
- Judul: **“Sistem Pendataan Guru”** SD Salatiga 03.
- Deskripsi singkat mengenai sistem pendataan tenaga pendidik terpadu.
- Kartu aksi cepat:
  - `[Lihat Data Guru]`: Menampilkan direktori guru publik dengan perlindungan privasi NIP.
  - `[Isi / Perbarui Data Saya]`: Formulir pengisian mandiri oleh guru dengan dukungan opsi “Lainnya”.
  - `[Masuk Admin]`: Portal login modal untuk pengelola data sekolah.
- Ringkasan statistik kilat: Total Guru (22), Guru PNS (11), Guru PPPK (8), dan Paruh Waktu/Tendik (3).

### 2. 🛡️ Dashboard Admin (9 Menu Navigasi)
Sidebar kiri tetap (*fixed*) dan responsif di HP (dengan tombol menu *hamburger* & *drawer*):
1. **Dashboard**: Ringkasan total guru aktual, metrik kepegawaian, grafik visual SVG/Canvas komposisi status & jabatan, serta tabel 5 data guru terbaru.
2. **Data Guru**: Tabel master data guru lengkap dengan pencarian *real-time* Nama/NIP, filter status, filter jabatan, pagination fleksibel (10, 25, 50, Semua), tombol Detail, Edit, Hapus (dengan konfirmasi), serta tombol unduh cepat Word, Excel, dan CSV.
3. **Tambah Data Guru**: Formulir berstruktur rapi yang memuat kolom bawaan (Nama, NIP, Tempat Lahir, Tanggal Lahir, Status, Jabatan, Perangkat) dan otomatis beradaptasi dengan kolom baru dari Manajemen Kolom. Dropdown memiliki opsi *“Lainnya”* untuk mengetik pilihan sendiri.
4. **Manajemen Kolom**: Admin dapat menambah kolom baru, menentukan jenis input (Teks, Angka, Tanggal, Pilihan Dropdown), mengatur status wajib/opsional, mengubah urutan (naik/turun), serta menghapus kolom dengan konfirmasi aman tanpa menghilangkan data guru yang sudah tersimpan.
5. **Impor dan Ekspor**:
   - **Word (.docx/.doc)**: Dokumen formal lengkap dengan Kop Surat resmi SD Salatiga 03, judul laporan, tabel terformat, kolom dinamis, dan tanda tangan kepala sekolah.
   - **Excel (.xlsx)**: File spreadsheet dengan *SheetJS*, header tebal, format sel rapi, dan auto-lebar kolom.
   - **CSV (.csv)**: Standar UTF-8 with BOM (`\uFEFF`) dengan pemisah titik-koma (`;`) sehingga langsung terbuka rapi di Microsoft Excel versi Indonesia/Windows.
   - **Impor Berkas**: Unggah file CSV atau Excel dengan pratinjau tabel dan deteksi duplikat sebelum disimpan.
6. **Statistik**: Grafik dan rincian persentase distribusi status kepegawaian (PNS, PPPK, Paruh Waktu) dan rincian pangkat/golongan.
7. **Audit Log**: Pencatatan riwayat setiap tindakan admin (Login, Tambah Guru, Edit, Hapus, Perubahan Kolom, Ekspor, Sinkronisasi) dengan fitur unduh log.
8. **Pengaturan**: Konfigurasi identitas sekolah (Nama Sekolah, NPSN, Alamat), integrasi Google Sheets (Spreadsheet ID & Web App URL), uji koneksi, dan ubah kata sandi admin.
9. **Logout**: Keluar dari sesi pengelola dengan aman.

---

## 🔑 Kredensial Login Admin

| Parameter | Nilai Bawaan |
|---|---|
| **Username** | `admin` |
| **Kata Sandi** | `AdminGuru#2026` |
| **Hak Akses** | Super Admin SD Salatiga 03 |

> *Kata sandi dapat diubah sewaktu-waktu melalui menu **Pengaturan** di Dashboard Admin.*

---

## 📊 Dataset Aktual Guru (22 Guru SD Salatiga 03)

Sistem ini langsung memuat **22 data guru aktual** yang diekstrak dari arsip resmi sekolah:
1. **Arini Nuja Wahyudi** (NIP. 196904242003121006) — PNS • Kepala Sekolah • Gol. III/d
2. **Chatarina Venti Aprilia** (NIP. 199204092020122001) — PNS • Guru Kelas 4B dan Kokurikuler • Gol. III/a
3. **Dian Framilu Ningtyas** (NIP. 198704232019022004) — PNS • Guru PJOK Kelas 1-3 dan Kokurikuler • Gol. III/b
4. **Heri Susanto** (NIP. 198503182010011010) — PNS • Guru PJOK Kelas 4-6 dan Kokurikuler • Gol. III/c
5. **KRISTIAN ARISTIYONO** (NIP. 199509162020121004) — PNS • Guru Kelas 6B dan Kokurikuler • Gol. III/a
6. **Maqooshidul Falaasifah Syamsuddin** (NIP. 199105062019022007) — PNS • Guru Kelas 5A • Gol. III/b
7. **Mustofa Mualimin** (NIP. 196902031999031005) — PNS • Guru Kelas 6A • Gol. III/c
8. **RISMAWANTI PUTRI** (NIP. 199406102020122002) — PNS • Guru Kelas 5B • Gol. III/a
9. **Sartono** (NIP. 196708192003121003) — PNS • Guru Kelas 5B • Gol. III/c
10. **Tien Sutanti, S.pdi** (NIP. 198104022010012013) — PNS • Guru PAIPB Kelas A • Gol. III/d
11. **Tri Puji Lestari** (NIP. 199205232020122006) — PNS • Guru Kelas 1A • Gol. III/a
12. **Amelia Fian Faulani** (NIP. 198810042023212008) — PPPK • Guru Kelas 2A & B. Inggris • Gol. IX
13. **Carolina Anggraeni** (NIP. 198010212022212001) — PPPK • Guru Kelas 4A • Gol. IX
14. **DEBBY SANANDA MELODY** (NIP. 199604182023212008) — PPPK • Guru Kelas 2B • Gol. IX
15. **DWI ATMOKO WIDHIHARTONO** (NIP. 199311032024211018) — PPPK • Guru PAKPB • Gol. IX
16. **Pujiono** (NIP. 198711122023211005) — PPPK • Guru Seni Budaya Kelas 3-6 • Gol. IX
17. **Sandri Hapsari** (NIP. 198307302023212005) — PPPK • Guru Kelas 3A & B. Inggris • Gol. IX
18. **Sekar Widyaningrum** (NIP. 199105232022212001) — PPPK • Guru Kelas 1B • Gol. IX
19. **Septine Dwi Ningsih Maryani** (NIP. 199409032024212029) — PPPK • Guru PAIPB Kelas B • Gol. IX
20. **Bekti Ariyani** (NIP. 199603272025212048) — PPPK Paruh Waktu • Guru Bahasa Jawa & KKA
21. **Risang Purnomo** (NIP. 9946754655130122) — PPPK Paruh Waktu • Tenaga Kependidikan
22. **DEWI SANDRA AGUSTIN** — PPPK Paruh Waktu • Shadow Teacher

---

## 💻 Cara Menjalankan Aplikasi

### Opsi A — Peluncur 1-Klik Windows (Paling Mudah)
Cukup klik ganda (*double click*) pada file:
👉 **`jalankan.bat`**
Browser default Anda akan otomatis membuka: `http://localhost:3300`.

### Opsi B — Melalui Terminal Node.js
```bash
npm start
```
Aplikasi akan aktif di `http://localhost:3300`.

### Opsi C — Mode Standalone (Tanpa Node.js)
Buka langsung file **`public/index.html`** di browser Chrome, Edge, atau Firefox. Seluruh fitur penyimpanan offline, export dokumen, dan sinkronisasi Google Sheets tetap berjalan 100% menggunakan browser storage!

---

## ☁️ Integrasi Google Spreadsheet & Cloud Backend

Sistem terhubung secara otomatis dan real-time ke Google Spreadsheet & Google Apps Script resmi SD Salatiga 03:
- **Google Spreadsheet**: [Buka Spreadsheet SD Salatiga 03](https://docs.google.com/spreadsheets/d/1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E/edit?usp=sharing)
- **Spreadsheet ID**: `1ta97_la7fFTWaZW54qu3GzA0QM0WlyWjcsm4fI6Jz8E`
- **Sheet Target**: `Data Guru`
- **Apps Script Web App**: `https://script.google.com/macros/s/AKfycbwadRyR_Sq6laDy0-M-sokyMeXW26X5rvvGexAPDRPSiI6RFO2O9KKThmEYbfjwLShv/exec`

Setiap pengisian, pembaruan, maupun penghapusan data guru di website otomatis tersinkronisasi langsung ke Google Spreadsheet tanpa perlu klik tombol manual.

---

## ⚡ Deployment ke Vercel

Proyek ini telah dikonfigurasi dengan `vercel.json` dan `api/index.js` untuk serverless deployment:
1. Hubungkan repositori GitHub ini (`https://github.com/ganiarif56-dev/Pendataan-guru`) ke [Vercel](https://vercel.com).
2. Klik **Import** lalu **Deploy**.
3. Aplikasi web akan langsung aktif di domain Vercel gratis dengan koneksi HTTPS cepat.

---

## 👨‍💻 Pengembang
Dikembangkan oleh: **Ghani Arif Fadhillah**  
*Sistem Informasi & Pendataan Guru SD SALATIGA 03 — TA 2026/2027*