"use client";

import { ChevronDown, Ellipsis, GitBranch } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  ProjectTaskPriority,
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

import type { TaskColumn, TaskGroup } from "./tasks-toolbar";
import { TaskStatusSelect } from "./task-status-select";

interface TasksTableProps {
  tasks: ProjectTaskSummary[];
  group: TaskGroup;
  visibleColumns: Set<TaskColumn>;
  selectedTaskIds: Set<string>;
  onTaskStatusChange: (taskId: string, status: ProjectTaskStatus) => void;
  onTaskSelectionChange: (taskId: string, selected: boolean) => void;
  onSelectAllChange: (selected: boolean) => void;
}

interface TaskRowProps {
  task: ProjectTaskSummary;
  visibleColumns: Set<TaskColumn>;
  selected: boolean;
  onStatusChange: (taskId: string, status: ProjectTaskStatus) => void;
  onSelectionChange: (taskId: string, selected: boolean) => void;
}

const priorityStyles: Record<
  ProjectTaskPriority,
  { label: string; dot: string }
> = {
  LOW: {
    label: "Low",
    dot: "bg-success",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-primary",
  },
  HIGH: {
    label: "High",
    dot: "bg-destructive",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-destructive",
  },
};

const statusGroups: {
  status: ProjectTaskStatus;
  label: string;
  dot: string;
}[] = [
  {
    status: "TODO",
    label: "To do",
    dot: "bg-muted-foreground",
  },
  {
    status: "IN_PROGRESS",
    label: "In progress",
    dot: "bg-primary",
  },
  {
    status: "IN_REVIEW",
    label: "In review",
    dot: "bg-warning",
  },
  {
    status: "DONE",
    label: "Done",
    dot: "bg-success",
  },
];

function TaskRow({
  task,
  visibleColumns,
  selected,
  onStatusChange,
  onSelectionChange,
}: TaskRowProps) {
  const priority = priorityStyles[task.priority];

  return (
    <TableRow
      data-state={selected ? "selected" : undefined}
      className={selected ? "bg-primary/5 hover:bg-primary/10" : undefined}
    >
      <TableCell className="text-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            onSelectionChange(task.id, checked === true)
          }
          aria-label={`Select ${task.title}`}
        />
      </TableCell>

      <TableCell>
        <button
          type="button"
          className="font-medium text-primary hover:underline"
        >
          {task.id}
        </button>
      </TableCell>

      <TableCell className="max-w-64">
        <span className="block truncate font-medium text-foreground">
          {task.title}
        </span>
      </TableCell>

      {visibleColumns.has("status") && (
        <TableCell>
          <TaskStatusSelect
            value={task.status}
            onValueChange={(status) => onStatusChange(task.id, status)}
          />
        </TableCell>
      )}

      {visibleColumns.has("priority") && (
        <TableCell>
          <div className="flex items-center gap-2">
            <span
              className={`size-2.5 shrink-0 rounded-full ${priority.dot}`}
              aria-hidden="true"
            />
            <span>{priority.label}</span>
          </div>
        </TableCell>
      )}

      {visibleColumns.has("assignee") && (
        <TableCell>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>

            <span className="truncate">{task.assignee.name}</span>
          </div>
        </TableCell>
      )}

      {visibleColumns.has("sprint") && (
        <TableCell className="hidden whitespace-nowrap lg:table-cell">
          {task.sprint ?? "—"}
        </TableCell>
      )}

      {visibleColumns.has("due") && (
        <TableCell className="hidden whitespace-nowrap md:table-cell">
          {task.dueDate}
        </TableCell>
      )}

      {visibleColumns.has("estimate") && (
        <TableCell className="hidden whitespace-nowrap xl:table-cell">
          {task.estimate ?? "—"}
        </TableCell>
      )}

      {visibleColumns.has("pr") && (
        <TableCell className="hidden lg:table-cell">
          {task.pullRequest ? (
            <button
              type="button"
              className="flex items-center gap-1.5 text-primary hover:underline"
            >
              <GitBranch className="size-4" />#{task.pullRequest}
            </button>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      )}

      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          aria-label={`More options for ${task.title}`}
        >
          <Ellipsis className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function TasksTable({
  tasks,
  group,
  visibleColumns,
  selectedTaskIds,
  onTaskStatusChange,
  onTaskSelectionChange,
  onSelectAllChange,
}: TasksTableProps) {
  const selectedVisibleCount = tasks.reduce(
    (count, task) => (selectedTaskIds.has(task.id) ? count + 1 : count),
    0,
  );

  const allSelected = tasks.length > 0 && selectedVisibleCount === tasks.length;

  const partiallySelected = selectedVisibleCount > 0 && !allSelected;

  const selectAllState = allSelected
    ? true
    : partiallySelected
      ? "indeterminate"
      : false;

  const columnCount = 4 + visibleColumns.size;

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={selectAllState}
                onCheckedChange={(checked) =>
                  onSelectAllChange(checked === true)
                }
                aria-label="Select all visible tasks"
              />
            </TableHead>

            <TableHead className="w-24">Key</TableHead>

            <TableHead>Title</TableHead>

            {visibleColumns.has("status") && (
              <TableHead className="w-36">Status</TableHead>
            )}

            {visibleColumns.has("priority") && (
              <TableHead className="w-28">Priority</TableHead>
            )}

            {visibleColumns.has("assignee") && (
              <TableHead className="w-44">Assignee</TableHead>
            )}

            {visibleColumns.has("sprint") && (
              <TableHead className="hidden w-28 lg:table-cell">
                Sprint
              </TableHead>
            )}

            {visibleColumns.has("due") && (
              <TableHead className="hidden w-24 md:table-cell">Due</TableHead>
            )}

            {visibleColumns.has("estimate") && (
              <TableHead className="hidden w-24 xl:table-cell">
                Estimate
              </TableHead>
            )}

            {visibleColumns.has("pr") && (
              <TableHead className="hidden w-24 lg:table-cell">PR</TableHead>
            )}

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-32 text-center text-muted-foreground"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          )}

          {tasks.length > 0 &&
            group === "none" &&
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                visibleColumns={visibleColumns}
                selected={selectedTaskIds.has(task.id)}
                onStatusChange={onTaskStatusChange}
                onSelectionChange={onTaskSelectionChange}
              />
            ))}

          {tasks.length > 0 &&
            group === "status" &&
            statusGroups.map((statusGroup) => {
              const groupTasks = tasks.filter(
                (task) => task.status === statusGroup.status,
              );

              if (groupTasks.length === 0) {
                return null;
              }

              return (
                <>
                  <TableRow
                    key={`${statusGroup.status}-header`}
                    className="bg-muted/40 hover:bg-muted/40"
                  >
                    <TableCell colSpan={columnCount} className="h-10 py-2">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="size-4 text-muted-foreground" />

                        <span
                          className={`size-2.5 rounded-full ${statusGroup.dot}`}
                          aria-hidden="true"
                        />

                        <span className="text-sm font-medium text-foreground">
                          {statusGroup.label}
                        </span>

                        <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs tabular-nums text-muted-foreground">
                          {groupTasks.length}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {groupTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      visibleColumns={visibleColumns}
                      selected={selectedTaskIds.has(task.id)}
                      onStatusChange={onTaskStatusChange}
                      onSelectionChange={onTaskSelectionChange}
                    />
                  ))}
                </>
              );
            })}
        </TableBody>
      </Table>

      <div className="flex min-h-14 items-center justify-between border-t border-border px-4">
        <p className="text-sm text-muted-foreground">
          Showing {tasks.length} tasks
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            disabled
          >
            <span aria-hidden="true">‹</span>
            <span className="sr-only">Previous page</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 border-primary bg-primary/10 text-primary"
          >
            1
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            2
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            3
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
          >
            <span aria-hidden="true">›</span>
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
