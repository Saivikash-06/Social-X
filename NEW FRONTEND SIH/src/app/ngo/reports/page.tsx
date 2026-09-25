"use client";

import * as React from "react";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useNgoReports, useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoReportsPage() {
  const { data: reports, isLoading } = useNgoReports();
  const { generateReportMutation } = useNgoQueries();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = React.useState(false);
  const [reportType, setReportType] = React.useState<any>("Monthly Activities");
  const [reportPeriod, setReportPeriod] = React.useState("Q3 2026");
  const [reportFormat, setReportFormat] = React.useState<"PDF" | "Excel">("PDF");

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateReportMutation.mutate(
      {
        type: reportType,
        period: reportPeriod,
        fileFormat: reportFormat,
        includeEvidencePhotos: true,
      },
      {
        onSuccess: () => {
          setIsGenerateModalOpen(false);
        },
      }
    );
  };

  const handleDownload = (repTitle: string, format: string) => {
    toast.success(`Exporting ${repTitle} in .${format.toLowerCase()} format...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Audit Reports & Export Center</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Generate and download certified monthly activity dossiers, CSR financial utilization, and community reach statements
          </p>
        </div>
        <Button
          onClick={() => setIsGenerateModalOpen(true)}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Generate New Audit Dossier</span>
        </Button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(reports || []).map((rep) => (
          <Card key={rep.id} className="rounded-3xl border-border/80 bg-card p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant={rep.fileFormat === "PDF" ? "destructive" : "success"}
                  className="text-[10px] gap-1 font-bold"
                >
                  {rep.fileFormat === "PDF" ? <FileText className="h-3 w-3" /> : <FileSpreadsheet className="h-3 w-3" />}
                  <span>{rep.fileFormat}</span>
                </Badge>
                <span className="text-[11px] text-muted-foreground">{rep.period}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{rep.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Classification: {rep.type}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground p-2.5 rounded-xl bg-muted/40">
                <span>Compiled: {rep.generatedAt}</span>
                <span>Size: {rep.size}</span>
                <span>{rep.downloadCount} Downloads</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(rep.title, rep.fileFormat)}
                className="w-full rounded-xl text-xs font-bold gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Certified {rep.fileFormat}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Generate Certified Report</DialogTitle>
            <DialogDescription className="text-xs">
              Automated compilation with line department verification signatures.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerateSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Report Focus Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              >
                <option value="Monthly Activities">Monthly Activities Log</option>
                <option value="Completed Projects">Completed Projects Final Handover</option>
                <option value="Volunteer Contributions">Volunteer Contributions & Logged Hours</option>
                <option value="Financial Utilization">CSR Section 135 Financial Utilization</option>
                <option value="Community Reach">Community Reach & Beneficiary Audit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Audit Period</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              >
                <option value="Q3 2026">Q3 2026 (Jul - Sep 2026)</option>
                <option value="Q2 2026">Q2 2026 (Apr - Jun 2026)</option>
                <option value="FY 2025-26">FY 2025-26 Annual Audit</option>
                <option value="Cumulative 2024-2026">Cumulative 2024-2026 Multi-Year Scope</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Export File Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReportFormat("PDF")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    reportFormat === "PDF"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border/80 text-muted-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" /> PDF Document
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat("Excel")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    reportFormat === "Excel"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border/80 text-muted-foreground"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel (.xlsx)
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={generateReportMutation.isPending}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {generateReportMutation.isPending ? "Generating..." : "Compile & Export"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
