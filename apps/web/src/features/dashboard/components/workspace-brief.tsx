import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

interface WorkspaceBriefProps {
  summary?: string;
}

export function WorkspaceBrief({ summary }: WorkspaceBriefProps) {
  return (
    <section className="flex min-h-18 items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5">
      {/* AI Icon */}
      <div className="flex size-8 shrink-0 items-center justify-center text-primary">
        <Icon icon="solar:magic-stick-3-linear" className="size-10" />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h2 className="shrink-0 text-sm font-semibold text-foreground">
          Workspace brief
        </h2>

        <p className="hidden truncate text-sm text-muted-foreground md:block">
          {summary ??
            "Workspace insights will appear here when activity data is available."}
        </p>
      </div>

      {/* Action */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 shrink-0 gap-1.5 rounded-md border-primary/40 px-3 text-primary hover:bg-primary/10 hover:text-primary"
      >
        <Icon icon="solar:magic-stick-3-linear" className="size-4" />

        <span>Review with AI</span>
      </Button>
    </section>
  );
}
