'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  FileCode,
  Tag,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import {
  researchUploadSchema,
  ResearchUploadValues,
} from '@/features/university/validation/university-schemas';
import { useFacultyProjects } from '@/features/university/hooks/use-university-queries';
import { researchApi } from '@/features/university/services/research-api';

interface ResearchUploadFormProps {
  onSuccess?: () => void;
}

export function ResearchUploadForm({ onSuccess }: ResearchUploadFormProps) {
  const { data: projects = [] } = useFacultyProjects();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ResearchUploadValues>({
    resolver: zodResolver(researchUploadSchema),
    defaultValues: {
      projectId: 'proj-01',
      milestoneId: 'ms-02',
      artifactType: 'lab_notes',
      title: '',
      description: '',
      tags: 'firmware, iot, pilot',
    },
  });

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: ResearchUploadValues) => {
    if (!selectedFile) {
      toast.warning('Please select or drop a deliverable file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', values.projectId);
      formData.append('milestoneId', values.milestoneId || '');
      formData.append('artifactType', values.artifactType || '');
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('tags', values.tags || '');

      await researchApi.uploadDocument(formData);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        reset();
        toast.success(
          `Deliverable "${values.title}" uploaded and queued for advisor review!`
        );
        onSuccess?.();
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      toast.error(err.message || 'Failed to upload document.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Project & Milestone selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Target Research Project
          </label>
          <select
            {...register('projectId')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.title}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-xs text-destructive">{errors.projectId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Artifact Category
          </label>
          <select
            {...register('artifactType')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="lab_notes">Laboratory Observations & Notes</option>
            <option value="dataset">Experimental Telemetry Dataset (CSV/JSON)</option>
            <option value="code_repository">Firmware / Algorithm Codepack (ZIP)</option>
            <option value="paper_draft">Academic Conference Paper Draft (PDF)</option>
            <option value="presentation">Municipal Advisory Presentation (PPTX)</option>
          </select>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Artifact Document Title
        </label>
        <Input
          {...register('title')}
          placeholder="e.g. Edge Inverter Telemetry Sprints - Cycle 4 Log"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Methodology Summary & Notes for Advisor
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Explain test conditions, sample size, anomalies observed, and calibration benchmarks..."
          className="w-full rounded-lg border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* File Dropzone */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          File Attachment (Max 50MB)
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-all hover:border-cyan-500/50 hover:bg-muted/40"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {selectedFile ? selectedFile.name : 'Click to browse or drag and drop files'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for cryptographic checksum`
              : 'Accepts PDF, ZIP, CSV, JSON, PY, IPYNB, TAR.GZ'}
          </p>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex justify-between text-xs font-medium text-cyan-800 dark:text-cyan-200">
            <span>Transferring deliverable to campus cluster...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-cyan-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isUploading}
        isLoading={isUploading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Submit Artifact for Faculty Review
      </Button>
    </form>
  );
}
