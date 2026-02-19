"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Check,
  Clock,
  AlertTriangle,
  Award,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  X,
  CheckCheck,
  Trash2,
  Settings,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type NotificationType =
  | "deadline"
  | "achievement"
  | "recommendation"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "deadline",
    title: "Project Deadline Approaching",
    message:
      "Portfolio submission deadline is in 2 days. Don't forget to submit!",
    timestamp: "10 minutes ago",
    read: false,
    action: { label: "View Project" },
  },
  {
    id: "2",
    type: "achievement",
    title: "New Achievement Unlocked!",
    message:
      "You've earned the 'Skill Master' badge for completing 10 courses.",
    timestamp: "2 hours ago",
    read: false,
    action: { label: "View Badge" },
  },
  {
    id: "3",
    type: "recommendation",
    title: "Recommended for You",
    message:
      "Based on your interests, check out 'Advanced React Patterns' course.",
    timestamp: "5 hours ago",
    read: true,
    action: { label: "View Course" },
  },
  {
    id: "4",
    type: "deadline",
    title: "Quiz Available",
    message:
      "New quiz 'JavaScript Fundamentals' is now available. Test your knowledge!",
    timestamp: "1 day ago",
    read: true,
    action: { label: "Start Quiz" },
  },
  {
    id: "5",
    type: "system",
    title: "Profile Update Successful",
    message: "Your profile information has been updated successfully.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "achievement",
    title: "Portfolio Milestone",
    message: "Congratulations! Your portfolio has been viewed 1,000 times.",
    timestamp: "3 days ago",
    read: true,
    action: { label: "View Stats" },
  },
  {
    id: "7",
    type: "recommendation",
    title: "Weekly Learning Goal",
    message: "You're 75% towards your weekly goal. Keep it up!",
    timestamp: "4 days ago",
    read: true,
    action: { label: "Continue Learning" },
  },
  {
    id: "8",
    type: "deadline",
    title: "Certification Expiring",
    message: "Your AWS certification expires in 30 days. Consider renewing.",
    timestamp: "5 days ago",
    read: true,
    action: { label: "Renew Now" },
  },
];

const notificationConfig: Record<
  NotificationType,
  { icon: typeof Bell; color: string; bgColor: string }
> = {
  deadline: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  achievement: {
    icon: Award,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  recommendation: {
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  system: {
    icon: Info,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = notificationConfig[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "group relative p-4 border-b last:border-b-0 transition-colors",
        !notification.read && "bg-muted/50"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            config.bgColor
          )}
        >
          <config.icon className={cn("h-5 w-5", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={cn(
                  "text-sm font-medium",
                  !notification.read && "text-foreground"
                )}
              >
                {notification.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">
              {notification.timestamp}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRead(notification.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onDelete(notification.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {notification.action && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 mt-1 text-xs"
            >
              {notification.action.label}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationCenterWidget() {
  const [notifications, setNotifications] = React.useState(sampleNotifications);
  const [activeTab, setActiveTab] = React.useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-6 h-auto mb-2">
            <TabsTrigger value="all" className="text-xs py-2 relative">
              All
              {unreadCount > 0 && (
                <span className="ml-1 text-[10px] bg-primary text-primary-foreground px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs py-2">
              Unread
            </TabsTrigger>
            <TabsTrigger value="deadline" className="text-xs py-2">
              <Clock className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="achievement" className="text-xs py-2">
              <Award className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="text-xs py-2">
              <TrendingUp className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs py-2">
              <Info className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[380px] -mx-4 px-4">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-sm font-medium">No notifications</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      You're all caught up!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>

            {filteredNotifications.length > 0 && (
              <div className="pt-3 border-t mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearAll}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear all notifications
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
