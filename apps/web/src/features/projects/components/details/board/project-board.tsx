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
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type {
  ProjectDetails,
  ProjectTaskPriority,
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

import { AddTaskDialog } from "../../add-task-dialog";
import { BoardColumn } from "./board-column";
import { BoardTaskCard } from "./board-task-card";

interface ProjectBoardProps {
  project: ProjectDetails;
}

interface BoardColumnConfig {
  status: ProjectTaskStatus;
  title: string;
}

type AssigneeFilter = string | "ALL";
type PriorityFilter = ProjectTaskPriority | "ALL";
type LabelFilter = string | "ALL";
type SprintFilter = string | "ALL";

const columns: BoardColumnConfig[] = [
  { status: "TODO", title: "Todo" },
  { status: "IN_PROGRESS", title: "In Progress" },
  { status: "IN_REVIEW", title: "In Review" },
  { status: "DONE", title: "Done" },
];

const priorities: {
  value: ProjectTaskPriority;
  label: string;
  dot: string;
}[] = [
  {
    value: "LOW",
    label: "Low",
    dot: "bg-success",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-primary",
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-warning",
  },
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-destructive",
  },
];

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

export function ProjectBoard({ project }: ProjectBoardProps) {
  const [tasks, setTasks] = useState<ProjectTaskSummary[]>(project.recentTasks);

  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [labelFilter, setLabelFilter] = useState<LabelFilter>("ALL");
  const [sprintFilter, setSprintFilter] = useState<SprintFilter>("ALL");

  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const [addTaskStatus, setAddTaskStatus] = useState<ProjectTaskStatus>("TODO");

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [overColumnStatus, setOverColumnStatus] =
    useState<ProjectTaskStatus | null>(null);

  const dragStartTasksRef = useRef<ProjectTaskSummary[] | null>(null);

  const lastDestinationStatusRef = useRef<ProjectTaskStatus | null>(null);

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

  const labels = useMemo(
    () =>
      Array.from(
        new Set(
          tasks
            .map((task) => task.label)
            .filter((label): label is string => Boolean(label)),
        ),
      ).sort(),
    [tasks],
  );

  const sprints = useMemo(
    () =>
      Array.from(
        new Set(
          tasks
            .map((task) => task.sprint)
            .filter((sprint): sprint is string => Boolean(sprint)),
        ),
      ).sort(),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.id.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.assignee.name.toLowerCase().includes(query) ||
        task.label?.toLowerCase().includes(query);

      const matchesAssignee =
        assigneeFilter === "ALL" || task.assignee.id === assigneeFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      const matchesLabel = labelFilter === "ALL" || task.label === labelFilter;

      const matchesSprint =
        sprintFilter === "ALL" || task.sprint === sprintFilter;

      return (
        matchesSearch &&
        matchesAssignee &&
        matchesPriority &&
        matchesLabel &&
        matchesSprint
      );
    });
  }, [
    tasks,
    search,
    assigneeFilter,
    priorityFilter,
    labelFilter,
    sprintFilter,
  ]);

  const hasFilters =
    assigneeFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    labelFilter !== "ALL" ||
    sprintFilter !== "ALL";

  const activeTask = useMemo(
    () =>
      tasks.find((task) => task.id === activeTaskId) ??
      dragStartTasksRef.current?.find((task) => task.id === activeTaskId) ??
      null,
    [tasks, activeTaskId],
  );

  const selectedAssignee =
    project.members.find((member) => member.id === assigneeFilter) ?? null;

  const selectedPriority =
    priorities.find((priority) => priority.value === priorityFilter) ?? null;

  function resetDragState() {
    setActiveTaskId(null);
    setOverColumnStatus(null);

    dragStartTasksRef.current = null;
    lastDestinationStatusRef.current = null;
  }

  function clearFilters() {
    setAssigneeFilter("ALL");
    setPriorityFilter("ALL");
    setLabelFilter("ALL");
    setSprintFilter("ALL");
  }

  function openAddTask(status: ProjectTaskStatus = "TODO") {
    setAddTaskStatus(status);
    setAddTaskOpen(true);
  }

  function handleCreateTask(task: ProjectTaskSummary) {
    const nextTask: ProjectTaskSummary = {
      ...task,
      status: addTaskStatus,
    };

    setTasks((current) => [...current, nextTask]);
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);

    dragStartTasksRef.current = tasks.map((task) => ({
      ...task,
    }));

    lastDestinationStatusRef.current = null;

    setActiveTaskId(activeId);
    setOverColumnStatus(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      setOverColumnStatus(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const destinationStatus = getColumnStatus(tasks, overId);

    if (!destinationStatus) {
      return;
    }

    lastDestinationStatusRef.current = destinationStatus;

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

      if (isTaskStatus(overId)) {
        const destinationTasks = remainingTasks.filter(
          (task) => task.status === currentDestinationStatus,
        );

        if (destinationTasks.length === 0) {
          return [...remainingTasks, updatedActiveTask];
        }

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;

    const finalDestinationStatus =
      (overId ? getColumnStatus(tasks, overId) : null) ??
      lastDestinationStatusRef.current;

    if (!finalDestinationStatus) {
      if (dragStartTasksRef.current) {
        setTasks(dragStartTasksRef.current);
      }

      resetDragState();
      return;
    }

    setTasks((currentTasks) => {
      const currentActiveTask = getTaskById(currentTasks, activeId);

      if (!currentActiveTask) {
        return currentTasks;
      }

      let nextTasks: ProjectTaskSummary[] = currentTasks.map(
        (task): ProjectTaskSummary =>
          task.id === activeId
            ? {
                ...task,
                status: finalDestinationStatus,
              }
            : task,
      );

      if (!overId || isTaskStatus(overId)) {
        return nextTasks;
      }

      const overTask = getTaskById(nextTasks, overId);

      if (!overTask || overTask.status !== finalDestinationStatus) {
        return nextTasks;
      }

      const columnTasks = nextTasks.filter(
        (task) => task.status === finalDestinationStatus,
      );

      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);

      const newIndex = columnTasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return nextTasks;
      }

      const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

      let columnIndex = 0;

      nextTasks = nextTasks.map((task) => {
        if (task.status !== finalDestinationStatus) {
          return task;
        }

        const reorderedTask = reorderedColumnTasks[columnIndex];

        columnIndex += 1;

        return reorderedTask ?? task;
      });

      return nextTasks;
    });

    resetDragState();
  }

  function handleDragCancel() {
    if (dragStartTasksRef.current) {
      setTasks(dragStartTasksRef.current);
    }

    resetDragState();
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1 lg:max-w-64">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
            className="h-10 pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 font-normal"
              />
            }
          >
            {selectedAssignee ? (
              <>
                <Avatar className="size-5">
                  <AvatarFallback className="text-xs">
                    {selectedAssignee.initials}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-28 truncate">
                  {selectedAssignee.name}
                </span>
              </>
            ) : (
              "Assignee"
            )}

            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setAssigneeFilter("ALL")}>
                All assignees
                {assigneeFilter === "ALL" && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>

              {project.members.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => setAssigneeFilter(member.id)}
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>

                  {member.name}

                  {assigneeFilter === member.id && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 font-normal"
              />
            }
          >
            {selectedPriority ? (
              <>
                <span
                  className={`size-2.5 rounded-full ${selectedPriority.dot}`}
                />
                {selectedPriority.label}
              </>
            ) : (
              "Priority"
            )}

            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setPriorityFilter("ALL")}>
                All priorities
                {priorityFilter === "ALL" && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>

              {priorities.map((priority) => (
                <DropdownMenuItem
                  key={priority.value}
                  onClick={() => setPriorityFilter(priority.value)}
                >
                  <span className={`size-2.5 rounded-full ${priority.dot}`} />

                  {priority.label}

                  {priorityFilter === priority.value && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 font-normal"
              />
            }
          >
            {labelFilter === "ALL" ? "Label" : labelFilter}

            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setLabelFilter("ALL")}>
                All labels
                {labelFilter === "ALL" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>

              {labels.map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() => setLabelFilter(label)}
                >
                  {label}

                  {labelFilter === label && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 font-normal"
              />
            }
          >
            {sprintFilter === "ALL" ? project.sprint : sprintFilter}

            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSprintFilter("ALL")}>
                All sprints
                {sprintFilter === "ALL" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>

              {sprints.map((sprint) => (
                <DropdownMenuItem
                  key={sprint}
                  onClick={() => setSprintFilter(sprint)}
                >
                  {sprint}

                  {sprintFilter === sprint && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 font-normal"
          disabled
        >
          Group by Status
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 gap-2 text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="size-4" />
            Clear
          </Button>
        )}

        <Button
          type="button"
          className="ml-auto h-10 gap-2"
          onClick={() => openAddTask("TODO")}
        >
          <Plus className="size-4" />
          Add task
        </Button>
      </div>

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
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.status,
            );

            const isDragOver =
              activeTaskId !== null && overColumnStatus === column.status;

            return (
              <BoardColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
                isDragOver={isDragOver}
                onAddTask={() => openAddTask(column.status)}
              />
            );
          })}
        </div>

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

      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        project={project}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
