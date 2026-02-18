# AGENTS.md

Guide for AI agents working in the EduStride codebase.

## Project Overview

- **Framework**: Next.js 15.2.0 with React 19, TypeScript
- **Node.js**: ^18.18.0 || ^19.8.0 || >= 20.0.0 (current: v22.15.0)
- **UI**: Tailwind CSS v4, shadcn/ui (New York style)
- **State**: Zustand with persistence
- **Data**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl (locales: id, en; default: id)
- **Icons**: Lucide React

## Build/Lint Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint with ESLint
npm run lint

# Type checking (no direct script - use tsc directly)
npx tsc --noEmit
```

**No test framework is currently installed.** If adding tests:
- Consider Vitest + React Testing Library
- Add test script: `"test": "vitest"`
- Add single test script: `"test:single": "vitest run <pattern>"`

## Code Style Guidelines

### Imports (Priority Order)

1. React imports
2. Next.js imports
3. Third-party libraries
4. Absolute aliases (@/components, @/lib, @/types, @/hooks)
5. Relative imports

```typescript
import * as React from "react"
import { Metadata } from "next"
import { create } from "zustand"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Level } from "@/types"
```

### Formatting

- **Quotes**: Double quotes for strings, JSX
- **Semicolons**: Use semicolons consistently
- **Indent**: 2 spaces
- **Trailing commas**: Use where appropriate
- **Line width**: ~80-100 characters

### Naming Conventions

- **Components**: PascalCase (`Button`, `UserProfile`)
- **Files**: kebab-case (`user-profile.tsx`, `level-store.ts`)
- **Hooks**: camelCase with `use` prefix (`useLevelStore`)
- **Types/Interfaces**: PascalCase (`User`, `LevelState`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **CSS classes**: kebab-case (Tailwind utilities)

### TypeScript Types

- Use `type` for unions, mapped types, simple aliases
- Use `interface` for object shapes (props, state)
- Enable strict mode (already configured)
- Prefer explicit return types on exported functions

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
```

### Component Patterns

**Server Components (default)**:
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "EduStride"
}

export default function Page() {
  return <div>...</div>
}
```

**Client Components**:
```typescript
"use client"

import { useState } from "react"

export function ClientComponent() {
  const [state, setState] = useState()
  return <div>...</div>
}
```

**Component Props Pattern**:
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

- Use `cn()` utility from `@/lib/utils` for conditional classes
- Use shadcn/ui CSS variables for theming
- Follow `@theme inline` pattern for custom properties

```typescript
import { cn } from "@/lib/utils"

className={cn(
  "flex items-center gap-2",
  isActive && "bg-primary text-primary-foreground",
  className
)}
```

### Error Handling

- Use Zod for runtime validation
- Return early for error states
- Use React Error Boundaries for client components

```typescript
import { z } from "zod"

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
})

const result = userSchema.safeParse(data)
if (!result.success) {
  // Handle error
}
```

### State Management (Zustand)

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface State {
  value: string
  setValue: (value: string) => void
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      value: "",
      setValue: (value) => set({ value })
    }),
    { name: "store-name" }
  )
)
```

### i18n (next-intl)

```typescript
// Server component
import { getMessages } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"

// Client component
import { useTranslations } from "next-intl"

export function Component() {
  const t = useTranslations("navigation")
  return <h1>{t("home")}</h1>
}
```

## Path Aliases

- `@/components` → `./components`
- `@/components/ui` → `./components/ui`
- `@/lib` → `./lib`
- `@/lib/utils` → `./lib/utils`
- `@/types` → `./types`
- `@/hooks` → `./hooks`

## File Organization

```
app/
  (group)/          # Route groups
  [locale]/         # i18n routes
components/
  ui/               # shadcn components
  providers/        # Context providers
lib/
  store/            # Zustand stores
  data/             # Static data
  utils.ts          # Utility functions
types/
  index.ts          # Global types
messages/
  en.json           # English translations
  id.json           # Indonesian translations
```

## Critical Notes

- Always use `"use client"` for client components
- Keep components in `@/components/ui` for shadcn
- Use `cn()` utility for all className merging
- Support both `id` and `en` locales for all user-facing text
- Default locale is `id` (Indonesian)

## Known Issues & Configuration Changes

### Next.js Version (Updated Feb 2026)
- **Current Version**: 15.2.0 (downgraded from 16.1.6 due to Turbopack instability)
- **Reason**: Next.js 16.1.6 had Turbopack panic errors with dynamic `[locale]` routes
- **Solution**: Using Webpack (Turbopack disabled) for stable development

### Configuration Changes
1. **next.config.ts**: Removed deprecated `swcMinify` option (no longer valid in Next.js 15+)
2. **middleware.ts**: Still using legacy middleware convention (deprecated, migrate to `proxy.ts` in future)
3. **Demo Mode**: Authentication bypassed for development
   - Removed `AuthSessionProvider` from layout (session API errors)
   - Removed `ProtectedRoute` from dashboard pages
   - Dashboard accessible without login at `/dashboard`
   - Using `DemoUserMenu` component for demo user display

### Authentication Setup (For Production)
1. **Current**: JWT-only auth config (no database adapter)
2. **Providers**: Credentials, Google OAuth, LinkedIn OAuth
3. **To enable full auth**:
   - Setup PostgreSQL database
   - Uncomment PrismaAdapter in `auth.ts`
   - Add `AuthSessionProvider` back to layout
   - Wrap protected pages with `ProtectedRoute`
   - Configure OAuth credentials in `.env`

### Node.js Requirements
- Minimum: Node.js 18.18.0
- Recommended: Node.js 20.x LTS or 22.x
- Current: v22.15.0

### Database Setup (Phase 4) ✅ COMPLETED
1. **Database**: PostgreSQL via Supabase (configured in `.env.local`)
   - Using **Session Pooler** for IPv4 compatibility
   - Connection: `aws-1-ap-southeast-1.pooler.supabase.com:5432`
2. **ORM**: Prisma with full schema
   - Models: User, Account, Session, Portfolio, Skill, Roadmap, Achievement, Activity
   - Migration: `20260218060442_init` ✅ Applied
   - Prisma Client: v7.4.0 ✅ Generated
3. **API Endpoints**:
   - `/api/portfolio/*` - CRUD operations for portfolio
   - `/api/skills/*` - Skill management
   - `/api/roadmap/*` - Roadmap with nested items
   - `/api/activities/*` - Activity feed
4. **Documentation**: See `docs/supabase-setup.md`

**Commands:**
```bash
npx prisma migrate dev --name init  # Create & apply migrations
npx prisma generate                 # Generate Prisma Client
npx prisma studio                   # Open Prisma Studio (DB GUI)
```

### Caching (Redis)
- **Setup**: Redis via Upstash (configured in `.env.local`)
- **Utilities**: `lib/cache.ts` - `getCache`, `setCache`, `deleteCache`
- **Hooks**: All data fetching hooks use automatic caching

### TanStack Query Hooks
- `usePortfolios`, `useSkills`, `useRoadmaps`, `useActivities`
- Located in `hooks/` directory
- Automatic caching and optimistic updates

### Database Seeder
- **Endpoint**: `/api/seed`
- **Methods**:
  - `GET` - Check seed status
  - `POST` - Seed database with sample data
  - `POST ?force=true` - Force re-seed (delete existing)

**Usage:**
```bash
# Check status
curl http://localhost:3000/api/seed

# Seed database
curl -X POST http://localhost:3000/api/seed

# Force re-seed
curl -X POST "http://localhost:3000/api/seed?force=true"
```

**Demo Credentials (after seeding):**
| Email | Password | Level | Name |
|-------|----------|-------|------|
| demo@edustride.id | password123 | S1 | Demo Student |
| sma@edustride.id | password123 | SMA | SMA Student |
| s2@edustride.id | password123 | S2/S3 | Graduate Student |

### Demo Mode Access
- **Dashboard**: http://localhost:3000/dashboard
- **Auth Flow**: Full authentication with database working ✅
- **Protected Routes**: Dashboard wrapped with ProtectedRoute ✅
- **Session Management**: NextAuth.js with JWT ✅
- **OAuth Ready**: Google & LinkedIn providers configured ✅
