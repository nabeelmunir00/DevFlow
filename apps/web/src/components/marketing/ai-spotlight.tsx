import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { AiAssistantPreview } from "@/components/marketing/ai-assistant-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: ListChecks,
    text: "Break complex work into actionable tasks",
  },
  {
    icon: AlertTriangle,
    text: "Surface blockers and project risks",
  },
  {
    icon: BarChart3,
    text: "Summarize progress across your workspace",
  },
];

export function AiSpotlight() {
  return (
    <section className="border-y border-border bg-muted/20 py-24">
      <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:px-12 xl:gap-20">
        {/* Content */}
        <div className="max-w-xl">
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-primary/5 text-primary"
          >
            <Sparkles className="size-3.5" />
            DevFlow AI
          </Badge>

          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Turn project context
            <br />
            into{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              action
            </span>{" "}
            with AI
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            DevFlow AI understands your projects, issues, sprints, and
            engineering activity to help your team decide what to do next.
          </p>

          <div className="mt-8 space-y-4">
            {capabilities.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-3.5 text-primary" />
                </div>

                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <Button variant="outline" size="lg">
              Explore DevFlow AI
              <ArrowRight />
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              Works alongside your existing issues, sprints, and pull requests —
              no setup required.
            </p>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative min-w-0">
          {/* subtle background decoration */}
          <div
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-6 top-1/3 -z-10 size-40 rounded-full bg-primary/5 blur-2xl"
            aria-hidden="true"
          />

          <AiAssistantPreview />
        </div>
      </div>
    </section>
  );
}
