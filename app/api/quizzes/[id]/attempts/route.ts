import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { submitQuizSchema } from "@/lib/validations";

/**
 * GET /api/quizzes/[id]/attempts
 * Get all attempts for a specific quiz
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: quizId } = await params;

    // Check if quiz exists and belongs to user
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        userId: session.user.id,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId },
      orderBy: { completedAt: "desc" },
      take: 10, // Get last 10 attempts
    });

    return NextResponse.json({ data: attempts });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes/[id]/attempts
 * Submit a quiz attempt
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: quizId } = await params;
    const body = await req.json();
    const validation = submitQuizSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { answers } = validation.data;

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!quiz.isActive) {
      return NextResponse.json({ error: "Quiz is not active" }, { status: 400 });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    const quizAnswers = await Promise.all(
      answers.map(async (answer) => {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        if (!question) return null;

        totalPoints += question.points;

        let isCorrect = false;
        let points = 0;

        if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
          // For multiple choice, check if answer matches correctAnswer
          isCorrect = answer.answer === question.correctAnswer;
          points = isCorrect ? question.points : 0;
        } else {
          // For essay/short answer, mark as incorrect by default (requires manual review)
          isCorrect = false;
          points = 0;
        }

        if (isCorrect) {
          earnedPoints += points;
        }

        return prisma.quizAnswer.create({
          data: {
            attemptId: "", // Will be set after attempt creation
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect,
            points,
          },
        });
      })
    );

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    // Create attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        passed,
        completedAt: new Date(),
        answers: answers as any,
        feedback: passed
          ? `Congratulations! You passed with a score of ${score}%.`
          : `You scored ${score}%. The passing score is ${quiz.passingScore}%.`,
      },
      include: {
        questionAnswers: true,
      },
    });

    // Update user's skill progress if quiz is linked to a skill and user passed
    if (quiz.skillId && passed) {
      await prisma.skill.update({
        where: { id: quiz.skillId },
        data: {
          progress: {
            increment: Math.min(10, score / 10), // Add up to 10% progress
          },
        },
      });

      // Create activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: "CERTIFICATE_EARNED",
          title: "Passed Quiz",
          description: `Completed quiz: ${quiz.title} with score ${score}%`,
          entityType: "quiz",
          entityId: quizId,
        },
      });
    }

    return NextResponse.json({
      attempt,
      score,
      passed,
      message: passed ? "Congratulations! You passed the quiz!" : "Keep practicing!",
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz attempt" },
      { status: 500 }
    );
  }
}
