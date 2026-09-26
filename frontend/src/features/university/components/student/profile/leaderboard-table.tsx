'use client';

import * as React from 'react';
import {
  Trophy,
  Medal,
  Award,
  Filter,
  Search,
  ChevronDown,
  Sparkles,
  User,
  ArrowUpDown,
  Star,
} from 'lucide-react';
import { LeaderboardEntry, CreditTier } from '../../../types/student-contribution';
import { Badge } from '@/features/shared/components/ui/badge';
import { Input } from '@/features/shared/components/ui/input';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const [filterScope, setFilterScope] = React.useState<'Overall' | 'University' | 'Department' | 'Year'>('Overall');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('All');
  const [yearFilter, setYearFilter] = React.useState<string>('All');
  const [universityFilter, setUniversityFilter] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Unique filter lists
  const departments = React.useMemo(() => {
    return ['All', ...Array.from(new Set(entries.map((e) => e.department)))];
  }, [entries]);

  const years = React.useMemo(() => {
    return ['All', ...Array.from(new Set(entries.map((e) => e.year)))];
  }, [entries]);

  const universities = React.useMemo(() => {
    return ['All', ...Array.from(new Set(entries.map((e) => e.university)))];
  }, [entries]);

  // Filter entries
  const filteredEntries = React.useMemo(() => {
    return entries.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.university.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept =
        departmentFilter === 'All' || item.department === departmentFilter;
      const matchYear = yearFilter === 'All' || item.year === yearFilter;
      const matchUni =
        universityFilter === 'All' || item.university === universityFilter;

      return matchSearch && matchDept && matchYear && matchUni;
    });
  }, [entries, searchQuery, departmentFilter, yearFilter, universityFilter]);

  // Top 3 Podium
  const topThree = filteredEntries.slice(0, 3);

  const getTierColor = (t: CreditTier) => {
    switch (t) {
      case 'Diamond':
        return 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'Platinum':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Gold':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Silver':
        return 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30';
      case 'Bronze':
      default:
        return 'text-amber-800 dark:text-amber-600 bg-amber-700/10 border-amber-700/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              University & Campus Leaderboard
            </h2>
            <Badge variant="outline" className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
              Live Rankings
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time peer standing by societal innovation credit points and verified community solutions
          </p>
        </div>

        {/* Scope quick toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border text-xs">
          {(['Overall', 'University', 'Department', 'Year'] as const).map((scope) => (
            <button
              key={scope}
              onClick={() => {
                setFilterScope(scope);
                if (scope === 'Overall') {
                  setDepartmentFilter('All');
                  setYearFilter('All');
                  setUniversityFilter('All');
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterScope === scope
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (When not heavily filtered and has >=3) */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 - Silver */}
          <div className="order-2 md:order-1 rounded-2xl border border-slate-400/40 bg-card p-5 text-center shadow-2xs relative flex flex-col items-center justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-400 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Medal className="h-3 w-3" />
              Rank #2 • Silver
            </div>
            <div className="mt-3 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-400/20 border-2 border-slate-400 text-slate-700 dark:text-slate-300 font-black text-lg flex items-center justify-center">
                {topThree[1].avatarText}
              </div>
              <h4 className="font-bold text-sm text-foreground mt-2">{topThree[1].name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{topThree[1].department}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{topThree[1].university}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 w-full flex items-center justify-between text-xs">
              <span className="font-black text-foreground">{topThree[1].creditScore} Credits</span>
              <span className="font-semibold text-slate-500">{topThree[1].badgesCount} Badges</span>
            </div>
          </div>

          {/* Rank 1 - Gold (Center & Prominent) */}
          <div className="order-1 md:order-2 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-card p-6 text-center shadow-md relative flex flex-col items-center justify-between scale-100 md:scale-105">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Trophy className="h-3.5 w-3.5" />
              Rank #1 • Campus Champion
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-700 dark:text-amber-300 font-black text-xl flex items-center justify-center shadow-md">
                {topThree[0].avatarText}
              </div>
              <h4 className="font-black text-base text-foreground mt-2">{topThree[0].name}</h4>
              <p className="text-xs text-muted-foreground font-medium line-clamp-1">{topThree[0].department}</p>
              <p className="text-[11px] text-muted-foreground font-semibold">{topThree[0].university}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-400/30 w-full flex items-center justify-between text-xs">
              <span className="font-black text-amber-700 dark:text-amber-400 text-sm">
                {topThree[0].creditScore} Credits
              </span>
              <span className="font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                {topThree[0].badgesCount} Badges
              </span>
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div className="order-3 md:order-3 rounded-2xl border border-amber-700/40 bg-card p-5 text-center shadow-2xs relative flex flex-col items-center justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-700 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Medal className="h-3 w-3" />
              Rank #3 • Bronze
            </div>
            <div className="mt-3 flex flex-col items-center">
              <div className="h-14 w-14 rounded-2xl bg-amber-700/20 border-2 border-amber-700 text-amber-800 dark:text-amber-300 font-black text-lg flex items-center justify-center">
                {topThree[2].avatarText}
              </div>
              <h4 className="font-bold text-sm text-foreground mt-2">{topThree[2].name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{topThree[2].department}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{topThree[2].university}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 w-full flex items-center justify-between text-xs">
              <span className="font-black text-foreground">{topThree[2].creditScore} Credits</span>
              <span className="font-semibold text-amber-700 dark:text-amber-500">{topThree[2].badgesCount} Badges</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Row: Search & Specific Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
          />
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Departments</option>
            {departments
              .filter((d) => d !== 'All')
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Years</option>
            {years
              .filter((y) => y !== 'All')
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>

        {/* University Filter */}
        <div>
          <select
            value={universityFilter}
            onChange={(e) => setUniversityFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Universities</option>
            {universities
              .filter((u) => u !== 'All')
              .map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Department & University</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 text-right">Contribution Credits</th>
                <th className="py-3.5 px-4 text-center">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEntries.map((entry) => {
                const isUser = entry.isCurrentUser || entry.id === currentUserId;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-cyan-500/10 dark:bg-cyan-500/15 font-semibold text-foreground border-l-4 border-l-cyan-500'
                        : 'hover:bg-muted/30 text-foreground/90'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {entry.rank === 1 && (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-black">
                          <Trophy className="h-4 w-4 fill-amber-500" />
                          #1
                        </span>
                      )}
                      {entry.rank === 2 && (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-black">
                          <Medal className="h-4 w-4" />
                          #2
                        </span>
                      )}
                      {entry.rank === 3 && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-black">
                          <Medal className="h-4 w-4" />
                          #3
                        </span>
                      )}
                      {entry.rank > 3 && (
                        <span className="text-muted-foreground">#{entry.rank}</span>
                      )}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center font-bold text-xs text-foreground shrink-0 border border-border">
                          {entry.avatarText}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {isUser && (
                              <Badge className="bg-cyan-600 text-white text-[9px] px-1.5 py-0">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {entry.year}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & University */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium">{entry.department}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {entry.university}
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${getTierColor(
                          entry.tier
                        )}`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {entry.tier}
                      </span>
                    </td>

                    {/* Credit Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-sm text-foreground">
                        {entry.creditScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal ml-1">
                        pts
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-xs text-foreground bg-muted/70 px-2.5 py-1 rounded-xl">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        {entry.badgesCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-xs">
            No student rankings match your selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
