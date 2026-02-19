/**
 * Real-time hooks for SSE (Server-Sent Events)
 * Provides reactive subscriptions to server events
 */

"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import type {
  RealtimeEvent,
  RealtimeEventType,
  NotificationEvent,
} from "@/lib/realtime";

interface UseRealtimeOptions {
  types?: RealtimeEventType[];
  onMessage?: (event: RealtimeEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectOnError?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  lastEvent: RealtimeEvent | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Hook for subscribing to real-time SSE events
 */
export function useRealtime(
  options: UseRealtimeOptions = {}
): UseRealtimeReturn {
  const {
    types,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectOnError = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
  } = options;

  const { data: session } = useSession();
  const [isConnected, setIsConnected] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState<RealtimeEvent | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const eventSourceRef = React.useRef<EventSource | null>(null);
  const reconnectAttemptsRef = React.useRef(0);
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastEventIdRef = React.useRef<string | null>(null);

  const disconnect = React.useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const connect = React.useCallback(() => {
    if (!session?.user?.id || eventSourceRef.current) {
      return;
    }

    try {
      // Build URL with query parameters
      const url = new URL("/api/realtime", window.location.origin);

      if (types?.length) {
        url.searchParams.set("types", types.join(","));
      }

      if (lastEventIdRef.current) {
        url.searchParams.set("lastEventId", lastEventIdRef.current);
      }

      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as RealtimeEvent;

          // Store last event ID for reconnection recovery
          if (data.id) {
            lastEventIdRef.current = data.id;
          }

          setLastEvent(data);
          onMessage?.(data);
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      };

      eventSource.onerror = (event) => {
        setIsConnected(false);
        setError(new Error("SSE connection error"));
        onError?.(event);

        // Close current connection
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt reconnection
        if (
          reconnectOnError &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectAttemptsRef.current); // Exponential backoff
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to connect"));
      setIsConnected(false);
    }
  }, [
    session?.user?.id,
    types,
    onMessage,
    onConnect,
    onError,
    reconnectOnError,
    reconnectInterval,
    maxReconnectAttempts,
  ]);

  const reconnect = React.useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  // Connect on mount and when session changes
  React.useEffect(() => {
    if (session?.user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session?.user?.id, connect, disconnect]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastEvent,
    error,
    reconnect,
    disconnect,
  };
}

/**
 * Hook specifically for real-time notifications
 */
interface UseRealtimeNotificationsReturn {
  notifications: NotificationEvent[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = React.useState<NotificationEvent[]>(
    []
  );
  const [unreadCount, setUnreadCount] = React.useState(0);
  const { isConnected, lastEvent } = useRealtime({
    types: ["notification"],
  });

  // Fetch initial notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications?limit=50");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data);
          setUnreadCount(data.meta.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle new real-time notifications
  React.useEffect(() => {
    if (lastEvent?.type === "notification" && lastEvent.data) {
      const notification = lastEvent.data as NotificationEvent;
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
  }, [lastEvent]);

  const markAsRead = React.useCallback(async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllAsRead = React.useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  const deleteNotification = React.useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/notifications?id=${notificationId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    []
  );

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

/**
 * Hook for real-time activity feed
 */
interface UseRealtimeActivitiesReturn {
  activities: RealtimeEvent[];
  isConnected: boolean;
}

export function useRealtimeActivities(): UseRealtimeActivitiesReturn {
  const [activities, setActivities] = React.useState<RealtimeEvent[]>([]);
  const { isConnected, lastEvent } = useRealtime({
    types: ["activity"],
  });

  // Handle new real-time activities
  React.useEffect(() => {
    if (lastEvent?.type === "activity") {
      setActivities((prev) => [lastEvent, ...prev].slice(0, 100));
    }
  }, [lastEvent]);

  return {
    activities,
    isConnected,
  };
}

/**
 * Hook for real-time portfolio updates
 */
interface UseRealtimePortfolioReturn {
  lastUpdate: RealtimeEvent | null;
  isConnected: boolean;
}

export function useRealtimePortfolio(): UseRealtimePortfolioReturn {
  const { isConnected, lastEvent } = useRealtime({
    types: ["portfolio-update"],
  });

  return {
    lastUpdate: lastEvent?.type === "portfolio-update" ? lastEvent : null,
    isConnected,
  };
}
