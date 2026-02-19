import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { activityQuerySchema, createActivitySchema } from "@/lib/validations";
import { trackActivity } from "@/lib/realtime";

/**
 * GET /api/activities
 * Get activities for the current user
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

    const { type, entityType, page, limit, startDate, endDate } =
      validation.data;

    // Generate cache key
    const cacheKey = cache.key(
      "user",
      session.user.id,
      "activities",
      JSON.stringify(validation.data)
    );

    // Try to get from cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

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

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);

    const result = {
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await cache.set(cacheKey, result, 60); // 1 minute cache for activities

    return NextResponse.json(result);
  } catch (error) {
    console.error("Activities GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activities
 * Create a new activity and broadcast real-time update
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createActivitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { type, title, description, entityType, entityId, metadata } =
      validation.data;

    // Create activity in database
    const activity = await prisma.activity.create({
      data: {
        userId: session.user.id,
        type,
        title,
        description,
        entityType,
        entityId,
        metadata: metadata || {},
      },
    });

    // Broadcast real-time activity event
    trackActivity(session.user.id, {
      action: type,
      entityType: entityType || "general",
      entityId,
      metadata: {
        title,
        description,
        ...metadata,
      },
    });

    // Invalidate activities cache
    await cache.deletePattern(`user:${session.user.id}:activities:*`);

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Activities POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
