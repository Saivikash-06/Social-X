"use client";

import * as React from "react";
import { ScrollText, RefreshCw, ShieldAlert } from "lucide-react";
import { useAuditLogs } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminAuditLogsPage() {
  const { data: auditLogs, isLoading, refetch } = useAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Immutable Audit Trail & Cryptographic Security Log
          </h1>
          <p className="text-xs text-muted-foreground">
            Tamper-evident system activity log capturing administrative logins, authorization shifts, and data queries.
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
                <th className="p-3.5">Event Type</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(auditLogs || []).map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 font-mono text-[11px]">
                  <td className="p-3.5 text-muted-foreground">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-foreground">{log.eventType}</td>
                  <td className="p-3.5 text-muted-foreground">{log.userEmail}</td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        log.severity === "critical"
                          ? "destructive"
                          : log.severity === "warning"
                          ? "warning"
                          : "info"
                      }
                      className="text-[9px] font-bold uppercase"
                    >
                      {log.severity}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{log.ipAddress}</td>
                  <td className="p-3.5 text-muted-foreground font-sans text-xs">
                    {JSON.stringify(log.detailsPayload)}
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
