"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Coins,
  GraduationCap,
  Cpu,
  Network,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useNotifications } from "@/features/industry/hooks/use-industry-queries";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "All Notifications", value: "all" },
  { label: "Funding & Grants", value: "funding" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Prototypes", value: "prototype" },
  { label: "Academic Collaboration", value: "collaboration" },
];

export default function IndustryNotificationsPage() {
  const { data: notifications } = useNotifications();
  const { markNotificationAsRead, markAllNotificationsAsRead, unreadNotificationsCount } = useIndustryStore();
  const [activeTab, setActiveTab] = React.useState("all");

  const filtered = React.useMemo(() => {
    if (!notifications) return [];
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

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
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">
            Audited alerts for CSR tranche releases, prototype submissions, and university meetings.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            onClick={markAllNotificationsAsRead}
            variant="outline"
            size="sm"
            className="rounded-2xl text-xs gap-1.5 font-semibold"
          >
            <CheckCheck className="h-4 w-4 text-emerald-500" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-muted/40 border border-border/70">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === tab.value
                ? "bg-card text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-border/80 bg-card rounded-3xl p-12 text-center space-y-2">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
            <p className="text-sm font-bold text-foreground">No notifications in this filter</p>
            <p className="text-xs text-muted-foreground">You are all caught up!</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={cn(
                "border-border/80 bg-card rounded-3xl p-5 shadow-sm transition-all cursor-pointer hover:border-amber-500/50",
                !item.read && "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/60 shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm font-bold", !item.read ? "text-foreground" : "text-muted-foreground")}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
                      {!item.read && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

                  {item.actionUrl && (
                    <div className="pt-2">
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2 text-amber-600 dark:text-amber-400 font-bold gap-1 hover:underline">
                        <Link href={item.actionUrl}>
                          <span>{item.actionLabel || "Inspect Record"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
