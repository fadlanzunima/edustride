import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

// Seed data configuration
const SEED_USERS = [
  {
    email: "demo@edustride.id",
    name: "Demo Student",
    password: "password123",
    level: "S1" as const,
    institution: "Universitas Indonesia",
    bio: "Mahasiswa Teknik Informatika yang passionate dengan web development",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
    hasData: true,
  },
  {
    email: "sma@edustride.id",
    name: "Budi Santoso",
    password: "password123",
    level: "SMA" as const,
    institution: "SMA Negeri 1 Jakarta",
    bio: "Siswa SMA yang tertarik dengan teknologi dan programming",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    hasData: true,
  },
  {
    email: "s2@edustride.id",
    name: "Dr. Candra Research",
    password: "password123",
    level: "S2_S3" as const,
    institution: "ITB",
    bio: "Researcher di bidang AI dan Machine Learning",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Candra",
    hasData: true,
  },
  {
    email: "empty@edustride.id",
    name: "New User",
    password: "password123",
    level: "S1" as const,
    institution: "",
    bio: "",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewUser",
    hasData: false,
  },
];

// Portfolio data per user level
const PORTFOLIO_DATA = {
  SMA: [
    {
      title: "Website OSIS Sekolah",
      description: "Website resmi OSIS untuk informasi kegiatan sekolah",
      type: "PROJECT" as const,
      status: "PUBLISHED" as const,
      link: "https://osis-sma1.vercel.app",
      tags: ["HTML", "CSS", "JavaScript"],
    },
    {
      title: "Juara 2 Lomba Web Design",
      description: "Kompetisi web design tingkat provinsi",
      type: "AWARD" as const,
      status: "PUBLISHED" as const,
      tags: ["Web Design", "Competition"],
    },
  ],
  S1: [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce dengan React dan Node.js",
      type: "PROJECT" as const,
      status: "PUBLISHED" as const,
      link: "https://github.com/ani/ecommerce",
      githubUrl: "https://github.com/ani/ecommerce",
      demoUrl: "https://ecommerce-ani.vercel.app",
      tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    },
    {
      title: "Magang di Tokopedia",
      description: "Software Engineer Intern - Frontend Team",
      type: "EXPERIENCE" as const,
      status: "PUBLISHED" as const,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-31"),
      tags: ["Internship", "React", "Microfrontends"],
    },
    {
      title: "Google Cloud Certification",
      description: "Professional Cloud Architect",
      type: "CERTIFICATE" as const,
      status: "PUBLISHED" as const,
      tags: ["Google Cloud", "Cloud Computing", "Certificate"],
    },
  ],
  S2_S3: [
    {
      title: "Paper: AI untuk Prediksi Cuaca",
      description: "Published in International Journal of AI",
      type: "PUBLICATION" as const,
      status: "PUBLISHED" as const,
      link: "https://doi.org/10.1234/ai-weather",
      tags: ["AI", "Machine Learning", "Weather Prediction", "Publication"],
    },
    {
      title: "Grant Riset Nasional 2024",
      description: "Penelitian AI untuk pertanian berkelanjutan",
      type: "AWARD" as const,
      status: "PUBLISHED" as const,
      tags: ["Research Grant", "AI", "Agriculture"],
    },
    {
      title: "Keynote Speaker: AI Conference",
      description: "International AI Conference 2024",
      type: "EXPERIENCE" as const,
      status: "PUBLISHED" as const,
      tags: ["Speaking", "AI", "Conference"],
    },
  ],
};

// Skills data per user level
const SKILLS_DATA = {
  SMA: [
    {
      name: "HTML/CSS",
      category: "TECHNICAL" as const,
      level: "INTERMEDIATE" as const,
      progress: 75,
    },
    {
      name: "JavaScript",
      category: "TECHNICAL" as const,
      level: "BEGINNER" as const,
      progress: 45,
    },
    {
      name: "Public Speaking",
      category: "SOFT_SKILL" as const,
      level: "INTERMEDIATE" as const,
      progress: 60,
    },
    {
      name: "English",
      category: "LANGUAGE" as const,
      level: "INTERMEDIATE" as const,
      progress: 70,
    },
  ],
  S1: [
    {
      name: "React",
      category: "TECHNICAL" as const,
      level: "ADVANCED" as const,
      progress: 85,
    },
    {
      name: "TypeScript",
      category: "TECHNICAL" as const,
      level: "INTERMEDIATE" as const,
      progress: 70,
    },
    {
      name: "Node.js",
      category: "TECHNICAL" as const,
      level: "INTERMEDIATE" as const,
      progress: 65,
    },
    {
      name: "Project Management",
      category: "SOFT_SKILL" as const,
      level: "INTERMEDIATE" as const,
      progress: 60,
    },
    {
      name: "English",
      category: "LANGUAGE" as const,
      level: "ADVANCED" as const,
      progress: 85,
    },
  ],
  S2_S3: [
    {
      name: "Python",
      category: "TECHNICAL" as const,
      level: "EXPERT" as const,
      progress: 95,
    },
    {
      name: "Machine Learning",
      category: "TECHNICAL" as const,
      level: "EXPERT" as const,
      progress: 90,
    },
    {
      name: "Deep Learning",
      category: "TECHNICAL" as const,
      level: "ADVANCED" as const,
      progress: 80,
    },
    {
      name: "Research Writing",
      category: "SOFT_SKILL" as const,
      level: "EXPERT" as const,
      progress: 92,
    },
    {
      name: "English",
      category: "LANGUAGE" as const,
      level: "EXPERT" as const,
      progress: 95,
    },
  ],
};

// Roadmap data per user level
const ROADMAP_DATA = {
  SMA: {
    title: "Persiapan SNBT 2026",
    description: "Roadmap persiapan ujian masuk perguruan tinggi",
    category: "Academic",
    progress: 30,
    items: [
      {
        title: "Belajar TPA Dasar",
        description: "Tes Potensi Akademik - logika dan matematika",
        status: "COMPLETED" as const,
        order: 1,
      },
      {
        title: "Literasi Bahasa Indonesia",
        description: "Membaca dan memahami teks akademik",
        status: "IN_PROGRESS" as const,
        order: 2,
      },
      {
        title: "Literasi Bahasa Inggris",
        description: "Reading comprehension dan vocabulary",
        status: "NOT_STARTED" as const,
        order: 3,
      },
      {
        title: "Simulasi Ujian",
        description: "Latihan soal-soal SNBT tahun lalu",
        status: "NOT_STARTED" as const,
        order: 4,
      },
    ],
  },
  S1: {
    title: "Full Stack Developer Path",
    description: "Roadmap menjadi full stack developer profesional",
    category: "Career",
    progress: 45,
    items: [
      {
        title: "React Fundamentals",
        description: "Hooks, components, dan state management",
        status: "COMPLETED" as const,
        order: 1,
      },
      {
        title: "TypeScript Mastery",
        description: "Deep dive into TypeScript types dan generics",
        status: "COMPLETED" as const,
        order: 2,
      },
      {
        title: "Node.js & Express",
        description: "Backend development dengan Node.js",
        status: "IN_PROGRESS" as const,
        order: 3,
      },
      {
        title: "Database Design",
        description: "Relational database design dan optimization",
        status: "NOT_STARTED" as const,
        order: 4,
      },
    ],
  },
  S2_S3: {
    title: "Research Excellence",
    description: "Roadmap untuk publikasi jurnal internasional",
    category: "Research",
    progress: 60,
    items: [
      {
        title: "Literature Review",
        description: "Survey paper terkini di bidang AI",
        status: "COMPLETED" as const,
        order: 1,
      },
      {
        title: "Research Methodology",
        description: "Design experiment dan data collection",
        status: "COMPLETED" as const,
        order: 2,
      },
      {
        title: "Paper Writing",
        description: "Draft paper untuk journal submission",
        status: "IN_PROGRESS" as const,
        order: 3,
      },
      {
        title: "Peer Review",
        description: "Revisi berdasarkan feedback reviewer",
        status: "NOT_STARTED" as const,
        order: 4,
      },
    ],
  },
};

// Activity types
const ACTIVITY_TYPES = [
  "PORTFOLIO_CREATED",
  "SKILL_LEVEL_UP",
  "ROADMAP_ITEM_COMPLETED",
  "ACHIEVEMENT_EARNED",
  "PROFILE_UPDATED",
] as const;

/**
 * POST /api/seed
 * Seeds the database with sample data
 */
export async function POST(request: Request) {
  try {
    // Check for authorization (optional - can be restricted to admin in production)
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    // Check if database already has users (unless force=true)
    if (!force) {
      const existingUsers = await prisma.user.count();
      if (existingUsers > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Database already has users. Use ?force=true to re-seed.",
            userCount: existingUsers,
          },
          { status: 409 }
        );
      }
    }

    console.log("🌱 Starting database seeding...\n");
    const results: {
      users: string[];
      portfolios: number;
      skills: number;
      roadmaps: number;
      activities: number;
      userStats: number;
    } = {
      users: [],
      portfolios: 0,
      skills: 0,
      roadmaps: 0,
      activities: 0,
      userStats: 0,
    };

    // Create users
    for (const userData of SEED_USERS) {
      const hashedPassword = await hash(userData.password, 12);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          level: userData.level,
          institution: userData.institution,
          bio: userData.bio,
          image: userData.image,
        },
      });

      console.log(`✅ User created: ${user.name} (${user.email})`);
      results.users.push(`${user.name} (${user.email})`);

      // Skip creating data for users with hasData = false
      if (!userData.hasData) {
        console.log(`  ⚪ Skipped data creation (empty state demo user)`);
        console.log();
        continue;
      }

      // Create portfolios for this user
      const userPortfolios = PORTFOLIO_DATA[userData.level];
      for (const portfolio of userPortfolios) {
        await prisma.portfolio.create({
          data: {
            userId: user.id,
            ...portfolio,
          },
        });
      }
      results.portfolios += userPortfolios.length;
      console.log(`  📁 Created ${userPortfolios.length} portfolios`);

      // Create skills for this user
      const userSkills = SKILLS_DATA[userData.level];
      await prisma.skill.createMany({
        data: userSkills.map((skill) => ({
          userId: user.id,
          ...skill,
        })),
      });
      results.skills += userSkills.length;
      console.log(`  🎯 Created ${userSkills.length} skills`);

      // Create roadmap for this user
      const roadmapData = ROADMAP_DATA[userData.level];
      const roadmap = await prisma.roadmap.create({
        data: {
          userId: user.id,
          title: roadmapData.title,
          description: roadmapData.description,
          level: userData.level,
          category: roadmapData.category,
          progress: roadmapData.progress,
          items: {
            create: roadmapData.items,
          },
        },
      });
      results.roadmaps += 1;
      console.log(`  🗺️  Created roadmap: ${roadmap.title}`);

      // Create user stats
      await prisma.userStats.create({
        data: {
          userId: user.id,
          portfolioCount: userPortfolios.length,
          skillCount: userSkills.length,
          roadmapCount: 1,
          achievementCount: 0,
          totalProfileViews: Math.floor(Math.random() * 100),
          weeklyActiveHours: Math.floor(Math.random() * 20),
          currentStreak: Math.floor(Math.random() * 7),
          longestStreak: Math.floor(Math.random() * 30) + 7,
        },
      });
      results.userStats += 1;
      console.log(`  📊 Created user stats`);

      // Create activities
      const activities = [
        {
          userId: user.id,
          type: "PORTFOLIO_CREATED" as const,
          title: "Portfolio Created",
          description: `Menambahkan project '${userPortfolios[0].title}' ke portfolio`,
          entityType: "portfolio",
        },
        {
          userId: user.id,
          type: "SKILL_LEVEL_UP" as const,
          title: "Skill Progress Updated",
          description: `Progress skill ${userSkills[0].name} mencapai ${userSkills[0].progress}%`,
          entityType: "skill",
        },
        {
          userId: user.id,
          type: "ROADMAP_ITEM_COMPLETED" as const,
          title: "Milestone Reached",
          description: `Menyelesaikan '${roadmapData.items[0].title}'`,
          entityType: "roadmap",
        },
      ];

      for (const activity of activities) {
        await prisma.activity.create({
          data: activity,
        });
      }
      results.activities += activities.length;
      console.log(`  🔔 Created ${activities.length} activities`);
      console.log();
    }

    console.log("🎉 Database seeding completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      results,
      credentials: SEED_USERS.map((u) => ({
        email: u.email,
        password: u.password,
        level: u.level,
      })),
    });
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seed
 * Returns seeding status
 */
export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const portfolioCount = await prisma.portfolio.count();
    const skillCount = await prisma.skill.count();
    const roadmapCount = await prisma.roadmap.count();
    const activityCount = await prisma.activity.count();

    return NextResponse.json({
      seeded: userCount > 0,
      stats: {
        users: userCount,
        portfolios: portfolioCount,
        skills: skillCount,
        roadmaps: roadmapCount,
        activities: activityCount,
      },
      message:
        userCount > 0
          ? "Database already seeded. Use POST /api/seed to re-seed."
          : "Database is empty. Use POST /api/seed to seed.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error checking database status",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
