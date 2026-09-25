"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Building2,
  KeyRound,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { useGovernmentStore } from "../../hooks/use-government-store";
import { GOV_NAV_ITEMS } from "./government-sidebar";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function GovernmentNavbar({
  onOpenNotifications,
  onOpenSearch,
}: {
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { officer, logout, notificationsCount } = useGovernmentStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/official-login");
  };

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Mobile toggle + Breadcrumb / Department indicator */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-full"
          >
            <Building2 className="h-3 w-3" />
            <span>{officer?.department ? t(officer.department, officer.department) : t("government.departments.title", "Municipal Administration")}</span>
          </Badge>
          <span className="hidden md:inline-block text-xs text-muted-foreground font-semibold">
            &bull; {officer?.district || "Chennai"} {t("government.dashboard.title", "District Nodal Command")}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs text-muted-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("government.assigned.searchPlaceholder", "Search cases, officers...")}</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Panel Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNotifications}
          className="relative h-9 w-9 rounded-xl hover:bg-muted"
        >
          <Bell className="h-4 w-4 text-foreground" />
          {notificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          )}
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-xl hover:bg-muted"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
          <span className="sr-only">{t("common.labels.theme", "Toggle theme")}</span>
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-border/80 hover:border-indigo-500/40 bg-card transition-colors">
              <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {officer?.name?.charAt(0) || "O"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-foreground leading-none truncate max-w-30">
                  {officer?.name?.split(" ")[0]}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate max-w-30">
                  {officer?.role ? t(officer.role, officer.role) : t("common.roles.officer", "Officer")}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
            <DropdownMenuLabel className="space-y-1 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {officer?.name}
                </span>
                <Badge variant="outline" className="text-[9px] font-mono text-emerald-600">
                  {t("common.labels.verified", "Gov Certified")}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {officer?.email}
              </p>
              <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                <KeyRound className="h-3 w-3" />
                <span>{officer?.officialPassKey}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/government/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{t("nav.profile", "Officer Profile & Security")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/government/tracking" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>{t("government.tracking.title", "Field Fleet Telemetry")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl text-rose-600 dark:text-rose-400 cursor-pointer focus:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t("common.buttons.logout", "Logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-card border-b border-border p-4 space-y-1 shadow-xl z-50">
          {GOV_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.key, item.title)}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("common.buttons.logout", "Logout")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
