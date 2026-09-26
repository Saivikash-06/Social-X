import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Please provide a valid administrative root email"),
  password: z.string().min(8, "Administrative password must be at least 8 characters"),
  hardwareTokenKey: z.string().optional(),
  rememberMe: z.boolean(),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export const userFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 chars)"),
  email: z.string().email("Valid email address required"),
  phone: z.string().min(10, "Valid 10-digit phone number required"),
  role: z.enum([
    "citizen",
    "government",
    "university",
    "industry",
    "ngo",
    "research",
    "super_admin",
  ]),
  roleLabel: z.string().min(2, "Official designation/title is required"),
  organization: z.string().optional(),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  status: z.enum(["active", "suspended", "pending_verification"]),
  verified: z.boolean(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm the password"),
  requirePasswordChangeOnLogin: z.boolean().default(true),
  sendNotificationEmail: z.boolean().default(true),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const departmentFormSchema = z.object({
  name: z.string().min(3, "Department name is required"),
  code: z.string().min(2, "Short alphanumeric code required (e.g. PWD, JAL)"),
  headOfficerName: z.string().min(3, "Head officer name is required"),
  headOfficerEmail: z.string().email("Official email required"),
  headOfficerPhone: z.string().min(10, "Valid phone number required"),
  districtsCovered: z.number().min(1, "At least 1 district covered"),
  budgetAllocatedCr: z.number().min(0, "Budget allocation in Crores required"),
  status: z.enum(["active", "under_review"]),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;

export const reassignIssueSchema = z.object({
  departmentId: z.string().min(1, "Please select target department"),
  stakeholderType: z.enum(["none", "university", "industry", "ngo"]).default("none"),
  stakeholderName: z.string().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  escalateSla: z.boolean().default(false),
  officialRemarks: z.string().min(5, "Official remarks required for audit trail"),
});

export type ReassignIssueFormData = z.infer<typeof reassignIssueSchema>;

export const systemSettingsSchema = z.object({
  platformName: z.string().min(2, "Platform name is required"),
  platformSubtitle: z.string().min(5, "Subtitle is required"),
  themeDefault: z.enum(["system", "dark", "light"]),
  maintenanceMode: z.boolean(),
  maintenanceBroadcastMessage: z.string().optional(),
  sessionTimeoutMinutes: z.number().min(5).max(720),
  enforce2FAForAdmins: z.boolean(),
  rateLimitRequestsPerMin: z.number().min(10).max(10000),
  maxUploadSizeMb: z.number().min(5).max(500),
});

export type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;
