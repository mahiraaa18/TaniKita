# TaniKita - Cara Menjalankan di VS Code

## 1. Siapkan komputer
- Pasang Node.js: https://nodejs.org (versi LTS)
- Pasang VS Code: https://code.visualstudio.com

## 2. Buka proyek
1. Klik kanan file zip ini, pilih **Extract All** (atau解压) sampai folder `TaniKita` terlihat.
2. Buka VS Code, lalu menu **File > Open Folder**, pilih folder `TaniKita`.

## 3. Pasang perlengkapannya
Buka terminal di VS Code (menu **Terminal > New Terminal**), lalu ketik:

```sh
npm install
npm run dev
```

Setelah itu buka alamat yang muncul di terminal, biasanya http://localhost:8080

## 4. Data & akun
- File `.env` di dalam folder ini sudah berisi alamat server dan kunci publik proyek, jadi aplikasi langsung tersambung ke database online TaniKita.
- Daftar akun lewat halaman **Daftar**, lalu masuk dengan email + kata sandi atau akun Google.
- Data tiap petani terpisah, tersimpan di server, jadi tetap ada walau folder dihapus.

## 5. Kalau ingin memindahkan ke server sendiri
- Ganti isi `.env` dengan alamat server dan kunci milik sendiri.
- Jalankan ulang `npm install` lalu `npm run dev`.

## Susunan folder
- `src/routes` - isi tiap halaman (dashboard, kebun, jadwal, stok, penjualan, keuangan, laporan)
- `src/routes/auth.tsx` - halaman masuk & daftar
- `src/components` - bagian tampilan yang dipakai bersama (menu kiri, tabel data)
- `src/lib/store.ts` - data, hitungan untung-rugi, dan cara simpan ke server
- `src/integrations/supabase` - hubungan ke database & login
- `drizzle` - aturan tabel database
- `supabase/config.toml` - pengaturan server
