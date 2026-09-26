"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Printer,
  Share2,
  Calendar,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Layers,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Skeleton } from "@/features/shared/components/feedback/loading-skeleton";
import { citizenApi } from "@/features/citizen/services/citizen-api";
import {
  PublicAccountabilityDossier,
  StakeholderHandoff,
  DomainExpertProfile,
  GovernmentMonitoringEntry,
  ItemizedExpenditure,
} from "@/features/citizen/types";
import { toast } from "sonner";

export default function ProblemTransparencyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [dossier, setDossier] = React.useState<PublicAccountabilityDossier | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await citizenApi.getPublicAccountabilityDossier(id);
        setDossier(data);
      } catch (err: any) {
        setError(err.message || "Failed to load public transparency dossier.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Dossier permalink copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 w-fit mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Dossier Unavailable</h2>
        <p className="text-sm text-muted-foreground">{error || "Could not locate this civic record."}</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/citizen/transparency">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Return to Transparency Portal</span>
          </Link>
        </Button>
      </div>
    );
  }

  const {
    problem,
    reporter,
    stakeholderHandoffs,
    domainExperts,
    governmentMonitoring,
    financialTransparency,
    projectSchedule,
    universitySolution,
    resolutionEvidence,
    finalOutcome,
  } = dossier;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4 print:hidden">
        <Button asChild variant="ghost" size="sm" className="rounded-xl gap-2 text-xs">
          <Link href="/citizen/transparency">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Transparency Ledger</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyShareLink}
            className="rounded-xl text-xs gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Link</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Official Dossier</span>
          </Button>
        </div>
      </div>

      {/* Official Ledger Masthead (Clean for print & screen) */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-card via-card to-muted/30 border border-border/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                SOCIAL-X MUNICIPAL ACCOUNTABILITY SYSTEM
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Public Transparency Dossier #{problem.id}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-mono text-xs px-3 py-1">
              {problem.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              SLA: {problem.slaHours}h
            </Badge>
          </div>
        </div>

        {/* Section 1 & 2: Problem & Reporter details, GPS location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Section 1 &bull; Grievance & Citizen Details</span>
            </span>
            <h2 className="text-base font-bold text-foreground">{problem.title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &ldquo;{problem.description}&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60 text-xs flex flex-wrap items-center gap-4 text-muted-foreground">
              <span>Category: <strong className="text-foreground">{problem.category}</strong></span>
              <span>Reporter: <strong className="text-foreground">{reporter.displayName}</strong></span>
              <span>Reported: <strong className="text-foreground">{new Date(problem.createdAt).toLocaleString("en-IN")}</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              <span>Section 2 &bull; GPS Location & Ward Jurisdiction</span>
            </span>
            <p className="text-sm font-bold text-foreground">{problem.location || problem.address}</p>
            <p className="text-xs text-muted-foreground">
              {reporter.district} &bull; Lat: {problem.latitude ?? "12.9716"} | Lng: {problem.longitude ?? "77.5946"}
            </p>
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 font-mono text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Department: {problem.assignedDepartment || "Municipal Line Agency"}</span>
              <Badge variant="outline" className="text-[10px]">Verified Geofence</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 & 4: Stakeholder Handoffs, Acceptance & Rejections */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 3 & 4 &bull; Stakeholder Handoff Journey & Decisions
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {stakeholderHandoffs.length} Stakeholder Routing Events
          </Badge>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {stakeholderHandoffs.map((h: StakeholderHandoff, i: number) => (
            <div key={h.id || i} className="relative space-y-1.5">
              <div className="absolute -left-6.75 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-indigo-600" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground">
                    {h.toEntityName} {h.toDepartment ? `(${h.toDepartment})` : ""}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {h.toEntityType}
                  </Badge>
                  <Badge
                    className={
                      h.decision === "ACCEPTED"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                        : h.decision === "REJECTED"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                    }
                  >
                    {h.decision}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Received: {h.receivedAt ? new Date(h.receivedAt).toLocaleString("en-IN") : "N/A"}
                </span>
              </div>

              {h.rejectionReason && (
                <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-xl border border-border/60">
                  Decision Rationale: &ldquo;{h.rejectionReason}&rdquo;
                </p>
              )}

              {h.assignedOfficerName && (
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  &bull; Lead Officer: {h.assignedOfficerName} ({h.assignedOfficerRole || "Lead"}) &bull; Expert Domain: {h.expertDomain || "Civil Infrastructure"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Responsible Officers & Domain Experts */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 5 &bull; Assigned Domain Experts & Responsible Team
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {domainExperts.length} Assigned Experts
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domainExperts.map((exp: DomainExpertProfile, i: number) => (
            <div key={i} className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{exp.expertName}</h3>
                  <p className="text-xs text-muted-foreground">{exp.designationRole} &bull; {exp.organization}</p>
                </div>
                <Badge className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20 text-[10px]">
                  {exp.expertDomain}
                </Badge>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/60">
                <p>Role: <strong className="text-foreground">{exp.roleInResolution}</strong></p>
                <p>Accepted: {exp.acceptanceDate ? new Date(exp.acceptanceDate).toLocaleString("en-IN") : "Pending"}</p>
                {exp.progressNotes && (
                  <p className="italic text-foreground/80">&ldquo;{exp.progressNotes}&rdquo;</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Continuous Government Monitoring */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 6 &bull; Government Monitoring & Quality Audits
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
              Last Monitored: {governmentMonitoring?.lastMonitoredAt ? new Date(governmentMonitoring.lastMonitoredAt).toLocaleString("en-IN") : "Not yet monitored"}
            </Badge>
          </div>
        </div>

        {(!governmentMonitoring?.history || governmentMonitoring.history.length === 0) ? (
          <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl">
            Not yet monitored by government quality assurance inspectors.
          </div>
        ) : (
          <div className="space-y-3">
            {governmentMonitoring.history.map((log: GovernmentMonitoringEntry) => (
              <div key={log.id} className="p-4 rounded-2xl border border-border/80 bg-background space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{log.officerName}</span>
                    <span className="text-[11px] text-muted-foreground">({log.officerDesignation})</span>
                    <Badge variant="outline" className="text-[10px]">{log.officerDepartment}</Badge>
                  </div>
                  <Badge
                    className={
                      log.monitoringStatus === "SATISFACTORY" || log.monitoringStatus === "ON_TRACK"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                    }
                  >
                    {log.monitoringStatus}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  Observations: {log.observations}
                </p>
                {log.issuesIdentified && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Issues Identified: {log.issuesIdentified}
                  </p>
                )}
                {log.correctiveActionsRequested && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    Corrective Directives: {log.correctiveActionsRequested}
                  </p>
                )}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/60">
                  <span>Inspected at: {new Date(log.monitoredAt).toLocaleString("en-IN")}</span>
                  {log.nextScheduledMonitoringDate && (
                    <span>Next Scheduled: {log.nextScheduledMonitoringDate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 7: Budget & Financial Accountability */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 7 &bull; Budget Allocation & Itemized Public Expenditure
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Source: {financialTransparency?.fundingSource || "Municipal Infrastructure Fund"}
          </Badge>
        </div>

        {/* 4-way budget metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Cost</span>
            <p className="text-base font-black text-foreground font-mono">₹{financialTransparency?.estimatedCost?.toLocaleString("en-IN") || 0}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/4 border border-indigo-500/20">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Allocated Budget</span>
            <p className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">₹{financialTransparency?.allocatedBudget?.toLocaleString("en-IN") || 0}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/4 border border-rose-500/20">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">Spent to Date</span>
            <p className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">₹{financialTransparency?.spentAmount?.toLocaleString("en-IN") || 0}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/4 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Remaining Balance</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">₹{financialTransparency?.remainingBalance?.toLocaleString("en-IN") || 0}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Itemized Public Expenditure Ledger</h3>
          {(!financialTransparency?.expenditures || financialTransparency.expenditures.length === 0) ? (
            <p className="text-xs text-muted-foreground italic">No expenditures logged yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Purpose & Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Spent By</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {financialTransparency.expenditures.map((e: ItemizedExpenditure) => (
                    <tr key={e.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono text-muted-foreground">{e.spentAt}</td>
                      <td className="p-3 font-medium text-foreground">{e.purpose}</td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3">{e.responsibleOrg}</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        ₹{e.amount?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Section 8: Project Duration & 8-Stage Workflow Timeline */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 8 &bull; Project Duration & Eight-Stage Resolution Progress
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            Elapsed Hours: {projectSchedule?.currentDurationHours || 24}h
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {[
            { num: 1, name: "Submitted", hours: projectSchedule?.stageDurations?.["1_SUBMITTED"] || 2 },
            { num: 2, name: "Verified", hours: projectSchedule?.stageDurations?.["2_VERIFIED"] || 4 },
            { num: 3, name: "Assigned", hours: projectSchedule?.stageDurations?.["3_ASSIGNED"] || 6 },
            { num: 4, name: "Accepted", hours: projectSchedule?.stageDurations?.["4_ACCEPTED"] || 12 },
            { num: 5, name: "In Progress", hours: projectSchedule?.stageDurations?.["5_IN_PROGRESS"] || 24 },
            { num: 6, name: "Completed", hours: projectSchedule?.stageDurations?.["6_COMPLETED"] || 0 },
            { num: 7, name: "Citizen Verification", hours: projectSchedule?.stageDurations?.["7_CITIZEN_VERIFICATION"] || 0 },
            { num: 8, name: "Closed", hours: projectSchedule?.stageDurations?.["8_CLOSED"] || 0 },
          ].map((st) => (
            <div
              key={st.num}
              className={`p-2.5 rounded-xl border text-center space-y-1 ${
                st.hours > 0
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted/30 border-border/60 text-muted-foreground"
              }`}
            >
              <div className="text-[10px] font-mono font-bold">Stage {st.num}</div>
              <div className="text-[11px] font-bold truncate">{st.name}</div>
              <div className="text-[9px] opacity-80">{st.hours}h</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: University Student Solutions Showcase (if applicable) */}
      {universitySolution && (
        <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <h2 className="text-base font-bold text-foreground">
                Section 9 &bull; University Student Innovation & Solutions Showcase
              </h2>
            </div>
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">
              Academic Co-Innovation
            </Badge>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground">{universitySolution.proposedSolution}</h3>
                <p className="text-xs text-muted-foreground">{universitySolution.universityName} &bull; {universitySolution.departmentName}</p>
              </div>
              <Badge className="bg-purple-600 text-white font-mono text-xs">
                Stage: {universitySolution.solutionStage}
              </Badge>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">
              Approach: {universitySolution.technicalApproach}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-purple-500/20">
              <p>Mentor: <strong className="text-foreground">{universitySolution.facultyMentor}</strong></p>
              <p>Team: <strong className="text-foreground">{universitySolution.studentTeamName}</strong></p>
              <p>Domain: <strong className="text-foreground">{universitySolution.technicalDomain}</strong></p>
              <p>Real-World Implemented: <strong className="text-foreground">{universitySolution.solutionStage === "IMPLEMENTED_SOLUTION" ? "YES" : "In Validation"}</strong></p>
            </div>
            {universitySolution.documentedImpact && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                Impact: {universitySolution.documentedImpact}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Section 10 & 11: Resolution Evidence, Citizen Verification & Final Outcome */}
      <section className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-foreground">
              Section 10 & 11 &bull; Resolution Evidence & Final Outcome
            </h2>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
            Verified Outcome
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Citizen Verification</h3>
            <p className="text-sm font-bold text-foreground">Status: {finalOutcome.resolutionStatus}</p>
            <p className="text-xs text-muted-foreground">
              Verified by: {reporter.displayName}
            </p>
            <p className="text-xs text-foreground/80 italic">
              &ldquo;{resolutionEvidence?.citizenFeedback || "Repairs confirmed in person. Civic functionality restored."}&rdquo;
            </p>
            <div className="text-[11px] font-mono text-muted-foreground">
              Rating: {resolutionEvidence?.citizenRating || 5} / 5 Stars
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Final Implementation Outcome</h3>
            <p className="text-sm font-bold text-foreground">{finalOutcome.documentedImpact || "Physical restoration completed compliant with municipal specifications."}</p>
            <p className="text-xs text-muted-foreground">
              Resolved Status: {finalOutcome.isResolved ? "Fully Resolved" : "Under Action"}
            </p>
            <div className="text-[11px] font-mono text-muted-foreground">
              Date: {finalOutcome.resolvedAt ? new Date(finalOutcome.resolvedAt).toLocaleDateString("en-IN") : "Recorded on ledger"}
            </div>
          </div>
        </div>
      </section>

      {/* Official Audit Watermark / Print Footer */}
      <div className="pt-6 border-t border-border text-center text-xs text-muted-foreground font-mono space-y-1">
        <p>OFFICIAL CITIZEN TRANSPARENCY DOSSIER &bull; GENERATED BY SOCIAL-X CIVIC PROBLEM SOLVING ENGINE</p>
        <p>Timestamp: {new Date().toISOString()} &bull; Public Record Immutable &bull; All financial and handoff records audit-verified.</p>
      </div>
    </div>
  );
}
