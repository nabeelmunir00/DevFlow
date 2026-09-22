export type GitHubConnectionStatus =
  | "CONNECTED"
  | "SYNCING"
  | "ERROR"
  | "DISCONNECTED";

export type GitHubPullRequestState = "OPEN" | "MERGED" | "CLOSED";

export type GitHubReviewStatus =
  | "NEEDS_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "DRAFT";

export type GitHubIssueState = "OPEN" | "CLOSED";

export interface GitHubRepositorySummary {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  defaultBranch: string;
  isPrivate: boolean;
  isArchived: boolean;
}

export interface GitHubPullRequestAuthor {
  login: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface GitHubPullRequestSummary {
  id: string;
  number: number;
  title: string;
  state: GitHubPullRequestState;
  isDraft: boolean;

  author: GitHubPullRequestAuthor;

  headRef: string;
  baseRef: string;

  reviewStatus: GitHubReviewStatus;

  additions: number;
  deletions: number;
  changedFiles: number;
  commitsCount: number;

  linkedTask: {
    id: string;
    key: string;
    title: string;
  } | null;

  htmlUrl: string;
  updatedAt: string;
}

export interface GitHubLinkedIssue {
  id: string;
  number: number;
  title: string;
  state: GitHubIssueState;
  htmlUrl: string;

  linkedTask: {
    id: string;
    key: string;
    title: string;
  };
}

export type GitHubActivityType =
  | "PR_APPROVED"
  | "PR_CHANGES_REQUESTED"
  | "PR_COMMITS_PUSHED";

export interface GitHubActivity {
  id: string;
  type: GitHubActivityType;

  actor: {
    login: string;
    name: string;
    initials: string;
    avatarUrl?: string;
  };

  pullRequestNumber: number;
  message: string;
  detail?: string;
  createdAt: string;
}

export interface ProjectGitHubData {
  connectionStatus: GitHubConnectionStatus;
  lastSyncedAt: string | null;

  repository: GitHubRepositorySummary;

  stats: {
    openPullRequests: number;
    linkedIssues: number;
    commitsThisWeek: number;
  };

  pullRequestCounts: {
    open: number;
    merged: number;
    closed: number;
  };

  pullRequests: GitHubPullRequestSummary[];

  linkedIssues: GitHubLinkedIssue[];

  recentActivity: GitHubActivity[];
}
