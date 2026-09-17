import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top */}
      <div className="px-6 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-3"
          aria-label="DevFlow home"
        >
          <DevFlowLogo />

          <span className="text-xl font-semibold tracking-tight text-foreground">
            DevFlow
          </span>
        </Link>

        <div className="mt-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Verification */}
      <section className="flex items-center justify-center">
        <VerifyEmailForm />
      </section>
    </main>
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
