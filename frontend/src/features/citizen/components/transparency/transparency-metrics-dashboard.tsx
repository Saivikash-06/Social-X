"use client";

import * as React from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  ShieldCheck,
  Building2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { TransparencyMetrics } from "../../types";

interface TransparencyMetricsDashboardProps {
  metrics: TransparencyMetrics;
  isLoading?: boolean;
}

export function TransparencyMetricsDashboard({
  metrics,
  isLoading = false,
}: TransparencyMetricsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const spentPercentage =
    metrics.totalBudgetAllocated > 0
      ? Math.min(100, Math.round((metrics.totalExpenditure / metrics.totalBudgetAllocated) * 100))
      : 0;

  return (
    <div className="space-y-4">
      {/* Top Banner with System vs Real Monitoring Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              Citizen Public Accountability & Oversight Desk
              <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Live Audit Active
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time public record of problem handoffs, verified budgets, and active government monitoring inspections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50">
          <Activity className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
          <span>Last System Sync:</span>
          <span className="font-semibold text-foreground">
            {new Date(metrics.lastSystemUpdateTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reported Problems */}
        <Card className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Grievances
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {isLoading ? "..." : metrics.totalProblems}
              </span>
              <span className="text-xs text-muted-foreground">in civic registry</span>
            </div>

            {/* Micro Breakdown */}
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Underway: {metrics.inResolution}</span>
              <span>Closed: {metrics.completedAndVerified}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Awaiting Acceptance */}
        <Card className="rounded-2xl border-border/80 shadow-xs hover:border-amber-500/40 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Awaiting Acceptance
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {isLoading ? "..." : metrics.awaitingAcceptance}
              </span>
              <span className="text-xs text-muted-foreground">stakeholder review</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Handoff Pending</span>
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 py-0 h-4">
                SLA Guarded
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: In Active Resolution */}
        <Card className="rounded-2xl border-border/80 shadow-xs hover:border-indigo-500/40 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                In Active Resolution
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {isLoading ? "..." : metrics.inResolution}
              </span>
              <span className="text-xs text-muted-foreground">field teams engaged</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Gov & Partners</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Domain Experts</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Verified & Completed */}
        <Card className="rounded-2xl border-border/80 shadow-xs hover:border-emerald-500/40 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Citizen Verified
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {isLoading ? "..." : metrics.completedAndVerified}
              </span>
              <span className="text-xs text-muted-foreground">publicly signed-off</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Quality Audited</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Transparent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Financial Accountability & Government Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Financial Transparency Summary Card */}
        <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
          <div className="p-5 bg-linear-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Budget Allocation & Expenditure Transparency
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Track approved public & CSR funding versus actual recorded expenses
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold bg-background text-blue-600 border-blue-200 dark:border-blue-900">
              {spentPercentage}% Utilized
            </Badge>
          </div>

          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Allocated Budget
                </span>
                <span className="text-base font-black text-foreground mt-0.5 block">
                  {formatCurrency(metrics.totalBudgetAllocated)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                  Actual Spent
                </span>
                <span className="text-base font-black text-blue-700 dark:text-blue-300 mt-0.5 block">
                  {formatCurrency(metrics.totalExpenditure)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  Remaining Balance
                </span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  {formatCurrency(metrics.remainingBalance)}
                </span>
              </div>
            </div>

            {/* Visual Budget Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Expenditure Progress</span>
                <span className="text-foreground font-semibold">
                  {formatCurrency(metrics.totalExpenditure)} of {formatCurrency(metrics.totalBudgetAllocated)}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden p-0.5 border border-border/40">
                <div
                  className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${spentPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic text-right">
                * Itemized receipts and audit vouchers available in individual reports.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continuous Government Monitoring Card */}
        <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
          <div className="p-5 bg-linear-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Continuous Government Monitoring
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Official inspections and corrective action enforcement
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold bg-background text-emerald-600 border-emerald-200 dark:border-emerald-900">
              {metrics.totalMonitoringVisits} Inspections
            </Badge>
          </div>

          <CardContent className="p-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Latest Recorded Inspection
                </span>
                {metrics.latestMonitoringTimestamp ? (
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {new Date(metrics.latestMonitoringTimestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {new Date(metrics.latestMonitoringTimestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground italic">
                    Not yet monitored
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Active Directives
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    {metrics.activeCorrectiveActions}
                  </span>
                  <span className="text-[11px] text-muted-foreground">orders tracked</span>
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  Compliance enforced
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px]">
                  Government vigilance teams conduct scheduled field audits.
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Audited
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
