"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { WorkspaceUser } from "./workspace-shell";

import { WorkspaceSidebarContent } from "./workspace-sidebar-content";

interface WorkspaceSidebarSheetProps {
  user: WorkspaceUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkspaceSidebarSheet({
  user,
  open,
  onOpenChange,
}: WorkspaceSidebarSheetProps) {
  function handleNavigate() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 gap-0 border-sidebar-border bg-sidebar p-0 sm:max-w-72"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Workspace navigation</SheetTitle>
        </SheetHeader>

        <WorkspaceSidebarContent
          user={user}
          mode="sheet"
          onNavigate={handleNavigate}
        />
      </SheetContent>
    </Sheet>
  );
}
