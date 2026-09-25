"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Crosshair,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/features/shared/components/ui/button";
import { ConfirmationDialog } from "@/features/shared/components/feedback/confirmation-dialog";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { useCitizenStore } from "../hooks/use-citizen-store";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { key: "nav.dashboard", label: "Dashboard", href: "/citizen", icon: LayoutDashboard },
  {
    key: "nav.report_problem",
    label: "Report Problem",
    href: "/citizen/report",
    icon: PlusCircle,
    badge: "AI Powered",
  },
  { key: "nav.my_issues", label: "My Issues", href: "/citizen/issues", icon: FolderKanban },
  { key: "nav.track_issues", label: "Track Issues", href: "/citizen/track", icon: Crosshair },
  { key: "nav.notifications", label: "Notifications", href: "/citizen/notifications", icon: Bell },
  { key: "nav.profile", label: "Profile", href: "/citizen/profile", icon: User },
  { key: "nav.settings", label: "Settings", href: "/citizen/settings", icon: Settings },
  { key: "nav.help", label: "Help", href: "/citizen/help", icon: HelpCircle },
];

export function CitizenSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
  } = useCitizenStore();

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    router.push("/login/citizen");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 shadow-sm",
          isSidebarCollapsed ? "w-20" : "w-64",
          // Mobile state
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
          <Link
            href="/citizen"
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-teal-400 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-lg font-black tracking-tight text-foreground">
                  SOCIAL<span className="text-primary">-X</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {t("citizen.portalTitle", "Citizen Portal")}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label={isSidebarCollapsed ? t("common.buttons.expandSidebar", "Expand sidebar") : t("common.buttons.collapseSidebar", "Collapse sidebar")}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/citizen"
                ? pathname === "/citizen"
                : pathname.startsWith(item.href);

            const displayLabel = t(item.key, item.label);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isSidebarCollapsed && "justify-center px-0"
                )}
                title={isSidebarCollapsed ? displayLabel : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1">{displayLabel}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {t("ai.title", item.badge)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Details & Logout Bottom */}
        <div className="p-3 border-t border-border/80 space-y-2.5">
          {!isSidebarCollapsed && (
            <div className="rounded-xl bg-muted/40 border border-border/60 p-3 space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">
                  {user?.fullName || t("common.roles.citizen", "Citizen User")}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md shrink-0">
                  {t("common.labels.verified", "Verified Citizen")}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {[user?.district || "Bengaluru Urban", user?.state].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            className={cn(
              "w-full rounded-xl gap-2 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
              isSidebarCollapsed && "justify-center px-0"
            )}
            onClick={() => setShowLogoutDialog(true)}
            title={isSidebarCollapsed ? t("common.buttons.logout", "Sign Out") : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>{t("common.buttons.logout", "Sign Out")}</span>}
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={t("dialog.confirmLogout", "Sign Out of Social-X")}
        description={t("dialog.confirmLogoutDesc", "Are you sure you want to end your current citizen session? You will need to sign in again to file or track grievances.")}
        confirmLabel={t("common.buttons.logout", "Sign Out")}
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}
