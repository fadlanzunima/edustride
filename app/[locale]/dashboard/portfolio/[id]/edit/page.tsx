"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PortfolioForm } from "@/components/portfolio/portfolio-form";
import { usePortfolio, useUpdatePortfolio } from "@/hooks/use-portfolio";
import { toast } from "sonner";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

interface PortfolioFormData {
  title: string;
  description?: string;
  type: "PROJECT" | "CERTIFICATE" | "EXPERIENCE" | "PUBLICATION" | "AWARD";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnail?: string;
  link?: string;
  githubUrl?: string;
  demoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured: boolean;
  tags: string[];
}

export default function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: portfolio, isLoading } = usePortfolio(id);
  const updatePortfolio = useUpdatePortfolio();

  const handleSubmit = async (data: PortfolioFormData) => {
    try {
      // Convert dates to ISO strings for API
      const payload = {
        id,
        title: data.title,
        type: data.type,
        status: data.status,
        isFeatured: data.isFeatured,
        tags: data.tags,
        ...(data.description && { description: data.description }),
        ...(data.thumbnail && { thumbnail: data.thumbnail }),
        ...(data.link && { link: data.link }),
        ...(data.githubUrl && { githubUrl: data.githubUrl }),
        ...(data.demoUrl && { demoUrl: data.demoUrl }),
        ...(data.startDate && { startDate: data.startDate.toISOString() }),
        ...(data.endDate && { endDate: data.endDate.toISOString() }),
      };

      await updatePortfolio.mutateAsync(payload);
      toast.success("Portfolio berhasil diperbarui");
      router.push("/dashboard/portfolio");
    } catch (error) {
      toast.error("Gagal memperbarui portfolio");
      console.error(error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/portfolio">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Portfolio</h1>
          <p className="text-muted-foreground">
            Perbarui informasi portfolio Anda
          </p>
        </div>
      </div>

      {/* Form */}
      <PortfolioForm
        initialData={portfolio}
        onSubmit={handleSubmit}
        isSubmitting={updatePortfolio.isPending}
      />
    </div>
  );
}
