"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

import type {
  ProjectDetails,
  ProjectTaskSummary,
} from "../../../types/project";

import { activeSprint, pastSprints, teamWorkload } from "./data/demo-sprints";
import { PastSprints } from "./past-sprints";
import { SprintSummary } from "./sprint-summary";
import { SprintTaskList } from "./sprint-task-list";
import { SprintViewTabs, type SprintView } from "./sprint-view-tabs";
import { TeamWorkload } from "./team-workload";

interface ProjectSprintsProps {
  project: ProjectDetails;
  tasks: ProjectTaskSummary[];
  onTasksChange: Dispatch<SetStateAction<ProjectTaskSummary[]>>;
}

export function ProjectSprints({
  project,
  tasks,
  onTasksChange,
}: ProjectSprintsProps) {
  const [view, setView] = useState<SprintView>("active");

  const sprintTasks = useMemo(
    () => tasks.filter((task) => task.sprint === project.sprint),
    [tasks, project.sprint],
  );

  const backlogTasks = useMemo(
    () => tasks.filter((task) => !task.sprint || task.sprint === "Backlog"),
    [tasks],
  );

  const completedTasks = useMemo(
    () => sprintTasks.filter((task) => task.status === "DONE").length,
    [sprintTasks],
  );

  const remainingTasks = sprintTasks.length - completedTasks;

  function handleAddToSprint(taskId: string) {
    onTasksChange((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              sprint: project.sprint,
            }
          : task,
      ),
    );
  }

  function handleMoveToBacklog(taskId: string) {
    onTasksChange((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              sprint: "Backlog",
            }
          : task,
      ),
    );
  }

  if (view !== "active") {
    return (
      <div className="w-full min-w-0">
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4">
            <SprintViewTabs value={view} onValueChange={setView} />

            <div className="flex min-h-64 items-center justify-center">
              <div className="px-4 text-center">
                <h3 className="text-sm font-medium text-foreground">
                  {view === "upcoming"
                    ? "Upcoming sprints"
                    : "Completed sprints"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {view === "upcoming"
                    ? "Upcoming sprint data will appear here."
                    : "Completed sprint data will appear here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        {/* Sprint summary */}
        <section className="order-1 min-w-0 md:col-span-2 xl:col-span-9">
          <div className="h-full min-w-0 rounded-lg border border-border bg-card p-4">
            <div className="mb-4">
              <SprintViewTabs value={view} onValueChange={setView} />
            </div>

            <SprintSummary
              sprint={activeSprint}
              completedTasks={completedTasks}
              totalTasks={sprintTasks.length}
              remainingTasks={remainingTasks}
            />
          </div>
        </section>

        {/* Team workload */}
        <aside className="order-4 min-w-0 md:col-span-1 xl:order-2 xl:col-span-3">
          <TeamWorkload members={teamWorkload} />
        </aside>

        {/* Sprint tasks */}
        <section className="order-2 min-w-0 md:col-span-1 xl:order-3 xl:col-span-5">
          <SprintTaskList
            title={project.sprint}
            tasks={sprintTasks}
            actionLabel="Add to sprint"
            onTaskAction={handleMoveToBacklog}
          />
        </section>

        {/* Backlog */}
        <section className="order-3 min-w-0 md:col-span-1 xl:order-4 xl:col-span-4">
          <SprintTaskList
            title="Backlog"
            tasks={backlogTasks}
            actionLabel="Add to sprint"
            onTaskAction={handleAddToSprint}
          />
        </section>

        {/* Past sprints */}
        <aside className="order-5 min-w-0 md:col-span-1 xl:col-span-3">
          <PastSprints sprints={pastSprints} />
        </aside>
      </div>
    </div>
  );
}
