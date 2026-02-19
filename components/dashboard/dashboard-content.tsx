"use client";

import * as React from "react";
import { motion } from "motion/react";
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
  Sparkles,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { ActivityFeed, sampleActivities } from "./activity-feed";
import { ProgressBar, CircularProgress } from "./progress-bar";
import { ChartCard } from "./chart-card";
import { Widget, WidgetGrid, QuickActionsWidget } from "./widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import { useLevelStore } from "@/lib/store/level-store";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";
import { usePortfolios } from "@/hooks/use-portfolio";
import { useSkills } from "@/hooks/use-skills";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { useSession } from "next-auth/react";

// Phase 7 Widgets
import { CareerExplorerWidget } from "@/components/widgets/career-explorer";
import { PortfolioPreviewWidget } from "@/components/widgets/portfolio-preview";
import { ResearchImpactWidget } from "@/components/widgets/research-impact";
import { AnalyticsDashboardWidget } from "@/components/widgets/analytics-dashboard";
import { NotificationCenterWidget } from "@/components/widgets/notification-center";

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

// Level-specific welcome messages
const welcomeMessages: Record<Level, { title: string; subtitle: string }> = {
  SMA: {
    title: "Selamat datang kembali, Pejuang SNBT!",
    subtitle:
      "Ayo eksplorasi jurusan dan persiapkan dirimu untuk masa depan yang gemilang.",
  },
  S1: {
    title: "Welcome back, Future Professional!",
    subtitle:
      "Build your portfolio, develop skills, and prepare for your dream career.",
  },
  "S2/S3": {
    title: "Welcome back, Researcher!",
    subtitle: "Track your research impact and advance your academic journey.",
  },
};

// Level-specific theme colors
const levelColors: Record<Level, { gradient: string; accent: string }> = {
  SMA: {
    gradient: "from-cyan-500 to-blue-500",
    accent: "cyan",
  },
  S1: {
    gradient: "from-blue-600 to-indigo-600",
    accent: "blue",
  },
  "S2/S3": {
    gradient: "from-slate-700 to-slate-900",
    accent: "slate",
  },
};

export function DashboardContent() {
  const { currentLevel, initializeFromSession } = useLevelStore();
  const { data: session, status } = useSession();

  // Initialize level from session on first load
  React.useEffect(() => {
    if (status === "authenticated") {
      initializeFromSession(session?.user?.level as Level);
    }
  }, [status, session?.user?.level, initializeFromSession]);

  // Determine effective level: ALWAYS prioritize session level over store level
  // This ensures the correct level is shown based on the logged-in user
  const effectiveLevel: Level = React.useMemo(() => {
    // Priority 1: Session level (from database) - check regardless of status
    // This ensures we show the database level immediately when available
    if (session?.user?.level) {
      const sessionLevel = session.user.level as Level;
      if (["SMA", "S1", "S2/S3"].includes(sessionLevel)) {
        return sessionLevel;
      }
    }

    // Priority 2: Store level (from localStorage) - only if no session level
    if (currentLevel) {
      return currentLevel;
    }

    // Priority 3: Default to S1 if no session level and no store
    return "S1";
  }, [session?.user?.level, currentLevel]);

  const welcome = welcomeMessages[effectiveLevel];
  const colors = levelColors[effectiveLevel];

  // Fetch user data to check if they have any content
  const { data: portfoliosData, isLoading: isLoadingPortfolios } =
    usePortfolios({ limit: 1 });
  const { data: skillsData, isLoading: isLoadingSkills } = useSkills({
    limit: 1,
  });

  const isLoading = isLoadingPortfolios || isLoadingSkills;
  const hasData =
    (portfoliosData?.pagination?.total ?? 0) > 0 ||
    (skillsData?.pagination?.total ?? 0) > 0;

  // Show loading skeleton while fetching data
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show empty state if user has no data
  if (!hasData) {
    return <DashboardEmptyState level={effectiveLevel} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Level Switcher */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            key={effectiveLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {welcome.title}
            </h1>
            <p className="text-muted-foreground mt-1">{welcome.subtitle}</p>
          </motion.div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              className={cn("bg-gradient-to-r", colors.gradient)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
          <div className="flex-1">
            <p className="text-sm font-medium">Current Level</p>
            <p className="text-xs text-muted-foreground">
              Customize your dashboard based on your education level
            </p>
          </div>
          <LevelSwitcher />
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

      {/* Level-Specific Featured Widget */}
      <motion.div
        key={effectiveLevel}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        {/* Primary Level-Specific Widget */}
        <div className="lg:col-span-2">
          {effectiveLevel === "SMA" && <CareerExplorerWidget />}
          {effectiveLevel === "S1" && <PortfolioPreviewWidget />}
          {effectiveLevel === "S2/S3" && <ResearchImpactWidget />}
        </div>

        {/* Secondary Widgets */}
        <div className="space-y-4">
          {/* Notification Center */}
          <NotificationCenterWidget />
        </div>
      </motion.div>

      {/* Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnalyticsDashboardWidget />
      </motion.div>

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

      {/* Feature Highlights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "p-6 rounded-2xl bg-gradient-to-r text-white",
          colors.gradient
        )}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {effectiveLevel === "SMA" && "Jelajahi Karier Impianmu"}
                {effectiveLevel === "S1" && "Bangun Portofolio Profesionalmu"}
                {effectiveLevel === "S2/S3" && "Tingkatkan Dampak Risetmu"}
              </h3>
              <p className="text-sm text-white/80">
                {effectiveLevel === "SMA" &&
                  "Temukan jurusan yang tepat dengan Career Explorer"}
                {effectiveLevel === "S1" &&
                  "Optimalkan portofoliomu untuk recruiters"}
                {effectiveLevel === "S2/S3" &&
                  "Tracking publikasi dan metrik riset dalam satu tempat"}
              </p>
            </div>
          </div>
          <Button variant="secondary" className="shrink-0">
            {effectiveLevel === "SMA" && "Mulai Eksplorasi"}
            {effectiveLevel === "S1" && "Lihat Preview"}
            {effectiveLevel === "S2/S3" && "Lihat Impact"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
