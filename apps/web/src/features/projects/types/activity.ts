export type ProjectActivityCategory =
  | "TASK"
  | "PULL_REQUEST"
  | "COMMENT"
  | "SPRINT";

export type ProjectActivityType =
  | "TASK_UPDATED"
  | "TASK_COMPLETED"
  | "PULL_REQUEST_REVIEW"
  | "COMMITS_PUSHED"
  | "COMMENT_ADDED"
  | "SPRINT_STARTED";

export interface ActivityMember {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface ActivityStatus {
  label: string;
  tone: "default" | "primary" | "success" | "warning";
}

export interface ActivityComment {
  id: string;
  author: ActivityMember;
  message: string;
  createdAt: string;
}

export interface ProjectActivityItem {
  id: string;
  category: ProjectActivityCategory;
  type: ProjectActivityType;

  actor: ActivityMember;

  message: string;

  target?: {
    label: string;
    href?: string;
  };

  description?: string;

  createdAt: string;

  fromStatus?: ActivityStatus;
  toStatus?: ActivityStatus;

  commits?: string[];

  comment?: ActivityComment;
}

export interface ProjectActivityGroup {
  id: string;
  label: string;
  activities: ProjectActivityItem[];
}
