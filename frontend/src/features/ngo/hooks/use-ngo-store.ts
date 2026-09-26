import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NgoUser, NgoOrganization, NgoNotification } from "../types";
import { MOCK_NGO_USER, MOCK_NGO_ORG, MOCK_NOTIFICATIONS } from "../services/ngo-api";

interface NgoStoreState {
  user: NgoUser | null;
  organization: NgoOrganization;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
  bookmarkedProjectIds: string[];
  notifications: NgoNotification[];
  unreadNotificationsCount: number;

  // Actions
  setUser: (user: NgoUser) => void;
  setOrganization: (org: NgoOrganization) => void;
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
  addNotification: (notification: Omit<NgoNotification, "id" | "timestamp" | "read">) => void;
  logout: () => void;
}

export const useNgoStore = create<NgoStoreState>()(
  persist(
    (set) => ({
      user: MOCK_NGO_USER,
      organization: MOCK_NGO_ORG,
      isAuthenticated: true,
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isNotificationDrawerOpen: false,
      isSearchModalOpen: false,
      searchQuery: "",
      bookmarkedProjectIds: ["PROJ-NGO-2026-02"],
      notifications: MOCK_NOTIFICATIONS,
      unreadNotificationsCount: 2,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setOrganization: (organization) => set({ organization }),

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
          const newNotification: NgoNotification = {
            id: `notif-${Date.now()}`,
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
          document.cookie = "social_x_ngo_role=; path=/; max-age=0";
          document.cookie = "social_x_ngo_token=; path=/; max-age=0";
        }
        set({
          user: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login/ngo";
        }
      },
    }),
    {
      name: "social_x_ngo_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
        bookmarkedProjectIds: state.bookmarkedProjectIds,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount,
      }),
    }
  )
);
