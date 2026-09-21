import { ChevronDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ProjectDetails, ProjectTaskStatus } from "../../../types/project";

import { BoardColumn } from "./board-column";

interface ProjectBoardProps {
  project: ProjectDetails;
}

const columns: {
  status: ProjectTaskStatus;
  title: string;
}[] = [
  {
    status: "TODO",
    title: "Todo",
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
  },
  {
    status: "IN_REVIEW",
    title: "In Review",
  },
  {
    status: "DONE",
    title: "Done",
  },
];

export function ProjectBoard({ project }: ProjectBoardProps) {
  return (
    <div className="min-w-0">
      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
        {/* Search */}

        <div className="relative min-w-52 flex-1 lg:max-w-64">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input placeholder="Search tasks..." className="h-10 pl-9" />
        </div>

        {/* Filters */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Assignee
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Priority
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Label
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          {project.sprint}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Group by Status
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        <Button type="button" className="ml-auto h-10 gap-2">
          <Plus className="size-4" />
          Add task
        </Button>
      </div>

      {/* =====================================================
          BOARD
      ====================================================== */}

      <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const tasks = project.recentTasks.filter(
            (task) => task.status === column.status,
          );

          return (
            <BoardColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={tasks}
            />
          );
        })}
      </div>
    </div>
  );
}
