import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Navbar */}
      <header className="px-6 py-4">
        <div className="flex  h-full items-center px-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="DevFlow home"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className="size-9 object-contain"
            />

            <span className="text-xl font-semibold tracking-tight">
              DevFlow
            </span>
          </Link>
        </div>
      </header>

      {/* Auth content */}
      <main className="grid min-h-[calc(100dvh-5rem)] lg:grid-cols-2">
        {/* Brand panel */}
        <section className="hidden border-r border-border lg:block">
          <AuthBrandPanel />
        </section>

        {/* Form panel */}
        <section className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg">{children}</div>
        </section>
      </main>
    </div>
  );
}
