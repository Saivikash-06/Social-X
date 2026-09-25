"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  FileText,
  MapPin,
  Camera,
  Mic,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Copy,
  Send,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { FileUploader } from "@/features/citizen/components/file-uploader";
import { AudioRecorder } from "@/features/citizen/components/audio-recorder";
import { GpsPicker } from "@/features/citizen/components/gps-picker";
import { AiPreviewModal } from "@/features/citizen/components/ai-preview-modal";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { AIAnalysisResult, IssuePriority } from "@/features/citizen/types";
import { toast } from "sonner";
import { useTranslation } from "@/features/shared/i18n";

export default function ReportIssuePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { analyzeMediaMutation, submitIssueMutation } = useCitizenQueries();

  // Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("Water Supply & Drainage");
  const [priority, setPriority] = React.useState<IssuePriority>("high");
  const [latitude, setLatitude] = React.useState(12.9716);
  const [longitude, setLongitude] = React.useState(77.5946);
  const [address, setAddress] = React.useState("14th Main Rd, Indiranagar, Bengaluru");
  const [files, setFiles] = React.useState<File[]>([]);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);

  // AI Preview Modal State
  const [showAiPreview, setShowAiPreview] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<AIAnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isProcessingAi, setIsProcessingAi] = React.useState(false);

  // Success Confirmation State
  const [submittedIssueId, setSubmittedIssueId] = React.useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const validateForm = () => {
    if (!title.trim() || title.trim().length < 3) {
      toast.error(t("common.validation.validationError", "Validation Error"), {
        description: t("citizen.report.validationHeadline", "Please enter a grievance headline (at least 3 characters)."),
      });
      return false;
    }
    if (!description.trim() || description.trim().length < 5) {
      toast.error(t("common.validation.validationError", "Validation Error"), {
        description: t("citizen.report.validationRemarks", "Please provide detailed remarks describing the problem."),
      });
      return false;
    }
    if (!address.trim()) {
      toast.error(t("common.validation.validationError", "Validation Error"), {
        description: t("citizen.report.validationLocation", "Please specify the incident location or GPS coordinates."),
      });
      return false;
    }
    return true;
  };

  const handleStartAiPreview = async () => {
    if (!validateForm()) return;

    setIsProcessingAi(true);
    setUploadProgress(25);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("address", address);

    files.forEach((f) => formData.append("files", f));
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice_memo.webm");
    }

    setUploadProgress(65);

    analyzeMediaMutation.mutate(formData, {
      onSuccess: (result) => {
        setUploadProgress(100);
        setIsProcessingAi(false);
        setAiResult({
          ...result,
          title: title || result.title,
          description: description || result.description,
          category: category || result.category,
        });
        setShowAiPreview(true);
      },
      onError: () => {
        setIsProcessingAi(false);
        setUploadProgress(0);
      },
    });
  };

  const handleDirectSubmission = () => {
    if (!validateForm()) return;

    submitIssueMutation.mutate(
      {
        title,
        category,
        description,
        priority,
        department: "",
        latitude,
        longitude,
        address,
        files,
      },
      {
        onSuccess: (res) => {
          setSubmittedIssueId(res.issueId);
          setShowSuccessModal(true);
        },
      }
    );
  };

  const handleFinalSubmission = (finalData: {
    title: string;
    category: string;
    description: string;
    department: string;
    priority: IssuePriority;
    address: string;
    ocrText?: string;
    sttText?: string;
  }) => {
    submitIssueMutation.mutate(
      {
        title: finalData.title,
        category: finalData.category,
        description: finalData.description,
        priority: finalData.priority,
        department: finalData.department,
        latitude,
        longitude,
        address: finalData.address,
        files,
      },
      {
        onSuccess: (res) => {
          setShowAiPreview(false);
          setSubmittedIssueId(res.issueId);
          setShowSuccessModal(true);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-xs">
            {t("citizen.report.multimodalBadge", "Multimodal AI Ingestion")}
          </Badge>
          <Badge variant="success" className="text-xs">
            {t("citizen.report.moduleBadge", "Module 1")}
          </Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t("citizen.report.title", "Report a Societal Grievance")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("citizen.report.subtitle", "Submit photos, video, audio voice notes, or documents. Our FastAPI AI engine will extract signboards via OCR, transcribe vernacular speech, and generate an interactive AI Preview for your review.")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Multimodal Media Evidence */}
        <Card className="border-border/80 bg-card p-6 sm:p-7 space-y-6 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                1. {t("citizen.report.uploadEvidence", "Photographic & Document Evidence")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("citizen.report.uploadSubtitle", "Upload image of defect, broken hazard signboard, or municipal document")}
              </p>
            </div>
          </div>

          <FileUploader
            files={files}
            onFilesChange={setFiles}
            isUploading={isProcessingAi}
            uploadProgress={uploadProgress}
          />
        </Card>

        {/* Step 2: Voice Grievance Recording */}
        <Card className="border-border/80 bg-card p-6 sm:p-7 space-y-4 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                2. {t("citizen.report.voiceGrievance", "Voice Audio Grievance")} ({t("citizen.report.optional", "Optional")})
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("citizen.report.voiceSubtitle", "Record a spoken description. Transcribed automatically by Speech-to-Text.")}
              </p>
            </div>
          </div>

          <AudioRecorder
            onAudioRecorded={(blob) => setAudioBlob(blob)}
            onAudioCleared={() => setAudioBlob(null)}
          />
        </Card>

        {/* Step 3: GPS Coordinates & Landmark */}
        <Card className="border-border/80 bg-card p-6 sm:p-7 space-y-4 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                3. {t("citizen.report.incidentLocation", "Incident Geo-Location")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("citizen.report.locationSubtitle", "Pinpoint exact coordinates for municipal field worker dispatch")}
              </p>
            </div>
          </div>

          <GpsPicker
            latitude={latitude}
            longitude={longitude}
            address={address}
            onLocationChange={(lat, lng, addr) => {
              setLatitude(lat);
              setLongitude(lng);
              if (addr) setAddress(addr);
            }}
          />
        </Card>

        {/* Step 4: Grievance Context */}
        <Card className="border-border/80 bg-card p-6 sm:p-7 space-y-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                4. {t("citizen.report.contextTitle", "Problem Description")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("citizen.report.contextSubtitle", "Provide brief context (AI will auto-expand and categorize in the preview)")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                {t("citizen.report.headlineLabel", "Brief Grievance Headline")}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("citizen.report.headlinePlaceholder", "e.g. Water pipeline rupture causing road flooding")}
                className="h-11 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold">
                  {t("citizen.report.categoryLabel", "Primary Category")}
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  <option value="Water Supply & Drainage">{t("categories.water", "Water Supply & Drainage")}</option>
                  <option value="Roads & Transportation">{t("categories.roads", "Roads & Transportation")}</option>
                  <option value="Electricity & Power">{t("categories.electricity", "Electricity & Power")}</option>
                  <option value="Solid Waste & Sanitation">{t("categories.waste", "Solid Waste & Sanitation")}</option>
                  <option value="Public Health & Safety">{t("categories.health", "Public Health & Safety")}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-semibold">
                  {t("citizen.report.priorityLabel", "Initial Severity")}
                </Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssuePriority)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  <option value="low">{t("priority.low", "Low")}</option>
                  <option value="medium">{t("priority.medium", "Medium")}</option>
                  <option value="high">{t("priority.high", "High")}</option>
                  <option value="critical">{t("priority.critical", "Critical Hazard")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                {t("citizen.report.detailsLabel", "Detailed Remarks")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("citizen.report.detailsPlaceholder", "Describe the severity, duration, and neighborhood impact...")}
                rows={4}
                className="rounded-xl text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons: AI Pre-Analysis or Direct Dispatch */}
        <div className="p-6 rounded-3xl border border-primary/30 bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("citizen.report.smartDispatchTitle", "Smart Issue Dispatch & Routing")}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("citizen.report.smartDispatchSubtitle", "Run AI extraction for confidence check, or submit directly into the municipal government workflow.")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              onClick={handleStartAiPreview}
              isLoading={isProcessingAi}
              className="w-full sm:w-auto rounded-xl gap-2 font-bold border-primary/30 hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("citizen.report.generateAiPreview", "Run AI Pre-Analysis")}</span>
            </Button>

            <Button
              size="lg"
              variant="gradient"
              onClick={handleDirectSubmission}
              isLoading={submitIssueMutation.isPending}
              className="w-full sm:w-auto rounded-xl gap-2 font-bold shadow-lg shadow-blue-500/20"
            >
              <Send className="h-4 w-4" />
              <span>{t("citizen.report.submitDirectly", "Submit Complaint Directly")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Preview Modal (Before Final Submission) */}
      {aiResult && (
        <AiPreviewModal
          open={showAiPreview}
          onOpenChange={setShowAiPreview}
          aiResult={aiResult}
          onConfirmSubmission={handleFinalSubmission}
          isSubmitting={submitIssueMutation.isPending}
        />
      )}

      {/* Submission Success Modal with Generated Issue ID */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground text-center">
              {t("citizen.report.successTitle", "Complaint Successfully Submitted!")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground text-center">
              {t("citizen.report.successSubtitle", "Your grievance has been stored in the central database, analyzed by the AI router, and automatically sent to the Government Portal docket.")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{t("citizen.report.uniqueIssueId", "Unique Issue ID:")}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-primary text-sm">
                  #{submittedIssueId}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (submittedIssueId) {
                      navigator.clipboard.writeText(submittedIssueId);
                      toast.success(t("toast.issueIdCopied", "Issue ID copied to clipboard!"));
                    }
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
              <span className="text-muted-foreground font-medium">{t("citizen.report.initialStatus", "Initial Status:")}</span>
              <Badge variant="success" className="text-xs uppercase font-mono">
                {t("common.status.submitted", "Submitted")}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
              <span className="text-muted-foreground font-medium">{t("citizen.report.aiVerification", "AI Verification:")}</span>
              <Badge variant="outline" className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                {t("citizen.report.autonomousRoutingActive", "Autonomous Routing Active")}
              </Badge>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 sm:space-x-0">
            <Button
              variant="outline"
              className="w-full sm:w-1/2 rounded-xl text-xs font-semibold"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/citizen");
              }}
            >
              {t("nav.dashboard", "Citizen Dashboard")}
            </Button>
            <Button
              variant="gradient"
              className="w-full sm:w-1/2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/citizen/issues");
              }}
            >
              {t("citizen.report.viewInMyIssues", "View in My Issues")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
