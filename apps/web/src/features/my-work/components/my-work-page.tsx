"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  FocusSessionState,
  MyWorkLayout,
  MyWorkTask,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
  MyWorkView,
} from "../types/my-work";

import { MyWorkBoard } from "./board/my-work-board";
import { BulkTaskActions } from "./bulk-task-actions";
import {
  demoMyWorkProgress,
  demoMyWorkProjects,
  demoMyWorkTasks,
  demoTodayEvents,
} from "./data/demo-my-work";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { FocusSession } from "./focus/focus-session";
import { StartFocusDialog } from "./focus/start-focus-dialog";
import { StopFocusDialog } from "./focus/stop-focus-dialog";
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

  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [focusDialogOpen, setFocusDialogOpen] = useState(false);

  const [stopFocusDialogOpen, setStopFocusDialogOpen] = useState(false);

  const [focusSession, setFocusSession] = useState<FocusSessionState | null>(
    null,
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

      const searchableText = [
        task.key,
        task.title,
        project?.name,
        project?.shortName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return (
        matchesView &&
        matchesStatus &&
        matchesPriority &&
        matchesProject &&
        matchesSearch
      );
    });
  }, [tasks, view, status, priority, projectId, search]);

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

  const focusedTask = useMemo(() => {
    if (!focusSession) {
      return undefined;
    }

    return tasks.find((task) => task.id === focusSession.taskId);
  }, [tasks, focusSession]);

  useEffect(() => {
    if (!focusSession) {
      setElapsedSeconds(0);
      return;
    }

    function calculateElapsed() {
      if (focusSession.status === "PAUSED") {
        return focusSession.accumulatedSeconds;
      }

      const currentSessionSeconds = Math.floor(
        (Date.now() - focusSession.startedAt) / 1000,
      );

      return focusSession.accumulatedSeconds + currentSessionSeconds;
    }

    setElapsedSeconds(calculateElapsed());

    if (focusSession.status === "PAUSED") {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [focusSession]);

  useEffect(() => {
    if (focusSession && !focusedTask) {
      setFocusSession(null);
      setStopFocusDialogOpen(false);
    }
  }, [focusSession, focusedTask]);

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
    if (selectedTaskIds.size === 0) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              status: "DONE" as const,
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleChangePriority(nextPriority: MyWorkTaskPriority) {
    if (selectedTaskIds.size === 0) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              priority: nextPriority,
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleMoveTasks(nextStatus: MyWorkTaskStatus) {
    if (selectedTaskIds.size === 0) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        selectedTaskIds.has(task.id)
          ? {
              ...task,
              status: nextStatus,
            }
          : task,
      ),
    );

    setSelectedTaskIds(new Set());
  }

  function handleTaskMarkComplete(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "DONE" as const,
            }
          : task,
      ),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);

      next.delete(taskId);

      return next;
    });

    if (focusSession?.taskId === taskId) {
      setFocusSession(null);
      setStopFocusDialogOpen(false);
    }
  }

  function handleTaskPriorityChange(
    taskId: string,
    nextPriority: MyWorkTaskPriority,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority: nextPriority,
            }
          : task,
      ),
    );
  }

  function handleTaskMove(taskId: string, nextStatus: MyWorkTaskStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: nextStatus,
            }
          : task,
      ),
    );

    if (nextStatus === "DONE" && focusSession?.taskId === taskId) {
      setFocusSession(null);
      setStopFocusDialogOpen(false);
    }
  }

  function handleTaskDelete(taskId: string) {
    setTaskToDeleteId(taskId);
  }

  function confirmTaskDelete() {
    if (!taskToDeleteId) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskToDeleteId),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);

      next.delete(taskToDeleteId);

      return next;
    });

    if (focusSession?.taskId === taskToDeleteId) {
      setFocusSession(null);
      setStopFocusDialogOpen(false);
    }

    setTaskToDeleteId(null);
  }

  function confirmBulkDelete() {
    if (selectedTaskIds.size === 0) {
      return;
    }

    const focusedTaskSelected = focusSession
      ? selectedTaskIds.has(focusSession.taskId)
      : false;

    setTasks((currentTasks) =>
      currentTasks.filter((task) => !selectedTaskIds.has(task.id)),
    );

    setSelectedTaskIds(new Set());

    setBulkDeleteOpen(false);

    if (focusedTaskSelected) {
      setFocusSession(null);
      setStopFocusDialogOpen(false);
    }
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

  function handleStartFocus() {
    if (focusSession) {
      return;
    }

    setFocusDialogOpen(true);
  }

  function handleFocusTaskStart(taskId: string) {
    if (focusSession) {
      return;
    }

    const task = tasks.find((task) => task.id === taskId);

    if (!task || !task.planned || task.status === "DONE") {
      return;
    }

    setSelectedTaskIds(new Set());

    setFocusSession({
      taskId,
      status: "ACTIVE",
      startedAt: Date.now(),
      accumulatedSeconds: 0,
      pausedAt: null,
    });
  }

  function handlePauseFocus() {
    setFocusSession((current) => {
      if (!current || current.status === "PAUSED") {
        return current;
      }

      const sessionSeconds = Math.floor(
        (Date.now() - current.startedAt) / 1000,
      );

      return {
        ...current,
        status: "PAUSED",
        accumulatedSeconds: current.accumulatedSeconds + sessionSeconds,
        pausedAt: Date.now(),
      };
    });
  }

  function handleResumeFocus() {
    setFocusSession((current) => {
      if (!current || current.status !== "PAUSED") {
        return current;
      }

      return {
        ...current,
        status: "ACTIVE",
        startedAt: Date.now(),
        pausedAt: null,
      };
    });
  }

  function handleFocusTaskComplete() {
    if (!focusSession) {
      return;
    }

    const taskId = focusSession.taskId;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "DONE" as const,
            }
          : task,
      ),
    );

    setSelectedTaskIds((current) => {
      const next = new Set(current);

      next.delete(taskId);

      return next;
    });

    setFocusSession(null);
    setStopFocusDialogOpen(false);
  }

  function handleStopFocus() {
    if (!focusSession) {
      return;
    }

    setStopFocusDialogOpen(true);
  }

  function confirmStopFocus() {
    if (!focusSession) {
      return;
    }

    // Later:
    // Persist the completed focus session
    // through the backend API before
    // clearing the active session.

    setFocusSession(null);
    setStopFocusDialogOpen(false);
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
                onTogglePlan={handleToggleTaskPlan}
                onDeleteTask={handleTaskDelete}
              />
            )}

            {focusedTask && focusSession && (
              <FocusSession
                session={focusSession}
                task={focusedTask}
                project={demoMyWorkProjects.find(
                  (project) => project.id === focusedTask.projectId,
                )}
                elapsedSeconds={elapsedSeconds}
                onPause={handlePauseFocus}
                onResume={handleResumeFocus}
                onComplete={handleFocusTaskComplete}
                onStop={handleStopFocus}
              />
            )}

            {!focusSession && (
              <BulkTaskActions
                selectedCount={selectedTaskIds.size}
                onMarkComplete={handleMarkComplete}
                onChangePriority={handleChangePriority}
                onMoveTasks={handleMoveTasks}
                onDelete={() => setBulkDeleteOpen(true)}
              />
            )}
          </main>

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

      <StartFocusDialog
        open={focusDialogOpen}
        onOpenChange={setFocusDialogOpen}
        tasks={tasks}
        projects={demoMyWorkProjects}
        onStart={handleFocusTaskStart}
      />

      <StopFocusDialog
        open={stopFocusDialogOpen}
        onOpenChange={setStopFocusDialogOpen}
        elapsedSeconds={elapsedSeconds}
        onConfirm={confirmStopFocus}
      />

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
