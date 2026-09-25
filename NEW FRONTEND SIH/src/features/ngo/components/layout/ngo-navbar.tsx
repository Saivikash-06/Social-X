"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  PlusCircle,
  User,
  Settings,
  LogOut,
  MapPin,
  Radio,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/features/shared/components/ui/button";
import { useNgoStore } from "../../hooks/use-ngo-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { useTranslation } from "react-i18next";

export function NgoNavbar() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const {
    setMobileSidebarOpen,
    toggleNotificationDrawer,
    setSearchModalOpen,
    unreadNotificationsCount,
    user,
    organization,
    logout,
  } = useNgoStore();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-xl transition-all">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden h-10 w-10 p-0 rounded-2xl border border-border/80"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* ⌘K Search trigger */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="hidden sm:flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground transition-all hover:bg-muted/70 hover:border-border w-64 md:w-80"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-left truncate">{t("common.labels.search", "Search projects, volunteers, reports...")}</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Live Feed, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Telemetry Ping */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
          <span>{t("ngo.dashboard.groundTelemetryLive", "Ground Telemetry Live")}</span>
        </div>

        {/* Quick Log Field Activity */}
        <Button
          asChild
          size="sm"
          className="hidden sm:flex rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shadow-sm shadow-emerald-600/20"
        >
          <Link href="/ngo/field-activities">
            <PlusCircle className="h-4 w-4" />
            <span>{t("ngo.dashboard.logFieldEvidence", "Log Field Evidence")}</span>
          </Link>
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-2xl border border-border/80 p-0 text-muted-foreground hover:text-foreground"
          title={t("common.labels.theme", "Toggle Theme")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications Drawer Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleNotificationDrawer}
          className="relative h-10 w-10 rounded-2xl border border-border/80 p-0 text-muted-foreground hover:text-foreground"
          title={t("nav.notifications", "Notifications")}
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/40 p-1.5 pr-3 hover:bg-muted/70 transition-all focus:outline-none">
              <Avatar className="h-8 w-8 rounded-xl border border-emerald-500/30">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || "Director"} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                  {user?.name?.slice(0, 2).toUpperCase() || "NG"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold leading-none text-foreground truncate max-w-30">
                  {user?.name || "Dr. Arundhati Roy"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-30">
                  {organization?.district || "Maharashtra"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/80">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none">{user?.name}</p>
                <p className="text-[11px] leading-none text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="w-fit mt-1 text-[10px] text-emerald-600 border-emerald-500/30">
                  Darpan: {organization?.darpanId || t("common.labels.verified", "Verified")}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/ngo/profile" className="flex items-center gap-2 text-xs">
                <User className="h-4 w-4" />
                <span>{t("industry.profile.title", "Organization Profile")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/ngo/field-activities" className="flex items-center gap-2 text-xs">
                <MapPin className="h-4 w-4" />
                <span>{t("ngo.fieldActivities.title", "Field Activity Evidence")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/ngo/settings" className="flex items-center gap-2 text-xs">
                <Settings className="h-4 w-4" />
                <span>{t("nav.settings", "Account & Security")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 flex items-center gap-2 text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("common.buttons.logout", "Sign Out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
