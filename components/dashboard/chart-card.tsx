"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

type ChartType = "line" | "bar" | "pie" | "area";

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartCardProps {
  title: string;
  description?: string;
  type: ChartType;
  data: ChartData[];
  dataKeys?: string[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  className?: string;
  delay?: number;
  height?: number;
}

export function ChartCard({
  title,
  description,
  type,
  data,
  dataKeys = ["value"],
  colors = COLORS,
  showLegend = true,
  showGrid = true,
  className,
  delay = 0,
  height = 300,
}: ChartCardProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              {showLegend && <Legend />}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="w-full">{renderChart()}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick stat comparison component
interface QuickStatProps {
  label: string;
  current: number;
  previous: number;
  format?: "number" | "percentage" | "currency";
  className?: string;
}

export function QuickStat({
  label,
  current,
  previous,
  format = "number",
  className,
}: QuickStatProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value}%`;
      default:
        return new Intl.NumberFormat("id-ID").format(value);
    }
  };

  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{formatValue(current)}</p>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "text-xs font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}
