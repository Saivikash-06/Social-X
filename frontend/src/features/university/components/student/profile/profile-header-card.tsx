'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Hash,
  Award,
  ShieldCheck,
  Share2,
  Download,
  Sparkles,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { StudentProfileData, CreditTier } from '../../../types/student-contribution';

interface ProfileHeaderCardProps {
  profile: StudentProfileData;
  creditScore: number;
  tier: CreditTier;
  onEditToggle?: () => void;
}

export function ProfileHeaderCard({
  profile,
  creditScore,
  tier,
  onEditToggle,
}: ProfileHeaderCardProps) {
  const getTierColor = (t: CreditTier) => {
    switch (t) {
      case 'Diamond':
        return 'from-violet-500 via-fuchsia-500 to-indigo-500 text-violet-400 border-violet-500/40 shadow-violet-500/20';
      case 'Platinum':
        return 'from-cyan-500 via-sky-500 to-blue-600 text-cyan-400 border-cyan-500/40 shadow-cyan-500/20';
      case 'Gold':
        return 'from-amber-400 via-yellow-500 to-amber-600 text-amber-400 border-amber-500/40 shadow-amber-500/20';
      case 'Silver':
        return 'from-slate-300 via-slate-400 to-slate-500 text-slate-300 border-slate-400/40 shadow-slate-500/20';
      case 'Bronze':
      default:
        return 'from-amber-700 via-orange-600 to-amber-800 text-amber-600 border-amber-700/40 shadow-amber-700/20';
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Public Contribution Profile link copied to clipboard!');
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-md p-6 sm:p-8 shadow-md">
      {/* Decorative ambient background gradient */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Avatar & Core Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with dynamic tier halo */}
          <div className="relative group">
            <div
              className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br ${getTierColor(
                tier
              )} p-0.5 shadow-lg`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-[22px] sm:rounded-[26px] bg-card text-foreground font-black text-2xl sm:text-3xl tracking-wider">
                {initials}
              </div>
            </div>
            {/* Tier Pill Overlay */}
            <span className="absolute -bottom-2 -right-1 flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              <Sparkles className="h-3 w-3" />
              {tier}
            </span>
          </div>

          {/* Titles & University Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {profile.name}
              </h1>
              <Badge
                variant="outline"
                className="gap-1 border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Innovator
              </Badge>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                #{profile.rollNumber}
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium text-foreground/90 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              {profile.department}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {profile.university}
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {profile.yearOfStudy}
              </span>
            </div>

            {/* Bio summary */}
            {profile.bio && (
              <p className="pt-1 text-xs text-muted-foreground max-w-xl line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons & Rank highlight */}
        <div className="flex flex-row lg:flex-col sm:items-end justify-between w-full lg:w-auto gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
          <div className="text-left sm:text-right">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Global Standing
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground flex items-center sm:justify-end gap-1.5">
              <span>Top 4%</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Rank #14
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs h-9 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            {onEditToggle && (
              <Button
                variant="default"
                size="sm"
                onClick={onEditToggle}
                className="gap-1.5 text-xs h-9 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
              >
                <User className="h-3.5 w-3.5" />
                <span>Edit Info</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details & NSS / NCC Affiliation Bar */}
      <div className="mt-6 pt-5 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
        {/* Email */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border/50">
          <div className="p-1.5 rounded-lg bg-background text-cyan-600 dark:text-cyan-400 shadow-2xs">
            <Mail className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Email</div>
            <div className="font-semibold text-foreground truncate">{profile.email}</div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border/50">
          <div className="p-1.5 rounded-lg bg-background text-cyan-600 dark:text-cyan-400 shadow-2xs">
            <Phone className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Phone</div>
            <div className="font-semibold text-foreground truncate">{profile.mobileNumber}</div>
          </div>
        </div>

        {/* NSS Affiliation */}
        <div
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
            profile.nssMember
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-muted/20 border-dashed border-border text-muted-foreground'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-background text-amber-600 dark:text-amber-400 shadow-2xs">
            <HeartHandshake className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <span>NSS Member</span>
              {profile.nssMember && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <div className="font-medium text-xs truncate">
              {profile.nssMember
                ? profile.nssDetails || 'Active NSS Volunteer'
                : 'Not Enrolled'}
            </div>
          </div>
        </div>

        {/* NCC Affiliation */}
        <div
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
            profile.nccMember
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200'
              : 'bg-muted/20 border-dashed border-border text-muted-foreground'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-background text-indigo-600 dark:text-indigo-400 shadow-2xs">
            <Compass className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <span>NCC Member</span>
              {profile.nccMember && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <div className="font-medium text-xs truncate">
              {profile.nccMember
                ? profile.nccDetails || 'Senior Under Officer'
                : 'Not Enrolled'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
