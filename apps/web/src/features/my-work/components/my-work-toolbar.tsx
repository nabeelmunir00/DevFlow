"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  MyWorkProject,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../types/my-work";

export type StatusFilter = "ALL" | MyWorkTaskStatus;

export type PriorityFilter = "ALL" | MyWorkTaskPriority;

interface MyWorkToolbarProps {
  projects: MyWorkProject[];
  status: StatusFilter;
  priority: PriorityFilter;
  projectId: string;
  search: string;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onProjectChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function MyWorkToolbar({
  projects,
  status,
  priority,
  projectId,
  search,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onSearchChange,
}: MyWorkToolbarProps) {
  return (
    <div className="grid gap-2 pb-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr_1.8fr]">
      <Select
        value={status}
        onValueChange={(value) => {
          if (!value) return;

          onStatusChange(value as StatusFilter);
        }}
      >
        <SelectTrigger className="w-full">
          <span className="text-muted-foreground">Status</span>

          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>

          <SelectItem value="TODO">Todo</SelectItem>

          <SelectItem value="IN_PROGRESS">In progress</SelectItem>

          <SelectItem value="IN_REVIEW">In review</SelectItem>

          <SelectItem value="BLOCKED">Blocked</SelectItem>

          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={priority}
        onValueChange={(value) => {
          if (!value) return;

          onPriorityChange(value as PriorityFilter);
        }}
      >
        <SelectTrigger className="w-full">
          <span className="text-muted-foreground">Priority</span>

          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>

          <SelectItem value="URGENT">Urgent</SelectItem>

          <SelectItem value="HIGH">High</SelectItem>

          <SelectItem value="MEDIUM">Medium</SelectItem>

          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={projectId}
        onValueChange={(value) => {
          if (!value) return;

          onProjectChange(value);
        }}
      >
        <SelectTrigger className="w-full">
          <span className="text-muted-foreground">Project</span>

          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>

          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search my tasks..."
          className="pl-9"
        />
      </div>
    </div>
  );
}
