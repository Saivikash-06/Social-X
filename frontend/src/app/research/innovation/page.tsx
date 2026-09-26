"use client";

import * as React from "react";
import {
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  IndianRupee,
  UserCheck,
  Building,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
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
import { useInnovationIdeas, useResearchQueries } from "@/features/research/hooks/use-research-queries";
import { toast } from "sonner";

export default function ResearchInnovationPage() {
  const { data: ideas, isLoading } = useInnovationIdeas();
  const { voteInnovationIdeaMutation, submitInnovationIdeaMutation } = useResearchQueries();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [trlFilter, setTrlFilter] = React.useState<number | "all">("all");

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Civic Hardware");
  const [trlLevel, setTrlLevel] = React.useState(4);
  const [fundingRequired, setFundingRequired] = React.useState("₹35 Lakhs");
  const [mentor, setMentor] = React.useState("Prof. K. Venkatesh");
  const [mentorAffiliation, setMentorAffiliation] = React.useState("IISc Bangalore");
  const [description, setDescription] = React.useState("");

  const filteredIdeas = (ideas || []).filter(
    (i) => trlFilter === "all" || i.trlLevel === trlFilter
  );

  const handleVote = (id: string) => {
    voteInnovationIdeaMutation.mutate(id);
  };

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    submitInnovationIdeaMutation.mutate(
      {
        title,
        category,
        trlLevel,
        fundingRequired,
        mentor,
        mentorAffiliation,
        description,
      },
      {
        onSuccess: () => {
          setIsSubmitModalOpen(false);
          setTitle("");
          setDescription("");
        },
      }
    );
  };

  const getTrlColor = (level: number) => {
    if (level <= 3) return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    if (level <= 6) return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>Open Innovation Lab (TRL 1–9)</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Incubate technology readiness level prototypes, crowdsource peer validation, and unlock civic seed funding
          </p>
        </div>
        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Propose Innovation Idea</span>
        </Button>
      </div>

      {/* TRL Stage Navigation Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-muted-foreground mr-1">Filter TRL:</span>
        <Button
          variant={trlFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTrlFilter("all")}
          className={`rounded-2xl text-xs ${trlFilter === "all" ? "bg-indigo-600 text-white" : ""}`}
        >
          All Stages
        </Button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
          <Button
            key={lvl}
            variant={trlFilter === lvl ? "default" : "outline"}
            size="sm"
            onClick={() => setTrlFilter(lvl)}
            className={`rounded-2xl text-xs ${trlFilter === lvl ? "bg-indigo-600 text-white" : ""}`}
          >
            TRL {lvl}
          </Button>
        ))}
      </div>

      {/* Ideas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="rounded-3xl border-border/80 bg-card hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              {/* Header: TRL & Category */}
              <div className="flex items-start justify-between gap-2">
                <Badge className={`text-[10px] font-bold ${getTrlColor(idea.trlLevel)}`}>
                  {idea.trlStageName}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {idea.category}
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground leading-snug">{idea.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Funding Required</span>
                  <span className="font-bold text-foreground">{idea.fundingRequired}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Funding Committed</span>
                  <span className="font-bold text-emerald-600">{idea.fundingCommitted}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground block">Mentor & Affiliation</span>
                  <span className="font-semibold text-foreground">
                    {idea.mentor} ({idea.mentorAffiliation})
                  </span>
                </div>
              </div>

              {/* Comments Preview */}
              {idea.comments.length > 0 && (
                <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 text-[11px]">
                    <MessageSquare className="h-3 w-3" />
                    <span>Peer Review Note:</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    "{idea.comments[0].content}" — <em>{idea.comments[0].authorName}</em>
                  </p>
                </div>
              )}

              {/* Footer: Vote Button & Counts */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-indigo-500" />
                    <strong>{idea.votes}</strong> Peer Votes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <strong>{idea.comments.length}</strong> Critiques
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleVote(idea.id)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Endorse / Vote</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Idea Dialog */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Propose Innovation Idea (TRL Track)</DialogTitle>
            <DialogDescription className="text-xs">
              List an applied civic innovation to attract academic co-investigators and corporate CSR seed grants.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitIdea} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Idea Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bio-Enzymatic Rapid Dissolution of Drain Fatbergs"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Category Domain</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl text-xs bg-muted/30"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Technology Readiness Level (1-9)</label>
                <select
                  value={trlLevel}
                  onChange={(e) => setTrlLevel(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-muted/30 p-2 text-xs"
                >
                  <option value={1}>TRL 1: Basic Principles Observed</option>
                  <option value={2}>TRL 2: Technology Concept Formulated</option>
                  <option value={3}>TRL 3: Analytical / Experimental Proof</option>
                  <option value={4}>TRL 4: Lab Prototype Validated</option>
                  <option value={5}>TRL 5: Technology Validated in Relevant Environment</option>
                  <option value={6}>TRL 6: Prototype Demonstrated in Civic Field</option>
                  <option value={7}>TRL 7: Integrated Pilot System Demonstrated</option>
                  <option value={8}>TRL 8: System Complete & Qualified</option>
                  <option value={9}>TRL 9: Commercial Deployment Proven</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Funding Required</label>
                <Input
                  value={fundingRequired}
                  onChange={(e) => setFundingRequired(e.target.value)}
                  className="rounded-xl text-xs bg-muted/30"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Faculty Mentor / PI</label>
                <Input
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="rounded-xl text-xs bg-muted/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Explain the technical novelty, chemical or algorithmic foundation, and civic relevance..."
                className="w-full rounded-2xl border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitInnovationIdeaMutation.isPending}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Publish to Innovation Lab
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
