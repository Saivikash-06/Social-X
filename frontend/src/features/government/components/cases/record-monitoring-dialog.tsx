"use client";

import * as React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ClipboardCheck,
  Building2,
  UserCheck,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { GovernmentCase } from "../../types";
import { toast } from "sonner";
import { useTranslation } from "@/features/shared/i18n";

interface RecordMonitoringDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RecordMonitoringDialog({
  caseData,
  isOpen,
  onClose,
  onSuccess,
}: RecordMonitoringDialogProps) {
  const { t } = useTranslation();
  const [officerName, setOfficerName] = React.useState("");
  const [officerDesignation, setOfficerDesignation] = React.useState("");
  const [officerDepartment, setOfficerDepartment] = React.useState("");
  const [monitoringStatus, setMonitoringStatus] = React.useState("SATISFACTORY");
  const [observations, setObservations] = React.useState("");
  const [issuesIdentified, setIssuesIdentified] = React.useState("");
  const [correctiveActionsRequested, setCorrectiveActionsRequested] = React.useState("");
  const [nextScheduledDate, setNextScheduledDate] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (caseData) {
      setOfficerName(caseData.officer || "Er. Ramesh K.");
      setOfficerDesignation("Executive Municipal Quality Inspector");
      setOfficerDepartment(caseData.department || "Municipal Administration & Oversight");
      setObservations(
        `On-site quality audit conducted at ${caseData.location}. Workmanship meets civic safety standards.`
      );
      setIssuesIdentified("None detected during current inspection cycle.");
      setCorrectiveActionsRequested("Continue scheduled timeline and maintain perimeter barricades.");
      // Set next scheduled date to +5 days by default
      const d = new Date();
      d.setDate(d.getDate() + 5);
      setNextScheduledDate(d.toISOString().split("T")[0]);
    }
  }, [caseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData) return;

    if (!observations.trim()) {
      toast.error("Please provide monitoring observations.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        issue_id: caseData.id,
        officer_name: officerName.trim(),
        officer_designation: officerDesignation.trim(),
        officer_department: officerDepartment.trim(),
        monitoring_status: monitoringStatus,
        observations: observations.trim(),
        issues_identified: issuesIdentified.trim() || undefined,
        corrective_actions_requested: correctiveActionsRequested.trim() || undefined,
        next_scheduled_monitoring_date: nextScheduledDate || undefined,
      };

      const res = await fetch("/api/transparency/monitoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record monitoring log.");
      }

      toast.success("Government Monitoring Inspection Recorded!", {
        description: `Official inspection log added to public transparency records for #${caseData.id}.`,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error("Error Recording Monitoring", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-border/80">
        <DialogHeader className="space-y-1.5 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-mono text-xs">
              #{caseData.id}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {caseData.category}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <ClipboardCheck className="h-5 w-5 text-indigo-600" />
            <span>Record Government Monitoring Inspection</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Record regular official monitoring for this civic issue. The recorded audit timestamp, inspector identity, observations, and corrective actions will be published directly to the public Citizen Transparency Portal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* Inspector Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Monitoring Officer Name</span>
              </Label>
              <Input
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
                className="text-xs rounded-xl"
                placeholder="e.g. Er. Ramesh K."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Officer Designation</span>
              </Label>
              <Input
                value={officerDesignation}
                onChange={(e) => setOfficerDesignation(e.target.value)}
                required
                className="text-xs rounded-xl"
                placeholder="e.g. Executive Municipal Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Monitoring Department</Label>
              <Input
                value={officerDepartment}
                onChange={(e) => setOfficerDepartment(e.target.value)}
                required
                className="text-xs rounded-xl"
                placeholder="e.g. Municipal Administration & Oversight"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Inspection Outcome / Status</Label>
              <select
                value={monitoringStatus}
                onChange={(e) => setMonitoringStatus(e.target.value)}
                className="w-full text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="SATISFACTORY">Satisfactory / Compliant</option>
                <option value="ON_TRACK">On Track & Meeting Milestones</option>
                <option value="MINOR_ISSUES">Minor Issues Flagged</option>
                <option value="ACTION_REQUIRED">Critical Action Required</option>
                <option value="DELAYED">Delayed / Non-Compliant</option>
              </select>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Inspection Observations & Progress Remarks</span>
              <span className="text-[10px] text-muted-foreground">Publicly visible</span>
            </Label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              required
              rows={3}
              placeholder="Detailed physical findings from the field inspection visit..."
              className="text-xs rounded-xl"
            />
          </div>

          {/* Issues Identified */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Issues or Bottlenecks Identified (Optional)</span>
            </Label>
            <Input
              value={issuesIdentified}
              onChange={(e) => setIssuesIdentified(e.target.value)}
              placeholder="e.g. Sub-grade curing delayed by 24h due to rain / Heavy traffic diversion needed"
              className="text-xs rounded-xl"
            />
          </div>

          {/* Corrective Actions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Corrective Actions Requested to Stakeholder / Contractor</span>
            </Label>
            <Input
              value={correctiveActionsRequested}
              onChange={(e) => setCorrectiveActionsRequested(e.target.value)}
              placeholder="e.g. Deploy auxiliary pump within 12h and update slurry barrier"
              className="text-xs rounded-xl"
            />
          </div>

          {/* Next Scheduled Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Next Scheduled Monitoring Date</span>
            </Label>
            <Input
              type="date"
              value={nextScheduledDate}
              onChange={(e) => setNextScheduledDate(e.target.value)}
              className="text-xs rounded-xl max-w-xs"
            />
          </div>

          <div className="p-3 rounded-2xl bg-indigo-500/4 border border-indigo-500/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Immutable Public Audit Rule</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Upon submission, the current exact server timestamp will be permanently stamped as the official monitoring time. Citizens on the Transparency portal will see this timestamp as verified government oversight.
            </p>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{submitting ? "Logging Inspection..." : "Log Official Inspection"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
