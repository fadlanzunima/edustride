"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  size?: "1x1" | "2x1" | "2x2";
  delay?: number;
}

export function BentoItem({ 
  children, 
  className, 
  size = "1x1",
  delay = 0 
}: BentoItemProps) {
  const sizeClasses = {
    "1x1": "col-span-1 row-span-1",
    "2x1": "col-span-2 row-span-1",
    "2x2": "col-span-2 row-span-2"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card border border-border p-6",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
