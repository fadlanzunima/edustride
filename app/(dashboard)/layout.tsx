import { DashboardShell } from "@/components/dashboard/shell";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  );
}
