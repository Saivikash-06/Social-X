"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  UserPlus,
  LogIn,
  Layers,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { GoogleSignInModal } from "@/features/auth/components/google-sign-in-modal";
import { loginSchema, LoginFormData } from "@/features/auth/validation/auth-schemas";
import { useAuthMutations } from "@/features/auth/hooks/use-auth-mutations";
import {
  RoleSelectorCard,
  ROLES_CONFIG,
} from "@/features/auth/components/role-selector-card";

export default function UnifiedLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"login" | "portals">("login");

  const { loginMutation, googleLoginMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "citizen.vikash@example.com",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleSelect = (email: string) => {
    googleLoginMutation.mutate(email);
  };

  const activeError = loginMutation.error?.message || googleLoginMutation.error?.message;
  const isUnregistered =
    activeError?.includes("No account found") || activeError?.includes("not registered");

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-10">
      {/* Google Sign In Account Selector Modal */}
      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectGoogleEmail={handleGoogleSelect}
        isLoading={googleLoginMutation.isPending}
        errorMessage={googleLoginMutation.error?.message || null}
      />

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="info">Platform Authentication</Badge>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Sign In to Social-X
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Universal civic platform uniting Citizens, Government Officials, Academic Scholars, Industry CSR Partners, and System Administrators.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-muted/50 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Universal Login</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("portals")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "portals"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Browse Stakeholder Portals</span>
          </button>
        </div>
      </div>

      {/* View 1: Unified Login Form */}
      {activeTab === "login" && (
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border-border/80 bg-card/90 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden">
            {/* Gradient Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 sm:p-7 text-white space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Account Login</h2>
                  <p className="text-xs text-blue-100">
                    Auto-redirects to your role dashboard
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-7 space-y-6">
              {/* Active Error Banner */}
              {activeError && (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 space-y-2 text-destructive animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold leading-tight">Authentication Notice</p>
                      <p className="text-xs font-medium leading-relaxed">{activeError}</p>
                    </div>
                  </div>
                  {isUnregistered && (
                    <div className="pt-1 flex justify-end">
                      <Button asChild size="sm" variant="destructive" className="h-7 text-xs rounded-xl gap-1.5 font-bold">
                        <Link href="/register">
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Register First</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Google Sign In */}
              <GoogleAuthButton
                onClick={() => setShowGoogleModal(true)}
                isLoading={googleLoginMutation.isPending}
                text="Continue with Google"
              />

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-border" />
                <span className="bg-card px-3 text-xs font-semibold uppercase text-muted-foreground relative">
                  Or continue with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
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
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  variant="gradient"
                  className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-2"
                  isLoading={loginMutation.isPending}
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              {/* Registration footer */}
              <div className="pt-2 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="font-bold text-primary hover:underline ml-1">
                  Create account
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Preset Buttons for Quick Testing */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 text-xs space-y-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Quick Test Presets (Verify Requirements):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("email", "citizen.vikash@example.com");
                  setValue("password", "Password123!");
                }}
                className="text-[11px] h-8 rounded-xl font-medium justify-center text-emerald-600 hover:text-emerald-700"
              >
                1. Citizen Login
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("email", "notfound.user@example.com");
                  setValue("password", "AnyPassword123!");
                }}
                className="text-[11px] h-8 rounded-xl font-medium justify-center text-amber-600 hover:text-amber-700"
              >
                2. Unknown Email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("email", "citizen.vikash@example.com");
                  setValue("password", "WrongPassword999");
                }}
                className="text-[11px] h-8 rounded-xl font-medium justify-center text-rose-600 hover:text-rose-700"
              >
                3. Wrong Pass
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValue("email", "collector@tn.gov.in");
                  setValue("password", "GovAdminPass2026!");
                }}
                className="text-[10px] h-7 text-muted-foreground justify-center hover:text-foreground"
              >
                Test Gov Officer
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValue("email", "owner@socialx.gov.in");
                  setValue("password", "AdminPass2026!");
                }}
                className="text-[10px] h-7 text-muted-foreground justify-center hover:text-foreground"
              >
                Test Platform Admin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Stakeholder Portal Cards */}
      {activeTab === "portals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROLES_CONFIG.map((roleConfig) => (
            <RoleSelectorCard
              key={roleConfig.role}
              config={roleConfig}
              onSelectNonImplemented={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
