import type { ReactNode } from "react";

import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceShellProps {
  children: ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="hidden lg:block">
        <WorkspaceSidebar />
      </div>

      <div className="lg:pl-64">
        <WorkspaceHeader />

        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
