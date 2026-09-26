'use client';

import * as React from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { ResearchUploadForm } from '@/features/university/components/student/research-upload-form';

export default function StudentUploadsPage() {
  const [history, setHistory] = React.useState([
    {
      id: 'doc-01',
      title: 'Solar Microgrid Telemetry Cycle 3 Logs',
      type: 'Experimental Dataset (.csv)',
      size: '14.2 MB',
      date: 'Yesterday at 3:45 PM',
      status: 'approved',
    },
    {
      id: 'doc-02',
      title: 'Edge Inverter STM32 DMA Sampling Firmware',
      type: 'Code Repository (.zip)',
      size: '2.8 MB',
      date: 'September 14, 2026',
      status: 'approved',
    },
    {
      id: 'doc-03',
      title: 'Municipal Pilot Substation Oscilloscope Traces',
      type: 'Hardware Trace Data (.bin)',
      size: '8.4 MB',
      date: 'September 12, 2026',
      status: 'review',
    },
  ]);

  const handleDownload = (title: string) => {
    toast.success(`Downloaded deliverable: ${title}`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <UploadCloud className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
          Submit Research Deliverables
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload experimental datasets, lab notes, code packages, and draft papers for faculty advisor audit
        </p>
      </div>

      {/* Upload Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <ResearchUploadForm
          onSuccess={() => {
            setHistory((prev) => [
              {
                id: `doc-${Date.now()}`,
                title: 'New Lab Submission',
                type: 'Experimental Deliverable',
                size: '5.1 MB',
                date: 'Just now',
                status: 'review',
              },
              ...prev,
            ]);
          }}
        />
      </div>

      {/* Previous Submissions History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Submission Audit Log & Sign-Offs
        </h2>

        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/80 shadow-xs">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {item.size} • {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    item.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {item.status === 'approved' ? 'Verified by Advisor' : 'Awaiting Review'}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(item.title)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
