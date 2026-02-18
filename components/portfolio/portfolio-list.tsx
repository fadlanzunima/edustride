"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  FileText,
  Award,
  Briefcase,
  BookOpen,
  Trophy,
  Star,
  Calendar,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@prisma/client";

interface PortfolioListProps {
  portfolios: Portfolio[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
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
  DRAFT: {
    label: "Draft",
    color: "bg-gray-500",
    variant: "secondary" as const,
  },
  PUBLISHED: {
    label: "Dipublikasikan",
    color: "bg-green-500",
    variant: "default" as const,
  },
  ARCHIVED: {
    label: "Diarsipkan",
    color: "bg-red-500",
    variant: "destructive" as const,
  },
};

export function PortfolioList({
  portfolios,
  isLoading,
  onDelete,
}: PortfolioListProps) {
  const router = useRouter();

  if (isLoading) {
    return <PortfolioListSkeleton />;
  }

  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Belum ada portfolio</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Mulai buat portfolio pertamamu untuk menampilkan proyek, sertifikat,
          dan pengalamanmu.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/portfolio/create">Buat Portfolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Judul</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolios.map((portfolio) => {
            const typeConfig = portfolioTypeConfig[portfolio.type];
            const TypeIcon = typeConfig.icon;
            const statusConf = statusConfig[portfolio.status];

            return (
              <TableRow key={portfolio.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage
                        src={portfolio.thumbnail || undefined}
                        alt={portfolio.title}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className={cn(
                          "rounded-lg text-white",
                          typeConfig.color
                        )}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium line-clamp-1">
                        {portfolio.title}
                      </span>
                      {portfolio.isFeatured && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Star className="h-3 w-3 fill-yellow-600" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("w-2 h-2 rounded-full", typeConfig.color)}
                    />
                    <span className="text-sm">{typeConfig.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConf.variant} className="text-xs">
                    {statusConf.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {portfolio.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {portfolio.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{portfolio.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {portfolio.startDate
                      ? format(new Date(portfolio.startDate), "MMM yyyy", {
                          locale: idLocale,
                        })
                      : "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/portfolio/${portfolio.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/portfolio/${portfolio.id}/edit`}
                        >
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function PortfolioListSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Judul</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[60px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
