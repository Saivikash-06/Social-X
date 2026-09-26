"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  BookOpen,
  Award,
  Lightbulb,
  Building,
  GraduationCap,
  IndianRupee,
  Bell,
  ArrowRight,
  PlusCircle,
  FlaskConical,
  Database,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useResearchStats, useResearchInstitute, useResearchProjects } from "@/features/research/hooks/use-research-queries";
import { useResearchStore } from "@/features/research/hooks/use-research-store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RD_VELOCITY_DATA = [
  { quarter: "Q1 24", publications: 45, grantsCr: 12 },
  { quarter: "Q2 24", publications: 68, grantsCr: 21 },
  { quarter: "Q3 24", publications: 92, grantsCr: 34 },
  { quarter: "Q4 24", publications: 140, grantsCr: 48 },
  { quarter: "Q1 25", publications: 210, grantsCr: 62 },
  { quarter: "Q2 25", publications: 280, grantsCr: 74 },
  { quarter: "Q3 25", publications: 342, grantsCr: 84.5 },
];

export default function ResearchDashboardPage() {
  const { user } = useResearchStore();
  const { data: stats } = useResearchStats();
  const { data: institute } = useResearchInstitute();
  const { data: projects } = useResearchProjects();

  const STAT_CARDS = [
    {
      title: "Active Research",
      value: stats?.activeResearch ?? 14,
      subtext: "Funded laboratory trials",
      icon: FolderKanban,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      href: "/research/projects",
    },
    {
      title: "Completed Research",
      value: stats?.completedResearch ?? 42,
      subtext: "Validated & handed over",
      icon: CheckSquare,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/research/projects",
    },
    {
      title: "Indexed Publications",
      value: stats?.publications ?? 342,
      subtext: "IEEE / ASCE / ACM journals",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/research/publications",
    },
    {
      title: "Patents Granted / Filed",
      value: `${stats?.patents ?? 28} Patents`,
      subtext: "Municipal technology IP",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/research/publications",
    },
    {
      title: "Innovation Ideas (TRL)",
      value: stats?.innovationIdeas ?? 19,
      subtext: "TRL 1-9 pipeline prototypes",
      icon: Lightbulb,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      href: "/research/innovation",
    },
    {
      title: "Government Requests",
      value: stats?.governmentRequests ?? 8,
      subtext: "Active municipal technical RFPs",
      icon: Building,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      href: "/research/government-requests",
    },
    {
      title: "University Partners",
      value: stats?.universityPartners ?? 24,
      subtext: "MoU academic consortia",
      icon: GraduationCap,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      href: "/research/partnerships",
    },
    {
      title: "Total Research Funding",
      value: `₹${stats?.totalFundingCr ?? 84.5} Cr`,
      subtext: "MoHUA, DST, CSIR & Industry",
      icon: IndianRupee,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/research/reports",
    },
    {
      title: "Research Alerts",
      value: stats?.notifications ?? 6,
      subtext: "Peer reviews & citations",
      icon: Bell,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      href: "/research/notifications",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 text-[11px] gap-1 px-2.5 py-0.5">
                <Sparkles className="h-3 w-3" />
                <span>{institute?.accreditation || "NIRF #1 Institution"}</span>
              </Badge>
              <span className="text-xs text-indigo-200/80">Director: {institute?.directorName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.name || "Dr. Ramanathan"}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              {institute?.name} • Managing 14 funded urban lab initiatives with 340+ publications and 28 licensed municipal patents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild className="rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs gap-1.5 shadow-md">
              <Link href="/research/publications">
                <PlusCircle className="h-4 w-4 text-indigo-600" />
                <span>Upload Paper / Patent</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5">
              <Link href="/research/datasets">
                <Database className="h-4 w-4" />
                <span>Explore Datasets</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 9 Stats Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Institutional R&D Metrics</h2>
          <span className="text-xs text-muted-foreground">Scopus & IPO Synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href} className="group block focus:outline-none">
                <Card className="rounded-3xl border-border/80 bg-card hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-black text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {stat.value}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">{stat.subtext}</p>
                    </div>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Visualizations: R&D Milestone Velocity & Active Lab Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* R&D Velocity Area Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Research Velocity & Funding Growth</CardTitle>
                <CardDescription className="text-xs">Indexed papers vs mobilized research capital (Cr)</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 gap-1">
                <Link href="/research/publications">
                  <span>View All Papers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RD_VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorGrants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      borderRadius: "16px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="publications"
                    name="Total Publications"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPubs)"
                  />
                  <Area
                    type="monotone"
                    dataKey="grantsCr"
                    name="Grants (₹ Cr)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGrants)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Thrust Areas & Lab Facilities */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Research Thrust Areas</CardTitle>
            <CardDescription className="text-xs">National priority technology verticals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {(institute?.focusAreas || []).map((area, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-muted/30 border border-border/70 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{area}</span>
                <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-500/30">
                  Live Lab
                </Badge>
              </div>
            ))}

            <Button asChild variant="outline" className="w-full rounded-2xl text-xs gap-1.5 mt-3">
              <Link href="/research/innovation">
                <span>Explore TRL Innovation Lab</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Research Projects Preview */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Priority Research Projects</CardTitle>
              <CardDescription className="text-xs">Interdisciplinary field laboratories & municipal pilots</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400">
              <Link href="/research/projects">All Research Projects →</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(projects || []).slice(0, 2).map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-500/30 mb-1">
                      {proj.researchDomain}
                    </Badge>
                    <h4 className="text-xs font-bold text-foreground line-clamp-1">{proj.title}</h4>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {proj.progress}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.problemStatement}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span>Grant: <strong>{proj.funding}</strong> ({proj.fundingAgency})</span>
                  <span>Lead: {proj.leadScientist}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
