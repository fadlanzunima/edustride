/**
 * SSE (Server-Sent Events) API Route
 * Provides real-time event streaming for connected clients
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { createSSEStream, RealtimeEventType } from "@/lib/realtime";

/**
 * GET /api/realtime
 * SSE endpoint for real-time updates
 *
 * Query parameters:
 * - types: Comma-separated list of event types to subscribe to
 * - lastEventId: Last received event ID for reconnection recovery
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(req.url);
    const typesParam = searchParams.get("types");
    const lastEventId = searchParams.get("lastEventId") || undefined;

    // Parse event types
    const types = typesParam
      ? typesParam
          .split(",")
          .filter((t): t is RealtimeEventType =>
            [
              "activity",
              "notification",
              "portfolio-update",
              "skill-progress",
              "roadmap-update",
              "quiz-completed",
              "achievement-unlocked",
            ].includes(t)
          )
      : undefined;

    // Create SSE stream
    const stream = createSSEStream(session.user.id, { types, lastEventId });

    // Return SSE response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error("Realtime SSE error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * OPTIONS /api/realtime
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
