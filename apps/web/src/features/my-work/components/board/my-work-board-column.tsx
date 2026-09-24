"use client";

import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../../types/my-work";

import { MyWorkBoardCard } from "./my-work-board-card";

export type MyWorkBoardColumnStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

interface MyWorkBoardColumnProps {
  status: MyWorkBoardColumnStatus;
  title: string;
  tasks: MyWorkTask[];
  projects: MyWorkProject[];
  onMarkComplete: (taskId: string) => void;
  onChangePriority: (taskId: string, priority: MyWorkTaskPriority) => void;
  onMoveTask: (taskId: string, status: MyWorkTaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

const indicatorClasses: Record<MyWorkBoardColumnStatus, string> = {
  TODO: "text-muted-foreground",
  IN_PROGRESS: "text-primary",
  IN_REVIEW: "text-warning",
  DONE: "text-success",
};

export function MyWorkBoardColumn({
  status,
  title,
  tasks,
  projects,
  onMarkComplete,
  onChangePriority,
  onMoveTask,
  onDeleteTask,
}: MyWorkBoardColumnProps) {
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("application/x-devflow-task");

    if (!taskId) return;

    onMoveTask(taskId, status);
  }

  return (
    <section
      className="min-w-0 rounded-lg border border-border bg-secondary/20"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex h-11 items-center gap-2 border-b border-border px-3">
        <Circle className={cn("size-3.5", indicatorClasses[status])} />

        <h3 className="text-sm font-medium text-foreground">{title}</h3>

        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2 p-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";

                event.dataTransfer.setData(
                  "application/x-devflow-task",
                  task.id,
                );
              }}
            >
              <MyWorkBoardCard
                task={task}
                project={projects.find(
                  (project) => project.id === task.projectId,
                )}
                onMarkComplete={onMarkComplete}
                onChangePriority={onChangePriority}
                onDeleteTask={onDeleteTask}
              />
            </div>
          ))
        ) : (
          <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border px-3">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </section>
  );
}
