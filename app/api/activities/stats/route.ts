import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { activityQuerySchema } from "@/lib/validations";

/**
 * GET /api/activities/stats
 * Get activity statistics for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validation = activityQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { type, entityType, startDate, endDate } = validation.data;

    // Build where clause
    const where: Record<string, unknown> = { userId: session.user.id };
    if (type) where.type = type;
    if (entityType) where.entityType = entityType;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate)
        (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      if (endDate)
        (where.createdAt as Record<string, Date>).lte = new Date(endDate);
    }

    // Calculate last 30 days date
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Get total count
    const total = await prisma.activity.count({ where });

    // Get last 30 days count
    const last30DaysCount = await prisma.activity.count({
      where: {
        ...where,
        createdAt: { gte: last30Days },
      },
    });

    // Get weekly activity (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weeklyActivity = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: last7Days },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get activities by type
    const activitiesByType = await prisma.activity.groupBy({
      by: ["type"],
      where: { userId: session.user.id },
      _count: { type: true },
    });

    const byType = activitiesByType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<string, number>);

    const result = {
      total,
      last30Days: last30DaysCount,
      weeklyActivity,
      byType,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Activities stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
