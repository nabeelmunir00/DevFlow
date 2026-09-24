export type MyWorkView = "assigned" | "created" | "following";

export type MyWorkLayout = "list" | "board";

export type MyWorkTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

export type MyWorkTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type MyWorkTaskGroup = "OVERDUE" | "TODAY" | "UPCOMING";

export interface MyWorkProject {
  id: string;
  name: string;
  shortName: string;
  accent: "primary" | "info" | "success" | "warning";
  taskCount: number;
}

export interface MyWorkTask {
  id: string;
  key: string;
  title: string;
  projectId: string;

  views: MyWorkView[];

  status: MyWorkTaskStatus;
  priority: MyWorkTaskPriority;
  group: MyWorkTaskGroup;

  dueDate: string;
  dueLabel: string;
  estimate: string;
  planned: boolean;
  selected?: boolean;
}

export type TodayEventType = "REVIEW" | "DEADLINE";

export interface TodayEvent {
  id: string;
  type: TodayEventType;
  label: string;
  taskKey: string;
  title: string;
  meta: string;
  projectId?: string;
}

export interface MyWorkProgress {
  completed: number;
  inProgress: number;
  remaining: number;
  totalPlanned: number;
  percentage: number;
}

export type FocusSessionStatus = "ACTIVE" | "PAUSED";

export interface FocusSessionState {
  taskId: string;
  status: FocusSessionStatus;

  startedAt: number;
  accumulatedSeconds: number;

  pausedAt: number | null;
}
