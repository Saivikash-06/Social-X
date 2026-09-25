"use client";

import * as React from "react";
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Video,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { GovernmentCase } from "../../types";
import { useGovernmentMutations } from "../../hooks/use-government-queries";
import { toast } from "sonner";

import { IndianRupee } from "lucide-react";
import { TransferToIndustryDialog } from "./transfer-to-industry-dialog";
import { HandleInternalDialog } from "./handle-internal-dialog";
import { useTranslation } from "@/features/shared/i18n";

interface IssueDetailsModalProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReassign?: (caseData: GovernmentCase) => void;
  onOpenTransfer?: (caseData: GovernmentCase) => void;
  onOpenResolve?: (caseData: GovernmentCase) => void;
}

export function IssueDetailsModal({
  caseData,
  isOpen,
  onClose,
  onOpenReassign,
  onOpenTransfer,
  onOpenResolve,
}: IssueDetailsModalProps) {
  const { t } = useTranslation();
  const [newNote, setNewNote] = React.useState("");
  const [isIndustryDialogOpen, setIsIndustryDialogOpen] = React.useState(false);
  const [isInternalDialogOpen, setIsInternalDialogOpen] = React.useState(false);
  const [workOrder, setWorkOrder] = React.useState<any>(null);
  const [approvingPayment, setApprovingPayment] = React.useState(false);
  const [inspectingWork, setInspectingWork] = React.useState(false);

  const { addOfficerNoteMutation, escalateCaseMutation, approveCaseMutation } =
    useGovernmentMutations();

  React.useEffect(() => {
    if (!caseData || !isOpen) {
      setWorkOrder(null);
      return;
    }

    async function loadWorkOrder() {
      try {
        const res = await fetch(`/api/industry/work-orders?issueId=${caseData?.id}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.items) && json.items.length > 0) {
          setWorkOrder(json.items[0]);
        } else {
          setWorkOrder(null);
        }
      } catch (e) {
        console.warn("Failed to load work order", e);
      }
    }

    loadWorkOrder();
  }, [caseData, isOpen]);

  if (!caseData) return null;

  const handleInspectAndApprove = async () => {
    if (!workOrder) return;
    setInspectingWork(true);
    try {
      const res = await fetch(`/api/government/work-orders/${workOrder.id}/inspect-approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inspectionRemarks:
            "Field inspection passed. Structural repairs and restoration compliant with municipal safety specifications.",
          officerName: caseData.officer || "Executive Municipal Engineer",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Inspection approval failed.");
      toast.success(t("government.site_inspection_passed", "Site Inspection Passed & Work Approved"), {
        description: `Grievance #${caseData.id} marked resolved. Citizen feedback alert dispatched.`,
      });
      setWorkOrder(json.workOrder);
    } catch (err: any) {
      toast.error(t("toast.errorOccurred", "Inspection Approval Error"), { description: err.message });
    } finally {
      setInspectingWork(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!workOrder) return;
    setApprovingPayment(true);
    try {
      const res = await fetch(`/api/government/work-orders/${workOrder.id}/approve-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerName: caseData.officer || "Executive Municipal Engineer",
          notes: "Approved treasury milestone disbursement post-inspection.",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Payment approval failed.");
      toast.success(t("toast.paymentReleased", "Municipal Payment Authorized & Released!"), {
        description: `Treasury voucher generated for ₹${workOrder.budget?.toLocaleString("en-IN")} to ${workOrder.companyName}. Ref: ${json.payment?.transactionHash}`,
      });
      setWorkOrder(json.workOrder);
    } catch (err: any) {
      toast.error(t("toast.errorOccurred", "Payment Authorization Error"), { description: err.message });
    } finally {
      setApprovingPayment(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addOfficerNoteMutation.mutate(
      { caseId: caseData.id, note: newNote.trim() },
      {
        onSuccess: () => {
          setNewNote("");
        },
      }
    );
  };

  const copyGps = () => {
    navigator.clipboard.writeText(
      `${caseData.gpsCoordinates.lat}, ${caseData.gpsCoordinates.lng}`
    );
    toast.success(t("toast.gpsCopied", "GPS coordinates copied to clipboard"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-border/80">
        <DialogHeader className="space-y-2 border-b border-border pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white font-mono text-xs px-2.5 py-0.5">
                #{caseData.id}
              </Badge>
              <Badge
                variant={
                  caseData.priority === "critical"
                    ? "destructive"
                    : caseData.priority === "high"
                    ? "warning"
                    : "outline"
                }
                className="text-xs uppercase font-mono"
              >
                {t(`common.priority.${caseData.priority}`, caseData.priority)} {t("common.labels.priority", "Priority")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {t(`common.status.${caseData.status}`, caseData.status.replace("_", " "))}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>SLA: {caseData.slaDeadline}</span>
            </div>
          </div>

          <DialogTitle className="text-xl font-bold text-foreground">
            {caseData.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {caseData.category} &bull; {t("common.labels.assignedTo", "Assigned to")}: <strong className="text-foreground">{caseData.officer}</strong> ({caseData.department})
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-6 pt-2">
          {/* PRIMARY GOVERNMENT AUTHORITY DECISION WORKFLOW */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  {t("government.primary_municipal_authority", "Primary Municipal Authority")}
                </span>
                <h3 className="text-sm font-black text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <span>{t("government.resolution_strategy", "Resolution Strategy & Resource Allocation")}</span>
                </h3>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {t("common.labels.status", "Stage")}: {t(`common.status.${caseData.status}`, caseData.status.toUpperCase())}
              </Badge>
            </div>

            {/* If not assigned to industry, show the 2 Primary Options */}
            {caseData.status !== "assigned_to_industry" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* OPTION 1: SOLVE INTERNALLY */}
                <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] space-y-2 flex flex-col justify-between hover:border-emerald-500/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        {t("government.option_1_internal", "Option 1 • Internal")}
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        {t("government.no_industry", "No Industry")}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-black text-foreground">
                      {t("government.handle_internally_title", "Handle Internally by Government")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {t("government.handle_internally_desc", "Department possesses sufficient equipment & manpower. Solve via municipal field crew under officer supervision.")}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsInternalDialogOpen(true)}
                    className="w-full rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 mt-2"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t("government.handle_internal", "Handle Internally")}</span>
                  </Button>
                </div>

                {/* OPTION 2: TRANSFER TO INDUSTRY */}
                <div className="p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.03] space-y-2 flex flex-col justify-between hover:border-indigo-500/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        {t("government.option_2_outsource", "Option 2 • Outsource")}
                      </span>
                      <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]">
                        {t("government.specialized_partner", "Specialized Partner")}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-black text-foreground">
                      {t("government.transfer_industry_title", "Transfer to Industry / Startup")}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {t("government.transfer_industry_card_desc", "Requires heavy engineering or tech expertise. AI recommends registered contractors; generate legal Work Order.")}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsIndustryDialogOpen(true)}
                    className="w-full rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 mt-2 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t("government.transfer_industry", "Transfer to Industry")}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* WORK ORDER MONITORING CARD (Shown when Work Order is active) */}
            {workOrder && (
              <div className="p-4 rounded-2xl border border-indigo-500/40 bg-indigo-500/[0.04] space-y-4 pt-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/20 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-foreground">
                        {t("government.work_order", "Work Order")} #{workOrder.id}
                      </span>
                      <Badge className="bg-indigo-600 text-white text-[10px] font-mono capitalize">
                        {t(`common.status.${workOrder.status}`, workOrder.status.replace("_", " "))}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("government.partner", "Partner")}: <strong className="text-foreground">{workOrder.companyName}</strong> &bull; {t("government.sanctioned_budget", "Sanctioned Budget")}: <strong className="text-foreground font-mono">₹{workOrder.budget?.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{t("government.completion_date", "Deadline")}: {new Date(workOrder.deadline).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                {/* Progress Logs */}
                {workOrder.progressReports?.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">{t("government.milestone_completion", "Industry Milestone Completion")}:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {workOrder.progressReports[workOrder.progressReports.length - 1].progressPercentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                        style={{
                          width: `${workOrder.progressReports[workOrder.progressReports.length - 1].progressPercentage}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      &ldquo;{workOrder.progressReports[workOrder.progressReports.length - 1].description}&rdquo;
                    </p>
                  </div>
                )}

                {/* Completion Report Preview */}
                {workOrder.completionReport && (
                  <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("government.completion_report_submitted", "Final Completion Report Submitted")}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {workOrder.completionReport.testResults}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {workOrder.completionReport.completionSummary}
                    </p>
                  </div>
                )}

                {/* GOVERNMENT WORK ORDER ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-500/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("government.oversight", "Government Oversight")}:
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Approve Completion / Site Inspection */}
                    {workOrder.status === "submitted" && (
                      <Button
                        size="sm"
                        onClick={handleInspectAndApprove}
                        disabled={inspectingWork}
                        className="rounded-xl h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{inspectingWork ? t("government.inspecting", "Inspecting...") : t("government.site_inspection_passed", "Site Inspection Passed & Mark Resolved")}</span>
                      </Button>
                    )}

                    {/* Approve Payment (Authorized ONLY by Government) */}
                    {(workOrder.status === "approved" || workOrder.status === "completed") &&
                      workOrder.payment?.status !== "released" && (
                        <Button
                          size="sm"
                          onClick={handleApprovePayment}
                          disabled={approvingPayment}
                          className="rounded-xl h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-md shadow-indigo-600/30"
                        >
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>{approvingPayment ? t("common.loading.processing", "Authorizing...") : `${t("government.authorize_payment", "Authorize Payment")} (₹${workOrder.budget?.toLocaleString("en-IN")})`}</span>
                        </Button>
                      )}

                    {/* Payment Released Status Badge */}
                    {workOrder.payment?.status === "released" && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono font-bold px-3 py-1">
                        {t("government.payment_released", "Treasury Payment Released")} &bull; Ref: {workOrder.payment?.invoiceRef}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Citizen Info & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Citizen Card */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{t("government.citizen_information", "Citizen Information")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {caseData.citizenId}
                </Badge>
              </div>
              <p className="text-sm font-bold text-foreground">
                {caseData.citizenName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{caseData.citizenPhone}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
                &ldquo;{caseData.description}&rdquo;
              </p>
            </div>

            {/* GPS & Location Card */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>{t("government.gps_location_zone", "GPS Location & Zone")}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyGps}
                  className="h-6 px-2 text-[10px] gap-1 font-mono rounded-lg"
                >
                  <Copy className="h-3 w-3" />
                  <span>{t("government.copy_gps", "Copy GPS")}</span>
                </Button>
              </div>
              <p className="text-xs font-bold text-foreground">
                {caseData.location}
              </p>
              <p className="text-xs text-muted-foreground">
                {caseData.district} {t("common.labels.district", "District")} &bull; {caseData.wardNo}
              </p>
              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60 font-mono text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Lat: {caseData.gpsCoordinates.lat} | Lng: {caseData.gpsCoordinates.lng}</span>
                <Badge variant="outline" className="text-[9px]">{t("government.verified_gps", "Verified GPS")}</Badge>
              </div>
            </div>
          </div>

          {/* AI Intelligence & Duplicate Detection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Prediction */}
            <div className="p-4 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>{t("government.ai_predictive_assessment", "AI Predictive Assessment")}</span>
                </span>
                <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-[10px]">
                  {caseData.aiConfidence}% {t("ai.aiConfidence", "Confidence")}
                </Badge>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("common.labels.priority", "Severity Level")}:</span>
                  <span className="font-bold text-foreground">
                    {caseData.aiPrediction.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("ai.estimatedTime", "Est. Resolution Time")}:</span>
                  <span className="font-bold text-foreground font-mono">
                    {caseData.aiPrediction.estimatedResolutionHours} {t("government.hours", "Hours")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("ai.priorityScore", "AI Priority Score")}:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {caseData.priorityScore} / 100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("ai.suggestedDepartment", "Suggested Line Dept")}:</span>
                  <span className="font-semibold text-foreground">
                    {caseData.suggestedDepartment}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  {t("government.recommended_materials", "Recommended Equipment / Materials")}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {caseData.aiPrediction.recommendedMaterial.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Duplicate Detection */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <span>{t("ai.duplicateDetection", "Duplicate Grievance Detection")}</span>
                </span>
                <Badge
                  variant={caseData.duplicateDetection.duplicateFound ? "warning" : "success"}
                  className="text-[10px]"
                >
                  {caseData.duplicateDetection.duplicateFound
                    ? `${caseData.duplicateDetection.similarityScore}% ${t("common.labels.rate", "Match")}`
                    : t("government.unique_case", "Unique Case")}
                </Badge>
              </div>
              {caseData.duplicateDetection.duplicateFound ? (
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    {t("government.duplicate_found_desc", "AI identified cluster complaints from neighboring residents for the same infrastructure void.")}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400">
                    <span>{t("government.linked_duplicate_ids", "Linked Duplicate IDs")}:</span>
                    {caseData.duplicateDetection.duplicateCaseIds?.map((id) => (
                      <Badge key={id} variant="outline" className="font-mono text-[10px]">
                        #{id}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {t("government.duplicate_action_note", "Action: Resolving this master ticket will auto-notify and close linked duplicate grievances.")}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("government.no_duplicates_desc", "No spatial or visual duplicate tickets logged in a 500-meter radius within the past 30 days.")}
                </p>
              )}
            </div>
          </div>

          {/* Multimodal Uploads */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("government.multimodal_telemetry", "Multimodal Field Telemetry & Uploads")}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Images */}
              {caseData.attachments.images.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl border border-border overflow-hidden group relative bg-muted/40"
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="h-32 w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2 bg-card/95 border-t border-border">
                    <p className="text-[10px] font-semibold text-foreground truncate">
                      {img.label}
                    </p>
                  </div>
                </div>
              ))}

              {/* Videos */}
              {caseData.attachments.videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-3 rounded-2xl border border-border bg-card space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Video className="h-5 w-5" />
                    <span className="text-xs font-bold">{t("government.video_evidence", "Video Evidence")}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {vid.label}
                  </p>
                  <Badge variant="outline" className="text-[9px] font-mono w-fit">
                    {t("government.duration", "Duration")}: {vid.duration}
                  </Badge>
                </div>
              ))}

              {/* Voice Notes */}
              {caseData.attachments.voiceNotes.map((aud) => (
                <div
                  key={aud.id}
                  className="p-3 rounded-2xl border border-border bg-card space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Mic className="h-5 w-5" />
                    <span className="text-xs font-bold">{t("government.audio_grievance", "Audio Grievance")}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {aud.label}
                  </p>
                  <Badge variant="outline" className="text-[9px] font-mono w-fit">
                    {t("government.duration", "Duration")}: {aud.duration}
                  </Badge>
                </div>
              ))}

              {/* Documents */}
              {caseData.attachments.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl border border-border bg-card space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs font-bold truncate">{t("government.schematic_pdf", "Schematic PDF")}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {doc.name}
                  </p>
                  <Badge variant="outline" className="text-[9px] font-mono w-fit">
                    {doc.size}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Resolution History */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("government.timeline_audit_log", "Official Workflow Timeline & Audit Log")}
            </span>
            <div className="space-y-2 pl-2 border-l-2 border-indigo-500/40">
              {caseData.timeline.map((event) => (
                <div key={event.id} className="relative pl-4 space-y-0.5">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-card" />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-foreground">{event.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {event.description} &bull;{" "}
                    <span className="font-semibold text-foreground">
                      {event.actor}
                    </span>{" "}
                    ({event.actorRole})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Notes & Directives */}
          <div className="space-y-3 pt-2 border-t border-border/80">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("government.officer_directives", "Officer Notes & Directives")}
            </span>

            {/* List of Notes */}
            <div className="space-y-2">
              {caseData.officerNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {note.author} ({note.authorRole})
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {note.timestamp}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {note.note}
                  </p>
                </div>
              ))}
              {caseData.officerNotes.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  {t("government.no_notes_appended", "No internal officer directives appended yet.")}
                </p>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={t("government.notes_placeholder", "Append official directive, field instructions, or contractor notes...")}
                className="text-xs rounded-xl border-border/80"
                rows={2}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newNote.trim() || addOfficerNoteMutation.isPending}
                  className="rounded-xl h-8 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  <span>{t("government.append_directive", "Append Directive")}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Transfer to Industry Dialog */}
        <TransferToIndustryDialog
          caseData={caseData}
          isOpen={isIndustryDialogOpen}
          onClose={() => setIsIndustryDialogOpen(false)}
          onSuccess={() => {
            fetch(`/api/industry/work-orders?issueId=${caseData.id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.items?.[0]) setWorkOrder(d.items[0]);
              });
          }}
        />

        {/* Handle Internally Dialog */}
        <HandleInternalDialog
          caseData={caseData}
          isOpen={isInternalDialogOpen}
          onClose={() => setIsInternalDialogOpen(false)}
          onSuccess={() => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
