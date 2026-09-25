'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Users,
  FolderGit2,
  CheckCheck,
  Cpu,
  Microscope,
  Sparkles,
  Landmark,
  HeartHandshake,
  Compass,
  Clock,
  Trophy,
  Flame,
  Rocket,
  MapPin,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { CreditActivity } from '../../../types/student-contribution';

interface CreditBreakdownGridProps {
  activities: CreditActivity[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  AlertCircle,
  CheckCircle2,
  Users,
  FolderGit2,
  CheckCheck,
  Cpu,
  Microscope,
  Sparkles,
  Landmark,
  HeartHandshake,
  Compass,
  Clock,
  Trophy,
  Flame,
  Rocket,
  MapPin,
};

export function CreditBreakdownGrid({ activities }: CreditBreakdownGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = [
    'All',
    'Grievance & Verification',
    'Research & Innovation',
    'Community & NSS/NCC',
    'Competitions & Deployment',
  ];

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalEarnedCredits = activities.reduce((acc, a) => acc + a.creditsEarned, 0);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Credit Breakdown by Activity
            </h2>
            <Badge variant="outline" className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
              16 Tracked Dimensions
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Societal impact credits earned across citizen verification, lab innovations, NSS/NCC drives, and deployments
          </p>
        </div>

        {/* Total aggregate pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-muted/60 border border-border text-xs font-semibold">
          <span className="text-muted-foreground">Aggregate Earned:</span>
          <span className="font-black text-foreground text-sm text-cyan-600 dark:text-cyan-400">
            {totalEarnedCredits} Credits
          </span>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
          />
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredActivities.map((act) => {
          const Icon = ICON_MAP[act.iconName] || CheckCircle2;
          const isComplete = act.completionPercentage >= 100;

          // Color coded progress bar
          const getProgressBarColor = (pct: number) => {
            if (pct >= 100) return 'bg-emerald-500';
            if (pct >= 75) return 'bg-cyan-500';
            if (pct >= 50) return 'bg-blue-500';
            return 'bg-amber-500';
          };

          return (
            <div
              key={act.id}
              className="group relative rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-cyan-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon & Completion status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>

                  {isComplete ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Check className="h-3 w-3 stroke-[3]" />
                      Maxed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      {act.completionPercentage}% Done
                    </span>
                  )}
                </div>

                {/* Activity Name */}
                <h3 className="font-bold text-sm text-foreground leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {act.name}
                </h3>

                {/* Sub category */}
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">
                  {act.category}
                </p>
              </div>

              {/* Credits & Progress Indicator */}
              <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {act.creditsEarned} <span className="text-[10px] text-muted-foreground font-normal">/ {act.maxCredits} Credits</span>
                  </span>
                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    {act.completedCount} logged
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                      act.completionPercentage
                    )}`}
                    style={{ width: `${Math.min(act.completionPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-sm font-semibold text-muted-foreground">No activities found matching your filter.</p>
        </div>
      )}
    </div>
  );
}
