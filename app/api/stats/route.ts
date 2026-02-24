import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Count users with SMA level
    const totalSMAUsers = await prisma.user.count({
      where: {
        level: "SMA",
      },
    });

    // Count all portfolios
    const totalPortfolios = await prisma.portfolio.count();

    // Count schools (unique institutions from SMA users)
    const schools = await prisma.user.groupBy({
      by: ["institution"],
      where: {
        level: "SMA",
        institution: {
          not: null,
        },
      },
    });
    const totalSchools = schools.length;

    // For success rate, we'll use a placeholder calculation
    // In a real scenario, this would come from an admissions tracking table
    const successRate =
      totalSMAUsers > 0
        ? Math.min(95, Math.round((totalPortfolios / totalSMAUsers) * 50))
        : 0;

    return NextResponse.json({
      totalSMAUsers,
      totalPortfolios,
      totalSchools,
      successRate,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
