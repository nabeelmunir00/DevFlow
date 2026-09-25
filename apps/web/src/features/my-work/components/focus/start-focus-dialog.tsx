"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Focus, ListTodo } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { MyWorkProject, MyWorkTask } from "../../types/my-work";

interface StartFocusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: MyWorkTask[];
  projects: MyWorkProject[];
  onStart: (taskId: string) => void;
}

const projectAccentClasses: Record<MyWorkProject["accent"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};

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

  const selectedTask = useMemo(
    () => availableTasks.find((task) => task.id === selectedTaskId),
    [availableTasks, selectedTaskId],
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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Focus className="size-4 text-primary" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-base">Start focus work</DialogTitle>

              <DialogDescription className="mt-1 text-xs">
                Choose one of your planned tasks and focus on getting it done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {availableTasks.length > 0 ? (
          <>
            <div className="flex items-center justify-between border-b border-border bg-secondary/20 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <ListTodo className="size-4 text-muted-foreground" />

                <span className="text-xs font-medium text-foreground">
                  Planned tasks
                </span>
              </div>

              <span className="text-xs text-muted-foreground">
                {availableTasks.length}{" "}
                {availableTasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <ScrollArea className="h-80">
              <div className="space-y-1.5 p-3">
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
                        "group flex w-full items-start gap-3 rounded-md border border-transparent px-3 py-3 text-left transition-colors",
                        "hover:border-border hover:bg-secondary/50",
                        selected &&
                          "border-primary/30 bg-primary/10 hover:border-primary/30 hover:bg-primary/10",
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
                          selected &&
                            "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {selected && <Check className="size-3" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 text-xs font-medium text-primary">
                            {task.key}
                          </span>

                          {project && (
                            <>
                              <span className="text-muted-foreground">·</span>

                              <div className="flex min-w-0 items-center gap-1.5">
                                <span
                                  className={cn(
                                    "size-2 shrink-0 rounded-full",
                                    projectAccentClasses[project.accent],
                                  )}
                                />

                                <span className="truncate text-xs text-muted-foreground">
                                  {project.shortName}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <p className="mt-1.5 truncate text-sm font-medium text-foreground">
                          {task.title}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span
                            className={cn(
                              task.group === "OVERDUE" && "text-destructive",
                              task.group === "TODAY" && "text-warning",
                            )}
                          >
                            {task.dueLabel}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock3 className="size-3.5" />
                            {task.estimate}
                          </span>

                          <span className="capitalize">
                            {task.priority.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-md bg-secondary">
              <ListTodo className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              No tasks ready for focus
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              Add an incomplete assigned task to your plan, then come back here
              to start focusing.
            </p>
          </div>
        )}

        <DialogFooter className="border-t border-border bg-secondary/10 px-5 py-3">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="min-w-0">
              {selectedTask ? (
                <p className="truncate text-xs text-muted-foreground">
                  Selected{" "}
                  <span className="font-medium text-foreground">
                    {selectedTask.key}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Select a task to continue
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!selectedTaskId}
                onClick={handleStart}
                className="gap-2"
              >
                <Focus className="size-4" />
                Start focus
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
