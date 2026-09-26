import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IndustryUser, IndustryRole, OrganizationProfile, IndustryNotification } from "../types";
import { MOCK_ORGANIZATION_PROFILE, MOCK_NOTIFICATIONS } from "../services/industry-api";

const DEFAULT_INDUSTRY_USER: IndustryUser = {
  id: "usr_tcs_01",
  name: "Dr. Rajeshwar Kulkarni",
  email: "rajeshwar.kulkarni@tata.com",
  role: "csr_org",
  roleLabel: "CSR Organization",
  organizationName: "Tata Social Innovation Foundation",
  designation: "Head of Social R&D Alliances",
  phone: "+91 98200 45891",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  verificationStatus: "verified",
};

interface IndustryStoreState {
  user: IndustryUser | null;
  organization: OrganizationProfile;
  role: IndustryRole;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
  bookmarkedProjectIds: string[];
  notifications: IndustryNotification[];
  unreadNotificationsCount: number;

  // Actions
  setUser: (user: IndustryUser) => void;
  setRole: (role: IndustryRole) => void;
  setOrganization: (org: OrganizationProfile) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  toggleBookmark: (projectId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<IndustryNotification, "id" | "timestamp" | "read">) => void;
  logout: () => void;
}

export const useIndustryStore = create<IndustryStoreState>()(
  persist(
    (set) => ({
      user: DEFAULT_INDUSTRY_USER,
      organization: MOCK_ORGANIZATION_PROFILE,
      role: "csr_org",
      isAuthenticated: true,
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isNotificationDrawerOpen: false,
      isSearchModalOpen: false,
      searchQuery: "",
      bookmarkedProjectIds: ["IND-PRJ-2026-01", "IND-PRJ-2026-03"],
      notifications: MOCK_NOTIFICATIONS,
      unreadNotificationsCount: 2,

      setUser: (user) =>
        set({
          user,
          role: user.role,
          isAuthenticated: true,
        }),

      setRole: (role) =>
        set((state) => {
          const roleLabels: Record<IndustryRole, string> = {
            csr_org: "CSR Organization",
            corporate: "Corporate Organization",
            msme: "MSME Partner",
            startup: "Startup Incubatee",
            innovation_partner: "Innovation Partner",
          };
          if (!state.user) return { role };
          return {
            role,
            user: {
              ...state.user,
              role,
              roleLabel: roleLabels[role],
            },
          };
        }),

      setOrganization: (org) => set({ organization: org }),

      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

      toggleNotificationDrawer: () => set((state) => ({ isNotificationDrawerOpen: !state.isNotificationDrawerOpen })),

      setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),

      setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleBookmark: (projectId) =>
        set((state) => {
          const exists = state.bookmarkedProjectIds.includes(projectId);
          return {
            bookmarkedProjectIds: exists
              ? state.bookmarkedProjectIds.filter((id) => id !== projectId)
              : [...state.bookmarkedProjectIds, projectId],
          };
        }),

      markNotificationAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
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

      addNotification: (item) =>
        set((state) => {
          const newNotif: IndustryNotification = {
            id: `notif-${Date.now()}`,
            timestamp: "Just now",
            read: false,
            ...item,
          };
          return {
            notifications: [newNotif, ...state.notifications],
            unreadNotificationsCount: state.unreadNotificationsCount + 1,
          };
        }),

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "social_x_industry_role=; path=/; max-age=0";
          document.cookie = "social_x_industry_token=; path=/; max-age=0";
        }
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "social_x_industry_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
        bookmarkedProjectIds: state.bookmarkedProjectIds,
      }),
    }
  )
);
