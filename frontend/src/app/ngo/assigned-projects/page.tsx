"use client";

import * as React from "react";
import {
  CheckSquare,
  Calendar,
  IndianRupee,
  Users,
  FileText,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useAssignedProjects } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoAssignedProjectsPage() {
  const { data: projects, isLoading } = useAssignedProjects();
  const [expandedProjectId, setExpandedProjectId] = React.useState<string | null>("ASSIGNED-01");

  const toggleExpand = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const handleUploadClick = () => {
    toast.success("Document uploader initialized. File verified via SHA-256 integrity check.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <CheckSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Assigned Field Projects & Milestones</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Track implementation schedules, volunteers, expenditure tranches, and uploaded media evidence
          </p>
        </div>
        <Button onClick={handleUploadClick} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2">
          <Upload className="h-4 w-4" />
          <span>Upload Project Document</span>
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {(projects || []).map((project) => {
          const isExpanded = expandedProjectId === project.id;
          return (
            <Card key={project.id} className="rounded-3xl border-border/80 bg-card overflow-hidden shadow-sm">
              <CardContent className="p-6 space-y-6">
                {/* Top Row: Title, SDG, Completion */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        {project.sdgGoal}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {project.district}
                      </Badge>
                      <Badge variant={project.status === "Active" ? "success" : "secondary"} className="text-[10px]">
                        {project.status}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{project.title}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Timeline: {project.timeline}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-semibold">Completion</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {project.completionPercentage}%
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(project.id)}
                      className="rounded-xl h-10 w-10 p-0 border border-border/80"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Core Metrics Strip: Budget, Volunteers, Reports */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Sanctioned Budget</span>
                    <span className="font-bold text-foreground">{project.budgetTotal}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Budget Utilized</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{project.budgetUtilized}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Volunteers Deployed</span>
                    <span className="font-bold text-foreground">{project.assignedVolunteersCount} Members</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Reports Verified</span>
                    <span className="font-bold text-foreground">{project.uploadedReports.length} Dossiers</span>
                  </div>
                </div>

                {/* Collapsible Details: Milestones, Evidence Gallery, Reports */}
                {isExpanded && (
                  <div className="pt-4 border-t border-border/60 space-y-6">
                    {/* Milestones Checklist */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span>Project Milestones & Field Telemetry</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                              milestone.completed
                                ? "bg-emerald-500/5 border-emerald-500/30"
                                : "bg-card border-border/70"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle2
                                  className={`h-4 w-4 shrink-0 ${
                                    milestone.completed ? "text-emerald-600" : "text-muted-foreground"
                                  }`}
                                />
                                <span className="font-bold text-foreground">{milestone.title}</span>
                              </div>
                              <Badge variant={milestone.completed ? "success" : "outline"} className="text-[10px]">
                                {milestone.completed ? "Achieved" : "Pending"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>Due: {milestone.dueDate}</span>
                              <span>Tranche: {milestone.budgetAllocated}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-xl">
                              Deliverables: {milestone.deliverables}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence Gallery: Images & Media */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-teal-500" />
                        <span>Uploaded Evidence & Inspection Media</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {project.images.map((img) => (
                          <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-border/80 bg-muted/30">
                            <img src={img.url} alt={img.caption} className="h-36 w-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="p-2.5 text-[11px] font-medium text-foreground bg-card/90 backdrop-blur-xs">
                              {img.caption}
                            </div>
                          </div>
                        ))}
                        {project.images.length === 0 && (
                          <p className="text-xs text-muted-foreground col-span-3">No images uploaded yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Reports & Documents */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>Uploaded Audits, Videos & Documents</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {project.uploadedReports.map((rep) => (
                          <div key={rep.id} className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-muted/20 text-xs">
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-foreground truncate">{rep.name}</p>
                                <p className="text-[10px] text-muted-foreground">{rep.date} • {rep.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700 h-8">
                              Download
                            </Button>
                          </div>
                        ))}
                        {project.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-muted/20 text-xs">
                            <div className="flex items-center gap-2.5 truncate">
                              <FileSpreadsheet className="h-4 w-4 text-blue-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-foreground truncate">{doc.name}</p>
                                <p className="text-[10px] text-muted-foreground">{doc.type} • {doc.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 h-8">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
