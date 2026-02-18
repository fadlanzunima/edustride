"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Code,
  Users,
  Languages,
  Wrench,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import type { Skill, SkillCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

interface SkillRoadmapProps {
  skills?: Skill[];
  isLoading?: boolean;
}

const categoryIcons: Record<SkillCategory, React.ComponentType<{ className?: string }>> = {
  TECHNICAL: Code,
  SOFT_SKILL: Users,
  LANGUAGE: Languages,
  TOOL: Wrench,
  DOMAIN_KNOWLEDGE: BookOpen,
};

const categoryColors: Record<SkillCategory, string> = {
  TECHNICAL: "text-blue-500 bg-blue-500",
  SOFT_SKILL: "text-green-500 bg-green-500",
  LANGUAGE: "text-yellow-500 bg-yellow-500",
  TOOL: "text-purple-500 bg-purple-500",
  DOMAIN_KNOWLEDGE: "text-red-500 bg-red-500",
};

export function SkillRoadmap({ skills = [], isLoading }: SkillRoadmapProps) {
  const t = useTranslations("skills");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-2 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t("roadmap.title")}
          </CardTitle>
          <CardDescription>{t("roadmap.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t("roadmap.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group skills by category and calculate average progress
  const categoryProgress = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = { total: 0, count: 0, skills: [] };
    }
    acc[skill.category].total += skill.progress;
    acc[skill.category].count += 1;
    acc[skill.category].skills.push(skill);
    return acc;
  }, {} as Record<SkillCategory, { total: number; count: number; skills: Skill[] }>);

  // Calculate overall progress
  const overallProgress = skills.length > 0
    ? Math.round(skills.reduce((sum, skill) => sum + skill.progress, 0) / skills.length)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t("roadmap.title")}
            </CardTitle>
            <CardDescription>{t("roadmap.description")}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <div className="text-xs text-muted-foreground">{t("roadmap.overall")}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {Object.entries(categoryProgress).map(([category, data]) => {
            const Icon = categoryIcons[category as SkillCategory];
            const colors = categoryColors[category as SkillCategory];
            const avgProgress = Math.round(data.total / data.count);

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colors)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t(`category.${category.toLowerCase()}`)}</div>
                      <div className="text-xs text-muted-foreground">
                        {data.count} {t("roadmap.skills")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{avgProgress}%</div>
                  </div>
                </div>
                <Progress value={avgProgress} className="h-2" />
                
                {/* Top skills in category */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-xs">
                      {skill.name} ({skill.progress}%)
                    </Badge>
                  ))}
                  {data.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
