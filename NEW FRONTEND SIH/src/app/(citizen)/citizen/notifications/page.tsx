"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Radio,
  Filter,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { useWebSocketNotifications } from "@/features/citizen/hooks/use-websocket-notifications";
import { cn } from "@/lib/utils";
import { NotificationItem } from "@/features/citizen/types";
import { toast } from "sonner";

const EMPTY_NOTIFICATIONS: NotificationItem[] = [];

export default function NotificationsPage() {
  const { useNotifications } = useCitizenQueries();
  const { data: initialNotifications = EMPTY_NOTIFICATIONS, isLoading } = useNotifications();
  const { isConnected } = useWebSocketNotifications();

  const [readIds, setReadIds] = React.useState<Set<string>>(() => new Set());
  const [allMarkedRead, setAllMarkedRead] = React.useState(false);
  const [isCleared, setIsCleared] = React.useState(false);
  const [filterType, setFilterType] = React.useState<string>("all");

  const notifications = React.useMemo(() => {
    if (isCleared) return [];
    return (initialNotifications || []).map((n) => ({
      ...n,
      read: allMarkedRead || readIds.has(n.id) || !!n.read,
    }));
  }, [initialNotifications, readIds, allMarkedRead, isCleared]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setAllMarkedRead(true);
    toast.success("All notifications marked as read");
  };

  const markSingleRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const clearHistory = () => {
    setIsCleared(true);
    toast.info("Notification history cleared");
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "unread") return !n.read;
    if (filterType === "status_update") return n.type === "status_update";
    if (filterType === "assignment") return n.type === "assignment";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Notifications & Civic Alerts
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )}
            />
            <span>
              {isConnected
                ? "Native WebSocket Mesh Live (Real-Time Push Active)"
                : "Real-Time Polling Synchronized"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="rounded-xl text-xs"
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="rounded-xl text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "unread", "status_update", "assignment"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterType === tab
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-dashed border-border/80 p-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
            <h3 className="font-bold text-foreground text-sm">No Notifications</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You are caught up with all department updates and civic alerts.
            </p>
          </Card>
        ) : (
          filtered.map((n) => (
            <Card
              key={n.id}
              onClick={() => markSingleRead(n.id)}
              className={cn(
                "cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs hover:border-primary/40",
                n.read
                  ? "border-border/60 bg-card/60"
                  : "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
              )}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold",
                    n.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground shadow-sm"
                  )}
                >
                  <Bell className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-foreground leading-tight">
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {n.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>

                  {n.issueId && (
                    <div className="pt-2">
                      <Link
                        href="/citizen/track"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Open Live Tracker ({n.issueId})</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
