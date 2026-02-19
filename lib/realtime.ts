/**
 * Real-time Event System for EduStride
 * Provides SSE (Server-Sent Events) infrastructure for live updates
 */

import { cache } from "./cache";

export type RealtimeEventType =
  | "activity"
  | "notification"
  | "portfolio-update"
  | "skill-progress"
  | "roadmap-update"
  | "quiz-completed"
  | "achievement-unlocked";

export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  userId: string;
  data: unknown;
  timestamp: Date;
}

export interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// In-memory event store for recent events (last 100 per user type)
const eventStore = new Map<string, RealtimeEvent[]>();
const MAX_STORED_EVENTS = 100;

// Active SSE connections
const connections = new Map<
  string,
  ReadableStreamDefaultController<Uint8Array>[]
>();

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Store event for later retrieval
 */
function storeEvent(userId: string, event: RealtimeEvent): void {
  const key = `events:${userId}:${event.type}`;
  const events = eventStore.get(key) || [];
  events.unshift(event);

  // Keep only last N events
  if (events.length > MAX_STORED_EVENTS) {
    events.length = MAX_STORED_EVENTS;
  }

  eventStore.set(key, events);

  // Also cache in Redis/memory for persistence
  cache.set(key, events, 300); // 5 minutes
}

/**
 * Broadcast event to all connected clients for a user
 */
export function broadcastEvent(
  userId: string,
  event: Omit<RealtimeEvent, "id" | "timestamp">
): void {
  const fullEvent: RealtimeEvent = {
    ...event,
    id: generateEventId(),
    timestamp: new Date(),
  };

  // Store event
  storeEvent(userId, fullEvent);

  // Broadcast to connected clients
  const userConnections = connections.get(userId) || [];
  const encoder = new TextEncoder();
  const data = `data: ${JSON.stringify(fullEvent)}\n\n`;

  userConnections.forEach((controller) => {
    try {
      controller.enqueue(encoder.encode(data));
    } catch {
      // Connection closed, will be cleaned up on next disconnect
    }
  });
}

/**
 * Add SSE connection for a user
 */
export function addConnection(
  userId: string,
  controller: ReadableStreamDefaultController<Uint8Array>
): () => void {
  const userConnections = connections.get(userId) || [];
  userConnections.push(controller);
  connections.set(userId, userConnections);

  // Return cleanup function
  return () => {
    const conns = connections.get(userId) || [];
    const index = conns.indexOf(controller);
    if (index > -1) {
      conns.splice(index, 1);
    }
    if (conns.length === 0) {
      connections.delete(userId);
    } else {
      connections.set(userId, conns);
    }
  };
}

/**
 * Get recent events for a user
 */
export async function getRecentEvents(
  userId: string,
  type?: RealtimeEventType,
  limit = 50
): Promise<RealtimeEvent[]> {
  if (type) {
    const key = `events:${userId}:${type}`;
    const cached = await cache.get<RealtimeEvent[]>(key);
    if (cached) {
      return cached.slice(0, limit);
    }
    return eventStore.get(key)?.slice(0, limit) || [];
  }

  // Get all event types
  const allEvents: RealtimeEvent[] = [];
  const eventTypes: RealtimeEventType[] = [
    "activity",
    "notification",
    "portfolio-update",
    "skill-progress",
    "roadmap-update",
    "quiz-completed",
    "achievement-unlocked",
  ];

  for (const eventType of eventTypes) {
    const key = `events:${userId}:${eventType}`;
    const cached = await cache.get<RealtimeEvent[]>(key);
    const events = cached || eventStore.get(key) || [];
    allEvents.push(...events);
  }

  // Sort by timestamp descending and limit
  return allEvents
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Send notification to user
 */
export function sendNotification(
  userId: string,
  notification: Omit<NotificationEvent, "id" | "createdAt" | "read">
): void {
  const fullNotification: NotificationEvent = {
    ...notification,
    id: generateEventId(),
    read: false,
    createdAt: new Date(),
  };

  broadcastEvent(userId, {
    type: "notification",
    userId,
    data: fullNotification,
  });
}

/**
 * Create SSE stream for a user
 */
export function createSSEStream(
  userId: string,
  options: { types?: RealtimeEventType[]; lastEventId?: string } = {}
): ReadableStream<Uint8Array> {
  const { types, lastEventId } = options;

  return new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "connected",
            timestamp: new Date(),
          })}\n\n`
        )
      );

      // Send any missed events if lastEventId is provided
      if (lastEventId) {
        getRecentEvents(userId, types?.[0]).then((events) => {
          const lastIndex = events.findIndex((e) => e.id === lastEventId);
          const missedEvents =
            lastIndex > -1 ? events.slice(0, lastIndex) : events;

          missedEvents.reverse().forEach((event) => {
            if (!types || types.includes(event.type)) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
              );
            }
          });
        });
      }

      // Add connection
      const cleanup = addConnection(userId, controller);

      // Handle client disconnect via cleanup
      // Note: The cancel() method below handles cleanup when client disconnects
    },

    cancel(reason) {
      // Clean up connection when client disconnects
      const userConnections = connections.get(userId) || [];
      const index = userConnections.findIndex((c) => c === undefined);
      if (index > -1) {
        userConnections.splice(index, 1);
      }
    },
  });
}

/**
 * Activity tracking helper
 */
export function trackActivity(
  userId: string,
  activity: {
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  broadcastEvent(userId, {
    type: "activity",
    userId,
    data: {
      ...activity,
      timestamp: new Date(),
    },
  });
}

/**
 * Portfolio update helper
 */
export function notifyPortfolioUpdate(
  userId: string,
  update: {
    portfolioId: string;
    action: "created" | "updated" | "deleted" | "published";
    title: string;
  }
): void {
  broadcastEvent(userId, {
    type: "portfolio-update",
    userId,
    data: {
      ...update,
      timestamp: new Date(),
    },
  });
}

/**
 * Skill progress update helper
 */
export function notifySkillProgress(
  userId: string,
  update: {
    skillId: string;
    skillName: string;
    oldProgress: number;
    newProgress: number;
  }
): void {
  broadcastEvent(userId, {
    type: "skill-progress",
    userId,
    data: {
      ...update,
      timestamp: new Date(),
    },
  });
}
