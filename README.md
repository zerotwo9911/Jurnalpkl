# JURNAL PKL — Next.js + PostgreSQL + Vercel

Aplikasi jurnal PKL full-stack berbasis Next.js App Router, TypeScript, Prisma ORM, PostgreSQL, dan session JWT HTTP-only cookie.

## Stack
- Next.js + React + TypeScript
- Prisma ORM
- PostgreSQL
- Vercel
- JWT session via HTTP-only cookie
- bcrypt password hashing
- Zod validation
- Responsive dark futuristic UI

## Data pengguna yang disimpan
- username
- nama
- password (hash)
- kelas
- jurusan
- sekolah
- tempat_pkl
- pembimbing
- role
- field teknis: id, created_at, updated_at

Tidak ada modul absensi, check-in, check-out, tabel attendance, PDF, atau PDF export.

## 1. Upload ke GitHub dari HP
1. Buat repository baru di GitHub, misalnya `jurnal-pkl`.
2. Upload seluruh isi folder project ini. Jangan upload `.env`.
3. Pastikan `package.json`, `prisma/schema.prisma`, dan `prisma/migrations/` ikut ter-upload.

## 2. Buat PostgreSQL
Pilihan yang paling praktis untuk Vercel adalah PostgreSQL melalui Vercel Marketplace. Prisma Postgres dapat terhubung ke project Vercel dan menyediakan `DATABASE_URL` secara otomatis. Alternatif PostgreSQL cloud lain juga bisa dipakai selama memberikan connection string PostgreSQL yang kompatibel.

## 3. Deploy ke Vercel
1. Masuk Vercel dan pilih **Add New → Project**.
2. Import repository GitHub `jurnal-pkl`.
3. Framework Preset: **Next.js**.
4. Hubungkan PostgreSQL melalui Vercel Marketplace atau masukkan `DATABASE_URL` sendiri.
5. Tambahkan environment variable:
   - `DATABASE_URL`
   - `AUTH_SECRET`
6. Deploy.

Build project menggunakan:

```bash
npm run build
```

Script build menjalankan:

```bash
prisma migrate deploy && next build
```

Jadi migration yang ada di `prisma/migrations/` diterapkan sebelum Next.js dibuild.

## 4. Seed akun demo
Seed tidak dijalankan otomatis oleh Vercel agar deployment produksi tidak membuat akun demo secara diam-diam.

Jika ingin membuat akun demo pada database yang kamu kontrol:

```bash
npm install
npm run db:seed
```

Akun demo:

- Admin: `admin` / `12345678`
- Pembimbing: `pembimbing01` / `12345678`
- Siswa: `siswa01` / `12345678`

Ganti password demo sebelum aplikasi dipakai sungguhan.

## Environment variables

`.env.example` hanya contoh. Untuk Vercel, isi variable di **Project Settings → Environment Variables**. Jangan commit `.env` ke GitHub.

## Local development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`.

## Catatan produksi
- Migration production menggunakan `prisma migrate deploy`, bukan `db push`.
- `prisma generate` juga dijalankan melalui `postinstall`.
- `prisma` tersedia sebagai dependency production karena dibutuhkan saat build/migration Vercel.
