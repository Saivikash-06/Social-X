import { axiosClient } from "@/features/shared/services/axios-client";
import {
  ResearchProject,
  ResearchTask,
  ResearchProposal,
  FacultyDashboardStats,
  StudentDashboardStats,
  UniversityUser,
  StudentTeamMember,
  AcademicTeam,
  InnovationAIIdea,
  InnovationPrototype,
  HackathonProject,
  GovernmentChallenge,
  IndustryCollaboration,
} from "../types";
import { FacultyLoginFormData, StudentLoginFormData } from "../validation/university-schemas";

export const MOCK_STUDENTS: StudentTeamMember[] = [
  {
    id: "stu_101",
    name: "Rohan Varma",
    email: "rohan.v@student.iisc.ac.in",
    roleInProject: "Lead Telemetry & Acoustic Sensor Engineer",
    yearOrProgram: "Ph.D. Scholar (Year 2)",
    avatarUrl: "",
  },
  {
    id: "stu_102",
    name: "Ananya Iyer",
    email: "ananya.i@student.iisc.ac.in",
    roleInProject: "Hydrological Computational Modeling",
    yearOrProgram: "M.Tech Computational Data Science",
    avatarUrl: "",
  },
  {
    id: "stu_103",
    name: "Karthik Subramanian",
    email: "karthik.s@student.iisc.ac.in",
    roleInProject: "Edge AI Firmware Developer",
    yearOrProgram: "B.Tech Final Year Research Fellow",
    avatarUrl: "",
  },
];

export const MOCK_PROJECTS: ResearchProject[] = [
  {
    id: "PRJ-2026-001",
    code: "BWSSB-WAT-01",
    title: "Acoustic Sensor Pipeline Leakage Detection & Real-Time Isolation",
    description:
      "Deployment of ultra-low power vibrational and acoustic sensor nodes across municipal ductile iron water mains to pinpoint micro-fractures before catastrophic road caving occurs.",
    problemStatement:
      "Municipal water boards lose over 35% of potable supply (Non-Revenue Water) due to subterranean leaks that remain undetected until sinkholes develop.",
    linkedMunicipalGrievanceId: "SOC-2026-8821",
    governmentReference: "GOV-BWSSB-2026-8821",
    aiCategory: "Acoustic Water Telemetry",
    municipalDepartment: "Bangalore Water Supply & Sewerage Board (BWSSB)",
    department: "Civil & Environmental Engineering",
    facultyAdvisor: {
      id: "fac_iisc_101",
      name: "Dr. Elena Rostova",
      designation: "Professor & Principal Investigator",
      department: "Dept of Civil & Environmental Engineering",
    },
    assignedStudents: [MOCK_STUDENTS[0], MOCK_STUDENTS[1]],
    assignedStudentIds: ["stu_101", "stu_102"],
    status: "in_progress",
    priority: "high",
    fundingGrantAmount: "₹24,50,000",
    fundingAmount: 45000,
    startDate: "2026-08-01",
    targetCompletionDate: "2026-11-30",
    deadline: "2026-11-30",
    progressPercentage: 68,
    location: "Indiranagar Ward 142 Corridor, Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    ],
    milestones: [
      {
        id: "m-1",
        title: "Phase 1: Sensor Array Fabrication & Bench Testing",
        description: "Calibration of piezoelectric transducers in controlled pressure flume.",
        dueDate: "2026-08-30",
        completedDate: "2026-08-28",
        status: "approved",
        deliverableFileUrl: "/reports/sensor_bench_test.pdf",
        facultyFeedback: "Excellent signal-to-noise ratio observed across 4 bar pressure cycles.",
      },
      {
        id: "m-2",
        title: "Phase 2: Indiranagar Ward 142 Field Pilot",
        description: "Installation of 12 telemetry nodes along 14th Main road water corridor.",
        dueDate: "2026-09-25",
        status: "submitted",
        deliverableFileUrl: "/reports/ward142_field_telemetry.pdf",
        facultyFeedback: "Under faculty review. Pending noise threshold validation.",
      },
      {
        id: "m-3",
        title: "Phase 3: Automated Valve Actuation & Dashboard Integration",
        description: "Integration of real-time acoustic alerts directly into BWSSB control room.",
        dueDate: "2026-11-15",
        status: "pending",
      },
    ],
    files: [
      {
        id: "f-1",
        name: "Acoustic_Waveform_Spectral_Analysis.pdf",
        sizeBytes: 4200000,
        uploadedBy: "Rohan Varma",
        uploadedAt: "2026-09-12",
        fileType: "pdf",
        downloadUrl: "#",
      },
      {
        id: "f-2",
        name: "Telemetry_Firmware_v2.1_ESP32.c",
        sizeBytes: 154000,
        uploadedBy: "Karthik Subramanian",
        uploadedAt: "2026-09-14",
        fileType: "code",
        downloadUrl: "#",
      },
    ],
    documents: [
      {
        id: "f-1",
        name: "Acoustic_Waveform_Spectral_Analysis.pdf",
        sizeBytes: 4200000,
        uploadedBy: "Rohan Varma",
        uploadedAt: "2026-09-12",
        fileType: "pdf",
        downloadUrl: "#",
      },
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Dr. Elena Rostova",
        authorRole: "faculty",
        content: "Please ensure the battery sleep-cycle firmware draws < 15uA during standby.",
        timestamp: "Yesterday, 04:30 PM",
      },
      {
        id: "c-2",
        authorName: "Rohan Varma",
        authorRole: "student",
        content: "Verified in lab testing: sleep current is 11.2uA on solar trickle charge.",
        timestamp: "Today, 10:15 AM",
      },
    ],
  },
  {
    id: "PRJ-2026-002",
    code: "BBMP-RD-02",
    title: "Computer Vision Edge Depth Estimation for Asphalt Crater Classification",
    description:
      "Mounted camera algorithms on public city buses estimating pothole volumetric depth and classification index using monocular depth estimation models.",
    problemStatement:
      "Manual road survey inspections cannot keep pace with monsoon road degradation, leading to delayed repair prioritization.",
    linkedMunicipalGrievanceId: "SOC-2026-6402",
    governmentReference: "GOV-BBMP-2026-6402",
    aiCategory: "Edge Vision & Depth AI",
    municipalDepartment: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    department: "Computer Science & Automation",
    facultyAdvisor: {
      id: "fac_iisc_101",
      name: "Dr. Elena Rostova",
      designation: "Professor & Principal Investigator",
      department: "Dept of Civil & Environmental Engineering",
    },
    assignedStudents: [MOCK_STUDENTS[2]],
    assignedStudentIds: ["stu_103"],
    status: "in_progress",
    priority: "medium",
    fundingGrantAmount: "₹18,00,000",
    fundingAmount: 32000,
    startDate: "2026-09-01",
    targetCompletionDate: "2026-12-20",
    deadline: "2026-12-20",
    progressPercentage: 42,
    location: "Outer Ring Road Transit Corridor, Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [],
    milestones: [
      {
        id: "m-201",
        title: "YOLOv10 Pothole Object Model Fine-Tuning",
        description: "Trained on 14,000 local road images under varying sunlight and rain.",
        dueDate: "2026-09-20",
        status: "approved",
      },
      {
        id: "m-202",
        title: "Depth Volumetric Accuracy Benchmark",
        description: "Compare LiDAR ground truth with neural monocular depth estimate.",
        dueDate: "2026-10-15",
        status: "pending",
      },
    ],
    files: [],
    documents: [],
    comments: [],
  },
  {
    id: "PRJ-2026-003",
    code: "SWMC-ENG-03",
    title: "Decentralized Biomass Waste-to-Energy Pyrolysis Micro-Unit",
    description:
      "Modular localized bio-gasification reactor designed for organic market wet waste conversion with zero methane footprint.",
    problemStatement:
      "Wholesale organic food markets generate 40 tons of wet biodegradable waste daily that overwhelms municipal landfills and creates hazardous leachates.",
    linkedMunicipalGrievanceId: "SOC-2026-9901",
    governmentReference: "GOV-SWMC-2026-9901",
    aiCategory: "Bio-Thermal Energy Conversion",
    municipalDepartment: "Solid Waste Management Corporation (SWMC)",
    department: "Environmental Engineering",
    facultyAdvisor: {
      id: "fac_iisc_101",
      name: "Dr. Elena Rostova",
      designation: "Professor & Principal Investigator",
      department: "Dept of Civil & Environmental Engineering",
    },
    assignedStudents: [MOCK_STUDENTS[1]],
    assignedStudentIds: ["stu_102"],
    status: "proposed",
    priority: "critical",
    fundingGrantAmount: "₹35,00,000",
    fundingAmount: 58000,
    startDate: "2026-10-01",
    targetCompletionDate: "2027-03-31",
    deadline: "2027-03-31",
    progressPercentage: 10,
    location: "KR Wholesale Flower & Vegetable Market Complex, Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [],
    milestones: [
      {
        id: "m-301",
        title: "Feedstock Characterization & Moisture Profiling",
        description: "Calorimetric assay of vegetable waste mixes.",
        dueDate: "2026-10-25",
        status: "pending",
      }
    ],
    files: [],
    documents: [],
    comments: [],
  },
  {
    id: "PRJ-2026-004",
    code: "CPCB-AIR-04",
    title: "Autonomous Drone Drone-Swarm Micro-Climate Particulate Air Quality Profiling",
    description:
      "Vertical column atmospheric sensing of PM2.5, PM10, and NO2 using autonomous quadcopter arrays during traffic peak hours.",
    problemStatement:
      "Ground-level monitors miss the thermal inversion layer where pollutants trap over metropolitan flyovers.",
    governmentReference: "GOV-CPCB-2026-1044",
    aiCategory: "Drone & Autonomous Sensors",
    municipalDepartment: "Central Pollution Control Board (CPCB)",
    department: "Aerospace & Environmental Engineering",
    facultyAdvisor: {
      id: "fac_iisc_101",
      name: "Dr. Elena Rostova",
      designation: "Professor & Principal Investigator",
      department: "Dept of Civil & Environmental Engineering",
    },
    assignedStudents: [MOCK_STUDENTS[0], MOCK_STUDENTS[2]],
    assignedStudentIds: ["stu_101", "stu_103"],
    status: "completed",
    priority: "high",
    fundingGrantAmount: "₹28,00,000",
    fundingAmount: 50000,
    startDate: "2026-01-10",
    targetCompletionDate: "2026-07-30",
    deadline: "2026-07-30",
    progressPercentage: 100,
    location: "Silk Board Traffic Junction & Electronic City Flyover",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [],
    milestones: [
      {
        id: "m-401",
        title: "FAA-Compliant Flight Corridor Clearances",
        description: "Secured altitude permissions from municipal airspace authority.",
        dueDate: "2026-02-15",
        completedDate: "2026-02-12",
        status: "approved",
      },
      {
        id: "m-402",
        title: "3D Pollution Inversion Heatmap Delivery",
        description: "Published interactive layer into CPCB public cloud.",
        dueDate: "2026-07-20",
        completedDate: "2026-07-18",
        status: "approved",
      }
    ],
    files: [],
    documents: [],
    comments: [],
  },
  {
    id: "PRJ-2026-005",
    code: "TRAF-AI-05",
    title: "Dynamic Smart Traffic Signal Synchronization via AI Edge Cameras",
    description:
      "Adaptive cycle timing algorithm responding to real-time lane density to prioritize emergency vehicles and high-occupancy transit.",
    problemStatement:
      "Static timer traffic lights cause average delays of 22 minutes per vehicle at major arterial intersections during peak hours.",
    governmentReference: "GOV-TRAF-2026-4412",
    aiCategory: "Smart Mobility AI",
    municipalDepartment: "Bengaluru Traffic Police (BTP)",
    department: "Computer Science & Automation",
    facultyAdvisor: {
      id: "fac_iisc_101",
      name: "Dr. Elena Rostova",
      designation: "Professor & Principal Investigator",
      department: "Dept of Civil & Environmental Engineering",
    },
    assignedStudents: [],
    assignedStudentIds: [],
    status: "proposed",
    priority: "critical",
    fundingGrantAmount: "₹42,00,000",
    fundingAmount: 70000,
    startDate: "2026-11-01",
    targetCompletionDate: "2027-05-30",
    deadline: "2027-05-30",
    progressPercentage: 0,
    location: "MG Road & Trinity Circle Crossings, Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"
    ],
    videos: [],
    milestones: [],
    files: [],
    documents: [],
    comments: [],
  }
];

export const MOCK_TASKS: ResearchTask[] = [
  {
    id: "tsk-1",
    projectId: "PRJ-2026-001",
    projectTitle: "Acoustic Sensor Pipeline Leakage Detection",
    title: "Calibrate frequency threshold filters for 20Hz-5kHz sound range",
    description: "Ensure street vehicular rumble is filtered out from water pipe hissing signals.",
    assignedStudentId: "stu_101",
    assignedStudentName: "Rohan Varma",
    dueDate: "2026-09-22",
    status: "in_progress",
    priority: "high",
  },
  {
    id: "tsk-2",
    projectId: "PRJ-2026-001",
    projectTitle: "Acoustic Sensor Pipeline Leakage Detection",
    title: "Prepare Field Deployment Battery Enclosure 3D Print CAD",
    description: "IP68 waterproof housing for underground manhole pit node mounting.",
    assignedStudentId: "stu_101",
    assignedStudentName: "Rohan Varma",
    dueDate: "2026-09-24",
    status: "done",
    priority: "medium",
  },
  {
    id: "tsk-3",
    projectId: "PRJ-2026-002",
    projectTitle: "Computer Vision Edge Depth Estimation",
    title: "Quantize ONNX model for Raspberry Pi 5 Edge TPU deployment",
    description: "Benchmark latency under 30 frames per second at 1080p resolution.",
    assignedStudentId: "stu_103",
    assignedStudentName: "Karthik Subramanian",
    dueDate: "2026-09-28",
    status: "todo",
    priority: "high",
  },
];

export const MOCK_PROPOSALS: ResearchProposal[] = [
  {
    id: "PROP-2026-44",
    title: "Urban Heat Island Mitigation via High-Albedo Rooftop Coatings",
    municipalDepartment: "Dept of Urban Development & Environment",
    problemSummary:
      "Dense high-rise concrete corridors experience 4.5°C higher ambient temperature causing extreme cooling energy demand.",
    estimatedBudget: "₹15,00,000",
    targetDomain: "Civil & Materials Engineering",
    submittedAt: "2026-09-12",
    status: "pending_review",
  },
  {
    id: "PROP-2026-45",
    title: "Subsurface Aquifer Heavy Metal & Arsenic Micro-Filtration Pilot",
    municipalDepartment: "Rural Water & Sanitation Mission",
    problemSummary:
      "Perimeter borewells in industrial clusters exceed permissible fluoride and cadmium parts-per-billion.",
    estimatedBudget: "₹28,00,000",
    targetDomain: "Environmental Chemical Engineering",
    submittedAt: "2026-09-14",
    status: "pending_review",
  },
];

export const MOCK_TEAMS: AcademicTeam[] = [
  {
    id: "team-01",
    name: "Acoustic Telemetry & Hydrodynamics Lab Team",
    projectId: "PRJ-2026-001",
    projectTitle: "Acoustic Sensor Pipeline Leakage Detection & Real-Time Isolation",
    leader: MOCK_STUDENTS[0],
    members: [MOCK_STUDENTS[0], MOCK_STUDENTS[1]],
    assignedFacultyId: "fac_iisc_101",
    assignedFacultyName: "Dr. Elena Rostova",
    attendanceRate: 96,
    progressPercentage: 68,
    status: "active",
    createdAt: "2026-08-01",
    contributions: [
      {
        studentId: "stu_101",
        studentName: "Rohan Varma",
        role: "Lead Firmware & Acoustic Engineer",
        attendanceRate: 98,
        tasksCompleted: 14,
        hoursLogged: 76,
        contributionPercentage: 58,
      },
      {
        studentId: "stu_102",
        studentName: "Ananya Iyer",
        role: "Hydrological Computational Modeler",
        attendanceRate: 94,
        tasksCompleted: 10,
        hoursLogged: 52,
        contributionPercentage: 42,
      },
    ],
  },
  {
    id: "team-02",
    name: "Edge Computer Vision & Transit Lab Team",
    projectId: "PRJ-2026-002",
    projectTitle: "Computer Vision Edge Depth Estimation for Asphalt Crater Classification",
    leader: MOCK_STUDENTS[2],
    members: [MOCK_STUDENTS[2]],
    assignedFacultyId: "fac_iisc_101",
    assignedFacultyName: "Dr. Elena Rostova",
    attendanceRate: 92,
    progressPercentage: 42,
    status: "active",
    createdAt: "2026-09-01",
    contributions: [
      {
        studentId: "stu_103",
        studentName: "Karthik Subramanian",
        role: "Edge AI & Depth Model Engineer",
        attendanceRate: 92,
        tasksCompleted: 8,
        hoursLogged: 44,
        contributionPercentage: 100,
      },
    ],
  },
  {
    id: "team-03",
    name: "Urban Biomass & Clean Energy Working Group",
    projectId: "PRJ-2026-003",
    projectTitle: "Decentralized Biomass Waste-to-Energy Pyrolysis Micro-Unit",
    leader: MOCK_STUDENTS[1],
    members: [MOCK_STUDENTS[1]],
    assignedFacultyId: "fac_iisc_101",
    assignedFacultyName: "Dr. Elena Rostova",
    attendanceRate: 90,
    progressPercentage: 10,
    status: "planning",
    createdAt: "2026-10-01",
    contributions: [
      {
        studentId: "stu_102",
        studentName: "Ananya Iyer",
        role: "Thermal Assay & Chemical Engineer",
        attendanceRate: 90,
        tasksCompleted: 3,
        hoursLogged: 18,
        contributionPercentage: 100,
      },
    ],
  },
];

export const MOCK_AI_IDEAS: InnovationAIIdea[] = [
  {
    id: "idea-01",
    title: "Graph Neural Networks for Subterranean Water Leak Cross-Correlation",
    department: "Civil & Environmental Engineering",
    category: "Smart Water Infrastructure",
    problemStatement: "Pinpointing subtle pressure transients that span multi-kilometer looping pipe topologies.",
    aiApproach: "Spatial-temporal GNN propagating acoustic pulse wavelets to localize pinhole leaks within 1.2 meters.",
    readinessLevel: "TRL-4 (Lab Bench Validated)",
    author: "Rohan Varma",
    authorRole: "student",
    upvotes: 42,
    isUpvoted: true,
    tags: ["GNN", "Acoustic Telemetry", "Graph AI", "Water Mains"],
  },
  {
    id: "idea-02",
    title: "Drone-Mounted Hyperspectral Crop & Urban Heat Island Micro-Thermal Radiometry",
    department: "Aerospace & Remote Sensing",
    category: "Urban Climate Resilience",
    problemStatement: "Identifying severe rooftop heat absorption pockets causing extreme residential power draw.",
    aiApproach: "Convolutional Radiance Field modeling of roof reflectance parameters to calculate optimal cool-roof incentives.",
    readinessLevel: "TRL-5 (Field Simulated)",
    author: "Ananya Iyer",
    authorRole: "student",
    upvotes: 38,
    isUpvoted: false,
    tags: ["Hyperspectral", "Drones", "Urban Heat", "Computer Vision"],
  },
  {
    id: "idea-03",
    title: "Reinforcement Learning for Dynamic Municipal Solid Waste Route Optimization",
    department: "Computer Science & Automation",
    category: "Smart Waste Management",
    problemStatement: "Compactor trucks run fixed routes regardless of dumpster fullness, burning excess diesel.",
    aiApproach: "Multi-Agent Deep Q-Network ingesting IoT ultrasonic dumpster fill levels to dynamically re-route 140 trucks in real-time.",
    readinessLevel: "TRL-6 (City Trial Ready)",
    author: "Dr. Elena Rostova",
    authorRole: "faculty",
    upvotes: 67,
    isUpvoted: true,
    tags: ["Reinforcement Learning", "Route Optimization", "IoT", "Green Fleet"],
  },
];

export const MOCK_PROTOTYPES: InnovationPrototype[] = [
  {
    id: "proto-01",
    title: "PiezoSense v2.1 Subsurface Acoustic Logger",
    category: "Hardware / IoT Edge",
    status: "Field Tested",
    description: "Ultra-low power IP68 battery node with 3-year standby and high-bandwidth vibration transducers.",
    techStack: ["ESP32-S3", "MEMS Accelerometers", "LoRaWAN 868MHz", "C++ Embedded"],
    demoUrl: "https://github.com/social-x/piezosense-firmware",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    teamName: "Acoustic Telemetry Lab",
    leadFaculty: "Dr. Elena Rostova",
    stars: 128,
  },
  {
    id: "proto-02",
    title: "TransitVision Monocular Depth Classifier",
    category: "Computer Vision / Edge AI",
    status: "Beta Pilot",
    description: "Lightweight edge neural pipeline running 30fps on Raspberry Pi 5 to classify pavement distress.",
    techStack: ["PyTorch", "ONNX Runtime", "YOLOv10-Nano", "Python", "FastAPI"],
    demoUrl: "https://transitvision.social-x.gov.in",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    teamName: "Edge Vision & Transit Lab",
    leadFaculty: "Dr. Elena Rostova",
    stars: 94,
  },
  {
    id: "proto-03",
    title: "Pyrolyzer-Mini Decentralized Biochar Reactor",
    category: "Clean Energy / Hardware",
    status: "Alpha Lab",
    description: "Bench scale 50kg/hr continuous pyrolytic carbonizer producing agricultural grade biochar from market waste.",
    techStack: ["Micro-PLC Siemens", "PID Temperature Controls", "SolidWorks CAD", "Modbus"],
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    teamName: "Urban Biomass Working Group",
    leadFaculty: "Dr. Elena Rostova",
    stars: 76,
  },
];

export const MOCK_HACKATHONS: HackathonProject[] = [
  {
    id: "hack-01",
    title: "AquaPulse: Civic AI for Water Security",
    event: "Smart India Hackathon (SIH 2026)",
    award: "1st Prize - Smart Governance Winner",
    year: 2026,
    description: "Developed end-to-end edge pipeline connecting 14 acoustic sensors to municipal BWSSB telemetry dashboard.",
    teamMembers: ["Rohan Varma", "Ananya Iyer", "Karthik Subramanian", "Alex Rivera"],
    department: "Civil & Computer Science Joint Team",
    solutionUrl: "https://sih.gov.in/project/aquapulse-2026",
  },
  {
    id: "hack-02",
    title: "InundationNet: Real-Time Urban Flash Flood Predictor",
    event: "National Civic Innovation Grand Challenge",
    award: "Best Community Impact Finalist",
    year: 2025,
    description: "Digital elevation hydrologic simulator forecasting localized street ponding 45 minutes prior to downpour.",
    teamMembers: ["Maya Chen", "David Kim", "Sarah Al-Hassan"],
    department: "Environmental Engineering",
    solutionUrl: "https://civic.gov.in/inundation-net",
  },
];

export const MOCK_GOV_CHALLENGES: GovernmentChallenge[] = [
  {
    id: "gov-ch-01",
    refCode: "GOV-CH-MUM-401",
    title: "AI-Powered Real-Time Stormwater Retention Gate Actuation",
    department: "Municipal Drainage & Stormwater Directorate",
    description: "Seeking predictive control algorithms to open sluice gates based on catchment radar rainfall forecasts.",
    grantBudget: "₹45,00,000",
    deadline: "2026-10-30",
    urgency: "critical",
    submissionCount: 4,
  },
  {
    id: "gov-ch-02",
    refCode: "GOV-CH-BLR-210",
    title: "Automated Inspection of Underground Power Cable Conduit Insulation Failures",
    department: "Bengaluru Electricity Supply Company (BESCOM)",
    description: "Deploy non-destructive testing and acoustic/thermal detection for subterranean HT cable joint aging.",
    grantBudget: "₹30,00,000",
    deadline: "2026-11-15",
    urgency: "high",
    submissionCount: 2,
  },
  {
    id: "gov-ch-03",
    refCode: "GOV-CH-PWD-109",
    title: "Eco-Friendly Geopolymer Composite Pavement from Construction Demolition Slag",
    department: "State Public Works Department (PWD)",
    description: "Formulate zero-clinker concrete mixtures utilizing 60% C&D recycled aggregate for high-wear urban bus stops.",
    grantBudget: "₹25,00,000",
    deadline: "2026-12-05",
    urgency: "medium",
    submissionCount: 6,
  },
];

export const MOCK_INDUSTRY_PARTNERS: IndustryCollaboration[] = [
  {
    id: "ind-01",
    companyName: "Siemens Smart Infrastructure",
    domain: "Substation Automation & SCADA IoT",
    offering: "Hardware kits, cloud telemetry sandbox, and technical engineering co-supervisors.",
    mentorName: "Dr. Rajesh Kulkarni (Chief Architect)",
    activeProjects: 2,
    status: "Active Partner",
    logoText: "SIEMENS",
  },
  {
    id: "ind-02",
    companyName: "Tata Power Microgrids",
    domain: "Decentralized Solar & Battery Storage",
    offering: "₹15 Lakh annual prototyping grant pool + grid connection safety audit certification.",
    mentorName: "Pooja Hegde (Director of R&D)",
    activeProjects: 3,
    status: "Grant Provider",
    logoText: "TATA POWER",
  },
  {
    id: "ind-03",
    companyName: "Cisco Smart Cities IoT Lab",
    domain: "LoRaWAN & Urban Sensor Networks",
    offering: "LoRaWAN 16-channel outdoor gateway nodes, industrial edge switches, and API credits.",
    mentorName: "Michael Chang (VP Civic Solutions)",
    activeProjects: 1,
    status: "MOU Signed",
    logoText: "CISCO",
  },
];

export const universityApi = {
  // Faculty Login
  async loginFaculty(data: FacultyLoginFormData): Promise<UniversityUser> {
    try {
      const res = await axiosClient.post("/university/auth/faculty/login", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        id: "fac_iisc_101",
        fullName: "Dr. Arisudan Sharma",
        email: data.email,
        role: "faculty",
        universityName: "Indian Institute of Science (IISc)",
        department: "Dept of Civil & Environmental Engineering",
        specialization: "Smart Water Networks & Pipeline Acoustic Telemetry",
        designation: "Professor & Principal Investigator",
        employeeIdOrRollNumber: "IISc-FAC-7821",
        phone: "+91 98450 11223",
      };
    }
  },

  // Student Login
  async loginStudent(data: StudentLoginFormData): Promise<UniversityUser> {
    try {
      const res = await axiosClient.post("/university/auth/student/login", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        id: "stu_101",
        fullName: "Rohan Varma",
        email: data.email,
        role: "student",
        universityName: "Indian Institute of Science (IISc)",
        department: "Dept of Civil & Environmental Engineering",
        specialization: "Acoustic Telemetry & Hydrodynamics",
        designation: "Ph.D. Research Scholar (Year 2)",
        employeeIdOrRollNumber: "IISc-PHD-2024-08",
        phone: "+91 97410 88991",
      };
    }
  },

  // Google OAuth for University
  async loginGoogleUniversity(role: "faculty" | "student"): Promise<UniversityUser> {
    try {
      const res = await axiosClient.post("/university/auth/google", { role });
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (role === "faculty") {
        return {
          id: "fac_google_prof",
          fullName: "Prof. Vikram Sarabhai Fellow",
          email: "faculty.lead@iisc.ac.in",
          role: "faculty",
          universityName: "Indian Institute of Science (IISc)",
          department: "School of Engineering",
          designation: "Professor & Chair",
        };
      }
      return {
        id: "stu_google_scholar",
        fullName: "Aarav Nambiar",
        email: "aarav.n@student.iisc.ac.in",
        role: "student",
        universityName: "Indian Institute of Science (IISc)",
        department: "Computer Science & Automation",
        designation: "M.Tech Research Scholar",
      };
    }
  },

  // Faculty Stats
  async getFacultyStats(): Promise<FacultyDashboardStats> {
    try {
      const res = await axiosClient.get("/university/faculty/stats");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        activeProjects: 3,
        totalStudentsAssigned: 8,
        pendingReviewsCount: 2,
        publishedPapers: 14,
        grantUtilizationRate: 74,
      };
    }
  },

  // Student Stats
  async getStudentStats(): Promise<StudentDashboardStats> {
    try {
      const res = await axiosClient.get("/university/student/stats");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        assignedProjectsCount: 2,
        pendingTasksCount: 3,
        completedMilestonesCount: 4,
        unreadFacultyMessagesCount: 2,
      };
    }
  },

  // Get Projects
  async getProjects(params?: { status?: string; search?: string }): Promise<ResearchProject[]> {
    try {
      const res = await axiosClient.get("/university/projects", { params });
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...MOCK_PROJECTS];
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((p) => p.status === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.municipalDepartment.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  // Get Project By ID
  async getProjectById(id: string): Promise<ResearchProject> {
    try {
      const res = await axiosClient.get(`/university/projects/${id}`);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
      return found;
    }
  },

  // Approve Project / Proposal
  async approveProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${id}/approve`);
      return res.data;
    } catch {
      return { success: true, message: `Project ${id} officially approved and activated.` };
    }
  },

  // Reject Project
  async rejectProject(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${id}/reject`, { reason });
      return res.data;
    } catch {
      return { success: true, message: `Project ${id} declined.` };
    }
  },

  // Assign Student to Project
  async assignStudent(
    projectId: string,
    studentId: string,
    roleInProject: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${projectId}/assign-student`, {
        studentId,
        roleInProject,
      });
      return res.data;
    } catch {
      return {
        success: true,
        message: "Student successfully assigned to research project.",
      };
    }
  },

  // Get Tasks
  async getTasks(): Promise<ResearchTask[]> {
    try {
      const res = await axiosClient.get("/university/student/tasks");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_TASKS;
    }
  },

  // Update Task Status
  async updateTaskStatus(
    taskId: string,
    status: "todo" | "in_progress" | "done"
  ): Promise<{ success: boolean }> {
    try {
      const res = await axiosClient.patch(`/university/tasks/${taskId}`, { status });
      return res.data;
    } catch {
      return { success: true };
    }
  },

  // Get Proposals
  async getProposals(): Promise<ResearchProposal[]> {
    try {
      const res = await axiosClient.get("/university/proposals");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PROPOSALS;
    }
  },

  // Login with University Access Key
  async loginWithAccessKey(
    accessKey: string,
    role: "faculty" | "student",
    email?: string
  ): Promise<UniversityUser> {
    try {
      const res = await axiosClient.post("/university/auth/access-key", { accessKey, role, email });
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (role === "faculty") {
        return {
          id: "fac_iisc_101",
          fullName: "Dr. Elena Rostova",
          email: email || "elena.rostova@stanford.edu",
          role: "faculty",
          universityName: "Stanford University",
          institution: "Stanford University",
          department: "Civil & Environmental Engineering",
          designation: "Professor & Principal Investigator",
          employeeIdOrRollNumber: "STAN-FAC-4481",
        };
      }
      return {
        id: "usr-student-01",
        fullName: "Alex Rivera",
        email: email || "alex.rivera@stanford.edu",
        role: "student",
        universityName: "Stanford University",
        institution: "Stanford University",
        department: "Department of Computer Science",
        designation: "Graduate Research Scholar",
        rollNumber: "CS-2024-8902",
        employeeIdOrRollNumber: "CS-2024-8902",
      };
    }
  },

  // Get Teams
  async getTeams(): Promise<AcademicTeam[]> {
    try {
      const res = await axiosClient.get("/university/teams");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_TEAMS;
    }
  },

  // Create Team
  async createTeam(data: any): Promise<{ success: boolean; team: AcademicTeam }> {
    try {
      const res = await axiosClient.post("/university/teams", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const project = MOCK_PROJECTS.find((p) => p.id === data.projectId || p.id === data.assignedProjectId) || MOCK_PROJECTS[0];
      const leader = MOCK_STUDENTS.find((s) => s.id === data.leaderId) || {
        id: data.leaderId || `lead-${Date.now()}`,
        name: data.leaderName || "Alex Johnson",
        email: "alex@univ.edu",
        roleInProject: "Lead",
        yearOrProgram: "Senior",
      };
      const members: StudentTeamMember[] = data.members || (data.memberIds ? MOCK_STUDENTS.filter((s) => data.memberIds.includes(s.id)) : [leader]);
      const newTeam: AcademicTeam = {
        id: `team-${Date.now()}`,
        name: data.name,
        projectId: data.projectId || data.assignedProjectId || project.id,
        projectTitle: data.assignedProjectTitle || project.title,
        assignedProjectId: data.assignedProjectId || project.id,
        assignedProjectTitle: data.assignedProjectTitle || project.title,
        leaderId: data.leaderId,
        leaderName: data.leaderName || leader.name,
        department: data.department || "Computer Science",
        progress: data.progress || 0,
        leader,
        members: members.length > 0 ? members : [leader],
        assignedFacultyId: "fac_iisc_101",
        assignedFacultyName: "Dr. Elena Rostova",
        attendanceRate: 100,
        progressPercentage: data.progress || 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        contributions: members.map((m) => ({
          studentId: m.id,
          studentName: m.name,
          role: m.role || "Research Specialist",
          attendanceRate: m.attendanceRate || 100,
          tasksCompleted: 0,
          hoursLogged: 0,
          contributionPercentage: Math.round(100 / (members.length || 1)),
        })),
      };
      MOCK_TEAMS.push(newTeam);
      return { success: true, team: newTeam };
    }
  },

  // Join Project
  async joinProject(projectId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${projectId}/join`, { studentId });
      return res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true, message: "Successfully applied to join research project team." };
    }
  },

  // Mark Project Completed
  async markProjectCompleted(projectId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${projectId}/complete`);
      return res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const target = MOCK_PROJECTS.find((p) => p.id === projectId);
      if (target) {
        target.status = "completed";
        target.progressPercentage = 100;
        target.progress = 100;
      }
      return { success: true, message: `Project ${projectId} marked as Completed & Solution Submitted.` };
    }
  },

  // Upload Project Progress
  async uploadProjectProgress(
    projectId: string,
    data: { notes: string; progressPercentage: number; fileName?: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post(`/university/projects/${projectId}/progress`, data);
      return res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const target = MOCK_PROJECTS.find((p) => p.id === projectId);
      if (target) {
        target.progressPercentage = Math.min(100, data.progressPercentage);
        target.progress = Math.min(100, data.progressPercentage);
      }
      return { success: true, message: "Progress documentation and artifacts submitted to faculty advisor." };
    }
  },

  // Innovation Endpoints
  async getInnovationData(): Promise<{
    ideas: InnovationAIIdea[];
    aiIdeas: InnovationAIIdea[];
    prototypes: InnovationPrototype[];
    hackathons: HackathonProject[];
    challenges: GovernmentChallenge[];
    governmentChallenges: GovernmentChallenge[];
    partners: IndustryCollaboration[];
    industryPartners: IndustryCollaboration[];
  }> {
    try {
      const res = await axiosClient.get("/university/innovation");
      const data = res.data?.data || res.data;
      return {
        ideas: data.ideas || MOCK_AI_IDEAS,
        aiIdeas: data.ideas || MOCK_AI_IDEAS,
        prototypes: data.prototypes || MOCK_PROTOTYPES,
        hackathons: data.hackathons || MOCK_HACKATHONS,
        challenges: data.challenges || MOCK_GOV_CHALLENGES,
        governmentChallenges: data.challenges || MOCK_GOV_CHALLENGES,
        partners: data.partners || MOCK_INDUSTRY_PARTNERS,
        industryPartners: data.partners || MOCK_INDUSTRY_PARTNERS,
      };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ideas: MOCK_AI_IDEAS,
        aiIdeas: MOCK_AI_IDEAS,
        prototypes: MOCK_PROTOTYPES,
        hackathons: MOCK_HACKATHONS,
        challenges: MOCK_GOV_CHALLENGES,
        governmentChallenges: MOCK_GOV_CHALLENGES,
        partners: MOCK_INDUSTRY_PARTNERS,
        industryPartners: MOCK_INDUSTRY_PARTNERS,
      };
    }
  },

  // Upvote AI Idea
  async upvoteAIIdea(ideaId: string): Promise<{ success: boolean; upvotes: number }> {
    try {
      const res = await axiosClient.post(`/university/innovation/ideas/${ideaId}/upvote`);
      return res.data;
    } catch {
      const target = MOCK_AI_IDEAS.find((i) => i.id === ideaId);
      if (target) {
        target.upvotes = (target.upvotes || 0) + 1;
        target.isUpvoted = true;
        return { success: true, upvotes: target.upvotes };
      }
      return { success: true, upvotes: 43 };
    }
  },

  // Submit AI Idea
  async submitAIIdea(idea: Partial<InnovationAIIdea>): Promise<{ success: boolean; idea: InnovationAIIdea }> {
    try {
      const res = await axiosClient.post("/university/innovation/ideas", idea);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const created: InnovationAIIdea = {
        id: `idea-${Date.now()}`,
        title: idea.title || "Untitled Civic AI Idea",
        department: idea.department || "Cross-Disciplinary AI",
        category: idea.category || "Smart Governance",
        problemStatement: idea.problemStatement || "",
        aiApproach: idea.aiApproach || "",
        readinessLevel: idea.readinessLevel || "TRL-3 (Concept Phase)",
        author: idea.author || "Academic Researcher",
        authorRole: idea.authorRole || "student",
        upvotes: 1,
        isUpvoted: true,
        tags: idea.tags || ["AI", "Civic", "Innovation"],
      };
      MOCK_AI_IDEAS.unshift(created);
      return { success: true, idea: created };
    }
  },
};
