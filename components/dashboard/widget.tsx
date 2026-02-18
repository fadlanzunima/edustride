"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  MoreHorizontal,
  RefreshCw,
  GripVertical,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "full";

interface WidgetProps {
  id: string;
  title: string;
  size?: WidgetSize;
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  onConfigure?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const sizeClasses: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x1": "col-span-2 row-span-1",
  "1x2": "col-span-1 row-span-2",
  "2x2": "col-span-2 row-span-2",
  full: "col-span-full row-span-2",
};

export function Widget({
  id,
  title,
  size = "1x1",
  children,
  className,
  onRefresh,
  onConfigure,
  onRemove,
  isLoading,
  dragHandleProps,
}: WidgetProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(sizeClasses[size], className)}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Widget options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRefresh && (
                  <DropdownMenuItem onClick={onRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </DropdownMenuItem>
                )}
                {onConfigure && (
                  <DropdownMenuItem onClick={onConfigure}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </DropdownMenuItem>
                )}
                {(onRefresh || onConfigure) && onRemove && (
                  <DropdownMenuSeparator />
                )}
                {onRemove && (
                  <DropdownMenuItem onClick={onRemove} className="text-red-600">
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 pt-0">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Widget Grid Container
interface WidgetGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function WidgetGrid({
  children,
  className,
  columns = 4,
}: WidgetGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4 auto-rows-min",
        columnClasses[columns],
        className
      )}
    >
      {children}
    </div>
  );
}

// Empty Widget State
interface EmptyWidgetProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyWidget({
  icon,
  title,
  description,
  action,
}: EmptyWidgetProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-4">
      {icon && <div className="mb-3 rounded-full bg-muted p-3">{icon}</div>}
      <h4 className="text-sm font-medium">{title}</h4>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Quick Actions Widget
interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "outline";
}

interface QuickActionsWidgetProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActionsWidget({
  actions,
  className,
}: QuickActionsWidgetProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant === "primary" ? "default" : "outline"}
          className="h-auto flex-col gap-2 p-4"
          onClick={action.onClick}
        >
          {action.icon}
          <span className="text-xs">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
