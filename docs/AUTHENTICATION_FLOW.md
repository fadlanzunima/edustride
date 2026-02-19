# EduStride Authentication Flow Documentation

## Overview

EduStride implements a secure authentication system using **NextAuth.js v5** with JWT (JSON Web Token) session strategy. The system supports three authentication providers:

1. **Credentials** (Email/Password)
2. **Google OAuth**
3. **LinkedIn OAuth**

---

## Architecture

### Session Strategy: JWT

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Next.js   │────▶│   Prisma    │
│  (Browser)  │◄────│   API Route │◄────│  (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        │
       │         JWT Token (HTTP-only)          │
       └────────────────────────────────────────┘
```

### Why JWT?
- **Stateless**: No database session storage required
- **Scalable**: Works with serverless/edge functions
- **Secure**: HTTP-only cookies prevent XSS attacks
- **Compatible**: Works well with Prisma driver adapters

---

## Authentication Providers

### 1. Credentials Provider

#### Flow
```
User Login          Server Validation           Database
    │                       │                       │
    ▼                       ▼                       ▼
┌────────┐           ┌────────────┐          ┌──────────┐
│ Email  │──────────▶│  Validate  │─────────▶│ Find User│
│Password│           │   Input    │          │  by Email│
└────────┘           └────────────┘          └────┬─────┘
    │                       │                      │
    │                       │                      ▼
    │                       │               ┌──────────┐
    │                       │               │ Compare  │
    │                       │               │Password  │
    │                       │               │(bcryptjs)│
    │                       │               └────┬─────┘
    │                       │                    │
    ▼                       ▼                    ▼
┌─────────────────────────────────────────────────────┐
│              Return User Object                      │
│         (id, email, name, image, level)             │
└─────────────────────────────────────────────────────┘
```

#### Implementation
```typescript
// auth.ts - Credentials Provider
Credentials({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // 1. Validate input with Zod
    const parsed = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }).safeParse(credentials);

    if (!parsed.success) return null;

    // 2. Find user in database
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user || !user.password) return null;

    // 3. Compare password with bcryptjs
    const isValid = await compare(parsed.data.password, user.password);
    if (!isValid) return null;

    // 4. Return user data (stored in JWT)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      level: user.level,
      institution: user.institution,
    };
  },
});
```

---

### 2. Google OAuth Provider

#### Flow
```
     User                    EduStride              Google
       │                         │                     │
       ▼                         ▼                     ▼
┌────────────┐           ┌──────────────┐      ┌──────────┐
│ Click Login│──────────▶│  Redirect to │─────▶│  Google  │
│ with Google│           │   Google     │      │  OAuth   │
└────────────┘           └──────────────┘      └────┬─────┘
       │                         │                  │
       │                         │◀─────────────────┘
       │                         │    Authorization
       │                         │    Code + Profile
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │   Callback   │
       │                  │   Handler    │
       │                  └──────┬───────┘
       │                         │
       │                         ▼
       │                  ┌──────────────┐
       │                  │  Create/Link │
       │                  │    Account   │
       │                  └──────┬───────┘
       │                         │
       ▼                         ▼
┌─────────────────────────────────────────┐
│         Session Created                 │
│    (JWT with user profile image)        │
└─────────────────────────────────────────┘
```

#### Configuration
```typescript
Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
  allowDangerousEmailAccountLinking: true, // Allow linking to existing accounts
});
```

#### Profile Data Retrieved
- `name`: Full name
- `email`: Email address
- `picture`: Profile image URL
- `sub`: Google user ID

---

### 3. LinkedIn OAuth Provider

#### Flow
Similar to Google OAuth but retrieves professional profile data:
- `name`: Full name
- `email`: Email address
- `picture`: Profile image URL
- `sub`: LinkedIn user ID

#### Configuration
```typescript
LinkedIn({
  clientId: process.env.AUTH_LINKEDIN_ID,
  clientSecret: process.env.AUTH_LINKEDIN_SECRET,
  allowDangerousEmailAccountLinking: true,
});
```

---

## JWT Callback Flow

### Token Lifecycle

```
Initial Sign-In              Subsequent Requests
       │                            │
       ▼                            ▼
┌────────────┐              ┌────────────┐
│  User      │              │  JWT Token │
│  Object    │              │  (Cookie)  │
│  from DB   │              │            │
└─────┬──────┘              └─────┬──────┘
      │                           │
      ▼                           ▼
┌─────────────────────────────────────────┐
│              JWT Callback               │
│  ┌─────────────────────────────────┐   │
│  │ 1. Add custom fields:           │   │
│  │    - id                         │   │
│  │    - level                      │   │
│  │    - institution                │   │
│  │    - image                      │   │
│  │ 2. Handle session updates       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                   │
                   ▼
        ┌─────────────────┐
        │  Encoded JWT    │
        │  (HTTP-only     │
        │   cookie)       │
        └─────────────────┘
```

### JWT Callback Implementation
```typescript
async jwt({ token, user, trigger, session, account, profile }) {
  // Initial sign-in: copy user data to token
  if (user) {
    token.id = user.id;
    token.level = user.level;
    token.institution = user.institution;
    token.image = user.image;
  }

  // OAuth sign-in: extract profile image
  if (account && profile) {
    const imageUrl = profile.image ?? profile.picture ?? profile.avatar_url ?? null;
    if (imageUrl) {
      token.image = imageUrl;
    }
  }

  // Handle session updates (e.g., profile edit)
  if (trigger === "update" && session) {
    token.name = session.name;
    token.image = session.image;
  }

  return token;
}
```

---

## Session Callback Flow

### Session Creation

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   Session   │────────▶│    JWT      │
│   Request   │         │   Callback  │         │   Token     │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Extract from token:  │
                    │  - id                 │
                    │  - level              │
                    │  - institution        │
                    │  - image              │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Return session     │
                    │  object to client   │
                    └─────────────────────┘
```

### Session Callback Implementation
```typescript
async session({ session, token }) {
  if (token) {
    session.user.id = token.id as string;
    session.user.level = token.level as string | undefined;
    session.user.institution = token.institution as string | undefined;
    session.user.image = token.image as string | undefined;
  }
  return session;
}
```

---

## SignIn Callback (OAuth Profile Image)

### Purpose
Capture and store the user's profile image from OAuth providers (Google/LinkedIn) when they sign in.

### Flow
```
OAuth Sign In          Check Database          Update Image
      │                       │                      │
      ▼                       ▼                      ▼
┌──────────┐          ┌──────────────┐      ┌──────────────┐
│ Provider │─────────▶│  Find User   │─────▶│  Update if   │
│ Profile  │          │  by Email    │      │  different   │
└──────────┘          └──────────────┘      │  or empty    │
      │                       │              └──────────────┘
      │                       │
      │              ┌──────────────┐
      │              │  No image?   │
      │              │  Update DB   │
      │              └──────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Profile image URL stored in:       │
│  - Database (User.image)            │
│  - JWT Token                        │
│  - Session                          │
└─────────────────────────────────────┘
```

### Implementation
```typescript
async signIn({ user, account, profile }) {
  if (account && profile && user.email) {
    const imageUrl = profile.image ?? profile.picture ?? profile.avatar_url ?? null;

    if (imageUrl) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, image: true },
      });

      if (existingUser && (!existingUser.image || existingUser.image !== imageUrl)) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { image: imageUrl },
        });
      }
    }
  }
  return true;
}
```

---

## Registration Flow

### User Registration Process

```
User Input              Validation              Creation
    │                       │                      │
    ▼                       ▼                      ▼
┌──────────┐          ┌──────────────┐      ┌──────────────┐
│  Form    │─────────▶│    Zod       │─────▶│  Hash Pass   │
│  Data    │          │  Validation  │      │  (bcryptjs)  │
└──────────┘          └──────────────┘      └──────┬───────┘
    │                       │                      │
    │                       ▼                      ▼
    │               ┌──────────────┐      ┌──────────────┐
    │               │  Check Email │      │  Create User │
    │               │  Exists?     │      │  in Database │
    │               └──────────────┘      └──────┬───────┘
    │                                            │
    ▼                                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Return User Data                       │
│         (without password for security)                 │
└─────────────────────────────────────────────────────────┘
```

### Registration API Endpoint
```typescript
// app/api/auth/register/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password, name, level, institution } = result.data;

    // 2. Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ error: "Email already registered" }, { status: 400 });
    }

    // 3. Hash password
    const hashedPassword = await hash(password, 12);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        level,
        institution,
      },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        institution: true,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
```

---

## Protected Routes

### Middleware Configuration

```typescript
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/about", "/landing"].some(route =>
    nextUrl.pathname.endsWith(route)
  );
  const isAuthRoute = nextUrl.pathname.includes("/login") ||
                      nextUrl.pathname.includes("/register");

  // Allow API auth routes
  if (isApiAuthRoute) return NextResponse.next();

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});
```

---

## Security Considerations

### 1. Password Hashing
- **Algorithm**: bcryptjs
- **Salt Rounds**: 12
- **Why**: Balanced security and performance

### 2. JWT Security
- **HTTP-only cookies**: Prevents XSS attacks
- **Secure flag**: Only sent over HTTPS in production
- **SameSite**: Lax (allows OAuth redirects)
- **Max Age**: 30 days

### 3. OAuth Security
- **State Parameter**: Prevents CSRF attacks
- **PKCE**: Not required for server-side flow
- **Account Linking**: Controlled with `allowDangerousEmailAccountLinking`

### 4. Environment Variables
```env
# Required
AUTH_SECRET=your-secret-key-min-32-chars
DATABASE_URL=postgresql://...

# OAuth Providers (optional)
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_LINKEDIN_ID=...
AUTH_LINKEDIN_SECRET=...
```

---

## Type Definitions

### Extended Session Type
```typescript
// auth.ts
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      level?: string | null;
      institution?: string | null;
    };
  }

  interface User {
    level?: string | null;
    institution?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    level?: string | null;
    institution?: string | null;
    image?: string | null;
  }
}
```

---

## Testing Authentication

### Demo Credentials
| Email | Password | Level |
|-------|----------|-------|
| demo@edustride.id | password123 | S1 |
| sma@edustride.id | password123 | SMA |
| s2@edustride.id | password123 | S2/S3 |

### Test OAuth Flow
1. Go to `/login`
2. Click "Sign in with Google"
3. Authorize application
4. Check profile image is captured
5. Verify user created in database

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "CredentialsSignin" | Wrong password or email | Check credentials |
| "OAuthAccountNotLinked" | Email exists with different provider | Link accounts or use same provider |
| JWT expired | Token older than 30 days | Re-authenticate |
| Profile image not showing | Image URL not in session | Check signIn callback |
