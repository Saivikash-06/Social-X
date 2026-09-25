import { z } from "zod";

export const researchLoginSchema = z.object({
  email: z.string().email("Please enter a valid academic/institutional email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type ResearchLoginFormData = z.infer<typeof researchLoginSchema>;

export const uploadPublicationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum([
    "Research Paper",
    "Conference Paper",
    "White Paper",
    "Technical Report",
    "Patent",
  ]),
  authors: z.string().min(3, "Enter comma separated authors"),
  journalOrVenue: z.string().min(2, "Journal, conference, or patent authority name"),
  year: z.number().min(2000).max(2030),
  doi: z.string().optional(),
  patentNumber: z.string().optional(),
  abstract: z.string().min(20, "Abstract must be at least 20 characters"),
  tags: z.string().min(2, "Enter tags separated by commas"),
});

export type UploadPublicationFormData = z.infer<typeof uploadPublicationSchema>;

export const submitInnovationIdeaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(2, "Select or enter category"),
  trlLevel: z.number().min(1).max(9),
  fundingRequired: z.string().min(2, "Specify funding required e.g. ₹25 Lakhs"),
  mentor: z.string().min(2, "Specify faculty mentor or domain expert"),
  mentorAffiliation: z.string().min(2, "Specify mentor organization"),
  description: z.string().min(20, "Detailed description (min 20 characters)"),
});

export type SubmitInnovationIdeaFormData = z.infer<typeof submitInnovationIdeaSchema>;

export const submitFindingsSchema = z.object({
  projectId: z.string().min(1),
  findingTitle: z.string().min(5, "Title required"),
  summary: z.string().min(20, "Summary required"),
  methodologyNotes: z.string().min(10, "Methodology notes required"),
  recommendationToGovt: z.string().min(10, "Recommendations required"),
});

export type SubmitFindingsFormData = z.infer<typeof submitFindingsSchema>;

export const researchProfileSchema = z.object({
  name: z.string().min(3, "Institute name required"),
  accreditation: z.string().min(2, "Accreditation status required"),
  directorName: z.string().min(2, "Director name required"),
  establishedYear: z.number().min(1800).max(2026),
  about: z.string().min(20, "Description required"),
  address: z.string().min(5, "Address required"),
  district: z.string().min(2, "District required"),
  state: z.string().min(2, "State required"),
  website: z.string().url("Enter valid URL"),
  contactEmail: z.string().email("Enter valid email"),
  contactPhone: z.string().min(10, "Enter valid phone number"),
});

export type ResearchProfileFormData = z.infer<typeof researchProfileSchema>;

export const researchSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  emailNotifications: z.boolean().default(true),
  grantAlerts: z.boolean().default(true),
  orcidSync: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(true),
  preferredLanguage: z.string().default("English"),
});

export type ResearchSettingsFormData = z.infer<typeof researchSettingsSchema>;
