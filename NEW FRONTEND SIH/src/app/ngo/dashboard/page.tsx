"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  HeartHandshake,
  MapPin,
  TrendingUp,
  Award,
  Bell,
  ArrowRight,
  PlusCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useNgoStats, useNgoOrganization, useFieldActivities, useAssignedProjects } from "@/features/ngo/hooks/use-ngo-queries";
import { useNgoStore } from "@/features/ngo/hooks/use-ngo-store";
import { useTranslation } from "@/features/shared/i18n";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHLY_IMPACT_DATA = [
  { month: "Apr", beneficiaries: 16200, volunteerHours: 1610 },
  { month: "May", beneficiaries: 21500, volunteerHours: 2100 },
  { month: "Jun", beneficiaries: 23800, volunteerHours: 2340 },
  { month: "Jul", beneficiaries: 24500, volunteerHours: 2400 },
  { month: "Aug", beneficiaries: 26100, volunteerHours: 2790 },
  { month: "Sep", beneficiaries: 28400, volunteerHours: 2950 },
];

export default function NgoDashboardPage() {
  const { t } = useTranslation();
  const { user } = useNgoStore();
  const { data: stats, isLoading: statsLoading } = useNgoStats();
  const { data: organization } = useNgoOrganization();
  const { data: activities } = useFieldActivities();
  const { data: assignedProjects } = useAssignedProjects();

  const STAT_CARDS = [
    {
      title: t("ngo.activeProjects", "Active Projects"),
      value: stats?.activeProjects ?? 6,
      subtext: t("ngo.activeProjectsSubtext", "Field implementations in progress"),
      icon: FolderKanban,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/ngo/assigned-projects",
    },
    {
      title: t("ngo.completedProjects", "Completed Projects"),
      value: stats?.completedProjects ?? 18,
      subtext: t("ngo.completedProjectsSubtext", "Verified by line departments"),
      icon: CheckSquare,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/ngo/assigned-projects",
    },
    {
      title: t("ngo.pendingRequests", "Pending Requests"),
      value: stats?.pendingRequests ?? 4,
      subtext: t("ngo.pendingRequestsSubtext", "Proposals awaiting sanction"),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/ngo/collaborations",
    },
    {
      title: t("ngo.activeVolunteers", "Active Volunteers"),
      value: stats?.volunteers ?? 412,
      subtext: t("ngo.activeVolunteersSubtext", "Onboarded & vetted roster"),
      icon: Users,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10",
      href: "/ngo/volunteers",
    },
    {
      title: t("ngo.totalBeneficiaries", "Total Beneficiaries"),
      value: (stats?.beneficiaries ?? 184500).toLocaleString(),
      subtext: t("ngo.totalBeneficiariesSubtext", "Citizens directly reached"),
      icon: HeartHandshake,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      href: "/ngo/impact",
    },
    {
      title: t("ngo.districtsCovered", "Districts Covered"),
      value: `${stats?.districtsCovered ?? 8} ${t("ngo.aspirational", "Aspirational")}`,
      subtext: t("ngo.districtsCoveredSubtext", "Marathwada & Khandesh zones"),
      icon: MapPin,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      href: "/ngo/impact",
    },
    {
      title: t("ngo.communityImpactScore", "Community Impact Score"),
      value: `${stats?.communityImpactScore ?? 94.2} / 100`,
      subtext: t("ngo.communityImpactScoreSubtext", "AI verified social audit index"),
      icon: TrendingUp,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      href: "/ngo/impact",
    },
    {
      title: t("ngo.volunteerHoursLogged", "Volunteer Hours Logged"),
      value: `${(stats?.totalVolunteerHours ?? 18640).toLocaleString()} ${t("common.labels.hrs", "hrs")}`,
      subtext: t("ngo.volunteerHoursSubtext", "Field contribution telemetry"),
      icon: Award,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      href: "/ngo/volunteers",
    },
    {
      title: t("ngo.operationalAlerts", "Operational Alerts"),
      value: stats?.notifications ?? 5,
      subtext: t("ngo.operationalAlertsSubtext", "Real-time municipal notifications"),
      icon: Bell,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      href: "/ngo/notifications",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[11px] gap-1 px-2.5 py-0.5">
                <Sparkles className="h-3 w-3" />
                <span>{t("ngo.darpanLabel", "NITI Aayog Darpan")}: {organization?.darpanId || t("common.status.verified", "Verified")}</span>
              </Badge>
              <span className="text-xs text-emerald-200/80 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t("ngo.taxCompliant", "12A/80G Compliant")}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t("ngo.welcomeBack", "Welcome back")}, {user?.name || "Dr. Arundhati Roy"}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {organization?.name || "Gramin Vikas Seva Sansthan"} • {t("ngo.bannerInterventions", "Managing 6 live grassroots interventions across")} {stats?.districtsCovered || 8} {t("ngo.districtsWithVolunteers", "districts with 400+ volunteers.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild className="rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs gap-1.5 shadow-md">
              <Link href="/ngo/field-activities">
                <PlusCircle className="h-4 w-4 text-emerald-600" />
                <span>{t("ngo.logFieldActivity", "Log Field Activity")}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5">
              <Link href="/ngo/reports">
                <FileText className="h-4 w-4" />
                <span>{t("ngo.exportAuditReport", "Export Audit Report")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 9 Metrics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{t("ngo.operationalOverview", "Operational Overview")}</h2>
          <span className="text-xs text-muted-foreground">{t("ngo.updatedRealtime", "Updated in real-time")}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href} className="group block focus:outline-none">
                <Card className="rounded-3xl border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
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

      {/* Two Columns: Monthly Growth Analytics & Active Assigned Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">{t("ngo.impactVelocityTitle", "Beneficiary & Volunteer Velocity")}</CardTitle>
                <CardDescription className="text-xs">{t("ngo.impactVelocityDesc", "Cumulative reach across active projects")}</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-emerald-600 dark:text-emerald-400">
                <Link href="/ngo/impact">
                  <span>{t("common.labels.detailedAnalytics", "Detailed Analytics")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_IMPACT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBeneficiaries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
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
                    dataKey="beneficiaries"
                    name={t("ngo.totalBeneficiaries", "Beneficiaries")}
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorBeneficiaries)"
                  />
                  <Area
                    type="monotone"
                    dataKey="volunteerHours"
                    name={t("ngo.volunteerHoursLogged", "Volunteer Hours")}
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Assigned Projects Preview */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">{t("ngo.assignedProjects", "Assigned Projects")}</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-600 dark:text-emerald-400 p-0 h-auto">
                <Link href="/ngo/assigned-projects">{t("common.buttons.viewAll", "View All")}</Link>
              </Button>
            </div>
            <CardDescription className="text-xs">{t("ngo.milestoneTracking", "Milestone tracking & telemetry")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {(assignedProjects || []).slice(0, 2).map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-2xl border border-border/70 bg-muted/30 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                    {proj.title}
                  </h4>
                  <Badge variant="outline" className="text-[10px] shrink-0 text-emerald-600 border-emerald-500/30">
                    {proj.completionPercentage}% {t("common.status.done", "Done")}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${proj.completionPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>{proj.district}</span>
                  <span>{proj.assignedVolunteersCount} {t("ngo.volunteers", "Volunteers")}</span>
                </div>
              </div>
            ))}

            <Button asChild variant="outline" className="w-full rounded-2xl text-xs gap-1.5 mt-2">
              <Link href="/ngo/projects">
                <span>{t("ngo.browseGrants", "Browse New Open Grants")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Field Evidence & Activities */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">{t("ngo.recentFieldActivities", "Recent Field Activities")}</CardTitle>
              <CardDescription className="text-xs">{t("ngo.geotaggedDesc", "Geotagged ground interventions verified by nodal officers")}</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-600 dark:text-emerald-400">
              <Link href="/ngo/field-activities">{t("ngo.openEvidenceGallery", "Open Evidence Gallery →")}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activities || []).slice(0, 2).map((act) => (
              <div key={act.id} className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{act.projectTitle}</h4>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{act.location}</span>
                    </p>
                  </div>
                  <Badge variant={act.approvalStatus === "Approved" ? "success" : "warning"} className="text-[10px]">
                    {t(`common.status.${act.approvalStatus.toLowerCase()}`, act.approvalStatus)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {act.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{act.date} • {act.time}</span>
                  </span>
                  <span className="font-semibold text-foreground">{act.volunteerCount} {t("ngo.volunteers", "Volunteers")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
