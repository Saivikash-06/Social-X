"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Building2,
  FolderKanban,
  Coins,
  LineChart,
  GraduationCap,
  Network,
  FlaskConical,
  Cpu,
  Milestone,
  Bell,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIndustryStore } from "../../hooks/use-industry-store";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { useTranslation } from "react-i18next";

export const INDUSTRY_NAV_ITEMS = [
  {
    group: "Overview",
    groupKey: "overview",
    items: [
      {
        key: "dashboard",
        title: "Industry Dashboard",
        href: "/industry/dashboard",
        icon: LayoutDashboard,
      },
      {
        key: "profile",
        title: "Organization Profile",
        href: "/industry/profile",
        icon: User,
      },
      {
        key: "organization",
        title: "Organization Details",
        href: "/industry/organization",
        icon: Building2,
      },
    ],
  },
  {
    group: "CSR & Investment",
    groupKey: "investment",
    items: [
      {
        key: "projects",
        title: "Available Projects",
        href: "/industry/projects",
        icon: FolderKanban,
      },
      {
        key: "funding",
        title: "Funding Opportunities",
        href: "/industry/funding",
        icon: Coins,
      },
      {
        key: "analytics",
        title: "CSR Analytics",
        href: "/industry/csr",
        icon: LineChart,
      },
    ],
  },
  {
    group: "Collaboration & R&D",
    groupKey: "collaboration",
    items: [
      {
        key: "mentorship",
        title: "Mentorship",
        href: "/industry/mentorship",
        icon: GraduationCap,
      },
      {
        key: "collaboration",
        title: "University Collaboration",
        href: "/industry/collaboration",
        icon: Network,
      },
      {
        key: "research",
        title: "Research Initiatives",
        href: "/industry/research",
        icon: FlaskConical,
      },
      {
        key: "prototypes",
        title: "Prototype Support",
        href: "/industry/prototypes",
        icon: Cpu,
      },
      {
        key: "tracking",
        title: "Implementation Tracking",
        href: "/industry/tracking",
        icon: Milestone,
      },
    ],
  },
  {
    group: "Communication",
    groupKey: "communication",
    items: [
      {
        key: "notifications",
        title: "Notifications",
        href: "/industry/notifications",
        icon: Bell,
        badgeKey: "notifications",
      },
      {
        key: "help",
        title: "Messages",
        href: "/industry/messages",
        icon: MessageSquare,
      },
      {
        key: "settings",
        title: "Settings",
        href: "/industry/settings",
        icon: Settings,
      },
    ],
  },
];

export function IndustrySidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    unreadNotificationsCount,
    user,
    organization,
    logout,
  } = useIndustryStore();

  const getGroupTitle = (groupKey: string, fallback: string) => {
    switch (groupKey) {
      case "overview": return t("nav.overview", fallback);
      case "investment": return t("nav.csr_investment", fallback);
      case "collaboration": return t("nav.collaboration_rd", fallback);
      case "communication": return t("nav.governance_comms", fallback);
      default: return t(groupKey, fallback);
    }
  };

  const getItemTitle = (key: string, fallback: string) => {
    switch (key) {
      case "dashboard": return t("nav.dashboard", fallback);
      case "profile": return t("nav.profile", fallback);
      case "organization": return t("common.labels.organization", fallback);
      case "projects": return t("nav.projects", fallback);
      case "funding": return t("nav.funding", fallback);
      case "analytics": return t("nav.csr_analytics", fallback);
      case "mentorship": return t("nav.mentorship", fallback);
      case "collaboration": return t("nav.university_collaboration", fallback);
      case "research": return t("nav.research", fallback);
      case "prototypes": return t("nav.prototypes", fallback);
      case "tracking": return t("industry.tracking.title", fallback);
      case "notifications": return t("nav.notifications", fallback);
      case "help": return t("nav.help", fallback);
      case "settings": return t("nav.settings", fallback);
      default: return t(key, fallback);
    }
  };

  const handleNavClick = () => {
    if (isMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border/80 bg-card/95 backdrop-blur-xl transition-all duration-300 shadow-lg",
          isSidebarCollapsed ? "w-20" : "w-72",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between px-5 border-b border-border/60">
          <Link
            href="/industry/dashboard"
            onClick={handleNavClick}
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-lg tracking-tight text-foreground truncate">
                  Social-X
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate">
                  {t("industry_portal", "Industry & CSR Portal")}
                </span>
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 rounded-xl p-0 hover:bg-muted text-muted-foreground"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Organization Status Pill (only when expanded) */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 mx-3 mt-3 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-foreground truncate">{organization?.name || t("industry.dashboard.corporatePartner", "Corporate Partner")}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.roleLabel || t("industry.profile.sector", "CSR Organization")}</p>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 shrink-0" title={t("industry.dashboard.verifiedEntity", "Verified CSR Entity")}>
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {INDUSTRY_NAV_ITEMS.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  {getGroupTitle(group.groupKey, group.group)}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/industry/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                const showBadge = item.badgeKey === "notifications" && unreadNotificationsCount > 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                    title={isSidebarCollapsed ? getItemTitle(item.key, item.title) : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-500" />
                    )}
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1">{getItemTitle(item.key, item.title)}</span>
                    )}

                    {!isSidebarCollapsed && showBadge && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] rounded-full">
                        {unreadNotificationsCount}
                      </Badge>
                    )}

                    {isSidebarCollapsed && showBadge && (
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Area with Logout */}
        <div className="p-3 border-t border-border/60">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm font-medium transition-all",
              isSidebarCollapsed ? "justify-center p-2" : "px-3 py-2.5"
            )}
            title={t("nav.logout", "Sign Out")}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>{t("nav.logout", "Sign Out")}</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
