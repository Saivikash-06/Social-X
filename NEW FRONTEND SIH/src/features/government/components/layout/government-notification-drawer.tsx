"use client";

import * as React from "react";
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useGovernmentStore } from "../../hooks/use-government-store";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "emergency" | "sla_warning" | "citizen_escalation" | "resolution";
  title: string;
  message: string;
  time: string;
  caseId: string;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "emergency",
    title: "Class-1 Infrastructure Emergency",
    message: "Major water conduit ruptured on Anna Salai. Immediate dewatering and pipe replacement required.",
    time: "10 mins ago",
    caseId: "TN-CIVIC-9021",
    read: false,
  },
  {
    id: "notif-2",
    type: "sla_warning",
    title: "SLA Expiry Approaching (< 2 Hours)",
    message: "11kV HT Power Line dangling in South Veli Street Madurai reaches critical SLA deadline at 11:00 AM.",
    time: "25 mins ago",
    caseId: "TN-CIVIC-8974",
    read: false,
  },
  {
    id: "notif-3",
    type: "citizen_escalation",
    title: "Direct Collector Escalation Logged",
    message: "Chemical effluent discharge in Adyar canal escalated by Ward 152 civic committee.",
    time: "1 hour ago",
    caseId: "TN-CIVIC-8490",
    read: false,
  },
  {
    id: "notif-4",
    type: "resolution",
    title: "Health Sanitation Milestone Confirmed",
    message: "Sewage overflow near K.K. Nagar PHC successfully de-clogged and sanitized.",
    time: "2 hours ago",
    caseId: "TN-CIVIC-8612",
    read: true,
  },
];

export function GovernmentNotificationDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = React.useState(SAMPLE_NOTIFICATIONS);
  const { decrementNotifications } = useGovernmentStore();

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    decrementNotifications();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-foreground">
              Municipal Alert Center
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-lg"
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => {
            const isEmergency = n.type === "emergency" || n.type === "citizen_escalation";
            return (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.read
                    ? "bg-muted/20 border-border/60 opacity-80"
                    : "bg-card border-indigo-500/30 shadow-sm ring-1 ring-indigo-500/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isEmergency ? (
                      <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-foreground">
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                    {n.time}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {n.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    #{n.caseId}
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1 rounded-lg"
                  >
                    <Link href={`/government/assigned`} onClick={onClose}>
                      <span>Inspect Case</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
