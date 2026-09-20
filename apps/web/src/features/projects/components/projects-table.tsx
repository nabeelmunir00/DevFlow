import { Icon } from "@iconify/react";

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
}

const accentStyles: Record<Project["accent"], string> = {
  primary: "bg-primary text-primary-foreground",
  info: "bg-info text-primary-foreground",
  success: "bg-success text-primary-foreground",
  warning: "bg-warning text-primary-foreground",
  destructive: "bg-destructive text-primary-foreground",
  muted: "bg-muted text-foreground",
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-md border-border bg-card py-0 shadow-none">
      <CardContent className="overflow-x-auto p-0">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="h-10 border-border hover:bg-transparent">
              <TableHead className="min-w-64 px-3">
                <div className="flex items-center gap-2">
                  Project
                  <Icon icon="solar:arrow-up-linear" className="size-3.5" />
                </div>
              </TableHead>

              <TableHead className="w-32">Status</TableHead>

              <TableHead className="w-36">Members</TableHead>

              <TableHead className="w-44">Progress</TableHead>

              <TableHead className="w-24">Open tasks</TableHead>

              <TableHead className="w-24">Sprint</TableHead>

              <TableHead className="w-28">Due date</TableHead>

              <TableHead className="w-44">Repository</TableHead>

              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => {
              const visibleMembers = project.members.slice(0, 3);
              const remainingMembers =
                project.members.length - visibleMembers.length;

              return (
                <TableRow
                  key={project.id}
                  className="h-[70px] border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="px-3 py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${accentStyles[project.accent]}`}
                      >
                        {project.key}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {project.name}
                        </p>

                        <div className="mt-1 flex min-w-0 items-center gap-2">
                          <span className="rounded-sm border border-info/30 bg-info/10 px-1 text-[10px] text-info">
                            {project.key}
                          </span>

                          <span className="truncate text-xs text-muted-foreground">
                            {project.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      {visibleMembers.map((member, index) => (
                        <Avatar
                          key={member.id}
                          className="-ml-1 first:ml-0 size-7 border-2 border-card"
                          style={{
                            zIndex: visibleMembers.length - index,
                          }}
                        >
                          <AvatarFallback className="text-[10px]">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}

                      {remainingMembers > 0 ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          +{remainingMembers}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <Progress
                        value={project.progress}
                        className="h-2 flex-1"
                      />

                      <span className="w-9 text-right text-xs tabular-nums text-foreground">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm tabular-nums text-foreground">
                    {project.openTasks}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm text-foreground">
                    {project.sprint}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap text-sm text-foreground">
                      <Icon
                        icon="solar:calendar-linear"
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />

                      {project.dueDate}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon
                        icon="mdi:github"
                        className="size-5 shrink-0"
                        aria-hidden="true"
                      />

                      <span className="truncate text-sm text-primary">
                        {project.repository}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-sm text-muted-foreground"
                          />
                        }
                      >
                        <Icon icon="solar:menu-dots-bold" className="size-4" />

                        <span className="sr-only">
                          Actions for {project.name}
                        </span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open project</DropdownMenuItem>

                        <DropdownMenuItem>Project settings</DropdownMenuItem>

                        <DropdownMenuItem>View repository</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
