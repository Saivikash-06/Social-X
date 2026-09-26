"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  facultyLoginSchema,
  FacultyLoginFormData,
} from "@/features/university/validation/university-schemas";
import { useUniversityQueries } from "@/features/university/hooks/use-university-queries";

export default function FacultyLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { loginFacultyMutation, loginGoogleMutation } = useUniversityQueries();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FacultyLoginFormData>({
    resolver: zodResolver(facultyLoginSchema),
    defaultValues: {
      email: "a.sharma@iisc.ac.in",
      password: "Password123!",
      rememberMe: true,
    },
  });

  const onSubmit = (data: FacultyLoginFormData) => {
    loginFacultyMutation.mutate(data);
  };

  const handleGoogleSignIn = () => {
    loginGoogleMutation.mutate("faculty");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/login/university"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to University Roles</span>
        </Link>
        <Badge variant="info" className="text-[11px] px-2 py-0.5">
          Faculty Portal
        </Badge>
      </div>

      {/* Main Login Card */}
      <Card className="border-border/80 bg-card/90 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden">
        {/* Card Header Accent */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 p-6 sm:p-7 text-white space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Faculty Sign In</h2>
              <p className="text-xs text-blue-100">
                Principal Investigators & University Research Directors
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-7 space-y-6">
          {/* Google Sign In */}
          <GoogleAuthButton
            onClick={handleGoogleSignIn}
            isLoading={loginGoogleMutation.isPending}
            text="Continue with Institutional Google"
          />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-3 text-xs font-semibold uppercase text-muted-foreground relative">
              Or sign in with University ID
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                University Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="professor@university.ac.in"
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
                  href="/forgot-password/university"
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
                  <span className="sr-only">Toggle password visibility</span>
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
                {...register("rememberMe")}
              />
              <Label
                htmlFor="rememberMe"
                className="text-xs font-normal text-muted-foreground cursor-pointer"
              >
                Remember institutional session
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-2"
              isLoading={loginFacultyMutation.isPending}
            >
              <span>Sign In to Faculty Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Switch to Student */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            Are you a student researcher?{" "}
            <Link
              href="/login/university/student"
              className="font-bold text-primary hover:underline ml-1"
            >
              Student Sign In
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials Quick-Fill helper */}
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Faculty demo credentials pre-filled</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setValue("email", "a.sharma@iisc.ac.in");
            setValue("password", "Password123!");
          }}
          className="text-primary font-bold hover:underline shrink-0"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
}
