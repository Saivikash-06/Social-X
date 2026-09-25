"use client";

import * as React from "react";
import { Briefcase, RefreshCw } from "lucide-react";
import { useAdminIndustries } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";

export default function AdminIndustryPage() {
  const { data: industries, isLoading, refetch } = useAdminIndustries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Corporate CSR & Industry Partnerships
          </h1>
          <p className="text-xs text-muted-foreground">
            Track statutory CSR commitments, fund disbursements, and sponsored public works.
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
        {(industries || []).map((ind) => (
          <Card key={ind.id} className="rounded-3xl border-border/80 p-5 space-y-3 hover:border-amber-500/50 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  CIN: {ind.cin}
                </Badge>
                <h3 className="font-bold text-base text-foreground mt-1">{ind.companyName}</h3>
                <p className="text-[11px] text-muted-foreground">{ind.sector} &bull; {ind.headquarters}</p>
              </div>
              <Badge variant="warning" className="text-[10px]">
                {ind.verificationStatus}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span>CSR Lead:</span>
                <span className="font-semibold text-foreground">{ind.csrLeadName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contact Email:</span>
                <span className="font-mono text-muted-foreground">{ind.csrLeadEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Committed CSR Fund:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  ₹{ind.csrFundCommittedCr} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Disbursed:</span>
                <span className="font-mono text-foreground">₹{ind.csrFundDisbursedCr} Cr</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sponsored Civic Projects:</span>
                <span className="font-mono font-bold text-foreground">
                  {ind.sponsoredProjectsCount} Projects
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
