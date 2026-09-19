import type { ReactNode } from "react";

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
  const { slug } = await params;

  return <WorkspaceShell slug={slug}>{children}</WorkspaceShell>;
}
