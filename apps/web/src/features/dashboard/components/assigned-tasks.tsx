import { Icon } from "@iconify/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardPanelHeader } from "./dashboard-panel-header";

type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

interface AssignedTask {
  id: string;
  title: string;
  project: string;
  priority: TaskPriority;
  due: string;
}

interface AssignedTasksProps {
  slug: string;
  tasks?: AssignedTask[];
}

const demoTasks: AssignedTask[] = [
  {
    id: "DF-121",
    title: "Organization switcher",
    project: "DevFlow Web",
    priority: "HIGH",
    due: "Today",
  },
  {
    id: "DF-128",
    title: "Resolve invite token expiry",
    project: "API Platform",
    priority: "HIGH",
    due: "Today",
  },
  {
    id: "DF-118",
    title: "Task detail panel",
    project: "DevFlow Web",
    priority: "MEDIUM",
    due: "Tomorrow",
  },
  {
    id: "DF-134",
    title: "Add loading states",
    project: "DevFlow Web",
    priority: "MEDIUM",
    due: "Sep 20",
  },
];

function getPriorityClassName(priority: TaskPriority) {
  switch (priority) {
    case "HIGH":
      return "border-destructive/30 bg-destructive/10 text-destructive";

    case "MEDIUM":
      return "border-warning/30 bg-warning/10 text-warning";

    case "LOW":
      return "border-success/30 bg-success/10 text-success";
  }
}

function getDueClassName(due: string) {
  if (due === "Today") {
    return "text-warning";
  }

  return "text-muted-foreground";
}

export function AssignedTasks({ slug, tasks = demoTasks }: AssignedTasksProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Assigned to me"
        actionLabel="View all tasks"
        href={`/workspace/${slug}/tasks`}
      />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="w-10 px-3">
                <div className="flex items-center justify-center">
                  <Checkbox aria-label="Select all tasks" />
                </div>
              </TableHead>

              <TableHead className="h-9 min-w-56 px-2 text-xs font-normal text-muted-foreground">
                Task
              </TableHead>

              <TableHead className="h-9 min-w-32 px-2 text-xs font-normal text-muted-foreground">
                Project
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Priority
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Due
              </TableHead>

              <TableHead className="h-9 w-10 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="h-11 border-border">
                <TableCell className="px-3 py-0">
                  <div className="flex items-center justify-center">
                    <Checkbox aria-label={`Select ${task.title}`} />
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {task.id}
                    </span>

                    <span className="truncate text-sm font-medium text-foreground">
                      {task.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <span className="truncate text-sm text-muted-foreground">
                    {task.project}
                  </span>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <Badge
                    variant="outline"
                    className={`rounded-sm px-2 py-0 text-[11px] font-medium ${getPriorityClassName(
                      task.priority,
                    )}`}
                  >
                    {task.priority === "HIGH"
                      ? "High"
                      : task.priority === "MEDIUM"
                        ? "Medium"
                        : "Low"}
                  </Badge>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <div
                    className={`flex items-center gap-1.5 text-xs ${getDueClassName(
                      task.due,
                    )}`}
                  >
                    <Icon icon="solar:calendar-linear" className="size-3.5" />

                    <span>{task.due}</span>
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                        />
                      }
                    >
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="size-4 text-muted-foreground"
                      />

                      <span className="sr-only">Task actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View task</DropdownMenuItem>

                      <DropdownMenuItem>Edit task</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
