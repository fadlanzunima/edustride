import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createQuizSchema, quizQuerySchema } from "@/lib/validations";

/**
 * GET /api/quizzes
 * Get all quizzes (with optional filters)
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
    const validation = quizQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { category, difficulty, skillId, search, page, limit } = validation.data;

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id,
      isActive: true,
    };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (skillId) where.skillId = skillId;
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ]);

    const result = {
      data: quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes
 * Create a new quiz
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createQuizSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { title, description, category, difficulty, timeLimit, passingScore, skillId, questions } = validation.data;

    // Check if skill exists (if provided)
    if (skillId) {
      const skill = await prisma.skill.findUnique({
        where: { id: skillId },
      });
      if (!skill) {
        return NextResponse.json(
          { error: "Skill not found" },
          { status: 404 }
        );
      }
    }

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        userId: session.user.id,
        title,
        description,
        category,
        difficulty,
        timeLimit,
        passingScore,
        skillId,
        questions: questions ? {
          create: questions.map((q, index) => ({
            question: q.question,
            type: q.type,
            order: index,
            points: q.points || 1,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        } : undefined,
      },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        questions: true,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
