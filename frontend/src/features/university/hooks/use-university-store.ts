import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UniversityRole, UniversityUser, StudentTeamMember } from "../types";

export type UniversityNotificationType =
  | "government_assignment"
  | "faculty_approval"
  | "project_accepted"
  | "deadline_reminder"
  | "research_review"
  | "certificate_issued"
  | "credit_updated"
  | "milestone_completed"
  | "proposal_adopted"
  | "review_request"
  | "system";

export interface UniversityNotification {
  id: string;
  title: string;
  message: string;
  type: UniversityNotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
  badge?: string;
}

export const DEFAULT_FACULTY_USER: UniversityUser = {
  id: "fac_iisc_101",
  fullName: "Dr. Elena Rostova",
  name: "Dr. Elena Rostova",
  email: "elena.rostova@stanford.edu",
  role: "faculty",
  universityName: "Stanford University",
  institution: "Stanford University",
  department: "Civil & Environmental Engineering",
  specialization: "Smart Water Networks & Microgrid Telemetry",
  designation: "Professor & Principal Investigator",
  employeeIdOrRollNumber: "STAN-FAC-4481",
  rollNumber: "STAN-FAC-4481",
  phone: "+1 (650) 723-2300",
};

export const DEFAULT_STUDENT_USER: UniversityUser = {
  id: "usr-student-01",
  fullName: "Alex Rivera",
  name: "Alex Rivera",
  email: "alex.rivera@stanford.edu",
  role: "student",
  universityName: "Stanford University",
  institution: "Stanford University",
  department: "Department of Computer Science",
  specialization: "Embedded Systems & IoT Edge AI",
  designation: "Graduate Research Scholar",
  employeeIdOrRollNumber: "CS-2024-8902",
  rollNumber: "CS-2024-8902",
  phone: "+1 (650) 498-1002",
};

export const DEFAULT_STUDENTS: StudentTeamMember[] = [
  {
    id: "usr-student-01",
    name: "Alex Rivera",
    email: "alex.rivera@stanford.edu",
    roleInProject: "Lead Firmware Engineer",
    yearOrProgram: "M.S. Year 2",
    rollNumber: "CS-2024-8902",
    department: "Computer Science",
    institution: "Stanford University",
  },
  {
    id: "usr-student-02",
    name: "Maya Chen",
    email: "maya.chen@stanford.edu",
    roleInProject: "Hydrological Computational Modeling",
    yearOrProgram: "Ph.D. Year 1",
    rollNumber: "ENV-2024-1104",
    department: "Civil & Environmental Engineering",
    institution: "Stanford University",
  },
  {
    id: "usr-student-03",
    name: "David Kim",
    email: "david.kim@stanford.edu",
    roleInProject: "Battery Energy Storage Analyst",
    yearOrProgram: "B.S. Senior Year",
    rollNumber: "EE-2024-5520",
    department: "Electrical Engineering",
    institution: "Stanford University",
  },
  {
    id: "usr-student-04",
    name: "Sarah Al-Hassan",
    email: "sarah.h@stanford.edu",
    roleInProject: "Acoustic Signal Processing Specialist",
    yearOrProgram: "M.S. Year 1",
    rollNumber: "CS-2025-3390",
    department: "Computer Science",
    institution: "Stanford University",
  },
];

const DEFAULT_NOTIFICATIONS: UniversityNotification[] = [
  {
    id: "notif-01",
    title: "Government Assignment Dispatched",
    message: "BBMP Municipal Works tagged your lab for 'Real-Time Stormwater Level Inundation Telemetry'.",
    type: "government_assignment",
    read: false,
    createdAt: "10 mins ago",
    link: "/university/projects/PRJ-2026-003",
    badge: "Government",
  },
  {
    id: "notif-02",
    title: "Faculty Approval Granted",
    message: "Dr. Elena Rostova officially approved Phase II acoustic sensor calibration benchmarks.",
    type: "faculty_approval",
    read: false,
    createdAt: "45 mins ago",
    link: "/university/projects/PRJ-2026-001",
    badge: "Approval",
  },
  {
    id: "notif-03",
    title: "Civic Project Accepted",
    message: "Your team proposal for 'Pothole Depth CV Detection' has been accepted by Karnataka PWD.",
    type: "project_accepted",
    read: false,
    createdAt: "2 hours ago",
    link: "/university/projects/PRJ-2026-002",
    badge: "Accepted",
  },
  {
    id: "notif-04",
    title: "Critical Deadline Reminder",
    message: "Final lab synthesis and sensor prototype data package due within 48 hours for Ward 142 pilot.",
    type: "deadline_reminder",
    read: false,
    createdAt: "3 hours ago",
    link: "/university/projects/PRJ-2026-001",
    badge: "Urgent",
  },
  {
    id: "notif-05",
    title: "Research Review Pending",
    message: "Peer review received for 'Micro-Leak Localization in Ductile Iron Water Networks'.",
    type: "research_review",
    read: true,
    createdAt: "Yesterday",
    link: "/university/research",
    badge: "Research",
  },
  {
    id: "notif-06",
    title: "Certificate Issued",
    message: "Smart Governance Champion certificate officially minted and awarded for civic impact.",
    type: "certificate_issued",
    read: true,
    createdAt: "2 days ago",
    link: "/university/credits",
    badge: "Certificate",
  },
  {
    id: "notif-07",
    title: "Credit Score Updated",
    message: "+2 Academic Credits and +150 Community Impact points credited to your transcript.",
    type: "credit_updated",
    read: true,
    createdAt: "3 days ago",
    link: "/university/credits",
    badge: "Credits",
  },
];

interface UniversityState {
  user: UniversityUser | null;
  currentUser: UniversityUser | null;
  role: UniversityRole;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationPanelOpen: boolean;
  projectSearchQuery: string;
  projectFilterStatus: string;
  availableStudents: StudentTeamMember[];
  notifications: UniversityNotification[];
  unreadNotificationsCount: number;

  // Actions
  setUser: (user: UniversityUser) => void;
  setAuth: (user: UniversityUser) => void;
  setRole: (role: UniversityRole) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setProjectSearchQuery: (query: string) => void;
  setProjectFilterStatus: (status: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  logoutUniversity: () => void;
  logout: () => void;
}

export const useUniversityStore = create<UniversityState>()(
  persist(
    (set) => ({
      user: DEFAULT_FACULTY_USER,
      currentUser: DEFAULT_FACULTY_USER,
      role: "faculty",
      isAuthenticated: true,
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isNotificationPanelOpen: false,
      projectSearchQuery: "",
      projectFilterStatus: "all",
      availableStudents: DEFAULT_STUDENTS,
      notifications: DEFAULT_NOTIFICATIONS,
      unreadNotificationsCount: 2,

      setUser: (user) => {
        const fullUser = {
          ...user,
          name: user.fullName || user.name || "Academic User",
          institution: user.universityName || user.institution || "University",
          rollNumber: user.employeeIdOrRollNumber || user.rollNumber,
        };
        set({
          user: fullUser,
          currentUser: fullUser,
          role: user.role,
          isAuthenticated: true,
        });
      },

      setAuth: (user) => {
        const fullUser = {
          ...user,
          name: user.fullName || user.name || "Academic User",
          institution: user.universityName || user.institution || "University",
          rollNumber: user.employeeIdOrRollNumber || user.rollNumber,
        };
        set({
          user: fullUser,
          currentUser: fullUser,
        });
      },

      setRole: (role) =>
        set((state) => {
          const updatedUser =
            role === "student"
              ? DEFAULT_STUDENT_USER
              : DEFAULT_FACULTY_USER;
          return {
            role,
            user: updatedUser,
            currentUser: updatedUser,
          };
        }),

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

      setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

      toggleNotificationPanel: () =>
        set((state) => ({
          isNotificationPanelOpen: !state.isNotificationPanelOpen,
        })),

      setNotificationPanelOpen: (open) =>
        set({ isNotificationPanelOpen: open }),

      setProjectSearchQuery: (query) => set({ projectSearchQuery: query }),

      setProjectFilterStatus: (status) => set({ projectFilterStatus: status }),

      markNotificationAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadNotificationsCount: updated.filter((n) => !n.read).length,
          };
        }),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadNotificationsCount: 0,
        })),

      logoutUniversity: () =>
        set({
          user: null,
          currentUser: null,
          isAuthenticated: false,
        }),

      logout: () =>
        set({
          user: null,
          currentUser: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "social_x_university_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        currentUser: state.currentUser,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
