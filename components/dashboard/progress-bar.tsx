"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "error" | "primary";
  showValue?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "primary",
  showValue = true,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-secondary",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progress"}
      >
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: animated ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}

// Circular Progress Component
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "default" | "success" | "warning" | "error" | "primary";
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
  color = "primary",
  showValue = true,
  label,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    default: "stroke-muted-foreground",
    primary: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-amber-500",
    error: "stroke-red-500",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-secondary"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={colorClasses[color]}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

// Multi-step Progress Component
interface MultiStepProgressProps {
  steps: { label: string; completed: boolean; current?: boolean }[];
  className?: string;
}

export function MultiStepProgress({
  steps,
  className,
}: MultiStepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  step.completed
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.current
                    ? "border-primary bg-background text-primary"
                    : "border-muted-foreground bg-background text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  step.completed || step.current
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  step.completed ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
