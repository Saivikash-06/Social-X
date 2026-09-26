"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GovernmentSidebar } from "@/features/government/components/layout/government-sidebar";
import { GovernmentNavbar } from "@/features/government/components/layout/government-navbar";
import { GovernmentNotificationDrawer } from "@/features/government/components/layout/government-notification-drawer";
import { GovernmentSearchModal } from "@/features/government/components/layout/government-search-modal";
import { useGovernmentStore } from "@/features/government/hooks/use-government-store";
import { cn } from "@/lib/utils";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSidebarCollapsed, isAuthenticated, officer, token } =
    useGovernmentStore();
  const [mounted, setMounted] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    if (typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("social_x_government_role");
      if (isAuthenticated && officer) {
        if (!hasCookie) {
          document.cookie = `social_x_government_role=government; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `social_x_government_token=${token || "jwt-gov"}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else if (!hasCookie) {
        router.replace("/official-login?error=officer_access_required");
      }
    }
  }, [isAuthenticated, officer, token, router]);

  // Keyboard shortcut ⌘K for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-lg" />
        <p className="text-xs font-mono font-semibold text-muted-foreground animate-pulse">
          Initializing Government Portal Environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      {/* Persistent Government Sidebar */}
      <GovernmentSidebar />

      {/* Main Content Body */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <GovernmentNavbar
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <GlobalErrorBoundary sectionName="Government Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Slide-over Notification Panel */}
      <GovernmentNotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Global Quick Search ⌘K */}
      <GovernmentSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
