"use client";

import { useMemo, useState } from "react";

import type {
  ProjectDetails,
  ProjectTaskSummary,
} from "../../../types/project";
import { TaskView, TaskViewTabs } from "./task-view-tabs";
import { TasksTable } from "./tasks-table";
import { TasksToolbar } from "./tasks-toolbar";

interface ProjectTasksProps {
  project: ProjectDetails;
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [view, setView] = useState<TaskView>("all");
  const [search, setSearch] = useState("");

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

      <TasksTable tasks={tasks} />
    </div>
  );
}
