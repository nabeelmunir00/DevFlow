import type { ApiResponse } from "../types/organization";
import type { CreatedOrganization } from "../types/organization";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export async function createOrganization(
  token: string,
  input: CreateOrganizationInput,
): Promise<CreatedOrganization> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/organizations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ?? result?.error?.message ?? "Failed to create workspace",
    );
  }

  const data = result as ApiResponse<CreatedOrganization>;

  return data.data;
}
