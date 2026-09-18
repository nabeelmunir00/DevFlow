export type OrganizationRole =
  | "OWNER"
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "DEVELOPER"
  | "MEMBER"
  | "VIEWER";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role: OrganizationRole;
  joinedAt: string;
  memberCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

export interface CreatedOrganization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  createdAt: string;
  updatedAt: string;
}
