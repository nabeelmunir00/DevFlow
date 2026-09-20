import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

export function ProjectsHeader() {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          All your team&apos;s projects in one place.
        </p>
      </div>

      <Button type="button" className="h-10 shrink-0 gap-2 rounded-md px-4">
        <Icon icon="solar:add-linear" className="size-5" aria-hidden="true" />
        Create project
      </Button>
    </div>
  );
}
