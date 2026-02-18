/**
 * Database Seeding Script (ES Module)
 *
 * This script creates sample data in the database for testing OAuth.
 * Run with: node scripts/seed-db.mjs
 */

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
config({ path: ".env.local" });

// Create Prisma client without adapter for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Starting database seeding...\n");
  console.log(
    "Database URL:",
    process.env.DATABASE_URL?.substring(0, 50) + "..."
  );

  try {
    // Create demo users for OAuth testing
    console.log("Creating demo users...");

    const users = await Promise.all([
      // User 1: SMA Level
      prisma.user.upsert({
        where: { email: "sma.student@example.com" },
        update: {},
        create: {
          email: "sma.student@example.com",
          name: "Budi Santoso",
          level: "SMA",
          institution: "SMA Negeri 1 Jakarta",
          bio: "Siswa SMA yang tertarik dengan teknologi dan programming",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
        },
      }),

      // User 2: S1 Level
      prisma.user.upsert({
        where: { email: "s1.student@example.com" },
        update: {},
        create: {
          email: "s1.student@example.com",
          name: "Ani Wijaya",
          level: "S1",
          institution: "Universitas Indonesia",
          bio: "Mahasiswa Teknik Informatika, fokus pada web development",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ani",
        },
      }),

      // User 3: S2/S3 Level
      prisma.user.upsert({
        where: { email: "s2.student@example.com" },
        update: {},
        create: {
          email: "s2.student@example.com",
          name: "Dr. Candra Research",
          level: "S2_S3",
          institution: "ITB",
          bio: "Researcher di bidang AI dan Machine Learning",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Candra",
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} demo users`);
    users.forEach((u) => console.log(`  - ${u.name} (${u.level}): ${u.email}`));
    console.log();

    // Create portfolios for each user
    console.log("Creating portfolios...");

    for (const user of users) {
      const portfolioCount = await prisma.portfolio.count({
        where: { userId: user.id },
      });

      if (portfolioCount === 0) {
        if (user.level === "SMA") {
          await prisma.portfolio.createMany({
            data: [
              {
                userId: user.id,
                title: "Website OSIS Sekolah",
                description:
                  "Website resmi OSIS untuk informasi kegiatan sekolah",
                type: "PROJECT",
                status: "PUBLISHED",
                link: "https://osis-sma1.vercel.app",
                tags: ["HTML", "CSS", "JavaScript"],
              },
              {
                userId: user.id,
                title: "Juara 2 Lomba Web Design",
                description: "Kompetisi web design tingkat provinsi",
                type: "AWARD",
                status: "PUBLISHED",
                tags: ["Web Design", "Competition"],
              },
            ],
          });
        } else if (user.level === "S1") {
          await prisma.portfolio.createMany({
            data: [
              {
                userId: user.id,
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce dengan React dan Node.js",
                type: "PROJECT",
                status: "PUBLISHED",
                link: "https://github.com/ani/ecommerce",
                githubUrl: "https://github.com/ani/ecommerce",
                demoUrl: "https://ecommerce-ani.vercel.app",
                tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
              },
              {
                userId: user.id,
                title: "Magang di Tokopedia",
                description: "Software Engineer Intern - Frontend Team",
                type: "EXPERIENCE",
                status: "PUBLISHED",
                startDate: new Date("2024-06-01"),
                endDate: new Date("2024-08-31"),
                tags: ["Internship", "React", "Microfrontends"],
              },
              {
                userId: user.id,
                title: "Google Cloud Certification",
                description: "Professional Cloud Architect",
                type: "CERTIFICATE",
                status: "PUBLISHED",
                tags: ["Google Cloud", "Cloud Computing", "Certificate"],
              },
            ],
          });
        } else if (user.level === "S2_S3") {
          await prisma.portfolio.createMany({
            data: [
              {
                userId: user.id,
                title: "Paper: AI untuk Prediksi Cuaca",
                description: "Published in International Journal of AI",
                type: "PUBLICATION",
                status: "PUBLISHED",
                link: "https://doi.org/10.1234/ai-weather",
                tags: [
                  "AI",
                  "Machine Learning",
                  "Weather Prediction",
                  "Publication",
                ],
              },
              {
                userId: user.id,
                title: "Grant Riset Nasional 2024",
                description: "Penelitian AI untuk pertanian berkelanjutan",
                type: "AWARD",
                status: "PUBLISHED",
                tags: ["Research Grant", "AI", "Agriculture"],
              },
              {
                userId: user.id,
                title: "Keynote Speaker: AI Conference",
                description: "International AI Conference 2024",
                type: "EXPERIENCE",
                status: "PUBLISHED",
                tags: ["Speaking", "AI", "Conference"],
              },
            ],
          });
        }
        console.log(`  ✅ Created portfolios for ${user.name}`);
      } else {
        console.log(`  ⏭️  Skipped ${user.name} (already has portfolios)`);
      }
    }
    console.log();

    // Create skills for each user
    console.log("Creating skills...");

    for (const user of users) {
      const skillCount = await prisma.skill.count({
        where: { userId: user.id },
      });

      if (skillCount === 0) {
        if (user.level === "SMA") {
          await prisma.skill.createMany({
            data: [
              {
                userId: user.id,
                name: "HTML/CSS",
                category: "TECHNICAL",
                level: "INTERMEDIATE",
                progress: 75,
              },
              {
                userId: user.id,
                name: "JavaScript",
                category: "TECHNICAL",
                level: "BEGINNER",
                progress: 45,
              },
              {
                userId: user.id,
                name: "Public Speaking",
                category: "SOFT_SKILL",
                level: "INTERMEDIATE",
                progress: 60,
              },
              {
                userId: user.id,
                name: "English",
                category: "LANGUAGE",
                level: "INTERMEDIATE",
                progress: 70,
              },
            ],
          });
        } else if (user.level === "S1") {
          await prisma.skill.createMany({
            data: [
              {
                userId: user.id,
                name: "React",
                category: "TECHNICAL",
                level: "ADVANCED",
                progress: 85,
              },
              {
                userId: user.id,
                name: "TypeScript",
                category: "TECHNICAL",
                level: "INTERMEDIATE",
                progress: 70,
              },
              {
                userId: user.id,
                name: "Node.js",
                category: "TECHNICAL",
                level: "INTERMEDIATE",
                progress: 65,
              },
              {
                userId: user.id,
                name: "Project Management",
                category: "SOFT_SKILL",
                level: "INTERMEDIATE",
                progress: 60,
              },
              {
                userId: user.id,
                name: "English",
                category: "LANGUAGE",
                level: "ADVANCED",
                progress: 85,
              },
            ],
          });
        } else if (user.level === "S2_S3") {
          await prisma.skill.createMany({
            data: [
              {
                userId: user.id,
                name: "Python",
                category: "TECHNICAL",
                level: "EXPERT",
                progress: 95,
              },
              {
                userId: user.id,
                name: "Machine Learning",
                category: "TECHNICAL",
                level: "EXPERT",
                progress: 90,
              },
              {
                userId: user.id,
                name: "Deep Learning",
                category: "TECHNICAL",
                level: "ADVANCED",
                progress: 80,
              },
              {
                userId: user.id,
                name: "Research Writing",
                category: "SOFT_SKILL",
                level: "EXPERT",
                progress: 95,
              },
              {
                userId: user.id,
                name: "English",
                category: "LANGUAGE",
                level: "EXPERT",
                progress: 95,
              },
            ],
          });
        }
        console.log(`  ✅ Created skills for ${user.name}`);
      } else {
        console.log(`  ⏭️  Skipped ${user.name} (already has skills)`);
      }
    }
    console.log();

    // Create user stats
    console.log("Creating user stats...");
    for (const user of users) {
      await prisma.userStats.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          portfolioCount:
            user.level === "SMA" ? 2 : user.level === "S1" ? 3 : 3,
          skillCount: user.level === "SMA" ? 4 : user.level === "S1" ? 5 : 5,
          roadmapCount: 0,
          achievementCount: 0,
        },
      });
    }
    console.log(`✅ Created user stats for all users\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Demo Users for OAuth Testing:");
    console.log(
      "┌─────────────────────────────────────┬─────────────┬────────────────────────────┐"
    );
    console.log(
      "│ Email                               │ Level       │ Name                       │"
    );
    console.log(
      "├─────────────────────────────────────┼─────────────┼────────────────────────────┤"
    );
    users.forEach((u) => {
      console.log(
        `│ ${u.email.padEnd(35)} │ ${u.level.padEnd(11)} │ ${u.name.padEnd(
          26
        )} │`
      );
    });
    console.log(
      "└─────────────────────────────────────┴─────────────┴────────────────────────────┘"
    );
    console.log(
      "\n💡 You can now login with these users via OAuth (Google/LinkedIn)"
    );
    console.log("   Make sure the email matches your OAuth account email.");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check if DATABASE_URL in .env.local is correct");
    console.error("   2. Ensure database server is running and accessible");
    console.error("   3. Try running: npx prisma db push");
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
