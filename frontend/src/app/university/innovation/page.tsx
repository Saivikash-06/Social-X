'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Cpu,
  Trophy,
  Flame,
  ArrowLeft,
  ThumbsUp,
  Plus,
  Building,
  Target,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { Textarea } from '@/features/shared/components/ui/textarea';
import {
  useInnovationData,
  useUpvoteAIIdea,
  useSubmitAIIdea,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';

export default function UniversityInnovationPage() {
  const { role, user } = useUniversityStore();
  const { data: innovationData, isLoading } = useInnovationData();
  const upvoteMutation = useUpvoteAIIdea();
  const submitIdeaMutation = useSubmitAIIdea();

  const [activeTab, setActiveTab] = React.useState<
    'ideas' | 'prototypes' | 'hackathons' | 'challenges' | 'industry'
  >('ideas');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newDept, setNewDept] = React.useState('Computer Science');
  const [newImpact, setNewImpact] = React.useState('');

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Vote recorded for civic innovation idea!');
      },
    });
  };

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.error('Please enter a title and description.');
      return;
    }

    submitIdeaMutation.mutate(
      {
        title: newTitle,
        description: newDesc,
        submittedBy: user?.name || 'Academic Scholar',
        department: newDept,
        civicImpactScore: Number(newImpact) || 85,
        status: 'under_review',
        tags: ['CivicTech', 'AI-Governance', 'SmartCity'],
      },
      {
        onSuccess: () => {
          toast.success('Civic AI Idea submitted for faculty & municipal review!');
          setIsSubmitModalOpen(false);
          setNewTitle('');
          setNewDesc('');
          setNewImpact('');
        },
      }
    );
  };

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Lightbulb className="h-7 w-7 text-amber-500" />
            Civic Innovation & GovTech Incubator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Incubating student-faculty AI ideas, hackathons, municipal prototypes,
            and industry-sponsored smart city challenges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Pitch AI Innovation Idea
          </Button>
        </div>
      </div>

      {/* Innovation Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Institutional Innovation Score
            </span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">92 / 100</p>
          <span className="text-xs text-emerald-500 font-medium">
            Top 3% among Technical Universities
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Civic AI Concepts
            </span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {innovationData?.aiIdeas.length || 0}
          </p>
          <span className="text-xs text-muted-foreground font-medium">
            Active community upvoting
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Field Prototypes
            </span>
            <Cpu className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {innovationData?.prototypes.length || 0}
          </p>
          <span className="text-xs text-blue-500 font-medium">
            Deployed in city testbeds
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Hackathon Prize Bounty
            </span>
            <Trophy className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">₹ 15,00,000</p>
          <span className="text-xs text-purple-500 font-medium">
            Open government bounties
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'ideas'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Ideas ({innovationData?.ideas?.length || innovationData?.aiIdeas?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('prototypes')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'prototypes'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Cpu className="h-4 w-4" />
          Prototype Gallery ({innovationData?.prototypes?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('hackathons')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'hackathons'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Trophy className="h-4 w-4" />
          GovTech Hackathons ({innovationData?.hackathons?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'challenges'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Target className="h-4 w-4" />
          Government Challenges ({innovationData?.challenges?.length || innovationData?.governmentChallenges?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('industry')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'industry'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Building className="h-4 w-4" />
          Industry Collaborations ({innovationData?.partners?.length || innovationData?.industryPartners?.length || 0})
        </button>
      </div>

      {/* TAB 1: AI IDEAS */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(innovationData?.ideas || innovationData?.aiIdeas || []).map((idea: any) => (
              <div
                key={idea.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {idea.department}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Impact Score: {idea.civicImpactScore || 85}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {idea.description || idea.problemStatement}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(idea.tags || []).map((t: string) => (
                      <span
                        key={t}
                        className="text-[11px] bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Submitted by{' '}
                    <strong className="text-foreground">{idea.submittedBy}</strong>
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleUpvote(idea.id, e)}
                    className="gap-1.5 text-xs hover:border-amber-500 hover:text-amber-500"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-amber-500" />
                    <span>{idea.votes}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROTOTYPES */}
      {activeTab === 'prototypes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(innovationData?.prototypes || []).map((proto) => (
            <div
              key={proto.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    TRL Level {proto.trlLevel || 5}
                  </Badge>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold capitalize ${
                      proto.patentStatus === 'filed'
                        ? 'bg-purple-500/10 text-purple-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Patent: {proto.patentStatus || 'Filed'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {proto.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {proto.description}
                </p>

                <div className="text-xs space-y-1 bg-muted/40 p-2.5 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead:</span>
                    <span className="font-semibold text-foreground">
                      {proto.teamLead || proto.leadFaculty || 'Lead Researcher'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Field Testbed:</span>
                    <span className="font-semibold text-foreground">
                      {proto.municipalDeployment || 'Smart City Testbed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Live in Municipal Sandbox
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() =>
                    toast.info(
                      `Telemetry stream for ${proto.title} opening in live visualizer.`
                    )
                  }
                >
                  Live Telemetry
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: HACKATHONS */}
      {activeTab === 'hackathons' && (
        <div className="space-y-4">
          {(innovationData?.hackathons || []).map((hack) => (
            <div
              key={hack.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                    {(hack.status || 'Active').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Deadline: {hack.deadline || '2026-11-30'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {hack.title}
                </h3>

                <p className="text-xs text-muted-foreground">
                  Organized by{' '}
                  <strong className="text-foreground">{hack.organizer || hack.event || 'MoHUA GovTech'}</strong>
                </p>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Prize Pool: {hack.prizePool || hack.award || '₹ 5,00,000'}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {hack.registeredTeams || 16} Campus Teams Registered
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() =>
                    toast.success(
                      `Your team has registered for "${hack.title}". Check email for access tokens.`
                    )
                  }
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Register Team
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GOVERNMENT CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(innovationData?.challenges || innovationData?.governmentChallenges || []).map((ch: any) => (
            <div
              key={ch.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {ch.department}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-500">
                    Grant: {ch.bounty || ch.grantBudget || '₹ 25,00,000'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {ch.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ch.problemStatement || ch.description}
                </p>

                <div className="text-xs flex items-center justify-between text-muted-foreground bg-muted/40 p-2.5 rounded-xl">
                  <span>Submissions: <strong>{ch.submissionsCount || ch.submissionCount || 0}</strong></span>
                  <span>Closes: <strong>{ch.closingDate || ch.deadline || '2026-12-01'}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  MoHUA Certified
                </span>
                <Button
                  size="sm"
                  variant="default"
                  className="text-xs gap-1.5"
                  onClick={() =>
                    toast.info(
                      `Submitting response dossier to ${ch.department} for "${ch.title}"`
                    )
                  }
                >
                  <Send className="h-3 w-3" />
                  Submit Solution
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: INDUSTRY COLLABORATIONS */}
      {activeTab === 'industry' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(innovationData?.partners || innovationData?.industryPartners || []).map((part: any) => (
            <div
              key={part.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    Industry Partner
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {part.activeProjects || 2} Live Pilots
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {part.name || part.companyName}
                </h3>

                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Focus Domain:</strong>{' '}
                  {part.focusArea || part.domain}
                </p>

                <div className="p-3 bg-muted/30 rounded-xl space-y-1 text-xs">
                  <span className="text-muted-foreground block text-[10px]">
                    Grants & Compute Sponsoring
                  </span>
                  <span className="font-bold text-foreground">
                    {part.sponsoredFunding || part.offering || 'Compute Credits & Grants'}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  toast.success(
                    `Inquiry sent to university technology transfer liaison for ${part.name}`
                  )
                }
              >
                Apply for Cloud Credits
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Submit AI Idea Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-foreground">
                  Pitch Civic AI Innovation
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Idea Title
                </label>
                <Input
                  placeholder="e.g., Streetlight Energy Saver with Edge Vision"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Department
                </label>
                <Input
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Description & Proposed Civic Impact
                </label>
                <Textarea
                  placeholder="Explain how this AI solution mitigates municipal challenges, improves efficiency, or reduces public expenditure..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  className="text-sm resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitIdeaMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {submitIdeaMutation.isPending
                    ? 'Submitting...'
                    : 'Submit for Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
