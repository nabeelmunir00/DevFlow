"use client";

import {
  CalendarDays,
  CheckSquare,
  Ellipsis,
  GitBranch,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  ProjectTaskPriority,
  ProjectTaskSummary,
} from "../../../types/project";

interface BoardTaskCardProps {
  task: ProjectTaskSummary;
  isOverlay?: boolean;
}

const priorityStyles: Record<
  ProjectTaskPriority,
  {
    label: string;
    dot: string;
  }
> = {
  LOW: {
    label: "Low",
    dot: "bg-success",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-primary",
  },
  HIGH: {
    label: "High",
    dot: "bg-destructive",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-destructive",
  },
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({
    ...args,
    wasDragging: true,
  });

export function BoardTaskCard({ task, isOverlay = false }: BoardTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      disabled: isOverlay,
      animateLayoutChanges,
      data: {
        type: "task",
        task,
      },
    });

  const priority = priorityStyles[task.priority];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? undefined
      : "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
      className={[
        "touch-none outline-none",
        "motion-reduce:transition-none",
        !isOverlay && "cursor-grab active:cursor-grabbing",
        isDragging && "relative z-10 opacity-25",
        isOverlay && "cursor-grabbing",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Card
        className={[
          "gap-0 rounded-md border-border bg-card p-3 shadow-none",
          "transition-[border-color,box-shadow,transform,opacity] duration-200 ease-out",
          "motion-reduce:transition-none",
          isOverlay
            ? "scale-[1.02] border-primary/40 shadow-lg"
            : "hover:border-foreground/20",
        ].join(" ")}
      >
        {/* Top */}

        <div className="flex min-w-0 items-center justify-between gap-3">
          <button
            type="button"
            className="truncate text-left text-sm font-medium text-primary underline underline-offset-2"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {task.id}
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`size-2.5 shrink-0 rounded-full ${priority.dot}`}
                aria-hidden="true"
              />

              <span className="text-xs text-muted-foreground">
                {priority.label}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground"
              aria-label={`More options for ${task.title}`}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <Ellipsis className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content */}

        <h3 className="mt-1.5 text-sm font-semibold leading-5 text-foreground">
          {task.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {task.description ?? "Task details and implementation requirements."}
        </p>

        {/* Assignee */}

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback className="text-xs">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>

          {task.label && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              {task.label}
            </span>
          )}

          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />

            <span className="whitespace-nowrap">{task.dueDate}</span>
          </div>
        </div>

        {/* Meta */}

        <div className="mt-3 flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckSquare className="size-4" aria-hidden="true" />

            <span className="tabular-nums">
              {task.completedSubtasks ?? 0}/{task.totalSubtasks ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="size-4" aria-hidden="true" />

            <span className="tabular-nums">{task.comments ?? 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <Paperclip className="size-4" aria-hidden="true" />

            <span className="tabular-nums">{task.attachments ?? 0}</span>
          </div>

          {task.pullRequest && (
            <div className="ml-auto flex min-w-0 items-center gap-1 text-primary">
              <GitBranch className="size-4 shrink-0" aria-hidden="true" />

              <span className="truncate underline underline-offset-2">
                #{task.pullRequest}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
