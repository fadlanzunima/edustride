"use client";

import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DynamicWrapperOptions {
  loading?: React.ReactNode;
  ssr?: boolean;
}

/**
 * Dynamic Wrapper for Code Splitting
 *
 * Wraps components with React.lazy and Suspense for automatic code splitting.
 * Use this for heavy components that don't need to be loaded immediately.
 *
 * @example
 * const HeavyChart = dynamicWrapper(() => import("./heavy-chart"), {
 *   loading: <ChartSkeleton />
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dynamicWrapper<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicWrapperOptions = {}
) {
  const { loading = <DefaultLoading />, ssr = false } = options;

  const LazyComponent = lazy(importFunc);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function DynamicComponent(props: any) {
    return (
      <Suspense fallback={loading}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

function DefaultLoading() {
  return (
    <div className="w-full h-48">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

/**
 * Predefined loading components for different use cases
 */
export const LoadingComponents = {
  Card: () => (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  ),

  Chart: () => (
    <div className="w-full h-64 p-4">
      <Skeleton className="w-full h-full" />
    </div>
  ),

  List: ({ count = 3 }: { count?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  ),

  Table: ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  ),

  Widget: () => (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  ),
};
