"use client";

import {
  Check,
  ChevronsDown,
  ChevronsUp,
  Diamond,
  Minus,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../types/my-work";

interface MyWorkTaskRowProps {
  task: MyWorkTask;
  project?: MyWorkProject;
  selected: boolean;

  onSelectedChange: (taskId: string, selected: boolean) => void;

  onMarkComplete?: (taskId: string) => void;

  onChangePriority?: (taskId: string, priority: MyWorkTaskPriority) => void;

  onMoveTask?: (taskId: string, status: MyWorkTaskStatus) => void;

  onDeleteTask?: (taskId: string) => void;
}

const projectAccentClasses: Record<MyWorkProject["accent"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};

const statusConfig: Record<
  MyWorkTaskStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  TODO: {
    label: "Todo",
    className: "border-border bg-secondary text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "border-primary/40 bg-primary/10 text-primary",
    dotClassName: "bg-primary",
  },
  IN_REVIEW: {
    label: "In review",
    className: "border-warning/40 bg-warning/10 text-warning",
    dotClassName: "bg-warning",
  },
  BLOCKED: {
    label: "Blocked",
    className: "border-destructive/40 bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
  DONE: {
    label: "Done",
    className: "border-success/40 bg-success/10 text-success",
    dotClassName: "bg-success",
  },
};

function PriorityIcon({ priority }: { priority: MyWorkTaskPriority }) {
  if (priority === "URGENT") {
    return (
      <ChevronsUp
        className="size-4 text-destructive"
        aria-label="Urgent priority"
      />
    );
  }

  if (priority === "HIGH") {
    return (
      <Diamond className="size-3.5 text-warning" aria-label="High priority" />
    );
  }

  if (priority === "LOW") {
    return (
      <ChevronsDown className="size-4 text-success" aria-label="Low priority" />
    );
  }

  return <Minus className="size-4 text-warning" aria-label="Medium priority" />;
}

export function MyWorkTaskRow({
  task,
  project,
  selected,
  onSelectedChange,
  onMarkComplete,
  onChangePriority,
  onMoveTask,
  onDeleteTask,
}: MyWorkTaskRowProps) {
  const status = statusConfig[task.status];

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center border-t border-border transition-colors",
        "md:grid-cols-[2.5rem_minmax(14rem,1fr)_9rem_8.5rem_6.5rem_4.5rem_2.5rem]",
        selected ? "bg-primary/10" : "hover:bg-secondary/40",
      )}
    >
      <div className="flex h-11 items-center justify-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            onSelectedChange(task.id, checked === true)
          }
          aria-label={`Select ${task.key}`}
        />
      </div>

      <div className="flex min-w-0 items-center gap-2 px-2">
        <div className="flex size-5 shrink-0 items-center justify-center">
          <PriorityIcon priority={task.priority} />
        </div>

        <button
          type="button"
          className="shrink-0 text-left text-sm font-medium text-primary hover:underline"
        >
          {task.key}
        </button>

        <span className="truncate text-sm text-foreground">{task.title}</span>
      </div>

      <div className="hidden min-w-0 px-2 md:block">
        {project && (
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-secondary/60 px-2 py-1">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                projectAccentClasses[project.accent],
              )}
            />

            <span className="truncate text-xs text-foreground">
              {project.shortName}
            </span>
          </div>
        )}
      </div>

      <div className="hidden px-2 md:block">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs",
            status.className,
          )}
        >
          <span className={cn("size-2 rounded-full", status.dotClassName)} />

          {status.label}
        </div>
      </div>

      <div className="hidden px-2 md:block">
        <span
          className={cn(
            "text-xs",
            task.group === "OVERDUE" && "text-destructive",
            task.group === "TODAY" && "text-warning",
            task.group === "UPCOMING" && "text-foreground",
          )}
        >
          {task.dueLabel}
        </span>
      </div>

      <div className="hidden px-2 text-xs text-muted-foreground md:block">
        {task.estimate}
      </div>

      <div className="flex h-11 items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`Actions for ${task.key}`}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              {task.status !== "DONE" && (
                <DropdownMenuItem onClick={() => onMarkComplete?.(task.id)}>
                  <Check className="size-4" />
                  Mark complete
                </DropdownMenuItem>
              )}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change priority</DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    disabled={task.priority === "URGENT"}
                    onClick={() => onChangePriority?.(task.id, "URGENT")}
                  >
                    Urgent
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.priority === "HIGH"}
                    onClick={() => onChangePriority?.(task.id, "HIGH")}
                  >
                    High
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.priority === "MEDIUM"}
                    onClick={() => onChangePriority?.(task.id, "MEDIUM")}
                  >
                    Medium
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.priority === "LOW"}
                    onClick={() => onChangePriority?.(task.id, "LOW")}
                  >
                    Low
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    disabled={task.status === "TODO"}
                    onClick={() => onMoveTask?.(task.id, "TODO")}
                  >
                    Todo
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.status === "IN_PROGRESS"}
                    onClick={() => onMoveTask?.(task.id, "IN_PROGRESS")}
                  >
                    In progress
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.status === "IN_REVIEW"}
                    onClick={() => onMoveTask?.(task.id, "IN_REVIEW")}
                  >
                    In review
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={task.status === "DONE"}
                    onClick={() => onMoveTask?.(task.id, "DONE")}
                  >
                    Done
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteTask?.(task.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
