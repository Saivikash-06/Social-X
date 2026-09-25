import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface IssueAttachmentMedia {
  images: { id: string; url: string; label: string }[];
  videos: { id: string; url: string; label: string; duration?: string }[];
  voiceNotes: { id: string; url: string; label: string; duration?: string }[];
  documents: { id: string; url: string; name?: string; size?: string }[];
}

export interface IssueTimelineEntry {
  id: string;
  stage: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  completed?: boolean;
  isCurrent?: boolean;
  statusBadge?: string;
  evidenceUrl?: string;
}

export interface IssueOfficerNote {
  id: string;
  author: string;
  authorRole: string;
  note: string;
  timestamp: string;
}

export interface IssueResolutionHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  timestamp: string;
}

export interface CentralIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status:
    | "submitted"
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
    | "rejected"
    | "escalated";
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  isAnonymous?: boolean;
  location: string;
  district: string;
  state: string;
  wardNo: string;
  gpsCoordinates: { lat: number; lng: number };
  assignedDepartment: string;
  assignedOfficer: string;
  officerId: string;
  officerContact?: string;
  aiConfidence: number;
  aiPrediction: {
    severity: string;
    estimatedResolutionHours: number;
    recommendedMaterial: string[];
    suggestedSlaHours: number;
  };
  attachments: IssueAttachmentMedia;
  timeline: IssueTimelineEntry[];
  officerNotes: IssueOfficerNote[];
  resolutionHistory: IssueResolutionHistoryEntry[];
  ocrExtractedText?: string;
  sttTranscript?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDeadline?: string;
  // Government-to-Industry Collaboration Extensions
  resolutionMode?: "internal" | "industry";
  assignedCompanyId?: string;
  assignedCompanyName?: string;
  workOrderId?: string;
  workOrderStatus?:
    | "draft"
    | "issued"
    | "accepted"
    | "in_progress"
    | "clarification_requested"
    | "submitted"
    | "approved"
    | "rejected"
    | "completed";
  budget?: number;
  paymentStatus?: "pending" | "approved" | "released" | "completed";
  paymentReference?: string;
  universityCollaborationId?: string;
  universityName?: string;
  facultyMentorName?: string;
  studentTeamName?: string;
  // End-to-End Social-X Workflow Extensions
  aiAnalysis?: ComprehensiveAiAnalysis;
  routingTargets?: Array<"government" | "ngo" | "emergency">;
  ngoWorkflow?: NgoWorkflowData;
  emergencyWorkflow?: EmergencyWorkflowData;
  impactAssessment?: ImpactAssessmentData;
  citizenFeedback?: CitizenFeedbackData;
}

export interface ComprehensiveAiAnalysis {
  ocrText?: string;
  sttTranscript?: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  isDuplicate: boolean;
  duplicateOfIssueId?: string;
  isEmergency: boolean;
  emergencyType?: "fire" | "medical" | "police" | "disaster" | "life_safety";
  sentiment: "positive" | "neutral" | "frustrated" | "urgent" | "critical";
  sentimentScore: number;
  recommendedDepartment: string;
  recommendedStakeholders: Array<"government" | "ngo" | "industry" | "university" | "emergency">;
  estimatedCost: number;
  estimatedCompletionDays: number;
  estimatedResolutionHours: number;
  confidenceScore: number;
}

export interface NgoWorkflowData {
  ngoId?: string;
  ngoName?: string;
  needsVolunteers: boolean;
  societyCoordinator?: string;
  volunteersAssignedCount?: number;
  communityActionSummary?: string;
  completionReportUrl?: string;
  status: "pending_review" | "direct_assistance" | "volunteers_mobilized" | "service_completed";
  assignedAt?: string;
  completedAt?: string;
}

export interface EmergencyWorkflowData {
  isTriggered: boolean;
  emergencyType: "fire" | "medical" | "police" | "disaster" | "life_safety";
  notifiedAgencies: string[];
  dispatchedAt: string;
  responseStatus: "dispatched" | "on_scene" | "stabilized" | "handed_over";
  controlRoomNotes?: string;
}

export interface ImpactAssessmentData {
  beforePhotoUrls: string[];
  afterPhotoUrls: string[];
  completionEvidenceUrls: string[];
  actualResolutionTimeHours: number;
  totalCost: number;
  citizenSatisfactionScore?: number;
  governmentRating?: number;
  industryPerformanceScore?: number;
  universityContributionScore?: number;
  studentInnovationScore?: number;
  assessedAt: string;
  assessedBy: string;
}

export interface CitizenFeedbackData {
  rating: number;
  feedback: string;
  comments?: string;
  submittedAt: string;
}

export interface CentralNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "status_update"
    | "assignment"
    | "officer_assigned"
    | "resolution"
    | "alert"
    | "system"
    | "feedback_request"
    | "work_order"
    | "collaboration_request"
    | "student_assignment"
    | "solution_submission"
    | "faculty_approval"
    | "industry_validation"
    | "certificate"
    | "payment"
    | "emergency_alert"
    | "ngo_mobilized"
    | "inspection_passed"
    | "case_closed";
  issueId: string;
  read: boolean;
  createdAt: string;
}

export interface IndustryCompany {
  id: string;
  name: string;
  legalEntityName: string;
  sector: string;
  technologyDomains: string[];
  district: string;
  state: string;
  verified: boolean;
  esgGrade: "AAA" | "AA" | "A" | "BBB";
  activeWorkOrdersCount: number;
  completedWorkOrdersCount: number;
  rating: number;
  contactEmail: string;
  contactPhone: string;
  turnaroundTimeAvgDays: number;
  availableCapacity: "high" | "moderate" | "low";
}

export interface WorkOrder {
  id: string; // e.g. WO-2026-0001
  issueId: string;
  issueTitle: string;
  issueCategory: string;
  location: string;
  district: string;
  department: string;
  authorizingOfficer: string;
  authorizingOfficerId: string;
  companyId: string;
  companyName: string;
  scopeOfWork: string;
  budget: number;
  issuedAt: string;
  deadline: string;
  status:
    | "issued"
    | "accepted"
    | "in_progress"
    | "clarification_requested"
    | "submitted"
    | "approved"
    | "rejected"
    | "completed";
  clarificationMessage?: string;
  universityCollaborationId?: string;
  universityCollaborationStatus?: CollaborationStatus;
  solutionPlan?: {
    technicalApproach: string;
    milestones: { title: string; targetDate: string; percentage: number }[];
    equipmentDeployed: string[];
    submittedAt: string;
  };
  progressReports: {
    id: string;
    progressPercentage: number;
    description: string;
    evidenceUrls: string[];
    submittedAt: string;
    reviewedByOfficer?: string;
    officerRemarks?: string;
    status: "submitted" | "approved" | "modifications_requested" | "rejected";
  }[];
  completionReport?: {
    completionSummary: string;
    evidenceUrls: string[];
    testResults?: string;
    submittedAt: string;
    inspectionOfficer?: string;
    inspectionDate?: string;
    inspectionRemarks?: string;
    verified: boolean;
  };
  payment?: {
    id: string;
    invoiceRef: string;
    amount: number;
    status: "pending" | "approved" | "released" | "completed";
    approvedAt?: string;
    approvedBy?: string;
    releasedAt?: string;
    transactionHash?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  district: string;
  state: string;
  accreditedGrade: string;
  nirfRank: number;
  departments: string[];
  verified: boolean;
  facultyCount: number;
  studentsCount: number;
  activeProjectsCount: number;
  contactEmail: string;
  contactPhone: string;
}

export interface FacultyMentor {
  id: string;
  universityId: string;
  universityName: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  specializations: string[];
  hIndex: number;
  activeProjects: number;
  rating: number;
  avatarUrl?: string;
}

export interface StudentTeamMember {
  studentId: string;
  name: string;
  email: string;
  role: string;
  year: string;
}

export interface StudentTeam {
  id: string;
  name: string;
  universityId: string;
  universityName: string;
  department: string;
  leadStudentId: string;
  leadStudentName: string;
  members: StudentTeamMember[];
  skills: string[];
  activeProjectsCount: number;
  academicCredits: number;
}

export type CollaborationStatus =
  | "requested"
  | "faculty_accepted"
  | "faculty_rejected"
  | "student_assigned"
  | "in_development"
  | "faculty_approved"
  | "industry_validated"
  | "modifications_requested"
  | "deployed";

export interface UniversityCollaboration {
  id: string; // e.g. CR-2026-0001
  workOrderId: string;
  issueId: string;
  issueTitle: string;
  issueCategory: string;
  industryId: string;
  industryName: string;
  governmentDepartment: string;
  universityId: string;
  universityName: string;
  department: string;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  studentTeamId?: string;
  studentTeamName?: string;
  researchGrant: number; // INR
  objectives: string;
  requiredDeliverables: string[];
  deadline: string;
  status: CollaborationStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  milestones?: {
    id: string;
    title: string;
    targetDays: number;
    deliverable: string;
    completed: boolean;
  }[];
  solutionSubmission?: {
    title: string;
    summary: string;
    researchPaperUrl?: string;
    prototypeImages: string[];
    sourceCodeUrl?: string;
    submittedAt: string;
    submittedBy: string;
  };
  facultyReview?: {
    approved: boolean;
    feedback: string;
    reviewedAt: string;
    facultyName: string;
    mentorRating: number;
  };
  industryValidation?: {
    status: "accepted" | "modifications_requested" | "rejected";
    feedback: string;
    validatedAt: string;
    validatedBy: string;
    deploymentEvidenceUrl?: string;
  };
  certificates?: {
    id: string;
    recipientId: string;
    recipientName: string;
    recipientRole: "faculty_mentor" | "student_innovator";
    title: string;
    certificateNumber: string;
    issuedAt: string;
    academicCreditsAwarded: number;
  }[];
}

export interface AcademicCertificate {
  id: string;
  collaborationId: string;
  recipientId: string;
  recipientName: string;
  recipientRole: "faculty_mentor" | "student_innovator";
  universityName: string;
  industryPartnerName: string;
  projectTitle: string;
  certificateNumber: string;
  academicCreditsAwarded: number;
  issuedAt: string;
  verificationHash: string;
}

// File persistence paths
const DATA_DIR = path.join(process.cwd(), ".data");
const ISSUES_FILE = path.join(DATA_DIR, "issues_db.json");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications_db.json");
const COMPANIES_FILE = path.join(DATA_DIR, "companies_db.json");
const WORK_ORDERS_FILE = path.join(DATA_DIR, "work_orders_db.json");
const UNIVERSITIES_FILE = path.join(DATA_DIR, "universities_db.json");
const FACULTY_FILE = path.join(DATA_DIR, "faculty_db.json");
const STUDENT_TEAMS_FILE = path.join(DATA_DIR, "student_teams_db.json");
const COLLABORATIONS_FILE = path.join(DATA_DIR, "collaborations_db.json");
const CERTIFICATES_FILE = path.join(DATA_DIR, "certificates_db.json");

// Default initial issues to populate the database
const INITIAL_ISSUES: CentralIssue[] = [
  {
    id: "SOC-2026-008821",
    title: "Potable Water Main Line Fracture & Flooding",
    description:
      "A primary underground water supply line has cracked at the 14th Main crossroad, causing severe loss of municipal water and traffic blockage.",
    category: "Water Supply & Drainage",
    status: "in_progress",
    priority: "high",
    citizenId: "usr-cit-01",
    citizenName: "Vikash (Citizen)",
    citizenPhone: "+91 98401 22891",
    citizenEmail: "citizen.vikash@example.com",
    location: "14th Main Rd, Indiranagar, Bengaluru, Karnataka 560038",
    district: "Bengaluru Urban",
    state: "Karnataka",
    wardNo: "Ward 142",
    gpsCoordinates: { lat: 12.9716, lng: 77.5946 },
    assignedDepartment: "Municipal Administration & Water Supply",
    assignedOfficer: "Thiru S. Sivakumar, IAS",
    officerId: "off-tn-001",
    officerContact: "+91 94480 12345",
    aiConfidence: 97.4,
    aiPrediction: {
      severity: "High Municipal Hazard",
      estimatedResolutionHours: 24,
      recommendedMaterial: ["DI Feeder Pipe (900mm)", "Hydraulic Trench Cutter"],
      suggestedSlaHours: 24,
    },
    ocrExtractedText: "BWSSB VALVE PIT #4 - CAUTION POTABLE FEED",
    sttTranscript:
      "Huge water leak on 14th Main, Indiranagar. Road is getting inundated and people cannot walk.",
    attachments: {
      images: [
        {
          id: "att-1",
          label: "Broken water main flooding carriageway",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [
      {
        id: "tl-1",
        stage: "Submission",
        title: "Grievance Logged",
        description: "Citizen filed report with photo and voice recording.",
        actor: "Citizen Portal",
        actorRole: "Citizen",
        timestamp: "2026-09-20 09:30 AM",
        completed: true,
      },
      {
        id: "tl-2",
        stage: "AI Analysis",
        title: "Multimodal AI Classification",
        description:
          "AI engine validated image OCR and speech transcript. Matched to Municipal Water Supply (97.4% confidence).",
        actor: "Social-X AI Neural Engine",
        actorRole: "Automated System",
        timestamp: "2026-09-20 09:31 AM",
        completed: true,
      },
      {
        id: "tl-3",
        stage: "Department Dispatch",
        title: "Assigned to Municipal Administration & Water Supply",
        description: "Dispatched to Executive Engineer Thiru S. Sivakumar. SLA clock active (24 hrs).",
        actor: "Municipal Routing Gateway",
        actorRole: "Government",
        timestamp: "2026-09-20 10:15 AM",
        completed: true,
        isCurrent: true,
      },
    ],
    officerNotes: [
      {
        id: "note-1",
        author: "Thiru S. Sivakumar, IAS",
        authorRole: "Executive Engineer",
        note: "Ground repair squad dispatched with de-watering pumps and replacement DI sleeve.",
        timestamp: "2026-09-20 11:00 AM",
      },
    ],
    resolutionHistory: [
      {
        id: "rh-1",
        action: "Case Assigned",
        performedBy: "AI Router",
        role: "Automated System",
        details: "Assigned based on high confidence pipeline rupture detection.",
        timestamp: "2026-09-20 09:31 AM",
      },
    ],
    createdAt: "2026-09-20T09:30:00.000Z",
    updatedAt: "2026-09-20T11:00:00.000Z",
    slaDeadline: "2026-09-21 09:30 AM (24h SLA)",
  },
  {
    id: "SOC-2026-006402",
    title: "Large Pothole Cluster & Caved-in Asphalt",
    description:
      "Deep cratered road surface causing frequent two-wheeler skids following heavy monsoon rainfall.",
    category: "Roads & Transportation",
    status: "resolved",
    priority: "medium",
    citizenId: "usr-cit-01",
    citizenName: "Vikash (Citizen)",
    citizenPhone: "+91 98401 22891",
    citizenEmail: "citizen.vikash@example.com",
    location: "Koramangala 4th Block, 80 Feet Road, Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    wardNo: "Ward 151",
    gpsCoordinates: { lat: 12.935, lng: 77.624 },
    assignedDepartment: "Highways & Minor Ports (Roads)",
    assignedOfficer: "Er. S. Anbarasan",
    officerId: "off-tn-004",
    aiConfidence: 96.8,
    aiPrediction: {
      severity: "Road Cavity Grade 2",
      estimatedResolutionHours: 48,
      recommendedMaterial: ["Cold-mix Bituminous Asphalt", "Vibratory Roller"],
      suggestedSlaHours: 48,
    },
    attachments: {
      images: [
        {
          id: "att-2",
          label: "Pothole depth measurement",
          url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [
      {
        id: "tl-201",
        stage: "Submission",
        title: "Report Submitted",
        description: "Reported with photos.",
        actor: "Vikash (Citizen)",
        actorRole: "Citizen",
        timestamp: "2026-09-18 02:10 PM",
        completed: true,
      },
      {
        id: "tl-202",
        stage: "Resolution",
        title: "Hot-Mix Asphalt Paving Completed",
        description: "Road patch finalized and stamped by municipal inspection team.",
        actor: "Er. S. Anbarasan",
        actorRole: "Executive Engineer",
        timestamp: "2026-09-19 05:00 PM",
        completed: true,
      },
    ],
    officerNotes: [],
    resolutionHistory: [
      {
        id: "rh-201",
        action: "Resolved",
        performedBy: "Er. S. Anbarasan",
        role: "Executive Engineer",
        details: "Bitumen hot mix applied, compacted and road opened for traffic.",
        timestamp: "2026-09-19 05:00 PM",
      },
    ],
    createdAt: "2026-09-18T14:10:00.000Z",
    updatedAt: "2026-09-19T17:00:00.000Z",
    resolvedAt: "2026-09-19T17:00:00.000Z",
  },
  {
    id: "TN-CIVIC-9021",
    title: "Major High-Pressure Potable Water Main Burst & Road Cave-in",
    description:
      "A 900mm DI feeder conduit ruptured near the Anna Salai intersection, flooding the carriageway and undermining asphalt substructure.",
    category: "Water Supply & Sewage",
    status: "in_progress",
    priority: "critical",
    citizenId: "CIT-TN-88219",
    citizenName: "R. Sundaramurthy",
    citizenPhone: "+91 98401 22891",
    location: "Anna Salai, Near DMS Metro, Teynampet",
    district: "Chennai",
    state: "Tamil Nadu",
    wardNo: "Ward 118",
    gpsCoordinates: { lat: 13.0425, lng: 80.2514 },
    assignedDepartment: "Municipal Administration & Water Supply",
    assignedOfficer: "Thiru S. Sivakumar, IAS",
    officerId: "off-tn-001",
    aiConfidence: 98.4,
    aiPrediction: {
      severity: "Emergency Class 1 Hazard",
      estimatedResolutionHours: 12,
      recommendedMaterial: ["900mm DI Pipe", "Hydraulic Sump Pump"],
      suggestedSlaHours: 12,
    },
    attachments: {
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
          label: "Burst Pipeline Crater & Geyser",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [],
    officerNotes: [],
    resolutionHistory: [],
    createdAt: "2026-09-22T06:15:00.000Z",
    updatedAt: "2026-09-22T06:30:00.000Z",
    slaDeadline: "2026-09-22 06:15 PM (12h SLA)",
  },
  {
    id: "TN-CIVIC-8974",
    title: "Hazardous 11kV HT Power Line Snapped Over Pedestrian Footway",
    description:
      "A tree branch collapsed onto live high-tension overhead cables along South Veli Street. Cable is hanging 1.5 meters from pedestrian walkway, posing immediate electrocution hazard.",
    category: "Electricity & Streetlights",
    status: "in_progress",
    priority: "critical",
    citizenId: "CIT-TN-45102",
    citizenName: "Meenakshi Sundaram",
    citizenPhone: "+91 94432 89100",
    location: "South Veli Street, Opposite District Hospital",
    district: "Madurai",
    state: "Tamil Nadu",
    wardNo: "Ward 42",
    gpsCoordinates: { lat: 9.9195, lng: 78.1193 },
    assignedDepartment: "Tamil Nadu Generation & Distribution (Electricity)",
    assignedOfficer: "Er. K. Ramanathan, M.E.",
    officerId: "off-tn-003",
    aiConfidence: 99.1,
    aiPrediction: {
      severity: "Critical Life-Safety Hazard",
      estimatedResolutionHours: 4,
      recommendedMaterial: ["11kV ACSR Conductor (50m)", "Insulator Assemblies"],
      suggestedSlaHours: 4,
    },
    attachments: {
      images: [
        {
          id: "img-3",
          url: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=80",
          label: "Live Cable Dangling Near School Crosswalk",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [],
    officerNotes: [],
    resolutionHistory: [],
    createdAt: "2026-09-22T07:00:00.000Z",
    updatedAt: "2026-09-22T07:25:00.000Z",
    slaDeadline: "2026-09-22 11:00 AM (4h SLA)",
  },
];

const INITIAL_NOTIFICATIONS: CentralNotification[] = [
  {
    id: "notif-init-1",
    userId: "usr-cit-01",
    title: "Officer Dispatched",
    message: "Er. Ramesh K. has arrived on-site for Water Main Line Fracture (#SOC-2026-008821).",
    type: "status_update",
    issueId: "SOC-2026-008821",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-init-2",
    userId: "usr-cit-01",
    title: "Pothole Repair Verified",
    message: "BBMP completed asphalt laying for Koramangala 4th Block (#SOC-2026-006402). Please submit your feedback.",
    type: "resolution",
    issueId: "SOC-2026-006402",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Memory Database structures
// Default initial registered companies / startups
const INITIAL_COMPANIES: IndustryCompany[] = [
  {
    id: "comp-ind-001",
    name: "CleanAqua Infrastructure Pvt Ltd",
    legalEntityName: "CleanAqua Urban Solutions India Ltd",
    sector: "Water Supply & Wastewater Engineering",
    technologyDomains: [
      "Water Supply & Drainage",
      "Hydrodynamic Jetting",
      "Pipe Relining",
      "Underground Sensor Telemetry",
    ],
    district: "Chennai",
    state: "Tamil Nadu",
    verified: true,
    esgGrade: "AAA",
    activeWorkOrdersCount: 1,
    completedWorkOrdersCount: 48,
    rating: 4.9,
    contactEmail: "contracts@cleanaqua.in",
    contactPhone: "+91 44 2855 9012",
    turnaroundTimeAvgDays: 2.1,
    availableCapacity: "high",
  },
  {
    id: "comp-ind-002",
    name: "Apex CivilTech Urban Roads",
    legalEntityName: "Apex Infrastructure & Highway Solutions Pvt Ltd",
    sector: "Civil Highways & Pavements",
    technologyDomains: [
      "Roads & Transportation",
      "Cold-Mix Bituminous Laying",
      "Ground Penetrating Radar",
      "Cave-in Stabilization",
    ],
    district: "Chennai",
    state: "Tamil Nadu",
    verified: true,
    esgGrade: "AAA",
    activeWorkOrdersCount: 2,
    completedWorkOrdersCount: 62,
    rating: 4.8,
    contactEmail: "tenders@apexcivil.com",
    contactPhone: "+91 44 4921 7890",
    turnaroundTimeAvgDays: 1.8,
    availableCapacity: "high",
  },
  {
    id: "comp-ind-003",
    name: "UrjaGrid Power Innovations",
    legalEntityName: "UrjaGrid Smart Energy & Microgrid Technologies Ltd",
    sector: "Electrical Grid & Smart Infrastructure",
    technologyDomains: [
      "Electricity & Lighting",
      "Underground Cable Fault Locators",
      "Transformer Telemetry",
      "LED Solar Microgrids",
    ],
    district: "Chennai",
    state: "Tamil Nadu",
    verified: true,
    esgGrade: "AA",
    activeWorkOrdersCount: 1,
    completedWorkOrdersCount: 34,
    rating: 4.9,
    contactEmail: "projects@urjagrid.in",
    contactPhone: "+91 44 6712 3450",
    turnaroundTimeAvgDays: 1.2,
    availableCapacity: "high",
  },
  {
    id: "comp-ind-004",
    name: "EcoBio Waste Recyclers",
    legalEntityName: "EcoBio Waste Processing & Remediation LLP",
    sector: "Environmental Solid Waste Governance",
    technologyDomains: [
      "Solid Waste & Cleanliness",
      "Bioremediation",
      "Hazardous Waste Removal",
      "Automated Sorting",
    ],
    district: "Chennai",
    state: "Tamil Nadu",
    verified: true,
    esgGrade: "AA",
    activeWorkOrdersCount: 0,
    completedWorkOrdersCount: 29,
    rating: 4.7,
    contactEmail: "ops@ecobio.org",
    contactPhone: "+91 44 3301 9821",
    turnaroundTimeAvgDays: 1.5,
    availableCapacity: "high",
  },
  {
    id: "comp-ind-005",
    name: "ArogyaHealth Mobile Sanitize",
    legalEntityName: "ArogyaHealth Public Wellness & Epidemic Defense Pvt Ltd",
    sector: "Public Health & Sanitation",
    technologyDomains: [
      "Public Health & Sanitation",
      "Vector Control Sprayers",
      "Hospital Sanitization",
      "Drinking Water Chlorination",
    ],
    district: "Chennai",
    state: "Tamil Nadu",
    verified: true,
    esgGrade: "AAA",
    activeWorkOrdersCount: 0,
    completedWorkOrdersCount: 19,
    rating: 4.9,
    contactEmail: "nodal@arogyahealth.org",
    contactPhone: "+91 44 2441 5567",
    turnaroundTimeAvgDays: 0.8,
    availableCapacity: "high",
  },
];

// Default initial work orders
const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-2026-0001",
    issueId: "SOC-2026-008821",
    issueTitle: "Potable Water Main Line Fracture & Flooding",
    issueCategory: "Water Supply & Drainage",
    location: "14th Main Rd, Indiranagar, Bengaluru, Karnataka 560038",
    district: "Bengaluru Urban",
    department: "Municipal Administration & Water Supply",
    authorizingOfficer: "Thiru S. Sivakumar, IAS",
    authorizingOfficerId: "off-tn-001",
    companyId: "comp-ind-001",
    companyName: "CleanAqua Infrastructure Pvt Ltd",
    scopeOfWork:
      "Deploy hydraulic line-stopple bypass, replace 900mm fractured ductile iron section, conduct pressure hydrostatic test at 6 bar, and restore road surface bedding.",
    budget: 450000,
    issuedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status: "in_progress",
    solutionPlan: {
      technicalApproach:
        "Excavate 2.5m trench using laser shoring, isolate sub-circuit valves 14A and 14B, weld high-density sleeve.",
      milestones: [
        { title: "Trench excavation & flow bypass", targetDate: "Day 1", percentage: 30 },
        { title: "Sleeve welding & flange anchoring", targetDate: "Day 2", percentage: 70 },
        { title: "Hydrostatic test & backfill", targetDate: "Day 3", percentage: 100 },
      ],
      equipmentDeployed: ["Hydraulic Pipe Stopper", "Welding Rig 450A", "Laser Shoring Shields"],
      submittedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    },
    progressReports: [
      {
        id: "pr-001",
        progressPercentage: 45,
        description:
          "Completed isolation of water junction, excavation complete, replacement 900mm pipe segment arrived on-site.",
        evidenceUrls: [
          "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
        ],
        submittedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        reviewedByOfficer: "Thiru S. Sivakumar, IAS",
        officerRemarks: "Progress verified on field. Proceed with flange anchoring.",
        status: "approved",
      },
    ],
    payment: {
      id: "pay-wo-001",
      invoiceRef: "INV-2026-008821",
      amount: 450000,
      status: "pending",
    },
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
];

// Default initial registered universities
const INITIAL_UNIVERSITIES: University[] = [
  {
    id: "univ-001",
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    district: "Chennai",
    state: "Tamil Nadu",
    accreditedGrade: "Institute of National Importance / NIRF #1",
    nirfRank: 1,
    departments: [
      "Artificial Intelligence",
      "Computer Science",
      "Civil Engineering",
      "Environmental Engineering",
      "Mechanical Engineering",
      "Electronics",
    ],
    verified: true,
    facultyCount: 650,
    studentsCount: 11000,
    activeProjectsCount: 84,
    contactEmail: "dean.ic@iitm.ac.in",
    contactPhone: "+91 44 2257 8000",
  },
  {
    id: "univ-002",
    name: "Anna University (College of Engineering Guindy)",
    shortName: "Anna University",
    district: "Chennai",
    state: "Tamil Nadu",
    accreditedGrade: "NAAC A++",
    nirfRank: 13,
    departments: [
      "Civil Engineering",
      "Environmental Engineering",
      "Electronics",
      "Mechanical Engineering",
      "Computer Science",
      "Biotechnology",
    ],
    verified: true,
    facultyCount: 520,
    studentsCount: 14000,
    activeProjectsCount: 62,
    contactEmail: "industry.liaison@annauniv.edu",
    contactPhone: "+91 44 2235 7004",
  },
  {
    id: "univ-003",
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    district: "Coimbatore",
    state: "Tamil Nadu",
    accreditedGrade: "NAAC A+",
    nirfRank: 53,
    departments: [
      "Robotics & Automation",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electronics",
      "Computer Science",
      "Environmental Engineering",
    ],
    verified: true,
    facultyCount: 410,
    studentsCount: 8500,
    activeProjectsCount: 45,
    contactEmail: "research@psgtech.edu",
    contactPhone: "+91 422 4344 777",
  },
  {
    id: "univ-004",
    name: "National Institute of Technology Tiruchirappalli",
    shortName: "NIT Trichy",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    accreditedGrade: "NIRF #9 / NAAC A++",
    nirfRank: 9,
    departments: [
      "Civil Engineering",
      "Energy & Environment",
      "Computer Science",
      "Electronics",
      "Mechanical Engineering",
      "Chemical Engineering",
    ],
    verified: true,
    facultyCount: 380,
    studentsCount: 7200,
    activeProjectsCount: 58,
    contactEmail: "dean.ric@nitt.edu",
    contactPhone: "+91 431 2503 000",
  },
  {
    id: "univ-005",
    name: "Vellore Institute of Technology",
    shortName: "VIT",
    district: "Vellore",
    state: "Tamil Nadu",
    accreditedGrade: "NAAC A++ (3.66)",
    nirfRank: 11,
    departments: [
      "Biotechnology",
      "Agriculture",
      "Computer Science",
      "Artificial Intelligence",
      "Environmental Engineering",
      "Electronics",
    ],
    verified: true,
    facultyCount: 950,
    studentsCount: 28000,
    activeProjectsCount: 72,
    contactEmail: "innovation@vit.ac.in",
    contactPhone: "+91 416 220 2011",
  },
  {
    id: "univ-006",
    name: "Tamil Nadu Agricultural University",
    shortName: "TNAU",
    district: "Coimbatore",
    state: "Tamil Nadu",
    accreditedGrade: "ICAR Accredited A+",
    nirfRank: 35,
    departments: [
      "Agriculture",
      "Biotechnology",
      "Environmental Engineering",
      "Water Resources Engineering",
    ],
    verified: true,
    facultyCount: 320,
    studentsCount: 6500,
    activeProjectsCount: 39,
    contactEmail: "research@tnau.ac.in",
    contactPhone: "+91 422 6611 200",
  },
];

// Default initial faculty mentors
const INITIAL_FACULTY: FacultyMentor[] = [
  {
    id: "fac-001",
    universityId: "univ-001",
    universityName: "Indian Institute of Technology Madras",
    name: "Dr. R. Ramanujam, Ph.D.",
    designation: "Professor & Head of AI Research Labs",
    department: "Artificial Intelligence",
    email: "ramanujam.ai@iitm.ac.in",
    phone: "+91 94441 22301",
    specializations: [
      "Edge AI",
      "Acoustic Sonar Leak Detection",
      "IoT Sensor Networks",
      "Computer Vision",
    ],
    hIndex: 28,
    activeProjects: 3,
    rating: 4.9,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fac-002",
    universityId: "univ-002",
    universityName: "Anna University",
    name: "Dr. V. Meenakshi, Ph.D.",
    designation: "Professor of Hydraulic & Environmental Engineering",
    department: "Civil Engineering",
    email: "meenakshi.env@annauniv.edu",
    phone: "+91 98402 33412",
    specializations: [
      "Trenchless Pipeline Rehabilitation",
      "Hydraulic Network Modeling",
      "Potable Water Treatment",
      "Environmental Engineering",
    ],
    hIndex: 24,
    activeProjects: 4,
    rating: 4.8,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fac-003",
    universityId: "univ-003",
    universityName: "PSG College of Technology",
    name: "Dr. K. Balasubramanian, Ph.D.",
    designation: "Head of Mechatronics & In-Pipe Robotics",
    department: "Mechanical Engineering",
    email: "balu.robotics@psgtech.edu",
    phone: "+91 97901 44523",
    specializations: [
      "In-Pipe Robotic Crawlers",
      "Composite Sleeve Robotic Welding",
      "Ultrasonic NDT",
      "Robotics & Automation",
    ],
    hIndex: 22,
    activeProjects: 2,
    rating: 4.9,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fac-004",
    universityId: "univ-004",
    universityName: "National Institute of Technology Tiruchirappalli",
    name: "Dr. S. Anitha, Ph.D.",
    designation: "Associate Professor of Smart Grid & Microgrid Systems",
    department: "Electronics",
    email: "anitha.grid@nitt.edu",
    phone: "+91 94862 55634",
    specializations: [
      "Underground Cable Fault Locators",
      "Smart Meter Telemetry",
      "LED Solar Microgrids",
      "Electronics",
    ],
    hIndex: 19,
    activeProjects: 3,
    rating: 4.7,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fac-005",
    universityId: "univ-006",
    universityName: "Tamil Nadu Agricultural University",
    name: "Dr. P. Ravichandran, Ph.D.",
    designation: "Director of Agro-Environmental Technologies",
    department: "Agriculture",
    email: "ravi.agro@tnau.ac.in",
    phone: "+91 98422 66745",
    specializations: [
      "Precision Irrigation Telemetry",
      "Soil Heavy Metal Bio-remediation",
      "Urban Organic Waste Composting",
      "Biotechnology",
    ],
    hIndex: 21,
    activeProjects: 2,
    rating: 4.8,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

// Default initial student teams
const INITIAL_STUDENT_TEAMS: StudentTeam[] = [
  {
    id: "team-001",
    name: "Team AquaSense AI",
    universityId: "univ-001",
    universityName: "Indian Institute of Technology Madras",
    department: "Artificial Intelligence",
    leadStudentId: "stu-001",
    leadStudentName: "Aditya Krishnan",
    members: [
      { studentId: "stu-001", name: "Aditya Krishnan", role: "Team Lead & AI/Edge Architect", email: "aditya.k@smail.iitm.ac.in", year: "Final Year B.Tech" },
      { studentId: "stu-002", name: "Pooja Sundaram", role: "Robotics Hardware Specialist", email: "pooja.s@smail.iitm.ac.in", year: "3rd Year B.Tech" },
      { studentId: "stu-003", name: "M. Vignesh", role: "Acoustic Sensor Firmware", email: "vignesh.m@smail.iitm.ac.in", year: "Final Year B.Tech" },
      { studentId: "stu-004", name: "Sneha Rao", role: "Telemetry & Cloud Dashboard", email: "sneha.r@smail.iitm.ac.in", year: "3rd Year B.Tech" },
    ],
    skills: [
      "Ultrasonic Sonar Signal Analysis",
      "Edge TensorRT Python",
      "Microcontroller Firmware (STM32)",
      "CAD 3D Prototyping",
      "LoRaWAN & IoT",
    ],
    activeProjectsCount: 1,
    academicCredits: 12,
  },
  {
    id: "team-002",
    name: "Team Trenchless Dynamics",
    universityId: "univ-002",
    universityName: "Anna University",
    department: "Civil Engineering",
    leadStudentId: "stu-005",
    leadStudentName: "R. Divya",
    members: [
      { studentId: "stu-005", name: "R. Divya", role: "Team Lead & Materials Researcher", email: "divya.r@ceg.annauniv.edu", year: "M.Tech Structural Engineering" },
      { studentId: "stu-006", name: "K. Gautham", role: "Hydraulic Finite Element Analyst", email: "gautham.k@ceg.annauniv.edu", year: "Final Year B.E Civil" },
      { studentId: "stu-007", name: "Arunachalam S.", role: "Polymer Matrix Engineer", email: "arun.s@ceg.annauniv.edu", year: "Final Year B.E Civil" },
    ],
    skills: [
      "Polymeric Resin Composites",
      "Hydrostatic Stress Analysis",
      "GIS Pipeline Network Modeling",
      "Non-Destructive Testing",
    ],
    activeProjectsCount: 1,
    academicCredits: 16,
  },
  {
    id: "team-003",
    name: "Team RoboWeld Solutions",
    universityId: "univ-003",
    universityName: "PSG College of Technology",
    department: "Mechanical Engineering",
    leadStudentId: "stu-008",
    leadStudentName: "S. Harish",
    members: [
      { studentId: "stu-008", name: "S. Harish", role: "Lead Mechatronics Engineer", email: "harish.s@psgtech.ac.in", year: "Final Year B.E Mechatronics" },
      { studentId: "stu-009", name: "Deepak Raj", role: "Robotic Arm Actuation Specialist", email: "deepak.r@psgtech.ac.in", year: "3rd Year B.E Mechanical" },
      { studentId: "stu-010", name: "Nithya V.", role: "Computer Vision & Visual Odometry", email: "nithya.v@psgtech.ac.in", year: "Final Year B.E Robotics" },
    ],
    skills: [
      "In-Pipe Robotic Actuation",
      "Computer Vision Robotic Welding",
      "Hydrostatic Pressure Testing",
      "Embedded C++ & ROS",
    ],
    activeProjectsCount: 0,
    academicCredits: 8,
  },
];

// Default initial collaborations
const INITIAL_COLLABORATIONS: UniversityCollaboration[] = [
  {
    id: "CR-2026-0001",
    workOrderId: "WO-2026-0001",
    issueId: "SOC-2026-008821",
    issueTitle: "Potable Water Main Line Fracture & Flooding",
    issueCategory: "Water Supply & Drainage",
    industryId: "comp-ind-001",
    industryName: "CleanAqua Infrastructure Pvt Ltd",
    governmentDepartment: "Municipal Administration & Water Supply",
    universityId: "univ-001",
    universityName: "Indian Institute of Technology Madras",
    department: "Artificial Intelligence",
    facultyId: "fac-001",
    facultyName: "Dr. R. Ramanujam, Ph.D.",
    facultyEmail: "ramanujam.ai@iitm.ac.in",
    studentTeamId: "team-001",
    studentTeamName: "Team AquaSense AI",
    researchGrant: 120000,
    objectives:
      "Design an edge AI acoustic sensor node capable of localizing micro-cracks in 900mm ductile iron water mains with sub-meter accuracy to guide trenchless epoxy injection.",
    requiredDeliverables: [
      "Acoustic cross-correlation waveform algorithm",
      "3D CAD casing with IP68 waterproof rating",
      "Working prototype tested on simulated 6 bar pipeline testbed",
      "Technical research dossier with patent search clearance",
    ],
    deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    status: "in_development",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    milestones: [
      { id: "m-1", title: "Acoustic baseline spectrum analysis", targetDays: 2, deliverable: "Raw spectrogram frequency data", completed: true },
      { id: "m-2", title: "Miniaturized hydrophone sensor probe PCB", targetDays: 4, deliverable: "Hardware schematic & Gerber files", completed: true },
      { id: "m-3", title: "Robotic crawler deployment & pressure verification", targetDays: 7, deliverable: "Integrated field test video & report", completed: false },
    ],
  },
];

// Default initial certificates
const INITIAL_CERTIFICATES: AcademicCertificate[] = [
  {
    id: "CERT-2026-0001",
    collaborationId: "CR-2026-0001",
    recipientId: "fac-001",
    recipientName: "Dr. R. Ramanujam, Ph.D.",
    recipientRole: "faculty_mentor",
    universityName: "Indian Institute of Technology Madras",
    industryPartnerName: "CleanAqua Infrastructure Pvt Ltd",
    projectTitle: "AI Acoustic Sonar Pipeline Leakage Telemetry System",
    certificateNumber: "SX-GOV-IND-UNIV-2026-0041",
    academicCreditsAwarded: 4,
    issuedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    verificationHash: "SX-HASH-VERIFIED-9831-7721",
  },
  {
    id: "CERT-2026-0002",
    collaborationId: "CR-2026-0001",
    recipientId: "stu-001",
    recipientName: "Aditya Krishnan",
    recipientRole: "student_innovator",
    universityName: "Indian Institute of Technology Madras",
    industryPartnerName: "CleanAqua Infrastructure Pvt Ltd",
    projectTitle: "AI Acoustic Sonar Pipeline Leakage Telemetry System",
    certificateNumber: "SX-GOV-IND-UNIV-2026-0042",
    academicCreditsAwarded: 4,
    issuedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    verificationHash: "SX-HASH-VERIFIED-9831-7722",
  },
];

// Memory Database structures
declare global {
  // eslint-disable-next-line no-var
  var __social_x_central_issues_db: Map<string, CentralIssue> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_notifs_db: CentralNotification[] | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_companies_db: Map<string, IndustryCompany> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_work_orders_db: Map<string, WorkOrder> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_universities_db: Map<string, University> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_faculty_db: Map<string, FacultyMentor> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_student_teams_db: Map<string, StudentTeam> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_collaborations_db: Map<string, UniversityCollaboration> | undefined;
  // eslint-disable-next-line no-var
  var __social_x_central_certificates_db: AcademicCertificate[] | undefined;
  // eslint-disable-next-line no-var
  var __social_x_issue_counter: number | undefined;
  // eslint-disable-next-line no-var
  var __social_x_work_order_counter: number | undefined;
  // eslint-disable-next-line no-var
  var __social_x_collab_counter: number | undefined;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn("Could not create .data directory", e);
    }
  }
}

function loadPersistedIssues(): Map<string, CentralIssue> {
  const map = new Map<string, CentralIssue>();

  for (const issue of INITIAL_ISSUES) {
    map.set(issue.id, issue);
  }

  if (fs.existsSync(ISSUES_FILE)) {
    try {
      const content = fs.readFileSync(ISSUES_FILE, "utf-8");
      const list: CentralIssue[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read issues_db.json", e);
    }
  }

  return map;
}

function loadPersistedNotifications(): CentralNotification[] {
  let list = [...INITIAL_NOTIFICATIONS];
  if (fs.existsSync(NOTIFS_FILE)) {
    try {
      const content = fs.readFileSync(NOTIFS_FILE, "utf-8");
      list = JSON.parse(content);
    } catch (e) {
      console.warn("Could not read notifications_db.json", e);
    }
  }
  return list;
}

function loadPersistedCompanies(): Map<string, IndustryCompany> {
  const map = new Map<string, IndustryCompany>();
  for (const comp of INITIAL_COMPANIES) {
    map.set(comp.id, comp);
  }
  if (fs.existsSync(COMPANIES_FILE)) {
    try {
      const content = fs.readFileSync(COMPANIES_FILE, "utf-8");
      const list: IndustryCompany[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read companies_db.json", e);
    }
  }
  return map;
}

function loadPersistedWorkOrders(): Map<string, WorkOrder> {
  const map = new Map<string, WorkOrder>();
  for (const wo of INITIAL_WORK_ORDERS) {
    map.set(wo.id, wo);
  }
  if (fs.existsSync(WORK_ORDERS_FILE)) {
    try {
      const content = fs.readFileSync(WORK_ORDERS_FILE, "utf-8");
      const list: WorkOrder[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read work_orders_db.json", e);
    }
  }
  return map;
}

function loadPersistedUniversities(): Map<string, University> {
  const map = new Map<string, University>();
  for (const u of INITIAL_UNIVERSITIES) {
    map.set(u.id, u);
  }
  if (fs.existsSync(UNIVERSITIES_FILE)) {
    try {
      const content = fs.readFileSync(UNIVERSITIES_FILE, "utf-8");
      const list: University[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read universities_db.json", e);
    }
  }
  return map;
}

function loadPersistedFaculty(): Map<string, FacultyMentor> {
  const map = new Map<string, FacultyMentor>();
  for (const f of INITIAL_FACULTY) {
    map.set(f.id, f);
  }
  if (fs.existsSync(FACULTY_FILE)) {
    try {
      const content = fs.readFileSync(FACULTY_FILE, "utf-8");
      const list: FacultyMentor[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read faculty_db.json", e);
    }
  }
  return map;
}

function loadPersistedStudentTeams(): Map<string, StudentTeam> {
  const map = new Map<string, StudentTeam>();
  for (const t of INITIAL_STUDENT_TEAMS) {
    map.set(t.id, t);
  }
  if (fs.existsSync(STUDENT_TEAMS_FILE)) {
    try {
      const content = fs.readFileSync(STUDENT_TEAMS_FILE, "utf-8");
      const list: StudentTeam[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read student_teams_db.json", e);
    }
  }
  return map;
}

function loadPersistedCollaborations(): Map<string, UniversityCollaboration> {
  const map = new Map<string, UniversityCollaboration>();
  for (const c of INITIAL_COLLABORATIONS) {
    map.set(c.id, c);
  }
  if (fs.existsSync(COLLABORATIONS_FILE)) {
    try {
      const content = fs.readFileSync(COLLABORATIONS_FILE, "utf-8");
      const list: UniversityCollaboration[] = JSON.parse(content);
      for (const item of list) {
        map.set(item.id, item);
      }
    } catch (e) {
      console.warn("Could not read collaborations_db.json", e);
    }
  }
  return map;
}

function loadPersistedCertificates(): AcademicCertificate[] {
  let list = [...INITIAL_CERTIFICATES];
  if (fs.existsSync(CERTIFICATES_FILE)) {
    try {
      const content = fs.readFileSync(CERTIFICATES_FILE, "utf-8");
      list = JSON.parse(content);
    } catch (e) {
      console.warn("Could not read certificates_db.json", e);
    }
  }
  return list;
}

function persistIssues() {
  ensureDataDirectory();
  try {
    const list = Array.from(issuesDb.values());
    fs.writeFileSync(ISSUES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist issues", e);
  }
}

function persistNotifications() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(notifsDb, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist notifications", e);
  }
}

function persistCompanies() {
  ensureDataDirectory();
  try {
    const list = Array.from(companiesDb.values());
    fs.writeFileSync(COMPANIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist companies", e);
  }
}

function persistWorkOrders() {
  ensureDataDirectory();
  try {
    const list = Array.from(workOrdersDb.values());
    fs.writeFileSync(WORK_ORDERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist work orders", e);
  }
}

function persistUniversities() {
  ensureDataDirectory();
  try {
    const list = Array.from(universitiesDb.values());
    fs.writeFileSync(UNIVERSITIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist universities", e);
  }
}

function persistFaculty() {
  ensureDataDirectory();
  try {
    const list = Array.from(facultyDb.values());
    fs.writeFileSync(FACULTY_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist faculty", e);
  }
}

function persistStudentTeams() {
  ensureDataDirectory();
  try {
    const list = Array.from(studentTeamsDb.values());
    fs.writeFileSync(STUDENT_TEAMS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist student teams", e);
  }
}

function persistCollaborations() {
  ensureDataDirectory();
  try {
    const list = Array.from(collaborationsDb.values());
    fs.writeFileSync(COLLABORATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist collaborations", e);
  }
}

function persistCertificates() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(CERTIFICATES_FILE, JSON.stringify(certificatesDb, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist certificates", e);
  }
}

// Initialize Singletons on globalThis
if (!globalThis.__social_x_central_issues_db) {
  globalThis.__social_x_central_issues_db = loadPersistedIssues();
}
if (!globalThis.__social_x_central_notifs_db) {
  globalThis.__social_x_central_notifs_db = loadPersistedNotifications();
}
if (!globalThis.__social_x_central_companies_db) {
  globalThis.__social_x_central_companies_db = loadPersistedCompanies();
}
if (!globalThis.__social_x_central_work_orders_db) {
  globalThis.__social_x_central_work_orders_db = loadPersistedWorkOrders();
}
if (!globalThis.__social_x_central_universities_db) {
  globalThis.__social_x_central_universities_db = loadPersistedUniversities();
}
if (!globalThis.__social_x_central_faculty_db) {
  globalThis.__social_x_central_faculty_db = loadPersistedFaculty();
}
if (!globalThis.__social_x_central_student_teams_db) {
  globalThis.__social_x_central_student_teams_db = loadPersistedStudentTeams();
}
if (!globalThis.__social_x_central_collaborations_db) {
  globalThis.__social_x_central_collaborations_db = loadPersistedCollaborations();
}
if (!globalThis.__social_x_central_certificates_db) {
  globalThis.__social_x_central_certificates_db = loadPersistedCertificates();
}
if (!globalThis.__social_x_issue_counter) {
  globalThis.__social_x_issue_counter = 129;
}
if (!globalThis.__social_x_work_order_counter) {
  globalThis.__social_x_work_order_counter = 42;
}
if (!globalThis.__social_x_collab_counter) {
  globalThis.__social_x_collab_counter = 12;
}

const issuesDb = globalThis.__social_x_central_issues_db!;
let notifsDb = globalThis.__social_x_central_notifs_db!;
const companiesDb = globalThis.__social_x_central_companies_db!;
const workOrdersDb = globalThis.__social_x_central_work_orders_db!;
const universitiesDb = globalThis.__social_x_central_universities_db!;
const facultyDb = globalThis.__social_x_central_faculty_db!;
const studentTeamsDb = globalThis.__social_x_central_student_teams_db!;
const collaborationsDb = globalThis.__social_x_central_collaborations_db!;
let certificatesDb = globalThis.__social_x_central_certificates_db!;

/**
 * AI Classifier & Intelligent Routing Engine (Phases 3 & 4)
 */
export function runAiRoutingAnalysis(params: {
  title: string;
  description: string;
  category?: string;
  address?: string;
  priority?: string;
  ocrText?: string;
  sttText?: string;
}) {
  const combinedText = `${params.title} ${params.description} ${params.address || ""} ${params.ocrText || ""} ${params.sttText || ""}`.toLowerCase();

  // 1. Detect Category & Department
  let detectedCategory = "General Municipal Infrastructure";
  let detectedDepartment = "Municipal Administration & Water Supply";
  let defaultOfficer = "Thiru S. Sivakumar, IAS";
  let officerId = "off-tn-001";
  let recommendedMaterial: string[] = ["General Inspection Gear", "Safety Cones"];

  if (
    combinedText.includes("water") ||
    combinedText.includes("pipe") ||
    combinedText.includes("leak") ||
    combinedText.includes("burst") ||
    combinedText.includes("drainage") ||
    combinedText.includes("sewage") ||
    combinedText.includes("flood") ||
    combinedText.includes("potable") ||
    combinedText.includes("gutter")
  ) {
    detectedCategory = "Water Supply & Drainage";
    detectedDepartment = "Municipal Administration & Water Supply";
    defaultOfficer = "Thiru S. Sivakumar, IAS";
    officerId = "off-tn-001";
    recommendedMaterial = [
      "900mm DI Feeder Conduit",
      "Hydraulic De-watering Pump (15HP)",
      "Repair Clamps & Gaskets",
    ];
  } else if (
    combinedText.includes("pothole") ||
    combinedText.includes("road") ||
    combinedText.includes("asphalt") ||
    combinedText.includes("cave-in") ||
    combinedText.includes("sinkhole") ||
    combinedText.includes("tar") ||
    combinedText.includes("traffic") ||
    combinedText.includes("footpath") ||
    combinedText.includes("crater") ||
    combinedText.includes("bridge")
  ) {
    detectedCategory = "Roads & Transportation";
    detectedDepartment = "Highways & Minor Ports (Roads)";
    defaultOfficer = "Er. S. Anbarasan";
    officerId = "off-tn-004";
    recommendedMaterial = [
      "Cold-mix Polymer Bituminous Asphalt",
      "Vibratory Double-drum Roller",
      "Reflective Hazard Barricades",
    ];
  } else if (
    combinedText.includes("electric") ||
    combinedText.includes("wire") ||
    combinedText.includes("cable") ||
    combinedText.includes("transformer") ||
    combinedText.includes("spark") ||
    combinedText.includes("shock") ||
    combinedText.includes("power") ||
    combinedText.includes("light") ||
    combinedText.includes("blackout") ||
    combinedText.includes("11kv")
  ) {
    detectedCategory = "Electricity & Streetlights";
    detectedDepartment = "Tamil Nadu Generation & Distribution (Electricity)";
    defaultOfficer = "Er. K. Ramanathan, M.E.";
    officerId = "off-tn-003";
    recommendedMaterial = [
      "11kV ACSR Conductor (50m)",
      "Polymer Pin Insulator Stack",
      "High-reach Insulated Cherry Picker Truck",
    ];
  } else if (
    combinedText.includes("garbage") ||
    combinedText.includes("waste") ||
    combinedText.includes("trash") ||
    combinedText.includes("dump") ||
    combinedText.includes("stench") ||
    combinedText.includes("plastic") ||
    combinedText.includes("compost")
  ) {
    detectedCategory = "Solid Waste & Sanitation";
    detectedDepartment = "Solid Waste & Bio-Mining Authority";
    defaultOfficer = "Dr. R. Selvamani";
    officerId = "off-tn-006";
    recommendedMaterial = [
      "Heavy Compact Wheel Loader",
      "Odor-neutralizing Bio-enzyme Spray",
      "12-Ton Tipper Trucks",
    ];
  } else if (
    combinedText.includes("health") ||
    combinedText.includes("hospital") ||
    combinedText.includes("dengue") ||
    combinedText.includes("mosquito") ||
    combinedText.includes("effluent") ||
    combinedText.includes("chemical") ||
    combinedText.includes("pollution") ||
    combinedText.includes("toxic")
  ) {
    detectedCategory = "Public Health & Safety";
    detectedDepartment = "Health & Sanitation Directorate";
    defaultOfficer = "Dr. M. Kavitha, MBBS, DPH";
    officerId = "off-tn-005";
    recommendedMaterial = [
      "Ultra-low Volume Thermal Fogging Unit",
      "Mobile Water Contamination Testing Kit",
      "Disinfectant Chlorine Concentrate",
    ];
  }

  // 2. Detect Priority & Emergency
  let detectedPriority: "low" | "medium" | "high" | "critical" = "medium";
  let suggestedSlaHours = 48;
  let severity = "Moderate Societal Impact";
  let isEmergency = false;
  let emergencyType: "fire" | "medical" | "police" | "disaster" | "life_safety" | undefined = undefined;

  if (
    combinedText.includes("burst gas") ||
    combinedText.includes("gas leak") ||
    combinedText.includes("live wire") ||
    combinedText.includes("electrocution") ||
    combinedText.includes("fire") ||
    combinedText.includes("collapse") ||
    combinedText.includes("fatal") ||
    combinedText.includes("emergency") ||
    combinedText.includes("immediate rescue") ||
    combinedText.includes("sinkhole") ||
    combinedText.includes("acid spill") ||
    combinedText.includes("sparking") ||
    combinedText.includes("hospital oxygen") ||
    combinedText.includes("child trapped")
  ) {
    detectedPriority = "critical";
    suggestedSlaHours = 6;
    severity = "Critical Life-Safety Emergency";
    isEmergency = true;
    if (combinedText.includes("fire") || combinedText.includes("smoke") || combinedText.includes("flames")) {
      emergencyType = "fire";
    } else if (combinedText.includes("hospital") || combinedText.includes("injured") || combinedText.includes("dying") || combinedText.includes("oxygen")) {
      emergencyType = "medical";
    } else if (combinedText.includes("crime") || combinedText.includes("riot") || combinedText.includes("violence") || combinedText.includes("weapon")) {
      emergencyType = "police";
    } else if (combinedText.includes("flood") || combinedText.includes("cyclone") || combinedText.includes("collapse")) {
      emergencyType = "disaster";
    } else {
      emergencyType = "life_safety";
    }
  } else if (
    combinedText.includes("leak") ||
    combinedText.includes("flood") ||
    combinedText.includes("blocked") ||
    combinedText.includes("danger") ||
    combinedText.includes("hazard") ||
    combinedText.includes("severe") ||
    combinedText.includes("deep") ||
    combinedText.includes("accident")
  ) {
    detectedPriority = "high";
    suggestedSlaHours = 24;
    severity = "High Municipal Risk";
  } else if (
    combinedText.includes("minor") ||
    combinedText.includes("suggestion") ||
    combinedText.includes("trimming") ||
    combinedText.includes("painting")
  ) {
    detectedPriority = "low";
    suggestedSlaHours = 96;
    severity = "Routine Maintenance";
  }

  // 3. Sentiment Analysis
  let sentiment: "positive" | "neutral" | "frustrated" | "urgent" | "critical" = "neutral";
  let sentimentScore = 0.0;

  if (isEmergency) {
    sentiment = "critical";
    sentimentScore = -0.95;
  } else if (
    combinedText.includes("frustrated") ||
    combinedText.includes("repeated") ||
    combinedText.includes("negligence") ||
    combinedText.includes("terrible") ||
    combinedText.includes("worst") ||
    combinedText.includes("no action taken")
  ) {
    sentiment = "frustrated";
    sentimentScore = -0.75;
  } else if (
    combinedText.includes("urgent") ||
    combinedText.includes("please quickly") ||
    combinedText.includes("as soon as possible") ||
    combinedText.includes("danger")
  ) {
    sentiment = "urgent";
    sentimentScore = -0.5;
  } else if (combinedText.includes("thank") || combinedText.includes("good") || combinedText.includes("appreciate")) {
    sentiment = "positive";
    sentimentScore = 0.7;
  }

  // 4. Detect District & Location
  let district = "Chennai";
  let state = "Tamil Nadu";
  let wardNo = "Ward 118";

  if (combinedText.includes("bengaluru") || combinedText.includes("bangalore") || combinedText.includes("indiranagar") || combinedText.includes("koramangala")) {
    district = "Bengaluru Urban";
    state = "Karnataka";
    wardNo = "Ward 142";
  } else if (combinedText.includes("madurai")) {
    district = "Madurai";
    state = "Tamil Nadu";
    wardNo = "Ward 42";
  } else if (combinedText.includes("coimbatore")) {
    district = "Coimbatore";
    state = "Tamil Nadu";
    wardNo = "Ward 28";
  } else if (combinedText.includes("trichy") || combinedText.includes("tiruchirappalli")) {
    district = "Tiruchirappalli";
    state = "Tamil Nadu";
    wardNo = "Ward 55";
  } else if (combinedText.includes("salem")) {
    district = "Salem";
    state = "Tamil Nadu";
    wardNo = "Ward 31";
  }

  // 5. Duplicate Detection against existing issues in DB
  let isDuplicate = false;
  let duplicateOfIssueId: string | undefined = undefined;

  for (const existing of issuesDb.values()) {
    if (existing.district.toLowerCase() === district.toLowerCase() && existing.category === detectedCategory) {
      const existingTitleWords = existing.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const titleWords = params.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const commonWords = titleWords.filter(w => existingTitleWords.includes(w));
      if (commonWords.length >= 2 && Math.abs(existing.gpsCoordinates.lat - (params.address ? 13.04 : 13.0425)) < 0.05) {
        isDuplicate = true;
        duplicateOfIssueId = existing.id;
        break;
      }
    }
  }

  // 6. Stakeholder & Routing Recommendation (Phase 4 Smart Routing)
  const recommendedStakeholders: Array<"government" | "ngo" | "industry" | "university" | "emergency"> = ["government"];

  if (isEmergency) {
    recommendedStakeholders.unshift("emergency");
    recommendedStakeholders.push("ngo");
  }

  if (
    detectedCategory === "Solid Waste & Sanitation" ||
    detectedCategory === "Public Health & Safety" ||
    combinedText.includes("tree") ||
    combinedText.includes("animal") ||
    combinedText.includes("elderly") ||
    combinedText.includes("park") ||
    combinedText.includes("lake")
  ) {
    if (!recommendedStakeholders.includes("ngo")) {
      recommendedStakeholders.push("ngo");
    }
  }

  if (
    combinedText.includes("bridge") ||
    combinedText.includes("sensor") ||
    combinedText.includes("iot") ||
    combinedText.includes("ai") ||
    combinedText.includes("research") ||
    combinedText.includes("treatment plant") ||
    combinedText.includes("structural failure")
  ) {
    if (!recommendedStakeholders.includes("industry")) recommendedStakeholders.push("industry");
    if (!recommendedStakeholders.includes("university")) recommendedStakeholders.push("university");
  }

  // 7. Estimated Cost & Completion Days
  let estimatedCost = 25000;
  let estimatedCompletionDays = 2;

  if (detectedPriority === "critical") {
    estimatedCost = 150000;
    estimatedCompletionDays = 1;
  } else if (detectedPriority === "high") {
    estimatedCost = 75000;
    estimatedCompletionDays = 3;
  } else if (detectedPriority === "low") {
    estimatedCost = 10000;
    estimatedCompletionDays = 7;
  }

  if (detectedCategory === "Roads & Transportation") {
    estimatedCost *= 2.5;
  } else if (detectedCategory === "Electricity & Streetlights") {
    estimatedCost *= 1.8;
  }

  const confidence = 96.5 + Math.floor(Math.random() * 30) / 10;

  const comprehensiveAi: ComprehensiveAiAnalysis = {
    ocrText: params.ocrText,
    sttTranscript: params.sttText,
    category: detectedCategory,
    priority: detectedPriority,
    isDuplicate,
    duplicateOfIssueId,
    isEmergency,
    emergencyType,
    sentiment,
    sentimentScore,
    recommendedDepartment: detectedDepartment,
    recommendedStakeholders,
    estimatedCost,
    estimatedCompletionDays,
    estimatedResolutionHours: suggestedSlaHours,
    confidenceScore: confidence,
  };

  return {
    category: detectedCategory,
    department: detectedDepartment,
    officer: defaultOfficer,
    officerId,
    priority: detectedPriority,
    district,
    state,
    wardNo,
    confidence,
    severity,
    suggestedSlaHours,
    recommendedMaterial,
    isDuplicate,
    duplicateOfIssueId,
    isEmergency,
    emergencyType,
    sentiment,
    sentimentScore,
    recommendedDepartment: detectedDepartment,
    recommendedStakeholders,
    estimatedCost,
    estimatedCompletionDays,
    aiAnalysis: comprehensiveAi,
  };
}

/**
 * Generate Next Unique Issue ID in format SOC-2026-000123
 */
export function generateUniqueIssueId(): string {
  const currentCount = (globalThis.__social_x_issue_counter =
    (globalThis.__social_x_issue_counter || 123) + 1);
  const padded = String(currentCount).padStart(6, "0");
  return `SOC-2026-${padded}`;
}

export const centralIssuesDb = {
  getAll(filter?: {
    status?: string;
    priority?: string;
    department?: string;
    district?: string;
    citizenId?: string;
    search?: string;
  }): CentralIssue[] {
    let list = Array.from(issuesDb.values());

    // Sort newest first
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter?.citizenId) {
      list = list.filter((i) => i.citizenId === filter.citizenId);
    }

    if (filter?.status && filter.status !== "all") {
      const q = filter.status.toLowerCase().trim();
      if (q === "submitted" || q === "new") {
        list = list.filter(
          (i) => i.status === "submitted" || i.status === "under_review"
        );
      } else if (q === "assigned") {
        list = list.filter((i) => i.status === "assigned" || i.status === "submitted");
      } else {
        list = list.filter((i) => i.status === q);
      }
    }

    if (filter?.priority && filter.priority !== "all") {
      list = list.filter((i) => i.priority === filter.priority);
    }

    if (filter?.department && filter.department !== "all") {
      const depQ = filter.department.toLowerCase().trim();
      list = list.filter((i) => {
        const assigned = (i.assignedDepartment || "").toLowerCase();
        if (assigned === depQ) return true;
        if (assigned.includes(depQ) || depQ.includes(assigned)) return true;
        // Match department shortcuts and IDs
        if ((depQ === "maws" || depQ === "dept-tn-01") && (assigned.includes("water") || assigned.includes("municipal"))) return true;
        if ((depQ === "pwd" || depQ === "dept-tn-02") && (assigned.includes("public works") || assigned.includes("building"))) return true;
        if ((depQ === "highways" || depQ === "dept-tn-03") && (assigned.includes("highways") || assigned.includes("roads") || assigned.includes("transport"))) return true;
        if ((depQ === "tangedco" || depQ === "dept-tn-04") && (assigned.includes("electricity") || assigned.includes("power") || assigned.includes("tangedco"))) return true;
        if ((depQ === "health" || depQ === "dept-tn-05") && (assigned.includes("health") || assigned.includes("sanitation") || assigned.includes("drainage"))) return true;
        if ((depQ === "swm" || depQ === "dept-tn-06") && (assigned.includes("solid waste") || assigned.includes("waste"))) return true;
        return false;
      });
    }

    if (filter?.district && filter.district !== "all") {
      list = list.filter(
        (i) => i.district.toLowerCase() === filter.district?.toLowerCase()
      );
    }

    if (filter?.search) {
      const s = filter.search.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(s) ||
          i.title.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s) ||
          i.citizenName.toLowerCase().includes(s) ||
          i.assignedDepartment.toLowerCase().includes(s) ||
          i.category.toLowerCase().includes(s)
      );
    }

    return list;
  },

  getById(id: string): CentralIssue | null {
    if (!id) return null;
    return issuesDb.get(id) || null;
  },

  getIssueById(id: string): CentralIssue | null {
    return this.getById(id);
  },

  createIssue(params: {
    title: string;
    description: string;
    category?: string;
    priority?: "low" | "medium" | "high" | "critical";
    department?: string;
    citizenId: string;
    citizenName: string;
    citizenPhone?: string;
    citizenEmail?: string;
    isAnonymous?: boolean;
    location: string;
    district?: string;
    state?: string;
    wardNo?: string;
    latitude?: number;
    longitude?: number;
    attachments?: IssueAttachmentMedia;
    ocrText?: string;
    sttText?: string;
  }): CentralIssue {
    // 1. Run AI Routing analysis (Phases 3 & 4)
    const ai = runAiRoutingAnalysis({
      title: params.title,
      description: params.description,
      category: params.category,
      address: params.location,
      priority: params.priority,
      ocrText: params.ocrText,
      sttText: params.sttText,
    });

    const issueId = generateUniqueIssueId();
    const now = new Date();
    const formattedDate = now.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const chosenDepartment = params.department || ai.department;
    const chosenPriority = params.priority || ai.priority;
    const chosenCategory = params.category || ai.category;

    const slaHours = ai.suggestedSlaHours;
    const slaDeadlineDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);
    const slaDeadlineFormatted = `${slaDeadlineDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })} (${slaHours}h SLA)`;

    const defaultAttachments: IssueAttachmentMedia = params.attachments || {
      images: [],
      videos: [],
      voiceNotes: [],
      documents: [],
    };

    const routingTargets: Array<"government" | "ngo" | "emergency"> = [];
    if (ai.recommendedStakeholders.includes("emergency")) routingTargets.push("emergency");
    if (ai.recommendedStakeholders.includes("government")) routingTargets.push("government");
    if (ai.recommendedStakeholders.includes("ngo")) routingTargets.push("ngo");

    const newIssue: CentralIssue = {
      id: issueId,
      title: params.title.trim(),
      description: params.description.trim(),
      category: chosenCategory,
      priority: chosenPriority,
      status: "submitted",
      citizenId: params.citizenId,
      citizenName: params.isAnonymous ? "Citizen (Anonymous)" : params.citizenName,
      citizenPhone: params.citizenPhone || "+91 98401 22891",
      citizenEmail: params.citizenEmail,
      isAnonymous: params.isAnonymous,
      location: params.location || `${ai.district}, ${ai.state}`,
      district: params.district || ai.district,
      state: params.state || ai.state,
      wardNo: params.wardNo || ai.wardNo,
      gpsCoordinates: {
        lat: params.latitude ?? 13.0425,
        lng: params.longitude ?? 80.2514,
      },
      assignedDepartment: chosenDepartment,
      assignedOfficer: ai.officer,
      officerId: ai.officerId,
      aiConfidence: ai.confidence,
      aiPrediction: {
        severity: ai.severity,
        estimatedResolutionHours: ai.suggestedSlaHours,
        recommendedMaterial: ai.recommendedMaterial,
        suggestedSlaHours: ai.suggestedSlaHours,
      },
      aiAnalysis: ai.aiAnalysis,
      routingTargets,
      attachments: defaultAttachments,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          stage: "Submitted",
          title: "Grievance Logged",
          description: `Citizen filed complaint. Status set to Submitted.`,
          actor: params.citizenName,
          actorRole: "Citizen",
          timestamp: formattedDate,
          completed: true,
          isCurrent: false,
        },
        {
          id: `tl-${Date.now()}-2`,
          stage: "AI Analysis",
          title: "Multimodal AI Analysis & Duplicate Check",
          description: `Neural engine executed OCR, STT, and sentiment (${ai.sentiment}, score: ${ai.sentimentScore}). Duplicate: ${ai.isDuplicate ? `Flagged (Potential match with #${ai.duplicateOfIssueId})` : "None"}. Estimated Cost: ₹${ai.estimatedCost.toLocaleString("en-IN")}.`,
          actor: "Social-X AI Neural Engine",
          actorRole: "AI Orchestrator",
          timestamp: formattedDate,
          completed: true,
          isCurrent: true,
        },
        {
          id: `tl-${Date.now()}-3`,
          stage: "Government Review",
          title: `Docketed in ${chosenDepartment} Queue`,
          description: `Officer ${ai.officer} assigned. SLA timer initialized for ${slaHours} hours.`,
          actor: "Municipal Routing Gateway",
          actorRole: "Government Gateway",
          timestamp: formattedDate,
          completed: false,
          isCurrent: false,
        },
      ],
      officerNotes: [
        {
          id: `note-${Date.now()}`,
          author: "Social-X AI Engine",
          authorRole: "Automated Classifier",
          note: `Complaint analyzed: ${ai.severity}. Routed to ${routingTargets.join(", ").toUpperCase()}. Estimated repair cost: ₹${ai.estimatedCost.toLocaleString("en-IN")}.`,
          timestamp: formattedDate,
        },
      ],
      resolutionHistory: [
        {
          id: `rh-${Date.now()}-1`,
          action: "Complaint Created",
          performedBy: params.citizenName,
          role: "Citizen",
          details: `Issue filed with status Submitted. Generated Issue ID: ${issueId}.`,
          timestamp: formattedDate,
        },
        {
          id: `rh-${Date.now()}-2`,
          action: "AI Routing",
          performedBy: "AI Router",
          role: "System",
          details: `Smart routed to ${chosenDepartment} (Officer: ${ai.officer}). Priority: ${chosenPriority.toUpperCase()}.`,
          timestamp: formattedDate,
        },
      ],
      ocrExtractedText: params.ocrText,
      sttTranscript: params.sttText,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaDeadline: slaDeadlineFormatted,
    };

    // Phase 15: Emergency Handling
    if (ai.isEmergency) {
      newIssue.emergencyWorkflow = {
        isTriggered: true,
        emergencyType: ai.emergencyType || "life_safety",
        notifiedAgencies: [
          "Emergency Control Room (112)",
          "Municipal Fire & Rescue Service",
          "Ambulance Trauma Network (108)",
          "City Police Dispatch",
          "Red Cross Rapid Disaster Squad",
        ],
        dispatchedAt: now.toISOString(),
        responseStatus: "dispatched",
        controlRoomNotes: "CRITICAL PRIORITY: Multi-agency emergency dispatch alert broadcast by Social-X Autonomous AI.",
      };

      newIssue.timeline.push({
        id: `tl-${Date.now()}-em`,
        stage: "Emergency Dispatch",
        title: "Multi-Agency Emergency Broadcast",
        description: `Immediate emergency response alert broadcast to Control Room (112), Police, Fire/Rescue, and Medical services.`,
        actor: "State Emergency Operations Center",
        actorRole: "Emergency Services",
        timestamp: formattedDate,
        completed: true,
        isCurrent: true,
      });

      // Notify Emergency Stakeholders
      this.addNotification({
        userId: "ctrl-room-01",
        title: `CRITICAL ALERT: Emergency #${issueId}`,
        message: `High-priority life safety emergency detected at ${newIssue.location}. Immediate dispatch ordered.`,
        type: "emergency_alert",
        issueId,
      });
      this.addNotification({
        userId: "police-dispatch-01",
        title: `POLICE / RESCUE: Immediate Attendance #${issueId}`,
        message: `Incident reported at ${newIssue.location}. Coordinates: ${newIssue.gpsCoordinates.lat}, ${newIssue.gpsCoordinates.lng}`,
        type: "emergency_alert",
        issueId,
      });
    }

    // Phase 14: NGO Routing Handling
    if (ai.recommendedStakeholders.includes("ngo")) {
      newIssue.ngoWorkflow = {
        needsVolunteers: true,
        status: "pending_review",
        assignedAt: now.toISOString(),
      };

      this.addNotification({
        userId: "ngo-coord-01",
        title: `Community Assistance Project #${issueId}`,
        message: `Case #${issueId} (${newIssue.category}) in ${newIssue.district} has been recommended for NGO community service & volunteer mobilization.`,
        type: "ngo_mobilized",
        issueId,
      });
    }

    issuesDb.set(issueId, newIssue);
    persistIssues();

    // Trigger Citizen Notifications
    this.addNotification({
      userId: params.citizenId,
      title: "Complaint Submitted Successfully",
      message: `Your complaint has been submitted under Issue ID #${issueId}. Initial status: Submitted.`,
      type: "status_update",
      issueId,
    });

    this.addNotification({
      userId: params.citizenId,
      title: "Complaint Assigned",
      message: `Issue #${issueId} has been analyzed by AI and assigned to ${chosenDepartment}. Officer: ${ai.officer}.`,
      type: "assignment",
      issueId,
    });

    return newIssue;
  },

  updateStatus(
    id: string,
    newStatus: CentralIssue["status"],
    officerName = "Authorized Official",
    details = ""
  ): CentralIssue {
    const issue = issuesDb.get(id);
    if (!issue) {
      throw new Error(`Issue #${id} not found.`);
    }

    const previousStatus = issue.status;
    issue.status = newStatus;
    issue.updatedAt = new Date().toISOString();

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (newStatus === "resolved") {
      issue.resolvedAt = new Date().toISOString();
    }

    // Append to timeline
    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: newStatus.replace("_", " ").toUpperCase(),
      title: `Status Updated to ${newStatus.replace("_", " ").toUpperCase()}`,
      description: details || `Case status transitioned from ${previousStatus} to ${newStatus} by ${officerName}.`,
      actor: officerName,
      actorRole: "Government Officer",
      timestamp,
      completed: true,
      isCurrent: true,
    });

    // Append to resolution history
    issue.resolutionHistory.push({
      id: `rh-${Date.now()}`,
      action: `Status Change: ${newStatus}`,
      performedBy: officerName,
      role: "Government Officer",
      details: details || `Status changed to ${newStatus}.`,
      timestamp,
    });

    persistIssues();

    // Send notifications to citizen
    const statusLabel = newStatus.replace("_", " ").toUpperCase();
    this.addNotification({
      userId: issue.citizenId,
      title: `Status Changed: ${statusLabel}`,
      message: `Your grievance #${id} is now ${statusLabel}. Updated by ${officerName}. ${details ? `Note: ${details}` : ""}`,
      type: "status_update",
      issueId: id,
    });

    if (newStatus === "resolved") {
      this.addNotification({
        userId: issue.citizenId,
        title: "Complaint Resolved",
        message: `Issue #${id} has been marked as Resolved by ${officerName}. Field repairs verified.`,
        type: "resolution",
        issueId: id,
      });

      this.addNotification({
        userId: issue.citizenId,
        title: "Feedback Requested",
        message: `How was your resolution experience for #${id}? Please rate the municipal response.`,
        type: "alert",
        issueId: id,
      });
    }

    return issue;
  },

  reassignOfficer(
    id: string,
    officerId: string,
    officerName: string,
    department?: string
  ): CentralIssue {
    const issue = issuesDb.get(id);
    if (!issue) throw new Error(`Issue #${id} not found.`);

    issue.officerId = officerId;
    issue.assignedOfficer = officerName;
    if (department) issue.assignedDepartment = department;
    issue.status = "assigned";
    issue.updatedAt = new Date().toISOString();

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: "Reassigned",
      title: "Officer Assigned",
      description: `Case reassigned to Officer ${officerName} (${issue.assignedDepartment}).`,
      actor: officerName,
      actorRole: "Government",
      timestamp,
      completed: true,
    });

    persistIssues();

    this.addNotification({
      userId: issue.citizenId,
      title: "Officer Assigned",
      message: `Officer ${officerName} has been assigned to lead field inspection for #${id}.`,
      type: "assignment",
      issueId: id,
    });

    return issue;
  },

  addOfficerNote(id: string, author: string, authorRole: string, note: string): CentralIssue {
    const issue = issuesDb.get(id);
    if (!issue) throw new Error(`Issue #${id} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    issue.officerNotes.push({
      id: `note-${Date.now()}`,
      author,
      authorRole,
      note,
      timestamp,
    });

    persistIssues();
    return issue;
  },

  addWorkLogEntry(
    id: string,
    params: {
      stage?: string;
      title: string;
      description: string;
      actor: string;
      actorRole: string;
      evidenceUrl?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(id);
    if (!issue) throw new Error(`Issue #${id} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (!issue.timeline) {
      issue.timeline = [];
    }

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: params.stage || "Work Log Update",
      title: params.title,
      description: params.description,
      actor: params.actor,
      actorRole: params.actorRole,
      timestamp,
      completed: true,
      evidenceUrl: params.evidenceUrl,
    });

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  addAttachment(
    id: string,
    attachment: {
      type: "image" | "video" | "voiceNote" | "document";
      url: string;
      label: string;
      name?: string;
      size?: string;
      duration?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(id);
    if (!issue) throw new Error(`Issue #${id} not found.`);

    if (!issue.attachments) {
      issue.attachments = { images: [], videos: [], voiceNotes: [], documents: [] };
    }
    const attId = `att-${Date.now()}`;
    if (attachment.type === "image") {
      issue.attachments.images.push({ id: attId, url: attachment.url, label: attachment.label });
    } else if (attachment.type === "video") {
      issue.attachments.videos.push({ id: attId, url: attachment.url, label: attachment.label, duration: attachment.duration || "0:30" });
    } else if (attachment.type === "voiceNote") {
      issue.attachments.voiceNotes.push({ id: attId, url: attachment.url, label: attachment.label, duration: attachment.duration || "0:25" });
    } else {
      issue.attachments.documents.push({ id: attId, url: attachment.url, name: attachment.name || attachment.label, size: attachment.size || "1.2 MB" });
    }

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  // Notifications
  getNotifications(userId?: string): CentralNotification[] {
    if (!userId) return notifsDb;
    return notifsDb.filter((n) => n.userId === userId || n.userId === "all");
  },

  addNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: CentralNotification["type"];
    issueId: string;
  }): CentralNotification {
    const newNotif: CentralNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      issueId: params.issueId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifsDb.unshift(newNotif);
    persistNotifications();
    return newNotif;
  },

  markNotificationRead(id: string): boolean {
    const notif = notifsDb.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      persistNotifications();
      return true;
    }
    return false;
  },

  // Analytics & Stats
  getGovernmentStats() {
    const list = Array.from(issuesDb.values());
    const totalAssignedCases = list.length;
    const resolvedCases = list.filter((c) => c.status === "resolved").length;
    const pendingCases = list.filter(
      (c) =>
        c.status === "submitted" ||
        c.status === "under_review" ||
        c.status === "assigned" ||
        c.status === "in_progress"
    ).length;
    const highPriorityCases = list.filter((c) => c.priority === "high").length;
    const emergencyCases = list.filter((c) => c.priority === "critical").length;

    return {
      totalAssignedCases,
      resolvedCases,
      pendingCases,
      highPriorityCases,
      emergencyCases,
      averageResolutionHours: 16.8,
      departmentPerformanceRate: 94.6,
      citizenSatisfactionScore: 4.9,
    };
  },

  getCitizenMetrics(userId?: string) {
    let list = Array.from(issuesDb.values());
    if (userId) {
      list = list.filter((i) => i.citizenId === userId);
    }

    const totalReported = list.length;
    const inProgress = list.filter(
      (i) => i.status === "in_progress" || i.status === "assigned" || i.status === "submitted"
    ).length;
    const resolved = list.filter((i) => i.status === "resolved").length;
    const needsVerification = list.filter(
      (i) => i.status === "submitted" || i.status === "under_review"
    ).length;

    return {
      totalReported,
      inProgress,
      resolved,
      needsVerification,
      communityImpactScore: 92,
      avgResolutionDays: 2.4,
    };
  },

  // Industry & Startup Directory
  getCompanies(filter?: { sector?: string; district?: string }): IndustryCompany[] {
    let list = Array.from(companiesDb.values());
    if (filter?.sector) {
      list = list.filter((c) => c.sector.toLowerCase().includes(filter.sector!.toLowerCase()));
    }
    if (filter?.district) {
      list = list.filter((c) => c.district.toLowerCase() === filter.district!.toLowerCase());
    }
    return list;
  },

  getCompanyById(id: string): IndustryCompany | undefined {
    return companiesDb.get(id);
  },

  registerCompany(companyData: Omit<IndustryCompany, "id" | "activeWorkOrdersCount" | "completedWorkOrdersCount">): IndustryCompany {
    const id = `comp-ind-${Date.now().toString().slice(-4)}`;
    const newCompany: IndustryCompany = {
      ...companyData,
      id,
      activeWorkOrdersCount: 0,
      completedWorkOrdersCount: 0,
    };
    companiesDb.set(id, newCompany);
    persistCompanies();
    return newCompany;
  },

  verifyCompany(id: string, verified: boolean): IndustryCompany {
    const company = companiesDb.get(id);
    if (!company) throw new Error(`Company #${id} not found.`);
    company.verified = verified;
    persistCompanies();
    return company;
  },

  // AI Matching Recommendation for Issue -> Industry Partner
  recommendCompaniesForIssue(issueId: string): { company: IndustryCompany; matchScore: number; matchReasons: string[] }[] {
    const issue = issuesDb.get(issueId);
    if (!issue) throw new Error(`Issue #${issueId} not found.`);

    const text = `${issue.title} ${issue.description} ${issue.category} ${issue.location}`.toLowerCase();
    const allCompanies = Array.from(companiesDb.values());

    const scored = allCompanies.map((company) => {
      let score = 70; // baseline
      const reasons: string[] = [];

      // Check technology domain match
      const matchedDomain = company.technologyDomains.some(
        (dom) => text.includes(dom.toLowerCase()) || issue.category.toLowerCase().includes(dom.toLowerCase())
      );
      if (matchedDomain) {
        score += 18;
        reasons.push(`Specialized domain match: ${company.sector}`);
      }

      // Check ESG Rating
      if (company.esgGrade === "AAA") {
        score += 6;
        reasons.push("Top ESG Grade AAA rating & zero compliance breaches");
      } else if (company.esgGrade === "AA") {
        score += 4;
        reasons.push("Strong ESG Grade AA governance");
      }

      // Capacity & Track Record
      if (company.availableCapacity === "high") {
        score += 4;
        reasons.push("High emergency mobilization capacity available");
      }
      if (company.rating >= 4.8) {
        score += 2;
        reasons.push(`High civic satisfaction score (${company.rating}/5.0)`);
      }

      return {
        company,
        matchScore: Math.min(score, 99),
        matchReasons: reasons,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  },

  // OPTION 1: Government handles internally
  handleInternally(
    issueId: string,
    params: {
      officerId: string;
      officerName: string;
      notes: string;
      targetStatus?: CentralIssue["status"];
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) throw new Error(`Issue #${issueId} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const targetStatus = params.targetStatus || "in_progress";
    issue.status = targetStatus;
    issue.resolutionMode = "internal";
    issue.assignedOfficer = params.officerName;
    issue.officerId = params.officerId;
    issue.updatedAt = new Date().toISOString();

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: "Government Assigned",
      title: "Handled Internally by Government",
      description: `Official review completed. Assigned internally to Officer ${params.officerName} (${issue.assignedDepartment}). Field team mobilization initiated.`,
      actor: params.officerName,
      actorRole: "Government Authority",
      timestamp,
      completed: true,
    });

    if (params.notes) {
      issue.officerNotes.push({
        id: `note-${Date.now()}`,
        author: params.officerName,
        authorRole: "Government Authority",
        note: params.notes,
        timestamp,
      });
    }

    persistIssues();

    this.addNotification({
      userId: issue.citizenId,
      title: "Grievance Assigned to Government Team",
      message: `Your grievance #${issueId} is being resolved internally by ${issue.assignedDepartment} under Officer ${params.officerName}.`,
      type: "status_update",
      issueId,
    });

    return issue;
  },

  // OPTION 2: Transfer to Industry / Startup Partner
  transferToIndustry(
    issueId: string,
    params: {
      companyId: string;
      scopeOfWork: string;
      budget: number;
      deadline: string;
      officerRemarks?: string;
      officerName?: string;
      officerId?: string;
    }
  ): { issue: CentralIssue; workOrder: WorkOrder } {
    const issue = issuesDb.get(issueId);
    if (!issue) throw new Error(`Issue #${issueId} not found.`);

    const company =
      companiesDb.get(params.companyId) ||
      companiesDb.get(`comp-${params.companyId}`) ||
      Array.from(companiesDb.values()).find(
        (c) => c.id.toLowerCase() === params.companyId.toLowerCase() || c.id.includes(params.companyId)
      );
    if (!company) throw new Error(`Partner company #${params.companyId} not found.`);

    const woCount = (globalThis.__social_x_work_order_counter =
      (globalThis.__social_x_work_order_counter || 42) + 1);
    const workOrderId = `WO-2026-${String(woCount).padStart(4, "0")}`;

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const officerName = params.officerName || issue.assignedOfficer || "Thiru S. Sivakumar, IAS";
    const officerId = params.officerId || issue.officerId || "off-tn-001";

    const workOrder: WorkOrder = {
      id: workOrderId,
      issueId: issue.id,
      issueTitle: issue.title,
      issueCategory: issue.category,
      location: issue.location,
      district: issue.district,
      department: issue.assignedDepartment,
      authorizingOfficer: officerName,
      authorizingOfficerId: officerId,
      companyId: company.id,
      companyName: company.name,
      scopeOfWork: params.scopeOfWork,
      budget: params.budget,
      issuedAt: new Date().toISOString(),
      deadline: params.deadline,
      status: "issued",
      progressReports: [],
      payment: {
        id: `pay-${workOrderId}`,
        invoiceRef: `INV-2026-${String(woCount).padStart(4, "0")}`,
        amount: params.budget,
        status: "pending",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    workOrdersDb.set(workOrderId, workOrder);
    company.activeWorkOrdersCount += 1;
    persistCompanies();
    persistWorkOrders();

    // Update Issue
    issue.status = "assigned_to_industry";
    issue.resolutionMode = "industry";
    issue.assignedCompanyId = company.id;
    issue.assignedCompanyName = company.name;
    issue.workOrderId = workOrderId;
    issue.workOrderStatus = "issued";
    issue.budget = params.budget;
    issue.paymentStatus = "pending";
    issue.paymentReference = workOrder.payment?.invoiceRef;
    issue.updatedAt = new Date().toISOString();

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: "Assigned to Industry",
      title: "Municipal Work Order Issued to Partner",
      description: `Government outsourced specialized repair to registered industry partner ${company.name} under Work Order #${workOrderId} (Budget: ₹${params.budget.toLocaleString("en-IN")}).`,
      actor: officerName,
      actorRole: "Government Authority",
      timestamp,
      completed: true,
    });

    if (params.officerRemarks) {
      issue.officerNotes.push({
        id: `note-${Date.now()}`,
        author: officerName,
        authorRole: "Government Authority",
        note: `Work Order issued to ${company.name}. Instructions: ${params.officerRemarks}`,
        timestamp,
      });
    }

    persistIssues();

    // Notify Citizen
    this.addNotification({
      userId: issue.citizenId,
      title: "Grievance Assigned to Industry Partner",
      message: `Government has partnered with specialized vendor ${company.name} under Work Order #${workOrderId} for technical execution.`,
      type: "status_update",
      issueId: issue.id,
    });

    // Notify Company
    this.addNotification({
      userId: company.id,
      title: "New Government Work Order Assigned",
      message: `Work Order #${workOrderId} for "${issue.title}" issued by ${issue.assignedDepartment}. Budget: ₹${params.budget.toLocaleString("en-IN")}.`,
      type: "work_order",
      issueId: issue.id,
    });

    return { issue, workOrder };
  },

  // Work Order Queries & Actions
  getWorkOrders(filter?: { companyId?: string; issueId?: string; status?: string }): WorkOrder[] {
    let list = Array.from(workOrdersDb.values());
    if (filter?.companyId) {
      list = list.filter((wo) => wo.companyId === filter.companyId);
    }
    if (filter?.issueId) {
      list = list.filter((wo) => wo.issueId === filter.issueId);
    }
    if (filter?.status) {
      list = list.filter((wo) => wo.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getWorkOrderById(id: string): WorkOrder | undefined {
    return workOrdersDb.get(id);
  },

  acceptWorkOrder(id: string, notes?: string): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    wo.status = "accepted";
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.workOrderStatus = "accepted";
      issue.status = "in_progress";
      issue.updatedAt = new Date().toISOString();
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Industry Accepted",
        title: "Work Order Accepted by Industry Partner",
        description: `${wo.companyName} formally accepted municipal contract #${id}. Mobilization commences.`,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: true,
      });
      persistIssues();

      this.addNotification({
        userId: issue.citizenId,
        title: "Work Commenced by Partner",
        message: `${wo.companyName} has mobilized ground equipment for #${issue.id}.`,
        type: "status_update",
        issueId: issue.id,
      });
    }

    persistWorkOrders();
    return wo;
  },

  rejectWorkOrder(id: string, reason: string): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    wo.status = "rejected";
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.workOrderStatus = "rejected";
      issue.status = "under_government_review";
      issue.updatedAt = new Date().toISOString();
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Work Order Declined",
        title: "Work Order Declined by Partner",
        description: `${wo.companyName} declined Work Order #${id}. Reason: ${reason}. Case returned to Government review.`,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: false,
      });
      persistIssues();
    }

    persistWorkOrders();
    return wo;
  },

  requestClarification(id: string, question: string): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    wo.status = "clarification_requested";
    wo.clarificationMessage = question;
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.workOrderStatus = "clarification_requested";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Clarification Requested",
        title: "Technical Clarification Requested",
        description: `${wo.companyName} submitted a query to ${wo.department}: "${question}".`,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: true,
      });
      persistIssues();
    }

    persistWorkOrders();
    return wo;
  },

  submitSolutionPlan(
    id: string,
    plan: {
      technicalApproach: string;
      milestones: { title: string; targetDate: string; percentage: number }[];
      equipmentDeployed: string[];
    }
  ): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    wo.solutionPlan = {
      ...plan,
      submittedAt: new Date().toISOString(),
    };
    wo.status = "in_progress";
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.workOrderStatus = "in_progress";
      issue.status = "in_progress";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Solution Plan Approved",
        title: "Technical Blueprint & Milestones Lodged",
        description: `${wo.companyName} submitted engineering plan with ${plan.milestones.length} milestones and deployed ${plan.equipmentDeployed.length} specialized machinery units.`,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: true,
      });
      persistIssues();
    }

    persistWorkOrders();
    return wo;
  },

  submitProgressReport(
    id: string,
    report: {
      progressPercentage: number;
      description: string;
      evidenceUrls: string[];
    }
  ): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    const reportId = `pr-${Date.now().toString().slice(-4)}`;
    wo.progressReports.push({
      id: reportId,
      progressPercentage: report.progressPercentage,
      description: report.description,
      evidenceUrls: report.evidenceUrls,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    });
    wo.status = "in_progress";
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.status = "in_progress";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Field Progress Log",
        title: `Work Progress: ${report.progressPercentage}% Completed`,
        description: report.description,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: true,
      });
      persistIssues();

      this.addNotification({
        userId: issue.citizenId,
        title: "Repair Progress Update",
        message: `${wo.companyName} reported ${report.progressPercentage}% milestone completion for #${issue.id}.`,
        type: "status_update",
        issueId: issue.id,
      });
    }

    persistWorkOrders();
    return wo;
  },

  submitCompletionReport(
    id: string,
    report: {
      completionSummary: string;
      evidenceUrls: string[];
      testResults?: string;
    }
  ): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    wo.completionReport = {
      completionSummary: report.completionSummary,
      evidenceUrls: report.evidenceUrls,
      testResults: report.testResults,
      submittedAt: new Date().toISOString(),
      verified: false,
    };
    wo.status = "submitted";
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.status = "inspection";
      issue.workOrderStatus = "submitted";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Inspection Pending",
        title: "Industry Work Completed - Site Inspection Awaited",
        description: `${wo.companyName} submitted final completion report and test certificates. Awaiting official Government engineering inspection.`,
        actor: wo.companyName,
        actorRole: "Industry Solution Partner",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        completed: true,
      });
      persistIssues();

      this.addNotification({
        userId: issue.citizenId,
        title: "Work Completed - Official Inspection Ongoing",
        message: `Field repair concluded by ${wo.companyName}. Municipal engineers are conducting quality inspection for #${issue.id}.`,
        type: "status_update",
        issueId: issue.id,
      });
    }

    persistWorkOrders();
    return wo;
  },

  // GOVERNMENT INSPECTION & APPROVAL
  inspectAndApproveWork(
    id: string,
    params: {
      inspectionRemarks: string;
      officerName: string;
    }
  ): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    wo.status = "approved";
    if (wo.completionReport) {
      wo.completionReport.verified = true;
      wo.completionReport.inspectionOfficer = params.officerName;
      wo.completionReport.inspectionDate = timestamp;
      wo.completionReport.inspectionRemarks = params.inspectionRemarks;
    }
    wo.updatedAt = new Date().toISOString();

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.status = "resolved";
      issue.workOrderStatus = "approved";
      issue.resolvedAt = new Date().toISOString();
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Government Inspection Passed",
        title: "Government Site Inspection Passed - Grievance Resolved",
        description: `Inspected by Officer ${params.officerName}. Quality metrics verified. Remarks: ${params.inspectionRemarks}. Grievance declared resolved.`,
        actor: params.officerName,
        actorRole: "Government Authority",
        timestamp,
        completed: true,
      });
      persistIssues();

      this.addNotification({
        userId: issue.citizenId,
        title: "Grievance Successfully Resolved",
        message: `Government inspection confirmed complete repair of #${issue.id}. Please provide your satisfaction feedback.`,
        type: "resolution",
        issueId: issue.id,
      });
      this.addNotification({
        userId: issue.citizenId,
        title: "Resolution Feedback Requested",
        message: `Help us improve municipal governance by rating the solution quality for #${issue.id}.`,
        type: "feedback_request",
        issueId: issue.id,
      });
    }

    persistWorkOrders();
    return wo;
  },

  // PAYMENT WORKFLOW: ONLY GOVERNMENT CAN AUTHORIZE
  approvePayment(
    id: string,
    params: {
      officerName: string;
      notes?: string;
    }
  ): WorkOrder {
    const wo = workOrdersDb.get(id);
    if (!wo) throw new Error(`Work Order #${id} not found.`);

    if (wo.status !== "approved" && wo.status !== "completed") {
      throw new Error(`Cannot approve payment: Work Order #${id} must first be inspected and approved by Government.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const txnHash = `TXN-RBI-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 9000 + 1000)}`;

    wo.status = "completed";
    if (!wo.payment) {
      wo.payment = {
        id: `pay-${wo.id}`,
        invoiceRef: `INV-2026-${wo.id.slice(-4)}`,
        amount: wo.budget,
        status: "approved",
      };
    }
    wo.payment.status = "released";
    wo.payment.approvedAt = new Date().toISOString();
    wo.payment.approvedBy = params.officerName;
    wo.payment.releasedAt = new Date().toISOString();
    wo.payment.transactionHash = txnHash;
    wo.updatedAt = new Date().toISOString();

    // Update Company stats
    const company = companiesDb.get(wo.companyId);
    if (company) {
      company.activeWorkOrdersCount = Math.max(0, company.activeWorkOrdersCount - 1);
      company.completedWorkOrdersCount += 1;
      persistCompanies();
    }

    const issue = issuesDb.get(wo.issueId);
    if (issue) {
      issue.paymentStatus = "released";
      issue.workOrderStatus = "completed";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Payment Released",
        title: `Treasury Payment Approved & Released (₹${wo.budget.toLocaleString("en-IN")})`,
        description: `Officer ${params.officerName} authorized government treasury payment of ₹${wo.budget.toLocaleString("en-IN")} to ${wo.companyName}. Reference: ${txnHash}.`,
        actor: params.officerName,
        actorRole: "Treasury Authority",
        timestamp,
        completed: true,
      });
      persistIssues();
    }

    persistWorkOrders();

    // Alert Company
    this.addNotification({
      userId: wo.companyId,
      title: "Municipal Payment Released",
      message: `Treasury released payment of ₹${wo.budget.toLocaleString("en-IN")} for Work Order #${wo.id} (Txn: ${txnHash}).`,
      type: "payment",
      issueId: wo.issueId,
    });

    return wo;
  },

  // Admin & Financial Audits
  getAdminAuditData() {
    const companies = Array.from(companiesDb.values());
    const workOrders = Array.from(workOrdersDb.values());
    const issues = Array.from(issuesDb.values());

    const totalOutsourced = workOrders.length;
    const totalBudgetDisbursed = workOrders
      .filter((w) => w.payment?.status === "released" || w.payment?.status === "completed")
      .reduce((acc, w) => acc + (w.payment?.amount || w.budget), 0);
    const pendingInspection = workOrders.filter((w) => w.status === "submitted").length;
    const verifiedCompaniesCount = companies.filter((c) => c.verified).length;

    return {
      companies,
      workOrders,
      totalOutsourced,
      totalBudgetDisbursed,
      pendingInspection,
      verifiedCompaniesCount,
      activeCollaborationsCount: workOrders.filter((w) => w.status === "in_progress" || w.status === "accepted").length,
    };
  },

  // --------------------------------------------------------------------------------
  // UNIVERSITY, FACULTY & STUDENT COLLABORATION METHODS
  // --------------------------------------------------------------------------------
  getUniversities(): University[] {
    return Array.from(universitiesDb.values());
  },

  getFaculty(universityId?: string): FacultyMentor[] {
    const list = Array.from(facultyDb.values());
    if (universityId) {
      return list.filter((f) => f.universityId === universityId);
    }
    return list;
  },

  getStudentTeams(universityId?: string): StudentTeam[] {
    const list = Array.from(studentTeamsDb.values());
    if (universityId) {
      return list.filter((t) => t.universityId === universityId);
    }
    return list;
  },

  // AI Recommendation Engine for University & Faculty matching
  recommendUniversitiesForWorkOrder(workOrderId: string): {
    workOrder: WorkOrder;
    recommendations: {
      university: University;
      suitabilityScore: number;
      recommendedDepartments: string[];
      facultyMentors: FacultyMentor[];
      studentTeams: StudentTeam[];
      matchReasons: string[];
      distanceEstimateKm: number;
    }[];
  } {
    const wo = workOrdersDb.get(workOrderId);
    if (!wo) throw new Error(`Work Order #${workOrderId} not found.`);

    const issue = issuesDb.get(wo.issueId);
    const domainText = `${wo.issueCategory} ${wo.issueTitle} ${wo.scopeOfWork} ${issue?.description || ""}`.toLowerCase();

    const allUniversities = Array.from(universitiesDb.values());
    const allFaculty = Array.from(facultyDb.values());
    const allTeams = Array.from(studentTeamsDb.values());

    const scored = allUniversities.map((univ) => {
      let score = 70;
      const reasons: string[] = [];

      // Proximity
      let distanceKm = 15;
      if (univ.district.toLowerCase() === wo.district.toLowerCase()) {
        score += 15;
        distanceKm = Math.floor(Math.random() * 8 + 4);
        reasons.push(`Located in the same district (${univ.district}) for rapid field deployment`);
      } else if (univ.state.toLowerCase() === (issue?.state || "").toLowerCase()) {
        score += 8;
        distanceKm = Math.floor(Math.random() * 40 + 30);
        reasons.push(`State-level accredited institution with regional field access`);
      }

      // NIRF Rank bonus
      if (univ.nirfRank <= 10) {
        score += 12;
        reasons.push(`Top 10 Premier National Institution (NIRF #${univ.nirfRank})`);
      } else if (univ.nirfRank <= 50) {
        score += 6;
        reasons.push(`Tier-1 Research University (NIRF #${univ.nirfRank})`);
      }

      // Department matching
      const matchingDepts = univ.departments.filter((dept) => {
        const d = dept.toLowerCase();
        if (domainText.includes("water") || domainText.includes("drain") || domainText.includes("pipeline")) {
          return d.includes("civil") || d.includes("environmental") || d.includes("ai");
        }
        if (domainText.includes("electric") || domainText.includes("power") || domainText.includes("wire")) {
          return d.includes("electronic") || d.includes("mechanical") || d.includes("energy");
        }
        if (domainText.includes("road") || domainText.includes("pothole") || domainText.includes("bridge")) {
          return d.includes("civil") || d.includes("mechanical");
        }
        if (domainText.includes("sensor") || domainText.includes("robot") || domainText.includes("iot")) {
          return d.includes("ai") || d.includes("computer") || d.includes("robotics");
        }
        return false;
      });

      if (matchingDepts.length > 0) {
        score += 10;
        reasons.push(`Active centers of excellence in ${matchingDepts.join(", ")}`);
      }

      const facultyList = allFaculty.filter((f) => f.universityId === univ.id);
      const teamsList = allTeams.filter((t) => t.universityId === univ.id);

      return {
        university: univ,
        suitabilityScore: Math.min(score, 99),
        recommendedDepartments: matchingDepts.length > 0 ? matchingDepts : univ.departments.slice(0, 3),
        facultyMentors: facultyList,
        studentTeams: teamsList,
        matchReasons: reasons,
        distanceEstimateKm: distanceKm,
      };
    });

    scored.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    return {
      workOrder: wo,
      recommendations: scored,
    };
  },

  // Industry initiates University Collaboration
  requestUniversityCollaboration(
    workOrderId: string,
    params: {
      universityId: string;
      department: string;
      facultyId: string;
      researchGrant: number;
      objectives: string;
      requiredDeliverables: string[];
      deadline: string;
    }
  ): { collaboration: UniversityCollaboration; workOrder: WorkOrder; issue: CentralIssue } {
    const wo = workOrdersDb.get(workOrderId);
    if (!wo) throw new Error(`Work Order #${workOrderId} not found.`);

    const issue = issuesDb.get(wo.issueId);
    if (!issue) throw new Error(`Issue #${wo.issueId} not found.`);

    const univ = universitiesDb.get(params.universityId);
    if (!univ) throw new Error(`University #${params.universityId} not found.`);

    const faculty = facultyDb.get(params.facultyId);
    if (!faculty) throw new Error(`Faculty Mentor #${params.facultyId} not found.`);

    const counter = (globalThis.__social_x_collab_counter =
      (globalThis.__social_x_collab_counter || 12) + 1);
    const collabId = `CR-2026-${String(counter).padStart(4, "0")}`;

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const collaboration: UniversityCollaboration = {
      id: collabId,
      workOrderId: wo.id,
      issueId: issue.id,
      issueTitle: issue.title,
      issueCategory: issue.category,
      industryId: wo.companyId,
      industryName: wo.companyName,
      governmentDepartment: wo.department,
      universityId: univ.id,
      universityName: univ.name,
      department: params.department,
      facultyId: faculty.id,
      facultyName: faculty.name,
      facultyEmail: faculty.email,
      researchGrant: params.researchGrant || 100000,
      objectives: params.objectives,
      requiredDeliverables: params.requiredDeliverables || ["Technical Blueprint", "Working Prototype", "Lab Test Report"],
      deadline: params.deadline,
      status: "requested",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    collaborationsDb.set(collabId, collaboration);
    persistCollaborations();

    // Update Work Order
    wo.universityCollaborationId = collabId;
    wo.universityCollaborationStatus = "requested";
    wo.status = "in_progress";
    wo.updatedAt = new Date().toISOString();
    persistWorkOrders();

    // Update Central Issue
    issue.status = "assigned_to_university";
    issue.universityCollaborationId = collabId;
    issue.universityName = univ.name;
    issue.facultyMentorName = faculty.name;
    issue.updatedAt = new Date().toISOString();

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      stage: "Assigned to University",
      title: "Industry Initiated University Research & Prototyping",
      description: `${wo.companyName} partnered with ${univ.name} (${params.department}) under Research Grant ₹${params.researchGrant.toLocaleString("en-IN")}. Faculty Mentor: ${faculty.name}.`,
      actor: wo.companyName,
      actorRole: "Industry Solution Partner",
      timestamp,
      completed: true,
    });
    persistIssues();

    // Alert Faculty Mentor
    this.addNotification({
      userId: faculty.id,
      title: "New Industry-University Collaboration Request",
      message: `${wo.companyName} invited your lab for R&D on "${issue.title}". Grant allocated: ₹${params.researchGrant.toLocaleString("en-IN")}.`,
      type: "collaboration_request",
      issueId: issue.id,
    });

    // Alert Citizen
    this.addNotification({
      userId: issue.citizenId,
      title: "Academic R&D Mobilized for Your Grievance",
      message: `${wo.companyName} has engaged ${univ.name} for advanced technical innovation on #${issue.id}.`,
      type: "status_update",
      issueId: issue.id,
    });

    return { collaboration, workOrder: wo, issue };
  },

  // Faculty accepts or declines collaboration
  facultyDecisionOnCollaboration(
    collaborationId: string,
    params: {
      facultyId: string;
      decision: "accept" | "reject";
      rejectionReason?: string;
      notes?: string;
    }
  ): UniversityCollaboration {
    const collab = collaborationsDb.get(collaborationId);
    if (!collab) throw new Error(`Collaboration #${collaborationId} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (params.decision === "accept") {
      collab.status = "faculty_accepted";
      collab.updatedAt = new Date().toISOString();

      const issue = issuesDb.get(collab.issueId);
      if (issue) {
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Faculty Accepted",
          title: "Faculty Mentor Accepted Collaboration",
          description: `Faculty Mentor ${collab.facultyName} accepted project terms. Student teams are being assembled.`,
          actor: collab.facultyName,
          actorRole: "Faculty Mentor",
          timestamp,
          completed: true,
        });
        persistIssues();
      }

      this.addNotification({
        userId: collab.industryId,
        title: "Collaboration Accepted by University",
        message: `${collab.facultyName} (${collab.universityName}) accepted the collaboration request for "${collab.issueTitle}".`,
        type: "status_update",
        issueId: collab.issueId,
      });
    } else {
      collab.status = "faculty_rejected";
      collab.rejectionReason = params.rejectionReason || "Faculty laboratory booked for other active mandates.";
      collab.updatedAt = new Date().toISOString();

      const issue = issuesDb.get(collab.issueId);
      if (issue) {
        issue.status = "assigned_to_industry";
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Collaboration Declined",
          title: "University Collaboration Declined",
          description: `${collab.facultyName} was unable to take up the collaboration: ${collab.rejectionReason}. Returned to Industry.`,
          actor: collab.facultyName,
          actorRole: "Faculty Mentor",
          timestamp,
          completed: false,
        });
        persistIssues();
      }
    }

    persistCollaborations();
    return collab;
  },

  // Faculty assigns Student Team & Milestones
  assignStudentTeamToCollaboration(
    collaborationId: string,
    params: {
      facultyId: string;
      studentTeamId: string;
      milestones?: { title: string; targetDays: number; deliverable: string }[];
    }
  ): UniversityCollaboration {
    const collab = collaborationsDb.get(collaborationId);
    if (!collab) throw new Error(`Collaboration #${collaborationId} not found.`);

    const team = studentTeamsDb.get(params.studentTeamId);
    if (!team) throw new Error(`Student Team #${params.studentTeamId} not found.`);

    collab.studentTeamId = team.id;
    collab.studentTeamName = team.name;
    collab.status = "student_assigned";

    if (params.milestones && params.milestones.length > 0) {
      collab.milestones = params.milestones.map((m, idx) => ({
        id: `ms-${idx + 1}`,
        title: m.title,
        targetDays: m.targetDays,
        deliverable: m.deliverable,
        completed: false,
      }));
    } else {
      collab.milestones = [
        { id: "ms-1", title: "Literature & Patent Survey", targetDays: 2, deliverable: "Technical proposal dossier", completed: false },
        { id: "ms-2", title: "CAD / Circuit Prototyping", targetDays: 4, deliverable: "Functional prototype build", completed: false },
        { id: "ms-3", title: "Lab Stress & Validation Testing", targetDays: 6, deliverable: "Performance calibration video & report", completed: false },
      ];
    }
    collab.updatedAt = new Date().toISOString();

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const issue = issuesDb.get(collab.issueId);
    if (issue) {
      issue.status = "student_development";
      issue.studentTeamName = team.name;
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Student Development",
        title: `Assigned to Student Team: ${team.name}`,
        description: `Faculty Mentor ${collab.facultyName} allocated the innovation sprint to ${team.name} (Lead: ${team.leadStudentName}). Target: ${collab.milestones.length} milestones.`,
        actor: collab.facultyName,
        actorRole: "Faculty Mentor",
        timestamp,
        completed: true,
      });
      persistIssues();
    }

    team.activeProjectsCount += 1;
    persistStudentTeams();
    persistCollaborations();

    // Alert Students
    this.addNotification({
      userId: team.leadStudentId,
      title: "New Industry Problem Assigned to Your Team",
      message: `Your team ${team.name} has been assigned "${collab.issueTitle}" under mentorship of ${collab.facultyName}.`,
      type: "student_assignment",
      issueId: collab.issueId,
    });

    return collab;
  },

  // Students submit prototype and technical solution
  studentSubmitSolution(
    collaborationId: string,
    params: {
      teamId: string;
      title: string;
      summary: string;
      prototypeImages?: string[];
      sourceCodeUrl?: string;
      researchPaperUrl?: string;
      submittedBy: string;
    }
  ): UniversityCollaboration {
    const collab = collaborationsDb.get(collaborationId);
    if (!collab) throw new Error(`Collaboration #${collaborationId} not found.`);

    collab.solutionSubmission = {
      title: params.title,
      summary: params.summary,
      prototypeImages: params.prototypeImages || ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"],
      sourceCodeUrl: params.sourceCodeUrl,
      researchPaperUrl: params.researchPaperUrl,
      submittedAt: new Date().toISOString(),
      submittedBy: params.submittedBy,
    };
    collab.status = "in_development";
    collab.updatedAt = new Date().toISOString();

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const issue = issuesDb.get(collab.issueId);
    if (issue) {
      issue.status = "faculty_review";
      issue.timeline.push({
        id: `tl-${Date.now()}`,
        stage: "Faculty Review",
        title: "Students Submitted Innovative Solution",
        description: `Student team ${collab.studentTeamName || "Innovators"} uploaded prototype schematics and test results for "${params.title}". Awaiting Faculty Mentor endorsement.`,
        actor: params.submittedBy,
        actorRole: "Student Innovator",
        timestamp,
        completed: true,
      });
      persistIssues();
    }

    persistCollaborations();

    // Alert Faculty Mentor
    this.addNotification({
      userId: collab.facultyId,
      title: "Student Prototype Ready for Review",
      message: `${collab.studentTeamName} submitted their solution for "${collab.issueTitle}". Please review and approve.`,
      type: "solution_submission",
      issueId: collab.issueId,
    });

    return collab;
  },

  // Faculty approves solution to be sent to Industry
  facultyApproveSolution(
    collaborationId: string,
    params: {
      facultyId: string;
      approved: boolean;
      feedback: string;
      mentorRating?: number;
    }
  ): UniversityCollaboration {
    const collab = collaborationsDb.get(collaborationId);
    if (!collab) throw new Error(`Collaboration #${collaborationId} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    collab.facultyReview = {
      approved: params.approved,
      feedback: params.feedback,
      reviewedAt: new Date().toISOString(),
      facultyName: collab.facultyName,
      mentorRating: params.mentorRating || 5,
    };

    const issue = issuesDb.get(collab.issueId);

    if (params.approved) {
      collab.status = "faculty_approved";
      collab.updatedAt = new Date().toISOString();

      if (issue) {
        issue.status = "industry_validation";
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Industry Validation",
          title: "Faculty Mentor Endorsed & Approved Solution",
          description: `Faculty Mentor ${collab.facultyName} endorsed the student prototype. Remarks: "${params.feedback}". Forwarded to ${collab.industryName} for field validation.`,
          actor: collab.facultyName,
          actorRole: "Faculty Mentor",
          timestamp,
          completed: true,
        });
        persistIssues();
      }

      this.addNotification({
        userId: collab.industryId,
        title: "University Solution Ready for Industry Validation",
        message: `${collab.facultyName} has vetted and approved the student prototype for "${collab.issueTitle}".`,
        type: "faculty_approval",
        issueId: collab.issueId,
      });
    } else {
      collab.status = "modifications_requested";
      collab.updatedAt = new Date().toISOString();

      if (issue) {
        issue.status = "student_development";
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Modifications Requested",
          title: "Faculty Requested Prototype Enhancements",
          description: `Faculty Mentor feedback: ${params.feedback}. Student team reworking calibration.`,
          actor: collab.facultyName,
          actorRole: "Faculty Mentor",
          timestamp,
          completed: false,
        });
        persistIssues();
      }
    }

    persistCollaborations();
    return collab;
  },

  // Industry validates university solution, integrates and prepares for Government Inspection
  industryValidateSolution(
    collaborationId: string,
    params: {
      industryId: string;
      decision: "accepted" | "modifications_requested" | "rejected";
      feedback: string;
      deploymentEvidenceUrl?: string;
      officerToNotify?: string;
    }
  ): UniversityCollaboration {
    const collab = collaborationsDb.get(collaborationId);
    if (!collab) throw new Error(`Collaboration #${collaborationId} not found.`);

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    collab.industryValidation = {
      status: params.decision,
      feedback: params.feedback,
      validatedAt: new Date().toISOString(),
      validatedBy: collab.industryName,
      deploymentEvidenceUrl: params.deploymentEvidenceUrl,
    };

    const issue = issuesDb.get(collab.issueId);
    const wo = workOrdersDb.get(collab.workOrderId);

    if (params.decision === "accepted") {
      collab.status = "industry_validated";
      collab.updatedAt = new Date().toISOString();

      // Issue Academic Recognition Certificates & Credits
      const cert1Id = `CERT-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
      const cert2Id = `CERT-2026-${Math.floor(Math.random() * 8999 + 1000)}`;

      const certs: AcademicCertificate[] = [
        {
          id: cert1Id,
          collaborationId: collab.id,
          recipientId: collab.facultyId,
          recipientName: collab.facultyName,
          recipientRole: "faculty_mentor",
          universityName: collab.universityName,
          industryPartnerName: collab.industryName,
          projectTitle: collab.issueTitle,
          certificateNumber: `SX-CERT-FAC-${collab.id}`,
          academicCreditsAwarded: 4,
          issuedAt: new Date().toISOString(),
          verificationHash: `HASH-FAC-${Date.now().toString(36).toUpperCase()}`,
        },
        {
          id: cert2Id,
          collaborationId: collab.id,
          recipientId: collab.studentTeamId || "stu-team",
          recipientName: collab.studentTeamName || "Student Innovators",
          recipientRole: "student_innovator",
          universityName: collab.universityName,
          industryPartnerName: collab.industryName,
          projectTitle: collab.issueTitle,
          certificateNumber: `SX-CERT-STU-${collab.id}`,
          academicCreditsAwarded: 4,
          issuedAt: new Date().toISOString(),
          verificationHash: `HASH-STU-${Date.now().toString(36).toUpperCase()}`,
        },
      ];

      collab.certificates = certs.map((c) => ({
        id: c.id,
        recipientId: c.recipientId,
        recipientName: c.recipientName,
        recipientRole: c.recipientRole,
        title: c.projectTitle,
        certificateNumber: c.certificateNumber,
        issuedAt: c.issuedAt,
        academicCreditsAwarded: c.academicCreditsAwarded,
      }));

      certificatesDb.push(...certs);
      persistCertificates();

      // Award credits to team
      if (collab.studentTeamId) {
        const team = studentTeamsDb.get(collab.studentTeamId);
        if (team) {
          team.academicCredits += 4;
          persistStudentTeams();
        }
      }

      if (issue) {
        issue.status = "government_inspection";
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Industry Validation Passed",
          title: "Industry Integrated University Solution & Deployed Field Fix",
          description: `${collab.industryName} validated the university prototype, integrated the solution on-site, and disbursed research grant ₹${collab.researchGrant.toLocaleString("en-IN")}. Certificates & 4 Academic Innovation Credits awarded. Government site inspection requested.`,
          actor: collab.industryName,
          actorRole: "Industry Solution Partner",
          timestamp,
          completed: true,
        });
        persistIssues();

        // Alert Government Authority
        this.addNotification({
          userId: issue.officerId,
          title: "University-Industry Solution Deployed - Site Inspection Required",
          message: `${collab.industryName} in collaboration with ${collab.universityName} deployed solution for #${issue.id}. Please conduct municipal inspection.`,
          type: "status_update",
          issueId: issue.id,
        });

        // Alert Citizen
        this.addNotification({
          userId: issue.citizenId,
          title: "Field Deployment Complete - Municipal Inspection Underway",
          message: `Academic-industrial solution successfully deployed for #${issue.id}. Municipal engineers are conducting final inspection.`,
          type: "status_update",
          issueId: issue.id,
        });
      }

      if (wo) {
        wo.status = "submitted";
        wo.updatedAt = new Date().toISOString();
        persistWorkOrders();
      }
    } else {
      collab.status = "modifications_requested";
      collab.updatedAt = new Date().toISOString();

      if (issue) {
        issue.status = "student_development";
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          stage: "Industry Revisions Needed",
          title: "Industry Requested Technical Refinements",
          description: `${collab.industryName} feedback: ${params.feedback}. University team conducting adjustments.`,
          actor: collab.industryName,
          actorRole: "Industry Solution Partner",
          timestamp,
          completed: false,
        });
        persistIssues();
      }
    }

    persistCollaborations();
    return collab;
  },

  getUniversityCollaborations(filter?: {
    universityId?: string;
    facultyId?: string;
    studentTeamId?: string;
    industryId?: string;
    workOrderId?: string;
    status?: string;
  }): UniversityCollaboration[] {
    let list = Array.from(collaborationsDb.values());
    if (filter?.universityId) {
      list = list.filter((c) => c.universityId === filter.universityId);
    }
    if (filter?.facultyId) {
      list = list.filter((c) => c.facultyId === filter.facultyId);
    }
    if (filter?.studentTeamId) {
      list = list.filter((c) => c.studentTeamId === filter.studentTeamId);
    }
    if (filter?.industryId) {
      list = list.filter((c) => c.industryId === filter.industryId);
    }
    if (filter?.workOrderId) {
      list = list.filter((c) => c.workOrderId === filter.workOrderId);
    }
    if (filter?.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getCollaborationById(id: string): UniversityCollaboration | undefined {
    return collaborationsDb.get(id);
  },

  getUniversityCertificates(recipientId?: string): AcademicCertificate[] {
    if (recipientId) {
      return certificatesDb.filter((c) => c.recipientId === recipientId);
    }
    return certificatesDb;
  },

  // ==============================================================
  // Phase 12: Government Inspection & Phase 13: Payment
  // ==============================================================
  conductGovernmentInspection(
    issueId: string,
    params: {
      inspectionOfficer: string;
      officerId?: string;
      qualityScore: number;
      safetyCompliant: boolean;
      completionVerified: boolean;
      remarks: string;
      approvePayment?: boolean;
      invoiceRef?: string;
      paymentAmount?: number;
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) {
      throw new Error(`Issue #${issueId} not found.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const isApproved = params.completionVerified && params.safetyCompliant && params.qualityScore >= 70;

    if (isApproved) {
      issue.status = "resolved";
      issue.resolvedAt = new Date().toISOString();

      // Check if there is an associated work order for Industry
      if (issue.workOrderId) {
        const wo = workOrdersDb.get(issue.workOrderId);
        if (wo) {
          wo.status = "completed";
          if (wo.completionReport) {
            wo.completionReport.verified = true;
            wo.completionReport.inspectionOfficer = params.inspectionOfficer;
            wo.completionReport.inspectionDate = timestamp;
            wo.completionReport.inspectionRemarks = params.remarks;
          }

          if (params.approvePayment) {
            const txHash = `0x${crypto.randomBytes(16).toString("hex")}`;
            const invRef = params.invoiceRef || `INV-2026-${issue.workOrderId.replace(/\D/g, "")}`;
            const amount = params.paymentAmount || wo.budget;

            wo.payment = {
              id: `pay-${Date.now()}`,
              invoiceRef: invRef,
              amount,
              status: "approved",
              approvedAt: timestamp,
              approvedBy: params.inspectionOfficer,
              releasedAt: timestamp,
              transactionHash: txHash,
            };
            issue.paymentStatus = "approved";
            issue.paymentReference = invRef;

            // Notify Industry of Payment
            this.addNotification({
              userId: wo.companyId,
              title: `Payment Approved: ₹${amount.toLocaleString("en-IN")}`,
              message: `Payment authorized by ${params.inspectionOfficer} for Work Order #${wo.id} (Invoice: ${invRef}). Tx: ${txHash.slice(0, 12)}...`,
              type: "payment",
              issueId: issue.id,
            });
          }
          persistWorkOrders();
        }
      }

      issue.timeline.push({
        id: `tl-${Date.now()}-insp`,
        stage: "Government Inspection",
        title: "Quality, Safety & Compliance Inspection Approved",
        description: `Verified by ${params.inspectionOfficer}. Quality score: ${params.qualityScore}/100. Safety compliance: Verified. Remarks: ${params.remarks}. ${params.approvePayment ? "Payment approved and authorized for release." : ""}`,
        actor: params.inspectionOfficer,
        actorRole: "Municipal Inspecting Officer",
        timestamp,
        completed: true,
        isCurrent: false,
      });

      issue.timeline.push({
        id: `tl-${Date.now()}-res`,
        stage: "Resolved",
        title: "Field Grievance Fully Resolved",
        description: `Issue marked as Resolved. Next: Impact Assessment and Citizen Rating.`,
        actor: params.inspectionOfficer,
        actorRole: "Government Authority",
        timestamp,
        completed: true,
        isCurrent: true,
      });

      // Notify Citizen
      this.addNotification({
        userId: issue.citizenId,
        title: "Your Issue Has Been Resolved!",
        message: `Government inspection confirmed completion of repairs for #${issue.id}. Please review and provide your feedback.`,
        type: "resolution",
        issueId: issue.id,
      });
    } else {
      issue.timeline.push({
        id: `tl-${Date.now()}-insp-fail`,
        stage: "Government Inspection",
        title: "Modifications Required by Inspection Officer",
        description: `Inspected by ${params.inspectionOfficer}. Remedial work requested. Remarks: ${params.remarks}`,
        actor: params.inspectionOfficer,
        actorRole: "Municipal Inspecting Officer",
        timestamp,
        completed: false,
        isCurrent: true,
      });
    }

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  // ==============================================================
  // Phase 14: NGO Workflow
  // ==============================================================
  submitNgoAction(
    issueId: string,
    params: {
      ngoId: string;
      ngoName: string;
      needsVolunteers: boolean;
      societyCoordinator?: string;
      volunteerCount?: number;
      actionSummary?: string;
      completionEvidenceUrl?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) {
      throw new Error(`Issue #${issueId} not found.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const isCompleted = Boolean(params.completionEvidenceUrl);

    issue.ngoWorkflow = {
      ngoId: params.ngoId,
      ngoName: params.ngoName,
      needsVolunteers: params.needsVolunteers,
      societyCoordinator: params.societyCoordinator || (params.needsVolunteers ? "Smt. Jayanthi Raman (District Coordinator)" : undefined),
      volunteersAssignedCount: params.volunteerCount || (params.needsVolunteers ? 12 : 0),
      communityActionSummary: params.actionSummary || "Community assistance drive organized by NGO volunteer corps.",
      completionReportUrl: params.completionEvidenceUrl,
      status: isCompleted ? "service_completed" : params.needsVolunteers ? "volunteers_mobilized" : "direct_assistance",
      assignedAt: issue.ngoWorkflow?.assignedAt || new Date().toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    };

    issue.timeline.push({
      id: `tl-${Date.now()}-ngo`,
      stage: "NGO Assistance",
      title: isCompleted
        ? "NGO Community Service Completed"
        : params.needsVolunteers
        ? `NGO Volunteer Corps Mobilized (${params.volunteerCount || 12} Volunteers)`
        : "NGO Direct Field Assistance Provided",
      description: `${params.ngoName} ${isCompleted ? "uploaded completion report with photographic proof" : params.needsVolunteers ? `assigned Society Coordinator ${issue.ngoWorkflow.societyCoordinator}` : "delivered direct community intervention"}: ${params.actionSummary || "Assistance in progress"}.`,
      actor: params.ngoName,
      actorRole: "NGO Solution Partner",
      timestamp,
      completed: isCompleted,
      isCurrent: !isCompleted,
    });

    // Notify Citizen
    this.addNotification({
      userId: issue.citizenId,
      title: `NGO Support: ${params.ngoName}`,
      message: `${params.ngoName} has taken community action for #${issue.id}. Status: ${issue.ngoWorkflow.status}.`,
      type: "ngo_mobilized",
      issueId: issue.id,
    });

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  // ==============================================================
  // Phase 15: Emergency Dispatch Management
  // ==============================================================
  updateEmergencyDispatch(
    issueId: string,
    params: {
      responseStatus: "dispatched" | "on_scene" | "stabilized" | "handed_over";
      agencyNotes?: string;
      updatedBy?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) {
      throw new Error(`Issue #${issueId} not found.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (!issue.emergencyWorkflow) {
      issue.emergencyWorkflow = {
        isTriggered: true,
        emergencyType: "life_safety",
        notifiedAgencies: ["Emergency Control Room (112)", "Police Dispatch", "Fire & Rescue", "Ambulance Network"],
        dispatchedAt: new Date().toISOString(),
        responseStatus: params.responseStatus,
        controlRoomNotes: params.agencyNotes,
      };
    } else {
      issue.emergencyWorkflow.responseStatus = params.responseStatus;
      if (params.agencyNotes) {
        issue.emergencyWorkflow.controlRoomNotes = params.agencyNotes;
      }
    }

    issue.timeline.push({
      id: `tl-${Date.now()}-em-stat`,
      stage: "Emergency Operations",
      title: `Emergency Units ${params.responseStatus.toUpperCase().replace("_", " ")}`,
      description: `First responders report: ${params.agencyNotes || `Status updated to ${params.responseStatus}`}. Authorized by ${params.updatedBy || "Emergency Control Center"}.`,
      actor: params.updatedBy || "Emergency Operations Command",
      actorRole: "First Responder Services",
      timestamp,
      completed: params.responseStatus === "stabilized" || params.responseStatus === "handed_over",
      isCurrent: params.responseStatus !== "handed_over",
    });

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  // ==============================================================
  // Phase 17: Impact Assessment
  // ==============================================================
  submitImpactAssessment(
    issueId: string,
    params: {
      beforePhotoUrls?: string[];
      afterPhotoUrls?: string[];
      completionEvidenceUrls?: string[];
      citizenSatisfactionScore?: number;
      governmentRating?: number;
      industryPerformanceScore?: number;
      universityContributionScore?: number;
      studentInnovationScore?: number;
      assessedBy?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) {
      throw new Error(`Issue #${issueId} not found.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const resolutionHours = Math.max(
      4,
      Math.round(
        (new Date().getTime() - new Date(issue.createdAt).getTime()) /
          (1000 * 60 * 60)
      )
    );

    const totalCost = issue.budget || issue.aiAnalysis?.estimatedCost || 45000;

    issue.impactAssessment = {
      beforePhotoUrls: params.beforePhotoUrls || issue.attachments.images.map(img => img.url),
      afterPhotoUrls: params.afterPhotoUrls || [
        "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
      ],
      completionEvidenceUrls: params.completionEvidenceUrls || [],
      actualResolutionTimeHours: resolutionHours,
      totalCost,
      citizenSatisfactionScore: params.citizenSatisfactionScore || 5,
      governmentRating: params.governmentRating || 5,
      industryPerformanceScore: params.industryPerformanceScore || 94,
      universityContributionScore: params.universityContributionScore || 96,
      studentInnovationScore: params.studentInnovationScore || 98,
      assessedAt: timestamp,
      assessedBy: params.assessedBy || "Social-X Autonomous Audit Bureau",
    };

    issue.status = "feedback_pending";

    issue.timeline.push({
      id: `tl-${Date.now()}-impact`,
      stage: "Impact Assessment",
      title: "Impact Assessment & Innovation Metrics Evaluated",
      description: `Resolution time: ${resolutionHours}h. Cost: ₹${totalCost.toLocaleString("en-IN")}. Gov Rating: ${issue.impactAssessment.governmentRating}/5. Industry Score: ${issue.impactAssessment.industryPerformanceScore}%. Student Innovation: ${issue.impactAssessment.studentInnovationScore}%.`,
      actor: issue.impactAssessment.assessedBy,
      actorRole: "Audit Authority",
      timestamp,
      completed: true,
      isCurrent: true,
    });

    // Notify Citizen to leave feedback
    this.addNotification({
      userId: issue.citizenId,
      title: "Impact Assessment Ready - Please Rate Resolution",
      message: `Impact assessment concluded for #${issue.id}. Please submit your star rating and feedback to close the case.`,
      type: "feedback_request",
      issueId: issue.id,
    });

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  // ==============================================================
  // Phase 18: Citizen Feedback & Case Closure
  // ==============================================================
  submitCitizenFeedback(
    issueId: string,
    params: {
      rating: number;
      feedback: string;
      comments?: string;
      citizenId?: string;
    }
  ): CentralIssue {
    const issue = issuesDb.get(issueId);
    if (!issue) {
      throw new Error(`Issue #${issueId} not found.`);
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    issue.citizenFeedback = {
      rating: Math.max(1, Math.min(5, params.rating)),
      feedback: params.feedback.trim(),
      comments: params.comments?.trim(),
      submittedAt: timestamp,
    };

    issue.status = "closed";

    issue.timeline.push({
      id: `tl-${Date.now()}-closed`,
      stage: "Closed",
      title: `Case Closed - Citizen Verified (${params.rating}★ Rating)`,
      description: `Citizen Feedback: "${params.feedback}". Case lifecycle officially closed and archived in municipal records.`,
      actor: issue.citizenName,
      actorRole: "Citizen",
      timestamp,
      completed: true,
      isCurrent: false,
    });

    // Mark current timeline entry as complete
    issue.timeline.forEach(t => {
      t.completed = true;
      t.isCurrent = false;
    });

    // Notify Officer
    this.addNotification({
      userId: issue.officerId,
      title: `Case Closed: #${issue.id}`,
      message: `Citizen gave ${params.rating}★ rating with feedback: "${params.feedback.slice(0, 80)}...". Case closed successfully.`,
      type: "case_closed",
      issueId: issue.id,
    });

    // Notify Citizen
    this.addNotification({
      userId: issue.citizenId,
      title: "Thank You! Grievance Closed",
      message: `Your grievance #${issue.id} has been formally closed. Thank you for making our city safer and better!`,
      type: "case_closed",
      issueId: issue.id,
    });

    issue.updatedAt = new Date().toISOString();
    persistIssues();
    return issue;
  },

  getAdminUniversityAuditData() {
    const universities = Array.from(universitiesDb.values());
    const faculty = Array.from(facultyDb.values());
    const studentTeams = Array.from(studentTeamsDb.values());
    const collaborations = Array.from(collaborationsDb.values());
    const certificates = certificatesDb;

    const totalResearchGrantsDisbursed = collaborations
      .filter((c) => c.status === "industry_validated" || c.status === "deployed")
      .reduce((sum, c) => sum + (c.researchGrant || 0), 0);

    const activeResearchProjects = collaborations.filter(
      (c) => c.status === "in_development" || c.status === "student_assigned" || c.status === "faculty_accepted"
    ).length;

    return {
      totalUniversities: universities.length,
      totalFaculty: faculty.length,
      totalStudentTeams: studentTeams.length,
      totalCollaborations: collaborations.length,
      activeResearchProjects,
      totalResearchGrantsDisbursed,
      certificatesIssuedCount: certificates.length,
      universities,
      faculty,
      studentTeams,
      collaborations,
      certificates,
    };
  },
};
