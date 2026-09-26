"use client";

import * as React from "react";
import { Activity, RefreshCw, Server } from "lucide-react";
import { useApiMetrics } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminApiMonitoringPage() {
  const { data: apiMetrics, isLoading, refetch } = useApiMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            API Gateway & Microservice Observability
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitor route latencies, request rates, error status codes, and rate-limiting limits.
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Requests (24h)</span>
          <div className="text-2xl font-black font-mono text-foreground">
            {apiMetrics?.totalRequestsLast24h?.toLocaleString() || "142,800"}
          </div>
        </Card>
        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">P50 Latency</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {apiMetrics?.p50LatencyMs || "12.4"} ms
          </div>
        </Card>
        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">P99 Latency</span>
          <div className="text-2xl font-black font-mono text-foreground">
            {apiMetrics?.p99LatencyMs || "84.2"} ms
          </div>
        </Card>
        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Error Rate (5xx)</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {apiMetrics?.errorRatePct || "0.02"}%
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold">Top Ingress Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">HTTP Method</th>
                <th className="p-3.5">Endpoint Path</th>
                <th className="p-3.5">Avg Latency</th>
                <th className="p-3.5">Error Rate</th>
                <th className="p-3.5">RPM</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(apiMetrics?.endpoints || []).map((ep) => (
                <tr key={ep.path} className="hover:bg-muted/30 font-mono text-[11px]">
                  <td className="p-3.5">
                    <Badge variant={ep.method === "GET" ? "info" : "success"} className="text-[10px]">
                      {ep.method}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-bold text-foreground">{ep.path}</td>
                  <td className="p-3.5 text-muted-foreground">{ep.avgLatencyMs} ms</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">{ep.errorRatePct}%</td>
                  <td className="p-3.5 text-foreground">{ep.rpm}</td>
                  <td className="p-3.5 text-right">
                    <Badge variant={ep.status === "Healthy" ? "success" : "warning"} className="text-[9px]">
                      {ep.status}
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
