"use client";

import {
  Bold,
  CalendarDays,
  ChevronDown,
  Code2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import type {
  ProjectDetails,
  ProjectMember,
  ProjectTaskPriority,
  ProjectTaskStatus,
  ProjectTaskSummary,
} from "../../../types/project";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDetails;
  onCreateTask: (task: ProjectTaskSummary) => void;
}

interface SelectOption<T extends string> {
  value: T;
  label: string;
  dot?: string;
}

const statusOptions: SelectOption<ProjectTaskStatus>[] = [
  {
    value: "TODO",
    label: "To do",
    dot: "bg-muted-foreground",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    dot: "bg-primary",
  },
  {
    value: "IN_REVIEW",
    label: "In review",
    dot: "bg-warning",
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-success",
  },
];

const priorityOptions: SelectOption<ProjectTaskPriority>[] = [
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

const sprintOptions = ["Sprint 04", "Sprint 05", "Sprint 06", "Backlog"];

const labelOptions = [
  "frontend",
  "backend",
  "accessibility",
  "bug",
  "enhancement",
  "design",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDueDate(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
  }).format(date);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[7rem_minmax(0,1fr)] md:items-start">
      <label className="pt-2 text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AddTaskDialog({
  open,
  onOpenChange,
  project,
  onCreateTask,
}: AddTaskDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAssignee = project.members[0] ?? project.owner;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectTaskStatus>("TODO");
  const [priority, setPriority] = useState<ProjectTaskPriority>("MEDIUM");
  const [assignee, setAssignee] = useState<ProjectMember>(defaultAssignee);
  const [sprint, setSprint] = useState(project.sprint || "Sprint 06");
  const [dueDate, setDueDate] = useState("");
  const [estimate, setEstimate] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [createAnother, setCreateAnother] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setAssignee(defaultAssignee);
    setSprint(project.sprint || "Sprint 06");
    setDueDate("");
    setEstimate("");
    setLabels([]);
    setSubtasks([]);
    setNewSubtask("");
    setFiles([]);
  }

  useEffect(() => {
    if (!open) {
      resetForm();
      setCreateAnother(false);
    }
  }, [open]);

  function toggleLabel(label: string) {
    setLabels((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function addSubtask() {
    const value = newSubtask.trim();

    if (!value) {
      return;
    }

    setSubtasks((current) => [...current, value]);
    setNewSubtask("");
  }

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) {
      return;
    }

    const acceptedFiles = Array.from(selectedFiles).filter(
      (file) =>
        ["image/png", "application/pdf"].includes(file.type) &&
        file.size <= 10 * 1024 * 1024,
    );

    setFiles((current) => [...current, ...acceptedFiles]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !assignee) {
      return;
    }

    const taskNumber = 100 + Math.floor(Math.random() * 900);

    const task: ProjectTaskSummary = {
      id: `${project.key}-${taskNumber}`,
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      assignee,
      sprint,
      dueDate: formatDueDate(dueDate) || "No date",
      estimate: estimate.trim() || "—",
      label: labels[0],
      completedSubtasks: 0,
      totalSubtasks: subtasks.length,
      comments: 0,
      attachments: files.length,
    };

    onCreateTask(task);

    if (createAnother) {
      resetForm();
      return;
    }

    onOpenChange(false);
  }

  const selectedStatus =
    statusOptions.find((option) => option.value === status) ?? statusOptions[0];

  const selectedPriority =
    priorityOptions.find((option) => option.value === priority) ??
    priorityOptions[1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] overflow-hidden p-0 sm:max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">Create task</DialogTitle>

                <DialogDescription className="mt-1">
                  Add a task to your project.
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline-flex">
                  Esc
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close create task dialog"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <Field label="Project">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-between px-3 font-normal"
                  disabled
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                      {project.key}
                    </span>

                    <span className="truncate">
                      {project.name} ({project.key})
                    </span>
                  </span>

                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </Field>

              <Field label="Task title">
                <Input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter task title"
                  className="h-11"
                />
              </Field>

              <Field label="Description">
                <div className="overflow-hidden rounded-md border border-border bg-background">
                  <div className="flex min-h-12 flex-wrap items-center gap-1 border-b border-border px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Bold"
                    >
                      <Bold className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Italic"
                    >
                      <Italic className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Bullet list"
                    >
                      <List className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Numbered list"
                    >
                      <ListOrdered className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Code"
                    >
                      <Code2 className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Link"
                    >
                      <Link2 className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-2 text-primary"
                    >
                      <Sparkles className="size-4" />
                      Improve with AI
                    </Button>
                  </div>

                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe this task..."
                    className="min-h-24 w-full resize-none bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Status">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full justify-between font-normal"
                        />
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`size-3 rounded-full ${selectedStatus.dot}`}
                        />
                        {selectedStatus.label}
                      </span>

                      <ChevronDown className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {statusOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setStatus(option.value)}
                          >
                            <span
                              className={`size-2.5 rounded-full ${option.dot}`}
                            />
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field label="Priority">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full justify-between font-normal"
                        />
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`size-3 rounded-full ${selectedPriority.dot}`}
                        />
                        {selectedPriority.label}
                      </span>

                      <ChevronDown className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {priorityOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setPriority(option.value)}
                          >
                            <span
                              className={`size-2.5 rounded-full ${option.dot}`}
                            />
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field label="Assignee">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full justify-between font-normal"
                        />
                      }
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-xs">
                            {assignee.initials || getInitials(assignee.name)}
                          </AvatarFallback>
                        </Avatar>

                        <span className="truncate">{assignee.name}</span>
                      </span>

                      <ChevronDown className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {project.members.map((member) => (
                          <DropdownMenuItem
                            key={member.id}
                            onClick={() => setAssignee(member)}
                          >
                            <Avatar className="size-6">
                              <AvatarFallback className="text-xs">
                                {member.initials || getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>

                            {member.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field label="Sprint">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full justify-between font-normal"
                        />
                      }
                    >
                      {sprint}

                      <ChevronDown className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {sprintOptions.map((option) => (
                          <DropdownMenuItem
                            key={option}
                            onClick={() => setSprint(option)}
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field label="Due date">
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      className="h-11 pl-9"
                    />
                  </div>
                </Field>

                <Field label="Estimate">
                  <Input
                    value={estimate}
                    onChange={(event) => setEstimate(event.target.value)}
                    placeholder="3 points"
                    className="h-11"
                  />
                </Field>
              </div>

              <Field label="Labels">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex min-h-11 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-left text-sm"
                      />
                    }
                  >
                    <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                      {labels.length === 0 ? (
                        <span className="text-muted-foreground">
                          Add labels
                        </span>
                      ) : (
                        labels.map((label) => (
                          <span
                            key={label}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-muted px-2 text-xs"
                          >
                            {label}

                            <X className="size-3" aria-hidden="true" />
                          </span>
                        ))
                      )}
                    </div>

                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      {labelOptions.map((label) => (
                        <DropdownMenuItem
                          key={label}
                          onClick={() => toggleLabel(label)}
                          onSelect={(event) => event.preventDefault()}
                        >
                          <Checkbox
                            checked={labels.includes(label)}
                            aria-hidden="true"
                            tabIndex={-1}
                          />
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  Add labels to categorize this task.
                </p>
              </Field>

              <Field label="Subtasks">
                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <div
                      key={`${subtask}-${index}`}
                      className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm"
                    >
                      <Checkbox disabled />

                      <span className="min-w-0 flex-1 truncate">{subtask}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                          setSubtasks((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={newSubtask}
                      onChange={(event) => setNewSubtask(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSubtask();
                        }
                      }}
                      placeholder="Subtask title"
                      className="h-9 min-w-48 flex-1"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2"
                      onClick={addSubtask}
                    >
                      <Plus className="size-4" />
                      Add subtask
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 text-primary"
                    >
                      <Sparkles className="size-4" />
                      Suggest with AI
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Break this task into smaller steps.
                  </p>
                </div>
              </Field>

              <Field label="Attach files">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.pdf,image/png,application/pdf"
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                />

                <button
                  type="button"
                  className="flex min-h-20 w-full items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/20 px-4 text-left transition-colors hover:bg-muted/40"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="size-5 shrink-0" />

                  <span>
                    <span className="text-sm text-primary">Choose files</span>

                    <span className="text-sm text-muted-foreground">
                      {" "}
                      or drag and drop
                    </span>

                    <span className="block text-xs text-muted-foreground">
                      PNG, PDF up to 10MB
                    </span>
                  </span>
                </button>

                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Paperclip className="size-3.5" />

                        <span className="min-w-0 flex-1 truncate">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setFiles((current) =>
                              current.filter(
                                (_, fileIndex) => fileIndex !== index,
                              ),
                            )
                          }
                          className="hover:text-foreground"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={createAnother}
                onCheckedChange={(checked) =>
                  setCreateAnother(checked === true)
                }
              />
              Create another
            </label>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!title.trim()}>
                Create task
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
