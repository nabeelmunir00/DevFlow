import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getOrganizations } from "@/features/organizations/api/get-organizations";

import type { Organization } from "@/features/organizations/types/organization";
import { WorkspaceSelector } from "@/components/workspace-selector/workspace-selector";

export default async function SelectWorkspacePage() {
  const { userId, getToken } = await auth();
  let hasError = false;

  if (!userId) {
    redirect("/");
  }

  const token = await getToken();

  if (!token) {
    redirect("/");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  let organizations: Organization[] = [];

  try {
    organizations = await getOrganizations(token);
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    hasError = true;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  return (
    <WorkspaceSelector organizations={organizations} email={email} hasError />
  );
}
