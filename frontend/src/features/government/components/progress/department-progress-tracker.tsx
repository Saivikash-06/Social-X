"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  Image as ImageIcon,
  Info,
  Layers,
  MapPin,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  Volume2,
  Wrench,
  X,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/features/shared/components/ui/dialog";
import { useGovernmentDepartments, useGovernmentOfficers } from "@/features/government/hooks/use-government-queries";
import { GovernmentDepartment, GovernmentOfficer } from "@/features/government/types";
import { toast } from "sonner";

// 12-Step Visual Workflow Timeline Definition
export interface WorkflowStep {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  stageIndex: number;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "citizen_submitted", name: "Citizen Submitted", shortLabel: "Submitted", description: "Grievance lodged with geotagged media", stageIndex: 1 },
  { id: "ai_analysis", name: "AI Analysis", shortLabel: "AI Analysis", description: "Vision OCR, speech transcript & severity classification", stageIndex: 2 },
  { id: "department_assigned", name: "Department Assigned", shortLabel: "Dept Assigned", description: "Routed to municipal line department nodal command", stageIndex: 3 },
  { id: "officer_inspection", name: "Officer Inspection", shortLabel: "Officer Inspection", description: "Physical site inspection & structural evaluation", stageIndex: 4 },
  { id: "technical_approval", name: "Technical Approval", shortLabel: "Tech Approval", description: "Engineering estimation & administrative sanctions", stageIndex: 5 },
  { id: "external_assignment", name: "Industry/NGO/University Assignment", shortLabel: "Partner Match", description: "Specialized partner mobilization (if required)", stageIndex: 6 },
  { id: "work_in_progress", name: "Work in Progress", shortLabel: "Work In Progress", description: "Active civil repairs, pipe replacement & infrastructure execution", stageIndex: 7 },
  { id: "testing", name: "Testing", shortLabel: "Testing", description: "Hydraulic, electrical or structural quality assurance testing", stageIndex: 8 },
  { id: "government_verification", name: "Government Verification", shortLabel: "Govt Verification", description: "Superintending engineer final inspection & sign-off", stageIndex: 9 },
  { id: "payment_released", name: "Payment Released", shortLabel: "Payment Released", description: "Budget grant disbursement & contractor invoice settlement", stageIndex: 10 },
  { id: "citizen_feedback", name: "Citizen Feedback", shortLabel: "Citizen Feedback", description: "Citizen verification & satisfaction rating collected", stageIndex: 11 },
  { id: "case_closed", name: "Case Closed", shortLabel: "Case Closed", description: "Permanent municipal case resolution & archived record", stageIndex: 12 },
];

export function calculateWorkflowProgress(issue: any) {
  const status = (issue.status || "").toLowerCase();

  // Check if delayed
  let isDelayed = status === "escalated";
  if (!isDelayed && issue.slaDeadline && status !== "resolved" && status !== "closed") {
    try {
      const match = issue.slaDeadline.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const slaDate = new Date(match[1]);
        if (!isNaN(slaDate.getTime()) && slaDate.getTime() < Date.now() - 24 * 3600 * 1000) {
          isDelayed = true;
        }
      }
    } catch {
      // ignore
    }
  }

  let currentIndex = 1;
  if (status === "submitted") {
    currentIndex = 1;
  } else if (status === "under_review") {
    currentIndex = 2;
  } else if (status === "assigned" || status === "assigned_to_government") {
    currentIndex = 3;
  } else if (status === "inspection" || status === "officer_inspection") {
    currentIndex = 4;
  } else if (status === "technical_approval" || status === "under_government_review") {
    currentIndex = 5;
  } else if (
    status === "assigned_to_industry" ||
    status === "assigned_to_university" ||
    status === "student_development" ||
    status === "faculty_review" ||
    status === "industry_review"
  ) {
    currentIndex = 6;
  } else if (status === "in_progress") {
    currentIndex = 7;
  } else if (status === "testing" || status === "industry_validation") {
    currentIndex = 8;
  } else if (status === "government_inspection" || status === "resolved") {
    currentIndex = 9;
  } else if (
    status === "payment_released" ||
    status === "payment_approved" ||
    issue.paymentStatus === "released" ||
    issue.paymentStatus === "completed"
  ) {
    currentIndex = 10;
  } else if (
    status === "feedback_pending" ||
    status === "impact_assessment" ||
    issue.citizenFeedback
  ) {
    currentIndex = 11;
  } else if (status === "closed") {
    currentIndex = 12;
  }

  // Calculate percentage
  let progressPercentage = 0;
  if (currentIndex === 12) {
    progressPercentage = 100;
  } else {
    progressPercentage = Math.min(95, Math.round(((currentIndex - 0.5) / 12) * 100));
  }

  // Steps state
  const steps = WORKFLOW_STEPS.map((step) => {
    let state: "completed" | "current" | "pending" | "delayed" = "pending";
    if (step.stageIndex < currentIndex) {
      state = "completed";
    } else if (step.stageIndex === currentIndex) {
      state = isDelayed ? "delayed" : "current";
    } else {
      state = "pending";
    }
    return {
      ...step,
      state,
    };
  });

  return {
    currentIndex,
    isDelayed,
    progressPercentage,
    currentStep: WORKFLOW_STEPS[currentIndex - 1],
    steps,
  };
}

export function DepartmentProgressTracker() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const rawDeptId = Array.isArray(params?.departmentId)
    ? params.departmentId[0]
    : (params?.departmentId as string) || "";
  const departmentId = decodeURIComponent(rawDeptId);

  // 1. Fetch Department Info
  const { data: departments, isLoading: deptsLoading } = useGovernmentDepartments();
  const { data: officers } = useGovernmentOfficers();

  const currentDepartment = React.useMemo(() => {
    if (!departments) return null;
    const match = departments.find(
      (d) =>
        d.id.toLowerCase() === departmentId.toLowerCase() ||
        d.code.toLowerCase() === departmentId.toLowerCase() ||
        d.name.toLowerCase().includes(departmentId.toLowerCase())
    );
    if (match) return match;
    // Fallback to first department if not found
    return departments[0] || null;
  }, [departments, departmentId]);

  // 2. Fetch Issues from Real Backend API
  const issuesQueryKey = ["department_issues", currentDepartment?.name || departmentId];
  const {
    data: issuesData,
    isLoading: issuesLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: issuesQueryKey,
    queryFn: async () => {
      const deptQuery = currentDepartment?.name || currentDepartment?.code || departmentId;
      const res = await fetch(`/api/issues?department=${encodeURIComponent(deptQuery)}&limit=100`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to load department issues from central API");
      }
      const json = await res.json();
      return (json.items || json.data || []) as any[];
    },
    refetchInterval: 10000, // Poll every 10 seconds for real-time live updates
    enabled: Boolean(currentDepartment || departmentId),
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [officerFilter, setOfficerFilter] = React.useState("all");
  const [expandedIssueId, setExpandedIssueId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"timeline" | "worklog" | "media" | "remarks" | "assignee" | "history">("timeline");

  // Modals state
  const [isWorkLogModalOpen, setIsWorkLogModalOpen] = React.useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = React.useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = React.useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = React.useState(false);
  const [selectedIssueForAction, setSelectedIssueForAction] = React.useState<any | null>(null);

  // Form fields
  const [workLogTitle, setWorkLogTitle] = React.useState("");
  const [workLogDescription, setWorkLogDescription] = React.useState("");
  const [workLogStage, setWorkLogStage] = React.useState("Work in Progress");
  const [workLogEvidenceUrl, setWorkLogEvidenceUrl] = React.useState("");

  const [remarkText, setRemarkText] = React.useState("");
  const [remarkAuthor, setRemarkAuthor] = React.useState(currentDepartment?.headOfficerName || "Superintending Engineer");

  const [attachmentType, setAttachmentType] = React.useState<"image" | "video" | "voiceNote" | "document">("image");
  const [attachmentUrl, setAttachmentUrl] = React.useState("");
  const [attachmentLabel, setAttachmentLabel] = React.useState("");

  const [reassignOfficerId, setReassignOfficerId] = React.useState("");
  const [reassignReason, setReassignReason] = React.useState("");

  // Media preview modal
  const [previewMediaUrl, setPreviewMediaUrl] = React.useState<string | null>(null);
  const [previewMediaTitle, setPreviewMediaTitle] = React.useState<string>("");

  // Mutations calling Backend APIs
  const updateIssueMutation = useMutation({
    mutationFn: async ({ issueId, payload }: { issueId: string; payload: any }) => {
      const res = await fetch(`/api/issues/${encodeURIComponent(issueId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update issue in backend");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Central database successfully updated!");
      queryClient.invalidateQueries({ queryKey: issuesQueryKey });
      queryClient.invalidateQueries({ queryKey: ["government"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Operation failed");
    },
  });

  const advanceStageMutation = useMutation({
    mutationFn: async ({ issueId, nextStatus, note }: { issueId: string; nextStatus: string; note: string }) => {
      const res = await fetch(`/api/issues/${encodeURIComponent(issueId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: nextStatus,
          officerName: currentDepartment?.headOfficerName || "Authorized Line Officer",
          details: note,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to advance stage in backend");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Workflow stage advanced! Citizen notified.");
      queryClient.invalidateQueries({ queryKey: issuesQueryKey });
    },
    onError: (err: any) => {
      toast.error(err.message || "Stage advancement failed");
    },
  });

  // Filtered issues list
  const filteredIssues = React.useMemo(() => {
    let list = issuesData || [];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (i) =>
          (i.id || "").toLowerCase().includes(q) ||
          (i.title || "").toLowerCase().includes(q) ||
          (i.citizenName || "").toLowerCase().includes(q) ||
          (i.location || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((i) => (i.status || "").toLowerCase() === statusFilter.toLowerCase());
    }

    if (priorityFilter !== "all") {
      list = list.filter((i) => (i.priority || "").toLowerCase() === priorityFilter.toLowerCase());
    }

    if (officerFilter !== "all") {
      list = list.filter((i) => (i.assignedOfficer || "").toLowerCase().includes(officerFilter.toLowerCase()));
    }

    return list;
  }, [issuesData, searchTerm, statusFilter, priorityFilter, officerFilter]);

  // Aggregate Metrics
  const metrics = React.useMemo(() => {
    const list = issuesData || [];
    const total = list.length;
    const inProgress = list.filter((i) => i.status === "in_progress" || i.status === "assigned").length;
    const inspection = list.filter(
      (i) =>
        i.status === "inspection" ||
        i.status === "government_inspection" ||
        i.status === "technical_approval" ||
        i.status === "testing"
    ).length;
    const resolved = list.filter((i) => i.status === "resolved" || i.status === "closed").length;
    const critical = list.filter((i) => i.priority === "critical").length;
    const high = list.filter((i) => i.priority === "high").length;

    return { total, inProgress, inspection, resolved, critical, high };
  }, [issuesData]);

  // Unique Officers for filter
  const departmentOfficersList = React.useMemo(() => {
    const list = issuesData || [];
    const set = new Set<string>();
    list.forEach((i) => {
      if (i.assignedOfficer) set.add(i.assignedOfficer);
    });
    return Array.from(set);
  }, [issuesData]);

  // Handlers for Submitting Forms
  const handleAddWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction || !workLogTitle.trim()) {
      toast.error("Please enter a title for the work log entry.");
      return;
    }
    updateIssueMutation.mutate(
      {
        issueId: selectedIssueForAction.id,
        payload: {
          workLog: {
            stage: workLogStage,
            title: workLogTitle,
            description: workLogDescription,
            actor: currentDepartment?.headOfficerName || "Site Field Supervisor",
            actorRole: "Government Engineering Unit",
            evidenceUrl: workLogEvidenceUrl || undefined,
          },
        },
      },
      {
        onSuccess: () => {
          setIsWorkLogModalOpen(false);
          setWorkLogTitle("");
          setWorkLogDescription("");
          setWorkLogEvidenceUrl("");
        },
      }
    );
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction || !remarkText.trim()) {
      toast.error("Please enter the remark text.");
      return;
    }
    updateIssueMutation.mutate(
      {
        issueId: selectedIssueForAction.id,
        payload: {
          note: remarkText,
          author: remarkAuthor || currentDepartment?.headOfficerName || "Official",
          authorRole: "Nodal Authority",
        },
      },
      {
        onSuccess: () => {
          setIsRemarkModalOpen(false);
          setRemarkText("");
        },
      }
    );
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction || !attachmentUrl.trim() || !attachmentLabel.trim()) {
      toast.error("Please provide both media URL and descriptive label.");
      return;
    }
    updateIssueMutation.mutate(
      {
        issueId: selectedIssueForAction.id,
        payload: {
          attachment: {
            type: attachmentType,
            url: attachmentUrl,
            label: attachmentLabel,
          },
        },
      },
      {
        onSuccess: () => {
          setIsAttachmentModalOpen(false);
          setAttachmentUrl("");
          setAttachmentLabel("");
        },
      }
    );
  };

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForAction || !reassignOfficerId) {
      toast.error("Please select an officer to assign.");
      return;
    }
    const chosenOfficer = officers?.find((o) => o.id === reassignOfficerId);
    updateIssueMutation.mutate(
      {
        issueId: selectedIssueForAction.id,
        payload: {
          reassign: {
            officerId: reassignOfficerId,
            officerName: chosenOfficer?.name || "Assigned Officer",
            department: currentDepartment?.name || selectedIssueForAction.assignedDepartment,
          },
        },
      },
      {
        onSuccess: () => {
          setIsReassignModalOpen(false);
          setReassignOfficerId("");
          setReassignReason("");
        },
      }
    );
  };

  const handleAdvanceStep = (issue: any) => {
    const { currentIndex } = calculateWorkflowProgress(issue);
    let nextStatus = "in_progress";
    let message = "Advancing to next project milestone.";

    if (currentIndex === 1) {
      nextStatus = "under_review";
      message = "Submitted case moved to AI Analysis & Technical Assessment.";
    } else if (currentIndex === 2) {
      nextStatus = "assigned";
      message = "Dispatched and formally assigned to Line Officer.";
    } else if (currentIndex === 3) {
      nextStatus = "inspection";
      message = "Officer physical on-site inspection scheduled & initiated.";
    } else if (currentIndex === 4) {
      nextStatus = "technical_approval";
      message = "Site inspection completed. Engineering sanction & technical approval granted.";
    } else if (currentIndex === 5) {
      nextStatus = "assigned_to_industry";
      message = "Work assigned to Industry Partner / University team for execution.";
    } else if (currentIndex === 6) {
      nextStatus = "in_progress";
      message = "Ground mobilization complete. Civil/electrical repairs in active execution.";
    } else if (currentIndex === 7) {
      nextStatus = "testing";
      message = "Civil works completed. Pressure testing & structural safety validation underway.";
    } else if (currentIndex === 8) {
      nextStatus = "government_inspection";
      message = "Testing passed. Final Government verification and engineering sign-off conducted.";
    } else if (currentIndex === 9) {
      nextStatus = "payment_released";
      message = "Government inspection certified. Contractor payment released.";
    } else if (currentIndex === 10) {
      nextStatus = "feedback_pending";
      message = "Payment settled. Citizen satisfaction rating & feedback requested.";
    } else if (currentIndex === 11) {
      nextStatus = "closed";
      message = "Citizen verified. Case formally resolved, certified and closed.";
    } else {
      toast.info("This grievance is already at final stage (Case Closed).");
      return;
    }

    advanceStageMutation.mutate({
      issueId: issue.id,
      nextStatus,
      note: message,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Breadcrumb & Department Identity */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link
                href="/government/departments"
                className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                <span>Line Departments</span>
              </Link>
              <span className="text-muted-foreground/60 text-xs">/</span>
              <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-mono font-bold">
                {currentDepartment?.code || "DEPT"}
              </Badge>
              <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Project Tracking</span>
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <span>{currentDepartment?.name || "Department Work Progress"}</span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Live monitoring dashboard for tracking every citizen complaint from submission, technical approval,
              and ground execution through to inspection, payment release, and final case closure.
            </p>
          </div>

          {/* Action Header Strip */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-muted/40 text-[11px] text-muted-foreground font-mono">
              <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>
                {isFetching ? "Syncing..." : `Live (${new Date(dataUpdatedAt || Date.now()).toLocaleTimeString()})`}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                toast.info("Refreshed complaint progress from backend!");
              }}
              disabled={isFetching}
              className="rounded-xl border-border/80 text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Nodal Officer & SLA Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Head Nodal Officer:</span>
            <div className="font-bold text-foreground truncate">{currentDepartment?.headOfficerName || "District Engineer"}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Official Email:</span>
            <div className="font-mono text-muted-foreground truncate">{currentDepartment?.headOfficerEmail || "dept@tn.gov.in"}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">SLA Adherence Target:</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {currentDepartment?.slaComplianceRate ?? 94.8}% SLA Compliance
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Budget Utilization:</span>
            <div className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              ₹{currentDepartment?.budgetUtilizedCr ?? 0}Cr / ₹{currentDepartment?.budgetAllocatedCr ?? 0}Cr
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Complaints</span>
          <div className="text-2xl font-black text-foreground mt-1 font-mono">{metrics.total}</div>
          <span className="text-[10px] text-muted-foreground">Assigned to {currentDepartment?.code || "Department"}</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm border-l-4 border-l-blue-500">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">{metrics.inProgress}</div>
          <span className="text-[10px] text-muted-foreground">Field execution underway</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm border-l-4 border-l-purple-500">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Inspection / Testing</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">{metrics.inspection}</div>
          <span className="text-[10px] text-muted-foreground">Technical review & audit</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Resolved / Closed</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{metrics.resolved}</div>
          <span className="text-[10px] text-muted-foreground">Completed & certified</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm border-l-4 border-l-red-500">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Critical Priority</span>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 font-mono">{metrics.critical}</div>
          <span className="text-[10px] text-muted-foreground">Emergency SLA response</span>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 bg-card shadow-sm border-l-4 border-l-amber-500">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">High Priority</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{metrics.high}</div>
          <span className="text-[10px] text-muted-foreground">Urgent attention needed</span>
        </Card>
      </div>

      {/* 3. Search and Multi-Filter Controls */}
      <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Issue ID, Title, Citizen, Location..."
            className="pl-9 rounded-xl border-border/80 text-xs bg-muted/30 focus-visible:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border/80 bg-muted/30 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses ({issuesData?.length ?? 0})</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">AI Analysis</option>
              <option value="assigned">Department Assigned</option>
              <option value="inspection">Officer Inspection</option>
              <option value="technical_approval">Technical Approval</option>
              <option value="assigned_to_industry">Industry Assigned</option>
              <option value="in_progress">Work in Progress</option>
              <option value="testing">Testing</option>
              <option value="government_inspection">Govt Inspection</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-border/80 bg-muted/30 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Officer Filter */}
          {departmentOfficersList.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-semibold text-[11px]">Officer:</span>
              <select
                value={officerFilter}
                onChange={(e) => setOfficerFilter(e.target.value)}
                className="rounded-xl border border-border/80 bg-muted/30 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-37.5 truncate"
              >
                <option value="all">All Officers</option>
                {departmentOfficersList.map((off) => (
                  <option key={off} value={off}>
                    {off}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || officerFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setOfficerFilter("all");
              }}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 4. Complaints Project-Tracking Cards List */}
      {issuesLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm font-semibold text-foreground">Loading Department Complaints...</p>
          <p className="text-xs text-muted-foreground">Connecting to central civic database</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center space-y-3">
          <Layers className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-base font-bold text-foreground">No Complaints Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No citizen complaints currently match the selected filters for {currentDepartment?.name}.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setOfficerFilter("all");
            }}
            className="rounded-xl text-xs"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredIssues.map((issue) => {
            const workflow = calculateWorkflowProgress(issue);
            const isExpanded = expandedIssueId === issue.id;

            return (
              <Card
                key={issue.id}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm bg-card ${
                  isExpanded ? "border-indigo-500/60 ring-2 ring-indigo-500/10" : "border-border/80 hover:border-border"
                }`}
              >
                {/* Complaint Summary Header */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Bar: ID, Priority, Status, Delayed Flag, Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                        {issue.id}
                      </span>

                      <Badge
                        className={`text-[10px] uppercase font-bold tracking-wider ${
                          issue.priority === "critical"
                            ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                            : issue.priority === "high"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : issue.priority === "medium"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                            : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {issue.priority || "Medium"} Priority
                      </Badge>

                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {issue.category || "General Civic"}
                      </Badge>

                      {workflow.isDelayed && (
                        <Badge className="bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Delayed / SLA Alert</span>
                        </Badge>
                      )}
                    </div>

                    {/* Progress Percentage & Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-[11px] font-mono font-bold text-foreground">
                          {workflow.progressPercentage}% Completed
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Step {workflow.currentIndex} of 12
                        </div>
                      </div>

                      <Badge
                        className={`text-xs px-2.5 py-1 font-bold ${
                          issue.status === "resolved" || issue.status === "closed"
                            ? "bg-emerald-600 text-white"
                            : issue.status === "in_progress"
                            ? "bg-blue-600 text-white"
                            : "bg-indigo-600/20 text-indigo-700 dark:text-indigo-300"
                        }`}
                      >
                        {issue.status?.replace(/_/g, " ").toUpperCase() || "ASSIGNED"}
                      </Badge>
                    </div>
                  </div>

                  {/* Problem Title & Basic Meta */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                  </div>

                  {/* Details Grid (Citizen, Location, Officer, Expected Date) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3 border-y border-border/60 text-xs">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="space-y-0.5 truncate">
                        <span className="text-[10px] text-muted-foreground">Citizen Name:</span>
                        <div className="font-semibold text-foreground truncate">
                          {issue.citizenName || "Citizen"}
                        </div>
                        {issue.citizenPhone && (
                          <div className="text-[10px] text-muted-foreground font-mono truncate">
                            {issue.citizenPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 truncate">
                        <span className="text-[10px] text-muted-foreground">Incident Location:</span>
                        <div className="font-semibold text-foreground truncate">
                          {issue.location || "Municipal Zone"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {issue.wardNo ? `${issue.wardNo}, ` : ""}
                          {issue.district || "District"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 truncate">
                        <span className="text-[10px] text-muted-foreground">Assigned Officer:</span>
                        <div className="font-semibold text-foreground truncate">
                          {issue.assignedOfficer || currentDepartment?.headOfficerName || "Field Nodal Officer"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {currentDepartment?.code || "Line Dept"} Lead
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 truncate">
                        <span className="text-[10px] text-muted-foreground">Expected Completion Date:</span>
                        <div className="font-bold font-mono text-foreground truncate">
                          {issue.slaDeadline || "Within 24 Hours SLA"}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            workflow.isDelayed
                              ? "bg-red-500/10 text-red-600 dark:text-red-400"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {workflow.isDelayed ? "🔴 Delayed / Overdue" : "🟢 On Schedule (SLA Active)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                      <span>Overall Milestone Progress</span>
                      <span className="font-bold text-foreground">
                        {workflow.progressPercentage}% · Current Stage: {workflow.currentStep.name}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          workflow.isDelayed
                            ? "bg-red-500"
                            : workflow.progressPercentage >= 100
                            ? "bg-emerald-500"
                            : "bg-linear-to-r from-indigo-500 to-emerald-500"
                        }`}
                        style={{ width: `${workflow.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 5. VISUAL WORKFLOW TIMELINE (12 Steps) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Workflow Progress Timeline</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        ✅ Completed · 🔵 Current · ⚪ Pending · 🔴 Delayed
                      </span>
                    </div>

                    {/* Timeline Horizontal Steps Bar */}
                    <div className="overflow-x-auto pb-2 scrollbar-thin">
                      <div className="flex items-center gap-2 min-w-225 py-1">
                        {workflow.steps.map((step, idx) => {
                          const isLast = idx === workflow.steps.length - 1;

                          let badgeStyle = "bg-muted/60 text-muted-foreground border-border/60";
                          let icon = <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />;

                          if (step.state === "completed") {
                            badgeStyle = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold";
                            icon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
                          } else if (step.state === "current") {
                            badgeStyle = "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50 font-bold ring-2 ring-blue-500/20 shadow-sm";
                            icon = (
                              <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                              </span>
                            );
                          } else if (step.state === "delayed") {
                            badgeStyle = "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50 font-bold ring-2 ring-red-500/20 animate-pulse";
                            icon = <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />;
                          }

                          return (
                            <React.Fragment key={step.id}>
                              <div
                                title={`${step.name} - ${step.description}`}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] whitespace-nowrap transition-all ${badgeStyle}`}
                              >
                                {icon}
                                <span>{step.shortLabel}</span>
                              </div>
                              {!isLast && (
                                <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isExpanded ? "secondary" : "outline"}
                        onClick={() => {
                          setExpandedIssueId(isExpanded ? null : issue.id);
                        }}
                        className="rounded-xl text-xs font-semibold gap-1.5 h-8"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            <span>Collapse Project Workspace</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            <span>Open Project Workspace & Work Log</span>
                          </>
                        )}
                      </Button>

                      {/* Attachments quick count badges */}
                      <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                        {issue.attachments?.images?.length > 0 && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-muted/60">
                            <ImageIcon className="h-3 w-3" />
                            <span>{issue.attachments.images.length}</span>
                          </span>
                        )}
                        {issue.attachments?.videos?.length > 0 && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-muted/60">
                            <Video className="h-3 w-3" />
                            <span>{issue.attachments.videos.length}</span>
                          </span>
                        )}
                        {issue.attachments?.documents?.length > 0 && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-muted/60">
                            <FileText className="h-3 w-3" />
                            <span>{issue.attachments.documents.length}</span>
                          </span>
                        )}
                        {issue.officerNotes?.length > 0 && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-muted/60">
                            <FileCheck2 className="h-3 w-3" />
                            <span>{issue.officerNotes.length} remarks</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Fast-Forward Step Button */}
                    {issue.status !== "closed" && (
                      <Button
                        size="sm"
                        onClick={() => handleAdvanceStep(issue)}
                        disabled={advanceStageMutation.isPending}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 h-8 shadow-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Advance to Next Stage</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* 6. EXPANDABLE PROJECT TRACKING WORKSPACE TABS */}
                {isExpanded && (
                  <div className="bg-muted/20 border-t border-border/80 p-5 sm:p-6 space-y-4">
                    {/* Tab Selection */}
                    <div className="flex items-center gap-1 border-b border-border/60 pb-2 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("worklog")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          activeTab === "worklog"
                            ? "bg-indigo-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Live Work Log ({issue.timeline?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("media")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          activeTab === "media"
                            ? "bg-indigo-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>Photos, Videos & Docs</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("remarks")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          activeTab === "remarks"
                            ? "bg-indigo-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Officer Remarks ({issue.officerNotes?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("assignee")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          activeTab === "assignee"
                            ? "bg-indigo-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Current Assignee & Team</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("history")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          activeTab === "history"
                            ? "bg-indigo-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Status History ({issue.resolutionHistory?.length || 0})</span>
                      </button>
                    </div>

                    {/* TAB 1: LIVE WORK LOG */}
                    {activeTab === "worklog" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              Real-Time Field Work Log
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Chronological site progress, machinery telemetry, and technician updates.
                            </p>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIssueForAction(issue);
                              setIsWorkLogModalOpen(true);
                            }}
                            className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-7 shadow-sm"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Work Log Update</span>
                          </Button>
                        </div>

                        {(!issue.timeline || issue.timeline.length === 0) ? (
                          <p className="text-xs text-muted-foreground py-4 text-center">
                            No work log updates registered yet. Click &quot;Add Work Log Update&quot; to log initial field activities.
                          </p>
                        ) : (
                          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                            {issue.timeline.map((entry: any, index: number) => (
                              <div key={entry.id || index} className="relative space-y-1">
                                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-indigo-600 ring-4 ring-card flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                </div>
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-foreground">
                                      {entry.title || entry.stage}
                                    </span>
                                    <Badge variant="outline" className="text-[9px] font-mono">
                                      {entry.stage}
                                    </Badge>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {entry.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground bg-card/80 p-2.5 rounded-xl border border-border/60">
                                  {entry.description}
                                </p>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                                  <span>Logged by: <strong className="text-foreground">{entry.actor}</strong> ({entry.actorRole})</span>
                                  {entry.evidenceUrl && (
                                    <a
                                      href={entry.evidenceUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-indigo-600 hover:underline flex items-center gap-0.5"
                                    >
                                      <span>Attached Proof</span>
                                      <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: PHOTOS, VIDEOS & DOCUMENTS */}
                    {activeTab === "media" && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              Complaint Evidence & Field Documents
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Inspection photos, video telemetry recordings, citizen voice notes, and engineering blueprints.
                            </p>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIssueForAction(issue);
                              setIsAttachmentModalOpen(true);
                            }}
                            className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-7 shadow-sm"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            <span>Attach Media / Document</span>
                          </Button>
                        </div>

                        {/* Images Grid */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                            <span>Inspection Photos ({issue.attachments?.images?.length || 0})</span>
                          </span>

                          {(!issue.attachments?.images || issue.attachments.images.length === 0) ? (
                            <p className="text-xs text-muted-foreground">No photos uploaded.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {issue.attachments.images.map((img: any, i: number) => (
                                <div
                                  key={img.id || i}
                                  onClick={() => {
                                    setPreviewMediaUrl(img.url);
                                    setPreviewMediaTitle(img.label || `Inspection Photo #${i + 1}`);
                                  }}
                                  className="group relative rounded-2xl overflow-hidden border border-border/80 bg-muted/30 aspect-video cursor-pointer hover:border-indigo-500 transition-all shadow-sm"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img.url}
                                    alt={img.label || "Inspection"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                    <span className="text-[10px] text-white font-medium truncate">
                                      {img.label || "Click to zoom"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Video Telemetry */}
                        {issue.attachments?.videos && issue.attachments.videos.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <Video className="h-3.5 w-3.5 text-purple-500" />
                              <span>Video Telemetry & Site Footage ({issue.attachments.videos.length})</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {issue.attachments.videos.map((vid: any, i: number) => (
                                <div key={vid.id || i} className="rounded-2xl border border-border/80 p-3 bg-card space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground truncate">{vid.label}</span>
                                    <Badge variant="outline" className="text-[10px] font-mono">{vid.duration || "0:30"}</Badge>
                                  </div>
                                  <video
                                    src={vid.url}
                                    controls
                                    className="w-full rounded-xl bg-black aspect-video object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Citizen Voice Notes */}
                        {issue.attachments?.voiceNotes && issue.attachments.voiceNotes.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <Mic className="h-3.5 w-3.5 text-amber-500" />
                              <span>Citizen Spoken Grievance Audio Notes ({issue.attachments.voiceNotes.length})</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {issue.attachments.voiceNotes.map((aud: any, i: number) => (
                                <div key={aud.id || i} className="rounded-2xl border border-border/80 p-3 bg-card space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground truncate flex items-center gap-1.5">
                                      <Volume2 className="h-3.5 w-3.5 text-indigo-500" />
                                      <span>{aud.label}</span>
                                    </span>
                                    <Badge variant="outline" className="text-[10px] font-mono">{aud.duration || "0:25"}</Badge>
                                  </div>
                                  <audio controls className="w-full h-8">
                                    <source src={aud.url} type="audio/mpeg" />
                                    Your browser does not support audio playback.
                                  </audio>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents & Blueprints */}
                        <div className="space-y-2 pt-2 border-t border-border/60">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Municipal Blueprints & Engineering Reports ({issue.attachments?.documents?.length || 0})</span>
                          </span>

                          {(!issue.attachments?.documents || issue.attachments.documents.length === 0) ? (
                            <p className="text-xs text-muted-foreground">No documents attached.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {issue.attachments.documents.map((doc: any, i: number) => (
                                <div
                                  key={doc.id || i}
                                  className="flex items-center justify-between p-3 rounded-2xl border border-border/80 bg-card hover:border-indigo-500/50 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <div className="truncate space-y-0.5">
                                      <div className="text-xs font-bold text-foreground truncate">{doc.name}</div>
                                      <div className="text-[10px] text-muted-foreground font-mono">{doc.size || "PDF Document"}</div>
                                    </div>
                                  </div>
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: OFFICER REMARKS */}
                    {activeTab === "remarks" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              Official Executive Remarks & Directives
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Instructions issued by Nodal Officers, Executive Engineers, and District Collectors.
                            </p>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIssueForAction(issue);
                              setIsRemarkModalOpen(true);
                            }}
                            className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-7 shadow-sm"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Post Officer Remark</span>
                          </Button>
                        </div>

                        {(!issue.officerNotes || issue.officerNotes.length === 0) ? (
                          <p className="text-xs text-muted-foreground py-4 text-center">
                            No officer remarks entered. Add directives to guide field teams.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {issue.officerNotes.map((note: any, i: number) => (
                              <div
                                key={note.id || i}
                                className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-1.5 shadow-sm"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="font-bold text-foreground flex items-center gap-1.5">
                                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                                    <span>{note.author}</span>
                                    <Badge variant="outline" className="text-[9px] font-mono">
                                      {note.authorRole}
                                    </Badge>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {note.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/90 pl-5">
                                  {note.note}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: CURRENT ASSIGNEE & TEAM */}
                    {activeTab === "assignee" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              Assigned Personnel & Collaborator Details
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Officer in command of this complaint, plus assigned external contractors or academic partners.
                            </p>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedIssueForAction(issue);
                              setIsReassignModalOpen(true);
                            }}
                            className="rounded-xl text-xs font-bold border-border/80 gap-1.5 h-7"
                          >
                            <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Reassign Officer</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Government Officer Card */}
                          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-2">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                              Nodal Government Officer
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                {issue.assignedOfficer?.slice(0, 2).toUpperCase() || "GO"}
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-xs text-foreground">
                                  {issue.assignedOfficer || currentDepartment?.headOfficerName || "Superintending Engineer"}
                                </h5>
                                <p className="text-[10px] text-muted-foreground">
                                  {currentDepartment?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-[11px] space-y-1 pt-2 border-t border-border/60 text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Official Contact:</span>
                                <span className="font-mono text-foreground font-semibold">{issue.officerContact || "+91 94480 12345"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Jurisdiction:</span>
                                <span className="text-foreground">{issue.district || "Chennai"} (Ward {issue.wardNo || "Central"})</span>
                              </div>
                            </div>
                          </div>

                          {/* External Assignment Card (Industry / University / NGO) */}
                          <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                              Assigned Execution Partner
                            </span>
                            {issue.assignedCompanyName ? (
                              <div className="space-y-2">
                                <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>{issue.assignedCompanyName} (Industry Contractor)</span>
                                </div>
                                <div className="text-[11px] space-y-1 text-muted-foreground">
                                  <div className="flex justify-between">
                                    <span>Work Order:</span>
                                    <span className="font-mono font-bold text-foreground">{issue.workOrderId || "WO-ACTIVE"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Payment Status:</span>
                                    <Badge variant="outline" className="text-[10px] font-mono">
                                      {issue.paymentStatus || "Pending Approval"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ) : issue.universityName ? (
                              <div className="space-y-2">
                                <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                  <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                                  <span>{issue.universityName} (Academic R&amp;D Team)</span>
                                </div>
                                <div className="text-[11px] space-y-1 text-muted-foreground">
                                  <div className="flex justify-between">
                                    <span>Student Team:</span>
                                    <span className="text-foreground">{issue.studentTeamName || "Innovation Squad"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Faculty Mentor:</span>
                                    <span className="text-foreground">{issue.facultyMentorName || "Prof. In-Charge"}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 text-xs text-muted-foreground">
                                <p>Executed internally by {currentDepartment?.code} departmental field squad.</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAdvanceStep(issue)}
                                  className="rounded-xl text-[11px] h-7 w-full border-border/80"
                                >
                                  Deploy External Industry/University Partner
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: STATUS HISTORY & AUDIT TRAIL */}
                    {activeTab === "history" && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Full Administrative Status History
                        </h4>
                        <div className="space-y-2">
                          {(!issue.resolutionHistory || issue.resolutionHistory.length === 0) ? (
                            <p className="text-xs text-muted-foreground py-2">No historical status records.</p>
                          ) : (
                            issue.resolutionHistory.map((hist: any, i: number) => (
                              <div
                                key={hist.id || i}
                                className="flex items-start justify-between p-3 rounded-xl border border-border/60 bg-card text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="font-bold text-foreground">{hist.action}</div>
                                  <div className="text-muted-foreground text-[11px]">{hist.details}</div>
                                  <div className="text-[10px] text-muted-foreground font-mono">
                                    By: {hist.performedBy} ({hist.role})
                                  </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                                  {hist.timestamp}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD LIVE WORK LOG */}
      <Dialog open={isWorkLogModalOpen} onOpenChange={setIsWorkLogModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Add Field Work Log Entry
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log progress for complaint #{selectedIssueForAction?.id}. Updates appear in live citizen and nodal timeline.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddWorkLog} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Workflow Stage</Label>
              <select
                value={workLogStage}
                onChange={(e) => setWorkLogStage(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs"
              >
                {WORKFLOW_STEPS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Update Title</Label>
              <Input
                value={workLogTitle}
                onChange={(e) => setWorkLogTitle(e.target.value)}
                placeholder="e.g. Sluice Valve Replaced & Pressure Tested"
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Description & Progress Details</Label>
              <Textarea
                value={workLogDescription}
                onChange={(e) => setWorkLogDescription(e.target.value)}
                placeholder="Detail the materials deployed, labor mobilized, and current site condition..."
                rows={3}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Photo/Evidence Link (Optional)</Label>
              <Input
                value={workLogEvidenceUrl}
                onChange={(e) => setWorkLogEvidenceUrl(e.target.value)}
                placeholder="https://..."
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWorkLogModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateIssueMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {updateIssueMutation.isPending ? "Posting..." : "Post Work Log"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ADD OFFICER REMARK */}
      <Dialog open={isRemarkModalOpen} onOpenChange={setIsRemarkModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Issue Official Executive Directive
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a binding remark or instruction for #{selectedIssueForAction?.id}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRemark} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Author Officer Name</Label>
              <Input
                value={remarkAuthor}
                onChange={(e) => setRemarkAuthor(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Directive / Remark</Label>
              <Textarea
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter executive instruction or field directive..."
                rows={4}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRemarkModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateIssueMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {updateIssueMutation.isPending ? "Saving..." : "Save Directive"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ADD ATTACHMENT */}
      <Dialog open={isAttachmentModalOpen} onOpenChange={setIsAttachmentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Attach Inspection Media or Document
            </DialogTitle>
            <DialogDescription className="text-xs">
              Attach media proof to case #{selectedIssueForAction?.id}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAttachment} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Media Type</Label>
              <select
                value={attachmentType}
                onChange={(e) => setAttachmentType(e.target.value as any)}
                className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs"
              >
                <option value="image">Inspection Photo</option>
                <option value="video">Telemetry Video</option>
                <option value="voiceNote">Citizen Audio Note</option>
                <option value="document">Engineering Document / Blueprint</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Media URL</Label>
              <Input
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or /docs/file.pdf"
                className="rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Label / File Name</Label>
              <Input
                value={attachmentLabel}
                onChange={(e) => setAttachmentLabel(e.target.value)}
                placeholder="e.g. Excavation Pit Inspection Photo"
                className="rounded-xl text-xs"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAttachmentModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateIssueMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {updateIssueMutation.isPending ? "Uploading..." : "Save Attachment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: REASSIGN OFFICER */}
      <Dialog open={isReassignModalOpen} onOpenChange={setIsReassignModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Reassign Officer in Charge
            </DialogTitle>
            <DialogDescription className="text-xs">
              Transfer case #{selectedIssueForAction?.id} to another field engineer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReassign} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select New Officer</Label>
              <select
                value={reassignOfficerId}
                onChange={(e) => setReassignOfficerId(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs"
                required
              >
                <option value="">-- Choose Line Officer --</option>
                {officers?.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.name} ({off.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Transfer Reason</Label>
              <Textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Explain the administrative or geographical reason for transfer..."
                rows={3}
                className="rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReassignModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateIssueMutation.isPending}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {updateIssueMutation.isPending ? "Reassigning..." : "Confirm Reassignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MEDIA PREVIEW LIGHTBOX */}
      {previewMediaUrl && (
        <div
          onClick={() => setPreviewMediaUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-card rounded-3xl overflow-hidden border border-border shadow-2xl space-y-2 p-3"
          >
            <div className="flex items-center justify-between px-3 pt-2">
              <h4 className="text-sm font-bold text-foreground truncate">{previewMediaTitle}</h4>
              <button
                onClick={() => setPreviewMediaUrl(null)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewMediaUrl}
                alt={previewMediaTitle}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
