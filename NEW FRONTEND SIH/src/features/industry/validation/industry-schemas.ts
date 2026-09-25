import { z } from "zod";

export const industryLoginSchema = z.object({
  email: z.string().email("Please enter a valid corporate/organizational email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["csr_org", "corporate", "msme", "startup", "innovation_partner"]),
  rememberMe: z.boolean().optional(),
});

export type IndustryLoginFormData = z.infer<typeof industryLoginSchema>;

export const organizationProfileSchema = z.object({
  name: z.string().min(3, "Organization name is required"),
  legalEntityName: z.string().min(3, "Legal entity name is required"),
  sector: z.string().min(2, "Sector is required"),
  cinOrRegNumber: z.string().min(5, "CIN or Registration Number is required"),
  website: z.string().url("Enter a valid URL (e.g. https://example.com)"),
  email: z.string().email("Enter a valid corporate email"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressStreet: z.string().min(3, "Street address is required"),
  addressCity: z.string().min(2, "City is required"),
  addressState: z.string().min(2, "State is required"),
  addressPincode: z.string().min(6, "Pincode is required"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactPersonDesignation: z.string().min(2, "Designation is required"),
  contactPersonEmail: z.string().email("Valid email is required"),
  contactPersonPhone: z.string().min(10, "Phone number is required"),
  availableBudget: z.number().min(0, "Budget cannot be negative"),
});

export type OrganizationProfileFormData = z.infer<typeof organizationProfileSchema>;

export const sponsorProjectSchema = z.object({
  projectId: z.string(),
  amount: z.coerce.number().min(10000, "Minimum sponsorship amount is ₹10,000"),
  csrGrantCategory: z.string().min(1, "Please select CSR category"),
  paymentTerms: z.enum(["milestone_escrow", "direct_tranche", "upfront_lump_sum"]),
  notes: z.string().optional(),
});

export type SponsorProjectFormData = z.infer<typeof sponsorProjectSchema>;

export const releaseFundsSchema = z.object({
  opportunityId: z.string().min(1, "Opportunity reference is required"),
  projectId: z.string().min(1, "Project reference is required"),
  amount: z.coerce.number().min(5000, "Amount must be at least ₹5,000"),
  milestoneTitle: z.string().min(3, "Milestone title is required"),
  paymentMode: z.enum(["NEFT / RTGS", "Escrow Milestone Release", "Direct Treasury Transfer"]),
  remarks: z.string().optional(),
});

export type ReleaseFundsFormData = z.infer<typeof releaseFundsSchema>;

export const scheduleMeetingSchema = z.object({
  engagementId: z.string().min(1, "Engagement is required"),
  title: z.string().min(3, "Meeting title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  agenda: z.string().min(10, "Please provide an agenda of at least 10 characters"),
  meetingPlatform: z.enum(["Google Meet", "Microsoft Teams", "Zoom", "On-site Lab Visit"]),
});

export type ScheduleMeetingFormData = z.infer<typeof scheduleMeetingSchema>;

export const assignTaskSchema = z.object({
  engagementId: z.string().min(1, "Engagement ID is required"),
  title: z.string().min(3, "Task title is required"),
  description: z.string().min(10, "Task description is required"),
  assignedTo: z.string().min(1, "Please specify assignee"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["critical", "medium", "routine"]),
});

export type AssignTaskFormData = z.infer<typeof assignTaskSchema>;

export const rateTeamSchema = z.object({
  engagementId: z.string().min(1, "Engagement ID is required"),
  rating: z.number().min(1).max(5),
  technicalCompetenceScore: z.number().min(1).max(5),
  timelineAdherenceScore: z.number().min(1).max(5),
  feedbackSummary: z.string().min(10, "Feedback summary must be at least 10 characters"),
});

export type RateTeamFormData = z.infer<typeof rateTeamSchema>;

export const prototypeReviewSchema = z.object({
  prototypeId: z.string().min(1, "Prototype ID is required"),
  decision: z.enum(["approved", "rejected", "improvements_required"]),
  technicalViabilityScore: z.number().min(1).max(100),
  fieldReadinessScore: z.number().min(1).max(100),
  suggestedImprovements: z.string().min(5, "Please specify suggestions"),
  schedulePilotOption: z.boolean().default(false),
  pilotLocationSuggested: z.string().optional(),
});

export type PrototypeReviewFormData = z.infer<typeof prototypeReviewSchema>;

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation is required"),
  message: z.string().min(1, "Message cannot be empty"),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
