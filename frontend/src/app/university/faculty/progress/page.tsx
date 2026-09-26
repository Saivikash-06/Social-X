'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LineChart as LineChartIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  FolderGit2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';

export default function FacultyProgressPage() {
  const { data: projects = [] } = useFacultyProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <LineChartIcon className="h-7 w-7 text-primary" />
          Research Milestone Gantt & Progress
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track lifecycle phases, student sprint velocity, and municipal delivery schedules
        </p>
      </div>

      {/* Progress Cards per project */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {project.code}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {project.department}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">
                    Overall Completion
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {project.progressPercentage}%
                  </span>
                </div>
                <Button asChild size="sm" variant="outline" className="text-xs">
                  <Link href={`/university/projects/${project.id}`}>
                    Inspect
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Overall Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Milestones timeline track */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {project.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className={`rounded-xl border p-4 space-y-2 ${
                    m.status === 'completed'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : m.status === 'in_progress'
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-border/60 bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Phase {idx + 1}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : m.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {m.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(m.dueDate).toLocaleDateString()}
                    </span>
                    {m.status === 'completed' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
