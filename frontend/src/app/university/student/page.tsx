'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FolderGit2,
  CheckSquare,
  UploadCloud,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { StudentTaskChecklist } from '@/features/university/components/student/student-task-checklist';
import {
  useStudentDashboardStats,
  useStudentProjects,
  useStudentTasks,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useTranslation } from '@/features/shared/i18n';
import {
  RECENT_ACTIVITY,
  UPCOMING_DEADLINES,
  PROJECTS,
  NOTIFICATIONS,
  ACHIEVEMENTS,
  STATS,
} from '@/features/university/constants/student-data';
import { IndustryCollaborationsPanel } from '@/features/university/components/IndustryCollaborationsPanel';

export default function StudentDashboardPage() {
  const { t } = useTranslation();
  const { currentUser, toggleNotificationPanel, unreadNotificationsCount } = useUniversityStore();
  const { data: stats, isLoading: isStatsLoading } = useStudentDashboardStats('usr-student-01');
  const { data: projects = [], isLoading: isProjectsLoading } = useStudentProjects('usr-student-01');
  const { data: tasks = [] } = useStudentTasks('usr-student-01');

  const studentWidgets = [
    {
      key: 'projects',
      title: t('university.assignedProjects', 'Assigned Projects'),
      value: stats?.assignedProjects ?? 2,
      subtext: t('university.cleanEnergyIoT', 'Urban Clean Energy & IoT'),
      icon: FolderGit2,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      href: '/university/projects',
    },
    {
      key: 'resolution',
      title: t('university.pendingTasks', 'Pending Tasks'),
      value: stats?.pendingTasks ?? 3,
      subtext: t('university.sprintDueThisWeek', '1 sprint due this week'),
      icon: CheckSquare,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      href: '/university/student/tasks',
    },
    {
      key: 'credits',
      title: t('university.creditsEarned', 'Credits Earned'),
      value: '18 / 20',
      subtext: t('university.academicGrantQuota', 'Academic grant quota 90%'),
      icon: Award,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      href: '/university/credits',
    },
    {
      key: 'skill_score',
      title: t('university.skillScore', 'Skill Score'),
      value: '940 / 1000',
      subtext: t('university.topResearchPercentile', 'Top 3% research percentile'),
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      href: '/university/credits',
    },
    {
      key: 'innovation',
      title: t('university.innovationPoints', 'Innovation Points'),
      value: '880 Pts',
      subtext: t('university.sihFinalistPrototypes', 'SIH Finalist + 2 Prototypes'),
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      href: '/university/innovation',
    },
    {
      key: 'certificates',
      title: t('university.certificatesEarned', 'Certificates Earned'),
      value: `4 ${t('common.status.issued', 'Issued')}`,
      subtext: t('university.verifiedByAgencies', 'Verified by BWSSB & PWD'),
      icon: FileCheck2,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      href: '/university/credits',
    },
    {
      key: 'notifications',
      title: t('university.realtimeAlerts', 'Realtime Alerts'),
      value: `${unreadNotificationsCount} ${t('common.labels.new', 'New')}`,
      subtext: t('university.advisorRemarks', 'Advisor remarks & milestones'),
      icon: Bell,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      onClick: toggleNotificationPanel,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-card to-background p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{t('university.studentFellow', 'Student Research Fellow')} • {currentUser?.rollNumber || 'CS-2024-8902'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('university.welcomeBack', 'Welcome back')}, {currentUser?.name || 'Alex Rivera'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {currentUser?.institution || 'Stanford University'} •{' '}
              {currentUser?.department || 'Department of Computer Science'}. {t('university.studentBannerSupervised', 'Supervised by Dr. Elena Rostova on municipal infrastructure telemetry.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/university/credits">
                <Award className="h-4 w-4 text-amber-500" />
                {t('university.viewBadgesCredits', 'View Badges & Credits')}
              </Link>
            </Button>
            <Button asChild className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
              <Link href="/university/student/uploads">
                <UploadCloud className="h-4 w-4" />
                {t('university.uploadProgress', 'Upload Progress')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Student KPI Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {studentWidgets.map((card, idx) => {
          const Icon = card.icon;
          const content = (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-cyan-500/40 cursor-pointer h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider line-clamp-1">
                  {card.title}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  {card.value}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                {card.subtext}
              </p>
            </motion.div>
          );

          if (card.onClick) {
            return (
              <div key={card.title} onClick={card.onClick}>
                {content}
              </div>
            );
          }

          return (
            <Link key={card.title} href={card.href || '#'}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Industry Innovation & Mentorship Sprints */}
      <IndustryCollaborationsPanel viewMode="student" />

      {/* Project Timeline & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Timeline */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                {t('university.sprintTimelineTitle', 'Project Sprint Timeline & Milestones')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('university.assignedSprintsFor', 'Assigned research sprints for')} {projects[0]?.title || 'Acoustic Pipeline Detection'}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href={`/university/projects/${projects[0]?.id || 'PRJ-2026-001'}`}>
                {t('university.workspace', 'Workspace')}
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Timeline Visual Steps */}
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            <div className="relative flex items-start gap-4 pl-8">
              <span className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground">
                    {t('university.phase1Title', 'Phase 1: Sensor Array Fabrication & Bench Testing')}
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {t('common.status.approved', 'Approved')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('university.phase1Desc', 'Piezoelectric transducers calibrated in controlled flume under 4 bar pressure.')}
                </p>
                <span className="text-[10px] text-muted-foreground block">{t('university.phase1Completed', 'Completed Aug 28, 2026')}</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4 pl-8">
              <span className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full bg-cyan-500 ring-4 ring-background animate-pulse" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground">
                    {t('university.phase2Title', 'Phase 2: Indiranagar Ward 142 Field Pilot')}
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
                    {t('university.activeSprint', 'Active Sprint')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('university.phase2Desc', '12 telemetry nodes along 14th Main road water corridor under noise threshold check.')}
                </p>
                <span className="text-[10px] text-primary font-semibold block">{t('university.targetDate', 'Target: Sep 25, 2026')}</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4 pl-8">
              <span className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full bg-muted border border-border ring-4 ring-background" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    {t('university.phase3Title', 'Phase 3: Automated Valve Actuation & Dashboard Integration')}
                  </h4>
                  <Badge variant="outline" className="text-[10px]">
                    {t('common.status.upcoming', 'Upcoming')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('university.phase3Desc', 'Real-time acoustic alert transmission directly into BWSSB municipal control room.')}
                </p>
                <span className="text-[10px] text-muted-foreground block">{t('university.targetDateNov', 'Target: Nov 15, 2026')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Progress Checklist */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                {t('university.assignedLabTasks', 'Assigned Lab Tasks')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('university.currentSprintChecklist', 'Current sprint deliverable checklist')}
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {tasks.length} {t('university.tasks', 'Tasks')}
            </Badge>
          </div>

          <StudentTaskChecklist />
        </div>
      </div>

      {/* Two Columns: Upcoming Deadlines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Deadlines */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-500" />
              {t('university.upcomingDeliverables', 'Upcoming Deliverable Deadlines')}
            </h3>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{t('common.status.urgent', 'Urgent')}</span>
          </div>

          <div className="space-y-3">
            {UPCOMING_DEADLINES.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground line-clamp-1">
                    {item.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      item.urgency === 'critical'
                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {item.due}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {item.project}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              {t('university.recentActivityTitle', 'Recent Research Activity & Achievements')}
            </h3>
            <span className="text-xs text-muted-foreground">{t('university.verifiedLog', 'Verified Log')}</span>
          </div>

          <div className="space-y-3 divide-y divide-border/60">
            {RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="pt-3 first:pt-0 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {act.title}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {act.badge || act.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {act.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
