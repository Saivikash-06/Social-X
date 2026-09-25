"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminApi, mapAdminDashboardStats } from "../services/admin-api";
import { DEFAULT_ADMIN_STATS } from "../types";
import { useAdminStore } from "./use-admin-store";
import {
  AdminLoginFormData,
  UserFormData,
  ResetPasswordFormData,
  DepartmentFormData,
  ReassignIssueFormData,
  SystemSettingsFormData,
} from "../validation/admin-schemas";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getDashboardStats(),
    staleTime: 30 * 1000,
    initialData: DEFAULT_ADMIN_STATS,
    select: (data) => mapAdminDashboardStats(data),
  });
}


export function useAdminUsers(params?: { role?: string; search?: string; status?: string }) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminApi.getUsers(params),
    staleTime: 15 * 1000,
  });
}

export function useAdminRoles() {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => adminApi.getRoles(),
    staleTime: 60 * 1000,
  });
}

export function useAdminDepartments() {
  return useQuery({
    queryKey: ["admin-departments"],
    queryFn: () => adminApi.getDepartments(),
    staleTime: 30 * 1000,
  });
}

export function useAdminUniversities() {
  return useQuery({
    queryKey: ["admin-universities"],
    queryFn: () => adminApi.getUniversities(),
    staleTime: 30 * 1000,
  });
}

export function useAdminIndustries() {
  return useQuery({
    queryKey: ["admin-industries"],
    queryFn: () => adminApi.getIndustries(),
    staleTime: 30 * 1000,
  });
}

export function useAdminNgos() {
  return useQuery({
    queryKey: ["admin-ngos"],
    queryFn: () => adminApi.getNgos(),
    staleTime: 30 * 1000,
  });
}

export function useAdminResearchOrgs() {
  return useQuery({
    queryKey: ["admin-research-orgs"],
    queryFn: () => adminApi.getResearchOrgs(),
    staleTime: 30 * 1000,
  });
}

export function useAdminIssues(params?: { status?: string; search?: string; department?: string }) {
  return useQuery({
    queryKey: ["admin-issues", params],
    queryFn: () => adminApi.getIssues(params),
    staleTime: 15 * 1000,
  });
}

export function useAiTelemetry() {
  return useQuery({
    queryKey: ["admin-ai-telemetry"],
    queryFn: () => adminApi.getAiMetrics(),
    refetchInterval: 10 * 1000, // Real-time pulse
    staleTime: 5 * 1000,
  });
}

export function useWorkflowLogs() {
  return useQuery({
    queryKey: ["admin-workflow-logs"],
    queryFn: () => adminApi.getWorkflowLogs(),
    staleTime: 20 * 1000,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => adminApi.getAuditLogs(),
    staleTime: 20 * 1000,
  });
}

export function useApiMetrics() {
  return useQuery({
    queryKey: ["admin-api-metrics"],
    queryFn: () => adminApi.getApiMetrics(),
    refetchInterval: 10 * 1000,
    staleTime: 5 * 1000,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin-system-health"],
    queryFn: () => adminApi.getSystemHealth(),
    refetchInterval: 8 * 1000,
    staleTime: 4 * 1000,
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminApi.getSettings(),
    staleTime: 60 * 1000,
  });
}

export function useAdminMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAdminStore();

  const loginMutation = useMutation({
    mutationFn: (data: AdminLoginFormData) => adminApi.login(data),
    onSuccess: (data) => {
      setUser(data.user);
      if (typeof document !== "undefined") {
        document.cookie = `social_x_admin_role=super_admin; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `social_x_admin_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      toast.success("Root Administrator Authenticated", {
        description: `Welcome back, ${data.user.name}. All security clears active.`,
      });
      router.push("/admin/dashboard");
    },
    onError: () => {
      toast.error("Authentication Failed", {
        description: "Invalid root credentials or hardware key mismatch.",
      });
    },
  });

  const loginGoogleMutation = useMutation({
    mutationFn: () => adminApi.loginWithGoogle(),
    onSuccess: (data) => {
      setUser(data.user);
      if (typeof document !== "undefined") {
        document.cookie = `social_x_admin_role=super_admin; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `social_x_admin_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      toast.success("Google Workspace SSO Verified", {
        description: `Authenticated as ${data.user.name} via Govt SSO.`,
      });
      router.push("/admin/dashboard");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (data: UserFormData) => adminApi.createUser(data),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User Provisioned Successfully", {
        description: `${newUser.fullName} has been granted '${newUser.roleLabel}' credentials.`,
      });
    },
    onError: () => {
      toast.error("Failed to provision user. Please try again.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User Record Updated", {
        description: "Profile information and privileges synced to directory.",
      });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "suspended" }) =>
      adminApi.toggleUserStatus(id, status),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(`User ${user.status === "suspended" ? "Suspended" : "Activated"}`, {
        description: `${user.fullName} access status has been updated.`,
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordFormData }) =>
      adminApi.resetUserPassword(id, data),
    onSuccess: (res) => {
      toast.success("Password Reset Initiated", {
        description: res.message,
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User Permanently Deleted");
    },
  });

  const verifyUniversityMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      adminApi.verifyUniversity(id, status),
    onSuccess: (uni) => {
      queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
      toast.success(`University Status Updated: ${uni.verificationStatus.toUpperCase()}`);
    },
  });

  const verifyIndustryMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "verified" | "flagged" }) =>
      adminApi.verifyIndustry(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-industries"] });
      toast.success("Industry CSR Accreditation Updated");
    },
  });

  const verifyNgoMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "verified" | "flagged" }) =>
      adminApi.verifyNgo(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ngos"] });
      toast.success("NGO NITI Aayog Darpan Status Updated");
    },
  });

  const reassignIssueMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReassignIssueFormData }) =>
      adminApi.reassignIssue(id, data),
    onSuccess: (issue) => {
      queryClient.invalidateQueries({ queryKey: ["admin-issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Issue Reassigned Successfully", {
        description: `Issue ${issue.trackingNumber} transferred to ${issue.departmentName}.`,
      });
    },
  });

  const archiveIssueMutation = useMutation({
    mutationFn: ({ id, archive }: { id: string; archive: boolean }) =>
      adminApi.archiveIssue(id, archive),
    onSuccess: (issue) => {
      queryClient.invalidateQueries({ queryKey: ["admin-issues"] });
      toast.success(`Issue ${issue.isArchived ? "Archived" : "Restored"}`);
    },
  });

  const deleteIssueMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Issue Permanently Deleted from Registry");
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: DepartmentFormData) => adminApi.createDepartment(data),
    onSuccess: (dept) => {
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(`Department Created: ${dept.name} (${dept.code})`);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
      toast.success("Department Removed from Platform");
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<SystemSettingsFormData>) => adminApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("System Settings Saved & Propagated");
    },
  });

  return {
    loginMutation,
    loginGoogleMutation,
    createUserMutation,
    updateUserMutation,
    toggleUserStatusMutation,
    resetPasswordMutation,
    deleteUserMutation,
    verifyUniversityMutation,
    verifyIndustryMutation,
    verifyNgoMutation,
    reassignIssueMutation,
    archiveIssueMutation,
    deleteIssueMutation,
    createDepartmentMutation,
    deleteDepartmentMutation,
    updateSettingsMutation,
  };
}
