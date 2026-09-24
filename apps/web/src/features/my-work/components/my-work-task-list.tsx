"use client";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskGroup,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../types/my-work";

import { Checkbox } from "@/components/ui/checkbox";

import { TaskGroup } from "./task-group";

interface MyWorkTaskListProps {
  tasks: MyWorkTask[];
  projects: MyWorkProject[];
  selectedTaskIds: Set<string>;

  onSelectedTaskIdsChange: (ids: Set<string>) => void;

  onMarkComplete: (taskId: string) => void;

  onChangePriority: (taskId: string, priority: MyWorkTaskPriority) => void;

  onMoveTask: (taskId: string, status: MyWorkTaskStatus) => void;

  onDeleteTask: (taskId: string) => void;
}

const groupOrder: MyWorkTaskGroup[] = ["OVERDUE", "TODAY", "UPCOMING"];

export function MyWorkTaskList({
  tasks,
  projects,
  selectedTaskIds,
  onSelectedTaskIdsChange,
  onMarkComplete,
  onChangePriority,
  onMoveTask,
  onDeleteTask,
}: MyWorkTaskListProps) {
  const allSelected =
    tasks.length > 0 && tasks.every((task) => selectedTaskIds.has(task.id));

  const someSelected = selectedTaskIds.size > 0 && !allSelected;

  function handleSelectAll(checked: boolean) {
    if (!checked) {
      onSelectedTaskIdsChange(new Set());
      return;
    }

    onSelectedTaskIdsChange(new Set(tasks.map((task) => task.id)));
  }

  function handleTaskSelectedChange(taskId: string, selected: boolean) {
    const next = new Set(selectedTaskIds);

    if (selected) {
      next.add(taskId);
    } else {
      next.delete(taskId);
    }

    onSelectedTaskIdsChange(next);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center bg-secondary/30 md:grid-cols-[2.5rem_minmax(14rem,1fr)_9rem_8.5rem_6.5rem_4.5rem_2.5rem]">
        <div className="flex h-10 items-center justify-center">
          <Checkbox
            checked={
              allSelected ? true : someSelected ? "indeterminate" : false
            }
            onCheckedChange={(checked) => handleSelectAll(checked === true)}
            aria-label="Select all tasks"
          />
        </div>

        <div className="px-2 text-xs font-medium text-muted-foreground">
          Task
        </div>

        <div className="hidden border-l border-border px-2 text-xs font-medium text-muted-foreground md:block">
          Project
        </div>

        <div className="hidden border-l border-border px-2 text-xs font-medium text-muted-foreground md:block">
          Status
        </div>

        <div className="hidden border-l border-border px-2 text-xs font-medium text-muted-foreground md:block">
          Due date
        </div>

        <div className="hidden border-l border-border px-2 text-xs font-medium text-muted-foreground md:block">
          Estimate
        </div>

        <div />
      </div>

      {tasks.length > 0 ? (
        groupOrder.map((group) => (
          <TaskGroup
            key={group}
            group={group}
            tasks={tasks.filter((task) => task.group === group)}
            projects={projects}
            selectedTaskIds={selectedTaskIds}
            onTaskSelectedChange={handleTaskSelectedChange}
            onMarkComplete={onMarkComplete}
            onChangePriority={onChangePriority}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
          />
        ))
      ) : (
        <div className="flex min-h-48 items-center justify-center px-5 py-10">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              No tasks found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try changing your filters or search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
