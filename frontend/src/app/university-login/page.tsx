"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  School,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { useUniversityStore, DEFAULT_FACULTY_USER, DEFAULT_STUDENT_USER } from "@/features/university/hooks/use-university-store";
import { universityApi } from "@/features/university/services/university-api";
import { UniversityRole } from "@/features/university/types";

function UniversityLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const { setUser, setRole } = useUniversityStore();

  const [activeRole, setActiveRole] = React.useState<UniversityRole>("faculty");
  const [email, setEmail] = React.useState("elena.rostova@stanford.edu");
  const [password, setPassword] = React.useState("Password123!");
  const [accessKey, setAccessKey] = React.useState("UNIV-GOV-2026-KEY");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  // Switch role defaults
  const handleRoleChange = (role: UniversityRole) => {
    setActiveRole(role);
    if (role === "faculty") {
      setEmail("elena.rostova@stanford.edu");
      setPassword("Password123!");
      setAccessKey("STAN-FAC-4481");
    } else {
      setEmail("alex.rivera@stanford.edu");
      setPassword("password123");
      setAccessKey("CS-2024-8902");
    }
  };

  const handleLoginSuccess = (role: UniversityRole, user: any) => {
    if (typeof document !== "undefined") {
      document.cookie = `social_x_university_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `social_x_university_token=jwt-${user.id}; path=/; max-age=604800; SameSite=Lax`;
    }
    setUser(user);
    setRole(role);
    toast.success(`Welcome to Social-X University Portal, ${user.fullName || user.name}!`);

    if (role === "faculty") {
      router.push("/university/faculty");
    } else {
      router.push("/university/student");
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter institutional email and password.");
      return;
    }

    setIsLoading(true);
    try {
      if (activeRole === "faculty") {
        const user = await universityApi.loginFaculty({ email, password, rememberMe });
        handleLoginSuccess("faculty", {
          ...DEFAULT_FACULTY_USER,
          ...user,
          employeeIdOrRollNumber: accessKey || "STAN-FAC-4481",
        });
      } else {
        const user = await universityApi.loginStudent({
          email,
          password,
          rollNumber: accessKey || "CS-2024-8902",
        });
        handleLoginSuccess("student", {
          ...DEFAULT_STUDENT_USER,
          ...user,
          rollNumber: accessKey || "CS-2024-8902",
        });
      }
    } catch {
      toast.error("Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setIsGoogleLoading(true);
    toast.info("Connecting to Google Campus SSO...");
    try {
      const user = await universityApi.loginGoogleUniversity(activeRole);
      setTimeout(() => {
        handleLoginSuccess(activeRole, {
          ...(activeRole === "faculty" ? DEFAULT_FACULTY_USER : DEFAULT_STUDENT_USER),
          ...user,
        });
      }, 700);
    } catch {
      toast.error("Google SSO verification failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFillDemo = () => {
    if (activeRole === "faculty") {
      setEmail("elena.rostova@stanford.edu");
      setPassword("Password123!");
      setAccessKey("STAN-FAC-4481");
      toast.info("Faculty demo credentials loaded.");
    } else {
      setEmail("alex.rivera@stanford.edu");
      setPassword("password123");
      setAccessKey("CS-2024-8902");
      toast.info("Student demo credentials loaded.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Top back navigation & status */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Platform Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            Module 3: Academia
          </Badge>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {errorParam && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />
          <span>
            {errorParam === "faculty_access_required"
              ? "Faculty credentials required to access Principal Investigator workspace."
              : errorParam === "student_access_required"
              ? "Student credentials required to access student research sprints."
              : "Institutional authentication required to access University Portal."}
          </span>
        </div>
      )}

      {/* Main Login Card */}
      <Card className="border-border/80 bg-card/95 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 p-6 sm:p-8 text-white space-y-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-white border border-white/20 shadow-md">
              <School className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-blue-100 font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Social-X Smart Governance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                University & Academia Portal
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
            Collaborative civic research gateway linking municipal departments with academic laboratories,
            faculty advisors, and student innovators.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Institutional Role
            </Label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
              <button
                type="button"
                onClick={() => handleRoleChange("faculty")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  activeRole === "faculty"
                    ? "bg-card text-foreground shadow-sm border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="h-4 w-4 text-blue-500" />
                <span>Faculty & Advisor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                  activeRole === "student"
                    ? "bg-card text-foreground shadow-sm border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4 text-cyan-500" />
                <span>Student Researcher</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill helper */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-foreground/80">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span className="line-clamp-1">
                Demo: {activeRole === "faculty" ? "Dr. Elena Rostova" : "Alex Rivera"} ({email})
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-primary font-bold hover:underline shrink-0 text-xs"
            >
              Fill Demo
            </button>
          </div>

          {/* Google Campus SSO Button */}
          <GoogleAuthButton
            onClick={handleGoogleSSO}
            isLoading={isGoogleLoading}
            text={`Continue with Google Campus SSO (${activeRole === "faculty" ? "Faculty" : "Student"})`}
          />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground relative">
              Or institutional credentials
            </span>
          </div>

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="univ-email" className="text-xs font-semibold">
                University Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="univ-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="pl-10 h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* University Access Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="univ-access-key" className="text-xs font-semibold">
                  University Access Key / {activeRole === "faculty" ? "Faculty ID" : "Roll Number"}
                </Label>
                <span className="text-[11px] text-muted-foreground">e.g. {activeRole === "faculty" ? "STAN-FAC-4481" : "CS-2024-8902"}</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="univ-access-key"
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="UNIV-GOV-2026-KEY"
                  className="pl-10 h-11 rounded-xl font-mono text-xs uppercase"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="univ-password" className="text-xs font-semibold">
                  Password
                </Label>
                <Link
                  href="/forgot-password/university"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="univ-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password</span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
              <Label
                htmlFor="rememberMe"
                className="text-xs font-normal text-muted-foreground cursor-pointer"
              >
                Keep institutional session active for 7 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-2"
              isLoading={isLoading}
            >
              <span>Sign In as {activeRole === "faculty" ? "Faculty Advisor" : "Student Researcher"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Info Points */}
          <div className="border-t border-border/80 pt-4 grid grid-cols-2 gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Direct Gov Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>Academic Credit Grants</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span>Verified Lab Sprints</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>Research Citations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UniversityLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <UniversityLoginInner />
      </div>
    </React.Suspense>
  );
}
