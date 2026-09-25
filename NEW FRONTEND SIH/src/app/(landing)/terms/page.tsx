import * as React from "react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";

export const metadata = {
  title: "Terms of Service | Social-X Smart Governance Platform",
  description: "Terms and conditions for utilizing the Social-X platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-10">
      <div className="space-y-3">
        <Badge variant="outline">Legal Agreement</Badge>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: September 2026 • Governing Public Civic Participation
        </p>
      </div>

      <Card className="border-border/80 bg-card p-8 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or registering on the Social-X platform, you agree to comply
            with these Terms of Service, community reporting guidelines, and relevant
            civic protection laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Truthful Reporting & Media Accuracy</h2>
          <p>
            Citizens must submit accurate, authentic grievance reports. Willful submission
            of falsified images, defamatory statements, or spam may lead to suspension of
            citizen filing privileges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Multi-Stakeholder Collaboration</h2>
          <p>
            Reports submitted on Social-X are shared across authorized government departments,
            university laboratories, and NGO observers to ensure speedy, transparent
            resolution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Disclaimers & Emergency Notice</h2>
          <p>
            Social-X is a smart governance platform for infrastructure, civic issues, and
            societal innovation. For immediate life-threatening emergencies, citizens must
            contact local emergency response numbers directly (e.g. 112 / 100).
          </p>
        </section>
      </Card>
    </div>
  );
}
