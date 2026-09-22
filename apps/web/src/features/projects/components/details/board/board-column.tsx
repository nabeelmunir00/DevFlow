"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Ellipsis, Plus } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

import type {
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

import { BoardTaskCard } from "./board-task-card";

interface BoardColumnProps {
  title: string;
  status: ProjectTaskStatus;
  tasks: ProjectTaskSummary[];
  isDragOver?: boolean;
  onAddTask: () => void;
}

const statusDot: Record<ProjectTaskStatus, string> = {
  TODO: "bg-muted-foreground",
  IN_PROGRESS: "bg-primary",
  IN_REVIEW: "bg-warning",
  DONE: "bg-success",
};

export function BoardColumn({
  title,
  status,
  tasks,
  isDragOver = false,
  onAddTask,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <motion.section
      ref={setNodeRef}
      layout
      initial={false}
      animate={{
        scale: isDragOver ? 1.005 : 1,
      }}
      transition={{
        layout: {
          duration: 0.2,
          ease: [0.2, 0, 0, 1],
        },
        scale: {
          duration: 0.15,
          ease: "easeOut",
        },
      }}
      className={[
        "flex min-h-80 min-w-0 flex-col rounded-lg border p-2",
        "transition-[border-color,background-color,box-shadow] duration-150",
        isDragOver
          ? "border-primary/60 bg-primary/5 shadow-sm"
          : "border-border bg-card/30",
      ].join(" ")}
    >
      <div className="flex h-10 shrink-0 items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`size-3 shrink-0 rounded-full ${statusDot[status]}`}
            aria-hidden="true"
          />

          <h2 className="truncate text-base font-semibold text-foreground">
            {title}
          </h2>

          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium tabular-nums text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            aria-label={`${title} options`}
          >
            <Ellipsis className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            aria-label={`Add task to ${title}`}
            onClick={onAddTask}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-64 flex-1 flex-col gap-2 pt-2">
          {tasks.map((task) => (
            <BoardTaskCard key={task.id} task={task} />
          ))}

          {tasks.length === 0 && (
            <motion.div
              initial={false}
              animate={{
                opacity: isDragOver ? 1 : 0.65,
              }}
              transition={{
                duration: 0.15,
              }}
              className={[
                "flex min-h-32 flex-1 items-center justify-center rounded-md border border-dashed",
                "transition-[border-color,background-color,color] duration-150",
                isDragOver
                  ? "border-primary/50 bg-primary/5 text-primary"
                  : "border-border text-muted-foreground",
              ].join(" ")}
            >
              <span className="text-xs">Drop task here</span>
            </motion.div>
          )}
        </div>
      </SortableContext>
    </motion.section>
  );
}
