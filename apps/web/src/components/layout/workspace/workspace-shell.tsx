import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceShellProps {
  slug: string;
  children: ReactNode;
}

export function WorkspaceShell({ slug, children }: WorkspaceShellProps) {
  return (
    <SidebarProvider>
      <WorkspaceSidebar slug={slug} />

      <SidebarInset>
        <WorkspaceHeader />

        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
