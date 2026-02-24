import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard - EduStride",
  description: "Super Admin dashboard for managing EduStride",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <div className="fixed left-0 top-0 h-screen w-64 z-50">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-8 ml-64 overflow-auto min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
