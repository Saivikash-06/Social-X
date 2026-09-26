"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { GoogleSignInModal } from "@/features/auth/components/google-sign-in-modal";
import { OtpVerificationModal } from "@/features/auth/components/otp-verification-modal";
import {
  registerCitizenSchema,
  RegisterCitizenFormData,
} from "@/features/auth/validation/auth-schemas";
import { useAuthMutations } from "@/features/auth/hooks/use-auth-mutations";

const STATES_AND_DISTRICTS: Record<string, string[]> = {
  Karnataka: ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", "Hubballi"],
  Maharashtra: ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane"],
  Delhi: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi"],
  Tamil_Nadu: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Telangana: ["Hyderabad", "Ranga Reddy", "Medchal", "Warangal", "Nizamabad"],
};

export default function RegisterCitizenPage() {
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");
  const { registerMutation, verifyOtpMutation, googleLoginMutation } =
    useAuthMutations();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterCitizenFormData>({
    resolver: zodResolver(registerCitizenSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      state: "Karnataka",
      district: "Bengaluru Urban",
      termsAccepted: false,
    },
  });

  const selectedState = watch("state") || "Karnataka";
  const districts = STATES_AND_DISTRICTS[selectedState] || [
    "Central District",
    "North District",
    "South District",
  ];

  const onSubmit = (data: RegisterCitizenFormData) => {
    setRegisteredEmail(data.email);
    registerMutation.mutate(data, {
      onSuccess: () => {
        setShowOtpModal(true);
      },
    });
  };

  const handleVerifyOtp = (otp: string) => {
    verifyOtpMutation.mutate(
      { email: registeredEmail, otp },
      {
        onSuccess: () => {
          setShowOtpModal(false);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 py-4">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/login/citizen"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Login</span>
        </Link>
        <Badge variant="info" className="text-[11px] px-2 py-0.5">
          New Citizen Account
        </Badge>
      </div>

      {/* Main Registration Card */}
      <Card className="border-border/80 bg-card/90 shadow-2xl rounded-3xl backdrop-blur-xl overflow-hidden">
        {/* Card Header Accent */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 text-white space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Create Your Citizen Account
          </h2>
          <p className="text-xs text-blue-100">
            Join thousands of active citizens solving neighborhood issues with AI.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Google Sign In Account Selector Modal */}
          <GoogleSignInModal
            isOpen={showGoogleModal}
            onClose={() => setShowGoogleModal(false)}
            onSelectGoogleEmail={(email) => googleLoginMutation.mutate(email)}
            isLoading={googleLoginMutation.isPending}
            errorMessage={googleLoginMutation.error?.message || null}
          />

          {/* Google Quick Sign-Up */}
          <GoogleAuthButton
            onClick={() => setShowGoogleModal(true)}
            isLoading={googleLoginMutation.isPending}
            text="Continue with Google"
          />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-3 text-xs font-semibold uppercase text-muted-foreground relative">
              Or register with details
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="e.g. Aditi Sharma"
                    className="pl-10 h-11 rounded-xl"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="aditi@example.com"
                    className="pl-10 h-11 rounded-xl"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Mobile Number (+91)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="9876543210"
                  className="pl-10 h-11 rounded-xl"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-xs font-semibold">
                  State / Union Territory
                </Label>
                <select
                  id="state"
                  {...register("state")}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi NCT</option>
                  <option value="Tamil_Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                </select>
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-xs font-semibold">
                  District
                </Label>
                <select
                  id="district"
                  {...register("district")}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-destructive">{errors.district.message}</p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 chars, 1 capital, 1 num"
                    className="pl-10 h-11 rounded-xl"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    className="pl-10 h-11 rounded-xl"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start gap-2 pt-2">
              <input
                id="termsAccepted"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
                {...register("termsAccepted")}
              />
              <Label
                htmlFor="termsAccepted"
                className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary underline">
                  Privacy Policy
                </Link>
                . I affirm that all grievances submitted will be authentic.
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              className="w-full rounded-xl gap-2 font-bold shadow-md shadow-blue-500/20 mt-4"
              isLoading={registerMutation.isPending}
            >
              <span>Continue to Verification</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Already have account */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            Already have a citizen account?{" "}
            <Link
              href="/login/citizen"
              className="font-bold text-primary hover:underline ml-1"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        email={registeredEmail}
        onVerify={handleVerifyOtp}
        isLoading={verifyOtpMutation.isPending}
      />
    </div>
  );
}
