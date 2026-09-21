import { Goal } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AboutProjectProps {
  description: string;
  goal: string;
}

export function AboutProject({ description, goal }: AboutProjectProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-border bg-card p-4 shadow-none">
      {/* ================================================
          ABOUT
      ================================================= */}

      <div>
        <h2 className="text-lg font-semibold text-foreground">
          About this project
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <Separator className="mt-4 w-full px-2" />

      {/* ================================================
          GOAL
      ================================================= */}

      <div className="flex items-start gap-3 py-2">
        <div className="flex size-9 shrink-0 items-center justify-center">
          <Goal className="size-6" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground">Goal</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">{goal}</p>
        </div>
      </div>
    </Card>
  );
}
