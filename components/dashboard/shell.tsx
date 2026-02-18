"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { MobileSidebar } from "./mobile-sidebar";
import { Header } from "./header";
import { Breadcrumbs } from "./breadcrumbs";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Mobile Sidebar Sheet */}
      <MobileSidebar
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className={
          "transition-all duration-300 ease-in-out " +
          (isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[320px]")
        }
      >
        {/* Header */}
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Main Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 pb-24 lg:p-6 lg:pb-6">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
