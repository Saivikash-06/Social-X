'use client';

import * as React from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CreditScoreData, CreditHistoryMonth, CreditTier } from '../../../types/student-contribution';

interface CreditScoreRadialProps {
  scoreData: CreditScoreData;
  history: CreditHistoryMonth[];
}

const TIERS: { name: CreditTier; min: number; max: number; color: string; bg: string }[] = [
  { name: 'Bronze', min: 0, max: 200, color: '#d97706', bg: 'bg-amber-500/10 text-amber-600' },
  { name: 'Silver', min: 200, max: 400, color: '#94a3b8', bg: 'bg-slate-500/10 text-slate-500' },
  { name: 'Gold', min: 400, max: 700, color: '#eab308', bg: 'bg-yellow-500/10 text-yellow-600' },
  { name: 'Platinum', min: 700, max: 1000, color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-500' },
  { name: 'Diamond', min: 1000, max: 1500, color: '#8b5cf6', bg: 'bg-violet-500/10 text-violet-600' },
];

export function CreditScoreRadial({ scoreData, history }: CreditScoreRadialProps) {
  // Circular gauge parameters
  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Level progress percentage capped at 100%
  const progressRatio = Math.min(
    Math.max(scoreData.currentScore / scoreData.nextLevelThreshold, 0),
    1
  );
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left: Large Circular Progress Indicator */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* SVG circular track & animated progress */}
            <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
              <defs>
                <linearGradient id="creditScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background track circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-muted/30 dark:stroke-muted/20"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Foreground progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#creditScoreGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: 'url(#glow)',
                }}
              />
            </svg>

            {/* Inner Content Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Contribution Score
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {scoreData.currentScore}
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  Credits
                </span>
              </div>

              {/* Current Tier Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                Level: {scoreData.currentLevel}
              </div>

              {/* Sub-ratio */}
              <p className="text-[11px] font-medium text-muted-foreground mt-2">
                {scoreData.currentScore} / {scoreData.nextLevelThreshold} Credits
              </p>
            </div>
          </div>

          {/* Goal remaining tag */}
          <div className="mt-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5 text-violet-500" />
            <span>
              <strong className="text-foreground font-black">{scoreData.creditsRemaining} Credits</strong> Remaining to {scoreData.nextLevel}
            </span>
          </div>
        </div>

        {/* Right: Tier Progress Roadmap & Monthly Growth Graph */}
        <div className="flex-1 w-full space-y-6">
          {/* Tier levels stepper */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Credit Tier Progression
              </span>
              <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                Top {scoreData.percentileRank}% Campus Contributor
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {TIERS.map((tier) => {
                const isCurrent = tier.name === scoreData.currentLevel;
                const isPassed =
                  scoreData.currentScore >= tier.min;

                return (
                  <div
                    key={tier.name}
                    className={`relative p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-sm ring-1 ring-cyan-500/50'
                        : isPassed
                        ? 'border-border/80 bg-muted/30 text-muted-foreground'
                        : 'border-dashed border-border/40 bg-muted/10 opacity-50'
                    }`}
                  >
                    <div className="text-[10px] sm:text-xs font-bold truncate">
                      {tier.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-mono mt-0.5">
                      {tier.min}+
                    </div>
                    {isCurrent && (
                      <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trajectory Recharts Graph */}
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Credit Accumulation Velocity
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Consecutive monthly innovation & verification score trajectory
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                +190 this month
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-36 sm:h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={history}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-border bg-popover p-2.5 shadow-md text-xs">
                            <div className="font-semibold text-foreground">{label}</div>
                            <div className="text-cyan-600 dark:text-cyan-400 font-bold mt-1">
                              Cumulative: {payload[0].value} Credits
                            </div>
                            <div className="text-muted-foreground text-[10px]">
                              Earned: +{payload[0].payload.credits} credits
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#historyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
