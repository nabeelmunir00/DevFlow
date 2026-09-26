import type {
  TaskLabel,
  TaskPriority,
  TaskProject,
  TaskSprint,
  TaskStatus,
  TaskUser,
} from "../types/task";

export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
}

export interface TaskPriorityOption {
  value: TaskPriority;
  label: string;
}

export interface TaskEstimateOption {
  value: number;
  label: string;
}

/* =========================================================
   PROJECTS
========================================================= */

export const createTaskProjects: TaskProject[] = [
  {
    id: "project-1",
    name: "DevFlow Web",
    key: "DF",
  },
  {
    id: "project-2",
    name: "API Platform",
    key: "API",
  },
  {
    id: "project-3",
    name: "Design System",
    key: "DS",
  },
];

/* =========================================================
   USERS
========================================================= */

export const createTaskUsers: TaskUser[] = [
  {
    id: "user-1",
    name: "Nabeel Munir",
    email: "nabeel@devflow.io",
  },
  {
    id: "user-2",
    name: "Alex Morgan",
    email: "alex@devflow.io",
  },
  {
    id: "user-3",
    name: "Sarah Chen",
    email: "sarah@devflow.io",
  },
  {
    id: "user-4",
    name: "Daniel Kim",
    email: "daniel@devflow.io",
  },
];

/* =========================================================
   SPRINTS
========================================================= */

export const createTaskSprints: TaskSprint[] = [
  {
    id: "sprint-06",
    projectId: "project-1",
    name: "Sprint 06",
  },
  {
    id: "sprint-07",
    projectId: "project-1",
    name: "Sprint 07",
  },
  {
    id: "api-sprint-03",
    projectId: "project-2",
    name: "Sprint 03",
  },
  {
    id: "api-sprint-04",
    projectId: "project-2",
    name: "Sprint 04",
  },
  {
    id: "design-sprint-02",
    projectId: "project-3",
    name: "Sprint 02",
  },
];

/* =========================================================
   LABELS
========================================================= */

export const createTaskLabels: TaskLabel[] = [
  {
    id: "backend",
    name: "Backend",
  },
  {
    id: "frontend",
    name: "Frontend",
  },
  {
    id: "security",
    name: "Security",
  },
  {
    id: "bug",
    name: "Bug",
  },
  {
    id: "design",
    name: "Design",
  },
  {
    id: "accessibility",
    name: "Accessibility",
  },
];

/* =========================================================
   STATUS
========================================================= */

export const taskStatusOptions: TaskStatusOption[] = [
  {
    value: "TODO",
    label: "Todo",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
  },
  {
    value: "IN_REVIEW",
    label: "In review",
  },
  {
    value: "DONE",
    label: "Done",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

/* =========================================================
   PRIORITY
========================================================= */

export const taskPriorityOptions: TaskPriorityOption[] = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
];

/* =========================================================
   ESTIMATES

   Backend stores estimateMinutes.
========================================================= */

export const taskEstimateOptions: TaskEstimateOption[] = [
  {
    value: 30,
    label: "30m",
  },
  {
    value: 60,
    label: "1h",
  },
  {
    value: 120,
    label: "2h",
  },
  {
    value: 240,
    label: "4h",
  },
  {
    value: 480,
    label: "1d",
  },
];

import type { CreateTaskDialogData } from "../types/task";

export const defaultCreateTaskData: CreateTaskDialogData = {
  projects: createTaskProjects,
  users: createTaskUsers,
  sprints: createTaskSprints,
  labels: createTaskLabels,
};

export function resolveCreateTaskData(
  data?: Partial<CreateTaskDialogData>,
): CreateTaskDialogData {
  return {
    projects: data?.projects ?? defaultCreateTaskData.projects,

    users: data?.users ?? defaultCreateTaskData.users,

    sprints: data?.sprints ?? defaultCreateTaskData.sprints,

    labels: data?.labels ?? defaultCreateTaskData.labels,
  };
}
