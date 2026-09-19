import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSidebar } from "./workspace-sidebar";

export interface WorkspaceUser {
  name: string;
  email: string;
  imageUrl: string;
}

interface WorkspaceShellProps {
  slug: string;
  user: WorkspaceUser;
  children: ReactNode;
}

export function WorkspaceShell({ slug, user, children }: WorkspaceShellProps) {
  return (
    <SidebarProvider>
      <WorkspaceSidebar slug={slug} user={user} />

      <SidebarInset>
        <WorkspaceHeader />

        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
