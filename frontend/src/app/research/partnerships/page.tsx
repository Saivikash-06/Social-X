"use client";

import * as React from "react";
import { GraduationCap, Award, Calendar, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useAcademicPartnerships } from "@/features/research/hooks/use-research-queries";
import { toast } from "sonner";

export default function ResearchPartnershipsPage() {
  const { data: partnerships, isLoading } = useAcademicPartnerships();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>University & Academic Partnerships</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Bilateral laboratory MoUs, co-advised PhD fellowships, and joint technology transfer licenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(partnerships || []).map((p) => (
          <Card key={p.id} className="rounded-3xl border-border/80 bg-card p-6 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[10px]">
                  {p.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground">Signed: {p.mouSignDate}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{p.universityName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.leadDepartment}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Core Focus Area</span>
                <p className="font-semibold text-foreground">{p.focusArea}</p>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Active Joint Grants:</strong> {p.activeJointGrants} Projects</p>
                <p><strong>Faculty Leads:</strong> {p.collaboratingFaculty.join(", ")}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info(`Accessing bilateral research dossier for ${p.universityName}`)}
                className="w-full rounded-xl text-xs font-bold"
              >
                View Joint Laboratory Files
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
