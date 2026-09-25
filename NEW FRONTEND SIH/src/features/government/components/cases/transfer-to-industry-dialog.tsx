"use client";

import * as React from "react";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Star,
  Layers,
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

interface TransferToIndustryDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RecommendedPartner {
  company: {
    id: string;
    name: string;
    legalEntityName: string;
    sector: string;
    technologyDomains: string[];
    district: string;
    state: string;
    verified: boolean;
    esgGrade: "AAA" | "AA" | "A" | "BBB";
    rating: number;
    turnaroundTimeAvgDays: number;
    availableCapacity: "high" | "moderate" | "low";
  };
  matchScore: number;
  matchReasons: string[];
}

export function TransferToIndustryDialog({
  caseData,
  isOpen,
  onClose,
  onSuccess,
}: TransferToIndustryDialogProps) {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = React.useState<RecommendedPartner[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("");
  const [scopeOfWork, setScopeOfWork] = React.useState("");
  const [budget, setBudget] = React.useState<number>(350000);
  const [deadline, setDeadline] = React.useState<string>("");
  const [officerRemarks, setOfficerRemarks] = React.useState("");

  // Fetch recommendations when opened
  React.useEffect(() => {
    if (!isOpen || !caseData) return;

    // Default deadline to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDeadline(d.toISOString().slice(0, 10));

    setScopeOfWork(
      `Perform specialized civil and hydraulic restoration for ${caseData.title}. Secure incident perimeter, replace damaged conduits, test pressure, and restore public access.`
    );
    setOfficerRemarks("Daily progress logs and post-repair video evidence required for municipal inspection.");

    async function loadRecs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/government/issues/${caseData?.id}/transfer-industry`);
        const json = await res.json();
        if (json.success && Array.isArray(json.recommendations)) {
          setRecommendations(json.recommendations);
          if (json.recommendations.length > 0) {
            setSelectedCompanyId(json.recommendations[0].company.id);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch AI partner recommendations", e);
      } finally {
        setLoading(false);
      }
    }

    loadRecs();
  }, [isOpen, caseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData || !selectedCompanyId) {
      toast.error(t("common.validation.fillRequiredFields", "Please select a partner company."));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/government/issues/${caseData.id}/transfer-industry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          scopeOfWork,
          budget: Number(budget),
          deadline: new Date(deadline).toISOString(),
          officerRemarks,
          officerName: caseData.officer || "Executive Municipal Engineer",
          officerId: caseData.officerId || "off-tn-001",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to issue work order.");
      }

      toast.success(t("toast.workOrderDispatched", "Municipal Work Order Generated & Dispatched!"), {
        description: `Work Order #${json.workOrder?.id} assigned to ${json.workOrder?.companyName}. Citizen notification dispatched.`,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(t("toast.errorOccurred", "Transfer Failed"), {
        description: err.message || "Could not transfer case to industry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-mono">
              {t("government.authority_action", "Government Authority Action")}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              #{caseData.id}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <span>{t("government.transfer_industry", "Transfer to Industry / Startup Partner")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("government.transfer_industry_desc", "Outsource specialized technical repair to verified industrial partners under a legally binding municipal Work Order.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* AI Partner Recommendation Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>{t("government.ai_recommended_partners", "AI Recommended Partners")} ({recommendations.length})</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {t("government.ranked_by", "Ranked by category expertise, capacity & ESG grade")}
              </span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">
                {t("government.analyzing_partners", "Analyzing domain capabilities and contractor capacity...")}
              </div>
            ) : (
              <div className="space-y-2">
                {recommendations.map(({ company, matchScore, matchReasons }) => {
                  const isSelected = selectedCompanyId === company.id;
                  return (
                    <div
                      key={company.id}
                      onClick={() => setSelectedCompanyId(company.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-500/[0.04] shadow-sm ring-1 ring-indigo-500/30"
                          : "border-border/80 hover:border-indigo-400/40 bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {company.name}
                            </span>
                            {company.verified && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] px-1.5 py-0 h-4">
                                <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                                {t("common.labels.verified", "Verified")}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] font-mono">
                              ESG {company.esgGrade}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {company.sector} &bull; {company.district}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {matchReasons.map((r, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md"
                              >
                                &bull; {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <Badge
                            className={`text-xs font-mono font-bold ${
                              matchScore >= 90
                                ? "bg-emerald-600 text-white"
                                : "bg-indigo-600 text-white"
                            }`}
                          >
                            {matchScore}% {t("common.labels.rate", "Match")}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-end gap-1 font-mono">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{company.rating} / 5.0</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Work Order Specification */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>{t("government.work_order_specs", "Municipal Work Order Specifications")}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="budget" className="text-xs font-semibold flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  <span>{t("government.sanctioned_budget", "Sanctioned Budget (INR)")}</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="350000"
                  className="rounded-xl text-xs font-mono font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="deadline" className="text-xs font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{t("government.completion_date", "Mandated Completion Date")}</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="rounded-xl text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="scopeOfWork" className="text-xs font-semibold">
                {t("government.scope_of_work", "Technical Scope of Work & Deliverables")}
              </Label>
              <Textarea
                id="scopeOfWork"
                rows={3}
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
                placeholder="Specify requirements, safety codes, and repair protocols..."
                className="rounded-xl text-xs resize-none"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="remarks" className="text-xs font-semibold">
                {t("government.officer_instructions", "Superintending Officer Instructions & Inspection Clauses")}
              </Label>
              <Input
                id="remarks"
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="e.g., Conduct pressure test and provide photographic milestone updates"
                className="rounded-xl text-xs"
              />
            </div>
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
              disabled={submitting || !selectedCompanyId}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-md shadow-indigo-600/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitting ? t("common.loading.processing", "Generating Work Order...") : t("government.authorize_and_transfer", "Authorize & Transfer to Industry")}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
