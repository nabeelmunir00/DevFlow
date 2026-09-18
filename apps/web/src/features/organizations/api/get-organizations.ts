import type { Organization } from "../types/organization";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrganizationsResponse {
  success: boolean;
  statusCode: number;
  data: Organization[];
  timestamp: string;
}

export async function getOrganizations(token: string): Promise<Organization[]> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/v1/organizations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();

    console.error("GET /organizations failed", {
      status: response.status,
      statusText: response.statusText,
      body,
    });

    throw new Error(`Failed to fetch organizations (${response.status})`);
  }

  const result: OrganizationsResponse = await response.json();

  return result.data;
}
