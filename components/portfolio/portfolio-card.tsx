"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Award,
  Briefcase,
  BookOpen,
  Trophy,
  Star,
  Calendar,
  ExternalLink,
  Github,
  Play,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@prisma/client";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete?: (id: string) => void;
  variant?: "default" | "compact";
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

export function PortfolioCard({
  portfolio,
  onDelete,
  variant = "default",
}: PortfolioCardProps) {
  const typeConfig = portfolioTypeConfig[portfolio.type];
  const TypeIcon = typeConfig.icon;
  const statusConf = statusConfig[portfolio.status];

  if (variant === "compact") {
    return (
      <Card className="group overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                typeConfig.color
              )}
            >
              <TypeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/dashboard/portfolio/${portfolio.id}`}
                className="font-medium line-clamp-1 hover:underline"
              >
                {portfolio.title}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">
                {typeConfig.label} • {statusConf.label}
              </p>
            </div>
            {portfolio.isFeatured && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {portfolio.thumbnail ? (
          <img
            src={portfolio.thumbnail}
            alt={portfolio.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center",
              typeConfig.bgColor
            )}
          >
            <TypeIcon
              className={cn(
                "h-12 w-12",
                typeConfig.color.replace("bg-", "text-")
              )}
            />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={statusConf.variant} className="text-xs">
            {statusConf.label}
          </Badge>
        </div>
        {portfolio.isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="gap-1 text-xs bg-yellow-100 text-yellow-700"
            >
              <Star className="h-3 w-3 fill-yellow-600" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/portfolio/${portfolio.id}`}
              className="font-semibold line-clamp-1 hover:underline"
            >
              {portfolio.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span
                className={cn("w-1.5 h-1.5 rounded-full", typeConfig.color)}
              />
              {typeConfig.label}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/portfolio/${portfolio.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(portfolio.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        {portfolio.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {portfolio.description}
          </p>
        )}

        {portfolio.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {portfolio.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {portfolio.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{portfolio.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {portfolio.startDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(portfolio.startDate), "MMM yyyy", {
              locale: idLocale,
            })}
            {portfolio.endDate && (
              <>
                {" "}
                -{" "}
                {format(new Date(portfolio.endDate), "MMM yyyy", {
                  locale: idLocale,
                })}
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        {portfolio.link && (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-3 w-3" />
              Link
            </a>
          </Button>
        )}
        {portfolio.githubUrl && (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-3 w-3" />
              GitHub
            </a>
          </Button>
        )}
        {portfolio.demoUrl && (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={portfolio.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="mr-2 h-3 w-3" />
              Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
