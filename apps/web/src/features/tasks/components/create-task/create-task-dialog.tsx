"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";

import {
  Bold,
  CalendarDays,
  Check,
  ChevronDown,
  Code2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Plus,
  Quote,
  Sparkles,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import {
  resolveCreateTaskData,
  taskEstimateOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from "../../data/create-task-data";

import {
  createEmptyTaskInput,
  type CreateTaskDialogProps,
  type CreateTaskInput,
  type TaskPriority,
  type TaskStatus,
} from "../../types/task";

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-meta text-foreground">
        {label}

        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export function CreateTaskDialog({
  open,
  onOpenChange,
  defaultProjectId,
  data,
  onCreate,
}: CreateTaskDialogProps) {
  const resolvedData = useMemo(() => resolveCreateTaskData(data), [data]);

  const initialProjectId =
    defaultProjectId ?? resolvedData.projects[0]?.id ?? "";

  const [form, setForm] = useState<CreateTaskInput>(() =>
    createEmptyTaskInput(initialProjectId),
  );

  const [createAnother, setCreateAnother] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = resolvedData.projects.find(
    (project) => project.id === form.projectId,
  );

  const selectedAssignee = resolvedData.users.find(
    (user) => user.id === form.assigneeId,
  );

  const selectedSprint = resolvedData.sprints.find(
    (sprint) => sprint.id === form.sprintId,
  );

  const availableSprints = resolvedData.sprints.filter(
    (sprint) => sprint.projectId === form.projectId,
  );

  const selectedStatus =
    taskStatusOptions.find((option) => option.value === form.status) ??
    taskStatusOptions[0];

  const selectedPriority =
    taskPriorityOptions.find((option) => option.value === form.priority) ??
    taskPriorityOptions[1];

  const selectedEstimate = taskEstimateOptions.find(
    (option) => option.value === form.estimateMinutes,
  );

  function updateForm<K extends keyof CreateTaskInput>(
    key: K,
    value: CreateTaskInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(createEmptyTaskInput(initialProjectId));
    setNewSubtask("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
      setCreateAnother(false);
    }

    onOpenChange(nextOpen);
  }

  function handleProjectChange(projectId: string) {
    setForm((current) => ({
      ...current,
      projectId,

      // Sprint belongs to a project, so changing the
      // project invalidates the existing sprint.
      sprintId: null,
    }));
  }

  function toggleLabel(labelId: string) {
    setForm((current) => ({
      ...current,

      labelIds: current.labelIds.includes(labelId)
        ? current.labelIds.filter((currentId) => currentId !== labelId)
        : [...current.labelIds, labelId],
    }));
  }

  function addSubtask() {
    const title = newSubtask.trim();

    if (!title) {
      return;
    }

    setForm((current) => ({
      ...current,

      subtasks: [
        ...current.subtasks,
        {
          title,
          position: current.subtasks.length,
        },
      ],
    }));

    setNewSubtask("");
  }

  function removeSubtask(index: number) {
    setForm((current) => ({
      ...current,

      subtasks: current.subtasks
        .filter((_, itemIndex) => itemIndex !== index)
        .map((subtask, itemIndex) => ({
          ...subtask,
          position: itemIndex,
        })),
    }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    const newFiles = Array.from(fileList);

    setForm((current) => ({
      ...current,
      attachments: [...current.attachments, ...newFiles],
    }));
  }

  function removeFile(index: number) {
    setForm((current) => ({
      ...current,

      attachments: current.attachments.filter(
        (_, fileIndex) => fileIndex !== index,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();

    if (!form.projectId || !title || isSubmitting) {
      return;
    }

    const payload: CreateTaskInput = {
      ...form,
      title,
      description: form.description.trim(),
    };

    try {
      setIsSubmitting(true);

      await onCreate?.(payload);

      if (createAnother) {
        resetForm();
        return;
      }

      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92dvh] overflow-hidden p-0 sm:max-w-2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[92dvh] min-h-0 flex-col"
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <DialogHeader className="shrink-0 border-b border-border px-5 py-4 text-left sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="text-section-title">
                  Create task
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm">
                  Add a new task to your project.
                </DialogDescription>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label="Close create task dialog"
                onClick={() => handleOpenChange(false)}
              >
                <X className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
          </DialogHeader>

          {/* =================================================
              SCROLLABLE CONTENT
          ================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 px-5 py-5 sm:px-6">
              {/* PROJECT */}

              <Field label="Project" required>
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
                    {selectedProject ? (
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
                          {selectedProject.key}
                        </span>

                        <span className="truncate">{selectedProject.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Select project
                      </span>
                    )}

                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="min-w-64">
                    <DropdownMenuGroup>
                      {resolvedData.projects.map((project) => {
                        const selected = project.id === form.projectId;

                        return (
                          <DropdownMenuItem
                            key={project.id}
                            onClick={() => handleProjectChange(project.id)}
                            className={
                              selected
                                ? "bg-accent text-accent-foreground"
                                : undefined
                            }
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
                              {project.key}
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {project.name}
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
              </Field>

              {/* TITLE */}

              <Field label="Task title" required>
                <Input
                  autoFocus
                  value={form.title}
                  maxLength={255}
                  placeholder="Add workspace access controls"
                  onChange={(event) => updateForm("title", event.target.value)}
                />
              </Field>

              {/* DESCRIPTION */}

              <Field label="Description">
                <div className="overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="flex min-h-9 flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Bold"
                    >
                      <Bold className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Italic"
                    >
                      <Italic className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Add link"
                    >
                      <Link2 className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <span className="mx-1 h-4 w-px bg-border" />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Bullet list"
                    >
                      <List className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Numbered list"
                    >
                      <ListOrdered className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Code"
                    >
                      <Code2 className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Quote"
                    >
                      <Quote className="size-3.5" strokeWidth={1.75} />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-7 gap-1.5 px-2 text-xs text-primary"
                    >
                      <Sparkles className="size-3.5" strokeWidth={1.75} />

                      <span className="hidden sm:inline">Ask DevFlow AI</span>
                    </Button>
                  </div>

                  <Textarea
                    value={form.description}
                    placeholder="Describe the task, add context, or paste links..."
                    className="min-h-24 resize-none rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                  />

                  <div className="flex items-center border-t border-border px-2 py-1.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        handleFiles(event.target.files);

                        event.currentTarget.value = "";
                      }}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="size-3.5" strokeWidth={1.75} />
                      Add attachment
                    </Button>
                  </div>
                </div>

                {form.attachments.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {form.attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="flex h-8 items-center gap-2 rounded-md border border-border px-2.5 text-xs"
                      >
                        <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />

                        <span className="min-w-0 flex-1 truncate">
                          {file.name}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeFile(index)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Field>

              {/* =================================================
                  PROPERTIES
              ================================================== */}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Properties
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* STATUS */}

                  <Field label="Status">
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
                        <span className="truncate">{selectedStatus.label}</span>

                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          {taskStatusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() =>
                                updateForm("status", option.value as TaskStatus)
                              }
                            >
                              <span className="flex-1">{option.label}</span>

                              {form.status === option.value ? (
                                <Check className="size-4 text-primary" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Field>

                  {/* PRIORITY */}

                  <Field label="Priority">
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
                        <span className="truncate">
                          {selectedPriority.label}
                        </span>

                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          {taskPriorityOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() =>
                                updateForm(
                                  "priority",
                                  option.value as TaskPriority,
                                )
                              }
                            >
                              <span className="flex-1">{option.label}</span>

                              {form.priority === option.value ? (
                                <Check className="size-4 text-primary" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Field>

                  {/* ASSIGNEE */}

                  <Field label="Assignee">
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

                            <span className="truncate">
                              {selectedAssignee.name}
                            </span>
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
                          <DropdownMenuItem
                            onClick={() => updateForm("assigneeId", null)}
                          >
                            <span className="flex-1">Unassigned</span>

                            {!form.assigneeId ? (
                              <Check className="size-4 text-primary" />
                            ) : null}
                          </DropdownMenuItem>

                          {resolvedData.users.map((user) => (
                            <DropdownMenuItem
                              key={user.id}
                              onClick={() => updateForm("assigneeId", user.id)}
                            >
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>

                              <span className="min-w-0 flex-1 truncate">
                                {user.name}
                              </span>

                              {form.assigneeId === user.id ? (
                                <Check className="size-4 text-primary" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Field>

                  {/* SPRINT */}

                  <Field label="Sprint">
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
                            selectedSprint
                              ? "truncate"
                              : "truncate text-muted-foreground"
                          }
                        >
                          {selectedSprint?.name ?? "No sprint"}
                        </span>

                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => updateForm("sprintId", null)}
                          >
                            <span className="flex-1">No sprint</span>

                            {!form.sprintId ? (
                              <Check className="size-4 text-primary" />
                            ) : null}
                          </DropdownMenuItem>

                          {availableSprints.map((sprint) => (
                            <DropdownMenuItem
                              key={sprint.id}
                              onClick={() => updateForm("sprintId", sprint.id)}
                            >
                              <span className="flex-1">{sprint.name}</span>

                              {form.sprintId === sprint.id ? (
                                <Check className="size-4 text-primary" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Field>

                  {/* ESTIMATE */}

                  <Field label="Estimate">
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
                            selectedEstimate ? "" : "text-muted-foreground"
                          }
                        >
                          {selectedEstimate?.label ?? "No estimate"}
                        </span>

                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => updateForm("estimateMinutes", null)}
                          >
                            No estimate
                          </DropdownMenuItem>

                          {taskEstimateOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() =>
                                updateForm("estimateMinutes", option.value)
                              }
                            >
                              <span className="flex-1">{option.label}</span>

                              {form.estimateMinutes === option.value ? (
                                <Check className="size-4 text-primary" />
                              ) : null}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Field>

                  {/* DUE DATE */}

                  <Field label="Due date">
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
                            form.dueDate
                              ? "truncate"
                              : "truncate text-muted-foreground"
                          }
                        >
                          {form.dueDate
                            ? formatDate(form.dueDate)
                            : "Select date"}
                        </span>
                      </PopoverTrigger>

                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.dueDate ?? undefined}
                          onSelect={(date) =>
                            updateForm("dueDate", date ?? null)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              </section>

              {/* =================================================
                  LABELS
              ================================================== */}

              <Field label="Labels">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-9 h-auto w-full justify-between gap-2 px-3 py-1.5 font-normal"
                      />
                    }
                  >
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                      {form.labelIds.length === 0 ? (
                        <span className="text-muted-foreground">
                          Add labels...
                        </span>
                      ) : (
                        form.labelIds.map((labelId) => {
                          const label = resolvedData.labels.find(
                            (item) => item.id === labelId,
                          );

                          if (!label) {
                            return null;
                          }

                          return (
                            <span
                              key={label.id}
                              className="inline-flex h-6 items-center rounded-sm bg-accent px-2 text-xs font-medium text-accent-foreground"
                            >
                              {label.name}
                            </span>
                          );
                        })
                      )}
                    </div>

                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="min-w-56">
                    <DropdownMenuGroup>
                      {resolvedData.labels.map((label) => {
                        const selected = form.labelIds.includes(label.id);

                        return (
                          <DropdownMenuItem
                            key={label.id}
                            onSelect={(event) => event.preventDefault()}
                            onClick={() => toggleLabel(label.id)}
                          >
                            <Checkbox
                              checked={selected}
                              tabIndex={-1}
                              aria-hidden="true"
                            />

                            <span className="flex-1">{label.name}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>

              {/* =================================================
                  SUBTASKS
              ================================================== */}

              <Field label="Subtasks">
                <div className="space-y-2">
                  {form.subtasks.map((subtask, index) => (
                    <div
                      key={`${subtask.position}-${subtask.title}`}
                      className="flex h-9 items-center gap-2 rounded-md border border-border px-3"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />

                      <span className="min-w-0 flex-1 truncate text-sm">
                        {subtask.title}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${subtask.title}`}
                        onClick={() => removeSubtask(index)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newSubtask}
                      placeholder="Add a subtask..."
                      className="min-w-0 flex-1"
                      onChange={(event) => setNewSubtask(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSubtask();
                        }
                      }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="shrink-0 gap-1.5"
                      disabled={!newSubtask.trim()}
                      onClick={addSubtask}
                    >
                      <Plus className="size-4" />

                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </div>
                </div>
              </Field>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border bg-background px-5 py-3 sm:px-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={createAnother}
                onCheckedChange={(checked) =>
                  setCreateAnother(checked === true)
                }
              />

              <span>Create another</span>
            </label>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!form.projectId || !form.title.trim() || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create task"}
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
