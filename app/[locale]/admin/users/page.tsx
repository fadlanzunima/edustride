import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Mail,
  Shield,
  School,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Manage Users - EduStride Admin",
};

export default async function AdminUsersPage() {
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
      createdAt: true,
      _count: {
        select: {
          portfolios: true,
          skills: true,
          achievements: true,
          quizAttempts: true,
        },
      },
    },
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const publicProfilesCount = users.filter((u) => u.isProfilePublic).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} total users • {adminCount} admins •{" "}
            {publicProfilesCount} public profiles
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Level</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Institution
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    Portfolios
                  </th>
                  <th className="text-center py-3 px-4 font-medium">Skills</th>
                  <th className="text-left py-3 px-4 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                          <span className="font-medium text-cyan-700">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.name}
                            {user.role === "ADMIN" && (
                              <Badge
                                variant="default"
                                className="bg-purple-500"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {user.isProfilePublic && (
                              <Badge variant="secondary">Public</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={user.level === "SMA" ? "default" : "secondary"}
                      >
                        {user.level}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{user.institution || "-"}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{user._count.portfolios}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{user._count.skills}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {user.role !== "ADMIN" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
