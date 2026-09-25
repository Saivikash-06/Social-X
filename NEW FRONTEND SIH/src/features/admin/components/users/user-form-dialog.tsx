"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Save, Shield } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { userFormSchema, UserFormData } from "../../validation/admin-schemas";
import { ManagedUser } from "../../types";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: ManagedUser | null;
  isLoading?: boolean;
}

export function UserFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "+91 ",
      role: (initialData?.role as UserFormData["role"]) || "citizen",
      roleLabel: initialData?.roleLabel || "Citizen Contributor",
      organization: initialData?.organization || "",
      district: initialData?.district || "Pune",
      state: initialData?.state || "Maharashtra",
      status: initialData?.status || "active",
      verified: initialData?.verified ?? true,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        email: initialData.email,
        phone: initialData.phone,
        role: initialData.role as UserFormData["role"],
        roleLabel: initialData.roleLabel,
        organization: initialData.organization || "",
        district: initialData.district,
        state: initialData.state,
        status: initialData.status,
        verified: initialData.verified,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        phone: "+91 ",
        role: "citizen",
        roleLabel: "Citizen Contributor",
        organization: "",
        district: "Pune",
        state: "Maharashtra",
        status: "active",
        verified: true,
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              {initialData ? <Shield className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {initialData ? `Edit User: ${initialData.fullName}` : "Provision New Platform User"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Set role permissions, verified identity credentials, and jurisdiction.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Smt. Manjula Rao, IAS"
                {...register("fullName")}
                className="rounded-xl border-border/80"
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Official Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@domain.gov.in"
                {...register("email")}
                className="rounded-xl border-border/80"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Contact Phone
              </Label>
              <Input
                id="phone"
                placeholder="+91 98210 00000"
                {...register("phone")}
                className="rounded-xl border-border/80"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold">
                Platform Role
              </Label>
              <select
                id="role"
                {...register("role")}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="citizen">Citizen Portal</option>
                <option value="government">Government & Municipality</option>
                <option value="university">University & Academia</option>
                <option value="industry">Industry & Corporate CSR</option>
                <option value="ngo">Civil Society & Volunteers</option>
                <option value="research">Research Organization</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>

            {/* Role Label / Title */}
            <div className="space-y-1.5">
              <Label htmlFor="roleLabel" className="text-xs font-semibold">
                Official Designation / Title
              </Label>
              <Input
                id="roleLabel"
                placeholder="e.g. Chief Engineer (Roads)"
                {...register("roleLabel")}
                className="rounded-xl border-border/80"
              />
              {errors.roleLabel && <p className="text-xs text-destructive">{errors.roleLabel.message}</p>}
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <Label htmlFor="organization" className="text-xs font-semibold">
                Organization / Department
              </Label>
              <Input
                id="organization"
                placeholder="e.g. Pune Municipal Corporation"
                {...register("organization")}
                className="rounded-xl border-border/80"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <Label htmlFor="district" className="text-xs font-semibold">
                District Jurisdiction
              </Label>
              <Input
                id="district"
                placeholder="e.g. Pune"
                {...register("district")}
                className="rounded-xl border-border/80"
              />
              {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-xs font-semibold">
                State
              </Label>
              <Input
                id="state"
                placeholder="e.g. Maharashtra"
                {...register("state")}
                className="rounded-xl border-border/80"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
              <input
                type="checkbox"
                {...register("verified")}
                className="rounded border-border text-rose-600 focus:ring-rose-500"
              />
              <span>Mark as Government Verified</span>
            </label>

            <div className="flex items-center gap-2">
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
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-bold text-xs gap-1.5 shadow-md"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{initialData ? "Update User" : "Provision User"}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
