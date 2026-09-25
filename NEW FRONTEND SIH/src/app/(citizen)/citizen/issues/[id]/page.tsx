"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
  Download,
  CheckCircle2,
  Crosshair,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { LeafletMap } from "@/features/shared/components/maps/leaflet-map";
import {
  getStatusBadge,
  getPriorityBadge,
} from "@/features/citizen/components/my-issues-table";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";

export default function IssueDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "SOC-2026-8821";

  const { useIssue } = useCitizenQueries();
  const { data: issue, isLoading } = useIssue(id);

  if (isLoading || !issue) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading issue specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation Top */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1.5 w-fit">
          <Link href="/citizen/issues">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Issues</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5">
            <Link href={`/citizen/track`}>
              <Crosshair className="h-4 w-4" />
              <span>Open SLA Tracker</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <Card className="border-border/80 bg-card rounded-3xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-6 sm:p-8 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-primary">
                {issue.id}
              </span>
              {getStatusBadge(issue.status)}
              {getPriorityBadge(issue.priority)}
              <Badge variant="outline" className="text-xs">
                {issue.category}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {issue.title}
            </h1>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 sm:text-right shrink-0">
            <p className="flex items-center sm:justify-end gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Reported: {new Date(issue.createdAt).toLocaleString("en-IN")}</span>
            </p>
            {issue.estimatedResolutionDate && (
              <p className="flex items-center sm:justify-end gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  SLA Target: {new Date(issue.estimatedResolutionDate).toLocaleDateString("en-IN")}
                </span>
              </p>
            )}
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Grievance Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Grievance Description
            </h3>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Quad-Stakeholder Assignment Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assigned Governance & Innovation Entities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Building2 className="h-4 w-4" />
                  <span>Nodal Department</span>
                </div>
                <p className="font-bold text-sm text-foreground">
                  {issue.assignedDepartment || "Automatic Routing in progress"}
                </p>
                {issue.assignedOfficer && (
                  <p className="text-xs text-muted-foreground">
                    Officer: {issue.assignedOfficer} ({issue.officerContact})
                  </p>
                )}
              </div>

              {/* University */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4" />
                  <span>University R&D Lab</span>
                </div>
                <p className="font-bold text-sm text-foreground">
                  {issue.assignedUniversity || "Not yet tagged for academic R&D"}
                </p>
                {issue.universityProject && (
                  <p className="text-xs text-muted-foreground">
                    Project: {issue.universityProject}
                  </p>
                )}
              </div>

              {/* NGO */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Users className="h-4 w-4" />
                  <span>Civil Society NGO</span>
                </div>
                <p className="font-bold text-sm text-foreground">
                  {issue.assignedNgo || "Civic Oversight Committee"}
                </p>
                {issue.ngoObserver && (
                  <p className="text-xs text-muted-foreground">
                    Observer: {issue.ngoObserver}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Extraction Audit Logs */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Cpu className="h-4 w-4 text-primary" />
                <span>FastAPI AI Multi-Modal Engine Verification Log</span>
              </div>
              <Badge variant="success">
                Confidence: {issue.aiConfidenceScore || 97.4}%
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-background border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-sans">
                  OCR Text Output
                </span>
                <span className="text-foreground mt-1 block">
                  {issue.ocrExtractedText || "No textual signage detected"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-sans">
                  Speech-to-Text Transcript
                </span>
                <span className="text-foreground mt-1 block">
                  {issue.sttTranscript || "Voice memo not attached"}
                </span>
              </div>
            </div>
          </div>

          {/* Attached Evidence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Photographic Evidence
            </h3>
            {issue.attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-xs"
                  >
                    <img
                      src={att.url}
                      alt={att.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-3 bg-card border-t border-border flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {att.name}
                      </span>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No external image files attached to this grievance report.
              </p>
            )}
          </div>

          {/* Incident Location Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Incident Location & Spatial Coordinates
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
              </span>
            </div>
            <LeafletMap
              latitude={issue.latitude}
              longitude={issue.longitude}
              zoom={15}
              interactive={false}
              markerTitle={issue.title}
              className="h-64"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{issue.address}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
