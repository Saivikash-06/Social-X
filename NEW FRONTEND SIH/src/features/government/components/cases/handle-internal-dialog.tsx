"use client";

import * as React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  User,
  Building2,
  FileText,
  Clock,
  ArrowRight,
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

interface HandleInternalDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function HandleInternalDialog({
  caseData,
  isOpen,
  onClose,
  onSuccess,
}: HandleInternalDialogProps) {
  const { t } = useTranslation();
  const [officerName, setOfficerName] = React.useState("");
  const [targetStatus, setTargetStatus] = React.useState<"under_review" | "in_progress" | "resolved">("in_progress");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (caseData) {
      setOfficerName(caseData.officer || "Executive Municipal Engineer");
      setNotes(
        `Department has adequate field staff and machinery. Field mobilization initiated under internal municipal SLA.`
      );
    }
  }, [caseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/government/issues/${caseData.id}/handle-internal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerName,
          officerId: caseData.officerId || "off-tn-001",
          notes,
          targetStatus,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to handle case internally.");
      }

      toast.success(t("toast.issueUpdated", "Case Retained for Internal Resolution"), {
        description: `Grievance #${caseData.id} assigned to Officer ${officerName} (${caseData.department}). Citizen status updated to ${targetStatus.replace("_", " ").toUpperCase()}.`,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(t("toast.errorOccurred", "Action Failed"), {
        description: err.message || "Could not retain case internally.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
              {t("government.internal_resolution", "Internal Municipal Resolution")}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              #{caseData.id}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>{t("government.handle_internal", "Handle Internally by Government")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("government.handle_internal_desc", "Department possesses adequate resources. No third-party or industry vendor involvement required.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="officerName" className="text-xs font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span>{t("common.labels.assignedTo", "Assigned Government Officer")}</span>
            </Label>
            <Input
              id="officerName"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="rounded-xl text-xs font-semibold"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              <span>{t("common.labels.status", "Progress Status Stage")}</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetStatus("under_review")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  targetStatus === "under_review"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("common.status.under_review", "Under Review")}
              </button>
              <button
                type="button"
                onClick={() => setTargetStatus("in_progress")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  targetStatus === "in_progress"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("common.status.in_progress", "In Progress")}
              </button>
              <button
                type="button"
                onClick={() => setTargetStatus("resolved")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  targetStatus === "resolved"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("common.status.resolved", "Resolved")}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>{t("government.officer_directives", "Internal Operations & Officer Directives")}</span>
            </Label>
            <Textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("government.notes_placeholder", "Enter execution instructions, team dispatched, equipment used...")}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold"
            >
              {t("common.buttons.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitting ? t("common.loading.savingChanges", "Retaining...") : t("government.retain_and_solve", "Retain & Solve Internally")}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
