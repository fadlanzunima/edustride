# EduStride API Documentation

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Portfolio](#portfolio)
4. [Skills](#skills)
5. [Roadmap](#roadmap)
6. [Activities](#activities)
7. [Quizzes](#quizzes)
8. [Notifications](#notifications)
9. [LinkedIn Integration](#linkedin-integration)

---

## Authentication

### Overview
EduStride uses NextAuth.js v5 with JWT session strategy. Supports three authentication methods:
- **Credentials** (email/password)
- **Google OAuth**
- **LinkedIn OAuth**

### Session Management
- **Strategy**: JWT (stateless)
- **Max Age**: 30 days
- **Storage**: HTTP-only cookies

### Endpoints

#### POST /api/auth/signin/credentials
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "csrfToken": "..."
}
```

**Response:**
- Success: Redirects to callback URL
- Error: Returns to `/login?error=CredentialsSignin`

#### POST /api/auth/signin/google
Initiates Google OAuth flow.

#### POST /api/auth/signin/linkedin
Initiates LinkedIn OAuth flow.

#### POST /api/auth/signout
Signs out the current user.

#### GET /api/auth/session
Returns the current session data.

**Response:**
```json
{
  "user": {
    "id": "cl...",
    "name": "John Doe",
    "email": "user@example.com",
    "image": "https://...",
    "level": "S1",
    "institution": "University"
  },
  "expires": "2026-03-21T05:07:35.474Z"
}
```

---

## User Management

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "level": "S1",
  "institution": "University Name"
}
```

**Validation:**
- Email: Valid email format
- Password: Minimum 6 characters
- Level: Enum ("SMA", "S1", "S2/S3")

**Response:**
```json
{
  "user": {
    "id": "cl...",
    "name": "John Doe",
    "email": "user@example.com",
    "level": "S1",
    "institution": "University Name"
  }
}
```

**Errors:**
- 400: Email already registered
- 400: Invalid input data

### GET /api/seed
Seeds the database with demo data.

**Query Parameters:**
- `secret` (optional): If matches `CRON_SECRET`, seeds with additional test data

**Response:**
```json
{
  "message": "Database seeded successfully",
  "users": [...],
  "portfolios": [...],
  "skills": [...]
}
```

---

## Portfolio

### GET /api/portfolio
Get all portfolios for the current user.

**Response:**
```json
[
  {
    "id": "cl...",
    "title": "My Project",
    "description": "...",
    "category": "Web Development",
    "tags": ["React", "Node.js"],
    "githubUrl": "https://github.com/...",
    "demoUrl": "https://...",
    "image": "https://...",
    "isPublic": true,
    "createdAt": "2026-02-19T...",
    "updatedAt": "2026-02-19T..."
  }
]
```

### POST /api/portfolio
Create a new portfolio item.

**Request Body:**
```json
{
  "title": "My Project",
  "description": "Project description...",
  "category": "Web Development",
  "tags": ["React", "Node.js"],
  "githubUrl": "https://github.com/...",
  "demoUrl": "https://...",
  "image": "https://...",
  "isPublic": true
}
```

**Validation:**
- title: Min 3, max 100 characters
- description: Min 10, max 2000 characters
- category: Required

### GET /api/portfolio/[id]
Get a specific portfolio by ID.

### PUT /api/portfolio/[id]
Update a portfolio item.

### DELETE /api/portfolio/[id]
Delete a portfolio item.

---

## Skills

### GET /api/skills
Get all skills for the current user.

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": "cl...",
    "name": "React",
    "category": "Technical",
    "level": 75,
    "isVerified": false,
    "endorsements": 12,
    "createdAt": "2026-02-19T..."
  }
]
```

### POST /api/skills
Create a new skill.

**Request Body:**
```json
{
  "name": "React",
  "category": "Technical",
  "level": 75
}
```

### PUT /api/skills/[id]
Update a skill.

### DELETE /api/skills/[id]
Delete a skill.

---

## Roadmap

### GET /api/roadmap
Get all roadmaps for the current user.

**Response:**
```json
[
  {
    "id": "cl...",
    "title": "Frontend Developer Path",
    "description": "...",
    "category": "Technical",
    "status": "active",
    "progress": 45,
    "items": [...],
    "createdAt": "2026-02-19T..."
  }
]
```

### POST /api/roadmap
Create a new roadmap.

### GET /api/roadmap/[id]
Get roadmap details with items.

### GET /api/roadmap/[id]/items
Get items for a specific roadmap.

### POST /api/roadmap/[id]/items
Add an item to a roadmap.

**Request Body:**
```json
{
  "title": "Learn TypeScript",
  "description": "...",
  "targetDate": "2026-03-01",
  "priority": "high"
}
```

---

## Activities

### GET /api/activities
Get activity feed for the current user.

**Query Parameters:**
- `limit`: Number of items (default: 20)
- `offset`: Pagination offset
- `type`: Filter by activity type

**Response:**
```json
{
  "activities": [
    {
      "id": "cl...",
      "type": "portfolio_created",
      "title": "New Portfolio Created",
      "description": "Created 'My Project'",
      "metadata": {...},
      "createdAt": "2026-02-19T..."
    }
  ],
  "total": 100
}
```

### GET /api/activities/stats
Get activity statistics.

**Response:**
```json
{
  "totalActivities": 150,
  "byType": {
    "portfolio_created": 10,
    "skill_added": 25,
    ...
  },
  "weeklyProgress": [...]
}
```

---

## Quizzes

### GET /api/quizzes
Get all available quizzes.

**Query Parameters:**
- `level`: Filter by level ("SMA", "S1", "S2/S3")
- `skillId`: Filter by related skill

**Response:**
```json
[
  {
    "id": "cl...",
    "title": "JavaScript Fundamentals",
    "description": "...",
    "level": "S1",
    "skillId": "cl...",
    "timeLimit": 30,
    "passingScore": 70,
    "questions": [...],
    "attempts": [...]
  }
]
```

### POST /api/quizzes
Create a new quiz.

**Request Body:**
```json
{
  "title": "Quiz Title",
  "description": "...",
  "level": "S1",
  "skillId": "cl...",
  "timeLimit": 30,
  "passingScore": 70,
  "questions": [
    {
      "text": "Question text?",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "...",
      "points": 10
    }
  ]
}
```

### GET /api/quizzes/[id]
Get quiz details.

### POST /api/quizzes/[id]/attempts
Submit a quiz attempt.

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "cl...",
      "answer": 0
    }
  ],
  "timeSpent": 1200
}
```

**Response:**
```json
{
  "attempt": {
    "id": "cl...",
    "score": 85,
    "passed": true,
    "answers": [...]
  },
  "skillBoost": {
    "previousLevel": 60,
    "newLevel": 75
  }
}
```

---

## Notifications

### GET /api/notifications
Get notifications for the current user.

**Query Parameters:**
- `limit`: Number of items (default: 50)
- `unreadOnly`: Filter unread only

**Response:**
```json
{
  "notifications": [
    {
      "id": "cl...",
      "title": "Achievement Unlocked!",
      "message": "You earned 'First Portfolio' badge",
      "type": "achievement",
      "read": false,
      "actionUrl": "/dashboard/achievements",
      "createdAt": "2026-02-19T..."
    }
  ],
  "unreadCount": 5,
  "total": 25
}
```

### PATCH /api/notifications
Mark notifications as read.

**Request Body:**
```json
{
  "ids": ["cl...", "cl..."]
}
```

### GET /api/realtime
Real-time notifications SSE endpoint.

**Query Parameters:**
- `types`: Comma-separated notification types

---

## LinkedIn Integration

### POST /api/linkedin/import
Import profile data from LinkedIn.

**Request Body:**
```json
{
  "sections": ["profile", "experience", "education", "skills"]
}
```

**Response:**
```json
{
  "success": true,
  "imported": {
    "profile": {
      "name": "John Doe",
      "headline": "Software Engineer",
      "location": "Jakarta"
    },
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

### Flow
1. User initiates LinkedIn OAuth from settings
2. After authorization, LinkedIn returns access token
3. Backend fetches profile data using LinkedIn API
4. User selects which sections to import
5. Data is merged with existing EduStride profile

---

## Error Handling

All API endpoints follow standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Real-time connections: 1 per user

---

## Authentication Required

All endpoints except the following require authentication:
- POST /api/auth/signin/*
- POST /api/auth/signout
- GET /api/auth/session
- POST /api/auth/register
- GET /api/auth/providers
- GET /api/auth/csrf
