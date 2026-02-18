"use client";

import { useSession } from "next-auth/react";
import { useLevelStore } from "@/lib/store/level-store";
import { defaultAppData } from "@/lib/data/level-content";
import { BentoGrid, BentoItem } from "@/components/bento-grid/bento-grid";
import { LevelSwitcher } from "@/components/level-switcher/level-switcher";
import { UserMenu } from "@/components/auth/user-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, MapPin, Award, BookOpen } from "lucide-react";

export function DashboardContent() {
  const { data: session } = useSession();
  const { currentLevel } = useLevelStore();
  const data = defaultAppData;

  const userName = session?.user?.name || data.user_profile.name;
  const userLevel = session?.user?.level || currentLevel;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang, {userName}</p>
        </div>
        <div className="flex items-center gap-4">
          <LevelSwitcher />
          <UserMenu />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <BentoGrid>
            {/* Main Widget - 2x2 */}
            <BentoItem
              size="2x2"
              className="bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Widget Utama
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {currentLevel === "SMA" && "Interactive Career Explorer"}
                  {currentLevel === "S1" && "Live Portfolio Preview"}
                  {currentLevel === "S2/S3" && "Research Impact Tracker"}
                </h2>
                <p className="text-muted-foreground flex-1">
                  Konten utama untuk level {currentLevel} akan ditampilkan di
                  sini.
                </p>
              </div>
            </BentoItem>

            {/* Roadmap Widget - 2x1 */}
            <BentoItem size="2x1" delay={0.1}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Roadmap
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {data.widgets.roadmap[currentLevel]}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentLevel}</Badge>
                <span className="text-sm text-muted-foreground">
                  Target Prioritas
                </span>
              </div>
            </BentoItem>

            {/* Skills Widget - 1x1 */}
            <BentoItem size="1x1" delay={0.2}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Trending Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.widgets.trending_skills[currentLevel].map(
                  (skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </BentoItem>

            {/* Learning Widget - 1x1 */}
            <BentoItem size="1x1" delay={0.3}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Learning
                </span>
              </div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Kursus aktif</p>
            </BentoItem>
          </BentoGrid>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
