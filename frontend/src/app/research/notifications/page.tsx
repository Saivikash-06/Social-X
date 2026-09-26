"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import { Card } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useResearchStore } from "@/features/research/hooks/use-research-store";

export default function ResearchNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useResearchStore();

  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const filtered = notifications.filter(
    (n) => categoryFilter === "all" || n.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>Research Communications & Alerts</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Citation alerts, patent grant updates, and municipal RFP submission notifications
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsAsRead}
          className="rounded-2xl text-xs gap-1.5"
        >
          <Check className="h-4 w-4" />
          <span>Mark All as Read</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "patent", "grant", "publication", "collaboration"].map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-2xl text-xs font-semibold capitalize ${
              categoryFilter === cat ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""
            }`}
          >
            {cat === "all" ? "All Alerts" : cat}
          </Button>
        ))}
      </div>

      <Card className="rounded-3xl border-border/80 bg-card p-4 space-y-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              notif.read ? "bg-muted/20 border-border/60" : "bg-indigo-500/5 border-indigo-500/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={notif.read ? "outline" : "default"} className="text-[10px] capitalize">
                  {notif.category}
                </Badge>
                <h3 className="text-xs font-bold text-foreground">{notif.title}</h3>
                <span className="text-[11px] text-muted-foreground">• {notif.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {notif.actionUrl && (
                <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8">
                  <Link href={notif.actionUrl}>{notif.actionLabel || "View"}</Link>
                </Button>
              )}
              {!notif.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markNotificationAsRead(notif.id)}
                  className="rounded-xl text-xs h-8 text-indigo-600"
                >
                  Mark Read
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
