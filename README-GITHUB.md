# SPMB SMK Islam Tanfirul Ghoyyi — GitHub Pages

Paket ini sudah disiapkan agar website otomatis dibuat dan dipublikasikan lewat GitHub Pages setiap kali Anda melakukan push ke branch `main`.

## Cara paling mudah

1. Buat repository baru di GitHub, misalnya `spmb-smk-islam-tanfirul-ghoyyi`.
2. Upload **semua isi folder ini** ke repository tersebut (jangan upload folder induknya).
3. Pastikan branch utama bernama `main`.
4. Buka **Settings → Pages** di repository.
5. Pada **Build and deployment**, pilih **Source: GitHub Actions**.
6. Buka tab **Actions** dan tunggu workflow **Deploy Website** selesai.
7. Website akan tersedia di:
   `https://USERNAME.github.io/NAMA-REPOSITORY/`

## Catatan Firebase / Google Login

Aplikasi ini memakai Firebase Authentication dan Google Drive. Setelah website online, jika Google Login belum bekerja, tambahkan domain GitHub Pages Anda pada Firebase Authentication → Settings → Authorized domains.

Untuk repository yang memakai GitHub Pages, file `firebase-applet-config.json` boleh berada di frontend karena konfigurasi Firebase Web bukan secret. Jangan pernah menaruh private key/service account key atau secret API server di repository.

## Build lokal

```bash
npm install
npm run build
```
