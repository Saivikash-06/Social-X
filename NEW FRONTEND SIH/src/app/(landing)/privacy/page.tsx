import * as React from "react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Social-X Smart Governance Platform",
  description: "Privacy policy and data governance terms for Social-X platform.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-10">
      <div className="space-y-3">
        <Badge variant="success">Data Protection & Privacy</Badge>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Social-X Privacy Commitment
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: September 2026 • Compliant with DPDP Act & Open Governance Standards
        </p>
      </div>

      <Card className="border-border/80 bg-card p-8 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            The Social-X platform values citizen privacy and trust. When you report
            societal issues, we collect only necessary data points required to route,
            verify, and resolve civic challenges with authorized administrative agencies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">Citizen Account Information:</strong> Name,
              email address, phone number, and district of residence.
            </li>
            <li>
              <strong className="text-foreground">Grievance Media:</strong> Photographs,
              videos, audio recordings, documents, and GPS coordinates you upload.
            </li>
            <li>
              <strong className="text-foreground">AI Ingestion Outputs:</strong> Optical
              character recognition text and speech-to-text transcriptions produced by our
              FastAPI processing engine.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. How Media & Location are Used</h2>
          <p>
            Media and GPS data are utilized strictly to dispatch appropriate field personnel
            and allow academic research partners to study systemic civic defects. Personal
            identifiers (such as phone numbers) are masked from public trackers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Citizen Data Rights</h2>
          <p>
            Citizens retain the right to view, modify, export, or request deletion of their
            account profile and personal records under the Citizen Settings portal at any
            time.
          </p>
        </section>
      </Card>
    </div>
  );
}
