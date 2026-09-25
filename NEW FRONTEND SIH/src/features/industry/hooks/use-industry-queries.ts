"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { industryApi } from "../services/industry-api";
import { useIndustryStore } from "./use-industry-store";
import {
  IndustryLoginFormData,
  OrganizationProfileFormData,
  SponsorProjectFormData,
  ReleaseFundsFormData,
  ScheduleMeetingFormData,
  AssignTaskFormData,
  RateTeamFormData,
  PrototypeReviewFormData,
} from "../validation/industry-schemas";

export function useIndustryStats() {
  return useQuery({
    queryKey: ["industry-stats"],
    queryFn: () => industryApi.getDashboardStats(),
    staleTime: 30 * 1000,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ["industry-activities"],
    queryFn: () => industryApi.getRecentActivities(),
    staleTime: 30 * 1000,
  });
}

export function useOrganizationProfile() {
  const { organization, setOrganization } = useIndustryStore();
  return useQuery({
    queryKey: ["industry-organization-profile"],
    queryFn: async () => {
      const profile = await industryApi.getOrganizationProfile();
      setOrganization(profile);
      return profile;
    },
    initialData: organization,
    staleTime: 60 * 1000,
  });
}

export function useIndustryProjects(params?: {
  category?: string;
  district?: string;
  status?: string;
  search?: string;
}) {
  const { bookmarkedProjectIds } = useIndustryStore();
  return useQuery({
    queryKey: ["industry-projects", params, bookmarkedProjectIds],
    queryFn: async () => {
      const projects = await industryApi.getProjects(params);
      return projects.map((p) => ({
        ...p,
        isBookmarked: bookmarkedProjectIds.includes(p.id),
      }));
    },
    staleTime: 30 * 1000,
  });
}

export function useIndustryProject(id: string) {
  const { bookmarkedProjectIds } = useIndustryStore();
  return useQuery({
    queryKey: ["industry-project", id, bookmarkedProjectIds],
    queryFn: async () => {
      const project = await industryApi.getProjectById(id);
      return {
        ...project,
        isBookmarked: bookmarkedProjectIds.includes(project.id),
      };
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useFundingOpportunities() {
  return useQuery({
    queryKey: ["industry-funding-opportunities"],
    queryFn: () => industryApi.getFundingOpportunities(),
    staleTime: 30 * 1000,
  });
}

export function useFundReleaseHistory() {
  return useQuery({
    queryKey: ["industry-funding-releases"],
    queryFn: () => industryApi.getFundReleaseHistory(),
    staleTime: 30 * 1000,
  });
}

export function useMentorshipEngagements() {
  return useQuery({
    queryKey: ["industry-mentorship-engagements"],
    queryFn: () => industryApi.getMentorshipEngagements(),
    staleTime: 30 * 1000,
  });
}

export function useScheduledMeetings() {
  return useQuery({
    queryKey: ["industry-mentorship-meetings"],
    queryFn: () => industryApi.getScheduledMeetings(),
    staleTime: 30 * 1000,
  });
}

export function useMentorshipTasks() {
  return useQuery({
    queryKey: ["industry-mentorship-tasks"],
    queryFn: () => industryApi.getMentorshipTasks(),
    staleTime: 30 * 1000,
  });
}

export function useUniversityPartners() {
  return useQuery({
    queryKey: ["industry-universities"],
    queryFn: () => industryApi.getUniversities(),
    staleTime: 60 * 1000,
  });
}

export function useResearchCollaborations() {
  return useQuery({
    queryKey: ["industry-research-collaborations"],
    queryFn: () => industryApi.getResearchCollaborations(),
    staleTime: 60 * 1000,
  });
}

export function usePrototypeSubmissions() {
  return useQuery({
    queryKey: ["industry-prototypes"],
    queryFn: () => industryApi.getPrototypes(),
    staleTime: 30 * 1000,
  });
}

export function useImplementationTracker() {
  return useQuery({
    queryKey: ["industry-implementation-tracker"],
    queryFn: () => industryApi.getImplementationTracker(),
    staleTime: 30 * 1000,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["industry-conversations"],
    queryFn: () => industryApi.getConversations(),
    staleTime: 10 * 1000,
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ["industry-messages", conversationId],
    queryFn: () => industryApi.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 5 * 1000,
  });
}

export function useIndustryAnalytics() {
  return useQuery({
    queryKey: ["industry-analytics"],
    queryFn: () => industryApi.getAnalyticsData(),
    staleTime: 60 * 1000,
  });
}

export function useNotifications() {
  const { notifications } = useIndustryStore();
  return useQuery({
    queryKey: ["industry-notifications"],
    queryFn: () => industryApi.getNotifications(),
    initialData: notifications,
    staleTime: 30 * 1000,
  });
}

// Master Hook with Mutations
export function useIndustryQueries() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setOrganization, addNotification } = useIndustryStore();

  const loginMutation = useMutation({
    mutationFn: (data: IndustryLoginFormData) => industryApi.loginIndustry(data),
    onSuccess: (user) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_industry_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_industry_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      toast.success(`Welcome, ${user.name}! Accessing Industry Portal.`);
      router.push("/industry/dashboard");
    },
    onError: () => {
      toast.error("Failed to authenticate industry credentials.");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: OrganizationProfileFormData) => industryApi.updateOrganizationProfile(data),
    onSuccess: (updated) => {
      setOrganization(updated);
      queryClient.invalidateQueries({ queryKey: ["industry-organization-profile"] });
      toast.success("Organization profile updated successfully.");
    },
  });

  const sponsorProjectMutation = useMutation({
    mutationFn: (data: SponsorProjectFormData) => industryApi.sponsorProject(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-projects"] });
      queryClient.invalidateQueries({ queryKey: ["industry-stats"] });
      queryClient.invalidateQueries({ queryKey: ["industry-funding-opportunities"] });
      addNotification({
        title: "Project Sponsorship Executed",
        description: res.message,
        category: "funding",
        actionUrl: "/industry/funding",
        actionLabel: "View CSR Allocation",
      });
      toast.success(res.message);
    },
  });

  const releaseFundsMutation = useMutation({
    mutationFn: (data: ReleaseFundsFormData) => industryApi.releaseFunds(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-funding-releases"] });
      queryClient.invalidateQueries({ queryKey: ["industry-stats"] });
      addNotification({
        title: "Tranche Release Settled",
        description: `Reference: ${res.transactionId}`,
        category: "funding",
        actionUrl: "/industry/funding",
        actionLabel: "View Receipt",
      });
      toast.success(res.message);
    },
  });

  const scheduleMeetingMutation = useMutation({
    mutationFn: (data: ScheduleMeetingFormData) => industryApi.scheduleMeeting(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-mentorship-meetings"] });
      toast.success(res.message);
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: (data: AssignTaskFormData) => industryApi.assignTask(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-mentorship-tasks"] });
      toast.success(res.message);
    },
  });

  const rateTeamMutation = useMutation({
    mutationFn: (data: RateTeamFormData) => industryApi.rateTeam(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-mentorship-engagements"] });
      toast.success(res.message);
    },
  });

  const connectUniversityMutation = useMutation({
    mutationFn: (univId: string) => industryApi.connectUniversity(univId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-universities"] });
      toast.success(res.message);
    },
  });

  const reviewPrototypeMutation = useMutation({
    mutationFn: (data: PrototypeReviewFormData) => industryApi.reviewPrototype(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["industry-prototypes"] });
      queryClient.invalidateQueries({ queryKey: ["industry-stats"] });
      toast.success(res.message);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      industryApi.sendMessage(conversationId, content),
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["industry-messages", msg.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["industry-conversations"] });
    },
  });

  return {
    loginMutation,
    updateProfileMutation,
    sponsorProjectMutation,
    releaseFundsMutation,
    scheduleMeetingMutation,
    assignTaskMutation,
    rateTeamMutation,
    connectUniversityMutation,
    reviewPrototypeMutation,
    sendMessageMutation,
  };
}
