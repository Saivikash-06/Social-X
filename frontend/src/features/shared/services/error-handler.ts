import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiErrorResponse } from "../types/common";

export interface ErrorDetails {
  title: string;
  message: string;
  statusCode: number;
  isNetworkError: boolean;
  technicalDetail?: string | Record<string, string[]>;
}

export class ApiError extends Error {
  statusCode: number;
  title: string;
  userMessage: string;
  detail?: string | Record<string, string[]>;
  isNetworkError: boolean;

  constructor(
    title: string,
    userMessage: string,
    statusCode = 500,
    detail?: string | Record<string, string[]>,
    isNetworkError = false
  ) {
    super(userMessage);
    this.name = "ApiError";
    this.title = title;
    this.userMessage = userMessage;
    this.statusCode = statusCode;
    this.detail = detail;
    this.isNetworkError = isNetworkError;
  }
}

// -----------------------------------------------------------------------------
// Toast Deduplication Cache (Prevents duplicate error popups within 3.5s)
// -----------------------------------------------------------------------------
const recentToasts = new Map<string, number>();
const TOAST_DEDUPE_MS = 3500;

function shouldShowToast(toastKey: string): boolean {
  const now = Date.now();
  const lastTime = recentToasts.get(toastKey);
  if (lastTime && now - lastTime < TOAST_DEDUPE_MS) {
    return false;
  }
  recentToasts.set(toastKey, now);

  // Clean old entries
  if (recentToasts.size > 50) {
    for (const [key, time] of recentToasts.entries()) {
      if (now - time > TOAST_DEDUPE_MS) {
        recentToasts.delete(key);
      }
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// Technical Error Sanitizer: Strips stack traces, DB errors, code paths
// -----------------------------------------------------------------------------
export function sanitizeErrorMessage(raw: string | undefined, statusCode = 500): string {
  if (!raw || typeof raw !== "string") {
    return "Service temporarily busy. The platform is automatically retrying.";
  }

  const lower = raw.toLowerCase().trim();

  // Strip generic unwanted strings
  if (
    lower.includes("a server error occurred") ||
    lower.includes("internal server error") ||
    lower.includes("500 internal") ||
    lower.includes("something went wrong")
  ) {
    return "Service temporarily busy. Please retry in a moment.";
  }

  // Strip technical traces / SQL / Python / Node stack patterns
  if (
    lower.includes("traceback") ||
    lower.includes("exception") ||
    lower.includes("sqlalchemy") ||
    lower.includes("psycopg") ||
    lower.includes("syntaxerror") ||
    lower.includes("nullpointer") ||
    lower.includes("at object.") ||
    lower.includes("select *") ||
    lower.includes("database error") ||
    lower.includes("relation does not exist") ||
    lower.includes("foreign key") ||
    lower.includes("violates")
  ) {
    return "The service encountered a temporary data synchronization delay. Please retry.";
  }

  // If already clean and user-friendly, return trimmed message
  if (raw.length > 180) {
    return raw.slice(0, 180) + "...";
  }

  return raw;
}

// -----------------------------------------------------------------------------
// Portal-Aware Login Redirect on 401 Unauthorized
// -----------------------------------------------------------------------------
export function redirectToAppropriateLogin() {
  if (typeof window === "undefined") return;

  const path = window.location.pathname.toLowerCase();
  let target = "/official-login";

  if (path.startsWith("/citizen")) {
    target = "/login/citizen";
  } else if (path.startsWith("/government")) {
    target = "/official-login";
  } else if (path.startsWith("/university") || path.startsWith("/research")) {
    target = "/university-login";
  } else if (path.startsWith("/industry")) {
    target = "/official-login";
  } else if (path.startsWith("/ngo")) {
    target = "/official-login";
  } else if (path.startsWith("/admin")) {
    target = "/official-login";
  }

  // Preserve redirect parameter
  const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
  const redirectUrl = `${target}?redirect=${currentUrl}&error=session_expired`;

  // Avoid redirect loops if already on a login page
  if (!path.includes("login")) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 400);
  }
}

// -----------------------------------------------------------------------------
// Global Error Handler for Axios & Microservice APIs
// -----------------------------------------------------------------------------
export function handleApiError(
  error: unknown,
  options: {
    showToast?: boolean;
    forceToastOn404?: boolean;
    portalContext?: string;
    customTitle?: string;
    customMessage?: string;
  } = { showToast: true }
): ApiError {
  let title = "Notice";
  let userMessage = "Unable to complete request. Please try again.";
  let statusCode = 500;
  let detail: string | Record<string, string[]> | undefined;
  let isNetworkError = false;

  // 1. Process Axios Errors
  if (error instanceof AxiosError) {
    statusCode = error.response?.status || 0;
    const responseData = error.response?.data as any;

    // Check raw error strings from backend response
    let rawBackendMsg: string | undefined;
    if (typeof responseData?.message === "string") {
      rawBackendMsg = responseData.message;
    } else if (typeof responseData?.error === "string") {
      rawBackendMsg = responseData.error;
    } else if (typeof responseData?.detail === "string") {
      rawBackendMsg = responseData.detail;
    } else if (Array.isArray(responseData?.detail) && responseData.detail.length > 0) {
      // FastAPI / Pydantic validation array
      const first = responseData.detail[0];
      rawBackendMsg = first?.msg || (typeof first === "string" ? first : undefined);
    }

    detail = responseData?.detail;

    // A) Network / Connectivity Failures
    if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      isNetworkError = true;
      statusCode = 0;
      title = "No Internet Connection";
      userMessage = "Unable to reach the network. Please check your internet connection.";
    }
    // B) Request Timeout
    else if (error.code === "ECONNABORTED" || error.message?.includes("timeout") || statusCode === 408) {
      title = "Request Timeout";
      userMessage = "The request took too long to complete. Please try again.";
    }
    // C) 401 Unauthorized / Session Expired
    else if (statusCode === 401) {
      title = "Session Expired";
      userMessage = "Session expired or unauthorized. Please log in to continue.";
      redirectToAppropriateLogin();
    }
    // D) 403 Forbidden / Access Denied
    else if (statusCode === 403) {
      title = "Access Denied";
      userMessage = rawBackendMsg
        ? sanitizeErrorMessage(rawBackendMsg, 403)
        : "You do not have permission to view this resource or perform this action.";
    }
    // E) 404 Not Found
    else if (statusCode === 404) {
      title = "Resource Not Found";
      userMessage = rawBackendMsg
        ? sanitizeErrorMessage(rawBackendMsg, 404)
        : "The requested resource could not be found.";
    }
    // F) 409 Conflict
    else if (statusCode === 409) {
      title = "Record Conflict";
      userMessage = rawBackendMsg
        ? sanitizeErrorMessage(rawBackendMsg, 409)
        : "This record already exists or conflicts with an ongoing operation.";
    }
    // G) 422 / 400 Validation Errors
    else if (statusCode === 400 || statusCode === 422) {
      title = "Validation Notice";
      userMessage = rawBackendMsg
        ? sanitizeErrorMessage(rawBackendMsg, statusCode)
        : "Please review the form fields and submit valid information.";
    }
    // H) 500-599 Server Errors (NEVER show generic "A server error occurred"!)
    else if (statusCode >= 500) {
      title = "Service Busy";
      // If the backend provided a sanitized business reason (e.g. "Quota exceeded"), use it; otherwise provide a helpful notice
      userMessage = rawBackendMsg && !rawBackendMsg.toLowerCase().includes("server error")
        ? sanitizeErrorMessage(rawBackendMsg, statusCode)
        : "The civic service is momentarily busy. Automatic retry is in progress.";
    }
    // I) Any other HTTP status
    else {
      title = "Notice";
      userMessage = sanitizeErrorMessage(rawBackendMsg || error.message, statusCode);
    }
  }
  // 2. Standard JS Error
  else if (error instanceof Error) {
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      isNetworkError = true;
      title = "No Internet Connection";
      userMessage = "Unable to connect to the server. Please verify your connection.";
    } else {
      title = "Notice";
      userMessage = sanitizeErrorMessage(error.message);
    }
  }

  // Override with custom messages if specified by caller
  if (options.customTitle) title = options.customTitle;
  if (options.customMessage) userMessage = options.customMessage;

  // Log detailed developer diagnostic to console without exposing raw stack trace to user
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Social-X Handled Error: ${title}]`, {
      statusCode,
      userMessage,
      originalError: error,
    });
  }

  // Show user-friendly Sonner Toast with strict deduplication
  // Do NOT show toasts for 404 (Resource Not Found) errors unless explicitly requested
  if (options.showToast !== false && typeof window !== "undefined") {
    if (statusCode === 404 && !options.forceToastOn404) {
      // Gracefully suppress intrusive 404 toasts during route compilation or initial load
      return new ApiError(title, userMessage, statusCode, detail, isNetworkError);
    }
    const toastKey = `${title}:${userMessage}`;
    if (shouldShowToast(toastKey)) {
      toast.error(title, {
        id: toastKey,
        description: userMessage,
        duration: 4000,
      });
    }
  }

  return new ApiError(title, userMessage, statusCode, detail, isNetworkError);
}
