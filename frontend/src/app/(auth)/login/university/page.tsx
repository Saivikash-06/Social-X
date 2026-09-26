'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/features/shared/components/ui/badge';

export default function UniversityRoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Module 2: University & Academic Innovation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-foreground"
        >
          Select Your University Portal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-muted-foreground leading-relaxed"
        >
          Choose your designated institutional role to access project management,
          research grant milestones, student laboratory teams, or sprint deliverables.
        </motion.p>
      </div>

      {/* Two Large Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Faculty Portal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => router.push('/login/university/faculty')}
          className="group cursor-pointer relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-card p-8 shadow-xl transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl group-hover:bg-blue-500/25 transition-all duration-500 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-primary border border-primary/20 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <GraduationCap className="h-8 w-8" />
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                Faculty & Advisor
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <span>Faculty Portal</span>
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For Principal Investigators, Department Chairs, and Professors to adopt
                municipal problem statements, supervise student teams, sign off on milestones,
                and review grant analytics.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-muted-foreground pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Supervise multiple lab teams & assign student fellows</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Approve milestone tranches & verify uploaded code</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Adopt citizen-escalated municipal research proposals</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-border/80 flex items-center justify-between text-sm font-bold text-primary relative z-10">
            <span>Continue to Faculty Sign-In</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>

        {/* Student Portal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.05 }}
          onClick={() => router.push('/login/university/student')}
          className="group cursor-pointer relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 bg-card p-8 shadow-xl transition-all duration-300 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/25 transition-all duration-500 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                <BookOpen className="h-8 w-8" />
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                Student Researcher
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                <span>Student Portal</span>
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-600 dark:text-cyan-400" />
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For Ph.D. scholars, Masters candidates, and undergraduate student research
                fellows to execute laboratory tasks, submit experimental artifacts, and collaborate
                with faculty advisors.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-muted-foreground pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Track assigned research sprint checklists & deadlines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Upload datasets, lab notes, code packages & firmware</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Direct discussion thread with assigned faculty advisor</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-border/80 flex items-center justify-between text-sm font-bold text-cyan-600 dark:text-cyan-400 relative z-10">
            <span>Continue to Student Sign-In</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to main login roles */}
      <div className="text-center pt-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Social-X Platform Portals</span>
        </Link>
      </div>
    </div>
  );
}
