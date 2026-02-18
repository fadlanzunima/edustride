#!/usr/bin/env ts-node
/**
 * Database Seeding Script
 *
 * This script creates sample data in the database for testing purposes.
 * Run with: npx tsx scripts/seed-database.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // Create a test user
  console.log("Creating test user...");
  const user = await prisma.user.upsert({
    where: { email: "test@edustride.id" },
    update: {},
    create: {
      email: "test@edustride.id",
      name: "Test Student",
      level: "S1",
      institution: "Universitas Indonesia",
      bio: "Mahasiswa Teknik Informatika yang passionate dengan web development",
    },
  });
  console.log(`✅ User created: ${user.name} (${user.email})\n`);

  // Create sample portfolio items
  console.log("Creating portfolio items...");
  const portfolios = await Promise.all([
    prisma.portfolio.create({
      data: {
        userId: user.id,
        title: "E-Commerce Website",
        description: "Website e-commerce lengkap dengan payment gateway",
        type: "PROJECT",
        status: "PUBLISHED",
        link: "https://github.com/example/ecommerce",
        githubUrl: "https://github.com/example/ecommerce",
        demoUrl: "https://ecommerce-demo.vercel.app",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-15"),
        tags: ["React", "Node.js", "PostgreSQL"],
      },
    }),
    prisma.portfolio.create({
      data: {
        userId: user.id,
        title: "Mobile App Design",
        description: "UI/UX design untuk aplikasi fitness tracking",
        type: "PROJECT",
        status: "PUBLISHED",
        link: "https://behance.net/example/fitness-app",
        startDate: new Date("2024-02-01"),
        tags: ["Figma", "UI/UX", "Mobile Design"],
      },
    }),
    prisma.portfolio.create({
      data: {
        userId: user.id,
        title: "Google Data Analytics Certificate",
        description: "Professional certificate in data analytics",
        type: "CERTIFICATE",
        status: "PUBLISHED",
        link: "https://coursera.org/verify/abc123",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-04-20"),
        tags: ["Data Analytics", "Google", "Certificate"],
      },
    }),
  ]);
  console.log(`✅ Created ${portfolios.length} portfolio items\n`);

  // Create sample skills
  console.log("Creating skills...");
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        userId: user.id,
        name: "React",
        category: "TECHNICAL",
        level: "ADVANCED",
        progress: 85,
      },
    }),
    prisma.skill.create({
      data: {
        userId: user.id,
        name: "TypeScript",
        category: "TECHNICAL",
        level: "INTERMEDIATE",
        progress: 70,
      },
    }),
    prisma.skill.create({
      data: {
        userId: user.id,
        name: "Public Speaking",
        category: "SOFT_SKILL",
        level: "INTERMEDIATE",
        progress: 60,
      },
    }),
    prisma.skill.create({
      data: {
        userId: user.id,
        name: "English",
        category: "LANGUAGE",
        level: "ADVANCED",
        progress: 90,
      },
    }),
  ]);
  console.log(`✅ Created ${skills.length} skills\n`);

  // Create sample roadmap
  console.log("Creating roadmap...");
  const roadmap = await prisma.roadmap.create({
    data: {
      userId: user.id,
      title: "Full Stack Developer Path",
      description: "Roadmap menjadi full stack developer profesional",
      level: "S1",
      category: "Career",
      progress: 25,
      items: {
        create: [
          {
            title: "Belajar React Fundamentals",
            description: "Mempelajari hooks, components, dan state management",
            status: "COMPLETED",
            order: 1,
          },
          {
            title: "TypeScript Mastery",
            description: "Deep dive into TypeScript types dan generics",
            status: "IN_PROGRESS",
            order: 2,
          },
          {
            title: "Node.js & Express",
            description: "Backend development dengan Node.js",
            status: "NOT_STARTED",
            order: 3,
          },
          {
            title: "Database Design",
            description: "Relational database design dan optimization",
            status: "NOT_STARTED",
            order: 4,
          },
        ],
      },
    },
  });
  console.log(`✅ Created roadmap: ${roadmap.title} with 4 items\n`);

  // Create sample activities
  console.log("Creating activities...");
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        userId: user.id,
        type: "PORTFOLIO_CREATED",
        title: "Portfolio Created",
        description: "Menambahkan project 'E-Commerce Website' ke portfolio",
        entityType: "portfolio",
        entityId: portfolios[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        userId: user.id,
        type: "SKILL_LEVEL_UP",
        title: "Skill Progress Updated",
        description: "Progress skill React meningkat menjadi 85%",
        entityType: "skill",
        entityId: skills[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        userId: user.id,
        type: "ROADMAP_ITEM_COMPLETED",
        title: "Milestone Reached",
        description: "Menyelesaikan 'Belajar React Fundamentals'",
        entityType: "roadmap",
        entityId: roadmap.id,
      },
    }),
  ]);
  console.log(`✅ Created ${activities.length} activities\n`);

  // Create user stats
  console.log("Creating user stats...");
  const userStats = await prisma.userStats.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      portfolioCount: 3,
      skillCount: 4,
      roadmapCount: 1,
      achievementCount: 0,
      totalProfileViews: 0,
      weeklyActiveHours: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
  });
  console.log(`✅ User stats created\n`);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\nTest user credentials:");
  console.log(`  Email: ${user.email}`);
  console.log(`  Name: ${user.name}`);
  console.log(`  Level: ${user.level}`);
  console.log("\nYou can now test the API endpoints with this user data.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
