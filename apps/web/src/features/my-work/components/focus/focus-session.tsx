"use client";

import { Check, Focus, Square } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { MyWorkProject, MyWorkTask } from "../../types/my-work";

interface FocusSessionProps {
  task: MyWorkTask;
  project?: MyWorkProject;
  onComplete: () => void;
  onStop: () => void;
}

export function FocusSession({
  task,
  project,
  onComplete,
  onStop,
}: FocusSessionProps) {
  return (
    <div className="sticky bottom-4 z-30 mt-4 flex justify-center px-3">
      <div className="flex max-w-full items-center gap-3 rounded-md border border-primary/30 bg-card px-3 py-2 shadow-lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Focus className="size-4 text-primary" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary">{task.key}</span>

            {project && (
              <span className="text-xs text-muted-foreground">
                {project.shortName}
              </span>
            )}
          </div>

          <p className="max-w-64 truncate text-sm font-medium text-foreground">
            {task.title}
          </p>
        </div>

        <div className="h-8 w-px shrink-0 bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onComplete}
          className="gap-2"
        >
          <Check className="size-4" />
          Complete
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onStop}
          className="gap-2"
        >
          <Square className="size-3.5" />
          Stop
        </Button>
      </div>
    </div>
  );
}
