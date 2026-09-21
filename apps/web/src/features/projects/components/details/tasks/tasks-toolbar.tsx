"use client";

import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Columns3,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type {
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "../../../types/project";

export type TaskSort =
  | "default"
  | "title-asc"
  | "title-desc"
  | "due-asc"
  | "priority";

export type TaskGroup = "none" | "status";

export type TaskColumn =
  | "status"
  | "priority"
  | "assignee"
  | "sprint"
  | "due"
  | "estimate"
  | "pr";

interface TasksToolbarProps {
  search: string;
  statusFilter: ProjectTaskStatus | "ALL";
  priorityFilter: ProjectTaskPriority | "ALL";
  sort: TaskSort;
  group: TaskGroup;
  visibleColumns: Set<TaskColumn>;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ProjectTaskStatus | "ALL") => void;
  onPriorityFilterChange: (value: ProjectTaskPriority | "ALL") => void;
  onSortChange: (value: TaskSort) => void;
  onGroupChange: (value: TaskGroup) => void;
  onColumnToggle: (column: TaskColumn) => void;
}

const statuses = [
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
] satisfies {
  value: ProjectTaskStatus;
  label: string;
  dot: string;
}[];

const priorities = [
  {
    value: "LOW",
    label: "Low",
    dot: "bg-success",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-primary",
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-destructive",
  },
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-destructive",
  },
] satisfies {
  value: ProjectTaskPriority;
  label: string;
  dot: string;
}[];

const sortOptions: {
  value: TaskSort;
  label: string;
}[] = [
  { value: "default", label: "Default" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "due-asc", label: "Due date" },
  { value: "priority", label: "Priority" },
];

const columns: {
  value: TaskColumn;
  label: string;
}[] = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
  { value: "sprint", label: "Sprint" },
  { value: "due", label: "Due date" },
  { value: "estimate", label: "Estimate" },
  { value: "pr", label: "Pull request" },
];

export function TasksToolbar({
  search,
  statusFilter,
  priorityFilter,
  sort,
  group,
  visibleColumns,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange,
  onGroupChange,
  onColumnToggle,
}: TasksToolbarProps) {
  const hasFilters = statusFilter !== "ALL" || priorityFilter !== "ALL";

  const activeSort =
    sortOptions.find((option) => option.value === sort)?.label ?? "Default";

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search project tasks..."
          className="h-10 pl-9"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 font-normal"
            />
          }
        >
          <Filter className="size-4" />
          Filter
          {hasFilters && <span className="size-2 rounded-full bg-primary" />}
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                onStatusFilterChange("ALL");
                onPriorityFilterChange("ALL");
              }}
            >
              Clear filters
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <div className="my-1 h-px bg-border" />

          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Status
          </p>

          <DropdownMenuGroup>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => onStatusFilterChange(status.value)}
              >
                <span
                  className={`size-2.5 rounded-full ${status.dot}`}
                  aria-hidden="true"
                />

                {status.label}

                {statusFilter === status.value && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <div className="my-1 h-px bg-border" />

          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Priority
          </p>

          <DropdownMenuGroup>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                onClick={() => onPriorityFilterChange(priority.value)}
              >
                <span
                  className={`size-2.5 rounded-full ${priority.dot}`}
                  aria-hidden="true"
                />

                {priority.label}

                {priorityFilter === priority.value && (
                  <Check className="ml-auto size-4" />
                )}
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
              className="h-10 gap-2 font-normal"
            />
          }
        >
          <ArrowUpDown className="size-4" />
          {sort === "default" ? "Sort" : activeSort}
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
              >
                {option.label}

                {sort === option.value && <Check className="ml-auto size-4" />}
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
              className="h-10 gap-2 font-normal"
            />
          }
        >
          {group === "status" ? "Group by Status" : "Group by"}

          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onGroupChange("none")}>
              No grouping
              {group === "none" && <Check className="ml-auto size-4" />}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onGroupChange("status")}>
              Status
              {group === "status" && <Check className="ml-auto size-4" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 font-normal"
            />
          }
        >
          <Columns3 className="size-4" />
          Columns
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.value}
                checked={visibleColumns.has(column.value)}
                onCheckedChange={() => onColumnToggle(column.value)}
                onSelect={(event) => event.preventDefault()}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="button" className="h-10 gap-2">
        <Plus className="size-4" />
        Add task
      </Button>
    </div>
  );
}
