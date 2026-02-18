import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { createRoadmapSchema, roadmapQuerySchema } from "@/lib/validations";

/**
 * GET /api/roadmap
 * Get all roadmaps for the current user
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
    const validation = roadmapQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      level,
      category,
      isActive,
      isTemplate,
      page,
      limit,
      sortBy,
      sortOrder,
    } = validation.data;

    // Generate cache key
    const cacheKey = cache.key(
      "user",
      session.user.id,
      "roadmap",
      JSON.stringify(validation.data)
    );

    // Try to get from cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id,
      isTemplate: isTemplate ?? false,
    };
    if (level) where.level = level;
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.roadmap.count({ where }),
    ]);

    const result = {
      data: roadmaps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await cache.set(cacheKey, result, 300);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Roadmap GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/roadmap
 * Create a new roadmap
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validation = createRoadmapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { items, deadline, ...roadmapData } = validation.data;

    // Create roadmap with items
    const roadmap = await prisma.roadmap.create({
      data: {
        ...roadmapData,
        deadline: deadline ? new Date(deadline) : null,
        userId: session.user.id,
        items: {
          create: items.map((item, index) => ({
            ...item,
            deadline: item.deadline ? new Date(item.deadline) : null,
            order: item.order ?? index,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "ROADMAP_CREATED",
        title: `Created roadmap: ${validation.data.title}`,
        entityType: "roadmap",
        entityId: roadmap.id,
      },
    });

    // Invalidate cache
    await cache.invalidateUser(session.user.id);

    return NextResponse.json(roadmap, { status: 201 });
  } catch (error) {
    console.error("Roadmap POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
