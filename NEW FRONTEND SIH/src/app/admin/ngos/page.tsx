"use client";

import * as React from "react";
import { HeartHandshake, RefreshCw } from "lucide-react";
import { useAdminNgos } from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";

export default function AdminNgosPage() {
  const { data: ngos, isLoading, refetch } = useAdminNgos();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Civil Society Organizations & NGOs
          </h1>
          <p className="text-xs text-muted-foreground">
            Audit grassroots non-profits, volunteer corps, 12A/80G status, and ward-level initiatives.
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
        {(ngos || []).map((ngo) => (
          <Card key={ngo.id} className="rounded-3xl border-border/80 p-5 space-y-3 hover:border-rose-500/50 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Darpan ID: {ngo.darpanId}
                </Badge>
                <h3 className="font-bold text-base text-foreground mt-1">{ngo.name}</h3>
                <p className="text-[11px] text-muted-foreground">{ngo.focusArea} &bull; {ngo.district}, {ngo.state}</p>
              </div>
              <Badge variant="destructive" className="text-[10px]">
                {ngo.verificationStatus}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span>Functionary:</span>
                <span className="font-semibold text-foreground">{ngo.chiefFunctionary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contact Email:</span>
                <span className="font-mono text-muted-foreground">{ngo.contactEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Volunteer Corps:</span>
                <span className="font-mono font-bold text-foreground">{ngo.volunteerRosterCount} Volunteers</span>
              </div>
              <div className="flex items-center justify-between">
                <span>FCRA / 12A-80G:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {ngo.fcraStatus} &bull; {ngo.has12A80G ? "12A/80G Active" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Adopted Projects:</span>
                <span className="font-mono font-bold text-foreground">
                  {ngo.adoptedProjectsCount} Civic Projects
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
