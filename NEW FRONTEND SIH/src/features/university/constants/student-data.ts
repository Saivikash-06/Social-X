/**
 * Reusable mock datasets and types for the University Student Dashboard and related features.
 */

export type RecentActivityType =
  | "project"
  | "research"
  | "credit"
  | "certificate"
  | "notification";

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: RecentActivityType;
  badge?: string;
};

export const RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "1",
    title: "Research Assigned",
    description: "Smart Water Management Project",
    time: "2 hours ago",
    type: "research",
    badge: "Research",
  },
  {
    id: "2",
    title: "Credits Earned",
    description: "+25 Innovation Credits",
    time: "Yesterday",
    type: "credit",
    badge: "Credit",
  },
  {
    id: "3",
    title: "Faculty Approved",
    description: "Proposal approved by mentor",
    time: "2 days ago",
    type: "project",
    badge: "Faculty Verified",
  },
  {
    id: "4",
    title: "Certificate Added",
    description: "AI Innovation Workshop",
    time: "Last Week",
    type: "certificate",
    badge: "Certificate",
  },
];

export const RECENT_ACTIVITIES = RECENT_ACTIVITY;

export interface StudentStats {
  assignedProjects: number;
  pendingTasks: number;
  creditsEarned: number;
  totalCredits: number;
  skillScore: number;
  maxSkillScore: number;
  innovationPoints: number;
  certificatesEarned: number;
  resolvedIssues: number;
}

export const STATS: StudentStats = {
  assignedProjects: 2,
  pendingTasks: 3,
  creditsEarned: 18,
  totalCredits: 20,
  skillScore: 940,
  maxSkillScore: 1000,
  innovationPoints: 880,
  certificatesEarned: 4,
  resolvedIssues: 12,
};

export interface UpcomingEvent {
  id: string;
  title: string;
  project: string;
  due: string;
  date?: string;
  urgency: "critical" | "high" | "medium" | "low";
  type?: string;
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "d-1",
    title: "Ward 142 Telemetry Sensor Calibration Dataset",
    project: "Acoustic Sensor Pipeline Leakage Detection",
    due: "In 48 Hours (Sep 25)",
    date: "Sep 25, 2026",
    urgency: "critical",
    type: "deadline",
  },
  {
    id: "d-2",
    title: "Raspberry Pi 5 Edge TPU Quantization Benchmark",
    project: "Computer Vision Edge Depth Estimation",
    due: "5 Days (Sep 28)",
    date: "Sep 28, 2026",
    urgency: "high",
    type: "deliverable",
  },
  {
    id: "d-3",
    title: "Phase II Milestone Technical Report Writeup",
    project: "Acoustic Sensor Pipeline Leakage Detection",
    due: "Oct 05",
    date: "Oct 05, 2026",
    urgency: "medium",
    type: "report",
  },
];

export const UPCOMING_DEADLINES = UPCOMING_EVENTS;

export interface StudentProjectSummary {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: "in_progress" | "approved" | "completed" | "planning";
  priority: "low" | "medium" | "high" | "critical";
  progressPercentage: number;
  advisorName: string;
  dueDate: string;
}

export const PROJECTS: StudentProjectSummary[] = [
  {
    id: "PRJ-2026-001",
    code: "BWSSB-WAT-01",
    title: "Acoustic Sensor Pipeline Leakage Detection & Real-Time Isolation",
    description:
      "Deployment of vibrational and acoustic sensor nodes across municipal ductile iron water mains to pinpoint micro-fractures.",
    category: "Acoustic Water Telemetry",
    department: "Civil & Environmental Engineering",
    status: "in_progress",
    priority: "high",
    progressPercentage: 68,
    advisorName: "Dr. Elena Rostova",
    dueDate: "Nov 15, 2026",
  },
  {
    id: "PRJ-2026-002",
    code: "PWD-ROAD-04",
    title: "Autonomous Road Pothole Detection via Low-Cost Edge TPU",
    description:
      "Computer vision edge-inference for automated municipal road roughness and asphalt damage assessment.",
    category: "Computer Vision & Edge AI",
    department: "Computer Science & Engineering",
    status: "in_progress",
    priority: "medium",
    progressPercentage: 42,
    advisorName: "Prof. Rajesh Sengupta",
    dueDate: "Dec 10, 2026",
  },
];

export interface StudentNotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "academic" | "milestone" | "verification" | "system";
  actionUrl?: string;
}

export const NOTIFICATIONS: StudentNotificationItem[] = [
  {
    id: "notif-01",
    title: "Milestone Verified",
    message: "Dr. Elena Rostova approved the Phase 1 Bench Test Artifact.",
    timestamp: "2 hours ago",
    read: false,
    type: "milestone",
    actionUrl: "/university/projects/PRJ-2026-001",
  },
  {
    id: "notif-02",
    title: "Telemetry Data Review Scheduled",
    message:
      "Meeting scheduled with BWSSB Assistant Executive Engineer on Friday 10:00 AM.",
    timestamp: "1 day ago",
    read: false,
    type: "academic",
    actionUrl: "/university/student/tasks",
  },
  {
    id: "notif-03",
    title: "Credits Granted",
    message:
      "You were awarded +25 Innovation Credits for Ward 142 Acoustic Sensor Pilot.",
    timestamp: "2 days ago",
    read: true,
    type: "verification",
    actionUrl: "/university/credits",
  },
];

export interface StudentAchievementItem {
  id: string;
  title: string;
  category: string;
  description: string;
  earnedDate: string;
  badgeUrl?: string;
  points: number;
}

export const ACHIEVEMENTS: StudentAchievementItem[] = [
  {
    id: "ach-01",
    title: "Smart Governance Champion",
    category: "Municipal Civic Impact",
    description: "Resolved 10+ critical civic telemetry sensor validation runs.",
    earnedDate: "Sep 2026",
    points: 250,
  },
  {
    id: "ach-02",
    title: "IoT Firmware Master",
    category: "Technical Mastery",
    description:
      "Successfully quantized and deployed TinyML model on ARM Cortex-M4.",
    earnedDate: "Aug 2026",
    points: 300,
  },
  {
    id: "ach-03",
    title: "SIH Grand Finalist",
    category: "Innovation Hackathon",
    description: "Smart India Hackathon 2026 Smart Automation finalist selection.",
    earnedDate: "Jul 2026",
    points: 500,
  },
];

export interface StudentLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  department: string;
  institution: string;
  score: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export const LEADERBOARD: StudentLeaderboardEntry[] = [
  {
    rank: 1,
    id: "stu-lead-01",
    name: "Vikramaditya Rao",
    department: "Electrical & Computer Eng",
    institution: "IISc Bangalore",
    score: 1140,
    badgesCount: 8,
  },
  {
    rank: 2,
    id: "stu-lead-02",
    name: "Ananya Sharma",
    department: "Data Science & AI",
    institution: "IIT Madras",
    score: 1020,
    badgesCount: 6,
  },
  {
    rank: 3,
    id: "usr-student-01",
    name: "Alex Rivera",
    department: "Computer Science",
    institution: "Stanford University",
    score: 940,
    badgesCount: 5,
    isCurrentUser: true,
  },
  {
    rank: 4,
    id: "stu-lead-03",
    name: "Pooja Hegde",
    department: "Civil & Environmental",
    institution: "NIT Surathkal",
    score: 890,
    badgesCount: 4,
  },
];

export interface StudentCreditHistoryItem {
  month: string;
  year: number;
  earned: number;
  spent?: number;
  source: string;
}

export const CREDIT_HISTORY: StudentCreditHistoryItem[] = [
  {
    month: "September",
    year: 2026,
    earned: 45,
    source: "Sensor Calibration & Validation",
  },
  {
    month: "August",
    year: 2026,
    earned: 60,
    source: "Lab Bench Testing Phase 1",
  },
  {
    month: "July",
    year: 2026,
    earned: 80,
    source: "SIH Prototype Presentation",
  },
  {
    month: "June",
    year: 2026,
    earned: 30,
    source: "Faculty Literature Survey Approval",
  },
];
