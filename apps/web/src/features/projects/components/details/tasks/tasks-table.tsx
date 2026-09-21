"use client";

import { Ellipsis, GitBranch } from "lucide-react";

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

import { TaskStatusSelect } from "./task-status-select";

interface TasksTableProps {
  tasks: ProjectTaskSummary[];
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

export function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Checkbox aria-label="Select all tasks" />
            </TableHead>

            <TableHead className="w-24">Key</TableHead>

            <TableHead>Title</TableHead>

            <TableHead className="w-36">Status</TableHead>

            <TableHead className="w-28">Priority</TableHead>

            <TableHead className="w-44">Assignee</TableHead>

            <TableHead className="hidden w-28 lg:table-cell">Sprint</TableHead>

            <TableHead className="hidden w-24 md:table-cell">Due</TableHead>

            <TableHead className="hidden w-24 xl:table-cell">
              Estimate
            </TableHead>

            <TableHead className="hidden w-24 lg:table-cell">PR</TableHead>

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const priority = priorityStyles[task.priority];

              return (
                <TableRow key={task.id}>
                  <TableCell className="text-center">
                    <Checkbox aria-label={`Select ${task.title}`} />
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                    >
                      {task.id}
                    </button>
                  </TableCell>

                  <TableCell className="max-w-64">
                    <span className="block truncate font-medium text-foreground">
                      {task.title}
                    </span>
                  </TableCell>

                  <TableCell>
                    <TaskStatusSelect value={task.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2.5 shrink-0 rounded-full ${priority.dot}`}
                        aria-hidden="true"
                      />

                      <span>{priority.label}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>

                      <span className="truncate">{task.assignee.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden whitespace-nowrap lg:table-cell">
                    {task.sprint ?? "Sprint 06"}
                  </TableCell>

                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {task.dueDate}
                  </TableCell>

                  <TableCell className="hidden whitespace-nowrap xl:table-cell">
                    {task.estimate ?? "—"}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {task.pullRequest ? (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <GitBranch className="size-4" />#{task.pullRequest}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground"
                      aria-label={`More options for ${task.title}`}
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
                colSpan={11}
                className="h-32 text-center text-muted-foreground"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex min-h-14 items-center justify-between border-t border-border px-4">
        <p className="text-sm text-muted-foreground">
          Showing {tasks.length} tasks
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            disabled
          >
            <span aria-hidden="true">‹</span>
            <span className="sr-only">Previous page</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 border-primary bg-primary/10 text-primary"
          >
            1
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            2
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            3
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            <span aria-hidden="true">›</span>
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
