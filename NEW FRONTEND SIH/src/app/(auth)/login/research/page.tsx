"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FlaskConical,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  researchLoginSchema,
  ResearchLoginFormData,
} from "@/features/research/validation/research-schemas";
import { useResearchQueries } from "@/features/research/hooks/use-research-queries";

const RESEARCH_DEMO_PRESETS = [
  {
    label: "IISc Smart Cities & Infrastructure",
    domain: "Acoustic Hydrology & Wavelet AI",
    email: "ramanathan@iisc.ac.in",
  },
  {
    label: "IIT Bombay Environmental Lab",
    domain: "Zero Liquid Discharge & Sensors",
    email: "bakulrao@iitb.ac.in",
  },
  {
    label: "CSIR-NEERI Bioengineering",
    domain: "Decentralized Carbon Biochar",
    email: "p_srivastava@neeri.res.in",
  },
  {
    label: "IIIT Civic Computing Unit",
    domain: "Transit Edge-AI Volumetrics",
    email: "priya.balasubramanian@iiitb.ac.in",
  },
];

export default function ResearchLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginMutation, loginGoogleMutation } = useResearchQueries();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResearchLoginFormData>({
    resolver: zodResolver(researchLoginSchema),
    defaultValues: {
      email: "ramanathan@iisc.ac.in",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (data: ResearchLoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleSignIn = () => {
    loginGoogleMutation.mutate();
  };

  const applyPreset = (preset: (typeof RESEARCH_DEMO_PRESETS)[0]) => {
    setValue("email", preset.email);
    setValue("password", "Password123!");
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            <span>Select Different Role</span>
          </Link>
        </Button>
        <Badge variant="info" className="gap-1 px-3 py-1 font-semibold text-xs rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>Module 6 • Research & Applied Innovation</span>
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Research Organization Portal
                </h1>
                <p className="text-xs text-muted-foreground">
                  Scientific R&D institutes, national laboratories, and academic consortia
                </p>
              </div>
            </div>
          </div>

          {/* Google Sign-In (Role Preserved) */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={handleGoogleSignIn}
              isLoading={loginGoogleMutation.isPending}
              text="Continue with Institutional Google (Research ID)"
            />
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground relative">
                Or authenticate with Research Credentials
              </span>
            </div>
          </div>

          {/* 1-Click Demo Profiles */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              ⚡ Quick Demo Profiles (1-Click Fill)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RESEARCH_DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-border/70 hover:border-indigo-500/80 hover:bg-indigo-500/5 text-xs transition-all"
                >
                  <p className="font-bold truncate text-foreground">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{preset.domain}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Institutional Academic / Lab Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="scientist@institute.ac.in"
                  {...register("email")}
                  className="pl-10 rounded-2xl border-border/80 bg-muted/30"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-10 pr-10 rounded-2xl border-border/80 bg-muted/30"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span>Maintain session token</span>
              </label>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                <span>DSIR Recognized SIRO Organization</span>
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold shadow-lg shadow-indigo-600/20 text-sm gap-2"
            >
              {loginMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Access Research Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Notice */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <Building className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Research institutes can access municipal sensor feeds, upload peer-reviewed publications, index datasets, track TRL milestones in the Innovation Lab, and bid on government technical RFPs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
