import { ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link"; // Assuming Next.js based on your profile

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

interface RecentProjectTasksProps {
  tasks: ProjectTaskSummary[];
}

// Updated styles to match the image dots and colors
const statusStyles: Record<ProjectTaskStatus, { label: string; dot: string }> =
  {
    TODO: {
      label: "To do",
      dot: "bg-gray-400",
    },
    IN_PROGRESS: {
      label: "In progress",
      dot: "bg-blue-500",
    },
    IN_REVIEW: {
      label: "In review",
      dot: "bg-yellow-500",
    },
    DONE: {
      label: "Done",
      dot: "bg-green-500",
    },
  };

const priorityStyles: Record<
  ProjectTaskPriority,
  { label: string; dot: string }
> = {
  LOW: {
    label: "Low",
    dot: "bg-gray-400",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-blue-500", // Medium priority in image is blue
  },
  HIGH: {
    label: "High",
    dot: "bg-red-500", // High priority in image is red
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-red-700",
  },
};

export function RecentProjectTasks({ tasks }: RecentProjectTasksProps) {
  return (
    <Card className="min-w-0 overflow-hidden rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Recent tasks
        </CardTitle>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          View all tasks
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>

      <CardContent className="min-w-0 p-0">
        {tasks.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-sm font-medium text-foreground">
              No recent tasks
            </p>
          </div>
        ) : (
          <Table aria-label="Recent project tasks" className="w-full">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12 px-6"></TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Key
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Priority
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Assignee
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">
                  Due
                </TableHead>
                <TableHead className="w-12 px-6"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => {
                const status = statusStyles[task.status];
                const priority = priorityStyles[task.priority];

                return (
                  <TableRow
                    key={task.id}
                    className="h-14 border-border transition-colors hover:bg-muted/30"
                  >
                    {/* CHECKBOX */}
                    <TableCell className="px-6 py-3">
                      <Checkbox
                        className="size-4 rounded-[4px]"
                        aria-label="Select task"
                      />
                    </TableCell>

                    {/* KEY */}
                    <TableCell className="py-3 pr-4">
                      <span className="text-sm font-medium text-blue-600">
                        {task.id}
                      </span>
                    </TableCell>

                    {/* TITLE */}
                    <TableCell className="py-3 pr-4">
                      <span className="text-sm font-medium text-foreground">
                        {task.title}
                      </span>
                    </TableCell>

                    {/* PRIORITY */}
                    <TableCell className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`size-2.5 shrink-0 rounded-full ${priority.dot}`}
                        />
                        <span className="text-sm text-foreground">
                          {priority.label}
                        </span>
                      </div>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`size-2.5 shrink-0 rounded-full ${status.dot}`}
                        />
                        <span className="text-sm text-foreground">
                          {status.label}
                        </span>
                      </div>
                    </TableCell>

                    {/* ASSIGNEE */}
                    <TableCell className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        {task.assignee ? (
                          <>
                            <Avatar
                              className="size-6 bg-blue-100 text-blue-700"
                              title={task.assignee.name}
                            >
                              <AvatarFallback className="text-[10px] font-medium bg-blue-100 text-blue-700">
                                {task.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {task.assignee.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* DUE DATE */}
                    <TableCell className="py-3 pr-4">
                      {task.dueDate?.toLowerCase() === "today" ? (
                        <span className="inline-flex items-center rounded bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          Today
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {task.dueDate}
                        </span>
                      )}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="px-6 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
