# AGENTS.md

Guide for AI agents working in the EduStride codebase.

## Project Overview

**EduStride** - Integrated education platform for Indonesian students (SMA to S3) to build digital portfolios and develop industry-relevant skills.

### Tech Stack

- **Framework**: Next.js 15.2.0 with React 19, TypeScript
- **Node.js**: ^18.18.0 || ^19.8.0 || >= 20.0.0 (current: v22.15.0)
- **UI**: Tailwind CSS v4, shadcn/ui (New York style)
- **Animation**: Motion (Framer Motion rebrand)
- **State**: Zustand with persistence
- **Data**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **i18n**: next-intl (locales: `id`, `en`; default: `id`)
- **Icons**: Lucide React
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Auth**: NextAuth.js v5 (Credentials, Google OAuth, LinkedIn OAuth)
- **Caching**: Redis (Upstash ready)

## Quick Start

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint with ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

**No test framework installed yet.** If adding tests:
- Consider Vitest + React Testing Library
- Add to `package.json`: `"test": "vitest"`

## Code Style Guidelines

### Import Order (Strict)

1. React imports
2. Next.js imports
3. Third-party libraries
4. Absolute aliases (`@/`)
5. Relative imports

```typescript
import * as React from "react"
import { Metadata } from "next"
import { create } from "zustand"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Level } from "@/types"
import { useTranslations } from "next-intl"
```

### Formatting

- **Quotes**: Double quotes (`"string"`)
- **Semicolons**: Always use semicolons
- **Indent**: 2 spaces
- **Line width**: ~80-100 characters
- **Trailing commas**: Use in objects/arrays

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Button`, `UserProfile` |
| Files | kebab-case | `user-profile.tsx`, `level-store.ts` |
| Hooks | camelCase with `use` | `useLevelStore`, `usePortfolios` |
| Types/Interfaces | PascalCase | `User`, `LevelState` |
| Constants | UPPER_SNAKE_CASE | `MAX_ITEMS`, `DEFAULT_LOCALE` |
| CSS Classes | kebab-case | `btn-primary`, `card-content` |

### TypeScript Patterns

**Use `type` for:**
- Unions
- Mapped types
- Simple aliases

**Use `interface` for:**
- Object shapes (props, state)
- Extendable definitions

```typescript
export type Level = "SMA" | "S1" | "S2/S3"

export interface User {
  id: string
  name: string
  email: string
  level: Level
  institution: string
  avatar?: string
}

export interface PortfolioProps {
  className?: string
  userId: string
  asChild?: boolean
}
```

**Enable strict mode** (already configured in `tsconfig.json`).

### Component Patterns

**Server Components (Default):**
```typescript
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return { title: t("metadata.title") }
}

export default function Page() {
  return <div>...</div>
}
```

**Client Components:**
```typescript
"use client"

import { useState } from "react"
import { motion } from "motion/react"

export function ClientComponent() {
  const [state, setState] = useState()
  return <motion.div animate={{ opacity: 1 }}>...</motion.div>
}
```

**Component Props Pattern:**
```typescript
function Button({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // Implementation
}
```

### Styling with Tailwind

**Always use `cn()` utility** from `@/lib/utils` for conditional classes:

```typescript
import { cn } from "@/lib/utils"

className={cn(
  "flex items-center gap-2 p-4 rounded-lg transition-colors",
  isActive && "bg-primary text-primary-foreground",
  disabled && "opacity-50 cursor-not-allowed",
  className
)}
```

**Use shadcn/ui CSS variables** for theming:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary`
- `bg-muted`, `text-muted-foreground`
- `border`, `border-primary`

**Modern Design Patterns (2026):**
```typescript
// Glassmorphism
className="bg-white/5 backdrop-blur-xl border border-white/10"

// Gradient backgrounds
className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"

// Gradient text
className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"

// Animated hover effects
className="group hover:scale-105 hover:shadow-2xl transition-all duration-500"
```

### Error Handling

**Use Zod for runtime validation:**
```typescript
import { z } from "zod"

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  level: z.enum(["SMA", "S1", "S2/S3"])
})

const result = userSchema.safeParse(data)
if (!result.success) {
  // Handle error with toast
  toast.error(result.error.errors[0].message)
  return
}
```

**Return early for error states:**
```typescript
if (!user) {
  return <NotFound />
}

if (error) {
  return <ErrorState error={error} />
}
```

### State Management (Zustand)

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LevelState {
  currentLevel: Level
  setLevel: (level: Level) => void
  reset: () => void
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set) => ({
      currentLevel: "S1",
      setLevel: (level) => set({ currentLevel: level }),
      reset: () => set({ currentLevel: "S1" })
    }),
    { name: "level-storage" }
  )
)
```

### i18n (next-intl)

**Server Components:**
```typescript
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations("hero")
  return <h1>{t("title")}</h1>
}
```

**Client Components:**
```typescript
"use client"

import { useTranslations } from "next-intl"

export function ClientComponent() {
  const t = useTranslations("navigation")
  return <h1>{t("home")}</h1>
}
```

**Translation Files:**
- `messages/id.json` - Bahasa Indonesia (default)
- `messages/en.json` - English

**Always support both locales** for user-facing text.

### Data Fetching (TanStack Query)

**Custom Hooks Pattern:**
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function usePortfolios(userId: string) {
  return useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => api.portfolios.getByUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PortfolioData) => api.portfolios.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] })
      toast.success("Portfolio created successfully")
    }
  })
}
```

### Animation (Motion)

**Scroll-triggered animations:**
```typescript
import { motion, useScroll, useTransform } from "motion/react"

export function AnimatedSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <motion.div style={{ opacity }} ref={ref}>
      Content
    </motion.div>
  )
}
```

**Viewport animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

**Hover animations:**
```typescript
<motion.div
  whileHover={{ scale: 1.05, y: -8 }}
  transition={{ duration: 0.2 }}
>
  Card
</motion.div>
```

## Path Aliases

| Alias | Maps To |
|-------|---------|
| `@/components` | `./components` |
| `@/components/ui` | `./components/ui` |
| `@/lib` | `./lib` |
| `@/lib/utils` | `./lib/utils` |
| `@/types` | `./types` |
| `@/hooks` | `./hooks` |
| `@/store` | `./lib/store` |

## File Organization

```
edustride/
├── app/
│   ├── (landing)/           # Landing page route group
│   │   └── page.tsx        # Redesigned landing page (Feb 2026)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── portfolio/
│   │   ├── skills/
│   │   └── ...
│   ├── [locale]/           # Internationalized routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── level-switcher/     # Level switcher component
│   ├── language-switcher/  # Language switcher
│   └── widgets/            # Dashboard widgets
├── hooks/                  # Custom React hooks
│   ├── usePortfolios.ts
│   ├── useSkills.ts
│   └── ...
├── lib/
│   ├── store/              # Zustand stores
│   ├── utils.ts            # Utility functions (cn, etc.)
│   └── api.ts              # API client
├── messages/               # Translation files
│   ├── id.json             # Bahasa Indonesia
│   └── en.json             # English
├── types/                  # TypeScript types
└── prisma/                 # Database schema
```

## Critical Notes

### ✅ Always

- Use `"use client"` for client components (with hooks, state, events)
- Keep components in `@/components/ui` for shadcn
- Use `cn()` utility for all className merging
- Support both `id` and `en` locales for user-facing text
- Default locale is `id` (Indonesian)
- Use hardware-accelerated transforms for animations
- Implement proper error boundaries

### ❌ Never

- Mix server and client component code incorrectly
- Use inline styles (use Tailwind classes)
- Hardcode text without i18n
- Ignore TypeScript errors
- Commit `.env` files
- **Switch database from PostgreSQL to SQLite/MySQL**
- **Delete or modify Prisma migration files**
- **Change tech stack without approval**

---

## 🔒 STRICT RULES - MANDATORY (Feb 2026)

**WARNING: These rules are NON-NEGOTIABLE. Any deviation requires explicit approval.**

### Database (PostgreSQL ONLY)
- ✅ **MUST USE** PostgreSQL via Supabase for production
- ✅ **MUST USE** Prisma ORM v7.4.0 with driver adapter pattern
- ❌ **NEVER** switch to SQLite, MySQL, or other databases
- ❌ **NEVER** remove migrations or schema files
- ✅ Connection pooling via Supabase Session Pooler
- ✅ Environment: `DATABASE_URL` in `.env.local`

### Authentication (NextAuth.js v5)
- ✅ **MUST USE** NextAuth.js v5 with credentials provider
- ✅ **MUST USE** JWT session strategy
- ✅ **MUST USE** bcryptjs for password hashing

### Frontend Stack (Locked)
- ✅ **MUST USE** Next.js 15.2.0 (App Router)
- ✅ **MUST USE** React 19
- ✅ **MUST USE** TypeScript (strict mode)
- ✅ **MUST USE** Tailwind CSS v4
- ✅ **MUST USE** shadcn/ui (New York style)
- ✅ **MUST USE** Motion for animations
- ✅ **MUST USE** next-intl for i18n (id/en)

### State Management (Locked)
- ✅ **MUST USE** Zustand for client state
- ✅ **MUST USE** TanStack Query for server state
- ✅ **MUST USE** nuqs for URL state

### Form Handling (Locked)
- ✅ **MUST USE** React Hook Form + Zod validation

### Before Making Changes
1. Check [`plan.md`](plan.md) for strict rules
2. Check [`COMPLETED_PHASES.md`](COMPLETED_PHASES.md) for current status
3. Verify tech stack compatibility
4. Run `npm run lint` and `npx tsc --noEmit`

**When in doubt, ASK first. Do NOT assume.**

---

## Current Project Status (Feb 2026)

### ✅ Completed Phases

1. **Phase 1-2**: Foundation & Core Features ✅
2. **Phase 2b**: Multi-Language & Responsive Design ✅
3. **Phase 3**: Authentication & Security ✅
4. **Phase 3b**: UI Dashboard Enhancement ✅
5. **Phase 4**: Database, API & Caching ✅
6. **Phase 5**: Portfolio Builder ✅
7. **Phase 6**: Skill Hub ✅
8. **Phase 6b**: Skill Assessment & Quiz System ✅ (Latest - Feb 2026)
9. **Phase 7**: Advanced Dashboard Widgets ✅ (Latest - Feb 2026)
10. **Phase 7b**: Landing Page Redesign ✅
11. **Phase 8**: Integration & Polish ✅ (Latest - Feb 2026)
    - LinkedIn API integration with profile import
    - URL state management with nuqs
    - Testing setup (Vitest + Playwright)
    - Performance optimization
    - SEO optimization & meta tags
    - Vercel deployment & CI/CD
    - Monitoring & analytics

### 🎯 Phase 8: Integration & Polish (Latest Update)

**Complete integration and deployment features:**
- **LinkedIn Profile Import**: Import professional data from LinkedIn
  - OAuth integration with LinkedIn
  - Profile, experience, education, skills import
  - Selective data import with preview
  - Mock data support for development
  - See: [`docs/linkedin-integration.md`](docs/linkedin-integration.md:1)
- **URL State Management**: Type-safe URL state with nuqs
  - Query parameter persistence
  - Shareable filtered views
- **Testing Setup**: Comprehensive test infrastructure
  - Vitest for unit tests
  - Playwright for E2E tests
  - Test utilities and helpers
- **Performance Optimization**: Speed improvements
  - Lazy loading for components
  - Image optimization
  - Code splitting
  - Compression middleware
- **SEO Optimization**: Search engine visibility
  - Dynamic sitemap generation
  - Meta tags and Open Graph
  - Structured data (JSON-LD)
  - robots.txt configuration
- **Deployment**: Production-ready setup
  - Vercel configuration
  - GitHub Actions CI/CD
  - Environment variables template
  - Build optimization
- **Monitoring**: Production insights
  - Vercel Analytics integration
  - Error tracking setup

**Files:**
- `app/api/linkedin/import/route.ts` - LinkedIn import API
- `components/linkedin/linkedin-import.tsx` - LinkedIn import UI
- `hooks/use-linkedin-import.ts` - LinkedIn data hooks
- `lib/testing/` - Test utilities
- `.github/workflows/ci.yml` - CI/CD pipeline
- `scripts/` - Build and deployment scripts

### 🎯 Phase 7: Advanced Dashboard Widgets

**Level-specific interactive widgets:**
- **Career Explorer** (SMA): Interactive career pathway exploration with quiz
  - Jurusan populer dengan data gaji dan permintaan
  - Career matching quiz (3 pertanyaan)
  - Skill & personality match analysis
- **Portfolio Preview** (S1): Live portfolio preview seperti dilihat recruiter
  - Public vs Recruiter view toggle
  - Stats: views, connections, endorsements
  - Project showcase dengan GitHub integration
- **Research Impact** (S2/S3): Research publication & metrics tracking
  - h-Index, i10-Index, citation tracking
  - Q1/Q2 journal classification
  - Research areas distribution
- **Analytics Dashboard**: Comprehensive analytics & insights
  - Portfolio views & profile visits tracking
  - Skill growth charts over time
  - Traffic sources & engagement metrics
  - Personalized insights & recommendations
- **Notification Center**: Smart notification system
  - Deadline reminders
  - Achievement notifications
  - Learning recommendations
  - System updates
- **Dark Mode**: Theme toggle (Light/Dark/System) in header

**Files:**
- `components/widgets/career-explorer.tsx` - SMA career exploration widget
- `components/widgets/portfolio-preview.tsx` - S1 portfolio preview widget
- `components/widgets/research-impact.tsx` - S2/S3 research tracking widget
- `components/widgets/analytics-dashboard.tsx` - Analytics & insights widget
- `components/widgets/notification-center.tsx` - Notification system widget
- `components/widgets/index.ts` - Widget exports
- `components/dashboard/dashboard-content.tsx` - Updated with level-specific widgets

### 🎯 Phase 6b: Quiz System

**Complete quiz & assessment system:**
- Quiz CRUD API endpoints
- Interactive quiz-taking interface with timer
- Auto-scoring system with skill progress boost
- Quiz results page with answer review
- Multiple choice & True/False questions
- Attempt history tracking

**Files:**
- `lib/validations/quiz.ts` - Quiz validation schemas
- `hooks/use-quizzes.ts` - TanStack Query hooks
- `app/api/quizzes/**` - Quiz API endpoints
- `app/[locale]/dashboard/quiz/**` - Quiz pages (list, create, take, results)

### 🎨 Landing Page Redesign

**Redesigned with 2026 trends:**
- Glassmorphism & animated gradients
- Bento grid layout for features
- Bold typography with gradient text
- Scroll-triggered animations
- Trust badges & social proof
- Enhanced copywriting (trustworthy, specific)

**Files:**
- `app/[locale]/(landing)/page.tsx` - Complete redesign
- `messages/id.json` - Enhanced translations
- `messages/en.json` - Enhanced translations

### 🗄️ Database Setup

**PostgreSQL via Supabase:**
- Connection: Session Pooler (IPv4 compatible)
- ORM: Prisma v7.4.0
- Migrations: `init`, `add_quiz_assessment`, `add_badge_system` ✅ Applied

**Models:**
- User, Account, Session (Auth)
- Portfolio, Skill, Roadmap
- Achievement, Activity, UserStats
- Quiz, QuizQuestion, QuizAttempt, QuizAnswer (New!)
- Badge, UserBadge (New!)

**Commands:**
```bash
npx prisma migrate dev --name init  # Migrations
npx prisma generate                 # Generate Prisma Client
npx prisma studio                   # Open Prisma Studio GUI
```

### 🔐 Authentication

**NextAuth.js v5 configured:**
- Credentials (email/password)
- Google OAuth (ready)
- LinkedIn OAuth (ready)
- JWT sessions
- Protected routes middleware

**Demo Mode:**
- Dashboard accessible without login (development)
- Demo accounts available via `/api/seed`

### 📊 API Endpoints

- `/api/auth/*` - Authentication
- `/api/portfolio/*` - Portfolio CRUD
- `/api/skills/*` - Skill management
- `/api/roadmap/*` - Roadmap operations
- `/api/activities/*` - Activity feed
- `/api/quizzes/*` - Quiz CRUD & attempts (New!)
- `/api/seed` - Database seeder

### 🛠️ Cache System

**In-memory cache (no Redis required):**
- `lib/cache.ts` - Map-based cache with TTL
- Automatic expiry handling
- Pattern-based invalidation
- Works without external dependencies

### 🚀 Demo Credentials (after seeding)

| Email | Password | Level |
|-------|----------|-------|
| demo@edustride.id | password123 | S1 |
| sma@edustride.id | password123 | SMA |
| s2@edustride.id | password123 | S2/S3 |

## Known Issues & Configuration

### Next.js Version
- **Current**: 15.2.0 (stable)
- **Note**: Downgraded from 16.1.6 due to Turbopack instability with dynamic routes

### Configuration
- `next.config.ts`: Removed deprecated `swcMinify` option
- `middleware.ts`: Using legacy convention (migrate to `proxy.ts` in future)

### Node.js Requirements
- Minimum: 18.18.0
- Recommended: 20.x LTS or 22.x
- Current: v22.15.0

## Design System

### Color Palette

**Primary Gradients:**
```typescript
// Brand gradient
"from-violet-600 via-purple-600 to-fuchsia-600"

// Secondary gradient
"from-blue-600 via-cyan-600 to-teal-600"

// Accent gradient
"from-orange-600 via-pink-600 to-rose-600"
```

**Semantic Colors:**
- `background`, `foreground` - Base colors
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary actions
- `muted`, `muted-foreground` - Subtle text
- `accent`, `accent-foreground` - Highlights
- `destructive` - Errors/danger

### Typography Scale

```typescript
// Headings
text-4xl md:text-6xl lg:text-7xl  // H1
text-3xl md:text-5xl              // H2
text-2xl md:text-3xl              // H3
text-xl                           // H4

// Body
text-lg                           // Large body
text-base                         // Default
text-sm                           // Small
text-xs                           // Caption
```

### Spacing System

Use Tailwind's spacing scale:
- `p-4` (16px), `p-6` (24px), `p-8` (32px), `p-12` (48px), `p-16` (64px)
- `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)

### Border Radius

```typescript
rounded-lg   // 8px - Small cards
rounded-xl   // 12px - Default cards
rounded-2xl  // 16px - Large cards
rounded-3xl  // 24px - Hero sections
```

### Shadows

```typescript
shadow-lg      // Default elevation
shadow-xl      // Hover states
shadow-2xl     // Hero elements
shadow-primary/25  // Colored shadows
```

## Testing Guidelines (Future)

When adding tests:

```typescript
// Vitest + React Testing Library
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
})
```

## Deployment

**Target**: Vercel

**Environment Variables:**
```env
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://edustride.com

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Caching (optional)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## Resources

- **[Plan Document](plan.md)** - Full project roadmap
- **[LinkedIn Integration](docs/linkedin-integration.md)** - LinkedIn profile import feature documentation
- **[OAuth Setup](docs/oauth-setup.md)** - Google & LinkedIn OAuth configuration
- **[shadcn/ui](https://ui.shadcn.com/)** - Component documentation
- **[Motion](https://motion.dev/)** - Animation library
- **[TanStack Query](https://tanstack.com/query)** - Data fetching
- **[next-intl](https://next-intl.dev/)** - Internationalization

---

**Last Updated**: February 19, 2026
**Version**: 2.1
