"use client";

import * as React from "react";
import {
  Network,
  Building,
  GraduationCap,
  Briefcase,
  FlaskConical,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  PlusCircle,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import { useCollaborations } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoCollaborationsPage() {
  const { data: partners, isLoading } = useCollaborations();
  const [activeTab, setActiveTab] = React.useState<"all" | "Government" | "University" | "Industry" | "Research Organization">("all");
  const [discussionInput, setDiscussionInput] = React.useState("");

  const filteredPartners = (partners || []).filter(
    (p) => activeTab === "all" || p.partnerType === activeTab
  );

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
    toast.success("Broadcast note transmitted to active collaboration partners.");
    setDiscussionInput("");
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case "Government":
        return <Building className="h-5 w-5 text-emerald-600" />;
      case "University":
        return <GraduationCap className="h-5 w-5 text-blue-600" />;
      case "Industry":
        return <Briefcase className="h-5 w-5 text-amber-600" />;
      case "Research Organization":
        return <FlaskConical className="h-5 w-5 text-indigo-600" />;
      default:
        return <Network className="h-5 w-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Network className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Multi-Stakeholder Collaboration Hub</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Co-execute civic interventions with Government line departments, Universities, Corporate CSR, and Research Labs
          </p>
        </div>
      </div>

      {/* Stakeholder Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "Government", "University", "Industry", "Research Organization"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl text-xs font-semibold ${
              activeTab === tab ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
            }`}
          >
            {tab === "all" ? "All Stakeholders" : tab}
          </Button>
        ))}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="rounded-3xl border-border/80 bg-card shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 border border-border/70">
                    {getPartnerIcon(partner.partnerType)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{partner.partnerName}</h3>
                    <p className="text-xs text-muted-foreground">{partner.partnerType} • Since {partner.establishedDate}</p>
                  </div>
                </div>

                <Badge variant={partner.status === "Accepted" ? "success" : "warning"} className="text-[10px]">
                  {partner.status}
                </Badge>
              </div>

              {/* Joint Initiative */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Joint Initiative</span>
                <p className="font-semibold text-foreground">{partner.projectTitle}</p>
              </div>

              {/* Contact Person */}
              <div className="text-xs text-muted-foreground">
                <strong>Lead Officer:</strong> {partner.contactPerson} ({partner.email})
              </div>

              {/* Shared Documents */}
              {partner.sharedDocuments.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-muted-foreground">Shared Formal Agreements & Datasets:</span>
                  <div className="space-y-1">
                    {partner.sharedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/60 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{doc.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{doc.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Discussion Note */}
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <p className="leading-snug">{partner.recentDiscussion}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consortium Discussion Panel */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span>Consortium Discussion Panel</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Send an instant operational notice to all connected government, academic, and corporate partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostDiscussion} className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                placeholder="Broadcast a project milestone, field requirement, or meeting agenda..."
                className="rounded-2xl text-xs bg-muted/30"
              />
              <Button type="submit" className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 px-5">
                <Send className="h-3.5 w-3.5" />
                <span>Transmit</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
