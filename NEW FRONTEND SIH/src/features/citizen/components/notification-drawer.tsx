"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCitizenStore } from "../hooks/use-citizen-store";
import { useCitizenQueries } from "../hooks/use-citizen-queries";
import { useWebSocketNotifications } from "../hooks/use-websocket-notifications";

export function NotificationDrawer() {
  const { isNotificationDrawerOpen, setNotificationDrawerOpen } =
    useCitizenStore();
  const { useNotifications } = useCitizenQueries();
  const { data: notifications = [] } = useNotifications();
  const { isConnected } = useWebSocketNotifications();

  const [localNotifications, setLocalNotifications] = React.useState(notifications);

  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  if (!isNotificationDrawerOpen) return null;

  const markAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  };

  const markSingleRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationDrawerOpen(false)}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                    {unreadCount} new
                  </Badge>
                )}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  )}
                />
                <span>{isConnected ? "Realtime WebSocket Connected" : "Local Sync Active"}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setNotificationDrawerOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-2.5 text-xs text-muted-foreground bg-muted/20">
          <span>Recent Activity & Updates</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-primary font-semibold hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {localNotifications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <Bell className="h-10 w-10 stroke-[1.5] mb-2 opacity-40" />
              <p className="font-semibold text-sm">No Notifications</p>
              <p className="text-xs">You're completely up to date.</p>
            </div>
          ) : (
            localNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markSingleRead(n.id)}
                className={cn(
                  "cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative",
                  n.read
                    ? "border-border/50 bg-background/50 text-muted-foreground"
                    : "border-primary/30 bg-primary/5 text-foreground shadow-2xs"
                )}
              >
                {!n.read && (
                  <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                )}
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-bold leading-tight">{n.title}</h4>
                  <p className="text-xs leading-relaxed opacity-90">{n.message}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{n.createdAt}</span>
                  </div>
                  {n.issueId && (
                    <Link
                      href={`/citizen/track`}
                      onClick={() => setNotificationDrawerOpen(false)}
                      className="flex items-center gap-1 text-primary font-semibold hover:underline"
                    >
                      <span>Track {n.issueId}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/80 p-4">
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link
              href="/citizen/notifications"
              onClick={() => setNotificationDrawerOpen(false)}
            >
              View All Notification History
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
