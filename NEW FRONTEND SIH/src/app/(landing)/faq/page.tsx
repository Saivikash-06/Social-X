"use client";

import * as React from "react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { SearchInput } from "@/features/shared/components/ui/search-input";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "Filing Issues",
    question: "What types of media can I submit with my civic issue report?",
    answer:
      "Social-X supports photos (JPEG, PNG, WEBP), recorded video clips (MP4, MOV), direct voice memos via your microphone (Speech-to-Text processed), and official documents (PDF). You can also include exact GPS coordinates via our map interface.",
  },
  {
    category: "Filing Issues",
    question: "What is the AI Preview Screen before submission?",
    answer:
      "Before your report is permanently recorded, our FastAPI microservice parses the media to extract signboards/labels via OCR, transcribes audio, and suggests the most likely civic department and category. You have the ability to review, edit, or override any suggested detail before confirming.",
  },
  {
    category: "Tracking & Resolution",
    question: "How do I track the progress of my reported issue?",
    answer:
      "Once submitted, you receive a unique Issue ID (e.g., SOC-7824). You can track live milestones on your Citizen Dashboard, showing assigned officers, work orders, on-site repairs, and photographic evidence of completion.",
  },
  {
    category: "Tracking & Resolution",
    question: "Can I dispute a resolution if the issue wasn't properly fixed?",
    answer:
      "Yes! When an officer marks a case as resolved, citizens receive a prompt with before-and-after photos. If the repair is inadequate, you can decline the resolution and request re-inspection with additional remarks.",
  },
  {
    category: "Roles & Access",
    question: "Why can't I log in as a Municipal Officer or University Researcher here?",
    answer:
      "Module 1 is exclusively dedicated to the Public Citizen Portal and Authentication. Government, University, Industry, and NGO dashboards are managed through their respective enterprise modules in subsequent rollout phases.",
  },
  {
    category: "Privacy & Security",
    question: "Is my personal data visible to the public or contractors?",
    answer:
      "No. Social-X strictly adheres to data protection standards. Your phone number, residential address, and identity are encrypted. Only verified nodal officers have necessary contact access for on-site inquiry.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = React.useState("");
  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="purple">Frequently Asked Questions</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Everything You Need to Know
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Find answers about filing reports, our AI analysis engine, and resolution
          accountability.
        </p>

        <div className="pt-4 max-w-md mx-auto">
          <SearchInput
            placeholder="Search FAQs by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No matching questions found for "{search}".
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <Card
                key={index}
                className={cn(
                  "border-border/80 transition-all duration-200 overflow-hidden",
                  isOpen ? "border-primary/40 bg-card shadow-sm" : "bg-card/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-foreground focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      {faq.category}
                    </span>
                    <span className="text-base sm:text-lg">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen && (
                  <CardContent className="px-6 pb-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
