"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/features/auth/validation/auth-schemas";
import { useAuthMutations } from "@/features/auth/hooks/use-auth-mutations";

export default function ForgotPasswordPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [email, setEmail] = React.useState("");

  const { forgotPasswordMutation, resetPasswordMutation } = useAuthMutations();

  // Step 1 Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "123456",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onEmailSubmit = (data: ForgotPasswordFormData) => {
    setEmail(data.email);
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setStep(2);
      },
    });
  };

  const onResetSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(
      { ...data, email },
      {
        onSuccess: () => {
          setStep(3);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/login/citizen"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Citizen Sign In</span>
        </Link>
        <Badge variant="warning" className="text-[11px] px-2 py-0.5">
          Account Security
        </Badge>
      </div>

      <Card className="border-border/80 bg-card/90 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden">
        {/* Header Accent */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 text-white space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
          </div>
          <p className="text-xs text-blue-100">
            {step === 1 && "Step 1: Verify your registered citizen email"}
            {step === 2 && "Step 2: Enter 6-digit code & choose new password"}
            {step === 3 && "Password updated successfully!"}
          </p>
        </div>

        <CardContent className="p-6 sm:p-7">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your registered citizen email address below. We'll send a 6-digit
                verification OTP code to verify your identity.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11 rounded-xl"
                    {...registerEmail("email")}
                  />
                </div>
                {emailErrors.email && (
                  <p className="text-xs text-destructive font-medium">
                    {emailErrors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-2"
                isLoading={forgotPasswordMutation.isPending}
              >
                <span>Send Verification Code</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
              <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground space-y-1">
                <p>
                  Verification code sent to:{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  (Demo tip: code 123456 is pre-filled)
                </p>
              </div>

              {/* OTP */}
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-xs font-semibold">
                  6-Digit OTP Code
                </Label>
                <Input
                  id="otp"
                  maxLength={6}
                  placeholder="123456"
                  className="h-11 rounded-xl font-mono text-center tracking-widest text-lg font-bold"
                  {...registerReset("otp")}
                />
                {resetErrors.otp && (
                  <p className="text-xs text-destructive">{resetErrors.otp.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="pl-10 h-11 rounded-xl"
                    {...registerReset("newPassword")}
                  />
                </div>
                {resetErrors.newPassword && (
                  <p className="text-xs text-destructive font-medium">
                    {resetErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword" className="text-xs font-semibold">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Repeat new password"
                    className="pl-10 h-11 rounded-xl"
                    {...registerReset("confirmNewPassword")}
                  />
                </div>
                {resetErrors.confirmNewPassword && (
                  <p className="text-xs text-destructive font-medium">
                    {resetErrors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-2"
                isLoading={resetPasswordMutation.isPending}
              >
                <span>Update Password</span>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Password Successfully Reset!
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Your credentials have been securely updated. You can now access your
                Citizen Dashboard with your new password.
              </p>
              <Button asChild size="lg" variant="gradient" className="w-full rounded-xl mt-4">
                <Link href="/login/citizen">
                  <span>Sign In Now</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
