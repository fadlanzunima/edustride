import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

/**
 * POST /api/profile/share
 * Generate a share token for the user's public profile
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Generate unique share token
    const shareToken = nanoid(12);

    // Update user with share token and make profile public
    await prisma.user.update({
      where: { id: userId },
      data: {
        isProfilePublic: true,
        shareToken,
      },
    });

    // Create shared portfolio entries for all published portfolios
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId,
        status: "PUBLISHED",
      },
    });

    for (const portfolio of portfolios) {
      await prisma.sharedPortfolio.create({
        data: {
          userId,
          portfolioId: portfolio.id,
          shareToken,
        },
      });
    }

    const shareUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/p/${shareToken}`;

    return NextResponse.json({
      success: true,
      shareUrl,
      shareToken,
    });
  } catch (error) {
    console.error("Error generating share token:", error);
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/share
 * Revoke the share token and make profile private
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Make profile private and remove share token
    await prisma.user.update({
      where: { id: userId },
      data: {
        isProfilePublic: false,
        shareToken: null,
      },
    });

    // Delete all shared portfolio entries for this user
    await prisma.sharedPortfolio.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: "Profile sharing disabled",
    });
  } catch (error) {
    console.error("Error revoking share token:", error);
    return NextResponse.json(
      { error: "Failed to disable sharing" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/profile/share
 * Get current share status
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isProfilePublic: true,
        shareToken: true,
        viewCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      isPublic: user.isProfilePublic,
      shareToken: user.shareToken,
      shareUrl: user.shareToken
        ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/${
            user.shareToken
          }`
        : null,
      viewCount: user.viewCount,
    });
  } catch (error) {
    console.error("Error getting share status:", error);
    return NextResponse.json(
      { error: "Failed to get share status" },
      { status: 500 }
    );
  }
}
