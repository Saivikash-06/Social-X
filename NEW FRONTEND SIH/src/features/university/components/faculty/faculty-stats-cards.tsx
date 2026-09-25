'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Users,
  FileCheck2,
  BookOpen,
  TrendingUp,
  Sparkles,
  Building2,
  Clock,
  Bell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { FacultyDashboardStats } from '@/features/university/types';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useTranslation } from 'react-i18next';

interface FacultyStatsCardsProps {
  stats?: FacultyDashboardStats;
  isLoading?: boolean;
}

export function FacultyStatsCards({ stats, isLoading }: FacultyStatsCardsProps) {
  const { t } = useTranslation();
  const { toggleNotificationPanel, unreadNotificationsCount } = useUniversityStore();

  const cards = [
    {
      key: 'projects',
      title: t('active_projects', 'Active Projects'),
      value: stats?.activeProjects ?? 5,
      subtext: '3 Municipal + 2 Grants',
      icon: FolderGit2,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      href: '/university/projects',
    },
    {
      key: 'resolution',
      title: t('resolution', 'Pending Approvals'),
      value: stats?.pendingReviewsCount ?? 2,
      subtext: 'Awaiting faculty sign-off',
      icon: FileCheck2,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      href: '/university/faculty/approvals',
    },
    {
      key: 'teams',
      title: t('teams', 'Student Teams'),
      value: stats?.studentTeamsCount ?? 3,
      subtext: '14 Researchers active',
      icon: Users,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      href: '/university/teams',
    },
    {
      key: 'research',
      title: t('research', 'Research Progress'),
      value: `${stats?.averageMilestoneCompletionRate ?? 78}%`,
      subtext: '+12% above quarterly velocity',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      href: '/university/faculty/reports',
    },
    {
      key: 'innovation',
      title: t('innovation', 'Innovation Score'),
      value: `${stats?.innovationScore ?? 94}/100`,
      subtext: 'Top 5% statewide university rank',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      href: '/university/innovation',
    },
    {
      key: 'government',
      title: t('government_portal', 'Government Requests'),
      value: stats?.governmentRequestsCount ?? 3,
      subtext: 'BWSSB, BBMP & PWD inquiries',
      icon: Building2,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      href: '/university/faculty/proposals',
    },
    {
      key: 'deadlines',
      title: t('track_issues', 'Upcoming Deadlines'),
      value: '2 Due',
      subtext: 'Ward 142 bench test in 48h',
      icon: Clock,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      href: '/university/projects',
    },
    {
      key: 'notifications',
      title: t('notifications', 'Realtime Alerts'),
      value: `${unreadNotificationsCount} New`,
      subtext: 'Instant civic dispatches',
      icon: Bell,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      onClick: toggleNotificationPanel,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-border bg-card/60 p-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const content = (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-primary/40 cursor-pointer h-full flex flex-col justify-between"
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
  );
}
