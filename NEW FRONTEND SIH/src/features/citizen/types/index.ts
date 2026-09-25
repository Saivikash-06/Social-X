export type IssueStatus =
  | "submitted"
  | "verified"
  | "under_review"
  | "under_government_review"
  | "assigned"
  | "assigned_to_government"
  | "assigned_to_industry"
  | "industry_review"
  | "assigned_to_university"
  | "student_development"
  | "faculty_review"
  | "industry_validation"
  | "government_inspection"
  | "in_progress"
  | "inspection"
  | "resolved"
  | "impact_assessment"
  | "feedback_pending"
  | "closed"
  | "rejected";

export type IssuePriority = "low" | "medium" | "high" | "critical";

export interface TimelineEvent {
  id: string;
  stage: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  completed: boolean;
  isCurrent: boolean;
  evidenceUrl?: string;
}

export interface IssueAttachment {
  id: string;
  type: "image" | "video" | "audio" | "document";
  name: string;
  url: string;
  sizeBytes: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IssueStatus;
  priority: IssuePriority;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  officerContact?: string;
  assignedUniversity?: string;
  universityProject?: string;
  assignedNgo?: string;
  ngoObserver?: string;
  createdAt: string;
  updatedAt: string;
  estimatedResolutionDate?: string;
  resolvedAt?: string;
  attachments: IssueAttachment[];
  timeline: TimelineEvent[];
  aiConfidenceScore?: number;
  ocrExtractedText?: string;
  sttTranscript?: string;
  resolutionFeedbackRating?: number;
  aiAnalysis?: any;
  impactAssessment?: any;
  citizenFeedback?: any;
}

export interface AIAnalysisResult {
  title: string;
  category: string;
  description: string;
  detectedDepartment: string;
  recommendedPriority: IssuePriority;
  confidenceScore: number;
  ocrOutput?: string;
  speechToTextResult?: string;
  detectedLocation?: string;
  latitude?: number;
  longitude?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "status_update" | "assignment" | "resolution" | "alert" | "system";
  issueId?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  totalReported: number;
  inProgress: number;
  resolved: number;
  needsVerification: number;
  communityImpactScore: number;
  avgResolutionDays: number;
}

export interface CitizenProfileUpdate {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  avatarUrl?: string;
}

export interface CitizenSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "hi" | "kn" | "mr" | "ta";
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  anonymousGrievanceMode: boolean;
}
