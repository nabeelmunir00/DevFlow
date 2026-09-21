import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "@iconify/react";
import {
  ArrowUp,
  CalendarDays,
  FolderKanban,
  FolderOpen,
  MoreHorizontal,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Project } from "../types/project";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectsTableProps {
  projects: Project[];
  selectedProjectId?: string;
}

interface HeaderCellProps {
  children: ReactNode;
  className?: string;
  separator?: boolean;
}

const accentStyles: Record<Project["accent"], string> = {
  primary: "bg-primary text-primary-foreground",
  info: "bg-info text-primary-foreground",
  success: "bg-success text-primary-foreground",
  warning: "bg-warning text-primary-foreground",
  destructive: "bg-destructive text-primary-foreground",
  muted: "bg-muted text-foreground",
};

const memberStyles = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-muted text-muted-foreground",
];

function HeaderCell({
  children,
  className = "",
  separator = true,
}: HeaderCellProps) {
  return (
    <TableHead
      className={`h-12 p-0 text-xs font-normal text-muted-foreground ${className}`}
    >
      <div className="flex h-full min-w-0 items-center">
        {separator ? (
          <Separator
            orientation="vertical"
            className="mx-3 my-3 h-5 shrink-0"
          />
        ) : null}

        <div className="min-w-0 pr-3">{children}</div>
      </div>
    </TableHead>
  );
}

export function ProjectsTable({
  projects,
  selectedProjectId,
}: ProjectsTableProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <CardContent className="min-w-0 p-0">
        <Table aria-label="Workspace projects" className="w-full table-fixed">
          <TableHeader>
            <TableRow className="h-12 border-border hover:bg-transparent">
              {/* Project — always visible */}

              <HeaderCell separator={false} className="w-auto">
                <div className="flex items-center gap-2 px-3">
                  <span>Project</span>

                  <ArrowUp
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </HeaderCell>

              {/* Status — sm+ */}

              <HeaderCell className="hidden w-28 sm:table-cell lg:w-32">
                Status
              </HeaderCell>

              {/* Members — lg+ */}

              <HeaderCell className="hidden w-28 lg:table-cell xl:w-36">
                Members
              </HeaderCell>

              {/* Progress — md+ */}

              <HeaderCell className="hidden w-36 md:table-cell lg:w-40 xl:w-44">
                Progress
              </HeaderCell>

              {/* Open tasks — 2xl+ */}

              <HeaderCell className="hidden w-24 2xl:table-cell">
                Open tasks
              </HeaderCell>

              {/* Sprint — 2xl+ */}

              <HeaderCell className="hidden w-28 2xl:table-cell">
                Sprint
              </HeaderCell>

              {/* Due date — xl+ */}

              <HeaderCell className="hidden w-32 xl:table-cell">
                Due date
              </HeaderCell>

              {/* Repository — 2xl+ */}

              <HeaderCell className="hidden w-44 2xl:table-cell">
                Repository
              </HeaderCell>

              {/* Actions — always visible */}

              <TableHead className="w-12 px-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <FolderKanban className="size-5" aria-hidden="true" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        No projects found
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Create a project to get started.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const visibleMembers = project.members.slice(0, 3);

                const remainingMembers = Math.max(
                  project.members.length - visibleMembers.length,
                  0,
                );

                const isSelected = selectedProjectId === project.id;

                const projectHref = `/workspace/projects/${project.id}`;

                return (
                  <TableRow
                    key={project.id}
                    data-state={isSelected ? "selected" : undefined}
                    className="h-16 border-border text-center transition-colors hover:bg-muted/30 data-[state=selected]:bg-primary/5"
                  >
                    {/* Project — always visible */}

                    <TableCell className="min-w-0 overflow-hidden px-3 py-2 text-start">
                      <Link
                        href={projectHref}
                        className="flex min-w-0 items-center gap-3 overflow-hidden"
                      >
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${accentStyles[project.accent]}`}
                        >
                          {project.key}
                        </div>

                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p
                            className="truncate text-sm font-medium leading-5 text-foreground"
                            title={project.name}
                          >
                            {project.name}
                          </p>

                          <div className="mt-1 flex min-w-0 items-center gap-2">
                            <span className="shrink-0 rounded-sm border border-primary/25 bg-primary/10 px-1 text-xs font-medium leading-none text-primary">
                              {project.key}
                            </span>

                            <span
                              className="hidden min-w-0 truncate text-xs text-muted-foreground sm:block"
                              title={project.description}
                            >
                              {project.description}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Status — sm+ */}

                    <TableCell className="hidden px-3 py-0 sm:table-cell">
                      <div className="flex justify-center">
                        <ProjectStatusBadge status={project.status} />
                      </div>
                    </TableCell>

                    {/* Members — lg+ */}

                    <TableCell className="hidden px-3 py-0 lg:table-cell">
                      <div className="flex items-center justify-center">
                        <div className="flex -space-x-1.5">
                          {visibleMembers.map((member, index) => (
                            <Avatar
                              key={member.id}
                              className="size-7 border-2 border-card"
                              title={member.name}
                            >
                              <AvatarFallback
                                className={`text-xs font-medium ${
                                  memberStyles[index % memberStyles.length]
                                }`}
                              >
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>

                        {remainingMembers > 0 ? (
                          <span className="ml-2 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                            +{remainingMembers}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>

                    {/* Progress — md+ */}

                    <TableCell className="hidden px-3 py-0 md:table-cell">
                      <div className="flex min-w-0 items-center gap-3">
                        <Progress
                          value={project.progress}
                          aria-label={`${project.name} progress`}
                          className="h-2 min-w-0 flex-1 rounded-full bg-muted"
                        />

                        <span className="w-9 shrink-0 text-right text-xs tabular-nums text-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Open tasks — 2xl+ */}

                    <TableCell className="hidden px-3 py-0 text-sm tabular-nums text-foreground 2xl:table-cell">
                      {project.openTasks}
                    </TableCell>

                    {/* Sprint — 2xl+ */}

                    <TableCell className="hidden px-3 py-0 2xl:table-cell">
                      <span className="whitespace-nowrap text-sm text-foreground">
                        {project.sprint}
                      </span>
                    </TableCell>

                    {/* Due date — xl+ */}

                    <TableCell className="hidden px-3 py-0 xl:table-cell">
                      <div className="flex items-center justify-center gap-2 whitespace-nowrap text-sm text-foreground">
                        <CalendarDays
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />

                        <span className="tabular-nums">{project.dueDate}</span>
                      </div>
                    </TableCell>

                    {/* Repository — 2xl+ */}

                    <TableCell className="hidden px-3 py-0 2xl:table-cell">
                      <div className="flex min-w-0 items-center justify-center gap-2">
                        <Icon
                          icon="mdi:github"
                          className="size-4 shrink-0 text-foreground"
                          aria-hidden="true"
                        />

                        <span
                          className="min-w-0 truncate text-sm font-medium text-primary"
                          title={project.repository}
                        >
                          {project.repository}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions — always visible */}

                    <TableCell className="w-12 px-1 py-0">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              />
                            }
                          >
                            <MoreHorizontal
                              className="size-4"
                              aria-hidden="true"
                            />

                            <span className="sr-only">
                              Actions for {project.name}
                            </span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="min-w-40">
                            <DropdownMenuItem
                              render={<Link href={projectHref} />}
                            >
                              <FolderOpen
                                className="size-4"
                                aria-hidden="true"
                              />
                              Open project
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Settings className="size-4" aria-hidden="true" />
                              Project settings
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Icon
                                icon="mdi:github"
                                className="size-4"
                                aria-hidden="true"
                              />
                              View repository
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
