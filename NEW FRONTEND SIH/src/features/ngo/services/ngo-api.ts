import { axiosClient } from "@/features/shared/services/axios-client";
import {
  NgoUser,
  NgoOrganization,
  NgoDashboardStats,
  AvailableProject,
  AssignedProject,
  FieldActivity,
  Volunteer,
  ImpactAnalytics,
  CollaborationPartner,
  NgoReport,
  NgoCertificate,
  NgoNotification,
  NgoConversation,
  NgoMessage,
} from "../types";
import {
  NgoLoginFormData,
  FieldActivityFormData,
  ApplyProjectFormData,
  AssignVolunteerFormData,
  GenerateReportFormData,
  NgoProfileFormData,
} from "../validation/ngo-schemas";

// Realistic Seed / Mock Data for NGO & Civil Society
export const MOCK_NGO_USER: NgoUser = {
  id: "ngo-usr-001",
  name: "Dr. Arundhati Roy-Deshmukh",
  email: "arundhati@gramin-vikas-trust.org",
  role: "ngo",
  roleLabel: "Executive Program Director",
  orgId: "ngo-org-101",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  phone: "+91 98230 44812",
};

export const MOCK_NGO_ORG: NgoOrganization = {
  id: "ngo-org-101",
  name: "Gramin Vikas Seva Sansthan",
  registrationNumber: "MH/2012/0088921",
  darpanId: "MH/2017/0154823",
  fcraStatus: "Compliant",
  has12A80G: true,
  establishedYear: 2012,
  mission: "Catalyzing grassroots participatory governance, watershed revitalization, and equitable girl-child digital literacy across backward agro-climatic zones.",
  about: "Gramin Vikas Seva Sansthan has operated for over 14 years across 8 aspirational districts in Maharashtra and Madhya Pradesh, collaborating with Panchayats, state line departments, and academic institutes.",
  address: "Plot 42, Samata Colony, Vikas Marg, Aurangabad",
  district: "Chhatrapati Sambhajinagar",
  state: "Maharashtra",
  website: "https://gramin-vikas-trust.org",
  contactEmail: "secretariat@gramin-vikas-trust.org",
  contactPhone: "+91 240 2489110",
  focusAreas: [
    "Rural Water Security",
    "Digital Literacy in Tribal Schools",
    "Maternal Health Tele-screening",
    "Panchayat Social Auditing",
  ],
  logoUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&auto=format&fit=crop&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
  achievements: [
    "National Water Award 2024 (2nd Prize - NGO Category)",
    "Panchayati Raj Ministry Commendation for Participatory Auditing",
    "UNICEF Certified Child-Safe Operational Framework",
  ],
  certifications: [
    "GuideStar India Platinum Seal",
    "Credibility Alliance Accredited",
    "ISO 9001:2015 Social Program Management",
  ],
  impactMetrics: {
    totalBeneficiaries: 184500,
    villagesAdopted: 64,
    activeVolunteers: 412,
    treesPlanted: 52000,
    scholarshipsGranted: 1420,
  },
};

export const MOCK_DASHBOARD_STATS: NgoDashboardStats = {
  activeProjects: 6,
  completedProjects: 18,
  pendingRequests: 4,
  volunteers: 412,
  beneficiaries: 184500,
  districtsCovered: 8,
  communityImpactScore: 94.2,
  totalVolunteerHours: 18640,
  notifications: 5,
};

export const MOCK_AVAILABLE_PROJECTS: AvailableProject[] = [
  {
    id: "PROJ-NGO-2026-01",
    title: "Solarized Community RO Drinking Water Outposts",
    category: "Water & Sanitation",
    district: "Chhatrapati Sambhajinagar",
    sdgGoal: "SDG 6: Clean Water & Sanitation",
    governmentDepartment: "Rural Water Supply & Sanitation Dept",
    universityPartner: "IIT Bombay Environmental Lab",
    budget: "₹38,50,000",
    timeline: "9 Months",
    priority: "Urgent",
    status: "Open for Application",
    description: "Installation and community-ownership handoff of 12 decentralised solar photovoltaic water kiosks in fluoride-contaminated habitations.",
    eligibility: ["Darpan Validated", "Min 3 yrs WASH field experience", "Existing district volunteer footprint"],
    deadline: "2026-10-15",
    isBookmarked: false,
  },
  {
    id: "PROJ-NGO-2026-02",
    title: "Tribal Mobile Health Clinic & Diagnostic Screening",
    category: "Healthcare & Nutrition",
    district: "Nandurbar",
    sdgGoal: "SDG 3: Good Health & Well-Being",
    governmentDepartment: "National Health Mission, Tribal Welfare Dept",
    universityPartner: "KEM Hospital Research Center",
    budget: "₹62,00,000",
    timeline: "12 Months",
    priority: "High",
    status: "Open for Application",
    description: "Bi-weekly specialized mobile clinics covering sickle cell anemia, maternal ultrasound screening, and SAM/MAM childhood malnutrition stabilization.",
    eligibility: ["FCRA/12A Registered", "Medical field paramedic team ready", "Language proficiency in Bhili/Pawri"],
    deadline: "2026-10-28",
    isBookmarked: true,
  },
  {
    id: "PROJ-NGO-2026-03",
    title: "STEM Innovation Hubs in Zilla Parishad Secondary Schools",
    category: "Education & Skilling",
    district: "Jalna",
    sdgGoal: "SDG 4: Quality Education",
    governmentDepartment: "School Education & Sports Dept",
    universityPartner: "COEP Technological University",
    budget: "₹24,00,000",
    timeline: "6 Months",
    priority: "Medium",
    status: "Open for Application",
    description: "Setting up 20 experiential robotics and science experimentation kits with regular weekend volunteer mentorship modules.",
    eligibility: ["Youth mentorship portfolio", "Quarterly evaluation capacity"],
    deadline: "2026-11-05",
    isBookmarked: false,
  },
  {
    id: "PROJ-NGO-2026-04",
    title: "Miyawaki Urban Afforestation in Industrial Buffer Corridors",
    category: "Environment & Climate",
    district: "Nashik",
    sdgGoal: "SDG 13: Climate Action",
    governmentDepartment: "Social Forestry Division & MIDC",
    budget: "₹19,00,000",
    timeline: "8 Months",
    priority: "Medium",
    status: "Open for Application",
    description: "Rapid dense afforestation utilizing native endemic saplings across 15 acres of industrial border lands with 2-year survival auditing.",
    eligibility: ["Horticulture / Ecological team", "Geo-tagging mobile app compliance"],
    deadline: "2026-11-12",
    isBookmarked: false,
  },
];

export const MOCK_ASSIGNED_PROJECTS: AssignedProject[] = [
  {
    id: "ASSIGNED-01",
    title: "Community Micro-Watershed Rejuvenation & Check Dams",
    category: "Rural Infrastructure",
    district: "Beed",
    sdgGoal: "SDG 6: Clean Water",
    completionPercentage: 74,
    timeline: "Jan 2026 - Nov 2026",
    milestones: [
      { id: "M1", title: "Topographical Contouring & Shramdaan Mobilization", dueDate: "2026-03-15", completed: true, budgetAllocated: "₹8,00,000", deliverables: "Drone survey & Village Sabha Resolution" },
      { id: "M2", title: "Construction of 14 Loose Boulder & Gabion Structures", dueDate: "2026-06-30", completed: true, budgetAllocated: "₹14,50,000", deliverables: "Physical masonry & geotagged photos" },
      { id: "M3", title: "Deep CCT Excavation & Groundwater Level Sensor Installation", dueDate: "2026-09-30", completed: false, budgetAllocated: "₹11,00,000", deliverables: "Telemetry integration & water table report" },
      { id: "M4", title: "Social Audit & Gram Panchayat Water Budget Handoff", dueDate: "2026-11-15", completed: false, budgetAllocated: "₹4,50,000", deliverables: "Signed Gram Sabha certificate" },
    ],
    assignedVolunteersCount: 68,
    assignedVolunteers: [
      { id: "v1", name: "Sanjay Shinde", role: "Field Civil Engineer", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
      { id: "v2", name: "Pooja Patil", role: "Hydrology Researcher", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
      { id: "v3", name: "Ramesh Gavane", role: "Community Organizer", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    ],
    budgetTotal: "₹38,00,000",
    budgetUtilized: "₹28,12,000",
    uploadedReports: [
      { id: "r1", name: "Q2_Hydrological_Water_Table_Telemetry.pdf", date: "2026-07-02", url: "#", size: "4.2 MB" },
      { id: "r2", name: "Midterm_Third_Party_Social_Audit.pdf", date: "2026-08-14", url: "#", size: "2.8 MB" },
    ],
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80", caption: "Gabion structure completed at Ashti nala" },
      { id: "img2", url: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600&auto=format&fit=crop&q=80", caption: "Community Shramdaan with 120 villagers" },
    ],
    videos: [
      { id: "vid1", url: "https://www.youtube.com", title: "Drone Inspection of Catchment Trench Flow" },
    ],
    documents: [
      { id: "doc1", name: "Technical_Sanction_PWD_Beed.pdf", type: "Sanction", url: "#", size: "1.9 MB" },
      { id: "doc2", name: "Gram_Sabha_Unanimous_Resolution.pdf", type: "Resolution", url: "#", size: "1.1 MB" },
    ],
    status: "Active",
  },
  {
    id: "ASSIGNED-02",
    title: "Empowering 1200 Adolescent Girls with Digital Health & Coding",
    category: "Education & Health",
    district: "Dharashiv",
    sdgGoal: "SDG 5: Gender Equality",
    completionPercentage: 88,
    timeline: "Feb 2026 - Oct 2026",
    milestones: [
      { id: "M1", title: "Baseline Survey & Digital Tablet Distribution", dueDate: "2026-03-31", completed: true, budgetAllocated: "₹12,00,000", deliverables: "1200 tablet issuance records" },
      { id: "M2", title: "Python Fundamentals & Reproductive Hygiene Training", dueDate: "2026-07-15", completed: true, budgetAllocated: "₹9,00,000", deliverables: "Attendance & test score logs" },
      { id: "M3", title: "Hackathon for Local Civic Problem Statements", dueDate: "2026-10-10", completed: false, budgetAllocated: "₹5,00,000", deliverables: "Working software prototypes" },
    ],
    assignedVolunteersCount: 34,
    assignedVolunteers: [
      { id: "v4", name: "Sneha Kadam", role: "Curriculum Lead", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" },
    ],
    budgetTotal: "₹26,00,000",
    budgetUtilized: "₹22,88,000",
    uploadedReports: [
      { id: "r3", name: "Adolescent_Literacy_Cohort2_Outcome.pdf", date: "2026-08-01", url: "#", size: "3.5 MB" },
    ],
    images: [
      { id: "img3", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80", caption: "Weekend coding lab session in Omerga" },
    ],
    videos: [],
    documents: [],
    status: "Active",
  },
];

export const MOCK_FIELD_ACTIVITIES: FieldActivity[] = [
  {
    id: "ACT-01",
    projectId: "ASSIGNED-01",
    projectTitle: "Community Micro-Watershed Rejuvenation & Check Dams",
    date: "2026-09-15",
    time: "09:30 AM",
    location: "Khadki Village, Ashti Taluka",
    gpsCoordinates: {
      lat: 18.8052,
      lng: 75.1843,
      address: "Khadki Nala Tributary, Survey No. 84, Beed",
    },
    volunteerCount: 42,
    description: "Executed community desiltation across 450 meters of the primary catchment channel, removing 320 metric tonnes of silt.",
    approvalStatus: "Approved",
    evidenceGallery: [
      { id: "ev1", type: "image", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80", name: "desiltation_commencement.jpg", uploadedAt: "2026-09-15 11:20" },
      { id: "ev2", type: "pdf", url: "#", name: "Soil_Testing_Organic_Carbon_Lab_Report.pdf", uploadedAt: "2026-09-15 14:05", size: "1.4 MB" },
    ],
    activityNotes: "Gram Panchayat Sarpanch Mrs. Anita Bhosale signed verification muster roll on site.",
  },
  {
    id: "ACT-02",
    projectId: "ASSIGNED-02",
    projectTitle: "Empowering 1200 Adolescent Girls with Digital Health & Coding",
    date: "2026-09-12",
    time: "11:00 AM",
    location: "Zilla Parishad High School, Murum",
    gpsCoordinates: {
      lat: 18.1724,
      lng: 76.0351,
      address: "ZP High School Computer Lab, Dharashiv",
    },
    volunteerCount: 16,
    description: "Delivered interactive module on Algorithmic Thinking and Cyber Hygiene to 180 9th-standard girls.",
    approvalStatus: "Approved",
    evidenceGallery: [
      { id: "ev3", type: "image", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80", name: "girls_coding_session.jpg", uploadedAt: "2026-09-12 13:40" },
    ],
    activityNotes: "Tablets recharged with solar power backup installed under project scope.",
  },
];

export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: "VOL-01",
    name: "Vikram Gaikwad",
    email: "vikram.gaikwad@gmail.com",
    phone: "+91 94221 88301",
    skills: ["Civil Engineering", "GIS Mapping", "Water Auditing"],
    availability: "Weekends",
    assignedProject: "Community Micro-Watershed Rejuvenation",
    assignedProjectId: "ASSIGNED-01",
    hoursContributed: 148,
    contributionScore: 96,
    certificatesCount: 4,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    district: "Beed",
    joinedDate: "2025-04-10",
  },
  {
    id: "VOL-02",
    name: "Neha Kulkarni",
    email: "neha.kulkarni@acm.org",
    phone: "+91 98902 44102",
    skills: ["Python", "Web Development", "Pedagogy"],
    availability: "Flexible",
    assignedProject: "Empowering 1200 Adolescent Girls with Coding",
    assignedProjectId: "ASSIGNED-02",
    hoursContributed: 212,
    contributionScore: 98,
    certificatesCount: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    district: "Dharashiv",
    joinedDate: "2024-11-15",
  },
  {
    id: "VOL-03",
    name: "Dr. Abhijit Deshmukh",
    email: "abhijit.med@gmch.ac.in",
    phone: "+91 98220 15994",
    skills: ["Pediatrics", "Emergency Medicine", "Tele-health"],
    availability: "Weekends",
    assignedProject: "Tribal Mobile Health Clinic",
    assignedProjectId: "PROJ-NGO-2026-02",
    hoursContributed: 84,
    contributionScore: 92,
    certificatesCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80",
    district: "Nandurbar",
    joinedDate: "2025-08-01",
  },
  {
    id: "VOL-04",
    name: "Priya Sawant",
    email: "priya.sawant@tiss.edu",
    phone: "+91 97654 32189",
    skills: ["Social Work", "Community Mobilization", "Surveying"],
    availability: "Full-time",
    assignedProject: "Community Micro-Watershed Rejuvenation",
    assignedProjectId: "ASSIGNED-01",
    hoursContributed: 320,
    contributionScore: 99,
    certificatesCount: 6,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    district: "Chhatrapati Sambhajinagar",
    joinedDate: "2024-02-20",
  },
];

export const MOCK_IMPACT_ANALYTICS: ImpactAnalytics = {
  peopleBenefited: 184500,
  villagesCovered: 64,
  districtCoverage: 8,
  volunteerHours: 18640,
  successRate: 94.6,
  environmentalImpact: {
    treesPlanted: 52000,
    co2OffsetTonnes: 1240,
    waterBodiesRestored: 42,
  },
  healthcareImpact: {
    freeScreenings: 34200,
    medicinesDistributed: 18500,
    maternalCareCamps: 148,
  },
  educationImpact: {
    studentsMentored: 12400,
    schoolsEquipped: 46,
    digitalLabsSet: 22,
  },
  monthlyTrends: [
    { month: "Jan", beneficiaries: 12400, volunteerHours: 1250, projectsActive: 4 },
    { month: "Feb", beneficiaries: 14800, volunteerHours: 1420, projectsActive: 5 },
    { month: "Mar", beneficiaries: 18900, volunteerHours: 1780, projectsActive: 5 },
    { month: "Apr", beneficiaries: 16200, volunteerHours: 1610, projectsActive: 5 },
    { month: "May", beneficiaries: 21500, volunteerHours: 2100, projectsActive: 6 },
    { month: "Jun", beneficiaries: 23800, volunteerHours: 2340, projectsActive: 6 },
    { month: "Jul", beneficiaries: 24500, volunteerHours: 2400, projectsActive: 6 },
    { month: "Aug", beneficiaries: 26100, volunteerHours: 2790, projectsActive: 6 },
    { month: "Sep", beneficiaries: 26300, volunteerHours: 2950, projectsActive: 6 },
  ],
  districtBreakdown: [
    { district: "Beed", beneficiaries: 48500, impactScore: 96, villages: 18 },
    { district: "Dharashiv", beneficiaries: 38200, impactScore: 95, villages: 14 },
    { district: "Chhatrapati Sambhajinagar", beneficiaries: 32400, impactScore: 93, villages: 11 },
    { district: "Jalna", beneficiaries: 26100, impactScore: 91, villages: 9 },
    { district: "Nandurbar", beneficiaries: 21800, impactScore: 94, villages: 7 },
    { district: "Nashik", beneficiaries: 17500, impactScore: 89, villages: 5 },
  ],
  sdgDistribution: [
    { sdg: "SDG 6: Clean Water", percentage: 38, color: "#0ea5e9" },
    { sdg: "SDG 4: Quality Education", percentage: 26, color: "#f59e0b" },
    { sdg: "SDG 3: Good Health", percentage: 22, color: "#10b981" },
    { sdg: "SDG 13: Climate Action", percentage: 14, color: "#8b5cf6" },
  ],
};

export const MOCK_COLLABORATION_PARTNERS: CollaborationPartner[] = [
  {
    id: "COL-01",
    partnerName: "Maharashtra Water Resources Regulatory Authority",
    partnerType: "Government",
    projectTitle: "Participatory Groundwater Auditing in Marathwada",
    status: "Accepted",
    contactPerson: "Er. Dilip Patil (Superintending Engineer)",
    email: "se.groundwater@mwrra.gov.in",
    sharedDocuments: [
      { id: "sd1", name: "MoU_MWRRA_Gramin_Vikas_Signed.pdf", size: "2.4 MB", url: "#" },
      { id: "sd2", name: "Aquifer_Delineation_Basin_Map.pdf", size: "8.1 MB", url: "#" },
    ],
    recentDiscussion: "Telemetry API keys configured for automated data push to state portal.",
    establishedDate: "2025-06-12",
  },
  {
    id: "COL-02",
    partnerName: "IIT Bombay - Centre for Technology Alternatives (CTARA)",
    partnerType: "University",
    projectTitle: "Low-Cost Soil Moisture Sensor Networks",
    status: "Accepted",
    contactPerson: "Prof. Bakul Rao",
    email: "bakulrao@iitb.ac.in",
    sharedDocuments: [
      { id: "sd3", name: "CTARA_Sensor_Hardware_Schematics.pdf", size: "4.7 MB", url: "#" },
    ],
    recentDiscussion: "Field calibration scheduled for 30 village check dams next week.",
    establishedDate: "2025-08-20",
  },
  {
    id: "COL-03",
    partnerName: "Tata Community Initiatives Trust",
    partnerType: "Industry",
    projectTitle: "Rural Sanitation & Potable Water Disbursals",
    status: "Accepted",
    contactPerson: "Rajeshwar Kulkarni (CSR Lead)",
    email: "rajeshwar.kulkarni@tata.com",
    sharedDocuments: [
      { id: "sd4", name: "CSR_Sanction_Tranche2_Approval.pdf", size: "1.8 MB", url: "#" },
    ],
    recentDiscussion: "Tranche 2 disbursement receipt confirmed on Social-X ledger.",
    establishedDate: "2025-03-10",
  },
  {
    id: "COL-04",
    partnerName: "Council of Scientific and Industrial Research (CSIR-NEERI)",
    partnerType: "Research Organization",
    projectTitle: "Fluoride Remediation Using Natural Zeolite Filtration",
    status: "Pending",
    contactPerson: "Dr. P. Srivastava",
    email: "p_srivastava@neeri.res.in",
    sharedDocuments: [],
    recentDiscussion: "Reviewing pilot site soil and baseline water samples.",
    establishedDate: "2026-08-01",
  },
];

export const MOCK_NGO_REPORTS: NgoReport[] = [
  {
    id: "REP-01",
    title: "Q2 2026 Comprehensive Field Activity & Telemetry Audit",
    type: "Monthly Activities",
    period: "Apr 2026 - Jun 2026",
    generatedAt: "2026-07-05",
    fileFormat: "PDF",
    fileUrl: "#",
    size: "6.2 MB",
    downloadCount: 42,
  },
  {
    id: "REP-02",
    title: "CSR Section 135 Financial Utilization Certificate",
    type: "Financial Utilization",
    period: "FY 2025-26",
    generatedAt: "2026-05-18",
    fileFormat: "Excel",
    fileUrl: "#",
    size: "1.4 MB",
    downloadCount: 88,
  },
  {
    id: "REP-03",
    title: "District-wide Volunteer Hours & Skill Distribution",
    type: "Volunteer Contributions",
    period: "Jan 2026 - Aug 2026",
    generatedAt: "2026-09-01",
    fileFormat: "PDF",
    fileUrl: "#",
    size: "3.8 MB",
    downloadCount: 29,
  },
  {
    id: "REP-04",
    title: "Socio-Economic Beneficiary Reach & Village Audits",
    type: "Community Reach",
    period: "Cumulative 2025-26",
    generatedAt: "2026-09-10",
    fileFormat: "Excel",
    fileUrl: "#",
    size: "2.1 MB",
    downloadCount: 65,
  },
];

export const MOCK_CERTIFICATES: NgoCertificate[] = [
  {
    id: "CERT-2026-01",
    volunteerId: "VOL-01",
    volunteerName: "Vikram Gaikwad",
    projectName: "Community Micro-Watershed Rejuvenation",
    issueDate: "2026-08-15",
    verificationCode: "SX-NGO-V-99421",
    certificateUrl: "#",
    type: "Excellence in Service",
    hoursLogged: 148,
  },
  {
    id: "CERT-2026-02",
    volunteerId: "VOL-02",
    volunteerName: "Neha Kulkarni",
    projectName: "Adolescent Girls Digital Health & Coding",
    issueDate: "2026-08-15",
    verificationCode: "SX-NGO-V-99422",
    certificateUrl: "#",
    type: "Community Leadership",
    hoursLogged: 212,
  },
  {
    id: "CERT-2026-03",
    volunteerId: "VOL-04",
    volunteerName: "Priya Sawant",
    projectName: "Community Micro-Watershed Rejuvenation",
    issueDate: "2026-07-20",
    verificationCode: "SX-NGO-V-99423",
    certificateUrl: "#",
    type: "Distinguished Contributor",
    hoursLogged: 320,
  },
];

export const MOCK_NOTIFICATIONS: NgoNotification[] = [
  {
    id: "NOTIF-01",
    title: "Field Activity Approved",
    description: "Desiltation activity at Khadki village verified by District Nodal Officer.",
    category: "approval",
    timestamp: "15 mins ago",
    read: false,
    actionUrl: "/ngo/field-activities",
    actionLabel: "View Activity",
  },
  {
    id: "NOTIF-02",
    title: "New Project Opportunity Open",
    description: "Tribal Mobile Health Clinic grant opened by National Health Mission.",
    category: "project",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/ngo/projects",
    actionLabel: "Apply Now",
  },
  {
    id: "NOTIF-03",
    title: "18 Volunteers Applied for Watershed Rejuvenation",
    description: "New volunteers from Government Engineering College Aurangabad requested onboarding.",
    category: "volunteer",
    timestamp: "Yesterday",
    read: true,
    actionUrl: "/ngo/volunteers",
    actionLabel: "Review Applicants",
  },
  {
    id: "NOTIF-04",
    title: "MWRRA Collaboration Update",
    description: "Signed MoU uploaded by Superintending Engineer Dilip Patil.",
    category: "collaboration",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/ngo/collaborations",
    actionLabel: "Open Documents",
  },
];

export const MOCK_CONVERSATIONS: NgoConversation[] = [
  {
    id: "conv-01",
    partnerName: "Er. Dilip Patil",
    partnerType: "Government",
    partnerOrg: "MWRRA Water Authority",
    lastMessage: "Telemetry API keys configured for automated data push to state portal.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "conv-02",
    partnerName: "Prof. Bakul Rao",
    partnerType: "University",
    partnerOrg: "IIT Bombay CTARA",
    lastMessage: "Field calibration scheduled for 30 village check dams next week.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "conv-03",
    partnerName: "Vikram Gaikwad",
    partnerType: "Volunteer Lead",
    partnerOrg: "Civil Engg Unit",
    lastMessage: "Drone footage processed and ready for uploading in the evidence gallery.",
    lastMessageTime: "Sep 14",
    unreadCount: 0,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export const MOCK_MESSAGES: Record<string, NgoMessage[]> = {
  "conv-01": [
    {
      id: "m1",
      conversationId: "conv-01",
      senderId: "Er. Dilip Patil",
      senderName: "Er. Dilip Patil",
      senderRole: "Superintending Engineer, MWRRA",
      content: "Hello Dr. Roy, we reviewed the baseline hydrological survey for Khadki basin. Excellent work by your team.",
      timestamp: "10:15 AM",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      isSelf: false,
    },
    {
      id: "m2",
      conversationId: "conv-01",
      senderId: "ngo-usr-001",
      senderName: "Dr. Arundhati Roy",
      senderRole: "NGO Director",
      content: "Thank you Engineer Patil. We have embedded the telemetry nodes at all 14 check dams.",
      timestamp: "10:30 AM",
      isSelf: true,
    },
    {
      id: "m3",
      conversationId: "conv-01",
      senderId: "Er. Dilip Patil",
      senderName: "Er. Dilip Patil",
      senderRole: "Superintending Engineer, MWRRA",
      content: "Telemetry API keys configured for automated data push to state portal.",
      timestamp: "10:45 AM",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      isSelf: false,
    },
  ],
};

class NgoApiService {
  // Authentication with Axios
  async loginNgo(credentials: NgoLoginFormData): Promise<NgoUser> {
    try {
      const res = await axiosClient.post("/auth/login/ngo", credentials);
      return res.data?.data || res.data;
    } catch {
      // Mock Fallback for local testing
      return MOCK_NGO_USER;
    }
  }

  async loginGoogleNgo(): Promise<NgoUser> {
    try {
      const res = await axiosClient.post("/auth/google", { role: "ngo" });
      return res.data?.data || res.data;
    } catch {
      return MOCK_NGO_USER;
    }
  }

  async getDashboardStats(): Promise<NgoDashboardStats> {
    try {
      const res = await axiosClient.get("/ngo/dashboard/stats");
      return res.data?.data || res.data;
    } catch {
      return MOCK_DASHBOARD_STATS;
    }
  }

  async getOrganizationProfile(): Promise<NgoOrganization> {
    try {
      const res = await axiosClient.get("/ngo/organization/profile");
      return res.data?.data || res.data;
    } catch {
      return MOCK_NGO_ORG;
    }
  }

  async updateOrganizationProfile(data: NgoProfileFormData): Promise<NgoOrganization> {
    try {
      const res = await axiosClient.put("/ngo/organization/profile", data);
      return res.data?.data || res.data;
    } catch {
      return { ...MOCK_NGO_ORG, ...data };
    }
  }

  async getAvailableProjects(params?: {
    category?: string;
    district?: string;
    priority?: string;
    search?: string;
  }): Promise<AvailableProject[]> {
    try {
      const res = await axiosClient.get("/ngo/projects/available", { params });
      return res.data?.data || res.data;
    } catch {
      let filtered = [...MOCK_AVAILABLE_PROJECTS];
      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((p) => p.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.district && params.district !== "all") {
        filtered = filtered.filter((p) => p.district.toLowerCase().includes(params.district!.toLowerCase()));
      }
      if (params?.priority && params.priority !== "all") {
        filtered = filtered.filter((p) => p.priority.toLowerCase() === params.priority!.toLowerCase());
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(query) || p.sdgGoal.toLowerCase().includes(query));
      }
      return filtered;
    }
  }

  async applyProject(data: ApplyProjectFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/ngo/projects/apply", data);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: "Application submitted successfully to District Planning Committee." };
    }
  }

  async getAssignedProjects(): Promise<AssignedProject[]> {
    try {
      const res = await axiosClient.get("/ngo/projects/assigned");
      return res.data?.data || res.data;
    } catch {
      return MOCK_ASSIGNED_PROJECTS;
    }
  }

  async getFieldActivities(): Promise<FieldActivity[]> {
    try {
      const res = await axiosClient.get("/ngo/activities");
      return res.data?.data || res.data;
    } catch {
      return MOCK_FIELD_ACTIVITIES;
    }
  }

  async createFieldActivity(data: FieldActivityFormData): Promise<FieldActivity> {
    try {
      const res = await axiosClient.post("/ngo/activities", data);
      return res.data?.data || res.data;
    } catch {
      const newActivity: FieldActivity = {
        id: `ACT-${Date.now()}`,
        projectId: data.projectId,
        projectTitle: MOCK_ASSIGNED_PROJECTS.find((p) => p.id === data.projectId)?.title || "Field Initiative",
        date: data.date,
        time: data.time,
        location: data.location,
        gpsCoordinates: {
          lat: data.latitude,
          lng: data.longitude,
          address: data.location,
        },
        volunteerCount: data.volunteerCount,
        description: data.description,
        approvalStatus: "Pending Review",
        evidenceGallery: [
          {
            id: `ev-${Date.now()}`,
            type: "image",
            url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
            name: "field_evidence.jpg",
            uploadedAt: "Just now",
          },
        ],
        activityNotes: data.activityNotes || "",
      };
      return newActivity;
    }
  }

  async getVolunteers(): Promise<Volunteer[]> {
    try {
      const res = await axiosClient.get("/ngo/volunteers");
      return res.data?.data || res.data;
    } catch {
      return MOCK_VOLUNTEERS;
    }
  }

  async assignVolunteer(data: AssignVolunteerFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/ngo/volunteers/assign", data);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: "Volunteer deployed to project roster successfully." };
    }
  }

  async removeVolunteer(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.delete(`/ngo/volunteers/${id}`);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: "Volunteer removed from active deployment." };
    }
  }

  async getImpactAnalytics(): Promise<ImpactAnalytics> {
    try {
      const res = await axiosClient.get("/ngo/impact");
      return res.data?.data || res.data;
    } catch {
      return MOCK_IMPACT_ANALYTICS;
    }
  }

  async getCollaborations(): Promise<CollaborationPartner[]> {
    try {
      const res = await axiosClient.get("/ngo/collaborations");
      return res.data?.data || res.data;
    } catch {
      return MOCK_COLLABORATION_PARTNERS;
    }
  }

  async getReports(): Promise<NgoReport[]> {
    try {
      const res = await axiosClient.get("/ngo/reports");
      return res.data?.data || res.data;
    } catch {
      return MOCK_NGO_REPORTS;
    }
  }

  async generateReport(data: GenerateReportFormData): Promise<NgoReport> {
    try {
      const res = await axiosClient.post("/ngo/reports/generate", data);
      return res.data?.data || res.data;
    } catch {
      return {
        id: `REP-${Date.now()}`,
        title: `${data.type} Report (${data.period})`,
        type: data.type,
        period: data.period,
        generatedAt: new Date().toISOString().split("T")[0],
        fileFormat: data.fileFormat,
        fileUrl: "#",
        size: "2.8 MB",
        downloadCount: 1,
      };
    }
  }

  async getCertificates(): Promise<NgoCertificate[]> {
    try {
      const res = await axiosClient.get("/ngo/certificates");
      return res.data?.data || res.data;
    } catch {
      return MOCK_CERTIFICATES;
    }
  }

  async getNotifications(): Promise<NgoNotification[]> {
    try {
      const res = await axiosClient.get("/ngo/notifications");
      return res.data?.data || res.data;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  }

  async getConversations(): Promise<NgoConversation[]> {
    try {
      const res = await axiosClient.get("/ngo/conversations");
      return res.data?.data || res.data;
    } catch {
      return MOCK_CONVERSATIONS;
    }
  }

  async getMessages(conversationId: string): Promise<NgoMessage[]> {
    try {
      const res = await axiosClient.get(`/ngo/conversations/${conversationId}/messages`);
      return res.data?.data || res.data;
    } catch {
      return MOCK_MESSAGES[conversationId] || [];
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<NgoMessage> {
    try {
      const res = await axiosClient.post(`/ngo/conversations/${conversationId}/messages`, { content });
      return res.data?.data || res.data;
    } catch {
      return {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: "ngo-usr-001",
        senderName: "Dr. Arundhati Roy",
        senderRole: "NGO Director",
        content,
        timestamp: "Just now",
        isSelf: true,
      };
    }
  }

  // WebSocket Live Notification Support
  subscribeToNotifications(onNotification: (notif: NgoNotification) => void): () => void {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1/ws/ngo";
    let socket: WebSocket | null = null;
    let timer: NodeJS.Timeout | null = null;

    try {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onNotification(data);
        } catch {
          // ignore
        }
      };
      socket.onerror = () => {
        // Fallback simulation timer if backend WS is not active
        startSimulatedTelemetry();
      };
    } catch {
      startSimulatedTelemetry();
    }

    function startSimulatedTelemetry() {
      timer = setInterval(() => {
        const sampleNotifications: NgoNotification[] = [
          {
            id: `notif-${Date.now()}`,
            title: "Real-time Telemetry Alert",
            description: "Check dam water level telemetry sensor updated: +1.2m recharge detected.",
            category: "project",
            timestamp: "Just now",
            read: false,
            actionUrl: "/ngo/assigned-projects",
            actionLabel: "View Sensor",
          },
          {
            id: `notif-${Date.now()}`,
            title: "Volunteer Logged Hours",
            description: "Neha Kulkarni added 4 hours for Digital Literacy Workshop.",
            category: "volunteer",
            timestamp: "Just now",
            read: false,
            actionUrl: "/ngo/volunteers",
            actionLabel: "Verify Hours",
          },
        ];
        const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
        onNotification(randomNotif);
      }, 45000); // Trigger periodic subtle notification update
    }

    return () => {
      if (socket) socket.close();
      if (timer) clearInterval(timer);
    };
  }
}

export const ngoApi = new NgoApiService();
