"use client";

import { motion } from "motion/react";
import { useLevelStore } from "@/lib/store/level-store";
import { levelThemes } from "@/lib/data/level-content";
import type { Level } from "@/types";
import { cn } from "@/lib/utils";

const levels: Level[] = ["SMA", "S1", "S2/S3"];

export function LevelSwitcher() {
  const { currentLevel, setLevel } = useLevelStore();
  const theme = levelThemes[currentLevel ?? "S1"];

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-full w-fit">
      {levels.map((level) => {
        const isActive = currentLevel === level;
        const levelTheme = levelThemes[level];

        return (
          <motion.button
            key={level}
            onClick={() => setLevel(level)}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isActive && "text-white"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeLevel"
                className={cn(
                  "absolute inset-0 rounded-full",
                  levelTheme.primary === "cyan" && "bg-cyan-500",
                  levelTheme.primary === "blue" && "bg-blue-600",
                  levelTheme.primary === "slate" && "bg-slate-700"
                )}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{level}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
