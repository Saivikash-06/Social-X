import * as React from "react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Building, Target, Shield, HeartHandshake, Eye, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Us | Social-X Smart Governance Platform",
  description: "Learn about the mission, vision, and institutional framework behind Social-X.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="info">About Social-X</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Transforming Governance Through Citizen Collaboration & AI
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Social-X was conceived to solve the fundamental disconnect between citizens
          experiencing everyday societal challenges and the institutions tasked with
          resolving them.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To provide an AI-driven, transparent, and multi-stakeholder ecosystem where
            every citizen grievance is captured, classified with zero bureaucratic lag,
            and resolved through collaborative synergy between government bodies,
            academic researchers, industry CSR, and civil society NGOs.
          </p>
        </Card>

        <Card className="border-border/80 bg-card p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            A future where smart cities and rural districts operate with proactive,
            predictive governance. By leveraging multimodal AI, societal problems are
            identified before they escalate, fostering high civic trust, accountability,
            and technological self-reliance.
          </p>
        </Card>
      </div>

      {/* The 5 Stakeholder Model */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">The Multi-Stakeholder Quad</h2>
          <p className="text-muted-foreground">
            How Social-X brings five critical pillars of society to a single table.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Pillar 01
            </span>
            <h3 className="text-lg font-bold text-foreground">Citizens</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowered with mobile-first reporting tools, voice memos, OCR photo inputs,
              and live status tracking with full transparency.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Pillar 02
            </span>
            <h3 className="text-lg font-bold text-foreground">Government & Municipalities</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Equipped with automated department routing, SLA countdowns, and geo-spatial
              heatmaps to deploy field teams effectively.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
              Pillar 03
            </span>
            <h3 className="text-lg font-bold text-foreground">Universities & Academia</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Given access to anonymized civic data streams to develop real-world R&D,
              IoT prototypes, and sustainable engineering interventions.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Pillar 04
            </span>
            <h3 className="text-lg font-bold text-foreground">Industry & Corporate CSR</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Directly sponsor high-impact civic interventions, infrastructure upgrades,
              and technology deployments under verifiable CSR impact standards.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Pillar 05
            </span>
            <h3 className="text-lg font-bold text-foreground">NGOs & Civic Societies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Act as independent community observers, ground auditors, and advocates
              to ensure marginalized neighborhoods receive equal priority.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2">
            <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">
              Core Engine
            </span>
            <h3 className="text-lg font-bold text-foreground">FastAPI AI Microservice Mesh</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              High-throughput asynchronous engines for optical character recognition,
              audio transcription, and neural jurisdiction matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
