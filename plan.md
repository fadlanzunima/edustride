# Project Context: EduStride (Skill & Digital Portfolio)

**Versi:** 2.0 (Updated 2025)

**Fokus:** Ekosistem Pendidikan Terpadu SMA hingga S3.

---

## 1. Visi Produk

Membangun platform yang memfasilitasi pelajar Indonesia untuk membangun portofolio digital dan skill yang relevan dengan industri 2026, mencakup transisi dari SMA ke perguruan tinggi hingga jenjang pakar (S3).

---

## 2. Segmentasi & Target Pengguna

- **SMA:** Fokus pada eksplorasi minat dan persiapan masuk S1.
- **S1:** Fokus pada magang, organisasi, dan portofolio profesional.
- **S2/S3:** Fokus pada riset, publikasi jurnal, dan academic branding.

---

## 3. Arsitektur Informasi (Sitemap)

- **Public:** Landing Page dengan Level Selector.
- **Private:** Bento Grid Dashboard, Portfolio Builder, Skill Hub.

---

## 4. Konsep Desain: Bento Grid & Level Switcher

- **Level Switcher:** Komponen navigasi utama untuk mengubah seluruh state aplikasi.
- **Bento Grid:** Layout kotak-kotak modular (2x1, 1x1, 2x2) untuk menampilkan data secara padat namun estetik.

---

## 5. Rencana Teknologi (Tech Stack) - Updated 2025

Berdasarkan State of React 2024 dan tren terbaru:

### Core Framework
- **Next.js 15** - React framework dengan App Router stabil dan React 19 support

### UI Components
- **Tailwind CSS** - CSS framework #1 (73% usage)
- **shadcn/ui** - Component library dengan pertumbuhan tercepat (42% usage, 80% positivity)
- **Radix UI** - Primitives untuk accessibility

### Animation
- **Motion** - Rebranding dari Framer Motion, tetap #1 untuk React animation

### State Management
- **Zustand** - State management paling populer dan disukai (41% usage)
- **TanStack Query** - Data fetching, caching, dan server state management
- **nuqs** - Type-safe URL search params state manager (React Pick of the Year 2024)

### Form Handling
- **React Hook Form** - Form library #1 (71% usage) dengan performa optimal

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Internationalization (i18n)
- **next-intl** - Internationalization library untuk Next.js App Router
- **Dukungan Bahasa:**
  - 🇮🇩 **Bahasa Indonesia** (Default)
  - 🇬🇧 **English** (International)
- **Fitur:**
  - Language switcher component
  - Auto-deteksi bahasa dari browser
  - URL routing dengan locale (/id/, /en/)
  - Translation files (JSON-based)
  - RTL support (future-proof)

### Responsive Design & Mobile-First
- **Mobile-First Approach** - Design dimulai dari mobile (320px+)
- **Breakpoints:**
  - `sm:` 640px (mobile landscape)
  - `md:` 768px (tablet)
  - `lg:` 1024px (desktop)
  - `xl:` 1280px (large desktop)
  - `2xl:` 1536px (extra large)
- **Touch-Friendly UI** - Minimum touch target 44x44px
- **PWA Support** - Service worker, offline capability, installable
- **Cross-Platform:**
  - iOS Safari optimization
  - Android Chrome optimization
  - Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## 6. Fitur Unggulan

- **Auto-Portfolio Generator** - Generate portofolio otomatis dari data pengguna
- **Smart Skill Roadmap** - Roadmap skill yang dipersonalisasi berdasarkan level
- **LinkedIn Integration** - Sinkronisasi dengan LinkedIn untuk data profesional

---

## 7. Struktur Data & Pemetaan Konten Dinamis (JSON-Based)

Agar Bento Grid dapat berubah secara instan saat user menekan Level Switcher, diperlukan struktur data yang terpetakan dengan baik.

### A. Skema Data (Model)

Setiap widget dalam Bento Grid akan mengambil data berdasarkan kunci `currentLevel`.

```json
{
  "user_profile": {
    "name": "Budi Santoso",
    "level": "S1",
    "institution": "Universitas Indonesia"
  },
  "widgets": {
    "roadmap": {
      "SMA": "3 Langkah Menuju SNBT 2026",
      "S1": "Persiapan Magang MBKM Semester 5",
      "S2_S3": "Deadline Publikasi Jurnal Scopus Q1"
    },
    "trending_skills": {
      "SMA": ["Basic Design", "Public Speaking", "Office Suite"],
      "S1": ["Data Analytics", "Project Management", "Digital Marketing"],
      "S2_S3": ["Scientific Writing", "Advanced Statistics", "Grant Writing"]
    }
  }
}
```

### B. Pemetaan Komponen (Logic Mapping)

**Widget Utama (2x2):**
- Jika Level == SMA, tampilkan "Interactive Career Explorer".
- Jika Level == S1, tampilkan "Live Portfolio Preview".
- Jika Level == S2/S3, tampilkan "Research Impact Tracker".

**Warna Tema Dinamis:**
- **SMA:** Menggunakan warna cerah (Cyan/Lime) untuk kesan enerjik.
- **S1:** Menggunakan warna profesional (Deep Blue/Indigo).
- **S2/S3:** Menggunakan warna elegan (Charcoal/Gold) untuk kesan pakar.

### C. Dashboard States

Aplikasi akan memiliki 3 "wajah" utama yang dikontrol melalui satu variabel Global State:

- **State Exploratory (SMA):** UI lebih banyak gambar dan animasi.
- **State Achievement (S1):** UI lebih banyak angka dan progres kerja.
- **State Expertise (S2/S3):** UI lebih minimalis, fokus pada teks dan data riset.

### D. Responsive Design Guidelines

**Mobile-First Approach:**
- Design dimulai dari layar terkecil (320px)
- Gunakan breakpoint Tailwind secara bertahap: `sm:`, `md:`, `lg:`, `xl:`
- Prioritaskan konten penting di mobile view

**Typography Scale:**
- **Mobile:** `text-sm` (14px), `text-base` (16px), `text-lg` (18px)
- **Tablet:** `text-base` (16px), `text-lg` (18px), `text-xl` (20px)
- **Desktop:** `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px)

**Touch Targets:**
- Minimum 44x44px untuk semua interactive elements
- Button padding: `px-4 py-2` (mobile), `px-6 py-3` (desktop)
- Spacing antar elemen: minimum 8px

**Layout Patterns:**
- **Mobile:** Single column, full-width cards
- **Tablet:** 2 columns grid
- **Desktop:** 3-4 columns grid, sidebar navigation

**Performance:**
- Lazy load images dengan `next/image`
- Code splitting per route
- Optimize animations untuk mobile (reduce motion)

---

## 8. Struktur Folder Project

```
edustride/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── (landing)/          # Landing page group
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/        # Dashboard group (private)
│   │   │   ├── dashboard/
│   │   │   ├── portfolio/
│   │   │   └── skills/
│   │   ├── about/              # About page
│   │   └── layout.tsx          # Locale layout
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── bento-grid/             # Bento grid components
│   ├── level-switcher/         # Level switcher components
│   ├── language-switcher/      # Language switcher component
│   ├── widgets/                # Dashboard widgets
│   └── forms/                  # Form components
├── hooks/                       # Custom React hooks
├── lib/                        # Utilities & configurations
│   ├── utils.ts
│   ├── store/                  # Zustand stores
│   ├── i18n/                   # Internationalization config
│   │   ├── config.ts
│   │   └── navigation.ts
│   └── data/                   # Static data & constants
├── messages/                    # Translation files
│   ├── id.json                 # Bahasa Indonesia
│   └── en.json                 # English
├── types/                       # TypeScript types
├── public/                      # Static assets
└── next.config.js
```

---

## 9. Instalasi & Setup

```bash
# 1. Create Next.js project with shadcn
npx shadcn@latest init --yes --template next --base-color slate

# 2. Install shadcn components
npx shadcn add button card badge avatar separator

# 3. Install animation library
npm install motion

# 4. Install state management
npm install zustand

# 5. Install data fetching
npm install @tanstack/react-query

# 6. Install URL state management
npm install nuqs

# 7. Install form handling
npm install react-hook-form @hookform/resolvers zod

# 8. Install internationalization
npm install next-intl

# 9. Install PWA support
npm install next-pwa
```

---

## 10. Roadmap Pengembangan

### Phase 1: Foundation ✅ (Selesai)
- [x] Setup project Next.js 15 + shadcn/ui
- [x] Konfigurasi Tailwind CSS & tema warna
- [x] Setup Zustand store untuk level management
- [x] Implementasi Level Switcher component

### Phase 2: Core Features ✅ (Selesai)
- [x] Bento Grid layout & responsive design
- [x] Widget components dasar (Roadmap, Skills, Portfolio)
- [x] JSON-based content mapping
- [x] Motion animations

### Phase 2b: Multi-Language & Responsive Enhancement ✅ (Selesai)
- [x] Setup next-intl untuk internationalization
- [x] Buat struktur folder messages/ untuk translation files
- [x] Implementasi language switcher component
- [x] Translate semua konten ke Bahasa Indonesia & English
- [x] Setup routing dengan locale (/id/, /en/)
- [x] Mobile-first responsive design audit
- [x] Optimasi touch targets untuk mobile (min 44x44px)
- [x] Tablet layout optimization (768px - 1024px)
- [x] Test responsive di berbagai device (Chrome DevTools)
- [ ] PWA manifest & service worker setup

### Phase 3: Authentication & Security (Minggu 3-4)
- [ ] Setup NextAuth.js v5 (Auth.js)
- [ ] Implementasi login/register pages
- [ ] OAuth integration (Google, LinkedIn)
- [ ] Protected routes middleware
- [ ] Session management & JWT handling

### Phase 4: Database & API (Minggu 4-5)
- [ ] Setup database (PostgreSQL + Prisma atau Supabase)
- [ ] Design database schema (users, portfolios, skills, roadmaps, achievements)
- [ ] Create API endpoints (/api/auth, /api/portfolio, /api/skills, /api/roadmap)
- [ ] Integrasi TanStack Query untuk data fetching & caching
- [ ] Setup tRPC atau React Query untuk type-safe API calls

### Phase 5: Portfolio Builder (Minggu 5-6)
- [ ] Halaman `/portfolio` dengan layout & navigation
- [ ] Form input data portofolio (React Hook Form + Zod validation)
- [ ] File upload system (sertifikat, project screenshots, CV)
- [ ] Auto-Portfolio Generator logic dari data user
- [ ] Portfolio preview mode dengan tema dinamis
- [ ] Export portfolio ke PDF
- [ ] Share portfolio via public link

### Phase 6: Skill Hub (Minggu 6-7)
- [ ] Halaman `/skills` dengan layout & search
- [ ] Skill assessment form & quiz system
- [ ] Smart Skill Roadmap interaktif dengan progress tracking
- [ ] Skill recommendation engine berdasarkan level & tujuan karir
- [ ] Progress visualization (charts dengan Recharts atau Tremor)
- [ ] Achievement badges & certifications tracker

### Phase 7: Advanced Dashboard Widgets (Minggu 7-8)
- [ ] Interactive Career Explorer widget (SMA) - eksplorasi jurusan & karir
- [ ] Live Portfolio Preview widget (S1) - preview real-time portfolio
- [ ] Research Impact Tracker widget (S2/S3) - tracking publikasi & riset
- [ ] Analytics & insights dashboard (skill progress, portfolio views)
- [ ] Notification system (deadline, achievement, recommendations)
- [ ] Dark mode toggle & theme customization

### Phase 8: Integration & Polish (Minggu 8-9)
- [ ] LinkedIn API integration untuk import data profil
- [ ] nuqs untuk URL state management (shareable dashboard state)
- [ ] Testing: Unit tests (Vitest), Integration tests, E2E tests (Playwright)
- [ ] Performance optimization (lazy loading, code splitting, image optimization)
- [ ] SEO optimization & meta tags
- [ ] Deployment ke Vercel dengan CI/CD pipeline
- [ ] Monitoring & analytics (Vercel Analytics atau Plausible)

### Phase 9: Post-Launch & Maintenance (Minggu 10+)
- [ ] User feedback collection system
- [ ] Bug fixes & hotfixes
- [ ] Feature enhancements berdasarkan feedback
- [ ] Documentation & user guide
- [ ] Community building (Discord/Forum)

---

## 11. Documentation

### Technical Documentation
- **[Responsive Design Guidelines](docs/responsive-design.md)** - Panduan lengkap untuk mobile-first responsive design
- **[i18n Guide](docs/i18n-guide.md)** - Panduan penggunaan internationalization (2 bahasa)

### Additional Resources
- **Component Library:** shadcn/ui dengan Tailwind CSS
- **Animation:** Motion (Framer Motion)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query

---

**Catatan:** Tech stack ini dipilih berdasarkan data State of React 2024 dan tren industri terkini untuk memastikan maintainability dan developer experience terbaik.
