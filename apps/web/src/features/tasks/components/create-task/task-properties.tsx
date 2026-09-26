"use client";

import { CalendarDays, Check, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  taskEstimateOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from "../../data/create-task-data";

import type { CreateTaskDialogData, CreateTaskInput } from "../../types/task";

interface TaskPropertiesProps {
  form: CreateTaskInput;
  data: CreateTaskDialogData;

  onChange: <K extends keyof CreateTaskInput>(
    key: K,
    value: CreateTaskInput[K],
  ) => void;
}

export function TaskProperties({ form, data, onChange }: TaskPropertiesProps) {
  const selectedStatus =
    taskStatusOptions.find((option) => option.value === form.status) ??
    taskStatusOptions[0];

  const selectedPriority =
    taskPriorityOptions.find((option) => option.value === form.priority) ??
    taskPriorityOptions[1];

  const selectedAssignee = data.users.find(
    (user) => user.id === form.assigneeId,
  );

  const selectedSprint = data.sprints.find(
    (sprint) => sprint.id === form.sprintId,
  );

  const selectedEstimate = taskEstimateOptions.find(
    (option) => option.value === form.estimateMinutes,
  );

  const availableSprints = data.sprints.filter(
    (sprint) => sprint.projectId === form.projectId,
  );

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Properties</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* STATUS */}

        <PropertyField label="Status">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-between px-3 font-normal"
                />
              }
            >
              <span className="flex min-w-0 items-center gap-2">
                <StatusIndicator status={form.status} />

                <span className="truncate">{selectedStatus.label}</span>
              </span>

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {taskStatusOptions.map((option) => {
                  const selected = form.status === option.value;

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onChange("status", option.value)}
                    >
                      <StatusIndicator status={option.value} />

                      <span className="flex-1">{option.label}</span>

                      {selected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </PropertyField>

        {/* PRIORITY */}

        <PropertyField label="Priority">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-between px-3 font-normal"
                />
              }
            >
              <span className="flex min-w-0 items-center gap-2">
                <PriorityIndicator priority={form.priority} />

                <span className="truncate">{selectedPriority.label}</span>
              </span>

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {taskPriorityOptions.map((option) => {
                  const selected = form.priority === option.value;

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onChange("priority", option.value)}
                    >
                      <PriorityIndicator priority={option.value} />

                      <span className="flex-1">{option.label}</span>

                      {selected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </PropertyField>

        {/* ASSIGNEE */}

        <PropertyField label="Assignee">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-between px-3 font-normal"
                />
              }
            >
              {selectedAssignee ? (
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[9px]">
                      {getInitials(selectedAssignee.name)}
                    </AvatarFallback>
                  </Avatar>

                  <span className="truncate">{selectedAssignee.name}</span>
                </span>
              ) : (
                <span className="truncate text-muted-foreground">
                  Unassigned
                </span>
              )}

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onChange("assigneeId", null)}>
                  <span className="flex-1">Unassigned</span>

                  {!form.assigneeId ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </DropdownMenuItem>

                {data.users.map((user) => {
                  const selected = form.assigneeId === user.id;

                  return (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => onChange("assigneeId", user.id)}
                    >
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[9px]">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="min-w-0 flex-1 truncate">
                        {user.name}
                      </span>

                      {selected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </PropertyField>

        {/* SPRINT */}

        <PropertyField label="Sprint">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-between px-3 font-normal"
                />
              }
            >
              <span
                className={
                  selectedSprint ? "truncate" : "truncate text-muted-foreground"
                }
              >
                {selectedSprint?.name ?? "No sprint"}
              </span>

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onChange("sprintId", null)}>
                  <span className="flex-1">No sprint</span>

                  {!form.sprintId ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </DropdownMenuItem>

                {availableSprints.map((sprint) => {
                  const selected = form.sprintId === sprint.id;

                  return (
                    <DropdownMenuItem
                      key={sprint.id}
                      onClick={() => onChange("sprintId", sprint.id)}
                    >
                      <span className="flex-1">{sprint.name}</span>

                      {selected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </PropertyField>

        {/* ESTIMATE */}

        <PropertyField label="Estimate">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-between px-3 font-normal"
                />
              }
            >
              <span
                className={
                  selectedEstimate
                    ? "truncate"
                    : "truncate text-muted-foreground"
                }
              >
                {selectedEstimate?.label ?? "No estimate"}
              </span>

              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onChange("estimateMinutes", null)}
                >
                  <span className="flex-1">No estimate</span>

                  {form.estimateMinutes === null ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </DropdownMenuItem>

                {taskEstimateOptions.map((option) => {
                  const selected = form.estimateMinutes === option.value;

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onChange("estimateMinutes", option.value)}
                    >
                      <span className="flex-1">{option.label}</span>

                      {selected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </PropertyField>

        {/* DUE DATE */}

        <PropertyField label="Due date">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-start gap-2 px-3 font-normal"
                />
              }
            >
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />

              <span
                className={
                  form.dueDate ? "truncate" : "truncate text-muted-foreground"
                }
              >
                {form.dueDate ? formatDate(form.dueDate) : "Select date"}
              </span>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.dueDate ?? undefined}
                onSelect={(date) => onChange("dueDate", date ?? null)}
              />

              {form.dueDate ? (
                <div className="border-t border-border p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-muted-foreground"
                    onClick={() => onChange("dueDate", null)}
                  >
                    Clear date
                  </Button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>
        </PropertyField>
      </div>
    </section>
  );
}

/* =========================================================
   INTERNAL UI
========================================================= */

function PropertyField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-meta text-foreground">{label}</label>

      {children}
    </div>
  );
}

function StatusIndicator({ status }: { status: CreateTaskInput["status"] }) {
  if (status === "DONE") {
    return <span className="size-2 shrink-0 rounded-full bg-primary" />;
  }

  if (status === "IN_REVIEW") {
    return <span className="size-2 shrink-0 rounded-full bg-warning" />;
  }

  if (status === "CANCELLED") {
    return <span className="size-2 shrink-0 rounded-full bg-destructive" />;
  }

  if (status === "IN_PROGRESS") {
    return <span className="size-2 shrink-0 rounded-full bg-primary/70" />;
  }

  return (
    <span className="size-2 shrink-0 rounded-full border border-muted-foreground" />
  );
}

function PriorityIndicator({
  priority,
}: {
  priority: CreateTaskInput["priority"];
}) {
  const className =
    priority === "URGENT"
      ? "bg-destructive"
      : priority === "HIGH"
        ? "bg-destructive/80"
        : priority === "MEDIUM"
          ? "bg-warning"
          : "bg-muted-foreground";

  return <span className={`size-2 shrink-0 rounded-full ${className}`} />;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
