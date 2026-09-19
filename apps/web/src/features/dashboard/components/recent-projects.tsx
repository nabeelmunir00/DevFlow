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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardPanelHeader } from "./dashboard-panel-header";

type ProjectStatus = "ACTIVE" | "PLANNING" | "ON_HOLD";

export interface RecentProject {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  lastUpdated: string;
}

interface RecentProjectsProps {
  slug: string;
  projects?: RecentProject[];
}

const demoProjects: RecentProject[] = [
  {
    id: "project-1",
    name: "DevFlow Web",
    status: "ACTIVE",
    progress: 72,
    lastUpdated: "12 min ago",
  },
  {
    id: "project-2",
    name: "API Platform",
    status: "ACTIVE",
    progress: 58,
    lastUpdated: "38 min ago",
  },
  {
    id: "project-3",
    name: "Design System",
    status: "PLANNING",
    progress: 31,
    lastUpdated: "2 hr ago",
  },
];

function getStatusLabel(status: ProjectStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PLANNING":
      return "Planning";
    case "ON_HOLD":
      return "On hold";
  }
}

function getStatusClassName(status: ProjectStatus) {
  switch (status) {
    case "ACTIVE":
      return "border-success/30 bg-success/10 text-success";

    case "PLANNING":
      return "border-info/30 bg-info/10 text-info";

    case "ON_HOLD":
      return "border-warning/30 bg-warning/10 text-warning";
  }
}

export function RecentProjects({
  slug,
  projects = demoProjects,
}: RecentProjectsProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-md border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Recently updated projects"
        actionLabel="View all projects"
        href={`/workspace/${slug}/projects`}
      />

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="w-10 px-3">
                <div className="flex items-center justify-center">
                  <Checkbox aria-label="Select all projects" />
                </div>
              </TableHead>

              <TableHead className="h-9 min-w-40 px-2 text-xs font-normal text-muted-foreground">
                Project
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="h-9 min-w-40 px-2 text-xs font-normal text-muted-foreground">
                Progress
              </TableHead>

              <TableHead className="h-9 w-28 px-2 text-xs font-normal text-muted-foreground">
                Last update
              </TableHead>

              <TableHead className="h-9 w-10 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="h-11 border-border">
                <TableCell className="px-3 py-0">
                  <div className="flex items-center justify-center">
                    <Checkbox aria-label={`Select ${project.name}`} />
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      icon="solar:folder-with-files-linear"
                      className="size-4 shrink-0 text-primary"
                    />

                    <span className="truncate text-sm font-medium text-foreground">
                      {project.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <Badge
                    variant="outline"
                    className={`rounded-sm px-2 py-0 text-[11px] font-medium ${getStatusClassName(
                      project.status,
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </Badge>
                </TableCell>

                <TableCell className="px-2 py-0">
                  <div className="flex min-w-32 items-center gap-2">
                    <Progress
                      value={project.progress}
                      className="h-1.5 flex-1"
                    />

                    <span className="w-8 text-right text-xs text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-2 py-0 text-xs text-muted-foreground">
                  {project.lastUpdated}
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

                      <span className="sr-only">Project actions</span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open project</DropdownMenuItem>

                      <DropdownMenuItem>Project settings</DropdownMenuItem>
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
