'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  ExternalLink,
  Quote,
  Filter,
  Check,
  Calendar,
  Sparkles,
  ArrowLeft,
  X,
  Award,
  DollarSign,
  Cpu,
  Layers,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  Building2,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  useResearchPapers,
  useUniversityProjects,
  useInnovationData,
} from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { ResearchPaper } from '@/features/university/types';

interface GrantItem {
  id: string;
  title: string;
  agency: string;
  amount: string;
  status: 'active' | 'approved' | 'under_review';
  pi: string;
  department: string;
  duration: string;
  utilization: number;
}

const MOCK_GRANTS: GrantItem[] = [
  {
    id: 'g-01',
    title: 'Autonomous Real-time Drainage Overflow AI Predictive Network',
    agency: 'Ministry of Housing & Urban Affairs (MoHUA)',
    amount: '₹ 45,00,000',
    status: 'active',
    pi: 'Dr. Aris Thorne (Faculty PI)',
    department: 'Civil & Computer Science',
    duration: '2025 - 2027',
    utilization: 68,
  },
  {
    id: 'g-02',
    title: 'Smart City High-Density Traffic Signal Optimization using Vision Transformers',
    agency: 'State Municipal Innovation Mission',
    amount: '₹ 28,50,000',
    status: 'approved',
    pi: 'Prof. Elena Rostova',
    department: 'AI & Data Science',
    duration: '2026 - 2027',
    utilization: 32,
  },
  {
    id: 'g-03',
    title: 'Civic Acoustic Sensor Array for Immediate Pothole & Road Decay Triangulation',
    agency: 'National Clean Energy & Infrastructure Council',
    amount: '₹ 36,00,000',
    status: 'under_review',
    pi: 'Dr. Rajesh Patel',
    department: 'Electronics & Mechatronics',
    duration: '2026 - 2028',
    utilization: 10,
  },
];

export default function UniversityResearchPage() {
  const { role } = useUniversityStore();
  const { data: papers = [], isLoading: isPapersLoading } = useResearchPapers();
  const { data: projects = [] } = useUniversityProjects();
  const { data: innovationData } = useInnovationData();

  const [activeTab, setActiveTab] = React.useState<
    'papers' | 'accepted' | 'grants' | 'prototypes'
  >('papers');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const [activeAbstractPaper, setActiveAbstractPaper] =
    React.useState<ResearchPaper | null>(null);

  // Filtered papers
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (paper.keywords || []).some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDomain =
      selectedDomain === 'all' ||
      (paper.keywords || []).some((k) =>
        k.toLowerCase().includes(selectedDomain.toLowerCase())
      );

    return matchesSearch && matchesDomain;
  });

  const handleDownload = (paper: ResearchPaper) => {
    toast.success(`Downloading PDF pre-print: "${paper.title}"`);
  };

  const handleCite = (paper: ResearchPaper) => {
    const citation = `${paper.authors.join(', ')} (${paper.publicationYear}). "${paper.title}". ${paper.journalOrConference}. DOI: ${paper.doi}`;
    navigator.clipboard.writeText(citation);
    toast.success('APA Citation copied to clipboard!');
  };

  const handleDownloadDataset = (title: string) => {
    toast.success(`Preparing CSV dataset download for "${title}"`);
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
            <BookOpen className="h-7 w-7 text-primary" />
            Academic Research & Publications Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Municipal field research, peer-reviewed open preprints, government
            R&D grants, and civic innovation patents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() =>
              toast.info(
                'Submission portal opens for the 2026 Smart Governance Academic Conclave.'
              )
            }
            className="gap-2"
          >
            <UploadCloud className="h-4 w-4" />
            Submit Research Preprint
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Publications
            </span>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {papers.length}
          </p>
          <span className="text-xs text-blue-500 font-medium">
            Peer-reviewed & indexed
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Accepted Projects
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {projects.length}
          </p>
          <span className="text-xs text-emerald-500 font-medium">
            Live municipal pilots
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              R&D Grants Total
            </span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">₹ 1.09 Cr</p>
          <span className="text-xs text-amber-500 font-medium">
            3 active funded grants
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Citations Generated
            </span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">1,482</p>
          <span className="text-xs text-purple-500 font-medium">
            Across 14 global journals
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'papers'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Research Papers & Preprints ({papers.length})
        </button>

        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'accepted'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          Accepted Research Projects ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('grants')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'grants'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Funding & Grants ({MOCK_GRANTS.length})
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
          Prototypes & Patents ({innovationData?.prototypes.length || 0})
        </button>
      </div>

      {/* TAB 1: RESEARCH PAPERS */}
      {activeTab === 'papers' && (
        <div className="space-y-6">
          {/* Search & Domain Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search research papers by keywords, title, author name, or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {['all', 'AI', 'Sensors', 'Water', 'Computer Vision'].map(
                (domain) => (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      selectedDomain === domain
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {domain}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {paper.journalOrConference}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {paper.publicationYear}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        DOI: {paper.doi}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveAbstractPaper(paper)}>
                      {paper.title}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Authors:
                      </span>{' '}
                      {paper.authors.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCite(paper)}
                      className="gap-1.5 text-xs"
                      title="Copy citation"
                    >
                      <Quote className="h-3.5 w-3.5" />
                      Cite
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDownload(paper)}
                      className="gap-1.5 text-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {paper.keywords?.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {paper.citationsCount || paper.citationCount || 0} Citations
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => setActiveAbstractPaper(paper)}
                      className="text-primary hover:underline font-medium"
                    >
                      Read Abstract & Dataset Info →
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPapers.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-base font-semibold text-foreground">
                  No research papers matched your search
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting keywords or clearing domain filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACCEPTED RESEARCH PROJECTS */}
      {activeTab === 'accepted' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Government Validated Civic Research Portfolios
                </h4>
                <p className="text-xs text-muted-foreground">
                  These academic projects have been formally accepted and verified
                  by municipal administrative authorities.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/university/projects">View Full Projects Ledger</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1.5">
                      {proj.category || proj.aiCategory || proj.department || 'Civic AI'}
                    </Badge>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">
                      {proj.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : proj.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {proj.description}
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Milestone Progress</span>
                    <span className="text-foreground">{proj.progress ?? proj.progressPercentage ?? 0}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress ?? proj.progressPercentage ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-xl">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Government Reference
                    </span>
                    <span className="font-semibold text-foreground truncate block">
                      {typeof proj.governmentReference === 'string'
                        ? proj.governmentReference
                        : proj.governmentReference?.department || proj.municipalDepartment || 'Civic Infrastructure'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Team Allocated
                    </span>
                    <span className="font-semibold text-foreground truncate block">
                      {proj.assignedTeam?.name || 'Assigned Cohort'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-primary">
                    +{proj.creditPoints || 4} Academic Credits
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleDownloadDataset(proj.title)}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Export Field Log
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FUNDING & GRANTS */}
      {activeTab === 'grants' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_GRANTS.map((grant) => (
              <div
                key={grant.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-xs capitalize font-semibold ${
                        grant.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : grant.status === 'approved'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {grant.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {grant.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {grant.title}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Sponsor:</span>{' '}
                    {grant.agency}
                  </p>

                  <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Grant Value:</span>
                      <span className="font-bold text-foreground">
                        {grant.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Lead Investigator:</span>
                      <span className="font-semibold text-foreground">
                        {grant.pi}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-semibold text-foreground">
                        {grant.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fund Utilization</span>
                    <span className="font-bold text-foreground">
                      {grant.utilization}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${grant.utilization}%` }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2"
                    onClick={() =>
                      toast.success(
                        `Expenditure statement for ${grant.title} sent to university finance office.`
                      )
                    }
                  >
                    View Fund Ledger & Vouchers
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROTOTYPES & PATENTS */}
      {activeTab === 'prototypes' && (
        <div className="space-y-6">
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
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
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
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-semibold text-foreground">
                        {proto.department || 'Engineering'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lead Inventor:</span>
                      <span className="font-semibold text-foreground">
                        {proto.teamLead || proto.leadFaculty || 'Lead Researcher'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Testbed:</span>
                      <span className="font-semibold text-foreground">
                        {proto.municipalDeployment || 'Smart City Testbed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Validated in Field
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      toast.info(
                        `Patent documentation dossier requested for ${proto.title}`
                      )
                    }
                  >
                    IP Dossier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abstract & Detail Dialog */}
      {activeAbstractPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="secondary" className="text-xs mb-1.5">
                  {activeAbstractPaper.journalOrConference} (
                  {activeAbstractPaper.publicationYear})
                </Badge>
                <h3 className="text-lg font-bold text-foreground">
                  {activeAbstractPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveAbstractPaper(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Authors:</strong>{' '}
                {activeAbstractPaper.authors.join(', ')}
              </p>
              <p>
                <strong className="text-foreground">Digital Object Identifier (DOI):</strong>{' '}
                <span className="font-mono text-primary">
                  {activeAbstractPaper.doi}
                </span>
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Abstract
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border">
                {activeAbstractPaper.abstract}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeAbstractPaper.keywords?.map((k) => (
                <span
                  key={k}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  #{k}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCite(activeAbstractPaper)}
              >
                Copy Citation
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownload(activeAbstractPaper)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
