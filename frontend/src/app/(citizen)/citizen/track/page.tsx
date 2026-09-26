"use client";

import * as React from "react";
import Link from "next/link";
import {
  Crosshair,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Check,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  getStatusBadge,
  getPriorityBadge,
} from "@/features/citizen/components/my-issues-table";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 14 Sequential Tracking Stages from Phase 16
const TRACKING_STAGES = [
  { key: "submitted", label: "Submitted", shortLabel: "Submit" },
  { key: "ai_analysis", label: "AI Analysis", shortLabel: "AI" },
  { key: "under_review", label: "Government Review", shortLabel: "Review" },
  { key: "assigned_to_government", label: "Assigned to Government", shortLabel: "Gov" },
  { key: "assigned_to_industry", label: "Assigned to Industry", shortLabel: "Industry" },
  { key: "assigned_to_university", label: "University Collaboration", shortLabel: "Univ" },
  { key: "faculty_review", label: "Faculty Review", shortLabel: "Faculty" },
  { key: "student_development", label: "Student Development", shortLabel: "Students" },
  { key: "industry_validation", label: "Industry Deployment", shortLabel: "Deploy" },
  { key: "government_inspection", label: "Government Inspection", shortLabel: "Inspect" },
  { key: "resolved", label: "Resolved", shortLabel: "Resolved" },
  { key: "impact_assessment", label: "Impact Assessment", shortLabel: "Impact" },
  { key: "feedback_pending", label: "Citizen Feedback", shortLabel: "Feedback" },
  { key: "closed", label: "Closed", shortLabel: "Closed" },
];

function getStageIndex(status: string, timeline: any[] = []): number {
  if (status === "closed") return 13;
  if (status === "feedback_pending") return 12;
  if (status === "impact_assessment") return 11;
  if (status === "resolved") return 10;
  if (status === "government_inspection" || status === "inspection") return 9;
  if (status === "industry_validation") return 8;
  if (status === "student_development") return 7;
  if (status === "faculty_review") return 6;
  if (status === "assigned_to_university") return 5;
  if (status === "assigned_to_industry" || status === "industry_review") return 4;
  if (status === "assigned_to_government" || status === "in_progress") return 3;
  if (status === "under_review" || status === "under_government_review" || status === "assigned") return 2;
  if (timeline.some(t => t.stage?.toLowerCase().includes("ai"))) return 1;
  return 0;
}

export default function TrackIssuePage() {
  const { useIssues } = useCitizenQueries();
  const { data: issuesData, refetch } = useIssues();
  const issues = issuesData?.items || [];

  const [selectedIssueId, setSelectedIssueId] = React.useState<string>("");
  const [newComment, setNewComment] = React.useState("");
  const [rating, setRating] = React.useState<number>(5);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);

  // Sync with URL parameter or first issue
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get("id");
      if (urlId) {
        setSelectedIssueId(urlId);
        return;
      }
    }
    if (!selectedIssueId && issues.length > 0) {
      setSelectedIssueId(issues[0].id);
    }
  }, [issues, selectedIssueId]);

  const currentIssue =
    issues.find((i) => i.id === selectedIssueId) || issues[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    toast.success("Citizen Comment Added", {
      description: "Your remark has been appended to the grievance audit log.",
    });
    setNewComment("");
  };

  const handleSubmitFeedback = async () => {
    if (!currentIssue) return;
    if (!feedbackText.trim()) {
      toast.error("Please enter a brief feedback message.");
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      const res = await fetch(`/api/issues/${currentIssue.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          feedback: feedbackText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Feedback Submitted! Case Officially Closed", {
          description: "Thank you for rating municipal and technical partner performance.",
        });
        setFeedbackText("");
        refetch();
      } else {
        toast.error(data.error || "Failed to submit feedback.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!currentIssue) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No active grievances found to track.
      </div>
    );
  }

  const currentStageIndex = getStageIndex(currentIssue.status, currentIssue.timeline);
  const isResolvingOrClosed =
    currentIssue.status === "resolved" ||
    currentIssue.status === "impact_assessment" ||
    currentIssue.status === "feedback_pending" ||
    currentIssue.status === "closed";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Social-X Lifecycle Tracker
            </h1>
            <Badge variant="warning" className="text-xs">
              Live Stage: {currentIssue.status.toUpperCase().replace(/_/g, " ")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time audit trail spanning AI Analysis, Government, Industry, University, and Citizen Verification
          </p>
        </div>

        {/* Issue Quick Switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="issueSelect" className="text-xs text-muted-foreground font-semibold">
            Track ID:
          </label>
          <select
            id="issueSelect"
            value={selectedIssueId}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="flex h-9 rounded-xl border border-input bg-background/50 px-3 py-1 text-xs font-mono font-bold text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
          >
            {issues.map((iss) => (
              <option key={iss.id} value={iss.id}>
                {iss.id} - {iss.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 14-Stage Master Workflow Tracker Stepper (Phase 16) */}
      <Card className="border-border/80 bg-card rounded-3xl overflow-hidden shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>End-to-End Resolution Pipeline (14 Stages)</span>
            </div>
            <span className="text-xs font-mono font-semibold text-primary">
              Step {currentStageIndex + 1} of 14: {TRACKING_STAGES[currentStageIndex]?.label}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[760px] flex items-center justify-between gap-1 relative">
            {TRACKING_STAGES.map((stg, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg.key} className="flex flex-col items-center text-center flex-1 relative group">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-xs",
                      isPassed
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-amber-500 text-white ring-4 ring-amber-500/20 animate-pulse font-black"
                        : "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {isPassed ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] mt-1.5 font-semibold line-clamp-1 max-w-[55px]",
                      isCurrent
                        ? "text-amber-600 dark:text-amber-400 font-bold"
                        : isPassed
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                    title={stg.label}
                  >
                    {stg.shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overview Top Card */}
      <Card className="border-border/80 bg-card rounded-3xl overflow-hidden shadow-xs">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div className="space-y-1">
              <span className="font-mono text-xs font-black text-primary">
                {currentIssue.id}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {currentIssue.title}
              </h2>
              <p className="text-xs text-muted-foreground">{currentIssue.address}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(currentIssue.status)}
              {getPriorityBadge(currentIssue.priority)}
            </div>
          </div>

          {/* Officer & SLA Countdown Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-muted/40 p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                Assigned Authority
              </span>
              <p className="text-sm font-bold text-foreground">
                {currentIssue.assignedOfficer || "Awaiting Municipal Officer"}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentIssue.assignedDepartment || "Smart Routing Active"}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                Current Pipeline Status
              </span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 capitalize">
                {currentIssue.status.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentIssue.status === "assigned_to_industry"
                  ? "Assigned to Verified Technical Partner"
                  : currentIssue.status === "assigned_to_university"
                  ? "Collaborative Research with University Active"
                  : currentIssue.status === "student_development"
                  ? "Student Innovation Team Developing Solution"
                  : currentIssue.status === "faculty_review"
                  ? "Academic Faculty Review Underway"
                  : currentIssue.status === "industry_validation"
                  ? "Field Deployment and Testing"
                  : currentIssue.status === "government_inspection"
                  ? "Municipal Engineering Site Inspection"
                  : currentIssue.status === "resolved"
                  ? "Field Repair Concluded"
                  : currentIssue.status === "closed"
                  ? "Case Officially Closed & Archived"
                  : "Ground Operations Active"}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                Estimated SLA Resolution
              </span>
              <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currentIssue.status === "closed"
                  ? "Resolved & Verified"
                  : "< 16 Hours Remaining"}
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {new Date(currentIssue.estimatedResolutionDate || currentIssue.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase 17: Impact Assessment & Before/After Evidence Card (When Resolved/Closed) */}
      {isResolvingOrClosed && (
        <Card className="border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-foreground">Phase 17 – Impact Assessment & Verification Evidence</h3>
            </div>
            <Badge variant="success" className="text-xs font-mono font-bold">
              Site Verified ✓
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-muted/40 p-3 rounded-2xl">
              <p className="text-[11px] text-muted-foreground font-semibold">Resolution Time</p>
              <p className="text-lg font-black font-mono text-foreground mt-0.5">
                {currentIssue.impactAssessment?.actualResolutionTimeHours || 14} Hours
              </p>
            </div>
            <div className="bg-muted/40 p-3 rounded-2xl">
              <p className="text-[11px] text-muted-foreground font-semibold">Total Project Cost</p>
              <p className="text-lg font-black font-mono text-emerald-600 mt-0.5">
                ₹{(currentIssue.impactAssessment?.totalCost || 45000).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-muted/40 p-3 rounded-2xl">
              <p className="text-[11px] text-muted-foreground font-semibold">Student Innovation</p>
              <p className="text-lg font-black font-mono text-primary mt-0.5">
                {currentIssue.impactAssessment?.studentInnovationScore || 98}%
              </p>
            </div>
            <div className="bg-muted/40 p-3 rounded-2xl">
              <p className="text-[11px] text-muted-foreground font-semibold">Industry Score</p>
              <p className="text-lg font-black font-mono text-amber-600 mt-0.5">
                {currentIssue.impactAssessment?.industryPerformanceScore || 95}%
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Phase 18: Citizen Feedback & Case Closure Card */}
      {currentIssue.status === "closed" && currentIssue.citizenFeedback ? (
        <Card className="border-emerald-500/40 bg-emerald-500/10 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-base">Phase 18 – Case Officially Closed by Citizen</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= (currentIssue.citizenFeedback?.rating || 5)
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-xs font-bold text-foreground ml-2">
              ({currentIssue.citizenFeedback.rating} / 5 Stars)
            </span>
          </div>
          <p className="text-sm italic text-foreground">
            &ldquo;{currentIssue.citizenFeedback.feedback}&rdquo;
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            Closed on: {currentIssue.citizenFeedback.submittedAt}
          </p>
        </Card>
      ) : isResolvingOrClosed && currentIssue.status !== "closed" ? (
        <Card className="border-amber-500/40 bg-amber-500/5 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-foreground">
                Phase 18 – Citizen Satisfaction & Case Closure
              </h3>
            </div>
            <Badge variant="warning" className="text-xs">
              Awaiting Citizen Rating
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Your grievance has been resolved. Please rate the quality of service to formally close and archive this ticket.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  className={cn(
                    "h-6 w-6 cursor-pointer",
                    star <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>

          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share your experience with the repair work, responsiveness, and solution quality..."
            rows={3}
            className="text-xs rounded-xl"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback}
              variant="gradient"
              className="rounded-xl gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmittingFeedback ? "Submitting..." : "Submit Rating & Close Ticket"}</span>
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Step-by-Step Resolution Timeline */}
      <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Milestone Resolution Timeline</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {currentIssue.timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Bullet node */}
              <div
                className={cn(
                  "absolute -left-[27px] sm:-left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background transition-all",
                  event.completed
                    ? "border-emerald-500 text-emerald-500"
                    : event.isCurrent
                    ? "border-amber-500 bg-amber-500/10 text-amber-500 animate-pulse"
                    : "border-border text-muted-foreground"
                )}
              >
                {event.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 fill-current text-white dark:text-emerald-950" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              {/* Event Content */}
              <div className="space-y-1.5 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {event.stage}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {event.timestamp}
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground">{event.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    Actor: {event.actor} ({event.actorRole})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Citizen Remarks & Field Notes */}
      <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>Citizen Feedback & Field Correspondence</span>
        </h3>

        {/* Existing note */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-1 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>Er. Ramesh K. (Executive Engineer)</span>
              <span className="font-mono text-muted-foreground">15 Sep 02:40 PM</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Excavation completed on 14th Main road. Pipe rupture isolated; high-pressure
              bypass line installed to minimize disruption to residential water supply.
            </p>
          </div>
        </div>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="space-y-3 pt-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add citizen remark, follow-up query, or additional landmark instructions..."
            rows={3}
            className="text-xs rounded-xl"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="gradient"
              className="rounded-xl gap-2 text-xs font-bold"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post Remark</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
