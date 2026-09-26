'use client';

import * as React from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';

export default function FacultyReportsPage() {
  const [downloadingReport, setDownloadingReport] = React.useState<string | null>(null);

  const reports = [
    {
      id: 'REP-2026-Q3',
      title: 'Municipal Grant Utilization & Budget Audit Q3 2026',
      type: 'Financial & Grant Compliance',
      date: 'September 15, 2026',
      size: '2.4 MB',
      format: 'PDF / CSV',
      status: 'Ready',
    },
    {
      id: 'REP-2026-M09',
      title: 'Student Research Hours & Academic Contribution Ledger',
      type: 'Laboratory Supervisions',
      date: 'September 12, 2026',
      size: '1.1 MB',
      format: 'XLSX',
      status: 'Ready',
    },
    {
      id: 'REP-2026-PILOT',
      title: 'City-Wide Clean Energy & EV Pilot Sensor Telemetry Summary',
      type: 'Technical Field Data',
      date: 'September 08, 2026',
      size: '4.8 MB',
      format: 'PDF / GeoJSON',
      status: 'Ready',
    },
    {
      id: 'REP-2026-GOV',
      title: 'Annual Institutional Societal Innovation Impact Assessment',
      type: 'Government & Accreditation',
      date: 'August 28, 2026',
      size: '3.7 MB',
      format: 'PDF',
      status: 'Ready',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadingReport(id);
    setTimeout(() => {
      setDownloadingReport(null);
      toast.success(`Generated official report: ${title}`);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileSpreadsheet className="h-7 w-7 text-primary" />
            Research Reports & Audit Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and export municipal compliance records, grant utilization summaries, and student hours
          </p>
        </div>

        <Button
          onClick={() => {
            toast.info('Synthesizing comprehensive university audit ledger...');
            setTimeout(() => toast.success('Full Audit Dossier compiled successfully.'), 1200);
          }}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Export All Records (ZIP)
        </Button>
      </div>

      {/* Reports Table / List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="divide-y divide-border/80">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {report.id}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {report.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span className="font-mono">{report.format}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(report.id, report.title)}
                  isLoading={downloadingReport === report.id}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
