'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Users,
  Check,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';

export default function FacultyNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useUniversityStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="h-7 w-7 text-primary" />
            Faculty Notifications & Advisories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Milestone alert dispatches, student lab submissions, and municipal grant communications
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="gap-1.5 text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs divide-y divide-border/80">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`flex items-start justify-between gap-4 p-5 transition-colors cursor-pointer ${
              !n.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/30'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  n.type === 'milestone_completed'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : n.type === 'proposal_adopted'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                {n.type === 'milestone_completed' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : n.type === 'proposal_adopted' ? (
                  <FileCheck2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
                <span className="mt-2 block text-[10px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {n.link && (
              <Button asChild variant="ghost" size="sm" className="shrink-0 text-xs">
                <Link href={n.link}>View</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
