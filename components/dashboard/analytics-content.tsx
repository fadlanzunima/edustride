"use client";

import { StatCard } from "./stat-card";
import { ChartCard } from "./chart-card";
import { DataTable } from "./data-table";
import { ProgressBar } from "./progress-bar";
import { Widget, WidgetGrid } from "./widget";
import {
  TrendingUp,
  Eye,
  MousePointer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample data
const monthlyViewsData = [
  { name: "Jan", views: 4200, unique: 3200 },
  { name: "Feb", views: 5100, unique: 3800 },
  { name: "Mar", views: 4800, unique: 3600 },
  { name: "Apr", views: 6200, unique: 4500 },
  { name: "May", views: 7100, unique: 5200 },
  { name: "Jun", views: 8500, unique: 6400 },
];

const skillGrowthData = [
  { name: "Week 1", beginner: 30, intermediate: 20, advanced: 10 },
  { name: "Week 2", beginner: 25, intermediate: 30, advanced: 15 },
  { name: "Week 3", beginner: 20, intermediate: 35, advanced: 25 },
  { name: "Week 4", beginner: 15, intermediate: 40, advanced: 35 },
];

const topProjectsData = [
  {
    id: "1",
    name: "E-commerce Website",
    views: 1205,
    rating: 4.8,
    trend: "up",
  },
  { id: "2", name: "Mobile App Design", views: 892, rating: 4.6, trend: "up" },
  { id: "3", name: "Data Dashboard", views: 756, rating: 4.5, trend: "down" },
  { id: "4", name: "Portfolio Website", views: 634, rating: 4.7, trend: "up" },
  { id: "5", name: "API Integration", views: 521, rating: 4.3, trend: "up" },
];

const deviceData = [
  { name: "Desktop", value: 55 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 10 },
];

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your portfolio performance and engagement metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
          value="35,429"
          trend={{ value: 12.5, isPositive: true, label: "vs last month" }}
          icon={Eye}
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          trend={{ value: 8.2, isPositive: true, label: "vs last month" }}
          icon={Clock}
        />
        <StatCard
          title="Click Rate"
          value="24.8%"
          trend={{ value: 3.1, isPositive: false, label: "vs last month" }}
          icon={MousePointer}
        />
        <StatCard
          title="Growth Rate"
          value="18.2%"
          trend={{ value: 5.4, isPositive: true, label: "vs last month" }}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <WidgetGrid>
        <Widget id="views-chart" title="Monthly Views" size="2x1">
          <ChartCard
            title=""
            type="line"
            data={monthlyViewsData}
            dataKeys={["views", "unique"]}
            showLegend
            height={200}
          />
        </Widget>

        <Widget id="device-chart" title="Traffic by Device" size="1x1">
          <ChartCard
            title=""
            type="pie"
            data={deviceData}
            dataKeys={["value"]}
            showLegend
            height={180}
          />
        </Widget>

        <Widget id="skill-growth" title="Skill Level Growth" size="2x1">
          <ChartCard
            title=""
            type="bar"
            data={skillGrowthData}
            dataKeys={["beginner", "intermediate", "advanced"]}
            showLegend
            height={200}
          />
        </Widget>
      </WidgetGrid>

      {/* Top Projects Table */}
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Top Performing Projects</h3>
          <p className="text-sm text-muted-foreground">
            Projects with the highest engagement this month
          </p>
        </div>
        <DataTable
          data={topProjectsData}
          keyExtractor={(row) => row.id}
          columns={[
            {
              key: "name",
              header: "Project Name",
              accessor: (row) => row.name,
              sortable: true,
            },
            {
              key: "views",
              header: "Views",
              accessor: (row) => row.views.toLocaleString(),
              sortable: true,
            },
            {
              key: "rating",
              header: "Rating",
              accessor: (row) => (
                <div className="flex items-center gap-1">
                  <span className="font-medium">{row.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              ),
              sortable: true,
            },
            {
              key: "trend",
              header: "Trend",
              accessor: (row) =>
                row.trend === "up" ? (
                  <Badge variant="default" className="gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Rising
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    Falling
                  </Badge>
                ),
            },
            {
              key: "actions",
              header: "",
              accessor: () => (
                <Button variant="ghost" size="sm">
                  View
                </Button>
              ),
            },
          ]}
          searchKeys={["name"]}
          pageSize={5}
        />
      </div>

      {/* Skill Progress Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
          <div className="space-y-4">
            {[
              {
                name: "Frontend Development",
                progress: 85,
                total: "42/50 hours",
              },
              {
                name: "Backend Development",
                progress: 62,
                total: "31/50 hours",
              },
              { name: "UI/UX Design", progress: 45, total: "18/40 hours" },
              { name: "Data Science", progress: 30, total: "12/40 hours" },
            ].map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.total}</span>
                </div>
                <ProgressBar
                  value={skill.progress}
                  size="md"
                  showValue={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">Achievement Milestones</h3>
          <div className="space-y-4">
            {[
              {
                title: "Complete 10 Projects",
                current: 8,
                target: 10,
                icon: "🎯",
              },
              {
                title: "Earn 5 Certificates",
                current: 5,
                target: 5,
                icon: "🏆",
                completed: true,
              },
              {
                title: "1000 Profile Views",
                current: 892,
                target: 1000,
                icon: "👀",
              },
              { title: "Learn 20 Skills", current: 18, target: 20, icon: "📚" },
            ].map((milestone) => {
              const progress = Math.min(
                (milestone.current / milestone.target) * 100,
                100
              );
              return (
                <div
                  key={milestone.title}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl">{milestone.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.current} / {milestone.target}
                    </p>
                  </div>
                  <div className="w-24">
                    <ProgressBar
                      value={progress}
                      size="sm"
                      color={progress === 100 ? "success" : "primary"}
                      showValue={false}
                    />
                  </div>
                  {progress === 100 && (
                    <Badge variant="default" className="text-xs">
                      Done
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
