"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GovernmentOfficer } from "../types";
import { INITIAL_OFFICERS } from "../services/government-api";

interface GovernmentState {
  officer: GovernmentOfficer | null;
  token: string | null;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  notificationsCount: number;

  // Actions
  login: (officer: GovernmentOfficer, token: string) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateOfficerProfile: (updates: Partial<GovernmentOfficer>) => void;
  decrementNotifications: () => void;
}

export const useGovernmentStore = create<GovernmentState>()(
  persist(
    (set, get) => ({
      // Seed default active officer for frictionless initial view
      officer: INITIAL_OFFICERS[0],
      token: "gov-jwt-collector-init",
      isAuthenticated: true,
      isSidebarCollapsed: false,
      notificationsCount: 4,

      login: (officer, token) => {
        if (typeof document !== "undefined") {
          document.cookie = `social_x_government_role=government; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `social_x_government_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({
          officer,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "social_x_government_role=; path=/; max-age=0; SameSite=Lax";
          document.cookie = "social_x_government_token=; path=/; max-age=0; SameSite=Lax";
        }
        set({
          officer: null,
          token: null,
          isAuthenticated: false,
        });
      },

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),

      updateOfficerProfile: (updates) =>
        set((state) => ({
          officer: state.officer ? { ...state.officer, ...updates } : null,
        })),

      decrementNotifications: () =>
        set((state) => ({
          notificationsCount: Math.max(0, state.notificationsCount - 1),
        })),
    }),
    {
      name: "social_x_government_store_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
