"use client";

import * as React from "react";
import {
  X,
  Printer,
  Share2,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  User,
  GraduationCap,
  Layers,
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  Briefcase,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/features/shared/components/ui/dialog";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { PublicAccountabilityDossier } from "../../types";
import { toast } from "sonner";

interface PublicAccountabilityDossierModalProps {
  dossier: PublicAccountabilityDossier | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function PublicAccountabilityDossierModal({
  dossier,
  isOpen,
  onClose,
  isLoading = false,
}: PublicAccountabilityDossierModalProps) {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "journey" | "handoffs" | "monitoring" | "finance" | "university" | "schedule"
  >("overview");

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && dossier) {
      const url = `${window.location.origin}/citizen/transparency/${dossier.problem.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Public Report Link Copied", {
        description: "Direct link to this verified accountability report copied to clipboard.",
      });
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-5xl! w-[95vw] h-[92vh] max-h-[92vh] p-0 rounded-3xl overflow-hidden flex flex-col bg-background border-border/80 shadow-2xl print:max-w-none print:w-full print:h-auto print:border-none print:shadow-none"
        aria-describedby="transparency-dossier-description"
      >
        {/* Printable & Header Banner */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black uppercase px-2 py-0.5 rounded-md bg-white/20 text-white tracking-widest">
                SOCIAL-X TRANSPARENCY DOSSIER
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                Public Record Verified
              </Badge>
              {dossier?.audit?.auditStamp && (
                <span className="font-mono text-[10px] text-white/70">
                  {dossier.audit.auditStamp}
                </span>
              )}
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {dossier?.problem.title || "Civic Grievance Transparency Report"}
            </DialogTitle>
            <DialogDescription id="transparency-dossier-description" className="text-xs text-white/80 line-clamp-1">
              Case #{dossier?.problem.id} • {dossier?.problem.location || dossier?.problem.address}
            </DialogDescription>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-xl h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation Controls (Hidden in Print) */}
        <div className="bg-muted/40 border-b border-border/60 px-4 sm:px-6 py-2 flex items-center gap-1 overflow-x-auto print:hidden">
          {[
            { key: "overview", label: "Overview & Outcome" },
            { key: "journey", label: "8-Stage Journey" },
            { key: "handoffs", label: "Handoffs & Experts" },
            { key: "monitoring", label: "Government Monitoring" },
            { key: "finance", label: "Budget & Expenditures" },
            { key: "university", label: "Student Innovation" },
            { key: "schedule", label: "Schedule & Delays" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.key
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {isLoading || !dossier ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground font-medium">
                Compiling multi-stakeholder transparency ledger...
              </p>
            </div>
          ) : (
            <>
              {/* SECTION 1 & 2: PROBLEM AND REPORTER DETAILS + GPS */}
              {(activeTab === "overview" || activeTab === "journey") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Section 1 & 2: Civic Grievance & Public Reporter Details
                    </h4>
                    <span className="text-xs text-muted-foreground font-medium">
                      Public Identity Safe-Harbor Applied
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Citizen Reporter
                      </span>
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{dossier.reporter.displayName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ward: {dossier.reporter.district} • Identity verified by Aadhaar/Civic ID
                      </p>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0">
                        Public Display Approved
                      </Badge>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Submission Timestamp & Category
                      </span>
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span>
                          {new Date(dossier.problem.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Category: <strong className="text-foreground">{dossier.problem.category.replace(/_/g, " ")}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SLA Window: {dossier.problem.slaHours} hours (Due: {dossier.problem.slaDueAt ? new Date(dossier.problem.slaDueAt).toLocaleDateString("en-IN") : "Active"})
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        GPS Location & Jurisdiction
                      </span>
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="truncate">{dossier.problem.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        GPS: {dossier.problem.latitude || "12.9716"}° N, {dossier.problem.longitude || "77.5946"}° E
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 py-0">
                        Geo-Telemetry Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <span className="font-bold text-foreground">Full Problem Description:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      {dossier.problem.description}
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 6 & 8: 8-STAGE RESOLUTION JOURNEY TIMELINE */}
              {(activeTab === "overview" || activeTab === "journey") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Section 2: Complete Chronological Journey (8-Stage Workflow)
                    </h4>
                    <span className="text-xs font-semibold text-primary">
                      Status: {dossier.problem.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                    {dossier.timeline.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-6.75 top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-1.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {step.toState}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {step.timestamp}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="font-medium text-foreground">{step.actorRole}:</span>
                            <span>{step.remarks || "State transition recorded in municipal engine."}</span>
                          </div>
                          <Badge variant="secondary" className="text-[9px] py-0 px-2 rounded-md">
                            Trigger: {step.trigger}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3 & 4 & 5: STAKEHOLDER HANDOFFS, DECISIONS & DOMAIN EXPERTS */}
              {(activeTab === "overview" || activeTab === "handoffs") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Section 3, 4 & 5: Stakeholder Handoffs, Acceptance Decisions & Domain Experts
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {dossier.stakeholderHandoffs.length} Stakeholder Actions Logged
                    </span>
                  </div>

                  {/* Domain Experts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dossier.domainExperts.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-linear-to-br from-indigo-50/40 to-blue-50/20 dark:from-indigo-950/20 dark:to-blue-950/10 border border-indigo-200/40 dark:border-indigo-900/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            Domain Expert On Record
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0">
                            {exp.workStatus || "ACTIVE"}
                          </Badge>
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-bold text-foreground">{exp.expertName}</h5>
                          <p className="text-xs text-muted-foreground">{exp.designationRole} • {exp.organization}</p>
                        </div>
                        <div className="pt-2 border-t border-border/40 text-xs space-y-1">
                          <p className="text-foreground">
                            <strong>Specialized Domain:</strong> {exp.expertDomain}
                          </p>
                          <p className="text-muted-foreground text-[11px]">
                            <strong>Role in Resolution:</strong> {exp.roleInResolution}
                          </p>
                          {exp.progressNotes && (
                            <p className="text-muted-foreground text-[11px] italic bg-background/50 p-2 rounded-xl border border-border/30">
                              "{exp.progressNotes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chronological Handoffs Table */}
                  <div className="rounded-2xl border border-border/80 overflow-hidden shadow-xs">
                    <div className="p-3 bg-muted/40 border-b border-border/60 text-xs font-bold text-foreground">
                      Chronological Handoff Chain & Departmental Routing Decisions
                    </div>
                    <div className="divide-y divide-border/60">
                      {dossier.stakeholderHandoffs.map((h, idx) => (
                        <div key={idx} className="p-4 space-y-2 text-xs">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{h.fromEntityName}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-bold text-primary">{h.toEntityName}</span>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {h.toEntityType}
                              </Badge>
                            </div>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              Received: {h.receivedAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-medium text-muted-foreground">Decision:</span>
                            <Badge
                              className={`text-[10px] font-bold ${
                                h.decision === "ACCEPTED"
                                  ? "bg-emerald-500 text-white"
                                  : h.decision === "REJECTED"
                                  ? "bg-red-500 text-white"
                                  : "bg-amber-500 text-white"
                              }`}
                            >
                              {h.decision}
                            </Badge>
                            {h.decisionAt && (
                              <span className="text-[11px] text-muted-foreground">
                                Decided: {h.decisionAt}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground">
                              Mode: <strong>{h.collaborationMode}</strong>
                            </span>
                          </div>

                          {h.rejectionReason && (
                            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
                              <strong>Rejection Justification:</strong> {h.rejectionReason}
                            </div>
                          )}

                          {h.progressNotes && (
                            <p className="text-[11px] text-muted-foreground">
                              <strong>Progress Note:</strong> {h.progressNotes} (Progress: {h.currentProgressPct}%)
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: CONTINUOUS GOVERNMENT MONITORING */}
              {(activeTab === "overview" || activeTab === "monitoring") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Section 6: Continuous Government Monitoring & Audit Logs
                    </h4>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {dossier.governmentMonitoring.history.length} Inspections Documented
                    </span>
                  </div>

                  {/* Summary Banner */}
                  <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                        Latest Recorded Government Monitoring
                      </span>
                      <div className="text-sm font-black text-foreground mt-0.5">
                        {dossier.governmentMonitoring.lastMonitoredAt ? (
                          <span>
                            {new Date(dossier.governmentMonitoring.lastMonitoredAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(dossier.governmentMonitoring.lastMonitoredAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground">Not yet monitored</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Responsible Dept: {dossier.governmentMonitoring.responsibleDepartment}
                      </p>
                    </div>

                    <Badge
                      className={`text-xs font-bold px-3 py-1 ${
                        dossier.governmentMonitoring.isMonitored
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dossier.governmentMonitoring.currentMonitoringStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  {/* Chronological inspection logs */}
                  <div className="space-y-3">
                    {dossier.governmentMonitoring.history.map((mon, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2 text-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{mon.officerName}</span>
                            <span className="text-muted-foreground">({mon.officerDesignation})</span>
                          </div>
                          <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                            {mon.monitoredAt}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                          <span className="font-bold text-foreground text-[11px]">Field Observation:</span>
                          <p className="text-muted-foreground leading-relaxed">{mon.observations}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                          <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                            <strong>Identified Issues:</strong> {mon.issuesIdentified}
                          </div>
                          <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                            <strong>Corrective Actions:</strong> {mon.correctiveActionsRequested} ({mon.correctiveActionStatus})
                          </div>
                        </div>

                        {mon.nextScheduledMonitoringDate && (
                          <div className="text-[10px] text-muted-foreground italic flex items-center gap-1.5 pt-1">
                            <Clock className="h-3 w-3 text-emerald-500" />
                            <span>Next inspection scheduled for: {mon.nextScheduledMonitoringDate}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {dossier.governmentMonitoring.history.length === 0 && (
                      <div className="p-6 rounded-2xl bg-muted/20 border border-border/60 text-center text-xs text-muted-foreground italic">
                        Not yet monitored by government field vigilance officer.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 5: BUDGET ALLOCATION AND EXPENDITURE TRANSPARENCY */}
              {(activeTab === "overview" || activeTab === "finance") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-blue-600" />
                      Section 7: Budget Allocation & Itemized Expenditure Transparency
                    </h4>
                    <span className="text-xs text-muted-foreground font-semibold">
                      Funding Source: {dossier.financialTransparency.fundingSource}
                    </span>
                  </div>

                  {/* Financial KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Estimated Cost
                      </span>
                      <span className="text-base font-black text-foreground mt-0.5 block">
                        {formatCurrency(dossier.financialTransparency.estimatedCost)}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Allocated Budget
                      </span>
                      <span className="text-base font-black text-foreground mt-0.5 block">
                        {formatCurrency(dossier.financialTransparency.allocatedBudget)}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                      <span className="text-[10px] uppercase font-bold block">
                        Actual Spent to Date
                      </span>
                      <span className="text-base font-black mt-0.5 block">
                        {formatCurrency(dossier.financialTransparency.spentAmount)}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <span className="text-[10px] uppercase font-bold block">
                        Remaining Balance
                      </span>
                      <span className="text-base font-black mt-0.5 block">
                        {formatCurrency(dossier.financialTransparency.remainingBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Itemized Expenditures Table */}
                  <div className="rounded-2xl border border-border/80 overflow-hidden shadow-xs">
                    <div className="p-3 bg-muted/40 border-b border-border/60 text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Itemized Expenses & Verified Receipts</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Disbursed only against verified work orders & vouchers
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/20 border-b border-border/40 text-[10px] uppercase font-bold text-muted-foreground">
                          <tr>
                            <th className="p-3">Purpose & Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Responsible Org</th>
                            <th className="p-3">Voucher Ref</th>
                            <th className="p-3">Approved By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {dossier.financialTransparency.expenditures.map((e, idx) => (
                            <tr key={idx} className="hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-medium text-foreground">{e.purpose}</td>
                              <td className="p-3">
                                <Badge variant="secondary" className="text-[10px] py-0">
                                  {e.category}
                                </Badge>
                              </td>
                              <td className="p-3 font-bold text-blue-600 dark:text-blue-400 font-mono">
                                {formatCurrency(e.amount)}
                              </td>
                              <td className="p-3 text-muted-foreground">{e.responsibleOrg}</td>
                              <td className="p-3 font-mono text-muted-foreground text-[11px]">
                                {e.voucherRef}
                              </td>
                              <td className="p-3 text-foreground font-medium">{e.approvedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7: UNIVERSITY STUDENT SOLUTIONS SHOWCASE */}
              {(activeTab === "overview" || activeTab === "university") && dossier.universitySolution && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-purple-600 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Section 9: University Student Solutions & Research Innovations
                    </h4>
                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/20 font-bold">
                      {dossier.universitySolution.solutionStage.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <div className="p-5 rounded-2xl bg-linear-to-br from-purple-50/50 to-indigo-50/30 dark:from-purple-950/20 dark:to-indigo-950/10 border border-purple-200/50 dark:border-purple-900/50 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/40 pb-3">
                      <div>
                        <h5 className="text-base font-black text-foreground">
                          {dossier.universitySolution.studentTeamName}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {dossier.universitySolution.universityName} • {dossier.universitySolution.departmentName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Faculty Mentor
                        </span>
                        <span className="font-bold text-foreground">
                          {dossier.universitySolution.facultyMentor}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-foreground">Proposed Technical Solution:</strong>
                      <p className="text-muted-foreground leading-relaxed">
                        {dossier.universitySolution.proposedSolution}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-foreground">Technical Approach & Architecture:</strong>
                      <p className="text-muted-foreground leading-relaxed">
                        {dossier.universitySolution.technicalApproach}
                      </p>
                    </div>

                    {/* Student Team Roster */}
                    <div className="pt-2 border-t border-purple-200/40">
                      <span className="font-bold text-foreground block mb-1">Student Innovators Roster:</span>
                      <div className="flex flex-wrap gap-2">
                        {dossier.universitySolution.studentMembers.map((m, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs py-0.5 px-2.5 font-medium">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Milestones */}
                    {dossier.universitySolution.researchMilestones.length > 0 && (
                      <div className="pt-2 border-t border-purple-200/40 space-y-2">
                        <span className="font-bold text-foreground block">Research Milestones:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dossier.universitySolution.researchMilestones.map((m, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-background/60 border border-border/40 flex items-center justify-between text-[11px]">
                              <span>{m.milestone}</span>
                              <Badge
                                className={`text-[9px] py-0 ${
                                  m.status === "COMPLETED" ? "bg-emerald-500" : "bg-primary"
                                }`}
                              >
                                {m.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Impact Statement */}
                    {dossier.universitySolution.documentedImpact && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-0.5">
                        <strong className="block text-xs">Documented Real-World Impact:</strong>
                        <p className="text-xs">{dossier.universitySolution.documentedImpact}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 6 & 8: DURATION, DELAYS & STAGE-BY-STAGE TIME ANALYSIS */}
              {(activeTab === "overview" || activeTab === "schedule") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Section 8: Project Duration, Delays & Workflow Stage Durations
                    </h4>
                    <span className="text-xs font-bold text-foreground">
                      Total Active Time: {dossier.projectSchedule.currentDurationHours} Hours
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Submission
                      </span>
                      <span className="font-semibold text-foreground">
                        {dossier.projectSchedule.submissionDate}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Stakeholder Accepted
                      </span>
                      <span className="font-semibold text-foreground">
                        {dossier.projectSchedule.acceptedDate || "Pending"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Expected Delivery
                      </span>
                      <span className="font-semibold text-foreground">
                        {dossier.projectSchedule.expectedCompletionDate || "Standard SLA"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Actual Completion
                      </span>
                      <span className="font-semibold text-foreground">
                        {dossier.projectSchedule.actualCompletionDate || "Work In Progress"}
                      </span>
                    </div>
                  </div>

                  {/* Delays Table */}
                  {dossier.projectSchedule.delaysRecorded.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Documented Delays & Official Reasons:
                      </span>
                      {dossier.projectSchedule.delaysRecorded.map((d, idx) => (
                        <p key={idx} className="text-[11px]">
                          • <strong>+{d.delayHours} Hours</strong> ({d.date}): {d.reason} (Recorded by: {d.recordedBy})
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Stage-by-Stage Durations Bar */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-2">
                    <span className="font-bold text-foreground block">Time Spent Across 8 Workflow Stages:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {Object.entries(dossier.projectSchedule.stageDurations).map(([stage, hrs]) => (
                        <div key={stage} className="p-2 rounded-xl bg-background border border-border/40 flex items-center justify-between">
                          <span className="text-muted-foreground truncate">{stage}:</span>
                          <span className="font-bold text-foreground ml-1">{hrs}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 10 & 11: FINAL OUTCOME & AUDIT INTEGRITY STAMP */}
              {activeTab === "overview" && (
                <div className="p-5 rounded-2xl bg-linear-to-r from-blue-900/10 to-indigo-900/10 border border-primary/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-primary text-[11px] flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4" />
                      Section 10 & 11: Final Outcome & Public Verification Stamp
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-background text-emerald-600 border-emerald-500/30 font-bold">
                      {dossier.audit.dataIntegrity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Final Implementation Outcome:</strong> {dossier.finalOutcome.documentedImpact}
                  </p>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground flex-wrap gap-2">
                    <span>Audit Block: <strong>{dossier.audit.auditStamp}</strong></span>
                    <span>Report Rendered: {new Date(dossier.audit.generatedAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
