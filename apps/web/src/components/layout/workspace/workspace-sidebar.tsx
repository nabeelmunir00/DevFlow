"use client";

import { Sidebar } from "@/components/ui/sidebar";

import type { WorkspaceUser } from "./workspace-shell";
import { WorkspaceSidebarContent } from "./workspace-sidebar-content";

interface WorkspaceSidebarProps {
  user: WorkspaceUser;
}

export function WorkspaceSidebar({ user }: WorkspaceSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="hidden h-dvh xl:flex"
    >
      <WorkspaceSidebarContent user={user} mode="desktop" />
    </Sidebar>
  );
}
