import { Role } from "@/features/shared/types/common";

export type AdminRole = "super_admin" | "system_admin" | "platform_owner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleTitle: string;
  avatarUrl: string;
  phone?: string;
  clearanceLevel: "Level 1" | "Level 2" | "Level 3 - Root";
  twoFactorEnabled: boolean;
  lastLoginAt: string;
}

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  roleLabel: string;
  organization?: string;
  district: string;
  state: string;
  status: "active" | "suspended" | "pending_verification";
  avatarUrl?: string;
  createdAt: string;
  lastActive: string;
  verified: boolean;
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: "User & Access" | "Civic Issues" | "Department Workflows" | "Partnerships" | "Financial & CSR" | "System & AI";
}

export interface RoleDefinition {
  role: Role;
  title: string;
  description: string;
  userCount: number;
  badgeVariant: "default" | "secondary" | "success" | "warning" | "destructive" | "info";
  permissions: string[];
}

export interface StakeholderStats {
  total: number;
  verified: number;
  pending: number;
  activeProjects: number;
}

export interface AdminDepartment {
  id: string;
  code: string;
  name: string;
  headOfficerName: string;
  headOfficerEmail: string;
  headOfficerPhone: string;
  districtsCovered: number;
  activeOfficersCount: number;
  activeIssuesCount: number;
  slaComplianceRate: number;
  budgetAllocatedCr: number;
  budgetUtilizedCr: number;
  status: "active" | "under_review";
}

export interface AdminUniversity {
  id: string;
  name: string;
  code: string;
  location: string;
  state: string;
  tier: "IIT/NIT" | "Central University" | "State University" | "Private Accredited";
  naacGrade: string;
  facultyCount: number;
  studentCount: number;
  activeProjects: number;
  verificationStatus: "approved" | "pending" | "rejected";
  contactDean: string;
  contactEmail: string;
}

export interface AdminIndustry {
  id: string;
  companyName: string;
  cin: string;
  sector: string;
  headquarters: string;
  csrFundCommittedCr: number;
  csrFundDisbursedCr: number;
  sponsoredProjectsCount: number;
  verificationStatus: "verified" | "pending" | "flagged";
  csrLeadName: string;
  csrLeadEmail: string;
}

export interface AdminNgo {
  id: string;
  name: string;
  darpanId: string;
  registrationNumber: string;
  district: string;
  state: string;
  focusArea: string;
  volunteerRosterCount: number;
  adoptedProjectsCount: number;
  fcraStatus: "Compliant" | "Exempt" | "Pending";
  has12A80G: boolean;
  verificationStatus: "verified" | "pending" | "flagged";
  chiefFunctionary: string;
  contactEmail: string;
}

export interface AdminResearchOrg {
  id: string;
  institutionName: string;
  acronym: string;
  category: "National Laboratory" | "R&D Council" | "Autonomous Think-Tank";
  principalScientist: string;
  contactEmail: string;
  activeGrantsCount: number;
  patentsFiledCount: number;
  dataAccessTier: "Public Telemetry" | "Full Municipal GIS" | "Restricted Infrastructure";
  status: "active" | "suspended";
}

export interface AdminIssue {
  id: string;
  trackingNumber: string;
  title: string;
  category: string;
  departmentId: string;
  departmentName: string;
  citizenName: string;
  citizenPhone: string;
  location: string;
  district: string;
  state: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending Verification" | "Assigned" | "In Progress" | "Resolved" | "Escalated" | "Rejected" | "Archived";
  assignedStakeholder?: {
    type: "university" | "industry" | "ngo" | "department";
    name: string;
  };
  aiConfidenceScore: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  slaDeadline: string;
}

export interface AiTelemetryMetrics {
  totalRequestsToday: number;
  ocrRequestsToday: number;
  speechRequestsToday: number;
  imageParsingToday: number;
  averageConfidenceScore: number;
  failedRequestsToday: number;
  p95InferenceLatencyMs: number;
  models: Array<{
    name: string;
    version: string;
    type: string;
    status: "Healthy" | "Degraded" | "Offline";
    uptimePct: number;
    latencyMs: number;
    requestsPerMin: number;
  }>;
}

export interface WorkflowLog {
  id: string;
  timestamp: string;
  issueId: string;
  trackingNumber: string;
  actionType: "AUTO_ROUTED" | "ESCALATED" | "DEPARTMENT_TRANSFER" | "STAKEHOLDER_ASSIGNED" | "RESOLVED" | "REOPENED";
  performedBy: string;
  actorRole: string;
  fromEntity: string;
  toEntity: string;
  reasonNotes: string;
  status: "Success" | "Flagged" | "SLA_Breach";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: "USER_LOGIN" | "ROLE_CHANGE" | "ISSUE_OVERRIDE" | "API_ACCESS" | "SECURITY_ALERT" | "SETTINGS_UPDATE";
  severity: "info" | "warning" | "critical";
  userId: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  actionSummary: string;
  detailsPayload?: Record<string, unknown>;
}

export interface ApiMonitoringMetrics {
  overallStatus: "Operational" | "Degraded" | "Outage";
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRatePct: number;
  totalRequestsLast24h: number;
  endpoints: Array<{
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    avgLatencyMs: number;
    rpm: number;
    errorRatePct: number;
    status: "Healthy" | "Degraded";
  }>;
}

export interface SystemHealthMetrics {
  cpuUsagePct: number;
  cpuCoreCount: number;
  memoryUsedGb: number;
  memoryTotalGb: number;
  storageUsedTb: number;
  storageTotalTb: number;
  databaseStatus: {
    status: "Healthy" | "High Load" | "Degraded";
    activePoolConnections: number;
    maxPoolConnections: number;
    cacheHitRatioPct: number;
    replicationLagMs: number;
    avgQueryLatencyMs: number;
  };
  webSocketStatus: {
    status: "Connected" | "Reconnecting";
    connectedClients: number;
    messagesPerSecond: number;
  };
  serverUptimeSeconds: number;
}

export interface AdminDashboardStats {
  registeredCitizens: number;
  activeOfficials: number;
  universities: number;
  industries: number;
  ngos: number;
  issues: number;
  resolvedIssues: number;
  pendingIssues: number;
  departments: number;
  districts: number;
  notifications: number;
  governmentUsers: number;
  students: number;
  faculty: number;
  researchOrganizations: number;
  activeProjects: number;
  aiRequestsToday: number;
  systemHealthScore: number;
  serverStatusUptimePct: number;
  activeSecurityAlerts: number;
}

export const DEFAULT_ADMIN_STATS: AdminDashboardStats = {
  registeredCitizens: 1428500,
  activeOfficials: 2845,
  universities: 168,
  industries: 214,
  ngos: 97,
  issues: 125604,
  resolvedIssues: 118920,
  pendingIssues: 6684,
  departments: 42,
  districts: 38,
  notifications: 18,
  governmentUsers: 2845,
  students: 58400,
  faculty: 3120,
  researchOrganizations: 78,
  activeProjects: 186,
  aiRequestsToday: 84200,
  systemHealthScore: 99.8,
  serverStatusUptimePct: 99.98,
  activeSecurityAlerts: 0,
};


export interface SystemSettingsConfig {
  platformName: string;
  platformSubtitle: string;
  themeDefault: "system" | "dark" | "light";
  maintenanceMode: boolean;
  maintenanceBroadcastMessage: string;
  smtp: {
    host: string;
    port: number;
    senderEmail: string;
    useTls: boolean;
  };
  googleAuth: {
    clientId: string;
    enabled: boolean;
    autoVerifyDomains: string[];
  };
  notifications: {
    smsEnabled: boolean;
    emailAlertsEnabled: boolean;
    webSocketsBroadcast: boolean;
    criticalEscalationWebhooks: string;
  };
  storage: {
    provider: "AWS S3" | "GCP Cloud Storage" | "Local MinIO";
    bucketName: string;
    maxUploadSizeMb: number;
    autoArchiveDays: number;
  };
  security: {
    sessionTimeoutMinutes: number;
    enforce2FAForAdmins: boolean;
    maxLoginAttempts: number;
    jwtExpiryMinutes: number;
    rateLimitRequestsPerMin: number;
  };
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  type: "security" | "ai" | "workflow" | "system";
  severity: "info" | "warning" | "critical";
  timestamp: string;
  read: boolean;
  link?: string;
}
