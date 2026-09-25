import { z } from "zod";

export const officialLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Official Email is required")
    .email("Enter a valid official government email address (e.g. collector@tn.gov.in)"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  officialPassKey: z
    .string()
    .min(1, "Official Pass Key is required")
    .regex(
      /^[A-Z]{2}-[A-Z0-9]{3,4}-[0-9]{4,5}-[A-Z0-9]{4}$/,
      "Invalid pass key format. Expected pattern: STATE-DEPT-RANDOM-CODE (e.g. TN-CHE-82374-AX91)"
    ),
  rememberMe: z.boolean(),
});

export type OfficialLoginFormData = {
  email: string;
  password: string;
  officialPassKey: string;
  rememberMe: boolean;
};

export const officerCreationSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  email: z.string().email("Valid government email required"),
  password: z.string().min(8, "Temporary password must be at least 8 characters"),
  department: z.string().min(1, "Department is required"),
  district: z.string().min(1, "District is required"),
  designation: z.string().min(1, "Designation is required"),
  role: z.string().min(1, "Role is required"),
  officialPassKey: z.string().min(1, "Pass key is required"),
  status: z.enum(["active", "suspended", "inactive"]),
  phone: z.string().optional(),
});

export type OfficerCreationFormData = {
  name: string;
  email: string;
  password: string;
  department: string;
  district: string;
  designation: string;
  role: string;
  officialPassKey: string;
  status: "active" | "suspended" | "inactive";
  phone?: string;
};

export const departmentCreationSchema = z.object({
  code: z.string().min(2, "Department code is required"),
  name: z.string().min(3, "Department name is required"),
  headOfficerName: z.string().min(2, "Head officer name is required"),
  headOfficerEmail: z.string().email("Valid email required"),
  districtsCovered: z.number().min(1, "Must cover at least 1 district"),
  budgetAllocatedCr: z.number().min(0, "Budget cannot be negative"),
  status: z.enum(["active", "under_review"]),
});

export type DepartmentCreationFormData = {
  code: string;
  name: string;
  headOfficerName: string;
  headOfficerEmail: string;
  districtsCovered: number;
  budgetAllocatedCr: number;
  status: "active" | "under_review";
};

export const resolveCaseSchema = z.object({
  caseId: z.string().min(1),
  resolutionNotes: z.string().min(10, "Resolution note must be at least 10 characters"),
  completionEvidenceUrl: z.string().optional(),
  laborHoursSpent: z.number().min(0.5, "Hours must be at least 0.5"),
});

export type ResolveCaseFormData = {
  caseId: string;
  resolutionNotes: string;
  completionEvidenceUrl?: string;
  laborHoursSpent: number;
};

export const reassignOfficerSchema = z.object({
  caseId: z.string().min(1),
  newOfficerId: z.string().min(1, "Select an officer"),
  reason: z.string().min(5, "Reason for re-assignment required"),
});

export type ReassignOfficerFormData = {
  caseId: string;
  newOfficerId: string;
  reason: string;
};

export const transferDepartmentSchema = z.object({
  caseId: z.string().min(1),
  newDepartment: z.string().min(1, "Select destination department"),
  justification: z.string().min(10, "Justification required for inter-department transfer"),
});

export type TransferDepartmentFormData = {
  caseId: string;
  newDepartment: string;
  justification: string;
};
