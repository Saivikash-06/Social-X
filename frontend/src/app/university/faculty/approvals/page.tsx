'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  FolderGit2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';
import { useApproveMilestone } from '@/features/university/hooks/use-university-queries';

export default function FacultyApprovalsPage() {
  const { data: projects = [] } = useFacultyProjects();
  const approveMutation = useApproveMilestone();

  const [feedbackMap, setFeedbackMap] = React.useState<Record<string, string>>({});
  const [approvedMilestones, setApprovedMilestones] = React.useState<string[]>([]);

  // Collect pending milestones from all supervised projects
  const pendingApprovals = React.useMemo(() => {
    const list: Array<{
      projectId: string;
      projectTitle: string;
      projectCode: string;
      milestoneId: string;
      title: string;
      dueDate: string;
      deliverables: string[];
    }> = [];

    projects.forEach((proj) => {
      proj.milestones.forEach((m) => {
        if (m.status === 'in_progress' && !approvedMilestones.includes(m.id)) {
          list.push({
            projectId: proj.id,
            projectTitle: proj.title,
            projectCode: proj.code || proj.id,
            milestoneId: m.id,
            title: m.title,
            dueDate: m.dueDate,
            deliverables: [
              'IoT Telemetry & Firmware Verification Log (.bin)',
              'Field Sensor Baseline Metrics Report (.pdf)',
              'Municipal API Integration Schema (.json)',
            ],
          });
        }
      });
    });

    return list;
  }, [projects, approvedMilestones]);

  const handleApprove = (projectId: string, milestoneId: string, title: string) => {
    approveMutation.mutate(
      {
        projectId,
        milestoneId,
        feedback: feedbackMap[milestoneId] || 'Deliverable satisfies grant milestone criteria.',
      },
      {
        onSuccess: () => {
          setApprovedMilestones((prev) => [...prev, milestoneId]);
          toast.success(`Milestone "${title}" approved & signed off!`);
        },
      }
    );
  };

  const handleRequestRevision = (milestoneId: string, title: string) => {
    toast.warning(`Revision request sent to student researchers for "${title}".`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <CheckSquare className="h-7 w-7 text-primary" />
          Milestone Verification & Sign-Offs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit student research submissions, inspect technical deliverables, and approve grant releases
        </p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500/60" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            All Student Submissions Verified
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There are currently no milestones waiting for academic advisor verification.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/university/faculty/projects">Return to Project Roster</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingApprovals.map((item) => (
            <div
              key={item.milestoneId}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.projectCode}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {item.projectTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span>Target Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">
                  Sub-Milestone: {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Student researchers uploaded 3 verified lab artifacts and test logs for faculty review.
                </p>
              </div>

              {/* Submitted Deliverables list */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Attached Deliverables & Artifacts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {item.deliverables.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-background p-2 text-xs text-foreground border border-border/60"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Faculty Review Remarks & Assessment (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent sensor calibration. Ready for city deployment."
                  value={feedbackMap[item.milestoneId] || ''}
                  onChange={(e) =>
                    setFeedbackMap((prev) => ({
                      ...prev,
                      [item.milestoneId]: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequestRevision(item.milestoneId, item.title)}
                  className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 border-amber-500/20"
                >
                  <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                  Request Revision
                </Button>

                <Button
                  size="sm"
                  onClick={() =>
                    handleApprove(item.projectId, item.milestoneId, item.title)
                  }
                  isLoading={approveMutation.isPending}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Verify & Approve Milestone
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
