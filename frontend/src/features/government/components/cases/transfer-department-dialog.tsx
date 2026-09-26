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
  transferDepartmentSchema,
  TransferDepartmentFormData,
} from "../../validation/government-schemas";
import {
  useGovernmentDepartments,
  useGovernmentMutations,
} from "../../hooks/use-government-queries";

interface TransferDepartmentDialogProps {
  caseData: GovernmentCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferDepartmentDialog({
  caseData,
  isOpen,
  onClose,
}: TransferDepartmentDialogProps) {
  const { data: departments } = useGovernmentDepartments();
  const { transferDepartmentMutation } = useGovernmentMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferDepartmentFormData>({
    resolver: zodResolver(transferDepartmentSchema),
    values: {
      caseId: caseData?.id || "",
      newDepartment: "",
      justification: "",
    },
  });

  const onSubmit = (data: TransferDepartmentFormData) => {
    transferDepartmentMutation.mutate(data, {
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
            Inter-Department Transfer
          </DialogTitle>
          <DialogDescription className="text-xs">
            Transfer Case #{caseData.id} from <strong>{caseData.department}</strong> to another civic line authority.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Target Line Department</Label>
            <select
              {...register("newDepartment")}
              className="w-full text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose Line Department --</option>
              {(departments || []).map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {errors.newDepartment && (
              <p className="text-[11px] text-destructive">{errors.newDepartment.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Jurisdictional Justification</Label>
            <Textarea
              {...register("justification")}
              placeholder="State why this grievance falls outside current departmental mandate and requires inter-agency handover..."
              className="text-xs rounded-xl border-border/80"
              rows={3}
            />
            {errors.justification && (
              <p className="text-[11px] text-destructive">{errors.justification.message}</p>
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
              disabled={transferDepartmentMutation.isPending}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Transfer Grievance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
