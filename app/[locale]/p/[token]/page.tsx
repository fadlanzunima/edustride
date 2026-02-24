import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  School,
  GraduationCap,
  Target,
  Award,
  Users,
  Globe,
  Linkedin,
  Github,
  Instagram,
  ExternalLink,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { PublicProfileThemeToggle } from "@/components/public-profile/theme-toggle";

interface PublicProfilePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { token } = await params;
  const user = await prisma.user.findUnique({
    where: { shareToken: token },
  });

  if (!user || !user.isProfilePublic) {
    return {
      title: "Profil Tidak Ditemukan | EduStride",
    };
  }

  return {
    title: `${user.name} - Profil SMA | EduStride`,
    description: `Lihat portofolio dan prestasi ${user.name} di EduStride`,
    openGraph: {
      title: `${user.name} - Profil SMA | EduStride`,
      description: `Lihat portofolio dan prestasi ${user.name} di EduStride`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { token } = await params;

  // Find user by share token
  const user = await prisma.user.findUnique({
    where: { shareToken: token },
    include: {
      portfolios: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
      skills: {
        orderBy: { progress: "desc" },
        take: 6,
      },
      achievements: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  // If user not found or profile is not public, show 404
  if (!user || !user.isProfilePublic) {
    notFound();
  }

  // Increment view count
  await prisma.user.update({
    where: { id: user.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-xl">EduStride</span>
          </Link>
          <div className="flex items-center gap-2">
            <PublicProfileThemeToggle />
            <Badge variant="secondary" className="gap-1">
              <Eye className="h-3 w-3" />
              {user.viewCount + 1} views
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 ring-4 ring-cyan-100">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-4xl bg-cyan-100 text-cyan-700">
                  {user.name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                    <School className="h-3 w-3 mr-1" />
                    SMA
                  </Badge>
                  {user.institution && (
                    <Badge variant="outline">{user.institution}</Badge>
                  )}
                </div>
                {user.bio && (
                  <p className="mt-4 text-muted-foreground max-w-lg">
                    {user.bio}
                  </p>
                )}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <School className="h-5 w-5 text-cyan-500" />
                Informasi Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.institution && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sekolah</span>
                  <span className="font-medium">{user.institution}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tingkat</span>
                <span className="font-medium">SMA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">Aktif</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-cyan-500" />
                Target SNBT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Universitas Target
                </span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jurusan Impian</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tahun Kelulusan</span>
                <span className="font-medium">2026</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio */}
        {user.portfolios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-500" />
                Portofolio ({user.portfolios.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {user.portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-cyan-300 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-2xl">
                        {portfolio.type === "PROJECT" && "💻"}
                        {portfolio.type === "CERTIFICATE" && "📜"}
                        {portfolio.type === "EXPERIENCE" && "💼"}
                        {portfolio.type === "AWARD" && "🏆"}
                        {portfolio.type === "PUBLICATION" && "📄"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {portfolio.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {portfolio.description || "No description"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {portfolio.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {(portfolio.link || portfolio.githubUrl) && (
                      <a
                        href={portfolio.link || portfolio.githubUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {user.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-cyan-500" />
                Skills ({user.skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {skill.name}
                    <span className="ml-2 text-xs opacity-70">
                      {skill.progress}%
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {user.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-cyan-500" />
                Prestasi ({user.achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <span className="text-2xl">
                      {achievement.type === "CERTIFICATION" && "📜"}
                      {achievement.type === "AWARD" && "🏆"}
                      {achievement.type === "COMPETITION" && "🥇"}
                      {achievement.type === "SCHOLARSHIP" && "🎓"}
                      {achievement.type === "OTHER" && "⭐"}
                    </span>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.issuer && (
                        <p className="text-sm text-muted-foreground">
                          {achievement.issuer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Profil dibuat dengan{" "}
            <Link href="/" className="text-cyan-600 hover:underline">
              EduStride
            </Link>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Platform portofolio digital untuk siswa SMA Indonesia
          </p>
        </div>
      </main>
    </div>
  );
}
