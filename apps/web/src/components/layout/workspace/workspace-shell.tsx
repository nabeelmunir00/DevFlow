"use client";

import { useState, type ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceSidebarSheet } from "./workspace-sidebar-sheet";

export interface WorkspaceUser {
  name: string;
  email: string;
  imageUrl: string;
}

interface WorkspaceShellProps {
  user: WorkspaceUser;
  children: ReactNode;
}

export function WorkspaceShell({ user, children }: WorkspaceShellProps) {
  const [sidebarSheetOpen, setSidebarSheetOpen] = useState(false);

  return (
    <SidebarProvider className="h-dvh overflow-hidden">
      <WorkspaceSidebar user={user} />

      <SidebarInset className="h-dvh min-h-0 overflow-hidden">
        <WorkspaceHeader
          user={user}
          onOpenSidebar={() => setSidebarSheetOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>

      <WorkspaceSidebarSheet
        user={user}
        open={sidebarSheetOpen}
        onOpenChange={setSidebarSheetOpen}
      />
    </SidebarProvider>
  );
}
