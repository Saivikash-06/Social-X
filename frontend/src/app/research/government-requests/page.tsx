"use client";

import * as React from "react";
import {
  Building,
  Search,
  IndianRupee,
  Calendar,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import { useGovtRequests } from "@/features/research/hooks/use-research-queries";
import { toast } from "sonner";

export default function ResearchGovtRequestsPage() {
  const { data: requests, isLoading } = useGovtRequests();

  const handleApplyRfp = (title: string) => {
    toast.success(`Preliminary technical proposal drafted for ${title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Government Technical Requests & RFPs</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Municipal and state line ministry calls for applied R&D prototypes, impact evaluation, and civic policy guidance
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {(requests || []).map((rfp) => (
          <Card key={rfp.id} className="rounded-3xl border-border/80 bg-card p-6 shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={rfp.priority === "Critical" ? "destructive" : "default"}
                    className="text-[10px]"
                  >
                    {rfp.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {rfp.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground">• {rfp.jurisdiction}</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Est. Budget: {rfp.budgetEst}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{rfp.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{rfp.scope}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Submission Deadline: <strong>{rfp.deadline}</strong></span>
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Opening official government gazette PDF...")}
                    className="rounded-xl text-xs"
                  >
                    Download RFP PDF
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplyRfp(rfp.title)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Proposal</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
