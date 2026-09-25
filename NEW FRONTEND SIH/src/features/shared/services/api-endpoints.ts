/**
 * SOCIAL-X Civic Operating System
 * Centralized API Endpoints Registry across all 4 Microservices
 */

// Backend Base URLs
export const BACKEND_URLS = {
  CORE: process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:8001/api/v1",
  SOCIAL_X: process.env.NEXT_PUBLIC_SOCIALX_API_URL || "http://localhost:8002/api",
  AI_SERVICE: process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8002/api/v1",
  ROUTING: process.env.NEXT_PUBLIC_ROUTING_API_URL || "http://localhost:8003/api/v1",
  ANALYTICS: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "http://localhost:8004",
  ANALYTICS_WS: process.env.NEXT_PUBLIC_ANALYTICS_WS_URL || "ws://localhost:8004/live",
} as const;

export const API_ENDPOINTS = {
  // ---------------------------------------------------------------------------
  // BACKEND 1: Core Service (Auth, Users, Issues) -> Port 8001
  // ---------------------------------------------------------------------------
  CORE: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh-token",
      ME: "/auth/me",
    },
    USERS: {
      BASE: "/users",
      BY_ID: (id: string) => `/users/${id}`,
      PROFILE: "/users/profile",
    },
    ISSUES: {
      BASE: "/issues",
      BY_ID: (id: string) => `/issues/${id}`,
      STATUS: (id: string) => `/issues/${id}/status`,
    },
  },

  // ---------------------------------------------------------------------------
  // BACKEND 2: Social-X Gateway & AI Service -> Port 8002
  // ---------------------------------------------------------------------------
  SOCIAL_X: {
    AUTH: {
      CITIZEN_LOGIN: "/auth/citizen/login",
      CITIZEN_REGISTER: "/auth/citizen/register",
      OFFICIAL_LOGIN: "/auth/official/login",
      ADMIN_LOGIN: "/auth/admin/login",
      VERIFY_TOKEN: "/auth/verify",
    },
    PROBLEMS: {
      BASE: "/problems",
      CREATE: "/problems/report",
      BY_ID: (id: string) => `/problems/${id}`,
      NEARBY: "/problems/nearby",
    },
    DASHBOARDS: {
      CITIZEN: "/dashboards/citizen",
      GOVERNMENT: "/dashboards/government",
      ADMIN: "/dashboards/admin",
    },
    AI: {
      OCR: "/ocr/extract",
      SPEECH_TO_TEXT: "/speech/transcribe",
    },
  },

  // ---------------------------------------------------------------------------
  // BACKEND 3: Routing & Workflow Engine -> Port 8003
  // ---------------------------------------------------------------------------
  ROUTING: {
    DEPARTMENTS: {
      BASE: "/departments",
      DISTRICTS: "/departments/districts",
      OFFICERS: "/departments/officers",
    },
    ROUTING_ENGINE: {
      EVALUATE: "/routing/evaluate",
      SUGGEST_DEPARTMENT: "/routing/suggest-department",
    },
    WORKFLOW: {
      TRANSITION: (issueId: string) => `/workflow/${issueId}/transition`,
      TIMELINE: (issueId: string) => `/workflow/${issueId}/timeline`,
      STATE: (issueId: string) => `/workflow/${issueId}/state`,
    },
    ASSIGNMENT: {
      ALLOCATE_OFFICER: "/assignment/allocate",
      REASSIGN: "/assignment/reassign",
      OFFICER_WORKLOAD: (officerId: string) => `/assignment/officer/${officerId}/workload`,
    },
    RECOMMENDATIONS: {
      UNIVERSITIES: (issueId: string) => `/recommendations/universities/${issueId}`,
      INDUSTRY_CSR: (issueId: string) => `/recommendations/industry-csr/${issueId}`,
      VOLUNTEERS: (issueId: string) => `/recommendations/volunteers/${issueId}`,
    },
    COLLABORATIONS: {
      INITIATE: "/collaborations/initiate",
      ACTIVE: "/collaborations/active",
      BY_ISSUE: (issueId: string) => `/collaborations/issue/${issueId}`,
    },
    ESCALATIONS: {
      ACTIVE_BREACHES: "/escalations/active-breaches",
      TRIGGER: "/escalations/trigger",
      SLA_STATUS: (issueId: string) => `/escalations/sla-status/${issueId}`,
    },
  },

  // ---------------------------------------------------------------------------
  // BACKEND 4: Analytics & Notification Service -> Port 8004
  // ---------------------------------------------------------------------------
  ANALYTICS: {
    DASHBOARDS: {
      ADMIN: "/dashboard/admin",
      GOV: "/dashboard/gov",
      UNIVERSITY: "/dashboard/university",
      INDUSTRY: "/dashboard/industry",
      CITIZEN: "/dashboard/citizen",
    },
    METRICS: {
      BASE: "/analytics",
      DISTRICT_HEALTH: "/analytics/district-health",
      SLA_ADHERENCE: "/analytics/sla-adherence",
    },
    REPORTS: {
      BASE: "/reports",
      EXPORT_CSV: "/reports?format=CSV",
      EXPORT_JSON: "/reports?format=JSON",
    },
    NOTIFY: {
      EMAIL: "/notify/email",
      SYSTEM: "/notify/system",
    },
    LIVE_STREAM: "/live",
  },
} as const;
