"use client";

import * as React from "react";
import { CitizenSidebar } from "@/features/citizen/components/citizen-sidebar";
import { CitizenNavbar } from "@/features/citizen/components/citizen-navbar";
import { NotificationDrawer } from "@/features/citizen/components/notification-drawer";
import { useCitizenStore } from "@/features/citizen/hooks/use-citizen-store";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { cn } from "@/lib/utils";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useCitizenStore();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    // Sync session cookies for SSR and middleware validation
    if (typeof document !== "undefined") {
      const hasRoleCookie = document.cookie.includes("social_x_user_role");
      if (isAuthenticated && user) {
        if (!hasRoleCookie) {
          document.cookie = `social_x_user_role=${user.role || "citizen"}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `social_x_session=jwt-${user.id}; path=/; max-age=86400; SameSite=Lax`;
        }
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Sidebar */}
      <CitizenSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <CitizenNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <GlobalErrorBoundary sectionName="Citizen Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Real-time Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
}
