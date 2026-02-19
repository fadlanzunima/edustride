/**
 * Seed script for notifications
 * Run with: npx tsx scripts/seed-notifications.ts
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function seedNotifications() {
  try {
    // Get demo users
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ["demo@edustride.id", "sma@edustride.id", "s2@edustride.id"],
        },
      },
    });

    if (users.length === 0) {
      console.log("No demo users found. Please run /api/seed first.");
      return;
    }

    const sampleNotifications = [
      {
        title: "Selamat Datang di EduStride!",
        message:
          "Terima kasih telah bergabung. Jelajahi fitur portofolio dan skill kami.",
        type: "INFO" as const,
        actionUrl: "/dashboard/portfolio",
      },
      {
        title: "Portofolio Berhasil Dibuat",
        message:
          "Portofolio Anda telah berhasil dipublikasikan dan dapat dilihat oleh recruiter.",
        type: "SUCCESS" as const,
        actionUrl: "/dashboard/portfolio",
      },
      {
        title: "Tantangan Skill Baru",
        message:
          "Selesaikan kuis JavaScript untuk meningkatkan skill score Anda!",
        type: "WARNING" as const,
        actionUrl: "/dashboard/quiz",
      },
      {
        title: "Deadline Tugas Mendekat",
        message: "Ada 3 tugas yang mendekati deadline dalam 24 jam ke depan.",
        type: "ERROR" as const,
        actionUrl: "/dashboard/activities",
      },
      {
        title: "Pencapaian Baru!",
        message: "Anda telah mencapai 100 XP dan naik ke Level 2. Pertahankan!",
        type: "SUCCESS" as const,
        actionUrl: "/dashboard/achievements",
      },
      {
        title: "Tips Karir Harian",
        message:
          "Update LinkedIn profile Anda untuk meningkatkan visibilitas ke recruiter.",
        type: "INFO" as const,
        actionUrl: "/dashboard/settings",
      },
      {
        title: "Koneksi Baru",
        message:
          "Seseorang melihat portofolio Anda. Lihat analitik untuk detailnya.",
        type: "INFO" as const,
        actionUrl: "/dashboard/analytics",
      },
      {
        title: "Sertifikat Tersedia",
        message:
          "Sertifikat penyelesaian course React telah tersedia untuk diunduh.",
        type: "SUCCESS" as const,
        actionUrl: "/dashboard/documents",
      },
    ];

    let createdCount = 0;

    for (const user of users) {
      // Create a mix of read and unread notifications
      for (let i = 0; i < sampleNotifications.length; i++) {
        const notification = sampleNotifications[i];
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            actionUrl: notification.actionUrl,
            read: i < 3, // First 3 are read, rest are unread
          },
        });
        createdCount++;
      }
      console.log(
        `Created ${sampleNotifications.length} notifications for ${user.email}`
      );
    }

    console.log(`\n✅ Successfully seeded ${createdCount} notifications`);
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
