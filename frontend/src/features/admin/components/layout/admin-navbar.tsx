"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  ShieldAlert,
  Server,
  Activity,
  Cpu,
  LogOut,
  User,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { ThemeToggle } from "@/features/shared/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { useAdminStore } from "../../hooks/use-admin-store";
import { useSystemHealth } from "../../hooks/use-admin-queries";
import { useTranslation } from "react-i18next";

export function AdminNavbar() {
  const { t } = useTranslation();
  const {
    setMobileSidebarOpen,
    toggleNotificationDrawer,
    setSearchModalOpen,
    unreadNotificationsCount,
    user,
    logout,
    maintenanceMode,
  } = useAdminStore();

  const { data: health } = useSystemHealth();

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border/80 bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden h-9 w-9 p-0 rounded-xl"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("common.buttons.toggleMenu", "Toggle Menu")}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge
            variant="destructive"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg shadow-xs"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{t("admin.portalTitle", "ROOT CONSOLE")}</span>
          </Badge>

          {/* Real-time System Beacon */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border/60 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-rose-500" />
              <span className="font-mono text-foreground font-semibold">
                {health ? `${health.cpuUsagePct}%` : "28%"}
              </span>
              <span>{t("admin.systemHealth.cpu", "CPU")}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="font-mono text-foreground font-semibold">
                {health ? `${health.databaseStatus.avgQueryLatencyMs}ms` : "4.8ms"}
              </span>
              <span>{t("admin.systemHealth.database", "DB")}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Server className="h-3 w-3 text-blue-500" />
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">99.98%</span>
              <span>{t("admin.systemHealth.uptime", "Uptime")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center / Right: Global Search, Maintenance Indicator & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {maintenanceMode && (
          <Badge variant="warning" className="animate-pulse px-2 py-0.5 text-xs font-bold gap-1 rounded-md">
            <span>{t("admin.settings.maintenanceMode", "⚠️ Maintenance Active")}</span>
          </Badge>
        )}

        {/* ⌘K Global Search Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchModalOpen(true)}
          className="h-9 px-3 rounded-xl border-border/80 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground text-xs gap-2 hidden sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{t("admin.overview.searchPlaceholder", "Quick Navigator...")}</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </Button>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleNotificationDrawer}
          className="relative h-9 w-9 p-0 rounded-xl hover:bg-muted/60"
          title={t("admin.auditLogs.securityEvent", "Security & System Alerts")}
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          )}
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Pill & Profile Link */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted/40 transition-colors"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user ? user.name.split(" ").map((n) => n[0]).join("") : "SA"}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-foreground leading-none">{user?.name || "Dr. Vikramaditya Sen"}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{user?.roleTitle || t("common.roles.admin", "Platform Owner")}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
