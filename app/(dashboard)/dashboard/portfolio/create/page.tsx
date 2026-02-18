"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PortfolioForm } from "@/components/portfolio/portfolio-form";
import { useCreatePortfolio } from "@/hooks/use-portfolio";
import { toast } from "sonner";

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

export default function CreatePortfolioPage() {
  const router = useRouter();
  const createPortfolio = useCreatePortfolio();

  const handleSubmit = async (data: PortfolioFormData) => {
    try {
      // Convert dates to ISO strings for API
      const payload = {
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

      await createPortfolio.mutateAsync(payload);
      toast.success("Portfolio berhasil dibuat");
      router.push("/dashboard/portfolio");
    } catch (error) {
      toast.error("Gagal membuat portfolio");
      console.error(error);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">
            Buat Portfolio Baru
          </h1>
          <p className="text-muted-foreground">
            Tambahkan proyek, sertifikat, atau pengalaman baru
          </p>
        </div>
      </div>

      {/* Form */}
      <PortfolioForm
        onSubmit={handleSubmit}
        isSubmitting={createPortfolio.isPending}
      />
    </div>
  );
}
