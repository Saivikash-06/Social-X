"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/features/shared/components/ui/table";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Issue, IssueStatus, IssuePriority } from "../types";
import { ArrowRight, Eye, Crosshair, MapPin, Calendar } from "lucide-react";
import { useTranslation } from "@/features/shared/i18n";

export function StatusBadge({ status }: { status: IssueStatus }) {
  const { t } = useTranslation();
  switch (status) {
    case "submitted":
      return <Badge variant="info">{t("common.status.submitted", "Submitted")}</Badge>;
    case "verified":
      return <Badge variant="purple">{t("common.status.verified", "AI Verified")}</Badge>;
    case "under_review":
    case "under_government_review":
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{t("common.status.under_government_review", "Under Govt Review")}</Badge>;
    case "assigned":
    case "assigned_to_government":
      return <Badge variant="info">{t("common.status.assigned_to_government", "Assigned to Govt")}</Badge>;
    case "assigned_to_industry":
      return <Badge className="bg-indigo-600 text-white font-mono">{t("common.status.assigned_to_industry", "Assigned to Industry")}</Badge>;
    case "industry_review":
      return <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">{t("common.status.industry_review", "Industry Review")}</Badge>;
    case "assigned_to_university":
      return <Badge className="bg-purple-600 text-white font-mono">{t("common.status.assigned_to_university", "Assigned to University")}</Badge>;
    case "student_development":
      return <Badge className="bg-blue-600 text-white font-mono">{t("common.status.student_development", "Student Development")}</Badge>;
    case "faculty_review":
      return <Badge className="bg-violet-600 text-white font-mono">{t("common.status.faculty_review", "Faculty Review")}</Badge>;
    case "industry_validation":
      return <Badge className="bg-cyan-600 text-white font-mono">{t("common.status.industry_validation", "Industry Validation")}</Badge>;
    case "government_inspection":
    case "inspection":
      return <Badge className="bg-amber-600 text-white font-mono">{t("common.status.inspection", "Govt Site Inspection")}</Badge>;
    case "resolved":
      return <Badge variant="success">{t("common.status.resolved", "Resolved")}</Badge>;
    case "feedback_pending":
      return <Badge className="bg-teal-600 text-white font-mono">{t("common.status.feedback_pending", "Feedback Pending")}</Badge>;
    case "closed":
      return <Badge variant="secondary">{t("common.status.closed", "Closed")}</Badge>;
    case "rejected":
      return <Badge variant="destructive">{t("common.status.rejected", "Declined")}</Badge>;
    default:
      return <Badge variant="secondary">{t(`common.status.${status}`, (status as string).replace("_", " "))}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const { t } = useTranslation();
  switch (priority) {
    case "critical":
      return <Badge variant="destructive">{t("common.priority.critical", "Critical")}</Badge>;
    case "high":
      return <Badge variant="warning">{t("common.priority.high", "High")}</Badge>;
    case "medium":
      return <Badge variant="info">{t("common.priority.medium", "Medium")}</Badge>;
    default:
      return <Badge variant="secondary">{t(`common.priority.${priority}`, priority)}</Badge>;
  }
}

export function getStatusBadge(status: IssueStatus) {
  return <StatusBadge status={status} />;
}

export function getPriorityBadge(priority: IssuePriority) {
  return <PriorityBadge priority={priority} />;
}

interface MyIssuesTableProps {
  issues: Issue[];
  compact?: boolean;
}

export function MyIssuesTable({ issues, compact = false }: MyIssuesTableProps) {
  const { t } = useTranslation();

  if (issues.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        {t("common.emptyStates.noIssuesFound", "No issues found matching your criteria.")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-35">{t("government.assigned.caseId", "Issue ID")}</TableHead>
              <TableHead>{t("common.labels.title", "Title")} & {t("common.labels.category", "Category")}</TableHead>
              <TableHead>{t("common.labels.status", "Status")}</TableHead>
              <TableHead>{t("common.labels.priority", "Priority")}</TableHead>
              {!compact && <TableHead>{t("common.labels.department", "Assigned Agency")}</TableHead>}
              <TableHead>{t("common.labels.createdAt", "Reported Date")}</TableHead>
              <TableHead className="text-right">{t("common.labels.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} className="hover:bg-muted/40">
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {issue.id}
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground leading-snug line-clamp-1">
                      {issue.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{issue.category}</p>
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={issue.status} /></TableCell>
                <TableCell><PriorityBadge priority={issue.priority} /></TableCell>
                {!compact && (
                  <TableCell className="text-xs text-muted-foreground max-w-50 truncate">
                    {issue.assignedDepartment || t("common.loading.processing", "Routing to Agency...")}
                  </TableCell>
                )}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg gap-1 text-xs"
                    >
                      <Link href={`/citizen/track`}>
                        <Crosshair className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline">{t("citizen.dashboard.trackIssues", "Track")}</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg gap-1 text-xs"
                    >
                      <Link href={`/citizen/issues/${issue.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        <span>{t("common.buttons.viewDetails", "Details")}</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-2xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">
                {issue.id}
              </span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">{issue.title}</h4>
              <p className="text-xs text-muted-foreground">{issue.category}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2">
                  <Link href={`/citizen/track`}>{t("citizen.dashboard.trackIssues", "Track")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-7 text-xs px-2">
                  <Link href={`/citizen/issues/${issue.id}`}>{t("common.buttons.viewDetails", "Details")}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
