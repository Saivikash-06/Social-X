"use client";

import * as React from "react";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Building2,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { toast } from "sonner";

const OFFICIAL_REPORTS = [
  {
    id: "rep-01",
    title: "Monthly Municipal SLA Adherence & Closure Digest",
    period: "September 2026 (Live Audit)",
    type: "Statutory SLA Compliance",
    size: "3.4 MB",
    format: "PDF Document",
  },
  {
    id: "rep-02",
    title: "Infrastructure Failure Severity & Root Cause Audit",
    period: "Q2 FY 2026-27",
    type: "Civil Works & Engineering",
    size: "6.8 MB",
    format: "PDF Document",
  },
  {
    id: "rep-03",
    title: "Inter-Department Field Fleet Performance Ledger",
    period: "Weekly Telemetry (15 Sep - 21 Sep 2026)",
    type: "Fleet & Logistics",
    size: "1.8 MB",
    format: "Excel / CSV",
  },
  {
    id: "rep-04",
    title: "Citizen Feedback & Ward Satisfaction Index",
    period: "August 2026 Complete",
    type: "Public Governance Audit",
    size: "2.9 MB",
    format: "PDF Document",
  },
];

export default function GovernmentReportsPage() {
  const downloadReport = (title: string) => {
    toast.success(`Downloading official gazette: ${title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Official Municipal Reports & Gazette Exports
          </h1>
          <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
            NIC Certified
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Generate compliant administrative audits, SLA compliance ledgers, and department expenditure summaries.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OFFICIAL_REPORTS.map((rep) => (
          <Card
            key={rep.id}
            className="rounded-3xl border-border/80 p-5 space-y-4 hover:border-indigo-500/40 transition-colors shadow-sm bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {rep.period}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {rep.format}
              </Badge>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono">
                Size: {rep.size} &bull; {rep.type}
              </span>
              <Button
                size="sm"
                onClick={() => downloadReport(rep.title)}
                className="h-8 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Report</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
