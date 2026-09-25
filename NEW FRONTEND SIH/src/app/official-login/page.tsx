"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Landmark,
  Sparkles,
  Server,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  officialLoginSchema,
  OfficialLoginFormData,
} from "@/features/government/validation/government-schemas";
import { useGovernmentStore } from "@/features/government/hooks/use-government-store";
import { governmentApi, INITIAL_OFFICERS } from "@/features/government/services/government-api";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { useTranslation } from "@/features/shared/i18n";

const DEMO_OFFICER_PRESETS = [
  {
    name: "Thiru S. Sivakumar, IAS",
    designation: "District Collector & District Magistrate",
    department: "Municipal Administration & Water Supply",
    email: "collector@tn.gov.in",
    passKey: "TN-CHE-00491-KD82",
    badge: "Apex Collector",
  },
  {
    name: "Dr. J. Radhakrishnan, IAS",
    designation: "Commissioner, Greater Chennai Corporation",
    department: "Chennai Municipal Corporation",
    email: "commissioner@chennaicorporation.gov.in",
    passKey: "TN-CHN-11482-QW90",
    badge: "Commissioner",
  },
  {
    name: "Er. K. Ramanathan, M.E.",
    designation: "Superintending Engineer (Buildings & Infra)",
    department: "Public Works Department (PWD)",
    email: "ee.pwd.madurai@tn.gov.in",
    passKey: "TN-MDU-88432-ZP11",
    badge: "SE PWD",
  },
  {
    name: "Er. S. Anbarasan",
    designation: "Executive Engineer (Highways)",
    department: "Highways & Minor Ports (Roads)",
    email: "ee.roads@tn.gov.in",
    passKey: "TN-GOV-20483-KA91",
    badge: "EE Roads",
  },
];

function OfficialLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const { login } = useGovernmentStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OfficialLoginFormData>({
    resolver: zodResolver(officialLoginSchema),
    defaultValues: {
      email: "collector@tn.gov.in",
      password: "GovAdminPass2026!",
      officialPassKey: "TN-CHE-00491-KD82",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: OfficialLoginFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      const res = await governmentApi.login(
        data.email,
        data.password,
        data.officialPassKey
      );

      login(res.officer, res.token);
      toast.success(`${t("auth.welcome", "Welcome")}, ${res.officer.name}. ${t("auth.enteringGovPortal", "Entering Government Portal...")}`);
      router.push("/government/dashboard");
    } catch (err: any) {
      const msg = err?.message || t("auth.invalidCredentials", "Invalid Credentials");
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      // In browser demo, prompt or pick first approved officer's email
      const chosenEmail = "collector@tn.gov.in";
      const res = await governmentApi.loginWithGoogle(chosenEmail);

      login(res.officer, res.token);
      toast.success(`${t("auth.authenticatedVia", "Authenticated via NIC GovPass")}: ${res.officer.name}`);
      router.push("/government/dashboard");
    } catch (err: any) {
      const msg = err?.message || t("auth.accessDenied", "Access Denied");
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (preset: (typeof DEMO_OFFICER_PRESETS)[0]) => {
    setValue("email", preset.email);
    setValue("password", "GovAdminPass2026!");
    setValue("officialPassKey", preset.passKey);
    setAuthError(null);
    toast.info(`${t("auth.filledCredentialsFor", "Filled credentials for")} ${preset.name}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Top Breadcrumb & Badge & Language */}
      <div className="flex items-center justify-between gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" />
            <span>{t("nav.role_login", "Select Stakeholder Role")}</span>
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-mono font-bold text-xs rounded-full border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t("auth.nicGateway", "NIC Secure Gateway • Gov-Level 4")}</span>
          </Badge>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Enterprise Card */}
      <Card className="border-border/80 bg-card shadow-2xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        {/* State Emblem Band */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Landmark className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-indigo-200">
                {t("auth.stateGovHeading", "Government of Tamil Nadu")}
              </p>
              <p className="text-xs font-bold text-white">
                {t("auth.deptHeading", "Municipal Administration & Civic Telemetry")}
              </p>
            </div>
          </div>
          <Badge className="bg-indigo-600/80 hover:bg-indigo-600 text-[10px] uppercase font-mono tracking-wider">
            {t("auth.officialOnly", "Official Only")}
          </Badge>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2 justify-center sm:justify-start">
              <span>{t("auth.officialLoginTitle", "Official Login")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {t("auth.govOfficerPortal", "Government Officer Secure Portal")}
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2.5 font-medium animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Official Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{t("auth.officialEmail", "Official Email")}</span>
              </Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="collector@tn.gov.in"
                className="rounded-xl border-border/80 focus-visible:ring-indigo-500 font-mono text-sm"
              />
              {errors.email && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{t("common.labels.password", "Password")}</span>
              </Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="rounded-xl border-border/80 pr-10 focus-visible:ring-indigo-500 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("auth.hidePassword", "Hide password") : t("auth.showPassword", "Show password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Official Pass Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t("auth.passKey", "Official Pass Key")}</span>
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {t("auth.passKeyFormat", "Format: STATE-DEPT-RANDOM-CODE")}
                </span>
              </div>
              <Input
                {...register("officialPassKey")}
                type="text"
                placeholder="TN-CHE-00491-KD82"
                className="rounded-xl border-border/80 focus-visible:ring-indigo-500 font-mono uppercase tracking-wider text-sm bg-indigo-500/[0.03]"
              />
              <p className="text-[10px] text-muted-foreground">
                {t("auth.passKeyNotice", "This is a unique government access key issued by the State Administrator, NOT an OTP.")}
              </p>
              {errors.officialPassKey && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.officialPassKey.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm h-11 gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t("auth.verifyingCredentials", "Verifying Credentials & Pass Key...")}</span>
                </>
              ) : (
                <>
                  <span>{t("auth.enterGovPortal", "Enter Government Portal")}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Google SSO Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground relative">
              {t("auth.authorizedSso", "Authorized SSO")}
            </span>
          </div>

          {/* Continue with Google */}
          <div className="space-y-2">
            <GoogleAuthButton
              onClick={handleGoogleSignIn}
              isLoading={isSubmitting}
              text={t("auth.continueWithGoogle", "Continue with Google")}
            />
            <p className="text-[10px] text-center text-muted-foreground">
              {t("auth.officersOnlyNotice", "Only officers whose email exists in the official database may continue.")}
            </p>
          </div>

          {/* 1-Click Evaluator Demo Profiles */}
          <div className="pt-4 border-t border-border/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>{t("auth.oneClickDemoProfiles", "1-Click Test Officer Profiles")}</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {t("auth.preProvisionedCreds", "Pre-provisioned Credentials")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_OFFICER_PRESETS.map((preset) => (
                <button
                  key={preset.email}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-border/80 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                      {preset.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {preset.badge}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {preset.designation}
                  </p>
                  <p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400">
                    {t("auth.key", "Key")}: {preset.passKey}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OfficialLoginPage() {
  return (
    <React.Suspense fallback={null}>
      <OfficialLoginForm />
    </React.Suspense>
  );
}
