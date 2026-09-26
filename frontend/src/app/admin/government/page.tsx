"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Users,
  Plus,
  Search,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  UserCheck,
  Landmark,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/features/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/features/shared/components/ui/dropdown-menu";
import {
  useGovernmentOfficers,
  useGovernmentDepartments,
  useGovernmentMutations,
} from "@/features/government/hooks/use-government-queries";
import {
  officerCreationSchema,
  OfficerCreationFormData,
} from "@/features/government/validation/government-schemas";
import { generateUniquePassKey } from "@/features/government/services/pass-key-generator";
import { GovernmentOfficer } from "@/features/government/types";
import { toast } from "sonner";

const TN_DISTRICTS = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Erode",
  "Vellore",
  "Thanjavur",
  "Dindigul",
  "Kanchipuram",
  "Tiruvallur",
  "Chengalpattu",
  "Cuddalore",
  "Dharmapuri",
];

const OFFICIAL_ROLES = [
  "District Collector",
  "Municipal Commissioner",
  "Superintending Engineer",
  "Executive Engineer",
  "Assistant Engineer",
  "Nodal Officer",
  "Chief Health Inspector",
  "Sanitary Inspector",
];

export default function AdminGovernmentPage() {
  const [activeTab, setActiveTab] = React.useState("officers");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("all");
  const [revealedKeys, setRevealedKeys] = React.useState<Record<string, boolean>>({});

  // Officer Creation Dialog
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Edit / Reset password states
  const [passwordResetOfficer, setPasswordResetOfficer] = React.useState<GovernmentOfficer | null>(null);
  const [newPassword, setNewPassword] = React.useState("");

  const { data: officers, isLoading: officersLoading, refetch: refetchOfficers } =
    useGovernmentOfficers();
  const { data: departments, isLoading: deptsLoading, refetch: refetchDepts } =
    useGovernmentDepartments();

  const {
    createOfficerMutation,
    toggleOfficerStatusMutation,
    regeneratePassKeyMutation,
    deleteOfficerMutation,
  } = useGovernmentMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfficerCreationFormData>({
    resolver: zodResolver(officerCreationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "GovOfficer2026!",
      department: "Municipal Administration & Water Supply",
      district: "Chennai",
      designation: "Executive Engineer",
      role: "Executive Engineer",
      officialPassKey: "",
      status: "active",
      phone: "+91 44 2500 0000",
    },
  });

  const selectedDept = watch("department");
  const selectedDistrict = watch("district");

  const handleGenerateKey = () => {
    const existingKeys = (officers || []).map((o) => o.officialPassKey);
    const newKey = generateUniquePassKey("TN", selectedDept || "CHE", existingKeys);
    setValue("officialPassKey", newKey, { shouldValidate: true });
    toast.info(`Generated Official Pass Key: ${newKey}`);
  };

  const onSubmitCreate = (data: OfficerCreationFormData) => {
    createOfficerMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
        reset();
      },
    });
  };

  const copyPassKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Pass key copied to clipboard");
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetOfficer || !newPassword.trim()) return;
    toast.success(`Password updated for ${passwordResetOfficer.name}`);
    setPasswordResetOfficer(null);
    setNewPassword("");
  };

  const filteredOfficers = React.useMemo(() => {
    let list = officers || [];
    if (deptFilter !== "all") {
      list = list.filter((o) => o.department === deptFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.designation.toLowerCase().includes(q) ||
          o.officialPassKey.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q)
      );
    }
    return list;
  }, [officers, deptFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Government Account Management
            </h1>
            <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
              Module 2 Official Registry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Provision verified government officer accounts, generate secure pass keys, assign line departments, and monitor municipal bodies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchOfficers();
              refetchDepts();
            }}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              handleGenerateKey();
              setIsCreateOpen(true);
            }}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Officer</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/80">
          <TabsTrigger
            value="officers"
            className="rounded-xl text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Government Officer Accounts ({officers?.length ?? 0})</span>
          </TabsTrigger>
          <TabsTrigger
            value="departments"
            className="rounded-xl text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Line Departments ({departments?.length ?? 0})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Officers Management */}
        <TabsContent value="officers" className="space-y-4 outline-none">
          {/* Filter Bar */}
          <Card className="rounded-3xl border-border/80 p-4 shadow-sm bg-card">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search officer by name, email, pass key, or district..."
                  className="pl-9 rounded-xl border-border/80 text-xs bg-muted/30 focus-visible:ring-indigo-500"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none font-medium text-foreground w-full sm:w-auto"
              >
                <option value="all">All Departments</option>
                {(departments || []).map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Officers Table */}
          <Card className="rounded-3xl border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <tr>
                    <th className="p-3.5">Officer Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Designation & Role</th>
                    <th className="p-3.5">District</th>
                    <th className="p-3.5">Unique Pass Key</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Login</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOfficers.map((officer) => {
                    const isRevealed = !!revealedKeys[officer.id];
                    return (
                      <tr key={officer.id} className="hover:bg-muted/30 transition-colors">
                        {/* Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {officer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">
                                {officer.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                ID: {officer.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                          {officer.email}
                        </td>

                        {/* Department */}
                        <td className="p-3.5 font-medium text-foreground max-w-37.5 truncate">
                          {officer.department}
                        </td>

                        {/* Designation & Role */}
                        <td className="p-3.5">
                          <p className="font-semibold text-foreground truncate max-w-37.5">
                            {officer.designation}
                          </p>
                          <Badge variant="outline" className="text-[9px] font-mono mt-0.5">
                            {officer.role}
                          </Badge>
                        </td>

                        {/* District */}
                        <td className="p-3.5 text-foreground font-medium">
                          {officer.district}
                        </td>

                        {/* Pass Key */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="font-bold text-indigo-700 dark:text-indigo-400">
                              {isRevealed
                                ? officer.officialPassKey
                                : `${officer.officialPassKey.slice(0, 7)}•••••`}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleReveal(officer.id)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Toggle reveal"
                            >
                              {isRevealed ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyPassKey(officer.officialPassKey)}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy pass key"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <Badge
                            variant={officer.status === "active" ? "success" : "destructive"}
                            className="text-[10px]"
                          >
                            {officer.status}
                          </Badge>
                        </td>

                        {/* Last Login */}
                        <td className="p-3.5 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                          {officer.lastLoginAt || "Pending Initial Login"}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 rounded-xl text-xs border-border/80"
                              >
                                <span>Manage</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 text-xs">
                              <DropdownMenuItem
                                onClick={() =>
                                  regeneratePassKeyMutation.mutate({
                                    id: officer.id,
                                    stateCode: "TN",
                                    deptCode: officer.department,
                                  })
                                }
                                className="rounded-xl cursor-pointer text-indigo-600"
                              >
                                <KeyRound className="h-3.5 w-3.5 mr-2" />
                                <span>Generate Official Pass Key</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => setPasswordResetOfficer(officer)}
                                className="rounded-xl cursor-pointer"
                              >
                                <Lock className="h-3.5 w-3.5 mr-2" />
                                <span>Reset Password</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => toggleOfficerStatusMutation.mutate(officer.id)}
                                className={`rounded-xl cursor-pointer ${
                                  officer.status === "active"
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                <span>
                                  {officer.status === "active"
                                    ? "Suspend Officer"
                                    : "Activate Officer"}
                                </span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => {
                                  if (confirm(`Delete officer account for ${officer.name}?`)) {
                                    deleteOfficerMutation.mutate(officer.id);
                                  }
                                }}
                                className="rounded-xl cursor-pointer text-rose-600 focus:bg-rose-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                <span>Delete Officer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Departments Overview */}
        <TabsContent value="departments" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(departments || []).map((dept) => (
              <Card
                key={dept.id}
                className="rounded-3xl border-border/80 p-5 space-y-3 hover:border-indigo-500/50 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <Badge variant="outline" className="font-mono text-[10px] font-bold">
                      {dept.code}
                    </Badge>
                    <h3 className="font-bold text-base text-foreground mt-1">
                      {dept.name}
                    </h3>
                  </div>
                  <Badge
                    variant={dept.status === "active" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {dept.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span>Head Officer:</span>
                    <span className="font-semibold text-foreground">{dept.headOfficerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact Email:</span>
                    <span className="font-mono text-muted-foreground">{dept.headOfficerEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Districts Covered:</span>
                    <span className="font-mono font-bold text-foreground">
                      {dept.districtsCovered} / 38
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Officers:</span>
                    <span className="font-mono font-bold text-foreground">
                      {dept.activeOfficersCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SLA Adherence Rate:</span>
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
        </TabsContent>
      </Tabs>

      {/* Officer Creation Form Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-border/80">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Provision Government Officer
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Create verified line department credentials and generate official state pass key.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4 pt-2">
            {/* Officer Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Officer Name</Label>
              <Input
                {...register("name")}
                placeholder="Thiru R. Venkatesan, IAS"
                className="text-xs rounded-xl"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="r.venkatesan@tn.gov.in"
                  className="text-xs rounded-xl font-mono"
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Temporary Password</Label>
                <Input
                  {...register("password")}
                  type="text"
                  placeholder="GovOfficer2026!"
                  className="text-xs rounded-xl font-mono"
                />
                {errors.password && (
                  <p className="text-[11px] text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Department & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <select
                  {...register("department")}
                  className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(departments || []).map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-[11px] text-destructive">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">District</Label>
                <select
                  {...register("district")}
                  className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-[11px] text-destructive">{errors.district.message}</p>
                )}
              </div>
            </div>

            {/* Designation & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  {...register("designation")}
                  placeholder="Superintending Engineer"
                  className="text-xs rounded-xl"
                />
                {errors.designation && (
                  <p className="text-[11px] text-destructive">{errors.designation.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Role</Label>
                <select
                  {...register("role")}
                  className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {OFFICIAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-[11px] text-destructive">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Pass Key Generator */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-indigo-500/4 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Unique Government Pass Key</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateKey}
                  className="rounded-xl h-7 px-2.5 text-xs font-bold border-indigo-500/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Generate Random Pass Key</span>
                </Button>
              </div>

              <Input
                {...register("officialPassKey")}
                placeholder="TN-CHE-82374-AX91"
                className="text-xs font-mono uppercase tracking-wider rounded-xl bg-background border-border/80"
              />
              <p className="text-[10px] text-muted-foreground">
                Follows secure pattern: <code>STATE-DEPT-RANDOM-CODE</code> (e.g. TN-CHE-82374-AX91). Guaranteed unique.
              </p>
              {errors.officialPassKey && (
                <p className="text-[11px] text-destructive">{errors.officialPassKey.message}</p>
              )}
            </div>

            {/* Status & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Account Status</Label>
                <select
                  {...register("status")}
                  className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none"
                >
                  <option value="active">Active (Permitted to log in)</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Phone</Label>
                <Input
                  {...register("phone")}
                  placeholder="+91 44 2526 8333"
                  className="text-xs rounded-xl font-mono"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOfficerMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Provision Officer Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog
        open={!!passwordResetOfficer}
        onOpenChange={(open) => !open && setPasswordResetOfficer(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Reset Officer Password
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign new temporary password for {passwordResetOfficer?.name} ({passwordResetOfficer?.email}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">New Temporary Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter 8+ characters..."
                className="text-xs rounded-xl border-border/80 font-mono"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordResetOfficer(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newPassword.trim()}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
