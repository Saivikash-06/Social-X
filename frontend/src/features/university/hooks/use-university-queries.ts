"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { universityApi } from "../services/university-api";
import { researchApi } from "../services/research-api";
import { useUniversityStore } from "./use-university-store";
import { FacultyLoginFormData, StudentLoginFormData } from "../validation/university-schemas";
import { ResearchProject, ResearchTask, ResearchProposal, ResearchPaper } from "../types";

// Individual Standalone Hooks for direct usage
export function useFacultyDashboardStats() {
  return useQuery({
    queryKey: ["faculty-stats"],
    queryFn: async () => {
      const stats = await universityApi.getFacultyStats();
      return {
        ...stats,
        totalStudentsSupervised: stats.totalStudentsAssigned ?? 14,
        pendingProposalReviews: stats.pendingReviewsCount ?? 2,
        totalGrantFunding: 145000,
        averageMilestoneCompletionRate: 76,
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useStudentDashboardStats(studentId?: string) {
  return useQuery({
    queryKey: ["student-stats", studentId],
    queryFn: async () => {
      const stats = await universityApi.getStudentStats();
      return {
        ...stats,
        assignedProjects: stats.assignedProjectsCount ?? 2,
        pendingTasks: stats.pendingTasksCount ?? 3,
        submittedArtifacts: stats.completedMilestonesCount ?? 6,
        researchHoursLogged: 128,
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useFacultyProjects(params?: { status?: string; search?: string }) {
  return useQuery<ResearchProject[]>({
    queryKey: ["university-projects", params],
    queryFn: async () => {
      const projects = await universityApi.getProjects(params);
      return projects.map((p) => ({
        ...p,
        code: p.code || p.id,
        department: p.department || p.municipalDepartment || "Engineering",
        assignedStudentIds:
          p.assignedStudentIds || p.assignedStudents?.map((s) => s.id) || ["usr-student-01", "usr-student-02"],
        fundingAmount: p.fundingAmount || 45000,
      }));
    },
    staleTime: 30 * 1000,
  });
}

export const useUniversityProjects = useFacultyProjects;

export function useStudentProjects(studentId?: string) {
  return useQuery<ResearchProject[]>({
    queryKey: ["student-projects", studentId],
    queryFn: async () => {
      const projects = await universityApi.getProjects();
      return projects.map((p) => ({
        ...p,
        code: p.code || p.id,
        department: p.department || p.municipalDepartment || "Engineering",
        assignedStudentIds:
          p.assignedStudentIds || p.assignedStudents?.map((s) => s.id) || ["usr-student-01"],
        fundingAmount: p.fundingAmount || 45000,
      }));
    },
    staleTime: 30 * 1000,
  });
}

export function useProjectDetails(id: string) {
  return useQuery<ResearchProject>({
    queryKey: ["university-project", id],
    queryFn: async () => {
      const p = await universityApi.getProjectById(id);
      return {
        ...p,
        code: p.code || p.id,
        department: p.department || p.municipalDepartment || "Engineering",
        assignedStudentIds:
          p.assignedStudentIds || p.assignedStudents?.map((s) => s.id) || ["usr-student-01"],
        fundingAmount: p.fundingAmount || 45000,
      };
    },
    enabled: !!id,
  });
}

export function useStudentTasks(studentId?: string) {
  return useQuery<ResearchTask[]>({
    queryKey: ["student-tasks", studentId],
    queryFn: () => universityApi.getTasks(),
    staleTime: 20 * 1000,
  });
}

export function useProposals() {
  return useQuery<ResearchProposal[]>({
    queryKey: ["university-proposals"],
    queryFn: async () => {
      const list = await universityApi.getProposals();
      return list.map((item) => ({
        ...item,
        summary: item.summary || item.problemSummary || "",
        department: item.department || item.municipalDepartment || "Municipal Innovation",
        submittedBy: item.submittedBy || "City Department of Public Works",
        deadline: item.deadline || "2026-10-15",
        estimatedBudget: typeof item.estimatedBudget === "number" ? item.estimatedBudget : 35000,
      }));
    },
    staleTime: 30 * 1000,
  });
}

export function useResearchPapers(params?: { category?: string; search?: string }) {
  return useQuery<ResearchPaper[]>({
    queryKey: ["repository-papers", params],
    queryFn: async () => {
      const papers = await researchApi.getRepositoryPapers(params);
      return papers.map((p) => ({
        ...p,
        publicationYear: p.publicationYear || p.publishedYear,
        journalOrConference: p.journalOrConference || p.conferenceOrJournal,
        citationsCount: p.citationsCount || 34,
        keywords: p.keywords || ["microgrid", "iot", "urban", "clean energy"],
      }));
    },
    staleTime: 60 * 1000,
  });
}

export function useUniversityLogin() {
  const router = useRouter();
  const { setUser } = useUniversityStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      role = "faculty",
    }: {
      email: string;
      password?: string;
      role?: "faculty" | "student";
      rememberMe?: boolean;
    }) => {
      if (role === "faculty") {
        const user = await universityApi.loginFaculty({ email, password: password || "password" });
        return { user, role };
      } else {
        const user = await universityApi.loginStudent({ email, password: password || "password" });
        return { user, role };
      }
    },
    onSuccess: ({ user, role }) => {
      if (typeof document !== "undefined") {
        document.cookie = `social_x_university_role=${role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `social_x_university_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(user);
      if (role === "faculty") {
        router.push("/university/faculty");
      } else {
        router.push("/university/student");
      }

    },
  });
}

export function useAssignStudentsToProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      studentIds,
      role,
    }: {
      projectId: string;
      studentIds: string[];
      role: string;
    }) => {
      for (const sId of studentIds) {
        await universityApi.assignStudent(projectId, sId, role);
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-projects"] });
      queryClient.invalidateQueries({ queryKey: ["university-project"] });
    },
  });
}

export function useApproveMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      milestoneId,
      feedback,
    }: {
      projectId: string;
      milestoneId: string;
      feedback: string;
    }) => {
      return universityApi.approveProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-projects"] });
      queryClient.invalidateQueries({ queryKey: ["faculty-stats"] });
    },
  });
}

export function useUpdateTaskProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: "todo" | "in_progress" | "review" | "done" | "completed";
    }) => {
      const mapped = status === "completed" ? "done" : status === "review" ? "in_progress" : status;
      return universityApi.updateTaskStatus(taskId, mapped as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
    },
  });
}

export function useUniversityTeams() {
  return useQuery({
    queryKey: ["university-teams"],
    queryFn: () => universityApi.getTeams(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => universityApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-teams"] });
      toast.success("Student research team created successfully!");
    },
  });
}

export function useInnovationData() {
  return useQuery({
    queryKey: ["university-innovation"],
    queryFn: () => universityApi.getInnovationData(),
    staleTime: 30 * 1000,
  });
}

export function useUpvoteAIIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ideaId: string) => universityApi.upvoteAIIdea(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-innovation"] });
    },
  });
}

export function useSubmitAIIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idea: any) => universityApi.submitAIIdea(idea),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-innovation"] });
      toast.success("Civic AI Idea submitted to campus repository!");
    },
  });
}

export function useJoinProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, studentId }: { projectId: string; studentId: string }) =>
      universityApi.joinProject(projectId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-projects"] });
      queryClient.invalidateQueries({ queryKey: ["student-projects"] });
      toast.success("Request to join project submitted to faculty advisor!");
    },
  });
}

export function useMarkProjectCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => universityApi.markProjectCompleted(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-projects"] });
      queryClient.invalidateQueries({ queryKey: ["faculty-stats"] });
      toast.success("Project marked as completed and solution transmitted to municipal authority!");
    },
  });
}

export function useUploadProjectProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: { notes: string; progressPercentage: number; fileName?: string };
    }) => universityApi.uploadProjectProgress(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university-projects"] });
      queryClient.invalidateQueries({ queryKey: ["university-project"] });
      toast.success("Progress update uploaded to project timeline!");
    },
  });
}

// Grouped Hook Object
export function useUniversityQueries() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useUniversityStore();

  return {
    useFacultyStats: useFacultyDashboardStats,
    useStudentStats: useStudentDashboardStats,
    useProjects: useFacultyProjects,
    useProject: useProjectDetails,
    useTasks: useStudentTasks,
    useProposals,
    useRepositoryPapers: useResearchPapers,
    loginFacultyMutation: useMutation({
      mutationFn: (data: FacultyLoginFormData) => universityApi.loginFaculty(data),
      onSuccess: (user) => {
        if (typeof document !== "undefined") {
          document.cookie = `social_x_university_role=faculty; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `social_x_university_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
        }
        setUser(user);
        router.push("/university/faculty");
      },

    }),
    loginStudentMutation: useMutation({
      mutationFn: (data: StudentLoginFormData) => universityApi.loginStudent(data),
      onSuccess: (user) => {
        if (typeof document !== "undefined") {
          document.cookie = `social_x_university_role=student; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `social_x_university_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
        }
        setUser(user);
        router.push("/university/student");
      },

    }),
    loginGoogleMutation: useMutation({
      mutationFn: (role: "faculty" | "student") => universityApi.loginGoogleUniversity(role),
      onSuccess: (user) => {
        if (typeof document !== "undefined") {
          document.cookie = `social_x_university_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `social_x_university_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
        }
        setUser(user);
        if (user.role === "faculty") {
          router.push("/university/faculty");
        } else {
          router.push("/university/student");
        }
      },

    }),
    approveProjectMutation: useApproveMilestone(),
    rejectProjectMutation: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
        universityApi.rejectProject(id, reason),
    }),
    assignStudentMutation: useAssignStudentsToProject(),
    updateTaskStatusMutation: useUpdateTaskProgress(),
  };
}
