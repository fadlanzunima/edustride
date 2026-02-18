# Supabase Setup Guide

Panduan lengkap untuk setup PostgreSQL database dengan Supabase di EduStride.

## Daftar Isi

1. [Buat Project Supabase](#buat-project-supabase)
2. [Dapatkan Connection String](#dapatkan-connection-string)
3. [Konfigurasi Prisma](#konfigurasi-prisma)
4. [Run Migration](#run-migration)
5. [Konfigurasi Row Level Security (RLS)](#konfigurasi-row-level-security-rls)
6. [Connection Pooling (PgBouncer)](#connection-pooling-pgbouncer)

---

## Buat Project Supabase

### Step 1: Daftar/Login ke Supabase

1. Buka https://supabase.com
2. Klik **Start your project** atau **Sign In**
3. Login dengan GitHub atau email

### Step 2: Buat Organisasi Baru

1. Klik dropdown di top left → **New organization**
2. Isi **Name**: `EduStride` (atau nama tim Anda)
3. Pilih **Plan**: Free tier (cukup untuk development)
4. Klik **Create organization**

### Step 3: Buat Project Baru

1. Di dashboard organisasi, klik **New project**
2. Pilih organisasi yang baru dibuat
3. Isi detail project:
   - **Name**: `edustride`
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Pilih yang terdekat (Singapore untuk Indonesia)
   - **Pricing Plan**: Free tier
4. Klik **Create new project**
5. Tunggu 1-2 menit sampai project siap

---

## Dapatkan Connection String

### Connection String untuk Prisma

1. Di dashboard project, klik **Settings** (icon gear di sidebar)
2. Klik **Database**
3. Scroll ke bagian **Connection string**
4. Pilih tab **URI**
5. Copy connection string, akan terlihat seperti:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **Ganti `[YOUR-PASSWORD]` dengan password database Anda**

### Connection Pooling (Untuk Production/Serverless)

Untuk environment serverless (Vercel, Netlify, dll), gunakan connection pooling:

1. Di **Database** settings, scroll ke **Connection pooling**
2. Pilih tab **Transaction mode**
3. Copy connection string, akan terlihat seperti:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

---

## Konfigurasi Prisma

### Step 1: Update Environment Variables

Buat atau update file `.env.local` di root project:

```bash
# Supabase Database - Transaction Mode (dengan PgBouncer)
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL untuk migrations (tanpa PgBouncer)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

> **Catatan**: Ganti `[PASSWORD]` dan `[PROJECT-REF]` dengan nilai dari Supabase dashboard.

### Step 2: Update prisma.config.ts

File sudah terkonfigurasi, tapi pastikan seperti ini:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
```

### Step 3: Install Dependencies

Pastikan sudah install:

```bash
npm install @prisma/client pg
npm install -D prisma
```

---

## Run Migration

### Step 1: Generate Prisma Client

```bash
npx prisma generate
```

### Step 2: Push Schema ke Database

Untuk development (tidak membuat migration files):

```bash
npx prisma db push
```

Untuk production (dengan migration files):

```bash
npx prisma migrate dev --name init
```

### Step 3: Verifikasi Database

Buka Supabase Dashboard → **Table Editor**

Anda seharusnya melihat tables:
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Portfolio`
- `Skill`
- `Roadmap`
- `RoadmapItem`
- `Achievement`
- `Activity`
- `UserStats`

---

## Konfigurasi Row Level Security (RLS)

Supabase menggunakan RLS untuk keamanan. Kita perlu setup policies:

### Enable RLS pada Tables

1. Di Supabase Dashboard, buka **Table Editor**
2. Klik table `Portfolio`
3. Klik **Policies** tab
4. Klik **Enable RLS**
5. Ulangi untuk tables: `Skill`, `Roadmap`, `Achievement`, `Activity`, `UserStats`

### Buat Policies (Contoh untuk Portfolio)

1. Di table `Portfolio`, klik **Create policy**
2. Pilih template **"Enable read access for users based on user_id"**
3. Atau buat manual:

```sql
-- Allow users to read their own portfolios
CREATE POLICY "Users can read own portfolios"
ON "Portfolio"
FOR SELECT
USING ("userId" = auth.uid());

-- Allow users to insert their own portfolios
CREATE POLICY "Users can create own portfolios"
ON "Portfolio"
FOR INSERT
WITH CHECK ("userId" = auth.uid());

-- Allow users to update their own portfolios
CREATE POLICY "Users can update own portfolios"
ON "Portfolio"
FOR UPDATE
USING ("userId" = auth.uid());

-- Allow users to delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
ON "Portfolio"
FOR DELETE
USING ("userId" = auth.uid());
```

Ulangi untuk tables lain dengan pola yang sama.

---

## Connection Pooling (PgBouncer)

### Mengapa PgBouncer Penting?

Next.js di Vercel/Netlify menggunakan serverless functions yang:
- Membuat connection baru setiap request
- Bisa mencapai limit connection PostgreSQL (100 connections)

PgBouncer mengelola connection pool, mencegah kehabisan connections.

### Setup Connection Pooling

1. Di Supabase Dashboard → **Database** → **Connection pooling**
2. Sudah aktif secara default!
3. Gunakan port `6543` untuk transaction mode
4. Update `DATABASE_URL` di `.env.local` dengan URL pooling

### Optimasi Pool Size

Untuk Vercel Hobby (serverless functions):

```bash
# Di .env.local
database_url="postgresql://postgres:[PASSWORD]@[POOLER-HOST]:6543/postgres?pgbouncer=true&connection_limit=10"
```

Untuk Vercel Pro:

```bash
database_url="postgresql://postgres:[PASSWORD]@[POOLER-HOST]:6543/postgres?pgbouncer=true&connection_limit=20"
```

---

## Testing Database Connection

### Step 1: Test dengan Prisma Studio

```bash
npx prisma studio
```

Buka http://localhost:5555 dan pastikan bisa melihat tables.

### Step 2: Test dengan API

Jalankan aplikasi:

```bash
npm run dev
```

Test endpoint (gunakan Postman atau curl):

```bash
# Test GET portfolios (perlu login dulu)
curl http://localhost:3000/api/portfolio

# Response seharusnya: 401 Unauthorized (karena belum login)
```

---

## Troubleshooting

### Error: "Connection refused"

- Pastikan password benar (huruf besar/kecil sensitif)
- Pastikan menggunakan port yang benar (5432 untuk direct, 6543 untuk pooling)

### Error: "too many connections"

- Gunakan connection pooling URL (port 6543)
- Kurangi connection_limit di database URL
- Atur `connection_limit=1` untuk serverless

### Error: "self-signed certificate"

Tambahkan parameter ke connection string:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"
```

Atau untuk development:

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=disable"
```

### Migration Gagal

Pastikan menggunakan `DIRECT_URL` (tanpa pooling) untuk migrations:

```bash
# .env.local
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres:[PASSWORD]@[POOLER]:6543/postgres?pgbouncer=true"
```

Lalu run migration:

```bash
npx prisma migrate dev
```

---

## Referensi

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)
- [PgBouncer with Prisma](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
