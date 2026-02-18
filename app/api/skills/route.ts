import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSkillSchema, skillQuerySchema } from "@/lib/validations";

/**
 * GET /api/skills
 * Get all skills for the current user
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
    const validation = skillQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { category, level, search, page, limit, sortBy, sortOrder } =
      validation.data;

    // Build where clause
    const where: Record<string, unknown> = { userId: session.user.id };
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.skill.count({ where }),
    ]);

    const result = {
      data: skills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skills GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/skills
 * Create a new skill
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validation = createSkillSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Create skill
    const skill = await prisma.skill.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "SKILL_ADDED",
        title: `Added new skill: ${validation.data.name}`,
        entityType: "skill",
        entityId: skill.id,
        metadata: {
          category: validation.data.category,
          level: validation.data.level,
        },
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Skills POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
