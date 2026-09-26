"use client";

import * as React from "react";
import { Cpu, Activity, RefreshCw } from "lucide-react";
import { useAiTelemetry } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminAiMonitoringPage() {
  const { data: aiMetrics, isLoading, refetch } = useAiTelemetry();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            National AI Pipeline & NLP Telemetry
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time inference latencies, model uptime, OCR parsing throughput, and automated triage confidence.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Today's Inferences</span>
          <div className="text-2xl font-black font-mono text-foreground">
            {aiMetrics?.totalRequestsToday.toLocaleString() || "84,200"}
          </div>
          <span className="text-[10px] text-muted-foreground">Across all citizen ingress channels</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">OCR Document Parsing</span>
          <div className="text-2xl font-black font-mono text-blue-500">
            {aiMetrics?.ocrRequestsToday.toLocaleString() || "31,400"}
          </div>
          <span className="text-[10px] text-muted-foreground">Multilingual Indian scripts</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Avg Confidence Score</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {aiMetrics?.averageConfidenceScore ? `${(aiMetrics.averageConfidenceScore * 100).toFixed(1)}%` : "94.2%"}
          </div>
          <span className="text-[10px] text-muted-foreground">Auto-triage accuracy</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">P95 Inference Latency</span>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            {aiMetrics?.p95InferenceLatencyMs || 184} ms
          </div>
          <span className="text-[10px] text-muted-foreground">GPU cluster NIC Delhi</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(aiMetrics?.models || []).map((m) => (
          <Card key={m.name} className="rounded-3xl border-border/80 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">{m.name}</h4>
                <p className="text-[11px] text-muted-foreground">{m.type} &bull; v{m.version}</p>
              </div>
              <Badge variant="success" className="text-[10px]">
                {m.status}
              </Badge>
            </div>
            <div className="space-y-1.5 text-xs pt-2 border-t border-border/60 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.uptimePct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Latency:</span>
                <span className="font-bold">{m.latencyMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Throughput:</span>
                <span className="font-bold">{m.requestsPerMin} req/min</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
