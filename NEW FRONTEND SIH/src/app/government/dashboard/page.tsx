"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Timer,
  TrendingUp,
  Smile,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
  RefreshCw,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { useGovernmentStore } from "@/features/government/hooks/use-government-store";
import {
  useGovernmentDashboardStats,
  useGovernmentCases,
  useGovernmentMonthlyIssues,
  useGovernmentResolutionTrends,
  useGovernmentDistrictStats,
  useGovernmentDepartmentMetrics,
} from "@/features/government/hooks/use-government-queries";
import { IssueDetailsModal } from "@/features/government/components/cases/issue-details-modal";
import { GovernmentCase } from "@/features/government/types";
import { useTranslation } from "react-i18next";

export default function GovernmentDashboardPage() {
  const { t } = useTranslation();
  const { officer } = useGovernmentStore();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } =
    useGovernmentDashboardStats();
  const { data: cases, isLoading: casesLoading } = useGovernmentCases();
  const { data: monthlyIssues } = useGovernmentMonthlyIssues();
  const { data: resolutionTrends } = useGovernmentResolutionTrends();
  const { data: districtStats } = useGovernmentDistrictStats();
  const { data: deptMetrics } = useGovernmentDepartmentMetrics();

  // Selected Case Modal State
  const [selectedCase, setSelectedCase] = React.useState<GovernmentCase | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [docketFilter, setDocketFilter] = React.useState<"new" | "emergency" | "all">("new");

  const displayCases = React.useMemo(() => {
    const list = cases || [];
    if (docketFilter === "new") {
      const newItems = list.filter(
        (c) =>
          (c.status as string) === "submitted" ||
          (c.status as string) === "under_review" ||
          (c.status as string) === "new" ||
          c.status === "assigned"
      );
      return newItems.length > 0 ? newItems.slice(0, 6) : list.slice(0, 6);
    }
    if (docketFilter === "emergency") {
      return list.filter((c) => c.priority === "critical" || c.priority === "high").slice(0, 6);
    }
    return list.slice(0, 6);
  }, [cases, docketFilter]);

  return (
    <div className="space-y-6">
      {/* Officer Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-white/10 text-indigo-200 border-white/20 text-[10px] uppercase font-mono">
              {t("government.portalTitle", "Municipal Command & Control")}
            </Badge>
            <span className="text-xs text-indigo-300 font-mono">
              {t("government.dashboard.title", "Node")}: {officer?.officialPassKey}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t("welcome_back", "Greetings")}, {officer?.name}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            {officer?.designation} &bull; {officer?.department}. {t("government.tracking.subtitle", "Real-time civic telemetry and automated dispatch stream is active.")}
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchStats()}
            className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white gap-2 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t("common.buttons.syncTelemetry", "Sync Telemetry")}</span>
          </Button>
          <Button
            asChild
            className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white gap-2 text-xs font-bold shadow-lg shadow-indigo-500/30"
          >
            <Link href="/government/assigned">
              <span>{t("government.assigned.allCases", "View All Cases")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 8 Metric Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {/* Total Assigned Cases */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-indigo-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("common.labels.assigned", "Assigned")}
            </span>
            <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {stats?.totalAssignedCases ?? 5}
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.total", "Total In Docket")}</p>
        </Card>

        {/* Resolved */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-emerald-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("common.labels.resolved", "Resolved")}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats?.resolvedCases ?? 1}
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.completed", "Completed Work")}</p>
        </Card>

        {/* Pending */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-amber-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("common.labels.pending", "Pending")}
            </span>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {stats?.pendingCases ?? 4}
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.pending", "Awaiting Closure")}</p>
        </Card>

        {/* High Priority */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-orange-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("common.labels.high", "High Priority")}
            </span>
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
            {stats?.highPriorityCases ?? 2}
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.high", "Urgent SLA")}</p>
        </Card>

        {/* Emergency Cases */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-rose-500/50 transition-colors shadow-sm bg-rose-500/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
              {t("common.labels.emergency", "Emergency")}
            </span>
            <Flame className="h-4 w-4 text-rose-600 dark:text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {stats?.emergencyCases ?? 3}
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.critical", "Class-1 Hazard")}</p>
        </Card>

        {/* Average Resolution Time */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-blue-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("government.assigned.targetResolution", "Avg Time")}
            </span>
            <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {stats?.averageResolutionHours ?? 16.8}h
          </div>
          <p className="text-[10px] text-muted-foreground">{t("government.settings.slaThresholds", "Target < 24h")}</p>
        </Card>

        {/* Department Performance */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-purple-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("government.departments.efficiencyRating", "Performance")}
            </span>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            {stats?.departmentPerformanceRate ?? 94.2}%
          </div>
          <p className="text-[10px] text-muted-foreground">{t("government.departments.slaCompliance", "SLA Adherence")}</p>
        </Card>

        {/* Citizen Satisfaction */}
        <Card className="rounded-2xl border-border/80 p-3.5 space-y-1 hover:border-teal-500/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("ngo.impact.satisfactionIndex", "Satisfaction")}
            </span>
            <Smile className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
            {stats?.citizenSatisfactionScore ?? 4.8}/5
          </div>
          <p className="text-[10px] text-muted-foreground">{t("common.labels.verified", "Verified Reviews")}</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Issues (Bar Chart) */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {t("government.reports.title", "Monthly Issues Volume & Closures")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("government.reports.exportAnalytics", "Incoming grievances vs. successful department resolutions")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              FY 2026-27
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIssues || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="received" name={t("government.assigned.title", "Grievances Received")} fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name={t("common.labels.resolved", "Resolved by Line Dept")} fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Resolution Trend (Area Chart) */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {t("government.reports.quarterlyPerformance", "Resolution Speed Trend (Hours)")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("government.reports.monthlyAudit", "Weekly turnaround time compared to 24-hour statutory SLA target")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-emerald-600">
              {t("government.assigned.targetResolution", "Target: 24h")}
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolutionTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvgHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area
                  type="monotone"
                  dataKey="avgHours"
                  name={t("government.assigned.targetResolution", "Actual Turnaround (Hrs)")}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAvgHours)"
                />
                <Line
                  type="monotone"
                  dataKey="targetHours"
                  name={t("government.settings.slaThresholds", "Mandated SLA Target (24h)")}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: District-wise Issues */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {t("government.tracking.liveIncidentMap", "District-wise Civic Influx")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("government.tracking.subtitle", "Active municipal grievances distributed across top administrative zones")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {t("common.labels.district", "Top 6 Districts")}
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" name={t("common.labels.total", "Total Reported")} fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="critical" name={t("common.labels.critical", "Critical Emergencies")} fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Department Performance (Horizontal Progress Metrics) */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {t("government.departments.slaCompliance", "Department Performance & SLA Adherence")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("government.departments.title", "Compliance ratings across municipal line departments")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-indigo-600">
              {t("government.departments.slaCompliance", "Real-time SLA")}
            </Badge>
          </div>

          <div className="space-y-3 pt-2">
            {(deptMetrics || []).map((dept) => (
              <div key={dept.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate max-w-[200px]">
                    {t(dept.department, dept.department)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {dept.activeCases} {t("common.status.inProgress", "open")}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {dept.slaRate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${dept.slaRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Immediate Attention / High Priority Cases */}
      <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>{t("government.assigned.title", "Grievance Influx & Action Queue")}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {t("government.tracking.subtitle", "Live automated feed of citizen submissions routed to municipal departments")}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setDocketFilter("new")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  docketFilter === "new"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("government.assigned.allCases", "Incoming & New")}
              </button>
              <button
                type="button"
                onClick={() => setDocketFilter("emergency")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  docketFilter === "emergency"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("common.labels.emergency", "Emergency / Critical")}
              </button>
              <button
                type="button"
                onClick={() => setDocketFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  docketFilter === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("common.labels.all", "All Docket")}
              </button>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 gap-1"
            >
              <Link href="/government/assigned">
                <span>{t("common.buttons.viewAll", "Open Directory")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="p-3">{t("government.assigned.caseId", "Case ID")}</th>
                <th className="p-3">{t("common.labels.title", "Title")}</th>
                <th className="p-3">{t("common.labels.category", "Category")}</th>
                <th className="p-3">{t("common.labels.priority", "Priority")}</th>
                <th className="p-3">{t("common.labels.location", "Location")}</th>
                <th className="p-3">{t("common.labels.status", "Status")}</th>
                <th className="p-3 text-right">{t("common.labels.action", "Action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {displayCases.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    #{c.id}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-foreground line-clamp-1 max-w-xs">
                      {c.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {t("common.labels.ward", "Ward")} {c.wardNo} &bull; {c.citizenName}
                    </p>
                  </td>
                  <td className="p-3 text-muted-foreground font-medium">
                    {t(c.category, c.category)}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={c.priority === "critical" ? "destructive" : "warning"}
                      className="text-[10px]"
                    >
                      {t(c.priority, c.priority)}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground truncate max-w-[140px]">
                    {c.location}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {t(c.status, c.status.replace("_", " "))}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedCase(c);
                          setIsModalOpen(true);
                        }}
                        className="h-7 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {t("government.assigned.viewCase", "Review Case")}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-lg text-xs font-semibold"
                      >
                        <Link href={`/government/tracking?caseId=${c.id}`}>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Case Details Modal */}
      <IssueDetailsModal
        caseData={selectedCase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
