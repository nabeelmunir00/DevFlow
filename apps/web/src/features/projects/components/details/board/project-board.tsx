"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ChevronDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  ProjectDetails,
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

import { BoardColumn } from "./board-column";
import { BoardTaskCard } from "./board-task-card";

interface ProjectBoardProps {
  project: ProjectDetails;
}

interface BoardColumnConfig {
  status: ProjectTaskStatus;
  title: string;
}

const columns: BoardColumnConfig[] = [
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
  const [tasks, setTasks] = useState<ProjectTaskSummary[]>(project.recentTasks);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  /* =====================================================
     SENSORS
  ====================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 5,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /* =====================================================
     ACTIVE TASK
  ====================================================== */

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [tasks, activeTaskId],
  );

  /* =====================================================
     DRAG START
  ====================================================== */

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(String(event.active.id));
  }

  /* =====================================================
     DRAG END
  ====================================================== */

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    setTasks((currentTasks) => {
      const activeTaskIndex = currentTasks.findIndex(
        (task) => task.id === activeId,
      );

      if (activeTaskIndex === -1) {
        return currentTasks;
      }

      const overTask = currentTasks.find((task) => task.id === overId);

      const overColumn = columns.find((column) => column.status === overId);

      /*
       * Dropped directly on a column.
       */

      if (overColumn) {
        return currentTasks.map((task) =>
          task.id === activeId
            ? {
                ...task,
                status: overColumn.status,
              }
            : task,
        );
      }

      /*
       * Dropped on another task.
       */

      if (overTask) {
        return currentTasks.map((task) =>
          task.id === activeId
            ? {
                ...task,
                status: overTask.status,
              }
            : task,
        );
      }

      return currentTasks;
    });
  }

  /* =====================================================
     DRAG CANCEL
  ====================================================== */

  function handleDragCancel() {
    setActiveTaskId(null);
  }

  return (
    <div className="min-w-0">
      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1 lg:max-w-64">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input placeholder="Search tasks..." className="h-10 pl-9" />
        </div>

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
          DRAG & DROP BOARD
      ====================================================== */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.status,
            );

            return (
              <BoardColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
              />
            );
          })}
        </div>

        {/* =================================================
            DRAG OVERLAY
        ================================================== */}

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="scale-[1.02] opacity-95 shadow-xl">
              <BoardTaskCard task={activeTask} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
