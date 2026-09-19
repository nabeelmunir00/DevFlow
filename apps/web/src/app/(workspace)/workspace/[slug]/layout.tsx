import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/layout/workspace/workspace-shell";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const [user, { slug }] = await Promise.all([currentUser(), params]);

  if (!user) {
    redirect("/");
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  const name =
    user.fullName ??
    [user.firstName, user.lastName].filter(Boolean).join(" ") ??
    email;

  return (
    <WorkspaceShell
      slug={slug}
      user={{
        name: name || email,
        email,
        imageUrl: user.imageUrl,
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
