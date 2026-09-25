export type ResearchRole = "research";

export interface ResearchUser {
  id: string;
  name: string;
  email: string;
  role: ResearchRole;
  roleLabel: string;
  instituteId: string;
  avatarUrl?: string;
  phone?: string;
}

export interface ResearchInstitute {
  id: string;
  name: string;
  accreditation: string; // e.g., "NAAC A++ / NIRF Rank 1"
  directorName: string;
  establishedYear: number;
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
    totalPatents: number;
    publicationsIndexed: number;
    grantsMobilizedCr: number;
    activeScholars: number;
    startupsIncubated: number;
  };
}

export interface ResearchDashboardStats {
  activeResearch: number;
  completedResearch: number;
  publications: number;
  patents: number;
  innovationIdeas: number;
  governmentRequests: number;
  universityPartners: number;
  totalFundingCr: number;
  notifications: number;
}

export interface ResearchDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  researchDomain: string;
  problemStatement: string;
  objectives: string[];
  collaborators: Array<{
    id: string;
    name: string;
    type: "Government" | "University" | "Industry" | "Partner Lab";
    logo?: string;
  }>;
  funding: string;
  fundingAgency: string;
  timeline: string;
  progress: number; // 0-100
  status: "Active" | "Completed" | "Pending Review" | "Under Grant Review";
  documents: ResearchDocument[];
  leadScientist: string;
  publishedFindingsCount: number;
}

export type TrlLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface InnovationComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface InnovationIdea {
  id: string;
  title: string;
  category: string;
  trlLevel: TrlLevel;
  trlStageName: string; // e.g. "TRL 4: Lab Prototype Validated"
  status: "Ideation" | "Prototype Validation" | "Field Pilot" | "Commercialization";
  fundingRequired: string;
  fundingCommitted: string;
  mentor: string;
  mentorAffiliation: string;
  votes: number;
  hasVoted?: boolean;
  comments: InnovationComment[];
  description: string;
  createdDate: string;
}

export type PublicationType =
  | "Research Paper"
  | "Conference Paper"
  | "White Paper"
  | "Technical Report"
  | "Patent";

export interface Publication {
  id: string;
  title: string;
  type: PublicationType;
  authors: string[];
  journalOrVenue: string;
  year: number;
  doi?: string;
  patentNumber?: string;
  status: "Published" | "Accepted" | "Filed" | "Granted";
  abstract: string;
  citationsCount: number;
  downloadCount: number;
  pdfUrl: string;
  tags: string[];
}

export interface DatasetItem {
  id: string;
  name: string;
  category: string;
  description: string;
  recordCount: string;
  source: string;
  lastUpdated: string;
  format: "CSV" | "JSON" | "GeoJSON" | "Parquet";
  fileSize: string;
  downloadUrl: string;
  previewRows: Array<Record<string, string | number>>;
  schemaColumns: Array<{ key: string; label: string; type: string }>;
}

export interface GovtRfpRequest {
  id: string;
  title: string;
  department: string;
  jurisdiction: string;
  budgetEst: string;
  deadline: string;
  scope: string;
  status: "Open for Proposals" | "Under Evaluation" | "Shortlisted";
  rfpPdfUrl: string;
  priority: "High" | "Critical" | "Standard";
}

export interface AcademicPartnership {
  id: string;
  universityName: string;
  leadDepartment: string;
  mouSignDate: string;
  activeJointGrants: number;
  collaboratingFaculty: string[];
  focusArea: string;
  status: "Active MoU" | "Pending Renewal";
}

export interface ResearchReport {
  id: string;
  title: string;
  type: "Grant Utilization" | "Annual Research Output" | "Patent Portfolio" | "Consortium Telemetry";
  period: string;
  generatedDate: string;
  size: string;
  format: "PDF" | "Excel";
  fileUrl: string;
}

export interface ResearchNotification {
  id: string;
  title: string;
  description: string;
  category: "grant" | "publication" | "patent" | "collaboration" | "system";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}
