'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FolderGit2,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Building2,
  FileText,
  UploadCloud,
  UserPlus,
  MessageSquare,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { AssignStudentsModal } from '@/features/university/components/faculty/assign-students-modal';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { ResearchProject } from '@/features/university/types';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { role, availableStudents } = useUniversityStore();
  const { data: projects = [], isLoading } = useFacultyProjects();

  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);

  const project = projects.find((p) => p.id === projectId) || projects[0];

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-muted/20 p-6 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Get assigned students objects
  const assignedStudents = availableStudents.filter((s) =>
    project.assignedStudentIds?.includes(s.id)
  );

  const handleDownloadDeliverable = (filename: string) => {
    toast.success(`Downloading research deliverable: ${filename}`);
  };

  const backHref =
    role === 'student' ? '/university/student/projects' : '/university/faculty/projects';

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Back to Project Roster
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Viewing as:</span>
          <Badge
            variant={role === 'faculty' ? 'default' : 'secondary'}
            className="capitalize text-xs font-bold"
          >
            {role} Portal
          </Badge>
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className="font-mono text-xs">
                {project.code}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {project.department}
              </Badge>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  project.status === 'in_progress'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : project.status === 'review'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            {role === 'faculty' ? (
              <>
                <Button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-xs gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  Assign Lab Students
                </Button>
                <Button asChild variant="outline" className="text-xs gap-1.5">
                  <Link href="/university/faculty/approvals">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Review Milestone Approvals
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs gap-1.5">
                  <Link href="/university/student/uploads">
                    <UploadCloud className="h-4 w-4" />
                    Submit Lab Deliverable
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-xs gap-1.5">
                  <Link href="/university/student/messages">
                    <MessageSquare className="h-4 w-4 text-cyan-600" />
                    Discuss with Advisor
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/80 pt-6">
          <div>
            <span className="text-xs text-muted-foreground block">Municipal Grant</span>
            <span className="text-lg font-bold text-foreground">
              ${(project.fundingAmount ?? 45000).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Grant Milestones</span>
            <span className="text-lg font-bold text-foreground">
              {project.milestones.filter((m) => m.status === 'completed').length} /{' '}
              {project.milestones.length} Done
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Lab Team</span>
            <span className="text-lg font-bold text-foreground">
              {(project.assignedStudentIds?.length ?? project.assignedStudents?.length ?? 0)} Student Fellows
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Overall Progress</span>
            <span className="text-lg font-bold text-primary">
              {project.progressPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Milestones */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Milestone Verification Lifecycle
          </h2>
          <p className="text-xs text-muted-foreground">
            Academic stages required to release municipal grant tranches and certify pilot
          </p>
        </div>

        <div className="space-y-4">
          {project.milestones.map((milestone, idx) => {
            const isDone = milestone.status === 'completed';
            const isProgress = milestone.status === 'in_progress';

            return (
              <div
                key={milestone.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isProgress
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : 'border-border/80 bg-muted/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phase {idx + 1}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                          isDone
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : isProgress
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">
                      {milestone.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>

                    {isDone && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Signed Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Student Laboratory Fellows */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Assigned Student Research Fellows ({assignedStudents.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Graduate and undergraduate researchers allocated to this laboratory project
            </p>
          </div>

          {role === 'faculty' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
              className="text-xs gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Manage Roster
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {assignedStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {student.name}
                </h4>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {student.rollNumber || student.email}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {student.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Artifacts & Code Packages */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Project Artifacts & Technical Deliverables
          </h2>
          <p className="text-xs text-muted-foreground">
            Verified experimental datasets, firmware binaries, and research whitepapers
          </p>
        </div>

        <div className="divide-y divide-border/80 border rounded-2xl overflow-hidden">
          {[
            {
              name: 'Edge Inverter STM32 Interrupt Telemetry Firmware (v1.2.0)',
              type: 'Binary Code Package (.bin / .zip)',
              size: '4.2 MB',
              author: 'Alex Rivera',
            },
            {
              name: 'Cycle 3 Solar Influx High-Frequency Sensor CSV Dataset',
              type: 'Raw Telemetry Dataset (.csv)',
              size: '18.6 MB',
              author: 'Alex Rivera',
            },
            {
              name: 'Municipal Substation High-Voltage Benchmarking Protocol',
              type: 'Laboratory Protocol (.pdf)',
              size: '1.4 MB',
              author: 'Dr. Elena Rostova',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {item.size} • Uploaded by {item.author}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDeliverable(item.name)}
                className="text-xs gap-1.5 self-end sm:self-auto"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Students Modal */}
      <AssignStudentsModal
        project={project}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
    </div>
  );
}
