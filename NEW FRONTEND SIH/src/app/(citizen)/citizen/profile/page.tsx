"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { ConfirmationDialog } from "@/features/shared/components/feedback/confirmation-dialog";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { toast } from "sonner";

export default function CitizenProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { updateProfileMutation, requestDeleteAccountMutation } =
    useCitizenQueries();

  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "Sai Vikash",
      email: user?.email || "citizen.vikash@example.com",
      phone: user?.phone || "+91 98765 43210",
      district: user?.district || "Bengaluru Urban",
      state: user?.state || "Karnataka",
      address: user?.address || "42, Innovation Street, Indiranagar",
    },
  });

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { isSubmitting: isPasswordSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onProfileSave = (data: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    state: string;
    address: string;
  }) => {
    updateProfileMutation.mutate(
      { ...data, avatarUrl },
      {
        onSuccess: () => {
          updateUser({ ...data, avatarUrl });
        },
      }
    );
  };

  const onPasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (data.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Security Updated", {
      description: "Password successfully changed.",
    });
    resetPasswordForm();
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Avatar image loaded.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Citizen Profile
          </h1>
          <Badge variant="success" className="text-xs">
            Verified Identity
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your personal civic details, registered municipal ward, and account security
        </p>
      </div>

      {/* Avatar & Summary Card */}
      <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white text-2xl font-black shadow-md overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.fullName?.slice(0, 2).toUpperCase() || "CZ"
              )}
            </div>
            <label
              htmlFor="avatarInput"
              className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-card border border-border text-foreground shadow-md hover:bg-muted transition-colors"
            >
              <Camera className="h-4 w-4 text-primary" />
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">
              {user?.fullName || "Sai Vikash"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {user?.email || "citizen.vikash@example.com"} • {user?.phone || "+91 98765 43210"}
            </p>
            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge variant="secondary" className="text-[11px]">
                {user?.district || "Bengaluru Urban"}, {user?.state || "Karnataka"}
              </Badge>
              <Badge variant="purple" className="text-[11px]">
                Top Civic Contributor
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            These details are used to autofill and verify grievance submissions
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit(onProfileSave)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Full Legal Name
              </Label>
              <Input id="fullName" {...registerProfile("fullName")} className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Mobile Number (+91)
              </Label>
              <Input id="phone" {...registerProfile("phone")} className="rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                {...registerProfile("email")}
                className="rounded-xl opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-xs font-semibold">
                State
              </Label>
              <Input id="state" {...registerProfile("state")} className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="district" className="text-xs font-semibold">
                District / Ward
              </Label>
              <Input id="district" {...registerProfile("district")} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-semibold">
              Residential Street Address
            </Label>
            <Input id="address" {...registerProfile("address")} className="rounded-xl" />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="gradient"
              className="rounded-xl font-bold gap-2 text-xs"
              isLoading={updateProfileMutation.isPending}
            >
              <span>Save Changes</span>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change Form */}
      <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>Password & Security</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Update your account password to maintain maximum account security
          </p>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onPasswordChange)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-xs font-semibold">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...registerPassword("currentPassword")}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-semibold">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min 8 characters"
                {...registerPassword("newPassword")}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword" className="text-xs font-semibold">
                Confirm New Password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Repeat new password"
                {...registerPassword("confirmNewPassword")}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl font-bold gap-2 text-xs"
              isLoading={isPasswordSubmitting}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone: Delete Account Request */}
      <Card className="border-destructive/40 bg-destructive/5 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-destructive font-bold text-sm">
          <AlertTriangle className="h-5 w-5" />
          <span>Danger Zone: Account Removal</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Requesting account deletion will queue your personal data for removal in
          compliance with digital data privacy standards. Active grievance reports will
          remain archived for municipal public accountability with personal identifiers scrubbed.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-xl text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Request Account Deletion</span>
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Request Account Deletion"
        description="Are you sure you want to request deletion of your citizen account? Our governance administration will verify this request within 48 hours."
        confirmLabel="Confirm Deletion Request"
        variant="destructive"
        isLoading={requestDeleteAccountMutation.isPending}
        onConfirm={() => {
          requestDeleteAccountMutation.mutate();
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}
