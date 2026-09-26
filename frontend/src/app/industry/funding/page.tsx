"use client";

import * as React from "react";
import {
  Coins,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  History,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import {
  useFundingOpportunities,
  useFundReleaseHistory,
  useIndustryQueries,
} from "@/features/industry/hooks/use-industry-queries";
import { IndustryTableWrapper, Column } from "@/features/industry/components/shared/industry-table-wrapper";
import { FundingOpportunity, FundReleaseRecord } from "@/features/industry/types";
import { toast } from "sonner";

export default function IndustryCSRFundingPage() {
  const { data: opportunities, isLoading: oppsLoading } = useFundingOpportunities();
  const { data: releaseHistory, isLoading: releasesLoading } = useFundReleaseHistory();
  const { releaseFundsMutation } = useIndustryQueries();

  // Dialog State
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<FundingOpportunity | null>(null);
  const [releaseAmount, setReleaseAmount] = React.useState<number>(500000);
  const [milestoneTitle, setMilestoneTitle] = React.useState("Phase 1 Laboratory Benchmark Clearance");
  const [paymentMode, setPaymentMode] = React.useState<"NEFT / RTGS" | "Escrow Milestone Release" | "Direct Treasury Transfer">("Escrow Milestone Release");

  const handleOpenReleaseModal = (opp: FundingOpportunity) => {
    setSelectedOpportunity(opp);
    setReleaseAmount(Math.min(opp.requiredBudget, 500000));
  };

  const handleReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;
    releaseFundsMutation.mutate(
      {
        opportunityId: selectedOpportunity.id,
        projectId: selectedOpportunity.projectId,
        amount: releaseAmount,
        milestoneTitle,
        paymentMode,
      },
      {
        onSuccess: () => setSelectedOpportunity(null),
      }
    );
  };

  const handleApproveProposal = (opp: FundingOpportunity) => {
    toast.success(`Proposal for ${opp.projectTitle} approved. MoU drafted for e-signature.`);
  };

  const handleRejectProposal = (opp: FundingOpportunity) => {
    toast.error(`Proposal ${opp.id} declined.`);
  };

  // Table Columns
  const columns: Column<FundReleaseRecord>[] = [
    {
      key: "transactionId",
      header: "Reference ID",
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-foreground text-xs">{row.transactionId}</span>,
    },
    {
      key: "projectTitle",
      header: "Project & University",
      sortable: true,
      render: (row) => (
        <div className="space-y-0.5 max-w-xs">
          <p className="font-bold text-foreground truncate text-xs">{row.projectTitle}</p>
          <p className="text-[11px] text-muted-foreground">{row.university}</p>
        </div>
      ),
    },
    {
      key: "milestoneTitle",
      header: "Audited Milestone",
      render: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.milestoneTitle}</span>,
    },
    {
      key: "amount",
      header: "Tranche Released",
      sortable: true,
      render: (row) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "paymentMode",
      header: "Disbursement Mode",
      render: (row) => <Badge variant="outline" className="text-[10px]">{row.paymentMode}</Badge>,
    },
    {
      key: "releaseDate",
      header: "Date Settled",
      sortable: true,
      render: (row) => <span className="text-xs text-muted-foreground">{row.releaseDate}</span>,
    },
    {
      key: "actions",
      header: "Receipt",
      render: () => (
        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 rounded-lg">
          <Download className="h-3 w-3" />
          <span>Voucher</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">CSR Funding & Grants</h1>
          <p className="text-sm text-muted-foreground">
            Sponsor open university proposals, approve budgets, release escrow tranches, and track statutory audit vouchers.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Section 135 Escrow Enabled</span>
        </Badge>
      </div>

      {/* Grant Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Available CSR Corpus</p>
          <p className="text-2xl font-black text-foreground">₹4,50,00,000</p>
          <p className="text-[11px] text-muted-foreground">Available for immediate university allocation</p>
        </Card>
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Allocated Grants</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹2,85,00,000</p>
          <p className="text-[11px] text-muted-foreground">Pledged across 12 approved academic MoUs</p>
        </Card>
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <p className="text-xs text-muted-foreground font-semibold">Settled Tranches</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹1,92,50,000</p>
          <p className="text-[11px] text-muted-foreground">Disbursed upon verified milestone delivery</p>
        </Card>
      </div>

      {/* Active Funding Opportunities Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Pending CSR Funding Proposals</h2>
            <p className="text-xs text-muted-foreground">Proposals submitted by university principal investigators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(opportunities || []).map((opp) => (
            <Card key={opp.id} className="border-border/80 bg-card rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">{opp.csrClassification}</Badge>
                  <Badge variant="warning" className="text-[10px]">{opp.taxBenefitSection}</Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground leading-snug">
                  {opp.projectTitle}
                </CardTitle>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{opp.university}</p>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grant Required:</span>
                    <span className="font-bold text-foreground">₹{opp.requiredBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Deadline:</span>
                    <span className="font-medium text-foreground">{opp.submissionDeadline}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                  <Button
                    onClick={() => handleOpenReleaseModal(opp)}
                    variant="gradient"
                    size="sm"
                    className="w-full rounded-xl text-xs font-bold gap-1 shadow"
                  >
                    <Coins className="h-3.5 w-3.5" />
                    <span>Authorize & Release Funds</span>
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveProposal(opp)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      onClick={() => handleRejectProposal(opp)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Disbursed Tranches History Table */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <div>
          <h2 className="text-lg font-bold text-foreground">Audited Disbursement History</h2>
          <p className="text-xs text-muted-foreground">
            Complete transaction log for Section 135 compliance and statutory audit vouchers
          </p>
        </div>

        <IndustryTableWrapper
          columns={columns}
          data={releaseHistory || []}
          searchKey={(row) => `${row.projectTitle} ${row.transactionId} ${row.university}`}
          searchPlaceholder="Search by transaction ID, project title, or university..."
          pageSize={5}
        />
      </div>

      {/* Release Funds Modal */}
      <Dialog open={!!selectedOpportunity} onOpenChange={(open) => !open && setSelectedOpportunity(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span>Release CSR Grant Tranche</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Execute formal escrow disbursement to university research depository.
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <form onSubmit={handleReleaseSubmit} className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                <p className="font-bold text-foreground">{selectedOpportunity.projectTitle}</p>
                <p className="text-muted-foreground">{selectedOpportunity.university}</p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">
                  Required Total: ₹{selectedOpportunity.requiredBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Release Tranche Amount (INR)</Label>
                <Input
                  type="number"
                  min={5000}
                  step={5000}
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  className="rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Associated Milestone Verification</Label>
                <Input
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Disbursement Gateway</Label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full rounded-xl border border-border/80 bg-muted/40 p-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Escrow Milestone Release">Escrow Milestone Release (Smart Escrow)</option>
                  <option value="NEFT / RTGS">Direct Institutional NEFT / RTGS</option>
                  <option value="Direct Treasury Transfer">State Treasury Transfer</option>
                </select>
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" onClick={() => setSelectedOpportunity(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={releaseFundsMutation.isPending}
                  variant="gradient"
                  className="rounded-xl font-bold"
                >
                  {releaseFundsMutation.isPending ? "Disbursing..." : "Disburse Funds"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
