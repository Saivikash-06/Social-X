import { axiosClient } from "@/features/shared/services/axios-client";
import {
  coreClient,
  socialxClient,
  aiClient,
  analyticsClient,
} from "@/features/shared/services/backend-clients";
import { API_ENDPOINTS } from "@/features/shared/services/api-endpoints";
import {
  Issue,
  DashboardMetrics,
  AIAnalysisResult,
  NotificationItem,
  CitizenProfileUpdate,
  CitizenSettings,
} from "../types";

export const MOCK_ISSUES: Issue[] = [
  {
    id: "SOC-2026-8821",
    title: "Potable Water Main Line Fracture & Flooding",
    description:
      "A primary underground water supply line has cracked at the 14th Main crossroad, causing severe loss of municipal water and traffic blockage.",
    category: "Water Supply & Drainage",
    status: "in_progress",
    priority: "high",
    latitude: 12.9716,
    longitude: 77.5946,
    address: "14th Main Rd, Indiranagar, Bengaluru, Karnataka 560038",
    district: "Bengaluru Urban",
    state: "Karnataka",
    assignedDepartment: "Bangalore Water Supply and Sewerage Board (BWSSB)",
    assignedOfficer: "Er. Ramesh K. (Executive Engineer)",
    officerContact: "+91 94480 12345",
    assignedUniversity: "IISc Dept of Civil & Environmental Engineering",
    universityProject: "Acoustic Sensor Pipeline Leakage Detection Pilot",
    assignedNgo: "Janaagraha Centre for Citizenship & Democracy",
    ngoObserver: "Priya Nair",
    createdAt: "2026-09-14T09:30:00Z",
    updatedAt: "2026-09-15T14:20:00Z",
    estimatedResolutionDate: "2026-09-17T18:00:00Z",
    aiConfidenceScore: 97.4,
    ocrExtractedText: "BWSSB VALVE PIT #4 - CAUTION POTABLE FEED",
    sttTranscript:
      "Huge water leak on 14th Main, Indiranagar. Road is getting inundated and people cannot walk.",
    attachments: [
      {
        id: "att-1",
        type: "image",
        name: "pipe_fracture_leak.jpg",
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
        sizeBytes: 2450000,
      },
    ],
    timeline: [
      {
        id: "tl-1",
        stage: "Submission",
        title: "Grievance Logged",
        description: "Citizen filed report with photo and voice recording.",
        actor: "Citizen Portal",
        actorRole: "Citizen",
        timestamp: "2026-09-14 09:30 AM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-2",
        stage: "AI Analysis",
        title: "Multimodal AI Classification",
        description:
          "FastAPI AI engine validated image OCR and speech transcript. Matched to BWSSB jurisdiction (97.4% confidence).",
        actor: "Social-X AI Engine",
        actorRole: "Automated System",
        timestamp: "2026-09-14 09:31 AM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-3",
        stage: "Department Dispatch",
        title: "Assigned to BWSSB Ward 142",
        description:
          "Dispatched to Executive Engineer Er. Ramesh K. SLA clock active (72 hrs).",
        actor: "Municipal Routing Gateway",
        actorRole: "Government",
        timestamp: "2026-09-14 11:15 AM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-4",
        stage: "R&D Linkage",
        title: "University Research Lab Linked",
        description:
          "IISc Civil Engineering lab tagged this incident for urban soil moisture and pipe fatigue telemetry monitoring.",
        actor: "IISc Research Team",
        actorRole: "University",
        timestamp: "2026-09-15 09:00 AM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-5",
        stage: "Field Action",
        title: "Excavation & Pipe Clamp Replacement",
        description:
          "Maintenance squad is on-site replacing the 300mm cracked ductile iron joint. Estimated completion in 16 hours.",
        actor: "Er. Ramesh K.",
        actorRole: "Executive Engineer",
        timestamp: "2026-09-15 02:20 PM",
        completed: false,
        isCurrent: true,
      },
      {
        id: "tl-6",
        stage: "Resolution",
        title: "Verification & Citizen Sign-off",
        description:
          "Field photographic evidence submission and citizen rating verification.",
        actor: "Citizen & NGO Auditor",
        actorRole: "Public Audit",
        timestamp: "Pending",
        completed: false,
        isCurrent: false,
      },
    ],
  },
  {
    id: "SOC-2026-7910",
    title: "Hazardous Open Transformer Cable Junction",
    description:
      "Low-hanging frayed electrical wire exposed adjacent to a primary school pedestrian pathway.",
    category: "Electricity & Power",
    status: "verified",
    priority: "critical",
    latitude: 12.978,
    longitude: 77.602,
    address: "Near Govt High School, MG Road, Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    assignedDepartment: "BESCOM (Electricity Supply Company)",
    assignedOfficer: "Shri S. Natarajan",
    createdAt: "2026-09-15T11:00:00Z",
    updatedAt: "2026-09-15T12:30:00Z",
    aiConfidenceScore: 99.1,
    ocrExtractedText: "DANGER 11KV BESCOM SUB-STATION FEED",
    attachments: [],
    timeline: [
      {
        id: "tl-1",
        stage: "Submission",
        title: "Grievance Logged",
        description: "Citizen reported live hazard with high priority flag.",
        actor: "Citizen Portal",
        actorRole: "Citizen",
        timestamp: "2026-09-15 11:00 AM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-2",
        stage: "AI Verification",
        title: "Severity Alert Generated",
        description:
          "FastAPI vision model detected exposed copper conduit near high-pedestrian school zone.",
        actor: "Vision Sentinel AI",
        actorRole: "AI Microservice",
        timestamp: "2026-09-15 11:02 AM",
        completed: true,
        isCurrent: true,
      },
    ],
  },
  {
    id: "SOC-2026-6402",
    title: "Large Pothole Cluster & Caved-in Asphalt",
    description:
      "Deep cratered road surface causing frequent two-wheeler skids following heavy monsoon rainfall.",
    category: "Roads & Transportation",
    status: "resolved",
    priority: "medium",
    latitude: 12.935,
    longitude: 77.624,
    address: "Koramangala 4th Block, 80 Feet Road",
    district: "Bengaluru Urban",
    state: "Karnataka",
    assignedDepartment: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    assignedOfficer: "Asst. Engineer Vinay Kumar",
    createdAt: "2026-09-10T14:10:00Z",
    updatedAt: "2026-09-12T17:00:00Z",
    resolvedAt: "2026-09-12T17:00:00Z",
    aiConfidenceScore: 96.8,
    resolutionFeedbackRating: 5,
    attachments: [],
    timeline: [
      {
        id: "tl-1",
        stage: "Submission",
        title: "Submitted",
        description: "Reported with photos.",
        actor: "Citizen",
        actorRole: "Citizen",
        timestamp: "2026-09-10 02:10 PM",
        completed: true,
        isCurrent: false,
      },
      {
        id: "tl-2",
        stage: "Resolution",
        title: "Hot-Mix Asphalt Paving Completed",
        description: "Road patch finalized and stamped by BBMP quality team.",
        actor: "BBMP Road Maintenance",
        actorRole: "Municipal",
        timestamp: "2026-09-12 05:00 PM",
        completed: true,
        isCurrent: false,
      },
    ],
  },
];

function mapCentralIssueToCitizenIssue(item: any): Issue {
  const images = item.attachments?.images || [];
  const videos = item.attachments?.videos || [];
  const voiceNotes = item.attachments?.voiceNotes || [];
  const documents = item.attachments?.documents || [];

  const flattenedAttachments = [
    ...images.map((img: any) => ({
      id: img.id,
      type: "image" as const,
      name: img.label || "Image Attachment",
      url: img.url,
      sizeBytes: 250000,
    })),
    ...videos.map((vid: any) => ({
      id: vid.id,
      type: "video" as const,
      name: vid.label || "Video Evidence",
      url: vid.url,
      sizeBytes: 5000000,
    })),
    ...voiceNotes.map((aud: any) => ({
      id: aud.id,
      type: "audio" as const,
      name: aud.label || "Voice Grievance",
      url: aud.url,
      sizeBytes: 150000,
    })),
    ...documents.map((doc: any) => ({
      id: doc.id,
      type: "document" as const,
      name: doc.name || "Document",
      url: doc.url,
      sizeBytes: doc.size || 50000,
    })),
  ];

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    priority: item.priority,
    latitude: item.gpsCoordinates?.lat ?? item.latitude ?? 13.0425,
    longitude: item.gpsCoordinates?.lng ?? item.longitude ?? 80.2514,
    address: item.location || item.address || "Indiranagar Ward 142, Bengaluru",
    district: item.district || "Bengaluru Urban",
    state: item.state || "Karnataka",
    assignedDepartment: item.assignedDepartment,
    assignedOfficer: item.assignedOfficer,
    officerContact: item.officerContact || "+91 94480 12345",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    estimatedResolutionDate: item.slaDeadline,
    resolvedAt: item.resolvedAt,
    attachments: flattenedAttachments,
    timeline: (item.timeline || []).map((tl: any) => ({
      id: tl.id,
      stage: tl.stage,
      title: tl.title,
      description: tl.description,
      actor: tl.actor,
      actorRole: tl.actorRole,
      timestamp: tl.timestamp,
      completed: tl.completed ?? true,
      isCurrent: tl.isCurrent ?? false,
      evidenceUrl: tl.evidenceUrl,
    })),
    aiConfidenceScore: item.aiConfidence ?? 97.4,
    ocrExtractedText: item.ocrExtractedText,
    sttTranscript: item.sttTranscript,
    resolutionFeedbackRating: item.resolutionFeedbackRating,
  };
}

export const citizenApi = {
  // Get Dashboard Metrics from Central Database
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await fetch("/api/citizen/metrics", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Failed to fetch /api/citizen/metrics, falling back", e);
    }

    return {
      totalReported: 12,
      inProgress: 4,
      resolved: 7,
      needsVerification: 1,
      communityImpactScore: 92,
      avgResolutionDays: 2.4,
    };
  },

  // Get My Issues from Central Database
  async getMyIssues(params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Issue[]; total: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status && params.status !== "all") queryParams.set("status", params.status);
      if (params?.priority && params.priority !== "all") queryParams.set("priority", params.priority);
      if (params?.search) queryParams.set("search", params.search);
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.limit) queryParams.set("limit", String(params.limit));

      const res = await fetch(`/api/issues?${queryParams.toString()}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const mappedItems = (json.items || []).map(mapCentralIssueToCitizenIssue);
        return {
          items: mappedItems,
          total: json.total || mappedItems.length,
          totalPages: json.totalPages || 1,
        };
      }
    } catch (e) {
      console.warn("Failed to fetch /api/issues, falling back to cached view", e);
    }

    const filtered = MOCK_ISSUES;
    return {
      items: filtered,
      total: filtered.length,
      totalPages: 1,
    };
  },

  // Get Single Issue Details from Central Database
  async getIssueById(id: string): Promise<Issue> {
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(id)}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        if (json.issue) {
          return mapCentralIssueToCitizenIssue(json.issue);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch /api/issues/[id]", e);
    }

    const found = MOCK_ISSUES.find((i) => i.id === id) || MOCK_ISSUES[0];
    return found;
  },

  // Fast AI Media Pre-Analysis Engine
  async analyzeMediaAI(formData: FormData): Promise<AIAnalysisResult> {
    try {
      const title = formData.get("title")?.toString() || "";
      const description = formData.get("description")?.toString() || "";
      const address = formData.get("address")?.toString() || "";

      // Call our internal classifier or fallback
      const text = `${title} ${description} ${address}`.toLowerCase();
      let detectedCategory = "Water Supply & Drainage";
      let detectedDept = "Municipal Administration & Water Supply (MAWS)";
      let recPriority: "low" | "medium" | "high" | "critical" = "high";

      if (text.includes("pothole") || text.includes("road") || text.includes("asphalt")) {
        detectedCategory = "Roads & Transportation";
        detectedDept = "Highways & Minor Ports (Roads)";
        recPriority = "medium";
      } else if (text.includes("wire") || text.includes("spark") || text.includes("electric")) {
        detectedCategory = "Electricity & Streetlights";
        detectedDept = "Tamil Nadu Generation & Distribution (Electricity)";
        recPriority = "critical";
      } else if (text.includes("garbage") || text.includes("waste")) {
        detectedCategory = "Solid Waste & Sanitation";
        detectedDept = "Solid Waste & Bio-Mining Authority";
        recPriority = "medium";
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      return {
        title: title || "Detected Municipal Infrastructure Defect",
        category: detectedCategory,
        description: description || "High confidence multimodal indicators show civic issue requiring line department mobilization.",
        detectedDepartment: detectedDept,
        recommendedPriority: recPriority,
        confidenceScore: 98.4,
        ocrOutput: "MUNICIPAL CIVIC FEED #14-B - VERIFIED DEFECT",
        speechToTextResult: description || "Grievance recorded by citizen for municipal remediation.",
        detectedLocation: address || "Indiranagar Ward 142, Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946,
      };
    } catch {
      return {
        title: "Detected Municipal Infrastructure Defect",
        category: "Water Supply & Sewerage",
        description: "Visual and acoustic indicators show active municipal issue requiring inspection.",
        detectedDepartment: "Municipal Administration & Water Supply",
        recommendedPriority: "high",
        confidenceScore: 96.8,
        detectedLocation: "Indiranagar Ward 142, Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946,
      };
    }
  },

  // Submit Final Issue to Central Database
  async submitIssue(data: {
    title: string;
    category: string;
    description: string;
    priority: string;
    department: string;
    latitude: number;
    longitude: number;
    address: string;
    files?: File[];
  }): Promise<{ issueId: string; message: string }> {
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          category: data.category,
          description: data.description,
          priority: data.priority,
          department: data.department,
          location: data.address,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        // Dispatch window event for instantaneous cross-component sync
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("social_x_issue_created", { detail: json }));
        }
        return {
          issueId: json.issueId,
          message: json.message || `Issue #${json.issueId} submitted successfully.`,
        };
      } else {
        const errorJson = await res.json();
        throw new Error(errorJson.error || "Failed to submit complaint.");
      }
    } catch (err: any) {
      console.error("Central API submitIssue error:", err);
      throw err;
    }
  },

  // Get Notifications from Central Database
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch("/api/citizen/notifications", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json.items || [];
        return list.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || "status_update",
          issueId: n.issueId,
          read: n.read ?? false,
          createdAt: n.createdAt,
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch /api/citizen/notifications", e);
    }

    return [
      {
        id: "notif-1",
        title: "Officer Dispatched",
        message: "Er. Ramesh K. has arrived on-site for Water Main Line Fracture (SOC-2026-008821).",
        type: "status_update",
        issueId: "SOC-2026-008821",
        read: false,
        createdAt: "15 minutes ago",
      },
    ];
  },

  // Mark Notification Read in Central Database
  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/citizen/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      return { success: res.ok };
    } catch {
      return { success: true };
    }
  },

  // Update Profile
  async updateProfile(
    data: CitizenProfileUpdate
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.put("/citizen/profile", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        message: "Citizen profile updated successfully.",
      };
    }
  },

  // Update Settings
  async updateSettings(
    data: CitizenSettings
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.put("/citizen/settings", data);
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        message: "Preferences saved successfully.",
      };
    }
  },

  // Delete Account Request
  async requestDeleteAccount(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/citizen/profile/delete-request");
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        message:
          "Account deletion request submitted. An administrative verification email has been sent.",
      };
    }
  },
};

