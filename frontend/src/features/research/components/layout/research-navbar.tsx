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
  Sparkles,
  Database,
  BookOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/features/shared/components/ui/button";
import { useResearchStore } from "../../hooks/use-research-store";
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

export function ResearchNavbar() {
  const { theme, setTheme } = useTheme();
  const {
    setMobileSidebarOpen,
    toggleNotificationDrawer,
    setSearchModalOpen,
    unreadNotificationsCount,
    user,
    institute,
    logout,
  } = useResearchStore();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-xl transition-all">
      {/* Mobile Toggle & ⌘K Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden h-10 w-10 p-0 rounded-2xl border border-border/80"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="hidden sm:flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground transition-all hover:bg-muted/70 hover:border-border w-64 md:w-80"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-left truncate">Search datasets, publications, TRL ideas...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Upload Publication */}
        <Button
          asChild
          size="sm"
          className="hidden sm:flex rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs shadow-sm shadow-indigo-600/20 font-bold"
        >
          <Link href="/research/publications">
            <PlusCircle className="h-4 w-4" />
            <span>Upload Paper / Patent</span>
          </Link>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-2xl border border-border/80 p-0 text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleNotificationDrawer}
          className="relative h-10 w-10 rounded-2xl border border-border/80 p-0 text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-muted/40 p-1.5 pr-3 hover:bg-muted/70 transition-all focus:outline-none">
              <Avatar className="h-8 w-8 rounded-xl border border-indigo-500/30">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || "Scientist"} />
                <AvatarFallback className="bg-indigo-500/10 text-indigo-600 text-xs font-bold">
                  {user?.name?.slice(0, 2).toUpperCase() || "PI"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold leading-none text-foreground truncate max-w-[120px]">
                  {user?.name || "Dr. Ramanathan"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {institute?.name || "IISc CSISC"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-xl border-border/80">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold leading-none">{user?.name}</p>
                <p className="text-[11px] leading-none text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="w-fit mt-1 text-[10px] text-indigo-600 border-indigo-500/30">
                  {institute?.accreditation || "SIRO Accredited"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/research/profile" className="flex items-center gap-2 text-xs">
                <User className="h-4 w-4" />
                <span>Institute Credentials</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/research/datasets" className="flex items-center gap-2 text-xs">
                <Database className="h-4 w-4" />
                <span>Dataset Repository</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/research/settings" className="flex items-center gap-2 text-xs">
                <Settings className="h-4 w-4" />
                <span>Settings & ORCID Sync</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
