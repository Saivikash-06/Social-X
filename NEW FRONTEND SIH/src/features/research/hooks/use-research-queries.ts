"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { researchApi } from "../services/research-api";
import { useResearchStore } from "./use-research-store";
import {
  ResearchLoginFormData,
  UploadPublicationFormData,
  SubmitInnovationIdeaFormData,
  SubmitFindingsFormData,
  ResearchProfileFormData,
} from "../validation/research-schemas";

export function useResearchStats() {
  return useQuery({
    queryKey: ["research-stats"],
    queryFn: () => researchApi.getDashboardStats(),
    staleTime: 30 * 1000,
  });
}

export function useResearchInstitute() {
  const { institute, setInstitute } = useResearchStore();
  return useQuery({
    queryKey: ["research-institute"],
    queryFn: async () => {
      const data = await researchApi.getInstituteProfile();
      setInstitute(data);
      return data;
    },
    initialData: institute,
    staleTime: 60 * 1000,
  });
}

export function useResearchProjects() {
  const { bookmarkedProjectIds } = useResearchStore();
  return useQuery({
    queryKey: ["research-projects", bookmarkedProjectIds],
    queryFn: () => researchApi.getResearchProjects(),
    staleTime: 30 * 1000,
  });
}

export function useInnovationIdeas() {
  return useQuery({
    queryKey: ["research-innovation-ideas"],
    queryFn: () => researchApi.getInnovationIdeas(),
    staleTime: 30 * 1000,
  });
}

export function usePublications(params?: { type?: string; search?: string }) {
  return useQuery({
    queryKey: ["research-publications", params],
    queryFn: () => researchApi.getPublications(params),
    staleTime: 30 * 1000,
  });
}

export function useDatasets(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["research-datasets", params],
    queryFn: () => researchApi.getDatasets(params),
    staleTime: 60 * 1000,
  });
}

export function useGovtRequests() {
  return useQuery({
    queryKey: ["research-govt-requests"],
    queryFn: () => researchApi.getGovernmentRequests(),
    staleTime: 30 * 1000,
  });
}

export function useAcademicPartnerships() {
  return useQuery({
    queryKey: ["research-partnerships"],
    queryFn: () => researchApi.getAcademicPartnerships(),
    staleTime: 60 * 1000,
  });
}

export function useResearchReports() {
  return useQuery({
    queryKey: ["research-reports"],
    queryFn: () => researchApi.getReports(),
    staleTime: 60 * 1000,
  });
}

export function useResearchQueries() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setInstitute, addNotification } = useResearchStore();

  const loginMutation = useMutation({
    mutationFn: (data: ResearchLoginFormData) => researchApi.loginResearch(data),
    onSuccess: (user) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_research_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_research_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      toast.success(`Welcome, ${user.name}! Accessing Research Organization Portal.`);
      router.push("/research/dashboard");
    },
    onError: () => {
      toast.error("Failed to authenticate research credentials.");
    },
  });

  const loginGoogleMutation = useMutation({
    mutationFn: () => researchApi.loginGoogleResearch(),
    onSuccess: (user) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_research_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_research_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      toast.success(`Welcome, ${user.name}! Accessing Research Portal via Google.`);
      router.push("/research/dashboard");
    },
    onError: () => {
      toast.error("Google authentication failed.");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ResearchProfileFormData) => researchApi.updateInstituteProfile(data),
    onSuccess: (updated) => {
      setInstitute(updated);
      queryClient.invalidateQueries({ queryKey: ["research-institute"] });
      toast.success("Institute credentials updated successfully.");
    },
  });

  const joinProjectMutation = useMutation({
    mutationFn: (projectId: string) => researchApi.joinResearchProject(projectId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["research-projects"] });
      toast.success(res.message);
    },
  });

  const submitFindingsMutation = useMutation({
    mutationFn: (data: SubmitFindingsFormData) => researchApi.submitFindings(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["research-projects"] });
      queryClient.invalidateQueries({ queryKey: ["research-stats"] });
      addNotification({
        title: "Research Findings Transmitted",
        description: res.message,
        category: "publication",
        actionUrl: "/research/projects",
        actionLabel: "View Submissions",
      });
      toast.success(res.message);
    },
  });

  const submitInnovationIdeaMutation = useMutation({
    mutationFn: (data: SubmitInnovationIdeaFormData) => researchApi.submitInnovationIdea(data),
    onSuccess: (idea) => {
      queryClient.invalidateQueries({ queryKey: ["research-innovation-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["research-stats"] });
      addNotification({
        title: "Innovation Idea Published",
        description: `"${idea.title}" listed under ${idea.trlStageName}.`,
        category: "collaboration",
        actionUrl: "/research/innovation",
        actionLabel: "Open Idea",
      });
      toast.success("Innovation idea published to open laboratory!");
    },
  });

  const voteInnovationIdeaMutation = useMutation({
    mutationFn: (ideaId: string) => researchApi.voteInnovationIdea(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-innovation-ideas"] });
      toast.success("Vote recorded successfully!");
    },
  });

  const uploadPublicationMutation = useMutation({
    mutationFn: (data: UploadPublicationFormData) => researchApi.uploadPublication(data),
    onSuccess: (pub) => {
      queryClient.invalidateQueries({ queryKey: ["research-publications"] });
      queryClient.invalidateQueries({ queryKey: ["research-stats"] });
      addNotification({
        title: "Publication Indexed",
        description: `"${pub.title}" cataloged in research repository.`,
        category: "publication",
        actionUrl: "/research/publications",
        actionLabel: "View Document",
      });
      toast.success("Publication uploaded and cataloged!");
    },
  });

  return {
    loginMutation,
    loginGoogleMutation,
    updateProfileMutation,
    joinProjectMutation,
    submitFindingsMutation,
    submitInnovationIdeaMutation,
    voteInnovationIdeaMutation,
    uploadPublicationMutation,
  };
}
