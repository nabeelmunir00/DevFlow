"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MyWorkTaskRow } from "./my-work-task-row";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskGroup,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../types/my-work";

interface TaskGroupProps {
  group: MyWorkTaskGroup;
  tasks: MyWorkTask[];
  projects: MyWorkProject[];
  selectedTaskIds: Set<string>;

  onTaskSelectedChange: (taskId: string, selected: boolean) => void;

  onMarkComplete: (taskId: string) => void;

  onChangePriority: (taskId: string, priority: MyWorkTaskPriority) => void;

  onMoveTask: (taskId: string, status: MyWorkTaskStatus) => void;

  onDeleteTask: (taskId: string) => void;
}

const groupConfig: Record<
  MyWorkTaskGroup,
  {
    label: string;
    indicatorClassName: string;
    textClassName: string;
  }
> = {
  OVERDUE: {
    label: "Overdue",
    indicatorClassName: "border-destructive text-destructive",
    textClassName: "text-destructive",
  },
  TODAY: {
    label: "Today",
    indicatorClassName: "border-success text-success",
    textClassName: "text-success",
  },
  UPCOMING: {
    label: "Upcoming",
    indicatorClassName: "border-muted-foreground text-muted-foreground",
    textClassName: "text-foreground",
  },
};

export function TaskGroup({
  group,
  tasks,
  projects,
  selectedTaskIds,
  onTaskSelectedChange,
  onMarkComplete,
  onChangePriority,
  onMoveTask,
  onDeleteTask,
}: TaskGroupProps) {
  const [expanded, setExpanded] = useState(true);

  const config = groupConfig[group];

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex h-10 w-full items-center gap-2 px-3 text-left transition-colors hover:bg-secondary/40"
      >
        {expanded ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}

        <Circle className={cn("size-4", config.indicatorClassName)} />

        <span className={cn("text-sm font-medium", config.textClassName)}>
          {config.label} ({tasks.length})
        </span>
      </button>

      {expanded &&
        tasks.map((task) => (
          <MyWorkTaskRow
            key={task.id}
            task={task}
            project={projects.find((project) => project.id === task.projectId)}
            selected={selectedTaskIds.has(task.id)}
            onSelectedChange={onTaskSelectedChange}
            onMarkComplete={onMarkComplete}
            onChangePriority={onChangePriority}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
    </div>
  );
}
