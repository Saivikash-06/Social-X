"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ngoApi } from "../services/ngo-api";
import { useNgoStore } from "./use-ngo-store";
import {
  NgoLoginFormData,
  FieldActivityFormData,
  ApplyProjectFormData,
  AssignVolunteerFormData,
  GenerateReportFormData,
  NgoProfileFormData,
} from "../validation/ngo-schemas";

export function useNgoStats() {
  return useQuery({
    queryKey: ["ngo-stats"],
    queryFn: () => ngoApi.getDashboardStats(),
    staleTime: 30 * 1000,
  });
}

export function useNgoOrganization() {
  const { organization, setOrganization } = useNgoStore();
  return useQuery({
    queryKey: ["ngo-organization"],
    queryFn: async () => {
      const data = await ngoApi.getOrganizationProfile();
      setOrganization(data);
      return data;
    },
    initialData: organization,
    staleTime: 60 * 1000,
  });
}

export function useAvailableProjects(params?: {
  category?: string;
  district?: string;
  priority?: string;
  search?: string;
}) {
  const { bookmarkedProjectIds } = useNgoStore();
  return useQuery({
    queryKey: ["ngo-available-projects", params, bookmarkedProjectIds],
    queryFn: async () => {
      const projects = await ngoApi.getAvailableProjects(params);
      return projects.map((p) => ({
        ...p,
        isBookmarked: bookmarkedProjectIds.includes(p.id),
      }));
    },
    staleTime: 30 * 1000,
  });
}

export function useAssignedProjects() {
  return useQuery({
    queryKey: ["ngo-assigned-projects"],
    queryFn: () => ngoApi.getAssignedProjects(),
    staleTime: 30 * 1000,
  });
}

export function useFieldActivities() {
  return useQuery({
    queryKey: ["ngo-activities"],
    queryFn: () => ngoApi.getFieldActivities(),
    staleTime: 30 * 1000,
  });
}

export function useVolunteers() {
  return useQuery({
    queryKey: ["ngo-volunteers"],
    queryFn: () => ngoApi.getVolunteers(),
    staleTime: 30 * 1000,
  });
}

export function useImpactAnalytics() {
  return useQuery({
    queryKey: ["ngo-impact-analytics"],
    queryFn: () => ngoApi.getImpactAnalytics(),
    staleTime: 60 * 1000,
  });
}

export function useCollaborations() {
  return useQuery({
    queryKey: ["ngo-collaborations"],
    queryFn: () => ngoApi.getCollaborations(),
    staleTime: 30 * 1000,
  });
}

export function useNgoReports() {
  return useQuery({
    queryKey: ["ngo-reports"],
    queryFn: () => ngoApi.getReports(),
    staleTime: 60 * 1000,
  });
}

export function useNgoCertificates() {
  return useQuery({
    queryKey: ["ngo-certificates"],
    queryFn: () => ngoApi.getCertificates(),
    staleTime: 60 * 1000,
  });
}

export function useNgoConversations() {
  return useQuery({
    queryKey: ["ngo-conversations"],
    queryFn: () => ngoApi.getConversations(),
    staleTime: 10 * 1000,
  });
}

export function useNgoMessages(conversationId: string) {
  return useQuery({
    queryKey: ["ngo-messages", conversationId],
    queryFn: () => ngoApi.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
}

// Master Hook
export function useNgoQueries() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setOrganization, addNotification } = useNgoStore();

  const loginMutation = useMutation({
    mutationFn: (data: NgoLoginFormData) => ngoApi.loginNgo(data),
    onSuccess: (user) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_ngo_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_ngo_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      toast.success(`Welcome, ${user.name}! Accessing Civil Society & NGO Portal.`);
      router.push("/ngo/dashboard");
    },
    onError: () => {
      toast.error("Failed to authenticate NGO credentials.");
    },
  });

  const loginGoogleMutation = useMutation({
    mutationFn: () => ngoApi.loginGoogleNgo(),
    onSuccess: (user) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_ngo_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_ngo_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      toast.success(`Welcome, ${user.name}! Accessing NGO Portal via Google.`);
      router.push("/ngo/dashboard");
    },
    onError: () => {
      toast.error("Google authentication failed.");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: NgoProfileFormData) => ngoApi.updateOrganizationProfile(data),
    onSuccess: (updated) => {
      setOrganization(updated);
      queryClient.invalidateQueries({ queryKey: ["ngo-organization"] });
      toast.success("Organization profile updated successfully.");
    },
  });

  const applyProjectMutation = useMutation({
    mutationFn: (data: ApplyProjectFormData) => ngoApi.applyProject(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ngo-available-projects"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-stats"] });
      addNotification({
        title: "Project Application Submitted",
        description: res.message,
        category: "project",
        actionUrl: "/ngo/projects",
        actionLabel: "View Application",
      });
      toast.success(res.message);
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: FieldActivityFormData) => ngoApi.createFieldActivity(data),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: ["ngo-activities"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-stats"] });
      addNotification({
        title: "Field Activity Logged",
        description: `Activity at ${activity.location} submitted for nodal officer review.`,
        category: "approval",
        actionUrl: "/ngo/field-activities",
        actionLabel: "View Gallery",
      });
      toast.success("Field activity evidence logged successfully!");
    },
  });

  const assignVolunteerMutation = useMutation({
    mutationFn: (data: AssignVolunteerFormData) => ngoApi.assignVolunteer(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ngo-volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-assigned-projects"] });
      toast.success(res.message);
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: (data: GenerateReportFormData) => ngoApi.generateReport(data),
    onSuccess: (rep) => {
      queryClient.invalidateQueries({ queryKey: ["ngo-reports"] });
      toast.success(`Generated ${rep.title}`);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      ngoApi.sendMessage(conversationId, content),
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["ngo-messages", msg.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ngo-conversations"] });
    },
  });

  return {
    loginMutation,
    loginGoogleMutation,
    updateProfileMutation,
    applyProjectMutation,
    createActivityMutation,
    assignVolunteerMutation,
    generateReportMutation,
    sendMessageMutation,
  };
}
