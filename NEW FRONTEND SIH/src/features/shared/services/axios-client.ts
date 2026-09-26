import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { handleApiError } from "./error-handler";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

import { useLanguageStore } from "@/features/shared/i18n/use-language-store";

// Request Interceptor: Attach JWT Token & Accept-Language header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = useAuthStore.getState().tokens;
    const token = tokens?.accessToken;
    const locale = useLanguageStore.getState().locale || "en";

    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["Accept-Language"] = locale;
      config.headers["X-Language"] = locale;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh Token & Retry Logic
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 Unauthorized -> Attempt Token Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentTokens = useAuthStore.getState().tokens;
        if (!currentTokens?.refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: currentTokens.refreshToken,
        });

        const newTokens = refreshResponse.data?.data || refreshResponse.data;
        useAuthStore.getState().setTokens(newTokens);

        processQueue(null, newTokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Retry Logic for Network Glitches, Timeout, compilation 404s, or 502/503/504 Service Unavailable (up to 3 retries)
    const isCompilation404 =
      error.response?.status === 404 && (!originalRequest._retryCount || originalRequest._retryCount < 2);

    const isRetryable =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      (error.response.status >= 502 && error.response.status <= 504) ||
      isCompilation404;

    if (isRetryable && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = Math.pow(2, originalRequest._retryCount) * 350;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axiosClient(originalRequest);
    }

    // Central error handler: user-friendly and deduplicated
    const apiErr = handleApiError(error);
    return Promise.reject(apiErr);
  }
);
