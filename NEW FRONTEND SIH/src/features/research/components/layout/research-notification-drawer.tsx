"use client";

import * as React from "react";
import Link from "next/link";
import { X, Check, Bell, Award, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { useResearchStore } from "../../hooks/use-research-store";
import { cn } from "@/lib/utils";

export function ResearchNotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useResearchStore();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => setNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">R&D Communications</h3>
                <p className="text-xs text-muted-foreground">Grant alerts, citations & patents</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
              >
                Mark all read
              </Button>
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

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-semibold text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground">No pending research alerts.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all space-y-2",
                    notif.read
                      ? "bg-muted/30 border-border/60"
                      : "bg-indigo-500/5 border-indigo-500/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                      <h4 className="text-xs font-bold text-foreground">{notif.title}</h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    {notif.actionUrl ? (
                      <Link
                        href={notif.actionUrl}
                        onClick={() => setNotificationDrawerOpen(false)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {notif.actionLabel || "View"} →
                      </Link>
                    ) : <span />}
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl text-xs font-bold"
              onClick={() => setNotificationDrawerOpen(false)}
            >
              <Link href="/research/notifications">View All Notification History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
