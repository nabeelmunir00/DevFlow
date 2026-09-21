"use client";

import { useMemo, useState } from "react";

import type {
  ProjectDetails,
  ProjectMember,
  ProjectTaskPriority,
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

import { TaskViewTabs, type TaskView } from "./task-view-tabs";
import { TasksBulkActions } from "./tasks-bulk-actions";
import { TasksTable } from "./tasks-table";
import { TasksToolbar, type TaskColumn, type TaskSort } from "./tasks-toolbar";

interface ProjectTasksProps {
  project: ProjectDetails;
}

const defaultColumns: TaskColumn[] = [
  "status",
  "priority",
  "assignee",
  "sprint",
  "due",
  "estimate",
  "pr",
];

const priorityOrder: Record<ProjectTaskPriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<ProjectTaskSummary[]>(project.recentTasks);

  const [view, setView] = useState<TaskView>("all");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<ProjectTaskStatus | "ALL">(
    "ALL",
  );

  const [priorityFilter, setPriorityFilter] = useState<
    ProjectTaskPriority | "ALL"
  >("ALL");

  const [sort, setSort] = useState<TaskSort>("default");

  const [visibleColumns, setVisibleColumns] = useState<Set<TaskColumn>>(
    new Set(defaultColumns),
  );

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const matchesView =
        view === "all" ||
        (view === "open" && task.status !== "DONE") ||
        (view === "completed" && task.status === "DONE");

      const matchesSearch =
        !query ||
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.assignee.name.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      return matchesView && matchesSearch && matchesStatus && matchesPriority;
    });

    if (sort === "title-asc") {
      return result.toSorted((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "title-desc") {
      return result.toSorted((a, b) => b.title.localeCompare(a.title));
    }

    if (sort === "due-asc") {
      return result.toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    if (sort === "priority") {
      return result.toSorted(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    }

    return result;
  }, [tasks, search, view, statusFilter, priorityFilter, sort]);

  const openCount = useMemo(
    () => tasks.filter((task) => task.status !== "DONE").length,
    [tasks],
  );

  const completedCount = tasks.length - openCount;

  function handleTaskSelection(taskId: string, selected: boolean) {
    setSelectedTaskIds((current) => {
      const next = new Set(current);

      if (selected) {
        next.add(taskId);
      } else {
        next.delete(taskId);
      }

      return next;
    });
  }

  function handleSelectAll(selected: boolean) {
    setSelectedTaskIds((current) => {
      const next = new Set(current);

      filteredTasks.forEach((task) => {
        if (selected) {
          next.add(task.id);
        } else {
          next.delete(task.id);
        }
      });

      return next;
    });
  }

  function handleTaskStatusChange(taskId: string, status: ProjectTaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );
  }

  function handleBulkStatusChange(status: ProjectTaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );
  }

  function handleAssigneeChange(member: ProjectMember) {
    setTasks((current) =>
      current.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              assignee: member,
            }
          : task,
      ),
    );
  }

  function handleSprintChange(sprint: string) {
    setTasks((current) =>
      current.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              sprint,
            }
          : task,
      ),
    );
  }

  function handleColumnToggle(column: TaskColumn) {
    setVisibleColumns((current) => {
      const next = new Set(current);

      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }

      return next;
    });
  }

  function handleClearSelection() {
    setSelectedTaskIds(new Set());
  }

  return (
    <div className="min-w-0 space-y-4">
      <TasksToolbar
        search={search}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sort={sort}
        visibleColumns={visibleColumns}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onSortChange={setSort}
        onColumnToggle={handleColumnToggle}
      />

      <TaskViewTabs
        value={view}
        onValueChange={setView}
        counts={{
          all: tasks.length,
          open: openCount,
          completed: completedCount,
        }}
      />

      <TasksBulkActions
        selectedCount={selectedTaskIds.size}
        members={project.members}
        onStatusChange={handleBulkStatusChange}
        onAssigneeChange={handleAssigneeChange}
        onSprintChange={handleSprintChange}
        onClear={handleClearSelection}
      />

      <TasksTable
        tasks={filteredTasks}
        visibleColumns={visibleColumns}
        selectedTaskIds={selectedTaskIds}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskSelectionChange={handleTaskSelection}
        onSelectAllChange={handleSelectAll}
      />
    </div>
  );
}
