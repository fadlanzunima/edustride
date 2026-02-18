"use client";

import * as React from "react";
import Link from "next/link";
import { FolderOpen, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { usePortfolios, useDeletePortfolio } from "@/hooks/use-portfolio";
import { toast } from "sonner";

export function PortfolioSummary() {
  const { data: portfoliosData, isLoading } = usePortfolios({
    limit: 3,
    sortBy: "updatedAt",
    sortOrder: "desc",
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
  const total = portfoliosData?.pagination?.total || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Portfolio Terbaru
          {total > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({total} total)
            </span>
          )}
        </CardTitle>
        <Button size="sm" asChild>
          <Link href="/dashboard/portfolio/create">
            <Plus className="mr-2 h-4 w-4" />
            Baru
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              Belum ada portfolio. Buat portfolio pertamamu sekarang!
            </p>
            <Button asChild>
              <Link href="/dashboard/portfolio/create">Buat Portfolio</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                variant="compact"
                onDelete={handleDelete}
              />
            ))}
            {total > 3 && (
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/dashboard/portfolio">Lihat Semua ({total})</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
