import crypto from "crypto";

export interface SocialXUser {
  id: string;
  email: string;
  name: string;
  role:
    | "citizen"
    | "government"
    | "faculty"
    | "student"
    | "university"
    | "industry"
    | "ngo"
    | "research"
    | "admin";
  salt: string;
  hashedPassword: string;
  phoneNumber?: string;
  department?: string;
  university?: string;
  organization?: string;
  district?: string;
  state?: string;
  isActive: boolean;
  createdAt: string;
}

// Password hashing using Node.js crypto.scrypt
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

// Role to Dashboard mapping
export function getDashboardForRole(role: string): string {
  const normalized = role.toLowerCase().trim();
  switch (normalized) {
    case "citizen":
      return "/citizen";
    case "government":
    case "officer":
      return "/government/dashboard";
    case "faculty":
      return "/university/faculty/dashboard";
    case "student":
      return "/university/student/dashboard";
    case "university":
      return "/university";
    case "industry":
      return "/industry/dashboard";
    case "ngo":
      return "/ngo/dashboard";
    case "research":
      return "/research/dashboard";
    case "admin":
    case "superadmin":
    case "super_admin":
      return "/admin/dashboard";
    default:
      return "/citizen";
  }
}

// Global in-memory Social-X Database store
// Initialized with baseline registered accounts for all platform stakeholder roles
const DEFAULT_ACCOUNTS = [
  {
    id: "usr-cit-01",
    email: "citizen.vikash@example.com",
    name: "Vikash (Citizen)",
    role: "citizen" as const,
    password: "Password123!",
    district: "Bengaluru Urban",
    state: "Karnataka",
  },
  {
    id: "usr-cit-02",
    email: "citizen@test.socialx.org",
    name: "Citizen User",
    role: "citizen" as const,
    password: "Password123!",
    district: "Chennai",
    state: "Tamil Nadu",
  },
  {
    id: "usr-gov-01",
    email: "collector@tn.gov.in",
    name: "Thiru S. Sivakumar, IAS",
    role: "government" as const,
    password: "GovAdminPass2026!",
    department: "Municipal Administration & Water Supply",
  },
  {
    id: "usr-gov-02",
    email: "government@test.socialx.org",
    name: "Government Officer",
    role: "government" as const,
    password: "GovAdminPass2026!",
    department: "Public Works Department (PWD)",
  },
  {
    id: "usr-fac-01",
    email: "faculty.kumar@annauniv.edu",
    name: "Dr. R. Kumar",
    role: "faculty" as const,
    password: "FacultyPass2026!",
    university: "Anna University",
    department: "Civil & Environmental Engineering",
  },
  {
    id: "usr-fac-02",
    email: "faculty@test.socialx.org",
    name: "Faculty Member",
    role: "faculty" as const,
    password: "FacultyPass2026!",
    university: "State Technical University",
  },
  {
    id: "usr-stu-01",
    email: "student.aarav@annauniv.edu",
    name: "Aarav Sharma",
    role: "student" as const,
    password: "StudentPass2026!",
    university: "Anna University",
    department: "Computer Science & Smart Infra",
  },
  {
    id: "usr-stu-02",
    email: "student@test.socialx.org",
    name: "Student Scholar",
    role: "student" as const,
    password: "StudentPass2026!",
    university: "State Technical University",
  },
  {
    id: "usr-ind-01",
    email: "csr.lead@tatatrusts.org",
    name: "Tata CSR Partner",
    role: "industry" as const,
    password: "IndustryPass2026!",
    organization: "Tata Trusts CSR Division",
  },
  {
    id: "usr-ind-02",
    email: "industry@test.socialx.org",
    name: "Industry Partner",
    role: "industry" as const,
    password: "IndustryPass2026!",
    organization: "CSR Foundation India",
  },
  {
    id: "usr-ngo-01",
    email: "director@ruralwater.ngo",
    name: "Rural Water NGO Lead",
    role: "ngo" as const,
    password: "NgoPass2026!",
    organization: "Water Sanitation NGO Foundation",
  },
  {
    id: "usr-ngo-02",
    email: "ngo@test.socialx.org",
    name: "NGO Leader",
    role: "ngo" as const,
    password: "NgoPass2026!",
    organization: "Community Action Trust",
  },
  {
    id: "usr-res-01",
    email: "lead@csir-neeri.res.in",
    name: "CSIR Lead Scientist",
    role: "research" as const,
    password: "ResearchPass2026!",
    organization: "CSIR-NEERI Environmental Research",
  },
  {
    id: "usr-res-02",
    email: "research@test.socialx.org",
    name: "Research Scientist",
    role: "research" as const,
    password: "ResearchPass2026!",
    organization: "National Innovation Council",
  },
  {
    id: "usr-adm-01",
    email: "owner@socialx.gov.in",
    name: "Dr. Vikramaditya Sen",
    role: "admin" as const,
    password: "AdminPass2026!",
    department: "Central Platform Administration",
  },
  {
    id: "usr-adm-02",
    email: "admin@test.socialx.org",
    name: "Platform Admin",
    role: "admin" as const,
    password: "AdminPass2026!",
  },
];

// Attach to globalThis to retain across hot reload in development
declare global {
  // eslint-disable-next-line no-var
  var __social_x_users_db: Map<string, SocialXUser> | undefined;
}

if (!globalThis.__social_x_users_db) {
  const map = new Map<string, SocialXUser>();
  for (const acc of DEFAULT_ACCOUNTS) {
    const { hash, salt } = hashPassword(acc.password);
    map.set(acc.email.toLowerCase(), {
      id: acc.id,
      email: acc.email.toLowerCase(),
      name: acc.name,
      role: acc.role,
      salt,
      hashedPassword: hash,
      department: acc.department,
      university: acc.university,
      organization: acc.organization,
      district: acc.district,
      state: acc.state,
      isActive: true,
      createdAt: "2026-09-01T00:00:00.000Z",
    });
  }
  globalThis.__social_x_users_db = map;
}

const usersDb = globalThis.__social_x_users_db;

export const socialXDatabase = {
  findUserByEmail(email: string): SocialXUser | null {
    if (!email) return null;
    const clean = email.toLowerCase().trim();
    return usersDb.get(clean) || null;
  },

  createUser(userData: {
    email: string;
    password?: string;
    name: string;
    role?: SocialXUser["role"];
    phoneNumber?: string;
    department?: string;
    university?: string;
    organization?: string;
    district?: string;
    state?: string;
  }): SocialXUser {
    const clean = userData.email.toLowerCase().trim();
    if (usersDb.has(clean)) {
      throw new Error("An account with this email address already exists.");
    }
    const { hash, salt } = hashPassword(userData.password || "SocialXDefault2026!");
    const newUser: SocialXUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: clean,
      name: userData.name.trim(),
      role: userData.role || "citizen",
      salt,
      hashedPassword: hash,
      phoneNumber: userData.phoneNumber,
      department: userData.department,
      university: userData.university,
      organization: userData.organization,
      district: userData.district,
      state: userData.state,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    usersDb.set(clean, newUser);
    return newUser;
  },

  getAllUsers(): SocialXUser[] {
    return Array.from(usersDb.values());
  },
};
