"use client";

import { ChevronDown, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProjectMember, ProjectTaskStatus } from "../../../types/project";

interface TasksBulkActionsProps {
  selectedCount: number;
  members: ProjectMember[];
  onStatusChange: (status: ProjectTaskStatus) => void;
  onAssigneeChange: (member: ProjectMember) => void;
  onSprintChange: (sprint: string) => void;
  onClear: () => void;
}

const statuses: {
  value: ProjectTaskStatus;
  label: string;
  dot: string;
}[] = [
  {
    value: "TODO",
    label: "To do",
    dot: "bg-muted-foreground",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    dot: "bg-primary",
  },
  {
    value: "IN_REVIEW",
    label: "In review",
    dot: "bg-warning",
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-success",
  },
];

const sprints = ["Sprint 04", "Sprint 05", "Sprint 06", "Backlog"];

export function TasksBulkActions({
  selectedCount,
  members,
  onStatusChange,
  onAssigneeChange,
  onSprintChange,
  onClear,
}: TasksBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3">
      <span className="mr-2 whitespace-nowrap text-sm font-medium text-foreground">
        {selectedCount} selected
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 bg-background font-normal"
            />
          }
        >
          Change status
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => onStatusChange(status.value)}
              >
                <span
                  className={`size-2.5 shrink-0 rounded-full ${status.dot}`}
                  aria-hidden="true"
                />

                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 bg-background font-normal"
            />
          }
        >
          Assign
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {members.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => onAssigneeChange(member)}
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-xs">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>

                <span>{member.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 bg-background font-normal"
            />
          }
        >
          Move to sprint
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {sprints.map((sprint) => (
              <DropdownMenuItem
                key={sprint}
                onClick={() => onSprintChange(sprint)}
              >
                {sprint}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto gap-2 text-muted-foreground"
        onClick={onClear}
      >
        <X className="size-4" />
        Clear
      </Button>
    </div>
  );
}
