"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Sparkles,
  Coins,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  industryLoginSchema,
  IndustryLoginFormData,
} from "@/features/industry/validation/industry-schemas";
import { useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import { IndustryRole } from "@/features/industry/types";

const DEMO_PRESETS: { label: string; role: IndustryRole; email: string; org: string }[] = [
  {
    label: "CSR Foundation Lead",
    role: "csr_org",
    email: "rajeshwar.kulkarni@tata.com",
    org: "Tata Social Innovation Foundation",
  },
  {
    label: "Corporate R&D Director",
    role: "corporate",
    email: "kiran.deshmukh@bosch.com",
    org: "Bosch Smart Mobility R&D",
  },
  {
    label: "MSME Manufacturing Partner",
    role: "msme",
    email: "anil.kumar@precisionhydraulics.in",
    org: "Precision Fluidics MSME Hub",
  },
  {
    label: "Climate-Tech Startup Lead",
    role: "startup",
    email: "priya.nair@voltamicrogrids.io",
    org: "Volta Community Swapping",
  },
];

export default function IndustryLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginMutation } = useIndustryQueries();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IndustryLoginFormData>({
    resolver: zodResolver(industryLoginSchema),
    defaultValues: {
      email: "rajeshwar.kulkarni@tata.com",
      password: "Password123!",
      role: "csr_org",
      rememberMe: true,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: IndustryLoginFormData) => {
    loginMutation.mutate(data);
  };

  const applyPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setValue("email", preset.email);
    setValue("role", preset.role);
    setValue("password", "Password123!");
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 rounded-xl text-muted-foreground hover:text-foreground">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            <span>Select Different Role</span>
          </Link>
        </Button>
        <Badge variant="warning" className="gap-1 px-3 py-1 font-semibold text-xs rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>Module 4 • Corporate & CSR</span>
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">Industry & CSR Portal</h1>
                <p className="text-xs text-muted-foreground">Authenticate your corporate or innovation partner account</p>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Profiles */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              ⚡ Quick Demo Profiles (1-Click Fill)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedRole === preset.role
                      ? "border-amber-500/80 bg-amber-500/10 text-foreground font-semibold"
                      : "border-border/70 hover:border-border hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <p className="font-bold truncate text-foreground">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{preset.org}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Stakeholder Category Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold">
                Organization Stakeholder Classification
              </Label>
              <select
                id="role"
                {...register("role")}
                className="w-full rounded-2xl border border-border/80 bg-muted/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="csr_org">CSR Organization (Section 135 Trust)</option>
                <option value="corporate">Corporate Organization / Enterprise</option>
                <option value="msme">MSME / Regional Manufacturing Partner</option>
                <option value="startup">Startup Incubatee / Tech Innovator</option>
                <option value="innovation_partner">Innovation Partner / Consortium</option>
              </select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Corporate Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
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
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
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

            {/* Remember Me & Compliance */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-border text-amber-600 focus:ring-amber-500"
                />
                <span>Keep session active</span>
              </label>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit TLS Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold shadow-lg shadow-amber-600/20 text-sm gap-2"
            >
              {loginMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Access Industry Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Notice */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <Building2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Verified industry partners can disburse CSR funds under Section 135, track milestone telemetry in real time, and co-sponsor civic prototypes with universities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
