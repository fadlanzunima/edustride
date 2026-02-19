# EduStride Architecture Documentation

## System Overview

EduStride is a full-stack Next.js 15 application with modern architecture patterns.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Browser   │  │   Browser   │  │   Browser   │              │
│  │   (User 1)  │  │   (User 2)  │  │   (User N)  │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼────────────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
                    ┌──────▼──────┐
                    │    CDN      │
                    │  (Vercel)   │
                    └──────┬──────┘
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                    Server Layer (Next.js)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js 15 App Router                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │   Server    │  │   Server    │  │    API      │     │   │
│  │  │ Components  │  │   Actions   │  │   Routes    │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Client Components (Interactive)             │   │
│  │         Hooks, State Management, Animations             │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬─────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │   Prisma    │ │  NextAuth   │ │    Redis    │
    │    ORM      │ │     v5      │ │  (Upstash)  │
    └──────┬──────┘ └─────────────┘ └─────────────┘
           │
    ┌──────▼──────────────────────────────┐
    │      PostgreSQL (Supabase)          │
    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
    │  │  Users  │ │Portfolios│ │ Skills  │ │
    │  └─────────┘ └─────────┘ └─────────┘ │
    └─────────────────────────────────────┘
```

---

## Tech Stack

### Core Framework
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 15.2.0 | Full-stack React framework |
| Language | TypeScript | 5.x | Type safety |
| Runtime | Node.js | 18+ / 20+ | JavaScript runtime |
| React | React | 19.x | UI library |

### Database & ORM
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Database | PostgreSQL (Supabase) | Primary data store |
| ORM | Prisma | Database access layer |
| Pooling | Supabase Session Pooler | Connection management |

### Authentication
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Auth | NextAuth.js v5 | Authentication framework |
| Strategy | JWT | Stateless session management |
| Password | bcryptjs | Password hashing |
| OAuth | Google, LinkedIn | Social login |

### UI & Styling
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui | Pre-built UI components |
| Icons | Lucide React | Icon library |
| Animation | Motion | Animation library |

### State Management
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Server State | TanStack Query | Data fetching & caching |
| Client State | Zustand | Global client state |
| URL State | nuqs | Type-safe URL parameters |

### Forms & Validation
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Forms | React Hook Form | Form management |
| Validation | Zod | Schema validation |

### Internationalization
| Component | Technology | Purpose |
|-----------|-----------|---------|
| i18n | next-intl | Multi-language support |
| Locales | id, en | Indonesian & English |

---

## Application Architecture

### 1. App Router Structure

```
app/
├── layout.tsx              # Root layout (Server Component)
├── globals.css             # Global styles
├── [locale]/               # Internationalized routes
│   ├── layout.tsx          # Locale layout
│   ├── page.tsx            # Home page (redirects)
│   ├── (landing)/          # Landing page route group
│   │   ├── layout.tsx
│   │   └── page.tsx        # Marketing landing page
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Registration page
│   └── dashboard/          # Protected dashboard
│       ├── layout.tsx      # Dashboard shell
│       ├── page.tsx        # Dashboard home
│       ├── portfolio/      # Portfolio management
│       ├── skills/         # Skill tracking
│       ├── quiz/           # Quiz system
│       ├── achievements/   # Gamification
│       └── settings/       # User settings
├── api/                    # API routes
│   ├── auth/               # NextAuth.js endpoints
│   ├── portfolio/          # Portfolio API
│   ├── skills/             # Skills API
│   ├── quizzes/            # Quiz API
│   └── ...
├── sitemap.ts              # Dynamic sitemap
└── robots.ts               # Robots.txt
```

### 2. Component Architecture

#### Server vs Client Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Page Component                           │
│                      (Server)                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │   Layout    │ │  Dashboard  │ │   Widget    │
    │   (Server)  │ │   Content   │ │   (Server)  │
    └─────────────┘ │  (Server)   │ └─────────────┘
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  Interactive│ │   Charts    │ │   Forms     │
    │   Button    │ │  (Client)   │ │  (Client)   │
    │  (Client)   │ │             │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘

Rule of Thumb:
- Default to Server Components
- Add "use client" only when needed:
  * Browser APIs (localStorage, window)
  * React hooks (useState, useEffect)
  * Event handlers (onClick, onSubmit)
  * Third-party libraries requiring DOM
```

#### Component Hierarchy Example

```tsx
// app/[locale]/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  const session = await auth();
  const stats = await getUserStats(session.user.id);

  return (
    <DashboardShell>
      <DashboardContent stats={stats} />
    </DashboardShell>
  );
}

// components/dashboard/dashboard-content.tsx (Server)
export function DashboardContent({ stats }) {
  return (
    <div>
      <StatCards stats={stats} />          {/* Server */}
      <ActivityFeed userId={stats.id} />   {/* Server */}
      <QuickActions />                     {/* Client */}
    </div>
  );
}

// components/dashboard/quick-actions.tsx (Client)
"use client";

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button onClick={() => setIsOpen(true)}>
      Quick Action
    </Button>
  );
}
```

### 3. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Flow                                 │
└─────────────────────────────────────────────────────────────────┘

1. Server Component Data Fetching:
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Server  │────▶│  Prisma  │────▶│    DB    │
   │Component │◄────│   ORM    │◄────│          │
   └──────────┘     └──────────┘     └──────────┘
        │
        ▼
   ┌──────────┐
   │   HTML   │
   │  (RSC)   │
   └──────────┘

2. Client Component Data Fetching (TanStack Query):
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  Client  │────▶│  API     │────▶│  Prisma  │
   │Component │◄────│  Route   │◄────│   ORM    │
   └──────────┘     └──────────┘     └──────────┘
        │                                  │
        │                             ┌────┴────┐
        │                             │    DB   │
        │                             └─────────┘
        │
        ▼
   ┌──────────┐
   │   Cache  │
   │  (React  │
   │  Query)  │
   └──────────┘

3. Server Actions (Form Submissions):
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │   Form   │────▶│  Server  │────▶│  Prisma  │
   │  (Client)│◄────│  Action  │◄────│   ORM    │
   └──────────┘     └──────────┘     └──────────┘
        │                                  │
        │                             ┌────┴────┐
        │                             │    DB   │
        │                             └─────────┘
        ▼
   ┌──────────┐
   │Revalidate│
   │  Cache   │
   └──────────┘
```

---

## State Management

### 1. Server State (TanStack Query)

```typescript
// hooks/use-portfolios.ts
export function usePortfolios(userId: string) {
  return useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => fetch(`/api/portfolio?userId=${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in component
export function PortfolioList({ userId }: { userId: string }) {
  const { data, isLoading, error } = usePortfolios(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;

  return (
    <div>
      {data.map(portfolio => <PortfolioCard key={portfolio.id} {...portfolio} />)}
    </div>
  );
}
```

### 2. Client State (Zustand)

```typescript
// lib/store/level-store.ts
interface LevelState {
  currentLevel: Level;
  setLevel: (level: Level) => void;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set) => ({
      currentLevel: "S1",
      setLevel: (level) => set({ currentLevel: level }),
    }),
    { name: "level-storage" }
  )
);
```

### 3. URL State (nuqs)

```typescript
// hooks/use-dashboard-search.ts
import { useQueryState } from "nuqs";

export function useDashboardSearch() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 300,
  });

  return { search, setSearch };
}
```

---

## API Architecture

### RESTful API Design

```
Base URL: /api

Authentication:
  POST   /auth/register          # Register new user
  POST   /auth/callback/credentials  # Login
  GET    /auth/session           # Get current session

Portfolio:
  GET    /portfolio              # List user's portfolios
  POST   /portfolio              # Create portfolio
  GET    /portfolio/:id          # Get portfolio details
  PATCH  /portfolio/:id          # Update portfolio
  DELETE /portfolio/:id          # Delete portfolio

Skills:
  GET    /skills                 # List skills
  POST   /skills                 # Add skill
  PATCH  /skills/:id             # Update skill
  DELETE /skills/:id             # Delete skill

Quizzes:
  GET    /quizzes                # List quizzes
  POST   /quizzes                # Create quiz
  GET    /quizzes/:id            # Get quiz details
  POST   /quizzes/:id/attempts   # Submit quiz attempt
  GET    /quizzes/:id/attempts   # Get attempt history
```

### API Response Format

```typescript
// Standard Response Structure
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Success Example
{
  "data": {
    "id": "abc123",
    "title": "My Portfolio",
    "description": "..."
  }
}

// Error Example
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [{
      "field": "title",
      "message": "Title is required"
    }]
  }
}
```

---

## Authentication Flow

### JWT Session Architecture

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Login  │───▶│  Auth   │───▶│  JWT    │───▶│  Cookie │
│ Request │    │  Check  │    │  Token  │    │  (HTTP  │
│         │    │         │    │         │    │  only)  │
└─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                   │
                        ┌──────────────────────────┘
                        │
                        ▼
                   ┌─────────┐
                   │ Browser │
                   │ Storage │
                   └────┬────┘
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
     ▼                  ▼                  ▼
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Request │      │ Request │      │ Request │
│   #1    │      │   #2    │      │   #N    │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     └────────────────┴────────────────┘
                      │
                      ▼
               ┌─────────────┐
               │  JWT Verify │
               │  Middleware │
               └─────────────┘
```

### Session Lifecycle

1. **Login**: Credentials validated → JWT created → HTTP-only cookie set
2. **Subsequent Requests**: Cookie automatically sent → JWT verified
3. **Session Refresh**: JWT expires → Re-authentication required
4. **Logout**: Cookie cleared → Session terminated

---

## Caching Strategy

### Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────────┐
│                    Caching Layers                            │
└─────────────────────────────────────────────────────────────┘

1. Browser Cache (Static Assets)
   ┌─────────────────────────────────────┐
   │  /_next/static/*                    │
   │  /images/*                          │
   │  Cache-Control: public, max-age=31536000, immutable │
   └─────────────────────────────────────┘

2. CDN Cache (Vercel Edge)
   ┌─────────────────────────────────────┐
   │  Static pages                       │
   │  ISR pages                          │
   │  Cache-Control: s-maxage=3600       │
   └─────────────────────────────────────┘

3. React Cache (Server Components)
   ┌─────────────────────────────────────┐
   │  unstable_cache                     │
   │  Revalidate: 60s                    │
   └─────────────────────────────────────┘

4. TanStack Query Cache (Client)
   ┌─────────────────────────────────────┐
   │  In-memory cache                    │
   │  Stale time: 5 minutes              │
   │  Cache time: 10 minutes             │
   └─────────────────────────────────────┘

5. Prisma Query Cache (Optional Redis)
   ┌─────────────────────────────────────┐
   │  Upstash Redis                      │
   │  TTL: 60 seconds                    │
   └─────────────────────────────────────┘
```

### Cache Invalidation

```typescript
// Example: Invalidate after mutation
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createPortfolio,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["portfolios"] });
  },
});
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Stack                            │
└─────────────────────────────────────────────────────────────┘

Layer 1: Network
  - HTTPS only (TLS 1.3)
  - Security headers (HSTS, CSP, X-Frame-Options)
  - DDoS protection (Vercel Edge)

Layer 2: Application
  - Input validation (Zod)
  - SQL injection prevention (Prisma)
  - XSS protection (React escapes by default)
  - CSRF protection (SameSite cookies)

Layer 3: Authentication
  - Password hashing (bcryptjs, 12 rounds)
  - JWT with short expiry
  - HTTP-only cookies
  - Rate limiting on auth endpoints

Layer 4: Authorization
  - Middleware route protection
  - Resource-level access control
  - Principle of least privilege
```

### Security Headers

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co;",
        },
      ],
    },
  ];
}
```

---

## Performance Optimization

### Optimization Strategies

```
1. Code Splitting
   ┌────────────────────────────────────────┐
   │  Route-based splitting                 │
   │  Component lazy loading                │
   │  Dynamic imports for heavy components  │
   └────────────────────────────────────────┘

2. Image Optimization
   ┌────────────────────────────────────────┐
   │  Next.js Image component               │
   │  Automatic WebP conversion             │
   │  Responsive images                     │
   │  Lazy loading                          │
   └────────────────────────────────────────┘

3. Font Optimization
   ┌────────────────────────────────────────┐
   │  next/font for local fonts             │
   │  Font display: swap                    │
   │  Preload critical fonts                │
   └────────────────────────────────────────┘

4. Bundle Optimization
   ┌────────────────────────────────────────┐
   │  Tree shaking                          │
   │  Dead code elimination                 │
   │  Minification (Terser)                 │
   │  Compression (Brotli, Gzip)            │
   └────────────────────────────────────────┘
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                       Vercel Platform                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Build     │  │   Deploy    │  │   Edge      │             │
│  │   (CI/CD)   │  │  (Serverless│  │   Network   │             │
│  │             │  │   Functions)│  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│  Region: auto (Singapore, Tokyo, etc.)                          │
│  Node.js: v22                                                   │
│  Next.js: 15.2.0                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Configuration

```env
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://edustride.com
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
AUTH_TRUST_HOST=true

# OAuth Providers
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_LINKEDIN_ID=...
AUTH_LINKEDIN_SECRET=...

# Optional
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Monitoring & Observability

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     Observability Stack                          │
├─────────────────────────────────────────────────────────────────┤
│  Performance:                                                   │
│  - Vercel Analytics (Web Vitals)                               │
│  - Next.js built-in reporting                                  │
│                                                                 │
│  Error Tracking:                                                │
│  - Vercel Error Monitoring                                     │
│  - Console logging                                             │
│                                                                 │
│  Logs:                                                          │
│  - Vercel Log Drains                                           │
│  - Runtime logs                                                │
│                                                                 │
│  User Analytics:                                                │
│  - Privacy-focused (no external trackers)                      │
│  - Self-hosted if needed                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
edustride/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Internationalized routes
│   ├── api/                   # API routes
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   ├── sitemap.ts             # Dynamic sitemap
│   └── robots.ts              # Robots.txt
│
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/             # Dashboard-specific
│   ├── portfolio/             # Portfolio components
│   ├── widgets/               # Dashboard widgets
│   ├── auth/                  # Authentication components
│   ├── providers/             # Context providers
│   └── ...
│
├── lib/                        # Utility functions
│   ├── prisma.ts              # Prisma client
│   ├── cache.ts               # Cache utilities
│   ├── api.ts                 # API client
│   ├── utils.ts               # General utilities
│   └── store/                 # Zustand stores
│
├── hooks/                      # Custom React hooks
│   ├── use-portfolios.ts
│   ├── use-skills.ts
│   └── ...
│
├── types/                      # TypeScript types
│   └── index.ts
│
├── prisma/                     # Database schema
│   └── schema.prisma
│
├── messages/                   # i18n translations
│   ├── id.json                # Indonesian
│   └── en.json                # English
│
├── docs/                       # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── AUTHENTICATION_FLOW.md
│   ├── DATABASE_SCHEMA.md
│   └── ARCHITECTURE.md
│
├── public/                     # Static assets
│   └── images/
│
└── tests/                      # Test files
    ├── unit/
    └── e2e/
```

---

## Best Practices

### Development
1. **Type Safety**: Use strict TypeScript mode
2. **Code Style**: Follow ESLint rules
3. **Component Design**: Prefer composition over inheritance
4. **State Management**: Keep state as close to usage as possible

### Performance
1. **Lazy Loading**: Use `dynamic` imports for heavy components
2. **Image Optimization**: Always use `next/image`
3. **Font Loading**: Use `next/font` for custom fonts
4. **Bundle Size**: Monitor with `@next/bundle-analyzer`

### Security
1. **Input Validation**: Validate all inputs with Zod
2. **Authentication**: Always use middleware for protected routes
3. **Environment Variables**: Never expose secrets to client
4. **Dependencies**: Keep dependencies updated

### Testing
1. **Unit Tests**: Test utilities and hooks
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test critical user flows
4. **Visual Regression**: Test UI components
