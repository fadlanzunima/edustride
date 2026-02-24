import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderOpen,
  GraduationCap,
  Award,
  TrendingUp,
  School,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard - EduStride",
};

export default async function AdminPage() {
  // Fetch all stats
  const [
    totalUsers,
    smaUsers,
    s1Users,
    s2Users,
    totalPortfolios,
    totalSkills,
    totalAchievements,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { level: "SMA" } }),
    prisma.user.count({ where: { level: "S1" } }),
    prisma.user.count({ where: { level: "S2_S3" } }),
    prisma.portfolio.count(),
    prisma.skill.count(),
    prisma.achievement.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            portfolios: true,
            skills: true,
          },
        },
      },
    }),
  ]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      trend: "+12%",
      description: "vs last month",
    },
    {
      title: "SMA Students",
      value: smaUsers,
      icon: School,
      description: `${
        Math.round((smaUsers / totalUsers) * 100) || 0
      }% of total`,
    },
    {
      title: "Total Portfolios",
      value: totalPortfolios,
      icon: FolderOpen,
      trend: "+8%",
      description: "vs last month",
    },
    {
      title: "Total Skills",
      value: totalSkills,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Kelola semua pengguna dan sistem EduStride
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {stat.trend && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <School className="h-5 w-5 text-cyan-500" />
              SMA Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{smaUsers}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((smaUsers / totalUsers) * 100) || 0}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              S1 Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{s1Users}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((s1Users / totalUsers) * 100) || 0}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-slate-500" />
              S2/S3 Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{s2Users}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((s2Users / totalUsers) * 100) || 0}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Pengguna Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                    <span className="font-medium text-cyan-700">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      variant={user.level === "SMA" ? "default" : "secondary"}
                    >
                      {user.level}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user._count.portfolios} portfolios • {user._count.skills}{" "}
                      skills
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-colors">
              <h4 className="font-medium">Export User Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all user data as CSV
              </p>
            </div>
            <div className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-colors">
              <h4 className="font-medium">Send Announcement</h4>
              <p className="text-sm text-muted-foreground">
                Send notification to all users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <Badge variant="default" className="bg-green-500">
                Online
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Authentication</span>
              <Badge variant="default" className="bg-green-500">
                Online
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API</span>
              <Badge variant="default" className="bg-green-500">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
