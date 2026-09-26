"use client";

import * as React from "react";
import {
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Rocket,
  FileCode2,
  Upload,
  Sparkles,
  Download,
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
import { usePrototypeSubmissions, useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import { PrototypeSubmission } from "@/features/industry/types";
import { toast } from "sonner";

export default function IndustryPrototypeSupportPage() {
  const { data: prototypes } = usePrototypeSubmissions();
  const { reviewPrototypeMutation } = useIndustryQueries();

  const [selectedProto, setSelectedProto] = React.useState<PrototypeSubmission | null>(null);
  const [decision, setDecision] = React.useState<"approved" | "rejected" | "improvements_required">("approved");
  const [techScore, setTechScore] = React.useState(90);
  const [fieldScore, setFieldScore] = React.useState(85);
  const [suggestions, setSuggestions] = React.useState("Enclosure certified IP68. Ready for 30-day municipal testbed.");
  const [pilotLocation, setPilotLocation] = React.useState("BBMP Ward 142 Indiranagar");

  const handleOpenReview = (proto: PrototypeSubmission) => {
    setSelectedProto(proto);
    if (proto.reviewDecision && proto.reviewDecision !== "pending") {
      setDecision(proto.reviewDecision);
    }
    if (proto.reviewNotes) {
      setSuggestions(proto.reviewNotes);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProto) return;
    reviewPrototypeMutation.mutate(
      {
        prototypeId: selectedProto.id,
        decision,
        technicalViabilityScore: techScore,
        fieldReadinessScore: fieldScore,
        suggestedImprovements: suggestions,
        schedulePilotOption: decision === "approved",
        pilotLocationSuggested: pilotLocation,
      },
      {
        onSuccess: () => setSelectedProto(null),
      }
    );
  };

  const handleScheduleDemo = (proto: PrototypeSubmission) => {
    toast.success(`Live demonstration session requested for ${proto.projectTitle}. Calendar invitation sent.`);
  };

  const handleDeployPilot = (proto: PrototypeSubmission) => {
    toast.success(`Pilot Deployment authorized for ${proto.prototypeVersion} at ${proto.pilotLocation || "Designated Municipal Sandbox"}.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Prototype Support & Testing</h1>
          <p className="text-sm text-muted-foreground">
            Review academic hardware prototypes, suggest design improvements, schedule live demos, and authorize municipal pilots.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1.5">
          <Cpu className="h-3.5 w-3.5" />
          <span>TRL 5-7 Hardware Sandbox</span>
        </Badge>
      </div>

      {/* Prototype Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(prototypes || []).map((proto) => (
          <Card key={proto.id} className="border-border/80 bg-card rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">{proto.university}</Badge>
                <Badge
                  variant={
                    proto.reviewDecision === "approved"
                      ? "success"
                      : proto.reviewDecision === "improvements_required"
                      ? "warning"
                      : "secondary"
                  }
                  className="text-[10px]"
                >
                  {(proto.reviewDecision || proto.testingStatus).toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-foreground leading-snug">
                {proto.projectTitle}
              </CardTitle>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{proto.prototypeVersion}</p>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Hardware Components:</span>
                  <p className="font-mono text-[11px] text-foreground leading-snug mt-0.5">{proto.hardwareSpecifications}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Firmware Build:</span>
                  <p className="font-mono text-[11px] text-muted-foreground">{proto.firmwareVersion}</p>
                </div>
              </div>

              {proto.reviewNotes && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                  <span className="font-bold block">Review Feedback:</span>
                  <p>{proto.reviewNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <Button
                  onClick={() => handleOpenReview(proto)}
                  variant="gradient"
                  size="sm"
                  className="w-full rounded-xl text-xs font-bold gap-1 shadow"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>Upload Prototype Review</span>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleScheduleDemo(proto)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs gap-1"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Schedule Demo</span>
                  </Button>
                  <Button
                    onClick={() => handleDeployPilot(proto)}
                    variant="secondary"
                    size="sm"
                    className="rounded-xl text-xs gap-1"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    <span>Deploy Pilot</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Prototype Review Modal */}
      <Dialog open={!!selectedProto} onOpenChange={(open) => !open && setSelectedProto(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Prototype Evaluation & Decision</DialogTitle>
            <DialogDescription className="text-xs">
              Log technical assessment, approve hardware rig, or suggest modifications.
            </DialogDescription>
          </DialogHeader>

          {selectedProto && (
            <form onSubmit={handleSubmitReview} className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-0.5">
                <p className="font-bold text-foreground">{selectedProto.projectTitle}</p>
                <p className="text-muted-foreground">{selectedProto.prototypeVersion} • {selectedProto.university}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Evaluation Decision</Label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="w-full rounded-xl border border-border/80 bg-muted/40 p-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="approved">Approve Prototype for Municipal Sandbox Pilot</option>
                  <option value="improvements_required">Request Engineering Improvements & Resubmission</option>
                  <option value="rejected">Decline Prototype</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Technical Viability (100)</Label>
                  <Input type="number" min={1} max={100} value={techScore} onChange={(e) => setTechScore(Number(e.target.value))} className="rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Field Readiness (100)</Label>
                  <Input type="number" min={1} max={100} value={fieldScore} onChange={(e) => setFieldScore(Number(e.target.value))} className="rounded-xl" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Suggested Improvements / Review Feedback</Label>
                <Textarea value={suggestions} onChange={(e) => setSuggestions(e.target.value)} className="rounded-xl h-20 text-xs" required />
              </div>

              {decision === "approved" && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Suggested Pilot Deployment Location</Label>
                  <Input value={pilotLocation} onChange={(e) => setPilotLocation(e.target.value)} className="rounded-xl" />
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedProto(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={reviewPrototypeMutation.isPending} variant="gradient" className="rounded-xl font-bold">
                  {reviewPrototypeMutation.isPending ? "Logging Review..." : "Confirm Review"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
