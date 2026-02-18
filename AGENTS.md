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

## Current Project Status (Feb 2026)

### ✅ Completed Phases

1. **Phase 1-2**: Foundation & Core Features ✅
2. **Phase 2b**: Multi-Language & Responsive Design ✅
3. **Phase 3**: Authentication & Security ✅
4. **Phase 3b**: UI Dashboard Enhancement ✅
5. **Phase 4**: Database, API & Caching ✅
6. **Phase 5**: Portfolio Builder ✅
7. **Phase 6**: Skill Hub ✅
8. **Phase 7b**: Landing Page Redesign ✅ (Latest - Feb 2026)

### 🎨 Landing Page (Latest Update)

**Redesigned with 2026 trends:**
- Glassmorphism & animated gradients
- Bento grid layout for features
- Bold typography with gradient text
- Scroll-triggered animations
- Trust badges & social proof
- Enhanced copywriting (trustworthy, specific)

**Files:**
- `app/(landing)/page.tsx` - Complete redesign
- `messages/id.json` - Enhanced translations
- `messages/en.json` - Enhanced translations

### 🗄️ Database Setup

**PostgreSQL via Supabase:**
- Connection: Session Pooler (IPv4 compatible)
- ORM: Prisma v7.4.0
- Migration: `20260218060442_init` ✅ Applied

**Models:**
- User, Account, Session (Auth)
- Portfolio, Skill, Roadmap
- Achievement, Activity, UserStats

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
- `/api/seed` - Database seeder

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
- **[shadcn/ui](https://ui.shadcn.com/)** - Component documentation
- **[Motion](https://motion.dev/)** - Animation library
- **[TanStack Query](https://tanstack.com/query)** - Data fetching
- **[next-intl](https://next-intl.dev/)** - Internationalization

---

**Last Updated**: February 18, 2026
**Version**: 2.0
