import { Suspense } from "react";
import { AnalyticsContent } from "@/components/dashboard/analytics-content";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata = {
  title: "Analytics - EduStride",
  description: "Analytics and insights for your portfolio",
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AnalyticsContent />
    </Suspense>
  );
}
