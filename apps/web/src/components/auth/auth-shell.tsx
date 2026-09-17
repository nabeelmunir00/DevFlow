import type { ReactNode } from "react";

import { AuthNavbar } from "./auth-navbar";

interface AuthShellProps {
  mode: "sign-in" | "sign-up";
  showcase: ReactNode;
  children: ReactNode;
}

export function AuthShell({ mode, showcase, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthNavbar mode={mode} />

      <main className="flex w-full flex-col lg:flex-row">
        {/* Left */}
        <section className="hidden flex-1 border-r border-border lg:flex">
          <div className="flex w-full items-center justify-center px-10 py-16 xl:px-16">
            {showcase}
          </div>
        </section>

        {/* Right */}
        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16 xl:px-16">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </main>
    </div>
  );
}
