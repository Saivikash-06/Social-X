"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  Crosshair,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { LeafletMap } from "@/features/shared/components/maps/leaflet-map";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { DashboardMetrics } from "@/features/citizen/components/dashboard-metrics";
import { MyIssuesTable } from "@/features/citizen/components/my-issues-table";
import { useTranslation } from "@/features/shared/i18n";

export default function CitizenDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { useMetrics, useIssues } = useCitizenQueries();

  const { data: metrics, isLoading: isMetricsLoading } = useMetrics();
  const { data: issuesData, isLoading: isIssuesLoading } = useIssues({
    limit: 5,
  });

  const recentIssues = issuesData?.items || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t("citizen.dashboard.welcomeBack", "Welcome")}, {user?.fullName || t("citizen.portalTitle", "Citizen")}
            </h1>
            <Badge variant="success" className="text-xs">
              {t("citizen.profile.citizenBadge", "Verified Citizen")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("common.labels.ward", "Ward")} 142 &bull; {user?.district || "Bengaluru Urban"}, {user?.state || "Karnataka"}
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl gap-2 font-medium">
            <Link href="/citizen/track">
              <Crosshair className="h-4 w-4" />
              <span>{t("citizen.dashboard.trackIssues", "Track Live SLA")}</span>
            </Link>
          </Button>

          <Button asChild variant="gradient" className="rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20">
            <Link href="/citizen/report">
              <PlusCircle className="h-4 w-4" />
              <span>{t("citizen.dashboard.reportNewIssue", "Report New Issue")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <DashboardMetrics metrics={metrics} isLoading={isMetricsLoading} />

      {/* Main Grid: Active Issues + Geo-Intelligence Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Grievances */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-foreground">
                {t("citizen.dashboard.recentGrievances", "Recent Grievances")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("citizen.dashboard.recentGrievancesDesc", "Your submitted reports undergoing investigation and field resolution")}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
              <Link href="/citizen/issues" className="gap-1">
                <span>{t("common.buttons.viewAll", "View All")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <MyIssuesTable issues={recentIssues} compact />
        </div>

        {/* Right 1 Col: Neighborhood Civic Radar & Interactive Map */}
        <div className="space-y-6">
          {/* District Incident Map Preview */}
          <Card className="border-border/80 bg-card overflow-hidden shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{t("government.tracking.liveIncidentMap", "District Incident Map")}</span>
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {t("common.labels.ward", "Ward")} 142
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
              <LeafletMap
                latitude={12.9716}
                longitude={77.5946}
                zoom={13}
                interactive={false}
                markerTitle="Ward 142 Active Hotspot"
                className="h-44"
              />
            </CardContent>
          </Card>

          {/* AI Civic Insights Card */}
          <Card className="border-border/80 bg-linear-to-br from-indigo-500/5 via-primary/5 to-teal-500/5 shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>{t("ai.recommendation", "AI Governance Insight")}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("citizen.dashboard.aiInsightDemo", "Water supply complaints in Indiranagar have surged by 24% after recent pressure testing. Automated telemetry monitors dispatched.")}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-foreground border-t border-border/40">
                <span>{t("citizen.dashboard.satisfactionScore", "Resolution SLA Score")}:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  94.2% {t("common.status.completed", "on-time")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
