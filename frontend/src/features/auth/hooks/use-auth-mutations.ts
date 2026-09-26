"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "../services/auth-api";
import { useAuthStore } from "./use-auth-store";
import {
  LoginFormData,
  RegisterCitizenFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "../validation/auth-schemas";

export function useAuthMutations() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Login Mutation with role-based dashboard redirection
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.loginCitizen(data),
    onSuccess: (res) => {
      setAuth(res.user, res.tokens);
      const destination = res.redirectUrl || "/citizen";
      toast.success("Welcome Back!", {
        description: `Logged in as ${res.user.fullName || (res.user as any).name}. Redirecting...`,
      });
      router.push(destination);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Authentication Failed", {
        description: err.message,
      });
    },
  });

  // Google Login Mutation (Phase 4)
  const googleLoginMutation = useMutation({
    mutationFn: (googleEmail: string) => authApi.loginWithGoogle(googleEmail),
    onSuccess: (res) => {
      setAuth(res.user, res.tokens);
      const destination = res.redirectUrl || "/citizen";
      toast.success("Google Sign-In Successful", {
        description: `Welcome ${res.user.fullName || (res.user as any).name}! Redirecting to dashboard...`,
      });
      router.push(destination);
    },
    onError: (err: Error) => {
      toast.error("Google Sign-In Blocked", {
        description: err.message,
      });
    },
  });

  // Citizen Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterCitizenFormData) =>
      authApi.registerCitizen(data),
    onSuccess: (res) => {
      toast.success("Registration Initiated", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Registration Error", {
        description: err.message,
      });
    },
  });

  // OTP Verification Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyOtp(email, otp),
    onSuccess: (res) => {
      setAuth(res.user, res.tokens);
      toast.success("Account Verified!", {
        description: "Your citizen account is now active. Entering Dashboard...",
      });
      router.push("/citizen");
    },
    onError: (err: Error) => {
      toast.error("Verification Failed", {
        description: err.message || "Invalid or expired OTP.",
      });
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      authApi.requestPasswordReset(data),
    onSuccess: (res) => {
      toast.success("Reset Code Sent", {
        description: res.message,
      });
    },
    onError: (err: Error) => {
      toast.error("Request Failed", {
        description: err.message,
      });
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData & { email: string }) =>
      authApi.resetPassword(data),
    onSuccess: (res) => {
      toast.success("Password Updated", {
        description: res.message,
      });
      router.push("/login/citizen");
    },
    onError: (err: Error) => {
      toast.error("Reset Failed", {
        description: err.message,
      });
    },
  });

  return {
    loginMutation,
    googleLoginMutation,
    registerMutation,
    verifyOtpMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
}
