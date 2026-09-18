import { ArrowRight, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="px-6 py-24 lg:px-12 sm:py-28">
      <div className="relative mx-auto max-w-screen-2xl overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
        {/* Subtle background */}
        <div
          className="pointer-events-none absolute inset-0 bg-primary/5"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl">
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 text-primary"
          >
            <Sparkles className="size-3.5" />
            Start building with DevFlow
          </Badge>

          <h2 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Your engineering workspace,
            <br className="hidden sm:block" /> finally in one place.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Bring projects, issues, GitHub activity, team collaboration, and AI
            into one workspace built for modern software teams.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SignUpButton>
              <Button size="lg">
                Create your workspace
                <ArrowRight />
              </Button>
            </SignUpButton>

            <Button variant="outline" size="lg">
              <a href="#workspace-preview">Explore DevFlow</a>
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Built for developers. Designed for teams.
          </p>
        </div>
      </div>
    </section>
  );
}
