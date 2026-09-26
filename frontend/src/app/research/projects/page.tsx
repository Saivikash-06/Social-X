"use client";

import * as React from "react";
import {
  FolderKanban,
  Search,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Users,
  FileText,
  Upload,
  Share2,
  Send,
  PlusCircle,
  Clock,
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
import { useResearchProjects, useResearchQueries } from "@/features/research/hooks/use-research-queries";
import { ResearchProject } from "@/features/research/types";
import { toast } from "sonner";

export default function ResearchProjectsPage() {
  const { data: projects, isLoading } = useResearchProjects();
  const { joinProjectMutation, submitFindingsMutation } = useResearchQueries();

  const [search, setSearch] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState<ResearchProject | null>(null);
  const [findingsModalProject, setFindingsModalProject] = React.useState<ResearchProject | null>(null);

  const [findingTitle, setFindingTitle] = React.useState("");
  const [findingSummary, setFindingSummary] = React.useState("");
  const [methodologyNotes, setMethodologyNotes] = React.useState("");
  const [recommendations, setRecommendations] = React.useState("");

  const filtered = (projects || []).filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.researchDomain.toLowerCase().includes(search.toLowerCase()) ||
      p.problemStatement.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = (projectId: string) => {
    joinProjectMutation.mutate(projectId);
  };

  const handleShare = (title: string) => {
    toast.success(`Shareable DOI research link generated for "${title}"`);
  };

  const handleSubmitFindings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findingsModalProject) return;
    submitFindingsMutation.mutate(
      {
        projectId: findingsModalProject.id,
        findingTitle,
        summary: findingSummary,
        methodologyNotes,
        recommendationToGovt: recommendations,
      },
      {
        onSuccess: () => {
          setFindingsModalProject(null);
          setFindingTitle("");
          setFindingSummary("");
          setMethodologyNotes("");
          setRecommendations("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <FolderKanban className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>Applied Research & Laboratory Projects</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Interdisciplinary scientific initiatives with verified deliverables and civic policy recommendations
          </p>
        </div>
      </div>

      {/* Filter / Search */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, domain (Hydrology, Vision AI, Biochar), problem statement..."
            className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
          />
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        {filtered.map((proj) => (
          <Card key={proj.id} className="rounded-3xl border-border/80 bg-card shadow-sm hover:border-indigo-500/50 transition-all overflow-hidden">
            <CardContent className="p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[10px]">
                      {proj.researchDomain}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {proj.status}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-bold text-foreground leading-snug">{proj.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Principal Investigator: <strong>{proj.leadScientist}</strong> • Grant: <strong>{proj.funding}</strong> ({proj.fundingAgency})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground font-semibold">Progress</p>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{proj.progress}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              {/* Problem Statement */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <span className="font-bold text-foreground">Problem Statement:</span>
                <p className="text-muted-foreground leading-relaxed">{proj.problemStatement}</p>
              </div>

              {/* Objectives */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground">Key Research Objectives:</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {proj.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 bg-muted/20 p-2 rounded-xl border border-border/60">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collaborators & Timeline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">Partner Entities:</span>
                  {proj.collaborators.map((c) => (
                    <Badge key={c.id} variant="secondary" className="text-[10px]">
                      {c.name} ({c.type})
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Timeline: {proj.timeline}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJoin(proj.id)}
                    className="rounded-xl text-xs"
                  >
                    Join Research Consortium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFindingsModalProject(proj)}
                    className="rounded-xl text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30 font-bold"
                  >
                    Submit Findings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success("File uploader launched for project reports.")}
                    className="rounded-xl text-xs gap-1"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Reports</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(proj.title)}
                  className="rounded-xl text-xs gap-1"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Results</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Findings Modal */}
      <Dialog open={!!findingsModalProject} onOpenChange={(open) => !open && setFindingsModalProject(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Transmit Research Findings to Line Department</DialogTitle>
            <DialogDescription className="text-xs">
              Project: <strong className="text-foreground">{findingsModalProject?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitFindings} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Findings Title</label>
              <Input
                value={findingTitle}
                onChange={(e) => setFindingTitle(e.target.value)}
                placeholder="e.g., Sub-meter acoustic telemetry pilot benchmark analysis"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Executive Summary</label>
              <textarea
                value={findingSummary}
                onChange={(e) => setFindingSummary(e.target.value)}
                rows={3}
                required
                placeholder="Summarize key empirical observations and validation metrics..."
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Methodology & Dataset Citation</label>
              <textarea
                value={methodologyNotes}
                onChange={(e) => setMethodologyNotes(e.target.value)}
                rows={2}
                required
                placeholder="Describe sensors used, sampling rate, error margin..."
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Recommendations for Municipal Action</label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                rows={2}
                required
                placeholder="Actionable steps for civic engineers and authorities..."
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setFindingsModalProject(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitFindingsMutation.isPending}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {submitFindingsMutation.isPending ? "Submitting..." : "Submit to Policy Repository"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
