"use client";

import * as React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Phone,
  Mail,
  FileQuestion,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { SearchInput } from "@/features/shared/components/ui/search-input";
import { cn } from "@/lib/utils";

const HELPLINE_CONTACTS = [
  { name: "Civic Emergency & Disaster Helpline", number: "112", badge: "24/7 Toll-Free" },
  { name: "Water Supply (BWSSB) Escalation", number: "1916", badge: "Direct Line" },
  { name: "Electricity (BESCOM) Power Outage", number: "1912", badge: "Direct Line" },
  { name: "Municipal (BBMP) Control Room", number: "080-22660000", badge: "Toll-Free" },
];

const CITIZEN_GUIDES = [
  {
    title: "How does the AI Multi-Modal Engine work?",
    content:
      "When you attach a photo or audio memo, our FastAPI AI microservice scans for visible text on signboards, identifies defect categories, and transcribes voice notes. In the AI Preview Screen, you can review and edit every single extracted field before confirming your submission.",
  },
  {
    title: "What happens after I submit a grievance?",
    content:
      "Your issue is given a unique tracking ID (e.g., SOC-2026-8821) and automatically routed to the responsible municipal department based on your ward's spatial coordinates. University research partners and NGO observers are synced immediately.",
  },
  {
    title: "How does SLA tracking work?",
    content:
      "Every grievance category has a statutory Service Level Agreement (e.g. 72 hours for water supply ruptures). You can watch the countdown in the Track Issues view. If the SLA expires without field progress, it automatically escalates to senior administrative oversight.",
  },
  {
    title: "Can I verify whether a repair was genuinely resolved?",
    content:
      "Yes. Officers are required to upload photo evidence of the completed repair. You will receive a prompt to validate the repair and provide a 1-5 star citizen satisfaction rating.",
  },
];

export default function CitizenHelpPage() {
  const [search, setSearch] = React.useState("");
  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);

  const toggleIndex = (i: number) => {
    setOpenIndexes((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  const filteredGuides = CITIZEN_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-border/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Citizen Help & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Reporting guidelines, emergency department helplines, and FAQs
        </p>
      </div>

      {/* Emergency Helplines Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Government Emergency Helplines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HELPLINE_CONTACTS.map((c, idx) => (
            <Card key={idx} className="border-border/80 bg-card p-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground block">
                    {c.name}
                  </span>
                  <a
                    href={`tel:${c.number}`}
                    className="font-mono text-base font-black text-primary hover:underline"
                  >
                    {c.number}
                  </a>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {c.badge}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Citizen Guides & FAQs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Frequently Asked Questions
          </h2>
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search help topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredGuides.map((guide, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <Card
                key={idx}
                className={cn(
                  "border-border/80 transition-all overflow-hidden",
                  isOpen ? "border-primary/40 bg-card" : "bg-card/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground focus:outline-none"
                >
                  <span>{guide.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen && (
                  <CardContent className="px-4 pb-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {guide.content}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Direct Contact Support Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 p-6 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Mail className="h-4 w-4" />
          <span>Need Direct Technical Support?</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If you encounter any bugs, crashes, or difficulty with media uploads on Social-X,
          you can reach our specialized engineering team at{" "}
          <strong className="text-foreground">support@social-x.gov.in</strong>.
        </p>
      </Card>
    </div>
  );
}
