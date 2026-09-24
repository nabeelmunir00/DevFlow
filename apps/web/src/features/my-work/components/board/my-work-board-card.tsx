"use client";

import {
  ChevronsDown,
  ChevronsUp,
  Clock3,
  Diamond,
  GripVertical,
  Minus,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskPriority,
} from "../../types/my-work";

interface MyWorkBoardCardProps {
  task: MyWorkTask;
  project?: MyWorkProject;
  dragging?: boolean;
  onMarkComplete?: (taskId: string) => void;
  onChangePriority?: (taskId: string, priority: MyWorkTaskPriority) => void;
  onDeleteTask?: (taskId: string) => void;
}

const projectAccentClasses: Record<MyWorkProject["accent"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};

function PriorityIcon({ priority }: { priority: MyWorkTaskPriority }) {
  if (priority === "URGENT") {
    return <ChevronsUp className="size-4 text-destructive" />;
  }

  if (priority === "HIGH") {
    return <Diamond className="size-3.5 text-warning" />;
  }

  if (priority === "LOW") {
    return <ChevronsDown className="size-4 text-success" />;
  }

  return <Minus className="size-4 text-warning" />;
}

export function MyWorkBoardCard({
  task,
  project,
  dragging = false,
  onMarkComplete,
  onChangePriority,
  onDeleteTask,
}: MyWorkBoardCardProps) {
  return (
    <article
      className={cn(
        "group rounded-md border border-border bg-card p-3 transition-[border-color,background-color,opacity,transform]",
        "hover:border-primary/30",
        dragging && "scale-[1.02] border-primary/40 opacity-80 shadow-lg",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          aria-label={`Drag ${task.key}`}
        >
          <GripVertical className="size-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <PriorityIcon priority={task.priority} />

            <span className="text-xs font-medium text-primary">{task.key}</span>

            {task.status === "BLOCKED" && (
              <span className="rounded-sm bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
                Blocked
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-medium leading-5 text-foreground">
            {task.title}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label={`Actions for ${task.key}`}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {task.status !== "DONE" && (
                <DropdownMenuItem onClick={() => onMarkComplete?.(task.id)}>
                  Mark complete
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => onChangePriority?.(task.id, "URGENT")}
              >
                Urgent priority
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangePriority?.(task.id, "HIGH")}
              >
                High priority
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangePriority?.(task.id, "MEDIUM")}
              >
                Medium priority
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangePriority?.(task.id, "LOW")}
              >
                Low priority
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteTask?.(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {project ? (
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
        ) : (
          <span />
        )}

        <div
          className={cn(
            "flex shrink-0 items-center gap-1 text-xs text-muted-foreground",
            task.group === "OVERDUE" && "text-destructive",
            task.group === "TODAY" && "text-warning",
          )}
        >
          <Clock3 className="size-3.5" />
          {task.dueLabel}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-xs text-muted-foreground">{task.estimate}</span>

        <span className="text-xs capitalize text-muted-foreground">
          {task.priority.toLowerCase()}
        </span>
      </div>
    </article>
  );
}
