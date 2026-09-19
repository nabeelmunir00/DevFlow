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
  slug: string;
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
  if (dueDate === "Today") {
    return "text-warning";
  }

  return "text-muted-foreground";
}

export function UpcomingDeadline({
  slug,
  deadlines = demoDeadlines,
}: UpcomingDeadlineProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Upcoming deadline"
        actionLabel="View all"
        href={`/workspace/${slug}/tasks`}
      />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-28 px-3 text-xs font-normal text-muted-foreground">
                Due date
              </TableHead>

              <TableHead className="h-9 min-w-28 px-2 text-xs font-normal text-muted-foreground">
                Project
              </TableHead>

              <TableHead className="h-9 min-w-40 px-2 text-xs font-normal text-muted-foreground">
                Task
              </TableHead>

              <TableHead className="h-9 w-10 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deadlines.map((deadline) => (
              <TableRow key={deadline.id} className="h-11 border-border">
                <TableCell className="px-3 py-0">
                  <div
                    className={`flex items-center gap-1.5 text-xs ${getDateClassName(
                      deadline.dueDate,
                    )}`}
                  >
                    <Icon icon="solar:calendar-linear" className="size-3.5" />

                    <span>{deadline.dueDate}</span>
                  </div>
                </TableCell>

                <TableCell className="max-w-32 px-2 py-0">
                  <span className="block truncate text-xs text-muted-foreground">
                    {deadline.project}
                  </span>
                </TableCell>

                <TableCell className="max-w-48 px-2 py-0">
                  <span className="block truncate text-sm font-medium text-foreground">
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
                          className="size-7"
                        />
                      }
                    >
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="size-4 text-muted-foreground"
                      />

                      <span className="sr-only">Deadline actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View task</DropdownMenuItem>

                      <DropdownMenuItem>Open project</DropdownMenuItem>
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
