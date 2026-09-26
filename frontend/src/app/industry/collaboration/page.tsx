"use client";

import * as React from "react";
import Link from "next/link";
import {
  Network,
  GraduationCap,
  Building2,
  Users,
  FlaskConical,
  Sparkles,
  MapPin,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useUniversityPartners, useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import { UniversityPartner } from "@/features/industry/types";
import { toast } from "sonner";

export default function IndustryUniversityCollaborationPage() {
  const { data: universities } = useUniversityPartners();
  const { connectUniversityMutation } = useIndustryQueries();

  const [selectedUniv, setSelectedUniv] = React.useState<UniversityPartner | null>(null);
  const [inviteDomain, setInviteDomain] = React.useState("IoT Sensor Telemetry for Urban Water Security");
  const [inviteGrant, setInviteGrant] = React.useState("₹25,00,000");
  const [inviteNotes, setInviteNotes] = React.useState("Seeking PI-led research fellows for hardware co-development.");

  const handleConnect = (univ: UniversityPartner) => {
    connectUniversityMutation.mutate(univ.id);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniv) return;
    toast.success(`Formal R&D Invitation dispatched to Dean of Research at ${selectedUniv.name}.`);
    setSelectedUniv(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">University Collaboration</h1>
          <p className="text-sm text-muted-foreground">
            Partner with premier technical universities, academic research centers, and faculty laboratories.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1.5">
          <Network className="h-3.5 w-3.5" />
          <span>Academic Innovation Network</span>
        </Badge>
      </div>

      {/* Universities Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(universities || []).map((univ) => (
          <Card
            key={univ.id}
            className="border-border/80 bg-card rounded-3xl shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[11px] font-bold">
                  NIRF Rank #{univ.nirfRanking}
                </Badge>
                <Badge
                  variant={univ.connectionStatus === "connected" ? "success" : "secondary"}
                  className="text-[10px]"
                >
                  {univ.connectionStatus === "connected" ? "MOU Active" : "Open for Outreach"}
                </Badge>
              </div>

              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground leading-snug">
                  {univ.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{univ.location}</span>
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Research Labs & Centers */}
              <div className="space-y-1.5">
                <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                  <FlaskConical className="h-3.5 w-3.5 text-purple-500" />
                  <span>Key Research Labs & Centers:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {univ.researchLabs.map((lab) => (
                    <span key={lab} className="rounded-xl bg-muted/60 px-2 py-0.5 text-[10px] text-foreground border border-border/50">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Innovation Centers */}
              <div className="space-y-1.5">
                <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Incubators & STEP Centers:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {univ.innovationCenters.map((center) => (
                    <span key={center} className="rounded-xl bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                      {center}
                    </span>
                  ))}
                </div>
              </div>

              {/* Faculty & Students Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Active Projects:</span>
                  <span className="font-bold text-foreground">{univ.activeProjectsCount} Initiatives</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Student Strength:</span>
                  <span className="font-bold text-foreground">{univ.studentsCount.toLocaleString()} Scholars</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                <Button
                  onClick={() => handleConnect(univ)}
                  variant={univ.connectionStatus === "connected" ? "outline" : "gradient"}
                  size="sm"
                  className="flex-1 rounded-xl text-xs gap-1 font-bold"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{univ.connectionStatus === "connected" ? "Connected" : "Connect"}</span>
                </Button>

                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                  <Link href="/industry/messages">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message</span>
                  </Link>
                </Button>

                <Button
                  onClick={() => setSelectedUniv(univ)}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs gap-1 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Invite</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite University Modal */}
      <Dialog open={!!selectedUniv} onOpenChange={(open) => !open && setSelectedUniv(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Invite University for R&D Proposal</DialogTitle>
            <DialogDescription className="text-xs">
              Dispatch an institutional Problem Statement invite for research grants.
            </DialogDescription>
          </DialogHeader>

          {selectedUniv && (
            <form onSubmit={handleSendInvite} className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
                <p className="font-bold text-foreground">{selectedUniv.name}</p>
                <p className="text-muted-foreground text-[11px]">{selectedUniv.contactEmail}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Priority Domain Challenge</Label>
                <Input value={inviteDomain} onChange={(e) => setInviteDomain(e.target.value)} className="rounded-xl" required />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Indicative CSR Grant Pool</Label>
                <Input value={inviteGrant} onChange={(e) => setInviteGrant(e.target.value)} className="rounded-xl" required />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Message & Scope of Work</Label>
                <Textarea value={inviteNotes} onChange={(e) => setInviteNotes(e.target.value)} className="rounded-xl h-20 text-xs" required />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedUniv(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" className="rounded-xl font-bold">
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
