"use client";

import { useState } from "react";

import { MoreHorizontal, Plus, Settings, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProjectDetails } from "../../types/project";

import { ProjectStatusBadge } from "../project-status-badge";

interface ProjectDetailsHeaderProps {
  project: ProjectDetails;
  onAddMember?: () => void;
  onCreate?: () => void;
  onOpenSettings?: () => void;
}

const accentStyles: Record<ProjectDetails["accent"], string> = {
  primary: "bg-primary text-primary-foreground",
  info: "bg-info text-primary-foreground",
  success: "bg-success text-primary-foreground",
  warning: "bg-warning text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  muted: "bg-muted text-foreground",
};

const memberStyles = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-muted text-muted-foreground",
];

export function ProjectDetailsHeader({
  project,
  onAddMember,
  onCreate,
  onOpenSettings,
}: ProjectDetailsHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const visibleMembers = project.members.slice(0, 4);

  const remainingMembers = Math.max(
    project.members.length - visibleMembers.length,
    0,
  );

  return (
    <div className="border-b border-border">
      <div className="flex min-w-0 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between 2xl:px-7">
        {/* =====================================================
            LEFT — PROJECT IDENTITY
        ====================================================== */}

        <div className="flex min-w-0  items-center gap-3">
          {/* Project icon */}

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold ${accentStyles[project.accent]}`}
          >
            {project.key}
          </div>

          {/* Name + metadata */}

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1">
              <h1
                className="truncate text-lg font-semibold tracking-tight text-foreground"
                title={project.name}
              >
                {project.name}
              </h1>

              {/* Favorite */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((current) => !current)}
              >
                <Star
                  className={
                    isFavorite ? "size-4 fill-warning text-warning" : "size-4"
                  }
                  aria-hidden="true"
                />
              </Button>

              {/* More */}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
                      aria-label="Project actions"
                    />
                  }
                >
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="min-w-44">
                  <DropdownMenuItem onClick={onOpenSettings}>
                    <Settings className="size-4" aria-hidden="true" />
                    Project settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Project key + status */}

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {project.key}
              </span>

              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-muted-foreground/60"
              />

              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 justify-between lg:justify-end">
            {/* Members */}

            <div className="md:flex hidden items-center">
              <div className="flex -space-x-2">
                {visibleMembers.map((member, index) => (
                  <Avatar
                    key={member.id}
                    className="size-12 border-2 border-background"
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

                {remainingMembers > 0 ? (
                  <Avatar className="size-12 border-2 border-background">
                    <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                      +{remainingMembers}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
              </div>
            </div>

            {/* Add member */}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-12 rounded-full"
              aria-label="Add project member"
              onClick={onAddMember}
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-12 md:w-32 w-full text-md rounded-md px-4"
          onClick={onCreate}
        >
          <Plus className="size-5" aria-hidden="true" />
          Create
        </Button>
      </div>
    </div>
  );
}
