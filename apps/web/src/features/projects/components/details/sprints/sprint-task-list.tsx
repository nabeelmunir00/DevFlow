"use client";

import { Ellipsis, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  ProjectTaskPriority,
  ProjectTaskSummary,
} from "../../../types/project";

interface SprintTaskListProps {
  title: string;
  tasks: ProjectTaskSummary[];
  actionLabel: string;
  onTaskAction?: (taskId: string) => void;
}

const priorityStyles: Record<
  ProjectTaskPriority,
  {
    label: string;
    className: string;
  }
> = {
  LOW: {
    label: "Low",
    className: "bg-warning",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-primary",
  },
  HIGH: {
    label: "High",
    className: "bg-destructive",
  },
  URGENT: {
    label: "Urgent",
    className: "bg-destructive",
  },
};

export function SprintTaskList({
  title,
  tasks,
  actionLabel,
  onTaskAction,
}: SprintTaskListProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex h-11 items-center justify-between gap-3 border-b border-border px-3">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-medium text-foreground">
            {title}
          </h3>

          <span className="text-sm text-muted-foreground">
            ({tasks.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <Plus className="size-4 text-primary" />
            {actionLabel}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`${title} options`}
          >
            <Ellipsis className="size-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />

            <TableHead className="w-20">Key</TableHead>

            <TableHead>Title</TableHead>

            <TableHead className="hidden lg:table-cell">Priority</TableHead>

            <TableHead className="hidden xl:table-cell">Est.</TableHead>

            <TableHead>Assignee</TableHead>

            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const priority = priorityStyles[task.priority];

              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox aria-label={`Select ${task.id}`} />
                  </TableCell>

                  <TableCell className="text-xs font-medium text-primary">
                    {task.id}
                  </TableCell>

                  <TableCell>
                    <p className="max-w-48 truncate text-xs text-foreground">
                      {task.title}
                    </p>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`size-2.5 rounded-full ${priority.className}`}
                      />

                      {priority.label}
                    </div>
                  </TableCell>

                  <TableCell className="hidden text-xs xl:table-cell">
                    {task.estimate ?? "—"}
                  </TableCell>

                  <TableCell>
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${task.id}`}
                      onClick={() => onTaskAction?.(task.id)}
                    >
                      <Ellipsis className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No tasks
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
