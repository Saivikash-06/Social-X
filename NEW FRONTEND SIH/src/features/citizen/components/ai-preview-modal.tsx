"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Building2,
  MapPin,
  Mic,
  Camera,
  Edit3,
  Send,
  AlertCircle,
} from "lucide-react";
import { AIAnalysisResult, IssuePriority } from "../types";
import { useTranslation } from "react-i18next";

interface AiPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiResult: AIAnalysisResult;
  onConfirmSubmission: (finalData: {
    title: string;
    category: string;
    description: string;
    department: string;
    priority: IssuePriority;
    address: string;
    ocrText?: string;
    sttText?: string;
  }) => void;
  isSubmitting?: boolean;
}

export function AiPreviewModal({
  open,
  onOpenChange,
  aiResult,
  onConfirmSubmission,
  isSubmitting = false,
}: AiPreviewModalProps) {
  const { t } = useTranslation();

  // Citizen-editable state for extracted fields
  const [title, setTitle] = React.useState(aiResult.title || "");
  const [category, setCategory] = React.useState(aiResult.category || "");
  const [department, setDepartment] = React.useState(
    aiResult.detectedDepartment || ""
  );
  const [description, setDescription] = React.useState(
    aiResult.description || ""
  );
  const [priority, setPriority] = React.useState<IssuePriority>(
    aiResult.recommendedPriority || "high"
  );
  const [address, setAddress] = React.useState(
    aiResult.detectedLocation || "Indiranagar Ward 142, Bengaluru"
  );
  const [ocrText, setOcrText] = React.useState(aiResult.ocrOutput || "");
  const [sttText, setSttText] = React.useState(
    aiResult.speechToTextResult || ""
  );

  React.useEffect(() => {
    setTitle(aiResult.title || "");
    setCategory(aiResult.category || "");
    setDepartment(aiResult.detectedDepartment || "");
    setDescription(aiResult.description || "");
    setPriority(aiResult.recommendedPriority || "high");
    setAddress(aiResult.detectedLocation || "Indiranagar Ward 142, Bengaluru");
    setOcrText(aiResult.ocrOutput || "");
    setSttText(aiResult.speechToTextResult || "");
  }, [aiResult]);

  const handleConfirm = () => {
    onConfirmSubmission({
      title,
      category,
      description,
      department,
      priority,
      address,
      ocrText,
      sttText,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
        <DialogHeader className="space-y-2 border-b border-border/80 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {t("ai.previewTitle", "AI Preview & Human Verification")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {t("ai.previewSubtitle", "Review and edit information automatically extracted by Social-X AI engines")}
                </DialogDescription>
              </div>
            </div>

            <Badge variant="success" className="gap-1 font-mono text-xs px-2.5 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{aiResult.confidenceScore || 96.8}% {t("ai.confidenceScore", "Confidence")}</span>
            </Badge>
          </div>
        </DialogHeader>

        {/* Informative Notice */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
          <Cpu className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong className="text-foreground">{t("ai.verificationStep", "Citizen Verification Step")}:</strong>{" "}
            {t("ai.verificationStepHelp", "You can directly edit any field below before final dispatch to ensure 100% accuracy.")}
          </p>
        </div>

        {/* Extracted Multimodal Intelligence (OCR & STT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* OCR Box */}
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Camera className="h-3.5 w-3.5 text-sky-500" />
                <span>{t("ai.ocrVision", "OCR Vision Extraction")}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {t("common.labels.editable", "Editable")}
              </Badge>
            </div>
            <Textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder={t("ai.noOcrText", "No text detected on signboards")}
              rows={2}
              className="text-xs bg-background/80 font-mono"
            />
          </div>

          {/* STT Box */}
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Mic className="h-3.5 w-3.5 text-amber-500" />
                <span>{t("ai.speechResult", "Speech-to-Text Transcript")}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {t("common.labels.editable", "Editable")}
              </Badge>
            </div>
            <Textarea
              value={sttText}
              onChange={(e) => setSttText(e.target.value)}
              placeholder={t("ai.noAudioMemo", "No audio memo attached")}
              rows={2}
              className="text-xs bg-background/80 font-mono"
            />
          </div>
        </div>

        {/* Editable Extracted Fields */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="aiTitle" className="text-xs font-bold flex items-center gap-1.5">
              <span>{t("common.labels.title", "Issue Title")}</span>
              <Edit3 className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Input
              id="aiTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-sm font-semibold rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="aiCategory" className="text-xs font-bold flex items-center gap-1.5">
                <span>{t("ai.classifiedCategory", "Detected Category")}</span>
                <Edit3 className="h-3 w-3 text-muted-foreground" />
              </Label>
              <select
                id="aiCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              >
                <option value="Water Supply & Sewerage">{t("categories.water", "Water Supply & Sewerage")}</option>
                <option value="Roads & Transportation">{t("categories.roads", "Roads & Transportation")}</option>
                <option value="Electricity & Power">{t("categories.electricity", "Electricity & Power")}</option>
                <option value="Solid Waste & Sanitation">{t("categories.waste", "Solid Waste & Sanitation")}</option>
                <option value="Public Health & Safety">{t("categories.health", "Public Health & Safety")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="aiPriority" className="text-xs font-bold flex items-center gap-1.5">
                <span>{t("ai.severityPriority", "Recommended Priority")}</span>
                <Edit3 className="h-3 w-3 text-muted-foreground" />
              </Label>
              <select
                id="aiPriority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              >
                <option value="low">{t("priority.low", "Low Priority")}</option>
                <option value="medium">{t("priority.medium", "Medium Priority")}</option>
                <option value="high">{t("priority.high", "High Priority")}</option>
                <option value="critical">{t("priority.critical", "Critical (Immediate Hazard)")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aiDepartment" className="text-xs font-bold flex items-center gap-1.5">
              <span>{t("ai.dispatchedDept", "Routed Municipal Department")}</span>
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Input
              id="aiDepartment"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aiLocation" className="text-xs font-bold flex items-center gap-1.5">
              <span>{t("ai.mappedLocation", "Detected Landmark / Location")}</span>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Input
              id="aiLocation"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aiDescription" className="text-xs font-bold flex items-center gap-1.5">
              <span>{t("common.labels.description", "Detailed Description")}</span>
              <Edit3 className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Textarea
              id="aiDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="mt-6 border-t border-border/80 pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl"
          >
            {t("common.buttons.modifyUploads", "Modify Media Uploads")}
          </Button>

          <Button
            type="button"
            variant="gradient"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            className="w-full sm:w-auto rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20"
          >
            <span>{t("ai.confirmSubmit", "Confirm & Submit to Municipal Node")}</span>
            <Send className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
