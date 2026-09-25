import { axiosClient } from "@/features/shared/services/axios-client";
import {
  IndustryDashboardStats,
  IndustryProject,
  OrganizationProfile,
  FundingOpportunity,
  FundReleaseRecord,
  MentorshipEngagement,
  MentorshipTask,
  ScheduledMeeting,
  UniversityPartner,
  ResearchCollaboration,
  PrototypeSubmission,
  ImplementationTrackerItem,
  IndustryMessage,
  IndustryConversation,
  IndustryNotification,
  RecentActivity,
  IndustryUser,
} from "../types";
import {
  IndustryLoginFormData,
  OrganizationProfileFormData,
  SponsorProjectFormData,
  ReleaseFundsFormData,
  ScheduleMeetingFormData,
  AssignTaskFormData,
  RateTeamFormData,
  PrototypeReviewFormData,
} from "../validation/industry-schemas";

export const MOCK_ORGANIZATION_PROFILE: OrganizationProfile = {
  id: "org_tcs_social_01",
  name: "Tata Social Innovation Foundation",
  legalEntityName: "Tata Consultancy Services CSR Trust",
  sector: "Information Technology & Civic Infrastructure",
  subSector: "Smart Cities, AI for Good & Sustainable Energy",
  cinOrRegNumber: "U72200MH1995PLC085699",
  website: "https://www.tata.com/sustainability/csr",
  email: "csr.innovation@tata.com",
  phone: "+91 (022) 6778-9999",
  address: {
    street: "Bombay House, 24 Homi Mody Street, Fort",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
  },
  logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
  csrFocusAreas: [
    "Clean Drinking Water & IoT Aquifer Monitoring",
    "EV Microgrids & Distributed Battery Storage",
    "AI-enabled Municipal Waste Sorting",
    "Rural Telemedicine & Portable Diagnostic Kits",
  ],
  technologyDomains: [
    "Edge AI & IoT Embedded Sensors",
    "Computer Vision & Drone Analytics",
    "GIS Mapping & Hydrodynamic Simulation",
    "Clean Energy Telemetry & BMS",
  ],
  availableBudget: 45000000, // 4.5 Crores INR
  allocatedBudget: 28500000,
  spentBudget: 19250000,
  contactPerson: {
    name: "Dr. Rajeshwar Kulkarni",
    designation: "Vice President & Head of Social R&D Alliances",
    email: "rajeshwar.kulkarni@tata.com",
    phone: "+91 98200 45891",
  },
  verificationStatus: "verified",
  esgRating: {
    environmental: 94,
    social: 96,
    governance: 92,
    compositeScore: 94,
    grade: "AAA",
  },
  csrRegistration80G: "AAATT0144PF20214",
  csrRegistration12A: "AAATT0144PE19992",
  activeInitiativesCount: 18,
};

export const MOCK_PROJECTS: IndustryProject[] = [
  {
    id: "IND-PRJ-2026-01",
    title: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    category: "Water Management & Sanitation",
    district: "Bengaluru Urban",
    university: "Indian Institute of Science (IISc)",
    problemDescription:
      "Municipal water supply experiences 34% non-revenue water loss caused by subterranean micro-fissures in ductile iron pipelines that remain invisible until road sinkholes form.",
    detailedStatement:
      "Subterranean pipeline breaches often propagate undetected for months before catastrophic asphalt subsidence. This project establishes low-power vibrational and ultrasonic transducer arrays clamped to existing sluice valves that log continuous frequency signatures, pin-pointing acoustic deviations within ±1.5 meters accuracy.",
    expectedOutcome:
      "Deployment across 45 kilometers of arterial water network, reducing municipal water loss by an estimated 18 million liters monthly and cutting road repair SLA by 60%.",
    requiredTechnologies: ["Edge DSP", "Piezoelectric Accelerometers", "LoRaWAN Gateway", "Acoustic ML Model"],
    currentStatus: "open_for_sponsorship",
    expectedBudget: 2450000,
    fundedAmount: 1200000,
    timelineMonths: 8,
    startDate: "2026-08-01",
    targetCompletionDate: "2027-03-31",
    facultyLead: {
      id: "fac_iisc_01",
      name: "Prof. Arisudan Sharma",
      designation: "Professor & Chair of Fluid Dynamics",
      department: "Dept of Civil & Environmental Engineering",
      university: "Indian Institute of Science (IISc)",
      email: "a.sharma@iisc.ac.in",
    },
    studentTeamSize: 6,
    teamMembers: [
      { id: "st-1", name: "Rohan Varma", email: "rohan.v@iisc.ac.in", role: "Telemetry Hardware Lead", year: "Ph.D. Year 2" },
      { id: "st-2", name: "Ananya Iyer", email: "ananya.i@iisc.ac.in", role: "Acoustic DSP Modeling", year: "M.Tech CDS" },
      { id: "st-3", name: "Karthik S", email: "karthik.s@iisc.ac.in", role: "LoRa Network Firmware", year: "B.Tech Final" },
    ],
    governmentDepartment: "Bangalore Water Supply & Sewerage Board (BWSSB)",
    milestones: [
      {
        id: "m-01",
        title: "Piezo Transducer Bench Flume Calibration",
        description: "Verify signal-to-noise ratio under fluctuating 2-6 bar hydraulic pressures.",
        targetDate: "2026-09-30",
        status: "approved",
        completedDate: "2026-09-24",
        fundingReleasePercentage: 25,
        deliverableUrl: "/docs/flume_calibration_report.pdf",
        feedback: "Signal coherence validated. Transducer casing rated IP68 waterproofing.",
      },
      {
        id: "m-02",
        title: "Ward 142 Field Testbed Pilot (12 Nodes)",
        description: "Deploy 12 telemetry nodes along Indiranagar 100ft road corridor.",
        targetDate: "2026-11-15",
        status: "submitted",
        fundingReleasePercentage: 35,
        deliverableUrl: "/docs/field_testbed_prelim.pdf",
      },
      {
        id: "m-03",
        title: "BWSSB SCADA Interop & GIS Dashboard",
        description: "Direct API streaming of leak coordinate warnings into municipal operations room.",
        targetDate: "2027-01-30",
        status: "pending",
        fundingReleasePercentage: 25,
      },
      {
        id: "m-04",
        title: "Final Impact Audit & Field Handover",
        description: "30-day continuous soak testing and municipality sign-off documentation.",
        targetDate: "2027-03-31",
        status: "pending",
        fundingReleasePercentage: 15,
      },
    ],
    mediaAssets: [
      { id: "ast-1", title: "Piezo Clamping CAD Render", type: "image", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-08-15" },
      { id: "ast-2", title: "Indiranagar Corridor Hydrology Map", type: "image", url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-08-20" },
      { id: "ast-3", title: "Acoustic Waveform Analysis Whitepaper", type: "document", url: "/docs/acoustic_leak_spec.pdf", size: "3.4 MB", uploadedAt: "2026-09-02" },
    ],
    aiAnalysis: {
      feasibilityScore: 92,
      societalImpactScore: 96,
      patentabilityScore: 84,
      readinessLevel: "TRL 6 - Field Prototype",
      keyRisks: [
        "High vehicular traffic noise might induce false acoustic echoes on shallow pipes",
        "Battery degradation in subterranean humidity requires cathodic isolation",
      ],
      suggestedIndustrialApplications: [
        "Cross-utility gas and petrochemical pipeline integrity audits",
        "Smart industrial park recycled water ring distribution",
      ],
      estimatedTimeSavings: "Reduces leak detection delay from 21 days to under 4 hours",
    },
    prototypeStage: "Field Hardware",
    discussionCommentsCount: 14,
    isBookmarked: true,
    sponsoredByUs: true,
  },
  {
    id: "IND-PRJ-2026-02",
    title: "Second-Life Lithium Battery Swapping Microgrid for e-Rickshaws",
    category: "Clean Energy & EV Microgrids",
    district: "Dharwad",
    university: "National Institute of Technology Karnataka (NITK)",
    problemDescription:
      "Retired automotive EV battery modules retain 75% capacity but are prematurely discarded to landfill, while Tier-2 town e-rickshaw drivers pay predatory daily battery rental charges.",
    detailedStatement:
      "This project repurposes decommissioned 48V electric vehicle battery packs with active balancing BMS units linked to a community solar canopy. Rickshaw operators swap spent modules in 90 seconds, paying via UPI micro-transactions.",
    expectedOutcome:
      "Deploy 3 automated community charging stations serving 180 rickshaws, lowering driver daily operating cost by 48% and diverting 12 tonnes of lithium cells from scrap heaps.",
    requiredTechnologies: ["Active Cell Balancing BMS", "CAN Bus Telemetry", "Thermal Runaway Detection", "Solar MPPT Inverters"],
    currentStatus: "prototype_ready",
    expectedBudget: 3800000,
    fundedAmount: 3800000,
    timelineMonths: 10,
    startDate: "2026-06-15",
    targetCompletionDate: "2027-04-15",
    facultyLead: {
      id: "fac_nitk_02",
      name: "Dr. Sumitra Rao",
      designation: "Associate Professor & Head of Power Systems",
      department: "Dept of Electrical & Electronics Engineering",
      university: "NITK Surathkal",
      email: "sumitra.rao@nitk.edu.in",
    },
    studentTeamSize: 8,
    teamMembers: [
      { id: "st-4", name: "Pranav Joshi", email: "pranav.j@nitk.edu.in", role: "Power Electronics Specialist", year: "M.Tech" },
      { id: "st-5", name: "Kavya Hegde", email: "kavya.h@nitk.edu.in", role: "Battery Chemistry & BMS", year: "Ph.D. Year 1" },
    ],
    governmentDepartment: "Karnataka Renewable Energy Development Ltd (KREDL)",
    milestones: [
      { id: "m-05", title: "Battery Health Profiling Algorithm", description: "Impedance spectroscopy cycle test", targetDate: "2026-08-15", status: "approved", completedDate: "2026-08-12", fundingReleasePercentage: 30 },
      { id: "m-06", title: "Automated Canopy Cabinet Assembly", description: "Fire-suppressant automated locker", targetDate: "2026-11-20", status: "in_progress", fundingReleasePercentage: 40 },
      { id: "m-07", title: "Driver Field Deployment in Hubballi Hub", description: "Onboarding 50 commercial operators", targetDate: "2027-03-10", status: "pending", fundingReleasePercentage: 30 },
    ],
    mediaAssets: [
      { id: "ast-4", title: "Battery Swapping Station Prototype", type: "image", url: "https://images.unsplash.com/photo-1558441719-8b489c634a1b?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-07-20" },
    ],
    aiAnalysis: {
      feasibilityScore: 89,
      societalImpactScore: 98,
      patentabilityScore: 78,
      readinessLevel: "TRL 6 - Field Prototype",
      keyRisks: ["Thermal management during peak 42°C summer conditions requires phase-change heat sinks"],
      suggestedIndustrialApplications: ["Telecom tower UPS backup hybridization", "Agricultural pump solar microgrids"],
      estimatedTimeSavings: "Reduces battery charging downtime from 6 hours to 90 seconds",
    },
    prototypeStage: "Bench Prototype",
    discussionCommentsCount: 22,
    isBookmarked: false,
    sponsoredByUs: false,
  },
  {
    id: "IND-PRJ-2026-03",
    title: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    category: "Air Quality & Waste Governance",
    district: "Mysuru",
    university: "JSS Science and Technology University",
    problemDescription:
      "Municipal dry waste collection centers depend on hazardous manual sorting of commingled recyclables, resulting in high worker occupational illness and under 25% plastic purity.",
    detailedStatement:
      "A high-speed conveyor vision system equipped with multispectral NIR imaging and pneumatic ejection valves that classifies 14 categories of rigid plastics (HDPE, LDPE, PP, PET, Multilayer) at 4 items per second.",
    expectedOutcome:
      "Sort 3.5 metric tons per day with 96% polymer separation purity, eliminating manual contact with contaminated sharp packaging and tripling waste picker federation revenues.",
    requiredTechnologies: ["YOLOv10 Edge Inference", "Pneumatic Solenoid Manifolds", "NIR Spectroscopy", "Industrial PLC"],
    currentStatus: "pilot_testing",
    expectedBudget: 1950000,
    fundedAmount: 1950000,
    timelineMonths: 6,
    startDate: "2026-05-01",
    targetCompletionDate: "2026-11-30",
    facultyLead: {
      id: "fac_jss_03",
      name: "Dr. Chandrashekar B",
      designation: "Professor & Chair of Mechatronics",
      department: "Dept of Mechanical & Automation Engineering",
      university: "JSS Science & Technology University",
      email: "chandrashekar@jssstuniv.in",
    },
    studentTeamSize: 5,
    teamMembers: [
      { id: "st-6", name: "Aishwarya Shenoy", email: "aishwarya@jssstuniv.in", role: "Computer Vision Lead", year: "Final Year" },
    ],
    governmentDepartment: "Mysuru City Corporation (MCC Health & Sanitation)",
    milestones: [
      { id: "m-08", title: "Conveyor Vision Bench Rig", description: "Optical testbed validation", targetDate: "2026-06-30", status: "approved", completedDate: "2026-06-25", fundingReleasePercentage: 40 },
      { id: "m-09", title: "Pneumatic Ejection Manifold Fabrication", description: "High-speed valve response", targetDate: "2026-08-31", status: "approved", completedDate: "2026-08-28", fundingReleasePercentage: 35 },
      { id: "m-10", title: "Vidyaranyapuram DWCC Installation", description: "Field trial with worker federation", targetDate: "2026-11-15", status: "submitted", fundingReleasePercentage: 25 },
    ],
    mediaAssets: [
      { id: "ast-5", title: "Pneumatic Vision Sorter Rig", type: "image", url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-07-10" },
    ],
    aiAnalysis: {
      feasibilityScore: 95,
      societalImpactScore: 92,
      patentabilityScore: 82,
      readinessLevel: "TRL 7 - Demonstration System",
      keyRisks: ["Dust accumulation on camera optical lenses requires periodic air-knife purging"],
      suggestedIndustrialApplications: ["Automated electronic scrap sorting", "Commercial MRF recycling facilities"],
      estimatedTimeSavings: "Increases sorting speed by 350% over manual triage",
    },
    prototypeStage: "Ready for Pilot",
    discussionCommentsCount: 9,
    isBookmarked: true,
    sponsoredByUs: true,
  },
  {
    id: "IND-PRJ-2026-04",
    title: "Solar-Powered Water Fluoride & Heavy Metal Electrochemical Filter",
    category: "Water Management & Sanitation",
    district: "Tumakuru",
    university: "Siddaganga Institute of Technology",
    problemDescription:
      "Rural borewells in Pavagada taluk show fluoride levels exceeding 3.8 mg/L causing crippling dental and skeletal fluorosis among schoolchildren.",
    detailedStatement:
      "Electrocatalytic defluoridation unit powered by direct solar photovoltaic cells that precipitates fluorides into inert calcium minerals without toxic chemical sludge disposal issues.",
    expectedOutcome:
      "Provide 2,000 liters of potable drinking water daily to 4 rural government schools, maintaining fluoride levels safely below 1.0 mg/L conforming to WHO standards.",
    requiredTechnologies: ["Electrocoagulation", "Solar MPPT", "Automated Reverse Polarity Cleaning", "TDS/Fluoride ISE Sensors"],
    currentStatus: "open_for_sponsorship",
    expectedBudget: 1650000,
    fundedAmount: 450000,
    timelineMonths: 6,
    startDate: "2026-09-01",
    targetCompletionDate: "2027-02-28",
    facultyLead: {
      id: "fac_sit_04",
      name: "Dr. Manjunatha Swamy",
      designation: "Professor of Chemical Engineering",
      department: "Dept of Chemical Engineering",
      university: "Siddaganga Institute of Technology",
      email: "manjunathaswamy@sit.ac.in",
    },
    studentTeamSize: 4,
    teamMembers: [
      { id: "st-7", name: "Suresh Gowda", email: "suresh.g@sit.ac.in", role: "Electrocatalysis Research", year: "M.Tech" },
    ],
    governmentDepartment: "Rural Drinking Water & Sanitation Dept (RDWSD)",
    milestones: [
      { id: "m-11", title: "Electrode Longevity Optimization", description: "Accelerated 500-hour testing", targetDate: "2026-10-31", status: "in_progress", fundingReleasePercentage: 35 },
      { id: "m-12", title: "Pavagada School Prototype Skid", description: "Containerized deployment", targetDate: "2026-12-31", status: "pending", fundingReleasePercentage: 45 },
    ],
    mediaAssets: [
      { id: "ast-6", title: "Electrode Skid Architecture", type: "image", url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-09-05" },
    ],
    aiAnalysis: {
      feasibilityScore: 91,
      societalImpactScore: 99,
      patentabilityScore: 88,
      readinessLevel: "TRL 5 - Tech Validated",
      keyRisks: ["Scaling on electrode surfaces requiring automated bipolar switching"],
      suggestedIndustrialApplications: ["Industrial wastewater electro-deposition", "Textile dye bath remediation"],
      estimatedTimeSavings: "Lowers operational filtration cost from ₹1.20/L to ₹0.08/L",
    },
    prototypeStage: "Simulation",
    discussionCommentsCount: 7,
    isBookmarked: false,
    sponsoredByUs: false,
  },
  {
    id: "IND-PRJ-2026-05",
    title: "Edge-AI Smart Ambulance Congestion Clearance & Hospital Pre-Triage",
    category: "Healthcare & Telemedicine",
    district: "Bengaluru Urban",
    university: "PES University",
    problemDescription:
      "Critical cardiac emergencies lose the vital 'golden hour' in gridlocked arterial traffic corridors, averaging 42 minutes transit time with minimal clinical pre-assessment.",
    detailedStatement:
      "Vehicle-to-Infrastructure (V2I) low-latency 5G mesh node that communicates with municipal traffic light controllers to grant pre-emptive green wave signaling while continuous 12-lead ECG telemetry streams to hospital ER doctors.",
    expectedOutcome:
      "Reduce emergency transit times across Outer Ring Road by 38% and accelerate catheterization lab preparation before patient arrival.",
    requiredTechnologies: ["V2X Cellular Mesh", "Traffic Signal Controller API", "Continuous 12-Lead ECG Telemetry", "WebRTC Video"],
    currentStatus: "in_progress",
    expectedBudget: 2800000,
    fundedAmount: 2100000,
    timelineMonths: 9,
    startDate: "2026-07-01",
    targetCompletionDate: "2027-03-31",
    facultyLead: {
      id: "fac_pes_05",
      name: "Dr. Vani Krishnamurthy",
      designation: "Professor & Lead of Smart Mobility Center",
      department: "Dept of Computer Science & Engineering",
      university: "PES University",
      email: "vani.k@pes.edu",
    },
    studentTeamSize: 7,
    teamMembers: [
      { id: "st-8", name: "Varun Nair", email: "varun.n@pes.edu", role: "V2X Mesh Protocol Engineer", year: "Final Year" },
    ],
    governmentDepartment: "Bengaluru Traffic Police & Dept of Health",
    milestones: [
      { id: "m-13", title: "Traffic Controller Interface API Bridge", description: "Secure encrypted signaling hook", targetDate: "2026-08-30", status: "approved", completedDate: "2026-08-25", fundingReleasePercentage: 30 },
      { id: "m-14", title: "Outer Ring Road 6-Junction Pilot", description: "Live emergency simulation", targetDate: "2026-11-30", status: "in_progress", fundingReleasePercentage: 40 },
    ],
    mediaAssets: [
      { id: "ast-7", title: "V2I Green Wave Topology", type: "image", url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80", uploadedAt: "2026-07-15" },
    ],
    aiAnalysis: {
      feasibilityScore: 94,
      societalImpactScore: 97,
      patentabilityScore: 81,
      readinessLevel: "TRL 6 - Field Prototype",
      keyRisks: ["Cybersecurity hardening on traffic light actuation protocols"],
      suggestedIndustrialApplications: ["Fire service rapid convoy routing", "VIP and disaster relief evacuation"],
      estimatedTimeSavings: "Saves 16 minutes on average per critical emergency trip",
    },
    prototypeStage: "Field Hardware",
    discussionCommentsCount: 18,
    isBookmarked: true,
    sponsoredByUs: false,
  },
];

export const MOCK_FUNDING_OPPORTUNITIES: FundingOpportunity[] = [
  {
    id: "FND-2026-01",
    projectId: "IND-PRJ-2026-01",
    projectTitle: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    university: "Indian Institute of Science (IISc)",
    category: "Water Management & Sanitation",
    requiredBudget: 1250000,
    coSponsorAmountAvailable: 1200000,
    taxBenefitSection: "CSR Section 135",
    csrClassification: "Schedule VII - Clean Water",
    submissionDeadline: "2026-10-15",
    urgency: "high",
    proposalDocumentUrl: "/proposals/iisc_acoustic_leak_grant.pdf",
    status: "open",
  },
  {
    id: "FND-2026-02",
    projectId: "IND-PRJ-2026-04",
    projectTitle: "Solar-Powered Water Fluoride & Heavy Metal Electrochemical Filter",
    university: "Siddaganga Institute of Technology",
    category: "Water Management & Sanitation",
    requiredBudget: 1200000,
    coSponsorAmountAvailable: 450000,
    taxBenefitSection: "80G (50% Exemption)",
    csrClassification: "Schedule VII - Clean Water",
    submissionDeadline: "2026-10-30",
    urgency: "high",
    proposalDocumentUrl: "/proposals/sit_fluoride_filter.pdf",
    status: "open",
  },
  {
    id: "FND-2026-03",
    projectId: "IND-PRJ-2026-05",
    projectTitle: "Edge-AI Smart Ambulance Congestion Clearance & Hospital Pre-Triage",
    university: "PES University",
    category: "Healthcare & Telemedicine",
    requiredBudget: 700000,
    coSponsorAmountAvailable: 2100000,
    taxBenefitSection: "R&D 100% Deduction",
    csrClassification: "Schedule VII - Skill Tech",
    submissionDeadline: "2026-11-15",
    urgency: "medium",
    proposalDocumentUrl: "/proposals/pes_smart_ambulance.pdf",
    status: "under_review",
  },
];

export const MOCK_FUND_RELEASES: FundReleaseRecord[] = [
  {
    id: "REL-2026-101",
    transactionId: "TXN-CSR-99482103",
    projectId: "IND-PRJ-2026-01",
    projectTitle: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    university: "Indian Institute of Science (IISc)",
    amount: 612500,
    milestoneTitle: "Piezo Transducer Bench Flume Calibration",
    releaseDate: "2026-09-26",
    paymentMode: "Escrow Milestone Release",
    status: "settled",
    invoiceUrl: "/invoices/iisc_m1_inv.pdf",
    receiptUrl: "/receipts/iisc_m1_rec.pdf",
  },
  {
    id: "REL-2026-102",
    transactionId: "TXN-CSR-99481944",
    projectId: "IND-PRJ-2026-03",
    projectTitle: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    university: "JSS Science and Technology University",
    amount: 780000,
    milestoneTitle: "Conveyor Vision Bench Rig Validation",
    releaseDate: "2026-07-02",
    paymentMode: "NEFT / RTGS",
    status: "settled",
    invoiceUrl: "/invoices/jss_m1_inv.pdf",
    receiptUrl: "/receipts/jss_m1_rec.pdf",
  },
  {
    id: "REL-2026-103",
    transactionId: "TXN-CSR-99480112",
    projectId: "IND-PRJ-2026-03",
    projectTitle: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    university: "JSS Science and Technology University",
    amount: 682500,
    milestoneTitle: "Pneumatic Ejection Manifold Fabrication",
    releaseDate: "2026-09-05",
    paymentMode: "Escrow Milestone Release",
    status: "settled",
    invoiceUrl: "/invoices/jss_m2_inv.pdf",
    receiptUrl: "/receipts/jss_m2_rec.pdf",
  },
  {
    id: "REL-2026-104",
    transactionId: "TXN-CSR-99479901",
    projectId: "IND-PRJ-2026-02",
    projectTitle: "Second-Life Lithium Battery Swapping Microgrid",
    university: "NITK Surathkal",
    amount: 1140000,
    milestoneTitle: "Battery Health Profiling Algorithm",
    releaseDate: "2026-08-18",
    paymentMode: "Direct Treasury Transfer",
    status: "settled",
    invoiceUrl: "/invoices/nitk_m1_inv.pdf",
    receiptUrl: "/receipts/nitk_m1_rec.pdf",
  },
];

export const MOCK_MENTORSHIP_ENGAGEMENTS: MentorshipEngagement[] = [
  {
    id: "MENT-101",
    projectId: "IND-PRJ-2026-01",
    projectTitle: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    university: "IISc Bengaluru",
    studentTeamLead: "Rohan Varma (Ph.D.)",
    teamSize: 6,
    facultyLead: "Prof. Arisudan Sharma",
    status: "active",
    nextMeetingDate: "2026-09-22 15:30 IST",
    totalHoursLogged: 42,
    lastFeedbackDate: "2026-09-14",
    deliverablesReviewedCount: 5,
    rating: 5,
  },
  {
    id: "MENT-102",
    projectId: "IND-PRJ-2026-03",
    projectTitle: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    university: "JSS STU Mysuru",
    studentTeamLead: "Aishwarya Shenoy",
    teamSize: 5,
    facultyLead: "Dr. Chandrashekar B",
    status: "active",
    nextMeetingDate: "2026-09-25 11:00 IST",
    totalHoursLogged: 28,
    lastFeedbackDate: "2026-09-10",
    deliverablesReviewedCount: 4,
    rating: 4,
  },
  {
    id: "MENT-103",
    projectId: "IND-PRJ-2026-04",
    projectTitle: "Solar-Powered Water Fluoride Filter",
    university: "SIT Tumakuru",
    studentTeamLead: "Suresh Gowda",
    teamSize: 4,
    facultyLead: "Dr. Manjunatha Swamy",
    status: "requested",
    totalHoursLogged: 6,
    deliverablesReviewedCount: 1,
  },
];

export const MOCK_SCHEDULED_MEETINGS: ScheduledMeeting[] = [
  {
    id: "MTG-01",
    engagementId: "MENT-101",
    title: "Sprint Review: Ward 142 Acoustic Sensor Field Signals",
    date: "2026-09-22",
    time: "15:30 - 16:30 IST",
    meetingLink: "https://meet.google.com/xyz-qwe-asd",
    agenda: "Review spectral density graphs from 12 pilot sensors clamped in Indiranagar. Address vibration interference from heavy vehicles.",
    attendees: ["Dr. Rajeshwar Kulkarni (Industry Lead)", "Rohan Varma (Student Lead)", "Prof. Arisudan Sharma (Advisor)", "Ananya Iyer"],
    status: "scheduled",
  },
  {
    id: "MTG-02",
    engagementId: "MENT-102",
    title: "YOLOv10 Polymer Inference Speed Optimization",
    date: "2026-09-25",
    time: "11:00 - 12:00 IST",
    meetingLink: "https://meet.google.com/jss-opt-waste",
    agenda: "Evaluate TensorRT INT8 quantization to cut latency from 32ms to 9ms on Jetson Orin Nano for 4 items/sec throughput.",
    attendees: ["Kiran Deshmukh (Industry Vision Specialist)", "Aishwarya Shenoy", "Dr. Chandrashekar B"],
    status: "scheduled",
  },
];

export const MOCK_MENTORSHIP_TASKS: MentorshipTask[] = [
  {
    id: "TSK-01",
    engagementId: "MENT-101",
    title: "Implement Bandpass Filter on Hydrophone ADC buffer",
    description: "Eliminate low-frequency 50Hz electrical ground hum and 15Hz diesel bus rumble from transducer audio stream.",
    assignedTo: "Ananya Iyer",
    dueDate: "2026-09-28",
    priority: "critical",
    status: "in_review",
    deliverableUrl: "/deliverables/bandpass_dsp_v2.py",
  },
  {
    id: "TSK-02",
    engagementId: "MENT-101",
    title: "Draft Field Deployment Safety Protocol for BWSSB Work Crews",
    description: "Document torque limits when bolting acoustic clamp collars around ductile iron pipes to avoid coating damage.",
    assignedTo: "Rohan Varma",
    dueDate: "2026-10-05",
    priority: "medium",
    status: "assigned",
  },
  {
    id: "TSK-03",
    engagementId: "MENT-102",
    title: "Prepare 500-sample Multilayer Packaging Validation Dataset",
    description: "Collect real-world wrinkled chip bags and metallized film packaging under dual 850nm NIR strobe illumination.",
    assignedTo: "Aishwarya Shenoy",
    dueDate: "2026-09-30",
    priority: "medium",
    status: "assigned",
  },
];

export const MOCK_UNIVERSITIES: UniversityPartner[] = [
  {
    id: "univ_iisc",
    name: "Indian Institute of Science (IISc)",
    location: "Bengaluru, Karnataka",
    district: "Bengaluru Urban",
    nirfRanking: 1,
    departments: ["Civil Engineering", "Computational & Data Sciences", "Electrical Communication", "Materials Engineering"],
    researchLabs: ["Smart Water Network & Hydro-Informatics Lab", "Vibrational Acoustics Facility", "Cyber-Physical Systems Center"],
    innovationCenters: ["Society for Innovation and Development (SID)", "AI Robotics Technology Park (ARTPARK)"],
    activeProjectsCount: 14,
    studentsCount: 3800,
    keyFaculty: ["Prof. Arisudan Sharma", "Prof. Vikram Jayaram", "Dr. S. Gopalakrishnan"],
    connectionStatus: "connected",
    contactEmail: "dean.research@iisc.ac.in",
  },
  {
    id: "univ_nitk",
    name: "National Institute of Technology Karnataka (NITK)",
    location: "Surathkal, Mangaluru",
    district: "Dakshina Kannada",
    nirfRanking: 12,
    departments: ["Electrical & Electronics", "Mechanical", "Computer Science", "Chemical Engineering"],
    researchLabs: ["Clean Energy & Battery Storage Lab", "High Voltage Testing Facility", "Smart Grids Sandbox"],
    innovationCenters: ["STEP NITK Surathkal", "Centre for System Design"],
    activeProjectsCount: 9,
    studentsCount: 6200,
    keyFaculty: ["Dr. Sumitra Rao", "Prof. D. N. Gaonkar", "Dr. Shubhanga K N"],
    connectionStatus: "connected",
    contactEmail: "rnd@nitk.edu.in",
  },
  {
    id: "univ_jss",
    name: "JSS Science and Technology University",
    location: "Mysuru, Karnataka",
    district: "Mysuru",
    nirfRanking: 85,
    departments: ["Mechanical & Automation", "Environmental Engineering", "Information Science", "Biotechnology"],
    researchLabs: ["Mechatronics & Vision Testing Hub", "Waste Valorization Bio-lab"],
    innovationCenters: ["Science & Tech Entrepreneurs Park (STEP)"],
    activeProjectsCount: 6,
    studentsCount: 4500,
    keyFaculty: ["Dr. Chandrashekar B", "Dr. Sadashiva Murthy"],
    connectionStatus: "connected",
    contactEmail: "dean.research@jssstuniv.in",
  },
  {
    id: "univ_sit",
    name: "Siddaganga Institute of Technology",
    location: "Tumakuru, Karnataka",
    district: "Tumakuru",
    nirfRanking: 94,
    departments: ["Chemical Engineering", "Civil Engineering", "Electronics & Instrumentation"],
    researchLabs: ["Water Purification & Membrane Technology Lab", "Rural Energy Center"],
    innovationCenters: ["SIT Incubation Hub"],
    activeProjectsCount: 4,
    studentsCount: 4100,
    keyFaculty: ["Dr. Manjunatha Swamy", "Dr. Shivakumaraiah"],
    connectionStatus: "pending_invitation",
    contactEmail: "principal@sit.ac.in",
  },
];

export const MOCK_RESEARCH_COLLABORATIONS: ResearchCollaboration[] = [
  {
    id: "RES-2026-01",
    title: "Non-Intrusive Subterranean Pipe Integrity Diagnostics via Wavelet Decomposition",
    university: "Indian Institute of Science (IISc)",
    leadInvestigator: "Prof. Arisudan Sharma",
    domain: "Acoustic Telemetry & Hydrodynamic Infrastructure",
    grantValue: 4800000,
    status: "active",
    jointPatentsFiled: 2,
    papersCoAuthored: 4,
    startDate: "2025-10-01",
    endDate: "2027-09-30",
  },
  {
    id: "RES-2026-02",
    title: "Multispectral Plastic Polymer Classification for High-Speed Robotic Sortation",
    university: "JSS Science & Technology University",
    leadInvestigator: "Dr. Chandrashekar B",
    domain: "Computer Vision & Solid Waste Processing",
    grantValue: 2600000,
    status: "active",
    jointPatentsFiled: 1,
    papersCoAuthored: 2,
    startDate: "2026-01-15",
    endDate: "2026-12-31",
  },
  {
    id: "RES-2026-03",
    title: "Thermal Management Protocols for Repurposed EV Battery Packs in Tropical Climates",
    university: "NITK Surathkal",
    leadInvestigator: "Dr. Sumitra Rao",
    domain: "Electrochemistry & Clean Energy Storage",
    grantValue: 3500000,
    status: "patent_pending",
    jointPatentsFiled: 1,
    papersCoAuthored: 3,
    startDate: "2026-03-01",
    endDate: "2027-02-28",
  },
];

export const MOCK_PROTOTYPES: PrototypeSubmission[] = [
  {
    id: "PROTO-01",
    projectId: "IND-PRJ-2026-01",
    projectTitle: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    university: "IISc Bengaluru",
    prototypeVersion: "v2.4 - Ruggedized IP68 Collar",
    submissionDate: "2026-09-18",
    hardwareSpecifications: "STM32WB55 Dual-Core MCU, Murata Piezo Film Sensor, LiFePO4 3.2V 6000mAh Cell, Anodized Al6061 Enclosure",
    firmwareVersion: "fw-leak-v2.4.1",
    testingStatus: "field_testing",
    cadModelUrl: "/cad/sensor_collar_v2.4.step",
    liveDemoScheduled: "2026-09-24 14:00 IST",
    pilotLocation: "Indiranagar 100ft Road Pipeline Node 14B",
    reviewDecision: "pending",
  },
  {
    id: "PROTO-02",
    projectId: "IND-PRJ-2026-03",
    projectTitle: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    university: "JSS STU Mysuru",
    prototypeVersion: "v1.8 - 4-Chute Ejection Rig",
    submissionDate: "2026-09-08",
    hardwareSpecifications: "NVIDIA Jetson Orin Nano 8GB, Basler Dart USB3 NIR Camera, 8x Festo Pneumatic Solenoids (3ms fire cycle)",
    firmwareVersion: "yolo-jetson-v1.8",
    testingStatus: "certified",
    cadModelUrl: "/cad/pneumatic_manifold_v1.8.step",
    pilotLocation: "Mysuru Vidyaranyapuram DWCC #4",
    reviewDecision: "approved",
    reviewNotes: "Exceeded 94% sorting accuracy on transparent PET vs HDPE bottles. Ready for 30-day municipal test.",
  },
  {
    id: "PROTO-03",
    projectId: "IND-PRJ-2026-04",
    projectTitle: "Solar-Powered Water Fluoride & Heavy Metal Electrochemical Filter",
    university: "SIT Tumakuru",
    prototypeVersion: "v1.0 - Bench Reactor",
    submissionDate: "2026-09-12",
    hardwareSpecifications: "Titanium-Ruthenium Mixed Metal Oxide (MMO) Anodes, 300W Bifacial Solar PV Array, ESP32 IoT TDS Logger",
    firmwareVersion: "fw-defluoride-v1.0",
    testingStatus: "bench_testing",
    reviewDecision: "improvements_required",
    reviewNotes: "Need automated polarity reversal every 15 minutes to reduce electrode passivation by calcium hardness.",
  },
];

export const MOCK_IMPLEMENTATION_ITEMS: ImplementationTrackerItem[] = [
  {
    id: "IMP-01",
    projectId: "IND-PRJ-2026-01",
    projectTitle: "Acoustic Sensor Subterranean Pipe Leak Isolation System",
    currentStage: "Pilot",
    stageProgress: 65,
    overallProgress: 68,
    deploymentDistrict: "Bengaluru Urban",
    beneficiariesCount: 42000,
    lastMilestonePassed: "Bench Flume Pressure Calibration (Approved 2026-09-24)",
    nextMilestoneDue: "Ward 142 Live Corroboration Audit (Due 2026-11-15)",
    reports: [
      { name: "Flume Benchmark Test Verification", date: "2026-09-24", url: "/reports/flume_audit.pdf" },
      { name: "BWSSB Ward 142 Safety Clearance", date: "2026-08-10", url: "/reports/safety_clearance.pdf" },
    ],
  },
  {
    id: "IMP-02",
    projectId: "IND-PRJ-2026-03",
    projectTitle: "AI-Powered Optical Sorter for Decentralized Dry Waste Centers",
    currentStage: "Deployment",
    stageProgress: 88,
    overallProgress: 82,
    deploymentDistrict: "Mysuru",
    beneficiariesCount: 65000,
    lastMilestonePassed: "Pneumatic Ejection Manifold Quality Audit (Approved 2026-08-28)",
    nextMilestoneDue: "MCC Final Operational Handover (Due 2026-11-15)",
    reports: [
      { name: "Polymer Purity Test Sheet", date: "2026-09-02", url: "/reports/purity_audit.pdf" },
      { name: "Waste Picker Federation Safety Review", date: "2026-08-15", url: "/reports/picker_safety.pdf" },
    ],
  },
  {
    id: "IMP-03",
    projectId: "IND-PRJ-2026-02",
    projectTitle: "Second-Life Lithium Battery Swapping Microgrid",
    currentStage: "Testing",
    stageProgress: 40,
    overallProgress: 52,
    deploymentDistrict: "Dharwad",
    beneficiariesCount: 180,
    lastMilestonePassed: "Battery Impedance Spectroscopy Verification (Approved 2026-08-12)",
    nextMilestoneDue: "Canopy Automated Locker Testing (Due 2026-11-20)",
    reports: [
      { name: "Cell Health Diagnostic Whitepaper", date: "2026-08-12", url: "/reports/cell_health.pdf" },
    ],
  },
];

export const MOCK_CONVERSATIONS: IndustryConversation[] = [
  {
    id: "conv-1",
    participantCategory: "University",
    participantName: "Prof. Arisudan Sharma",
    participantOrg: "IISc Bengaluru",
    participantAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    lastMessage: "The hydrophone telemetry logged clean acoustic spikes at 4.2 bar in our test run today.",
    lastTimestamp: "10:42 AM",
    unreadCount: 2,
    projectContext: "Acoustic Sensor Pipeline Leakage System",
  },
  {
    id: "conv-2",
    participantCategory: "Government",
    participantName: "Er. Shivashankar M (Chief Engineer)",
    participantOrg: "Bangalore Water Supply & Sewerage Board",
    participantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    lastMessage: "Road cutting permission for Indiranagar 14th Main has been endorsed by BBMP.",
    lastTimestamp: "Yesterday",
    unreadCount: 0,
    projectContext: "Municipal Pilot Sanction",
  },
  {
    id: "conv-3",
    participantCategory: "Students",
    participantName: "Aishwarya Shenoy (Team Lead)",
    participantOrg: "JSS STU Mysuru",
    participantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    lastMessage: "We uploaded the video demonstration of the pneumatic valve firing at 4 items per second.",
    lastTimestamp: "Sep 15",
    unreadCount: 0,
    projectContext: "AI Optical Sorter",
  },
  {
    id: "conv-4",
    participantCategory: "NGOs",
    participantName: "Hasiru Dala Recyclers Federation",
    participantOrg: "Waste Picker Community Alliance",
    lastMessage: "Our informal sorting members tested the ergonomics of the feed hopper and provided suggestions.",
    lastTimestamp: "Sep 12",
    unreadCount: 1,
    projectContext: "Vidyaranyapuram Field Trial",
  },
];

export const MOCK_MESSAGES: Record<string, IndustryMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      sender: { id: "fac_iisc_01", name: "Prof. Arisudan Sharma", role: "university", organization: "IISc Bengaluru" },
      content: "Good morning Dr. Rajeshwar. We have completed the bench flume tests across 3 different ductile pipe collar diameters.",
      timestamp: "10:15 AM",
      isRead: true,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      sender: { id: "usr_tcs_01", name: "Dr. Rajeshwar Kulkarni", role: "system", organization: "Tata Social Innovation Foundation" },
      content: "Excellent Prof. Sharma! Were you able to isolate the 50Hz ambient motor hum from the pump station?",
      timestamp: "10:28 AM",
      isRead: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      sender: { id: "fac_iisc_01", name: "Prof. Arisudan Sharma", role: "university", organization: "IISc Bengaluru" },
      content: "The hydrophone telemetry logged clean acoustic spikes at 4.2 bar in our test run today. Ananya's bandpass filter effectively suppressed the 50Hz noise.",
      timestamp: "10:42 AM",
      attachments: [{ name: "flume_acoustic_spectrum.png", url: "#", size: "1.2 MB" }],
      isRead: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-4",
      conversationId: "conv-2",
      sender: { id: "govt_bwssb_01", name: "Er. Shivashankar M", role: "government", organization: "BWSSB" },
      content: "Road cutting permission for Indiranagar 14th Main has been endorsed by BBMP. You can schedule the night trenching team.",
      timestamp: "Yesterday 4:30 PM",
      isRead: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-5",
      conversationId: "conv-3",
      sender: { id: "stu_jss_01", name: "Aishwarya Shenoy", role: "student", organization: "JSS STU" },
      content: "We uploaded the video demonstration of the pneumatic valve firing at 4 items per second. The Jetson Orin Nano is running at 48°C stably.",
      timestamp: "Sep 15 2:10 PM",
      isRead: true,
    },
  ],
  "conv-4": [
    {
      id: "msg-6",
      conversationId: "conv-4",
      sender: { id: "ngo_hasiru_01", name: "Nalini Shekar", role: "ngo", organization: "Hasiru Dala" },
      content: "Our informal sorting members tested the ergonomics of the feed hopper and provided suggestions for conveyor rail height.",
      timestamp: "Sep 12 11:30 AM",
      isRead: false,
    },
  ],
};

export const MOCK_NOTIFICATIONS: IndustryNotification[] = [
  {
    id: "notif-01",
    title: "Milestone Deliverable Submitted for Review",
    description: "IISc Bengaluru submitted 'Ward 142 Field Testbed Pilot' documentation for Acoustic Sensor project.",
    timestamp: "10 minutes ago",
    category: "mentorship",
    read: false,
    actionUrl: "/industry/projects/IND-PRJ-2026-01",
    actionLabel: "Review Milestone",
  },
  {
    id: "notif-02",
    title: "CSR Fund Release Tranche Executed",
    description: "Tranche of ₹6,12,500 settled successfully via Escrow for IISc Bench Flume verification.",
    timestamp: "2 hours ago",
    category: "funding",
    read: false,
    actionUrl: "/industry/funding",
    actionLabel: "View Receipt",
  },
  {
    id: "notif-03",
    title: "Prototype Live Demo Scheduled",
    description: "JSS STU scheduled live demonstration of AI Optical Sorter at Mysuru DWCC on Sep 24.",
    timestamp: "Yesterday",
    category: "prototype",
    read: true,
    actionUrl: "/industry/prototypes",
    actionLabel: "View Schedule",
  },
  {
    id: "notif-04",
    title: "New University Research Proposal Received",
    description: "SIT Tumakuru requested CSR sponsorship for Solar-Powered Water Fluoride Filter.",
    timestamp: "2 days ago",
    category: "collaboration",
    read: true,
    actionUrl: "/industry/funding",
    actionLabel: "Inspect Proposal",
  },
];

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "act-1",
    title: "Fund Release Executed",
    actor: "Finance Operations",
    timestamp: "2 hours ago",
    type: "funding_released",
    details: "Disbursed ₹6,12,500 to IISc Bengaluru for Milestone #1 completion.",
  },
  {
    id: "act-2",
    title: "Prototype Certified for Pilot",
    actor: "Dr. Rajeshwar Kulkarni",
    timestamp: "Yesterday",
    type: "prototype_submitted",
    details: "Approved JSS STU Optical Sorter v1.8 for deployment at Vidyaranyapuram DWCC.",
  },
  {
    id: "act-3",
    title: "Mentorship Session Completed",
    actor: "Kiran Deshmukh (CSR Mentor)",
    timestamp: "2 days ago",
    type: "meeting_scheduled",
    details: "Conducted 90-minute technical architecture review on YOLOv10 Jetson inference.",
  },
  {
    id: "act-4",
    title: "Academic Partnership Finalized",
    actor: "R&D Alliance Division",
    timestamp: "3 days ago",
    type: "collaboration_accepted",
    details: "Signed 2-year joint research initiative with NITK Surathkal on EV Battery Recycling.",
  },
];

export const MOCK_ANALYTICS_DATA = {
  csrSpendingByMonth: [
    { month: "Apr", amount: 1400000, target: 1200000 },
    { month: "May", amount: 2100000, target: 2000000 },
    { month: "Jun", amount: 2800000, target: 2500000 },
    { month: "Jul", amount: 3500000, target: 3000000 },
    { month: "Aug", amount: 4200000, target: 4000000 },
    { month: "Sep", amount: 5250000, target: 5000000 },
  ],
  projectsByStatus: [
    { name: "Active In-Progress", value: 8, color: "#3b82f6" },
    { name: "Prototype Ready", value: 5, color: "#8b5cf6" },
    { name: "Pilot Testing", value: 3, color: "#f59e0b" },
    { name: "Completed & Deployed", value: 7, color: "#10b981" },
  ],
  innovationCategories: [
    { category: "Water Management", projects: 6, funding: 8200000 },
    { category: "Clean Energy / EV", projects: 5, funding: 7500000 },
    { category: "Waste Governance", projects: 4, funding: 4800000 },
    { category: "Healthcare", projects: 4, funding: 5100000 },
    { category: "Public Safety", projects: 4, funding: 2900000 },
  ],
  districtCoverage: [
    { district: "Bengaluru Urban", projects: 9, impactScore: 95 },
    { district: "Bengaluru Rural", projects: 3, impactScore: 78 },
    { district: "Mysuru", projects: 5, impactScore: 88 },
    { district: "Dharwad", projects: 3, impactScore: 82 },
    { district: "Dakshina Kannada", projects: 4, impactScore: 86 },
    { district: "Tumakuru", projects: 2, impactScore: 74 },
  ],
  mentorshipHoursByWeek: [
    { week: "W1 Aug", hours: 14 },
    { week: "W2 Aug", hours: 18 },
    { week: "W3 Aug", hours: 24 },
    { week: "W4 Aug", hours: 20 },
    { week: "W1 Sep", hours: 26 },
    { week: "W2 Sep", hours: 32 },
  ],
};

// API Client wrapper using axiosClient
export const industryApi = {
  // Login
  async loginIndustry(data: IndustryLoginFormData): Promise<IndustryUser> {
    try {
      const res = await axiosClient.post("/industry/auth/login", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      const roleLabels: Record<string, string> = {
        csr_org: "CSR Organization",
        corporate: "Corporate Organization",
        msme: "MSME Partner",
        startup: "Startup Incubatee",
        innovation_partner: "Innovation Partner",
      };
      return {
        id: "usr_tcs_01",
        name: "Dr. Rajeshwar Kulkarni",
        email: data.email,
        role: data.role,
        roleLabel: roleLabels[data.role] || "Corporate Organization",
        organizationName: "Tata Social Innovation Foundation",
        designation: "Head of Social R&D Alliances",
        phone: "+91 98200 45891",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        verificationStatus: "verified",
      };
    }
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<IndustryDashboardStats> {
    try {
      const res = await axiosClient.get("/industry/stats");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return {
        projectsAvailable: 42,
        projectsSponsored: 12,
        projectsCompleted: 7,
        universitiesConnected: 18,
        studentsMentored: 64,
        fundingReleased: 19250000,
        csrImpactScore: 94,
        innovationScore: 89,
        pendingRequests: 4,
        unreadNotifications: 3,
      };
    }
  },

  // Recent Activity
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const res = await axiosClient.get("/industry/activities");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_RECENT_ACTIVITIES;
    }
  },

  // Organization Profile
  async getOrganizationProfile(): Promise<OrganizationProfile> {
    try {
      const res = await axiosClient.get("/industry/organization/profile");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_ORGANIZATION_PROFILE;
    }
  },

  async updateOrganizationProfile(data: OrganizationProfileFormData): Promise<OrganizationProfile> {
    try {
      const res = await axiosClient.put("/industry/organization/profile", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      return {
        ...MOCK_ORGANIZATION_PROFILE,
        name: data.name,
        legalEntityName: data.legalEntityName,
        sector: data.sector,
        cinOrRegNumber: data.cinOrRegNumber,
        website: data.website,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.addressStreet,
          city: data.addressCity,
          state: data.addressState,
          pincode: data.addressPincode,
          country: "India",
        },
        contactPerson: {
          name: data.contactPersonName,
          designation: data.contactPersonDesignation,
          email: data.contactPersonEmail,
          phone: data.contactPersonPhone,
        },
        availableBudget: data.availableBudget,
      };
    }
  },

  // Projects
  async getProjects(params?: {
    category?: string;
    district?: string;
    status?: string;
    search?: string;
    minBudget?: number;
    maxBudget?: number;
  }): Promise<IndustryProject[]> {
    try {
      const res = await axiosClient.get("/industry/projects", { params });
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 350));
      let filtered = [...MOCK_PROJECTS];
      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params?.district && params.district !== "all") {
        filtered = filtered.filter((p) => p.district === params.district);
      }
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((p) => p.currentStatus === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.problemDescription.toLowerCase().includes(q) ||
            p.university.toLowerCase().includes(q) ||
            p.requiredTechnologies.some((t) => t.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  async getProjectById(id: string): Promise<IndustryProject> {
    try {
      const res = await axiosClient.get(`/industry/projects/${id}`);
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
      const found = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
      return found;
    }
  },

  async sponsorProject(data: SponsorProjectFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/industry/projects/${data.projectId}/sponsor`, data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      return {
        success: true,
        message: `Successfully pledged ₹${data.amount.toLocaleString()} for project. Formal CSR sponsorship MoU generated.`,
      };
    }
  },

  // Funding Opportunities
  async getFundingOpportunities(): Promise<FundingOpportunity[]> {
    try {
      const res = await axiosClient.get("/industry/funding/opportunities");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_FUNDING_OPPORTUNITIES;
    }
  },

  async getFundReleaseHistory(): Promise<FundReleaseRecord[]> {
    try {
      const res = await axiosClient.get("/industry/funding/releases");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_FUND_RELEASES;
    }
  },

  async releaseFunds(data: ReleaseFundsFormData): Promise<{ success: boolean; transactionId: string; message: string }> {
    try {
      const res = await axiosClient.post("/industry/funding/release", data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 700));
      const txnId = `TXN-CSR-${Math.floor(10000000 + Math.random() * 90000000)}`;
      return {
        success: true,
        transactionId: txnId,
        message: `Tranche payment of ₹${data.amount.toLocaleString()} for '${data.milestoneTitle}' initiated via ${data.paymentMode}.`,
      };
    }
  },

  // Mentorship
  async getMentorshipEngagements(): Promise<MentorshipEngagement[]> {
    try {
      const res = await axiosClient.get("/industry/mentorship/engagements");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_MENTORSHIP_ENGAGEMENTS;
    }
  },

  async getScheduledMeetings(): Promise<ScheduledMeeting[]> {
    try {
      const res = await axiosClient.get("/industry/mentorship/meetings");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
      return MOCK_SCHEDULED_MEETINGS;
    }
  },

  async scheduleMeeting(data: ScheduleMeetingFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/industry/mentorship/meetings", data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, message: `Meeting '${data.title}' scheduled for ${data.date} at ${data.time}. Calendar invites sent.` };
    }
  },

  async getMentorshipTasks(): Promise<MentorshipTask[]> {
    try {
      const res = await axiosClient.get("/industry/mentorship/tasks");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
      return MOCK_MENTORSHIP_TASKS;
    }
  },

  async assignTask(data: AssignTaskFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/industry/mentorship/tasks", data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 450));
      return { success: true, message: `Task '${data.title}' assigned to ${data.assignedTo}.` };
    }
  },

  async rateTeam(data: RateTeamFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/industry/mentorship/${data.engagementId}/rate`, data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      return { success: true, message: `Evaluation logged. Team rating of ${data.rating} stars recorded.` };
    }
  },

  // University Collaborations
  async getUniversities(): Promise<UniversityPartner[]> {
    try {
      const res = await axiosClient.get("/industry/collaborations/universities");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_UNIVERSITIES;
    }
  },

  async connectUniversity(universityId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/industry/collaborations/universities/${universityId}/connect`);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      return { success: true, message: "Partnership invitation dispatched to university R&D Dean office." };
    }
  },

  // Research Collaborations
  async getResearchCollaborations(): Promise<ResearchCollaboration[]> {
    try {
      const res = await axiosClient.get("/industry/collaborations/research");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_RESEARCH_COLLABORATIONS;
    }
  },

  // Prototypes
  async getPrototypes(): Promise<PrototypeSubmission[]> {
    try {
      const res = await axiosClient.get("/industry/prototypes");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_PROTOTYPES;
    }
  },

  async reviewPrototype(data: PrototypeReviewFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/industry/prototypes/${data.prototypeId}/review`, data);
      return res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        message: `Prototype review logged with decision: ${data.decision.toUpperCase()}. Feedback relayed to engineering team.`,
      };
    }
  },

  // Implementation Tracker
  async getImplementationTracker(): Promise<ImplementationTrackerItem[]> {
    try {
      const res = await axiosClient.get("/industry/tracking");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_IMPLEMENTATION_ITEMS;
    }
  },

  // Messages & Conversations
  async getConversations(): Promise<IndustryConversation[]> {
    try {
      const res = await axiosClient.get("/industry/messages/conversations");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
      return MOCK_CONVERSATIONS;
    }
  },

  async getMessages(conversationId: string): Promise<IndustryMessage[]> {
    try {
      const res = await axiosClient.get(`/industry/messages/conversations/${conversationId}`);
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_MESSAGES[conversationId] || [];
    }
  },

  async sendMessage(conversationId: string, content: string): Promise<IndustryMessage> {
    try {
      const res = await axiosClient.post(`/industry/messages/conversations/${conversationId}`, { content });
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return {
        id: `msg-${Date.now()}`,
        conversationId,
        sender: {
          id: "usr_tcs_01",
          name: "Dr. Rajeshwar Kulkarni",
          role: "system",
          organization: "Tata Social Innovation Foundation",
        },
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: true,
      };
    }
  },

  // Notifications
  async getNotifications(): Promise<IndustryNotification[]> {
    try {
      const res = await axiosClient.get("/industry/notifications");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_NOTIFICATIONS;
    }
  },

  // Analytics
  async getAnalyticsData() {
    try {
      const res = await axiosClient.get("/industry/analytics");
      return res.data?.data || res.data;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_ANALYTICS_DATA;
    }
  },
};
