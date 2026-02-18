"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardContent } from "@/components/widgets/dashboard-content";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}
