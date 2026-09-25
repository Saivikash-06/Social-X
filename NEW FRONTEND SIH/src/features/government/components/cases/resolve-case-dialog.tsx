"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { GovernmentCase } from "../../types";
import {
  resolveCaseSchema,
  ResolveCaseFormData,
} from "../../validation/government-schemas";
import { useGovernmentMutations } from "../../hooks/use-government-queries";

interface ResolveCaseDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResolveCaseDialog({
  caseData,
  isOpen,
  onClose,
}: ResolveCaseDialogProps) {
  const { resolveCaseMutation } = useGovernmentMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResolveCaseFormData>({
    resolver: zodResolver(resolveCaseSchema),
    values: {
      caseId: caseData?.id || "",
      resolutionNotes: "",
      completionEvidenceUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
      laborHoursSpent: 4,
    },
  });

  const onSubmit = (data: ResolveCaseFormData) => {
    resolveCaseMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              Mark Grievance Resolved
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Certify completion of engineering/sanitation works for Case #{caseData.id}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Resolution Notes & Actions Taken</Label>
            <Textarea
              {...register("resolutionNotes")}
              placeholder="Detail the mechanical fix, materials installed, contractor team deployed, and post-work inspection outcome..."
              className="text-xs rounded-xl border-border/80"
              rows={3}
            />
            {errors.resolutionNotes && (
              <p className="text-[11px] text-destructive">{errors.resolutionNotes.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Labor Hours Spent</Label>
            <Input
              {...register("laborHoursSpent", { valueAsNumber: true })}
              type="number"
              step="0.5"
              className="text-xs rounded-xl border-border/80"
            />
            {errors.laborHoursSpent && (
              <p className="text-[11px] text-destructive">{errors.laborHoursSpent.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Completion Photographic Evidence URL</Label>
            <Input
              {...register("completionEvidenceUrl")}
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="text-xs rounded-xl border-border/80 font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Geotagged photographic verification will be shared with the reporting citizen.
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={resolveCaseMutation.isPending}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm & Close Grievance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
