"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  User,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ActivityType =
  | "portfolio"
  | "certificate"
  | "experience"
  | "skill"
  | "profile";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; color: string; bgColor: string; label: string }
> = {
  portfolio: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    label: "Portfolio",
  },
  certificate: {
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900",
    label: "Certificate",
  },
  experience: {
    icon: Briefcase,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    label: "Experience",
  },
  skill: {
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    label: "Skill",
  },
  profile: {
    icon: User,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    label: "Profile",
  },
};

export function ActivityFeed({
  activities,
  maxItems = 10,
  className,
  showViewAll = true,
  onViewAll,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        {showViewAll && onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View all
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-4 py-2">
            {displayActivities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex gap-3"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {displayActivities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Sample activities for demo
export const sampleActivities: Activity[] = [
  {
    id: "1",
    type: "portfolio",
    title: "Created new portfolio project",
    description: "Added 'E-commerce Website' to portfolio",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: "2",
    type: "certificate",
    title: "Earned React Certificate",
    description: "Completed Advanced React course",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    type: "skill",
    title: "Added new skill",
    description: "TypeScript - Advanced level",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "4",
    type: "experience",
    title: "Updated work experience",
    description: "Added internship at Tech Company",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "5",
    type: "profile",
    title: "Updated profile information",
    description: "Changed profile picture and bio",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];
