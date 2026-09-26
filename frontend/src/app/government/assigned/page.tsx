"use client";

import * as React from "react";
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Building2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Flame,
} from "lucide-react";
import { Card } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/features/shared/components/ui/dropdown-menu";
import { GovernmentCase } from "@/features/government/types";
import {
  useGovernmentCases,
  useGovernmentMutations,
} from "@/features/government/hooks/use-government-queries";
import { IssueDetailsModal } from "@/features/government/components/cases/issue-details-modal";
import { ReassignCaseDialog } from "@/features/government/components/cases/reassign-case-dialog";
import { TransferDepartmentDialog } from "@/features/government/components/cases/transfer-department-dialog";
import { ResolveCaseDialog } from "@/features/government/components/cases/resolve-case-dialog";
import { toast } from "sonner";
import { useTranslation } from "@/features/shared/i18n";

export default function AssignedCasesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");

  // Dialog states
  const [selectedCase, setSelectedCase] = React.useState<GovernmentCase | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isReassignOpen, setIsReassignOpen] = React.useState(false);
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);
  const [isResolveOpen, setIsResolveOpen] = React.useState(false);

  const { data: cases, isLoading, refetch } = useGovernmentCases({
    search: searchTerm,
    status: statusFilter,
    priority: priorityFilter,
  });

  const {
    approveCaseMutation,
    rejectCaseMutation,
    escalateCaseMutation,
  } = useGovernmentMutations();

  const handleOpenDetails = (c: GovernmentCase) => {
    setSelectedCase(c);
    setIsDetailsOpen(true);
  };

  const handleOpenReassign = (c: GovernmentCase) => {
    setSelectedCase(c);
    setIsReassignOpen(true);
  };

  const handleOpenTransfer = (c: GovernmentCase) => {
    setSelectedCase(c);
    setIsTransferOpen(true);
  };

  const handleOpenResolve = (c: GovernmentCase) => {
    setSelectedCase(c);
    setIsResolveOpen(true);
  };

  const handleRejectPrompt = (c: GovernmentCase) => {
    const reason = window.prompt(
      `${t("government.assigned.enterRejection", "Enter department rejection justification for Case")} #${c.id}:`,
      t("government.assigned.defaultRejection", "Duplicate entry or outside municipal jurisdiction")
    );
    if (reason) {
      rejectCaseMutation.mutate({ caseId: c.id, reason });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t("government.assigned.title", "Assigned Municipal Cases")}
            </h1>
            <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
              {cases?.length ?? 0} {t("government.assigned.inDocket", "In Docket")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("government.assigned.subtitle", "Review incoming grievances, inspect multimodal citizen evidence, and orchestrate line department actions.")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t("common.buttons.refresh", "Refresh")}</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-3xl border-border/80 p-4 shadow-sm bg-card space-y-3">
        {/* Quick Docket Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 border-b border-border/60 pb-3">
          {[
            { label: t("government.assigned.allComplaints", "All Complaints"), value: "all" },
            { label: t("government.assigned.newComplaints", "New Complaints"), value: "submitted" },
            { label: t("government.assigned.assignedCases", "Assigned Cases"), value: "assigned" },
            { label: t("government.assigned.pendingReview", "Pending Review"), value: "under_review" },
            { label: t("common.status.in_progress", "In Progress"), value: "in_progress" },
            { label: t("common.status.resolved", "Resolved"), value: "resolved" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("government.assigned.searchPlaceholder", "Search by case ID, citizen, street, category, or keyword...")}
              className="pl-9 rounded-xl border-border/80 text-xs bg-muted/30 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label={t("common.labels.status", "Status")}
              className="text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none font-medium text-foreground w-full sm:w-auto"
            >
              <option value="all">{t("common.status.allStatuses", "All Statuses")}</option>
              <option value="submitted">{t("common.status.submitted", "New / Submitted")}</option>
              <option value="under_review">{t("common.status.under_review", "Pending Review")}</option>
              <option value="assigned">{t("common.status.assigned", "Assigned")}</option>
              <option value="in_progress">{t("common.status.in_progress", "In Progress")}</option>
              <option value="resolved">{t("common.status.resolved", "Resolved")}</option>
              <option value="escalated">{t("common.status.escalated", "Escalated")}</option>
              <option value="rejected">{t("common.status.rejected", "Rejected")}</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label={t("common.labels.priority", "Priority")}
              className="text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none font-medium text-foreground w-full sm:w-auto"
            >
              <option value="all">{t("common.priority.allPriorities", "All Priorities")}</option>
              <option value="critical">{t("common.priority.critical", "Critical (Class 1)")}</option>
              <option value="high">{t("common.priority.high", "High Priority")}</option>
              <option value="medium">{t("common.priority.medium", "Medium Priority")}</option>
              <option value="low">{t("common.priority.low", "Low Priority")}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      <Card className="rounded-3xl border-border/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="p-3.5">{t("government.assigned.caseId", "Issue ID")}</th>
                <th className="p-3.5">{t("government.assigned.citizenName", "Citizen Name")}</th>
                <th className="p-3.5">{t("common.labels.category", "Category")}</th>
                <th className="p-3.5">{t("common.labels.priority", "Priority")}</th>
                <th className="p-3.5">{t("government.assigned.aiConfidence", "AI Confidence")}</th>
                <th className="p-3.5">{t("common.labels.location", "Location")}</th>
                <th className="p-3.5">{t("common.labels.status", "Status")}</th>
                <th className="p-3.5">{t("government.assigned.assignedDate", "Assigned Date")}</th>
                <th className="p-3.5">{t("government.assigned.officer", "Officer")}</th>
                <th className="p-3.5 text-right">{t("common.labels.actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(cases || []).map((c) => {
                const isCritical = c.priority === "critical";
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Issue ID */}
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      <button
                        onClick={() => handleOpenDetails(c)}
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>#{c.id}</span>
                        {isCritical && (
                          <Flame className="h-3 w-3 text-rose-500 inline shrink-0 animate-pulse" />
                        )}
                      </button>
                    </td>

                    {/* Citizen Name */}
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">
                        {c.citizenName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.citizenPhone}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 font-medium text-foreground max-w-[130px] truncate">
                      {c.category}
                    </td>

                    {/* Priority */}
                    <td className="p-3.5">
                      <Badge
                        variant={
                          c.priority === "critical"
                            ? "destructive"
                            : c.priority === "high"
                            ? "warning"
                            : "outline"
                        }
                        className="text-[10px] uppercase font-mono"
                      >
                        {t(`common.priority.${c.priority.toLowerCase()}`, c.priority)}
                      </Badge>
                    </td>

                    {/* AI Confidence */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        <span className="font-mono font-bold text-foreground">
                          {c.aiConfidence}%
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-3.5 text-muted-foreground max-w-[160px] truncate">
                      <p className="truncate text-foreground font-medium">
                        {c.location}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {c.district} &bull; {c.wardNo}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <Badge
                        variant={
                          c.status === "resolved"
                            ? "success"
                            : c.status === "in_progress"
                            ? "default"
                            : c.status === "escalated"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[10px] capitalize"
                      >
                        {t(`common.status.${c.status.toLowerCase()}`, c.status.replace("_", " "))}
                      </Badge>
                    </td>

                    {/* Assigned Date */}
                    <td className="p-3.5 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                      {c.assignedDate}
                    </td>

                    {/* Officer */}
                    <td className="p-3.5 font-medium text-foreground whitespace-nowrap">
                      <p className="font-semibold truncate max-w-[140px]">{c.officer}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {c.department}
                      </p>
                    </td>

                    {/* Actions dropdown + Direct Open */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleOpenDetails(c)}
                          className="h-7 px-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <span>{t("common.buttons.open", "Open")}</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 rounded-xl text-xs border-border/80"
                            >
                              <span>{t("common.labels.actions", "Actions")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 text-xs">
                            <DropdownMenuItem
                              onClick={() => handleOpenDetails(c)}
                              className="rounded-xl cursor-pointer"
                            >
                              <span>{t("government.assigned.openDetails", "Open Details")}</span>
                            </DropdownMenuItem>

                            {c.status === "assigned" && (
                              <DropdownMenuItem
                                onClick={() => approveCaseMutation.mutate(c.id)}
                                className="rounded-xl cursor-pointer text-emerald-600 focus:text-emerald-600"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                <span>{t("government.assigned.approveCase", "Approve Case")}</span>
                              </DropdownMenuItem>
                            )}

                            {c.status !== "resolved" && (
                              <DropdownMenuItem
                                onClick={() => handleOpenResolve(c)}
                                className="rounded-xl cursor-pointer text-emerald-600 focus:text-emerald-600"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                <span>{t("government.assigned.markResolved", "Mark Resolved")}</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => handleOpenReassign(c)}
                              className="rounded-xl cursor-pointer"
                            >
                              <UserCheck className="h-3.5 w-3.5 mr-2" />
                              <span>{t("government.assigned.assignOfficer", "Assign Officer")}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleOpenTransfer(c)}
                              className="rounded-xl cursor-pointer"
                            >
                              <Building2 className="h-3.5 w-3.5 mr-2" />
                              <span>{t("government.assigned.transferDepartment", "Transfer Department")}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                escalateCaseMutation.mutate({
                                  caseId: c.id,
                                  justification: "Priority escalated by assigned officer.",
                                })
                              }
                              className="rounded-xl cursor-pointer text-amber-600 focus:text-amber-600"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                              <span>{t("common.buttons.escalate", "Escalate")}</span>
                            </DropdownMenuItem>

                            {c.status !== "rejected" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleRejectPrompt(c)}
                                  className="rounded-xl cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-500/10"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-2" />
                                  <span>{t("government.assigned.rejectGrievance", "Reject Grievance")}</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {(cases || []).length === 0 && !isLoading && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    {t("common.emptyStates.noCasesMatch", "No cases match the selected filters.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <IssueDetailsModal
        caseData={selectedCase}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenReassign={(c) => handleOpenReassign(c)}
        onOpenTransfer={(c) => handleOpenTransfer(c)}
        onOpenResolve={(c) => handleOpenResolve(c)}
      />

      <ReassignCaseDialog
        caseData={selectedCase}
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
      />

      <TransferDepartmentDialog
        caseData={selectedCase}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />

      <ResolveCaseDialog
        caseData={selectedCase}
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
      />
    </div>
  );
}
