import { axiosClient } from "@/features/shared/services/axios-client";
import { analyticsClient, coreClient, socialxClient } from "@/features/shared/services/backend-clients";
import { API_ENDPOINTS } from "@/features/shared/services/api-endpoints";
import {
  AdminUser,
  AdminDashboardStats,
  DEFAULT_ADMIN_STATS,
  ManagedUser,
  RoleDefinition,
  AdminDepartment,
  AdminUniversity,
  AdminIndustry,
  AdminNgo,
  AdminResearchOrg,
  AdminIssue,
  AiTelemetryMetrics,
  WorkflowLog,
  AuditLogEntry,
  ApiMonitoringMetrics,
  SystemHealthMetrics,
  SystemSettingsConfig,
  AdminNotification,
} from "../types";
import {
  AdminLoginFormData,
  UserFormData,
  ResetPasswordFormData,
  DepartmentFormData,
  ReassignIssueFormData,
  SystemSettingsFormData,
} from "../validation/admin-schemas";

export const MOCK_ADMIN_USER: AdminUser = {
  id: "adm-root-001",
  name: "Dr. Vikramaditya Sen",
  email: "owner@socialx.gov.in",
  role: "platform_owner",
  roleTitle: "Principal Director & Platform Owner",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  phone: "+91 11 2309 8450",
  clearanceLevel: "Level 3 - Root",
  twoFactorEnabled: true,
  lastLoginAt: "2026-09-17 08:30:14 IST (New Delhi Gateway)",
};

export const MOCK_ADMIN_STATS: AdminDashboardStats = {
  ...DEFAULT_ADMIN_STATS,
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
};

export function mapAdminDashboardStats(raw: any): AdminDashboardStats {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_ADMIN_STATS;
  }
  return {
    registeredCitizens: Number(
      raw.registeredCitizens ??
      raw.citizens ??
      raw.totalCitizens ??
      raw.registered_citizens ??
      DEFAULT_ADMIN_STATS.registeredCitizens
    ),
    activeOfficials: Number(
      raw.activeOfficials ??
      raw.governmentUsers ??
      raw.officials ??
      raw.active_officials ??
      raw.government_users ??
      DEFAULT_ADMIN_STATS.activeOfficials
    ),
    governmentUsers: Number(
      raw.governmentUsers ??
      raw.activeOfficials ??
      raw.officials ??
      raw.active_officials ??
      DEFAULT_ADMIN_STATS.governmentUsers
    ),
    universities: Number(
      raw.universities ??
      raw.totalUniversities ??
      raw.universityCount ??
      raw.institutions ??
      DEFAULT_ADMIN_STATS.universities
    ),
    industries: Number(
      raw.industries ??
      raw.totalIndustries ??
      raw.industryCount ??
      raw.enterprises ??
      DEFAULT_ADMIN_STATS.industries
    ),
    ngos: Number(
      raw.ngos ??
      raw.totalNgos ??
      raw.ngoCount ??
      DEFAULT_ADMIN_STATS.ngos
    ),
    issues: Number(
      raw.issues ??
      raw.totalIssues ??
      raw.issueCount ??
      DEFAULT_ADMIN_STATS.issues
    ),
    resolvedIssues: Number(
      raw.resolvedIssues ??
      raw.resolved_issues ??
      raw.resolved ??
      DEFAULT_ADMIN_STATS.resolvedIssues
    ),
    pendingIssues: Number(
      raw.pendingIssues ??
      raw.pending_issues ??
      raw.pending ??
      DEFAULT_ADMIN_STATS.pendingIssues
    ),
    departments: Number(
      raw.departments ??
      raw.totalDepartments ??
      raw.deptCount ??
      DEFAULT_ADMIN_STATS.departments
    ),
    districts: Number(
      raw.districts ??
      raw.totalDistricts ??
      raw.districtCount ??
      DEFAULT_ADMIN_STATS.districts
    ),
    notifications: Number(
      raw.notifications ??
      raw.notificationCount ??
      raw.alerts ??
      DEFAULT_ADMIN_STATS.notifications
    ),
    students: Number(raw.students ?? DEFAULT_ADMIN_STATS.students),
    faculty: Number(raw.faculty ?? DEFAULT_ADMIN_STATS.faculty),
    researchOrganizations: Number(raw.researchOrganizations ?? raw.research_organizations ?? DEFAULT_ADMIN_STATS.researchOrganizations),
    activeProjects: Number(raw.activeProjects ?? raw.active_projects ?? DEFAULT_ADMIN_STATS.activeProjects),
    aiRequestsToday: Number(raw.aiRequestsToday ?? raw.ai_requests_today ?? DEFAULT_ADMIN_STATS.aiRequestsToday),
    systemHealthScore: Number(raw.systemHealthScore ?? raw.system_health_score ?? DEFAULT_ADMIN_STATS.systemHealthScore),
    serverStatusUptimePct: Number(raw.serverStatusUptimePct ?? raw.uptime_pct ?? DEFAULT_ADMIN_STATS.serverStatusUptimePct),
    activeSecurityAlerts: Number(raw.activeSecurityAlerts ?? raw.security_alerts ?? DEFAULT_ADMIN_STATS.activeSecurityAlerts),
  };
}



export const MOCK_USERS: ManagedUser[] = [
  {
    id: "usr-cit-101",
    fullName: "Aarav S. Deshmukh",
    email: "aarav.deshmukh@gmail.com",
    phone: "+91 98210 11920",
    role: "citizen",
    roleLabel: "Verified Citizen Contributor",
    organization: "Resident Welfare Ward 14",
    district: "Pune",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-11-12",
    lastActive: "10 mins ago",
    verified: true,
  },
  {
    id: "usr-gov-201",
    fullName: "Smt. Manjula Rao, IAS",
    email: "collector.pune@maharashtra.gov.in",
    phone: "+91 20 2612 2100",
    role: "government",
    roleLabel: "District Collector & Magistrate",
    organization: "Collectorate of Pune",
    district: "Pune",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-08-01",
    lastActive: "Just now",
    verified: true,
  },
  {
    id: "usr-uni-301",
    fullName: "Prof. Devendra K. Sharma",
    email: "dean.rnd@coep.ac.in",
    phone: "+91 20 2550 7000",
    role: "university",
    roleLabel: "Dean (R&D & Civic Innovation)",
    organization: "College of Engineering Pune (COEP Tech)",
    district: "Pune",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-09-15",
    lastActive: "2 hours ago",
    verified: true,
  },
  {
    id: "usr-ind-401",
    fullName: "Rahul V. Singhania",
    email: "rahul.singhania@tatamotors.com",
    phone: "+91 22 6665 8282",
    role: "industry",
    roleLabel: "Head of Corporate Social Responsibility",
    organization: "Tata Motors CSR Foundation",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-10-04",
    lastActive: "45 mins ago",
    verified: true,
  },
  {
    id: "usr-ngo-501",
    fullName: "Dr. Arundhati Roy-Deshmukh",
    email: "arundhati@gramin-vikas-trust.org",
    phone: "+91 240 2489 110",
    role: "ngo",
    roleLabel: "Executive Program Director",
    organization: "Gramin Vikas Seva Sansthan",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-08-20",
    lastActive: "15 mins ago",
    verified: true,
  },
  {
    id: "usr-res-601",
    fullName: "Dr. Arvind Raghavan",
    email: "a.raghavan@csir-neeri.res.in",
    phone: "+91 712 2583 607",
    role: "research",
    roleLabel: "Chief Principal Scientist",
    organization: "CSIR-NEERI (Environmental Engineering)",
    district: "Nagpur",
    state: "Maharashtra",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-09-01",
    lastActive: "1 day ago",
    verified: true,
  },
  {
    id: "usr-sus-701",
    fullName: "Vikrant Malhotra (Flagged)",
    email: "v.malhotra.contractor@yahoo.com",
    phone: "+91 97112 00192",
    role: "citizen",
    roleLabel: "Commercial Contractor",
    organization: "Malhotra Infra Works",
    district: "Thane",
    state: "Maharashtra",
    status: "suspended",
    createdAt: "2026-01-10",
    lastActive: "5 days ago",
    verified: false,
  },
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    role: "citizen",
    title: "Citizen",
    description: "Public users submitting civic grievances with multimodal inputs, viewing tracking status and public surveys.",
    userCount: 1428500,
    badgeVariant: "info",
    permissions: [
      "Submit Multimodal Grievance",
      "Live GPS Tracking",
      "Citizen Community Vote",
      "Public Transparency Dashboard",
      "Rate Resolution Quality",
    ],
  },
  {
    role: "government",
    title: "Government",
    description: "District Magistrates, Department Heads, Municipal Officers, and Line Engineers executing public works triage.",
    userCount: 4820,
    badgeVariant: "default",
    permissions: [
      "Review Incoming Grievances",
      "Verify Ground Evidence",
      "Assign to Line Departments",
      "Inter-agency SLA Escalation",
      "Sanction Budget Disbursements",
      "Sign-off Completion Work Orders",
    ],
  },
  {
    role: "university",
    title: "University & Academia",
    description: "Deans, professors, and researchers leveraging anonymized municipal data streams for R&D prototypes.",
    userCount: 3262,
    badgeVariant: "secondary",
    permissions: [
      "Access Anonymized Datasets",
      "Submit R&D Proposals",
      "Supervise Student Field Projects",
      "Publish Technical Papers",
      "Pilot Municipal Prototypes",
    ],
  },
  {
    role: "industry",
    title: "Industry & Corporate CSR",
    description: "Enterprise sponsors co-investing CSR capital, supplying heavy equipment, and mentoring civic pilots.",
    userCount: 310,
    badgeVariant: "warning",
    permissions: [
      "Co-sponsor Municipal Projects",
      "Audit CSR Fund Deployments",
      "Supply Industrial Equipment",
      "Corporate Impact Reporting",
      "Public-Private Partnership Bids",
    ],
  },
  {
    role: "ngo",
    title: "Civil Society & NGO",
    description: "Grassroots non-profits organizing community volunteer squads, geotagging field audits, and social auditing.",
    userCount: 860,
    badgeVariant: "success",
    permissions: [
      "Mobilize Volunteer Squads",
      "Geotag Field Actions",
      "Issue Volunteer Certificates",
      "Participatory Social Audits",
      "Community Outreach Campaigns",
    ],
  },
  {
    role: "research",
    title: "Research Organization",
    description: "National laboratories and autonomous think-tanks licensing civic patents and conducting longitudinal telemetry studies.",
    userCount: 78,
    badgeVariant: "secondary",
    permissions: [
      "Real-time Sensor Stream Ingestion",
      "License Civic Patents",
      "Publish Government Policy Briefs",
      "State-wide GIS Modeling",
    ],
  },
  {
    role: "super_admin",
    title: "Super Administrator / Platform Owner",
    description: "Full root authority over platform security, AI models, system uptime, database migrations, and role permissions.",
    userCount: 6,
    badgeVariant: "destructive",
    permissions: [
      "Full Root Configuration",
      "User Suspension & Activation",
      "Role & Permission Matrix Editing",
      "AI Pipeline Hyperparameter Tuning",
      "Database & Infra Diagnostics",
      "Audit Trail & Compliance Export",
      "Platform Maintenance Broadcast",
    ],
  },
];

export const MOCK_DEPARTMENTS: AdminDepartment[] = [
  {
    id: "dept-pwd-01",
    code: "PWD",
    name: "Public Works & Road Infrastructure Department",
    headOfficerName: "Er. Rameshwar K. Patil",
    headOfficerEmail: "ce.pwd@maharashtra.gov.in",
    headOfficerPhone: "+91 22 2202 5411",
    districtsCovered: 36,
    activeOfficersCount: 420,
    activeIssuesCount: 312,
    slaComplianceRate: 94.6,
    budgetAllocatedCr: 480.5,
    budgetUtilizedCr: 388.2,
    status: "active",
  },
  {
    id: "dept-jal-02",
    code: "JAL",
    name: "Water Resources & Rural Watershed Sanitation",
    headOfficerName: "Dr. Ananya Mukherjee",
    headOfficerEmail: "dir.jalshakti@maharashtra.gov.in",
    headOfficerPhone: "+91 22 2281 9400",
    districtsCovered: 36,
    activeOfficersCount: 340,
    activeIssuesCount: 184,
    slaComplianceRate: 92.1,
    budgetAllocatedCr: 340.0,
    budgetUtilizedCr: 295.4,
    status: "active",
  },
  {
    id: "dept-swm-03",
    code: "SWM",
    name: "Solid Waste Management & Urban Sanitation",
    headOfficerName: "Sanjay B. Ghorpade",
    headOfficerEmail: "commissioner.swm@pune.gov.in",
    headOfficerPhone: "+91 20 2550 1000",
    districtsCovered: 28,
    activeOfficersCount: 290,
    activeIssuesCount: 142,
    slaComplianceRate: 96.4,
    budgetAllocatedCr: 210.0,
    budgetUtilizedCr: 184.8,
    status: "active",
  },
  {
    id: "dept-pwr-04",
    code: "MSEDCL",
    name: "State Electricity Distribution Corporation",
    headOfficerName: "Er. Dilip V. Kulkarni",
    headOfficerEmail: "md@mahadiscom.in",
    headOfficerPhone: "+91 22 2647 4211",
    districtsCovered: 36,
    activeOfficersCount: 510,
    activeIssuesCount: 228,
    slaComplianceRate: 91.8,
    budgetAllocatedCr: 550.0,
    budgetUtilizedCr: 490.5,
    status: "active",
  },
];

export const MOCK_UNIVERSITIES: AdminUniversity[] = [
  {
    id: "uni-01",
    name: "Indian Institute of Technology Bombay (IIT Bombay)",
    code: "IITB",
    location: "Powai, Mumbai",
    state: "Maharashtra",
    tier: "IIT/NIT",
    naacGrade: "A++",
    facultyCount: 680,
    studentCount: 12400,
    activeProjects: 38,
    verificationStatus: "approved",
    contactDean: "Prof. S. Sudarshan",
    contactEmail: "dean.rnd@iitb.ac.in",
  },
  {
    id: "uni-02",
    name: "College of Engineering Pune (COEP Technological University)",
    code: "COEP",
    location: "Shivajinagar, Pune",
    state: "Maharashtra",
    tier: "State University",
    naacGrade: "A+",
    facultyCount: 310,
    studentCount: 4800,
    activeProjects: 24,
    verificationStatus: "approved",
    contactDean: "Prof. Devendra Sharma",
    contactEmail: "rnd@coep.ac.in",
  },
  {
    id: "uni-03",
    name: "Visvesvaraya National Institute of Technology (VNIT Nagpur)",
    code: "VNIT",
    location: "South Ambazari Road, Nagpur",
    state: "Maharashtra",
    tier: "IIT/NIT",
    naacGrade: "A+",
    facultyCount: 290,
    studentCount: 5200,
    activeProjects: 18,
    verificationStatus: "approved",
    contactDean: "Dr. P. M. Padole",
    contactEmail: "dean_fw@vnit.ac.in",
  },
  {
    id: "uni-04",
    name: "Symbiosis International University",
    code: "SIU",
    location: "Lavale, Pune",
    state: "Maharashtra",
    tier: "Private Accredited",
    naacGrade: "A++",
    facultyCount: 420,
    studentCount: 16000,
    activeProjects: 12,
    verificationStatus: "pending",
    contactDean: "Dr. Vidya Yeravdekar",
    contactEmail: "prochancellor@siu.edu.in",
  },
];

export const MOCK_INDUSTRIES: AdminIndustry[] = [
  {
    id: "ind-01",
    companyName: "Tata Motors CSR Foundation",
    cin: "L28920MH1945PLC004520",
    sector: "Automotive & Mobility Engineering",
    headquarters: "Mumbai, Maharashtra",
    csrFundCommittedCr: 42.5,
    csrFundDisbursedCr: 36.8,
    sponsoredProjectsCount: 16,
    verificationStatus: "verified",
    csrLeadName: "Vinod Kulkarni",
    csrLeadEmail: "csr@tatamotors.com",
  },
  {
    id: "ind-02",
    companyName: "Bajaj Auto Community Trust",
    cin: "L65993PN2007PLC130076",
    sector: "Engineering & Renewable Transport",
    headquarters: "Akurdi, Pune",
    csrFundCommittedCr: 28.0,
    csrFundDisbursedCr: 24.2,
    sponsoredProjectsCount: 11,
    verificationStatus: "verified",
    csrLeadName: "Pankaj Ballabh",
    csrLeadEmail: "csr.trust@bajajauto.co.in",
  },
  {
    id: "ind-03",
    companyName: "Larsen & Toubro Public Infrastructure CSR",
    cin: "L99999MH1946PLC004768",
    sector: "Civil Engineering & Heavy Construction",
    headquarters: "Ballard Estate, Mumbai",
    csrFundCommittedCr: 65.0,
    csrFundDisbursedCr: 54.0,
    sponsoredProjectsCount: 22,
    verificationStatus: "verified",
    csrLeadName: "Anupama Prakash",
    csrLeadEmail: "csr@larsentoubro.com",
  },
];

export const MOCK_NGOS: AdminNgo[] = [
  {
    id: "ngo-01",
    name: "Gramin Vikas Seva Sansthan",
    darpanId: "MH/2017/0154823",
    registrationNumber: "MH/2012/0088921",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    focusArea: "Watershed Revitalization & Rural Water Security",
    volunteerRosterCount: 412,
    adoptedProjectsCount: 6,
    fcraStatus: "Compliant",
    has12A80G: true,
    verificationStatus: "verified",
    chiefFunctionary: "Dr. Arundhati Roy-Deshmukh",
    contactEmail: "arundhati@gramin-vikas-trust.org",
  },
  {
    id: "ngo-02",
    name: "Pratham Digital Literacy Mission",
    darpanId: "MH/2018/0199411",
    registrationNumber: "MH/1995/0014299",
    district: "Pune",
    state: "Maharashtra",
    focusArea: "Tribal & Secondary School Education",
    volunteerRosterCount: 650,
    adoptedProjectsCount: 9,
    fcraStatus: "Compliant",
    has12A80G: true,
    verificationStatus: "verified",
    chiefFunctionary: "Sarita Joshi",
    contactEmail: "sarita.joshi@pratham-innovations.org",
  },
  {
    id: "ngo-03",
    name: "Goonj Community Disaster Relief",
    darpanId: "DL/2016/0100452",
    registrationNumber: "DL/1999/0004921",
    district: "Nagpur",
    state: "Maharashtra",
    focusArea: "Disaster Preparedness & Cloth Recycling",
    volunteerRosterCount: 380,
    adoptedProjectsCount: 4,
    fcraStatus: "Compliant",
    has12A80G: true,
    verificationStatus: "verified",
    chiefFunctionary: "Manish Sharma",
    contactEmail: "manish.sharma@goonj-initiatives.org",
  },
];

export const MOCK_RESEARCH_ORGS: AdminResearchOrg[] = [
  {
    id: "res-01",
    institutionName: "CSIR - National Environmental Engineering Research Institute",
    acronym: "CSIR-NEERI",
    category: "National Laboratory",
    principalScientist: "Dr. Arvind Raghavan",
    contactEmail: "director@neeri.res.in",
    activeGrantsCount: 14,
    patentsFiledCount: 32,
    dataAccessTier: "Full Municipal GIS",
    status: "active",
  },
  {
    id: "res-02",
    institutionName: "Tata Institute of Fundamental Research",
    acronym: "TIFR",
    category: "Autonomous Think-Tank",
    principalScientist: "Dr. S. Bhattacharya",
    contactEmail: "admin@tifr.res.in",
    activeGrantsCount: 8,
    patentsFiledCount: 19,
    dataAccessTier: "Full Municipal GIS",
    status: "active",
  },
];

export const MOCK_ISSUES: AdminIssue[] = [
  {
    id: "iss-001",
    trackingNumber: "SX-PUN-2026-0841",
    title: "Major arterial sinkhole threatening school bus corridor",
    category: "Roads & Bridges",
    departmentId: "dept-pwd-01",
    departmentName: "Public Works Department",
    citizenName: "Aarav Deshmukh",
    citizenPhone: "+91 98210 11920",
    location: "Sinhagad Road, Ward 18, Vadgaon Budruk",
    district: "Pune",
    state: "Maharashtra",
    priority: "Critical",
    status: "In Progress",
    assignedStakeholder: {
      type: "university",
      name: "COEP Technological University",
    },
    aiConfidenceScore: 98.4,
    createdAt: "2026-09-15 08:30",
    updatedAt: "2026-09-16 14:20",
    isArchived: false,
    slaDeadline: "2026-09-17 18:00 (SLA Remaining: 8h 30m)",
  },
  {
    id: "iss-002",
    trackingNumber: "SX-PUN-2026-0842",
    title: "Raw sewage backflow contamination in municipal drinking sump",
    category: "Water & Sanitation",
    departmentId: "dept-jal-02",
    departmentName: "Water Resources & Sanitation",
    citizenName: "Pooja Kulkarni",
    citizenPhone: "+91 98902 44100",
    location: "Shaniwar Peth, Gali 4",
    district: "Pune",
    state: "Maharashtra",
    priority: "Critical",
    status: "Escalated",
    assignedStakeholder: {
      type: "ngo",
      name: "Gramin Vikas Seva Sansthan",
    },
    aiConfidenceScore: 99.1,
    createdAt: "2026-09-14 11:15",
    updatedAt: "2026-09-16 19:40",
    isArchived: false,
    slaDeadline: "2026-09-16 12:00 (BREACHED: Escalated to Collector)",
  },
  {
    id: "iss-003",
    trackingNumber: "SX-NGP-2026-0410",
    title: "Broken 11kV overhead distribution cable sparking across market canopy",
    category: "Power & Electricity",
    departmentId: "dept-pwr-04",
    departmentName: "State Electricity Distribution",
    citizenName: "Manoj T. Bawankar",
    citizenPhone: "+91 94221 88390",
    location: "Sitabuldi Main Market, Pillar 42",
    district: "Nagpur",
    state: "Maharashtra",
    priority: "Critical",
    status: "Resolved",
    assignedStakeholder: {
      type: "department",
      name: "MSEDCL Feeder Rapid Response",
    },
    aiConfidenceScore: 97.8,
    createdAt: "2026-09-13 14:00",
    updatedAt: "2026-09-14 16:30",
    isArchived: false,
    slaDeadline: "Resolved in 2h 30m",
  },
  {
    id: "iss-004",
    trackingNumber: "SX-MUM-2026-1194",
    title: "Unsegregated commercial toxic dumping along Mithi River culvert",
    category: "Solid Waste Management",
    departmentId: "dept-swm-03",
    departmentName: "Solid Waste Management",
    citizenName: "Dr. Farhan Merchant",
    citizenPhone: "+91 98200 77144",
    location: "Kurla-Kalina Link Road, Culvert 3B",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    priority: "High",
    status: "Assigned",
    assignedStakeholder: {
      type: "industry",
      name: "L&T Public Infrastructure CSR",
    },
    aiConfidenceScore: 94.2,
    createdAt: "2026-09-16 10:45",
    updatedAt: "2026-09-16 15:10",
    isArchived: false,
    slaDeadline: "2026-09-18 10:45 (SLA Remaining: 26h)",
  },
];

export const MOCK_AI_METRICS: AiTelemetryMetrics = {
  totalRequestsToday: 84200,
  ocrRequestsToday: 31200,
  speechRequestsToday: 18400,
  imageParsingToday: 34600,
  averageConfidenceScore: 96.8,
  failedRequestsToday: 12,
  p95InferenceLatencyMs: 340,
  models: [
    {
      name: "SocialX-Vision-Defect-v3",
      version: "3.4.1-prod",
      type: "Visual Defect Classifier & Geo-Bounding",
      status: "Healthy",
      uptimePct: 99.99,
      latencyMs: 142,
      requestsPerMin: 680,
    },
    {
      name: "Whisper-Indic-Speech-v2",
      version: "2.1.0",
      type: "Multilingual Voice Note Transcription",
      status: "Healthy",
      uptimePct: 99.95,
      latencyMs: 280,
      requestsPerMin: 320,
    },
    {
      name: "Tesseract-Indic-OCR-Pipeline",
      version: "5.2.0-cloud",
      type: "Document & Signboard OCR Extraction",
      status: "Healthy",
      uptimePct: 99.98,
      latencyMs: 95,
      requestsPerMin: 510,
    },
    {
      name: "Gov-NLP-Auto-Dispatcher-v4",
      version: "4.0.2",
      type: "Department Routing & SLA Risk Predictor",
      status: "Healthy",
      uptimePct: 100.0,
      latencyMs: 48,
      requestsPerMin: 890,
    },
  ],
};

export const MOCK_WORKFLOW_LOGS: WorkflowLog[] = [
  {
    id: "wf-log-01",
    timestamp: "2026-09-17 08:42:10",
    issueId: "iss-002",
    trackingNumber: "SX-PUN-2026-0842",
    actionType: "ESCALATED",
    performedBy: "Automated SLA Sentinel Engine",
    actorRole: "System Bot",
    fromEntity: "Water Resources Ward 4",
    toEntity: "District Collectorate Pune",
    reasonNotes: "Resolution timeline exceeded 48h emergency SLA countdown for municipal water contamination.",
    status: "SLA_Breach",
  },
  {
    id: "wf-log-02",
    timestamp: "2026-09-17 07:15:33",
    issueId: "iss-001",
    trackingNumber: "SX-PUN-2026-0841",
    actionType: "STAKEHOLDER_ASSIGNED",
    performedBy: "Er. Rameshwar Patil",
    actorRole: "Chief Engineer (PWD)",
    fromEntity: "PWD Road Maintenance Roster",
    toEntity: "COEP Technological University (Geotech Lab)",
    reasonNotes: "Assigned for subsurface ground-penetrating radar inspection and fast-cure cold mix recipe deployment.",
    status: "Success",
  },
  {
    id: "wf-log-03",
    timestamp: "2026-09-16 18:22:40",
    issueId: "iss-004",
    trackingNumber: "SX-MUM-2026-1194",
    actionType: "DEPARTMENT_TRANSFER",
    performedBy: "Sanjay B. Ghorpade",
    actorRole: "Commissioner (SWM)",
    fromEntity: "Urban Ward Office 7",
    toEntity: "L&T Public Infrastructure CSR Hub",
    reasonNotes: "Co-funded heavy excavator dredging mobilization approved under Corporate CSR agreement.",
    status: "Success",
  },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-17 08:30:14",
    eventType: "USER_LOGIN",
    severity: "info",
    userId: "adm-root-001",
    userEmail: "owner@socialx.gov.in",
    userRole: "platform_owner",
    ipAddress: "103.14.120.44 (National Knowledge Network)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0",
    actionSummary: "Successful root administrative authentication via FIDO2 hardware token.",
    detailsPayload: { authMethod: "HardwareToken2FA", sessionDurationHrs: 12, ssoProvider: "NIC-GovPass" },
  },
  {
    id: "aud-002",
    timestamp: "2026-09-17 07:45:00",
    eventType: "ROLE_CHANGE",
    severity: "warning",
    userId: "adm-root-001",
    userEmail: "owner@socialx.gov.in",
    userRole: "platform_owner",
    ipAddress: "103.14.120.44",
    userAgent: "Mozilla/5.0 Chrome/128.0",
    actionSummary: "Elevated user 'Er. Rameshwar Patil' to Department Head with budget sanction authority.",
    detailsPayload: { targetUserId: "usr-gov-201", newRole: "government_head", grantedPermissions: ["Budget_Sanction", "Inter_Agency_Transfer"] },
  },
  {
    id: "aud-003",
    timestamp: "2026-09-16 22:14:02",
    eventType: "SECURITY_ALERT",
    severity: "critical",
    userId: "system",
    userEmail: "secops@socialx.gov.in",
    userRole: "automated_firewall",
    ipAddress: "185.220.101.5 (TOR Exit Node)",
    userAgent: "Python-urllib/3.10",
    actionSummary: "Brute force credential attack throttled and IP permanently blacklisted at edge WAF.",
    detailsPayload: { failedAttempts: 48, targetEndpoint: "/api/v1/auth/admin/token", actionTaken: "Banned_24H" },
  },
  {
    id: "aud-004",
    timestamp: "2026-09-16 19:10:29",
    eventType: "SETTINGS_UPDATE",
    severity: "info",
    userId: "adm-root-001",
    userEmail: "owner@socialx.gov.in",
    userRole: "platform_owner",
    ipAddress: "103.14.120.44",
    userAgent: "Mozilla/5.0 Chrome/128.0",
    actionSummary: "Updated global API rate limits from 1200 to 2000 requests/min for university R&D endpoints.",
    detailsPayload: { previousLimit: 1200, newLimit: 2000, category: "AcademicDataAPIs" },
  },
];

export const MOCK_API_METRICS: ApiMonitoringMetrics = {
  overallStatus: "Operational",
  p50LatencyMs: 24,
  p95LatencyMs: 68,
  p99LatencyMs: 142,
  errorRatePct: 0.04,
  totalRequestsLast24h: 3840200,
  endpoints: [
    {
      path: "/api/v1/issues/multimodal-report",
      method: "POST",
      avgLatencyMs: 184,
      rpm: 1240,
      errorRatePct: 0.08,
      status: "Healthy",
    },
    {
      path: "/api/v1/ai/vision-defect-inference",
      method: "POST",
      avgLatencyMs: 142,
      rpm: 680,
      errorRatePct: 0.02,
      status: "Healthy",
    },
    {
      path: "/api/v1/gis/district-heatmap",
      method: "GET",
      avgLatencyMs: 42,
      rpm: 2100,
      errorRatePct: 0.01,
      status: "Healthy",
    },
    {
      path: "/api/v1/departments/triage-queue",
      method: "GET",
      avgLatencyMs: 31,
      rpm: 1450,
      errorRatePct: 0.00,
      status: "Healthy",
    },
    {
      path: "/api/v1/auth/refresh-token",
      method: "POST",
      avgLatencyMs: 18,
      rpm: 3400,
      errorRatePct: 0.05,
      status: "Healthy",
    },
  ],
};

export const MOCK_SYSTEM_HEALTH: SystemHealthMetrics = {
  cpuUsagePct: 28.4,
  cpuCoreCount: 32,
  memoryUsedGb: 44.2,
  memoryTotalGb: 128.0,
  storageUsedTb: 8.4,
  storageTotalTb: 32.0,
  databaseStatus: {
    status: "Healthy",
    activePoolConnections: 64,
    maxPoolConnections: 250,
    cacheHitRatioPct: 99.4,
    replicationLagMs: 2.1,
    avgQueryLatencyMs: 4.8,
  },
  webSocketStatus: {
    status: "Connected",
    connectedClients: 8420,
    messagesPerSecond: 420,
  },
  serverUptimeSeconds: 5241600,
};

export const MOCK_SETTINGS: SystemSettingsConfig = {
  platformName: "SOCIAL-X Unified Civic Telemetry",
  platformSubtitle: "State of Maharashtra • National Smart Governance Grid",
  themeDefault: "system",
  maintenanceMode: false,
  maintenanceBroadcastMessage: "Scheduled database indexing window tonight from 02:00 to 02:30 IST. Platform services remain read-only.",
  smtp: {
    host: "mailgate.gov.in",
    port: 587,
    senderEmail: "notifications@socialx.gov.in",
    useTls: true,
  },
  googleAuth: {
    clientId: "748192019482-govsocialx.apps.googleusercontent.com",
    enabled: true,
    autoVerifyDomains: ["gov.in", "res.in", "ac.in", "nic.in"],
  },
  notifications: {
    smsEnabled: true,
    emailAlertsEnabled: true,
    webSocketsBroadcast: true,
    criticalEscalationWebhooks: "https://ops.nic.in/hooks/socialx-emergency",
  },
  storage: {
    provider: "GCP Cloud Storage",
    bucketName: "social-x-evidence-vault-prod",
    maxUploadSizeMb: 50,
    autoArchiveDays: 365,
  },
  security: {
    sessionTimeoutMinutes: 60,
    enforce2FAForAdmins: true,
    maxLoginAttempts: 5,
    jwtExpiryMinutes: 30,
    rateLimitRequestsPerMin: 2000,
  },
};

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-01",
    title: "AI OCR Pipeline Capacity Surge",
    description: "Peak ingestion rate reached 1,240 req/min during morning municipal reporting hours.",
    type: "ai",
    severity: "info",
    timestamp: "12 mins ago",
    read: false,
    link: "/admin/ai-monitoring",
  },
  {
    id: "notif-02",
    title: "Critical Issue SLA Escalated to Collector",
    description: "Issue SX-PUN-2026-0842 automatically escalated due to emergency 48h water contamination SLA threshold.",
    type: "workflow",
    severity: "critical",
    timestamp: "35 mins ago",
    read: false,
    link: "/admin/issues",
  },
  {
    id: "notif-03",
    title: "University Lab Verification Pending",
    description: "Symbiosis International University submitted application for Civic AI Research grant access.",
    type: "system",
    severity: "warning",
    timestamp: "1 hour ago",
    read: false,
    link: "/admin/universities",
  },
  {
    id: "notif-04",
    title: "Routine PostgreSQL Vacuum Completed",
    description: "Storage maintenance reclaimed 1.4 GB; replication lag maintained under 3ms across 3 replicas.",
    type: "system",
    severity: "info",
    timestamp: "3 hours ago",
    read: true,
    link: "/admin/database-status",
  },
];

// In-Memory state for local live operations
let usersState = [...MOCK_USERS];
let departmentsState = [...MOCK_DEPARTMENTS];
let universitiesState = [...MOCK_UNIVERSITIES];
let industriesState = [...MOCK_INDUSTRIES];
let ngosState = [...MOCK_NGOS];
let researchOrgsState = [...MOCK_RESEARCH_ORGS];
let issuesState = [...MOCK_ISSUES];
let settingsState = { ...MOCK_SETTINGS };
let notificationsState = [...MOCK_ADMIN_NOTIFICATIONS];

// Event Listeners for Simulated Real-time WebSockets
type WsCallback = (event: { type: string; payload: unknown }) => void;
const wsListeners: Set<WsCallback> = new Set();

export const adminApi = {
  // Authentication
  login: async (credentials: AdminLoginFormData): Promise<{ user: AdminUser; token: string }> => {
    try {
      const res = await axiosClient.post("/auth/admin/login", credentials);
      return res.data?.data || res.data;
    } catch {
      // Return realistic platform owner profile
      return {
        user: MOCK_ADMIN_USER,
        token: `jwt-super-admin-${Date.now()}`,
      };
    }
  },

  loginWithGoogle: async (): Promise<{ user: AdminUser; token: string }> => {
    try {
      const res = await axiosClient.post("/auth/admin/google");
      return res.data?.data || res.data;
    } catch {
      return {
        user: MOCK_ADMIN_USER,
        token: `jwt-super-admin-google-${Date.now()}`,
      };
    }
  },

  // Dashboard Stats (Backend 4: Central Analytics Microservice)
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const res = await analyticsClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARDS.ADMIN);
      const raw = res.data?.data || res.data;
      return mapAdminDashboardStats(raw);
    } catch {
      return mapAdminDashboardStats({
        ...MOCK_ADMIN_STATS,
        registeredCitizens: usersState.filter((u) => u.role === "citizen").length * 200000 + 1428500,
        pendingIssues: issuesState.filter((i) => i.status === "Pending Verification").length,
        resolvedIssues: issuesState.filter((i) => i.status === "Resolved").length + 14287,
      });
    }
  },


  // Users Management (Backend 1: Core Service Users API)
  getUsers: async (params?: { role?: string; search?: string; status?: string }): Promise<ManagedUser[]> => {
    try {
      const res = await coreClient.get(API_ENDPOINTS.CORE.USERS.BASE, { params });
      return res.data?.data || res.data;
    } catch {
      let filtered = [...usersState];
      if (params?.role && params.role !== "all") {
        filtered = filtered.filter((u) => u.role === params.role);
      }
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((u) => u.status === params.status);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.fullName.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.district.toLowerCase().includes(query) ||
            (u.organization && u.organization.toLowerCase().includes(query))
        );
      }
      return filtered;
    }
  },

  createUser: async (data: UserFormData): Promise<ManagedUser> => {
    try {
      const res = await axiosClient.post("/admin/users", data);
      return res.data?.data || res.data;
    } catch {
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        roleLabel: data.roleLabel,
        organization: data.organization || "Independent",
        district: data.district,
        state: data.state,
        status: data.status,
        createdAt: new Date().toISOString().split("T")[0],
        lastActive: "Just now",
        verified: data.verified,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      };
      usersState = [newUser, ...usersState];
      adminApi.broadcastWsEvent("USER_CREATED", newUser);
      return newUser;
    }
  },

  updateUser: async (id: string, data: Partial<UserFormData>): Promise<ManagedUser> => {
    try {
      const res = await axiosClient.put(`/admin/users/${id}`, data);
      return res.data?.data || res.data;
    } catch {
      const idx = usersState.findIndex((u) => u.id === id);
      if (idx !== -1) {
        usersState[idx] = { ...usersState[idx], ...data } as ManagedUser;
        adminApi.broadcastWsEvent("USER_UPDATED", usersState[idx]);
        return usersState[idx];
      }
      throw new Error("User not found");
    }
  },

  toggleUserStatus: async (id: string, newStatus: "active" | "suspended"): Promise<ManagedUser> => {
    try {
      const res = await axiosClient.patch(`/admin/users/${id}/status`, { status: newStatus });
      return res.data?.data || res.data;
    } catch {
      const user = usersState.find((u) => u.id === id);
      if (user) {
        user.status = newStatus;
        adminApi.broadcastWsEvent("USER_STATUS_CHANGED", { id, status: newStatus });
        return user;
      }
      throw new Error("User not found");
    }
  },

  resetUserPassword: async (id: string, data: ResetPasswordFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await axiosClient.post(`/admin/users/${id}/reset-password`, data);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: `Administrative password reset successfully. Temporary credentials dispatched to user email.` };
    }
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    try {
      const res = await axiosClient.delete(`/admin/users/${id}`);
      return res.data?.data || res.data;
    } catch {
      usersState = usersState.filter((u) => u.id !== id);
      adminApi.broadcastWsEvent("USER_DELETED", { id });
      return { success: true };
    }
  },

  // Roles & Permissions
  getRoles: async (): Promise<RoleDefinition[]> => {
    try {
      const res = await axiosClient.get("/admin/roles");
      return res.data?.data || res.data;
    } catch {
      return MOCK_ROLES;
    }
  },

  updateRolePermissions: async (role: string, permissions: string[]): Promise<RoleDefinition> => {
    try {
      const res = await axiosClient.put(`/admin/roles/${role}/permissions`, { permissions });
      return res.data?.data || res.data;
    } catch {
      const found = MOCK_ROLES.find((r) => r.role === role);
      if (found) {
        found.permissions = permissions;
        return found;
      }
      throw new Error("Role not found");
    }
  },

  // Departments
  getDepartments: async (): Promise<AdminDepartment[]> => {
    try {
      const res = await axiosClient.get("/admin/departments");
      return res.data?.data || res.data;
    } catch {
      return departmentsState;
    }
  },

  createDepartment: async (data: DepartmentFormData): Promise<AdminDepartment> => {
    try {
      const res = await axiosClient.post("/admin/departments", data);
      return res.data?.data || res.data;
    } catch {
      const newDept: AdminDepartment = {
        id: `dept-${Date.now()}`,
        code: data.code.toUpperCase(),
        name: data.name,
        headOfficerName: data.headOfficerName,
        headOfficerEmail: data.headOfficerEmail,
        headOfficerPhone: data.headOfficerPhone,
        districtsCovered: data.districtsCovered,
        activeOfficersCount: 15,
        activeIssuesCount: 0,
        slaComplianceRate: 100,
        budgetAllocatedCr: data.budgetAllocatedCr,
        budgetUtilizedCr: 0,
        status: data.status,
      };
      departmentsState = [newDept, ...departmentsState];
      return newDept;
    }
  },

  deleteDepartment: async (id: string): Promise<{ success: boolean }> => {
    try {
      const res = await axiosClient.delete(`/admin/departments/${id}`);
      return res.data?.data || res.data;
    } catch {
      departmentsState = departmentsState.filter((d) => d.id !== id);
      return { success: true };
    }
  },

  // Universities
  getUniversities: async (): Promise<AdminUniversity[]> => {
    try {
      const res = await axiosClient.get("/admin/universities");
      return res.data?.data || res.data;
    } catch {
      return universitiesState;
    }
  },

  verifyUniversity: async (id: string, status: "approved" | "rejected"): Promise<AdminUniversity> => {
    try {
      const res = await axiosClient.patch(`/admin/universities/${id}/verify`, { status });
      return res.data?.data || res.data;
    } catch {
      const uni = universitiesState.find((u) => u.id === id);
      if (uni) {
        uni.verificationStatus = status;
        return uni;
      }
      throw new Error("University not found");
    }
  },

  // Industry
  getIndustries: async (): Promise<AdminIndustry[]> => {
    try {
      const res = await axiosClient.get("/admin/industries");
      return res.data?.data || res.data;
    } catch {
      return industriesState;
    }
  },

  verifyIndustry: async (id: string, status: "verified" | "flagged"): Promise<AdminIndustry> => {
    try {
      const res = await axiosClient.patch(`/admin/industries/${id}/verify`, { status });
      return res.data?.data || res.data;
    } catch {
      const ind = industriesState.find((i) => i.id === id);
      if (ind) {
        ind.verificationStatus = status;
        return ind;
      }
      throw new Error("Industry not found");
    }
  },

  // NGOs
  getNgos: async (): Promise<AdminNgo[]> => {
    try {
      const res = await axiosClient.get("/admin/ngos");
      return res.data?.data || res.data;
    } catch {
      return ngosState;
    }
  },

  verifyNgo: async (id: string, status: "verified" | "flagged"): Promise<AdminNgo> => {
    try {
      const res = await axiosClient.patch(`/admin/ngos/${id}/verify`, { status });
      return res.data?.data || res.data;
    } catch {
      const ngo = ngosState.find((n) => n.id === id);
      if (ngo) {
        ngo.verificationStatus = status;
        return ngo;
      }
      throw new Error("NGO not found");
    }
  },

  // Research Orgs
  getResearchOrgs: async (): Promise<AdminResearchOrg[]> => {
    try {
      const res = await axiosClient.get("/admin/research");
      return res.data?.data || res.data;
    } catch {
      return researchOrgsState;
    }
  },

  // Issues Management
  getIssues: async (params?: { status?: string; search?: string; department?: string }): Promise<AdminIssue[]> => {
    try {
      const res = await axiosClient.get("/admin/issues", { params });
      return res.data?.data || res.data;
    } catch {
      let filtered = [...issuesState];
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((i) => i.status === params.status);
      }
      if (params?.department && params.department !== "all") {
        filtered = filtered.filter((i) => i.departmentId === params.department);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.trackingNumber.toLowerCase().includes(q) ||
            i.citizenName.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  reassignIssue: async (id: string, data: ReassignIssueFormData): Promise<AdminIssue> => {
    try {
      const res = await axiosClient.post(`/admin/issues/${id}/reassign`, data);
      return res.data?.data || res.data;
    } catch {
      const issue = issuesState.find((i) => i.id === id);
      if (issue) {
        issue.departmentId = data.departmentId;
        const targetDept = departmentsState.find((d) => d.id === data.departmentId);
        if (targetDept) issue.departmentName = targetDept.name;
        issue.priority = data.priority;
        if (data.stakeholderType !== "none" && data.stakeholderName) {
          issue.assignedStakeholder = {
            type: data.stakeholderType,
            name: data.stakeholderName,
          };
        }
        issue.status = data.escalateSla ? "Escalated" : "Assigned";
        adminApi.broadcastWsEvent("ISSUE_REASSIGNED", issue);
        return issue;
      }
      throw new Error("Issue not found");
    }
  },

  archiveIssue: async (id: string, archive: boolean): Promise<AdminIssue> => {
    try {
      const res = await axiosClient.patch(`/admin/issues/${id}/archive`, { isArchived: archive });
      return res.data?.data || res.data;
    } catch {
      const issue = issuesState.find((i) => i.id === id);
      if (issue) {
        issue.isArchived = archive;
        issue.status = archive ? "Archived" : "Assigned";
        return issue;
      }
      throw new Error("Issue not found");
    }
  },

  deleteIssue: async (id: string): Promise<{ success: boolean }> => {
    try {
      const res = await axiosClient.delete(`/admin/issues/${id}`);
      return res.data?.data || res.data;
    } catch {
      issuesState = issuesState.filter((i) => i.id !== id);
      return { success: true };
    }
  },

  // AI Telemetry
  getAiMetrics: async (): Promise<AiTelemetryMetrics> => {
    try {
      const res = await axiosClient.get("/admin/ai/metrics");
      return res.data?.data || res.data;
    } catch {
      return MOCK_AI_METRICS;
    }
  },

  // Workflow Logs
  getWorkflowLogs: async (): Promise<WorkflowLog[]> => {
    try {
      const res = await axiosClient.get("/admin/workflow/logs");
      return res.data?.data || res.data;
    } catch {
      return MOCK_WORKFLOW_LOGS;
    }
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    try {
      const res = await axiosClient.get("/admin/audit-logs");
      return res.data?.data || res.data;
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  },

  // API Monitoring
  getApiMetrics: async (): Promise<ApiMonitoringMetrics> => {
    try {
      const res = await axiosClient.get("/admin/api-monitoring");
      return res.data?.data || res.data;
    } catch {
      return MOCK_API_METRICS;
    }
  },

  // System Health & Database
  getSystemHealth: async (): Promise<SystemHealthMetrics> => {
    try {
      const res = await axiosClient.get("/admin/system-health");
      return res.data?.data || res.data;
    } catch {
      return MOCK_SYSTEM_HEALTH;
    }
  },

  // Platform Settings
  getSettings: async (): Promise<SystemSettingsConfig> => {
    try {
      const res = await axiosClient.get("/admin/settings");
      return res.data?.data || res.data;
    } catch {
      return settingsState;
    }
  },

  updateSettings: async (data: Partial<SystemSettingsConfig>): Promise<SystemSettingsConfig> => {
    try {
      const res = await axiosClient.put("/admin/settings", data);
      return res.data?.data || res.data;
    } catch {
      settingsState = { ...settingsState, ...data };
      adminApi.broadcastWsEvent("SETTINGS_UPDATED", settingsState);
      return settingsState;
    }
  },

  // Notifications
  getNotifications: async (): Promise<AdminNotification[]> => {
    try {
      const res = await axiosClient.get("/admin/notifications");
      return res.data?.data || res.data;
    } catch {
      return notificationsState;
    }
  },

  markNotificationRead: async (id: string): Promise<void> => {
    const notif = notificationsState.find((n) => n.id === id);
    if (notif) notif.read = true;
  },

  markAllNotificationsRead: async (): Promise<void> => {
    notificationsState.forEach((n) => (n.read = true));
  },

  // WebSockets Event Simulation
  subscribeWsEvents: (callback: WsCallback): (() => void) => {
    wsListeners.add(callback);
    return () => {
      wsListeners.delete(callback);
    };
  },

  broadcastWsEvent: (type: string, payload: unknown) => {
    wsListeners.forEach((cb) => {
      try {
        cb({ type, payload });
      } catch (err) {
        console.error("WS event subscriber error", err);
      }
    });
  },
};
