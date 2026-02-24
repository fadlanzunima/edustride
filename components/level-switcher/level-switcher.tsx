"use client";

import { motion } from "motion/react";
import { useLevelStore } from "@/lib/store/level-store";
import { levelThemes } from "@/lib/data/level-content";
import type { Level } from "@/types";
import { cn } from "@/lib/utils";

const allLevels: Level[] = ["SMA", "S1", "S2/S3"];

export function LevelSwitcher() {
  const { currentLevel, setLevel, isSMAOnlyMode, availableLevels } =
    useLevelStore();
  const theme = levelThemes[currentLevel ?? "SMA"];

  // SMA-only mode: Show badge instead of switcher
  if (isSMAOnlyMode) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-200 dark:border-cyan-800">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
          SMA Student
        </span>
      </div>
    );
  }

  // Normal mode: Show full level switcher
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-full w-fit">
      {allLevels.map((level) => {
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
