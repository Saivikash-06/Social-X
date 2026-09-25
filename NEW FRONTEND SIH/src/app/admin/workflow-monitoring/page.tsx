"use client";

import * as React from "react";
import { GitFork, RefreshCw } from "lucide-react";
import { useWorkflowLogs } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminWorkflowMonitoringPage() {
  const { data: workflowLogs, isLoading, refetch } = useWorkflowLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Workflow SLA & Dynamic Ticket Routing
          </h1>
          <p className="text-xs text-muted-foreground">
            Live trace of automated ticket routing, department handovers, and SLA escalation triggers.
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

      <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Tracking No.</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">From &bull; To</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(workflowLogs || []).map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 font-mono text-[11px]">
                  <td className="p-3.5 text-muted-foreground">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-foreground">{log.trackingNumber}</td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px]">
                      {log.actionType}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    {log.fromEntity} &rarr; <span className="text-foreground font-semibold">{log.toEntity}</span>
                  </td>
                  <td className="p-3.5 text-muted-foreground font-sans text-xs">{log.reasonNotes}</td>
                  <td className="p-3.5">
                    <Badge variant={log.status === "Success" ? "success" : "warning"} className="text-[10px]">
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
