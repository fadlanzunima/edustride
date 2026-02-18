import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata = {
  title: "Dashboard - EduStride",
  description: "Dashboard EduStride untuk mengelola portofolio dan skill",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardContent />
    </div>
  );
}
