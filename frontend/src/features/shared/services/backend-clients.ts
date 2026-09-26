/**
 * SOCIAL-X Civic Operating System
 * Dedicated Typed Axios Clients for all 4 Backend Microservices
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { useLanguageStore } from "@/features/shared/i18n/use-language-store";
import { BACKEND_URLS } from "./api-endpoints";

import { handleApiError, redirectToAppropriateLogin } from "./error-handler";

/**
 * Factory to construct interceptor-configured Axios instances
 */
function createServiceClient(baseURL: string, timeout = 25000): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor: attach bearer token and current locale
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      try {
        const tokens = useAuthStore.getState?.()?.tokens;
        const token = tokens?.accessToken;
        const locale = useLanguageStore.getState?.()?.locale || "en";

        if (config.headers) {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          config.headers["Accept-Language"] = locale;
          config.headers["X-Language"] = locale;
        }
      } catch {
        // Safe execution in SSR or non-browser environments
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: auto-retry network failures and sanitize errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retryCount?: number;
      };

      if (!originalRequest) {
        return Promise.reject(handleApiError(error, { showToast: false }));
      }

      // 401 Unauthorized -> Redirect to Portal Login
      if (error.response?.status === 401) {
        redirectToAppropriateLogin();
      }

      // Retry Logic for Network Glitches, Timeout, or 502/503/504 Service Unavailable (up to 3 retries)
      const isRetryable =
        !error.response ||
        error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        (error.response.status >= 502 && error.response.status <= 504);

      if (isRetryable && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        const delay = Math.pow(2, originalRequest._retryCount) * 400;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return instance(originalRequest);
      }

      // Return structured, sanitized ApiError without throwing generic popups
      const apiErr = handleApiError(error, { showToast: false });
      return Promise.reject(apiErr);
    }
  );

  return instance;
}

// -----------------------------------------------------------------------------
// Microservice Clients
// -----------------------------------------------------------------------------

/** Backend 1: Core Service Client (Auth, Users, Issues) - Port 8001 */
export const coreClient = createServiceClient(BACKEND_URLS.CORE);

/** Backend 2: Social-X Core Gateway (Problems, Dashboards) - Port 8002 */
export const socialxClient = createServiceClient(BACKEND_URLS.SOCIAL_X);

/** Backend 2: AI Microservice Client (OCR, Speech-to-Text) - Port 8002 */
export const aiClient = createServiceClient(BACKEND_URLS.AI_SERVICE, 60000); // Higher timeout for AI processing

/** Backend 3: Routing & Governance Workflow Engine - Port 8003 */
export const routingClient = createServiceClient(BACKEND_URLS.ROUTING);

/** Backend 4: Central Analytics & Notification Service - Port 8004 */
export const analyticsClient = createServiceClient(BACKEND_URLS.ANALYTICS);

export const backendClients = {
  core: coreClient,
  socialx: socialxClient,
  ai: aiClient,
  routing: routingClient,
  analytics: analyticsClient,
} as const;
