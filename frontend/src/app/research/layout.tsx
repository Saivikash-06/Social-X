"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ResearchSidebar } from "@/features/research/components/layout/research-sidebar";
import { ResearchNavbar } from "@/features/research/components/layout/research-navbar";
import { ResearchNotificationDrawer } from "@/features/research/components/layout/research-notification-drawer";
import { ResearchGlobalSearchModal } from "@/features/research/components/layout/research-global-search-modal";
import { useResearchStore } from "@/features/research/hooks/use-research-store";
import { cn } from "@/lib/utils";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarCollapsed, isAuthenticated, user } = useResearchStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isAuthenticated && user && typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("social_x_research_role");
      if (!hasCookie) {
        document.cookie = `social_x_research_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_research_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
  }, [isAuthenticated, user]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Fixed Sidebar */}
      <ResearchSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <ResearchNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <GlobalErrorBoundary sectionName="Research Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Notifications Drawer */}
      <ResearchNotificationDrawer />

      {/* Search Modal */}
      <ResearchGlobalSearchModal />
    </div>
  );
}
