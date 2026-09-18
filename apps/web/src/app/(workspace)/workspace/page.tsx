import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { WorkspaceSelector } from "@/components/workspace-selector/workspace-selector";
import { getOrganizations } from "@/features/organizations/api/get-organizations";

export default async function WorkspacesPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/");
  }

  const token = await getToken();

  if (!token) {
    redirect("/");
  }

  const organizations = await getOrganizations(token);

  return <WorkspaceSelector organizations={organizations} />;
}
