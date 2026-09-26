import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, AuthTokens, User } from "../types";

interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, tokens) => {
        if (user?.preferredLanguage) {
          try {
            import("@/i18n/config").then(({ changeAppLanguage }) => {
              changeAppLanguage(user.preferredLanguage!);
            });
          } catch {
            // Ignore in SSR
          }
        }
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setTokens: (tokens) =>
        set((state) => ({
          ...state,
          tokens,
        })),

      updateUser: (partialUser) =>
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("social_x_access_token");
          localStorage.removeItem("social_x_refresh_token");
        }
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "social_x_auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
