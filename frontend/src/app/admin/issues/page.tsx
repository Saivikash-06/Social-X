"use client";

import * as React from "react";
import { FileCheck2, Search, ArrowRightLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAdminIssues, useAdminDepartments, useAdminMutations } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { ReassignIssueDialog } from "@/features/admin/components/issues/reassign-issue-dialog";
import { AdminIssue } from "@/features/admin/types";

export default function AdminIssuesPage() {
  const { data: issuesData, isLoading, refetch } = useAdminIssues();
  const { data: departments } = useAdminDepartments();
  const { reassignIssueMutation } = useAdminMutations();

  const [reassignModalOpen, setReassignModalOpen] = React.useState(false);
  const [targetIssue, setTargetIssue] = React.useState<AdminIssue | null>(null);
  const [search, setSearch] = React.useState("");

  const filteredIssues = React.useMemo(() => {
    if (!issuesData) return [];
    return issuesData.filter((i: AdminIssue) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.departmentName.toLowerCase().includes(search.toLowerCase())
    );
  }, [issuesData, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Civic Issue Triage & SLA Enforcement
          </h1>
          <p className="text-xs text-muted-foreground">
            Review reported civic complaints, monitor auto-routing accuracy, and reassign tickets across line departments.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking number, issue title, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-2xl border-border/80 bg-muted/30 text-xs"
            />
          </div>

          <div className="rounded-2xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Tracking No.</th>
                  <th className="p-3.5">Title & Category</th>
                  <th className="p-3.5">Assigned Department</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">AI Confidence</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-foreground">{issue.trackingNumber}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{issue.title}</div>
                      <div className="text-[11px] text-muted-foreground">{issue.category} &bull; {issue.district}</div>
                    </td>
                    <td className="p-3.5 font-medium">{issue.departmentName}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          issue.priority === "Critical"
                            ? "destructive"
                            : issue.priority === "High"
                            ? "warning"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {issue.priority}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px]">
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {(issue.aiConfidenceScore * 100).toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTargetIssue(issue);
                          setReassignModalOpen(true);
                        }}
                        className="h-7 px-2 text-[11px] rounded-lg gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        <span>Reassign</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ReassignIssueDialog
        issue={targetIssue}
        departments={departments || []}
        isOpen={reassignModalOpen}
        onClose={() => {
          setReassignModalOpen(false);
          setTargetIssue(null);
        }}
        onSubmit={(data) => {
          if (targetIssue) {
            reassignIssueMutation.mutate({ id: targetIssue.id, data });
          }
          setReassignModalOpen(false);
        }}
        isLoading={reassignIssueMutation.isPending}
      />
    </div>
  );
}
