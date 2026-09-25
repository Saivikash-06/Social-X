export type Role =
  | "citizen"
  | "government"
  | "university"
  | "industry"
  | "ngo"
  | "research"
  | "super_admin";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  detail?: string | Record<string, string[]>;
  timestamp?: string;
}
