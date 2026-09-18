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
