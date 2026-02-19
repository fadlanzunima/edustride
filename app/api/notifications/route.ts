/**
 * Notifications API
 * Manage user notifications with real-time support
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { z } from "zod";
import { sendNotification, getRecentEvents } from "@/lib/realtime";

const notificationCreateSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  actionUrl: z.string().url().optional(),
});

const notificationUpdateSchema = z.object({
  read: z.boolean(),
});

const notificationQuerySchema = z.object({
  unreadOnly: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/notifications
 * Get notifications for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = notificationQuerySchema.parse({
      unreadOnly: searchParams.get("unreadOnly") === "true",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "20", 10),
    });

    const cacheKey = cache.key(
      "user",
      session.user.id,
      "notifications",
      JSON.stringify(query)
    );

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Get from database
    const where = {
      userId: session.user.id,
      ...(query.unreadOnly ? { read: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: session.user.id, read: false },
      }),
    ]);

    const result = {
      data: notifications,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        unreadCount,
        totalPages: Math.ceil(total / query.limit),
      },
    };

    // Cache for 30 seconds
    await cache.set(cacheKey, result, 30);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification (for system/admin use)
 * Also sends real-time notification via SSE
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = notificationCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { title, message, type, actionUrl } = validation.data;

    // Map lowercase type to uppercase enum
    const typeMap: Record<string, string> = {
      info: "INFO",
      success: "SUCCESS",
      warning: "WARNING",
      error: "ERROR",
    };

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        title,
        message,
        type: typeMap[type] || "INFO",
        actionUrl,
        read: false,
      },
    });

    // Send real-time notification
    sendNotification(session.user.id, {
      title,
      message,
      type,
      actionUrl,
    });

    // Invalidate notifications cache
    await cache.deletePattern(`user:${session.user.id}:notifications:*`);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Notifications POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      // Mark all as read
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false,
        },
        data: { read: true },
      });
    } else if (notificationId) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: session.user.id,
        },
        data: { read: true },
      });
    } else {
      return NextResponse.json(
        { error: "notificationId or markAllRead required" },
        { status: 400 }
      );
    }

    // Invalidate cache
    await cache.deletePattern(`user:${session.user.id}:notifications:*`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete notifications
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");
    const deleteAllRead = searchParams.get("deleteAllRead") === "true";

    if (notificationId) {
      // Delete specific notification
      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId: session.user.id,
        },
      });
    } else if (deleteAllRead) {
      // Delete all read notifications
      await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
          read: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: "notificationId or deleteAllRead required" },
        { status: 400 }
      );
    }

    // Invalidate cache
    await cache.deletePattern(`user:${session.user.id}:notifications:*`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
