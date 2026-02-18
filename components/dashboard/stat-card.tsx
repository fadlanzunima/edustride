"use client";

import * as React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                </div>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              {trend?.label && (
                <p className="text-xs text-muted-foreground">{trend.label}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
