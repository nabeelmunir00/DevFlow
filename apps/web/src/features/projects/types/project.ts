export type ProjectStatus =
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "ON_TRACK"
  | "BLOCKED";

export interface ProjectMember {
  id: string;
  name: string;
  initials: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  status: ProjectStatus;
  members: ProjectMember[];
  progress: number;
  openTasks: number;
  sprint: string;
  dueDate: string;
  repository: string;
  accent: "primary" | "info" | "success" | "warning" | "destructive" | "muted";
}
