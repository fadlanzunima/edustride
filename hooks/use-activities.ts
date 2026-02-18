import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ActivityQueryInput } from "@/lib/validations";
import type { Activity, ActivityType } from "@prisma/client";

interface ActivityListResponse {
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query keys
const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (filters: ActivityQueryInput) =>
    [...activityKeys.lists(), filters] as const,
  stats: () => [...activityKeys.all, "stats"] as const,
};

// Hooks
export function useActivities(filters: ActivityQueryInput = {}) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => apiClient.get<ActivityListResponse>("/activities", filters),
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: activityKeys.list({ limit }),
    queryFn: () =>
      apiClient.get<ActivityListResponse>("/activities", { limit }),
  });
}

interface ActivityStats {
  total: number;
  last30Days: number;
  weeklyActivity: Activity[];
  byType: Record<string, number>;
}

export function useActivityStats() {
  return useQuery({
    queryKey: activityKeys.stats(),
    queryFn: () => apiClient.get<ActivityStats>("/activities/stats"),
  });
}

// Helper hook to group activities by date
export function useActivitiesByDate(limit: number = 50) {
  const { data, ...rest } = useActivities({ limit });

  const groupedData = data?.data.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return { data: groupedData, rawData: data, ...rest };
}

// Helper to get activity color/icon based on type
export function getActivityConfig(type: ActivityType) {
  const configs: Record<
    ActivityType,
    { color: string; bgColor: string; label: string }
  > = {
    PORTFOLIO_CREATED: {
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      label: "Portfolio",
    },
    PORTFOLIO_UPDATED: {
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      label: "Portfolio",
    },
    SKILL_ADDED: {
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      label: "Skill",
    },
    SKILL_LEVEL_UP: {
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      label: "Skill",
    },
    ROADMAP_CREATED: {
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      label: "Roadmap",
    },
    ROADMAP_COMPLETED: {
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      label: "Roadmap",
    },
    ROADMAP_ITEM_COMPLETED: {
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      label: "Roadmap",
    },
    ACHIEVEMENT_EARNED: {
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900",
      label: "Achievement",
    },
    PROFILE_UPDATED: {
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      label: "Profile",
    },
    CERTIFICATE_EARNED: {
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900",
      label: "Certificate",
    },
    PROJECT_PUBLISHED: {
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      label: "Project",
    },
    EXPERIENCE_ADDED: {
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900",
      label: "Experience",
    },
  };

  return configs[type] || configs.PROFILE_UPDATED;
}
