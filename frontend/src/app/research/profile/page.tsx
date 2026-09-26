"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  ShieldCheck,
  Edit,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useResearchInstitute } from "@/features/research/hooks/use-research-queries";
import { toast } from "sonner";

export default function ResearchProfilePage() {
  const { data: institute } = useResearchInstitute();

  return (
    <div className="space-y-6">
      {/* Cover Image Banner */}
      <div className="relative h-48 sm:h-64 w-full rounded-3xl overflow-hidden border border-border/80 shadow-md">
        <img
          src={institute?.coverImageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop&q=80"}
          alt="Institute Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Main Profile Header Overlay */}
      <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
        <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={institute?.logoUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80"}
                alt="Logo"
                className="h-20 w-20 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">{institute?.name}</h1>
                  <Badge variant="default" className="gap-1 text-[10px] bg-indigo-600">
                    <Sparkles className="h-3 w-3" />
                    <span>{institute?.accreditation}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{institute?.address} • Est. {institute?.establishedYear}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => toast.info("Institute credentials can be edited under Settings.")}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Credentials</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: About & Focus Areas */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">About the Institute & Mandate</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{institute?.about}</p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority Research Verticals</h3>
              <div className="flex flex-wrap gap-2">
                {institute?.focusAreas.map((area) => (
                  <Badge key={area} className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs px-3 py-1">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Achievements & Certifications */}
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Accreditations & Key Achievements</h2>
            <div className="space-y-2.5">
              {institute?.achievements.map((ach, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <Award className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="text-foreground font-medium">{ach}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Contact & Impact Metrics */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">R&D Impact Metrics</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Total Patents:</span>
                <span className="font-bold text-indigo-600">{institute?.impactMetrics.totalPatents} Granted</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Publications:</span>
                <span className="font-bold text-foreground">{institute?.impactMetrics.publicationsIndexed} Indexed</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Grants Mobilized:</span>
                <span className="font-bold text-emerald-600">₹{institute?.impactMetrics.grantsMobilizedCr} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scholars Supported:</span>
                <span className="font-bold text-foreground">{institute?.impactMetrics.activeScholars} Fellows</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-3">
            <h2 className="text-base font-bold text-foreground">Director & Office Contact</h2>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Director:</strong> {institute?.directorName}</p>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                <span>{institute?.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-500" />
                <span>{institute?.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-indigo-500" />
                <a href={institute?.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                  {institute?.website}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
