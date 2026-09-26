'use client';

import * as React from 'react';
import {
  User,
  Sparkles,
  Trophy,
  Award,
  Layers,
  BarChart3,
  Calendar,
  Save,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/features/shared/components/ui/dialog';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_CREDIT_SCORE,
  CREDIT_ACTIVITIES,
  STUDENT_BADGES,
  PROJECT_STATISTICS,
  LEADERBOARD_ENTRIES,
  STUDENT_CERTIFICATES,
  CREDIT_MONTHLY_HISTORY,
} from '@/features/university/services/student-contribution-data';
import { StudentProfileData } from '@/features/university/types/student-contribution';

// Component imports
import { ProfileHeaderCard } from '@/features/university/components/student/profile/profile-header-card';
import { CreditScoreRadial } from '@/features/university/components/student/profile/credit-score-radial';
import { CreditBreakdownGrid } from '@/features/university/components/student/profile/credit-breakdown-grid';
import { BadgesShowcase } from '@/features/university/components/student/profile/badges-showcase';
import { ProjectStatisticsGrid } from '@/features/university/components/student/profile/project-statistics-grid';
import { AchievementTimeline } from '@/features/university/components/student/profile/achievement-timeline';
import { LeaderboardTable } from '@/features/university/components/student/profile/leaderboard-table';
import { CertificatesGallery } from '@/features/university/components/student/profile/certificates-gallery';

export default function StudentProfilePage() {
  const { currentUser } = useUniversityStore();

  // Profile data initialized with mock service data, merging store user if present
  const [profile, setProfile] = React.useState<StudentProfileData>(() => ({
    ...INITIAL_STUDENT_PROFILE,
    name: currentUser?.name || INITIAL_STUDENT_PROFILE.name,
    department: currentUser?.department || INITIAL_STUDENT_PROFILE.department,
    university: currentUser?.institution || INITIAL_STUDENT_PROFILE.university,
    rollNumber: currentUser?.rollNumber || INITIAL_STUDENT_PROFILE.rollNumber,
    email: currentUser?.email || INITIAL_STUDENT_PROFILE.email,
  }));

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState<StudentProfileData>(profile);

  // Active section tab for navigation
  const [activeTab, setActiveTab] = React.useState<
    'all' | 'score' | 'breakdown' | 'badges' | 'stats' | 'leaderboard' | 'certificates' | 'timeline'
  >('all');

  const handleOpenEdit = () => {
    setEditForm(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditModalOpen(false);
    toast.success('Student contribution profile updated successfully.');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Profile Overview Header */}
      <ProfileHeaderCard
        profile={profile}
        creditScore={INITIAL_CREDIT_SCORE.currentScore}
        tier={INITIAL_CREDIT_SCORE.currentLevel}
        onEditToggle={handleOpenEdit}
      />

      {/* Quick Section Navigation Bar */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 bg-background/80 backdrop-blur-lg border-y border-border/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'Complete Profile' },
          { id: 'score', label: 'Credit Score Gauge' },
          { id: 'breakdown', label: '16 Activity Breakdown' },
          { id: 'badges', label: 'Badges & Tiers' },
          { id: 'stats', label: 'Project Statistics' },
          { id: 'leaderboard', label: 'Leaderboard' },
          { id: 'certificates', label: 'Certificates' },
          { id: 'timeline', label: 'Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Contribution Credit Score & Progression */}
      {(activeTab === 'all' || activeTab === 'score') && (
        <section id="score-section" className="space-y-4">
          <CreditScoreRadial
            scoreData={INITIAL_CREDIT_SCORE}
            history={CREDIT_MONTHLY_HISTORY}
          />
        </section>
      )}

      {/* 3. Credit Breakdown by Activity */}
      {(activeTab === 'all' || activeTab === 'breakdown') && (
        <section id="breakdown-section" className="space-y-4">
          <CreditBreakdownGrid activities={CREDIT_ACTIVITIES} />
        </section>
      )}

      {/* 4. Badges (Coding Platform Style) */}
      {(activeTab === 'all' || activeTab === 'badges') && (
        <section id="badges-section" className="space-y-4">
          <BadgesShowcase badges={STUDENT_BADGES} />
        </section>
      )}

      {/* 5. Project Statistics Grid */}
      {(activeTab === 'all' || activeTab === 'stats') && (
        <section id="stats-section" className="space-y-4">
          <ProjectStatisticsGrid stats={PROJECT_STATISTICS} />
        </section>
      )}

      {/* 6. University Rankings Leaderboard */}
      {(activeTab === 'all' || activeTab === 'leaderboard') && (
        <section id="leaderboard-section" className="space-y-4">
          <LeaderboardTable
            entries={LEADERBOARD_ENTRIES}
            currentUserId={profile.id}
          />
        </section>
      )}

      {/* 7. Certificates Gallery */}
      {(activeTab === 'all' || activeTab === 'certificates') && (
        <section id="certificates-section" className="space-y-4">
          <CertificatesGallery
            certificates={STUDENT_CERTIFICATES}
            studentName={profile.name}
          />
        </section>
      )}

      {/* 8. Achievement Timeline */}
      {(activeTab === 'all' || activeTab === 'timeline') && (
        <section id="timeline-section" className="space-y-4">
          <AchievementTimeline />
        </section>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              Edit Student Contribution Identity
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your contact details, academic standing, and civic participation credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Roll / Student ID
                </label>
                <Input
                  value={editForm.rollNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, rollNumber: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  University / Institute
                </label>
                <Input
                  value={editForm.university}
                  onChange={(e) =>
                    setEditForm({ ...editForm, university: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Department / Major
                </label>
                <Input
                  value={editForm.department}
                  onChange={(e) =>
                    setEditForm({ ...editForm, department: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Year of Study
                </label>
                <Input
                  value={editForm.yearOfStudy}
                  onChange={(e) =>
                    setEditForm({ ...editForm, yearOfStudy: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs"
                  placeholder="e.g. 3rd Year B.Tech"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Mobile Number
                </label>
                <Input
                  value={editForm.mobileNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobileNumber: e.target.value })
                  }
                  className="rounded-xl h-9 text-xs"
                  placeholder="+1 (650) 498-1002"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Bio / Research Interests
              </label>
              <textarea
                value={editForm.bio || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="Brief summary of societal innovations, lab focus, and projects..."
              />
            </div>

            {/* NSS Affiliation Settings */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.nssMember}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nssMember: e.target.checked })
                  }
                  className="rounded border-amber-500 text-amber-600 focus:ring-amber-500"
                />
                National Service Scheme (NSS) Member
              </label>
              {editForm.nssMember && (
                <Input
                  value={editForm.nssDetails || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nssDetails: e.target.value })
                  }
                  placeholder="NSS Wing / Role (e.g. Lead Volunteer, Environmental Cell)"
                  className="rounded-xl h-8 text-xs bg-card"
                />
              )}
            </div>

            {/* NCC Affiliation Settings */}
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.nccMember}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nccMember: e.target.checked })
                  }
                  className="rounded border-indigo-500 text-indigo-600 focus:ring-indigo-500"
                />
                National Cadet Corps (NCC) Member
              </label>
              {editForm.nccMember && (
                <Input
                  value={editForm.nccDetails || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nccDetails: e.target.value })
                  }
                  placeholder="NCC Cadet Rank / Battalion (e.g. Senior Under Officer - 2nd Signals)"
                  className="rounded-xl h-8 text-xs bg-card"
                />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-xs h-9 bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
