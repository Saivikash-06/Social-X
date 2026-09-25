"use client";

import * as React from "react";
import {
  GraduationCap,
  Building2,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  Upload,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  IndianRupee,
  Layers,
  Code2,
  Calendar,
  AlertCircle,
  Send,
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

interface IndustryCollaborationsPanelProps {
  viewMode?: "faculty" | "student";
}

export function IndustryCollaborationsPanel({ viewMode = "faculty" }: IndustryCollaborationsPanelProps) {
  const [collaborations, setCollaborations] = React.useState<any[]>([]);
  const [certificates, setCertificates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Dialog states
  const [selectedCollab, setSelectedCollab] = React.useState<any>(null);
  const [actionDialog, setActionDialog] = React.useState<
    "assign_team" | "student_submit" | "faculty_review" | "certificates" | null
  >(null);

  // Form states
  const [selectedTeamId, setSelectedTeamId] = React.useState("team-001");
  const [solutionTitle, setSolutionTitle] = React.useState("");
  const [solutionSummary, setSolutionSummary] = React.useState("");
  const [prototypeUrl, setPrototypeUrl] = React.useState("");
  const [codeUrl, setCodeUrl] = React.useState("");
  const [facultyFeedback, setFacultyFeedback] = React.useState("");
  const [mentorRating, setMentorRating] = React.useState(5);
  const [submitting, setSubmitting] = React.useState(false);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/university/collaborations");
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        setCollaborations(json.items);
      }

      const certRes = await fetch("/api/university/certificates");
      const certJson = await certRes.json();
      if (certJson.success && Array.isArray(certJson.certificates)) {
        setCertificates(certJson.certificates);
      }
    } catch (e) {
      console.warn("Failed to load university collaborations", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCollaborations();
  }, []);

  // Faculty Actions
  const handleFacultyDecision = async (id: string, decision: "accept" | "reject") => {
    try {
      const res = await fetch(`/api/university/collaborations/${id}/faculty-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: "fac-001",
          decision,
          notes: decision === "accept" ? "Accepted for departmental student research sprint." : "Capacity exhausted.",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Decision failed.");
      toast.success(decision === "accept" ? "Collaboration Accepted" : "Collaboration Declined", {
        description: json.message,
      });
      fetchCollaborations();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.message });
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedCollab) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/university/collaborations/${selectedCollab.id}/assign-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: "fac-001",
          studentTeamId: selectedTeamId,
          milestones: [
            { title: "Literature & Sensor Survey", targetDays: 2, deliverable: "Technical proposal dossier" },
            { title: "Hardware/CAD Prototyping", targetDays: 4, deliverable: "Tested prototype rig" },
            { title: "Laboratory Calibration & Field Report", targetDays: 7, deliverable: "Validation data & test certificate" },
          ],
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to assign team.");
      toast.success("Student Team Assigned", {
        description: `Project handed over to student innovators. Milestones scheduled.`,
      });
      setActionDialog(null);
      fetchCollaborations();
    } catch (err: any) {
      toast.error("Assignment Failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStudentSubmit = async () => {
    if (!selectedCollab) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/university/collaborations/${selectedCollab.id}/submit-solution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedCollab.studentTeamId || "team-001",
          title: solutionTitle || "AI Edge Acoustic Sensor & Robotic Weld Sleeve",
          summary: solutionSummary || "Hardware prototype built using hydrophone acoustic array and calibrated on a 6-bar pipeline rig. Sub-meter leak detection achieved.",
          prototypeImages: [prototypeUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"],
          sourceCodeUrl: codeUrl || "https://github.com/social-x-innovations/aquasense-prototype",
          submittedBy: "Aditya Krishnan (Team Lead)",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Submission failed.");
      toast.success("Prototype & Blueprint Submitted", {
        description: "Your solution has been forwarded to your Faculty Mentor for review and endorsement.",
      });
      setActionDialog(null);
      fetchCollaborations();
    } catch (err: any) {
      toast.error("Submission Failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFacultyApprove = async (approved: boolean) => {
    if (!selectedCollab) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/university/collaborations/${selectedCollab.id}/faculty-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: "fac-001",
          approved,
          feedback: facultyFeedback || "Laboratory validation confirmed that prototype complies with municipal accuracy and structural integrity standards.",
          mentorRating,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Review failed.");
      toast.success(approved ? "Solution Endorsed for Industry" : "Revisions Requested", {
        description: json.message,
      });
      setActionDialog(null);
      fetchCollaborations();
    } catch (err: any) {
      toast.error("Review Failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-mono">New Request</Badge>;
      case "faculty_accepted":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-mono">Faculty Accepted</Badge>;
      case "student_assigned":
      case "in_development":
        return <Badge className="bg-purple-600 text-white font-mono">Student Development</Badge>;
      case "faculty_approved":
        return <Badge className="bg-indigo-600 text-white font-mono">Faculty Approved ➔ Industry Validation</Badge>;
      case "industry_validated":
      case "deployed":
        return <Badge className="bg-emerald-600 text-white font-mono">Industry Validated & Certified</Badge>;
      case "modifications_requested":
        return <Badge variant="warning">Modifications Requested</Badge>;
      case "faculty_rejected":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-primary/10 border border-purple-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Industry–University Innovation & Student Mentorship</span>
              <Badge className="bg-purple-600/10 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] uppercase font-mono">
                {viewMode === "faculty" ? "Faculty Hub" : "Student Innovators Hub"}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-world municipal challenges outsourced by Industry partners for academic research, prototyping, and mentorship.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActionDialog("certificates")}
            className="rounded-xl h-9 text-xs font-semibold gap-1.5 border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
          >
            <Award className="h-4 w-4" />
            <span>Awarded Certificates ({certificates.length})</span>
          </Button>
          <Button
            size="sm"
            onClick={fetchCollaborations}
            variant="outline"
            className="rounded-xl h-9 text-xs font-semibold"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Collaboration Cards List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading active industry research collaborations...
        </div>
      ) : collaborations.length === 0 ? (
        <Card className="rounded-3xl border-dashed p-8 text-center">
          <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-sm">No Active Collaboration Requests</p>
          <p className="text-xs text-muted-foreground mt-1">
            When Industry partners require specialized research and prototyping, requests will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {collaborations.map((collab) => {
            const isRequested = collab.status === "requested";
            const isAccepted = collab.status === "faculty_accepted";
            const isAssigned = collab.status === "student_assigned";
            const isInDev = collab.status === "in_development";
            const isFacultyApproved = collab.status === "faculty_approved";
            const isValidated = collab.status === "industry_validated" || collab.status === "deployed";

            return (
              <Card
                key={collab.id}
                className="rounded-3xl border border-border/80 hover:border-purple-500/40 transition-all shadow-sm overflow-hidden"
              >
                <CardHeader className="pb-3 bg-muted/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Badge variant="outline" className="font-mono text-xs font-bold px-2.5 py-0.5 border-purple-500/40 text-purple-700 dark:text-purple-300">
                        {collab.id}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {collab.industryName}
                      </span>
                      <span className="text-xs text-muted-foreground">➔</span>
                      <span className="text-xs font-bold text-foreground">
                        {collab.universityName} ({collab.department})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>Grant: ₹{collab.researchGrant?.toLocaleString("en-IN")}</span>
                      </Badge>
                      {getStatusBadge(collab.status)}
                    </div>
                  </div>

                  <CardTitle className="text-base font-bold tracking-tight text-foreground mt-2">
                    {collab.issueTitle}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Linked Work Order: <span className="font-mono font-semibold">{collab.workOrderId}</span> • Municipal Dept: {collab.governmentDepartment}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Objectives */}
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Research & Innovation Objectives:
                    </span>
                    <p className="text-foreground leading-relaxed">{collab.objectives}</p>
                  </div>

                  {/* Deliverables */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-muted-foreground font-semibold">Deliverables:</span>
                    {collab.requiredDeliverables?.map((del: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="rounded-lg text-[11px]">
                        {del}
                      </Badge>
                    ))}
                  </div>

                  {/* Student Team & Mentorship Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xs">
                    <div>
                      <span className="text-muted-foreground text-[10px] font-bold uppercase">Faculty Mentor:</span>
                      <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                        {collab.facultyName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[10px] font-bold uppercase">Assigned Student Team:</span>
                      <p className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                        {collab.studentTeamName || "Not assigned yet"}
                      </p>
                    </div>
                  </div>

                  {/* Solution Submission Details if available */}
                  {collab.solutionSubmission && (
                    <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          Student Prototype: {collab.solutionSubmission.title}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Submitted by {collab.solutionSubmission.submittedBy}
                        </span>
                      </div>
                      <p className="text-foreground text-xs leading-relaxed">
                        {collab.solutionSubmission.summary}
                      </p>
                      {collab.solutionSubmission.sourceCodeUrl && (
                        <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-blue-600">
                          <Code2 className="h-3.5 w-3.5" />
                          <a
                            href={collab.solutionSubmission.sourceCodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-blue-700"
                          >
                            View Prototype Source & CAD Blueprint
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Faculty Review Feedback if available */}
                  {collab.facultyReview && (
                    <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs space-y-1">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">
                        Faculty Mentor Endorsement (Rating: {collab.facultyReview.mentorRating}/5 ★):
                      </span>
                      <p className="text-foreground italic">"{collab.facultyReview.feedback}"</p>
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Deadline: {new Date(collab.deadline).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Faculty View Actions */}
                      {viewMode === "faculty" && (
                        <>
                          {isRequested && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFacultyDecision(collab.id, "reject")}
                                className="rounded-xl h-8 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 border-rose-500/30"
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleFacultyDecision(collab.id, "accept")}
                                className="rounded-xl h-8 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Accept Collaboration</span>
                              </Button>
                            </>
                          )}

                          {isAccepted && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCollab(collab);
                                setActionDialog("assign_team");
                              }}
                              className="rounded-xl h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span>Assign Student Team</span>
                            </Button>
                          )}

                          {(isInDev || isAssigned) && collab.solutionSubmission && !collab.facultyReview?.approved && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCollab(collab);
                                setActionDialog("faculty_review");
                              }}
                              className="rounded-xl h-8 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Review & Endorse Solution</span>
                            </Button>
                          )}
                        </>
                      )}

                      {/* Student View Actions */}
                      {viewMode === "student" && (
                        <>
                          {(isAssigned || isInDev) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCollab(collab);
                                setSolutionTitle(`Edge Prototype for ${collab.issueTitle}`);
                                setSolutionSummary("Constructed working hardware sensor array with acoustic frequency cross-correlation. Tested on 6 bar pressurized piping rig.");
                                setActionDialog("student_submit");
                              }}
                              className="rounded-xl h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              <span>Submit Prototype & Blueprint</span>
                            </Button>
                          )}
                        </>
                      )}

                      {isFacultyApproved && (
                        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-xs px-3 py-1 font-mono">
                          Forwarded to Industry for Field Validation
                        </Badge>
                      )}

                      {isValidated && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1 font-mono">
                          Industry Validated • 4 Credits Awarded
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* DIALOG 1: Faculty Assigns Student Team */}
      <Dialog
        open={actionDialog === "assign_team"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Assign Project to Student Team</span>
            </DialogTitle>
            <DialogDescription>
              Allocate this industry research sprint to a registered university student team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Select Student Innovation Team</Label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="team-001">Team AquaSense AI (Lead: Aditya Krishnan - 4 Members)</option>
                <option value="team-002">Team Trenchless Dynamics (Lead: R. Divya - 3 Members)</option>
                <option value="team-003">Team RoboWeld Solutions (Lead: S. Harish - 3 Members)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
              <span className="font-bold text-muted-foreground uppercase text-[10px]">
                Scheduled Academic Milestones:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Milestone 1 (Day 2): Literature & Sensor Survey</li>
                <li>Milestone 2 (Day 4): Hardware/CAD Prototyping</li>
                <li>Milestone 3 (Day 7): Laboratory Calibration & Field Report</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleAssignTeam}
              disabled={submitting}
              className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitting ? "Assigning..." : "Assign Team & Start Sprint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Students Submit Prototype & Code */}
      <Dialog
        open={actionDialog === "student_submit"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Submit Innovative Solution & Prototype</span>
            </DialogTitle>
            <DialogDescription>
              Upload laboratory blueprints, CAD models, source code, and calibration reports.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Innovation Title</Label>
              <Input
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                placeholder="e.g. Edge Acoustic Sonar Micro-Crack Localizer"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Technical Summary & Lab Results</Label>
              <Textarea
                rows={3}
                value={solutionSummary}
                onChange={(e) => setSolutionSummary(e.target.value)}
                placeholder="Detail technical approach, accuracy, frequency range, and tests conducted..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Prototype Image / Schematic URL</Label>
              <Input
                value={prototypeUrl}
                onChange={(e) => setPrototypeUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="rounded-xl font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Source Code / CAD Repository URL</Label>
              <Input
                value={codeUrl}
                onChange={(e) => setCodeUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleStudentSubmit}
              disabled={submitting}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? "Uploading..." : "Submit for Faculty Endorsement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Faculty Review & Endorse Solution */}
      <Dialog
        open={actionDialog === "faculty_review"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              <span>Faculty Mentor Review & Quality Endorsement</span>
            </DialogTitle>
            <DialogDescription>
              Evaluate the student prototype before formal submission to the Industry partner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Mentor Quality Rating (1 - 5)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    size="sm"
                    variant={mentorRating === star ? "default" : "outline"}
                    onClick={() => setMentorRating(star)}
                    className="rounded-xl h-8 w-10 font-bold"
                  >
                    {star}★
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Faculty Review Remarks</Label>
              <Textarea
                rows={3}
                value={facultyFeedback}
                onChange={(e) => setFacultyFeedback(e.target.value)}
                placeholder="Enter feedback on technical feasibility, patent check, and safety compliance..."
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleFacultyApprove(false)}
              className="rounded-xl text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
            >
              Request Changes
            </Button>
            <Button
              onClick={() => handleFacultyApprove(true)}
              disabled={submitting}
              className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white"
            >
              {submitting ? "Submitting..." : "Endorse & Forward to Industry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: Certificates Modal */}
      <Dialog
        open={actionDialog === "certificates"}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Academic Recognition Certificates & Innovation Credits</span>
            </DialogTitle>
            <DialogDescription>
              Government, Industry, and University co-certified credentials awarded for validated civic innovations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {certificates.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No certificates issued yet.</p>
            ) : (
              certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500 text-black font-mono font-bold text-[10px]">
                      {cert.certificateNumber}
                    </Badge>
                    <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                      +{cert.academicCreditsAwarded} Academic Credits
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{cert.recipientName}</h4>
                  <p className="text-xs text-muted-foreground">
                    Role: <span className="font-semibold uppercase text-foreground">{cert.recipientRole.replace("_", " ")}</span> • Project: {cert.projectTitle}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-amber-500/20">
                    <span>Issued by {cert.industryPartnerName} & {cert.universityName}</span>
                    <span className="font-mono text-[10px]">{cert.verificationHash}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setActionDialog(null)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
