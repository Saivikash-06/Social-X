"use client";

import * as React from "react";
import { FileText, Download, FileSpreadsheet, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useResearchReports } from "@/features/research/hooks/use-research-queries";
import { toast } from "sonner";

export default function ResearchReportsPage() {
  const { data: reports, isLoading } = useResearchReports();

  const handleDownload = (title: string, format: string) => {
    toast.success(`Exporting ${title} (${format})...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Grant Audits & Research Output Reports</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Certified institutional grant utilization statements, patent portfolio audits, and scientific telemetry exports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(reports || []).map((rep) => (
          <Card key={rep.id} className="rounded-3xl border-border/80 bg-card p-5 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant={rep.format === "PDF" ? "destructive" : "success"}
                  className="text-[10px] gap-1 font-bold"
                >
                  {rep.format === "PDF" ? <FileText className="h-3 w-3" /> : <FileSpreadsheet className="h-3 w-3" />}
                  <span>{rep.format}</span>
                </Badge>
                <span className="text-[11px] text-muted-foreground">{rep.period}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{rep.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Classification: {rep.type}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground p-2.5 rounded-xl bg-muted/40">
                <span>Certified: {rep.generatedDate}</span>
                <span>Size: {rep.size}</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(rep.title, rep.format)}
                className="w-full rounded-xl text-xs font-bold gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Certified {rep.format}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
