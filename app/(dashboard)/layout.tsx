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
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
