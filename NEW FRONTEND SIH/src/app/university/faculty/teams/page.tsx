'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FolderGit2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';

export default function FacultyTeamsPage() {
  const { availableStudents } = useUniversityStore();
  const { data: projects = [] } = useFacultyProjects();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary" />
            Student Research Teams & Fellows
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Supervise active student researchers, laboratory allocations, and research contributions
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
          {availableStudents.length} Active Fellows Enrolled
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xs">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter researchers by name, student registration number, or academic department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Student Researchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          // Find projects this student is assigned to
          const studentProjects = projects.filter((p) =>
            p.assignedStudentIds?.includes(student.id)
          );

          return (
            <div
              key={student.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-sm ring-4 ring-cyan-500/5">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {student.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {student.rollNumber || 'REG-PENDING'}
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-[10px]">
                    {student.department?.split(' ')[0] || 'Engineering'}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span>{student.institution}</span>
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="mt-4 border-t border-border/80 pt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Assigned Laboratories & Projects ({studentProjects.length})
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {studentProjects.length > 0 ? (
                      studentProjects.map((proj) => (
                        <Link
                          key={proj.id}
                          href={`/university/projects/${proj.id}`}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                        >
                          <span className="truncate font-medium">{proj.title}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                        </Link>
                      ))
                    ) : (
                      <span className="block text-xs text-muted-foreground italic">
                        No active project assigned currently
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active Academic Standing
                </span>

                <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <Link href={`mailto:${student.email}`}>
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
