export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface CreateTaskProject {
  id: string;
  name: string;
  key: string;
}

export interface CreateTaskAssignee {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string;
  initials?: string;
}

export interface CreateTaskSprint {
  id: string;
  name: string;
  projectId: string;
}

export interface CreateTaskLabel {
  id: string;
  name: string;
}

export interface CreateTaskEstimate {
  value: number;
  label: string;
}

export interface CreateTaskSubtaskInput {
  id: string;
  title: string;
}

export interface CreateTaskInput {
  projectId: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  assigneeId: string | null;
  sprintId: string | null;

  estimate: number | null;
  dueDate: Date | null;

  labelIds: string[];

  subtasks: CreateTaskSubtaskInput[];

  attachments: File[];
}

export interface CreateTaskDialogData {
  projects: CreateTaskProject[];
  assignees: CreateTaskAssignee[];
  sprints: CreateTaskSprint[];
  labels: CreateTaskLabel[];
}

export interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
  data?: Partial<CreateTaskDialogData>;

  onCreate?: (task: CreateTaskInput) => void | Promise<void>;
}
