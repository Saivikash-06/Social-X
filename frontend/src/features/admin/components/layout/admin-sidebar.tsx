"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  FlaskConical,
  FolderGit2,
  FileCheck2,
  Cpu,
  GitFork,
  BarChart3,
  Bell,
  ScrollText,
  Sliders,
  Activity,
  Database,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "../../hooks/use-admin-store";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { useTranslation } from "react-i18next";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeKey?: string;
}

export interface AdminNavGroup {
  group: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    group: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "Access & Identity",
    items: [
      {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Role Management",
        href: "/admin/roles",
        icon: ShieldCheck,
      },
    ],
  },
  {
    group: "Stakeholder Ecosystem",
    items: [
      {
        title: "Government Management",
        href: "/admin/government",
        icon: Building2,
      },
      {
        title: "University Management",
        href: "/admin/universities",
        icon: GraduationCap,
      },
      {
        title: "Industry Management",
        href: "/admin/industry",
        icon: Briefcase,
      },
      {
        title: "NGO Management",
        href: "/admin/ngos",
        icon: HeartHandshake,
      },
      {
        title: "Research Organizations",
        href: "/admin/research",
        icon: FlaskConical,
      },
      {
        title: "Departments",
        href: "/admin/departments",
        icon: FolderGit2,
      },
    ],
  },
  {
    group: "Operations & AI",
    items: [
      {
        title: "Issue Management",
        href: "/admin/issues",
        icon: FileCheck2,
      },
      {
        title: "AI Monitoring",
        href: "/admin/ai-monitoring",
        icon: Cpu,
        badge: "Live",
      },
      {
        title: "Workflow Monitoring",
        href: "/admin/workflow-monitoring",
        icon: GitFork,
      },
    ],
  },
  {
    group: "Infra & Observability",
    items: [
      {
        title: "API Monitoring",
        href: "/admin/api-monitoring",
        icon: Activity,
      },
      {
        title: "Database Status",
        href: "/admin/database-status",
        icon: Database,
      },
      {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        icon: ScrollText,
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badgeKey: "notifications",
      },
    ],
  },
  {
    group: "Configuration",
    items: [
      {
        title: "Platform Settings",
        href: "/admin/settings",
        icon: Sliders,
      },
      {
        title: "Profile",
        href: "/admin/profile",
        icon: UserCircle2,
      },
    ],
  },
];

export function AdminSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    unreadNotificationsCount,
    maintenanceMode,
    user,
    logout,
  } = useAdminStore();

  const getGroupTitle = (group: string) => {
    switch (group) {
      case "Overview": return t("nav.overview", "Overview");
      case "Access & Identity": return t("nav.access_identity", "Access & Identity");
      case "Stakeholder Ecosystem": return t("nav.stakeholder_ecosystem", "Stakeholder Ecosystem");
      case "Operations & AI": return t("nav.operations_ai", "Operations & AI");
      case "Infra & Observability": return t("nav.infra_observability", "Infra & Observability");
      case "Configuration": return t("nav.settings", "Configuration");
      default: return group;
    }
  };

  const getNavTitle = (title: string) => {
    switch (title) {
      case "Dashboard": return t("nav.dashboard", "Dashboard");
      case "Analytics": return t("nav.analytics", "Analytics");
      case "User Management": return t("nav.user_management", "User Management");
      case "Role Management": return t("nav.role_management", "Role Management");
      case "Government Management": return t("nav.government_management", "Government Management");
      case "University Management": return t("nav.university_management", "University Management");
      case "Industry Management": return t("nav.industry_management", "Industry Management");
      case "NGO Management": return t("nav.ngo_management", "NGO Management");
      case "Research Organizations": return t("nav.research_organizations", "Research Organizations");
      case "Departments": return t("nav.departments", "Departments");
      case "Issue Management": return t("nav.issue_management", "Issue Management");
      case "AI Monitoring": return t("nav.ai_monitoring", "AI Monitoring");
      case "Workflow Monitoring": return t("nav.workflow_monitoring", "Workflow Monitoring");
      case "API Monitoring": return t("admin.systemHealth.apiGateways", "API Monitoring");
      case "Database Status": return t("admin.systemHealth.databaseReplicas", "Database Status");
      case "Audit Logs": return t("nav.audit_logs", "Audit Logs");
      case "Notifications": return t("nav.notifications", "Notifications");
      case "Platform Settings": return t("admin.settings.title", "Platform Settings");
      case "Profile": return t("nav.profile", "Profile");
      default: return t(title, title);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border/80 overflow-y-auto select-none">
      {/* Top Brand / Logo */}
      <div className="p-4 border-b border-border/80 sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 text-white shadow-md shadow-rose-900/30 shrink-0 ring-2 ring-rose-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-foreground">
                    SOCIAL-X
                  </span>
                  <Badge variant="destructive" className="px-1.5 py-0 text-[10px] font-bold uppercase rounded-md tracking-wider">
                    ROOT
                  </Badge>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t("admin_portal", "Admin Portal")}
                </span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Root System Indicator */}
        {!isSidebarCollapsed && (
          <div className="mt-3 p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground font-semibold">GRID v2.4</span>
            </div>
            {maintenanceMode ? (
              <Badge variant="warning" className="px-1.5 py-0 text-[9px] font-bold uppercase">{t("admin.systemHealth.maintenance", "MAINTENANCE")}</Badge>
            ) : (
              <Badge variant="outline" className="px-1.5 py-0 text-[9px] font-mono text-emerald-600 border-emerald-500/30">{t("admin.systemHealth.online", "ONLINE")}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-3 px-2 space-y-4">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {getGroupTitle(group.group)}
              </p>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              const hasBadge = item.badgeKey === "notifications" && unreadNotificationsCount > 0;
              const displayTitle = getNavTitle(item.title);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                    isActive
                      ? "bg-rose-600/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20 shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  title={isSidebarCollapsed ? displayTitle : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!isSidebarCollapsed && (
                    <span className="flex-1 truncate">{displayTitle}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <Badge variant="success" className="px-1.5 py-0 text-[10px] uppercase font-bold">
                      {item.badge}
                    </Badge>
                  )}
                  {!isSidebarCollapsed && hasBadge && (
                    <Badge variant="destructive" className="px-1.5 py-0 text-[10px] font-bold rounded-full">
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Root Officer User & Logout */}
      <div className="p-3 border-t border-border/80 space-y-2 bg-muted/10">
        {!isSidebarCollapsed && user && (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-border/60">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-border">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.clearanceLevel}</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className={cn(
            "w-full rounded-xl gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 justify-center",
            isSidebarCollapsed && "px-0"
          )}
          title="Sign out of root console"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed && <span>{t("nav.logout", "End Root Session")}</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-card transition-transform duration-300 shadow-2xl",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
