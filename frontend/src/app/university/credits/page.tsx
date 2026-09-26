'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  Trophy,
  Star,
  Sparkles,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  FileCheck,
  TrendingUp,
  Search,
  Filter,
  Download,
  Share2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import {
  INITIAL_CREDIT_SCORE,
  CREDIT_ACTIVITIES,
  STUDENT_BADGES,
  PROJECT_STATISTICS,
  LEADERBOARD_ENTRIES,
  STUDENT_CERTIFICATES,
  CREDIT_MONTHLY_HISTORY,
} from '@/features/university/services/student-contribution-data';
import { CreditScoreRadial } from '@/features/university/components/student/profile/credit-score-radial';
import { BadgesShowcase } from '@/features/university/components/student/profile/badges-showcase';
import { LeaderboardTable } from '@/features/university/components/student/profile/leaderboard-table';
import { CertificatesGallery } from '@/features/university/components/student/profile/certificates-gallery';

export default function UniversityCreditsPage() {
  const { role, user } = useUniversityStore();
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'breakdown' | 'badges' | 'leaderboard' | 'certificates'
  >('overview');
  const [leaderboardFilter, setLeaderboardFilter] = React.useState<
    'university' | 'department' | 'semester'
  >('university');

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

  // Gamified Badges customized as requested
  const customBadges = [
    {
      id: 'b-01',
      name: 'Civic Contributor',
      tier: 'Bronze',
      symbol: '🥉',
      earnedDate: 'Sep 2025',
      description: 'Logged 25+ verified field hours on civic infrastructure audits.',
      unlocked: true,
      criteria: 'Complete 1 municipal inspection task',
    },
    {
      id: 'b-02',
      name: 'Innovation Explorer',
      tier: 'Silver',
      symbol: '🥈',
      earnedDate: 'Nov 2025',
      description: 'Submitted 3 approved AI algorithms for smart municipal operations.',
      unlocked: true,
      criteria: 'Pass peer technical review',
    },
    {
      id: 'b-03',
      name: 'Smart Governance Champion',
      tier: 'Gold',
      symbol: '🥇',
      earnedDate: 'Jan 2026',
      description: 'Led an interdisciplinary team solving top-tier MoHUA civic challenges.',
      unlocked: true,
      criteria: 'Achieve >90% project milestone completion',
    },
    {
      id: 'b-04',
      name: 'Diamond Researcher',
      tier: 'Diamond',
      symbol: '💎',
      earnedDate: 'In Progress (85%)',
      description: 'Co-authored a peer-reviewed research paper deployed in live municipal sandbox.',
      unlocked: false,
      criteria: 'Publish pre-print with DOI citation',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="h-7 w-7 text-amber-500" />
            Student Academic Credit & Impact System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gamified recognition, institutional credit scoring, civic badges,
            and University Hall of Fame.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-xs"
            onClick={() =>
              toast.success(
                'Academic Credit Transcript exported as tamper-proof cryptographically signed PDF.'
              )
            }
          >
            <Download className="h-4 w-4" />
            Export Credit Transcript
          </Button>
        </div>
      </div>

      {/* Hero Stats Grid (LeetCode / GitHub Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Credit Score
          </span>
          <p className="text-2xl font-black text-primary mt-1">
            {INITIAL_CREDIT_SCORE.currentScore}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">
            Tier: {INITIAL_CREDIT_SCORE.currentLevel}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Community Impact
          </span>
          <p className="text-2xl font-black text-foreground mt-1">94/100</p>
          <span className="text-[10px] text-emerald-500 font-semibold">
            Top 5% University
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Research Contrib.
          </span>
          <p className="text-2xl font-black text-foreground mt-1">
            {PROJECT_STATISTICS.researchPapers} Papers
          </p>
          <span className="text-[10px] text-blue-500 font-semibold">
            2 Preprints Indexed
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Innovation Score
          </span>
          <p className="text-2xl font-black text-amber-500 mt-1">92.4</p>
          <span className="text-[10px] text-amber-600 font-semibold">
            TRL-6 Prototypes
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Volunteer Hours
          </span>
          <p className="text-2xl font-black text-foreground mt-1">
            {PROJECT_STATISTICS.hoursContributed} hrs
          </p>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Geo-verified logs
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Projects Done
          </span>
          <p className="text-2xl font-black text-emerald-500 mt-1">
            {PROJECT_STATISTICS.completedProjects}
          </p>
          <span className="text-[10px] text-muted-foreground font-semibold">
            100% On Time
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Certificates
          </span>
          <p className="text-2xl font-black text-purple-500 mt-1">
            {STUDENT_CERTIFICATES.length}
          </p>
          <span className="text-[10px] text-purple-500 font-semibold">
            MoHUA Endorsed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Credit Gauge & Growth', icon: TrendingUp },
          { id: 'breakdown', label: 'Activity Breakdown', icon: Flame },
          { id: 'badges', label: 'Badges & Honors', icon: Award },
          { id: 'leaderboard', label: 'University Hall of Fame', icon: Trophy },
          { id: 'certificates', label: 'Verified Certificates', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & RADIAL SCORE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <CreditScoreRadial
            scoreData={INITIAL_CREDIT_SCORE}
            history={CREDIT_MONTHLY_HISTORY}
          />
        </div>
      )}

      {/* TAB 2: ACTIVITY BREAKDOWN */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <Badge variant="outline" className="text-[11px]">
                  {act.category}
                </Badge>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">
                  {act.name}
                </h4>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-muted-foreground">Credits Earned</span>
                  <span className="font-bold text-primary">
                    {act.creditsEarned} / {act.maxCredits}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${act.completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground flex justify-between items-center pt-2 border-t border-border">
                <span>Completed: {act.completedCount} units</span>
                <span className="text-emerald-500 font-semibold">
                  {act.completionPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BADGES & HONORS */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {customBadges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  badge.unlocked
                    ? 'border-border bg-card hover:border-primary/40'
                    : 'border-dashed border-border/70 bg-card/40 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{badge.symbol}</span>
                    <Badge
                      className={`text-xs font-semibold ${
                        badge.unlocked
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {badge.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/80 text-xs">
                  <span className="text-muted-foreground block text-[10px]">
                    Status / Criteria
                  </span>
                  <span className="font-medium text-foreground">
                    {badge.unlocked ? `Achieved: ${badge.earnedDate}` : badge.criteria}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <BadgesShowcase badges={STUDENT_BADGES} />
        </div>
      )}

      {/* TAB 4: LEADERBOARD & HALL OF FAME */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Hall of Fame Podium */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-card to-card p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Academic Year 2025-2026
              </span>
              <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                University Hall of Fame
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Celebrating outstanding scholars whose research and field deployments
                directly uplifted urban municipal systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* 2nd Place */}
              <div className="rounded-2xl border border-border bg-card p-5 text-center space-y-2 order-2 md:order-1">
                <span className="text-3xl">🥈</span>
                <Badge variant="outline" className="text-xs">
                  Rank 2 (Silver)
                </Badge>
                <h4 className="font-bold text-foreground">Aarav Patel</h4>
                <p className="text-xs text-muted-foreground">
                  Electronics & IoT • 942 Credits
                </p>
                <span className="text-xs text-emerald-500 font-semibold block">
                  Pothole Detection Array
                </span>
              </div>

              {/* 1st Place */}
              <div className="rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/5 p-6 text-center space-y-2 order-1 md:order-2 shadow-lg">
                <span className="text-4xl">👑 🥇</span>
                <Badge className="bg-yellow-500 text-black font-bold text-xs">
                  Rank 1 (Champion)
                </Badge>
                <h3 className="text-lg font-bold text-foreground">
                  Ananya Sharma
                </h3>
                <p className="text-xs text-muted-foreground">
                  AI & Data Science • 1,180 Credits
                </p>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold block">
                  MoHUA National Smart City Fellowship Winner
                </span>
              </div>

              {/* 3rd Place */}
              <div className="rounded-2xl border border-border bg-card p-5 text-center space-y-2 order-3">
                <span className="text-3xl">🥉</span>
                <Badge variant="outline" className="text-xs">
                  Rank 3 (Bronze)
                </Badge>
                <h4 className="font-bold text-foreground">Karthik Raja</h4>
                <p className="text-xs text-muted-foreground">
                  Civil Engineering • 890 Credits
                </p>
                <span className="text-xs text-emerald-500 font-semibold block">
                  Drainage Overflow Network
                </span>
              </div>
            </div>
          </div>

          <LeaderboardTable entries={LEADERBOARD_ENTRIES} currentUserId={user?.id} />
        </div>
      )}

      {/* TAB 5: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <CertificatesGallery
            certificates={STUDENT_CERTIFICATES}
            studentName={user?.name || 'Alex Johnson'}
          />
        </div>
      )}
    </div>
  );
}
