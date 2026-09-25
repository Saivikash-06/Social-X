"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  FlaskConical,
  BarChart3,
  Cpu,
  Activity,
  Bell,
  Sliders,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Server,
  Lock,
  KeyRound,
  FileText,
  Eye,
  MoreVertical,
  Check,
  ChevronRight,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  useAdminStats,
  useAdminUsers,
  useAdminRoles,
  useAdminDepartments,
  useAdminUniversities,
  useAdminIndustries,
  useAdminNgos,
  useAdminResearchOrgs,
  useAdminIssues,
  useAiTelemetry,
  useAuditLogs,
  useSystemHealth,
  useAdminMutations,
} from "@/features/admin/hooks/use-admin-queries";
import { useAdminStore } from "@/features/admin/hooks/use-admin-store";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/shared/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/features/shared/components/ui/tabs";
import { UserFormDialog } from "@/features/admin/components/users/user-form-dialog";
import { ResetPasswordDialog } from "@/features/admin/components/users/reset-password-dialog";
import { ManagedUser, AdminDepartment, AdminUniversity, AdminIndustry, AdminNgo, AdminResearchOrg, DEFAULT_ADMIN_STATS } from "@/features/admin/types";
import { AdminDashboardSkeleton, DashboardError } from "@/features/admin/components/dashboard/admin-dashboard-feedback";
import { toast } from "sonner";
import { useTranslation } from "@/features/shared/i18n";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MONTHLY_TREND_DATA = [
  { month: "Apr", reported: 1240, resolved: 1180, escalated: 60 },
  { month: "May", reported: 1450, resolved: 1390, escalated: 60 },
  { month: "Jun", reported: 1680, resolved: 1590, escalated: 90 },
  { month: "Jul", reported: 1890, resolved: 1780, escalated: 110 },
  { month: "Aug", reported: 2120, resolved: 2040, escalated: 80 },
  { month: "Sep", reported: 2450, resolved: 2380, escalated: 70 },
];

const CATEGORY_DISTRIBUTION = [
  { name: "Water Supply & Drainage", value: 34, color: "#3b82f6" },
  { name: "Roads & Transit Infra", value: 26, color: "#f59e0b" },
  { name: "Public Health & Waste", value: 18, color: "#10b981" },
  { name: "Power & Street Lighting", value: 12, color: "#8b5cf6" },
  { name: "Urban Forestry & Green", value: 10, color: "#ec4899" },
];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAdminStore();
  const [activeTab, setActiveTab] = React.useState("overview");

  // Queries
  const { data: apiData, isLoading: statsLoading, isError: statsError, error: statsErrorObj, refetch: refetchStats } = useAdminStats();

  const stats = React.useMemo(() => ({
    ...DEFAULT_ADMIN_STATS,
    ...(apiData ?? {}),
  }), [apiData]);

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useAdminUsers();
  const { data: departments, isLoading: deptsLoading } = useAdminDepartments();
  const { data: universities, isLoading: unisLoading } = useAdminUniversities();
  const { data: industries, isLoading: indLoading } = useAdminIndustries();
  const { data: ngos, isLoading: ngosLoading } = useAdminNgos();
  const { data: researchOrgs, isLoading: researchLoading } = useAdminResearchOrgs();
  const { data: aiMetrics } = useAiTelemetry();
  const { data: auditLogs } = useAuditLogs();
  const { data: systemHealth } = useSystemHealth();

  // Mutations
  const { createUserMutation, updateUserMutation, resetPasswordMutation, deleteUserMutation } = useAdminMutations();

  // Dialog States
  const [userModalOpen, setUserModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);
  const [targetUser, setTargetUser] = React.useState<ManagedUser | null>(null);

  // User Filter State
  const [userSearch, setUserSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  const filteredUsers = React.useMemo(() => {
    if (!usersData) return [];
    return usersData.filter((u: ManagedUser) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.organization?.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [usersData, userSearch, roleFilter]);

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (u: ManagedUser) => {
    setEditingUser(u);
    setUserModalOpen(true);
  };

  const handleOpenResetPassword = (u: ManagedUser) => {
    setTargetUser(u);
    setResetModalOpen(true);
  };

  const handleToggleUserStatus = (u: ManagedUser) => {
    const nextStatus = u.status === "active" ? "suspended" : "active";
    updateUserMutation.mutate({
      id: u.id,
      data: { status: nextStatus },
    });
  };

  if (statsLoading && !apiData) {
    return <AdminDashboardSkeleton />;
  }

  if (statsError && !apiData) {
    return (
      <DashboardError
        title="Admin Telemetry Service Unavailable"
        message={statsErrorObj?.message || "Failed to retrieve real-time system metrics. Please check network connectivity or try again."}
        reset={refetchStats}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-card via-card to-rose-500/5 border border-border/80 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <Badge variant="destructive" className="px-2.5 py-0.5 font-mono font-bold text-xs gap-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>ROOT CONSOLE • LEVEL 3</span>
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              Session ID: <span className="text-foreground font-semibold">ADM-SEC-2026-994</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Super Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Central governance, multi-stakeholder management, AI telemetry, and civic issue orchestration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchStats();
              refetchUsers();
              toast.info("Telemetry synchronized with national grid.");
            }}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t("refresh", "Sync Telemetry")}</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenCreateUser}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white gap-1.5 text-xs font-bold shadow-md shadow-rose-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("create_user", "Provision User")}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Citizens */}
        <Card className="rounded-2xl border-border/70 hover:border-blue-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("citizen_portal", "Citizens")}</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {(stats?.registeredCitizens ?? 1428500).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4% MoM</span>
            </div>
          </CardContent>
        </Card>

        {/* Government Accounts */}
        <Card className="rounded-2xl border-border/70 hover:border-emerald-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("government_portal", "Gov Officials")}</span>
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {(stats?.activeOfficials ?? stats?.governmentUsers ?? 2845).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Across 24 Depts
            </div>
          </CardContent>
        </Card>

        {/* Universities */}
        <Card className="rounded-2xl border-border/70 hover:border-purple-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("university", "Universities")}</span>
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {(stats?.universities ?? 168).toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              58,400 Students
            </div>
          </CardContent>
        </Card>

        {/* Industry CSR */}
        <Card className="rounded-2xl border-border/70 hover:border-amber-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("industry", "Industries")}</span>
              <Briefcase className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {(stats?.industries ?? 214).toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              ₹42.8 Cr CSR Fund
            </div>
          </CardContent>
        </Card>

        {/* Issues Resolved */}
        <Card className="rounded-2xl border-border/70 hover:border-rose-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("resolved_issues", "Resolved Issues")}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {(stats?.resolvedIssues ?? 118920).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              {(stats?.pendingIssues ?? 6684).toLocaleString()} Pending (92.6% SLA)
            </div>
          </CardContent>
        </Card>

        {/* AI & System Health */}
        <Card className="rounded-2xl border-border/70 hover:border-rose-500/50 hover:shadow-lg transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t("system_health", "System Health")}</span>
              <Activity className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats?.systemHealthScore ?? 99.8}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              99.98% Uptime
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Command Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="bg-card border border-border/80 p-1.5 rounded-2xl inline-flex gap-1 min-w-max">
            <TabsTrigger value="overview" className="gap-2 rounded-xl text-xs font-bold">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{t("overview", "Overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 rounded-xl text-xs font-bold">
              <Users className="h-3.5 w-3.5" />
              <span>{t("users", "User Management")}</span>
            </TabsTrigger>
            <TabsTrigger value="government" className="gap-2 rounded-xl text-xs font-bold">
              <Building2 className="h-3.5 w-3.5" />
              <span>{t("government_portal", "Government")}</span>
            </TabsTrigger>
            <TabsTrigger value="universities" className="gap-2 rounded-xl text-xs font-bold">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{t("university", "Universities")}</span>
            </TabsTrigger>
            <TabsTrigger value="industry" className="gap-2 rounded-xl text-xs font-bold">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{t("industry", "Industry CSR")}</span>
            </TabsTrigger>
            <TabsTrigger value="ngos" className="gap-2 rounded-xl text-xs font-bold">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>{t("ngo", "NGOs")}</span>
            </TabsTrigger>
            <TabsTrigger value="research" className="gap-2 rounded-xl text-xs font-bold">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{t("research", "Research Labs")}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 rounded-xl text-xs font-bold">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{t("analytics", "Analytics")}</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2 rounded-xl text-xs font-bold">
              <Cpu className="h-3.5 w-3.5" />
              <span>{t("system_health", "System Health")}</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 rounded-xl text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t("audit_logs", "Audit Trail")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resolution Trends Chart */}
            <Card className="lg:col-span-2 rounded-3xl border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Civic Issue Resolution & SLA Flow</CardTitle>
                  <CardDescription className="text-xs">
                    Monthly reported vs resolved issues with escalation telemetry.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  FY 2025-26
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown Donut */}
            <Card className="rounded-3xl border-border/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Category Distribution</CardTitle>
                <CardDescription className="text-xs">
                  Proportion of civic challenges logged across municipal categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {CATEGORY_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 pt-2">
                  {CATEGORY_DISTRIBUTION.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stakeholder Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Government */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-bold text-sm">Government Line Depts</h3>
                </div>
                <Badge variant="success" className="text-[10px]">
                  {departments?.length || 24} Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Municipal corporations, public works, sanitation, and state collectorates.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("government")}
                className="w-full text-xs font-semibold justify-between rounded-xl hover:bg-muted"
              >
                <span>Manage Departments</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>

            {/* University */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  <h3 className="font-bold text-sm">Academic Ecosystem</h3>
                </div>
                <Badge variant="purple" className="text-[10px]">
                  {universities?.length || 142} Colleges
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Engineering faculties, student challenge teams, and R&D incubation centers.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("universities")}
                className="w-full text-xs font-semibold justify-between rounded-xl hover:bg-muted"
              >
                <span>View Universities</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>

            {/* Industry CSR */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-amber-500" />
                  <h3 className="font-bold text-sm">Corporate Partners</h3>
                </div>
                <Badge variant="warning" className="text-[10px]">
                  {industries?.length || 310} Companies
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                CSR capital allocation, sustainable infra funding, and project sponsorships.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("industry")}
                className="w-full text-xs font-semibold justify-between rounded-xl hover:bg-muted"
              >
                <span>Review CSR Portfolios</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>

            {/* NGOs */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-rose-500" />
                  <h3 className="font-bold text-sm">Civil Society & NGOs</h3>
                </div>
                <Badge variant="destructive" className="text-[10px]">
                  {ngos?.length || 860} Registered
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Volunteer networks, grassroots citizen outreach, and ground-level action squads.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("ngos")}
                className="w-full text-xs font-semibold justify-between rounded-xl hover:bg-muted"
              >
                <span>Audit NGO Roster</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* 2. USER MANAGEMENT TAB */}
        <TabsContent value="users" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Cross-Stakeholder Identity & Directory</CardTitle>
                <CardDescription className="text-xs">
                  Manage accounts, privileges, credentials, and verification across all stakeholder tiers.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={handleOpenCreateUser}
                className="rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white gap-1.5 text-xs font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New User</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("search_placeholder", "Search by full name, email, or organization...")}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10 rounded-2xl border-border/80 bg-muted/30 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    aria-label="Filter users by stakeholder role"
                    className="h-10 rounded-2xl border border-border/80 bg-muted/30 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">{t("all", "All Stakeholder Roles")}</option>
                    <option value="citizen">{t("citizen_portal", "Citizens")}</option>
                    <option value="government">{t("government_portal", "Government Officials")}</option>
                    <option value="university">{t("university", "University Faculty/Students")}</option>
                    <option value="industry">{t("industry", "Industry CSR Leads")}</option>
                    <option value="ngo">{t("ngo", "NGO Representatives")}</option>
                    <option value="research">{t("research", "Research Scientists")}</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-border/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">{t("full_name", "User Identity")}</th>
                        <th className="p-3.5">{t("role", "Role & Clearance")}</th>
                        <th className="p-3.5">{t("organization", "Organization / Region")}</th>
                        <th className="p-3.5">{t("status", "Status")}</th>
                        <th className="p-3.5">{t("created_at", "Last Active")}</th>
                        <th className="p-3.5 text-right">{t("action", "Actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            {t("no_results", "No users matched your criteria.")}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 border border-rose-500/20">
                                  {u.fullName.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground flex items-center gap-1.5">
                                    <span>{u.fullName}</span>
                                    {u.verified && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                    )}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground font-mono">
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <Badge
                                variant={
                                  u.role === "government"
                                    ? "success"
                                    : u.role === "university"
                                    ? "purple"
                                    : u.role === "industry"
                                    ? "warning"
                                    : u.role === "ngo"
                                    ? "destructive"
                                    : "info"
                                }
                                className="font-semibold text-[10px] uppercase"
                              >
                                {u.role}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{u.roleLabel}</p>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-foreground">{u.organization || "Independent"}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {u.district}, {u.state}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <Badge
                                variant={u.status === "active" ? "success" : "destructive"}
                                className="text-[10px] font-bold"
                              >
                                {u.status}
                              </Badge>
                            </td>
                            <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                              {u.lastActive}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenResetPassword(u)}
                                  className="h-7 px-2 text-[11px] rounded-lg gap-1 text-muted-foreground hover:text-foreground"
                                  title="Reset Password"
                                >
                                  <KeyRound className="h-3 w-3" />
                                  <span className="hidden xl:inline">Reset</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="h-7 px-2 text-[11px] rounded-lg gap-1 text-muted-foreground hover:text-foreground"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`h-7 px-2 text-[11px] rounded-lg ${
                                    u.status === "active" ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                                  }`}
                                >
                                  {u.status === "active" ? "Suspend" : "Activate"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. GOVERNMENT MANAGEMENT TAB */}
        <TabsContent value="government" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Government Line Departments & Collectorates</CardTitle>
                <CardDescription className="text-xs">
                  Active civic departments, district jurisdiction, SLA adherence metrics, and assigned budget.
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-mono font-bold">
                {departments?.length || 24} Departments Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(departments || []).map((dept) => (
                  <Card key={dept.id} className="rounded-2xl border-border/70 p-4 space-y-3 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold">
                          {dept.code}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground">{dept.name}</h4>
                      </div>
                      <Badge variant={dept.status === "active" ? "success" : "warning"} className="text-[10px]">
                        {dept.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span>Head Officer:</span>
                        <span className="font-semibold text-foreground">{dept.headOfficerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Districts Covered:</span>
                        <span className="font-mono font-bold text-foreground">{dept.districtsCovered}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Officers:</span>
                        <span className="font-mono font-bold text-foreground">{dept.activeOfficersCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SLA Compliance:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {dept.slaComplianceRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Budget (Allocated / Spent):</span>
                        <span className="font-mono text-foreground">
                          ₹{dept.budgetAllocatedCr}Cr / ₹{dept.budgetUtilizedCr}Cr
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. UNIVERSITIES TAB */}
        <TabsContent value="universities" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Academic Institution Roster</CardTitle>
                <CardDescription className="text-xs">
                  Accredited universities, IITs, engineering labs, active student innovation challenges.
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-xs font-mono font-bold">
                {universities?.length || 142} Registered
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(universities || []).map((uni) => (
                  <Card key={uni.id} className="rounded-2xl border-border/70 p-4 space-y-3 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px] font-bold">
                          {uni.code} &bull; {uni.tier}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground mt-1">{uni.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{uni.location}, {uni.state}</p>
                      </div>
                      <Badge variant="purple" className="text-[10px] font-bold">
                        NAAC {uni.naacGrade}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span>Dean:</span>
                        <span className="font-semibold text-foreground">{uni.contactDean}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Students / Faculty:</span>
                        <span className="font-mono text-foreground">{uni.studentCount} / {uni.facultyCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Civic Prototypes:</span>
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                          {uni.activeProjects} Projects
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant={uni.verificationStatus === "approved" ? "success" : "warning"} className="text-[10px]">
                          {uni.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. INDUSTRY CSR TAB */}
        <TabsContent value="industry" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Industry & Corporate CSR Partners</CardTitle>
                <CardDescription className="text-xs">
                  Corporate partners, CIN verification, CSR capital deployment, and sponsored civic initiatives.
                </CardDescription>
              </div>
              <Badge variant="warning" className="text-xs font-mono font-bold">
                {industries?.length || 310} Companies
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(industries || []).map((ind) => (
                  <Card key={ind.id} className="rounded-2xl border-border/70 p-4 space-y-3 hover:border-amber-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          CIN: {ind.cin}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground mt-1">{ind.companyName}</h4>
                        <p className="text-[11px] text-muted-foreground">{ind.sector} &bull; {ind.headquarters}</p>
                      </div>
                      <Badge variant="warning" className="text-[10px]">
                        {ind.verificationStatus}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span>CSR Lead:</span>
                        <span className="font-semibold text-foreground">{ind.csrLeadName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>CSR Committed:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          ₹{ind.csrFundCommittedCr} Cr
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Disbursed:</span>
                        <span className="font-mono text-foreground">₹{ind.csrFundDisbursedCr} Cr</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sponsored Projects:</span>
                        <span className="font-mono font-bold text-foreground">
                          {ind.sponsoredProjectsCount} Projects
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. NGOS TAB */}
        <TabsContent value="ngos" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Civil Society Organizations & NGOs</CardTitle>
                <CardDescription className="text-xs">
                  Grassroots verification, Darpan ID compliance, FCRA status, and active volunteer forces.
                </CardDescription>
              </div>
              <Badge variant="destructive" className="text-xs font-mono font-bold">
                {ngos?.length || 860} Entities
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(ngos || []).map((ngo) => (
                  <Card key={ngo.id} className="rounded-2xl border-border/70 p-4 space-y-3 hover:border-rose-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Darpan: {ngo.darpanId}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground mt-1">{ngo.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{ngo.focusArea} &bull; {ngo.district}, {ngo.state}</p>
                      </div>
                      <Badge variant="destructive" className="text-[10px]">
                        {ngo.verificationStatus}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span>Functionary:</span>
                        <span className="font-semibold text-foreground">{ngo.chiefFunctionary}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Volunteers:</span>
                        <span className="font-mono font-bold text-foreground">{ngo.volunteerRosterCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>FCRA / 12A-80G:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {ngo.fcraStatus} &bull; {ngo.has12A80G ? "12A/80G Active" : "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Adopted Projects:</span>
                        <span className="font-mono font-bold text-foreground">
                          {ngo.adoptedProjectsCount} Projects
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. RESEARCH LABS TAB */}
        <TabsContent value="research" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Research Organizations & Think Tanks</CardTitle>
                <CardDescription className="text-xs">
                  National laboratories, municipal GIS access tiers, patents filed, and AI grants.
                </CardDescription>
              </div>
              <Badge variant="info" className="text-xs font-mono font-bold">
                {researchOrgs?.length || 78} Organizations
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(researchOrgs || []).map((org) => (
                  <Card key={org.id} className="rounded-2xl border-border/70 p-4 space-y-3 hover:border-sky-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {org.acronym} &bull; {org.category}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground mt-1">{org.institutionName}</h4>
                      </div>
                      <Badge variant="info" className="text-[10px]">
                        {org.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span>Lead Scientist:</span>
                        <span className="font-semibold text-foreground">{org.principalScientist}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Grants:</span>
                        <span className="font-mono font-bold text-foreground">{org.activeGrantsCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Patents Filed:</span>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          {org.patentsFiledCount} Patents
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GIS Access Tier:</span>
                        <Badge variant="secondary" className="text-[9px] font-mono">
                          {org.dataAccessTier}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-base">Longitudinal Civic Issue Trajectory</h3>
              <p className="text-xs text-muted-foreground">
                6-month trend analysis comparing reported citizen complaints against SLA-compliant resolution.
              </p>
              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="reported" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Reported" />
                    <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
                    <Bar dataKey="escalated" fill="#ef4444" radius={[6, 6, 0, 0]} name="Escalated" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-base">Stakeholder Contribution Matrix</h3>
              <p className="text-xs text-muted-foreground">
                Volume of civic solutions and resources provided by non-government participants.
              </p>
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Corporate CSR Funding Utilization</span>
                    <span className="font-mono text-amber-500">72.4% (₹31.0 Cr disbursed)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "72.4%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>University Student Prototype Deployment</span>
                    <span className="font-mono text-purple-500">84.1% (186/221 prototypes deployed)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "84.1%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>NGO Grassroots Taskforce Deployment</span>
                    <span className="font-mono text-rose-500">91.8% (790 active wards)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: "91.8%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Research Patent Transfer to Line Depts</span>
                    <span className="font-mono text-sky-500">65.0% (26 licensed solutions)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 9. SYSTEM HEALTH TAB */}
        <TabsContent value="system" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/80 p-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">CPU Utilization</span>
              <div className="text-2xl font-black font-mono text-foreground">
                {systemHealth?.cpuUsagePct ?? "28"}%
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${systemHealth?.cpuUsagePct ?? 28}%` }} />
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 p-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">RAM Usage</span>
              <div className="text-2xl font-black font-mono text-foreground">
                {systemHealth ? `${Math.round((systemHealth.memoryUsedGb / systemHealth.memoryTotalGb) * 100)}%` : "42%"}
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${systemHealth ? Math.round((systemHealth.memoryUsedGb / systemHealth.memoryTotalGb) * 100) : 42}%`,
                  }}
                />
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 p-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">DB Query Latency</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {systemHealth?.databaseStatus?.avgQueryLatencyMs ?? "4.8"} ms
              </div>
              <span className="text-[10px] text-muted-foreground">Pool connections: 18/64</span>
            </Card>

            <Card className="rounded-2xl border-border/80 p-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">AI Inference P95</span>
              <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                {aiMetrics?.p95InferenceLatencyMs ?? "184"} ms
              </div>
              <span className="text-[10px] text-muted-foreground">84,200 inferences processed today</span>
            </Card>
          </div>

          {/* AI Models telemetry */}
          {aiMetrics?.models && (
            <Card className="rounded-3xl border-border/80 p-6 space-y-4">
              <h3 className="font-bold text-base">National AI Microservices & NLP Pipeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiMetrics.models.map((m) => (
                  <div key={m.name} className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{m.name}</span>
                      <Badge variant="success" className="text-[10px]">
                        {m.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.type} &bull; v{m.version}</p>
                    <div className="flex items-center justify-between text-xs pt-1 font-mono">
                      <span>Latency: {m.latencyMs}ms</span>
                      <span>{m.requestsPerMin} req/m</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* 10. AUDIT TRAIL TAB */}
        <TabsContent value="audit" className="space-y-4 m-0">
          <Card className="rounded-3xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Immutable Security & Governance Audit Trail</CardTitle>
                <CardDescription className="text-xs">
                  Cryptographically verified record of all administrative logins, privilege shifts, and ticket mutations.
                </CardDescription>
              </div>
              <Badge variant="destructive" className="font-mono text-xs">
                Tamper-Evident SHA-256
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-border/70 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Event Type</th>
                      <th className="p-3.5">Actor</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5">IP Gateway</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {(auditLogs || []).slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 font-mono text-[11px]">
                        <td className="p-3.5 text-muted-foreground">{log.timestamp}</td>
                        <td className="p-3.5 font-bold text-foreground">{log.eventType}</td>
                        <td className="p-3.5 text-muted-foreground">{log.userEmail}</td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              log.severity === "critical"
                                ? "destructive"
                                : log.severity === "warning"
                                ? "warning"
                                : "info"
                            }
                            className="text-[9px] font-bold uppercase"
                          >
                            {log.severity}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <UserFormDialog
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, data });
          } else {
            createUserMutation.mutate(data);
          }
          setUserModalOpen(false);
        }}
        initialData={editingUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <ResetPasswordDialog
        user={targetUser}
        isOpen={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
          setTargetUser(null);
        }}
        onSubmit={(data) => {
          if (targetUser) {
            resetPasswordMutation.mutate({
              id: targetUser.id,
              data,
            });
          }
          setResetModalOpen(false);
        }}
        isLoading={resetPasswordMutation.isPending}
      />
    </div>
  );
}
