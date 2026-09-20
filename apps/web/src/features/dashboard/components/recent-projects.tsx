"use client";

import { useState } from "react";
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
  projects?: RecentProject[];
  onOpenProject?: (project: RecentProject) => void;
  onProjectSettings?: (project: RecentProject) => void;
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

const statusStyles: Record<
  ProjectStatus,
  {
    label: string;
    badge: string;
    dot: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    badge: "border-success/30 bg-success/10 text-success",
    dot: "bg-success",
  },
  PLANNING: {
    label: "Planning",
    badge: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },
  ON_HOLD: {
    label: "On hold",
    badge: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
};

const projectDotClasses: Record<string, string> = {
  "DevFlow Web": "bg-primary",
  "API Platform": "bg-info",
  "Design System": "bg-success",
};

const checkboxClassName =
  "size-4 rounded-[3px] border-input bg-transparent shadow-none " +
  "data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground " +
  "data-[state=checked]:border-primary data-[state=checked]:bg-primary " +
  "data-[state=checked]:text-primary-foreground focus-visible:ring-ring/50";

export function RecentProjects({
  projects = demoProjects,
  onOpenProject,
  onProjectSettings,
}: RecentProjectsProps) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    () => new Set(),
  );

  const allSelected =
    projects.length > 0 &&
    projects.every((project) => selectedProjectIds.has(project.id));

  function toggleProject(id: string, checked: boolean) {
    setSelectedProjectIds((previous) => {
      const next = new Set(previous);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-lg border-border bg-card py-0 text-foreground shadow-none">
      <DashboardPanelHeader
        title="Recently updated projects"
        actionLabel="View all projects"
        href="/workspace/project"
      />

      <CardContent className="p-0 pb-1">
        <Table
          aria-label="Recently updated projects"
          className="min-w-3/5 table-fixed text-sm"
        >
          <TableHeader className="bg-muted/40">
            <TableRow className="h-9 border-border hover:bg-transparent">
              <TableHead className="h-9 w-14 px-0">
                <div className="flex h-6 items-center justify-center border-r border-border">
                  <Checkbox
                    aria-label="Select all projects"
                    className={checkboxClassName}
                    checked={allSelected}
                    disabled={projects.length === 0}
                    onCheckedChange={(checked) =>
                      setSelectedProjectIds(
                        new Set(
                          checked === true
                            ? projects.map((project) => project.id)
                            : [],
                        ),
                      )
                    }
                  />
                </div>
              </TableHead>

              <TableHead className="h-9 px-2 text-xs font-normal text-muted-foreground">
                Project
              </TableHead>

              <TableHead className="h-9 w-[18%] px-2 text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="h-9 w-[29%] px-2 text-xs font-normal text-muted-foreground">
                Progress
              </TableHead>

              <TableHead className="h-9 w-[17%] px-2 text-xs font-normal text-muted-foreground">
                <span className="underline decoration-muted-foreground/40 underline-offset-2">
                  Last update
                </span>
              </TableHead>

              <TableHead className="h-9 w-12 px-0">
                <div className="flex h-6 items-center justify-center border-l border-border">
                  <Icon
                    icon="solar:menu-dots-bold"
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <span className="sr-only">Actions</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-[13px] text-muted-foreground"
                >
                  No recently updated projects.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const status = statusStyles[project.status];

                return (
                  <TableRow
                    key={project.id}
                    data-state={
                      selectedProjectIds.has(project.id)
                        ? "selected"
                        : undefined
                    }
                    className="h-10 border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="px-0 py-0">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          aria-label={`Select ${project.name}`}
                          className={checkboxClassName}
                          checked={selectedProjectIds.has(project.id)}
                          onCheckedChange={(checked) =>
                            toggleProject(project.id, checked === true)
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`size-3 shrink-0 rounded-full ring-1 ring-border ${
                            projectDotClasses[project.name] ?? "bg-primary"
                          }`}
                        />

                        <span
                          className="truncate font-normal text-foreground"
                          title={project.name}
                        >
                          {project.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <Badge
                        variant="outline"
                        className={`h-6 gap-1.5 rounded-full px-2 py-0 text-xs font-normal ${status.badge}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-2.5 shrink-0 rounded-full ${status.dot}`}
                        />

                        {status.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-0 pr-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="w-9 shrink-0 text-[13px] text-foreground tabular-nums">
                          {project.progress}%
                        </span>

                        <Progress
                          value={project.progress}
                          aria-label={`${project.name} progress`}
                          className="h-2.5 min-w-0 flex-1 rounded-full bg-muted [&_[data-slot=progress-indicator]]:rounded-full [&_[data-slot=progress-indicator]]:bg-primary"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0 text-[13px] text-muted-foreground">
                      <span
                        className="block truncate"
                        title={project.lastUpdated}
                      >
                        {project.lastUpdated}
                      </span>
                    </TableCell>

                    <TableCell className="px-0 py-0">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50"
                              />
                            }
                          >
                            <Icon
                              icon="solar:menu-dots-bold"
                              className="size-4"
                              aria-hidden="true"
                            />

                            <span className="sr-only">
                              Actions for {project.name}
                            </span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="min-w-36">
                            <DropdownMenuItem
                              disabled={!onOpenProject}
                              onClick={() => onOpenProject?.(project)}
                              className="text-[13px]"
                            >
                              Open project
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={!onProjectSettings}
                              onClick={() => onProjectSettings?.(project)}
                              className="text-[13px]"
                            >
                              Project settings
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
