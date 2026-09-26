export type NgoRole = "ngo";

export interface NgoUser {
  id: string;
  name: string;
  email: string;
  role: NgoRole;
  roleLabel: string;
  orgId: string;
  avatarUrl?: string;
  phone?: string;
}

export interface NgoOrganization {
  id: string;
  name: string;
  registrationNumber: string;
  darpanId: string; // NITI Aayog NGO Darpan ID
  fcraStatus: "Compliant" | "Pending" | "Not Applicable";
  has12A80G: boolean;
  establishedYear: number;
  mission: string;
  about: string;
  address: string;
  district: string;
  state: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  focusAreas: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  achievements: string[];
  certifications: string[];
  impactMetrics: {
    totalBeneficiaries: number;
    villagesAdopted: number;
    activeVolunteers: number;
    treesPlanted?: number;
    scholarshipsGranted?: number;
  };
}

export interface NgoDashboardStats {
  activeProjects: number;
  completedProjects: number;
  pendingRequests: number;
  volunteers: number;
  beneficiaries: number;
  districtsCovered: number;
  communityImpactScore: number;
  totalVolunteerHours: number;
  notifications: number;
}

export interface AvailableProject {
  id: string;
  title: string;
  category: string;
  district: string;
  sdgGoal: string; // e.g. "SDG 3: Good Health", "SDG 4: Quality Education"
  governmentDepartment: string;
  universityPartner?: string;
  budget: string;
  timeline: string;
  priority: "High" | "Medium" | "Urgent";
  status: "Open for Application" | "Reviewing" | "Allocated";
  description: string;
  eligibility: string[];
  deadline: string;
  isBookmarked?: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  budgetAllocated: string;
  deliverables: string;
}

export interface AssignedProject {
  id: string;
  title: string;
  category: string;
  district: string;
  sdgGoal: string;
  completionPercentage: number;
  timeline: string;
  milestones: ProjectMilestone[];
  assignedVolunteersCount: number;
  assignedVolunteers: Array<{ id: string; name: string; role: string; avatarUrl?: string }>;
  budgetTotal: string;
  budgetUtilized: string;
  uploadedReports: Array<{ id: string; name: string; date: string; url: string; size: string }>;
  images: Array<{ id: string; url: string; caption: string }>;
  videos: Array<{ id: string; url: string; title: string }>;
  documents: Array<{ id: string; name: string; type: string; url: string; size: string }>;
  status: "Active" | "Under Review" | "Completed" | "Delayed";
}

export interface EvidenceFile {
  id: string;
  type: "image" | "video" | "pdf";
  url: string;
  name: string;
  uploadedAt: string;
  size?: string;
}

export interface FieldActivity {
  id: string;
  projectId: string;
  projectTitle: string;
  date: string;
  time: string;
  location: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  volunteerCount: number;
  description: string;
  approvalStatus: "Approved" | "Pending Review" | "Flagged";
  evidenceGallery: EvidenceFile[];
  activityNotes: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: "Weekdays" | "Weekends" | "Full-time" | "Flexible";
  assignedProject?: string;
  assignedProjectId?: string;
  hoursContributed: number;
  contributionScore: number; // 0-100
  certificatesCount: number;
  avatarUrl?: string;
  district: string;
  joinedDate: string;
}

export interface ImpactAnalytics {
  peopleBenefited: number;
  villagesCovered: number;
  districtCoverage: number;
  volunteerHours: number;
  successRate: number; // percentage
  environmentalImpact: {
    treesPlanted: number;
    co2OffsetTonnes: number;
    waterBodiesRestored: number;
  };
  healthcareImpact: {
    freeScreenings: number;
    medicinesDistributed: number;
    maternalCareCamps: number;
  };
  educationImpact: {
    studentsMentored: number;
    schoolsEquipped: number;
    digitalLabsSet: number;
  };
  monthlyTrends: Array<{
    month: string;
    beneficiaries: number;
    volunteerHours: number;
    projectsActive: number;
  }>;
  districtBreakdown: Array<{
    district: string;
    beneficiaries: number;
    impactScore: number;
    villages: number;
  }>;
  sdgDistribution: Array<{
    sdg: string;
    percentage: number;
    color: string;
  }>;
}

export interface CollaborationPartner {
  id: string;
  partnerName: string;
  partnerType: "Government" | "University" | "Industry" | "Research Organization";
  projectTitle: string;
  status: "Accepted" | "Pending" | "Invitation Received";
  contactPerson: string;
  email: string;
  sharedDocuments: Array<{ id: string; name: string; size: string; url: string }>;
  recentDiscussion: string;
  establishedDate: string;
}

export interface NgoReport {
  id: string;
  title: string;
  type: "Monthly Activities" | "Completed Projects" | "Volunteer Contributions" | "Financial Utilization" | "Community Reach";
  period: string;
  generatedAt: string;
  fileFormat: "PDF" | "Excel";
  fileUrl: string;
  size: string;
  downloadCount: number;
}

export interface NgoCertificate {
  id: string;
  volunteerId: string;
  volunteerName: string;
  projectName: string;
  issueDate: string;
  verificationCode: string;
  certificateUrl: string;
  type: "Excellence in Service" | "Community Leadership" | "Distinguished Contributor";
  hoursLogged: number;
}

export interface NgoNotification {
  id: string;
  title: string;
  description: string;
  category: "project" | "volunteer" | "approval" | "collaboration" | "system";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NgoMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
  isSelf?: boolean;
}

export interface NgoConversation {
  id: string;
  partnerName: string;
  partnerType: string;
  partnerOrg: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatarUrl?: string;
}
