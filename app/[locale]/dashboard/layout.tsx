import { DashboardShell } from "@/components/dashboard/shell";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { NuqsProvider } from "@/components/providers/nuqs-provider";

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
      <NuqsProvider>
        <DashboardShell>{children}</DashboardShell>
      </NuqsProvider>
    </ProtectedRoute>
  );
}
