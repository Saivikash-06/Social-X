"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  useGovernmentDistrictStats,
  useGovernmentMonthlyIssues,
  useGovernmentDepartmentMetrics,
} from "@/features/government/hooks/use-government-queries";
import { toast } from "sonner";
import { useTranslation } from "@/features/shared/i18n";

const CATEGORY_DISTRIBUTION = [
  { name: "Water Supply", value: 38, color: "#3b82f6" },
  { name: "Roads & Traffic", value: 26, color: "#8b5cf6" },
  { name: "Sanitation & Waste", value: 18, color: "#10b981" },
  { name: "Electricity", value: 12, color: "#f59e0b" },
  { name: "Environment", value: 6, color: "#ef4444" },
];

export default function GovernmentAnalyticsPage() {
  const { t } = useTranslation();
  const { data: monthlyIssues } = useGovernmentMonthlyIssues();
  const { data: districtStats } = useGovernmentDistrictStats();
  const { data: deptMetrics } = useGovernmentDepartmentMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t("government.analytics.title", "Municipal Civic Analytics & Performance Heatmaps")}
            </h1>
            <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
              {t("government.analytics.telemetry", "State-wide Telemetry")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("government.analytics.subtitle", "Statistical breakdown of resolution rates, category distributions, and district-level municipal performance.")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success(t("government.analytics.reportExported", "Analytics CSV report exported."))}
          className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{t("government.analytics.export", "Export Analytics")}</span>
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {t("government.analytics.totalGrievances", "Total Civic Grievances Logged")}
          </span>
          <div className="text-3xl font-black font-mono text-foreground">
            14,870
          </div>
          <p className="text-xs text-emerald-600 font-semibold">+18.4% {t("government.analytics.digitalAdoption", "YoY digital adoption")}</p>
        </Card>

        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {t("government.analytics.avgBenchmark", "Average Resolution Benchmark")}
          </span>
          <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            16.8 {t("common.labels.hrs", "Hours")}
          </div>
          <p className="text-xs text-muted-foreground">{t("government.analytics.statutoryTarget", "Against 24h statutory state target")}</p>
        </Card>

        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {t("government.analytics.slaCompliance", "SLA Compliance Across Wards")}
          </span>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            94.2%
          </div>
          <p className="text-xs text-muted-foreground">{t("government.analytics.statewideCompliance", "Statewide average compliance")}</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share (Pie) */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">
              {t("government.analytics.categoryDistribution", "Grievance Category Distribution")}
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              Share %
            </Badge>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* District Resolution Ratio (Bar) */}
        <Card className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">
              {t("government.analytics.districtEfficiency", "District Resolution Efficiency")}
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {t("government.analytics.totalVsResolved", "Total vs. Resolved")}
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="total" name={t("common.labels.reported", "Reported")} fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name={t("common.status.resolved", "Resolved")} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
