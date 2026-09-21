"use client";

import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ChevronDown, Plus, Search } from "lucide-react";
import { motion } from "motion/react";

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

/* =========================================================
   HELPERS
========================================================= */

function isTaskStatus(value: string): value is ProjectTaskStatus {
  return columns.some((column) => column.status === value);
}

function getTaskById(tasks: ProjectTaskSummary[], taskId: string) {
  return tasks.find((task) => task.id === taskId);
}

function getColumnStatus(
  tasks: ProjectTaskSummary[],
  id: string,
): ProjectTaskStatus | null {
  if (isTaskStatus(id)) {
    return id;
  }

  return getTaskById(tasks, id)?.status ?? null;
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProjectBoard({ project }: ProjectBoardProps) {
  const [tasks, setTasks] = useState<ProjectTaskSummary[]>(project.recentTasks);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  /*
   * Controls which entire column should receive
   * destination highlighting.
   */
  const [overColumnStatus, setOverColumnStatus] =
    useState<ProjectTaskStatus | null>(null);

  const lastDestinationStatusRef = useRef<ProjectTaskStatus | null>(null);

  /*
   * Snapshot before dragging starts.
   *
   * onDragOver changes local state optimistically,
   * so this allows us to restore everything when
   * dragging is cancelled.
   */
  const dragStartTasksRef = useRef<ProjectTaskSummary[] | null>(null);

  /*
   * Prevent duplicate cross-column updates when
   * dnd-kit repeatedly reports the same target.
   */
  const lastOverIdRef = useRef<string | null>(null);

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
    () =>
      tasks.find((task) => task.id === activeTaskId) ??
      dragStartTasksRef.current?.find((task) => task.id === activeTaskId) ??
      null,
    [tasks, activeTaskId],
  );

  /* =====================================================
     DRAG START
  ====================================================== */

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);

    dragStartTasksRef.current = tasks.map((task) => ({
      ...task,
    }));

    lastOverIdRef.current = null;
    lastDestinationStatusRef.current = null;

    setActiveTaskId(activeId);
    setOverColumnStatus(null);
  }

  /* =====================================================
     DRAG OVER

     This handles:
     - destination column detection
     - full-column highlighting
     - empty columns
     - live cross-column movement
  ====================================================== */

  /* =====================================================
     DRAG END
  ====================================================== */

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = String(active.id);

    /*
     * Clear drag visual state.
     */
    setActiveTaskId(null);
    setOverColumnStatus(null);

    lastOverIdRef.current = null;

    /*
     * Dropped outside board.
     *
     * Restore original state.
     */
    if (!over) {
      if (dragStartTasksRef.current) {
        setTasks(dragStartTasksRef.current);
      }

      dragStartTasksRef.current = null;

      return;
    }

    const overId = String(over.id);

    /*
     * Cross-column status changes have
     * already happened inside handleDragOver.
     *
     * Here we finalize exact ordering.
     */
    setTasks((currentTasks) => {
      const currentActiveTask = getTaskById(currentTasks, activeId);

      if (!currentActiveTask) {
        return currentTasks;
      }

      /*
       * Dropped directly onto column
       * whitespace.
       *
       * onDragOver already handled this.
       */
      if (isTaskStatus(overId)) {
        return currentTasks;
      }

      const overTask = getTaskById(currentTasks, overId);

      if (!overTask) {
        return currentTasks;
      }

      /*
       * Safety check.
       */
      if (currentActiveTask.status !== overTask.status) {
        return currentTasks;
      }

      const status = currentActiveTask.status;

      const columnTasks = currentTasks.filter((task) => task.status === status);

      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);

      const newIndex = columnTasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return currentTasks;
      }

      /*
       * Final same-column ordering.
       */
      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

      /*
       * Rebuild global task array without
       * affecting the order of other columns.
       */
      let columnIndex = 0;

      return currentTasks.map((task) => {
        if (task.status !== status) {
          return task;
        }

        const reorderedTask = reorderedColumnTasks[columnIndex];

        columnIndex += 1;

        return reorderedTask ?? task;
      });
    });

    /*
     * API persistence will eventually happen
     * here.
     *
     * Example:
     *
     * await moveTask({
     *   taskId: activeId,
     *   status: finalStatus,
     *   position: finalPosition,
     * });
     */

    dragStartTasksRef.current = null;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const destinationStatus = getColumnStatus(tasks, overId);

    if (!destinationStatus) {
      return;
    }

    /*
     * Remember last valid destination.
     *
     * Even if collision becomes unstable for one frame,
     * dragEnd still knows where the task belongs.
     */
    lastDestinationStatusRef.current = destinationStatus;

    /*
     * Highlight entire destination column.
     */
    setOverColumnStatus(destinationStatus);

    if (activeId === overId) {
      return;
    }

    setTasks((currentTasks) => {
      const currentActiveTask = getTaskById(currentTasks, activeId);

      if (!currentActiveTask) {
        return currentTasks;
      }

      const currentDestinationStatus =
        getColumnStatus(currentTasks, overId) ?? destinationStatus;

      /*
       * Already inside destination column.
       *
       * Don't keep changing status.
       */
      if (currentActiveTask.status === currentDestinationStatus) {
        return currentTasks;
      }

      const updatedActiveTask: ProjectTaskSummary = {
        ...currentActiveTask,
        status: currentDestinationStatus,
      };

      const remainingTasks = currentTasks.filter(
        (task) => task.id !== activeId,
      );

      /*
       * Pointer is over column itself.
       */
      if (isTaskStatus(overId)) {
        const destinationTasks = remainingTasks.filter(
          (task) => task.status === currentDestinationStatus,
        );

        /*
         * Empty column.
         */
        if (destinationTasks.length === 0) {
          return [...remainingTasks, updatedActiveTask];
        }

        /*
         * Append at bottom.
         */
        const lastDestinationTask =
          destinationTasks[destinationTasks.length - 1];

        const insertionIndex = remainingTasks.findIndex(
          (task) => task.id === lastDestinationTask.id,
        );

        if (insertionIndex === -1) {
          return [...remainingTasks, updatedActiveTask];
        }

        const nextTasks = [...remainingTasks];

        nextTasks.splice(insertionIndex + 1, 0, updatedActiveTask);

        return nextTasks;
      }

      /*
       * Pointer is over another task.
       */
      const overTaskIndex = remainingTasks.findIndex(
        (task) => task.id === overId,
      );

      if (overTaskIndex === -1) {
        return [...remainingTasks, updatedActiveTask];
      }

      const nextTasks = [...remainingTasks];

      nextTasks.splice(overTaskIndex, 0, updatedActiveTask);

      return nextTasks;
    });
  }

  /* =====================================================
     DRAG CANCEL
  ====================================================== */

  function handleDragCancel() {
    if (dragStartTasksRef.current) {
      setTasks(dragStartTasksRef.current);
    }

    setActiveTaskId(null);
    setOverColumnStatus(null);

    dragStartTasksRef.current = null;
    lastOverIdRef.current = null;
    lastDestinationStatusRef.current = null;
  }
  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <div className="min-w-0">
      {/* =================================================
          TOOLBAR
      ================================================== */}

      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
        {/* Search */}

        <div className="relative min-w-52 flex-1 lg:max-w-64">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input placeholder="Search tasks..." className="h-10 pl-9" />
        </div>

        {/* Assignee */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Assignee
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {/* Priority */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Priority
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {/* Label */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Label
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {/* Sprint */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          {project.sprint}

          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {/* Group */}

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-4 font-normal"
        >
          Group by Status
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {/* Add Task */}

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
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.status,
            );

            /*
             * IMPORTANT:
             *
             * Destination highlighting is controlled
             * by ProjectBoard instead of relying on
             * BoardColumn's local `isOver`.
             *
             * Therefore hovering ANY task inside the
             * destination still highlights the
             * entire column.
             */
            const isDragOver =
              activeTaskId !== null && overColumnStatus === column.status;

            return (
              <BoardColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
                isDragOver={isDragOver}
              />
            );
          })}
        </div>

        {/* =================================================
            DRAG OVERLAY
        ================================================== */}

        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          {activeTask ? (
            <motion.div
              initial={{
                scale: 0.98,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.6,
              }}
              className="cursor-grabbing"
            >
              <BoardTaskCard task={activeTask} isOverlay />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
