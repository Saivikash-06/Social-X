"use client";

import * as React from "react";
import { FlaskConical, RefreshCw } from "lucide-react";
import { useAdminResearchOrgs } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";

export default function AdminResearchPage() {
  const { data: researchOrgs, isLoading, refetch } = useAdminResearchOrgs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Research Organizations & National Laboratories
          </h1>
          <p className="text-xs text-muted-foreground">
            Municipal GIS telemetry access tiers, patented solutions, and funded research grants.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(researchOrgs || []).map((org) => (
          <Card key={org.id} className="rounded-3xl border-border/80 p-5 space-y-3 hover:border-sky-500/50 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {org.acronym} &bull; {org.category}
                </Badge>
                <h3 className="font-bold text-base text-foreground mt-1">{org.institutionName}</h3>
              </div>
              <Badge variant="info" className="text-[10px]">
                {org.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span>Principal Scientist:</span>
                <span className="font-semibold text-foreground">{org.principalScientist}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contact Email:</span>
                <span className="font-mono text-muted-foreground">{org.contactEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Grants:</span>
                <span className="font-mono font-bold text-foreground">{org.activeGrantsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Patents Filed:</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {org.patentsFiledCount} Patents
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GIS Telemetry Tier:</span>
                <Badge variant="secondary" className="text-[9px] font-mono">
                  {org.dataAccessTier}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
