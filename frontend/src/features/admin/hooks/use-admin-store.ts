import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AdminUser, AdminNotification } from "../types";
import { MOCK_ADMIN_USER, MOCK_ADMIN_NOTIFICATIONS } from "../services/admin-api";

interface AdminStoreState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Actions
  setUser: (user: AdminUser) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AdminNotification, "id" | "timestamp" | "read">) => void;
  setMaintenanceMode: (enabled: boolean, message?: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      user: MOCK_ADMIN_USER,
      isAuthenticated: true,
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isNotificationDrawerOpen: false,
      isSearchModalOpen: false,
      searchQuery: "",
      notifications: MOCK_ADMIN_NOTIFICATIONS,
      unreadNotificationsCount: 3,
      maintenanceMode: false,
      maintenanceMessage: "Scheduled maintenance in progress. Services are operating in read-only diagnostic mode.",

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

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
          const newNotification: AdminNotification = {
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

      setMaintenanceMode: (enabled, message) =>
        set((state) => ({
          maintenanceMode: enabled,
          maintenanceMessage: message || state.maintenanceMessage,
        })),

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "social_x_admin_role=; path=/; max-age=0";
          document.cookie = "social_x_admin_token=; path=/; max-age=0";
        }
        set({
          user: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login/admin";
        }
      },
    }),
    {
      name: "social_x_admin_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount,
        maintenanceMode: state.maintenanceMode,
        maintenanceMessage: state.maintenanceMessage,
      }),
    }
  )
);
