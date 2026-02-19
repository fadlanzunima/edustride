"use client";

import { motion } from "motion/react";
import {
  FolderOpen,
  Plus,
  Sparkles,
  GraduationCap,
  BookOpen,
  Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Level } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  level?: Level;
}

// Level-specific configuration
const levelConfig: Record<
  Level,
  {
    icon: React.ReactNode;
    gradient: string;
    bgGradient: string;
    description: string;
  }
> = {
  SMA: {
    icon: <BookOpen className="h-16 w-16 text-cyan-600 dark:text-cyan-400" />,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient:
      "from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30",
    description:
      "Mulai perjalananmu dengan menambahkan project sekolah, prestasi akademik, atau eksplorasi jurusan impian.",
  },
  S1: {
    icon: (
      <GraduationCap className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
    ),
    gradient: "from-blue-600 to-indigo-600",
    bgGradient:
      "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
    description:
      "Bangun portofolio profesionalmu dengan menambahkan project, pengalaman magang, dan sertifikasi.",
  },
  "S2/S3": {
    icon: (
      <Microscope className="h-16 w-16 text-slate-600 dark:text-slate-400" />
    ),
    gradient: "from-slate-600 to-slate-800",
    bgGradient:
      "from-slate-200 to-slate-300 dark:from-slate-800/50 dark:to-slate-900/50",
    description:
      "Mulai tracking risetmu dengan menambahkan publikasi, grant penelitian, dan kolaborasi akademik.",
  },
};

export function DashboardEmptyState({
  level = "S1",
}: DashboardEmptyStateProps) {
  const t = useTranslations("common.emptyState");
  const config = levelConfig[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <Card className="w-full max-w-2xl border-dashed border-2 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6"
          >
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-xl opacity-50",
                  "bg-gradient-to-r",
                  config.gradient
                )}
              />
              <div
                className={cn(
                  "relative p-6 rounded-full bg-gradient-to-br",
                  config.bgGradient
                )}
              >
                {config.icon}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-2"
          >
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r text-white",
                config.gradient
              )}
            >
              Level: {level}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-2xl font-bold mb-3"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-muted-foreground mb-8 max-w-md"
          >
            {config.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/dashboard/portfolio/create">
              <Button
                size="lg"
                className={cn(
                  "bg-gradient-to-r hover:opacity-90",
                  config.gradient
                )}
              >
                <Plus className="mr-2 h-5 w-5" />
                {t("createPortfolio")}
              </Button>
            </Link>
            <Link href="/dashboard/skills">
              <Button variant="outline" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("addSkill")}
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
