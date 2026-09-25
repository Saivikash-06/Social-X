"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { governmentApi } from "../services/government-api";
import { useGovernmentStore } from "./use-government-store";
import {
  ResolveCaseFormData,
  ReassignOfficerFormData,
  TransferDepartmentFormData,
  OfficerCreationFormData,
  DepartmentCreationFormData,
} from "../validation/government-schemas";

export const GOV_QUERY_KEYS = {
  stats: ["government", "stats"] as const,
  cases: (filter?: Record<string, any>) => ["government", "cases", filter] as const,
  caseById: (id: string) => ["government", "case", id] as const,
  officers: ["government", "officers"] as const,
  departments: ["government", "departments"] as const,
  monthlyIssues: ["government", "monthly-issues"] as const,
  resolutionTrends: ["government", "resolution-trends"] as const,
  districtStats: ["government", "district-stats"] as const,
  deptMetrics: ["government", "dept-metrics"] as const,
};

export function useGovernmentDashboardStats() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.stats,
    queryFn: () => governmentApi.getDashboardStats(),
    staleTime: 1000 * 30,
  });
}

export function useGovernmentCases(filter?: {
  status?: string;
  priority?: string;
  department?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.cases(filter),
    queryFn: () => governmentApi.getCases(filter),
    staleTime: 1000 * 20,
  });
}

export function useGovernmentCase(caseId: string) {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.caseById(caseId),
    queryFn: () => governmentApi.getCaseById(caseId),
    enabled: Boolean(caseId),
  });
}

export function useGovernmentOfficers() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.officers,
    queryFn: () => governmentApi.getOfficers(),
    staleTime: 1000 * 30,
  });
}

export function useGovernmentDepartments() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.departments,
    queryFn: () => governmentApi.getDepartments(),
    staleTime: 1000 * 60,
  });
}

export function useGovernmentMonthlyIssues() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.monthlyIssues,
    queryFn: () => governmentApi.getMonthlyIssues(),
    staleTime: 1000 * 60,
  });
}

export function useGovernmentResolutionTrends() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.resolutionTrends,
    queryFn: () => governmentApi.getResolutionTrends(),
    staleTime: 1000 * 60,
  });
}

export function useGovernmentDistrictStats() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.districtStats,
    queryFn: () => governmentApi.getDistrictIssues(),
    staleTime: 1000 * 60,
  });
}

export function useGovernmentDepartmentMetrics() {
  return useQuery({
    queryKey: GOV_QUERY_KEYS.deptMetrics,
    queryFn: () => governmentApi.getDepartmentMetrics(),
    staleTime: 1000 * 60,
  });
}

export function useGovernmentMutations() {
  const queryClient = useQueryClient();
  const { officer } = useGovernmentStore();
  const officerName = officer?.name || "Command Officer";

  const approveCaseMutation = useMutation({
    mutationFn: (caseId: string) => governmentApi.approveCase(caseId, officerName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.success(`Case #${updated.id} approved. Ground team mobilized.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to approve case");
    },
  });

  const rejectCaseMutation = useMutation({
    mutationFn: ({ caseId, reason }: { caseId: string; reason: string }) =>
      governmentApi.rejectCase(caseId, reason, officerName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.info(`Case #${updated.id} marked as rejected.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to reject case");
    },
  });

  const escalateCaseMutation = useMutation({
    mutationFn: ({
      caseId,
      justification,
    }: {
      caseId: string;
      justification?: string;
    }) => governmentApi.escalateCase(caseId, officerName, justification),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.warning(`Case #${updated.id} escalated to District Collector.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to escalate case");
    },
  });

  const resolveCaseMutation = useMutation({
    mutationFn: (data: ResolveCaseFormData) =>
      governmentApi.resolveCase(data, officerName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.success(`Case #${updated.id} verified and resolved.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to resolve case");
    },
  });

  const reassignOfficerMutation = useMutation({
    mutationFn: (data: ReassignOfficerFormData) =>
      governmentApi.reassignOfficer(data, officerName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.success(`Case #${updated.id} reassigned to ${updated.officer}.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to reassign officer");
    },
  });

  const transferDepartmentMutation = useMutation({
    mutationFn: (data: TransferDepartmentFormData) =>
      governmentApi.transferDepartment(data, officerName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.success(`Case #${updated.id} transferred to ${updated.department}.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to transfer department");
    },
  });

  const addOfficerNoteMutation = useMutation({
    mutationFn: ({ caseId, note }: { caseId: string; note: string }) =>
      governmentApi.addOfficerNote(
        caseId,
        note,
        officerName,
        officer?.role || "Government Officer"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["government"] });
      toast.success("Officer directive appended to case log.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to add officer note");
    },
  });

  const createOfficerMutation = useMutation({
    mutationFn: (data: OfficerCreationFormData) =>
      governmentApi.createOfficer(data),
    onSuccess: (newOfficer) => {
      queryClient.invalidateQueries({ queryKey: GOV_QUERY_KEYS.officers });
      toast.success(
        `Government Officer Account created for ${newOfficer.name}. Pass Key: ${newOfficer.officialPassKey}`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create officer");
    },
  });

  const toggleOfficerStatusMutation = useMutation({
    mutationFn: (id: string) => governmentApi.toggleOfficerStatus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: GOV_QUERY_KEYS.officers });
      toast.info(`Officer ${updated.name} status set to ${updated.status}.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to toggle status");
    },
  });

  const regeneratePassKeyMutation = useMutation({
    mutationFn: ({
      id,
      stateCode,
      deptCode,
    }: {
      id: string;
      stateCode?: string;
      deptCode?: string;
    }) => governmentApi.regenerateOfficerPassKey(id, stateCode, deptCode),
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: GOV_QUERY_KEYS.officers });
      toast.success(`Generated New Official Pass Key: ${newKey}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to regenerate pass key");
    },
  });

  const deleteOfficerMutation = useMutation({
    mutationFn: (id: string) => governmentApi.deleteOfficer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOV_QUERY_KEYS.officers });
      toast.success("Officer account removed.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete officer");
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: DepartmentCreationFormData) =>
      governmentApi.createDepartment(data),
    onSuccess: (newDept) => {
      queryClient.invalidateQueries({ queryKey: GOV_QUERY_KEYS.departments });
      toast.success(`Department ${newDept.name} initialized.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create department");
    },
  });

  return {
    approveCaseMutation,
    rejectCaseMutation,
    escalateCaseMutation,
    resolveCaseMutation,
    reassignOfficerMutation,
    transferDepartmentMutation,
    addOfficerNoteMutation,
    createOfficerMutation,
    toggleOfficerStatusMutation,
    regeneratePassKeyMutation,
    deleteOfficerMutation,
    createDepartmentMutation,
  };
}
