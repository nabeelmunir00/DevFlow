import { Ellipsis, Plus } from "lucide-react";

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
}

const statusDot: Record<ProjectTaskStatus, string> = {
  TODO: "bg-muted-foreground",
  IN_PROGRESS: "bg-primary",
  IN_REVIEW: "bg-warning",
  DONE: "bg-success",
};

export function BoardColumn({ title, status, tasks }: BoardColumnProps) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card/30 p-2">
      {/* =====================================================
          COLUMN HEADER
      ====================================================== */}

      <div className="flex h-10 items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`size-4 shrink-0 rounded-full ${statusDot[status]}`}
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
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* =====================================================
          TASKS
      ====================================================== */}

      <div className="mt-2 grid min-w-0 content-start gap-2">
        {tasks.map((task) => (
          <BoardTaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <span className="text-xs text-muted-foreground">No tasks</span>
          </div>
        )}
      </div>
    </section>
  );
}
