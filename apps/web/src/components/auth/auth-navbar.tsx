import Link from "next/link";

interface AuthNavbarProps {
  mode: "sign-in" | "sign-up";
}

export function AuthNavbar({ mode }: AuthNavbarProps) {
  const isSignIn = mode === "sign-in";

  return (
    <header className="grid h-16 shrink-0 grid-cols-2 bg-background">
      {/* Left */}
      <div className="flex items-center border-r border-border px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="DevFlow home"
        >
          <DevFlowLogo />

          <span className="text-xl font-bold tracking-tight text-foreground">
            DevFlow
          </span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center justify-end px-10">
        <p className="text-sm text-muted-foreground">
          {isSignIn ? "New to DevFlow?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            {isSignIn ? "Create account" : "Sign in"}
          </Link>
        </p>
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
