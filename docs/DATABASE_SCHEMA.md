# EduStride Database Schema Documentation

## Overview

EduStride uses **PostgreSQL** (via Supabase) with **Prisma ORM v7.4.0** for database management.

### Connection
- **Provider**: PostgreSQL via Supabase
- **Connection Pooling**: Session Pooler (IPv4 compatible)
- **ORM**: Prisma with driver adapter pattern

---

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────▶│   Account    │     │   Session    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email (UQ)   │     │ userId (FK)  │     │ sessionToken │
│ name         │     │ provider     │     │ userId (FK)  │
│ image        │     │ providerAccId│     │ expires      │
│ password     │     │ refresh_token│     └──────────────┘
│ level        │     │ access_token │
│ institution  │     │ expires_at   │
│ bio          │     └──────────────┘
│ location     │
│ website      │     ┌──────────────┐
│ linkedIn     │────▶│  Portfolio   │
│ github       │     ├──────────────┤
│ createdAt    │     │ id (PK)      │
│ updatedAt    │     │ userId (FK)  │
└──────────────┘     │ title        │
       │             │ description  │
       │             │ category     │
       │             │ tags[]       │
       │             │ githubUrl    │
       │             │ demoUrl      │
       │             │ image        │
       │             │ isPublic     │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │    Skill     │
       ├────────────▶├──────────────┤
       │             │ id (PK)      │
       │             │ userId (FK)  │
       │             │ name         │
       │             │ category     │
       │             │ level        │
       │             │ isVerified   │
       │             │ endorsements │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │   Roadmap    │
       ├────────────▶├──────────────┤
       │             │ id (PK)      │
       │             │ userId (FK)  │
       │             │ title        │
       │             │ description  │
       │             │ category     │
       │             │ status       │
       │             │ progress     │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │    Quiz      │
       ├────────────▶├──────────────┤
       │             │ id (PK)      │
       │             │ userId (FK)  │
       │             │ title        │
       │             │ description  │
       │             │ level        │
       │             │ skillId (FK) │
       │             │ timeLimit    │
       │             │ passingScore │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │ Notification │
       ├────────────▶├──────────────┤
       │             │ id (PK)      │
       │             │ userId (FK)  │
       │             │ title        │
       │             │ message      │
       │             │ type         │
       │             │ read         │
       │             │ actionUrl    │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │  Achievement │
       ├────────────▶├──────────────┤
       │             │ id (PK)      │
       │             │ userId (FK)  │
       │             │ badgeId (FK) │
       │             │ title        │
       │             │ unlockedAt   │
       │             └──────────────┘
       │
       │             ┌──────────────┐
       │             │   Activity   │
       └────────────▶├──────────────┤
                     │ id (PK)      │
                     │ userId (FK)  │
                     │ type         │
                     │ title        │
                     │ metadata     │
                     └──────────────┘
```

---

## Table Definitions

### 1. User (Core Table)

Primary user account information.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?   // Profile photo URL
  password      String?   // Hashed (bcryptjs), null for OAuth
  level         String?   @default("S1") // "SMA" | "S1" | "S2_S3"
  institution   String?   // School/University name
  bio           String?   @db.Text
  location      String?
  website       String?
  linkedIn      String?
  github        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  portfolios    Portfolio[]
  skills        Skill[]
  roadmaps      Roadmap[]
  achievements  Achievement[]
  activities    Activity[]
  stats         UserStats?
  quizzes       Quiz[]
  quizAttempts  QuizAttempt[]
  userBadges    UserBadge[]
  notifications Notification[]

  @@index([email])
  @@index([level])
  @@index([createdAt])
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Unique identifier |
| `name` | String? | User's display name |
| `email` | String (Unique) | Login email |
| `emailVerified` | DateTime? | When email was verified |
| `image` | String? | Profile image URL (from OAuth or upload) |
| `password` | String? | Bcrypt hashed password (null for OAuth) |
| `level` | String? | Education level: "SMA", "S1", "S2_S3" |
| `institution` | String? | School/university name |
| `bio` | String? | User bio/description |
| `location` | String? | User location |
| `website` | String? | Personal website |
| `linkedIn` | String? | LinkedIn profile URL |
| `github` | String? | GitHub username |

---

### 2. Account (NextAuth.js)

OAuth account linking for NextAuth.js.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

---

### 3. Portfolio

User project portfolio items.

```prisma
model Portfolio {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String   @db.Text
  category    String   // "Web Development", "Mobile", "Data Science", etc.
  tags        String[] // Array of technology tags
  githubUrl   String?
  demoUrl     String?
  image       String?  // Featured image URL
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([category])
}
```

**Categories:**
- Web Development
- Mobile Development
- Data Science
- Machine Learning
- UI/UX Design
- Research
- Other

---

### 4. Skill

User skills with proficiency levels.

```prisma
model Skill {
  id            String   @id @default(cuid())
  userId        String
  name          String
  category      String   // "Technical", "Soft Skills", "Language"
  level         Int      @default(0) // 0-100
  isVerified    Boolean  @default(false)
  endorsements  Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizzes   Quiz[]

  @@index([userId])
  @@index([category])
}
```

---

### 5. Roadmap

Learning roadmaps with progress tracking.

```prisma
model Roadmap {
  id          String        @id @default(cuid())
  userId      String
  title       String
  description String?       @db.Text
  category    String
  status      RoadmapStatus @default(draft)
  progress    Int           @default(0) // 0-100
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user  User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  items RoadmapItem[]

  @@index([userId])
  @@index([status])
}

model RoadmapItem {
  id          String            @id @default(cuid())
  roadmapId   String
  title       String
  description String?           @db.Text
  status      RoadmapItemStatus @default(todo)
  priority    Priority          @default(medium)
  targetDate  DateTime?
  completedAt DateTime?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  roadmap Roadmap @relation(fields: [roadmapId], references: [id], onDelete: Cascade)

  @@index([roadmapId])
  @@index([status])
}
```

**Enums:**
```prisma
enum RoadmapStatus {
  draft
  active
  completed
  archived
}

enum RoadmapItemStatus {
  todo
  in_progress
  completed
  skipped
}

enum Priority {
  low
  medium
  high
  urgent
}
```

---

### 6. Quiz System

Quiz and assessment system.

```prisma
model Quiz {
  id            String    @id @default(cuid())
  userId        String
  title         String
  description   String?   @db.Text
  level         String    // "SMA", "S1", "S2_S3"
  skillId       String?
  timeLimit     Int       // Minutes
  passingScore  Int       // Percentage (0-100)
  isPublic      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill    Skill?        @relation(fields: [skillId], references: [id])
  questions QuizQuestion[]
  attempts  QuizAttempt[]

  @@index([userId])
  @@index([skillId])
  @@index([level])
}

model QuizQuestion {
  id            String      @id @default(cuid())
  quizId        String
  text          String      @db.Text
  type          QuestionType
  options       String[]    // For multiple choice
  correctAnswer Json        // Can be number or boolean
  explanation   String?     @db.Text
  points        Int         @default(10)
  order         Int         @default(0)

  quiz    Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  answers QuizAnswer[]

  @@index([quizId])
}

model QuizAttempt {
  id        String   @id @default(cuid())
  quizId    String
  userId    String
  score     Int      // Percentage (0-100)
  passed    Boolean
  startedAt DateTime @default(now())
  endedAt   DateTime?
  timeSpent Int      // Seconds

  quiz    Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user    User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers QuizAnswer[]

  @@index([quizId])
  @@index([userId])
}

model QuizAnswer {
  id         String @id @default(cuid())
  attemptId  String
  questionId String
  answer     Json   // User's answer
  isCorrect  Boolean
  points     Int    @default(0)

  attempt  QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([attemptId])
  @@index([questionId])
}
```

**Enums:**
```prisma
enum QuestionType {
  multiple_choice
  true_false
  short_answer
}
```

---

### 7. Achievement & Badge System

Gamification with badges and achievements.

```prisma
model Badge {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  icon        String   // Lucide icon name or URL
  category    String   // "portfolio", "skill", "quiz", "social"
  level       String   // "bronze", "silver", "gold", "platinum"
  criteria    Json     // Achievement criteria
  createdAt   DateTime @default(now())

  userBadges UserBadge[]

  @@index([category])
  @@index([level])
}

model UserBadge {
  id          String   @id @default(cuid())
  userId      String
  badgeId     String
  unlockedAt  DateTime @default(now())
  progress    Int      @default(0) // Progress toward unlocking

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
}

model Achievement {
  id          String   @id @default(cuid())
  userId      String
  type        String   // "milestone", "streak", "completion"
  title       String
  description String?
  metadata    Json?    // Additional data
  unlockedAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
}
```

---

### 8. Activity Feed

User activity tracking.

```prisma
model Activity {
  id          String   @id @default(cuid())
  userId      String
  type        String   // "portfolio_created", "skill_added", "quiz_completed", etc.
  title       String
  description String?
  metadata    Json?    // Additional context
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}
```

**Activity Types:**
- `portfolio_created`
- `portfolio_updated`
- `skill_added`
- `skill_updated`
- `skill_verified`
- `quiz_completed`
- `quiz_created`
- `roadmap_created`
- `roadmap_completed`
- `achievement_unlocked`
- `badge_earned`
- `profile_updated`
- `linkedin_connected`

---

### 9. Notification System

Real-time notifications.

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  title     String
  message   String           @db.Text
  type      NotificationType @default(system)
  read      Boolean          @default(false)
  actionUrl String?          // Link to relevant page
  metadata  Json?            // Additional data
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([read])
  @@index([createdAt])
}
```

**Enums:**
```prisma
enum NotificationType {
  achievement
  reminder
  recommendation
  social
  system
}
```

---

### 10. User Stats

Aggregated user statistics.

```prisma
model UserStats {
  id                    String   @id @default(cuid())
  userId                String   @unique
  portfolioCount        Int      @default(0)
  skillCount            Int      @default(0)
  verifiedSkillCount    Int      @default(0)
  quizCompletedCount    Int      @default(0)
  quizCreatedCount      Int      @default(0)
  achievementCount      Int      @default(0)
  badgeCount            Int      @default(0)
  totalStudyHours       Int      @default(0)
  streakDays            Int      @default(0)
  longestStreak         Int      @default(0)
  profileViews          Int      @default(0)
  lastActiveAt          DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## Indexes

### Performance Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| User | `email` | Fast login lookup |
| User | `level` | Filter by education level |
| Portfolio | `userId` | User's portfolios query |
| Skill | `userId` | User's skills query |
| Activity | `userId, createdAt` | Feed pagination |
| Notification | `userId, read` | Unread count |

---

## Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| `init` | Feb 2026 | Initial schema with NextAuth models |
| `add_quiz_assessment` | Feb 2026 | Quiz and assessment system |
| `add_badge_system` | Feb 2026 | Gamification badges and achievements |

---

## Common Queries

### Get User Dashboard Data
```sql
SELECT
  u.*,
  COUNT(DISTINCT p.id) as portfolio_count,
  COUNT(DISTINCT s.id) as skill_count,
  COUNT(DISTINCT q.id) as quiz_count
FROM "User" u
LEFT JOIN "Portfolio" p ON p.userId = u.id
LEFT JOIN "Skill" s ON s.userId = u.id
LEFT JOIN "QuizAttempt" q ON q.userId = u.id AND q.passed = true
WHERE u.id = 'user-id'
GROUP BY u.id;
```

### Get Recent Activities
```sql
SELECT * FROM "Activity"
WHERE userId = 'user-id'
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;
```

### Get Unread Notifications
```sql
SELECT * FROM "Notification"
WHERE userId = 'user-id' AND read = false
ORDER BY createdAt DESC;
```

---

## Backup Strategy

1. **Automated**: Daily automated backups via Supabase
2. **Retention**: 7 days of daily backups
3. **Point-in-time**: Continuous archiving for PITR (7 days)

---

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL=postgresql://postgres.[project]:[password]@[host]:5432/postgres
```

### Connection Pooler (Supabase)
```env
# Use Session Pooler for Prisma
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```
