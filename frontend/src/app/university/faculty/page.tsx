'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  BookOpen,
  Calendar,
  Sparkles,
  Building2,
  Video,
  FileSpreadsheet,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { FacultyStatsCards } from '@/features/university/components/faculty/faculty-stats-cards';
import { FacultyProjectAnalytics } from '@/features/university/components/faculty/faculty-project-analytics';
import { AssignStudentsModal } from '@/features/university/components/faculty/assign-students-modal';
import {
  useFacultyDashboardStats,
  useFacultyProjects,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { ResearchProject } from '@/features/university/types';
import { IndustryCollaborationsPanel } from '@/features/university/components/IndustryCollaborationsPanel';
import { useTranslation } from '@/features/shared/i18n';

export default function FacultyDashboardPage() {
  const { t } = useTranslation();
  const { currentUser, toggleNotificationPanel } = useUniversityStore();
  const { data: stats, isLoading: isStatsLoading } = useFacultyDashboardStats();
  const { data: projects = [], isLoading: isProjectsLoading } = useFacultyProjects();

  const [selectedProjectForTeam, setSelectedProjectForTeam] =
    React.useState<ResearchProject | null>(null);

  const pendingMilestonesCount = 2;

  const UPCOMING_MEETINGS = [
    {
      id: 'm-1',
      title: 'BWSSB Indiranagar Pilot Review & Telemetry Sign-Off',
      time: 'Today, 03:30 PM - 04:30 PM',
      organizer: 'Chief Engineer K. Venkatesh (BWSSB)',
      location: 'Virtual Video Sync / Room 402',
      type: 'Government Advisory',
      status: 'In 3 Hours',
    },
    {
      id: 'm-2',
      title: 'Weekly Ph.D. Sensor & Firmware Sprint Standup',
      time: 'Tomorrow, 10:00 AM - 11:30 AM',
      organizer: 'Dr. Elena Rostova',
      location: 'Acoustic Signal Processing Lab, Hall 3B',
      type: 'Lab Sync',
      status: 'Tomorrow',
    },
    {
      id: 'm-3',
      title: 'Karnataka Urban Tech Grant Committee Evaluation',
      time: 'Friday, 02:00 PM - 04:00 PM',
      organizer: 'State Directorate of Municipal Administration',
      location: 'Civil Secretariat Chamber / Hybrid',
      type: 'Grant Board',
      status: 'This Week',
    },
  ];

  const RECENT_ACTIVITY_FEED = [
    {
      id: 'act-1',
      title: 'Acoustic waveform calibration benchmark uploaded',
      student: 'Rohan Varma (Ph.D. Year 2)',
      project: 'Acoustic Sensor Pipeline Leakage Detection',
      time: '25 mins ago',
      type: 'upload',
    },
    {
      id: 'act-2',
      title: 'Karnataka PWD accepted computer vision road distress proposal',
      student: 'Municipal Innovation Desk',
      project: 'Computer Vision Edge Depth Estimation',
      time: '2 hours ago',
      type: 'approval',
    },
    {
      id: 'act-3',
      title: 'Lab firmware flashed to 12 telemetry edge nodes',
      student: 'Karthik Subramanian (B.Tech Senior)',
      project: 'Acoustic Sensor Pipeline Leakage Detection',
      time: '5 hours ago',
      type: 'milestone',
    },
    {
      id: 'act-4',
      title: 'New Municipal Research Problem Statement Dispatched',
      student: 'Solid Waste Management Corporation',
      project: 'KR Market Pyrolysis Micro-Unit',
      time: 'Yesterday',
      type: 'government',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t('university.facultyAdvisorTitle', 'Principal Investigator & Research Advisor')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('university.welcomeBack', 'Welcome back')}, {currentUser?.name || 'Dr. Elena Rostova'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {currentUser?.institution || 'Stanford University'} •{' '}
              {currentUser?.department || 'Civil & Environmental Engineering'}. {t('university.supervisingProjects', 'You are supervising 5 municipal research projects with 14 student fellows.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/university/research">
                <BookOpen className="h-4 w-4" />
                {t('university.researchHub', 'Research Hub')}
              </Link>
            </Button>
            <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
              <Link href="/university/faculty/proposals">
                <PlusCircle className="h-4 w-4" />
                {t('university.adoptProposal', 'Adopt Proposal')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 8 Required Faculty KPI Widgets */}
      <FacultyStatsCards stats={stats} isLoading={isStatsLoading} />

      {/* 4 Required Faculty Analytics Charts */}
      <FacultyProjectAnalytics />

      {/* Industry-University Collaboration & Student Mentorship */}
      <IndustryCollaborationsPanel viewMode="faculty" />

      {/* Supervised Projects Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              {t('university.supervisedProjects', 'Supervised Research Projects')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t('university.supervisedProjectsSub', 'Real-time progress, laboratory teams, and student assignments')}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/university/projects">
              {t('common.buttons.viewAllProjects', 'View All Projects')}
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.slice(0, 4).map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {project.code || project.id}
                  </Badge>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      project.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : project.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : project.status === 'review'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {t(`common.status.${project.status.toLowerCase()}`, project.status.replace('_', ' '))}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground line-clamp-1">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {project.problemStatement}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      {t('university.milestonesCompleted', 'Milestones Completed')}
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

                {/* Details Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>{(project.assignedStudentIds?.length ?? project.assignedStudents?.length ?? 0)} {t('university.studentFellows', 'Student Fellows')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('university.targetLabel', 'Target')}: {project.deadline || project.targetCompletionDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProjectForTeam(project)}
                  className="gap-1.5 text-xs"
                >
                  <UserPlus className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  {t('university.assignStudents', 'Assign Students')}
                </Button>

                <Button asChild size="sm" className="gap-1.5 text-xs">
                  <Link href={`/university/projects/${project.id}`}>
                    {t('university.inspectWorkspace', 'Inspect Workspace')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Activity Feed & Upcoming Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t('university.academicActivityFeed', 'Recent Academic Activity Feed')}
            </h3>
            <span className="text-xs text-muted-foreground">{t('university.liveTelemetry', 'Live Telemetry')}</span>
          </div>

          <div className="space-y-3 divide-y divide-border/60">
            {RECENT_ACTIVITY_FEED.map((act) => (
              <div key={act.id} className="pt-3 first:pt-0 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {act.student} • <span className="text-primary font-medium">{act.project}</span>
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              {t('university.upcomingMeetingsTitle', 'Upcoming Meetings & Debriefs')}
            </h3>
            <span className="text-xs text-muted-foreground">{UPCOMING_MEETINGS.length} {t('university.scheduled', 'Scheduled')}</span>
          </div>

          <div className="space-y-3">
            {UPCOMING_MEETINGS.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 rounded-2xl border border-border/80 bg-muted/20 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground line-clamp-1">
                    {meeting.title}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                    {meeting.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {meeting.time}
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  {meeting.organizer} • {meeting.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Reviews Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {pendingMilestonesCount} {t('university.milestonesAwaitingSignOff', 'Research Milestones Awaiting Faculty Sign-Off')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('university.milestonesAwaitingDesc', 'Student lab fellows submitted code & sensor benchmarks for Phase II verification.')}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 text-xs">
          <Link href="/university/faculty/approvals">
            {t('university.reviewMilestones', 'Review Milestones')}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Assign Students Modal */}
      <AssignStudentsModal
        project={selectedProjectForTeam}
        isOpen={Boolean(selectedProjectForTeam)}
        onClose={() => setSelectedProjectForTeam(null)}
      />
    </div>
  );
}
