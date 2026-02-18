import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { updatePortfolioSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/portfolio/[id]
 * Get a specific portfolio item
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Try cache first
    const cacheKey = cache.key("portfolio", id);
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cache the result
    await cache.set(cacheKey, portfolio, 300);

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/portfolio/[id]
 * Update a portfolio item
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate request body
    const validation = updatePortfolioSchema.safeParse({ ...body, id });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update portfolio
    const { id: _, ...updateData } = validation.data;
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate
          ? new Date(updateData.startDate)
          : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "PORTFOLIO_UPDATED",
        title: `Updated portfolio: ${portfolio.title}`,
        entityType: "portfolio",
        entityId: portfolio.id,
      },
    });

    // Invalidate caches
    await cache.delete(cacheKey("portfolio", id));
    await cache.invalidateUser(session.user.id);

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Portfolio PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portfolio/[id]
 * Delete a portfolio item
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete portfolio
    await prisma.portfolio.delete({
      where: { id },
    });

    // Invalidate caches
    await cache.delete(cacheKey("portfolio", id));
    await cache.invalidateUser(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function for cache key
function cacheKey(...parts: string[]): string {
  return parts.join(":");
}
