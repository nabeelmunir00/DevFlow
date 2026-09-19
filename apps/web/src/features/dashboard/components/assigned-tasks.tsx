"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardPanelHeader } from "./dashboard-panel-header";

type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface AssignedTask {
  id: string;
  title: string;
  project: string;
  projectColor?: string;
  priority: TaskPriority;
  due: string;
}

interface AssignedTasksProps {
  slug: string;
  tasks?: AssignedTask[];
  onViewTask?: (task: AssignedTask) => void;
  onEditTask?: (task: AssignedTask) => void;
}

const demoTasks: AssignedTask[] = [
  {
    id: "DF-121",
    title: "Organization switcher",
    project: "DevFlow Web",
    priority: "HIGH",
    due: "Today",
  },
  {
    id: "DF-128",
    title: "Resolve invite token expiry",
    project: "API Platform",
    priority: "HIGH",
    due: "Today",
  },
  {
    id: "DF-118",
    title: "Task detail panel",
    project: "DevFlow Web",
    priority: "MEDIUM",
    due: "Tomorrow",
  },
  {
    id: "DF-134",
    title: "Add loading states",
    project: "DevFlow Web",
    priority: "MEDIUM",
    due: "Sep 20",
  },
];

const priorityStyles: Record<TaskPriority, { label: string; color: string }> = {
  HIGH: { label: "High", color: "#ff4d57" },
  MEDIUM: { label: "Medium", color: "#ffd24a" },
  LOW: { label: "Low", color: "#00d998" },
};

const projectColors: Record<string, string> = {
  "DevFlow Web": "#5b78ff",
  "API Platform": "#a547f5",
  "Design System": "#00d998",
};

const checkboxClassName =
  "size-4 rounded-[3px] border-[#c5ced8] bg-transparent shadow-none " +
  "data-[checked]:border-[#5678ff] data-[checked]:bg-[#5678ff] data-[checked]:text-white " +
  "data-[state=checked]:border-[#5678ff] data-[state=checked]:bg-[#5678ff] " +
  "data-[state=checked]:text-white focus-visible:ring-[#6b89ff]/50";

const dotClassName =
  "inline-block size-3 shrink-0 rounded-full ring-1 ring-black/35 " +
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)]";

export function AssignedTasks({
  slug,
  tasks = demoTasks,
  onViewTask,
  onEditTask,
}: AssignedTasksProps) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    () => new Set(),
  );

  const allSelected =
    tasks.length > 0 && tasks.every((task) => selectedTaskIds.has(task.id));

  function toggleTask(id: string, checked: boolean) {
    setSelectedTaskIds((previous) => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-lg  border-border py-0 shadow-none">
      <DashboardPanelHeader
        title="Assigned to me"
        actionLabel="View all"
        href={`/workspace/${slug}/task`}
      />

      <CardContent className="p-0 pb-1">
        <Table
          aria-label="Tasks assigned to me"
          className="min-w-[720px] table-fixed text-[13px]"
        >
          <TableHeader>
            <TableRow className="h- hover:bg-transparent">
              <TableHead className="h-9 w-14 px-0">
                <div className="flex h-6 items-center justify-center border-r ">
                  <Checkbox
                    aria-label="Select all tasks"
                    className={checkboxClassName}
                    checked={allSelected}
                    disabled={tasks.length === 0}
                    onCheckedChange={(checked) =>
                      setSelectedTaskIds(
                        new Set(
                          checked === true ? tasks.map((task) => task.id) : [],
                        ),
                      )
                    }
                  />
                </div>
              </TableHead>

              <TableHead className="h-9 px-2 text-xs font-normal text-[#c4cbd6]">
                <span className="underline decoration-[#75808f]/40 underline-offset-2">
                  Task
                </span>
              </TableHead>

              <TableHead className="h-9 w-[20%] px-2 text-xs font-normal text-[#c4cbd6]">
                <span className="underline decoration-[#75808f]/40 underline-offset-2">
                  Project
                </span>
              </TableHead>

              <TableHead className="h-9 w-[15%] px-2 text-xs font-normal text-[#c4cbd6]">
                <span className="underline decoration-[#75808f]/40 underline-offset-2">
                  Priority
                </span>
              </TableHead>

              <TableHead className="h-9 w-[16%] px-2 text-xs font-normal text-[#c4cbd6]">
                <span className="underline decoration-[#75808f]/40 underline-offset-2">
                  Due
                </span>
              </TableHead>

              <TableHead className="h-9 w-12 px-0">
                <div className="flex h-6 items-center justify-center border-l border-[#303842]">
                  <Icon
                    icon="solar:menu-dots-bold"
                    className="size-4 text-[#d5dce5]"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Actions</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-[13px] text-[#aab4c1]"
                >
                  No tasks assigned to you yet.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const priority = priorityStyles[task.priority];
                const isDueToday = task.due === "Today";

                return (
                  <TableRow
                    key={task.id}
                    data-state={
                      selectedTaskIds.has(task.id) ? "selected" : undefined
                    }
                    className="h-10 border-[#2b343d] transition-colors hover:bg-[#20262d] data-[state=selected]:bg-[#232d42]"
                  >
                    <TableCell className="px-0 py-0">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          aria-label={`Select ${task.id}: ${task.title}`}
                          className={checkboxClassName}
                          checked={selectedTaskIds.has(task.id)}
                          onCheckedChange={(checked) =>
                            toggleTask(task.id, checked === true)
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 text-[#6285ff]">
                          {task.id}
                        </span>
                        <span
                          className="truncate font-normal"
                          title={task.title}
                        >
                          {task.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={dotClassName}
                          style={{
                            backgroundColor:
                              task.projectColor ??
                              projectColors[task.project] ??
                              "#5b78ff",
                          }}
                        />
                        <span className="truncate" title={task.project}>
                          {task.project}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={dotClassName}
                          style={{ backgroundColor: priority.color }}
                        />
                        <span>{priority.label}</span>
                      </div>
                    </TableCell>

                    <TableCell className="px-2 py-0">
                      <div
                        className={`flex items-center gap-2 ${
                          isDueToday ? "text-[#ffdc62]" : "text-[#edf0f5]"
                        }`}
                      >
                        <Icon
                          icon="solar:calendar-linear"
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span
                          className={
                            isDueToday
                              ? "truncate underline decoration-[#ffdc62]/55 underline-offset-2"
                              : "truncate"
                          }
                          title={task.due}
                        >
                          {task.due}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-0 py-0">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 rounded-sm"
                              />
                            }
                          >
                            <Icon
                              icon="solar:menu-dots-bold"
                              className="size-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              Actions for {task.id}
                            </span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="min-w-36 border-[#313a44] bg-[#1e242a] text-[#f1f3f5]"
                          >
                            <DropdownMenuItem
                              disabled={!onViewTask}
                              onClick={() => onViewTask?.(task)}
                              className="text-[13px] focus:bg-white/5 focus:text-white data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
                            >
                              View task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!onEditTask}
                              onClick={() => onEditTask?.(task)}
                              className="text-[13px] focus:bg-white/5 focus:text-white data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
                            >
                              Edit task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
