import { z } from "zod";

export const ngoLoginSchema = z.object({
  email: z.string().email("Please enter a valid official NGO email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type NgoLoginFormData = z.infer<typeof ngoLoginSchema>;

export const fieldActivitySchema = z.object({
  projectId: z.string().min(1, "Please select an assigned project"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location name is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  volunteerCount: z.number().min(1, "At least 1 volunteer must be present"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  activityNotes: z.string().optional(),
});

export type FieldActivityFormData = z.infer<typeof fieldActivitySchema>;

export const applyProjectSchema = z.object({
  projectId: z.string().min(1),
  proposalSummary: z.string().min(20, "Please provide a detailed proposal summary (min 20 characters)"),
  proposedTimelineMonths: z.number().min(1).max(36),
  volunteersToDeploy: z.number().min(1, "At least 1 volunteer required"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
});

export type ApplyProjectFormData = z.infer<typeof applyProjectSchema>;

export const assignVolunteerSchema = z.object({
  volunteerId: z.string().min(1, "Select a volunteer"),
  projectId: z.string().min(1, "Select a project"),
  role: z.string().min(2, "Specify volunteer role"),
  expectedHoursPerWeek: z.number().min(1).max(80),
});

export type AssignVolunteerFormData = z.infer<typeof assignVolunteerSchema>;

export const generateReportSchema = z.object({
  type: z.enum([
    "Monthly Activities",
    "Completed Projects",
    "Volunteer Contributions",
    "Financial Utilization",
    "Community Reach",
  ]),
  period: z.string().min(1, "Select period"),
  fileFormat: z.enum(["PDF", "Excel"]),
  includeEvidencePhotos: z.boolean().default(true),
});

export type GenerateReportFormData = z.infer<typeof generateReportSchema>;

export const ngoProfileSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  darpanId: z.string().min(3, "Darpan ID is required"),
  mission: z.string().min(10, "Mission statement is required"),
  about: z.string().min(20, "Detailed description is required"),
  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  website: z.string().url("Enter a valid URL"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().min(10, "Enter a valid phone number"),
});

export type NgoProfileFormData = z.infer<typeof ngoProfileSchema>;

export const ngoSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsAlerts: z.boolean().default(false),
  publicProfileVisibility: z.boolean().default(true),
  preferredLanguage: z.string().default("English"),
  twoFactorAuth: z.boolean().default(false),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

export type NgoSettingsFormData = z.infer<typeof ngoSettingsSchema>;
