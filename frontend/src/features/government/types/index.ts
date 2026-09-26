export type GovernmentOfficerRole =
  | "District Collector"
  | "Municipal Commissioner"
  | "Superintending Engineer"
  | "Executive Engineer"
  | "Assistant Engineer"
  | "Nodal Officer"
  | "Chief Health Inspector"
  | "Sanitary Inspector";

export type GovernmentOfficerStatus = "active" | "suspended" | "inactive";

export interface GovernmentOfficer {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  department: string;
  district: string;
  designation: string;
  role: GovernmentOfficerRole;
  officialPassKey: string;
  status: GovernmentOfficerStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  phone?: string;
  avatarUrl?: string;
}

export type CasePriority = "critical" | "high" | "medium" | "low";
export type CaseStatus =
  | "assigned"
  | "in_progress"
  | "resolved"
  | "escalated"
  | "rejected"
  | "under_government_review"
  | "assigned_to_government"
  | "assigned_to_industry"
  | "industry_review"
  | "assigned_to_university"
  | "student_development"
  | "faculty_review"
  | "industry_validation"
  | "government_inspection"
  | "inspection"
  | "feedback_pending"
  | "closed";

export interface CaseAttachmentMedia {
  images: { id: string; url: string; label: string }[];
  videos: { id: string; url: string; label: string; duration: string }[];
  voiceNotes: { id: string; url: string; label: string; duration: string }[];
  documents: { id: string; url: string; name: string; size: string }[];
}

export interface CaseTimelineEntry {
  id: string;
  stage: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  statusBadge?: string;
}

export interface CaseOfficerNote {
  id: string;
  author: string;
  authorRole: string;
  note: string;
  timestamp: string;
}

export interface CaseResolutionHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  timestamp: string;
}

export interface GovernmentCase {
  id: string;
  title: string;
  description: string;
  citizenName: string;
  citizenPhone: string;
  citizenId: string;
  category: string;
  priority: CasePriority;
  aiConfidence: number; // e.g. 96.4
  location: string;
  district: string;
  wardNo: string;
  gpsCoordinates: { lat: number; lng: number };
  status: CaseStatus;
  assignedDate: string;
  slaDeadline: string;
  officer: string;
  officerId: string;
  department: string;
  attachments: CaseAttachmentMedia;
  timeline: CaseTimelineEntry[];
  aiPrediction: {
    severity: string;
    estimatedResolutionHours: number;
    recommendedMaterial: string[];
    confidence: number;
    suggestedSlaHours: number;
  };
  duplicateDetection: {
    duplicateFound: boolean;
    similarityScore: number;
    duplicateCaseIds?: string[];
  };
  priorityScore: number; // 0-100
  suggestedDepartment: string;
  officerNotes: CaseOfficerNote[];
  resolutionHistory: CaseResolutionHistoryEntry[];
}

export interface GovernmentDepartment {
  id: string;
  code: string;
  name: string;
  headOfficerName: string;
  headOfficerEmail: string;
  districtsCovered: number;
  activeOfficersCount: number;
  activeIssuesCount: number;
  slaComplianceRate: number;
  budgetAllocatedCr: number;
  budgetUtilizedCr: number;
  status: "active" | "under_review";
  iconName?: string;
}

export interface GovernmentDashboardStats {
  totalAssignedCases: number;
  resolvedCases: number;
  pendingCases: number;
  highPriorityCases: number;
  emergencyCases: number;
  averageResolutionHours: number;
  departmentPerformanceRate: number;
  citizenSatisfactionScore: number;
}

export interface MonthlyIssueStat {
  month: string;
  received: number;
  resolved: number;
  escalated: number;
}

export interface ResolutionTrendStat {
  day: string;
  avgHours: number;
  targetHours: number;
}

export interface DistrictIssueStat {
  district: string;
  total: number;
  resolved: number;
  critical: number;
}

export interface DepartmentMetricStat {
  department: string;
  slaRate: number;
  activeCases: number;
  officers: number;
}
