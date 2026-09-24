"use client";

import { useMemo, useState } from "react";

import type {
  MyWorkLayout,
  MyWorkTask,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
  MyWorkView,
} from "../types/my-work";

import {
  demoMyWorkProgress,
  demoMyWorkProjects,
  demoMyWorkTasks,
  demoTodayEvents,
  myWorkTabCounts,
} from "./data/demo-my-work";
import { BulkTaskActions } from "./bulk-task-actions";
import { MyProgressCard } from "./my-progress-card";
import { MyProjectsCard } from "./my-projects-card";
import { MyWorkHeader } from "./my-work-header";
import { MyWorkProgress } from "./my-work-progress";
import { MyWorkTabs } from "./my-work-tabs";
import { MyWorkTaskList } from "./my-work-task-list";
import {
  MyWorkToolbar,
  type PriorityFilter,
  type StatusFilter,
} from "./my-work-toolbar";
import { TodayCard } from "./today-card";

export function MyWorkPage() {
  const [view, setView] = useState<MyWorkView>("assigned");

  const [layout, setLayout] = useState<MyWorkLayout>("list");

  const [status, setStatus] = useState<StatusFilter>("ALL");

  const [priority, setPriority] = useState<PriorityFilter>("ALL");

  const [projectId, setProjectId] = useState("ALL");

  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<MyWorkTask[]>(demoMyWorkTasks);

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(() => {
    const initiallySelected = demoMyWorkTasks
      .filter((task) => task.selected)
      .map((task) => task.id);

    return new Set(initiallySelected);
  });
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus = status === "ALL" || task.status === status;

      const matchesPriority = priority === "ALL" || task.priority === priority;

      const matchesProject =
        projectId === "ALL" || task.projectId === projectId;

      const project = demoMyWorkProjects.find(
        (project) => project.id === task.projectId,
      );

      const matchesSearch =
        !query ||
        task.key.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        project?.name.toLowerCase().includes(query) ||
        project?.shortName.toLowerCase().includes(query);

      return (
        matchesStatus && matchesPriority && matchesProject && matchesSearch
      );
    });
  }, [tasks, search, status, priority, projectId]);

  function handleViewChange(nextView: MyWorkView) {
    setView(nextView);

    // Demo data currently represents
    // "Assigned to me".
    // Later fetch/filter data for each view.
    setSelectedTaskIds(new Set());
  }

  function handleLayoutChange(nextLayout: MyWorkLayout) {
    setLayout(nextLayout);
  }

  function handleCreateTask() {
    // Connect shared Add Task dialog later.
  }

  function handleMarkComplete() {
    if (selectedTaskIds.size === 0) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              status: "DONE",
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleChangePriority(priority: MyWorkTaskPriority) {
    if (selectedTaskIds.size === 0) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              priority,
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleMoveTasks(status: MyWorkTaskStatus) {
    if (selectedTaskIds.size === 0) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleStartFocus() {
    // Focus mode integration later.
  }

  function handleTaskMarkComplete(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "DONE",
            }
          : task,
      ),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);
      next.delete(taskId);
      return next;
    });
  }

  function handleTaskPriorityChange(
    taskId: string,
    priority: MyWorkTaskPriority,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority,
            }
          : task,
      ),
    );
  }

  function handleTaskMove(taskId: string, status: MyWorkTaskStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task,
      ),
    );
  }

  function handleTaskDelete(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);
      next.delete(taskId);
      return next;
    });
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8">
        <MyWorkHeader onCreateTask={handleCreateTask} />

        <MyWorkTabs
          value={view}
          layout={layout}
          counts={myWorkTabCounts}
          onValueChange={handleViewChange}
          onLayoutChange={handleLayoutChange}
        />

        <div className="grid min-w-0 gap-5 pt-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
          {/* Main work area */}
          <main className="min-w-0">
            <MyWorkProgress
              completed={demoMyWorkProgress.completed}
              total={demoMyWorkProgress.totalPlanned}
              percentage={demoMyWorkProgress.percentage}
            />

            <MyWorkToolbar
              projects={demoMyWorkProjects}
              status={status}
              priority={priority}
              projectId={projectId}
              search={search}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onProjectChange={setProjectId}
              onSearchChange={setSearch}
            />

            {layout === "list" ? (
              <MyWorkTaskList
                tasks={filteredTasks}
                projects={demoMyWorkProjects}
                selectedTaskIds={selectedTaskIds}
                onSelectedTaskIdsChange={setSelectedTaskIds}
                onMarkComplete={handleTaskMarkComplete}
                onChangePriority={handleTaskPriorityChange}
                onMoveTask={handleTaskMove}
                onDeleteTask={handleTaskDelete}
              />
            ) : (
              <BoardPlaceholder />
            )}

            <BulkTaskActions
              selectedCount={selectedTaskIds.size}
              onClearSelection={() => setSelectedTaskIds(new Set())}
              onMarkComplete={handleMarkComplete}
              onChangePriority={handleChangePriority}
              onMoveTasks={handleMoveTasks}
            />
          </main>

          {/* Right sidebar */}
          <aside className="min-w-0 space-y-4">
            <TodayCard
              events={demoTodayEvents}
              onStartFocus={handleStartFocus}
            />

            <MyProgressCard progress={demoMyWorkProgress} />

            <MyProjectsCard projects={demoMyWorkProjects} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function BoardPlaceholder() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-lg border border-border bg-card px-5 py-10">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Board view</p>

        <p className="mt-1 text-xs text-muted-foreground">
          My Work board view will be added separately.
        </p>
      </div>
    </div>
  );
}
