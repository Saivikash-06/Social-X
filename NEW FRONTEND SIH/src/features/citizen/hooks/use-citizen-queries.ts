"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { citizenApi } from "../services/citizen-api";
import { CitizenProfileUpdate, CitizenSettings } from "../types";

export function useCitizenQueries() {
  const queryClient = useQueryClient();

  // Metrics query
  const useMetrics = () =>
    useQuery({
      queryKey: ["citizen-metrics"],
      queryFn: () => citizenApi.getDashboardMetrics(),
      staleTime: 30 * 1000,
    });

  // Issues query
  const useIssues = (params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    useQuery({
      queryKey: ["citizen-issues", params],
      queryFn: () => citizenApi.getMyIssues(params),
      staleTime: 30 * 1000,
    });

  // Single issue details query
  const useIssue = (id: string) =>
    useQuery({
      queryKey: ["citizen-issue", id],
      queryFn: () => citizenApi.getIssueById(id),
      enabled: !!id,
    });

  // Notifications query
  const useNotifications = () =>
    useQuery({
      queryKey: ["citizen-notifications"],
      queryFn: () => citizenApi.getNotifications(),
      staleTime: 15 * 1000,
    });

  // AI Media Analysis Mutation
  const analyzeMediaMutation = useMutation({
    mutationFn: (formData: FormData) => citizenApi.analyzeMediaAI(formData),
    onError: (err: Error) => {
      toast.error("AI Analysis Glitch", {
        description:
          err.message || "Failed to analyze uploaded media. Proceeding with manual input.",
      });
    },
  });

  // Submit Issue Mutation
  const submitIssueMutation = useMutation({
    mutationFn: (data: {
      title: string;
      category: string;
      description: string;
      priority: string;
      department: string;
      latitude: number;
      longitude: number;
      address: string;
      files?: File[];
    }) => citizenApi.submitIssue(data),
    onSuccess: (res) => {
      toast.success("Issue Dispatched Successfully!", {
        description: `Grievance registered under ID ${res.issueId}. Routed to municipal node.`,
      });
      queryClient.invalidateQueries({ queryKey: ["citizen-issues"] });
      queryClient.invalidateQueries({ queryKey: ["citizen-metrics"] });
    },
    onError: (err: Error) => {
      toast.error("Submission Failed", {
        description: err.message,
      });
    },
  });

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: CitizenProfileUpdate) => citizenApi.updateProfile(data),
    onSuccess: (res) => {
      toast.success("Profile Updated", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Update Failed", {
        description: err.message,
      });
    },
  });

  // Update Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: CitizenSettings) => citizenApi.updateSettings(data),
    onSuccess: (res) => {
      toast.success("Settings Saved", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Save Failed", {
        description: err.message,
      });
    },
  });

  // Request Delete Account Mutation
  const requestDeleteAccountMutation = useMutation({
    mutationFn: () => citizenApi.requestDeleteAccount(),
    onSuccess: (res) => {
      toast.info("Deletion Request Logged", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Request Failed", {
        description: err.message,
      });
    },
  });

  return {
    useMetrics,
    useIssues,
    useIssue,
    useNotifications,
    analyzeMediaMutation,
    submitIssueMutation,
    updateProfileMutation,
    updateSettingsMutation,
    requestDeleteAccountMutation,
  };
}
