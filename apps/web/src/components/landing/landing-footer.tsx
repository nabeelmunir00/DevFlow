import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="mt-4 border-t border-border">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <DevFlowLogo />

          <span className="text-lg font-semibold tracking-tight">DevFlow</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="#product"
            className="transition-colors hover:text-foreground"
          >
            Product
          </Link>

          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function DevFlowLogo() {
  return (
    <svg
      viewBox="0 0 40 28"
      className="h-6 w-8 text-primary"
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
