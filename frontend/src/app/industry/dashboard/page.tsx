"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  GraduationCap,
  Users,
  Coins,
  ShieldCheck,
  Sparkles,
  Clock,
  Bell,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Building2,
  Cpu,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  useIndustryStats,
  useRecentActivities,
  useIndustryAnalytics,
} from "@/features/industry/hooks/use-industry-queries";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { GovernmentWorkOrdersPanel } from "@/features/industry/components/GovernmentWorkOrdersPanel";
import { useTranslation } from "@/features/shared/i18n";

export default function IndustryDashboardPage() {
  const { t } = useTranslation();
  const { user, organization } = useIndustryStore();
  const { data: stats, isLoading: statsLoading } = useIndustryStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: analytics } = useIndustryAnalytics();

  const formattedFundingReleased = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(stats?.fundingReleased || 19250000);

  const statCards = [
    {
      title: t("nav.projects", "Projects Available"),
      value: stats?.projectsAvailable ?? 42,
      subtitle: t("industry.dashboard.civicRndDesc", "Civic & technical R&D opportunities"),
      icon: FolderKanban,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/industry/projects",
    },
    {
      title: t("industry.dashboard.projectsSponsored", "Projects Sponsored"),
      value: stats?.projectsSponsored ?? 12,
      subtitle: t("industry.dashboard.csrGrantsDesc", "Active CSR grants allocated"),
      icon: Layers,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/industry/funding",
    },
    {
      title: t("industry.dashboard.projectsCompleted", "Projects Completed"),
      value: stats?.projectsCompleted ?? 7,
      subtitle: t("industry.dashboard.deployedDesc", "Field deployed across districts"),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/industry/tracking",
    },
    {
      title: t("industry.dashboard.universitiesConnected", "Universities Connected"),
      value: stats?.universitiesConnected ?? 18,
      subtitle: t("industry.dashboard.academicPartnersDesc", "Top NIRF academic lab partners"),
      icon: GraduationCap,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      href: "/industry/collaboration",
    },
    {
      title: t("industry.dashboard.studentsMentored", "Students Mentored"),
      value: stats?.studentsMentored ?? 64,
      subtitle: t("industry.dashboard.innovationFellowsDesc", "Ph.D. & M.Tech innovation fellows"),
      icon: Users,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      href: "/industry/mentorship",
    },
    {
      title: t("industry.dashboard.fundingReleased", "Funding Released"),
      value: formattedFundingReleased,
      subtitle: t("industry.dashboard.escrowTranchesDesc", "Verified milestone escrow tranches"),
      icon: Coins,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/industry/funding",
    },
    {
      title: t("industry.dashboard.csrImpactScore", "CSR Impact Score"),
      value: `${stats?.csrImpactScore ?? 94} / 100`,
      subtitle: t("industry.dashboard.complianceRatingDesc", "Schedule VII compliance rating"),
      icon: ShieldCheck,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      href: "/industry/csr",
    },
    {
      title: t("industry.dashboard.innovationScore", "Innovation Score"),
      value: `${stats?.innovationScore ?? 89} / 100`,
      subtitle: t("industry.dashboard.patentabilityDesc", "IP & patentability assessment"),
      icon: Sparkles,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      href: "/industry/research",
    },
    {
      title: t("industry.dashboard.pendingRequests", "Pending Requests"),
      value: stats?.pendingRequests ?? 4,
      subtitle: t("industry.dashboard.reviewsProposalsDesc", "Milestone reviews & proposals"),
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      href: "/industry/funding",
    },
    {
      title: t("industry.dashboard.unreadNotifications", "Unread Notifications"),
      value: stats?.unreadNotifications ?? 3,
      subtitle: t("industry.dashboard.telemetryAlertsDesc", "Real-time telemetry alerts"),
      icon: Bell,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/industry/notifications",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-amber-500/10 via-background to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="px-3 py-1 text-xs font-bold rounded-full">
                {user?.roleLabel || t("industry.portalTitle", "CSR Organization")}
              </Badge>
              <Badge variant="success" className="px-2.5 py-0.5 text-xs">
                {t("industry.dashboard.esgRated", "ESG AAA Rated")}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              {organization?.name || t("industry.dashboard.corporateHub", "Corporate Innovation Hub")}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {t("industry.dashboard.heroDesc", "Collaborate with premier universities, release audited CSR funding, mentor engineering research scholars, and scale validated civic prototypes.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="gradient" className="rounded-2xl gap-2 font-bold shadow-md">
              <Link href="/industry/projects">
                <FolderKanban className="h-4 w-4" />
                <span>{t("industry.dashboard.exploreProjects", "Explore Projects")}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl gap-2 font-semibold">
              <Link href="/industry/funding">
                <Coins className="h-4 w-4 text-emerald-500" />
                <span>{t("industry.dashboard.releaseFunds", "Release Funds")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 10 Dashboard Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group focus:outline-none">
              <Card className="h-full border-border/70 bg-card hover:border-amber-500/40 hover:shadow-lg transition-all rounded-3xl relative overflow-hidden">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-black text-foreground tracking-tight mt-0.5">{card.value}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-1">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Municipal Work Orders Dispatched by Government Authorities */}
      <GovernmentWorkOrdersPanel />

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly CSR Disbursement Area Chart */}
        <Card className="lg:col-span-2 border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">{t("industry.dashboard.csrExpenditure", "CSR Expenditure vs Plan (FY26)")}</CardTitle>
                <CardDescription className="text-xs">{t("industry.dashboard.csrExpenditureDesc", "Cumulative audited tranche releases in INR")}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">{t("government.reports.monthlyAudit", "Monthly Audit")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.csrSpendingByMonth || []}>
                  <defs>
                    <linearGradient id="csrAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="month" stroke="currentColor" className="text-xs text-muted-foreground opacity-70" />
                  <YAxis
                    stroke="currentColor"
                    className="text-xs text-muted-foreground opacity-70"
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, t("common.labels.total", "Amount")]}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "1rem" }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#d97706" strokeWidth={3} fill="url(#csrAmount)" name="Actual Release" />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} fill="transparent" name="Plan Baseline" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Pipeline Donut Chart */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{t("industry.dashboard.statusDistribution", "Project Status Distribution")}</CardTitle>
            <CardDescription className="text-xs">{t("industry.dashboard.portfolioBreakdown", "Active portfolio breakdown")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col items-center">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.projectsByStatus || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(analytics?.projectsByStatus || []).map((entry: { name: string; value: number; color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} ${t("nav.projects", "Projects")}`, name]}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "1rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-2">
              {(analytics?.projectsByStatus || []).map((item: { name: string; value: number; color: string }) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">{t("industry.dashboard.recentActivities", "Recent Industry Activities")}</CardTitle>
                <CardDescription className="text-xs">{t("industry.dashboard.activitiesDesc", "Audited transactions and milestone updates")}</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs gap-1">
                <Link href="/industry/tracking">
                  <span>{t("common.buttons.viewAll", "View All Logs")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(activities || []).map((act) => (
              <div key={act.id} className="flex items-start gap-4 p-3.5 rounded-2xl border border-border/60 hover:bg-muted/40 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground truncate">{act.title}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{act.details}</p>
                  <p className="text-[10px] font-semibold text-foreground/80">{t("common.labels.verified", "Authorized by")}: {act.actor}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Launchpad Card */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{t("industry.dashboard.actionLaunchpad", "Industry Action Launchpad")}</CardTitle>
            <CardDescription className="text-xs">{t("industry.dashboard.launchpadDesc", "High-priority operational workflows")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/industry/projects"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:border-amber-500/40 hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {t("industry.dashboard.sponsorRnd", "Sponsor Open R&D")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("industry.dashboard.sponsorRndDesc", "Match CSR grants to university teams")}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/industry/prototypes"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:border-amber-500/40 hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Cpu className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {t("industry.dashboard.reviewPrototypes", "Review Hardware Prototypes")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("industry.dashboard.reviewPrototypesDesc", "Evaluate bench rigs & authorize pilots")}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/industry/mentorship"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:border-amber-500/40 hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {t("industry.dashboard.scheduleStudentReview", "Schedule Student Review")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("industry.dashboard.scheduleReviewDesc", "Conduct technical architecture reviews")}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/industry/collaboration"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:border-amber-500/40 hover:bg-muted/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {t("industry.dashboard.inviteAcademicLabs", "Invite Academic Labs")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t("industry.dashboard.inviteLabsDesc", "Partner with IISc, NITK & JSS STU")}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
