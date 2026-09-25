'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { useStudentProjects } from '@/features/university/hooks/use-university-queries';

export default function StudentTimelinePage() {
  const { data: projects = [] } = useStudentProjects('usr-student-01');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Calendar className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
          Milestone Timeline & Schedule
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track upcoming project deadlines, laboratory verification targets, and municipal presentation dates
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {project.code}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {project.department}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {project.title}
                </h3>
              </div>

              <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                <Link href={`/university/projects/${project.id}`}>
                  Inspect Workspace
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {/* Vertical timeline */}
            <div className="relative border-l-2 border-border/80 ml-4 pl-6 space-y-8">
              {project.milestones.map((m, idx) => {
                const isCompleted = m.status === 'completed';
                const isInProgress = m.status === 'in_progress';

                return (
                  <div key={m.id} className="relative">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isInProgress
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-4 ring-cyan-500/10'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Phase {idx + 1}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isInProgress
                              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-foreground">
                        {m.title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Target Due: {new Date(m.dueDate).toLocaleDateString()}
                        </span>
                        {isCompleted && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Advisor Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
