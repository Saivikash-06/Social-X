"use client";

import * as React from "react";
import {
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  IndianRupee,
  Activity,
  FileCheck,
  User,
  Sparkles,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { TransparencyProblemSummary } from "../../types";

interface TransparencyProblemCardProps {
  problem: TransparencyProblemSummary;
  onOpenReport: (problemId: string) => void;
}

const WORKFLOW_STAGES = [
  { index: 1, label: "Submitted" },
  { index: 2, label: "Verified" },
  { index: 3, label: "Assigned" },
  { index: 4, label: "Accepted" },
  { index: 5, label: "In Progress" },
  { index: 6, label: "Completed" },
  { index: 7, label: "Citizen Verification" },
  { index: 8, label: "Closed" },
];

export function TransparencyProblemCard({
  problem,
  onOpenReport,
}: TransparencyProblemCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes("CLOSED") || s.includes("RESOLVED")) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
    if (s.includes("PROGRESS") || s.includes("ACCEPTED")) {
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    }
    if (s.includes("SUBMITTED") || s.includes("ASSIGNED") || s.includes("REVIEW")) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
    return "bg-muted text-muted-foreground";
  };

  const currentStageIdx = problem.stageIndex || 1;

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden bg-card hover:border-primary/40 group">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header: ID, Title, Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                #{problem.id}
              </span>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${getPriorityBadgeClass(problem.priority)}`}>
                {problem.priority} Priority
              </Badge>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(problem.status)}`}>
                {problem.status.replace(/_/g, " ")}
              </Badge>
              {problem.hasUniversitySolution && (
                <Badge variant="outline" className="text-[10px] font-bold bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1 flex items-center">
                  <GraduationCap className="h-3 w-3" />
                  Student Innovation
                </Badge>
              )}
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {problem.title}
            </h3>
          </div>

          <Button
            size="sm"
            onClick={() => onOpenReport(problem.id)}
            className="rounded-xl h-8 px-3.5 text-xs font-semibold gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
          >
            <span>Transparency Dossier</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {problem.description}
        </p>

        {/* 8-Stage Workflow Horizontal Stepper */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
            <span className="text-foreground font-semibold flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Eight-Stage Resolution Journey
            </span>
            <span className="text-xs font-bold text-primary">
              Stage {currentStageIdx} of 8: {WORKFLOW_STAGES[currentStageIdx - 1]?.label || "Submitted"}
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-8 gap-1 py-1">
            {WORKFLOW_STAGES.map((s) => {
              const isPast = s.index < currentStageIdx;
              const isCurrent = s.index === currentStageIdx;
              return (
                <div key={s.index} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-2 w-full rounded-full transition-all ${
                      isPast
                        ? "bg-emerald-500"
                        : isCurrent
                        ? "bg-primary ring-2 ring-primary/30 animate-pulse"
                        : "bg-muted/80"
                    }`}
                    title={`${s.index}. ${s.label}`}
                  />
                  <span
                    className={`text-[9px] truncate w-full text-center hidden sm:block ${
                      isCurrent
                        ? "font-bold text-primary"
                        : isPast
                        ? "text-emerald-600 font-medium"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Column Key Transparency Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs border-t border-border/60">
          {/* Col 1: Public Reporter & Location */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Citizen & Location
            </span>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{problem.citizenPublicName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{problem.location}</span>
            </div>
          </div>

          {/* Col 2: Responsible Stakeholder & Domain Expert */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Assigned Responsibility
            </span>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">
                {problem.assignedDepartment || problem.assignedStakeholders[0]?.name || "Municipal Desk"}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {problem.domainExpert ? (
                <span>
                  Expert: <strong className="text-foreground font-semibold">{problem.domainExpert.name}</strong>
                </span>
              ) : (
                <span className="italic text-muted-foreground/80">Domain Expert Assignment Pending</span>
              )}
            </div>
          </div>

          {/* Col 3: Budget & Expenditure */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Financial Accountability
            </span>
            {problem.budgetSummary ? (
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Allocated:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(problem.budgetSummary.allocatedBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(problem.budgetSummary.spentAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground italic">
                Standard Municipal O&M Pool
              </span>
            )}
          </div>

          {/* Col 4: Continuous Government Monitoring */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Government Monitoring
            </span>
            {problem.latestMonitoring ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{problem.latestMonitoring.monitoringStatus.replace(/_/g, " ")}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Audited: {new Date(problem.latestMonitoring.lastMonitoredAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  {new Date(problem.latestMonitoring.lastMonitoredAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground italic">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Not yet monitored</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Handoff / Collaborative Stakeholders Footer */}
        {problem.assignedStakeholders && problem.assignedStakeholders.length > 0 && (
          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-[10px] uppercase tracking-wider">
                Handoff Network:
              </span>
              {problem.assignedStakeholders.map((s, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className={`text-[10px] py-0 px-2 h-5 font-medium rounded-md ${
                    s.decision === "REJECTED"
                      ? "bg-red-500/10 text-red-600 border border-red-500/20 line-through"
                      : s.decision === "ACCEPTED"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground border"
                  }`}
                >
                  {s.name} ({s.decision})
                </Badge>
              ))}
            </div>

            <div className="text-[10px] text-muted-foreground">
              Submitted: {new Date(problem.submissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
