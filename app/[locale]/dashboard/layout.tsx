import { DashboardShell } from "@/components/dashboard/shell";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata = {
  title: "Dashboard - EduStride",
  description: "Dashboard EduStride untuk mengelola portofolio dan skill",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowDemo={true}>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
