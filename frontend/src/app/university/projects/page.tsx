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
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  MapPin,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  CheckCheck,
  XCircle,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { Card, CardContent } from '@/features/shared/components/ui/card';
import { AssignStudentsModal } from '@/features/university/components/faculty/assign-students-modal';
import {
  useFacultyProjects,
  useJoinProject,
  useMarkProjectCompleted,
  useUploadProjectProgress,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { ResearchProject, ProjectPriority, ProjectStatus } from '@/features/university/types';

export default function UniversityProjectsPage() {
  const { role, currentUser, availableStudents } = useUniversityStore();
  const { data: projects = [], isLoading } = useFacultyProjects();

  const joinProjectMutation = useJoinProject();
  const markCompletedMutation = useMarkProjectCompleted();
  const uploadProgressMutation = useUploadProjectProgress();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const [selectedProjectForTeam, setSelectedProjectForTeam] =
    React.useState<ResearchProject | null>(null);
  const [uploadModalProject, setUploadModalProject] =
    React.useState<ResearchProject | null>(null);
  const [progressNotes, setProgressNotes] = React.useState('');
  const [progressValue, setProgressValue] = React.useState(75);

  const isFaculty = role === 'faculty';

  // Extract unique departments & categories
  const departments = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.municipalDepartment) set.add(p.municipalDepartment);
    });
    return Array.from(set);
  }, [projects]);

  const aiCategories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.aiCategory) set.add(p.aiCategory);
    });
    return Array.from(set);
  }, [projects]);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.governmentReference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.aiCategory || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'all' || p.municipalDepartment === departmentFilter;
    const matchesCategory =
      categoryFilter === 'all' || p.aiCategory === categoryFilter;
    const matchesPriority =
      priorityFilter === 'all' || p.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesDept && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleFacultyAccept = (projectId: string) => {
    toast.success(`Government Project ${projectId} officially accepted! Adopted into laboratory portfolio.`);
  };

  const handleFacultyReject = (projectId: string) => {
    toast.info(`Government Project ${projectId} declined. Notification sent to Municipal Department.`);
  };

  const handleStudentJoin = (project: ResearchProject) => {
    joinProjectMutation.mutate({
      projectId: project.id,
      studentId: currentUser?.id || 'usr-student-01',
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalProject) return;

    uploadProgressMutation.mutate({
      projectId: uploadModalProject.id,
      data: {
        notes: progressNotes || 'Uploaded lab benchmark and dataset package.',
        progressPercentage: progressValue,
      },
    });
    setUploadModalProject(null);
    setProgressNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Civic-Academic Research Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Municipal & Academic Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Real-world civic problem statements adopted by university departments for research,
            student engineering labs, and technology transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Badge variant="outline" className="text-xs font-mono px-3 py-1">
            {filteredProjects.length} Projects Listed
          </Badge>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
            {role} View
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/80 bg-card p-4 sm:p-5 shadow-xs rounded-2xl">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, gov ref (e.g. GOV-BWSSB), AI category, or ward location..."
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.length > 28 ? dept.slice(0, 26) + '...' : dept}
                </option>
              ))}
            </select>

            {/* AI Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All AI Categories</option>
              {aiCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="proposed">Proposed / Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-3xl border border-border bg-card/60 p-6"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground space-y-3">
          <FolderGit2 className="h-10 w-10 mx-auto opacity-40 text-primary" />
          <h3 className="text-base font-bold text-foreground">No matching research projects</h3>
          <p className="text-xs max-w-md mx-auto">
            Try adjusting your search keywords, priority levels, or department filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isStudentAssigned =
              project.assignedStudentIds?.includes(currentUser?.id || 'usr-student-01') ||
              project.assignedStudents?.some((s) => s.id === (currentUser?.id || 'usr-student-01'));

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md space-y-5"
              >
                <div className="space-y-3.5">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {project.code || project.id}
                      </Badge>
                      {project.governmentReference && (
                        <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {project.governmentReference}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          project.priority === 'critical'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : project.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {project.priority}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          project.status === 'in_progress'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : project.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Title & AI Category */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {project.aiCategory || 'Smart Governance AI'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                      <Link href={`/university/projects/${project.id}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description || project.problemStatement}
                    </p>
                  </div>

                  {/* Location & Department */}
                  <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{project.municipalDepartment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{project.location || 'Municipal Corporation Corridor'}</span>
                    </div>
                  </div>

                  {/* Media & Deliverables Count */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground border-t border-border/60">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                      <span>{project.files?.length || project.documents?.length || 2} Docs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{project.images?.length || 1} Images</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-3.5 w-3.5 text-purple-500" />
                      <span>{project.videos?.length || 0} Demos</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-primary font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Due: {project.deadline || project.targetCompletionDate}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-muted-foreground">
                        Phase Completion
                      </span>
                      <span className="font-bold text-foreground">
                        {project.progressPercentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Personnel Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground border-t border-border/80">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>Faculty: {project.facultyAdvisor?.name || 'Dr. Elena Rostova'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Users className="h-3.5 w-3.5 text-cyan-500" />
                      <span>{(project.assignedStudentIds?.length ?? project.assignedStudents?.length ?? 0)} Fellows</span>
                    </div>
                  </div>
                </div>

                {/* Role-Based Action Buttons */}
                <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-2">
                  {isFaculty ? (
                    /* FACULTY ACTIONS */
                    <>
                      {project.status === 'proposed' ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            onClick={() => handleFacultyAccept(project.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Accept Request
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFacultyReject(project.id)}
                            className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProjectForTeam(project)}
                            className="text-xs gap-1.5"
                          >
                            <UserPlus className="h-3.5 w-3.5 text-cyan-600" />
                            Assign Team
                          </Button>
                          {project.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markCompletedMutation.mutate(project.id)}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      )}

                      <Button asChild size="sm" className="ml-auto text-xs gap-1">
                        <Link href={`/university/projects/${project.id}`}>
                          Inspect Workspace
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    /* STUDENT ACTIONS */
                    <>
                      {isStudentAssigned ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            ✓ Team Member
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadModalProject(project)}
                            className="text-xs gap-1.5"
                          >
                            <UploadCloud className="h-3.5 w-3.5 text-cyan-600" />
                            Upload Progress
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStudentJoin(project)}
                          isLoading={joinProjectMutation.isPending}
                          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Join Project
                        </Button>
                      )}

                      <Button asChild variant="ghost" size="sm" className="ml-auto text-xs gap-1">
                        <Link href={`/university/projects/${project.id}`}>
                          View Details
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Assign Students Modal */}
      <AssignStudentsModal
        project={selectedProjectForTeam}
        isOpen={Boolean(selectedProjectForTeam)}
        onClose={() => setSelectedProjectForTeam(null)}
      />

      {/* Student Upload Progress Modal */}
      {uploadModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Upload Lab Deliverable & Progress
                </h3>
                <p className="text-xs text-muted-foreground">
                  {uploadModalProject.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalProject(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Progress Percentage Update (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={(e) => setProgressValue(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="text-sm font-mono font-bold w-12 text-right">
                    {progressValue}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Sprint Summary & Notes
                </label>
                <textarea
                  rows={3}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Describe your laboratory benchmarks, code revisions, or sensor calibration results..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="rounded-2xl border border-dashed border-border p-4 text-center space-y-2 bg-muted/20">
                <UploadCloud className="h-6 w-6 mx-auto text-primary" />
                <p className="text-xs font-semibold text-foreground">
                  Drag & Drop deliverable files (PDF, Code, CSV, CAD)
                </p>
                <p className="text-[10px] text-muted-foreground">Maximum payload: 50MB</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadModalProject(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={uploadProgressMutation.isPending}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Submit Deliverable
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
