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
      collapsible="none"
      variant="sidebar"
      className="hidden h-dvh border-r border-sidebar-border xl:flex"
    >
      <WorkspaceSidebarContent user={user} mode="desktop" />
    </Sidebar>
  );
}
