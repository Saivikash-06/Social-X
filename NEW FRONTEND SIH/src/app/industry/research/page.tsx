"use client";

import * as React from "react";
import {
  FlaskConical,
  Award,
  FileText,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Coins,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useResearchCollaborations } from "@/features/industry/hooks/use-industry-queries";
import { toast } from "sonner";

export default function IndustryResearchCollaborationPage() {
  const { data: collaborations } = useResearchCollaborations();

  const handleProposeInitiative = () => {
    toast.success("R&D Initiative proposal sandbox initialized.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Research Collaboration & IP</h1>
          <p className="text-sm text-muted-foreground">
            Joint academic initiatives, patent applications, tech transfer agreements, and co-developed publications.
          </p>
        </div>
        <Button onClick={handleProposeInitiative} variant="gradient" className="rounded-2xl text-xs gap-1.5 font-bold shadow">
          <FlaskConical className="h-3.5 w-3.5" />
          <span>Propose New R&D Initiative</span>
        </Button>
      </div>

      {/* Top 3 Research KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Active R&D Grants</p>
          <p className="text-3xl font-black text-foreground">₹1,09,00,000</p>
          <p className="text-[11px] text-muted-foreground">Committed across 3 multi-year academic consortiums</p>
        </Card>
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Joint Patents Filed</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">4 Patents</p>
          <p className="text-[11px] text-muted-foreground">Co-assigned with IISc, NITK & JSS STU</p>
        </Card>
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Whitepapers Co-Authored</p>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">9 Papers</p>
          <p className="text-[11px] text-muted-foreground">Published in IEEE, Springer & ACM journals</p>
        </Card>
      </div>

      {/* Research Initiatives List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Joint Academic Research Portfolios</h2>
        <div className="grid grid-cols-1 gap-4">
          {(collaborations || []).map((collab) => (
            <Card key={collab.id} className="border-border/80 bg-card rounded-3xl shadow-sm p-6 hover:border-amber-500/40 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="warning" className="text-[10px] font-semibold">
                      {collab.domain}
                    </Badge>
                    <Badge variant={collab.status === "patent_pending" ? "info" : "success"} className="text-[10px]">
                      {collab.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {collab.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{collab.university}</span>
                    <span>•</span>
                    <span>Lead PI: {collab.leadInvestigator}</span>
                    <span>•</span>
                    <span>Duration: {collab.startDate} to {collab.endDate}</span>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-center min-w-[100px]">
                    <span className="text-[10px] text-muted-foreground block">Grant Value</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{(collab.grantValue / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-center min-w-[100px]">
                    <span className="text-[10px] text-muted-foreground block">Joint Patents</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                      {collab.jointPatentsFiled} Filed
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-center min-w-[100px]">
                    <span className="text-[10px] text-muted-foreground block">Publications</span>
                    <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                      {collab.papersCoAuthored} Papers
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
