export type UniversityRole = "faculty" | "student";

export interface UniversityUser {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role: UniversityRole;
  avatarUrl?: string;
  universityName: string;
  institution?: string;
  department: string;
  specialization?: string;
  designation?: string;
  employeeIdOrRollNumber?: string;
  rollNumber?: string;
  phone?: string;
}

export type ProjectStatus =
  | "proposed"
  | "approved"
  | "in_progress"
  | "review"
  | "review_pending"
  | "completed"
  | "rejected"
  | "planning";

export type ProjectPriority = "low" | "medium" | "high" | "critical" | "urgent";

export interface StudentTeamMember {
  id: string;
  name: string;
  email?: string;
  roleInProject?: string;
  yearOrProgram?: string;
  avatarUrl?: string;
  rollNumber?: string;
  department?: string;
  institution?: string;
  role?: string;
  attendanceRate?: number;
  contributionScore?: number;
}

export interface ResearchMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: "pending" | "submitted" | "approved" | "needs_revision" | "completed" | "in_progress";
  deliverableFileUrl?: string;
  facultyFeedback?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  fileType: "pdf" | "code" | "dataset" | "cad";
  downloadUrl: string;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorRole: UniversityRole | "department_officer";
  avatarUrl?: string;
  content: string;
  timestamp: string;
}

export interface ProjectMediaItem {
  id: string;
  title: string;
  type: "image" | "video" | "document";
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface ResearchProject {
  id: string;
  code?: string;
  title: string;
  description: string;
  problemStatement: string;
  linkedMunicipalGrievanceId?: string;
  governmentReference?: any;
  aiCategory?: string;
  category?: string;
  municipalDepartment: string;
  department?: string;
  facultyAdvisor: {
    id: string;
    name: string;
    designation: string;
    department: string;
  };
  assignedStudents: StudentTeamMember[];
  assignedStudentIds?: string[];
  assignedTeam?: { id: string; name: string };
  creditPoints?: number;
  status: ProjectStatus;
  priority: ProjectPriority;
  fundingGrantAmount?: string;
  fundingAmount?: number;
  startDate: string;
  targetCompletionDate: string;
  deadline?: string;
  progressPercentage: number;
  progress?: number;
  location?: string;
  documents?: ProjectFile[];
  images?: string[];
  videos?: string[];
  milestones: ResearchMilestone[];
  files: ProjectFile[];
  comments: DiscussionComment[];
}

export interface AcademicTeamMemberContribution {
  studentId: string;
  studentName: string;
  role: string;
  avatarUrl?: string;
  attendanceRate: number;
  tasksCompleted: number;
  hoursLogged: number;
  contributionPercentage: number;
}

export interface AcademicTeam {
  id: string;
  name: string;
  projectId?: string;
  projectTitle?: string;
  leaderId?: string;
  leaderName?: string;
  assignedProjectId?: string;
  assignedProjectTitle?: string;
  department?: string;
  progress?: number;
  leader?: StudentTeamMember;
  members: StudentTeamMember[];
  assignedFacultyId?: string;
  assignedFacultyName?: string;
  attendanceRate?: number;
  progressPercentage?: number;
  contributions?: AcademicTeamMemberContribution[];
  status: "active" | "completed" | "planning";
  createdAt?: string;
}

export interface InnovationAIIdea {
  id: string;
  title: string;
  department: string;
  category?: string;
  problemStatement?: string;
  aiApproach?: string;
  readinessLevel?: string;
  author?: string;
  authorRole?: UniversityRole;
  upvotes?: number;
  isUpvoted?: boolean;
  tags?: string[];
  description?: string;
  civicImpactScore?: number;
  submittedBy?: string;
  votes?: number;
  status?: string;
}

export interface InnovationPrototype {
  id: string;
  title: string;
  category?: string;
  status?: "Field Tested" | "Alpha Lab" | "Beta Pilot" | "Municipal Trial" | string;
  description: string;
  techStack?: string[];
  demoUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  teamName?: string;
  leadFaculty?: string;
  stars?: number;
  trlLevel?: number;
  patentStatus?: string;
  teamLead?: string;
  municipalDeployment?: string;
  department?: string;
}

export interface HackathonProject {
  id: string;
  title: string;
  event?: string;
  award?: string;
  year?: number;
  description: string;
  teamMembers?: string[];
  department?: string;
  solutionUrl?: string;
  status?: string;
  deadline?: string;
  organizer?: string;
  prizePool?: string;
  registeredTeams?: number;
}

export interface GovernmentChallenge {
  id: string;
  refCode?: string;
  title: string;
  department: string;
  description?: string;
  grantBudget?: string;
  deadline?: string;
  urgency?: "critical" | "high" | "medium";
  submissionCount?: number;
  bounty?: string;
  problemStatement?: string;
  closingDate?: string;
  submissionsCount?: number;
}

export interface IndustryCollaboration {
  id: string;
  companyName?: string;
  name?: string;
  domain?: string;
  focusArea?: string;
  offering?: string;
  mentorName?: string;
  activeProjects?: number;
  status?: "Active Partner" | "MOU Signed" | "Grant Provider" | string;
  logoText?: string;
  sponsoredFunding?: string;
}

export interface ResearchTask {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description: string;
  assignedStudentId: string;
  assignedStudentName: string;
  dueDate: string;
  status: "todo" | "in_progress" | "review" | "done" | "completed";
  priority: ProjectPriority;
  notes?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  department: string;
  university: string;
  abstract: string;
  category: string;
  publishedYear: number;
  publicationYear?: number;
  conferenceOrJournal: string;
  journalOrConference?: string;
  doi: string;
  downloadCount: number;
  citationsCount?: number;
  citationCount?: number;
  keywords?: string[];
  pdfUrl: string;
}

export interface ResearchProposal {
  id: string;
  title: string;
  municipalDepartment: string;
  problemSummary?: string;
  summary?: string;
  estimatedBudget: string | number;
  targetDomain?: string;
  department?: string;
  submittedBy?: string;
  deadline?: string;
  submittedAt: string;
  status: "pending_review" | "adopted" | "declined" | "open";
}

export interface FacultyDashboardStats {
  activeProjects: number;
  totalStudentsAssigned: number;
  totalStudentsSupervised?: number;
  pendingReviewsCount: number;
  pendingProposalReviews?: number;
  studentTeamsCount?: number;
  researchProgressPercentage?: number;
  innovationScore?: number;
  governmentRequestsCount?: number;
  publishedPapers: number;
  grantUtilizationRate: number;
  totalGrantFunding?: number;
  averageMilestoneCompletionRate?: number;
}

export interface StudentDashboardStats {
  assignedProjectsCount: number;
  assignedProjects?: number;
  pendingTasksCount: number;
  pendingTasks?: number;
  completedMilestonesCount: number;
  submittedArtifacts?: number;
  unreadFacultyMessagesCount: number;
  researchHoursLogged?: number;
  academicCreditsEarned?: number;
  academicCreditsTotal?: number;
  skillScore?: number;
  innovationPoints?: number;
  certificatesEarnedCount?: number;
}
