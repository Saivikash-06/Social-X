"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IndustrySidebar } from "@/features/industry/components/layout/industry-sidebar";
import { IndustryNavbar } from "@/features/industry/components/layout/industry-navbar";
import { IndustryNotificationDrawer } from "@/features/industry/components/layout/industry-notification-drawer";
import { IndustryGlobalSearchModal } from "@/features/industry/components/layout/industry-global-search-modal";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { cn } from "@/lib/utils";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarCollapsed, isAuthenticated, user } = useIndustryStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Ensure cookie exists if authenticated
    if (isAuthenticated && user && typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("social_x_industry_role");
      if (!hasCookie) {
        document.cookie = `social_x_industry_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_industry_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
  }, [isAuthenticated, user]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Fixed Sidebar */}
      <IndustrySidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <IndustryNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <GlobalErrorBoundary sectionName="Industry Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Slide-over Notifications */}
      <IndustryNotificationDrawer />

      {/* ⌘K Global Search Dialog */}
      <IndustryGlobalSearchModal />
    </div>
  );
}
