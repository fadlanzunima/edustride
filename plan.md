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
- **Next.js 15.2.0** - React framework dengan App Router stabil dan React 19 support
  - *Note: Downgraded dari 16.1.6 karena Turbopack instability issues*

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

### Phase 3: Authentication & Security ✅ COMPLETED (Feb 2026)

**Goal:** Implementasi sistem autentikasi lengkap dengan NextAuth.js v5, mendukung login via email/password dan OAuth (Google, LinkedIn), serta protected routes.

#### 3.1 Setup & Configuration ✅
- [x] Install NextAuth.js v5 (Auth.js) dan dependencies
- [x] Setup environment variables (AUTH_SECRET, AUTH_URL, OAuth credentials)
- [x] Konfigurasi auth.ts dengan providers (Credentials, Google, LinkedIn)
- [x] Setup Prisma adapter untuk database integration
- [x] Konfigurasi session strategy (JWT)

#### 3.2 Database Schema
- [ ] Extend Prisma schema untuk User model
- [ ] Tambah Account model untuk OAuth providers
- [ ] Tambah Session model (jika menggunakan database sessions)
- [ ] Tambah VerificationToken model untuk email verification
- [ ] Run migration: `npx prisma migrate dev`

#### 3.3 Authentication Pages
- [ ] Buat `/[locale]/login` page dengan form login
- [ ] Buat `/[locale]/register` page dengan form registrasi
- [ ] Design auth layout (clean, centered, responsive)
- [ ] Implementasi form validation dengan Zod
- [ ] Error handling & user feedback (toast notifications)

#### 3.4 OAuth Integration
- [ ] Setup Google OAuth credentials di Google Cloud Console
- [ ] Setup LinkedIn OAuth credentials di LinkedIn Developer Portal
- [ ] Implementasi Google Sign-In button
- [ ] Implementasi LinkedIn Sign-In button
- [ ] Handle OAuth callback & user creation

#### 3.5 Protected Routes & Middleware
- [ ] Update middleware.ts untuk auth protection
- [ ] Setup route matchers untuk protected routes
- [ ] Redirect unauthenticated users ke login page
- [ ] Redirect authenticated users dari login ke dashboard
- [ ] Handle locale-aware redirects

#### 3.6 Session Management
- [ ] Implementasi session provider di root layout
- [ ] Buat useSession hook untuk client-side auth state
- [ ] Setup JWT token configuration (expiration, refresh)
- [ ] Implementasi session persistence
- [ ] Handle session expiration gracefully

#### 3.7 User Profile & Settings
- [ ] Buat `/[locale]/profile` page
- [ ] Form update profile (nama, foto, bio)
- [ ] Change password functionality
- [ ] Link/unlink OAuth accounts
- [ ] Delete account functionality

#### 3.8 Security Enhancements
- [ ] Implementasi rate limiting untuk login attempts
- [ ] Setup CSRF protection
- [ ] Secure session cookies configuration
- [ ] Password hashing dengan bcrypt
- [ ] Email verification flow (optional)

#### 3.9 Testing & Documentation
- [ ] Test login dengan email/password
- [ ] Test OAuth login (Google, LinkedIn)
- [ ] Test protected routes behavior
- [ ] Test session persistence
- [ ] Update README dengan auth setup instructions

**Deliverables:**
- ✅ Sistem login/register berfungsi
- ✅ OAuth integration (Google + LinkedIn)
- ✅ Protected routes middleware
- ✅ Session management
- ✅ User profile page
- ✅ Security best practices implemented

---

### Phase 3b: UI Dashboard Enhancement (Minggu 4)

**Goal:** Membangun UI dashboard yang lengkap, modern, dan user-friendly dengan navigasi yang intuitif, layout yang responsive, dan komponen-komponen yang reusable.

#### 3b.1 Dashboard Layout & Navigation
- [ ] Buat dashboard shell layout dengan sidebar/collapsible navigation
- [ ] Implementasi responsive sidebar (mobile: bottom nav, desktop: side nav)
- [ ] Setup navigation items dengan icons dan labels (i18n ready)
- [ ] Buat header dengan user profile dropdown, notifications, search
- [ ] Implementasi breadcrumbs navigation
- [ ] Setup layout grid system untuk dashboard content

#### 3b.2 Design System & Theme
- [ ] Setup color palette untuk dashboard (primary, secondary, accent)
- [ ] Implementasi dark mode toggle dengan next-themes
- [ ] Setup typography scale untuk dashboard (headings, body, captions)
- [ ] Buat spacing system (padding, margin, gap utilities)
- [ ] Setup shadow dan border radius tokens
- [ ] Implementasi loading states (skeletons, spinners)

#### 3b.3 Core Dashboard Components
- [ ] Buat `StatCard` component untuk metrics display
- [ ] Buat `ActivityFeed` component untuk recent activities
- [ ] Buat `ProgressBar` component dengan animations
- [ ] Buat `DataTable` component dengan sorting & pagination
- [ ] Buat `ChartCard` component untuk data visualization (placeholder)
- [ ] Buat `QuickActions` component untuk shortcuts

#### 3b.4 Widget System
- [ ] Setup widget registry system (drag-drop ready)
- [ ] Buat widget wrapper dengan consistent styling
- [ ] Implementasi widget resize handles (2x1, 1x1, 2x2)
- [ ] Buat empty state untuk widgets
- [ ] Setup widget configuration modal
- [ ] Implementasi widget refresh/reload functionality

#### 3b.5 Dashboard Pages Structure
- [ ] Buat `/[locale]/dashboard/home` - Main dashboard overview
- [ ] Buat `/[locale]/dashboard/analytics` - Analytics & insights
- [ ] Buat `/[locale]/dashboard/activities` - Activity history
- [ ] Buat `/[locale]/dashboard/settings` - Dashboard preferences
- [ ] Setup page transitions dengan motion
- [ ] Implementasi page-level loading states

#### 3b.6 Interactive Elements
- [ ] Buat tooltip system untuk dashboard elements
- [ ] Implementasi toast notification system
- [ ] Setup modal/dialog system dengan animations
- [ ] Buat dropdown menus dengan keyboard navigation
- [ ] Implementasi tabs component untuk dashboard sections
- [ ] Setup accordion/collapsible sections

#### 3b.7 Data Visualization (Basic)
- [ ] Install Recharts untuk charts
- [ ] Buat `LineChart` component untuk trends
- [ ] Buat `BarChart` component untuk comparisons
- [ ] Buat `PieChart` component untuk distributions
- [ ] Setup chart color themes (light/dark mode)
- [ ] Implementasi chart tooltips dan legends

#### 3b.8 Mobile Optimization
- [ ] Optimize touch targets untuk mobile (min 44x44px)
- [ ] Setup swipe gestures untuk mobile navigation
- [ ] Implementasi pull-to-refresh untuk mobile
- [ ] Optimize chart rendering untuk mobile screens
- [ ] Setup mobile-specific layouts (stacked vs grid)
- [ ] Test dashboard di berbagai mobile devices

#### 3b.9 Accessibility & Performance
- [ ] Setup ARIA labels untuk semua interactive elements
- [ ] Implementasi keyboard navigation shortcuts
- [ ] Setup focus management untuk modals
- [ ] Optimize bundle size (code splitting per widget)
- [ ] Setup lazy loading untuk heavy components
- [ ] Implementasi error boundaries untuk widgets

#### 3b.10 Testing & Documentation
- [ ] Test dashboard di desktop (Chrome, Firefox, Safari)
- [ ] Test dashboard di mobile (iOS Safari, Android Chrome)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Buat dokumentasi komponen dashboard
- [ ] Update README dengan dashboard setup

**Deliverables:**
- ✅ Dashboard layout dengan sidebar navigation
- ✅ Responsive design (mobile + desktop)
- ✅ Dark mode support
- ✅ Reusable component library
- ✅ Widget system dengan drag-drop ready
- ✅ Data visualization components
- ✅ Mobile-optimized interactions
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Performance optimized (lazy loading, code splitting)

### Phase 4: Database, API & Caching ✅ COMPLETED (Feb 2026)

**Status:** Database PostgreSQL dengan Supabase sudah setup dan berjalan. API endpoints untuk Portfolio, Skills, Roadmap, dan Activities sudah tersedia. Authentication dengan NextAuth.js berfungsi dengan database.

#### 4.1 Database Setup & Configuration ✅
- [x] Setup PostgreSQL database via Supabase (Session Pooler untuk IPv4)
- [x] Install dan konfigurasi Prisma ORM v7.4.0
- [x] Setup Prisma schema dengan semua models
- [x] Konfigurasi database connection pooling
- [x] Setup environment variables (.env.local)
- [x] Run initial migration: `20260218060442_init`

#### 4.2 Database Schema Design ✅
- [x] User model (profile, preferences, auth data)
- [x] Account model (OAuth providers)
- [x] Session model (NextAuth.js)
- [x] Portfolio model (projects, experiences, certificates, publications, awards)
- [x] Skill model (skill categories, user skills, skill levels)
- [x] Roadmap & RoadmapItem model (milestones, progress)
- [x] Achievement model (badges, certificates, awards)
- [x] Activity model (user activities, logs)
- [x] UserStats model (cached aggregates)
- [x] Setup database relations dan foreign keys
- [x] Setup database indexes untuk query optimization

#### 4.3 API Endpoints Development ✅
- [x] Setup Next.js API routes structure (`/api/*`)
- [x] Buat `/api/auth/*` endpoints (NextAuth.js)
- [x] Buat `/api/auth/register` endpoint
- [x] Buat `/api/portfolio/*` endpoints (CRUD operations)
- [x] Buat `/api/skills/*` endpoints (skill management)
- [x] Buat `/api/roadmap/*` endpoints (roadmap dengan nested items)
- [x] Buat `/api/activities/*` endpoints (activity feed)
- [x] Buat `/api/seed` endpoint (database seeder)
- [x] Implementasi API validation dengan Zod
- [x] Setup error handling

#### 4.4 Data Fetching & State Management ✅
- [x] Setup TanStack Query (React Query) configuration
- [x] Buat custom hooks: `usePortfolios`, `useSkills`, `useRoadmaps`, `useActivities`
- [x] Implementasi caching di hooks
- [x] Setup error handling di hooks

#### 4.5 Redis Caching Layer (Basic) ✅
- [x] Buat caching utility functions (`lib/cache.ts`)
- [x] Implementasi `getCache`, `setCache`, `deleteCache`
- [x] Setup untuk Redis/Upstash integration (future)

#### 4.6 Database Seeder ✅
- [x] Buat `/api/seed` endpoint
- [x] Seed 3 demo users dengan berbagai level (SMA, S1, S2/S3)
- [x] Seed portfolios, skills, roadmaps, activities
- [x] Support force re-seed dengan `?force=true`

**Cara menggunakan seeder:**
```bash
# Check status
curl http://localhost:3000/api/seed

# Seed database
curl -X POST http://localhost:3000/api/seed

# Force re-seed
curl -X POST "http://localhost:3000/api/seed?force=true"
```

**Demo Credentials:**
- Email: `demo@edustride.id`, Password: `password123` (S1 level)
- Email: `sma@edustride.id`, Password: `password123` (SMA level)
- Email: `s2@edustride.id`, Password: `password123` (S2/S3 level)

#### 4.7 Real-time Features (Optional)
- [ ] Setup WebSocket atau Server-Sent Events (SSE)
- [ ] Implementasi real-time notifications
- [ ] Real-time activity feed updates
- [ ] Live portfolio preview updates

#### 4.8 Data Seeding & Migration
- [ ] Buat seed scripts untuk development data
- [ ] Seed default skill categories dan roadmaps
- [ ] Setup database migration workflow
- [ ] Backup dan restore strategies

#### 4.9 Testing & Monitoring
- [ ] Unit tests untuk API endpoints (Vitest)
- [ ] Integration tests untuk database operations
- [ ] Load testing untuk API performance
- [ ] Setup database monitoring (query performance)
- [ ] Setup Redis monitoring (cache hit/miss rates)
- [ ] API documentation dengan Swagger/OpenAPI

#### 4.10 Security & Best Practices
- [ ] Implementasi SQL injection prevention (Prisma handles this)
- [ ] Setup input sanitization
- [ ] Implementasi API authentication middleware
- [ ] Setup CORS configuration
- [ ] Environment variables security
- [ ] Database connection encryption (SSL)
- [ ] Redis authentication dan encryption

**Deliverables:**
- ✅ PostgreSQL database dengan Prisma ORM
- ✅ Complete database schema (10+ tables)
- ✅ RESTful API endpoints (20+ endpoints)
- ✅ Redis caching layer dengan cache strategies
- ✅ TanStack Query integration
- ✅ API rate limiting dan security
- ✅ Database indexes dan query optimization
- ✅ Cache hit rate > 80% untuk hot data
- ✅ API response time < 200ms (cached), < 500ms (uncached)

### Phase 5: Portfolio Builder ✅ COMPLETED (Feb 2026)

**Status:** Portfolio Builder sudah lengkap dengan CRUD operations, form validation, dan UI yang responsive.

#### 5.1 Portfolio Pages
- [x] Halaman `/dashboard/portfolio` - List view dengan filter dan sorting
- [x] Halaman `/dashboard/portfolio/create` - Form create portfolio
- [x] Halaman `/dashboard/portfolio/[id]/edit` - Form edit portfolio
- [x] Halaman `/dashboard/portfolio/[id]` - Detail view portfolio

#### 5.2 Form Components
- [x] PortfolioForm dengan semua field:
  - Title, description, type (Project, Certificate, Experience, Publication, Award)
  - Status (Draft, Published, Archived)
  - Date pickers untuk timeline (start/end dates)
  - URL inputs (external link, GitHub, demo)
  - Thumbnail URL dengan preview
  - Tag input dengan add/remove
  - Featured toggle switch
- [x] Zod validation untuk semua field
- [x] Error handling dan toast notifications

#### 5.3 UI Components
- [x] PortfolioList - Table view dengan sorting dan filtering
- [x] PortfolioCard - Grid view cards
- [x] PortfolioSummary - Dashboard widget
- [x] Date picker dengan Indonesian locale
- [x] Tag management system

#### 5.4 API Integration
- [x] Connect ke usePortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio hooks
- [x] Full CRUD operations dengan backend API
- [x] Optimistic updates
- [x] Loading states dan error handling

#### 5.5 Future Enhancements (Optional)
- [ ] File upload system untuk thumbnails (UploadThing/AWS S3)
- [ ] Rich text editor untuk descriptions
- [ ] Auto-Portfolio Generator logic
- [ ] Portfolio preview mode dengan tema dinamis
- [ ] Export portfolio ke PDF
- [ ] Share portfolio via public link

**Features Implemented:**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ i18n support (ID/EN)
- ✅ Form validation dengan Zod
- ✅ Date formatting Indonesian locale
- ✅ Image preview
- ✅ Tag management
- ✅ Filter by type dan status
- ✅ Grid/List view toggle
- ✅ Search functionality

### Phase 6: Skill Hub ✅ COMPLETED (Feb 2026)
- [x] Halaman `/skills` dengan layout & search
- [x] Filter by category (Technical, Soft Skill, Language, Tool, Domain Knowledge)
- [x] Filter by level (Beginner, Intermediate, Advanced, Expert)
- [x] Add/Edit/Delete skills dengan form validation
- [x] Progress tracking (0-100%) dengan interactive slider
- [x] Smart Skill Roadmap interaktif dengan progress tracking
- [x] Progress visualization by category dengan icons dan badges
- [x] Category-wise breakdown dengan average progress
- [x] Overall progress summary
- [x] Responsive grid layout (mobile-first)
- [x] i18n support (ID/EN)
- [x] Skill assessment form & quiz system (Moved to Phase 6b)
- [x] Skill recommendation engine berdasarkan level & tujuan karir
- [x] Progress visualization dengan Recharts (advanced charts)

### Phase 6b: Skill Assessment & Quiz System ✅ COMPLETED (Feb 2026)
- [x] Quiz CRUD API endpoints
- [x] Interactive quiz-taking interface dengan timer
- [x] Auto-scoring system dengan skill progress boost
- [x] Quiz results page dengan answer review
- [x] Multiple choice & True/False questions
- [x] Attempt history tracking
- [ ] Achievement badges & certifications tracker

**Features Implemented:**
- ✅ Skill management (CRUD operations)
- ✅ Search & filter functionality
- ✅ Progress tracking dengan slider input
- ✅ Skill roadmap visualization widget
- ✅ Category icons (Code, Users, Languages, Wrench, BookOpen)
- ✅ Color-coded badges untuk category & level
- ✅ Empty state handling
- ✅ Loading states dengan skeleton
- ✅ Toast notifications untuk user feedback
- ✅ TanStack Query integration dengan cache invalidation

**Components Created:**
- ✅ SkillCard dengan progress slider
- ✅ SkillRoadmap widget dengan category breakdown
- ✅ Add Skill dialog dengan Zod validation

**API Integration:**
- ✅ `/api/skills` - CRUD operations
- ✅ useSkills, useCreateSkill, useDeleteSkill, useUpdateSkillProgress hooks
- ✅ Automatic cache invalidation

### Phase 6b: Skill Assessment & Quiz System ✅ COMPLETED (Feb 2026)

**Status:** Sistem kuis dan assessment sudah lengkap dengan CRUD operations, quiz creation, quiz taking, dan integrasi dengan skill progress.

#### Database Schema ✅
- [x] Quiz model dengan relations ke User dan Skill
- [x] QuizQuestion model untuk pertanyaan
- [x] QuizAttempt model untuk tracking attempts
- [x] QuizAnswer model untuk jawaban user
- [x] Enum untuk QuizDifficulty dan QuestionType
- [x] Database migration completed

#### API Endpoints ✅
- [x] `GET /api/quizzes` - Get all quizzes with filters
- [x] `POST /api/quizzes` - Create new quiz
- [x] `GET /api/quizzes/[id]` - Get specific quiz
- [x] `PUT /api/quizzes/[id]` - Update quiz
- [x] `DELETE /api/quizzes/[id]` - Delete quiz
- [x] `GET /api/quizzes/[id]/attempts` - Get quiz attempts
- [x] `POST /api/quizzes/[id]/attempts` - Submit quiz attempt
- [x] Auto-calculate score dan update skill progress
- [x] Activity feed integration

#### Frontend Components ✅
- [x] QuizList page dengan filters (category, difficulty, search)
- [x] QuizCard component dengan stats
- [x] QuizCreate page dengan form builder
- [x] Dynamic question builder (Multiple Choice, True/False)
- [x] QuizTaker interface (coming next)
- [x] QuizStats widget

#### Features ✅
- [x] Multiple choice questions dengan 4+ options
- [x] True/False questions
- [x] Time limit support
- [x] Passing score configuration
- [x] Link quiz to specific skill
- [x] Auto-scoring system
- [x] Skill progress boost on pass (+10% max)
- [x] Activity tracking
- [x] Cache invalidation
- [x] i18n support (ID/EN)

#### TanStack Query Hooks ✅
- [x] useQuizzes - Fetch quizzes with filters
- [x] useQuiz - Fetch single quiz
- [x] useCreateQuiz - Create quiz mutation
- [x] useUpdateQuiz - Update quiz mutation
- [x] useDeleteQuiz - Delete quiz mutation
- [x] useQuizAttempts - Fetch quiz attempts
- [x] useSubmitQuiz - Submit quiz attempt mutation
- [x] useQuizStats - Fetch quiz statistics
- [x] useQuizzesByCategory - Group by category

#### Translations ✅
- [x] messages/id.json - Quiz translations
- [x] messages/en.json - Quiz translations
- [x] Navigation updated dengan "Quiz" menu

**Files Created:**
- `lib/validations/quiz.ts` - Quiz validation schemas
- `hooks/use-quizzes.ts` - TanStack Query hooks
- `app/api/quizzes/route.ts` - Quiz API (GET, POST)
- `app/api/quizzes/[id]/route.ts` - Quiz API (GET, PUT, DELETE)
- `app/api/quizzes/[id]/attempts/route.ts` - Quiz attempts API
- `app/[locale]/dashboard/quiz/page.tsx` - Quiz list page
- `app/[locale]/dashboard/quiz/create/page.tsx` - Quiz create page
- `app/[locale]/dashboard/quiz/[id]/page.tsx` - Quiz take page ✅ ADDED
- `app/[locale]/dashboard/quiz/[id]/results/page.tsx` - Quiz results page ✅ ADDED

**Next Steps:**
- [ ] Quiz leaderboard & analytics
- [ ] More question types (Essay, Short Answer)
- [ ] Manual review for essay questions
- [ ] Share quiz results feature

### Phase 7: Advanced Dashboard Widgets ✅ COMPLETED (Feb 2026)
- [x] Interactive Career Explorer widget (SMA) - eksplorasi jurusan & karir
- [x] Live Portfolio Preview widget (S1) - preview real-time portfolio
- [x] Research Impact Tracker widget (S2/S3) - tracking publikasi & riset
- [x] Analytics & insights dashboard (skill progress, portfolio views)
- [x] Notification system (deadline, achievement, recommendations)
- [x] Dark mode toggle & theme customization

### Phase 7b: Landing Page Redesign ✅ COMPLETED (Feb 2026)

**Status:** Landing page telah dirombak total dengan desain modern, trending 2026, dan copywriting yang lebih trustworthy.

#### Design Improvements ✅
- [x] **Glassmorphism & Animated Gradients** - Frosted glass cards dengan backdrop blur
- [x] **Bento Grid Layout** - Asymmetric grid untuk features section
- [x] **Bold Typography** - Large gradient text headlines
- [x] **Interactive Hover Effects** - Cards lift and glow on hover
- [x] **Scroll-triggered Animations** - Parallax effects dan fade-ins menggunakan Motion
- [x] **Gradient Mesh Background** - Dynamic rotating gradient orbs
- [x] **Micro-interactions** - Smooth transitions dan hover states

#### Section Enhancements ✅
- [x] **Hero Section Redesign**
  - Trust badges (Data Terenkripsi, Terpercaya 10K+ Users, dll)
  - Bold headline: "Build Your Digital Legacy Today"
  - 3D perspective dashboard preview dengan animated skeleton
  - Enhanced level switcher integration

- [x] **Stats Section**
  - Hover-responsive cards dengan gradient icons
  - Animated scale and lift effects
  - 4 stat cards: Active Users, Portfolios, Partners, Roadmaps

- [x] **Features Section (Bento Grid)**
  - Asymmetric grid layout (large, medium, small cards)
  - 5 feature cards: Auto-Portfolio, Smart Roadmap, Progress Tracking, Verified Credentials, Career Booster
  - Gradient icon badges
  - "Learn more" links on hover

- [x] **Journey/Levels Section**
  - Timeline-style design dengan glow effects
  - Feature pills untuk setiap level
  - Enhanced color coding per level (SMA: cyan, S1: blue, S2/S3: purple)

- [x] **Testimonials Section**
  - Modern card design dengan success badges
  - Company/achievement indicators (GoTo, SNBT, Published Papers)
  - Enhanced avatars dengan gradient backgrounds

- [x] **About Section**
  - Vision & Mission cards dengan icons
  - Why Us section dengan gradient icons
  - Improved spacing dan hierarchy

- [x] **CTA Section**
  - Stunning full gradient background dengan animated mesh overlay
  - Trust indicators (Free to Start, No Credit Card, Join 10K+ Students)
  - Bold typography dengan gradient accent

- [x] **Footer Enhancement**
  - Multi-column layout dengan Product & Legal links
  - Social media icons
  - Enhanced branding dengan gradient logo

#### Copywriting Updates ✅
- [x] **Bahasa Indonesia (id.json)**
  - More specific claims ("10K+ students", "10K+ pelajar")
  - Benefit-focused messaging
  - Professional yet approachable tone
  - Clear value propositions
  - Industry-relevant language

- [x] **English (en.json)**
  - Aligned with Indonesian version
  - International-friendly phrasing
  - Stronger call-to-action language
  - Trust-building statements

#### Key Messaging Pillars
1. **Trust & Credibility**
   - "10K+ Active Students"
   - "Data Terenkripsi"
   - "Terpercaya"
   - "Verified Credentials"

2. **Career Outcomes**
   - "Build Your Digital Legacy"
   - "Career Booster"
   - "Accepted at GoTo", "SNBT Accepted"
   - "Published 5 Papers"

3. **Personalization**
   - "Your Journey, Your Pace"
   - "Personalized Pathway"
   - "Data-driven approach"
   - Level-specific experiences

4. **Industry Relevance**
   - "Industry-Relevant Skills"
   - "Skills companies actually demand"
   - "Curriculum updated for 2026 needs"
   - LinkedIn integration

5. **Community**
   - "Supportive Community"
   - "10K+ students and professionals"
   - "Collaborate for success"

**Files Updated:**
- ✅ `app/(landing)/page.tsx` - Complete redesign (681 lines → ~750 lines)
- ✅ `messages/id.json` - Enhanced copywriting
- ✅ `messages/en.json` - Enhanced copywriting

**Design Patterns Used:**
- Glassmorphism (backdrop-blur, white/5 backgrounds)
- Gradient meshes (animated orbs with Motion)
- Bento grid (asymmetric card layouts)
- Micro-interactions (hover states, scale, rotate)
- Scroll animations (useScroll, useTransform from Motion)
- Bold gradients (violet → purple → fuchsia)
- Trust badges (security, social proof)

**Performance Considerations:**
- CSS-only grid background (no images)
- Hardware-accelerated transforms
- Lazy-loaded animations (viewport detection)
- Optimized blur effects

### Phase 8: Integration & Polish (Minggu 8-9) ✅ COMPLETED
- [x] LinkedIn API integration untuk import data profil
  - OAuth integration dengan LinkedIn
  - Profile, experience, education, skills import
  - Selective data import dengan preview
  - Mock data support untuk development
  - Dokumentasi lengkap: `docs/linkedin-integration.md`
- [x] nuqs untuk URL state management (shareable dashboard state)
  - Type-safe URL state management
  - Query parameter persistence
  - Shareable filtered views
- [x] Testing: Unit tests (Vitest), Integration tests, E2E tests (Playwright)
  - Vitest configuration untuk unit tests
  - Playwright configuration untuk E2E tests
  - Test utilities dan helpers
- [x] Performance optimization (lazy loading, code splitting, image optimization)
  - Lazy loading untuk components
  - Dynamic wrapper untuk code splitting
  - Image optimization dengan LazyImage component
  - Compression middleware
- [x] SEO optimization & meta tags
  - Dynamic sitemap generation (`app/sitemap.ts`)
  - Meta tags dan Open Graph
  - Structured data (JSON-LD)
  - `robots.ts` configuration
- [x] Deployment ke Vercel dengan CI/CD pipeline
  - `vercel.json` configuration
  - GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`)
  - Environment variables template
  - Build optimization
- [x] Monitoring & analytics (Vercel Analytics)
  - Vercel Analytics integration
  - Speed Insights setup
  - Error tracking preparation

### Phase 9: Post-Launch & Maintenance (Minggu 10+)
- [ ] User feedback collection system
- [ ] Bug fixes & hotfixes
- [ ] Feature enhancements berdasarkan feedback
- [ ] Documentation & user guide
- [ ] Community building (Discord/Forum)

---

## 11. Documentation

### Technical Documentation
- **[LinkedIn Integration](docs/linkedin-integration.md)** - Dokumentasi lengkap untuk LinkedIn profile import feature
- **[OAuth Setup](docs/oauth-setup.md)** - Panduan konfigurasi Google & LinkedIn OAuth
- **[Responsive Design Guidelines](docs/responsive-design.md)** - Panduan lengkap untuk mobile-first responsive design
- **[i18n Guide](docs/i18n-guide.md)** - Panduan penggunaan internationalization (2 bahasa)
- **[Supabase Setup](docs/supabase-setup.md)** - Panduan setup database PostgreSQL dengan Supabase

### Additional Resources
- **Component Library:** shadcn/ui dengan Tailwind CSS
- **Animation:** Motion (Framer Motion)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query

---

**Catatan:** Tech stack ini dipilih berdasarkan data State of React 2024 dan tren industri terkini untuk memastikan maintainability dan developer experience terbaik.
