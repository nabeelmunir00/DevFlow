import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getOrganizations } from "@/features/organizations/api/get-organizations";

import type { Organization } from "@/features/organizations/types/organization";
import { WorkspaceSelector } from "@/components/workspace-selector/workspace-selector";

export default async function SelectWorkspacePage() {
  const { userId, getToken } = await auth();

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
  let hasError = false;

  try {
    const data = await getOrganizations(token);

    console.log("Organizations:", data);

    organizations = data;
  } catch (error) {
    console.error("Failed to load organizations:", error);
    hasError = true;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  return (
    <WorkspaceSelector
      organizations={organizations}
      email={email}
      hasError={hasError}
    />
  );
}
