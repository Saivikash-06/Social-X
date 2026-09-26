"use client";

import * as React from "react";
import {
  BookOpen,
  Search,
  PlusCircle,
  Download,
  Share2,
  FileText,
  Award,
  ExternalLink,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { usePublications, useResearchQueries } from "@/features/research/hooks/use-research-queries";
import { Publication, PublicationType } from "@/features/research/types";
import { toast } from "sonner";

export default function ResearchPublicationsPage() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [selectedPub, setSelectedPub] = React.useState<Publication | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<PublicationType>("Research Paper");
  const [authors, setAuthors] = React.useState("");
  const [journalOrVenue, setJournalOrVenue] = React.useState("");
  const [year, setYear] = React.useState(2026);
  const [doi, setDoi] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [tags, setTags] = React.useState("");

  const { data: publications, isLoading } = usePublications({
    search: search || undefined,
    type: typeFilter,
  });

  const { uploadPublicationMutation } = useResearchQueries();

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadPublicationMutation.mutate(
      {
        title,
        type,
        authors: authors || "Dr. K. S. Ramanathan",
        journalOrVenue,
        year,
        doi: doi || undefined,
        abstract,
        tags: tags || "Urban, AI, Telemetry",
      },
      {
        onSuccess: () => {
          setIsUploadModalOpen(false);
          setTitle("");
          setAbstract("");
        },
      }
    );
  };

  const handleShare = (p: Publication) => {
    toast.success(`Shareable academic citation link copied for "${p.title}"`);
  };

  const handleDownload = (p: Publication) => {
    toast.success(`Downloading verified pre-print PDF for "${p.title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>Publications & Intellectual Property Repository</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Peer-reviewed journal publications, IEEE conference proceedings, white papers, and licensed municipal patents
          </p>
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Upload New Publication / Patent</span>
        </Button>
      </div>

      {/* Filter / Search */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by paper title, authors, DOI, or keywords..."
              className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {["all", "Research Paper", "Conference Paper", "Patent", "Technical Report"].map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(t)}
                className={`rounded-xl text-xs font-semibold ${
                  typeFilter === t ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""
                }`}
              >
                {t === "all" ? "All Formats" : t}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Publications Grid */}
      <div className="space-y-4">
        {(publications || []).map((pub) => (
          <Card key={pub.id} className="rounded-3xl border-border/80 bg-card p-5 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={pub.type === "Patent" ? "warning" : "default"}
                    className="text-[10px] font-bold"
                  >
                    {pub.type === "Patent" ? <Award className="h-3 w-3 mr-1" /> : null}
                    {pub.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {pub.year}
                  </Badge>
                  <Badge variant="success" className="text-[10px]">
                    {pub.status}
                  </Badge>
                </div>
                {pub.doi && (
                  <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                    DOI: {pub.doi}
                  </span>
                )}
                {pub.patentNumber && (
                  <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                    Patent: {pub.patentNumber}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground leading-snug hover:text-indigo-600 transition-colors">
                  {pub.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Authors: <strong>{pub.authors.join(", ")}</strong> • <em>{pub.journalOrVenue}</em>
                </p>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {pub.abstract}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {pub.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span><strong>{pub.citationsCount}</strong> Citations</span>
                <span><strong>{pub.downloadCount}</strong> Downloads</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPub(pub)}
                  className="rounded-xl text-xs gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(pub)}
                  className="rounded-xl text-xs gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(pub)}
                  className="rounded-xl text-xs p-2.5"
                  title="Copy Citation"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedPub} onOpenChange={(open) => !open && setSelectedPub(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <Badge className="w-fit text-[10px]">{selectedPub?.type}</Badge>
            <DialogTitle className="text-xl font-bold">{selectedPub?.title}</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedPub?.authors.join(", ")} • {selectedPub?.journalOrVenue} ({selectedPub?.year})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground">Abstract:</span>
              <p className="text-muted-foreground leading-relaxed">{selectedPub?.abstract}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedPub?.doi && <div><strong>DOI Identifier:</strong> {selectedPub.doi}</div>}
              {selectedPub?.patentNumber && <div><strong>Patent Grant No:</strong> {selectedPub.patentNumber}</div>}
              <div><strong>Status:</strong> {selectedPub?.status}</div>
              <div><strong>Citations:</strong> {selectedPub?.citationsCount} indexed citations</div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedPub(null)} className="rounded-xl">
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedPub) handleDownload(selectedPub);
              }}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download Publication Dossier</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Upload Publication or Patent</DialogTitle>
            <DialogDescription className="text-xs">
              Index your laboratory's intellectual property into the civic knowledgebase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acoustic Wavelet Packet Transform for Pipeline Leaks"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Publication Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-muted/30 p-2 text-xs"
                >
                  <option value="Research Paper">Research Paper</option>
                  <option value="Conference Paper">Conference Paper</option>
                  <option value="Patent">Patent</option>
                  <option value="Technical Report">Technical Report</option>
                  <option value="White Paper">White Paper</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Publication Year</label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-xl text-xs bg-muted/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Authors (Comma Separated)</label>
              <Input
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Dr. K. S. Ramanathan, Alex Rivera"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Journal, Conference or Patent Authority</label>
              <Input
                value={journalOrVenue}
                onChange={(e) => setJournalOrVenue(e.target.value)}
                placeholder="e.g. IEEE Transactions on Smart Cities / Indian Patent Office"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Abstract / Summary</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={3}
                required
                placeholder="Brief technical summary..."
                className="w-full rounded-2xl border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadPublicationMutation.isPending}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Index Publication
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
