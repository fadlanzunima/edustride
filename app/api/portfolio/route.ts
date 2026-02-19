import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { createPortfolioSchema, portfolioQuerySchema } from "@/lib/validations";
import { notifyPortfolioUpdate, trackActivity } from "@/lib/realtime";

/**
 * GET /api/portfolio
 * Get all portfolios for the current user with optional filtering
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
    const validation = portfolioQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { type, status, isFeatured, search, page, limit, sortBy, sortOrder } =
      validation.data;

    // Generate cache key
    const cacheKey = cache.key(
      "user",
      session.user.id,
      "portfolio",
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
    if (status) where.status = status;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.portfolio.count({ where }),
    ]);

    const result = {
      data: portfolios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await cache.set(cacheKey, result, 300); // 5 minutes

    return NextResponse.json(result);
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portfolio
 * Create a new portfolio item
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validation = createPortfolioSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        ...validation.data,
        userId: session.user.id,
        startDate: validation.data.startDate
          ? new Date(validation.data.startDate)
          : null,
        endDate: validation.data.endDate
          ? new Date(validation.data.endDate)
          : null,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "PORTFOLIO_CREATED",
        title: `Created new ${validation.data.type.toLowerCase()}: ${
          validation.data.title
        }`,
        entityType: "portfolio",
        entityId: portfolio.id,
      },
    });

    // Broadcast real-time portfolio update
    notifyPortfolioUpdate(session.user.id, {
      portfolioId: portfolio.id,
      action: portfolio.status === "PUBLISHED" ? "published" : "created",
      title: portfolio.title,
    });

    // Broadcast real-time activity
    trackActivity(session.user.id, {
      action: "PORTFOLIO_CREATED",
      entityType: "portfolio",
      entityId: portfolio.id,
      metadata: {
        title: portfolio.title,
        type: portfolio.type,
      },
    });

    // Invalidate cache
    await cache.invalidateUser(session.user.id);

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
