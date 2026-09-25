"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  ClipboardList,
  TrendingUp,
  Landmark,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/features/shared/components/ui/dialog";
import {
  departmentCreationSchema,
  DepartmentCreationFormData,
} from "@/features/government/validation/government-schemas";
import {
  useGovernmentDepartments,
  useGovernmentOfficers,
  useGovernmentMutations,
} from "@/features/government/hooks/use-government-queries";
import { GovernmentDepartment } from "@/features/government/types";
import { toast } from "sonner";

export default function GovernmentDepartmentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingDept, setEditingDept] = React.useState<GovernmentDepartment | null>(null);

  const { data: departments, isLoading, refetch } = useGovernmentDepartments();
  const { data: officers } = useGovernmentOfficers();
  const { createDepartmentMutation } = useGovernmentMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentCreationFormData>({
    resolver: zodResolver(departmentCreationSchema),
    defaultValues: {
      code: "",
      name: "",
      headOfficerName: "",
      headOfficerEmail: "",
      districtsCovered: 38,
      budgetAllocatedCr: 250,
      status: "active",
    },
  });

  const onSubmit = (data: DepartmentCreationFormData) => {
    createDepartmentMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setIsCreateOpen(false);
      },
    });
  };

  const filteredDepts = React.useMemo(() => {
    if (!searchTerm.trim()) return departments || [];
    const q = searchTerm.toLowerCase();
    return (departments || []).filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.headOfficerName.toLowerCase().includes(q)
    );
  }, [departments, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Municipal Line Departments
            </h1>
            <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
              {departments?.length ?? 6} Registered
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Oversee civic departments, track SLA compliance rates, and allocate budgetary grants.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Department</span>
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by department name, code, or nodal head..."
          className="pl-9 rounded-xl border-border/80 text-xs bg-card focus-visible:ring-indigo-500"
        />
      </div>

      {/* Departments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => (
          <Card
            key={dept.id}
            className="rounded-3xl border-border/80 p-5 space-y-4 hover:border-indigo-500/50 transition-colors shadow-sm bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
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

            {/* Department Metrics */}
            <div className="space-y-2 text-xs pt-2 border-t border-border/60">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Head Officer:</span>
                <span className="font-semibold text-foreground truncate max-w-40">
                  {dept.headOfficerName}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Official Email:</span>
                <span className="font-mono text-foreground truncate max-w-40">
                  {dept.headOfficerEmail}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Districts Covered:</span>
                <span className="font-mono font-bold text-foreground">
                  {dept.districtsCovered} / 38
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Active Field Officers:</span>
                <span className="font-mono font-bold text-foreground">
                  {dept.activeOfficersCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Current Active Cases:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {dept.activeIssuesCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>SLA Adherence Rate:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {dept.slaComplianceRate}%
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Budget (Allocated / Spent):</span>
                <span className="font-mono text-foreground">
                  ₹{dept.budgetAllocatedCr}Cr / ₹{dept.budgetUtilizedCr}Cr
                </span>
              </div>
            </div>

            {/* Progress Bar for Budget */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Budget Utilization</span>
                <span>
                  {Math.round((dept.budgetUtilizedCr / dept.budgetAllocatedCr) * 100)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((dept.budgetUtilizedCr / dept.budgetAllocatedCr) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info(`Assigned officers: ${dept.activeOfficersCount}`)}
                className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 rounded-xl"
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>Officers</span>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs rounded-xl h-7 border-border/80 hover:bg-indigo-600 hover:text-white transition-colors gap-1"
              >
                <Link href={`/government/departments/${dept.id}/progress`}>
                  <TrendingUp className="h-3 w-3 text-indigo-500" />
                  <span>Stats</span>
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Department Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Create New Line Department
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a municipal engineering or civic administration body.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Department Code (e.g. PWD, MAWS)</Label>
              <Input
                {...register("code")}
                placeholder="HIGHWAYS"
                className="text-xs rounded-xl uppercase font-mono"
              />
              {errors.code && (
                <p className="text-[11px] text-destructive">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Department Name</Label>
              <Input
                {...register("name")}
                placeholder="Highways & Minor Ports (Roads)"
                className="text-xs rounded-xl"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Head Officer Name</Label>
              <Input
                {...register("headOfficerName")}
                placeholder="Er. S. Anbarasan"
                className="text-xs rounded-xl"
              />
              {errors.headOfficerName && (
                <p className="text-[11px] text-destructive">{errors.headOfficerName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Head Officer Email</Label>
              <Input
                {...register("headOfficerEmail")}
                type="email"
                placeholder="ee.roads@tn.gov.in"
                className="text-xs rounded-xl font-mono"
              />
              {errors.headOfficerEmail && (
                <p className="text-[11px] text-destructive">{errors.headOfficerEmail.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Districts Covered</Label>
                <Input
                  {...register("districtsCovered", { valueAsNumber: true })}
                  type="number"
                  className="text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Budget Grant (₹ Cr)</Label>
                <Input
                  {...register("budgetAllocatedCr", { valueAsNumber: true })}
                  type="number"
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-3">
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
                disabled={createDepartmentMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Create Department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
