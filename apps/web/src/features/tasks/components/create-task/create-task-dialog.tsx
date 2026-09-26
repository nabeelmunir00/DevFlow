"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";

import { resolveCreateTaskData } from "../../data/create-task-data";
import {
  createEmptyTaskInput,
  type CreateTaskDialogProps,
  type CreateTaskInput,
} from "../../types/task";

import { TaskDescriptionEditor } from "./task-description-editor";
import { TaskLabelSelector } from "./task-label-selector";
import { TaskProperties } from "./task-properties";
import { TaskSubtasks } from "./task-subtasks";

/* =========================================================
   FIELD
========================================================= */

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ label, required = false, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-meta text-foreground">
        {label}

        {required ? (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* =========================================================
   CREATE TASK DIALOG
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const selectedProject = resolvedData.projects.find(
    (project) => project.id === form.projectId,
  );

  const projectError =
    submitAttempted && !form.projectId ? "Select a project." : undefined;

  const titleError =
    submitAttempted && !form.title.trim()
      ? "Task title is required."
      : undefined;

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  function updateForm<K extends keyof CreateTaskInput>(
    key: K,
    value: CreateTaskInput[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  /* =======================================================
     RESET
  ======================================================= */

  function resetForm(projectId = initialProjectId) {
    setForm(createEmptyTaskInput(projectId));
    setSubmitAttempted(false);
  }

  /* =======================================================
     DIALOG
  ======================================================= */

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
      setCreateAnother(false);
    }

    onOpenChange(nextOpen);
  }

  /* =======================================================
     PROJECT
  ======================================================= */

  function handleProjectChange(projectId: string) {
    setForm((current) => ({
      ...current,

      projectId,

      /*
       * Sprint belongs to a project.
       * Changing project therefore invalidates the
       * currently selected sprint.
       */
      sprintId: null,
    }));
  }

  /* =======================================================
     ATTACHMENTS
  ======================================================= */

  function handleAddAttachments(files: File[]) {
    if (!files.length) return;

    setForm((current) => ({
      ...current,

      attachments: [...current.attachments, ...files],
    }));
  }

  function handleRemoveAttachment(index: number) {
    setForm((current) => ({
      ...current,

      attachments: current.attachments.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setSubmitAttempted(true);

    const title = form.title.trim();

    if (!form.projectId || !title) {
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

      /*
       * When "Create another" is enabled we preserve
       * the selected project. This makes bulk task
       * creation much faster.
       */
      if (createAnother) {
        resetForm(form.projectId);
        return;
      }

      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

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
                  Add a new task to your project. Fill in the details and assign
                  it to your team.
                </DialogDescription>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label="Close create task dialog"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                <X className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
          </DialogHeader>

          {/* =================================================
              CONTENT
          ================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 px-5 py-5 sm:px-6">
              {/* =============================================
                  PROJECT
              ============================================== */}

              <Field label="Project" required error={projectError}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        aria-invalid={projectError ? true : undefined}
                        className="h-9 w-full justify-between px-3 font-normal"
                      />
                    }
                  >
                    {selectedProject ? (
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
                          {selectedProject.key}
                        </span>

                        <span className="min-w-0 truncate">
                          {selectedProject.name}
                        </span>
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
                            className={
                              selected
                                ? "bg-accent text-accent-foreground"
                                : undefined
                            }
                            onClick={() => handleProjectChange(project.id)}
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-primary-foreground">
                              {project.key}
                            </span>

                            <span className="min-w-0 flex-1 truncate">
                              {project.name}
                            </span>

                            {selected ? (
                              <Check
                                className="size-4 text-primary"
                                strokeWidth={1.75}
                              />
                            ) : null}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>

              {/* =============================================
                  TITLE
              ============================================== */}

              <Field label="Task title" required error={titleError}>
                <Input
                  autoFocus
                  value={form.title}
                  maxLength={255}
                  aria-invalid={titleError ? true : undefined}
                  placeholder="Add workspace access controls"
                  onChange={(event) => updateForm("title", event.target.value)}
                />
              </Field>

              {/* =============================================
                  DESCRIPTION + ATTACHMENTS
              ============================================== */}

              <Field label="Description">
                <TaskDescriptionEditor
                  value={form.description}
                  attachments={form.attachments}
                  onChange={(description) =>
                    updateForm("description", description)
                  }
                  onAddAttachments={handleAddAttachments}
                  onRemoveAttachment={handleRemoveAttachment}
                  onAskAI={() => {
                    /*
                     * DevFlow AI integration will be
                     * connected here later.
                     */
                  }}
                />
              </Field>

              {/* =============================================
                  PROPERTIES
              ============================================== */}

              <TaskProperties
                form={form}
                data={resolvedData}
                onChange={updateForm}
              />

              {/* =============================================
                  LABELS
              ============================================== */}

              <Field label="Labels">
                <TaskLabelSelector
                  labels={resolvedData.labels}
                  value={form.labelIds}
                  onChange={(labelIds) => updateForm("labelIds", labelIds)}
                />
              </Field>

              {/* =============================================
                  SUBTASKS
              ============================================== */}

              <Field label="Subtasks">
                <TaskSubtasks
                  value={form.subtasks}
                  onChange={(subtasks) => updateForm("subtasks", subtasks)}
                />
              </Field>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border bg-background px-5 py-3 sm:px-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={createAnother}
                disabled={isSubmitting}
                onCheckedChange={setCreateAnother}
              />

              <span>Create another</span>
            </label>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
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
