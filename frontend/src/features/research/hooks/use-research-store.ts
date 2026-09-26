import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ResearchUser, ResearchInstitute, ResearchNotification } from "../types";
import { MOCK_RESEARCH_USER, MOCK_RESEARCH_INSTITUTE, MOCK_RESEARCH_NOTIFICATIONS } from "../services/research-api";

interface ResearchStoreState {
  user: ResearchUser | null;
  institute: ResearchInstitute;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
  bookmarkedProjectIds: string[];
  notifications: ResearchNotification[];
  unreadNotificationsCount: number;

  // Actions
  setUser: (user: ResearchUser) => void;
  setInstitute: (institute: ResearchInstitute) => void;
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
  addNotification: (notification: Omit<ResearchNotification, "id" | "timestamp" | "read">) => void;
  logout: () => void;
}

export const useResearchStore = create<ResearchStoreState>()(
  persist(
    (set) => ({
      user: MOCK_RESEARCH_USER,
      institute: MOCK_RESEARCH_INSTITUTE,
      isAuthenticated: true,
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isNotificationDrawerOpen: false,
      isSearchModalOpen: false,
      searchQuery: "",
      bookmarkedProjectIds: ["RES-PROJ-01"],
      notifications: MOCK_RESEARCH_NOTIFICATIONS,
      unreadNotificationsCount: 2,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setInstitute: (institute) => set({ institute }),

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

      setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),

      toggleNotificationDrawer: () =>
        set((state) => ({
          isNotificationDrawerOpen: !state.isNotificationDrawerOpen,
        })),

      setNotificationDrawerOpen: (isNotificationDrawerOpen) =>
        set({ isNotificationDrawerOpen }),

      setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      toggleBookmark: (projectId) =>
        set((state) => {
          const exists = state.bookmarkedProjectIds.includes(projectId);
          const next = exists
            ? state.bookmarkedProjectIds.filter((id) => id !== projectId)
            : [...state.bookmarkedProjectIds, projectId];
          return { bookmarkedProjectIds: next };
        }),

      markNotificationAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadNotificationsCount: unread };
        }),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadNotificationsCount: 0,
        })),

      addNotification: (notif) =>
        set((state) => {
          const newNotification: ResearchNotification = {
            id: `rnotif-${Date.now()}`,
            timestamp: "Just now",
            read: false,
            ...notif,
          };
          const updated = [newNotification, ...state.notifications];
          return {
            notifications: updated,
            unreadNotificationsCount: state.unreadNotificationsCount + 1,
          };
        }),

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "social_x_research_role=; path=/; max-age=0";
          document.cookie = "social_x_research_token=; path=/; max-age=0";
        }
        set({
          user: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login/research";
        }
      },
    }),
    {
      name: "social_x_research_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        institute: state.institute,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
        bookmarkedProjectIds: state.bookmarkedProjectIds,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount,
      }),
    }
  )
);
