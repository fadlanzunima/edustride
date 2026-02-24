import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Search,
  ExternalLink,
  User,
  Link2,
  Github,
  Globe,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "All Portfolios - EduStride Admin",
};

export default async function AdminPortfoliosPage() {
  // Fetch all PUBLISHED portfolios with user info
  const portfolios = await prisma.portfolio.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          level: true,
        },
      },
    },
  });

  // Group portfolios by user email
  const groupedByUser = portfolios.reduce((acc, portfolio) => {
    const email = portfolio.user.email;
    if (!acc[email]) {
      acc[email] = {
        user: portfolio.user,
        portfolios: [],
      };
    }
    acc[email].portfolios.push(portfolio);
    return acc;
  }, {} as Record<string, { user: { id: string; name: string; email: string; level: string }; portfolios: typeof portfolios }>);

  // Get all unique links from published portfolios
  const allLinks = portfolios.flatMap((p) => {
    const links = [];
    if (p.link) {
      links.push({
        id: `${p.id}-link`,
        title: p.title,
        url: p.link,
        type: "website" as const,
        user: p.user,
      });
    }
    if (p.githubUrl) {
      links.push({
        id: `${p.id}-github`,
        title: `${p.title} (GitHub)`,
        url: p.githubUrl,
        type: "github" as const,
        user: p.user,
      });
    }
    if (p.demoUrl) {
      links.push({
        id: `${p.id}-demo`,
        title: `${p.title} (Demo)`,
        url: p.demoUrl,
        type: "demo" as const,
        user: p.user,
      });
    }
    return links;
  });

  const users = Object.values(groupedByUser);
  const websiteLinks = allLinks.filter((l) => l.type === "website");
  const githubLinks = allLinks.filter((l) => l.type === "github");
  const demoLinks = allLinks.filter((l) => l.type === "demo");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portofolio User</h1>
          <p className="text-muted-foreground mt-1">
            {portfolios.length} portofolio published dari {users.length} user
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portofolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Website Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {websiteLinks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              GitHub Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {githubLinks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Demo Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {demoLinks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan email user atau judul portofolio..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users with Portfolios */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada portofolio yang dipublish
              </p>
            </CardContent>
          </Card>
        ) : (
          users.map(({ user, portfolios: userPortfolios }) => (
            <Card key={user.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                    <span className="font-medium text-cyan-700">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                      <Badge variant="secondary" className="text-xs">
                        {user.level}
                      </Badge>
                      <Badge className="bg-green-500 text-xs">
                        {userPortfolios.length} Portofolio
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {userPortfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="p-4 rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{portfolio.title}</h4>
                            {portfolio.isFeatured && (
                              <Badge className="bg-purple-500 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {portfolio.description || "Tidak ada deskripsi"}
                          </p>
                          {portfolio.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {portfolio.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {portfolio.link && (
                            <a
                              href={portfolio.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <Link2 className="h-4 w-4 mr-1" />
                                Website
                              </Button>
                            </a>
                          )}
                          {portfolio.githubUrl && (
                            <a
                              href={portfolio.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <Github className="h-4 w-4 mr-1" />
                                GitHub
                              </Button>
                            </a>
                          )}
                          {portfolio.demoUrl && (
                            <a
                              href={portfolio.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <Globe className="h-4 w-4 mr-1" />
                                Demo
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
