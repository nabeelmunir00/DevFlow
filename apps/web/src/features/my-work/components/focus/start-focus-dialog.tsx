"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Focus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { MyWorkProject, MyWorkTask } from "../../types/my-work";

interface StartFocusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: MyWorkTask[];
  projects: MyWorkProject[];
  onStart: (taskId: string) => void;
}

export function StartFocusDialog({
  open,
  onOpenChange,
  tasks,
  projects,
  onStart,
}: StartFocusDialogProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const availableTasks = useMemo(
    () => tasks.filter((task) => task.planned && task.status !== "DONE"),
    [tasks],
  );

  function handleStart() {
    if (!selectedTaskId) return;

    onStart(selectedTaskId);
    setSelectedTaskId(null);
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedTaskId(null);
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start focus work</DialogTitle>

          <DialogDescription>
            Choose a planned task to focus on.
          </DialogDescription>
        </DialogHeader>

        {availableTasks.length > 0 ? (
          <div className="max-h-80 space-y-2 overflow-y-auto py-2">
            {availableTasks.map((task) => {
              const project = projects.find(
                (project) => project.id === task.projectId,
              );

              const selected = selectedTaskId === task.id;

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border border-border p-3 text-left transition-colors",
                    "hover:bg-secondary/50",
                    selected && "border-primary/50 bg-primary/10",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border",
                      selected &&
                        "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {selected && <Check className="size-3" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">
                        {task.key}
                      </span>

                      {project && (
                        <span className="truncate text-xs text-muted-foreground">
                          {project.shortName}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {task.title}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {task.estimate}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-md border border-dashed border-border px-5 text-center">
            <Focus className="size-5 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium text-foreground">
              No planned tasks
            </p>

            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Add an incomplete task to your plan before starting focus work.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!selectedTaskId}
            onClick={handleStart}
          >
            <Focus className="size-4" />
            Start focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
