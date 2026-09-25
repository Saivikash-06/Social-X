import { create } from "zustand";

interface CitizenStoreState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationDrawerOpen: boolean;
  issueSearchQuery: string;
  issueFilterStatus: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  setIssueSearchQuery: (query: string) => void;
  setIssueFilterStatus: (status: string) => void;
}

export const useCitizenStore = create<CitizenStoreState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isNotificationDrawerOpen: false,
  issueSearchQuery: "",
  issueFilterStatus: "all",

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

  toggleNotificationDrawer: () =>
    set((state) => ({
      isNotificationDrawerOpen: !state.isNotificationDrawerOpen,
    })),

  setNotificationDrawerOpen: (open) =>
    set({ isNotificationDrawerOpen: open }),

  setIssueSearchQuery: (query) => set({ issueSearchQuery: query }),

  setIssueFilterStatus: (status) => set({ issueFilterStatus: status }),
}));
