import * as React from "react";
import Link from "next/link";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { ArrowRight, CheckCircle2, FileUp, Sparkles, Send, CheckCircle, CheckSquare } from "lucide-react";

export const metadata = {
  title: "How It Works | Social-X Smart Governance Platform",
  description: "Step-by-step lifecycle of civic issue filing, AI validation, and multi-stakeholder resolution.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Step 1: Capture Grievance On-The-Go",
      desc: "Use your smartphone to snap a photo of a civic issue (e.g. pothole, sewage leak, broken street lamp), record a quick 15-second voice note, or drop relevant PDF documents. Your GPS position is captured automatically.",
      tag: "Citizen Action",
      icon: <FileUp className="h-6 w-6 text-blue-500" />,
    },
    {
      step: "02",
      title: "Step 2: AI Multi-Modal Engine Analysis",
      desc: "Our FastAPI engine immediately parses the media. OCR scans any text signs or markings; Speech-to-Text converts vernacular audio; Computer Vision classifies the defect severity and calculates an AI Confidence Score.",
      tag: "AI Processing",
      icon: <Sparkles className="h-6 w-6 text-indigo-500" />,
    },
    {
      step: "03",
      title: "Step 3: Citizen Verification in AI Preview",
      desc: "Before submission, you review the extracted title, category, department recommendation, and location. You can tweak or override any field to ensure 100% human-verified accuracy.",
      tag: "Citizen Review",
      icon: <CheckCircle className="h-6 w-6 text-amber-500" />,
    },
    {
      step: "04",
      title: "Step 4: Multi-Stakeholder Action & Resolution",
      desc: "The case enters the Department work queue with an active SLA timer. Academic teams are alerted if the problem suggests systemic infrastructure failure. Field officers execute repairs and upload resolution proof for citizen sign-off.",
      tag: "Collaborative Resolution",
      icon: <CheckSquare className="h-6 w-6 text-emerald-500" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="info">Transparent Lifecycle</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          From Street Problem to Verified Solution
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          See how Social-X ensures every report is tracked, assigned without bias,
          and solved collaboratively.
        </p>
      </div>

      {/* Steps Vertical Timeline */}
      <div className="space-y-6">
        {steps.map((item, idx) => (
          <Card key={idx} className="border-border/80 bg-card overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-2xl font-black text-primary">
                {item.step}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action CTA */}
      <div className="text-center pt-8 space-y-4">
        <h3 className="text-2xl font-bold text-foreground">
          Ready to experience the workflow yourself?
        </h3>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="gradient" className="rounded-xl">
            <Link href="/register">
              <span>Sign Up as Citizen</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/login/citizen">Citizen Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
