"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/layout/admin-sidebar";
import { AdminNavbar } from "@/features/admin/components/layout/admin-navbar";
import { AdminNotificationDrawer } from "@/features/admin/components/layout/admin-notification-drawer";
import { AdminSearchModal } from "@/features/admin/components/layout/admin-search-modal";
import { useAdminStore } from "@/features/admin/hooks/use-admin-store";
import { cn } from "@/lib/utils";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarCollapsed, isAuthenticated, user } = useAdminStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Sync session cookies for SSR and middleware validation
    if (typeof document !== "undefined") {
      const hasRoleCookie = document.cookie.includes("social_x_admin_role");
      if (isAuthenticated && user) {
        if (!hasRoleCookie) {
          document.cookie = `social_x_admin_role=super_admin; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `social_x_admin_token=jwt-${user.id}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else if (!hasRoleCookie) {
        // Not authenticated in store and no cookie present
        router.replace("/login/admin?error=admin_access_required");
      }
    }
  }, [isAuthenticated, user, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent shadow-lg" />
        <p className="text-xs font-mono font-semibold text-muted-foreground animate-pulse">
          Initializing Root Admin Environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Super Admin Persistent Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <AdminNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <GlobalErrorBoundary sectionName="Admin Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Slide-over Notification Center */}
      <AdminNotificationDrawer />

      {/* ⌘K Global Quick Navigator */}
      <AdminSearchModal />
    </div>
  );
}
