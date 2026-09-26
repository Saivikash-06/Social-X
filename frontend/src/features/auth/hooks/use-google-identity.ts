"use client";

import * as React from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

interface UseGoogleIdentityOptions {
  onSuccess: (authData: { accessToken?: string; credential?: string; email?: string }) => void;
  onError?: (error: string) => void;
}

export function useGoogleIdentity({ onSuccess, onError }: UseGoogleIdentityOptions) {
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || "";
  const isConfigured = Boolean(clientId && clientId !== "your-google-client-id-here");

  React.useEffect(() => {
    // If script is already in document
    if (typeof window !== "undefined" && window.google?.accounts?.oauth2) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.warn("Failed to load Google Identity Services SDK script.");
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to keep cache
    };
  }, []);

  const triggerGoogleSignIn = React.useCallback(() => {
    if (!isConfigured) {
      return false; // Tells caller to open fallback modal
    }

    if (typeof window === "undefined" || !window.google?.accounts?.oauth2) {
      onError?.("Google Sign-In is still initializing. Please try again in a moment.");
      return false;
    }

    try {
      setIsInitializing(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: (resp) => {
          setIsInitializing(false);
          if (resp.error) {
            onError?.(resp.error_description || resp.error);
            return;
          }
          if (resp.access_token) {
            onSuccess({ accessToken: resp.access_token });
          }
        },
      });

      tokenClient.requestAccessToken();
      return true;
    } catch (err: any) {
      setIsInitializing(false);
      onError?.(err?.message || "Failed to trigger Google Sign-In popup.");
      return false;
    }
  }, [clientId, isConfigured, onError, onSuccess]);

  return {
    isConfigured,
    isScriptLoaded,
    isInitializing,
    triggerGoogleSignIn,
    clientId,
  };
}
