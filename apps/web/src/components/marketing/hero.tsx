import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-16 px-4 py-16 lg:grid-cols-2 lg:py-20">
        {/* Content */}
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Built for modern engineering teams
          </div>

          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build better software,
            <span className="text-primary"> together.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Plan projects, track issues, collaborate with your team, and bring
            AI into your development workflow — all in one workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg">
              <Link href="/sign-up" className="flex items-center gap-2">
                Get started
                <ArrowRight />
              </Link>
            </Button>

            <Button variant="secondary" size="lg">
              <a href="#workspace-preview">Explore DevFlow</a>
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Built for developers. Designed for teams.
          </p>
        </div>

        {/* Workspace preview */}
        <div
          id="workspace-preview"
          className="flex min-h-96 items-center justify-center lg:min-h-[32rem]"
        >
          <div className="flex size-full items-center justify-center rounded-xl border border-dashed border-border bg-card">
            <p className="text-sm text-muted-foreground">Workspace preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}
