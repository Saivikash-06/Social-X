import { Role } from "@/features/shared/types/common";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  district?: string;
  state?: string;
  address?: string;
  preferredLanguage?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  redirectUrl?: string;
}

export interface RegisterCitizenRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  district: string;
  state: string;
  termsAccepted: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
