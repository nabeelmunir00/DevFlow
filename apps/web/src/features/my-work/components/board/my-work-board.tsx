"use client";

import type {
  MyWorkProject,
  MyWorkTask,
  MyWorkTaskPriority,
  MyWorkTaskStatus,
} from "../../types/my-work";

import {
  MyWorkBoardColumn,
  type MyWorkBoardColumnStatus,
} from "./my-work-board-column";

interface MyWorkBoardProps {
  tasks: MyWorkTask[];
  projects: MyWorkProject[];

  onMarkComplete: (taskId: string) => void;

  onChangePriority: (taskId: string, priority: MyWorkTaskPriority) => void;

  onMoveTask: (taskId: string, status: MyWorkTaskStatus) => void;

  onTogglePlan: (taskId: string) => void;

  onDeleteTask: (taskId: string) => void;
}

const columns: {
  status: MyWorkBoardColumnStatus;
  title: string;
}[] = [
  {
    status: "TODO",
    title: "Todo",
  },
  {
    status: "IN_PROGRESS",
    title: "In progress",
  },
  {
    status: "IN_REVIEW",
    title: "In review",
  },
  {
    status: "DONE",
    title: "Done",
  },
];

export function MyWorkBoard({
  tasks,
  projects,
  onMarkComplete,
  onChangePriority,
  onMoveTask,
  onTogglePlan,
  onDeleteTask,
}: MyWorkBoardProps) {
  function getColumnTasks(status: MyWorkBoardColumnStatus) {
    if (status === "TODO") {
      return tasks.filter(
        (task) => task.status === "TODO" || task.status === "BLOCKED",
      );
    }

    return tasks.filter((task) => task.status === status);
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
      {columns.map((column) => (
        <MyWorkBoardColumn
          key={column.status}
          status={column.status}
          title={column.title}
          tasks={getColumnTasks(column.status)}
          projects={projects}
          onMarkComplete={onMarkComplete}
          onChangePriority={onChangePriority}
          onMoveTask={onMoveTask}
          onTogglePlan={onTogglePlan}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
