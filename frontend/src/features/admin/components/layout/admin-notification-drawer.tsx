"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Bell,
  CheckCheck,
  ShieldAlert,
  Cpu,
  GitFork,
  Server,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useAdminStore } from "../../hooks/use-admin-store";
import { cn } from "@/lib/utils";

export function AdminNotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAdminStore();

  const [activeTab, setActiveTab] = React.useState<"all" | "security" | "ai" | "workflow" | "system">("all");

  if (!isNotificationDrawerOpen) return null;

  const filtered = notifications.filter((n) => (activeTab === "all" ? true : n.type === activeTab));

  const getIcon = (type: string) => {
    switch (type) {
      case "security":
        return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      case "ai":
        return <Cpu className="h-4 w-4 text-purple-500" />;
      case "workflow":
        return <GitFork className="h-4 w-4 text-amber-500" />;
      default:
        return <Server className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Root Telemetry Alerts</h2>
                <p className="text-[11px] text-muted-foreground">
                  {unreadNotificationsCount} unread system notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadNotificationsCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsAsRead}
                  className="h-8 text-[11px] rounded-lg text-muted-foreground hover:text-foreground gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationDrawerOpen(false)}
                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="p-2 border-b border-border/60 flex items-center gap-1 overflow-x-auto text-xs">
            {(["all", "security", "ai", "workflow", "system"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-colors shrink-0",
                  activeTab === tab
                    ? "bg-rose-600/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">No alerts matching this filter category.</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5",
                    notif.read
                      ? "bg-muted/20 border-border/60 opacity-80"
                      : "bg-card border-border hover:border-rose-500/50 shadow-xs ring-1 ring-rose-500/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted/60 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <span className="text-xs font-bold text-foreground line-clamp-1">
                        {notif.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{notif.timestamp}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                    {notif.description}
                  </p>

                  {notif.link && (
                    <div className="pl-8 pt-1">
                      <Link
                        href={notif.link}
                        onClick={() => setNotificationDrawerOpen(false)}
                        className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <span>Investigate issue</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-border/80 bg-muted/20 text-center">
            <Link
              href="/admin/notifications"
              onClick={() => setNotificationDrawerOpen(false)}
              className="text-xs font-semibold text-foreground hover:text-rose-500 transition-colors"
            >
              Open Full Notifications & Alerts Center →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
