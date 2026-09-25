"use client";

import * as React from "react";
import {
  Sparkles,
  Layers,
  TrendingUp,
  BrainCircuit,
  Wrench,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { toast } from "sonner";

export default function AiSuggestionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            AI Suggestions & Predictive Governance
          </h1>
          <Badge className="bg-indigo-600 text-white border-transparent text-xs font-mono">
            Powered by Gemini 2.5 Flash
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Autonomous pattern detection, grievance clustering, material demand forecasting, and predictive maintenance suggestions.
        </p>
      </div>

      {/* AI Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommendation 1: Duplicate Cluster Merge */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Grievance Cluster Auto-Merge Suggested
                </h3>
                <p className="text-xs text-muted-foreground">
                  Spatial Similarity: 94.2% &bull; Zone 118 Chennai
                </p>
              </div>
            </div>
            <Badge variant="warning" className="text-[10px]">
              High Confidence
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            3 separate citizen submissions (#TN-CIVIC-9021, #TN-CIVIC-9024, #TN-CIVIC-9029) point to the exact same 900mm water conduit blowout near DMS Metro. Merging these into a single parent ticket will eliminate triple crew dispatch.
          </p>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Saves ~4 hours engineering dispatch
            </span>
            <Button
              size="sm"
              onClick={() => toast.success("Grievance cluster merged into Master Ticket #TN-CIVIC-9021.")}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Merge Into Master Ticket
            </Button>
          </div>
        </Card>

        {/* Recommendation 2: Predictive Material Procurement */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Predictive Spares Procurement
                </h3>
                <p className="text-xs text-muted-foreground">
                  Madurai & Coimbatore Electrical Circles
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">
              Inventory Alert
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Monsoon weather telemetry predicts increased overhead conductor snaps over the next 72 hours. Recommended to pre-position 200m ACSR 11kV conductors and 25 replacement insulator discs in South Circle depot.
          </p>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Est. stock buffer: 3.5 days
            </span>
            <Button
              size="sm"
              onClick={() => toast.success("Purchase requisition drafted for Madurai Stores.")}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Approve Store Requisition
            </Button>
          </div>
        </Card>

        {/* Recommendation 3: Inter-Department Fast Track Routing */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Automated SLA Transfer Routing
                </h3>
                <p className="text-xs text-muted-foreground">
                  Case #TN-CIVIC-8840 &bull; Avinashi Road Sinkhole
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Multi-Agency
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Sinkhole is co-located with an ancient storm drain channel under Coimbatore Corporation. AI recommends joint routing between Highways Department and Municipal Drain Division to prevent recurrent collapse.
          </p>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Dual nodal sign-off
            </span>
            <Button
              size="sm"
              onClick={() => toast.success("Joint taskforce dispatched.")}
              className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Initiate Joint Taskforce
            </Button>
          </div>
        </Card>

        {/* Recommendation 4: Environmental High Risk Escalation */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Environmental Non-Compliance Alert
                </h3>
                <p className="text-xs text-muted-foreground">
                  Case #TN-CIVIC-8490 &bull; Ramapuram Industrial Canal
                </p>
              </div>
            </div>
            <Badge variant="destructive" className="text-[10px]">
              Statutory Violation
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Spectral camera telemetry confirmed toxic industrial dye contaminants exceeding permissible BOD/COD limits by 420%. Automated statutory closure notice is prepared for TNPCB review.
          </p>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Statutory penalty ready
            </span>
            <Button
              size="sm"
              onClick={() => toast.success("Statutory closure notice submitted to TNPCB Chairman.")}
              className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Submit Notice to TNPCB
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
