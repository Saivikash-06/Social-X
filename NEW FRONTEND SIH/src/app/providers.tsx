"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { I18nProvider } from "@/features/shared/i18n/i18n-provider";
import { handleApiError } from "@/features/shared/services/error-handler";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Deduplicated global handling without duplicate toasts
            if (query.meta?.suppressGlobalToast !== true) {
              handleApiError(error, { showToast: true });
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.suppressGlobalToast !== true) {
              handleApiError(error, { showToast: true });
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Automatically retry temporary network failures (2–3 retries)
              if (failureCount >= 3) return false;
              const status = error?.statusCode || error?.response?.status;
              // Do not retry 4xx client errors
              if (status && status >= 400 && status < 500) return false;
              return true;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
          },
          mutations: {
            retry: (failureCount, error: any) => {
              if (failureCount >= 2) return false;
              const status = error?.statusCode || error?.response?.status;
              if (status && status >= 400 && status < 500) return false;
              return true;
            },
          },
        },
      })
  );

  // Catch unhandled promise rejections globally to prevent uncaught runtime overlay banners
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Social-X Global Handled Promise Rejection]:", event.reason);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <I18nextProvider i18n={i18n}>
          <I18nProvider>
            <GlobalErrorBoundary sectionName="Social-X Core App">
              {children}
            </GlobalErrorBoundary>
            <Toaster
              richColors
              closeButton
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: "border shadow-lg",
              }}
            />
          </I18nProvider>
        </I18nextProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
