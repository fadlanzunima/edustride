"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Star,
  Target,
  Zap,
  Flame,
  Award,
  TrendingUp,
  BookOpen,
  Briefcase,
  CheckCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserBadge {
  id: string;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    difficulty: string;
    points: number;
    color: string;
  };
  earnedAt: string;
  context?: string | null;
}

interface BadgeTrackerProps {
  badges?: UserBadge[];
  totalBadges?: number;
  isLoading?: boolean;
}

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Medal,
  Star,
  Target,
  Zap,
  Flame,
  Award,
  TrendingUp,
  BookOpen,
  Briefcase,
  CheckCircle,
};

const difficultyColors = {
  EASY: "bg-green-500",
  MEDIUM: "bg-blue-500",
  HARD: "bg-orange-500",
  LEGENDARY: "bg-purple-500",
};

const categoryConfig = {
  SKILL: { label: "Skill", icon: TrendingUp },
  PORTFOLIO: { label: "Portfolio", icon: Briefcase },
  QUIZ: { label: "Quiz", icon: BookOpen },
  MILESTONE: { label: "Milestone", icon: Target },
  SPECIAL: { label: "Special", icon: Star },
  OTHER: { label: "Other", icon: Award },
};

// Demo badges data (will be replaced with API data)
const demoBadges: UserBadge[] = [
  {
    id: "1",
    badge: {
      id: "b1",
      name: "First Step",
      description: "Add your first skill",
      icon: "Star",
      category: "SKILL",
      difficulty: "EASY",
      points: 10,
      color: "green",
    },
    earnedAt: new Date().toISOString(),
    context: "Added JavaScript skill",
  },
  {
    id: "2",
    badge:
    {
      id: "b2",
      name: "Skill Master",
      description: "Add 10 skills to your profile",
      icon: "Trophy",
      category: "SKILL",
      difficulty: "MEDIUM",
      points: 50,
      color: "blue",
    },
    earnedAt: new Date().toISOString(),
    context: "Reached 10 skills",
  },
  {
    id: "3",
    badge: {
      id: "b3",
      name: "Quiz Champion",
      description: "Pass a quiz with 100% score",
      icon: "Medal",
      category: "QUIZ",
      difficulty: "HARD",
      points: 100,
      color: "yellow",
    },
    earnedAt: new Date().toISOString(),
    context: "Perfect score on JavaScript quiz",
  },
];

const lockedBadges = [
  {
    id: "l1",
    name: "Portfolio Pioneer",
    description: "Create your first portfolio project",
    icon: "Briefcase",
    category: "PORTFOLIO",
    difficulty: "EASY",
    points: 10,
    color: "green",
  },
  {
    id: "l2",
    name: "Learning Legend",
    description: "Earn 500 total points",
    icon: "Flame",
    category: "MILESTONE",
    difficulty: "LEGENDARY",
    points: 500,
    color: "purple",
  },
];

export function BadgeTracker({ badges = demoBadges, totalBadges = 8, isLoading }: BadgeTrackerProps) {
  const t = useTranslations("badges");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedPoints = badges.reduce((sum, b) => sum + b.badge.points, 0);
  const totalPoints = totalBadges * 50; // Average points
  const progressPercent = Math.min((earnedPoints / totalPoints) * 100, 100);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t("title")}
              </CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{badges.length}/{totalBadges}</div>
              <div className="text-xs text-muted-foreground">{t("earned")}</div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("pointsProgress")}</span>
              <span className="font-medium">{earnedPoints} / {totalPoints} pts</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Earned Badges Grid */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">{t("earnedBadges")}</h4>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((userBadge) => (
                  <Tooltip key={userBadge.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "relative aspect-square rounded-lg border-2 p-3 cursor-pointer",
                          "transition-all hover:scale-105 hover:shadow-md",
                          `border-${userBadge.badge.color}-500 bg-${userBadge.badge.color}-50 dark:bg-${userBadge.badge.color}-950`
                        )}
                      >
                        <div className="absolute top-1 right-1">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              difficultyColors[userBadge.badge.difficulty as keyof typeof difficultyColors]
                            )}
                          />
                        </div>
                        <div className="flex h-full items-center justify-center">
                          {(() => {
                            const IconComponent = badgeIcons[userBadge.badge.icon] || Star;
                            return <IconComponent className={cn("h-8 w-8", `text-${userBadge.badge.color}-600`)} />;
                          })()}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{userBadge.badge.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {userBadge.badge.points} pts
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {userBadge.badge.description}
                        </p>
                        {userBadge.context && (
                          <p className="text-xs text-muted-foreground italic">
                            {userBadge.context}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          <Badge>{categoryConfig[userBadge.badge.category as keyof typeof categoryConfig]?.label}</Badge>
                          <span className="text-muted-foreground">
                            {new Date(userBadge.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">{t("lockedBadges")}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {lockedBadges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div className="relative aspect-square rounded-lg border-2 border-muted bg-muted/30 p-3 opacity-60">
                          <div className="absolute top-1 right-1">
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="flex h-full items-center justify-center">
                            {(() => {
                              const IconComponent = badgeIcons[badge.icon] || Award;
                              return <IconComponent className="h-8 w-8 text-muted-foreground" />;
                            })()}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{badge.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {badge.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {badge.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary">
                              {categoryConfig[badge.category as keyof typeof categoryConfig]?.label}
                            </Badge>
                            <Badge variant="secondary">
                              {badge.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
