'use client';

import * as React from 'react';
import {
  FolderCheck,
  FolderGit2,
  Clock,
  HeartHandshake,
  Users2,
  Award,
  FileText,
  Lightbulb,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { ProjectStatistics } from '../../../types/student-contribution';

interface ProjectStatisticsGridProps {
  stats: ProjectStatistics;
}

export function ProjectStatisticsGrid({ stats }: ProjectStatisticsGridProps) {
  const statItems = [
    {
      label: 'Completed Projects',
      value: stats.completedProjects,
      suffix: '',
      icon: FolderCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Fully deployed & evaluated',
    },
    {
      label: 'Ongoing Projects',
      value: stats.ongoingProjects,
      suffix: '',
      icon: FolderGit2,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      description: 'Active university lab sprints',
    },
    {
      label: 'Pending Assignments',
      value: stats.pendingAssignments,
      suffix: '',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      description: 'Deliverables due this term',
    },
    {
      label: 'Hours Contributed',
      value: stats.hoursContributed,
      suffix: ' hrs',
      icon: HeartHandshake,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      description: 'Fieldwork & civic service',
    },
    {
      label: 'Communities Served',
      value: stats.communitiesServed,
      suffix: ' regions',
      icon: Users2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      description: 'Wards & village clusters',
    },
    {
      label: 'Certificates Earned',
      value: stats.certificatesEarned,
      suffix: '',
      icon: Award,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      description: 'Verified micro-credentials',
    },
    {
      label: 'Research Papers',
      value: stats.researchPapers,
      suffix: ' pubs',
      icon: FileText,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      description: 'Peer-reviewed conference/journal',
    },
    {
      label: 'Patents Filed',
      value: stats.patentsFiled,
      suffix: '',
      icon: Lightbulb,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      description: 'Provisional IP disclosures',
    },
    {
      label: 'Innovation Awards',
      value: stats.innovationAwards,
      suffix: '',
      icon: Trophy,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      description: 'Hackathon & state honors',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Project Statistics & Impact Metrics
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          High-level overview of projects completed, volunteer hours invested, publications, and patents
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-md hover:border-cyan-500/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${item.bg} ${item.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  #0{index + 1}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground tracking-tight">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-xs font-bold text-muted-foreground">
                      {item.suffix}
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-foreground mt-0.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {item.label}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
