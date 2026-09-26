'use client';

import * as React from "react";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { DashboardMetrics as DashboardMetricsType } from "../types";
import { useTranslation } from "@/features/shared/i18n";

export function DashboardMetrics({
  metrics,
  isLoading = false,
}: {
  metrics?: DashboardMetricsType;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("citizen.dashboard.totalReported", "Total Reported"),
      value: metrics?.totalReported ?? 12,
      subtitle: t("citizen.dashboard.this_month", "+2 this month"),
      icon: FolderKanban,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: t("citizen.dashboard.inProgress", "In Resolution"),
      value: metrics?.inProgress ?? 4,
      subtitle: t("citizen.dashboard.active_field_work", "Active field work"),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: t("citizen.dashboard.resolved", "Verified Resolved"),
      value: metrics?.resolved ?? 7,
      subtitle: t("citizen.dashboard.verified_proof", "100% verified proof"),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: t("citizen.dashboard.communityImpact", "Societal Impact Score"),
      value: `${metrics?.communityImpactScore ?? 88}/100`,
      subtitle: t("citizen.dashboard.top_civic_contributor", "Top 5% Civic Contributor"),
      icon: TrendingUp,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="border-border/80 bg-card hover:border-primary/40 transition-all duration-200 shadow-xs"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-3xl font-black tracking-tight text-foreground">
                  {isLoading ? "..." : item.value}
                </span>
                <p className="text-xs text-muted-foreground font-medium">
                  {item.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
