import { axiosClient } from "@/features/shared/services/axios-client";
import {
  ResearchUser,
  ResearchInstitute,
  ResearchDashboardStats,
  ResearchProject,
  InnovationIdea,
  Publication,
  DatasetItem,
  GovtRfpRequest,
  AcademicPartnership,
  ResearchReport,
  ResearchNotification,
} from "../types";
import {
  ResearchLoginFormData,
  UploadPublicationFormData,
  SubmitInnovationIdeaFormData,
  SubmitFindingsFormData,
  ResearchProfileFormData,
} from "../validation/research-schemas";

export const MOCK_RESEARCH_USER: ResearchUser = {
  id: "res-usr-01",
  name: "Dr. K. S. Ramanathan",
  email: "ramanathan@iisc.ac.in",
  role: "research",
  roleLabel: "Principal Research Investigator",
  instituteId: "inst-001",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  phone: "+91 80 2293 2419",
};

export const MOCK_RESEARCH_INSTITUTE: ResearchInstitute = {
  id: "inst-001",
  name: "Centre for Sustainable Infrastructure & Smart Cities (CSISC)",
  accreditation: "Institutes of National Importance / NIRF #1",
  directorName: "Prof. Govindan Rangarajan",
  establishedYear: 1909,
  about: "The Centre for Sustainable Infrastructure & Smart Cities operates at the intersection of applied urban computing, hydro-climatic modeling, resilient transportation, and localized AI policy.",
  address: "IISc Campus, CV Raman Rd, Malleshwaram, Bengaluru",
  district: "Bengaluru Urban",
  state: "Karnataka",
  website: "https://iisc.ac.in/csisc",
  contactEmail: "csisc.office@iisc.ac.in",
  contactPhone: "+91 80 2293 2000",
  focusAreas: [
    "Subterranean Water Leak Wavelet AI",
    "Microgrid Decentralized Wheeling",
    "Urban Pothole 3D Photogrammetry",
    "Sludge Pyrolysis & Biochar",
  ],
  logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop&q=80",
  achievements: [
    "Published 342 High-Impact IEEE/ASCE Research Papers",
    "Granted 28 Indian & US Patents for Municipal Telemetry",
    "Mobilized ₹84.5 Cr in Industry Sponsored R&D",
  ],
  certifications: [
    "NABL Accredited Sensor Calibration Lab",
    "DSIR Recognized Scientific & Industrial Research Organization (SIRO)",
    "ISO/IEC 17025:2017 Testing & Calibration Lab",
  ],
  impactMetrics: {
    totalPatents: 28,
    publicationsIndexed: 342,
    grantsMobilizedCr: 84.5,
    activeScholars: 96,
    startupsIncubated: 14,
  },
};

export const MOCK_RESEARCH_STATS: ResearchDashboardStats = {
  activeResearch: 14,
  completedResearch: 42,
  publications: 342,
  patents: 28,
  innovationIdeas: 19,
  governmentRequests: 8,
  universityPartners: 24,
  totalFundingCr: 84.5,
  notifications: 6,
};

export const MOCK_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "RES-PROJ-01",
    title: "Acoustic Wavelet Localization of Sub-Surface Water Pipeline Leaks",
    researchDomain: "Urban Hydrology & Wavelet AI",
    problemStatement: "Municipal water distribution networks lose up to 42% of treated potable water due to undetected sub-meter pinhole cracks beneath asphalt roadways.",
    objectives: [
      "Develop ultra-low power piezoelectric acoustic clamp nodes",
      "Train edge-embedded wavelet denoising models",
      "Deploy 120 sensor testbed across Bengaluru BBMP ward 142",
    ],
    collaborators: [
      { id: "c1", name: "Bengaluru Water Supply (BWSSB)", type: "Government" },
      { id: "c2", name: "Bosch Smart Mobility R&D", type: "Industry" },
    ],
    funding: "₹2.4 Cr",
    fundingAgency: "Ministry of Housing and Urban Affairs (MoHUA)",
    timeline: "2024 - 2027",
    progress: 68,
    status: "Active",
    documents: [
      { id: "d1", name: "Phase_1_Sensor_Benchmarking_Report.pdf", type: "Technical Report", size: "5.4 MB", uploadedAt: "2026-06-10", url: "#" },
      { id: "d2", name: "Acoustic_Field_Data_Sample.csv", type: "Raw Dataset", size: "12.8 MB", uploadedAt: "2026-08-15", url: "#" },
    ],
    leadScientist: "Dr. K. S. Ramanathan",
    publishedFindingsCount: 3,
  },
  {
    id: "RES-PROJ-02",
    title: "Monocular Edge-AI Volumetric Pothole Indexing on Transit Fleets",
    researchDomain: "Transportation & Edge AI",
    problemStatement: "Manual road condition surveys cost municipal corporations millions and lag by 6-12 months, resulting in unaddressed monsoon cratering.",
    objectives: [
      "Convert public transit bus dashcams into depth-sensing volumetric scanners",
      "Generate automated GIS heatmaps of road surface degradation",
    ],
    collaborators: [
      { id: "c3", name: "BMTC Public Transit", type: "Government" },
      { id: "c4", name: "IIT Madras Transportation Lab", type: "University" },
    ],
    funding: "₹1.8 Cr",
    fundingAgency: "Department of Science and Technology (DST)",
    timeline: "2025 - 2026",
    progress: 82,
    status: "Active",
    documents: [
      { id: "d3", name: "Edge_Inference_Latency_Report.pdf", type: "Report", size: "3.2 MB", uploadedAt: "2026-07-22", url: "#" },
    ],
    leadScientist: "Prof. Priya Balasubramanian",
    publishedFindingsCount: 5,
  },
  {
    id: "RES-PROJ-03",
    title: "Low-Temperature Pyrolysis of Mandi Sludge for Soil Conditioning",
    researchDomain: "Waste-to-Resource Bioengineering",
    problemStatement: "Over 80 metric tonnes of daily wet organic waste from metropolitan vegetable wholesale mandis decompose into methane at municipal landfills.",
    objectives: [
      "Pilot continuous-feed auger pyrolyzer with zero external fossil fuel input",
      "Characterize biochar for heavy metal remediation in agricultural soils",
    ],
    collaborators: [
      { id: "c5", name: "APMC Agricultural Market Board", type: "Government" },
    ],
    funding: "₹3.1 Cr",
    fundingAgency: "CSIR & Tata Trusts Joint Initiative",
    timeline: "2024 - 2026",
    progress: 95,
    status: "Active",
    documents: [
      { id: "d4", name: "Soil_Biochar_Nutrient_Efficacy_Trial.pdf", type: "Trial Data", size: "7.1 MB", uploadedAt: "2026-09-02", url: "#" },
    ],
    leadScientist: "Dr. Alok Verma",
    publishedFindingsCount: 4,
  },
];

export const MOCK_INNOVATION_IDEAS: InnovationIdea[] = [
  {
    id: "IDEA-01",
    title: "Bio-Enzymatic Rapid Dissolution of Drain Fatbergs",
    category: "Sanitation Biotechnology",
    trlLevel: 5,
    trlStageName: "TRL 5: Technology Validated in Relevant Environment",
    status: "Field Pilot",
    fundingRequired: "₹45 Lakhs",
    fundingCommitted: "₹30 Lakhs",
    mentor: "Dr. M. S. Swaminathan Chair",
    mentorAffiliation: "ICAR Institute of Biotechnology",
    votes: 184,
    hasVoted: false,
    description: "Formulation of non-toxic lipolytic bacterial enzymes that liquefy solidified restaurant oil and fat blockages in sewer trunks within 4 hours without manual scavenging.",
    createdDate: "2026-08-10",
    comments: [
      { id: "c1", authorName: "Dr. Alok Verma", authorRole: "Senior Scientist", content: "Tested pH resilience in lab conditions, stable between 5.5 to 8.5.", createdAt: "3 days ago" },
      { id: "c2", authorName: "K. Deshmukh", authorRole: "Bosch Environmental", content: "Can offer pilot testbed on industrial drainage lines in Pune.", createdAt: "Yesterday" },
    ],
  },
  {
    id: "IDEA-02",
    title: "Graphene-Coated Ceramic Membranes for Zero Liquid Discharge",
    category: "Advanced Materials",
    trlLevel: 7,
    trlStageName: "TRL 7: Integrated Pilot System Demonstrated",
    status: "Field Pilot",
    fundingRequired: "₹80 Lakhs",
    fundingCommitted: "₹80 Lakhs",
    mentor: "Prof. C. N. R. Rao Lab",
    mentorAffiliation: "JNCASR Bangalore",
    votes: 246,
    hasVoted: true,
    description: "High-flux anti-fouling nano-porous graphene membranes capable of recovering 94% clean permeate from textile dyeing effluent at 40% lower pressure.",
    createdDate: "2026-07-15",
    comments: [
      { id: "c3", authorName: "Dr. Ramanathan", authorRole: "PI", content: "Passed 1000-hour continuous run in Tirupur CETP pilot.", createdAt: "1 week ago" },
    ],
  },
  {
    id: "IDEA-03",
    title: "Crowdsourced Pothole Acoustic Signature via Bicycle Gyroscopes",
    category: "Civic Computing",
    trlLevel: 3,
    trlStageName: "TRL 3: Analytical & Experimental Critical Function",
    status: "Ideation",
    fundingRequired: "₹18 Lakhs",
    fundingCommitted: "₹5 Lakhs",
    mentor: "Prof. K. Venkatesh",
    mentorAffiliation: "IIIT Bangalore",
    votes: 92,
    hasVoted: false,
    description: "Ultra-low-cost IoT sensor for micro-delivery riders and cyclists that tags road surface roughness without requiring expensive cameras or battery drain.",
    createdDate: "2026-09-05",
    comments: [],
  },
];

export const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: "PUB-01",
    title: "Acoustic Wavelet Packet Transform for Sub-Meter Pipeline Leak Localization",
    type: "Research Paper",
    authors: ["Dr. K. S. Ramanathan", "Alex Rivera", "Prof. K. Venkatesh"],
    journalOrVenue: "IEEE Transactions on Smart Cities & Infrastructure",
    year: 2026,
    doi: "10.1109/TSCI.2026.88412",
    status: "Published",
    abstract: "Presents a sub-meter localization methodology for hidden potable water subterranean leaks utilizing high-frequency piezoelectric telemetry and discrete wavelet denoising.",
    citationsCount: 48,
    downloadCount: 1420,
    pdfUrl: "#",
    tags: ["Acoustics", "Wavelets", "Smart Water", "Edge AI"],
  },
  {
    id: "PUB-02",
    title: "Volumetric Road Distress Surveying Using Monocular Depth Neural Nets",
    type: "Conference Paper",
    authors: ["Prof. Priya Balasubramanian", "David Kim"],
    journalOrVenue: "ACM International Conference on Cyber-Physical Systems (ICCPS 2026)",
    year: 2026,
    doi: "10.1145/3583133.3590710",
    status: "Published",
    abstract: "A low-power edge computer vision pipeline for automated road distress surveying, benchmarked across 240km of metropolitan arterial roadways during monsoon seasons.",
    citationsCount: 26,
    downloadCount: 890,
    pdfUrl: "#",
    tags: ["Computer Vision", "Potholes", "Edge AI", "Transit"],
  },
  {
    id: "PAT-01",
    title: "Non-Invasive Piezoelectric Telemetry Clamp for Sub-Surface Fluid Pipes",
    type: "Patent",
    authors: ["Dr. K. S. Ramanathan", "Govind Swarup"],
    journalOrVenue: "Indian Patent Office (IPO)",
    year: 2025,
    patentNumber: "IN202541098234A",
    status: "Granted",
    abstract: "An energy-harvesting piezoelectric sensor clip configured for external mounting on ductile iron and PVC pipe conduits without shutting off water flow.",
    citationsCount: 12,
    downloadCount: 410,
    pdfUrl: "#",
    tags: ["Patent", "Hardware", "Piezoelectric", "Telemetry"],
  },
  {
    id: "PUB-03",
    title: "Decentralized Carbon Sequestration via Market Waste Pyrolysis",
    type: "Technical Report",
    authors: ["Dr. Alok Verma", "Maya Chen"],
    journalOrVenue: "CSIR-NEERI Special Bulletin on Bioenergy (Vol 14)",
    year: 2025,
    status: "Published",
    abstract: "Evaluates a decentralized thermal decomposition unit handling 5 tons daily of market organics, achieving 82% carbon retention with zero methane release.",
    citationsCount: 31,
    downloadCount: 650,
    pdfUrl: "#",
    tags: ["Biochar", "Carbon Sequestration", "Circular Economy"],
  },
];

export const MOCK_DATASETS: DatasetItem[] = [
  {
    id: "DS-01",
    name: "Metropolitan Urban Water Network Pinhole Acoustic Telemetry",
    category: "Hydrology & IoT",
    description: "High-frequency 48 kHz acoustic hydrophone readings tagged with verified pipeline coordinates, pressure drop meters, and soil moisture logs.",
    recordCount: "2,480,000 Pings",
    source: "IISc CSISC & BWSSB Testbed",
    lastUpdated: "2026-09-01",
    format: "CSV",
    fileSize: "148 MB",
    downloadUrl: "#",
    schemaColumns: [
      { key: "timestamp", label: "Timestamp (UTC)", type: "datetime" },
      { key: "sensor_id", label: "Sensor ID", type: "string" },
      { key: "freq_hz", label: "Peak Frequency (Hz)", type: "float" },
      { key: "amplitude_db", label: "Amplitude (dB)", type: "float" },
      { key: "leak_probability", label: "Wavelet Leak Score", type: "float" },
    ],
    previewRows: [
      { timestamp: "2026-09-01 08:00:12", sensor_id: "WTR-NODE-42", freq_hz: 1420.5, amplitude_db: 84.2, leak_probability: 0.94 },
      { timestamp: "2026-09-01 08:00:13", sensor_id: "WTR-NODE-42", freq_hz: 1418.1, amplitude_db: 83.8, leak_probability: 0.93 },
      { timestamp: "2026-09-01 08:00:12", sensor_id: "WTR-NODE-43", freq_hz: 312.0, amplitude_db: 42.1, leak_probability: 0.04 },
    ],
  },
  {
    id: "DS-02",
    name: "Geo-Tagged Road Cratering & Pothole Volumetric Benchmark",
    category: "Transportation AI",
    description: "Stereo disparity point clouds and bounding boxes for 14,000 arterial road distress occurrences captured across 3 monsoon seasons.",
    recordCount: "14,200 Annotations",
    source: "BMTC Dashcam Vision Fleet",
    lastUpdated: "2026-08-20",
    format: "JSON",
    fileSize: "84 MB",
    downloadUrl: "#",
    schemaColumns: [
      { key: "image_id", label: "Image Hash", type: "string" },
      { key: "lat", label: "Latitude", type: "float" },
      { key: "lng", label: "Longitude", type: "float" },
      { key: "volume_liters", label: "Est. Void Volume (L)", type: "float" },
      { key: "severity_class", label: "Class (1-5)", type: "integer" },
    ],
    previewRows: [
      { image_id: "IMG_99418", lat: 12.9716, lng: 77.5946, volume_liters: 34.2, severity_class: 4 },
      { image_id: "IMG_99419", lat: 12.9721, lng: 77.5951, volume_liters: 12.8, severity_class: 2 },
    ],
  },
  {
    id: "DS-03",
    name: "Decentralized Biomass Pyrolysis Thermal Kinetics Log",
    category: "Clean Energy",
    description: "Time-series thermocouple and gas chromatography logs for fruit and vegetable sludge carbonization under varying residence times.",
    recordCount: "540,000 Rows",
    source: "APMC Pilot Plant Telemetry",
    lastUpdated: "2026-08-28",
    format: "Parquet",
    fileSize: "62 MB",
    downloadUrl: "#",
    schemaColumns: [
      { key: "timestamp", label: "Timestamp", type: "datetime" },
      { key: "temp_c", label: "Retort Temperature (°C)", type: "float" },
      { key: "co2_ppm", label: "Flue CO2 (ppm)", type: "float" },
      { key: "ch4_ppm", label: "Methane Escape (ppm)", type: "float" },
    ],
    previewRows: [
      { timestamp: "2026-08-28 14:00:00", temp_c: 480.2, co2_ppm: 340.1, ch4_ppm: 0.02 },
      { timestamp: "2026-08-28 14:05:00", temp_c: 482.5, co2_ppm: 338.9, ch4_ppm: 0.01 },
    ],
  },
];

export const MOCK_GOVT_REQUESTS: GovtRfpRequest[] = [
  {
    id: "RFP-2026-088",
    title: "AI-Driven Predictive Maintenance for Metropolitan Stormwater Siphons",
    department: "Greater Mumbai Municipal Corporation (BMC)",
    jurisdiction: "Mumbai Metropolitan Region",
    budgetEst: "₹1.4 Cr",
    deadline: "2026-10-30",
    scope: "Designing predictive flood-gate telemetry and ultrasonic silt accumulation sensors for 18 subterranean ocean outfall gates.",
    status: "Open for Proposals",
    rfpPdfUrl: "#",
    priority: "Critical",
  },
  {
    id: "RFP-2026-092",
    title: "Micro-Climatic Thermal Heat Island Mapping for Affordable Housing",
    department: "State Urban Development Agency (SUDA)",
    jurisdiction: "State-wide",
    budgetEst: "₹95 Lakhs",
    deadline: "2026-11-15",
    scope: "Satellite radiometry and ground drone thermal imaging to recommend passive cooling building codes.",
    status: "Open for Proposals",
    rfpPdfUrl: "#",
    priority: "High",
  },
];

export const MOCK_ACADEMIC_PARTNERSHIPS: AcademicPartnership[] = [
  {
    id: "PART-01",
    universityName: "COEP Technological University, Pune",
    leadDepartment: "Instrumentation & Control",
    mouSignDate: "2024-03-12",
    activeJointGrants: 4,
    collaboratingFaculty: ["Dr. S. D. Agashe", "Prof. R. M. Jalnekar"],
    focusArea: "Edge AI Sensor Gateways for Civic Networks",
    status: "Active MoU",
  },
  {
    id: "PART-02",
    universityName: "IIT Bombay - CTARA",
    leadDepartment: "Centre for Technology Alternatives",
    mouSignDate: "2023-11-04",
    activeJointGrants: 6,
    collaboratingFaculty: ["Prof. Bakul Rao", "Dr. Anand Rao"],
    focusArea: "Rural Aquifer Depletion AI Modeling",
    status: "Active MoU",
  },
  {
    id: "PART-03",
    universityName: "National Institute of Hydrology (NIH), Roorkee",
    leadDepartment: "Surface Water Hydrology",
    mouSignDate: "2025-01-18",
    activeJointGrants: 2,
    collaboratingFaculty: ["Dr. V. C. Goyal"],
    focusArea: "Rainfall-Runoff Hydrograph Simulation",
    status: "Active MoU",
  },
];

export const MOCK_RESEARCH_REPORTS: ResearchReport[] = [
  {
    id: "RREP-01",
    title: "Annual Scientific Output & Patent Portfolio Review 2025-26",
    type: "Annual Research Output",
    period: "FY 2025-26",
    generatedDate: "2026-04-10",
    size: "14.2 MB",
    format: "PDF",
    fileUrl: "#",
  },
  {
    id: "RREP-02",
    title: "MoHUA Grant Utilization & Financial Audit Statement",
    type: "Grant Utilization",
    period: "Q1-Q2 2026",
    generatedDate: "2026-08-30",
    size: "3.8 MB",
    format: "Excel",
    fileUrl: "#",
  },
  {
    id: "RREP-03",
    title: "Civic Consortium Real-Time Telemetry Data Export",
    type: "Consortium Telemetry",
    period: "Jan - Aug 2026",
    generatedDate: "2026-09-01",
    size: "8.5 MB",
    format: "Excel",
    fileUrl: "#",
  },
];

export const MOCK_RESEARCH_NOTIFICATIONS: ResearchNotification[] = [
  {
    id: "RNOTIF-01",
    title: "Patent Application Granted",
    description: "Patent IN202541098234A for Piezoelectric Telemetry Clamp has been formally granted by IPO.",
    category: "patent",
    timestamp: "10 mins ago",
    read: false,
    actionUrl: "/research/publications",
    actionLabel: "View Patent",
  },
  {
    id: "RNOTIF-02",
    title: "New Government RFP Available",
    description: "BMC Mumbai published RFP for Stormwater Predictive Maintenance (Budget: ₹1.4 Cr).",
    category: "grant",
    timestamp: "3 hours ago",
    read: false,
    actionUrl: "/research/government-requests",
    actionLabel: "Review RFP",
  },
  {
    id: "RNOTIF-03",
    title: "Reviewer Feedback Received",
    description: "IEEE Transactions on Smart Cities reviewers submitted minor revisions for Monocular Pothole Paper.",
    category: "publication",
    timestamp: "Yesterday",
    read: true,
    actionUrl: "/research/publications",
    actionLabel: "Read Feedback",
  },
  {
    id: "RNOTIF-04",
    title: "Innovation Lab Idea Milestone",
    description: "Bio-Enzymatic Fatberg Dissolution reached 180+ community votes and entered Field Pilot phase.",
    category: "collaboration",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/research/innovation",
    actionLabel: "Open Idea",
  },
];

class ResearchApiService {
  async loginResearch(credentials: ResearchLoginFormData): Promise<ResearchUser> {
    try {
      const res = await axiosClient.post("/auth/login/research", credentials);
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_USER;
    }
  }

  async loginGoogleResearch(): Promise<ResearchUser> {
    try {
      const res = await axiosClient.post("/auth/google", { role: "research" });
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_USER;
    }
  }

  async getDashboardStats(): Promise<ResearchDashboardStats> {
    try {
      const res = await axiosClient.get("/research/dashboard/stats");
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_STATS;
    }
  }

  async getInstituteProfile(): Promise<ResearchInstitute> {
    try {
      const res = await axiosClient.get("/research/institute/profile");
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_INSTITUTE;
    }
  }

  async updateInstituteProfile(data: ResearchProfileFormData): Promise<ResearchInstitute> {
    try {
      const res = await axiosClient.put("/research/institute/profile", data);
      return res.data?.data || res.data;
    } catch {
      return { ...MOCK_RESEARCH_INSTITUTE, ...data };
    }
  }

  async getResearchProjects(): Promise<ResearchProject[]> {
    try {
      const res = await axiosClient.get("/research/projects");
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_PROJECTS;
    }
  }

  async joinResearchProject(projectId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/research/projects/${projectId}/join`);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: "Collaboration application transmitted to Principal Investigator." };
    }
  }

  async submitFindings(data: SubmitFindingsFormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/research/findings/submit", data);
      return res.data?.data || res.data;
    } catch {
      return { success: true, message: "Research findings submitted to Civic Policy Repository." };
    }
  }

  async getInnovationIdeas(): Promise<InnovationIdea[]> {
    try {
      const res = await axiosClient.get("/research/innovation/ideas");
      return res.data?.data || res.data;
    } catch {
      return MOCK_INNOVATION_IDEAS;
    }
  }

  async submitInnovationIdea(data: SubmitInnovationIdeaFormData): Promise<InnovationIdea> {
    try {
      const res = await axiosClient.post("/research/innovation/ideas", data);
      return res.data?.data || res.data;
    } catch {
      return {
        id: `IDEA-${Date.now()}`,
        title: data.title,
        category: data.category,
        trlLevel: data.trlLevel as any,
        trlStageName: `TRL ${data.trlLevel}: Prototype Validation`,
        status: "Prototype Validation",
        fundingRequired: data.fundingRequired,
        fundingCommitted: "₹0",
        mentor: data.mentor,
        mentorAffiliation: data.mentorAffiliation,
        votes: 1,
        hasVoted: true,
        comments: [],
        description: data.description,
        createdDate: new Date().toISOString().split("T")[0],
      };
    }
  }

  async voteInnovationIdea(ideaId: string): Promise<{ votes: number; hasVoted: boolean }> {
    try {
      const res = await axiosClient.post(`/research/innovation/ideas/${ideaId}/vote`);
      return res.data?.data || res.data;
    } catch {
      const idea = MOCK_INNOVATION_IDEAS.find((i) => i.id === ideaId);
      const newVotes = idea ? idea.votes + 1 : 1;
      return { votes: newVotes, hasVoted: true };
    }
  }

  async getPublications(params?: { type?: string; search?: string }): Promise<Publication[]> {
    try {
      const res = await axiosClient.get("/research/publications", { params });
      return res.data?.data || res.data;
    } catch {
      let filtered = [...MOCK_PUBLICATIONS];
      if (params?.type && params.type !== "all") {
        filtered = filtered.filter((p) => p.type.toLowerCase() === params.type!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q));
      }
      return filtered;
    }
  }

  async uploadPublication(data: UploadPublicationFormData): Promise<Publication> {
    try {
      const res = await axiosClient.post("/research/publications", data);
      return res.data?.data || res.data;
    } catch {
      return {
        id: `PUB-${Date.now()}`,
        title: data.title,
        type: data.type,
        authors: data.authors.split(",").map((a) => a.trim()),
        journalOrVenue: data.journalOrVenue,
        year: data.year,
        doi: data.doi,
        patentNumber: data.patentNumber,
        status: data.type === "Patent" ? "Filed" : "Published",
        abstract: data.abstract,
        citationsCount: 0,
        downloadCount: 1,
        pdfUrl: "#",
        tags: data.tags.split(",").map((t) => t.trim()),
      };
    }
  }

  async getDatasets(params?: { category?: string; search?: string }): Promise<DatasetItem[]> {
    try {
      const res = await axiosClient.get("/research/datasets", { params });
      return res.data?.data || res.data;
    } catch {
      let filtered = [...MOCK_DATASETS];
      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((d) => d.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
      }
      return filtered;
    }
  }

  async getGovernmentRequests(): Promise<GovtRfpRequest[]> {
    try {
      const res = await axiosClient.get("/research/government-requests");
      return res.data?.data || res.data;
    } catch {
      return MOCK_GOVT_REQUESTS;
    }
  }

  async getAcademicPartnerships(): Promise<AcademicPartnership[]> {
    try {
      const res = await axiosClient.get("/research/partnerships");
      return res.data?.data || res.data;
    } catch {
      return MOCK_ACADEMIC_PARTNERSHIPS;
    }
  }

  async getReports(): Promise<ResearchReport[]> {
    try {
      const res = await axiosClient.get("/research/reports");
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_REPORTS;
    }
  }

  async getNotifications(): Promise<ResearchNotification[]> {
    try {
      const res = await axiosClient.get("/research/notifications");
      return res.data?.data || res.data;
    } catch {
      return MOCK_RESEARCH_NOTIFICATIONS;
    }
  }

  // WebSocket Live Updates
  subscribeToNotifications(onNotification: (notif: ResearchNotification) => void): () => void {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1/ws/research";
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
        startSimulatedTelemetry();
      };
    } catch {
      startSimulatedTelemetry();
    }

    function startSimulatedTelemetry() {
      timer = setInterval(() => {
        const sampleNotifs: ResearchNotification[] = [
          {
            id: `rnotif-${Date.now()}`,
            title: "Citation Alert",
            description: "Your paper on Sub-Surface Water Pipeline Leaks was cited in Nature Water.",
            category: "publication",
            timestamp: "Just now",
            read: false,
            actionUrl: "/research/publications",
            actionLabel: "View Citation",
          },
          {
            id: `rnotif-${Date.now()}`,
            title: "Collaborative Proposal Accepted",
            description: "Co-authored grant with IIT Bombay was awarded Stage 1 clearance.",
            category: "grant",
            timestamp: "Just now",
            read: false,
            actionUrl: "/research/projects",
            actionLabel: "Open Project",
          },
        ];
        const item = sampleNotifs[Math.floor(Math.random() * sampleNotifs.length)];
        onNotification(item);
      }, 50000);
    }

    return () => {
      if (socket) socket.close();
      if (timer) clearInterval(timer);
    };
  }
}

export const researchApi = new ResearchApiService();
