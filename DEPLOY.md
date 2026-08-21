# 🚀 Deploy CVForge ke Vercel (Full-Stack)

## Arsitektur di Vercel
```
┌───────────────────────────────────┐
│            VERCEL                 │
│  ┌──────────┐  ┌──────────────┐  │
│  │ Frontend │  │  Backend API │  │
│  │ (Static) │  │ (Serverless) │  │
│  │ Vue.js   │  │ Express.js   │  │
│  └──────────┘  └──────────────┘  │
│       ↓              ↓           │
│   CDN Global    Serverless Fn    │
└───────────────────────────────────┘
```

---

## Prasyarat
- Akun GitHub (gratis)
- Akun Vercel (gratis, daftar pakai GitHub)
- Node.js 18+ terinstall

---

## Cara Deploy

### Step 1: Push ke GitHub
```bash
cd cvforge
git init
git add .
git commit -m "CVForge - SaaS CV Builder & ATS Checker"
git remote add origin https://github.com/YOUR_USERNAME/cvforge.git
git push -u origin main
```

### Step 2: Deploy ke Vercel
1. Buka **https://vercel.com**
2. Sign Up pakai akun GitHub
3. Klik **"Add New..."** → **"Project"**
4. Pilih repository `cvforge`
5. Isi settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (root)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
6. Klik **"Deploy"**
7. Tunggu deploy selesai (~2-3 menit)
8. **Done!** Vercel akan kasih URL (contoh: `https://cvforge-xxx.vercel.app`)

### Step 3: Login
Buka URL Vercel kamu:
```
https://cvforge-xxx.vercel.app
```

Login:
- **Email:** digo@demo.com
- **Password:** password123

---

## ⚠️ Catatan Penting

### Data Storage
- Vercel pakai **serverless functions** yang filesystem-nya **ephemeral** (hilang setiap cold start)
- Data demo (users, CVs) akan di-**seed otomatis** setiap cold start
- Untuk production, gunakan database seperti **PostgreSQL** atau **MongoDB**

### Serverless Cold Start
- Setelah 15-30 menit tidak ada request, server sleep
- Request pertama butuh ~2-5 detik (cold start)
- Setelah itu, response sangat cepat

### Free Tier Limits
- **Bandwidth:** 100GB/bulan
- **Serverless Exec:** 100 jam/bulan
- **Build:** 6000 menit/bulan
- Cukup untuk demo dan portfolio!

---

## Troubleshooting

### "Application Error" di Vercel
- Cek build logs di Vercel dashboard
- Pastikan Node.js version >= 18

### "CORS Error" di browser
- Bukan masalah di Vercel (satu domain)

### Data hilang saat refresh
- Normal di Vercel (cold start reset)
- Data demo akan di-seed ulang otomatis

### PDF Download gagal
- PDF generation butuh Chrome (puppeteer)
- Tidak tersedia di Vercel serverless
- Fitur lain tetap berfungsi

---

## File Structure untuk Vercel
```
cvforge/
├── api/
│   └── index.js          ← Serverless function (Express backend)
├── backend/
│   ├── src/              ← Source code backend
│   └── data/             ← JSON data (seed data)
├── frontend/
│   ├── dist/             ← Build output (auto-generated)
│   └── src/              ← Source code Vue.js
├── vercel.json           ← Vercel routing config
└── package.json          ← Root package.json
```

---

## Update Code & Redeploy
```bash
# Edit code, lalu push
git add .
git commit -m "Update fitur"
git push

# Vercel auto-deploy dari GitHub!
```
