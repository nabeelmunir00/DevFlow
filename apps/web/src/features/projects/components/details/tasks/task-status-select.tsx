"use client";

import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProjectTaskStatus } from "../../../types/project";

interface TaskStatusSelectProps {
  value: ProjectTaskStatus;
  onValueChange?: (value: ProjectTaskStatus) => void;
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

export function TaskStatusSelect({
  value,
  onValueChange,
}: TaskStatusSelectProps) {
  const current =
    statuses.find((status) => status.value === value) ?? statuses[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-foreground transition-colors hover:bg-muted"
          />
        }
      >
        <span
          className={`size-2.5 shrink-0 rounded-full ${current.dot}`}
          aria-hidden="true"
        />

        <span className="whitespace-nowrap">{current.label}</span>

        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => onValueChange?.(status.value)}
          >
            <span
              className={`size-2.5 rounded-full ${status.dot}`}
              aria-hidden="true"
            />

            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
