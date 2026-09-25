export type CreditTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface StudentProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  university: string;
  department: string;
  yearOfStudy: string;
  rollNumber: string;
  email: string;
  mobileNumber: string;
  nssMember: boolean;
  nssDetails?: string;
  nccMember: boolean;
  nccDetails?: string;
  bio?: string;
}

export interface CreditScoreData {
  currentScore: number;
  currentLevel: CreditTier;
  nextLevel: CreditTier;
  nextLevelThreshold: number;
  creditsRemaining: number;
  percentileRank: number; // e.g. top 4%
  levelProgressPercentage: number;
}

export interface CreditActivity {
  id: string;
  name: string;
  category: 'Grievance & Verification' | 'Research & Innovation' | 'Community & NSS/NCC' | 'Competitions & Deployment';
  creditsEarned: number;
  maxCredits: number;
  completionPercentage: number;
  completedCount: number;
  iconName: string;
}

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  tier: CreditTier;
  earnedDate: string;
  iconName: string;
  unlocked: boolean;
  nextTierCriteria?: string;
}

export interface ProjectStatistics {
  completedProjects: number;
  ongoingProjects: number;
  pendingAssignments: number;
  hoursContributed: number;
  communitiesServed: number;
  certificatesEarned: number;
  researchPapers: number;
  patentsFiled: number;
  innovationAwards: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarText: string;
  department: string;
  year: string;
  university: string;
  creditScore: number;
  tier: CreditTier;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface StudentCertificate {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  credentialId: string;
  category: string;
  downloadUrl?: string;
}

export interface CreditHistoryMonth {
  month: string;
  credits: number;
  cumulative: number;
}
