"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartCard } from "@/components/dashboard/chart-card";
import { cn } from "@/lib/utils";

// Analytics data
const analyticsData = {
  overview: {
    portfolioViews: {
      current: 1234,
      previous: 980,
      change: 25.9,
    },
    profileVisits: {
      current: 567,
      previous: 620,
      change: -8.5,
    },
    skillProgress: {
      current: 78,
      previous: 72,
      change: 8.3,
    },
    avgSessionTime: {
      current: "4m 32s",
      previous: "3m 45s",
      change: 20.9,
    },
  },
  monthlyViews: [
    { name: "Aug", views: 720, unique: 480 },
    { name: "Sep", views: 850, unique: 560 },
    { name: "Oct", views: 920, unique: 610 },
    { name: "Nov", views: 980, unique: 650 },
    { name: "Dec", views: 1100, unique: 720 },
    { name: "Jan", views: 1234, unique: 890 },
  ],
  skillGrowth: [
    { name: "Aug", technical: 62, soft: 55 },
    { name: "Sep", technical: 68, soft: 58 },
    { name: "Oct", technical: 72, soft: 62 },
    { name: "Nov", technical: 75, soft: 65 },
    { name: "Dec", technical: 76, soft: 70 },
    { name: "Jan", technical: 78, soft: 72 },
  ],
  topReferrers: [
    { source: "LinkedIn", visits: 456, percentage: 37 },
    { source: "Google Search", visits: 324, percentage: 26 },
    { source: "Direct", visits: 234, percentage: 19 },
    { source: "GitHub", visits: 123, percentage: 10 },
    { source: "Other", visits: 97, percentage: 8 },
  ],
  recentAchievements: [
    {
      title: "Portfolio View Milestone",
      description: "Reached 1,000 portfolio views",
      date: "2 days ago",
      icon: Eye,
      color: "blue",
    },
    {
      title: "Skill Mastered",
      description: "Completed Advanced React certification",
      date: "1 week ago",
      icon: Award,
      color: "amber",
    },
    {
      title: "Engagement Boost",
      description: "30% increase in profile engagement",
      date: "2 weeks ago",
      icon: TrendingUp,
      color: "green",
    },
  ],
  insights: [
    {
      type: "positive",
      message: "Your portfolio views increased by 26% this month",
      action: "View details",
    },
    {
      type: "tip",
      message: "Add more projects to increase engagement",
      action: "Add project",
    },
    {
      type: "warning",
      message: "Your LinkedIn profile needs updating",
      action: "Update now",
    },
  ],
};

function StatComparison({
  label,
  value,
  change,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: string | number;
  change: number;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = change >= 0;

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">
          {prefix}
          {value}
          {suffix}
        </p>
        <div
          className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-0.5" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
}

export function AnalyticsDashboardWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Analytics & Insights</CardTitle>
              <p className="text-xs text-muted-foreground">
                Pantau performa portofolio dan skill-mu
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            Last 30 days
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-auto mb-4">
            <TabsTrigger value="overview" className="text-xs py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs py-2">
              Engagement
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs py-2">
              Skills
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs py-2">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="m-0 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <StatComparison
                  label="Portfolio Views"
                  value={analyticsData.overview.portfolioViews.current.toLocaleString()}
                  change={analyticsData.overview.portfolioViews.change}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <StatComparison
                  label="Profile Visits"
                  value={analyticsData.overview.profileVisits.current.toLocaleString()}
                  change={analyticsData.overview.profileVisits.change}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <StatComparison
                  label="Skill Progress"
                  value={analyticsData.overview.skillProgress.current}
                  change={analyticsData.overview.skillProgress.change}
                  suffix="%"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Avg. Session
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">
                      {analyticsData.overview.avgSessionTime.current}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      +{analyticsData.overview.avgSessionTime.change}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Views Chart */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Portfolio Views Trend</h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                    <span>Total Views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-violet-300" />
                    <span>Unique</span>
                  </div>
                </div>
              </div>
              <ChartCard
                title=""
                type="bar"
                data={analyticsData.monthlyViews}
                dataKeys={["views", "unique"]}
                showLegend={false}
                height={200}
              />
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="m-0 space-y-4">
            {/* Referrers */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">Traffic Sources</h4>
                <div className="space-y-3">
                  {analyticsData.topReferrers.map((ref) => (
                    <div key={ref.source} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{ref.source}</span>
                        <span className="text-muted-foreground">
                          {ref.visits} visits
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ref.percentage}%` }}
                            className="h-full bg-violet-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium w-8">
                          {ref.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">
                  Recent Achievements
                </h4>
                <div className="space-y-3">
                  {analyticsData.recentAchievements.map((achievement, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0",
                          achievement.color === "blue" &&
                            "bg-blue-100 text-blue-600",
                          achievement.color === "amber" &&
                            "bg-amber-100 text-amber-600",
                          achievement.color === "green" &&
                            "bg-green-100 text-green-600"
                        )}
                      >
                        <achievement.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium">
                          {achievement.title}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {achievement.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="m-0 space-y-4">
            {/* Skill Growth Chart */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Skill Growth Over Time</h4>
                <Badge variant="outline">Avg. +12% per month</Badge>
              </div>
              <ChartCard
                title=""
                type="area"
                data={analyticsData.skillGrowth}
                dataKeys={["technical", "soft"]}
                showLegend
                height={200}
              />
            </div>

            {/* Skill Breakdown */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  name: "Technical Skills",
                  value: 78,
                  trend: "+6%",
                  color: "bg-violet-500",
                },
                {
                  name: "Soft Skills",
                  value: 72,
                  trend: "+8%",
                  color: "bg-blue-500",
                },
                {
                  name: "Domain Knowledge",
                  value: 65,
                  trend: "+4%",
                  color: "bg-emerald-500",
                },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-lg bg-muted/50 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${skill.value * 2.26} 226`}
                        className={cn(
                          skill.color,
                          "transition-all duration-1000"
                        )}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{skill.value}%</span>
                    </div>
                  </div>
                  <h5 className="text-sm font-medium">{skill.name}</h5>
                  <p className="text-xs text-green-600 mt-1">{skill.trend}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="m-0 space-y-3">
            {analyticsData.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-4 rounded-lg border flex items-start gap-3",
                  insight.type === "positive" &&
                    "border-green-200 bg-green-50/50",
                  insight.type === "tip" && "border-blue-200 bg-blue-50/50",
                  insight.type === "warning" &&
                    "border-amber-200 bg-amber-50/50"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full shrink-0",
                    insight.type === "positive" &&
                      "bg-green-100 text-green-600",
                    insight.type === "tip" && "bg-blue-100 text-blue-600",
                    insight.type === "warning" && "bg-amber-100 text-amber-600"
                  )}
                >
                  {insight.type === "positive" && (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {insight.type === "tip" && <Target className="h-4 w-4" />}
                  {insight.type === "warning" && <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{insight.message}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                    {insight.action}
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Quick Actions */}
            <div className="p-4 rounded-lg bg-muted/50 mt-4">
              <h4 className="text-sm font-medium mb-3">Recommended Actions</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Optimize for SEO
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Add Certifications
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set Weekly Goals
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
