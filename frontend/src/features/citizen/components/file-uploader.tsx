"use client";

import * as React from "react";
import {
  UploadCloud,
  Camera,
  FileText,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Progress } from "@/features/shared/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploadProgress?: number;
  isUploading?: boolean;
}

export function FileUploader({
  files,
  onFilesChange,
  uploadProgress = 0,
  isUploading = false,
}: FileUploaderProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    const validFiles: File[] = [];
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    Array.from(incomingFiles).forEach((file) => {
      if (file.size > maxSizeBytes) {
        toast.error(t("toast.fileSizeExceeded", `File ${file.name} exceeds 25MB limit.`));
      } else {
        validFiles.push(file);
      }
    });

    onFilesChange([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-sky-500" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all bg-card/40 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border/80 hover:border-border hover:bg-muted/30"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-bold text-foreground">
          {t("citizen.report.dragDrop", "Drag & Drop Images, Video clips, or Documents")}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          {t("citizen.report.supportedFormats", "Supports JPEG, PNG, MP4, and PDF (Max 25MB). Auto-scanned by FastAPI OCR and computer vision.")}
        </p>

        {/* Buttons inside drop zone */}
        <div className="mt-4 flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs font-semibold"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{t("common.buttons.browseFiles", "Browse Files")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs font-semibold"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-3.5 w-3.5 text-primary" />
            <span>{t("common.buttons.openCamera", "Open Camera")}</span>
          </Button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1.5 rounded-xl border border-border p-3 bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {t("citizen.report.uploadingProgress", "Uploading & Processing Media via AI...")}
            </span>
            <span className="font-mono text-primary font-bold">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* File Previews List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("citizen.report.attachedEvidence", "Attached Evidence")} ({files.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {getFileIcon(file)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg shrink-0"
                  onClick={() => removeFile(idx)}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">{t("common.buttons.removeFile", "Remove file")}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
