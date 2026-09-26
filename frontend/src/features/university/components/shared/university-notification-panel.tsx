"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Sparkles,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useUniversityStore, UniversityNotification } from "@/features/university/hooks/use-university-store";

export function UniversityNotificationPanel() {
  const {
    isNotificationPanelOpen,
    setNotificationPanelOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useUniversityStore();

  const [activeFilter, setActiveFilter] = React.useState<"all" | "unread">("all");

  const filtered = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "government_assignment":
        return <Building2 className="h-4 w-4 text-blue-500" />;
      case "faculty_approval":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "project_accepted":
        return <Sparkles className="h-4 w-4 text-indigo-500" />;
      case "deadline_reminder":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "research_review":
        return <BookOpen className="h-4 w-4 text-cyan-500" />;
      case "certificate_issued":
        return <Award className="h-4 w-4 text-purple-500" />;
      case "credit_updated":
        return <TrendingUp className="h-4 w-4 text-teal-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isNotificationPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationPanelOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    Realtime Notifications
                    {unreadNotificationsCount > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">Civic & institutional alerts</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotificationPanelOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs & Quick Actions */}
            <div className="px-5 py-3 border-b border-border/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/60">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeFilter === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("unread")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeFilter === "unread" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Unread ({unreadNotificationsCount})
                </button>
              </div>

              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-border/40">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground space-y-2">
                  <Bell className="h-8 w-8 mx-auto opacity-30" />
                  <p className="text-xs">No notifications to display.</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`pt-3 first:pt-0 group relative p-3 rounded-xl transition-all cursor-pointer ${
                      item.read
                        ? "hover:bg-muted/40 opacity-80"
                        : "bg-primary/5 border border-primary/20 hover:border-primary/40 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border shadow-xs mt-0.5">
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-foreground line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {item.createdAt}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono capitalize">
                            {item.type.replace("_", " ")}
                          </Badge>

                          {item.link && (
                            <Link
                              href={item.link}
                              onClick={() => setNotificationPanelOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                            >
                              <span>View</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground">
              Realtime live alerts from Karnataka Municipal Innovation Cell & Faculty Board
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
