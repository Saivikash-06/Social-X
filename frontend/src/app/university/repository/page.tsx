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
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useResearchPapers } from '@/features/university/hooks/use-university-queries';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { ResearchPaper } from '@/features/university/types';

export default function UniversityRepositoryPage() {
  const { role } = useUniversityStore();
  const { data: papers = [], isLoading } = useResearchPapers();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const [activeAbstractPaper, setActiveAbstractPaper] = React.useState<ResearchPaper | null>(null);

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.keywords || []).some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

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

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

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
            <BookOpen className="h-7 w-7 text-primary" />
            Social-X Research & Pre-Print Repository
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Peer-reviewed papers, municipal field evaluations, and open-source civic technology publications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            {papers.length} Indexed Academic Publications
          </span>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search papers by keywords, title, author name, or DOI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Fields' },
            { id: 'microgrid', label: 'Clean Energy' },
            { id: 'iot', label: 'IoT Sensors' },
            { id: 'urban', label: 'Urban Drainage' },
            { id: 'traffic', label: 'Smart Mobility' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedDomain(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedDomain === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-border bg-card/60 p-6"
            />
          ))}
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No papers match your search query. Try searching for "solar", "IoT", or "drainage".
        </div>
      ) : (
        <div className="space-y-5">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {paper.journalOrConference}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Year: {paper.publicationYear}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      DOI: {paper.doi}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {paper.title}
                  </h3>

                  <p className="text-xs font-medium text-muted-foreground">
                    Authors: {paper.authors.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {paper.citationsCount} Citations
                  </span>
                </div>
              </div>

              {/* Abstract preview */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {paper.abstract}
              </p>

              {/* Tags & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/80 pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(paper.keywords || []).map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {kw}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAbstractPaper(paper)}
                    className="text-xs gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Read Abstract
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCite(paper)}
                    className="text-xs gap-1.5"
                  >
                    <Quote className="h-3.5 w-3.5" />
                    Cite
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDownload(paper)}
                    className="text-xs gap-1.5 bg-primary hover:bg-primary/90"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Abstract Modal */}
      {activeAbstractPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3">
              <div>
                <span className="text-xs font-semibold text-primary">
                  {activeAbstractPaper.journalOrConference} ({activeAbstractPaper.publicationYear})
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {activeAbstractPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveAbstractPaper(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Authors
              </p>
              <p className="text-sm text-foreground">
                {activeAbstractPaper.authors.join(', ')}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Abstract & Methodology
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activeAbstractPaper.abstract}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/80 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCite(activeAbstractPaper)}
                className="text-xs gap-1.5"
              >
                <Quote className="h-3.5 w-3.5" />
                Copy Citation
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveAbstractPaper(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleDownload(activeAbstractPaper);
                    setActiveAbstractPaper(null);
                  }}
                  className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
