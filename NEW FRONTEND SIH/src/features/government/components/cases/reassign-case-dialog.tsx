"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { GovernmentCase } from "../../types";
import {
  reassignOfficerSchema,
  ReassignOfficerFormData,
} from "../../validation/government-schemas";
import {
  useGovernmentOfficers,
  useGovernmentMutations,
} from "../../hooks/use-government-queries";

interface ReassignCaseDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReassignCaseDialog({
  caseData,
  isOpen,
  onClose,
}: ReassignCaseDialogProps) {
  const { data: officers } = useGovernmentOfficers();
  const { reassignOfficerMutation } = useGovernmentMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReassignOfficerFormData>({
    resolver: zodResolver(reassignOfficerSchema),
    values: {
      caseId: caseData?.id || "",
      newOfficerId: "",
      reason: "",
    },
  });

  const onSubmit = (data: ReassignOfficerFormData) => {
    reassignOfficerMutation.mutate(data, {
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
          <DialogTitle className="text-lg font-bold">
            Reassign Field Officer
          </DialogTitle>
          <DialogDescription className="text-xs">
            Transfer operational command of Case #{caseData.id} to another certified officer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select New Officer</Label>
            <select
              {...register("newOfficerId")}
              className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Field Officer --</option>
              {(officers || []).map((off) => (
                <option key={off.id} value={off.id}>
                  {off.name} ({off.designation} &bull; {off.department})
                </option>
              ))}
            </select>
            {errors.newOfficerId && (
              <p className="text-[11px] text-destructive">{errors.newOfficerId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Operational Reason</Label>
            <Textarea
              {...register("reason")}
              placeholder="e.g. Jurisdiction alignment, specialized equipment authorization, or shift handover..."
              className="text-xs rounded-xl border-border/80"
              rows={3}
            />
            {errors.reason && (
              <p className="text-[11px] text-destructive">{errors.reason.message}</p>
            )}
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
              disabled={reassignOfficerMutation.isPending}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
