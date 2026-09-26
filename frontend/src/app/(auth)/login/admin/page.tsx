"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  KeyRound,
  Terminal,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  adminLoginSchema,
  AdminLoginFormData,
} from "@/features/admin/validation/admin-schemas";
import { useAdminMutations } from "@/features/admin/hooks/use-admin-queries";

const DEMO_ADMIN_PRESETS = [
  {
    label: "Dr. Vikramaditya Sen",
    role: "Platform Owner & Principal Director",
    email: "owner@socialx.gov.in",
    badge: "Root Clearance",
  },
  {
    label: "Col. Rajesh Nair (Retd.)",
    role: "Chief Platform Security Officer (CISO)",
    email: "secops@socialx.gov.in",
    badge: "SecOps Root",
  },
  {
    label: "Priya Sundaram",
    role: "Infrastructure & AI Pipeline Lead",
    email: "infra.lead@socialx.gov.in",
    badge: "Infra Lead",
  },
];

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginMutation, loginGoogleMutation } = useAdminMutations();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "owner@socialx.gov.in",
      password: "RootAdminPassword2026!",
      hardwareTokenKey: "FIDO2-TOKEN-NIC-9942",
      rememberMe: true,
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleSignIn = () => {
    loginGoogleMutation.mutate();
  };

  const applyPreset = (preset: (typeof DEMO_ADMIN_PRESETS)[0]) => {
    setValue("email", preset.email);
    setValue("password", "RootAdminPassword2026!");
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            <span>Select Stakeholder Role</span>
          </Link>
        </Button>
        <Badge variant="destructive" className="gap-1 px-3 py-1 font-mono font-bold text-xs rounded-full">
          <Terminal className="h-3 w-3" />
          <span>Root Administrative Console</span>
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Super Administrator Access
                </h1>
                <p className="text-xs text-muted-foreground">
                  Social-X National Civic Telemetry &bull; Root Platform Governance
                </p>
              </div>
            </div>
          </div>

          {/* Google SSO */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={handleGoogleSignIn}
              isLoading={loginGoogleMutation.isPending}
              text="Authenticate via NIC GovPass / Google SSO"
            />
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground relative">
                Or authenticate with Root Master Key
              </span>
            </div>
          </div>

          {/* Quick Demo Presets */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              ⚡ 1-Click Root Demo Profiles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_ADMIN_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-border/70 hover:border-rose-500/80 hover:bg-rose-500/5 text-xs transition-all space-y-0.5"
                >
                  <p className="font-bold truncate text-foreground text-xs">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{preset.role}</p>
                  <span className="inline-block text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Administrative Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@socialx.gov.in"
                  {...register("email")}
                  className="pl-10 rounded-2xl border-border/80 bg-muted/30 font-mono text-xs"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Root Access Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("password")}
                  className="pl-10 pr-10 rounded-2xl border-border/80 bg-muted/30 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Hardware Token Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="hardwareTokenKey" className="text-xs font-semibold">
                  FIDO2 Hardware Key / TOTP Token
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">Simulated Key Accepted</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hardwareTokenKey"
                  type="text"
                  placeholder="FIDO2-TOKEN-KEY"
                  {...register("hardwareTokenKey")}
                  className="pl-10 rounded-2xl border-border/80 bg-muted/30 font-mono text-xs"
                />
              </div>
            </div>

            {/* Remember & Notice */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-border text-rose-600 focus:ring-rose-500"
                />
                <span>Maintain root authorization token</span>
              </label>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Server className="h-3.5 w-3.5 text-emerald-500" />
                <span>NIC Datacenter Node 1</span>
              </span>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-rose-600 to-red-800 hover:from-rose-700 hover:to-red-900 text-white font-bold shadow-lg shadow-rose-600/20 text-sm gap-2"
            >
              {loginMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Enter Super Admin Console</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Unauthorized access to the root governance portal is strictly prohibited under the Information Technology Act. All administrative IP sessions, queries, and cryptographic mutations are logged to immutable tamper-evident storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
