'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { useStudentProjects } from '@/features/university/hooks/use-university-queries';

export default function StudentProjectsPage() {
  const { data: projects = [], isLoading } = useStudentProjects('usr-student-01');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <FolderGit2 className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
          My Research Projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Academic research laboratories and municipal pilot projects you are contributing to
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border bg-card/60 p-6"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          You are not currently assigned to any active research projects. Contact your faculty advisor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 hover:border-cyan-500/40 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {project.code}
                  </Badge>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-foreground">
                  {project.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {project.problemStatement}
                </p>

                {/* Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Milestone Delivery</span>
                    <span className="font-bold text-foreground">{project.progressPercentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-cyan-600 transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Milestones list preview */}
                <div className="mt-4 border-t border-border/80 pt-3 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Milestones
                  </span>
                  <div className="space-y-1.5">
                    {project.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs rounded-lg bg-muted/40 p-2"
                      >
                        <span className="truncate text-foreground font-medium">
                          {m.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase ${
                            m.status === 'completed'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-500'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/80 pt-4">
                <span className="text-xs text-muted-foreground">
                  Supervised by Dr. Elena Rostova
                </span>

                <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs gap-1.5">
                  <Link href={`/university/projects/${project.id}`}>
                    Project Workspace
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
