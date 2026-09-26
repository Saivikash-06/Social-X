"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Coins,
  Sparkles,
  Calendar,
  Users,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Video,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Progress } from "@/features/shared/components/ui/progress";
import { Input } from "@/features/shared/components/ui/input";
import { useIndustryProject, useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { toast } from "sonner";

export default function IndustryProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const { data: project, isLoading } = useIndustryProject(id);
  const { toggleBookmark, user } = useIndustryStore();
  const { sponsorProjectMutation } = useIndustryQueries();

  // Discussion state
  const [discussionInput, setDiscussionInput] = React.useState("");
  const [discussionThread, setDiscussionThread] = React.useState([
    {
      id: "comm-1",
      sender: "Prof. Arisudan Sharma (Faculty PI)",
      role: "faculty",
      time: "2 days ago",
      text: "We finalized the ultrasonic sensor housing and confirmed waterproof sealing up to 10 meters depth.",
    },
    {
      id: "comm-2",
      sender: "Dr. Rajeshwar Kulkarni (Industry CSR)",
      role: "industry",
      time: "Yesterday",
      text: "The telemetry look solid. We are queuing the Milestone 2 tranche release upon BBMP road trenching clearance.",
    },
  ]);

  if (isLoading || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="text-xs text-muted-foreground">Loading comprehensive project dossier...</p>
      </div>
    );
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
    setDiscussionThread([
      ...discussionThread,
      {
        id: `comm-${Date.now()}`,
        sender: `${user?.name || "Corporate Lead"} (${user?.roleLabel || "Industry Lead"})`,
        role: "industry",
        time: "Just now",
        text: discussionInput.trim(),
      },
    ]);
    setDiscussionInput("");
    toast.success("Comment posted to academic discussion panel.");
  };

  const fundedPercent = Math.min(100, Math.round((project.fundedAmount / project.expectedBudget) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back Link & Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/industry/projects">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Available Projects</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBookmark(project.id)}
            className="rounded-xl text-xs gap-1.5"
          >
            {project.isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Bookmark</span>
              </>
            )}
          </Button>
          <Button asChild variant="gradient" size="sm" className="rounded-xl text-xs gap-1.5 shadow">
            <Link href={`/industry/funding?projectId=${project.id}`}>
              <Coins className="h-4 w-4" />
              <span>Sponsor Project</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning" className="px-3 py-1 text-xs font-semibold">
            {project.category}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs flex items-center gap-1 font-semibold">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{project.district}</span>
          </Badge>
          <Badge variant="info" className="px-3 py-1 text-xs font-semibold">
            {project.prototypeStage}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
            <GraduationCap className="h-4 w-4" />
            {project.university}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Assigned: {project.governmentDepartment}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Timeline: {project.timelineMonths} Months
          </span>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Media, AI Analysis, Milestones, Discussion */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement & Detailed Overview */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Problem Statement & Technological Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                <p className="font-bold text-foreground mb-1 text-sm">Core Municipal Challenge</p>
                <p>{project.problemDescription}</p>
              </div>

              <div>
                <p className="font-bold text-foreground mb-1 text-sm">Engineered Technological Intervention</p>
                <p>{project.detailedStatement}</p>
              </div>

              <div>
                <p className="font-bold text-foreground mb-1 text-sm">Expected Societal & Operational Outcome</p>
                <p>{project.expectedOutcome}</p>
              </div>

              <div className="pt-2">
                <p className="font-bold text-foreground mb-2 text-xs">Required Stack & Technology Components</p>
                <div className="flex flex-wrap gap-2">
                  {project.requiredTechnologies.map((t) => (
                    <Badge key={t} variant="secondary" className="px-2.5 py-1 text-xs rounded-xl font-medium">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Technical Feasibility & Patentability Analysis */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 via-card to-card border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>AI Technology Feasibility & Patentability Review</span>
                </CardTitle>
                <Badge variant="warning" className="text-[10px] font-bold">
                  {project.aiAnalysis.readinessLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5 text-xs">
              {/* Score Gauges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-muted/50 border border-border/60">
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {project.aiAnalysis.feasibilityScore}%
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">Feasibility Score</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/50 border border-border/60">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {project.aiAnalysis.societalImpactScore}%
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">Societal Impact</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/50 border border-border/60">
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {project.aiAnalysis.patentabilityScore}%
                  </p>
                  <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">Patentability Score</p>
                </div>
              </div>

              {/* Key Technical Risks */}
              <div className="space-y-2">
                <p className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Key Technical Risks Identified by AI Engine</span>
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc pl-5">
                  {project.aiAnalysis.keyRisks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>

              {/* Industrial Use-Cases */}
              <div className="space-y-2">
                <p className="font-bold text-foreground text-xs">Recommended Commercial & Industrial Spin-offs</p>
                <div className="flex flex-wrap gap-2">
                  {project.aiAnalysis.suggestedIndustrialApplications.map((app, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-muted border border-border/60 text-foreground font-medium text-[11px]">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media & Research Documentation Gallery */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Research Documentation & Media Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.mediaAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-2xl border border-border/70 bg-muted/30 flex items-center justify-between text-xs hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="p-2 rounded-xl bg-card border border-border/70 text-amber-500 shrink-0">
                        {asset.type === "video" ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{asset.title}</p>
                        <p className="text-[10px] text-muted-foreground">{asset.size || "1080p Visual"} • {asset.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl shrink-0" title="Inspect Asset">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones & Deliverables Timeline */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Project Milestones & Deliverables</CardTitle>
              <CardDescription className="text-xs">Escrow funding released upon verified completion of each phase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="relative space-y-1.5">
                    <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-amber-500" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-foreground text-sm">{milestone.title}</p>
                      <Badge
                        variant={milestone.status === "approved" ? "success" : milestone.status === "submitted" ? "warning" : "secondary"}
                        className="text-[10px] font-semibold"
                      >
                        {milestone.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>Target: {milestone.targetDate}</span>
                      <span>•</span>
                      <span className="font-bold text-foreground">Tranche: {milestone.fundingReleasePercentage}% of Grant</span>
                    </div>
                    {milestone.feedback && (
                      <p className="p-2 rounded-xl bg-muted/60 text-[11px] text-foreground font-medium mt-1">
                        Mentor Note: &quot;{milestone.feedback}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Discussion Panel */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Academic & Industry Discussion Panel</CardTitle>
              <CardDescription className="text-xs">Direct communication channel with PI and student research team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {discussionThread.map((comm) => (
                  <div key={comm.id} className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{comm.sender}</span>
                      <span className="text-[10px] text-muted-foreground">{comm.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{comm.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                <Input
                  value={discussionInput}
                  onChange={(e) => setDiscussionInput(e.target.value)}
                  placeholder="Type advice, milestone inquiry, or technical review note..."
                  className="rounded-2xl text-xs bg-muted/40 border-border/80"
                />
                <Button type="submit" variant="gradient" size="sm" className="rounded-2xl px-4 shrink-0 font-bold">
                  <Send className="h-3.5 w-3.5 mr-1" />
                  <span>Send</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Funding Status, Faculty Mentor, Student Team */}
        <div className="space-y-6">
          {/* Funding Card */}
          <Card className="border-border/80 bg-gradient-to-br from-amber-500/10 to-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>CSR Grant Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <p className="text-muted-foreground">Total Budget Required</p>
                <p className="text-3xl font-black text-foreground tracking-tight mt-0.5">
                  ₹{project.expectedBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Secured via CSR:</span>
                  <span className="font-bold text-foreground">₹{project.fundedAmount.toLocaleString()} ({fundedPercent}%)</span>
                </div>
                <Progress value={fundedPercent} className="h-2 rounded-full" />
              </div>

              <Button asChild variant="gradient" className="w-full rounded-2xl py-3 font-bold text-xs shadow">
                <Link href={`/industry/funding?projectId=${project.id}`}>
                  Pledge Tranche Funding
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Faculty Mentor */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                <span>Principal Investigator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <p className="font-bold text-foreground text-sm">{project.facultyLead.name}</p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">{project.facultyLead.designation}</p>
                <p className="text-muted-foreground">{project.facultyLead.department}</p>
                <p className="text-muted-foreground font-mono text-[11px] pt-1">{project.facultyLead.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Student Team */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-500" />
                <span>Research Fellows ({project.studentTeamSize})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {project.teamMembers.map((member) => (
                <div key={member.id} className="p-2.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{member.name}</p>
                    <p className="text-muted-foreground text-[11px]">{member.role} • {member.year}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
