'use client';

import * as React from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  MapPin,
  BrainCircuit,
  Hammer,
  Users2,
  Sparkles,
  Lock,
  Award,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react';
import { StudentBadge, CreditTier } from '../../../types/student-contribution';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/features/shared/components/ui/dialog';
import { Button } from '@/features/shared/components/ui/button';

interface BadgesShowcaseProps {
  badges: StudentBadge[];
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  HeartHandshake,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  MapPin,
  BrainCircuit,
  Hammer,
  Users2,
};

const TIER_STYLES: Record<
  CreditTier,
  {
    border: string;
    bg: string;
    text: string;
    halo: string;
    iconColor: string;
    starCount: number;
  }
> = {
  Diamond: {
    border: 'border-violet-500/50 hover:border-violet-400',
    bg: 'bg-gradient-to-b from-violet-500/15 via-fuchsia-500/10 to-indigo-500/15',
    text: 'text-violet-600 dark:text-violet-400',
    halo: 'shadow-violet-500/20 shadow-lg',
    iconColor: 'text-violet-500',
    starCount: 4,
  },
  Platinum: {
    border: 'border-cyan-500/50 hover:border-cyan-400',
    bg: 'bg-gradient-to-b from-cyan-500/15 via-sky-500/10 to-blue-500/15',
    text: 'text-cyan-600 dark:text-cyan-400',
    halo: 'shadow-cyan-500/20 shadow-lg',
    iconColor: 'text-cyan-500',
    starCount: 4,
  },
  Gold: {
    border: 'border-amber-400/50 hover:border-amber-300',
    bg: 'bg-gradient-to-b from-amber-400/15 via-yellow-500/10 to-amber-600/15',
    text: 'text-amber-600 dark:text-amber-400',
    halo: 'shadow-amber-500/20 shadow-lg',
    iconColor: 'text-amber-500',
    starCount: 3,
  },
  Silver: {
    border: 'border-slate-400/50 hover:border-slate-300',
    bg: 'bg-gradient-to-b from-slate-400/15 via-slate-300/10 to-slate-500/15',
    text: 'text-slate-600 dark:text-slate-300',
    halo: 'shadow-slate-500/20 shadow-lg',
    iconColor: 'text-slate-400',
    starCount: 2,
  },
  Bronze: {
    border: 'border-orange-700/40 hover:border-orange-600',
    bg: 'bg-gradient-to-b from-amber-800/15 via-orange-700/10 to-amber-900/15',
    text: 'text-amber-700 dark:text-amber-500',
    halo: 'shadow-orange-500/15 shadow-md',
    iconColor: 'text-amber-700 dark:text-amber-500',
    starCount: 1,
  },
};

export function BadgesShowcase({ badges }: BadgesShowcaseProps) {
  const [selectedBadge, setSelectedBadge] = React.useState<StudentBadge | null>(null);
  const [filter, setFilter] = React.useState<'All' | 'Unlocked' | 'In Progress'>('All');

  const filteredBadges = badges.filter((b) => {
    if (filter === 'Unlocked') return b.unlocked;
    if (filter === 'In Progress') return !b.unlocked;
    return true;
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Achievement Badges
            </h2>
            <Badge variant="outline" className="text-xs font-mono font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30">
              {unlockedCount} / {badges.length} Unlocked
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Recognition honors modeled after competitive coding tiers (Bronze, Silver, Gold, Diamond)
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs">
          {(['All', 'Unlocked', 'In Progress'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = BADGE_ICONS[badge.iconName] || Award;
          const style = TIER_STYLES[badge.tier];

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col items-center text-center ${
                badge.unlocked
                  ? `${style.border} ${style.bg} ${style.halo} hover:scale-[1.02]`
                  : 'border-dashed border-border/80 bg-muted/10 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Tier Star indicator */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < style.starCount
                        ? `${style.iconColor} fill-current`
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              {/* Central Hexagon / Emblem */}
              <div className="relative mb-4 flex items-center justify-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-card border-2 ${
                    badge.unlocked ? style.border : 'border-border'
                  } shadow-md group-hover:rotate-6 transition-transform`}
                >
                  {badge.unlocked ? (
                    <Icon className={`h-8 w-8 ${style.iconColor}`} />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Micro Sparkle overlay */}
                {badge.tier === 'Diamond' && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                  </span>
                )}
              </div>

              {/* Badge Title */}
              <h3 className="font-bold text-sm text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {badge.name}
              </h3>

              {/* Tier Pill */}
              <div className="mt-1 flex items-center gap-1">
                <span className={`text-xs font-black uppercase tracking-wider ${style.text}`}>
                  {badge.tier}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {badge.unlocked ? badge.earnedDate : 'Locked'}
                </span>
              </div>

              {/* Short snippet */}
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {badge.description}
              </p>

              <div className="mt-4 pt-3 w-full border-t border-border/40 flex items-center justify-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                <span>View Criteria</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Details Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        {selectedBadge && (
          <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
            <DialogHeader className="flex flex-col items-center text-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-3xl border-2 ${
                  TIER_STYLES[selectedBadge.tier].border
                } ${TIER_STYLES[selectedBadge.tier].bg} shadow-lg mb-3`}
              >
                {React.createElement(
                  BADGE_ICONS[selectedBadge.iconName] || Award,
                  { className: `h-10 w-10 ${TIER_STYLES[selectedBadge.tier].iconColor}` }
                )}
              </div>

              <DialogTitle className="text-xl font-black text-foreground">
                {selectedBadge.name}
              </DialogTitle>

              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`font-bold uppercase tracking-wider ${TIER_STYLES[selectedBadge.tier].text}`}
                >
                  {selectedBadge.tier} Tier
                </Badge>
                {selectedBadge.unlocked ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Earned on {selectedBadge.earnedDate}
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Tier In Progress
                  </span>
                )}
              </div>

              <DialogDescription className="text-sm text-muted-foreground mt-3">
                {selectedBadge.description}
              </DialogDescription>
            </DialogHeader>

            {/* Criteria & Next Tier Progression */}
            <div className="space-y-3 mt-4 pt-4 border-t border-border">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  Next Level Requirement
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedBadge.nextTierCriteria || 'Congratulations! You have reached the pinnacle Diamond rank for this achievement.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedBadge(null)}
                className="rounded-xl"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
