import * as React from "react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import {
  Camera,
  Mic,
  FileCheck,
  MapPin,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
  Smartphone,
  Workflow,
} from "lucide-react";

export const metadata = {
  title: "Features | Social-X Smart Governance Platform",
  description: "Explore the multimodal AI reporting, department routing, and tracking capabilities of Social-X.",
};

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="purple">Platform Capabilities</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Next-Generation Civic Technology Stack
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Social-X combines computer vision, speech processing, and automated
          orchestration to eliminate friction at every stage of societal governance.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Camera className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Multimodal Ingestion Engine
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Citizens are no longer restricted to long text forms. Upload high-definition
            photos, video clips, official scanned complaint documents, or direct microphone
            voice recordings. The backend microservice extracts visual features and
            context automatically.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              OCR Text Extraction
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Speech-to-Text
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              EXIF & GPS Parse
            </span>
          </div>
        </Card>

        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Cpu className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Interactive AI Preview Screen
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Transparency starts before submission. After analyzing the media, our AI
            presents an editable preview showing the OCR output, STT transcript, detected
            category, estimated severity, and recommended department. Citizens retain full
            control to edit and confirm.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Confidence Scoring
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Human-in-the-Loop
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Zero Guesswork
            </span>
          </div>
        </Card>

        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Workflow className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Automated Department & Ward Dispatch
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Leveraging spatial boundary coordinates and domain taxonomy, reports are
            immediately delivered to the designated municipal nodal officer, bypassing
            manual paper distribution and reducing response times from weeks to hours.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Spatial Indexing
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              SLA Countdown
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Automated Escalation
            </span>
          </div>
        </Card>

        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Verifiable Resolution & Evidence Vault
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Resolving an issue requires photographic before-and-after proof from field
            workers. Once uploaded, the citizen and community are notified to rate and
            validate resolution before a case is archived.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Before/After Verification
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Citizen Feedback Signoff
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground">
              Audit Logs
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
