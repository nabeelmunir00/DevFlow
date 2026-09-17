import type { ReactNode } from "react";

import { AuthNavbar } from "./auth-navbar";

interface AuthShellProps {
  mode: "sign-in" | "sign-up";
  showcase: ReactNode;
  children: ReactNode;
}

export function AuthShell({ mode, showcase, children }: AuthShellProps) {
  return (
    <div className="flex h-dvh flex-col  bg-background text-foreground">
      {/* Auth Navbar */}
      <AuthNavbar mode={mode} />

      {/* Main Auth Area */}
      <main className="grid min-h-0 flex-1 lg:grid-cols-2">
        {/* Left Showcase */}
        <section className="relative hidden min-h-0  border-r border-border lg:block">
          {showcase}
        </section>

        {/* Right Form */}
        <section className="relative flex min-h-0 items-center justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:overflow-hidden lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </main>
    </div>
  );
}
