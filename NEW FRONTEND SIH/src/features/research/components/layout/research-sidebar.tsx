"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Lightbulb,
  BookOpen,
  Database,
  Network,
  Building,
  GraduationCap,
  FileText,
  Bell,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FlaskConical,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResearchStore } from "../../hooks/use-research-store";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";

export const RESEARCH_NAV_ITEMS = [
  {
    group: "Research & Innovation",
    items: [
      {
        title: "Research Dashboard",
        href: "/research/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Research Projects",
        href: "/research/projects",
        icon: FolderKanban,
      },
      {
        title: "Innovation Lab (TRL)",
        href: "/research/innovation",
        icon: Lightbulb,
      },
      {
        title: "Publications & Patents",
        href: "/research/publications",
        icon: BookOpen,
      },
      {
        title: "Dataset Library",
        href: "/research/datasets",
        icon: Database,
      },
    ],
  },
  {
    group: "Alliances & RFPs",
    items: [
      {
        title: "Consortium Collaboration",
        href: "/research/collaborations",
        icon: Network,
      },
      {
        title: "Government Requests",
        href: "/research/government-requests",
        icon: Building,
      },
      {
        title: "University Partnerships",
        href: "/research/partnerships",
        icon: GraduationCap,
      },
    ],
  },
  {
    group: "Governance & Output",
    items: [
      {
        title: "Grant Reports & Audits",
        href: "/research/reports",
        icon: FileText,
      },
      {
        title: "Notifications",
        href: "/research/notifications",
        icon: Bell,
        badgeKey: "notifications",
      },
      {
        title: "Institute Profile",
        href: "/research/profile",
        icon: Building2,
      },
      {
        title: "Settings",
        href: "/research/settings",
        icon: Settings,
      },
    ],
  },
];

export function ResearchSidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    unreadNotificationsCount,
    user,
    institute,
    logout,
  } = useResearchStore();

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

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border/80 bg-card/95 backdrop-blur-xl transition-all duration-300 shadow-lg",
          isSidebarCollapsed ? "w-20" : "w-72",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Branding */}
        <div className="flex h-20 items-center justify-between px-5 border-b border-border/60">
          <Link
            href="/research/dashboard"
            onClick={handleNavClick}
            className="flex items-center gap-3 overflow-hidden focus:outline-none"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-md shadow-indigo-500/20">
              <FlaskConical className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-lg tracking-tight text-foreground truncate">
                  Social-X
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                  Research & Innovation
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

        {/* Status Pill */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 mx-3 mt-3 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-foreground truncate">{institute?.name || "R&D Institute"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.roleLabel || "Principal Investigator"}</p>
            </div>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400 shrink-0" title="SIRO Recognized">
              <Award className="h-4 w-4" />
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {RESEARCH_NAV_ITEMS.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/research/dashboard" && pathname.startsWith(item.href));
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
                        ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                    title={isSidebarCollapsed ? item.title : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500" />
                    )}
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1">{item.title}</span>
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

        {/* Footer */}
        <div className="p-3 border-t border-border/60">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm font-medium transition-all",
              isSidebarCollapsed ? "justify-center p-2" : "px-3 py-2.5"
            )}
            title="Log Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
