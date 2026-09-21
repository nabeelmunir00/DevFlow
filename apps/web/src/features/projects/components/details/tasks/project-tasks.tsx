"use client";

import { useMemo, useState } from "react";

import type { ProjectDetails } from "../../../types/project";

import { TaskViewTabs, type TaskView } from "./task-view-tabs";
import { TasksBulkActions } from "./tasks-bulk-actions";
import { TasksTable } from "./tasks-table";
import { TasksToolbar } from "./tasks-toolbar";

interface ProjectTasksProps {
  project: ProjectDetails;
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [view, setView] = useState<TaskView>("all");
  const [search, setSearch] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );

  const tasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return project.recentTasks.filter((task) => {
      const matchesView =
        view === "all" ||
        (view === "open" && task.status !== "DONE") ||
        (view === "completed" && task.status === "DONE");

      const matchesSearch =
        !query ||
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query);

      return matchesView && matchesSearch;
    });
  }, [project.recentTasks, search, view]);

  const openCount = project.recentTasks.filter(
    (task) => task.status !== "DONE",
  ).length;

  const completedCount = project.recentTasks.filter(
    (task) => task.status === "DONE",
  ).length;

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

      tasks.forEach((task) => {
        if (selected) {
          next.add(task.id);
        } else {
          next.delete(task.id);
        }
      });

      return next;
    });
  }

  function handleClearSelection() {
    setSelectedTaskIds(new Set());
  }

  return (
    <div className="min-w-0 space-y-4">
      <TasksToolbar search={search} onSearchChange={setSearch} />

      <TaskViewTabs
        value={view}
        onValueChange={setView}
        counts={{
          all: project.recentTasks.length,
          open: openCount,
          completed: completedCount,
        }}
      />

      <TasksBulkActions
        selectedCount={selectedTaskIds.size}
        onClear={handleClearSelection}
      />

      <TasksTable
        tasks={tasks}
        selectedTaskIds={selectedTaskIds}
        onTaskSelectionChange={handleTaskSelection}
        onSelectAllChange={handleSelectAll}
      />
    </div>
  );
}
