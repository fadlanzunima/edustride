"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Skill, SkillCategory } from "@prisma/client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface SkillChartsProps {
  skills?: Skill[];
  isLoading?: boolean;
}

const categoryColors: Record<SkillCategory, string> = {
  TECHNICAL: "#3b82f6", // blue
  SOFT_SKILL: "#22c55e", // green
  LANGUAGE: "#eab308", // yellow
  TOOL: "#a855f7", // purple
  DOMAIN_KNOWLEDGE: "#ef4444", // red
};

const levelColors = {
  BEGINNER: "#94a3b8", // slate
  INTERMEDIATE: "#3b82f6", // blue
  ADVANCED: "#6366f1", // indigo
  EXPERT: "#8b5cf6", // violet
};

export function SkillCharts({ skills = [], isLoading }: SkillChartsProps) {
  const t = useTranslations("skills");

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return null;
  }

  // Prepare data for charts
  const categoryData = prepareCategoryData(skills);
  const levelData = prepareLevelData(skills);
  const progressData = prepareProgressData(skills);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Category Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("charts.categoryDistribution")}</CardTitle>
          <CardDescription>{t("charts.categoryDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} ${t("charts.skills")}`, t("charts.skills")]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Level Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("charts.levelDistribution")}</CardTitle>
          <CardDescription>{t("charts.levelDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={levelData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Skills by Progress */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">{t("charts.topSkills")}</CardTitle>
          <CardDescription>{t("charts.topSkillsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value}%`, t("progress")]}
                />
                <Bar
                  dataKey="progress"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions to prepare data
function prepareCategoryData(skills: Skill[]) {
  const categoryCount = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryCount).map(([category, count]) => ({
    name: category.replace("_", " "),
    value: count,
    color: categoryColors[category as SkillCategory] || "#94a3b8",
  }));
}

function prepareLevelData(skills: Skill[]) {
  const levelCount = skills.reduce((acc, skill) => {
    acc[skill.level] = (acc[skill.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Ensure all levels are represented
  const allLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
  return allLevels.map((level) => ({
    name: level.charAt(0) + level.slice(1).toLowerCase(),
    value: levelCount[level] || 0,
    color: levelColors[level as keyof typeof levelColors],
  }));
}

function prepareProgressData(skills: Skill[]) {
  // Get top 10 skills by progress
  return skills
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 10)
    .map((skill) => ({
      name: skill.name,
      progress: skill.progress,
      category: skill.category,
    }));
}
