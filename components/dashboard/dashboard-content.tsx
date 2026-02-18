"use client";

import * as React from "react";
import {
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Plus,
  Upload,
  Share2,
  BookOpen,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { ActivityFeed, sampleActivities } from "./activity-feed";
import { ProgressBar, CircularProgress } from "./progress-bar";
import { ChartCard } from "./chart-card";
import { Widget, WidgetGrid, QuickActionsWidget } from "./widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data for charts
const skillProgressData = [
  { name: "Jan", technical: 45, soft: 30 },
  { name: "Feb", technical: 52, soft: 35 },
  { name: "Mar", technical: 58, soft: 42 },
  { name: "Apr", technical: 65, soft: 48 },
  { name: "May", technical: 72, soft: 55 },
  { name: "Jun", technical: 78, soft: 62 },
];

const portfolioDistribution = [
  { name: "Projects", value: 12 },
  { name: "Certificates", value: 8 },
  { name: "Experience", value: 5 },
  { name: "Publications", value: 3 },
];

const weeklyActivity = [
  { name: "Mon", hours: 4 },
  { name: "Tue", hours: 6 },
  { name: "Wed", hours: 3 },
  { name: "Thu", hours: 7 },
  { name: "Fri", hours: 5 },
  { name: "Sat", hours: 8 },
  { name: "Sun", hours: 2 },
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, Student!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Portfolio Projects"
          value="12"
          description="Total projects created"
          trend={{ value: 15, isPositive: true, label: "vs last month" }}
          icon={FileText}
          delay={0}
        />
        <StatCard
          title="Certificates"
          value="8"
          description="Earned certificates"
          trend={{ value: 8, isPositive: true, label: "vs last month" }}
          icon={Award}
          delay={0.1}
        />
        <StatCard
          title="Skills Learned"
          value="24"
          description="Active skills"
          trend={{ value: 5, isPositive: true, label: "vs last month" }}
          icon={GraduationCap}
          delay={0.2}
        />
        <StatCard
          title="Profile Views"
          value="1,284"
          description="This month"
          trend={{ value: 12, isPositive: true, label: "vs last month" }}
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Main Widget Grid */}
      <WidgetGrid>
        {/* Skill Progress Chart */}
        <Widget
          id="skill-progress"
          title="Skill Progress"
          size="2x2"
          onRefresh={() => console.log("Refreshing skill progress")}
        >
          <ChartCard
            title=""
            type="area"
            data={skillProgressData}
            dataKeys={["technical", "soft"]}
            showLegend
            height={280}
          />
        </Widget>

        {/* Recent Activity */}
        <Widget
          id="recent-activity"
          title="Recent Activity"
          size="1x2"
          onRefresh={() => console.log("Refreshing activity")}
        >
          <ActivityFeed
            activities={sampleActivities}
            maxItems={5}
            showViewAll={false}
            className="border-0 shadow-none"
          />
        </Widget>

        {/* Quick Actions */}
        <Widget id="quick-actions" title="Quick Actions" size="1x1">
          <QuickActionsWidget
            actions={[
              {
                icon: <FileText className="h-5 w-5" />,
                label: "Add Project",
                onClick: () => console.log("Add project"),
                variant: "primary",
              },
              {
                icon: <Upload className="h-5 w-5" />,
                label: "Upload",
                onClick: () => console.log("Upload"),
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                label: "Learn",
                onClick: () => console.log("Learn"),
              },
              {
                icon: <Share2 className="h-5 w-5" />,
                label: "Share",
                onClick: () => console.log("Share"),
              },
            ]}
          />
        </Widget>

        {/* Weekly Activity */}
        <Widget id="weekly-activity" title="Weekly Activity" size="2x1">
          <ChartCard
            title=""
            type="bar"
            data={weeklyActivity}
            dataKeys={["hours"]}
            showLegend={false}
            height={150}
          />
        </Widget>

        {/* Portfolio Distribution */}
        <Widget id="portfolio-dist" title="Portfolio Distribution" size="1x1">
          <ChartCard
            title=""
            type="pie"
            data={portfolioDistribution}
            dataKeys={["value"]}
            showLegend={false}
            height={180}
          />
        </Widget>

        {/* Current Goals */}
        <Widget id="current-goals" title="Current Goals" size="1x1">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Complete React Course</span>
                <Badge variant="secondary">75%</Badge>
              </div>
              <ProgressBar value={75} size="sm" showValue={false} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Build Portfolio</span>
                <Badge variant="secondary">60%</Badge>
              </div>
              <ProgressBar value={60} size="sm" showValue={false} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Get Certified</span>
                <Badge variant="secondary">30%</Badge>
              </div>
              <ProgressBar
                value={30}
                size="sm"
                showValue={false}
                color="warning"
              />
            </div>
          </div>
        </Widget>
      </WidgetGrid>

      {/* Bottom Section: Skills & Learning */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "React", level: 85 },
                { name: "TypeScript", level: 78 },
                { name: "Node.js", level: 72 },
                { name: "Python", level: 65 },
                { name: "UI/UX Design", level: 58 },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <ProgressBar
                    value={skill.level}
                    size="sm"
                    showValue={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Path Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Path</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress
              value={65}
              size={120}
              strokeWidth={8}
              label="Overall Progress"
              className="mb-4"
            />
            <div className="text-center">
              <p className="text-sm font-medium">Full Stack Developer Path</p>
              <p className="text-xs text-muted-foreground mt-1">
                13 of 20 modules completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Submit Project Proposal",
                  date: "Tomorrow",
                  type: "urgent",
                },
                {
                  title: "Complete React Assessment",
                  date: "In 3 days",
                  type: "normal",
                },
                {
                  title: "Portfolio Review",
                  date: "Next week",
                  type: "normal",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  {item.type === "urgent" && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
