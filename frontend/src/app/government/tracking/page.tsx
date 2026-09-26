"use client";

import * as React from "react";
import {
  Compass,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { useGovernmentCases } from "@/features/government/hooks/use-government-queries";

export default function IssueTrackingPage() {
  const { data: cases } = useGovernmentCases();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Live Issue Tracking & Field Fleet Telemetry
          </h1>
          <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
            GPS Synchronized
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time GPS tracking of field repair trucks, active SLA countdown timers, and dispatch milestones.
        </p>
      </div>

      {/* Field Fleet Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Field Squads Deployed
            </span>
            <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-black font-mono text-foreground">
            18 Crews
          </div>
          <p className="text-xs text-muted-foreground">Operating across 14 zones</p>
        </Card>

        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Average On-Site Arrival
            </span>
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            28.4 Mins
          </div>
          <p className="text-xs text-muted-foreground">From citizen AI verification</p>
        </Card>

        <Card className="rounded-3xl border-border/80 p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              SLA Risk Alerts
            </span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            2 Cases
          </div>
          <p className="text-xs text-muted-foreground">&lt; 3 hours before statutory breach</p>
        </Card>
      </div>

      {/* Live SLA Countdown Stream */}
      <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-600" />
            <span>Active Cases Telemetry Stream</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Live countdown timers to statutory municipal SLA milestones
          </CardDescription>
        </div>

        <div className="space-y-3">
          {(cases || []).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-border/80 bg-card hover:border-indigo-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    #{c.id}
                  </span>
                  <Badge
                    variant={c.priority === "critical" ? "destructive" : "outline"}
                    className="text-[10px]"
                  >
                    {c.priority}
                  </Badge>
                  <span className="text-xs font-bold text-foreground truncate max-w-md">
                    {c.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.location} &bull; Assigned: {c.officer} ({c.department})
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Mandatory SLA:
                  </p>
                  <p className="font-mono font-bold text-foreground">
                    {c.slaDeadline}
                  </p>
                </div>
                <Badge
                  variant={c.status === "resolved" ? "success" : "default"}
                  className="text-xs capitalize"
                >
                  {c.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
