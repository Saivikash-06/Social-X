import * as z from "zod";

export const facultyLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type FacultyLoginFormData = z.infer<typeof facultyLoginSchema>;
export type FacultyLoginValues = FacultyLoginFormData;

export const studentLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid student university email"),
  rollNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type StudentLoginFormData = z.infer<typeof studentLoginSchema>;
export type StudentLoginValues = StudentLoginFormData;

export const assignStudentsSchema = z.object({
  studentId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
  roleInProject: z.string().optional(),
  role: z.string().optional(),
});

export type AssignStudentsFormData = z.infer<typeof assignStudentsSchema>;
export type AssignStudentsValues = AssignStudentsFormData;

export const milestoneReviewSchema = z.object({
  status: z.enum(["approved", "needs_revision"]).optional(),
  feedback: z.string().min(2, "Please provide actionable feedback"),
});

export type MilestoneReviewFormData = z.infer<typeof milestoneReviewSchema>;

export const researchUploadSchema = z.object({
  projectId: z.string().min(1, "Please select target project"),
  milestoneId: z.string().optional(),
  artifactType: z.string().optional(),
  category: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type ResearchUploadFormData = z.infer<typeof researchUploadSchema>;
export type ResearchUploadValues = ResearchUploadFormData;
