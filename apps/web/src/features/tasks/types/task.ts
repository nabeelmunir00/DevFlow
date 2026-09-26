export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/* =========================================================
   SHARED TASK ENTITIES
========================================================= */

export interface TaskProject {
  id: string;
  name: string;
  key: string;
}

export interface TaskUser {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string | null;
}

export interface TaskSprint {
  id: string;
  projectId: string;
  name: string;
}

export interface TaskLabel {
  id: string;
  name: string;
}

export interface TaskSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  position: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAttachment {
  id: string;

  fileName: string;
  mimeType: string;
  fileSize: number;

  /**
   * This can later be a signed/public download URL returned
   * by the API. We should not expose the raw storage key
   * throughout the UI.
   */
  url?: string;

  uploadedBy?: TaskUser;

  createdAt: string;
}

export interface TaskComment {
  id: string;
  content: string;

  author: TaskUser;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
}

/* =========================================================
   COMPLETE TASK DOMAIN
========================================================= */

export interface Task {
  id: string;

  organizationId: string;

  projectId: string;
  sprintId: string | null;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  position: number;

  estimateMinutes: number | null;
  dueDate: string | null;

  completedAt: string | null;
  archivedAt: string | null;

  createdAt: string;
  updatedAt: string;

  reporter: TaskUser;
  assignee: TaskUser | null;

  project?: TaskProject;
  sprint?: TaskSprint | null;

  labels: TaskLabel[];
  subtasks: TaskSubtask[];

  attachments?: TaskAttachment[];
  comments?: TaskComment[];

  attachmentCount?: number;
  commentCount?: number;
}

/* =========================================================
   CREATE TASK
========================================================= */

export interface CreateTaskSubtaskInput {
  title: string;
  position: number;
}

/**
 * Domain-level form value used by the Create Task UI.
 *
 * Files are intentionally included here because they belong
 * to the UI workflow, even if the API later uploads them
 * through a separate endpoint.
 */
export interface CreateTaskInput {
  projectId: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  assigneeId: string | null;
  sprintId: string | null;

  estimateMinutes: number | null;
  dueDate: Date | null;

  labelIds: string[];

  subtasks: CreateTaskSubtaskInput[];

  attachments: File[];
}

/* =========================================================
   CREATE TASK DIALOG DATA
========================================================= */

export interface CreateTaskDialogData {
  projects: TaskProject[];
  users: TaskUser[];
  sprints: TaskSprint[];
  labels: TaskLabel[];
}

/* =========================================================
   CREATE TASK DIALOG PROPS
========================================================= */

export interface CreateTaskDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  /**
   * Used when opening the dialog from a project-scoped page.
   *
   * Example:
   * /workspace/project/project-1
   */
  defaultProjectId?: string;

  /**
   * Allows us to use demo data now and API data later
   * without rewriting the dialog.
   */
  data?: Partial<CreateTaskDialogData>;

  onCreate?: (input: CreateTaskInput) => void | Promise<void>;
}

/* =========================================================
   EMPTY CREATE FORM
========================================================= */

export function createEmptyTaskInput(projectId = ""): CreateTaskInput {
  return {
    projectId,

    title: "",
    description: "",

    status: "TODO",
    priority: "MEDIUM",

    assigneeId: null,
    sprintId: null,

    estimateMinutes: null,
    dueDate: null,

    labelIds: [],

    subtasks: [],

    attachments: [],
  };
}
