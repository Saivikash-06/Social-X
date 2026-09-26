"use client";

import * as React from "react";
import { AlertOctagon, RotateCcw, LayoutDashboard, ShieldAlert } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Skeleton } from "@/features/shared/components/feedback/loading-skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-border/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>

      {/* Tabs & Content Area Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-80 rounded-xl" />
        <Card className="rounded-3xl border-border/80 p-6 sm:p-8 space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
          <div className="h-64 w-full bg-muted/40 rounded-2xl flex items-center justify-center">
            <Skeleton className="h-40 w-5/6 rounded-xl" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export interface DashboardErrorProps {
  title?: string;
  message?: string;
  error?: Error | null;
  reset?: () => void;
}

export function DashboardError({
  title = "System Telemetry Temporarily Unavailable",
  message = "Failed to synchronize central system telemetry and dashboard metrics. You can retry the connection or view cached administrative data.",
  reset,
}: DashboardErrorProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-destructive/30 bg-destructive/5 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <CardContent className="space-y-4 p-0">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {reset && (
              <Button onClick={reset} variant="default" className="rounded-xl gap-2 font-semibold">
                <RotateCcw className="h-4 w-4" />
                Retry Telemetry Sync
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="rounded-xl gap-2 text-xs"
            >
              <LayoutDashboard className="h-4 w-4" />
              Reload Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
