import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { updateRoadmapSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/roadmap/[id]
 * Get a specific roadmap with items
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Try cache first
    const cacheKey = cache.key("roadmap", id);
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cache the result
    await cache.set(cacheKey, roadmap, 300);

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/roadmap/[id]
 * Update a roadmap
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
    const validation = updateRoadmapSchema.safeParse({ ...body, id });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await prisma.roadmap.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update roadmap
    const { id: _, deadline, ...updateData } = validation.data;
    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        ...updateData,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        items: true,
      },
    });

    // Invalidate caches
    await cache.delete(cache.key("roadmap", id));
    await cache.invalidateUser(session.user.id);

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roadmap/[id]
 * Delete a roadmap
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.roadmap.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete roadmap (cascade will delete items)
    await prisma.roadmap.delete({
      where: { id },
    });

    // Invalidate caches
    await cache.delete(cache.key("roadmap", id));
    await cache.invalidateUser(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Roadmap DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
