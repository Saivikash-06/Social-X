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
  CheckCircle2,
  Edit,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useNgoOrganization } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoProfilePage() {
  const { data: org } = useNgoOrganization();

  return (
    <div className="space-y-6">
      {/* Cover Image Banner */}
      <div className="relative h-48 sm:h-64 w-full rounded-3xl overflow-hidden border border-border/80 shadow-md">
        <img
          src={org?.coverImageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80"}
          alt="NGO Cover"
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
                src={org?.logoUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&auto=format&fit=crop&q=80"}
                alt="Logo"
                className="h-20 w-20 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">{org?.name}</h1>
                  <Badge variant="success" className="gap-1 text-[10px]">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Darpan Verified</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{org?.address} • Est. {org?.establishedYear}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => toast.info("Profile edit dialog can be modified in Settings.")}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Update Credentials</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: About & Mission */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Mission Statement</h2>
            <p className="text-xs text-muted-foreground leading-relaxed p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-foreground font-medium">
              "{org?.mission}"
            </p>

            <h2 className="text-base font-bold text-foreground pt-2">About the Organization</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{org?.about}</p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Strategic Focus Domains</h3>
              <div className="flex flex-wrap gap-2">
                {org?.focusAreas.map((area) => (
                  <Badge key={area} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs px-3 py-1">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Achievements & Certifications */}
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Institutional Accreditations & Commendations</h2>
            <div className="space-y-2.5">
              {org?.achievements.map((ach, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <Award className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-foreground font-medium">{ach}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Contact, Compliance & Impact Summary */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Compliance & Legal Registration</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Society Reg No:</span>
                <span className="font-mono font-bold text-foreground">{org?.registrationNumber}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">NGO Darpan ID:</span>
                <span className="font-mono font-bold text-emerald-600">{org?.darpanId}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">FCRA Status:</span>
                <span className="font-bold text-foreground">{org?.fcraStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">12A & 80G Tax Exemption:</span>
                <span className="font-bold text-emerald-600">Active Validated</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-3">
            <h2 className="text-base font-bold text-foreground">Contact & Web Portal</h2>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <span>{org?.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>{org?.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-emerald-500" />
                <a href={org?.website} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                  {org?.website}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
