"use client";

import {
  ChevronsDown,
  ChevronsUp,
  Diamond,
  Minus,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
      {/* Selection */}
      <div className="flex h-11 items-center justify-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            onSelectedChange(task.id, checked === true)
          }
          aria-label={`Select ${task.key}`}
        />
      </div>

      {/* Task */}
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

      {/* Project */}
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

      {/* Status */}
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

      {/* Due date */}
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

      {/* Estimate */}
      <div className="hidden px-2 text-xs text-muted-foreground md:block">
        {task.estimate}
      </div>

      {/* Actions */}
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

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Open task</DropdownMenuItem>

              <DropdownMenuItem>Mark complete</DropdownMenuItem>

              <DropdownMenuItem>Change priority</DropdownMenuItem>

              <DropdownMenuItem>Move task</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
