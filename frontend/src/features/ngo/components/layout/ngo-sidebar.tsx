"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MapPin,
  Users,
  LineChart,
  Network,
  FileText,
  Bell,
  MessageSquare,
  Award,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNgoStore } from "../../hooks/use-ngo-store";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { useTranslation } from "react-i18next";

export const NGO_NAV_ITEMS = [
  {
    group: "Field Operations",
    groupKey: "nav.field_activities",
    items: [
      {
        key: "ngo.dashboard.title",
        title: "NGO Dashboard",
        href: "/ngo/dashboard",
        icon: LayoutDashboard,
      },
      {
        key: "ngo.projects.title",
        title: "Available Projects",
        href: "/ngo/projects",
        icon: FolderKanban,
      },
      {
        key: "ngo.assignedProjects.title",
        title: "Assigned Projects",
        href: "/ngo/assigned-projects",
        icon: CheckSquare,
      },
      {
        key: "ngo.fieldActivities.title",
        title: "Field Activities",
        href: "/ngo/field-activities",
        icon: MapPin,
      },
    ],
  },
  {
    group: "Community & Workforce",
    groupKey: "nav.community_workforce",
    items: [
      {
        key: "ngo.volunteers.title",
        title: "Volunteer Management",
        href: "/ngo/volunteers",
        icon: Users,
      },
      {
        key: "ngo.impact.title",
        title: "Community Impact",
        href: "/ngo/impact",
        icon: LineChart,
      },
      {
        key: "ngo.collaborations.title",
        title: "Collaborations",
        href: "/ngo/collaborations",
        icon: Network,
      },
      {
        key: "ngo.certificates.title",
        title: "Certificates",
        href: "/ngo/certificates",
        icon: Award,
      },
    ],
  },
  {
    group: "Governance & Comms",
    groupKey: "nav.governance_comms",
    items: [
      {
        key: "ngo.reports.title",
        title: "Reports & Audits",
        href: "/ngo/reports",
        icon: FileText,
      },
      {
        key: "nav.notifications",
        title: "Notifications",
        href: "/ngo/notifications",
        icon: Bell,
        badgeKey: "notifications",
      },
      {
        key: "nav.help",
        title: "Messages",
        href: "/ngo/messages",
        icon: MessageSquare,
      },
      {
        key: "industry.profile.title",
        title: "Organization Profile",
        href: "/ngo/profile",
        icon: Building2,
      },
      {
        key: "ngo.settings.title",
        title: "Settings",
        href: "/ngo/settings",
        icon: Settings,
      },
    ],
  },
];

export function NgoSidebar() {
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
  } = useNgoStore();

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
            href="/ngo/dashboard"
            onClick={handleNavClick}
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-lg tracking-tight text-foreground truncate">
                  Social-X
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                  {t("ngo.portalTitle", "Civil Society & NGO")}
                </span>
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 rounded-xl p-0 hover:bg-muted text-muted-foreground"
            title={isSidebarCollapsed ? t("common.buttons.expandSidebar", "Expand Sidebar") : t("common.buttons.collapseSidebar", "Collapse Sidebar")}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Organization Status Pill (only when expanded) */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 mx-3 mt-3 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-foreground truncate">{organization?.name || t("industry.dashboard.corporatePartner", "Civil Society Partner")}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.roleLabel || t("common.labels.verified", "Executive Director")}</p>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 shrink-0" title={t("industry.dashboard.verifiedEntity", "Darpan Verified NGO")}>
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {NGO_NAV_ITEMS.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  {t(group.groupKey, group.group)}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/ngo/dashboard" && pathname.startsWith(item.href));
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
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                    title={isSidebarCollapsed ? t(item.key, item.title) : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500" />
                    )}
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1">{t(item.key, item.title)}</span>
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
            title={t("common.buttons.logout", "Log Out")}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>{t("common.buttons.logout", "Sign Out")}</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
