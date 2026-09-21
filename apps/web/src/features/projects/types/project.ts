export type ProjectStatus =
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "ON_TRACK"
  | "BLOCKED";

export type ProjectAccent =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "muted";

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
  accent: ProjectAccent;
}

export type ProjectTaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type ProjectTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ProjectTaskSummary {
  id: string;
  title: string;
  description?: string;

  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;

  assignee: {
    id: string;
    name: string;
    initials: string;
  };

  label?: string;
  dueDate: string;

  completedSubtasks?: number;
  totalSubtasks?: number;

  comments?: number;
  attachments?: number;

  pullRequest?: number;
  sprint?: string;
  estimate?: string;
}

export interface ProjectActivityItem {
  id: string;
  message: string;
  actor: ProjectMember;
  createdAt: string;
}

export interface ProjectDeadline {
  id: string;
  title: string;
  date: string;
}

export interface ProjectDetails extends Project {
  goal: string;

  startDate: string;
  endDate: string;

  owner: ProjectMember;
  lead: ProjectMember;

  createdAt: string;
  updatedAt: string;

  completedTasks: number;
  totalTasks: number;

  repositoryUrl: string;
  defaultBranch: string;

  recentTasks: ProjectTaskSummary[];
  recentActivity: ProjectActivityItem[];
  upcomingDeadlines: ProjectDeadline[];
}
