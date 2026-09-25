'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  ArrowLeft,
  Search,
  CheckCircle2,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  X,
  Briefcase,
  Layers,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  useUniversityTeams,
  useCreateTeam,
  useUniversityProjects,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { AcademicTeam } from '@/features/university/types';

export default function UniversityTeamsPage() {
  const { role, user } = useUniversityStore();
  const { data: teams = [], isLoading } = useUniversityTeams();
  const { data: projects = [] } = useUniversityProjects();
  const createTeamMutation = useCreateTeam();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDept, setSelectedDept] = React.useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // New team form state
  const [teamName, setTeamName] = React.useState('');
  const [leaderName, setLeaderName] = React.useState('');
  const [department, setDepartment] = React.useState('Computer Science & Engineering');
  const [assignedProjId, setAssignedProjId] = React.useState('');
  const [memberInputs, setMemberInputs] = React.useState([
    { name: '', rollNumber: '', role: 'Research Lead' },
    { name: '', rollNumber: '', role: 'AI Model Engineer' },
  ]);

  const filteredTeams = teams.filter((t) => {
    const leader = t.leaderName || t.leader?.name || '';
    const projTitle = t.assignedProjectTitle || t.projectTitle || '';
    const dept = t.department || '';

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDept === 'all' ||
      dept.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const handleAddMemberField = () => {
    setMemberInputs((prev) => [
      ...prev,
      { name: '', rollNumber: '', role: 'Data Collector' },
    ]);
  };

  const handleMemberChange = (
    index: number,
    field: 'name' | 'rollNumber' | 'role',
    value: string
  ) => {
    setMemberInputs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveMemberField = (index: number) => {
    if (memberInputs.length <= 1) return;
    setMemberInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderName.trim()) {
      toast.error('Please specify a Team Name and Leader Name');
      return;
    }

    const assignedProj = projects.find((p) => p.id === assignedProjId);

    const members = memberInputs
      .filter((m) => m.name.trim().length > 0)
      .map((m, idx) => ({
        id: `stu-new-${idx}-${Date.now()}`,
        name: m.name,
        rollNumber: m.rollNumber || `CS-2025-${100 + idx}`,
        role: m.role,
        attendanceRate: 95,
        contributionScore: 90,
      }));

    if (members.length === 0) {
      members.push({
        id: `stu-lead-${Date.now()}`,
        name: leaderName,
        rollNumber: 'CS-2025-001',
        role: 'Team Lead',
        attendanceRate: 98,
        contributionScore: 95,
      });
    }

    createTeamMutation.mutate(
      {
        name: teamName,
        leaderId: `lead-${Date.now()}`,
        leaderName,
        department,
        assignedProjectId: assignedProjId || 'p-01',
        assignedProjectTitle:
          assignedProj?.title || 'Civic Infrastructure Research Pilot',
        status: 'active',
        progress: 10,
        members,
      },
      {
        onSuccess: () => {
          toast.success(`Academic Team "${teamName}" registered successfully!`);
          setIsCreateModalOpen(false);
          setTeamName('');
          setLeaderName('');
          setAssignedProjId('');
        },
      }
    );
  };

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

  // For students, find the team they are in
  const myStudentTeam =
    role === 'student'
      ? teams.find(
          (t) => {
            const userName = user?.name?.toLowerCase() || '';
            if (!userName) return false;
            const leader = (t.leaderName || t.leader?.name || '').toLowerCase();
            return (
              leader.includes(userName) ||
              t.members.some((m) => m.name.toLowerCase().includes(userName))
            );
          }
        ) || teams[0]
      : null;

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary" />
            Academic Research Teams & Cohorts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-disciplinary student cohorts assigned to active municipal and
            governmental field projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'faculty' && (
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Form New Student Team
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Cohorts
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{teams.length}</p>
          <span className="text-xs text-emerald-500 font-medium">
            Active in current term
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Avg. Field Attendance
            </span>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">94.8%</p>
          <span className="text-xs text-blue-500 font-medium">
            Biometric & geo-verified
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Avg. Contribution Score
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">91 / 100</p>
          <span className="text-xs text-emerald-500 font-medium">
            Peer & mentor evaluated
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Municipal Deployment
            </span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">100%</p>
          <span className="text-xs text-purple-500 font-medium">
            All teams assigned to live pilots
          </span>
        </div>
      </div>

      {/* Student Banner if Student View */}
      {role === 'student' && myStudentTeam && (
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                My Assigned Cohort
              </span>
              <h2 className="text-xl font-bold text-foreground">
                {myStudentTeam.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Project:{' '}
                <strong className="text-foreground">
                  {myStudentTeam.assignedProjectTitle || myStudentTeam.projectTitle || 'Civic Research Pilot'}
                </strong>{' '}
                • Department: {myStudentTeam.department || 'Computer Science'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-xs"
                onClick={() =>
                  toast.success(
                    `Syncing team workspace chat for ${myStudentTeam.name}...`
                  )
                }
              >
                Team Workspace Chat
              </Button>
              <Button
                size="sm"
                className="gap-2 text-xs"
                onClick={() =>
                  toast.info(
                    `Next milestone sync scheduled with Faculty Guide: Tomorrow at 2:00 PM.`
                  )
                }
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule Sync
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-card/80 p-3 rounded-xl border border-border">
              <span className="text-[11px] text-muted-foreground block">
                Team Leader
              </span>
              <span className="font-semibold text-xs text-foreground">
                {myStudentTeam.leaderName || myStudentTeam.leader?.name || 'Alex Johnson'}
              </span>
            </div>
            <div className="bg-card/80 p-3 rounded-xl border border-border">
              <span className="text-[11px] text-muted-foreground block">
                Active Teammates
              </span>
              <span className="font-semibold text-xs text-foreground">
                {myStudentTeam.members.length} Members
              </span>
            </div>
            <div className="bg-card/80 p-3 rounded-xl border border-border">
              <span className="text-[11px] text-muted-foreground block">
                Project Milestone
              </span>
              <span className="font-semibold text-xs text-foreground">
                {myStudentTeam.progress ?? myStudentTeam.progressPercentage ?? 0}% Completed
              </span>
            </div>
            <div className="bg-card/80 p-3 rounded-xl border border-border">
              <span className="text-[11px] text-muted-foreground block">
                Cohort Status
              </span>
              <span className="font-semibold text-xs text-emerald-500 capitalize">
                {myStudentTeam.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams by name, leader, or assigned municipal project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'Computer', 'Civil', 'Electrical', 'Electronics'].map(
            (dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  selectedDept === dept
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {dept}
              </button>
            )
          )}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => {
          const leaderName = team.leaderName || team.leader?.name || 'Lead Scholar';
          const projectTitle = team.assignedProjectTitle || team.projectTitle || 'Civic Research Pilot';
          const dept = team.department || 'Engineering';
          const teamProgress = team.progress ?? team.progressPercentage ?? 0;

          return (
            <div
              key={team.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 flex flex-col justify-between"
            >
              {/* Team Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="secondary" className="text-xs mb-1.5">
                      {dept}
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground">
                      {team.name}
                    </h3>
                  </div>
                  <Badge
                    className={`text-xs capitalize font-semibold ${
                      team.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {team.status}
                  </Badge>
                </div>

                {/* Project Card */}
                <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs">
                  <span className="text-muted-foreground block text-[10px] font-medium uppercase tracking-wider">
                    Assigned Municipal Project
                  </span>
                  <p className="font-semibold text-foreground line-clamp-1">
                    {projectTitle}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">Cohort Progress:</span>
                    <span className="font-bold text-foreground">
                      {teamProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${teamProgress}%` }}
                    />
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Student Roster ({team.members.length})</span>
                    <span>Attendance / Contribution</span>
                  </div>

                  <div className="divide-y divide-border/60">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="py-2 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[11px]">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground flex items-center gap-1.5">
                              {member.name}
                              {member.name === leaderName && (
                                <span className="bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  Lead
                                </span>
                              )}
                            </p>
                            <span className="text-muted-foreground text-[11px]">
                              {member.rollNumber || 'CS-2025'} • {member.role || member.roleInProject || 'Researcher'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-semibold text-foreground block">
                            {member.attendanceRate ?? 95}% Att.
                          </span>
                          <span className="text-[11px] text-emerald-500">
                            {member.contributionScore ?? 90}/100 Contrib
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Faculty Guide: <strong className="text-foreground">Dr. Aris Thorne</strong>
              </span>

              <div className="flex items-center gap-2">
                {role === 'faculty' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() =>
                      toast.success(
                        `Performance evaluation report dispatched for team "${team.name}"`
                      )
                    }
                  >
                    Grade Contribution
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs gap-1"
                  onClick={() =>
                    toast.info(
                      `Field logs and daily activity reports for ${team.name}`
                    )
                  }
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  View Logs
                </Button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal: Create Team */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  Create Student Research Cohort
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Team Name
                </label>
                <Input
                  placeholder="e.g., Team UrbanFlow AI"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Team Leader Name
                  </label>
                  <Input
                    placeholder="e.g., Alex Johnson"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Department
                  </label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Assign to Municipal Project
                </label>
                <select
                  value={assignedProjId}
                  onChange={(e) => setAssignedProjId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a civic research project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Cohort Members
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddMemberField}
                    className="h-7 text-xs gap-1 text-primary"
                  >
                    <Plus className="h-3 w-3" />
                    Add Member
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {memberInputs.map((mem, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="Student Name"
                        value={mem.name}
                        onChange={(e) =>
                          handleMemberChange(idx, 'name', e.target.value)
                        }
                        className="text-xs flex-1"
                      />
                      <Input
                        placeholder="Roll No"
                        value={mem.rollNumber}
                        onChange={(e) =>
                          handleMemberChange(idx, 'rollNumber', e.target.value)
                        }
                        className="text-xs w-28"
                      />
                      <Input
                        placeholder="Role"
                        value={mem.role}
                        onChange={(e) =>
                          handleMemberChange(idx, 'role', e.target.value)
                        }
                        className="text-xs w-32"
                      />
                      {memberInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberField(idx)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createTeamMutation.isPending}
                >
                  {createTeamMutation.isPending
                    ? 'Creating...'
                    : 'Register Team'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
