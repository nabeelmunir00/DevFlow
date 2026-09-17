import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header>
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Left */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="DevFlow home"
          >
            <DevFlowLogo />

            <span className="text-xl font-semibold tracking-tight text-foreground">
              DevFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 md:flex">
            <Link
              href="#product"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Product
            </Link>

            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>

            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="hidden h-10 border-input bg-transparent px-5 font-medium shadow-none sm:inline-flex"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>

          <Button asChild className="h-10 px-5 font-semibold">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DevFlowLogo() {
  return (
    <svg
      viewBox="0 0 40 28"
      className="h-7 w-9 text-primary"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M7 3h13l-4.2 7H11l-2 4h6.5l-6 11H1l5.2-10H3L7 3Z"
      />

      <path
        fill="currentColor"
        opacity="0.92"
        d="M23 3h14l-4 7h-5l-2.2 4H32l-6 11h-8l5.3-10H20l3-12Z"
      />
    </svg>
  );
}
