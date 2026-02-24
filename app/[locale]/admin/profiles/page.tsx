import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Eye,
  Globe,
  School,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "All Profiles - EduStride Admin",
};

export default async function AdminProfilesPage() {
  // Fetch all users with public profiles and their data
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      role: true,
      institution: true,
      isProfilePublic: true,
      shareToken: true,
      viewCount: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          portfolios: true,
          skills: true,
          achievements: true,
        },
      },
    },
  });

  const publicProfiles = users.filter((u) => u.isProfilePublic);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Semua Profil</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} total users • {publicProfiles.length} public profiles
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari profil berdasarkan nama atau email..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Public Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {publicProfiles.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((acc, u) => acc + u.viewCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SMA Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.level === "SMA").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || ""}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-medium text-cyan-700">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {user.name}
                      {user.role === "ADMIN" && (
                        <Shield className="h-4 w-4 text-purple-500" />
                      )}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={user.level === "SMA" ? "default" : "secondary"}
                  className="text-xs"
                >
                  <School className="h-3 w-3 mr-1" />
                  {user.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Institution</span>
                  <span className="font-medium truncate max-w-[150px]">
                    {user.institution || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Portfolios</span>
                  <span className="font-medium">{user._count.portfolios}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skills</span>
                  <span className="font-medium">{user._count.skills}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {user.isProfilePublic ? (
                    <Badge variant="default" className="bg-green-500 text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Private
                    </Badge>
                  )}
                </div>
                {user.isProfilePublic && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Views</span>
                    <span className="font-medium flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {user.viewCount}
                    </span>
                  </div>
                )}
                <div className="pt-2 flex gap-2">
                  {user.isProfilePublic && user.shareToken && (
                    <Link
                      href={`/p/${user.shareToken}`}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Public
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/users/${user.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
