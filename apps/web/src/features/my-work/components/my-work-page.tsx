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
import { DeleteTaskDialog } from "./delete-task-dialog";
import { MyWorkBoard } from "./board/my-work-board";

export function MyWorkPage() {
  const [view, setView] = useState<MyWorkView>("assigned");

  const [layout, setLayout] = useState<MyWorkLayout>("list");

  const [status, setStatus] = useState<StatusFilter>("ALL");

  const [priority, setPriority] = useState<PriorityFilter>("ALL");

  const [projectId, setProjectId] = useState("ALL");

  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<MyWorkTask[]>(demoMyWorkTasks);

  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(() => {
    const initiallySelected = demoMyWorkTasks
      .filter((task) => task.selected)
      .map((task) => task.id);

    return new Set(initiallySelected);
  });

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesView = task.views.includes(view);
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
        matchesView &&
        matchesStatus &&
        matchesPriority &&
        matchesProject &&
        matchesSearch
      );
    });
  }, [tasks, search, status, priority, projectId, view]);

  const taskToDelete = useMemo(
    () => tasks.find((task) => task.id === taskToDeleteId),
    [tasks, taskToDeleteId],
  );

  const tabCounts = useMemo(
    () => ({
      assigned: tasks.filter((task) => task.views.includes("assigned")).length,

      created: tasks.filter((task) => task.views.includes("created")).length,

      following: tasks.filter((task) => task.views.includes("following"))
        .length,
    }),
    [tasks],
  );

  const plannedProgress = useMemo(() => {
    const assignedTasks = tasks.filter((task) =>
      task.views.includes("assigned"),
    );

    const plannedTasks = assignedTasks.filter((task) => task.planned);

    const completedTasks = plannedTasks.filter(
      (task) => task.status === "DONE",
    );

    const percentage =
      plannedTasks.length === 0
        ? 0
        : Math.round((completedTasks.length / plannedTasks.length) * 100);

    return {
      completed: completedTasks.length,
      total: plannedTasks.length,
      percentage,
    };
  }, [tasks]);

  function handleViewChange(nextView: MyWorkView) {
    setView(nextView);
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
    setTaskToDeleteId(taskId);
  }

  function confirmTaskDelete() {
    if (!taskToDeleteId) return;

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskToDeleteId),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);

      next.delete(taskToDeleteId);

      return next;
    });

    setTaskToDeleteId(null);
  }

  function confirmBulkDelete() {
    if (selectedTaskIds.size === 0) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => !selectedTaskIds.has(task.id)),
    );

    setSelectedTaskIds(new Set());
    setBulkDeleteOpen(false);
  }
  function handleToggleTaskPlan(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              planned: !task.planned,
            }
          : task,
      ),
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8">
        <MyWorkHeader onCreateTask={handleCreateTask} />

        <MyWorkTabs
          value={view}
          layout={layout}
          counts={tabCounts}
          onValueChange={handleViewChange}
          onLayoutChange={handleLayoutChange}
        />

        <div className="grid min-w-0 gap-5 pt-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
          {/* Main work area */}
          <main className="min-w-0">
            <MyWorkProgress
              completed={plannedProgress.completed}
              total={plannedProgress.total}
              percentage={plannedProgress.percentage}
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
                onTogglePlan={handleToggleTaskPlan}
                onDeleteTask={handleTaskDelete}
              />
            ) : (
              <MyWorkBoard
                tasks={filteredTasks}
                projects={demoMyWorkProjects}
                onMarkComplete={handleTaskMarkComplete}
                onChangePriority={handleTaskPriorityChange}
                onMoveTask={handleTaskMove}
                onDeleteTask={handleTaskDelete}
              />
            )}
            <BulkTaskActions
              selectedCount={selectedTaskIds.size}
              onClearSelection={() => setSelectedTaskIds(new Set())}
              onMarkComplete={handleMarkComplete}
              onChangePriority={handleChangePriority}
              onMoveTasks={handleMoveTasks}
              onDelete={() => setBulkDeleteOpen(true)}
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
      <DeleteTaskDialog
        open={taskToDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTaskToDeleteId(null);
          }
        }}
        taskKey={taskToDelete?.key}
        taskTitle={taskToDelete?.title}
        onConfirm={confirmTaskDelete}
      />

      <DeleteTaskDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        taskCount={selectedTaskIds.size}
        onConfirm={confirmBulkDelete}
      />
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
