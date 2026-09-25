"use client";

import * as React from "react";
import {
  Building2,
  FileText,
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Layers,
  Send,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { toast } from "sonner";

export function GovernmentWorkOrdersPanel() {
  const [workOrders, setWorkOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Active Dialog States
  const [activeWo, setActiveWo] = React.useState<any>(null);
  const [actionType, setActionType] = React.useState<
    "clarification" | "plan" | "progress" | "completion" | "collaborate_university" | "validate_university" | null
  >(null);

  // Form Fields
  const [clarificationQuestion, setClarificationQuestion] = React.useState("");
  const [solutionApproach, setSolutionApproach] = React.useState("");
  const [progressPercent, setProgressPercent] = React.useState(65);
  const [progressDesc, setProgressDesc] = React.useState("");
  const [completionSummary, setCompletionSummary] = React.useState("");
  const [testResults, setTestResults] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // University Collaboration States
  const [aiRecs, setAiRecs] = React.useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = React.useState(false);
  const [selectedUnivId, setSelectedUnivId] = React.useState("univ-001");
  const [selectedDept, setSelectedDept] = React.useState("Artificial Intelligence");
  const [selectedFacultyId, setSelectedFacultyId] = React.useState("fac-001");
  const [grantAmount, setGrantAmount] = React.useState(120000);
  const [collabObjectives, setCollabObjectives] = React.useState("");
  const [activeCollab, setActiveCollab] = React.useState<any>(null);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/industry/work-orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setWorkOrders(json.items);
      }
    } catch (e) {
      console.warn("Failed to load work orders", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`/api/industry/work-orders/${id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Work Order formally accepted." }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to accept.");
      toast.success("Work Order Accepted", {
        description: "Municipal contract activated. Field mobilization underway.",
      });
      fetchWorkOrders();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/industry/work-orders/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Capacity allocated to other emergency municipal projects." }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to decline.");
      toast.success("Work Order Declined", {
        description: "Case returned to Government department for reallocation.",
      });
      fetchWorkOrders();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    }
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWo || !actionType) return;

    setSubmitting(true);
    try {
      let endpoint = "";
      let payload = {};

      if (actionType === "clarification") {
        endpoint = `/api/industry/work-orders/${activeWo.id}/clarification`;
        payload = { question: clarificationQuestion };
      } else if (actionType === "plan") {
        endpoint = `/api/industry/work-orders/${activeWo.id}/solution-plan`;
        payload = {
          technicalApproach: solutionApproach,
          milestones: [
            { title: "Site setup & containment", targetDate: "Day 1", percentage: 25 },
            { title: "Primary engineering replacement", targetDate: "Day 2", percentage: 60 },
            { title: "Testing & civil restoration", targetDate: "Day 3", percentage: 100 },
          ],
          equipmentDeployed: ["Industrial Excavator", "Pipeline Welder", "Testing Rig"],
        };
      } else if (actionType === "progress") {
        endpoint = `/api/industry/work-orders/${activeWo.id}/progress-report`;
        payload = {
          progressPercentage: Number(progressPercent),
          description: progressDesc,
          evidenceUrls: [
            "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
          ],
        };
      } else if (actionType === "completion") {
        endpoint = `/api/industry/work-orders/${activeWo.id}/completion-report`;
        payload = {
          completionSummary,
          testResults: testResults || "Pressure test and structural load check passed standard DIN/IS codes.",
          evidenceUrls: [
            "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
          ],
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Submission failed.");

      toast.success("Submission Successful", {
        description: json.message || "Updated on municipal portal.",
      });

      setActionType(null);
      setActiveWo(null);
      fetchWorkOrders();
    } catch (err: any) {
      toast.error("Submission Error", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUniversityCollab = async (wo: any) => {
    setActiveWo(wo);
    setActionType("collaborate_university");
    setCollabObjectives(`Conduct research and prototype innovative engineering solution for ${wo.issueTitle}.`);
    try {
      setLoadingRecs(true);
      const res = await fetch(`/api/industry/work-orders/${wo.id}/collaborate-university`);
      const json = await res.json();
      if (json.success && Array.isArray(json.recommendations)) {
        setAiRecs(json.recommendations);
        if (json.recommendations.length > 0) {
          const first = json.recommendations[0];
          setSelectedUnivId(first.university.id);
          if (first.recommendedDepartments?.length > 0) {
            setSelectedDept(first.recommendedDepartments[0]);
          }
          if (first.facultyMentors?.length > 0) {
            setSelectedFacultyId(first.facultyMentors[0].id);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch AI university recommendations", e);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleUniversityCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWo) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/industry/work-orders/${activeWo.id}/collaborate-university`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId: selectedUnivId,
          department: selectedDept,
          facultyId: selectedFacultyId,
          researchGrant: grantAmount,
          objectives: collabObjectives,
          requiredDeliverables: [
            "Technical Design Proposal",
            "Functional Hardware Prototype",
            "Laboratory Calibration Video & Report",
          ],
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to submit collaboration request.");
      toast.success("Collaboration Request Lodged", {
        description: json.message,
      });
      setActionType(null);
      setActiveWo(null);
      fetchWorkOrders();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenValidateSolution = async (wo: any) => {
    setActiveWo(wo);
    setActionType("validate_university");
    try {
      const res = await fetch(`/api/university/collaborations?workOrderId=${wo.id}`);
      const json = await res.json();
      if (json.success && json.collaborations?.length > 0) {
        setActiveCollab(json.collaborations[0]);
      }
    } catch (e) {
      console.warn("Failed to load collaboration data", e);
    }
  };

  const handleValidateSolutionSubmit = async (decision: "accepted" | "modifications_requested") => {
    if (!activeCollab) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/industry/collaborations/${activeCollab.id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industryId: activeCollab.industryId,
          decision,
          feedback: "Integrated with municipal equipment. Field tests confirm successful deployment.",
          deploymentEvidenceUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Validation failed.");
      toast.success(decision === "accepted" ? "Solution Validated & Deployed" : "Revisions Requested", {
        description: json.message,
      });
      setActionType(null);
      setActiveWo(null);
      setActiveCollab(null);
      fetchWorkOrders();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono mb-1">
            Government Contract Dispatch
          </Badge>
          <CardTitle className="text-xl font-black text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <span>Assigned Municipal Work Orders</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Directly assigned by Government Departments. Review specifications, lodge progress reports, and claim treasury disbursements.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchWorkOrders}
            className="rounded-xl text-xs font-semibold h-8"
          >
            Refresh Feed
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading assigned municipal contracts...
        </div>
      ) : workOrders.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-2xl">
          No government work orders currently dispatched to your account.
        </div>
      ) : (
        <div className="space-y-4">
          {workOrders.map((wo) => {
            const isCompleted = wo.status === "completed" || wo.status === "approved";
            const isSubmitted = wo.status === "submitted";
            const isAccepted = wo.status === "accepted" || wo.status === "in_progress";
            const isIssued = wo.status === "issued";

            return (
              <div
                key={wo.id}
                className="p-5 rounded-3xl border border-border/80 bg-card hover:border-indigo-500/40 transition-all space-y-4 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">
                        #{wo.id}
                      </span>
                      <Badge variant="outline" className="text-xs font-mono font-bold">
                        Linked Grievance: #{wo.issueId}
                      </Badge>
                      <Badge
                        className={`text-xs capitalize font-semibold ${
                          wo.status === "completed" || wo.status === "approved"
                            ? "bg-emerald-600 text-white"
                            : wo.status === "submitted"
                            ? "bg-amber-500 text-white"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {wo.status.replace("_", " ")}
                      </Badge>
                      {wo.payment?.status === "released" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                          Payment Released ({wo.payment.invoiceRef})
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {wo.issueTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{wo.location} &bull; {wo.department}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black font-mono text-foreground">
                      ₹{wo.budget?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Due: {new Date(wo.deadline).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Scope of Work */}
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Authorizing Officer Scope of Work:
                  </span>
                  <p className="text-foreground leading-relaxed">
                    {wo.scopeOfWork}
                  </p>
                </div>

                {/* Progress Bar (if in progress) */}
                {wo.progressReports?.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Reported Progress:</span>
                      <span className="font-mono text-indigo-600 font-bold">
                        {wo.progressReports[wo.progressReports.length - 1].progressPercentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{
                          width: `${wo.progressReports[wo.progressReports.length - 1].progressPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* University Collaboration Banner if Active */}
                {wo.collaborationId && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>University R&D Collaboration Active</span>
                          <Badge className="text-[10px] bg-indigo-500/15 text-indigo-600 border-indigo-500/30">
                            {wo.collaborationId}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Academic faculty mentor and student innovators developing prototype solution.
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleOpenValidateSolution(wo)}
                      className="rounded-xl h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Review University Solution</span>
                    </Button>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Officer: {wo.authorizingOfficer}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* If Issued: Accept or Reject */}
                    {isIssued && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(wo.id)}
                          className="rounded-xl h-8 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(wo.id)}
                          className="rounded-xl h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Accept Project</span>
                        </Button>
                      </>
                    )}

                    {/* If Accepted or In Progress */}
                    {isAccepted && !wo.collaborationId && (
                      <>
                        {/* OPTION 2: REQUIRE UNIVERSITY COLLABORATION */}
                        <Button
                          size="sm"
                          onClick={() => handleOpenUniversityCollab(wo)}
                          className="rounded-xl h-8 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-1.5 shadow-sm"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Collaborate with University</span>
                        </Button>

                        {/* OPTION 1: INDUSTRY CAN SOLVE INTERNALLY */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveWo(wo);
                            setActionType("clarification");
                          }}
                          className="rounded-xl h-8 text-xs font-semibold"
                        >
                          <HelpCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Clarification</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveWo(wo);
                            setSolutionApproach(
                              "Deploy localized hydraulic stopper, weld seamless replacement spool, and restore road surface under 6-bar pressure guarantee."
                            );
                            setActionType("plan");
                          }}
                          className="rounded-xl h-8 text-xs font-semibold"
                        >
                          <Layers className="h-3.5 w-3.5 mr-1" />
                          <span>Solution Plan</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveWo(wo);
                            setProgressDesc("Conducted trench excavation, welded replacement pipe segment.");
                            setActionType("progress");
                          }}
                          className="rounded-xl h-8 text-xs font-semibold"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1" />
                          <span>Progress</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveWo(wo);
                            setCompletionSummary(
                              "Complete physical replacement concluded. Hydrostatic test completed at 6.2 bar. Tarmac restored and traffic reopened."
                            );
                            setTestResults("Pressure test verified 6.2 bar. Zero leakage detected.");
                            setActionType("completion");
                          }}
                          className="rounded-xl h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Submit Completion</span>
                        </Button>
                      </>
                    )}

                    {/* If Submitted: Waiting for government inspection */}
                    {isSubmitted && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-3 py-1 font-mono">
                        Awaiting Government Site Inspection
                      </Badge>
                    )}

                    {/* If Completed */}
                    {isCompleted && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1 font-mono">
                        Inspected & Approved by Government
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DIALOG 1: Collaborate with University (AI Match + Selection) */}
      <Dialog
        open={actionType === "collaborate_university"}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setActiveWo(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-purple-600/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Collaborate with University & Faculty
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Leverage academic R&D, faculty mentorship, and student talent to design and prototype innovative solutions for Work Order #{activeWo?.id}.
            </DialogDescription>
          </DialogHeader>

          {loadingRecs ? (
            <div className="py-12 text-center text-xs text-muted-foreground animate-pulse space-y-2">
              <Sparkles className="h-6 w-6 text-purple-600 mx-auto animate-spin" />
              <p>Analyzing problem statement and generating AI recommendations for nearby universities...</p>
            </div>
          ) : (
            <form onSubmit={handleUniversityCollabSubmit} className="space-y-5 pt-2">
              {/* AI Recommended Institutions Card */}
              {aiRecs.length > 0 && (
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Recommended Academic Partners
                    </span>
                    <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600">
                      Ranked by Domain Match & NIRF
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aiRecs.map((rec: any) => {
                      const isSelected = selectedUnivId === rec.university.id;
                      return (
                        <div
                          key={rec.university.id}
                          onClick={() => {
                            setSelectedUnivId(rec.university.id);
                            if (rec.recommendedDepartments?.length > 0) {
                              setSelectedDept(rec.recommendedDepartments[0]);
                            }
                            if (rec.facultyMentors?.length > 0) {
                              setSelectedFacultyId(rec.facultyMentors[0].id);
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-purple-600/10 border-purple-600 shadow-sm"
                              : "border-border/60 hover:border-purple-500/40 bg-card"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-foreground line-clamp-1">{rec.university.name}</span>
                            <Badge className="text-[9px] bg-purple-500/20 text-purple-700 dark:text-purple-300 border-none">
                              {rec.score}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                            <span>NIRF #{rec.university.nirfRank}</span>
                            <span>&bull;</span>
                            <span>{rec.university.district}</span>
                            <span>&bull;</span>
                            <span>~{rec.estimatedCompletionWeeks}wks</span>
                          </div>
                          <div className="text-[10px] text-purple-600/90 dark:text-purple-400 mt-1 line-clamp-1">
                            Key: {rec.matchReasons?.[0] || "Specialized Lab"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selection Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="univ" className="text-xs font-semibold">
                    Target University
                  </Label>
                  <select
                    id="univ"
                    value={selectedUnivId}
                    onChange={(e) => setSelectedUnivId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-purple-600"
                  >
                    {aiRecs.map((r: any) => (
                      <option key={r.university.id} value={r.university.id}>
                        {r.university.name} ({r.university.city})
                      </option>
                    ))}
                    <option value="univ-001">IIT Madras (Chennai)</option>
                    <option value="univ-002">Anna University (Chennai)</option>
                    <option value="univ-003">PSG College of Technology (Coimbatore)</option>
                    <option value="univ-004">NIT Trichy (Tiruchirappalli)</option>
                    <option value="univ-005">Vellore Institute of Technology (Vellore)</option>
                    <option value="univ-006">Tamil Nadu Agricultural University (Coimbatore)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dept" className="text-xs font-semibold">
                    Academic Department
                  </Label>
                  <select
                    id="dept"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-purple-600"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Environmental Engineering">Environmental Engineering</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mentor" className="text-xs font-semibold">
                    Faculty Mentor
                  </Label>
                  <select
                    id="mentor"
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-purple-600"
                  >
                    <option value="fac-001">Dr. K. Ramanathan (Professor, Dept of AI & Robotics)</option>
                    <option value="fac-002">Dr. S. Anitha (Associate Professor, Environmental & Civil Eng)</option>
                    <option value="fac-003">Dr. R. Karthikeyan (Professor, Mechanical & Pipeline Dynamics)</option>
                    <option value="fac-004">Dr. P. Meenakshi (Professor, Smart Grid & Electronics)</option>
                    <option value="fac-005">Dr. V. Sundaram (Professor, Agricultural Technology & Sensors)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="grant" className="text-xs font-semibold">
                    Research & Prototyping Grant (₹)
                  </Label>
                  <Input
                    id="grant"
                    type="number"
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                    min={20000}
                    step={10000}
                    className="rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="objectives" className="text-xs font-semibold">
                  R&D Objectives & Innovation Scope
                </Label>
                <Textarea
                  id="objectives"
                  rows={2}
                  value={collabObjectives}
                  onChange={(e) => setCollabObjectives(e.target.value)}
                  className="rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground">Standard Deliverables Package:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Technical Research & Design Proposal</li>
                  <li>Functional Hardware/Software Prototype with Source Code/CAD</li>
                  <li>Faculty Endorsement & Laboratory Calibration Report</li>
                </ul>
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActionType(null);
                    setActiveWo(null);
                  }}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-1.5 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? "Sending..." : "Dispatch Collaboration Request"}</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Validate University Solution & Deploy */}
      <Dialog
        open={actionType === "validate_university"}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setActiveWo(null);
            setActiveCollab(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Validate University Innovation Solution
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Review deliverables from Faculty Mentor and Student Team for Work Order #{activeWo?.id}.
            </DialogDescription>
          </DialogHeader>

          {activeCollab ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Institution</span>
                  <div className="font-semibold text-foreground">{activeCollab.universityName}</div>
                  <div className="text-[11px] text-muted-foreground">{activeCollab.department}</div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Faculty Mentor</span>
                  <div className="font-semibold text-foreground">{activeCollab.facultyName}</div>
                  <div className="text-[11px] text-muted-foreground">{activeCollab.studentTeam?.teamName || "Assigned Student Team"}</div>
                </div>
              </div>

              {/* Prototype Details */}
              {activeCollab.prototype ? (
                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      Prototype Title: {activeCollab.prototype.title}
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px]">
                      Ready for Field Test
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/90">{activeCollab.prototype.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    {activeCollab.prototype.codeUrl && (
                      <a
                        href={activeCollab.prototype.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-[11px] font-semibold"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Source Code / CAD Repo</span>
                      </a>
                    )}
                    {activeCollab.prototype.reportUrl && (
                      <a
                        href={activeCollab.prototype.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-[11px] font-semibold"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Research Report</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed text-center text-xs text-muted-foreground">
                  Student prototype submission is still in progress. Once students submit their prototype and faculty endorses it, review details will display here.
                </div>
              )}

              {/* Faculty Review Feedback */}
              {activeCollab.facultyApproval && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      Faculty Mentor Endorsement
                    </span>
                    <span>Rating: {activeCollab.facultyApproval.rating}/5.0</span>
                  </div>
                  <p className="text-xs text-foreground/90">
                    &ldquo;{activeCollab.facultyApproval.feedback}&rdquo;
                  </p>
                </div>
              )}

              <DialogFooter className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActionType(null);
                    setActiveWo(null);
                    setActiveCollab(null);
                  }}
                  className="rounded-xl text-xs font-semibold"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleValidateSolutionSubmit("modifications_requested")}
                    disabled={submitting || !activeCollab.prototype}
                    className="rounded-xl text-xs font-semibold text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                  >
                    Request Modifications
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleValidateSolutionSubmit("accepted")}
                    disabled={submitting || !activeCollab.prototype}
                    className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{submitting ? "Deploying..." : "Accept Solution & Deploy"}</span>
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading collaboration specifications...
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Standard Sub-Action Dialog (Clarification, Plan, Progress, Completion) */}
      <Dialog
        open={["clarification", "plan", "progress", "completion"].includes(actionType || "")}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setActiveWo(null);
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-3xl p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              {actionType === "clarification" && "Request Government Technical Clarification"}
              {actionType === "plan" && "Submit Technical Solution Plan & Milestones"}
              {actionType === "progress" && "Submit Work Order Progress Report"}
              {actionType === "completion" && "Submit Final Completion Report & Test Evidence"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Work Order #{activeWo?.id} &bull; {activeWo?.department}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDialogSubmit} className="space-y-4 pt-2">
            {actionType === "clarification" && (
              <div className="space-y-1">
                <Label htmlFor="question" className="text-xs font-semibold">
                  Technical Clarification Question for Line Officer
                </Label>
                <Textarea
                  id="question"
                  rows={3}
                  value={clarificationQuestion}
                  onChange={(e) => setClarificationQuestion(e.target.value)}
                  placeholder="e.g., Please confirm the exact depth of underground high-voltage conduits..."
                  className="rounded-xl text-xs resize-none"
                  required
                />
              </div>
            )}

            {actionType === "plan" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="plan" className="text-xs font-semibold">
                    Technical Engineering Approach
                  </Label>
                  <Textarea
                    id="plan"
                    rows={3}
                    value={solutionApproach}
                    onChange={(e) => setSolutionApproach(e.target.value)}
                    className="rounded-xl text-xs resize-none"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Includes 3 automated milestones (Containment, Engineering Repair, Testing) and standard safety equipment deployment.
                </p>
              </div>
            )}

            {actionType === "progress" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="pct" className="text-xs font-semibold flex items-center justify-between">
                    <span>Work Completed Percentage</span>
                    <span className="font-mono text-indigo-600 font-bold">{progressPercent}%</span>
                  </Label>
                  <input
                    id="pct"
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="desc" className="text-xs font-semibold">
                    Field Progress Description
                  </Label>
                  <Textarea
                    id="desc"
                    rows={3}
                    value={progressDesc}
                    onChange={(e) => setProgressDesc(e.target.value)}
                    placeholder="Describe milestones achieved today..."
                    className="rounded-xl text-xs resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {actionType === "completion" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="summary" className="text-xs font-semibold">
                    Completion Executive Summary
                  </Label>
                  <Textarea
                    id="summary"
                    rows={3}
                    value={completionSummary}
                    onChange={(e) => setCompletionSummary(e.target.value)}
                    className="rounded-xl text-xs resize-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tests" className="text-xs font-semibold">
                    Quality Inspection Test Results & Certificates
                  </Label>
                  <Input
                    id="tests"
                    value={testResults}
                    onChange={(e) => setTestResults(e.target.value)}
                    placeholder="e.g., Hydrostatic pressure test passed at 6.2 bar"
                    className="rounded-xl text-xs"
                    required
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActionType(null);
                  setActiveWo(null);
                }}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? "Lodging..." : "Submit to Government"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
