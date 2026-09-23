"use client";

import { useMemo, useState } from "react";

import type {
  MyWorkLayout,
  MyWorkTaskPriority,
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

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(() => {
    const initiallySelected = demoMyWorkTasks
      .filter((task) => task.selected)
      .map((task) => task.id);

    return new Set(initiallySelected);
  });

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoMyWorkTasks.filter((task) => {
      if (status !== "ALL" && task.status !== status) {
        return false;
      }

      if (priority !== "ALL" && task.priority !== priority) {
        return false;
      }

      if (projectId !== "ALL" && task.projectId !== projectId) {
        return false;
      }

      if (query) {
        const project = demoMyWorkProjects.find(
          (item) => item.id === task.projectId,
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

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [status, priority, projectId, search]);

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
    if (selectedTaskIds.size === 0) {
      return;
    }

    // API integration later:
    //
    // await bulkUpdateTasks({
    //   taskIds: [...selectedTaskIds],
    //   status: "DONE",
    // });

    setSelectedTaskIds(new Set());
  }

  function handleChangePriority(nextPriority: string) {
    if (selectedTaskIds.size === 0) {
      return;
    }

    const priorityValue = nextPriority as MyWorkTaskPriority;

    // API integration later:
    //
    // await bulkUpdateTasks({
    //   taskIds: [...selectedTaskIds],
    //   priority: priorityValue,
    // });

    console.log("Change priority:", priorityValue);
  }

  function handleMoveTasks() {
    if (selectedTaskIds.size === 0) {
      return;
    }

    // Later open the move-task dialog.
  }

  function handleStartFocus() {
    // Focus mode integration later.
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
