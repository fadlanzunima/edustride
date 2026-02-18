# OAuth Setup Guide

Panduan lengkap untuk mengkonfigurasi Google Login dan LinkedIn Login di EduStride.

## Daftar Isi

1. [Google OAuth Setup](#google-oauth-setup)
2. [LinkedIn OAuth Setup](#linkedin-oauth-setup)
3. [Environment Variables](#environment-variables)
4. [Testing](#testing)

---

## Google OAuth Setup

### Step 1: Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan akun Google Anda
3. Klik dropdown project di top bar → **New Project**
4. Isi **Project Name**: `EduStride`
5. Klik **Create**

### Step 2: Enable Google+ API

1. Di sidebar, klik **APIs & Services** → **Library**
2. Cari **Google+ API** atau **Google People API**
3. Klik **Enable**

### Step 3: Konfigurasi OAuth Consent Screen

1. Di sidebar, klik **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk production nanti bisa Internal)
3. Klik **Create**
4. Isi informasi aplikasi:
   - **App name**: EduStride
   - **User support email**: email Anda
   - **Developer contact information**: email Anda
5. Klik **Save and Continue**
6. Di bagian **Scopes**, klik **Add or Remove Scopes**
   - Pilih: `openid`, `email`, `profile`
7. Klik **Save and Continue**
8. Di bagian **Test Users**, add email Anda untuk testing
9. Klik **Save and Continue**

### Step 4: Buat OAuth Credentials

1. Di sidebar, klik **APIs & Services** → **Credentials**
2. Klik **+ Create Credentials** → **OAuth client ID**
3. Pilih **Application type**: **Web application**
4. Isi **Name**: `EduStride Web Client`
5. Di bagian **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   Untuk production:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
6. Klik **Create**
7. **Copy Client ID dan Client Secret** (simpan dengan aman!)

---

## LinkedIn OAuth Setup

### Step 1: Buat App di LinkedIn Developer

1. Buka [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Login dengan akun LinkedIn Anda
3. Klik **Create app**
4. Isi informasi aplikasi:
   - **App name**: EduStride
   - **LinkedIn Page**: Buat page baru atau pilih existing
   - **App Logo**: Upload logo aplikasi (opsional)
   - **Legal agreement**: Check semua checkbox
5. Klik **Create app**

### Step 2: Konfigurasi OAuth Settings

1. Di app dashboard, klik tab **Auth**
2. Scroll ke bagian **OAuth 2.0 settings**
3. Di **Authorized redirect URLs for your app**, add:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   ```
   Untuk production:
   ```
   https://yourdomain.com/api/auth/callback/linkedin
   ```
4. Klik **Update**

### Step 3: Dapatkan Credentials

1. Di tab **Application credentials**, Anda akan melihat:
   - **Client ID** (Application Key)
   - **Client Secret** (Secret Key)
2. **Copy keduanya** (simpan dengan aman!)

### Step 4: Request Access (Wajib untuk Production)

LinkedIn memerlukan approval untuk menggunakan Sign In with LinkedIn:

1. Di sidebar, klik **Products**
2. Cari **Sign In with LinkedIn using OpenID Connect**
3. Klik **Request access**
4. Isi form yang diminta
5. Tunggu approval (biasanya 1-3 hari kerja)

> **Note**: Untuk development/testing, Anda bisa langsung testing tanpa approval.

---

## Environment Variables

Tambahkan credentials ke file `.env.local`:

```bash
# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret

# LinkedIn OAuth
AUTH_LINKEDIN_ID=your-linkedin-client-id
AUTH_LINKEDIN_SECRET=your-linkedin-client-secret
```

> **⚠️ Penting**: Jangan commit file `.env.local` ke git! Pastikan sudah di `.gitignore`.

---

## Testing

### Test Google Login

1. Jalankan aplikasi: `npm run dev`
2. Buka http://localhost:3000/login
3. Klik **Sign in with Google**
4. Pilih akun Google Anda
5. Seharusnya redirect ke dashboard dengan sukses

### Test LinkedIn Login

1. Buka http://localhost:3000/login
2. Klik **Sign in with LinkedIn**
3. Login dengan akun LinkedIn Anda
4. Authorize aplikasi
5. Seharusnya redirect ke dashboard dengan sukses

### Troubleshooting

#### Error: "redirect_uri_mismatch"

- Pastikan redirect URI di Google/LinkedIn console sama persis dengan yang di aplikasi
- Perhatikan trailing slash (ada/tidak `/` di akhir URL)

#### Error: "unauthorized_client"

- Pastikan Client ID dan Client Secret benar
- Pastikan OAuth provider sudah di-enable

#### Error: "access_denied"

- Untuk Google: Pastikan email Anda sudah ditambahkan sebagai test user
- Untuk LinkedIn: Belum di-approve untuk production

#### LinkedIn: "App in development mode"

- Normal untuk development
- Untuk production, butuh approval dari LinkedIn

---

## Production Checklist

Sebelum deploy ke production:

- [ ] Update redirect URIs ke domain production
- [ ] Google: Publikasikan OAuth consent screen (Production)
- [ ] LinkedIn: Request dan dapatkan approval untuk Sign In
- [ ] Pastikan environment variables di server production sudah di-set
- [ ] Test OAuth flow di production environment

---

## Referensi

- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [NextAuth.js LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
