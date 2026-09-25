import {
  GovernmentOfficer,
  GovernmentCase,
  GovernmentDepartment,
  GovernmentDashboardStats,
  MonthlyIssueStat,
  ResolutionTrendStat,
  DistrictIssueStat,
  DepartmentMetricStat,
  CasePriority,
  CaseStatus,
} from "../types";
import {
  OfficerCreationFormData,
  DepartmentCreationFormData,
  ResolveCaseFormData,
  ReassignOfficerFormData,
  TransferDepartmentFormData,
} from "../validation/government-schemas";
import { generateUniquePassKey } from "./pass-key-generator";
import { routingClient, analyticsClient, coreClient } from "@/features/shared/services/backend-clients";
import { API_ENDPOINTS } from "@/features/shared/services/api-endpoints";

// Storage keys for cross-page sync
const STORAGE_KEY_OFFICERS = "social_x_government_officers_db";
const STORAGE_KEY_CASES = "social_x_government_cases_db";
const STORAGE_KEY_DEPARTMENTS = "social_x_government_departments_db";

export const INITIAL_OFFICERS: GovernmentOfficer[] = [
  {
    id: "off-tn-001",
    name: "Thiru S. Sivakumar, IAS",
    email: "collector@tn.gov.in",
    passwordHash: "GovAdminPass2026!",
    department: "Municipal Administration & Water Supply",
    district: "Chennai",
    designation: "District Collector & District Magistrate",
    role: "District Collector",
    officialPassKey: "TN-CHE-00491-KD82",
    status: "active",
    createdBy: "Root Admin",
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-09-20T14:30:00Z",
    lastLoginAt: "2026-09-22 09:15 AM (Secretariat Gateway)",
    phone: "+91 44 2526 8333",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "off-tn-002",
    name: "Dr. J. Radhakrishnan, IAS",
    email: "commissioner@chennaicorporation.gov.in",
    passwordHash: "GovAdminPass2026!",
    department: "Chennai Municipal Corporation",
    district: "Chennai",
    designation: "Commissioner, Greater Chennai Corporation",
    role: "Municipal Commissioner",
    officialPassKey: "TN-CHN-11482-QW90",
    status: "active",
    createdBy: "Root Admin",
    createdAt: "2026-01-12T11:00:00Z",
    updatedAt: "2026-09-21T18:00:00Z",
    lastLoginAt: "2026-09-21 04:45 PM (Ripon Building Node)",
    phone: "+91 44 2538 4520",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "off-tn-003",
    name: "Er. K. Ramanathan, M.E.",
    email: "ee.pwd.madurai@tn.gov.in",
    passwordHash: "GovAdminPass2026!",
    department: "Public Works Department (PWD)",
    district: "Madurai",
    designation: "Superintending Engineer (Buildings & Infra)",
    role: "Superintending Engineer",
    officialPassKey: "TN-MDU-88432-ZP11",
    status: "active",
    createdBy: "Root Admin",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-09-18T10:15:00Z",
    lastLoginAt: "2026-09-20 11:20 AM (Madurai Circle Office)",
    phone: "+91 452 253 1890",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "off-tn-004",
    name: "Er. S. Anbarasan",
    email: "ee.roads@tn.gov.in",
    passwordHash: "GovAdminPass2026!",
    department: "Highways & Minor Ports (Roads)",
    district: "Coimbatore",
    designation: "Executive Engineer (Highways Circle)",
    role: "Executive Engineer",
    officialPassKey: "TN-GOV-20483-KA91",
    status: "active",
    createdBy: "Root Admin",
    createdAt: "2026-03-05T08:30:00Z",
    updatedAt: "2026-09-19T16:40:00Z",
    lastLoginAt: "2026-09-22 08:10 AM (Coimbatore Node)",
    phone: "+91 422 230 4511",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "off-tn-005",
    name: "Dr. M. Kavitha, MBBS, DPH",
    email: "health.officer@tn.gov.in",
    passwordHash: "GovAdminPass2026!",
    department: "Health & Family Welfare",
    district: "Tiruchirappalli",
    designation: "Chief City Health Officer & Epidemic Nodal",
    role: "Chief Health Inspector",
    officialPassKey: "TN-RVL-22981-XA22",
    status: "active",
    createdBy: "Root Admin",
    createdAt: "2026-03-12T14:00:00Z",
    updatedAt: "2026-09-21T09:20:00Z",
    lastLoginAt: "2026-09-21 02:30 PM (Trichy Medical Hub)",
    phone: "+91 431 241 5566",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_DEPARTMENTS: GovernmentDepartment[] = [
  {
    id: "dept-tn-01",
    code: "MAWS",
    name: "Municipal Administration & Water Supply",
    headOfficerName: "Thiru S. Sivakumar, IAS",
    headOfficerEmail: "collector@tn.gov.in",
    districtsCovered: 38,
    activeOfficersCount: 420,
    activeIssuesCount: 142,
    slaComplianceRate: 94.8,
    budgetAllocatedCr: 450.0,
    budgetUtilizedCr: 312.4,
    status: "active",
  },
  {
    id: "dept-tn-02",
    code: "PWD",
    name: "Public Works Department (PWD)",
    headOfficerName: "Er. K. Ramanathan, M.E.",
    headOfficerEmail: "ee.pwd.madurai@tn.gov.in",
    districtsCovered: 38,
    activeOfficersCount: 315,
    activeIssuesCount: 88,
    slaComplianceRate: 91.2,
    budgetAllocatedCr: 620.0,
    budgetUtilizedCr: 489.1,
    status: "active",
  },
  {
    id: "dept-tn-03",
    code: "HIGHWAYS",
    name: "Highways & Minor Ports (Roads)",
    headOfficerName: "Er. S. Anbarasan",
    headOfficerEmail: "ee.roads@tn.gov.in",
    districtsCovered: 38,
    activeOfficersCount: 280,
    activeIssuesCount: 194,
    slaComplianceRate: 88.6,
    budgetAllocatedCr: 780.0,
    budgetUtilizedCr: 590.2,
    status: "active",
  },
  {
    id: "dept-tn-04",
    code: "TANGEDCO",
    name: "Tamil Nadu Generation & Distribution (Electricity)",
    headOfficerName: "Er. V. Subramaniam",
    headOfficerEmail: "se.distribution@tnebnet.org",
    districtsCovered: 38,
    activeOfficersCount: 510,
    activeIssuesCount: 76,
    slaComplianceRate: 96.4,
    budgetAllocatedCr: 890.0,
    budgetUtilizedCr: 710.5,
    status: "active",
  },
  {
    id: "dept-tn-05",
    code: "HEALTH",
    name: "Health & Sanitation Directorate",
    headOfficerName: "Dr. M. Kavitha",
    headOfficerEmail: "health.officer@tn.gov.in",
    districtsCovered: 38,
    activeOfficersCount: 390,
    activeIssuesCount: 65,
    slaComplianceRate: 95.1,
    budgetAllocatedCr: 340.0,
    budgetUtilizedCr: 280.6,
    status: "active",
  },
  {
    id: "dept-tn-06",
    code: "SWM",
    name: "Solid Waste & Bio-Mining Authority",
    headOfficerName: "Dr. R. Selvamani",
    headOfficerEmail: "swm.dir@tn.gov.in",
    districtsCovered: 24,
    activeOfficersCount: 210,
    activeIssuesCount: 112,
    slaComplianceRate: 89.4,
    budgetAllocatedCr: 210.0,
    budgetUtilizedCr: 145.8,
    status: "active",
  },
];

export const INITIAL_CASES: GovernmentCase[] = [
  {
    id: "TN-CIVIC-9021",
    title: "Major High-Pressure Potable Water Main Burst & Road Cave-in",
    description:
      "A 900mm DI feeder conduit ruptured near the Anna Salai intersection, flooding the carriageway and undermining asphalt substructure. Multiple residential layouts experiencing zero pressure.",
    citizenName: "R. Sundaramurthy",
    citizenPhone: "+91 98401 22891",
    citizenId: "CIT-TN-88219",
    category: "Water Supply & Sewage",
    priority: "critical",
    aiConfidence: 98.4,
    location: "Anna Salai, Near DMS Metro, Teynampet",
    district: "Chennai",
    wardNo: "Ward 118",
    gpsCoordinates: { lat: 13.0425, lng: 80.2514 },
    status: "in_progress",
    assignedDate: "2026-09-22 06:15 AM",
    slaDeadline: "2026-09-22 06:15 PM (12h SLA)",
    officer: "Thiru S. Sivakumar, IAS",
    officerId: "off-tn-001",
    department: "Municipal Administration & Water Supply",
    attachments: {
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
          label: "Burst Pipeline Crater & Geyser",
        },
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1584463623578-30190562e847?w=800&auto=format&fit=crop&q=80",
          label: "Inundated Road Junction & Traffic Halt",
        },
      ],
      videos: [
        {
          id: "vid-1",
          url: "https://assets.mixkit.co/videos/preview/mixkit-water-flowing-through-a-broken-street-pipe-42751-large.mp4",
          label: "High Pressure Spout Video Telemetry",
          duration: "0:24",
        },
      ],
      voiceNotes: [
        {
          id: "aud-1",
          url: "/audio/citizen-complaint-water-burst.mp3",
          label: "Citizen Voice Distress Recording (Tamil/English)",
          duration: "0:42",
        },
      ],
      documents: [
        {
          id: "doc-1",
          url: "/docs/metro-water-distribution-schematic.pdf",
          name: "Chennai_Metro_Water_Grid_Sector_4.pdf",
          size: "2.4 MB",
        },
      ],
    },
    timeline: [
      {
        id: "tl-1",
        stage: "Citizen Submission",
        title: "Grievance Logged via Social-X Citizen App",
        description: "Citizen reported massive water gush with geotagged live media.",
        actor: "R. Sundaramurthy (Citizen)",
        actorRole: "Resident Ward 118",
        timestamp: "2026-09-22 06:10 AM",
      },
      {
        id: "tl-2",
        stage: "AI Verification",
        title: "Gemini 2.5 Flash Vision Verification",
        description: "Automated classification confirmed Class-1 infrastructure failure. Confidence: 98.4%.",
        actor: "Social-X AI Vision Pipeline",
        actorRole: "Automated Verifier",
        timestamp: "2026-09-22 06:12 AM",
      },
      {
        id: "tl-3",
        stage: "Department Routing",
        title: "Dispatched to MAWS Nodal Command",
        description: "Priority elevated to CRITICAL. Collector and Executive Engineer notified.",
        actor: "System Dispatcher",
        actorRole: "Nodal Gateway",
        timestamp: "2026-09-22 06:15 AM",
      },
      {
        id: "tl-4",
        stage: "Ground Deployment",
        title: "Field Crew & Isolation Valves Engaged",
        description: "Sluice valve 4B closed. Trench excavator arrived on site.",
        actor: "Thiru S. Sivakumar, IAS",
        actorRole: "District Collector & Head of Emergency Response",
        timestamp: "2026-09-22 07:30 AM",
      },
    ],
    aiPrediction: {
      severity: "Emergency Level 1",
      estimatedResolutionHours: 8,
      recommendedMaterial: [
        "900mm Ductile Iron Collar Clamp",
        "Submersible Sludge Dewatering Pumps (x2)",
        "Quick-Setting Bituminous Asphalt Mix (3MT)",
      ],
      confidence: 98.4,
      suggestedSlaHours: 12,
    },
    duplicateDetection: {
      duplicateFound: true,
      similarityScore: 94.2,
      duplicateCaseIds: ["TN-CIVIC-9024", "TN-CIVIC-9029"],
    },
    priorityScore: 96,
    suggestedDepartment: "Municipal Administration & Water Supply",
    officerNotes: [
      {
        id: "note-1",
        author: "Thiru S. Sivakumar, IAS",
        authorRole: "District Collector",
        note: "Traffic police instructed to divert inbound vehicles through Venkatanarayana Road. Dewatering underway. PWD asphalt repair crew on standby.",
        timestamp: "2026-09-22 07:45 AM",
      },
    ],
    resolutionHistory: [
      {
        id: "rh-1",
        action: "Case Assigned",
        performedBy: "Nodal System Automator",
        role: "AI Orchestrator",
        details: "Assigned to District Collector & MAWS team under Fast-track Civic Protocol.",
        timestamp: "2026-09-22 06:15 AM",
      },
      {
        id: "rh-2",
        action: "Priority Escalated",
        performedBy: "Thiru S. Sivakumar, IAS",
        role: "District Collector",
        details: "Flagged as Emergency Class 1 due to arterial corridor blockage.",
        timestamp: "2026-09-22 06:30 AM",
      },
    ],
  },
  {
    id: "TN-CIVIC-8974",
    title: "Hazardous 11kV HT Power Line Snapped Over Pedestrian Footway",
    description:
      "A tree branch collapsed onto live high-tension overhead cables along South Veli Street during squall winds. Cable is hanging 1.5 meters from pedestrian walkway, posing immediate electrocution hazard.",
    citizenName: "Meenakshi Sundaram",
    citizenPhone: "+91 94432 89100",
    citizenId: "CIT-TN-45102",
    category: "Electricity & Streetlights",
    priority: "critical",
    aiConfidence: 99.1,
    location: "South Veli Street, Opposite District Hospital",
    district: "Madurai",
    wardNo: "Ward 42",
    gpsCoordinates: { lat: 9.9195, lng: 78.1193 },
    status: "in_progress",
    assignedDate: "2026-09-22 07:00 AM",
    slaDeadline: "2026-09-22 11:00 AM (4h SLA)",
    officer: "Er. K. Ramanathan, M.E.",
    officerId: "off-tn-003",
    department: "Tamil Nadu Generation & Distribution (Electricity)",
    attachments: {
      images: [
        {
          id: "img-3",
          url: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=80",
          label: "Live Cable Dangling Near School Crosswalk",
        },
      ],
      videos: [],
      voiceNotes: [
        {
          id: "aud-2",
          url: "/audio/sparks-wire.mp3",
          label: "Citizen Audio Report - Visible Arcing and Sparks",
          duration: "0:29",
        },
      ],
      documents: [],
    },
    timeline: [
      {
        id: "tl-201",
        stage: "Citizen Submission",
        title: "SOS Alert Dispatched",
        description: "High priority hazard reported by civic volunteer.",
        actor: "Meenakshi Sundaram",
        actorRole: "Citizen Volunteer",
        timestamp: "2026-09-22 06:55 AM",
      },
      {
        id: "tl-202",
        stage: "Substation Trip",
        title: "Feeder 2A Isolated Remotely",
        description: "Substation operator tripped upstream breaker.",
        actor: "SCADA Control Room Madurai",
        actorRole: "Grid Operator",
        timestamp: "2026-09-22 07:05 AM",
      },
    ],
    aiPrediction: {
      severity: "Critical Life-Safety Hazard",
      estimatedResolutionHours: 2.5,
      recommendedMaterial: [
        "11kV ACSR Conductor (50m)",
        "Insulator Disc Assemblies (x4)",
        "Hydraulic Bucket Crane Truck",
      ],
      confidence: 99.1,
      suggestedSlaHours: 4,
    },
    duplicateDetection: {
      duplicateFound: false,
      similarityScore: 12.0,
    },
    priorityScore: 98,
    suggestedDepartment: "Tamil Nadu Generation & Distribution (Electricity)",
    officerNotes: [
      {
        id: "note-201",
        author: "Er. K. Ramanathan, M.E.",
        authorRole: "Superintending Engineer",
        note: "Line confirmed dead. Lineman team 3 is re-stringing cable with tree trimming crew.",
        timestamp: "2026-09-22 07:25 AM",
      },
    ],
    resolutionHistory: [
      {
        id: "rh-201",
        action: "SCADA Interlock Activated",
        performedBy: "TANGEDCO Command",
        role: "Power Grid Controller",
        details: "Feeder tripped within 90 seconds of AI hazard verification.",
        timestamp: "2026-09-22 07:02 AM",
      },
    ],
  },
  {
    id: "TN-CIVIC-8840",
    title: "Dangerous 4-Meter Deep Sinkhole in Arterial Bus Lane",
    description:
      "Deep subsidence collapsed a 4x3 meter section of Avinashi Road due to historic storm-water drain collapse beneath. Private bus tire trapped; lane barricaded.",
    citizenName: "Dr. Arvind Swaminathan",
    citizenPhone: "+91 97890 11440",
    citizenId: "CIT-TN-31092",
    category: "Roads & Traffic",
    priority: "high",
    aiConfidence: 97.2,
    location: "Avinashi Road, Peelamedu Flyover ramp",
    district: "Coimbatore",
    wardNo: "Ward 28",
    gpsCoordinates: { lat: 11.0267, lng: 76.9942 },
    status: "assigned",
    assignedDate: "2026-09-21 02:40 PM",
    slaDeadline: "2026-09-23 02:40 PM (48h SLA)",
    officer: "Er. S. Anbarasan",
    officerId: "off-tn-004",
    department: "Highways & Minor Ports (Roads)",
    attachments: {
      images: [
        {
          id: "img-4",
          url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
          label: "Sinkhole Crater with Sub-surface Pipe Exposure",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [
        {
          id: "doc-2",
          url: "/docs/geotech-survey-peelamedu.pdf",
          name: "Coimbatore_Soil_Stability_Report.pdf",
          size: "4.1 MB",
        },
      ],
    },
    timeline: [
      {
        id: "tl-301",
        stage: "Citizen Submission",
        title: "Reported with Live Location",
        description: "Civic commuter reported bus wheel stuck.",
        actor: "Dr. Arvind Swaminathan",
        actorRole: "Citizen",
        timestamp: "2026-09-21 02:30 PM",
      },
    ],
    aiPrediction: {
      severity: "Structural Void - High Risk",
      estimatedResolutionHours: 24,
      recommendedMaterial: [
        "Reinforced Concrete Precast Slab (4x3m)",
        "Granular Sub-Base Stone Dust (15MT)",
        "Rapid Concrete M35 Grade",
      ],
      confidence: 97.2,
      suggestedSlaHours: 48,
    },
    duplicateDetection: {
      duplicateFound: true,
      similarityScore: 88.5,
      duplicateCaseIds: ["TN-CIVIC-8845"],
    },
    priorityScore: 89,
    suggestedDepartment: "Highways & Minor Ports (Roads)",
    officerNotes: [],
    resolutionHistory: [],
  },
  {
    id: "TN-CIVIC-8612",
    title: "Overflowing Open Sewage Drain Threatening Primary Health Center",
    description:
      "Sewage chamber blockage in Ward 14 causing blackwater to spill across clinic entrance and public walkway. Strong stench, mosquito breeding, and dengue risk.",
    citizenName: "S. Murugesan",
    citizenPhone: "+91 94440 55190",
    citizenId: "CIT-TN-11840",
    category: "Public Health & Sanitation",
    priority: "high",
    aiConfidence: 95.8,
    location: "K.K. Nagar PHC Road, Zone 3",
    district: "Tiruchirappalli",
    wardNo: "Ward 14",
    gpsCoordinates: { lat: 10.7905, lng: 78.7047 },
    status: "resolved",
    assignedDate: "2026-09-20 09:10 AM",
    slaDeadline: "2026-09-21 09:10 AM (24h SLA)",
    officer: "Dr. M. Kavitha, MBBS, DPH",
    officerId: "off-tn-005",
    department: "Health & Family Welfare",
    attachments: {
      images: [
        {
          id: "img-5",
          url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
          label: "Cleared Sump & Disinfected Drainage Bed",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [
      {
        id: "tl-401",
        stage: "Citizen Submission",
        title: "Complaint Lodged",
        description: "PHC doctor logged sanitation crisis.",
        actor: "S. Murugesan",
        actorRole: "Citizen",
        timestamp: "2026-09-20 09:00 AM",
      },
      {
        id: "tl-402",
        stage: "Resolved",
        title: "Super-sucker Jetting & Bleaching Powder Disinfection Complete",
        description: "High-power jetting de-clogged trunk line; 100kg bleaching applied.",
        actor: "Dr. M. Kavitha, MBBS, DPH",
        actorRole: "Chief Health Officer",
        timestamp: "2026-09-20 04:30 PM",
      },
    ],
    aiPrediction: {
      severity: "Public Health Infection Risk",
      estimatedResolutionHours: 8,
      recommendedMaterial: ["Jet-Rodder Vehicle", "Bleaching Powder & Lime"],
      confidence: 95.8,
      suggestedSlaHours: 24,
    },
    duplicateDetection: {
      duplicateFound: false,
      similarityScore: 5.0,
    },
    priorityScore: 82,
    suggestedDepartment: "Health & Family Welfare",
    officerNotes: [
      {
        id: "note-401",
        author: "Dr. M. Kavitha, MBBS, DPH",
        authorRole: "Chief Health Officer",
        note: "Trunk line free-flowing. Disinfection verified by sanitary inspector. Case closed successfully.",
        timestamp: "2026-09-20 04:35 PM",
      },
    ],
    resolutionHistory: [
      {
        id: "rh-401",
        action: "Case Resolved",
        performedBy: "Dr. M. Kavitha, MBBS, DPH",
        role: "Chief Health Officer",
        details: "Sanitation restoration complete within 7.5 hours (SLA target was 24h).",
        timestamp: "2026-09-20 04:30 PM",
      },
    ],
  },
  {
    id: "TN-CIVIC-8490",
    title: "Illegal Industrial Effluent Discharge into Adyar River Channel",
    description:
      "Chemical dyeing unit discharging untreated toxic dark-blue effluent into storm drainage canal leading to Adyar river basin. High pH and chemical odors detected.",
    citizenName: "K. Elango",
    citizenPhone: "+91 98840 99210",
    citizenId: "CIT-TN-55201",
    category: "Pollution & Environment",
    priority: "critical",
    aiConfidence: 96.7,
    location: "Ramapuram Industrial Sector, Zone 11",
    district: "Chennai",
    wardNo: "Ward 152",
    gpsCoordinates: { lat: 13.0315, lng: 80.1789 },
    status: "escalated",
    assignedDate: "2026-09-19 11:30 AM",
    slaDeadline: "2026-09-20 11:30 AM (24h SLA)",
    officer: "Dr. J. Radhakrishnan, IAS",
    officerId: "off-tn-002",
    department: "Chennai Municipal Corporation",
    attachments: {
      images: [
        {
          id: "img-6",
          url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=80",
          label: "Chemical Dye Foam and Colored Discharge Canal",
        },
      ],
      videos: [],
      voiceNotes: [],
      documents: [],
    },
    timeline: [
      {
        id: "tl-501",
        stage: "Citizen Submission",
        title: "Environmental Alert Raised",
        description: "Local community leader submitted video proof.",
        actor: "K. Elango",
        actorRole: "Citizen Activist",
        timestamp: "2026-09-19 11:15 AM",
      },
      {
        id: "tl-502",
        stage: "Escalated",
        title: "Escalated to TN Pollution Control Board (TNPCB)",
        description: "Formal closure notice and electricity disconnection recommended.",
        actor: "Dr. J. Radhakrishnan, IAS",
        actorRole: "Municipal Commissioner",
        timestamp: "2026-09-19 02:15 PM",
      },
    ],
    aiPrediction: {
      severity: "Environmental Contamination - Tier 1",
      estimatedResolutionHours: 48,
      recommendedMaterial: ["Water Sampling Test Kit", "Mobile Effluent Testing Van"],
      confidence: 96.7,
      suggestedSlaHours: 24,
    },
    duplicateDetection: {
      duplicateFound: false,
      similarityScore: 18.0,
    },
    priorityScore: 95,
    suggestedDepartment: "Chennai Municipal Corporation",
    officerNotes: [
      {
        id: "note-501",
        author: "Dr. J. Radhakrishnan, IAS",
        authorRole: "Municipal Commissioner",
        note: "Joint inspection with TNPCB flying squad conducted. Factory outlet plugged. Show cause notice issued.",
        timestamp: "2026-09-19 02:20 PM",
      },
    ],
    resolutionHistory: [
      {
        id: "rh-501",
        action: "Escalated to State Pollution Board",
        performedBy: "Dr. J. Radhakrishnan, IAS",
        role: "Municipal Commissioner",
        details: "Jurisdictional escalation triggered for statutory penalty and facility sealing.",
        timestamp: "2026-09-19 02:15 PM",
      },
    ],
  },
];

export const MOCK_MONTHLY_STATS: MonthlyIssueStat[] = [
  { month: "Apr", received: 1420, resolved: 1350, escalated: 45 },
  { month: "May", received: 1890, resolved: 1780, escalated: 62 },
  { month: "Jun", received: 2340, resolved: 2190, escalated: 89 },
  { month: "Jul", received: 2850, resolved: 2710, escalated: 74 },
  { month: "Aug", received: 3120, resolved: 2980, escalated: 95 },
  { month: "Sep", received: 3450, resolved: 3310, escalated: 68 },
];

export const MOCK_RESOLUTION_TRENDS: ResolutionTrendStat[] = [
  { day: "Mon", avgHours: 19.2, targetHours: 24 },
  { day: "Tue", avgHours: 17.5, targetHours: 24 },
  { day: "Wed", avgHours: 16.8, targetHours: 24 },
  { day: "Thu", avgHours: 18.4, targetHours: 24 },
  { day: "Fri", avgHours: 15.9, targetHours: 24 },
  { day: "Sat", avgHours: 14.2, targetHours: 24 },
  { day: "Sun", avgHours: 13.8, targetHours: 24 },
];

export const MOCK_DISTRICT_STATS: DistrictIssueStat[] = [
  { district: "Chennai", total: 1240, resolved: 1180, critical: 18 },
  { district: "Coimbatore", total: 820, resolved: 790, critical: 8 },
  { district: "Madurai", total: 690, resolved: 650, critical: 12 },
  { district: "Tiruchirappalli", total: 540, resolved: 520, critical: 6 },
  { district: "Salem", total: 430, resolved: 410, critical: 5 },
  { district: "Tirunelveli", total: 380, resolved: 365, critical: 4 },
];

export const MOCK_DEPARTMENT_METRICS: DepartmentMetricStat[] = [
  { department: "Water Supply (MAWS)", slaRate: 94.8, activeCases: 142, officers: 420 },
  { department: "Public Works (PWD)", slaRate: 91.2, activeCases: 88, officers: 315 },
  { department: "Highways & Roads", slaRate: 88.6, activeCases: 194, officers: 280 },
  { department: "Electricity (TANGEDCO)", slaRate: 96.4, activeCases: 76, officers: 510 },
  { department: "Public Health", slaRate: 95.1, activeCases: 65, officers: 390 },
  { department: "Solid Waste (SWM)", slaRate: 89.4, activeCases: 112, officers: 210 },
];

// LocalStorage helpers for synchronization
function getStoredOfficers(): GovernmentOfficer[] {
  if (typeof window === "undefined") return INITIAL_OFFICERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFICERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_OFFICERS, JSON.stringify(INITIAL_OFFICERS));
      return INITIAL_OFFICERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OFFICERS;
  }
}

function saveOfficers(officers: GovernmentOfficer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_OFFICERS, JSON.stringify(officers));
  } catch (e) {
    console.error("Failed to persist officers", e);
  }
}

function getStoredCases(): GovernmentCase[] {
  if (typeof window === "undefined") return INITIAL_CASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CASES;
  }
}

function saveCases(cases: GovernmentCase[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
  } catch (e) {
    console.error("Failed to persist cases", e);
  }
}

function getStoredDepartments(): GovernmentDepartment[] {
  if (typeof window === "undefined") return INITIAL_DEPARTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEPARTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
      return INITIAL_DEPARTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEPARTMENTS;
  }
}

function saveDepartments(depts: GovernmentDepartment[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_DEPARTMENTS, JSON.stringify(depts));
  } catch (e) {
    console.error("Failed to persist departments", e);
  }
}

function mapCentralIssueToGovernmentCase(item: any): GovernmentCase {
  const images = item.attachments?.images || [];
  const videos = item.attachments?.videos || [];
  const voiceNotes = item.attachments?.voiceNotes || [];
  const documents = item.attachments?.documents || [];

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    citizenName: item.citizenName || "Citizen",
    citizenPhone: item.citizenPhone || "+91 98401 22891",
    citizenId: item.citizenId || "CIT-TN-88219",
    category: item.category,
    priority: (item.priority as CasePriority) || "medium",
    aiConfidence: item.aiConfidence || 97.5,
    location: item.location || "Indiranagar, Ward 142, Bengaluru",
    district: item.district || "Bengaluru Urban",
    wardNo: item.wardNo || "Ward 142",
    gpsCoordinates: item.gpsCoordinates || { lat: 13.0425, lng: 80.2514 },
    status: (item.status as CaseStatus) || "assigned",
    assignedDate: item.createdAt
      ? new Date(item.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Today",
    slaDeadline: item.slaDeadline || "24h SLA",
    officer: item.assignedOfficer || "Thiru S. Sivakumar, IAS",
    officerId: item.officerId || "off-tn-001",
    department: item.assignedDepartment || "Municipal Administration & Water Supply",
    attachments: {
      images: images.map((img: any) => ({
        id: img.id || `img-${Math.random()}`,
        url: img.url,
        label: img.label || "Inspection Photo",
      })),
      videos: videos.map((vid: any) => ({
        id: vid.id || `vid-${Math.random()}`,
        url: vid.url,
        label: vid.label || "Video Telemetry",
        duration: vid.duration || "0:30",
      })),
      voiceNotes: voiceNotes.map((aud: any) => ({
        id: aud.id || `aud-${Math.random()}`,
        url: aud.url,
        label: aud.label || "Audio Grievance Note",
        duration: aud.duration || "0:25",
      })),
      documents: documents.map((doc: any) => ({
        id: doc.id || `doc-${Math.random()}`,
        url: doc.url,
        name: doc.name || "Municipal Record",
        size: doc.size || "150 KB",
      })),
    },
    timeline: (item.timeline || []).map((tl: any) => ({
      id: tl.id,
      stage: tl.stage,
      title: tl.title,
      description: tl.description,
      actor: tl.actor,
      actorRole: tl.actorRole,
      timestamp: tl.timestamp,
      statusBadge: tl.statusBadge,
    })),
    aiPrediction: item.aiPrediction || {
      severity: "Verified Municipal Defect",
      estimatedResolutionHours: 24,
      recommendedMaterial: ["General Repair Material"],
      confidence: item.aiConfidence || 97.5,
      suggestedSlaHours: 24,
    },
    duplicateDetection: {
      duplicateFound: false,
      similarityScore: 8.5,
    },
    priorityScore:
      item.priority === "critical"
        ? 98
        : item.priority === "high"
        ? 85
        : item.priority === "medium"
        ? 65
        : 40,
    suggestedDepartment: item.assignedDepartment,
    officerNotes: item.officerNotes || [],
    resolutionHistory: item.resolutionHistory || [],
  };
}

// Government API Service
export const governmentApi = {
  // Authentication: strictly validates email, password, and officialPassKey
  async login(
    email: string,
    password: string,
    officialPassKey: string
  ): Promise<{ officer: GovernmentOfficer; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const officers = getStoredOfficers();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassKey = officialPassKey.trim().toUpperCase();

    const officer = officers.find(
      (o) =>
        o.email.toLowerCase() === normalizedEmail &&
        o.officialPassKey.toUpperCase() === normalizedPassKey &&
        o.passwordHash === password
    );

    if (!officer) {
      throw new Error("Invalid Credentials");
    }

    if (officer.status !== "active") {
      throw new Error("Officer account is suspended or inactive. Contact State Administrator.");
    }

    // Update last login
    officer.lastLoginAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    saveOfficers(officers);

    const token = `gov-jwt-${officer.id}-${Date.now()}`;
    return { officer, token };
  },

  // Google SSO: only officers existing in the official directory can proceed
  async loginWithGoogle(
    email: string
  ): Promise<{ officer: GovernmentOfficer; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const officers = getStoredOfficers();
    const officer = officers.find(
      (o) => o.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!officer) {
      throw new Error(
        "Access Denied: Your Google identity is not associated with an authorized Government Officer profile."
      );
    }

    if (officer.status !== "active") {
      throw new Error("Officer account is suspended. Contact State Administrator.");
    }

    officer.lastLoginAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    saveOfficers(officers);

    const token = `gov-sso-jwt-${officer.id}-${Date.now()}`;
    return { officer, token };
  },

  // Dashboard Stats from Central Database
  async getDashboardStats(): Promise<GovernmentDashboardStats> {
    try {
      const res = await fetch("/api/government/stats", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/government/stats", e);
    }

    const cases = getStoredCases();
    return {
      totalAssignedCases: cases.length,
      resolvedCases: cases.filter((c) => c.status === "resolved").length,
      pendingCases: cases.filter(
        (c) => c.status === "assigned" || c.status === "in_progress"
      ).length,
      highPriorityCases: cases.filter((c) => c.priority === "high").length,
      emergencyCases: cases.filter((c) => c.priority === "critical").length,
      averageResolutionHours: 16.8,
      departmentPerformanceRate: 94.6,
      citizenSatisfactionScore: 4.8,
    };
  },

  // Charts
  async getMonthlyIssues(): Promise<MonthlyIssueStat[]> {
    return MOCK_MONTHLY_STATS;
  },

  async getResolutionTrends(): Promise<ResolutionTrendStat[]> {
    return MOCK_RESOLUTION_TRENDS;
  },

  async getDistrictIssues(): Promise<DistrictIssueStat[]> {
    return MOCK_DISTRICT_STATS;
  },

  async getDepartmentMetrics(): Promise<DepartmentMetricStat[]> {
    return MOCK_DEPARTMENT_METRICS;
  },

  // Case Management from Central Database
  async getCases(filter?: {
    status?: string;
    priority?: string;
    department?: string;
    search?: string;
  }): Promise<GovernmentCase[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filter?.status && filter.status !== "all") queryParams.set("status", filter.status);
      if (filter?.priority && filter.priority !== "all") queryParams.set("priority", filter.priority);
      if (filter?.department && filter.department !== "all") queryParams.set("department", filter.department);
      if (filter?.search) queryParams.set("search", filter.search);

      const res = await fetch(`/api/issues?${queryParams.toString()}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const mappedCases = (json.items || []).map(mapCentralIssueToGovernmentCase);
        saveCases(mappedCases);
        return mappedCases;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/issues from server, reading local cache", e);
    }

    let cases = getStoredCases();
    if (filter?.status && filter.status !== "all") {
      cases = cases.filter((c) => c.status === filter.status);
    }
    if (filter?.priority && filter.priority !== "all") {
      cases = cases.filter((c) => c.priority === filter.priority);
    }
    if (filter?.department && filter.department !== "all") {
      cases = cases.filter((c) => c.department === filter.department);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      cases = cases.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    return cases;
  },

  async getCaseById(caseId: string): Promise<GovernmentCase | null> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(caseId)}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        if (json.issue) {
          return mapCentralIssueToGovernmentCase(json.issue);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch /api/issues/[id]", e);
    }

    const cases = getStoredCases();
    return cases.find((c) => c.id === caseId) || null;
  },

  async approveCase(caseId: string, officerName: string): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(caseId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "in_progress",
          officerName,
          details: `Field team deployed and mobilized by ${officerName}. Work is in progress.`,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const mapped = mapCentralIssueToGovernmentCase(json.issue);
        const stored = getStoredCases();
        const idx = stored.findIndex((c) => c.id === caseId);
        if (idx !== -1) {
          stored[idx] = mapped;
          saveCases(stored);
        }
        return mapped;
      }
    } catch (e) {
      console.warn("API approveCase failed, using local fallback", e);
    }

    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === caseId);
    if (index === -1) throw new Error("Case not found");

    const c = cases[index];
    c.status = "in_progress";
    c.timeline.push({
      id: `tl-${Date.now()}`,
      stage: "Approved & Mobilized",
      title: "Field Deployment Approved",
      description: `Case approved for execution by ${officerName}. Field team deployed.`,
      actor: officerName,
      actorRole: "Authorized Officer",
      timestamp: new Date().toLocaleString(),
    });
    saveCases(cases);
    return c;
  },

  async rejectCase(
    caseId: string,
    reason: string,
    officerName: string
  ): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(caseId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "rejected",
          reason,
          officerName,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const mapped = mapCentralIssueToGovernmentCase(json.issue);
        const stored = getStoredCases();
        const idx = stored.findIndex((c) => c.id === caseId);
        if (idx !== -1) {
          stored[idx] = mapped;
          saveCases(stored);
        }
        return mapped;
      }
    } catch (e) {
      console.warn("API rejectCase failed, using local fallback", e);
    }

    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === caseId);
    if (index === -1) throw new Error("Case not found");

    const c = cases[index];
    c.status = "rejected";
    saveCases(cases);
    return c;
  },

  async escalateCase(
    caseId: string,
    officerName: string,
    justification = "Escalated for immediate multi-department coordination."
  ): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(caseId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "escalated",
          details: justification,
          officerName,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const mapped = mapCentralIssueToGovernmentCase(json.issue);
        const stored = getStoredCases();
        const idx = stored.findIndex((c) => c.id === caseId);
        if (idx !== -1) {
          stored[idx] = mapped;
          saveCases(stored);
        }
        return mapped;
      }
    } catch (e) {
      console.warn("API escalateCase failed", e);
    }

    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === caseId);
    if (index === -1) throw new Error("Case not found");
    const c = cases[index];
    c.status = "escalated";
    saveCases(cases);
    return c;
  },

  async resolveCase(
    data: ResolveCaseFormData,
    officerName: string
  ): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(data.caseId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "resolved",
          details: `${data.resolutionNotes} (${data.laborHoursSpent} labor hours logged)`,
          officerName,
          completionEvidenceUrl: data.completionEvidenceUrl,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const mapped = mapCentralIssueToGovernmentCase(json.issue);
        const stored = getStoredCases();
        const idx = stored.findIndex((c) => c.id === data.caseId);
        if (idx !== -1) {
          stored[idx] = mapped;
          saveCases(stored);
        }
        return mapped;
      }
    } catch (e) {
      console.warn("API resolveCase failed", e);
    }

    const cases = getStoredCases();
    const index = cases.findIndex((c) => c.id === data.caseId);
    if (index === -1) throw new Error("Case not found");
    const c = cases[index];
    c.status = "resolved";
    saveCases(cases);
    return c;
  },

  async reassignOfficer(
    data: ReassignOfficerFormData,
    performingOfficer: string
  ): Promise<GovernmentCase> {
    const officers = getStoredOfficers();
    const targetOfficer = officers.find((o) => o.id === data.newOfficerId);

    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(data.caseId)}/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          officerId: data.newOfficerId,
          officerName: targetOfficer?.name || "Assigned Officer",
          reason: data.reason,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const mapped = mapCentralIssueToGovernmentCase(json.issue);
        return mapped;
      }
    } catch (e) {
      console.warn("API reassignOfficer failed", e);
    }

    const cases = getStoredCases();
    const cIndex = cases.findIndex((c) => c.id === data.caseId);
    if (cIndex === -1) throw new Error("Case not found");
    const c = cases[cIndex];
    if (targetOfficer) {
      c.officer = targetOfficer.name;
      c.officerId = targetOfficer.id;
    }
    saveCases(cases);
    return c;
  },

  async transferDepartment(
    data: TransferDepartmentFormData,
    performingOfficer: string
  ): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(data.caseId)}/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          department: data.newDepartment,
          officerName: performingOfficer,
          reason: data.justification,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        return mapCentralIssueToGovernmentCase(json.issue);
      }
    } catch (e) {
      console.warn("API transferDepartment failed", e);
    }

    const cases = getStoredCases();
    const cIndex = cases.findIndex((c) => c.id === data.caseId);
    if (cIndex === -1) throw new Error("Case not found");
    const c = cases[cIndex];
    c.department = data.newDepartment;
    saveCases(cases);
    return c;
  },

  async addOfficerNote(
    caseId: string,
    note: string,
    author: string,
    authorRole: string
  ): Promise<GovernmentCase> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(caseId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note, author, authorRole }),
      });
      if (res.ok) {
        const json = await res.json();
        return mapCentralIssueToGovernmentCase(json.issue);
      }
    } catch (e) {
      console.warn("API addOfficerNote failed", e);
    }

    const cases = getStoredCases();
    const cIndex = cases.findIndex((c) => c.id === caseId);
    if (cIndex === -1) throw new Error("Case not found");
    const c = cases[cIndex];
    c.officerNotes.unshift({
      id: `note-${Date.now()}`,
      author,
      authorRole,
      note,
      timestamp: new Date().toLocaleString(),
    });

    saveCases(cases);
    return c;
  },

  // Officers Management
  async getOfficers(): Promise<GovernmentOfficer[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getStoredOfficers();
  },

  async createOfficer(data: OfficerCreationFormData): Promise<GovernmentOfficer> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const officers = getStoredOfficers();

    // Check duplicate email
    if (officers.some((o) => o.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("An officer with this email address already exists.");
    }

    // Check duplicate pass key
    if (
      officers.some(
        (o) => o.officialPassKey.toUpperCase() === data.officialPassKey.toUpperCase()
      )
    ) {
      throw new Error("Pass key collision detected. Please generate a new unique pass key.");
    }

    const newOfficer: GovernmentOfficer = {
      id: `off-tn-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      department: data.department,
      district: data.district,
      designation: data.designation,
      role: data.role as any,
      officialPassKey: data.officialPassKey.toUpperCase(),
      status: data.status,
      createdBy: "Admin Console",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: data.phone || "+91 44 2500 0000",
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };

    officers.unshift(newOfficer);
    saveOfficers(officers);
    return newOfficer;
  },

  async updateOfficer(
    id: string,
    updates: Partial<GovernmentOfficer>
  ): Promise<GovernmentOfficer> {
    const officers = getStoredOfficers();
    const index = officers.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Officer not found");

    officers[index] = {
      ...officers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveOfficers(officers);
    return officers[index];
  },

  async deleteOfficer(id: string): Promise<void> {
    const officers = getStoredOfficers();
    const filtered = officers.filter((o) => o.id !== id);
    saveOfficers(filtered);
  },

  async toggleOfficerStatus(id: string): Promise<GovernmentOfficer> {
    const officers = getStoredOfficers();
    const index = officers.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Officer not found");

    const current = officers[index].status;
    officers[index].status = current === "active" ? "suspended" : "active";
    officers[index].updatedAt = new Date().toISOString();

    saveOfficers(officers);
    return officers[index];
  },

  async regenerateOfficerPassKey(
    id: string,
    stateCode = "TN",
    deptCode = "GOV"
  ): Promise<string> {
    const officers = getStoredOfficers();
    const index = officers.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Officer not found");

    const existingKeys = officers.map((o) => o.officialPassKey);
    const newKey = generateUniquePassKey(stateCode, deptCode, existingKeys);

    officers[index].officialPassKey = newKey;
    officers[index].updatedAt = new Date().toISOString();
    saveOfficers(officers);

    return newKey;
  },

  async resetOfficerPassword(id: string, newPassword: string): Promise<void> {
    const officers = getStoredOfficers();
    const index = officers.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Officer not found");

    officers[index].passwordHash = newPassword;
    officers[index].updatedAt = new Date().toISOString();
    saveOfficers(officers);
  },

  // Department Management (Backend 3: Routing & Department Hierarchy)
  async getDepartments(): Promise<GovernmentDepartment[]> {
    try {
      const res = await routingClient.get(API_ENDPOINTS.ROUTING.DEPARTMENTS.BASE);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getStoredDepartments();
    }
  },

  async createDepartment(
    data: DepartmentCreationFormData
  ): Promise<GovernmentDepartment> {
    const depts = getStoredDepartments();
    const newDept: GovernmentDepartment = {
      id: `dept-tn-${Date.now().toString().slice(-4)}`,
      code: data.code.toUpperCase(),
      name: data.name,
      headOfficerName: data.headOfficerName,
      headOfficerEmail: data.headOfficerEmail,
      districtsCovered: data.districtsCovered,
      activeOfficersCount: 1,
      activeIssuesCount: 0,
      slaComplianceRate: 98.0,
      budgetAllocatedCr: data.budgetAllocatedCr,
      budgetUtilizedCr: 0,
      status: data.status,
    };

    depts.push(newDept);
    saveDepartments(depts);
    return newDept;
  },

  async updateDepartment(
    id: string,
    updates: Partial<GovernmentDepartment>
  ): Promise<GovernmentDepartment> {
    const depts = getStoredDepartments();
    const index = depts.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Department not found");

    depts[index] = { ...depts[index], ...updates };
    saveDepartments(depts);
    return depts[index];
  },

  async deleteDepartment(id: string): Promise<void> {
    const depts = getStoredDepartments();
    const filtered = depts.filter((d) => d.id !== id);
    saveDepartments(filtered);
  },
};
