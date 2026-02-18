import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateSkillSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/skills/[id]
 * Get a specific skill
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    if (skill.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Skill GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/skills/[id]
 * Update a skill
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
    const validation = updateSkillSchema.safeParse({ ...body, id });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if progress changed significantly
    const oldProgress = existing.progress;
    const newProgress = validation.data.progress ?? oldProgress;

    // Update skill
    const { id: _, ...updateData } = validation.data;
    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    // Create activity if progress increased significantly
    if (newProgress > oldProgress && newProgress % 25 === 0) {
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: "SKILL_LEVEL_UP",
          title: `Reached ${newProgress}% in ${skill.name}`,
          entityType: "skill",
          entityId: skill.id,
          metadata: { progress: newProgress },
        },
      });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Skill PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/skills/[id]
 * Delete a skill
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete skill
    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skill DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
