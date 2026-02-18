import { Suspense } from "react";
import { ActivitiesContent } from "@/components/dashboard/activities-content";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata = {
  title: "Activities - EduStride",
  description: "Your activity history and timeline",
};

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ActivitiesContent />
    </Suspense>
  );
}
