"use client";

import * as React from "react";
import { Bell, CheckCheck, ShieldAlert, Cpu, GitFork, Server } from "lucide-react";
import { useAdminStore } from "@/features/admin/hooks/use-admin-store";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAdminStore();

  const [activeTab, setActiveTab] = React.useState<"all" | "security" | "ai" | "workflow" | "system">("all");

  const filtered = notifications.filter((n) => (activeTab === "all" ? true : n.type === activeTab));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Notification & Broadcast Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Administrative alerts, SLA violation warnings, security clearances, and system telemetry.
          </p>
        </div>
        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark All Read</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/70 w-fit">
        {(["all", "security", "ai", "workflow", "system"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground rounded-3xl">
            No notifications in this category.
          </Card>
        ) : (
          filtered.map((n) => (
            <Card
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`rounded-2xl border-border/80 p-4 transition-all cursor-pointer ${
                !n.read ? "bg-rose-500/5 border-rose-500/30" : "hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={n.severity === "critical" ? "destructive" : "info"} className="text-[10px] uppercase font-bold">
                      {n.type}
                    </Badge>
                    <h4 className="font-bold text-sm text-foreground">{n.title}</h4>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-rose-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                  {n.timestamp}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
