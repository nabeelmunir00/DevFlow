import type { ReactNode } from "react";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/layout/workspace/workspace-shell";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "Nabeel@gmail.";

  const fullName =
    user?.fullName ??
    [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const name = fullName || email;

  return (
    <WorkspaceShell
      user={{
        name,
        email,
        imageUrl: user?.imageUrl || "/logo.png",
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
