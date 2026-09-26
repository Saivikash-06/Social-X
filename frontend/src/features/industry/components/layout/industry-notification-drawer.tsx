"use client";

import * as React from "react";
import Link from "next/link";
import { X, Bell, CheckCheck, Coins, GraduationCap, Cpu, Network, ArrowRight } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useIndustryStore } from "../../hooks/use-industry-store";
import { cn } from "@/lib/utils";

export function IndustryNotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useIndustryStore();

  if (!isNotificationDrawerOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "funding":
        return <Coins className="h-4 w-4 text-emerald-500" />;
      case "mentorship":
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case "prototype":
        return <Cpu className="h-4 w-4 text-amber-500" />;
      case "collaboration":
        return <Network className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  {unreadNotificationsCount} unread update{unreadNotificationsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadNotificationsCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsAsRead}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationDrawerOpen(false)}
                className="h-8 w-8 p-0 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
                <p className="text-sm font-semibold text-foreground">No new notifications</p>
                <p className="text-xs text-muted-foreground">You are completely up to date.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={cn(
                    "group relative p-4 rounded-2xl border transition-all cursor-pointer",
                    n.read
                      ? "border-border/60 bg-card/40 opacity-80"
                      : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-muted/60 shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-xs font-bold leading-snug", !n.read ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                        {n.actionUrl && (
                          <Link
                            href={n.actionUrl}
                            onClick={() => setNotificationDrawerOpen(false)}
                            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>{n.actionLabel || "View"}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/60 text-center">
            <Button asChild variant="outline" className="w-full rounded-xl text-xs font-semibold">
              <Link href="/industry/notifications" onClick={() => setNotificationDrawerOpen(false)}>
                View Complete Notification Center
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
