"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List, Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioList } from "@/components/portfolio/portfolio-list";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { usePortfolios, useDeletePortfolio } from "@/hooks/use-portfolio";
import { toast } from "sonner";

export default function PortfolioPage() {
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const { data: portfoliosData, isLoading } = usePortfolios({
    search: searchQuery || undefined,
    type:
      typeFilter !== "all"
        ? (typeFilter as
            | "PROJECT"
            | "CERTIFICATE"
            | "EXPERIENCE"
            | "PUBLICATION"
            | "AWARD")
        : undefined,
    status:
      statusFilter !== "all"
        ? (statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED")
        : undefined,
    limit: 50,
  });

  const deletePortfolio = useDeletePortfolio();

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus portfolio ini?")) {
      return;
    }

    try {
      await deletePortfolio.mutateAsync(id);
      toast.success("Portfolio berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus portfolio");
    }
  };

  const portfolios = portfoliosData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Kelola proyek, sertifikat, dan pengalaman Anda
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/portfolio/create">
            <Plus className="mr-2 h-4 w-4" />
            Buat Portfolio
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari portfolio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="PROJECT">Proyek</SelectItem>
              <SelectItem value="CERTIFICATE">Sertifikat</SelectItem>
              <SelectItem value="EXPERIENCE">Pengalaman</SelectItem>
              <SelectItem value="PUBLICATION">Publikasi</SelectItem>
              <SelectItem value="AWARD">Penghargaan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Dipublikasikan</SelectItem>
              <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "list" | "grid")}
          >
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <PortfolioList
          portfolios={portfolios}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-lg border bg-muted animate-pulse"
                />
              ))
            : portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onDelete={handleDelete}
                />
              ))}
        </div>
      )}
    </div>
  );
}
