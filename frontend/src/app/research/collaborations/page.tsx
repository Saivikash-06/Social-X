"use client";

import * as React from "react";
import { Network, Building, GraduationCap, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { toast } from "sonner";

const CONSORTIA_PARTNERS = [
  {
    id: "cons-01",
    name: "National Clean Water & Urban Hydro-Informatics Consortium",
    leadInstitute: "IISc Bangalore & IIT Bombay",
    membersCount: 14,
    focus: "Real-time acoustic water distribution network monitoring",
    jointGrantsCr: "₹18.5 Cr",
    status: "Active Consortium",
  },
  {
    id: "cons-02",
    name: "Transit Edge-AI & Pavement Vision Alliance",
    leadInstitute: "COEP Technological University & IIIT Bangalore",
    membersCount: 8,
    focus: "Low-power embedded computer vision for municipal transit fleets",
    jointGrantsCr: "₹9.2 Cr",
    status: "Active Consortium",
  },
  {
    id: "cons-03",
    name: "Decentralized Biomass & Agro-Waste Pyrolysis Taskforce",
    leadInstitute: "CSIR-NEERI & Tamil Nadu Agricultural University",
    membersCount: 6,
    focus: "Mandi organic sludge conversion into carbon soil conditioners",
    jointGrantsCr: "₹7.0 Cr",
    status: "Active Consortium",
  },
];

export default function ResearchCollaborationsPage() {
  const handleProposal = (name: string) => {
    toast.success(`Consortium proposal drafted for [${name}]`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Network className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Inter-Institutional Research Consortia</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Cross-laboratory alliances, shared national scientific instrumentation, and multi-PI research grants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CONSORTIA_PARTNERS.map((cons) => (
          <Card key={cons.id} className="rounded-3xl border-border/80 bg-card p-6 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[10px]">
                  {cons.status}
                </Badge>
                <span className="text-xs font-bold text-emerald-600">{cons.jointGrantsCr} Grants</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{cons.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Founding Labs: {cons.leadInstitute}</p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-2xl bg-muted/40 border border-border/60">
                {cons.focus}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Network Size: <strong>{cons.membersCount} Research Labs</strong></span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" /> DST Recognized
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 mt-3 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProposal(cons.name)}
                className="w-full rounded-xl text-xs font-bold"
              >
                Submit Joint Grant Proposal
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
