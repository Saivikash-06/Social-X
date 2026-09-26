"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, KeyRound, Copy, Check } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { resetPasswordSchema, ResetPasswordFormData } from "../../validation/admin-schemas";
import { ManagedUser } from "../../types";

interface ResetPasswordDialogProps {
  user: ManagedUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
}

export function ResetPasswordDialog({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ResetPasswordDialogProps) {
  const [copied, setCopied] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema) as any,
    defaultValues: {
      newPassword: "TempPass@" + Math.floor(1000 + Math.random() * 9000),
      confirmPassword: "",
      requirePasswordChangeOnLogin: true,
      sendNotificationEmail: true,
    },
  });

  if (!isOpen || !user) return null;

  const generateRandomPassword = () => {
    const pwd = "SecureSX@" + Math.floor(100000 + Math.random() * 900000);
    setValue("newPassword", pwd);
    setValue("confirmPassword", pwd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Reset Password</h2>
              <p className="text-xs text-muted-foreground">User: {user.fullName} ({user.email})</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-xl">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Generate cryptographic temporary key</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateRandomPassword}
              className="text-xs rounded-xl h-7"
            >
              Auto-generate
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold">New Temporary Password</Label>
            <Input
              id="newPassword"
              type="text"
              {...register("newPassword")}
              className="rounded-xl border-border/80 font-mono text-xs"
            />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Temporary Password</Label>
            <Input
              id="confirmPassword"
              type="text"
              placeholder="Confirm the password above"
              {...register("confirmPassword")}
              className="rounded-xl border-border/80 font-mono text-xs"
            />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-foreground">
              <input
                type="checkbox"
                {...register("requirePasswordChangeOnLogin")}
                className="rounded border-border text-rose-600 focus:ring-rose-500"
              />
              <span>Force user to change password upon next sign-in</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-foreground">
              <input
                type="checkbox"
                {...register("sendNotificationEmail")}
                className="rounded border-border text-rose-600 focus:ring-rose-500"
              />
              <span>Send secure credentials notification to {user.email}</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white font-bold text-xs shadow-md"
            >
              Reset Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
