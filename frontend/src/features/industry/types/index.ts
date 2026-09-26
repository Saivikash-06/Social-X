export type IndustryRole =
  | "csr_org"
  | "corporate"
  | "msme"
  | "startup"
  | "innovation_partner";

export interface IndustryUser {
  id: string;
  name: string;
  email: string;
  role: IndustryRole;
  roleLabel: string;
  organizationName: string;
  designation: string;
  phone: string;
  avatarUrl?: string;
  verificationStatus: "verified" | "pending" | "action_required";
}

export interface OrganizationProfile {
  id: string;
  name: string;
  legalEntityName: string;
  sector: string;
  subSector?: string;
  cinOrRegNumber: string;
  website: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  logoUrl?: string;
  bannerUrl?: string;
  csrFocusAreas: string[];
  technologyDomains: string[];
  availableBudget: number; // in INR
  allocatedBudget: number;
  spentBudget: number;
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  verificationStatus: "verified" | "under_review" | "unverified";
  esgRating: {
    environmental: number; // 0 - 100
    social: number;
    governance: number;
    compositeScore: number;
    grade: "AAA" | "AA" | "A" | "BBB";
  };
  csrRegistration80G: string;
  csrRegistration12A: string;
  activeInitiativesCount: number;
}

export type ProjectCategory =
  | "Water Management & Sanitation"
  | "Clean Energy & EV Microgrids"
  | "Smart Urban Mobility"
  | "Air Quality & Waste Governance"
  | "Healthcare & Telemedicine"
  | "AI for Public Safety";

export type ProjectDistrict =
  | "Bengaluru Urban"
  | "Bengaluru Rural"
  | "Mysuru"
  | "Dharwad"
  | "Dakshina Kannada"
  | "Tumakuru"
  | "Shivamogga";

export type ProjectStatus =
  | "open_for_sponsorship"
  | "sponsored"
  | "in_progress"
  | "prototype_ready"
  | "pilot_testing"
  | "completed";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "rejected";
  deliverableUrl?: string;
  fundingReleasePercentage: number;
  feedback?: string;
}

export interface StudentTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  year: string;
  avatarUrl?: string;
}

export interface FacultyMentor {
  id: string;
  name: string;
  designation: string;
  department: string;
  university: string;
  email: string;
  avatarUrl?: string;
}

export interface ProjectMediaAsset {
  id: string;
  title: string;
  type: "image" | "video" | "document" | "code";
  url: string;
  size?: string;
  uploadedAt: string;
}

export interface AIAnalysisMetric {
  feasibilityScore: number; // 0-100
  societalImpactScore: number; // 0-100
  patentabilityScore: number; // 0-100
  readinessLevel: "TRL 3 - Proof of Concept" | "TRL 4 - Lab Validated" | "TRL 5 - Tech Validated" | "TRL 6 - Field Prototype" | "TRL 7 - Demonstration System";
  keyRisks: string[];
  suggestedIndustrialApplications: string[];
  estimatedTimeSavings: string;
}

export interface IndustryProject {
  id: string;
  title: string;
  category: ProjectCategory;
  district: ProjectDistrict;
  university: string;
  problemDescription: string;
  detailedStatement: string;
  expectedOutcome: string;
  requiredTechnologies: string[];
  currentStatus: ProjectStatus;
  expectedBudget: number; // INR
  fundedAmount: number; // INR
  timelineMonths: number;
  startDate?: string;
  targetCompletionDate?: string;
  facultyLead: FacultyMentor;
  studentTeamSize: number;
  teamMembers: StudentTeamMember[];
  governmentDepartment: string;
  milestones: Milestone[];
  mediaAssets: ProjectMediaAsset[];
  aiAnalysis: AIAnalysisMetric;
  prototypeStage: "Concept" | "Simulation" | "Bench Prototype" | "Field Hardware" | "Ready for Pilot";
  discussionCommentsCount: number;
  isBookmarked?: boolean;
  sponsoredByUs?: boolean;
}

export interface FundingOpportunity {
  id: string;
  projectId: string;
  projectTitle: string;
  university: string;
  category: ProjectCategory;
  requiredBudget: number;
  coSponsorAmountAvailable: number;
  taxBenefitSection: "80G (50% Exemption)" | "CSR Section 135" | "R&D 100% Deduction";
  csrClassification: "Schedule VII - Clean Water" | "Schedule VII - Environmental Sustainability" | "Schedule VII - Skill Tech";
  submissionDeadline: string;
  urgency: "high" | "medium" | "low";
  proposalDocumentUrl: string;
  status: "open" | "under_review" | "funded" | "rejected";
}

export interface FundReleaseRecord {
  id: string;
  transactionId: string;
  projectId: string;
  projectTitle: string;
  university: string;
  amount: number;
  milestoneTitle: string;
  releaseDate: string;
  paymentMode: "NEFT / RTGS" | "Escrow Milestone Release" | "Direct Treasury Transfer";
  status: "settled" | "in_transit" | "processing";
  invoiceUrl: string;
  receiptUrl: string;
}

export interface MentorshipEngagement {
  id: string;
  projectId: string;
  projectTitle: string;
  university: string;
  studentTeamLead: string;
  teamSize: number;
  facultyLead: string;
  status: "active" | "requested" | "completed";
  nextMeetingDate?: string;
  totalHoursLogged: number;
  lastFeedbackDate?: string;
  deliverablesReviewedCount: number;
  rating?: number; // 1-5
}

export interface ScheduledMeeting {
  id: string;
  engagementId: string;
  title: string;
  date: string;
  time: string;
  meetingLink: string;
  agenda: string;
  attendees: string[];
  status: "scheduled" | "completed" | "cancelled";
}

export interface MentorshipTask {
  id: string;
  engagementId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "critical" | "medium" | "routine";
  status: "assigned" | "in_review" | "approved" | "needs_revision";
  deliverableUrl?: string;
  feedback?: string;
}

export interface UniversityPartner {
  id: string;
  name: string;
  location: string;
  district: ProjectDistrict;
  nirfRanking: number;
  departments: string[];
  researchLabs: string[];
  innovationCenters: string[];
  activeProjectsCount: number;
  studentsCount: number;
  keyFaculty: string[];
  connectionStatus: "connected" | "pending_invitation" | "not_connected";
  contactEmail: string;
}

export interface ResearchCollaboration {
  id: string;
  title: string;
  university: string;
  leadInvestigator: string;
  domain: string;
  grantValue: number;
  status: "active" | "under_evaluation" | "published" | "patent_pending";
  jointPatentsFiled: number;
  papersCoAuthored: number;
  startDate: string;
  endDate: string;
}

export interface PrototypeSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  university: string;
  prototypeVersion: string;
  submissionDate: string;
  hardwareSpecifications: string;
  firmwareVersion: string;
  testingStatus: "bench_testing" | "field_testing" | "certified" | "modifications_requested";
  cadModelUrl?: string;
  liveDemoScheduled?: string;
  pilotLocation?: string;
  reviewDecision?: "approved" | "rejected" | "improvements_required" | "pending";
  reviewNotes?: string;
}

export interface ImplementationTrackerItem {
  id: string;
  projectId: string;
  projectTitle: string;
  currentStage: "Planning" | "Research" | "Prototype" | "Testing" | "Pilot" | "Deployment" | "Completed";
  stageProgress: number; // 0 - 100
  overallProgress: number; // 0 - 100
  deploymentDistrict: ProjectDistrict;
  beneficiariesCount: number;
  lastMilestonePassed: string;
  nextMilestoneDue: string;
  reports: { name: string; date: string; url: string }[];
}

export interface MessageSender {
  id: string;
  name: string;
  role: "university" | "government" | "student" | "ngo" | "system";
  organization: string;
  avatarUrl?: string;
}

export interface IndustryMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string; size: string }[];
  isRead: boolean;
}

export interface IndustryConversation {
  id: string;
  participantCategory: "University" | "Government" | "Students" | "NGOs";
  participantName: string;
  participantOrg: string;
  participantAvatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  projectContext?: string;
}

export interface IndustryDashboardStats {
  projectsAvailable: number;
  projectsSponsored: number;
  projectsCompleted: number;
  universitiesConnected: number;
  studentsMentored: number;
  fundingReleased: number; // INR
  csrImpactScore: number; // 0 - 100
  innovationScore: number; // 0 - 100
  pendingRequests: number;
  unreadNotifications: number;
}

export interface IndustryNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "funding" | "mentorship" | "prototype" | "collaboration" | "system";
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  type: "funding_released" | "milestone_approved" | "meeting_scheduled" | "prototype_submitted" | "collaboration_accepted";
  details: string;
}
