import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export interface UpcomingDeadlineItem {
  id: string;
  dueDate: string;
  project: string;
  task: string;
}

interface UpcomingDeadlineProps {
  deadlines?: UpcomingDeadlineItem[];
}

const demoDeadlines: UpcomingDeadlineItem[] = [
  {
    id: "deadline-1",
    dueDate: "Today",
    project: "DevFlow Web",
    task: "Organization switcher",
  },
  {
    id: "deadline-2",
    dueDate: "Tomorrow",
    project: "API Platform",
    task: "Invitation token expiry",
  },
  {
    id: "deadline-3",
    dueDate: "Sep 20",
    project: "DevFlow Web",
    task: "Loading states",
  },
];

function getDateClassName(dueDate: string) {
  switch (dueDate) {
    case "Today":
      return "text-warning";

    case "Tomorrow":
      return "text-foreground";

    default:
      return "text-muted-foreground";
  }
}

function getDateIconClassName(dueDate: string) {
  if (dueDate === "Today") {
    return "text-warning";
  }

  return "text-muted-foreground";
}

export function UpcomingDeadline({
  deadlines = demoDeadlines,
}: UpcomingDeadlineProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <DashboardPanelHeader
        title="Upcoming deadline"
        actionLabel="View all"
        href={`/workspace/tasks`}
      />

      <CardContent className="p-0">
        <Table aria-label="Upcoming deadlines">
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-28 px-4 text-xs font-normal text-muted-foreground">
                Due date
              </TableHead>

              <TableHead className="h-9 w-32 px-2 text-xs font-normal text-muted-foreground">
                Project
              </TableHead>

              <TableHead className="h-9 min-w-0 px-2 text-xs font-normal text-muted-foreground">
                Task
              </TableHead>

              <TableHead className="h-9 w-11 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deadlines.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No upcoming deadlines.
                </TableCell>
              </TableRow>
            ) : (
              deadlines.map((deadline) => (
                <TableRow
                  key={deadline.id}
                  className="h-10 border-border transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-4 py-0">
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${getDateClassName(
                        deadline.dueDate,
                      )}`}
                    >
                      <Icon
                        icon="solar:calendar-linear"
                        className={`size-3.5 shrink-0 ${getDateIconClassName(
                          deadline.dueDate,
                        )}`}
                        aria-hidden="true"
                      />

                      <span className="whitespace-nowrap tabular-nums">
                        {deadline.dueDate}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="min-w-0 px-2 py-0">
                    <span
                      className="block truncate text-xs text-muted-foreground"
                      title={deadline.project}
                    >
                      {deadline.project}
                    </span>
                  </TableCell>

                  <TableCell className="min-w-0 px-2 py-0">
                    <span
                      className="block truncate text-sm font-medium text-foreground"
                      title={deadline.task}
                    >
                      {deadline.task}
                    </span>
                  </TableCell>

                  <TableCell className="px-2 py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          />
                        }
                      >
                        <Icon
                          icon="solar:menu-dots-bold"
                          className="size-4"
                          aria-hidden="true"
                        />

                        <span className="sr-only">
                          Actions for {deadline.task}
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuItem>
                          <Icon
                            icon="solar:eye-linear"
                            className="size-4"
                            aria-hidden="true"
                          />
                          View task
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Icon
                            icon="solar:folder-with-files-linear"
                            className="size-4"
                            aria-hidden="true"
                          />
                          Open project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
