import Link from "next/link";

import {
  CalendarDays,
  FolderOpen,
  MoreHorizontal,
  Settings,
} from "lucide-react";
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

import type { Project } from "../types/project";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectsGridProps {
  slug: string;
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

const memberStyles = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
];

export function ProjectsGrid({ slug, projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <Card className="rounded-md border-border bg-card py-0 shadow-none">
        <CardContent className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">No projects found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {projects.map((project) => {
        const visibleMembers = project.members.slice(0, 3);

        const remainingMembers = Math.max(
          project.members.length - visibleMembers.length,
          0,
        );

        const projectHref = `/workspace/${slug}/projects/${project.id}`;

        return (
          <Card
            key={project.id}
            className="min-w-0 gap-0 rounded-md border-border bg-card py-0 shadow-none transition-colors hover:bg-muted/20"
          >
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={projectHref}
                  className="flex min-w-0 items-start gap-3"
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${accentStyles[project.accent]}`}
                  >
                    {project.key}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="truncate text-sm font-semibold text-foreground"
                      title={project.name}
                    >
                      {project.name}
                    </h3>

                    <p
                      className="mt-1 truncate text-xs text-muted-foreground"
                      title={project.description}
                    >
                      {project.description}
                    </p>
                  </div>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-sm text-muted-foreground"
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />

                    <span className="sr-only">Actions for {project.name}</span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={projectHref} />}>
                      <FolderOpen className="size-4" aria-hidden="true" />
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

              {/* Status */}
              <div className="mt-4">
                <ProjectStatusBadge status={project.status} />
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>

                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {project.progress}%
                  </span>
                </div>

                <Progress
                  value={project.progress}
                  aria-label={`${project.name} progress`}
                  className="h-2"
                />
              </div>

              {/* Project meta */}
              <div className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Open tasks</p>

                  <p className="mt-1 text-sm font-medium tabular-nums text-foreground">
                    {project.openTasks}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Sprint</p>

                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {project.sprint}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Due</p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <CalendarDays
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />

                    <span className="truncate">{project.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center">
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
                    <span className="ml-2 text-xs text-muted-foreground">
                      +{remainingMembers}
                    </span>
                  ) : null}
                </div>

                <div className="flex min-w-0 items-center gap-2">
                  <Icon
                    icon="mdi:github"
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <span
                    className="truncate text-xs font-medium text-primary"
                    title={project.repository}
                  >
                    {project.repository}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
