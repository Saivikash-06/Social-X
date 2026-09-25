"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { reassignIssueSchema, ReassignIssueFormData } from "../../validation/admin-schemas";
import { AdminIssue, AdminDepartment } from "../../types";

interface ReassignIssueDialogProps {
  issue: AdminIssue | null;
  departments: AdminDepartment[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReassignIssueFormData) => void;
  isLoading?: boolean;
}

export function ReassignIssueDialog({
  issue,
  departments,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ReassignIssueDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReassignIssueFormData>({
    resolver: zodResolver(reassignIssueSchema) as any,
    defaultValues: {
      departmentId: issue?.departmentId || "dept-pwd-01",
      stakeholderType: "none",
      stakeholderName: "",
      priority: issue?.priority || "High",
      escalateSla: false,
      officialRemarks: "",
    },
  });

  const selectedStakeholderType = watch("stakeholderType");

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Reassign Civic Issue</h2>
              <p className="text-xs text-muted-foreground">Tracking ID: {issue.trackingNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-xl">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">{issue.title}</p>
            <p>Current Dept: <span className="font-semibold text-foreground">{issue.departmentName}</span> • District: {issue.district}</p>
          </div>

          {/* Department Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="departmentId" className="text-xs font-semibold">
              Target Line Department
            </Label>
            <select
              id="departmentId"
              {...register("departmentId")}
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label htmlFor="priority" className="text-xs font-semibold">
              Triage Priority
            </Label>
            <select
              id="priority"
              {...register("priority")}
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="Critical">Critical (Immediate Executive Attention)</option>
              <option value="High">High (24h - 48h SLA)</option>
              <option value="Medium">Medium (3 - 7 days SLA)</option>
              <option value="Low">Low (Routine municipal schedule)</option>
            </select>
          </div>

          {/* Stakeholder Collaboration Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="stakeholderType" className="text-xs font-semibold">
                Attach Partner Stakeholder
              </Label>
              <select
                id="stakeholderType"
                {...register("stakeholderType")}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="none">None (Department Only)</option>
                <option value="university">University Lab (R&D Pilot)</option>
                <option value="industry">Corporate CSR Sponsor</option>
                <option value="ngo">Civil Society / Volunteer Squad</option>
              </select>
            </div>

            {selectedStakeholderType !== "none" && (
              <div className="space-y-1.5">
                <Label htmlFor="stakeholderName" className="text-xs font-semibold">
                  Partner Organization Name
                </Label>
                <input
                  id="stakeholderName"
                  placeholder="e.g. COEP Tech / Tata Motors"
                  {...register("stakeholderName")}
                  className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium"
                />
              </div>
            )}
          </div>

          {/* Official Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="officialRemarks" className="text-xs font-semibold">
              Official Reassignment Remarks (Logged in Audit Trail)
            </Label>
            <Textarea
              id="officialRemarks"
              placeholder="Provide justification and specific operational directives for the receiving department..."
              {...register("officialRemarks")}
              className="rounded-xl border-border/80 text-xs min-h-[80px]"
            />
            {errors.officialRemarks && (
              <p className="text-xs text-destructive">{errors.officialRemarks.message}</p>
            )}
          </div>

          {/* SLA Escalation Check */}
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-600 dark:text-rose-400">
              <input
                type="checkbox"
                {...register("escalateSla")}
                className="rounded border-border text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Mark as High-Priority Administrative SLA Escalation</span>
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md"
            >
              Reassign & Dispatch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
