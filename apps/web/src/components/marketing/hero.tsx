import { ArrowRight } from "lucide-react";

import { SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { WorkspacePreview } from "@/components/marketing/workspace-preview";

export function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
        {/* Left */}
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Built for modern engineering teams
          </div>

          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl ">
            Build better
            <br />
            software, <span className="text-primary">together.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Plan projects, track issues, collaborate with your team, and bring
            AI into your development workflow — all in one workspace.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SignUpButton>
              <Button size="lg">
                Create your workspace
                <ArrowRight />
              </Button>
            </SignUpButton>

            <Button variant="secondary" size="lg">
              <a href="#workspace-preview">Explore DevFlow</a>
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Built for developers. Designed for teams.
          </p>
        </div>

        {/* Right */}
        <div id="workspace-preview" className="min-w-0 lg:-mr-8">
          <WorkspacePreview />
        </div>
      </div>
    </section>
  );
}
