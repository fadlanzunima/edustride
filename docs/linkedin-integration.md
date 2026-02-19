# LinkedIn Integration Documentation

Complete documentation for the LinkedIn profile import feature in EduStride, enabling users to import their professional data directly from LinkedIn.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication Setup](#authentication-setup)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Hooks & Data Fetching](#hooks--data-fetching)
7. [Mock Data for Development](#mock-data-for-development)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The LinkedIn Integration feature allows EduStride users to:

- **Import profile data**: Name, headline, summary, location
- **Import work experience**: Job titles, companies, descriptions, dates
- **Import education**: Schools, degrees, fields of study
- **Import skills**: Skill names with endorsement counts
- **Import certifications**: Professional certifications and authorities

### User Flow

1. User navigates to **Profile** page
2. Clicks **"Import from LinkedIn"** button
3. Fetches LinkedIn profile data via API
4. Previews and selects which data to import
5. Imports selected data into their EduStride profile

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│  Next.js App     │────▶│  LinkedIn API   │
│                 │     │  (API Route)     │     │  (Production)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Mock Data       │
                        │  (Development)   │
                        └──────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| [`auth.ts`](auth.ts:1) | NextAuth configuration with LinkedIn provider |
| [`app/api/linkedin/import/route.ts`](app/api/linkedin/import/route.ts:1) | API endpoint for fetching/saving LinkedIn data |
| [`hooks/use-linkedin-import.ts`](hooks/use-linkedin-import.ts:1) | TanStack Query hooks for LinkedIn operations |
| [`components/linkedin/linkedin-import.tsx`](components/linkedin/linkedin-import.tsx:1) | UI component for LinkedIn import |
| [`app/[locale]/dashboard/profile/page.tsx`](app/[locale]/dashboard/profile/page.tsx:19) | Profile page with LinkedIn import integration |

---

## Authentication Setup

### 1. LinkedIn OAuth App Configuration

Follow the steps in [`docs/oauth-setup.md`](docs/oauth-setup.md:65) to set up LinkedIn OAuth:

1. Create app at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Configure OAuth 2.0 redirect URLs
3. Request **Sign In with LinkedIn using OpenID Connect** product access
4. Copy Client ID and Client Secret

### 2. Environment Variables

Add to [`.env.local`](.env.local:1):

```bash
# LinkedIn OAuth
AUTH_LINKEDIN_ID=your-linkedin-client-id
AUTH_LINKEDIN_SECRET=your-linkedin-client-secret
```

### 3. NextAuth Configuration

The LinkedIn provider is configured in [`auth.ts`](auth.ts:54):

```typescript
LinkedIn({
  clientId: process.env.AUTH_LINKEDIN_ID,
  clientSecret: process.env.AUTH_LINKEDIN_SECRET,
  allowDangerousEmailAccountLinking: true,
}),
```

---

## API Endpoints

### GET `/api/linkedin/import`

Fetches LinkedIn profile data for the authenticated user.

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "profile": {
      "firstName": "Budi",
      "lastName": "Santoso",
      "headline": "Software Engineer | Full Stack Developer",
      "summary": "Passionate software engineer with 3+ years of experience...",
      "industry": "Information Technology & Services",
      "location": {
        "city": "Jakarta",
        "country": "Indonesia"
      }
    },
    "positions": [
      {
        "title": "Software Engineer",
        "company": "Tech Startup Indonesia",
        "description": "Developed and maintained web applications...",
        "startDate": { "month": 6, "year": 2023 },
        "endDate": null,
        "isCurrent": true
      }
    ],
    "education": [
      {
        "school": "Universitas Indonesia",
        "degree": "Bachelor of Computer Science",
        "fieldOfStudy": "Computer Science",
        "startDate": { "year": 2019 },
        "endDate": { "year": 2023 }
      }
    ],
    "skills": [
      { "name": "React", "endorsements": 15 },
      { "name": "TypeScript", "endorsements": 12 }
    ],
    "certifications": [
      {
        "name": "AWS Certified Cloud Practitioner",
        "authority": "Amazon Web Services",
        "issueDate": { "month": 3, "year": 2024 }
      }
    ]
  },
  "source": "mock",
  "message": "Mock LinkedIn data returned for development"
}
```

**Response (Error):**

```json
{
  "error": "Unauthorized",
  "details": "User not authenticated"
}
```

### POST `/api/linkedin/import`

Saves selected LinkedIn data to the user's EduStride profile.

**Request Body:**

```json
{
  "profile": { /* LinkedIn profile object */ },
  "positions": [ /* Array of positions */ ],
  "education": [ /* Array of education */ ],
  "skills": [ /* Array of skills */ ],
  "certifications": [ /* Array of certifications */ ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "LinkedIn profile data imported successfully",
  "imported": {
    "profile": true,
    "positions": 2,
    "education": 1,
    "skills": 6,
    "certifications": 1
  }
}
```

---

## Frontend Components

### LinkedInImport Component

Located at [`components/linkedin/linkedin-import.tsx`](components/linkedin/linkedin-import.tsx:41)

**Props:**

```typescript
interface LinkedInImportProps {
  className?: string;
}
```

**Usage:**

```tsx
import { LinkedInImport } from "@/components/linkedin/linkedin-import";

export default function ProfilePage() {
  return (
    <div>
      {/* Other profile content */}
      <LinkedInImport />
    </div>
  );
}
```

**Features:**

- Dashed border card indicating import action
- Dialog with data preview
- Checkboxes to select which data to import
- Animated transitions with Motion
- Loading states with skeletons
- Error handling with retry option

### Data Preview Sections

The component displays data in collapsible sections:

1. **Profile Information**: Name, headline, location, summary
2. **Work Experience**: Jobs with current/past indicators
3. **Education**: Schools, degrees, dates
4. **Skills**: Badges with endorsement counts
5. **Certifications**: Professional certifications

---

## Hooks & Data Fetching

### useLinkedInProfile

Fetches LinkedIn profile data (disabled by default, requires manual trigger).

```typescript
const {
  data: linkedinData,
  isLoading,
  isError,
  error,
  refetch,
  isFetched,
} = useLinkedInProfile();
```

**Usage:**

```tsx
const { data, refetch, isLoading } = useLinkedInProfile();

// Trigger fetch
const handleFetch = async () => {
  await refetch();
};
```

### useSaveLinkedInData

Mutation hook for saving imported LinkedIn data.

```typescript
const saveMutation = useSaveLinkedInData();

// Save data
await saveMutation.mutateAsync(linkedinData);
```

**Side Effects:**

- Shows success/error toast notifications
- Invalidates relevant queries (`portfolio`, `skills`, `user`)

### TypeScript Types

```typescript
interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  industry: string;
  location: { city: string; country: string };
}

interface LinkedInPosition {
  title: string;
  company: string;
  description: string;
  startDate: { month: number; year: number };
  endDate: { month: number; year: number } | null;
  isCurrent: boolean;
}

interface LinkedInEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: { year: number };
  endDate: { year: number };
}

interface LinkedInSkill {
  name: string;
  endorsements: number;
}

interface LinkedInCertification {
  name: string;
  authority: string;
  issueDate: { month: number; year: number };
}

interface LinkedInData {
  profile: LinkedInProfile;
  positions: LinkedInPosition[];
  education: LinkedInEducation[];
  skills: LinkedInSkill[];
  certifications: LinkedInCertification[];
}
```

---

## Mock Data for Development

During development, the API returns mock data instead of calling the real LinkedIn API. This allows testing without:

- LinkedIn API credentials
- LinkedIn app approval
- Real LinkedIn accounts

### Mock Data Structure

Located in [`app/api/linkedin/import/route.ts`](app/api/linkedin/import/route.ts:18):

```typescript
const MOCK_LINKEDIN_DATA = {
  profile: { /* Mock profile */ },
  positions: [ /* Mock jobs */ ],
  education: [ /* Mock schools */ ],
  skills: [ /* Mock skills */ ],
  certifications: [ /* Mock certs */ ],
};
```

### Switching to Production

To use real LinkedIn API in production:

1. Store user's LinkedIn access token after OAuth
2. Update [`route.ts`](app/api/linkedin/import/route.ts:110) to use real API calls
3. Implement token refresh logic

Example production implementation:

```typescript
// Production: Fetch real LinkedIn data
const accessToken = await getLinkedInToken(session.user.id);

const profileResponse = await fetch(
  `${LINKEDIN_API_BASE}/me`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);

const profile = await profileResponse.json();
// ... fetch other data
```

---

## Production Deployment

### Prerequisites

- [ ] LinkedIn app approved for Sign In with LinkedIn
- [ ] Production OAuth redirect URLs configured
- [ ] Environment variables set on production server
- [ ] LinkedIn API product access granted

### Environment Variables

```bash
# Production
AUTH_LINKEDIN_ID=your-production-client-id
AUTH_LINKEDIN_SECRET=your-production-client-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### LinkedIn API Permissions

Required LinkedIn API permissions:

- `openid` - OpenID Connect authentication
- `profile` - Basic profile information
- `email` - Email address
- `r_basicprofile` - Full profile data (requires approval)
- `r_organization_social` - Organization data (optional)

### Rate Limits

LinkedIn API rate limits:

- **Basic Profile**: 500 requests/day
- **Full Profile**: 100 requests/day
- **Organizations**: 100 requests/day

Implement caching to reduce API calls:

```typescript
// Cache LinkedIn data for 1 hour
const CACHE_TTL = 60 * 60 * 1000;
```

---

## Troubleshooting

### Error: "The passed in client_id is invalid"

**Cause**: LinkedIn OAuth not configured or invalid Client ID

**Solution**:
1. Check `AUTH_LINKEDIN_ID` in `.env.local`
2. Verify Client ID matches LinkedIn Developer Portal
3. Restart Next.js dev server after env changes

### Error: "Unauthorized"

**Cause**: User not authenticated or session expired

**Solution**:
1. Check if user is logged in
2. Verify NextAuth session configuration
3. Check browser cookies for session token

### Error: "Failed to fetch LinkedIn profile"

**Cause**: API error or network issue

**Solution**:
1. Check server logs for error details
2. Verify API endpoint is accessible
3. Check LinkedIn API status

### Mock Data Not Working

**Cause**: Environment check failing

**Solution**:
1. Verify `NODE_ENV=development`
2. Check console for mock data message
3. Clear browser cache and reload

### Data Not Saving

**Cause**: Database not implemented

**Solution**:
The POST handler in [`route.ts`](app/api/linkedin/import/route.ts:142) currently returns success without actually saving. Implement database updates:

```typescript
// TODO: Implement actual database updates
await prisma.user.update({
  where: { id: session.user.id },
  data: { /* update profile */ },
});

await prisma.portfolio.createMany({
  data: positions.map(/* transform */),
});

await prisma.skill.createMany({
  data: skills.map(/* transform */),
});
```

---

## Future Enhancements

Planned improvements for LinkedIn Integration:

1. **Real API Integration**: Connect to actual LinkedIn API with stored tokens
2. **Background Sync**: Periodic sync of LinkedIn data
3. **Conflict Resolution**: Handle data conflicts between LinkedIn and EduStride
4. **Selective Sync**: Allow users to choose auto-sync preferences
5. **Analytics**: Track import usage and success rates

---

## References

- [NextAuth.js LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [LinkedIn API Reference](https://learn.microsoft.com/en-us/linkedin/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

**Last Updated**: February 19, 2026
**Version**: 1.0