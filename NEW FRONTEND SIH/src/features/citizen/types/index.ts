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

// --------------------------------------------------------------------------------------
// CITIZEN TRANSPARENCY & PUBLIC ACCOUNTABILITY TYPES
// --------------------------------------------------------------------------------------
export interface TransparencyMetrics {
  totalProblems: number;
  statusBreakdown: Record<string, number>;
  awaitingAcceptance: number;
  inResolution: number;
  completedAndVerified: number;
  totalBudgetAllocated: number;
  totalExpenditure: number;
  remainingBalance: number;
  totalMonitoringVisits: number;
  latestMonitoringTimestamp: string | null;
  activeCorrectiveActions: number;
  lastSystemUpdateTime: string;
}

export interface TransparencyProblemSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  severity: string;
  status: string;
  stageIndex: number; // 1 to 8 in the eight-stage workflow
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  citizenPublicName: string;
  submissionDate: string;
  updatedAt: string;
  assignedDepartment?: string;
  assignedStakeholders: {
    name: string;
    type: "GOVERNMENT" | "NGO" | "UNIVERSITY" | "INDUSTRY" | string;
    department?: string;
    decision: "ACCEPTED" | "REJECTED" | "PENDING_REVIEW" | string;
    status: string;
    progressPct: number;
  }[];
  domainExpert?: {
    name: string;
    role: string;
    domain: string;
    organization: string;
  } | null;
  budgetSummary?: {
    estimatedCost: number;
    approvedBudget: number;
    allocatedBudget: number;
    spentAmount: number;
    remainingBalance: number;
    fundingSource: string;
    fundingOrganization: string;
    currency: string;
  } | null;
  latestMonitoring?: {
    lastMonitoredAt: string;
    officerName: string;
    officerDesignation: string;
    officerDepartment: string;
    monitoringStatus: string;
    observations: string;
  } | null;
  hasUniversitySolution: boolean;
  universitySolutionSummary?: {
    universityName: string;
    solutionStage: string;
  } | null;
}

export interface StakeholderHandoff {
  id: string;
  fromEntityName: string;
  fromEntityType: string;
  toEntityName: string;
  toEntityType: "GOVERNMENT" | "NGO" | "UNIVERSITY" | "INDUSTRY" | string;
  toDepartment?: string;
  receivedAt: string;
  decision: "ACCEPTED" | "REJECTED" | "PENDING_REVIEW" | string;
  decisionAt?: string;
  rejectionReason?: string;
  assignedOfficerName?: string;
  assignedOfficerRole?: string;
  expertDomain?: string;
  collaborationMode: "INDEPENDENT" | "COLLABORATIVE";
  workStatus: string;
  currentProgressPct: number;
  progressNotes?: string;
}

export interface DomainExpertProfile {
  organization: string;
  department?: string;
  expertName: string;
  designationRole: string;
  expertDomain: string;
  acceptanceDate: string;
  roleInResolution: string;
  workStatus?: string;
  progressPct: number;
  progressNotes?: string;
}

export interface GovernmentMonitoringEntry {
  id: string;
  monitoredAt: string;
  officerName: string;
  officerDesignation: string;
  officerDepartment: string;
  monitoringStatus: string;
  observations: string;
  issuesIdentified: string;
  correctiveActionsRequested: string;
  correctiveActionStatus: "PENDING" | "IN_PROGRESS" | "RECTIFIED" | string;
  nextScheduledMonitoringDate?: string | null;
}

export interface GovernmentMonitoringData {
  isMonitored: boolean;
  lastMonitoredAt: string | null; // Real timestamp or null -> "Not yet monitored"
  latestOfficer?: string;
  responsibleDepartment: string;
  currentMonitoringStatus: string;
  totalInspectionsCount: number;
  history: GovernmentMonitoringEntry[];
}

export interface ItemizedExpenditure {
  id: string;
  purpose: string;
  category: "MATERIALS" | "EQUIPMENT" | "LABOR" | "CONTRACTOR" | "TESTING" | "UNIVERSITY_RESEARCH" | string;
  amount: number;
  spentAt: string;
  responsibleOrg: string;
  voucherRef: string;
  evidenceUrl?: string;
  approvedBy: string;
}

export interface FinancialTransparencyData {
  hasBudgetRecorded: boolean;
  estimatedCost: number;
  approvedBudget: number;
  allocatedBudget: number;
  committedAmount: number;
  spentAmount: number;
  remainingBalance: number;
  spentPercentage: number;
  fundingSource: string;
  fundingOrganization: string;
  allocatedAt: string;
  lastRevisionAt?: string | null;
  revisionNotes?: string | null;
  currency: string;
  expenditures: ItemizedExpenditure[];
}

export interface ProjectScheduleData {
  submissionDate: string;
  forwardedDate?: string;
  acceptedDate?: string;
  projectStartDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string | null;
  currentDurationHours: number;
  delaysRecorded: {
    date: string;
    delayHours: number;
    reason: string;
    recordedBy: string;
  }[];
  stageDurations: Record<string, number>; // hours per stage
  reopenCount: number;
}

export interface UniversitySolutionData {
  hasStudentInnovation: boolean;
  universityName: string;
  departmentName: string;
  facultyMentor: string;
  studentTeamName: string;
  studentMembers: string[];
  technicalDomain: string;
  problemStatement: string;
  proposedSolution: string;
  technicalApproach: string;
  researchMilestones: {
    milestone: string;
    date: string;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  }[];
  prototypeEvidenceUrls: string[];
  testingValidationResults?: string;
  stakeholderFeedback?: string;
  solutionStage: "PROPOSED_IDEA" | "DEVELOPED_PROTOTYPE" | "VALIDATED_SOLUTION" | "IMPLEMENTED_SOLUTION";
  implementationDate?: string | null;
  documentedImpact?: string;
}

export interface PublicAccountabilityDossier {
  problem: {
    id: string;
    title: string;
    description: string;
    category: string;
    subCategory?: string;
    priority: string;
    severity: string;
    status: string;
    address?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    assignedDepartment?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    slaHours: number;
    slaDueAt?: string;
  };
  reporter: {
    displayName: string;
    role: string;
    district: string;
    isPublicDisclosureApproved: boolean;
  };
  timeline: {
    id: string;
    fromState?: string;
    toState: string;
    trigger: string;
    actorId?: string;
    actorRole: string;
    remarks?: string;
    timestamp: string;
  }[];
  stakeholderHandoffs: StakeholderHandoff[];
  domainExperts: DomainExpertProfile[];
  governmentMonitoring: GovernmentMonitoringData;
  financialTransparency: FinancialTransparencyData;
  projectSchedule: ProjectScheduleData;
  universitySolution?: UniversitySolutionData | null;
  resolutionEvidence: {
    resolutionNotes?: string;
    resolutionEvidenceUrl?: string;
    resolvedAt?: string;
    citizenRating?: number;
    citizenFeedback?: string;
    attachments: string[];
  };
  finalOutcome: {
    isResolved: boolean;
    resolutionStatus: string;
    resolvedAt?: string;
    documentedImpact: string;
  };
  audit: {
    auditStamp: string;
    generatedAt: string;
    dataIntegrity: string;
  };
}

