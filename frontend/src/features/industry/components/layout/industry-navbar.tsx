"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Building2,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Coins,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { ThemeToggle } from "@/features/shared/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { useIndustryStore } from "../../hooks/use-industry-store";
import { IndustryRole } from "../../types";
import { useTranslation } from "react-i18next";

const ROLE_OPTIONS: { role: IndustryRole; label: string; desc: string }[] = [
  { role: "csr_org", label: "CSR Organization", desc: "Section 135 CSR & Grant Allocation" },
  { role: "corporate", label: "Corporate Organization", desc: "Strategic Technology Alliances" },
  { role: "msme", label: "MSME Partner", desc: "Regional Prototype Adoption" },
  { role: "startup", label: "Startup Incubatee", desc: "Commercial Pilot & Tech Transfer" },
  { role: "innovation_partner", label: "Innovation Partner", desc: "Multi-University Consortium Lead" },
];

export function IndustryNavbar() {
  const { t } = useTranslation();
  const {
    user,
    role,
    setRole,
    organization,
    unreadNotificationsCount,
    toggleNotificationDrawer,
    setSearchModalOpen,
    setMobileSidebarOpen,
    logout,
  } = useIndustryStore();

  const formattedBudget = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(organization?.availableBudget || 45000000);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border/70 bg-card/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Global Search Trigger */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden h-10 w-10 p-0 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar Button */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/50 px-3.5 py-2 text-sm text-muted-foreground transition-all hover:border-amber-500/50 hover:bg-muted focus:outline-none w-52 sm:w-72 lg:w-96 text-left shadow-inner"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{t("industry.projects.searchProjects", "Search projects, universities, tech...")}</span>
          <kbd className="hidden sm:inline-flex ml-auto items-center rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Stats, Theme Toggle, Notification Bell, Messages, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Available Budget Capsule */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
          <Coins className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-left leading-none">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("industry.dashboard.availableCsr", "Available CSR")}</p>
            <p className="text-xs font-black">{formattedBudget}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Messages Shortcut */}
        <Button asChild variant="ghost" size="sm" className="relative h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-foreground">
          <Link href="/industry/messages" title={t("nav.help", "Direct Messages")}>
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notification Bell with Drawer Trigger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleNotificationDrawer}
          className="relative h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-foreground"
          title={t("nav.notifications", "Live Notifications")}
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          )}
        </Button>

        {/* Profile & Role Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 p-1.5 pr-3 hover:bg-muted transition-all focus:outline-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold text-sm shadow">
                {user?.name ? user.name.charAt(0) : "I"}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-foreground truncate max-w-[130px] flex items-center gap-1">
                  {user?.name || "Corporate Lead"}
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                  {user?.roleLabel || t("industry.dashboard.corporatePartner", "CSR Partner")}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl">
            <DropdownMenuLabel className="p-2">
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="success" className="mt-1 text-[10px] font-semibold">
                  {user?.organizationName}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Role Switcher Section */}
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {t("industry.dashboard.overview", "Switch Stakeholder Role")}
              </p>
              <div className="space-y-1">
                {ROLE_OPTIONS.map((item) => {
                  const isCurrent = role === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => setRole(item.role)}
                      className="w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0 pr-2">
                        <p className={isCurrent ? "font-bold text-amber-600 dark:text-amber-400" : "font-medium text-foreground"}>
                          {t(item.label, item.label)}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/industry/profile" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{t("nav.profile", "My Profile")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/industry/organization" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{t("industry.profile.title", "Organization Details")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/industry/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>{t("nav.settings", "Account Settings")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="rounded-xl text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t("common.buttons.logout", "Log Out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
