"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Play,
  Pencil,
  Trash2,
  Loader2,
  FileText,
  Award,
  Briefcase,
  BookOpen,
  Trophy,
  Star,
  Tag,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePortfolio, useDeletePortfolio } from "@/hooks/use-portfolio";
import { cn } from "@/lib/utils";

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

const portfolioTypeConfig = {
  PROJECT: {
    label: "Proyek",
    icon: FileText,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  CERTIFICATE: {
    label: "Sertifikat",
    icon: Award,
    color: "bg-green-500",
    bgColor: "bg-green-50",
  },
  EXPERIENCE: {
    label: "Pengalaman",
    icon: Briefcase,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
  PUBLICATION: {
    label: "Publikasi",
    icon: BookOpen,
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
  },
  AWARD: {
    label: "Penghargaan",
    icon: Trophy,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
  },
};

const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" as const },
  PUBLISHED: { label: "Dipublikasikan", variant: "default" as const },
  ARCHIVED: { label: "Diarsipkan", variant: "destructive" as const },
};

export default function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: portfolio, isLoading } = usePortfolio(id);
  const deletePortfolio = useDeletePortfolio();

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus portfolio ini?")) {
      return;
    }

    try {
      await deletePortfolio.mutateAsync(id);
      toast.success("Portfolio berhasil dihapus");
      router.push("/dashboard/portfolio");
    } catch (error) {
      toast.error("Gagal menghapus portfolio");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">Portfolio tidak ditemukan</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Portfolio yang Anda cari mungkin telah dihapus atau tidak ada.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/portfolio">Kembali ke Daftar</Link>
        </Button>
      </div>
    );
  }

  const typeConfig = portfolioTypeConfig[portfolio.type];
  const TypeIcon = typeConfig.icon;
  const statusConf = statusConfig[portfolio.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/portfolio">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {portfolio.title}
              </h1>
              {portfolio.isFeatured && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-yellow-100 text-yellow-700"
                >
                  <Star className="h-3 w-3 fill-yellow-600" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={cn("w-2 h-2 rounded-full", typeConfig.color)} />
              {typeConfig.label}
              <span>•</span>
              <Badge variant={statusConf.variant} className="text-xs">
                {statusConf.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/portfolio/${portfolio.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {portfolio.thumbnail && (
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={portfolio.thumbnail}
                    alt={portfolio.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.description ? (
                <div className="prose prose-sm max-w-none">
                  {portfolio.description.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Tidak ada deskripsi</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {portfolio.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {portfolio.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          {(portfolio.link || portfolio.githubUrl || portfolio.demoUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Tautan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {portfolio.link && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={portfolio.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                {portfolio.githubUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {portfolio.demoUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={portfolio.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tanggal Mulai</span>
                <span>
                  {portfolio.startDate
                    ? format(new Date(portfolio.startDate), "dd MMMM yyyy", {
                        locale: idLocale,
                      })
                    : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tanggal Selesai</span>
                <span>
                  {portfolio.endDate
                    ? format(new Date(portfolio.endDate), "dd MMMM yyyy", {
                        locale: idLocale,
                      })
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dibuat</span>
                <span>
                  {format(new Date(portfolio.createdAt), "dd MMM yyyy", {
                    locale: idLocale,
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diperbarui</span>
                <span>
                  {format(new Date(portfolio.updatedAt), "dd MMM yyyy", {
                    locale: idLocale,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
