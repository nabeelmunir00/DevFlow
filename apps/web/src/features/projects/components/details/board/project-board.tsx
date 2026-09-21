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
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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

function isTaskStatus(value: string): value is ProjectTaskStatus {
  return columns.some((column) => column.status === value);
}

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
      const activeTask = currentTasks.find((task) => task.id === activeId);

      if (!activeTask) {
        return currentTasks;
      }

      const overTask = currentTasks.find((task) => task.id === overId);

      /* =================================================
         CASE 1
         DROP DIRECTLY ON COLUMN
      ================================================== */

      if (isTaskStatus(overId)) {
        const sourceTasks = currentTasks.filter(
          (task) => task.status === activeTask.status,
        );

        const destinationTasks = currentTasks.filter(
          (task) => task.status === overId,
        );

        /*
         * Same column:
         * Dropping on the column itself doesn't need
         * a position change.
         */

        if (activeTask.status === overId) {
          return currentTasks;
        }

        const updatedTask: ProjectTaskSummary = {
          ...activeTask,
          status: overId,
        };

        const remainingTasks = currentTasks.filter(
          (task) => task.id !== activeId,
        );

        /*
         * Put the task at the end of the destination column.
         */

        const lastDestinationTask =
          destinationTasks[destinationTasks.length - 1];

        if (!lastDestinationTask) {
          return [...remainingTasks, updatedTask];
        }

        const lastIndex = remainingTasks.findIndex(
          (task) => task.id === lastDestinationTask.id,
        );

        const nextTasks = [...remainingTasks];

        nextTasks.splice(lastIndex + 1, 0, updatedTask);

        return nextTasks;
      }

      /* =================================================
         CASE 2
         DROP ON ANOTHER TASK
      ================================================== */

      if (!overTask) {
        return currentTasks;
      }

      const sourceStatus = activeTask.status;
      const destinationStatus = overTask.status;

      /* =================================================
         CASE 2A
         SAME COLUMN REORDER
      ================================================== */

      if (sourceStatus === destinationStatus) {
        const columnTasks = currentTasks.filter(
          (task) => task.status === sourceStatus,
        );

        const oldColumnIndex = columnTasks.findIndex(
          (task) => task.id === activeId,
        );

        const newColumnIndex = columnTasks.findIndex(
          (task) => task.id === overId,
        );

        if (oldColumnIndex === -1 || newColumnIndex === -1) {
          return currentTasks;
        }

        const reorderedColumnTasks = arrayMove(
          columnTasks,
          oldColumnIndex,
          newColumnIndex,
        );

        /*
         * Rebuild the global array while preserving
         * positions belonging to other columns.
         */

        let columnIndex = 0;

        return currentTasks.map((task) => {
          if (task.status !== sourceStatus) {
            return task;
          }

          const reorderedTask = reorderedColumnTasks[columnIndex];

          columnIndex += 1;

          return reorderedTask ?? task;
        });
      }

      /* =================================================
         CASE 2B
         CROSS COLUMN MOVE
      ================================================== */

      const updatedActiveTask: ProjectTaskSummary = {
        ...activeTask,
        status: destinationStatus,
      };

      /*
       * Remove active task first.
       */

      const remainingTasks = currentTasks.filter(
        (task) => task.id !== activeId,
      );

      /*
       * Find the target task after removing active task.
       */

      const overIndex = remainingTasks.findIndex((task) => task.id === overId);

      if (overIndex === -1) {
        return currentTasks;
      }

      const nextTasks = [...remainingTasks];

      /*
       * Insert at the exact position of the task
       * we're dropping over.
       */

      nextTasks.splice(overIndex, 0, updatedActiveTask);

      return nextTasks;
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
      {/* =================================================
          TOOLBAR
      ================================================== */}

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

      {/* =================================================
          BOARD
      ================================================== */}

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

        <DragOverlay>
          {activeTask ? (
            <div className="scale-[1.02] cursor-grabbing opacity-95 shadow-xl">
              <BoardTaskCard task={activeTask} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
