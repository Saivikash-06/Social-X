"use client";

import * as React from "react";
import {
  Milestone,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Progress } from "@/features/shared/components/ui/progress";
import { useImplementationTracker } from "@/features/industry/hooks/use-industry-queries";
import { cn } from "@/lib/utils";

const STAGES = [
  "Planning",
  "Research",
  "Prototype",
  "Testing",
  "Pilot",
  "Deployment",
  "Completed",
] as const;

export default function IndustryImplementationTrackingPage() {
  const { data: trackerItems } = useImplementationTracker();

  const getStageIndex = (stage: string) => {
    return STAGES.indexOf(stage as any);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Implementation Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Multi-stage lifecycle oversight from foundational planning through municipal field deployment.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1.5">
          <Milestone className="h-3.5 w-3.5" />
          <span>7-Stage Delivery Pipeline</span>
        </Badge>
      </div>

      {/* Tracker Pipeline Items */}
      <div className="space-y-6">
        {(trackerItems || []).map((item) => {
          const currentIdx = getStageIndex(item.currentStage);

          return (
            <Card key={item.id} className="border-border/80 bg-card rounded-3xl p-6 shadow-sm space-y-6 hover:border-amber-500/40 transition-all">
              {/* Card Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{item.deploymentDistrict}</span>
                    </Badge>
                    <Badge variant="warning" className="text-xs font-bold">
                      Current Stage: {item.currentStage}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-foreground">{item.projectTitle}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-muted-foreground block">Overall Progress</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {item.overallProgress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Stage Visual Timeline Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stage} className="space-y-2">
                        <div
                          className={cn(
                            "h-2.5 rounded-full transition-all",
                            isPassed
                              ? "bg-emerald-500"
                              : isCurrent
                              ? "bg-amber-500 animate-pulse"
                              : "bg-muted"
                          )}
                        />
                        <span
                          className={cn(
                            "block text-[11px] font-semibold truncate",
                            isCurrent
                              ? "text-amber-600 dark:text-amber-400 font-bold"
                              : isPassed
                              ? "text-foreground"
                              : "text-muted-foreground/60"
                          )}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones & Audit Deliverables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-border/60">
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Last Verified Milestone:</span>
                    </span>
                    <p className="font-bold text-foreground">{item.lastMilestonePassed}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Upcoming Audit Milestone:</span>
                    </span>
                    <p className="font-bold text-foreground">{item.nextMilestoneDue}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-foreground block text-xs">Field Verification & Audit Reports</span>
                  <div className="space-y-1.5">
                    {item.reports.map((rep) => (
                      <div
                        key={rep.name}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{rep.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{rep.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
