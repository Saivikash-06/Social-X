"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  Compass,
  Sparkles,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGovernmentStore } from "../../hooks/use-government-store";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface NavItem {
  key: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const GOV_NAV_ITEMS: NavItem[] = [
  {
    key: "nav.dashboard",
    title: "Dashboard",
    href: "/government/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "nav.assigned_cases",
    title: "Assigned Cases",
    href: "/government/assigned",
    icon: ClipboardList,
    badge: "Active",
  },
  {
    key: "nav.departments",
    title: "Departments",
    href: "/government/departments",
    icon: Building2,
  },
  {
    key: "nav.officers",
    title: "Officers",
    href: "/government/officers",
    icon: Users,
  },
  {
    key: "nav.track_issues",
    title: "Issue Tracking",
    href: "/government/tracking",
    icon: Compass,
  },
  {
    key: "nav.ai_suggestions",
    title: "AI Suggestions",
    href: "/government/ai-suggestions",
    icon: Sparkles,
    badge: "AI",
  },
  {
    key: "nav.analytics",
    title: "Analytics",
    href: "/government/analytics",
    icon: BarChart3,
  },
  {
    key: "nav.reports",
    title: "Reports",
    href: "/government/reports",
    icon: FileText,
  },
  {
    key: "nav.settings",
    title: "Settings",
    href: "/government/settings",
    icon: Settings,
  },
];

export function GovernmentSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar, logout, officer } =
    useGovernmentStore();

  const handleLogout = () => {
    logout();
    toast.info("Logged out of Government Portal.");
    router.replace("/official-login");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300 flex flex-col justify-between hidden lg:flex shadow-sm",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isSidebarCollapsed && (
          <Link
            href="/government/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-foreground">
                  SOCIAL-X
                </span>
                <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[9px] px-1.5 py-0">
                  GOV
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {t("government_portal", "Government Portal")}
              </p>
            </div>
          </Link>
        )}

        {isSidebarCollapsed && (
          <div className="mx-auto">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hidden lg:flex"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {GOV_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const displayTitle = t(item.key, item.title);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group relative",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{displayTitle}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className={cn(
                        "text-[9px] px-1.5 py-0 rounded-full font-mono",
                        isActive
                          ? "bg-white/20 text-white border-transparent"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {item.badge === "Active" ? t("common.status.active", "Active") : item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Officer Details & Logout */}
      <div className="p-3 border-t border-border space-y-2">
        {!isSidebarCollapsed && officer && (
          <div className="p-3 rounded-2xl bg-muted/50 border border-border/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("common.labels.officerInCharge", "Authorized Officer")}
              </span>
              <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                {t("common.status.active", "Active")}
              </Badge>
            </div>
            <p className="text-xs font-bold text-foreground truncate">
              {officer.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {officer.designation}
            </p>
            <p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 truncate">
              Key: {officer.officialPassKey}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors",
            isSidebarCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed && <span>{t("nav.logout", "Logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
