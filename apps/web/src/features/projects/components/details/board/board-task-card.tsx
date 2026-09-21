import {
  CalendarDays,
  CheckSquare,
  Ellipsis,
  GitBranch,
  MessageCircle,
  Paperclip,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  ProjectTaskPriority,
  ProjectTaskSummary,
} from "../../../types/project";

interface BoardTaskCardProps {
  task: ProjectTaskSummary;
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

export function BoardTaskCard({ task }: BoardTaskCardProps) {
  const priority = priorityStyles[task.priority];

  return (
    <Card className="gap-0 rounded-md border-border bg-card p-3 shadow-none">
      {/* =====================================================
          TOP ROW
      ====================================================== */}

      <div className="flex min-w-0 items-center justify-between gap-3">
        <button
          type="button"
          className="truncate text-left text-sm font-medium text-primary underline underline-offset-2"
        >
          {task.id}
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`size-2.5 rounded-full ${priority.dot}`}
              aria-hidden="true"
            />

            <span className="text-xs text-muted-foreground">
              {priority.label}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          TITLE + DESCRIPTION
      ====================================================== */}

      <h3 className="mt-1.5 text-sm font-semibold leading-5 text-foreground">
        {task.title}
      </h3>

      <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
        {task.description ?? "Task details and implementation requirements."}
      </p>

      {/* =====================================================
          ASSIGNEE / LABEL / DUE DATE
      ====================================================== */}

      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
        <Avatar className="size-7">
          <AvatarFallback className="text-xs">
            {task.assignee.initials}
          </AvatarFallback>
        </Avatar>

        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
          {task.label ?? "ui"}
        </span>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />

          <span>{task.dueDate}</span>
        </div>
      </div>

      {/* =====================================================
          TASK META
      ====================================================== */}

      <div className="mt-3 flex min-w-0 items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="size-4" />
          <span>
            {task.completedSubtasks ?? 0}/{task.totalSubtasks ?? 0}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <MessageCircle className="size-4" />
          <span>{task.comments ?? 0}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Paperclip className="size-4" />
          <span>{task.attachments ?? 0}</span>
        </div>

        {task.pullRequest && (
          <div className="ml-auto flex min-w-0 items-center gap-1.5 text-primary">
            <GitBranch className="size-4 shrink-0" />

            <span className="truncate underline underline-offset-2">
              #{task.pullRequest}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
