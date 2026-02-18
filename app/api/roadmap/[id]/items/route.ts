import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { roadmapItemSchema, updateRoadmapItemSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/roadmap/[id]/items
 * Add an item to a roadmap
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    const body = await req.json();

    // Check ownership
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate request body
    const validation = roadmapItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await prisma.roadmapItem.aggregate({
      where: { roadmapId },
      _max: { order: true },
    });

    // Create item
    const item = await prisma.roadmapItem.create({
      data: {
        ...validation.data,
        roadmapId,
        order: validation.data.order ?? (maxOrder._max.order ?? -1) + 1,
        deadline: validation.data.deadline
          ? new Date(validation.data.deadline)
          : null,
      },
    });

    // Invalidate cache
    await cache.delete(cache.key("roadmap", roadmapId));

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Roadmap item POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/roadmap/[id]/items
 * Update a roadmap item
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    const body = await req.json();

    // Validate request body
    const validation = updateRoadmapItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { itemId, ...updateData } = validation.data;

    // Check ownership
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap || roadmap.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update item
    const item = await prisma.roadmapItem.update({
      where: { id: itemId, roadmapId },
      data: {
        ...updateData,
        deadline: updateData.deadline
          ? new Date(updateData.deadline)
          : undefined,
        completedAt: updateData.status === "COMPLETED" ? new Date() : undefined,
      },
    });

    // Create activity if item completed
    if (updateData.status === "COMPLETED") {
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: "ROADMAP_ITEM_COMPLETED",
          title: `Completed: ${item.title}`,
          entityType: "roadmap",
          entityId: roadmapId,
        },
      });

      // Check if all items completed
      const totalItems = await prisma.roadmapItem.count({
        where: { roadmapId },
      });
      const completedItems = await prisma.roadmapItem.count({
        where: { roadmapId, status: "COMPLETED" },
      });

      if (totalItems === completedItems) {
        await prisma.activity.create({
          data: {
            userId: session.user.id,
            type: "ROADMAP_COMPLETED",
            title: `Completed roadmap: ${roadmap.title}`,
            entityType: "roadmap",
            entityId: roadmapId,
          },
        });
      }
    }

    // Invalidate cache
    await cache.delete(cache.key("roadmap", roadmapId));

    return NextResponse.json(item);
  } catch (error) {
    console.error("Roadmap item PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roadmap/[id]/items?itemId=xxx
 * Delete a roadmap item
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Check ownership
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap || roadmap.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete item
    await prisma.roadmapItem.delete({
      where: { id: itemId, roadmapId },
    });

    // Invalidate cache
    await cache.delete(cache.key("roadmap", roadmapId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Roadmap item DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
