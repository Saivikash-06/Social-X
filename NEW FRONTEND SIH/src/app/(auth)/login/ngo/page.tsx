"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Users,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  ngoLoginSchema,
  NgoLoginFormData,
} from "@/features/ngo/validation/ngo-schemas";
import { useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";

const DEMO_PRESETS = [
  {
    label: "Gramin Vikas Seva Sansthan",
    focus: "Rural Water & Watershed Rejuvenation",
    email: "arundhati@gramin-vikas-trust.org",
  },
  {
    label: "Pratham Digital Literacy",
    focus: "Tribal & Secondary Education",
    email: "sarita.joshi@pratham-innovations.org",
  },
  {
    label: "Goonj Community Network",
    focus: "Disaster Preparedness & Relief",
    email: "manish.sharma@goonj-initiatives.org",
  },
  {
    label: "Smile Health & Nutrition",
    focus: "Maternal Health & Tele-Clinics",
    email: "dr.kavita@smile-health.org",
  },
];

export default function NgoLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginMutation, loginGoogleMutation } = useNgoQueries();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NgoLoginFormData>({
    resolver: zodResolver(ngoLoginSchema),
    defaultValues: {
      email: "arundhati@gramin-vikas-trust.org",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (data: NgoLoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleSignIn = () => {
    loginGoogleMutation.mutate();
  };

  const applyPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
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
        <Badge variant="success" className="gap-1 px-3 py-1 font-semibold text-xs rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>Module 5 • Civil Society & Volunteers</span>
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 bg-card shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  NGO & Volunteer Portal
                </h1>
                <p className="text-xs text-muted-foreground">
                  Empowering grassroots civil society, volunteer squads, and community auditors
                </p>
              </div>
            </div>
          </div>

          {/* Google Sign-In (Role Preserved) */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={handleGoogleSignIn}
              isLoading={loginGoogleMutation.isPending}
              text="Continue with Google (NGO Sign-In)"
            />
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground relative">
                Or authenticate with NGO Credentials
              </span>
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
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-border/70 hover:border-emerald-500/80 hover:bg-emerald-500/5 text-xs transition-all"
                >
                  <p className="font-bold truncate text-foreground">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{preset.focus}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Official Registered Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@ngo-domain.org"
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
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
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
                  className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
                <span>Maintain session token</span>
              </label>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>NITI Aayog Darpan Verified</span>
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-2xl py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold shadow-lg shadow-emerald-600/20 text-sm gap-2"
            >
              {loginMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Access NGO Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Notice */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <HeartHandshake className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Enrolled civil society organizations can adopt civic projects, dispatch ground volunteer squads, upload geotagged field activity evidence, and publish community impact metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
