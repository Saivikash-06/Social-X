'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Search,
  Filter,
  Users,
  Clock,
  ArrowRight,
  UserPlus,
  Building2,
  DollarSign,
  Plus,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { AssignStudentsModal } from '@/features/university/components/faculty/assign-students-modal';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';
import { ResearchProject } from '@/features/university/types';

export default function FacultyProjectsPage() {
  const { data: projects = [], isLoading } = useFacultyProjects();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [selectedProjectForTeam, setSelectedProjectForTeam] =
    React.useState<ResearchProject | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.department || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FolderGit2 className="h-7 w-7 text-primary" />
            Supervised Research Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage academic grants, research milestones, laboratory teams, and municipal deliverables
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/university/repository">
              <BookOpen className="h-4 w-4" />
              Repository
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
            <Link href="/university/faculty/proposals">
              <Plus className="h-4 w-4" />
              Adopt Municipal Proposal
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title, code, problem statement, or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'in_progress', 'review', 'completed', 'planning'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border bg-card/60 p-5"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No research projects match your search
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria or adopt a new municipal research proposal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {project.code}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {project.department}
                    </span>
                  </div>
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

                <h3 className="text-lg font-bold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {project.problemStatement}
                </p>

                {/* Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">
                      Verification Progress
                    </span>
                    <span className="font-bold text-foreground">
                      {project.progressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/80 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      <strong className="text-foreground">
                        {(project.assignedStudentIds?.length ?? project.assignedStudents?.length ?? 0)}
                      </strong>{' '}
                      Student Researchers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span>
                      Grant: <strong className="text-foreground">${(project.fundingAmount ?? 45000).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProjectForTeam(project)}
                  className="gap-1.5 text-xs"
                >
                  <UserPlus className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  Assign Students
                </Button>

                <Button asChild size="sm" className="gap-1.5 text-xs">
                  <Link href={`/university/projects/${project.id}`}>
                    Inspect Project
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Assign Students Modal */}
      <AssignStudentsModal
        project={selectedProjectForTeam}
        isOpen={Boolean(selectedProjectForTeam)}
        onClose={() => setSelectedProjectForTeam(null)}
      />
    </div>
  );
}
