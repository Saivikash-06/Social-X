"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { ThemeToggle } from "@/features/shared/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { Breadcrumb, BreadcrumbItem } from "@/features/shared/components/layout/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { useCitizenStore } from "../hooks/use-citizen-store";
import { useCitizenQueries } from "../hooks/use-citizen-queries";
import { useTranslation } from "react-i18next";

export function CitizenNavbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { toggleMobileSidebar, toggleNotificationDrawer, isSidebarCollapsed } =
    useCitizenStore();
  const { useNotifications } = useCitizenQueries();
  const { data: notifications = [] } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Generate dynamic breadcrumbs based on pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return [{ label: t("nav.dashboard", "Dashboard") }];

    const breadcrumbs: BreadcrumbItem[] = [];
    if (segments[1] === "transparency") {
      breadcrumbs.push({ label: t("nav.transparency", "Transparency & Accountability"), href: "/citizen/transparency" });
      if (segments[2]) {
        breadcrumbs.push({ label: segments[2] });
      }
    } else if (segments[1] === "report") {
      breadcrumbs.push({ label: t("nav.report_problem", "Report Issue") });
    } else if (segments[1] === "issues") {
      breadcrumbs.push({ label: t("nav.my_issues", "My Issues"), href: "/citizen/issues" });
      if (segments[2]) {
        breadcrumbs.push({ label: segments[2] });
      }
    } else if (segments[1] === "track") {
      breadcrumbs.push({ label: t("nav.track_issues", "Track Issues") });
    } else if (segments[1] === "notifications") {
      breadcrumbs.push({ label: t("nav.notifications", "Notifications") });
    } else if (segments[1] === "profile") {
      breadcrumbs.push({ label: t("nav.profile", "Profile") });
    } else if (segments[1] === "settings") {
      breadcrumbs.push({ label: t("nav.settings", "Settings") });
    } else if (segments[1] === "help") {
      breadcrumbs.push({ label: t("nav.help", "Help & Support") });
    }
    return breadcrumbs;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Hamburger (mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={toggleMobileSidebar}
          aria-label={t("common.buttons.toggleMenu", "Open sidebar")}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Report Button */}
        <Button
          asChild
          size="sm"
          variant="gradient"
          className="hidden sm:flex rounded-xl gap-1.5 shadow-xs font-semibold"
        >
          <Link href="/citizen/report">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("nav.report_problem", "Report Issue")}</span>
          </Link>
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell with Unread Badge */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl text-muted-foreground hover:text-foreground"
          onClick={toggleNotificationDrawer}
          aria-label={t("nav.notifications", "Open notifications")}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl p-1 sm:px-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-xs">
                {user?.fullName?.slice(0, 2).toUpperCase() || "CZ"}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-foreground">
                {user?.fullName?.split(" ")[0] || t("common.roles.citizen", "Citizen")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.fullName || t("common.roles.citizen", "Citizen")}</p>
                <p className="text-xs text-muted-foreground leading-none truncate">
                  {user?.email || "citizen@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/citizen/profile" className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                <span>{t("nav.profile", "My Profile")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/citizen/settings" className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                <span>{t("nav.settings", "Account Settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/citizen/help" className="cursor-pointer gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>{t("nav.help", "Help & FAQs")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("common.buttons.logout", "Log out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
